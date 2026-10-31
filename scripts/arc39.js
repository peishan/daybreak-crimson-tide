(function(){
  // -------------------------------------------------------------------
  // ARC XXXIX — THE STEADY REACH. Gated at arc38Complete + level 585,
  // continuing the established +15-per-arc ladder (XXXVI:540,
  // XXXVII:555, XXXVIII:570, XXXIX:585). Ch.12 sets game.arc39Complete =
  // true, matching every other arc's own finale flag.
  //
  // Per the outline's own explicit framing: this is NOT another Robin or
  // Jeff storyline — their Crimson Tide arcs concluded in Arc VI. Lewis
  // and his crew are already established (grantLewisAllyCaptainIfDue,
  // fairtide-systems.js: Lewis became an ally captain, arriving with
  // Aisy, Elva, Selina, Zul, and Jonathan aboard The Steady Reach -- the
  // same ship name this arc's own bookend chapters share, deliberately).
  // Jorvin (Tinkerer/Mechanic since Arc V Ch.21) is the other former
  // colleague already in Fair Tide's own roster.
  //
  // Per the outline's explicit restraint: this arc does NOT add Lewis's
  // crew (Aisy, Elva, Selina, Zul, Jonathan) as new Fair Tide residents.
  // They remain Lewis's own crew, aboard his own ship -- the story
  // explores who they've become without relocating any of them.
  //
  // Only 12 chapters (provisional, per the outline's own note it may be
  // revised after review) -- a character/settlement arc rather than a
  // major expedition, so the XP curve stays gentler than a combat-
  // centered arc, climbing toward Ch.11 (the practical matter from
  // Ch.1 actually resolving) and Ch.12's own finale, which shares its
  // title with Ch.1 on purpose.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. The soft tie-in to Lewis's existing Ally
  // request system (no new gating, no blocking requirement -- that
  // system's board rotation is partly random, so hard-gating a chapter
  // on it risked a softlock) lives in scripts/arc39-mechanics.js, same
  // split used since Arc XXIII.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.webp) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC39_CHAPTERS = [
    {id:1, title:'The Steady Reach', focus:"Lewis has become a familiar presence at Fair Tide. He approaches San about a practical matter requiring coordination between several residents. San remembers how accustomed she once was to receiving instructions from him. But she's the Captain now. Lewis knows that.", image:'assets/comics/arc39/ch01-the-steady-reach.webp', xp:330, action:'⚓ Hear Lewis Out'},
    {id:2, title:'Behind the Desk', focus:"San remembers her former claims department. Lewis supervised it; San handled general administration and back-office claims work by choice. Mimi and Aisy worked the front desk, Jonathan assisted Lewis. Not everyone was close. Not everyone agreed. But their work was connected.", image:'assets/comics/arc39/ch02-behind-the-desk.webp', xp:320, action:'📋 Remember Behind the Desk'},
    {id:3, title:"Mimi's Other Life", focus:"Mimi's role has grown far beyond her former administrative work — a Diviner, a member of the Arcane Trio, one of the Horizon Engine's principal builders. San notices how naturally Mimi moves between research and everyday life. Brada, once a TM customer rather than a colleague, is already part of that life too.", image:'assets/comics/arc39/ch03-mimis-other-life.webp', xp:325, action:"🌸 See Mimi's Other Life"},
    {id:4, title:"Lewis's First Mate", focus:"Aisy works closely with Lewis — her name occasionally confused with San's eldest sister, Aisyah. She has her own personality, strengths, and working relationship with Lewis, adapted to a very different world than the one she left.", image:'assets/comics/arc39/ch04-lewiss-first-mate.webp', xp:325, action:"🧭 Meet Lewis's First Mate"},
    {id:5, title:"Jorvin's Workshop", focus:"Jorvin is already established at Fair Tide, working as a mechanic alongside Caelan. His previous references to former colleagues gain new context. San sees how someone she once knew through ordinary working life has developed a completely different professional identity.", image:'assets/comics/arc39/ch05-jorvins-workshop.webp', xp:330, action:"🔧 Visit Jorvin's Workshop"},
    {id:6, title:"Jonathan's Own Way", focus:"Jonathan was Lewis's assistant and the youngest of their former claims team. San hears his own perspective on their old department, and what he actually wants from his life now. His future role in Veyren stays open, rather than inventing one for him.", image:'assets/comics/arc39/ch06-jonathans-own-way.webp', xp:325, action:"📚 Hear Jonathan's Own Way"},
    {id:7, title:'Not Everyone Agreed', focus:"The former colleagues remember the department differently — some supportive, some distant, some disagreeing with San outright, others carrying difficulties San knew little about. No single recollection represents the entire workplace, and San doesn't need everyone to agree with her version of the past.", image:'assets/comics/arc39/ch07-not-everyone-agreed.webp', xp:335, action:'🌿 Accept Not Everyone Agreed'},
    {id:8, title:'The Work Between Us', focus:"A Fair Tide responsibility brings several former colleagues together. They fall into familiar patterns — Lewis coordinates, others contribute to their strengths — but the old hierarchy no longer determines everyone's place. San watches how much has actually changed.", image:'assets/comics/arc39/ch08-the-work-between-us.webp', xp:340, action:'⚓ Find the Work Between Us'},
    {id:9, title:'People, Not Positions', focus:"The former colleagues spend time together outside their responsibilities. The conversation moves past claims, supervisors and workplace routines. Some discover common interests; others stay politely distant. They don't have to become one close-knit family just because they once worked together.", image:'assets/comics/arc39/ch09-people-not-positions.webp', xp:330, action:'🌸 See People, Not Positions'},
    {id:10, title:'What We Carried Here', focus:"Lewis reflects on the responsibilities he once held. Other colleagues consider what they brought from Earth and what they've left behind. San recognizes that each person arrived in Veyren with a different history entirely their own.", image:'assets/comics/arc39/ch10-what-we-carried-here.webp', xp:340, action:'🏡 Ask What We Carried Here'},
    {id:11, title:'A Different Kind of Team', focus:"The practical matter from Chapter 1 reaches its conclusion. The former colleagues have contributed in different ways — their cooperation doesn't erase past disagreements, but it proves they can work together without returning to their old roles.", image:'assets/comics/arc39/ch11-a-different-kind-of-team.webp', xp:400, action:'🌊 Complete a Different Kind of Team'},
    {id:12, title:'The Steady Reach', focus:"Lewis and San have a quiet conversation, acknowledging how different their lives have become. Lewis has responsibilities of his own; San has Fair Tide, her crew, and her family. Their old working relationship remains part of their history, but neither is confined to it.", image:'assets/comics/arc39/ch12-the-steady-reach.webp', xp:420, action:'⚓ Hold the Steady Reach'}
  ];
  window.ARC39_CHAPTERS = ARC39_CHAPTERS;

  const ARC39_CHAPTER_SCENES = {
    1: "Lewis has become enough of a fixture at Fair Tide by now that nobody really looks twice when The Steady Reach ties up at the dock. He finds San with a practical matter in hand — something that's going to need more than one pair of hands, coordinated across several residents who don't normally work together.<br><br>San listens, and for a moment she catches herself bracing the way she used to, back when Lewis handing her something meant an instruction rather than a request.<br><br>But she's the Captain now. Lewis knows that as well as she does — maybe better, given how carefully he's phrased the whole thing as an ask rather than an assignment.<br><br>Their old working relationship hasn't vanished. It's just changed shape, the way most things eventually do out here.",
    2: "San finds herself thinking back on her old claims department more than she expects to, turning it over while Lewis's request sits half-finished on her desk.<br><br>Lewis supervised the department, the way he supervised everything — steady, unhurried, rarely raising his voice because he rarely needed to. San handled general administration and back-office claims work, by her own choice, happier buried in the details than out front. Mimi and Aisy worked the front desk, the actual face of the place. Jonathan assisted Lewis directly, quiet and careful.<br><br>The department functioned because different people handled different responsibilities, not because everyone got along effortlessly. Not everyone was close. Not everyone agreed, San included. But the work was connected, whether anyone there particularly liked each other or not.",
    3: "San watches Mimi move through an ordinary afternoon at Fair Tide and is struck, not for the first time, by how far she's come from the front desk. Diviner. A member of the Arcane Trio. One of the principal builders behind the Horizon Engine itself.<br><br>It isn't a dramatic transformation to watch, exactly — Mimi slides between serious research and everyday life with the same easy competence either way, like she's always belonged in both places at once.<br><br>Brada is part of that life now too, has been for a while. He was never San's colleague, just a TM customer who crossed paths with the department often enough to become familiar. Now he's simply part of Mimi's life, established, unremarkable in the best possible way.<br><br>San doesn't need to retell how any of it started. She's more interested, today, in who Mimi's actually become.",
    4: "Aisy works closely with Lewis, has for as long as San's known either of them out here, and the name still occasionally trips people up — easy enough to say \"Aisy\" and have half of Fair Tide briefly think of San's eldest sister, Aisyah, before the context catches up.<br><br>They're nothing alike, once you actually know them. Aisy has her own sharpness, her own instincts, her own particular way of working alongside Lewis that's developed into something close to shorthand between them.<br><br>She wasn't handed a role here. She built one, adapting hard-won instincts from a very different world into whatever The Steady Reach actually needed her to be. San watches her work for a while and comes away with a clearer sense of who Aisy actually is — not Lewis's assistant, not a name easily confused with someone else's. Just Aisy.",
    5: "Jorvin's workshop is exactly as loud and cluttered as San expects by now, him and Caelan both half-buried in something that used to work and currently doesn't.<br><br>San's heard Jorvin mention former colleagues in passing plenty of times without really placing the context — small references that suddenly mean more, now that she's actually spending time with the people he used to work alongside.<br><br>Watching him here, hands deep in some mechanism only he and Caelan seem to fully understand, San sees someone she once knew through perfectly ordinary working life who's built an entirely different professional identity for himself since. Jorvin isn't defined by his old workplace anymore — a place, she gathers, he used to dread walking into every single day, if not for the handful of people there he actually liked.<br><br>He barely looks up. He's busy. He seems happy about it.",
    6: "Jonathan was always the quiet one — Lewis's assistant, the youngest of the old claims team, the one who watched more than he spoke. San makes a point of actually asking him, directly, what he thinks about all of it now.<br><br>His perspective on the old department turns out to be entirely his own, not an echo of Lewis's or anyone else's. He's thought about what he wants from his life here more than San expected, and he isn't in any hurry to have those thoughts resolved into a tidy answer just because someone finally asked.<br><br>San doesn't press him toward any particular role. Whatever Jonathan becomes in Veyren, it should actually be his to choose — not something handed to him because it's convenient for the story people assume he's living in.",
    7: "The former colleagues don't all remember the old department the same way, and San starts noticing that more clearly the more of them she actually talks to. Some remember her warmly. Some stayed distant the whole time, polite but never close. A few disagreed with how she ran things, back then, and aren't shy about saying so now that the stakes are so much lower. Others had their own difficulties running alongside hers the whole time, difficulties San genuinely never noticed.<br><br>No single person's memory adds up to the whole workplace. San used to assume, without really examining it, that her own read on those years was simply the accurate one.<br><br>She doesn't need everyone to agree with her version of the past. She just needs to actually hear the other versions, for once.",
    8: "A real Fair Tide responsibility pulls several former colleagues together at once, and almost immediately, old patterns reassert themselves. Lewis coordinates, the way he always has. Everyone else falls in according to whatever they're actually good at, the same shape they used to take without ever quite discussing it.<br><br>But the old hierarchy doesn't decide anyone's place this time. Lewis isn't anyone's supervisor here. San isn't behind a desk. The work still gets done, efficiently, almost effortlessly — just not because anyone outranks anyone else anymore.<br><br>San watches it happen and is quietly struck by how much has actually changed, underneath a shape that still looks, at a glance, exactly like it used to.",
    9: "For once, nobody's actually working. The former colleagues end up together anyway, simply spending time in each other's company, and the conversation drifts somewhere it never used to go — past claims, past supervisors, past anything resembling a workplace routine.<br><br>Some of them discover they actually have things in common, outside of ever having shared an office. Others stay politely distant, perfectly friendly, never quite warming past that.<br><br>Nobody forces it either way. They don't need to become one close, inseparable family just because they once filed the same paperwork under the same roof. Some of them are simply people who used to work together, and that can stay exactly what it is.",
    10: "Lewis talks, more openly than San's used to hearing from him, about the responsibilities he carried back then — the weight of supervising a department full of people whose lives he mostly only saw through a desk.<br><br>Others open up too, each in their own way, about what they actually brought with them from Earth and what they've quietly let go of since. The specifics differ wildly from person to person.<br><br>San realizes, listening to all of it, that each of them arrived in Veyren carrying an entirely different history — not variations on her own story, not supporting characters in it, just people who happened to end up here too. The chapter isn't really about San's old employer at all, in the end. It's about each of them, on their own terms.",
    11: "The practical matter Lewis first raised back in Chapter 1 finally comes together, pieced from contributions that look nothing alike — Lewis's own coordination, Aisy's instincts, Jorvin's hands-on fix for something nobody else could touch, Jonathan quietly catching a detail everyone else missed.<br><br>Their cooperation doesn't erase whatever disagreements still sit between some of them. Nobody pretends otherwise.<br><br>But it proves something San's been circling since Chapter 1: they can actually work together, effectively, without falling back into the old roles that used to define every single interaction between them. That's new. It matters more than the task itself ever did.",
    12: "Lewis finds San once everything's settled, and for once neither of them is in a hurry to get back to work. They talk, plainly, about how different their lives have actually become since the old department closed its doors for good.<br><br>Lewis has his own responsibilities now — his own ship, his own crew, his own version of what San's built at Fair Tide, smaller in scale but built with the same care. San has Fair Tide itself, her crew, her family waiting for her at the end of every day.<br><br>Their old working relationship is still part of both their histories. Neither of them is confined to it anymore, and neither particularly wants to be.<br><br>\"Heard you've kept busy,\" Lewis says again, the same unhurried line he greeted her with the day he first sailed The Steady Reach into port.<br><br>\"You too,\" San says.<br><br>Fair Tide keeps moving forward, same as it always does. The Steady Reach sails on, steady as its name."
  };
  window.ARC39_CHAPTER_SCENES = ARC39_CHAPTER_SCENES;

  window.arc39ObjectiveState = function(){
    if (!game.arc38Complete) return null;
    if (level() < 585) return null;
    game.comicProgress39 = game.comicProgress39 || {};
    for (const ch of ARC39_CHAPTERS) {
      if (!game.comicProgress39[ch.id]) return 'complete_arc39_chapter_' + ch.id;
    }
    return 'arc39_part1_complete_for_now';
  };

  window.markArc39ChapterRead = function(id){
    const so = window.arc39ObjectiveState();
    if (so !== ('complete_arc39_chapter_' + id)) return;
    game.comicProgress39 = game.comicProgress39 || {};
    game.comicProgress39[id] = true;
    // Matches every prior arc's own completion flag (arc37/arc38Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 12) game.arc39Complete = true;
    const ch = ARC39_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC39_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC39_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc39Splash = function(){
    const overlay = document.getElementById('arc39SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc39Splash = function(){
    const overlay = document.getElementById('arc39SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc39SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc39 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc39) oldRenderStoryForArc39();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc39Ready = window.arc39ObjectiveState() !== null;
    if (arc39Ready && !game.arc39SplashSeen && typeof window.__ctShowArc39Splash === 'function') {
      window.__ctShowArc39Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc39/arc39-cover-the-steady-reach.webp" alt="Arc XXXIX — The Steady Reach" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXXIX</div><div class="story-act-title">The Steady Reach</div>'+
      '<div class="story-act-tagline">People who once worked together can find different purposes when their circumstances change.</div></div>';
    if (!arc39Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXXIX Locked</div><div class="story-chapter-sub">'+
        (!game.arc38Complete ? 'Finish Arc XXXVIII first.' : 'Reach Level 585 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc39ObjectiveState();
    ARC39_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress39 && game.comicProgress39[ch.id]);
      const ready = !done && so===('complete_arc39_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action =
          '<button class="btn btn-small btn-success" onclick="markArc39ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc39_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXXIX chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
