(function(){
  // -------------------------------------------------------------------
  // LIVING ECONOMY -- the market now answers to what you do and what is
  // happening in the port.
  //
  //  1. SUPPLY AND DEMAND. Selling a lot of one good at a port pushes its
  //     price down there, buying a lot pushes it up. A bulk sale or purchase
  //     is priced across the whole batch (the first unit at today's price, the
  //     last at the price after the rest), and the pressure fades by about 15%
  //     a day, so dumping a hold is possible but costs you, and the port
  //     recovers. Scaled to your hold, so a full hold of one good moves the
  //     price roughly a quarter, not to nothing.
  //  2. PORT EVENTS. Each port, every eight days, has about a 28% chance of an
  //     event: famine (food dear), festival (luxuries dear), glut or bumper
  //     harvest (a good cheap), or a pirate blockade (everything dearer AND
  //     sailing there is more dangerous). Events at the port you are in are
  //     shown in the market intel; listening for rumors in the tavern tells you
  //     about up to two events elsewhere, so you can plan a route around them.
  //  Prices are computed in price-book.js (marketPriceMods); this file adds
  //  the multipliers.
  // -------------------------------------------------------------------
  function hash(n){
    let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16;
    return ((x >>> 0) % 100000) / 100000;
  }
  function seedOf(s){ let h = 5; String(s).split('').forEach(function(c){ h = (h * 33 + c.charCodeAt(0)) | 0; }); return h; }
  const EVENT_DAYS = 8;
  const TYPES = [
    { id:'famine',   name:'Famine',          icon:'🥀', mult:1.7, goods:['rice','fruits','dried_fruit','smoked_fish'], line:'Hungry town: food sells dear.' },
    { id:'festival', name:'Festival',        icon:'🎉', mult:1.4, goods:['silk','rum','pearls','tea','lamp_oil'],      line:'Festival crowds are buying luxuries.' },
    { id:'glut',     name:'Glut',            icon:'📦', mult:0.6, goods:null,                                           line:'Warehouses overflowing: a good goes cheap.' },
    { id:'bumper',   name:'Bumper harvest',  icon:'🌾', mult:0.6, goods:['rice','fruits','tea','salt','dried_fruit'],  line:'A bumper harvest floods the market.' },
    { id:'blockade', name:'Pirate blockade', icon:'🏴‍☠️', mult:1.25, goods:'all',                                         line:'Pirates choke the lanes: everything is scarce, and sailing here is dangerous.', route:1.6 }
  ];
  function eligiblePorts(){
    return PORTS.filter(function(p){ return p.id !== 'fair_tide'; });
  }
  function eventFor(portId, day){
    day = Math.floor(Number(day) || 0);
    const slot = Math.floor(day / EVENT_DAYS), seed = seedOf(portId);
    if (hash(seed + slot * 53) > 0.28) return null;
    const type = TYPES[Math.floor(hash(seed + slot * 71 + 1) * TYPES.length) % TYPES.length];
    const port = PORTS.find(function(p){ return p.id === portId; });
    let good = null;
    if (type.goods === 'all') good = null;
    else {
      const pool = (type.goods || (port && port.specialties) || []).filter(function(g){ return GOODS[g] && g !== 'contraband'; });
      if (!pool.length) return null;
      good = pool[Math.floor(hash(seed + slot * 97 + 2) * pool.length) % pool.length];
    }
    return { type: type, good: good, left: EVENT_DAYS - (day % EVENT_DAYS), key: portId + ':' + slot };
  }
  window.marketEventFor = eventFor;

  // ---- supply and demand ----
  function liquidity(){ return Math.max(40, Number(game.cargoCapacity) || 100); }
  function rec(portId, goodId){ game.marketPressure = game.marketPressure || {}; game.marketPressure[portId] = game.marketPressure[portId] || {}; return game.marketPressure[portId][goodId]; }
  function pressureNow(portId, goodId, day){
    const r = rec(portId, goodId); if (!r) return 0;
    return r.p * Math.pow(0.85, Math.max(0, day - r.day));
  }
  function mult(p){ return p >= 0 ? 1 - 0.4 * (1 - Math.exp(-p)) : 1 + 0.4 * (1 - Math.exp(p)); }   // p>0: oversupplied (cheaper)
  window.marketPriceMods = function(portId, goodId, day){
    let m = 1;
    const ev = eventFor(portId, day);
    if (ev && (ev.good === null || ev.good === goodId)) m *= ev.type.mult;
    if (goodId !== 'contraband') m *= mult(pressureNow(portId, goodId, day));
    return m;
  };
  // Sailing to a blockaded port is more dangerous.
  window.seaRouteHostility = function(portId, day){
    const ev = eventFor(portId, day);
    return ev && ev.type.route ? ev.type.route : 1;
  };

  function avgMult(p0, n, dir, L){
    const steps = Math.max(1, Math.min(n, 120)); let s = 0;
    for (let i = 0; i < steps; i++) s += mult(p0 + dir * (((i + 0.5) / steps) * n) / L);
    return s / steps;
  }
  function wrapTrade(name, dir){
    const old = window[name];
    if (typeof old !== 'function') return;
    window[name] = function(goodId, qty){
      const loc = game.location, row = game.marketPrices && game.marketPrices[loc];
      if (!row || !row[goodId] || goodId === 'contraband') return old.apply(this, arguments);
      const before = Number((game.cargo || {})[goodId] || 0);
      const p0 = pressureNow(loc, goodId, game.day), cur = mult(p0), L = liquidity();
      const base = row[goodId] / cur;                                   // today's price without the pressure
      const want = dir > 0 ? Math.min(qty, before) : qty;
      if (want <= 0) return old.apply(this, arguments);
      row[goodId] = Math.max(1, Math.round(base * avgMult(p0, want, dir, L)));   // the batch is priced across its own impact
      let r;
      try { r = old.apply(this, arguments); }
      finally {
        const after = Number((game.cargo || {})[goodId] || 0);
        const moved = Math.abs(after - before);
        const np = p0 + dir * moved / L;
        if (moved > 0) { game.marketPressure[loc] = game.marketPressure[loc] || {}; game.marketPressure[loc][goodId] = { p: np, day: game.day }; }
        row[goodId] = Math.max(1, Math.round(base * mult(moved > 0 ? np : p0)));
      }
      if (moved_(goodId, before) && typeof renderMarket === 'function') { try { renderMarket(); } catch(e) {} }
      return r;
    };
  }
  function moved_(goodId, before){ return Number((game.cargo || {})[goodId] || 0) !== before; }
  // (sell = +1: the port ends up oversupplied; buy = -1: the port ends up short)
  wrapTrade('sellGood', +1);
  wrapTrade('buyGood', -1);

  // ---- news ----
  function known(){ game.knownMarketEvents = game.knownMarketEvents || {}; return game.knownMarketEvents; }
  function describe(portId, ev){
    const p = PORTS.find(function(x){ return x.id === portId; });
    const g = ev.good ? GOODS[ev.good] : null;
    return ev.type.icon + ' ' + ev.type.name + ' at ' + (p ? p.name : portId) + (g ? ': ' + g.icon + ' ' + g.name + ' ×' + ev.type.mult : ': everything ×' + ev.type.mult) + ' (' + ev.left + ' day' + (ev.left === 1 ? '' : 's') + ' left)';
  }

  const oldRenderIntel = window.renderIntel;
  window.renderIntel = function(){
    if (oldRenderIntel) oldRenderIntel.apply(this, arguments);
    try {
      const el = document.getElementById('marketIntel'); if (!el) return;
      const lines = [];
      const here = eventFor(game.location, game.day);
      if (here) lines.push(describe(game.location, here) + ' — ' + here.type.line);
      const k = known();
      Object.keys(k).forEach(function(pid){
        if (pid === game.location) return;
        const ev = eventFor(pid, game.day);
        if (!ev || ev.key !== k[pid]) { delete k[pid]; return; }
        lines.push(describe(pid, ev));
      });
      if (lines.length) el.insertAdjacentHTML('beforeend', '<br><strong>📢 Trade news:</strong><br>' + lines.map(esc).join('<br>'));
    } catch(e) {}
  };

  // Tavern rumors reveal up to two events elsewhere.
  const oldListen = window.listenForRumors;
  if (typeof oldListen === 'function') {
    window.listenForRumors = function(){
      const before = (game.rumors || []).length;
      const r = oldListen.apply(this, arguments);
      try {
        if ((game.rumors || []).length > before) {
          const k = known();
          const found = [];
          eligiblePorts().forEach(function(p){
            if (p.id === game.location) return;
            const ev = eventFor(p.id, game.day);
            if (ev && k[p.id] !== ev.key) found.push({ p: p, ev: ev });
          });
          found.sort(function(a, b){ return hash(seedOf(a.p.id) + game.day) - hash(seedOf(b.p.id) + game.day); });
          found.slice(0, 2).forEach(function(f){
            k[f.p.id] = f.ev.key;
            if (typeof toast === 'function') toast('📢 Dockside talk: ' + describe(f.p.id, f.ev), 4200);
            if (typeof logEvent === 'function') logEvent('📢 ' + describe(f.p.id, f.ev), 'gold');
          });
          if (typeof renderIntel === 'function') renderIntel();
        }
      } catch(e) {}
      return r;
    };
  }
})();
