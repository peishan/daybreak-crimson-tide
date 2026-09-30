(function(){
  // -------------------------------------------------------------------
  // ARC XXIV MECHANICS — everything Ch.6, 9, 18, and 20's own gameplay
  // notes call for. Deliberately kept OUT of arc24.js itself, same split
  // used for Arc XXIII's own mechanics file: arc files since XVII only
  // wire story.
  //
  // Kept deliberately lighter than Arc XXIII's own mechanics file, per
  // the outline's explicit note ("I'd actually keep Arc 24 mechanically
  // lighter than Arc 23"). Four panels total, three of them small
  // flavor/decision panels reusing this codebase's proven shapes exactly
  // (a rotating read-only event, a one-time branching decision), and one
  // real system: Fair Tide Intelligence (Ch.20), which is the arc's only
  // substantial addition and the one meant to persist as permanent
  // infrastructure well past Arc XXIV, per the outline's own long-range
  // roadmap for the Nameless.
  //
  // Deliberately NOT built here: a standalone panel for Ch.3 ("Aisyah's
  // Records") — per arc24.js's own file-level note, that chapter is
  // connective tissue explaining why Aisyah's records feed Fair Tide
  // Intelligence later, not a mechanic of its own. Same restraint Arc
  // XXIII's mechanics file used for its own Ch.2.
  //
  // Fair Tide Intelligence is explicitly NOT a new resource screen or a
  // spy guild, per Ch.20's own text — it's existing information (Harbour
  // Office, Aisyah/Market, Warden's Hall, Route Observatory, Renn,
  // Erynn, Mimi, Senedra) occasionally producing an Intelligence Lead,
  // which the player can follow up for a small reward. Per the outline,
  // a Lead "may unlock an investigation, an expedition, a route clue, a
  // suspicious visitor event, or a future story encounter" — none of
  // that story content exists yet, so following up a Lead currently
  // grants a flat story-XP/gold reward and clears it. FUTURE HOOK: once
  // later arcs add real investigation/expedition content, a Lead's
  // resolution can branch into those instead of the flat reward below,
  // with zero changes needed to how Leads are generated or displayed.
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. VERIFICATION EVENTS (Ch.6) — "The Missing Manifest." A small
  // Harbour Office/Port Management flavor addition: read-only rotating
  // events, same shape as Arc XXIII's Neutral Harbour Events (Ch.7).
  // ===========================================================================
  const VERIFICATION_EVENTS = [
    { icon:'📄', text:'A departure manifest checks out clean — every entry accounted for, nothing missing this time.' },
    { icon:'🔍', text:"A clerk double-checks a visitor entry against the original registration. It matches. Still worth checking." },
    { icon:'🗂️', text:"An older manifest gets pulled and cross-referenced, just to be sure nothing else has quietly gone missing." },
    { icon:'✅', text:"The Harbour Office finishes a full pass of the week's records. Nothing else has disappeared — yet." }
  ];
  window.ARC24_VERIFICATION_EVENTS = VERIFICATION_EVENTS;

  function verificationEventsUnlocked(){
    return !!(game.comicProgress24 && game.comicProgress24[6]);
  }
  window.verificationEventsUnlocked = verificationEventsUnlocked;

  function todaysVerificationEvent(){
    const idx = (game.day || 0) % VERIFICATION_EVENTS.length;
    return VERIFICATION_EVENTS[idx];
  }
  window.todaysVerificationEvent = todaysVerificationEvent;

  function renderVerificationEventsPanel(){
    if (!verificationEventsUnlocked()) return '';
    const event = todaysVerificationEvent();
    let html = '<div class="panel-title" style="margin-top:16px;">📄 Information Integrity</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Nobody broke in. Nobody destroyed anything. One entry simply wasn\'t there anymore — important records get a second look now.</p>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">'+event.icon+'</div><div style="flex:1;">'+
      '<span style="font-size:.8rem;opacity:.85;">'+esc(event.text)+'</span>'+
      '</div></div></article>';
    return html;
  }
  window.renderVerificationEventsPanel = renderVerificationEventsPanel;

  const oldRenderArchiveScreenForVerificationEvents = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForVerificationEvents) oldRenderArchiveScreenForVerificationEvents();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('verificationEventsPanelWrap');
    if (existing) existing.remove();
    const panel = renderVerificationEventsPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="verificationEventsPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 2. WARDEN INVESTIGATIONS (Ch.9) — an upgrade to Arc XXIII's existing
  // Warden Assignments (arc23-mechanics.js), not a replacement. Read-only
  // rotating flavor, same shape as Verification Events above, referencing
  // whatever area Joy's currently focused on when one is set.
  // ===========================================================================
  const WARDEN_INVESTIGATIONS = [
    { icon:'🕵️', text:'A tail comes back with nothing concrete — but "nothing concrete" is still worth logging.' },
    { icon:'📦', text:'Something was left at a spot nobody would look at twice. Somebody else collected it, hours later.' },
    { icon:'👣', text:"A stranger's route through Fair Tide gets traced end to end, without them ever noticing they were followed." },
    { icon:'🧩', text:"Two separate reports turn out to describe the same person, once someone actually lines them up side by side." }
  ];
  window.ARC24_WARDEN_INVESTIGATIONS = WARDEN_INVESTIGATIONS;

  function wardenInvestigationsUnlocked(){
    return !!(game.comicProgress24 && game.comicProgress24[9]);
  }
  window.wardenInvestigationsUnlocked = wardenInvestigationsUnlocked;

  function todaysWardenInvestigation(){
    const idx = (game.day || 0) % WARDEN_INVESTIGATIONS.length;
    return WARDEN_INVESTIGATIONS[idx];
  }
  window.todaysWardenInvestigation = todaysWardenInvestigation;

  function renderWardenInvestigationsPanel(){
    if (!wardenInvestigationsUnlocked()) return '';
    const event = todaysWardenInvestigation();
    const assignment = (typeof window.currentWardenAssignment === 'function') ? window.currentWardenAssignment() : null;
    let html = '<div class="panel-title" style="margin-top:16px;">🕵️ Warden Investigations</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Joy\'s Watch can now follow a lead instead of just standing one, distinct from an ordinary combat expedition.</p>';
    html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.4rem;">'+event.icon+'</div><div style="flex:1;">'+
      '<span style="font-size:.8rem;opacity:.85;">'+esc(event.text)+'</span>'+
      (assignment ? '<div style="font-size:.72rem;opacity:.6;margin-top:4px;">Currently focused: '+esc(assignment)+'</div>' : '')+
      '</div></div></article>';
    return html;
  }
  window.renderWardenInvestigationsPanel = renderWardenInvestigationsPanel;

  const oldRenderArchiveScreenForWardenInvestigations = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForWardenInvestigations) oldRenderArchiveScreenForWardenInvestigations();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('wardenInvestigationsPanelWrap');
    if (existing) existing.remove();
    const panel = renderWardenInvestigationsPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="wardenInvestigationsPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 3. COUNCIL SECURITY POLICIES (Ch.18) — "Close the Doors?" Same
  // one-time branching-decision shape as Arc XXIII's own Council Policies
  // (arc23-mechanics.js), its own fully independent array/state/panel for
  // the same reason Arc XXIII's didn't reuse Arc XXI's own
  // COUNCIL_DECISIONS array.
  // ===========================================================================
  const COUNCIL_SECURITY_POLICIES = [
    {
      key: 'visitor_access',
      icon: '🚪',
      title: 'How Open Should Fair Tide Stay?',
      issue: "Some push to restrict visitors and route information dramatically, now that Fair Tide knows something is watching. San doesn't want a fortress — but she also can't just ignore the concern outright.",
      options: [
        { key:'stay_open', label:'Keep Fair Tide open', outcome:"Fair Tide stays exactly as welcoming as it's always been. Visitors keep choosing it for that reason — and whoever's watching keeps having just as much to watch.", xp:80 },
        { key:'tighten_access', label:'Tighten visitor access', outcome:"New arrivals face a bit more scrutiny before they're treated as fully trusted. It costs Fair Tide some of its easy warmth, and gives the Warden's Hall a real head start on anyone worth watching.", gold:70 }
      ]
    },
    {
      key: 'sensitive_technology',
      icon: '⚙️',
      title: 'Protecting the Horizon Engine',
      issue: "The Engine and the route information around it are clearly what the Nameless actually want. San agrees they deserve real protection — the only question is how far to take it.",
      options: [
        { key:'measured_protection', label:'Measured, deliberate protection', outcome:"Access tightens, records get better, and the researchers keep working close to normally. Not impenetrable — but no longer casual, either.", xp:90 },
        { key:'lockdown', label:'Full lockdown of the Chamber', outcome:"The Horizon Chamber becomes genuinely difficult to reach, for anyone. Safer, certainly — and a visible reminder to everyone at Fair Tide of exactly what's now considered worth guarding this closely.", gold:90 }
      ]
    }
  ];
  window.ARC24_COUNCIL_SECURITY_POLICIES = COUNCIL_SECURITY_POLICIES;

  function councilSecurityPoliciesUnlocked(){
    return !!(game.comicProgress24 && game.comicProgress24[18]);
  }
  window.councilSecurityPoliciesUnlocked = councilSecurityPoliciesUnlocked;

  function councilSecurityPolicyResolved(key){
    return !!(game.councilSecurityPolicies && game.councilSecurityPolicies[key]);
  }
  window.councilSecurityPolicyResolved = councilSecurityPolicyResolved;

  function resolveCouncilSecurityPolicy(policyKey, optionKey){
    const policy = COUNCIL_SECURITY_POLICIES.find(function(p){ return p.key === policyKey; });
    if (!policy) return;
    if (councilSecurityPolicyResolved(policyKey)) return; // one-time, matching Council Hall's own decisions
    const option = policy.options.find(function(o){ return o.key === optionKey; });
    if (!option) return;
    game.councilSecurityPolicies = game.councilSecurityPolicies || {};
    game.councilSecurityPolicies[policyKey] = optionKey;
    if (option.gold) game.gold = (game.gold || 0) + option.gold;
    if (option.xp) gainXP(option.xp);
    toast('📜 ' + policy.title + ': ' + option.label + '.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.resolveCouncilSecurityPolicy = resolveCouncilSecurityPolicy;

  function renderCouncilSecurityPoliciesPanel(){
    if (!councilSecurityPoliciesUnlocked()) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🚪 Council Security Policies</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Fair Tide won\'t become a fortress just because something out there made it nervous — but neutrality was never supposed to mean carelessness.</p>';
    COUNCIL_SECURITY_POLICIES.forEach(function(policy){
      const resolved = councilSecurityPolicyResolved(policy.key);
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:flex-start;">'+
        '<div style="font-size:1.4rem;">'+policy.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(policy.title)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(policy.issue)+'</span>';
      if (resolved) {
        const chosenKey = game.councilSecurityPolicies[policy.key];
        const chosenOption = policy.options.find(function(o){ return o.key === chosenKey; });
        html += '<div style="margin-top:6px;"><span class="story-chip">✓ Decided: '+esc(chosenOption.label)+'</span></div>'+
          '<div style="margin-top:4px;font-size:.78rem;opacity:.7;font-style:italic;">'+esc(chosenOption.outcome)+'</div>';
      } else {
        html += '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">';
        policy.options.forEach(function(option){
          html += '<button class="btn btn-small" onclick="resolveCouncilSecurityPolicy(\''+policy.key+'\',\''+option.key+'\')">'+esc(option.label)+'</button>';
        });
        html += '</div>';
      }
      html += '</div></div></article>';
    });
    return html;
  }
  window.renderCouncilSecurityPoliciesPanel = renderCouncilSecurityPoliciesPanel;

  const oldRenderArchiveScreenForCouncilSecurityPolicies = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForCouncilSecurityPolicies) oldRenderArchiveScreenForCouncilSecurityPolicies();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('councilSecurityPoliciesPanelWrap');
    if (existing) existing.remove();
    const panel = renderCouncilSecurityPoliciesPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="councilSecurityPoliciesPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 4. FAIR TIDE INTELLIGENCE (Ch.20) — "Watching the Watchers." The
  // arc's one substantial, permanent addition. Existing systems (Harbour
  // Office, Aisyah/Market, Warden's Hall, Route Observatory/Renn, Erynn,
  // Mimi, Senedra, Council Hall) occasionally surface an Intelligence
  // Lead; the player follows it up for a reward. A day-gated cadence,
  // same self-healing "checked wherever this is read" pattern as
  // raid-mode.js's own Fountain Dispatch timers — generation is checked
  // from syncArc1StoryQuestProgress (called constantly throughout normal
  // play) rather than needing its own dedicated day-tick hook.
  // ===========================================================================
  const INTELLIGENCE_SOURCES = [
    { key:'harbour',    icon:'⚓', label:"Harbour Office",        flavor:"A visitor manifest doesn't quite add up." },
    { key:'market',     icon:'🛍️', label:"Aisyah & the Market",   flavor:"A shipment's paperwork doesn't match where it actually came from." },
    { key:'warden',     icon:'🛡️', label:"The Warden's Hall",     flavor:"Someone lingered near a restricted building a little too long." },
    { key:'routes',     icon:'🔭', label:"Renn & the Route Observatory", flavor:"An obscure route is seeing traffic it has no ordinary reason to see." },
    { key:'research',   icon:'🧭', label:"Erynn's Research",      flavor:"A name on record with no real history standing behind it." },
    { key:'divination', icon:'🔮', label:"Mimi's Divination",     flavor:"A pattern nobody else at Fair Tide would have thought to look for." },
    { key:'field',      icon:'🎯', label:"Senedra's Field Watch", flavor:"A stranger met no one at all, and still managed to leave something behind." },
    { key:'council',    icon:'🏛️', label:"The Council Hall",      flavor:"A policy question that turned out to be a security question in disguise." }
  ];
  window.ARC24_INTELLIGENCE_SOURCES = INTELLIGENCE_SOURCES;

  const INTELLIGENCE_LEAD_INTERVAL_DAYS = 3;
  const INTELLIGENCE_LEAD_CAP = 3;
  const INTELLIGENCE_LEAD_XP = 60;
  const INTELLIGENCE_LEAD_GOLD = 40;

  function intelligenceUnlocked(){
    return !!(game.comicProgress24 && game.comicProgress24[20]);
  }
  window.intelligenceUnlocked = intelligenceUnlocked;

  function ensureIntelligenceState(){
    game.intelligence = game.intelligence || { leads: [], lastGenDay: -1, nextId: 1 };
    return game.intelligence;
  }

  function intelligenceLeads(){
    return ensureIntelligenceState().leads;
  }
  window.intelligenceLeads = intelligenceLeads;

  function checkIntelligenceLeadGeneration(){
    if (!intelligenceUnlocked()) return;
    const state = ensureIntelligenceState();
    if (state.leads.length >= INTELLIGENCE_LEAD_CAP) return;
    if (state.lastGenDay !== -1 && (game.day - state.lastGenDay) < INTELLIGENCE_LEAD_INTERVAL_DAYS) return;
    state.lastGenDay = game.day;
    const source = INTELLIGENCE_SOURCES[state.nextId % INTELLIGENCE_SOURCES.length];
    const lead = { id: state.nextId++, sourceKey: source.key, day: game.day };
    state.leads.push(lead);
    toast('🕵️ Intelligence Lead: ' + source.label + ' has something worth following up.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  }
  window.checkIntelligenceLeadGeneration = checkIntelligenceLeadGeneration;

  function followUpIntelligenceLead(leadId){
    const state = ensureIntelligenceState();
    const idx = state.leads.findIndex(function(l){ return l.id === leadId; });
    if (idx === -1) return;
    const lead = state.leads[idx];
    const source = INTELLIGENCE_SOURCES.find(function(s){ return s.key === lead.sourceKey; });
    state.leads.splice(idx, 1);
    gainXP(INTELLIGENCE_LEAD_XP);
    game.gold = (game.gold || 0) + INTELLIGENCE_LEAD_GOLD;
    toast('🕵️ Followed up — ' + (source ? source.flavor : 'a lead followed to its end') + ' (+' + INTELLIGENCE_LEAD_XP + ' Story XP, +' + INTELLIGENCE_LEAD_GOLD + 'g)', 3800);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.followUpIntelligenceLead = followUpIntelligenceLead;

  const oldSyncArc1ForIntelligence = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForIntelligence) oldSyncArc1ForIntelligence();
    checkIntelligenceLeadGeneration();
  };

  function renderFairTideIntelligencePanel(){
    if (!intelligenceUnlocked()) return '';
    const leads = intelligenceLeads();
    let html = '<div class="panel-title" style="margin-top:16px;">🕸️ Fair Tide Intelligence</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Not a spy guild — just Fair Tide\'s own Harbour Office, Market, Warden\'s Hall, Route Observatory, research, divination, and field watch, finally talking to each other.</p>';
    if (!leads.length) {
      html += '<article class="quest-item"><span style="font-size:.8rem;opacity:.7;">No active leads right now. Fair Tide\'s systems keep watching regardless.</span></article>';
    }
    leads.forEach(function(lead){
      const source = INTELLIGENCE_SOURCES.find(function(s){ return s.key === lead.sourceKey; }) || { icon:'🕵️', label:'Unknown Source', flavor:'Something worth a closer look.' };
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">'+source.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(source.label)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(source.flavor)+'</span>'+
        '</div>'+
        '<button class="btn btn-small" onclick="followUpIntelligenceLead('+lead.id+')">🔎 Follow Up</button>'+
        '</div></article>';
    });
    return html;
  }
  window.renderFairTideIntelligencePanel = renderFairTideIntelligencePanel;

  const oldRenderArchiveScreenForIntelligence = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForIntelligence) oldRenderArchiveScreenForIntelligence();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('fairTideIntelligencePanelWrap');
    if (existing) existing.remove();
    const panel = renderFairTideIntelligencePanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="fairTideIntelligencePanelWrap">'+panel+'</div>');
  };
})();
