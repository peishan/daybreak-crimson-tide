(function(){
  // -------------------------------------------------------------------
  // ARC XXIX — THE SPY. Gated at arc28Complete + level 435, continuing
  // the established +15-per-arc ladder (XXVI:390, XXVII:405, XXVIII:420,
  // XXIX:435). Ch.24 sets game.arc29Complete = true, matching every
  // other arc's own finale flag.
  //
  // Per the outline this arc was built from: this is NOT "evil spy
  // infiltrates Fair Tide through N." Sairen may have had professional
  // reasons for taking an interest in N and her Fair Tide connection,
  // while genuinely developing real attachment that complicates his own
  // work — the arc's thesis, stated by the outline itself: "A person can
  // hide the truth without everything they show you being false."
  // Ch.15's "I didn't lie every time I was with you" and Ch.21's "living
  // with N was not part of any assignment" are both written to hold that
  // tension without resolving it into either "he's secretly good" or
  // "he's secretly still lying about all of it."
  //
  // Ch.23 sets Fair Tide's actual boundary with him — ordinary visitor
  // restrictions only, no recruitment, no Intelligence or Horizon
  // access — and Ch.24 explicitly ends on San's own unresolved verdict
  // ("Trust him?" / "No." / "Her?" / "Not yet."), per the outline's own
  // insistence that Sairen the trusted future friend is "years of
  // character development away" and this arc must not skip to that.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. The gameplay Ch.6, 7, 9, 10, 11, 12, and 23's
  // own notes call for (the Sairen Person-of-Interest dossier and the
  // Cross-Check/Possible-Misdirection upgrade to Fair Tide Intelligence)
  // lives in scripts/arc29-mechanics.js, same split used since Arc
  // XXIII — this upgrades Arc XXVII's existing Intelligence Analysis
  // system rather than replacing it; that file's own CONFIRMED/LIKELY/
  // UNVERIFIED/CONTRADICTORY states and analyst-assignment flow are
  // untouched, with Possible Misdirection added as a fifth outcome only
  // reachable through the new Cross-Check action.
  //
  // Deliberately NOT built, per the outline's own explicit restraint: no
  // ALL_PARTY entry for Sairen, no recruitment path, no way for the
  // player to field him. His own Codex card says so directly
  // ("Recruitable: No") and stays that way through this arc's own end.
  //
  // XP escalates toward Ch.12 ("The Spy," where the working
  // classification unlocks and, per the outline's own note, "the arc
  // title finally earns itself") at 400, with Ch.24's finale bump (380)
  // kept below it — the same "one centerpiece, not two" convention used
  // since Arc XX.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC29_CHAPTERS = [
    {id:1, title:'Still Here', focus:"Some time has passed since N left Fair Tide. She wakes in Sairen's hideout expecting him to have vanished on one of his unexplained errands. Instead he's making breakfast — and she's settling into this arrangement faster than she meant to.", image:'assets/comics/arc29/ch01-still-here.png', xp:260, action:'🍳 Wake to Breakfast'},
    {id:2, title:"Don't Ask", focus:'N starts noticing things — disappearances with no explanation, several languages, money from sources she doesn\'t understand, an accent and manner that shift depending on where they\'re going. Asked what he does: "Work." "What kind?" "The kind where not asking is useful." N finds it irritating, and intriguing.', image:'assets/comics/arc29/ch02-dont-ask.png', xp:270, action:"🤫 Hear \"Don't Ask\""},
    {id:3, title:'Someone Is Paying Attention', focus:"Fair Tide Intelligence notices someone quietly gathering publicly available information about Fair Tide. Nothing stolen, no restricted system breached — but the questions are unusually specific.", image:'assets/comics/arc29/ch03-someone-is-paying-attention.png', xp:270, action:'👀 Notice Someone Watching'},
    {id:4, title:'The Man With N', focus:'A Fair Tide contact spots N with an unfamiliar man, and the report reaches San. Her first reaction isn\'t espionage — "Is she all right?" She is, apparently very much so. Joel\'s reaction is wonderfully concise: "Who\'s the guy?"', image:'assets/comics/arc29/ch04-the-man-with-n.png', xp:270, action:'🕵️ Spot the Man With N'},
    {id:5, title:"N's New Life", focus:"San encounters N again, visibly eager to demonstrate she's doing perfectly well without Fair Tide. Sairen is introduced simply as the man she's staying with. San is polite. Joel is polite. Joel also watches him. Sairen notices. Neither man says anything about it.", image:'assets/comics/arc29/ch05-ns-new-life.png', xp:280, action:"💁 See N's New Life"},
    {id:6, title:'Too Ordinary', focus:"Fair Tide Intelligence tries to establish who Sairen actually is. The problem isn't that no records exist — too many exist, under different names, different occupations, different ports, details that almost fit. Someone has deliberately constructed identities.", image:'assets/comics/arc29/ch06-too-ordinary.png', xp:280, action:'📑 Find It Too Ordinary'},
    {id:7, title:'A Man of Several Names', focus:"Renn correlates the records and finds the same face under different identities. San realizes N isn't merely living with a mysterious traveler — she's living with someone professionally trained to disappear.", image:'assets/comics/arc29/ch07-a-man-of-several-names.png', xp:280, action:'🎭 Count His Names'},
    {id:8, title:"Don't Tell Her Yet", focus:"The crew debates warning N immediately. San refuses to storm into her life with accusations before they actually know what Sairen is. Joel supports the caution — they need facts first.", image:'assets/comics/arc29/ch08-dont-tell-her-yet.png', xp:290, action:'🤐 Hold Off Telling Her'},
    {id:9, title:'Following the Follower', focus:"Senedra quietly tracks Sairen and discovers something unpleasant: he knows. Rather than confronting her, he deliberately lets her follow part of the journey, then vanishes — Fair Tide Intelligence is good; Sairen is an actual field operative.", image:'assets/comics/arc29/ch09-following-the-follower.png', xp:290, action:'🚶 Follow the Follower'},
    {id:10, title:'The Wrong Man', focus:"Fair Tide believes Sairen is meeting a particular contact, investigates, and finds the wrong person entirely — Sairen deliberately planted the trail. Renn is offended on an almost academic level.", image:'assets/comics/arc29/ch10-the-wrong-man.png', xp:290, action:'❌ Chase the Wrong Man'},
    {id:11, title:'The Nameless Connection', focus:"Evidence finally links one of Sairen's identities to a Nameless contact — which doesn't automatically tell Fair Tide whether he's a member, contractor, informant, infiltrator, or enemy of the network. Arc XXVII already taught them not to assume those are interchangeable.", image:'assets/comics/arc29/ch11-the-nameless-connection.png', xp:300, action:'🔗 Find the Nameless Connection'},
    {id:12, title:'The Spy', focus:'Fair Tide finally gives him a working classification — SAIREN. True name: Unconfirmed. Occupation: Intelligence operative. Affiliations: Unknown / Nameless-associated. Threat level: Undetermined. The arc title finally earns itself.', image:'assets/comics/arc29/ch12-the-spy.png', xp:400, action:'🕶️ Classify the Spy'},
    {id:13, title:'What Do You Actually Do?', focus:'N confronts Sairen directly, having pieced together enough on her own. He doesn\'t insult her by denying it. "You\'re a spy." A pause. "Sometimes." Possibly the least reassuring answer imaginable.', image:'assets/comics/arc29/ch13-what-do-you-actually-do.png', xp:300, action:'❓ Ask What He Does'},
    {id:14, title:'Was I a Job?', focus:'The question that actually hurts N isn\'t "are you dangerous" — it\'s "Did you meet me because of San?" Sairen can\'t give her the clean answer she wants: he may have noticed her partly because of Fair Tide, may have known who she was beforehand, but what happened afterward wasn\'t entirely planned.', image:'assets/comics/arc29/ch14-was-i-a-job.png', xp:310, action:"💔 Ask \"Was I a Job?\""},
    {id:15, title:'Not Everything Was False', focus:'Sairen: "I lied about who I was." N waits. "I didn\'t lie every time I was with you." The distinction doesn\'t fix anything. It\'s still true.', image:'assets/comics/arc29/ch15-not-everything-was-false.png', xp:310, action:"🤏 Hear \"Not Everything Was False\""},
    {id:16, title:'Dependency', focus:"N suddenly recognizes how dependent she's become — living where he lives, eating what he provides, relying on his money, not even knowing exactly where he goes. This isn't the independent life she imagined walking out of Fair Tide. That frightens her more than his profession does.", image:'assets/comics/arc29/ch16-dependency.png', xp:310, action:'😨 Recognize the Dependency'},
    {id:17, title:'You Can Leave', focus:'Sairen doesn\'t imprison her — he offers money and tells her she can go. "You won\'t leave here with nothing." N recognizes the uncomfortable irony: San told her to earn independence; Sairen believes caring means she never suffers. Neither approach feels simple anymore.', image:'assets/comics/arc29/ch17-you-can-leave.png', xp:300, action:'🚪 Hear "You Can Leave"'},
    {id:18, title:'She Stays', focus:"N chooses not to leave — not because everything's forgiven, not because Sairen's proven trustworthy, and not because she's helpless. She stays because she has feelings for him, however messy, and she wants answers. That choice belongs to her.", image:'assets/comics/arc29/ch18-she-stays.png', xp:300, action:'🛑 Choose to Stay'},
    {id:19, title:'Sairen Comes to Fair Tide', focus:"Instead of San hunting him down, Sairen appears at Fair Tide voluntarily, with N beside him. Joy's security people take a real interest. Joel stays close to San.", image:'assets/comics/arc29/ch19-sairen-comes-to-fair-tide.png', xp:300, action:'⚓ Welcome Him to Fair Tide'},
    {id:20, title:'Captain and Spy', focus:"San and Sairen finally speak properly — no threats, no blade at his throat. San asks straightforward questions. He answers some, refuses others, and occasionally answers with a question of his own. San finds him rapidly, thoroughly annoying.", image:'assets/comics/arc29/ch20-captain-and-spy.png', xp:310, action:'🗣️ Sit Captain and Spy Down'},
    {id:21, title:'Why N?', focus:"San asks the question N already asked him. Sairen admits N's Fair Tide connection made her professionally interesting — then adds that continuing to live with her was never part of any assignment. San doesn't automatically believe that. She shouldn't.", image:'assets/comics/arc29/ch21-why-n.png', xp:320, action:'❓ Ask "Why N?"'},
    {id:22, title:"What He Won't Give Them", focus:"Fair Tide wants information about the Nameless. Sairen refuses to expose anyone whose identity he considers protected, even when cooperating would make his own position easier. Whatever else he is, he has lines — San just doesn't know if they align with hers.", image:'assets/comics/arc29/ch22-what-he-wont-give-them.png', xp:320, action:"🚫 Meet What He Won't Give"},
    {id:23, title:'No Place at Fair Tide', focus:"San doesn't recruit him, arrest him, or forbid N from seeing him — but she draws Fair Tide's own boundary plainly: ordinary visitor restrictions only, no Intelligence access, no Horizon records, no restricted routes, no exploiting N for information. Sairen accepts the terms. For now.", image:'assets/comics/arc29/ch23-no-place-at-fair-tide.png', xp:330, action:'📏 Set No Place at Fair Tide'},
    {id:24, title:'The Spy', focus:'Sairen and N leave together. Joel: "Trust him?" San: "No." A beat. "Her?" San watches N go. "Not yet." Elsewhere, N asks Sairen if that\'s even his real name. A tiny smile. "It\'s the one I\'m giving you." She groans, not sure if that\'s romantic, infuriating, ominous — or all three.', image:'assets/comics/arc29/ch24-the-spy.png', xp:380, action:'🕵️ Close the File on The Spy'}
  ];
  window.ARC29_CHAPTERS = ARC29_CHAPTERS;

  const ARC29_CHAPTER_SCENES = {
    1: "N wakes expecting the usual — an empty bed, no note, Sairen gone on whatever errand he never explains. She's braced for it enough times now that the bracing itself has become routine.<br><br>Instead there's the smell of something actually cooking, and Sairen at the small stove, entirely unremarkable about it, like a man who's made breakfast for someone else a hundred mornings running.<br><br>\"You're here,\" she says, more surprised than she means to sound.<br><br>\"Where else would I be?\" he asks, not quite answering the real question underneath hers.<br><br>N doesn't push it. She just sits down, and lets herself notice — quietly, a little uneasily — how much faster she's gotten used to this than she meant to.",
    2: 'The details accumulate slowly enough that N almost misses them individually.<br><br>He disappears for stretches with no explanation offered or expected. He slips between languages like changing shirts. Money arrives from somewhere she\'s never seen him actually earn. And depending on where they\'re going, something about him — accent, posture, the exact cut of his clothes — quietly rearranges itself into someone slightly different.<br><br>"What do you actually do?" she finally asks outright.<br><br>"Work," he says.<br><br>"What kind?"<br><br>"The kind where not asking is useful."<br><br>It should be a wholly unsatisfying answer. N finds herself irritated by it, and unable to stop turning it over anyway.',
    3: "The pattern surfaces first as a handful of oddly specific questions logged across several unrelated visitors — nothing sensitive touched, nothing stolen, no restricted record so much as glanced at.<br><br>But the questions themselves don't read like ordinary curiosity. Too precise. Too consistently aimed at the same handful of subjects, asked by people who otherwise have nothing in common with each other.<br><br>\"Someone's building a picture of us,\" Renn says, laying the pattern out. \"Carefully. Patiently. Nothing anyone could call an intrusion.\"<br><br>\"But an intrusion all the same,\" San says, and nobody in the room argues the point.",
    4: '"There\'s a man with N," the report says, and San\'s first reaction has nothing to do with intelligence work at all.<br><br>"Is she all right?"<br><br>She is. Extremely, visibly so, by every account reaching Fair Tide.<br><br>Joel, hearing the same report, arrives at a rather different question.<br><br>"Who\'s the guy?"<br><br>San doesn\'t have an answer yet. Neither of them treats it as an emergency — not yet, not with nothing more than "a man" and N looking, by every account, entirely pleased about it.',
    5: "N doesn't so much greet San as perform contentment at her, cheerfully, thoroughly, in a way that's clearly meant to be noticed.<br><br>She's doing well. She wants that understood. Fair Tide isn't the only place a person can build something, and she'd like San to see exactly how not-necessary Fair Tide turned out to be.<br><br>Sairen gets introduced simply — the man she's staying with, nothing more offered, nothing more asked. San is unfailingly polite. Joel is unfailingly polite too, while doing something considerably more attentive with his eyes than politeness strictly requires.<br><br>Sairen notices. Of course he notices — that's rather the point of him. Neither man says a single word about it out loud.",
    6: "What Fair Tide Intelligence expects, chasing down a name, is silence — an ordinary traveler who simply never generated much of a record. That would be easy enough to work with.<br><br>What they actually find is worse: records. Plenty of them. A merchant from western Veyren. A dockworker somewhere else entirely. Different ports, different occupations, every detail almost fitting together and never quite completing the picture.<br><br>\"Nobody accumulates this many near-misses by accident,\" Erynn says, laying the fragments side by side. \"Somebody built these. On purpose. More than one of them.\"<br><br>It's the first real confirmation that whatever \"the man with N\" turns out to be, ordinary was never actually on the table.",
    7: "Renn spends longer on the correlation than San expects any single answer to take, cross-referencing faces against names against ports against dates that shouldn't overlap and somehow do.<br><br>What comes back, eventually, is unambiguous. The same face. Multiple names. Multiple occupations, multiple supposed hometowns, laid out side by side like a stack of different people who all happen to look identical.<br><br>\"She's not living with a mysterious traveler,\" Renn says finally, setting the last piece down. \"She's living with someone who's actually, professionally trained to disappear whenever he needs to.\"<br><br>San sits with that a long moment before she says anything at all.",
    8: '"We have to tell her," someone says immediately, and San understands the impulse completely without agreeing to act on it yet.<br><br>"Tell her what, exactly?" San asks. "That her boyfriend has more than one name? We don\'t know what he actually is. Dangerous. Useful. Something in between. Walking in with accusations before we know which one of those is even close to true doesn\'t protect her. It just makes us the ones who blew up her life on a guess."<br><br>Joel backs the caution without needing convincing. "Get the facts first," he says. "Then decide what she needs to hear."<br><br>Nobody in the room is entirely comfortable with the wait. Nobody has a better plan either.',
    9: "Senedra takes the follow herself, quiet and careful, exactly the way she's always worked best.<br><br>She gets further than she probably should, for longer than feels safe — right up until the moment it becomes clear, all at once, that Sairen has known she was there the entire time.<br><br>He doesn't confront her. He simply keeps walking, at exactly the pace that lets her keep pace with him, right up until a turn she can't follow through — and then he's simply gone, without any visible effort at all.<br><br>\"He let me follow him,\" Senedra reports back, more unsettled than she expected to be. \"Right up until he decided I was done following.\"<br><br>Fair Tide Intelligence is genuinely good. Sairen is simply better at this specific thing than anyone they've ever tracked before.",
    10: "The lead looks solid going in — a contact, a location, a time, everything lining up neatly enough that nobody thinks to doubt it until they're already standing in front of entirely the wrong person.<br><br>Confused. Unaffiliated. Utterly bewildered as to why Fair Tide's people are suddenly so interested in him.<br><br>\"He planted it,\" Renn says afterward, equal parts frustrated and, unmistakably, a little impressed despite himself. \"That whole trail. On purpose. Just to see if we'd follow it.\"<br><br>\"Did we?\" San asks, already knowing the answer.<br><br>\"Thoroughly,\" Renn admits, sounding personally offended by his own competence at falling for it.",
    11: "The connection, when it finally surfaces, comes from an unrelated thread entirely — one of Sairen's several identities cross-references, faintly but unmistakably, against a known Nameless contact.<br><br>It's the first solid link anyone's found. It's also, San reminds the room before anyone gets ahead of themselves, nowhere near a complete answer.<br><br>\"Arc XXVII taught us that much, at least,\" she says. \"Member. Contractor. Informant. Infiltrator. Enemy of the network entirely. Those aren't the same thing, and this one connection doesn't tell us which of them he actually is.\"<br><br>Nobody argues. It's simply one more piece, in a file that's rapidly filling up with pieces and no clear picture yet.",
    12: "Fair Tide Intelligence finally has enough to put something concrete on paper, even if concrete mostly means admitting how much still isn't known.<br><br>SAIREN. True name: Unconfirmed. Occupation: Intelligence operative. Affiliations: Unknown / Nameless-associated. Threat level: Undetermined.<br><br>San reads it over more than once, the way she reads anything that finally earns its own name instead of just being \"the man with N.\"<br><br>\"The Spy,\" she says out loud, mostly to herself, and the phrase settles into place with an unpleasant kind of accuracy — not an insult, not yet an accusation. Just, finally, the plainest true thing anyone can currently say about him.",
    13: 'N doesn\'t need Fair Tide\'s file to get there — she\'s pieced together plenty of it herself, watching him closely enough for long enough.<br><br>"You\'re a spy," she says, flat, giving him no room to talk his way around it.<br><br>He doesn\'t take the room even though she\'s left a little.<br><br>"Sometimes," he says.<br><br>It isn\'t a denial. It also isn\'t remotely reassuring. N sits with the answer, turning over exactly how little comfort a single honest word can actually provide.',
    14: 'The question that actually costs her something isn\'t the obvious one.<br><br>"Did you meet me because of San?"<br><br>Sairen doesn\'t rush an answer, and doesn\'t manufacture a clean one either. He may have noticed her, at first, partly because of exactly who she used to know. He may have known who she was before he ever said a word to her.<br><br>But what happened afterward — the mornings, the staying, the parts that felt real — wasn\'t written down anywhere in advance.<br><br>"I don\'t have a simple answer for you," he admits. "I wish I did. It would be easier for both of us."<br><br>N isn\'t sure easier would have actually helped.',
    15: '"I lied about who I was," Sairen says, when the silence between them has stretched long enough that somebody has to say something true into it.<br><br>N waits, braced for the rest of it to make everything worse.<br><br>"I didn\'t lie every time I was with you."<br><br>It doesn\'t fix anything. It doesn\'t undo a single fabricated name or a single unexplained disappearance. N knows that, sitting with it.<br><br>She also can\'t quite make herself believe it\'s nothing. That\'s the part that actually unsettles her — not that he lied, but that some of it, apparently, really wasn\'t a lie at all.',
    16: "It arrives all at once, the way realizations sometimes do — N looks around the place she's been calling home and understands, properly, how little of it is actually hers.<br><br>She lives where he lives. She eats what he provides. Every gold piece she's spent since leaving Fair Tide traces back to money she didn't earn and doesn't fully understand the source of. She doesn't even know, most days, where he actually goes when he leaves.<br><br>This isn't the independent life she pictured, storming out of Fair Tide feeling powerful and unaccountable to anyone.<br><br>That thought frightens her considerably more than anything about his profession does.",
    17: '"You can leave," Sairen tells her, once she\'s said enough out loud that he clearly understands what\'s been building.<br><br>He doesn\'t lock a door. He doesn\'t argue. He offers her money — real, no strings attached as far as she can tell — and means it plainly.<br><br>"You won\'t leave here with nothing," he says.<br><br>N almost laughs at the shape of it, uncomfortable as the laugh would be. San told her, once, that she had to earn her own way, that nobody was going to smooth things over for her anymore. Sairen believes something close to the opposite — that caring about someone means making sure they never have to suffer for leaving.<br><br>Neither version feels like the whole truth anymore. She isn\'t sure either of them ever was.',
    18: "N doesn't leave.<br><br>Not because she's forgiven anything. Not because a single lie has been un-lied, or because Sairen's somehow proven himself trustworthy in the space of one conversation. And not, she tells herself firmly, because she has nowhere else to go — Sairen just handed her money enough to prove that's no longer true, if it ever fully was.<br><br>She stays because whatever she feels for him is real, messy as it is, and because she isn't finished wanting answers to everything he still won't give her outright.<br><br>It's her decision, made with her eyes at least partly open. That much, at least, is entirely hers.",
    19: "Nobody at Fair Tide expects him to simply arrive.<br><br>But there he is, walking up from the docks with N beside him, calm in a way that reads less like confidence and more like a man who's already decided how this conversation is going to go before it starts.<br><br>Joy's people are on him within moments, polite and thoroughly attentive at once. Joel doesn't leave San's side, watching Sairen the same way he's watched him from the very first report.<br><br>San meets them both at the gate herself. Whatever this turns out to be, she isn't going to have it happen anywhere she doesn't control the room.",
    20: 'The conversation, when it finally happens, is almost disappointingly civil.<br><br>No blade at his throat. No dramatic ultimatum. San asks plain questions, one after another, and gets a mix of real answers, flat refusals, and — more than she\'d like — questions handed straight back to her instead of anything resembling a response.<br><br>"Do you work for the Nameless?"<br><br>"Do you trust everyone who\'s ever helped you?"<br><br>San exhales slowly, already cataloguing exactly how irritating she\'s going to find this man by the end of the conversation. She\'s not wrong.',
    21: '"Why her?" San finally asks, the same question N already put to him herself. "Why N, specifically?"<br><br>Sairen doesn\'t dress it up. "Her connection to you made her professionally interesting. I won\'t pretend otherwise."<br><br>Something in San\'s expression shifts, sharp and immediate.<br><br>"But staying," he continues, before she can respond, "living with her the way I have — that was never part of any assignment. That was mine."<br><br>San doesn\'t take the claim at face value. She\'s not required to, and she doesn\'t pretend to herself that she does.',
    22: "The ask is straightforward enough: names, contacts, anything Fair Tide can use to actually understand the Nameless instead of guessing at their shape from the outside.<br><br>Sairen refuses. Not evasively — plainly, the same way he's refused a handful of other things already.<br><br>\"There are people whose identities I consider protected,\" he says. \"I won't hand them to you, even if refusing costs me something with you. That doesn't change based on how it's argued.\"<br><br>San doesn't like the answer. She recognizes it anyway, for what it actually reveals — whatever else this man turns out to be, he has real limits. She just has no way yet of knowing whether his limits point anywhere near the same direction as hers.",
    23: 'San lays out Fair Tide\'s terms plainly, with nothing left ambiguous for later argument.<br><br>He isn\'t recruited. He isn\'t arrested. N isn\'t forbidden from seeing him, because that was never San\'s decision to make for her.<br><br>But within Fair Tide\'s own walls, he\'s a visitor, exactly like any other — no Intelligence access, no Horizon records, no restricted routes, and absolutely no using N as a quiet channel into any of it.<br><br>"Those are the terms," San says. "Take them or don\'t."<br><br>Sairen considers her for a moment longer than strictly necessary, then nods. "For now," he says — leaving both of them fully aware of exactly how much weight sits on those two words.',
    24: 'San watches them go from the same gate she met them at, Joel steady beside her.<br><br>"Trust him?" Joel asks.<br><br>"No," San says, without needing to think about it.<br><br>A beat.<br><br>"Her?"<br><br>San watches N a moment longer, walking off next to a man with at least three names and an unknown number of reasons for any of them. "Not yet," she says.<br><br>Some distance away, N glances sideways at Sairen. "Is Sairen even your real name?"<br><br>He looks at her, something almost fond in it. "It\'s the one I\'m giving you."<br><br>N groans, long and theatrical, and doesn\'t get an answer any clearer than that — not sure, even now, whether what she just heard was romantic, infuriating, quietly ominous, or, worst of all, some uncomfortable measure of all three at once.'
  };
  window.ARC29_CHAPTER_SCENES = ARC29_CHAPTER_SCENES;

  window.arc29ObjectiveState = function(){
    if (!game.arc28Complete) return null;
    if (level() < 435) return null;
    game.comicProgress29 = game.comicProgress29 || {};
    for (const ch of ARC29_CHAPTERS) {
      if (!game.comicProgress29[ch.id]) return 'complete_arc29_chapter_' + ch.id;
    }
    return 'arc29_part1_complete_for_now';
  };

  window.markArc29ChapterRead = function(id){
    const so = window.arc29ObjectiveState();
    if (so !== ('complete_arc29_chapter_' + id)) return;
    game.comicProgress29 = game.comicProgress29 || {};
    game.comicProgress29[id] = true;
    // Matches every prior arc's own completion flag (arc27/arc28Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 24) game.arc29Complete = true;
    const ch = ARC29_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC29_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC29_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc29Splash = function(){
    const overlay = document.getElementById('arc29SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc29Splash = function(){
    const overlay = document.getElementById('arc29SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc29SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc29 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc29) oldRenderStoryForArc29();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc29Ready = window.arc29ObjectiveState() !== null;
    if (arc29Ready && !game.arc29SplashSeen && typeof window.__ctShowArc29Splash === 'function') {
      window.__ctShowArc29Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc29/arc29-cover-the-spy.png" alt="Arc XXIX — The Spy" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXIX</div><div class="story-act-title">The Spy</div>'+
      '<div class="story-act-tagline">A person can hide the truth without everything they show you being false.</div></div>';
    if (!arc29Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXIX Locked</div><div class="story-chapter-sub">'+
        (!game.arc28Complete ? 'Finish Arc XXVIII first.' : 'Reach Level 435 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc29ObjectiveState();
    ARC29_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress29 && game.comicProgress29[ch.id]);
      const ready = !done && so===('complete_arc29_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc29ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc29_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXIX chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
