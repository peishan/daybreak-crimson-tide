(function(){
  // -------------------------------------------------------------------
  // ARC XXIII MECHANICS — everything Ch.1-18's own gameplay notes call
  // for. Deliberately kept OUT of arc23.js itself, same split used for
  // Arc XXII's Maera mechanics: arc files since XVII only wire story.
  //
  // Kept deliberately light per the outline's own note ("I'd keep the
  // mechanics focused rather than adding another giant system") — every
  // piece below reuses this codebase's proven shapes (a daily-claim
  // panel, a one-time branching decision, a tiered gold investment)
  // rather than inventing new plumbing. Each panel is fully independent
  // — its own state, own render function, own window.renderArchiveScreen
  // wrap — so nothing here risks the existing Arc XXI buildings, and
  // gating each on its own Arc XXIII chapter means nothing appears
  // before the story chapter that actually introduces it.
  //
  // Deliberately NOT built here: Fair Tide Requests (Ch.2) — the
  // existing system in fairtide-systems.js already covers "small
  // settlement tasks" exactly as Ch.2 describes; nothing to add. Also
  // not built: a formal Council Decisions entry pushed onto Arc XXI's
  // shared COUNCIL_DECISIONS array — that array is rendered unconditional
  // on councilHallUnlocked() alone (Arc XXI, Ch.3), with no per-decision
  // gate, so anything pushed onto it would show up right after Arc XXI
  // finishes, long before Arc XXIII Ch.16 is ever reached. Council
  // Policies below is its own fully independent panel instead, gated
  // properly on comicProgress23[16], reusing the exact same one-time-
  // choice shape without touching the already-shipped Arc XXI file at
  // all.
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. PORT TRAFFIC (Ch.1) — a visible settlement statistic. Purely
  // derived from how many Arc XXIII chapters have been read so far, on
  // purpose: traffic growing in step with the story rather than a random
  // number nobody can trace back to anything.
  // ===========================================================================
  const PORT_TRAFFIC_TIERS = [
    { index:0, min:0,  icon:'🌤️', label:'Quiet', desc:"Fair Tide sees its usual traffic — familiar hulls, familiar faces." },
    { index:1, min:3,  icon:'⛵', label:'Growing', desc:'New sails on the horizon most mornings now.' },
    { index:2, min:8,  icon:'🚢', label:'Busy', desc:'The harbour rarely sits empty these days.' },
    { index:3, min:14, icon:'🛳️', label:'Bustling', desc:'Fair Tide is busy enough that a quiet dock feels unusual.' },
    { index:4, min:20, icon:'🌊', label:'Thriving', desc:"Ships from places nobody at Fair Tide has ever charted." }
  ];
  window.ARC23_PORT_TRAFFIC_TIERS = PORT_TRAFFIC_TIERS;

  function portTrafficUnlocked(){
    return !!(game.comicProgress23 && game.comicProgress23[1]);
  }
  window.portTrafficUnlocked = portTrafficUnlocked;

  function portTrafficCount(){
    return Object.keys(game.comicProgress23 || {}).length;
  }
  window.portTrafficCount = portTrafficCount;

  function portTrafficTier(){
    const count = portTrafficCount();
    let current = PORT_TRAFFIC_TIERS[0];
    for (let i = 0; i < PORT_TRAFFIC_TIERS.length; i++) {
      if (count >= PORT_TRAFFIC_TIERS[i].min) current = PORT_TRAFFIC_TIERS[i];
    }
    return current;
  }
  window.portTrafficTier = portTrafficTier;

  function renderPortTrafficPanel(){
    if (!portTrafficUnlocked()) return '';
    const tier = portTrafficTier();
    let html = '<div class="panel-title" style="margin-top:16px;">⚓ Port Traffic</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Merchants, captains, and travelers choosing Fair Tide on purpose — not just stopping because it happens to be convenient.</p>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">'+tier.icon+'</div><div style="flex:1;">'+
      '<strong>'+esc(tier.label)+'</strong><br>'+
      '<span style="font-size:.8rem;opacity:.85;">'+esc(tier.desc)+'</span>'+
      '</div></div></article>';
    return html;
  }
  window.renderPortTrafficPanel = renderPortTrafficPanel;

  const oldRenderArchiveScreenForPortTraffic = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForPortTraffic) oldRenderArchiveScreenForPortTraffic();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('portTrafficPanelWrap');
    if (existing) existing.remove();
    const panel = renderPortTrafficPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="portTrafficPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 2. DYNAMIC MARKET ACTIVITY (Ch.3) — market conditions that shift with
  // traffic, per Ch.3's own text. A daily bulk-trade bonus scaled by the
  // current Port Traffic tier, reusing the Market Quarter's own
  // daily-claim shape rather than a full price simulation Ch.3 never
  // actually asks for.
  // ===========================================================================
  const MARKET_ACTIVITY_BASE = 20;
  const MARKET_ACTIVITY_PER_TIER = 10;

  function marketActivityUnlocked(){
    return !!(game.comicProgress23 && game.comicProgress23[3]);
  }
  window.marketActivityUnlocked = marketActivityUnlocked;

  function marketActivityBonusAmount(){
    return MARKET_ACTIVITY_BASE + portTrafficTier().index * MARKET_ACTIVITY_PER_TIER;
  }
  window.marketActivityBonusAmount = marketActivityBonusAmount;

  function canClaimMarketActivityBonus(){
    if (!marketActivityUnlocked()) return false;
    game.marketActivity = game.marketActivity || { lastClaimDay: -1 };
    return game.marketActivity.lastClaimDay !== game.day;
  }
  window.canClaimMarketActivityBonus = canClaimMarketActivityBonus;

  function claimMarketActivityBonus(){
    if (!canClaimMarketActivityBonus()) { toast('Already collected today.', 2800); return; }
    game.marketActivity = game.marketActivity || { lastClaimDay: -1 };
    game.marketActivity.lastClaimDay = game.day;
    const amount = marketActivityBonusAmount();
    game.gold = (game.gold || 0) + amount;
    toast('🛍️ Market activity brings in ' + amount + 'g in bulk trade.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.claimMarketActivityBonus = claimMarketActivityBonus;

  function renderMarketActivityPanel(){
    if (!marketActivityUnlocked()) return '';
    const claimable = canClaimMarketActivityBonus();
    const tier = portTrafficTier();
    const amount = marketActivityBonusAmount();
    let html = '<div class="panel-title" style="margin-top:16px;">📈 Market Activity</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Merchants negotiating among themselves now — prices and availability shifting with the harbour\'s own traffic instead of San dictating every transaction.</p>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">'+tier.icon+'</div><div style="flex:1;">'+
      '<strong>Conditions: '+esc(tier.label)+'</strong><br>'+
      '<span style="font-size:.8rem;opacity:.85;">Busier docks mean busier trade.</span>'+
      '</div>'+
      '<button class="btn btn-small" onclick="claimMarketActivityBonus()" '+(claimable ? '' : 'disabled')+'>'+
      (claimable ? '💰 Collect ' + amount + 'g' : '✓ Collected Today')+
      '</button></div></article>';
    return html;
  }
  window.renderMarketActivityPanel = renderMarketActivityPanel;

  const oldRenderArchiveScreenForMarketActivity = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForMarketActivity) oldRenderArchiveScreenForMarketActivity();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('marketActivityPanelWrap');
    if (existing) existing.remove();
    const panel = renderMarketActivityPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="marketActivityPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 3. CARGO STORAGE (Ch.5) — ships depositing goods at Fair Tide while
  // traveling elsewhere. Same daily-claim shape as every other Arc XXI/
  // XXIII building.
  // ===========================================================================
  const CARGO_STORAGE_FEE_PER_DAY = 30;

  const CARGO_MANIFEST = [
    { icon:'🧵', text:"A cloth trader's bolts of silk, left behind for a run up the coast." },
    { icon:'🏺', text:"Sealed jars nobody's opened, waiting on a ship that hasn't come back yet." },
    { icon:'🪵', text:"Seasoned timber, stacked and logged, waiting for a buyer who's still at sea." },
    { icon:'📦', text:"A little of everything — three ships' worth of cargo nobody's collected yet." }
  ];
  window.ARC23_CARGO_MANIFEST = CARGO_MANIFEST;

  function cargoStorageUnlocked(){
    return !!(game.comicProgress23 && game.comicProgress23[5]);
  }
  window.cargoStorageUnlocked = cargoStorageUnlocked;

  function todaysCargoManifest(){
    const idx = (game.day || 0) % CARGO_MANIFEST.length;
    return CARGO_MANIFEST[idx];
  }
  window.todaysCargoManifest = todaysCargoManifest;

  function canClaimCargoStorageFees(){
    if (!cargoStorageUnlocked()) return false;
    game.cargoStorage = game.cargoStorage || { lastClaimDay: -1 };
    return game.cargoStorage.lastClaimDay !== game.day;
  }
  window.canClaimCargoStorageFees = canClaimCargoStorageFees;

  function claimCargoStorageFees(){
    if (!canClaimCargoStorageFees()) { toast('Already collected today.', 2800); return; }
    game.cargoStorage = game.cargoStorage || { lastClaimDay: -1 };
    game.cargoStorage.lastClaimDay = game.day;
    game.gold = (game.gold || 0) + CARGO_STORAGE_FEE_PER_DAY;
    toast('📦 Storage fees bring in ' + CARGO_STORAGE_FEE_PER_DAY + 'g.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.claimCargoStorageFees = claimCargoStorageFees;

  function renderCargoStoragePanel(){
    if (!cargoStorageUnlocked()) return '';
    const claimable = canClaimCargoStorageFees();
    const manifest = todaysCargoManifest();
    let html = '<div class="panel-title" style="margin-top:16px;">📦 Cargo Storage</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Somewhere ships can actually leave things — a real trade hub, not just somewhere people pass through.</p>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">'+manifest.icon+'</div><div style="flex:1;">'+
      '<strong>Currently Stored</strong><br>'+
      '<span style="font-size:.8rem;opacity:.85;">'+esc(manifest.text)+'</span>'+
      '</div></div></article>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">💰</div><div style="flex:1;">'+
      '<strong>Storage Fees</strong><br>'+
      '<span style="font-size:.8rem;opacity:.85;">A ledger, a fee, and a clear point of contact — nothing glamorous, entirely necessary.</span>'+
      '</div>'+
      '<button class="btn btn-small" onclick="claimCargoStorageFees()" '+(claimable ? '' : 'disabled')+'>'+
      (claimable ? '💰 Collect ' + CARGO_STORAGE_FEE_PER_DAY + 'g' : '✓ Collected Today')+
      '</button></div></article>';
    return html;
  }
  window.renderCargoStoragePanel = renderCargoStoragePanel;

  const oldRenderArchiveScreenForCargoStorage = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForCargoStorage) oldRenderArchiveScreenForCargoStorage();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('cargoStoragePanelWrap');
    if (existing) existing.remove();
    const panel = renderCargoStoragePanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="cargoStoragePanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 4. NEUTRAL HARBOUR EVENTS (Ch.7) — occasional diplomatic/trade
  // encounters. Read-only flavor per Ch.7's own note that San "doesn't
  // solve their disagreement, she simply provides the place" — no
  // decision for the player to make here, no new political faction.
  // ===========================================================================
  const NEUTRAL_HARBOUR_EVENTS = [
    { icon:'🪑', text:'Two rival captains shared a table at the Council Hall today. Neither drew a weapon. Progress.' },
    { icon:'🤝', text:"A dispute over shared route access got settled quietly, with San doing little more than providing the room." },
    { icon:'📜', text:"A trade disagreement that would've turned ugly elsewhere got worked out over an afternoon at Fair Tide instead." },
    { icon:'🕊️', text:"Word's spreading that Fair Tide won't take sides. That reputation is worth more than it looks." }
  ];
  window.ARC23_NEUTRAL_HARBOUR_EVENTS = NEUTRAL_HARBOUR_EVENTS;

  function neutralHarbourEventsUnlocked(){
    return !!(game.comicProgress23 && game.comicProgress23[7]);
  }
  window.neutralHarbourEventsUnlocked = neutralHarbourEventsUnlocked;

  function todaysNeutralHarbourEvent(){
    const idx = (game.day || 0) % NEUTRAL_HARBOUR_EVENTS.length;
    return NEUTRAL_HARBOUR_EVENTS[idx];
  }
  window.todaysNeutralHarbourEvent = todaysNeutralHarbourEvent;

  function renderNeutralHarbourEventsPanel(){
    if (!neutralHarbourEventsUnlocked()) return '';
    const event = todaysNeutralHarbourEvent();
    let html = '<div class="panel-title" style="margin-top:16px;">🪑 The Neutral Table</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Fair Tide doesn\'t take sides. It just provides the table.</p>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">'+event.icon+'</div><div style="flex:1;">'+
      '<span style="font-size:.8rem;opacity:.85;">'+esc(event.text)+'</span>'+
      '</div></div></article>';
    return html;
  }
  window.renderNeutralHarbourEventsPanel = renderNeutralHarbourEventsPanel;

  const oldRenderArchiveScreenForNeutralHarbourEvents = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForNeutralHarbourEvents) oldRenderArchiveScreenForNeutralHarbourEvents();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('neutralHarbourEventsPanelWrap');
    if (existing) existing.remove();
    const panel = renderNeutralHarbourEventsPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="neutralHarbourEventsPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 5. WARDEN ASSIGNMENTS (Ch.10) — Joy assigning her attention across
  // Fair Tide's areas. A one-time-per-day choice of focus, informational
  // rather than a new number-crunching layer — matching Ch.10's own
  // "practical, not paranoid" framing.
  // ===========================================================================
  const WARDEN_ASSIGNMENT_AREAS = [
    { key:'harbour', icon:'⚓', label:'The Harbour', desc:'Watching the docks closest, where the most unfamiliar faces come and go.' },
    { key:'market', icon:'🛍️', label:'The Market', desc:'Keeping an eye on the Market Quarter during its busiest hours.' },
    { key:'warehouse', icon:'📦', label:'The Warehouses', desc:"A rotation through the Supply House and cargo storage, instead of checking whenever somebody remembers." },
    { key:'residential', icon:'🏘️', label:'Residential Quarter', desc:'Looking after the neighborhood the way a neighborhood looks after itself.' },
    { key:'facilities', icon:'🏛️', label:'Key Facilities', desc:"Closest attention on the buildings that matter most if something ever did go wrong." }
  ];
  window.ARC23_WARDEN_ASSIGNMENT_AREAS = WARDEN_ASSIGNMENT_AREAS;

  function wardenAssignmentsUnlocked(){
    return !!(game.comicProgress23 && game.comicProgress23[10]);
  }
  window.wardenAssignmentsUnlocked = wardenAssignmentsUnlocked;

  function currentWardenAssignment(){
    return game.wardenAssignment || null;
  }
  window.currentWardenAssignment = currentWardenAssignment;

  function setWardenAssignment(areaKey){
    const area = WARDEN_ASSIGNMENT_AREAS.find(function(a){ return a.key === areaKey; });
    if (!area) return;
    game.wardenAssignment = areaKey;
    toast('🛡️ Joy shifts her attention to ' + area.label + '.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.setWardenAssignment = setWardenAssignment;

  function renderWardenAssignmentsPanel(){
    if (!wardenAssignmentsUnlocked()) return '';
    const current = currentWardenAssignment();
    let html = '<div class="panel-title" style="margin-top:16px;">🗺️ Warden Assignments</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">More visitors means more to watch. Joy coordinates instead of everyone handling their own corner separately.</p>';
    WARDEN_ASSIGNMENT_AREAS.forEach(function(area){
      const active = current === area.key;
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">'+area.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(area.label)+'</strong>'+(active ? ' <span class="story-chip">✓ Current Focus</span>' : '')+'<br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(area.desc)+'</span>'+
        '</div>'+
        (active ? '' : '<button class="btn btn-small" onclick="setWardenAssignment(\''+area.key+'\')">Assign</button>')+
        '</div></article>';
    });
    return html;
  }
  window.renderWardenAssignmentsPanel = renderWardenAssignmentsPanel;

  const oldRenderArchiveScreenForWardenAssignments = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForWardenAssignments) oldRenderArchiveScreenForWardenAssignments();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('wardenAssignmentsPanelWrap');
    if (existing) existing.remove();
    const panel = renderWardenAssignmentsPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="wardenAssignmentsPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 6. TRADE AGREEMENTS (Ch.8) — recurring trade relationships. Reuses
  // the Council Hall's one-time branching-decision shape exactly, but
  // its "accept" option chains a small ongoing xpBonus into
  // getReputationBonus, matching the Horizon Chamber's own proven
  // aggregator technique, since a "recurring relationship" should read
  // as a standing benefit rather than a single flavor outcome.
  // ===========================================================================
  const TRADE_AGREEMENTS = [
    {
      key: 'standing_supply_contract',
      icon: '📜',
      title: 'Standing Supply Contract',
      issue: "A merchant group's proposal: regular deliveries in exchange for guaranteed dock priority and a fixed rate. A real commitment, not a one-time trade.",
      options: [
        { key:'accept', label:'Accept the standing contract', outcome:"Fair Tide takes on its first real trade commitment — steadier supply, and a promise that now has to be kept.", xpBonus:0.01 },
        { key:'decline', label:'Keep it informal for now', outcome:"Fair Tide stays flexible, trading case by case rather than locking into a formal arrangement — for now.", gold:60 }
      ]
    },
    {
      key: 'escort_arrangement',
      icon: '🛡️',
      title: 'A Standing Escort Arrangement',
      issue: "A group of regular traders offers Fair Tide a modest ongoing fee in exchange for priority protection on their routes in and out of the harbour.",
      options: [
        { key:'accept', label:'Take the arrangement', outcome:"Fair Tide commits some of Joy's attention to a fixed set of trade routes — steady income, and one more promise to keep.", xpBonus:0.01 },
        { key:'decline', label:'Keep protection general', outcome:"Joy's attention stays spread across everyone equally, with no particular route getting priority over any other.", xp:70 }
      ]
    }
  ];
  window.ARC23_TRADE_AGREEMENTS = TRADE_AGREEMENTS;

  function tradeAgreementsUnlocked(){
    return !!(game.comicProgress23 && game.comicProgress23[8]);
  }
  window.tradeAgreementsUnlocked = tradeAgreementsUnlocked;

  function tradeAgreementResolved(key){
    return !!(game.tradeAgreements && game.tradeAgreements[key]);
  }
  window.tradeAgreementResolved = tradeAgreementResolved;

  function tradeAgreementsXpBonus(){
    if (!game.tradeAgreements) return 0;
    let bonus = 0;
    TRADE_AGREEMENTS.forEach(function(agreement){
      const chosenKey = game.tradeAgreements[agreement.key];
      if (!chosenKey) return;
      const option = agreement.options.find(function(o){ return o.key === chosenKey; });
      if (option && option.xpBonus) bonus += option.xpBonus;
    });
    return bonus;
  }
  window.tradeAgreementsXpBonus = tradeAgreementsXpBonus;

  function resolveTradeAgreement(agreementKey, optionKey){
    const agreement = TRADE_AGREEMENTS.find(function(a){ return a.key === agreementKey; });
    if (!agreement) return;
    if (tradeAgreementResolved(agreementKey)) return; // one-time, matching Council Hall's own decisions
    const option = agreement.options.find(function(o){ return o.key === optionKey; });
    if (!option) return;
    game.tradeAgreements = game.tradeAgreements || {};
    game.tradeAgreements[agreementKey] = optionKey;
    if (option.gold) game.gold = (game.gold || 0) + option.gold;
    if (option.xp) gainXP(option.xp);
    toast('📜 ' + agreement.title + ': ' + option.label + '.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.resolveTradeAgreement = resolveTradeAgreement;

  const oldGetReputationBonusForTradeAgreements = window.getReputationBonus;
  window.getReputationBonus = function(statKey){
    const base = (typeof oldGetReputationBonusForTradeAgreements === 'function') ? oldGetReputationBonusForTradeAgreements(statKey) : 0;
    if (statKey === 'xpBonus') return base + tradeAgreementsXpBonus();
    return base;
  };

  function renderTradeAgreementsPanel(){
    if (!tradeAgreementsUnlocked()) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">📜 Trade Agreements</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Fair Tide\'s first standing commitments — real promises to people who aren\'t San\'s own crew.</p>';
    TRADE_AGREEMENTS.forEach(function(agreement){
      const resolved = tradeAgreementResolved(agreement.key);
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:flex-start;">'+
        '<div style="font-size:1.4rem;">'+agreement.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(agreement.title)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(agreement.issue)+'</span>';
      if (resolved) {
        const chosenKey = game.tradeAgreements[agreement.key];
        const chosenOption = agreement.options.find(function(o){ return o.key === chosenKey; });
        html += '<div style="margin-top:6px;"><span class="story-chip">✓ Decided: '+esc(chosenOption.label)+'</span></div>'+
          '<div style="margin-top:4px;font-size:.78rem;opacity:.7;font-style:italic;">'+esc(chosenOption.outcome)+'</div>';
      } else {
        html += '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">';
        agreement.options.forEach(function(option){
          html += '<button class="btn btn-small" onclick="resolveTradeAgreement(\''+agreement.key+'\',\''+option.key+'\')">'+esc(option.label)+'</button>';
        });
        html += '</div>';
      }
      html += '</div></div></article>';
    });
    return html;
  }
  window.renderTradeAgreementsPanel = renderTradeAgreementsPanel;

  const oldRenderArchiveScreenForTradeAgreements = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForTradeAgreements) oldRenderArchiveScreenForTradeAgreements();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('tradeAgreementsPanelWrap');
    if (existing) existing.remove();
    const panel = renderTradeAgreementsPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="tradeAgreementsPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 7. HARBOUR DEFENCE / BRADA'S BALLISTA (Ch.18) — reuses the Horizon
  // Chamber's tiered-gold-investment shape exactly, chaining into
  // getReputationBonus('critBonus') instead of xpBonus — "defended
  // enough to fight well" reads as combat readiness.
  //
  // BUG FIX: originally chained into 'critChance' — a key nothing in
  // this codebase actually reads. The real combat crit-chance
  // calculation (core-engine.js's own attack roll) calls
  // getReputationBonus('critBonus') specifically, matching every other
  // real crit source already in the reputation-rank table
  // (fairtide-buildings-and-arc6.js's own REPUTATION_RANKS entries) and
  // the Civilian Roles' 'specialist' role. 'critChance' was a plausible-
  // looking name that happened to match nothing, so every tier funded
  // here was silently inert — displayed as "+1% crit chance," genuinely
  // did nothing in an actual fight. Fixed to the real key; no other
  // change needed since this file's own internal accounting
  // (harbourDefenceTier, the gold cost, the panel) was already correct.
  // ===========================================================================
  const HARBOUR_DEFENCE_TIERS = [
    { tier:1, cost:250, critBonus:0.01, label:"Brada's First Battery", desc:'A modest set of ballistae along the main approach — nothing dramatic, just enough that an approaching ship thinks twice.' },
    { tier:2, cost:450, critBonus:0.01, label:'Full Coverage', desc:"Coverage across both approaches to the harbour, not just the one everyone assumes an attacker would use." },
    { tier:3, cost:700, critBonus:0.01, label:"Brada's Own Design", desc:"Brada's own refinements — nothing borrowed, nothing standard-issue. Built specifically for Fair Tide's own harbour." }
  ];
  window.ARC23_HARBOUR_DEFENCE_TIERS = HARBOUR_DEFENCE_TIERS;

  function harbourDefenceUnlocked(){
    return !!(game.comicProgress23 && game.comicProgress23[18]);
  }
  window.harbourDefenceUnlocked = harbourDefenceUnlocked;

  function harbourDefenceTier(){
    return Number(game.harbourDefenceTier || 0);
  }
  window.harbourDefenceTier = harbourDefenceTier;

  function harbourDefenceCritBonus(){
    return harbourDefenceTier() * 0.01;
  }
  window.harbourDefenceCritBonus = harbourDefenceCritBonus;

  function fundHarbourDefenceTier(){
    const nextTier = HARBOUR_DEFENCE_TIERS.find(function(t){ return t.tier === harbourDefenceTier() + 1; });
    if (!nextTier) { toast('Fully defended already.', 2800); return; }
    if ((game.gold || 0) < nextTier.cost) { toast('Not enough gold.', 2800); return; }
    game.gold -= nextTier.cost;
    game.harbourDefenceTier = nextTier.tier;
    toast('🔫 ' + nextTier.label + ' built — Brada\'s work makes the harbour a little harder to threaten.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.fundHarbourDefenceTier = fundHarbourDefenceTier;

  const oldGetReputationBonusForHarbourDefence = window.getReputationBonus;
  window.getReputationBonus = function(statKey){
    const base = (typeof oldGetReputationBonusForHarbourDefence === 'function') ? oldGetReputationBonusForHarbourDefence(statKey) : 0;
    if (statKey === 'critBonus') return base + harbourDefenceCritBonus();
    return base;
  };

  function renderHarbourDefencePanel(){
    if (!harbourDefenceUnlocked()) return '';
    const currentTier = harbourDefenceTier();
    let html = '<div class="panel-title" style="margin-top:16px;">🔫 Harbour Defence</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Not because anyone\'s coming for Fair Tide — because worth defending is exactly what Fair Tide has become.</p>';
    HARBOUR_DEFENCE_TIERS.forEach(function(t){
      const funded = currentTier >= t.tier;
      const isNext = currentTier === t.tier - 1;
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">'+(funded ? '✅' : '🔫')+'</div><div style="flex:1;">'+
        '<strong>'+esc(t.label)+'</strong> <span class="story-chip">+'+Math.round(t.critBonus*100)+'% crit chance</span><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(t.desc)+'</span>'+
        '</div>'+
        (funded ? '<span style="font-size:.78rem;opacity:.6;">Built</span>'
          : (isNext ? '<button class="btn btn-small" onclick="fundHarbourDefenceTier()" '+((game.gold||0) < t.cost ? 'disabled' : '')+'>Build ('+t.cost+'g)</button>'
                    : '<span style="font-size:.72rem;opacity:.5;">🔒 Locked</span>'))+
        '</div></article>';
    });
    return html;
  }
  window.renderHarbourDefencePanel = renderHarbourDefencePanel;

  const oldRenderArchiveScreenForHarbourDefence = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForHarbourDefence) oldRenderArchiveScreenForHarbourDefence();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('harbourDefencePanelWrap');
    if (existing) existing.remove();
    const panel = renderHarbourDefencePanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="harbourDefencePanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 8. COUNCIL POLICIES (Ch.16) — "a port needs rules." Same one-time
  // branching-decision shape as Arc XXI's Council Hall, but its own
  // fully independent array/state/panel (see the file-level note above
  // for why this isn't pushed onto Arc XXI's own COUNCIL_DECISIONS).
  // Two policies, matching Arc XXI's own restraint of exactly two
  // decisions rather than one for each area Ch.16's text lists — picked
  // for how directly they set up Part V's stranger-anxiety escalation.
  // ===========================================================================
  const COUNCIL_POLICIES = [
    {
      key: 'market_stall_fairness',
      icon: '🛍️',
      title: 'Market Stall Fairness',
      issue: "More merchants want stalls than the Market Quarter has room for. Established traders want first claim on the spots they've already built a following in. Newcomers want a fair shot at getting in at all.",
      options: [
        { key:'seniority', label:'Protect established traders', outcome:"Existing stallholders keep their spots. Steady and familiar — at the cost of newcomers finding it harder to get a foothold.", gold:70 },
        { key:'rotation', label:'Rotate stalls fairly', outcome:"Stalls rotate on a fair schedule instead of being claimed permanently. More newcomers get a real chance, and a few long-standing traders grumble about losing their usual spot.", xp:70 }
      ]
    },
    {
      key: 'how_we_treat_strangers',
      icon: '🚪',
      title: 'How Fair Tide Treats Strangers',
      issue: "More strangers are arriving than ever before, and not everyone agrees how much trust a new face should be given on arrival. Some want an open gate. Some want a longer look before anyone's fully welcomed in.",
      options: [
        { key:'open_gate', label:'Keep the gate open', outcome:"Fair Tide stays exactly as welcoming as it's always been. Most visitors appreciate it immediately — and it means trusting a stranger a little sooner than some would prefer.", xp:80 },
        { key:'closer_look', label:'Take a closer look first', outcome:"New arrivals get a bit more attention before they're treated as fully trusted. It costs Fair Tide a little of its easy warmth — and gives Joy's Warden system somewhere useful to actually start.", gold:70 }
      ]
    }
  ];
  window.ARC23_COUNCIL_POLICIES = COUNCIL_POLICIES;

  function councilPoliciesUnlocked(){
    return !!(game.comicProgress23 && game.comicProgress23[16]);
  }
  window.councilPoliciesUnlocked = councilPoliciesUnlocked;

  function councilPolicyResolved(key){
    return !!(game.councilPolicies && game.councilPolicies[key]);
  }
  window.councilPolicyResolved = councilPolicyResolved;

  function resolveCouncilPolicy(policyKey, optionKey){
    const policy = COUNCIL_POLICIES.find(function(p){ return p.key === policyKey; });
    if (!policy) return;
    if (councilPolicyResolved(policyKey)) return; // one-time, matching Council Hall's own decisions
    const option = policy.options.find(function(o){ return o.key === optionKey; });
    if (!option) return;
    game.councilPolicies = game.councilPolicies || {};
    game.councilPolicies[policyKey] = optionKey;
    if (option.gold) game.gold = (game.gold || 0) + option.gold;
    if (option.xp) gainXP(option.xp);
    toast('📜 ' + policy.title + ': ' + option.label + '.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.resolveCouncilPolicy = resolveCouncilPolicy;

  function renderCouncilPoliciesPanel(){
    if (!councilPoliciesUnlocked()) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">📜 Council Policies</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Rules people can actually understand — not arbitrary, just necessary now that Fair Tide is bigger than it used to be.</p>';
    COUNCIL_POLICIES.forEach(function(policy){
      const resolved = councilPolicyResolved(policy.key);
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:flex-start;">'+
        '<div style="font-size:1.4rem;">'+policy.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(policy.title)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(policy.issue)+'</span>';
      if (resolved) {
        const chosenKey = game.councilPolicies[policy.key];
        const chosenOption = policy.options.find(function(o){ return o.key === chosenKey; });
        html += '<div style="margin-top:6px;"><span class="story-chip">✓ Decided: '+esc(chosenOption.label)+'</span></div>'+
          '<div style="margin-top:4px;font-size:.78rem;opacity:.7;font-style:italic;">'+esc(chosenOption.outcome)+'</div>';
      } else {
        html += '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">';
        policy.options.forEach(function(option){
          html += '<button class="btn btn-small" onclick="resolveCouncilPolicy(\''+policy.key+'\',\''+option.key+'\')">'+esc(option.label)+'</button>';
        });
        html += '</div>';
      }
      html += '</div></div></article>';
    });
    return html;
  }
  window.renderCouncilPoliciesPanel = renderCouncilPoliciesPanel;

  const oldRenderArchiveScreenForCouncilPolicies = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForCouncilPolicies) oldRenderArchiveScreenForCouncilPolicies();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('councilPoliciesPanelWrap');
    if (existing) existing.remove();
    const panel = renderCouncilPoliciesPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="councilPoliciesPanelWrap">'+panel+'</div>');
  };
})();
