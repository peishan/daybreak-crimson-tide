(function(){
  // -------------------------------------------------------------------
  // ARC XX — FOREVER AND EVER. Now fully wired, all 24 chapters — Part
  // I ("Coming Home"), Part II ("Fair Tide"), Part III ("New Faces"),
  // Part IV ("Life Around Fair Tide"), Part V ("San & Joel"), and Part
  // VI ("The Life We Built"). Gated at arc19Complete + level 300,
  // continuing the established +15-per-arc ladder (XVII:255, XVIII:270,
  // XIX:285, XX:300). Ch.24 sets game.arc20Complete = true, matching
  // every other arc's own finale flag.
  //
  // Per the outline, Ch.13 deliberately establishes Caelan entirely on
  // his own terms — no mention of Joy, no foreshadowing of any eventual
  // connection between them. Ch.17 is where that connection actually
  // surfaces, and even there it stays exactly as understated as the
  // outline calls for: no romance declared, just two people getting
  // along, with Joel's reaction doing all the narrative work instead.
  //
  // XP curve is deliberately uneven on purpose, not an oversight: most
  // chapters sit in the 260-300 range (matching this arc's quieter,
  // domestic tone), Ch.20 ("Forever and Ever") spikes to 400 as the
  // outline's explicitly named emotional centerpiece, and Ch.24 closes
  // at 380 — a real finale bump, but deliberately kept below Ch.20's
  // rather than following the huge finale-spike pattern other arcs use
  // (520-560), since only one chapter in this arc should hold the
  // "centerpiece" weight, and the outline frames Ch.24 as quiet, not
  // climactic.
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
    {id:10, title:'The Family We Chose', focus:"Joy becomes more integrated into Fair Tide and begins establishing her own place within the community, focused on family bonds, belonging, and the life people have built together.", image:'assets/comics/arc20/ch10-the-family-we-chose.png', xp:290, action:'👨‍👩‍👧‍👦 Welcome Her In'},
    {id:11, title:"Aisyah's Advice", focus:"Aisyah gives San unsolicited relationship advice. San did not ask for it. Aisyah gives it anyway.", image:'assets/comics/arc20/ch11-aisyahs-advice.png', xp:260, action:'💬 Hear Her Out'},
    {id:12, title:'Mez Makes It Worse', focus:"Mez gets involved in a situation that should probably have remained between San and Joel. Naturally, this makes everything worse.", image:'assets/comics/arc20/ch12-mez-makes-it-worse.png', xp:270, action:'🙈 Watch It Unfold'},
    {id:13, title:'A Stranger at Fair Tide', focus:"Caelan is introduced — completely native to Veyren, with no connection to the old world. His background, personality, magical abilities, and work are established independently of Joy. His eventual connection to her is not revealed.", image:'assets/comics/arc20/ch13-a-stranger-at-fair-tide.png', xp:300, action:'🤝 Meet Caelan'},
    {id:14, title:'The Things We Notice', focus:"A quieter chapter about the crew noticing how much Fair Tide and its community have grown, each reflecting on how their lives have changed since arriving in Veyren.", image:'assets/comics/arc20/ch14-the-things-we-notice.png', xp:280, action:"👀 Notice How Far They've Come"},
    {id:15, title:'The Crew We Built', focus:"An ensemble chapter focusing on the people who now make Fair Tide feel like home — everyone with different responsibilities, personalities, and relationships within the community.", image:'assets/comics/arc20/ch15-the-crew-we-built.png', xp:270, action:'👥 See Who They\'ve Become'},
    {id:16, title:'The Little Things', focus:"A collection of ordinary Fair Tide moments — meals, work, errands, training, teasing, small acts of kindness. Life between adventures.", image:'assets/comics/arc20/ch16-the-little-things.png', xp:260, action:'🌤️ Notice the Little Things'},
    {id:17, title:'The Brother Thing', focus:"Joy and Caelan cross paths naturally, with no formal romance. Joel notices Caelan and becomes extremely protective of his sister. Joy reminds him she's an adult who can make her own decisions. San is mostly trying not to laugh.", image:'assets/comics/arc20/ch17-the-brother-thing.png', xp:300, action:'😅 Watch Joel Panic'},
    {id:18, title:'The Small Fight', focus:"San and Joel have another disagreement — more personal this time, allowing both of them to confront something they've been avoiding.", image:'assets/comics/arc20/ch18-the-small-fight.png', xp:290, action:"😔 Face What We've Avoided"},
    {id:19, title:'The Apology', focus:"San and Joel talk honestly, listen to each other, acknowledge their mistakes, and reconnect — reinforcing that their relationship is built on communication rather than perfection.", image:'assets/comics/arc20/ch19-the-apology.png', xp:300, action:'💬 Talk It Through Honestly'},
    {id:20, title:'Forever and Ever', focus:"The emotional centerpiece of the arc. San and Joel share a deeply personal romantic moment. Joel tells San he is with her forever and ever — a commitment about the people they are now and the life they have chosen together.", image:'assets/comics/arc20/ch20-forever-and-ever.png', xp:400, action:'💍 Forever and Ever'},
    {id:21, title:'The Morning After', focus:"A quiet chapter following the emotional events of Ch.20 — San and Joel simply continue their life together.", image:'assets/comics/arc20/ch21-the-morning-after.png', xp:270, action:'☀️ Wake Up Together'},
    {id:22, title:'Another Day at Fair Tide', focus:"The crew returns to ordinary routines. Fair Tide continues growing as a home, community, and place where people can build lives beyond adventuring.", image:'assets/comics/arc20/ch22-another-day-at-fair-tide.png', xp:260, action:'🌊 Another Ordinary Day'},
    {id:23, title:'Still People', focus:"A reflective ensemble chapter — the crew has crossed worlds, fought powerful enemies, built impossible technology, and changed Veyren, but they are still people. They laugh, argue, make mistakes, love, eat together, and live.", image:'assets/comics/arc20/ch23-still-people.png', xp:290, action:'❤️ Still People'},
    {id:24, title:'Forever Starts Here', focus:"The arc closes quietly at Fair Tide. The wider worlds are still waiting, and future expeditions and challenges will come — but for now, Fair Tide is home. San and Joel stand together, looking toward the future they have built, in no hurry to rush toward it.", image:'assets/comics/arc20/ch24-forever-starts-here.png', xp:380, action:'🌅 Forever Starts Here'}
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
    10: "Joy doesn't stay a guest for long. That's not really how Fair Tide works, San's noticed — people don't visit so much as they gradually, almost without anyone deciding it, become part of the place.<br><br>It happens the way it always does. A role she settles into. People who start looking for her when something needs doing. A seat that's just hers now, without anyone assigning it.<br><br>San watches it happen with something like quiet satisfaction. Fair Tide was never just a settlement she happened to build. It's the family she and Joel ended up choosing, piece by piece, person by person — and watching it grow to include Joy doesn't feel like an addition so much as something that was always going to happen eventually.",
    11: "San did not ask for relationship advice. San would like that noted, clearly, for the record.<br><br>Aisyah gives it anyway, unprompted, with the total confidence of someone who has never once been discouraged by a lack of invitation. Most of it is, annoyingly, not wrong. Some of it is wildly, confidently off base. All of it is delivered with the same unshakeable certainty.<br><br>\"I didn't ask,\" San says, for the third time.<br><br>\"I know,\" Aisyah says. \"That's not really how advice works, though, is it?\"",
    12: "It should have stayed between San and Joel. Small, private, easily resolved without an audience.<br><br>Mez gets involved anyway — not maliciously, not even really on purpose, just Mez being exactly as subtle as Mez has ever been about anything, which is to say not remotely. What was a minor thing becomes, within an afternoon, a minor thing everyone at Fair Tide apparently has an opinion about.<br><br>\"I was trying to help,\" Mez says, when San corners them about it.<br><br>\"You were trying to help,\" San repeats.<br><br>\"...It didn't help. I see that now.\"",
    13: "Caelan doesn't arrive with fanfare, and doesn't need to. He's Veyren, fully — no old-world memory, no borrowed context, nothing about him shaped by a life before this one the way so much of the crew's story has been.<br><br>He's easy to talk to, good at what he does, and entirely his own person before anyone at Fair Tide even thinks to wonder how he might fit into anyone else's story.<br><br>Nobody mentions Joy. There's no reason to, not yet — he's simply someone new, worth knowing on his own terms, and Fair Tide has room for exactly that kind of arrival without needing it to mean anything more.",
    14: "It happens in a quiet moment, the kind that used to be rare and isn't anymore. Someone looks around and actually sees how much has changed.<br><br>Aisyah remembers when the market was three stalls and a hopeful sign. Zaki remembers when there wasn't enough food to worry about wasting any. Renn, in his own way, remembers being the only one who understood what the Horizon Engine even was.<br><br>None of them say it like a speech. It's smaller than that — a comment here, a look there, the accumulated weight of everyone quietly registering how far Fair Tide, and all of them, have actually come.",
    15: "It's not one moment so much as an accumulation of them — everyone at Fair Tide doing exactly the thing they've quietly become known for, without anyone having assigned it to them formally.<br><br>Aisyah runs half the market's actual decisions without ever needing the title for it. Zaki keeps everyone fed and doesn't make a show of how much work that actually is. Mez talks to absolutely everyone, about absolutely everything, whether or not anyone asked. Renn, Erynn, and Mimi have carved out their own corner of the place entirely by being useful in ways nobody else could be.<br><br>None of them set out to become this. San watches them anyway, all of them, and recognizes something she built without quite meaning to: not a crew anymore, not really. A home with people in it.",
    16: "Nothing in this chapter would make it into anyone's account of the Crimson Tide's great adventures, and that's rather the point.<br><br>A meal shared standing up because nobody bothered sitting down properly. An errand that takes twice as long as it should because everyone keeps stopping to talk. A training session that turns into good-natured teasing halfway through. Someone quietly covering for someone else's mistake before anyone else even notices there was one.<br><br>It's ordinary, all of it. San's stopped taking that for granted. Ordinary was never guaranteed, not for any of them — and here it is anyway, stitched together out of a hundred small unremarkable moments that add up to something that feels, unmistakably, like a life.",
    17: "It happens naturally, the way most things at Fair Tide eventually do — Joy and Caelan crossing paths, talking, getting along in the unremarkable way two people get along when there's nothing forced about it.<br><br>There's no grand romantic gesture. No declaration. Just two people who seem to enjoy each other's company, which would be entirely unremarkable except that Joel notices, and once Joel notices something, Joel does not simply let it be unremarkable.<br><br>\"I'm just saying,\" he starts.<br><br>\"You're doing the thing,\" Joy says, without looking up.<br><br>\"I'm not doing a thing.\"<br><br>\"You're doing the overprotective brother thing. I'm an adult, Joel. I've been an adult for a while now.\"<br><br>\"I'm aware of how old you are.\"<br><br>\"Then act like it.\"<br><br>San, wisely, says nothing at all — mostly because she's trying very hard not to laugh, and only partly succeeding.",
    18: "This one doesn't stay small the way the market argument did, or the mug did. It just starts small, the way the real ones always seem to.<br><br>It circles something San's been quietly not saying for a while — not a secret exactly, more a thing she's let sit unexamined because looking at it directly felt harder than just not looking. Joel notices. Joel always notices, eventually, even when San would rather he didn't.<br><br>\"You've been doing this since we got back,\" he says. Not accusing. Just naming it.<br><br>\"Doing what.\"<br><br>\"Deciding things are fine because you'd rather they were, instead of because they actually are.\"<br><br>San doesn't have a quick answer for that. That's how she knows he's right.",
    19: "Neither of them tries to win this one. That's the difference, San thinks, between this and every argument that came before it this arc — nobody's trying to be right. They're just trying to actually hear each other.<br><br>She tells him what she's been avoiding, finally, plainly, without dressing it up to sound less true than it is. He tells her what it looked like from where he was standing, watching her do it. Neither version is comfortable. Both of them are honest.<br><br>\"I should have said something sooner,\" San says.<br><br>\"You're saying it now,\" Joel says. \"That still counts.\"<br><br>It isn't a grand reconciliation. It's smaller and more real than that — two people choosing, again, to actually talk to each other instead of just getting past the moment.",
    20: "It isn't planned. That's what makes it feel true, San thinks later — no occasion, no staged moment, just the two of them somewhere quiet at the end of an ordinary day, still a little worn from everything the last two chapters asked of them.<br><br>Joel doesn't build up to it with a speech. He just says it, plainly, the way he says the things that matter most to him.<br><br>\"I'm with you,\" he says. \"Forever and ever. Not because of anything we're supposed to become. Because of who we already are.\"<br><br>San doesn't answer right away. She doesn't need to rush it — for once, there's no expedition waiting, no Objective screen, no reason this moment has to end the second it's said.<br><br>\"Forever and ever,\" she says back, finally, and means every part of it. Not the people they were on Earth. Not some future version of themselves still waiting to arrive. Exactly who they are, right now, choosing each other again — the way they've chosen each other every day since the first time they didn't have to.",
    21: "Nothing about the morning announces itself as significant, and that's exactly right. San wakes up the way she always does, Joel already awake beside her, Soel taking up more of the bed than either of them remembers allowing.<br><br>Neither of them brings up last night directly. They don't need to. It's just there now, quietly, the way the important things eventually settle into simply being true instead of needing to be discussed.<br><br>San makes the coffee too strong again. Joel doesn't complain. Some mornings don't need to be more than this.",
    22: "The market opens. Aisyah argues with a supplier about prices that were, by her account, perfectly reasonable yesterday. Zaki loses track of the day somewhere around the third errand. Mez finds someone new to tease before breakfast is even finished.<br><br>Nothing about today asks anything extraordinary of anyone. That's not a small thing anymore, San's noticed — it used to be rare enough to feel fragile. Now it's just Tuesday.<br><br>Fair Tide keeps growing the way it always does when nobody's forcing it to: a little at a time, mostly unnoticed, until one day you look up and it's simply more than it used to be.",
    23: "It would be easy, San thinks, to let everything that's happened turn into a story about how far they've come — the worlds crossed, the Archive, the routes other people want, the Engine itself. All of it true. None of it the whole truth.<br><br>The whole truth is smaller and stranger than that. They still argue about fish at the market. They still misplace mugs. They still get things wrong and have to say so out loud to each other. They still laugh at things that aren't even that funny, just because they're tired and together and it feels good to laugh.<br><br>They crossed worlds. They're still, underneath every bit of that, just people — and San's decided, somewhere along the way, that this is the part worth holding onto, not despite everything else, but because of it.",
    24: "There's no ceremony to it, no send-off, nothing that marks this as the end of anything in particular. That feels right to San, standing at the edge of Fair Tide with Joel beside her, watching the tide come in the way it always does.<br><br>The wider worlds are still out there, waiting the way they always will. New routes. New disagreements to work through. A Fountain they still haven't opened. Whatever's on the other side of the road nobody expected to find. None of that has gone anywhere, and none of it needs to be rushed toward.<br><br>\"We don't have to leave yet,\" Joel says.<br><br>\"I know,\" San says. \"I'm not in a hurry.\"<br><br>For once, neither of them is. The adventure isn't over. It's just not the only thing anymore. Fair Tide is home, and forever, San's learned, doesn't have to start somewhere far away.<br><br>It starts here."
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
    // present-day introduction. Caelan's recruitment hook — Ch.13
    // ("A Stranger at Fair Tide") is his own introduction, confirmed
    // from the actual chapter text ("an arrival... worth knowing on
    // his own terms"). Same mechanism as every other companion's
    // introducing chapter (game.foundCompanions), which
    // memberUnlocked()'s default fallback in core-engine.js already
    // reads without needing a special case there.
    if (id === 9) {
      game.foundCompanions = game.foundCompanions || {};
      game.foundCompanions['ate_joy'] = true;
    }
    if (id === 13) {
      game.foundCompanions = game.foundCompanions || {};
      game.foundCompanions['caelan'] = true;
    }
    // Matches every prior arc's own completion flag (arc18/arc19Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 24) game.arc20Complete = true;
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
