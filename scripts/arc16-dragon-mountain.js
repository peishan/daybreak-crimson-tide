(function(){
  // -------------------------------------------------------------------
  // DRAGON COAST + MOUNTAIN PORT — harbours 2 and 3 of Arc XVI's five
  // (Forest Coast -> Dragon Coast -> Mountain Port -> Crystal Coast ->
  // Old Harbour), built as exact structural replicas of the Forest Coast
  // template San confirmed: same 8 sections, same relationship-tier
  // progression, same voyage/explore/trade mechanics — only the theming,
  // discovery chapter, and enemy pool differ per location.
  //
  // Discovery: game.dragonCoastDiscovered at Ch.6, game.mountainPort
  // Discovered at Ch.13 (arc16-and-bonding.js), matching San's own
  // multi-harbour chapter ranges. Screen IDs added to
  // SCREEN_ID_OVERRIDES proactively this time, learning from the exact
  // camelCase mismatch that broke Forest Coast's first deploy.
  // -------------------------------------------------------------------

  function makeHarbourModule(cfg){
    const SECTIONS = [
      {key:'dock', name:'Dock', icon:'⚓', lockedText: null},
      {key:'local_info', name:'Local Information', icon:'📜', lockedText: null},
      {key:'explore', name:'Explore', icon:'🧭', lockedText: null},
      {key:'market', name:'Market', icon:'🏪', lockedText: '🔒 Not yet established'},
      {key:'trade', name:'Trade', icon:'💰', lockedText: '🔒 No trading relationship'},
      {key:'requests', name:'Requests', icon:'📋', lockedText: '🔒 No local requests available'},
      {key:'guesthouse', name:'Guesthouse', icon:'🏨', lockedText: '🔒 No accommodation arranged'},
      {key:'shipwright', name:'Shipwright', icon:'🔨', lockedText: '🔒 No one here works on Crimson Tide ships yet'}
    ];
    const RELATIONSHIP_TIERS = ['New Visitors', 'Recognised Guests', 'Trusted Visitors', 'Friends / Trade Partners'];
    let activeSection = 'dock';

    function state(){
      game[cfg.stateKey] = game[cfg.stateKey] || {
        nameKnown: false, name: null, relationship: 'New Visitors',
        sections: {dock:true, local_info:true, explore:true, market:false, trade:false, requests:false, guesthouse:false, shipwright:false}
      };
      return game[cfg.stateKey];
    }
    window[cfg.stateFn] = state;

    window[cfg.unlockedFn] = function(){ return !!game[cfg.discoveredFlag]; };
    window[cfg.unlockSectionFn] = function(key){ const s = state(); if (s.sections[key] !== undefined) s.sections[key] = true; };
    window[cfg.setNameFn] = function(name){ const s = state(); s.name = name; s.nameKnown = true; };
    window[cfg.advanceRelFn] = function(){
      const s = state();
      const idx = RELATIONSHIP_TIERS.indexOf(s.relationship);
      if (idx >= 0 && idx < RELATIONSHIP_TIERS.length - 1) s.relationship = RELATIONSHIP_TIERS[idx + 1];
    };

    window[cfg.switchFn] = function(key){
      const s = state();
      if (!s.sections[key]) { toast('That part of ' + cfg.displayName + ' isn\'t open to them yet.'); return; }
      activeSection = key;
      window[cfg.renderFn]();
    };

    window[cfg.renderFn] = function(){
      const titleEl = document.getElementById(cfg.titleElId);
      const subEl = document.getElementById(cfg.subElId);
      const container = document.getElementById(cfg.contentElId);
      if (!container) return;
      const s = state();
      if (titleEl) titleEl.textContent = s.nameKnown ? (cfg.icon + ' ' + s.name) : (cfg.icon + ' ' + cfg.displayName.toUpperCase());
      if (subEl) subEl.textContent = s.nameKnown ? 'A place the crew is starting to know' : cfg.tagline;

      let html = '<div class="tabs" style="flex-wrap:wrap;">';
      SECTIONS.forEach(function(sec){
        const unlocked = s.sections[sec.key];
        html += '<button class="tab-btn'+(activeSection===sec.key?' active':'')+'" '+
          (unlocked ? 'onclick="'+cfg.switchFn+'(\''+sec.key+'\')"' : 'disabled style="opacity:.45;cursor:not-allowed;"') +
          '>'+sec.icon+' '+sec.name+'</button>';
      });
      html += '</div><div class="panel" style="margin-top:10px;">';

      const activeDef = SECTIONS.find(sec => sec.key === activeSection);
      if (!s.sections[activeSection]) {
        html += '<div class="story-chip">'+(activeDef?activeDef.lockedText:'🔒 Not available yet')+'</div>';
      } else if (activeSection === 'dock') {
        html += '<div class="panel-title">⚓ The Dock</div><p style="font-size:.85rem;opacity:.85;">'+cfg.dockText+'</p>';
      } else if (activeSection === 'local_info') {
        const tradeEstablished = !!s.sections.trade;
        const customsLearned = s.relationship === RELATIONSHIP_TIERS[RELATIONSHIP_TIERS.length - 1];
        html += '<div class="panel-title">📜 Local Information</div>'+
          '<div style="font-size:.85rem;line-height:1.8;">'+
          'Location: <strong>Unknown</strong><br>'+
          'Region: <strong>'+cfg.displayName+'</strong><br>'+
          'Settlement: <strong>'+(s.nameKnown ? s.name : 'Unknown')+'</strong><br>'+
          'Local Customs: <strong>'+(customsLearned ? 'Learned' : 'Unknown')+'</strong><br>'+
          'Trade Status: <strong>'+(tradeEstablished ? 'Established' : 'None')+'</strong><br>'+
          'Relationship: <strong>'+s.relationship+'</strong>'+
          '</div>';
      } else if (activeSection === 'explore') {
        html += '<div class="panel-title">🧭 Explore</div>'+
          '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">'+cfg.exploreText+'</p>';
        cfg.enemyKeys.forEach(function(key){
          const e = scaledEnemyForExplore(key, 'harbor');
          html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.6rem;">'+e.icon+'</div><div style="flex:1;"><strong>'+e.name+'</strong><br>'+
            '<span style="font-size:.8rem;opacity:.8;">'+e.desc+'</span><br>'+
            '<span style="font-size:.8rem;">'+e.hp+' HP · '+e.xp+' XP · '+e.gold+'g · Lv.'+e.scaledFromLevel+'</span></div>'+
            '<button class="btn btn-small btn-combat" onclick="startHarborFight(\''+key+'\', \''+cfg.exploreCombatKind+'\')">Fight</button></div></article>';
        });
      } else {
        html += '<div class="panel-title">'+(activeDef?activeDef.icon+' '+activeDef.name:'')+'</div>'+
          '<p style="font-size:.85rem;opacity:.7;">Nothing here yet.</p>';
      }
      html += '</div>';
      container.innerHTML = html;
    };

    const oldRenderNavigation = window.renderNavigation;
    window.renderNavigation = function(){
      if (oldRenderNavigation) oldRenderNavigation();
      const grid = document.getElementById('navPortGrid');
      if (!grid || !window[cfg.unlockedFn]()) return;
      const s = state();
      grid.insertAdjacentHTML('beforeend',
        '<div class="port-card" style="cursor:pointer;border-color:'+cfg.cardBorderColor+';border-style:dashed;" onclick="'+cfg.sailFn+'()">'+
        '<div style="font-size:1.6rem;">'+cfg.icon+'</div><div style="font-weight:600;">'+(s.nameKnown?s.name:cfg.displayName)+'</div>'+
        '<div style="font-size:.72rem;opacity:.7;">'+cfg.navBlurb+'</div></div>');
    };

    const oldGoScreen = window.goScreen;
    window.goScreen = function(name){
      if (oldGoScreen) oldGoScreen(name);
      if (name === cfg.screenName && typeof window[cfg.renderFn] === 'function') window[cfg.renderFn]();
    };

    window[cfg.sailFn] = function(){
      if (typeof window.runDestinationVoyage !== 'function') { goScreen(cfg.screenName); return; }
      window.runDestinationVoyage({
        destLabel: cfg.displayName,
        events: cfg.voyageEvents,
        combatKind: cfg.voyageCombatKind,
        screenName: cfg.screenName,
        totalDays: 10
      });
    };
  }

  window.makeHarbourModule = makeHarbourModule;

  // -----------------------------------------------------------------
  // DRAGON COAST — Ch.6-9. "The dragons here are not monsters guarding
  // treasure — they are woven into how this coast actually works."
  // -----------------------------------------------------------------
  makeHarbourModule({
    stateKey: 'dragonCoastState', stateFn: 'dragonCoastState',
    discoveredFlag: 'dragonCoastDiscovered', unlockedFn: 'dragonCoastUnlocked',
    unlockSectionFn: 'unlockDragonCoastSection', setNameFn: 'setDragonCoastName',
    advanceRelFn: 'advanceDragonCoastRelationship', switchFn: 'switchDragonCoastSection',
    renderFn: 'renderDragonCoastScreen', sailFn: 'sailToDragonCoast',
    titleElId: 'dragonCoastHeaderTitle', subElId: 'dragonCoastHeaderSubtitle', contentElId: 'dragonCoastContent',
    screenName: 'dragoncoast', icon: '🐉', displayName: 'Dragon Coast',
    tagline: 'The dragons here are not what the stories say',
    cardBorderColor: 'rgba(220,120,80,.5)', navBlurb: 'Where the dragons actually live.',
    dockText: 'Something large watches from the cliffs above the dock — unbothered, uninterested, entirely at home. Nobody here treats that as unusual.',
    exploreText: 'The dragons here aren\'t guarding anything. They just live here, same as everyone else.',
    enemyKeys: ['dragon_coast_watchful_wyrmling','dragon_coast_drake_scout','dragon_coast_territory_marker','dragon_coast_tide_kin','dragon_coast_elder_sentinel'],
    exploreCombatKind: 'dragoncoast_explore', voyageCombatKind: 'dragoncoast_voyage',
    voyageEvents: [
      { type: 'combat', text: 'Something with wings breaks from the cliffside and closes fast.', combat: 'dragon_coast_drake_scout' },
      { type: 'combat', text: 'A shape circles the ship twice before deciding it isn\'t interested — and comes down anyway, just to be sure.', combat: 'dragon_coast_watchful_wyrmling' },
      { type: 'flavor', text: 'Something enormous crosses the sky far overhead, in no apparent hurry.' },
      { type: 'flavor', text: 'The cliffs along this stretch are scored with old, deep claw marks, weathered smooth.' },
      { type: 'flavor', text: 'A low sound rolls across the water — not threatening, just present.' },
      { type: 'flavor', text: 'Renn notes the local seabirds don\'t react to the dragons at all. They\'re used to them.' },
      { type: 'flavor', text: 'The water here runs warmer than it should, this far from any visible source.' },
      { type: 'flavor', text: 'Something watches from a high ledge the whole way past, never once approaching.' },
      { type: 'calm', text: 'The coast is quiet, in the specific way a place is quiet when nothing here needs to prove anything.' }
    ]
  });

  // -----------------------------------------------------------------
  // MOUNTAIN PORT — Ch.13-16. "The practical, logistical heart of the
  // resource region — mining, geology, and the people who live with
  // both."
  // -----------------------------------------------------------------
  makeHarbourModule({
    stateKey: 'mountainPortState', stateFn: 'mountainPortState',
    discoveredFlag: 'mountainPortDiscovered', unlockedFn: 'mountainPortUnlocked',
    unlockSectionFn: 'unlockMountainPortSection', setNameFn: 'setMountainPortName',
    advanceRelFn: 'advanceMountainPortRelationship', switchFn: 'switchMountainPortSection',
    renderFn: 'renderMountainPortScreen', sailFn: 'sailToMountainPort',
    titleElId: 'mountainPortHeaderTitle', subElId: 'mountainPortHeaderSubtitle', contentElId: 'mountainPortContent',
    screenName: 'mountainport', icon: '🏔️', displayName: 'Mountain Port',
    tagline: 'Where the mountain and the sea do business',
    cardBorderColor: 'rgba(160,160,180,.5)', navBlurb: 'The practical heart of the region.',
    dockText: 'Cranes and cargo nets line this dock, built for real weight — ore, stone, the practical business of a mining community that has done this a long time.',
    exploreText: 'The mountain doesn\'t care that the crew is new here. Neither does what lives on it.',
    enemyKeys: ['mountain_port_tunnel_warden','mountain_port_seam_prowler','mountain_port_stoneback_guardian','mountain_port_shaft_lurker','mountain_port_own_guardian'],
    exploreCombatKind: 'mountainport_explore', voyageCombatKind: 'mountainport_voyage',
    voyageEvents: [
      { type: 'combat', text: 'Something heavy and stone-grey detaches itself from the cliff face and comes down fast.', combat: 'mountain_port_stoneback_guardian' },
      { type: 'combat', text: 'A shape moves low along the rock, more at home on the mountain than the ship\'s crew will ever be.', combat: 'mountain_port_tunnel_warden' },
      { type: 'flavor', text: 'The mountain rises straight out of the water here, no real coastline to speak of.' },
      { type: 'flavor', text: 'Distant sounds of digging carry oddly far across open water.' },
      { type: 'flavor', text: 'Smoke rises from somewhere partway up the slope — a forge, maybe, or something like one.' },
      { type: 'flavor', text: 'The rock face is scored with old mining cuts, some clearly abandoned decades ago.' },
      { type: 'flavor', text: 'Zaki notes the water\'s mineral taste changes noticeably this close to the mountain.' },
      { type: 'flavor', text: 'A rockslide echoes somewhere out of sight — controlled, by the sound of it, not accidental.' },
      { type: 'calm', text: 'The approach is steady and uneventful, the mountain simply getting larger.' }
    ]
  });
})();
