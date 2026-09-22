
// Build 46: refresh-free Story Mode completion and immediate Story screen refresh. Story Mode advances through a
// global function and responds to click, pointerup, and touchend.
(function(){
  function advance(ev){
    if(ev){ ev.preventDefault(); ev.stopImmediatePropagation(); }
    if(typeof window.advanceStoryMode === 'function') window.advanceStoryMode();
  }
  function wire(){
    const handler = function(ev){
      const el = ev.target && ev.target.closest ? ev.target.closest('#storyModeNext') : null;
      if(el){ advance(ev); return; }
      const panel = ev.target && ev.target.closest ? ev.target.closest('#storyModePanel') : null;
      const overlay = ev.target && ev.target.closest ? ev.target.closest('#storyModeOverlay.active') : null;
      if(panel && overlay) advance(ev);
    };
    document.addEventListener('pointerup', handler, true);
    document.addEventListener('click', handler, true);
    document.addEventListener('touchend', handler, {capture:true, passive:false});
    document.addEventListener('keydown', function(ev){
      const overlay=document.getElementById('storyModeOverlay');
      if(overlay && overlay.classList.contains('active') && (ev.key==='Enter'||ev.key===' '||ev.key==='ArrowRight')) advance(ev);
    }, true);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', wire, {once:true}); else wire();
})();

window.__CT_BUILD__='V187 · Arc XVI Ch.1 and San-Joel Disagreement System'