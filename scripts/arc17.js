(function(){
  // -------------------------------------------------------------------
  // ARC XVII — THE ARCHIVE BETWEEN WORLDS. Part I only ("The Door That
  // Shouldn't Be There", Ch.1-5) — the full arc's later parts aren't
  // written yet, matching how Arc XVI itself started with just Ch.1
  // before the rest was wired in a later pass. Gated at arc16Complete +
  // level 255, continuing the established +15-per-arc ladder
  // (XIV:210, XV:225, XVI:240, XVII:255).
  //
  // Per San's note, the Archive Hub itself (the major new location from
  // the accompanying mechanics doc) is set to become known at Ch.4 —
  // "The Archive Between Worlds," the chapter where the crew makes its
  // first controlled approach and the story itself names the place. This
  // file only sets the discovery flag (game.archiveDiscovered) at that
  // point, matching the harbourDiscovered/tideNetworkDiscovered/
  // clanSettlementDiscovered pattern from prior arcs — it does not build
  // the Archive Hub mechanic itself (Archive Records, World Catalogue,
  // Research, Evidence states, Sealed Records, etc.), which is a much
  // larger, separate build to take on once San is ready for it.
  // -------------------------------------------------------------------

  const ARC17_CHAPTERS = [
    {id:1, title:'A Signal in the Horizon', focus:"The Horizon Engine detects something unusual during a routine observation — not a world, not a normal Horizon, more like a structured signal embedded in the boundary itself.", image:'assets/comics/arc17/ch01-a-signal-in-the-horizon.png', xp:300, action:'📡 Investigate the Signal'},
    {id:2, title:'The Old Farseer Mark', focus:"Erynn recognizes a symbol within the signal — related to Farseer markings, but older than anything in the Farseer Archives. The Farseers may have inherited this knowledge rather than invented it.", image:'assets/comics/arc17/ch02-the-old-farseer-mark.png', xp:290, action:'📜 Study the Mark'},
    {id:3, title:'Beyond the Known Route', focus:"The crew follows the signal. The Horizon Engine doesn't open toward a normal destination — instead, it reveals an enormous structure suspended beyond the boundary. An Archive.", image:'assets/comics/arc17/ch03-beyond-the-known-route.png', xp:300, action:'🧭 Follow the Signal'},
    {id:4, title:'The Archive Between Worlds', focus:"The Crimson Tide makes its first controlled approach. Records, maps, magical instruments, boundary measurements, sealed doors, and machines whose purpose isn't yet understood — this civilization was studying the connections between worlds themselves.", image:'assets/comics/arc17/ch04-the-archive-between-worlds.png', xp:320, action:'🏛️ Enter the Archive'},
    {id:5, title:'Someone Has Been Here Before', focus:"The crew discovers evidence that someone has accessed the Archive relatively recently — not ancient explorers, someone who understood the systems. Renn recognizes one of the markings. She doesn't know why.", image:'assets/comics/arc17/ch05-someone-has-been-here-before.png', xp:310, action:'🔍 Investigate the Traces'}
  ];
  window.ARC17_CHAPTERS = ARC17_CHAPTERS;

  const ARC17_CHAPTER_SCENES = {
    1: "The readings come in during a routine sweep — nothing about the setup suggested this would be anything but a normal check of the boundary.<br><br>It isn't a world out there. Renn is sure of that within minutes, and surer still the longer she stares at it. It isn't a normal Horizon either, not the shape those usually take. What it actually resembles, if she's being precise about it, is a signal — structured, deliberate, embedded directly into the boundary itself rather than sitting somewhere beyond it.<br><br>\"Can we reach it?\" San asks, because that's always the first question that matters.<br><br>\"That's the interesting part,\" Renn says, and doesn't look up from the readings once.",
    2: "It's Erynn who spots it first, buried in the signal's structure where anyone less trained would have missed it entirely — a symbol.<br><br>Not unfamiliar. That's what unsettles her. It's related to Farseer markings, close enough that she recognized it on sight. But it's older. Older than anything catalogued in the Farseer Archives, older than any tradition she was ever taught to trace it back to.<br><br>Which means one of two things, and neither sits easily. Either the Farseers found this on their own and built an entire tradition to explain it. Or they didn't find it at all — they inherited it, from something that came before them, and simply never said so.<br><br>\"We've been studying the descendants of something,\" Erynn says quietly, and for once doesn't sound like someone enjoying a discovery.",
    3: "The crew follows the signal, and almost immediately it stops behaving like anything they've followed before.<br><br>Every previous crossing has opened toward somewhere — a world, a coastline, something with a shape San could point the ship at. This one doesn't. Instead, beyond the boundary, something enormous resolves into view — not a destination so much as a structure, suspended in space that shouldn't hold anything at all.<br><br>An Archive, though nobody uses that word yet.<br><br>It looks abandoned, in the way old places always look abandoned from a distance — quiet, still, untouched. But something in there is still running. San can feel it before anyone confirms it out loud.",
    4: "The Crimson Tide makes its first controlled approach, slow and deliberate, the way you'd approach something you don't yet understand well enough to risk approaching any other way.<br><br>It isn't simply a library, whatever San expected walking in. It's records and maps and instruments whose function nobody can immediately place. Boundary measurements stretching back further than anyone aboard can account for. Records of worlds — more worlds than the crew has ever heard named, let alone visited. Old travel routes, some clearly still active, others just as clearly long since closed. Sealed doors that offer no explanation for what they're sealing. Machines that hum faintly, purpose unknown, still doing whatever they were built to do centuries after anyone was left to ask them to.<br><br>Whoever built this wasn't studying worlds individually. They were studying the connections between them — the boundary itself, as its own subject, the way Renn studies the Engine.<br><br>Nobody says much walking through it. There isn't much to say yet.",
    5: "The signs are small, easy to miss if you aren't looking for them — but once Erynn points them out, they're unmistakable. Someone has been here. Not ancient explorers, not whoever built this place originally. Someone recent. Someone who understood the systems well enough to move through them without disturbing what wasn't meant to be disturbed.<br><br>Renn stops in front of one particular marking, and something in her expression changes before she says a word.<br><br>She recognizes it. She can't explain how, and that bothers her more than not recognizing it would have."
  };
  window.ARC17_CHAPTER_SCENES = ARC17_CHAPTER_SCENES;

  window.arc17ObjectiveState = function(){
    if (!game.arc16Complete) return null;
    if (level() < 255) return null;
    game.comicProgress17 = game.comicProgress17 || {};
    for (const ch of ARC17_CHAPTERS) {
      if (!game.comicProgress17[ch.id]) return 'complete_arc17_chapter_' + ch.id;
    }
    return 'arc17_part1_complete_for_now';
  };

  window.markArc17ChapterRead = function(id){
    const so = window.arc17ObjectiveState();
    if (so !== ('complete_arc17_chapter_' + id)) return;
    game.comicProgress17 = game.comicProgress17 || {};
    game.comicProgress17[id] = true;
    const ch = ARC17_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    // Per San's note: the Archive Hub is set to become known at Ch.4,
    // "The Archive Between Worlds" — the chapter where the crew makes
    // its first controlled approach. Only sets the discovery flag here;
    // the Archive Hub mechanic itself is a separate, later build.
    if (id === 4) game.archiveDiscovered = true;
    if (ARC17_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC17_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc17Splash = function(){
    const overlay = document.getElementById('arc17SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc17Splash = function(){
    const overlay = document.getElementById('arc17SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc17SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc17 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc17) oldRenderStoryForArc17();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc17Ready = window.arc17ObjectiveState() !== null;
    if (arc17Ready && !game.arc17SplashSeen && typeof window.__ctShowArc17Splash === 'function') {
      window.__ctShowArc17Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc17/arc17-cover-the-archive-between-worlds.png" alt="Arc XVII — The Archive Between Worlds" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XVII</div><div class="story-act-title">The Archive Between Worlds</div>'+
      '<div class="story-act-tagline">Some histories are older than the people who remember them.</div></div>';
    if (!arc17Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XVII Locked</div><div class="story-chapter-sub">'+
        (!game.arc16Complete ? 'Finish Arc XVI first.' : 'Reach Level 255 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc17ObjectiveState();
    ARC17_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress17 && game.comicProgress17[ch.id]);
      const ready = !done && so===('complete_arc17_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc17ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc17_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XVII chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
