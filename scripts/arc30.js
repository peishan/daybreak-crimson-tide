(function(){
  // -------------------------------------------------------------------
  // ARC XXX — THE BETRAYAL. Gated at arc29Complete + level 450,
  // continuing the established +15-per-arc ladder (XXVII:405, XXVIII:
  // 420, XXIX:435, XXX:450). Ch.24 sets game.arc30Complete = true,
  // matching every other arc's own finale flag.
  //
  // Per the outline this arc was built from: this closes N's own
  // character arc. She was introduced to resolve unfinished Brunei
  // history, not to become a recurring character, and this arc is
  // explicit that she needs no rescue arc, redemption arc, revenge
  // storyline, or later starring role. Her fate (Ch.24) is deliberately
  // left unconfirmed -- imprisoned, exiled, sold, worse, or eventually
  // rebuilding a life somewhere are all left open on purpose, and
  // nothing in this file or its mechanics file resolves that ambiguity.
  //
  // Equally important, per the outline: NEITHER Sairen NOR the Nameless
  // as a whole betrays Fair Tide. The betrayal is N's own choice
  // (Ch.16's own title is literal: "This is the betrayal... N makes the
  // choice herself"), enabled by a single Nameless faction acting
  // through a manipulator ("the Pawn") whose own superior is never
  // identified. Ch.21 explicitly clears Sairen of the operation itself
  // while still holding him accountable for not confusing his own hurt
  // over N's affair with Fair Tide's actual crisis -- and Ch.22 notes
  // other Nameless contacts may quietly help Fair Tide precisely
  // because they oppose this one faction, not because they've become
  // Fair Tide's allies.
  //
  // San's own response (Ch.19, Ch.23) is deliberately NOT punitive
  // theater -- no revenge, no cruelty, just a Captain's plain boundary
  // ("You can't come back into Fair Tide" / "Not while I can't trust
  // you inside it"), stated once and left to stand.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. The gameplay Ch.11, 18, 20-22, and 23-24's own
  // notes call for (N's Fair Tide access evolving to Revoked/Missing,
  // Information Compartmentalization, Compromised Horizon Routes tied
  // to Arc XXVI's Reserves/Trade systems, and the Nameless Allegiances
  // registry) lives in scripts/arc30-mechanics.js, same split used
  // since Arc XXIII.
  //
  // XP escalates toward Ch.16 ("The Choice," explicitly the arc's own
  // literal betrayal per the outline's own chapter note) at 400, with
  // Ch.24's finale bump (380) kept below it — the same "one centerpiece,
  // not two" convention used since Arc XX.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC30_CHAPTERS = [
    {id:1, title:'Among the Nameless', focus:"N is now living with Sairen within the wider Nameless society, and for the first time sees how varied it really is — protectors, information traders, political operators, some hostile to Fair Tide, some respectful, some indifferent. There's no single Nameless allegiance. N is mostly known simply as the woman Sairen brought with him.", image:'assets/comics/arc30/ch01-among-the-nameless.png', xp:260, action:'🕸️ Meet the Wider Nameless'},
    {id:2, title:"Sairen's Work", focus:'Sairen keeps leaving on assignments — his original one was to get close to N, but their relationship has grown into something genuinely adult, though neither married nor publicly committed. "Stay out of trouble." "I always do." A look. "Eventually." He leaves.', image:'assets/comics/arc30/ch02-sairens-work.png', xp:270, action:'🧳 Watch Sairen Leave'},
    {id:3, title:"Someone Else's Woman", focus:"N starts resenting how people see her — San's old friend at Fair Tide, Sairen's woman here. She left Fair Tide partly for independence, and instead has a home, resources, and security provided entirely by him. She doesn't dislike being cared for. She dislikes having nothing that's actually hers.", image:'assets/comics/arc30/ch03-someone-elses-woman.png', xp:270, action:"🌹 Feel Like Someone Else's Woman"},
    {id:4, title:'Someone Notices', focus:"While Sairen's away, another Nameless man — a different allegiance — approaches N. He doesn't ask about San or Fair Tide first. He notices her: her frustration, her ambition, her wish to prove she's more than someone's dependent. He offers her an opportunity.", image:'assets/comics/arc30/ch04-someone-notices.png', xp:280, action:'👁️ Notice Him Noticing'},
    {id:5, title:'Useful', focus:"The man gives N a small, harmless task with nothing to do with Fair Tide. She succeeds and gets paid — for once, something obtained without borrowing from San or receiving from Sairen. It feels good. He tells her she's useful. She likes hearing that even more.", image:'assets/comics/arc30/ch05-useful.png', xp:280, action:'🪙 Feel Useful'},
    {id:6, title:'Something of Her Own', focus:"Their meetings continue while Sairen's away. The man suggests she doesn't need to tell Sairen everything. N agrees, enjoying having something the professional spy doesn't know about. What starts as secrecy gradually becomes attraction — she believes she understands men now, and Veyren gave her the confidence to use it. She doesn't realize she isn't the only one playing a game.", image:'assets/comics/arc30/ch06-something-of-her-own.png', xp:280, action:'🤫 Keep Something of Her Own'},
    {id:7, title:'Crossing Another Line', focus:"N and the man become sexually involved. She and Sairen were never married or publicly declared, but he's become emotionally important to her regardless — and she chooses to hide the affair from him. The affair itself isn't the arc's real betrayal, but it shows how comfortable she's becoming with secrecy.", image:'assets/comics/arc30/ch07-crossing-another-line.png', xp:290, action:'💋 Cross Another Line'},
    {id:8, title:'The Pawn', focus:"Signs emerge that N's new lover isn't acting entirely for himself — he has his own agenda, but something or someone appears to sit behind it. He may believe himself important. He may be just as expendable as N. For now, the mystery stays exactly that.", image:'assets/comics/arc30/ch08-the-pawn.png', xp:290, action:'🕸️ Sense the Pawn'},
    {id:9, title:'Harmless Questions', focus:"The questions start casually — what was San like in Brunei, who does she listen to, how does Joel react when she's threatened, who handles trade, who manages the Horizon Engine. N answers some. Just conversations, she tells herself.", image:'assets/comics/arc30/ch09-harmless-questions.png', xp:290, action:'🗣️ Answer Harmless Questions'},
    {id:10, title:'Another View of Fair Tide', focus:"The man offers N a different argument — why should Fair Tide alone decide who uses Horizon routes, which worlds are protected, who controls information affecting so many others? Some of it is a legitimate political question, which is exactly what makes the manipulation work. N starts convincing herself Fair Tide's restrictions aren't necessarily fair.", image:'assets/comics/arc30/ch10-another-view-of-fair-tide.png', xp:300, action:'⚖️ Hear Another View'},
    {id:11, title:'Back to Fair Tide', focus:'N returns as a visitor. San lets her in under ordinary visitor restrictions. Joel is cautious but relaxed. "Everything okay?" "Why wouldn\'t it be?" Joel doesn\'t push. San notices something different about her, without yet knowing what.', image:'assets/comics/arc30/ch11-back-to-fair-tide.png', xp:290, action:'🌊 Return to Fair Tide'},
    {id:12, title:'Borrowing Something Else', focus:'N asks San about a Horizon route. San: "First money. Now Horizon routes." N: "I\'m expanding my interests." San: "Expand somewhere else." For a moment they\'re almost the old friends they used to be. San\'s answer stays no.', image:'assets/comics/arc30/ch12-borrowing-something-else.png', xp:290, action:'😂 Borrow Something Else'},
    {id:13, title:'Familiar Doors', focus:"N discovers she doesn't need San to tell her everything. People recognize her, an expedition gets mentioned casually, a shipment schedule sits in plain view, a worker answers an innocent question. Individually harmless fragments. Together, valuable intelligence.", image:'assets/comics/arc30/ch13-familiar-doors.png', xp:300, action:'🚪 Walk the Familiar Doors'},
    {id:14, title:'The First Report', focus:"N hands the information to her lover, and he rewards her. This time she knows it isn't casual conversation — she's passing Fair Tide information to someone who wants it. She rationalizes it anyway: she didn't steal anything, didn't breach the Horizon Engine. It's only information.", image:'assets/comics/arc30/ch14-the-first-report.png', xp:300, action:'📜 File the First Report'},
    {id:15, title:'One More Thing', focus:"The man asks for something connected to a protected Horizon route. N hesitates — this is different. He reminds her what she's gaining: her own resources, her own influence, independence from San and from Sairen, the chance to matter in her own right. The larger agenda behind him stays hidden.", image:'assets/comics/arc30/ch15-one-more-thing.png', xp:310, action:'⚠️ Face One More Thing'},
    {id:16, title:'The Choice', focus:"N returns to Fair Tide and knowingly gathers information she understands she isn't supposed to share. Nobody forces her. Nobody threatens her. Sairen never instructed her. Her lover influenced her, but the choice is hers alone. She passes the information on. This is the betrayal.", image:'assets/comics/arc30/ch16-the-choice.png', xp:400, action:'🩸 Make the Choice'},
    {id:17, title:'Someone Was Waiting', focus:"A Fair Tide vessel reaches a scheduled point and finds someone already there. Another expedition hits unexpected interference. Trade movements are anticipated. Someone knows when certain Horizon routes will open. Fair Tide's network has been compromised.", image:'assets/comics/arc30/ch17-someone-was-waiting.png', xp:310, action:'🌊 Notice Someone Waiting'},
    {id:18, title:'Inside the Walls', focus:"Joy reviews security. Senedra traces movements through Fair Tide. Renn and Erynn comb the Horizon records. Nobody hacked the Engine, breached the Archive, or forced entry anywhere. Someone simply gathered ordinary fragments from people already inside. San begins to understand.", image:'assets/comics/arc30/ch18-inside-the-walls.png', xp:310, action:'🔎 Look Inside the Walls'},
    {id:19, title:'N', focus:'San confronts N, who insists she never stole protected documents. San doesn\'t argue technicalities. "Did you know you weren\'t supposed to give them that information?" N has no convincing answer. San already has hers — this is no longer about Brunei. N has betrayed her trust again, this time as Captain of Fair Tide.', image:'assets/comics/arc30/ch19-n.png', xp:330, action:'💔 Face San as N'},
    {id:20, title:'Shut the Horizons', focus:"The compromised information threatens a protected route. San suspends the affected Horizon routes. Trade slows, expeditions delay, resources grow scarce, partners beyond Veyren are warned, parts of the network go dark. Arc XXVI's independence and reserve systems suddenly matter: Fair Tide has to survive without uninterrupted inter-world access.", image:'assets/comics/arc30/ch20-shut-the-horizons.png', xp:320, action:'🔒 Shut the Horizons'},
    {id:21, title:'Not Sairen', focus:"Sairen returns and learns everything. Suspicion touches him first, given his own original assignment — but Fair Tide Intelligence finds the operation doesn't match his contacts, methods, or allegiance. Then he learns the rest: another Nameless man approached N while he was away, and used her connection to Fair Tide. He's hurt by the affair, but doesn't confuse his own betrayal with Fair Tide's crisis — nor does he excuse her. She was manipulated. She still chose to participate.", image:'assets/comics/arc30/ch21-not-sairen.png', xp:310, action:'🕵️ Learn It Wasn\'t Sairen'},
    {id:22, title:'Fair Tide Holds', focus:"The faction behind the operation tries to exploit the compromised route. Fair Tide is ready — San and Joel coordinate while Joy, Senedra, Zaki, and the Horizon Team defend the settlement and network. Other Nameless contacts may quietly help, opposing this faction rather than suddenly siding with Fair Tide. The operation fails. The route stays protected. N's recruiter is exposed as something smaller than he seemed — a pawn. Whoever stood behind him remains unknown.", image:'assets/comics/arc30/ch22-fair-tide-holds.png', xp:330, action:'⚔️ Hold Fair Tide'},
    {id:23, title:'The Door Closes', focus:'N faces San. Nobody in San\'s family seeks revenge — San simply exercises her responsibility as Captain. "You can\'t come back into Fair Tide." "Ever?" San makes no promise about forever. "Not while I can\'t trust you inside it." That\'s the end of N\'s place in Fair Tide. What happens between her and Sairen is theirs — but first, N and the man she worked with are called to answer within the Nameless world itself, somewhere Fair Tide has no authority at all.', image:'assets/comics/arc30/ch23-the-door-closes.png', xp:320, action:'🚪 Watch the Door Close'},
    {id:24, title:'Missing', focus:"No trial scene, no punishment scene, no confirmation. N simply disappears, along with the man who recruited her. Rumors circulate — none verifiable, even by Sairen, who eventually reaches the end of his own trail. She was punished; neither is confirmed dead; both locations are unknown; whoever stood behind the pawn is still unidentified. At Fair Tide, the Horizon Engine gradually comes back online. San stands with Joel as another route stabilizes. N's story is over. Fair Tide's isn't.", image:'assets/comics/arc30/ch24-missing.png', xp:380, action:'🌑 Mark Her Missing'}
  ];
  window.ARC30_CHAPTERS = ARC30_CHAPTERS;

  const ARC30_CHAPTER_SCENES = {
    1: "The Nameless world, once N is actually living inside it rather than just brushing against its edges, turns out to be nothing like the single shadowy organization Fair Tide's own reports made it sound like.<br><br>Some of the people she meets clearly spend their effort protecting others. Some trade in nothing but information, careful and transactional about it. Some are political to their core, forever arguing positions N only half-follows. Some regard Fair Tide with open suspicion. Others speak of it with something close to respect. Most, frankly, don't think about it at all.<br><br>Nobody asks N for her own opinion on any of it. Mostly, when she's mentioned at all, she's simply \"Sairen's,\" the woman he brought back with him — a description she's still working out how she feels about.",
    2: '"Stay out of trouble," Sairen says, already halfway toward the door, another unexplained assignment pulling him away again.<br><br>"I always do," N says.<br><br>He looks at her — a long, familiar, unconvinced look.<br><br>"Eventually," she adds, grinning despite herself.<br><br>He doesn\'t argue the point. He just leaves, the way he always leaves, and N is left once again with the particular, complicated shape of missing someone she\'s not entirely sure she\'s allowed to call hers.',
    3: "It creeps up on her slowly, the resentment — not at Sairen exactly, more at the shape other people keep pouring her into.<br><br>At Fair Tide she was always San's old friend first, whatever else she might have been. Here, increasingly, she's simply the woman Sairen brought home. A home he provides. Security he provides. Resources that flow from him, not from anything she's built herself.<br><br>She doesn't dislike being looked after — that part, if she's honest, is easy to enjoy. What gnaws at her is subtler: she left Fair Tide chasing independence, and somehow landed somewhere she still doesn't own a single thing outright.",
    4: "The man approaches while Sairen's away on one of his usual unexplained errands, and he doesn't open with the questions N's half-braced herself for.<br><br>Nothing about San. Nothing about Fair Tide.<br><br>He asks about her instead — genuinely, or convincingly enough that the difference doesn't register. Her frustration. Her ambition. The particular itch of wanting to prove she's capable of more than being someone else's dependent.<br><br>By the end of the conversation, he's offered her something to actually do. N isn't sure yet what to make of him. She's fairly sure, at least, that she likes being asked instead of simply provided for.",
    5: "The task itself is almost aggressively unremarkable — nothing dangerous, nothing anywhere near Fair Tide, nothing that asks her to be anyone other than herself.<br><br>She does it well. She gets paid for it, properly, without borrowing a single coin from San and without it coming from Sairen's own unexplained funds.<br><br>It's a small thing. It doesn't feel small.<br><br>\"You're useful,\" the man tells her afterward, plainly, like it's simply a fact rather than flattery.<br><br>N finds she likes hearing it considerably more than she expects to.",
    6: "The meetings keep happening, quietly, whenever Sairen's away long enough for there to be room for them.<br><br>\"You don't have to mention this to him,\" the man says, at some point, casual about it in a way that makes it easy to agree with.<br><br>N does agree. She likes having something the professional spy in her life doesn't already know about — a small, private thing that's entirely hers, secrecy and all.<br><br>Somewhere in the space between the secrecy and the attention, something else starts growing. N tells herself she understands exactly how this works, that she's the one reading him. She doesn't yet consider that she might not be the only one at this particular table.",
    7: "It happens the way these things happen — gradually, and then suddenly not gradual at all.<br><br>N and Sairen were never anything formal. No ceremony, no declared commitment, nothing either of them could point to and call binding. She reminds herself of that fact more than once, working through the shape of her own guilt.<br><br>It doesn't fully land as an excuse. He's become important to her regardless of what either of them ever formally declared, and she chooses — clearly, deliberately — not to tell him.<br><br>The affair isn't the arc's real wound. What it proves, more than anything, is how easily she's learned to live inside a secret now.",
    8: "Watching the two of them together long enough, something starts to feel slightly off about the shape of it — not in N's behavior, but in his.<br><br>He clearly has his own agenda. That much has been obvious from early on. What's less clear is whether the agenda is entirely his, or whether something larger sits behind him, using him the same careful way he's using her.<br><br>He may genuinely believe himself important to whatever this is. He may, just as easily, be exactly as expendable as she is.<br><br>Nobody watching yet knows which. For now, the shape behind him stays exactly that — a shape, nothing more.",
    9: "The questions arrive dressed as nothing at all — idle curiosity, the kind of thing anyone might ask about someone they're close to.<br><br>What was San actually like, back in Brunei? Whose opinion does she weigh most heavily? How does Joel react when she's genuinely threatened? Who handles Fair Tide's trade? Who actually manages the Horizon Engine day to day?<br><br>N answers some of it. Not all of it feels worth withholding — these are just conversations, she tells herself, turning the thought over enough times that it almost stops sounding like a justification.",
    10: "The argument he offers her doesn't sound like manipulation. That's rather the problem with it.<br><br>Why should one settlement decide who gets to use the Horizon routes at all? Why should San alone decide which worlds count as protected? Why should Fair Tide sit on information that affects communities who never had any say in the decision?<br><br>Some of it is a genuinely fair question. N knows enough of Fair Tide's own history now to recognize that much. That's exactly what makes it work on her — she starts telling herself, quietly, that maybe San's restrictions were never as obviously right as everyone at Fair Tide seems to assume.",
    11: '"Everything okay?" Joel asks, careful but not unkind, when N walks back through Fair Tide\'s gate as an ordinary visitor for the first time in a while.<br><br>"Why wouldn\'t it be?" she says, a little too quickly for the question to have landed as lightly as she meant it.<br><br>Joel doesn\'t push. He\'s never been the type to corner someone with a question they\'ve already decided not to answer honestly.<br><br>San watches her a little longer than Joel does, some instinct catching on something she can\'t yet name. Not suspicion, exactly. Just the sense that whoever\'s standing in front of her isn\'t quite the same person who left.',
    12: '"So," N says, working up to it with slightly too much casualness, "I was wondering about one of the Horizon routes."<br><br>San gives her a long, dry look. "First money. Now Horizon routes."<br><br>"I\'m expanding my interests."<br><br>"Expand somewhere else."<br><br>For one unguarded moment, something almost easy passes between them — the ghost of exactly the kind of exchange they used to have, back before either of them had anything serious to hold against the other.<br><br>San\'s answer doesn\'t move an inch regardless. No is still no.',
    13: "It surprises N, a little, how much she still knows without anyone having to formally tell her anything.<br><br>People still recognize her, still greet her the way you greet someone who used to belong somewhere. Someone mentions an upcoming expedition without thinking twice about who's listening. A shipment schedule sits openly where anyone walking past could read it. A worker answers a perfectly innocent-sounding question without a second thought.<br><br>None of it, taken alone, would trouble anyone. N starts noticing, almost against her own will, how differently it reads once you start holding all of it together in the same hand.",
    14: "She hands it over plainly, without much ceremony, and gets rewarded for it just as plainly.<br><br>This time, there's no pretending to herself that it was simply conversation. She knows exactly what she's done — handed real information about Fair Tide to someone who specifically wanted it.<br><br>She works the justification out anyway, piece by piece. She didn't steal a single document. She never went near the Horizon Engine itself. It's only information, freely given, nothing anyone could call theft.<br><br>She almost believes it, saying it to herself. Almost.",
    15: '"One more thing," he says, and this request sits differently from everything before it — something connected to a route Fair Tide has deliberately kept protected.<br><br>N hesitates, properly, for the first time.<br><br>He doesn\'t push her hard. He simply reminds her, gently, of everything she\'s actually gained since she started doing this — resources nobody handed her, influence that\'s entirely her own, a version of independence from San AND from Sairen both, and the real possibility of becoming someone who matters on her own terms, not anyone else\'s.<br><br>Behind him, unseen and unmentioned, whatever larger design any of this actually serves stays exactly where it\'s always been — out of view.',
    16: "N goes back to Fair Tide one more time, and this time there's no ambiguity left to hide inside. She knows precisely what she's gathering. She knows precisely that she isn't supposed to share it.<br><br>Nobody forces any of it. Nobody threatens her into it. Sairen never once instructed her to do any of this — he doesn't even know it's happening. The man influenced her, shaped the path that led here, made the reasoning feel almost sound.<br><br>But the choice, when it actually arrives, is entirely hers. She makes it anyway.<br><br>She passes the information on.<br><br>This is the betrayal.",
    17: "It surfaces first as a series of things that shouldn't add up, and then very quickly as a pattern that can't mean anything else.<br><br>A Fair Tide vessel reaches a point on its route and finds someone already waiting there, plainly not by accident. Another expedition runs into interference nobody could have anticipated — except, apparently, somebody did. Trade movements that should have been unpredictable keep getting anticipated exactly right. Someone, somewhere, knows precisely when certain Horizon routes are due to open.<br><br>Fair Tide doesn't need much more than that to understand the shape of what's happened. Its own network has been compromised, from somewhere nobody thought to look.",
    18: "Joy goes through security with the kind of thoroughness that leaves nothing unchecked. Senedra retraces movements through Fair Tide itself, looking for the seam. Renn and Erynn comb through the Horizon records for any sign of actual intrusion.<br><br>They find nothing of the kind. Nobody broke into the Engine. Nobody breached the Archive. Nobody forced their way into a single restricted facility.<br><br>What they find instead is quieter and considerably harder to accept — ordinary fragments, gathered from people who were always allowed to be inside Fair Tide's own walls in the first place.<br><br>San starts putting the shape of it together before anyone says the name out loud.",
    19: '"I never stole a single protected document," N says immediately, the moment San brings her in, already anticipating the accusation she expects.<br><br>San doesn\'t engage with the technicality at all.<br><br>"Did you know you weren\'t supposed to give them that information?"<br><br>N doesn\'t have an answer that survives the question. San already has hers, and has had it since before she asked.<br><br>This isn\'t Brunei anymore, San realizes, watching her old friend fail to find a single honest word to offer. This is worse, in its own way — N has betrayed her trust again, and this time it isn\'t San\'s trust as a friend she\'s broken. It\'s San\'s trust as Captain of an entire settlement.',
    20: "The route the compromised information touches isn't one San can simply monitor more closely and hope for the best. She orders it suspended outright, along with everything close enough to be at risk alongside it.<br><br>The consequences don't stay contained to one route for long. Trade slows across the board. Expeditions already planned get delayed indefinitely. Resources that used to arrive without anyone thinking twice about it suddenly take real effort to secure. Partners beyond Veyren get warned, some of them uneasy about it in ways San can't fully smooth over. Parts of Fair Tide's own Horizon network simply go dark.<br><br>Everything the settlement built toward independence and self-sufficiency, arc after arc, stops being background infrastructure and starts being the only thing standing between Fair Tide and real hardship.",
    21: "Sairen comes home to a settlement already deep in crisis, and the first thing anyone has to consider — himself included — is whether his own original assignment ever stopped mattering.<br><br>Fair Tide Intelligence checks thoroughly. The methods don't match his. The contacts don't match his. Whatever ran this operation, it wasn't him.<br><br>What he learns instead is worse, in its own way. Someone else, from a different corner of the same Nameless world, found N while he was away and used exactly the connection he himself was once sent to exploit.<br><br>He's hurt by the affair underneath all of it — genuinely, personally hurt, in a way he doesn't bother hiding from himself. But he doesn't confuse that hurt with Fair Tide's own crisis, and he doesn't let it excuse her either. She was manipulated, certainly. She still chose, at every step, to keep going.",
    22: "The faction behind the operation makes its actual move once the compromised route looks vulnerable enough to exploit properly — and finds Fair Tide waiting for them instead.<br><br>San and Joel hold the center of the response while Joy, Senedra, Zaki, and the Horizon Team handle everything the crisis actually throws at the settlement and its network. Here and there, quietly, a few other Nameless contacts even lend a hand — not because they've decided to side with Fair Tide, but because they want this particular faction to fail for reasons entirely their own.<br><br>The operation fails outright. The protected route holds. And the man who spent so much effort recruiting N turns out to be exactly what the crew suspected he might be — not the architect of any of this, just a pawn, however useful he believed himself to be. Whoever actually stood behind him is still, and remains, unknown.",
    23: '"You can\'t come back into Fair Tide," San tells her, plainly, without cruelty and without hesitation either.<br><br>"Ever?" N asks.<br><br>San doesn\'t answer that with a promise, because she doesn\'t have one to give. "Not while I can\'t trust you inside it."<br><br>Nobody in San\'s family pushes for anything harsher. No one wants revenge, and no one gets to have it even if they did — this is simply San exercising the responsibility that comes with being Captain, nothing more dramatic than that.<br><br>Whatever remains between N and Sairen is theirs to work out, wherever that ends up going. But before either relationship can properly resolve, N and the man she worked with are summoned to answer for what happened — inside the Nameless world itself, somewhere Fair Tide has no authority at all to follow them.',
    24: "There's no trial scene. No formal punishment scene. No moment of confirmation for anyone watching to hold onto.<br><br>N simply disappears. So does the man who recruited her.<br><br>The rumors that follow contradict each other constantly — imprisoned, stripped of everything, sold somewhere people don't return from, something worse still. None of it can actually be verified, not by Fair Tide, not even by Sairen, who searches longer and harder than anyone expects before finally, quietly, reaching the end of a trail that simply stops.<br><br>What he eventually confirms amounts to very little: she was punished. So was he. Neither is confirmed dead. Neither can be located. Whoever stood behind the pawn is still, and may always be, unidentified.<br><br>Back at Fair Tide, the Horizon Engine hums back to life one route at a time. San stands with Joel and watches another one stabilize, steady this time, secured properly rather than merely hoped for.<br><br>N's story ends here, unresolved on purpose.<br><br>Fair Tide's does not."
  };
  window.ARC30_CHAPTER_SCENES = ARC30_CHAPTER_SCENES;

  window.arc30ObjectiveState = function(){
    if (!game.arc29Complete) return null;
    if (level() < 450) return null;
    game.comicProgress30 = game.comicProgress30 || {};
    for (const ch of ARC30_CHAPTERS) {
      if (!game.comicProgress30[ch.id]) return 'complete_arc30_chapter_' + ch.id;
    }
    return 'arc30_part1_complete_for_now';
  };

  window.markArc30ChapterRead = function(id){
    const so = window.arc30ObjectiveState();
    if (so !== ('complete_arc30_chapter_' + id)) return;
    game.comicProgress30 = game.comicProgress30 || {};
    game.comicProgress30[id] = true;
    // Matches every prior arc's own completion flag (arc28/arc29Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 24) game.arc30Complete = true;
    const ch = ARC30_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC30_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC30_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc30Splash = function(){
    const overlay = document.getElementById('arc30SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc30Splash = function(){
    const overlay = document.getElementById('arc30SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc30SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc30 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc30) oldRenderStoryForArc30();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc30Ready = window.arc30ObjectiveState() !== null;
    if (arc30Ready && !game.arc30SplashSeen && typeof window.__ctShowArc30Splash === 'function') {
      window.__ctShowArc30Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc30/arc30-cover-the-betrayal.png" alt="Arc XXX — The Betrayal" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXX</div><div class="story-act-title">The Betrayal</div>'+
      '<div class="story-act-tagline">What happens when the people inside the walls become the threat?</div></div>';
    if (!arc30Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXX Locked</div><div class="story-chapter-sub">'+
        (!game.arc29Complete ? 'Finish Arc XXIX first.' : 'Reach Level 450 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc30ObjectiveState();
    ARC30_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress30 && game.comicProgress30[ch.id]);
      const ready = !done && so===('complete_arc30_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = 
          '<button class="btn btn-small btn-success" onclick="markArc30ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc30_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXX chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
