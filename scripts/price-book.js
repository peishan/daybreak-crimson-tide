(function(){
  // -------------------------------------------------------------------
  // PRICE BOOK + STEADY PRICES -- the trading side of a Tradewinds-style game.
  //
  // THE PROBLEM: every port's price for every good was re-rolled at random
  // (0.5x to 1.5x, then another 0.8x to 1.2x) each time you arrived anywhere,
  // so nothing could be learned: "spices are cheap in Batavia, sell them in
  // Manila" was never reliably true.
  //
  // 1. STEADY PRICES. A port now has its own baseline for each good (a 0.7x-1.3x
  //    spread, fixed per port and good, narrower than the old 0.5x-1.5x re-roll so
  //    that a known route is a good living, not a money printer; its specialties
  //    still 0.55x), moved by a smooth day-to-day drift of 0.85x-1.15x, the
  //    season (Crimson Horizon only, see sea-conditions.js) and any rumor.
  //    Worked out from the day number, so reloading does not re-roll them.
  //    The average price level is unchanged; the difference is that routes
  //    are now real and can be learned.
  // 2. PRICE BOOK. The market remembers what you saw at each port (price, the
  //    day, and an average) and, for the good you have selected, lists the
  //    best known places to sell and buy, with the profit per unit against
  //    today's price here, how stale the note is and how far the sail is.
  // -------------------------------------------------------------------
  function hash(n){
    let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16;
    return ((x >>> 0) % 100000) / 100000;
  }
  function seedOf(a, b){ let h = 11; (String(a) + '|' + String(b)).split('').forEach(function(c){ h = (h * 33 + c.charCodeAt(0)) | 0; }); return h; }
  function smooth(seed, day){
    const t = day / 2.5, i = Math.floor(t), f = t - i;
    const a = hash(seed + i * 131), b = hash(seed + (i + 1) * 131);
    return a + (b - a) * (f * f * (3 - 2 * f));
  }
  function steadyPrice(port, goodId, day){
    const good = GOODS[goodId];
    const seed = seedOf(port.id, goodId);
    let m = 0.7 + 0.6 * hash(seed);
    if ((port.specialties || []).indexOf(goodId) !== -1) m *= 0.55;
    m *= 0.85 + 0.3 * smooth(seed + 7, day);
    const se = (typeof window.seaSeason === 'function') ? window.seaSeason(day) : null;
    if (se && se.price && se.price[goodId]) m *= se.price[goodId];
    if (typeof window.rumorEffectFor === 'function') { const r = window.rumorEffectFor(port.id, goodId); if (r) m *= r.multiplier; }
    if (typeof window.marketPriceMods === 'function') m *= window.marketPriceMods(port.id, goodId, day);   // events and supply/demand, see market-economy.js
    return Math.max(1, Math.round(good.basePrice * m));
  }
  window.steadyMarketPrice = function(portId, goodId, day){
    const port = PORTS.find(function(p){ return p.id === portId; });
    return port && GOODS[goodId] ? steadyPrice(port, goodId, day == null ? game.day : day) : 0;
  };

  const oldGenerate = window.generateMarketPrices;
  window.generateMarketPrices = function(){
    if (oldGenerate) oldGenerate.apply(this, arguments);   // sets who sells what (e.g. contraband only at Manila), rumors, etc.
    try {
      PORTS.forEach(function(port){
        const row = game.marketPrices && game.marketPrices[port.id];
        if (!row) return;
        Object.keys(GOODS).forEach(function(goodId){
          if (goodId === 'contraband') { row[goodId] = (typeof window.contrabandPriceAt === 'function') ? window.contrabandPriceAt(port.id, game.day) : row[goodId]; return; }   // see contraband.js
          if (!row[goodId]) return;                      // 0 = not sold here: leave it
          row[goodId] = steadyPrice(port, goodId, game.day);
        });
      });
    } catch(e) { if (window.console) console.warn('steady prices failed', e); }
  };

  // ---- the book ----
  function book(){ if (!game.priceBook) game.priceBook = {}; return game.priceBook; }
  function record(){
    const loc = game.location;
    const row = game.marketPrices && game.marketPrices[loc];
    if (!row) return;
    const b = book(); b[loc] = b[loc] || {};
    Object.keys(GOODS).forEach(function(g){
      if (typeof goodShownInMarket === 'function' && !goodShownInMarket(g)) return;
      const p = row[g]; if (!p) return;
      const e = b[loc][g];
      if (e && e.day === game.day) return;   // the first look of the day wins: not the price after you dumped a hold on it
      b[loc][g] = { price: p, day: game.day, avg: e ? Math.round((e.avg || e.price) * 0.5 + p * 0.5) : p, n: (e ? e.n : 0) + 1 };
    });
  }
  window.recordPriceBook = record;

  function portName(id){ const p = PORTS.find(function(x){ return x.id === id; }); return p ? p.name : id; }
  function portIcon(id){ const p = PORTS.find(function(x){ return x.id === id; }); return p ? p.icon : ''; }

  function panelHtml(goodId){
    const g = GOODS[goodId]; if (!g) return '';
    const here = game.marketPrices && game.marketPrices[game.location] ? game.marketPrices[game.location][goodId] : 0;
    const b = book();
    const cur = PORTS.find(function(p){ return p.id === game.location; });
    const rows = [];
    Object.keys(b).forEach(function(pid){
      if (pid === game.location || !b[pid][goodId]) return;
      const e = b[pid][goodId];
      rows.push({ id: pid, price: e.price, day: e.day, avg: e.avg, n: e.n, dist: cur && cur.distances ? cur.distances[pid] : null });
    });
    const ago = function(d){ const n = Math.max(0, game.day - d); return n === 0 ? 'today' : n + ' day' + (n === 1 ? '' : 's') + ' ago'; };
    const line = function(r, sellSide){
      const diff = r.price - here;
      const profit = sellSide ? diff : -diff;
      const col = profit > 0 ? 'var(--success)' : 'inherit';
      return '<div style="display:flex;justify-content:space-between;gap:6px;font-size:.76rem;padding:2px 0;">' +
        '<span>' + portIcon(r.id) + ' ' + esc(portName(r.id)) + (r.dist ? ' <span style="opacity:.6;">· ' + r.dist + ' days</span>' : '') + '</span>' +
        '<span><strong>' + r.price + 'g</strong> <span style="opacity:.6;">' + ago(r.day) + (r.n > 1 ? ' · usually ~' + r.avg : '') + '</span> ' +
        (here ? '<span style="color:' + col + ';">' + (profit > 0 ? '+' : '') + profit + '</span>' : '') + '</span></div>';
    };
    let html = '<div style="margin-top:12px;border-top:1px solid rgba(205,163,55,.25);padding-top:8px;">' +
      '<div style="font-size:.8rem;color:var(--gold);">📒 Price Book — ' + esc(g.name) + '</div>';
    if (!rows.length) {
      html += '<div style="font-size:.74rem;opacity:.65;margin-top:4px;">Nothing noted yet. Visit other ports and the book fills itself in.</div></div>';
      return html;
    }
    const sell = rows.slice().sort(function(a, b2){ return b2.price - a.price; }).slice(0, 3);
    const buy = rows.slice().sort(function(a, b2){ return a.price - b2.price; }).slice(0, 2);
    html += '<div style="font-size:.7rem;opacity:.7;margin:4px 0 1px;">Best places to sell (profit per unit vs. here today)</div>' + sell.map(function(r){ return line(r, true); }).join('');
    html += '<div style="font-size:.7rem;opacity:.7;margin:6px 0 1px;">Cheapest places to buy (saving vs. here today)</div>' + buy.map(function(r){ return line(r, false); }).join('');
    html += '<div style="font-size:.68rem;opacity:.55;margin-top:4px;">Prices drift slowly and each port keeps its own habits, but old notes can be out of date.</div></div>';
    return html;
  }

  const oldRenderMarket = window.renderMarket;
  window.renderMarket = function(){
    if (oldRenderMarket) oldRenderMarket.apply(this, arguments);
    try {
      record();
      const detail = document.getElementById('marketDetail');
      if (detail && game.marketSelectedGood) detail.insertAdjacentHTML('beforeend', panelHtml(game.marketSelectedGood));
    } catch(e) { if (window.console) console.warn('price book failed', e); }
  };

  const oldRenderIntel = window.renderIntel;
  window.renderIntel = function(){
    if (oldRenderIntel) oldRenderIntel.apply(this, arguments);
    try {
      const el = document.getElementById('marketIntel');
      const se = (typeof window.seaSeason === 'function') ? window.seaSeason(game.day) : null;
      if (el && se) el.insertAdjacentHTML('beforeend', '<br><strong>Season:</strong> ' + se.icon + ' ' + esc(se.name) + ' (' + se.left + ' day' + (se.left === 1 ? '' : 's') + ' left) — ' + esc(se.line));
    } catch(e) {}
  };
})();
