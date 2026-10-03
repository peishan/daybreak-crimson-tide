(function(){
  // -------------------------------------------------------------------
  // COMPANION ROOMS — four more just-for-fun rooms at Fair Tide, same
  // mold as the Grooming Room: one companion, one button, once per
  // in-game day, +3 Fair Tide Mood, a handful of rotating in-character
  // flavor lines. Each is gated on that companion actually being
  // recruited (game.foundCompanions[companionId]) -- the tab itself is
  // always visible (simpler than conditionally hiding tab buttons), but
  // its content explains nobody's found their way in yet if the
  // companion hasn't joined.
  //
  // Brada Shah hosts Karaoke Night rather than anything workshop-themed
  // on purpose: he's already an established in-game Bard ("Songs,
  // strategy, and steadier ground" — core-engine.js's own ALL_PARTY
  // entry), and a "Workshop" room would collide with the existing
  // Workshop BUILDING in the Buildings tab, which is already Jorvin's.
  //
  // Added to REMOTE_RESTRICTED_TABS in harbour-and-arc14.js, same
  // reasoning as the Grooming Room: gardening, reading together, chart-
  // work, and a karaoke night all require actually being there.
  //
  // This file must load BEFORE harbour-and-arc14.js in index.html, same
  // ordering reason as fair-tide-grooming-room.js: that file's remote-
  // access wrap needs to stay outermost so it can reset a stale active
  // tab before any of these rooms' own render wrap ever reads it.
  // -------------------------------------------------------------------

  const COMPANION_ROOMS = [
    {
      id: 'garden', companionId: 'joel', icon: '🌿', label: "Joel's Garden",
      intro: "A patch of soil near the harbor that Joel decided was his the day the crew arrived. Rosemary, something unidentifiable, and at least one plant San has been given three different names for.",
      actionLabel: 'Tend the Garden with Joel',
      cooldownMsg: "Joel says the garden's had enough attention for one day. The garden did not confirm this.",
      lines: [
        "Joel harvests more rosemary than anyone could possibly need. He has plans for it. He will not elaborate.",
        "Something is growing that wasn't planted on purpose. Joel seems pleased about it anyway.",
        "Joel explains, at length, why this particular soil is better than the soil at the last three ports. Nobody asked.",
        "A plant Joel swears is edible gets added to dinner. It is, in fact, edible.",
        "Joel hands over a sprig of something fragrant without explanation. It seems important to him.",
        "The garden is, against all odds, thriving. Joel refuses to say how."
      ]
    },
    {
      id: 'reading', companionId: 'renn', icon: '📖', label: "Renn's Reading Nook",
      intro: "A corner of the Archive that Renn has quietly claimed as his own, usually found by following a trail of displaced books and at least one moved crate.",
      actionLabel: 'Sit With Renn',
      cooldownMsg: "Renn is mid-theory and would rather not be interrupted. Try again tomorrow.",
      lines: [
        "Renn is reading something he insists is 'almost certainly relevant eventually.'",
        "He's relocated to the top of a cargo crate again. The crate is, once again, not stationary.",
        "Renn reads a passage aloud, unprompted, then looks disappointed when nobody reacts the way he expected.",
        "He's annotated the margins of a book that wasn't his to annotate. He seems unbothered by this.",
        "Renn was reported missing for twenty minutes. He was, as always, in the Archive.",
        "He explains a theory in full. It makes slightly more sense by the end than at the start."
      ]
    },
    {
      id: 'starmap', companionId: 'senedra', icon: '🧭', label: "Senedra's Star-Map Room",
      intro: "A small room off the tower where Senedra keeps her charts — half official routes, half ones she drew herself after going somewhere nobody sent her.",
      actionLabel: 'Chart the Stars with Senedra',
      cooldownMsg: "Senedra's charts are still drying from today. Come back tomorrow.",
      lines: [
        "Senedra marks a new route on the chart. Nobody asked her to find it. She found it anyway.",
        "She points out a formation overhead and names it something nobody else has ever called it.",
        "Senedra's latest map is, once again, more accurate than the one it was meant to correct.",
        "She mentions, offhand, a place she's been that isn't on any official chart. She changes the subject before anyone can ask more.",
        "Senedra adjusts a star-sighting instrument that definitely wasn't standard issue.",
        "She watches the horizon for a long moment before saying anything. Whatever she saw, she keeps to herself."
      ]
    },
    {
      id: 'karaoke', companionId: 'brada_shah', icon: '🎤', label: 'Karaoke Night',
      intro: "Brada's unofficial stage, set up wherever there's room for his pipa and an audience willing to pretend they weren't listening before he started.",
      actionLabel: 'Join Karaoke Night',
      cooldownMsg: "Brada's already played his set for today. Even bards need a night off.",
      lines: [
        "Brada plays something upbeat. Half the crew claims they weren't listening. All of them were.",
        "He improvises a verse about someone in the room. That someone is visibly regretting attending.",
        "Brada hits a note that shouldn't be physically possible and acts like it was nothing.",
        "Someone requests a song Brada doesn't know. He plays it anyway, mostly correctly, with total confidence.",
        "Brada dedicates a song to Mimi, who pretends not to notice from across the room.",
        "The night ends with Brada still playing long after everyone else has stopped singing along."
      ]
    }
  ];
  window.FAIR_TIDE_COMPANION_ROOMS = COMPANION_ROOMS;

  function roomState(){
    if (!game.companionRoomDay) game.companionRoomDay = {};
    return game.companionRoomDay;
  }

  window.visitCompanionRoom = function(roomId){
    const room = COMPANION_ROOMS.find(function(r){ return r.id === roomId; });
    if (!room) return;
    if (!game.foundCompanions || !game.foundCompanions[room.companionId]) return;
    const state = roomState();
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

  function renderCompanionRoomTab(room){
    const el = document.getElementById('ft-tab-' + room.id);
    if (!el) return;
    const recruited = !!(game.foundCompanions && game.foundCompanions[room.companionId]);
    if (!recruited) {
      el.innerHTML = '<div class="panel-title">' + room.icon + ' ' + esc(room.label) + '</div>' +
        '<p style="font-size:.85rem;opacity:.7;">Nobody\'s found their way in here yet.</p>';
      return;
    }
    const alreadyVisited = roomState()[room.id] === game.day;
    const html = '<div class="panel-title">' + room.icon + ' ' + esc(room.label) + '</div>' +
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">' + esc(room.intro) + '</p>' +
      '<article class="quest-item"><strong>' + room.icon + ' ' + esc(room.actionLabel) + '</strong><br>' +
      '<span style="font-size:.8rem;opacity:.8;">Once per day · +3 Fair Tide Mood</span><br>' +
      (alreadyVisited
        ? '<span style="font-size:.76rem;opacity:.65;margin-top:4px;display:inline-block;">Already done for today.</span>'
        : '<button class="btn btn-small btn-success" style="margin-top:6px;" onclick="visitCompanionRoom(\'' + room.id + '\')">' + room.icon + ' ' + esc(room.actionLabel) + '</button>') +
      '</article>';
    el.innerHTML = html;
  }

  const oldRenderFairTideHubForCompanionRooms = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    COMPANION_ROOMS.forEach(function(room){
      const el = document.getElementById('ft-tab-' + room.id);
      const btn = document.getElementById('ft-tab-btn-' + room.id);
      if (el) el.classList.toggle('active', tab === room.id);
      if (btn) btn.classList.toggle('active', tab === room.id);
    });
    if (oldRenderFairTideHubForCompanionRooms) oldRenderFairTideHubForCompanionRooms();
    const activeRoom = COMPANION_ROOMS.find(function(r){ return r.id === tab; });
    if (activeRoom) renderCompanionRoomTab(activeRoom);
  };
})();
