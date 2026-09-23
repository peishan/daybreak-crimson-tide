(function(){
  // -------------------------------------------------------------------
  // FOREST COAST — first of Arc XVI's five harbours (Forest Coast ->
  // Dragon Coast -> Mountain Port -> Crystal Coast -> Old Harbour, per
  // San's own multi-harbour design doc). Built as San's explicitly
  // requested template: a FULL hub, matching the Unknown Harbour's exact
  // depth and structure (same 8 sections, same relationship-tier
  // pattern, same explore/voyage mechanics) — not a lighter waypoint.
  // Once this feels right, the other four get built the same way.
  //
  // Discovered at Arc XVI Ch.1 ("A World Worth Exploring") — see
  // game.forestCoastDiscovered in arc16-and-bonding.js. Reuses the
  // shared runDestinationVoyage() from tide-network.js for its own
  // voyage transition (10 ticks, same as every other inter-world
  // crossing) rather than a fourth separate copy of that logic.
  // -------------------------------------------------------------------

  const FOREST_COAST_SECTIONS = [
    {key:'dock', name:'Dock', icon:'⚓', lockedText: null},
    {key:'local_info', name:'Local Information', icon:'📜', lockedText: null},
    {key:'explore', name:'Explore', icon:'🧭', lockedText: null},
    {key:'market', name:'Market', icon:'🏪', lockedText: '🔒 Not yet established'},
    {key:'trade', name:'Trade', icon:'💰', lockedText: '🔒 No trading relationship'},
    {key:'requests', name:'Requests', icon:'📋', lockedText: '🔒 No local requests available'},
    {key:'guesthouse', name:'Guesthouse', icon:'🏨', lockedText: '🔒 No accommodation arranged'},
    {key:'shipwright', name:'Shipwright', icon:'🔨', lockedText: '🔒 No one here works on Crimson Tide ships yet'}
  ];
  window.FOREST_COAST_SECTIONS = FOREST_COAST_SECTIONS;

  const FOREST_COAST_RELATIONSHIP_TIERS = ['New Visitors', 'Recognised Guests', 'Trusted Visitors', 'Friends / Trade Partners'];
  window.FOREST_COAST_RELATIONSHIP_TIERS = FOREST_COAST_RELATIONSHIP_TIERS;
  window.advanceForestCoastRelationship = function(){
    const fs = forestCoastState();
    const idx = FOREST_COAST_RELATIONSHIP_TIERS.indexOf(fs.relationship);
    if (idx >= 0 && idx < FOREST_COAST_RELATIONSHIP_TIERS.length - 1) {
      fs.relationship = FOREST_COAST_RELATIONSHIP_TIERS[idx + 1];
    }
  };

  function forestCoastState(){
    game.forestCoastState = game.forestCoastState || {
      nameKnown: false, name: null, relationship: 'New Visitors',
      sections: {dock:true, local_info:true, explore:true, market:false, trade:false, requests:false, guesthouse:false, shipwright:false}
    };
    return game.forestCoastState;
  }
  window.forestCoastState = forestCoastState;

  window.forestCoastUnlocked = function(){
    // BUG FIX (San's report — Forest Coast card missing on the nav
    // screen despite being on Ch.2, meaning Ch.1 was already complete):
    // game.forestCoastDiscovered only ever got set at the exact moment
    // markArc16ChapterRead(1) runs. Arc XVI's chapters were wired several
    // versions before this location existed, so anyone who'd already
    // completed Ch.1 before V208 shipped has comicProgress16[1] === true
    // but never had the discovery flag set — that code path simply never
    // ran for them. Self-healing here: if the underlying chapter progress
    // shows Ch.1 done, the flag is retroactively set the next time this
    // is checked, rather than requiring a save edit or re-completing the
    // chapter.
    if (!game.forestCoastDiscovered && game.comicProgress16 && game.comicProgress16[1]) {
      game.forestCoastDiscovered = true;
    }
    return !!game.forestCoastDiscovered;
  };

  window.unlockForestCoastSection = function(key){
    const fs = forestCoastState();
    if (fs.sections[key] !== undefined) fs.sections[key] = true;
  };
  window.setForestCoastName = function(name){
    const fs = forestCoastState();
    fs.name = name;
    fs.nameKnown = true;
  };

  let forestCoastActiveSection = 'dock';
  window.switchForestCoastSection = function(key){
    const fs = forestCoastState();
    if (!fs.sections[key]) { toast('That part of Forest Coast isn\'t open to them yet.'); return; }
    forestCoastActiveSection = key;
    window.renderForestCoastScreen();
  };

  window.renderForestCoastScreen = function(){
    const titleEl = document.getElementById('forestCoastHeaderTitle');
    const subEl = document.getElementById('forestCoastHeaderSubtitle');
    const container = document.getElementById('forestCoastContent');
    if (!container) return;
    const fs = forestCoastState();
    if (titleEl) titleEl.textContent = fs.nameKnown ? ('🌲 ' + fs.name) : '🌲 FOREST COAST';
    if (subEl) subEl.textContent = fs.nameKnown ? 'A place the crew is starting to know' : 'The forest meets the sea here';

    let html = '<div class="tabs" style="flex-wrap:wrap;">';
    FOREST_COAST_SECTIONS.forEach(function(sec){
      const unlocked = fs.sections[sec.key];
      html += '<button class="tab-btn'+(forestCoastActiveSection===sec.key?' active':'')+'" '+
        (unlocked ? 'onclick="switchForestCoastSection(\''+sec.key+'\')"' : 'disabled style="opacity:.45;cursor:not-allowed;"') +
        '>'+sec.icon+' '+sec.name+'</button>';
    });
    html += '</div><div class="panel" style="margin-top:10px;">';

    const activeDef = FOREST_COAST_SECTIONS.find(s => s.key === forestCoastActiveSection);
    if (!fs.sections[forestCoastActiveSection]) {
      html += '<div class="story-chip">'+(activeDef?activeDef.lockedText:'🔒 Not available yet')+'</div>';
    } else if (forestCoastActiveSection === 'dock') {
      html += '<div class="panel-title">⚓ The Dock</div>'+
        '<p style="font-size:.85rem;opacity:.85;">Trees crowd right down to the waterline here — the forest doesn\'t stop at the shore, it just learns to grow around boats instead. Locals move between dock and treeline like there\'s no real border between the two.</p>';
    } else if (forestCoastActiveSection === 'local_info') {
      const tradeEstablished = !!fs.sections.trade;
      const customsLearned = fs.relationship === FOREST_COAST_RELATIONSHIP_TIERS[FOREST_COAST_RELATIONSHIP_TIERS.length - 1];
      html += '<div class="panel-title">📜 Local Information</div>'+
        '<div style="font-size:.85rem;line-height:1.8;">'+
        'Location: <strong>Unknown</strong><br>'+
        'Region: <strong>Forest Coast</strong><br>'+
        'Settlement: <strong>'+(fs.nameKnown ? fs.name : 'Unknown')+'</strong><br>'+
        'Local Customs: <strong>'+(customsLearned ? 'Learned' : 'Unknown')+'</strong><br>'+
        'Trade Status: <strong>'+(tradeEstablished ? 'Established' : 'None')+'</strong><br>'+
        'Relationship: <strong>'+fs.relationship+'</strong>'+
        '</div>';
    } else if (forestCoastActiveSection === 'explore') {
      html += '<div class="panel-title">🧭 Explore</div>'+
        '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">The treeline doesn\'t care that the crew doesn\'t know its paths yet.</p>';
      ['forest_coast_thicket_watchers','forest_coast_root_snatchers','forest_coast_canopy_scouts','forest_coast_tide_foragers','forest_coast_grove_warden'].forEach(function(key){
        const e = scaledEnemyForExplore(key, 'harbor');
        html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.6rem;">'+e.icon+'</div><div style="flex:1;"><strong>'+e.name+'</strong><br>'+
          '<span style="font-size:.8rem;opacity:.8;">'+e.desc+'</span><br>'+
          '<span style="font-size:.8rem;">'+e.hp+' HP · '+e.xp+' XP · '+e.gold+'g · Lv.'+e.scaledFromLevel+'</span></div>'+
          '<button class="btn btn-small btn-combat" onclick="startHarborFight(\''+key+'\', \'forestcoast_explore\')">Fight</button></div></article>';
      });
    } else {
      html += '<div class="panel-title">'+(activeDef?activeDef.icon+' '+activeDef.name:'')+'</div>'+
        '<p style="font-size:.85rem;opacity:.7;">Nothing here yet.</p>';
    }
    html += '</div>';
    container.innerHTML = html;
  };

  const oldRenderNavigationForForestCoast = window.renderNavigation;
  window.renderNavigation = function(){
    if (oldRenderNavigationForForestCoast) oldRenderNavigationForForestCoast();
    const grid = document.getElementById('navPortGrid');
    if (!grid || !window.forestCoastUnlocked()) return;
    const fs = forestCoastState();
    grid.insertAdjacentHTML('beforeend',
      '<div class="port-card" style="cursor:pointer;border-color:rgba(120,200,100,.5);border-style:dashed;" onclick="sailToForestCoast()">'+
      '<div style="font-size:1.6rem;">🌲</div><div style="font-weight:600;">'+(fs.nameKnown?fs.name:'Forest Coast')+'</div>'+
      '<div style="font-size:.72rem;opacity:.7;">Where the forest meets the sea.</div></div>');
  };

  const oldGoScreenForForestCoast = window.goScreen;
  window.goScreen = function(name){
    if (oldGoScreenForForestCoast) oldGoScreenForForestCoast(name);
    if (name === 'forestcoast' && typeof window.renderForestCoastScreen === 'function') window.renderForestCoastScreen();
  };

  // Voyage transition. Reuses the shared runDestinationVoyage() built for
  // Harbour/Tide Network/Clan Settlement (10 ticks, rescaled encounter
  // chance, the voyageInProgress lock) rather than a fourth copy of the
  // same logic.
  const FOREST_COAST_VOYAGE_EVENTS = [
    { type: 'combat', text: 'Something large moves along the shoreline, keeping pace with the ship from just inside the treeline.', combat: 'forest_coast_grove_warden' },
    { type: 'combat', text: 'A shape drops from the canopy onto the deck before anyone can react.', combat: 'forest_coast_canopy_scouts' },
    { type: 'flavor', text: 'The trees along this stretch of coast grow right out over the water, roots trailing in the current.' },
    { type: 'flavor', text: 'Something in the canopy tracks the ship\'s progress without ever quite showing itself.' },
    { type: 'flavor', text: 'The air smells different here — green, damp, nothing like open sea.' },
    { type: 'flavor', text: 'Birdsong cuts out entirely for a stretch, then resumes as if nothing happened.' },
    { type: 'flavor', text: 'A current pulls the ship gently toward shore, then just as gently lets go.' },
    { type: 'flavor', text: 'Renn notes the forest doesn\'t thin as the coastline curves — if anything, it gets denser.' },
    { type: 'calm', text: 'The approach is quiet, green, and entirely uneventful.' }
  ];
  window.sailToForestCoast = function(){
    if (typeof window.runDestinationVoyage !== 'function') { goScreen('forestcoast'); return; }
    window.runDestinationVoyage({
      destLabel: 'Forest Coast',
      events: FOREST_COAST_VOYAGE_EVENTS,
      combatKind: 'forestcoast_voyage',
      screenName: 'forestcoast',
      totalDays: 10
    });
  };
})();
