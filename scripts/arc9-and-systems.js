
(function(){
  // -------------------------------------------------------------------
  // ARC IX — "The Cat Who Was Always There". Gated behind game.arc8Complete
  // (set by Arc VIII's Ch.24) + level 135, continuing the +15-per-arc pace
  // from Arc V (75) through Arc VIII (120). 26 chapters, not 24 like every
  // arc since Arc IV — the source doc's own part breakdown (4/4/5/5/4/4)
  // adds up to 26, so that's what's built, rather than forcing it to match
  // the usual count. Entirely narrative, same as Arc VIII — no new
  // companion recruits (the tower cat stays at its tower, not the crew),
  // so this reuses the single markArc9ChapterRead pattern rather than
  // per-chapter bespoke functions. A handful of narratively load-bearing
  // chapters (11, 17, 21, 23, 26) set flags for later content to check,
  // matching Arc VIII's restraint — no functional system attached yet.
  // -------------------------------------------------------------------
  const ARC9_CHAPTERS = [
    {id:1,  title:'The Blessing Cat',                 focus:"Soel's familiar abilities grow harder to explain away — sensing danger early, calming injured crew, reacting to disturbances nobody else can perceive. Renn gets curious. Soel bites him.", image:'assets/comics/arc9/ch01-the-blessing-cat.png', xp:200, action:'🐾 Watch Him Closely'},
    {id:2,  title:'A Hunter in the Dark',              focus:"Soel vanishes for hours at a remote port. He comes back with something strange — a small object tied to an old spiritual tradition — and San notices he's unusually unsettled.", image:'assets/comics/arc9/ch02-a-hunter-in-the-dark.png', xp:200, action:'🕵️ Ask Where He\'s Been'},
    {id:3,  title:'The Cat That Watches',              focus:"In a place where locals say cats can see things people can't, Soel spends the whole visit watching an empty doorway — and refuses to say what he sees when San asks.", image:'assets/comics/arc9/ch03-the-cat-that-watches.png', xp:200, action:'🚪 Look Where He\'s Looking'},
    {id:4,  title:'A Familiar Feeling',                focus:"Joel notices Soel keeps turning up near San and Joel whenever they talk about the Horizon Engine, the Farseer records, or the boundaries. Renn wonders if he can sense it. San isn't convinced.", image:'assets/comics/arc9/ch04-a-familiar-feeling.png', xp:200, action:'🧭 Notice the Pattern'},
    {id:5,  title:'The Tower Cat',                     focus:"Back near Senedra's tower, her tower cat appears again. It and Soel watch each other from across the room, neither approaching — clearly connected, but clearly not the same creature.", image:'assets/comics/arc9/ch05-the-tower-cat.png', xp:225, action:'🐈 Watch the Two Cats'},
    {id:6,  title:'Two Cats, One Shadow',               focus:"Renn and Erynn compare notes: the tower cat belongs to a place and old knowledge, Soel to travel and the Crimson Tide. A shared origin, maybe — but not a shared identity.", image:'assets/comics/arc9/ch06-two-cats-one-shadow.png', xp:200, action:'📖 Compare Notes'},
    {id:7,  title:'What the Tower Cat Knows',           focus:"The tower cat leads the crew to a hidden chamber full of old symbols — cats guarding places, cats guiding travelers away from them. Soel refuses to go inside.", image:'assets/comics/arc9/ch07-what-the-tower-cat-knows.png', xp:225, action:'🕯️ Enter the Chamber'},
    {id:8,  title:'The Name They Never Gave Him',       focus:"San remembers taking Soel in as a kitten — Aisyah helping with his neutering and vaccinations, Joel feeding his mother, the name San and Joel chose together. He was already Soel before anyone knew he was special.", image:'assets/comics/arc9/ch08-the-name-they-never-gave-him.png', xp:300, action:'💭 Remember How It Started'},
    {id:9,  title:'The First Blessing',                 focus:"Soel saves someone from a serious injury with a stronger version of his blessing — not just healing the body, but steadying their spirit. Jovie, Senedra, and Dr AA start studying the effect.", image:'assets/comics/arc9/ch09-the-first-blessing.png', xp:225, action:'✨ Witness the Blessing'},
    {id:10, title:"A Cat's Memory",                     focus:"Soel grows agitated near an old harbour shrine neither San nor Joel have ever visited. San feels a brief, uncertain familiarity — no clear memory, no clear answer.", image:'assets/comics/arc9/ch10-a-cats-memory.png', xp:225, action:'⚓ Follow Him to the Shrine'},
    {id:11, title:'The Ones Who Walk Beside Us',        focus:"A community describes spiritual companions in kinds — guardians, guides, witnesses, companions who simply remain — and insists a guardian can only choose to stay, never be commanded. Soel seems to fit more than one.", image:'assets/comics/arc9/ch11-the-ones-who-walk-beside-us.png', xp:225, action:"👂 Hear Their Traditions"},
    {id:12, title:'The Price of a Blessing',            focus:"Soel overextends himself protecting the crew and comes back weak and withdrawn. Renn finds out his blessings aren't limitless — they draw on his own spiritual strength.", image:'assets/comics/arc9/ch12-the-price-of-a-blessing.png', xp:275, action:'😿 Tend to Soel'},
    {id:13, title:'The Cat Who Chose',                  focus:"Destiny or not, Joel points out Soel still made choices of his own — to return, to trust them, to sleep beside them, to protect them. None of it was ever just magic doing the deciding.", image:'assets/comics/arc9/ch13-the-cat-who-chose.png', xp:250, action:'💞 Count the Choices'},
    {id:14, title:"A Mother's Shadow",                  focus:"Near an old spiritual boundary where strays gather, Soel recognizes a scent like his mother's. Whatever runs in his lineage may have started with her, even if she was never anything but an ordinary cat.", image:'assets/comics/arc9/ch14-a-mothers-shadow.png', xp:225, action:'🐾 Follow the Scent'},
    {id:15, title:'The First Home',                     focus:"San and Joel go back to the warehouse dormitory where Soel was born — no temple, no prophecy, just a stray mother Joel had been feeding, and the ordinary choices that gave Soel his first home.", image:'assets/comics/arc9/ch15-the-first-home.png', xp:250, action:'🏘️ Revisit Where He Was Born'},
    {id:16, title:'The Spirit in the Rain',             focus:"A sudden magical storm traps the crew near where Soel was found, and he's the only one who can navigate it — guiding San and Joel by following faint traces of warmth and familiarity.", image:'assets/comics/arc9/ch16-the-spirit-in-the-rain.png', xp:275, action:'🌧️ Follow Him Through the Storm'},
    {id:17, title:'The Cat and the Door',               focus:"A dormant boundary reacts to Soel himself — not machinery, not spells, not research. The tower cat appears on the far side. Neither cat crosses, and the boundary closes on its own.", image:'assets/comics/arc9/ch17-the-cat-and-the-door.png', xp:250, action:'🚪 Watch the Boundary Close'},
    {id:18, title:'What He Cannot Tell Us',             focus:"Renn is frustrated Soel can't explain what he clearly knows. Erynn reminds him that not every kind of knowledge translates into words. San refuses to let the crew treat him like a research instrument.", image:'assets/comics/arc9/ch18-what-he-cannot-tell-us.png', xp:250, action:'🗣️ Try to Understand Him'},
    {id:19, title:"The Guardian's Question",            focus:"The tower cat's keeper shares an old belief: a spiritual cat may protect a place, guide a traveler, or stay with a chosen family — but never all three forever. Soel may have to choose.", image:'assets/comics/arc9/ch19-the-guardians-question.png', xp:275, action:"❓ Hear the Guardian's Question"},
    {id:20, title:'The Place Beyond the Tide',           focus:"A spiritual disturbance starts pulling Soel toward an ancient boundary. The tower cat stays behind to hold the passage stable. For the first time, San and Joel can't just call him back — he has to choose.", image:'assets/comics/arc9/ch20-the-place-beyond-the-tide.png', xp:300, action:'🌊 Let Him Go'},
    {id:21, title:'Stay',                                focus:"Soel comes back to the Crimson Tide — not because he's forced to, not prophecy, not possession. Because the ship is home. The tower cat stays at its tower. The two cats acknowledge each other, then go their separate ways.", image:'assets/comics/arc9/ch21-stay.png', xp:400, action:'🏠 Welcome Him Home'},
    {id:22, title:'The Blessing We Give Back',          focus:"Weakened after the boundary, Soel is cared for the same ordinary way San once cared for him — everyone pitching in, nobody treating him like a mystery anymore, just family.", image:'assets/comics/arc9/ch22-the-blessing-we-give-back.png', xp:250, action:'🩹 Care for Him in Return'},
    {id:23, title:'Not a God',                          focus:"The crew finally learns the broad truth: Soel isn't a god, a reincarnated person, or an all-powerful spirit. He's a spiritual familiar from an old, uncommon lineage — his exact origin still uncertain.", image:'assets/comics/arc9/ch23-not-a-god.png', xp:300, action:'😽 Learn the Truth'},
    {id:24, title:'The Name San Gave Him',              focus:"San named him before she understood anything about him. \"Soel\" was never a sacred title — just the name she picked for a small cat she wanted to keep alive. That makes it matter more, not less.", image:'assets/comics/arc9/ch24-the-name-san-gave-him.png', xp:275, action:'💫 Remember the Name'},
    {id:25, title:'The Cat Who Travels',                focus:"Soel's abilities settle into a clearer shape — blessing, detection, protection, guidance — but he's still a cat first: hunting, disappearing, sleeping in inconvenient places, causing trouble.", image:'assets/comics/arc9/ch25-the-cat-who-travels.png', xp:250, action:'🐾 See Who He\'s Become'},
    {id:26, title:'Beside Us All Along',                focus:"Renn and Erynn are still debating what Soel is. Mimi thinks the better question is what he's become with them. Somewhere beneath the sea, something distant moves — and Soel notices it first.", image:'assets/comics/arc9/ch26-beside-us-all-along.png', xp:500, action:'🌅 Watch the Horizon With Him'}
  ];
  window.ARC9_CHAPTERS = ARC9_CHAPTERS;

  window.arc9ObjectiveState = function(){
    if (!game.arc8Complete) return null;
    // Continues the +15-per-arc pace from Arc VI (90) / VII (105) / VIII (120).
    if (level() < 135) return null;
    game.comicProgress9 = game.comicProgress9 || {};
    for (const ch of ARC9_CHAPTERS) {
      if (!game.comicProgress9[ch.id]) return 'complete_arc9_chapter_' + ch.id;
    }
    return 'arc9_part1_complete_for_now';
  };

  // -------------------------------------------------------------------
  // Per-chapter story scenes — richer, multi-beat text matching the
  // actual narrative weight of each chapter, same convention as
  // ARC8_CHAPTER_SCENES. All 26 present from the start (source doc came
  // with full chapter text already, unlike Arc VIII which was filled in
  // progressively) — markArc9ChapterRead still checks for presence
  // defensively so nothing breaks if that ever changes.
  // -------------------------------------------------------------------
  const ARC9_CHAPTER_SCENES = {
    1: "Soel's abilities keep getting harder to explain away.<br><br>He senses danger before anyone else does. He calms injured crew members just by being near them. Every so often he reacts to something nobody else can perceive at all.<br><br>Renn finds this fascinating and says so, at length, right to Soel's face.<br><br>Soel bites him.",
    2: "At a remote port, Soel disappears for hours.<br><br>Everyone assumes he's hunting — he always is. But when he comes back, he's carrying something that isn't prey: a small object tied to an old spiritual tradition nobody aboard recognizes.<br><br>San can tell he's unsettled. She doesn't know why yet.",
    3: "In a place where the locals swear cats can see things people can't, Soel spends most of the visit watching an empty doorway.<br><br>\"What do you see?\" San asks him.<br><br>He won't look at her.<br><br>Later, just for a moment, the doorway shows a second landscape entirely — and then it's gone.",
    4: "Joel's the one who notices it first: Soel keeps settling near San and Joel whenever they're talking about the Horizon Engine, the Farseer records, or the boundaries between worlds.<br><br>Renn wonders out loud whether Soel can actually sense boundary activity.<br><br>San isn't ready to believe that. Not yet.",
    5: "Back in the region connected to Senedra's tower, the tower cat shows up again.<br><br>Soel and the tower cat watch each other from opposite sides of the room. Neither one moves closer.<br><br>Whatever they recognize in each other, it's real — but it's clear, even just watching them, that they aren't the same creature wearing two different lives.",
    6: "Renn and Erynn sit down and actually compare what they've each observed.<br><br>The tower cat is tied to the tower itself — a fixed place, old magical knowledge, something that stays put. Soel is tied to travel, to healing, to protection, to the Crimson Tide moving from port to port.<br><br>The similarities point to a shared origin, maybe a shared category of thing. Not a shared identity. Erynn is careful to write down that distinction before anyone starts assuming otherwise.",
    7: "The tower cat leads them down into a hidden chamber beneath the tower.<br><br>The walls are covered in old symbols — cats standing beside travelers, beside ships, beside doorways. Some of the images show cats guarding places. Others show cats guiding people firmly away from them.<br><br>Soel won't set a single paw inside. He waits at the entrance until they're done.",
    8: "San lets herself remember all of it, plainly, without dressing it up.<br><br>Taking him in when he was barely more than a kitten. Nursing him through a sickness that nearly took him early. Learning, slowly and mostly by trial and error, how to actually take care of a cat. Aisyah quietly covering the cost of his neutering and his first vaccinations. Joel, before any of it, feeding his mother without being asked to. Choosing his name together — San's half, Joel's half. Soel gradually working his way into her parents' house the way cats do, one unbothered afternoon at a time.<br><br>Renn asks, carefully, whether she'd feel any differently about him if it turned out he was something ancient.<br><br>San doesn't have to think about it. \"He was already Soel,\" she says, \"before anyone knew he was special.\"",
    9: "Soel saves someone from a serious injury using a stronger version of his blessing than anyone's seen from him before.<br><br>It isn't just healing. It calms the fear right out of them, steadies something underneath that, and helps them come back from magical shock in a way medicine alone couldn't manage.<br><br>Jovie, Senedra, and Dr AA all start studying the effect properly. Their conclusion, once they compare notes: Soel isn't just fixing the body.<br><br>He's helping someone stay themselves.",
    10: "Soel starts reacting to places San and Joel have never once set foot in, in this life or any other they know of.<br><br>He grows agitated near an old harbour shrine and won't leave the area, no matter how San coaxes him.<br><br>For a moment, San feels something like familiarity — brief, uncertain, gone before she can hold onto it. No memory attached. No answer either.",
    11: "The crew meets a community with an old, specific belief: every traveler may be walking alongside an unseen guardian, whether they know it or not.<br><br>Their traditions sort spiritual companions into kinds — guardians who protect, guides who lead, witnesses who remember, companions who simply remain, asking for nothing in particular.<br><br>Their belief is firm on one point: a guardian can't be commanded into staying. It can only choose to.<br><br>Listening to all four categories laid out, more than one person in the crew looks at Soel and realizes he doesn't fit neatly into just one of them.",
    12: "Protecting several members of the crew at once costs Soel more than anyone realizes until afterward, when he's weak and withdrawn and won't come near anyone.<br><br>San is frightened — genuinely frightened — that whatever he's capable of might be hurting him.<br><br>Renn digs into it and finds the answer: Soel's blessings aren't limitless. They draw on his own spiritual strength, and maybe on the bond he shares with whoever he's protecting.",
    13: "San starts turning over the idea that Soel might have been destined to find them.<br><br>Joel doesn't argue the point. He just adds something to it: destined or not, Soel still made choices, every step of the way. He chose to come back to them. He chose to trust them. He chose to sleep beside them, night after night. He chose to protect them, at cost to himself.<br><br>None of that needed a prophecy behind it. It was just him, deciding.",
    14: "Near an old spiritual boundary where the local strays tend to gather, Soel picks up a scent — his mother's, or something close enough to it that it stops him cold.<br><br>Whatever runs in his lineage, it may go back further than San or Joel ever assumed. His mother might have carried some version of it too, even if nobody ever thought to call her anything but an ordinary street cat.<br><br>They don't learn anything more than that. Not this time.",
    15: "San and Joel go back to where Soel's story actually began — not a market district, not anywhere touched by prophecy. Joel's old warehouse dormitory.<br><br>Soel's mother was a stray, already grown, that Joel had quietly been feeding around the warehouse. Worried about forklifts and the general danger of the place, he brought her into the dorm itself, just to keep her safe.<br><br>She gave birth there. Soel was one of that litter.<br><br>When Joel later had to move to a no-pets dormitory, San took Soel in.<br><br>There's no grand mystery to uncover here — only a frightened mother, a vulnerable kitten, and the ordinary choices, Joel's and then San's, that gave Soel his first home.",
    16: "A magical storm catches the crew near the place Soel was found, and normal navigation is useless in it almost immediately.<br><br>Soel is the only one who can find a way through — not by reading the storm, but by following something smaller: faint traces of warmth, of familiarity, threading through all that wrongness.<br><br>For just a moment, San sees something indistinct — a small kitten, alone in the rain. She can't say if it's memory, magic, or simply her own understanding of him finally taking a shape she can see.",
    17: "A boundary that's been dormant for who knows how long reacts to Soel — not to machinery, not to a spell, not to anyone's research. Just to him, standing there.<br><br>The tower cat appears on the other side of it.<br><br>Neither cat crosses. After a while, the boundary closes again, quietly, without ever opening into anywhere else.",
    18: "Renn's frustrated that Soel can't just explain what he obviously knows.<br><br>Erynn reminds him, gently, that not every kind of knowledge survives translation into words — that Soel may understand paths, danger, spirits, and bonds perfectly well without ever needing a human concept for any of it.<br><br>San draws a firmer line: the crew doesn't get to treat him like an instrument for their research. Renn accepts it. Reluctantly, but he accepts it.",
    19: "The tower cat's keeper shares a belief that's clearly old, and clearly carries weight: a spiritual cat may protect a place, or guide a traveler, or stay with a chosen family — but never all three, not forever.<br><br>Soel may eventually have to choose whether his purpose belongs to Veyren's boundaries or to the people aboard the Crimson Tide.<br><br>Nobody says it out loud right away, but the fear settles in fast: understanding him fully might mean losing him.",
    20: "A spiritual disturbance starts pulling at Soel, drawing him toward an ancient boundary none of them fully understand.<br><br>The tower cat stays behind to keep the passage stable — its part in this, apparently, is to hold the door, not walk through it.<br><br>Soel gets pulled toward the other side anyway, toward whatever might explain where his abilities actually come from.<br><br>San and Joel can't just call him back this time. For the first time since any of them have known him, the choice is entirely his.",
    21: "Soel comes back.<br><br>Not because he was forced to. Not prophecy, not San possessing some claim over him, not any rule that says he has to.<br><br>He comes back because the ship is home.<br><br>The tower cat stays exactly where it belongs — guarding its tower, keeping its knowledge. The two cats look at each other one more time before they go their separate ways.<br><br>They share a mythology. They were never going to share a destiny.",
    22: "The boundary left Soel weakened, and the crew looks after him the same ordinary way San once looked after him, back when he was small enough to fit in one hand.<br><br>San nurses him. Joel keeps food ready and stays close. Jovie checks on his condition. Dr AA studies how he's healing. Senedra just sits nearby, not saying much. Renn and Erynn — for once — stop treating him like a mystery that needs solving. The whole crew learns to give him space when he wants it.<br><br>He gets better. Slowly. Nothing about the care is dramatic. That's rather the point.",
    23: "The crew finally gets the broad shape of the truth.<br><br>Soel isn't a god. He isn't a reincarnated person. He isn't some all-powerful spirit wearing a cat's shape as a disguise.<br><br>He's a spiritual familiar — likely from an old, uncommon lineage tied to protection, memory, and boundaries. Exactly where that lineage started is still unclear, and may stay that way. What's certain is that his abilities didn't arrive finished. They grew out of his life, his bonds, and the choices he kept making.",
    24: "San lets herself sit with something she's known all along, really: she named him before she understood one single thing about him.<br><br>\"Soel\" was never a sacred title, never chosen for any deeper reason than that it was the name she wanted for a small, frightened cat she was determined to keep alive.<br><br>That doesn't make it less meaningful. If anything, it makes it more.<br><br>Soel climbs into her arms, settles in against her — and bites her.<br><br>\"Yeah,\" Joel says. \"That's him, alright.\"",
    25: "Whatever Soel's abilities are settling into, they've found a clearer shape by now: a spiritual blessing when it's needed, an early sense for hidden danger, protection against magical disturbances, some limited pull toward the boundaries, a steadying presence for the crew when things get bad, and every so often, guidance through places ordinary navigation just can't reach.<br><br>All of that, and he's still a cat first. He still hunts. He still vanishes for hours at a time. He still sleeps in the single most inconvenient spot on the ship, every time, without fail. He still causes trouble on a completely ordinary, completely unmagical schedule.",
    26: "The arc closes with Soel resting somewhere on the Crimson Tide, same as any other evening, while the crew sails on toward whatever's next.<br><br>Renn and Erynn are still going back and forth about what he actually is. They probably always will be.<br><br>Mimi offers the quieter read on it: maybe the real question was never what Soel was before them. Maybe it's what he's become with them.<br><br>San looks down at him.<br><br>\"He's always been part of the crew,\" Joel says. Not a theory. Just true.<br><br>Somewhere beneath the sea, something distant moves.<br><br>Soel notices it first. One amber eye, already open.<br><br><em>Some mysteries wait beyond the horizon. Others sleep beside us.</em>"
  };
  window.ARC9_CHAPTER_SCENES = ARC9_CHAPTER_SCENES;

  window.markArc9ChapterRead = function(id){
    id = Number(id);
    // Ch.12 goes through startArc9Ch12Battle() -> the 'arc9_ch12' win branch
    // in handleVictory() instead — it needs to be won, not just read. This
    // guard stops the generic mark-as-read path from being called on it
    // directly (e.g. a stale button reference) and short-circuiting the
    // fight entirely.
    if (id === 12) { toast('⚔️ This chapter is a battle — use the fight button, not mark-as-read.'); return; }
    const ch = ARC9_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc9] no chapter data for id', id); return; }
    game.comicProgress9 = game.comicProgress9||{};
    if(game.comicProgress9[id]){ toast('✓ Already marked read.'); return; }
    if(window.arc9ObjectiveState() !== 'complete_arc9_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress9[id] = true;
    // Narratively load-bearing beats get a flag for later content to
    // check — no functional system attached to any of them yet, matching
    // Arc VIII's own restraint.
    if (id === 11) game.soelCategoryIntroduced = true; // guardian/guide/witness/companion framing
    if (id === 17) game.soelBoundaryLink = true; // boundary reacted to Soel specifically, not machinery/research
    if (id === 21) {
      game.soelChoseToStay = true; // the central choice of the arc
      // Nala joins the Fair Tide roster here — not the active party, not
      // a combat companion (see the "tower cat stays at its tower, not
      // the crew" note above), just recognized as part of Fair Tide's
      // wider network from this point on, the same loose affiliation
      // every other roster figure already has.
      game.fairTideRoster = game.fairTideRoster || {};
      if (!game.fairTideRoster['nala']) {
        game.fairTideRoster['nala'] = {name: 'Nala', role: 'Tower Guardian', icon: '🐈', desc: "Senedra's tower cat. Stays at her tower, but Fair Tide counts her as one of its own now."};
      }
    }
    if (id === 23) game.soelTrueNatureKnown = true; // "not a god" — the broad reveal
    if (id === 26) { game.arc9Complete = true; }
    gainXP(ch.xp);
    game.reputation = (game.reputation||0) + (id === 26 ? 5 : 1);
    logEvent('📖 Arc 9 Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if (ARC9_CHAPTER_SCENES[id] && typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({ title: ch.title, blurb: ARC9_CHAPTER_SCENES[id] });
    }
    if(typeof saveGame==='function') saveGame();
    if(typeof renderMainGoal==='function') renderMainGoal();
    if(typeof renderStory==='function') renderStory();
  };

  // -------------------------------------------------------------------
  // Ch.12 — "The Price of a Blessing". The chapter text says Soel
  // overextends himself protecting several crew at once and comes back
  // weak and withdrawn — so unlike every other Arc IX chapter (pure
  // narrative, generic mark-as-read), this one is the actual fight,
  // not a recap of one. Wired the same way Arc I's guardian fights are:
  // a dedicated enemy.kind branch inside handleVictory() (the existing
  // enemy.kind==='guardian'/'final'/'memory' chain a bit above this)
  // completes the chapter on win instead of a companion recruit.
  //
  // The "weak and withdrawn" line gets an actual mechanical cost: since
  // Soel's own kit runs on 0 MP (unkillable spirit cat, free-cost
  // abilities), draining MP would be a no-op — so his HP drops to a
  // sliver instead (see the enemy.kind==='arc9_ch12' branch in
  // handleVictory for the actual implementation). Recovers through the
  // exact same systems any other weakened party member already uses
  // (rest, a healer's spell, potions) — a felt consequence, not a new
  // mechanic or a punishing debuff.
  //
  // Difficulty reuses the 'guardian' story-scaling curve in
  // scaleCrimsonEnemy() (tuned to a fixed story level rather than
  // whatever level the player happens to be at by the time they reach
  // this chapter) pinned to Arc IX's own level gate (135), since this
  // is a guardian-tier spiritual threat in every way that matters
  // except the recruit-a-companion payoff guardians normally have.
  // -------------------------------------------------------------------
  const ARC9_CH12_ENEMY = {
    name: 'Tide-Worn Remnants', icon: '👻', hp: 260, dmg: 34, xp: 320, gold: 220,
    trophy: {icon: '🕯️', name: 'Guttered Ward-Candle'},
    desc: 'Restless spiritual residue drawn to the crew, the kind ordinary steel barely touches — the sort of threat only something like Soel can actually hold off.'
  };

  window.startArc9Ch12Battle = function(){
    if (game.comicProgress9?.[12]) { toast('✓ Already complete.'); return; }
    if (window.arc9ObjectiveState() !== 'complete_arc9_chapter_12') { toast('🔒 Follow the current Objective first.'); return; }
    const enemy = scaleCrimsonEnemy(ARC9_CH12_ENEMY, 'guardian', 135);
    startCombat({ kind: 'arc9_ch12', key: 'arc9_ch12', enemy });
  };


  window.__ctShowArc9Splash = function(){
    const overlay = document.getElementById('arc9SplashOverlay');
    if(!overlay) return;
    overlay.style.display='flex'; overlay.classList.add('active'); overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    window.scrollTo({top:0,left:0,behavior:'instant'});
    game.arc9SplashSeen = true;
    if(typeof saveGame==='function') saveGame();
  };
  window.__ctCloseArc9Splash = function(){
    const overlay = document.getElementById('arc9SplashOverlay');
    if(overlay){ overlay.style.display='none'; overlay.classList.remove('active'); overlay.setAttribute('aria-hidden','true'); }
    document.body.style.overflow='';
  };

  const oldRenderStoryForArc9 = window.renderStory;
  window.renderStory = function(){
    if(oldRenderStoryForArc9) oldRenderStoryForArc9();
    const container = document.getElementById('storyContent');
    if(!container) return;
    const arc9Ready = typeof window.arc9ObjectiveState==='function' && window.arc9ObjectiveState()!==null;
    if(arc9Ready && !game.arc9SplashSeen && typeof window.__ctShowArc9Splash==='function'){
      window.__ctShowArc9Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc9/arc9-cover-soel.png" alt="Arc IX — The Cat Who Was Always There" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc IX</div><div class="story-act-title">The Cat Who Was Always There</div>'+
      '<div class="story-act-tagline">Chapters 1-'+ARC9_CHAPTERS.length+' of 26. Some mysteries were beside us all along.</div></div>';
    if(!arc9Ready){
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc IX Locked</div><div class="story-chapter-sub">'+
        (!game.arc8Complete ? 'Finish Arc VIII first.' : 'Reach Level 135 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc9ObjectiveState();
    ARC9_CHAPTERS.forEach(ch=>{
      const done = !!game.comicProgress9?.[ch.id];
      const ready = !done && so===('complete_arc9_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if(ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
        (ch.id === 12
          ? '<button class="btn btn-small btn-success" onclick="startArc9Ch12Battle()">'+esc(ch.action || '⚔️ Protect the Crew')+'</button>'
          : '<button class="btn btn-small btn-success" onclick="markArc9ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>');
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if(so==='arc9_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc IX chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };

  const oldRenderComicArchiveForArc9 = window.renderComicArchive;
  window.renderComicArchive = function(){
    if(oldRenderComicArchiveForArc9) oldRenderComicArchiveForArc9();
    const el = document.getElementById('comicArchive'); if(!el) return;
    const progress9 = (typeof game!=='undefined' && game.comicProgress9) || {};
    const arc9Read = ARC9_CHAPTERS.filter(ch=>!!progress9[ch.id]);
    const section = !arc9Read.length
      ? '<div class="comic-archive-card"><div class="comic-archive-sub">No Arc IX chapters read yet.</div></div>'
      : arc9Read.map(ch=>'<div class="comic-archive-card"><div class="comic-archive-title">Chapter '+ch.id+' — '+esc(ch.title)+'</div>'+
          '<button class="btn btn-small" style="margin-top:6px;" onclick="openComicImage(\''+ch.image+'\')">📖 Read Again</button></div>').join('');
    el.insertAdjacentHTML('beforeend',
      '<div class="comic-archive-title" style="font-size:1.05rem;margin:18px 0 6px;">Arc IX — The Cat Who Was Always There</div>' + section);
  };
})();


(function(){
  // Random named rivals for the "Rival Pirate Frigate" sea encounter
  // (SEA_ENEMIES.rival_frigate) — previously every single one of these
  // fights displayed as the exact same generic "Rival Pirate Frigate",
  // no matter how many you sank. This gives each encounter a random
  // captain's name drawn from a Chinese/Malay/Filipino pool (matching the
  // game's own Southeast Asian setting), purely as display flavor.
  //
  // Deliberately NOT a new enemy key: this wraps scaledEnemyForExplore and
  // only overrides the returned object's .name/.desc when key==='rival_frigate'.
  // The key itself — what startCombat and checkBountyProgress('kill', key, 1)
  // actually key off — is untouched, so every one of these randomly-named
  // frigates still fully counts toward "Rival's Bounty" / "The Shrine's
  // Toll" / "Hunt: Rival Pirate Frigate" exactly as before. Same pattern
  // Robin/Jeff already use (named individuals riding on the existing
  // HARBOR_ENEMIES/SEA_ENEMIES pipeline) — just randomized instead of fixed.
  const SEA_RIVAL_CAPTAIN_NAMES = [
    // Chinese
    "Captain Lim Wei Kang", "Captain Tan Boon Hock", "Captain Ng Ah Kow",
    "Captain Chen Mei Ling", "Captain Wong Siew Fong", "Captain Ho Chun Kit",
    // Malay
    "Nakhoda Rashid", "Nakhoda Aminah binti Salleh", "Nakhoda Zulkifli",
    "Nakhoda Hassan bin Ismail", "Nakhoda Siti Norhayati", "Nakhoda Ariffin",
    // Filipino
    "Kapitan dela Cruz", "Kapitan Bagyo Santos", "Kapitan Reyes",
    "Kapitan Marisol Aquino", "Kapitan Villanueva", "Kapitan Dimaguiba"
  ];
  window.SEA_RIVAL_CAPTAIN_NAMES = SEA_RIVAL_CAPTAIN_NAMES;

  const oldScaledEnemyForExploreForRivals = window.scaledEnemyForExplore;
  window.scaledEnemyForExplore = function(key, kind){
    const enemy = oldScaledEnemyForExploreForRivals.apply(this, arguments);
    if (key === 'rival_frigate' && enemy) {
      const captain = SEA_RIVAL_CAPTAIN_NAMES[Math.floor(Math.random() * SEA_RIVAL_CAPTAIN_NAMES.length)];
      enemy.name = captain + "'s Frigate";
      enemy.desc = 'A black-sailed frigate bearing down, cannons already run out — flying ' + captain + "'s colors.";
    }
    return enemy;
  };
})();


(function(){
  // -------------------------------------------------------------------
  // BOND / AFFINITY SYSTEM. Three tracks, native to Crimson Tide rather
  // than ported from Daybreak's per-battle system (which San said scaled
  // to 6 digits far too fast to feel meaningful). Deliberately a once-
  // per-day repeatable ACTION per track — same shape as Training Room —
  // rather than a passive byproduct of combat, so growth stays a real
  // choice with real pacing instead of an unbounded grind number.
  //
  // Bonuses are synergies, not flat always-on stats: each tier's bonus
  // only applies while the bonded character(s) are actually in the
  // fielded active party. Bond points keep accumulating either way —
  // only the BONUS itself is conditional, the progress never is.
  //
  // San & Joel folds in the existing "Bonded by the Tide" flag (Arc V
  // Ch.4 — flat +5% HP/MP, ~8% damage reduction, a haste windfall off
  // Shield Wall) as tier 1 exactly as it already worked, unlocked by
  // that chapter rather than points — accumulated points push it
  // further into tiers 2+ with bigger versions of the same effects.
  // San & Crew and San & The Later Trio (Mimi/Renn/Erynn) are both
  // brand new, and route their bonuses through the existing
  // getReputationBonus() aggregator (see ct-build-v91-reputation-ranks)
  // rather than new combat hook points, the same way Ch.4's civilian
  // roles already do — so no new call sites needed in combat math for
  // either of those two.
  // -------------------------------------------------------------------
  const BOND_POINTS_PER_ACTION = 15;

  const SAN_JOEL_TIERS = [
    {threshold:0,   name:'Not Yet Bonded',       hpMpPct:0,  dmgReductionPct:0,  hasteTurns:0, hastePct:0},
    {threshold:0,   name:'Bonded by the Tide',   hpMpPct:5,  dmgReductionPct:8,  hasteTurns:2, hastePct:10}, // tier 1 — unlocked by Arc V Ch.4, not points, matches the original mechanic exactly
    {threshold:100, name:'Steady as the Tide',   hpMpPct:8,  dmgReductionPct:11, hasteTurns:2, hastePct:13},
    {threshold:250, name:'Anchored Together',    hpMpPct:11, dmgReductionPct:14, hasteTurns:3, hastePct:16},
    {threshold:500, name:'Two Hearts, One Ship', hpMpPct:15, dmgReductionPct:18, hasteTurns:3, hastePct:20}
  ];
  const SAN_CREW_TIERS = [
    {threshold:0,   name:'Strangers Still',      bonus:0},
    {threshold:50,  name:'Getting to Know Them', bonus:0.02},
    {threshold:150, name:'Trusted Hands',        bonus:0.04},
    {threshold:300, name:'Found Family',         bonus:0.06},
    {threshold:600, name:'This Is Home',         bonus:0.08}
  ];
  const SAN_TRIO_TIERS = [
    {threshold:0,   name:'Just Colleagues',        bonus:0},
    {threshold:50,  name:'Comparing Notes',        bonus:0.02},
    {threshold:150, name:'Three Minds, One Idea',  bonus:0.04},
    {threshold:300, name:'The Research Circle',    bonus:0.06},
    {threshold:600, name:'Kindred Curiosity',      bonus:0.08}
  ];

  const BOND_TRACKS = {
    san_joel: {label:'San & Joel', icon:'⚓', tiers:SAN_JOEL_TIERS, members:['san','joel'],
      actionLabel:'Spend a quiet evening with Joel', flavor:'A quiet moment together, away from the crew.'},
    san_crew: {label:'San & Crew', icon:'👥', tiers:SAN_CREW_TIERS, minCrewCount:3,
      actionLabel:'Spend time with the crew', flavor:'An evening on deck with whoever\'s around.'},
    san_trio: {label:'San & The Later Trio', icon:'🔮', tiers:SAN_TRIO_TIERS, members:['mimi','renn','erynn'],
      actionLabel:'Sit in on their research', flavor:'Mimi, Renn, and Erynn, deep in an argument about something San only half-understands.'}
  };
  window.BOND_TRACKS = BOND_TRACKS;

  function bondState(){
    game.bonds = game.bonds || {};
    Object.keys(BOND_TRACKS).forEach(k => { game.bonds[k] = game.bonds[k] || {points:0, lastSpentDay:-1}; });
    return game.bonds;
  }
  window.bondState = bondState;

  // Tier index for a track, given its raw points. San & Joel additionally
  // needs Ch.4 read to unlock tier 1 at all (see bondTier below) — the
  // other two tracks have no chapter gate, tier 1 is just the first
  // point threshold like any normal tier ladder.
  function tierIndexForPoints(tiers, points){
    let idx = 0;
    for (let i=0;i<tiers.length;i++){ if (points >= tiers[i].threshold) idx = i; }
    return idx;
  }

  window.bondTier = function(trackKey){
    const track = BOND_TRACKS[trackKey];
    if (!track) return 0;
    if (trackKey === 'san_joel' && !(game.comicProgress5 && game.comicProgress5[4])) return 0;
    const points = bondState()[trackKey].points;
    return tierIndexForPoints(track.tiers, points);
  };

  window.bondTierDef = function(trackKey){
    const track = BOND_TRACKS[trackKey];
    if (!track) return null;
    return track.tiers[window.bondTier(trackKey)];
  };

  // Whether the bonded character(s) are actually fielded right now — the
  // synergy condition. San & Crew uses a headcount instead of named
  // members (any 3+ non-San crew in the active party); the other two
  // need their specific named members all present.
  window.bondSynergyActive = function(trackKey){
    const track = BOND_TRACKS[trackKey];
    if (!track) return false;
    if (window.bondTier(trackKey) < 1) return false;
    const party = (typeof getActiveParty === 'function') ? getActiveParty() : [];
    const activeIds = new Set(party.map(m=>m.id));
    if (track.minCrewCount) {
      const crewCount = party.filter(m => m.id !== 'san').length;
      return crewCount >= track.minCrewCount;
    }
    return track.members.every(id => {
      if (!activeIds.has(id)) return false;
      const hp = (game.partyHp && game.partyHp[id] != null) ? game.partyHp[id] : 1;
      return hp > 0;
    });
  };

  window.canSpendTimeOnBond = function(trackKey){
    const bs = bondState()[trackKey];
    if (!bs) return false;
    return bs.lastSpentDay !== game.day;
  };

  window.spendTimeWithBond = function(trackKey){
    const track = BOND_TRACKS[trackKey];
    if (!track) return;
    if (!window.canSpendTimeOnBond(trackKey)) { toast('Already spent time on this today.'); return; }
    const bs = bondState()[trackKey];
    bs.points += BOND_POINTS_PER_ACTION;
    bs.lastSpentDay = game.day;
    const newTier = window.bondTier(trackKey);
    toast('💞 ' + track.flavor, 3200);
    logEvent('💞 ' + track.label + ': +' + BOND_POINTS_PER_ACTION + ' bond points.', 'good');
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  // -------------------------------------------------------------------
  // San & Joel — replaces the old standalone bondedTideActive() with a
  // tier-aware version. Tier 1's gate (Ch.4 read + both alive+fielded)
  // is EXACTLY the original condition, so every existing call site that
  // already checks bondedTideActive() keeps working unchanged. What
  // changes is that those call sites now pull their actual numbers from
  // the current tier instead of hardcoded 1.05/0.92/2-turns/10% — so
  // tiers 2+ scale those same three effects up automatically.
  // -------------------------------------------------------------------
  window.bondedTideActive = function(){
    if (window.bondTier('san_joel') < 1) return false;
    const activeIds = new Set((typeof getActiveParty==='function' ? getActiveParty() : []).map(m=>m.id));
    if(!activeIds.has('san') || !activeIds.has('joel')) return false;
    const sanHp = (game.partyHp && game.partyHp['san'] != null) ? game.partyHp['san'] : 1;
    const joelHp = (game.partyHp && game.partyHp['joel'] != null) ? game.partyHp['joel'] : 1;
    return sanHp > 0 && joelHp > 0;
  };
  window.sanJoelBondValues = function(){
    return SAN_JOEL_TIERS[window.bondTier('san_joel')] || SAN_JOEL_TIERS[0];
  };

  // -------------------------------------------------------------------
  // San & Crew (gold+xp) and San & Trio (crit) bonuses feed into the
  // same getReputationBonus() aggregator every other bonus source
  // already uses (reputation ranks, roster bonuses, civilian roles) —
  // wrapping it here rather than reaching into ct-build-v91's closure
  // directly, same cross-block pattern already established for those.
  // Only active while each track's synergy condition is actually true
  // right now (bonded members fielded) — unlike the other sources here,
  // this one can turn on and off turn to turn depending on party comp.
  // -------------------------------------------------------------------
  const oldGetReputationBonusForBonds = window.getReputationBonus;
  window.getReputationBonus = function(statKey){
    let total = oldGetReputationBonusForBonds ? oldGetReputationBonusForBonds(statKey) : 0;
    if (window.bondSynergyActive('san_crew')) {
      const def = SAN_CREW_TIERS[window.bondTier('san_crew')];
      if (def && (statKey === 'goldBonus' || statKey === 'xpBonus')) total += def.bonus;
    }
    if (window.bondSynergyActive('san_trio')) {
      const def = SAN_TRIO_TIERS[window.bondTier('san_trio')];
      if (def && statKey === 'critBonus') total += def.bonus;
    }
    return total;
  };

  // -------------------------------------------------------------------
  // Fair Tide Hub tab.
  // -------------------------------------------------------------------
  const oldRenderFairTideHubForBonds = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-bonds');
    const btn = document.getElementById('ft-tab-btn-bonds');
    if (el) el.classList.toggle('active', tab==='bonds');
    if (btn) btn.classList.toggle('active', tab==='bonds');
    if (oldRenderFairTideHubForBonds) oldRenderFairTideHubForBonds();
    // BUG FIX (San's report — the San/Joel disagreement panel never
    // showing on the Bonds tab, even after Ch.14 triggers it): this bare
    // renderBondsTab() call is lexically inside the SAME IIFE as this
    // file's own renderBondsTab() declaration below, so it always
    // resolved to that local, closure-scoped function — regardless of
    // arc16-and-bonding.js later wrapping window.renderBondsTab to add
    // the disagreement panel. A bare call from within the same closure
    // that declared the function can never see a later wrap made by a
    // different file; only going through window. explicitly picks up
    // whichever version is currently the latest-wrapped one.
    if (tab==='bonds' && typeof window.renderBondsTab === 'function') window.renderBondsTab();
  };

  function renderBondsTab(){
    const el = document.getElementById('ft-tab-bonds');
    if (!el) return;
    let html = '<div class="panel-title">💞 Bonds</div>'+
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">Once a day per bond. The stronger the bond, the better it is to have them at your side — but only while they actually are.</p>';
    Object.keys(BOND_TRACKS).forEach(key=>{
      const track = BOND_TRACKS[key];
      const tierIdx = window.bondTier(key);
      const tierDef = track.tiers[tierIdx];
      const nextTier = track.tiers[tierIdx+1];
      const points = bondState()[key].points;
      const synergyActive = window.bondSynergyActive(key);
      const canSpend = window.canSpendTimeOnBond(key);
      const gatedOut = key==='san_joel' && !(game.comicProgress5 && game.comicProgress5[4]);
      let bonusText;
      if (key === 'san_joel') {
        bonusText = tierIdx < 1 ? 'No bond yet.' : ('+' + tierDef.hpMpPct + '% HP/MP · -' + tierDef.dmgReductionPct + '% damage taken · haste on Shield Wall');
      } else {
        bonusText = tierIdx < 1 ? 'No bond yet.' : ('+' + Math.round(tierDef.bonus*100) + '% ' + (key==='san_crew' ? 'gold & XP' : 'crit chance'));
      }
      html += '<article class="quest-item"><strong>'+track.icon+' '+esc(track.label)+'</strong> — <span style="opacity:.8;">'+esc(tierDef.name)+'</span><br>'+
        '<span style="font-size:.78rem;opacity:.75;">'+bonusText+'</span><br>'+
        '<span style="font-size:.76rem;opacity:.7;">'+(synergyActive?'✅ Active right now':'⚪ Not active — bonded members must be fielded')+'</span>'+
        (nextTier ? '<br><span style="font-size:.74rem;opacity:.6;">'+points+' / '+nextTier.threshold+' to next tier</span>' : '<br><span style="font-size:.74rem;opacity:.6;">Max tier reached</span>')+
        (gatedOut
          ? '<br><span style="font-size:.76rem;opacity:.65;">🔒 Continue Arc V to unlock.</span>'
          : '<div style="margin-top:6px;"><button class="btn btn-small btn-success" '+(canSpend?'':'disabled')+' onclick="spendTimeWithBond(\''+key+'\')">💞 '+esc(track.actionLabel)+'</button></div>')+
        '</article>';
    });
    el.innerHTML = html;
  }
  // BUG FIX (San's report — the normal daily bond-action buttons
  // disappearing entirely, leaving only the disagreement panel): this
  // function was never actually exposed as window.renderBondsTab — only
  // ever the bare, closure-local name. arc16-and-bonding.js's wrap reads
  // window.renderBondsTab as "the base function to chain to" before
  // adding the disagreement panel; since that was undefined until the
  // wrap itself first set it, the wrap's captured "base" was never
  // callable, so this real card-building logic silently never ran at
  // all under the new call path from V219's own fix.
  window.renderBondsTab = renderBondsTab;
})();


(function(){
  // -------------------------------------------------------------------
  // CAPTAIN'S QUARTERS — a rest space at Fair Tide for San, Joel, and
  // the crew. Unlimited, unlike every other rest option (freeRestAtPort
  // and restAtTavern both share one daily allowance via game.freeRestDay —
  // see their own comments) — home doesn't run out of nights to offer.
  // Used to share that same daily lock with freeRestAtPort, which meant
  // resting here used up your one daily rest everywhere else too; that's
  // backwards for the one place explicitly meant to always be available.
  // -------------------------------------------------------------------
  window.restInCaptainsQuarters = function(){
    game.partyHp = game.partyHp || {};
    game.partyMp = game.partyMp || {};
    const permanent = typeof getActiveParty === 'function' ? getActiveParty() : [];
    permanent.forEach(m => {
      game.partyHp[m.id] = effectiveMaxHp(m);
      game.partyMp[m.id] = effectiveMaxMp(m);
    });
    (game.temporaryCrew || []).forEach(m => {
      game.partyHp[m.id] = Number(m.maxHp || m.hp || 1);
      game.partyMp[m.id] = Number(m.maxMp || m.mp || 0);
    });
    if ('health' in game && 'maxHealth' in game) game.health = game.maxHealth;
    logEvent('🏠 The crew rests in the Captain\'s Quarters. Everyone is fully recovered — no danger here, not tonight.', 'good');
    toast('🏠 A quiet night at Fair Tide. Everyone is fully recovered.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  const oldRenderFairTideHubForQuarters = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-quarters');
    const btn = document.getElementById('ft-tab-btn-quarters');
    if (el) el.classList.toggle('active', tab==='quarters');
    if (btn) btn.classList.toggle('active', tab==='quarters');
    if (oldRenderFairTideHubForQuarters) oldRenderFairTideHubForQuarters();
    if (tab==='quarters') renderQuartersTab();
  };

  function renderQuartersTab(){
    const el = document.getElementById('ft-tab-quarters');
    if (!el) return;
    let html = '<div class="panel-title">🏠 Captain\'s Quarters</div>'+
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">San and Joel\'s quarters — and, whenever the crew needs it, everyone else\'s too. The one place on this whole voyage nobody has to keep one eye on the door.</p>'+
      '<article class="quest-item"><strong>🛏️ Rest Here</strong><br>'+
      '<span style="font-size:.8rem;opacity:.8;">FREE · Unlimited · Recover 100% HP/MP · No encounter risk — you\'re home.</span><br>'+
      '<button class="btn btn-small btn-success" style="margin-top:6px;" onclick="restInCaptainsQuarters()">🏠 Rest in the Quarters</button>';
    html += '</article>';
    el.innerHTML = html;
  }
})();


(function(){
  // -------------------------------------------------------------------
  // PARTY FIELDING. Until now, getCrimsonCombatParty() fielded every
  // single unlocked companion in every fight — no cap, no bench, no
  // choice. With 17+ named companions now, that's unsustainable and
  // makes ship-tier "crew capacity" numbers meaningless (San confirmed
  // this was set up once and never actually came into play).
  //
  // Deliberately decoupled from Fair Tide's physical location — swapping
  // who's fielded is a roster decision, available from the Crew screen
  // anywhere, not something requiring a multi-day voyage back home. San
  // is always fielded and doesn't count against the swappable slots.
  // Everyone not currently fielded is framed as "at Fair Tide" — narrative
  // home base, not literally left behind mid-voyage.
  //
  // getActiveParty() itself is untouched — it still means "everyone
  // unlocked," and stays that way for equipment eligibility, the crew
  // strip display, etc., none of which should be restricted by fielding.
  // Only getCrimsonCombatParty() (the actual combat participant list)
  // changes to read from the new fielded subset instead.
  // -------------------------------------------------------------------
  window.getShipFieldCap = function(){
    const vessel = (typeof currentVessel === 'function') ? currentVessel() : null;
    return Number(vessel && vessel.fieldCap) || 4;
  };

  // San (protagonist, always aboard) and Soel (her spirit familiar) don't
  // consume a fielding slot — a familiar rides along with the person it's
  // bonded to rather than competing for room in the party roster. Soel can
  // still be voluntarily sent to Fair Tide like anyone else; she just never
  // counts against fieldCap, and fielding her never fails on a full party.
  // Joel joins this list too — San and Joel are the emotional core of the
  // story and (from Arc V on, see getRequiredFieldedIds) can't be fielded
  // without each other anyway, so he shouldn't cost a slot either.
  const FREE_FIELD_IDS = new Set(['san', 'soel', 'joel']);
  window.isFreeFieldId = function(id){ return FREE_FIELD_IDS.has(id); };

  // Self-healing rather than hooked into every companion-recruitment call
  // site (there are dozens, across every arc) — auto-fills open slots
  // with newly-unlocked companions the next time this is called, instead
  // of needing every single recruitment moment to remember to field them.
  // -------------------------------------------------------------------
  // Story-required fielding. Certain companions are essential to the
  // current arc's narrative and can't be benched while it's active —
  // matches classic-RPG "this character is locked into your party for
  // this dungeon" conventions. Cumulative: Arc VIII's requirement
  // includes Arc VII's, which includes Arc VI's. Uses the highest arc
  // actually reached (gate open, not necessarily finished) — refined
  // against the real chapter text rather than a clean arc-boundary
  // guess: Mimi doesn't become part of the working trio until partway
  // through Arc VII (Ch.9-10), so she's only required from Arc VIII, not
  // from Arc VII's start alongside Erynn. Only applies once a companion
  // is genuinely unlocked — Erynn isn't force-fielded during the window
  // where Arc VII is reachable but he hasn't actually joined yet (he
  // recruits at Ch.23).
  // -------------------------------------------------------------------
  window.getRequiredFieldedIds = function(){
    let required = [];
    // BUG FIX: this used to be `required = [...]` (reassignment) at each
    // arc check, so a later arc's list had to remember to re-include every
    // earlier arc's requirement by hand — fragile, and would have broken
    // silently the moment Joel's requirement (below) needed to survive
    // into Arc VI+ without arc6's line explicitly re-listing him. Push
    // instead, so each condition only ever adds its own id.
    if (typeof window.arc5ObjectiveState === 'function' && window.arc5ObjectiveState() !== null) required.push('joel');
    if (typeof window.arc6ObjectiveState === 'function' && window.arc6ObjectiveState() !== null) required.push('renn');
    if (typeof window.arc7ObjectiveState === 'function' && window.arc7ObjectiveState() !== null) required.push('erynn');
    if (typeof window.arc8ObjectiveState === 'function' && window.arc8ObjectiveState() !== null) required.push('mimi');
    const unlockedIds = new Set((typeof getActiveParty === 'function' ? getActiveParty() : []).map(m => m.id));
    return required.filter(id => unlockedIds.has(id));
  };

  window.getFieldedIds = function(){
    game.fieldedIds = game.fieldedIds || ['san'];
    // BUG FIX: tracks who's ever had a fielding decision made for them —
    // fielded OR explicitly benched — separately from who's currently
    // fielded. Without this, sending someone to Fair Tide only lasted
    // until the next call to this function, since the auto-fill loop
    // below couldn't tell "never decided yet" apart from "player chose
    // to bench them" and would cheerfully re-add them into any open slot.
    game.fieldingDecided = game.fieldingDecided || ['san'];
    if (!game.fieldedIds.includes('san')) game.fieldedIds.unshift('san');
    if (!game.fieldingDecided.includes('san')) game.fieldingDecided.unshift('san');
    const unlockedIds = new Set((typeof getActiveParty === 'function' ? getActiveParty() : []).map(m => m.id));
    // Drop anyone no longer actually unlocked (defensive — shouldn't
    // normally happen once someone's joined, but keeps this safe).
    game.fieldedIds = game.fieldedIds.filter(id => unlockedIds.has(id));
    const cap = window.getShipFieldCap();
    const party = (typeof getActiveParty === 'function' ? getActiveParty() : []);
    for (const m of party) {
      if (game.fieldingDecided.includes(m.id)) continue; // already decided, fielded or not — leave the player's choice alone
      game.fieldingDecided.push(m.id);
      const nonExemptCount = game.fieldedIds.filter(id => !FREE_FIELD_IDS.has(id)).length;
      if (FREE_FIELD_IDS.has(m.id) || nonExemptCount < cap) game.fieldedIds.push(m.id);
      // else: newly unlocked with no room — starts at Fair Tide, which is the expected default when the party's already full
    }
    // Force-include story-required companions, taking priority over
    // whatever was auto-filled or previously chosen — bumps the most
    // recently-added optional pick out if the cap would otherwise be
    // exceeded, so the cap itself stays a real, consistent limit.
    const required = window.getRequiredFieldedIds();
    required.forEach(reqId => {
      if (game.fieldedIds.includes(reqId)) return;
      if (FREE_FIELD_IDS.has(reqId)) { game.fieldedIds.push(reqId); return; }
      const nonExemptCount = game.fieldedIds.filter(id => !FREE_FIELD_IDS.has(id)).length;
      if (nonExemptCount >= cap) {
        for (let i = game.fieldedIds.length - 1; i >= 0; i--) {
          const candidateId = game.fieldedIds[i];
          if (!FREE_FIELD_IDS.has(candidateId) && !required.includes(candidateId)) {
            game.fieldedIds.splice(i, 1);
            break;
          }
        }
      }
      game.fieldedIds.push(reqId);
    });
    return game.fieldedIds;
  };

  window.getFieldedParty = function(){
    const ids = window.getFieldedIds();
    const party = (typeof getActiveParty === 'function' ? getActiveParty() : []);
    const byId = {}; party.forEach(m => { byId[m.id] = m; });
    return ids.map(id => byId[id]).filter(Boolean);
  };

  window.isFielded = function(id){
    return window.getFieldedIds().includes(id);
  };

  window.toggleFielded = function(id){
    if (id === 'san') { toast('San is always fielded.'); return; }
    // BUG FIX: Soel's own description says "chose San, and can't be
    // unchosen" — but only San herself was hard-blocked here, so Soel
    // could actually be benched despite that. Blocking him the same way.
    if (id === 'soel') { toast('Soel chose San. He goes wherever she goes.'); return; }
    const required = window.getRequiredFieldedIds();
    if (required.includes(id) && window.isFielded(id)) {
      const party = (typeof getActiveParty === 'function' ? getActiveParty() : []);
      const member = party.find(m => m.id === id);
      const name = member ? member.name : id;
      toast('📖 ' + name + ' is essential to the story right now and can\'t be sent to Fair Tide.');
      return;
    }
    const ids = window.getFieldedIds();
    const cap = window.getShipFieldCap();
    const exempt = FREE_FIELD_IDS.has(id);
    if (ids.includes(id)) {
      game.fieldedIds = ids.filter(fid => fid !== id);
      toast('⚓ Sent to Fair Tide.', 2200);
    } else {
      if (!exempt) {
        const nonExemptCount = ids.filter(fid => !FREE_FIELD_IDS.has(fid)).length;
        if (nonExemptCount >= cap) { toast('🚫 Fielded party is full (' + cap + '/' + cap + '). Send someone to Fair Tide first.'); return; }
      }
      game.fieldedIds = ids.concat([id]);
      toast(exempt ? '🐾 Fielded — familiars don\'t take a party slot.' : '⚔️ Fielded for the voyage.', 2200);
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderPartyScreen === 'function') renderPartyScreen();
  };

  // getCrimsonCombatParty's "permanent" list now comes from the fielded
  // subset instead of every unlocked companion. Temporary hired crew
  // (from the Tavern) are untouched — they were never part of this cap
  // and still just add on top, same as before.
  const oldGetCrimsonCombatPartyForFielding = window.getCrimsonCombatParty || (typeof getCrimsonCombatParty === 'function' ? getCrimsonCombatParty : null);
  window.getCrimsonCombatParty = function(){
    const full = oldGetCrimsonCombatPartyForFielding ? oldGetCrimsonCombatPartyForFielding() : [];
    // One-on-one training bouts (San's request), moved here after the
    // critical fix above — this only narrows the COMBAT participant list
    // itself, and never touches getActiveParty() or getFieldedIds(), so
    // it can't corrupt game.fieldedIds the way the original
    // implementation did. Applied against the FULL unlocked roster,
    // bypassing the fielding filter entirely — training was never
    // restricted to only currently-fielded companions (the original
    // "whole party spars against Joel" report implied everyone unlocked
    // could pile in), and the sparring partner themselves might not
    // currently be fielded for voyages at all.
    if (game.combatPartyOverride && game.combatPartyOverride.length) {
      return full.filter(m => m.temp || game.combatPartyOverride.indexOf(m.id) !== -1);
    }
    const fieldedIds = new Set(window.getFieldedIds());
    return full.filter(m => m.temp || fieldedIds.has(m.id));
  };
  // getCrimsonCombatParty is called as a bare identifier (not window.___)
  // throughout combat code, so it must also be reassigned directly, not
  // just exposed on window — same reason the wrap pattern elsewhere in
  // this codebase always double-checks whether it needs a bare-name
  // reassignment too.
  if (typeof getCrimsonCombatParty === 'function') {
    getCrimsonCombatParty = window.getCrimsonCombatParty;
  }
})();


(function(){
  // -------------------------------------------------------------------
  // RESEARCH EXPEDITION — a standalone side-activity for San, Joel,
  // Soel, and the research trio, unlocked once Arc VIII is complete.
  // Deliberately not tied to any chapter. Reuses the exact wave/streak
  // combat structure the Uncharted Reach already proved out (see
  // ct-build-v92), just with a different enemy pool, no gold/trophy
  // rewards, and two new banked resources — Knowledge and Residue
  // (named for the "strange magical residue" from Arc VIII Ch.18 —
  // this is that same substance, now being actively gathered) — instead
  // of gold. Neither resource is spendable yet; Arc IX+ will eventually
  // let San "renovate" the Horizon Engine the same way Fair Tide's
  // buildings already work, contributing what's been collected here.
  // The party used is just whatever's currently fielded — no separate
  // roster override needed, since by the time this unlocks (post-Arc
  // VIII), Renn/Erynn/Mimi are already story-required and Joel/Soel are
  // already free-field, so the "Horizon Team" forms naturally on its
  // own without any extra plumbing here.
  // -------------------------------------------------------------------
  const EXPEDITION_ENEMIES = {
    boundary_wisp:     {name:'Boundary Wisp',     icon:'✨', hp:180, dmg:12, xp:120, knowledge:8,  residue:2,  desc:'A flicker of something that shouldn\'t exist in open air.'},
    drifting_anomaly:  {name:'Drifting Anomaly',  icon:'🌀', hp:240, dmg:15, xp:150, knowledge:6,  residue:5,  desc:'Space folds slightly wrong around it. Nobody\'s eyes agree on its shape.'},
    farseer_construct: {name:'Farseer Construct', icon:'🗿', hp:340, dmg:20, xp:220, knowledge:12, residue:4,  desc:'An old guardian, built to watch a boundary that may not exist anymore.'},
    veyren_echo:       {name:'Veyren Echo',       icon:'👁️', hp:280, dmg:18, xp:190, knowledge:10, residue:6,  desc:'Not alive, exactly. A memory the world itself is still having.'},
    residue_wraith:    {name:'Residue Wraith',    icon:'🔮', hp:220, dmg:16, xp:170, knowledge:5,  residue:10, desc:'Made of the same substance Mimi, Renn, and Erynn brought back with them.'},
    marker_guardian:   {name:'Marker Guardian',   icon:'🪨', hp:400, dmg:22, xp:260, knowledge:14, residue:3,  desc:'Older than Varel\'s own records. It has been waiting for someone to ask the right question.'}
  };
  window.EXPEDITION_ENEMIES = EXPEDITION_ENEMIES;

  function expState(){ game.expedition = game.expedition || {active:false, wave:0, totalKills:0, totalKnowledge:0, totalResidue:0}; return game.expedition; }
  window.expeditionState = expState;

  function horizonEngineState(){
    game.horizonEngine = game.horizonEngine || {knowledge:0, residue:0};
    if (game.horizonEngine.dragonBlood === undefined) game.horizonEngine.dragonBlood = 0; // added once Dragon Blood exists as a real material (Arc X Ch.8) — see ct-build-v148
    return game.horizonEngine;
  }
  window.horizonEngineState = horizonEngineState;

  // Capped at 99% deliberately — actually completing the Horizon Engine
  // needs to stay a scripted story beat (Arc IX+), not something a
  // player can just grind their way past. 20 combined points = 1%.
  window.getHorizonEngineDevelopmentPct = function(){
    const h = horizonEngineState();
    return Math.min(99, Math.floor((h.knowledge + h.residue) / 20));
  };

  window.isExpeditionUnlocked = function(){
    return !!game.arc8Complete;
  };

  function expeditionEnemyPool(){
    return Object.entries(EXPEDITION_ENEMIES);
  }

  function generateExpeditionEnemy(wave){
    const pool = expeditionEnemyPool();
    const [key, base] = pool[Math.floor(Math.random()*pool.length)];
    const scaled = (typeof scaleCrimsonEnemy==='function') ? scaleCrimsonEnemy(base, 'harbor') : base;
    const streakMult = 1 + Math.max(0, wave-1) * 0.05;
    return {
      ...scaled,
      name: base.name,
      icon: base.icon,
      desc: base.desc,
      hp: Math.max(1, Math.round(scaled.hp * streakMult)),
      dmg: Math.max(1, Math.round((scaled.dmg||10) * streakMult)),
      xp: Math.max(1, Math.round(base.xp * streakMult)),
      gold: 0, // deliberately no gold from these — Knowledge/Residue are the point, not loot
      knowledge: Math.max(1, Math.round(base.knowledge * streakMult)),
      residue: Math.max(1, Math.round(base.residue * streakMult)),
      _expeditionKey: key
    };
  }

  window.spawnExpeditionWave = function(){
    const es = expState();
    es.active = true;
    es.wave++;
    const enemy = generateExpeditionEnemy(es.wave);
    toast('🔭 Research Expedition — Wave ' + es.wave + (es.wave>1 ? ' (+' + Math.round((es.wave-1)*5) + '% tougher)' : ''), 2600);
    startCombat({kind:'expedition', key: enemy._expeditionKey, enemy});
  };

  window.enterResearchExpedition = function(){
    if (!window.isExpeditionUnlocked()) { toast('🔒 Complete Arc VIII first.'); return; }
    const es = expState();
    es.active = true;
    es.wave = 0;
    es.totalKills = 0;
    es.totalKnowledge = 0;
    es.totalResidue = 0;
    window.spawnExpeditionWave();
  };

  window.continueResearchExpedition = function(){
    if (!expState().active) return;
    window.spawnExpeditionWave();
  };

  window.retreatResearchExpedition = function(){
    const es = expState();
    toast('🏳️ Expedition ends at wave ' + es.wave + '. Everything gathered is kept.', 3600);
    logEvent('🔭 Research Expedition ended at wave ' + es.wave + '. Knowledge: ' + es.totalKnowledge + ' · Residue: ' + es.totalResidue, 'gold');
    es.active = false;
    game.inCombat = false;
    game.pendingPostBattle = null;
    if (game.uncharted && game.uncharted.active) game.uncharted.active = false; // same stale-session guard as startCombat's own, belt and suspenders
    saveGameQuiet();
    if (typeof goScreen === 'function') goScreen('fairtide');
    if (typeof window.switchFairTideTab === 'function') window.switchFairTideTab('expedition');
  };

  // -------------------------------------------------------------------
  // Victory hook — mirrors the Uncharted Reach's own hook (top-up grant
  // on top of whatever gainXP already awarded, not reaching back to
  // modify it) but banks Knowledge/Residue into BOTH this run's totals
  // and the permanent Horizon Engine bank, instead of gold.
  // -------------------------------------------------------------------
  const oldHandleVictoryForExpedition = window.handleVictory;
  window.handleVictory = function(){
    if (oldHandleVictoryForExpedition) oldHandleVictoryForExpedition();
    const enemy = game.combatEnemy;
    if (!enemy || enemy.kind !== 'expedition') return;
    const es = expState();
    es.totalKills++;
    // Knowledge/Residue existed to build the Horizon Engine — once Arc
    // XII's first crossing actually happens, that purpose is fulfilled.
    // Research Expedition keeps running afterward (XP, gold, Dragon
    // Blood, trinkets all still granted via the base victory handler and
    // the separate wyvern wrap below), just without the now-pointless
    // research currencies.
    if (!game.arc12Complete) {
      const he = horizonEngineState();
      es.totalKnowledge += enemy.knowledge;
      es.totalResidue += enemy.residue;
      he.knowledge += enemy.knowledge;
      he.residue += enemy.residue;
      logCombat('🔭 +' + enemy.knowledge + ' Knowledge, +' + enemy.residue + ' Residue.');
    }
  };

  // -------------------------------------------------------------------
  // Fair Tide Hub tab — a real dedicated screen, not log entries, per
  // the whole point of building this as something San can actually see.
  // -------------------------------------------------------------------
  const oldRenderFairTideHubForExpedition = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-expedition');
    const btn = document.getElementById('ft-tab-btn-expedition');
    if (el) el.classList.toggle('active', tab==='expedition');
    if (btn) btn.classList.toggle('active', tab==='expedition');
    if (oldRenderFairTideHubForExpedition) oldRenderFairTideHubForExpedition();
    if (tab==='expedition') renderExpeditionTab();
  };

  function renderExpeditionTab(){
    const el = document.getElementById('ft-tab-expedition');
    if (!el) return;
    if (!window.isExpeditionUnlocked()) {
      el.innerHTML = '<div class="panel-title">🔭 Research Expedition</div>'+
        '<div class="story-chip">🔒 Complete Arc VIII to unlock. The Horizon Team isn\'t ready to go looking for trouble on its own yet.</div>';
      return;
    }
    const he = horizonEngineState();
    const es = expState();
    const pct = window.getHorizonEngineDevelopmentPct();
    let html = '<div class="panel-title">🔭 Research Expedition</div>'+
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">San, Joel, Soel, and the Horizon Team go looking for whatever\'s still out there. Whatever they bring back gets set aside — for later.</p>'+
      '<div style="margin-bottom:10px;"><strong>Horizon Engine Development</strong>'+
      '<div class="ship-stat-bar" style="width:100%;margin:4px 0;"><div class="ship-stat-fill" style="width:'+pct+'%;background:#e8c96a;"></div></div>'+
      '<span style="font-size:.78rem;opacity:.75;">'+pct+'% — still a research project. Nothing\'s been built yet.</span></div>'+
      '<div style="font-size:.85rem;margin-bottom:10px;">🧠 Knowledge: '+he.knowledge+' · 🔮 Residue: '+he.residue+(he.dragonBlood ? ' · 🩸 Dragon Blood: '+he.dragonBlood : '')+'</div>'+
      (game.arc12Complete ? '<div style="font-size:.78rem;opacity:.75;background:rgba(120,200,255,.1);border:1px solid rgba(120,200,255,.3);border-radius:6px;padding:6px 10px;margin-bottom:10px;">✓ Research Complete — the Horizon Engine\'s purpose here is fulfilled. Expeditions continue for experience and raw materials.</div>' : '');
    if (es.active) {
      html += '<div class="story-chip" style="border-left-color:var(--danger);">Currently out at Wave '+es.wave+'<br>'+
        'Kills: '+es.totalKills+' · Knowledge this run: '+es.totalKnowledge+' · Residue this run: '+es.totalResidue+'<br>'+
        '<button class="btn btn-small btn-danger" style="margin-top:6px;" onclick="goScreen(\'combat\')">↩️ Return to the Expedition</button></div>';
    } else {
      html += '<button class="btn btn-success" onclick="enterResearchExpedition()">🔭 Set Out</button>';
    }
    el.innerHTML = html;
  }
})();


(function(){
  // -------------------------------------------------------------------
  // BUG FIX: showStoryModal() was only ever called from two places —
  // chaining after closing an already-open modal, or after winning ANY
  // combat fight (see handleVictory's own queue check). Nothing ever
  // triggered it right when a chapter was actually completed. So a
  // chapter's story modal would sit invisible in the queue until the
  // player happened to win some LATER, completely unrelated fight —
  // which is exactly what happened here: Arc VI Ch.9's "The Crew That
  // Chose Us" scene surfaced in the middle of an ordinary Smuggler Crew
  // encounter, with zero connection to the actual story beat.
  //
  // Every chapter-completion function across every arc already calls
  // renderStory() as one of its last steps (26+ call sites, confirmed),
  // so wrapping that one function here flushes the queue essentially
  // immediately after a chapter completes, instead of leaving it to
  // chance. Guards against interrupting an already-open modal — if one
  // is currently showing, this just waits for the NEXT render to try
  // again rather than fighting over the same overlay.
  // -------------------------------------------------------------------
  window.flushStoryModalQueue = function(){
    if (!game.storyModalQueue || !game.storyModalQueue.length) return;
    const overlay = document.getElementById('modalOverlay');
    if (overlay && overlay.classList.contains('active')) return;
    const next = game.storyModalQueue.shift();
    if (typeof showStoryModal === 'function') showStoryModal(next);
  };

  const oldRenderStoryForModalFlush = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForModalFlush) oldRenderStoryForModalFlush();
    window.flushStoryModalQueue();
  };
})();


(function(){
  // -------------------------------------------------------------------
  // SEA AMBUSH RIVAL CAPTURE. Until now, winning a sea ambush against
  // Robin or Jeff (see doVoyage's ambush hook) was just a normal combat
  // victory — gold/XP/trophy, no capture, no consequence at all. San's
  // design: winning gives a CHANCE to actually capture them (same
  // captureRival()/20-day community service already built for the Arc
  // VI story capture), not a guarantee — 50% the first time you beat
  // them at sea, rising to 80% on any later encounter after they've
  // slipped away once. Generalized against window.KNOWN_RIVAL_KEYS
  // (see doVoyage's own ambush pool) rather than hardcoded to Robin/
  // Jeff, so a future rival added to that one list gets this for free.
  //
  // Doesn't touch the Arc VI story capture at all — if Robin/Jeff get
  // captured this way before Arc VI is reached, the story fight still
  // happens exactly as before and its own captureRival() call simply
  // finalizes their canonical terms when the time comes (Robin's real
  // 20 days restart clean, Jeff becomes permanent) — this system only
  // ever offers an EARLY, temporary capture opportunity, never replaces
  // or blocks the scripted one.
  // -------------------------------------------------------------------
  function rivalEscapeCounts(){ game.rivalEscapeCounts = game.rivalEscapeCounts || {}; return game.rivalEscapeCounts; }
  window.rivalEscapeCounts = rivalEscapeCounts;

  window.getRivalCaptureChance = function(key){
    const escapes = rivalEscapeCounts()[key] || 0;
    return escapes === 0 ? 0.5 : 0.8; // first encounter: 50/50. Any later encounter: 80% capture, 20% escape.
  };

  // Per-rival ship flavor — same id convention as Arc VI's own capture
  // ('{key}s_ship'), so whichever path captures a rival first, the other
  // never creates a duplicate entry. Falls back to something reasonable
  // for any future rival not yet listed here.
  const RIVAL_SHIP_INFO = {
    robin: {name: "Robin's Ship", flag: '⛓️'},
    jeff:  {name: "Jeff's Ship",  flag: '🔨'}
  };

  const oldHandleVictoryForRivalCapture = window.handleVictory;
  window.handleVictory = function(){
    if (oldHandleVictoryForRivalCapture) oldHandleVictoryForRivalCapture();
    const enemy = game.combatEnemy;
    if (!enemy || enemy.kind !== 'sea') return; // 'sea' is also used for ordinary random voyage encounters, not just rivals
    // Named pirate captains (ct-build-v141) ride on the shared
    // rival_frigate enemy.key so bounty tracking keeps working, but
    // carry their own persistent identity in captainKey — that's the
    // real rival identity for capture purposes whenever it's present.
    const rivalKey = enemy.captainKey || enemy.key;
    const rivalKeys = (typeof window.KNOWN_RIVAL_KEYS !== 'undefined') ? window.KNOWN_RIVAL_KEYS : [];
    if (!rivalKeys.includes(rivalKey)) return; // an ordinary sea monster, not a named rival — nothing to do here
    if (typeof window.rivalCaptured === 'function' && window.rivalCaptured(rivalKey)) return; // defensive — shouldn't normally reach here, the ambush pool already excludes captured rivals
    const name = (typeof window.rivalDisplayName === 'function') ? window.rivalDisplayName(rivalKey) : rivalKey;
    const chance = window.getRivalCaptureChance(rivalKey);
    const chancePct = Math.round(chance * 100);
    let modalTitle, modalBlurb;
    if (Math.random() < chance) {
      if (typeof window.captureRival === 'function') window.captureRival(rivalKey, 20);
      game.inheritedShips = game.inheritedShips || [];
      const shipId = rivalKey + 's_ship';
      if (!game.inheritedShips.some(s=>s.id===shipId)) {
        const shipInfo = RIVAL_SHIP_INFO[rivalKey] || {name: name + "'s Ship", flag: '⚓'};
        game.inheritedShips.push({id: shipId, name: shipInfo.name, flag: shipInfo.flag, status: 'At dock, Fair Tide'});
      }
      logEvent('⛓️ ' + name + ' is captured this time (' + chancePct + '% chance) — community service begins. Their ship is now at Fair Tide, waiting to be designated.', 'gold');
      toast('⛓️ ' + name + ' is captured! (' + chancePct + '% chance) No more running from this one.', 4200);
      modalTitle = '⛓️ ' + name + ' Captured!';
      modalBlurb = 'The odds were ' + chancePct + '% this time — and they landed. ' + name + ' is captured. Community service begins, and his ship is now at dock, Fair Tide, waiting to be designated.';
    } else {
      const ec = rivalEscapeCounts();
      ec[rivalKey] = (ec[rivalKey] || 0) + 1;
      const nextChancePct = Math.round(window.getRivalCaptureChance(rivalKey) * 100);
      logEvent('💨 ' + name + ' slips away again (' + chancePct + '% chance this time) — ' + nextChancePct + '% next encounter.', 'bad');
      toast('💨 ' + name + ' escapes (' + chancePct + '% chance) — ' + nextChancePct + '% chance next time.', 4000);
      modalTitle = '💨 ' + name + ' Slips Away';
      modalBlurb = 'It was ' + chancePct + '% this time, and the odds didn\'t land. ' + name + ' gets away — but only barely. Next encounter, the odds shift to ' + nextChancePct + '%.';
    }
    // BUG FIX: this used to only ever show as a toast + log entry — both
    // easy to miss, especially with the post-battle victory screen also
    // showing at the same moment. Pushing a proper modal instead, same
    // mechanism already used for story scenes, so the outcome can't be
    // missed the way a toast can.
    setTimeout(function(){ if (typeof showStoryModal === 'function') showStoryModal({title: modalTitle, blurb: modalBlurb}); }, 600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  // -------------------------------------------------------------------
  // "At large" card — shows the current capture chance for any rival
  // who's escaped a sea ambush at least once but isn't captured yet.
  // Until now, a rival had NO visible presence anywhere until AFTER a
  // successful capture (the existing service card only checks
  // rivalCaptured()) — so there was genuinely nowhere to see the odds
  // for someone still at large, which is exactly the information a
  // player would want most.
  // -------------------------------------------------------------------
  const oldRenderExploreForRivalOdds = window.renderExplore;
  window.renderExplore = function(){
    if (oldRenderExploreForRivalOdds) oldRenderExploreForRivalOdds();
    const container = document.getElementById('exploreContent');
    if (!container) return;
    const rivalKeys = (typeof window.KNOWN_RIVAL_KEYS !== 'undefined') ? window.KNOWN_RIVAL_KEYS : [];
    const escapes = rivalEscapeCounts();
    rivalKeys.forEach(function(key){
      if (typeof window.rivalCaptured === 'function' && window.rivalCaptured(key)) return; // already captured — the existing service card covers them
      if (!escapes[key]) return; // never even encountered yet — nothing to show
      const name = (typeof window.rivalDisplayName === 'function') ? window.rivalDisplayName(key) : key;
      const chancePct = Math.round(window.getRivalCaptureChance(key) * 100);
      container.insertAdjacentHTML('beforeend',
        '<article class="quest-item" style="border-left-color:var(--sand);">'+
        '<strong>🏴‍☠️ '+name+' — Still at Large</strong><br>'+
        '<span style="font-size:.82rem;opacity:.8;">Escaped '+escapes[key]+' time'+(escapes[key]>1?'s':'')+' so far. Beat him again at sea for a '+chancePct+'% chance to actually capture him this time.</span><br>'+
        '<button class="btn btn-small btn-danger" style="margin-top:6px;" onclick="huntDownRival(\''+key+'\')">🗡️ Hunt Him Down</button>'+
        '</article>');
    });
  };

  // On-demand rival fight — reuses the exact same enemy generation as
  // the random sea ambush (scaledEnemyForExplore), so a hunted-down
  // fight is identical in every way except how it was triggered.
  window.huntDownRival = function(key){
    if (typeof window.rivalCaptured === 'function' && window.rivalCaptured(key)) { toast('Already captured.'); return; }
    const enemy = (typeof scaledEnemyForExplore === 'function') ? scaledEnemyForExplore(key, 'sea') : null;
    if (!enemy) { toast('Could not find him right now — try again later.'); return; }
    const name = (typeof window.rivalDisplayName === 'function') ? window.rivalDisplayName(key) : key;
    toast('🗡️ Tracked ' + name + ' down.', 2200);
    startCombat({kind:'sea', key:key, enemy: enemy, portId:null});
  };
})();


(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE POPULATION — a simple number for now, per San's request.
  // Baseline represents Fair Tide's own established residents before
  // any of this session's story events; grows with game.fairTideRoster,
  // which already tracks every wave of people who've actually joined —
  // Arc V's roster (Jovie, Gino, Wahyu, Dudin, Imah, Nurul, Dre, Jorvin),
  // Arc VI's freed crew (Ch.2), former SK* workers (Ch.3), and
  // specialists (Ch.6). No new tracking needed — this just counts what's
  // already there and displays it somewhere visible, so growth is felt
  // rather than buried in individual roster entries.
  // -------------------------------------------------------------------
  const FAIR_TIDE_BASELINE_POPULATION = 40;

  window.getFairTidePopulation = function(){
    const rosterCount = Object.keys(game.fairTideRoster || {}).length;
    return FAIR_TIDE_BASELINE_POPULATION + rosterCount;
  };

  const oldRenderFairTideHubForPopulation = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    if (oldRenderFairTideHubForPopulation) oldRenderFairTideHubForPopulation();
    const el = document.getElementById('fairTidePopulationLabel');
    if (el) el.textContent = window.getFairTidePopulation().toLocaleString();
  };
})();


(function(){
  // -------------------------------------------------------------------
  // JEFF'S VEGETABLE TOSS — a bit of fun for the former SK* workers.
  // Every 15 days of Jeff's (permanent) community service, the old crew
  // gets to line up and pelt him with spoiled vegetables while San and
  // Joel watch from the dock with a drink. Purely flavor on Jeff's end
  // (his service itself doesn't change) — the real effect is a
  // temporary morale/production boost across Fair Tide, routed through
  // the same getReputationBonus() aggregator every other bonus source
  // already uses (reputation ranks, roster bonuses, civilian roles,
  // bond synergies), same cross-block wrapping pattern as those.
  // -------------------------------------------------------------------
  const TOSS_INTERVAL_DAYS = 15;
  const MORALE_BOOST_DURATION_DAYS = 5;
  const MORALE_BOOST_AMOUNT = 0.15;

  // BUG FIX: this used to initialize lastTriggeredAtServedDay to -999,
  // which meant served - (-999) was always enormous — so the very first
  // toss was always immediately available regardless of how few days
  // Jeff had actually served, and the interval check never got a real
  // chance to block anything on that first trigger. Starting at 0
  // instead means the first toss genuinely waits out the full interval,
  // exactly like every one after it.
  function jeffTossState(){ game.jeffVegetableToss = game.jeffVegetableToss || {lastTriggeredAtServedDay: 0}; return game.jeffVegetableToss; }

  window.canTossVegetablesAtJeff = function(){
    const cs = (typeof communityServiceState === 'function') ? communityServiceState().jeff : null;
    if (!cs || !cs.active) return false;
    const served = (typeof window.communityServiceDaysServed === 'function') ? window.communityServiceDaysServed('jeff') : 0;
    const state = jeffTossState();
    return (served - state.lastTriggeredAtServedDay) >= TOSS_INTERVAL_DAYS;
  };

  window.isFairTideMoraleBoostActive = function(){
    return !!(game.jeffMoraleBoostUntilDay && game.day <= game.jeffMoraleBoostUntilDay);
  };

  window.tossVegetablesAtJeff = function(){
    if (!window.canTossVegetablesAtJeff()) { toast('🥬 Not yet — give it a few more days.'); return; }
    const served = (typeof window.communityServiceDaysServed === 'function') ? window.communityServiceDaysServed('jeff') : 0;
    jeffTossState().lastTriggeredAtServedDay = served;
    game.jeffMoraleBoostUntilDay = game.day + MORALE_BOOST_DURATION_DAYS;
    logEvent('🥬 The old SK* crew line up with a crate of spoiled vegetables and let Jeff have it. San and Joel watch from the dock, drinks in hand, cheering every direct hit. Fair Tide\'s morale gets a real boost out of it.', 'good');
    toast('🥬 Direct hit! Fair Tide\'s morale (and production) gets a boost for a few days.', 4200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderExplore === 'function') window.renderExplore();
  };

  const oldGetReputationBonusForMorale = window.getReputationBonus;
  window.getReputationBonus = function(statKey){
    let total = oldGetReputationBonusForMorale ? oldGetReputationBonusForMorale(statKey) : 0;
    if (window.isFairTideMoraleBoostActive() && (statKey === 'goldBonus' || statKey === 'xpBonus')) {
      total += MORALE_BOOST_AMOUNT;
    }
    return total;
  };

  const oldRenderExploreForJeffToss = window.renderExplore;
  window.renderExplore = function(){
    if (oldRenderExploreForJeffToss) oldRenderExploreForJeffToss();
    const container = document.getElementById('exploreContent');
    if (!container) return;
    const cs = (typeof communityServiceState === 'function') ? communityServiceState().jeff : null;
    if (!cs || !cs.active) return; // Jeff isn't currently serving — nothing to show
    const canToss = window.canTossVegetablesAtJeff();
    const boostActive = window.isFairTideMoraleBoostActive();
    let html = '<article class="quest-item">'+
      '<div style="font-size:.85rem;opacity:.85;">🥬 <strong>The Old Crew\'s Turn</strong><br>Every so often, the workers who used to answer to Jeff get a chance to answer back — with whatever\'s gone soft in the market crates.</div>';
    if (boostActive) {
      html += '<div style="font-size:.8rem;margin-top:6px;color:var(--success);">☕ Fair Tide morale is up — production boosted through day '+game.jeffMoraleBoostUntilDay+'.</div>';
    }
    html += (canToss
      ? '<button class="btn btn-small btn-success" style="margin-top:6px;" onclick="tossVegetablesAtJeff()">🥬 Let Them at Him</button>'
      : '<div style="font-size:.78rem;opacity:.65;margin-top:6px;">Not yet — give it a few more days.</div>')+
      '</article>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();


(function(){
  // -------------------------------------------------------------------
  // Auto-scroll the Story screen to the current chapter on render.
  //
  // A true "collapse the completed chapters" feature would need to be
  // built into all 9 separate arc-specific renderStory wraps (one per
  // arc, accumulated across many sessions) — and their markup isn't
  // consistent enough to do that safely in one shared pass: some use a
  // dedicated .story-status class, others embed the status text
  // directly with no shared wrapper class at all. Rewriting all 9 to
  // add a matching collapse affordance risks breaking something in at
  // least one of them for a purely cosmetic change.
  //
  // What every one of them DOES share reliably is the exact status text
  // "CURRENT" on whichever chapter is next up (13 confirmed occurrences
  // across the codebase, always this exact string). So instead of
  // collapsing everything already read, this finds that one element and
  // scrolls it into view automatically — same practical outcome (land on
  // the chapter that actually matters without manually scrolling past
  // everything already done), far lower risk.
  // -------------------------------------------------------------------
  function findCurrentChapterElement(container){
    if (container.children.length === 0 && container.textContent.trim() === 'CURRENT') {
      return container.closest('article, .quest-item, .panel') || container;
    }
    for (let i = 0; i < container.children.length; i++) {
      const found = findCurrentChapterElement(container.children[i]);
      if (found) return found;
    }
    return null;
  }

  const oldRenderStoryForAutoScroll = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForAutoScroll) oldRenderStoryForAutoScroll();
    const container = document.getElementById('storyContent');
    if (!container) return;
    setTimeout(() => {
      const target = findCurrentChapterElement(container);
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({block: 'center', behavior: 'smooth'});
      }
    }, 80); // small delay so the DOM from the arc-specific render above has actually painted first
  };
})();


(function(){
  // -------------------------------------------------------------------
  // COLLAPSE COMPLETED CHAPTERS. With 9 arcs' worth of chapters (150+
  // by Arc IX) all rendered into one continuous list every time, the
  // current/active chapter ends up buried under everything already
  // read — San's exact complaint. Hides .story-chapter.complete (and
  // the Arc I equivalent) by default via the CSS class added above,
  // with a toggle to bring them back for review. Also auto-scrolls to
  // whichever chapter is actually current the moment the Story tab is
  // opened — but only there, not on every internal re-render (renderStory
  // gets called from 30+ chapter-completion functions across every arc;
  // auto-scrolling on all of those would yank the screen around while
  // the player is doing something else entirely).
  // -------------------------------------------------------------------
  window.toggleStoryCompletedVisibility = function(){
    // BUG FIX: the original version computed "is this currently hidden"
    // and assigned that same boolean straight back as the new state —
    // which just re-confirmed the current state instead of flipping it,
    // so the very first tap from the default (hidden) never actually
    // revealed anything.
    const currentlyHidden = game.storyHideCompleted !== false;
    game.storyHideCompleted = !currentlyHidden;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderStory === 'function') renderStory();
  };

  const oldRenderStoryForCollapse = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForCollapse) oldRenderStoryForCollapse();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const hidden = game.storyHideCompleted !== false; // defaults to true (hidden) until explicitly toggled off
    container.classList.toggle('hide-completed', hidden);
    const toggleHtml = '<div style="margin-bottom:10px;">'+
      '<button class="btn btn-small" onclick="toggleStoryCompletedVisibility()">'+
      (hidden ? '👁️ Show Completed Chapters' : '🙈 Hide Completed Chapters')+
      '</button></div>';
    container.insertAdjacentHTML('afterbegin', toggleHtml);
  };

  const oldGoScreenForStoryScroll = window.goScreen;
  window.goScreen = function(name){
    if (oldGoScreenForStoryScroll) oldGoScreenForStoryScroll(name);
    if (name === 'story') {
      setTimeout(function(){
        const active = document.querySelector('#storyContent .story-chapter.active, #storyContent .quest-item.active, #storyContent .arc1-comic-card.active');
        if (active) active.scrollIntoView({block: 'center', behavior: 'instant'});
      }, 50);
    }
  };
})();


(function(){
  // -------------------------------------------------------------------
  // NAMED PIRATE CAPTAINS — extends the Robin/Jeff capture/escape/
  // service mechanic to San's existing pool of 18 Southeast Asian
  // captain names (previously ct-build's SEA_RIVAL_CAPTAIN_NAMES, used
  // purely as ephemeral flavor text on the generic rival_frigate enemy
  // — a fresh random name every encounter, no memory between them).
  //
  // Deliberately skips story introductions per San's direction — these
  // are meant to feel like "the wider world has more captains than just
  // Robin and Jeff," not individually arc'd characters. Each becomes its
  // own persistently-tracked identity: once captured, that specific
  // captain is excluded from future rolls (the pool of "still at large"
  // captains shrinks over time), same 50%/80% capture-chance curve,
  // same generic community-service framing (serviceFraming's existing
  // fallback already covers this with zero changes needed there).
  //
  // Bounty tracking is deliberately preserved exactly as the original
  // session designed it: enemy.key stays 'rival_frigate' always (so
  // "Hunt: Rival Pirate Frigate" bounties keep working unchanged), with
  // a new enemy.captainKey field carrying the actual persistent identity
  // for capture purposes only. The capture logic below reads
  // captainKey when present, falling back to enemy.key for Robin/Jeff
  // (unaffected — they never carry a captainKey).
  // -------------------------------------------------------------------
  const CAPTAIN_KEYS = ['lim_wei_kang', 'tan_boon_hock', 'ng_ah_kow', 'chen_mei_ling', 'wong_siew_fong', 'ho_chun_kit', 'rashid', 'aminah_binti_salleh', 'zulkifli', 'hassan_bin_ismail', 'siti_norhayati', 'ariffin', 'dela_cruz', 'bagyo_santos', 'reyes', 'marisol_aquino', 'villanueva', 'dimaguiba'];
  // Shared, appendable list — a future pool-expansion block concats onto
  // this rather than needing to know about or duplicate CAPTAIN_KEYS
  // directly, and randomAtLargeCaptainKey (below) reads from it instead
  // of the private CAPTAIN_KEYS constant, so new additions are actually
  // selectable, not just capture/bounty-eligible.
  window.ALL_CAPTAIN_KEYS = (window.ALL_CAPTAIN_KEYS || []).concat(CAPTAIN_KEYS);

  const CAPTAIN_TITLES = {
    lim_wei_kang: 'Captain',
    tan_boon_hock: 'Captain',
    ng_ah_kow: 'Captain',
    chen_mei_ling: 'Captain',
    wong_siew_fong: 'Captain',
    ho_chun_kit: 'Captain',
    rashid: 'Nakhoda',
    aminah_binti_salleh: 'Nakhoda',
    zulkifli: 'Nakhoda',
    hassan_bin_ismail: 'Nakhoda',
    siti_norhayati: 'Nakhoda',
    ariffin: 'Nakhoda',
    dela_cruz: 'Kapitan',
    bagyo_santos: 'Kapitan',
    reyes: 'Kapitan',
    marisol_aquino: 'Kapitan',
    villanueva: 'Kapitan',
    dimaguiba: 'Kapitan'
  };

  // Minimal HARBOR_ENEMIES entries — these exist so rivalDisplayName()'s
  // existing lookup (which already reads HARBOR_ENEMIES[key].name) works
  // automatically, and so bountyPool()'s exclusion (generalized below)
  // can find them. Never used for direct combat generation — the actual
  // fight always goes through the rival_frigate-based generator further
  // down, which carries the real (scaled) stats.
  Object.assign(HARBOR_ENEMIES, {
  lim_wei_kang: { name: "Lim Wei Kang's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Captain Lim Wei Kang, one of many captains still sailing free waters." },
  tan_boon_hock: { name: "Tan Boon Hock's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Captain Tan Boon Hock, one of many captains still sailing free waters." },
  ng_ah_kow: { name: "Ng Ah Kow's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Captain Ng Ah Kow, one of many captains still sailing free waters." },
  chen_mei_ling: { name: "Chen Mei Ling's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Captain Chen Mei Ling, one of many captains still sailing free waters." },
  wong_siew_fong: { name: "Wong Siew Fong's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Captain Wong Siew Fong, one of many captains still sailing free waters." },
  ho_chun_kit: { name: "Ho Chun Kit's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Captain Ho Chun Kit, one of many captains still sailing free waters." },
  rashid: { name: "Rashid's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Rashid, one of many captains still sailing free waters." },
  aminah_binti_salleh: { name: "Aminah binti Salleh's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Aminah binti Salleh, one of many captains still sailing free waters." },
  zulkifli: { name: "Zulkifli's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Zulkifli, one of many captains still sailing free waters." },
  hassan_bin_ismail: { name: "Hassan bin Ismail's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Hassan bin Ismail, one of many captains still sailing free waters." },
  siti_norhayati: { name: "Siti Norhayati's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Siti Norhayati, one of many captains still sailing free waters." },
  ariffin: { name: "Ariffin's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Ariffin, one of many captains still sailing free waters." },
  dela_cruz: { name: "Dela Cruz's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Dela Cruz, one of many captains still sailing free waters." },
  bagyo_santos: { name: "Bagyo Santos's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Bagyo Santos, one of many captains still sailing free waters." },
  reyes: { name: "Reyes's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Reyes, one of many captains still sailing free waters." },
  marisol_aquino: { name: "Marisol Aquino's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Marisol Aquino, one of many captains still sailing free waters." },
  villanueva: { name: "Villanueva's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Villanueva, one of many captains still sailing free waters." },
  dimaguiba: { name: "Dimaguiba's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Dimaguiba, one of many captains still sailing free waters." }
  });

  // Generalizing bountyPool's exclusion from a hardcoded 'robin'/'jeff'
  // check to reading KNOWN_RIVAL_KEYS instead — covers these 18 new
  // captains automatically, and any future named rival added the same
  // way, without needing this line touched again.
  window.KNOWN_RIVAL_KEYS = (window.KNOWN_RIVAL_KEYS || ['robin','jeff']).concat(CAPTAIN_KEYS);

  window.captainTitle = function(key){ return CAPTAIN_TITLES[key] || ''; };

  // Random NOT-YET-CAPTURED captain, for both the ambush flavor-roll and
  // hunting a specific one down. Returns null if every captain has
  // already been captured (pool exhausted).
  function randomAtLargeCaptainKey(){
    const pool = (window.ALL_CAPTAIN_KEYS || CAPTAIN_KEYS).filter(k => !(typeof window.rivalCaptured === 'function' && window.rivalCaptured(k)));
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }
  window.randomAtLargeCaptainKey = randomAtLargeCaptainKey;

  function frigateEnemyForCaptain(captainKey){
    const base = (typeof scaledEnemyForExplore === 'function') ? scaledEnemyForExplore('rival_frigate', 'sea') : null;
    if (!base) return null;
    const name = (typeof rivalDisplayName === 'function') ? rivalDisplayName(captainKey) : captainKey;
    const fullName = (HARBOR_ENEMIES[captainKey] && HARBOR_ENEMIES[captainKey].name) ? HARBOR_ENEMIES[captainKey].name.replace("'s Crew", '') : name;
    const title = window.captainTitle(captainKey);
    base.captainKey = captainKey;
    base.name = (title ? title + ' ' : '') + fullName + "'s Frigate";
    base.desc = 'A black-sailed frigate bearing down, cannons already run out — flying ' + fullName + "'s colors.";
    return base;
  }
  window.frigateEnemyForCaptain = frigateEnemyForCaptain;

  // Replaces the old ephemeral random-name-every-time flavor with a
  // persistent captain roll: picks a real, individually-trackable
  // not-yet-captured captain instead of just any random display string.
  // Falls back to the original plain (uncapturable) frigate flavor once
  // every captain has actually been captured.
  const oldScaledEnemyForExploreForCaptains = window.scaledEnemyForExplore;
  window.scaledEnemyForExplore = function(key, kind){
    const enemy = oldScaledEnemyForExploreForCaptains.apply(this, arguments);
    if (key === 'rival_frigate' && enemy) {
      const captainKey = randomAtLargeCaptainKey();
      if (captainKey) {
        const name = (typeof rivalDisplayName === 'function') ? rivalDisplayName(captainKey) : captainKey;
        const fullName = (HARBOR_ENEMIES[captainKey] && HARBOR_ENEMIES[captainKey].name) ? HARBOR_ENEMIES[captainKey].name.replace("'s Crew", '') : name;
        const title = window.captainTitle(captainKey);
        enemy.captainKey = captainKey;
        enemy.name = (title ? title + ' ' : '') + fullName + "'s Frigate";
        enemy.desc = 'A black-sailed frigate bearing down, cannons already run out — flying ' + fullName + "'s colors.";
      }
      // else: every captain already captured — leaves the enemy exactly
      // as the base wrap already generated it (plain, uncapturable).
    }
    return enemy;
  };

  // On-demand hunt for a specific captain — huntDownRival() (see
  // ct-build-v131) calls scaledEnemyForExplore(key, 'sea') directly for
  // Robin/Jeff, but that would fail for a captain key (they aren't real
  // HARBOR_ENEMIES/SEA_ENEMIES combat entries, only rival_frigate is).
  // Wrapping huntDownRival to special-case captain keys: generate a
  // rival_frigate fight forced to that specific captain instead.
  const oldHuntDownRivalForCaptains = window.huntDownRival;
  window.huntDownRival = function(key){
    if (!(window.ALL_CAPTAIN_KEYS || CAPTAIN_KEYS).includes(key)) {
      // BUG FIX: this branch always called oldHuntDownRivalForCaptains,
      // but that was undefined — no file anywhere ever defined a base
      // huntDownRival function, even though the comment above already
      // describes exactly what Robin/Jeff's path should do. The "Hunt
      // Him Down" button for either of them has been a complete no-op
      // since it was written: no combat, no toast, nothing. Implementing
      // the described behavior directly here instead of deferring to a
      // function that was never actually written anywhere.
      if (oldHuntDownRivalForCaptains) { oldHuntDownRivalForCaptains(key); return; }
      if (typeof window.rivalCaptured === 'function' && window.rivalCaptured(key)) { toast('Already captured.'); return; }
      const rivalEnemy = (typeof scaledEnemyForExplore === 'function') ? scaledEnemyForExplore(key, 'sea') : null;
      if (!rivalEnemy) { toast('Could not find him right now — try again later.'); return; }
      const rivalName = (typeof rivalDisplayName === 'function') ? rivalDisplayName(key) : key;
      toast('🗡️ Tracked ' + rivalName + ' down.', 2200);
      startCombat({kind:'sea', key:key, enemy: rivalEnemy, portId:null});
      return;
    }
    if (typeof window.rivalCaptured === 'function' && window.rivalCaptured(key)) { toast('Already captured.'); return; }
    const enemy = frigateEnemyForCaptain(key);
    if (!enemy) { toast('Could not find him right now — try again later.'); return; }
    const name = (typeof rivalDisplayName === 'function') ? rivalDisplayName(key) : key;
    toast('🗡️ Tracked ' + name + ' down.', 2200);
    startCombat({kind:'sea', key:'rival_frigate', enemy: enemy, portId:null});
  };
})();


(function(){
  // -------------------------------------------------------------------
  // POOL EXPANSION — 18 -> 50 named captains, per San's request after
  // confirming the mechanic works well. Existing 18 (Chinese/Malay/
  // Filipino) are left completely untouched, preserving any already-
  // captured state (e.g. Tan Boon Hock). These 32 additions broaden
  // representation with Thai, Indonesian, Vietnamese, and Myanmar
  // names, while keeping the original three cultures slightly larger
  // (+3 Chinese, +3 Malay, +2 Filipino) since San specifically said
  // those "hit home." Final split: Chinese 9, Malay 9, Filipino 8,
  // Thai 6, Indonesian 6, Vietnamese 6, Myanmar 6 = 50 total.
  //
  // window.ALL_CAPTAIN_KEYS (see ct-build-v141) is a shared, appendable
  // list that randomAtLargeCaptainKey() reads directly — concatenating
  // onto it here is enough for these 32 to actually become selectable,
  // no need to re-wrap the selection function itself.
  // -------------------------------------------------------------------
  const NEW_CAPTAIN_KEYS = ['lee_kok_wei', 'goh_poh_choo', 'ong_teck_guan', 'ismail_bin_yusof', 'faridah_binti_omar', 'rosli', 'fernandez', 'lourdes_manalo', 'somchai_suksawat', 'ananda_charoenkul', 'siriporn_wattana', 'narong_phetchburi', 'ratana_boonmee', 'chai_kittikorn', 'bambang_wijaya', 'siti_rahayu', 'agus_setiawan', 'dewi_lestari', 'hendra_gunawan', 'wayan_putra', 'nguyen_van_long', 'tran_thi_mai', 'le_hoang_nam', 'pham_thu_huong', 'hoang_minh_duc', 'vu_thi_lan', 'aung_kyaw', 'thura_zaw', 'hla_myint', 'nandar_win', 'zeya_aung', 'su_su_hlaing'];

  const NEW_CAPTAIN_TITLES = {
    lee_kok_wei: 'Captain',
    goh_poh_choo: 'Captain',
    ong_teck_guan: 'Captain',
    ismail_bin_yusof: 'Nakhoda',
    faridah_binti_omar: 'Nakhoda',
    rosli: 'Nakhoda',
    fernandez: 'Kapitan',
    lourdes_manalo: 'Kapitan',
    somchai_suksawat: 'Kapitan',
    ananda_charoenkul: 'Kapitan',
    siriporn_wattana: 'Kapitan',
    narong_phetchburi: 'Kapitan',
    ratana_boonmee: 'Kapitan',
    chai_kittikorn: 'Kapitan',
    bambang_wijaya: 'Nakhoda',
    siti_rahayu: 'Nakhoda',
    agus_setiawan: 'Nakhoda',
    dewi_lestari: 'Nakhoda',
    hendra_gunawan: 'Nakhoda',
    wayan_putra: 'Nakhoda',
    nguyen_van_long: 'Thuyen Truong',
    tran_thi_mai: 'Thuyen Truong',
    le_hoang_nam: 'Thuyen Truong',
    pham_thu_huong: 'Thuyen Truong',
    hoang_minh_duc: 'Thuyen Truong',
    vu_thi_lan: 'Thuyen Truong',
    aung_kyaw: 'Bo',
    thura_zaw: 'Bo',
    hla_myint: 'Bo',
    nandar_win: 'Bo',
    zeya_aung: 'Bo',
    su_su_hlaing: 'Bo'
  };

  Object.assign(HARBOR_ENEMIES, {
  lee_kok_wei: { name: "Lee Kok Wei's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Captain Lee Kok Wei, one of many captains still sailing free waters." },
  goh_poh_choo: { name: "Goh Poh Choo's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Captain Goh Poh Choo, one of many captains still sailing free waters." },
  ong_teck_guan: { name: "Ong Teck Guan's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Captain Ong Teck Guan, one of many captains still sailing free waters." },
  ismail_bin_yusof: { name: "Ismail bin Yusof's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Ismail bin Yusof, one of many captains still sailing free waters." },
  faridah_binti_omar: { name: "Faridah binti Omar's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Faridah binti Omar, one of many captains still sailing free waters." },
  rosli: { name: "Rosli's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Rosli, one of many captains still sailing free waters." },
  fernandez: { name: "Fernandez's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Fernandez, one of many captains still sailing free waters." },
  lourdes_manalo: { name: "Lourdes Manalo's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Lourdes Manalo, one of many captains still sailing free waters." },
  somchai_suksawat: { name: "Somchai Suksawat's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Somchai Suksawat, one of many captains still sailing free waters." },
  ananda_charoenkul: { name: "Ananda Charoenkul's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Ananda Charoenkul, one of many captains still sailing free waters." },
  siriporn_wattana: { name: "Siriporn Wattana's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Siriporn Wattana, one of many captains still sailing free waters." },
  narong_phetchburi: { name: "Narong Phetchburi's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Narong Phetchburi, one of many captains still sailing free waters." },
  ratana_boonmee: { name: "Ratana Boonmee's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Ratana Boonmee, one of many captains still sailing free waters." },
  chai_kittikorn: { name: "Chai Kittikorn's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Kapitan Chai Kittikorn, one of many captains still sailing free waters." },
  bambang_wijaya: { name: "Bambang Wijaya's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Bambang Wijaya, one of many captains still sailing free waters." },
  siti_rahayu: { name: "Siti Rahayu's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Siti Rahayu, one of many captains still sailing free waters." },
  agus_setiawan: { name: "Agus Setiawan's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Agus Setiawan, one of many captains still sailing free waters." },
  dewi_lestari: { name: "Dewi Lestari's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Dewi Lestari, one of many captains still sailing free waters." },
  hendra_gunawan: { name: "Hendra Gunawan's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Hendra Gunawan, one of many captains still sailing free waters." },
  wayan_putra: { name: "Wayan Putra's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Nakhoda Wayan Putra, one of many captains still sailing free waters." },
  nguyen_van_long: { name: "Nguyen Van Long's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Thuyen Truong Nguyen Van Long, one of many captains still sailing free waters." },
  tran_thi_mai: { name: "Tran Thi Mai's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Thuyen Truong Tran Thi Mai, one of many captains still sailing free waters." },
  le_hoang_nam: { name: "Le Hoang Nam's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Thuyen Truong Le Hoang Nam, one of many captains still sailing free waters." },
  pham_thu_huong: { name: "Pham Thu Huong's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Thuyen Truong Pham Thu Huong, one of many captains still sailing free waters." },
  hoang_minh_duc: { name: "Hoang Minh Duc's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Thuyen Truong Hoang Minh Duc, one of many captains still sailing free waters." },
  vu_thi_lan: { name: "Vu Thi Lan's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Thuyen Truong Vu Thi Lan, one of many captains still sailing free waters." },
  aung_kyaw: { name: "Aung Kyaw's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Bo Aung Kyaw, one of many captains still sailing free waters." },
  thura_zaw: { name: "Thura Zaw's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Bo Thura Zaw, one of many captains still sailing free waters." },
  hla_myint: { name: "Hla Myint's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Bo Hla Myint, one of many captains still sailing free waters." },
  nandar_win: { name: "Nandar Win's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Bo Nandar Win, one of many captains still sailing free waters." },
  zeya_aung: { name: "Zeya Aung's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Bo Zeya Aung, one of many captains still sailing free waters." },
  su_su_hlaing: { name: "Su Su Hlaing's Crew", icon: '🏴', hp: 380, dmg: 18, xp: 130, gold: 90, desc: "Bo Su Su Hlaing, one of many captains still sailing free waters." }
  });

  window.KNOWN_RIVAL_KEYS = (window.KNOWN_RIVAL_KEYS || []).concat(NEW_CAPTAIN_KEYS);
  window.ALL_CAPTAIN_KEYS = (window.ALL_CAPTAIN_KEYS || []).concat(NEW_CAPTAIN_KEYS);

  const oldCaptainTitleForExpansion = window.captainTitle;
  window.captainTitle = function(key){
    if (NEW_CAPTAIN_TITLES[key]) return NEW_CAPTAIN_TITLES[key];
    return oldCaptainTitleForExpansion ? oldCaptainTitleForExpansion(key) : '';
  };
})();


(function(){
  // -------------------------------------------------------------------
  // GITHUB GIST BACKUP — same pattern as Legends: Daybreak Quest's
  // implementation (classic PAT, gist scope only, stored client-side in
  // localStorage, push/pull via the Gists REST API), adapted to Crimson
  // Tide's actual save shape (the `game` object / SAVE_KEY / saveGame()
  // / loadGame()) rather than Daybreak's `state`/`save()`. Uses its own
  // localStorage key so the two games' credentials never collide even
  // though they're separate PATs.
  // -------------------------------------------------------------------
  const GIST_CREDS_KEY = 'crimson-tide-gist-creds';
  const GIST_FILENAME = 'crimson-tide-save.json';

  // BUG FIX (San's request): the saved Gist ID only ever showed up as
  // placeholder text, which isn't selectable or copyable — genuinely
  // retrieving it after the fact wasn't possible. This shows it as real,
  // copyable text whenever one is saved, hidden otherwise.
  function refreshGistIdDisplay(){
    const creds = loadGistCreds();
    const wrap = document.getElementById('gistIdDisplay');
    const valueEl = document.getElementById('gistIdDisplayValue');
    if (!wrap || !valueEl) return;
    if (creds.gistId) {
      valueEl.textContent = creds.gistId;
      wrap.style.display = 'flex';
    } else {
      wrap.style.display = 'none';
    }
  }
  window.refreshGistIdDisplay = refreshGistIdDisplay;

  window.copyGistId = function(){
    const creds = loadGistCreds();
    if (!creds.gistId) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(creds.gistId).then(function(){
        if (typeof toast === 'function') toast('📋 Gist ID copied.');
      }).catch(function(){
        if (typeof toast === 'function') toast('Could not copy — long-press the ID to select it manually.');
      });
    } else {
      if (typeof toast === 'function') toast('Could not copy — long-press the ID to select it manually.');
    }
  };

  function loadGistCreds(){
    try {
      const raw = localStorage.getItem(GIST_CREDS_KEY);
      return raw ? JSON.parse(raw) : { token:'', gistId:'', lastSync:null };
    } catch(e) { return { token:'', gistId:'', lastSync:null }; }
  }
  function saveGistCreds(creds){
    try { localStorage.setItem(GIST_CREDS_KEY, JSON.stringify(creds)); } catch(e) {}
  }
  window.loadGistCreds = loadGistCreds;
  window.saveGistCreds = saveGistCreds;

  function setGistStatus(msg){
    const el = document.getElementById('gistStatusMsg');
    if (el) el.textContent = msg;
  }

  function setGistBusy(busy){
    const pushBtn = document.getElementById('gistPushBtn');
    const pullBtn = document.getElementById('gistPullBtn');
    if (pushBtn) pushBtn.disabled = busy;
    if (pullBtn) pullBtn.disabled = busy;
  }

  window.saveGistCredsFromForm = function(){
    const tokenEl = document.getElementById('gistTokenInput');
    const idEl = document.getElementById('gistIdInput');
    const creds = loadGistCreds();
    if (tokenEl && tokenEl.value.trim()) creds.token = tokenEl.value.trim();
    if (idEl && idEl.value.trim()) creds.gistId = idEl.value.trim();
    saveGistCreds(creds);
    if (tokenEl) tokenEl.value = '';
    if (idEl) idEl.value = '';
    setGistStatus('Saved. You can push or pull now.');
    refreshGistIdDisplay();
  };

  window.clearGistCreds = function(){
    saveGistCreds({ token:'', gistId:'', lastSync:null });
    setGistStatus('GitHub credentials cleared from this device.');
    refreshGistIdDisplay();
  };

  window.pushToGist = async function(){
    const creds = loadGistCreds();
    if (!creds.token) { setGistStatus('Add your GitHub token first, then Save Credentials.'); return; }
    setGistBusy(true); setGistStatus('Working…');
    try {
      const body = {
        description: 'Daybreak: Crimson Tide — save backup',
        public: false,
        files: { [GIST_FILENAME]: { content: JSON.stringify(game, null, 2) } },
      };
      const url = creds.gistId ? `https://api.github.com/gists/${creds.gistId}` : 'https://api.github.com/gists';
      const method = creds.gistId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `token ${creds.token}`, 'Accept': 'application/vnd.github+json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('GitHub responded ' + res.status);
      const data = await res.json();
      creds.gistId = data.id;
      creds.lastSync = Date.now();
      saveGistCreds(creds);
      setGistStatus('Backed up to Gist! (' + new Date().toLocaleTimeString() + ')');
      refreshGistIdDisplay();
    } catch(e) {
      setGistStatus("Push failed — check your token has the 'gist' scope and you're online.");
    }
    setGistBusy(false);
  };

  window.pullFromGist = async function(){
    const creds = loadGistCreds();
    if (!creds.token || !creds.gistId) { setGistStatus('Need both a token and a Gist ID saved first.'); return; }
    if (!confirm('This will overwrite your current save with the one from GitHub. Continue?')) return;
    setGistBusy(true); setGistStatus('Working…');
    try {
      const res = await fetch('https://api.github.com/gists/' + creds.gistId, {
        headers: { 'Authorization': `token ${creds.token}`, 'Accept': 'application/vnd.github+json' },
      });
      if (!res.ok) throw new Error('GitHub responded ' + res.status);
      const data = await res.json();
      const file = data.files && data.files[GIST_FILENAME];
      if (!file) throw new Error('No save file found in that Gist.');
      const parsed = JSON.parse(file.content);
      if (!parsed || typeof parsed !== 'object') throw new Error('bad shape');
      // Mirrors loadGame()'s own restoration path — merge into the
      // existing game object and re-run the same migration/repair steps
      // a normal load already goes through, rather than a raw overwrite.
      game = Object.assign(game, parsed);
      try { if (typeof migrateEquipmentState === 'function') migrateEquipmentState(); } catch(e) {}
      try { if (typeof seedCompleteStarterGear === 'function') seedCompleteStarterGear(); } catch(e) {}
      localStorage.setItem(SAVE_KEY, JSON.stringify(game));
      creds.lastSync = Date.now();
      saveGistCreds(creds);
      setGistStatus('Restored from Gist! (' + new Date().toLocaleTimeString() + ')');
      // BUG FIX (San's report, twice now): a page reload here was
      // unreliable — the first fix (a sessionStorage flag checked by a
      // separate file on startup) still failed for San, most likely
      // because that second file was served stale by the service worker
      // (each script file is cached independently, so one file updating
      // doesn't guarantee another did) — a real risk with any reload-
      // based approach in a PWA like this. Removed the reload entirely:
      // `game` is already correctly restored in memory at this point
      // (see the Object.assign above), and the save was just written to
      // localStorage, so calling loadGame() directly re-reads that same
      // fresh data, runs its own migrations, and switches screens — all
      // within this same already-running page, with zero dependency on
      // any fetch, cache, or second file being up to date.
      setGistBusy(false);
      if (typeof loadGame === 'function') loadGame();
      return;
    } catch(e) {
      setGistStatus('Pull failed — check your token, Gist ID, and connection.');
    }
    setGistBusy(false);
  };

  // Reflect saved Gist ID as a placeholder on load, so the field shows
  // what's already stored without the raw token ever being redisplayed.
  document.addEventListener('DOMContentLoaded', function(){
    const creds = loadGistCreds();
    const idEl = document.getElementById('gistIdInput');
    if (idEl && creds.gistId) idEl.placeholder = 'Gist ID: ' + creds.gistId + ' (leave blank to keep)';
    refreshGistIdDisplay();
    const tokenEl = document.getElementById('gistTokenInput');
    if (tokenEl && creds.token) tokenEl.placeholder = 'Token saved (leave blank to keep it)';
  });
})();
