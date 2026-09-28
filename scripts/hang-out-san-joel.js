(function(){
  // -------------------------------------------------------------------
  // HANG OUT — San & Joel. Built on top of the existing San & Joel Bond
  // Track (arc9-and-systems.js: BOND_TRACKS.san_joel, spendTimeWithBond,
  // the Bonds tab in the Fair Tide Hub) rather than a new, competing
  // system — that track already has the points, tiers, once-a-day cap,
  // and the combat bonuses (HP/MP%, damage reduction, haste) every tier
  // grants. This adds a choice of several flavored activities, all
  // feeding the exact same points/tier/daily-cap — one bond number, not
  // two — plus a small "Shared Moments" log (a memory collection, not a
  // second score) recording which activities have actually happened.
  //
  // Gated separately from the Bond Track's own Arc V Ch.4 unlock: the
  // underlying points system has existed since Arc V, but "Hang Out" as
  // a concept — San taking deliberate time off to spend with Joel — is
  // what Arc XX Ch.2 ("The Captain's Day Off") actually establishes in
  // the story, so this only appears once that chapter's been read.
  //
  // Kept as its own separate panel/action (San's explicit call) rather
  // than replacing the Bonds tab's existing "Spend a quiet evening with
  // Joel" button — that button, the San & Crew/San & Trio cards, and the
  // Commons building are all left completely untouched. This just
  // appends a distinct "🌊 Hang Out" section below everything the base
  // Bonds tab already renders.
  // -------------------------------------------------------------------

  const HANG_OUT_ACTIVITIES = [
    {id: 'coffee',   icon: '☕', label: 'Coffee Together',        flavor: 'Coffee, and a conversation that doesn\'t need to go anywhere in particular.'},
    {id: 'harbour',  icon: '🌊', label: 'Walk the Harbour',       flavor: 'Watching the ships come in, in no particular hurry.'},
    {id: 'market',   icon: '🌙', label: 'Night Market',           flavor: 'Food, a little shopping, and people-watching until it gets late.'},
    {id: 'workshop', icon: '🛠️', label: "Help Joel With Something", flavor: 'Joel works on something practical while San just keeps him company.'},
    {id: 'shore',    icon: '🌅', label: 'Watch the Tide',         flavor: 'A quiet stretch of shore, just the two of them and the water.'},
    {id: 'stayin',   icon: '🏠', label: 'Stay In',                flavor: 'Some days, doing absolutely nothing together is the whole plan.'}
  ];
  window.HANG_OUT_ACTIVITIES = HANG_OUT_ACTIVITIES;

  const MAX_SHARED_MOMENTS = 300; // generous safety cap — at most one entry per real calendar day, so this covers the better part of a year of daily play before it ever trims anything

  function hangOutUnlocked(){
    return !!(game.comicProgress20 && game.comicProgress20[2]);
  }
  window.hangOutUnlocked = hangOutUnlocked;

  function sharedMoments(){
    game.sharedMoments = game.sharedMoments || [];
    return game.sharedMoments;
  }
  window.sharedMoments = sharedMoments;

  window.hangOutWithJoel = function(activityId){
    if (!hangOutUnlocked()) return;
    const activity = HANG_OUT_ACTIVITIES.find(function(a){ return a.id === activityId; });
    if (!activity) return;
    if (typeof window.canSpendTimeOnBond === 'function' && !window.canSpendTimeOnBond('san_joel')) {
      toast('Already spent time together today.');
      return;
    }
    const before = (window.bondState ? window.bondState().san_joel.lastSpentDay : null);
    window.spendTimeWithBond('san_joel', activity.icon + ' ' + activity.flavor);
    // spendTimeWithBond() no-ops (with its own toast) if the daily cap
    // was already hit — only log a fresh moment if it actually spent.
    const after = (window.bondState ? window.bondState().san_joel.lastSpentDay : null);
    if (after !== before) {
      const moments = sharedMoments();
      moments.push({id: activityId, day: game.day});
      if (moments.length > MAX_SHARED_MOMENTS) moments.splice(0, moments.length - MAX_SHARED_MOMENTS);
    }
  };

  function hangOutPanelHtml(){
    const canSpend = (typeof window.canSpendTimeOnBond === 'function') ? window.canSpendTimeOnBond('san_joel') : true;
    let html = '<div class="panel-title" style="margin-top:14px;">🌊 Hang Out</div>'+
      '<article class="quest-item">'+
      '<div style="font-size:.82rem;opacity:.85;margin-bottom:8px;">Take a break with Joel — pick something to do together. This still uses today\'s San &amp; Joel time, same as above.</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
    HANG_OUT_ACTIVITIES.forEach(function(a){
      html += '<button class="btn btn-small btn-success" '+(canSpend?'':'disabled')+' onclick="hangOutWithJoel(\''+a.id+'\')">'+a.icon+' '+esc(a.label)+'</button>';
    });
    html += '</div>';
    const moments = sharedMoments();
    if (moments.length) {
      html += '<div style="font-size:.74rem;opacity:.7;margin-top:10px;">🌊 Shared Moments</div>';
      html += '<div style="font-size:.72rem;opacity:.65;line-height:1.6;">';
      moments.slice(-8).reverse().forEach(function(m){
        const a = HANG_OUT_ACTIVITIES.find(function(x){ return x.id === m.id; });
        html += (a ? a.icon + ' ' + esc(a.label) : esc(m.id)) + ' <span style="opacity:.6;">(Day '+m.day+')</span><br>';
      });
      html += '</div>';
    }
    html += '</article>';
    return html;
  }

  // Appended as its own separate panel below whatever the base Bonds tab
  // already rendered (San's explicit call: a distinct action, not a
  // replacement for the existing "Spend a quiet evening with Joel"
  // button) — that button, San & Crew/San & Trio, and the Commons
  // building are all left completely untouched. Only shown once the
  // San & Joel bond track itself is actually unlocked (Arc V Ch.4) —
  // otherwise there's no bond action underneath it to spend at all.
  const oldRenderBondsTabForHangOut = window.renderBondsTab;
  window.renderBondsTab = function(){
    if (oldRenderBondsTabForHangOut) oldRenderBondsTabForHangOut();
    if (!hangOutUnlocked()) return;
    if (!(game.comicProgress5 && game.comicProgress5[4])) return;
    const el = document.getElementById('ft-tab-bonds');
    if (!el) return;
    el.innerHTML += hangOutPanelHtml();
  };
})();
