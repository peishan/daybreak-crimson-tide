(function(){
  // -------------------------------------------------------------------
  // ARC XXXVI — GROWING TIDES. Gated at arc35Complete + level 540,
  // continuing the established +15-per-arc ladder (XXXIII:495,
  // XXXIV:510, XXXV:525, XXXVI:540). Ch.24 sets game.arc36Complete =
  // true, matching every other arc's own finale flag.
  //
  // Per the outline this arc was built from: Arc XXXV ended with the
  // twins newly born. Arc XXXVI picks up immediately after and spends
  // its first stage of Veyren childhood discovering that "baby" doesn't
  // last nearly as long in Veyren as San and Joel expected. Growth
  // cycles (Ch.5-6, 23), mobility (Ch.13-15), individual and paired
  // magical signatures (Ch.7-10), and an expanding social world (Ch.17-
  // 18) all build toward Ch.10's own core revelation — Soel doesn't
  // merely detect the twins' magic, he can help regulate it — which the
  // outline calls out as the moment Soel Watch (Arc XXXV) becomes Soel
  // Guardian. Maera (Arc XXII) becomes mechanically recurring at the
  // same time she becomes narratively recurring (Ch.11, 16, 19),
  // providing lived Veyren experience alongside Renn's research,
  // Erynn's history, and Mimi's divination — never replacing any of
  // them. Per the outline's own explicit restraint: Ch.8-9's sparks
  // confirm a recurring pattern for each twin without ever defining a
  // complete power set, and nothing here collapses chronological age,
  // developmental stage, and growth cycle into one single number —
  // Ch.23 deliberately keeps them capable of diverging later.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. The Veyren Growth gameplay system (extending
  // Arc XXXV's own Family Life system rather than adding an unrelated
  // one) Ch.5-6, 8-10, 14, and 19's own notes call for lives in
  // scripts/arc36-mechanics.js, same split used since Arc XXIII.
  //
  // XP stays in the same gentle range Arc XXXII-XXXV established. Ch.10
  // ("Three-Way Resonance") is the centerpiece at 400 — the chapter
  // where Soel's regulating ability actually gets confirmed, matching
  // the Soel Guardian unlock the mechanics file ties to this exact
  // chapter. Ch.24's finale keeps the "one centerpiece, not two"
  // convention at 380, below the centerpiece.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC36_CHAPTERS = [
    {id:1, title:'The First Quiet Morning', focus:'The first morning after the excitement of Arc XXXV. Vaeren and Joelle are asleep. Still asleep. San checks them, then checks again. "They\'re fine." "I know." She checks again. Soel doesn\'t even open his eyes.', image:'assets/comics/arc36/ch01-the-first-quiet-morning.png', xp:255, action:'🌙 Have the First Quiet Morning'},
    {id:2, title:"Soel's Shift", focus:"Soel establishes his own routine around the twins — attentive shortly before they wake, close by during strange magical fluctuations, peaceful through their normal growth cycles. San and Joel gradually learn to read his behavior alongside the children's own. He's not their babysitter. He's something closer to their guardian.", image:'assets/comics/arc36/ch02-soels-shift.png', xp:260, action:"🐈 Learn Soel's Shift"},
    {id:3, title:'Fair Tide Can Manage', focus:"San and Joel begin returning to their responsibilities. Fair Tide has continued functioning without them personally overseeing everything — Aisyah, Joy, Caelan, Maera and the rest of the community have handled everyday problems. Parenthood doesn't require abandoning the Captain's role. Being Captain doesn't require doing everything herself.", image:'assets/comics/arc36/ch03-fair-tide-can-manage.png', xp:265, action:'⚓ Trust Fair Tide Can Manage'},
    {id:4, title:'Feeding Vaeren and Joelle', focus:'San and Joel grow confident preparing the Veyren nourishment from Arc XXXV. Then the twins develop preferences — Vaeren accepts something, Joelle refuses it; Joel adjusts it, Joelle accepts it, now Vaeren refuses his. "They\'re doing this deliberately." "They\'re babies." "You don\'t know that." Soel observes suspiciously.', image:'assets/comics/arc36/ch04-feeding-vaeren-and-joelle.png', xp:270, action:'🍲 Feed Vaeren and Joelle'},
    {id:5, title:'Bigger?', focus:'Ate Joy picks Vaeren up and pauses — something is different. Maera notices it too. Measurements confirm both twins have grown noticeably following another long sleep cycle. The growth isn\'t identical. Joelle and Vaeren have their own developmental rhythms.', image:'assets/comics/arc36/ch05-bigger.png', xp:275, action:'🌱 Measure Bigger?'},
    {id:6, title:'Growth Sleep', focus:'Renn and Erynn document the pattern. Maera provides an important distinction: long developmental sleep isn\'t inherently strange for Veyren children — this degree of growth may be. That gives Fair Tide its first useful separation between a normal Veyren trait and a Vaeren-and-Joelle trait. Their Fountain inheritance remains possible, but nobody declares it proven.', image:'assets/comics/arc36/ch06-growth-sleep.png', xp:280, action:'📚 Document Growth Sleep'},
    {id:7, title:'His Sister', focus:"Joelle becomes restless while Vaeren enters another developmental change. Placed near one another, she settles. Later Vaeren responds the same way to Joelle. The twins clearly recognize one another at a level beyond ordinary proximity. Their paired nature is beginning to emerge.", image:'assets/comics/arc36/ch07-his-sister.png', xp:285, action:'💞 Recognize His Sister'},
    {id:8, title:"Vaeren's Spark", focus:"Vaeren repeatedly produces the same small magical phenomenon — enough for Renn to recognize a pattern, not enough to define his power. Emerging Ability: Unknown. Recurring Pattern: Confirmed. His ability can develop naturally with his personality later.", image:'assets/comics/arc36/ch08-vaerens-spark.png', xp:290, action:"✨ Watch Vaeren's Spark"},
    {id:9, title:'Joelle Answers', focus:"Joelle manifests something different — importantly, not simply Vaeren's magic with a feminine visual treatment. Her signature behaves independently. But when Vaeren's ability appears, hers occasionally reacts. Individual abilities. Possible paired effects.", image:'assets/comics/arc36/ch09-joelle-answers.png', xp:290, action:'🌸 Hear Joelle Answers'},
    {id:10, title:'Three-Way Resonance', focus:"Both twins become magically overstimulated simultaneously, their signatures feeding into one another. Before San or the researchers can intervene, Soel approaches and his presence settles them. This confirms something suspected since pregnancy: Soel doesn't merely detect their magic. He can help regulate it.", image:'assets/comics/arc36/ch10-three-way-resonance.png', xp:400, action:'🐈 Witness Three-Way Resonance'},
    {id:11, title:'Ask Maera', focus:'San, Joel, Joy and Mimi compare parenting experience — plenty of knowledge about human children, and Vaeren and Joelle keep doing things none of their children did. So they ask Maera, who identifies several behaviors as perfectly ordinary. Then Joelle does something else. Maera pauses. "Normal?" "...No." She isn\'t an encyclopedia. She simply knows what growing up in Veyren normally looks like.', image:'assets/comics/arc36/ch11-ask-maera.png', xp:285, action:'🌿 Ask Maera'},
    {id:12, title:'Captain Mama', focus:'San resumes more of her Captain duties. During a meeting, one of the twins needs her. Someone offers to take the baby. San considers it, then continues the meeting while holding her child. Fair Tide adapts. There doesn\'t have to be a separate Captain San and Mama San. Both are her.', image:'assets/comics/arc36/ch12-captain-mama.png', xp:290, action:'🏡 Be Captain Mama'},
    {id:13, title:'Too Soon', focus:'One twin attempts a mobility milestone considerably earlier than expected. San objects. "Too early." "Apparently not." "Tell them." "You tell them." Neither twin respects parental scheduling.', image:'assets/comics/arc36/ch13-too-soon.png', xp:285, action:'👣 Call It Too Soon'},
    {id:14, title:'Mobile', focus:'Vaeren figures out movement. Joelle follows shortly afterward, but not necessarily using exactly the same method. San and Joel make a terrible discovery: their children can now independently go somewhere else. Their peaceful stationary-child era is over.', image:'assets/comics/arc36/ch14-mobile.png', xp:300, action:'🌱 Go Mobile'},
    {id:15, title:'Follow Soel', focus:'The twins begin following Soel. He walks away; they follow. He walks faster; they follow faster. San discovers all three disappearing down a corridor. "SOEL." He looks back. Thus begins the legendary alliance: Vaeren + Joelle + Soel.', image:'assets/comics/arc36/ch15-follow-soel.png', xp:290, action:'🐾 Follow Soel'},
    {id:16, title:'Fair Tide Proofing', focus:'Caelan starts making the household safer. Maera points out several places where everyone applied human childproofing assumptions to Veyren children. "Why did you move that?" "Baby." "They can\'t reach it." Vaeren demonstrates otherwise. "Move it." Fair Tide itself begins adapting to rapidly developing children.', image:'assets/comics/arc36/ch16-fair-tide-proofing.png', xp:290, action:'🛡️ Start Fair Tide Proofing'},
    {id:17, title:'The Fair Tide Circle', focus:"The twins' world expands — Aisyah and Mez, Senedra, Zaki and Eliz as familiar cousins, Ate Joy as Ate Joy, Mimi and Brada visiting, Caelan a familiar presence, and Maera now part of their ordinary world rather than only appearing when someone needs Veyren information. Each twin responds differently to different people. Their personalities are emerging through relationships.", image:'assets/comics/arc36/ch17-the-fair-tide-circle.png', xp:295, action:'🌿 Join the Fair Tide Circle'},
    {id:18, title:'Beyond Mama and Papa', focus:"San notices the twins' world used to consist almost entirely of Mama, Papa, each other, and Soel. Now they actively recognize and seek out Maera, Ate Joy, Aisyah, Mez, their cousins, the researchers, the wider settlement. A small but emotional realization: their world is getting bigger.", image:'assets/comics/arc36/ch18-beyond-mama-and-papa.png', xp:300, action:'🌌 Go Beyond Mama and Papa'},
    {id:19, title:'The Water', focus:"Vaeren and Joelle are brought near Veyren's sea. Something changes in their spiritual signatures. Erynn studies the response; Renn wants measurements; Maera offers another perspective — she's seen Veyren-born children encounter their world before, and some of what they're seeing is normal, some isn't. San considers something obvious she'd never quite understood: Vaeren and Joelle belong to Veyren from birth.", image:'assets/comics/arc36/ch19-the-water.png', xp:320, action:'🌊 Reach The Water'},
    {id:20, title:'Together', focus:"A small incident briefly separates the twins. Both become unusually distressed. Soel helps reunite them. Their connection is developing alongside their individual identities, but it isn't one shared consciousness. It's Vaeren, Joelle, and something unique that exists between them. This lays the foundation for their eventual paired gameplay.", image:'assets/comics/arc36/ch20-together.png', xp:300, action:'💞 Bring Them Together'},
    {id:21, title:'The Look', focus:'San catches Vaeren somewhere he shouldn\'t be. Joelle is nearby. Soel is sitting beside them. All three look innocent. San knows something happened. She has absolutely no evidence. "Which one of you started this?" Nothing. She looks at Soel. "You know." Soel leaves. This is going to become a problem.', image:'assets/comics/arc36/ch21-the-look.png', xp:290, action:'😇 Give The Look'},
    {id:22, title:'Different Parents', focus:"San and Joel talk privately about how different this feels from their previous parenthood — not invalidating their old children or competing over whose circumstances were harder. Those children remain part of who they are. But this is the first time San and Joel have experienced every stage together. They're not replacing their previous families. They're building this one together.", image:'assets/comics/arc36/ch22-different-parents.png', xp:300, action:'❤️ Talk as Different Parents'},
    {id:23, title:'Faster Than Expected', focus:'Another growth cycle occurs — this time undeniable. Renn updates the records. Maera confirms Veyren childhood can progress differently from human childhood, but even by those standards, Vaeren and Joelle appear unusual. Their chronological age, apparent physical age and developmental ability will not remain neatly aligned. "They\'re not going to stay babies very long." Ate Joy smiles. "They never do."', image:'assets/comics/arc36/ch23-faster-than-expected.png', xp:310, action:'🌱 Measure Faster Than Expected'},
    {id:24, title:'Growing Tides', focus:'Morning. Vaeren and Joelle are awake. Soel walks past; two little heads turn; he stops; they move toward him; he walks faster; they follow. "He\'s going to regret this. Becoming their leader." "I don\'t think he\'s the leader." Maera: "You should probably follow them." Fair Tide has changed again — not through war, not through politics. Two children are simply growing, and the community around them is growing with them.', image:'assets/comics/arc36/ch24-growing-tides.png', xp:380, action:'🌅 Follow the Growing Tides'}
  ];
  window.ARC36_CHAPTERS = ARC36_CHAPTERS;

  const ARC36_CHAPTER_SCENES = {
    1: 'The morning arrives quietly, without any of the urgency of the night everything actually happened. Vaeren and Joelle are asleep. Still asleep, in fact, well past the point San expects either of them to stir.<br><br>San checks on them. Nothing\'s wrong — they\'re simply, peacefully asleep.<br><br>She checks again anyway, a few minutes later.<br><br>"They\'re fine," Joel says, from across the room, not even looking up.<br><br>"I know," San says.<br><br>She checks a third time regardless.<br><br>Soel, curled up beside the twins the entire time, doesn\'t even bother opening his eyes for any of it. As far as he\'s concerned, there was never anything to check.',
    2: "Soel settles into a routine of his own around the twins, one nobody actually assigns him and nobody would know how to replicate even if they tried. He turns noticeably attentive shortly before either twin wakes, well before any outward sign gives it away. He stays close during odd little magical fluctuations neither San nor Joel can always perceive themselves. He sleeps through their perfectly ordinary growth cycles without a trace of concern.<br><br>Slowly, San and Joel learn to read his behavior as its own kind of information, layered right alongside whatever the twins themselves are actually doing.<br><br>He isn't simply watching them, the way a babysitter might. It's something closer to guardianship — quieter, more attuned, entirely his own.",
    3: "San and Joel start easing back into their ordinary responsibilities, carefully at first. What they find waiting for them is Fair Tide, functioning exactly as it has been — Aisyah, Joy, Caelan, Maera, and the rest of the community already handling whatever ordinary problems came up while San and Joel's attention was elsewhere.<br><br>It isn't a surprise, not really. It still lands as its own small, important realization. Parenthood never actually required San to abandon being Captain. Being Captain, in turn, never required her to personally handle every single thing herself — a lesson this particular arc keeps finding new ways to teach her.",
    4: 'San and Joel grow steadily more confident preparing the Veyren nourishment Renn and Erynn identified back in Arc XXXV — right up until the twins start developing actual preferences of their own.<br><br>Vaeren happily accepts one preparation. Joelle refuses the exact same thing outright. Joel adjusts it slightly for her; she accepts it immediately. Then, naturally, Vaeren refuses his own version instead.<br><br>"They\'re doing this deliberately," San says, with real suspicion.<br><br>"They\'re babies," Joel points out.<br><br>"You don\'t know that," San says.<br><br>Soel watches the entire exchange with what looks suspiciously like judgment.',
    5: "Ate Joy picks Vaeren up for an entirely ordinary cuddle and pauses almost immediately, something clearly catching her attention. Maera notices the same thing a moment later, examining him more carefully.<br><br>Measurements confirm it plainly: both twins have grown noticeably since their last long sleep cycle, more than either Joy or Maera expected from the time that's actually passed.<br><br>The growth isn't identical between them, either. Joelle and Vaeren, it turns out, are already developing according to their own separate rhythms — not perfectly matched, twin or not.",
    6: "Renn and Erynn start properly documenting the pattern, comparing notes carefully rather than simply reacting to each new surprise as it comes. Maera offers something neither of them could have provided on their own — a genuinely useful distinction. Long developmental sleep like this isn't inherently unusual for Veyren children in general. The sheer degree of growth that follows it, in Vaeren and Joelle's specific case, might be.<br><br>It gives Fair Tide its first real way of separating two different categories that had been blurring together until now: ordinary Veyren traits, and traits that might belong specifically to Vaeren and Joelle. Their Fountain inheritance remains a plausible explanation underneath all of it. Nobody, Maera included, is willing to call it proven yet.",
    7: "Joelle grows restless while Vaeren moves through another developmental change of his own, fussing in a way nothing immediately explains. The moment someone places them near each other, though, she settles completely, without any other intervention needed.<br><br>Later, the same thing happens in reverse — Vaeren responding to Joelle's presence the same way she just responded to his.<br><br>It's clear, watching it happen twice now, that the twins recognize each other at some level well beyond simple proximity. Whatever paired nature exists between them is only just beginning to show itself.",
    8: "Vaeren produces the same small magical phenomenon, over and over, consistently enough that Renn finally has something real to work with. It's enough to recognize a genuine pattern forming. It's nowhere near enough to actually define what his ability eventually will be.<br><br>Renn writes it down carefully: Emerging Ability, Unknown. Recurring Pattern, Confirmed. Nothing more specific than that, and nothing more specific is forced onto it. Whatever Vaeren's ability turns out to be, it can develop naturally alongside the rest of who he becomes, later, on its own time.",
    9: "Joelle produces something of her own not long after — distinctly different from her brother's, and importantly, not simply a softer or more feminine version of the exact same effect. Her signature behaves independently, its own thing entirely, separate from whatever Vaeren is doing.<br><br>But there's a wrinkle in that independence. When Vaeren's own ability appears, hers occasionally reacts to it, faintly, in a way that's hard to dismiss as coincidence after it happens more than once.<br><br>Two individual abilities, clearly. Possibly, underneath that, some kind of paired effect as well. Nobody's ready to say for certain yet.",
    10: "Both twins become magically overstimulated at the same time, their two signatures beginning to feed into each other faster than anyone watching can fully track. For a moment, it looks like it might genuinely spiral into something concerning.<br><br>Before San or any of the researchers can actually intervene, Soel simply walks over and settles between them.<br><br>The effect is immediate. Both signatures calm, smoothing out almost as soon as he arrives.<br><br>It confirms something that's been quietly suspected since well before either twin was born. Soel doesn't merely sense their magic, watching it happen from a careful distance. He can actually help regulate it himself, directly, the moment it's needed.",
    11: 'San, Joel, Joy, and Mimi compare notes one evening, pooling what\'s actually a considerable amount of combined parenting experience between the four of them. Plenty of real knowledge about human children, hard-won and genuine.<br><br>Unfortunately, Vaeren and Joelle keep doing things none of their children ever did, human or otherwise.<br><br>So they turn to Maera instead. She works through several of the behaviors they describe and identifies most of them as perfectly ordinary for Veyren babies, nothing concerning at all.<br><br>Then they describe something Joelle did earlier that day.<br><br>Maera pauses. "Normal?" San asks, hopefully.<br><br>"...No," Maera says.<br><br>She isn\'t an encyclopedia, and she\'s quick to say so herself. She simply knows, from genuinely living it, what growing up in Veyren actually tends to look like — which turns out to be considerably more useful than any book could be.',
    12: "San eases back into more of her actual Captain duties, deliberately, rather than tiptoeing around them indefinitely. Partway through one meeting, one of the twins needs her, fussing audibly enough that everyone notices.<br><br>Someone offers, politely, to take the baby off her hands for a moment.<br><br>San considers it. Then simply continues the meeting instead, her child settled against her the entire time, without missing a beat.<br><br>Fair Tide adapts around it easily enough. There was never any real need for a separate Captain San and a separate Mama San, carefully kept apart from each other. They're both simply her, at the same time, doing both at once.",
    13: 'One twin attempts something considerably ahead of schedule — an early, clumsy stab at real mobility, far sooner than anyone expected from either of them.<br><br>San objects immediately, mostly on principle. "Too early," she says.<br><br>"Apparently not," Joel says, watching it happen anyway.<br><br>"Tell them," San says.<br><br>"You tell them," Joel says.<br><br>Neither twin, predictably, shows the slightest interest in respecting whatever schedule their parents had quietly assumed for them.',
    14: "Vaeren works out movement properly, somewhere between a crawl and something considerably more determined. Joelle follows not long after — though, true to form, not necessarily by exactly the same method he used.<br><br>San and Joel arrive at a genuinely unwelcome realization almost immediately afterward. Their children can now, independently, decide to go somewhere else entirely, without waiting for anyone's permission or assistance.<br><br>Whatever peaceful, stationary era of parenthood they'd been quietly enjoying is now, officially, completely over.",
    15: 'The twins start following Soel wherever he goes, with a persistence neither San nor Joel anticipated. He walks away; they follow. He picks up the pace slightly; they follow faster, matching him without much difficulty.<br><br>San eventually discovers all three of them disappearing together down a corridor she didn\'t even know they\'d reached.<br><br>"SOEL," she calls, with some urgency.<br><br>He looks back at her, entirely unbothered, before continuing on anyway.<br><br>And so begins what San will later describe, with real exasperation, as the legendary alliance — Vaeren, Joelle, and Soel, officially united, for better or worse.',
    16: 'Caelan starts working through the household properly, making it genuinely safer rather than merely assuming it already is. Maera walks the same space with him and immediately points out several places where everyone quietly applied ordinary human childproofing logic to children who aren\'t, strictly speaking, ordinary human children.<br><br>"Why did you move that?" Maera asks, looking at one particular shelf.<br><br>"Baby," San says, as if this explains everything.<br><br>"They can\'t reach it," Maera points out.<br><br>Vaeren, with impeccable timing, immediately demonstrates otherwise.<br><br>Maera looks at him. Then at San. "Move it," she says, flatly.<br><br>Fair Tide itself, bit by bit, starts adjusting to having rapidly developing children moving through it.',
    17: "The twins' world keeps widening, person by person. Aisyah and Mez each build their own small relationship with them, separate from anyone else's. Senedra, Zaki, and Eliz settle comfortably into the role of familiar cousins. Ate Joy is, simply and thoroughly, Ate Joy. Mimi and Brada visit often enough to become expected faces rather than occasional guests. Caelan, through sheer repeated presence, becomes someone else entirely familiar to them. And Maera, increasingly, becomes part of their ordinary everyday world — not someone who only appears when the adults need information about Veyren, but someone who's simply there, regularly, like everyone else.<br><br>Each twin responds a little differently to each of these people, in ways that are becoming genuinely their own. Their personalities, San realizes, are starting to take shape through exactly these relationships.",
    18: "San notices something she hadn't quite put into words before. For a long while, the twins' entire world consisted of almost nothing beyond Mama, Papa, each other, and Soel — a small, tightly closed circle that made complete sense for two newborns.<br><br>That circle is visibly larger now. They actively recognize people beyond it, and more than that, actually seek them out — Maera, Ate Joy, Aisyah, Mez, their cousins, even the researchers who spend so much time around them, the wider settlement itself in smaller ways.<br><br>It's a small thing to notice, in the middle of an otherwise ordinary day. It still catches San somewhere unexpected. Their world, she realizes, is quietly getting bigger, one person at a time.",
    19: "Vaeren and Joelle are brought close to Veyren's sea for the first time since their birth, and something shifts almost immediately in both of their spiritual signatures, plain enough that nobody has to go looking for it.<br><br>Erynn studies the response carefully. Renn, predictably, wants actual measurements. Maera offers something neither of them can — she's personally seen Veyren-born children encounter the sea like this before, more than once, and some of what's happening here matches that completely. Some of it, she admits, doesn't.<br><br>Watching all of it unfold, San lands on something almost embarrassingly obvious that she'd never quite let herself fully understand before now. She and Joel live in Veyren, by choice, after everything that brought them here. Vaeren and Joelle were never visitors to it at all. They belong to Veyren from the very moment they were born.",
    20: "A small, unremarkable incident briefly separates the twins — nothing dangerous, nothing dramatic, just an ordinary interruption that happens to put some distance between them for a few minutes. Both of them become distressed almost immediately, far more than the situation itself would seem to warrant.<br><br>Soel moves to reunite them without being asked, and the moment they're close again, both settle completely.<br><br>Their connection is clearly developing right alongside their own separate, individual identities — not instead of them. It isn't one single shared consciousness, split awkwardly between two bodies. It's Vaeren. It's Joelle. And it's something else entirely, distinct from either of them on their own, that exists specifically between the two of them.",
    21: 'San catches Vaeren somewhere he very clearly shouldn\'t be. Joelle happens to be nearby. Soel is sitting beside both of them, perfectly composed.<br><br>All three look completely, suspiciously innocent.<br><br>San knows, with total certainty, that something happened here. She has, just as certainly, absolutely no actual evidence of what.<br><br>"Which one of you started this?" she asks, mostly out of principle.<br><br>Nothing. Not from either twin, and certainly not from Soel.<br><br>She looks at him directly. "You know," she says.<br><br>Soel simply gets up and leaves, declining to confirm or deny anything at all.<br><br>San has the distinct feeling this particular dynamic is going to become a genuine problem, sooner rather than later.',
    22: "San and Joel find a quiet moment to talk privately about how different this entire experience feels from either of their previous rounds of parenthood. Neither of them tries to erase or diminish those earlier children in the process, and neither competes over whose circumstances back then were harder — those children remain exactly as much a part of who San and Joel are as they've always been.<br><br>What's genuinely new is simpler than any of that. This is the first time either of them has experienced every single stage of a child's life together, from the very beginning, as partners rather than separately. Joel acknowledges things about early parenthood he never actually got to experience before. San acknowledges things she never had the chance to learn herself the first time around.<br><br>They're not replacing anything that came before. They're simply building this particular family together, for the first time, as themselves.",
    23: 'Another growth cycle hits, and this time there\'s no mistaking or softening how significant the change actually is. Renn updates the records carefully, cross-referencing everything against what little precedent exists.<br><br>Maera confirms what she\'s suspected for a while now — Veyren childhood genuinely can progress differently than human childhood does, in general. But even measured against that wider, looser standard, Vaeren and Joelle still read as unusual. Their chronological age, their apparent physical age, and their actual developmental ability are not going to stay neatly lined up with each other, not for much longer.<br><br>San looks at her children for a long moment. "They\'re not going to stay babies very long," she says, mostly to herself.<br><br>Ate Joy smiles. "They never do," she says.<br><br>For once, human parenting wisdom and Veyren parenting wisdom land on exactly the same answer.',
    24: 'Morning arrives, ordinary in every visible way. Vaeren and Joelle are already awake. Soel walks past them, unhurried.<br><br>Two small heads turn to follow him.<br><br>He stops. They start moving toward him. He picks up his pace slightly. They follow, faster now, matching him easily.<br><br>San watches the whole thing unfold from across the room. Joel comes to stand beside her.<br><br>"He\'s going to regret this," San says.<br><br>"What?" Joel asks.<br><br>"Becoming their leader," San says.<br><br>Joel watches Soel disappear around the corner, both children in determined pursuit. "I don\'t think he\'s the leader," he says, after a moment.<br><br>San considers that. It\'s considerably more worrying, somehow, than the alternative.<br><br>Maera passes them both on her way through, glancing toward the already-vanished trio. "You should probably follow them," she says, mildly, and keeps walking.<br><br>San sighs. "Definitely not the leader," she mutters, and goes after her children anyway.<br><br>Fair Tide has changed again. Not because of a war. Not because of another world. Not because of politics.<br><br>Two children are simply growing. And the whole community around them is growing right alongside them.'
  };
  window.ARC36_CHAPTER_SCENES = ARC36_CHAPTER_SCENES;

  window.arc36ObjectiveState = function(){
    if (!game.arc35Complete) return null;
    if (level() < 540) return null;
    game.comicProgress36 = game.comicProgress36 || {};
    for (const ch of ARC36_CHAPTERS) {
      if (!game.comicProgress36[ch.id]) return 'complete_arc36_chapter_' + ch.id;
    }
    return 'arc36_part1_complete_for_now';
  };

  window.markArc36ChapterRead = function(id){
    const so = window.arc36ObjectiveState();
    if (so !== ('complete_arc36_chapter_' + id)) return;
    game.comicProgress36 = game.comicProgress36 || {};
    game.comicProgress36[id] = true;
    // Matches every prior arc's own completion flag (arc34/arc35Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 24) game.arc36Complete = true;
    const ch = ARC36_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC36_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC36_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc36Splash = function(){
    const overlay = document.getElementById('arc36SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc36Splash = function(){
    const overlay = document.getElementById('arc36SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc36SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc36 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc36) oldRenderStoryForArc36();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc36Ready = window.arc36ObjectiveState() !== null;
    if (arc36Ready && !game.arc36SplashSeen && typeof window.__ctShowArc36Splash === 'function') {
      window.__ctShowArc36Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc36/arc36-cover-growing-tides.png" alt="Arc XXXVI — Growing Tides" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXXVI</div><div class="story-act-title">Growing Tides</div>'+
      '<div class="story-act-tagline">Children change a home simply by growing within it.</div></div>';
    if (!arc36Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXXVI Locked</div><div class="story-chapter-sub">'+
        (!game.arc35Complete ? 'Finish Arc XXXV first.' : 'Reach Level 540 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc36ObjectiveState();
    ARC36_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress36 && game.comicProgress36[ch.id]);
      const ready = !done && so===('complete_arc36_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = 
          '<button class="btn btn-small btn-success" onclick="markArc36ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc36_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXXVI chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
