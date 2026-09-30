(function(){
  // -------------------------------------------------------------------
  // ARC XXXIV — TWO HEARTS. Gated at arc33Complete + level 510,
  // continuing the established +15-per-arc ladder (XXXI:465, XXXII:480,
  // XXXIII:495, XXXIV:510). Ch.24 sets game.arc34Complete = true,
  // matching every other arc's own finale flag.
  //
  // Per the outline this arc was built from: Arc XXXIII established the
  // family already waiting for the twins. Arc XXXIV finally lets San
  // and Joel understand more about the two children themselves. The
  // key revelation, confirmed in Ch.1 and unpacked through Ch.3/7: San
  // hasn't been experiencing an unusual version of a human twin
  // pregnancy. She's been experiencing a Veyren pregnancy from the
  // beginning. Per the outline's own explicit lore note — the Fountain
  // did NOT magically create San's pregnancy. Its restoration at the
  // end of Arc XIX removed the physical effects (including her PCOS)
  // that had affected her before; San conceived naturally with Joel
  // afterward, during the interlude, and the twins developed under
  // conditions the Fountain's restoration had already altered. That
  // gives them a genuine relationship with the Fountain without making
  // them artificial or magically manufactured.
  //
  // Per the outline's own explicit restraint: this arc is NOT a medical
  // pregnancy arc — no sonograms, no Earth-style fetal monitors, no due
  // dates, no percentage countdown anywhere. Understanding comes
  // through observation, magic, spiritual sensitivity, Renn's research,
  // and San's own experience. The twins' future abilities are gently
  // foreshadowed (Ch.15, 21) but never fully defined, and Mimi's own
  // vision (Ch.22) explicitly refuses to resolve into a prophecy —
  // Crimson Tide will not treat the twins as chosen children with a
  // predetermined destiny. Soel has known about the twins far longer
  // than anyone else and explains none of it, per the outline's own
  // closing joke.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. The Family Resonance + Veyren Life Studies
  // gameplay system Ch.1, 6-9, 13-15, and 21's own notes call for lives
  // in scripts/arc34-mechanics.js, same split used since Arc XXIII.
  //
  // XP stays in the same gentle range Arc XXXII/XXXIII established.
  // Ch.21 ("A Response") is the centerpiece at 400 — the chapter where
  // the Resonance system's own core observations (External Response,
  // Different Patterns) actually land, and where San and Joel first
  // feel the twins respond as two distinct people rather than simply
  // observe it secondhand through Renn/Erynn/Mimi's research. Ch.24's
  // finale keeps the "one centerpiece, not two" convention at 380,
  // below the centerpiece, and shares the arc's own title (Ch.1 does
  // too, per the outline's own repeated-title chapter, the same
  // structure Arc XXIX used for "The Spy").
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC34_CHAPTERS = [
    {id:1, title:'Two Hearts', focus:"During one of Veyren's non-modern examinations, the crew confirms two distinct living rhythms within San — not a sonogram, not an Earth-style fetal monitor. Mimi perceives two intertwined patterns; Erynn confirms two separate spiritual signatures. \"Two?\" Joel asks. \"Two,\" San says. Twins.", image:'assets/comics/arc34/ch01-two-hearts.png', xp:260, action:'💞 Feel Two Hearts'},
    {id:2, title:'You Knew?', focus:'San notices Soel sitting nearby, completely unconcerned. Mimi points out he\'s been reacting differently around San for months. "You knew?" San asks him. Soel blinks and leaves. Conversation over.', image:'assets/comics/arc34/ch02-you-knew.png', xp:265, action:'😳 Ask If He Knew'},
    {id:3, title:'Not Human', focus:"Renn and Erynn compare everything they've observed since Arc XXII — the altered reproductive cycle, San's changing magical signature, Soel's reactions, the Fountain. Their conclusion isn't a diagnosis so much as an admission: they were using human expectations to understand something that isn't following human biology anymore.", image:'assets/comics/arc34/ch03-not-human.png', xp:280, action:'🌊 Accept Not Human'},
    {id:4, title:'Ate', focus:'San tells Ate Joy there are two. Joy stares, looks at Joel, then San, then back at Joel. "Two?" "Yeah." Joy sits down. Once the surprise passes, her practical side activates immediately — everything prepared in Arcs XXXII-XXXIII now needs reconsidering. For two children.', image:'assets/comics/arc34/ch04-ate.png', xp:275, action:'🌸 Tell Ate'},
    {id:5, title:'Their Room, Again', focus:'San and Joel return to the room they prepared. Two. Suddenly every decision looks different. Joel begins mentally reorganizing everything. "You\'re doing calculations," San says. "Yeah." "Stop." He does not stop.', image:'assets/comics/arc34/ch05-their-room-again.png', xp:270, action:'🏡 Return to Their Room, Again'},
    {id:6, title:"Soel's Watch", focus:"Soel's behavior becomes easier to understand now — he responds differently depending on subtle changes within the pregnancy, sometimes lying beside San, sometimes suddenly alert. Mimi begins suspecting Soel doesn't perceive the twins as one combined presence. He's been aware of two individuals for a long time.", image:'assets/comics/arc34/ch06-soels-watch.png', xp:280, action:"🐈 Keep Soel's Watch"},
    {id:7, title:"The Fountain's Echo", focus:"Erynn revisits what happened at the Fountain at the end of Arc XIX — it restored what had been damaged, including the physical problems that had previously affected San's reproductive health. But conception occurred after that restoration. The Fountain didn't create the twins. Its influence became part of the conditions under which they developed.", image:'assets/comics/arc34/ch07-the-fountains-echo.png', xp:295, action:"🌌 Trace the Fountain's Echo"},
    {id:8, title:'No Precedent', focus:'Renn searches everything available to him. Fountain restoration is documented imperfectly. Some Veyren pregnancy records exist. Twins conceived after Fountain restoration by people originally from another world? Nothing. "This is unprecedented," Renn says. "I hate when you say that," San replies.', image:'assets/comics/arc34/ch08-no-precedent.png', xp:285, action:'📚 Search for a Precedent'},
    {id:9, title:"Mimi's Flowers", focus:"Mimi uses her own divination rather than conventional diagnostics, perceiving two developing presences — not futures, not predetermined personalities, simply two lives whose magical patterns are already distinguishable. She refuses to predict who they'll become. The twins may be unusual. They are not prophecies.", image:'assets/comics/arc34/ch09-mimis-flowers.png', xp:285, action:"🌺 Read Mimi's Flowers"},
    {id:10, title:'Still Us', focus:'All the magical discussion — Fountain-born influence, spiritual signatures, unprecedented development, possible abilities — begins making San uncomfortable. "They\'re starting to sound like an experiment," she tells Joel, alone. "They\'re our kids," he says. That\'s the reset San needs.', image:'assets/comics/arc34/ch10-still-us.png', xp:280, action:'⚓ Remember Still Us'},
    {id:11, title:'Two Rhythms', focus:"San gradually learns to recognize differences herself — not through Earth-style fetal movement expectations alone. Sometimes magic around her responds differently; sometimes one presence seems more active while the other is quiet. For the first time, San begins experiencing them as two distinct children rather than simply the pregnancy.", image:'assets/comics/arc34/ch11-two-rhythms.png', xp:290, action:'🌊 Feel Two Rhythms'},
    {id:12, title:'Twice Everything', focus:'Ate Joy and Caelan revisit preparations. San discovers "you\'ll need two" is becoming extremely expensive — two sleeping spaces, more supplies, more storage, more everything. Aisyah immediately starts calculating. Joel joins her. San regrets having financially competent relatives.', image:'assets/comics/arc34/ch12-twice-everything.png', xp:280, action:'😂 Budget for Twice Everything'},
    {id:13, title:'Slow and Fast', focus:"Renn discovers something strange about Veyren development — the twins aren't simply developing faster than human babies. Some systems mature slowly; others appear unusually developed. Magical/spiritual development seems to follow an entirely different timetable. Veyren children may not mature at one uniform human rate.", image:'assets/comics/arc34/ch13-slow-and-fast.png', xp:295, action:'🌊 Notice Slow and Fast'},
    {id:14, title:'Not Immortal', focus:"The crew discusses whether the Fountain's influence means the twins will share the adults' lack of ordinary aging. Nobody knows. San rejects grand assumptions — the Fountain restored the crew from an ordinary pre-Fountain state, but the twins never had one to be restored from. Their relationship to it may be completely different.", image:'assets/comics/arc34/ch14-not-immortal.png', xp:290, action:'🧬 Decide Not Immortal'},
    {id:15, title:'Soel and the Boundary', focus:"Soel reacts strongly during a brief Horizon fluctuation — not because San is in danger, but because something about the disturbance reaches the twins' developing spiritual signatures. The crew realizes Soel may be responding to them partly because they can already perceive spiritual currents in extremely primitive ways. Their future powers are beginning before birth.", image:'assets/comics/arc34/ch15-soel-and-the-boundary.png', xp:295, action:'🐾 Watch Soel and the Boundary'},
    {id:16, title:"Joel's Line", focus:"Renn wants more observations. Erynn has questions. Mimi has visions. Everyone means well. Joel establishes a simple boundary: San and the twins aren't research material. Anything they investigate requires San's agreement. Renn immediately accepts this. San appreciates Joel saying it before she has to.", image:'assets/comics/arc34/ch16-joels-line.png', xp:290, action:"🛡️ Hold Joel's Line"},
    {id:17, title:'When San Gets Tired', focus:"The later pregnancy finally begins changing what San can comfortably do — not because she's suddenly helpless, but because her body is supporting two unusual developing children. Joel doesn't tell her to stop being Captain. Instead, they adjust together. \"I hate this.\" \"I know.\" \"Don't agree so fast.\"", image:'assets/comics/arc34/ch17-when-san-gets-tired.png', xp:290, action:'🌧️ Admit When San Gets Tired'},
    {id:18, title:'Ate Joy Knows', focus:"Joy notices San trying to do too much. Unlike everyone else, she doesn't issue instructions — she simply takes one task, then another. \"Ate.\" \"What?\" San knows exactly what she's doing. Joy continues anyway. It's harder to argue with an older sister than with a Warden.", image:'assets/comics/arc34/ch18-ate-joy-knows.png', xp:290, action:'🌸 Admit Ate Joy Knows'},
    {id:19, title:'The World They Hear', focus:"The crew wonders how much of the outside world the twins can already perceive — voices, magic, Soel, the sea. Nobody knows. Joel starts talking to them occasionally anyway. San catches him once. He stops. \"Continue,\" San says. Joel looks mildly betrayed. San grins.", image:'assets/comics/arc34/ch19-the-world-they-hear.png', xp:295, action:'🌊 Listen to the World They Hear'},
    {id:20, title:'Papa', focus:'San jokingly calls Joel Papa while they\'re alone. It catches him off guard. Then Joel calls San Mama. That gets her. For all the research and preparation, those two words make the future suddenly immediate. They aren\'t only San and Joel anymore. To two people they\'ve never met, they\'re already Mama and Papa.', image:'assets/comics/arc34/ch20-papa.png', xp:300, action:'🫶 Become Papa'},
    {id:21, title:'A Response', focus:"During a quiet family moment, something unusual happens — San laughs, Joel touches her stomach, Soel is nearby, and a faint magical response appears. Not an attack, not a dramatic power burst. Just enough for Mimi and Erynn to recognize: one of the twins responded to something outside San. Then a second, different response follows. Two children. Two signatures. Two emerging abilities.", image:'assets/comics/arc34/ch21-a-response.png', xp:400, action:'✨ Feel A Response'},
    {id:22, title:'No Prophecy', focus:'Mimi experiences a vision connected to the twins — but instead of revealing their destinies, she sees countless possibilities. "I don\'t know who they\'ll become," she tells San. "Good," San says. The twins may have inherited extraordinary things. But Crimson Tide will not treat them as chosen children with predetermined destinies. They get to become themselves.', image:'assets/comics/arc34/ch22-no-prophecy.png', xp:300, action:'🌌 Insist on No Prophecy'},
    {id:23, title:'Not Yet', focus:'San experiences a change strong enough that everyone briefly wonders whether the time has come. It hasn\'t. Erynn concludes the twins are entering another developmental stage rather than preparing for immediate birth. "How long?" San asks. "I don\'t know," Erynn says. "Neither do I," Renn adds. "Excellent. Very useful researchers."', image:'assets/comics/arc34/ch23-not-yet.png', xp:300, action:'🌙 Confirm Not Yet'},
    {id:24, title:'Two Hearts', focus:"Night settles over Fair Tide. San and Joel sit together, knowing far more than they did at the start of the arc — two children, two distinct spiritual signatures, a pregnancy shaped by Veyren, the lingering influence of the Fountain, signs of abilities nobody yet understands, and absolutely no idea when they're coming. \"There really are two of you.\" \"Yeah.\" Two lives, already part of the family.", image:'assets/comics/arc34/ch24-two-hearts.png', xp:380, action:'💞 Return to Two Hearts'}
  ];
  window.ARC34_CHAPTERS = ARC34_CHAPTERS;

  const ARC34_CHAPTER_SCENES = {
    1: 'The examination itself looks nothing like anything San would recognize from Earth. No sonogram, no monitor beeping out a heartbeat on a little screen. Just Mimi, quiet and focused in a way she rarely bothers being, and Erynn beside her, reading something San can\'t perceive at all.<br><br>Mimi speaks first, carefully. Two patterns. Intertwined, close together, but distinctly separate from each other. Erynn confirms it from her own angle a moment later — two spiritual signatures, not one.<br><br>Joel understands before San fully processes it. "Two?" he asks.<br><br>San looks at him. "Two," she says.<br><br>Twins. The word lands immediately, all at once, in a way San suspects she\'ll remember for the rest of her life.',
    2: 'Once the shock has had time to properly settle, San notices Soel sitting nearby, entirely unbothered, watching the whole scene unfold with what looks suspiciously like patience.<br><br>Mimi mentions, almost as an aside, that Soel\'s been behaving differently around San for months now — reacting to something, in his own inscrutable way, well before any of them had language for what it was.<br><br>San turns to him slowly. "You knew?" she asks.<br><br>Soel blinks at her, entirely unmoved.<br><br>He has, apparently, been sitting on this information for quite some time.<br><br>"He\'s a cat," Joel points out.<br><br>"He\'s a magical cat!" San says, with considerable feeling.<br><br>Soel gets up and leaves. Conversation, as far as he\'s concerned, is over.',
    3: 'Renn and Erynn spend the better part of an afternoon laying out everything they\'ve separately noticed since Arc XXII — San\'s altered reproductive cycle, the unusually subtle early pregnancy, the way her own magical signature has been quietly shifting, Soel\'s reactions, the Fountain itself sitting underneath all of it.<br><br>What they arrive at isn\'t really a diagnosis. It\'s closer to an admission.<br><br>They\'ve been trying to understand something using expectations built entirely around human biology — and it simply hasn\'t been following those rules for a while now.<br><br>San is still human. Her children are still hers and Joel\'s, in every way that matters to her. But Veyren, and the Fountain, have changed the actual process carrying them, in ways neither Renn nor Erynn fully understands yet.',
    4: 'San tells Ate Joy there are two, without much preamble, mostly because she isn\'t sure there\'s a gentle way to lead into it.<br><br>Joy stares at her. Then looks at Joel. Then back at San. Then at Joel again.<br><br>"Two?" she finally asks.<br><br>"Yeah," Joel says.<br><br>Joy sits down, rather abruptly.<br><br>"That\'s what I did," San says, with some sympathy.<br><br>Once the initial shock passes, Ate Joy\'s practical instincts kick in almost immediately, visibly recalculating everything in real time. Every single thing they carefully prepared across Arcs XXXII and XXXIII now needs reconsidering — for two children instead of one.',
    5: 'San and Joel walk back into the room they\'d already finished preparing, and it looks entirely different to both of them now that they know.<br><br>Two.<br><br>Every decision they\'d already settled on suddenly needs reexamining. Joel starts visibly reorganizing everything in his head, calculating space and supplies and logistics on the spot.<br><br>"You\'re doing calculations," San says, watching him.<br><br>"Yeah," Joel admits.<br><br>"Stop," San says.<br><br>He does not stop. San decides, after a moment, that she doesn\'t actually mind.',
    6: "Soel's behavior finally makes sense in a way it never quite has before. He hasn't simply been protecting San, the way everyone assumed. He's been responding, this whole time, to subtle shifts within the pregnancy itself that nobody else could perceive.<br><br>Sometimes he lies pressed against her side, calm and settled. Other times he goes suddenly, inexplicably alert, for no reason anyone else can identify.<br><br>Mimi starts to suspect something more specific, watching him closely over several days. Soel doesn't seem to perceive the twins as one combined presence at all. He's been aware of two separate individuals, distinctly, for a considerably longer time than any of the rest of them.",
    7: "Erynn goes back over what actually happened at the Fountain, at the end of Arc XIX, more carefully than she has in a while. The Fountain restored what had been damaged or impaired in the people it touched — it didn't simply make everyone young again. For San specifically, that included physical problems that had affected her reproductive health long before any of this began.<br><br>But conception happened after that restoration, not because of it — naturally, during the interlude, between San and Joel.<br><br>Which means, Erynn explains carefully, the twins began developing inside a body the Fountain had already altered. The Fountain didn't create them. It didn't reach into San and shape two children out of nothing.<br><br>Its influence simply became part of the conditions they developed under, from the very beginning, the same way anything else about San's body would have been.",
    8: 'Renn searches through everything Fair Tide\'s Archive holds, and everything he can find elsewhere besides. Fountain restoration itself is documented, if imperfectly, scattered across records nobody bothered organizing properly before. Veyren pregnancies have some precedent, here and there.<br><br>Twins, conceived after a Fountain restoration, by two people originally from another world entirely?<br><br>Nothing. Not a single record, not even a rumor of one.<br><br>"This is unprecedented," Renn says, in the tone of someone who finds that genuinely fascinating rather than alarming.<br><br>"I hate when you say that," San tells him, with feeling.',
    9: "Mimi sets aside conventional diagnostics entirely and reaches instead for her own methods — flowers, patterns, the kind of reading nobody else in Fair Tide can fully follow.<br><br>What she perceives is two developing presences, distinct from each other in a way she can sense clearly even now. Not futures. Not fixed personalities waiting to be born. Simply two lives, each with its own magical pattern already distinguishable from the other's.<br><br>She refuses, firmly, to try predicting who either of them will become.<br><br>That refusal matters more than it might look like from outside. The twins may turn out to be unusual, in ways nobody yet understands. They are not, and will not become, prophecies written in advance.",
    10: "All the accumulated discussion — Fountain-born influence, spiritual signatures, unprecedented development, whatever abilities might eventually surface — starts wearing on San in a way she doesn't immediately recognize until it's already happened.<br><br>Later, alone with Joel, she finally says it out loud. \"They're starting to sound like an experiment,\" she admits.<br><br>\"They're our kids,\" Joel says, simply, like there was never any real tension between the two ideas at all.<br><br>It's exactly the reset San needed. Before they're mysteries of Veyren, subjects of Renn's research or Mimi's visions or Erynn's careful theories — they're San and Joel's children. Everything else comes after that, not instead of it.",
    11: "Slowly, without anyone teaching her to, San starts learning to recognize the twins as separate from each other — not simply through the kind of fetal movement she vaguely remembers expecting from Earth, but through something else entirely.<br><br>Sometimes the magic around her responds differently than it did a moment before. Sometimes one presence feels more active, restless in some way she can't quite name, while the other stays quiet and still. Sometimes Soel reacts to one side of her before she's noticed anything herself.<br><br>For the first time since Ch.1's own discovery, San finds herself experiencing them as two distinct children, rather than simply as the pregnancy itself, undivided. It's a small shift. It changes almost everything about how the rest of the arc feels to her.",
    12: 'Ate Joy and Caelan sit down to revisit everything they\'d already planned, and San quickly discovers exactly how expensive the phrase "you\'ll need two" can become once it\'s applied to literally everything.<br><br>Two sleeping spaces instead of one. More supplies, doubled straight down the line. More storage. More of everything they\'d already carefully budgeted for a single child.<br><br>Aisyah starts calculating almost the instant she hears the news, entirely unprompted. Joel joins her within minutes, the two of them falling into an easy rhythm of numbers San mostly tunes out.<br><br>San, watching both of them work, finds herself regretting — not for the first time — surrounding herself with relatives this financially competent.',
    13: "Renn stumbles onto something genuinely strange while cataloguing what little Veyren development data actually exists. The twins, as far as he can tell, aren't simply developing faster across the board than an ordinary human pregnancy would. Some of their systems appear to be maturing more slowly than expected. Others look unusually developed already, ahead of any timeline Renn would predict.<br><br>Magical and spiritual development, in particular, seems to be following an entirely separate timetable of its own, disconnected from either of the other two.<br><br>It's a small discovery, easy to overlook in isolation. But it plants the first real seed of something Fair Tide will only fully understand after the twins are actually born — Veyren children, it seems, don't necessarily mature at any single uniform human rate at all.",
    14: "The conversation drifts, inevitably, toward whether the Fountain's influence means the twins will eventually share the adults' own freedom from ordinary aging.<br><br>Nobody actually knows. San is the first to reject any grand assumption about it, before the discussion gets too far ahead of itself. The Fountain restored the crew from a specific, ordinary, pre-Fountain state each of them had already been living in — but the twins have never had that state to be restored from in the first place. There's nothing established in them for the Fountain to be reversing or repairing.<br><br>Their relationship to it, San insists, may end up being something else entirely — not a smaller version of what the adults experienced, and not necessarily immortality either. Just something nobody can define yet, and shouldn't pretend to.",
    15: "A brief disturbance ripples through one of Fair Tide's secured Horizon routes, nothing serious, resolved almost as quickly as it starts. But Soel reacts to it with startling intensity, considerably more than the actual severity of the event would seem to warrant.<br><br>It isn't San herself in any danger, the crew quickly confirms. Something about the disturbance is reaching the twins' own developing spiritual signatures directly, in a way nothing else so far has.<br><br>The realization that follows unsettles more than one person quietly turning it over. If the twins can already perceive, or even faintly influence, spiritual currents around them in some extremely primitive way — their eventual abilities, whatever they turn out to be, are already beginning to take shape, well before either of them has been born.",
    16: "Renn wants more observations, more carefully documented than what they already have. Erynn keeps generating new questions faster than anyone can answer the last batch. Mimi has visions she can't fully interpret yet, and clearly wants to keep watching for more.<br><br>Nobody involved means any harm by any of it. That doesn't make it sit easily with Joel regardless.<br><br>He draws a simple line, plainly, without much drama attached to it: San and the twins are not research material. Whatever any of them wants to investigate from here forward requires San's own agreement first, every time, no exceptions.<br><br>Renn accepts the boundary immediately, without argument.<br><br>San appreciates, more than she says out loud, that Joel said it before she had to say it herself.",
    17: "The later pregnancy finally starts changing what San can comfortably manage day to day, in ways that are impossible to keep ignoring. Not because she's suddenly become helpless — nothing about her has changed that dramatically. Her body is simply supporting two unusual, developing children at once, and that costs her something real.<br><br>San gets genuinely frustrated whenever she can't keep her previous pace. Joel doesn't respond by telling her to step back from being Captain, doesn't try to talk her into resting more than she wants to.<br><br>Instead, they adjust together, the way they've adjusted most things since this all began.<br><br>\"I hate this,\" San says, more than once.<br><br>\"I know,\" Joel says.<br><br>\"Don't agree so fast,\" San mutters, without much real heat behind it.",
    18: 'Ate Joy notices San quietly trying to do far more than she should, the way she always seems to notice things before anyone points them out to her.<br><br>Unlike nearly everyone else lately, Joy doesn\'t respond by issuing instructions or listing what San shouldn\'t be doing. She simply takes one task off San\'s hands, without announcing it. Then another, just as quietly.<br><br>San notices immediately. "Ate," she says, in a tone that makes her meaning obvious.<br><br>"What?" Joy asks, entirely unbothered, already moving on to the next thing.<br><br>San knows exactly what she\'s doing. Joy continues doing it anyway, unbothered by being caught.<br><br>It turns out to be considerably harder to argue with an older sister about this than it ever was to argue with a Warden about anything.',
    19: "The crew spends an evening wondering, mostly out loud, how much of the outside world the twins might already be able to perceive from where they are. Voices? Magic moving nearby? Soel's presence? The sea itself, somewhere underneath everything else?<br><br>Nobody actually knows, and nobody's found a way to test it properly yet.<br><br>Joel starts talking to the twins anyway, quietly, in odd private moments when he thinks nobody's paying attention.<br><br>San catches him at it once, and he stops immediately, looking faintly embarrassed to have been caught.<br><br>\"Continue,\" San says, watching him.<br><br>Joel looks at her like he's been mildly betrayed by his own wife.<br><br>San just grins, entirely unrepentant.",
    20: 'It happens almost by accident. San calls Joel "Papa," half-joking, while the two of them are alone with nobody else around to hear it.<br><br>It catches him visibly off guard, more than San expects it to.<br><br>A moment later, without much warning, Joel calls her "Mama" right back.<br><br>That gets her, in a way she doesn\'t entirely expect either. After all the research, the observations, the careful preparation stretched across multiple arcs now — those two small words make the entire future suddenly, undeniably immediate in a way none of it quite managed before.<br><br>They aren\'t only San and Joel to each other anymore. To two people neither of them has met yet, they\'re already Mama and Papa, whether either child knows it yet or not.',
    21: "The moment itself is small, almost too small to notice if nobody had been paying attention. San laughs at something — nothing significant, just an ordinary joke between them — and Joel's hand rests against her stomach the way it often does lately. Soel is close by, watching, the way he always is now.<br><br>Then something happens.<br><br>A faint magical response, gentle, unmistakable once Mimi and Erynn both catch it at the same moment. Not an attack. Nothing close to a dramatic display of power. Just enough, barely, for either of them to recognize plainly: one of the twins responded to something happening outside San entirely.<br><br>Then, a moment later, a second response follows — different from the first, distinct in a way neither Mimi nor Erynn can immediately explain.<br><br>Two children. Two signatures. Two emerging abilities, already beginning to show themselves in the smallest possible way. Nobody yet knows what either one actually means.",
    22: 'Mimi experiences a vision tied to the twins, deeper than her usual flower-readings, and everyone braces slightly for whatever she\'s about to say.<br><br>What she describes isn\'t a single destiny. It\'s countless possibilities at once, branching in every direction she can perceive, refusing to settle into anything singular or certain.<br><br>"I don\'t know who they\'ll become," she tells San, plainly.<br><br>"Good," San says, without a moment\'s hesitation.<br><br>It matters enormously, more than the exchange itself might suggest. The twins may well have inherited something extraordinary, through the Fountain, through Veyren itself. But Crimson Tide isn\'t going to treat them as chosen children walking toward some destiny already written out for them. Whatever they become, they get to become it themselves.',
    23: 'San experiences something strong enough, sudden enough, that for one brief, sharp moment everyone around her wonders whether the time has actually come.<br><br>It hasn\'t.<br><br>Erynn works through what actually happened and concludes, with reasonable confidence, that the twins are simply entering another developmental stage — not preparing for imminent birth at all.<br><br>San feels relief and irritation in roughly equal measure, which strikes her as a fairly accurate summary of this entire pregnancy so far.<br><br>"How long?" she finally asks.<br><br>"I don\'t know," Erynn admits.<br><br>San looks at Renn instead, hopefully.<br><br>"Neither do I," Renn says.<br><br>"Excellent," San says. "Very useful researchers, both of you."',
    24: 'Night settles quietly over Fair Tide. The house has gone still. Soel sleeps curled up nearby, exactly where he\'s taken to settling these past weeks. San and Joel sit together, simply present with each other, in a way that doesn\'t need to be filled with conversation.<br><br>They know considerably more now than they did at the start of this arc. Two children. Two distinct spiritual signatures, already unmistakably their own. A pregnancy shaped by Veyren in ways neither of them fully expected. The Fountain\'s own lingering influence, woven into all of it from the very beginning. Small, faint signs of abilities nobody yet understands. And, still, absolutely no idea when either child is actually coming.<br><br>Joel rests his hand against San, gently, the way he has so many times by now.<br><br>One response. Then, a moment later, another — different, distinct, unmistakably separate from the first.<br><br>San smiles. "There really are two of you," she says, quietly, to no one who can yet answer her in words.<br><br>"Yeah," Joel says anyway.<br><br>San leans into him.<br><br>Beyond their home, Fair Tide continues exactly as it always has. The twins haven\'t entered the world yet. But sitting here, feeling what she just felt, that no longer feels entirely accurate to San. They respond to their parents already. Soel has known them for longer than anyone. Their family has been preparing for them for arcs now. Their presence has already changed Fair Tide, long before either of them takes a single breath of their own.<br><br>Two lives, already part of the family.'
  };
  window.ARC34_CHAPTER_SCENES = ARC34_CHAPTER_SCENES;

  window.arc34ObjectiveState = function(){
    if (!game.arc33Complete) return null;
    if (level() < 510) return null;
    game.comicProgress34 = game.comicProgress34 || {};
    for (const ch of ARC34_CHAPTERS) {
      if (!game.comicProgress34[ch.id]) return 'complete_arc34_chapter_' + ch.id;
    }
    return 'arc34_part1_complete_for_now';
  };

  window.markArc34ChapterRead = function(id){
    const so = window.arc34ObjectiveState();
    if (so !== ('complete_arc34_chapter_' + id)) return;
    game.comicProgress34 = game.comicProgress34 || {};
    game.comicProgress34[id] = true;
    // Matches every prior arc's own completion flag (arc32/arc33Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 24) game.arc34Complete = true;
    const ch = ARC34_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC34_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC34_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc34Splash = function(){
    const overlay = document.getElementById('arc34SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc34Splash = function(){
    const overlay = document.getElementById('arc34SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc34SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc34 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc34) oldRenderStoryForArc34();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc34Ready = window.arc34ObjectiveState() !== null;
    if (arc34Ready && !game.arc34SplashSeen && typeof window.__ctShowArc34Splash === 'function') {
      window.__ctShowArc34Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc34/arc34-cover-two-hearts.png" alt="Arc XXXIV — Two Hearts" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXXIV</div><div class="story-act-title">Two Hearts</div>'+
      '<div class="story-act-tagline">Two lives, already part of the family.</div></div>';
    if (!arc34Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXXIV Locked</div><div class="story-chapter-sub">'+
        (!game.arc33Complete ? 'Finish Arc XXXIII first.' : 'Reach Level 510 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc34ObjectiveState();
    ARC34_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress34 && game.comicProgress34[ch.id]);
      const ready = !done && so===('complete_arc34_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc34ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc34_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXXIV chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
