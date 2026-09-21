
(function(){
  // -------------------------------------------------------------------
  // ARC XV — SHAPE OF A PEOPLE. Chapters 1-5 wired (Part I underway) —
  // building in batches as the outline arrives, same pattern as every
  // arc since XI. Gated behind arc14Complete + level 225, continuing the
  // +15/arc pace exactly (XIII=195, XIV=210, XV=225).
  //
  // The Clan Settlement/Wilderness mechanic San described (Settlement/
  // Market/Wilderness/Crafts/Community/Requests/Explore tabs, regional
  // zone exploration, the 6 themed monsters, the Old Moon Beast) is
  // deliberately NOT built yet — narrative only, same as how the Tide
  // Network stayed unbuilt until San explicitly greenlit it separately.
  // Noted and ready for whenever that's next.
  // -------------------------------------------------------------------
  const ARC15_CHAPTERS = [
    {id:1, title:'The Shape in the Forest', focus:"The Crimson Tide reaches a new world and finds enormous tracks near the shore. At first it looks like a large animal — until the tracks lead directly into a settled community.", image:'assets/comics/arc15/ch01-the-shape-in-the-forest.png', xp:280, action:'👣 Follow the Tracks'},
    {id:2, title:'Someone Is Watching',      focus:"The crew notices people watching from the forest — some clearly human, others clearly not. Nobody attacks. The locals just seem uncertain about these strange visitors.", image:'assets/comics/arc15/ch02-someone-is-watching.png', xp:280, action:'👀 Watch Back'},
    {id:3, title:'The Ones Who Change',      focus:"The crew finally meets the shapeshifting people. Transformation is completely natural to them — one person casually changes form mid-conversation, leaving San's group momentarily stunned. The locals find the reaction more amusing than anything.", image:'assets/comics/arc15/ch03-the-ones-who-change.png', xp:290, action:'😮 Meet the Shapeshifters'},
    {id:4, title:'Not a Curse',              focus:"San carefully asks whether transformation is something they suffer from. The locals are just confused. \"Why would we call it a curse?\" San realizes the crew already brought an assumption with them that never belonged here.", image:'assets/comics/arc15/ch04-not-a-curse.png', xp:300, action:'❓ Ask the Question'},
    {id:5, title:'Two Forms, One Person',    focus:"Transformation doesn't create a different personality — the same person stays the same person, names and relationships and responsibilities intact either way. Renn is fascinated by the biological and magical implications.", image:'assets/comics/arc15/ch05-two-forms-one-person.png', xp:290, action:'🔬 Ask Renn to Explain'},
    {id:6, title:'Life in Two Shapes',       focus:"The crew watches ordinary life — families, children, markets, crafts, homes, work. Some stay in one form most of the day, others shift back and forth constantly. Nobody treats either as unusual.", image:'assets/comics/arc15/ch06-life-in-two-shapes.png', xp:280, action:'🏘️ Watch the Village Live'},
    {id:7, title:'The Homes They Built',     focus:"The architecture makes sense once the crew understands the culture — doorways, furniture, clothing, and public spaces all built around flexibility. Joel: \"They didn't adapt themselves to the buildings. They built the buildings for themselves.\"", image:'assets/comics/arc15/ch07-the-homes-they-built.png', xp:290, action:'🏠 See How They Built'},
    {id:8, title:'Growing Into Yourself',    focus:"The crew meets children learning to control their transformations — some confident, some struggling, some preferring one form, others loving the change itself. Their families treat it as part of growing up, not something to fix.", image:'assets/comics/arc15/ch08-growing-into-yourself.png', xp:300, action:'🌱 Meet the Children'},
    {id:9, title:'The Names We Keep',        focus:"San discovers some people use different names or titles per form, others keep exactly the same name — no single cultural rule behind it. Erynn: identity here is more complicated than appearance.", image:'assets/comics/arc15/ch09-the-names-we-keep.png', xp:300, action:'📛 Learn Their Names'},
    {id:10, title:'The Festival of Forms',   focus:"A local festival celebrating the community's different forms looks ceremonial from a distance and turns out to be wonderfully ordinary up close — food, music, family, games, storytelling. Soel loves the chaos of it.", image:'assets/comics/arc15/ch10-the-festival-of-forms.png', xp:320, action:'🎉 Join the Festival'},
    {id:11, title:'The Outsiders',           focus:"A nearby community has feared the shapeshifters for generations — not because of anything recent, but because of stories and misunderstandings that outlived whatever originally caused them.", image:'assets/comics/arc15/ch11-the-outsiders.png', xp:300, action:'👥 Learn of the Outsiders'},
    {id:12, title:'The Story They Tell',     focus:"San hears the outsiders describe the shapeshifters as dangerous and untrustworthy. The shapeshifters have their own version of the same history, and it doesn't match. Neither account is entirely simple.", image:'assets/comics/arc15/ch12-the-story-they-tell.png', xp:310, action:'📖 Hear Their Story'},
    {id:13, title:'What Actually Happened',  focus:"Renn and Erynn dig through old records and find a conflict far smaller than either side's story suggests. A misunderstanding became a tradition, a tradition became a warning, and the warning eventually became \"history.\"", image:'assets/comics/arc15/ch13-what-actually-happened.png', xp:320, action:'📜 Check the Records'},
    {id:14, title:'Not Everyone Agrees',     focus:"The shapeshifter community is far from unanimous — some want contact with outsiders, others isolation; some want tradition unchanged, others want to adapt. San realizes this was never hers to decide for them.", image:'assets/comics/arc15/ch14-not-everyone-agrees.png', xp:300, action:'🗳️ Hear Both Sides'},
    {id:15, title:'The Ones Who Leave',      focus:"The crew meets shapeshifters who chose to live outside their traditional communities, adapting elsewhere while keeping parts of their heritage — challenging the idea there's only one correct way to belong.", image:'assets/comics/arc15/ch15-the-ones-who-leave.png', xp:320, action:'🚶 Meet Those Who Left'},
    {id:16, title:'What Makes a Person',     focus:"Mimi reflects on how easily people define each other by the easiest thing to see. Renn works through appearance, biology, and identity. Erynn: \"A shape tells you what someone looks like. It doesn't tell you who they are.\"", image:'assets/comics/arc15/ch16-what-makes-a-person.png', xp:350, action:'🪞 Consider What Makes a Person'},
    {id:17, title:'A Problem Between Neighbours', focus:"The crew is asked to help with a dispute between the shapeshifters and their neighbours. What looks like a safety issue turns out to really be about land, movement, and old boundaries.", image:'assets/comics/arc15/ch17-a-problem-between-neighbours.png', xp:330, action:'🤝 Hear Them Out'},
    {id:18, title:'The Shape of Fear',        focus:"Both sides have real grievances — some shapeshifters have been treated unfairly, some neighbouring families were raised to fear them. San refuses to make either side the villain.", image:'assets/comics/arc15/ch18-the-shape-of-fear.png', xp:340, action:'⚖️ Weigh Both Sides'},
    {id:19, title:'What Would You Change?',   focus:"San asks the shapeshifters directly what they actually want — not what outsiders assume, not what San thinks would fix it. The answers aren't unanimous.", image:'assets/comics/arc15/ch19-what-would-you-change.png', xp:340, action:'🗣️ Ask What They Want'},
    {id:20, title:'A Place for Both',         focus:"Joel works the practical side — shared paths, boundary markers, scheduled access, real communication between the two communities. The Crimson Tide doesn't solve the social problem; they just build the conditions for the locals to solve it themselves.", image:'assets/comics/arc15/ch20-a-place-for-both.png', xp:360, action:'🛠️ Work Out the Arrangement'},
    {id:21, title:'They Choose', focus:"The communities reach their own arrangement. Some people stay cautious. Some grow curious. Some relationships even begin. Nobody suddenly forgets generations of history — but they have something new now: a choice.", image:'assets/comics/arc15/ch21-they-choose.png', xp:340, action:'🤝 Let Them Choose'},
    {id:22, title:'More Than One Shape', focus:"The crew spends their final days learning more about the shapeshifters, and San realizes that even within this one civilization, people don't all define themselves the same way. That turns out to be perfectly normal.", image:'assets/comics/arc15/ch22-more-than-one-shape.png', xp:300, action:'🌗 Keep Learning'},
    {id:23, title:'What We Thought We Saw', focus:"Before leaving, the crew looks back on their own first impressions. Tracks. Then monsters. Then strange people. Eventually, just people. \"We were looking at their shape,\" San says. \"Instead of looking at them,\" Joel answers.", image:'assets/comics/arc15/ch23-what-we-thought-we-saw.png', xp:320, action:'👣 Look Back'},
    {id:24, title:'Shape of a People', focus:"The crew prepares to leave. The locals see them off — some still in their alternate forms, some back in the ones the crew first met. It doesn't matter anymore which. \"Every people has a shape. But no shape tells the whole story. We came looking at what they were. We left knowing who they were.\"", image:'assets/comics/arc15/ch24-shape-of-a-people.png', xp:560, action:'⚓ Sail Onward'}
  ];
  window.ARC15_CHAPTERS = ARC15_CHAPTERS;

  window.arc15ObjectiveState = function(){
    if (!game.arc14Complete) return null;
    if (level() < 225) return null;
    game.comicProgress15 = game.comicProgress15 || {};
    for (const ch of ARC15_CHAPTERS) {
      if (!game.comicProgress15[ch.id]) return 'complete_arc15_chapter_' + ch.id;
    }
    return 'arc15_part1_complete_for_now';
  };

  const ARC15_CHAPTER_SCENES = {
    1: "The Crimson Tide reaches a new world.<br><br>Enormous tracks near the shore are the first thing anyone notices.<br><br>At first, the crew assumes they're dealing with a large animal — something to watch for, maybe avoid.<br><br>Then the tracks don't stop at the tree line.<br><br>They lead directly into a settled community.",
    2: "It doesn't take long to notice they're being watched.<br><br>Figures at the tree line, some unmistakably human, others clearly something else entirely. Nobody raises a weapon. Nobody moves to attack.<br><br>What comes across instead is uncertainty — the same careful distance the crew themselves would probably keep, meeting something unfamiliar for the first time. Whatever's out there watching them isn't hostile. It just hasn't decided what they are yet.",
    3: "The meeting happens almost casually, which somehow makes it stranger.<br><br>Mid-conversation, without any warning or ceremony, one of the locals simply changes shape — and keeps talking through it like nothing happened, because to them, nothing did.<br><br>San's group goes completely still. The locals notice, and find it funny more than anything — not offended, just amused at how big a reaction something so ordinary to them manages to get.",
    4: "San tries to ask carefully, the way she'd ask about anything that might be a sensitive subject. Is the transformation something they suffer from? Something they'd want lifted, if it could be?<br><br>The question just confuses the person she asks.<br><br>\"Why would we call it a curse?\"<br><br>San doesn't have a good answer. She realizes, a beat too late, that the assumption was never theirs to begin with — it walked in with the crew, and it never actually belonged here.",
    5: "The more they learn, the clearer it gets: changing shape doesn't change who someone is.<br><br>Names stay the same. Relationships stay the same. Whatever someone's responsible for, whatever work they do, none of it resets just because their body looks different for a while. It's not a second self. It's the same person, in another form.<br><br>Renn can barely sit still through the explanation, already circling questions about how the magic and the biology of it actually fit together — the kind of question that's going to keep him up half the night.",
    6: "The crew spends time just watching people live.<br><br>Families. Children running between market stalls. Craftspeople at work. Homes, quiet in the afternoon.<br><br>Some people stay in one shape for most of the day. Others shift back and forth without a second thought. Nobody here treats either choice as strange — it's simply how different people live.",
    7: "The architecture starts making sense once the crew actually understands the culture behind it.<br><br>Doorways sized for more than one shape. Furniture built to work either way. Clothing, public spaces, everything quietly designed around flexibility rather than one fixed idea of a body.<br><br>Joel puts it plainly, watching a doorway that's clearly meant for exactly this.<br><br>\"They didn't adapt themselves to the buildings.\"<br><br>\"They built the buildings for themselves.\"",
    8: "The crew meets children still learning to control their own transformations.<br><br>Some of them are confident about it already, shifting easily, almost showing off. Others are still struggling, working through something that clearly doesn't come naturally yet. Some prefer to stay in one form most of the time. Others clearly love the change itself.<br><br>Their families don't treat any of it as a problem needing a solution. It's just part of growing up here — no different from learning to walk, or read, or swim.",
    9: "San notices something that doesn't quite fit a single pattern: some people go by different names, even different titles, depending on which form they're in. Others use exactly the same name no matter what shape they're wearing.<br><br>There's no single rule behind it. It's personal, apparently, the same way a nickname is personal.<br><br>Erynn's the one who puts words to what San's already sensing. Identity here is a lot more complicated than what a person happens to look like at any given moment.",
    10: "The crew ends up at a local festival built entirely around celebrating the community's different forms.<br><br>It looks ceremonial from a distance — formal, maybe even solemn. Up close, it's nothing like that at all. Food everywhere. Music. Families gathered in loose clusters, telling stories, playing games that seem to change their own rules depending on who's playing.<br><br>Soel throws himself straight into the middle of it, thoroughly delighted by the chaos of the whole thing.",
    11: "The crew learns that a nearby community has feared the shapeshifters for as long as anyone there can remember.<br><br>It isn't rooted in anything recent. There's no attack anyone can actually point to, no clear incident anyone living has witnessed. It's older than that — generations of stories, passed down and reshaped each time, until the fear outlived whatever originally caused it.",
    12: "San sits with the outsiders and hears their version of things.<br><br>In their telling, the shapeshifters are dangerous. Not to be trusted, not fully understood, best kept at a careful distance.<br><br>The shapeshifters have their own version of the same history, and it doesn't match. Neither account is simple, and neither side is entirely wrong about how they feel — even if the facts underneath don't agree.",
    13: "Renn and Erynn go looking for something closer to the truth, digging through whatever old records either side still has.<br><br>What they find is smaller than either story suggests. A real conflict, once, but a modest one — nothing like the scale either community's version has grown into.<br><br>A misunderstanding became a tradition. A tradition became a warning. And somewhere along the way, repeated enough times, the warning just became \"history.\"",
    14: "The shapeshifter community turns out to be far from unanimous on any of it.<br><br>Some want more contact with the outsiders — trade, conversation, an end to generations of distance. Others would rather keep things exactly as they are. Some believe their traditions shouldn't bend for anyone. Others think adapting is the only way forward.<br><br>San listens to all of it and comes to a clear realization: this isn't a decision that's hers to make for them. It was never going to be.",
    15: "The crew meets shapeshifters who chose, at some point, to leave their traditional communities behind and build a life somewhere else entirely — adapting to other societies while still holding onto pieces of where they came from.<br><br>It's a quiet complication to everything the crew thought they understood. There isn't one correct way to belong here. There might not be one correct way to belong anywhere.",
    16: "Mimi's been turning something over since the festival, and she finally says it out loud: how often people define each other by whatever's easiest to see, and nothing more.<br><br>Renn starts working through it out loud too — appearance, biology, what identity actually rests on when a body can change and a person doesn't.<br><br>It's Erynn who says the part that actually lands.<br><br>\"A shape tells you what someone looks like.\"<br><br>\"It doesn't tell you who they are.\"",
    17: "The request comes carefully, almost apologetically — the shapeshifters and their neighbours need help with something that's been simmering a long time.<br><br>At first it sounds simple enough, framed as a matter of safety. It doesn't take long talking to both sides to realize that's not really what this is about.<br><br>It's land. Movement. Old boundaries nobody quite agrees on anymore, and hasn't for longer than anyone wants to admit.",
    18: "Neither side is wrong to feel what they feel, and that's exactly what makes this hard.<br><br>Some of the shapeshifters have genuinely been treated unfairly — passed over, mistrusted, blamed for things that were never actually their doing. Some of the neighbouring families grew up being taught to be afraid, and that fear doesn't just switch off because it's inconvenient.<br><br>San refuses to sort anyone into a hero or a villain over it. Both things are true at once, and pretending otherwise wouldn't help anybody.",
    19: "San does something simple that nobody quite expects: she asks the shapeshifters what they actually want.<br><br>Not what she assumes they'd want. Not what would make the problem easiest to close out. What they want, in their own words.<br><br>The answers don't line up neatly. Different people want different things, sometimes contradictory things — which, San's starting to realize, is exactly what you'd expect from any group of people who happen to share one label and nothing else.",
    20: "Joel takes the part of the problem that's actually his to solve — not the feelings, but the logistics underneath them.<br><br>Shared paths that work for everyone. Boundary markers both communities actually agree on. Scheduled times for spaces that get contested. A real line of communication between the two sides, instead of assumptions passed back and forth.<br><br>None of it magically resolves what people feel about each other. It was never going to. What it does is give both communities room to work the rest out themselves, on their own terms — which, in the end, is all the Crimson Tide was ever really able to offer.",
    21: "The two communities reach an arrangement of their own making.<br><br>Some people stay cautious — old caution doesn't just evaporate because a schedule got written down. Some grow curious instead, crossing over just to see for themselves. A few relationships even start, tentative and new.<br><br>Nobody forgets generations of history overnight. That was never the goal.<br><br>What they have now is something they didn't have before: a choice.",
    22: "The crew spends their last few days here just learning, without any particular agenda attached to it.<br><br>San notices something she hadn't quite put into words before — even within this one civilization, shapeshifters don't all define themselves the same way. Some lean hard into one form. Some move fluidly between both without much thought. Some describe themselves in ways that don't map neatly onto either.<br><br>And apparently, here, that's just what being a person looks like. Nobody treats it as a problem to solve.",
    23: "Before they leave, the crew sits with their own first impressions of this place, laid out plainly against what they know now.<br><br>They saw tracks first. Then monsters. Then strange people, still being sized up as strange.<br><br>Eventually, without anyone quite marking the moment it happened, they just saw people.<br><br>\"We were looking at their shape,\" San says.<br><br>\"Instead of looking at them,\" Joel finishes.",
    24: "The Crimson Tide prepares to leave.<br><br>The locals come to see them off. Some stay in their alternate forms the whole time. Others shift back to the shapes the crew first met, weeks ago now. Nobody remarks on it either way — it stopped being the point a while back.<br><br>\"Every people has a shape,\" San says, watching the shoreline start to pull away. \"But no shape tells the whole story.\"<br><br>\"We came looking at what they were.\"<br><br>\"We left knowing who they were.\"<br><br>The Crimson Tide sails onward."
  };
  window.ARC15_CHAPTER_SCENES = ARC15_CHAPTER_SCENES;

  window.markArc15ChapterRead = function(id){
    id = Number(id);
    const ch = ARC15_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc15] no chapter data for id', id); return; }
    game.comicProgress15 = game.comicProgress15||{};
    if(game.comicProgress15[id]){ toast('✓ Already marked read.'); return; }
    if(window.arc15ObjectiveState() !== 'complete_arc15_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress15[id] = true;
    if (id === 1) game.clanSettlementDiscovered = true; // matches harbourDiscovered/tideNetworkDiscovered — unlocks the location itself once that mechanic is built
    if (id === 6 && typeof window.unlockClanSection === 'function') window.unlockClanSection('market'); // "Life in Two Shapes" — scene text explicitly mentions "market stalls"
    if (id === 7 && typeof window.unlockClanSection === 'function') window.unlockClanSection('crafts'); // "The Homes They Built" — architecture/craftsmanship, doorways and furniture built for both forms
    if (id === 10 && typeof window.unlockClanSection === 'function') window.unlockClanSection('community'); // "The Festival of Forms" — scene text: "families gathered", a genuine communal celebration
    if (id === 17 && typeof window.unlockClanSection === 'function') window.unlockClanSection('requests'); // "A Problem Between Neighbours" — scene text explicitly opens with "The request comes..."
    if (id === 24) game.arc15Complete = true;
    gainXP(ch.xp);
    game.reputation = (game.reputation||0) + 1;
    logEvent('📖 Arc XV Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if (ARC15_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC15_CHAPTER_SCENES[id] });
    }
    if (typeof renderMainGoal === 'function') try { renderMainGoal(); } catch(e) {}
    if (typeof renderStory === 'function') try { renderStory(); } catch(e) {}
  };

  window.__ctShowArc15Splash = function(){
    const overlay = document.getElementById('arc15SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc15Splash = function(){
    const overlay = document.getElementById('arc15SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc15SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc15 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc15) oldRenderStoryForArc15();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc15Ready = window.arc15ObjectiveState() !== null;
    if (arc15Ready && !game.arc15SplashSeen && typeof window.__ctShowArc15Splash === 'function') {
      window.__ctShowArc15Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<div class="story-act-kicker">Arc XV</div><div class="story-act-title">Shape of a People</div>'+
      '<div class="story-act-tagline">A people are more than the shape they take.</div></div>';
    if (!arc15Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XV Locked</div><div class="story-chapter-sub">'+
        (!game.arc14Complete ? 'Finish Arc XIV first.' : 'Reach Level 225 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc15ObjectiveState();
    ARC15_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress15 && game.comicProgress15[ch.id]);
      const ready = !done && so===('complete_arc15_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
        '<button class="btn btn-small btn-success" onclick="markArc15ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc15_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XV chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();


(function(){
  // -------------------------------------------------------------------
  // GOLD GUARD, CONTINUOUS. The existing V79 fix (ct-build-v79-gold-nan-
  // fix) only guards two of the 39 places in this file that touch
  // game.gold (buyGood/sellGood), and its repair only runs once, at
  // loadGame(). If gold gets corrupted by any of the other 37 sites, or
  // gets corrupted again mid-session after that one-time repair already
  // ran, the player is stuck seeing "NaN g" until the next full reload.
  // San's screenshot showed exactly that — Day 1338, Level 199, already
  // NaN in an active session.
  //
  // Rather than auditing all 39 sites individually to find which one
  // caused this specific instance (which may have happened long ago,
  // from a bug that no longer exists, leaving only the corrupted value
  // behind), this guards continuously at the two places that actually
  // matter: right before the number is ever shown, and right before it's
  // ever saved. Whatever corrupts it, this catches it within one UI
  // update and never lets it reach localStorage.
  // -------------------------------------------------------------------
  function repairGoldNow(){
    if (typeof game === 'undefined') return;
    if (!Number.isFinite(Number(game.gold))) {
      console.warn('[GoldGuard] game.gold was non-finite ('+game.gold+') — resetting to 0.');
      game.gold = 0;
    }
  }
  window.__ctRepairGoldNow = repairGoldNow;

  const oldUpdateUIForGoldGuard = window.updateUI;
  window.updateUI = function(){
    repairGoldNow();
    return oldUpdateUIForGoldGuard.apply(this, arguments);
  };

  const oldSaveGameForGoldGuard = window.saveGame;
  window.saveGame = function(){
    repairGoldNow();
    return oldSaveGameForGoldGuard.apply(this, arguments);
  };

  const oldSaveGameQuietForGoldGuard = window.saveGameQuiet;
  window.saveGameQuiet = function(){
    repairGoldNow();
    return oldSaveGameQuietForGoldGuard.apply(this, arguments);
  };

  // Catches the case where `game` is already populated and corrupted by
  // the time this script runs (an in-progress session, not a fresh load).
  repairGoldNow();
})();


(function(){
  // -------------------------------------------------------------------
  // "BEYOND THE HORIZON" VOYAGE TRANSITION + GENERAL VOYAGE LOCK.
  //
  // Part 1: gives the original Inter-World Expeditions system (V162,
  // "Beyond the Horizon" specifically) the same real voyage-screen
  // treatment the Harbour and Tide Network already got — a progress bar
  // instead of an instant resolve. Reuses the existing battle-or-
  // discovery outcome exactly as built; this just adds the trip there.
  //
  // Part 2: a general game.voyageInProgress lock so normal port voyages
  // (doVoyage) can't start while ANY voyage-style transition is already
  // running — Harbour, Tide Network, or this one. All of these share
  // the same #voyageScreen UI, so overlapping them would actually
  // corrupt each other's progress bars/timers, not just be confusing.
  // Cleared the moment any voyage genuinely arrives somewhere (port,
  // harbour, tidenetwork, interworld), via a goScreen wrap, so it's
  // correctly released whether the trip resolved calmly or through
  // combat that had to be fought first.
  // -------------------------------------------------------------------
  const oldDoVoyageForLock = window.doVoyage;
  window.doVoyage = function(portId, days, dangerLevel){
    if (game.voyageInProgress) { toast('⛵ Already underway — finish this crossing first.'); return; }
    game.voyageInProgress = true;
    return oldDoVoyageForLock(portId, days, dangerLevel);
  };

  const oldGoScreenForVoyageLock = window.goScreen;
  window.goScreen = function(name){
    if (['port','harbour','tidenetwork','interworld'].includes(name)) {
      game.voyageInProgress = false;
    }
    return oldGoScreenForVoyageLock(name);
  };

  window.launchInterworldExpedition = function(destId){
    if (!window.interWorldTravelUnlocked()) { toast('🔒 Not yet — the way isn\'t open.'); return; }
    if (game.voyageInProgress) { toast('⛵ Already underway — finish this crossing first.'); return; }
    const dest = window.INTERWORLD_DESTINATIONS.find(d => d.id === destId);
    if (!dest) return;
    if (!window.canAffordInterworldTrip(destId)) { toast('Not enough supplies for the crossing.'); return; }
    game.gold -= (dest.supplyCost.gold||0);
    game.fairTideResources = game.fairTideResources || {};
    Object.entries(dest.supplyCost).forEach(([k,v]) => { if (k !== 'gold') game.fairTideResources[k] = Math.max(0, (game.fairTideResources[k]||0) - v); });

    game.voyageInProgress = true;
    const overlay = document.getElementById('voyageScreen');
    if (!overlay) { resolveInterworldOutcome(dest); return; }
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('voyageScreen').classList.add('active');
    document.getElementById('voyageDest').textContent = 'Toward ' + dest.name;
    document.getElementById('voyageProgress').style.width = '0%';
    document.getElementById('voyageEvent').innerHTML = '<span style="color: var(--success);">Crossing over...</span>';
    const totalDays = 2;
    let currentDay = 0;
    const interval = setInterval(function(){
      currentDay++;
      document.getElementById('voyageProgress').style.width = (currentDay / totalDays * 100) + '%';
      if (currentDay >= totalDays) {
        clearInterval(interval);
        setTimeout(function(){ resolveInterworldOutcome(dest); }, 800);
      }
    }, 900);
  };

  function resolveInterworldOutcome(dest){
    if (Math.random() < 0.5) {
      const enemyBase = dest.enemies[Math.floor(Math.random() * dest.enemies.length)];
      const enemy = (typeof scaleCrimsonEnemy === 'function') ? scaleCrimsonEnemy(enemyBase, 'harbor') : Object.assign({}, enemyBase);
      toast('🌌 Something\'s waiting on the other side.', 2600);
      startCombat({kind:'interworld', key: dest.id, enemy: enemy, portId:null});
    } else {
      const disc = dest.discoveries[Math.floor(Math.random() * dest.discoveries.length)];
      // BUG FIX: this called a bare interworldState() — but that function
      // is a private local defined inside the separate V162 script block,
      // only ever exposed globally as window.interworldDiscoveryState.
      // Calling it by its unexported name threw a ReferenceError here in
      // the V178 block's own closure, and that error fired before the
      // code ever switched away from the sailing/voyage screen — so every
      // "peaceful discovery" outcome (the non-combat ~50% roll) froze the
      // game on "Crossing over..." at 100% forever. Combat outcomes were
      // unaffected since they never reached this line.
      const state = window.interworldDiscoveryState();
      const firstEver = state[disc.name] === undefined;
      state[disc.name] = (state[disc.name]||0) + 1;
      logEvent('🌌 ' + dest.name + ': the crew brings back ' + disc.icon + ' ' + disc.name + '.', 'gold');
      if (firstEver) {
        setTimeout(function(){
          if (typeof showStoryModal === 'function') showStoryModal({title: disc.icon + ' ' + disc.name, blurb: disc.flavor});
        }, 500);
      } else {
        toast('🌌 The crew brings back another ' + disc.icon + ' ' + disc.name + '.', 3600);
      }
      game.voyageInProgress = false;
      if (typeof goScreen === 'function') goScreen('interworld');
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  }
  window.__ctResolveInterworldOutcome = resolveInterworldOutcome;
})();
