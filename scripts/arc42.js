(function(){
  // -------------------------------------------------------------------
  // ARC XLII — MEET THE MAKER. Chapters 1-5 only ("First Contact"), per
  // San's own note that this arc needs building in pieces. Gated at
  // game.arc41BridgeComplete + level 630 -- the same level the bridge
  // chapter itself required, not a further bump, since Ch.1 picks up
  // immediately where the bridge left off ("Following the Horizon
  // crossing") rather than after any further time or leveling.
  //
  // This file is deliberately incomplete. ARC42_CHAPTERS currently only
  // holds this first five-chapter block; arc42ObjectiveState() reports
  // 'arc42_part1_complete_for_now' once all five are read, same
  // fallback message every other arc file already has for exactly this
  // situation (it just hasn't actually fired before now, since every
  // earlier arc was built in one complete pass). No game.arc42Complete
  // is set anywhere in this file -- that flag belongs to whichever
  // chapter actually closes the arc, not yet written. Later chapter
  // blocks extend ARC42_CHAPTERS/ARC42_CHAPTER_SCENES in place, the
  // same way this file will grow, not replace itself.
  //
  // Per the outline's own explicit framing: the bridge chapter
  // (arc41-bridge.js) already handled the Horizon crossing itself --
  // this arc begins after arrival and never repeats it. San and Joel
  // are the viewpoint throughout; Jade's own perspective is reserved
  // for actual Tribute-side crossover chapters, not narrated here.
  // Jade's five-person party (Jade, Devon, Sky, Levi, Sally -- per the
  // crossover planning doc's own confirmed roster) are temporary story
  // allies this block, never recruited, never given ALL_PARTY entries.
  //
  // Ch.3-4's own reveal -- San recognizes Jade and Devon's names from
  // an old, unfinished manuscript of her own ("Imperial Guard Meets
  // Runaway Prince," later "Tangled with the Runaway Prince," shelved
  // during a difficult stretch of her marriage) -- is San's own
  // storyline exactly as outlined, nothing invented beyond it. Thought
  // Resonance (Ch.3) is already guaranteed unlocked by the time any
  // player reaches here: this arc's own gate requires arc41Bridge-
  // Complete, which requires arc41Complete, which requires arc40Complete
  // (Thought Resonance's own arc) -- so no new mechanical hook is
  // needed, just the existing system already being live.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. Nothing in this five-chapter block needs its
  // own mechanics file -- no new systems, no recruitment, no combat
  // (per the outline's own "Jade's party becomes temporary story
  // allies, not permanent recruits" and "Black Pearl investigation
  // begins in a later chapter").
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.webp) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC42_CHAPTERS = [
    {id:1, title:'A Strange New Shore', focus:"Following the Horizon crossing, San and Joel assess their surroundings aboard the enormous junk. Their arrival attracts attention from nearby residents. \"We've made quite an entrance.\" \"It's a big ship.\" A group approaches from the shore.", image:'assets/comics/arc42/ch01-a-strange-new-shore.webp', xp:400, action:'🌌 Survey a Strange New Shore'},
    {id:2, title:'Another Visitor?', focus:"Jade and her canonical five-person party investigate the unfamiliar vessel. Jade mentions that another interworld visitor appeared only a week earlier. \"Another?\" \"You're not the first.\" Both groups cautiously begin introductions.", image:'assets/comics/arc42/ch02-another-visitor.webp', xp:380, action:'🚢 Answer Another Visitor?'},
    {id:3, title:'Jade Gold', focus:"Jade introduces herself and Devon. San recognizes their names from an old, unfinished manuscript. Joel senses her surprise through Thought Resonance. Jade notices San's reaction but receives no explanation.", image:'assets/comics/arc42/ch03-jade-gold.webp', xp:420, action:'✨ Meet Jade Gold'},
    {id:4, title:'The Story I Left Behind', focus:"Privately, San tells Joel about Imperial Guard Meets Runaway Prince, later renamed Tangled with the Runaway Prince. The story changed repeatedly before San put it aside during difficulties in her marriage. She remembers an early, incompletely developed Jade, not the woman standing before her.", image:'assets/comics/arc42/ch04-the-story-i-left-behind.webp', xp:420, action:'📖 Revisit the Story I Left Behind'},
    {id:5, title:'An Invitation to Stay', focus:"Jade's party offers to help San and Joel understand Lunareth. San learns that Jade's adventures continued far beyond her unfinished manuscript. The groups agree to cooperate. San keeps the manuscript connection private for now.", image:'assets/comics/arc42/ch05-an-invitation-to-stay.webp', xp:400, action:'🤝 Accept an Invitation to Stay'}
  ];
  window.ARC42_CHAPTERS = ARC42_CHAPTERS;

  const ARC42_CHAPTER_SCENES = {
    1: "The crossing settles, and the Crimson Tide finds itself riding unfamiliar water, a new coastline stretched out ahead. San and Joel take stock of their surroundings properly for the first time — no immediate danger, no obvious welcome either, just an unfamiliar shoreline and a crew waiting on their next word.<br><br>It doesn't take long for the ship itself to draw attention. The Crimson Tide was never built to be subtle, and against an unfamiliar coastline it reads as something between a curiosity and an event. Figures gather along the shore, more of them by the minute, watching the enormous vessel with the particular stillness of people deciding whether to be alarmed.<br><br>\"We've made quite an entrance,\" Joel says, watching the gathering crowd.<br><br>\"It's a big ship,\" San says, which isn't exactly a denial.<br><br>Before either of them can decide on a next move, a group breaks away from the shore and starts toward them — unhurried, deliberate, clearly not the first time any of them have had to size up something unexpected showing up on their water.",
    2: "The group turns out to be exactly what San expected and nothing like what she pictured: five people, moving together with the easy, practiced coordination of a party that's done this before, closing the distance to get a proper look at the ship.<br><br>Introductions happen carefully, both sides reading the other before committing to much. The one clearly leading the group — sharp-eyed, unhurried, used to being listened to — mentions something that catches San's full attention immediately.<br><br>\"You're not the first,\" she says. \"Had someone else show up out of nowhere, about a week back.\"<br><br>\"Another?\" San asks.<br><br>\"Another,\" the woman confirms, watching San's reaction with open curiosity now.<br><br>Both groups start in on proper introductions after that, still careful, still feeling out exactly how much to say. San's crew falls into the familiar rhythm of a first contact that could go any number of directions. So, clearly, does the other side.",
    3: '"Jade," the woman says, offering it plainly, the way someone does when a name has carried real weight for a long time. Beside her, a sharp-featured man inclines his head. "Devon."<br><br>San goes very still.<br><br>It\'s nothing either Jade or Devon would notice on their own — the names alone wouldn\'t mean anything to a stranger. But they aren\'t strangers\' names to San. They\'re names she wrote, once, a long time ago, in a story she never finished.<br><br>Joel feels it before she says a single word about it — the faint, wordless jolt of her own surprise passing through whatever sits between them now, the same quiet thing that\'s been living in the space between their thoughts since Arc XL. He doesn\'t ask, not out loud, not yet. He just knows something just happened.<br><br>Jade notices too, in her own way — the half-second where San\'s composure genuinely slips before she pulls it back into place. She doesn\'t get an explanation. San isn\'t ready to give one, not here, not to someone she just met wearing a face she half-recognizes from a story she buried years ago.',
    4: "Later, once there's finally a private moment, San tells Joel everything — carefully, like she's unpacking something she hasn't looked at in a long time.<br><br>Imperial Guard Meets Runaway Prince, she called it, back when she first started writing it. It became Tangled with the Runaway Prince eventually, after enough rewrites that the title barely resembled where it started. The story itself changed just as much along the way — characters reworked, plot threads abandoned and replaced, nothing about it staying still for long.<br><br>She put it aside, in the end, during a stretch of her marriage that was difficult enough that writing about anyone else's romance felt impossible. She never went back to it. She assumed, as much as she thought about it at all, that it simply stayed exactly where she left it — half-finished, going nowhere, hers alone.<br><br>The Jade she remembers from those pages is nothing like the woman who just introduced herself on that shore — early, incompletely sketched, more an idea than a person. Whoever's standing in front of her now has had a whole life San never got to write.",
    5: "Jade's party doesn't press for explanations San isn't offering. Instead, practically, they offer something more immediately useful: help. Lunareth is a big world, considerably bigger than the small arrival stretch San and Joel have actually seen, and navigating it without local knowledge would be slow going at best.<br><br>San listens, and starts getting a clearer picture of exactly how far Jade's own story has actually traveled — adventures, consequences, a whole life that kept moving long after the point where San's own manuscript simply stopped. None of it matches what San remembers writing. All of it clearly, unmistakably belongs to Jade now, not to whatever San once sketched out on a page.<br><br>The two groups agree to work together, at least for now — cautious cooperation, nothing promised beyond it.<br><br>San keeps the manuscript connection to herself. It isn't a secret meant to last forever. It's simply not a conversation she's ready to have yet, not until she understands a little better what it would even mean to have it."
  };
  window.ARC42_CHAPTER_SCENES = ARC42_CHAPTER_SCENES;

  window.arc42ObjectiveState = function(){
    if (!game.arc41BridgeComplete) return null;
    if (level() < 630) return null;
    game.comicProgress42 = game.comicProgress42 || {};
    for (const ch of ARC42_CHAPTERS) {
      if (!game.comicProgress42[ch.id]) return 'complete_arc42_chapter_' + ch.id;
    }
    return 'arc42_part1_complete_for_now';
  };

  window.markArc42ChapterRead = function(id){
    const so = window.arc42ObjectiveState();
    if (so !== ('complete_arc42_chapter_' + id)) return;
    game.comicProgress42 = game.comicProgress42 || {};
    game.comicProgress42[id] = true;
    const ch = ARC42_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC42_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC42_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc42Splash = function(){
    const overlay = document.getElementById('arc42SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc42Splash = function(){
    const overlay = document.getElementById('arc42SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc42SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc42 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc42) oldRenderStoryForArc42();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc42Ready = window.arc42ObjectiveState() !== null;
    if (arc42Ready && !game.arc42SplashSeen && typeof window.__ctShowArc42Splash === 'function') {
      window.__ctShowArc42Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc42/arc42-cover-meet-the-maker.webp" alt="Arc XLII — Meet the Maker" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XLII</div><div class="story-act-title">Meet the Maker</div>'+
      '<div class="story-act-tagline">Some stories continue long after their writers stop writing.</div></div>';
    if (!arc42Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XLII Locked</div><div class="story-chapter-sub">'+
        (!game.arc41BridgeComplete ? 'Cross the Horizon to Lunareth first.' : 'Reach Level 630 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc42ObjectiveState();
    ARC42_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress42 && game.comicProgress42[ch.id]);
      const ready = !done && so===('complete_arc42_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action =
          '<button class="btn btn-small btn-success" onclick="markArc42ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc42_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XLII chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
