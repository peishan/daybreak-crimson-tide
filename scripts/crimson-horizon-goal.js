(function(){
  // -------------------------------------------------------------------
  // CRIMSON HORIZON OBJECTIVE BANNER -- the Current Objective banner's
  // chain of arc labels ends at Arc XLII, so after the main story it gave
  // no hint of what to do next. Once Arc XLII is complete this shows the
  // sequel's next step instead: reach Level 465, sail to the chapter's
  // port, or open Story. It runs after the existing banner has rendered
  // and only replaces it in that situation.
  // -------------------------------------------------------------------
  function portName(id){
    const p = (typeof PORTS !== 'undefined') ? PORTS.find(function(x){ return x.id === id; }) : null;
    return p ? p.name : id;
  }

  const oldRenderMainGoalForCH = window.renderMainGoal;
  window.renderMainGoal = function(){
    if (oldRenderMainGoalForCH) oldRenderMainGoalForCH.apply(this, arguments);
    const el = document.getElementById('mainGoalPanel');
    if (!el || !game.arc42Complete || typeof window.crimsonHorizonObjectiveState !== 'function') return;
    const so = window.crimsonHorizonObjectiveState();
    let title, text, button = '';
    if (so === null) {
      title = 'Crimson Horizon — Reach Level 465';
      text = 'Level ' + level() + ' / 465. The next voyage opens at Level 465: earn XP from the Reach, raids, bounties and trading.';
    } else if (typeof so === 'string' && so.indexOf('crimson_horizon_level_gate_') === 0) {
      const arc = Number(so.split('_').pop()), gate = window.crimsonHorizonArcLevel(arc);
      title = 'Crimson Horizon — Reach Level ' + gate;
      text = 'Level ' + level() + ' / ' + gate + '. Arc ' + arc + ' opens at Level ' + gate + ': earn XP from the Reach, raids, bounties and trading.';
    } else if (typeof so === 'string' && so.indexOf('crimson_horizon_renown_gate_') === 0) {
      const arc = Number(so.split('_').pop()), gi = (typeof window.renownGateInfo === 'function') ? window.renownGateInfo() : null, need = gi ? gi.need : window.renownNeededForArc(arc);
      title = 'Crimson Horizon — Earn Renown for Arc ' + arc;
      text = 'Renown ' + window.sequelRenown() + ' / ' + need + '. The next chapter of Arc ' + arc + ' needs ' + need + ' Renown: finish Dailies, challenge the Tide Titan, clear optional bosses and sea monsters, hold Hall events, and do quests and bounties.';
      button = '<button class="btn btn-small btn-magic" onclick="goScreen(\'fairtide\'); switchFairTideTab(\'dailies\')">📅 Open Dailies</button>';
    } else if (so === 'crimson_horizon_pacing_hold') {
      title = 'Crimson Horizon — A New Day';
      text = (typeof window.pacingLine === 'function' ? window.pacingLine() : 'That is enough story for today.') + ' A new game day begins when you set sail.';
      button = '<button class="btn btn-small btn-magic" onclick="goScreen(\'navigate\')">⛵ Set Sail</button>';
    } else if (so === 'crimson_horizon_part1_complete_for_now') {
      title = 'Crimson Horizon — All Caught Up';
      text = 'Every available chapter is read. More is on the way.';
    } else {
      const ch = (window.CRIMSON_HORIZON_CHAPTERS || []).find(function(c){ return so === 'complete_crimson_horizon_chapter_' + c.id; });
      if (!ch) return;
      const portId = (typeof window.crimsonHorizonChapterPort === 'function') ? window.crimsonHorizonChapterPort(ch.id) : null;
      const docked = !portId || game.location === portId || (ch.id <= 4 && game.location === 'harbor_beyond_charts');
      title = ch.title;
      if (docked) {
        text = 'Open Story and read the chapter.';
        button = '<button class="btn btn-small btn-success" onclick="goScreen(\'story\')">📖 Open Story</button>';
      } else {
        text = 'Sail to ' + portName(portId) + ' to continue the voyage.';
        button = '<button class="btn btn-small btn-magic" onclick="sailTo(\'' + portId + '\')">⛵ Sail to ' + esc(portName(portId)) + '</button>';
      }
    }
    let optional = 'Optional: complete bounties for extra XP and gold.';
    if (typeof window.blackPearlBriefingReady === 'function' && window.blackPearlBriefingReady()) optional = 'Optional: the Black Pearl briefing is ready in Research Team.';
    else if (typeof window.blackPearlObservationsReady === 'function' && window.blackPearlObservationsReady()) optional = 'Optional: the first Black Pearl observations are ready in Research Team.';
    el.innerHTML = '<div class="ct-goal-kicker">Current Objective</div><div class="ct-goal-title">🎯 ' + esc(title) + '</div><div class="ct-goal-text">' + esc(text) + '</div>' +
      (button ? '<div style="margin-top:6px;">' + button + '</div>' : '') + '<div class="ct-goal-optional">' + esc(optional) + '</div>';
  };
})();
