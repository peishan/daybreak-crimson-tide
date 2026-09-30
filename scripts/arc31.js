(function(){
  // -------------------------------------------------------------------
  // ARC XXXI — WHAT WE PROTECT. Gated at arc30Complete + level 465,
  // continuing the established +15-per-arc ladder (XXVIII:420, XXIX:435,
  // XXX:450, XXXI:465). Ch.24 sets game.arc31Complete = true, matching
  // every other arc's own finale flag.
  //
  // Per the outline this arc was built from: Arc XXX proved Fair Tide's
  // openness could be exploited. This arc asks how to protect that
  // openness without destroying it — Ch.11's own stated principle is
  // the arc's actual thesis: "We protect Fair Tide so people can live
  // here. We don't stop living here so it's easier to protect." Ch.23
  // ("Open Gates") is the direct proof of that principle in practice:
  // visitors stay welcome, temporary residents stay possible, trade and
  // Horizon relationships continue — access is structured, not closed.
  //
  // Per the outline's own explicit restraint: this arc does NOT reveal
  // whoever stood behind Arc XXX's Pawn. Suspicious activity and probing
  // attempts can occur without ever confirming a connection to N's
  // handler — that thread stays asleep. N herself does not appear and
  // gets no update on her whereabouts. Sairen does not become a roster
  // member here either; his eventual recruitment is earned across later
  // arcs, not triggered by N's disappearance.
  //
  // Character advancement, per the outline: Joy becomes firmly
  // established as Warden of Fair Tide (Ch.19 is explicitly "Joy's
  // chapter"). Caelan's Fair Tide Infrastructure / Settlement
  // Engineering specialization is formally recognized (Ch.12). Brada
  // gets a clear permanent role in harbor/ranged defense (Ch.5, 16).
  // Joel's First Mate role expands from San's closest officer into the
  // person who can coordinate Fair Tide when the Captain's attention is
  // elsewhere (Ch.2, 15, 20). And San's own lesson (Ch.21, 24) is that
  // N's betrayal doesn't mean trusting people was a mistake — it means
  // trust needs boundaries, systems, and people capable of responding
  // when it's abused.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. The Fair Tide Defense & Readiness system Ch.3-5,
  // 7-8, 12, and 18-21's own notes call for lives in
  // scripts/arc31-mechanics.js, same split used since Arc XXIII.
  //
  // XP escalates toward Ch.21 ("Captain" — the direct payoff of "Fair
  // Tide survives because Fair Tide works," and where the Readiness
  // system's own unlock lands) at 400, with Ch.24's finale bump (380)
  // kept below it — the same "one centerpiece, not two" convention used
  // since Arc XX.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC31_CHAPTERS = [
    {id:1, title:'The Morning After', focus:"Fair Tide wakes after the Horizon crisis. The port is intact, but nobody is celebrating — routes remain restricted, procedures have changed, and people are talking about N's betrayal. San realizes the damage isn't merely logistical: people are wondering who else shouldn't be trusted. She refuses to let fear become Fair Tide's new foundation.", image:'assets/comics/arc31/ch01-the-morning-after.png', xp:260, action:'🌅 Wake to the Morning After'},
    {id:2, title:'First Mate', focus:"Joel takes over much of the practical coordination while San deals with the wider consequences — ship movements, crew assignments, harbor readiness, supply priorities, watch rotations. For once, First Mate isn't merely the title beside Captain. Fair Tide sees exactly what Joel does when San can't personally be everywhere.", image:'assets/comics/arc31/ch02-first-mate.png', xp:270, action:'⚓ Watch Joel Step Up'},
    {id:3, title:'The Warden', focus:"Joy reviews Fair Tide's defenses and finds plenty of security measures — harbor patrols, storehouse watches, Horizon security, residential protection, expedition readiness — all developed separately over time. She proposes bringing them together under a proper Warden system. Her job was never merely guarding San. It's protecting Fair Tide's people.", image:'assets/comics/arc31/ch03-the-warden.png', xp:280, action:'🛡️ Build the Warden System'},
    {id:4, title:"Walls Aren't Enough", focus:"Caelan examines the settlement itself — blind corners, vulnerable docks, poorly positioned storage, routes that turn dangerous during emergencies. His answer isn't bigger walls. He starts redesigning infrastructure so Fair Tide can protect itself while still functioning as a port and a home.", image:'assets/comics/arc31/ch04-walls-arent-enough.png', xp:280, action:'🔨 Redesign the Walls'},
    {id:5, title:"Brada's Range", focus:"Brada finally gets a role suited exactly to him — his ballista expertise applied to harbor defense. Rather than militarizing Fair Tide, he identifies positions that protect ships and docks from long-range threats. Mimi is perhaps slightly too delighted to watch him get enormous equipment to play with.", image:'assets/comics/arc31/ch05-bradas-range.png', xp:280, action:"🎯 Find Brada's Range"},
    {id:6, title:'The People Who Live Here', focus:'San attends a community gathering. Some residents want stricter restrictions; others worry Fair Tide is becoming closed. Someone asks the uncomfortable question: "How do we know the next N isn\'t already here?" San answers honestly — they don\'t. What they can do is build a community capable of surviving when someone betrays it.', image:'assets/comics/arc31/ch06-the-people-who-live-here.png', xp:290, action:'🏘️ Hear the People Who Live Here'},
    {id:7, title:'The Alarm', focus:"Joy runs Fair Tide's first coordinated emergency drill. It's a disaster — people go to the wrong assembly points, cargo blocks an evacuation route, a merchant refuses to abandon his stall, and Soel turns up somewhere he absolutely wasn't assigned. Nothing is actually wrong, which is the only fortunate part.", image:'assets/comics/arc31/ch07-the-alarm.png', xp:280, action:'🚨 Run the Alarm'},
    {id:8, title:'Again', focus:"Joy runs the drill again — Joel coordinates harbor crews, Caelan tests infrastructure responses, and San deliberately participates rather than commanding everything herself. It works considerably better. Fair Tide needs systems that function even when the Captain is somewhere else.", image:'assets/comics/arc31/ch08-again.png', xp:290, action:'📋 Run It Again'},
    {id:9, title:'Soel Knows First', focus:"Soel starts reacting to something near Fair Tide's boundary. Everyone assumes he's simply being Soel, until Mimi notices the behavior is consistent and Erynn confirms unusual spiritual movement. The threat isn't necessarily an army. Something is probing the settlement.", image:'assets/comics/arc31/ch09-soel-knows-first.png', xp:290, action:'🐈 Trust Soel First'},
    {id:10, title:'Watching the Watchers', focus:"Senedra investigates and finds signs that people outside Fair Tide are observing its new defenses — the betrayal exposed weaknesses, and now someone wants to know whether they still exist. There's no confirmation this connects to N's mysterious handler. San refuses to assume that it does.", image:'assets/comics/arc31/ch10-watching-the-watchers.png', xp:290, action:'👁️ Watch the Watchers'},
    {id:11, title:'Not Everyone Is a Spy', focus:'Security detains a suspicious-looking visitor; the investigation reveals an innocent explanation. Some push to exclude unknown outsiders entirely. San refuses: "We protect Fair Tide so people can live here. We don\'t stop living here so it\'s easier to protect." The arc\'s central leadership principle, stated plainly.', image:'assets/comics/arc31/ch11-not-everyone-is-a-spy.png', xp:300, action:'⚖️ Remember Not Everyone\'s a Spy'},
    {id:12, title:"Caelan's Fair Tide", focus:"Caelan completes the first phase of his defensive infrastructure — emergency paths, protected storage, better harbor barriers, fallback water and supply systems, defensible workshop areas, safer evacuation routes. His specialization is officially recognized: Fair Tide Infrastructure / Settlement Engineering.", image:'assets/comics/arc31/ch12-caelans-fair-tide.png', xp:310, action:"🔧 See Caelan's Fair Tide"},
    {id:13, title:'Ships at the Edge', focus:"Unknown vessels appear beyond Fair Tide's normal harbor approach. They don't attack — they watch. Brada's defenses track them, Joy prepares the Wardens, Joel positions Fair Tide's ships defensively without closing the harbor entirely, and San waits. Nothing happens. The ships eventually leave. The restraint is what matters.", image:'assets/comics/arc31/ch13-ships-at-the-edge.png', xp:300, action:'🌊 Watch Ships at the Edge'},
    {id:14, title:'Life Continues', focus:"Fair Tide deliberately holds its ordinary market. Children play, workers repair ships, people eat together, trade continues under the new security procedures. A quieter chapter, on purpose — this is what they're protecting. Not buildings. This.", image:'assets/comics/arc31/ch14-life-continues.png', xp:290, action:'🧺 Let Life Continue'},
    {id:15, title:"First Mate's Watch", focus:'San is occupied with Horizon negotiations when another security concern surfaces. Joel handles it without needing her approval for every decision, coordinating Joy, Brada, Senedra, and the harbor crews. By the time San arrives, it\'s already contained. She doesn\'t correct him — she asks: "What do you need?" Their leadership partnership has matured.', image:'assets/comics/arc31/ch15-first-mates-watch.png', xp:300, action:"🧭 Stand First Mate's Watch"},
    {id:16, title:'Warning Shot', focus:"A vessel deliberately crosses a restricted harbor boundary despite repeated warnings. Brada gets authorization. The ballista fires — not at the vessel, but precisely where it needs to land to prove a point: Fair Tide can hit you. The vessel turns. No battle required. Brada is extremely pleased with himself.", image:'assets/comics/arc31/ch16-warning-shot.png', xp:310, action:'🎯 Fire the Warning Shot'},
    {id:17, title:'Someone Tests the Horizon', focus:"An unauthorized attempt is made to interact with one of Fair Tide's newly secured Horizon routes. Renn and Erynn detect it; the route locks automatically. Arc XXX's security upgrades work — for the first time, the crew sees their new systems aren't merely bureaucracy. They prevented a real breach.", image:'assets/comics/arc31/ch17-someone-tests-the-horizon.png', xp:310, action:'🌑 Catch Someone Testing the Horizon'},
    {id:18, title:'The Real Attack', focus:"The actual attack finally comes — not an invasion, but a small coordinated group attempting sabotage during a busy period, aiming to damage infrastructure, disrupt the harbor, and test whether Fair Tide's defenses can be overwhelmed all at once. They underestimate how much has changed.", image:'assets/comics/arc31/ch18-the-real-attack.png', xp:320, action:'🔥 Face the Real Attack'},
    {id:19, title:'Warden of Fair Tide', focus:"Joy takes command of civilian protection. She doesn't chase attackers — she protects people. Residents move through Caelan's emergency routes, workers already know where to go, children and vulnerable residents are moved first. The drills suddenly make sense. This is Joy's chapter.", image:'assets/comics/arc31/ch19-warden-of-fair-tide.png', xp:330, action:'🛡️ Stand as Warden of Fair Tide'},
    {id:20, title:'First Mate of Fair Tide', focus:"Joel coordinates the active defense — Brada controls the harbor approaches, Senedra tracks movement, Zaki and other fighters intercept threats inside the settlement, Renn and Erynn secure the Horizon systems, Aisyah protects trade records and civilian logistics. Joel keeps every moving piece connected while San handles the wider situation. This is where First Mate becomes mechanically and narratively indispensable.", image:'assets/comics/arc31/ch20-first-mate-of-fair-tide.png', xp:330, action:'⚓ Stand as First Mate of Fair Tide'},
    {id:21, title:'Captain', focus:"San has the authority to seal Fair Tide completely. She doesn't. She trusts the systems and people they've built, making only the decisions the Captain needs to make and letting everyone else do their jobs. The sabotage fails. Fair Tide doesn't survive because San personally defeats everyone — it survives because Fair Tide works.", image:'assets/comics/arc31/ch21-captain.png', xp:400, action:'👑 Be the Captain'},
    {id:22, title:'Still Standing', focus:"Morning comes. There's damage. Caelan is already complaining about repairs. Brada wants another ballista; Joy tells him no; Mimi thinks two more might be reasonable; Joy regrets involving Mimi. People begin rebuilding. Nobody is leaving.", image:'assets/comics/arc31/ch22-still-standing.png', xp:310, action:'🌅 Stay Still Standing'},
    {id:23, title:'Open Gates', focus:"Fair Tide reviews its new security rules. San rejects proposals that would effectively close the settlement to outsiders — visitors remain welcome, temporary residents remain possible, trade and Horizon relationships continue. But access is structured, information is compartmentalized, Wardens and defenses exist. Hospitality and caution are no longer treated as opposites.", image:'assets/comics/arc31/ch23-open-gates.png', xp:310, action:'🤝 Open the Gates'},
    {id:24, title:'What We Protect', focus:'San and Joel walk through the ordinary settlement — someone cooking, workers arguing over repairs, children running past, Soel bothering someone, Joy and Caelan discussing another project, Brada lobbying for another ballista. San: "Worth it?" Joel looks around. "Yeah." She takes his hand. Fair Tide is safe not because nobody can hurt it, but because when something does happen, its people protect one another.', image:'assets/comics/arc31/ch24-what-we-protect.png', xp:380, action:'🏡 Name What We Protect'}
  ];
  window.ARC31_CHAPTERS = ARC31_CHAPTERS;

  const ARC31_CHAPTER_SCENES = {
    1: "The port itself came through the crisis intact — docks standing, ships afloat, the Horizon Engine slowly stabilizing route by route. By any purely physical measure, Fair Tide survived.<br><br>Nobody's celebrating that this morning.<br><br>Routes stay restricted longer than anyone would like. Security procedures that didn't exist a week ago are already becoming routine. And underneath all of it, in quiet conversations San isn't meant to overhear, people are still turning N's name over, still working out what her betrayal actually means for how they look at each other now.<br><br>That's the damage San actually has to answer for — not the routes, not the repairs, but the question sitting under everything else: who else shouldn't we trust?<br><br>She doesn't have a clean answer for it. What she refuses, flatly, is to let that question become the thing Fair Tide is built on from here forward.",
    2: "Joel doesn't wait to be asked. While San untangles the larger consequences — the diplomacy, the Horizon negotiations, the weight of what N's betrayal actually cost — he simply starts running the parts of Fair Tide that can't wait for her attention to be free.<br><br>Ship movements get sorted. Crew assignments get settled. Harbor readiness, supply priorities, watch rotations — all of it moves through him, steadily, without drama, the way it's quietly moved through him for a long time whenever anyone actually paid attention.<br><br>Fair Tide notices, this time, in a way it hasn't quite had reason to before. First Mate was always the title next to Captain. Watching Joel actually run half the settlement while San's attention is elsewhere, people start understanding it as considerably more than that.",
    3: "Joy goes through Fair Tide's actual security with the same thoroughness she gives everything, and what she finds isn't an absence of defenses — it's an accumulation of them, built up piecemeal over arcs without ever being asked to work together.<br><br>Harbor patrols that don't talk to storehouse watches. Horizon security that operates independently of residential protection. Expedition readiness that nobody's connected to any of the rest of it.<br><br>\"None of this is bad,\" she tells San, laying the pieces out. \"It's just scattered. I want to bring it under one actual system instead of a dozen separate habits.\"<br><br>It isn't framed as protecting San specifically — it never really was. Joy's job, as she puts it plainly, was always protecting Fair Tide's people. This just makes that job something she can actually see the whole shape of.",
    4: "Caelan walks the settlement the way he walks everything he's about to fix — slowly, methodically, more interested in what's actually wrong than in how it looks from a distance.<br><br>What he finds isn't reassuring. Blind corners nobody accounted for. Docks positioned more for convenience than safety. Storage buildings sitting exactly where they'd be most vulnerable if something ever went wrong. Routes through the settlement that would turn genuinely dangerous the moment an emergency actually happened.<br><br>His answer isn't taller walls or a more intimidating gate. It's slower and less dramatic than that — redesigning the actual bones of the place so Fair Tide can defend itself without stopping being a port people can still live in and move through freely.",
    5: "Brada's spent longer than he'd like to admit feeling like Fair Tide's ballista work was a hobby nobody quite had room for. That changes considerably once Joy and Caelan start looking seriously at harbor defense.<br><br>He identifies positions — real ones, chosen for range and coverage rather than spectacle — that could cover the ships and docks from anything approaching at range, without turning Fair Tide's harbor into something that looks like it's expecting a war.<br><br>Mimi watches him work through the plans with an expression that suggests she's having entirely too much fun watching a grown man get official permission to build enormous equipment.<br><br>\"Don't encourage him,\" Joy says, not looking up.<br><br>\"Too late,\" Mimi says, delighted.",
    6: 'The gathering San calls isn\'t meant to be comfortable, and it isn\'t. Some residents want the gates tightened considerably — fewer strangers, harder questions, less benefit of the doubt. Others worry, just as loudly, that Fair Tide is quietly turning into somewhere they no longer recognize.<br><br>Someone finally asks the question everyone else has been circling. "How do we know the next N isn\'t already here?"<br><br>San doesn\'t soften the answer. "We don\'t," she says. "We can\'t promise that. Anyone who tells you they can is lying to make you feel better, not keeping you safer."<br><br>What she offers instead is smaller and, she thinks, more honest: not a guarantee that nobody will ever betray them again, but a community actually capable of surviving it when someone does.',
    7: "The drill is, by any reasonable measure, a complete mess.<br><br>Half of Fair Tide ends up at the wrong assembly point entirely. Someone's left an entire afternoon's cargo sitting directly across the one evacuation route that was supposed to stay clear. A market stall owner flatly refuses to abandon his goods for what he's fairly sure is a pretend emergency. And somewhere in the middle of all of it, Soel turns up in a location nobody assigned him to, doing something nobody can quite explain.<br><br>Nothing about it is actually dangerous, which is the only reason San can watch the entire disaster unfold and laugh instead of panic.<br><br>\"Well,\" Joy says, surveying the wreckage of her own carefully planned drill, \"at least we know exactly what doesn't work now.\"",
    8: "The second attempt looks almost nothing like the first.<br><br>Joel takes the harbor crews and actually coordinates them this time, instead of everyone improvising on the spot. Caelan runs his own infrastructure through its paces, checking whether the new emergency paths actually hold up under real movement. San deliberately steps back from commanding the whole thing herself, taking a role inside the drill instead of standing over it.<br><br>It works considerably better — not perfectly, but recognizably like something Fair Tide could actually rely on if a real emergency ever demanded it.<br><br>\"This is the point,\" San tells Joy afterward. \"Not that I run this well. That it runs at all, whether or not I'm the one running it.\"",
    9: "Soel starts acting strangely near the edge of Fair Tide's own boundary, restless in a way nobody can immediately place.<br><br>The first instinct is to shrug it off — he's always been a little strange, ever since San first found him. But Mimi watches him longer than anyone else bothers to, and notices the behavior isn't random. It's consistent, repeating, aimed at something specific rather than simply mood.<br><br>Erynn confirms it from her own angle shortly after: something is genuinely moving, spiritually, near the settlement's edge, in a way that doesn't match anything ordinary.<br><br>Nobody assumes an army. What it looks like, more precisely, is something quieter — Fair Tide being probed, carefully, by whoever or whatever is out there.",
    10: "Senedra takes the investigation herself, moving carefully along the edges Soel reacted to, looking for whatever's actually causing the disturbance.<br><br>What she finds is people — watching, from just outside Fair Tide's usual boundary, studying the new defenses with the patient attention of someone actually trying to learn something useful.<br><br>The betrayal left real gaps behind it, and now somebody wants to know whether those gaps have actually closed.<br><br>Nobody can confirm this traces back to N's own mysterious handler, and San refuses to let anyone simply assume it does. \"We don't know who this is,\" she says plainly. \"I'm not going to build our next mistake on a guess just because it would be a tidier story.\"",
    11: 'The visitor security detains looks wrong in exactly the ways that get someone noticed lately — unfamiliar, asking slightly too many questions, moving through Fair Tide like he\'s paying closer attention than an ordinary guest usually would.<br><br>The full investigation turns up nothing sinister at all. Just an ordinary traveler with ordinary curiosity and unfortunate timing.<br><br>It matters more than the incident itself would suggest. Several voices start pushing harder for keeping unknown outsiders out entirely, using the scare as proof Fair Tide can\'t afford the risk.<br><br>San shuts it down plainly. "We protect Fair Tide so people can live here," she says. "We don\'t stop living here just to make protecting it easier." It\'s not a new sentiment for her. It\'s just, finally, the sentence that actually holds the whole arc together.',
    12: "Caelan's first real phase of work finally comes together as one coherent whole rather than a dozen separate projects — proper emergency paths that actually lead somewhere useful, storage that's genuinely protected instead of just conveniently placed, harbor barriers built for real weather and real threats, backup water and supply systems that don't depend on everything else going right first, workshop areas that can defend themselves, evacuation routes that actually account for who's slowest to move.<br><br>San walks the finished work with him, properly impressed by how much of it is invisible unless you already know to look.<br><br>\"This deserves an actual title,\" she tells him. \"Not just 'the guy who fixes things.'\"<br><br>Caelan considers that. \"Fair Tide Infrastructure,\" he says slowly. \"Settlement Engineering.\"<br><br>It sticks immediately, because it's simply true.",
    13: "The ships appear at the edge of what anyone would call Fair Tide's normal approach, close enough to notice, far enough to claim they're doing nothing wrong.<br><br>They don't attack. They don't even approach further. They just sit there, watching, in a way that reads as deliberate rather than accidental.<br><br>Brada's positions track them the whole time. Joy quietly readies the Wardens without making a visible show of it. Joel moves Fair Tide's own ships into a defensive posture without closing the harbor to anyone else.<br><br>San waits, refusing to escalate first.<br><br>Eventually, without a single shot fired or word exchanged, the ships simply leave. Nothing happened. San suspects that's rather the point — someone testing what Fair Tide would do, and getting an answer: nothing rash.",
    14: "Fair Tide holds its ordinary market anyway, deliberately, the same week unknown ships sat watching from the harbor's edge.<br><br>Children chase each other between stalls the way they always have. Workers argue cheerfully over the right way to patch a hull. People eat together at the Commons, unbothered, trade moving under Fair Tide's newer, quieter security procedures without anyone making a visible fuss about it.<br><br>Nothing about the chapter is dramatic, and that's entirely intentional. This is the thing all the new defenses actually exist to protect — not the walls, not the ballista positions, not the Warden system. This. Ordinary people, having an ordinary day, because Fair Tide made sure they still could.",
    15: 'San is deep in Horizon negotiations, fully occupied, when a fresh security concern surfaces that would ordinarily land straight on her desk.<br><br>It doesn\'t. Joel handles it himself — coordinating Joy, Brada, Senedra, and the harbor crews without once needing San\'s sign-off for a single decision along the way.<br><br>By the time she\'s free to actually look at it, it\'s already resolved, cleanly, without her ever having to weigh in.<br><br>She doesn\'t second-guess a single choice he made. She just asks, plainly, "What do you need?" — not a question about what he did wrong, just what comes next. It\'s a small exchange. It also says everything about how far their partnership has actually come.',
    16: "The vessel crosses the restricted boundary once, gets warned, and crosses it again anyway — deliberately, testing exactly how serious Fair Tide's new rules actually are.<br><br>Brada gets his authorization within minutes.<br><br>The shot that follows doesn't touch the ship at all. It lands precisely, unmistakably, exactly where it needs to for the message to land instead: Fair Tide can hit you, any time it chooses to.<br><br>The vessel turns without another word exchanged. No battle. No damage beyond a very large, very deliberate splash.<br><br>Brada spends the rest of the day in a state of barely contained self-satisfaction that nobody has the heart to fully deflate.",
    17: "The attempt is quiet, almost invisible — someone trying to interact with one of the routes Fair Tide locked down since Arc XXX's own breach, probing at it the way you'd test a door to see if it's really locked.<br><br>Renn and Erynn catch it almost immediately. The route responds exactly the way it was built to — locking down automatically, no manual intervention required, no scramble to react after the fact.<br><br>It's a small moment, in the scheme of everything else happening around Fair Tide lately. It matters more than it looks. For the first time since all the new security work began, the crew watches their own systems actually stop something in real time, rather than simply existing as paperwork nobody's tested yet.",
    18: "When the real attack finally comes, it doesn't look anything like the ships at the harbor's edge or the quiet probing at Fair Tide's boundary.<br><br>It's smaller, faster, and considerably more deliberate — a coordinated group moving during one of Fair Tide's busiest stretches, aiming for exactly the kind of practical damage that would actually hurt: infrastructure, the harbor itself, anything that would prove Fair Tide's new defenses buckle when everything happens at once instead of one thing at a time.<br><br>What they don't account for is how much has actually changed since the last time anyone tried something like this. Fair Tide isn't the settlement it was even a few arcs ago, and they're about to find that out in real time.",
    19: "Joy doesn't waste a single moment chasing after the people causing the trouble. That was never actually her job, and she's stopped pretending otherwise.<br><br>She protects people instead — directing residents through exactly the emergency routes Caelan spent so long building, because by now everyone already half-knows where those routes lead. Workers move without needing to be told twice. Children and the settlement's most vulnerable get moved first, without argument, without confusion.<br><br>Every clumsy, half-failed drill from earlier in the arc suddenly makes complete sense, watching it actually work under real pressure.<br><br>This is entirely Joy's chapter, and everyone watching knows it, including her.",
    20: "Joel holds the entire active defense together at once, and it's considerably more than any single person's job ought to be.<br><br>Brada commands the harbor approaches. Senedra tracks every movement worth tracking. Zaki and the other fighters intercept whatever actually makes it inside the settlement's own boundary. Renn and Erynn keep the Horizon systems locked down and secure. Aisyah protects the trade records, the supplies, the ordinary civilian logistics nobody thinks about until they're at risk.<br><br>Joel keeps every one of those moving pieces connected to every other one, while San handles the larger picture unfolding around all of it.<br><br>This is the moment First Mate stops being a title beside Captain and becomes something the entire settlement would genuinely struggle to function without.",
    21: "San could seal Fair Tide completely, right now, with a single order. Nobody would question it, given what's actually happening.<br><br>She doesn't.<br><br>Instead she trusts the systems and the people Fair Tide has spent this entire arc building — makes only the decisions that genuinely require a Captain's judgment, and lets everyone else do the jobs they've already proven they can do without her standing over them.<br><br>The sabotage fails. Not because San personally overwhelms everyone responsible for it, sword in hand, in some singular decisive moment — but because Fair Tide itself, as a whole functioning thing, simply works the way it was built to.<br><br>That distinction matters enormously to her, watching it play out exactly as intended.",
    22: "Morning arrives with damage that's real but survivable — scorched infrastructure, a few structures that will need proper rebuilding, nothing that threatens the settlement's own foundations.<br><br>Caelan is already complaining, loudly and at length, about everything that now needs fixing. Brada, riding the high of his own harbor defense actually working, wants funding for a second ballista. Joy tells him no, immediately and without much debate.<br><br>\"Two more might actually be reasonable,\" Mimi offers, entirely unhelpfully.<br><br>Joy gives her a long look. \"I regret involving you in any of this,\" she says, with real feeling.<br><br>Around all of them, people are already rebuilding, unhurried and entirely unbothered by the idea of doing anything else. Nobody's leaving. Nobody was ever going to.",
    23: "The review of Fair Tide's own new rules gets heated more than once, but San holds the same line she's held since Ch.11 and doesn't let the crisis talk her out of it now that it's actually over.<br><br>Proposals that would effectively wall Fair Tide off from outsiders get rejected outright. Visitors stay welcome. Temporary residents stay possible. Trade keeps moving, Horizon relationships keep developing, exactly as they did before any of this happened.<br><br>What's actually different is structure, not exclusion. Access gets organized instead of thrown open blindly. Information stays compartmentalized rather than freely available to anyone who asks nicely. The Wardens exist now, properly, and so does real defense.<br><br>Hospitality and caution, San realizes, watching the new rules finally take their actual shape, were never supposed to be opposites in the first place.",
    24: 'San and Joel walk through Fair Tide at the end of it all — not the command center, not the Horizon workshop, just the ordinary settlement doing ordinary things.<br><br>Someone\'s cooking something that smells better than it probably should. Two workers are locked in an increasingly theatrical argument over the correct way to patch a hull. Children run past, entirely unbothered by anything that happened recently. Soel is bothering someone, as always. Joy and Caelan stand off to one side, already deep in the next project neither of them can quite leave alone. Brada, predictably, is somewhere nearby making his case for a second ballista to anyone who\'ll listen.<br><br>"Worth it?" San asks, watching all of it at once.<br><br>Joel looks around, slow and unhurried, taking in the whole ordinary, noisy, thriving mess of it.<br><br>"Yeah," he says.<br><br>San takes his hand.<br><br>Fair Tide isn\'t safe because nothing can ever hurt it again. It\'s safe because when something does, its people show up for each other. That was always going to be the actual answer.'
  };
  window.ARC31_CHAPTER_SCENES = ARC31_CHAPTER_SCENES;

  window.arc31ObjectiveState = function(){
    if (!game.arc30Complete) return null;
    if (level() < 465) return null;
    game.comicProgress31 = game.comicProgress31 || {};
    for (const ch of ARC31_CHAPTERS) {
      if (!game.comicProgress31[ch.id]) return 'complete_arc31_chapter_' + ch.id;
    }
    return 'arc31_part1_complete_for_now';
  };

  window.markArc31ChapterRead = function(id){
    const so = window.arc31ObjectiveState();
    if (so !== ('complete_arc31_chapter_' + id)) return;
    game.comicProgress31 = game.comicProgress31 || {};
    game.comicProgress31[id] = true;
    // Matches every prior arc's own completion flag (arc29/arc30Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 24) game.arc31Complete = true;
    const ch = ARC31_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC31_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC31_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc31Splash = function(){
    const overlay = document.getElementById('arc31SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc31Splash = function(){
    const overlay = document.getElementById('arc31SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc31SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc31 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc31) oldRenderStoryForArc31();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc31Ready = window.arc31ObjectiveState() !== null;
    if (arc31Ready && !game.arc31SplashSeen && typeof window.__ctShowArc31Splash === 'function') {
      window.__ctShowArc31Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc31/arc31-cover-what-we-protect.png" alt="Arc XXXI — What We Protect" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXXI</div><div class="story-act-title">What We Protect</div>'+
      '<div class="story-act-tagline">A home is worth defending.</div></div>';
    if (!arc31Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXXI Locked</div><div class="story-chapter-sub">'+
        (!game.arc30Complete ? 'Finish Arc XXX first.' : 'Reach Level 465 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc31ObjectiveState();
    ARC31_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress31 && game.comicProgress31[ch.id]);
      const ready = !done && so===('complete_arc31_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc31ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc31_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXXI chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
