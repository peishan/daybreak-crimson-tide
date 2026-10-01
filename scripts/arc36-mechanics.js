(function(){
  // -------------------------------------------------------------------
  // ARC XXXVI MECHANICS — VEYREN GROWTH, the gameplay Ch.5-6, 8-10, 14,
  // and 19's own notes call for. Kept OUT of arc36.js itself, same
  // split used since Arc XXIII.
  //
  // Expands Arc XXXV's own Family Life system rather than adding an
  // unrelated one, per the outline's explicit instruction. Extends the
  // SAME game.fairTideChildren.vaeren/joelle records Arc XXXV created
  // with new fields Arc XXXV's own renderFairTideChildrenPanel never
  // reads (so nothing there breaks), rendering a separate "🌱 Veyren
  // Growth" panel of its own rather than touching that function
  // directly -- same additive pattern Arc XXX used extending Arc
  // XXVIII's resident record.
  //
  //   1. GROWTH MILESTONES — a shared, accumulating, permanent list
  //      (never a stat bonus), tracking the three separate concepts the
  //      outline calls out by name: Chronological Age, Developmental
  //      Stage, and Growth Cycle. These are deliberately kept as three
  //      separate string fields, never collapsed into one number, so
  //      a later arc can let them diverge (per Ch.23's own point)
  //      without this file ever needing to change.
  //
  //   2. TWIN RESONANCE + SOEL GUARDIAN — both land at Ch.10 ("Three-
  //      Way Resonance"). Soel Guardian is framed as an UPGRADE of Arc
  //      XXXV's own Soel Watch, so rather than duplicating that status
  //      line in a second place, this re-skins it in place -- the exact
  //      same technique arc21-medical-house.js used relabeling the
  //      Clinic tab once Medical House unlocked -- swapping its text
  //      only once game.soelGuardianUnlocked is true, never touching
  //      arc35-mechanics.js itself.
  //
  //   3. MAERA'S LIVED KNOWLEDGE — a small, permanent, accumulating
  //      classification log (Ch.6, 11, 19), explicitly NOT replacing
  //      Renn's research, Erynn's history, or Mimi's divination --
  //      Maera's own contribution is lived experience, nothing more.
  //
  //   4. TWIN TROUBLE — a tiny, capped, opt-in-to-resolve AFK event
  //      pool, unlocked once the twins are actually mobile (Ch.15).
  //      Deliberately minor: flavor text plus a small gold trickle,
  //      never combat XP, never touching any bond track's own daily
  //      cap.
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. GROWTH MILESTONES
  // ===========================================================================
  function growthMilestonesState(){
    if (!game.growthMilestones) game.growthMilestones = [];
    return game.growthMilestones;
  }
  window.growthMilestonesState = growthMilestonesState;

  function addGrowthMilestone(id, label, icon){
    const list = growthMilestonesState();
    if (list.some(function(m){ return m.id === id; })) return; // idempotent, same pattern as every other accumulating list since Arc XXX
    list.push({ id: id, label: label, icon: icon, day: game.day || 0 });
  }

  // Extends the SAME child record Arc XXXV's registerChild() created --
  // never reassigns developmentStage/expeditionAccess, which Arc XXXV's
  // own renderFairTideChildrenPanel still reads as-is (stays 'Infancy'/
  // locked there, exactly as that arc's own outline required).
  function ensureGrowthFields(key){
    const child = (typeof window.childRecord === 'function') ? window.childRecord(key) : null;
    if (!child) return null;
    if (!child.chronologicalAge) child.chronologicalAge = 'Newborn';
    if (!child.growthDevelopmentalStage) child.growthDevelopmentalStage = 'Newborn';
    if (!child.growthCycleStage) child.growthCycleStage = 0;
    return child;
  }

  function growthUnlocked(){
    return !!(typeof window.fairTideChildrenUnlocked === 'function' && window.fairTideChildrenUnlocked() && game.comicProgress36);
  }
  window.growthUnlocked = growthUnlocked;

  function renderGrowthMilestonesPanel(){
    if (!growthUnlocked()) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🌱 Veyren Growth</div>';
    ['vaeren', 'joelle'].forEach(function(key){
      const child = ensureGrowthFields(key);
      if (!child) return;
      html += '<article class="quest-item"><strong>'+esc(child.icon)+' '+esc(child.name)+'</strong><br>'+
        '<span style="font-size:.78rem;opacity:.75;">Chronological Age: '+esc(child.chronologicalAge)+' &middot; Developmental Stage: '+esc(child.growthDevelopmentalStage)+' &middot; Growth Cycle: Stage '+child.growthCycleStage+'</span></article>';
    });
    const milestones = growthMilestonesState();
    if (milestones.length) {
      html += '<div class="panel-title" style="margin-top:12px;font-size:.9rem;">Growth Milestones</div>';
      milestones.forEach(function(m){
        html += '<article class="quest-item">'+esc(m.icon)+' '+esc(m.label)+'</article>';
      });
    }
    return html;
  }
  window.renderGrowthMilestonesPanel = renderGrowthMilestonesPanel;

  // ===========================================================================
  // 2. TWIN RESONANCE + SOEL GUARDIAN
  // ===========================================================================
  function twinResonanceState(){
    if (!game.twinResonance) game.twinResonance = { stage: 0 };
    return game.twinResonance;
  }
  window.twinResonanceState = twinResonanceState;

  // ===========================================================================
  // 3. MAERA'S LIVED KNOWLEDGE
  // ===========================================================================
  const MAERA_LIVED_KNOWLEDGE_CHAPTERS = {
    6:  { topic: 'Growth Sleep',    classification: 'Normal Veyren trait — but this degree of growth may be unique to Vaeren and Joelle.' },
    11: { topic: 'Twin Behaviors',  classification: 'Mostly ordinary for Veyren babies. Mostly.' },
    19: { topic: 'The Water',       classification: "Partly normal for Veyren-born children encountering the sea — partly something Maera has never personally seen before." }
  };
  window.ARC36_MAERA_LIVED_KNOWLEDGE_CHAPTERS = MAERA_LIVED_KNOWLEDGE_CHAPTERS;

  function maeraLivedKnowledgeState(){
    if (!game.maeraLivedKnowledge) game.maeraLivedKnowledge = [];
    return game.maeraLivedKnowledge;
  }
  window.maeraLivedKnowledgeState = maeraLivedKnowledgeState;

  function maeraLivedKnowledgeUnlocked(){
    return !!(game.comicProgress36 && game.comicProgress36[6]);
  }
  window.maeraLivedKnowledgeUnlocked = maeraLivedKnowledgeUnlocked;

  function renderMaeraLivedKnowledgePanel(){
    if (!maeraLivedKnowledgeUnlocked()) return '';
    const entries = maeraLivedKnowledgeState();
    if (!entries.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🌿 Lived Knowledge — Maera</div>';
    entries.forEach(function(entry){
      html += '<article class="quest-item"><strong>'+esc(entry.topic)+'</strong><br>'+
        '<span style="font-size:.78rem;opacity:.75;">'+esc(entry.classification)+'</span></article>';
    });
    return html;
  }
  window.renderMaeraLivedKnowledgePanel = renderMaeraLivedKnowledgePanel;

  // ===========================================================================
  // 4. TWIN TROUBLE — tiny, capped, minor AFK flavor events.
  // ===========================================================================
  const TWIN_TROUBLE_EVENTS = [
    { id:'soel_blanket', icon:'🐈', text:"Vaeren hid Soel's favorite spot under a blanket. Soel is unimpressed.", gold:5 },
    { id:'joelle_giggle', icon:'😇', text:'Joelle laughed at nothing in particular for several minutes. Nobody knows why. Everyone is charmed anyway.', gold:5 },
    { id:'both_escape', icon:'🌊', text:'Both twins were found three rooms away from where they were left. Soel was with them.', gold:5 },
    { id:'mystery_mess', icon:'🧺', text:'Something got spilled. Nobody confesses. Soel looks suspiciously clean.', gold:5 }
  ];
  window.ARC36_TWIN_TROUBLE_EVENTS = TWIN_TROUBLE_EVENTS;

  const TWIN_TROUBLE_CHANCE = 0.3;
  const MAX_TWIN_TROUBLE_LOG = 20;

  function twinTroubleState(){
    if (!game.twinTrouble) game.twinTrouble = { pending: null, log: [], lastCheckDay: null };
    return game.twinTrouble;
  }
  window.twinTroubleState = twinTroubleState;

  function twinTroubleUnlocked(){
    return !!(game.comicProgress36 && game.comicProgress36[15]);
  }
  window.twinTroubleUnlocked = twinTroubleUnlocked;

  function checkTwinTroubleEvents(){
    if (!twinTroubleUnlocked()) return;
    const state = twinTroubleState();
    const today = game.day || 0;
    if (state.lastCheckDay === today) return; // once per new day, never per render/click
    state.lastCheckDay = today;
    if (state.pending) return; // at most one pending event at a time
    if (Math.random() < TWIN_TROUBLE_CHANCE) {
      const pick = TWIN_TROUBLE_EVENTS[Math.floor(Math.random() * TWIN_TROUBLE_EVENTS.length)];
      state.pending = { id: pick.id, icon: pick.icon, text: pick.text, gold: pick.gold };
    }
  }

  window.claimTwinTrouble = function(){
    const state = twinTroubleState();
    if (!state.pending) return;
    const resolved = state.pending;
    game.gold = (game.gold || 0) + resolved.gold;
    state.log.push({ id: resolved.id, text: resolved.text, day: game.day || 0 });
    if (state.log.length > MAX_TWIN_TROUBLE_LOG) state.log.splice(0, state.log.length - MAX_TWIN_TROUBLE_LOG);
    state.pending = null;
    toast(resolved.icon + ' ' + resolved.text + ' (+' + resolved.gold + ' gold)', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  function renderTwinTroublePanel(){
    if (!twinTroubleUnlocked()) return '';
    const state = twinTroubleState();
    let html = '<div class="panel-title" style="margin-top:16px;">😇😇🐈 Twin Trouble</div>';
    if (state.pending) {
      html += '<article class="quest-item">'+esc(state.pending.icon)+' '+esc(state.pending.text)+'<br>'+
        '<div style="margin-top:6px;"><button class="btn btn-small btn-success" onclick="claimTwinTrouble()">Resolve It</button></div></article>';
    } else {
      html += '<article class="quest-item"><span style="font-size:.78rem;opacity:.7;">Nothing right now. Give it time.</span></article>';
    }
    if (state.log.length) {
      html += '<div style="font-size:.74rem;opacity:.7;margin-top:10px;">Recent Codex Observations</div>';
      html += '<div style="font-size:.72rem;opacity:.65;line-height:1.6;">';
      state.log.slice(-6).reverse().forEach(function(entry){
        html += esc(entry.text) + ' <span style="opacity:.6;">(Day '+entry.day+')</span><br>';
      });
      html += '</div>';
    }
    return html;
  }
  window.renderTwinTroublePanel = renderTwinTroublePanel;

  // ===========================================================================
  // Sync hook — chains on top of every earlier arc's own wrap (same
  // pattern used since Arc XXIII), progressing growth fields and
  // milestones, confirming Twin Resonance/Soel Guardian, logging
  // Maera's lived-knowledge entries, and rolling for Twin Trouble.
  // ===========================================================================
  const oldSyncArc1ForVeyrenGrowth = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForVeyrenGrowth) oldSyncArc1ForVeyrenGrowth();
    const cp = game.comicProgress36;
    if (!cp) return;

    if (cp[1]) {
      const vaeren = ensureGrowthFields('vaeren');
      const joelle = ensureGrowthFields('joelle');
      if (vaeren) vaeren.chronologicalAge = 'Infant';
      if (joelle) joelle.chronologicalAge = 'Infant';
    }

    if (cp[5] || cp[6]) {
      ['vaeren', 'joelle'].forEach(function(key){
        const child = ensureGrowthFields(key);
        if (child) {
          child.growthDevelopmentalStage = 'Growing Infant';
          child.growthCycleStage = Math.max(child.growthCycleStage, 1);
        }
      });
      addGrowthMilestone('growth_cycle_1', 'Growth Cycle — Stage I', '🌱');
    }

    if (cp[7]) addGrowthMilestone('paired_recognition', 'Paired Recognition', '💞');

    if (cp[10]) {
      const resonance = twinResonanceState();
      if (resonance.stage < 1) {
        resonance.stage = 1;
        toast('💞 Twin Resonance — Stage I confirmed.', 3200);
      }
      addGrowthMilestone('twin_resonance_1', 'Twin Resonance — Stage I', '💞');
      if (!game.soelGuardianUnlocked) {
        game.soelGuardianUnlocked = true;
        toast('🐈 Soel Guardian — he can help regulate their magic, not just detect it.', 3600);
      }
      addGrowthMilestone('soel_guardian', 'Soel Bond — Guardian', '🐈');
    }

    if (cp[14]) {
      ['vaeren', 'joelle'].forEach(function(key){
        const child = ensureGrowthFields(key);
        if (child) child.growthDevelopmentalStage = 'Mobile Infant';
        addGrowthMilestone(key + '_mobility', (key === 'vaeren' ? 'Vaeren' : 'Joelle') + ' — Mobility Unlocked', key === 'vaeren' ? '👦' : '👧');
      });
    }

    if (cp[18]) addGrowthMilestone('family_recognition', 'Family Recognition Expanded', '🌌');

    if (cp[23]) {
      ['vaeren', 'joelle'].forEach(function(key){
        const child = ensureGrowthFields(key);
        if (child) {
          child.growthDevelopmentalStage = 'Rapidly Developing';
          child.growthCycleStage = Math.max(child.growthCycleStage, 2);
        }
      });
      addGrowthMilestone('growth_cycle_2', 'Growth Cycle — Stage II', '🌱');
    }

    const knowledge = maeraLivedKnowledgeState();
    Object.keys(MAERA_LIVED_KNOWLEDGE_CHAPTERS).forEach(function(chId){
      const already = knowledge.some(function(k){ return k.chapterId === Number(chId); });
      if (cp[chId] && !already) {
        const entry = MAERA_LIVED_KNOWLEDGE_CHAPTERS[chId];
        knowledge.push({ chapterId: Number(chId), topic: entry.topic, classification: entry.classification, day: game.day || 0 });
      }
    });

    checkTwinTroubleEvents();

    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  // ===========================================================================
  // Re-skin Soel Watch -> Soel Guardian, once unlocked. Same technique
  // as arc21-medical-house.js relabeling the Clinic tab once Medical
  // House unlocked -- a targeted text swap on the base panel's own
  // output, never editing arc35-mechanics.js directly.
  // ===========================================================================
  const oldRenderFairTideChildrenPanelForGuardian = window.renderFairTideChildrenPanel;
  window.renderFairTideChildrenPanel = function(){
    let html = oldRenderFairTideChildrenPanelForGuardian ? oldRenderFairTideChildrenPanelForGuardian() : '';
    if (game.soelGuardianUnlocked && html.indexOf('🐈 Soel Watch') !== -1) {
      html = html.replace('🐈 Soel Watch', '🐈 Soel Guardian');
      html = html.replace(
        'Soel detects unusual spiritual changes in the twins and helps stabilize their emerging abilities.',
        'Soel automatically stabilizes some Twin Resonance events and occasionally prevents family incidents caused by their emerging abilities.'
      );
    }
    return html;
  };

  // ===========================================================================
  // Archive screen wiring — three panels under their own wrappers, same
  // insert-and-replace pattern used since Arc XXIII.
  // ===========================================================================
  const oldRenderArchiveScreenForVeyrenGrowth = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForVeyrenGrowth) oldRenderArchiveScreenForVeyrenGrowth();
    const container = document.getElementById('archiveContent');
    if (!container) return;

    const existingGrowth = document.getElementById('growthMilestonesPanelWrap');
    if (existingGrowth) existingGrowth.remove();
    const growthPanel = renderGrowthMilestonesPanel();
    if (growthPanel) container.insertAdjacentHTML('beforeend', '<div id="growthMilestonesPanelWrap">'+growthPanel+'</div>');

    const existingMaera = document.getElementById('maeraLivedKnowledgePanelWrap');
    if (existingMaera) existingMaera.remove();
    const maeraPanel = renderMaeraLivedKnowledgePanel();
    if (maeraPanel) container.insertAdjacentHTML('beforeend', '<div id="maeraLivedKnowledgePanelWrap">'+maeraPanel+'</div>');

    const existingTrouble = document.getElementById('twinTroublePanelWrap');
    if (existingTrouble) existingTrouble.remove();
    const troublePanel = renderTwinTroublePanel();
    if (troublePanel) container.insertAdjacentHTML('beforeend', '<div id="twinTroublePanelWrap">'+troublePanel+'</div>');
  };
})();
