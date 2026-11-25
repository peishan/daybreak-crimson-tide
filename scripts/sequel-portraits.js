(function(){
  // -------------------------------------------------------------------
  // SEQUEL PORTRAITS. San and Joel have new portraits for the sequel (assets/portraits/sequel/). Once Arc XLII is complete (the sequel is open)
  // every place that shows them uses the new ones: the party list, combat, the crew screen and the title card. Before that they keep the originals.
  // -------------------------------------------------------------------
  const SEQ = { san: 'assets/portraits/sequel/san.png', joel: 'assets/portraits/sequel/joel.png' };
  function sequel(){ try { return !!(game && game.arc42Complete); } catch (e) { return false; } }
  function swap(obj, id, key){
    if (!obj) return;
    const base = key === 'portraitAsset' ? obj.portraitAsset : obj[id];
    if (typeof base !== 'string') return;
    Object.defineProperty(obj, key, { configurable: true, enumerable: true, get: function(){ return sequel() ? SEQ[id] : base; }, set: function(v){ /* ignore */ } });
  }
  try {
    ['san', 'joel'].forEach(function(id){
      swap(ALL_PARTY.find(function(m){ return m.id === id; }), id, 'portraitAsset');
      swap(typeof CREW_PORTRAITS !== 'undefined' ? CREW_PORTRAITS : null, id, id);
    });
  } catch (e) { console.error('sequel portraits', e); }

  // Title card: the avatar image is static in the page, and the save (not the empty game) says whether the sequel is open.
  const oldLanding = window.renderLandingV24;
  if (typeof oldLanding === 'function') window.renderLandingV24 = function(){
    const r = oldLanding.apply(this, arguments);
    try {
      let open = sequel();
      try { const raw = localStorage.getItem(SAVE_KEY); if (raw && JSON.parse(raw).arc42Complete) open = true; } catch (e) {}
      const box = document.querySelector('.ct-v24-avatar');
      if (box && open && !box.dataset.helm) {
        const img = box.querySelector('img');
        if (img && img.getAttribute('src') !== SEQ.san) img.setAttribute('src', SEQ.san);
      }
    } catch (e) {}
    return r;
  };
})();
