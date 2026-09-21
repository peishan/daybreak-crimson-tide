
// ===== On-device debug log (no devtools required) =====
// Captures console output + uncaught errors into a ring buffer that can be
// viewed from a button in the game footer. Runs first so it catches
// page-load-time errors too, not just in-game ones.
(function(){
  window.__CT_LOG__ = [];
  const MAX = 300;
  function push(kind, args){
    try {
      const line = '[' + new Date().toISOString().slice(11,19) + '] ' + kind + ': ' +
        Array.from(args).map(a => { try { return typeof a==='string'?a:JSON.stringify(a); } catch(e){ return String(a); } }).join(' ');
      window.__CT_LOG__.push(line);
      if(window.__CT_LOG__.length > MAX) window.__CT_LOG__.shift();
    } catch(e) {}
  }
  ['log','warn','error'].forEach(kind=>{
    const orig = console[kind];
    console[kind] = function(){ push(kind, arguments); orig.apply(console, arguments); };
  });
  window.addEventListener('error', function(ev){
    push('uncaught', [ev.message + ' @ ' + (ev.filename||'') + ':' + (ev.lineno||'') ]);
  });
  window.addEventListener('unhandledrejection', function(ev){
    push('unhandledrejection', [String(ev.reason)]);
  });
  // Log every tap/click that lands on a button or story-related element, so
  // we can tell "the tap never reached the button" apart from "the button's
  // own code ran and did nothing" — the two look identical from the outside.
  document.addEventListener('click', function(ev){
    try {
      const t = ev.target;
      const tag = t.tagName;
      const isInteresting = tag === 'BUTTON' || (t.closest && (t.closest('button') || t.closest('.story-actions') || t.closest('#storyModeOverlay')));
      if(!isInteresting) return;
      const el = tag === 'BUTTON' ? t : (t.closest('button') || t);
      const label = (el.textContent||'').trim().slice(0,40);
      const onclickAttr = el.getAttribute && el.getAttribute('onclick');
      push('tap', ['target=<'+tag+'> text="'+label+'" onclick="'+(onclickAttr||'none')+'" id='+(el.id||'none')]);
    } catch(e) {}
  }, true);
  window.__ctShowDebugLog = function(){
    const existing = document.getElementById('ctDebugLogOverlay');
    if(existing){ existing.remove(); return; }
    const overlay = document.createElement('div');
    overlay.id = 'ctDebugLogOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:999999;padding:14px;box-sizing:border-box;display:flex;flex-direction:column;';
    const text = window.__CT_LOG__.length ? window.__CT_LOG__.join('\n') : '(no log entries yet)';
    overlay.innerHTML =
      '<div style="color:#e8c547;font-family:sans-serif;font-size:14px;margin-bottom:8px;display:flex;justify-content:space-between;">' +
        '<strong>Debug Log (Build ' + (window.__CT_BUILD__||'?') + ')</strong>' +
        '<span id="ctDebugLogClose" style="cursor:pointer;padding:2px 10px;border:1px solid #e8c547;border-radius:6px;">Close</span>' +
      '</div>' +
      '<textarea readonly style="flex:1;width:100%;background:#111;color:#8f8;font-family:monospace;font-size:11px;border:1px solid #444;border-radius:6px;padding:8px;box-sizing:border-box;">' + text.replace(/</g,'&lt;') + '</textarea>' +
      '<div style="color:#aaa;font-family:sans-serif;font-size:11px;margin-top:8px;">Tap the text, select all, and copy — then paste it back in chat.</div>';
    document.body.appendChild(overlay);
    document.getElementById('ctDebugLogClose').onclick = function(){ overlay.remove(); };
  };
  // Fixed, always-on-top floating button — unlike the footer link (which sits
  // below the full-height screen content and requires scrolling past an
  // entire screen to reach), this is reachable from every screen, every
  // scroll position, and even over the Story Mode overlay itself.
  function addFloatingDebugButton(){
    if(document.getElementById('ctDebugFab')) return;
    const btn = document.createElement('div');
    btn.id = 'ctDebugFab';
    btn.textContent = '🐛';
    btn.style.cssText = 'position:fixed;bottom:14px;right:14px;width:40px;height:40px;border-radius:50%;background:rgba(20,14,8,.88);border:1px solid #e8c547;color:#e8c547;display:flex;align-items:center;justify-content:center;font-size:19px;z-index:999998;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.5);';
    btn.onclick = function(ev){ ev.stopPropagation(); window.__ctShowDebugLog(); };
    document.body.appendChild(btn);
  }
  // Universal shortcut back to the landing/menu screen (Continue Voyage,
  // Comic Chapters archive, Codex, Settings, etc.) — reachable from any
  // screen, not just Port, using the same always-on-top pattern as the
  // debug button. goScreen('intro') already re-renders live stats via
  // renderLanding(), so this is safe to use mid-session.
  function addFloatingMenuButton(){
    if(document.getElementById('ctMenuFab')) return;
    const btn = document.createElement('div');
    btn.id = 'ctMenuFab';
    btn.textContent = '🏠';
    btn.style.cssText = 'position:fixed;bottom:14px;left:14px;width:40px;height:40px;border-radius:50%;background:rgba(20,14,8,.88);border:1px solid #e8c547;color:#e8c547;display:flex;align-items:center;justify-content:center;font-size:19px;z-index:999998;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.5);';
    btn.title = 'Back to menu';
    btn.onclick = function(ev){ ev.stopPropagation(); if(typeof goScreen==='function') goScreen('intro'); };
    document.body.appendChild(btn);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', addFloatingMenuButton, {once:true});
  else addFloatingMenuButton();
})();
