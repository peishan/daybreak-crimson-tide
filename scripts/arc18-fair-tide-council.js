(function(){
  // -------------------------------------------------------------------
  // ARC XVIII — THE FAIR TIDE COUNCIL. Built from Ch.15's own text, not
  // the design doc's generic "Delegation System" example list. Ch.15 IS
  // the delegation system, already dramatized concretely — San calling
  // together specific crew members, each contributing a distinct
  // perspective rather than San deciding alone. Directly demonstrates
  // the doc's own framing: "the right person isn't always San."
  //
  // Deliberately NOT "Wayfarer's Harbour" (the doc's suggested signature
  // location) — checked the actual 25-chapter text first, and that
  // location is never named or visited anywhere in it. Building a full
  // harbour hub around it would mean inventing a place and its scenes
  // wholesale, the same risk correctly avoided with the World Catalogue
  // earlier. The Council is what the story actually gives us instead.
  //
  // Seven members, each with the exact contribution Ch.15 itself
  // assigns them — nothing invented beyond what's written.
  // -------------------------------------------------------------------

  const COUNCIL_MEMBERS = [
    { key: 'aisyah', name: 'Aisyah', icon: '💰', role: 'Practical Concerns', contribution: "Lays out what refusing outside access actually costs — in trade and goodwill both." },
    { key: 'joel',   name: 'Joel',   icon: '🛡️', role: 'Security', contribution: "Covers security, plainly, the way he covers everything." },
    { key: 'renn',   name: 'Renn',   icon: '🔧', role: 'Technology', contribution: "Explains the technology in terms the room can actually follow." },
    { key: 'erynn',  name: 'Erynn',  icon: '📖', role: 'History', contribution: "Lays out the historical weight of what they're sitting on." },
    { key: 'mimi',   name: 'Mimi',   icon: '🔮', role: 'Perception', contribution: "Says what she can see, and just as carefully, what she can't." },
    { key: 'dr_aa',  name: 'Dr. AA', icon: '🩺', role: 'Humanitarian Risk', contribution: "Raises the humanitarian risk nobody else has voiced yet." },
    { key: 'brada',  name: 'Brada',  icon: '📦', role: 'Logistics', contribution: "Thinks through logistics and what defending any of this would actually require." }
  ];
  window.ARC18_COUNCIL_MEMBERS = COUNCIL_MEMBERS;

  function councilConvened(){
    return !!(game.comicProgress18 && game.comicProgress18[15]);
  }
  window.arc18CouncilConvened = councilConvened;

  function renderCouncilPanel(){
    if (!councilConvened()) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🏛️ The Fair Tide Council</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">San doesn\'t decide this one alone. Each voice brings something the others can\'t.</p>';
    COUNCIL_MEMBERS.forEach(function(m){
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:flex-start;">'+
        '<div style="font-size:1.4rem;">'+m.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(m.name)+'</strong> <span style="font-size:.72rem;opacity:.55;">— '+esc(m.role)+'</span><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(m.contribution)+'</span>'+
        '</div></div></article>';
    });
    html += '<p style="font-size:.76rem;opacity:.6;font-style:italic;margin-top:4px;">Fair Tide\'s own people have opinions too — not just an audience waiting for San to decide for them.</p>';
    return html;
  }
  window.renderCouncilPanel = renderCouncilPanel;

  const oldRenderArchiveScreenForCouncil = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForCouncil) oldRenderArchiveScreenForCouncil();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('arc18CouncilPanelWrap');
    if (existing) existing.remove();
    const panel = renderCouncilPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="arc18CouncilPanelWrap">'+panel+'</div>');
  };
})();
