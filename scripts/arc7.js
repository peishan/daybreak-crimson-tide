
(function(){
  // -------------------------------------------------------------------
  // ARC VII — "The Farseer". Gated behind game.arc6Complete (the flag Arc
  // VI's Ch.24 sets) + level 105, continuing the +15-per-arc pace from
  // Arc IV (60) / V (75) / VI (90). Ch.23 ("The Farseer Who Stayed")
  // recruits Erynn into full combat — see ARC7_RECRUITS below.
  // -------------------------------------------------------------------
  const ARC7_CHAPTERS = [
    {id:1,  title:'The Door Renn Found',        focus:'Renn discovers a strange door that should not exist — the compass fails, the sea feels wrong, and the crew passes through into somewhere unfamiliar.', image:'assets/comics/arc7/ch01-the-door-renn-found.png',        xp:200},
    {id:2,  title:'A World Without a Name',     focus:"The crew knows their ports, their routes, Fair Tide, the sea — but nobody ever asked what the world itself was called. The locals call it Veyren.", image:'assets/comics/arc7/ch02-a-world-without-a-name.png',      xp:175},
    {id:3,  title:'The Man Who Knows the Door', focus:'The crew meets Erynn Farseer, investigating the same phenomenon. Cautious at first — but he and Renn are already asking the same questions.',       image:'assets/comics/arc7/ch03-the-man-who-knows-the-door.png',  xp:175},
    {id:4,  title:'Erynn Farseer',              focus:'Erynn introduces himself properly — heir to generations of Farseers who documented what refuses to behave like ordinary magic.',                    image:'assets/comics/arc7/ch04-erynn-farseer.png',                xp:200},
    {id:5,  title:'The Name of the World',      focus:'Erynn confirms it: Veyren. Ordinary to everyone else. For San, the moment the crew realizes they live inside a world with its own history.',        image:'assets/comics/arc7/ch05-the-name-of-the-world.png',        xp:200},
    {id:6,  title:'Varel',                      focus:'Erynn tells the crew about Varel Farseer — a scholar who documented magical boundaries and impossible geography, not an all-knowing legend.',       image:'assets/comics/arc7/ch06-varel.png',                        xp:175},
    {id:7,  title:'Tenn',                       focus:"The generation after Varel preserved, studied, and challenged his work. Farseer knowledge isn't static — each generation interprets it differently.", image:'assets/comics/arc7/ch07-tenn.png',                         xp:175},
    {id:8,  title:'The Farseer Archives',       focus:"Renn gains access to the archives — some of his own findings overlap with them, some don't. The Farseers don't have every answer.",                  image:'assets/comics/arc7/ch08-the-farseer-archives.png',         xp:200},
    {id:9,  title:'The Woman in the Painting',  focus:'Erynn meets Mimi and recognizes her instantly — a painting of a Diviner named Mimi, generations old, uncanny in its resemblance. A distinct person, still.', image:'assets/comics/arc7/ch09-the-woman-in-the-painting.png', xp:250},
    {id:10, title:'Three Ways of Knowing',      focus:'Renn (experimentation), Erynn (inherited knowledge), and Mimi (divination) start working together — none sufficient alone, all three needed.',       image:'assets/comics/arc7/ch10-three-ways-of-knowing.png',        xp:250},
    {id:11, title:'The Sea That Turns Back',    focus:'A region where ships return to where they started no matter how far they sail — Erynn recognizes it from a Farseer account.',                       image:'assets/comics/arc7/ch11-the-sea-that-turns-back.png',      xp:200},
    {id:12, title:'Beyond the Boundary',        focus:'The crew deliberately enters the strange region and learns some boundaries in Veyren affect distance, direction, and perception itself.',            image:'assets/comics/arc7/ch12-beyond-the-boundary.png',          xp:200},
    {id:13, title:"What Varel Couldn't Explain",focus:"Varel documented this same phenomenon once — and never solved it. The Farseers inherited knowledge, not omniscience.",                                image:'assets/comics/arc7/ch13-what-varel-couldnt-explain.png',   xp:200},
    {id:14, title:"Renn's Theory",              focus:"Renn proposes an explanation, Erynn disagrees with part of it, and Mimi notices something neither considered — together, stronger than any one alone.", image:'assets/comics/arc7/ch14-renns-theory.png',                xp:225},
    {id:15, title:"Erynn's Burden",             focus:'His family expects him to preserve their knowledge. He wants to discover something himself — and Renn gives him that chance.',                       image:'assets/comics/arc7/ch15-erynns-burden.png',                xp:200},
    {id:16, title:'The Two Researchers',        focus:"Renn and Erynn get themselves into serious trouble chasing an anomaly. Joel retrieves them. San isn't impressed. They're delighted.",                image:'assets/comics/arc7/ch16-the-two-researchers.png',          xp:225},
    {id:17, title:'Fair Tide',                  focus:'Erynn visits Fair Tide and sees what San has built — history preserved as people and community, not just records and archives.',                    image:'assets/comics/arc7/ch17-fair-tide.png',                    xp:200},
    {id:18, title:'What Survives',              focus:"San and Erynn talk about memory — how things survive even when people don't remember everything. Ties gently back to Arc III without reopening it.", image:'assets/comics/arc7/ch18-what-survives.png',                xp:225},
    {id:19, title:'The Old Marker',             focus:'The crew finds an ancient Farseer marker, deliberately placed, far from any known route. Even the records don\'t fully explain why it\'s there.',    image:'assets/comics/arc7/ch19-the-old-marker.png',               xp:225},
    {id:20, title:'The Door Again',             focus:"The marker reacts to Renn's original door. Something connects them — but not who made it, or why.",                                                  image:'assets/comics/arc7/ch20-the-door-again.png',               xp:250},
    {id:21, title:"Varel's Warning",            focus:"The oldest surviving record isn't an explanation. It's a warning — some boundaries may exist for a reason.",                                        image:'assets/comics/arc7/ch21-varels-warning.png',               xp:250},
    {id:22, title:"Don't Open It",              focus:"Renn and Erynn want to investigate further. Mimi says no. San sides with her. Not every mystery needs opening immediately.",                        image:'assets/comics/arc7/ch22-dont-open-it.png',                 xp:250},
    {id:23, title:'The Farseer Who Stayed',     focus:'Erynn spends more time at Fair Tide, working with Renn, Mimi, and the crew — no longer just someone they met investigating a door. He stays.',        image:'assets/comics/arc7/ch23-the-farseer-who-stayed.png',       xp:350},
    {id:24, title:'Veyren',                     focus:'San looks across the horizon, knowing the world\'s name now, its history, its older mysteries — and that three very different people have started asking new ones.', image:'assets/comics/arc7/ch24-veyren.png', xp:550}
  ];
  window.ARC7_CHAPTERS = ARC7_CHAPTERS;

  window.arc7ObjectiveState = function(){
    if (!game.arc6Complete) return null;
    // Continues the +15-per-arc pace from Arc IV (60) / V (75) / VI (90).
    if (level() < 105) return null;
    game.comicProgress7 = game.comicProgress7 || {};
    for (const ch of ARC7_CHAPTERS) {
      if (!game.comicProgress7[ch.id]) return 'complete_arc7_chapter_' + ch.id;
    }
    return 'arc7_part1_complete_for_now';
  };

  // Erynn joins full combat the moment Ch.23 ("The Farseer Who Stayed") is
  // marked read — same recruitment mechanism as every companion since Arc
  // IV (game.foundCompanions + an ALL_PARTY entry already in place).
  const ARC7_RECRUITS = {
    23: {type:'combat', id:'erynn'}
  };

  const ARC7_CHAPTER_SCENES = {
    1: "Renn's compass stops working first.<br><br>Then the sea itself feels wrong — the water moves, but not quite the way water should.<br><br>Nobody planned to sail through a door. Nobody even agreed there was one to sail through. But the crew crosses it anyway, and the world on the other side is unfamiliar in ways none of them have words for yet.",
    2: "They know their ports. Their routes. Fair Tide, the reefs, the trade winds.<br><br>Nobody ever thought to ask what the world itself was called.<br><br>The locals answer without hesitation, the way you'd answer someone asking the name of the sky: Veyren.",
    3: "They're not the only ones investigating the phenomenon.<br><br>A man introduces himself carefully, watching them the way you watch something you're not sure is a threat yet.<br><br>His name is Erynn Farseer. He and Renn are already circling the same questions — cautious of each other, and unable to stop comparing notes anyway.",
    4: "Erynn explains properly this time.<br><br>Generations of his family have documented places and moments that refuse to behave like ordinary magic — boundaries, anomalies, doors that shouldn't exist. He's not a wizard. He's an heir to other people's careful, patient records.<br><br>Renn recognizes something of himself in that.",
    5: "\"Veyren,\" Erynn says again, like it's the most ordinary word in the world. To him, it is.<br><br>For San, it's something else entirely — the moment it stops being just ports and routes and becomes a whole world, with its own history, sitting quietly under everything she thought she already knew.",
    6: "Erynn tells them about Varel Farseer — the first of his line to seriously study magical boundaries and impossible geography.<br><br>Not a legend. Not someone who had all the answers. Just a scholar who wrote down what he saw, carefully, and left the rest for whoever came after him to figure out.",
    7: "The generation after Varel didn't just preserve his work. They studied it, argued with it, found the places where he'd guessed wrong.<br><br>Erynn is careful to make that clear: Farseer knowledge isn't a single unbroken truth handed down. It's an argument that's been running for generations, and everyone in it disagreed with someone.",
    8: "Renn finally gets access to the actual archives.<br><br>Some of it lines up with what he's already found on his own. Some of it doesn't — contradicts it outright, in places. It's oddly reassuring. The Farseers don't have every answer either. Nobody does. That just means there's more worth finding.",
    9: "Erynn meets Mimi and goes very quiet.<br><br>There's a painting in the Farseer archives — a Diviner, generations old, and it could be her. Not a resemblance. Her.<br><br>Mimi doesn't know what to make of it either. Whatever this means, she's careful to make one thing clear: whoever that woman was, she isn't. Not exactly.",
    10: "Renn tests things. Erynn remembers things. Mimi feels things nobody else notices.<br><br>None of it is enough on its own — Renn's experiments hit walls Erynn's records could have warned him about, and Erynn's records have gaps only Mimi's instincts seem to fill.<br><br>Separately, they're stuck. Together, for the first time, they're actually getting somewhere.",
    11: "Sailors describe a stretch of sea where ships turn back to where they started, no matter which way they sail.<br><br>Erynn's seen an account of it before — an old Farseer record, half-forgotten, describing the exact same thing in words nobody quite believed until now.",
    12: "They sail in anyway.<br><br>What they learn: some of Veyren's boundaries don't just block a path. They bend distance itself, and direction, and — more unsettling — what a person actually perceives while they're inside it. Nobody in the crew agrees on exactly what they saw.",
    13: "Erynn finds Varel's own account of the same place — written generations ago, ending without an answer.<br><br>He never solved it either.<br><br>It's the clearest reminder yet: the Farseers inherited a body of careful observation, not a book of finished answers. Some questions just get handed down, unsolved, from one generation to the next.",
    14: "Renn has an explanation. Erynn immediately disagrees with half of it.<br><br>Mimi says nothing for a while, then points out something neither of them considered — not a rebuttal, just a piece that was missing from both their arguments.<br><br>None of them are fully right alone. Together, the theory actually holds.",
    15: "His family expects him to preserve what they've already learned, carefully, the way every Farseer before him has.<br><br>Erynn wants something else — to actually discover something himself, not just protect what's already been written down.<br><br>Renn, without really meaning to make it a big moment, just gives him the chance.",
    16: "Renn and Erynn chase an anomaly a little too far and end up somewhere they can't get themselves out of.<br><br>Joel retrieves them, says almost nothing about it, and looks deeply unimpressed the entire time.<br><br>San is not amused. Renn and Erynn, muddy and delighted, clearly regret nothing.",
    17: "Erynn finally sees what San's actually built.<br><br>He's spent his whole life around archives and careful records of what mattered once. Fair Tide is something else — history kept alive as people, not just documents. He doesn't say much about it. He doesn't have to.",
    18: "San and Erynn end up talking about memory — how something can survive even when nobody fully remembers it anymore.<br><br>It brushes up gently against everything San went through finding her own past, without reopening any of it. Some things don't need reexamining to still matter.",
    19: "Far from any route anyone actually sails, the crew finds an old Farseer marker — placed there deliberately, a long time ago, for reasons even Erynn's own records don't fully explain.",
    20: "The marker reacts to Renn's original door — some kind of connection between them, real and unmistakable.<br><br>Nobody can say who built either one, or why they're linked. Just that they are.",
    21: "The oldest surviving Farseer record on this isn't an explanation at all.<br><br>It's a warning.<br><br>Some boundaries, Varel wrote, might exist for a reason — and not every mystery is owed an answer just because someone's curious enough to go looking for one.",
    22: "Renn wants to keep investigating. Erynn agrees with him.<br><br>Mimi says no.<br><br>San sides with her without much debate. Not every door needs opening the moment you find it — and for once, the three of them let the question sit unanswered.",
    23: "Erynn keeps coming back to Fair Tide. Working alongside Renn and Mimi. Getting to know the rest of the crew, not as people he met while investigating something strange, but as people he actually knows now.<br><br>Nobody makes a formal announcement of it. He just doesn't leave.",
    24: "San looks out at the horizon, and it looks different now — not because anything's physically changed, but because she knows what to call it.<br><br>A world. A history. Older mysteries than she expected, and three very different people who've only just started asking new questions about all of it."
  };
  window.ARC7_CHAPTER_SCENES = ARC7_CHAPTER_SCENES;

  window.markArc7ChapterRead = function(id){
    id = Number(id);
    const ch = ARC7_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc7] no chapter data for id', id); return; }
    game.comicProgress7 = game.comicProgress7||{};
    if(game.comicProgress7[id]){ toast('✓ Already marked read.'); return; }
    if(window.arc7ObjectiveState() !== 'complete_arc7_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress7[id] = true;
    if (id === 24) game.arc7Complete = true;
    gainXP(ch.xp);
    game.reputation = (game.reputation||0) + (id === 24 ? 5 : 1);
    logEvent('📖 Arc 7 Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if (ARC7_CHAPTER_SCENES[id] && typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({ title: ch.title, blurb: ARC7_CHAPTER_SCENES[id] });
    }
    const recruit = ARC7_RECRUITS[id];
    if(recruit && recruit.type==='combat' && !game.foundCompanions?.[recruit.id]){
      game.foundCompanions = game.foundCompanions||{};
      game.foundCompanions[recruit.id] = true;
      const member = (typeof ALL_PARTY!=='undefined') ? ALL_PARTY.find(m=>m.id===recruit.id) : null;
      const label = member ? member.name : recruit.id;
      logEvent('⚓ '+label+' has joined the crew!', 'gold');
      toast('⚓ '+label+' has joined the crew!', 3600);
    }
    if(typeof saveGame==='function') saveGame();
    if(typeof renderMainGoal==='function') renderMainGoal();
    if(typeof renderStory==='function') renderStory();
  };

  window.__ctShowArc7Splash = function(){
    const overlay = document.getElementById('arc7SplashOverlay');
    if(!overlay) return;
    overlay.style.display='flex'; overlay.classList.add('active'); overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    window.scrollTo({top:0,left:0,behavior:'instant'});
    game.arc7SplashSeen = true;
    if(typeof saveGame==='function') saveGame();
  };
  window.__ctCloseArc7Splash = function(){
    const overlay = document.getElementById('arc7SplashOverlay');
    if(overlay){ overlay.style.display='none'; overlay.classList.remove('active'); overlay.setAttribute('aria-hidden','true'); }
    document.body.style.overflow='';
  };

  const oldRenderStoryForArc7 = window.renderStory;
  window.renderStory = function(){
    if(oldRenderStoryForArc7) oldRenderStoryForArc7();
    const container = document.getElementById('storyContent');
    if(!container) return;
    const arc7Ready = typeof window.arc7ObjectiveState==='function' && window.arc7ObjectiveState()!==null;
    if(arc7Ready && !game.arc7SplashSeen && typeof window.__ctShowArc7Splash==='function'){
      window.__ctShowArc7Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc7/arc7-cover-the-farseer.png" alt="Arc VII — The Farseer" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc VII</div><div class="story-act-title">The Farseer</div>'+
      '<div class="story-act-tagline">Chapters 1-'+ARC7_CHAPTERS.length+' of 24. Some knowledge survives generations.</div></div>';
    if(!arc7Ready){
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc VII Locked</div><div class="story-chapter-sub">'+
        (!game.arc6Complete ? 'Finish Arc VI first.' : 'Reach Level 105 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc7ObjectiveState();
    ARC7_CHAPTERS.forEach(ch=>{
      const done = !!game.comicProgress7?.[ch.id];
      const ready = !done && so===('complete_arc7_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if(ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
        '<button class="btn btn-small btn-success" onclick="markArc7ChapterRead('+ch.id+')">✓ Mark Chapter Read</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if(so==='arc7_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc VII chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };

  const oldRenderComicArchiveForArc7 = window.renderComicArchive;
  window.renderComicArchive = function(){
    if(oldRenderComicArchiveForArc7) oldRenderComicArchiveForArc7();
    const el = document.getElementById('comicArchive'); if(!el) return;
    const progress7 = (typeof game!=='undefined' && game.comicProgress7) || {};
    const arc7Read = ARC7_CHAPTERS.filter(ch=>!!progress7[ch.id]);
    const section = !arc7Read.length
      ? '<div class="comic-archive-card"><div class="comic-archive-sub">No Arc VII chapters read yet.</div></div>'
      : arc7Read.map(ch=>'<div class="comic-archive-card"><div class="comic-archive-title">Chapter '+ch.id+' — '+esc(ch.title)+'</div>'+
          '<button class="btn btn-small" style="margin-top:6px;" onclick="openComicImage(\''+ch.image+'\')">📖 Read Again</button></div>').join('');
    el.insertAdjacentHTML('beforeend',
      '<div class="comic-archive-title" style="font-size:1.05rem;margin:18px 0 6px;">Arc VII — The Farseer</div>' + section);
  };
})();
