
(function(){
  // -------------------------------------------------------------------
  // ARC XIII — A WORLD WITH ITS OWN RULES. Only Chapter 1's text has
  // been provided so far, so ARC13_CHAPTERS starts with just one entry —
  // genuinely extensible, not a stub sized for 24. Gated behind the
  // CONFIRMED real game.arc12Complete flag (verified directly in this
  // file, not assumed) + level 195, continuing the +15/arc pace exactly
  // (XI=165, XII=180, XIII=195).
  //
  // Cover image path is a placeholder guess following the established
  // convention — flagged for confirmation like every arc cover before
  // this. Same for Ch.1's own chapter image (San provided only the
  // splash, not a per-chapter image this time).
  // -------------------------------------------------------------------
  const ARC13_CHAPTERS = [
    {id:1, title:'A Harbour Full of People', focus:"The Crimson Tide arrives at a developed coastal harbour — unlike the first world, there's no silence here. Ships everywhere, fishermen working the docks, merchants unloading cargo, children running through the marketplace. San just watches. \"There are people here.\" For the first time, another world doesn't feel like a mystery site. It feels alive.", image:'assets/comics/arc13/ch01-a-harbour-full-of-people.png', xp:260, action:'⚓ Arrive at the Harbour'},
    {id:2, title:'Visitors',                 focus:"The crew registers with harbour officials as visitors from elsewhere and is granted temporary docking status — not a full welcome, but permission to actually be here.", image:'assets/comics/arc13/ch02-visitors.png', xp:260, action:'📋 Register as Visitors'},
    {id:3, title:'The Rules of the Harbour',  focus:"They learn the harbour's own docking procedures, restricted areas, permits, declared goods, and basic etiquette — the practical shape of being a guest here.", image:'assets/comics/arc13/ch03-the-rules-of-the-harbour.png', xp:260, action:'📜 Learn the Rules'},
    {id:4, title:'A Familiar Script',         focus:"San notices the local writing resembles Chinese characters — recognizable shapes, unfamiliar meanings and combinations. Familiar doesn't mean readable.", image:'assets/comics/arc13/ch04-a-familiar-script.png', xp:250, action:'🈶 Study the Writing'},
    {id:5, title:'Blending In',               focus:"The crew makes small efforts to fit respectfully into the local environment — new clothes, a borrowed wig, careful choices. Mimi, for now, hasn't changed a thing.", image:'assets/comics/arc13/ch05-blending-in.png', xp:270, action:'👘 Dress for the Harbour'},
    {id:6, title:'The Language Between Us',   focus:"Mimi reads context, Erynn compares symbols, Renn records vocabulary, San contributes recognized characters, Joel just wants the words for food, directions, and prices. Nobody becomes fluent — they build something they can actually use instead.", image:'assets/comics/arc13/ch06-the-language-between-us.png', xp:280, action:'🗣️ Build the Translation'},
    {id:7, title:'The Market by the Sea',     focus:"The crew explores ordinary stalls — food, fishing goods, cloth, tea, everyday commerce. Nothing dramatic. Just a market, doing what markets do.", image:'assets/comics/arc13/ch07-the-market-by-the-sea.png', xp:260, action:'🧺 Walk the Market'},
    {id:8, title:'The Boats They Build',      focus:"Joel studies the local boats and shipbuilding traditions, finding unexpected similarities to what he already knows — and just as many differences.", image:'assets/comics/arc13/ch08-the-boats-they-build.png', xp:260, action:'⛵ Study the Boats'},
    {id:9, title:'A Familiar Kind of Community', focus:"The crew observes family structures, neighbours, shared responsibilities — a community that runs on the same basic things communities everywhere run on.", image:'assets/comics/arc13/ch09-a-familiar-kind-of-community.png', xp:270, action:'🏘️ Observe the Community'},
    {id:10, title:'The Tea House',            focus:"A quieter chapter. The crew spends time as guests rather than adventurers — simply sitting, observing, and talking with locals over tea.", image:'assets/comics/arc13/ch10-the-tea-house.png', xp:250, action:'🍵 Sit and Listen'},
    {id:11, title:'Two Meanings for One Word', focus:"A translation mistake reveals that words carry cultural meaning that can't always cross over literally — their first real lesson in how much a single word can hide.", image:'assets/comics/arc13/ch11-two-meanings-for-one-word.png', xp:280, action:'📖 Untangle the Mistake'},
    {id:12, title:'A Request at the Harbour',  focus:"Someone approaches the crew directly for help — the first real Harbour Request. For the first time since arriving, Crimson Tide isn't just observing this place. They're being asked to be part of it.", image:'assets/comics/arc13/ch12-a-request-at-the-harbour.png', xp:260, action:'🤝 Hear the Request'},
    {id:13, title:'The Dispute',               focus:"The problem belongs to two local groups, not one, and both have a real claim to it. Nobody's clearly right. The crew does the only sensible thing available: they listen to both sides in full before saying anything.", image:'assets/comics/arc13/ch13-the-dispute.png', xp:270, action:'⚖️ Listen to Both Sides'},
    {id:14, title:'Not Our Rules',             focus:"Renn suggests something that would work back in Veyren. The locals patiently explain why it won't work here — different customs, different stakes, different history behind the disagreement entirely.", image:'assets/comics/arc13/ch14-not-our-rules.png', xp:260, action:'🧭 Suggest a Solution'},
    {id:15, title:'What the Harbour Needs',    focus:"The crew digs past the surface of the dispute — trade routes, fishing grounds, access, old traditions nobody explained to outsiders, responsibilities older than either side is saying out loud.", image:'assets/comics/arc13/ch15-what-the-harbour-needs.png', xp:280, action:'🔍 Investigate the Cause'},
    {id:16, title:'San Listens',               focus:"San stops reaching for a solution and starts asking the people in front of her what they actually want — not what she thinks is fair, not what would resolve it fastest. It matters more than anything Renn or Erynn could bring to this.", image:'assets/comics/arc13/ch16-san-listens.png', xp:300, action:'👂 Just Listen'},
    {id:17, title:"Joel's Practical Solution",  focus:"Joel doesn't bring magic to the table — he brings logistics. Harbour access, scheduling, how shared resources actually get shared in practice. Not flashy, but the first idea either side actually stops to consider.", image:'assets/comics/arc13/ch17-joels-practical-solution.png', xp:280, action:'🔧 Work the Logistics'},
    {id:18, title:'A Solution They Can Own',    focus:"The crew steps back and facilitates rather than decides — keeping both sides talking, making sure nobody's ignored. The final terms come from the people who have to live with them, because a solution handed down by outsiders wouldn't have lasted a season.", image:'assets/comics/arc13/ch18-a-solution-they-can-own.png', xp:300, action:'🤲 Let Them Choose'},
    {id:19, title:'The Agreement',              focus:"The two groups reach an agreement in their own words, on their own terms. Crimson Tide's part gets smaller and smaller as the conversation goes on — exactly as it should.", image:'assets/comics/arc13/ch19-the-agreement.png', xp:320, action:'🤝 Reach the Agreement'},
    {id:20, title:'What We Were Wrong About',   focus:"Alone afterward, the crew sits with everything they assumed walking in — that they'd need to fix something, that knowing Veyren meant knowing how things should work here. None of it held up.", image:'assets/comics/arc13/ch20-what-we-were-wrong-about.png', xp:280, action:'💭 Reflect'},
    {id:21, title:'A Place Worth Knowing',      focus:"The locals invite them to stay longer, and this time it's genuine welcome, not procedure. Meals, stories, and small pieces of knowledge start passing both directions — this stops feeling like an expedition destination.", image:'assets/comics/arc13/ch21-a-place-worth-knowing.png', xp:300, action:'🏮 Accept the Invitation'},
    {id:22, title:'Trade Across Worlds', focus:"A small trade agreement gets worked out — nothing grand, just a real starting point. The first actual foundation for commerce between worlds, built on an afternoon of ordinary conversation rather than any grand negotiation.", image:'assets/comics/arc13/ch22-trade-across-worlds.png', xp:300, action:'🤝 Strike the Agreement'},
    {id:23, title:'The Harbour Farewell', focus:"Leaving turns out to be harder than arriving was. This stopped being just an expedition destination somewhere along the way, and saying goodbye means admitting that out loud.", image:'assets/comics/arc13/ch23-the-harbour-farewell.png', xp:280, action:'👋 Say Goodbye'},
    {id:24, title:'What We Bring Home', focus:"Samples. Writing and vocabulary, still incomplete. Navigation notes. Trade goods. A better sense of local customs. Small gifts. And new relationships that didn't exist a few weeks ago — the kind of cargo that doesn't show up on a manifest.", image:'assets/comics/arc13/ch24-what-we-bring-home.png', xp:320, action:'📦 Take Stock'},
    {id:25, title:"A World of Its Own Rules", focus:"The crew prepares to leave. \"Every world has its own rules,\" San says. \"Its own history. Its own people. We don't have to make them ours. We only have to learn how to meet them.\"", image:'assets/comics/arc13/ch25-a-world-of-its-own-rules.png', xp:520, action:'⚓ Set Sail for Home'}
  ];
  window.ARC13_CHAPTERS = ARC13_CHAPTERS;

  window.arc13ObjectiveState = function(){
    if (!game.arc12Complete) return null;
    if (level() < 195) return null;
    game.comicProgress13 = game.comicProgress13 || {};
    for (const ch of ARC13_CHAPTERS) {
      if (!game.comicProgress13[ch.id]) return 'complete_arc13_chapter_' + ch.id;
    }
    return 'arc13_part1_complete_for_now';
  };

  const ARC13_CHAPTER_SCENES = {
    1: "The Crimson Tide arrives at a developed coastal harbour.<br><br>Unlike their first world, there is no silence.<br><br>Ships are everywhere. Fishermen work the docks. Merchants unload cargo. Children run through the marketplace.<br><br>San simply watches.<br><br>\"There are people here.\"<br><br>For the first time, another world doesn't feel like a mystery site.<br><br>It feels alive.",
    2: "Harbour officials meet them almost as soon as they've properly moored — not with hostility, just procedure.<br><br>The crew explains, as best they can, that they've come from elsewhere. The officials don't ask exactly what that means. They issue a temporary visitor status instead, along with a list of conditions that come with it.<br><br>It isn't full welcome. It's something more useful right now — permission to actually be here while they figure out the rest.",
    3: "A harbour official walks them through what's expected: where they're allowed to go, where they aren't, what needs a permit, what needs to be declared before it comes off the ship.<br><br>None of it is unreasonable. Most of it is just the ordinary shape of a working harbour that's had outsiders pass through before.<br><br>Joel takes to it fastest, treating the whole list the way he'd treat any set of dock regulations back home — something to be followed carefully, not questioned.",
    4: "San is the one who notices it first, studying a weathered sign near the harbour master's office.<br><br>The shapes are familiar. Some of them she can even read, or almost read — fragments that resemble characters she already knows.<br><br>But the meanings don't line up the way she expects, and neither do the combinations. Familiar doesn't mean readable. It's close enough to be genuinely disorienting.",
    5: "Nobody wants to stand out more than they have to, so the crew makes what small adjustments they can.<br><br>San puts on local dress. Joel wears a traditional outfit that suits the harbour's own style. Renn finally gets some use out of the wig he bought on a whim, deciding it actually helps him blend in here. Erynn adjusts his own appearance to match, and Eliz genuinely enjoys the local fashion and craftsmanship, treating it less like a disguise and more like something worth appreciating on its own.<br><br>Mimi hasn't changed anything yet — still in her usual clothes, for now. And Soel draws more curious looks from locals than anyone quite expects.",
    6: "Nobody becomes fluent. That was never realistic, and everyone seems to understand it going in.<br><br>What they build instead is something more patient. Mimi works from context, piecing together meaning from situation rather than vocabulary. Erynn compares symbols that keep recurring, looking for the pattern underneath. Renn writes down every new word he can pin to something concrete. San contributes the characters she already half-recognizes from home.<br><br>Joel keeps it simple and practical — food, directions, prices, the harbour's own rules. The words that actually get you through a day.<br><br>By the end of it, they don't have a language. They have the beginning of a working system, built one exchange at a time.",
    7: "The market doesn't need to be dramatic to be worth walking through. Stalls of fish, fresh off the boats that morning. Bolts of cloth in colors none of them quite have a name for. Tea leaves sold loose by weight. Ordinary haggling, ordinary noise.<br><br>Nobody's hunting for anything in particular. They're just letting the place be what it actually is — a market, doing what markets do, the same as any market back home.",
    8: "Joel spends most of the day at the boatyards, watching hulls go together plank by plank.<br><br>Some of it is startlingly familiar — the same instincts toward balance, the same respect for what the sea actually demands of a hull. Some of it isn't familiar at all, built around problems Joel's never had to solve on the Crimson Tide.<br><br>He doesn't say much about it out loud. He just watches longer than anyone expects him to.",
    9: "It isn't anything dramatic. Just people — families, neighbours, the small daily give-and-take of a community looking out for itself.<br><br>Shared chores. Children minded by whoever's free. Old arguments that clearly aren't new. None of it needs translating to be understood.<br><br>Whatever else is different about this world, this part isn't. People here take care of each other roughly the same way people do anywhere.",
    10: "For once, nobody's investigating anything.<br><br>The crew sits in a tea house, sharing a table with locals who seem more curious than wary. Cups get refilled without being asked. Conversation moves slowly, half in gesture, half in the handful of words they've actually managed to learn.<br><br>It's a small, quiet afternoon. It might be the most honest look they've had at this place yet — not as a destination to study, but as somewhere people just live.",
    11: "The mistake is small, and nobody even notices it happening until the confusion sets in.<br><br>A word Mimi was sure she understood turns out to carry something else entirely here — a weight, a context, a history that doesn't travel with the literal meaning.<br><br>It gets sorted out without real harm done. But it leaves a mark on how the crew thinks about the translation system they've been building. Some words were never going to cross over cleanly, no matter how carefully anyone listened.",
    12: "Someone finally approaches the crew directly — not a harbour official, not a curious onlooker, but a person with an actual problem, the first real question anyone's asked expecting that Crimson Tide might actually help.<br><br>It's small, on the surface. It won't stay small for long.<br><br>For the first time since arriving, the crew isn't just observing this harbour. They're being asked to be part of it.",
    13: "The problem turns out to belong to two groups, not one, and both of them have a real claim to it.<br><br>Nobody's clearly right. Nobody's clearly wrong.<br><br>The crew does the only sensible thing available to them: they sit, and they listen — to both sides, in full — before anyone says a word about what should happen next.",
    14: "Renn has an idea almost immediately, something that would work back in Veyren, something he's seen solve exactly this kind of dispute before.<br><br>The locals hear him out, and then, patiently, explain exactly why it won't work here. Different customs. Different stakes. Different history behind the disagreement entirely.<br><br>It isn't that Renn's idea is bad. It's that it was never theirs to offer in the first place.",
    15: "The crew starts digging past the surface of the dispute, into what's actually driving it — trade routes, fishing grounds, who gets access to what and when, old traditions nobody thought to explain to outsiders, responsibilities that go back further than either side is saying out loud.<br><br>The problem was never really about what it looked like on the surface. It rarely is.",
    16: "San stops trying to fix it.<br><br>That's the real shift — she stops reaching for a solution and starts asking the people standing in front of her what they actually want. Not what she thinks would be fair. Not what would resolve it fastest.<br><br>What they want.<br><br>It's a small change in approach. It ends up mattering more than anything Renn's engineering or Erynn's research could have brought to this.",
    17: "Joel doesn't bring magic to the table, and he doesn't try to.<br><br>He brings logistics instead — harbour access, which boats go where and when, how shared resources actually get shared in practice rather than in theory. The kind of problem he's spent years solving without ever calling it magic.<br><br>It's not flashy. It's the first idea either side actually stops to consider.",
    18: "The crew steps back and lets the arrangement take its own shape.<br><br>They facilitate — asking questions, keeping both sides talking, making sure nobody's simply being ignored. But the final shape of it, the actual terms, come from the people who have to live with them.<br><br>It matters that it's theirs. A solution handed down by outsiders wouldn't have lasted a season.",
    19: "The two groups reach an agreement of their own making, worked out in their own words, on their own terms.<br><br>Crimson Tide's part in it gets smaller and smaller as the conversation goes on — exactly as it should. Nobody needed a hero here. They needed someone willing to sit still long enough to let them talk it through.",
    20: "Afterward, alone, the crew sits with everything they assumed walking in.<br><br>That they'd need to fix something. That their outside perspective would matter more than it did. That knowing how things work in Veyren meant knowing how they should work here.<br><br>None of that held up. Not one piece of it.<br><br>It's an uncomfortable thing to sit with. It's also, San thinks, probably the most useful lesson the harbour could have taught them.",
    21: "The locals ask them to stay a while longer, and this time it isn't procedure or obligation behind the invitation. It's something closer to genuine welcome.<br><br>Meals get shared. Stories trade hands in both directions. Little pieces of knowledge — about the sea, about each other's worlds — start passing back and forth without anyone keeping score.<br><br>For the first time since the door opened, this stops feeling like an expedition destination and starts feeling like somewhere they actually know.",
    22: "It happens over an afternoon, not a formal negotiation — someone mentions what Fair Tide could use, someone else mentions what the harbour has too much of, and by the time anyone thinks to call it a meeting, most of the terms are already agreed.<br><br>Small. Modest. Nothing that would impress a merchant back in Veyren.<br><br>But it's real, and it's theirs, and it's the first one. Every trade route that comes after this one starts here.",
    23: "Leaving turns out to be harder than arriving was.<br><br>There's no procedure for this part — no customs to follow, no rules of the harbour to learn. Just people who've gotten used to having them around, saying goodbye like they mean it.<br><br>Somewhere in the last few weeks, without anyone quite deciding it, this stopped being a destination and started being somewhere they actually know.",
    24: "The hold fills with more than cargo.<br><br>Samples. Pages of vocabulary, still incomplete, still full of gaps Mimi and Erynn are already arguing about. Navigation notes. Trade goods. A better sense of what not to say and when not to say it.<br><br>Small gifts, pressed into hands at the last minute. And new relationships that didn't exist a few weeks ago — the kind of cargo that never shows up on any manifest, but matters more than anything that does.",
    25: "The crew prepares to leave.<br><br>San looks back at the harbour one last time.<br><br>\"Every world has its own rules,\" she says. \"Its own history. Its own people.\"<br><br>\"We don't have to make them ours.\"<br><br>\"We only have to learn how to meet them.\"<br><br>Behind them, the harbour goes on being exactly what it always was — someone else's home. They just got to be guests in it for a while."
  };
  window.ARC13_CHAPTER_SCENES = ARC13_CHAPTER_SCENES;

  window.markArc13ChapterRead = function(id){
    id = Number(id);
    const ch = ARC13_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc13] no chapter data for id', id); return; }
    game.comicProgress13 = game.comicProgress13||{};
    if(game.comicProgress13[id]){ toast('✓ Already marked read.'); return; }
    if(window.arc13ObjectiveState() !== 'complete_arc13_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress13[id] = true;
    if (id === 1) game.harbourDiscovered = true; // unlocks the Harbour location itself
    if (id === 8 && typeof window.unlockHarbourSection === 'function') window.unlockHarbourSection('shipwright'); // "The Boats They Build" — Joel studies local shipbuilding
    if (id === 10 && typeof window.unlockHarbourSection === 'function') window.unlockHarbourSection('guesthouse'); // "The Tea House"
    if (id === 12 && typeof window.unlockHarbourSection === 'function') window.unlockHarbourSection('requests'); // "A Request at the Harbour" — explicitly "the first proper Harbour Request gameplay interaction"
    if (id === 12 && typeof window.advanceHarbourRelationship === 'function') window.advanceHarbourRelationship(); // New Visitors -> Recognised Guests
    if (id === 19 && typeof window.advanceHarbourRelationship === 'function') window.advanceHarbourRelationship(); // "The Agreement" -> Trusted Visitors
    if (id === 22 && typeof window.advanceHarbourRelationship === 'function') window.advanceHarbourRelationship(); // Trusted Visitors -> Friends / Trade Partners
    // Market + Trade moved from their original per-chapter unlocks (Ch.7
    // "The Market by the Sea", Ch.22 "Trade Across Worlds") to firing
    // together only once the whole arc is complete — per request, real
    // commerce with the harbour shouldn't be available until the story
    // arc has actually concluded, not partway through it.
    if (id === 25) {
      game.arc13Complete = true;
      if (typeof window.unlockHarbourSection === 'function') { window.unlockHarbourSection('market'); window.unlockHarbourSection('trade'); }
    }
    gainXP(ch.xp);
    game.reputation = (game.reputation||0) + 1;
    logEvent('📖 Arc XIII Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if (ARC13_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC13_CHAPTER_SCENES[id] });
    }
    if (typeof renderMainGoal === 'function') try { renderMainGoal(); } catch(e) {}
    if (typeof renderStory === 'function') try { renderStory(); } catch(e) {}
  };

  window.__ctShowArc13Splash = function(){
    const overlay = document.getElementById('arc13SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc13Splash = function(){
    const overlay = document.getElementById('arc13SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc13SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc13 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc13) oldRenderStoryForArc13();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc13Ready = window.arc13ObjectiveState() !== null;
    if (arc13Ready && !game.arc13SplashSeen && typeof window.__ctShowArc13Splash === 'function') {
      window.__ctShowArc13Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc13/arc13-cover-a-world-of-its-own-rules.png" alt="Arc XIII — A World With Its Own Rules" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XIII</div><div class="story-act-title">A World With Its Own Rules</div>'+
      '<div class="story-act-tagline">A world is not a backdrop. It is someone\'s home.</div></div>';
    if (!arc13Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XIII Locked</div><div class="story-chapter-sub">'+
        (!game.arc12Complete ? 'Finish Arc XII first.' : 'Reach Level 195 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc13ObjectiveState();
    ARC13_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress13 && game.comicProgress13[ch.id]);
      const ready = !done && so===('complete_arc13_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
        '<button class="btn btn-small btn-success" onclick="markArc13ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc13_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XIII chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
