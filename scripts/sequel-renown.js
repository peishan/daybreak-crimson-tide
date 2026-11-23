(function(){
  // -------------------------------------------------------------------
  // SEQUEL RENOWN. Levels and game days are no longer a brake on the sequel (a save that came through the main story has both far past any
  // gate), so from Arc XV each new arc also asks for Renown: a sequel-only score earned from the things you do here (Dailies, the Tide Titan,
  // optional bosses, sea monsters, Hall events and chests, quests and bounties, Game Night wins). Renown counts only from the day this
  // arrived, so a save partway through is not locked out, and the gate applies only at the START of an arc. State: game.renown = { earned, by }.
  // Tune: RENOWN_PER_ARC and FIRST_ARC.
  // -------------------------------------------------------------------
  const RENOWN_PER_ARC = 150, FIRST_ARC = 15;
  const AMOUNTS = {
    titan_attempt: 5, titan_milestone: 10, titan_kill: 100,
    daily: 10, daily_bonus: 40,
    game_night_win: 3,
    hall_event: 20, hall_chest: 30,
    sea_monster: 10, sea_alpha: 30,
    optional: 40, optional_peaceful: 20,
    quest: 5
  };
  const LABELS = { titan_attempt: 'Tide Titan attempts', titan_milestone: 'Titan milestones', titan_kill: 'Titans felled', daily: 'Dailies', daily_bonus: 'Dailies bonus', game_night_win: 'Game Night wins',
    hall_event: 'Hall events', hall_chest: 'Hall chests', sea_monster: 'Sea monsters', sea_alpha: 'Alpha sea monsters', optional: 'Optional bosses', optional_peaceful: 'Peaceful endings', quest: 'Quests and bounties' };
  function sequel(){ return !!(typeof game !== 'undefined' && game && game.arc42Complete); }
  function st(){ const r = game.renown = game.renown || {}; if (r.earned == null) r.earned = 0; r.by = r.by || {}; return r; }
  window.sequelRenown = function(){ return sequel() ? st().earned : 0; };
  window.renownNeededForArc = function(arc){ return arc < FIRST_ARC ? 0 : RENOWN_PER_ARC * (arc - FIRST_ARC + 1); };
  window.renownShort = function(arc){ return sequel() && arc >= FIRST_ARC && window.sequelRenown() < window.renownNeededForArc(arc); };
  window.renownBreakdown = function(){ const r = st(); return Object.keys(r.by).map(function(k){ return { key: k, label: LABELS[k] || k, n: r.by[k] }; }).sort(function(a, b){ return b.n - a.n; }); };

  // the arc waiting on Renown right now, or 0
  function waitingArc(){
    try { const so = window.crimsonHorizonObjectiveState(); const m = /^crimson_horizon_renown_gate_(\d+)$/.exec(String(so || '')); return m ? Number(m[1]) : 0; } catch (e) { return 0; }
  }
  window.addRenown = function(key, times){
    if (!sequel()) return 0;
    const amt = (AMOUNTS[key] || 0) * (times == null ? 1 : times);
    if (amt <= 0) return 0;
    const wasWaiting = waitingArc();
    const r = st(); r.earned += amt; r.by[key] = (r.by[key] || 0) + amt;
    try {
      if (wasWaiting && !window.renownShort(wasWaiting) && typeof window.notify === 'function') {
        window.notify({ icon: '🏅', title: 'Arc ' + wasWaiting + ' is open', text: 'You have earned the Renown (' + r.earned + ') the next arc asked for. Open Story to continue.', kind: 'info', duration: 7000 });
      }
      if (typeof saveGameQuiet === 'function') saveGameQuiet();
      if (typeof window.renderMainGoal === 'function') window.renderMainGoal();
    } catch (e) {}
    return amt;
  };

  // the places Renown comes from that are owned by older scripts: wrap them
  function wrap(name, fn){ const old = window[name]; if (typeof old !== 'function') return; window[name] = function(){ return fn(old, this, arguments); }; }
  wrap('onCrimsonHorizonFightWon', function(old, self, args){
    const r = old.apply(self, args), key = String(args[0]);
    if (key.indexOf('opt_') === 0 && !/:w\d+$/.test(key)) window.addRenown('optional');
    return r;
  });
  wrap('resolveCrimsonHorizonOptionalPeaceful', function(old, self, args){
    const before = JSON.stringify(game.crimsonHorizonOptional || {});
    const r = old.apply(self, args);
    if (JSON.stringify(game.crimsonHorizonOptional || {}) !== before) window.addRenown('optional_peaceful');
    return r;
  });
  wrap('checkQuestProgress', function(old, self, args){
    const before = (game.activeQuests || []).filter(function(q){ return q && !q.done; });
    const r = old.apply(self, args);
    try { const n = before.filter(function(q){ return q.done === true; }).length; if (n) window.addRenown('quest', n); } catch (e) {}
    return r;
  });

  // a one-line status for tabs and the banner
  window.renownLine = function(){
    const arc = waitingArc(), have = window.sequelRenown();
    if (arc) return 'Renown ' + have + ' / ' + window.renownNeededForArc(arc) + ' for Arc ' + arc + '.';
    return 'Renown ' + have + '.';
  };
})();
