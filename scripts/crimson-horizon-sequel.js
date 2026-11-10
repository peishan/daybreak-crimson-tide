(function(){
  // -------------------------------------------------------------------
  // CRIMSON HORIZON -- ADVENTURES OF SAN AND JADE. The sequel proper,
  // picking up immediately after Crimson Tide's main campaign closes at
  // Arc XLII (game.arc42Complete, set by markArc42ChapterRead() at
  // Ch.45). Gated at arc42Complete + Level 645 -- the next rung on the
  // same 15-per-arc ladder every arc since Arc XVII uses (Arc XLII itself
  // stayed at 630, same as the bridge chapter it continues directly
  // from; this is the first genuinely new threshold since). One single
  // gate for the whole file, not one per in-story arc -- San's own
  // numbering already paces Arc II/III behind finishing Arc I's chapters
  // in order, so a second level requirement would just be redundant.
  //
  // San and Joel's viewpoint throughout, same as Arc XLII. The Crimson
  // Tide and Tribute crews sail as one unified vessel now (per San's own
  // sequel-structure notes), so Jade, Sally and the rest of Canon Five
  // appear in these scenes -- but none of them have ALL_PARTY/CLASS_KIT
  // entries yet (that's its own deferred batch). Every "fight" chapter so
  // far (Ch.002's leviathan, Ch.012's storm gap) is narrated rather than
  // built as a real encounter for exactly that reason: San is the only
  // participant shown who already has a combat kit to field her with --
  // a genuine fight would either leave the rest of the cast out of their
  // own scene or fake stats for characters that don't exist in the
  // engine yet. Revisit this once Canon Five are real combat recruits.
  //
  // CROSS-GAME SHARED CHAPTERS -- San's own design doc: Tribute (its own
  // repo) and Crimson Tide play the same Crimson Horizon chapter
  // numbers, comic panels and story outcomes, but each through its own
  // core loop (Tribute: party quests/regional exploration; Crimson Tide:
  // voyages/ship operations/expeditions). Each game builds its own
  // unlock condition, playable objective and reward -- nothing here
  // needs to match Tribute's own implementation, only the shared chapter
  // number and the comic's outcome. "Game handoff" chapters (flagged
  // throughout the outline above) are where that divergence actually
  // matters -- those get a real playable objective on this side, not
  // just a mark-as-read button; quiet/dialogue-only chapters (San's own
  // example: Ch.037) stay narrated in both games. Ch.008 ("Hold the
  // Passage") is the first of these -- see startHoldThePassageStep
  // below. 026/039/042 and any future handoff chapters follow the same
  // pattern once their own comic pages exist.
  //
  // CRIMSON_HORIZON_CHAPTERS holds Prologue + 001-020 -- every chapter
  // with a finished comic page and real dialogue so far (assets/comics/
  // sequel/). San's own numbering runs Prologue, then 001-032
  // continuously straight across Arc I/II/III (no per-arc restart,
  // unlike every numbered arc file before this one, which each reset
  // their own ch.id at 1). The ids here follow that scheme too -- id:1
  // is the Prologue, id:2 is "001", id:3 is "002", and so on -- so later
  // batches can just keep appending without renumbering anything already
  // shipped. Each entry's own `arc` field (1/2/3) drives which cover/
  // kicker/title the act header below shows, matching the real comic
  // pages' own per-arc page headers.
  //
  // The rest of San's full three-arc outline is reference-only, kept
  // here so the next batch doesn't need it re-pasted. Nothing past 020
  // is built -- these are one-line beat plans, not finished scripts, and
  // turning them into real chapters (narrated prose, dialogue, XP,
  // unlock gates) is explicitly deferred until the matching comic pages
  // exist, same as every chapter before them in this game.
  //
  // CRIMSON HORIZON · ARC I -- A NEW VOYAGE (Prologue + 001-010) [BUILT]
  //   Prologue  San and Jade set sail aboard the Crimson Tide with the unified crew, including Tribute's canon five. The Black Pearl research continues in Fair Tide.
  //   001 The First Storm -- A violent storm tests the newly unified crew. They adapt their battle positions so Jade and Sally can fight from protected range.
  //   002 The Storm's True Form -- San, Jade, and Sally help defeat the Stormborn Leviathan. After the storm clears, a strange violet residue remains.
  //   003 What the Storm Left Behind -- During repairs, Jade spots the residue pulsing on the hull. The crew of a damaged fishing boat recognizes the glow from their harbor mouth and asks for help getting home.
  //   004 The Harbor Beyond the Charts -- The fishers guide the Crimson Tide through the reef just before a surge. The harbor pilot explains that the channel lights go dark before each surge, and two boats are still out.
  //   005 Between Watches -- While Aisyah rearranges the watches, a crowded breakfast aboard gives Vaeren, Joelle, and Soel a comic moment. The harbor lights go dark a full watch early.
  //   006 Under the Channel -- Levi scouts the reef at low tide while Jade directs and Sally covers him from a protected position. He finds an old gate jammed halfway open, sending out a surge each time it shifts.
  //   007 The Narrow Window -- In Fair Tide, Renn, Erynn, and Mimi link the harbor's pulses to the leviathan encounter while Adrian and Fen search for records of the gate. Devon and the harbor pilot work out when the stranded boats can cross.
  //   008 Hold the Passage -- San steadies the current, Jade coordinates the crossing, and Sally gets a towline to the stranded boats. The first makes it through, but the second loses steerage as the gate starts to close.
  //   009 One Crew at the Helm -- Joel brings the Crimson Tide into the channel to tow the last boat clear while Sky tends to the rescued fishers. The reef team secures the gate open, stopping the surges.
  //   010 The Next Bearing -- The harbor pilots share an old chart showing other gates. San and Jade choose which route to follow next, giving the game its next expedition. Ends with the crew choosing the North Gate (direct route toward the leviathan activity), keeping the East Gate as fallback.
  //
  // CRIMSON HORIZON · ARC II -- STORM SHELF (011-018) [BUILT]
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
  //   019 Where the Line Went Slack -- Joel hauls up the sounding line and finds its weight scraped flat on one side. Levi sends a lantern down and catches a glimpse of a stone ledge beneath the shelf. [BUILT]
  //   020 The Dive Watch -- Aisyah sets the watch rotation and Sky readies the infirmary. Levi and Sairen take the first dive while Jade tracks their progress from the ship. [BUILT]
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
  // CRIMSON HORIZON · ARC IV -- THE MIST STRAITS (033-048)
  // The crew follows coupling SV-7729 to the West Gate. The missing
  // lantern from Ch.032 turns out to be part of a false route that
  // leads ships straight into the hands of a salvage crew.
  //   033 The Missing Lantern -- Sally spots a light flashing where the second route marker should be. Joel stops the Crimson Tide when Levi sees that the light is moving against the current.
  //   034 The Pilot's Bell -- A local pilot guides the ship into a sheltered quay by ringing a bell from shore. She tells San that the second lantern vanished three nights ago and two ships have gone aground since.
  //   035 The West Gate Yard -- Jade and Aisyah visit the maintenance yard to ask about SV-7729. The foreman recognizes it as part of a shipment that was signed out for routine beacon repairs.
  //   036 Signed and Transferred -- From Fair Tide, Adrian and Fen send a copy of the transfer record. Sally compares it with the yard's dispatch book and finds three more couplings collected under the same work order.
  //   037 A Place at the Table -- Sky treats a sailor from one of the wrecks over supper aboard the Crimson Tide. When the twins ask how he knew where to sail, he taps out the rhythm of the light he followed.
  //   038 The Wrong Rhythm -- Renn checks the sailor's account against the old pilot codes from Fair Tide. The moving light copied the official signal closely enough to fool anyone approaching in fog.
  //   039 Low Water -- Levi and Sairen follow fresh bootprints across a shoal exposed at low tide. They find the missing lantern mounted on a small skiff, with a West Gate coupling fitted beneath it. [game handoff: scout the shoal]
  //   040 Lights for Sale -- Sally watches the skiff's crew sell cargo stripped from the grounded ships. One of them leaves to set the lantern again just as the evening convoy approaches.
  //   041 The Evening Convoy -- The pilot says the convoy is already beyond sight of shore. San sends Joel and Mezstorm to intercept it while Jade coordinates a shore team to restore the real marker.
  //   042 Through the White Water -- Joel takes the Crimson Tide into the fog while Mezstorm clears brief gaps in it. They reach the convoy as its lead ship begins turning toward the false light. [game handoff: intercept the convoy]
  //   043 The Lantern Skiff -- Levi and Sairen cut off the skiff's retreat through the shallows. When its crew tries to throw the lantern overboard, Sally pins the release rope to the gunwale from the Crimson Tide. [game handoff: intercept the convoy]
  //   044 Light the Real Channel -- Jade gets the yard foreman to bring a spare lantern to the empty post. Once it's lit, Joel leads the convoy through the true channel to the waiting pilot. [game handoff: restore the true channel light]
  //   045 The Salvage Ledger -- The harbor pilot takes the recovered ledger to the families of the wrecked crews so they can reclaim their cargo. The entries show the salvage crew used several couplings locally and sold one on to the Storm Shelf.
  //   046 The Last Crate South -- Fen traces the final coupling from the shipment to an unopened crate still awaiting pickup. Its delivery instructions name the South Gate · Deep Channel, with a tide and berth but no recipient.
  //   047 A Light of Their Own -- The yard crew restores the permanent marker, and the pilot invites the twins to ring the quay bell for the first ship safely through. San asks her to teach the crew the local signals before they sail.
  //   048 The Deep Channel -- San and Jade take the delivery instructions south to see who comes for the crate. At the rendezvous berth, they find a mooring rope pulled taut into water too deep for any dock. [game handoff: opens the Deep Channel route]
  //
  // Cover/chapter art is the real uploaded pages, not placeholders --
  // assets/comics/sequel/. arc1-cover-a-new-voyage.webp, arc2-cover-
  // storm-shelf.webp and arc3-cover-beneath-the-storm-shelf.webp are
  // each arc's own cover (ARC_META below, used in the act header);
  // crimson-horizon-cover.webp is the separate one-time splash
  // announcing the sequel, shown the instant Arc XLII completes
  // regardless of the Level 645 chapter gate -- see
  // __ctShowCrimsonHorizonSplash below. Portraits for this sequel's new
  // look (San, Joel, Jade, Devon, Sky, Levi, Sally) live separately under
  // assets/portraits/sequel/, not yet wired into ALL_PARTY/CLASS_KIT.
  // -------------------------------------------------------------------

  const CRIMSON_HORIZON_CHAPTERS = [
    {id:1, arc:1, title:'Prologue — A New Voyage', focus:"Aboard the Crimson Tide, San and Joel look out over a new horizon — one chapter closed, a wider world still waiting. The Black Pearl remains in their guardianship, its true nature still unknown. They decide to meet whatever comes next together, as one unified crew.", image:'assets/comics/sequel/prologue-a-new-voyage.webp', xp:400, action:'🌅 Set Sail Toward the Horizon'},
    {id:2, arc:1, title:'001 · The First Storm', focus:"The Crimson Tide's new voyage opens with a fierce, chaotic storm — their first battle sooner than expected. In its wake comes quieter news: several of the crew are expecting, each pregnancy its own long Veyren road, with the whole crew pacing missions around it together.", image:'assets/comics/sequel/ch01-the-first-storm.webp', xp:410, action:'⚡ Weather the First Storm'},
    {id:3, arc:1, title:"002 · The Storm's True Form", focus:"What looked like a violent storm turns out to be something far worse: a colossal sea-born predator, awakened by a power unknown. San, Jade and Sally combine magic, tactics and precision fire to bring it down — and confirm this is only the first sign of a new kind of threat.", image:'assets/comics/sequel/ch02-the-storms-true-form.webp', xp:430, action:"🐉 Face the Storm's True Form"},
    {id:4, arc:1, title:'003 · What the Storm Left Behind', focus:"At dawn, the crew repairs rigging and hull from the battle — and notices something stranger: a violet glow pulsing beneath the water, right where the leviathan went down. A torn-sailed fishing boat rows toward them, its crew asking about the very same light.", image:'assets/comics/sequel/ch03-what-the-storm-left-behind.webp', xp:410, action:'🌊 Examine What the Storm Left Behind'},
    {id:5, arc:1, title:'004 · The Harbor Beyond the Charts', focus:"The rescued fisherman guides the Crimson Tide through a reef channel by night, the same violet pulses marking safe water. At the harbor, Devon searches the gathered survivors for word of his brother's boat, and the crew learns the glow always goes dark just before each surge — with two boats still unaccounted for.", image:'assets/comics/sequel/ch04-the-harbor-beyond-the-charts.webp', xp:420, action:'🌅 Find the Harbor Beyond the Charts'},
    {id:6, arc:1, title:'005 · Between Watches', focus:"While Aisyah rearranges the watches, a crowded breakfast aboard gives Vaeren, Joelle and Soel a comic moment. The harbor lights go dark a full watch early.", image:'assets/comics/sequel/ch05-between-watches.webp', xp:400, action:'🍽️ Share a Breakfast Between Watches'},
    {id:7, arc:1, title:'006 · Under the Channel', focus:"Levi scouts the reef at low tide while Jade directs and Sally covers him from a protected position. He finds an old gate jammed halfway open, sending out a surge each time it shifts.", image:'assets/comics/sequel/ch06-under-the-channel.webp', xp:410, action:'🌊 Scout Under the Channel'},
    {id:8, arc:1, title:'007 · The Narrow Window', focus:"In Fair Tide, Renn, Erynn and Mimi link the harbor's pulses to the leviathan encounter while Adrian and Fen search for records of the gate. Devon and the harbor pilot work out when the stranded boats can cross.", image:'assets/comics/sequel/ch07-the-narrow-window.webp', xp:410, action:'📜 Find the Narrow Window'},
    {id:9, arc:1, title:'008 · Hold the Passage', focus:"San steadies the current, Jade coordinates the crossing, and Sally gets a towline to the stranded boats. The first makes it through, but the second loses steerage as the gate starts to close.", image:'assets/comics/sequel/ch08-hold-the-passage.webp', xp:430, action:'⚓ Hold the Passage'},
    {id:10, arc:1, title:'009 · One Crew at the Helm', focus:"Joel brings the Crimson Tide into the channel to tow the last boat clear while Sky tends to the rescued fishers. The reef team secures the gate open, stopping the surges.", image:'assets/comics/sequel/ch09-one-crew-at-the-helm.webp', xp:420, action:'🛟 Stand as One Crew at the Helm'},
    {id:11, arc:1, title:'010 · The Next Bearing', focus:"The harbor pilots share an old chart showing other gates. San and Jade choose which route to follow next, giving the game its next expedition.", image:'assets/comics/sequel/ch10-the-next-bearing.webp', xp:420, action:'🧭 Chart the Next Bearing'},
    {id:12, arc:2, title:'011 · The Favorable Tide', focus:"Aisyah finishes loading supplies while Devon marks the East Gate fallback on the chart. The Crimson Tide departs for the North Gate on the promised tide.", image:'assets/comics/sequel/ch11-the-favorable-tide.webp', xp:400, action:'⛵ Depart on the Favorable Tide'},
    {id:13, arc:2, title:'012 · Across the Storm Shelf', focus:"Mezstorm spots two storm fronts moving against the wind along the same line. Joel steers through the gap between them, and Levi sights an old tower on the far side.", image:'assets/comics/sequel/ch12-across-the-storm-shelf.webp', xp:420, action:'🌩️ Cross the Storm Shelf'},
    {id:14, arc:2, title:'013 · The Watchtower Below', focus:"Levi and Sairen explore the abandoned tower while Jade directs the survey from the ship. They find a chamber that records sea activity, with a fresh mark matching the pulse from the leviathan encounter.", image:'assets/comics/sequel/ch13-the-watchtower-below.webp', xp:420, action:'🗼 Explore the Watchtower Below'},
    {id:15, arc:2, title:'014 · The Second Signal', focus:"Fair Tide compares the tower record with the harbor readings. Erynn and Mimi identify a second signal that reached the tower before the leviathan surfaced, and Adrian and Fen find a matching offshore site on an old chart.", image:'assets/comics/sequel/ch14-the-second-signal.webp', xp:410, action:'📡 Trace the Second Signal'},
    {id:16, arc:2, title:'015 · The Shelf Wakes', focus:"The tower rings as the signal returns. The storm fronts close across the northern passage, and Sally spots an eastern route marker flashing between the waves.", image:'assets/comics/sequel/ch15-the-shelf-wakes.webp', xp:410, action:'🔔 Answer as the Shelf Wakes'},
    {id:17, arc:2, title:'016 · East by Lantern', focus:"Devon plots the fallback while Sally calls out the markers from cover. Joel takes the ship through the East Gate as Mezstorm holds the wind steady long enough for them to clear it.", image:'assets/comics/sequel/ch16-east-by-lantern.webp', xp:420, action:'🏮 Sail East by Lantern'},
    {id:18, arc:2, title:'017 · What the Tower Heard', focus:"At a sheltered anchorage, San and Jade compare the record with the old chart. The tower was tracking a signal from beneath the Storm Shelf, and the latest reading gives them a bearing.", image:'assets/comics/sequel/ch17-what-the-tower-heard.webp', xp:410, action:'🗺️ Learn What the Tower Heard'},
    {id:19, arc:2, title:'018 · The Sounding Line', focus:"The crew marks a safe approach from the East Gate and prepares to lower a sounding line at the source. The line goes slack far too soon, setting up the game's first descent beneath the shelf.", image:'assets/comics/sequel/ch18-the-sounding-line.webp', xp:420, action:'🪢 Lower the Sounding Line'},
    {id:20, arc:3, title:'019 · Where the Line Went Slack', focus:"Joel hauls up the sounding line and finds its weight scraped flat on one side. Levi sends a lantern down and catches a glimpse of a stone ledge beneath the shelf.", image:'assets/comics/sequel/ch19-where-the-line-went-slack.webp', xp:420, action:'🔦 Find Where the Line Went Slack'},
    {id:21, arc:3, title:'020 · The Dive Watch', focus:"Aisyah sets the watch rotation and Sky readies the infirmary. Levi and Sairen take the first dive while Jade tracks their progress from the ship.", image:'assets/comics/sequel/ch20-the-dive-watch.webp', xp:420, action:'🤿 Begin the Dive Watch'}
  ];
  window.CRIMSON_HORIZON_CHAPTERS = CRIMSON_HORIZON_CHAPTERS;

  const CRIMSON_HORIZON_ARC_META = {
    1: {cover:'assets/comics/sequel/arc1-cover-a-new-voyage.webp', kicker:'Crimson Horizon · Arc I', title:'A New Voyage', tagline:'One crew. Two worlds. A wider horizon.'},
    2: {cover:'assets/comics/sequel/arc2-cover-storm-shelf.webp', kicker:'Crimson Horizon · Arc II', title:'Storm Shelf', tagline:'Something beneath the Shelf has been waiting to be found.'},
    3: {cover:'assets/comics/sequel/arc3-cover-beneath-the-storm-shelf.webp', kicker:'Crimson Horizon · Arc III', title:'Beneath the Storm Shelf', tagline:'The signal was never random. Someone kept it active.'}
  };

  const CRIMSON_HORIZON_CHAPTER_SCENES = {
    1: 'A new horizon rises for the Crimson Tide.<br><br>"We\'ve closed one chapter..." Joel says, watching the sunset, "...but the world is far from finished with us."<br><br>"I know," San says. "This is not an ending. It\'s a chance to explore what still lies beyond our maps — together."<br><br>The Black Pearl remains within their guardianship, its true origins and deeper purpose still a mystery waiting to be unravelled.<br><br>"Then let\'s go," San says, looking out over the water. "A wider world awaits — and this time, we sail it as one."',
    2: 'A violent storm of a different kind welcomes the Crimson Tide\'s new voyage. Their first battle comes sooner than expected — fierce, chaotic and relentless.<br><br>"We\'ve handled worse," San says. "Just adjust your pace, keep your focus, and let your team cover the heavier work."<br><br>"It\'s different this time, with more of us expecting," Jade says. "But... it also feels right. A new life beginning as we sail toward a wider world."<br><br>"You\'ll get used to it," San says. "I carried Vaeren and Joelle for years. It\'s a long pregnancy in Veyren — but the advantage of being a long-range magic user is that I could still fight and support the crew. With the right adjustments, role distribution and a good support plan, we can all continue to be active."<br><br>As the battle eases and the crew regroups, news begins to surface one by one: Sera is expecting. Fen is expecting. Evelyne is expecting. Mirelle is likely expecting as well. Jenika, for now, does not appear to be — and with all the work she\'s taken on, that might be for the best.<br><br>"Well..." San says, a small chuckle escaping her, "...at least this solves Sera\'s problem for now."<br><br>With a major battle behind them and new lives already on the way, the Crimson Tide charts its course onward — not just across new seas, but into a future that now holds even more to protect.',
    3: 'What first seemed like a violent storm reveals itself to be something far worse — a colossal sea-born predator, awakened by a power unknown.<br><br>"It\'s larger than our initial scan..." San says. "Adjust formation! I\'ll keep it distracted from a distance!"<br><br>"I\'ll handle the openings!" Jade calls, Crimson Repeater raised. "Keep it steady — I\'ll mark the weak points!"<br><br>"On it!" Sally answers, Veilstring Bow already drawn. "I\'ll disrupt its strikes and keep it from regenerating!"<br><br>Together, the crew combines magic, strategy and ranged precision, wearing the beast down piece by piece.<br><br>At last, it falls, its defeat leaving behind strange residue — proof that the threats ahead will be unlike any they\'ve faced before.<br><br>"A good start..." San says, watching the water settle. "The battle confirms it — we\'re dealing with a new kind of threat. We\'ll need more than brute force from here on."',
    4: 'Dawn breaks over calm water. The crew wastes no time replacing damaged rigging and checking the hull after the storm\'s brutal battle.<br><br>"Jade!" Joel calls. "There\'s a violet streak just above the waterline — where the leviathan went down."<br><br>"It\'s fading..." Jade says, watching it. "No — it\'s lighting again."<br><br>"Joel, time the next pulse for me," San says. "We\'ll send the interval to Fair Tide once we have three clear readings."<br><br>"Got it," Joel says. "I\'ll log the timing and keep watching for the next one."<br><br>"Hold on —" Sally calls, telescope raised, "— there\'s a fishing boat ahead! Their sail\'s torn... and they\'re rowing hard toward us!"<br><br>The crew hauls the line in as the small boat closes the distance. One of the fishermen, exhausted, looks up at San.<br><br>"That light," he says. "We saw it at the harbor mouth. Can you help us get home?"',
    5: '"We\'ll get you home," San says. "Can you show us the way in?"<br><br>"Aye," the fisherman says. "Bring me up where I can see the bow."<br><br>"Keep the lights to port," he calls, scanning the dark water. "There\'s a shelf just under the foam."<br><br>"I see it," comes the reply from the helm. "Half sail."<br><br>"San," Jade says quietly, nodding toward the water. "Look under the light." The same violet glow pulses beneath the surface, marking the channel through the reef.<br><br>"Hold the line!" comes the call as the ship threads the narrow passage, waves breaking hard against the hull.<br><br>At the harbor, lantern light and worried faces crowd the dock. "Did you see my brother\'s boat?" Devon asks, moving between the gathered survivors.<br><br>"They go dark before every surge," the harbor captain says, grey-bearded under his cap. "That\'s how we know to clear the channel."<br><br>"How many boats are still out?" Devon asks.<br><br>"Two," the captain says.<br><br>"How long between surges?" Devon presses.<br><br>"We\'ve had about a watch between them so far," the captain says, tracing the charted reef on the map between them.<br><br>San lifts her lantern, watching the dark water beyond the harbor mouth. "When they come in sight, light that lantern," she says. "We\'ll be ready."',
    6: 'After the rescue, Aisyah takes charge of the next watches.<br><br>"We\'ll move to three-watch rotation until the channel stabilizes," she says. "Joel, lead the first watch. Jade and I will take the second. Sky and Devon, the third."<br><br>With the main work done, the crew finally gathers for a proper breakfast. "This is the best meal since we left Fair Tide!" "If you keep eating like that, you\'ll need a bigger armor, Vaeren!"<br><br>"Soel! That\'s not for you!" "He\'s faster than a trained rogue!" "At this rate, Soel\'s going to be the first on the crew to out-eat a fighter!"<br><br>"Let him," Joel says, watching Soel beg for scraps. "A well-fed familiar is a happier one." "As long as he doesn\'t start raiding the storage room next," San says.<br><br>Later, as the crew rotates into their watches, the sea remains calm — for now.<br><br>"Captain! The harbor lights — they\'ve gone dark!" "A full watch early... the next surge is coming sooner than expected." "All stations. Secure the ship, check the towline, and prepare for another swell!"',
    7: '"Jade, keep to the reef line and check the channel gate," San directs. "We need to know what\'s triggering the surges." "I\'ll cover from here," Sally says, telescope raised. "If anything moves in the channel, I\'ll signal you immediately."<br><br>At low tide, Levi moves across the exposed reef, carefully following Jade\'s instructions.<br><br>"Found it," he reports. "The gate\'s still here... and it\'s stuck halfway open." A pulse of violet lightning courses through the stone. "It\'s moving. That must be the surge... every time the gate shifts, it releases a rush into the channel."<br><br>"So it\'s not a natural swell," Jade says. "The gate is breathing — opening and closing in cycles." "Then the channel lights aren\'t just a warning," Sally adds. "They\'re responding to the gate\'s movement." "The mechanism is old," Levi says, "but it\'s still active. If we can stabilize it, we can stop the surges for good."<br><br>"Then our next step is clear," Jade says. "We need to get a team inside, before the next cycle." "I\'ll prepare a route through the reef," Levi says. "It\'s tight, but we can reach the gate before it shifts again."<br><br>Beneath the channel, the old gate waits — a relic still alive, and the source of the surges that threatened the harbor.',
    8: 'In Fair Tide, the research team brings together the reports from the harbor, the reef, and the leviathan encounter.<br><br>"The harbor pulses match the residue from the leviathan we faced," Renn says. "It\'s the same frequency pattern," Erynn adds. "The gate and the leviathan are linked." "Which means the gate isn\'t just old infrastructure," Mimi says, "it\'s still reacting to the leviathan\'s presence."<br><br>"I found references to a \'Tidal Gate\' in the older harbor records," Renn says, poring over an old book with Mimi. "It was built to regulate sea flows," she reads, "and to keep certain creatures from crossing into the inner waters." "The design matches what Levi found," Renn says. "It\'s a control gate — not fully sealed, not fully open." "The record also warns that if the gate shifts too often, the surges grow stronger and wider..."<br><br>Devon lays out a route on the chart with the harbor pilot. "Based on the pulse interval, we\'ll have a safe window in about three watches," he says. "It\'s narrow, but enough to move the stranded boats." "We\'ll escort them in two waves," the pilot says. "The first for the nearest boats, the second for the ones still farther out."<br><br>"The pulses are stabilizing for now," Mimi says. "The gate is still active, but it\'s calmer than after the leviathan encounter." "We need to keep monitoring both the gate and the deeper readings," Renn says. "If the leviathan is still out there, this won\'t be the last surge." "Agreed," Erynn says. "Let\'s prepare contingency plans in case the gate shifts again before the evacuation."<br><br>With the cause and timing clearer, the team moves quickly to prepare the crossing — before the gate shifts again.',
    9: '"I\'ve steadied the current. The passage is open — for now," San says, arm raised, the sea swirling around her command. At the reef gate, the crew moves quickly. The tide is controlled, the channel opened — but the window will not last long.<br><br>"First boat moves now!" Jade calls. "Keep to the center line, maintain speed, and don\'t veer to port!" "Towline is secure!" Sally shouts, bracing against the rope. "They\'re with us. Keep the tension steady!"<br><br>The first stranded boat rides the steady current, following the Crimson Tide through the narrow channel. "It\'s through! First boat is clear!"<br><br>"The second boat is drifting! They\'ve lost steerage!" "Hold the current — I\'m keeping the gate from closing! Jade, bring them in!" "Crew! Throw a guide line from the port side! Keep the towline tight — we\'re pulling them through now!"<br><br>"It\'s closing! Faster!" "Just a little more... keep pulling!" "Don\'t let go!"<br><br>"Both boats are through... barely." "The gate is closed again." "Next time, we\'ll need a wider window..." "...and a more permanent solution."',
    10: '"All stations, this is Joel — bring the Crimson Tide into the channel! We\'re taking the last boat in tow!" The Crimson Tide moves into the channel, its greater power and stability bringing the stranded boat under control.<br><br>Sky tends to the rescued fishers. "The deep cuts aren\'t serious. You\'re safe now. Rest and keep warm." "You did well out there," he tells the old fisherman. "Take some food and water first. We\'ll check the rest of the crew next."<br><br>At the reef gate, the research team works together to secure the mechanism and end the surges. "The locking braces are in position. Keep the tension steady!" "Align the rune-stabilizers with the main frame... there!" "The gate is secure. The channel is stable — no more surges."<br><br>At last, the gate holds open and the channel settles into a steady flow. "The gate\'s stable... and everyone is safe." "That\'s one crew at the helm — exactly as it should be." "Different skills, different experiences... but together we always get it done."',
    11: 'With the channel stabilized and the harbor secured, the harbor pilots bring out an old chart — one that marks other gates beyond the reef.<br><br>"This is the original network of gates," the old pilot says. "The reef gate is only one of several. If you want to go farther, these are your options." The chart shows four more: North Gate (Storm Shelf), East Gate (Sable Shoals), West Gate (Mist Straits), South Gate (Deep Channel) — the Central (Reef) Gate already secured. "The North Gate leads to open waters and older ruins. The West Gate is shrouded in constant mist. The East Gate is the most stable, and the South Gate... goes deeper than any of us have sailed before."<br><br>"The North Gate could give us wider access and more answers... but it\'s also the riskiest, with unpredictable storms," San says. "The East Gate is safer and more stable, which would let us move supplies and people first," Jade says. "It\'s a solid step... but if we want to get closer to the source of the leviathan\'s activity, the North Gate is the more direct route."<br><br>"Then let\'s not just play it safe," Joel says. "We\'ve handled worse than storms before." "If we go North, we should prepare for rough conditions and longer travel," Devon says. "Agreed. We can also use the data from the East Gate as a backup return route if needed," Sally says. "Then we plan for the North Gate with the East as a fallback," Mezstorm says. "That gives us flexibility and room to adjust."<br><br>"It\'s decided. We head for the North Gate next," San says. "Prepare the expedition. We leave on the next favorable tide," Jade says.<br><br>Next Expedition: The North Gate — Storm Shelf.',
    12: '"The supplies are loaded, stocked, and checked," Aisyah reports. "We have extra rations, repair kits, and pitch for rough weather." "We\'re fully prepared for the North Gate," Joel adds, "and we can still switch to the East Gate if needed."<br><br>"I\'ve marked the East Gate as a fallback route here," Devon says, charting it, "with current readings and an estimated travel time." "If conditions at the North Gate turn against us, we retreat and reroute to the East Gate immediately."<br><br>"The tides are in our favor, the crew is ready, and the route is set," Jade says. "Then let\'s not keep the North Gate waiting," San says. "We go now — with a clear plan, a safe fallback, and one crew at the helm."<br><br>Fair Tide watches as the Crimson Tide sets off once more. With the favorable tide, the Crimson Tide departs Fair Tide and turns its bow toward the North Gate — where the next expedition awaits.',
    13: '"This isn\'t just a storm... two storm fronts, both moving against the wind," Devon says, telescope raised. "And they\'re on the same line — converging from both sides." "Understood. Hold the course," Joel says. "We\'ll take the gap between them. Keep everyone stable — this will be a rough run!"<br><br>"Wait... there\'s land ahead!" Levi calls. "A tower... old, but still standing!" "That tower... it matches the charts of the Storm Shelf routes," Devon says. "We\'re on the right track!" "Good. We made it through the worst of the storm," Joel says. "Then press on," Jade says. "There\'s likely a landing cove near the tower. Let\'s get closer and assess the area."<br><br>The Crimson Tide crosses the Storm Shelf, leaving the twin storms behind, and closes in on the ancient tower ahead.',
    14: '"The tower is larger than it looks from the shore... and it\'s not entirely ruined," Levi says. "The structure is still stable. Let\'s check the lower levels," Sairen adds. Levi and Sairen go ashore to explore the ancient tower, while the Crimson Tide holds position offshore.<br><br>"Keep the survey running while they explore," Jade tells Devon. "I want a full scan of the tower\'s readings and any residual activity." "Aye. The sensors are holding steady. I\'ll log anything unusual immediately."<br><br>Inside, Levi and Sairen find a sealed chamber. "This must have been an observation or recording room." "It\'s a recording chamber... it tracks sea activity — tides, currents, and large-scale energy surges." "Look at this... it\'s a detailed log, not just surface data."<br><br>"...Here. This mark. It\'s recent — within the past few days," Levi says. "It matches the energy signature from the leviathan encounter... The sea is still reacting — to its movement," Sairen says.<br><br>"So the leviathan wasn\'t just passing through," Levi says. "It\'s part of a larger pattern in the Storm Shelf." "Which means this tower wasn\'t just a watch post... it was built to monitor something like it." "We should bring these records back to the ship," Sairen says. "If the sea is still this active, the North Gate may be more than just a route..."',
    15: 'At Fair Tide, the tower\'s record is compared with the harbor readings from the leviathan encounter. "There\'s a second signal here... earlier than the leviathan\'s rise," Erynn says. "It\'s a fainter but clear surge — traveling on the same frequency band." "It\'s not noise," Mimi says. "The pattern is deliberate... like a trigger signal. Something activated the tower first... and that activation was followed by the leviathan response."<br><br>"I checked the old charts... there\'s a marked site off this route that matches the signal\'s timing and range," Adrian says. "It aligns with the recorded surge... and it\'s still active," Fen adds.<br><br>"The second site is likely the origin of the signal — or a linked node," Erynn says. "If it\'s still active, we should investigate it before it triggers another reaction," Adrian says. "Agreed. We\'ll add it to our route," San says. "Whatever activated the tower... we need to know what\'s at that site."<br><br>With a second signal confirmed and a matching site identified, the crew sets their course to investigate what lies beyond the Storm Shelf.',
    16: 'The tower rings as the signal returns — DONG, DONG, DONG. "The signal is back. It\'s coming from the tower," Joel says. "Prepare the log. We\'ll compare this with the harbor readings once the data comes in," Sally says.<br><br>The storm fronts close across the northern passage. At Fair Tide\'s research hall, Adrian and Fen trace a matching marker. "Here — this matches the old chart. An eastern route marker. It\'s in the same position as the signal we saw at the tower," Adrian says. "It\'s faint, but still active," Fen says. "The marker is flashing between the waves."<br><br>Sally spots it from the ship. "There — I can see it! A route marker to the east! It\'s flashing between the waves!"<br><br>The crew moves forward — with the storm closing behind them, and a new path flashing ahead.',
    17: '"The storm\'s closing fast. We follow the fallback route — East by Lantern. It\'s the only passage still open," Devon says, charting the course. "Once we clear the gate, we can ride the outer current and regain clearer waters."<br><br>"Marker one — confirmed!" Sally calls, telescope raised against the rain. "Second ahead... there! Hold our line. The East Gate is active!" "Everyone hold steady!" Joel calls from the helm. "We\'re taking the East Gate now!" "The wind is holding!" Mezstorm says, lightning coursing around her raised hand. "Keep her straight! I\'ll keep the current steady just a little longer!"<br><br>"We\'re through! The East Gate is clear!"',
    18: 'At a sheltered anchorage, San and Jade compare the record with the old chart. "The tower wasn\'t just recording the leviathan\'s movement..." San says. "...it was tracking a signal from beneath the Storm Shelf itself," Jade finishes.<br><br>"Here — the latest reading gives us a bearing," San says. "It\'s a fixed source, deep below the Shelf." "It\'s not random noise," Jade says. "This is a deliberate signal... and someone — or something — keeps it active."<br><br>"Which means there\'s a structure, a locus, or a facility beneath the Shelf," San says. "If the tower could hear it... they must have intended for it to be found." "Then we follow the bearing," Jade says. "It\'s time to see what\'s really beneath the Storm Shelf."',
    19: 'The crew marks a safe approach from the East Gate and prepares to lower a sounding line at the source. "The approach is clear from the East Gate," Devon says. "We\'ll ride the outer current, then drop a sounding line at the source." "We\'ll check depth, current and structure," Sally says. "If the reading matches the tower\'s record, we descend from there."<br><br>"Crew to stations! Prepare the sounding line and winch. Keep the ship steady on my mark," Joel calls. "I\'ll keep the wind steady. Lower it slowly. Let\'s get a clean reading," Mezstorm says.<br><br>The line drops into the dark waters... but it goes slack far too soon. "...That\'s not right," Jade says. "The depth should be far greater than this." If the line found nothing this soon... then the source isn\'t on the surface. It\'s below the Shelf.',
    20: 'The crew hauls up the sounding line after it goes slack far too soon. "It\'s up! ...Wait. Look at this," Joel says. "The weight\'s scraped flat on one side," Levi says. "It hit something — stone, not silt."<br><br>"Let me send a lantern down," Levi says. "If there\'s a ledge or structure there, we\'ll see it." The lantern descends into the dark water. "There — there\'s a ledge! A natural shelf, but... no, it\'s too clean. Someone has been here."<br><br>"A ledge beneath the Storm Shelf..." Joel says. "That\'s our way down." "Then it isn\'t just a signal at all," Levi says. "There\'s something below the Shelf — and we\'re going to find it."',
    21: 'Aisyah sets the watch rotation while Sky readies the infirmary. "We\'ll run the dive in two shifts — entry, survey, and return," Aisyah says. "Keep the rotation tight and the lines clear." "The infirmary is ready," Sky says. "Warming gear, recovery tonics, and treatment kits are set. Bring them back safe."<br><br>"First dive. We go down, mark the ledge, and check for a path beneath it," Levi tells Sairen. "Understood. We keep comms open, mark anything unusual, and return on schedule," Sairen says.<br><br>Jade tracks their progress from the ship, her arcane instruments mapping the dive in real time. "They\'re descending... sixty metres... seventy... They\'ve reached the ledge. Holding steady..."<br><br>"They\'re in position," Jade tells the crew. "Now we wait for their report."'
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

  // Ch.008 ("Hold the Passage") -- the first shared chapter built with a
  // real Crimson Tide-side objective instead of a plain mark-as-read
  // button, per San's cross-game design doc: "position the ship for the
  // tow and hold it steady through the surge." A full combat encounter
  // doesn't fit here any more than Ch.002's leviathan did (Jade and
  // Sally, both shown working the tow, still have no CLASS_KIT), so this
  // is a two-step ship-handling sequence instead, using the crew's
  // existing sails tier (game.ship.sails) for flavor the way Crimson
  // Tide's own core loop already leans on ship stats -- never a hard
  // fail, same as every other story objective in this game; the tier
  // only changes which line plays, not whether the chapter completes.
  // game.crimsonHorizonHoldPassageStep tracks progress through the two
  // steps (0 -> 1 -> complete); left at its final value afterward, same
  // as every other one-off chapter flag in this file.
  window.__ctHoldThePassageStep = function(step){
    game.crimsonHorizonHoldPassageStep = game.crimsonHorizonHoldPassageStep || 0;
    if (step === 1 && game.crimsonHorizonHoldPassageStep === 0) {
      const sails = (game.ship && game.ship.sails) || 1;
      const msg = sails >= 3
        ? '⚓ "I\'ve steadied the current. The passage is open — for now." The Crimson Tide\'s own sails hold her steady without a fight. First boat moves through clean.'
        : '⚓ "I\'ve steadied the current. The passage is open — for now." It takes everything the crew has, but the first boat moves through clean.';
      toast(msg, 3600);
      game.crimsonHorizonHoldPassageStep = 1;
      if (typeof saveGameQuiet === 'function') saveGameQuiet();
      if (typeof renderStory === 'function') renderStory();
    } else if (step === 2 && game.crimsonHorizonHoldPassageStep === 1) {
      toast('🌊 "Just a little more... keep pulling! Don\'t let go!" The second boat clears the gate as it starts to close.', 3600);
      game.crimsonHorizonHoldPassageStep = 2;
      if (typeof markCrimsonHorizonChapterRead === 'function') markCrimsonHorizonChapterRead(9);
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
    const so = window.crimsonHorizonObjectiveState();
    // Act header follows whichever arc the current (next-incomplete)
    // chapter belongs to -- falls back to the last chapter's arc once
    // everything built so far is read, and to Arc I if nothing is
    // unlocked yet. Matches the real comic pages' own per-arc headers.
    const currentChapter = CRIMSON_HORIZON_CHAPTERS.find(c => so === ('complete_crimson_horizon_chapter_' + c.id));
    const headerArc = currentChapter ? currentChapter.arc : CRIMSON_HORIZON_CHAPTERS[CRIMSON_HORIZON_CHAPTERS.length - 1].arc;
    const meta = CRIMSON_HORIZON_ARC_META[headerArc] || CRIMSON_HORIZON_ARC_META[1];
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="'+meta.cover+'" alt="'+esc(meta.kicker+': '+meta.title)+'" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">'+esc(meta.kicker)+'</div><div class="story-act-title">'+esc(meta.title)+'</div>'+
      '<div class="story-act-tagline">'+esc(meta.tagline)+'</div></div>';
    if (!chReady) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Crimson Horizon Locked</div><div class="story-chapter-sub">Reach Level 645 to begin.</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    CRIMSON_HORIZON_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[ch.id]);
      const ready = !done && so===('complete_crimson_horizon_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready && ch.id === 9) {
        // Ch.008 "Hold the Passage" -- real two-step objective, see
        // __ctHoldThePassageStep above, instead of a single mark-read
        // button (San's cross-game shared-chapter design).
        const step = game.crimsonHorizonHoldPassageStep || 0;
        action = (step < 1)
          ? '<button class="btn btn-small btn-success" onclick="window.__ctHoldThePassageStep(1)">⚓ Position the Ship for the Tow</button>'
          : '<button class="btn btn-small btn-success" onclick="window.__ctHoldThePassageStep(2)">🌊 Hold Steady Through the Surge</button>';
      } else if (ready) {
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
