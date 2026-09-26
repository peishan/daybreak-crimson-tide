(function(){
  // -------------------------------------------------------------------
  // ARC XX — FOREVER AND EVER. Chapters 1-10 wired — Part I ("Coming
  // Home") and Part II ("Fair Tide"), including Ate Joy's proper
  // present-day introduction (Ch.9-10). Gated at arc19Complete + level
  // 300, continuing the established +15-per-arc ladder (XVII:255,
  // XVIII:270, XIX:285, XX:300).
  //
  // Tonally different from every arc since Arc XV — this is the
  // deliberate "catching up" / slow-down arc: no expedition, no
  // Charter, no Guardian trial. XP values are accordingly lower than
  // the high-stakes arcs (roughly 260-290 for Part I) to match the
  // quieter subject matter, not because anything's undervalued.
  //
  // Per request, this file only wires the chapters themselves — same
  // deferred-integration approach as Arc XVII/XVIII/XIX: not registered
  // with the objective-chain aggregator, that's still being handled
  // separately.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (ch0N-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC20_CHAPTERS = [
    {id:1, title:'Home Again', focus:"The crew returns to Fair Tide after Arc XIX and settles back into familiar routines.", image:'assets/comics/arc20/ch01-home-again.png', xp:270, action:'🏠 Come Home'},
    {id:2, title:"The Captain's Day Off", focus:"Joel decides San needs an actual day off. San disagrees. Joel insists.", image:'assets/comics/arc20/ch02-the-captains-day-off.png', xp:260, action:'☕ Take the Day Off'},
    {id:3, title:'Breakfast for Two', focus:"A quiet domestic chapter — San and Joel enjoying an ordinary morning together. Coffee, food, Soel, and the simple comfort of being home.", image:'assets/comics/arc20/ch03-breakfast-for-two.png', xp:260, action:'🍳 Make Breakfast'},
    {id:4, title:'The Little Argument', focus:"San and Joel have a small couple's argument — nothing dramatic or relationship-threatening, just two people who love each other getting irritated with each other.", image:'assets/comics/arc20/ch04-the-little-argument.png', xp:270, action:'😤 Have It Out'},
    {id:5, title:'Still Us', focus:"San and Joel make up and reflect on how much they've experienced together. Despite everything that has changed, they are still simply San and Joel.", image:'assets/comics/arc20/ch05-still-us.png', xp:290, action:'💛 Make Up'},
    {id:6, title:'The Market', focus:"San and Joel go shopping together, and a completely unnecessary disagreement develops over something trivial.", image:'assets/comics/arc20/ch06-the-market.png', xp:260, action:'🛒 Go to Market'},
    {id:7, title:"Don't Touch My Stuff", focus:"A light domestic comedy chapter involving someone moving something that absolutely should not have been moved.", image:'assets/comics/arc20/ch07-dont-touch-my-stuff.png', xp:260, action:'😠 Defend Your Stuff'},
    {id:8, title:'Family Dinner', focus:"The wider Fair Tide family gathers — Aisyah, Mez, Eliz, Senedra, Zaki, and the rest of the community get time together without an expedition or major crisis.", image:'assets/comics/arc20/ch08-family-dinner.png', xp:280, action:'🍽️ Gather for Dinner'},
    {id:9, title:'Ate Joy', focus:"Ate Joy receives her proper present-day introduction. San already knows Joy from Joel's old-world video calls, but this is the first time she meets the Veyren version of Joy in person. Joy becomes established as a storyline character and Warden.", image:'assets/comics/arc20/ch09-ate-joy.png', xp:310, action:'👋 Meet Ate Joy'},
    {id:10, title:'The Family We Chose', focus:"Joy becomes more integrated into Fair Tide and begins establishing her own place within the community, focused on family bonds, belonging, and the life people have built together.", image:'assets/comics/arc20/ch10-the-family-we-chose.png', xp:290, action:'👨‍👩‍👧‍👦 Welcome Her In'}
  ];
  window.ARC20_CHAPTERS = ARC20_CHAPTERS;

  const ARC20_CHAPTER_SCENES = {
    1: "Fair Tide looks exactly the way they left it, and somehow that's the part that gets to San first — not some dramatic homecoming, just the ordinary sight of it, still standing, still theirs.<br><br>Nobody makes a speech about it. Zaki starts unloading cargo before the ship's even properly moored. Aisyah's already complaining about the state of the market stalls. Soel disappears somewhere warm within the first ten minutes.<br><br>San stands on the dock a moment longer than she needs to, just looking at the place. After the Archive, after the Fountain, after everything the last few arcs asked of them, this is what she missed most. Not a mission. Just this.",
    2: "Joel brings it up over breakfast, in the tone he uses when he's already decided and is only pretending to negotiate.<br><br>\"You're taking a day off.\"<br><br>\"I don't need a day off.\"<br><br>\"You've had exactly zero of them since we got back.\"<br><br>San opens her mouth to list the reasons that's untrue, and can't actually think of one. Joel watches her fail to argue with visible satisfaction.<br><br>\"That's what I thought,\" he says. \"One day. No Objective screen, no crew requests, no Horizon Engine. Just you.\"<br><br>She agrees to it like she's doing him a favor. They both know better.",
    3: "It's a small thing, and that's exactly why it matters.<br><br>Coffee, made too strong the way San secretly prefers it. Something simple cooking that fills the whole kitchen with smell before either of them says much of anything. Soel underfoot, unbothered, exactly where Soel always ends up when there's food involved.<br><br>Nobody's tracking a route today. Nobody's reading old records or drafting a Charter or bracing for whatever's next. It's just a morning, ordinary in a way that would have sounded impossible to San a few arcs ago, and precious for exactly that reason.",
    4: "It starts over something neither of them will be able to explain clearly by dinner — whose turn it was to handle something, who said what first, who's actually annoyed and who's just annoyed on principle now.<br><br>It isn't a crisis. Nobody's raising real stakes. It's just two people who love each other getting genuinely, pettily irritated with each other over something small enough that the argument itself is almost funny in hindsight.<br><br>\"I'm not wrong,\" Joel says.<br><br>\"You're not right either,\" San says.<br><br>Neither of them backs down for at least another hour.",
    5: "It resolves the way these things usually do between them — not with a grand gesture, just with someone finally laughing first, and the other one giving in a moment later.<br><br>Sitting together afterward, San finds herself thinking back over everything that's happened since they met. Worlds crossed. An Archive older than either of them can fully comprehend. A Fountain they haven't even opened yet. Routes other people want to fight over.<br><br>And underneath all of it, somehow, still this. Still the two of them, irritated over nothing and laughing about it twenty minutes later.<br><br>\"We've been through a lot,\" San says.<br><br>\"We have,\" Joel agrees. \"And we're still just us.\"<br><br>\"Still us,\" San says, and means it more than the words probably deserve credit for.",
    6: "It should be simple. Two people, a list, a market they've walked through a hundred times.<br><br>It is not simple.<br><br>San wants the stall on the left. Joel's convinced the one on the right has better fish, and has apparently been convinced of this for years without ever mentioning it. What starts as a mild disagreement about produce turns, within minutes, into something neither of them can quite explain escalating so fast.<br><br>\"It's fish, San.\"<br><br>\"You started it.\"<br><br>\"I didn't start anything, I made an observation.\"<br><br>They buy from both stalls. Neither of them admits defeat.",
    7: "There is a specific mug. San has never said this out loud, has never needed to, because until this morning nobody has ever dared move it.<br><br>Someone has moved it.<br><br>The ensuing investigation is disproportionate to the crime by any reasonable measure, and San pursues it anyway, working her way through the household with the same focus she'd bring to tracking down a stolen ship. Joel finds the entire thing deeply, openly funny, right up until San turns the same investigative energy on whoever's been reorganizing his tools.<br><br>Nobody confesses. The mug returns to its spot regardless, by morning, like it never left.",
    8: "Nobody organizes it, exactly. It just happens, the way it always does when enough of Fair Tide's people end up free on the same evening — Aisyah showing up with opinions about the food, Mez already teasing someone before the plates are even out, Eliz and Senedra deep in a conversation nobody else can quite follow, Zaki quietly making sure there's enough of everything for everyone.<br><br>No expedition to plan. No crisis to manage. Just a table too small for the number of people trying to sit at it, and nobody minding.<br><br>San looks around at some point in the middle of it and just lets herself enjoy being exactly where she is.",
    9: "San's known Joy for a long time, in a way — video calls, Joel's stories, a voice and a face from a world that isn't this one anymore. But that isn't the same as this: Joy, actually here, actually real in a way a screen never quite managed to be.<br><br>It's strange for both of them at first, in different ways. San's meeting a person she's only ever known secondhand. Joy's meeting the version of her brother's life that exists entirely outside anything she witnessed happening.<br><br>It doesn't take long to settle. Joy has Joel's directness and none of his patience for pretending things are fine when they aren't, and San likes her immediately for exactly that reason.<br><br>\"So you're the one keeping my brother in line,\" Joy says.<br><br>\"Somebody has to,\" San says.<br><br>Joy grins. \"I like her,\" she tells Joel, like San isn't standing right there.",
    10: "Joy doesn't stay a guest for long. That's not really how Fair Tide works, San's noticed — people don't visit so much as they gradually, almost without anyone deciding it, become part of the place.<br><br>It happens the way it always does. A role she settles into. People who start looking for her when something needs doing. A seat that's just hers now, without anyone assigning it.<br><br>San watches it happen with something like quiet satisfaction. Fair Tide was never just a settlement she happened to build. It's the family she and Joel ended up choosing, piece by piece, person by person — and watching it grow to include Joy doesn't feel like an addition so much as something that was always going to happen eventually."
  };
  window.ARC20_CHAPTER_SCENES = ARC20_CHAPTER_SCENES;

  window.arc20ObjectiveState = function(){
    if (!game.arc19Complete) return null;
    if (level() < 300) return null;
    game.comicProgress20 = game.comicProgress20 || {};
    for (const ch of ARC20_CHAPTERS) {
      if (!game.comicProgress20[ch.id]) return 'complete_arc20_chapter_' + ch.id;
    }
    return 'arc20_part1_complete_for_now';
  };

  window.markArc20ChapterRead = function(id){
    const so = window.arc20ObjectiveState();
    if (so !== ('complete_arc20_chapter_' + id)) return;
    game.comicProgress20 = game.comicProgress20 || {};
    game.comicProgress20[id] = true;
    // Ate Joy's recruitment hook — Ch.9 ("Ate Joy") is her proper
    // present-day introduction. Same mechanism as every other companion's
    // introducing chapter (game.foundCompanions), which memberUnlocked()'s
    // default fallback in core-engine.js already reads without needing a
    // special case there.
    if (id === 9) {
      game.foundCompanions = game.foundCompanions || {};
      game.foundCompanions['ate_joy'] = true;
    }
    const ch = ARC20_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC20_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC20_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  const oldRenderStoryForArc20 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc20) oldRenderStoryForArc20();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc20Ready = window.arc20ObjectiveState() !== null;
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<div class="story-act-kicker">Arc XX</div><div class="story-act-title">Forever and Ever</div>'+
      '<div class="story-act-tagline">After everything — the people behind the adventures.</div></div>';
    if (!arc20Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XX Locked</div><div class="story-chapter-sub">'+
        (!game.arc19Complete ? 'Finish Arc XIX first.' : 'Reach Level 300 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc20ObjectiveState();
    ARC20_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress20 && game.comicProgress20[ch.id]);
      const ready = !done && so===('complete_arc20_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc20ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc20_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XX chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
