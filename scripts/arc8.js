
(function(){
  // -------------------------------------------------------------------
  // ARC VIII — "The Horizon Engine". Gated behind game.arc7Complete (set
  // by Arc VII's Ch.24) + level 120, continuing the +15-per-arc pace
  // from Arc IV (60) / V (75) / VI (90) / VII (105). Almost entirely
  // narrative — no new mechanics needed per the brief itself ("mostly
  // storyline based"), so this uses the same single reusable
  // markArc8ChapterRead pattern Arc II-IV use, not per-chapter bespoke
  // functions like Arc VI needed. A few narratively load-bearing
  // chapters (11, 18, 23, 24) set small flags for whatever later
  // content wants to check them — no functional system attached to any
  // of them yet, matching "understand first, build later" restraint:
  // the Horizon Engine itself isn't built by the end of this arc, and
  // dragons are only teased in the final line, not implemented as a
  // creature type. Ch.24 explicitly ends the arc with nothing built —
  // per San's plan, the actual Horizon Engine hub (Fair-Tide-shaped,
  // dragon blood as its first requirement) is Arc IX+ content, once
  // dragons exist as something combat can reference.
  // -------------------------------------------------------------------
  const ARC8_CHAPTERS = [
    {id:1,  title:'Something Changed',            focus:"Life at Fair Tide looks normal after Arc VII. But Renn notices the magical readings around the settlement have shifted. Erynn checks the Farseer records — nothing matches. Mimi senses something else: something is looking back.", image:'assets/comics/arc8/ch01-something-changed.png', xp:200, action:'📜 Check Farseer Records'},
    {id:2,  title:'The Second Door',               focus:"Renn finds another strange door — not hidden away this time, but somewhere completely ordinary. Erynn recognizes markings older than Varel's own records.", image:'assets/comics/arc8/ch02-the-second-door.png', xp:200, action:'🚪 Examine the Doorway'},
    {id:3,  title:'The Map That Moves',            focus:"Maps of the same region disagree with each other — roads shift, landmarks move. Erynn proposes something worse than bad cartography: the maps may all be correct, just at different times.", image:'assets/comics/arc8/ch03-the-map-that-moves.png', xp:200, action:'🗺️ Compare the Maps'},
    {id:4,  title:'The Missing Island',            focus:"Sailors describe an island that only appears sometimes. Nobody agrees where it is. An old Farseer record insists it's real.", image:'assets/comics/arc8/ch04-the-missing-island.png', xp:200, action:'⚓ Ask the Sailors'},
    {id:5,  title:'Where the Sea Ends',            focus:"Crimson Tide follows the phenomenon to a region where the horizon itself looks wrong. The crew crosses the boundary — the sea continues beneath them, but the sky doesn't behave.", image:'assets/comics/arc8/ch05-where-the-sea-ends.png', xp:225, action:'🌊 Cross the Boundary'},
    {id:6,  title:'The Island That Remembers',     focus:"They find the missing island, apparently abandoned — yet someone was there recently, and the objects scattered across it come from wildly different periods of Veyren's history.", image:'assets/comics/arc8/ch06-the-island-that-remembers.png', xp:225, action:'🏝️ Search the Island'},
    {id:7,  title:'The Farseer Marker',            focus:"Erynn finds an ancient marker that predates Varel entirely. His family's history with these boundaries may run much further back than he ever knew.", image:'assets/comics/arc8/ch07-the-farseer-marker.png', xp:225, action:'🔎 Examine the Marker'},
    {id:8,  title:'Three Answers',                 focus:"Renn, Erynn, and Mimi each read the island differently — magical phenomenon, ancient boundary, or neither: Mimi wonders if the island isn't the one moving. Maybe Veyren is.", image:'assets/comics/arc8/ch08-three-answers.png', xp:250, action:'💭 Hear Them Out'},
    {id:9,  title:'The Old Camp',                  focus:"The crew finds a previous expedition's camp — journals, equipment, no people.", image:'assets/comics/arc8/ch09-the-old-camp.png', xp:200, action:'🏕️ Search the Camp'},
    {id:10, title:'The Last Entry',                 focus:"The surviving journal describes the earlier expedition reaching the island's centre — and never coming back. Crimson Tide has to decide whether to go further.", image:'assets/comics/arc8/ch10-the-last-entry.png', xp:225, action:'📖 Read the Journal'},
    {id:11, title:"San's Rule",                     focus:"San sets one rule before they continue: nobody gets left behind. The boundary is already proving it can separate people and show different crew members different versions of the same place.", image:'assets/comics/arc8/ch11-sans-rule.png', xp:250, action:'⚓ Set the Rule'},
    {id:12, title:"Joel's Compass",                 focus:"Separated from San, Joel's compass fails him. Instead of trying to understand the magic, he uses something simpler — the sound of the sea — and finds her anyway.", image:'assets/comics/arc8/ch12-joels-compass.png', xp:250, action:'🧭 Follow the Sound'},
    {id:13, title:'The Place Between Places',       focus:"At the island's centre, no treasure — an enormous ancient structure built around a magical boundary. Erynn recognizes its purpose immediately: it was built to observe.", image:'assets/comics/arc8/ch13-the-place-between-places.png', xp:250, action:'🏛️ Enter the Structure'},
    {id:14, title:'What They Were Watching',        focus:"Mimi realizes the structure wasn't watching the island — it was watching the boundaries around Veyren itself. The first glimpse of something that could eventually become their own research.", image:'assets/comics/arc8/ch14-what-they-were-watching.png', xp:250, action:'👁️ Study the Structure'},
    {id:15, title:'The Broken Observer',            focus:"Some of the structure still works. Renn wants to repair it. Erynn warns they don't know what it was built to observe. Mimi isn't comfortable activating it at all.", image:'assets/comics/arc8/ch15-the-broken-observer.png', xp:250, action:'⚙️ Weigh the Risk'},
    {id:16, title:"The Thing They Didn't Activate", focus:"The three deliberately choose not to activate it. They document it instead — the philosophy that will define their research going forward: understand first, build later.", image:'assets/comics/arc8/ch16-the-thing-they-didnt-activate.png', xp:275, action:'📜 Document It Instead'},
    {id:17, title:'The Island Disappears',          focus:"The boundary starts collapsing. Crimson Tide races to escape as the island fades behind them.", image:'assets/comics/arc8/ch17-the-island-disappears.png', xp:250, action:'🏃 Race to Escape'},
    {id:18, title:'What Came Back',                 focus:"Something returns with them — not a creature, not an object. A strange magical residue. For the first time, Mimi, Renn, and Erynn independently identify the exact same phenomenon, each in their own way.", image:'assets/comics/arc8/ch18-what-came-back.png', xp:275, action:'🔮 Examine the Residue'},
    {id:19, title:"The Record That Wasn't There",   focus:"Erynn searches the Farseer archives for a record he remembers clearly. The page is blank. Some boundaries, it turns out, may affect records and memory themselves.", image:'assets/comics/arc8/ch19-the-record-that-wasnt-there.png', xp:250, action:'📚 Search the Archives'},
    {id:20, title:'The Farseer Question',           focus:"Erynn starts questioning how much of Farseer history has actually survived intact. His family preserved knowledge for generations — but preservation was never the same thing as perfection.", image:'assets/comics/arc8/ch20-the-farseer-question.png', xp:250, action:'❓ Question the Records'},
    {id:21, title:"Renn's Idea",                    focus:"Renn proposes a new direction: instead of chasing every anomaly in person, build an instrument to observe them remotely. Not a weapon. Not a portal. An instrument.", image:'assets/comics/arc8/ch21-renns-idea.png', xp:275, action:'💡 Hear Renn Out'},
    {id:22, title:'Three Pieces',                   focus:"Renn, Erynn, and Mimi identify exactly what the project needs from each of them — and realize none of them can solve it alone. They still have nothing to actually build it with.", image:'assets/comics/arc8/ch22-three-pieces.png', xp:275, action:'🧩 Work the Problem'},
    {id:23, title:'The Name of the Horizon',        focus:"The three can't agree on a name. San hands the choice to Joel, who finally gives their research one: The Horizon Engine. Still only a research project — nothing built yet.", image:'assets/comics/arc8/ch23-the-name-of-the-horizon.png', xp:350, action:'🏮 Name the Project'},
    {id:24, title:'The First Material',             focus:"Renn identifies a material that might interact with the residue they brought home — nobody knows where to find enough of it, until Mimi has a vision. Something enormous, flying. A dragon.", image:'assets/comics/arc8/ch24-the-first-material.png', xp:550, action:'🐉 See the Vision'}
  ];
  window.ARC8_CHAPTERS = ARC8_CHAPTERS;

  window.arc8ObjectiveState = function(){
    if (!game.arc7Complete) return null;
    // Continues the +15-per-arc pace from Arc V (75) / VI (90) / VII (105).
    if (level() < 120) return null;
    game.comicProgress8 = game.comicProgress8 || {};
    for (const ch of ARC8_CHAPTERS) {
      if (!game.comicProgress8[ch.id]) return 'complete_arc8_chapter_' + ch.id;
    }
    return 'arc8_part1_complete_for_now';
  };

  // -------------------------------------------------------------------
  // Per-chapter story scenes — richer, multi-beat text matching the
  // actual narrative weight of each chapter (San's own fuller scripts),
  // rather than the condensed one-line `focus` summary used for the
  // chapter-list display. Keyed by id so chapters can be filled in as
  // their fuller text comes in; markArc8ChapterRead only pushes a modal
  // for chapters present here, and falls back to no modal (just the
  // existing toast) for anything not yet enriched.
  // -------------------------------------------------------------------
  const ARC8_CHAPTER_SCENES = {
    1: 'After the events of Arc VII, things seem normal again.<br><br>'+
       'But Renn notices that the magical readings around Fair Tide have changed. Not dramatically. Just enough that he knows something is different.<br><br>'+
       'Erynn checks the Farseer records. There is no matching event.<br><br>'+
       'Mimi has a different reaction: she says she can feel something looking back.',
    2: 'Renn discovers another strange doorway.<br><br>'+
       "Unlike the first one, this door isn't standing somewhere impossible. It's somewhere completely ordinary. That makes it more disturbing.<br><br>"+
       'The door appears only under certain magical conditions.<br><br>'+
       "Erynn recognises part of the markings. They're older than anything he found in the archives.",
    3: "Maps of the same region don't agree with each other. Roads that used to be there. Landmarks that have shifted, or vanished outright.<br><br>Renn's first instinct is that someone got the surveying wrong.<br><br>Erynn's is worse: maybe every map is correct. Just correct at a different time.",
    4: "Sailors talk about an island that only shows up sometimes — nobody agrees where, and most people insist it isn't real at all.<br><br>An old Farseer record says otherwise, plainly, like there's nothing strange about an island that comes and goes.",
    5: "They follow the phenomenon to a stretch of sea where the horizon itself looks wrong — not broken, just off, in a way nobody can quite name.<br><br>The crew crosses anyway. The sea keeps going beneath them. The sky stops behaving.",
    6: "The missing island is real, and it's right where the old accounts said it might be — abandoned, or close to it.<br><br>But someone's clearly been here recently. And the things scattered across it don't belong to one era. They're from all across Veyren's history, all at once, like the island's been collecting time instead of dust.",
    7: "Erynn finds another marker — older than anything Varel ever recorded.<br><br>His family's history with these boundaries doesn't start with Varel at all. It goes back further than Erynn ever knew, and further than anyone bothered to write down.",
    8: "Renn calls it a magical phenomenon. Erynn calls it an ancient boundary. Neither is wrong, exactly.<br><br>Mimi says something neither of them thought to consider: maybe the island isn't the thing that's moving.<br><br>Maybe Veyren is.",
    9: "They find the remains of an earlier expedition — journals, equipment, careful notes.<br><br>No people. Whoever came here before them didn't leave. They just... stopped.",
    10: "The surviving journal describes the previous expedition reaching the island's centre.<br><br>Then nothing. No more entries. They never made it back.<br><br>Crimson Tide has to decide, right there, whether to keep going anyway.",
    11: "San sets one rule before anyone takes another step: nobody gets left behind.<br><br>The boundary is already proving it can pull people apart — showing different crew members different versions of the exact same place, standing in the exact same spot.",
    12: "Joel gets separated from San, and his compass is no help at all — spinning, useless, pointing at nothing.<br><br>He doesn't try to out-think the magic. He just listens for the sea, the way he always has.<br><br>It's enough. He finds her.",
    13: "At the centre of the island, there's no treasure waiting for them.<br><br>There's a structure instead — enormous, ancient, built directly around a magical boundary.<br><br>Erynn doesn't need long to recognize what it was for. It was built to watch something.",
    14: "Mimi realizes the structure was never watching the island at all.<br><br>It was watching Veyren's boundaries themselves — all of them, or as many as whoever built this could reach.<br><br>For the first time, Renn's looking at something that resembles what their own research might eventually become. He has nowhere near enough to actually build it yet.",
    15: "Parts of the structure still work. Most don't.<br><br>Renn wants to fix what's broken and see what happens.<br><br>Erynn stops him — they don't actually know what this thing was built to observe, or why. Mimi doesn't want it activated at all. Not like this. Not yet.",
    16: "They choose not to turn it on.<br><br>Instead, they document everything they can about it and leave the rest alone.<br><br>It becomes the first real rule of their research, one they'll keep coming back to: understand first. Build later. Whatever the Horizon Engine eventually becomes, it won't be a copy of this.",
    17: "The boundary starts collapsing around them.<br><br>There's no time to debate it — they run for the ships, and the island fades out behind them as they go, like it was never fully there to begin with.",
    18: "Something comes back with them — not a creature, not an object. Something harder to name.<br><br>Mimi senses it before anyone says a word. Renn manages to actually measure it. Erynn recognizes its signature from an old Farseer reference he's read a dozen times before.<br><br>Three completely different ways of knowing. For the first time, all three of them land on exactly the same answer, independently, without comparing notes first.",
    19: "Erynn goes looking for a record he remembers clearly — he's read it before, more than once.<br><br>The page is blank.<br><br>Not missing. Not damaged. Blank, like it was always meant to be that way. Which raises a much worse question: what else might a boundary like this be capable of erasing?",
    20: "Erynn starts asking a question his family never really had to face before: how much of their own history has actually survived intact?<br><br>They preserved what they could, for generations. But preserving something and getting it exactly right were never the same thing.",
    21: "Renn proposes something different — instead of chasing every anomaly across every sea in person, build something that can watch them from a distance.<br><br>Not a weapon. Not a portal. An instrument. Something built to see further than any of them can sail.",
    22: "The three of them lay out exactly what the idea would need — Renn's engineering, Erynn's inherited knowledge of the boundaries, Mimi's read on what can't be measured directly.<br><br>None of them can do this alone. All three of them together, maybe. They still don't have anywhere near what they'd need to actually build it.",
    23: "The three of them can't agree on a name for what they're building. Renn wants something needlessly technical. Erynn shoots it down. Mimi offers an alternative neither of them likes any better.<br><br>San and Joel arrive partway through the argument. San decides she doesn't need to be the one to settle it. \"You three are building it,\" she says. \"You name it.\"<br><br>Renn appeals to the captain anyway. San just looks at Joel. \"You choose.\"<br><br>Joel thinks about what they're actually trying to do — not conquer another world, not tear open a door. Just see beyond the horizon.<br><br>\"The Horizon Engine,\" he says.<br><br>Nobody argues with that one. It's still only a research project. Nothing's actually been built yet.",
    24: "Renn identifies a material that might interact with the residue they brought back — he just has no idea where they'd actually find enough of it.<br><br>Erynn digs up an old reference that might help.<br><br>Mimi has a vision instead. Something enormous, flying, impossible to mistake for anything else.<br><br>\"You saw something, didn't you?\" Renn asks.<br><br>\"A dragon,\" Mimi says."
  };
  window.ARC8_CHAPTER_SCENES = ARC8_CHAPTER_SCENES;

  window.markArc8ChapterRead = function(id){
    id = Number(id);
    const ch = ARC8_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc8] no chapter data for id', id); return; }
    game.comicProgress8 = game.comicProgress8||{};
    if(game.comicProgress8[id]){ toast('✓ Already marked read.'); return; }
    if(window.arc8ObjectiveState() !== 'complete_arc8_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress8[id] = true;
    // Narratively load-bearing beats get a flag for later content to
    // check — no functional system attached to any of them yet.
    if (id === 11) game.sansRuleEstablished = true; // "nobody gets left behind"
    if (id === 18) game.arc8Residue = true; // the magical residue brought back from the island
    if (id === 23) game.horizonEngineNamed = true; // the research project has a name, nothing built yet
    if (id === 24) { game.arc8Complete = true; game.arc8DragonVisionSeen = true; }
    gainXP(ch.xp);
    game.reputation = (game.reputation||0) + (id === 24 ? 5 : 1);
    logEvent('📖 Arc 8 Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if (ARC8_CHAPTER_SCENES[id] && typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({ title: ch.title, blurb: ARC8_CHAPTER_SCENES[id] });
    }
    if(typeof saveGame==='function') saveGame();
    if(typeof renderMainGoal==='function') renderMainGoal();
    if(typeof renderStory==='function') renderStory();
  };

  window.__ctShowArc8Splash = function(){
    const overlay = document.getElementById('arc8SplashOverlay');
    if(!overlay) return;
    overlay.style.display='flex'; overlay.classList.add('active'); overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    window.scrollTo({top:0,left:0,behavior:'instant'});
    game.arc8SplashSeen = true;
    if(typeof saveGame==='function') saveGame();
  };
  window.__ctCloseArc8Splash = function(){
    const overlay = document.getElementById('arc8SplashOverlay');
    if(overlay){ overlay.style.display='none'; overlay.classList.remove('active'); overlay.setAttribute('aria-hidden','true'); }
    document.body.style.overflow='';
  };

  const oldRenderStoryForArc8 = window.renderStory;
  window.renderStory = function(){
    if(oldRenderStoryForArc8) oldRenderStoryForArc8();
    const container = document.getElementById('storyContent');
    if(!container) return;
    const arc8Ready = typeof window.arc8ObjectiveState==='function' && window.arc8ObjectiveState()!==null;
    if(arc8Ready && !game.arc8SplashSeen && typeof window.__ctShowArc8Splash==='function'){
      window.__ctShowArc8Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc8/arc8-cover-beyond-the-known-sea.png" alt="Arc VIII — Beyond the Known Sea" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc VIII</div><div class="story-act-title">Beyond the Known Sea</div>'+
      '<div class="story-act-tagline">Chapters 1-'+ARC8_CHAPTERS.length+' of 24. The world is larger than the map.</div></div>';
    if(!arc8Ready){
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc VIII Locked</div><div class="story-chapter-sub">'+
        (!game.arc7Complete ? 'Finish Arc VII first.' : 'Reach Level 120 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc8ObjectiveState();
    ARC8_CHAPTERS.forEach(ch=>{
      const done = !!game.comicProgress8?.[ch.id];
      const ready = !done && so===('complete_arc8_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if(ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
        '<button class="btn btn-small btn-success" onclick="markArc8ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if(so==='arc8_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc VIII chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };

  const oldRenderComicArchiveForArc8 = window.renderComicArchive;
  window.renderComicArchive = function(){
    if(oldRenderComicArchiveForArc8) oldRenderComicArchiveForArc8();
    const el = document.getElementById('comicArchive'); if(!el) return;
    const progress8 = (typeof game!=='undefined' && game.comicProgress8) || {};
    const arc8Read = ARC8_CHAPTERS.filter(ch=>!!progress8[ch.id]);
    const section = !arc8Read.length
      ? '<div class="comic-archive-card"><div class="comic-archive-sub">No Arc VIII chapters read yet.</div></div>'
      : arc8Read.map(ch=>'<div class="comic-archive-card"><div class="comic-archive-title">Chapter '+ch.id+' — '+esc(ch.title)+'</div>'+
          '<button class="btn btn-small" style="margin-top:6px;" onclick="openComicImage(\''+ch.image+'\')">📖 Read Again</button></div>').join('');
    el.insertAdjacentHTML('beforeend',
      '<div class="comic-archive-title" style="font-size:1.05rem;margin:18px 0 6px;">Arc VIII — Beyond the Known Sea</div>' + section);
  };
})();
