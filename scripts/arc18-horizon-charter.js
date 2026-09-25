(function(){
  // -------------------------------------------------------------------
  // ARC XVIII — THE HORIZON CHARTER. Built from the arc's own actual
  // text, not the design doc's generic placeholder principles (First
  // Contact / Consent / Resource Protection / Non-Interference /
  // Emergency Access). Ch.16 ("The Rules We Choose") already wrote the
  // real five: "no forced access, no extraction without permission, no
  // opening unstable passages, no unjustified military use, no
  // ownership over other worlds." That's what ships here.
  //
  // Two states, matching the story's own two-stage structure:
  //   Draft      -> Ch.16 onward. The crew has written the rules; not
  //                 everyone outside Fair Tide has accepted them yet
  //                 (Ch.17: "Not Everyone Agrees").
  //   Established -> Ch.23 ("The Horizon Charter") onward. Formally
  //                 established, matching the arc's own title chapter.
  //
  // Each principle's elaboration text is this developer's own writing,
  // not invented lore — a short, practical explanation of what the
  // stated rule means in play, the same way a spell or research finding
  // gets flavor text without adding new plot facts. The rule itself
  // (the bolded phrase) is verbatim from Ch.16.
  //
  // Lives in the Archive screen alongside the World Catalogue and Route
  // Access, since by Arc 18 that's already the game's "knowledge about
  // the wider network" screen — not a new, separate location.
  // -------------------------------------------------------------------

  const HORIZON_CHARTER_PRINCIPLES = [
    {
      key: 'no_forced_access',
      rule: 'No Forced Access',
      text: "Fair Tide doesn't open a passage into a world, or force one open, without genuinely understanding who's already there."
    },
    {
      key: 'no_extraction_without_permission',
      rule: 'No Extraction Without Permission',
      text: "Nothing leaves a world — resources, knowledge, people — without that world's own consent to it leaving."
    },
    {
      key: 'no_unstable_passages',
      rule: 'No Opening Unstable Passages',
      text: "A route that isn't safe to open stays closed, whatever might be worth reaching on the other side of it."
    },
    {
      key: 'no_unjustified_military_use',
      rule: 'No Unjustified Military Use',
      text: "The Horizon Engine isn't a weapon, and Fair Tide won't treat it — or let anyone else treat it — as one without genuine cause."
    },
    {
      key: 'no_ownership_over_worlds',
      rule: 'No Ownership Over Other Worlds',
      text: "Finding a route to somewhere doesn't make that place Fair Tide's to claim, govern, or decide for."
    }
  ];
  window.HORIZON_CHARTER_PRINCIPLES = HORIZON_CHARTER_PRINCIPLES;

  function charterStage(){
    game.comicProgress18 = game.comicProgress18 || {};
    if (game.comicProgress18[23]) return 'established';
    if (game.comicProgress18[16]) return 'draft';
    return 'none';
  }
  window.charterStage = charterStage;

  function renderHorizonCharterPanel(){
    const stage = charterStage();
    if (stage === 'none') return '';

    let html = '<div class="panel-title" style="margin-top:16px;">📜 The Horizon Charter</div>';
    if (stage === 'draft') {
      html += '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Drafted, not yet formally established. Not everyone outside Fair Tide has accepted these terms.</p>';
    } else {
      html += '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Formally established. Access to the Horizon network runs on trust, cooperation, and responsibility — not ownership.</p>';
    }

    HORIZON_CHARTER_PRINCIPLES.forEach(function(p){
      html += '<article class="quest-item" style="'+(stage==='established' ? 'border-color:rgba(232,197,71,.5);' : '')+'">'+
        '<strong>'+esc(p.rule)+'</strong> '+
        '<span class="story-chip" style="'+(stage==='established' ? 'background:rgba(232,197,71,.22);' : 'background:rgba(255,255,255,.08);')+'">'+
        (stage==='established' ? '✓ Established' : 'Draft')+'</span><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(p.text)+'</span>'+
        '</article>';
    });
    return html;
  }
  window.renderHorizonCharterPanel = renderHorizonCharterPanel;

  const oldRenderArchiveScreenForCharter = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForCharter) oldRenderArchiveScreenForCharter();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    // Same accumulation-safe pattern as every other panel appended here
    // (Research, Renn's Origin, Farseer Layer, World Catalogue).
    const existing = document.getElementById('horizonCharterPanelWrap');
    if (existing) existing.remove();
    const panel = renderHorizonCharterPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="horizonCharterPanelWrap">'+panel+'</div>');
  };
})();
