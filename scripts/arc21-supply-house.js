(function(){
  // -------------------------------------------------------------------
  // ARC XXI — THE SUPPLY HOUSE. Fourth of the Arc XXI buildings to get
  // a real gameplay system, grounded directly in Ch.8's own text.
  //
  // Ch.8 is explicit that the problem isn't scarcity — Fair Tide
  // "has plenty of resources" — it's organization: "Construction
  // materials in one place. Expedition supplies scattered across three
  // others. Emergency reserves that technically exist but that nobody
  // could locate quickly." Aisyah is the one who organizes it, matching
  // her established "practical concerns" role from the Fair Tide
  // Council panel.
  //
  // Listed among the design doc's own 9 real gameplay systems ("Supply
  // Management"), unlike Market Quarter — so this is built as a genuine
  // persistent stockpile across the three categories the text itself
  // names, not a passive flavor panel. Contributing gold toward a
  // category reuses this codebase's simplest, most proven resource
  // pattern (spend gold, gain a tracked resource) rather than inventing
  // a new one — and the stockpile is deliberately exposed on window
  // (window.supplyHouseStock) so it's ready for the Route Preparation
  // screen (Ch.16, already wired story-side) to actually read from once
  // that system gets built, matching how the design doc frames
  // "supplies" as part of voyage readiness.
  // -------------------------------------------------------------------

  const SUPPLY_CATEGORIES = [
    {
      key: 'construction',
      icon: '🧱',
      label: 'Construction Materials',
      desc: 'Timber, stone, and fittings for whatever Fair Tide builds next.',
      goldPerUnit: 5
    },
    {
      key: 'expedition',
      icon: '🎒',
      label: 'Expedition Supplies',
      desc: 'Rations, rope, and repair materials for whoever sails out.',
      goldPerUnit: 5
    },
    {
      key: 'emergency',
      icon: '🚨',
      label: 'Emergency Reserves',
      desc: "Kept aside on purpose — not for using, for the day something actually goes wrong.",
      goldPerUnit: 8
    }
  ];
  window.ARC21_SUPPLY_CATEGORIES = SUPPLY_CATEGORIES;

  function supplyHouseUnlocked(){
    return !!(game.comicProgress21 && game.comicProgress21[8]);
  }
  window.supplyHouseUnlocked = supplyHouseUnlocked;

  function supplyHouseStock(key){
    game.supplyHouseStock = game.supplyHouseStock || {};
    return Number(game.supplyHouseStock[key] || 0);
  }
  window.supplyHouseStock = supplyHouseStock;

  function contributeSupplies(categoryKey, units){
    const category = SUPPLY_CATEGORIES.find(function(c){ return c.key === categoryKey; });
    if (!category) return;
    units = Math.max(1, Math.floor(Number(units) || 1));
    const cost = units * category.goldPerUnit;
    if ((game.gold || 0) < cost) { toast('Not enough gold.', 2800); return; }
    game.gold -= cost;
    game.supplyHouseStock = game.supplyHouseStock || {};
    game.supplyHouseStock[categoryKey] = supplyHouseStock(categoryKey) + units;
    toast('📦 +' + units + ' ' + category.label + ' (' + cost + 'g).', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.contributeSupplies = contributeSupplies;

  function renderSupplyHousePanel(){
    if (!supplyHouseUnlocked()) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">📦 Supply House</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Having resources was never the hard part. Managing them was.</p>';
    SUPPLY_CATEGORIES.forEach(function(category){
      const stock = supplyHouseStock(category.key);
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">'+category.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(category.label)+'</strong> <span class="story-chip">'+stock+' stocked</span><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(category.desc)+'</span>'+
        '</div>'+
        '<button class="btn btn-small" onclick="contributeSupplies(\''+category.key+'\',5)" '+((game.gold||0) < category.goldPerUnit*5 ? 'disabled' : '')+'>'+
        '+5 ('+(category.goldPerUnit*5)+'g)</button>'+
        '</div></article>';
    });
    return html;
  }
  window.renderSupplyHousePanel = renderSupplyHousePanel;

  const oldRenderArchiveScreenForSupplyHouse = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForSupplyHouse) oldRenderArchiveScreenForSupplyHouse();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('supplyHousePanelWrap');
    if (existing) existing.remove();
    const panel = renderSupplyHousePanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="supplyHousePanelWrap">'+panel+'</div>');
  };
})();
