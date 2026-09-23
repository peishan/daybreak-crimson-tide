(function(){
  // -------------------------------------------------------------------
  // ARC XVII — THE ARCHIVE BETWEEN WORLDS. Chapters 1-25, all five parts
  // ("The Door That Shouldn't Be There," "A World Renn Knows," "Before
  // the Farseers," "What Happened to Renn's World," "The Archive's Last
  // Secret") now wired. Gated at arc16Complete + level 255, continuing
  // the established +15-per-arc ladder (XIV:210, XV:225, XVI:240,
  // XVII:255). Ch.25 sets game.arc17Complete = true, matching every
  // prior arc's own finale flag.
  //
  // Per San's note, the Archive Hub itself (the major new location from
  // the accompanying mechanics doc) is set to become known at Ch.4 —
  // "The Archive Between Worlds," the chapter where the crew makes its
  // first controlled approach and the story itself names the place. This
  // file only sets the discovery flag (game.archiveDiscovered) at that
  // point, matching the harbourDiscovered/tideNetworkDiscovered/
  // clanSettlementDiscovered pattern from prior arcs — it does not build
  // the Archive Hub mechanic itself (Archive Records, World Catalogue,
  // Research, Evidence states, Sealed Records, etc.), which is a much
  // larger, separate build to take on once San is ready for it.
  //
  // Not wired here, by request — being handled separately: registering
  // arc17ObjectiveState() with the main objective-chain aggregator
  // (arc5-and-objective-chain.js), same as arc16ObjectiveState is.
  // Chapters are fully playable end-to-end via the Story screen either
  // way; this only affects whether the top-level "what's next" tracker
  // surfaces them.
  //
  // Cover image paths for Ch.6-25 are placeholder guesses following the
  // established convention (ch0N-slugified-title.png) — flagged for
  // confirmation like every chapter image before this, since no art
  // exists yet to confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC17_CHAPTERS = [
    {id:1, title:'A Signal in the Horizon', focus:"The Horizon Engine detects something unusual during a routine observation — not a world, not a normal Horizon, more like a structured signal embedded in the boundary itself.", image:'assets/comics/arc17/ch01-a-signal-in-the-horizon.png', xp:300, action:'📡 Investigate the Signal'},
    {id:2, title:'The Old Farseer Mark', focus:"Erynn recognizes a symbol within the signal — related to Farseer markings, but older than anything in the Farseer Archives. The Farseers may have inherited this knowledge rather than invented it.", image:'assets/comics/arc17/ch02-the-old-farseer-mark.png', xp:290, action:'📜 Study the Mark'},
    {id:3, title:'Beyond the Known Route', focus:"The crew follows the signal. The Horizon Engine doesn't open toward a normal destination — instead, it reveals an enormous structure suspended beyond the boundary. An Archive.", image:'assets/comics/arc17/ch03-beyond-the-known-route.png', xp:300, action:'🧭 Follow the Signal'},
    {id:4, title:'The Archive Between Worlds', focus:"The Crimson Tide makes its first controlled approach. Records, maps, magical instruments, boundary measurements, sealed doors, and machines whose purpose isn't yet understood — this civilization was studying the connections between worlds themselves.", image:'assets/comics/arc17/ch04-the-archive-between-worlds.png', xp:320, action:'🏛️ Enter the Archive'},
    {id:5, title:'Someone Has Been Here Before', focus:"The crew discovers evidence that someone has accessed the Archive relatively recently — not ancient explorers, someone who understood the systems. Renn recognizes one of the markings. She doesn't know why.", image:'assets/comics/arc17/ch05-someone-has-been-here-before.png', xp:310, action:'🔍 Investigate the Traces'},
    {id:6, title:'Familiar', focus:"Renn starts recognizing things — not memories exactly, more like instinct. She knows which symbols mark restricted areas and understands mechanisms without being taught. Everyone notices. Renn doesn't.", image:'assets/comics/arc17/ch06-familiar.png', xp:300, action:'👁️ Notice Something Familiar'},
    {id:7, title:'The Language of the Archive', focus:"Renn discovers she can partially read an ancient archival language. Erynn is fascinated — but Mimi points out that Renn isn't translating it. She's remembering how it works.", image:'assets/comics/arc17/ch07-the-language-of-the-archive.png', xp:290, action:'📖 Read Without Translating'},
    {id:8, title:"The House That Wasn't Empty", focus:"The crew finds evidence this wasn't merely an institution — there were homes, schools, workshops, families. Renn begins to realize this wasn't just somewhere her people studied. It was somewhere they lived.", image:'assets/comics/arc17/ch08-the-house-that-wasnt-empty.png', xp:300, action:"🏘️ Walk Through Their Home"},
    {id:9, title:"Renn's Name", focus:"They find an old record containing a name remarkably close to Renn's. Then another. And another — different records, different dates, the same family line.", image:'assets/comics/arc17/ch09-renns-name.png', xp:310, action:"📜 Find the Name Again"},
    {id:10, title:'I Know This Place', focus:"Renn admits she doesn't remember everything, but she knows this place — not intellectually, emotionally. She has been here before. San decides they won't force her to remember; they'll let her choose how much to discover.", image:'assets/comics/arc17/ch10-i-know-this-place.png', xp:320, action:'💭 Let Her Choose'},
    {id:11, title:'The First Boundary', focus:"The Archive's earliest records describe technology designed to observe between worlds, not explore them — explaining why the Horizon Engine's earliest form resembled their own progression.", image:'assets/comics/arc17/ch11-the-first-boundary.png', xp:290, action:'🔭 Trace the First Boundary'},
    {id:12, title:'The Farseers Came Later', focus:"Erynn finds references to an ancient group that eventually became the foundation of the Farseer tradition. The Archive predates them — the Farseers were preservers and interpreters, not originators.", image:'assets/comics/arc17/ch12-the-farseers-came-later.png', xp:290, action:'📚 Rethink the Order'},
    {id:13, title:'The Door Renn Found', focus:"A connection is made to the mysterious Door from Arc VII. It wasn't an isolated phenomenon — it was one piece of an ancient network Renn had unknowingly been connected to long before she understood it.", image:'assets/comics/arc17/ch13-the-door-renn-found.png', xp:300, action:'🚪 Follow the Network'},
    {id:14, title:'The Worlds That Closed Their Doors', focus:"The Archive contains records of worlds that deliberately sealed themselves away — not because their civilizations disappeared, but because they chose isolation.", image:'assets/comics/arc17/ch14-the-worlds-that-closed-their-doors.png', xp:300, action:'🔒 Ask Why They Closed'},
    {id:15, title:'The Missing Pages', focus:"The most important part of the Archive has been deliberately removed, not merely lost. The missing material concerns the final period of Renn's civilization.", image:'assets/comics/arc17/ch15-the-missing-pages.png', xp:320, action:"📄 Find What's Missing"},
    {id:16, title:'The Last Generation', focus:"The surviving records reveal what happened near the end — the Archive civilization grew dependent on inter-world travel, and different factions disagreed over how it should be used.", image:'assets/comics/arc17/ch16-the-last-generation.png', xp:300, action:'⚖️ Learn What Divided Them'},
    {id:17, title:'The Great Separation', focus:"The inter-world network was damaged, or deliberately shut down. The worlds became isolated. The Archive survived, but the civilization that built it did not remain intact.", image:'assets/comics/arc17/ch17-the-great-separation.png', xp:310, action:'💔 Learn What Broke'},
    {id:18, title:'Renn', focus:"The crew finally discovers records relating directly to Renn — not a prophecy, a person. She came from this world, part of the final generation connected to the Archive. How she ended up separated from it remains uncertain.", image:'assets/comics/arc17/ch18-renn.png', xp:330, action:'📜 Read Her Own Record'},
    {id:19, title:'What Renn Remembers', focus:"Renn's memories begin returning in fragments — a home, people, a departure, fear, and someone telling her she had to leave. The circumstances remain incomplete.", image:'assets/comics/arc17/ch19-what-renn-remembers.png', xp:320, action:'🧠 Let the Memory Surface'},
    {id:20, title:'Home', focus:'Renn walks through a place she once knew. There is no dramatic magical awakening — she simply realizes she grew up here. San stays beside her without telling her what she should feel.', image:'assets/comics/arc17/ch20-home.png', xp:340, action:'🏡 Walk Through Home'},
    {id:21, title:'The Sealed Chamber', focus:"The crew discovers the Archive's deepest sealed chamber, containing the records that were deliberately hidden.", image:'assets/comics/arc17/ch21-the-sealed-chamber.png', xp:300, action:'🔐 Open the Sealed Chamber'},
    {id:22, title:'Why the Doors Were Closed', focus:"Inter-world travel itself wasn't the problem — uncontrolled access was. Some civilizations had begun treating other worlds as resources rather than places inhabited by people. A major ethical warning for the Crimson Tide.", image:'assets/comics/arc17/ch22-why-the-doors-were-closed.png', xp:310, action:'❓ Learn the Real Reason'},
    {id:23, title:'The Archive Remembers', focus:"The Archive recognizes Renn — not as a chosen hero, but as someone belonging to the civilization that built it. It restores access to parts of the historical record.", image:'assets/comics/arc17/ch23-the-archive-remembers.png', xp:330, action:'✨ Be Recognized'},
    {id:24, title:'What We Take Home', focus:"The crew decides what to bring back, establishing rules: preserve rather than strip the Archive, copy only what they have permission to study, don't exploit abandoned worlds or open sealed routes just because they can. Renn stays connected to the Archive, but sails home with the Crimson Tide.", image:'assets/comics/arc17/ch24-what-we-take-home.png', xp:320, action:'⚖️ Decide What to Take'},
    {id:25, title:'The First Archivist', focus:"Renn begins establishing a small Archive section at Fair Tide to preserve what the Crimson Tide learns. \"I suppose I'm an archivist.\" Far away, a dormant system detects another Horizon signature — not from Veyren.", image:'assets/comics/arc17/ch25-the-first-archivist.png', xp:560, action:'📚 Become the Archivist'}
  ];
  window.ARC17_CHAPTERS = ARC17_CHAPTERS;

  const ARC17_CHAPTER_SCENES = {
    1: "The readings come in during a routine sweep — nothing about the setup suggested this would be anything but a normal check of the boundary.<br><br>It isn't a world out there. Renn is sure of that within minutes, and surer still the longer she stares at it. It isn't a normal Horizon either, not the shape those usually take. What it actually resembles, if she's being precise about it, is a signal — structured, deliberate, embedded directly into the boundary itself rather than sitting somewhere beyond it.<br><br>\"Can we reach it?\" San asks, because that's always the first question that matters.<br><br>\"That's the interesting part,\" Renn says, and doesn't look up from the readings once.",
    2: "It's Erynn who spots it first, buried in the signal's structure where anyone less trained would have missed it entirely — a symbol.<br><br>Not unfamiliar. That's what unsettles her. It's related to Farseer markings, close enough that she recognized it on sight. But it's older. Older than anything catalogued in the Farseer Archives, older than any tradition she was ever taught to trace it back to.<br><br>Which means one of two things, and neither sits easily. Either the Farseers found this on their own and built an entire tradition to explain it. Or they didn't find it at all — they inherited it, from something that came before them, and simply never said so.<br><br>\"We've been studying the descendants of something,\" Erynn says quietly, and for once doesn't sound like someone enjoying a discovery.",
    3: "The crew follows the signal, and almost immediately it stops behaving like anything they've followed before.<br><br>Every previous crossing has opened toward somewhere — a world, a coastline, something with a shape San could point the ship at. This one doesn't. Instead, beyond the boundary, something enormous resolves into view — not a destination so much as a structure, suspended in space that shouldn't hold anything at all.<br><br>An Archive, though nobody uses that word yet.<br><br>It looks abandoned, in the way old places always look abandoned from a distance — quiet, still, untouched. But something in there is still running. San can feel it before anyone confirms it out loud.",
    4: "The Crimson Tide makes its first controlled approach, slow and deliberate, the way you'd approach something you don't yet understand well enough to risk approaching any other way.<br><br>It isn't simply a library, whatever San expected walking in. It's records and maps and instruments whose function nobody can immediately place. Boundary measurements stretching back further than anyone aboard can account for. Records of worlds — more worlds than the crew has ever heard named, let alone visited. Old travel routes, some clearly still active, others just as clearly long since closed. Sealed doors that offer no explanation for what they're sealing. Machines that hum faintly, purpose unknown, still doing whatever they were built to do centuries after anyone was left to ask them to.<br><br>Whoever built this wasn't studying worlds individually. They were studying the connections between them — the boundary itself, as its own subject, the way Renn studies the Engine.<br><br>Nobody says much walking through it. There isn't much to say yet.",
    5: "The signs are small, easy to miss if you aren't looking for them — but once Erynn points them out, they're unmistakable. Someone has been here. Not ancient explorers, not whoever built this place originally. Someone recent. Someone who understood the systems well enough to move through them without disturbing what wasn't meant to be disturbed.<br><br>Renn stops in front of one particular marking, and something in her expression changes before she says a word.<br><br>She recognizes it. She can't explain how, and that bothers her more than not recognizing it would have.",
    6: "It starts small enough that nobody thinks to mention it at first.<br><br>Renn reaches for a lever before anyone tells her what it does, and it's the right one. She steps around a section of floor that turns out, when Zaki checks afterward, to have been unstable for centuries. She knows, without being able to say how, which doors in this wing are the ones you don't open.<br><br>Nobody says anything about it out loud. Not yet. Renn hasn't noticed doing it, and everyone else is still deciding whether pointing it out would help or just make it worse.",
    7: "Erynn hands Renn a fragment of archival text mostly to see what she makes of it — a linguist's habit, testing an unfamiliar script against a sharp mind.<br><br>Renn reads it. Not slowly, not the halting sentence-by-sentence work of translation. She reads it the way you read something you already know.<br><br>Erynn is delighted, right up until Mimi says the thing that changes the mood in the room. \"That's not translating,\" Mimi says quietly. \"That's remembering.\"",
    8: "It stops being an institution somewhere around the third wing.<br><br>Erynn had assumed, reasonably, that they were walking through something like a university — records, instruments, workshops. But workshops don't usually have this many small rooms. Institutions don't usually have this many child-sized handprints pressed into the plaster, still visible after all this time.<br><br>There were homes here. Schools. Families who lived their whole lives in the shadow of all this knowledge, not just the scholars who produced it.<br><br>Renn stops walking in the middle of what used to be somebody's kitchen, and doesn't explain why.",
    9: "Erynn finds the first record almost by accident — a family ledger, badly faded, with a name close enough to Renn's that she reads it twice before saying anything.<br><br>Renn waves it off. Close isn't the same as the same. Names repeat. It doesn't have to mean anything.<br><br>Then they find a second record. A different date, a different hand, the same family line running through it like a thread nobody's pulled yet. Then a third.<br><br>Renn doesn't wave that one off. She just goes very quiet, and doesn't offer an explanation for that either.",
    10: "San doesn't push. She's been waiting to see if Renn would say it herself, and eventually, standing in a corridor that means something to no one else in the room, Renn does.<br><br>\"I don't remember all of it,\" she says. \"Not — not facts, not names past what we've already found. But I know this place. Not the way you know a place you've studied. The way you know a place you grew up in.\"<br><br>She's been here before. Not intellectually. Somewhere underneath that.<br><br>San doesn't ask her to explain further, and doesn't ask her to keep exploring, either. \"However much of this you want to find,\" she says, \"we go at your pace. Not the Archive's, and not ours.\"<br><br>Renn nods, and for the first time since Chapter 6, looks less like someone hiding something and more like someone finally allowed to feel it.",
    11: "The oldest records in the Archive don't describe exploration. They describe watching.<br><br>Renn works through the earliest instruments with Erynn at her shoulder, and the shape of it becomes clear faster than either of them expected: whatever this civilization built first wasn't meant to cross between worlds. It was meant to observe them from exactly this side of the boundary, cautiously, before anyone risked going further.<br><br>It explains something Renn's been quietly turning over since the Horizon Engine's earliest days — why its first form looked the way it did. They weren't inventing something new. They were rebuilding something old, from instincts neither of them fully understood the source of.",
    12: "Erynn finds it in a cross-reference she almost skips — an old order, named differently, whose founding practices look uncomfortably close to her own tradition's earliest teachings.<br><br>The dates don't work if the Farseers came first. They can't have.<br><br>What the Archive actually contains are records of a group that came later — people who found fragments of something far older, and spent generations building an entire interpretive tradition around pieces they didn't fully understand. Preservers. Interpreters. Not originators.<br><br>Erynn sits with that for longer than she expects to need. Everything she was taught about what her order knows just quietly became a question about what her order inherited instead.",
    13: "It's Renn who makes the connection, staring at a diagram that shouldn't mean anything to her and somehow does.<br><br>The Door from all those months ago — the one that led nowhere anyone could explain, the one that started all of this for her personally — isn't an isolated anomaly. It's a node. One piece of a network this Archive was built to map, cataloged here under a designation that predates the name Renn ever gave it.<br><br>She'd been connected to this the whole time, unknowingly, long before any of them understood what \"connected\" even meant in this context.<br><br>\"It wasn't random,\" she says slowly. \"None of it was ever random.\"",
    14: "Not every world in the old network is still listed as reachable. Some are marked, deliberately and clearly, as sealed.<br><br>San expects the records to explain some catastrophe — an invasion, a disaster, something that forced isolation on people who didn't want it. That's not what she finds. Several of these worlds sealed themselves. Chose it. Left records explaining, in their own words, why continued contact wasn't worth what it was costing them.<br><br>It's a harder question than San expected to be sitting with. Not every closed door in this Archive was a tragedy. Some of them were a decision. And she isn't sure yet whether that makes them easier to understand or harder.",
    15: "It takes Erynn longer than it should to realize what she's actually looking at — not gaps in the record from age or damage, but a section removed. Deliberately. Carefully. By someone who knew exactly what they were taking out.<br><br>Whoever did this didn't want this specific history lost by accident. They wanted it gone on purpose.<br><br>Renn goes very still once she realizes which period the missing pages cover. Not the Archive's early history. Not the Farseers, or the first boundary work.<br><br>The end. Whatever happened to her own people, right at the close of it, someone made sure nobody would find it easily.<br><br>She doesn't say much for the rest of the day.",
    16: "What survives, once you piece the surrounding fragments together, is a picture of a civilization that had grown more dependent on inter-world travel than any before it — and more divided over what to do with that dependence.<br><br>The records don't paint it as one clean argument. There were people who wanted to keep exploring, further and further, for its own sake. People who saw the other worlds as resources to draw from. People who wanted contact — real contact, relationships between civilizations, not just access. People who wanted control over all of it, and weren't particular about how they got it.<br><br>Nobody in these records is simply right. Renn reads faction after faction and recognizes fragments of arguments she's had herself, on this very ship, about very different things.",
    17: "Something broke. That much is certain by the time Renn and Erynn finish reconstructing the sequence — though exactly what, and whether it was damage or a deliberate shutdown, the records don't agree on cleanly.<br><br>Whatever it was, it worked. The inter-world network that connected all of this simply stopped, and the worlds it had linked went quiet, one by one, cut off from each other in a way none of them had prepared for.<br><br>The Archive survived. It's still standing, still humming faintly in places, centuries later. But the civilization that built it didn't survive with it — not intact, not in the shape it had been.<br><br>Renn doesn't ask whose fault it was. She's starting to suspect the records won't have a clean answer to that either.",
    18: "They find it in a section Renn almost doesn't let them open.<br><br>Not a prophecy. Not the shape of a story where someone turns out to be chosen for something. A person. A record, plain and unremarkable in the way real records usually are, connecting her — not a resemblance, not a family line this time, her — to the final generation this Archive ever recorded in full.<br><br>Renn came from here. That part is no longer a guess.<br><br>What isn't in the record is how she ended up separated from all of it — from this place, this history, everyone this ledger says she belonged to. That part stays unanswered, for now. San watches her read it twice, and doesn't fill the silence with anything.",
    19: "It doesn't arrive as a single overwhelming flood, the way Renn half-expected it might if it ever came at all. It arrives in pieces, uneven and out of order, the way real memory actually works.<br><br>A home — not this Archive exactly, but somewhere close enough to it that the two blur together. People, half-formed, faces she can't quite hold onto long enough to describe. A departure, sudden enough that it still carries urgency even now. Fear, real and specific, not the vague unease she's been carrying since Chapter 6.<br><br>And someone — she can't say who yet — telling her she had to leave.<br><br>That's where it stops. Not everything. Enough.",
    20: "There's no dramatic moment to it, in the end. No flash of magic, no sudden completion of everything Chapter 19 left open.<br><br>Renn simply walks into a room that means something specific to her — more specific than anywhere else in the Archive has — and stands there for a while, taking in details nobody else would notice.<br><br>\"I grew up here,\" she says, finally. Not a question. Not a revelation delivered for effect. Just a fact, settling into place after being unspoken for far too long.<br><br>San stays beside her. She doesn't tell Renn what she should be feeling, doesn't fill the quiet with reassurance Renn hasn't asked for. She just stays, for as long as Renn needs her to.",
    21: "The Archive's deepest chamber doesn't open easily, and it isn't supposed to — whatever sealed it clearly meant for it to stay sealed.<br><br>It takes Renn, Erynn, and more patience than anyone aboard was expecting to spend on a single door. When it finally gives, what's inside isn't treasure and isn't a weapon. It's records — the ones that were deliberately hidden, kept apart from everything else in the Archive rather than simply lost with the rest.<br><br>Whoever sealed this wanted it findable, eventually, by someone willing to work for it. Just not by anyone who happened to wander in.",
    22: "The answer, once they finally have it, isn't the one San expected.<br><br>Inter-world travel itself was never really the problem — the records are clear on that much. The problem was what happened once travel stopped being cautious. Some civilizations, in the last era before the network failed, had begun treating other worlds less like places full of people and more like resources waiting to be drawn from.<br><br>That's what the closed doors were actually protecting against. Not travel. Extraction, dressed up as exploration.<br><br>San sits with that for a long time. It isn't a history lesson anymore, not really. It's a warning, aimed forward as much as it describes anything in the past — and she's uncomfortably aware of how close the Crimson Tide itself has come to that same line more than once.",
    23: "Something shifts, the moment Renn steps into the restored chamber — not dramatically, but unmistakably. Systems that have stayed dark through every other room flicker on, one after another, responding to something about her specifically that no one else aboard triggers.<br><br>It isn't recognizing a hero. It isn't recognizing anyone chosen for anything.<br><br>It's recognizing where she's from.<br><br>Access opens that had stayed closed through every prior chapter — not everything, not all at once, but enough. For the first time since this arc began, Renn has an actual way to learn about her own people, instead of piecing them together from fragments and family ledgers.",
    24: "There's more knowledge in this Archive than the Crimson Tide could carry home in a hundred trips, and San is aware, standing in the middle of it, of exactly how tempting that is.<br><br>They don't take it. Not like that.<br><br>What they settle on instead is closer to a set of rules than a haul: preserve what's here rather than strip it. Copy only what they actually have permission to study. Don't treat an abandoned world like a resource just because no one's left to say no. Don't force open a sealed route simply because it's possible to.<br><br>Renn chooses to stay connected to the Archive's preservation — this is hers, in a way it will never quite be anyone else's aboard the ship. But when the Crimson Tide sails, she sails with it.<br><br>\"This is home too,\" she says, and doesn't have to explain to anyone why that's true now in a way it wasn't before.",
    25: "It's a quiet chapter, the way the important ones sometimes are.<br><br>Renn starts small — a single shelf at Fair Tide, nothing like the vast structure they just left behind. Erynn contributes what she can pull from the Farseer records. Mimi adds what she's willing to commit to paper from things that mostly can't be proven yet. Renn catalogs all of it herself, patient in a way San hasn't seen from her before.<br><br>San watches her work for a while before Joel finally asks the question everyone's been circling.<br><br>\"So what are you now?\"<br><br>Renn thinks about it longer than the question probably needed.<br><br>\"I suppose I'm an archivist.\"<br><br>\"You were already an Archive Mage,\" San says.<br><br>\"Yes,\" Renn says. \"But now I know why.\"<br><br>Far away, in a structure that hasn't drawn a new breath in thousands of years, something quietly activates. A system built to detect exactly one thing, doing precisely what it was built to do.<br><br>Another Horizon signature. Not from Veyren.<br><br>Somewhere else."
  };
  window.ARC17_CHAPTER_SCENES = ARC17_CHAPTER_SCENES;

  window.arc17ObjectiveState = function(){
    if (!game.arc16Complete) return null;
    if (level() < 255) return null;
    game.comicProgress17 = game.comicProgress17 || {};
    for (const ch of ARC17_CHAPTERS) {
      if (!game.comicProgress17[ch.id]) return 'complete_arc17_chapter_' + ch.id;
    }
    return 'arc17_part1_complete_for_now';
  };

  window.markArc17ChapterRead = function(id){
    const so = window.arc17ObjectiveState();
    if (so !== ('complete_arc17_chapter_' + id)) return;
    game.comicProgress17 = game.comicProgress17 || {};
    game.comicProgress17[id] = true;
    const ch = ARC17_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    // Per San's note: the Archive Hub is set to become known at Ch.4,
    // "The Archive Between Worlds" — the chapter where the crew makes
    // its first controlled approach. Only sets the discovery flag here;
    // the Archive Hub mechanic itself is a separate, later build.
    if (id === 4) game.archiveDiscovered = true;
    // Matches every prior arc's own completion flag (arc13/14/15/16Complete) —
    // self-contained to this file, doesn't require the objective-chain
    // aggregator to already know about Arc XVII.
    if (id === 25) game.arc17Complete = true;
    if (ARC17_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC17_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  const oldRenderStoryForArc17 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc17) oldRenderStoryForArc17();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc17Ready = window.arc17ObjectiveState() !== null;
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<div class="story-act-kicker">Arc XVII</div><div class="story-act-title">The Archive Between Worlds</div>'+
      '<div class="story-act-tagline">Some histories are older than the people who remember them.</div></div>';
    if (!arc17Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XVII Locked</div><div class="story-chapter-sub">'+
        (!game.arc16Complete ? 'Finish Arc XVI first.' : 'Reach Level 255 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc17ObjectiveState();
    ARC17_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress17 && game.comicProgress17[ch.id]);
      const ready = !done && so===('complete_arc17_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc17ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc17_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XVII chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
