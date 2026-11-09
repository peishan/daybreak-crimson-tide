(function(){
  // -------------------------------------------------------------------
  // CRIMSON HORIZON -- ADVENTURES OF SAN AND JADE. The sequel proper,
  // picking up immediately after Crimson Tide's main campaign closes at
  // Arc XLII (game.arc42Complete, set by markArc42ChapterRead() at
  // Ch.45). Gated at arc42Complete + Level 645 -- the next rung on the
  // same 15-per-arc ladder every arc since Arc XVII uses (Arc XLII itself
  // stayed at 630, same as the bridge chapter it continues directly
  // from; this is the first genuinely new threshold since).
  //
  // Prologue + Chapters 1-4 ("A New Voyage"), San and Joel's viewpoint
  // throughout, same as Arc XLII. The Crimson Tide and Tribute crews sail
  // as one unified vessel now (per San's own sequel-structure notes),
  // so Jade, Sally and the rest of Canon Five appear in these scenes --
  // but none of them have ALL_PARTY/CLASS_KIT entries yet (that's its
  // own deferred batch). Ch.2's beast fight is narrated rather than
  // built as a real encounter for exactly that reason: San is the only
  // participant shown who already has a combat kit to field her with --
  // a genuine fight would either leave Jade and Sally out of their own
  // scene or fake stats for characters that don't exist in the engine
  // yet. Revisit this once Canon Five are real combat recruits.
  //
  // Cover/chapter art is the real uploaded pages, not placeholders --
  // assets/comics/sequel/. Portraits for this sequel's new look
  // (San, Joel, Jade, Devon, Sky, Levi, Sally) live separately under
  // assets/portraits/sequel/, not yet wired into ALL_PARTY/CLASS_KIT.
  // -------------------------------------------------------------------

  const CRIMSON_HORIZON_CHAPTERS = [
    {id:1, title:'Prologue — A New Voyage', focus:"Aboard the Crimson Tide, San and Joel look out over a new horizon — one chapter closed, a wider world still waiting. The Black Pearl remains in their guardianship, its true nature still unknown. They decide to meet whatever comes next together, as one unified crew.", image:'assets/comics/sequel/prologue-a-new-voyage.webp', xp:400, action:'🌅 Set Sail Toward the Horizon'},
    {id:2, title:'Chapter 1 — The First Storm', focus:"The Crimson Tide's new voyage opens with a fierce, chaotic storm — their first battle sooner than expected. In its wake comes quieter news: several of the crew are expecting, each pregnancy its own long Veyren road, with the whole crew pacing missions around it together.", image:'assets/comics/sequel/ch01-the-first-storm.webp', xp:410, action:'⚡ Weather the First Storm'},
    {id:3, title:"Chapter 2 — The Storm's True Form", focus:"What looked like a violent storm turns out to be something far worse: a colossal sea-born predator, awakened by a power unknown. San, Jade and Sally combine magic, tactics and precision fire to bring it down — and confirm this is only the first sign of a new kind of threat.", image:'assets/comics/sequel/ch02-the-storms-true-form.webp', xp:430, action:"🐉 Face the Storm's True Form"},
    {id:4, title:'Chapter 3 — What the Storm Left Behind', focus:"At dawn, the crew repairs rigging and hull from the battle — and notices something stranger: a violet glow pulsing beneath the water, right where the leviathan went down. A torn-sailed fishing boat rows toward them, its crew asking about the very same light.", image:'assets/comics/sequel/ch03-what-the-storm-left-behind.webp', xp:410, action:'🌊 Examine What the Storm Left Behind'},
    {id:5, title:'Chapter 4 — The Channel Through the Reef', focus:"The rescued fisherman guides the Crimson Tide through a reef channel by night, the same violet pulses marking safe water. At the harbor, Devon searches the gathered survivors for word of his brother's boat, and the crew learns the glow always goes dark just before each surge — with two boats still unaccounted for.", image:'assets/comics/sequel/ch04-the-channel-through-the-reef.webp', xp:420, action:'🧭 Chart the Channel Through the Reef'}
  ];
  window.CRIMSON_HORIZON_CHAPTERS = CRIMSON_HORIZON_CHAPTERS;

  const CRIMSON_HORIZON_CHAPTER_SCENES = {
    1: 'A new horizon rises for the Crimson Tide.<br><br>"We\'ve closed one chapter..." Joel says, watching the sunset, "...but the world is far from finished with us."<br><br>"I know," San says. "This is not an ending. It\'s a chance to explore what still lies beyond our maps — together."<br><br>The Black Pearl remains within their guardianship, its true origins and deeper purpose still a mystery waiting to be unravelled.<br><br>"Then let\'s go," San says, looking out over the water. "A wider world awaits — and this time, we sail it as one."',
    2: 'A violent storm of a different kind welcomes the Crimson Tide\'s new voyage. Their first battle comes sooner than expected — fierce, chaotic and relentless.<br><br>"We\'ve handled worse," San says. "Just adjust your pace, keep your focus, and let your team cover the heavier work."<br><br>"It\'s different this time, with more of us expecting," Jade says. "But... it also feels right. A new life beginning as we sail toward a wider world."<br><br>"You\'ll get used to it," San says. "I carried Vaeren and Joelle for years. It\'s a long pregnancy in Veyren — but the advantage of being a long-range magic user is that I could still fight and support the crew. With the right adjustments, role distribution and a good support plan, we can all continue to be active."<br><br>As the battle eases and the crew regroups, news begins to surface one by one: Sera is expecting. Fen is expecting. Evelyne is expecting. Mirelle is likely expecting as well. Jenika, for now, does not appear to be — and with all the work she\'s taken on, that might be for the best.<br><br>"Well..." San says, a small chuckle escaping her, "...at least this solves Sera\'s problem for now."<br><br>With a major battle behind them and new lives already on the way, the Crimson Tide charts its course onward — not just across new seas, but into a future that now holds even more to protect.',
    3: 'What first seemed like a violent storm reveals itself to be something far worse — a colossal sea-born predator, awakened by a power unknown.<br><br>"It\'s larger than our initial scan..." San says. "Adjust formation! I\'ll keep it distracted from a distance!"<br><br>"I\'ll handle the openings!" Jade calls, Crimson Repeater raised. "Keep it steady — I\'ll mark the weak points!"<br><br>"On it!" Sally answers, Veilstring Bow already drawn. "I\'ll disrupt its strikes and keep it from regenerating!"<br><br>Together, the crew combines magic, strategy and ranged precision, wearing the beast down piece by piece.<br><br>At last, it falls, its defeat leaving behind strange residue — proof that the threats ahead will be unlike any they\'ve faced before.<br><br>"A good start..." San says, watching the water settle. "The battle confirms it — we\'re dealing with a new kind of threat. We\'ll need more than brute force from here on."',
    4: 'Dawn breaks over calm water. The crew wastes no time replacing damaged rigging and checking the hull after the storm\'s brutal battle.<br><br>"Jade!" Joel calls. "There\'s a violet streak just above the waterline — where the leviathan went down."<br><br>"It\'s fading..." Jade says, watching it. "No — it\'s lighting again."<br><br>"Joel, time the next pulse for me," San says. "We\'ll send the interval to Fair Tide once we have three clear readings."<br><br>"Got it," Joel says. "I\'ll log the timing and keep watching for the next one."<br><br>"Hold on —" Sally calls, telescope raised, "— there\'s a fishing boat ahead! Their sail\'s torn... and they\'re rowing hard toward us!"<br><br>The crew hauls the line in as the small boat closes the distance. One of the fishermen, exhausted, looks up at San.<br><br>"That light," he says. "We saw it at the harbor mouth. Can you help us get home?"',
    5: '"We\'ll get you home," San says. "Can you show us the way in?"<br><br>"Aye," the fisherman says. "Bring me up where I can see the bow."<br><br>"Keep the lights to port," he calls, scanning the dark water. "There\'s a shelf just under the foam."<br><br>"I see it," comes the reply from the helm. "Half sail."<br><br>"San," Jade says quietly, nodding toward the water. "Look under the light." The same violet glow pulses beneath the surface, marking the channel through the reef.<br><br>"Hold the line!" comes the call as the ship threads the narrow passage, waves breaking hard against the hull.<br><br>At the harbor, lantern light and worried faces crowd the dock. "Did you see my brother\'s boat?" Devon asks, moving between the gathered survivors.<br><br>"They go dark before every surge," the harbor captain says, grey-bearded under his cap. "That\'s how we know to clear the channel."<br><br>"How many boats are still out?" Devon asks.<br><br>"Two," the captain says.<br><br>"How long between surges?" Devon presses.<br><br>"We\'ve had about a watch between them so far," the captain says, tracing the charted reef on the map between them.<br><br>San lifts her lantern, watching the dark water beyond the harbor mouth. "When they come in sight, light that lantern," she says. "We\'ll be ready."'
  };
  window.CRIMSON_HORIZON_CHAPTER_SCENES = CRIMSON_HORIZON_CHAPTER_SCENES;

  window.crimsonHorizonObjectiveState = function(){
    if (!game.arc42Complete) return null;
    if (level() < 645) return null;
    game.comicProgressCrimsonHorizon = game.comicProgressCrimsonHorizon || {};
    for (const ch of CRIMSON_HORIZON_CHAPTERS) {
      if (!game.comicProgressCrimsonHorizon[ch.id]) return 'complete_crimson_horizon_chapter_' + ch.id;
    }
    return 'crimson_horizon_part1_complete_for_now';
  };

  window.markCrimsonHorizonChapterRead = function(id){
    const so = window.crimsonHorizonObjectiveState();
    if (so !== ('complete_crimson_horizon_chapter_' + id)) return;
    game.comicProgressCrimsonHorizon = game.comicProgressCrimsonHorizon || {};
    game.comicProgressCrimsonHorizon[id] = true;
    const ch = CRIMSON_HORIZON_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (CRIMSON_HORIZON_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: CRIMSON_HORIZON_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowCrimsonHorizonSplash = function(){
    const overlay = document.getElementById('crimsonHorizonSplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseCrimsonHorizonSplash = function(){
    const overlay = document.getElementById('crimsonHorizonSplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.crimsonHorizonSplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForCrimsonHorizon = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForCrimsonHorizon) oldRenderStoryForCrimsonHorizon();
    const container = document.getElementById('storyContent');
    if (!container) return;
    // The splash is purely an announcement the moment the main campaign
    // ends -- independent of the Level 645 chapter gate below, same as
    // every other arc's splash firing the instant its own arc becomes
    // reachable, not once its first chapter is actually unlocked.
    const sequelAnnounced = !!game.arc42Complete;
    if (sequelAnnounced && !game.crimsonHorizonSplashSeen && typeof window.__ctShowCrimsonHorizonSplash === 'function') {
      window.__ctShowCrimsonHorizonSplash();
    }
    const chReady = window.crimsonHorizonObjectiveState() !== null;
    if (!sequelAnnounced) return;
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/sequel/crimson-horizon-cover.webp" alt="Crimson Horizon — Adventures of San and Jade" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Crimson Horizon</div><div class="story-act-title">Adventures of San and Jade</div>'+
      '<div class="story-act-tagline">A wider world awaits — and this time, they sail it as one.</div></div>';
    if (!chReady) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Crimson Horizon Locked</div><div class="story-chapter-sub">Reach Level 645 to begin.</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.crimsonHorizonObjectiveState();
    CRIMSON_HORIZON_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[ch.id]);
      const ready = !done && so===('complete_crimson_horizon_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<button class="btn btn-small btn-success" onclick="markCrimsonHorizonChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>'+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='crimson_horizon_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Crimson Horizon chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
