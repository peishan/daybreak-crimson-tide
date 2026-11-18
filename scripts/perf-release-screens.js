(function(){
  // -------------------------------------------------------------------
  // MEMORY: release the heavy screens when you leave them.
  //
  // The Story, Comic Archive and Archive screens build thousands of DOM
  // nodes and (Story) dozens of full-size cover images. They used to stay
  // built, and in memory, after you navigated away, so a long session
  // that keeps hopping between screens kept all of it resident, which is
  // what made the phone app crash when it got busy. Every one of these
  // screens is rebuilt from the save each time it opens (goScreen calls
  // its render function), so emptying it on the way out loses nothing
  // and lets the browser free the nodes and the decoded images.
  // -------------------------------------------------------------------
  const HEAVY = { story: 'storyContent', comics: 'comicArchive', archive: 'archiveContent' };
  let current = null;

  function release(name){
    const id = HEAVY[name];
    if (!id) return;
    const el = document.getElementById(id);
    if (el && el.firstChild) el.textContent = '';
  }

  const oldGoScreen = window.goScreen;
  if (typeof oldGoScreen !== 'function') return;
  window.goScreen = function(name){
    const prev = current;
    current = name;
    if (prev && prev !== name) { try { release(prev); } catch(e) {} }
    return oldGoScreen.apply(this, arguments);
  };
})();
