(function(){
  // -------------------------------------------------------------------
  // ARC XXI — THE COUNCIL HALL. First of the twelve Arc XXI buildings
  // to get a real gameplay system, per San's own priority pick — the
  // first building introduced (Ch.3), with the clearest, most
  // self-contained scope and no dependency on any other unbuilt Arc
  // XXI system.
  //
  // Grounded directly in Ch.3-4's own text, not invented from the
  // design doc's generic framing. Ch.3 establishes the Hall's actual
  // scope in its own words: "Settlement decisions. Community concerns.
  // Trade disputes. Construction. Policy." Ch.4 gives two concrete,
  // specific tensions rather than a vague "settlement decisions"
  // gesture — "A merchant wants something the harbour workers don't
  // want" and "A researcher's priorities don't match a family's" — so
  // the two decisions below are built directly from those two lines,
  // not invented scenarios standing in for them. San leads the council
  // per Ch.3 ("nobody's under the illusion that San's stepped back
  // from being captain"), so this stays player-resolved, not
  // automated.
  //
  // Deliberately minimal and extensible rather than a large, invented
  // decision tree: two decisions now, matching exactly what Ch.4's own
  // text describes, with a plain structure (COUNCIL_DECISIONS array)
  // that future chapters can add to the same way RAIDS/ARCHIVE_RECORDS
  // already work elsewhere in this codebase — new decisions are new
  // array entries, not a new system.
  // -------------------------------------------------------------------

  const COUNCIL_DECISIONS = [
    {
      key: 'dock_space_priority',
      icon: '⚓',
      title: 'Dock Space Priority',
      // Ch.4: "A merchant wants something the harbour workers don't want."
      issue: "A merchant wants guaranteed dock space reserved for regular shipments. The harbour workers who'd have to enforce it aren't keen on turning other ships away to hold a berth open on the chance it's needed.",
      options: [
        {
          key: 'merchant',
          label: 'Side with the merchant',
          outcome: "Reserved dock space goes in. Trade through Fair Tide gets a little steadier — and the harbour workers get a little more to manage for it.",
          gold: 80
        },
        {
          key: 'harbour',
          label: 'Side with the harbour workers',
          outcome: "No reserved berths. Docking stays first-come, first-served, and the harbour workers keep the flexibility they asked for — at the cost of one merchant's patience.",
          xp: 60
        }
      ]
    },
    {
      key: 'research_or_housing',
      icon: '🏠',
      title: 'Research Space or Family Housing',
      // Ch.4: "A researcher's priorities don't match a family's."
      issue: "A researcher wants a quiet building near the harbour set aside for controlled work. A family wants the very same space for housing.",
      options: [
        {
          key: 'researcher',
          label: 'Give it to the researcher',
          outcome: "The space becomes a research annex. Useful work gets done there — and one family keeps looking for somewhere else to settle.",
          xp: 80
        },
        {
          key: 'family',
          label: 'Give it to the family',
          outcome: "The space becomes a home. One more family has somewhere to actually live at Fair Tide — and the research waits a while longer for a building of its own.",
          gold: 60
        }
      ]
    }
  ];
  window.ARC21_COUNCIL_DECISIONS = COUNCIL_DECISIONS;

  function councilHallUnlocked(){
    return !!(game.comicProgress21 && game.comicProgress21[3]);
  }
  window.councilHallUnlocked = councilHallUnlocked;

  function councilDecisionResolved(key){
    return !!(game.councilDecisions && game.councilDecisions[key]);
  }
  window.councilDecisionResolved = councilDecisionResolved;

  function resolveCouncilDecision(decisionKey, optionKey){
    const decision = COUNCIL_DECISIONS.find(function(d){ return d.key === decisionKey; });
    if (!decision) return;
    if (councilDecisionResolved(decisionKey)) return; // one-time, matching every other settlement decision in this codebase
    const option = decision.options.find(function(o){ return o.key === optionKey; });
    if (!option) return;
    game.councilDecisions = game.councilDecisions || {};
    game.councilDecisions[decisionKey] = optionKey;
    if (option.gold) game.gold = (game.gold || 0) + option.gold;
    if (option.xp) gainXP(option.xp);
    toast('🏛️ ' + decision.title + ': ' + option.label + '.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.resolveCouncilDecision = resolveCouncilDecision;

  function renderCouncilHallPanel(){
    if (!councilHallUnlocked()) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🏛️ Council Hall</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Not a parliament, and San hasn\'t stepped back from being captain — just somewhere Fair Tide\'s actual decisions can finally happen.</p>';
    COUNCIL_DECISIONS.forEach(function(decision){
      const resolved = councilDecisionResolved(decision.key);
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:flex-start;">'+
        '<div style="font-size:1.4rem;">'+decision.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(decision.title)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(decision.issue)+'</span>';
      if (resolved) {
        const chosenKey = game.councilDecisions[decision.key];
        const chosenOption = decision.options.find(function(o){ return o.key === chosenKey; });
        html += '<div style="margin-top:6px;"><span class="story-chip">✓ Decided: '+esc(chosenOption.label)+'</span></div>'+
          '<div style="margin-top:4px;font-size:.78rem;opacity:.7;font-style:italic;">'+esc(chosenOption.outcome)+'</div>';
      } else {
        html += '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">';
        decision.options.forEach(function(option){
          html += '<button class="btn btn-small" onclick="resolveCouncilDecision(\''+decision.key+'\',\''+option.key+'\')">'+esc(option.label)+'</button>';
        });
        html += '</div>';
      }
      html += '</div></div></article>';
    });
    return html;
  }
  window.renderCouncilHallPanel = renderCouncilHallPanel;

  const oldRenderArchiveScreenForCouncilHall = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForCouncilHall) oldRenderArchiveScreenForCouncilHall();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('councilHallPanelWrap');
    if (existing) existing.remove();
    const panel = renderCouncilHallPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="councilHallPanelWrap">'+panel+'</div>');
  };
})();
