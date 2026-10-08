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
  //
  // Lewis's crew (Aisy, Elva, Selina, Zul, Jonathan) belong here too —
  // San's own correction: they were always meant to be part of this
  // network, not left as the one-time story-modal prose that's all they
  // got in grantLewisAllyCaptainIfDue() (scripts/fairtide-systems.js).
  // Each entry's desc is pulled straight from that same scene's own
  // characterization so nothing new is invented, just finally given a
  // data layer. Gated on game.lewisAllyCaptain so they don't appear
  // before that scene has actually introduced them.
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
      desc:"Always has a story from somewhere San hasn't been."},
    {id:'aisy', name:'Aisy', icon:'🗝️',
      connection:"Lewis's crew, aboard The Steady Reach.",
      desc:"Sharp-eyed — already sizing up the dock like she's deciding what's worth stealing and what isn't.",
      eligible: function(){ return !!game.lewisAllyCaptain; }},
    {id:'elva', name:'Elva', icon:'⚔️',
      connection:"Lewis's crew, aboard The Steady Reach.",
      desc:"A blade at each hip, moving like someone who's never needed to ask twice.",
      eligible: function(){ return !!game.lewisAllyCaptain; }},
    {id:'selina', name:'Selina', icon:'🪢',
      connection:"Lewis's crew, aboard The Steady Reach.",
      desc:"Climbs partway up the rigging without being asked, just to get a better look at the port before she's set foot on it.",
      eligible: function(){ return !!game.lewisAllyCaptain; }},
    {id:'zul', name:'Zul', icon:'📦',
      connection:"Lewis's crew, aboard The Steady Reach.",
      desc:"Arms full of cargo he insisted on carrying himself, already scanning for the fastest place to set it down.",
      eligible: function(){ return !!game.lewisAllyCaptain; }},
    {id:'jonathan', name:'Jonathan', icon:'🌅',
      connection:"Lewis's crew, aboard The Steady Reach.",
      desc:"Quiet — watching the horizon the way he always seems to be watching something the rest of them haven't noticed yet.",
      eligible: function(){ return !!game.lewisAllyCaptain; }}
  ];
  window.FAIR_TIDE_ALLY_NETWORK = FAIR_TIDE_ALLY_NETWORK;

  function renderAllyNetworkPanel(){
    const visible = FAIR_TIDE_ALLY_NETWORK.filter(function(a){ return !a.eligible || a.eligible(); });
    if (!visible.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🤝 Wider Ally Network</div>'+
      '<p style="font-size:.8rem;opacity:.75;margin-bottom:8px;">Not on the roster, not living in Fair Tide — but not strangers either.</p>';
    visible.forEach(function(a){
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
    const panel = renderAllyNetworkPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="allyNetworkPanelWrap">'+panel+'</div>');
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
