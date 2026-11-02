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
  // explores who they've become without relocating any of them. Wei
  // Liang and Theo, named later in the Steady Reach Crew Bible, complete
  // the crew to 8 and get the same treatment -- present in these
  // chapters, never relocated to Fair Tide.
  //
  // REVISED Ch.3-12 (San's own outline, Ch.1-2 untouched): the original
  // build kept the crew mostly as background references; this revision
  // puts all 8 on the page individually -- Aisy's Shadow Walker
  // transformation (Ch.4), Theo and Jorvin's cross-crew engineering
  // friendship (Ch.5, per the Crew Bible's own build note -- this is
  // that gate), Jonathan/Wei Liang's correspondence-vs-ledger balance
  // (Ch.6), Elva/Selina's quieter navigator-quartermaster duo (Ch.7),
  // a full harbour job with every role actually shown (Ch.8, 11), an
  // off-duty evening (Ch.9), and Ch.12's closing beat between two
  // captains rather than San and Lewis alone. Retrospective timeline,
  // per the outline's own note -- before San's pregnancy and the twins,
  // same as the original build; no change to that.
  //
  // 13 chapters -- a character/settlement arc rather than a
  // major expedition, so the XP curve stays gentler than a combat-
  // centered arc, climbing toward Ch.11 (the coordination matter from
  // Ch.1 actually resolving) and Ch.12's own finale, which shares its
  // title with Ch.1 on purpose.
  //
  // Ch.13 ("Chiu May") was added afterward as the proper introduction
  // for the three TM colleagues already wired into FAIR_TIDE_ALLY_
  // NETWORK (fair-tide-ally-network.js) and the "Overheard at Fair
  // Tide" banter pool (fair-tide-crew-conversations.js): Chiu May,
  // Suzie, and Intan. Deliberately does NOT move game.arc39Complete --
  // that still fires at Ch.12 exactly as before, per the save-
  // compatibility rule this arc has carried since its own revision:
  // anyone who already finished the original 12 chapters keeps
  // arc39Complete and Arc XL stays unlocked for them. Ch.13 is simply
  // one more chapter the existing arc39ObjectiveState() loop picks up
  // naturally once Ch.12 is read -- an epilogue, not a new gate.
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
    {id:3, title:"Mimi's Other Life", focus:"Mimi's life at Fair Tide has developed far beyond her former administrative work. As a Diviner and member of the Arcane Trio, she works on research that would once have seemed impossible. Brada is already part of her life. San reflects on how differently people can grow when given another opportunity.", image:'assets/comics/arc39/ch03-mimis-other-life.webp', xp:325, action:"🌸 See Mimi's Other Life"},
    {id:4, title:"Lewis's First Mate", focus:"Aisy' works alongside Lewis, but she is no longer the talkative colleague who once depended on his guidance. Her Shadow Walker abilities have made her quieter, more observant and increasingly independent. Lewis notices that she often understands what needs doing before he asks. \"You've become rather difficult to surprise.\" \"You still talk enough for both of us.\"", image:'assets/comics/arc39/ch04-lewiss-first-mate.webp', xp:325, action:"🧭 Meet Lewis's First Mate"},
    {id:5, title:"Jorvin's Workshop", focus:"Theo visits Jorvin and Caelan's workshop to discuss a troublesome ship mechanism. Jorvin is fascinated by Theo's approach to arcane engineering. Their different methods lead to a friendly disagreement before they find a practical solution. San is amused that two former colleagues have found such different paths into mechanical work.", image:'assets/comics/arc39/ch05-jorvins-workshop.webp', xp:330, action:"🔧 Visit Jorvin's Workshop"},
    {id:6, title:"Jonathan's Own Way", focus:"Jonathan assists Lewis with correspondence and trade arrangements. Wei Liang reviews the accounts and questions whether the proposed expenses are justified. Jonathan's adaptability balances Wei Liang's financial caution. Lewis discovers that having both of them involved makes planning considerably easier.", image:'assets/comics/arc39/ch06-jonathans-own-way.webp', xp:325, action:"📚 Hear Jonathan's Own Way"},
    {id:7, title:'Not Everyone Agreed', focus:"Elva and Selina discuss their experiences in the old claims department. Neither was particularly close to San, and their recollections differ from hers. In Veyren, Elva has become a capable navigator while Selina manages supplies and provisions. Their quieter partnership reflects how much both have changed.", image:'assets/comics/arc39/ch07-not-everyone-agreed.webp', xp:335, action:'🌿 Accept Not Everyone Agreed'},
    {id:8, title:'The Work Between Us', focus:"A harbour coordination problem requires Lewis, Aisy', Zul and the other crew members to work together. Zul handles practical transport and cargo movement, cheerfully keeping everyone moving. Aisy' coordinates the work while Lewis negotiates with the people involved. San observes that they are functioning increasingly like a ship's crew rather than former office colleagues.", image:'assets/comics/arc39/ch08-the-work-between-us.webp', xp:340, action:'⚓ Find the Work Between Us'},
    {id:9, title:'People, Not Positions', focus:"The eight crew members spend an evening together after completing their responsibilities. Zul entertains everyone, Lewis joins in, and Jonathan tries to keep the conversation from becoming too chaotic. Elva and Selina remain quieter, while Aisy' listens with an occasional dry remark. They are beginning to develop friendships that have little to do with their former workplace.", image:'assets/comics/arc39/ch09-people-not-positions.webp', xp:330, action:'🌸 See People, Not Positions'},
    {id:10, title:'What We Carried Here', focus:"Lewis reflects on the responsibilities he once held. Jonathan, Wei Liang, Theo and the others consider how their old experiences have influenced their new roles. Some have changed dramatically. Others retain familiar habits. San realises that she never truly knew every colleague's personal history, and Veyren has given them opportunities to become people she might never have expected.", image:'assets/comics/arc39/ch10-what-we-carried-here.webp', xp:340, action:'🏡 Ask What We Carried Here'},
    {id:11, title:'A Different Kind of Team', focus:"The coordination matter introduced in Chapter 1 reaches its conclusion. Lewis oversees the arrangements, Aisy' manages field operations, Elva charts the routes, Selina handles provisions, Zul coordinates transport, Jonathan maintains records, Wei Liang manages expenses and Theo ensures the machinery functions. Their cooperation demonstrates that the eight have become a capable, independent team. San recognises that Lewis is ready to take responsibility for something larger.", image:'assets/comics/arc39/ch11-a-different-kind-of-team.webp', xp:400, action:'🌊 Complete a Different Kind of Team'},
    {id:12, title:'The Steady Reach', focus:"The Steady Reach prepares for its next voyage. Lewis stands aboard his own ship, surrounded by the people who have chosen to sail with him. San visits before departure. \"Still giving instructions, Captain?\" \"Only to my own crew.\" \"Good. I think I've got this lot under control.\" Zul shouts something from the deck. \"...Mostly.\" San laughs. Their former working relationship has become a friendship between two captains.", image:'assets/comics/arc39/ch12-the-steady-reach.webp', xp:420, action:'⚓ Hold the Steady Reach'},
    {id:13, title:'Chiu May', focus:"Walking back from the Steady Reach, San recognizes a familiar, hesitant figure near the harbour: Chiu May, her old manager. Before San can find the words, the door opens and Suzie steps out, welcoming May warmly and introducing Intan, a new face in their old TM circle. San leaves the three of them to their reunion.", image:'assets/comics/arc39/ch13-chiu-may.webp', xp:320, action:'🫖 Welcome Chiu May'}
  ];
  window.ARC39_CHAPTERS = ARC39_CHAPTERS;

  const ARC39_CHAPTER_SCENES = {
    1: "Lewis has become enough of a fixture at Fair Tide by now that nobody really looks twice when The Steady Reach ties up at the dock. He finds San with a practical matter in hand — something that's going to need more than one pair of hands, coordinated across several residents who don't normally work together.<br><br>San listens, and for a moment she catches herself bracing the way she used to, back when Lewis handing her something meant an instruction rather than a request.<br><br>But she's the Captain now. Lewis knows that as well as she does — maybe better, given how carefully he's phrased the whole thing as an ask rather than an assignment.<br><br>Their old working relationship hasn't vanished. It's just changed shape, the way most things eventually do out here.",
    2: "San finds herself thinking back on her old claims department more than she expects to, turning it over while Lewis's request sits half-finished on her desk.<br><br>Lewis supervised the department, the way he supervised everything — steady, unhurried, rarely raising his voice because he rarely needed to. San handled general administration and back-office claims work, by her own choice, happier buried in the details than out front. Mimi and Aisy worked the front desk, the actual face of the place. Jonathan assisted Lewis directly, quiet and careful.<br><br>The department functioned because different people handled different responsibilities, not because everyone got along effortlessly. Not everyone was close. Not everyone agreed, San included. But the work was connected, whether anyone there particularly liked each other or not.",
    3: "San watches Mimi move through an ordinary afternoon at Fair Tide, still struck by how far she's come from the front desk. Diviner. A member of the Arcane Trio. Research that would once have sounded like nonsense dressed up as a job title.<br><br>Brada is simply part of her life now, settled and unremarkable in the best possible way — no dramatic story behind it anymore, just two people who found each other on the other side of everything.<br><br>San doesn't need the whole account of how any of it started. She's more interested, watching Mimi work, in a simpler thought: given another opportunity, in another world entirely, people can grow into shapes nobody back at TM would have predicted for them. Mimi included.",
    4: "Aisy' works alongside Lewis the way she always has, except that almost nothing about HOW she does it resembles the colleague he used to know. The woman who once asked him about practically everything — small things, easily settled things, things she could have worked out herself — has become someone who rarely needs to ask at all.<br><br>Her Shadow Walker abilities changed something fundamental in her, not just a new skill but a new way of actually being in a room. Quieter. More observant. Deliberate in a way that used to be entirely foreign to her.<br><br>Lewis notices it most in the small moments — Aisy' already moving toward whatever needs doing before he's finished explaining it.<br><br>\"You've become rather difficult to surprise,\" he tells her.<br><br>\"You still talk enough for both of us,\" Aisy' says, not quite smiling, which is somehow worse.",
    5: "Theo turns up at Jorvin and Caelan's workshop with a stubborn piece of Steady Reach machinery under one arm and a very specific problem he can't quite solve alone.<br><br>Jorvin is delighted almost immediately — not just by the problem, but by Theo's whole approach to it, arcane engineering layered over mechanical instinct in a way Jorvin's never quite worked with before. They disagree, cheerfully and at some length, about the right way in. Jorvin wants to strip it down and see what's actually wrong. Theo wants to read what the mechanism's doing first, convinced the arcane layer is telling them something the housing never will.<br><br>They're both right, as it turns out, once they actually combine the two approaches instead of arguing past each other.<br><br>San, watching from the doorway, finds the whole thing quietly funny — two people who once sat in the same old department, ending up on two completely different paths into the same kind of work, neither path quite like the other.",
    6: "Jonathan works through a stack of correspondence and trade arrangements at Lewis's side, easy and adaptable the way he's always been, shifting smoothly between whatever the moment actually needs.<br><br>Wei Liang reviews the same proposals from the other direction entirely, methodical and unhurried, and isn't shy about questioning whether a given expense is actually justified before it gets anywhere near Lewis's approval.<br><br>The two of them balance each other out almost by accident — Jonathan's flexibility smoothing over what Wei Liang's caution might otherwise slow to a crawl, Wei Liang's caution catching exactly what Jonathan's flexibility might otherwise let slide.<br><br>Lewis, watching the two of them work through the same pile of paperwork from opposite ends, realizes planning anything at all has gotten considerably easier since they both started getting involved.",
    7: "Elva and Selina talk, quietly, about their time in the old claims department — neither of them particularly close to San back then, their memory of those years shaped by a very different vantage point than hers.<br><br>San doesn't press for a version of events that matches her own. She's long past assuming her read on those years was the only accurate one.<br><br>In Veyren, the two of them have found an entirely different shape together. Elva reads the stars and Veyren's own unpredictable currents as a capable navigator now, steady in a way the old department never asked of her. Selina keeps the ship properly supplied, provisions and equipment organized with the same quiet competence.<br><br>Their partnership is quieter than most of the crew's other relationships, closer to each other than to anyone else aboard — which says less about distance and more about exactly how much both of them have actually changed.",
    8: "A genuine harbour coordination problem pulls Lewis, Aisy', Zul and the rest of the crew together at once, and the shape they fall into has nothing left of an office about it.<br><br>Zul handles the practical end — transport, cargo, moving things from where they are to where they actually need to be — cheerfully enough that half the harbour ends up smiling along with him whether they mean to or not. Aisy' coordinates the whole effort with the same quiet precision she brings to everything now. Lewis handles the people, negotiating terms with the particular ease he's always had for exactly this.<br><br>San watches the three of them, and the rest of the crew falling in around them, and the thought lands clearly: they're not behaving like former office colleagues helping each other out anymore. They're functioning like an actual ship's crew.",
    9: "With the day's responsibilities actually finished, all eight of them end up together anyway, simply spending the evening in each other's company. Zul keeps everyone entertained, clearly enjoying himself. Lewis joins right in rather than hanging back as captain. Jonathan does his best to keep the whole conversation from sliding fully into chaos, with mixed success.<br><br>Elva and Selina stay quieter, close together as always, content to watch more than participate. Aisy' listens from the edge of it, offering the occasional dry remark that lands harder for how rarely she bothers.<br><br>Nobody's performing camaraderie for anyone's benefit. They're simply, slowly, becoming people who actually like spending time together — friendships that have very little left to do with whatever they once were to each other back at TM.",
    10: "Lewis talks, more openly than usual, about the weight he used to carry supervising a department full of people whose actual lives he mostly only saw through a desk.<br><br>Jonathan, Wei Liang, Theo and the rest each turn over their own version of the same question — what from their old lives actually shaped who they've become here, and what simply got left behind at the door. Some of them have changed almost beyond recognition. Others carry forward the same habits, the same instincts, barely touched by any of it.<br><br>San listens to all of it and realizes something she probably should have known all along: she never truly knew every one of her old colleagues' personal histories, not really. Veyren gave each of them room to become someone she might never have expected — not because she misjudged them back then, but because she simply never had the chance to see this version of them coming.",
    11: "The coordination matter Lewis first raised back in Chapter One finally comes together, and watching it happen, San can see exactly how far all eight of them have come.<br><br>Lewis oversees the whole arrangement. Aisy' manages field operations without needing to be told twice. Elva charts the routes. Selina handles provisions. Zul coordinates transport, keeping everything actually moving. Jonathan maintains the records that hold the whole thing together on paper. Wei Liang manages the expenses, making sure none of it outruns what they can actually afford. Theo keeps the machinery running through all of it, uncomplaining.<br><br>Eight different roles, eight different people, working as one genuinely capable, independent team — not because anyone assigned them these positions, but because each of them found their own way into exactly where they're needed.<br><br>San watches it all come together and recognizes something in Lewis she hasn't quite named until now: he's ready for something larger than this.",
    12: "The Steady Reach makes ready for its next voyage, Lewis standing on his own deck, surrounded by the people who chose, each in their own way, to actually sail with him.<br><br>San comes to see them off before they go.<br><br>\"Still giving instructions, Captain?\" Lewis asks, the same easy tone he's always had with her.<br><br>\"Only to my own crew,\" San says.<br><br>\"Good,\" Lewis says. \"I think I've got this lot under control.\"<br><br>Somewhere behind him, Zul shouts something cheerful and entirely unintelligible from the rigging.<br><br>\"...Mostly,\" Lewis amends.<br><br>San laughs, properly, and doesn't bother hiding it.<br><br>Whatever their old working relationship used to be, it's become something else entirely by now — a friendship between two captains, each running their own ship, each having found their own way to exactly where they're supposed to be.<br><br>The Steady Reach sails on, out past the harbor, beginning its own adventures across Veyren.",
    13: "Walking back from the Steady Reach, San catches a familiar shape at the corner of the street — someone standing there like she hasn't quite decided whether to be seen.<br><br>\"May?\" San says.<br><br>The figure pauses.<br><br>\"It's been a long while,\" San says. \"I didn't know if the storm brought you here too, or if you were still back in Brunei.\"<br><br>May doesn't answer right away. A long moment of silence sits between them.<br><br>San remembers working alongside her, briefly, before the storm carried all of them to Veyren — remembers too that May's own departure from the old office always came with a quiet question mark attached. San had known, in the vague way you know things about a colleague you don't ask directly, that May hadn't been happy there. Old politics, old friction, nothing San was ever told outright.<br><br>Whatever that was, it's long over now. And Veyren, San notices, has been kind to her in its own way.<br><br>\"You've already arrived,\" San says gently. \"Why don't you just go in?\"<br><br>\"It's...\" May starts, then stops. \"It's been so long. I left the office...\"<br><br>San doesn't push. She simply waits.<br><br>Then the door opens, and another familiar face steps out.<br><br>Suzie — one of the colleagues who'd worked under May back then, someone San used to help out now and again with the odd Temu or Shopee order back on Earth.<br><br>\"May,\" Suzie says, warm and immediate. \"We actually missed you.\"<br><br>May looks at her for a long moment, searching her face as if weighing whether the words are actually true.<br><br>Suzie gestures to a younger woman standing just behind her. \"May, this is Intan. A new joiner — she's part of our team now.\"<br><br>San remembers the shape of that old office herself — claims and back-office staff all sharing the same floor, San and Suzie among them.<br><br>Finally, May speaks. \"Thank you, Suzie. I'm glad.\"<br><br>\"Welcome to the family, May,\" Suzie says. \"You don't need to do anything more than that. Just stay.\"<br><br>San nods, smiling to herself, and heads back toward the captain's quarters, leaving the three of them to the rest of their reunion."
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
