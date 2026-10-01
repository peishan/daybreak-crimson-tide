(function(){
  // -------------------------------------------------------------------
  // ARC XXXVII MECHANICS — LIVING HORIZONS, Maera's expanded Veyren
  // Context, Twin Affinity, and Bond Resonance, the gameplay Ch.7-10,
  // 16, 19-21, and 23-24's own notes call for. Kept OUT of arc37.js
  // itself, same split used since Arc XXIII.
  //
  //   1. LIVING HORIZONS — a new Survey Before Crossing pipeline for a
  //      newly discovered Horizon overlap, distinct from the permanent
  //      ROUTE_ACCESS_LEVELS classification in world-catalogue.js
  //      (that governs already-known worlds; this governs the
  //      discovery process for a brand new one). Stages only ever
  //      advance forward (❓ Unidentified → 🔭 Observed → 🧭 Surveyed →
  //      🌌 Expedition Ready), generic enough for a later arc to
  //      register its own survey under the same window.advanceHorizon
  //      SurveyStage API. Per the outline's own explicit restraint,
  //      THIS arc's own chapters never advance the overlap past
  //      'surveyed' — Ch.22 ("No Expedition Yet") and Ch.24's own
  //      closing line keep the door closed. Reaching 'expedition_ready'
  //      is left for whichever later arc actually opens it.
  //
  //   2. MAERA'S EXPANDED VEYREN CONTEXT — new entries pushed into the
  //      SAME shared window.maeraLivedKnowledgeState() array Arc
  //      XXXVI's own Lived Knowledge system already renders, rather
  //      than building a second panel. Keyed with a string id
  //      ('arc37_chN') rather than a bare chapter number specifically
  //      to avoid colliding with Arc XXXVI's own numeric chapterId keys
  //      in that same shared array (both arcs have a "chapter 8", for
  //      instance).
  //
  //   3. TWIN AFFINITY — a small, SEPARATE, self-contained paired-
  //      flavour-event pool, deliberately not just appended onto Arc
  //      XXXVI's own Twin Trouble pool (window.ARC36_TWIN_TROUBLE_
  //      EVENTS): that pool has no per-entry eligibility check at all,
  //      so anything pushed onto it becomes immediately reachable for
  //      any player who unlocked Twin Trouble back in Arc XXXVI, even
  //      one who has never touched Arc XXXVII. Keeping this gated
  //      behind its own twinAffinityState().stage avoids that leak.
  //
  //   4. BOND RESONANCE — a hidden San & Joel stat, bumped only by
  //      story milestones, never player-grindable. Per the outline's
  //      own explicit restraint, this never names or implies Thought
  //      Resonance (locked until Arc XL) — the panel shows only a
  //      vague tier label, never a mechanical bonus or explanation.
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. LIVING HORIZONS
  // ===========================================================================
  const HORIZON_SURVEY_STAGES = ['unidentified', 'observed', 'surveyed', 'expedition_ready'];
  const HORIZON_SURVEY_STAGE_DEFS = {
    unidentified:     { icon:'❓', label:'Unidentified' },
    observed:         { icon:'🔭', label:'Observed' },
    surveyed:         { icon:'🧭', label:'Surveyed' },
    expedition_ready: { icon:'🌌', label:'Expedition Ready' }
  };
  window.HORIZON_SURVEY_STAGE_DEFS = HORIZON_SURVEY_STAGE_DEFS;

  function horizonSurveysState(){
    if (!game.horizonSurveys) game.horizonSurveys = {};
    return game.horizonSurveys;
  }
  window.horizonSurveysState = horizonSurveysState;

  window.registerHorizonSurvey = function(key, label){
    const state = horizonSurveysState();
    if (!state[key]) state[key] = { label: label, stage: 'unidentified', coordinatesRecorded: false };
    return state[key];
  };

  window.advanceHorizonSurveyStage = function(key, newStage){
    const state = horizonSurveysState();
    if (!state[key] || !HORIZON_SURVEY_STAGE_DEFS[newStage]) return;
    const curIdx = HORIZON_SURVEY_STAGES.indexOf(state[key].stage);
    const newIdx = HORIZON_SURVEY_STAGES.indexOf(newStage);
    if (newIdx <= curIdx) return; // forward-only, never regresses, never re-announces the same stage
    state[key].stage = newStage;
    const def = HORIZON_SURVEY_STAGE_DEFS[newStage];
    toast(def.icon + ' ' + state[key].label + ' is now ' + def.label + '.', 3600);
  };

  window.markHorizonSurveyCoordinatesRecorded = function(key){
    const state = horizonSurveysState();
    if (state[key]) state[key].coordinatesRecorded = true;
  };

  function renderLivingHorizonsPanel(){
    const state = horizonSurveysState();
    const keys = Object.keys(state);
    if (!keys.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🌌 Living Horizons</div>';
    keys.forEach(function(key){
      const survey = state[key];
      const def = HORIZON_SURVEY_STAGE_DEFS[survey.stage];
      html += '<article class="quest-item"><strong>'+esc(survey.label)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+def.icon+' '+esc(def.label)+'</span>'+
        (survey.coordinatesRecorded ? '<br><span style="font-size:.74rem;opacity:.6;">Coordinates recorded.</span>' : '')+
        '</article>';
    });
    return html;
  }
  window.renderLivingHorizonsPanel = renderLivingHorizonsPanel;

  // ===========================================================================
  // 2. MAERA'S EXPANDED VEYREN CONTEXT — pushes into the SAME shared
  // array Arc XXXVI's own renderMaeraLivedKnowledgePanel() reads.
  // ===========================================================================
  const MAERA_CONTEXT_ARC37_CHAPTERS = {
    8:  { topic:'The Disturbance', classification:"Genuinely unprecedented — nothing in Veyren's old stories quite matches this." },
    11: { topic:'Old Stories',     classification:"Folklore — dismissed for generations, but Renn isn't dismissing it anymore." },
    21: { topic:'Not Veyren',      classification:"Confirmed unprecedented — whatever this is, it isn't another part of Veyren at all." }
  };
  window.ARC37_MAERA_CONTEXT_CHAPTERS = MAERA_CONTEXT_ARC37_CHAPTERS;

  function checkMaeraContextArc37(){
    const cp = game.comicProgress37;
    if (!cp) return;
    const list = (typeof window.maeraLivedKnowledgeState === 'function')
      ? window.maeraLivedKnowledgeState()
      : (game.maeraLivedKnowledge = game.maeraLivedKnowledge || []);
    Object.keys(MAERA_CONTEXT_ARC37_CHAPTERS).forEach(function(chId){
      const dedupeId = 'arc37_ch' + chId;
      const already = list.some(function(entry){ return entry.chapterId === dedupeId; });
      if (cp[chId] && !already) {
        const entry = MAERA_CONTEXT_ARC37_CHAPTERS[chId];
        list.push({ chapterId: dedupeId, topic: entry.topic, classification: entry.classification, day: game.day || 0 });
      }
    });
  }

  // ===========================================================================
  // 3. TWIN AFFINITY
  // ===========================================================================
  function twinAffinityState(){
    if (!game.twinAffinity) game.twinAffinity = { stage: 0, lastRollDay: null, log: [] };
    return game.twinAffinity;
  }
  window.twinAffinityState = twinAffinityState;

  const TWIN_AFFINITY_EVENTS = [
    { id:'same_word',   icon:'💞', text:'Vaeren and Joelle said the same word at the same time. Neither noticed.' },
    { id:'soel_between', icon:'😇', text:'Soel positioned himself between the twins before anyone noticed anything was wrong. Nothing was wrong. Probably.' },
    { id:'mirrored',    icon:'💞', text:'Joelle reached for something. Vaeren already had it.' }
  ];
  window.ARC37_TWIN_AFFINITY_EVENTS = TWIN_AFFINITY_EVENTS;

  const TWIN_AFFINITY_ROLL_CHANCE = 0.3;
  const MAX_AFFINITY_LOG = 20;

  function rollTwinAffinityEvent(){
    const state = twinAffinityState();
    if (state.stage < 1) return;
    const today = game.day || 0;
    if (state.lastRollDay === today) return; // once per new game day, never per render/click
    state.lastRollDay = today;
    if (Math.random() >= TWIN_AFFINITY_ROLL_CHANCE) return;
    const pick = TWIN_AFFINITY_EVENTS[Math.floor(Math.random() * TWIN_AFFINITY_EVENTS.length)];
    state.log.push({ id: pick.id, icon: pick.icon, text: pick.text, day: today });
    if (state.log.length > MAX_AFFINITY_LOG) state.log.splice(0, state.log.length - MAX_AFFINITY_LOG);
  }

  function renderTwinAffinityPanel(){
    const state = twinAffinityState();
    if (state.stage < 1) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">💞 Twin Affinity</div>';
    if (state.log.length) {
      const today = game.day || 0;
      const todays = state.log.filter(function(e){ return e.day === today; });
      todays.forEach(function(e){
        html += '<article class="quest-item">'+esc(e.icon)+' '+esc(e.text)+'</article>';
      });
    } else {
      html += '<article class="quest-item"><span style="font-size:.78rem;opacity:.7;">Quiet so far today.</span></article>';
    }
    return html;
  }
  window.renderTwinAffinityPanel = renderTwinAffinityPanel;

  // Registration is deferred to the sync hook below (checked once per
  // call, idempotent) rather than attempted here at file-load time --
  // unlike fair-tide-hobbies.js/fair-tide-crew-conversations.js/
  // fair-tide-port-visitors.js, this file loads alongside the other
  // arc files (chronological order), which is BEFORE tide-stories.js
  // in index.html. A load-time call here would silently no-op.
  let twinAffinityTideSourceRegistered = false;
  function ensureTwinAffinityTideSource(){
    if (twinAffinityTideSourceRegistered) return;
    if (typeof window.registerTideStorySource !== 'function') return;
    window.registerTideStorySource({
      id: 'twin_affinity_echo', slot: 'evening',
      eligible: function(){
        const state = twinAffinityState();
        const today = game.day || 0;
        return state.stage >= 1 && state.log.some(function(e){ return e.day === today; });
      },
      generate: function(){
        const today = game.day || 0;
        const todays = twinAffinityState().log.filter(function(e){ return e.day === today; });
        if (!todays.length) return null;
        const pick = todays[Math.floor(Math.random() * todays.length)];
        return { icon: pick.icon, title: 'Twin Affinity', text: pick.text };
      }
    });
    twinAffinityTideSourceRegistered = true;
  }

  // ===========================================================================
  // 4. BOND RESONANCE — hidden, story-driven only, never grindable,
  // never explained.
  // ===========================================================================
  const BOND_RESONANCE_TIERS = [
    { threshold:0,  label:'Quiet' },
    { threshold:20, label:'Noticeable' },
    { threshold:40, label:'Undeniable' }
  ];
  window.BOND_RESONANCE_TIERS = BOND_RESONANCE_TIERS;

  function bondResonanceState(){
    if (!game.bondResonance) game.bondResonance = { points: 0 };
    return game.bondResonance;
  }
  window.bondResonanceState = bondResonanceState;

  function addBondResonance(amount){
    bondResonanceState().points += amount;
  }

  window.bondResonanceTier = function(){
    const points = bondResonanceState().points;
    let tier = BOND_RESONANCE_TIERS[0];
    BOND_RESONANCE_TIERS.forEach(function(t){ if (points >= t.threshold) tier = t; });
    return tier;
  };

  function renderBondResonancePanel(){
    const points = bondResonanceState().points;
    if (points <= 0) return '';
    const tier = window.bondResonanceTier();
    return '<div class="panel-title" style="margin-top:16px;">💗 Something Between Them</div>'+
      '<article class="quest-item"><span style="font-size:.8rem;opacity:.85;">'+esc(tier.label)+'</span></article>';
  }
  window.renderBondResonancePanel = renderBondResonancePanel;

  // ===========================================================================
  // Sync hook — chains on top of every earlier arc's own wrap (same
  // pattern used since Arc XXIII).
  // ===========================================================================
  const oldSyncArc1ForArc37 = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForArc37) oldSyncArc1ForArc37();
    ensureTwinAffinityTideSource();
    const cp = game.comicProgress37;
    if (!cp) return;

    if (cp[7]) window.registerHorizonSurvey('arc37_horizon', 'The Uncharted Overlap');
    if (cp[8]) window.advanceHorizonSurveyStage('arc37_horizon', 'observed');
    if (cp[21]) window.advanceHorizonSurveyStage('arc37_horizon', 'surveyed');
    if (cp[24]) window.markHorizonSurveyCoordinatesRecorded('arc37_horizon');

    checkMaeraContextArc37();

    const affinity = twinAffinityState();
    if (cp[9] && affinity.stage < 1) affinity.stage = 1;
    if (cp[16] && affinity.stage < 2) affinity.stage = 2;
    rollTwinAffinityEvent();

    if (cp[14] || cp[15]) {
      if (!game.bondResonanceSyncedChapters) game.bondResonanceSyncedChapters = {};
      [14, 15].forEach(function(chId){
        if (cp[chId] && !game.bondResonanceSyncedChapters[chId]) {
          game.bondResonanceSyncedChapters[chId] = true;
          addBondResonance(10);
          toast('💗 Perfect Synchronization — San and Joel acted simultaneously without speaking.', 3600);
        }
      });
    }
    if (cp[23] && !(game.bondResonanceSyncedChapters && game.bondResonanceSyncedChapters[23])) {
      game.bondResonanceSyncedChapters = game.bondResonanceSyncedChapters || {};
      game.bondResonanceSyncedChapters[23] = true;
      addBondResonance(15);
    }
    if (cp[24] && !(game.bondResonanceSyncedChapters && game.bondResonanceSyncedChapters[24])) {
      game.bondResonanceSyncedChapters = game.bondResonanceSyncedChapters || {};
      game.bondResonanceSyncedChapters[24] = true;
      addBondResonance(10);
    }

    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  // ===========================================================================
  // Archive screen wiring — three panels under their own wrappers (the
  // fourth, Maera's Context, reuses Arc XXXVI's own panel), same
  // insert-and-replace pattern used since Arc XXIII.
  // ===========================================================================
  const oldRenderArchiveScreenForArc37 = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForArc37) oldRenderArchiveScreenForArc37();
    const container = document.getElementById('archiveContent');
    if (!container) return;

    const existingHorizons = document.getElementById('livingHorizonsPanelWrap');
    if (existingHorizons) existingHorizons.remove();
    const horizonsPanel = renderLivingHorizonsPanel();
    if (horizonsPanel) container.insertAdjacentHTML('beforeend', '<div id="livingHorizonsPanelWrap">'+horizonsPanel+'</div>');

    const existingAffinity = document.getElementById('twinAffinityPanelWrap');
    if (existingAffinity) existingAffinity.remove();
    const affinityPanel = renderTwinAffinityPanel();
    if (affinityPanel) container.insertAdjacentHTML('beforeend', '<div id="twinAffinityPanelWrap">'+affinityPanel+'</div>');

    const existingResonance = document.getElementById('bondResonancePanelWrap');
    if (existingResonance) existingResonance.remove();
    const resonancePanel = renderBondResonancePanel();
    if (resonancePanel) container.insertAdjacentHTML('beforeend', '<div id="bondResonancePanelWrap">'+resonancePanel+'</div>');
  };
})();
