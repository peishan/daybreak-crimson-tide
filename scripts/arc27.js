(function(){
  // -------------------------------------------------------------------
  // ARC XXVII — THE NAMELESS. Gated at arc26Complete + level 405,
  // continuing the established +15-per-arc ladder (XXIV:360, XXV:375,
  // XXVI:390, XXVII:405). Ch.24 sets game.arc27Complete = true, matching
  // every other arc's own finale flag.
  //
  // Per the outline this arc was built from: Arc XXIV showed the
  // Nameless were organized and widespread; Arc XXVI showed why
  // information and hidden influence matter. Arc XXVII is where Fair
  // Tide finally interacts with them directly — and the outline is
  // explicit that this must still NOT resolve them as simply evil.
  // Different Nameless cells behave differently (Ch.13-18: a helpful
  // stranger, a cell that withholds information to protect someone,
  // impostors the real Nameless themselves intervene against). The
  // arc's actual thesis lands in Ch.11: "Someone can help you without
  // earning your trust" — San accepts useful information without ever
  // accepting the organization itself.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. The Intelligence Network upgrade Ch.4, 12, 19,
  // and 23's own notes call for (analyst assignment, the CONFIRMED/
  // LIKELY/UNVERIFIED/CONTRADICTORY classification, the larger lead cap,
  // faster generation, and the "someone unidentified" hook seeding N)
  // lives in scripts/arc27-mechanics.js, same split used since Arc
  // XXIII — this arc explicitly upgrades Arc XXIV's existing Fair Tide
  // Intelligence system rather than introducing an unrelated one, per
  // the outline's own instruction.
  //
  // Deliberately NOT built, per the outline's own explicit restraint:
  // no Sairen, no infiltration/undercover-identity system. Fair Tide has
  // gotten better at gathering and analyzing information; it still has
  // nobody who can enter a closed network under another identity. That
  // gap stays open on purpose — the outline's own joke is that San and
  // Joel's own two kids solve it eventually, which is a joke for a much
  // later arc, not a system to half-build now.
  //
  // Ch.23 ("Someone We Haven't Met") deliberately does not introduce N.
  // No name, no silhouette, no confirmation — just an unresolved thread
  // in the Intelligence data, exactly matching Ch.23 of Arc XXIV's own
  // restraint ("N does not enter yet").
  //
  // XP escalates toward Ch.12 ("The First Agreement," the arc's actual
  // structural turning point and the Intelligence upgrade's own biggest
  // unlock) at 400, with Ch.24's finale bump (380) kept below it — the
  // same "one centerpiece, not two" convention used since Arc XX.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC27_CHAPTERS = [
    {id:1, title:"A Name That Isn't One", focus:"Fair Tide Intelligence receives information about one of Arc XXIV's unresolved incidents. The information is accurate — but its source identifies themselves only as Nameless.", image:'assets/comics/arc27/ch01-a-name-that-isnt-one.png', xp:260, action:'📡 Receive the Message'},
    {id:2, title:'No Signature', focus:"Renn and Erynn examine the message's delivery and find nothing about it that makes ordinary sense. Whoever sent it understands Fair Tide's own communication and security procedures remarkably well.", image:'assets/comics/arc27/ch02-no-signature.png', xp:270, action:'🔍 Examine the Delivery'},
    {id:3, title:'The Information Was True', focus:"Senedra verifies the tip in the field. It checks out completely — which raises a far more uncomfortable question than a lie would have. Why help Fair Tide at all?", image:'assets/comics/arc27/ch03-the-information-was-true.png', xp:280, action:'✅ Verify the Information'},
    {id:4, title:'People Without Records', focus:"Fair Tide Intelligence revisits everything gathered since Arc XXIV. Apparently unrelated, unidentified travelers start forming something — not identities. Patterns.", image:'assets/comics/arc27/ch04-people-without-records.png', xp:280, action:'🧩 Find the Pattern'},
    {id:5, title:"Don't Chase Shadows", focus:"Joel argues against sending anyone blindly after the Nameless. San agrees — Fair Tide will investigate what they actually do, rather than treating anonymity itself as a crime.", image:'assets/comics/arc27/ch05-dont-chase-shadows.png', xp:280, action:'🚫 Refuse to Chase Shadows'},
    {id:6, title:'An Invitation', focus:"A second communication arrives. This one requests a meeting.", image:'assets/comics/arc27/ch06-an-invitation.png', xp:290, action:'✉️ Read the Invitation'},
    {id:7, title:'Neutral Ground', focus:"San agrees to meet a Nameless representative away from Fair Tide. Joel goes with her. Obviously.", image:'assets/comics/arc27/ch07-neutral-ground.png', xp:290, action:'🤝 Meet on Neutral Ground'},
    {id:8, title:'Nobody Important', focus:'The representative won\'t give a real name, rank, or origin. Asked who they represent: "People who prefer not to be represented." Not particularly helpful.', image:'assets/comics/arc27/ch08-nobody-important.png', xp:290, action:'❓ Ask Who They Represent'},
    {id:9, title:'What They Know', focus:"The Nameless know considerably more about the Horizon routes than San expected — including things Fair Tide has deliberately kept restricted. That alarms Joel far more than any mask.", image:'assets/comics/arc27/ch09-what-they-know.png', xp:300, action:'📖 Learn What They Know'},
    {id:10, title:'What They Want', focus:"Surprisingly, they don't demand control of the Horizon Engine. They want information exchange — claiming some routes carry dangers Fair Tide doesn't fully understand yet.", image:'assets/comics/arc27/ch10-what-they-want.png', xp:300, action:'💱 Hear What They Want'},
    {id:11, title:"Useful Doesn't Mean Trusted", focus:"Their information proves genuinely valuable. San accepts the warning. She does not accept the organization behind it — establishing a principle that will matter for a long time: someone can help you without earning your trust.", image:'assets/comics/arc27/ch11-useful-doesnt-mean-trusted.png', xp:300, action:"⚖️ Accept the Warning, Not the Trust"},
    {id:12, title:'The First Agreement', focus:"San establishes an extremely limited information-sharing arrangement — no access to Fair Tide systems, no protected route coordinates, no automatic passage through Fair Tide. Information exchanged case by case, and nothing more.", image:'assets/comics/arc27/ch12-the-first-agreement.png', xp:400, action:'📜 Strike the First Agreement'},
    {id:13, title:'Not One Thing', focus:"Fair Tide encounters another Nameless group — noticeably different methods, attitudes, priorities from the first. The crew starts realizing \"the Nameless\" may not operate like a conventional faction at all.", image:'assets/comics/arc27/ch13-not-one-thing.png', xp:300, action:'👥 Meet Another Cell'},
    {id:14, title:'The Helpful Stranger', focus:"A Nameless operative helps a Fair Tide vessel in real trouble, then disappears before payment or recognition can be offered. That doesn't fit the crew's increasingly suspicious picture of them at all.", image:'assets/comics/arc27/ch14-the-helpful-stranger.png', xp:290, action:'🌊 Notice the Helpful Stranger'},
    {id:15, title:'The Closed Hand', focus:"Another Nameless cell flatly refuses information that could help resolve a route dispute — because giving it up would expose someone under their protection. San doesn't like it. She understands it.", image:'assets/comics/arc27/ch15-the-closed-hand.png', xp:300, action:'✊ Face the Closed Hand'},
    {id:16, title:'Who Do They Protect?', focus:"Mimi asks the question underneath everything: if the Nameless aren't primarily chasing wealth, territory, or political recognition, what are they actually protecting? Nobody has a satisfying answer yet.", image:'assets/comics/arc27/ch16-who-do-they-protect.png', xp:300, action:'❔ Ask Who They Protect'},
    {id:17, title:'Behind the Mask', focus:"At least some Nameless members had ordinary lives before disappearing into the network — merchants, travelers, refugees, researchers, perhaps former soldiers. The organization didn't create all of them. It gave them somewhere to disappear.", image:'assets/comics/arc27/ch17-behind-the-mask.png', xp:310, action:'🎭 See Behind the Mask'},
    {id:18, title:'A Dangerous Kindness', focus:"Fair Tide learns the Nameless helped someone escape an oppressive situation — which violated another world's own laws in the process. San is left with an uncomfortable question: does legality automatically make the other side right?", image:'assets/comics/arc27/ch18-a-dangerous-kindness.png', xp:310, action:'⚖️ Weigh a Dangerous Kindness'},
    {id:19, title:'No Headquarters', focus:"Renn finally accepts what's been frustrating Fair Tide Intelligence all along: there may be no central Nameless headquarters to find at all. Information moves through people, temporary locations, and trusted intermediaries — cut one connection, and the network simply routes around it.", image:'assets/comics/arc27/ch19-no-headquarters.png', xp:320, action:"🕸️ Accept There's No Headquarters"},
    {id:20, title:'The Ones Who Abuse the Name', focus:"Some people claim Nameless affiliation while committing ordinary crimes. The actual Nameless intervene against them. Apparently, even anonymity has rules — \"Nameless\" doesn't mean anyone wearing a hood.", image:'assets/comics/arc27/ch20-the-ones-who-abuse-the-name.png', xp:310, action:'🚨 Confront the Impostors'},
    {id:21, title:'Their Rules', focus:"Fair Tide learns fragments of the network's own internal principles — protect identities, don't casually expose protected people, information carries responsibility, membership doesn't erase consequences. Some Nameless clearly interpret those principles more ethically than others.", image:'assets/comics/arc27/ch21-their-rules.png', xp:310, action:'📋 Learn Their Rules'},
    {id:22, title:"San's Boundary", focus:"The Nameless offer Fair Tide a closer relationship. San refuses — for now. Fair Tide will cooperate when interests align, but won't become dependent on a network it can't properly understand. Arc XXVI already taught her that lesson once.", image:'assets/comics/arc27/ch22-sans-boundary.png', xp:320, action:"🛑 Hold San's Boundary"},
    {id:23, title:'Someone We Haven\'t Met', focus:"Among the intelligence gathered this arc is evidence of another person connected somehow to Nameless activity. No introduction. No dramatic reveal. Just an unresolved thread, left exactly that way.", image:'assets/comics/arc27/ch23-someone-we-havent-met.png', xp:330, action:'❓ Notice Someone Unmet'},
    {id:24, title:'The Nameless', focus:'San reviews Fair Tide Intelligence\'s new classification — considerably more information now, and considerably more uncertainty. Joel: "So are they friends?" San: "No." "Enemies?" San considers it. "Not yet." Mimi: "That\'s not very reassuring." San: "It\'s not supposed to be."', image:'assets/comics/arc27/ch24-the-nameless.png', xp:380, action:'🌑 Classify the Nameless'}
  ];
  window.ARC27_CHAPTERS = ARC27_CHAPTERS;

  const ARC27_CHAPTER_SCENES = {
    1: "The report lands on Fair Tide Intelligence's own desk the way a hundred smaller ones have before it — except this one closes an incident from Arc XXIV that's sat unresolved for a long time, and closes it with real, checkable specifics.<br><br>San reads the source line twice, certain she's misreading it.<br><br>Nameless.<br><br>Not a name withheld out of caution. Not an intermediary too nervous to sign anything. Just that word, offered plainly, as if it were an ordinary identity rather than the absence of one.<br><br>\"They're not hiding that they're hiding,\" Erynn says, looking over San's shoulder. \"That's a choice, not an accident.\"<br><br>San sets the report down carefully, like it might still be listening.",
    2: "Renn and Erynn take the message apart piece by piece, looking for the ordinary explanation that would make this simple. Neither of them finds one.<br><br>The delivery method matches exactly how Fair Tide's own Intelligence network passes information internally — a route neither of them has ever described to an outsider, let alone one this precisely replicated.<br><br>\"Either someone inside Fair Tide is talking,\" Renn says slowly, \"or whoever sent this understands us better than that would require.\"<br><br>\"Which is worse?\" San asks.<br><br>\"Honestly? I don't know yet,\" Renn admits. \"Both possibilities are uncomfortable in completely different ways.\"",
    3: "Senedra doesn't take anyone's word for it — she goes and checks the information against the actual ground truth herself, quietly, the way she's always worked best.<br><br>It holds up completely. Every specific detail the message offered turns out to be exactly true.<br><br>She reports back with something closer to unease than relief.<br><br>\"If it had been false, we'd know what we were dealing with,\" she says. \"A trick. A distraction. Something to react to. This is worse. This is someone spending real effort to actually help us, and not asking for anything back yet.\"<br><br>\"Yet,\" San repeats.<br><br>\"Yet,\" Senedra agrees.",
    4: "Fair Tide Intelligence goes back through everything gathered since Arc XXIV's first uneasy sightings, looking at it all together instead of incident by incident.<br><br>No single name repeats. No single face. But laid out side by side, something else starts to surface — the same unhurried patience, the same precise avoidance of anything that would leave a trace, the same odd selectivity about which situations get quiet help and which get left alone entirely.<br><br>\"We're never going to get names out of this,\" Renn says, staring at the accumulated reports. \"But we might actually get a shape.\"<br><br>\"A shape's a start,\" San says. It's more than they've had until now.",
    5: 'Joel says what several people are already thinking, before anyone acts on the impulse to actually do it.<br><br>"We are not sending people out to hunt down anyone just for being careful about their own name," he says. "That\'s not justice. That\'s just us deciding secrecy itself is the crime."<br><br>San doesn\'t need much convincing. "Agreed. We investigate what they actually DO. Not who they refuse to say they are."<br><br>It\'s a small distinction on paper. In practice, it changes almost everything about how Fair Tide Intelligence spends its attention from this point on — actions, not anonymity, are what earn a second look.',
    6: "The second message arrives with the same unnerving fluency as the first, except this one isn't information at all.<br><br>It's a request. A place, a time, and one plain line beneath both of them: a representative is willing to meet, if Fair Tide is willing to come.<br><br>San reads it standing at the Harbour Office window, Joel close enough to read it over her shoulder without either of them saying anything for a long moment.<br><br>\"Do we go?\" Joel asks eventually.<br><br>\"We already decided we're investigating what they do,\" San says. \"This is what they do. So yes.\"",
    7: "The meeting place is neutral in every sense that matters — no Fair Tide flag, no Nameless mark, just an unremarkable stretch of coastline neither side has any particular claim to.<br><br>San goes. Joel goes with her, which was never actually a question either of them needed to ask out loud.<br><br>\"You didn't have to come,\" San says anyway, mostly out of habit.<br><br>\"I know,\" Joel says, already scanning the treeline out of old, practiced caution. \"I'm still coming.\"<br><br>San doesn't argue. She'd have been more worried if he hadn't.",
    8: '"The representative is waiting when they arrive — unremarkable in every visible way, plainly dressed, giving away nothing in posture or manner that would mark them as anything unusual at all.<br><br>San doesn\'t waste time on pleasantries. "Who do you represent?"<br><br>"People who prefer not to be represented," the stranger says, entirely pleasant about it.<br><br>"That\'s not an answer."<br><br>"It\'s the only honest one I have," they say. "You\'re welcome to be frustrated by it. I mostly am too, some days."<br><br>San decides, somewhere in that exchange, that this conversation is going to require more patience than she budgeted for.',
    9: "What follows isn't a negotiation so much as a demonstration — the representative laying out details about the Horizon routes with a casualness that unsettles San far more than any threat would have.<br><br>Some of it matches records Fair Tide has never shared with anyone outside its own Council. Deliberately restricted information, spoken aloud like common knowledge.<br><br>Joel goes rigid beside her. \"How do you know that?\"<br><br>\"The same way we know a great many things,\" the representative says, unbothered. \"Carefully, and from more directions than you'd expect.\"<br><br>San files the fear away to deal with later. Right now, she needs to know what this is actually for.",
    10: '"So what do you actually want?" San asks, done with circling the point.<br><br>Not the Horizon Engine itself, as it turns out — no demand for control, no request for access, nothing close to what San braced herself to refuse.<br><br>"Information," the representative says. "An exchange, not a surrender. Some of your routes carry dangers you don\'t fully understand yet. We\'d rather tell you than watch you find out the hard way."<br><br>"And in return?"<br><br>"The same, when we need it. Not before."<br><br>It\'s a strange kind of relief, learning the price isn\'t what she feared. It doesn\'t make her trust the currency any more than she did five minutes ago.',
    11: "The warning turns out to be real, specific, and genuinely useful — a route Fair Tide had scheduled for exactly the kind of casual use that the Nameless's information now makes clear would have gone badly.<br><br>San accepts it without hesitation. She adjusts the schedule, thanks the source in her own head if not out loud, and moves on.<br><br>What she doesn't do is soften anything else about her position.<br><br>\"Good information doesn't buy an organization my trust,\" she tells Joel afterward, turning the whole exchange over. \"It just means I'll listen the next time they say something. That's all it means. That's ALL it's ever going to mean, until they earn considerably more than one true thing.\"",
    12: "What San finally puts on paper is narrower than anything the representative probably hoped for, and exactly as wide as she's willing to go.<br><br>No access to Fair Tide's own systems. No protected route coordinates, under any circumstance. No automatic passage through Fair Tide's harbour for anyone claiming the association. Information exchanged case by case, verified independently wherever Fair Tide can manage it, and nothing assumed on either side beyond that single narrow channel.<br><br>\"This isn't trust,\" she tells the Council afterward, plainly, so nobody mistakes it for more than it is. \"This is a door we can close as easily as we opened it. I intend to remember that, every single time we use it.\"",
    13: "The second Nameless group Fair Tide encounters doesn't move, speak, or operate anything like the first.<br><br>Where the representative at the coastline was measured and almost courteous, this cell is blunt, fast, and visibly uninterested in explaining themselves to anyone. Same quiet insistence on anonymity. Nothing else matches.<br><br>\"These aren't the same people,\" Senedra says, watching them go. \"Not just different individuals — different way of doing the entire thing.\"<br><br>\"So what exactly are we dealing with?\" Joel asks.<br><br>Nobody has a clean answer. For the first time, \"the Nameless\" stops sounding like one organization and starts sounding like a word covering something considerably messier.",
    14: "The Fair Tide vessel is taking on water faster than its crew can manage alone when help arrives from nowhere anyone can explain — quick, competent, exactly what the situation needs and not a moment more.<br><br>By the time the crew thinks to properly thank whoever helped them, there's no one left to thank. No name given. No reward accepted. No acknowledgment wanted at all.<br><br>\"That doesn't fit,\" San says, hearing the report later, turning it over against everything Ch.13 just complicated. \"That's not caution. That's not strategy. That's just... helping, and leaving before it costs anyone anything to have helped.\"<br><br>It sits uneasily next to everything else she thinks she's learned about them.",
    15: "This cell, when Fair Tide reaches out for information that would resolve a genuinely thorny route dispute, simply says no.<br><br>Not evasively. Not with the representative's careful non-answers. Just a flat, unambiguous refusal, with a reason attached that San wasn't expecting: giving up what Fair Tide's asking for would expose someone the Nameless are actively protecting.<br><br>San doesn't like the answer. It costs Fair Tide a resolution it genuinely needed.<br><br>But she understands it completely, in a way that unsettles her more than an outright lie would have — because it's exactly the kind of choice she'd make herself, for someone she was responsible for.",
    16: "\"So what are they actually protecting?\" Mimi asks, cutting straight to the question everyone else has been circling without quite landing on.<br><br>Not wealth — nothing about any encounter so far has looked like profit-seeking. Not territory — they hold no ground anyone can point to. Not political recognition — they've twice now refused every opportunity to be acknowledged at all.<br><br>\"People, maybe,\" Erynn offers slowly. \"Just... people. Not a cause. Not an ideology. Actual specific people who need somewhere to not be found.\"<br><br>Nobody in the room has a better theory. It's the closest thing to an answer Fair Tide has managed yet, and it still isn't a satisfying one.",
    17: "The detail that finally surfaces, pieced together from fragments across several separate encounters, reframes everything at once.<br><br>Some of the people wearing the Nameless's anonymity weren't born into any network at all. A merchant who vanished from her old life rather than face a debt that would have ruined worse than her finances. A traveler nobody official ever tracked past a certain border. A refugee. A researcher who asked one question too many of the wrong institution. Possibly, in at least one case, a soldier who simply stopped being findable.<br><br>\"The organization didn't make all of them,\" Renn says slowly, putting it together out loud. \"It just gave them somewhere to actually disappear to.\"<br><br>San sits with that longer than she expects to need to.",
    18: "The specifics, once Fair Tide finally has them, are harder to sit with than any of the previous ambiguity.<br><br>The Nameless helped someone escape a situation that was, by any reasonable account, genuinely oppressive — and did it in a way that broke another world's own established law to accomplish.<br><br>\"So which matters more,\" San asks the Council, not rhetorically, \"the law they broke, or the person they got out?\"<br><br>Nobody rushes to answer her. It isn't a question with a clean side to stand on, and San doesn't pretend otherwise — she just sits with the discomfort of an answer that refuses to resolve into something simple, and moves forward without one.",
    19: "Renn finally says out loud what the accumulated data has been suggesting for a while, and clearly doesn't enjoy admitting it.<br><br>\"I don't think there's a headquarters,\" he says. \"I've been looking for one since Arc XXIV. Every lead that should point toward a center just... routes somewhere else instead. People. Temporary places. Messages passed hand to hand through someone who passes it to someone else.\"<br><br>\"So there's nothing to actually find,\" San says.<br><br>\"There's plenty to find,\" Renn corrects. \"Just nothing to CUT. You sever one connection, the whole thing just reroutes around the gap like it was never there.\"",
    20: "The people claiming Nameless affiliation this time aren't remotely interested in protecting anyone — they're using the name as cover for something considerably more ordinary and considerably less defensible.<br><br>What genuinely surprises Fair Tide is what happens next: the actual Nameless intervene, swiftly and without any request from anyone at Fair Tide to do so.<br><br>\"They policed their own name,\" Senedra reports back, still faintly disbelieving. \"Nobody asked them to. They just did it.\"<br><br>\"So there ARE rules,\" San says slowly. \"Somewhere under all of it. Real ones, that somebody's actually willing to enforce.\"",
    21: "What Fair Tide finally pieces together isn't a full picture — nowhere close. But it's enough fragments, gathered across enough separate encounters, to sketch the edges of something.<br><br>Protect identities, always, above almost everything else. Don't expose someone under protection casually, whatever the cost of not doing so. Information carries responsibility — knowing something obligates you, it doesn't just entitle you. And membership in the network doesn't erase whatever consequences a person's actions would otherwise carry.<br><br>\"They don't all follow these the same way,\" Erynn notes, comparing encounters. \"Some of them barely follow them at all.\"<br><br>\"But enough of them do,\" San says, \"that the rules are clearly real, even where the practice isn't.\"",
    22: "The offer, when it finally comes plainly instead of implied, is for something closer and more permanent than the narrow arrangement San already agreed to — deeper cooperation, more consistent contact, something that would make the Nameless considerably more useful to Fair Tide on an ongoing basis.<br><br>San turns it down.<br><br>\"Not because I doubt it would help,\" she tells the representative, when they ask her to reconsider. \"Because I still don't understand you well enough to depend on you. I just spent an entire arc learning what it costs to lean on people I can't fully see the shape of. I'm not doing that again on purpose, not yet.\"<br><br>The representative doesn't argue. They simply note, without any particular emotion attached to it, that the offer will still be there later.",
    23: "Buried in one of Fair Tide Intelligence's more routine reports, easy to miss entirely, is a single loose thread that doesn't connect to anything else the crew has gathered this arc.<br><br>A name-shaped absence, referenced once, in passing, by someone who clearly assumed whoever was listening would already know who they meant.<br><br>Nobody at Fair Tide does.<br><br>Renn flags it, mostly out of habit, and files it without much ceremony — one more unresolved connection among dozens the Nameless have left scattered across this arc. There's no reveal here. No name attached yet. Just a thread, quietly waiting for something later to pick it back up.",
    24: 'San spreads Fair Tide Intelligence\'s updated file across the table that evening — considerably thicker than it was at the start of the arc, and somehow less certain in every way that matters.<br><br>Where it once read simply NAMELESS — UNKNOWN ORGANIZATION, it now holds encounters, contradictions, at least two visibly different operating cultures, a set of half-understood internal rules, and exactly zero real names.<br><br>Joel reads over her shoulder. "So are they friends?"<br><br>"No," San says.<br><br>"Enemies?"<br><br>She actually considers that one, longer than the first. "Not yet."<br><br>Mimi, passing by, catches just enough of it to comment. "That\'s not very reassuring."<br><br>"It\'s not supposed to be," San says.<br><br>She closes the file without sorting it into either pile. Some things, she\'s learned this arc, don\'t belong in a pile at all yet — they just have to stay open, watched, and unresolved, for exactly as long as they need to.'
  };
  window.ARC27_CHAPTER_SCENES = ARC27_CHAPTER_SCENES;

  window.arc27ObjectiveState = function(){
    if (!game.arc26Complete) return null;
    if (level() < 405) return null;
    game.comicProgress27 = game.comicProgress27 || {};
    for (const ch of ARC27_CHAPTERS) {
      if (!game.comicProgress27[ch.id]) return 'complete_arc27_chapter_' + ch.id;
    }
    return 'arc27_part1_complete_for_now';
  };

  window.markArc27ChapterRead = function(id){
    const so = window.arc27ObjectiveState();
    if (so !== ('complete_arc27_chapter_' + id)) return;
    game.comicProgress27 = game.comicProgress27 || {};
    game.comicProgress27[id] = true;
    // Matches every prior arc's own completion flag (arc25/arc26Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 24) game.arc27Complete = true;
    const ch = ARC27_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC27_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC27_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc27Splash = function(){
    const overlay = document.getElementById('arc27SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc27Splash = function(){
    const overlay = document.getElementById('arc27SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc27SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc27 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc27) oldRenderStoryForArc27();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc27Ready = window.arc27ObjectiveState() !== null;
    if (arc27Ready && !game.arc27SplashSeen && typeof window.__ctShowArc27Splash === 'function') {
      window.__ctShowArc27Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc27/arc27-cover-the-nameless.png" alt="Arc XXVII — The Nameless" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXVII</div><div class="story-act-title">The Nameless</div>'+
      '<div class="story-act-tagline">The enemy isn\'t always the person standing in front of you.</div></div>';
    if (!arc27Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXVII Locked</div><div class="story-chapter-sub">'+
        (!game.arc26Complete ? 'Finish Arc XXVI first.' : 'Reach Level 405 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc27ObjectiveState();
    ARC27_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress27 && game.comicProgress27[ch.id]);
      const ready = !done && so===('complete_arc27_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = 
          '<button class="btn btn-small btn-success" onclick="markArc27ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc27_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXVII chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
