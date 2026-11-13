(function(){
  // -------------------------------------------------------------------
  // TRIBUTE CHRONICLE -- an Archive tab holding the crossover as it
  // happened in Tribute (Tribute chapters 935-990), for story the DCT
  // chapters of Arc XLII don't carry: the Guardians and Canon Five
  // reunion, the researchers' work, Fair Tide residency, the Cold Spring
  // (the Fountain) and its aftereffects, the Medical Circle, and the
  // handoff back to Lunareth. Some beats overlap with Arc XLII from the
  // other side; the text here is Tribute's own, unedited.
  //
  // Data: scripts/tribute-chronicle-data.js (generated from Tribute's
  // chapters.js; the trailing 'Key takeaways' design notes are left out, so the
  // text is the story itself). Read-only: no XP, no flags, nothing to claim.
  //
  // Unlocks (so it never gets ahead of the DCT story):
  //   Part I   Allies Across Worlds   once Jade is met (Arc XLII Ch.2)
  //   Part II  Fair Tide              once the visitors reach Fair Tide (Ch.12)
  //   Part III Worlds in Motion       once Arc XLII is complete
  // -------------------------------------------------------------------

  const PARTS = [
    {n:1, label:'Part I · Allies Across Worlds', unlocked:function(){ return !!(game.comicProgress42 && game.comicProgress42[2]); },
      hint:'Opens once San meets Jade (Arc XLII Ch.2).'},
    {n:2, label:'Part II · Fair Tide',           unlocked:function(){ return !!(game.comicProgress42 && game.comicProgress42[12]); },
      hint:'Opens once the visitors reach Fair Tide (Arc XLII Ch.12).'},
    {n:3, label:'Part III · Worlds in Motion',   unlocked:function(){ return !!game.arc42Complete; },
      hint:'Opens once Arc XLII is complete.'}
  ];

  function ensureStyle(){
    if (document.getElementById('tcStyle')) return;
    const st = document.createElement('style'); st.id = 'tcStyle';
    st.textContent =
      '.tc-part{margin:8px 0;border:1px solid rgba(255,255,255,.12);border-radius:8px;background:rgba(0,0,0,.18)}' +
      '.tc-part>summary{cursor:pointer;padding:9px 12px;font-weight:600}' +
      '.tc-part.locked{opacity:.6;padding:9px 12px}' +
      '.tc-ch{border-top:1px solid rgba(255,255,255,.08)}' +
      '.tc-ch>summary{cursor:pointer;padding:7px 12px;font-size:.88rem}' +
      '.tc-body{padding:2px 12px 12px;font-size:.84rem;line-height:1.5}' +
      '.tc-meta{font-size:.72rem;opacity:.65;margin-bottom:6px}' +
      '.tc-num{opacity:.55;font-size:.74rem;margin-right:6px}';
    document.head.appendChild(st);
  }

  function renderTributeChroniclePanel(){
    const data = window.TRIBUTE_CHRONICLE || [];
    if (!data.length) return '';
    // Only appears once the crossover has begun (any part open).
    if (!PARTS.some(function(p){ return p.unlocked(); })) return '';
    ensureStyle();
    let html = '<div class="panel-title" style="margin-top:16px;">📖 Tribute Chronicle</div>' +
      '<p style="font-size:.78rem;opacity:.7;margin:0 0 8px;">The crossover as Tribute tells it. Some of it happened off the page in Arc XLII.</p>';
    PARTS.forEach(function(p){
      const items = data.filter(function(c){ return c.part === p.n; });
      if (!p.unlocked()) {
        html += '<div class="tc-part locked">🔒 ' + esc(p.label) + ' <span style="font-size:.74rem;">· ' + esc(p.hint) + '</span></div>';
        return;
      }
      html += '<details class="tc-part"><summary>' + esc(p.label) + ' <span style="font-size:.74rem;opacity:.65;">· ' + items.length + ' chapters</span></summary>' +
        items.map(function(c){
          return '<details class="tc-ch"><summary><span class="tc-num">Ch.' + c.n + '</span>' + esc(c.title) + '</summary>' +
            '<div class="tc-body"><div class="tc-meta">' + esc(c.loc) + (c.who ? ' · ' + esc(c.who) : '') + '</div>' + esc(c.text) + '</div></details>';
        }).join('') + '</details>';
    });
    return html;
  }
  window.renderTributeChroniclePanel = renderTributeChroniclePanel;

  const oldRenderArchiveScreenForChronicle = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForChronicle) oldRenderArchiveScreenForChronicle.apply(this, arguments);
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('tributeChroniclePanelWrap');
    if (existing) existing.remove();
    const panel = renderTributeChroniclePanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="tributeChroniclePanelWrap">' + panel + '</div>');
  };
})();
