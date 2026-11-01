(function(){
  // -------------------------------------------------------------------
  // ARC XLII MECHANICS (Ch.6-10, extended by Ch.19) — THE FRONTIER FIGHT
  // and the BLACK PEARL INVESTIGATION, the gameplay Ch.8/9's own notes
  // call for. Kept OUT of arc42.js itself, same split used since Arc
  // XXIII. Ch.19 ("A Question of Trust") adds one more append-only entry
  // to the same investigation log, nothing more.
  //
  //   1. FRONTIER FIGHT — Ch.8's "minor disturbance," deliberately
  //      smaller than Arc XXXVIII's Archive Guardians per the chapter's
  //      own framing ("a little adventure," "without introducing
  //      another major villain"). Same one-off-story-fight pattern as
  //      every prior example (scaleCrimsonEnemy(def, 'guardian',
  //      pinnedLevel) + startCombat, pinned to this arc's own gate
  //      level (630) rather than the player's current level), under its
  //      own kind ('arc42_frontier') so core-engine.js's post-battle
  //      branch can route back to Fair Tide's port the same way Arc IX's
  //      Ch.12 and the Memory Archive fights already do (no dedicated
  //      "Lunareth screen" exists to return to -- the expedition itself
  //      is handled through the existing Inter-World Expeditions UI, not
  //      a bespoke location screen, so "Return to Port" is the correct,
  //      already-established exit here).
  //
  //   2. BLACK PEARL INVESTIGATION — a minimal, append-only log,
  //      deliberately shaped like Arc XXXVI/XXXVII's own Maera Lived
  //      Knowledge pattern (a small array, a short classification per
  //      entry) rather than inventing a new tracker shape. Per the
  //      outline's explicit restraint ("do not invent new Black Pearl
  //      properties or conclusions"), this only ever logs that the
  //      investigation has started and that Fair Tide's researchers are
  //      aware of it -- no artifact effects, no properties, nothing the
  //      crossover planning doc itself reserved for later chapters.
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. FRONTIER FIGHT
  // ===========================================================================
  const ARC42_FRONTIER_LEVEL = 630;
  const ARC42_FRONTIER_ENEMY = {
    name: 'Something Restless at the Frontier', icon: '🐺', hp: 1200, dmg: 45, xp: 620, gold: 320,
    desc: "Territorial, not malicious -- the kind of trouble a frontier always has a little of. Nothing Lunareth's own heaviest hitters would bother clearing their schedule for, but real enough to actually test how two crews fight side by side."
  };

  window.startArc42FrontierBattle = function(){
    if (game.comicProgress42?.[8]) { toast('✓ Already complete.'); return; }
    if (window.arc42ObjectiveState() !== 'complete_arc42_chapter_8') { toast('🔒 Follow the current Objective first.'); return; }
    const enemy = scaleCrimsonEnemy(ARC42_FRONTIER_ENEMY, 'guardian', ARC42_FRONTIER_LEVEL);
    startCombat({ kind: 'arc42_frontier', key: 'arc42_frontier', enemy: enemy });
  };

  // ===========================================================================
  // 2. BLACK PEARL INVESTIGATION
  // ===========================================================================
  function blackPearlInvestigationState(){
    if (!game.blackPearlInvestigation) game.blackPearlInvestigation = { started: false, log: [] };
    return game.blackPearlInvestigation;
  }
  window.blackPearlInvestigationState = blackPearlInvestigationState;

  function renderBlackPearlPanel(){
    const state = blackPearlInvestigationState();
    if (!state.started) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🖤 The Black Pearl</div>';
    state.log.forEach(function(entry){
      html += '<article class="quest-item"><span style="font-size:.8rem;opacity:.85;">'+esc(entry.text)+'</span></article>';
    });
    return html;
  }
  window.renderBlackPearlPanel = renderBlackPearlPanel;

  const oldRenderArchiveScreenForArc42 = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForArc42) oldRenderArchiveScreenForArc42();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('blackPearlPanelWrap');
    if (existing) existing.remove();
    const panel = renderBlackPearlPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="blackPearlPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // Sync hook — chains on top of every earlier arc's own wrap (same
  // pattern used since Arc XXIII).
  // ===========================================================================
  const oldSyncArc1ForArc42 = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForArc42) oldSyncArc1ForArc42();
    const cp = game.comicProgress42;
    if (!cp) return;
    const state = blackPearlInvestigationState();
    if (cp[9] && !state.started) {
      state.started = true;
      state.log.push({ id: 'started', text: "Jade and Devon raised it quietly: Xima's curse is broken, but the Pearl itself is still an open question. Fair Tide's researchers now know it exists." });
    }
    if (cp[10] && !state.log.some(function(e){ return e.id === 'collaboration_open'; })) {
      state.log.push({ id: 'collaboration_open', text: 'San has offered Fair Tide\'s research capabilities -- the Horizon Engine included -- to whoever on Lunareth wants a second set of eyes on it. Nothing formal yet.' });
    }
    if (cp[13] && !state.log.some(function(e){ return e.id === 'arcane_trio_preliminary'; })) {
      state.log.push({ id: 'arcane_trio_preliminary', text: "Renn, Erynn and Mimi have run a first pass against what Jade and Devon actually know. Its nature is still genuinely uncertain -- whatever comes next needs information only Lunareth itself has." });
    }
    if (cp[19] && !state.log.some(function(e){ return e.id === 'joint_investigation_agreed'; })) {
      state.log.push({ id: 'joint_investigation_agreed', text: "Another lead, no clearer answers. Jade, Devon and San have agreed on one rule going forward: investigate together, and don't assume anything about the Pearl's nature until the evidence actually says so." });
    }

    // The cooling spring (Ch.15): teased, not built. No destination
    // screen exists for it yet -- per the outline's own framing
    // ("agree to see it during a future stay"), this is deliberately
    // just a flag for a later chapter block to actually pay off, same
    // restraint as the Black Pearl's own properties.
    if (cp[15] && !game.fairTideCoolingSpringTeased) {
      game.fairTideCoolingSpringTeased = true;
    }

    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };
})();
