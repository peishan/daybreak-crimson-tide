
(function(){
  // -------------------------------------------------------------------
  // ARC X — THE FIRST HORIZON. 24 chapters, continuing the +15-per-arc
  // level pace (Arc VI 90 / VII 105 / VIII 120 / IX 135 / X 150). Gated
  // behind game.arc9Complete, matching every prior arc's pattern.
  //
  // Cover: 'arc10-cover-the-first-horizon.png', title "The First Horizon"
  // — confirmed by San directly, not a guess.
  //
  // Card structure matches the CONFIRMED actual pattern used by Arc VI-IX
  // (quest-item / completed — not story-chapter / complete, which turned
  // out to be a wrong assumption baked into the V134 collapse-completed
  // CSS fix; corrected there too). Also adds a genuine "active" class on
  // the current chapter, which no prior arc's cards actually carried —
  // meaning the V134 auto-scroll-to-current feature had nothing to
  // target for any earlier arc either. Flagging this as worth applying
  // to Arc VI-IX too in a follow-up, rather than expanding scope here.
  // -------------------------------------------------------------------
  const ARC10_CHAPTERS = [
    {id:1, title:'The Voyage Beyond the Charts', focus:"The Expedition system is already part of the crew's routine. But Renn notices something: several recovered materials share the same magical signature. Erynn recognizes it as boundary-related. Mimi senses something not yet visible, connected to all of it.", image:'assets/comics/arc10/ch01-the-voyage-beyond-the-charts.png', xp:220, action:'🔭 Review the Findings'},
    {id:2, title:'What the Expeditions Have Found', focus:"The crew sorts through what's been collected: ordinary resources, rare magical materials, and a handful of objects that might be boundary-related. Renn wants to dive in immediately. San insists they organize and record everything first.", image:'assets/comics/arc10/ch02-what-the-expeditions-have-found.png', xp:220, action:'📋 Organize the Findings'},
    {id:3, title:'The Research Expedition', focus:"Renn, Erynn, and Mimi formally request to go on an expedition together — not separately anymore, together. They know their roles by now. San approves, on one condition: \"You come back with answers. And preferably all in one piece.\"", image:'assets/comics/arc10/ch03-the-research-expedition.png', xp:230, action:'🤝 Approve the Team'},
    {id:4, title:'The Place That Should Not Be There', focus:"The expedition reaches a location on no ordinary map — not another world, just geography that refuses to hold still. Renn wants to measure it. Erynn recognizes an old warning. Mimi feels it noticing them back. They withdraw before it destabilizes further.", image:'assets/comics/arc10/ch04-the-place-that-should-not-be-there.png', xp:240, action:'🗺️ Investigate the Site'},
    {id:5, title:'The Vision of Fire', focus:"Mimi is hit with a powerful vision: a mountain range, a dragon moving through smoke, blood glowing like molten amber, a structure surrounded by unstable light — and something on the other side of it, trying to look through. The vision ends before she understands what the structure is.", image:'assets/comics/arc10/ch05-the-vision-of-fire.png', xp:250, action:'🔥 Witness the Vision'},
    {id:6, title:'The Dragon in the Vision', focus:"Mimi tells Renn and Erynn what she saw. Renn fixates on the glowing blood and the structure. Erynn studies the landscape and the symbols around it. Neither can fully explain it. Mimi is certain of one thing: the dragon didn't feel like an enemy. It felt like it was guarding something.", image:'assets/comics/arc10/ch06-the-dragon-in-the-vision.png', xp:250, action:'🐉 Interpret the Vision'},
    {id:7, title:'Following the Vision', focus:"The crew launches an expedition chasing Mimi's vision and finds real evidence of a dragon: scorched stone, tracks too large to be anything else, molten residue, ancient markings, a damaged shrine. No dragon yet. They have to decide whether to keep following the trail or turn back with what they've already found.", image:'assets/comics/arc10/ch07-following-the-vision.png', xp:260, action:'🐾 Follow the Trail'},
    {id:8, title:'Dragon Blood', focus:"They reach a site where Dragon Blood has been preserved, and it reacts immediately to the boundary residue already in their cargo. \"This is what I saw,\" Mimi says. The blood isn't just powerful — it seems to help unstable magical energy hold its shape and direction. Renn is fascinated. Erynn is cautious. Mimi warns that her vision showed this same material being used to look beyond ordinary space.", image:'assets/comics/arc10/ch08-dragon-blood.png', xp:280, action:'🩸 Recover the Blood'},
    {id:9, title:'What the Dragon Guards', focus:"The dragon wasn't just living here — it was guarding something. An old boundary marker, a sealed chamber, a fragment of some ancient observation structure, a deposit of Dragon Blood, a record from an expedition long before theirs. They don't need to fight it. A shed scale and a preserved deposit are enough.", image:'assets/comics/arc10/ch09-what-the-dragon-guards.png', xp:270, action:'🛡️ Uncover the Truth'},
    {id:10, title:'The Price of the Material', focus:"Dragon Blood destabilizes ordinary containers and reacts badly with some of their other cargo. Renn wants to start experimenting immediately. Erynn insists on proper containment first. Mimi warns that mishandling it might draw the attention of whatever was looking through in her vision. They sail home with only a small amount.", image:'assets/comics/arc10/ch10-the-price-of-the-material.png', xp:250, action:'📦 Secure the Cargo'},
    {id:11, title:'The Material That Answers', focus:"Renn finally tests the Dragon Blood against the boundary residue. The reaction produces a brief, stable image of somewhere far away — only a few seconds, uncontrolled, incomplete. But it's real. It's the first actual proof the Horizon Engine could work.", image:'assets/comics/arc10/ch11-the-material-that-answers.png', xp:280, action:'🔬 Test the Reaction'},
    {id:12, title:'Not Enough', focus:"Dragon Blood alone isn't enough. They still need something to direct the energy, stabilize the image, interpret what's actually being shown, tell a real place apart from a memory or a possibility, and keep the whole thing from ever touching an unstable boundary directly. The project just got a lot bigger than Renn expected.", image:'assets/comics/arc10/ch12-not-enough.png', xp:260, action:'🧩 Assess the Gap'},
    {id:13, title:'The First Construction Plan', focus:"Renn, Erynn, and Mimi go back to the blueprint from Arc VIII and actually divide it this time: Observation. Stabilization. Interpretation. Energy Regulation. Boundary Alignment. Still theoretical — but for the first time, it's a real, workable structure instead of an idea.", image:'assets/comics/arc10/ch13-the-first-construction-plan.png', xp:300, action:'📐 Draft the Blueprint'},
    {id:14, title:'Fair Tide\'s Workshop', focus:"The project has outgrown the Crimson Tide's own hold. Fair Tide offers a room to convert into a dedicated workshop, and the whole community pitches in — construction, storage, tools, reinforcement, material handling, safety procedures. The Horizon Engine stops being Renn's private project and becomes Fair Tide's.", image:'assets/comics/arc10/ch14-fair-tides-workshop.png', xp:320, action:'🏗️ Build the Workshop'},
    {id:15, title:'The First Frame', focus:"The first physical framework goes up — big, unfinished, nowhere near as impressive as the idea in anyone's head. The Dragon Blood stays locked away until the main structure is actually ready. San reminds everyone this can't eat every resource Fair Tide has. It's a long-term project, not a sprint.", image:'assets/comics/arc10/ch15-the-first-frame.png', xp:300, action:'🔨 Raise the Frame'},
    {id:16, title:'The Parts That Disagree', focus:"The first attempt to assemble the components fails badly. The observation crystal rejects the stabilization frame. The boundary marker interferes with the energy regulator. The Dragon Blood starts reacting before anyone's even activated anything. They evacuate the workshop. Nobody's hurt, but the danger is very real now.", image:'assets/comics/arc10/ch16-the-parts-that-disagree.png', xp:300, action:'⚠️ Contain the Failure'},
    {id:17, title:'The Missing Component', focus:"Erynn finds a reference in the Farseer records to a component that might be exactly what they need — used, once, in an ancient boundary-observation structure. It isn't at Fair Tide. It isn't at any port they know. Another expedition, then.", image:'assets/comics/arc10/ch17-the-missing-component.png', xp:280, action:'📜 Search the Records'},
    {id:18, title:'A Choice of Routes', focus:"Three ways to reach it: a safer route with fewer resources, a dangerous route with better odds of actually finding it, or a longer route past other Farseer sites along the way. Whichever they choose changes what the expedition risks and what it might turn up.", image:'assets/comics/arc10/ch18-a-choice-of-routes.png', xp:280, action:'🧭 Choose the Route'},
    {id:19, title:'The Ruin Under the Mountain', focus:"The expedition reaches a ruin tied to Mimi's original vision — and finds proof that someone tried this exact thing before them, using Dragon Blood for boundary observation. It didn't go well. What's left behind is mostly warnings, not instructions. Erynn realizes the Farseers may have only ever had fragments of this knowledge, never the whole picture.", image:'assets/comics/arc10/ch19-the-ruin-under-the-mountain.png', xp:300, action:'⛰️ Explore the Ruin'},
    {id:20, title:'The Missing Piece', focus:"They recover the component, but it's damaged. Renn wants to just fix it himself. Erynn explains its function depends on a very specific boundary alignment — not something you can just weld back together. Mimi reads out what's left of its magical pattern, and between the three of them, they restore enough of it for a real, controlled test.", image:'assets/comics/arc10/ch20-the-missing-piece.png', xp:320, action:'🔧 Restore the Component'},
    {id:21, title:'The Engine\'s Heart', focus:"The Dragon Blood goes into the finished prototype. The Horizon Engine turns on. The workshop fills with light, and for a few seconds, all three of them see the same fragmented image of a distant coastline, clearly, together. It works. Just not for very long.", image:'assets/comics/arc10/ch21-the-engines-heart.png', xp:380, action:'⚡ Activate the Engine'},
    {id:22, title:'The Horizon Moves', focus:"The image starts shifting on its own. The room distorts. Things look very slightly out of place. This isn't observing a boundary anymore — it's touching one. Erynn calls the shutdown. Renn obeys, reluctantly. Mimi says something was looking back through it.", image:'assets/comics/arc10/ch22-the-horizon-moves.png', xp:360, action:'🛑 Shut It Down'},
    {id:23, title:'What We Must Not Force', focus:"Renn wants to keep going — the failure alone told them things they didn't know before. Erynn isn't so sure — the ruin already showed them exactly what happens when observation turns into intrusion. Mimi says the machine has to learn to tell the difference between a place, a memory, a possibility, a living presence, and a boundary that should stay shut. San makes the call: no more activations until there are real safeguards.", image:'assets/comics/arc10/ch23-what-we-must-not-force.png', xp:340, action:'⚖️ Weigh the Risk'},
    {id:24, title:'The First Stable Horizon', focus:"One final, careful, controlled test. This time the image holds — stable, for several minutes, an unknown place beyond any route they've ever sailed. No passage opens. Nobody goes through. Joel asks anyway: \"So... we're not going through?\" San: \"Not today.\" The Engine powers down safely. They haven't reached another world. But now they know how to start looking for one.", image:'assets/comics/arc10/ch24-the-first-stable-horizon.png', xp:600, action:'🌅 Witness the Horizon'}
  ];
  window.ARC10_CHAPTERS = ARC10_CHAPTERS;

  window.arc10ObjectiveState = function(){
    if (!game.arc9Complete) return null;
    if (level() < 150) return null;
    game.comicProgress10 = game.comicProgress10 || {};
    for (const ch of ARC10_CHAPTERS) {
      if (!game.comicProgress10[ch.id]) return 'complete_arc10_chapter_' + ch.id;
    }
    return 'arc10_part1_complete_for_now';
  };

  const ARC10_CHAPTER_SCENES = {
    1: "The Expedition system has become a normal part of the crew's life — San, Joel, Soel, and the research trio, going out, bringing things back.<br><br>But Renn notices something odd this time: several of the materials they've recovered share the exact same magical signature.<br><br>Erynn recognizes the pattern immediately. It's the same kind of thing the Farseers have documented for generations — boundary phenomena.<br><br>Mimi says the materials are connected to something else. Something not yet visible.",
    2: "The crew lays out everything the expeditions have found so far. Three piles: ordinary resources, rare magical materials, and a small, uneasy stack of objects that might be tied to the boundaries somehow.<br><br>Renn wants to start examining all of it immediately.<br><br>San stops him. \"Organize it first. Write down where each one came from.\" It isn't caution for its own sake — it's the beginning of treating this like an actual research project, not just a pile of loot.",
    3: "Renn, Erynn, and Mimi come to San together, formally, asking to go on an expedition as a team — not each contributing separately anymore, but actually together.<br><br>They already know their roles from Arc VIII: Renn handles the engineering and experimentation, Erynn interprets the Farseer knowledge and boundary theory, Mimi reads the patterns neither of the other two can detect on their own.<br><br>San approves it, on one condition.<br><br>\"You come back with answers,\" she says. \"And preferably all in one piece.\"",
    4: "The expedition reaches somewhere that doesn't appear on any ordinary map — not another world, just geography that won't hold still. Several possible routes seem to briefly overlap in the same place.<br><br>Renn wants to measure the phenomenon properly.<br><br>Erynn recognizes an old Farseer warning about places exactly like this.<br><br>Mimi says the location is reacting to them being there.<br><br>They withdraw before the boundary gets any less stable.",
    5: "Back at Fair Tide, Mimi is hit with a vision unlike anything she's had before.<br><br>A vast mountain range. A dragon, moving through smoke and cloud. Blood, glowing like molten amber. A strange structure, wrapped in unstable light. And something — on the other side of that structure — trying to look through.<br><br>The vision ends before she can understand what the structure even is. She isn't sure if she saw the past, the future, or just somewhere that exists right now.",
    6: "Mimi describes the vision to Renn and Erynn in as much detail as she can.<br><br>Renn fixates on the glowing blood and the structure. Erynn studies the landscape and the symbols that appeared around it. Neither of them can fully make sense of it.<br><br>What Mimi is sure of: the dragon didn't feel like a threat. It felt like it was guarding something important.<br><br>The three of them agree — this isn't just a vision. It's pointing somewhere real.",
    7: "The Crimson Tide sets out, chasing Mimi's vision to wherever it actually leads.<br><br>They find real evidence, eventually: scorched stone, tracks too large to belong to anything else, patches of molten residue, markings older than anything in their own records, and what might once have been a shrine or an observation post, long since abandoned.<br><br>No dragon yet. Just the evidence that one was here — and maybe still is.<br><br>They have to decide: keep following the trail, or turn back with what they've already got.",
    8: "They find it — a site where Dragon Blood has actually been preserved, and the moment it's near the boundary residue already in their cargo, the two react to each other immediately.<br><br>\"This is what I saw,\" Mimi says, quietly.<br><br>The Dragon Blood isn't just a powerful fuel source. It seems to help unstable magical energy hold its shape and direction — exactly the kind of thing that could make boundary observation actually possible.<br><br>Renn is fascinated. Erynn is cautious. Mimi has the least comfortable read on it of all three: her vision showed this same material being used to look at something beyond ordinary space. Whatever they build with this, it's not going to be simple.",
    9: "It turns out the dragon wasn't just living in that region. It was guarding something.<br><br>An old boundary marker. A sealed chamber. A fragment of some long-abandoned observation structure. A deposit of Dragon Blood. A record left behind by an expedition that came through long before theirs.<br><br>What the dragon's role actually is stays unclear. What's certain: they don't have to fight it to get what they need. A shed scale, a naturally preserved deposit — that's enough, for now, and it leaves the door open for whatever comes next with dragons, without turning every single one into just another resource node.",
    10: "Dragon Blood does not want to be transported. It destabilizes ordinary containers, and it reacts badly with some of the other materials already in their hold.<br><br>Renn wants to start experimenting with it the moment they're back aboard.<br><br>Erynn insists they need real containment first, not enthusiasm.<br><br>Mimi's warning is the one that actually stops them from rushing: mishandling this might draw the attention of whatever was looking through, in her vision.<br><br>They sail home with only a small, carefully contained amount.",
    11: "Back in the workshop, Renn finally runs the test he's been waiting to run — Dragon Blood against the boundary residue they've been collecting all along.<br><br>The reaction produces an image. Brief. A few seconds, no more. A distant location, glimpsed and gone.<br><br>It's incomplete. It's uncontrolled. But it's real — the first actual proof that this could genuinely become the Horizon Engine, not just a theory about one.",
    12: "The excitement doesn't last long. Dragon Blood alone isn't enough, and now they know exactly why.<br><br>They need something to direct the energy. Something to stabilize the image once it appears. Something to actually interpret what's being shown. Something that can tell a real place apart from a memory, or a mere possibility. And something to make absolutely sure the whole apparatus never touches an unstable boundary directly.<br><br>Renn had pictured this being smaller than it's turning out to be.",
    13: "Renn, Erynn, and Mimi go back to the blueprint they first sketched out in Arc VIII and actually divide it this time, properly: Observation. Stabilization. Interpretation. Energy Regulation. Boundary Alignment.<br><br>It's still entirely theoretical. But for the first time, it isn't just an idea anymore — it's a real, workable structure, with actual pieces that could actually be built.",
    14: "The project has completely outgrown what the Crimson Tide's own hold can support. Fair Tide offers up a room to convert into a dedicated workshop.<br><br>The whole community pitches in — construction, storage, tools, reinforcement, material handling, safety procedures, all of it.<br><br>Somewhere in the middle of all that help, the Horizon Engine stops being Renn's private obsession and becomes something Fair Tide is actually building together.",
    15: "The first physical framework goes up. It's large. It's unfinished. It looks nothing like the grand idea everyone's been picturing in their heads.<br><br>The Dragon Blood stays locked away until the main structure is genuinely ready for it.<br><br>San reminds everyone, gently but firmly, that this project cannot be allowed to consume every resource Fair Tide has. Everyone agrees: this is a long-term project. Not a sprint.",
    16: "The first attempt to actually assemble the components goes badly.<br><br>The observation crystal rejects the stabilization frame outright. The boundary marker starts interfering with the energy regulator. The Dragon Blood begins reacting before anyone's even switched anything on.<br><br>They evacuate the workshop. Nobody is seriously hurt — but the danger here just stopped being theoretical.",
    17: "Erynn finds a reference, buried in the Farseer records, to a component that might solve exactly the problem they've hit — something once used in an ancient boundary-observation structure, generations ago.<br><br>It isn't at Fair Tide. It isn't at any port they already know.<br><br>Which means another expedition.",
    18: "Three ways to reach it, and the crew has to actually pick one: a safer route with fewer resources along the way, a dangerous route with better odds of actually finding the component, or a longer route that passes several other Farseer sites worth exploring on the way.<br><br>Whichever they choose changes exactly what this expedition risks — and what else it might turn up.",
    19: "The expedition reaches a ruin directly tied to Mimi's original vision — and finds something nobody expected: proof that someone else already tried this. Dragon Blood, boundary observation, the exact same idea, generations before them.<br><br>It didn't go well. What's left behind is mostly warnings, not instructions.<br><br>Erynn realizes, with some discomfort, that the Farseers may have only ever inherited fragments of this knowledge — never the whole picture. Maybe nobody ever had the whole picture.",
    20: "They recover the component. It's damaged.<br><br>Renn wants to just repair it outright.<br><br>Erynn explains that its original function depends on a very specific boundary alignment — this isn't the kind of thing you can just weld back into shape.<br><br>Mimi reads out what's left of its magical pattern, piece by piece, and between the three of them — engineering, theory, perception — they manage to restore enough of it for a real, controlled test.",
    21: "The Dragon Blood goes into the completed prototype.<br><br>The Horizon Engine activates.<br><br>The workshop fills with light, and for the first time, all three of them see the exact same fragmented image — a distant coastline, clear, undeniable — at the exact same moment.<br><br>It works.<br><br>Just not for very long.",
    22: "The image starts moving on its own.<br><br>The room distorts, faintly. Objects look very slightly out of place, like the space itself has shifted a fraction of an inch.<br><br>This isn't just observing a boundary anymore. It's touching one.<br><br>Erynn gives the order to shut it down. Renn obeys — reluctantly, but he obeys. Mimi says, quietly, that something was looking back through it.",
    23: "The crew argues over whether the Horizon Engine is safe to keep using at all.<br><br>Renn thinks the failure gave them valuable data, and wants to keep pushing.<br><br>Erynn isn't convinced — the ruin already showed them exactly what happens when observation turns into intrusion.<br><br>Mimi says the machine has to learn to tell a place apart from a memory, a possibility, a living presence, and a boundary that should stay shut — five very different things it currently can't distinguish at all.<br><br>San makes the call: no more activations until there are real safeguards in place.",
    24: "One last, careful, fully controlled test.<br><br>This time, the image holds. Stable. For several minutes — an unknown place, somewhere beyond any route they've ever sailed. No passage opens. Nobody crosses through.<br><br>Joel, standing beside San as the image flickers, asks anyway: \"So... we're not going through?\"<br><br>\"Not today,\" San says.<br><br>The Engine powers down safely. They haven't reached another world.<br><br>But now, for the first time, they actually know how to start looking for one."
  };
  window.ARC10_CHAPTER_SCENES = ARC10_CHAPTER_SCENES;

  window.markArc10ChapterRead = function(id){
    id = Number(id);
    const ch = ARC10_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc10] no chapter data for id', id); return; }
    game.comicProgress10 = game.comicProgress10||{};
    if(game.comicProgress10[id]){ toast('✓ Already marked read.'); return; }
    if(window.arc10ObjectiveState() !== 'complete_arc10_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress10[id] = true;
    if (id === 8) game.dragonBloodDiscovered = true; // Dragon Blood exists as a real, named material now
    if (id === 13) game.horizonEngineBlueprintFinalized = true; // 5-subsystem plan: Observation/Stabilization/Interpretation/Energy Regulation/Boundary Alignment
    if (id === 14) game.horizonEngineWorkshopBuilt = true; // Fair Tide's dedicated workshop exists
    if (id === 21) game.horizonEngineFirstActivation = true; // first (brief) successful activation
    if (id === 23) game.horizonEngineSafeguardsRequired = true; // San's ruling — no more activation without real safeguards
    if (id === 24) {
      game.arc10Complete = true;
      game.horizonEnginePrototype = true; // "Arc 10 unlock: Horizon Engine — Prototype" per the outline's stated outcome
    }
    gainXP(ch.xp);
    game.reputation = (game.reputation||0) + (id === 24 ? 5 : 1);
    logEvent('📖 Arc X Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if (ARC10_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC10_CHAPTER_SCENES[id] });
    }
    if (typeof renderMainGoal === 'function') try { renderMainGoal(); } catch(e) {}
    if (typeof renderStory === 'function') try { renderStory(); } catch(e) {}
  };

  window.__ctShowArc10Splash = function(){
    const overlay = document.getElementById('arc10SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc10Splash = function(){
    const overlay = document.getElementById('arc10SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc10SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc10 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc10) oldRenderStoryForArc10();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc10Ready = window.arc10ObjectiveState() !== null;
    if (arc10Ready && !game.arc10SplashSeen && typeof window.__ctShowArc10Splash === 'function') {
      window.__ctShowArc10Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc10/arc10-cover-the-first-horizon.png" alt="Arc X — The First Horizon" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc X</div><div class="story-act-title">The First Horizon</div>'+
      '<div class="story-act-tagline">Chapters 1-'+ARC10_CHAPTERS.length+' of 24. Some horizons must be built before they can be crossed.</div></div>';
    if (!arc10Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc X Locked</div><div class="story-chapter-sub">'+
        (!game.arc9Complete ? 'Finish Arc IX first.' : 'Reach Level 150 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc10ObjectiveState();
    ARC10_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress10 && game.comicProgress10[ch.id]);
      const ready = !done && so===('complete_arc10_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
        '<button class="btn btn-small btn-success" onclick="markArc10ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc10_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc X chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();


(function(){
  // -------------------------------------------------------------------
  // ARC XI — THE WORLD BEYOND THE WINDOW. Fully wired, all 24 chapters
  // (confirmed against the source doc's own numbering) — grew from an
  // initial partial build (Ch.1-6, then 7-15) as chapters were generated
  // in batches; this pass added the remaining 16-24, including the
  // finale. game.arc11Complete is now set on Ch.24, matching every prior
  // arc's convention, so Arc XII can gate on it.
  //
  // Continues the established +15-per-arc level pace (VI 90 / VII 105 /
  // VIII 120 / IX 135 / X 150 / XI 165). Gated behind game.arc10Complete.
  // -------------------------------------------------------------------
  const ARC11_CHAPTERS = [
    {id:1, title:'The Image That Remained',        focus:"The first stable horizon doesn't fade when the experiment ends. It's the same real place, test after test — and something in the distance is moving.", image:'assets/comics/arc11/ch01-the-image-that-remained.png', xp:220, action:'🔭 Confirm the Sighting'},
    {id:2, title:'Not Veyren',                      focus:"Erynn checks the vision against everything known about Veyren. The shapes are familiar. The magic underneath is not. This isn't a hidden region of their own world.", image:'assets/comics/arc11/ch02-not-veyren.png', xp:220, action:'🗺️ Compare the Records'},
    {id:3, title:'A Window, Not a Door',            focus:"Renn draws the line between seeing and reaching — the Engine can watch, but can't yet send anyone through or guarantee a way back. San sets the rule: nobody crosses until they know how to come home.", image:'assets/comics/arc11/ch03-a-window-not-a-door.png', xp:230, action:'📏 Define the Limits'},
    {id:4, title:'The First Watch',                 focus:"The crew starts standing real shifts over the window — weather, unfamiliar birds, distant lights, a structure that only appears sometimes.", image:'assets/comics/arc11/ch04-the-first-watch.png', xp:220, action:'👁️ Stand the Watch'},
    {id:5, title:'The Smallest Possible Experiment', focus:"Renn sends the smallest, safest pulse of magic he can manage through the window. Nothing happens — until, minutes later, something on the other side visibly moves.", image:'assets/comics/arc11/ch05-the-smallest-possible-experiment.png', xp:240, action:'⚡ Send the Pulse'},
    {id:6, title:'Something Answered',              focus:"The distant lights form a real pattern, repeating at measured intervals. Mimi senses intention behind it — she just can't tell whose.", image:'assets/comics/arc11/ch06-something-answered.png', xp:240, action:'📡 Study the Pattern'},
    {id:7, title:'The Rule of Distance',             focus:"The farther the team tries to focus beyond the original point, the more unstable the image gets. The Horizon Engine isn't showing a whole world — it's locked onto one specific place.", image:'assets/comics/arc11/ch07-the-rule-of-distance.png', xp:240, action:'📐 Test the Range'},
    {id:8, title:'The Object Test',                  focus:"A tiny object passes into the window and vanishes, destabilizing the Engine. When it returns, it's changed — cold, warped, faintly touched by something.", image:'assets/comics/arc11/ch08-the-object-test.png', xp:260, action:'🧪 Send Something Through'},
    {id:9, title:'What Came Back',                   focus:"The object wasn't damaged in any ordinary way — the boundary itself altered it. Erynn warns a living body would fare far worse. San bans further object tests until they understand why.", image:'assets/comics/arc11/ch09-what-came-back.png', xp:260, action:'🔬 Examine What Returned'},
    {id:10, title:'The Cost of Looking',             focus:"Repeated use of the Horizon Engine starts affecting Fair Tide itself — flickering lights, shifting temperatures, sounds from nowhere. The Engine is drawing more power than anyone accounted for.", image:'assets/comics/arc11/ch10-the-cost-of-looking.png', xp:270, action:'⚠️ Investigate the Disturbances'},
    {id:11, title:'A Shape in the Distance',         focus:"During a routine watch, Mimi spots a figure near the distant structure, looking straight back at the window. The image clears for only a few seconds — not long enough to tell if it's even human.", image:'assets/comics/arc11/ch11-a-shape-in-the-distance.png', xp:270, action:'👁️ Watch the Figure'},
    {id:12, title:'The Question of Contact',         focus:"The crew argues over whether to attempt contact at all, and how. San settles it: if someone's looking back, they should be given a reason not to fear the Crimson Tide.", image:'assets/comics/arc11/ch12-the-question-of-contact.png', xp:280, action:'🕊️ Debate First Contact'},
    {id:13, title:"Mimi's Unclear Answer",           focus:"Mimi tries a focused divination on the distant world and gets fragments that don't add up cleanly — a shoreline, a closed gate, someone waiting, a feeling of caution.", image:'assets/comics/arc11/ch13-mimis-unclear-answer.png', xp:280, action:'🔮 Attempt the Divination'},
    {id:14, title:'The Signal',                      focus:"The crew sends three pulses of light, then waits. After a long silence, the other side answers with the same pattern — and adds a fourth pulse of its own.", image:'assets/comics/arc11/ch14-the-signal.png', xp:300, action:'💡 Send the Signal'},
    {id:15, title:'The Fourth Light',                focus:"Every time the crew repeats the signal, the same fourth pulse comes back. Mimi doesn't read it as a greeting. More like a warning, or an instruction nobody can translate yet.", image:'assets/comics/arc11/ch15-the-fourth-light.png', xp:300, action:'🕯️ Repeat the Signal'},
    {id:16, title:'The Door That Opened',             focus:"The distant structure activates on its own. For a moment the Engine reveals a chamber beyond the doorway, marked with boundary diagrams that aren't Farseer symbols — then the image collapses before anyone can study it.", image:'assets/comics/arc11/ch16-the-door-that-opened.png', xp:320, action:'🚪 Watch the Door'},
    {id:17, title:'A Return Route',                  focus:"Renn, Erynn, and Mimi start designing a return-anchor system — a stable point in Veyren, a matching anchor at the destination, a continuous power supply, a way to recognize the original route. Miss any of the four, and a traveller has no way home.", image:'assets/comics/arc11/ch17-a-return-route.png', xp:300, action:'📐 Design the Anchor'},
    {id:18, title:'The Anchor Problem',               focus:"There's no way to build a reliable destination anchor from Veyren alone. Something has to be placed or activated on the other side first — which may mean sending an object through before any person can follow.", image:'assets/comics/arc11/ch18-the-anchor-problem.png', xp:300, action:'🧩 Face the Problem'},
    {id:19, title:'A Message in Matter',              focus:"A simple symbol gets embedded into a small metal plate and sent through the window. Unlike the earlier test object, it doesn't come straight back — and the Horizon Engine stays stable the whole time it's gone.", image:'assets/comics/arc11/ch19-a-message-in-matter.png', xp:320, action:'🔩 Send the Plate'},
    {id:20, title:'The Empty Return',                 focus:"The plate eventually comes back — the original symbol intact, but a second mark now beside it that neither Renn nor Erynn recognizes. Mimi reads one clear feeling underneath it: wait.", image:'assets/comics/arc11/ch20-the-empty-return.png', xp:340, action:'🔍 Read the Symbol'},
    {id:21, title:'The First Crossing Plan',          focus:"The Horizon Team drafts a formal plan for a controlled crossing — a small team, limited supplies, a fixed time window, a destination anchor, and a guaranteed emergency return. San insists the mission stay exploratory, not acquisitive.", image:'assets/comics/arc11/ch21-the-first-crossing-plan.png', xp:350, action:'📋 Draft the Plan'},
    {id:22, title:'Who Goes First',                   focus:"Renn, Erynn, and Mimi are locked in as the research team. Everything else — combat ability, medical support, navigation, who can stay calm somewhere with no map at all — is San and Joel's call to make.", image:'assets/comics/arc11/ch22-who-goes-first.png', xp:350, action:'🧭 Choose the Team'},
    {id:23, title:'The Window Closes',                focus:"The Horizon Engine starts losing stability. The fourth light appears one last time, followed by a brief image of the destination anchor location — then the window closes on its own, and nobody can say why.", image:'assets/comics/arc11/ch23-the-window-closes.png', xp:380, action:'🌑 Watch It Fade'},
    {id:24, title:'The World Beyond the Window',      focus:"The crew shuts the Engine down and takes stock of what they're leaving with: proof of another world, evidence of deliberate contact, a working method for sending small objects, an unreadable symbol, and a real plan for crossing. \"We know where the road begins,\" San says. \"Then we find out how to come home,\" Joel answers.", image:'assets/comics/arc11/ch24-the-world-beyond-the-window.png', xp:600, action:"🌅 Look Toward What's Next"}
  ];
  window.ARC11_CHAPTERS = ARC11_CHAPTERS;

  window.arc11ObjectiveState = function(){
    if (!game.arc10Complete) return null;
    // Continues the +15-per-arc pace from Arc VIII (120) / IX (135) / X (150).
    if (level() < 165) return null;
    game.comicProgress11 = game.comicProgress11 || {};
    for (const ch of ARC11_CHAPTERS) {
      if (!game.comicProgress11[ch.id]) return 'complete_arc11_chapter_' + ch.id;
    }
    return 'arc11_part1_complete_for_now';
  };

  // Scene text is a condensed adaptation of the outline provided, not a
  // verbatim transcript — the outline's own scaffolding ("Purpose: ...")
  // is folded into the narrative rather than left as a visible label.
  const ARC11_CHAPTER_SCENES = {
    1: "The first stable horizon the Engine ever produced doesn't fade when the experiment ends.<br><br>It holds. Test after test, the same landscape appears — not identical, exactly: the light shifts, the weather changes on its own, the way real weather does.<br><br>Somewhere in the distance, something moves.<br><br>Mimi is the one who says out loud what everyone's starting to suspect. This doesn't feel like one of her usual visions. It feels like watching something that's actually there.",
    2: "The research team lays what they've observed against everything Veyren's own records say about the world.<br><br>The shapes are familiar enough — sky, water, land, something that could pass for a horizon back home. But the magic underneath doesn't behave the way Veyren's does. Nothing about it matches.<br><br>Erynn is the one who says it plainly, because someone has to.<br><br>\"It is somewhere else.\"",
    3: "Renn lays out, as carefully as he can, exactly what the Horizon Engine is actually capable of right now.<br><br>It can see. It can hold an image steady. It might even be able to pick up movement, or magical activity, somewhere on the other side.<br><br>What it can't do yet: move a single person through, carry a message across, or promise anyone a way back if they tried.<br><br>San doesn't need long to make the rule official. Nobody crosses until they know how to come home again.",
    4: "The crew starts standing proper watches over the window, same as any other duty roster.<br><br>Everyone notices something different. Shifting weather. Birds nobody recognizes. Distant lights that come and go. Tides that don't move the way tides should. A structure that only seems to appear at certain times, then isn't there at all.<br><br>Joel treats it exactly like lookout duty, because to him, that's precisely what it is.<br><br>Soel just sits by the Engine for long stretches, watching the image without blinking, the way only a cat can.",
    5: "Renn wants to know something specific: can the Horizon Engine actually reach the other side, even a little, without opening a real passage?<br><br>They send through the smallest, safest pulse of magical energy they can manage.<br><br>Nothing happens.<br><br>Then, several long minutes later, a cluster of distant lights shifts position — just slightly, just enough that nobody in the room can convince themselves they imagined it.<br><br>Whatever's on the other side of that window, it noticed.",
    6: "The lights aren't random after all — they form an actual pattern.<br><br>Renn's first instinct is to write it off as some natural phenomenon. Erynn isn't so sure; he notices the pattern repeats at measured, deliberate intervals — nothing about that reads as natural to him.<br><br>Mimi is the one who says what the other two are dancing around. She can feel intention behind it. She just can't tell yet whether it's coming from a person, a creature, or something built.",
    7: "Renn wants to know exactly how far the Horizon Engine can actually reach, so the team starts testing.<br><br>The results are consistent: the farther they try to focus beyond the original point of contact, the more unstable the image gets — flickering, warping, threatening to collapse entirely.<br><br>The conclusion is unavoidable. The Horizon Engine was never showing them an entire world. It's locked onto one specific place, and only that place. Wherever they go next, they'll need their own anchor to get there.",
    8: "Renn wants to try something more direct: pass a small, harmless, non-living object straight through the boundary.<br><br>It works, in the sense that the object actually vanishes into the window. It also immediately destabilizes the whole Engine — lights flickering, the image straining to hold itself together.<br><br>When the object finally comes back, it isn't quite the same. It's cold to the touch. Its shape has warped, just slightly. And it carries a faint trace of magical residue that wasn't there before.<br><br>Matter can cross. That much is proven. Whether it's safe to is a very different question.",
    9: "The team studies the returned object carefully, and the damage doesn't look like anything ordinary.<br><br>Its structure has been altered by the boundary itself — not broken, exactly, just changed by whatever it passed through.<br><br>Erynn doesn't hedge about what that means. If a small object comes back like this, a living body could react far worse.<br><br>San doesn't need to be told twice. No more object tests, not until they actually understand what the boundary does to the things that cross it.",
    10: "It isn't just the Horizon Engine that's changing. Fair Tide itself is starting to feel it.<br><br>The workshop swings through sudden temperature changes for no reason anyone can explain. Lights flicker on their own. Sounds seem to come from the wrong direction, or from nowhere at all. More than once, something sits very slightly out of place from where anyone remembers leaving it.<br><br>The Engine is drawing more energy than anyone accounted for. Looking through the window, it turns out, was never going to be free.",
    11: "It happens during an ordinary watch — the kind that's mostly just staring at a landscape that never changes.<br><br>Then Mimi sees it: a shape near the distant structure, and it's facing the window. Facing them.<br><br>The image sharpens, just for a few seconds — long enough to know something's there, not long enough to know what. Nobody on watch can say for certain whether it's even humanoid. But whatever it is, it wasn't just standing there. It was looking back.",
    12: "The debate that follows takes longer than anyone expects. Light signals. Sound. A pulse of magic. Written symbols. Or just waiting, and letting the other side make the first move.<br><br>San is the one who cuts through all of it, and settles what actually matters before any method gets chosen.<br><br>\"If someone is looking back, we should give them a reason not to fear us.\"<br><br>That becomes the rule everything else has to fit inside.",
    13: "Mimi tries a controlled divination, focused as tightly on the distant world as she can manage.<br><br>What comes back doesn't resolve into one clear picture. A shoreline. A closed gate. Someone waiting. A feeling of caution that colors all of it.<br><br>She can't tell the crew whether any of this is happening right now, might happen, or is just a warning dressed up as an image. It's the most honest answer she has — and it isn't a comfortable one.",
    14: "The crew settles on something simple: three pulses of light, then a pause, then nothing.<br><br>The silence afterward stretches long enough that people start to give up on it.<br><br>Then the distant world answers. Three pulses. The same pattern, sent back.<br><br>And then a fourth.<br><br>Renn wants to believe that's deliberate — an actual reply, not an echo. Erynn isn't ready to agree with him yet.",
    15: "The fourth pulse isn't a one-time thing. Every time the crew repeats the original signal, the same extra light comes back with it, exactly where it was before.<br><br>Mimi doesn't think it reads like a greeting. Something about it feels heavier than that — closer to a warning, or an instruction, except nobody aboard has any way to actually translate it yet.",
    16: "For the first time, the distant structure does something on its own.<br><br>For just a moment, the Horizon Engine pushes past the doorway itself and shows the team a chamber beyond it — walls marked with diagrams that look unmistakably like boundary theory, laid out in symbols none of them, not even Erynn, has ever seen in a single Farseer record.<br><br>The image collapses before anyone can study it properly.<br><br>But the implication doesn't collapse with it: whoever built that structure may understand boundaries just as well as the Farseers ever did.",
    17: "The three of them sit down to solve a problem none of their research has actually touched yet: how does anyone get back?<br><br>A return-anchor system, they decide, needs four things working together — a stable point here in Veyren, a matching anchor wherever someone ends up, a power supply that doesn't quit partway through, and some reliable way to recognize the original route rather than guessing at it.<br><br>Miss any one of those, and a traveller could step through just fine and have absolutely no way home.",
    18: "The plan runs into its first real wall almost immediately: there's no way to build a reliable anchor at the destination from here. Not with anything they have in Veyren.<br><br>Something has to be placed, or activated, on the other side itself.<br><br>Which means, before any person ever crosses that boundary, something else is probably going to have to go first.",
    19: "They go back to the returned test object for a new idea — not sending something blind this time, but sending something with intent.<br><br>Renn embeds a simple symbol into a small metal plate and pushes it through the window.<br><br>This time, it doesn't bounce straight back.<br><br>The Horizon Engine holds steady the entire time it's gone — the first sign that maybe, carefully, something can actually be left on the other side and survive there.",
    20: "Eventually, the plate comes back through.<br><br>The original symbol is still there, untouched. But it isn't alone anymore — a second mark sits right beside it, and neither Renn nor Erynn can place it in anything they know.<br><br>Mimi doesn't need to identify the symbol to read what's underneath it. One feeling, clear and simple.<br><br>Wait.<br><br>Somebody, or something, answered on purpose.",
    21: "For the first time, \"crossing over\" stops being a hypothetical and becomes an actual plan on paper.<br><br>A small team. Limited supplies. A fixed window of time. A destination anchor that actually exists by the time anyone steps through. A guaranteed way back, no exceptions.<br><br>San is firm about one more thing before she'll sign off on any of it: whoever goes through is there to learn, not to take. Exploratory, not acquisitive. That's the whole mission, and nothing else gets added to it.",
    22: "The research seats are already spoken for — Renn, Erynn, and Mimi were never really a question.<br><br>Everything else is harder. Combat ability, in case it's needed. Medical support, in case someone's hurt somewhere with no way to call for help. Navigation. Communication. Magical expertise beyond what the three researchers already bring. And the harder thing to measure — who can actually stay calm somewhere with no map, no history, no idea what's normal.<br><br>San and Joel are the ones who have to make that call, and neither of them takes it lightly.",
    23: "Without warning, the Engine starts slipping.<br><br>The distant world grows harder to make out by the minute, the image thinning at the edges the way it did right before the very first shutdown.<br><br>The fourth light appears one more time.<br><br>This time it's followed by something new — a brief, clear image of exactly where the destination anchor needs to go.<br><br>Then the window closes.<br><br>Nobody can say for certain whether the Engine failed on its own, or whether whatever's on the other side chose to end the connection itself.",
    24: "The workshop goes quiet once the Engine is fully shut down.<br><br>The first crossing isn't happening today — the Engine needs repairs, more materials, and a destination anchor that doesn't exist yet. That part hasn't changed.<br><br>What has changed is everything they're leaving this arc with: proof that another world is real, evidence that someone over there is responding on purpose, a working method for sending something small and simple across, one unexplained symbol nobody can read yet, and an actual plan for how the first crossing might go.<br><br>San looks at the inactive Engine for a long moment.<br><br>\"We know where the road begins.\"<br><br>Joel steps up beside her.<br><br>\"Then we find out how to come home.\""
  };

  window.markArc11ChapterRead = function(id){
    id = Number(id);
    const ch = ARC11_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc11] no chapter data for id', id); return; }
    game.comicProgress11 = game.comicProgress11||{};
    if(game.comicProgress11[id]){ toast('✓ Already marked read.'); return; }
    if(window.arc11ObjectiveState() !== 'complete_arc11_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress11[id] = true;
    if (id === 3) game.sansReturnRuleRestated = true; // "nobody crosses until they know how to come back"
    if (id === 16) game.otherCivilizationSuspected = true; // boundary diagrams that aren't Farseer symbols
    if (id === 18) game.destinationAnchorRequired = true; // can't build the anchor from Veyren's side alone
    if (id === 19) game.firstOneWayTransferSuccess = true; // the metal plate — first thing sent through that didn't just bounce back
    if (id === 20) game.otherSideRespondedDeliberately = true; // the second symbol, and Mimi's "wait"
    gainXP(ch.xp);
    game.reputation = (game.reputation||0) + (id === 24 ? 5 : 1);
    if (id === 24) game.arc11Complete = true; // "Arc 11 unlock" — ready for Arc 12: The First Crossing
    logEvent('📖 Arc XI Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if (ARC11_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC11_CHAPTER_SCENES[id] });
    }
    if (typeof renderMainGoal === 'function') try { renderMainGoal(); } catch(e) {}
    if (typeof renderStory === 'function') try { renderStory(); } catch(e) {}
  };

  window.__ctShowArc11Splash = function(){
    const overlay = document.getElementById('arc11SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc11Splash = function(){
    const overlay = document.getElementById('arc11SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc11SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc11 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc11) oldRenderStoryForArc11();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc11Ready = window.arc11ObjectiveState() !== null;
    if (arc11Ready && !game.arc11SplashSeen && typeof window.__ctShowArc11Splash === 'function') {
      window.__ctShowArc11Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc11/arc11-cover-the-world-beyond-the-window.png" alt="Arc XI — The World Beyond the Window" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XI</div><div class="story-act-title">The World Beyond the Window</div>'+
      '<div class="story-act-tagline">Chapters 1-'+ARC11_CHAPTERS.length+' of 24. Seeing another world is not the same as reaching it.</div></div>';
    if (!arc11Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XI Locked</div><div class="story-chapter-sub">'+
        (!game.arc10Complete ? 'Finish Arc X first.' : 'Reach Level 165 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc11ObjectiveState();
    ARC11_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress11 && game.comicProgress11[ch.id]);
      const ready = !done && so===('complete_arc11_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
        '<button class="btn btn-small btn-success" onclick="markArc11ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc11_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ Arc XI complete — all 24 chapters read. Preparing for Arc XII: The First Crossing.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();


(function(){
  // -------------------------------------------------------------------
  // ARC XII — THE FIRST CROSSING. Fully wired, all 24 chapters — built
  // in 5 batches (1-5, 6-10, 11-15, 16-20, 21-24) as the outline was
  // provided. game.arc12Complete is now set on Ch.24, matching every
  // prior arc's convention, so Arc XIII can gate on it.
  //
  // Gated behind game.arc11Complete (set on Arc XI's own Ch.24) + level
  // 180, continuing the established +15-per-arc pace (IX 135 / X 150 /
  // XI 165 / XII 180).
  // -------------------------------------------------------------------
  const ARC12_CHAPTERS = [
    {id:1, title:'Beyond the Horizon',         focus:"The Horizon Engine is finally ready for a controlled crossing. The question isn't whether they can see another world anymore — it's whether they can go there. Nobody is forced to cross.", image:'assets/comics/arc12/ch01-beyond-the-horizon.png', xp:280, action:'🚪 Gather at the Engine'},
    {id:2, title:'The First Crossing Protocol', focus:"Renn, Erynn, and Mimi lay out the first real rules for a crossing — navigation, observation, medical, supplies, boundary monitoring, return coordination. San adds the one that matters most.", image:'assets/comics/arc12/ch02-the-first-crossing-protocol.png', xp:280, action:'📋 Assign the Roles'},
    {id:3, title:'What We Take With Us',       focus:"A deliberately limited kit — food, water, medical supplies, navigation gear, sample containers, nothing extra. Joel checks it twice. San realizes they're finally treating this like an expedition, not a treasure hunt.", image:'assets/comics/arc12/ch03-what-we-take-with-us.png', xp:260, action:'🎒 Pack the Expedition'},
    {id:4, title:'The Door Opens',              focus:"For the first time, the image isn't just a projection — the space itself opens. A real coastline. Wind coming through. A sea the wrong color. Nobody says a word.", image:'assets/comics/arc12/ch04-the-door-opens.png', xp:300, action:'🌅 Activate the Engine'},
    {id:5, title:'One Step',                    focus:"San steps through first. Joel right behind her. For a few long seconds, nothing happens — then San looks back and finds Veyren still visible behind them. They're really here.", image:'assets/comics/arc12/ch05-one-step.png', xp:320, action:'👣 Cross the Threshold'},
    {id:6, title:'A Different Sea',             focus:"The sea doesn't behave like Veyren's — waves move wrong, the compass won't settle, instruments give conflicting readings. Renn is fascinated. Joel is not.", image:'assets/comics/arc12/ch06-a-different-sea.png', xp:280, action:'🌊 Study the Water'},
    {id:7, title:'The Empty Settlement',        focus:"They reach an abandoned coastal settlement — homes, a harbour, old fishing gear, a small marketplace. Not destroyed, just left behind. No people. No immediate threat either.", image:'assets/comics/arc12/ch07-the-empty-settlement.png', xp:290, action:'🏘️ Enter the Settlement'},
    {id:8, title:'Someone Lived Here',          focus:"Cooking tools, children's toys, fishing gear, old records, a sign in a language nobody recognizes. The world stops feeling like a dungeon and starts feeling like somebody's home.", image:'assets/comics/arc12/ch08-someone-lived-here.png', xp:290, action:'🔍 Search the Homes'},
    {id:9, title:'The First Language Problem',  focus:"The local writing won't resolve into anything readable — even symbols that look familiar don't mean what they seem to. A familiar shape doesn't mean a familiar meaning.", image:'assets/comics/arc12/ch09-the-first-language-problem.png', xp:310, action:'📜 Study the Writing'},
    {id:10, title:'Water',                      focus:"The local water looks clean, tastes clean — but its magical composition is wrong. They leave it alone and use their own supplies. A small issue. Not the last one.", image:'assets/comics/arc12/ch10-water.png', xp:280, action:'💧 Test the Water'},
    {id:11, title:'The Food Problem',           focus:"Some plants are safe, some aren't, and some that look identical to Veyren's react completely differently to magic. New rule: nothing from this world touches the food supply until it's tested.", image:'assets/comics/arc12/ch11-the-food-problem.png', xp:300, action:'🍽️ Test the Local Plants'},
    {id:12, title:'Time Moves Differently',      focus:"Their clocks stop agreeing with each other. It isn't the equipment — it's the world itself. The variation is small, but they've been away longer than they thought.", image:'assets/comics/arc12/ch12-time-moves-differently.png', xp:300, action:'⏱️ Check the Clocks'},
    {id:13, title:"The Tide Doesn't Match",      focus:"The tide starts moving wrong — not backwards, just differently. Joel catches it first, from the harbour. Their arrival point is slowly becoming unsafe.", image:'assets/comics/arc12/ch13-the-tide-doesnt-match.png', xp:310, action:'🌊 Watch the Harbour'},
    {id:14, title:'The Boundary Is Moving',      focus:"Erynn realizes the crossing point isn't fixed. The Horizon Engine can open the doorway again — just maybe not in the same place. That changes everything.", image:'assets/comics/arc12/ch14-the-boundary-is-moving.png', xp:320, action:'📡 Recheck the Crossing Point'},
    {id:15, title:"San's Rule",                  focus:"The crew wants to push further out. San says no. They don't know how to get home yet, so they stay inside the safe zone. Exploration can wait.", image:'assets/comics/arc12/ch15-sans-rule.png', xp:300, action:'🛑 Hold the Line'},
    {id:16, title:'The Thing Beneath the Harbour', focus:"Renn finds something built beneath the old harbour — not a weapon, not a machine, something built to measure the sea itself. Erynn suspects the people who lived here understood inter-world phenomena long before the crew did.", image:'assets/comics/arc12/ch16-the-thing-beneath-the-harbour.png', xp:320, action:'🔎 Uncover the Structure'},
    {id:17, title:'Return Coordinates',          focus:"The crew tries to establish a return point, but the original crossing location has shifted and the Engine's readings won't line up. For the first time, the expedition feels genuinely stranded.", image:'assets/comics/arc12/ch17-return-coordinates.png', xp:340, action:'📍 Attempt the Return'},
    {id:18, title:"Don't Panic",                  focus:"Joel keeps everyone focused while San checks that the whole crew is accounted for and unhurt. They have food, water, and time. Uncomfortable — not hopeless.", image:'assets/comics/arc12/ch18-dont-panic.png', xp:300, action:'🧭 Steady the Crew'},
    {id:19, title:'The Harbour Marker',          focus:"The structure beneath the harbour matches their Horizon readings exactly. It wasn't built to open worlds — it was built to find the boundary itself. Erynn finally understands what she's looking at.", image:'assets/comics/arc12/ch19-the-harbour-marker.png', xp:330, action:'🗿 Study the Marker'},
    {id:20, title:'The Path Back',               focus:"Using the harbour marker's information, Erynn and Renn recalibrate the Horizon Engine. Mimi recognizes a pattern from her own earlier visions. The return point stabilizes.", image:'assets/comics/arc12/ch20-the-path-back.png', xp:350, action:'🧮 Recalibrate the Engine'},
    {id:21, title:'One World to Another',        focus:"The doorway opens again — but this time it shows Fair Tide, not just Veyren. Home. San waits until everyone else has crossed first; she and Joel go through last.", image:'assets/comics/arc12/ch21-one-world-to-another.png', xp:340, action:'🚪 Cross Back Home'},
    {id:22, title:'Back in Veyren',              focus:"Only a few hours passed back home, though the expedition felt far longer. The crew unloads what they collected. Nobody celebrates yet — everyone's still processing what just happened.", image:'assets/comics/arc12/ch22-back-in-veyren.png', xp:320, action:'📦 Unload the Samples'},
    {id:23, title:'The First Report',            focus:"Renn, Erynn, and Mimi document everything and draft the first real Inter-World Expedition Protocol — supplies, testing, translation, timekeeping, return markers, boundary monitoring, emergency extraction. The Horizon Engine just became a real travel system.", image:'assets/comics/arc12/ch23-the-first-report.png', xp:340, action:'📋 Write the Protocol'},
    {id:24, title:'The First Crossing',          focus:"San and Joel stand together at the harbour. They crossed into another world — and, just as importantly, learned how to come home.", image:'assets/comics/arc12/ch24-the-first-crossing.png', xp:420, action:'🌅 Look to the Horizon'}
  ];
  window.ARC12_CHAPTERS = ARC12_CHAPTERS;

  window.arc12ObjectiveState = function(){
    if (!game.arc11Complete) return null;
    // Continues the +15-per-arc pace from Arc IX (135) / X (150) / XI (165).
    if (level() < 180) return null;
    game.comicProgress12 = game.comicProgress12 || {};
    for (const ch of ARC12_CHAPTERS) {
      if (!game.comicProgress12[ch.id]) return 'complete_arc12_chapter_' + ch.id;
    }
    return 'arc12_part1_complete_for_now';
  };

  const ARC12_CHAPTER_SCENES = {
    1: "The Horizon Engine is finally ready — not just to show them somewhere else, but to actually open onto it.<br><br>The crew gathers around it in a way that feels different this time. Nobody's asking whether they can see another world anymore. That question got answered chapters ago.<br><br>The question now is simpler, and heavier: can they go there?<br><br>San makes sure everyone understands one thing before anything else happens. Nobody is being made to cross. Whoever goes, goes because they chose to.",
    2: "Renn, Erynn, and Mimi spend the better part of a day hammering out the actual rules for a crossing — real roles, not improvisation. Navigation. Observation. Medical. Supplies. Someone watching the boundary itself. Someone responsible for getting everyone back.<br><br>San adds the rule that ends up mattering more than any of the others.<br><br>\"We go together. We come back together.\"",
    3: "What they pack says as much as anything they've said out loud. Food. Water. Medical supplies. Navigation equipment. Sample containers. Communication gear. Nothing that isn't earning its place.<br><br>Joel goes through the whole kit twice, the way he checks the ship before any voyage that actually matters.<br><br>Watching him do it, San realizes what's different about this. They're not preparing like people hunting treasure. They're preparing like an expedition.",
    4: "The Horizon Engine activates, and for the first time, nothing about it is just an image anymore.<br><br>The space in front of them actually opens. A real coastline waits on the other side. Wind comes through the opening, carrying a smell that isn't Veyren's. The sea beyond it is a color none of them have a name for.<br><br>Nobody says anything for a long moment. There isn't really anything to say yet.",
    5: "San steps through first. Joel is right behind her, close enough that there's no real gap between them at all. The rest of the expedition follows in careful order.<br><br>For a few seconds, nothing happens. No one speaks. No one's entirely sure what they're supposed to feel.<br><br>Then San looks back — and Veyren is still there, visible through the opening behind them, exactly where they left it.<br><br>\"We're really here.\"",
    6: "The sea on the other side doesn't move the way Veyren's does. The waves come in at the wrong rhythm, rising and falling in patterns nobody aboard has ever charted.<br><br>Their instruments can't agree with each other. The compass won't settle on anything.<br><br>Renn is delighted by all of it — pulls out every measuring tool he owns within the first hour. Joel watches the water a while longer before saying anything, and when he does, it isn't excitement in his voice.",
    7: "They find the settlement not long after making landfall — a small coastal town, homes still standing, a harbour still intact, old fishing equipment left where it was last used. A modest marketplace, stalls still up.<br><br>It isn't destroyed. It's just empty, in a way that feels deliberate rather than sudden.<br><br>No people. No sign of danger either. Just quiet.",
    8: "The crew moves through the settlement carefully, and what they find is almost disappointingly ordinary. Cooking utensils, still set where someone left them. A child's toy, half-buried in dust. Fishing tools. Old records nobody can read yet.<br><br>Then a sign, faded, lettered in something none of them recognize.<br><br>Somewhere in the middle of cataloguing all of it, the place stops feeling like a ruin to explore and starts feeling like somewhere people actually lived.",
    9: "The writing everywhere in the settlement refuses to resolve into anything readable. Some of the symbols even look familiar — close enough to something from home that it's tempting to guess at meaning.<br><br>Mimi tries anyway, reading for context where she can't read for language.<br><br>Erynn is the one who stops everyone from getting too confident about it. A shape that looks familiar doesn't mean it means the same thing. That becomes the expedition's first real rule about this place, and it won't be the last time it matters.",
    10: "The local water looks clean. It tastes clean, when Erynn tests it carefully enough to be sure it's safe to even sample that much.<br><br>But its magical composition isn't right — different enough from anything back home that she won't sign off on it.<br><br>So they don't drink it. They stick to their own supplies instead, and make a note of it.<br><br>It feels like a small thing to work around. It won't be the last small thing that turns out to matter.",
    11: "Not every plant on this shore is safe, and some of the most dangerous ones don't even look dangerous — a few pass for something familiar from Veyren right up until they touch actual magic, and react nothing like they should.<br><br>Nobody needs to be convinced twice. The crew sets the rule on the spot: nothing from this world enters the food supply until someone's actually tested it.<br><br>It's an easy rule to agree to. It's a harder one to remember to keep, the longer they stay.",
    12: "Somewhere along the way, the clocks stop agreeing with each other.<br><br>The first guess is equipment failure — something jostled loose in the crossing, maybe. But the numbers don't add up to a malfunction. They add up to something else.<br><br>Time here isn't wildly different. It's just different enough to matter. By the time anyone does the math properly, they realize they've already been away longer than they meant to be.",
    13: "Joel is the one who notices, because he's the one actually watching the harbour the way he'd watch any harbour that mattered.<br><br>The tide isn't running backwards. It's just running wrong — a rhythm that doesn't match anything they clocked when they first arrived.<br><br>It takes a moment for the rest of the crew to understand what he's actually telling them. Their arrival point isn't as stable as they assumed. It's quietly becoming unsafe.",
    14: "Erynn is the one who finds the real problem, buried under everything else they've been tracking.<br><br>The crossing point itself isn't fixed. The Horizon Engine can open the doorway back to Veyren again — but there's no guarantee it opens in exactly the same place twice.<br><br>That single fact reframes everything about how careful they actually need to be.",
    15: "The debate over whether to push further inland doesn't last long, not once San actually weighs in.<br><br>She says no, flatly, and doesn't dress it up as anything other than what it is.<br><br>\"We don't know how to come home yet.\"<br><br>So they hold where they are. Whatever else this world has to show them, it can wait until they've actually solved the problem that matters more.",
    16: "Renn's the one who finds it, half-buried under what's left of the old harbour — a structure that doesn't look like anything the crew has categories for yet.<br><br>It isn't a weapon. It isn't a machine, not in any sense they recognize. Whatever it was built to do, it was built to do something to the sea itself — or with it.<br><br>Erynn crouches beside it a long time before she says what she's thinking. Whoever lived here might have understood inter-world phenomena long before the Crimson Tide ever built an Engine of their own.",
    17: "Establishing a return point should be routine by now. It isn't.<br><br>The crossing location they arrived through has shifted, just enough that the Horizon Engine's readings won't line up the way they're supposed to.<br><br>Nobody says the word out loud right away, but everyone's thinking it at the same time. For the first time since they stepped through, this expedition feels genuinely stranded.",
    18: "Joel doesn't let the moment spiral. He starts giving people something to actually do, the same way he'd steady a crew mid-storm.<br><br>San does her own version of the same thing — a full headcount, checking that everyone's accounted for and unhurt.<br><br>They have food. They have water. They have time. It isn't comfortable, not even close. But it isn't hopeless either, and that distinction is the only thing keeping the crew from panicking outright.",
    19: "It's Erynn who puts it together. The strange structure beneath the harbour lines up, almost exactly, with their own Horizon readings.<br><br>It was never meant to open a way between worlds. It was built to find where the boundary actually sits.<br><br>\"They had a way to know where the boundary was.\"<br><br>Whoever built it understood something the crew is only now starting to learn.",
    20: "Erynn and Renn work through the night, using everything the harbour structure recorded to recalibrate the Horizon Engine from scratch.<br><br>Partway through, Mimi stops them — she recognizes a shape in the data, something that matches a pattern from one of her own earlier visions, back before any of this started.<br><br>It's enough. The return point steadies, and holds.",
    21: "The doorway opens one more time, and for a moment nobody moves, because what's on the other side isn't quite what they expected.<br><br>It isn't just Veyren this time. It's Fair Tide itself, visible straight through the opening. Home, not just the way back to it.<br><br>San holds her place at the threshold and waits, making sure every single member of the expedition crosses before she does. Joel doesn't leave her side for a second of it.<br><br>They're the last two through.",
    22: "Coming back is almost disorienting in its own way. Barely any time has passed in Veyren — a few hours, nothing more — but the expedition itself felt like it stretched on far longer than that.<br><br>The crew unloads everything they carefully gathered: samples, notes, the small evidence of an entire world they'd only just started to understand.<br><br>Nobody celebrates right away. There's too much to sit with first.",
    23: "Renn, Erynn, and Mimi spend the next stretch doing the unglamorous part — writing everything down while it's still fresh, turning a wild first attempt into something repeatable.<br><br>What comes out of it is the first real Inter-World Expedition Protocol: compatible supplies, environmental testing, translation resources, proper timekeeping, fixed return markers, boundary monitoring, and a real plan for emergency extraction if it's ever needed again.<br><br>It isn't just a report. It's the moment the Horizon Engine stops being an experiment and starts being an actual way to travel.",
    24: "San and Joel end up at the harbour together once everything else has settled — the Crimson Tide resting behind them in Fair Tide, Veyren stretching out ahead, and somewhere beyond even that, the world they just came back from.<br><br>\"We thought we were crossing into another world,\" San says.<br><br>Joel looks toward the horizon a while before he answers.<br><br>\"We were.\"<br><br>A pause.<br><br>\"But we also learned how to come home.\"<br><br>The first crossing was never really about discovering another world. It was about proving they could leave one — and still find their way back."
  };

  window.markArc12ChapterRead = function(id){
    id = Number(id);
    const ch = ARC12_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc12] no chapter data for id', id); return; }
    game.comicProgress12 = game.comicProgress12||{};
    if(game.comicProgress12[id]){ toast('✓ Already marked read.'); return; }
    if(window.arc12ObjectiveState() !== 'complete_arc12_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress12[id] = true;
    if (id === 24) game.arc12Complete = true; // "Arc 12 unlock" — ready for Arc XIII
    gainXP(ch.xp);
    game.reputation = (game.reputation||0) + 1;
    logEvent('📖 Arc XII Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if (ARC12_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC12_CHAPTER_SCENES[id] });
    }
    if (typeof renderMainGoal === 'function') try { renderMainGoal(); } catch(e) {}
    if (typeof renderStory === 'function') try { renderStory(); } catch(e) {}
  };

  window.__ctShowArc12Splash = function(){
    const overlay = document.getElementById('arc12SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc12Splash = function(){
    const overlay = document.getElementById('arc12SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc12SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc12 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc12) oldRenderStoryForArc12();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc12Ready = window.arc12ObjectiveState() !== null;
    if (arc12Ready && !game.arc12SplashSeen && typeof window.__ctShowArc12Splash === 'function') {
      window.__ctShowArc12Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc12/arc12-cover-the-first-crossing.png" alt="Arc XII — The First Crossing" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XII</div><div class="story-act-title">The First Crossing</div>'+
      '<div class="story-act-tagline">Chapters 1-'+ARC12_CHAPTERS.length+' of 24. Every new world begins with someone taking the first step.</div></div>';
    if (!arc12Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XII Locked</div><div class="story-chapter-sub">'+
        (!game.arc11Complete ? 'Finish Arc XI first.' : 'Reach Level 180 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc12ObjectiveState();
    ARC12_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress12 && game.comicProgress12[ch.id]);
      const ready = !done && so===('complete_arc12_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
        '<button class="btn btn-small btn-success" onclick="markArc12ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc12_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ Arc XII complete — all 24 chapters read. Preparing for Arc XIII.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();


(function(){
  // -------------------------------------------------------------------
  // WYVERNS + DRAGON BLOOD — extends the Research Expedition with a
  // rarer encounter type, unlocked once Arc X's Ch.8 establishes Dragon
  // Blood as real (game.dragonBloodDiscovered). Wyverns drop the same
  // Knowledge/Residue as everything else, plus a chance at actual
  // Dragon Blood — the material the whole back half of Arc X is about —
  // and a themed accessory drop via the existing trophy system, rather
  // than the generic fallback trinket every expedition enemy currently
  // gets (none of the existing 6 names match any LOOT_THEMES keyword).
  //
  // EXPEDITION_ENEMIES/expeditionEnemyPool/generateExpeditionEnemy are
  // all private to ct-build-v129's closure, so wyverns can't be filtered
  // out of the random pool from here directly. Instead they're kept OUT
  // of the shared EXPEDITION_ENEMIES object entirely until unlocked, and
  // synced in/out on every renderFairTideHub call — which the player
  // always hits before reaching the Expedition tab, so this can't ever
  // be stale by the time a fight could actually start.
  // -------------------------------------------------------------------
  const WYVERN_ENEMIES = {
    young_wyvern: {name:'Young Wyvern', icon:'🐲', hp:300, dmg:16, xp:200, knowledge:6, residue:8, dragonBloodChance:0.12, desc:'Smaller than the one from Mimi\'s vision. Still not something to take lightly.'},
    storm_wyvern: {name:'Storm Wyvern', icon:'🐉', hp:420, dmg:24, xp:280, knowledge:8, residue:12, dragonBloodChance:0.20, desc:'Old enough to have its own territory, and it defends it exactly like you\'d expect.'}
  };
  const WYVERN_KEYS = Object.keys(WYVERN_ENEMIES);
  window.WYVERN_ENEMIES = WYVERN_ENEMIES;

  function syncWyvernPoolGating(){
    if (typeof window.EXPEDITION_ENEMIES === 'undefined') return;
    const unlocked = !!game.dragonBloodDiscovered;
    WYVERN_KEYS.forEach(function(key){
      if (unlocked) {
        window.EXPEDITION_ENEMIES[key] = WYVERN_ENEMIES[key];
      } else {
        delete window.EXPEDITION_ENEMIES[key];
      }
    });
  }
  window.syncWyvernPoolGating = syncWyvernPoolGating;

  const oldRenderFairTideHubForWyverns = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    syncWyvernPoolGating();
    if (oldRenderFairTideHubForWyverns) oldRenderFairTideHubForWyverns();
  };

  const oldHandleVictoryForWyverns = window.handleVictory;
  window.handleVictory = function(){
    if (oldHandleVictoryForWyverns) oldHandleVictoryForWyverns();
    const enemy = game.combatEnemy;
    if (!enemy || enemy.kind !== 'expedition') return;
    if (!enemy.dragonBloodChance) return; // not a wyvern — nothing further to do here
    if (Math.random() >= enemy.dragonBloodChance) return; // rolled, no Dragon Blood this time
    const he = window.horizonEngineState();
    const firstEver = he.dragonBlood === 0;
    he.dragonBlood += 1;
    logEvent('🩸 Dragon Blood recovered from ' + enemy.name + '. Handled carefully — this stuff doesn\'t like ordinary containers.', 'gold');
    if (firstEver) {
      setTimeout(function(){
        if (typeof showStoryModal === 'function') showStoryModal({
          title: '🩸 Dragon Blood, Recovered',
          blurb: 'The wyvern goes down, and this time something actually comes back with it — a small amount of real Dragon Blood, carefully sealed the moment it\'s recovered.<br><br>It won\'t be the last. But every bit of it from here on has to be earned the same way: found, not farmed freely.'
        });
      }, 600);
    } else {
      toast('🩸 Dragon Blood recovered! (' + he.dragonBlood + ' total)', 3600);
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  // Themed accessory drop — a real dragon-kin trinket instead of the
  // generic ⚔️ fallback every expedition enemy currently gets, since
  // none of the other 6 names match any existing LOOT_THEMES keyword.
  if (typeof LOOT_THEMES !== 'undefined') {
    LOOT_THEMES.unshift([['wyvern'], '🐉', 'Wyvern Scale']);
  }
  if (typeof TRINKET_BONUS !== 'undefined') {
    TRINKET_BONUS['🐉'] = {dmgPct:0.12, spellPct:0.08, label:'+12% damage, +8% spell damage'};
  }
})();


(function(){
  // -------------------------------------------------------------------
  // THE MEMORY ARCHIVE — a distinct, standalone story arc, not chained to
  // any numbered arc's gating. Sole prerequisite is Joel having joined
  // the crew — these are shared memories, so they only make sense once
  // he's actually part of the story. 13 chapters, each with its own
  // one-time read (same simple markXChapterRead pattern every arc since
  // Arc II uses) PLUS a repeatable "Challenge Memory Again" combat option
  // once read — the actual novel part of this feature, and the reason
  // these enemies (MEMORY_FRAGMENTS, defined near HARBOR_ENEMIES) use the
  // ordinary scaleCrimsonEnemy level-scaling branch rather than the
  // frozen 'memory'/'final' one Arc III's own one-time memory fights use
  // — those two systems look similar but are deliberately not the same:
  // Arc III's battles are sequential, unscaled, one-shot story beats;
  // these are meant to be returned to anytime, at whatever level the
  // party's actually at.
  //
  // Chapter list/filenames wired exactly as given — images aren't
  // uploaded yet, so these paths will 404 until they are; the "Open
  // Chapter" link degrades gracefully either way (same pattern every
  // other arc already uses for this).
  //
  // Scene text below is a condensed adaptation, not a verbatim transcript
  // of what was provided — the emotional throughline and most concrete
  // detail is kept, but exact figures (salary numbers, dates) are left
  // out, both because they'd read oddly as in-fiction flavor text next to
  // this game's usual prose, and because there's no real need for that
  // level of specificity to live permanently in a client-side save file.
  // -------------------------------------------------------------------
  const MEMORY_ARCHIVE_CHAPTERS = [
    {id:1,  title:'Just a Girl',                 focus:"San holds a demanding job together while carrying weight nobody around her can see. She's tired, and starting to want something that's just hers.", image:'assets/comics/memory-archive/ch01-just-a-girl.png', xp:120},
    {id:2,  title:'A Person Least Expected',      focus:'Joel works himself past exhaustion, sends for his daughter from a distance, and has quietly stopped expecting anything more than that.', image:'assets/comics/memory-archive/ch02-a-person-least-expected.png', xp:120},
    {id:3,  title:'A Curious Hello',              focus:"An unfamiliar app, an unlikely match — someone posting in Tagalog, based somewhere neither of them expected.", image:'assets/comics/memory-archive/ch03-a-curious-hello.png', xp:120},
    {id:4,  title:'The First Call',                focus:'Careful questions become an easy conversation. A video call that was supposed to be quick runs for hours instead.', image:'assets/comics/memory-archive/ch04-the-first-call.png', xp:130},
    {id:5,  title:'Ten Hours Together',            focus:'A first date that keeps not ending — a film, a first kiss, and the quiet realization that this might actually be something.', image:'assets/comics/memory-archive/ch05-ten-hours-together.png', xp:140},
    {id:6,  title:'That Night',                    focus:'Something private, unhurried, and never fully explained — only that it felt right in a way neither of them expected.', image:'assets/comics/memory-archive/ch06-that-night.png', xp:130},
    {id:7,  title:'Every Sunday',                  focus:'A year of shared Sundays — small and ordinary, and exactly what makes choosing someone, again and again, mean something.', image:'assets/comics/memory-archive/ch07-every-sunday.png', xp:140},
    {id:8,  title:'Different Battles',             focus:'Both San and Joel are quietly worn down at work, each carrying their own version of the same kind of pressure.', image:'assets/comics/memory-archive/ch08-different-battles.png', xp:140},
    {id:9,  title:'Memory Trigger',                focus:"An accident at Joel's work. San reaches the hospital in twenty minutes flat. When it matters, the person who loves you shows up first.", image:'assets/comics/memory-archive/ch09-memory-trigger.png', xp:150},
    {id:10, title:'Memory Trigger',                focus:"San's long career comes to an uncertain, complicated end. Joel doesn't offer money — he just quietly makes sure she's alright.", image:'assets/comics/memory-archive/ch10-memory-trigger.png', xp:150},
    {id:11, title:'Memory Fragment: Family',       focus:'The sisters, nieces, and nephews San carried with her long before Joel — some close, some distant, all still hers.', image:'assets/comics/memory-archive/ch11-memory-fragment-family.png', xp:140},
    {id:12, title:'Familial Bonds',                focus:'More of the family San has held onto across years and distance — imperfect, complicated, and still family.', image:'assets/comics/memory-archive/ch12-familial-bonds.png', xp:140},
    {id:13, title:"Joel's Family",                 focus:'Two complicated families, on both sides — and, somehow, two people who chose each other anyway.', image:'assets/comics/memory-archive/ch13-joels-family.png', xp:160}
  ];
  window.MEMORY_ARCHIVE_CHAPTERS = MEMORY_ARCHIVE_CHAPTERS;

  const MEMORY_ARCHIVE_SCENES = {
    1: "San holds a demanding office job together from the outside — capable, dependable, rarely any trouble.<br><br>Underneath that, she's exhausted. The work is unpredictable. So is the person running it.<br><br>Most people around her don't know what she's already been through, or what she's still carrying — a difficult marriage she's still untangling herself from, distance from her own children, and someone from her past who keeps pulling her back in with demands she can barely keep up with.<br><br>She wants to remember what it feels like to just be herself. One day, almost by accident, she finds an app that will end up changing everything.",
    2: "Before San, Joel is just trying to get through the days. Early mornings, long shifts, heavy work — and even his days off aren't always really his.<br><br>His body is tired. So is his mind. His mother is the one constant he can lean on.<br><br>He has a daughter he rarely gets to see, but never stops providing for. He's made his own mistakes too, and carries the weight of them quietly.<br><br>A past relationship ended during a hard stretch neither of them could really control. Joel reaches a simple conclusion: better alone than in something like that again. He isn't looking to be rescued, and isn't expecting anything extraordinary.<br><br>Then San appears.",
    3: "San starts to feel boxed in by everything around her — by obligations she never fully chose, by someone from her past who won't stop asking for more than she has to give.<br><br>She opens an app she's never used before, almost on a whim, and picks a country to match with that isn't her own.<br><br>Then a profile catches her eye. The posts are in Tagalog. The location says somewhere unexpected. Curious enough to matter, she sends a message — with no idea yet whose profile it actually is.",
    4: "They talk as new friends first — careful, curious, asking each other everything.<br><br>Small nerves surface and get answered honestly: an age gap that turns out not to matter, a daughter he's never hidden, children of her own she doesn't get to raise day to day.<br><br>Eventually they move the conversation somewhere else, exchange numbers, and San asks if they can call — she wants to hear his voice.<br><br>The call runs for hours. He's shy when his dorm mates wander past. By the end of it, they've already agreed to meet.",
    5: "Their first date runs long — a walk through the mall, nerves when hands touch for the first time, a movie neither of them really watches all the way through.<br><br>They take photos together. They share a first kiss. Before the night's over, he tells her he loves her.<br><br>Neither of them meant for it to turn into ten hours. It does anyway — and it's only the beginning.",
    6: "After their last date, it's clear to both of them that this has already become something more than casual.<br><br>They find time and space to be alone together. San is nervous — it's been a long time, and her past hasn't made intimacy easy for her.<br><br>With Joel, it feels different. Natural, unhurried, and — for both of them — something neither quite expected. The details stay theirs. What matters is that neither of them regrets it.",
    7: "For the next year, Sundays belong to them. Their one shared day off, spent on small, ordinary things — errands, groceries, time near where he stays.<br><br>San can't always stay the night; her parents need her too. That doesn't make the day matter any less.<br><br>The relationship isn't perfect — there's an unresolved divorce, money pressure, people who try to get too close to San at work, disagreements neither of them enjoys. But every week, they keep choosing to show up for each other anyway.",
    8: "Both of them are quietly struggling at work, in their own ways.<br><br>At San's office, the pressure keeps building — people are starting to leave. At Joel's warehouse, tension is building around him too, with a boss's family entangled in the day-to-day and little patience for pushback.<br><br>Joel's body starts giving out from the workload. When he asks for rest, he's threatened over it. He starts speaking up anyway — about unfair treatment, about how women on the floor are treated — and it costs him some of the goodwill he used to have.<br><br>Meanwhile, San is heading toward a breaking point of her own.",
    9: "Joel is hurt in an accident at work — a fall, an unguarded edge, more than he expects on what should have been an ordinary day near the end of his shift.<br><br>San reaches the hospital in twenty minutes. His boss barely reacts to the news. Joel's own supervisor, rattled, at least makes sure he gets to a doctor.<br><br>San already understands the unsafe conditions better than anyone needs to explain to her — that's not what she's thinking about, though. She just needs to see him.<br><br>His head is bandaged. She kisses him anyway. When something happens, the person who loves you is the one who comes first.",
    10: "San's long career at her office comes to an uncertain, complicated end — years of history, old paperwork, and old decisions finally catching up with her all at once.<br><br>It isn't a clean goodbye. There's confusion about what was actually decided and when, and a slow, tired recognition that the place she'd given so much to isn't the place it used to be.<br><br>At home, things are just as hard — family pressure, her father's health, and a mounting sense that she's stretched too thin to hold it all.<br><br>Joel finds out. He doesn't ask her for anything, and doesn't offer money either — he just quietly borrows what he needs to help from somewhere else, and tells her about it only much later. When she eventually finds a new, lower-paying job through a trusted connection, his only response is that as long as she's happy, the number doesn't matter to him.",
    11: "San thinks back on the family she carried with her long before Joel ever came into the picture.<br><br>Her eldest sister weathered a difficult first marriage and came out the other side of it. Her sister's two children didn't always get along, growing up — one used to be closer to their father, the other closer to San's own father instead — but time changed that, and they became some of the people San trusts most.<br><br>San and her eldest sister stayed close through all of it, in a way that outlasted every hard year in between.",
    12: "More of San's family, spread further out across time and distance.<br><br>A niece she was once close with grew up, grew apart, and found her own path — including a harder diagnosis along the way that reshaped how the family understood her.<br><br>Another relative built a hard life for herself after her own divorce, not always approving of San's choices, never quite standing in the way of them either. Some of the closeness faded after San remarried and stopped visiting as often. A father figure, not related by blood, was lost along the way too.<br><br>None of it undid the fact that, whatever the distance, they were still family.",
    13: "Joel's family carries its own complications. His parents separated while he was still in school. His father passed on after a hard stretch, not long after finally getting back to steady work.<br><br>Joel is the second of four. His older sister survived real hardship and came out of it stronger — he's plainly proud of her. One brother built a stable life further away; the youngest started a family early, before he was really ready to.<br><br>His mother has carried more than her share too, across bad years and harder ones.<br><br>Joel never pushes San about her past — if she wants to talk about it, he listens, and he never needed the full story before he could love her anyway.<br><br>Two people. Two complicated families. Somehow, still, each other.<br><br>\"I'm lucky to have you,\" San tells him.<br><br>\"I'm also lucky to have you,\" he says back."
  };

  window.memoryArchiveObjectiveState = function(){
    const joelM = ALL_PARTY.find(m => m.id === 'joel');
    if (!joelM || !memberUnlocked(joelM)) return null;
    game.comicProgressMemoryArchive = game.comicProgressMemoryArchive || {};
    for (const ch of MEMORY_ARCHIVE_CHAPTERS) {
      if (!game.comicProgressMemoryArchive[ch.id]) return 'complete_memoryarchive_chapter_' + ch.id;
    }
    return 'memoryarchive_complete_for_now';
  };

  window.markMemoryArchiveChapterRead = function(id){
    id = Number(id);
    const ch = MEMORY_ARCHIVE_CHAPTERS.find(c => c.id === id);
    if (!ch) { console.warn('[MemoryArchive] no chapter data for id', id); return; }
    game.comicProgressMemoryArchive = game.comicProgressMemoryArchive || {};
    if (game.comicProgressMemoryArchive[id]) { toast('✓ Already marked read.'); return; }
    if (window.memoryArchiveObjectiveState() !== 'complete_memoryarchive_chapter_' + id) { toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgressMemoryArchive[id] = true;
    gainXP(ch.xp);
    game.reputation = (game.reputation || 0) + 1;
    logEvent('📖 Memory Archive · Chapter ' + id + ' complete: ' + ch.title + ' · +' + ch.xp + ' XP', 'gold');
    toast('📖 Chapter ' + id + ' complete! +' + ch.xp + ' Story XP');
    if (MEMORY_ARCHIVE_SCENES[id] && typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({ title: ch.title, blurb: MEMORY_ARCHIVE_SCENES[id] });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // Repeatable "Challenge Memory Again" — the actual novel mechanic here.
  // Each chapter's Memory Fragment (defined with MEMORY_FRAGMENTS, near
  // HARBOR_ENEMIES) uses the ordinary level-scaling branch, so these
  // stay a fair fight at whatever level the party's actually at, no
  // matter how long ago the chapter itself was first read.
  window.challengeMemoryFragment = function(id){
    id = Number(id);
    if (!game.comicProgressMemoryArchive || !game.comicProgressMemoryArchive[id]) { toast('🔒 Read this chapter first.'); return; }
    if (game.inCombat) { toast('Already out on something else.'); return; }
    const key = 'memory_fragment_' + id;
    if (!MEMORY_FRAGMENTS[key]) { console.warn('[MemoryArchive] no enemy defined for', key); return; }
    startCombat({ kind: 'memoryArchive', key, enemy: scaledEnemyForExplore(key, 'memoryArchive') });
  };

  const oldRenderStoryForMemoryArchive = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForMemoryArchive) oldRenderStoryForMemoryArchive();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const ready = typeof window.memoryArchiveObjectiveState === 'function' && window.memoryArchiveObjectiveState() !== null;
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/memory-archive/memory-archive-cover.png" alt="The Memory Archive" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Memory Archive</div><div class="story-act-title">Before the Crimson Tide</div>'+
      '<div class="story-act-tagline">San and Joel\'s life before the ship — thirteen fragments, love, hardship, and family.</div></div>';
    if (!ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Memory Archive Locked</div><div class="story-chapter-sub">Recruit Joel first — these are shared memories.</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.memoryArchiveObjectiveState();
    MEMORY_ARCHIVE_CHAPTERS.forEach(ch => {
      const done = !!game.comicProgressMemoryArchive?.[ch.id];
      const readyNow = !done && so === ('complete_memoryarchive_chapter_' + ch.id);
      const status = done ? '✓ COMPLETE' : (readyNow ? 'CURRENT' : '🔒 LOCKED');
      let action;
      if (readyNow) {
        action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="markMemoryArchiveChapterRead('+ch.id+')">✓ Mark Chapter Read</button>';
      } else if (done) {
        action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Read Again</button> '+
          '<button class="btn btn-small btn-danger" onclick="challengeMemoryFragment('+ch.id+')">⚔️ Challenge Memory Again</button>';
      } else {
        action = '<div class="story-chip">Follow the current Objective.</div>';
      }
      html += '<article class="quest-item '+(done?'completed':'')+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so === 'memoryarchive_complete_for_now') {
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All 13 memories read. Each one can still be challenged again anytime, above.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };

  const oldRenderComicArchiveForMemoryArchive = window.renderComicArchive;
  window.renderComicArchive = function(){
    if (oldRenderComicArchiveForMemoryArchive) oldRenderComicArchiveForMemoryArchive();
    const el = document.getElementById('comicArchive'); if (!el) return;
    const progress = (typeof game !== 'undefined' && game.comicProgressMemoryArchive) || {};
    const read = MEMORY_ARCHIVE_CHAPTERS.filter(ch => !!progress[ch.id]);
    const section = !read.length
      ? '<div class="comic-archive-card"><div class="comic-archive-sub">No Memory Archive chapters read yet.</div></div>'
      : read.map(ch => '<div class="comic-archive-card"><div class="comic-archive-title">Chapter '+ch.id+' — '+esc(ch.title)+'</div>'+
          '<button class="btn btn-small" style="margin-top:6px;" onclick="openComicImage(\''+ch.image+'\')">📖 Read Again</button> '+
          '<button class="btn btn-small btn-danger" style="margin-top:6px;" onclick="challengeMemoryFragment('+ch.id+')">⚔️ Challenge Memory Again</button></div>').join('');
    el.insertAdjacentHTML('beforeend',
      '<div class="comic-archive-title" style="font-size:1.05rem;margin:18px 0 6px;">Memory Archive — Before the Crimson Tide</div>' + section);
  };
})();


(function(){
  // -------------------------------------------------------------------
  // ILLUSIONARY WATERS. Unlocked once all 13 Memory Archive chapters are
  // read — reachable both as its own dedicated Sail destination and as a
  // rare event during an ordinary voyage to a real port (San specifically
  // asked whether the latter was possible; it is, via the same EVENTS
  // pool doVoyage already rolls against). Each visit is fully random:
  // which of the 13 places, and whether it's a themed battle or a
  // memento — no fixed pairing between place and outcome, no combat
  // effect from mementos, purely a collectible. Revisitable indefinitely.
  //
  // Locations combine Arc III's old-world places (Jangsak, Meragang,
  // Singapore), the two Arc IX dorm-illusion beats (Ch.15, "The First
  // Home" — the dormitory itself and the spot where Joel fed Soel's
  // mother, since that's the clearest real distinction in what's
  // actually written; flagged to San as an assumption since the exact
  // "two places" wasn't fully specified), and the 8 Memory Archive
  // locations San listed directly.
  // -------------------------------------------------------------------
  const ILLUSION_LOCATIONS = [
    {key:'jangsak', name:"Jangsak", monsterName:"A Flicker of Old Arguments", monsterIcon:'🗯️', mementoName:"A Faded Family Photo", mementoIcon:'🖼️', desc:"The house where Aisyah, Senedra, and Zaki grew up. Voices San half-remembers, arguing about nothing she can quite place anymore."},
    {key:'meragang', name:"Meragang", monsterName:"A Restless Echo", monsterIcon:'👤', mementoName:"A Childhood Marble", mementoIcon:'🔮', desc:"Familiar streets that don\'t lead anywhere real anymore, just the shape of somewhere she used to know."},
    {key:'singapore', name:"Singapore", monsterName:"A Familiar Stranger", monsterIcon:'🌆', mementoName:"An Old Bus Ticket", mementoIcon:'🎫', desc:"A city San stopped visiting. Mez and Eliz are somewhere in it, just out of reach, the way distance does that to people."},
    {key:'joels_dormitory', name:"Joel's Dormitory (Illusion)", monsterName:"A Wandering Roommate", monsterIcon:'👻', mementoName:"A Worn Work Boot", mementoIcon:'👢', desc:"The shared room, exactly as tired as Joel remembers it. Someone else\'s things are still on the other bunk."},
    {key:'mall_gadong', name:"The Mall, Gadong", monsterName:"An Overpriced Vendor", monsterIcon:'🛍️', mementoName:"A Photobooth Strip", mementoIcon:'📸', desc:"Where it all actually started. Ten hours that felt like ten minutes, replaying just out of sync."},
    {key:'the_private_place', name:"The Private Place", monsterName:"A Held Breath", monsterIcon:'💭', mementoName:"A Quiet Warmth", mementoIcon:'🕯️', desc:"Somewhere neither of them ever named out loud. The details stay exactly as private here as they were then."},
    {key:'joels_philippine_village', name:"Joel's Philippine Village", monsterName:"A Village Watchdog", monsterIcon:'🐕', mementoName:"A Woven Bracelet", mementoIcon:'🧵', desc:"Where Mama is from. San never actually visited, but the memory has her here anyway, the way love borrows places it\'s never been."},
    {key:'the_airport', name:"The Airport", monsterName:"The Unboarded Echo", monsterIcon:'✈️', mementoName:"A Boarding Pass Stub", mementoIcon:'🎟️', desc:"Where San first met Mama. Arrivals and departures, overlapping, the way airports always seem to hold both at once."},
    {key:'8tea_sengkurong', name:"8tea, Sengkurong", monsterName:"An Impatient Barista", monsterIcon:'🧋', mementoName:"A Half-Finished Cup", mementoIcon:'🥤', desc:"An ordinary Sunday errand. Nothing remarkable happened here — which is exactly why it\'s remembered at all."},
    {key:'sipsteria_sengkurong', name:"Sipsteria, Sengkurong", monsterName:"A Restless Regular", monsterIcon:'☕', mementoName:"A Loyalty Stamp Card", mementoIcon:'🎫', desc:"Another quiet stop on another quiet Sunday. The kind of place that only matters in hindsight."},
    {key:'amalis_cafe', name:"Amali's Cafe", monsterName:"A Muttering Patron", monsterIcon:'☕', mementoName:"A Napkin Doodle", mementoIcon:'📝', desc:"Coffee, conversation, nothing urgent. The kind of afternoon neither of them thought to hold onto at the time."},
    {key:'madewa_apartment', name:"The Madewa Rental Apartment", monsterName:"A Familiar Silence", monsterIcon:'🌙', mementoName:"A Spare Key", mementoIcon:'🔑', desc:"A rented room that was theirs for a while, in the way borrowed places sometimes are."}
  ];
  window.ILLUSION_LOCATIONS = ILLUSION_LOCATIONS;

  Object.assign(HARBOR_ENEMIES, {
    jangsak_illusion: {name:"A Flicker of Old Arguments", icon:'🗯️', hp:220, dmg:14, xp:150, gold:0, desc:"The house where Aisyah, Senedra, and Zaki grew up. Voices San half-remembers, arguing about nothing she can quite place anymore."},
    meragang_illusion: {name:"A Restless Echo", icon:'👤', hp:220, dmg:14, xp:150, gold:0, desc:"Familiar streets that don\'t lead anywhere real anymore, just the shape of somewhere she used to know."},
    singapore_illusion: {name:"A Familiar Stranger", icon:'🌆', hp:220, dmg:14, xp:150, gold:0, desc:"A city San stopped visiting. Mez and Eliz are somewhere in it, just out of reach, the way distance does that to people."},
    joels_dormitory_illusion: {name:"A Wandering Roommate", icon:'👻', hp:220, dmg:14, xp:150, gold:0, desc:"The shared room, exactly as tired as Joel remembers it. Someone else\'s things are still on the other bunk."},
    mall_gadong_illusion: {name:"An Overpriced Vendor", icon:'🛍️', hp:220, dmg:14, xp:150, gold:0, desc:"Where it all actually started. Ten hours that felt like ten minutes, replaying just out of sync."},
    the_private_place_illusion: {name:"A Held Breath", icon:'💭', hp:220, dmg:14, xp:150, gold:0, desc:"Somewhere neither of them ever named out loud. The details stay exactly as private here as they were then."},
    joels_philippine_village_illusion: {name:"A Village Watchdog", icon:'🐕', hp:220, dmg:14, xp:150, gold:0, desc:"Where Mama is from. San never actually visited, but the memory has her here anyway, the way love borrows places it\'s never been."},
    the_airport_illusion: {name:"The Unboarded Echo", icon:'✈️', hp:220, dmg:14, xp:150, gold:0, desc:"Where San first met Mama. Arrivals and departures, overlapping, the way airports always seem to hold both at once."},
    '8tea_sengkurong_illusion': {name:"An Impatient Barista", icon:'🧋', hp:220, dmg:14, xp:150, gold:0, desc:"An ordinary Sunday errand. Nothing remarkable happened here — which is exactly why it\'s remembered at all."},
    sipsteria_sengkurong_illusion: {name:"A Restless Regular", icon:'☕', hp:220, dmg:14, xp:150, gold:0, desc:"Another quiet stop on another quiet Sunday. The kind of place that only matters in hindsight."},
    amalis_cafe_illusion: {name:"A Muttering Patron", icon:'☕', hp:220, dmg:14, xp:150, gold:0, desc:"Coffee, conversation, nothing urgent. The kind of afternoon neither of them thought to hold onto at the time."},
    madewa_apartment_illusion: {name:"A Familiar Silence", icon:'🌙', hp:220, dmg:14, xp:150, gold:0, desc:"A rented room that was theirs for a while, in the way borrowed places sometimes are."}
  });

  window.illusionsUnlocked = function(){
    return typeof window.memoryArchiveObjectiveState === 'function' &&
      window.memoryArchiveObjectiveState() === 'memoryarchive_complete_for_now';
  };

  function mementoState(){ game.illusionMementos = game.illusionMementos || {}; return game.illusionMementos; }
  window.illusionMementoState = mementoState;

  // Core resolution — same function whether triggered from the dedicated
  // Sail option or a random voyage event.
  window.triggerIllusionEncounter = function(midVoyage){
    if (!window.illusionsUnlocked()) { toast('🔒 Complete the Memory Archive first.'); return; }
    const loc = ILLUSION_LOCATIONS[Math.floor(Math.random() * ILLUSION_LOCATIONS.length)];
    if (Math.random() < 0.5) {
      // Battle outcome
      const enemyKey = loc.key + '_illusion';
      const enemy = (typeof scaledEnemyForExplore === 'function') ? scaledEnemyForExplore(enemyKey, 'harbor') : null;
      if (!enemy) { toast('The memory slips away before it takes shape.'); return; }
      toast('🌫️ ' + loc.name + ' — something is here.', 2600);
      startCombat({kind:'illusion', key: enemyKey, enemy: enemy, portId:null});
    } else {
      // Memento outcome — no combat, no stat effect, purely a keepsake.
      const ms = mementoState();
      const firstEver = ms[loc.key] === undefined;
      ms[loc.key] = (ms[loc.key] || 0) + 1;
      logEvent('🌫️ ' + loc.name + ': found ' + loc.mementoIcon + ' ' + loc.mementoName + '.', 'good');
      if (firstEver) {
        setTimeout(function(){
          if (typeof showStoryModal === 'function') showStoryModal({
            title: loc.mementoIcon + ' ' + loc.mementoName,
            blurb: loc.desc + '<br><br>Whatever this place really was, something of it is real enough to hold onto now.'
          });
        }, 500);
      } else {
        toast('🌫️ ' + loc.name + ': found another ' + loc.mementoIcon + ' ' + loc.mementoName + '.', 3200);
      }
      // BUG FIX: a memento outcome never navigated anywhere — fine from
      // the dedicated Illusionary Waters screen (staying there to step
      // in again is the point), but a mid-voyage trigger would strand
      // the player on a now-frozen voyage screen with nothing to do,
      // unlike the battle outcome, which already returns to port via
      // combat's own exit flow.
      if (midVoyage && typeof goScreen === 'function') {
        goScreen('port');
      }
      if (typeof saveGameQuiet === 'function') saveGameQuiet();
      if (typeof renderIllusionsScreen === 'function') renderIllusionsScreen();
    }
  };

  // Sync the illusion voyage-event's presence in the shared EVENTS pool —
  // added only once unlocked, removed otherwise, checked fresh every
  // time a voyage actually starts (doVoyage wrap below), so this can
  // never be stale regardless of when the Memory Archive was completed.
  function syncIllusionVoyageEvent(){
    if (typeof EVENTS === 'undefined') return;
    const existingIdx = EVENTS.findIndex(e => e.type === 'illusion');
    if (window.illusionsUnlocked()) {
      if (existingIdx === -1) EVENTS.push({type:'illusion', text:'The air shimmers. For a moment, you\'re somewhere else entirely.', danger:1, illusion:true});
    } else {
      if (existingIdx !== -1) EVENTS.splice(existingIdx, 1);
    }
  }

  const oldDoVoyageForIllusions = window.doVoyage;
  window.doVoyage = function(portId, days, dangerLevel){
    syncIllusionVoyageEvent();
    return oldDoVoyageForIllusions ? oldDoVoyageForIllusions(portId, days, dangerLevel) : undefined;
  };

  // -------------------------------------------------------------------
  // Reachable from the Sail screen, once unlocked — a light hub, not a
  // Fair-Tide-scale multi-tab structure per San's own direction.
  // -------------------------------------------------------------------
  const oldRenderNavigationForIllusions = window.renderNavigation;
  window.renderNavigation = function(){
    if (oldRenderNavigationForIllusions) oldRenderNavigationForIllusions();
    const grid = document.getElementById('navPortGrid');
    if (!grid || !window.illusionsUnlocked()) return;
    grid.insertAdjacentHTML('beforeend',
      '<div class="port-card" style="cursor:pointer;border-color:rgba(150,120,255,.5);" onclick="goScreen(\'illusions\')">'+
      '<div style="font-size:1.6rem;">🌫️</div><div style="font-weight:600;">Illusionary Waters</div>'+
      '<div style="font-size:.72rem;opacity:.7;">A place that isn\'t really a place.</div></div>');
  };

  window.renderIllusionsScreen = function(){
    const container = document.getElementById('illusionsContent');
    if (!container) return;
    const ms = mementoState();
    const found = Object.keys(ms).length;
    let html = '<div class="panel"><div class="panel-title">🌫️ Illusionary Waters</div>'+
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:12px;">Somewhere between memory and sea. Nothing here is quite real, and nothing here is quite gone, either.</p>'+
      '<button class="btn btn-success" onclick="triggerIllusionEncounter()">🚪 Step Into a Memory</button></div>'+
      '<div class="panel"><div class="panel-title">🛒 Market</div>'+
      '<p style="font-size:.82rem;opacity:.55;">There\'s nothing to buy in an echo. This stays closed here.</p></div>'+
      '<div class="panel"><div class="panel-title">📦 Mementos — '+found+'/'+ILLUSION_LOCATIONS.length+'</div>';
    ILLUSION_LOCATIONS.forEach(function(loc){
      const count = ms[loc.key] || 0;
      html += '<div style="font-size:.8rem;padding:4px 0;'+(count?'':'opacity:.4;')+'">'+
        (count ? loc.mementoIcon : '❔') + ' ' + (count ? loc.mementoName : '???') +
        (count > 1 ? ' ×'+count : '') + '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  };

  const oldGoScreenForIllusions = window.goScreen;
  window.goScreen = function(name){
    if (oldGoScreenForIllusions) oldGoScreenForIllusions(name);
    if (name === 'illusions' && typeof window.renderIllusionsScreen === 'function') window.renderIllusionsScreen();
  };
})();
