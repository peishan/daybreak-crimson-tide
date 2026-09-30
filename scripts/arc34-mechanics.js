(function(){
  // -------------------------------------------------------------------
  // ARC XXXIV MECHANICS — FAMILY RESONANCE + VEYREN LIFE STUDIES, the
  // gameplay Ch.1, 6-9, 13-15, and 21's own notes call for. Kept OUT of
  // arc34.js itself, same split used since Arc XXIII.
  //
  //   1. FAMILY RESONANCE — the twins are NOT playable characters
  //      before birth. Instead, two unidentified signatures (Resonance
  //      I / Resonance II) accumulate Observations as their own story
  //      chapters are read — permanent Archive entries, never fetal
  //      statistics, never a numeric percentage or countdown. Cause,
  //      Future Ability, and Developmental Timeline stay the literal
  //      string 'Unknown' permanently within this arc, per the
  //      outline's own explicit restraint against defining their full
  //      power sets here.
  //
  //   2. VEYREN LIFE STUDIES — a new Archive research category
  //      documenting what Fair Tide has learned about Veyren pregnancy,
  //      aging, and Fountain restoration, populated the same way Arc
  //      XXXIII's own Legacy Records were: one permanent entry per its
  //      own story chapter, recording what's been learned rather than
  //      what the twins are worth.
  //
  // The final summary panel deliberately has no progress bar and no
  // percentage anywhere — Birth always reads the literal string 'Not
  // Yet', matching the outline's own closing framing exactly.
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. FAMILY RESONANCE
  // ===========================================================================
  const RESONANCE_OBSERVATIONS = {
    6:  { title:'Two Distinct Signatures', text:'Soel responds independently to each presence.' },
    21: { title:'External Response',       text:'One signature reacted to familiar magic.' }
  };
  // Ch.21 produces two observations at once -- the second response is a
  // separate entry keyed under its own synthetic id so both survive the
  // same chapterId-dedupe check used for every other accumulating list
  // in this codebase (Arc XXXIII's own Legacy Records included).
  const RESONANCE_SECOND_OBSERVATION_AT_CH21 = { title:'Different Patterns', text:'The two signatures do not respond identically.' };
  window.ARC34_RESONANCE_OBSERVATIONS = RESONANCE_OBSERVATIONS;

  function familyResonanceState(){
    if (!game.familyResonance) {
      game.familyResonance = {
        distinctSignatures: false,
        fountainInfluence: false,
        emergingResonance: false,
        observations: []
      };
    }
    return game.familyResonance;
  }
  window.familyResonanceState = familyResonanceState;

  function familyResonanceUnlocked(){
    return !!(game.comicProgress34 && game.comicProgress34[1]);
  }
  window.familyResonanceUnlocked = familyResonanceUnlocked;

  function renderFamilyResonancePanel(){
    if (!familyResonanceUnlocked()) return '';
    const state = familyResonanceState();
    let html = '<div class="panel-title" style="margin-top:16px;">💞 Two Hearts</div>'+
      '<article class="quest-item">'+
        'Distinct Signatures: '+(state.distinctSignatures ? 'Confirmed ✓' : 'Unconfirmed')+'<br>'+
        'Fountain Influence: '+(state.fountainInfluence ? 'Present ✓' : 'Unconfirmed')+'<br>'+
        'Emerging Resonance: '+(state.emergingResonance ? 'Confirmed ✓' : 'Unconfirmed')+'<br>'+
        'Birth: Not Yet'+
      '</article>';
    if (state.observations.length) {
      html += '<div class="panel-title" style="margin-top:12px;font-size:.9rem;">Observations</div>';
      state.observations.forEach(function(obs){
        html += '<article class="quest-item"><strong>Observation: '+esc(obs.title)+' ✓</strong><br>'+
          '<span style="font-size:.78rem;opacity:.75;">'+esc(obs.text)+'</span></article>';
      });
    }
    html += '<article class="quest-item"><span style="font-size:.78rem;opacity:.7;">'+
      'Cause: Unknown<br>Future Ability: Unknown<br>Developmental Timeline: Unknown</span></article>';
    return html;
  }
  window.renderFamilyResonancePanel = renderFamilyResonancePanel;

  // ===========================================================================
  // 2. VEYREN LIFE STUDIES
  // ===========================================================================
  const VEYREN_LIFE_STUDY_CHAPTERS = {
    3:  { title:'Not Human',            text:"Human expectations don't explain what San's pregnancy has become." },
    7:  { title:"The Fountain's Echo",  text:"The Fountain didn't create the twins -- its restoration became part of the conditions they developed under." },
    8:  { title:'No Precedent',         text:'No existing record matches twins conceived after Fountain restoration by people originally from another world.' },
    13: { title:'Slow and Fast',        text:'Veyren children may not mature at one uniform human rate -- some systems slower, others already ahead, magic on its own timetable entirely.' },
    14: { title:'Not Immortal',         text:'The twins never had an ordinary pre-Fountain state to be restored from -- their relationship to it may be entirely different from the adults’.' }
  };
  window.ARC34_VEYREN_LIFE_STUDY_CHAPTERS = VEYREN_LIFE_STUDY_CHAPTERS;

  function veyrenLifeStudiesState(){
    if (!game.veyrenLifeStudies) game.veyrenLifeStudies = [];
    return game.veyrenLifeStudies;
  }
  window.veyrenLifeStudiesState = veyrenLifeStudiesState;

  function veyrenLifeStudiesUnlocked(){
    return !!(game.comicProgress34 && game.comicProgress34[3]);
  }
  window.veyrenLifeStudiesUnlocked = veyrenLifeStudiesUnlocked;

  function renderVeyrenLifeStudiesPanel(){
    if (!veyrenLifeStudiesUnlocked()) return '';
    const entries = veyrenLifeStudiesState();
    if (!entries.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">📖 Veyren Life &amp; Development</div>';
    entries.forEach(function(entry){
      html += '<article class="quest-item"><strong>'+esc(entry.title)+'</strong><br>'+
        '<span style="font-size:.78rem;opacity:.75;">'+esc(entry.text)+'</span></article>';
    });
    return html;
  }
  window.renderVeyrenLifeStudiesPanel = renderVeyrenLifeStudiesPanel;

  // ===========================================================================
  // Sync hook — progresses Family Resonance and appends Veyren Life
  // Studies entries as their own chapters are read. Chains on top of
  // every earlier arc's own wrap, same pattern used since Arc XXIII.
  // ===========================================================================
  const oldSyncArc1ForFamilyResonance = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForFamilyResonance) oldSyncArc1ForFamilyResonance();
    const cp = game.comicProgress34;
    if (!cp) return;

    const resonance = familyResonanceState();
    if (cp[1] && !resonance.distinctSignatures) {
      resonance.distinctSignatures = true;
      toast('💞 Two distinct signatures confirmed.', 3200);
    }
    if (cp[7] && !resonance.fountainInfluence) {
      resonance.fountainInfluence = true;
      toast('🌌 The Fountain\'s influence is present in the pregnancy.', 3200);
    }
    if (cp[21] && !resonance.emergingResonance) {
      resonance.emergingResonance = true;
      toast('✨ Emerging Resonance confirmed.', 3200);
    }

    Object.keys(RESONANCE_OBSERVATIONS).forEach(function(chId){
      const already = resonance.observations.some(function(o){ return o.chapterId === Number(chId); });
      if (cp[chId] && !already) {
        const entry = RESONANCE_OBSERVATIONS[chId];
        resonance.observations.push({ chapterId: Number(chId), title: entry.title, text: entry.text, day: game.day || 0 });
      }
    });
    // Ch.21's second, distinct response -- kept as its own dedupe check
    // (chapterId 2100) so it never collides with the first observation
    // also keyed to Ch.21.
    const secondAlready = resonance.observations.some(function(o){ return o.chapterId === 2100; });
    if (cp[21] && !secondAlready) {
      resonance.observations.push({ chapterId: 2100, title: RESONANCE_SECOND_OBSERVATION_AT_CH21.title, text: RESONANCE_SECOND_OBSERVATION_AT_CH21.text, day: game.day || 0 });
    }

    const studies = veyrenLifeStudiesState();
    Object.keys(VEYREN_LIFE_STUDY_CHAPTERS).forEach(function(chId){
      const already = studies.some(function(s){ return s.chapterId === Number(chId); });
      if (cp[chId] && !already) {
        const entry = VEYREN_LIFE_STUDY_CHAPTERS[chId];
        studies.push({ chapterId: Number(chId), title: entry.title, text: entry.text, day: game.day || 0 });
      }
    });

    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  // ===========================================================================
  // Archive screen wiring — two panels under their own wrappers, same
  // insert-and-replace pattern used since Arc XXIII.
  // ===========================================================================
  const oldRenderArchiveScreenForFamilyResonance = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForFamilyResonance) oldRenderArchiveScreenForFamilyResonance();
    const container = document.getElementById('archiveContent');
    if (!container) return;

    const existingResonance = document.getElementById('familyResonancePanelWrap');
    if (existingResonance) existingResonance.remove();
    const resonancePanel = renderFamilyResonancePanel();
    if (resonancePanel) container.insertAdjacentHTML('beforeend', '<div id="familyResonancePanelWrap">'+resonancePanel+'</div>');

    const existingStudies = document.getElementById('veyrenLifeStudiesPanelWrap');
    if (existingStudies) existingStudies.remove();
    const studiesPanel = renderVeyrenLifeStudiesPanel();
    if (studiesPanel) container.insertAdjacentHTML('beforeend', '<div id="veyrenLifeStudiesPanelWrap">'+studiesPanel+'</div>');
  };
})();
