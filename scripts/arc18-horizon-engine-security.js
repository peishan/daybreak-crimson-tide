(function(){
  // -------------------------------------------------------------------
  // ARC XVIII — HORIZON ENGINE SECURITY. Covers the parts of the design
  // doc's "Horizon Engine Security" concept that aren't already
  // represented by the Council (Ch.15) or Charter (Ch.16/23) panels —
  // specifically the threat/access angle: an unknown party testing a
  // sealed route (Ch.11), and the first external claim of authority
  // over the Engine, which San refuses (Ch.13-14).
  //
  // Ch.11 is a real, confirmed continuation of Arc 17's own ending
  // hook. Arc 17 Ch.25 closes with: "Another Horizon signature. Not
  // from Veyren. Somewhere else." — and the existing unknown_signal
  // Archive Record (arc17-archive-hub.js) already tracks this,
  // deliberately staying Sealed forever within Arc 17 itself as a
  // genuine Arc 18 hook. Arc 18 Ch.11 is that hook paying off: Mimi
  // detects something actively testing a sealed route, confirms
  // "it's not us... I don't think it's anyone we've met."
  //
  // Left the existing unknown_signal record in arc17-archive-hub.js
  // completely untouched — it's hardcoded to game.comicProgress17 and
  // works correctly as-is; safer to add this Arc 18 development here,
  // in Arc 18's own file, than risk modifying a tested cross-arc
  // system for one record. Same underlying thread, told once in each
  // arc's own place.
  // -------------------------------------------------------------------

  const SECURITY_LOG = [
    {
      atChapter: 11,
      icon: '🔓',
      title: 'Something Is Testing the Seals',
      text: "One of the Archive's sealed routes isn't as sealed as it should be. Something is pushing against it, patient and repeated, the way you'd test a lock you didn't have the key to yet. \"It's not us,\" Mimi says. \"And I don't think it's anyone we've met.\""
    },
    {
      atChapter: 13,
      icon: '🚫',
      title: 'The First Outside Claim',
      text: "A delegation arrives, confident enough to assume the answer will be yes before anyone's asked. They claim authority and want to inspect the Horizon Engine. San refuses. \"This belongs to us.\" No weapon is drawn — but it's the first time she's said those words to someone who genuinely believed she'd say yes."
    }
  ];
  window.ARC18_SECURITY_LOG = SECURITY_LOG;

  function securityLogState(){
    game.comicProgress18 = game.comicProgress18 || {};
    return SECURITY_LOG.filter(function(e){ return !!game.comicProgress18[e.atChapter]; });
  }
  window.arc18SecurityLogState = securityLogState;

  function renderSecurityLogPanel(){
    const entries = securityLogState();
    if (!entries.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🔐 Horizon Engine — Security Log</div>';
    entries.forEach(function(e){
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:flex-start;">'+
        '<div style="font-size:1.4rem;">'+e.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(e.title)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(e.text)+'</span>'+
        '</div></div></article>';
    });
    return html;
  }
  window.renderSecurityLogPanel = renderSecurityLogPanel;

  const oldRenderArchiveScreenForSecurity = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForSecurity) oldRenderArchiveScreenForSecurity();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('arc18SecurityLogPanelWrap');
    if (existing) existing.remove();
    const panel = renderSecurityLogPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="arc18SecurityLogPanelWrap">'+panel+'</div>');
  };
})();
