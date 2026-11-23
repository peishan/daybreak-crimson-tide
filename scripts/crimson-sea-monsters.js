(function(){
  // -------------------------------------------------------------------
  // SEA MONSTERS OF THE NEW WATERS (sequel only). On a voyage to or from a Crimson Horizon port, the old hostile encounters (octopus,
  // serpent, frigate, siren pack, kraken) are replaced by bigger monsters, each with its own twist. Which ones can appear depends on how far
  // you are in the sequel. The first time you beat each kind you get its trophy amulet. Now and then an Alpha turns up: much tougher, and it
  // pays double. State: game.chSea = { kills:{id:n}, trophies:{id:true} }.
  // -------------------------------------------------------------------
  const MONSTERS = [
    { id:'mist_eel',      minArc:2,  name:'Mist-Strait Eel',       icon:'🐍', hp:3000, dmg:70,  twist:'mender', twistText:'It heals as it thrashes',
      desc:'A pale eel as long as a ship, drawn out of the fog by the lantern light. Its wounds close almost as fast as you make them.',
      trophy:{ name:'Eel-Skin Charm', icon:'🐍', hp:26, spd:3 } },
    { id:'gate_crab',     minArc:4,  name:'Gate-Mouth Crab Colossus', icon:'🦀', hp:4600, dmg:66, twist:null,
      desc:'A crab the size of a harbour wall, with a shell that turns most blows. It does not hurry. It does not need to.',
      trophy:{ name:'Colossus Shell Charm', icon:'🦀', hp:34, defense:2 } },
    { id:'reef_ray',      minArc:6,  name:'The Reef Ray Mother',    icon:'🐟', hp:3600, dmg:78,  twist:'frenzy', twistText:'Stung into a rage, it hits harder every round',
      desc:'A great ray with a barbed tail, guarding a nursery on the reef. The longer you stay, the angrier she gets.',
      trophy:{ name:'Barbed Tail Charm', icon:'🐟', hp:24, magic:6 } },
    { id:'tide_hag',      minArc:8,  name:'The Tide-Hag',           icon:'🧜‍♀️', hp:4200, dmg:82, twist:'mender', twistText:'She drinks the tide to heal',
      desc:'A drowned thing that sings the tide up around her. She feeds on the sea itself, and the sea gives her back what you take.',
      trophy:{ name:'Hag-Song Shell', icon:'🐚', hp:28, magic:8 } },
    { id:'cliffcoil',     minArc:10, name:'The Cliffcoil Serpent',  icon:'🐉', hp:5200, dmg:88,  twist:'frenzy', twistText:'It coils tighter every round',
      desc:'A serpent that has made a nest in the rock below a headland, and bites anything that sails under its shadow.',
      trophy:{ name:'Cliffcoil Scale', icon:'🐉', hp:36, spd:4 } },
    { id:'lantern_angler',minArc:12, name:'The Lantern Angler',     icon:'🐠', hp:5400, dmg:92,  twist:'mender', twistText:'Its lure draws the sea\'s strength',
      desc:'A deep fish with a lantern for a lure, rising to a ship\'s own lights. It is the lantern that does the healing.',
      trophy:{ name:'Angler Lantern', icon:'🏮', hp:30, magic:9 } },
    { id:'squall_roc',    minArc:14, name:'The Squall Roc',         icon:'🦅', hp:5800, dmg:100, twist:'frenzy', twistText:'The storm builds around it every round',
      desc:'A great bird that rides the storm front over open water and dives at the tallest mast.',
      trophy:{ name:'Squall Feather', icon:'🪶', hp:32, spd:5 } },
    { id:'drowned_maw',   minArc:16, name:'The Drowned Maw',        icon:'🦑', hp:7200, dmg:106, twist:'frenzy', twistText:'The whirlpool pulls tighter every round',
      desc:'A whirlpool with something at the bottom of it. The sea turns, and the ship begins to turn with it.',
      trophy:{ name:'Maw Tooth', icon:'🦷', hp:40, magic:10 } },
    { id:'brine_colossus',minArc:20, name:'The Brine Colossus',     icon:'🌊', hp:9000, dmg:116, twist:'mender', twistText:'The brine mends it',
      desc:'A wall of salt water that walks, and puts itself back together after every blow.',
      trophy:{ name:'Brine Heart Stone', icon:'💎', hp:46, magic:12, spd:3 } }
  ];
  const BY_ID = {}; MONSTERS.forEach(function(m){ BY_ID[m.id] = m; });
  const ALPHA_CHANCE = 0.15;
  function sequel(){ return !!(typeof game !== 'undefined' && game && game.arc42Complete); }
  function lvl(){ try { return typeof level === 'function' ? level() : 1; } catch (e) { return 1; } }
  function fmt(n){ return Math.round(n).toLocaleString(); }
  function st(){ const c = game.chSea = game.chSea || {}; c.kills = c.kills || {}; c.trophies = c.trophies || {}; return c; }
  function chPortIds(){ return (window.CRIMSON_HORIZON_PORTS || []).map(function(p){ return p.id; }); }
  function inNewWaters(destId){
    if (!sequel()) return false;
    const ids = chPortIds();
    return ids.indexOf(destId) !== -1 || ids.indexOf(game.location) !== -1;
  }
  // how far the sequel has got: the arc of the first unread chapter, or the last arc if all are read
  function currentArc(){
    const list = window.CRIMSON_HORIZON_CHAPTERS || [], P = game.comicProgressCrimsonHorizon || {};
    const next = list.find(function(c){ return !P[c.id]; });
    return next ? next.arc : (list.length ? list[list.length - 1].arc : 1);
  }
  function available(){ const a = currentArc(); return MONSTERS.filter(function(m){ return m.minArc <= a; }); }
  function pick(){
    const pool = available(); if (!pool.length) return null;
    const top = pool.slice(-3), w = [];                        // the newest few are the likeliest
    pool.forEach(function(m){ const n = top.indexOf(m) !== -1 ? 3 : 1; for (let i = 0; i < n; i++) w.push(m); });
    return w[Math.floor(Math.random() * w.length)];
  }

  // The voyage's event pool: in the new waters, the old hostile encounters give way to these.
  window.voyageEventPool = function(destId){
    try {
      if (!inNewWaters(destId) || !available().length) return EVENTS;
      const calm = EVENTS.filter(function(e){ return !e.combat; });
      const mon = [{ type:'chsea', text:'The water bulges. Something enormous is rising...', danger:5, combat:'chsea_roll' }];
      return calm.concat(mon, mon, mon);                          // monsters are a good share of the events out here
    } catch (e) { return EVENTS; }
  };

  function build(m, alpha){
    const arcBonus = 1 + 0.05 * Math.max(0, currentArc() - m.minArc);
    const mult = (alpha ? 1.6 : 1) * arcBonus;
    const base = { name: (alpha ? 'Alpha ' : '') + m.name, icon: m.icon, art: m.icon, hp: Math.round(m.hp * mult), dmg: Math.round(m.dmg * (alpha ? 1.2 : 1) * (1 + 0.02 * Math.max(0, currentArc() - m.minArc))),
      xp: Math.round(m.hp * 0.22 * (alpha ? 2 : 1)), gold: Math.round(m.hp * 0.09 * (alpha ? 2 : 1)), desc: m.desc + (alpha ? ' This one is far larger than the rest of its kind.' : '') };
    const e = (typeof scaleCrimsonEnemy === 'function') ? scaleCrimsonEnemy(base, 'guardian', 465) : base;
    e.hp = Math.max(e.hp, Math.round(base.hp * 1.1));       // the scaling must never make it weaker
    if (m.twist) { e.twist = m.twist; e.twistText = m.twistText; e.baseDmg = e.dmg; }
    e.chseaId = m.id; e.alpha = !!alpha;
    return e;
  }
  function start(){
    const m = pick(); if (!m) return false;
    const alpha = Math.random() < ALPHA_CHANCE;
    const el = document.getElementById('voyageEvent');
    if (el) el.innerHTML = '<span style="color: var(--danger);">' + (alpha ? 'Something far bigger than the rest of its kind rises: the Alpha ' : 'The water bulges and ') + m.name + (alpha ? '!' : ' rises!') + '</span>';
    startCombat({ kind: 'crimson_horizon', key: 'chsea_' + m.id, enemy: build(m, alpha) });
    return true;
  }
  const oldStartSea = window.startSeaGroupEncounter;
  window.startSeaGroupEncounter = function(key){
    if (key === 'chsea_roll' && start()) return;
    if (key === 'chsea_roll') key = 'sea_serpent';
    if (typeof oldStartSea === 'function') return oldStartSea.apply(this, arguments.length ? [key] : arguments);
    startCombat({ kind:'sea', key: key, enemy: scaledEnemyForExplore(key, 'sea') });
  };

  // a win: count it, trophy on the first kill of each kind
  const oldVictory = window.handleVictory;
  if (typeof oldVictory === 'function') window.handleVictory = function(){
    const e = game.combatEnemy, isM = e && e.kind === 'crimson_horizon' && String(e.key).indexOf('chsea_') === 0 && !game.combatResolved;
    const r = oldVictory.apply(this, arguments);
    try {
      if (isM) {
        const m = BY_ID[e.chseaId], c = st();
        c.kills[m.id] = (c.kills[m.id] || 0) + 1;
        game.reputation = (game.reputation || 0) + (e.alpha ? 3 : 1);
        let extra = '';
        if (!c.trophies[m.id] && typeof window.addGearToInventory === 'function') {
          c.trophies[m.id] = true;
          window.addGearToInventory(Object.assign({ id: 'chsea_' + m.id, slot: 'amulet', family: 'any', tier: 3, desc: 'Taken from ' + m.name + ', the first time you beat one.' }, m.trophy));
          extra = ' Its trophy, ' + m.trophy.name + ', is in your inventory.';
        }
        if (typeof window.notify === 'function') window.notify({ icon: m.icon, title: (e.alpha ? 'Alpha ' : '') + m.name + ' beaten', text: 'Beaten ' + c.kills[m.id] + ' time' + (c.kills[m.id] === 1 ? '' : 's') + '.' + extra, kind: 'info', duration: 6000 });
        if (typeof saveGameQuiet === 'function') saveGameQuiet();
      }
    } catch (er) { console.error('sea monster victory', er); }
    return r;
  };
})();
