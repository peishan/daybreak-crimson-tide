(function(){
  // -------------------------------------------------------------------
  // ARC XIX — THE WORLDS WE KNOW. 14 chapters. Title confirmed this pass
  // (previously a placeholder). Gated at arc18Complete + level 285,
  // continuing the established +15-per-arc ladder (XVI:240, XVII:255,
  // XVIII:270, XIX:285).
  //
  // UPDATED per San's consolidated Fountain of Youth design doc: the
  // Guardian Trial / Rejuvenation payoff belongs to THIS arc's own final
  // chapters after all, not "whatever arc comes after" (an earlier,
  // now-superseded assumption from before that doc existed) — Arc XX is
  // already built and fully illustrated as "Forever and Ever," with no
  // room or need for Fountain content, and the design doc is explicit
  // that the Fountain happens BEFORE that quiet arc, not inside it.
  //
  // Ch.1-11 are the "revisit" chapters (the crew returns to worlds and
  // people from earlier in the story). Ch.12 discovers the Fountain of
  // Youth's existence without using it. Ch.13 reveals the Guardian
  // standing in the way — this is also the chapter-gate raid-mode.js's
  // guardian_trial raid checks (in addition to its own Level 300
  // requirement) before The Guardian's Trial becomes enterable from the
  // Archive. Ch.14, the true arc finale, only becomes available once
  // that raid is cleared — see arc19ObjectiveState()'s ch14 special case,
  // same pattern as arc6.js's Ch.15/robinServiceDone() exception. The
  // actual Guardian battle, Trial stages, and Rejuvenation reward all
  // live in raid-mode.js, not here — this file only wires the chapters
  // that bookend it.
  //
  // Chapters 1-5 are deliberately written without pinning down which
  // specific earlier world/world/people the crew returns to — the
  // outline itself frames Ch.1 as the crew choosing which world to
  // revisit first, so naming one here would be putting a decision the
  // story hasn't made yet ahead of itself. Ch.6 onward names real,
  // already-built locations (the Unknown Harbour, in this batch) since
  // those are explicitly called out by name in the outline.
  //
  // Per request, this file only wires the chapters themselves — same
  // deferred-integration approach as Arc XVII/XVIII: not registered
  // with the objective-chain aggregator, that's still being handled
  // separately.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (ch0N-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC19_CHAPTERS = [
    {id:1, title:'The Way Back', focus:"The Crimson Tide decides which previously visited world to revisit first.", image:'assets/comics/arc19/ch01-the-way-back.png', xp:290, action:'🧭 Choose the Way Back'},
    {id:2, title:'Old Shores, Changed Places', focus:"The crew returns to an earlier world and sees what changed after they left.", image:'assets/comics/arc19/ch02-old-shores-changed-places.png', xp:300, action:'⚓ Return to the Shore'},
    {id:3, title:'Promises We Made', focus:"The crew follows up on an old agreement or commitment.", image:'assets/comics/arc19/ch03-promises-we-made.png', xp:300, action:'🤝 Follow Up on the Promise'},
    {id:4, title:'The People We Left Behind', focus:"The crew reconnects with people who became important to them.", image:'assets/comics/arc19/ch04-the-people-we-left-behind.png', xp:310, action:'👋 Reconnect'},
    {id:5, title:'What Our Choices Changed', focus:"Consequences of an earlier decision surface.", image:'assets/comics/arc19/ch05-what-our-choices-changed.png', xp:300, action:'🔍 See What Changed'},
    {id:6, title:'The Harbour Remembers', focus:"The crew returns to the Unknown Harbour and deals with the relationship they've built there.", image:'assets/comics/arc19/ch06-the-harbour-remembers.png', xp:320, action:'⚓ Return to the Harbour'},
    {id:7, title:'Beneath Familiar Waters', focus:"The crew revisits the Underwater World, now approaching it differently because of what they've learned.", image:'assets/comics/arc19/ch07-beneath-familiar-waters.png', xp:310, action:'🌊 Dive Back In'},
    {id:8, title:'The Pack We Know', focus:"The crew returns to the Werewolf World and explores how their previous intervention affected the people there.", image:'assets/comics/arc19/ch08-the-pack-we-know.png', xp:310, action:'🐾 Return to the Pack'},
    {id:9, title:'The Price of Taking', focus:"The crew revisits the Resource World and confronts the consequences of treating rare resources responsibly.", image:'assets/comics/arc19/ch09-the-price-of-taking.png', xp:320, action:'💎 Face the Consequences'},
    {id:10, title:'A Network of Lives', focus:"San realizes the inter-world routes have become relationships rather than simply travel routes.", image:'assets/comics/arc19/ch10-a-network-of-lives.png', xp:300, action:'🕸️ See the Network Differently'},
    {id:11, title:"The Road That Wasn't There", focus:"While following one of these connections, the crew encounters something that wasn't part of their previous understanding of the network.", image:'assets/comics/arc19/ch11-the-road-that-wasnt-there.png', xp:310, action:'🌀 Follow the Unknown Road'},
    {id:12, title:'The Fountain Beyond the Horizon', focus:"The Fountain of Youth is discovered. The chapter ends on the discovery itself, rather than immediately using it.", image:'assets/comics/arc19/ch12-the-fountain-beyond-the-horizon.png', xp:560, action:'✨ Discover the Fountain'},
    {id:13, title:"The Guardian's Challenge", focus:"The crew learns the Fountain isn't simply reachable — something guards it, and reaching the water means proving something to whatever that is first. Unlocks the Guardian's Trial in the Archive once the crew is strong enough.", image:'assets/comics/arc19/ch13-the-guardians-challenge.png', xp:340, action:"🛡️ Face What Guards It"},
    {id:14, title:'What the Fountain Gave', focus:"With the Guardian's Trial behind them, the crew receives the Fountain's blessing — and reckons with what a second chance at their own bodies actually means, without losing anything they built to get here. Only completes once the Guardian's Trial raid has been cleared.", image:'assets/comics/arc19/ch14-what-the-fountain-gave.png', xp:650, action:"💧 Receive the Fountain's Gift"}
  ];
  window.ARC19_CHAPTERS = ARC19_CHAPTERS;

  const ARC19_CHAPTER_SCENES = {
    1: "There are more worlds behind them now than most people ever get to see in a lifetime, and for the first time since the Crimson Tide started moving forward, San asks a different kind of question.<br><br>Not where next. Where back.<br><br>It isn't a small list. Every world they've touched left something unfinished — a promise, a face, a decision nobody's checked back in on. Renn spreads the old charts out and doesn't try to hide how much he enjoys this particular kind of problem.<br><br>They don't pick the easiest one. San picks the one that's been sitting heaviest, the longest, without either of them saying so out loud.",
    2: "Nothing about the approach feels the same, even though the coastline is exactly where they left it.<br><br>Time moved here too, whether or not the crew was around to watch it happen. Buildings that didn't exist before. Faces that do, aged in ways the crew wasn't there to see happen gradually. A rhythm to the place that's shifted, subtly, into something the Crimson Tide has to relearn rather than simply remember.<br><br>Joel says it best, standing at the rail. \"We left this place. It didn't wait for us to come back.\"",
    3: "Somebody here is owed something, and San doesn't let herself pretend she'd forgotten what.<br><br>It isn't dramatic — no grand vow broken, no villain to blame for the gap. Just an agreement made in good faith, months or years ago, that got quietly outpaced by everything else the crew had to do in the meantime.<br><br>Following up on it now means admitting how long it's been. San does it anyway. Whatever this promise cost to keep, it costs more to keep pretending it was already settled.",
    4: "Some faces are easier to find than others. All of them are harder to face than San expected.<br><br>These aren't strangers. They're people who mattered, once, in the middle of whatever crisis first brought the crew through — and then the crew left, the way they always eventually do, onto the next world and the next problem.<br><br>Reconnecting isn't seamless. There's a gap to close, questions about why it took this long, and not everyone is entirely happy to see them. But there's warmth in it too, underneath the awkwardness — proof that what they built here the first time was real, even after all this time apart.",
    5: "Every decision the crew made here, back when this world was new to them, is still quietly working itself out — whether anyone was watching or not.<br><br>Some of it turned out well. Some of it didn't, not entirely, in ways nobody could have predicted at the time. San sits with the parts that didn't, longer than she sits with the parts that did.<br><br>\"We did the best we could with what we knew,\" Erynn offers.<br><br>\"I know,\" San says. \"That's not the same as it being enough.\"",
    6: "The Unknown Harbour hasn't forgotten them — not the relationship the crew spent Arc XIII actually earning, patiently, one honest interaction at a time.<br><br>What's waiting for them isn't a reset. It's continuation. The trust they built is still there, still theirs, even after however long it's been since the Crimson Tide last docked. But trust doesn't just sit still either. It has to be tended, the same way it was built — and the Harbour has its own updates, its own changes, its own version of everything that's happened since the crew was last here.<br><br>San doesn't take the welcome for granted. She's learned better than that by now.",
    7: "The currents feel different this time, and it takes San a moment to realize why: it isn't the water that's changed. It's how the crew reads it.<br><br>Soel goes still at the rail the way Soel always does before something is about to matter, and this time nobody has to ask what for. The settlement is still there, the reef community still moving through its own rhythms — but the crew doesn't approach it the way they did the first time, cautious and half-blind to what they were actually looking at.<br><br>They know what a current means now. They know what it costs to misread one. That knowledge doesn't make the return simple. It just makes it honest.",
    8: "The Werewolf World doesn't need the crew to prove themselves again. That much is clear within minutes of arriving.<br><br>What the crew left behind, back during Arc XV, wasn't just an intervention — it was a choice about what a different shape does and doesn't mean, and it's still shaping how this world moves, months later, in ways San only half expected. Some of it is better than she hoped. Some of it is more complicated than she was ready for.<br><br>Nobody here treats the crew as strangers. Nobody treats them as saviors either. They're just people who did something, once, and are back to see what it actually became.",
    9: "The resource world remembers exactly what the crew chose not to take, back in Arc XVI — and exactly what they chose to take instead, carefully, with permission, leaving the rest where it belonged.<br><br>San half-expects a simple thank-you. What she gets is more complicated. The dragons are still here, still part of an ecosystem the crew only partly understands even now. The guardians are still watching, still weighing whether the crew's restraint back then was a one-time decision or something the Crimson Tide actually believes in.<br><br>\"You didn't take everything,\" one of them says. \"That's not the same as never wanting to.\"<br><br>San doesn't argue with that. It's fair.",
    10: "Somewhere between the fourth world and the fifth, San stops thinking of the routes as a map.<br><br>They were never just lines between places — not really, not for a long time now. Every route she's followed this arc connects to a person, a promise, a consequence still working itself out. The Harbour. The reef. The pack. The dragons and their guardians. All of it tangled together, not by geography, but by everything the crew actually did in each place.<br><br>\"We didn't just discover routes,\" San says, half to herself. \"We built relationships. The routes were just how we got there.\"",
    11: "It shouldn't exist. That's the first thing Renn says, and he says it more than once, checking the same readings from three different angles before he'll trust them.<br><br>Every route the crew has followed this arc was already known — charted, however roughly, by something they understood before they set out. This one isn't. It doesn't match the Archive's records. It doesn't match anything Erynn's cross-referenced.<br><br>\"It's not on any map we have,\" Erynn says. \"Which means either the map is wrong, or something built this after we already thought we understood the whole network.\"<br><br>Nobody has an answer yet. San marks the coordinates anyway.",
    12: "They almost don't follow it. San almost calls it a problem for another day, another arc, another version of the crew with more time to spare.<br><br>She follows it anyway.<br><br>What's waiting at the end isn't a settlement, and it isn't a threat. It's something older than either — a place the readings can't quite explain, guarded, deliberate, humming with something that isn't quite like anything the Horizon Engine has ever detected before.<br><br>Renn doesn't have a name for it yet. Erynn finds one first, buried in a fragment nobody thought to translate until now.<br><br>The Fountain of Youth.<br><br>Nobody moves toward it. Not yet. San looks at it a long time, and doesn't reach for the door.",
    13: "Nobody reaches for the door. Not yet.<br><br>Erynn's the one who says it first, crouched by the entrance with her instruments spread around her. \"Something's watching this. Not us, specifically. The whole approach.\"<br><br>Renn doesn't argue — he's found the same thing from a different angle, and neither of them likes what it implies. Whatever the Fountain actually is, it isn't undefended. Something stands between the crew and whatever's waiting past that door, and it isn't going to step aside because they asked politely.<br><br>\"So we don't just walk in,\" Joel says. Not really a question.<br><br>\"We earn it,\" Erynn says. \"Same as everything else.\"<br><br>San doesn't argue either. Whatever's guarding this place isn't interested in who the crew used to be — only in whether they're actually ready now, not just willing. That's a different question, and she isn't sure yet how she'd answer it.",
    14: "The Guardian doesn't fall so much as it stops. Whatever held that shape settles into something quieter, and what's left behind isn't a threat — it's an invitation.<br><br>The Fountain itself is smaller than San expected. Barely a fountain at all, really — just water, moving where water shouldn't be moving, in a place old enough that the readings can't agree on how old.<br><br>She doesn't hesitate as long as she thought she would.<br><br>What changes afterward isn't dramatic, not from the outside. Still San. Still Joel. Still exactly who they were an hour ago, down to the argument they were having on the way in. But something underneath has eased that neither of them realized they'd been carrying so heavily until it wasn't there anymore — a body given back some of what years and a hard decade at sea had quietly taken from it.<br><br>\"I don't feel any different,\" Joel says, which isn't quite true, and they both know it.<br><br>\"You will,\" Erynn says. \"Give it a week.\"<br><br>San doesn't ask the Fountain for a different life. She already has the one she wants. She just gets to keep living it a little longer, a little steadier, in the body that's been doing the actual work all along.<br><br>The Fountain keeps flowing behind them as the crew makes their way back to the ship. It doesn't need them to come back. It'll still be here, doing exactly this, long after they've gone."
  };
  window.ARC19_CHAPTER_SCENES = ARC19_CHAPTER_SCENES;

  window.arc19ObjectiveState = function(){
    if (!game.arc18Complete) return null;
    if (level() < 285) return null;
    game.comicProgress19 = game.comicProgress19 || {};
    for (const ch of ARC19_CHAPTERS) {
      if (game.comicProgress19[ch.id]) continue;
      // Ch.14 doesn't follow the normal "matches the current objective"
      // rule — same exception class as arc6.js's Ch.15/robinServiceDone():
      // it's independently gated on the Guardian's Trial raid actually
      // being cleared, not just on Ch.13 having been read.
      if (ch.id === 14 && !(typeof window.raidCleared === 'function' && window.raidCleared('guardian_trial'))) {
        return 'arc19_awaiting_guardian_trial';
      }
      return 'complete_arc19_chapter_' + ch.id;
    }
    return 'arc19_part1_complete_for_now';
  };

  window.markArc19ChapterRead = function(id){
    const so = window.arc19ObjectiveState();
    if (so !== ('complete_arc19_chapter_' + id)) return;
    game.comicProgress19 = game.comicProgress19 || {};
    game.comicProgress19[id] = true;
    // Matches every prior arc's own completion flag (arc17/arc18Complete)
    // — self-contained to this file, no aggregator dependency. Moved from
    // Ch.12 to Ch.14: Ch.12 only discovers the Fountain, it doesn't end
    // the arc anymore now that the Guardian's Trial payoff lives here too.
    if (id === 14) game.arc19Complete = true;
    const ch = ARC19_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC19_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC19_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc19Splash = function(){
    const overlay = document.getElementById('arc19SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc19Splash = function(){
    const overlay = document.getElementById('arc19SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc19SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc19 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc19) oldRenderStoryForArc19();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc19Ready = window.arc19ObjectiveState() !== null;
    if (arc19Ready && !game.arc19SplashSeen && typeof window.__ctShowArc19Splash === 'function') {
      window.__ctShowArc19Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc19/arc19-the-worlds-we-know.png" alt="Arc XIX — The Worlds We Know" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XIX</div><div class="story-act-title">The Worlds We Know</div>'+
      '<div class="story-act-tagline">Before anything new — everything they never finished.</div></div>';
    if (!arc19Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XIX Locked</div><div class="story-chapter-sub">'+
        (!game.arc18Complete ? 'Finish Arc XVIII first.' : 'Reach Level 285 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc19ObjectiveState();
    ARC19_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress19 && game.comicProgress19[ch.id]);
      const ready = !done && so===('complete_arc19_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc19ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else if (ch.id === 14 && so === 'arc19_awaiting_guardian_trial') {
        action = '<div class="story-chip">🔒 Clear The Guardian\'s Trial (Archive → Raids) first.</div>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc19_awaiting_guardian_trial'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✨ The Guardian stands between the crew and the Fountain. Find The Guardian\'s Trial in the Archive\'s Raids panel when ready.</div></div>';
    } else if (so==='arc19_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XIX chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
