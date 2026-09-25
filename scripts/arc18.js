(function(){
  // -------------------------------------------------------------------
  // ARC XVIII — THE ROUTES OTHERS WANT. Now fully wired, Chapters 1-25
  // — Part I ("Someone Is Watching"), Part II ("Everybody Wants a
  // Door"), Part III ("Fair Tide Has Something to Protect"), Part IV
  // ("Who Gets to Cross?"), and Part V ("The Routes Belong to No One").
  // Gated at arc17Complete + level 270, continuing the established
  // +15-per-arc ladder (XV:225, XVI:240, XVII:255, XVIII:270). Ch.25
  // sets game.arc18Complete = true, matching every other arc's own
  // finale flag.
  //
  // Ch.22 ("The Nameless Question") is the deliberate first appearance
  // of the Nameless as a faction — per the outline, kept observational
  // rather than antagonistic here on purpose, so they aren't
  // prematurely cast as villains this early.
  //
  // Per request, this file only wires the chapters themselves — it does
  // NOT register arc18ObjectiveState with the main objective-chain
  // aggregator (arc5-and-objective-chain.js), and does not touch any
  // other game hookup. That's being handled separately, same as it was
  // for Arc XVII. Chapters are fully playable end-to-end via the Story
  // screen regardless; this only affects whether the top-level "what's
  // next" tracker surfaces them.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (ch0N-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC18_CHAPTERS = [
    {id:1, title:'The Route We Found', focus:"Renn, Erynn and Mimi begin organizing what they learned at the Archive — and discover their latest Horizon Engine activation was detected.", image:'assets/comics/arc18/ch01-the-route-we-found.png', xp:300, action:'🗺️ Organize the Findings'},
    {id:2, title:"A Ship That Shouldn't Be There", focus:"The crew encounters another vessel using a route that shouldn't be known outside the Archive. Nobody attacks — they simply observe the Crimson Tide and leave. San is immediately suspicious.", image:'assets/comics/arc18/ch02-a-ship-that-shouldnt-be-there.png', xp:300, action:'👀 Watch Them Back'},
    {id:3, title:'Someone Asked About Us', focus:"Back at Fair Tide, merchants, travellers and officials have begun asking who built the Horizon Engine, where the Crimson Tide travels, and why Fair Tide has unusual materials. The secret is already leaking.", image:'assets/comics/arc18/ch03-someone-asked-about-us.png', xp:290, action:"❓ Find Out Who's Asking"},
    {id:4, title:'The First Offer', focus:"A powerful merchant organization offers to fund further Horizon Engine development in exchange for controlled access to the routes. San doesn't immediately reject them — she wants to understand what they're actually offering.", image:'assets/comics/arc18/ch04-the-first-offer.png', xp:300, action:'🤝 Hear Them Out'},
    {id:5, title:'The Price of Help', focus:"Aisyah discovers the funding isn't really free — the contract would give the organization preferential access to routes, materials, discoveries and trade. The Engine would technically stay Fair Tide's property, but its use would no longer be entirely theirs.", image:'assets/comics/arc18/ch05-the-price-of-help.png', xp:320, action:'📋 Read the Fine Print'},
    {id:6, title:'More Than One Interested Party', focus:"The merchants aren't the only ones interested. Merchants want trade, scholars want knowledge, governments want strategic access, explorers want new worlds, collectors want rare materials — and some people simply want to know what's on the other side.", image:'assets/comics/arc18/ch06-more-than-one-interested-party.png', xp:300, action:"🌐 See Who's Interested"},
    {id:7, title:"The Scholar's Proposal", focus:"A scholarly institution offers cooperation, not ownership — access to the Archive and permission to study the routes. Erynn is tempted, Renn is interested, Mimi is uneasy.", image:'assets/comics/arc18/ch07-the-scholars-proposal.png', xp:300, action:'📚 Hear the Scholars Out'},
    {id:8, title:"The Government's Question", focus:'A Veyren authority approaches San directly: "What happens if someone else builds one?" For the first time, San has to consider that the Horizon Engine may eventually become replicable technology.', image:'assets/comics/arc18/ch08-the-governments-question.png', xp:310, action:'🏛️ Answer the Question'},
    {id:9, title:'A Road Is Not a Weapon', focus:"Joel points out that the crew has been asking who can use the routes, but not what happens when someone uses them badly. The crew begins establishing basic safety principles.", image:'assets/comics/arc18/ch09-a-road-is-not-a-weapon.png', xp:300, action:'⚠️ Think About Safety'},
    {id:10, title:'The Route Map', focus:"Renn and Erynn reconstruct part of the Archive's old network. The ancient routes weren't random portals — they were organized corridors. Some worlds were connected, others deliberately isolated, some passages sealed.", image:'assets/comics/arc18/ch10-the-route-map.png', xp:300, action:'🗺️ Reconstruct the Map'},
    {id:11, title:'The Sealed Door', focus:"Mimi detects something strange — one of the sealed routes is still active. Something, or someone, has been trying to open it. The crew doesn't know who.", image:'assets/comics/arc18/ch11-the-sealed-door.png', xp:310, action:'🔒 Investigate the Sealed Door'},
    {id:12, title:'The People Who Came Before', focus:"Erynn connects the sealed route to the older Farseer records. The Farseers were part of a system that once helped manage boundaries between worlds — and that system eventually failed.", image:'assets/comics/arc18/ch12-the-people-who-came-before.png', xp:320, action:'📜 Trace It to the Farseers'},
    {id:13, title:'The First Threat', focus:'Fair Tide receives an unexpected visit from people attempting to inspect the Horizon Engine, claiming authority. San refuses them. No battle is necessary — it\'s simply the first time San has to say "No. This belongs to us."', image:'assets/comics/arc18/ch13-the-first-threat.png', xp:300, action:'🚫 Refuse Them'},
    {id:14, title:'What Belongs to Us', focus:"San doesn't want Fair Tide to become another empire, but she also doesn't want outsiders deciding what Fair Tide can do. Joel asks the uncomfortable question: \"If we don't control it, who will?\"", image:'assets/comics/arc18/ch14-what-belongs-to-us.png', xp:300, action:'💬 Talk It Through'},
    {id:15, title:'The Fair Tide Council', focus:"San brings the wider community into the discussion — Aisyah on practical concerns, Joel on security, Renn on technology, Erynn on history, Mimi on what she can and cannot see, Dr. AA on humanitarian risk, Brada on logistics, and Fair Tide's own people with their own concerns.", image:'assets/comics/arc18/ch15-the-fair-tide-council.png', xp:310, action:'🏛️ Call the Council'},
    {id:16, title:'The Rules We Choose', focus:"The crew begins drafting principles for Horizon Engine use — no forced access, no extraction without permission, no opening unstable passages, no unjustified military use, no ownership over other worlds. This is the Horizon Charter. It isn't perfect, but it's theirs.", image:'assets/comics/arc18/ch16-the-rules-we-choose.png', xp:320, action:'📜 Draft the Rules'},
    {id:17, title:'Not Everyone Agrees', focus:'The outside factions react — some accept the rules, others don\'t. One group argues: "You discovered the routes. You don\'t own them." San agrees with the principle, but responds: "Neither do you." That\'s the heart of the arc.', image:'assets/comics/arc18/ch17-not-everyone-agrees.png', xp:300, action:'⚖️ Hold the Line'},
    {id:18, title:'The Road Becomes a Battlefield', focus:"A conflict breaks out over access to one of the known routes. The Crimson Tide isn't directly responsible, but is forced to intervene because their technology is being used as leverage — without turning Fair Tide into a military power.", image:'assets/comics/arc18/ch18-the-road-becomes-a-battlefield.png', xp:330, action:'⚔️ Step In'},
    {id:19, title:'The First Agreement', focus:"San proposes cooperative access instead of giving one faction control — different groups contribute knowledge, supplies, navigation, protection, medical assistance, cultural liaison. Nobody receives ownership of the routes.", image:'assets/comics/arc18/ch19-the-first-agreement.png', xp:310, action:'🤝 Propose Something Different'},
    {id:20, title:'The World on the Other Side', focus:"The crew takes representatives from several groups to a world they already know, as a practical demonstration that a world isn't a resource. The lessons from Arcs XIII-XVII finally start coming together.", image:'assets/comics/arc18/ch20-the-world-on-the-other-side.png', xp:310, action:'🌍 Show Them the World'},
    {id:21, title:'What We Almost Became', focus:'San privately realizes how easily Fair Tide could have become the people who discovered the routes, then controlled them, then decided who was allowed to travel. Joel: "We haven\'t become that." San: "Not yet." Joel: "Then don\'t."', image:'assets/comics/arc18/ch21-what-we-almost-became.png', xp:320, action:'💭 Sit With It'},
    {id:22, title:'The Nameless Question', focus:"The crew discovers evidence that the Nameless have been observing the entire dispute — no demands, no attempt to control the routes, just watching. Now they know Fair Tide has access to something extremely valuable.", image:'assets/comics/arc18/ch22-the-nameless-question.png', xp:330, action:"👁️ Notice Who's Watching"},
    {id:23, title:'The Horizon Charter', focus:"Fair Tide formally establishes its rules for inter-world travel. The Horizon Engine remains under Fair Tide's protection. Access is based on trust, cooperation and responsibility — not ownership.", image:'assets/comics/arc18/ch23-the-horizon-charter.png', xp:320, action:'📜 Establish the Charter'},
    {id:24, title:'The Road Ahead', focus:"The outside factions begin adapting — some cooperate, some remain unhappy, some simply wait. The crew realizes this isn't a problem that can be solved once; every new world may create another dispute.", image:'assets/comics/arc18/ch24-the-road-ahead.png', xp:300, action:'🛤️ Watch the Roads Ahead'},
    {id:25, title:'The Routes Others Want', focus:'San, at the Horizon Engine: "We found the road." Joel: "And now everyone wants to use it." San: "Then we\'d better make sure we remember why we opened it." The Crimson Tide prepares to leave — not to conquer or claim, but to meet whoever is on the other side.', image:'assets/comics/arc18/ch25-the-routes-others-want.png', xp:560, action:'🚪 Open the Door'}
  ];
  window.ARC18_CHAPTERS = ARC18_CHAPTERS;

  const ARC18_CHAPTER_SCENES = {
    1: "The Crimson Tide comes back from the Archive with more than memories — pages of notes, half of them in Renn's hand, half in Erynn's, cross-referencing routes neither of them fully understands yet.<br><br>Mimi's the one sorting through the newest readings when she goes quiet. Their last Horizon Engine activation — the one that got them home — didn't go unnoticed. Something, somewhere, logged it.<br><br>\"Logged how?\" San asks.<br><br>\"That's what I'm trying to work out,\" Mimi says. \"But it wasn't nothing. Someone, somewhere, knows we were there.\"",
    2: "They spot the other vessel before it spots them — or so San assumes, right up until it becomes clear the ship has already been watching for a while.<br><br>It's running a route that has no business being known outside the Archive. Nobody trained the people on that ship. Nobody gave them the maps Renn spent weeks piecing together.<br><br>Nothing happens. No hail, no weapons, no approach. The ship simply holds position long enough to be unmistakably observed, and then turns away.<br><br>San doesn't relax once it's gone. If anything, watching it leave unsettles her more than an attack would have. An attack, at least, she'd understand.",
    3: "It starts as gossip Aisyah overhears at the docks and almost dismisses. Then Zaki hears a version of the same questions from a different trader entirely. Then a Fair Tide official mentions, almost in passing, that someone's been asking after them by name.<br><br>Who built the Horizon Engine. Where the Crimson Tide actually travels. Why Fair Tide keeps turning up materials nobody local can explain.<br><br>None of it is one conversation. That's what worries San most. It's a pattern, showing up in too many places at once for coincidence.<br><br>\"We didn't tell anyone,\" Joel says.<br><br>\"We didn't have to,\" San says. \"It's already out.\"",
    4: "The merchant organization doesn't send a threat. They send a proposal, delivered politely, by someone who clearly does this for a living.<br><br>They want to fund the Horizon Engine's continued development — real funding, the kind that would solve problems San has been patching around for months. In exchange, they want controlled access to the routes it opens.<br><br>It's reasonable, on its surface. Reasonable enough that San doesn't say no on the spot, which surprises Joel more than the offer itself did.<br><br>\"You're actually considering it,\" he says.<br><br>\"I'm considering what they're actually offering,\" San says. \"Those aren't the same thing yet.\"",
    5: "Aisyah reads contracts the way Renn reads old machinery — for the parts nobody bothered to explain out loud.<br><br>The funding isn't free, and it was never going to be. Stripped of its careful language, the agreement would hand the organization preferential access to routes, to materials, to whatever the crew discovers next, to trade opportunities before anyone else even hears about them.<br><br>On paper, the Horizon Engine stays exactly where it's always been — Fair Tide's property, San's project, nobody else's name on it.<br><br>In practice, Aisyah tells her, that's not quite true.<br><br>\"They're not asking to own it,\" she says. \"They're asking to be first in line for everything it touches. That's not the same as owning it. It's just... most of the way there.\"",
    6: "The merchants, it turns out, were never going to be the only ones.<br><br>Word travels fast once a secret this size starts leaking, and by the time Aisyah finishes counting, there isn't just one interested party — there are several, each wanting something different. Merchants want trade. Scholars want knowledge. A Veyren authority wants to know what this means for the balance of power. Explorers just want somewhere new to go. Collectors want whatever rare materials might come back through the door.<br><br>And underneath all of it, quieter than the rest, there are simply people who want to know what's on the other side. Not to use it. Just to know.<br><br>San counts the list twice, and doesn't like how long it's gotten.",
    7: "The scholarly institution's offer arrives differently than the merchants' did — no funding, no contract full of careful language, just a request. Access to the Archive. Permission to study the routes, properly, the way Erynn's own tradition once did before it lost most of what it started with.<br><br>Erynn wants to say yes before San's finished reading the proposal.<br><br>Renn's interested too, in the way Renn gets interested in anything with real data behind it.<br><br>Mimi's the one who doesn't relax. \"They're not asking for ownership,\" she says slowly. \"That's what makes me nervous. I can't tell what they actually want yet.\"",
    8: "The Veyren authority doesn't come with demands. She comes with one question, and asks it plainly.<br><br>\"What happens if someone else builds one?\"<br><br>San doesn't have an answer ready, and that's the part that stays with her afterward. She's been thinking about the Horizon Engine as something singular — hers, Fair Tide's, built through years of Renn's work and no small amount of luck. She hasn't seriously considered what happens the day it isn't singular anymore.<br><br>Because now that the secret's out, someone eventually will build one. It's only a matter of who, and how soon.",
    9: "Joel's the one who says the thing San's been circling without quite landing on.<br><br>\"You keep asking who gets to use the routes,\" he says. \"That's not the only question. What happens when someone uses them badly?\"<br><br>It's a distinction that reframes the whole problem. Access isn't the only risk. Misuse is a separate one, and right now nothing — no rule, no agreement, nothing written down anywhere — actually addresses it.<br><br>It's Joel and Zaki, of all people, who start the first draft. Not grand philosophy. Basic safety principles. Practical, unglamorous, the kind of groundwork nobody wants to do until the day they desperately need it to already exist.",
    10: "Renn and Erynn spend days on it, piecing the Archive's old network back together from fragments, cross-references, and more guesswork than either of them is entirely comfortable admitting to.<br><br>What emerges isn't chaos. It's structure. The ancient routes were never simply doors scattered at random — they were corridors, organized deliberately, connecting some worlds to each other and just as deliberately keeping others apart.<br><br>And some of them, the map makes clear, were sealed. Not lost. Not damaged. Closed on purpose, by someone who had a reason Renn and Erynn don't have yet.",
    11: "Mimi finds it before either of the analysts do — a flicker, faint and wrong, somewhere in the pattern of sealed routes Renn and Erynn just finished mapping.<br><br>One of them isn't as sealed as it should be.<br><br>Something is pushing against it. Testing it, patient and repeated, the way you'd test a lock you didn't have the key to yet. Whether it's succeeding, Mimi can't say. Who's doing it, nobody can say.<br><br>\"It's not us,\" she says, in case anyone was about to ask. \"And I don't think it's anyone we've met.\"",
    12: "Erynn cross-references the sealed route against the oldest Farseer records she has, mostly out of habit, not expecting much.<br><br>She finds more than she expects.<br><br>The Farseers weren't simply historians, weren't simply the interpreters Arc XVII revealed them to be. Buried further back than even that revelation went, there's a role Erynn's tradition doesn't fully remember holding — part of a system that once helped manage the boundaries between worlds. Not scholars watching from outside it. Participants.<br><br>And that system, whatever it was, eventually failed.<br><br>Erynn sits with the old records a long time before saying anything. \"We didn't just inherit their knowledge,\" she says finally. \"We might have inherited their job. And nobody ever told us it was one.\"",
    13: "They don't come armed, and they don't come quietly either — a delegation, confident enough to assume the answer will be yes before anyone's asked the question. They claim authority. They want to inspect the Horizon Engine.<br><br>San doesn't raise her voice. She doesn't need to.<br><br>\"No,\" she says. \"This belongs to us.\"<br><br>Nobody draws a weapon. Nobody needs to. But it's the first time San's said those words out loud to someone who genuinely believed she'd say yes, and saying them changes something in the room that doesn't undo itself once the delegation leaves.",
    14: "It's a harder conversation than San expected, and not because anyone aboard disagrees with the refusal.<br><br>She doesn't want Fair Tide to become the kind of place that hoards what it finds and dares anyone to ask why. That's not who she's trying to be. But she also isn't willing to let outsiders decide what Fair Tide is allowed to do with something it built.<br><br>Joel's the one who says the part that actually needs saying. \"If we don't control it,\" he asks, \"who will?\"<br><br>Nobody has a comfortable answer. San isn't sure yet there is one.",
    15: "San doesn't decide this one alone. She's not sure, looking around the room afterward, that she ever really could have.<br><br>Aisyah lays out the practical concerns — what refusing outside access actually costs them, in trade and goodwill both. Joel covers security, plainly, the way he covers everything. Renn explains the technology in terms the room can actually follow. Erynn lays out the historical weight of what they're sitting on. Mimi says what she can see and, just as carefully, what she can't. Dr. AA raises the humanitarian risk nobody else has voiced yet. Brada thinks through logistics and what defending any of this would actually require.<br><br>And Fair Tide's own people have opinions too — real ones, not just an audience waiting for San to decide for them.<br><br>By the end of it, San hasn't made the decision by herself. That's new. It's also, she realizes, exactly how it should have been from the start.",
    16: "It doesn't come together all at once, and it isn't elegant. But by the end of several long days, the crew has something written down that didn't exist before.<br><br>No forced access to another world. No extraction of resources without permission. No opening unstable passages. No military use without extraordinary justification. No revealing a world's location without weighing what that exposure actually costs the people who live there. Fair Tide does not claim ownership over other worlds — not the ones they've found, and not the ones still waiting to be.<br><br>It isn't perfect. Renn says as much herself, twice, while helping write it. But it's theirs — the first real answer Fair Tide has given to a question everyone else has been trying to answer for them.",
    17: "Word of the Charter spreads faster than San expected, and the reactions split roughly the way she feared they would.<br><br>Some factions accept it, more or less gracefully. Others don't bother pretending to.<br><br>One representative doesn't waste time on courtesy. \"You discovered the routes,\" he says. \"You don't own them.\"<br><br>San doesn't flinch from that. If anything, she agrees with more of it than he expects.<br><br>\"Neither do you,\" she says.<br><br>That's the whole argument, distilled down to four words neither side particularly enjoys hearing. It doesn't end the disagreement. It just makes clear, for the first time, exactly what the disagreement actually is.",
    18: "It isn't the Crimson Tide's fight, not really — not the way it starts. A conflict breaks out over access to one of the known routes, two factions determined to settle by force what the Charter never gave either of them the right to decide alone.<br><br>But their technology is the leverage being fought over, which means staying out of it stops being an option the moment the fighting starts threatening to spill somewhere it shouldn't.<br><br>Joel wants Fair Tide protected, first and immediately, the way he wants everything important protected. San wants something harder — to keep the route itself from becoming a weapon, without Fair Tide becoming the kind of power that settles disputes by force either.<br><br>They don't get to have both easily. But they don't give up on trying for both, and that, more than anything else in this chapter, is the part that matters.",
    19: "San doesn't offer anyone what they originally asked for. She offers them something none of them proposed.<br><br>Not one faction in control. Not Fair Tide alone, either, holding every door shut and deciding everything by itself. Instead: cooperative access, built from what each group can actually contribute rather than what they're trying to claim. Knowledge from the scholars. Supplies from the merchants. Navigation from whoever's actually mapped the routes. Protection, medical assistance, cultural liaison — pieces, distributed, none of them adding up to ownership.<br><br>Nobody gets the routes. Everybody gets a role. It isn't the answer any single faction wanted. It might be the only one that doesn't hand the door to whoever pushes hardest.",
    20: "San doesn't argue the principle. She shows it instead.<br><br>Representatives from several of the interested factions come along this time — merchants, scholars, a quiet observer from the Veyren authority — to a world the crew already knows well enough to walk through safely.<br><br>It isn't a lecture. Nobody sits the visitors down and explains the rules. They just watch. People living lives that don't revolve around whatever might be extracted from them. A place, not a resource.<br><br>Everything Arcs XIII through XVII spent teaching the crew finally has somewhere to land — not as San's private conviction anymore, but as something outsiders can actually see for themselves.",
    21: "San lets herself think it through fully, for the first time, standing somewhere quiet enough to actually sit with it.<br><br>It wouldn't have taken much. The people who discovered the routes becoming the people who controlled the routes, becoming — eventually, plausibly, without anyone deciding it all at once — the people who got to say who was allowed to travel at all. Every step of it would have felt reasonable in the moment. That's what frightens her about it in hindsight.<br><br>Joel finds her there. \"We haven't become that,\" he says.<br><br>\"Not yet,\" San says.<br><br>\"Then don't.\"<br><br>It isn't reassurance, not exactly. It's simpler than that. A line, held, one day at a time.",
    22: "It's Mimi who notices it first — not evidence of interference, not a demand, not even a message. Just the unmistakable sense of having been watched, carefully and for a long time, by something that never once tried to insert itself into the dispute.<br><br>The Nameless haven't tried to control the routes. They haven't made an offer, a threat, or a request.<br><br>They've simply been watching the entire time — and now, San has to assume, they know exactly what Fair Tide has access to.<br><br>Nobody aboard is entirely sure what that means yet. That's what unsettles Mimi most. Not a villain revealing itself. Just the quiet certainty that someone significant has been paying very close attention, and hasn't shown its hand at all.",
    23: "It's formal this time — not the rough draft the crew argued over back at Fair Tide, but the finished thing, written down and meant to hold.<br><br>The Horizon Engine stays under Fair Tide's protection. Access to what it opens isn't granted by ownership, and it isn't handed out by whoever asks loudest or offers the most. It's built on trust, cooperation, and responsibility — earned, not claimed.<br><br>It won't satisfy everyone. San already knows that. But for the first time since the secret got out, there's an actual answer to give when someone asks who gets to decide. Not San alone. Not any single faction. The Charter.",
    24: "The outside factions don't simply accept it and move on, and San never expected they would.<br><br>Some genuinely adapt, finding a place for themselves inside what the Charter actually offers. Some stay openly unhappy about it, cooperating in form without pretending to agree in spirit. Some do neither — they just wait, patient in a way that worries Joel more than open opposition would.<br><br>San's slowly coming to terms with something Aisyah tried to warn her about weeks ago: this was never going to be a problem she solved once. Every new world they find is a new version of the same argument, waiting to happen again.",
    25: "San stands at the Horizon Engine, and the route opens the way it always does now — familiar, and still not quite ordinary.<br><br>\"We found the road,\" she says, looking at the doorway.<br><br>\"And now everyone wants to use it,\" Joel says.<br><br>\"Then we'd better make sure we remember why we opened it.\"<br><br>The Crimson Tide prepares to leave — not to conquer, not to claim, not even simply to explore. To meet whoever's on the other side.<br><br>The Horizon Engine has become something Veyren has to reckon with now, whether it wanted to or not. And Fair Tide has become something San never quite set out to build: not the owner of the routes between worlds, but their custodian. The place that opened the door, and stayed to make sure it got used right.<br><br>Discovery made them responsible for this. Nobody asked them to be. They're doing it anyway."
  };
  window.ARC18_CHAPTER_SCENES = ARC18_CHAPTER_SCENES;

  window.arc18ObjectiveState = function(){
    if (!game.arc17Complete) return null;
    if (level() < 270) return null;
    game.comicProgress18 = game.comicProgress18 || {};
    for (const ch of ARC18_CHAPTERS) {
      if (!game.comicProgress18[ch.id]) return 'complete_arc18_chapter_' + ch.id;
    }
    return 'arc18_all_chapters_complete';
  };

  window.markArc18ChapterRead = function(id){
    const so = window.arc18ObjectiveState();
    if (so !== ('complete_arc18_chapter_' + id)) return;
    game.comicProgress18 = game.comicProgress18 || {};
    game.comicProgress18[id] = true;
    // Matches every prior arc's own completion flag (arc13/.../arc17Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 25) game.arc18Complete = true;
    // Route Access hooks — deliberately sparse, matching what the text
    // actually supports rather than inventing per-world assignments.
    // Ch.18 ("one of the known routes") and Ch.20 ("a world they
    // already know") both stay genuinely unnamed in the story itself,
    // so neither gets a hook here — assigning either to a specific
    // catalogued world would be this developer's invention, not the
    // story's. Only two moments actually name something specific enough
    // to act on:
    if (id === 2 && typeof window.setRouteAccess === 'function') {
      // "A route that shouldn't be known outside the Archive" — the
      // Archive's own route, explicitly named, now compromised.
      window.setRouteAccess('archive', 'restricted', "A ship that shouldn't have known this route found it anyway.");
    }
    if (id === 23 && typeof window.setRouteAccess === 'function' && typeof window.WORLD_CATALOGUE !== 'undefined') {
      // The Charter's own general principle — "access is based on
      // trust, cooperation and responsibility, not ownership" — applies
      // broadly, so any world still sitting unclassified moves to
      // conditional. Never overwrites a world already given a more
      // specific status (like the Archive's 'restricted' above), since
      // the story doesn't say the Charter changes an already-decided
      // classification.
      window.WORLD_CATALOGUE.forEach(function(w){
        if (window.routeAccessFor(w.key) === 'unclassified') {
          window.setRouteAccess(w.key, 'conditional', 'Now governed by the Horizon Charter.');
        }
      });
    }
    const ch = ARC18_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC18_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC18_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc18Splash = function(){
    const overlay = document.getElementById('arc18SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc18Splash = function(){
    const overlay = document.getElementById('arc18SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc18SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc18 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc18) oldRenderStoryForArc18();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc18Ready = window.arc18ObjectiveState() !== null;
    if (arc18Ready && !game.arc18SplashSeen && typeof window.__ctShowArc18Splash === 'function') {
      window.__ctShowArc18Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc18/arc18-cover-the-routes-others-want.png" alt="Arc XVIII — The Routes Others Want" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XVIII</div><div class="story-act-title">The Routes Others Want</div>'+
      '<div class="story-act-tagline">If we discover a way between worlds, who has the right to decide where it leads?</div></div>';
    if (!arc18Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XVIII Locked</div><div class="story-chapter-sub">'+
        (!game.arc17Complete ? 'Finish Arc XVII first.' : 'Reach Level 270 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc18ObjectiveState();
    ARC18_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress18 && game.comicProgress18[ch.id]);
      const ready = !done && so===('complete_arc18_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc18ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc18_all_chapters_complete'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ Arc XVIII complete — every chapter of The Routes Others Want has been read.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
