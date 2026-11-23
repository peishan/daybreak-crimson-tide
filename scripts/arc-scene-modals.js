(function(){
  // -------------------------------------------------------------------
  // Main-game Arcs VII and VIII: a chapter's scene shows as a popup when the chapter is read (those arcs queue it in game.storyModalQueue
  // but do not show it themselves), and some chapters add a short "learn about" card after the scene (Meet the Farseer, Learn about Tenn, ...).
  // -------------------------------------------------------------------
  function prog(arc){ return game['comicProgress' + arc] || {}; }
  function flushScene(){
    setTimeout(function(){
      const m = document.getElementById('modalOverlay');
      if (m && m.classList.contains('active')) return;       // whatever is open hands over to the queue when it closes
      if (game.storyModalQueue && game.storyModalQueue.length && typeof showStoryModal === 'function') showStoryModal(game.storyModalQueue.shift());
    }, 700);
  }
  // A short "learn about" card for a person, place or idea, shown once after the chapter's scene. Facts come from the chapters themselves.
  function card(o){
    const head = o.img
      ? '<img src="' + o.img + '" alt="" style="width:84px;height:84px;border-radius:50%;object-fit:cover;border:2px solid var(--gold);flex:0 0 auto;">'
      : '<div style="width:84px;height:84px;border-radius:50%;border:2px solid var(--gold);flex:0 0 auto;display:flex;align-items:center;justify-content:center;font-size:2.4rem;background:rgba(0,0,0,.25);">' + o.icon + '</div>';
    return '<div style="display:flex;gap:12px;align-items:center;text-align:left;margin-bottom:10px;">' + head +
      '<div><strong style="font-size:1.05rem;">' + o.name + '</strong><br><span style="opacity:.8;font-size:.85rem;">' + o.sub + '</span></div></div>' +
      '<div style="text-align:left;">' + o.body.join('<br><br>') + '</div>';
  }
  const CARDS = {
    '7:3': { title: '🧭 Meet the Farseer', img: 'assets/portraits/erynn.png', name: 'Erynn Farseer', sub: 'Farseer Descendant · Support',
      body: ['Heir to generations of Farseer records, and a descendant of Varel Farseer. He documents what refuses to behave like ordinary magic: boundaries, anomalies, doors that should not exist.',
             'He is cautious of the crew now, but he and Renn are already asking the same questions. He will join your crew later in this arc, and his skills are named for the records he keeps.'] },
    '7:6': { title: '📜 Learn about Varel', icon: '📜', name: 'Varel Farseer', sub: 'The first of the Farseer line',
      body: ['The first of his line to study magical boundaries and impossible geography seriously. Not a legend, and not someone with all the answers: a scholar who wrote down what he saw, carefully, and left the rest for whoever came after.',
             'Erynn\'s first skill, <em>Varel\'s Ledger</em>, is named for his notes: a documented weakness, generations old and still accurate.'] },
    '7:7': { title: '🧭 Learn about Tenn', icon: '🧭', name: 'Tenn', sub: 'The generation after Varel',
      body: ['Tenn\'s generation did not just keep Varel\'s work. They studied it, argued with it, and found the places where he had guessed wrong.',
             'That is how the Farseers work: their knowledge is an argument that has run for generations, and everyone in it disagreed with someone. Erynn\'s <em>Tenn\'s Correction</em> is named for that habit of sharpening what came before.'] },
    '7:8': { title: '📚 Inside the Farseer Archives', icon: '📚', name: 'The Farseer Archives', sub: 'Generations of careful records',
      body: ['Renn has real access at last. Some of the archives line up with what he found on his own, and some contradict it outright.',
             'It is oddly reassuring: the Farseers do not have every answer either, which only means there is more worth finding.'] },
    '7:9': { title: '🎨 The Diviner in the Painting', img: 'assets/portraits/mimi.png', name: 'Mimi', sub: 'And a Diviner generations old',
      body: ['A painting in the Farseer archives shows a Diviner named Mimi, generations old, and it could be her. Erynn recognises her at once.',
             'Mimi does not know what to make of it either. Whoever the woman in the painting was, she is a distinct person, and Mimi is careful to say she is not her. Not exactly.'] },
    '7:19': { title: '⚠️ The Old Marker', icon: '🗿', name: 'The Old Marker', sub: 'Placed long ago, far from any route',
      body: ['A Farseer marker, set deliberately a long time ago, in a place nobody actually sails to. Even Erynn\'s own records do not fully explain why it was put there.',
             'His skill <em>The Old Marker\'s Warning</em> takes its name from it: not every mystery needs solving to be useful.'] },
    '8:3': { title: '🗺️ The Map That Moves', icon: '🗺️', name: 'The Maps Do Not Agree', sub: 'Roads that were there, landmarks that vanished',
      body: ['Maps of the same region contradict each other. Renn\'s first instinct is that someone got the surveying wrong.',
             'Erynn\'s is stranger: maybe every map is correct, just correct at a different time.'] },
    '8:7': { title: '🪨 A Marker Older Than Varel', icon: '🪨', name: 'The Older Marker', sub: 'Before anything Varel recorded',
      body: ['Erynn finds a marker older than anything Varel ever wrote down. His family\'s history with these boundaries does not start with Varel at all.',
             'It goes back further than Erynn ever knew, and further than anyone bothered to record.'] },
    '8:15': { title: '🔭 The Broken Observer', icon: '🔭', name: 'The Observer', sub: 'Parts still work. Most do not.',
      body: ['Renn wants to repair what is broken and see what happens. Erynn stops him: nobody knows what it was built to observe, or why.',
             'Mimi does not want it activated at all. Not like this, and not yet.'] },
    '8:20': { title: '❓ The Farseer Question', icon: '❓', name: 'What Survived?', sub: 'A question the family never had to face',
      body: ['Erynn starts asking how much of his family\'s own history has actually survived intact.',
             'They preserved what they could for generations, but preserving something and getting it exactly right were never the same thing.'] }
  };
  [7, 8].forEach(function(arc){
    const name = 'markArc' + arc + 'ChapterRead', old = window[name];
    if (typeof old !== 'function') return;
    window[name] = function(id){
      const n = Number(id), was = !!prog(arc)[n];
      const r = old.apply(this, arguments);
      try {
        if (!was && prog(arc)[n]) {
          const c = CARDS[arc + ':' + n];
          game.arcCardsSeen = game.arcCardsSeen || {};
          if (c && !game.arcCardsSeen[arc + ':' + n]) {
            game.arcCardsSeen[arc + ':' + n] = true;
            game.storyModalQueue = game.storyModalQueue || [];
            game.storyModalQueue.push({ title: c.title, blurb: card(c) });
          }
          flushScene();
        }
      } catch (e) {}
      return r;
    };
  });
})();
