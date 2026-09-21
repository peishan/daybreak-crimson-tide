
(function(){
  // Arc 3 — Origins: "Steady Hands". Same pattern as Arc 2: full finished
  // pages, dialogue baked in, open in a new tab + Mark Chapter Read. Only
  // Chapters 1-15 exist so far — more are coming later, so this array is
  // built to extend cleanly: adding a chapter later is just appending an
  // entry, same as Arc 2's design. No chapter here carries a mechanical
  // gate (no fight/level requirement) — Arc 3 is explicitly a calmer,
  // character-focused arc ("Origins"), unlike Arc 2's one real battle
  // chapter, so pure sequential reads fit its tone.
  const ARC3_CHAPTERS = [
    {id:1,  title:'The Night at the Tavern',   focus:'Sometimes the journey brings you exactly where you\'re meant to be.', image:'assets/comics/arc3/ch01-the-night-at-the-tavern.png',   xp:150},
    {id:2,  title:'What Are We?',               focus:'Same crew. A different kind of conversation.',                       image:'assets/comics/arc3/ch02-what-are-we.png',                xp:150},
    {id:3,  title:'Familiar',                    focus:'Some feelings don\'t need a memory to be real.',                     image:'assets/comics/arc3/ch03-familiar.png',                   xp:150},
    {id:4,  title:'The First Encounter',         focus:'Not every battle is against the world.',                            image:'assets/comics/arc3/ch04-the-first-encounter.png',       xp:150},
    {id:5,  title:'Together in Battle',          focus:'Different strengths. The same direction.',                          image:'assets/comics/arc3/ch05-together-in-battle.png',        xp:150},
    {id:6,  title:'First Mate',                  focus:'Different roles. The same direction.',                              image:'assets/comics/arc3/ch06-first-mate.png',                 xp:150},
    {id:7,  title:'The Middle Sister',           focus:'Some distances can be crossed. If both sides are willing.',         image:'assets/comics/arc3/ch07-the-middle-sister.png',          xp:150},
    {id:8,  title:'What We Don\'t Remember',     focus:'Some things are lost, but we\'re still here.',                       image:'assets/comics/arc3/ch08-what-we-dont-remember.png',      xp:150},
    {id:9,  title:'The Men at the Port',         focus:'Some attention is easy to ignore. Some are not.',                   image:'assets/comics/arc3/ch09-the-men-at-the-port.png',        xp:150},
    {id:10, title:'Closer',                      focus:'Sometimes the quietest feelings bring us the closest.',             image:'assets/comics/arc3/ch10-closer.png',                     xp:150},
    {id:11, title:'You Said I Could',            focus:'Some promises don\'t need to be loud. They just need to be real.',   image:'assets/comics/arc3/ch11-you-said-i-could.png',           xp:150},
    {id:12, title:'Us',                          focus:'Now we know what we are. And that\'s enough.',                      image:'assets/comics/arc3/ch12-us.png',                         xp:150},
    {id:13, title:'Steady Hands',                focus:'Calmer days. Rougher days. It doesn\'t matter. Same crew.',          image:'assets/comics/arc3/ch13-steady-hands.png',               xp:175},
    {id:14, title:'The Things We Don\'t Say',    focus:'Some things are understood. Some are chosen.',                      image:'assets/comics/arc3/ch14-the-things-we-dont-say.png',    xp:150},
    {id:15, title:'What We Carry',               focus:'Different burdens. The same crew.',                                 image:'assets/comics/arc3/ch15-what-we-carry.png',             xp:175},
    {id:16, title:'The Fight We Remember',       focus:'Not because we lost — but because we remember.',                    image:'assets/comics/arc3/ch16-the-fight-we-remember.png',    xp:175},
    {id:17, title:'Captain and First Mate',      focus:'A captain to choose the path. A first mate to stand beside it.',    image:'assets/comics/arc3/ch17-captain-and-first-mate.png',   xp:150},
    {id:18, title:'The Memory We Leave Behind',  focus:'It\'s also about what we leave in the places we\'ve been.',          image:'assets/comics/arc3/ch18-the-memory-we-leave-behind.png', xp:150},
    {id:19, title:'Something Beneath the Familiar', focus:'Sometimes the unknown lies beneath the places we thought we knew.', image:'assets/comics/arc3/ch19-something-beneath-the-familiar.png', xp:175},
    {id:20, title:'Neither Without the Other',   focus:'We are strong because we are different. Neither without the other.', image:'assets/comics/arc3/ch20-neither-without-the-other.png', xp:175},
    {id:21, title:'The Choice We Made',          focus:'Not by chance. But by choice.',                                      image:'assets/comics/arc3/ch21-the-choice-we-made.png',        xp:175}
  ];
  window.ARC3_CHAPTERS = ARC3_CHAPTERS;

  // Arc 3 unlocks once Arc 2 is fully finished. Terminal state deliberately
  // distinct from a generic "complete" — more chapters are coming later, so
  // this signals "everything currently available is read" without implying
  // the whole arc (or game) is finished, which would be wrong right now.
  window.arc3ObjectiveState = function(){
    if(typeof window.arc2ObjectiveState!=='function' || window.arc2ObjectiveState()!=='arc2_complete') return null;
    game.comicProgress3 = game.comicProgress3||{};
    for(const ch of ARC3_CHAPTERS){
      if(!game.comicProgress3[ch.id]) return 'complete_arc3_chapter_'+ch.id;
    }
    // Chapters 22-26: the five memory-encounter chapters. These complete via
    // winning the corresponding fight (game.act3Index, the same real
    // progression variable Act IV's own unlock condition already depends
    // on), not via markArc3ChapterRead — so they're checked separately here,
    // continuing the same chapter sequence past 21 rather than stopping.
    if((game.act3Index||0) < ACT3_CHAPTERS.length){
      const ch = ACT3_CHAPTERS[game.act3Index||0];
      return 'complete_arc3_chapter_'+ch.id;
    }
    return 'arc3_chapters_complete_for_now';
  };

  window.markArc3ChapterRead = function(id){
    id = Number(id);
    const ch = ARC3_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc3] no chapter data for id', id); return; }
    game.comicProgress3 = game.comicProgress3||{};
    if(game.comicProgress3[id]){ toast('✓ Already marked read.'); return; }
    const state = window.arc3ObjectiveState();
    if(state !== 'complete_arc3_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress3[id] = true;
    gainXP(ch.xp);
    game.reputation = (game.reputation||0)+1;
    logEvent('📖 Arc 3 Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if(typeof saveGame==='function') saveGame();
    if(typeof renderMainGoal==='function') renderMainGoal();
    if(typeof renderStory==='function') renderStory();
  };

  window.__ctShowArc3Splash = function(){
    const overlay = document.getElementById('arc3SplashOverlay');
    if(!overlay) return;
    overlay.style.display='flex';
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    window.scrollTo({top:0,left:0,behavior:'instant'});
    game.arc3SplashSeen = true;
    if(typeof saveGame==='function') saveGame();
  };
  window.__ctCloseArc3Splash = function(){
    const overlay = document.getElementById('arc3SplashOverlay');
    if(overlay){
      overlay.style.display='none';
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden','true');
    }
    document.body.style.overflow='';
  };

  // Append an Arc III section to the Story screen, right after Arc II's.
  const oldRenderStoryForArc3 = window.renderStory;
  window.renderStory = function(){
    if(oldRenderStoryForArc3) oldRenderStoryForArc3();
    const container = document.getElementById('storyContent');
    if(!container) return;
    const arc2Done = typeof window.arc2ObjectiveState==='function' && window.arc2ObjectiveState()==='arc2_complete';
    // First Story-screen render after Arc II is truly finished shows the
    // Arc III splash once — same reasoning as Arc II's splash: checked here
    // rather than tied to the exact completion moment, so it also catches
    // saves that finished Arc II before this feature existed, and never
    // stacks on top of another overlay that's still closing.
    if(arc2Done && !game.arc3SplashSeen && typeof window.__ctShowArc3Splash==='function'){
      window.__ctShowArc3Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc3/arc3-cover-steady-hands.png" alt="Arc III — Origins: Steady Hands" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc III — Origins</div><div class="story-act-title">Steady Hands</div>'+
      '<div class="story-act-tagline">26 chapters so far. Calmer days, rougher days — the same crew.</div></div>';
    if(!arc2Done){
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc III Locked</div><div class="story-chapter-sub">Finish all of Arc II first.</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc3ObjectiveState();
    ARC3_CHAPTERS.forEach(ch=>{
      const done = !!game.comicProgress3?.[ch.id];
      const ready = !done && so===('complete_arc3_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if(ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
        '<button class="btn btn-small btn-success" onclick="markArc3ChapterRead('+ch.id+')">✓ Mark Chapter Read</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    // Chapters 22-26 — memory encounters. Same visual card, but "reading"
    // requires winning the linked fight first (startMemoryFight(), already
    // wired to the existing combat engine and reward/prose system) rather
    // than a simple Mark Read button.
    ACT3_CHAPTERS.forEach((ch,i)=>{
      const done = (game.act3Index||0) > i;
      const ready = !done && so===('complete_arc3_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      const names = (ch.companions || [ch.companion]).map(id=>{
        const m = (typeof ALL_PARTY!=='undefined') ? ALL_PARTY.find(x=>x.id===id) : null;
        return m ? m.name : id;
      }).join(' & ');
      let action;
      if(done) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button>';
      else if(ready) action = '<button class="btn btn-small btn-magic" onclick="startMemoryFight()">⚔️ Walk the Old Streets Together</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':'')+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">👤 '+esc(names)+' · 📍 '+esc(ch.location)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+(ch.rw&&ch.rw.xp||0)+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if(so==='arc3_chapters_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc III chapters read. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };

  // Extend the back-reading archive (landing page "Comic Chapters") to
  // include Arc III, same "Read Again" pattern as Arc I and Arc II.
  const oldRenderComicArchiveForArc3 = window.renderComicArchive;
  window.renderComicArchive = function(){
    if(oldRenderComicArchiveForArc3) oldRenderComicArchiveForArc3();
    const el = document.getElementById('comicArchive'); if(!el) return;
    const progress3 = (typeof game!=='undefined' && game.comicProgress3) || {};
    const arc3Read = ARC3_CHAPTERS.filter(ch=>!!progress3[ch.id]);
    // Memory-encounter chapters (22-26) completed via game.act3Index rather
    // than comicProgress3, since they finish by winning a fight, not by
    // markArc3ChapterRead — same reasoning as the Story-screen renderer.
    const memoryRead = ACT3_CHAPTERS.filter((ch,i)=>(game.act3Index||0) > i);
    const allRead = arc3Read.concat(memoryRead);
    const section = !allRead.length
      ? '<div class="comic-archive-card"><div class="comic-archive-sub">No Arc III chapters read yet.</div></div>'
      : allRead.map(ch=>'<div class="comic-archive-card"><div class="comic-archive-title">Chapter '+ch.id+' — '+esc(ch.title)+'</div>'+
          '<button class="btn btn-small" style="margin-top:6px;" onclick="openComicImage(\''+ch.image+'\')">📖 Read Again</button></div>').join('');
    el.insertAdjacentHTML('beforeend',
      '<div class="comic-archive-title" style="font-size:1.05rem;margin:18px 0 6px;">Arc III — Origins: Steady Hands</div>' + section);
  };
})();
