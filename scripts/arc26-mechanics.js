(function(){
  // -------------------------------------------------------------------
  // ARC XXVI MECHANICS — everything Ch.6, 10, 16, 18, 19, and 21's own
  // gameplay notes call for. Deliberately kept OUT of arc26.js itself,
  // same split used since Arc XXIII: arc files only wire story.
  //
  // Per the outline's own explicit rejection of a dialogue-tree/
  // morality-slider shape: nothing here is a player-facing political
  // choice. San's decisions (accepting or refusing pressure, drawing
  // lines, negotiating terms) are all already canonical in arc26.js's
  // own chapter text. The player's only lever is preparation — how full
  // the Reserves are, how diversified the Trade Network is, how far
  // Caelan's Self-Sufficiency tree has come — which determines how
  // comfortably Fair Tide rides out the consequences of San's own
  // choices, never whether those choices happen.
  //
  // FIVE SYSTEMS:
  //   1. Strategic Reserves (Ch.6)      -- the outline's own favorite.
  //   2. Independence Score (Ch.6)      -- aggregate readout of 1/3/4/5.
  //   3. Trade Network (Ch.18)          -- Aisyah's diversification.
  //   4. Self-Sufficiency tree (Ch.21)  -- Caelan's infrastructure.
  //   5. Harbor Readiness (Ch.6)        -- a readout, not a new lever;
  //      see its own section below for why.
  //
  // Plus two small hooks:
  //   - Ch.10 reclassifies specific worlds using the ALREADY-EXISTING
  //     Route Access system from Arc XVIII (world-catalogue.js), rather
  //     than a new classification scale (see arc26.js's own file-level
  //     note for the reasoning).
  //   - Ch.19 onward, Fair Tide Intelligence (arc24-mechanics.js) can
  //     surface a Lead tagged "Affiliation: Unknown" — the background
  //     thread the outline explicitly wants seeding Arc XXVII, done as
  //     a pure additive wrap around that file's own generation function
  //     rather than editing it.
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. STRATEGIC RESERVES (Ch.6) — five stockpile categories, each 0-100.
  // Decay a little every in-game day (simulating ordinary consumption),
  // offset by Self-Sufficiency tiers and Trade Network diversification.
  // A manual Requisition action (gold, once per day, one category) exists
  // for the player to react directly, same "not tedious, but responsive"
  // shape as everything else in this codebase.
  // ===========================================================================
  const RESERVE_CATEGORIES = [
    { key:'food',                icon:'🍚', label:'Food' },
    { key:'medicine',            icon:'💊', label:'Medicine' },
    { key:'ship_supplies',       icon:'⚓', label:'Ship Supplies' },
    { key:'workshop_materials',  icon:'🔧', label:'Workshop Materials' },
    { key:'horizon_supplies',    icon:'🌌', label:'Horizon Supplies' }
  ];
  window.ARC26_RESERVE_CATEGORIES = RESERVE_CATEGORIES;

  const RESERVE_START_PCT = 70;
  const RESERVE_DECAY_PER_DAY = 1.5;
  const DISRUPTION_DECAY_MULTIPLIER = 2;
  const DISRUPTION_DURATION_DAYS = 10; // Ch.16, "The Closed Harbor"
  const REQUISITION_COST = 40;
  const REQUISITION_GAIN = 15;

  function reservesUnlocked(){
    return !!(game.comicProgress26 && game.comicProgress26[6]);
  }
  window.reservesUnlocked = reservesUnlocked;

  function ensureReservesState(){
    if (!game.fairTideReserves) {
      game.fairTideReserves = { lastTickDay: game.day || 0, lastRequisitionDay: -1 };
      RESERVE_CATEGORIES.forEach(function(c){ game.fairTideReserves[c.key] = RESERVE_START_PCT; });
    }
    return game.fairTideReserves;
  }
  window.fairTideReservesState = ensureReservesState;

  // Ch.16 disruption: checked here (not written into arc26.js's own
  // chapter-read function) so this file stays the sole owner of every
  // Reserves-related side effect. Starts the first time this tick
  // detects comicProgress26[16] newly true, runs for a fixed window,
  // then clears itself -- no manual cleanup needed on later saves.
  function supplyDisruptionActive(){
    const d = game.fairTideSupplyDisruption;
    if (!d) return false;
    return (game.day || 0) - d.startDay < d.durationDays;
  }
  window.supplyDisruptionActive = supplyDisruptionActive;

  function checkSupplyDisruptionTrigger(){
    if (game.fairTideSupplyDisruption) return; // already started (or already resolved) once
    if (!(game.comicProgress26 && game.comicProgress26[16])) return;
    game.fairTideSupplyDisruption = { startDay: game.day || 0, durationDays: DISRUPTION_DURATION_DAYS };
    toast('⚓ The Closed Harbor cuts off regular imports — Fair Tide\'s Reserves will drain faster for a while.', 4200);
    if (typeof logEvent === 'function') logEvent('⚓ Supply Disruption begins — the closed harbor is starting to bite.', 'bad');
  }

  function selfSufficiencyRegenPerDay(){
    return (typeof window.selfSufficiencyTier === 'function') ? window.selfSufficiencyTier() : 0;
  }
  function tradeNetworkRegenFor(categoryKey){
    return (typeof window.tradeNetworkRegenForCategory === 'function') ? window.tradeNetworkRegenForCategory(categoryKey) : 0;
  }

  function tickStrategicReserves(){
    if (!reservesUnlocked()) return;
    checkSupplyDisruptionTrigger();
    const state = ensureReservesState();
    const nowDay = game.day || 0;
    // BUG FIX: `state.lastTickDay || nowDay` looked like a safe fallback
    // but treats a legitimate lastTickDay of 0 (a brand-new game, day 0)
    // as "missing" -- 0 is falsy, so it silently substituted nowDay
    // itself, making elapsedDays permanently compute as 0 and freezing
    // decay/regen forever for any save that unlocked Reserves on day 0.
    const lastTickDay = (typeof state.lastTickDay === 'number') ? state.lastTickDay : nowDay;
    const elapsedDays = nowDay - lastTickDay;
    if (elapsedDays <= 0) return;
    const decayMult = supplyDisruptionActive() ? DISRUPTION_DECAY_MULTIPLIER : 1;
    const flatRegen = selfSufficiencyRegenPerDay();
    RESERVE_CATEGORIES.forEach(function(c){
      const netPerDay = flatRegen + tradeNetworkRegenFor(c.key) - (RESERVE_DECAY_PER_DAY * decayMult);
      const before = state[c.key] || 0;
      state[c.key] = Math.max(0, Math.min(100, before + netPerDay * elapsedDays));
    });
    state.lastTickDay = nowDay;
  }
  window.tickStrategicReserves = tickStrategicReserves;

  function canRequisition(){
    if (!reservesUnlocked()) return false;
    const state = ensureReservesState();
    return state.lastRequisitionDay !== (game.day || 0) && (game.gold || 0) >= REQUISITION_COST;
  }
  window.canRequisitionReserve = canRequisition;

  window.requisitionReserve = function(categoryKey){
    const cat = RESERVE_CATEGORIES.find(function(c){ return c.key === categoryKey; });
    if (!cat) return;
    const state = ensureReservesState();
    if (state.lastRequisitionDay === (game.day || 0)) { toast('Already requisitioned supplies today.', 2800); return; }
    if ((game.gold || 0) < REQUISITION_COST) { toast('Not enough gold.', 2800); return; }
    game.gold -= REQUISITION_COST;
    state.lastRequisitionDay = game.day || 0;
    state[categoryKey] = Math.max(0, Math.min(100, (state[categoryKey] || 0) + REQUISITION_GAIN));
    toast('📦 Requisitioned ' + cat.label + ' — +' + REQUISITION_GAIN + '%.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  function averageReservePct(){
    const state = ensureReservesState();
    const total = RESERVE_CATEGORIES.reduce(function(sum, c){ return sum + (state[c.key] || 0); }, 0);
    return total / RESERVE_CATEGORIES.length;
  }
  window.averageReservePct = averageReservePct;

  function renderStrategicReservesPanel(){
    if (!reservesUnlocked()) return '';
    tickStrategicReserves();
    const state = ensureReservesState();
    const requisitionable = canRequisition();
    let html = '<div class="panel-title" style="margin-top:16px;">📦 Strategic Reserves</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">'+(supplyDisruptionActive() ? '⚠️ The closed harbor is cutting into imports — Reserves are draining faster than usual.' : "What Fair Tide can rely on without anyone else's help.")+'</p>';
    RESERVE_CATEGORIES.forEach(function(c){
      const pct = Math.round(state[c.key] || 0);
      const low = pct < 50;
      html += '<div style="margin-bottom:8px;">'+
        '<div style="display:flex;justify-content:space-between;font-size:.8rem;">'+
          '<strong>'+c.icon+' '+esc(c.label)+'</strong><span style="opacity:.75;">'+pct+'%'+(low?' ⚠️':'')+'</span>'+
        '</div>'+
        '<div style="background:rgba(255,255,255,0.08);border-radius:4px;height:6px;margin-top:3px;overflow:hidden;">'+
          '<div style="background:'+(low?'#c0392b':'var(--gold)')+';height:100%;width:'+pct+'%;"></div>'+
        '</div>'+
        '<button class="btn btn-small" style="margin-top:4px;" onclick="requisitionReserve(\''+c.key+'\')" '+(requisitionable?'':'disabled')+'>Requisition ('+REQUISITION_COST+'g, +'+REQUISITION_GAIN+'%)</button>'+
      '</div>';
    });
    return html;
  }
  window.renderStrategicReservesPanel = renderStrategicReservesPanel;

  // ===========================================================================
  // 2. INDEPENDENCE SCORE (Ch.6) — a single aggregate readout, never a
  // player-set lever. Weighted from Reserves fill, Trade Network
  // diversification, Self-Sufficiency progress, and Harbor Readiness.
  // Sub-systems that aren't unlocked yet simply contribute their floor
  // value rather than being excluded, so Independence honestly reads
  // low until the player actually builds the rest of Arc XXVI's systems.
  // ===========================================================================
  const INDEPENDENCE_TIERS = [
    { min:0,  label:'Dependent',      desc:"Fair Tide still leans heavily on outside partners for the basics." },
    { min:25, label:'Developing',     desc:"Fair Tide is starting to stand on its own, unevenly." },
    { min:50, label:'Resilient',      desc:"Fair Tide can absorb real pressure without buckling." },
    { min:75, label:'Self-Sufficient',desc:"Fair Tide answers to itself first, and it shows." }
  ];
  window.ARC26_INDEPENDENCE_TIERS = INDEPENDENCE_TIERS;

  function independenceUnlocked(){
    return reservesUnlocked();
  }
  window.independenceUnlocked = independenceUnlocked;

  window.independenceScore = function(){
    if (!independenceUnlocked()) return 0;
    const reservesPart = averageReservePct(); // 0-100
    const tradePart = (typeof window.tradeNetworkDiversification === 'function') ? window.tradeNetworkDiversification() * 100 : 0;
    const sufficiencyPart = (typeof window.selfSufficiencyTier === 'function' && typeof window.ARC26_SELF_SUFFICIENCY_TIERS !== 'undefined')
      ? (window.selfSufficiencyTier() / window.ARC26_SELF_SUFFICIENCY_TIERS.length) * 100 : 0;
    const readinessPart = (typeof window.harborReadinessScore === 'function') ? window.harborReadinessScore() : 0;
    const score = reservesPart * 0.4 + tradePart * 0.25 + sufficiencyPart * 0.2 + readinessPart * 0.15;
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  function independenceTier(score){
    let current = INDEPENDENCE_TIERS[0];
    for (let i = 0; i < INDEPENDENCE_TIERS.length; i++) {
      if (score >= INDEPENDENCE_TIERS[i].min) current = INDEPENDENCE_TIERS[i];
    }
    return current;
  }
  window.independenceTier = independenceTier;

  function renderIndependencePanel(){
    if (!independenceUnlocked()) return '';
    const score = window.independenceScore();
    const tier = independenceTier(score);
    return '<div class="panel-title" style="margin-top:16px;">⚖️ Fair Tide Independence</div>'+
      '<article class="quest-item"><div style="display:flex;justify-content:space-between;align-items:center;">'+
        '<div><strong>'+esc(tier.label)+'</strong><br><span style="font-size:.8rem;opacity:.8;">'+esc(tier.desc)+'</span></div>'+
        '<div style="font-size:1.3rem;font-weight:bold;">'+score+'</div>'+
      '</div>'+
      '<div style="background:rgba(255,255,255,0.08);border-radius:4px;height:6px;margin-top:8px;overflow:hidden;">'+
        '<div style="background:var(--gold);height:100%;width:'+score+'%;"></div>'+
      '</div></article>';
  }
  window.renderIndependencePanel = renderIndependencePanel;

  // ===========================================================================
  // 3. TRADE NETWORK (Ch.18) — Aisyah's diversification system. Partners
  // are grouped by which Reserve category they feed; establishing a
  // second partner for the same category is deliberately LESS gold-
  // efficient per partner than staying with one, but raises that
  // category's diversification (and therefore Independence) -- the
  // outline's own "efficient but risky vs. resilient but costlier"
  // tradeoff, made concrete instead of abstract.
  //
  // Real, already-established ports (core-engine.js's own PORTS array)
  // and one already-catalogued Horizon world are used as partners rather
  // than inventing new place names, for continuity with the world
  // that's already on the map.
  // ===========================================================================
  const TRADE_PARTNERS = [
    { key:'bangkok',   name:'Bangkok',    icon:'🍜', category:'food',               cost:200, regen:0.6 },
    { key:'hanoi',     name:'Hanoi',      icon:'🌾', category:'food',               cost:260, regen:0.5 },
    { key:'batavia',   name:'Batavia',    icon:'💊', category:'medicine',           cost:220, regen:0.6 },
    { key:'singapore', name:'Singapore',  icon:'⚓', category:'ship_supplies',      cost:240, regen:0.6 },
    { key:'palembang', name:'Palembang',  icon:'🔧', category:'workshop_materials', cost:220, regen:0.6 },
    { key:'kota_batu', name:'Kota Batu',  icon:'🪨', category:'workshop_materials', cost:280, regen:0.5 },
    { key:'world_01',  name:'a Horizon World', icon:'🌌', category:'horizon_supplies', cost:300, regen:0.6 }
  ];
  window.ARC26_TRADE_PARTNERS = TRADE_PARTNERS;

  function tradeNetworkUnlocked(){
    return !!(game.comicProgress26 && game.comicProgress26[18]);
  }
  window.tradeNetworkUnlocked = tradeNetworkUnlocked;

  function establishedPartners(){
    game.tradeNetworkPartners = game.tradeNetworkPartners || {};
    return game.tradeNetworkPartners;
  }
  window.establishedTradePartners = establishedPartners;

  window.tradeNetworkRegenForCategory = function(categoryKey){
    const established = establishedPartners();
    return TRADE_PARTNERS.reduce(function(sum, p){
      if (p.category !== categoryKey || !established[p.key]) return sum;
      return sum + p.regen;
    }, 0);
  };

  // Diversification for one category: 0 if nothing established, 1 if
  // every possible partner for it is established (perfectly spread),
  // otherwise a fraction reflecting how concentrated the current supply
  // is in its single biggest partner -- exactly the outline's "getting
  // 70% from one partner is risky" idea, generalized.
  function categoryDiversification(categoryKey){
    const established = establishedPartners();
    const partnersForCategory = TRADE_PARTNERS.filter(function(p){ return p.category === categoryKey; });
    const activePartners = partnersForCategory.filter(function(p){ return established[p.key]; });
    if (!activePartners.length) return 0;
    if (activePartners.length === 1) return partnersForCategory.length > 1 ? 0.3 : 0.6; // a single source is still SOME independence from imports, just risky
    const totalRegen = activePartners.reduce(function(sum, p){ return sum + p.regen; }, 0);
    const maxShare = Math.max.apply(null, activePartners.map(function(p){ return p.regen / totalRegen; }));
    return Math.max(0.3, 1 - maxShare);
  }
  window.categoryDiversification = categoryDiversification;

  window.tradeNetworkDiversification = function(){
    const categories = Array.from(new Set(TRADE_PARTNERS.map(function(p){ return p.category; })));
    const scores = categories.map(categoryDiversification);
    return scores.reduce(function(a,b){ return a+b; }, 0) / scores.length;
  };

  window.establishTradePartner = function(partnerKey){
    const partner = TRADE_PARTNERS.find(function(p){ return p.key === partnerKey; });
    if (!partner) return;
    const established = establishedPartners();
    if (established[partnerKey]) { toast('Already trading with ' + partner.name + '.', 2800); return; }
    if ((game.gold || 0) < partner.cost) { toast('Not enough gold.', 2800); return; }
    game.gold -= partner.cost;
    established[partnerKey] = true;
    toast('🌐 Trade established with ' + partner.name + '.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  function renderTradeNetworkPanel(){
    if (!tradeNetworkUnlocked()) return '';
    const established = establishedPartners();
    let html = '<div class="panel-title" style="margin-top:16px;">🌐 Trade Network</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Spreading Fair Tide\'s supply across several smaller partners instead of a handful of dominant ones — less efficient, much harder to squeeze.</p>';
    TRADE_PARTNERS.forEach(function(p){
      const active = !!established[p.key];
      const cat = RESERVE_CATEGORIES.find(function(c){ return c.key === p.category; });
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">'+p.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(p.name)+'</strong> <span class="story-chip">'+(cat?esc(cat.label):p.category)+'</span><br>'+
        '<span style="font-size:.8rem;opacity:.85;">+'+p.regen+'%/day to '+(cat?esc(cat.label):p.category)+'</span>'+
        '</div>'+
        (active ? '<span style="font-size:.78rem;opacity:.6;">✅ Trading</span>'
                : '<button class="btn btn-small" onclick="establishTradePartner(\''+p.key+'\')" '+((game.gold||0) < p.cost ? 'disabled' : '')+'>Establish ('+p.cost+'g)</button>')+
        '</div></article>';
    });
    return html;
  }
  window.renderTradeNetworkPanel = renderTradeNetworkPanel;

  // ===========================================================================
  // 4. SELF-SUFFICIENCY TREE (Ch.21, Caelan) — same tiered-investment
  // shape already proven for Medical House/Harbour Defence. Adapted from
  // the outline's own 6-tier list: dropped "Local Workshop" specifically
  // (Caelan already runs a literal Workshop, Arc XXI Ch.10-11 — a
  // second "Workshop" tier here would read as the same building twice)
  // and kept the other five, renamed slightly for the same reason.
  // Each funded tier adds a flat regen/day to EVERY Reserve category at
  // once, rather than one category each — simpler to read, and matches
  // Ch.21's own framing of this as one continuous push toward
  // self-sufficiency rather than five separate projects.
  // ===========================================================================
  const SELF_SUFFICIENCY_TIERS = [
    { tier:1, cost:200, regenPerDay:0.4, label:'Expanded Storehouse', desc: "More room to actually hold what Fair Tide produces, instead of it going to waste for lack of anywhere to put it." },
    { tier:2, cost:320, regenPerDay:0.4, label:'Cistern & Water Reserve', desc: "A real water supply that doesn't depend on a good season or a friendly neighbor." },
    { tier:3, cost:420, regenPerDay:0.4, label:'Local Farmstead', desc: "Fair Tide grows a real share of its own food now, instead of importing all of it." },
    { tier:4, cost:520, regenPerDay:0.4, label:'Repair Yard', desc: "Caelan's own dedicated space — ships and equipment fixed properly, on Fair Tide's own schedule." },
    { tier:5, cost:650, regenPerDay:0.4, label:'Emergency Reserve Depot', desc: "A stockpile meant for exactly the kind of crisis Arc XXVI just proved could actually happen." }
  ];
  window.ARC26_SELF_SUFFICIENCY_TIERS = SELF_SUFFICIENCY_TIERS;

  function selfSufficiencyUnlocked(){
    return !!(game.comicProgress26 && game.comicProgress26[21]);
  }
  window.selfSufficiencyUnlocked = selfSufficiencyUnlocked;

  function selfSufficiencyTier(){
    return Number(game.selfSufficiencyTier || 0);
  }
  window.selfSufficiencyTier = selfSufficiencyTier;

  window.fundSelfSufficiencyTier = function(){
    const nextTier = SELF_SUFFICIENCY_TIERS.find(function(t){ return t.tier === selfSufficiencyTier() + 1; });
    if (!nextTier) { toast('Fully built out already.', 2800); return; }
    if ((game.gold || 0) < nextTier.cost) { toast('Not enough gold.', 2800); return; }
    game.gold -= nextTier.cost;
    game.selfSufficiencyTier = nextTier.tier;
    toast('🏗️ ' + nextTier.label + ' built — Fair Tide relies a little less on anyone else.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  function renderSelfSufficiencyPanel(){
    if (!selfSufficiencyUnlocked()) return '';
    const currentTier = selfSufficiencyTier();
    let html = '<div class="panel-title" style="margin-top:16px;">🏗️ Self-Sufficiency</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Caelan\'s own infrastructure push — Fair Tide becoming more independent because it has to.</p>';
    SELF_SUFFICIENCY_TIERS.forEach(function(t){
      const funded = currentTier >= t.tier;
      const isNext = currentTier === t.tier - 1;
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">'+(funded ? '✅' : '🏗️')+'</div><div style="flex:1;">'+
        '<strong>'+esc(t.label)+'</strong> <span class="story-chip">+'+t.regenPerDay+'%/day, all Reserves</span><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(t.desc)+'</span>'+
        '</div>'+
        (funded ? '<span style="font-size:.78rem;opacity:.6;">Built</span>'
          : (isNext ? '<button class="btn btn-small" onclick="fundSelfSufficiencyTier()" '+((game.gold||0) < t.cost ? 'disabled' : '')+'>Build ('+t.cost+'g)</button>'
                    : '<span style="font-size:.72rem;opacity:.5;">🔒 Locked</span>'))+
        '</div></article>';
    });
    return html;
  }
  window.renderSelfSufficiencyPanel = renderSelfSufficiencyPanel;

  // ===========================================================================
  // 5. HARBOR READINESS (Ch.6) — deliberately a READOUT, not a third
  // "assign your Warden's focus" mechanic. Arc XXIII already built that
  // exact interaction (Warden Assignments) and Arc XXIV already
  // extended it once (Warden Investigations) — a third assign-a-focus
  // panel here would be the tedious micromanagement the outline
  // explicitly warns against. Instead this simply reads whatever
  // assignment is already active and reports how much of a security
  // dividend it's currently providing.
  // ===========================================================================
  const READINESS_RELEVANT_AREAS = { harbour:1, warehouse:1, facilities:0.6 };

  window.harborReadinessScore = function(){
    const current = (typeof window.currentWardenAssignment === 'function') ? window.currentWardenAssignment() : null;
    if (!current) return 20; // some baseline readiness even with no assignment set
    const weight = READINESS_RELEVANT_AREAS[current];
    return weight ? Math.round(40 + weight * 60) : 40;
  };

  function renderHarborReadinessPanel(){
    if (!reservesUnlocked()) return '';
    const score = window.harborReadinessScore();
    const current = (typeof window.currentWardenAssignment === 'function') ? window.currentWardenAssignment() : null;
    return '<div class="panel-title" style="margin-top:16px;">🛡️ Harbor Readiness</div>'+
      '<article class="quest-item"><span style="font-size:.8rem;opacity:.85;">'+
        (current ? "Joy's current focus contributes " + score + '/100 toward Fair Tide\'s readiness against smuggling, theft, and sabotage during the pressure.'
                 : 'No Warden focus currently set — Harbor Readiness sits at a bare baseline of ' + score + '/100.')+
      '</span></article>';
  }
  window.renderHarborReadinessPanel = renderHarborReadinessPanel;

  // ===========================================================================
  // Archive screen wiring — one wrap, all five panels, same
  // insert-and-replace pattern as every mechanics file since Arc XXIII.
  // ===========================================================================
  const oldRenderArchiveScreenForArc26 = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForArc26) oldRenderArchiveScreenForArc26();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('arc26PanelWrap');
    if (existing) existing.remove();
    const panel = renderIndependencePanel() + renderStrategicReservesPanel() + renderHarborReadinessPanel() + renderTradeNetworkPanel() + renderSelfSufficiencyPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="arc26PanelWrap">'+panel+'</div>');
  };

  // Reserves tick is also driven from the same shared sync point every
  // other timed system in this codebase uses (raid-mode.js's Fountain
  // Dispatch, arc24-mechanics.js's Intelligence Leads) — cheap, called
  // constantly through normal play, and idempotent via lastTickDay.
  const oldSyncArc1ForArc26 = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForArc26) oldSyncArc1ForArc26();
    tickStrategicReserves();
  };

  // ===========================================================================
  // Ch.10 hook — "What Must Stay Ours." Reclassifies two already-
  // catalogued worlds using Arc XVIII's existing Route Access system,
  // rather than a parallel classification scale. Checked once via the
  // same tick, so it fires the moment Ch.10 is actually read regardless
  // of which screen the player happens to be on.
  // ===========================================================================
  function checkCh10RouteReclassification(){
    if (!(game.comicProgress26 && game.comicProgress26[10])) return;
    if (game.arc26Ch10RoutesReclassified) return;
    game.arc26Ch10RoutesReclassified = true;
    if (typeof window.setRouteAccess === 'function') {
      window.setRouteAccess('world_04', 'restricted', "Renn and Erynn: the route is genuinely unstable — not a place to open wider casually.");
      window.setRouteAccess('world_05', 'restricted', "Sealed for reasons the crew still doesn't fully understand — Ch.10's own boundary stays a boundary.");
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  }
  const oldSyncArc1ForCh10Routes = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForCh10Routes) oldSyncArc1ForCh10Routes();
    checkCh10RouteReclassification();
  };

  // ===========================================================================
  // Fair Tide Intelligence hook (Ch.19+) — "Affiliation: Unknown." Pure
  // additive wrap around arc24-mechanics.js's own Lead generator: once
  // Ch.19 is read, a newly generated Lead has a chance to carry an
  // extra flag instead of its normal named source, seeding Arc XXVII's
  // Nameless thread without this arc ever naming them or implying they
  // caused any of Arc XXVI's own pressure.
  // ===========================================================================
  const UNKNOWN_AFFILIATION_CHANCE = 0.3;

  function ch19Reached(){
    return !!(game.comicProgress26 && game.comicProgress26[19]);
  }
  window.arc26UnknownAffiliationActive = ch19Reached;

  const oldCheckIntelligenceLeadGenerationForArc26 = window.checkIntelligenceLeadGeneration;
  window.checkIntelligenceLeadGeneration = function(){
    if (oldCheckIntelligenceLeadGenerationForArc26) oldCheckIntelligenceLeadGenerationForArc26();
    if (!ch19Reached()) return;
    const leads = (typeof window.intelligenceLeads === 'function') ? window.intelligenceLeads() : [];
    if (!leads.length) return;
    const newest = leads[leads.length - 1];
    if (newest.unknownAffiliation !== undefined) return; // already decided for this lead
    newest.unknownAffiliation = Math.random() < UNKNOWN_AFFILIATION_CHANCE;
  };

  // Appended as a standalone note below the existing panel rather than
  // spliced into one specific lead's own markup -- arc24-mechanics.js's
  // renderFairTideIntelligencePanel() builds one HTML string for every
  // pending lead together, so there's no safe seam to target just the
  // flagged one without risking a mismatch (multiple leads pending,
  // wrong one visually tagged). A general notice matches the outline's
  // own framing anyway: "occasionally a report still contains:
  // Affiliation: Unknown," not a labeled card.
  const oldRenderFairTideIntelligencePanelForArc26 = window.renderFairTideIntelligencePanel;
  window.renderFairTideIntelligencePanel = function(){
    const html = oldRenderFairTideIntelligencePanelForArc26 ? oldRenderFairTideIntelligencePanelForArc26() : '';
    if (!html || !ch19Reached()) return html;
    const leads = (typeof window.intelligenceLeads === 'function') ? window.intelligenceLeads() : [];
    if (!leads.some(function(l){ return l.unknownAffiliation; })) return html;
    return html + '<div style="font-size:.74rem;opacity:.7;margin-top:6px;font-style:italic;">❓ One of the above traces back to no organization anyone recognizes. Affiliation: Unknown.</div>';
  };
})();
