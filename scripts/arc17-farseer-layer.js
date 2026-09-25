(function(){
  // -------------------------------------------------------------------
  // ARC XVII — FARSEER ARCHIVE LAYER. Per the design doc: "the player
  // can compare Ancient Archive Record with Farseer Record... this can
  // reveal things the Farseers preserved correctly, misunderstood,
  // deliberately omitted, terminology that changed, knowledge that was
  // lost... particularly important for Erynn — he isn't simply finding
  // confirmation of his tradition, he's discovering its history."
  //
  // Built on ONE genuinely well-grounded comparison thread rather than
  // several invented ones: the symbol Erynn recognizes at Ch.2, the
  // reframing at Ch.12 ("the Farseers came later"), and the full payoff
  // already written into his "What the Farseers Kept" research finding
  // (arc17-research.js). All three pieces of source material already
  // exist and are canon-verified — nothing here is invented lore.
  //
  // Deliberately progressive, not all-or-nothing: a bare signal (Ch.2),
  // then the reframing (Ch.12), then the full side-by-side comparison
  // only once Erynn's own research project actually completes — so the
  // comparison is EARNED by the research system already built, not a
  // parallel, disconnected reveal.
  // -------------------------------------------------------------------

  function farseerComparisonStage(){
    game.comicProgress17 = game.comicProgress17 || {};
    const p = game.comicProgress17;
    if (!p[2]) return 'none';
    const erynnDone = (typeof window.archiveResearchState === 'function') &&
      window.archiveResearchState().erynn &&
      window.archiveResearchState().erynn.completedKeys.indexOf('farseer_inheritance') !== -1;
    if (erynnDone) return 'full';
    if (p[12]) return 'reframed';
    return 'noticed';
  }
  window.farseerComparisonStage = farseerComparisonStage;

  function renderFarseerLayerPanel(){
    const stage = farseerComparisonStage();
    if (stage === 'none') return '';

    let html = '<div class="panel-title" style="margin-top:16px;">📜 Farseer Comparison</div>';

    if (stage === 'noticed') {
      html += '<article class="quest-item"><span style="font-size:.8rem;opacity:.75;">Erynn recognizes a symbol in the signal — related to Farseer markings, but older than anything in the Farseer Archives. Too early to say what that means yet.</span></article>';
      return html;
    }

    if (stage === 'reframed') {
      html += '<article class="quest-item"><span style="font-size:.8rem;opacity:.85;">The Archive predates the Farseer tradition entirely. The Farseers were preservers and interpreters of something older — not its originators. Erynn is still working out what that actually changes.</span></article>';
      return html;
    }

    // stage === 'full' — the earned, complete side-by-side comparison
    html += '<article class="quest-item" style="border-color:rgba(232,197,71,.5);">'+
      '<strong>The Old Mark</strong> <span class="story-chip" style="background:rgba(232,197,71,.22);">Shape Preserved, Reasoning Lost</span>'+
      '<div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;">'+
      '<div style="flex:1;min-width:140px;"><span style="font-size:.72rem;opacity:.6;">FARSEER TRADITION</span><br>'+
      '<span style="font-size:.8rem;opacity:.85;">A sacred mark, passed down through ritual. Its meaning is followed, not explained — the reason behind it was never part of what got taught.</span></div>'+
      '<div style="flex:1;min-width:140px;"><span style="font-size:.72rem;opacity:.6;">ARCHIVE RECORD</span><br>'+
      '<span style="font-size:.8rem;opacity:.85;">A working technical marking, once fully understood, tied directly to how the Archive\'s own systems actually functioned.</span></div>'+
      '</div>'+
      '<div style="margin-top:8px;font-size:.8rem;opacity:.85;">The core symbols match almost exactly. The context around them doesn\'t. Somewhere across the generations between the Archive and now, the Farseers kept the shape of the knowledge and lost the reasoning behind it — turned working methodology into ritual, because the people repeating it stopped understanding why it worked.</div>'+
      '</article>';
    return html;
  }
  window.renderFarseerLayerPanel = renderFarseerLayerPanel;

  const oldRenderArchiveScreenForFarseer = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForFarseer) oldRenderArchiveScreenForFarseer();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const panel = renderFarseerLayerPanel();
    // Same accumulation-safe pattern as Research and Renn's Origin —
    // always remove first, regardless of whether there's new content to
    // add, so a stale wrap can never survive even in a hypothetical
    // edge case where the panel goes from non-empty back to empty.
    const existing = document.getElementById('farseerLayerPanelWrap');
    if (existing) existing.remove();
    if (!panel) return; // stage 'none' — nothing discovered yet
    container.insertAdjacentHTML('beforeend', '<div id="farseerLayerPanelWrap">'+panel+'</div>');
  };
})();
