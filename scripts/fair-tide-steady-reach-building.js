(function(){
  // -------------------------------------------------------------------
  // THE STEADY REACH BUILDING — a new Fair Tide Hub tab, gated on
  // game.arc39Complete rather than any single companion's recruitment.
  // Per San's own direction: ONE tab holding multiple rooms as
  // sub-sections, not one Hub tab per room (the Hub's own tab bar is
  // already long — see fair-tide-companion-rooms.js's four rooms, each
  // its own tab). First room: the Gym & Dance Room, Lewis and Aisy's
  // shared space — both established as loving exercise.
  //
  // Same once-per-day flavor-interaction shape as fair-tide-companion-
  // rooms.js: one button per room, +3 Fair Tide Mood, a rotating pool
  // of in-character lines. The key difference from that file: Lewis
  // and Aisy' are FAIR_TIDE_ALLY_NETWORK members, never actually
  // game.foundCompanions (never recruited, never relocated to Fair
  // Tide — arc39.js's own explicit restraint), so this gates on
  // game.arc39Complete instead of a per-companion recruitment flag.
  //
  // STEADY_REACH_ROOMS is an array on purpose — San mentioned more
  // rooms she wants but couldn't recall yet (Theo's workshop corner,
  // Wei Liang's counting house, Zul's common room were floated but not
  // chosen); appending a second room later means one more array entry
  // and nothing else, same render loop picks it up automatically.
  // -------------------------------------------------------------------

  const STEADY_REACH_ROOMS = [
    {
      id: 'gym_dance', icon: '💪', label: 'Gym & Dance Room',
      intro: "A cleared-out section belowdecks that Lewis and Aisy' claimed for themselves early on — weights lashed down against the swell, a patch of open floor just wide enough to actually move in.",
      actionLabel: "Train with Lewis and Aisy'",
      cooldownMsg: "Lewis and Aisy' already ran their drills for today. Come back tomorrow.",
      lines: [
        "Lewis counts reps out loud, mostly to hear himself talk. Aisy' doesn't bother counting — she just finishes first.",
        "Aisy' runs through a dance sequence with the same quiet precision she brings to everything else. Lewis tries to follow. Lewis does not follow well.",
        "\"You're competitive about this too?\" \"I'm competitive about everything.\" Aisy' doesn't dispute it.",
        "Lewis attempts to turn a simple stretch into a captain's motivational speech. Aisy' keeps stretching and ignores him completely.",
        "The two of them move through a routine they've clearly done a hundred times before, barely needing to speak to stay in sync.",
        "Aisy' wins. Lewis insists it wasn't a competition. It was, obviously, a competition."
      ]
    }
  ];
  window.FAIR_TIDE_STEADY_REACH_ROOMS = STEADY_REACH_ROOMS;

  function steadyReachRoomState(){
    if (!game.steadyReachRoomDay) game.steadyReachRoomDay = {};
    return game.steadyReachRoomDay;
  }

  window.steadyReachBuildingUnlocked = function(){
    return !!game.arc39Complete;
  };

  window.visitSteadyReachRoom = function(roomId){
    if (!window.steadyReachBuildingUnlocked()) return;
    const room = STEADY_REACH_ROOMS.find(function(r){ return r.id === roomId; });
    if (!room) return;
    const state = steadyReachRoomState();
    if (state[roomId] === game.day) {
      toast(room.cooldownMsg);
      return;
    }
    state[roomId] = game.day;
    const line = room.lines[Math.floor(Math.random() * room.lines.length)];
    if (typeof window.addFairTideMood === 'function') window.addFairTideMood(3);
    logEvent(room.icon + ' ' + line, 'good');
    toast(room.icon + ' ' + line, 4200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  function renderSteadyReachRoom(room){
    const alreadyVisited = steadyReachRoomState()[room.id] === game.day;
    return '<article class="quest-item"><strong>' + room.icon + ' ' + esc(room.label) + '</strong><br>' +
      '<span style="font-size:.85rem;opacity:.85;">' + esc(room.intro) + '</span><br>' +
      '<span style="font-size:.8rem;opacity:.8;margin-top:4px;display:inline-block;">Once per day · +3 Fair Tide Mood</span><br>' +
      (alreadyVisited
        ? '<span style="font-size:.76rem;opacity:.65;margin-top:4px;display:inline-block;">Already done for today.</span>'
        : '<button class="btn btn-small btn-success" style="margin-top:6px;" onclick="visitSteadyReachRoom(\'' + room.id + '\')">' + room.icon + ' ' + esc(room.actionLabel) + '</button>') +
      '</article>';
  }

  function renderSteadyReachTab(){
    const el = document.getElementById('ft-tab-steady_reach');
    if (!el) return;
    if (!window.steadyReachBuildingUnlocked()) {
      el.innerHTML = '<div class="panel-title">🚢 The Steady Reach</div>' +
        '<p style="font-size:.85rem;opacity:.7;">🔒 Not built yet — finish Arc XXXIX first.</p>';
      return;
    }
    let html = '<div class="panel-title">🚢 The Steady Reach</div>' +
      '<p style="font-size:.8rem;opacity:.7;margin-bottom:10px;">Docked at Fair Tide, same as always — a few of its rooms are open to visitors now.</p>';
    STEADY_REACH_ROOMS.forEach(function(room){ html += renderSteadyReachRoom(room); });
    el.innerHTML = html;
  }

  const oldRenderFairTideHubForSteadyReach = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-steady_reach');
    const btn = document.getElementById('ft-tab-btn-steady_reach');
    if (el) el.classList.toggle('active', tab === 'steady_reach');
    if (btn) btn.classList.toggle('active', tab === 'steady_reach');
    if (oldRenderFairTideHubForSteadyReach) oldRenderFairTideHubForSteadyReach();
    if (tab === 'steady_reach') renderSteadyReachTab();
  };
})();
