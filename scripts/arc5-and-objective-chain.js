
(function(){
  // -------------------------------------------------------------------
  // ARC V — "The Bond" (Parts I-II: Ch.1-9). Gated on Arc IV completion +
  // level 100 (San's call, not from the brief — Arc IV's own gate was 80).
  // Chapters 10-24 (Jovie, the Fair Tide recruitment wave) land in later
  // batches; this block wires Parts I-II plus the combat systems they
  // introduce — Bonded by the Tide, First Mate's Aegis, and Renn's
  // Trickster's Hex. See ways-of-working: incremental batching, clean
  // extension points, never speculate beyond current content.
  // -------------------------------------------------------------------
  const ARC5_CHAPTERS = [
    {id:1, title:'The Hidden Cove',       focus:"San and Joel find an ancient rune in a sea cove. Nothing is explained yet.",                 image:'assets/comics/arc5/ch01-the-hidden-cove.png',       xp:175},
    {id:2, title:'Something Changed',     focus:'They notice faster recovery and unusually good coordination together — and no reason why.',  image:'assets/comics/arc5/ch02-something-changed.png',     xp:150},
    {id:3, title:'Shield Wall',           focus:"A hard battle. San's magic grows stronger while Joel shields her — the bond's first sign.",   image:'assets/comics/arc5/ch03-shield-wall.png',           xp:200},
    {id:4, title:'The Mark',              focus:'Joel pushes Shield Wall past its limit. A tattoo appears on his skin, tied to the bond.',      image:'assets/comics/arc5/ch04-the-mark.png',              xp:200},
    {id:5, title:"First Mate's Aegis",    focus:'Joel learns the mark can be deliberately channelled to protect San from a powerful attack.',   image:'assets/comics/arc5/ch05-first-mates-aegis.png',     xp:225},
    // Part II — Renn (Ch.6-9). Recruited into full combat at Ch.8 — see
    // ARC5_RECRUITS below.
    {id:6, title:'The Mage Who Stole the Wind', focus:'An unnatural wind fills the sails, then vanishes — the crew finds Renn, an arcane trickster, nearby.', image:'assets/comics/arc5/ch06-the-mage-who-stole-the-wind.png', xp:175},
    {id:7, title:'Tricks of the Trade',         focus:'Renn demonstrates his brand of magical mischief — false lights, phantom ships, illusory cargo.',       image:'assets/comics/arc5/ch07-tricks-of-the-trade.png',         xp:150},
    {id:8, title:'Aboard the Crimson Tide',     focus:'Renn joins the crew, at least for now — and immediately causes a stir.',                              image:'assets/comics/arc5/ch08-aboard-the-crimson-tide.png',     xp:200},
    {id:9, title:'Why Renn Stays',              focus:"He has other options. He chooses the Crimson Tide anyway — a genuine choice, not destiny.",           image:'assets/comics/arc5/ch09-why-renn-stays.png',               xp:200},
    // Part III — Jovie (Ch.10-13). Non-combat — joins the Fair Tide
    // roster, not the fielded party, per San's explicit call. Recruited
    // at Ch.13 ("Here, Now") — see ARC5_RECRUITS below.
    {id:10, title:'The Woman Behind the Counter', focus:'A young woman named Jovie seeks San and Joel out, certain she knows them — fragments of a supermarket, medical supplies, a medical centre.', image:'assets/comics/arc5/ch10-the-woman-behind-the-counter.png', xp:175},
    {id:11, title:'Something Joel Remembers',     focus:'Seeing Jovie triggers a stronger memory in Joel than in San — proof memory isn\'t a universal switch.',                                          image:'assets/comics/arc5/ch11-something-joel-remembers.png',      xp:175},
    {id:12, title:'The Medical Box',              focus:'Jovie has been surviving on whatever medical knowledge she can remember. Dr AA sees real value in it.',                                          image:'assets/comics/arc5/ch12-the-medical-box.png',                xp:200},
    {id:13, title:'Here, Now',                    focus:"Jovie decides she doesn't need her whole past back. She chooses the present — and a place with this crew.",                                      image:'assets/comics/arc5/ch13-here-now.png',                       xp:225},
    // Part IV — Fair Tide (Ch.14-20). San starts thinking of Fair Tide as
    // permanent, not a stop between voyages. Gino, Wahyu, Dudin, Imah,
    // Nurul, and Dre all join the roster — see ARC5_RECRUITS below.
    {id:14, title:'A Port Worth Keeping',  focus:'San starts thinking about Fair Tide differently — not just somewhere they stop, but somewhere worth building.',        image:'assets/comics/arc5/ch14-a-port-worth-keeping.png', xp:200},
    {id:15, title:"Gino's Galley",         focus:'Gino joins as an assistant cook — a small work-related memory fragment surfaces with Joel, then they move on.',        image:'assets/comics/arc5/ch15-ginos-galley.png',          xp:200},
    {id:16, title:'Cloth and Cargo',       focus:'Wahyu sets up a trading stall. Dudin arrives soon after. Practical skills, useful to the growing settlement.',           image:'assets/comics/arc5/ch16-cloth-and-cargo.png',       xp:200},
    {id:17, title:'The Supply Quarter',    focus:"Dudin's own business takes root — army-style supplies, gear people trust, a stronger Fair Tide.",                       image:'assets/comics/arc5/ch17-the-supply-quarter.png',    xp:200},
    {id:18, title:'Imah',                  focus:'Imah arrives — San taught her the job from the ground up, once. A warm reunion, not a fraught one.',                    image:'assets/comics/arc5/ch18-imah.png',                  xp:225},
    {id:19, title:'Nurul',                 focus:"Nurul remembers more — including Robin's sarcasm. San doesn't defend herself, just acknowledges it. They move forward.", image:'assets/comics/arc5/ch19-nurul.png',                 xp:225},
    {id:20, title:'Coffee Before the Storm', focus:'Dre remembers San through something mundane and wonderful: coffee. A lighter, funnier reunion.',                      image:'assets/comics/arc5/ch20-coffee-before-the-storm.png', xp:225},
    // Part V — The Mechanic and the Wider Network (Ch.21-24). Jorvin joins;
    // the people he mentions (Aisy, Zul, Lewis, Jonathan) stay narrative
    // color per the brief ("this should not become four separate reunion
    // chapters") — no roster entries for them this batch.
    {id:21, title:'The Tinkerer',          focus:"Jorvin arrives — a former colleague fascinated by the ship. He remembers almost nothing, but enough to recognise San.", image:'assets/comics/arc5/ch21-the-tinkerer.png',          xp:225},
    {id:22, title:'The People Jorvin Knows', focus:"Jorvin's memories connect to a wider network — Aisy, Zul, Lewis, Jonathan. Fair Tide is becoming a meeting point.",    image:'assets/comics/arc5/ch22-the-people-jorvin-knows.png', xp:225},
    {id:23, title:'Everyone Has a Place',  focus:'The new arrivals settle into their roles. Fair Tide is no longer just a port — it\'s a home base.',                      image:'assets/comics/arc5/ch23-everyone-has-a-place.png',  xp:250},
    {id:24, title:'The Tide We Build',     focus:'The Crimson Tide sails again — but this time, it isn\'t leaving an empty port behind. Arc V ends here.',                image:'assets/comics/arc5/ch24-the-tide-we-build.png',     xp:300}
  ];
  window.ARC5_CHAPTERS = ARC5_CHAPTERS;

  window.arc5ObjectiveState = function(){
    if(typeof window.arc4ObjectiveState!=='function' || window.arc4ObjectiveState()!=='arc4_chapters_complete_for_now') return null;
    if(level()<75) return null;
    game.comicProgress5 = game.comicProgress5||{};
    for(const ch of ARC5_CHAPTERS){
      if(!game.comicProgress5[ch.id]) return 'complete_arc5_chapter_'+ch.id;
    }
    return 'arc5_part1_complete_for_now';
  };

  // Bonded by the Tide — active once Ch.4 is read, whenever San and Joel
  // are both fielded and alive. Read by getCrimsonCombatParty() (stat
  // bonus), enemyCounterAttack() (damage reduction), and combatAction()
  // (Shield Wall haste windfall) — all guarded with typeof checks so
  // nothing breaks if this block hasn't loaded.
  window.bondedTideActive = function(){
    if(!(game.comicProgress5 && game.comicProgress5[4])) return false;
    const activeIds = new Set((typeof getActiveParty==='function' ? getActiveParty() : []).map(m=>m.id));
    if(!activeIds.has('san') || !activeIds.has('joel')) return false;
    const sanHp = (game.partyHp && game.partyHp['san'] != null) ? game.partyHp['san'] : 1;
    const joelHp = (game.partyHp && game.partyHp['joel'] != null) ? game.partyHp['joel'] : 1;
    return sanHp > 0 && joelHp > 0;
  };

  // Renn joins full combat the moment Ch.8 ("Aboard the Crimson Tide") is
  // marked read. Jovie (Ch.13) and everyone from Part IV onward (Gino,
  // Wahyu, Dudin, Imah, Nurul, Dre, Jorvin) are confirmed non-combat —
  // they join the Fair Tide roster (game.fairTideRoster) rather than the
  // fielded party (ALL_PARTY/getActiveParty), which keeps them completely
  // decoupled from the combat pipeline — zero risk to anything already
  // tested there. type:'combat' adds to game.foundCompanions and expects
  // an ALL_PARTY entry; type:'roster' adds to game.fairTideRoster with its
  // own name/role/desc, no ALL_PARTY entry needed or wanted.
  const ARC5_RECRUITS = {
    8:  {type:'combat', id:'renn'},
    13: {type:'roster', id:'jovie', name:'Jovie', role:'Medical Support', icon:'🩹', desc:"Doesn't remember her whole past — but remembers enough medicine to matter."},
    15: {type:'roster', id:'gino',  name:'Gino',  role:'Galley',          icon:'🍲', desc:'Good food, good people — Fair Tide runs better on both.'},
    16: {type:'roster', id:'wahyu', name:'Wahyu',  role:'Clothing & Trade', icon:'🧵', desc:'Simple goods, real support. A small trader with a growing stall.'},
    17: {type:'roster', id:'dudin', name:'Dudin',  role:'Supplies',        icon:'🎒', desc:'Army-style gear and supplies — practical, reliable, always there when it counts.'},
    18: {type:'roster', id:'imah',  name:'Imah',   role:'Administration',  icon:'📋', desc:'San taught her the job from the ground up, once. Now she runs the paperwork that keeps Fair Tide moving.'},
    19: {type:'roster', id:'nurul', name:'Nurul',  role:'Clerical & Trade', icon:'🗂️', desc:"Remembers more than most — including the hard parts. Chose to stay anyway."},
    20: {type:'roster', id:'dre',   name:'Dre',    role:'Coffee & Commerce', icon:'☕', desc:'Remembers San through the most ordinary thing — coffee. Brings a legal head for contracts too.'},
    21: {type:'roster', id:'jorvin', name:'Jorvin', role:'Tinkerer / Mechanic', icon:'🔧', desc:"Barely remembers anything clearly — except San. That was enough to stay."}
  };

  window.markArc5ChapterRead = function(id){
    id = Number(id);
    const ch = ARC5_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc5] no chapter data for id', id); return; }
    game.comicProgress5 = game.comicProgress5||{};
    if(game.comicProgress5[id]){ toast('✓ Already marked read.'); return; }
    if(window.arc5ObjectiveState() !== 'complete_arc5_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress5[id] = true;
    gainXP(ch.xp);
    game.reputation = (game.reputation||0)+1;
    logEvent('📖 Arc 5 Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    const recruit = ARC5_RECRUITS[id];
    if(recruit && recruit.type==='combat' && !game.foundCompanions?.[recruit.id]){
      game.foundCompanions = game.foundCompanions||{};
      game.foundCompanions[recruit.id] = true;
      const member = (typeof ALL_PARTY!=='undefined') ? ALL_PARTY.find(m=>m.id===recruit.id) : null;
      const label = member ? member.name : recruit.id;
      logEvent('⚓ '+label+' has joined the crew!', 'gold');
      toast('⚓ '+label+' has joined the crew!', 3600);
    } else if(recruit && recruit.type==='roster'){
      game.fairTideRoster = game.fairTideRoster||{};
      if(!game.fairTideRoster[recruit.id]){
        game.fairTideRoster[recruit.id] = {name:recruit.name, role:recruit.role, icon:recruit.icon, desc:recruit.desc};
        logEvent('🏮 '+recruit.name+' has joined Fair Tide as '+recruit.role+'.', 'gold');
        toast('🏮 '+recruit.name+' has joined Fair Tide!', 3600);
      }
    }
    if(typeof saveGame==='function') saveGame();
    if(typeof renderMainGoal==='function') renderMainGoal();
    if(typeof renderStory==='function') renderStory();
  };

  window.__ctShowArc5Splash = function(){
    const overlay = document.getElementById('arc5SplashOverlay');
    if(!overlay) return;
    overlay.style.display='flex'; overlay.classList.add('active'); overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    window.scrollTo({top:0,left:0,behavior:'instant'});
    game.arc5SplashSeen = true;
    if(typeof saveGame==='function') saveGame();
  };
  window.__ctCloseArc5Splash = function(){
    const overlay = document.getElementById('arc5SplashOverlay');
    if(overlay){ overlay.style.display='none'; overlay.classList.remove('active'); overlay.setAttribute('aria-hidden','true'); }
    document.body.style.overflow='';
  };

  const oldRenderStoryForArc5 = window.renderStory;
  window.renderStory = function(){
    if(oldRenderStoryForArc5) oldRenderStoryForArc5();
    const container = document.getElementById('storyContent');
    if(!container) return;
    const arc5Ready = typeof window.arc5ObjectiveState==='function' && window.arc5ObjectiveState()!==null;
    if(arc5Ready && !game.arc5SplashSeen && typeof window.__ctShowArc5Splash==='function'){
      window.__ctShowArc5Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc5/arc5-cover-the-bond.png" alt="Arc V — The Bond" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc V</div><div class="story-act-title">The Bond</div>'+
      '<div class="story-act-tagline">Chapters 1-'+ARC5_CHAPTERS.length+' of 24. What we build now becomes its own history.</div></div>';
    if(!arc5Ready){
      const arc4Done = typeof window.arc4ObjectiveState==='function' && window.arc4ObjectiveState()==='arc4_chapters_complete_for_now';
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc V Locked</div><div class="story-chapter-sub">'+
        (!arc4Done ? 'Finish all of Arc IV first.' : 'Reach Level 100 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc5ObjectiveState();
    ARC5_CHAPTERS.forEach(ch=>{
      const done = !!game.comicProgress5?.[ch.id];
      const ready = !done && so===('complete_arc5_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if(ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
        '<button class="btn btn-small btn-success" onclick="markArc5ChapterRead('+ch.id+')">✓ Mark Chapter Read</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if(so==='arc5_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc V chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };

  const oldRenderComicArchiveForArc5 = window.renderComicArchive;
  window.renderComicArchive = function(){
    if(oldRenderComicArchiveForArc5) oldRenderComicArchiveForArc5();
    const el = document.getElementById('comicArchive'); if(!el) return;
    const progress5 = (typeof game!=='undefined' && game.comicProgress5) || {};
    const arc5Read = ARC5_CHAPTERS.filter(ch=>!!progress5[ch.id]);
    const section = !arc5Read.length
      ? '<div class="comic-archive-card"><div class="comic-archive-sub">No Arc V chapters read yet.</div></div>'
      : arc5Read.map(ch=>'<div class="comic-archive-card"><div class="comic-archive-title">Chapter '+ch.id+' — '+esc(ch.title)+'</div>'+
          '<button class="btn btn-small" style="margin-top:6px;" onclick="openComicImage(\''+ch.image+'\')">📖 Read Again</button></div>').join('');
    el.insertAdjacentHTML('beforeend',
      '<div class="comic-archive-title" style="font-size:1.05rem;margin:18px 0 6px;">Arc V — The Bond</div>' + section);
  };
})();


(function(){
  // -------------------------------------------------------------------
  // BUG FIX: the "Current Objective" panel (renderMainGoal) only ever
  // read the base objectiveState() chain, which was built for Arc I and
  // permanently terminates at 'continue_voyage' once Arc I is finished —
  // it was never extended to look at arc2/3/4/5ObjectiveState, so the
  // panel has been stuck on the generic "Continue the Voyage" text since
  // the moment Arc I wrapped, regardless of actual progress through Arc
  // II-V since. This block fixes the display only.
  //
  // Deliberately does NOT reassign window.objectiveState itself: arc2-5's
  // own ObjectiveState functions already call the bare `objectiveState()`
  // identifier internally as their own gate check (e.g. arc2 requires
  // objectiveState()==='continue_voyage' to even start). Wrapping
  // window.objectiveState to also call arc2ObjectiveState would make that
  // internal call resolve back to this same wrapper at runtime and recurse
  // forever. Keeping this as a separate window.effectiveObjectiveState
  // sidesteps that entirely — nothing else needs to call it.
  // -------------------------------------------------------------------
  const baseObjectiveState = window.objectiveState;
  window.effectiveObjectiveState = function(){
    const base = baseObjectiveState ? baseObjectiveState() : null;
    if (base !== 'continue_voyage') return base;
    // Walks arc2 -> arc5 in order. Each arc's own function returns null
    // until reachable, a chapter-specific string while there's something
    // to read, or a terminal "..._complete_for_now" string once everything
    // currently built for that arc is done. A terminal state means "move
    // on to the next arc" — but if the NEXT arc isn't reachable yet either
    // (e.g. a level gate), lastTerminal keeps the most recent "caught up"
    // state around so it still surfaces, rather than losing that info back
    // to the generic base fallback text.
    let lastTerminal = null;
    if (typeof window.arc2ObjectiveState === 'function') {
      const s2 = window.arc2ObjectiveState();
      if (s2 !== null && s2 !== 'arc2_complete') return s2;
    }
    if (typeof window.arc3ObjectiveState === 'function') {
      const s3 = window.arc3ObjectiveState();
      if (s3 !== null && s3 !== 'arc3_chapters_complete_for_now') return s3;
      if (s3 === 'arc3_chapters_complete_for_now') lastTerminal = s3;
    }
    if (typeof window.arc4ObjectiveState === 'function') {
      const s4 = window.arc4ObjectiveState();
      if (s4 !== null && s4 !== 'arc4_chapters_complete_for_now') return s4;
      if (s4 === 'arc4_chapters_complete_for_now') lastTerminal = s4;
    }
    if (typeof window.arc5ObjectiveState === 'function') {
      const s5 = window.arc5ObjectiveState();
      if (s5 !== null && s5 !== 'arc5_part1_complete_for_now') return s5;
      if (s5 === 'arc5_part1_complete_for_now') lastTerminal = s5;
    }
    if (typeof window.arc6ObjectiveState === 'function') {
      // BUG FIX: this always returned s6 once non-null, even when it was
      // arc6's own terminal 'arc6_part1_complete_for_now' string — unlike
      // every arc before it, which falls through via lastTerminal so the
      // NEXT arc gets a chance to take over. That meant the Current
      // Objective panel would get stuck on "Arc VI — All Caught Up"
      // forever once reached, never advancing to Arc VII.
      const s6 = window.arc6ObjectiveState();
      if (s6 !== null && s6 !== 'arc6_part1_complete_for_now') return s6;
      if (s6 === 'arc6_part1_complete_for_now') lastTerminal = s6;
    }
    if (typeof window.arc7ObjectiveState === 'function') {
      const s7 = window.arc7ObjectiveState();
      if (s7 !== null && s7 !== 'arc7_part1_complete_for_now') return s7;
      if (s7 === 'arc7_part1_complete_for_now') lastTerminal = s7;
    }
    if (typeof window.arc8ObjectiveState === 'function') {
      // Same bug as Arc VI originally had (see that comment above) — this
      // returned s8 unconditionally once non-null, including its own
      // terminal 'arc8_part1_complete_for_now' string, which would get the
      // Current Objective panel stuck on "Arc VIII — All Caught Up"
      // forever with no way to fall through to Arc IX once it exists.
      const s8 = window.arc8ObjectiveState();
      if (s8 !== null && s8 !== 'arc8_part1_complete_for_now') return s8;
      if (s8 === 'arc8_part1_complete_for_now') lastTerminal = s8;
    }
    if (typeof window.arc9ObjectiveState === 'function') {
      const s9 = window.arc9ObjectiveState();
      if (s9 !== null && s9 !== 'arc9_part1_complete_for_now') return s9;
      if (s9 === 'arc9_part1_complete_for_now') lastTerminal = s9;
    }
    if (typeof window.arc10ObjectiveState === 'function') {
      const s10 = window.arc10ObjectiveState();
      if (s10 !== null && s10 !== 'arc10_part1_complete_for_now') return s10;
      if (s10 === 'arc10_part1_complete_for_now') lastTerminal = s10;
    }
    if (typeof window.arc11ObjectiveState === 'function') {
      const s11 = window.arc11ObjectiveState();
      if (s11 !== null && s11 !== 'arc11_part1_complete_for_now') return s11;
      if (s11 === 'arc11_part1_complete_for_now') lastTerminal = s11;
    }
    if (typeof window.arc12ObjectiveState === 'function') {
      const s12 = window.arc12ObjectiveState();
      if (s12 !== null && s12 !== 'arc12_part1_complete_for_now') return s12;
      if (s12 === 'arc12_part1_complete_for_now') lastTerminal = s12;
    }
    if (typeof window.arc13ObjectiveState === 'function') {
      const s13 = window.arc13ObjectiveState();
      if (s13 !== null && s13 !== 'arc13_part1_complete_for_now') return s13;
      if (s13 === 'arc13_part1_complete_for_now') lastTerminal = s13;
    }
    if (typeof window.arc14ObjectiveState === 'function') {
      const s14 = window.arc14ObjectiveState();
      if (s14 !== null && s14 !== 'arc14_part1_complete_for_now') return s14;
      if (s14 === 'arc14_part1_complete_for_now') lastTerminal = s14;
    }
    if (typeof window.arc15ObjectiveState === 'function') {
      const s15 = window.arc15ObjectiveState();
      if (s15 !== null && s15 !== 'arc15_part1_complete_for_now') return s15;
      if (s15 === 'arc15_part1_complete_for_now') lastTerminal = s15;
    }
    return lastTerminal || base;
  };

  function chapterLabel(arcName, chapterId, chaptersArr){
    const ch = (chaptersArr||[]).find(c => String(c.id) === String(chapterId));
    const title = ch ? ch.title : ('Chapter ' + chapterId);
    return ['Open Story → ' + arcName + ' Ch.' + chapterId, 'Read "' + title + '" to continue ' + arcName + '.'];
  }
  function friendlyArcObjectiveLabel(state){
    if (!state) return null;
    let m;
    if (state === 'arc2_gate_sail_10') return ['Set Sail', 'Chapter 10 is waiting — set sail to continue.'];
    if ((m = /^arc2_gate_level_(\d+)$/.exec(state))) return ['Reach a Higher Level', 'Chapter ' + m[1] + ' needs a higher level first (currently Level ' + level() + ').'];
    if ((m = /^complete_arc2_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc II', m[1], window.ARC2_CHAPTERS);
    if ((m = /^complete_arc3_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc III', m[1], window.ARC3_CHAPTERS);
    if (state === 'arc3_chapters_complete_for_now') return ['Arc III — All Caught Up', 'Every available Arc III chapter is read. More is on the way.'];
    if ((m = /^complete_arc4_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc IV', m[1], window.ARC4_CHAPTERS);
    if (state === 'arc4_chapters_complete_for_now') return ['Arc IV — All Caught Up', 'Every available Arc IV chapter is read. More is on the way.'];
    if ((m = /^complete_arc5_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc V', m[1], window.ARC5_CHAPTERS);
    if (state === 'arc5_part1_complete_for_now') return ['Arc V — All Caught Up', 'Every available Arc V chapter is read. More is on the way.'];
    if ((m = /^complete_arc6_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc VI', m[1], window.ARC6_CHAPTERS);
    if (state === 'arc6_part1_complete_for_now') return ['Arc VI — All Caught Up', 'Every available Arc VI chapter is read. More is on the way.'];
    if ((m = /^complete_arc7_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc VII', m[1], window.ARC7_CHAPTERS);
    if (state === 'arc7_part1_complete_for_now') return ['Arc VII — All Caught Up', 'Every available Arc VII chapter is read. More is on the way.'];
    if ((m = /^complete_arc8_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc VIII', m[1], window.ARC8_CHAPTERS);
    if ((m = /^complete_arc9_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc IX', m[1], window.ARC9_CHAPTERS);
    if ((m = /^complete_arc10_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc X', m[1], window.ARC10_CHAPTERS);
    if ((m = /^complete_arc11_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc XI', m[1], window.ARC11_CHAPTERS);
    if ((m = /^complete_arc12_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc XII', m[1], window.ARC12_CHAPTERS);
    if ((m = /^complete_arc13_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc XIII', m[1], window.ARC13_CHAPTERS);
    if ((m = /^complete_arc14_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc XIV', m[1], window.ARC14_CHAPTERS);
    if ((m = /^complete_arc15_chapter_(\d+)$/.exec(state))) return chapterLabel('Arc XV', m[1], window.ARC15_CHAPTERS);
    if (state === 'arc8_part1_complete_for_now') return ['Arc VIII — All Caught Up', 'Every available Arc VIII chapter is read. More is on the way.'];
    if (state === 'arc9_part1_complete_for_now') return ['Arc IX — All Caught Up', 'Every available Arc IX chapter is read. More is on the way.'];
    if (state === 'arc10_part1_complete_for_now') return ['Arc X — All Caught Up', 'Every available Arc X chapter is read. More is on the way.'];
    if (state === 'arc11_part1_complete_for_now') return ['Arc XI — All Caught Up', 'Every available Arc XI chapter is read. More is on the way.'];
    if (state === 'arc12_part1_complete_for_now') return ['Arc XII — All Caught Up', 'Every available Arc XII chapter is read. More is on the way.'];
    if (state === 'arc13_part1_complete_for_now') return ['Arc XIII — All Caught Up', 'Every available Arc XIII chapter is read. More is on the way.'];
    if (state === 'arc14_part1_complete_for_now') return ['Arc XIV — All Caught Up', 'Every available Arc XIV chapter is read. More is on the way.'];
    if (state === 'arc15_part1_complete_for_now') return ['Arc XV — All Caught Up', 'Every available Arc XV chapter is read. More is on the way.'];
    return null;
  }

  const oldRenderMainGoalForChain = window.renderMainGoal;
  window.renderMainGoal = function(){
    const el = document.getElementById('mainGoalPanel');
    if (!el) return;
    const so = window.effectiveObjectiveState();
    const label = friendlyArcObjectiveLabel(so);
    if (label) {
      el.innerHTML = '<div class="ct-goal-kicker">Current Objective</div><div class="ct-goal-title">🎯 ' + esc(label[0]) + '</div><div class="ct-goal-text">' + esc(label[1]) + '</div><div class="ct-goal-optional">Optional: complete bounties for extra XP and gold.</div>';
      if (typeof renderObjectiveActionPanel === 'function') renderObjectiveActionPanel();
      return;
    }
    if (oldRenderMainGoalForChain) oldRenderMainGoalForChain();
  };
})();
