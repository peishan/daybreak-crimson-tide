(function(){
  // -------------------------------------------------------------------
  // ARC XXX MECHANICS — the gameplay Ch.11, 18, 20-22, and 23-24's own
  // notes call for. Deliberately kept OUT of arc30.js itself, same
  // split used since Arc XXIII.
  //
  // Four systems, every one of them purely additive on top of earlier
  // arcs' own exports rather than editing those files directly:
  //
  //   1. N's FINAL STATUS — extends the SAME resident record Arc XXVIII
  //      created (game.fairTideResidents.n), adding new fields Arc
  //      XXVIII's own rendering never reads (so nothing there breaks),
  //      and rendering its own separate "N — Case Closed" panel rather
  //      than touching arc28-mechanics.js's renderResidentCard/
  //      renderFairTideResidentsPanel. Her fate stays exactly as
  //      unresolved as the outline insists -- nothing here invents a
  //      confirmed outcome.
  //
  //   2. COMPROMISED HORIZON ROUTES — a NEW, separate, temporary field
  //      (game.horizonShutdown), distinct from Arc XVIII's own permanent
  //      Route Access classification (world-catalogue.js's routeAccess).
  //      Wraps Arc XXVI's tradeNetworkRegenForCategory() so Horizon
  //      Supplies regen is suppressed while compromised -- the direct
  //      payoff to Arc XXVI's Reserves/Trade Network systems the
  //      outline explicitly asks for.
  //
  //   3. INFORMATION COMPARTMENTALIZATION — a light categorization layer
  //      over Arc XXIV's existing Intelligence sources. This is a
  //      single-player game with no real access-control boundary to
  //      enforce on the player, so this stays a display/flavor system
  //      (matching what N's own betrayal demonstrated: harmless-looking
  //      fragments from different categories, combined) rather than an
  //      invented permission wall nothing else in this codebase has.
  //
  //   4. NAMELESS ALLEGIANCES — a small, generic per-contact registry
  //      (Network/Allegiance/Attitude/Reliability), reusable for future
  //      political/intelligence arcs per the outline's own note. Sairen
  //      and "the Pawn" are its first two entries.
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. N — FINAL STATUS
  // ===========================================================================
  function nRecord(){
    const residents = (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState() : null;
    return residents ? residents.n : null;
  }

  function checkNFinalStatusEvents(){
    const cp = game.comicProgress30;
    if (!cp) return;
    const n = nRecord();
    if (!n) return; // Arc XXVIII's own resident record is the source of truth; nothing to extend if it was never created

    // Ch.11 ("Back to Fair Tide") -- visitor access, tracked as its own
    // field rather than overwriting n.status (which Arc XXVIII's own
    // renderResidentCard() branches on and doesn't know these later
    // values at all).
    if (cp[11] && !n.arc30AccessStage) {
      n.arc30AccessStage = 'visitor';
    }

    // Ch.23 ("The Door Closes") -- San's own exact boundary.
    if (cp[23] && n.arc30AccessStage !== 'revoked' && n.arc30AccessStage !== 'missing') {
      n.arc30AccessStage = 'revoked';
      if (typeof logEvent === 'function') logEvent('🚪 "Not while I can\'t trust you inside it." N\'s Fair Tide access is revoked.', 'bad');
    }

    // Ch.24 ("Missing") -- the final, deliberately unresolved status.
    if (cp[24] && n.arc30AccessStage !== 'missing') {
      n.arc30AccessStage = 'missing';
      n.arc30Fate = 'Unknown';
      n.arc30LastKnownConnection = 'Nameless Society';
      n.arc30CurrentLocation = 'Unknown';
      toast('🌑 N is gone. Her story ends here, unresolved.', 4200);
    }
  }

  const oldSyncArc1ForNFinalStatus = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForNFinalStatus) oldSyncArc1ForNFinalStatus();
    checkNFinalStatusEvents();
  };

  function renderNCaseClosedPanel(){
    const n = nRecord();
    if (!n || !n.arc30AccessStage) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🌑 N — Case Closed</div>';
    const stageLine = {
      visitor: 'Status: Visitor · Fair Tide Access: Ordinary visitor restrictions',
      revoked: 'Status: Access Revoked · Fair Tide Access: None',
      missing: 'Status: Missing · Fair Tide Access: Revoked'
    }[n.arc30AccessStage] || '';
    html += '<article class="quest-item"><span style="font-size:.8rem;opacity:.85;">'+esc(stageLine)+'</span>';
    if (n.arc30AccessStage === 'missing') {
      html += '<br><span style="font-size:.78rem;opacity:.75;">Last Known Connection: '+esc(n.arc30LastKnownConnection||'Unknown')+
        ' · Current Location: '+esc(n.arc30CurrentLocation||'Unknown')+
        ' · Fate: '+esc(n.arc30Fate||'Unknown')+'</span>';
    }
    html += '</article>';
    return html;
  }
  window.renderNCaseClosedPanel = renderNCaseClosedPanel;

  const oldRenderArchiveScreenForNCaseClosed = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForNCaseClosed) oldRenderArchiveScreenForNCaseClosed();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('nCaseClosedPanelWrap');
    if (existing) existing.remove();
    const panel = renderNCaseClosedPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="nCaseClosedPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 2. COMPROMISED HORIZON ROUTES
  // ===========================================================================
  const HORIZON_SHUTDOWN_REGEN_MULTIPLIER = { compromised: 0, secured: 0.5, reopened: 1 };

  function checkHorizonShutdownEvents(){
    const cp = game.comicProgress30;
    if (!cp) return;
    if (cp[20] && !game.horizonShutdown) {
      game.horizonShutdown = { state: 'compromised', startDay: game.day || 0 };
      toast('🔒 ROUTE SUSPENDED — SECURITY EVENT', 4200);
      if (typeof logEvent === 'function') logEvent('🔒 Compromised Horizon routes suspended. Fair Tide\'s Reserves and Trade Network now carry the weight of it.', 'bad');
    }
    if (cp[22] && game.horizonShutdown && game.horizonShutdown.state === 'compromised') {
      game.horizonShutdown.state = 'secured';
      toast('🔒 → ✅ Horizon route SECURED — the operation failed.', 4000);
    }
    if (cp[24] && game.horizonShutdown && game.horizonShutdown.state !== 'reopened') {
      game.horizonShutdown.state = 'reopened';
      toast('🌌 The Horizon Engine comes back online — route REOPENED.', 4000);
    }
  }
  window.horizonShutdownState = function(){ return game.horizonShutdown || null; };

  const oldSyncArc1ForHorizonShutdown = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForHorizonShutdown) oldSyncArc1ForHorizonShutdown();
    checkHorizonShutdownEvents();
  };

  // Purely additive on Arc XXVI's own regen function -- suppresses (or
  // partially restores) ONLY the horizon_supplies category, exactly the
  // payoff the outline asks for. Every other Reserve category, and every
  // other Trade Network category, is completely unaffected.
  const oldTradeNetworkRegenForHorizonShutdown = window.tradeNetworkRegenForCategory;
  window.tradeNetworkRegenForCategory = function(categoryKey){
    const base = oldTradeNetworkRegenForHorizonShutdown ? oldTradeNetworkRegenForHorizonShutdown(categoryKey) : 0;
    if (categoryKey !== 'horizon_supplies' || !game.horizonShutdown) return base;
    const multiplier = HORIZON_SHUTDOWN_REGEN_MULTIPLIER[game.horizonShutdown.state];
    return multiplier === undefined ? base : base * multiplier;
  };

  function renderHorizonShutdownPanel(){
    const shutdown = game.horizonShutdown;
    if (!shutdown) return '';
    const labels = { compromised: '🔒 ROUTE SUSPENDED — SECURITY EVENT', secured: '✅ SECURED — recovering', reopened: '🌌 REOPENED — back to normal' };
    return '<div class="panel-title" style="margin-top:16px;">🔒 Horizon Route Status</div>'+
      '<article class="quest-item"><span style="font-size:.85rem;">'+esc(labels[shutdown.state] || shutdown.state)+'</span></article>';
  }
  window.renderHorizonShutdownPanel = renderHorizonShutdownPanel;

  const oldRenderArchiveScreenForHorizonShutdown = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForHorizonShutdown) oldRenderArchiveScreenForHorizonShutdown();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('horizonShutdownPanelWrap');
    if (existing) existing.remove();
    const panel = renderHorizonShutdownPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="horizonShutdownPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 3. INFORMATION COMPARTMENTALIZATION
  // ===========================================================================
  const INTEL_CATEGORIES = {
    harbour:    'Settlement Security',
    market:     'Trade',
    warden:     'Settlement Security',
    routes:     'Horizon Routes',
    research:   'Protected Worlds',
    divination: 'Intelligence',
    field:      'Expeditions',
    council:    'Settlement Security'
  };
  window.ARC30_INTEL_CATEGORIES = INTEL_CATEGORIES;

  window.intelligenceSourceCategory = function(sourceKey){
    return INTEL_CATEGORIES[sourceKey] || 'Intelligence';
  };

  function compartmentalizationUnlocked(){
    return !!(game.comicProgress30 && game.comicProgress30[18]);
  }
  window.compartmentalizationUnlocked = compartmentalizationUnlocked;

  function renderCompartmentalizationPanel(){
    if (!compartmentalizationUnlocked()) return '';
    const categories = Array.from(new Set(Object.values(INTEL_CATEGORIES)));
    let html = '<div class="panel-title" style="margin-top:16px;">🧩 Information Compartmentalization</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">N assembled valuable intelligence from individually harmless fragments. Knowing one category doesn\'t grant access to another.</p>'+
      '<article class="quest-item"><span style="font-size:.8rem;opacity:.85;">'+categories.map(esc).join(' · ')+'</span></article>';
    return html;
  }
  window.renderCompartmentalizationPanel = renderCompartmentalizationPanel;

  const oldRenderArchiveScreenForCompartmentalization = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForCompartmentalization) oldRenderArchiveScreenForCompartmentalization();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('compartmentalizationPanelWrap');
    if (existing) existing.remove();
    const panel = renderCompartmentalizationPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="compartmentalizationPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 4. NAMELESS ALLEGIANCES — generic, reusable registry.
  // ===========================================================================
  function namelessContactsState(){
    game.namelessContacts = game.namelessContacts || {};
    return game.namelessContacts;
  }
  window.namelessContactsState = namelessContactsState;

  window.registerNamelessContact = function(id, opts){
    const contacts = namelessContactsState();
    if (!contacts[id]) {
      contacts[id] = Object.assign({ network: 'Nameless', allegiance: 'Unknown', attitude: 'Unclear', reliability: 'Unverified' }, opts || {});
    } else if (opts) {
      Object.assign(contacts[id], opts);
    }
    return contacts[id];
  };

  function checkNamelessAllegianceEvents(){
    const cp = game.comicProgress30;
    if (!cp) return;

    // "The Pawn" -- first read at Ch.4, escalated once his actions
    // against Fair Tide are unambiguous (Ch.16-17), and finalized once
    // Ch.22 exposes him as smaller than he appeared. Who stands behind
    // him is deliberately left unset, matching the outline's own
    // unresolved ending.
    if (cp[4]) {
      window.registerNamelessContact('the_pawn', { name: 'Unnamed Contact', attitude: 'Unclear', reliability: 'Unverified' });
    }
    if (cp[16] || cp[17]) {
      window.registerNamelessContact('the_pawn', { attitude: 'Hostile' });
    }
    if (cp[22]) {
      window.registerNamelessContact('the_pawn', { name: 'The Pawn', reliability: 'Unverified', notes: 'Exposed as an intermediary; whoever stands behind him is unidentified.' });
    }

    // Sairen -- cleared of direct involvement in the Ch.20 operation at
    // Ch.21, without contradicting Arc XXIX's own carefully-earned
    // ambiguity (attitude/reliability stay exactly where that arc left
    // them: Unclear/Mixed).
    if (cp[21]) {
      window.registerNamelessContact('sairen', { name: 'Sairen', allegiance: 'Known', attitude: 'Unclear', reliability: 'Mixed', clearedOfHorizonBreach: true });
    }
  }

  const oldSyncArc1ForNamelessAllegiances = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForNamelessAllegiances) oldSyncArc1ForNamelessAllegiances();
    checkNamelessAllegianceEvents();
  };

  function renderNamelessAllegiancesPanel(){
    const contacts = namelessContactsState();
    const ids = Object.keys(contacts);
    if (!ids.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🕸️ Nameless Allegiances</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Not a single faction — two Nameless contacts can have completely different relationships with Fair Tide.</p>';
    ids.forEach(function(id){
      const c = contacts[id];
      html += '<article class="quest-item"><strong>'+esc(c.name || id)+'</strong><br>'+
        '<span style="font-size:.78rem;opacity:.8;">Network: '+esc(c.network)+' · Allegiance: '+esc(c.allegiance)+
        '<br>Attitude toward Fair Tide: '+esc(c.attitude)+' · Reliability: '+esc(c.reliability)+'</span>'+
        (c.notes ? '<div style="font-size:.76rem;opacity:.65;margin-top:4px;font-style:italic;">'+esc(c.notes)+'</div>' : '')+
        '</article>';
    });
    return html;
  }
  window.renderNamelessAllegiancesPanel = renderNamelessAllegiancesPanel;

  const oldRenderArchiveScreenForNamelessAllegiances = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForNamelessAllegiances) oldRenderArchiveScreenForNamelessAllegiances();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('namelessAllegiancesPanelWrap');
    if (existing) existing.remove();
    const panel = renderNamelessAllegiancesPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="namelessAllegiancesPanelWrap">'+panel+'</div>');
  };
})();
