
(function(){
  // -------------------------------------------------------------------
  // THE WATCHMAN'S ARCANE SPECTACLES (Joel) & THE 'AT LEAST MINE MATCH'
  // SPECTACLES (Erynn) — two named, one-time accessory grants, available
  // once Arc X is complete. Built as ordinary entries in the existing
  // trophy/trinket system (equippedTrophies/TRINKET_BONUS) rather than a
  // new head-slot mechanic — same equip flow players already know, no
  // new UI needed. Joel's ties into Arc XI's own "treats the watch like
  // lookout duty" characterization; Erynn's is exactly the joke San
  // asked for, nothing more serious than that.
  //
  // Granted automatically, once, the moment Arc X's completion is first
  // detected — checked here via a renderMainGoal wrap, since every
  // chapter-completion function across every arc already calls that,
  // including Arc X's own finale. Also correctly catches anyone who
  // completed Arc X in an earlier session, the first time they load in.
  // -------------------------------------------------------------------
  Object.assign(TRINKET_BONUS, {
    '🥽': {hpBonus: 30, critPct: 0.08, magicBonus: 5, label: '+30 max HP, +8% crit chance, +5 MAG'},
    '🕶️': {spellPct: 0.08, goldPct: 0.05, label: '+8% spell damage, +5% gold'}
  });

  function grantSpectaclesIfDue(){
    if (!game.arc10Complete) return;
    if (game.watchmansSpectaclesGranted && game.atLeastMineMatchGranted) return; // already done, nothing to check further
    game.inventory = game.inventory || [];
    if (!game.watchmansSpectaclesGranted) {
      game.inventory.push({id:'watchmans_arcane_spectacles', name:"The Watchman's Arcane Spectacles", icon:'🥽', desc:"Joel's, for the watch. Somewhere between Erynn's research and Renn's tinkering, they figured out how to let him actually see some of what he's been staring at."});
      game.watchmansSpectaclesGranted = true;
      logEvent('🥽 Joel receives The Watchman\'s Arcane Spectacles — made for the long watches over the Horizon Engine.', 'gold');
    }
    if (!game.atLeastMineMatchGranted) {
      game.inventory.push({id:'at_least_mine_match_spectacles', name:"The 'At Least Mine Match' Spectacles", icon:'🕶️', desc:"Erynn's. Nobody asked for a rivalry with Renn's eyewear. Erynn started one anyway, and is not sorry about it."});
      game.atLeastMineMatchGranted = true;
      logEvent('🕶️ Erynn receives The \'At Least Mine Match\' Spectacles — deeply, unnecessarily pleased about it.', 'gold');
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  }
  window.grantSpectaclesIfDue = grantSpectaclesIfDue;

  // Extends gearBonuses() to also fold in a trinket-based MAG stat — the
  // existing trinket system had no field feeding the magic stat at all,
  // only gear did. Every damage calculation that reads gb.magic (4
  // separate combat sites — hex skills, general skills, spells) already
  // reads its value from this one function, so extending it here covers
  // all of them without needing to touch any of those sites directly.
  const oldGearBonusesForSpectacles = window.gearBonuses;
  window.gearBonuses = function(memberId){
    const out = oldGearBonusesForSpectacles(memberId);
    const tb = (typeof trinketBonus === 'function') ? trinketBonus(memberId) : null;
    if (tb && tb.magicBonus) out.magic += tb.magicBonus;
    return out;
  };
  if (typeof gearBonuses === 'function') gearBonuses = window.gearBonuses;

  const oldRenderMainGoalForSpectacles = window.renderMainGoal;
  window.renderMainGoal = function(){
    if (oldRenderMainGoalForSpectacles) oldRenderMainGoalForSpectacles();
    grantSpectaclesIfDue();
  };
})();


(function(){
  // -------------------------------------------------------------------
  // EXTENDED CREW — the full-cast reference sheet, wired into the Crew
  // screen just below the main fielding roster. Positioned there
  // specifically because it overlaps with the Research Expedition's own
  // "Horizon Team" (Renn/Erynn/Mimi) — a quick visual reference for the
  // whole cast, not a functional/interactive panel like the roster above
  // it. Tap to open full-size, same lightbox openComicImage() already
  // uses for chapter art.
  //
  // Path confirmed by San: assets/crew/crew-expedition-reference-sheet.png
  // -------------------------------------------------------------------
  const oldRenderPartyScreenForExtendedCrew = window.renderPartyScreen;
  window.renderPartyScreen = function(){
    if (oldRenderPartyScreenForExtendedCrew) oldRenderPartyScreenForExtendedCrew();
    const container = document.getElementById('partyDetail');
    if (!container) return;
    container.insertAdjacentHTML('beforeend',
      '<div class="panel" style="margin-top:12px;">'+
      '<div class="panel-title">🖼️ Extended Crew</div>'+
      '<p style="font-size:.8rem;opacity:.8;margin-bottom:10px;">Different people. Different paths. A shared horizon. The whole cast, from San and Joel to the Horizon Team, in one place.</p>'+
      '<img src="assets/crew/crew-expedition-reference-sheet.png" alt="Crimson Tide — full crew reference" '+
      'style="width:100%;border-radius:8px;cursor:pointer;display:block;" '+
      'onclick="openComicImage(\'assets/crew/crew-expedition-reference-sheet.png\')">'+
      '</div>');
  };
})();


(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE REQUESTS. Confirmed gating: game.arc6Complete (Fair Tide
  // exists at all) + window.fairTideRenovationDone() (the port is
  // actually open). Reuses the proven Dispatch timer/claim pattern
  // (game.fairTideDispatch's startedAt/Date.now() shape) but for
  // multiple concurrent board slots instead of one. Reuses each
  // companion's existing .role field directly for the "San's
  // Assessment -> Solution" matching (Aisyah "Quartermaster", Senedra
  // "Lookout", etc.) — no new categorization invented, these already
  // match San's own example quotes exactly.
  //
  // Player picks WHICH board request to start (same click-to-begin
  // action as Dispatch today); San auto-decides HOW it's solved — who
  // gets assigned, based on role match against whoever's currently
  // fielded. Board size scales with Port HQ level: base 3, +1 at level
  // 3, +1 at level 5, capping at 5.
  //
  // Deliberately NOT built yet: the "story surprise" hook (an arrival
  // claiming to have come through the Storm) — that ties into the
  // multi-crossing-point mystery and deserves real narrative content
  // from San rather than an invented placeholder. Noted for later.
  // -------------------------------------------------------------------
  const FAIR_TIDE_REQUESTS = [
  {id:"missing_boats", category:"Maritime", icon:"🌊", requesterType:"A fisherman", title:"Missing Boats", desc:"Three of our boats haven't returned. We don't know if they've been caught in the storm.", assessment:"They should have returned before the tide changed. This isn't normal.", preferredRoles:["Lookout", "Storm Caller"], tier:"standard", rewards:{"gold": 60, "reputation": 3, "resources": {"food": 8}}},
  {id:"damaged_hull", category:"Maritime", icon:"🌊", requesterType:"A trader captain", title:"A Damaged Hull", desc:"We took on water past the reef. If we sail again like this, we won't make it back out.", assessment:"That's not a patch job. Someone who actually knows hulls needs to look at it.", preferredRoles:["Boarding Fighter", "Quartermaster"], tier:"quick", rewards:{"gold": 35, "reputation": 2, "resources": {"timber": 6}}},
  {id:"strange_currents", category:"Maritime", icon:"🌊", requesterType:"A worried sailor", title:"Strange Currents", desc:"The water past the point isn't moving the way it should. My crew won't sail it anymore.", assessment:"Water doesn't just decide to behave differently. Something's causing it.", preferredRoles:["Storm Caller", "Diviner"], tier:"standard", rewards:{"gold": 55, "reputation": 3, "resources": {}}},
  {id:"navigation_lesson", category:"Maritime", icon:"🌊", requesterType:"A worried mother", title:"A Navigation Lesson", desc:"My son wants to learn navigation. Could someone teach him?", assessment:"That's not a rescue. That's just — someone should say yes to that.", preferredRoles:["Lookout", "Farseer Descendant"], tier:"quick", rewards:{"gold": 15, "reputation": 2, "resources": {}}},
  {id:"broken_well", category:"Fair Tide", icon:"🏘️", requesterType:"A resident", title:"The Broken Well", desc:"Our well's stopped working. Half the street's been hauling water from the docks.", assessment:"That's not a want. That's a need. Fix it today.", preferredRoles:["Quartermaster", "Boarding Fighter"], tier:"quick", rewards:{"gold": 25, "reputation": 3, "resources": {"stone": 5}}},
  {id:"food_shortage", category:"Fair Tide", icon:"🏘️", requesterType:"A cook", title:"A Food Shortage", desc:"The last shipment came in half of what we ordered. I don't know what I'm feeding people this week.", assessment:"Somebody's numbers don't add up somewhere. Find out where.", preferredRoles:["Quartermaster"], tier:"standard", rewards:{"gold": 40, "reputation": 3, "resources": {"food": 10}}},
  {id:"building_repair", category:"Fair Tide", icon:"🏘️", requesterType:"A builder", title:"A Building in Need of Repair", desc:"The storm took half the roof off the warehouse. It'll fall the rest of the way if it rains again.", assessment:"That won't wait for a quiet week. Get someone on it.", preferredRoles:["Boarding Fighter", "Quartermaster"], tier:"standard", rewards:{"gold": 45, "reputation": 3, "resources": {"timber": 8, "stone": 4}}},
  {id:"resident_dispute", category:"Fair Tide", icon:"🏘️", requesterType:"Two neighbors", title:"A Dispute Between Residents", desc:"They're both convinced the other one's lying about whose fence that actually is.", assessment:"Nobody's bleeding. Nobody's stealing. This just needs someone patient.", preferredRoles:["Ship Healer", "Farseer Descendant"], tier:"quick", rewards:{"gold": 20, "reputation": 2, "resources": {}}},
  {id:"stolen_cargo", category:"Trade", icon:"💰", requesterType:"A merchant", title:"Stolen Cargo", desc:"My cargo arrived, but half of it is missing. Someone along the route helped themselves.", assessment:"Somebody along that route got greedy. Find out who.", preferredRoles:["Quartermaster", "Lookout"], tier:"standard", rewards:{"gold": 70, "reputation": 3, "resources": {"trade": 6}}},
  {id:"unreliable_merchant", category:"Trade", icon:"💰", requesterType:"A regular buyer", title:"An Unreliable Merchant", desc:"He's promised the same delivery three times now. I'm done being patient.", assessment:"Either he's overcommitted or he's lying. Either way, someone needs to have that conversation.", preferredRoles:["Quartermaster"], tier:"quick", rewards:{"gold": 30, "reputation": 2, "resources": {}}},
  {id:"blocked_trade_route", category:"Trade", icon:"💰", requesterType:"A route captain", title:"A Blocked Trade Route", desc:"Something's sitting in the channel and nobody's willing to sail past it to find out what.", assessment:"If it's blocking trade, it's costing everyone. That needs eyes on it.", preferredRoles:["Boarding Fighter", "Storm Caller"], tier:"major", rewards:{"gold": 100, "reputation": 4, "resources": {"trade": 10}}},
  {id:"unusual_demand", category:"Trade", icon:"💰", requesterType:"A trader", title:"Unusual Demand", desc:"Everyone's suddenly asking for the same rare goods. I don't know why, and it's making prices ugly.", assessment:"Sudden demand like that usually means somebody knows something the rest of us don't.", preferredRoles:["Arcane Trickster", "Farseer Descendant"], tier:"standard", rewards:{"gold": 65, "reputation": 3, "resources": {"trade": 8}}},
  {id:"recurring_dream", category:"Strange", icon:"🔮", requesterType:"A restless woman", title:"The Same Dream, Again", desc:"I keep dreaming the same thing, every night, for two weeks now. I don't know why it won't stop.", assessment:"Dreams don't usually repeat themselves exactly. That's worth taking seriously.", preferredRoles:["Diviner", "Farseer Descendant"], tier:"standard", rewards:{"gold": 50, "reputation": 4, "resources": {}}},
  {id:"offshore_light", category:"Strange", icon:"🔮", requesterType:"A night watchman", title:"A Light Offshore", desc:"There's a light out past the reef most nights now. It wasn't there a month ago.", assessment:"Lights don't just appear. Something's putting it there.", preferredRoles:["Lookout", "Arcane Trickster"], tier:"standard", rewards:{"gold": 55, "reputation": 4, "resources": {}}},
  {id:"impossible_object", category:"Strange", icon:"🔮", requesterType:"A dockworker", title:"An Object That Shouldn't Exist", desc:"We pulled this up in the nets. Nobody here's ever seen anything like it.", assessment:"That's not driftwood, and it's not ordinary cargo either. Renn's going to want to see this.", preferredRoles:["Arcane Trickster", "Diviner"], tier:"major", rewards:{"gold": 90, "reputation": 5, "resources": {}}},
  {id:"magical_illness_crops", category:"Strange", icon:"🔮", requesterType:"A farmer", title:"Something Wrong With the Crops", desc:"Half the field's gone grey overnight. It's not rot. I've seen rot.", assessment:"That's not a farming problem. That's a boundary problem wearing a farming problem's clothes.", preferredRoles:["Farseer Descendant", "Diviner"], tier:"major", rewards:{"gold": 85, "reputation": 4, "resources": {"food": 5}}},
  {id:"bandits_on_road", category:"Threat", icon:"⚔️", requesterType:"A caravan driver", title:"Bandits on the Coast Road", desc:"They've hit two caravans already this month. Nobody wants to run the route anymore.", assessment:"If they're hitting the same road twice, they'll hit it a third time. Get ahead of it.", preferredRoles:["Boarding Fighter", "Lookout"], tier:"major", rewards:{"gold": 95, "reputation": 4, "resources": {}}},
  {id:"pirates_sighted", category:"Threat", icon:"⚔️", requesterType:"A returning sailor", title:"Pirates Sighted", desc:"Saw a ship flying no colors, running fast, near the shoals. Didn't like the look of it.", assessment:"No colors and running fast usually means trouble looking for somewhere to happen.", preferredRoles:["Boarding Fighter", "Storm Caller"], tier:"major", rewards:{"gold": 100, "reputation": 4, "resources": {}}},
  {id:"exploited_workers", category:"Threat", icon:"⚔️", requesterType:"A frightened worker", title:"Workers Being Exploited", desc:"The new foreman's been taking more than his share and threatening anyone who complains.", assessment:"That's exactly the kind of thing Fair Tide isn't supposed to look away from.", preferredRoles:["Quartermaster", "Boarding Fighter"], tier:"standard", rewards:{"gold": 60, "reputation": 5, "resources": {}}},
  {id:"looking_for_work", category:"Community", icon:"👨‍👩‍👧", requesterType:"A newcomer", title:"Looking for Work", desc:"I've got two working hands and nowhere to put them to use yet.", assessment:"Fair Tide can always use two more working hands. See what fits.", preferredRoles:["Quartermaster"], tier:"quick", rewards:{"gold": 15, "reputation": 3, "resources": {}}},
  {id:"apprenticeship_needed", category:"Community", icon:"👨‍👩‍👧", requesterType:"A hopeful parent", title:"A Child Needing an Apprenticeship", desc:"My daughter's got a good eye and no one willing to teach her yet.", assessment:"Somebody around here's got the patience for that. Find them.", preferredRoles:["Ship Healer", "Lookout"], tier:"quick", rewards:{"gold": 15, "reputation": 3, "resources": {}}},
  {id:"family_needs_shelter", category:"Community", icon:"👨‍👩‍👧", requesterType:"A tired traveler", title:"A Family Needing Somewhere to Stay", desc:"We've got nowhere left to go. We heard this port doesn't turn people away.", assessment:"Then it's not going to start now.", preferredRoles:["Quartermaster", "Ship Healer"], tier:"standard", rewards:{"gold": 30, "reputation": 5, "resources": {"food": 4}}},
  {id:"newcomer_integration", category:"Community", icon:"👨‍👩‍👧", requesterType:"A recent arrival", title:"Help Settling In", desc:"Everyone here already knows each other. I don't know anyone yet.", assessment:"That's the easiest kind of problem Fair Tide has. Just introduce them around.", preferredRoles:["Ship Healer", "Farseer Descendant"], tier:"quick", rewards:{"gold": 15, "reputation": 2, "resources": {}}}
  ];
  window.FAIR_TIDE_REQUESTS = FAIR_TIDE_REQUESTS;

  // LEWIS'S REQUESTS. Once he's an ally captain (see grantLewisAllyCaptainIfDue
  // below), his own named requests occasionally appear on the board instead
  // of a generic one — friendly ally rivalry rather than the usual "someone
  // needs help" framing. Fixed requesterType "Lewis" rather than a random
  // name, since he's a specific recurring character, not an anonymous NPC.
  const LEWIS_REQUESTS = [
    {id:"lewis_untried_route", category:"Ally", icon:"⚓", requesterType:"Lewis", title:"A Route I Haven't Tried", desc:"There's a route past the eastern shoals I've never sailed. Figured I'd mention it before I try it myself.", assessment:"That's Lewis for \"I want to see if you'll beat me to it.\"", preferredRoles:["Lookout","Storm Caller"], tier:"standard", rewards:{gold:70, reputation:3, resources:{trade:8}}},
    {id:"lewis_compare_notes", category:"Ally", icon:"⚓", requesterType:"Lewis", title:"Compare Notes", desc:"Curious how your crew handles cargo. Might learn something. Might not.", assessment:"He already thinks he knows the answer. Prove him wrong.", preferredRoles:["Quartermaster"], tier:"quick", rewards:{gold:30, reputation:2, resources:{}}},
    {id:"lewis_needs_a_hand", category:"Ally", icon:"⚓", requesterType:"Lewis", title:"The Steady Reach Needs a Hand", desc:"Something's off with the rigging. Didn't want to say anything in front of my own crew.", assessment:"He'd rather owe San one than admit it to Aisy.", preferredRoles:["Boarding Fighter","Quartermaster"], tier:"standard", rewards:{gold:60, reputation:3, resources:{timber:6}}},
    {id:"lewis_who_gets_there_first", category:"Ally", icon:"⚓", requesterType:"Lewis", title:"Who Gets There First", desc:"Same delivery, same deadline. Let's see whose crew actually earns their keep.", assessment:"He's not going to admit he's competitive about this. He's extremely competitive about this.", preferredRoles:["Lookout","Storm Caller"], tier:"major", rewards:{gold:100, reputation:4, resources:{trade:10}}},
    {id:"lewis_client_too_big", category:"Ally", icon:"⚓", requesterType:"Lewis", title:"A Client Too Big for One Ship", desc:"Got an order neither of our crews can fill alone. Didn't love saying that part out loud.", assessment:"For once, this isn't about who's better. It's actually about getting it done.", preferredRoles:["Quartermaster","Boarding Fighter"], tier:"major", rewards:{gold:120, reputation:5, resources:{trade:12}}}
  ];
  window.LEWIS_REQUESTS = LEWIS_REQUESTS;

  const REQUESTER_NAMES = [
    'Wei Ling','Boon Kiat','Farah','Hafiz','Reyes','Bagyo','Somchai','Ratana',
    'Dewi','Agus','Minh','Lan','Zeya','Hla','Poh Choo','Rashid','Marisol','Zulkifli'
  ];

  const TIER_DURATIONS_MS = { quick: 20*60*1000, standard: 2*60*60*1000, major: 8*60*60*1000 };
  const TIER_LABELS = { quick: 'Quick (~20 min)', standard: 'Standard (~2 hrs)', major: 'Major (~8 hrs)' };

  function requestBoard(){ game.fairTideRequestBoard = game.fairTideRequestBoard || []; return game.fairTideRequestBoard; }
  window.fairTideRequestBoard = requestBoard;

  function requesterState(){ game.fairTideRequesters = game.fairTideRequesters || {}; return game.fairTideRequesters; }
  window.fairTideRequesterState = requesterState;

  window.fairTideRequestsUnlocked = function(){
    return !!game.arc6Complete && typeof window.fairTideRenovationDone === 'function' && window.fairTideRenovationDone();
  };

  window.getRequestBoardSize = function(){
    const lvl = (game.fairTideBuildings && game.fairTideBuildings.port_hq) || 0;
    let size = 3;
    if (lvl >= 3) size += 1;
    if (lvl >= 5) size += 1;
    return Math.min(5, size);
  };

  function randomRequesterName(){
    return REQUESTER_NAMES[Math.floor(Math.random() * REQUESTER_NAMES.length)];
  }

  // NPC MEMORY LAYER: previously every board slot got a genuinely random
  // name with zero memory — nobody who asked for help today was
  // trackable tomorrow. This is the fix. 40% chance of bringing back
  // someone already known (if anyone below 'resident' status exists —
  // once someone's fully settled at Fair Tide they stop showing up with
  // new requests of their own), otherwise prefers introducing a
  // genuinely new name from the pool before ever repeating one blind.
  function pickRequesterForBoard(){
    const rs = requesterState();
    const known = Object.keys(rs).filter(name => rs[name].status !== 'resident');
    if (known.length && Math.random() < 0.4) {
      return known[Math.floor(Math.random() * known.length)];
    }
    const unmet = REQUESTER_NAMES.filter(name => !rs[name]);
    if (unmet.length) return unmet[Math.floor(Math.random() * unmet.length)];
    return known.length ? known[Math.floor(Math.random() * known.length)] : randomRequesterName();
  }

  function ensureRequesterRegistered(name){
    const rs = requesterState();
    if (!rs[name]) rs[name] = {visits: 0, trust: 0, status: 'visitor', firstMetDay: game.day || 0, requestHistory: []};
    return rs[name];
  }

  // Fills any open board slots with a fresh, randomly-picked request —
  // called on every render of the tab and after claiming, so the board
  // never sits visibly empty for long.
  function refillBoard(){
    if (!window.fairTideRequestsUnlocked()) return;
    const board = requestBoard();
    const size = window.getRequestBoardSize();
    while (board.length < size) {
      const lewisAlreadyOnBoard = board.some(s => s.npcName === 'Lewis');
      const offerLewis = game.lewisAllyCaptain && !lewisAlreadyOnBoard && Math.random() < 0.2;
      if (offerLewis) {
        const template = LEWIS_REQUESTS[Math.floor(Math.random() * LEWIS_REQUESTS.length)];
        board.push({
          slotId: 'slot_' + Date.now() + '_' + Math.floor(Math.random()*10000),
          requestId: template.id,
          npcName: 'Lewis',
          status: 'available'
        });
        continue;
      }
      const template = FAIR_TIDE_REQUESTS[Math.floor(Math.random() * FAIR_TIDE_REQUESTS.length)];
      const npcName = pickRequesterForBoard();
      ensureRequesterRegistered(npcName);
      board.push({
        slotId: 'slot_' + Date.now() + '_' + Math.floor(Math.random()*10000),
        requestId: template.id,
        npcName: npcName,
        status: 'available'
      });
    }
  }
  window.refillFairTideBoard = refillBoard;

  function requestTemplate(requestId){ return FAIR_TIDE_REQUESTS.find(r => r.id === requestId) || LEWIS_REQUESTS.find(r => r.id === requestId); }

  // San's Assessment -> Solution: scores currently-fielded companions
  // against the request's preferred roles, picks the best 1-2 matches.
  // Falls back to "San handles it personally" if nobody fielded matches
  // at all — never blocks the request, just changes the flavor of who
  // solves it.
  function assignSolution(template){
    const party = (typeof getActiveParty === 'function' ? getActiveParty() : []).filter(m => {
      return typeof window.isFielded !== 'function' || window.isFielded(m.id);
    });
    const scored = party
      .filter(m => m.id !== 'san')
      .map(m => {
        const match = (m.role && template.preferredRoles.some(r => m.role.includes(r) || r.includes(m.role)));
        return { id: m.id, name: m.name, role: m.role, score: match ? 1 : 0 };
      })
      .sort((a,b) => b.score - a.score);
    const picked = scored.filter(s => s.score > 0).slice(0, 2);
    if (!picked.length) return {names: ['San'], flavor: 'San handles this one personally.'};
    return {names: picked.map(p=>p.name), flavor: picked.map(p=>p.name).join(' and ') + ' take this one.'};
  }

  window.startFairTideRequest = function(slotId){
    const board = requestBoard();
    const slot = board.find(s => s.slotId === slotId);
    if (!slot || slot.status !== 'available') return;
    const template = requestTemplate(slot.requestId);
    if (!template) return;
    const solution = assignSolution(template);
    slot.status = 'active';
    slot.startedAt = Date.now();
    slot.durationMs = TIER_DURATIONS_MS[template.tier];
    slot.assignedNames = solution.names;
    toast('📋 ' + solution.flavor, 3200);
    logEvent('📋 Request accepted: ' + template.title + ' — ' + solution.flavor, 'gold');
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderFairTideHub === 'function') renderFairTideHub();
  };

  window.claimFairTideRequest = function(slotId){
    const board = requestBoard();
    const idx = board.findIndex(s => s.slotId === slotId);
    if (idx === -1) return;
    const slot = board[idx];
    if (slot.status !== 'active') return;
    if (Date.now() - slot.startedAt < slot.durationMs) { toast('⏳ Not back yet.'); return; }
    const template = requestTemplate(slot.requestId);
    if (!template) return;

    game.gold = (game.gold||0) + (template.rewards.gold||0);
    game.reputation = (game.reputation||0) + (template.rewards.reputation||0);
    if (template.rewards.resources) {
      game.fairTideResources = game.fairTideResources || {timber:0, stone:0, food:0, trade:0};
      const cap = (typeof window.fairTideResourceCap === 'function') ? window.fairTideResourceCap() : 999999;
      Object.entries(template.rewards.resources).forEach(([k,v]) => {
        game.fairTideResources[k] = Math.min(cap, (game.fairTideResources[k]||0) + v);
      });
    }

    const rs = requesterState();
    const key = slot.npcName;
    rs[key] = rs[key] || {visits: 0};
    rs[key].visits += 1;

    logEvent('✅ Request resolved: ' + template.title + ' (' + slot.npcName + ') — ' + slot.assignedNames.join(' and ') + '.', 'gold');
    toast('✅ ' + template.title + ' resolved! ' + slot.npcName + ' remembers Crimson Tide.', 4200);

    board.splice(idx, 1);
    refillBoard();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderFairTideHub === 'function') renderFairTideHub();
  };

  // -------------------------------------------------------------------
  // AFK integration — processAFKRewards() is a flat wholeMinutes*rate
  // calculation with no awareness of anything else. Wrapping it to also
  // resolve any board requests whose timer completed during the away
  // period, surfacing a real summary instead of just a bigger number.
  // Requests move to 'ready' here, not auto-claimed — claiming (and its
  // rewards) still needs a deliberate tap, same as Dispatch already works.
  // -------------------------------------------------------------------
  const oldProcessAFKRewardsForRequests = window.processAFKRewards;
  window.processAFKRewards = function(){
    const result = oldProcessAFKRewardsForRequests ? oldProcessAFKRewardsForRequests() : false;
    if (!window.fairTideRequestsUnlocked()) return result;
    const board = requestBoard();
    const nowReady = [];
    board.forEach(slot => {
      if (slot.status === 'active' && Date.now() - slot.startedAt >= slot.durationMs) {
        slot.status = 'ready';
        const t = requestTemplate(slot.requestId);
        if (t) nowReady.push(t.title);
      }
    });
    if (nowReady.length) {
      logEvent('📋 While you were away, ' + nowReady.length + ' request' + (nowReady.length>1?'s':'') + ' finished: ' + nowReady.join(', ') + '.', 'gold');
    }
    return result;
  };

  // -------------------------------------------------------------------
  // Fair Tide Hub tab.
  // -------------------------------------------------------------------
  const oldRenderFairTideHubForRequests = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    if (window.fairTideRequestsUnlocked()) refillBoard();
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-requests');
    const btn = document.getElementById('ft-tab-btn-requests');
    if (el) el.classList.toggle('active', tab==='requests');
    if (btn) btn.classList.toggle('active', tab==='requests');
    if (oldRenderFairTideHubForRequests) oldRenderFairTideHubForRequests();
    if (tab==='requests') renderRequestsTab();
  };

  function renderRequestsTab(){
    const el = document.getElementById('ft-tab-requests');
    if (!el) return;
    if (!window.fairTideRequestsUnlocked()) {
      el.innerHTML = '<div class="panel-title">📋 Requests</div>'+
        '<div class="story-chip">🔒 Opens once Fair Tide is fully renovated.</div>';
      return;
    }
    const board = requestBoard();
    let html = '<div class="panel-title">📋 Fair Tide Requests</div>'+
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">People bring their problems to the dock. San decides who goes.</p>';
    board.forEach(function(slot){
      const t = requestTemplate(slot.requestId);
      if (!t) return;
      html += '<article class="quest-item"><strong>'+t.icon+' '+t.title+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.8;">'+slot.npcName+': "'+t.desc+'"</span><br>'+
        '<span style="font-size:.76rem;opacity:.65;">'+t.category+' · '+TIER_LABELS[t.tier]+'</span>';
      if (slot.status === 'available') {
        html += '<div class="story-actions"><button class="btn btn-small btn-success" onclick="startFairTideRequest(\''+slot.slotId+'\')">🤝 Accept</button></div>';
      } else if (slot.status === 'active') {
        const remaining = Math.max(0, slot.durationMs - (Date.now() - slot.startedAt));
        const mins = Math.ceil(remaining / 60000);
        html += '<div style="font-size:.78rem;margin-top:6px;">📋 '+slot.assignedNames.join(' and ')+' — '+(mins>0?mins+' min left':'almost done')+'</div>';
      } else if (slot.status === 'ready') {
        html += '<div class="story-actions"><button class="btn btn-small btn-success" onclick="claimFairTideRequest(\''+slot.slotId+'\')">✅ Claim Resolution</button></div>';
      }
      html += '</article>';
    });
    el.innerHTML = html;
  }
})();


(function(){
  // -------------------------------------------------------------------
  // WATCHTOWER — a new Fair Tide building tied to Imah (one of San's
  // named-but-unassigned residents). Once built, periodically generates
  // an Alert — themed around Sea Intelligence / Expedition Leads per
  // San's own comparison doc — that can be "investigated" for a bonus
  // Knowledge/Residue grant straight into the existing Horizon Engine
  // resource pool. Deliberately does NOT duplicate the Fair Tide
  // Requests system's Maritime/Strange categories (missing boats,
  // strange currents, offshore lights already live there) — this is
  // specifically the bridge into the Research Expedition system, not a
  // second request board.
  //
  // Alert timing scales with Watchtower level: base 6 hours between
  // alerts, -1 hour per level above 1, floor of 2 hours at max level.
  // -------------------------------------------------------------------
  const WATCHTOWER_ALERTS = [
    {id:'unidentified_ruins', icon:'🏛️', title:'Unidentified Ruins', flavor: 'Imah spots something through the glass that shouldn\'t be there — stonework, on an island that\'s supposed to be empty.', knowledge:15, residue:20},
    {id:'farseer_marker', icon:'🧭', title:'A Farseer Marker', flavor: 'A carved symbol, half-submerged near the reef, catches the light wrong. Erynn would want to see this.', knowledge:12, residue:18},
    {id:'strange_signature', icon:'✨', title:'A Strange Magical Signature', flavor: 'Something out past the shoals is giving off a reading Imah\'s never seen the water do before.', knowledge:14, residue:22},
    {id:'possible_crossing', icon:'🌫️', title:'A Possible Storm Crossing', flavor: 'The air shimmers out near the horizon, the same way it did right before the Horizon Engine\'s first activation.', knowledge:18, residue:25},
    {id:'new_island', icon:'🏝️', title:'A New Island', flavor: 'Nothing on any chart shows land where Imah\'s now certain she\'s seeing land.', knowledge:10, residue:15},
    {id:'pirate_activity', icon:'🏴‍☠️', title:'Pirate Activity', flavor: 'Ships moving in a pattern that doesn\'t look like ordinary trade routes.', knowledge:10, residue:12},
    {id:'storm_warning', icon:'⛈️', title:'A Storm Warning', flavor: 'The clouds are building wrong — too fast, too dark, too early in the season.', knowledge:8, residue:14},
    {id:'unusual_currents', icon:'🌊', title:'Unusual Currents', flavor: 'The water\'s pulling somewhere it shouldn\'t be able to pull, and it\'s been doing it for three days straight.', knowledge:12, residue:16},
    {id:'wreckage_sighted', icon:'🪵', title:'Wreckage Sighted', flavor: 'Debris, drifting in from somewhere none of the usual routes would explain.', knowledge:10, residue:14}
  ];
  window.WATCHTOWER_ALERTS = WATCHTOWER_ALERTS;

  function watchtowerLevel(){ return (game.fairTideBuildings && game.fairTideBuildings.watchtower) || 0; }
  window.watchtowerLevel = watchtowerLevel;

  function alertIntervalMs(){
    const lvl = Math.max(1, watchtowerLevel());
    const hours = Math.max(2, 6 - (lvl - 1));
    return hours * 60 * 60 * 1000;
  }

  window.watchtowerStatus = function(){
    if (watchtowerLevel() < 1) return {state:'not_built'};
    if (game.watchtowerAlert) return {state:'ready', alert: game.watchtowerAlert};
    const nextAt = game.watchtowerNextAlertAt || 0;
    const now = Date.now();
    if (now >= nextAt) return {state:'due'}; // will be filled on next check
    return {state:'waiting', msLeft: nextAt - now};
  };

  // Called on every Hub render — cheap check, no timers/intervals needed.
  function checkWatchtowerAlert(){
    if (watchtowerLevel() < 1) return;
    if (game.watchtowerAlert) return; // already have one pending
    if (!game.watchtowerNextAlertAt) { game.watchtowerNextAlertAt = Date.now() + alertIntervalMs(); return; }
    if (Date.now() < game.watchtowerNextAlertAt) return;
    const alert = WATCHTOWER_ALERTS[Math.floor(Math.random() * WATCHTOWER_ALERTS.length)];
    game.watchtowerAlert = alert.id;
    logEvent('🔭 Watchtower Alert: ' + alert.title + ' — Imah thinks it\'s worth a look.', 'gold');
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  }
  window.checkWatchtowerAlert = checkWatchtowerAlert;

  window.investigateWatchtowerAlert = function(){
    if (!game.watchtowerAlert) return;
    const alert = WATCHTOWER_ALERTS.find(a => a.id === game.watchtowerAlert);
    if (!alert) { game.watchtowerAlert = null; return; }
    const he = (typeof window.horizonEngineState === 'function') ? window.horizonEngineState() : null;
    if (he) {
      he.knowledge += alert.knowledge;
      he.residue += alert.residue;
    }
    logEvent('🔭 ' + alert.title + ' investigated. +' + alert.knowledge + ' Knowledge, +' + alert.residue + ' Residue.', 'gold');
    toast('🔭 San has decided to investigate. +' + alert.knowledge + ' Knowledge, +' + alert.residue + ' Residue.', 3600);
    game.watchtowerAlert = null;
    game.watchtowerNextAlertAt = Date.now() + alertIntervalMs();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderFairTideHub === 'function') renderFairTideHub();
  };

  // -------------------------------------------------------------------
  // FAIR TIDE SPIRIT — replaces the flat true/false fairTideThriving()
  // question with a real four-state read (Thriving/Content/Strained/
  // Troubled) computed from actual game state, with a short explanation
  // — not a hidden 0-100 number. fairTideThriving() itself is left
  // untouched (only one call site, no need to risk it) — this is a new,
  // separate function.
  // -------------------------------------------------------------------
  window.fairTideSpiritState = function(){
    if (!window.fairTideRenovationDone || !window.fairTideRenovationDone()) {
      return {state:'Unsettled', reasons:['Fair Tide is still being rebuilt.']};
    }
    let score = 50;
    const reasons = [];
    const res = game.fairTideResources || {};
    const cap = (typeof window.fairTideResourceCap === 'function') ? window.fairTideResourceCap() : 200;
    const foodPct = cap ? (res.food||0) / cap : 0;
    if (foodPct >= 0.5) { score += 15; reasons.push('Food stores are healthy.'); }
    else if (foodPct < 0.15) { score -= 15; reasons.push('Food supplies are falling.'); }

    const board = (typeof window.fairTideRequestBoard === 'function') ? window.fairTideRequestBoard() : [];
    const readyUnclaimed = board.filter(s => s.status === 'ready').length;
    if (readyUnclaimed >= 2) { score -= 10; reasons.push(readyUnclaimed + ' resolved requests are still waiting to be collected.'); }
    const resolvedCount = game.fairTideRequestsResolvedTotal || 0;
    if (resolvedCount > 0 && resolvedCount % 5 === 0) { score += 5; } // small nudge for steady throughput, not spammy

    const rep = game.reputation || 0;
    if (rep >= 30) { score += 15; reasons.push('Fair Tide\'s reputation is strong up and down the coast.'); }
    else if (rep < 5) { score -= 5; }

    const anyBuildingLow = Object.values(game.fairTideBuildings || {}).some(l => l === 0);
    if (!anyBuildingLow) { score += 10; reasons.push('Every part of the port has someone looking after it.'); }

    score = Math.max(0, Math.min(100, score));
    let state;
    if (score >= 75) state = 'Thriving';
    else if (score >= 45) state = 'Content';
    else if (score >= 20) state = 'Strained';
    else state = 'Troubled';

    if (!reasons.length) reasons.push('Fair Tide is getting by, day to day.');
    return {state, reasons, score};
  };

  // Track resolved-request throughput for the Spirit signal above,
  // without touching the V157 Requests block directly — wraps its own
  // claim function instead.
  const oldClaimFairTideRequestForSpirit = window.claimFairTideRequest;
  if (typeof oldClaimFairTideRequestForSpirit === 'function') {
    window.claimFairTideRequest = function(slotId){
      const board = (typeof window.fairTideRequestBoard === 'function') ? window.fairTideRequestBoard() : [];
      const wasActive = board.some(s => s.slotId === slotId && s.status === 'active');
      oldClaimFairTideRequestForSpirit(slotId);
      if (wasActive) {
        // slot only disappears from the board on a genuine resolution
        const stillThere = (typeof window.fairTideRequestBoard === 'function') ? window.fairTideRequestBoard().some(s => s.slotId === slotId) : true;
        if (!stillThere) game.fairTideRequestsResolvedTotal = (game.fairTideRequestsResolvedTotal || 0) + 1;
      }
    };
  }

  const SPIRIT_ICON = {Thriving:'🌤️', Content:'⛅', Strained:'🌥️', Troubled:'⛈️', Unsettled:'🔧'};

  function renderSpiritDisplay(){
    const el = document.getElementById('fairTideSpiritDisplay');
    if (!el) return;
    const spirit = window.fairTideSpiritState();
    el.innerHTML = '<strong>'+(SPIRIT_ICON[spirit.state]||'')+' Fair Tide is '+spirit.state.toLowerCase()+'.</strong> '+
      '<span style="opacity:.75;">'+spirit.reasons.join(' ')+'</span>';
  }

  const oldRenderFairTideHubForWatchtower = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    checkWatchtowerAlert();
    renderSpiritDisplay();
    if (oldRenderFairTideHubForWatchtower) oldRenderFairTideHubForWatchtower();
    const container = document.getElementById('ft-tab-expedition');
    if (!container) return;
    const status = window.watchtowerStatus();
    if (status.state === 'not_built') return;
    let html = '<div class="panel" style="margin-top:12px;"><div class="panel-title">🔭 Watchtower</div>';
    if (status.state === 'ready') {
      const alert = WATCHTOWER_ALERTS.find(a => a.id === status.alert);
      html += '<article class="quest-item"><strong>'+(alert?alert.icon+' '+alert.title:'Something')+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.85;">'+(alert?alert.flavor:'')+'</span>'+
        '<div class="story-actions"><button class="btn btn-small btn-success" onclick="investigateWatchtowerAlert()">🔭 Investigate</button></div></article>';
    } else {
      const msLeft = status.msLeft || 0;
      const hrs = Math.max(0, Math.ceil(msLeft / 3600000));
      html += '<p style="font-size:.8rem;opacity:.7;">Imah is keeping watch. Next alert in roughly '+hrs+' hour'+(hrs===1?'':'s')+'.</p>';
    }
    html += '</div>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();


(function(){
  // -------------------------------------------------------------------
  // CAPTAIN'S DECISIONS — San's own version of Whiteout's Chief Orders.
  // One decision active at a time (matches "San decides what's needed
  // right now", not a stack of permanent buffs), each temporary, with a
  // cooldown afterward before another can be issued. All six from San's
  // own list, each tied to a real, already-existing system rather than
  // an invented flat multiplier: building costs, Spirit, Request Board
  // size, gathering yields, Research Expedition access, voyage danger.
  // -------------------------------------------------------------------
  const CAPTAINS_DECISIONS = [
    {id:'all_hands', name:'All Hands on Deck', icon:'🔨', desc:'Everyone prioritizes an urgent construction project.', durationMs: 8*3600*1000, cooldownMs: 4*3600*1000},
    {id:'prepare_storm', name:'Prepare for Storm', icon:'⛈️', desc:'Fair Tide spends resources preparing shelters and ships.', durationMs: 12*3600*1000, cooldownMs: 6*3600*1000, cost:{timber:15,stone:15}},
    {id:'open_harbour', name:'Open the Harbour', icon:'⚓', desc:'Prioritize incoming refugees and travelers.', durationMs: 8*3600*1000, cooldownMs: 4*3600*1000},
    {id:'quiet_waters', name:'Quiet Waters', icon:'🌊', desc:'Reduce outward expeditions temporarily and focus on Fair Tide.', durationMs: 8*3600*1000, cooldownMs: 4*3600*1000},
    {id:'full_stores', name:'Full Stores', icon:'🌾', desc:'Prioritize food and provisions.', durationMs: 8*3600*1000, cooldownMs: 4*3600*1000},
    {id:'emergency_repairs', name:'Emergency Repairs', icon:'🔧', desc:'Shipbuilding and repair gets priority.', durationMs: 8*3600*1000, cooldownMs: 4*3600*1000}
  ];
  window.CAPTAINS_DECISIONS = CAPTAINS_DECISIONS;

  window.captainsDecisionStatus = function(){
    const d = game.captainsDecision;
    if (d && d.startedAt) {
      const elapsed = Date.now() - d.startedAt;
      if (elapsed < d.durationMs) return {state:'active', id:d.id, msLeft: d.durationMs - elapsed};
      return {state:'expired', id:d.id}; // caller should clear it
    }
    const cd = game.captainsDecisionCooldownEnd || 0;
    if (Date.now() < cd) return {state:'cooldown', msLeft: cd - Date.now()};
    return {state:'idle'};
  };

  // Clears an expired decision and starts its cooldown — called lazily
  // on every Hub render, same pattern as Watchtower's own check.
  function settleExpiredDecision(){
    const status = window.captainsDecisionStatus();
    if (status.state !== 'expired') return;
    const def = CAPTAINS_DECISIONS.find(d => d.id === status.id);
    game.captainsDecisionCooldownEnd = Date.now() + (def ? def.cooldownMs : 4*3600*1000);
    game.captainsDecision = null;
    logEvent('⚓ ' + (def?def.name:'The decision') + ' has run its course.', 'gold');
  }

  window.activeCaptainsDecision = function(){
    settleExpiredDecision();
    const status = window.captainsDecisionStatus();
    if (status.state !== 'active') return null;
    return CAPTAINS_DECISIONS.find(d => d.id === status.id) || null;
  };

  window.issueCaptainsDecision = function(id){
    settleExpiredDecision();
    const status = window.captainsDecisionStatus();
    if (status.state !== 'idle') { toast(status.state === 'active' ? '⚓ A decision is already in effect.' : '⏳ Not ready yet.'); return; }
    const def = CAPTAINS_DECISIONS.find(d => d.id === id);
    if (!def) return;
    if (def.cost) {
      const res = (typeof game.fairTideResources === 'object') ? game.fairTideResources : (game.fairTideResources = {});
      const canAfford = Object.entries(def.cost).every(([r,amt]) => (res[r]||0) >= amt);
      if (!canAfford) { toast('Not enough resources for that decision.'); return; }
      Object.entries(def.cost).forEach(([r,amt]) => { res[r] -= amt; });
    }
    game.captainsDecision = {id: def.id, startedAt: Date.now(), durationMs: def.durationMs};
    logEvent('⚓ San issues the order: ' + def.name + '.', 'gold');
    toast('⚓ ' + def.name + ' — in effect.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderFairTideHub === 'function') renderFairTideHub();
  };

  // --- Hooks into existing systems, each reading activeCaptainsDecision() ---

  const oldBuildingCostForDecisions = window.fairTideBuildingCost;
  window.fairTideBuildingCost = function(key){
    const cost = oldBuildingCostForDecisions(key);
    const active = window.activeCaptainsDecision();
    if (active && active.id === 'all_hands') {
      const reduced = {};
      Object.entries(cost).forEach(([r,amt]) => { reduced[r] = Math.max(0, Math.round(amt * 0.75)); });
      return reduced;
    }
    return cost;
  };

  const oldSpiritStateForDecisions = window.fairTideSpiritState;
  window.fairTideSpiritState = function(){
    const result = oldSpiritStateForDecisions();
    const active = window.activeCaptainsDecision();
    if (active && active.id === 'prepare_storm' && result.score !== undefined) {
      result.score = Math.max(0, Math.min(100, result.score + 15));
      result.reasons = result.reasons.concat(["Fair Tide's already prepared for whatever's coming."]);
      if (result.score >= 75) result.state = 'Thriving';
      else if (result.score >= 45) result.state = 'Content';
      else if (result.score >= 20) result.state = 'Strained';
      else result.state = 'Troubled';
    }
    return result;
  };

  const oldBoardSizeForDecisions = window.getRequestBoardSize;
  window.getRequestBoardSize = function(){
    let size = oldBoardSizeForDecisions();
    const active = window.activeCaptainsDecision();
    if (active && active.id === 'open_harbour') size = Math.min(6, size + 1);
    return size;
  };

  const oldDispatchYieldForDecisions = window.fairTideDispatchYield;
  window.fairTideDispatchYield = function(){
    const yields = oldDispatchYieldForDecisions();
    const active = window.activeCaptainsDecision();
    if (active && active.id === 'quiet_waters') {
      Object.keys(yields).forEach(k => { yields[k] = Math.round(yields[k] * 1.3); });
    } else if (active && active.id === 'full_stores' && yields.food !== undefined) {
      yields.food = Math.round(yields.food * 1.5);
    }
    return yields;
  };

  const oldEnterExpeditionForDecisions = window.enterResearchExpedition;
  window.enterResearchExpedition = function(){
    const active = window.activeCaptainsDecision();
    if (active && active.id === 'quiet_waters') {
      toast('🌊 Quiet Waters is in effect — the crew is focused on Fair Tide right now.');
      return;
    }
    return oldEnterExpeditionForDecisions();
  };

  const oldDoVoyageForDecisions = window.doVoyage;
  window.doVoyage = function(portId, days, dangerLevel){
    const active = window.activeCaptainsDecision();
    const effectiveDanger = (active && active.id === 'emergency_repairs') ? Math.max(0, dangerLevel * 0.8) : dangerLevel;
    return oldDoVoyageForDecisions(portId, days, effectiveDanger);
  };

  // -------------------------------------------------------------------
  // STORM RESCUE — extends the existing Watchtower alert pool with a
  // rescue-type alert, per San's own "WATCHTOWER ALERT — a vessel has
  // been spotted adrift" framing. Rescued people don't auto-join the
  // crew or even the full Fair Tide Roster — tracked in their own
  // lighter registry first (game.fairTideRescued), matching San's own
  // "might become resident -> worker -> specialist" progression as
  // something to build toward, not skip straight to.
  // -------------------------------------------------------------------
  const RESCUE_ORIGINS = [
    'a Veyren native, blown off course',
    'a survivor from a region none of the crew recognize',
    'someone displaced when the storm tore through their own settlement',
    'someone who says they came through an unexpected crossing, and won\'t say more than that',
    'someone who claims to remember the old world, before all of this'
  ];
  const RESCUE_NAMES = ['Sari','Budi','Thuan','Cahaya','Yusof','Niran','Mai Lin','Osman','Thida','Rosa'];

  if (typeof window.WATCHTOWER_ALERTS !== 'undefined') {
    window.WATCHTOWER_ALERTS.push(
      {id:'storm_rescue_vessel', icon:'⛵', title:'A Vessel Adrift', flavor:'Something\'s floating out past the point — low in the water, barely moving. There\'s someone aboard.', type:'rescue', knowledge:0, residue:0},
      {id:'storm_rescue_shore', icon:'🏖️', title:'Someone on the Shoreline', flavor:'A figure, alone on the tideline, too far from any village to have walked there.', type:'rescue', knowledge:0, residue:0}
    );
  }

  function rescueRegistry(){ game.fairTideRescued = game.fairTideRescued || {}; return game.fairTideRescued; }
  window.fairTideRescueRegistry = rescueRegistry;

  const oldInvestigateForRescue = window.investigateWatchtowerAlert;
  window.investigateWatchtowerAlert = function(){
    if (!game.watchtowerAlert) return;
    const alert = (typeof window.WATCHTOWER_ALERTS !== 'undefined') ? window.WATCHTOWER_ALERTS.find(a => a.id === game.watchtowerAlert) : null;
    if (alert && alert.type === 'rescue') {
      const name = RESCUE_NAMES[Math.floor(Math.random() * RESCUE_NAMES.length)];
      const origin = RESCUE_ORIGINS[Math.floor(Math.random() * RESCUE_ORIGINS.length)];
      const reg = rescueRegistry();
      reg[name + '_' + Date.now()] = {name, origin, rescuedDay: game.day || 0};
      game.reputation = (game.reputation||0) + 4;
      logEvent('⛵ ' + alert.title + ': San sends a crew. They find ' + name + ' — ' + origin + '.', 'gold');
      toast('⛵ ' + name + ' has been brought back to Fair Tide.', 4200);
      game.watchtowerAlert = null;
      game.watchtowerNextAlertAt = Date.now() + (typeof alertIntervalMs === 'function' ? alertIntervalMs() : 6*3600*1000);
      if (typeof saveGameQuiet === 'function') saveGameQuiet();
      if (typeof renderFairTideHub === 'function') renderFairTideHub();
      return;
    }
    return oldInvestigateForRescue();
  };

  // -------------------------------------------------------------------
  // UI — Captain's Decisions panel, added to the Buildings tab (where
  // Fair Tide's other priority-setting lives).
  // -------------------------------------------------------------------
  const oldRenderFairTideHubForDecisions = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    settleExpiredDecision();
    if (oldRenderFairTideHubForDecisions) oldRenderFairTideHubForDecisions();
    const container = document.getElementById('ft-tab-buildings');
    if (!container) return;
    const status = window.captainsDecisionStatus();
    let html = '<div class="panel" style="margin-top:12px;"><div class="panel-title">⚓ Captain\'s Decisions</div>';
    if (status.state === 'active') {
      const def = CAPTAINS_DECISIONS.find(d => d.id === status.id);
      const hrs = Math.max(0, Math.ceil(status.msLeft / 3600000));
      html += '<article class="quest-item"><strong>'+(def?def.icon+' '+def.name:'')+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.8;">In effect — '+hrs+' hour'+(hrs===1?'':'s')+' left.</span></article>';
    } else if (status.state === 'cooldown') {
      const hrs = Math.max(0, Math.ceil(status.msLeft / 3600000));
      html += '<p style="font-size:.8rem;opacity:.65;">San needs time before the next order — ready in about '+hrs+' hour'+(hrs===1?'':'s')+'.</p>';
    } else {
      html += '<p style="font-size:.8rem;opacity:.8;margin-bottom:8px;">San can set a temporary priority for what Fair Tide needs right now.</p>';
      CAPTAINS_DECISIONS.forEach(function(d){
        html += '<article class="quest-item" style="margin-bottom:6px;"><strong>'+d.icon+' '+d.name+'</strong><br>'+
          '<span style="font-size:.78rem;opacity:.75;">'+d.desc+'</span>'+
          (d.cost ? '<div style="font-size:.72rem;opacity:.6;">Costs: '+Object.entries(d.cost).map(([r,a])=>a+' '+r).join(', ')+'</div>' : '')+
          '<div class="story-actions"><button class="btn btn-small btn-success" onclick="issueCaptainsDecision(\''+d.id+'\')">Issue</button></div></article>';
      });
    }
    html += '</div>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();


(function(){
  // -------------------------------------------------------------------
  // NPC MEMORY LAYER — the persistent-identity piece the Requests system
  // was missing. pickRequesterForBoard()/ensureRequesterRegistered() (see
  // the edited ct-build-v157 code above) handle WHO shows up on the
  // board; this handles what happens when their request actually
  // resolves: trust builds, status escalates, and at the top tier they
  // become a genuine Fair Tide resident — joining the existing roster
  // system rather than a separate parallel one, per San's own
  // "Wahyu has decided to make Fair Tide his permanent home" framing.
  //
  // Status tiers: visitor (0-24 trust) -> familiar_face (25-59) ->
  // trusted (60-99) -> resident (100+, one-time graduation).
  // -------------------------------------------------------------------
  const TRUST_BY_TIER = {quick: 8, standard: 15, major: 25};
  const STATUS_LABELS = {visitor: 'Visitor', familiar_face: 'A Familiar Face', trusted: 'Trusted', resident: 'Fair Tide Resident'};

  function statusForTrust(trust){
    if (trust >= 100) return 'resident';
    if (trust >= 60) return 'trusted';
    if (trust >= 25) return 'familiar_face';
    return 'visitor';
  }
  window.fairTideResidentStatusLabel = function(status){ return STATUS_LABELS[status] || 'Visitor'; };

  const oldClaimForMemory = window.claimFairTideRequest;
  window.claimFairTideRequest = function(slotId){
    // Capture what's needed BEFORE the original runs — it removes the
    // slot from the board on success, so this has to happen first.
    const board = (typeof window.fairTideRequestBoard === 'function') ? window.fairTideRequestBoard() : [];
    const slot = board.find(s => s.slotId === slotId);
    const npcName = slot ? slot.npcName : null;
    const requestId = slot ? slot.requestId : null;
    const wasReady = slot && slot.status === 'active' &&
      (typeof slot.startedAt === 'number') && (typeof slot.durationMs === 'number') &&
      (Date.now() - slot.startedAt >= slot.durationMs);

    oldClaimForMemory(slotId);

    if (!npcName || !wasReady) return; // nothing resolved, nothing to record
    const rs = (typeof window.fairTideRequesterState === 'function') ? window.fairTideRequesterState() : null;
    if (!rs || !rs[npcName]) return;
    const entry = rs[npcName];
    const template = (typeof window.FAIR_TIDE_REQUESTS !== 'undefined') ? window.FAIR_TIDE_REQUESTS.find(r => r.id === requestId) : null;
    const gain = TRUST_BY_TIER[template ? template.tier : 'standard'] || 10;
    const wasStatus = entry.status || 'visitor';
    entry.trust = (entry.trust||0) + gain;
    entry.requestHistory = entry.requestHistory || [];
    entry.requestHistory.push({requestId, day: game.day||0});
    entry.status = statusForTrust(entry.trust);

    if (entry.status !== wasStatus) {
      logEvent('🤝 ' + npcName + ' — ' + STATUS_LABELS[entry.status] + ' now.', 'gold');
      if (entry.status === 'resident') {
        game.fairTideRoster = game.fairTideRoster || {};
        if (!game.fairTideRoster[npcName]) {
          game.fairTideRoster[npcName] = {name: npcName, role: 'Fair Tide Resident', icon: '🏘️', desc: npcName + ' asked Fair Tide for help once. Fair Tide kept showing up. Eventually, staying just made sense.'};
        }
        toast('🏘️ ' + npcName + ' has decided to make Fair Tide home.', 4800);
        if (typeof showStoryModal === 'function') {
          setTimeout(function(){
            showStoryModal({
              title: '🏘️ ' + npcName + ' Stays',
              blurb: npcName + ' has asked Crimson Tide for help more than once now — and every time, someone showed up.<br><br>"I think I\'d like to stay, if that\'s alright," they say. It is.'
            });
          }, 500);
        }
      } else {
        toast('🤝 ' + npcName + ' now trusts Crimson Tide more — ' + STATUS_LABELS[entry.status] + '.', 3600);
      }
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };
})();


(function(){
  // -------------------------------------------------------------------
  // LEWIS BECOMES AN ALLY CAPTAIN. Triggered some time after Jorvin's own
  // recruitment (Arc V) — checked here via arc6Complete rather than
  // tying it to Jorvin's own recruitment moment directly, giving it
  // genuine narrative space rather than firing immediately back to back.
  // Lewis's shop stays exactly as it was (beginner-tier gear, unchanged)
  // — this is a narrative and Requests-board unlock, not a vendor
  // upgrade. His crew (Aisy/Elva/Selina/Zul/Jonathan) are introduced in
  // one combined scene, per San's direction, and are narrative only —
  // no new combat roster entries.
  // -------------------------------------------------------------------
  function grantLewisAllyCaptainIfDue(){
    if (!game.arc6Complete) return;
    if (game.lewisAllyCaptain) return;
    game.lewisAllyCaptain = true;
    logEvent('⚓ Lewis arrives at Fair Tide aboard The Steady Reach — an ally captain now, not just a trader passing through.', 'gold');
    toast('⚓ Lewis has his own ship now.', 3600);
    if (typeof showStoryModal === 'function') {
      setTimeout(function(){
        showStoryModal({
          title: '⚓ The Steady Reach',
          blurb: "Jorvin's the one who brings it up first — half-proud, half-amused, the way he sounds when he's about to say \"I told you so\" without actually saying it.<br><br>\"Lewis finally did it,\" he says. \"Got his own ship.\"<br><br>San remembers Lewis as the trader with the modest stall and the honest prices — reliable, unhurried, never once trying to oversell a blade he didn't think you needed. It's hard, for a second, to square that memory with \"captain.\"<br><br>Then The Steady Reach comes into port, and it isn't hard at all.<br><br>It's not built for speed and it's not built for a fight. It's built the way Lewis has always done business — solid, unshowy, exactly as sturdy as it needs to be and not an ounce more.<br><br>Lewis comes down the gangway first, and looks San over with the same unhurried assessment he's always given a piece of cargo.<br><br>\"Heard you've kept busy,\" he says. Not quite a compliment. Not not one, either.<br><br>Behind him, his crew follows in order — the kind of order that comes from having done this together a long time. Aisy first, sharp-eyed, already sizing up the dock like she's deciding what's worth stealing and what isn't. Elva next, a blade at each hip, moving like someone who's never needed to ask twice. Selina climbs partway up the rigging without being asked, just to get a better look at the port before she's set foot on it. Zul comes last off the plank, arms full of cargo he insisted on carrying himself, already scanning for the fastest place to set it down. And Jonathan, quiet, watching the horizon the way he always seems to be watching something the rest of them haven't noticed yet.<br><br>\"We're not here to get in your way,\" Lewis says. \"Figure we're headed in the same direction most days. Might as well know each other's names for when the routes cross.\"<br><br>He looks Fair Tide over — the buildings, the docks, the whole slow shape of what San's built here — and something in his face shifts, just slightly, into something that might actually be approval.<br><br>\"Not bad,\" he says. \"For someone who started with a lot less than I did.\"<br><br>It's the closest thing to a compliment San's going to get out of him. And somehow, that's exactly enough."
        });
      }, 500);
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  }
  window.grantLewisAllyCaptainIfDue = grantLewisAllyCaptainIfDue;

  const oldRenderMainGoalForLewis = window.renderMainGoal;
  window.renderMainGoal = function(){
    if (oldRenderMainGoalForLewis) oldRenderMainGoalForLewis();
    grantLewisAllyCaptainIfDue();
  };
})();
