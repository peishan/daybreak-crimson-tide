(function(){
  // -------------------------------------------------------------------
  // ARC XVII — RENN'S ORIGIN SYSTEM. Per San's own design doc: "This
  // should be a visible progression rather than just dialogue... not a
  // percentage meter. It's story-state progression." Third slice of
  // Arc XVII's mechanics doc (Archive Hub + Records, then Research, now
  // this) — and per San's own priority call, this one specifically,
  // since the arc's whole five-part structure (Renn belongs here /
  // what happened to her people / why the doors closed) is really this
  // thread's own throughline, currently underselling itself by only
  // existing folded into the six general Archive Records.
  //
  // Four stages exactly as specified, mapped to real chapter beats now
  // that the full 25-chapter text exists:
  //   Unknown            -> default, before Ch.6
  //   Possible Connection -> Ch.6 ("Familiar") — instinct she can't explain
  //   Archive Recognition -> Ch.18 ("Renn") — the RECORDS confirm her
  //                          lineage; documentary fact, not yet the
  //                          place itself acknowledging her
  //   Origin Confirmed    -> Ch.23 ("The Archive Remembers") — the
  //                          Archive itself recognizes her as belonging,
  //                          restores access; the full, final act of
  //                          recognition rather than a stage named
  //                          identically to the mechanism (the Archive)
  //                          that grants it
  // Deliberately NOT a fifth stage at Ch.10 ("I Know This Place") even
  // though it's a major emotional beat — the doc specifies exactly four
  // stages, and Ch.10 is represented as a milestone note inside stage 2
  // instead, which is where "story-state progression, not a meter"
  // earns its keep: the nuance lives in the milestone list, not in
  // proliferating stages.
  // -------------------------------------------------------------------

  const ORIGIN_STAGES = ['Unknown', 'Possible Connection', 'Archive Recognition', 'Origin Confirmed'];

  // Milestones are grouped under the stage they occur WITHIN (i.e. the
  // stage already reached by the time this chapter completes), not the
  // stage they trigger a transition TO — so Ch.6 (which triggers the
  // move FROM Unknown TO Possible Connection) is listed as the first
  // milestone inside "Possible Connection", not inside "Unknown".
  const ORIGIN_MILESTONES = [
    { ch: 6,  stage: 'Possible Connection', note: "She knows which symbols mark restricted areas, understands mechanisms without being taught. Not memory, exactly. More like instinct." },
    { ch: 7,  stage: 'Possible Connection', note: "She reads the archival language the way you read something you already know — not translating it. Remembering it." },
    { ch: 8,  stage: 'Possible Connection', note: "This wasn't just where her people studied. There were homes here. This was where they lived." },
    { ch: 9,  stage: 'Possible Connection', note: "A name close enough to hers in an old record. Then another. Different records, different dates — the same family line." },
    { ch: 10, stage: 'Possible Connection', note: "She says it herself, finally: she knows this place. Not intellectually. The way you know somewhere you grew up. San decides they go at her pace, not the Archive's." },
    { ch: 13, stage: 'Possible Connection', note: "The Door from Arc VII wasn't isolated — it was one piece of a network she'd been unknowingly connected to long before she understood it." },
    { ch: 15, stage: 'Possible Connection', note: "The Archive's most important missing pages, deliberately removed rather than merely lost, concern the final period of her civilization specifically." },
    { ch: 17, stage: 'Possible Connection', note: "What actually happened to the world she came from — the network damaged, the civilization that built the Archive not remaining intact." },
    { ch: 18, stage: 'Archive Recognition', note: "Direct records, at last — not a prophecy, a person. She came from this world, part of its final generation. How she ended up separated from it stays uncertain." },
    { ch: 19, stage: 'Archive Recognition', note: "Memory returns in fragments — a home, people, a departure, fear, someone telling her she had to leave. The full circumstances remain incomplete." },
    { ch: 20, stage: 'Archive Recognition', note: "No dramatic awakening. She just walks through a place she once knew and realizes: she grew up here. San stays beside her, and doesn't tell her what to feel." },
    { ch: 22, stage: 'Archive Recognition', note: "Why the doors were really closed — not travel itself, but what uncontrolled access became. Some began treating other worlds as resources, not places people lived." },
    { ch: 23, stage: 'Origin Confirmed', note: "The Archive itself recognizes her — not as a chosen hero, but as someone who belongs to the civilization that built it. Access, restored." },
    { ch: 24, stage: 'Origin Confirmed', note: "She stays connected to the Archive's preservation, but sails home with the Crimson Tide. That's home too." },
    { ch: 25, stage: 'Origin Confirmed', note: '"So what are you now?" Joel asks. "I suppose I\'m an archivist." "You were already an Archive Mage." "Yes. But now I know why."' }
  ];

  function rennOriginStage(){
    game.comicProgress17 = game.comicProgress17 || {};
    const p = game.comicProgress17;
    if (p[23]) return 'Origin Confirmed';
    if (p[18]) return 'Archive Recognition';
    if (p[6])  return 'Possible Connection';
    return 'Unknown';
  }
  window.rennOriginStage = rennOriginStage;

  function reachedMilestones(){
    game.comicProgress17 = game.comicProgress17 || {};
    return ORIGIN_MILESTONES.filter(function(m){ return !!game.comicProgress17[m.ch]; });
  }

  function renderRennOriginPanel(){
    const stage = rennOriginStage();
    const stageIdx = ORIGIN_STAGES.indexOf(stage);
    let html = '<div class="panel-title" style="margin-top:16px;">🧑‍🔬 Renn\'s Origin</div>';

    if (stage === 'Unknown') {
      html += '<p style="font-size:.8rem;opacity:.6;">Nothing here feels familiar to her yet.</p>';
      return html;
    }

    // Stage tracker — deliberately a row of labeled steps, not a
    // percentage bar, per the doc's own instruction.
    html += '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;">';
    ORIGIN_STAGES.forEach(function(s, i){
      const reached = i <= stageIdx;
      html += '<span style="font-size:.72rem;padding:3px 8px;border-radius:10px;'+
        (reached ? 'background:rgba(232,197,71,.22);border:1px solid rgba(232,197,71,.5);color:#e8c547;' : 'background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);opacity:.5;')+
        '">'+esc(s)+'</span>';
    });
    html += '</div>';

    const milestones = reachedMilestones();
    html += '<div style="border-left:2px solid rgba(232,197,71,.4);padding-left:10px;">';
    milestones.forEach(function(m){
      html += '<div style="margin-bottom:8px;"><span style="font-size:.72rem;opacity:.55;">Ch.'+m.ch+'</span><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(m.note)+'</span></div>';
    });
    html += '</div>';
    return html;
  }
  window.renderRennOriginPanel = renderRennOriginPanel;

  const oldRenderArchiveScreenForRennOrigin = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForRennOrigin) oldRenderArchiveScreenForRennOrigin();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    // Same accumulation-safe pattern established for the Research panel
    // (V222, itself a direct lesson from the Bonds tab bug at V220):
    // remove any previously-inserted copy before adding a fresh one, so
    // repeated renders never stack duplicates.
    const existing = document.getElementById('rennOriginPanelWrap');
    if (existing) existing.remove();
    container.insertAdjacentHTML('beforeend', '<div id="rennOriginPanelWrap">'+renderRennOriginPanel()+'</div>');
  };
})();
