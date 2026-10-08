(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE'S WIDER ALLY NETWORK — named people who are explicitly NOT
  // Fair Tide Roster members (no civilian role, no roster bonus, never
  // live there) but are established allies San can still reference and,
  // for two of them, occasionally spend time with. A lighter structure
  // than the Roster on purpose — San's own distinction (Ju/WH considered
  // allies with legal abilities, not roster; Rahmah & Syafiqah "not part
  // of the roster, but San can hang out with them once in a while").
  //
  // The "once in a while" hangouts for Rahmah & Syafiqah reuse the
  // existing ambient Flavour Events pool (scripts/fair-tide-flavour-
  // events.js, loaded just before this file) rather than a new bond
  // track — that system already models exactly this ("San's own life
  // happening between chapters," 2-4 random eligible entries per game
  // day) and these two don't need bond points, tiers, or a daily-cap
  // button to make narrative sense of "sees them now and then."
  // -------------------------------------------------------------------

  const FAIR_TIDE_ALLY_NETWORK = [
    {id:'ju', name:'Ju', icon:'⚖️',
      connection:"SA's closest friend from her legal circle — not on the roster, but always a call away.",
      desc:'Sharp, dependable, and usually the first read on a contract that smells wrong.'},
    {id:'wh', name:'WH', icon:'📑',
      connection:"SA's other close friend, same legal circle.",
      desc:"Quieter than Ju, equally sharp — the two of them have never lost an argument they prepared for together."},
    {id:'rahmah', name:'Rahmah', icon:'🌷',
      connection:"Part of Fair Tide's wider network of allies.",
      desc:"San doesn't see her often, but when she's around, it's always easy time."},
    {id:'syafiqah', name:'Syafiqah', icon:'🌿',
      connection:"Part of Fair Tide's wider network of allies.",
      desc:"Always has a story from somewhere San hasn't been."}
  ];
  window.FAIR_TIDE_ALLY_NETWORK = FAIR_TIDE_ALLY_NETWORK;

  function renderAllyNetworkPanel(){
    let html = '<div class="panel-title" style="margin-top:16px;">🤝 Wider Ally Network</div>'+
      '<p style="font-size:.8rem;opacity:.75;margin-bottom:8px;">Not on the roster, not living in Fair Tide — but not strangers either.</p>';
    FAIR_TIDE_ALLY_NETWORK.forEach(function(a){
      html += '<article class="quest-item"><strong>'+a.icon+' '+esc(a.name)+'</strong> — <span style="opacity:.8;">'+esc(a.connection)+'</span><br>'+
        '<span style="font-size:.8rem;opacity:.8;">'+esc(a.desc)+'</span></article>';
    });
    return html;
  }
  window.renderAllyNetworkPanel = renderAllyNetworkPanel;

  const oldRenderFairTideHubForAllyNetwork = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    if (oldRenderFairTideHubForAllyNetwork) oldRenderFairTideHubForAllyNetwork();
    const tab = game.fairTideActiveTab || 'buildings';
    if (tab !== 'roster') return;
    const container = document.getElementById('ft-tab-roster');
    if (!container) return;
    const existing = document.getElementById('allyNetworkPanelWrap');
    if (existing) existing.remove();
    container.insertAdjacentHTML('beforeend', '<div id="allyNetworkPanelWrap">'+renderAllyNetworkPanel()+'</div>');
  };

  if (typeof window.FAIR_TIDE_FLAVOUR_EVENTS !== 'undefined') {
    window.FAIR_TIDE_FLAVOUR_EVENTS.push(
      { id:'rahmah_visit', icon:'🌷', text:'Rahmah stopped by Fair Tide just to see how everyone was doing.',
        eligible: function(){ return true; } },
      { id:'syafiqah_visit', icon:'🌿', text:'Syafiqah swapped stories with San over tea before heading back out.',
        eligible: function(){ return true; } }
    );
  }
})();
