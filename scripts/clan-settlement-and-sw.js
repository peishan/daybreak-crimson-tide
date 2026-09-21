
(function(){
  // -------------------------------------------------------------------
  // THE CLAN SETTLEMENT — Arc XV's land-based parallel to the Harbour
  // (Arc XIII) and Tide Network (Arc XIV). Same overall shape (Unknown
  // -> real name, sections unlocking progressively, narrative
  // relationship status) but built around Wilderness zone exploration
  // instead of cultural discovery or current mapping — San's own "major
  // new exploration mechanic" for this arc.
  //
  // 7 sections per San's spec: Settlement, Market, Wilderness, Crafts,
  // Community, Requests, Explore. Settlement + Explore + Wilderness
  // unlocked from Ch.1 (Wilderness is the headline mechanic San
  // specifically called out, no reason to gate it behind later story);
  // Market/Crafts/Community/Requests locked initially, matching the
  // Harbour's own progressive-unlock philosophy. Section unlock hooks
  // exposed the same way as Harbour/Tide Network — not wired to any
  // specific Arc XV chapter yet, since only chapters 1-10 exist so far.
  //
  // Wilderness zones: Forest Path unlocked from the start (matches Ch.1
  // "The Shape in the Forest"); Highland Trail, Moonstone Caves,
  // Deepwood, and Unknown Territory are scouted in that order via a
  // cooldown-gated action, same rhythm as Tide Network's Map Currents.
  // Mossback is built as a genuine choice, not an automatic fight, per
  // San's explicit "environmental encounter rather than automatic
  // combat" — leave it be for a small discovery, or provoke it into a
  // real fight. The Old Moon Beast works the same way at a much higher
  // stakes level, once Unknown Territory is scouted — the "not every
  // dangerous thing needs to be defeated" choice is the actual point of
  // including it, not a boss fight to grind.
  // -------------------------------------------------------------------
  const CLAN_SETTLEMENT_SECTIONS = [
    {key:'settlement', name:'Settlement', icon:'🏘️', lockedText: null},
    {key:'explore', name:'Explore', icon:'🧭', lockedText: null},
    {key:'wilderness', name:'Wilderness', icon:'🌲', lockedText: null},
    {key:'market', name:'Market', icon:'🛍️', lockedText: '🔒 Not yet established'},
    {key:'crafts', name:'Crafts', icon:'🛠️', lockedText: '🔒 No one here works with outsiders yet'},
    {key:'community', name:'Community', icon:'🤝', lockedText: '🔒 No relationship yet'},
    {key:'requests', name:'Requests', icon:'💬', lockedText: '🔒 No local requests available'}
  ];
  window.CLAN_SETTLEMENT_SECTIONS = CLAN_SETTLEMENT_SECTIONS;

  const CLAN_RELATIONSHIP_TIERS = ['New Visitors', 'Recognised Guests', 'Trusted Visitors', 'Friends / Trade Partners'];
  window.CLAN_RELATIONSHIP_TIERS = CLAN_RELATIONSHIP_TIERS;
  window.advanceClanRelationship = function(){
    const cs = clanSettlementState();
    const idx = CLAN_RELATIONSHIP_TIERS.indexOf(cs.relationship);
    if (idx >= 0 && idx < CLAN_RELATIONSHIP_TIERS.length - 1) cs.relationship = CLAN_RELATIONSHIP_TIERS[idx + 1];
  };

  const WILDERNESS_ZONES = [
    {key:'forest_path', name:'Forest Path', icon:'🌳', enemies:['moonfang_wolves','gloom_stalker']},
    {key:'highland_trail', name:'Highland Trail', icon:'⛰️', enemies:['thornback_boar','moonclaw','wildshape_beast_mountain']},
    {key:'moonstone_caves', name:'Moonstone Caves', icon:'🪨', enemies:['wildshape_beast_cave','gloom_stalker']},
    {key:'deepwood', name:'Deepwood', icon:'🌿', enemies:['wildshape_beast_forest'], special:'mossback'},
    {key:'unknown_territory', name:'Unknown Territory', icon:'❓', enemies:[], special:'old_moon_beast'}
  ];
  window.WILDERNESS_ZONES = WILDERNESS_ZONES;

  function clanSettlementState(){
    game.clanSettlementState = game.clanSettlementState || {
      nameKnown: false, name: null, worldName: null, relationship: 'New Visitors',
      sections: {settlement:true, explore:true, wilderness:true, market:false, crafts:false, community:false, requests:false},
      zonesScouted: {forest_path:true}, nextScoutAt: 0
    };
    const cs = game.clanSettlementState;
    if (cs.relationship === undefined) cs.relationship = 'New Visitors';
    if (cs.zonesScouted === undefined) cs.zonesScouted = {forest_path:true};
    if (cs.zonesScouted.forest_path === undefined) cs.zonesScouted.forest_path = true;
    if (cs.nextScoutAt === undefined) cs.nextScoutAt = 0;
    return cs;
  }
  window.clanSettlementState = clanSettlementState;

  window.clanSettlementUnlocked = function(){ return !!game.clanSettlementDiscovered; };
  window.unlockClanSection = function(key){
    const cs = clanSettlementState();
    if (cs.sections[key] !== undefined) cs.sections[key] = true;
  };
  window.setClanSettlementName = function(name){
    const cs = clanSettlementState();
    cs.name = name;
    cs.nameKnown = true;
  };

  const SCOUT_COOLDOWN_MS = 5 * 3600 * 1000;
  window.scoutWildernessStatus = function(){
    const cs = clanSettlementState();
    if (Date.now() < cs.nextScoutAt) return {state:'cooldown', msLeft: cs.nextScoutAt - Date.now()};
    return {state:'ready'};
  };
  window.scoutWilderness = function(){
    const status = window.scoutWildernessStatus();
    if (status.state !== 'ready') { toast('⏳ Not ready yet.'); return; }
    const cs = clanSettlementState();
    cs.nextScoutAt = Date.now() + SCOUT_COOLDOWN_MS;
    const nextZone = WILDERNESS_ZONES.find(z => !cs.zonesScouted[z.key]);
    if (!nextZone) { toast('🌲 Every known zone is already scouted.'); if (typeof saveGameQuiet === 'function') saveGameQuiet(); return; }
    cs.zonesScouted[nextZone.key] = true;
    logEvent('🌲 New territory scouted: ' + nextZone.icon + ' ' + nextZone.name + '.', 'gold');
    toast('🌲 ' + nextZone.icon + ' ' + nextZone.name + ' has been mapped.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderClanSettlementScreen === 'function') renderClanSettlementScreen();
  };

  window.encounterMossback = function(choice){
    const enemy = scaledEnemyForExplore('mossback', 'harbor');
    if (choice === 'leave') {
      logEvent('🌳 The crew leaves the Mossback undisturbed. It barely seems to notice.', 'good');
      toast('🌳 Left in peace, it settles back into the undergrowth.', 3600);
      if (typeof saveGameQuiet === 'function') saveGameQuiet();
    } else {
      startCombat({kind:'clansettlement_explore', key:'mossback', enemy: enemy, portId:null});
    }
  };

  window.encounterOldMoonBeast = function(choice){
    const cs = clanSettlementState();
    if (!cs.zonesScouted.unknown_territory) { toast('🔒 That territory hasn\'t been scouted yet.'); return; }
    if (choice === 'withdraw') {
      game.oldMoonBeastWithdrawn = true;
      logEvent('🌕 The crew withdraws. Whatever the Old Moon Beast is guarding, it isn\'t theirs to take.', 'good');
      toast('🌕 "Not every dangerous thing needs to be defeated," San says.', 4800);
      if (typeof showStoryModal === 'function') {
        setTimeout(function(){
          showStoryModal({title: '🌕 The Old Moon Beast', blurb: 'It watches them go. Ancient, territorial, and — the locals were right — never actually the enemy here.'});
        }, 400);
      }
      if (typeof saveGameQuiet === 'function') saveGameQuiet();
    } else {
      const enemy = scaledEnemyForExplore('the_old_moon_beast', 'harbor');
      startCombat({kind:'clansettlement_explore', key:'the_old_moon_beast', enemy: enemy, portId:null});
    }
  };

  let clanActiveSection = 'settlement';
  window.switchClanSection = function(key){
    const cs = clanSettlementState();
    if (!cs.sections[key]) { toast('Not open to them yet.'); return; }
    clanActiveSection = key;
    window.renderClanSettlementScreen();
  };

  window.renderClanSettlementScreen = function(){
    const titleEl = document.getElementById('clanSettlementHeaderTitle');
    const subEl = document.getElementById('clanSettlementHeaderSubtitle');
    const container = document.getElementById('clanSettlementContent');
    if (!container) return;
    const cs = clanSettlementState();
    if (titleEl) titleEl.textContent = cs.nameKnown ? ('🌕 ' + cs.name) : '🌕 UNKNOWN SETTLEMENT';
    if (subEl) subEl.textContent = cs.nameKnown ? 'A place the crew is starting to know' : 'Location not yet identified';

    let html = '<div class="tabs" style="flex-wrap:wrap;">';
    CLAN_SETTLEMENT_SECTIONS.forEach(function(sec){
      const unlocked = cs.sections[sec.key];
      html += '<button class="tab-btn'+(clanActiveSection===sec.key?' active':'')+'" '+
        (unlocked ? 'onclick="switchClanSection(\''+sec.key+'\')"' : 'disabled style="opacity:.45;cursor:not-allowed;"') +
        '>'+sec.icon+' '+sec.name+'</button>';
    });
    html += '</div><div class="panel" style="margin-top:10px;">';

    const activeDef = CLAN_SETTLEMENT_SECTIONS.find(s => s.key === clanActiveSection);
    if (!cs.sections[clanActiveSection]) {
      html += '<div class="story-chip">'+(activeDef?activeDef.lockedText:'🔒 Not available yet')+'</div>';
    } else if (clanActiveSection === 'settlement') {
      const scoutedCount = Object.keys(cs.zonesScouted).length;
      html += '<div class="panel-title">🏘️ Settlement</div>'+
        '<div style="font-size:.85rem;line-height:1.8;">'+
        'World: <strong>'+(cs.worldName || 'Unknown')+'</strong><br>'+
        'Region: <strong>Unknown</strong><br>'+
        'Settlement: <strong>'+(cs.nameKnown ? cs.name : 'Unknown')+'</strong><br>'+
        'Local Customs: <strong>'+(cs.relationship === CLAN_RELATIONSHIP_TIERS[CLAN_RELATIONSHIP_TIERS.length-1] ? 'Learned' : 'Unknown')+'</strong><br>'+
        'Trade Status: <strong>'+(cs.sections.market ? 'Established' : 'None')+'</strong><br>'+
        'Relationship: <strong>'+cs.relationship+'</strong>'+
        '</div><p style="font-size:.8rem;opacity:.7;margin-top:8px;">Territory scouted: '+scoutedCount+'/'+WILDERNESS_ZONES.length+'</p>';
    } else if (clanActiveSection === 'explore') {
      html += '<div class="panel-title">🧭 Explore</div>'+
        '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">The settlement itself, up close — homes, workshops, the ordinary business of people who happen to change shape.</p>';
      ['moonfang_wolves','gloom_stalker'].forEach(function(key){
        const e = scaledEnemyForExplore(key, 'harbor');
        html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.6rem;">'+e.icon+'</div><div style="flex:1;"><strong>'+e.name+'</strong><br>'+
          '<span style="font-size:.8rem;opacity:.8;">'+e.desc+'</span><br>'+
          '<span style="font-size:.8rem;">'+e.hp+' HP · '+e.xp+' XP · '+e.gold+'g · Lv.'+e.scaledFromLevel+'</span></div>'+
          '<button class="btn btn-small btn-combat" onclick="startHarborFight(\''+key+'\', \'clansettlement_explore\')">Fight</button></div></article>';
      });
    } else if (clanActiveSection === 'wilderness') {
      const status = window.scoutWildernessStatus();
      html += '<div class="panel-title">🌲 Wilderness</div>'+
        '<p style="font-size:.82rem;opacity:.8;margin-bottom:8px;">Regional zones surrounding the settlement, scouted one at a time.</p>';
      if (status.state === 'ready') {
        html += '<button class="btn btn-small btn-success" onclick="scoutWilderness()" style="margin-bottom:10px;">🧭 Scout Further</button>';
      } else {
        const hrs = Math.max(0, Math.ceil(status.msLeft / 3600000));
        html += '<p style="font-size:.76rem;opacity:.6;margin-bottom:10px;">Ready to scout again in about '+hrs+' hour'+(hrs===1?'':'s')+'.</p>';
      }
      WILDERNESS_ZONES.forEach(function(zone){
        const scouted = cs.zonesScouted[zone.key];
        html += '<div style="margin-bottom:10px;padding:8px 0;border-top:1px solid rgba(232,197,71,.15);">';
        if (!scouted) {
          html += '<strong style="opacity:.5;">'+zone.icon+' ??? </strong><span style="font-size:.76rem;opacity:.5;"> — not yet scouted</span>';
        } else {
          html += '<strong>'+zone.icon+' '+zone.name+'</strong><br>';
          zone.enemies.forEach(function(key){
            const e = scaledEnemyForExplore(key, 'harbor');
            html += '<div style="font-size:.78rem;margin:4px 0;">'+e.icon+' '+e.name+' ('+e.hp+' HP) '+
              '<button class="btn btn-small btn-combat" style="margin-left:6px;padding:2px 8px;" onclick="startHarborFight(\''+key+'\', \'clansettlement_explore\')">Fight</button></div>';
          });
          if (zone.special === 'mossback') {
            html += '<div style="font-size:.78rem;margin:6px 0;background:rgba(120,200,120,.1);border-radius:6px;padding:6px;">'+
              '🌳 A Mossback rests nearby. Usually peaceful — dangerous if threatened.<br>'+
              '<button class="btn btn-small" style="margin-top:4px;" onclick="encounterMossback(\'leave\')">Leave it be</button> '+
              '<button class="btn btn-small btn-combat" style="margin-top:4px;" onclick="encounterMossback(\'provoke\')">Provoke it</button></div>';
          }
          if (zone.special === 'old_moon_beast') {
            html += '<div style="font-size:.78rem;margin:6px 0;background:rgba(200,180,100,.1);border-radius:6px;padding:6px;">'+
              '🌕 The Old Moon Beast watches from a distance. Ancient. Territorial. The locals say it isn\'t evil.<br>'+
              '<button class="btn btn-small" style="margin-top:4px;" onclick="encounterOldMoonBeast(\'withdraw\')">Withdraw</button> '+
              '<button class="btn btn-small btn-combat" style="margin-top:4px;" onclick="encounterOldMoonBeast(\'fight\')">Fight it</button></div>';
          }
        }
        html += '</div>';
      });
    } else {
      html += '<div class="panel-title">'+(activeDef?activeDef.icon+' '+activeDef.name:'')+'</div>'+
        '<p style="font-size:.85rem;opacity:.7;">Nothing here yet.</p>';
    }
    html += '</div>';
    container.innerHTML = html;
  };

  const oldRenderNavigationForClan = window.renderNavigation;
  window.renderNavigation = function(){
    if (oldRenderNavigationForClan) oldRenderNavigationForClan();
    const grid = document.getElementById('navPortGrid');
    if (!grid || !window.clanSettlementUnlocked()) return;
    const cs = clanSettlementState();
    grid.insertAdjacentHTML('beforeend',
      '<div class="port-card" style="cursor:pointer;border-color:rgba(200,180,100,.5);border-style:dashed;" onclick="sailToClanSettlement()">'+
      '<div style="font-size:1.6rem;">🌕</div><div style="font-weight:600;">'+(cs.nameKnown?cs.name:'Unknown Settlement')+'</div>'+
      '<div style="font-size:.72rem;opacity:.7;">Tracks leading somewhere new.</div></div>');
  };

  const oldGoScreenForClan = window.goScreen;
  window.goScreen = function(name){
    if (name === 'clansettlement') { game.voyageInProgress = false; }
    if (oldGoScreenForClan) oldGoScreenForClan(name);
    if (name === 'clansettlement' && typeof window.renderClanSettlementScreen === 'function') window.renderClanSettlementScreen();
  };

  // Voyage transition, matching Harbour/Tide Network's pattern and the
  // general voyageInProgress lock (V178) — blocked from starting while
  // any other voyage-style transition is already active.
  const CLAN_VOYAGE_EVENTS = [
    { type: 'combat', text: 'Something large moves through the treeline, pacing the ship along the shore.', combat: 'shore_pack_scout' },
    { type: 'combat', text: 'A shape breaks from the ridge line and closes fast, faster than anything should move on four legs.', combat: 'something_on_the_ridge' },
    { type: 'flavor', text: 'Distant howls answer each other across the hills, back and forth, unmistakably a conversation.' },
    { type: 'flavor', text: 'Something watches from the tree line the whole way in. Nobody can say from where, exactly.' },
    { type: 'flavor', text: 'The forest goes quiet in a way that feels deliberate, not natural.' },
    { type: 'calm', text: 'The approach is uneventful. The shore just gets closer.' }
  ];

  window.sailToClanSettlement = function(){
    if (game.voyageInProgress) { toast('⛵ Already underway — finish this crossing first.'); return; }
    const overlay = document.getElementById('voyageScreen');
    if (!overlay) { goScreen('clansettlement'); return; }
    game.voyageInProgress = true;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('voyageScreen').classList.add('active');
    document.getElementById('voyageDest').textContent = 'Toward the Unknown Settlement';
    document.getElementById('voyageProgress').style.width = '0%';
    document.getElementById('voyageEvent').innerHTML = '';
    const totalDays = 2;
    let currentDay = 0;
    const interval = setInterval(function(){
      currentDay++;
      document.getElementById('voyageProgress').style.width = (currentDay / totalDays * 100) + '%';
      if (Math.random() < 0.45) {
        const event = CLAN_VOYAGE_EVENTS[Math.floor(Math.random() * CLAN_VOYAGE_EVENTS.length)];
        document.getElementById('voyageEvent').innerHTML = '<span style="color: var(--danger);">' + event.text + '</span>';
        if (event.type === 'combat') {
          clearInterval(interval);
          setTimeout(function(){
            const enemy = (typeof scaledEnemyForExplore === 'function') ? scaledEnemyForExplore(event.combat, 'sea') : null;
            startCombat({ kind: 'clansettlement_voyage', key: event.combat, enemy: enemy, portId: null });
          }, 1000);
          return;
        }
      } else {
        document.getElementById('voyageEvent').innerHTML = '<span style="color: var(--success);">The crossing continues.</span>';
      }
      if (currentDay >= totalDays) {
        clearInterval(interval);
        setTimeout(function(){ goScreen('clansettlement'); }, 800);
      }
    }, 900);
  };
})();


(function(){
  // -------------------------------------------------------------------
  // PART 1: VOYAGE LOCK SAFETY VALVE. San reported sailing getting
  // "stuck" — a real, serious latent risk in the V178 voyageInProgress
  // design: if a voyage ever fails to reach a screen covered by the
  // release logic (port/harbour/tidenetwork/interworld/clansettlement),
  // the lock stays true forever, permanently blocking all future
  // sailing. Fixed two ways: reset on every fresh load (a voyage
  // animation can never legitimately survive a page reload anyway), and
  // a defensive check on every UI update — if the lock is held but the
  // voyage screen genuinely isn't the one showing, something already
  // went wrong, so release it rather than trust the flag blindly.
  // -------------------------------------------------------------------
  const oldLoadGameForVoyageSafety = window.loadGame;
  window.loadGame = function(){
    const result = oldLoadGameForVoyageSafety.apply(this, arguments);
    if (typeof game !== 'undefined') game.voyageInProgress = false;
    return result;
  };

  const oldUpdateUIForVoyageSafety = window.updateUI;
  window.updateUI = function(){
    if (game.voyageInProgress) {
      const voyageScreenEl = document.getElementById('voyageScreen');
      const voyageActuallyShowing = voyageScreenEl && voyageScreenEl.classList.contains('active');
      if (!voyageActuallyShowing) {
        console.warn('[VoyageGuard] voyageInProgress was stuck true with no voyage screen active — releasing.');
        game.voyageInProgress = false;
      }
    }
    return oldUpdateUIForVoyageSafety.apply(this, arguments);
  };

  // -------------------------------------------------------------------
  // PART 2: REST AT THE UNKNOWN LOCATIONS. Mirrors freeRestAtPort()'s
  // exact rules (free, full HP/MP recovery, 20% ambush chance) but with
  // its own separate daily tracker per location, and each location's
  // own themed Explore-tab enemy pool for the ambush instead of a real
  // port's. Trade/Market stays locked as San noted — this only touches
  // resting, which makes sense to have from the moment you arrive,
  // before any relationship or trade status is established.
  // -------------------------------------------------------------------
  const LOCATION_REST_POOLS = {
    harbour: ['dockside_pickpockets','lantern_smugglers','harbor_floor_scavengers','overzealous_tollkeeper','restless_shrine_guardian'],
    tidenetwork: ['confused_shoal','territorial_pufferkin','deepwater_opportunist','tidewrecked_scavenger','unmoored_current_spirit'],
    clansettlement: ['moonfang_wolves','gloom_stalker','thornback_boar']
  };

  window.restAtLocation = function(locationKey){
    game.locationRestDay = game.locationRestDay || {};
    if (game.locationRestDay[locationKey] === game.day) {
      toast('Already rested here today.');
      return;
    }
    game.locationRestDay[locationKey] = game.day;
    game.partyHp = game.partyHp || {};
    game.partyMp = game.partyMp || {};
    const permanent = typeof getActiveParty === 'function' ? getActiveParty() : [];
    permanent.forEach(function(m){
      game.partyHp[m.id] = effectiveMaxHp(m);
      game.partyMp[m.id] = effectiveMaxMp(m);
    });
    (game.temporaryCrew || []).forEach(function(m){
      game.partyHp[m.id] = Number(m.maxHp || m.hp || 1);
      game.partyMp[m.id] = Number(m.maxMp || m.mp || 0);
    });
    logEvent('🔥 The crew rests. Everyone is fully recovered.', 'good');
    toast('🔥 Fully rested.', 3200);

    if (Math.random() < 0.20) {
      const pool = LOCATION_REST_POOLS[locationKey] || [];
      if (pool.length) {
        logEvent('⚠️ The rest does not stay quiet. Something approaches!', 'bad');
        setTimeout(function(){
          const key = pool[Math.floor(Math.random() * pool.length)];
          const enemy = (typeof scaledEnemyForExplore === 'function') ? scaledEnemyForExplore(key, 'harbor') : null;
          if (enemy) startCombat({kind:'harbor', key, enemy, portId:null});
        }, 600);
      }
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
  };

  function restPanelHtml(locationKey){
    game.locationRestDay = game.locationRestDay || {};
    const usedToday = game.locationRestDay[locationKey] === game.day;
    return '<div class="panel" style="margin-top:10px;border-color:rgba(232,197,71,.42);">'+
      '<div class="panel-title">🔥 Set Up Camp</div>'+
      '<div style="font-size:.8rem;opacity:.9;line-height:1.5;">'+
      '<b>FREE</b> • Recover <b>100%</b> HP/MP<br>⚠️ <b>20% chance of an encounter</b></div>'+
      '<button class="btn btn-success" style="margin-top:8px;" '+(usedToday?'disabled':'')+' onclick="restAtLocation(\''+locationKey+'\')">🛏️ '+(usedToday?'Already Rested Today':'Rest Here — Free')+'</button>'+
      '</div>';
  }
  window.__ctRestPanelHtml = restPanelHtml;

  // Appended as a persistent panel on each location screen, regardless
  // of which internal tab is active — matches how Seafarer's Rest
  // already works on the normal Port screen (a standalone panel, not
  // tucked inside a specific tab). The active-tab state inside each
  // location's render function is private to its own closure and can't
  // be read from here, so "always visible" is both the simplest and the
  // most consistent choice with the existing pattern.
  const oldRenderHarbourScreenForRest = window.renderHarbourScreen;
  window.renderHarbourScreen = function(){
    oldRenderHarbourScreenForRest.apply(this, arguments);
    const container = document.getElementById('harbourContent');
    if (container) container.insertAdjacentHTML('beforeend', restPanelHtml('harbour'));
  };

  const oldRenderTideNetworkScreenForRest = window.renderTideNetworkScreen;
  window.renderTideNetworkScreen = function(){
    oldRenderTideNetworkScreenForRest.apply(this, arguments);
    const container = document.getElementById('tideNetworkContent');
    if (container) container.insertAdjacentHTML('beforeend', restPanelHtml('tidenetwork'));
  };

  const oldRenderClanSettlementScreenForRest = window.renderClanSettlementScreen;
  window.renderClanSettlementScreen = function(){
    oldRenderClanSettlementScreenForRest.apply(this, arguments);
    const container = document.getElementById('clanSettlementContent');
    if (container) container.insertAdjacentHTML('beforeend', restPanelHtml('clansettlement'));
  };
})();


// Register the service worker (see sw.js) for offline play + installability.
// Registered with a relative path so it works whether the game is served
// from a domain root or a GitHub Pages subpath.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
