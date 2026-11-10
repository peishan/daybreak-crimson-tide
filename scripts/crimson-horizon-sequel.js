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
  // San and Joel's viewpoint throughout, same as Arc XLII. The Crimson
  // Tide and Tribute crews sail as one unified vessel now (per San's own
  // sequel-structure notes), so Jade, Sally and the rest of Canon Five
  // appear in these scenes -- but none of them have ALL_PARTY/CLASS_KIT
  // entries yet (that's its own deferred batch). Ch.002's beast fight is
  // narrated rather than built as a real encounter for exactly that
  // reason: San is the only participant shown who already has a combat
  // kit to field her with -- a genuine fight would either leave Jade and
  // Sally out of their own scene or fake stats for characters that don't
  // exist in the engine yet. Revisit this once Canon Five are real
  // combat recruits.
  //
  // CRIMSON_HORIZON_CHAPTERS below only holds Prologue + 001-004 -- the
  // chapters that actually have finished comic pages with real dialogue
  // (assets/comics/sequel/). San's own numbering runs Prologue, then
  // 001-032 continuously straight across Arc I/II/III (no per-arc
  // restart, unlike every numbered arc file before this one, which each
  // reset their own ch.id at 1). The ids here follow that scheme too --
  // id:1 is the Prologue, id:2 is "001", id:3 is "002", and so on --
  // so later batches can just keep appending without renumbering
  // anything already shipped.
  //
  // The rest of San's full three-arc outline is reference-only, kept
  // here so the next batch doesn't need it re-pasted. Nothing past 004
  // is built -- these are one-line beat plans, not finished scripts, and
  // turning them into real chapters (narrated prose, dialogue, XP,
  // unlock gates) is explicitly deferred until the matching comic pages
  // exist, same as every chapter before them in this game.
  //
  // CRIMSON HORIZON · ARC I -- A NEW VOYAGE (Prologue + 001-010)
  //   Prologue  San and Jade set sail aboard the Crimson Tide with the unified crew, including Tribute's canon five. The Black Pearl research continues in Fair Tide. [BUILT]
  //   001 The First Storm -- A violent storm tests the newly unified crew. They adapt their battle positions so Jade and Sally can fight from protected range. [BUILT]
  //   002 The Storm's True Form -- San, Jade, and Sally help defeat the Stormborn Leviathan. After the storm clears, a strange violet residue remains. [BUILT]
  //   003 What the Storm Left Behind -- During repairs, Jade spots the residue pulsing on the hull. The crew of a damaged fishing boat recognizes the glow from their harbor mouth and asks for help getting home. [BUILT]
  //   004 The Harbor Beyond the Charts -- The fishers guide the Crimson Tide through the reef just before a surge. The harbor pilot explains that the channel lights go dark before each surge, and two boats are still out. [BUILT]
  //   005 Between Watches -- While Aisyah rearranges the watches, a crowded breakfast aboard gives Vaeren, Joelle, and Soel a comic moment. The harbor lights go dark a full watch early.
  //   006 Under the Channel -- Levi scouts the reef at low tide while Jade directs and Sally covers him from a protected position. He finds an old gate jammed halfway open, sending out a surge each time it shifts.
  //   007 The Narrow Window -- In Fair Tide, Renn, Erynn, and Mimi link the harbor's pulses to the leviathan encounter while Adrian and Fen search for records of the gate. Devon and the harbor pilot work out when the stranded boats can cross.
  //   008 Hold the Passage -- San steadies the current, Jade coordinates the crossing, and Sally gets a towline to the stranded boats. The first makes it through, but the second loses steerage as the gate starts to close.
  //   009 One Crew at the Helm -- Joel brings the Crimson Tide into the channel to tow the last boat clear while Sky tends to the rescued fishers. The reef team secures the gate open, stopping the surges.
  //   010 The Next Bearing -- The harbor pilots share an old chart showing other gates. San and Jade choose which route to follow next, giving the game its next expedition. Ends with the crew choosing the North Gate (direct route toward the leviathan activity), keeping the East Gate as fallback.
  //
  // CRIMSON HORIZON · ARC II -- STORM SHELF (011-018)
  //   011 The Favorable Tide -- Aisyah finishes loading supplies while Devon marks the East Gate fallback on the chart. The Crimson Tide departs for the North Gate on the promised tide.
  //   012 Across the Storm Shelf -- Mezstorm spots two storm fronts moving against the wind along the same line. Joel steers through the gap between them, and Levi sights an old tower on the far side.
  //   013 The Watchtower Below -- Levi and Sairen explore the abandoned tower while Jade directs the survey from the ship. They find a chamber that records sea activity, with a fresh mark matching the pulse from the leviathan encounter.
  //   014 The Second Signal -- Fair Tide compares the tower record with the harbor readings. Erynn and Mimi identify a second signal that reached the tower before the leviathan surfaced, and Adrian and Fen find a matching offshore site on an old chart.
  //   015 The Shelf Wakes -- The tower rings as the signal returns. The storm fronts close across the northern passage, and Sally spots an eastern route marker flashing between the waves.
  //   016 East by Lantern -- Devon plots the fallback while Sally calls out the markers from cover. Joel takes the ship through the East Gate as Mezstorm holds the wind steady long enough for them to clear it.
  //   017 What the Tower Heard -- At a sheltered anchorage, San and Jade compare the record with the old chart. The tower was tracking a signal from beneath the Storm Shelf, and the latest reading gives them a bearing.
  //   018 The Sounding Line -- The crew marks a safe approach from the East Gate and prepares to lower a sounding line at the source. The line goes slack far too soon, setting up the game's first descent beneath the shelf.
  //
  // CRIMSON HORIZON · ARC III -- BENEATH THE STORM SHELF (019-032)
  //   019 Where the Line Went Slack -- Joel hauls up the sounding line and finds its weight scraped flat on one side. Levi sends a lantern down and catches a glimpse of a stone ledge beneath the shelf.
  //   020 The Dive Watch -- Aisyah sets the watch rotation and Sky readies the infirmary. Levi and Sairen take the first dive while Jade tracks their progress from the ship.
  //   021 The Door Underwater -- Levi and Sairen follow the ledge into an air-filled chamber. The tower's symbol is carved over a door, and the floor trembles in time with the signal. [game handoff: frames the submerged-station expedition]
  //   022 Tea at Fair Tide -- Sera drops in on Fen with tea and finds the research table covered in charts. Fen notices that the mark the crew sent back appears on the old chart at both the Storm Shelf and the West Gate.
  //   023 A Warning for Ships -- Erynn translates the chamber inscription. The station once warned ships away from dangerous currents, but someone has recently altered it to send a much stronger pulse.
  //   024 Three Bells -- A pulse rattles the ship, and Vaeren and Joelle join in as Soel wakes the off-watch crew. Joel establishes a three-bell recall so the dive team can hear the warning through the stone.
  //   025 The Night Log -- Sally compares the tower's timestamps with Joel's battle log. The altered pulse reached the leviathan's waters just before it surfaced, and the station is building toward another transmission.
  //   026 The Channel That Takes It -- Devon and Renn trace the next pulse's path along the outer current. It will reach the East Gate, where ships are already using the same fallback route the crew took.
  //   027 Clear the East Gate -- Sally signals passing ships away while Joel holds the Crimson Tide at the mouth of the channel. Below, Levi and Sairen hear the recall bells just as they find the station's service passage.
  //   028 The Fresh Cut -- Sairen finds a newly fitted coupling that turns the warning signal into a repeating pulse. Jade spots a maintenance bypass on the chamber sketch and guides the divers to it from aboard ship. [game handoff: frames the submerged-station expedition]
  //   029 Between Two Pulses -- San and Mezstorm steady the water at the dive entrance while Levi and Sairen switch the station to its bypass and remove the coupling. The next warning comes through as a single, quiet bell. [game handoff: frames the submerged-station expedition]
  //   030 Back on Deck -- Sky checks the divers as the East Gate reopens to traffic. Aisyah finally gets everyone around the same table, and the twins insist Soel deserves a place on the watch roster.
  //   031 The Mark Beneath the Salt -- Adrian and Fen compare the recovered coupling with the charts. Beneath the salt is a West Gate service mark and a fresh inventory number, giving the crew a way to trace who handled it.
  //   032 Into the Mist Straits -- San and Jade chart a course for the West Gate to trace the coupling. Ends at the edge of the mist, where the first route lantern is lit and the second is missing. [game handoff: sets up the next playable route through the West Gate]
  //
  // Cover/chapter art is the real uploaded pages, not placeholders --
  // assets/comics/sequel/. assets/comics/sequel/arc1-cover-a-new-voyage.webp
  // is Arc I's own cover (used in the act header below); crimson-horizon-
  // cover.webp is the separate one-time splash announcing the sequel,
  // shown the instant Arc XLII completes regardless of the Level 645
  // chapter gate -- see __ctShowCrimsonHorizonSplash below. Portraits for
  // this sequel's new look (San, Joel, Jade, Devon, Sky, Levi, Sally)
  // live separately under assets/portraits/sequel/, not yet wired into
  // ALL_PARTY/CLASS_KIT.
  // -------------------------------------------------------------------

  const CRIMSON_HORIZON_CHAPTERS = [
    {id:1, title:'Prologue — A New Voyage', focus:"Aboard the Crimson Tide, San and Joel look out over a new horizon — one chapter closed, a wider world still waiting. The Black Pearl remains in their guardianship, its true nature still unknown. They decide to meet whatever comes next together, as one unified crew.", image:'assets/comics/sequel/prologue-a-new-voyage.webp', xp:400, action:'🌅 Set Sail Toward the Horizon'},
    {id:2, title:'001 · The First Storm', focus:"The Crimson Tide's new voyage opens with a fierce, chaotic storm — their first battle sooner than expected. In its wake comes quieter news: several of the crew are expecting, each pregnancy its own long Veyren road, with the whole crew pacing missions around it together.", image:'assets/comics/sequel/ch01-the-first-storm.webp', xp:410, action:'⚡ Weather the First Storm'},
    {id:3, title:"002 · The Storm's True Form", focus:"What looked like a violent storm turns out to be something far worse: a colossal sea-born predator, awakened by a power unknown. San, Jade and Sally combine magic, tactics and precision fire to bring it down — and confirm this is only the first sign of a new kind of threat.", image:'assets/comics/sequel/ch02-the-storms-true-form.webp', xp:430, action:"🐉 Face the Storm's True Form"},
    {id:4, title:'003 · What the Storm Left Behind', focus:"At dawn, the crew repairs rigging and hull from the battle — and notices something stranger: a violet glow pulsing beneath the water, right where the leviathan went down. A torn-sailed fishing boat rows toward them, its crew asking about the very same light.", image:'assets/comics/sequel/ch03-what-the-storm-left-behind.webp', xp:410, action:'🌊 Examine What the Storm Left Behind'},
    {id:5, title:'004 · The Harbor Beyond the Charts', focus:"The rescued fisherman guides the Crimson Tide through a reef channel by night, the same violet pulses marking safe water. At the harbor, Devon searches the gathered survivors for word of his brother's boat, and the crew learns the glow always goes dark just before each surge — with two boats still unaccounted for.", image:'assets/comics/sequel/ch04-the-harbor-beyond-the-charts.webp', xp:420, action:'🌅 Find the Harbor Beyond the Charts'}
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
      '<img src="assets/comics/sequel/arc1-cover-a-new-voyage.webp" alt="Crimson Horizon — Arc I: A New Voyage" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Crimson Horizon · Arc I</div><div class="story-act-title">A New Voyage</div>'+
      '<div class="story-act-tagline">One crew. Two worlds. A wider horizon.</div></div>';
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
