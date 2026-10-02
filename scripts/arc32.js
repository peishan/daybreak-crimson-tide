(function(){
  // -------------------------------------------------------------------
  // ARC XXXII — THE LONG TIDE. Gated at arc31Complete + level 480,
  // continuing the established +15-per-arc ladder (XXIX:435, XXX:450,
  // XXXI:465, XXXII:480). Ch.24 sets game.arc32Complete = true, matching
  // every other arc's own finale flag.
  //
  // Per the outline this arc was built from: after three increasingly
  // intense arcs (Betrayal, Defense, Readiness), Arc XXXII is a
  // deliberate slowdown — warm, domestic, reflective, occasionally
  // funny, with smaller adventures and community problems rather than
  // another major enemy. San's pregnancy is now known to everyone, but
  // per the outline's own explicit instruction, the twins are NOT born
  // in this arc, and Veyren pregnancy is never forced into an ordinary
  // Earth timetable — Ch.20 ("Not Yet") and the finale both state this
  // plainly, and the Home Preparation mechanic's own "Birth: Unknown"
  // field (see arc32-mechanics.js) stays Unknown through the arc's end.
  //
  // Per the outline's own explicit restraint: N gets no new storyline.
  // Ch.13 ("An Empty Name") acknowledges her absence exactly once,
  // without speculation and without reopening her case — Arc XXX's own
  // "Case Closed" framing stays closed. Sairen is not mentioned. Joy and
  // Caelan progress as a couple through ordinary companionship (Ch.11,
  // 19), not through another dedicated romance arc.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. The Fair Tide Life gameplay system (Settlement
  // Routines + Home Preparation) Ch.2, 7, 9, 21-22's own notes call for
  // lives in scripts/arc32-mechanics.js, same split used since Arc
  // XXIII.
  //
  // XP escalates gently — this is deliberately a quieter arc, so the
  // spread stays tighter than Arc XXXI's own crisis pacing. Ch.22
  // ("Ready Enough") is the centerpiece at 400: the moment the Home
  // Preparation system's own mechanical unlock lands, and the chapter
  // where the pregnancy stops feeling abstract to San for the first
  // time. Ch.24's finale keeps the "one centerpiece, not two"
  // convention at 380, below the centerpiece.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC32_CHAPTERS = [
    {id:1, title:'Another Morning', focus:"After everything Fair Tide has survived, morning is surprisingly ordinary — ships arrive, shops open, repairs continue, someone complains about breakfast. San realizes ordinary life didn't stop simply because something terrible happened.", image:'assets/comics/arc32/ch01-another-morning.webp', xp:255, action:'🌅 Wake to Another Morning'},
    {id:2, title:'Repair List', focus:"Caelan surveys what remains to be repaired after Arc XXXI. Joy accompanies him, and their professional discussion gradually turns into comfortable bickering over which improvements are actually necessary. Brada still wants another ballista.", image:'assets/comics/arc32/ch02-repair-list.webp', xp:260, action:'🔨 Go Over the Repair List'},
    {id:3, title:'Everyone Knows Now', focus:"San's pregnancy is no longer a private uncertainty — Fair Tide knows, her family knows, the crew understands this is really happening. Unfortunately, this means everyone now has opinions about what she should eat, how much she should rest, and where she should go.", image:'assets/comics/arc32/ch03-everyone-knows-now.webp', xp:265, action:'🤰 Let Everyone Know'},
    {id:4, title:'Still Captain', focus:"Someone attempts to take a routine Captain's task away from San because she's pregnant. San immediately takes it back. Her pregnancy changes some practical things. It does not remove her authority or competence.", image:'assets/comics/arc32/ch04-still-captain.webp', xp:270, action:'⚓ Stay the Captain'},
    {id:5, title:"Soel's Inspection", focus:"Soel has become unusually interested in San — following her, sitting beside her, occasionally investigating her stomach. Mimi is convinced he senses something. San just wants everyone to leave her cat alone.", image:'assets/comics/arc32/ch05-soels-inspection.webp', xp:265, action:"🐈 Endure Soel's Inspection"},
    {id:6, title:'Somewhere for Them', focus:"San and Joel finally discuss where the children will actually live. Their current home wasn't built for two children. What begins as a practical discussion about space quickly becomes something much more emotional.", image:'assets/comics/arc32/ch06-somewhere-for-them.webp', xp:275, action:'🏡 Find Somewhere for Them'},
    {id:7, title:'What Do Babies Need?', focus:"San assumes asking Fair Tide's parents for advice will help. It is a mistake — everyone gives different advice. Joel starts writing down only the suggestions that make practical sense. They're having two.", image:'assets/comics/arc32/ch07-what-do-babies-need.webp', xp:270, action:'🧸 Ask What Babies Need'},
    {id:8, title:'Joy', focus:"Joy quietly starts helping San more often — not because San is incapable, but because she notices things: food, rest, heavy work San shouldn't bother with. This is the beginning of Joy naturally becoming more involved with their growing family.", image:'assets/comics/arc32/ch08-joy.webp', xp:275, action:'🌸 Notice Joy'},
    {id:9, title:'Caelan Builds Something', focus:"San and Joel ask Caelan for one small modification to their home. One. By evening there are measurements everywhere and full plans drawn up. Joel quietly agrees with all of it. San realizes she's been outvoted.", image:'assets/comics/arc32/ch09-caelan-builds-something.webp', xp:280, action:'🔨 Watch Caelan Build Something'},
    {id:10, title:'A Short Voyage', focus:"San joins a routine voyage close to Veyren. Nothing dramatic happens — that's the point. She remains Captain, Joel remains beside her, and the crew simply adapts around the pregnancy without treating her like glass.", image:'assets/comics/arc32/ch10-a-short-voyage.webp', xp:275, action:'🌊 Sail a Short Voyage'},
    {id:11, title:'Joy and Caelan', focus:"Joy and Caelan spend an evening together after finishing their work — no crisis, no request, nobody needing rescue. Their relationship advances through ordinary companionship, not another dramatic event.", image:'assets/comics/arc32/ch11-joy-and-caelan.webp', xp:280, action:'🌿 Sit with Joy and Caelan'},
    {id:12, title:'Family Dinner', focus:"Aisyah organizes — or accidentally becomes responsible for — a family meal. San's pregnancy inevitably becomes a topic. San eventually threatens to leave if everyone keeps discussing her body while she's trying to eat.", image:'assets/comics/arc32/ch12-family-dinner.webp', xp:285, action:'🍲 Sit Down to Family Dinner'},
    {id:13, title:'An Empty Name', focus:"Something mundane brings N up — not a new clue, not a quest, just a reminder. Someone asks what happened to her. Nobody knows. San doesn't speculate. Her story remains closed.", image:'assets/comics/arc32/ch13-an-empty-name.webp', xp:280, action:'🌑 Hear an Empty Name'},
    {id:14, title:'What Betrayal Leaves', focus:"Fair Tide residents are still adjusting to the security changes. One worker worries asking questions will look suspicious; another hesitates to report something rather than accuse a neighbor. Joy works with San to clarify: security exists to protect, not to make everyone police each other.", image:'assets/comics/arc32/ch14-what-betrayal-leaves.webp', xp:285, action:'🕯️ See What Betrayal Leaves'},
    {id:15, title:'Captain and First Mate', focus:"San deliberately leaves Joel responsible for Fair Tide for part of a day while she handles something personal. Nothing goes wrong. Joel doesn't become Acting San — he leads differently. Their partnership has reached the point where neither has to prove the other necessary.", image:'assets/comics/arc32/ch15-captain-and-first-mate.webp', xp:290, action:'⚓ Trust Captain and First Mate'},
    {id:16, title:'The Horizons Continue', focus:"Renn and Erynn report the secured Horizon network is stable again. Mimi's observations suggest countless worlds still lie beyond their mapped routes. The story briefly reminds us how enormous the setting has become — but nobody announces another expedition yet.", image:'assets/comics/arc32/ch16-the-horizons-continue.webp', xp:285, action:'🧭 Watch the Horizons Continue'},
    {id:17, title:'A Long Rain', focus:"Bad weather settles over Fair Tide. Work slows, people stay indoors, and San and Joel spend an unusually quiet day together — talking about Earth, their old lives, and the strange reality of becoming parents here.", image:'assets/comics/arc32/ch17-a-long-rain.webp', xp:285, action:'🌧️ Sit Through a Long Rain'},
    {id:18, title:'Two Families', focus:"San admits something that's been sitting underneath the pregnancy storyline: having children in Veyren doesn't erase the family they remember from Earth. Their new family isn't a replacement — it's another part of their lives.", image:'assets/comics/arc32/ch18-two-families.webp', xp:290, action:'🫶 Hold Two Families'},
    {id:19, title:'Fair Tide Market Day', focus:"Fair Tide holds a normal market day — Aisyah handles trade, Mez contributes, Mimi and Brada appear together, Joy and Caelan are increasingly obvious to everyone except perhaps themselves. The chapter exists to show how much life now occupies the settlement.", image:'assets/comics/arc32/ch19-fair-tide-market-day.webp', xp:290, action:'🧺 Attend Fair Tide Market Day'},
    {id:20, title:'Not Yet', focus:'Someone asks San when the babies are coming. "I don\'t know," she says — and that\'s genuinely the answer. Veyren pregnancy doesn\'t follow Earth\'s timeline, and the Fountain\'s influence adds another unknown. The twins are healthy. Birth is not imminent.', image:'assets/comics/arc32/ch20-not-yet.webp', xp:300, action:'🍼 Answer Not Yet'},
    {id:21, title:"Joy's Promise", focus:'Joy and San share a quieter conversation. Joy doesn\'t formally promise to become a nanny or future childcare worker. She simply tells San, "You won\'t have to do this alone." San looks around Fair Tide. She knows.', image:'assets/comics/arc32/ch21-joys-promise.webp', xp:300, action:"🌸 Hear Joy's Promise"},
    {id:22, title:'Ready Enough', focus:"Caelan finishes the practical changes to San and Joel's home. It isn't an enormous nursery — it's still their home, with room now for two more people. Standing in the unfinished children's space, the pregnancy feels less abstract to San for perhaps the first time.", image:'assets/comics/arc32/ch22-ready-enough.webp', xp:400, action:'🛠️ Call It Ready Enough'},
    {id:23, title:'The Tide Keeps Moving', focus:"Reports arrive — trade opportunities, requests, new Horizon observations, problems in other settlements. Fair Tide cannot freeze itself waiting for San's children to arrive. San realizes neither can she. The future isn't something they're preparing to start — they're already living it.", image:'assets/comics/arc32/ch23-the-tide-keeps-moving.webp', xp:295, action:'🌊 Keep the Tide Moving'},
    {id:24, title:'The Long Tide', focus:'Evening settles over Fair Tide. San rests against Joel, his hand settling over hers, then over her stomach. "Feels like we\'re waiting," San says. Joel watches the harbor. "We\'re living." She thinks about that. Then smiles.', image:'assets/comics/arc32/ch24-the-long-tide.webp', xp:380, action:'🌅 Name The Long Tide'}
  ];
  window.ARC32_CHAPTERS = ARC32_CHAPTERS;

  const ARC32_CHAPTER_SCENES = {
    1: "The port comes awake the way it always has, as if nothing about the last several arcs ever happened at all. Ships arrive on schedule. Shops open their shutters. Someone's already elbow-deep in a repair that's been waiting since yesterday. And somewhere near the Commons, a voice rises in genuine outrage over what passes for breakfast this week.<br><br>San stands in the middle of all of it, oddly struck by how thoroughly ordinary it all is.<br><br>\"Good,\" Joel says, beside her, watching the same scene.<br><br>\"What's good?\" she asks.<br><br>\"Boring.\"<br><br>For once, she agrees completely. Ordinary life, it turns out, didn't actually stop just because something terrible happened. It was just waiting for everyone to notice it was still there.",
    2: "Caelan walks the settlement with his usual list already half-written in his head, cataloguing everything Arc XXXI's own emergency improvements left behind — sound, functional, and increasingly ridiculous as a collection of temporary fixes stacked on top of each other.<br><br>Joy walks it with him, ostensibly to weigh in professionally on what's actually necessary. The professional part lasts about ten minutes before the whole conversation collapses into comfortable bickering over priorities, budgets, and whether half of Caelan's list is really urgent or just interesting to him.<br><br>Brada, predictably, still wants another ballista.<br><br>Caelan, less predictably, thinks he might actually have a point this time.<br><br>Joy realizes, watching the two of them agree on something for once, that she may have already lost this particular battle.",
    3: "There's no single moment where San's pregnancy becomes public knowledge — it simply stops being a private uncertainty somewhere between one ordinary week and the next. Fair Tide knows. Her family knows. The crew, watching her carefully these past few weeks, finally lets themselves treat it as real instead of merely suspected.<br><br>What San discovers immediately afterward is a consequence nobody warned her about: everyone, it turns out, has opinions.<br><br>What she should eat. How much she should rest. What she should carry, and how far, and how often. Where she should and shouldn't go, according to people who have never personally been pregnant on a ship in their lives.<br><br>San rapidly regrets telling anybody anything at all.<br><br>Joel finds the entire spectacle considerably funnier than he has any right to.",
    4: "Someone — well-meaning, San's fairly sure, though it doesn't help much — tries to quietly take a routine Captain's task off her hands, on the entirely unspoken assumption that pregnancy means she shouldn't be doing it anymore.<br><br>San takes it back immediately, without raising her voice, without needing to explain herself twice.<br><br>Joel doesn't join the argument. He doesn't need to.<br><br>Later, San brings it up anyway. \"You could've helped,\" she says.<br><br>\"You didn't need help,\" Joel says.<br><br>Correct answer. Her pregnancy changes plenty of practical things about her day — what's comfortable, what's sensible, what she paces herself around. It does not touch her authority, and it does not touch her competence, and Joel, of everyone, has never once treated those as up for negotiation.",
    5: "Soel has developed an entirely new interest in San lately, and nobody quite knows what to make of it.<br><br>He follows her between rooms. He sits pointedly beside her whenever she stops moving long enough. Occasionally, with no warning at all, he investigates her stomach directly, nose first, with the total confidence of a creature who believes he's found something important.<br><br>Mimi is instantly, thoroughly convinced he senses something nobody else can. Renn wants observations, ideally written down, ideally often. Erynn wants Renn to stop turning San's pregnancy into a research subject before San decides to turn him into one instead.<br><br>San, for her part, just wants everyone — Renn, Mimi, and especially Soel — to leave her cat's opinions out of it.<br><br>Soel, characteristically, ignores every single one of them.",
    6: "The conversation starts practically enough. San and Joel sit down, finally, to talk about where their children will actually live — because their current home, however comfortable, was never built with two more people in mind.<br><br>It begins as measurements and doorways and which room gets which use.<br><br>It doesn't stay that way for long.<br><br>Somewhere in the middle of discussing space, San and Joel both quietly realize what they're actually doing: preparing an entire place, room by room, for two people they haven't met yet. The practical conversation keeps going. Underneath it, something considerably larger has already settled in and isn't leaving.",
    7: "Fair Tide, San reasons, already has children. Fair Tide already has parents. Surely someone here can tell her what a baby actually needs.<br><br>This turns out to be a mistake of genuinely impressive scale. Everyone she asks gives different advice, delivered with total confidence, frequently contradicting whoever she asked five minutes earlier.<br><br>Joel eventually takes the sensible approach and starts a written list — but only the suggestions that survive contact with actual logic.<br><br>\"How many blankets does one baby need?\" San asks, staring at the pile accumulating in the corner of their home.<br><br>Joel looks at it for a long moment. \"Apparently forty,\" he says.<br><br>And, as San points out, they're having two.",
    8: "Nobody appoints Joy to anything. She simply starts helping, quietly, more and more often, in ways San doesn't immediately notice because they're rarely dramatic.<br><br>Food that appears exactly when San's too busy to think about eating. Rest that gets gently, persistently insisted on. Heavy work redirected before San can talk herself into doing it anyway. Small preparations neither San nor Joel had gotten around to thinking about yet, simply handled.<br><br>It isn't Joy being formally appointed to anything, and it was never framed that way. It's just Joy noticing what a family actually needs before anyone asks her to, the same way she's always paid attention to the people around her — and this is where that attention quietly starts pointing toward San and Joel's growing family instead of just Fair Tide's wider one.",
    9: "San and Joel ask Caelan for one small modification to their home. One. A shelf, more or less.<br><br>Caelan examines the building the way he examines everything — slowly, thoroughly, and with growing dissatisfaction with however it currently exists. This, in retrospect, was the mistake.<br><br>By afternoon, he has actual plans. By evening, there are measurements marked across nearly every wall in the house.<br><br>\"They asked for a shelf,\" Joy points out, watching the scale of it unfold.<br><br>\"They need more than a shelf,\" Caelan says, entirely unbothered.<br><br>Joel, when consulted, quietly agrees with him.<br><br>San, surveying the sudden unanimous consensus against her, realizes she's been thoroughly outvoted in her own home.",
    10: "San joins a routine voyage close to Veyren — nothing distant, nothing risky, the kind of trip that barely qualifies as an adventure anymore. Nothing dramatic happens. That's rather the entire point.<br><br>She remains Captain the whole way, exactly as she always has. Joel stays beside her, exactly as he always does. The crew adjusts around her pregnancy without fuss and without treating her like something fragile — carrying what she'd rather not lift, watching her pace without commenting on it, nothing more dramatic than that.<br><br>It quietly becomes one of the last simple voyages before later pregnancy makes some of this travel less practical. Nobody says that part out loud. Everyone seems to know it anyway.",
    11: "Joy and Caelan end up with an evening entirely to themselves, for once, after both their work is actually finished. No crisis waiting. No request pulling either of them away. Nobody, anywhere nearby, in need of rescuing.<br><br>They talk — about Fair Tide, about the responsibilities they've both quietly accumulated, about what they once imagined their lives might look like before any of this happened to either of them.<br><br>Nothing about the evening is dramatic. Nothing needs to be. Their relationship keeps moving forward the way it mostly always has between them — through ordinary companionship, unhurried, rather than through another sweeping romantic event neither of them particularly needs right now.",
    12: "Aisyah organizes a family dinner, or more accurately becomes responsible for one somewhere in the process of trying to simply feed everyone at once. Either way, the wider family gathers, and the food is good, and the conversation is loud in the way it always is when this many people care about each other.<br><br>San's pregnancy, inevitably, becomes the topic. Again.<br><br>What she should eat. How she's feeling. Whether she's resting enough. San eventually sets down her fork and threatens, with complete sincerity, to leave if one more person comments on her body while she's actively trying to eat her dinner.<br><br>\"Can I have your food?\" Joel asks, entirely unbothered by the threat.<br><br>\"No,\" San says.<br><br>Some things, at least, remain perfectly, reliably normal.",
    13: "It comes up sideways, the way these things usually do — nothing dramatic, no new clue, no quest attached to it. Just a passing remark in an otherwise ordinary conversation, and someone finally asks the question that's been sitting unspoken for a while: whatever happened to N?<br><br>Nobody actually knows. San doesn't speculate, doesn't offer a theory, doesn't reach for an answer just to fill the silence.<br><br>\"She's gone,\" is all she says.<br><br>There's real sadness in it — San isn't pretending otherwise — but no pull to go looking, no unfinished thread quietly asking to be picked back up. N's story stays exactly where Arc XXX left it: closed, unresolved, and, for now, left alone.",
    14: "The security changes since Arc XXXI are still settling into Fair Tide's daily rhythm, and not entirely comfortably. One worker admits, quietly, to worrying that asking questions at all might make them look suspicious. Another hesitates over reporting something minor, reluctant to be the one accusing a neighbor of anything.<br><br>San hears both, separately, and recognizes the same problem underneath them: systems built to protect people can still, without meaning to, teach people to be afraid of each other.<br><br>Joy works through it with her carefully, the two of them landing on the same clarification together — security exists to protect this community, not to turn its own people into watchers of one another. It's a small correction, but it matters. It closes something Arc XXXI left open.",
    15: "San deliberately steps back for part of a day, leaving Fair Tide entirely in Joel's hands while she handles something personal that has nothing to do with the settlement at all.<br><br>Nothing goes wrong. That, San thinks afterward, might be the actually important part.<br><br>Joel doesn't run things the way she would have. He doesn't try to. He leads differently — his own rhythm, his own instincts — and Fair Tide runs perfectly well underneath it regardless.<br><br>When San returns, everything is exactly fine, handled without her, in a way that doesn't sting at all. Their partnership, she realizes, has finally reached the point where neither of them needs to prove the other one necessary. They just already know it.",
    16: "Renn and Erynn bring San the kind of report that would have felt enormous a few arcs ago and now simply feels like good news: the secured Horizon network is stable again, holding steady since Arc XXX's own breach.<br><br>Mimi adds her own observation on top of it, quieter but no less vast — however many worlds they've already mapped, her sense is that countless more still wait beyond the routes they currently understand.<br><br>It's a brief reminder of just how enormous the setting around Fair Tide has actually become. Nobody rushes to announce a new expedition off the back of it, though. There will be time for that. Right now, it's simply good to know the door isn't currently on fire.",
    17: "The rain settles in early and doesn't let up, the kind of weather that slows the whole settlement down without anyone deciding it should. Work waits. People stay indoors. The usual noise of the port dulls into something quieter.<br><br>San and Joel spend the day together, unhurried, in a way their schedules rarely allow anymore.<br><br>They talk about Earth. About the lives they had before any of this, the ones that still exist somewhere underneath everything that's happened since. About their children from before Veyren, and the strange, quiet fact that they're now preparing to become parents again, here, in a place neither of them ever expected to call home.<br><br>Nothing about the conversation resolves anything. Nothing needs to. Some things are simply allowed to sit together, unfinished, without demanding an answer.",
    18: "San says the thing that's been sitting underneath the whole pregnancy storyline for a while now, quietly enough that it takes Joel a moment to realize how much it's actually been weighing on her.<br><br>Having children here, in Veyren, doesn't erase the children and family they remember from Earth. It was never going to work that way, however much some quiet part of her worried it might.<br><br>Joel already understands — he's understood for a while, longer than she realized.<br><br>Their new family isn't a replacement for the one they carry with them. It's simply another part of their lives, sitting alongside the rest of it rather than covering it over. That distinction, once San actually says it out loud, gives both of them permission to be entirely happy about what's coming, without needing to pretend their old lives never happened at all.",
    19: "Fair Tide holds an ordinary market day, and for once that's genuinely the whole of it.<br><br>Aisyah moves through trade the way she always has, briskly and without drama. Mez contributes wherever the community needs an extra pair of hands. Mimi and Brada turn up together, which surprises approximately nobody who's been paying attention. Joy and Caelan drift through the crowd side by side, increasingly obvious to everyone around them except, apparently, themselves.<br><br>San and Joel walk through all of it together, unhurried, simply present.<br><br>Nothing about the day needs to be remarkable. That's rather the point of it — this is what an ordinary day at Fair Tide actually looks like now, this much life, this much noise, this many people who've built something worth walking through together.",
    20: "Someone asks San, not unkindly, when the babies are actually coming.<br><br>\"I don't know,\" San says. And she means it completely — this isn't deflection, isn't privacy, isn't San holding something back. Veyren pregnancy simply doesn't follow anything she knows from Earth, and the Fountain's own influence adds another layer of unknown on top of that nobody here has ever had reason to map before.<br><br>Renn would very much like to study this properly.<br><br>San would very much like Renn to remain alive.<br><br>Erynn, wisely, redirects him before either outcome becomes necessary.<br><br>What San can say, with real confidence, is that the twins are healthy — as healthy as anything Fair Tide's methods can currently determine. Birth, though, isn't imminent. Not yet. Maybe not for a while. Nobody's pretending otherwise, and for once, that's simply fine.",
    21: "Joy finds San during a quieter moment, and the conversation that follows isn't dramatic at all — just two people who trust each other, talking plainly.<br><br>Joy doesn't formally offer to become a nanny, or promise any particular role for herself once the twins actually arrive. That was never really her way of doing things.<br><br>What she says instead is simpler, and somehow carries more weight for it. \"You won't have to do this alone.\"<br><br>San looks around at Fair Tide — at everyone who's quietly become part of her life here, at everything they've all built together — and she already knows Joy's telling the truth. She doesn't need it spelled out any further than that.",
    22: "Caelan finishes the actual, practical work on San and Joel's home — no grand transformation, nothing that turns their house into something unrecognizable. Just room, finally, where there wasn't quite room before. Additional space. Proper storage. A section of the house that used to be nothing in particular, and now clearly isn't nothing anymore.<br><br>San stands in the middle of the unfinished children's space for a long moment, taking it in.<br><br>For perhaps the first time since any of this started, the pregnancy stops feeling abstract. It stops being something she's aware of and starts being something she can actually stand inside.<br><br>Joel comes up beside her. Neither of them says very much. Neither of them needs to.",
    23: "The reports keep arriving, the way they always do, entirely unbothered by anything happening in San's own life. Trade opportunities. Requests from other settlements. New Horizon observations worth someone's attention. Problems, somewhere else, that don't wait politely for a convenient moment.<br><br>Fair Tide can't simply freeze itself in place, San realizes, waiting for her children to arrive on some schedule nobody actually controls.<br><br>Neither, she realizes right afterward, can she.<br><br>The future was never something they were merely preparing to eventually start living. Watching everything continue to move around her exactly as it always has, San understands they've already been living it, all along, the entire time she thought she was still getting ready.",
    24: 'Evening settles quietly over Fair Tide. Joy and Caelan walk home together, still talking, in no particular hurry. Brada is somewhere nearby, still making his case for another ballista to anyone patient enough to listen. Aisyah closes out the day\'s accounts. Renn and Erynn leave the Horizon workshop together, the day\'s reports finally filed away. Soel curls up close to San, exactly where he\'s taken to settling these past weeks.<br><br>San rests back against Joel. His hand finds hers first, settling naturally over it.<br><br>Then, just as naturally, over her stomach.<br><br>The twins are still there. Still hers and Joel\'s, still unmet, still entirely unhurried by anything happening around them.<br><br>"Feels like we\'re waiting," San says, quiet, watching the harbor along with him.<br><br>Joel keeps watching it too. "We\'re living," he says.<br><br>San lets that settle for a moment. Then she smiles.<br><br>The tide moves on, quietly, beyond the harbor, exactly the way it always has. Tomorrow will come. And then, after that, another one.'
  };
  window.ARC32_CHAPTER_SCENES = ARC32_CHAPTER_SCENES;

  window.arc32ObjectiveState = function(){
    if (!game.arc31Complete) return null;
    if (level() < 480) return null;
    game.comicProgress32 = game.comicProgress32 || {};
    for (const ch of ARC32_CHAPTERS) {
      if (!game.comicProgress32[ch.id]) return 'complete_arc32_chapter_' + ch.id;
    }
    return 'arc32_part1_complete_for_now';
  };

  window.markArc32ChapterRead = function(id){
    const so = window.arc32ObjectiveState();
    if (so !== ('complete_arc32_chapter_' + id)) return;
    game.comicProgress32 = game.comicProgress32 || {};
    game.comicProgress32[id] = true;
    // Matches every prior arc's own completion flag (arc30/arc31Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 24) game.arc32Complete = true;
    const ch = ARC32_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC32_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC32_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc32Splash = function(){
    const overlay = document.getElementById('arc32SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc32Splash = function(){
    const overlay = document.getElementById('arc32SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc32SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc32 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc32) oldRenderStoryForArc32();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc32Ready = window.arc32ObjectiveState() !== null;
    if (arc32Ready && !game.arc32SplashSeen && typeof window.__ctShowArc32Splash === 'function') {
      window.__ctShowArc32Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc32/arc32-cover-the-long-tide.webp" alt="Arc XXXII — The Long Tide" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXXII</div><div class="story-act-title">The Long Tide</div>'+
      '<div class="story-act-tagline">Life continues while the world changes.</div></div>';
    if (!arc32Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXXII Locked</div><div class="story-chapter-sub">'+
        (!game.arc31Complete ? 'Finish Arc XXXI first.' : 'Reach Level 480 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc32ObjectiveState();
    ARC32_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress32 && game.comicProgress32[ch.id]);
      const ready = !done && so===('complete_arc32_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = 
          '<button class="btn btn-small btn-success" onclick="markArc32ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc32_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXXII chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
