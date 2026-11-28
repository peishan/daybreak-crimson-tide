(function(){
  // -------------------------------------------------------------------
  // SEQUEL SHIPYARD TIERS, and the building tiers that go with them.
  //
  // The hull list used to stop at The Lodestar (Level 455). The sequel runs far past that, so nine more hulls follow her, one every
  // 70-150 levels. Each also asks for a Workshop level at Fair Tide ("the slip has to be big enough to build her"), so the yard
  // and the port grow together. Every hull is a bigger float (cargo, HP floor, a higher stat cap) and most of them let one more
  // crew member take the field. Hull names, level gates, prices, Workshop levels and field caps are all first guesses: tune HULLS below.
  //
  // Building tiers: every Fair Tide building now has curated names up to Level 12 (they stopped at 8, and Level 9 and up fell back to
  // "<Name> - Level N"). The Workshop hull discount now reaches 50% (it used to stop at 30% on Level 6, which left Levels 7 and up with
  // nothing to do).
  // -------------------------------------------------------------------
  const HULLS = [
    { id: 'meridian_ark',   name: 'The Meridian Ark',     icon: '🧭', minLevel: 520,  cost: 3000000,   cargoBase: 3000,  hpBase: 4100,  statCap: 128, fieldCap: 13, workshop: 6,  desc: 'Laid down at Fair Tide on a slip built for her. Longer than the Lodestar, and a good deal calmer in a swell.' },
    { id: 'stormwake',      name: 'Stormwake',            icon: '⛈️', minLevel: 600,  cost: 5000000,   cargoBase: 3700,  hpBase: 4900,  statCap: 142, fieldCap: 13, workshop: 7,  desc: 'Built to sail through weather other ships wait out. The crew say she likes it.' },
    { id: 'long_horizon',   name: 'The Long Horizon',     icon: '🌅', minLevel: 700,  cost: 8000000,   cargoBase: 4600,  hpBase: 5900,  statCap: 157, fieldCap: 14, workshop: 8,  desc: 'Holds enough stores to cross two worlds without calling at a port, which is the point of her.' },
    { id: 'wayfarers_crown',name: 'Wayfarer’s Crown',     icon: '👑', minLevel: 820,  cost: 13000000,  cargoBase: 5700,  hpBase: 7100,  statCap: 173, fieldCap: 14, workshop: 9,  desc: 'Every port the crew has saved sent something for her fittings. It shows.' },
    { id: 'unmoored',       name: 'The Unmoored',         icon: '🌀', minLevel: 950,  cost: 21000000,  cargoBase: 7000,  hpBase: 8500,  statCap: 190, fieldCap: 15, workshop: 10, desc: 'A hull that does not quite sit still at anchor, as if the compass had got into the timbers.' },
    { id: 'tidewrights_pride',name: 'Tidewright’s Pride', icon: '🔱', minLevel: 1100, cost: 34000000,  cargoBase: 8600,  hpBase: 10200, statCap: 208, fieldCap: 15, workshop: 11, desc: 'Jorvin’s masterwork, and he will tell you so. Every joint is one he fitted himself.' },
    { id: 'deepwater_citadel',name: 'Deepwater Citadel',  icon: '🏰', minLevel: 1250, cost: 55000000,  cargoBase: 10500, hpBase: 12200, statCap: 227, fieldCap: 16, workshop: 12, desc: 'A floating fortress with a harbour of its own inside the hull: the fleet can dock aboard her.' },
    { id: 'crossing_star',  name: 'The Crossing Star',    icon: '🌠', minLevel: 1400, cost: 89000000,  cargoBase: 12800, hpBase: 14600, statCap: 247, fieldCap: 16, workshop: 13, desc: 'She sails by starlight from more than one sky. The Archive has stopped trying to chart her course.' },
    { id: 'family_sea',     name: 'Same Sea',             icon: '🌈', minLevel: 1550, cost: 144000000, cargoBase: 15600, hpBase: 17400, statCap: 268, fieldCap: 17, workshop: 14, desc: 'Different paths, one hull. The last ship the crew will ever need to name.' }
  ];
  HULLS.forEach(function(h){
    if (!VESSELS.some(function(v){ return v.id === h.id; })) VESSELS.push(h);
  });
  function vessel(id){ return VESSELS.find(function(v){ return v.id === id; }); }
  function workshopLevel(){ return Number((game.fairTideBuildings && game.fairTideBuildings.workshop) || 0); }

  // Commissioning one of the new hulls needs the Workshop level too.
  const oldBuy = window.buyVessel;
  if (typeof oldBuy === 'function') window.buyVessel = function(id){
    const v = vessel(id);
    if (v && v.workshop && workshopLevel() < v.workshop) {
      if (typeof toast === 'function') toast('🔧 ' + v.name + ' needs a Workshop at Fair Tide: Level ' + v.workshop + ' (now ' + workshopLevel() + ').', 3600);
      return;
    }
    return oldBuy.apply(this, arguments);
  };

  // Show the requirement on each new hull's card.
  const oldRender = window.renderVessels;
  if (typeof oldRender === 'function') window.renderVessels = function(){
    const r = oldRender.apply(this, arguments);
    try {
      const box = document.getElementById('vesselContent');
      if (!box) return r;
      const cards = box.querySelectorAll(':scope > article');
      VESSELS.forEach(function(v, i){
        if (!v.workshop || !cards[i]) return;
        const have = workshopLevel(), ok = have >= v.workshop;
        const note = document.createElement('div');
        note.style.cssText = 'font-size:.75rem;margin-top:4px;opacity:' + (ok ? '.7' : '1') + ';color:' + (ok ? 'inherit' : 'var(--warning, #e8b24a)') + ';';
        note.textContent = '🔧 Needs Fair Tide Workshop Level ' + v.workshop + (ok ? '' : ' (now ' + have + ')') + ' · ' + v.fieldCap + ' can take the field';
        const body = cards[i].querySelector('div > div:nth-child(2)') || cards[i];
        body.appendChild(note);
      });
    } catch (e) { if (window.console) console.warn('vessel notes', e); }
    return r;
  };

  // Building names for Levels 9-12.
  const MORE = {
    port_hq:    ['A Harbour Other Ports Copy', 'The Port at the Crossroads', 'Fair Tide, Across Two Worlds', 'The Port Everyone Sails Toward'],
    warehouse:  ['Dudin Stops Counting', 'Every Shelf Has a Name', 'A Warehouse Inside the Warehouse', 'The Ledger That Never Closes'],
    trading_post:['Wahyu Sets the Rate', 'A Stall in Every Port', 'Prices Written in Two Worlds', 'The Exchange Everyone Quotes'],
    galley:     ['Gino\'s Long Table', 'A Recipe From Every Port', 'Supper for the Whole Fleet', 'The Galley That Fed Two Worlds'],
    workshop:   ['Jorvin\'s Third Bench', 'A Drydock Under Canvas', 'The Slip That Holds Any Hull', 'The Yard That Builds Horizon-Ships'],
    watchtower: ['Imah Sees the Weather First', 'A Light for Every Hull', 'The Far Watch', 'Imah Watches Two Skies'],
    archive:    ['Records Between Records', 'The Reading Gallery', 'The Archive That Answers', 'Every World, Indexed'],
    quarry:     ['Terraced to the Ridge', 'Stone Nobody Has to Haul', 'The Second Hill', 'A Quarry Grown Over With Gardens'],
    mine:       ['The Deep Gallery', 'Lamps Without End', 'A Seam Under the Bay', 'The Mine That Reaches the Sea'],
    nala_tower: ['Nala\'s Second Perch', 'Windows on Every Side', 'Nala Lets Visitors Up', 'The Tower That Looks Both Ways']
  };
  function extendNames(){
    const B = window.FT_BUILDINGS; if (!B) return;
    Object.keys(MORE).forEach(function(k){
      const b = B[k]; if (!b || !b.tierNames || b.tierNames.length >= 12) return;
      while (b.tierNames.length < 8) b.tierNames.push(b.name + ' — Level ' + (b.tierNames.length + 1));
      MORE[k].forEach(function(n){ b.tierNames.push(n); });
    });
  }
  extendNames();
  setTimeout(extendNames, 0);
})();
