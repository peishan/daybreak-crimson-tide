(function(){
  // -------------------------------------------------------------------
  // AUTO-REACH -- an idle-friendly loop for the Uncharted Reach and the
  // Research Expedition, built for leaving the game running on a phone
  // while San works.
  //
  //   LIVE (app open): Auto turns auto-battle on and continues wave after
  //   wave on its own. Every N waves (3 / 5 / 10, default 5) is a
  //   CHECKPOINT: the party rests -- full HP and MP, and anyone who fell
  //   is revived -- for Fair Tide Food (5 + 1 per 10 waves). Between
  //   checkpoints it stops if anyone has fallen or drops below the chosen
  //   HP threshold (30 / 40 / 50%, default 40), and at a checkpoint it
  //   stops if there isn't enough Food. It also stops on defeat or when
  //   the run is retreated. A screen Wake Lock keeps the phone awake
  //   while it runs.
  //
  //   AWAY (Reach only): a phone suspends the page once the screen is off,
  //   so live auto-running can't continue. When the player comes back (or
  //   reopens the app) after 3+ minutes with Auto-Reach on, the waves the
  //   party would have farmed are simulated in one go: up to 8 hours, at
  //   60% of the live rate, farming the last wave the party actually
  //   cleared (never climbing past what it has proven), spending Food at
  //   each checkpoint and stopping when Food runs out. XP and gold only:
  //   it does NOT touch the championship wave record, so Reach markers
  //   still need active play. The Research Expedition is live-only (its
  //   Knowledge/Residue feed the Horizon Engine story).
  // -------------------------------------------------------------------

  const AWAY_MIN_SECONDS = 180;
  const AWAY_CAP_SECONDS = 8 * 3600;
  const AWAY_RATE = 0.6;
  const STEP_DELAY_MS = 1500;
  const EVERY_CHOICES = [3, 5, 10];
  const STOP_CHOICES = [30, 40, 50];

  const MODES = {
    uncharted: {
      label: 'Uncharted Reach', kind: 'uncharted', tab: 'uncharted',
      state: function(){ return window.unchartedState(); },
      enter: function(){ window.enterUnchartedReach(); },
      cont: function(){ window.continueUnchartedReach(); },
      away: true
    },
    expedition: {
      label: 'Research Expedition', kind: 'expedition', tab: 'expedition',
      state: function(){ return window.expeditionState(); },
      enter: function(){ window.enterResearchExpedition(); },
      cont: function(){ window.continueResearchExpedition(); },
      away: false
    }
  };

  function ra(){
    game.reachAuto = game.reachAuto || {};
    const r = game.reachAuto;
    if (typeof r.on !== 'boolean') r.on = false;
    if (!MODES[r.mode]) r.mode = 'uncharted';
    if (EVERY_CHOICES.indexOf(r.every) === -1) r.every = 5;
    if (STOP_CHOICES.indexOf(r.stopPct) === -1) r.stopPct = 40;
    if (!(r.avgWaveSec > 0)) r.avgWaveSec = 50;
    return r;
  }
  window.reachAutoState = ra;

  function foodCost(wave){ return 5 + Math.floor((wave || 0) / 10); }
  window.reachAutoFoodCost = foodCost;
  function resources(){ game.fairTideResources = game.fairTideResources || {timber:0, stone:0, food:0, trade:0}; return game.fairTideResources; }

  // ---- party helpers ----
  function combatParty(){
    try { return (typeof getCrimsonCombatParty === 'function') ? getCrimsonCombatParty() : getActiveParty(); } catch(e) { return getActiveParty(); }
  }
  function partyStatus(){
    let fallen = null, minPct = 1, minName = '';
    combatParty().forEach(function(m){
      if (!m || (typeof UNKILLABLE_IDS !== 'undefined' && UNKILLABLE_IDS.has(m.id))) return;
      const hp = partyHpOf(m), max = Math.max(1, effectiveMaxHp(m));
      if (hp <= 0 && !fallen) fallen = m.name || m.id;
      const pct = hp / max;
      if (pct < minPct) { minPct = pct; minName = m.name || m.id; }
    });
    return { fallen: fallen, minPct: minPct, minName: minName };
  }
  function fullHeal(){
    game.partyHp = game.partyHp || {}; game.partyMp = game.partyMp || {};
    getActiveParty().forEach(function(m){
      game.partyHp[m.id] = effectiveMaxHp(m);
      game.partyMp[m.id] = effectiveMaxMp(m);
    });
    (game.temporaryCrew || []).forEach(function(m){
      game.partyHp[m.id] = Number(m.maxHp || m.hp || 1);
      game.partyMp[m.id] = Number(m.maxMp || m.mp || 0);
    });
  }

  // ---- wake lock (keeps the phone awake while running live) ----
  let wakeLock = null;
  function acquireWakeLock(){
    try {
      if (navigator.wakeLock && !wakeLock) {
        navigator.wakeLock.request('screen').then(function(l){
          wakeLock = l;
          l.addEventListener('release', function(){ wakeLock = null; });
        }).catch(function(){});
      }
    } catch(e) {}
  }
  function releaseWakeLock(){ try { if (wakeLock) wakeLock.release(); } catch(e) {} wakeLock = null; }

  function refreshTab(){
    const t = game.fairTideActiveTab;
    if ((t === 'uncharted' || t === 'expedition') && typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  }

  function stop(reason){
    const r = ra();
    if (!r.on) return;
    r.on = false;
    r.pendingStep = false;
    releaseWakeLock();
    if (r.prevAuto !== undefined) { game.autoBattle = !!r.prevAuto; r.prevAuto = undefined; }
    r.lastStop = reason;
    toast('⏹ Auto stopped: ' + reason, 5000);
    if (typeof logEvent === 'function') logEvent('⏹ Auto-Reach stopped: ' + reason, 'neutral');
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    refreshTab();
  }
  window.__ctAutoStop = function(){ stop('stopped by you.'); };

  // ---- the live loop ----
  function autoStep(){
    const r = ra();
    if (!r.on) return;
    const M = MODES[r.mode];
    const st = M.state();
    if (!st.active) { stop('the run ended.'); return; }
    if (game.inCombat) return; // a fight is underway; the next victory schedules the next step
    if (document.hidden) { r.pendingStep = true; return; }
    r.pendingStep = false;
    const wave = st.wave || 0;
    if (wave > 0 && wave % r.every === 0) {
      const cost = foodCost(wave), res = resources();
      if ((res.food || 0) < cost) { stop('out of Food for the wave ' + wave + ' checkpoint rest (' + cost + ' needed).'); return; }
      res.food -= cost;
      fullHeal();
      r.rests = (r.rests || 0) + 1;
      toast('🏕️ Checkpoint at wave ' + wave + ': the party rests (−' + cost + ' Food).', 3000);
      if (typeof logEvent === 'function') logEvent('🏕️ Checkpoint rest at wave ' + wave + ' (−' + cost + ' Food). Everyone is fully recovered.', 'good');
    } else {
      const ps = partyStatus();
      if (ps.fallen) { stop(ps.fallen + ' has fallen.'); return; }
      if (ps.minPct * 100 < r.stopPct) { stop(ps.minName + ' is below ' + r.stopPct + '% HP.'); return; }
    }
    game.autoBattle = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    M.cont();
  }
  window.__ctAutoStep = autoStep;

  // Victory / defeat hooks: wrapped, not edited, same as raid-mode.js.
  const oldHandleVictory = window.handleVictory;
  window.handleVictory = function(){
    const enemy = game.combatEnemy;
    const was = !!(game.inCombat && !game.combatResolved);
    if (oldHandleVictory) oldHandleVictory.apply(this, arguments);
    const r = ra();
    if (was && enemy && r.on && enemy.kind === MODES[r.mode].kind) {
      if (r.waveStart && !document.hidden) {
        const dur = (Date.now() - r.waveStart) / 1000 + STEP_DELAY_MS / 1000;
        if (dur > 3 && dur < 300) r.avgWaveSec = Math.round(r.avgWaveSec * 0.7 + dur * 0.3);
      }
      setTimeout(autoStep, STEP_DELAY_MS);
    }
  };
  const oldHandleDefeat = window.handleDefeat;
  window.handleDefeat = function(){
    const enemy = game.combatEnemy;
    const was = !!(game.inCombat && !game.combatResolved);
    if (oldHandleDefeat) oldHandleDefeat.apply(this, arguments);
    const r = ra();
    if (was && enemy && r.on && enemy.kind === MODES[r.mode].kind) stop('the party was defeated.');
  };
  ['spawnUnchartedWave', 'spawnExpeditionWave'].forEach(function(name){
    const old = window[name];
    if (typeof old !== 'function') return;
    window[name] = function(){ ra().waveStart = Date.now(); return old.apply(this, arguments); };
  });
  [['retreatUnchartedReach', 'uncharted'], ['retreatResearchExpedition', 'expedition']].forEach(function(p){
    const old = window[p[0]];
    if (typeof old !== 'function') return;
    window[p[0]] = function(){
      const r = ra();
      if (r.on && r.mode === p[1]) stop('you retreated.');
      return old.apply(this, arguments);
    };
  });

  window.__ctAutoSet = function(key, value){
    const r = ra();
    if (key === 'every' && EVERY_CHOICES.indexOf(Number(value)) !== -1) r.every = Number(value);
    if (key === 'stopPct' && STOP_CHOICES.indexOf(Number(value)) !== -1) r.stopPct = Number(value);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    refreshTab();
  };

  window.__ctAutoStart = function(mode){
    const M = MODES[mode];
    if (!M) return;
    const r = ra();
    if (mode === 'expedition' && !window.isExpeditionUnlocked()) { toast('🔒 Complete Arc VIII first.'); return; }
    if (r.on && r.mode !== mode) stop('switching to the ' + M.label + '.');
    r.mode = mode; r.on = true; r.rests = 0; r.lastStop = null;
    if (r.prevAuto === undefined) r.prevAuto = !!game.autoBattle;
    game.autoBattle = true;
    acquireWakeLock();
    const st = M.state();
    const fighting = game.inCombat && game.combatEnemy && game.combatEnemy.kind === M.kind;
    if (st.active && fighting) { toast('🤖 Auto is on. It continues after this fight.', 3000); if (typeof goScreen === 'function') goScreen('combat'); }
    else if (st.active) autoStep();
    else M.enter();
    refreshTab();
  };

  // gainXP() caps a single grant at 5000, so a bulk payout goes in chunks
  // (normal rules apply to each). Past a sane number of calls the rest is
  // added directly, then one gainXP(0) runs the level-up bookkeeping.
  function grantBulkXp(total){
    let left = Math.max(0, Math.round(total)), calls = 0;
    while (left > 0 && calls < 200) { const chunk = Math.min(left, 5000); gainXP(chunk); left -= chunk; calls++; }
    if (left > 0) { game.xpTotal += left; gainXP(0); }
  }

  // ---- away simulation (Reach only) ----
  function simulateAway(elapsedMs, opts){
    opts = opts || {};
    const r = ra();
    if (!r.on || !MODES[r.mode].away) return null;
    const uc = window.unchartedState();
    const fightingNow = game.inCombat && game.combatEnemy && game.combatEnemy.kind === 'uncharted';
    const cleared = Math.max(0, (uc.wave || 0) - (fightingNow ? 1 : 0));
    if (cleared < 1) return null;
    const sec = Math.min(AWAY_CAP_SECONDS, elapsedMs / 1000);
    const perWave = Math.min(300, Math.max(15, r.avgWaveSec));
    const liveDuringAway = Math.max(0, (uc.wave || 0) - (r.waveAtHide || uc.wave || 0));
    let waves = Math.max(0, Math.floor(sec / perWave) - liveDuringAway);
    if (waves < 1) return null;

    const res = resources();
    let done = 0, food = res.food || 0, spent = 0, stopReason = null, rests = 0;
    const cost = foodCost(cleared);
    while (done < waves) {
      done++;
      if (done % r.every === 0) {
        if (food >= cost) { food -= cost; spent += cost; rests++; }
        else { stopReason = 'ran out of Food for a checkpoint rest'; break; }
      }
    }
    // Average reward per wave at the farmed wave, from the real generator.
    let xpSum = 0, goldSum = 0; const SAMPLES = 16;
    for (let i = 0; i < SAMPLES; i++) {
      const e = window.generateUnchartedEnemy(cleared, uc.difficulty);
      if (e) { xpSum += e.xp; goldSum += e.gold; }
    }
    const tb = (typeof window.getUnchartedTierBonus === 'function') ? window.getUnchartedTierBonus() : 0;
    const k = (1 + tb) * AWAY_RATE * done / SAMPLES;
    const xp = Math.round(xpSum * k), gold = Math.round(goldSum * k);
    res.food = food;
    if (xp > 0) {
      grantBulkXp(xp);
      if (typeof window.grantCharacterCombatXP === 'function') window.grantCharacterCombatXP(combatParty(), xp);
    }
    game.gold = (game.gold || 0) + gold;
    uc.totalKills = (uc.totalKills || 0) + done; uc.totalXp = (uc.totalXp || 0) + xp; uc.totalGold = (uc.totalGold || 0) + gold;
    if (rests && !stopReason) fullHeal();
    r.lastSimAt = Date.now();
    r.report = { waves: done, farmWave: cleared, xp: xp, gold: gold, food: spent, rests: rests, minutes: Math.round(sec / 60), stopped: stopReason, at: Date.now() };
    if (typeof logEvent === 'function') logEvent('🌊 Auto-Reach while away (' + r.report.minutes + ' min): ' + done + ' waves at wave ' + cleared + ' · +' + xp + ' XP · +' + gold + 'g · −' + spent + ' Food.', 'gold');
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (!opts.silent) showAwayReport(r.report);
    return r.report;
  }
  window.__ctAutoSimulateAway = simulateAway;

  function showAwayReport(rep){
    const hrs = rep.minutes >= 60 ? (Math.floor(rep.minutes / 60) + 'h ' + (rep.minutes % 60) + 'm') : (rep.minutes + 'm');
    let html = '<div>While you were away (' + hrs + '), the party kept farming the Reach.</div>' +
      '<div style="margin-top:8px;">🌊 ' + rep.waves + ' waves at Wave ' + rep.farmWave + '<br>⭐ +' + rep.xp + ' XP · 💰 +' + rep.gold + 'g<br>🍚 −' + rep.food + ' Food (' + rep.rests + ' checkpoint rest' + (rep.rests === 1 ? '' : 's') + ')</div>' +
      '<div style="margin-top:8px;font-size:.8rem;opacity:.75;">Paid at ' + Math.round(AWAY_RATE * 100) + '% of the live rate, capped at 8 hours.' +
      (rep.stopped ? ' The party stopped early: ' + esc(rep.stopped) + '.' : '') + '</div>';
    if (typeof showModal === 'function') showModal('🏕️ Auto-Reach — While You Were Away', html, [{ text: 'Continue', action: function(){ closeModal(); } }]);
  }

  // Returning to a live page: hidden -> visible.
  document.addEventListener('visibilitychange', function(){
    const r = ra();
    if (document.hidden) {
      r.hiddenAt = Date.now();
      const M = MODES[r.mode];
      r.waveAtHide = r.on ? (M.state().wave || 0) : 0;
      return;
    }
    if (!r.on) return;
    acquireWakeLock();
    const away = r.hiddenAt ? Date.now() - r.hiddenAt : 0;
    r.hiddenAt = 0;
    if (MODES[r.mode].away && away >= AWAY_MIN_SECONDS * 1000 && Date.now() - (r.lastSimAt || 0) > 60000) simulateAway(away);
    if (r.pendingStep || (!game.inCombat && MODES[r.mode].state().active)) setTimeout(autoStep, 800);
  });

  // Reopening the app: the page was closed, so live auto cannot resume.
  const oldProcessAFKRewards = window.processAFKRewards;
  window.processAFKRewards = function(){
    const prev = Number(game.lastActiveAt || 0);
    const result = oldProcessAFKRewards ? oldProcessAFKRewards.apply(this, arguments) : false;
    const r = ra();
    if (r.on && prev && Date.now() - prev >= AWAY_MIN_SECONDS * 1000) {
      const away = Date.now() - prev;
      setTimeout(function(){
        const rr = ra();
        if (!rr.on) return;
        const M = MODES[rr.mode];
        if (M.away && Date.now() - (rr.lastSimAt || 0) > 60000) simulateAway(away);
        // The old fight cannot resume after a reload; park the run.
        rr.on = false; rr.pendingStep = false;
        if (rr.prevAuto !== undefined) { game.autoBattle = !!rr.prevAuto; rr.prevAuto = undefined; }
        const st = M.state(); st.active = false;
        game.inCombat = false; game.pendingPostBattle = null;
        if (typeof saveGameQuiet === 'function') saveGameQuiet();
      }, 1200);
    }
    return result;
  };

  // ---- panel in the Reach / Expedition tabs ----
  function panelHtml(mode){
    const M = MODES[mode], r = ra(), st = M.state();
    const res = resources();
    const running = r.on && r.mode === mode;
    const wave = st.wave || 0;
    const nextCost = foodCost(Math.max(wave, 1));
    let h = '<div class="panel-title" style="margin-top:14px;">🤖 Auto-' + (mode === 'uncharted' ? 'Reach' : 'Expedition') + '</div>' +
      '<article class="quest-item">' +
      '<div style="font-size:.8rem;opacity:.85;line-height:1.35;">Fights on its own and continues wave after wave. Every <strong>' + r.every + '</strong> waves the party rests at a checkpoint (' + nextCost + ' Food now, you have ' + (res.food || 0) + ').</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;font-size:.78rem;align-items:center;">' +
      '<label>Rest every <select onchange="__ctAutoSet(\'every\', this.value)">' + EVERY_CHOICES.map(function(n){ return '<option value="' + n + '"' + (n === r.every ? ' selected' : '') + '>' + n + ' waves</option>'; }).join('') + '</select></label>' +
      '<label>Stop below <select onchange="__ctAutoSet(\'stopPct\', this.value)">' + STOP_CHOICES.map(function(n){ return '<option value="' + n + '"' + (n === r.stopPct ? ' selected' : '') + '>' + n + '% HP</option>'; }).join('') + '</select></label>' +
      '</div>';
    if (running) {
      h += '<div style="margin-top:8px;font-size:.8rem;">▶ Running' + (wave ? ' · Wave ' + wave : '') + (r.rests ? ' · ' + r.rests + ' rests' : '') + '</div>' +
        '<div style="margin-top:6px;"><button class="btn btn-small btn-danger" onclick="__ctAutoStop()">⏹ Stop Auto</button></div>';
    } else {
      const label = st.active ? '▶ Resume on Auto' : '▶ Sail In on Auto';
      h += '<div style="margin-top:8px;"><button class="btn btn-small btn-success" onclick="__ctAutoStart(\'' + mode + '\')">' + (mode === 'expedition' && !st.active ? '▶ Set Out on Auto' : label) + '</button></div>';
      if (r.lastStop) h += '<div style="margin-top:6px;font-size:.76rem;opacity:.8;">Last run stopped: ' + esc(r.lastStop) + '</div>';
    }
    h += '<div style="margin-top:8px;font-size:.74rem;opacity:.65;line-height:1.35;">Keeps the screen awake while it runs. ' +
      (M.away ? 'If you switch away or lock the phone, the party keeps farming wave ' + (wave || 'your best cleared wave') + ' in the background: up to 8 hours at 60% XP and gold (no championship progress), spending Food at each checkpoint.' : 'Live only: leaving the app pauses it.') + '</div>';
    if (M.away && r.report) {
      const rep = r.report;
      h += '<div style="margin-top:6px;font-size:.74rem;opacity:.75;">Last away run: ' + rep.waves + ' waves · +' + rep.xp + ' XP · +' + rep.gold + 'g · −' + rep.food + ' Food</div>';
    }
    return h + '</article>';
  }

  const oldRenderFairTideHubForAutoReach = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    if (oldRenderFairTideHubForAutoReach) oldRenderFairTideHubForAutoReach.apply(this, arguments);
    const tab = game.fairTideActiveTab;
    if (tab !== 'uncharted' && tab !== 'expedition') return;
    const el = document.getElementById('ft-tab-' + tab);
    if (!el) return;
    const old = document.getElementById('autoReachPanelWrap');
    if (old) old.remove();
    el.insertAdjacentHTML('beforeend', '<div id="autoReachPanelWrap">' + panelHtml(tab) + '</div>');
  };
})();
