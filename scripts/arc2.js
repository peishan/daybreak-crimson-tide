
(function(){
  // Arc 2 chapters are full finished pages (dialogue baked into the art).
  // Per direction: no in-game panel viewer for these (that stays Arc 1-only)
  // — each chapter opens in a new browser tab to read, then the player taps
  // a separate "Mark Chapter Read" action to bank the Story XP. This also
  // sidesteps the mobile-zoom tradeoff entirely: the browser's own tab
  // handles pinch-zoom/pan on the full-resolution image natively.
  const ARC2_CHAPTERS = [
    {id:1,  title:'The First Quiet Sea',              focus:'Leaving the events of Arc 1 behind',                    image:'assets/comics/arc2/ch01-the-first-quiet-sea.png',              xp:150},
    {id:2,  title:'Something Beneath Us',              focus:'First hint of something following the ship',            image:'assets/comics/arc2/ch02-something-beneath-us.png',             xp:150},
    {id:3,  title:"The Lookout's Warning",             focus:'Senedra spots the mysterious vessel',                    image:'assets/comics/arc2/ch03-the-lookouts-warning.png',             xp:150},
    {id:4,  title:"The Ship That Shouldn't Be There",  focus:'The ghost ship approaches',                              image:'assets/comics/arc2/ch04-the-ship-that-shouldnt-be-there.png',  xp:150},
    {id:5,  title:'The Ghost Ship',                    focus:'Crew investigates the abandoned vessel',                 image:'assets/comics/arc2/ch05-the-ghost-ship.png',                    xp:150},
    {id:6,  title:'Names in the Ledger',                focus:"Aisyah discovers the old records",                       image:'assets/comics/arc2/ch06-names-in-the-ledger.png',              xp:150},
    {id:7,  title:'Soel Hears the Dead',                focus:"Soel's spiritual abilities become important",           image:'assets/comics/arc2/ch07-soel-hears-the-dead.png',              xp:150},
    {id:8,  title:'The Storm That Answers',             focus:'Mezstorm senses something within the storm',            image:'assets/comics/arc2/ch08-the-storm-that-answers.png',           xp:150},
    {id:9,  title:'Two Forms, One Storm',               focus:"Mezstorm learns to work with her transformation",       image:'assets/comics/arc2/ch09-two-forms-one-storm.png',              xp:150},
    {id:10, title:'The Sea Monster',                    focus:'First major Arc 2 battle',                               image:'assets/comics/arc2/ch10-the-sea-monster.png',                  xp:200,
     gate:{type:'sail', label:'Set sail — the monster rises somewhere out there.'}},
    {id:11, title:'The Thing It Was Guarding',          focus:'The crew discovers what the monster protected',         image:'assets/comics/arc2/ch11-the-thing-it-was-guarding.png',       xp:175},
    {id:12, title:'A Map Without a Destination',        focus:'A mysterious maritime map is found',                     image:'assets/comics/arc2/ch12-a-map-without-a-destination.png',    xp:150},
    {id:13, title:"A Captain's Decision",               focus:'San decides whether to follow it',                       image:'assets/comics/arc2/ch13-a-captains-decision.png',            xp:150},
    {id:14, title:'A Quiet Milestone',                  focus:'Fifty levels past the beginning',                        image:'assets/comics/arc2/ch14-a-quiet-milestone.png',               xp:250,
     gate:{type:'level', value:50, label:'Reach level 50 to reflect on how far the crew has come.'}}
  ];
  window.ARC2_CHAPTERS = ARC2_CHAPTERS;

  // Linear, single-source-of-truth gating — the exact structure that would
  // have prevented every Arc 1 orphaned-chapter bug. Two chapters carry an
  // extra real-world condition on top of "previous chapter done":
  //  - Ch10 needs an actual Sail action first (the monster meets you at sea,
  //    not the instant you finish Ch9 — chosen over a scripted fight to keep
  //    this addition low-risk; a real encounter can replace this later).
  //  - Ch14 needs character level 50, matching what the chapter is literally
  //    about ("fifty levels past the beginning").
  // Every other chapter is intentionally left as a pure sequential read,
  // matching Crimson Tide's lighter-weight design — forcing a busywork
  // action into chapters that are purely reflective/dialogue beats would add
  // friction without adding anything the story asks for.
  window.arc2ObjectiveState = function(){
    if(typeof objectiveState!=='function' || objectiveState()!=='continue_voyage') return null;
    game.comicProgress2 = game.comicProgress2||{};
    for(const ch of ARC2_CHAPTERS){
      if(game.comicProgress2[ch.id]) continue;
      if(ch.gate){
        if(ch.gate.type==='sail' && !game.arc2Ch10SailFlag) return 'arc2_gate_sail_'+ch.id;
        if(ch.gate.type==='level' && level()<ch.gate.value) return 'arc2_gate_level_'+ch.id;
      }
      return 'complete_arc2_chapter_'+ch.id;
    }
    return 'arc2_complete';
  };

  // Hook doVoyage so setting sail while Chapter 10's gate is pending flips
  // the flag. Only sets it while that specific gate is active, so earlier or
  // later voyages don't accidentally pre-satisfy it.
  const oldDoVoyageForArc2 = window.doVoyage;
  window.doVoyage = function(){
    if(typeof window.arc2ObjectiveState==='function' && window.arc2ObjectiveState()==='arc2_gate_sail_10'){
      game.arc2Ch10SailFlag = true;
    }
    return oldDoVoyageForArc2.apply(this, arguments);
  };

  window.__ctShowArc2Splash = function(){
    const overlay = document.getElementById('arc2SplashOverlay');
    if(!overlay) return;
    overlay.style.display='flex';
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    window.scrollTo({top:0,left:0,behavior:'instant'});
    game.arc2SplashSeen = true;
    if(typeof saveGame==='function') saveGame();
  };
  window.__ctCloseArc2Splash = function(){
    const overlay = document.getElementById('arc2SplashOverlay');
    if(overlay){
      overlay.style.display='none';
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden','true');
    }
    document.body.style.overflow='';
  };

  window.markArc2ChapterRead = function(id){
    id = Number(id);
    const ch = ARC2_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc2] no chapter data for id', id); return; }
    game.comicProgress2 = game.comicProgress2||{};
    if(game.comicProgress2[id]){ toast('✓ Already marked read.'); return; }
    const state = window.arc2ObjectiveState();
    if(state !== 'complete_arc2_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress2[id] = true;
    gainXP(ch.xp);
    game.reputation = (game.reputation||0)+1;
    logEvent('📖 Arc 2 Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if(typeof saveGame==='function') saveGame();
    if(typeof renderMainGoal==='function') renderMainGoal();
    if(typeof renderStory==='function') renderStory();
  };

  // Append an Arc II section to the Story screen, right after Arc I's list.
  const oldRenderStoryForArc2 = window.renderStory;
  window.renderStory = function(){
    if(oldRenderStoryForArc2) oldRenderStoryForArc2();
    const container = document.getElementById('storyContent');
    if(!container) return;
    const arc1Done = typeof objectiveState==='function' && (objectiveState()==='continue_voyage' || window.arc2ObjectiveState()!==null);
    // First time the Story screen renders after Arc I is truly finished,
    // show the Arc II splash once. Checked here (not tied to the exact
    // moment Chapter 24 completes) so it also catches saves that finished
    // Arc I before this feature existed, and avoids stacking on top of the
    // Chapter 24 "complete" screen while it's still showing.
    if(arc1Done && !game.arc2SplashSeen && typeof window.__ctShowArc2Splash==='function'){
      window.__ctShowArc2Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc2/arc2-cover-new-shores.png" alt="Arc II — New Shores" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc II</div><div class="story-act-title">A Voyage to Remember</div>'+
      '<div class="story-act-tagline">14 story chapters. New horizons, familiar hearts.</div></div>';
    if(!arc1Done){
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc II Locked</div><div class="story-chapter-sub">Finish all of Arc I first.</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc2ObjectiveState();
    ARC2_CHAPTERS.forEach(ch=>{
      const done = !!game.comicProgress2?.[ch.id];
      const gateBlocking = ch.gate && so===('arc2_gate_'+ch.gate.type+'_'+ch.id);
      const ready = !done && so===('complete_arc2_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':((ready||gateBlocking)?'CURRENT':'🔒 LOCKED');
      let action;
      if(gateBlocking) action = '<div class="story-chip">'+esc(ch.gate.label)+'</div>';
      else if(ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
        '<button class="btn btn-small btn-success" onclick="markArc2ChapterRead('+ch.id+')">✓ Mark Chapter Read</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
