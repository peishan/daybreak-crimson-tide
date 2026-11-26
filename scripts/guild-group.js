(function(){
  // -------------------------------------------------------------------
  // GUILD GROUP CONTENT (a Fair Tide hub tab, sequel only).
  //   Group Finder      builds a party of guild members with a tank, a healer and damage dealers. The group gives your crew an edge in the instance:
  //                     a tank cuts the boss's damage, a healer restores more between bosses, each damage dealer trims the boss's health.
  //   The Drowned Vault a three-boss dungeon, up to 3 runs a day. Every boss drops loot you roll for (Need, Greed or Pass) against the group.
  //   The Tide Court    a four-boss weekly raid with a lockout: each boss you kill stays down until Monday, so you can come back for the rest.
  //   Event Night       every Saturday: Renown +50% and a themed chest (one per Saturday).
  // Bosses use the combat the game already has (kind 'crimson_horizon') and the round rules from scripts/bestiary-round-rules.js (jam, gate, beat, cold,
  // phases). State: game.guildGroup. All numbers are first guesses; tune BOSSES, MODS and LOOT below.
  // -------------------------------------------------------------------
  const G = window.guildChat;
  if (!G) return;
  const DAILY_RUNS = 3;

  // ---- bosses ----
  const BOSSES = {
    dungeon: [
      { name: 'The Vault Warden', icon: '🗝️', hp: 3600, dmg: 74, xp: 900, gold: 450, twist: 'frenzy', twistText: 'It hits harder every round', desc: 'A drowned keeper still guarding a door that has not opened in years.' },
      { name: 'The Tide-Bound Scribe', icon: '📜', hp: 4400, dmg: 82, xp: 1100, gold: 550, rule: 'jam', twistText: 'Static: on odd rounds skills and spells are jammed', desc: 'A scribe of salt and ink who writes over every spell that is cast near it.' },
      { name: 'The Drowned Regent', icon: '👑', hp: 6500, dmg: 96, xp: 1700, gold: 850, rule: 'vault', twistText: 'Three stages: each one mends part of the damage, and the last mends every round',
        phases: [ { at: 0.67, text: '👑 The Regent rises from the water, and the first stage mends.', heal: 0.05, dmgMult: 1.15 }, { at: 0.34, text: '👑 The Regent drops its crown. The last stage mends every round.', heal: 0.06, dmgMult: 1.25, twist: 'mender', twistText: 'The last stage mends every round' } ],
        desc: 'The last ruler of the vault, wearing what the water left of its court.' }
    ],
    raid: [
      { name: 'The Warden of the Tidegate', icon: '🚪', hp: 8000, dmg: 100, xp: 2400, gold: 1200, rule: 'gate', twistText: 'The gate: open on odd rounds (double damage), shut on even rounds (no damage, harder hits)', desc: 'The old gate-keeper of the Court, opening and closing on its own count.' },
      { name: 'The Pale Chorister', icon: '🎶', hp: 9000, dmg: 106, xp: 2700, gold: 1350, rule: 'beat', twistText: 'The beat: every fourth round your damage triples; off the beat a fifth of it echoes back', desc: 'A choir of one that sings the Court in and out of session.' },
      { name: 'The Frostbound Counsel', icon: '❄️', hp: 10500, dmg: 112, xp: 3000, gold: 1500, rule: 'cold', twistText: 'Cold: each round it chills a crew member, who loses their next action unless a crewmate Defends',
        phases: [ { at: 0.5, text: '❄️ The Counsel stands. The cold deepens, and it hits much harder.', dmgMult: 1.3 } ], desc: 'A judge of the Court who never leaves its bench, and never warms.' },
      { name: 'The Sovereign of the Tide Court', icon: '🔱', hp: 13500, dmg: 122, xp: 4000, gold: 2000, rule: 'vault', twistText: 'Three stages: each one mends part of the damage, and the last mends every round',
        phases: [ { at: 0.67, text: '🔱 The Sovereign rises. The Court answers, and the first stage mends.', heal: 0.05, dmgMult: 1.15 }, { at: 0.34, text: '🔱 The Court kneels. The Sovereign stands alone, and mends every round.', heal: 0.06, dmgMult: 1.3, twist: 'mender', twistText: 'The Sovereign mends every round' } ], desc: 'The one the Court was built around. It has been waiting a long time for someone to come and sit across from it.' }
    ]
  };
  // ---- loot (amulets: the one slot every companion can use) ----
  const LOOT = {
    dungeon: [
      [ { id: 'gg_vault_key', name: 'Vault Warden’s Key', icon: '🗝️', hp: 30, magic: 6, tier: 3, desc: 'A heavy key to a door that is no longer there.' }, { id: 'gg_drowned_signet', name: 'Drowned Signet', icon: '💍', hp: 26, spd: 3, tier: 3, desc: 'A ring that is always cold, and always dry.' } ],
      [ { id: 'gg_ink_vial', name: 'Scribe’s Ink Vial', icon: '🧪', magic: 9, hp: 20, tier: 3, desc: 'Ink that writes itself a little faster than you think.' }, { id: 'gg_ledger_page', name: 'Tidebound Ledger Page', icon: '📃', hp: 28, magic: 7, tier: 3, desc: 'A damp page with the crew’s name already written on it.' } ],
      [ { id: 'gg_regent_pearl', name: 'Regent’s Pearl', icon: '🫧', hp: 38, magic: 9, tier: 4, desc: 'A pearl from the crown of a ruler who forgot it was a ruler.' }, { id: 'gg_quiet_crown', name: 'Crown of Quiet Water', icon: '👑', hp: 34, spd: 4, magic: 6, tier: 4, desc: 'A circlet that stills the water around whoever wears it.' } ]
    ],
    raid: [
      [ { id: 'gg_tidegate_key', name: 'Tidegate Key', icon: '🔑', hp: 40, magic: 8, tier: 4, desc: 'It opens whatever the Warden decided to close.' }, { id: 'gg_gate_hinge', name: 'Gate-Hinge Charm', icon: '🚪', hp: 36, spd: 4, tier: 4, desc: 'It swings both ways, and so do you.' } ],
      [ { id: 'gg_chorister_bell', name: 'Chorister’s Bell', icon: '🔔', hp: 38, magic: 10, tier: 4, desc: 'It rings on the beat, whether or not you do.' }, { id: 'gg_pale_hymnal', name: 'Pale Hymnal', icon: '📖', hp: 42, magic: 8, tier: 4, desc: 'A hymnal with one song in it. You can hum it from memory.' } ],
      [ { id: 'gg_counsel_gavel', name: 'Frostbound Gavel', icon: '🔨', hp: 44, magic: 9, tier: 5, desc: 'It stays cold in the hand, and it makes everything you say sound final.' }, { id: 'gg_warm_cloak_pin', name: 'Warm Cloak Pin', icon: '📌', hp: 46, spd: 4, tier: 5, desc: 'A small iron pin. For some reason it is always warm.' } ],
      [ { id: 'gg_sovereign_seal', name: 'Sovereign’s Seal', icon: '🔱', hp: 52, magic: 12, spd: 4, tier: 5, desc: 'The Court’s seal, given freely. It is heavier than it looks.' }, { id: 'gg_empty_chair', name: 'Token of the Empty Chair', icon: '🪑', hp: 50, magic: 10, spd: 5, tier: 5, desc: 'A small carved chair. It is a promise that somebody will sit with you.' } ]
    ]
  };
  const NAMES = { dungeon: 'The Drowned Vault', raid: 'The Tide Court' };

  // ---- state ----
  function st(){ const g = game.guildGroup = game.guildGroup || {}; g.owned = g.owned || {}; g.party = g.party || []; if (!g.stats) g.stats = { dungeons: 0, raids: 0, won: 0, lost: 0, passed: 0 }; return g; }
  function dayKey(){ const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function sequel(){ return !!(game && game.arc42Complete); }
  function weekCheck(){
    const g = st(), wk = G.weekKey();
    if (g.week !== wk) { g.week = wk; g.raidKilled = {}; g.raidCleared = false; }
    if (g.day !== dayKey()) { g.day = dayKey(); g.runsToday = 0; g.bonusRuns = 0; }
    return g;
  }
  function runsLeft(){ const g = weekCheck(); return Math.max(0, DAILY_RUNS + (g.bonusRuns || 0) - (g.runsToday || 0)); }
  function save(){ try { if (typeof saveGameQuiet === 'function') saveGameQuiet(); } catch (e) {} }
  function refresh(){ try { if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub(); } catch (e) {} }
  function esc2(s){ return typeof esc === 'function' ? esc(s) : String(s); }

  // ---- roles and the finder ----
  const TANKS = ['joel', 'ser_aldric', 'ate_joy', 'zaki', 'jade', 'devon', 'sairen'];
  const HEALERS = ['eliz', 'sister_wren', 'sky', 'dr_aa', 'maera', 'jenika', 'jovie'];
  function hash(s){ let n = 0; for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) | 0; return Math.abs(n); }
  function roleOf(m){
    const k = G.key(m);
    if (TANKS.indexOf(k) >= 0) return 'tank';
    if (HEALERS.indexOf(k) >= 0) return 'healer';
    const known = ['sally', 'levi', 'renn', 'mimi', 'erynn', 'mezstorm', 'senedra', 'aisyah', 'kw_liang', 'iris', 'brada_shah', 'caelan', 'adrian', 'fen', 'aster', 'eve', 'hugh', 'sera', 'helmsman', 'vaeren', 'joelle'];
    if (known.indexOf(k) >= 0) return 'dps';
    const h = hash(k) % 6; return h === 0 ? 'tank' : h === 1 ? 'healer' : 'dps';
  }
  const ROLE = { tank: { i: '🛡️', n: 'Tank' }, healer: { i: '💚', n: 'Healer' }, dps: { i: '⚔️', n: 'Damage' } };
  function findGroup(){
    const g = st();
    const fielded = new Set((typeof window.getFieldedIds === 'function' ? window.getFieldedIds() : []).concat(['soel', 'nala']));
    const all = G.members().filter(function(m){ return !fielded.has(m.id); });
    let pool = all.filter(G.online);
    if (pool.length < 4) pool = all.slice();
    pool = pool.map(function(m){ return { m: m, r: Math.random() }; }).sort(function(a, b){ return a.r - b.r; }).map(function(x){ return x.m; });
    const take = function(role){ const i = pool.findIndex(function(m){ return roleOf(m) === role; }); return i >= 0 ? pool.splice(i, 1)[0] : null; };
    const party = [take('tank'), take('healer'), take('dps'), take('dps')].filter(Boolean);
    while (party.length < 4 && pool.length) party.push(pool.shift());
    g.party = party.map(function(m){ return { id: m.id, name: m.name, icon: m.icon, role: roleOf(m) }; });
    G.sys('🔎 Group Finder: ' + (g.party.length ? 'group formed: ' + g.party.map(function(p){ return ROLE[p.role].i + ' ' + p.name; }).join(', ') + '.' : 'no one is available right now.'));
    save(); refresh();
  }
  window.ggFindGroup = findGroup;
  window.ggSoloCrew = function(){ st().party = []; save(); refresh(); };
  function mods(){
    const p = st().party, r = function(k){ return p.filter(function(x){ return x.role === k; }).length; };
    return { dmg: r('tank') ? 0.88 : 1, hp: Math.max(0.84, 1 - 0.06 * r('dps')), recover: r('healer') ? 0.4 : 0.25 };
  }

  // ---- fights ----
  function enemyFor(kind, idx){
    const def = BOSSES[kind][idx], mod = mods();
    const e = scaleCrimsonEnemy(def, 'guardian', 465);
    if (def.twist) { e.twist = def.twist; e.baseDmg = e.dmg; }
    e.twistText = def.twistText;
    if (def.rule) e.rule = def.rule;
    if (def.phases) { e.phases = JSON.parse(JSON.stringify(def.phases)); e.phaseIdx = 0; e.phaseMult = 1; }
    e.dmg = Math.round(e.dmg * mod.dmg); e.baseDmg = e.dmg;
    e.hp = Math.round(e.hp * mod.hp); if (e.maxHp) e.maxHp = e.hp;
    return e;
  }
  function fightBoss(){
    const g = st(), run = g.run; if (!run) return;
    const kind = run.kind;
    while (kind === 'raid' && run.idx < BOSSES.raid.length && g.raidKilled && g.raidKilled[run.idx]) run.idx++;
    if (run.idx >= BOSSES[kind].length) { completeRun(); return; }
    run.stage = 'fight'; save();
    const def = BOSSES[kind][run.idx];
    if (typeof toast === 'function') toast('⚔️ ' + NAMES[kind] + ': boss ' + (run.idx + 1) + ' of ' + BOSSES[kind].length + ', ' + def.name, 3200);
    startCombat({ kind: 'crimson_horizon', key: 'gg:' + kind + ':' + run.idx, enemy: enemyFor(kind, run.idx) });
  }
  window.ggStartRun = function(kind){
    if (!sequel() || !BOSSES[kind]) return;
    const g = weekCheck();
    if (g.run) { fightBoss(); return; }
    if (kind === 'dungeon') {
      if (runsLeft() <= 0) { toast('The Vault is sealed for today. Come back tomorrow.'); return; }
      g.runsToday = (g.runsToday || 0) + 1;
    } else if (g.raidCleared) { toast('The Court is closed until Monday.'); return; }
    g.run = { kind: kind, idx: 0, stage: 'ready' };
    G.sys('🚪 ' + G.me() + '’s group enters ' + NAMES[kind] + '.');
    save(); fightBoss();
  };
  window.ggResume = function(){ const g = st(); if (!g.run) return; if (g.run.stage === 'loot') openLoot(); else fightBoss(); };
  window.ggAbandon = function(){ const g = st(); if (g.run && g.run.stage !== 'fight') { g.run = null; G.sys('🚪 The group leaves ' + 'the instance.'); save(); refresh(); } };

  function endRun(msg){
    const g = st(); const run = g.run; g.run = null;
    if (g.stats) g.stats.lost = g.stats.lost || 0;
    if (run && msg) G.sys(msg);
    save(); refresh();
  }
  function recover(){
    try {
      const f = mods().recover;
      (typeof getCrimsonCombatParty === 'function' ? getCrimsonCombatParty() : []).forEach(function(m){
        const mh = effectiveMaxHp(m), mm = effectiveMaxMp(m);
        game.partyHp[m.id] = Math.min(mh, (game.partyHp[m.id] || 0) + Math.round(mh * f));
        game.partyMp[m.id] = Math.min(mm, (game.partyMp[m.id] || 0) + Math.round(mm * f));
      });
    } catch (e) {}
  }

  // ---- after a boss falls: loot rolls, then the next boss ----
  const oldVictory = window.handleVictory;
  window.handleVictory = function(){
    const e = game.combatEnemy, key = e && e.kind === 'crimson_horizon' ? String(e.key || '') : '';
    const was = game.combatResolved;
    const r = oldVictory.apply(this, arguments);
    try {
      const m = /^gg:(dungeon|raid):(\d+)$/.exec(key);
      if (m && !was) {
        const g = st(), run = g.run;
        if (run && run.kind === m[1]) {
          if (run.kind === 'raid') { g.raidKilled = g.raidKilled || {}; g.raidKilled[Number(m[2])] = true; }
          const def = BOSSES[run.kind][Number(m[2])];
          G.sys('⚔️ ' + def.name + ' has fallen.');
          try { if (typeof window.addRenown === 'function') window.addRenown('hall_event'); } catch (er) {}
          try { if (typeof window.guildHallAdd === 'function') window.guildHallAdd(run.kind === 'raid' ? 400 : 150); } catch (er) {}
          run.stage = 'loot'; run.li = 0; run.loot = LOOT[run.kind][Number(m[2])].map(function(x){ return x.id; });
          save();
          setTimeout(openLoot, 1200);
        }
      }
    } catch (er) { console.error('guild group victory', er); }
    return r;
  };
  const oldDefeat = window.handleDefeat;
  window.handleDefeat = function(){
    const e = game.combatEnemy, key = e && e.kind === 'crimson_horizon' ? String(e.key || '') : '';
    const was = game.combatResolved;
    const r = oldDefeat.apply(this, arguments);
    try { if (/^gg:/.test(key) && !was) endRun('💀 The group wipes. ' + G.me() + ' calls the retreat.'); } catch (er) {}
    return r;
  };
  const oldFlee = window.fleeCombat;
  window.fleeCombat = function(){
    const e = game.combatEnemy, key = e && e.kind === 'crimson_horizon' ? String(e.key || '') : '';
    const r = oldFlee.apply(this, arguments);
    try { if (/^gg:/.test(key) && !game.inCombat) endRun('🏃 The group escapes the instance.'); } catch (er) {}
    return r;
  };

  function lootItem(run, i){
    const idx = run.idx; return LOOT[run.kind][idx].find(function(x){ return x.id === run.loot[i]; });
  }
  function giveItem(item){
    const g = st();
    if (g.owned[item.id]) { game.gold = (game.gold || 0) + 250; return '(already owned: 250g instead)'; }
    g.owned[item.id] = true;
    if (typeof window.addGearToInventory === 'function') window.addGearToInventory({ id: item.id, name: item.name, icon: item.icon, slot: 'amulet', family: 'any', hp: item.hp || 0, magic: item.magic || 0, spd: item.spd || 0, tier: item.tier, desc: item.desc });
    return '';
  }
  function openLoot(){
    const g = st(), run = g.run; if (!run || run.stage !== 'loot') return;
    if (run.li >= run.loot.length) { finishBoss(); return; }
    const item = lootItem(run, run.li);
    const stats = [item.hp ? '+' + item.hp + ' HP' : '', item.magic ? '+' + item.magic + ' magic' : '', item.spd ? '+' + item.spd + ' speed' : ''].filter(Boolean).join(', ');
    const party = g.party.map(function(p){ return ROLE[p.role].i + ' ' + p.name; }).join(', ') || 'just your crew';
    if (typeof showModal !== 'function') { finishBoss(); return; }
    showModal('💰 Loot: ' + item.icon + ' ' + item.name,
      esc2(item.desc) + '<br><br><strong>' + stats + '</strong> (amulet)<br><br>Group: ' + esc2(party) + '.<br>Need beats Greed. Roll against the group.',
      [ { text: '🎲 Need', action: function(){ rollFor(item, 'need'); } }, { text: '💰 Greed', action: function(){ rollFor(item, 'greed'); } }, { text: '✋ Pass (+60g)', action: function(){ rollFor(item, 'pass'); } } ]);
  }
  window.ggOpenLoot = openLoot;
  function roll(){ return 1 + Math.floor(Math.random() * 100); }
  function rollFor(item, choice){
    const g = st(), run = g.run; if (!run) return;
    if (typeof closeModal === 'function') closeModal();
    const rolls = g.party.map(function(p){
      const r = Math.random(), need = p.role === 'dps' ? 0.4 : 0.22, greed = 0.5;
      const c = r < need ? 'need' : (r < need + greed ? 'greed' : 'pass');
      return { name: p.name, c: c, v: c === 'pass' ? 0 : roll() };
    });
    const mine = { name: G.me(), c: choice, v: choice === 'pass' ? 0 : roll() };
    const all = rolls.concat([mine]).filter(function(x){ return x.c !== 'pass'; });
    const tier = all.some(function(x){ return x.c === 'need'; }) ? 'need' : 'greed';
    const top = all.filter(function(x){ return x.c === tier; }).sort(function(a, b){ return b.v - a.v; })[0];
    const lines = rolls.concat([mine]).map(function(x){ return x.name + ': ' + (x.c === 'pass' ? 'pass' : x.c + ' ' + x.v); });
    let outcome;
    if (choice === 'pass') { game.gold = (game.gold || 0) + 60; g.stats.passed++; outcome = 'You passed (+60g).'; }
    else if (top && top === mine) { const note = giveItem(item); g.stats.won++; outcome = '🏆 You win the ' + item.name + '! ' + note; }
    else { g.stats.lost++; outcome = top ? top.name + ' wins the ' + item.name + '.' : 'Nobody wanted it.'; }
    G.sys('🎲 ' + item.name + ': ' + lines.join(' · ') + '. ' + outcome);
    run.li++; save();
    if (typeof showModal === 'function') showModal('🎲 ' + item.name, lines.map(esc2).join('<br>') + '<br><br><strong>' + esc2(outcome) + '</strong>', [ { text: 'Continue', action: function(){ if (typeof closeModal === 'function') closeModal(); openLoot(); } } ]);
    else openLoot();
    try { if (typeof updateUI === 'function') updateUI(); } catch (e) {}
  }
  function finishBoss(){
    const g = st(), run = g.run; if (!run) return;
    run.idx++; run.stage = 'ready';
    if (run.kind === 'raid') while (run.idx < BOSSES.raid.length && g.raidKilled && g.raidKilled[run.idx]) run.idx++;
    if (run.idx >= BOSSES[run.kind].length) { completeRun(); return; }
    recover(); save();
    try { if (typeof toast === 'function') toast('💨 A brief respite: the crew recovers before the next boss.', 3000); } catch (e) {}
    setTimeout(fightBoss, 1200);
  }
  function completeRun(){
    const g = st(), run = g.run; if (!run) return;
    g.run = null;
    const kind = run.kind;
    if (kind === 'dungeon') { g.stats.dungeons++; try { if (typeof window.addRenown === 'function') window.addRenown('hall_chest'); } catch (e) {} game.gold = (game.gold || 0) + 1500; }
    else { g.stats.raids++; g.raidCleared = true; try { if (typeof window.addRenown === 'function') { window.addRenown('hall_chest'); window.addRenown('hall_chest'); } } catch (e) {} game.gold = (game.gold || 0) + 6000; }
    G.sys('🏆 ' + G.me() + '’s group has cleared ' + NAMES[kind] + '!');
    try { if (typeof window.notify === 'function') window.notify({ icon: '🏆', title: NAMES[kind] + ' cleared', text: kind === 'raid' ? 'The Court is closed until Monday. +6,000g and Renown.' : '+1,500g and Renown.', kind: 'info', duration: 7000 }); } catch (e) {}
    try { if (typeof updateUI === 'function') updateUI(); } catch (e) {}
    save(); refresh();
  }

  // ---- Event Night (Saturdays) ----
  const EVENTS = [
    { icon: '🎲', name: 'Dice Night', text: 'The Hall rolls dice until the lamps burn low.', chest: function(){ const n = Math.round((typeof level === 'function' ? level() : 1) * 30); game.gold = (game.gold || 0) + n; return n.toLocaleString() + 'g'; } },
    { icon: '🏮', name: 'Lantern Parade', text: 'The whole port walks the quay with lanterns.', chest: function(){ const r = game.fairTideResources = game.fairTideResources || {}; ['timber', 'stone', 'food', 'trade'].forEach(function(k){ r[k] = (r[k] || 0) + 8; }); try { if (typeof window.addFairTideMood === 'function') window.addFairTideMood(3); } catch (e) {} return '8 of each resource and a little Fair Tide Mood'; } },
    { icon: '⚔️', name: 'Raid Night', text: 'Everyone wants a run tonight.', chest: function(){ const g = st(); g.bonusRuns = (g.bonusRuns || 0) + 2; return '2 extra Vault runs today'; } },
    { icon: '📖', name: 'Tall Tales', text: 'Everyone has a story, and most of them are true.', chest: function(){ const n = Math.round((typeof level === 'function' ? level() : 1) * 60); try { if (typeof gainXP === 'function') gainXP(n); } catch (e) {} return n.toLocaleString() + ' XP'; } }
  ];
  function isSaturday(){ return new Date().getDay() === 6; }
  function eventToday(){ const wk = G.weekKey(); return EVENTS[Math.floor(new Date(wk).getTime() / (7 * 86400000)) % EVENTS.length]; }
  window.ggEventActive = isSaturday;
  window.ggClaimEvent = function(){
    const g = weekCheck(); if (!isSaturday() || g.eventClaimed === g.week) return;
    g.eventClaimed = g.week;
    const ev = eventToday(), got = ev.chest();
    G.sys('🎉 ' + ev.name + ': the Event Night chest holds ' + got + '.');
    try { if (typeof window.notify === 'function') window.notify({ icon: ev.icon, title: ev.name, text: 'The chest holds ' + got + '.', kind: 'info', duration: 6000 }); } catch (e) {}
    try { if (typeof updateUI === 'function') updateUI(); } catch (e) {}
    save(); refresh();
  };
  // Renown +50% on Saturdays
  const oldAdd = window.addRenown;
  if (typeof oldAdd === 'function') window.addRenown = function(k){
    const amt = oldAdd.apply(this, arguments);
    try {
      if (amt > 0 && sequel() && isSaturday() && game.renown) {
        const extra = Math.round(amt * 0.5);
        if (extra > 0) { game.renown.earned += extra; game.renown.by = game.renown.by || {}; game.renown.by.event_night = (game.renown.by.event_night || 0) + extra; return amt + extra; }
      }
    } catch (e) {}
    return amt;
  };

  // ---- the tab ----
  function groupHtml(){
    const g = weekCheck(), run = g.run, ev = eventToday(), sat = isSaturday();
    let h = '<div class="panel-title">⚔️ Group Content</div>';
    h += '<article class="quest-item" style="border-left-color:' + (sat ? 'var(--gold)' : 'rgba(255,255,255,.2)') + ';"><strong>' + ev.icon + ' Event Night: ' + ev.name + '</strong> <span class="story-chip">' + (sat ? 'Tonight' : 'Saturday') + '</span><br>' +
      '<span style="font-size:.82rem;opacity:.85;">' + esc2(ev.text) + ' Every Saturday: Renown +50% and a chest.</span><br>' +
      (sat ? (g.eventClaimed === g.week ? '<span style="font-size:.78rem;opacity:.75;">✓ Chest collected.</span>' : '<button class="btn btn-small btn-magic" style="margin-top:6px;" onclick="ggClaimEvent()">🎁 Open the Event Night chest</button>') : '<span style="font-size:.78rem;opacity:.75;">Next on Saturday.</span>') + '</article>';
    h += '<div class="panel-title" style="font-size:1rem;margin-top:10px;">🔎 Group Finder</div>';
    h += '<article class="quest-item">' + (g.party.length ? g.party.map(function(p){ return '<div style="padding:2px 0;">' + ROLE[p.role].i + ' <strong>' + esc2(p.name) + '</strong> <span style="opacity:.7;font-size:.78rem;">' + ROLE[p.role].n + '</span></div>'; }).join('') : '<span style="font-size:.82rem;opacity:.8;">No group yet. Your crew can go in alone, but a tank, a healer and two damage dealers make it easier.</span>') +
      '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;"><button class="btn btn-small btn-success" onclick="ggFindGroup()"' + (run ? ' disabled' : '') + '>🔎 ' + (g.party.length ? 'Re-roll group' : 'Find a group') + '</button>' +
      (g.party.length ? '<button class="btn btn-small" onclick="ggSoloCrew()"' + (run ? ' disabled' : '') + '>Go in with just my crew</button>' : '') + '</div>' +
      (g.party.length ? '<div style="font-size:.74rem;opacity:.7;margin-top:4px;">' + (function(){ const m = mods(); return (m.dmg < 1 ? 'Tank: boss damage -12%. ' : '') + (m.recover > 0.25 ? 'Healer: crew recovers 40% between bosses. ' : '') + (m.hp < 1 ? 'Damage dealers: boss health -' + Math.round((1 - m.hp) * 100) + '%.' : ''); })() + '</div>' : '') + '</article>';
    if (run) {
      h += '<article class="quest-item" style="border-left-color:var(--danger);"><strong>🚪 In progress: ' + NAMES[run.kind] + '</strong><br><span style="font-size:.82rem;">Boss ' + (run.idx + 1) + ' of ' + BOSSES[run.kind].length + (run.stage === 'loot' ? ', loot waiting.' : '.') + '</span><br>' +
        '<button class="btn btn-small btn-danger" style="margin-top:6px;" onclick="ggResume()">' + (run.stage === 'loot' ? '💰 Roll for loot' : '⚔️ Continue') + '</button> ' +
        (run.stage !== 'fight' ? '<button class="btn btn-small" style="margin-top:6px;" onclick="ggAbandon()">Leave</button>' : '') + '</article>';
    }
    const left = runsLeft();
    h += '<div class="panel-title" style="font-size:1rem;margin-top:10px;">🗝️ The Drowned Vault</div><article class="quest-item"><span style="font-size:.82rem;opacity:.85;">Three bosses, with loot to roll for after each. Runs left today: <strong>' + left + '</strong> of ' + (DAILY_RUNS + (g.bonusRuns || 0)) + '.</span><br>' +
      BOSSES.dungeon.map(function(b){ return '<span style="font-size:.76rem;opacity:.8;">' + b.icon + ' ' + esc2(b.name) + '</span>'; }).join(' · ') +
      '<br><button class="btn btn-small btn-danger" style="margin-top:6px;" onclick="ggStartRun(\'dungeon\')"' + ((run || left <= 0) ? ' disabled' : '') + '>🚪 Enter the Vault</button></article>';
    const killed = BOSSES.raid.filter(function(b, i){ return g.raidKilled && g.raidKilled[i]; }).length;
    h += '<div class="panel-title" style="font-size:1rem;margin-top:10px;">🔱 The Tide Court (weekly raid)</div><article class="quest-item"><span style="font-size:.82rem;opacity:.85;">Four bosses. Each one you kill stays down until Monday, so you can come back for the rest. Cleared this week: <strong>' + killed + '</strong> of 4.</span><br>' +
      BOSSES.raid.map(function(b, i){ return '<span style="font-size:.76rem;opacity:' + (g.raidKilled && g.raidKilled[i] ? '.4;text-decoration:line-through' : '.85') + ';">' + b.icon + ' ' + esc2(b.name) + '</span>'; }).join(' · ') +
      '<br><button class="btn btn-small btn-danger" style="margin-top:6px;" onclick="ggStartRun(\'raid\')"' + ((run || g.raidCleared) ? ' disabled' : '') + '>' + (g.raidCleared ? '✓ Closed until Monday' : killed ? '🔱 Continue the raid' : '🔱 Enter the Court') + '</button></article>';
    const s = g.stats;
    h += '<div style="font-size:.74rem;opacity:.65;margin-top:8px;">Vaults cleared: ' + s.dungeons + ' · Raids cleared: ' + s.raids + ' · Rolls won: ' + s.won + ', lost: ' + s.lost + ', passed: ' + s.passed + '</div>';
    return h;
  }
  const oldHub = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings', show = sequel();
    const el = document.getElementById('ft-tab-guildgroup'), btn = document.getElementById('ft-tab-btn-guildgroup');
    if (el) el.classList.toggle('active', tab === 'guildgroup');
    if (btn) { btn.classList.toggle('active', tab === 'guildgroup'); btn.style.display = show ? '' : 'none'; }
    if (oldHub) oldHub.apply(this, arguments);
    if (show && tab === 'guildgroup' && el) { try { el.innerHTML = groupHtml(); } catch (e) { console.error('guild group', e); } }
  };
  // announce Event Night once a week
  setInterval(function(){
    try {
      if (typeof gameSessionActive === 'undefined' || !gameSessionActive || !sequel() || !isSaturday()) return;
      const g = weekCheck();
      if (g.eventAnnounced === g.week) return;
      g.eventAnnounced = g.week; const ev = eventToday();
      G.sys('🎉 Event Night: ' + ev.name + '! Renown +50% tonight, and there is a chest waiting in the Group tab.');
      save();
    } catch (e) {}
  }, 30 * 1000);
})();
