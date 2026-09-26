(function(){
  // -------------------------------------------------------------------
  // ARC XVIII — FACTION PERSPECTIVES + AGREEMENTS. Per the design doc's
  // items 8 and 4, built strictly from what the real chapters establish
  // rather than the doc's own generic examples wherever the real text
  // gives something more specific.
  //
  // Four factions, confirmed directly from Ch.3-8 (not invented from the
  // doc's placeholder list): Merchants (Ch.3-5's funding offer, Ch.6),
  // Scholars (Ch.6-7's cooperation offer), Veyren Authorities (Ch.6,
  // Ch.8's direct question), and Fair Tide itself. Per the doc's own
  // instruction — "no traditional reputation bar... factions have
  // positions" — these are qualitative wants/concerns, not numeric
  // meters.
  //
  // Ch.17 ("Not Everyone Agrees") confirms the factions genuinely split
  // on accepting the Charter — "some accept it... others don't bother
  // pretending to" — but the text never names which faction lands where.
  // Rather than invent that breakdown, faction reaction stays "Mixed —
  // still settling" once Ch.17 is reached, honestly reflecting what the
  // story actually says instead of assigning specifics it doesn't.
  //
  // One concrete Agreement exists here, matching what's actually in the
  // story: Ch.19's "Cooperative Access" — not one faction in control,
  // not Fair Tide holding every door alone, but distributed
  // contributions (knowledge/supplies/navigation/protection/medical/
  // cultural liaison) with nobody owning the routes. No other
  // hypothetical agreements invented beyond what Ch.19 actually
  // describes.
  // -------------------------------------------------------------------

  const FACTIONS = [
    {
      key: 'merchants',
      name: 'Merchant Organizations',
      icon: '💰',
      wants: 'Trade access — controlled routes, preferential materials, first pick of discoveries.',
      concern: "Fair Tide's unpredictability. A crew that won't commit to an exclusive arrangement is hard to plan a business around."
    },
    {
      key: 'scholars',
      name: 'Scholarly Institutions',
      icon: '📚',
      wants: 'Research access — permission to study the Archive and the routes themselves, not ownership of either.',
      concern: 'Restricted information. Knowledge they believe should be shared stays gated behind Fair Tide\'s own judgment calls.'
    },
    {
      key: 'veyren_authorities',
      name: 'Veyren Authorities',
      icon: '🏛️',
      wants: 'Security and oversight — assurance that inter-world access stays controlled, accountable, and (eventually) regulated.',
      concern: 'Uncontrolled inter-world travel. A technology this consequential, resting entirely on one independent crew\'s judgment, unsettles them.'
    },
    {
      key: 'fair_tide',
      name: 'Fair Tide',
      icon: '⚓',
      wants: 'Freedom to keep exploring responsibly, on their own terms — without becoming beholden to any single outside interest.',
      concern: 'Becoming what they\'ve been careful not to be. Every offer they\'ve turned down this arc was, in its own way, a step toward controlling something that was never theirs to control.'
    }
  ];
  window.ARC18_FACTIONS = FACTIONS;

  function factionsDiscovered(){
    return !!(game.comicProgress18 && game.comicProgress18[6]); // Ch.6: "More Than One Interested Party"
  }
  window.arc18FactionsDiscovered = factionsDiscovered;

  function charterReactionStage(){
    game.comicProgress18 = game.comicProgress18 || {};
    if (game.comicProgress18[19]) return 'agreement'; // the First Agreement resolves the split
    if (game.comicProgress18[17]) return 'split';      // "Not Everyone Agrees"
    return 'none';
  }
  window.arc18CharterReactionStage = charterReactionStage;

  const AGREEMENTS = [
    {
      key: 'cooperative_access',
      name: 'Cooperative Access',
      icon: '🤝',
      atChapter: 19,
      description: "Not one faction in control. Not Fair Tide alone, holding every door shut and deciding everything by itself.",
      contributions: [
        { icon: '📚', label: 'Knowledge', from: 'the scholars' },
        { icon: '📦', label: 'Supplies', from: 'the merchants' },
        { icon: '🧭', label: 'Navigation', from: "whoever's actually mapped the routes" },
        { icon: '🛡️', label: 'Protection', from: 'those equipped to give it' },
        { icon: '🩺', label: 'Medical assistance', from: 'those equipped to give it' },
        { icon: '🗣️', label: 'Cultural liaison', from: 'those equipped to give it' }
      ],
      resolution: "Nobody gets the routes. Everybody gets a role."
    }
  ];
  window.ARC18_AGREEMENTS = AGREEMENTS;

  function agreementsState(){
    game.comicProgress18 = game.comicProgress18 || {};
    return AGREEMENTS.filter(function(a){ return !!game.comicProgress18[a.atChapter]; });
  }
  window.arc18AgreementsState = agreementsState;

  function renderFactionsPanel(){
    if (!factionsDiscovered()) return '';
    const reactionStage = charterReactionStage();
    let html = '<div class="panel-title" style="margin-top:16px;">🌐 Interested Parties</div>';

    FACTIONS.forEach(function(f){
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:flex-start;">'+
        '<div style="font-size:1.4rem;">'+f.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(f.name)+'</strong><br>'+
        '<span style="font-size:.72rem;opacity:.55;">WANTS:</span> <span style="font-size:.8rem;opacity:.85;">'+esc(f.wants)+'</span><br>'+
        '<span style="font-size:.72rem;opacity:.55;">CONCERN:</span> <span style="font-size:.8rem;opacity:.85;">'+esc(f.concern)+'</span>';
      if (f.key !== 'fair_tide') {
        if (reactionStage === 'agreement') {
          html += '<br><span class="story-chip" style="background:rgba(232,197,71,.22);margin-top:4px;display:inline-block;">🤝 Part of the Cooperative Access agreement</span>';
        } else if (reactionStage === 'split') {
          html += '<br><span class="story-chip" style="background:rgba(255,255,255,.08);margin-top:4px;display:inline-block;">Mixed — still settling on the Charter</span>';
        }
      }
      html += '</div></div></article>';
    });
    return html;
  }
  window.renderFactionsPanel = renderFactionsPanel;

  function renderAgreementsPanel(){
    const active = agreementsState();
    if (!active.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🤝 Agreements</div>';
    active.forEach(function(a){
      html += '<article class="quest-item" style="border-color:rgba(232,197,71,.5);"><strong>'+a.icon+' '+esc(a.name)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(a.description)+'</span>'+
        '<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px;">';
      a.contributions.forEach(function(c){
        html += '<span class="story-chip" style="font-size:.7rem;">'+c.icon+' '+esc(c.label)+'</span>';
      });
      html += '</div><div style="margin-top:6px;font-size:.78rem;opacity:.7;font-style:italic;">'+esc(a.resolution)+'</div>'+
        '</article>';
    });
    return html;
  }
  window.renderAgreementsPanel = renderAgreementsPanel;

  const oldRenderArchiveScreenForFactions = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForFactions) oldRenderArchiveScreenForFactions();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    // Same accumulation-safe pattern as every other panel here —
    // separate wraps for each panel so either can independently update
    // without disturbing the other.
    const existingFactions = document.getElementById('arc18FactionsPanelWrap');
    if (existingFactions) existingFactions.remove();
    const factionsPanel = renderFactionsPanel();
    if (factionsPanel) container.insertAdjacentHTML('beforeend', '<div id="arc18FactionsPanelWrap">'+factionsPanel+'</div>');

    const existingAgreements = document.getElementById('arc18AgreementsPanelWrap');
    if (existingAgreements) existingAgreements.remove();
    const agreementsPanel = renderAgreementsPanel();
    if (agreementsPanel) container.insertAdjacentHTML('beforeend', '<div id="arc18AgreementsPanelWrap">'+agreementsPanel+'</div>');
  };
})();
