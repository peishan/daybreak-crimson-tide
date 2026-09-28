(function(){
  // -------------------------------------------------------------------
  // HANG OUT — San & Crew, San & Trio. Same pattern as San & Joel's own
  // Hang Out (scripts/hang-out-san-joel.js): a choice of flavored
  // activities on top of the existing Bond Tracks (arc9-and-systems.js:
  // BOND_TRACKS.san_crew / san_trio), each appended as its OWN separate
  // panel below the Bonds tab's existing single button for that track —
  // never replacing it, same as San & Joel's. Reuses
  // window.sharedMomentsFor()/recordSharedMoment() from that file for
  // the memory log rather than keeping a second, separate store.
  //
  // Gated on whichever Arc XX chapter actually establishes that group
  // hanging out, same reasoning as San & Joel's Ch.2 gate:
  //   - San & Crew  -> Ch.8  "Family Dinner": "enough of Fair Tide's
  //     people end up free on the same evening... No expedition to
  //     plan. No crisis to manage." — matches this track's own
  //     definition exactly (minCrewCount:3, "whoever's around").
  //   - San & Trio  -> Ch.15 "The Crew We Built": names Renn, Erynn, and
  //     Mimi directly as having "carved out their own corner of the
  //     place" — the first point the trio's own dynamic is called out.
  // Neither san_crew nor san_trio has an Arc-gate on the underlying bond
  // track itself (only san_joel does, via Arc V Ch.4 — see bondTier()),
  // so unlike San & Joel's panel there's no separate "is the track even
  // unlocked yet" check needed here.
  // -------------------------------------------------------------------

  const HANG_OUT_CREW_ACTIVITIES = [
    {id: 'deck_games',  icon: '🎲', label: 'Deck Games',       flavor: 'Cards, dice, and someone always arguing the rules.'},
    {id: 'story_night', icon: '📖', label: 'Story Night',      flavor: "Whoever tells the wildest story wins, unofficially."},
    {id: 'cook',        icon: '🍲', label: 'Cook Together',    flavor: 'Too many hands in one galley, somehow it works out.'},
    {id: 'training',    icon: '⚔️', label: 'Training Session', flavor: 'Sparring that turns into showing off halfway through.'},
    {id: 'singalong',   icon: '🎶', label: 'Sing-Along',       flavor: "Nobody admits to starting it. Everyone joins in anyway."},
    {id: 'just_talk',   icon: '💬', label: 'Just Talk',        flavor: "No agenda. Just whoever's around and whatever's on their mind."}
  ];
  window.HANG_OUT_CREW_ACTIVITIES = HANG_OUT_CREW_ACTIVITIES;

  const HANG_OUT_TRIO_ACTIVITIES = [
    {id: 'watch_argue',   icon: '🗣️', label: 'Watch Them Argue',      flavor: 'Three brilliant minds, one completely mundane disagreement.'},
    {id: 'help_research', icon: '📚', label: 'Help With Research',    flavor: 'San mostly hands things to people and nods at the right moments.'},
    {id: 'ask_questions', icon: '❓', label: 'Ask Questions',         flavor: 'San asks one question. Regrets it almost immediately, in the best way.'},
    {id: 'field_notes',   icon: '🗒️', label: 'Review Field Notes',    flavor: "Erynn's handwriting is a mess. Nobody tells her."},
    {id: 'quiet_study',   icon: '🕯️', label: 'Quiet Study',          flavor: 'For once, nobody\'s arguing about anything at all.'},
    {id: 'dont_break',    icon: '🧪', label: "Try Not to Break Anything", flavor: "Mimi insists it's perfectly safe. San doesn't quite believe her, and stays anyway."}
  ];
  window.HANG_OUT_TRIO_ACTIVITIES = HANG_OUT_TRIO_ACTIVITIES;

  function hangOutCrewUnlocked(){
    return !!(game.comicProgress20 && game.comicProgress20[8]);
  }
  window.hangOutCrewUnlocked = hangOutCrewUnlocked;

  function hangOutTrioUnlocked(){
    return !!(game.comicProgress20 && game.comicProgress20[15]);
  }
  window.hangOutTrioUnlocked = hangOutTrioUnlocked;

  // Shared by both tracks below — trackKey/activities/unlockFn/toastVerb
  // are the only things that differ between San & Crew and San & Trio.
  function makeHangOutHandler(trackKey, activities, unlockedFn){
    return function(activityId){
      if (!unlockedFn()) return;
      const activity = activities.find(function(a){ return a.id === activityId; });
      if (!activity) return;
      if (typeof window.canSpendTimeOnBond === 'function' && !window.canSpendTimeOnBond(trackKey)) {
        toast('Already spent time on this today.');
        return;
      }
      const before = (window.bondState ? window.bondState()[trackKey].lastSpentDay : null);
      window.spendTimeWithBond(trackKey, activity.icon + ' ' + activity.flavor);
      const after = (window.bondState ? window.bondState()[trackKey].lastSpentDay : null);
      if (after !== before && typeof window.recordSharedMoment === 'function') {
        window.recordSharedMoment(trackKey, activityId);
      }
    };
  }
  window.hangOutWithCrew = makeHangOutHandler('san_crew', HANG_OUT_CREW_ACTIVITIES, hangOutCrewUnlocked);
  window.hangOutWithTrio = makeHangOutHandler('san_trio', HANG_OUT_TRIO_ACTIVITIES, hangOutTrioUnlocked);

  function hangOutPanelHtml(trackKey, activities, title, blurb, handlerName){
    const canSpend = (typeof window.canSpendTimeOnBond === 'function') ? window.canSpendTimeOnBond(trackKey) : true;
    let html = '<div class="panel-title" style="margin-top:14px;">'+title+'</div>'+
      '<article class="quest-item">'+
      '<div style="font-size:.82rem;opacity:.85;margin-bottom:8px;">'+blurb+'</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
    activities.forEach(function(a){
      html += '<button class="btn btn-small btn-success" '+(canSpend?'':'disabled')+' onclick="'+handlerName+'(\''+a.id+'\')">'+a.icon+' '+esc(a.label)+'</button>';
    });
    html += '</div>';
    const moments = (typeof window.sharedMomentsFor === 'function') ? window.sharedMomentsFor(trackKey) : [];
    if (moments.length) {
      html += '<div style="font-size:.74rem;opacity:.7;margin-top:10px;">🌊 Shared Moments</div>';
      html += '<div style="font-size:.72rem;opacity:.65;line-height:1.6;">';
      moments.slice(-8).reverse().forEach(function(m){
        const a = activities.find(function(x){ return x.id === m.id; });
        html += (a ? a.icon + ' ' + esc(a.label) : esc(m.id)) + ' <span style="opacity:.6;">(Day '+m.day+')</span><br>';
      });
      html += '</div>';
    }
    html += '</article>';
    return html;
  }

  // Loaded after hang-out-san-joel.js, so this wrap runs OUTERMOST —
  // both this panel pair and San & Joel's own panel end up appended,
  // each independently gated, none replacing anything the base Bonds
  // tab or San & Joel's own Hang Out panel already render.
  const oldRenderBondsTabForCrewTrio = window.renderBondsTab;
  window.renderBondsTab = function(){
    if (oldRenderBondsTabForCrewTrio) oldRenderBondsTabForCrewTrio();
    const el = document.getElementById('ft-tab-bonds');
    if (!el) return;
    if (hangOutCrewUnlocked()) {
      el.innerHTML += hangOutPanelHtml('san_crew', HANG_OUT_CREW_ACTIVITIES, '👥 Hang Out with the Crew',
        'Spend the evening with whoever\'s around at Fair Tide. This still uses today\'s San &amp; Crew time, same as above.',
        'hangOutWithCrew');
    }
    if (hangOutTrioUnlocked()) {
      el.innerHTML += hangOutPanelHtml('san_trio', HANG_OUT_TRIO_ACTIVITIES, '🔮 Sit In With the Trio',
        'Spend some time with Mimi, Renn, and Erynn. This still uses today\'s San &amp; The Later Trio time, same as above.',
        'hangOutWithTrio');
    }
  };
})();
