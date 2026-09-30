(function(){
  // -------------------------------------------------------------------
  // ARC XXXV — THE CHILDREN OF FAIR TIDE. Gated at arc34Complete +
  // level 525, continuing the established +15-per-arc ladder
  // (XXXII:480, XXXIII:495, XXXIV:510, XXXV:525). Ch.24 sets
  // game.arc35Complete = true, matching every other arc's own finale
  // flag.
  //
  // Per the outline this arc was built from: the twins are FINALLY born
  // — Vaeren (Ch.9) and Joelle (Ch.10). Per the outline's own explicit
  // restraint, the birth stays focused on San rather than becoming a
  // medical procedure — no human labor timeline is imposed, matching
  // Arc XXXIV's own restraint against sonograms and due dates. San and
  // Joel discover, repeatedly (Ch.14, 15, 17, 18), that having been
  // parents before doesn't mean either of them knows how to raise
  // Veyren babies — ordinary parenting knowledge keeps failing against
  // Veyren biology, and Soel keeps quietly being right about all of it
  // first. Ch.11/12's naming comedy lands on Vaeren (rooted in Veyren,
  // the world he was born into) and Joelle (a name San loved a decade
  // before she ever met Joel, not "after" him) — one name from each of
  // the twins' two histories. Ch.19's First Sparks and Ch.20's sleep-
  // linked development explicitly foreshadow future growth without
  // defining a complete power set or locking in a growth rate. Ch.23
  // ("Meet Fair Tide") explicitly refuses to frame the twins as heirs —
  // Fair Tide isn't a dynasty, per the outline's own plain statement.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. The Children of Fair Tide passive Family Life
  // system (developmental states, Soel Watch) Ch.9-10, 13, and 19-20's
  // own notes call for lives in scripts/arc35-mechanics.js, same split
  // used since Arc XXIII.
  //
  // XP escalates toward Ch.9 ("Vaeren") as the centerpiece at 400 — the
  // actual moment of birth, the payoff of everything Arcs XXXII-XXXIV
  // built toward. Ch.10 ("Joelle") stays high (375) without exceeding
  // the centerpiece, since the outline treats both births as one
  // continuous event rather than two separate peaks. Ch.24's finale
  // keeps the "one centerpiece, not two" convention at 380 — the
  // second-highest XP in the arc — and shares the arc's own closing
  // theme ("A New Generation") rather than its literal title, the same
  // way several earlier arcs' own finales have.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC35_CHAPTERS = [
    {id:1, title:'Something Changed', focus:'San wakes knowing something about the twins feels different — their familiar rhythms have shifted, and Soel refuses to leave her side. Renn, Erynn and Mimi confirm something is changing, but nobody can provide a human-style timetable. "Today?" Joel asks. "I don\'t know," San says. Soel apparently does.', image:'assets/comics/arc35/ch01-something-changed.png', xp:260, action:'🌅 Notice Something Changed'},
    {id:2, title:'Trust the Cat', focus:'The researchers continue observing San. Soel continues observing the researchers. Eventually San decides Soel has had the better track record throughout this pregnancy. "I\'m trusting the cat," she says. Nobody has a convincing argument against this.', image:'assets/comics/arc35/ch02-trust-the-cat.png', xp:265, action:'🐈 Trust the Cat'},
    {id:3, title:'Fair Tide Can Manage', focus:"San finally steps away from active Captain duties. Joel prepares to do the same. Fair Tide doesn't collapse — Aisyah, Joy, Caelan and the established leadership structure handle ordinary operations. For San, this is another realization about leadership: trusting other people is part of leading them.", image:'assets/comics/arc35/ch03-fair-tide-can-manage.png', xp:270, action:'⚓ Trust Fair Tide Can Manage'},
    {id:4, title:"I've Done This Before", focus:"San admits to Ate Joy that she's frightened. She's given birth before, but her previous experiences belong to a completely different, harder period of her life. Joy doesn't dismiss the fear just because San has done this before. This time, San has something she didn't have then: a partner doing it with her.", image:'assets/comics/arc35/ch04-ive-done-this-before.png', xp:280, action:"🌸 Admit I've Done This Before"},
    {id:5, title:'Neither Have I', focus:'Joel has been a father before too, but he has never waited beside a partner, prepared a shared home, and expected to raise children together from the beginning. Neither of them can honestly say they\'ve done this — not like this. "Team?" San asks. "Team," Joel says.', image:'assets/comics/arc35/ch05-neither-have-i.png', xp:280, action:'❤️ Say Neither Have I'},
    {id:6, title:'Two Different Rhythms', focus:"The children become increasingly active in distinctly different ways. Soel responds separately to each. Renn and Erynn finally understand: Soel hasn't merely sensed San's pregnancy. He's known both children individually for some time.", image:'assets/comics/arc35/ch06-two-different-rhythms.png', xp:290, action:'🌊 Feel Two Different Rhythms'},
    {id:7, title:"Veyren's Way", focus:"The birth begins. It doesn't perfectly resemble human labor, because San's pregnancy has never followed entirely human rules. There is pain, exhaustion and uncertainty, but the chapter stays focused on San rather than turning the event into a medical procedure. Joel remains beside her. Ate Joy helps. Soel refuses to go anywhere.", image:'assets/comics/arc35/ch07-veyrens-way.png', xp:320, action:"🌌 Begin Veyren's Way"},
    {id:8, title:'The Long Night', focus:'Time stretches. San is exhausted. Joel helps however he can. At some point: "Two was unnecessary." Joel looks at her, then wisely decides this is not a situation requiring a response.', image:'assets/comics/arc35/ch08-the-long-night.png', xp:330, action:'🌙 Endure the Long Night'},
    {id:9, title:'Vaeren', focus:"The first child arrives. A boy. For a while he doesn't have a name — he's simply their son. Joel holds him. San sees him. Everything Fair Tide has theorized about Veyren biology suddenly becomes secondary to the fact that he's here. Soel approaches. He already knows him.", image:'assets/comics/arc35/ch09-vaeren.png', xp:400, action:'👦 Welcome Vaeren'},
    {id:10, title:'Joelle', focus:"His sister follows. Her spiritual presence is immediately distinct from her brother's. A daughter. Now there are two. Ate Joy meets her niece and nephew. Soel remains remarkably unsurprised by events everyone else considers extraordinary.", image:'assets/comics/arc35/ch10-joelle.png', xp:375, action:'👧 Welcome Joelle'},
    {id:11, title:'What Do We Call Them?', focus:'San and Joel encounter an unexpectedly difficult problem: names. Joel suggests the obvious family tradition — Joel III. San vetoes it. "What are we calling him? Joel Super Junior?" Ate Joy loses it. San is not founding the Joel dynasty of Fair Tide.', image:'assets/comics/arc35/ch11-what-do-we-call-them.png', xp:290, action:'🌸 Ask What Do We Call Them'},
    {id:12, title:'Joey, Joel, Joelle...and Soel', focus:'San finally mentions a name she\'s loved since long before meeting Joel: Joelle — not after him, but from an alias she used studying abroad a decade earlier. Then somebody notices: Joey, Joel, Joelle, and Soel (San and Joel\'s combined names, given to their cat). This family has a problem. The girl becomes Joelle anyway. Their son takes a name rooted in the world where he was born: Vaeren.', image:'assets/comics/arc35/ch12-joey-joel-joelle-and-soel.png', xp:300, action:'🐈 Name Joey, Joel, Joelle...and Soel'},
    {id:13, title:'He Knew First', focus:'The newborns become unsettled. Soel settles beside them, and their spiritual activity calms. "They know him," Joel says. San remembers Soel following her throughout the pregnancy. "You knew Vaeren and Joelle before we did." Soel closes his eyes. Ultimate victory achieved.', image:'assets/comics/arc35/ch13-he-knew-first.png', xp:290, action:'🐈 Confirm He Knew First'},
    {id:14, title:'Still Sleeping', focus:'Vaeren and Joelle sleep, and sleep, and keep sleeping. San worries. Joel worries. Ate Joy confirms this would be unusual for human newborns too. Then they notice Soel sleeping peacefully beside them. Eventually they discover: long sleep cycles are normal for these Veyren babies.', image:'assets/comics/arc35/ch14-still-sleeping.png', xp:280, action:'😴 Watch Them Still Sleeping'},
    {id:15, title:"They Don't Drink Milk", focus:'The next human assumption fails. Neither twin wants milk — San\'s doesn\'t work, animal milk doesn\'t work, Joy\'s previous parenting knowledge doesn\'t help. "Ate?" "Don\'t look at me. Yours are different." Their nutritional biology is fundamentally Veyren.', image:'assets/comics/arc35/ch15-they-dont-drink-milk.png', xp:285, action:"🍼 Discover They Don't Drink Milk"},
    {id:16, title:'Follow the Cat', focus:'Soel repeatedly reacts to a particular Veyren nourishment source. Eventually the humans realize he\'s trying to show them something. Renn and Erynn investigate — it provides exactly the nutritional profile the twins need. "You could have told us." "He\'s a cat." "He keeps knowing things!" Soel declines comment.', image:'assets/comics/arc35/ch16-follow-the-cat.png', xp:290, action:'🐈 Follow the Cat'},
    {id:17, title:"We've Both Had Children", focus:'Another unfamiliar childcare problem appears. Joel, San, and Ate Joy — three experienced parents between them — each look to the others for an answer. "Mine didn\'t do that," Joy says. Zero useful answers. The lesson: they know children. They don\'t know Veyren children.', image:'assets/comics/arc35/ch17-weve-both-had-children.png', xp:285, action:"⚓ Admit We've Both Had Children"},
    {id:18, title:'Two Children', focus:"Vaeren and Joelle's individuality becomes obvious. Their sleep patterns aren't identical. They respond differently to sounds, people and magic. Soel interacts differently with each. Their spiritual signatures behave differently. They're always going to be twins. They're never going to be interchangeable.", image:'assets/comics/arc35/ch18-two-children.png', xp:290, action:'👶 Recognize Two Children'},
    {id:19, title:'First Sparks', focus:'One twin produces a tiny magical effect. Later, the other produces something distinctly different. Nothing dangerous, nothing that establishes a complete future power set — just enough to confirm Vaeren and Joelle are developing their own abilities. Renn gets extremely interested. "Writing it down." Smart man.', image:'assets/comics/arc35/ch19-first-sparks.png', xp:310, action:'✨ Watch First Sparks'},
    {id:20, title:'Growing While They Sleep', focus:"Fair Tide begins understanding the twins' strange developmental cycle — long sleep periods correspond with unusually intense physical, neurological and magical development. They aren't human children growing on fast-forward. Their development happens according to Veyren rhythms, laying the foundation for them eventually appearing older than their chronological age.", image:'assets/comics/arc35/ch20-growing-while-they-sleep.png', xp:300, action:'🌙 Watch Them Growing While They Sleep'},
    {id:21, title:'Ate Joy', focus:"Joy spends time with her niece and nephew. She's already raised children who are now grown — this isn't motherhood recreated through somebody else's babies. It's something different: she's Ate Joy to a new generation. Her experience helps when ordinary parenting applies. When it doesn't, she learns alongside San and Joel.", image:'assets/comics/arc35/ch21-ate-joy.png', xp:295, action:'🌸 Become Ate Joy'},
    {id:22, title:'Our Turn', focus:"Family helps constantly — Aisyah, Mez, Joy, Mimi, others throughout Fair Tide. But San and Joel are the everyday parents. Joel doesn't classify caregiving as women's work; San isn't expected to carry everything because she's the mother. \"Our turn?\" Joel asks. \"Our turn,\" San says. They're learning hands-on parenthood together.", image:'assets/comics/arc35/ch22-our-turn.png', xp:300, action:'⚓ Take Our Turn'},
    {id:23, title:'Meet Fair Tide', focus:"Vaeren and Joelle gradually meet their enormous family — Aisyah and Mez, Senedra, Zaki and Eliz, Ate Joy, Mimi, Caelan, Brada, Renn and Erynn watching from a safe distance, Soel supervising everything. Nobody presents them as heirs to Fair Tide. Fair Tide isn't a dynasty. They're simply two children born into this community.", image:'assets/comics/arc35/ch23-meet-fair-tide.png', xp:310, action:'🏘️ Meet Fair Tide'},
    {id:24, title:'A New Generation', focus:'Night settles over Fair Tide. Vaeren and Joelle sleep, Soel nearby. "You really knew first." "He did." "Fine. You win." Soel purrs. A faint magical response follows from each twin. San and Joel don\'t know what their children will become, how quickly they\'ll grow, or what their powers will be. But they know how they\'re going to do it. Together. "Team." "Always."', image:'assets/comics/arc35/ch24-a-new-generation.png', xp:380, action:'🌅 Begin A New Generation'}
  ];
  window.ARC35_CHAPTERS = ARC35_CHAPTERS;

  const ARC35_CHAPTER_SCENES = {
    1: 'San wakes with a feeling she can\'t immediately explain — nothing painful, nothing alarming exactly, just a clear sense that something about the twins has shifted since yesterday. Their familiar rhythms, the ones she\'s spent Arc XXXIV learning to recognize, feel different somehow, in a way she can\'t quite put into words.<br><br>Soel refuses to leave her side, more insistent about it than usual.<br><br>Renn, Erynn and Mimi all confirm, separately, that something is genuinely changing. None of them can give her anything resembling a human-style timetable to work from.<br><br>"Today?" Joel asks, watching her carefully.<br><br>"I don\'t know," San says, honestly.<br><br>Soel, judging by how he\'s behaving, apparently does.',
    2: "The researchers keep observing San, carefully, thoroughly, the way they've been doing throughout most of this pregnancy. Soel, in turn, keeps observing the researchers, with the patient air of someone who already knows something they don't.<br><br>Eventually San does the math on this properly. Soel's track record, across this entire pregnancy, has been considerably better than anyone else's — better than Renn's research, better than Mimi's visions, better than Erynn's careful theories.<br><br>\"I'm trusting the cat,\" San announces, with real conviction.<br><br>Nobody in the room manages to produce a convincing counterargument. Soel, for his part, looks like he's been waiting several arcs for exactly this recognition.",
    3: "San finally steps back from her active Captain duties, formally, for the first time since any of this began. Joel prepares to do the same shortly after.<br><br>Fair Tide doesn't collapse. Aisyah, Joy, Caelan, and the whole leadership structure they've built up across so many arcs simply handle the ordinary day-to-day operations, exactly the way they've been quietly capable of doing for a while now.<br><br>It lands on San as another piece of the same lesson she's been learning in smaller ways for arcs now. Trusting other people with real responsibility isn't a failure of leadership. It's part of what leading them actually means.",
    4: "San admits something to Ate Joy she hasn't quite said out loud to anyone yet: she's frightened.<br><br>She's given birth before — that part isn't new to her. But those experiences belong to an entirely different period of her life, one where she was frightened in a very different way, dependent on other people in ways she isn't now, living under circumstances that don't resemble anything about her life here at all.<br><br>Joy doesn't wave the fear away just because San's technically done this before. She doesn't need to point out that experience should make this easier, because she understands it doesn't necessarily work that way.<br><br>What San has this time, that she didn't have then, is simpler than any reassurance Joy could offer. A partner, actually doing this with her, from the very beginning.",
    5: "Joel's been a father before too, in a life that feels increasingly distant from this one. But he's never actually experienced this specific thing — waiting beside a partner through the whole process, having already prepared a shared home together, expecting from the very start to raise these children alongside her.<br><br>So neither of them, San realizes, watching him work through the same admission she just made to Joy, can honestly claim they've done this before. Not like this. Not together, not from the beginning, not under any of these circumstances.<br><br>San reaches for his hand anyway. \"Team?\" she asks.<br><br>\"Team,\" Joel says, without a moment's hesitation.",
    6: "The twins grow more active by the day, and increasingly, unmistakably, in two distinctly different ways from each other. Soel responds to each of them separately now, clearly tracking two different things rather than one combined presence.<br><br>Renn and Erynn finally put the pieces together properly, watching him work. Soel hasn't simply been sensing San's pregnancy this whole time, as everyone originally assumed. He's known both children, individually, as separate people, for considerably longer than any of the rest of them have.",
    7: "The birth begins, and almost immediately it's clear this isn't going to unfold the way San might have expected from her own memory of childbirth on Earth. San's entire pregnancy has never followed strictly human rules, and this doesn't either.<br><br>There's real pain in it, real exhaustion, real uncertainty about what's happening and when — the chapter doesn't shy away from any of that. But it stays fixed on San herself throughout, on what she's actually experiencing, rather than turning into a clinical account of a medical procedure.<br><br>Joel stays beside her the entire time, steady in the way he's always been for her. Ate Joy helps wherever she can. Soel refuses, flatly, to go anywhere at all.",
    8: 'Time stretches out in a way that stops feeling like ordinary hours passing. San is thoroughly exhausted, past the point of most complaints.<br><br>Joel helps in whatever way he actually can, which turns out to be considerable, even without any real precedent to draw on.<br><br>At some point, somewhere in the middle of all of it, San manages to say, with complete conviction: "Two was unnecessary."<br><br>Joel looks at her.<br><br>Then, wisely, decides that this particular statement does not require a response of any kind.',
    9: "The first child arrives.<br><br>A boy.<br><br>For a while — long enough that it doesn't feel strange to either of them — he simply doesn't have a name yet. He's just their son.<br><br>Joel holds him first, careful and completely undone in a way San's never quite seen from him before. San sees him a moment later, and in that instant everything Fair Tide has spent an entire arc theorizing about Veyren biology, spiritual signatures, unprecedented development, all of it, becomes entirely secondary to one simple fact: he's here.<br><br>Soel approaches without any hesitation at all.<br><br>He already knows him.",
    10: "His sister follows shortly after, and the moment she arrives, her spiritual presence is immediately, unmistakably distinct from her brother's — nothing like his at all, entirely her own from the very first moment.<br><br>A daughter.<br><br>Now there are two.<br><br>Ate Joy meets her niece and nephew for the first time within minutes of each other, visibly overwhelmed in a way she rarely lets herself be.<br><br>Soel, through all of it, remains remarkably unsurprised by events everyone else in the room currently considers nothing short of extraordinary.",
    11: 'Once everyone\'s recovered enough to think about practical matters again, San and Joel run straight into an unexpectedly difficult problem: names.<br><br>Joel considers the obvious family tradition first. "Joel?" he offers.<br><br>San looks at him for a long moment. "You\'re already Joel Junior," she points out.<br><br>"Yeah," Joel says.<br><br>"Your father was Joel Senior."<br><br>"Yeah."<br><br>San gestures at their son. "What are we calling him? Joel Super Junior?"<br><br>Ate Joy completely loses it at that. Joel suggests Joel III, entirely undeterred. It gets vetoed immediately. San is not, under any circumstances, founding the Joel dynasty of Fair Tide.',
    12: 'San finally mentions a name she\'s genuinely loved for a very long time — long before she ever met Joel at all. Joelle.<br><br>Joel makes the obvious assumption immediately. "After me?" he asks.<br><br>"NO," San says, with considerable feeling.<br><br>She explains, patiently, that she used to go by Joey as an alias while studying abroad, roughly a decade before Joel ever entered her life. She already thought Joelle was a beautiful name back then — elegant, memorable, almost like something out of an old celebrity\'s name.<br><br>Then somebody in the room actually puts the pieces together out loud. Joey. Joel. Joelle. And then, slowly, everyone turns to look at Soel — the cat whose name San and Joel made by combining their own, back when he first chose San as his person. And Ate Joy\'s name, everyone now notices, is simply Joy.<br><br>This family, San concludes, has a genuine problem.<br><br>The girl becomes Joelle anyway, regardless of every ridiculous coincidence surrounding the name, because San loved it long before any of this nonsense existed. For their son, they choose something that belongs entirely to the world he was actually born into: Vaeren.<br><br>Vaeren and Joelle. One name rooted in Veyren itself. One carried forward from San\'s old life on Earth. Together, they belong to both histories at once.',
    13: 'The newborns grow unsettled, fussing in a way neither San nor Joel can immediately soothe. Soel settles in beside them without being asked, and almost immediately, their spiritual activity calms.<br><br>Joel watches it happen. "They know him," he says.<br><br>San thinks back over the entire pregnancy — Soel following her everywhere, reacting to things nobody else could perceive, sitting beside her for reasons that only make sense now. "You knew Vaeren and Joelle before we did," she says.<br><br>Soel closes his eyes, thoroughly, deliberately unbothered.<br><br>Ultimate victory, as far as he\'s concerned, has been achieved.',
    14: "Vaeren and Joelle sleep. And sleep. And keep sleeping, well past anything San remembers from raising children before.<br><br>San worries. Joel worries right alongside her. Ate Joy, who has genuinely raised children of her own, confirms honestly that yes, this would strike her as unusual for ordinary human newborns too — she's not simply overreacting to something normal.<br><br>Then someone finally notices Soel, curled up peacefully beside the twins, entirely undisturbed by any of it.<br><br>Eventually, between Renn's research and their own careful observation, they work it out: long sleep cycles like this are simply normal for Veyren babies. Nothing is wrong. This is just what their children's biology actually looks like.",
    15: 'The next assumption built on ordinary human parenting fails just as thoroughly as the last one did. Neither Vaeren nor Joelle wants milk, of any kind, from any source anyone tries. San\'s own doesn\'t work. Animal milk doesn\'t work either. Joy\'s considerable prior parenting knowledge doesn\'t help at all this time.<br><br>"Ate?" San finally asks, somewhat desperately.<br><br>"Don\'t look at me," Joy says. "Yours are different."<br><br>Their nutritional biology, it becomes increasingly clear, is fundamentally Veyren rather than human. Which means the actual, more useful question isn\'t what San did wrong. It\'s what the twins genuinely need instead.',
    16: 'Soel keeps reacting, insistently, to one particular source of Veyren nourishment, over and over, in a way that\'s hard to keep dismissing as coincidence. Eventually the humans in the room realize he\'s actually been trying to show them something this whole time.<br><br>Renn and Erynn investigate properly, and it turns out Soel was right — it provides exactly the nutritional profile the twins need to support their unusual sleep-and-growth cycles.<br><br>San looks at Soel afterward, somewhere between grateful and exasperated. "You could have told us," she says.<br><br>"He\'s a cat," Joel points out.<br><br>"He keeps knowing things!" San says.<br><br>Soel declines to comment on any of it.',
    17: 'Another completely unfamiliar childcare problem shows up, and Joel turns to San first, reasonably enough. "You\'ve had children," he points out.<br><br>San stares at him. "So have you!" she says.<br><br>They both look, hopefully, at Ate Joy, who has grown children of her own already. Joy looks at Vaeren and Joelle for a long moment.<br><br>"Mine didn\'t do that," she says, plainly.<br><br>Excellent. Three genuinely experienced parents in one room. Zero useful answers between them.<br><br>The actual lesson lands clearly enough, underneath the joke of it. They know children, all three of them, real and hard-won experience. They simply don\'t know Veyren children yet — and that\'s a considerably different thing to learn.',
    18: "Vaeren and Joelle's individuality becomes impossible to overlook as the days pass. Their sleep patterns don't match each other at all. They respond differently to sounds, to people, to the magic moving around them. Soel treats each of them noticeably differently, in ways that seem deliberate rather than random.<br><br>One of them settles quickly, easily soothed. The other stays curious, alert, harder to calm the same way. Their spiritual signatures, San notices, behave completely differently from each other too, the same way Mimi and Erynn first described back in Arc XXXIV.<br><br>They're always going to be twins, born together, raised together. But San understands now, watching them both, that they're never going to be interchangeable with each other.",
    19: "One twin produces a small, entirely harmless magical effect — nothing more dramatic than a faint shimmer, gone almost as soon as it appears. Later that same day, the other produces something else entirely, distinctly different in feel from the first.<br><br>Nothing about either moment is dangerous. Nothing about them defines a complete future power set for either child, and nobody in the room tries to make it mean more than it actually does.<br><br>It's simply enough, on its own, to confirm what's been building since Arc XXXIV: Vaeren and Joelle are developing real abilities of their own, distinct from each other, right on schedule with everything else about them.<br><br>Renn gets predictably, intensely interested. Joel looks at him, warningly.<br><br>\"Writing it down,\" Renn says, already reaching for something to write with.<br><br>Smart man.",
    20: "Fair Tide slowly starts piecing together the actual shape of the twins' strange developmental cycle. Their unusually long sleep periods, it turns out, correspond directly with bursts of intense physical, neurological, and magical development — not simple rest, but something considerably more active happening underneath it.<br><br>They aren't, Erynn concludes carefully, human children simply growing on some kind of accelerated fast-forward. Their development is happening according to entirely Veyren rhythms, following a shape none of the adults in the room fully recognize yet.<br><br>It's a small, unremarkable-looking discovery in the moment. It quietly lays the groundwork for something Fair Tide won't fully understand until considerably later — that Vaeren and Joelle might eventually look, physically, considerably older than their actual age in years.",
    21: "Joy spends real, unhurried time with her niece and nephew, settling into the role in a way that surprises even her a little. She's already raised children of her own, now fully grown — this isn't motherhood being recreated through someone else's babies, and she's careful, mostly without needing to say so out loud, not to let it become that.<br><br>It's something different instead. She's Ate Joy to an entirely new generation now, and that role has its own shape, separate from anything she already knows.<br><br>Her prior experience helps plenty, whenever ordinary parenting knowledge actually applies to Vaeren and Joelle. When it doesn't — which turns out to be often — she learns right alongside San and Joel, same as everyone else.<br><br>And San calling out \"Ate!\" across the house, without a second thought, has become completely, unremarkably natural by now.",
    22: "Help arrives constantly, from every direction — Aisyah, Mez, Joy, Mimi, and plenty of others throughout Fair Tide, all pitching in without being asked twice.<br><br>For San, it would be easy for this to start resembling her old life, where childcare responsibilities often ended up carried substantially by other people around her. This time, though, the structure underneath it is genuinely different. San and Joel are the actual everyday parents here. Joel never once treats caregiving as something beneath him or naturally hers to carry. San isn't expected to shoulder everything simply because she's the mother, and neither of them needs to prove anything by stubbornly refusing help when it's offered.<br><br>Someone else takes the twins for a while, easily, without ceremony. Then Joel looks over at San. \"Our turn?\" he asks.<br><br>\"Our turn,\" San says.<br><br>They're building hands-on parenthood together, the two of them, one ordinary moment at a time.",
    23: "Slowly, over the following days, Vaeren and Joelle meet their genuinely enormous extended family. Aisyah and Mez meet their sister's children properly for the first time. Senedra, Zaki, and Eliz gain two small new cousins to fuss over. Ate Joy, of course, already knows exactly where she belongs in all of it. Mimi, a mother herself, brings her own quiet perspective to meeting them. Caelan has already prepared everything anyone could reasonably need. Brada, predictably, seems to believe additional defenses would somehow help the situation. Renn and Erynn observe carefully from a respectful distance, having thoroughly learned their lesson about treating San's children as research specimens. Soel supervises the entire proceedings without once looking concerned.<br><br>Nobody in the room presents Vaeren and Joelle as heirs to anything. Fair Tide isn't a dynasty, and nobody here is treating it like one. They're simply two children, born into this particular community, among all these particular people. The Children of Fair Tide, and nothing more grand than that.",
    24: 'Night settles quietly over Fair Tide. Vaeren sleeps. Joelle sleeps beside him. Soel lies nearby, exactly where he\'s been every night since they arrived.<br><br>San and Joel sit together, simply watching all three of them.<br><br>San looks at Soel for a long moment. "You really knew first," she says.<br><br>Joel nods. "He did," he says.<br><br>San sighs, dramatically. "Fine. You win."<br><br>Soel purrs, entirely pleased with himself.<br><br>Vaeren stirs slightly in his sleep. A faint magical response follows, barely perceptible. Then Joelle responds too, differently, distinctly her own.<br><br>San and Joel exchange a look. They don\'t know what their children will become. They don\'t know exactly how quickly they\'ll grow. They don\'t know what their powers will eventually be. And despite both of them having been parents before, in entirely different lives, they certainly don\'t know everything about raising these two.<br><br>But they know how they\'re going to do it.<br><br>Together.<br><br>San reaches for Joel\'s hand. "Team," she says.<br><br>"Always," Joel says.<br><br>Outside, Fair Tide continues exactly as it always has. Inside are two children whose names carry both sides of their parents\' entire journey — Vaeren, born of their new world, and Joelle, a name San carried all the way from her old one. And beside them, still keeping watch, is the cat who knew them both first.<br><br>A new generation has begun.'
  };
  window.ARC35_CHAPTER_SCENES = ARC35_CHAPTER_SCENES;

  window.arc35ObjectiveState = function(){
    if (!game.arc34Complete) return null;
    if (level() < 525) return null;
    game.comicProgress35 = game.comicProgress35 || {};
    for (const ch of ARC35_CHAPTERS) {
      if (!game.comicProgress35[ch.id]) return 'complete_arc35_chapter_' + ch.id;
    }
    return 'arc35_part1_complete_for_now';
  };

  window.markArc35ChapterRead = function(id){
    const so = window.arc35ObjectiveState();
    if (so !== ('complete_arc35_chapter_' + id)) return;
    game.comicProgress35 = game.comicProgress35 || {};
    game.comicProgress35[id] = true;
    // Matches every prior arc's own completion flag (arc33/arc34Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 24) game.arc35Complete = true;
    const ch = ARC35_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC35_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC35_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc35Splash = function(){
    const overlay = document.getElementById('arc35SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc35Splash = function(){
    const overlay = document.getElementById('arc35SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc35SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc35 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc35) oldRenderStoryForArc35();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc35Ready = window.arc35ObjectiveState() !== null;
    if (arc35Ready && !game.arc35SplashSeen && typeof window.__ctShowArc35Splash === 'function') {
      window.__ctShowArc35Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc35/arc35-cover-the-children-of-fair-tide.png" alt="Arc XXXV — The Children of Fair Tide" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXXV</div><div class="story-act-title">The Children of Fair Tide</div>'+
      '<div class="story-act-tagline">A new generation begins.</div></div>';
    if (!arc35Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXXV Locked</div><div class="story-chapter-sub">'+
        (!game.arc34Complete ? 'Finish Arc XXXIV first.' : 'Reach Level 525 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc35ObjectiveState();
    ARC35_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress35 && game.comicProgress35[ch.id]);
      const ready = !done && so===('complete_arc35_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc35ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc35_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXXV chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
