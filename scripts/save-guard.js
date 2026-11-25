// ===== Save guard: warns when progress is not being saved, or the save is getting close to the browser's limit =====
// The game keeps its save in the browser's localStorage (about 5 million characters for the whole site). Every save path swallowed a failed write
// silently, so a full store would have meant progress quietly not saving. This watches every write of the save key (it wraps Storage.setItem for that key
// only, so it sees saveGame, saveGameQuiet and the AFK timestamp write alike) and shows a banner:
//   * red, when a save FAILED: "Progress is not being saved", with a Download-backup button (it still works, the data is in memory);
//   * amber, when the save passes WARN_AT characters (about 70% of the limit) or CRIT_AT (about 90%), with the same button and the biggest parts of the save.
// A dismissed banner comes back later (red after 2 minutes, amber when the save has grown by another 250 thousand characters).
(function(){
  const KEY = 'daybreak_crimson_tide_v2';
  const WARN_AT = 3500000, CRIT_AT = 4500000, REGROW = 250000;
  const st = { size: 0, failed: false, error: '', lastLevel: 0, hiddenUntil: 0, hiddenAtSize: 0, notified: 0 };
  window.__ctSaveHealth = st;

  function level(){ return st.failed ? 3 : (st.size >= CRIT_AT ? 2 : (st.size >= WARN_AT ? 1 : 0)); }
  function mb(n){ return (n / 1e6).toFixed(1) + ' million characters'; }
  function parts(){
    try {
      if (typeof game === 'undefined' || !game) return '';
      return Object.keys(game).map(function(k){ let n = 0; try { n = JSON.stringify(game[k]).length; } catch(e) {} return [k, n]; })
        .sort(function(a, b){ return b[1] - a[1]; }).slice(0, 4).map(function(p){ return p[0] + ' ' + Math.round(p[1] / 1000) + 'k'; }).join(', ');
    } catch(e) { return ''; }
  }
  function bar(){
    let el = document.getElementById('ctSaveGuard');
    if (!el) {
      el = document.createElement('div'); el.id = 'ctSaveGuard'; el.setAttribute('role', 'alert');
      el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:1400;padding:max(8px,env(safe-area-inset-top)) 12px 8px;display:none;font-size:.82rem;line-height:1.35;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.5);';
      document.body.appendChild(el);
    }
    return el;
  }
  function hide(){ const el = document.getElementById('ctSaveGuard'); if (el) el.style.display = 'none'; }
  function render(){
    if (!document.body) return;
    const lv = level();
    if (!lv) { hide(); return; }
    if (Date.now() < st.hiddenUntil && !(lv === 3 && !st.shownFailed)) return;
    if (lv < 3 && st.hiddenAtSize && st.size < st.hiddenAtSize + REGROW && Date.now() < st.hiddenUntil) return;
    const el = bar();
    el.style.background = lv === 3 ? 'linear-gradient(90deg,#8e1b1b,#b32525)' : 'linear-gradient(90deg,#8a5a00,#b57a00)';
    const msg = lv === 3
      ? '⚠️ <b>Your progress is NOT being saved.</b> The browser refused the save (' + (st.error || 'storage full') + '). Download a backup now, then free some space.'
      : '💾 <b>Your save is ' + mb(st.size) + '</b>, close to the browser limit (about 5 million). ' + (lv === 2 ? '<b>Download a backup now.</b> ' : 'Download a backup soon. ') + 'Biggest parts: ' + parts() + '.';
    el.innerHTML = '<div style="display:flex;gap:8px;align-items:flex-start;"><div style="flex:1;">' + msg + '</div>' +
      '<div style="display:flex;flex-direction:column;gap:6px;">' +
      '<button id="ctSaveGuardDl" style="padding:6px 10px;border-radius:8px;border:1px solid #fff;background:rgba(0,0,0,.35);color:#fff;font-size:.8rem;">📤 Backup</button>' +
      '<button id="ctSaveGuardX" style="padding:4px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.6);background:transparent;color:#fff;font-size:.78rem;">Later</button></div></div>';
    el.style.display = 'block';
    st.shownFailed = lv === 3;
    document.getElementById('ctSaveGuardDl').onclick = function(){ try { window.ctDownloadBackup(); } catch(e) { console.error('backup failed', e); } };
    document.getElementById('ctSaveGuardX').onclick = function(){ st.hiddenUntil = Date.now() + (level() === 3 ? 2 * 60000 : 30 * 60000); st.hiddenAtSize = st.size; hide(); };
  }
  // download the save from memory (works even when storage is full)
  window.ctDownloadBackup = function(){
    if (typeof exportSave === 'function') { exportSave(); return; }
    const blob = new Blob([JSON.stringify(game)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'crimson-tide-save.json';
    document.body.appendChild(a); a.click(); a.remove();
  };
  function tell(title, text){
    try { if (typeof window.notify === 'function') window.notify({ icon: '💾', title: title, text: text, kind: 'info', duration: 7000 }); } catch(e) {}
  }
  function after(wasFailed, lvBefore){
    try {
      const lv = level();
      if (st.failed && !wasFailed) { console.error('[save-guard] save FAILED: ' + st.error + ' (size ' + st.size + ')'); tell('Progress is not saving', 'The browser refused the save. Download a backup from the banner.'); }
      if (!st.failed && wasFailed) { console.log('[save-guard] saving works again'); tell('Saving works again', 'Your progress is being saved.'); }
      if (lv === 1 && lvBefore < 1 || lv === 2 && lvBefore < 2) console.warn('[save-guard] save size ' + st.size + ' characters; biggest parts: ' + parts());
      render();
    } catch(e) {}
  }
  function install(){
    const proto = (typeof Storage !== 'undefined') ? Storage.prototype : null;
    if (!proto || proto.__ctSaveGuard) return;
    const orig = proto.setItem;
    proto.setItem = function(k, v){
      if (k !== KEY || this !== window.localStorage) return orig.apply(this, arguments);
      const wasFailed = st.failed, before = level();
      try {
        const r = orig.apply(this, arguments);
        st.failed = false; st.error = ''; st.size = String(v).length;
        after(wasFailed, before);
        return r;
      } catch (e) {
        st.failed = true; st.error = String((e && e.name) || 'error').replace('QuotaExceededError', 'storage full'); st.size = String(v).length;
        after(wasFailed, before);
        throw e;
      }
    };
    proto.__ctSaveGuard = true;
  }
  try { install(); } catch(e) {}
  // a dismissed banner can return on its own
  setInterval(function(){ try { render(); } catch(e) {} }, 30000);
})();
