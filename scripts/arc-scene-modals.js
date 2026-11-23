(function(){
  // -------------------------------------------------------------------
  // Main-game Arcs VII and VIII: a chapter's scene shows as a popup when the chapter is read (those arcs queue it in game.storyModalQueue
  // but do not show it themselves), and Arc VII Chapter 3 adds a short "Meet the Farseer" card after its scene.
  // -------------------------------------------------------------------
  function prog(arc){ return game['comicProgress' + arc] || {}; }
  function flushScene(){
    setTimeout(function(){
      const m = document.getElementById('modalOverlay');
      if (m && m.classList.contains('active')) return;       // whatever is open hands over to the queue when it closes
      if (game.storyModalQueue && game.storyModalQueue.length && typeof showStoryModal === 'function') showStoryModal(game.storyModalQueue.shift());
    }, 700);
  }
  const FARSEER_CARD =
    '<div style="display:flex;gap:12px;align-items:center;text-align:left;margin-bottom:10px;">' +
      '<img src="assets/portraits/erynn.png" alt="Erynn Farseer" style="width:84px;height:84px;border-radius:50%;object-fit:cover;border:2px solid var(--gold);flex:0 0 auto;">' +
      '<div><strong style="font-size:1.05rem;">Erynn Farseer</strong><br><span style="opacity:.8;font-size:.85rem;">Farseer Descendant · Support</span></div>' +
    '</div>' +
    '<div style="text-align:left;">Heir to generations of Farseer records, and a descendant of Varel Farseer. He documents what refuses to behave like ordinary magic: boundaries, anomalies, doors that should not exist.<br><br>' +
    'He is cautious of the crew now, but he and Renn are already asking the same questions. He will join your crew later in this arc.</div>';
  [7, 8].forEach(function(arc){
    const name = 'markArc' + arc + 'ChapterRead', old = window[name];
    if (typeof old !== 'function') return;
    window[name] = function(id){
      const n = Number(id), was = !!prog(arc)[n];
      const r = old.apply(this, arguments);
      try {
        if (!was && prog(arc)[n]) {
          if (arc === 7 && n === 3 && !game.metFarseerCard) {
            game.metFarseerCard = true;
            game.storyModalQueue = game.storyModalQueue || [];
            game.storyModalQueue.push({ title: '🧭 Meet the Farseer', blurb: FARSEER_CARD });
          }
          flushScene();
        }
      } catch (e) {}
      return r;
    };
  });
})();
