(function(){
  // -------------------------------------------------------------------
  // UI TIGHTENING (phone) -- per San: "a little big", too much scrolling
  // to reach places. The layout rules live in the #uiTightStyle block at
  // the end of index.html (mobile only, <=700px). The one thing CSS can't
  // do is keep the active tab in view now that tab rows scroll sideways
  // instead of wrapping into many rows; this does that for every .tabs
  // strip after the Fair Tide hub (the longest one) renders.
  // -------------------------------------------------------------------
  function centerActiveTab(){
    document.querySelectorAll('.tabs').forEach(function(strip){
      const btn = strip.querySelector('.tab-btn.active');
      if (!btn || strip.scrollWidth <= strip.clientWidth) return;
      const delta = btn.getBoundingClientRect().left - strip.getBoundingClientRect().left - (strip.clientWidth - btn.offsetWidth) / 2;
      strip.scrollLeft += delta;
    });
  }
  window.__ctCenterActiveTab = centerActiveTab;

  const oldRenderFairTideHubForUiTighten = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    if (oldRenderFairTideHubForUiTighten) oldRenderFairTideHubForUiTighten.apply(this, arguments);
    centerActiveTab();
  };
})();
