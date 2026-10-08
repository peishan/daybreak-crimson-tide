(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE'S LIVE ACTIVITY FEED — San's request: all these ambient
  // systems (Flavour Events — now including the Nursery Life and Ally
  // Network entries folded into that same pool — Hobbies, Crew
  // Conversations/"banter", and Port Visitors) already roll a decent
  // amount of random content, but every one of them silently archives
  // it into the Archive screen (#archiveContent), one of the least-
  // visited screens in the game (reached only via a small card buried
  // in the Navigate screen's special-locations grid). A player sailing
  // for days would never actually SEE any of it happen.
  //
  // This surfaces each newly-rolled entry live — a toast popping up,
  // plus a line in the Captain's Log — the moment it's rolled, the way
  // an MMO guild's activity feed scrolls by with "so-and-so just did X"
  // in real time instead of making you check a menu. Purely additive:
  // it changes nothing about WHAT rolls or HOW OFTEN (that's still each
  // source file's own ROLL_CHANCE/MIN_PER_DAY/MAX_PER_DAY) — it just
  // makes what already happens visible, by reading each system's own
  // already-exposed state accessor (fairTideFlavourState,
  // fairTideHobbyState, fairTideConversationState, portVisitorsState)
  // rather than duplicating any of their pools or roll logic.
  //
  // Loaded last among these files so every system's roll for the
  // current sync has already happened by the time this checks what's
  // new. Multiple toasts in one sync (e.g. Flavour Events alone can
  // add 2-4 at once) are staggered a couple seconds apart rather than
  // fired all at once, so each is actually readable instead of
  // instantly overwriting the last one.
  // -------------------------------------------------------------------

  const TOAST_STAGGER_MS = 2200;
  const MAX_TOASTS_PER_SYNC = 8;

  function feedState(){
    game.ambientFeedAnnounced = game.ambientFeedAnnounced || {
      flavour: [], hobby: [], conversation: [], portVisitorArrivalDay: null
    };
    return game.ambientFeedAnnounced;
  }

  function collectNewLogEntries(list, announcedIds, today, textOf){
    const fresh = [];
    (list || []).forEach(function(e){
      if (e.day !== today) return;
      const uid = e.id + ':' + e.day;
      if (announcedIds.indexOf(uid) !== -1) return;
      announcedIds.push(uid);
      fresh.push({ icon: e.icon, text: textOf(e) });
    });
    return fresh;
  }

  function checkLiveActivityFeed(){
    const today = game.day || 0;
    const state = feedState();
    let fresh = [];

    if (typeof window.fairTideFlavourState === 'function') {
      fresh = fresh.concat(collectNewLogEntries(
        window.fairTideFlavourState().log, state.flavour, today,
        function(e){ return e.text; }
      ));
    }
    if (typeof window.fairTideHobbyState === 'function') {
      fresh = fresh.concat(collectNewLogEntries(
        window.fairTideHobbyState().log, state.hobby, today,
        function(e){ return e.title + ' — ' + e.text; }
      ));
    }
    if (typeof window.fairTideConversationState === 'function') {
      fresh = fresh.concat(collectNewLogEntries(
        window.fairTideConversationState().log, state.conversation, today,
        function(e){ return e.lines.map(function(l){ return l.speaker + ': "' + l.line + '"'; }).join(' / '); }
      ).map(function(f){ return Object.assign({}, f, { icon: f.icon || '💬' }); }));
    }
    if (typeof window.portVisitorsState === 'function') {
      const pv = window.portVisitorsState();
      if (pv.current && pv.current.arrivalDay === today && state.portVisitorArrivalDay !== today) {
        state.portVisitorArrivalDay = today;
        fresh.push({ icon: pv.current.icon, text: pv.current.label + ' has arrived at the Fair Tide docks.' });
      }
    }

    if (!fresh.length) return;

    fresh.forEach(function(item){
      logEvent(item.icon + ' ' + item.text, 'good');
    });

    fresh.slice(0, MAX_TOASTS_PER_SYNC).forEach(function(item, i){
      setTimeout(function(){
        toast(item.icon + ' ' + item.text, 3200);
      }, i * TOAST_STAGGER_MS);
    });

    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  }

  const oldSyncArc1ForLiveFeed = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForLiveFeed) oldSyncArc1ForLiveFeed();
    checkLiveActivityFeed();
  };
})();
