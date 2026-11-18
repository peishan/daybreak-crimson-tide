(function(){
  // -------------------------------------------------------------------
  // SEA CONDITIONS -- weather and raider activity that change day to day.
  //
  // Before this, every day at sea rolled the same odds and a port's danger
  // never moved after it unlocked, and the Sail screen's "Current wind:
  // Favorable" was fixed text. Now:
  //
  //  * WEATHER for each in-game day (clear, breezy, overcast, fog, rain,
  //    storm, doldrums). It is worked out from the day number, so it is the
  //    same after a reload, and often carries over from the day before.
  //  * HOSTILITY per destination: how active raiders and sea beasts are on
  //    that route today, drifting over a few days (quiet to dangerous) around
  //    the port's base danger, not constant.
  //  * Sailing: weather and hostility change the odds of an event each day,
  //    and how likely a hostile one is. (Your ship's own safety, see
  //    voyageSafety in core-engine.js, still applies on top.)
  //  * Sea battles: the day's weather shifts the fight a little. Storm seas
  //    hit harder but pay more; fog spoils the enemy's aim.
  // Shown on the Sail screen and in the Set Sail prompt.
  // -------------------------------------------------------------------
  const WEATHER = [
    { id:'clear',    w:28, icon:'☀️', name:'Clear skies',   event:0.90, hostile:1.00, line:'A fair day to be at sea.' },
    { id:'breezy',   w:20, icon:'🌬️', name:'Fair wind',     event:0.90, hostile:0.90, line:'A steady wind and good visibility.' },
    { id:'overcast', w:16, icon:'☁️', name:'Overcast',      event:1.00, hostile:1.00, line:'Grey and unremarkable.' },
    { id:'fog',      w:12, icon:'🌫️', name:'Fog',           event:1.10, hostile:1.25, line:'Fog hides everything, including whoever is hunting.', fight:{enemyDmg:0.90}, fightLine:'Fog: the enemy cannot aim properly.' },
    { id:'rain',     w:12, icon:'🌧️', name:'Rain',          event:1.00, hostile:0.85, line:'Rain keeps most raiders in port.' },
    { id:'storm',    w:9,  icon:'⛈️', name:'Storm',         event:1.20, hostile:0.60, line:'Few are foolish enough to hunt in this, and the sea itself is the danger.', stormy:true, fight:{enemyDmg:1.10, reward:1.20}, fightLine:'Storm seas: the enemy hits harder, but the spoils are richer.' },
    { id:'doldrums', w:3,  icon:'😶', name:'Dead calm',     event:0.60, hostile:0.85, line:'Hardly a breath of wind.' }
  ];

  // SEASONS (Crimson Horizon only): a 60-day cycle that leans the weather, the raiders and the
  // price of the sequel's trade goods. Before the sequel there are no seasons.
  const SEASONS = [
    { id:'calm',    name:'Calm Season',  icon:'🌤️', len:20, line:'Steady skies, and every yard is refitting.',
      wx:{ storm:0.4, fog:0.7, clear:1.3 }, hostile:1.0, event:0.9, price:{ rope:1.10, sailcloth:1.10, timber:1.10 } },
    { id:'monsoon', name:'Monsoon',      icon:'🌧️', len:20, line:'Storms roll in, raiders stay ashore, and lamp oil and salt fish run short.',
      wx:{ storm:2.2, rain:1.8, clear:0.6 }, hostile:0.85, event:1.05, price:{ lamp_oil:1.20, smoked_fish:1.20, salt:1.20, dried_fruit:1.10 } },
    { id:'harvest', name:'Harvest Tide', icon:'🌾', len:20, line:'Harvest mists and busy lanes: more traffic, and more raiders watching it.',
      wx:{ fog:1.5, overcast:1.2 }, hostile:1.10, event:1.0, price:{ dried_fruit:0.85, crockery:0.85, reed_mats:0.85, salt:0.85 } }
  ];
  const CYCLE = SEASONS.reduce(function(s, x){ return s + x.len; }, 0);
  function seasonFor(day){
    try { if (!game.arc42Complete) return null; } catch(e) { return null; }
    let d = ((Math.floor(Number(day) || 0) % CYCLE) + CYCLE) % CYCLE;
    for (let i = 0; i < SEASONS.length; i++) {
      if (d < SEASONS[i].len) return { def: SEASONS[i], left: SEASONS[i].len - d };
      d -= SEASONS[i].len;
    }
    return { def: SEASONS[0], left: SEASONS[0].len };
  }
  window.seaSeason = function(day){ const r = seasonFor(day == null ? game.day : day); return r ? Object.assign({ left: r.left }, r.def) : null; };

  function hash(n){            // deterministic 0..1 from an integer
    let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16;
    return ((x >>> 0) % 100000) / 100000;
  }
  function pick(day){
    const se = seasonFor(day), wx = (se && se.def.wx) || {};
    const ws = WEATHER.map(function(x){ return x.w * (wx[x.id] || 1); });
    const total = ws.reduce(function(a, b){ return a + b; }, 0);
    let r = hash(day * 31 + 7) * total;
    for (let i = 0; i < WEATHER.length; i++) { r -= ws[i]; if (r < 0) return WEATHER[i]; }
    return WEATHER[0];
  }
  function weatherFor(day){
    day = Math.floor(Number(day) || 0);
    // Weather often carries over: 40% of days repeat the day before.
    if (hash(day * 17 + 3) < 0.4) return pick(day - 1);
    return pick(day);
  }
  function portSeed(portId){ let h = 7; String(portId || '').split('').forEach(function(c){ h = (h * 31 + c.charCodeAt(0)) | 0; }); return h; }
  // Raider activity: drifts smoothly over a few days. 0.65 (quiet) .. 1.35 (dangerous).
  function hostilityFor(portId, day){
    const seed = portSeed(portId);
    const t = (Number(day) || 0) / 3, i = Math.floor(t), f = t - i;
    const a = hash(seed + i * 101), b = hash(seed + (i + 1) * 101);
    const s = a + (b - a) * (f * f * (3 - 2 * f));
    return 0.65 + 0.7 * s;
  }
  function hostilityLabel(h){ return h < 0.8 ? 'Quiet' : (h < 1.05 ? 'Normal' : (h < 1.25 ? 'Restless' : 'Dangerous')); }
  function hostilityIcon(h){ return h < 0.8 ? '🟢' : (h < 1.05 ? '🟡' : (h < 1.25 ? '🟠' : '🔴')); }

  window.seaWeather = function(day){ return weatherFor(day == null ? game.day : day); };
  window.seaHostility = function(portId, day){ return hostilityFor(portId, day == null ? game.day : day); };
  window.seaHostilityLabel = function(portId){ const h = hostilityFor(portId, game.day); return hostilityIcon(h) + ' ' + hostilityLabel(h); };
  window.seaWeatherLine = function(){
    const w = weatherFor(game.day), se = seasonFor(game.day);
    return w.icon + ' ' + w.name + ' — ' + w.line + (se ? '<br>Season: ' + se.def.icon + ' ' + se.def.name + ' (' + se.left + ' day' + (se.left === 1 ? '' : 's') + ' left) — ' + se.def.line : '');
  };

  // Used by doVoyage in core-engine.js. event: multiplier on the day's chance of an event.
  // hostile: how likely a hostile event is to actually be one (>1 adds ambushes, <1 turns some away).
  window.seaVoyageMods = function(portId, day){
    const w = weatherFor(day == null ? game.day : day);
    const h = hostilityFor(portId, day == null ? game.day : day);
    const se = seasonFor(day == null ? game.day : day);
    return { event: w.event * (0.85 + 0.3 * h) * (se ? se.def.event : 1), hostile: w.hostile * h * (se ? se.def.hostile : 1), weather: w, stormy: !!w.stormy };
  };

  // Sea battles: the day's weather nudges the enemy.
  const oldStartCombat = window.startCombat;
  if (typeof oldStartCombat === 'function') {
    window.startCombat = function(encounter){
      try {
        if (encounter && encounter.kind === 'sea' && encounter.enemy && !encounter.__seaWx) {
          const w = weatherFor(game.day);
          if (w.fight) {
            const e = Object.assign({}, encounter.enemy);
            if (w.fight.enemyDmg) e.dmg = Math.max(1, Math.round(e.dmg * w.fight.enemyDmg));
            if (w.fight.reward) { e.xp = Math.round((e.xp || 0) * w.fight.reward); e.gold = Math.round((e.gold || 0) * w.fight.reward); }
            encounter = Object.assign({}, encounter, { enemy: e, __seaWx: true });
            if (typeof logEvent === 'function') logEvent(w.icon + ' ' + w.fightLine, 'neutral');
            if (typeof toast === 'function') toast(w.icon + ' ' + w.fightLine, 3200);
          }
        }
      } catch(e) {}
      return oldStartCombat.call(this, encounter);
    };
  }
})();
