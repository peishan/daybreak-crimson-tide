(function(){
  // -------------------------------------------------------------------
  // SEQUEL ONLY (after Arc XLII): DAILIES and the TIDE TITAN world boss.
  //  * Dailies: a short checklist that resets each local day. Finish them all for a bonus Titan attempt.
  //  * Tide Titan: one huge shared health bar. Each attempt is a fight of up to 8 rounds against it, and the damage dealt comes off the bar.
  //    6 attempts a day. Guild Hall members chip at it while you are away, but never land the final blow. Each kill raises the Titan's tier.
  // State: game.titan, game.dailies. Quests and bounties are unchanged; the dailies only count what you already do.
  // -------------------------------------------------------------------
  const LIMIT = 8, DAILY_ATTEMPTS = 6, POOL_ATTEMPTS = 30;
  const NAMES = [
    { name: 'The Tide Titan', icon: '🌊' }, { name: 'The Abyssal Warden', icon: '🦑' }, { name: 'The Drowned Colossus', icon: '🐙' },
    { name: 'The Leviathan Mother', icon: '🐋' }, { name: 'The Sunken Sovereign', icon: '👑' }
  ];
  const HOUR = 3600 * 1000;
  function sequel(){ return !!(typeof game !== 'undefined' && game && game.arc42Complete); }
  function today(){ const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function lvl(){ try { return typeof level === 'function' ? level() : 1; } catch (e) { return 1; } }
  function fmt(n){ return Math.round(n).toLocaleString(); }
  function nameFor(tier){ return NAMES[Math.min(NAMES.length - 1, tier - 1)]; }

  // ---- how strong is the party? the Titan is sized to it ----
  function estRoundDamage(){
    let sum = 0;
    try {
      (typeof getCrimsonCombatParty === 'function' ? getCrimsonCombatParty() : []).forEach(function(m){
        const gb = (typeof gearBonuses === 'function' ? gearBonuses(m.id) : null) || {};
        sum += (28 + (gb.atk || 0)) * (1 + ((game.ship && game.ship.cannons) || 0) * 0.12) * 1.25;
      });
    } catch (e) {}
    return Math.max(60, sum);
  }
  function avgMaxHp(){
    try { const p = getCrimsonCombatParty(); return p.reduce(function(a, m){ return a + effectiveMaxHp(m); }, 0) / Math.max(1, p.length); } catch (e) { return 400; }
  }

  // ---- state ----
  function spawn(t, tier){
    const D = Math.round(estRoundDamage() * LIMIT * 0.8);
    t.tier = tier; t.D = D; t.maxHp = Math.round(D * POOL_ATTEMPTS * (1 + 0.3 * (tier - 1))); t.hp = t.maxHp; t.milestones = {};
  }
  function titan(){
    const t = game.titan = game.titan || {};
    if (!t.tier) { spawn(t, 1); t.kills = 0; t.youTotal = 0; t.log = []; t.lastIdle = Date.now(); }
    const d = today();
    if (!t.day || t.day !== d) { t.day = d; t.used = 0; t.bonus = 0; t.todayDmg = 0; }
    return t;
  }
  function attemptsLeft(t){ return Math.max(0, DAILY_ATTEMPTS + (t.bonus || 0) - (t.used || 0)); }
  function logT(t, text){ t.log.unshift({ t: Date.now(), text: text }); t.log = t.log.slice(0, 8); }

  // ---- idle damage from Guild Hall members (never the final blow) ----
  function idle(){
    const t = titan(), now = Date.now();
    if (!t.lastIdle) t.lastIdle = now;
    const ms = typeof window.guildHallMembers === 'function' ? window.guildHallMembers() : [];
    const cap = (typeof window.guildHallWindowHours === 'function' ? window.guildHallWindowHours() : 12) * HOUR;
    const elapsed = Math.max(0, Math.min(now - t.lastIdle, cap));
    if (now - t.lastIdle < 60 * 1000) return 0;
    t.lastIdle = now;
    if (!ms.length || t.hp <= 0) return 0;
    const rally = t.rallyUntil && t.rallyUntil > now ? 2 : 1;
    let dmg = Math.round(ms.length * t.D * 0.02 * (elapsed / HOUR) * rally);
    dmg = Math.min(dmg, Math.max(0, t.hp - Math.ceil(t.maxHp * 0.01)));
    if (dmg <= 0) return 0;
    t.hp -= dmg;
    t.idleDmg = (t.idleDmg || 0) + dmg;
    checkMilestones(t);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    return dmg;
  }
  function checkMilestones(t){
    [[75, 4000], [50, 8000], [25, 14000]].forEach(function(m){
      if (t.hp / t.maxHp * 100 <= m[0] && !t.milestones[m[0]]) {
        t.milestones[m[0]] = true;
        if (typeof window.addRenown === 'function') window.addRenown('titan_milestone');
        const f = m[1] * t.tier;
        if (typeof window.guildHallAdd === 'function') window.guildHallAdd(f);
        logT(t, '🎯 The Titan is down to ' + m[0] + '%: +' + fmt(f) + ' to the Hall Fund.');
        if (typeof window.notify === 'function') window.notify({ icon: '🎯', title: nameFor(t.tier).name + ' at ' + m[0] + '%', text: '+' + fmt(f) + ' to the Hall Fund.', kind: 'info', duration: 5000 });
      }
    });
  }

  // ---- the fight ----
  function startAttempt(){
    if (!sequel()) return;
    const t = titan();
    if (game.inCombat) { toast('Finish the current fight first.'); return; }
    if (t.hp <= 0) { toast('The Titan has fallen. Another is rising.'); return; }
    if (attemptsLeft(t) <= 0) { toast('No attempts left today. They reset at midnight.'); return; }
    const info = nameFor(t.tier);
    const dmg = Math.max(20, Math.round(0.32 * avgMaxHp() * (1 + 0.1 * (t.tier - 1))));
    t.used += 1; t.attemptStart = t.hp; t.attemptDmg = dmg;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    startCombat({ kind: 'tide_titan', key: 'tide_titan', enemy: { name: info.name, icon: info.icon, hp: t.hp, dmg: dmg, xp: 0, gold: 0,
      desc: 'A shared health bar the whole of Fair Tide is working down. You have ' + LIMIT + ' rounds. Every point of damage counts, and it hits harder each round.' } });
    if (typeof logCombat === 'function') logCombat('⏳ <b>' + LIMIT + ' rounds.</b> The surge builds every round.');
  }
  function afterAttemptMessage(hp, max, dealt, how){
    return (how === 'down' ? '🏆 The Titan falls!' : how === 'defeat' ? 'The crew is driven back.' : how === 'retreat' ? 'You pull the crew back.' : 'Time. The Titan holds.') +
      ' You dealt ' + fmt(dealt) + ' damage.' + (how === 'down' ? '' : ' ' + fmt(hp) + ' of ' + fmt(max) + ' remains.');
  }
  function settle(how, alreadyResolved){
    const t = titan(), e = game.combatEnemy;
    if (!e || e.kind !== 'tide_titan') return;
    if (!alreadyResolved) {
      game.combatResolved = true; game.inCombat = false; game.combatPartyOverride = null; game.autoBattle = false;
      if (game.combatActionTimer) { clearTimeout(game.combatActionTimer); game.combatActionTimer = null; }
      try { if (typeof stopAutoBattle === 'function') stopAutoBattle(); } catch (er) {}
    }
    const left = how === 'down' ? 0 : Math.max(0, game.combatEnemyHp);
    const dealt = Math.max(0, (t.attemptStart || t.hp) - left);
    t.hp = left;
    t.youTotal = (t.youTotal || 0) + dealt; t.todayDmg = (t.todayDmg || 0) + dealt;
    const frac = Math.min(1.5, dealt / Math.max(1, t.D));
    const gold = Math.round((100 + lvl() * 6) * (0.5 + frac));
    game.gold = (game.gold || 0) + gold; game.reputation = (game.reputation || 0) + 1;
    logT(t, '⚔️ You dealt ' + fmt(dealt) + ' damage (+' + fmt(gold) + 'g).');
    if (typeof window.addRenown === 'function') window.addRenown('titan_attempt');
    checkMilestones(t);
    let extra = '';
    const shownHp = t.hp, shownMax = t.maxHp;
    if (t.hp <= 0) extra = kill(t);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    const msg = afterAttemptMessage(shownHp, shownMax, dealt, how) + ' +' + fmt(gold) + 'g.' + extra;
    game.pendingPostBattle = { message: msg, buttonsHtml:
      '<button class="btn btn-success" onclick="exitBattleToPort(); goScreen(\'fairtide\'); switchFairTideTab(\'titan\')">🌊 Back to the Titan</button> ' +
      '<button class="btn" onclick="exitBattleToPort()">🏛️ Return to Port</button>' };
    if (typeof renderPendingPostBattle === 'function') renderPendingPostBattle();
    if (typeof dailyBump === 'function') dailyBump('titan', 0);
  }
  function kill(t){
    const tier = t.tier, info = nameFor(tier);
    const gold = Math.round(lvl() * 150 * tier);
    game.gold = (game.gold || 0) + gold; game.reputation = (game.reputation || 0) + 10;
    if (typeof window.guildHallAdd === 'function') window.guildHallAdd(25000 * tier);
    let charter = '';
    if (typeof window.addGearToInventory === 'function' && !(game.titanTrophies || {})[tier]) {
      game.titanTrophies = game.titanTrophies || {}; game.titanTrophies[tier] = true;
      window.addGearToInventory({ id: 'titan_tooth_t' + tier, name: 'Titan\'s Tooth, Tier ' + tier, icon: '🦷', slot: 'amulet', family: 'any', hp: 30 + 10 * tier, magic: 6 + 2 * tier, spd: 2 + tier, tier: Math.min(5, 2 + tier), desc: 'A tooth from ' + info.name + ', set on a cord. It hums when the tide turns.' });
      charter = ' A trophy amulet is in your inventory.';
    }
    t.kills = (t.kills || 0) + 1;
    if (typeof window.addRenown === 'function') window.addRenown('titan_kill');
    logT(t, '🏆 ' + info.name + ' fell: +' + fmt(gold) + 'g, +' + fmt(25000 * tier) + ' to the Hall Fund.');
    if (typeof window.notify === 'function') window.notify({ icon: '🏆', title: info.name + ' has fallen', text: '+' + fmt(gold) + 'g, +' + fmt(25000 * tier) + ' to the Hall Fund.' + charter + ' A stronger one is already rising.', kind: 'info', duration: 9000 });
    spawn(t, tier + 1);
    return ' ' + info.name + ' has fallen! +' + fmt(gold) + 'g.' + charter + ' A stronger one is rising.';
  }
  // wrappers
  const oldVictory = window.handleVictory;
  if (typeof oldVictory === 'function') window.handleVictory = function(){
    const e = game.combatEnemy, isT = e && e.kind === 'tide_titan' && !game.combatResolved;
    const r = oldVictory.apply(this, arguments);
    try { if (isT) settle('down', true); } catch (er) { console.error('titan victory', er); }
    return r;
  };
  const oldDefeat = window.handleDefeat;
  if (typeof oldDefeat === 'function') window.handleDefeat = function(){
    const e = game.combatEnemy;
    if (e && e.kind === 'tide_titan' && game.inCombat && !game.combatResolved) { try { settle('defeat', false); } catch (er) { console.error('titan defeat', er); } if (typeof renderCombat === 'function') window.renderCombat(); return; }
    return oldDefeat.apply(this, arguments);
  };
  const oldFlee = window.fleeCombat;
  if (typeof oldFlee === 'function') window.fleeCombat = function(){
    const e = game.combatEnemy;
    if (e && e.kind === 'tide_titan' && game.inCombat && !game.combatResolved) { settle('retreat', false); window.renderCombat(); return; }
    return oldFlee.apply(this, arguments);
  };
  const oldCounter = window.enemyCounterAttack;
  if (typeof oldCounter === 'function') window.enemyCounterAttack = function(){
    try { const e = game.combatEnemy; if (e && e.kind === 'tide_titan') { e.baseDmg = e.baseDmg || e.dmg; e.dmg = Math.round(e.baseDmg * (1 + 0.05 * Math.min(8, Math.max(0, (game.combatRound || 1) - 1)))); } } catch (er) {}
    return oldCounter.apply(this, arguments);
  };
  const oldRenderCombat = window.renderCombat;
  if (typeof oldRenderCombat === 'function') window.renderCombat = function(){
    const r = oldRenderCombat.apply(this, arguments);
    try {
      const e = game.combatEnemy;
      if (e && e.kind === 'tide_titan' && game.inCombat && !game.combatResolved && (game.combatRound || 1) > LIMIT) { settle('time', false); return oldRenderCombat.apply(this, arguments); }
    } catch (er) { console.error('titan limit', er); }
    return r;
  };

  // ---- dailies ----
  const TASKS = [
    { id: 'wins',     label: 'Win 3 battles',                      need: 3 },
    { id: 'sell',     label: 'Sell 10 goods',                      need: 10 },
    { id: 'quests',   label: 'Finish a quest or bounty',           need: 1 },
    { id: 'checkins', label: 'Check in on 2 Fair Tide residents',  need: 2 },
    { id: 'hall',     label: 'Visit the Guild Hall',               need: 1 },
    { id: 'play',     label: 'Play a game at Game Night',          need: 1 },
    { id: 'titan',    label: 'Challenge the Titan 3 times',        need: 3 }
  ];
  function dailies(){
    const d = game.dailies = game.dailies || {};
    if (d.day !== today()) { d.day = today(); d.p = {}; d.claimed = {}; d.bonus = false; }
    return d;
  }
  function prog(id){ const d = dailies(); if (id === 'titan') return Math.min(3, titan().used || 0); return Math.min((TASKS.find(function(t){ return t.id === id; }) || {}).need || 0, d.p[id] || 0); }
  function dailyBump(id, n){
    if (!sequel()) return;
    const d = dailies();
    if (id !== 'titan') d.p[id] = (d.p[id] || 0) + n;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  }
  window.dailyBump = dailyBump;
  function taskReward(){ return { gold: Math.round(80 + lvl() * 3), fund: 1000 }; }
  window.__ctDailyClaim = function(id){
    const d = dailies(), t = TASKS.find(function(x){ return x.id === id; });
    if (!t || d.claimed[id] || prog(id) < t.need) return;
    d.claimed[id] = true;
    const r = taskReward();
    game.gold = (game.gold || 0) + r.gold;
    if (typeof window.guildHallAdd === 'function') window.guildHallAdd(r.fund);
    if (typeof window.addRenown === 'function') window.addRenown('daily');
    toast('📅 ' + t.label + ': +' + fmt(r.gold) + 'g, +' + fmt(r.fund) + ' to the Hall Fund. +10 Renown.', 3600);
    if (typeof updateUI === 'function') updateUI();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    refresh();
  };
  window.__ctDailyBonus = function(){
    const d = dailies();
    if (d.bonus || !TASKS.every(function(t){ return d.claimed[t.id]; })) return;
    d.bonus = true;
    if (typeof window.addRenown === 'function') window.addRenown('daily_bonus');
    const tt = titan(); tt.bonus = (tt.bonus || 0) + 1;
    const gold = Math.round(lvl() * 10);
    game.gold = (game.gold || 0) + gold; game.reputation = (game.reputation || 0) + 3;
    if (typeof window.notify === 'function') window.notify({ icon: '📅', title: 'Dailies complete', text: '+' + fmt(gold) + 'g, +3 reputation, and one extra Tide Titan attempt today.', kind: 'info', duration: 7000 });
    if (typeof updateUI === 'function') updateUI();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    refresh();
  };
  // counters: wrap what you already do
  function wrap(name, fn){ const old = window[name]; if (typeof old !== 'function') return; window[name] = function(){ return fn(old, this, arguments); }; }
  wrap('handleVictory', function(old, self, args){
    const e = game.combatEnemy, count = e && e.kind !== 'training' && e.kind !== 'tide_titan' && !game.combatResolved;
    const r = old.apply(self, args);
    try { if (count) dailyBump('wins', 1); } catch (er) {}
    return r;
  });
  wrap('sellGood', function(old, self, args){
    const id = args[0], before = Number((game.cargo || {})[id] || 0);
    const r = old.apply(self, args);
    try { const sold = before - Number((game.cargo || {})[id] || 0); if (sold > 0) dailyBump('sell', sold); } catch (er) {}
    return r;
  });
  wrap('checkQuestProgress', function(old, self, args){
    const before = (game.activeQuests || []).filter(function(q){ return q && !q.done; });
    const r = old.apply(self, args);
    try { const n = before.filter(function(q){ return q.done === true; }).length; if (n) dailyBump('quests', n); } catch (er) {}
    return r;
  });
  wrap('checkInOnResident', function(old, self, args){
    const can = typeof window.canCheckInOnResident === 'function' && window.canCheckInOnResident(args[0]);
    const r = old.apply(self, args);
    if (can) dailyBump('checkins', 1);
    return r;
  });
  wrap('checkInAllResidents', function(old, self, args){
    const ids = typeof window.checkInTargetIds === 'function' ? window.checkInTargetIds().filter(function(id){ return window.canCheckInOnResident(id); }) : [];
    const r = old.apply(self, args);
    if (ids.length) dailyBump('checkins', ids.length);
    return r;
  });

  // ---- tabs ----
  function refresh(){ if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub(); }
  window.__ctTitanGo = startAttempt;
  window.__ctTitanRally = function(){
    const t = titan(), cost = 10000 * t.tier;
    if (t.rallyUntil && t.rallyUntil > Date.now()) return;
    if (typeof window.guildHallSpend !== 'function' || !window.guildHallSpend(cost)) { toast('The Hall Fund needs ' + fmt(cost) + '.'); return; }
    t.rallyUntil = Date.now() + 6 * HOUR;
    logT(t, '📣 You rallied the Hall: double idle damage for 6 hours.');
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    refresh();
  };
  function bar(pct, color){ return '<div style="background:rgba(0,0,0,.4);border-radius:6px;height:14px;overflow:hidden;margin:6px 0;"><div style="width:' + Math.max(0, Math.min(100, pct)) + '%;height:100%;background:' + color + ';"></div></div>'; }
  function renderTitan(){
    const el = document.getElementById('ft-tab-titan'); if (!el) return;
    if (!sequel()) { el.innerHTML = '<div class="story-chip">The Tide Titan appears once the sequel begins.</div>'; return; }
    const gained = idle(), t = titan(), info = nameFor(t.tier), now = Date.now();
    const pct = t.hp / t.maxHp * 100, left = attemptsLeft(t);
    const rally = t.rallyUntil && t.rallyUntil > now;
    let html = '<div class="panel-title">🌊 The Tide Titan</div>' +
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">One huge health bar that all of Fair Tide works down together. Each attempt is up to ' + LIMIT + ' rounds, and the damage you deal comes off the bar. Guild Hall members chip at it while you are away, but the last blow has to be yours.</p>';
    if (gained > 0) html += '<div class="story-chip" style="margin-bottom:8px;">🛠️ Hall members dealt ' + fmt(gained) + ' damage while you were away.</div>';
    html += '<article class="quest-item"><strong>' + info.icon + ' ' + esc(info.name) + '</strong> <span class="story-chip">Tier ' + t.tier + '</span><br>' +
      bar(pct, 'linear-gradient(90deg,#3a8fb7,#7fd1e8)') +
      '<span style="font-size:.82rem;opacity:.85;">' + fmt(t.hp) + ' / ' + fmt(t.maxHp) + ' (' + Math.round(pct) + '%) · Titans felled: ' + (t.kills || 0) + '</span><br>' +
      '<span style="font-size:.8rem;margin-top:4px;display:block;">⚔️ Attempts today: <b>' + left + '</b> of ' + (DAILY_ATTEMPTS + (t.bonus || 0)) + ' · your damage today ' + fmt(t.todayDmg || 0) + ' · all time ' + fmt(t.youTotal || 0) + '</span>' +
      '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">' +
      '<button class="btn btn-danger"' + (left <= 0 || t.hp <= 0 || game.inCombat ? ' disabled' : '') + ' onclick="__ctTitanGo()">⚔️ Challenge the Titan</button>' +
      '<button class="btn btn-small"' + (rally ? ' disabled' : '') + ' onclick="__ctTitanRally()">' + (rally ? '📣 Hall rallied · ' + Math.ceil((t.rallyUntil - now) / 60000) + 'm' : '📣 Rally the Hall · ' + fmt(10000 * t.tier) + ' fund') + '</button></div></article>';
    html += '<div style="font-size:.78rem;opacity:.75;margin:6px 0;">Milestones at 75%, 50% and 25% add to the Hall Fund. Felling it pays gold, reputation, a trophy amulet and a big Hall Fund bonus, and the next Titan is stronger.</div>';
    if (t.log && t.log.length) html += '<div class="panel-title" style="margin-top:10px;font-size:1rem;">📜 Recent</div>' + t.log.map(function(l){ return '<div style="font-size:.78rem;opacity:.85;margin:2px 0;">' + esc(l.text) + '</div>'; }).join('');
    el.innerHTML = html;
  }
  function renderDailies(){
    const el = document.getElementById('ft-tab-dailies'); if (!el) return;
    if (!sequel()) { el.innerHTML = '<div class="story-chip">Dailies begin with the sequel.</div>'; return; }
    const d = dailies(), r = taskReward();
    const allClaimed = TASKS.every(function(t){ return d.claimed[t.id]; });
    let html = '<div class="panel-title">📅 Dailies</div><p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">Small things you already do, tallied for today. They reset at midnight. Quests and bounties work exactly as before.</p>' +
      (typeof window.renownLine === 'function' ? '<div class="story-chip" style="margin-bottom:8px;">🏅 ' + window.renownLine() + ' Each claimed daily adds 10 Renown.</div>' : '');
    TASKS.forEach(function(t){
      const p = prog(t.id), done = p >= t.need, claimed = d.claimed[t.id];
      html += '<article class="quest-item"><strong>' + (claimed ? '✓ ' : done ? '🎁 ' : '○ ') + t.label + '</strong> <span class="story-chip">' + p + '/' + t.need + '</span><br>' +
        bar(p / t.need * 100, claimed ? '#4caf50' : '#e8c547') +
        (claimed ? '<span style="font-size:.76rem;opacity:.7;">Claimed.</span>' : '<button class="btn btn-small btn-success"' + (done ? '' : ' disabled') + ' onclick="__ctDailyClaim(\'' + t.id + '\')">Claim ' + fmt(r.gold) + 'g + ' + fmt(r.fund) + ' fund</button>') + '</article>';
    });
    html += '<article class="quest-item" style="border-left-color:var(--gold);"><strong>🌟 All done</strong><br><span style="font-size:.8rem;opacity:.85;">Claim every task for ' + fmt(lvl() * 10) + 'g, +3 reputation and one extra Titan attempt today.</span><br>' +
      (d.bonus ? '<span style="font-size:.76rem;opacity:.7;">Bonus claimed.</span>' : '<button class="btn btn-small btn-success" style="margin-top:6px;"' + (allClaimed ? '' : ' disabled') + ' onclick="__ctDailyBonus()">Claim the bonus</button>') + '</article>';
    el.innerHTML = html;
  }
  const oldHub = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings', show = sequel();
    ['titan', 'dailies'].forEach(function(k){
      const el = document.getElementById('ft-tab-' + k), btn = document.getElementById('ft-tab-btn-' + k);
      if (el) el.classList.toggle('active', tab === k);
      if (btn) { btn.classList.toggle('active', tab === k); btn.style.display = show ? '' : 'none'; }
    });
    if (oldHub) oldHub.apply(this, arguments);
    if (tab === 'titan') renderTitan();
    if (tab === 'dailies') renderDailies();
    if (tab === 'guildhall' && sequel()) dailyBump('hall', 1);
  };
  window.titanIdleTick = idle;
  setInterval(function(){ try { if (typeof gameSessionActive !== 'undefined' && gameSessionActive && sequel()) idle(); } catch (e) {} }, 60 * 1000);
})();
