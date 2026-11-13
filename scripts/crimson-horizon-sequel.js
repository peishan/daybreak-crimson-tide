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
  // throughout the outline above) used to get custom per-chapter mini-
  // objectives here; per San's redesign those are gone (see REDESIGN
  // below). The shared story outcomes (008, 026, 039, 042, 044) now play
  // as each chapter's objective-modal check button instead.
  //
  // CRIMSON_HORIZON_CHAPTERS holds Prologue + 001-048 (Arcs I-IV
  // complete). Prologue-041 had their scene text transcribed from the
  // finished comic pages. 042 onward goes back to how every Crimson
  // Tide arc since Arc I was actually written: scene text expanded from
  // San's own 1-2 line chapter descriptions, with the image path
  // registered up front so a bare chNN.png upload gets auto-renamed by
  // the Pages workflow whenever the art exists -- no page reading. Art
  // for 042-048 isn't uploaded yet; nothing renders those paths until
  // it is. San's own numbering runs Prologue, then 001-032
  // continuously straight across Arc I/II/III (no per-arc restart,
  // unlike every numbered arc file before this one, which each reset
  // their own ch.id at 1). The ids here follow that scheme too -- id:1
  // is the Prologue, id:2 is "001", id:3 is "002", and so on -- so later
  // batches can just keep appending without renumbering anything already
  // shipped. Each entry's own `arc` field (1-4) drives which cover/
  // kicker/title the act header below shows, matching the real comic
  // pages' own per-arc page headers.
  //
  // San's own chapter descriptions for all four arcs, kept verbatim as
  // the record of what each chapter was written from.
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
  //   021 The Door Underwater -- Levi and Sairen follow the ledge into an air-filled chamber. The tower's symbol is carved over a door, and the floor trembles in time with the signal. [BUILT]
  //   022 Tea at Fair Tide -- Sera drops in on Fen with tea and finds the research table covered in charts. Fen notices that the mark the crew sent back appears on the old chart at both the Storm Shelf and the West Gate. [BUILT]
  //   023 A Warning for Ships -- Erynn translates the chamber inscription. The station once warned ships away from dangerous currents, but someone has recently altered it to send a much stronger pulse. [BUILT]
  //   024 Three Bells -- A pulse rattles the ship, and Vaeren and Joelle join in as Soel wakes the off-watch crew. Joel establishes a three-bell recall so the dive team can hear the warning through the stone. [BUILT]
  //   025 The Night Log -- Sally compares the tower's timestamps with Joel's battle log. The altered pulse reached the leviathan's waters just before it surfaced, and the station is building toward another transmission. [BUILT]
  //   026 The Channel That Takes It -- Devon and Renn trace the next pulse's path along the outer current. It will reach the East Gate, where ships are already using the same fallback route the crew took. [BUILT -- cross-game handoff: real objective, see __ctPlotThePulseAgainstCurrent]
  //   027 Clear the East Gate -- Sally signals passing ships away while Joel holds the Crimson Tide at the mouth of the channel. Below, Levi and Sairen hear the recall bells just as they find the station's service passage. [BUILT]
  //   028 The Fresh Cut -- Sairen finds a newly fitted coupling that turns the warning signal into a repeating pulse. Jade spots a maintenance bypass on the chamber sketch and guides the divers to it from aboard ship. [BUILT -- narrated; "game handoff" was this file's own earlier framing note, not a confirmed dual-objective chapter like 008/026]
  //   029 Between Two Pulses -- San and Mezstorm steady the water at the dive entrance while Levi and Sairen switch the station to its bypass and remove the coupling. The next warning comes through as a single, quiet bell. [BUILT -- narrated, same note as 028]
  //   030 Back on Deck -- Sky checks the divers as the East Gate reopens to traffic. Aisyah finally gets everyone around the same table, and the twins insist Soel deserves a place on the watch roster. [BUILT]
  //   031 The Mark Beneath the Salt -- Adrian and Fen compare the recovered coupling with the charts. Beneath the salt is a West Gate service mark and a fresh inventory number, giving the crew a way to trace who handled it. [BUILT]
  //   032 Into the Mist Straits -- San and Jade chart a course for the West Gate to trace the coupling. Ends at the edge of the mist, where the first route lantern is lit and the second is missing. [BUILT -- closes Arc III]
  //
  // CRIMSON HORIZON · ARC IV -- THE MIST STRAITS (033-048)
  // The crew follows coupling SV-7729 to the West Gate. The missing
  // lantern from Ch.032 turns out to be part of a false route that
  // leads ships straight into the hands of a salvage crew.
  //   033 The Missing Lantern -- Sally spots a light flashing where the second route marker should be. Joel stops the Crimson Tide when Levi sees that the light is moving against the current. [BUILT]
  //   034 The Pilot's Bell -- A local pilot guides the ship into a sheltered quay by ringing a bell from shore. She tells San that the second lantern vanished three nights ago and two ships have gone aground since. [BUILT]
  //   035 The West Gate Yard -- Jade and Aisyah visit the maintenance yard to ask about SV-7729. The foreman recognizes it as part of a shipment that was signed out for routine beacon repairs. [BUILT]
  //   036 Signed and Transferred -- From Fair Tide, Adrian and Fen send a copy of the transfer record. Sally compares it with the yard's dispatch book and finds three more couplings collected under the same work order. [BUILT]
  //   037 A Place at the Table -- Sky treats a sailor from one of the wrecks over supper aboard the Crimson Tide. When the twins ask how he knew where to sail, he taps out the rhythm of the light he followed. [BUILT]
  //   038 The Wrong Rhythm -- Renn checks the sailor's account against the old pilot codes from Fair Tide. The moving light copied the official signal closely enough to fool anyone approaching in fog. [BUILT]
  //   039 Low Water -- Levi and Sairen follow fresh bootprints across a shoal exposed at low tide. They find the missing lantern mounted on a small skiff, with a West Gate coupling fitted beneath it. [BUILT -- cross-game handoff: real objective, see __ctLowWaterStep]
  //   040 Lights for Sale -- Sally watches the skiff's crew sell cargo stripped from the grounded ships. One of them leaves to set the lantern again just as the evening convoy approaches. [BUILT]
  //   041 The Evening Convoy -- The pilot says the convoy is already beyond sight of shore. San sends Joel and Mezstorm to intercept it while Jade coordinates a shore team to restore the real marker. [BUILT]
  //   042 Through the White Water -- Joel takes the Crimson Tide into the fog while Mezstorm clears brief gaps in it. They reach the convoy as its lead ship begins turning toward the false light. [BUILT -- handoff objective, see __ctWhiteWaterStep]
  //   043 The Lantern Skiff -- Levi and Sairen cut off the skiff's retreat through the shallows. When its crew tries to throw the lantern overboard, Sally pins the release rope to the gunwale from the Crimson Tide. [BUILT -- narrated; part of the same convoy beat as 042]
  //   044 Light the Real Channel -- Jade gets the yard foreman to bring a spare lantern to the empty post. Once it's lit, Joel leads the convoy through the true channel to the waiting pilot. [BUILT -- handoff objective, see __ctLightTheRealChannel]
  //   045 The Salvage Ledger -- The harbor pilot takes the recovered ledger to the families of the wrecked crews so they can reclaim their cargo. The entries show the salvage crew used several couplings locally and sold one on to the Storm Shelf. [BUILT]
  //   046 The Last Crate South -- Fen traces the final coupling from the shipment to an unopened crate still awaiting pickup. Its delivery instructions name the South Gate · Deep Channel, with a tide and berth but no recipient. [BUILT]
  //   047 A Light of Their Own -- The yard crew restores the permanent marker, and the pilot invites the twins to ring the quay bell for the first ship safely through. San asks her to teach the crew the local signals before they sail. [BUILT]
  //   048 The Deep Channel -- San and Jade take the delivery instructions south to see who comes for the crate. At the rendezvous berth, they find a mooring rope pulled taut into water too deep for any dock. [BUILT -- closes Arc IV; opens the Deep Channel route]
  //
  // Cover/chapter art is the real uploaded pages, not placeholders --
  // assets/comics/sequel/. arc1-cover-a-new-voyage.webp, arc2-cover-
  // storm-shelf.webp, arc3-cover-beneath-the-storm-shelf.webp and
  // arc4-cover-the-mist-straits.webp are each arc's own cover (ARC_META below, used in the act header);
  // crimson-horizon-cover.webp is the separate one-time splash
  // announcing the sequel, shown the instant Arc XLII completes
  // regardless of the Level 645 chapter gate -- see
  // __ctShowCrimsonHorizonSplash below. Portraits for this sequel's new
  // look (San, Joel, Jade, Devon, Sky, Levi, Sally) live separately under
  // assets/portraits/sequel/, not yet wired into ALL_PARTY/CLASS_KIT.
  // -------------------------------------------------------------------

  // -------------------------------------------------------------------
  // REDESIGN (Crimson Tide side): the sequel plays as DESTINATIONS, not a
  // list of mini-objectives. See the PORTS block below. Chapters are
  // modal story chapters (Read Chapter -> objective modal -> Continue);
  // the five old custom objectives (008, 026, 039, 042, 044) are gone --
  // their outcomes now play as the objective modal's own check button,
  // and chapters that depict a fight (002, 058, 059) use existing DCT
  // combat. Completed chapters, claimed XP and route unlocks in existing
  // saves are untouched: every port unlock is derived from
  // game.comicProgressCrimsonHorizon.
  //
  // CRIMSON HORIZON · ARC V -- THE DEEP CHANNEL (049-064) [BUILT, text-first]
  // South Gate · Deep Channel, Berth B-12, high tide Day 8, consignment
  // SV-7740, recipient blank. Outcome: discover who ordered the coupling,
  // free the pilots forced to navigate the hidden passage, restore the
  // South Gate's public route; the dispatch book points to the Central Gate.
  //   049-052 Find the hidden berth: Berth B-12 / No Name on the Manifest / High Tide, Day Eight / The Berth Behind the Rock
  //   053-056 Learn who controls the passage: The Pilots Below / The Channel Keeper / The Original Passage / Before the Water Turns
  //   057-061 Free the pilots, reopen the gate: The Bunkroom Key / Hold the Launch (fight) / The Keeper's Last Order (fight) / Open the Public Channel / First Ship Through
  //   062-064 Close the case, chart the next route: The Dispatch Book / The Pilots Come Home / The Central Bearing
  // Checkpoints: pilots' rescue after 058, dispatch book after 059, gate
  // restoration after 060 (a retry starts at the current objective and
  // keeps earlier clears). Completing 048 opens the South Gate expedition;
  // 061 opens regular travel; 064 charts the Central Gate (Arc VI).
  // -------------------------------------------------------------------

  // -------------------------------------------------------------------
  // CRIMSON HORIZON · ARC VI -- A PLACE TO COME HOME TO (065-069, "A New
  // Shore") [BUILT, text-first]. Immediately after 064. San and Joel stay
  // the principal viewpoint. Theme: finding somewhere new can change what
  // you want to come home to.
  //   065 Beyond the Central Gate -- through the gate at first light into a busy island harbor.
  //   066 A Day Ashore -- market, waterfront, and Jade's first unarranged trip (a harbor bench).
  //   067 The Boat That Couldn't Leave -- a damaged skipper; San offers passage for her and her cargo.
  //   068 The Story I Left Behind -- San tells Jade about the manuscript (Imperial Guard Meets
  //       Runaway Prince, later Tangled with the Runaway Prince). Joel already knows from Meet the Maker.
  //   069 Around the Same Time -- Jade/Sally's due dates may overlap; tell Devon after the outer island.
  // Game: 065 unlocks Island Harbor (the working name -- the outline never names it) as a standard
  // port; Central Gate is now selectable after 064 and 065 plays there. 067 sets
  // game.crimsonHorizonProvisionsRunReady for the next batch, which unlocks the outer island on
  // arrival. The next substantial Black Pearl development takes place at Fair Tide.
  // -------------------------------------------------------------------

  // -------------------------------------------------------------------
  // CRIMSON HORIZON · ARC VII -- THE OUTER ISLAND RUN (070-074) [BUILT,
  // text-first]. Immediately after 069; the provisions run carries the
  // crew from Arc VI into a new destination. Coastal exploration, warm
  // humour, quiet relationship moments. The due dates are still estimates.
  //   070 The Landing at Low Tide -- reef guided by the skipper; anchor in the lee; provisions by islanders' boats.
  //   071 Two Dates on the Calendar -- Jade tells Devon (he counts aloud); Sally tells Levi; where home will be.
  //   072 The Road Over the Ridge -- ridge market; sheltered channel; the skipper's outgoing mail goes back to the harbor.
  //   073 How It Began -- San tells Jade how the manuscript began; Jade's version; Devon stays to hear it.
  //   074 A Route Worth Keeping -- back at the harbor with the mail; Joel charts the channel; San points to an island.
  // Game: Outer Island is sailable once 069 is read (the provisions run)
  // and becomes a regular port after 070 (Make Landfall). 070-073 play at
  // Outer Island; 074 plays back at Island Harbor. 074 sets
  // game.crimsonHorizonNeighbourIslandSet for a future arrival. The next
  // substantial Black Pearl development belongs at Fair Tide.
  // -------------------------------------------------------------------

  // -------------------------------------------------------------------
  // CRIMSON HORIZON · ARC VIII -- A HARBOR FOR EVERYONE (075-082) [BUILT,
  // text-first]. Immediately after 074. The crew explores the next island
  // along the sheltered channel, helps reopen its public landing, and
  // returns to Fair Tide for the first Black Pearl briefing.
  //   075 Across the Sheltered Channel -- deepwater quay; the small boats circle; the public landing lost its gangway.
  //   076 The Price of a Berth -- the berth fee; San offers the tender; what would it take to reopen the landing?
  //   077 The Boatbuilder's Yard -- a finished gangway the workboat can't carry; Joel's tackle; she comes along.
  //   078 A Landing of Their Own -- the gangway set in place; the first boat in is late for lunch; provisions.
  //   079 The Cabin Across the Hall -- on the way back: where Jade and Sally would each want to stay.
  //   080 A Place at the Table -- Sera, Jade and Sally at Fair Tide; the parcel from the island market.
  //   081 What Devon Entrusted -- the first Black Pearl briefing. A SIDE chapter (CH_SIDE): opens from
  //       Research Team -> Black Pearl Study when Erynn's and Fen's reports are in and the player is at
  //       Fair Tide, so research time never holds up 082 or the next voyage.
  //   082 The Next Sailing -- the chart, the three places beyond the Central Gate, a copy for the harbor office.
  // Game: Channel Island (working name) is sailable after 074 and a regular port after 075; 075-078 play
  // there. 079 plays at sea on the way to Fair Tide and chains into 080; 080-082 play at Fair Tide.
  // -------------------------------------------------------------------

  // -------------------------------------------------------------------
  // CRIMSON HORIZON · ARC IX -- THE FAR SIDE OF THE HEADLAND (083-090)
  // [BUILT, text-first]. After 082, as the Crimson Tide prepares to leave
  // Fair Tide. The crew opens a route to a cliffside trading port, and
  // Sairen and Jovie begin talking about what they want from each other
  // between voyages.
  //   083 Before the Tide Turns -- Jovie, the infirmary stores, "I'll write." (Fair Tide)
  //   084 Beyond the Headland -- a cloth trader guides the crew around the headland (Channel Island)
  //   085 The Market on the Steps -- the stair market; one working hoist (cliffside port)
  //   086 Room on the Quay -- the gust; Joel takes the arriving ship's line with the tender
  //   087 A Letter with No Report in It -- Sairen's letter to Jovie
  //   088 The Lower Market -- Aisyah's standing order opens quay-level trade
  //   089 The First Observations -- SIDE chapter (Fair Tide): Renn and Mimi's accounts, compared by Adrian
  //   090 When You're Back -- home; Jovie got the letter; "take me there someday"
  // DRAFT ADDITIONS (for review): the cliffside port (Terrace Harbor, working name) and its trade goods
  // (Sailcloth, Dried Fruit); Sairen's letter kept in the Bonds tab; the observation scene, which leaves
  // the Pearl's properties and eventual return open.
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
    {id:21, arc:3, title:'020 · The Dive Watch', focus:"Aisyah sets the watch rotation and Sky readies the infirmary. Levi and Sairen take the first dive while Jade tracks their progress from the ship.", image:'assets/comics/sequel/ch20-the-dive-watch.webp', xp:420, action:'🤿 Begin the Dive Watch'},
    {id:22, arc:3, title:'021 · The Door Underwater', focus:"Levi and Sairen follow the ledge into an air-filled chamber. The tower's symbol is carved over a sealed door, and the floor trembles in time with the signal — the door is responding to them.", image:'assets/comics/sequel/ch21-the-door-underwater.webp', xp:420, action:'🚪 Open the Door Underwater'},
    {id:23, arc:3, title:'022 · Tea at Fair Tide', focus:"Sera drops in on Fen with tea and finds the research table covered in charts. Fen notices that the mark the crew sent back appears on the old chart at both the Storm Shelf and the West Gate.", image:'assets/comics/sequel/ch22-tea-at-fair-tide.webp', xp:400, action:'🍵 Share Tea at Fair Tide'},
    {id:24, arc:3, title:'023 · A Warning for Ships', focus:"Erynn translates the chamber inscription. The station once warned ships away from dangerous currents, but someone has recently altered it to send a much stronger pulse.", image:'assets/comics/sequel/ch23-a-warning-for-ships.webp', xp:420, action:'📖 Read A Warning for Ships'},
    {id:25, arc:3, title:'024 · Three Bells', focus:"A pulse rattles the ship, and Vaeren and Joelle join in as Soel wakes the off-watch crew. Joel establishes a three-bell recall so the dive team can hear the warning through the stone.", image:'assets/comics/sequel/ch24-three-bells.webp', xp:410, action:'🔔 Sound Three Bells'},
    {id:26, arc:3, title:'025 · The Night Log', focus:"Sally compares the tower's timestamps with Joel's battle log. The altered pulse reached the leviathan's waters just before it surfaced, and the station is building toward another transmission.", image:'assets/comics/sequel/ch25-the-night-log.webp', xp:420, action:'📔 Cross-Check the Night Log'},
    {id:27, arc:3, title:'026 · The Channel That Takes It', focus:"Devon and Renn trace the next pulse's path along the outer current. It will reach the East Gate, where ships are already using the same fallback route the crew took.", image:'assets/comics/sequel/ch26-the-channel-that-takes-it.webp', xp:430, action:'🗺️ Plot the Pulse Against the Current'},
    {id:28, arc:3, title:'027 · Clear the East Gate', focus:"Sally signals passing ships away while Joel holds the Crimson Tide at the mouth of the channel. Below, Levi and Sairen hear the recall bells just as they find the station's service passage.", image:'assets/comics/sequel/ch27-clear-the-east-gate.webp', xp:420, action:'🚦 Clear the East Gate'},
    {id:29, arc:3, title:'028 · The Fresh Cut', focus:"Sairen finds a newly fitted coupling that turns the warning signal into a repeating pulse. Jade spots a maintenance bypass on the chamber sketch and guides the divers to it from aboard ship.", image:'assets/comics/sequel/ch28-the-fresh-cut.webp', xp:420, action:'🔧 Trace the Fresh Cut'},
    {id:30, arc:3, title:'029 · Between Two Pulses', focus:"San and Mezstorm steady the water at the dive entrance while Levi and Sairen switch the station to its bypass and remove the coupling. The next warning comes through as a single, quiet bell.", image:'assets/comics/sequel/ch29-between-two-pulses.webp', xp:420, action:'🔔 Weather Between Two Pulses'},
    {id:31, arc:3, title:'030 · Back on Deck', focus:"Sky checks the divers as the East Gate reopens to traffic. Aisyah finally gets everyone around the same table, and the twins insist Soel deserves a place on the watch roster.", image:'assets/comics/sequel/ch30-back-on-deck.webp', xp:400, action:'🍽️ Gather Back on Deck'},
    {id:32, arc:3, title:'031 · The Mark Beneath the Salt', focus:"Adrian and Fen compare the recovered coupling with the charts. Beneath the salt is a West Gate service mark and a fresh inventory number, giving the crew a way to trace who handled it.", image:'assets/comics/sequel/ch31-the-mark-beneath-the-salt.webp', xp:420, action:'🔍 Find the Mark Beneath the Salt'},
    {id:33, arc:3, title:'032 · Into the Mist Straits', focus:"San and Jade chart a course for the West Gate to trace the coupling. The comic ends at the edge of the mist, where the first route lantern is lit and the second is missing.", image:'assets/comics/sequel/ch32-into-the-mist-straits.webp', xp:430, action:'🌫️ Sail Into the Mist Straits'},
    {id:34, arc:4, title:'033 · The Missing Lantern', focus:"Sally spots a light flashing where the second route marker should be. Joel stops the Crimson Tide when Levi sees that the light is moving against the current.", image:'assets/comics/sequel/ch33-the-missing-lantern.webp', xp:410, action:'🏮 Sight the Missing Lantern'},
    {id:35, arc:4, title:"034 · The Pilot's Bell", focus:"A local pilot guides the ship into a sheltered quay by ringing a bell from shore. She tells San that the second lantern vanished three nights ago and two ships have gone aground since.", image:'assets/comics/sequel/ch34-the-pilots-bell.webp', xp:410, action:"🔔 Follow the Pilot's Bell"},
    {id:36, arc:4, title:'035 · The West Gate Yard', focus:"Jade and Aisyah visit the maintenance yard to ask about SV-7729. The foreman recognizes it as part of a shipment that was signed out for routine beacon repairs.", image:'assets/comics/sequel/ch35-the-west-gate-yard.webp', xp:410, action:'🏗️ Visit the West Gate Yard'},
    {id:37, arc:4, title:'036 · Signed and Transferred', focus:"From Fair Tide, Adrian and Fen send a copy of the transfer record. Sally compares it with the yard's dispatch book and finds three more couplings collected under the same work order.", image:'assets/comics/sequel/ch36-signed-and-transferred.webp', xp:420, action:'📋 Compare What Was Signed and Transferred'},
    {id:38, arc:4, title:'037 · A Place at the Table', focus:"Sky treats a sailor from one of the wrecks over supper aboard the Crimson Tide. When the twins ask how he knew where to sail, he taps out the rhythm of the light he followed.", image:'assets/comics/sequel/ch37-a-place-at-the-table.webp', xp:400, action:'🍲 Offer a Place at the Table'},
    {id:39, arc:4, title:'038 · The Wrong Rhythm', focus:"Renn checks the sailor's account against the old pilot codes from Fair Tide. The moving light copied the official signal closely enough to fool anyone approaching in fog.", image:'assets/comics/sequel/ch38-the-wrong-rhythm.webp', xp:420, action:'🎼 Decode the Wrong Rhythm'},
    {id:40, arc:4, title:'039 · Low Water', focus:"Levi and Sairen follow fresh bootprints across a shoal exposed at low tide. They find the missing lantern mounted on a small skiff, with a West Gate coupling fitted beneath it.", image:'assets/comics/sequel/ch39-low-water.webp', xp:430, action:'🌊 Launch the Shore Expedition'},
    {id:41, arc:4, title:'040 · Lights for Sale', focus:"Sally watches the skiff's crew sell cargo stripped from the grounded ships. One of them leaves to set the lantern again just as the evening convoy approaches.", image:'assets/comics/sequel/ch40-lights-for-sale.webp', xp:410, action:'🔭 Watch the Lights for Sale'},
    {id:42, arc:4, title:'041 · The Evening Convoy', focus:"The pilot says the convoy is already beyond sight of shore. San sends Joel and Mezstorm to intercept it while Jade coordinates a shore team to restore the real marker.", image:'assets/comics/sequel/ch41-the-evening-convoy.webp', xp:420, action:'⛵ Split for the Evening Convoy'},
    {id:43, arc:4, title:'042 · Through the White Water', focus:"Joel takes the Crimson Tide into the fog while Mezstorm clears brief gaps in it. They reach the convoy as its lead ship begins turning toward the false light.", image:'assets/comics/sequel/ch42-through-the-white-water.webp', xp:430, action:'🌫️ Steer Into the White Water'},
    {id:44, arc:4, title:'043 · The Lantern Skiff', focus:"Levi and Sairen cut off the skiff's retreat through the shallows. When its crew tries to throw the lantern overboard, Sally pins the release rope to the gunwale from the Crimson Tide.", image:'assets/comics/sequel/ch43-the-lantern-skiff.webp', xp:420, action:'🏹 Corner the Lantern Skiff'},
    {id:45, arc:4, title:'044 · Light the Real Channel', focus:"Jade gets the yard foreman to bring a spare lantern to the empty post. Once it's lit, Joel leads the convoy through the true channel to the waiting pilot.", image:'assets/comics/sequel/ch44-light-the-real-channel.webp', xp:430, action:'🏮 Light the Real Channel'},
    {id:46, arc:4, title:'045 · The Salvage Ledger', focus:"The harbor pilot takes the recovered ledger to the families of the wrecked crews so they can reclaim their cargo. The entries show the salvage crew used several couplings locally and sold one on to the Storm Shelf.", image:'assets/comics/sequel/ch45-the-salvage-ledger.webp', xp:410, action:'📒 Open the Salvage Ledger'},
    {id:47, arc:4, title:'046 · The Last Crate South', focus:"Fen traces the final coupling from the shipment to an unopened crate still awaiting pickup. Its delivery instructions name the South Gate · Deep Channel, with a tide and berth but no recipient.", image:'assets/comics/sequel/ch46-the-last-crate-south.webp', xp:410, action:'📦 Trace the Last Crate South'},
    {id:48, arc:4, title:'047 · A Light of Their Own', focus:"The yard crew restores the permanent marker, and the pilot invites the twins to ring the quay bell for the first ship safely through. San asks her to teach the crew the local signals before they sail.", image:'assets/comics/sequel/ch47-a-light-of-their-own.webp', xp:400, action:'🔔 Ring In a Light of Their Own'},
    {id:49, arc:4, title:'048 · The Deep Channel', focus:"San and Jade take the delivery instructions south to see who comes for the crate. At the rendezvous berth, they find a mooring rope pulled taut into water too deep for any dock.", image:'assets/comics/sequel/ch48-the-deep-channel.webp', xp:430, action:'⚓ Follow the Line Into the Deep Channel'},
    {id:50, arc:5, title:"049 · Berth B-12", focus:"Joel holds the Crimson Tide offshore while Levi and Sairen inspect the line from a launch. They find a submerged guide ring and fresh wear on the rope, showing that small boats still use it.", image:'assets/comics/sequel/ch49-berth-b-12.webp', xp:440, action:'📖 Read Chapter'},
    {id:51, arc:5, title:"050 · No Name on the Manifest", focus:"In Fair Tide, Fen and Adrian verify the contents of SV-7740 and secure the coupling. Renn sends Devon the berth instructions and a copy of the seal, and Sally proposes watching the pickup with a substitute crate.", image:'assets/comics/sequel/ch50-no-name-on-the-manifest.webp', xp:440, action:'📖 Read Chapter'},
    {id:52, arc:5, title:"051 · High Tide, Day Eight", focus:"A tender follows the line into B-12. Sally watches from cover as its crew takes the marked crate and signals someone beyond the rocks, and Joel lets the tender get ahead before launching the pursuit.", image:'assets/comics/sequel/ch51-high-tide-day-eight.webp', xp:445, action:'📖 Read Chapter'},
    {id:53, arc:5, title:"052 · The Berth Behind the Rock", focus:"At high tide, the submerged line leads the tender through a narrow opening in the cliff. The scouts find an old rescue dock, a storage loft, and a haulage lift connecting the dock to an upper passage.", image:'assets/comics/sequel/ch52-the-berth-behind-the-rock.webp', xp:445, action:'📖 Read Chapter'},
    {id:54, arc:5, title:"053 · The Pilots Below", focus:"Levi and Sairen overhear a captive pilot refusing to take another boat through the passage. A second pilot slips them a message with a tally of the people being held and the location of the bunkroom.", image:'assets/comics/sequel/ch53-the-pilots-below.webp', xp:450, action:'📖 Read Chapter'},
    {id:55, arc:5, title:"054 · The Channel Keeper", focus:"The current Channel Keeper inspects the delivery. The scouts hear him demand the missing coupling so he can operate the public gate and the hidden passage independently, holding pilots to run his private route while regular traffic waits outside.", image:'assets/comics/sequel/ch54-the-channel-keeper.webp', xp:450, action:'📖 Read Chapter'},
    {id:56, arc:5, title:"055 · The Original Passage", focus:"Erynn identifies the dock as part of an old rescue route. Renn sends a restoration diagram to Devon aboard the ship, and Jade spots that opening the public gate will flood the lower service stairs.", image:'assets/comics/sequel/ch55-the-original-passage.webp', xp:455, action:'📖 Read Chapter'},
    {id:57, arc:5, title:"056 · Before the Water Turns", focus:"San assigns the extraction, ship, and gate teams. Aisyah stages supplies for the freed pilots, Sky clears space aboard, and Jade and Sally coordinate from protected positions.", image:'assets/comics/sequel/ch56-before-the-water-turns.webp', xp:455, action:'📖 Read Chapter'},
    {id:58, arc:5, title:"057 · The Bunkroom Key", focus:"Levi and Sairen enter through the storage loft and reach the locked bunkroom. One pilot can barely walk, so the team takes the upper passage slowly while Sally keeps watch on the dock.", image:'assets/comics/sequel/ch57-the-bunkroom-key.webp', xp:460, action:'📖 Read Chapter'},
    {id:59, arc:5, title:"058 · Hold the Launch", focus:"Joel brings the launch alongside the upper landing while the Keeper's tender tries to block it. San and Mezstorm steady the water long enough for the pilots to board.", image:'assets/comics/sequel/ch58-hold-the-launch.webp', xp:465, action:'📖 Read Chapter'},
    {id:60, arc:5, title:"059 · The Keeper’s Last Order", focus:"The Keeper retreats to the control room and orders his guards to destroy the records while he tries to flood the stairs. The party has to take the controls before he can cut off access to the gate mechanism.", image:'assets/comics/sequel/ch59-the-keepers-last-order.webp', xp:480, action:'📖 Read Chapter'},
    {id:61, arc:5, title:"060 · Open the Public Channel", focus:"Jade relays the restoration sequence from the ship. The gate team confirms the lower stairs are empty, shuts the private bypass, and opens the public gate.", image:'assets/comics/sequel/ch60-open-the-public-channel.webp', xp:470, action:'📖 Read Chapter'},
    {id:62, arc:5, title:"061 · First Ship Through", focus:"One of the freed pilots volunteers to guide a waiting vessel through the reopened channel. Joel follows at a distance while the shore team watches for any change in the current.", image:'assets/comics/sequel/ch61-first-ship-through.webp', xp:480, action:'📖 Read Chapter'},
    {id:63, arc:5, title:"062 · The Dispatch Book", focus:"Fen and Adrian match the Keeper's dispatch book to the West Gate records. The same operation bought the Storm Shelf coupling and kept the South Gate order under SV-7740, and a separate entry schedules a service delivery at the Central Gate.", image:'assets/comics/sequel/ch62-the-dispatch-book.webp', xp:480, action:'📖 Read Chapter'},
    {id:64, arc:5, title:"063 · The Pilots Come Home", focus:"The freed pilots return ashore. One gives the crew a corrected chart marking the public lane and the rescue berth, and asks that both be shared with other ships.", image:'assets/comics/sequel/ch63-the-pilots-come-home.webp', xp:485, action:'📖 Read Chapter'},
    {id:65, arc:5, title:"064 · The Central Bearing", focus:"San and Jade agree to investigate the Central Gate after the South Gate is back in local hands. Devon plots the approach from the corrected chart, and a signal from the Central Gate answers before they reach its first marker.", image:'assets/comics/sequel/ch64-the-central-bearing.webp', xp:500, action:'📖 Read Chapter'},
    {id:66, arc:6, title:"065 · Beyond the Central Gate", focus:"Joel takes the Crimson Tide through the Central Gate at first light. Beyond it, small trading boats are already sailing out of a busy island harbor, and a local pilot waves the crew toward the quay.", image:'assets/comics/sequel/ch65-beyond-the-central-gate.webp', xp:500, action:'📖 Read Chapter'},
    {id:67, arc:6, title:"066 · A Day Ashore", focus:"Aisyah heads for the market while Joel takes Vaeren, Joelle and Soel along the waterfront. San and Jade go looking for food and end up sharing a harbor bench, where Jade tells San about the first time she travelled without anyone from the court arranging her day.", image:'assets/comics/sequel/ch66-a-day-ashore.webp', xp:500, action:'📖 Read Chapter'},
    {id:68, arc:6, title:"067 · The Boat That Couldn’t Leave", focus:"San and Joel find a local skipper at the quay whose boat was damaged before she could take provisions to an outer island. San offers room aboard the Crimson Tide for her and her cargo, and Joel asks her to show them where she normally lands.", image:'assets/comics/sequel/ch67-the-boat-that-couldnt-leave.webp', xp:505, action:'📖 Read Chapter'},
    {id:69, arc:6, title:"068 · The Story I Left Behind", focus:"That evening, San asks Jade to stay on deck after the others go below. She tells her about the manuscript, Imperial Guard Meets Runaway Prince, and admits she recognized Jade and Devon's names the day they met in Lunareth.", image:'assets/comics/sequel/ch68-the-story-i-left-behind.webp', xp:540, action:'📖 Read Chapter'},
    {id:70, arc:6, title:"069 · Around the Same Time", focus:"As the crew prepares to sail, Jade and Sally compare their expected dates. They could still go into labour around the same time, and they agree to tell Devon and Levi after the provisions are unloaded on the outer island.", image:'assets/comics/sequel/ch69-around-the-same-time.webp', xp:510, action:'📖 Read Chapter'},
    {id:71, arc:7, title:"070 · The Landing at Low Tide", focus:"The skipper guides Joel around the outer island's reef, but her usual landing is too shallow for the Crimson Tide. Joel anchors in the lee while San arranges to bring the provisions ashore in the islanders' small boats.", image:'assets/comics/sequel/ch70-the-landing-at-low-tide.webp', xp:520, action:'📖 Read Chapter'},
    {id:72, arc:7, title:"071 · Two Dates on the Calendar", focus:"After the cargo is unloaded, Jade tells Devon that she and Sally might go into labour around the same time, and Sally tells Levi separately. Their conversations turn to where they'd each want to be when the time comes, and who they'd want nearby.", image:'assets/comics/sequel/ch71-two-dates-on-the-calendar.webp', xp:520, action:'📖 Read Chapter'},
    {id:73, arc:7, title:"072 · The Road Over the Ridge", focus:"Aisyah heads inland to see what the island trades, and San and Joel walk with her to the ridge market. From the top they can see boats working a sheltered channel toward the neighbouring islands, and the skipper asks if they'll take her outgoing mail back to the harbor.", image:'assets/comics/sequel/ch72-the-road-over-the-ridge.webp', xp:525, action:'📖 Read Chapter'},
    {id:74, arc:7, title:"073 · How It Began", focus:"Back aboard, San tells Jade how the earliest version of Imperial Guard Meets Runaway Prince began. Jade listens until San reaches the first decision she remembers making differently, then tells San what she remembers and why she made that choice.", image:'assets/comics/sequel/ch73-how-it-began.webp', xp:545, action:'📖 Read Chapter'},
    {id:75, arc:7, title:"074 · A Route Worth Keeping", focus:"The Crimson Tide returns to the harbor with the mail. Aisyah asks which market days are worth sailing back for, and before they cast off again Joel marks the sheltered channel on their chart and asks San where she wants to go next.", image:'assets/comics/sequel/ch74-a-route-worth-keeping.webp', xp:530, action:'📖 Read Chapter'},
    {id:76, arc:8, title:"075 · Across the Sheltered Channel", focus:"Joel follows the route charted in 074 to the neighbouring island. Its deepwater quay is busy, but the smaller boats are circling offshore, because the public landing lost its gangway in the last heavy swell.", image:'assets/comics/sequel/ch75-across-the-sheltered-channel.webp', xp:535, action:'📖 Read Chapter'},
    {id:77, arc:8, title:"076 · The Price of a Berth", focus:"At the market, Aisyah sees a fish seller turn away a customer because her brother's catch is still aboard their boat. San offers to bring the fish ashore in the ship's tender, then asks the harbor pilot what it would take to reopen the public landing.", image:'assets/comics/sequel/ch76-the-price-of-a-berth.webp', xp:535, action:'📖 Read Chapter'},
    {id:78, arc:8, title:"077 · The Boatbuilder’s Yard", focus:"The local boatbuilder has a replacement gangway ready, but her yard sits across the bay and her workboat can't carry it in one piece. Joel offers the Crimson Tide's tackle, and the boatbuilder insists on coming along to fit it herself.", image:'assets/comics/sequel/ch77-the-boatbuilders-yard.webp', xp:540, action:'📖 Read Chapter'},
    {id:79, arc:8, title:"078 · A Landing of Their Own", focus:"Joel holds the ship steady while the boatbuilder guides the gangway into place and the islanders secure it from shore. The fish seller's brother brings in the first boat, and Aisyah buys provisions from the stalls that can finally restock.", image:'assets/comics/sequel/ch78-a-landing-of-their-own.webp', xp:540, action:'📖 Read Chapter'},
    {id:80, arc:8, title:"079 · The Cabin Across the Hall", focus:"On the way back to Fair Tide, Devon asks Jade where she'd want to stay if her due window does overlap with Sally's. Sally tells Levi she wants a room of her own and Jade close enough to complain through the wall.", image:'assets/comics/sequel/ch79-the-cabin-across-the-hall.webp', xp:545, action:'📖 Read Chapter'},
    {id:81, arc:8, title:"080 · A Place at the Table", focus:"At Fair Tide, Sera joins Jade and Sally for a meal while the others unload. She says she's grown fond of deciding how to spend a day before anyone else decides for her, and Sally hands her a parcel from the island market.", image:'assets/comics/sequel/ch80-a-place-at-the-table.webp', xp:545, action:'📖 Read Chapter'},
    {id:82, arc:8, title:"081 · What Devon Entrusted", focus:"At the first Black Pearl briefing, Erynn presents Devon's account and Fen shows which parts she can corroborate in Dragonvale's records. San and Joel agree that the study should begin with observation.", image:'assets/comics/sequel/ch81-what-devon-entrusted.webp', xp:540, action:'📖 Read Chapter'},
    {id:83, arc:8, title:"082 · The Next Sailing", focus:"San and Joel look over the chart at Fair Tide. They now have three places they can sail back to beyond the Central Gate, and San asks Joel to leave a copy of the route with the harbor office for the next captain.", image:'assets/comics/sequel/ch82-the-next-sailing.webp', xp:550, action:'📖 Read Chapter'},
    {id:84, arc:9, title:"083 · Before the Tide Turns", focus:"Jovie brings the infirmary's supplies to the ship and finds Sairen checking the boarding ramp. She asks when he expects to be back, and he promises to write if the voyage runs long.", image:'assets/comics/sequel/ch83-before-the-tide-turns.webp', xp:555, action:'📖 Read Chapter'},
    {id:85, arc:9, title:"084 · Beyond the Headland", focus:"At the public landing the crew helped reopen, Aisyah meets a cloth trader bound for a port beyond the headland. She offers to guide them there, and Joel follows her directions to a deepwater harbor beneath terraced gardens.", image:'assets/comics/sequel/ch84-beyond-the-headland.webp', xp:555, action:'📖 Read Chapter'},
    {id:86, arc:9, title:"085 · The Market on the Steps", focus:"Aisyah follows the trader up to the market, where sailors buy sailcloth and garden growers trade dried fruit. San sees that the upper market has room for both, while the lower quay is packed with cargo waiting to go uphill.", image:'assets/comics/sequel/ch85-the-market-on-the-steps.webp', xp:560, action:'📖 Read Chapter'},
    {id:87, arc:9, title:"086 · Room on the Quay", focus:"The harbor master asks Joel to move the Crimson Tide to the outer anchorage. When the arriving ship is pushed toward the quay by a hard gust, Joel brings the tender alongside and takes its line in.", image:'assets/comics/sequel/ch86-room-on-the-quay.webp', xp:565, action:'📖 Read Chapter'},
    {id:88, arc:9, title:"087 · A Letter with No Report in It", focus:"Once the quay settles, Sairen sits down to write to Jovie. His first attempt reads like a watch report, so he starts again and tells her about the market stairs, the view, and the stall he thinks she'd stop at first.", image:'assets/comics/sequel/ch87-a-letter-with-no-report-in-it.webp', xp:565, action:'📖 Read Chapter'},
    {id:89, arc:9, title:"088 · The Lower Market", focus:"The cloth trader asks Aisyah to help her make a case for selling some goods at quay level on busy days. Aisyah puts in a standing order for sailcloth that can be collected there, giving the harbor master a reason to try it.", image:'assets/comics/sequel/ch88-the-lower-market.webp', xp:565, action:'📖 Read Chapter'},
    {id:90, arc:9, title:"089 · The First Observations", focus:"At Fair Tide, Renn records the conditions around the Black Pearl while Mimi keeps a separate account of her impressions. Adrian has them compare notes only after both have finished.", image:'assets/comics/sequel/ch89-the-first-observations.webp', xp:545, action:'📖 Read Chapter'},
    {id:91, arc:9, title:"090 · When You’re Back", focus:"The crew returns to Fair Tide with sailcloth for the ship and dried fruit for the galley. Jovie tells Sairen she got his letter and asks him to take her to the cliffside market someday.", image:'assets/comics/sequel/ch90-when-youre-back.webp', xp:580, action:'📖 Read Chapter'}
  ];
  window.CRIMSON_HORIZON_CHAPTERS = CRIMSON_HORIZON_CHAPTERS;

  const CRIMSON_HORIZON_ARC_META = {
    1: {cover:'assets/comics/sequel/arc1-cover-a-new-voyage.webp', kicker:'Crimson Horizon · Arc I', title:'A New Voyage', tagline:'One crew. Two worlds. A wider horizon.'},
    2: {cover:'assets/comics/sequel/arc2-cover-storm-shelf.webp', kicker:'Crimson Horizon · Arc II', title:'Storm Shelf', tagline:'Something beneath the Shelf has been waiting to be found.'},
    3: {cover:'assets/comics/sequel/arc3-cover-beneath-the-storm-shelf.webp', kicker:'Crimson Horizon · Arc III', title:'Beneath the Storm Shelf', tagline:'The signal was never random. Someone kept it active.'},
    4: {cover:'assets/comics/sequel/arc4-cover-the-mist-straits.webp', kicker:'Crimson Horizon · Arc IV', title:'The Mist Straits', tagline:'In the Straits, a light is not always a way home.'},
    5: {cover:null, kicker:'Crimson Horizon · Arc V', title:'The Deep Channel', tagline:'Some channels are hidden because someone wants them used quietly.'},
    6: {cover:null, kicker:'Crimson Horizon · Arc VI', title:'A Place to Come Home To', tagline:'Finding somewhere new can change what you want to come home to.'},
    7: {cover:null, kicker:'Crimson Horizon · Arc VII', title:'The Outer Island Run', tagline:'A delivery, a ridge road, and the shape of a future home.'},
    8: {cover:null, kicker:'Crimson Horizon · Arc VIII', title:'A Harbor for Everyone', tagline:'A harbor is only as good as the people who can reach it.'},
    9: {cover:null, kicker:'Crimson Horizon · Arc IX', title:'The Far Side of the Headland', tagline:'Some of the best markets are just around the point.'}
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
    21: 'Aisyah sets the watch rotation while Sky readies the infirmary. "We\'ll run the dive in two shifts — entry, survey, and return," Aisyah says. "Keep the rotation tight and the lines clear." "The infirmary is ready," Sky says. "Warming gear, recovery tonics, and treatment kits are set. Bring them back safe."<br><br>"First dive. We go down, mark the ledge, and check for a path beneath it," Levi tells Sairen. "Understood. We keep comms open, mark anything unusual, and return on schedule," Sairen says.<br><br>Jade tracks their progress from the ship, her arcane instruments mapping the dive in real time. "They\'re descending... sixty metres... seventy... They\'ve reached the ledge. Holding steady..."<br><br>"They\'re in position," Jade tells the crew. "Now we wait for their report."',
    22: 'Levi and Sairen follow the ledge deeper beneath the Storm Shelf, keeping close to the rock face until a gap opens ahead.<br><br>"There — a cavern ahead. It\'s not flooded..." Levi says. "...an air pocket? Already this deep?" Sairen asks.<br><br>They emerge into an air-filled chamber — ancient, intact, and marked with the tower\'s symbol. "This is it... the source. The tower\'s symbol..." Levi says. "It\'s not just a door," Sairen says. "This is a sealed chamber... part of the tower itself."<br><br>"The signal is strongest here," Levi says. "It\'s coming from beyond that door." "...and the floor is moving," Sairen says. "Feel it?"<br><br>The stone beneath their feet trembles — a deep, steady pulse, matching the signal from the tower. "It\'s responding to us..." Sairen says. "The door is active."',
    23: 'Sera drops in on Fen with tea and finds the research table covered in charts.<br><br>"You\'re buried in charts again," Sera says. "At least let me bring tea while you conquer another mystery." "Perfect timing," Fen says. "Take a look at this... The mark the crew sent back — I\'ve found it."<br><br>"The symbol matches this mark on the old chart..." Fen says. "Not just at the Storm Shelf... ...but also here — at the West Gate. The same sigil, the same alignment."<br><br>"Both places?" Sera asks. "That can\'t be a coincidence. Are they linked? A pair of gates... or parts of the same system?" "That\'s what I\'m suspecting," Fen says. "The tower isn\'t pointing to a single location... It\'s marking a connected route — east and west."<br><br>"Then what the crew found beneath the Storm Shelf..." Sera says, "...might be only one side of a larger mechanism." "Exactly," Fen says. "If the West Gate is part of the same network, we need to review our sources, reconcile both sites, and prepare for what lies between them."',
    24: 'Back in the chamber, Erynn studies the inscription carved around the door, translating its meaning for the crew.<br><br>"I\'ve finished a preliminary translation," Erynn says. "This is a warning station." "Originally, it was built to warn ships away from dangerous currents beneath the Storm Shelf," he explains. "It detected shifts in the sea\'s flow and sent out a wide, steady signal — a warning to turn back."<br><br>"But this is no longer the original signal," Erynn says. "The core has been modified — recently." "The pulse strength is several times stronger than the original," he continues. "It\'s not just a warning anymore... It\'s a beacon."<br><br>"Someone changed it... but why?" Levi asks. "To draw ships here? Or to hide something beneath the Shelf?" Jade asks. "Either way, it means this place is active again," Sairen says. "And if the signal is still running..." Erynn says, "...whatever is here is waiting for a response."<br><br>The crew realizes the station is no longer a simple warning — it is now broadcasting a deliberate, powerful signal into the seas.',
    25: 'A sudden pulse rolls through the ship — stronger than before, shaking deck and ribs alike. "That\'s the signal again — stronger!" Joel says. "This isn\'t random. It\'s a recall."<br><br>"It\'s a full recall pulse," Levi says. "The whole ship felt it." "Then we follow protocol," San says. "Three-bell recall — now." Soel darts through the corridors, meowing loudly at every cabin, waking the off-watch crew. "Huh? What was that sound?" Vaeren asks. "The ship is calling us again!" Joelle says.<br><br>"Three bells — clear and steady," Joel says. "It\'ll carry through the stone so the dive team can hear it below."<br><br>Three clear bells ring across the ship, the sound travelling through the water and stone below. "Three bells... the recall signal. They heard us," Levi says, underwater. "Understood. We\'re heading back now," Sairen says.',
    26: 'That night, Sally cross-checked the tower\'s timestamps with Joel\'s battle log.<br><br>"Here it is... the tower\'s pulse log," Sally says. "And this is my battle log from the leviathan encounter," Joel says.<br><br>"The altered pulse reached the leviathan\'s waters at 23:17..." Sally says. "And the leviathan surfaced at 23:26." "Nine minutes after the pulse..." Joel says. "That\'s too precise to be a coincidence."<br><br>"So the station didn\'t just warn ships away..." Joel says. "It triggered its movement. Someone is using the pulse to call it."<br><br>"And look here..." Sally says. "The station is building another transmission. The next pulse is already charging." Last Pulse (Altered): 23:17. Leviathan Surface: 23:26. Next Transmission: charging, 72%, estimated release ≈ 01:04.<br><br>"Then we don\'t have much time," Joel says. "We stop that next transmission before it reaches full strength." "Agreed," Sally says. "If we can trace who altered the station... we\'ll know who\'s behind the leviathan as well."',
    27: 'Devon and Renn trace the next pulse\'s path along the outer current.<br><br>"Renn, I\'m sending the latest pulse data now," Devon says, aboard the Crimson Tide. "Can you trace it along the outer current?" "Got it," Renn replies, from Fair Tide\'s Research Wing. "Give me a moment... I\'ll overlay the pulse with the current and route charts."<br><br>"Here. The pulse is moving along the outer current — the same channel we used before," Renn says. "So it will reach the East Gate," Devon says. "Are ships already using that fallback route?" "Yes," Renn confirms. "There are already ships in that channel — using the same fallback route we took."<br><br>Route Summary: Pulse Path confirmed, Outer Current stable (strong), East Gate targeted, Fallback Route active (in use), estimated arrival ≈ 01:14.<br><br>"Then we move now," Devon says. "I\'ll alert the fleet at the East Gate and have them prepare for the incoming transmission." "Understood," Renn says. "I\'ll keep tracking the pulse and update you if there are any changes in the current or ship flow."<br><br>With the route confirmed and the East Gate already active, the Crimson Tide and Fair Tide coordinate their next steps — ready to intercept the upcoming transmission.',
    28: 'Sally signals passing ships away while Joel holds the Crimson Tide at the mouth of the channel.<br><br>"All passing ships, this is the Crimson Tide," Sally announces. "The East Gate channel is now restricted. Please divert to the fallback route." "Hold position," Joel says. "Keep the Crimson Tide at the mouth of the channel. No ships through until we give the clear."<br><br>Below the surface, Levi and Sairen hear the three-bell recall from the ship — just as they find the station\'s service passage. "The recall...!" Levi says. "They\'re calling us back now." "Just in time..." Sairen says. "Look there!"<br><br>"The station\'s service passage..." Levi says. "This is the access we were looking for." "Let\'s mark the entry and head back," Sairen says. "We need to report this before the next pulse."',
    29: '"Found it — a newly fitted coupling," Sairen says. "It\'s not part of the original design," Jade says, studying it. "This is what turns the warning signal into a repeating pulse."<br><br>"Let me see the chamber sketch..." Jade says. "Here — there\'s a maintenance bypass on the side."<br><br>"Divers, shift to the bypass now," Jade directs. "Follow the side conduit and re-route the line. It should stabilize the signal." "Copy that! Heading to the bypass now!" Levi calls.<br><br>"Bypass engaged," Sairen says. "Re-routing the pulse now..." "...Signal stabilized," comes the reading. "The warning is now a controlled, repeating pulse."<br><br>The fresh cut into the system holds. The signal continues in a steady, repeating rhythm — exactly as planned.',
    30: 'At the dive entrance, San and Mezstorm work together to steady the water, keeping the current calm and stable for the team below.<br><br>"BYPASS engaged," Levi says. "Switching the station now." "Confirmed. The signal is rerouting," Sairen says. "Removing the coupling next."<br><br>"Coupling removed," Sairen says. "The station is now on the bypass line."<br><br>A moment later, the next warning comes through — not a harsh alarm, but a single, quiet bell. "It\'s stable," San says. "We\'ve bought ourselves time," Mezstorm says. "Keep the channel clear."',
    31: 'With the bypass complete, the East Gate reopens. Traffic resumes through the channel under the crew\'s watch.<br><br>"Vitals are good. No decompression issues," Sky says, checking the divers. "Both of you held up well down there."<br><br>"Finally! Everyone at the same table again," Aisyah says. "No dive gear, no reports — just a proper meal."<br><br>"Then it\'s settled! Soel should be on the watch roster!" Vaeren says. "Yes! Soel keeps the ship safe too!" Joelle adds. "He\'s always on watch with us!"<br><br>"A watch roster... for a cat," Joel says. "Only on the Crimson Tide," San says. "He\'s earned it," Aisyah says. "Soel keeps morale high, alerts us to strange sounds, and somehow always shows up where he needs to be."<br><br>Watch Roster (Updated): Bridge Watch, Deck & Channel, Dive Operations, Night Rounds, Ship\'s Familiar — Soel. All confirmed.',
    32: 'Back in the research workshop, Adrian and Fen lay the recovered coupling on the table, comparing it with the original charts.<br><br>"The structure matches... but there\'s something different here," Adrian says. "A mark beneath the salt layer," Fen says. "Let me clean it further."<br><br>As Fen carefully cleans away the salt buildup, a set of engraved marks emerges: W-GATE, SV-7729.<br><br>"It\'s a West Gate service mark," Adrian says. "And this inventory number... SV-7729." "This isn\'t an old component," Fen says. "The number sequence is recent — within the last few cycles."<br><br>They cross-check the number against the West Gate service charts, tracing the handling records and transfer log. Inventory No. SV-7729 · Component: Channel Coupling (Type C) · Service: West Gate (Maintenance Bay) · Last Handled: Cycle 324.17 · Handled By: [Record: Transferred].<br><br>"There it is," Adrian says. "We have a trace — who handled it, when, and where it was sent next." "Then we follow the chain," Fen says. "If this coupling was moved recently... someone is still active in the West Gate network."',
    33: 'San and Jade chart a course for the West Gate to trace the coupling.<br><br>"Set our course for the West Gate," San says. "We\'ll trace the coupling." "I\'ll mark the route and check for any maintenance bypasses," Jade says.<br><br>"The West Gate should be just beyond the Mist Straits," San says, tracing the chart. "There may be a maintenance bypass," Jade says. "Let\'s check the records."<br><br>"Prepare the navigation team," San says. "We\'ll enter the Mist Straits at the West Gate." "Keep watch for the lanterns," Jade says. "Something\'s wrong with the second route."<br><br>The comic ends at the edge of the mist, where the first route lantern is lit and the second is missing.',
    34: '"Wait — there! A light... by the second marker!" Sally calls. "Hold the Crimson Tide! Bring us about!" Joel orders. "This isn\'t right..." Levi says, telescope raised. "That light is moving against the current!"<br><br>The crew turns toward the second route marker, only to find a lone light moving against the current in the Mist Straits.<br><br>"Engines idle! Maintain position!" Joel calls. "It\'s definitely moving... and not a route lantern," Levi says. "Someone — or something — is out there in the straits."<br><br>"Could it be a rescue signal?" Sally asks. "Or a trap set to draw vessels in...?" "Either way, we need to find out," San says. "The Mist Straits rarely give a light unless it means trouble," Jade says.',
    35: 'A local pilot guides the ship into a sheltered quay by ringing a bell from shore.<br><br>"Thank you for guiding us in," San says. "We\'re tracing a route marker — the second lantern." "You\'re too late, Captain," the pilot says. "The second lantern vanished three nights ago."<br><br>"Since then, two ships have gone aground in the Straits," she says. "Both were experienced crews... but they never made it past that section."<br><br>"Two ships... that\'s not an accident," Joel says. "The Straits aren\'t just unforgiving," comes the reply beside him. "Someone may be clearing the route." "Then we need to find out who," San says, "...and why the lantern was taken."',
    36: 'Jade and Aisyah visit the maintenance yard to ask about SV-7729.<br><br>"We\'re looking for a coupling coded SV-7729," Jade says. "It should be part of the West Gate maintenance record," Aisyah adds.<br><br>"SV-7729... that number sounds familiar," the foreman says. "Let me check the dispatch log."<br><br>"Found it. SV-7729 was part of a shipment signed out for routine beacon repairs." Dispatch No. WG-4187 · Item Code: SV-7729 · Beacon Coupling (Type B) · Purpose: Routine Beacon Repairs · Status: Signed Out.<br><br>"Routine repairs..." Jade says. "Then it was sent to service one of the route beacons." "Which beacon was it assigned to?" Aisyah asks.<br><br>"The log shows the second route marker in the Mist Straits," the foreman says. "It was sent out three nights ago, just before the lantern vanished."',
    37: 'From Fair Tide, Adrian and Fen send a copy of the transfer record to confirm the coupling\'s trail.<br><br>"Transfer record sent, Sally. You should have it now," Adrian says. "It includes SV-7729 and its associated work order," Fen says. "Check it against the yard\'s dispatch book." "Got it," Sally says, in the Crimson Tide\'s chart room. "Let me compare it with the yard\'s dispatch book."<br><br>"Routine repairs... but it\'s not just one coupling..." Sally says. "There are three more collected under the same work order."<br><br>"Four couplings... all for the beacon repairs?" Adrian asks. "That\'s a larger maintenance run than expected," Fen says. "And the timing matches — three nights ago, just before the second lantern vanished," Sally says. "Then we track where all four were sent... and who handled them."<br><br>The transfer record and the yard\'s dispatch book match: four couplings under one work order — WG-4187, SV-7729 through SV-7732 — all for West Gate beacon repairs.',
    38: 'That evening, a survivor from one of the wrecks joins the crew for supper aboard the Crimson Tide.<br><br>"Easy now. The fever\'s come down, and the cuts are healing well," Sky says. "Heh..." the sailor says. "Your medicine is better than any port ale I\'ve had in years."<br><br>"Uncle, how did you know where to sail?" Vaeren asks. "There were so many wrecks..." Joelle says. "How did you find your way through the mists?"<br><br>Tap... tap... tap-tap... tap. "It wasn\'t by sight... Not by stars either," the sailor says, tapping the table. "I followed the rhythm of the light."<br><br>"Out there in the mists, there\'s a beacon... It doesn\'t stay bright all the time," he says. "It breathes... slow... then a double pulse... then a longer pause... That rhythm led us here."<br><br>"A pattern... not just a light," Sky says. "That could be a beacon network... or a signal meant for specific routes."',
    39: 'Later that evening at Fair Tide, Renn reviews the sailor\'s account alongside the old pilot codes from Fair Tide.<br><br>"Let\'s compare his description with the Fair Tide pilot codes..." Renn says. "Particularly the coastal beacon patterns."<br><br>"Here it is. The West Gate approach signal — Type B. Three short pulses, a double pause, then a long pulse." "The rhythm he tapped matches the official signal almost exactly..."<br><br>"The moving light copied the sequence with remarkable accuracy... Same rhythm, same timing intervals..." Renn says. "...from a distance, and especially in heavy fog, it would be indistinguishable from the real West Gate beacon." "It\'s a clever imitation. Not random... not a natural light either."<br><br>"So it wasn\'t the real beacon at all..." "No. It was a deliberate decoy — close enough to lure vessels onto a false route, possibly toward the wreck sites," Renn says. "Someone knew the pilot codes... and how to use them against us."',
    40: 'At first light, Levi and Sairen follow fresh bootprints across a shoal newly exposed by the low tide.<br><br>"Fresh prints... not from the ship\'s crew," Levi says. "And the stride is purposeful..." Sairen says. "Heading toward the cove."<br><br>"There it is... the missing lantern," Levi says. "And it\'s mounted on a skiff..." Sairen says. "Not merely abandoned."<br><br>Beneath the skiff, a fitting stamped W-GATE, SV-7731. "A West Gate coupling..." Levi says. "So this skiff was part of the same signal network."<br><br>"This confirms it. The false beacon wasn\'t just a light..." Levi says. "It was an active transmission node, set to mimic the West Gate signals." "Then someone prepared this carefully..." Sairen says. "A decoy route, ready for vessels to follow at the right tide."',
    41: 'Sally watches the skiff\'s crew sell cargo stripped from the grounded ships.<br><br>Salvage... but this is more than scrap, she thinks. They\'re selling cargo from the wrecks...<br><br>"They\'re not just scavengers," Sally says quietly. They\'re moving the cargo quickly... preparing for another run.<br><br>"I\'ll reset the lantern now," one of the crew says. "The evening convoy will be here soon."<br><br>One of them leaves with a lantern and a small toolkit, heading to the skiff anchored near the shoal.<br><br>"There... he\'s setting it again —" Sally says. Just in time. "The evening convoy...!"',
    42: 'The pilot confirms the news — the evening convoy has already passed beyond sight of shore.<br><br>"The convoy is already beyond sight of shore," the pilot says. "If we want to catch them, we must move now." "Then we split," San says. "Joel and Mezstorm will intercept the convoy at sea."<br><br>"Understood," Joel says. "We\'ll take a fast boat, close the distance, and stop them before they clear the straits." "Leave the chase to us," Mezstorm says. "We\'ll intercept the convoy, secure the cargo, and bring them back."<br><br>"I\'ll lead the shore team," Jade says. "We\'ll retrieve the real marker, reset the West Gate coupling, and restore the proper signal. Levi, Sairen, and Sally — with me. We need the marker active again before the next vessel arrives."<br><br>"Good. Joel and Mezstorm, move at once," San says. "Jade, restore the marker and report back when the signal is live. We stop the false route here — before more ships are lost."',
    43: 'Joel takes the Crimson Tide into the white water, where the fog sits so thick the bow lantern barely reaches the next swell. Mezstorm stands at the rail, one hand raised, and tears brief gaps in it — a few breaths of clear water at a time, never more.<br><br>"Left of the rocks, then hold," Joel says. "Give me another gap when you can."<br><br>"You\'ll have it," Mezstorm says. "Don\'t waste it."<br><br>Gap by gap, they close the distance. When the fog opens again the convoy is there ahead of them — and its lead ship is already beginning to turn, bow swinging toward the false light.',
    44: 'On the shoal side, Levi and Sairen move through the shallows to cut off the skiff\'s retreat before its crew can slip back out to deeper water.<br><br>Cornered, the skiff\'s crew go for the one thing that proves what they\'ve been doing: the lantern. One of them hauls on the release rope to drop it overboard.<br><br>From the deck of the Crimson Tide, Sally looses a single shot. It pins the release rope to the gunwale, and the lantern stays exactly where it is.<br><br>"That stays aboard," Levi says, wading in. "All of it."',
    45: 'With the false light taken, the second post still stands empty — and the convoy is still out in the fog. Jade goes to the one person who can fix that tonight.<br><br>"The second post is empty and there\'s a convoy in the fog," she tells the yard foreman. "I need a spare lantern on it tonight."<br><br>The foreman brings it personally. Once the lantern is seated and lit, the true signal carries out over the water — three short pulses, a double pause, then a long one.<br><br>Joel picks it up from the helm and brings the Crimson Tide about. One by one the convoy falls in behind, and he leads them through the true channel to where the pilot is waiting.',
    46: 'The lantern skiff gives up more than its light. Among the salvage crew\'s things is a ledger — every cargo stripped from the grounded ships, and where it went.<br><br>The harbor pilot takes it herself to the families of the wrecked crews, so they can reclaim what was theirs.<br><br>The rest of the entries matter to the Crimson Tide. The salvage crew used several of the West Gate couplings locally, for the false light — and sold one on. The buyer\'s line reads: Storm Shelf.<br><br>"One coupling, sold on to the Storm Shelf," San says. "That\'s the one we pulled out of the station."',
    47: 'At Fair Tide, Fen follows the shipment to its end. Four couplings left the West Gate yard under one work order, and three are accounted for. The fourth never went anywhere at all.<br><br>It is still sitting in an unopened crate, awaiting pickup.<br><br>The delivery instructions are brief. They name the South Gate — Deep Channel. They give a tide and a berth. Where the recipient should be, there is nothing.<br><br>"Someone is expecting it," Fen reports. "They just didn\'t want their name on the paper."',
    48: 'The yard crew restores the permanent marker on the second post — no borrowed lantern this time, but the Straits\' own light, back where it belongs.<br><br>When the first ship comes safely through, the pilot hands the bell rope to Vaeren and Joelle. They ring the quay bell together, a little out of time and far too long, and nobody on the quay minds.<br><br>Before the Crimson Tide sails, San asks the pilot for one more thing: to teach the crew the local signals.<br><br>"Next time we come through," San says, "I\'d like us to read your lights the way you do."',
    49: 'San and Jade take the delivery instructions south, to see for themselves who comes for the crate.<br><br>The tide is the one written on the paper. The berth is the one written on the paper. Nobody is waiting there.<br><br>There is only a mooring rope, made fast at the berth and pulled taut — running straight down into water far too deep for any dock.<br><br>"Something is holding the other end," Jade says.<br><br>San looks at the line, and at the dark water it disappears into. "Then that\'s where we go next."',
    50: "The Crimson Tide holds offshore as the tide begins to climb. Joel keeps the ship steady while Levi and Sairen take a launch in toward Berth B-12.<br><br>\"The rope's still taut,\" Levi calls back. \"Fresh wear along it. Somebody hauls on this every few days.\"<br><br>\"There's a ring down here too,\" Sairen says, lowering a lantern into the water. \"Bolted into the rock, below the waterline. The rope runs through it, and the iron's polished bright.\"<br><br>Jade marks both on the chart from the deck. \"That's a guide ring,\" she says. \"Small boats still use this berth. Whatever it leads to, it isn't abandoned.\"<br><br>\"Then someone's running a route nobody wrote down,\" San says. \"Put the hidden approach on the chart before the tide turns.\"<br><br>Chart updated: Hidden Approach, Berth B-12.",
    51: "In Fair Tide, Fen and Adrian lay the crate's contents out under the lamp. Consignment SV-7740 matches the last coupling exactly, down to the seal. The recipient line is still blank.<br><br>\"Nobody signed for it,\" Adrian says. \"Whoever ordered this expects it to arrive without a name attached.\"<br><br>\"The original stays here,\" Fen says, locking the coupling away. \"Nobody gets it.\"<br><br>Renn sends Devon the berth instructions and a copy of the seal. \"Everything the pickup crew will check is in there,\" Renn says. \"They'll be looking for that mark.\"<br><br>\"Then let's give them something that carries it,\" Sally says over the line. \"A substitute crate, marked and weighted. I'll watch the pickup from cover and see who comes for it.\"<br><br>\"Do it,\" San says. \"The coupling stays in Fair Tide. The stakeout starts on the tide.\"",
    52: "High tide, Day Eight. The marked crate sits at Berth B-12, and Sally lies flat behind a ridge of rock with the glass to her eye.<br><br>\"Tender coming in,\" she murmurs. \"Four aboard. They're following the rope in, no lamp.\"<br><br>The tender noses against the berth. Its crew lifts the crate without a word, checks the seal against a copy, and one of them flashes a short signal toward the rocks beyond the berth. Something answers from out of sight.<br><br>\"Signal answered,\" Sally says. \"Two quick, one long. From behind the cliff.\"<br><br>Aboard the Crimson Tide, Joel waits. \"Let them get ahead,\" he says. \"A boat that's looking behind it sees a lantern. A boat that isn't just sees water.\"<br><br>When the tender is far enough ahead, the launch slips off the Crimson Tide and follows the rope in.",
    53: "The line runs straight at the cliff, and for a moment it looks like it runs into solid stone. Then the water lifts, and a narrow opening shows in the rock.<br><br>\"It only opens at high tide,\" Levi whispers. \"Look at the waterline. There's barely a hand's width above the boat.\"<br><br>The tender slides through. The scouts follow, hugging the wall, and come out into a sheltered cave. An old rescue dock stands against one side, and above it a storage loft. A haulage lift runs from the dock up into an upper passage.<br><br>\"That's an old rescue station,\" Jade says over the line. \"Somebody built this to save people.\"<br><br>\"Mark both exits,\" San says. \"The lift and the water. And mark where the tender unloaded.\"<br><br>The crate goes up in the lift. The scouts stay low, and start counting doors.",
    54: "From the shadow of the loft, Levi and Sairen can hear voices below the dock.<br><br>\"I won't take another boat through,\" a pilot says, hoarse and steady. \"Not for you. Not for anyone you answer to.\"<br><br>\"You'll do what you're told,\" a guard answers. \"Same as the rest.\"<br><br>When the guard leaves, a second pilot passes the loft grate with a bucket and doesn't look up. A folded scrap drops through the bars.<br><br>Sairen unfolds it by lantern light. A tally of marks, and below it a drawing of a door with the word <i>bunkroom</i>.<br><br>\"That's how many are being held,\" Levi breathes. \"And where.\"<br><br>\"Don't touch anything,\" Jade says over the line. \"Not yet. Record it and get out clean.\"<br><br>The captives' location is on the chart. The extraction plan is open.",
    55: "The Channel Keeper comes down the lift with two guards and crosses the dock without looking at the pilots. He opens the crate himself and turns the coupling over in his hands.<br><br>\"This is one,\" he says. \"Where is the other?\"<br><br>\"That's all that came,\" a guard answers.<br><br>\"Then someone has the second one.\" The Keeper sets the coupling down carefully. \"I ordered both so I could work the public gate and the passage without asking anyone. Without the pilots, without the harbor office, without waiting on the tide.\"<br><br>\"The pilots won't cooperate,\" the guard says.<br><br>\"They don't have to like it. They only have to steer.\" He looks toward the water. \"While ships queue outside the gate for days, mine run when I say.\"<br><br>In the loft, Levi and Sairen share a look. Now they know who ordered SV-7740, and why.",
    56: "Aboard the Crimson Tide, Erynn bends over the scouts' sketches. \"That dock is a rescue station,\" she says. \"Older than the harbor office. The lift and the loft are part of an old route for getting people out of the water.\"<br><br>\"Then there'll be a diagram,\" Devon says.<br><br>\"Sending it now,\" Renn says from Fair Tide, and a restoration diagram comes up on the chart table.<br><br>Jade traces the lower stairs with her finger and stops. \"Wait. If we open the public gate, the water goes down these stairs first. The service stairs flood.\"<br><br>\"So no one stays down there,\" San says.<br><br>\"Order matters,\" Jade says. \"Get everyone above the flood line first. Then restore the gate.\"<br><br>\"Extraction first,\" San says. \"Gate second. Write it down.\"<br><br>Devon writes it at the top of the page.",
    57: "San gathers the crew on deck as the afternoon light goes gold.<br><br>\"Three teams,\" she says. \"Extraction: Levi and Sairen, through the loft. Ship: Joel, with the launch at the upper landing. Gate: everyone else, once the pilots are clear.\"<br><br>\"Supplies are staged,\" Aisyah says. \"Blankets, water, something warm. They'll be hungry and cold when they come aboard.\"<br><br>\"I've cleared the forward berths,\" Sky says. \"Plenty of room, and the infirmary's ready.\"<br><br>Jade and Sally will coordinate from protected positions, and nobody argues about it.<br><br>\"Recall signal?\" Devon asks.<br><br>\"Three bells,\" Joel says. \"The same as under the shelf.\"<br><br>\"Route, signal, pickup point,\" San says. \"Confirmed. Wait for the water to turn.\"<br><br>The rescue starts at the next tide.",
    58: "Levi and Sairen come through the storage loft in the dark. The key hangs where a guard would reach for it, and Sairen lifts it off its hook without a sound.<br><br>The bunkroom lock turns. Inside, tired faces look up at the lantern light, and no one speaks.<br><br>\"We're from the Crimson Tide,\" Levi says, quiet. \"We're getting you out. Stay close and stay quiet.\"<br><br>One pilot can barely stand. Two others take the weight between them, and the group starts up the upper passage slowly, one step at a time.<br><br>On the dock below, Sally keeps watch from the shadows, her glass tracking the guards' lanterns. \"Nobody's looking this way,\" she says. \"Take your time.\"<br><br>At the upper landing, Levi counts heads twice. Everyone is accounted for before anyone touches the gate.",
    59: "Joel brings the launch alongside the upper landing, close enough for the pilots to step across.<br><br>\"Keeper's tender,\" Sally calls from cover. \"Coming round the rock. They're trying to block the landing.\"<br><br>The tender cuts across the launch's bow. Its crew has hooks, and they aren't there to talk.<br><br>San and Mezstorm take the water. Between them the surge flattens, and the launch holds steady against the rock. \"Board!\" San shouts. \"One at a time!\"<br><br>The pilots cross, the weakest carried between two others. The tender's crew tries to close in, and the party meets them at the landing until the escort is clear.<br><br>\"That's all of them,\" Levi says at last.<br><br>\"Take them to Sky,\" Joel says. \"I'll hold the launch.\"<br><br>The pilots are aboard the Crimson Tide, and Sky is waiting.",
    60: "The Keeper reaches the control room first, and his voice carries down the passage.<br><br>\"Burn the dispatch book! Every record, every ledger. And flood those stairs. If I can't hold this place, nobody gets it.\"<br><br>\"He's cutting off the gate mechanism,\" Jade says over the line. \"If he floods the stairs, no one reaches the controls.\"<br><br>\"Then we get there first,\" San says.<br><br>The Keeper's guards meet them at the control room door. The fight is short and ugly in the narrow passage. When the last guard goes down, the party reaches the controls before the first water touches the stairs.<br><br>The Keeper's dispatch book lies half-burned on the floor, and Levi pulls it clear of the flames.<br><br>\"Manual release,\" Sairen says, finding the old lever behind a panel. \"It still works.\"<br><br>The dispatch book is recovered. The manual release is open.",
    61: "Aboard the Crimson Tide, Jade reads the restoration sequence aloud, one line at a time.<br><br>\"Gate team,\" she says. \"Are the lower stairs empty?\"<br><br>\"Empty,\" Levi answers. \"We checked twice.\"<br><br>\"Then shut the private bypass. It's the lever on the left, behind the panel.\"<br><br>The bypass shuts with a groan of old iron.<br><br>\"Now the public gate. Slowly.\"<br><br>Sairen and Levi bear down on the release together. Far below, the water starts to move, and then the great gate swings open.<br><br>\"It's moving,\" Sally says from her post, watching the channel through the glass. \"The whole channel's running.\"<br><br>\"The public route is restored,\" Jade says. The hidden berth is a rescue dock again.",
    62: "A freed pilot walks to the rail of the Crimson Tide, looks down the reopened channel, and turns to San.<br><br>\"A ship's been waiting outside the gate for days,\" the pilot says. \"Let me take it through. I know this water. I want to be the one.\"<br><br>\"Are you sure?\" Sky asks, quietly. \"You've barely rested.\"<br><br>\"I'm sure.\"<br><br>The waiting vessel gets its pilot, and the Crimson Tide follows at a distance, close enough to help and far enough not to crowd.<br><br>On the shore, the gate team watches the current. \"Steady,\" Levi calls. \"No change.\"<br><br>The ship passes the narrows, clears the markers, and slides out into open water. A cheer goes up along the quay.<br><br>\"The South Gate is open,\" San says. \"For everyone.\"<br><br>Regular travel to the South Gate is unlocked.",
    63: "In Fair Tide, Fen and Adrian spread the Keeper's dispatch book across the research table, next to the West Gate records.<br><br>\"The hand matches,\" Adrian says. \"Same ledger style, same work order numbers.\"<br><br>\"The same operation,\" Fen says, tapping two lines. \"It bought the Storm Shelf coupling, and it kept the South Gate order under SV-7740. The Keeper was only one hand in it.\"<br><br>\"There's another entry,\" Adrian says. \"Separate, at the back. A service delivery, scheduled at the Central Gate.\"<br><br>Renn leans over the page. \"That's a date. Not far off.\"<br><br>\"The coupling investigation is closed,\" San says over the line. \"But the trail isn't.\"<br><br>The Central Gate lead is open.",
    64: "The freed pilots come ashore in the afternoon, wrapped in Aisyah's blankets, and the quay goes quiet to let them pass.<br><br>One of them stops in front of San and holds out a rolled chart.<br><br>\"Corrected,\" the pilot says. \"The public lane, the rescue berth, the stairs, the flood line. Every mark checked against the water.\"<br><br>\"Thank you,\" San says, taking it carefully.<br><br>\"Please share it. Every ship that uses this coast should have it. Nobody should have to find the passage the way we did.\"<br><br>\"They will,\" Jade promises. \"We'll send copies to every harbor office.\"<br><br>Devon pins the chart in the voyage log, and the twins ring the quay bell for the pilots as they walk home.<br><br>The corrected chart is added to the journal.",
    65: "On the deck of the Crimson Tide, San and Jade spread the corrected chart across the table, with the Keeper's dispatch book open beside it.<br><br>\"The Central Gate,\" Jade says. \"The service delivery is scheduled there.\"<br><br>\"After the South Gate is back in local hands,\" San says. \"We leave it with the pilots first.\"<br><br>\"Agreed.\"<br><br>Devon lays a course along the chart's edge. \"I can plot the whole approach from the corrected lane,\" Devon says.<br><br>The Crimson Tide gets under way at dusk. They are still some way from the first marker when the lamp at the helm flickers and the lantern on the far horizon answers.<br><br>\"That signal,\" Joel says slowly. \"They answered before we asked.\"<br><br>San looks out at the dark water ahead. \"Then they know we're coming.\"<br><br>The Central Gate is charted.",
    66: "First light, and the Central Gate opens ahead of the Crimson Tide, a wide mouth of weathered stone with the tide running through it. Joel takes the helm himself and holds her steady on the line Devon plotted.<br><br>San stands at the rail, watching the stone slide by on either side. There is no signal, and no lantern answering from the dark. Whatever answered them on the way here, it doesn't answer now.<br><br>Then the walls fall away.<br><br>Beyond the gate is an island, green on the hills and gold along the waterfront, and a busy harbor already awake. Small trading boats are sailing out past them in the early light, sails patched and bright, crews calling to one another across the water.<br><br>\"That,\" Joel says slowly, \"is not what I expected.\"<br><br>A local pilot in a skiff waves them in, pointing toward an empty stretch of the quay.<br><br>\"Shall I tell everyone we're staying one night?\" Joel asks.<br><br>\"Tell them we're staying at least one night,\" San says.<br><br>Island Harbor is now on your charts.",
    67: "Aisyah is down the gangway before the lines are properly made fast, a basket on one arm and a list in her head. \"Market,\" she says, over her shoulder. \"Nobody follow me unless you're carrying.\"<br><br>Joel takes the waterfront with Vaeren, Joelle and Soel. Vaeren wants to know what every boat is called. Joelle wants to know what every boat is carrying. Soel rides the top of a bollard like a figurehead and accepts a piece of dried fish from a stranger without a flicker of shame.<br><br>\"We're supposed to be looking for a quiet morning,\" Joel says to nobody in particular.<br><br>San and Jade go looking for food and find a bench on the harbor wall instead, with a view of the whole quay and two warm buns from a stall. For a while they simply eat.<br><br>\"The first time I travelled without anyone from the court arranging my day,\" Jade says, \"I was sure I'd be wonderful at it.\"<br><br>\"And?\"<br><br>\"I got lost before noon.\"<br><br>\"Did you ask for directions?\" San asks.<br><br>\"Eventually.\"<br><br>San laughs, and Jade does too, a little late, as if she's still checking whether she's allowed to.",
    68: "At the far end of the quay, a skipper is sitting on an upturned crate beside a boat with a cracked strake and a sagging rail. Sacks and barrels are stacked on the stones around her, covered with sailcloth against the sun.<br><br>\"Wasn't meant to still be here,\" she says, when San asks. \"I was taking provisions out to the outer island. Then a swell put me against the pier on the way out, and now the boat won't float a full load.\"<br><br>\"How long would the repairs take?\" Joel asks.<br><br>\"Longer than the people on that island have got. They're running low.\"<br><br>San looks at the stacked cargo, then at the Crimson Tide. \"We have the room,\" she says. \"For you and everything you were carrying. We can take it out ourselves.\"<br><br>The skipper stares at her. \"You'd do that? You don't know me.\"<br><br>\"You were going to do it for people you don't know either,\" San says.<br><br>Joel crouches beside the damaged hull. \"Show us where you normally land,\" he says. \"We'll want to come in the way you do.\"<br><br>The skipper finally nods, and the cargo starts moving up the gangway.<br><br>The provisions run is set.",
    69: "That evening the Crimson Tide is quiet. The harbor lights come on one by one, and the others go below in twos and threes until only San and Jade are left on deck.<br><br>\"You asked me to stay,\" Jade says. \"I was hoping it wasn't bad news.\"<br><br>\"It isn't. I don't think.\" San takes a breath. \"There's something I've never told you. I wrote a story once, a long time ago. Imperial Guard Meets Runaway Prince. Later I renamed it Tangled with the Runaway Prince.\"<br><br>Jade is very still. \"A prince.\"<br><br>\"And an Imperial Guard. When you and Devon told me your names in Lunareth, I recognized them. I didn't say anything. I wasn't sure how.\"<br><br>\"You knew,\" Jade says slowly. \"From the first day.\"<br><br>\"I recognized the names. I didn't know what it would mean to be standing in front of you.\" San looks at her hands. \"Joel already knows. This is the first time I'm telling you myself.\"<br><br>Jade looks out at the harbor for a while. \"How far did you get?\"<br><br>\"Somewhere in the fifties. Then life got in the way.\"<br><br>\"And after that?\"<br><br>\"After that, you'll have to tell me.\"<br><br>\"I'll show you the manuscript whenever you're ready,\" San says.<br><br>Jade almost smiles. \"I'd like to hear how it begins first.\"",
    70: "The Crimson Tide is stowed and ready by morning. The skipper's cargo is lashed down in the hold, and every crate is accounted for. San and Joel stand at the helm, going over the approach the skipper marked on the chart.<br><br>Down on deck, Jade and Sally have found a quiet spot by the mainmast, their heads close over a scrap of paper covered in dates.<br><br>\"Three years for me, give or take,\" Jade says. \"Two and a half for you.\"<br><br>\"Which is close enough that it might not matter,\" Sally says. \"We could still end up going into labour around the same time.\"<br><br>\"Devon and Levi already know about the pregnancies.\"<br><br>\"But neither of them knows about this part.\" Sally taps the paper. \"Should we tell them our due dates might overlap?\"<br><br>Jade thinks about it. \"After we've unloaded the provisions on the outer island. Let's not give them anything else to worry about at sea.\"<br><br>\"Agreed.\"<br><br>\"I'll tell Devon first,\" Jade says. \"I want to see his face.\"<br><br>At the helm, Joel glances at San and raises an eyebrow. San shrugs, smiling, and gives the order to cast off.<br><br>The Crimson Tide is ready to sail.",
    71: "The skipper stands at the bow with one hand on the forestay, calling the reef a few strokes ahead of anything Joel can see. \"Left of the pale water. Now hold. Hold. Now right.\"<br><br>Joel follows every word. The Crimson Tide slips through the reef without a scrape, and the outer island rises green and quiet out of the swell. A small quay waits at the end of a curving beach, and a line of houses sits above it.<br><br>\"That's my landing,\" the skipper says. \"Where I usually put in.\"<br><br>Joel looks at the water under the quay, then at the chart, then at the Crimson Tide's draft. \"She wouldn't clear it by a hand's breadth at low water,\" he says. \"Not even close.\"<br><br>\"I did say it was shallow.\"<br><br>\"You said <i>usual</i>.\" Joel puts the helm over. \"We'll anchor in the lee.\"<br><br>San is already talking to the quay. Within the hour, the islanders are rowing out in their small boats, one load after another, with sacks and barrels coming down the side of the Crimson Tide in rope slings. San takes the first boat in herself.<br><br>The skipper steps onto the quay with the last load on her shoulder. A neighbour is waiting with both hands on their hips.<br><br>\"Three weeks!\" the neighbour says. \"Three weeks I've been keeping your dinner warm!\"<br><br>\"It's the same dinner?\" the skipper asks.<br><br>\"It's a <i>new</i> dinner. I made it fresh every night. Come in and eat it.\"<br><br>The provisions are delivered. The Outer Island is on your charts for return visits.",
    72: "By evening the cargo is stacked in the island storehouse, and the Crimson Tide rides quietly at anchor. Jade finds Devon at the stern rail, watching the lights come on along the beach.<br><br>\"I need to tell you something,\" she says. \"About Sally and me.\"<br><br>Devon turns, at once serious. \"Is something wrong?\"<br><br>\"No. We've been comparing dates. Mine is around three years. Hers is closer to two and a half. They're estimates, nothing is certain.\" She watches his face. \"But it's close enough that we could go into labour around the same time.\"<br><br>Devon opens his mouth, closes it, and starts to count on his fingers. \"Thirty-six months for you. Thirty for Sally. So that's... no. If hers runs long and yours runs short, then...\" He keeps going, under his breath, and then out loud.<br><br>Jade presses her lips together. It is exactly the reaction she wanted to see.<br><br>\"Jade,\" Devon says, \"you're enjoying this.\"<br><br>\"Very much.\"<br><br>Down on the quay, San and Joel are checking the last of the lashings. The sound of Devon counting carries across the water.<br><br>\"He's counting out loud,\" Joel says.<br><br>\"He's counting out loud,\" San agrees.<br><br>On the beach, Sally sits with Levi on an upturned boat, telling him the same news in fewer words. They talk for a long while afterward, about where they'd each want to be when the time comes. Somewhere steady, they decide. Not a ship in a storm. Somewhere with people close enough to hear if anyone shouted.<br><br>\"Who do you want nearby?\" Levi asks.<br><br>\"Sky,\" Sally says. \"And Jade. And you, obviously.\"<br><br>\"I'll be there before Sky is.\"<br><br>Both conversations end the same way, with the question of where home will be.",
    73: "The island's ridge market sits at the top of a long, switchbacked road, a scatter of stalls under cloth awnings with the whole sea laid out below. Aisyah goes from stall to stall, asking what the island trades and what it can't get, with the notebook already open.<br><br>San and Joel walk up with her, a little out of breath on the steeper turns.<br><br>\"This is not a small island,\" Joel says, when they reach the top.<br><br>From the ridge, they can see the sheltered channel curving away to the north, with boats working it toward a scatter of neighbouring islands. Sails are patched and bright against the blue.<br><br>\"That's the route I usually run,\" the skipper says, joining them at the wall. \"Provisions, mostly. But I carry letters too, and market orders. Anything that needs to get from one island to the next.\"<br><br>\"All of it, on the same boat?\" San asks.<br><br>\"It's the same boat. It's the same <i>sea</i>.\" The skipper pats the satchel at her hip. \"I've got a stack of outgoing letters. Would you take them back to the harbor while my boat's being repaired? There'll be someone there to sort them.\"<br><br>San looks at Joel, and Joel shrugs. \"We're going back anyway,\" he says.<br><br>\"We'll take them,\" San says.<br><br>The mail travels with the crew.",
    74: "Back aboard, with the lamps lit and the beach quiet, San finds Jade in the stern cabin with the window open to the sea.<br><br>\"You said you'd like to hear how it begins,\" San says.<br><br>\"I did.\"<br><br>San tells her. She tells it the way she first wrote it, slowly and a little out of order, and she keeps stopping to say \"no, that's not how it went.\" Jade doesn't interrupt. She listens the way she listens to a report, and then she listens differently, with her whole attention.<br><br>San gets as far as the first decision she remembers making differently from what she wrote, and she stops.<br><br>\"That's the one,\" Jade says.<br><br>\"How do you know?\"<br><br>\"Because I remember it.\" Jade folds her hands. \"Not the way you wrote it. I'd like to tell you what I remember.\"<br><br>She tells San what she remembers, and why she made that choice. San listens without writing any of it down. When Jade is finished, neither of them says anything for a while.<br><br>A knock comes at the cabin door. Devon looks in. \"I was looking for the two of you. Am I interrupting?\"<br><br>Jade looks at San, and then at him. \"Stay,\" she says. \"Sit down. I want you to hear my version.\"<br><br>Devon sits.",
    75: "The Crimson Tide slips back into Island Harbor on the morning tide with the outgoing mail stowed in a dry locker. A clerk at the quay takes it with a delighted exclamation, and the first sack is open before the gangway is down.<br><br>A boatman is waiting at the quay with a note. \"You'd be the Crimson Tide,\" the boatman says. \"The skipper sent word ahead. She's arranged for me to cover her next run.\"<br><br>\"Of course she did,\" San says, reading the note over Joel's shoulder.<br><br>Aisyah comes down the gangway with her notebook open. \"Which market days are worth sailing back for?\" she asks a stallholder. \"Not the quiet ones. The ones where people argue about the price.\"<br><br>\"Fourth day and seventh,\" the stallholder says. \"Come hungry.\"<br><br>Aisyah writes it down, underlines it twice, and tucks the notebook away.<br><br>Before they cast off again, Joel spreads the chart across the helm and marks the sheltered channel in ink: the reef lead, the quay, the long curve north.<br><br>\"Harbor and the outer island both stay on the chart,\" he says. \"We can come back any time.\" He looks up. \"Where do you want to go next?\"<br><br>San thinks about the ridge, the patched sails, the scatter of islands in the haze. She points to one of them.<br><br>\"That one,\" she says.<br><br>The channel is charted.",
    76: "Joel takes the Crimson Tide out along the sheltered channel at first light, following the route marked on the chart. The water is calm and green, and the patched sails of the local boats come and go around them like gulls.<br><br>The neighbouring island shows itself in stages: a headland, a line of white houses, and then a deepwater quay with three big traders tied along it and cranes swinging cargo. Out in the bay, a scatter of smaller boats is circling. None of them is heading in.<br><br>\"They're not even trying for the quay,\" Joel says. \"They're just waiting.\"<br><br>A harbor pilot comes out in a skiff and hails them. \"You'll want the main quay! Plenty of room at the north end.\"<br><br>\"What about the little boats?\" San asks. \"Why are they circling?\"<br><br>\"Public landing's down. The last heavy swell took the gangway clean off.\" The pilot shrugs. \"They can use the main quay like anyone else, if they pay for a berth.\"<br><br>San watches the circling boats a moment longer. Then she nods. \"We'll take the north end.\"<br><br>The Crimson Tide berths at the main quay, and the crew goes ashore.",
    77: "The market runs along the back of the quay, stall after stall under striped awnings. Aisyah is three stalls in, haggling over lemons, when she stops in the middle of a sentence.<br><br>At the next stall, a fish seller is shaking her head at a customer. \"Sorry. I've got nothing today. My brother's catch is still on his boat.\"<br><br>\"Then why doesn't he bring it in?\" the customer asks.<br><br>\"Because the landing's down. He'd have to tie up at the main quay, and the berth fee would eat most of what we make this morning.\" The fish seller nods at the bay. \"So he's circling. Waiting for a better answer.\"<br><br>Aisyah listens to all of it, then goes to find San on the quay.<br><br>\"It isn't a mystery,\" Aisyah says. \"It's a fee.\"<br><br>San has already seen the circling boats. She finds the fish seller again. \"We have a tender,\" she says. \"We can bring your brother's catch ashore. No berth, no fee.\"<br><br>\"You'd do that?\" the fish seller says. \"You don't know us.\"<br><br>\"We'd like to know what it would take to fix the landing, too,\" San says. She walks to the end of the quay and asks the harbor pilot.<br><br>\"A proper gangway,\" the pilot says. \"And a way to get it here. Try the boatbuilder, across the bay.\"",
    78: "The boatbuilder's yard is a long shed open to the water, with hulls in every stage of planking. The boatbuilder meets San and Joel at the slip with sawdust in her hair and a pencil tucked behind each ear.<br><br>\"The gangway?\" she says. \"It's finished. Has been for two weeks. Ironwood, brass fittings, the lot.\" She points.<br><br>It lies along the back wall, longer than the shed's biggest hull is wide.<br><br>\"The trouble is getting it across,\" she says. \"My workboat can't carry it in one piece, and I won't cut it. A gangway in two halves is a gangway that fails the first time someone carries a barrel over it.\"<br><br>Joel walks its length, rapping the frame and checking the lifting points. \"It's sound,\" he says. \"Four good points. The Crimson Tide has tackle that can take it. We lift it clear, lay it on deck, and carry it across.\"<br><br>\"Deck space,\" Aisyah says, arriving at San's elbow with her notebook open. \"I've been over the plan. Between the forward hatch and the boat cradles, there's room. I just need the boatbuilder to tell me how it should lie.\"<br><br>\"On its side, padded at the points,\" the boatbuilder says at once. Then, firmly: \"And I'm coming with it.\"<br><br>\"There's no need,\" San begins.<br><br>\"I built it. I'll fit it.\" The boatbuilder takes one of the pencils from behind her ear. \"Nobody else is putting my gangway in crooked.\"<br><br>Joel catches San's eye, and neither of them argues.",
    79: "Joel holds the Crimson Tide in the swell off the public landing, bow to the wind, steady as a pier. The tackle swings the gangway out over the water, and the boatbuilder walks along it with one hand on the rail, calling the lay of it one inch at a time.<br><br>\"Left. Left. Hold. Down, slow, slow!\"<br><br>On the landing, the islanders are waiting with ropes and iron pins, and they secure the far end as soon as it touches the stone. The boatbuilder checks every fitting, tests the rail with her whole weight, and steps back.<br><br>\"Well,\" she says. \"That'll do.\"<br><br>A cheer goes up along the shore, and for a moment nobody quite knows what to do. Then one of the circling boats turns for the landing.<br><br>It's the fish seller's brother, standing in the stern with his catch heaped in the bow. He ties up at the new landing, steps onto the gangway, and finds his sister waiting at the top with her arms folded.<br><br>\"You're late for lunch,\" she tells him.<br><br>\"I was circling!\"<br><br>\"Then circle faster.\"<br><br>Before the crew leaves, Aisyah walks the market once more. The stalls that couldn't restock for weeks are finally open, and she comes back down the quay with her arms full of provisions for the voyage home.<br><br>The island's landing is open to everyone again.",
    80: "The Crimson Tide is a day out from the island when San, passing along the lower deck, hears Devon's voice through a half-open cabin door.<br><br>\"If your window does overlap with Sally's,\" Devon says, \"where would you want to stay?\"<br><br>\"Near Sky,\" Jade says at once. \"And the infirmary. Close enough that nobody has to run.\" There is a pause. \"I'd like Sally nearby, if she wants the same.\"<br><br>San keeps walking, and finds Joel at the end of the passage, trying very hard not to be caught listening to the next cabin.<br><br>\"A room of my own,\" Sally is saying, in the cabin beyond. \"That's what I want. With Jade close enough that I can hear her complain.\"<br><br>\"Through the wall?\" Levi asks.<br><br>\"Through the wall. I'd feel better knowing she's right there.\"<br><br>\"She'll complain about the noise from your side.\"<br><br>\"I'm counting on it.\"<br><br>San and Joel look at each other. Joel mouths something that might be <i>a cabin across the hall</i>. San nods.<br><br>By the time the Crimson Tide raises Fair Tide, both couples have agreed to look at rooms when they get home. The due windows are still only estimates.",
    81: "Fair Tide in the late afternoon is a different kind of busy. Crates come down the gangway in a steady line, and Joel keeps the count. San is somewhere in the middle of it with a list.<br><br>At a long table by the window, Sera has joined Jade and Sally for a meal, with bowls of something warm and far too much bread.<br><br>\"What do you like about staying here?\" Jade asks. \"Honestly. Not the polite answer.\"<br><br>Sera thinks about it. \"That I get to decide how to spend a day,\" she says, \"before anyone else has decided it for me.\"<br><br>Jade laughs, softly and without surprise. \"That's a good answer.\"<br><br>\"It's a rare thing, where I'm from,\" Sera says. \"Here it feels very ordinary. I'm fond of how ordinary it is.\"<br><br>\"You should stay as long as you like,\" Sally says.<br><br>\"I might.\" Sera turns her cup between her hands. \"If you go back to that island, would you bring something from the market for me? Next time?\"<br><br>Sally reaches under the bench and sets a small wrapped parcel on the table. \"I already did.\"<br><br>Sera stares at it, and then, slowly, she smiles.",
    82: "The research room at Fair Tide has been cleared for the briefing. A long table, a lamp, and a stack of folders squared to the table's edge.<br><br>Erynn goes first. He presents Devon's account in order, from the first custody he can name to the last. Then he lays a hand flat on the page where the written record ends. \"After this line,\" Erynn says, \"there is only what Devon remembers. He told me so himself.\"<br><br>Fen follows, with the Dragonvale records and charts spread beside it. \"Some of it I can corroborate,\" she says, pointing. \"These references hold up against the records. These can't be confirmed either way. I've marked both.\"<br><br>San reads the two lists side by side. \"A handful of things that match,\" she says, \"and a gap.\"<br><br>\"Devon trusted us with it,\" Joel says. \"So the study is ours to set up.\"<br><br>\"Then we begin with observation,\" San says. \"The Pearl stays in its case, we touch nothing, and nothing goes near the Horizon Engine.\"<br><br>Adrian's protocol sits at the end of the table, a proposal for a baseline. \"It gives Renn and Mimi a place to start,\" Erynn says. \"Technical observation and divination, for the next round.\"<br><br>\"One request,\" Joel says. \"Every finding gets copied for Devon. He handed us the Pearl. He should be able to follow the work.\"<br><br>\"Of course,\" Fen says, and starts a new folder.",
    83: "Late that night, San and Joel spread the chart across the table at Fair Tide, under the same lamp that lit the briefing.<br><br>The Central Gate sits at the top of the page. Beyond it, three places are inked in Joel's careful hand: the island harbor, the outer island, and the neighbouring island with its new landing. Down one margin, in Aisyah's tidy script, are the market days. Fourth and seventh. Argue about the price.<br><br>\"Three places we can sail back to,\" San says. \"Not so long ago, I didn't know the Gate had an island behind it.\"<br><br>\"Calm water between all three,\" Joel says. \"If the weather holds.\"<br><br>San traces the route with one finger, from the Gate to the harbor, along the channel, and out to the island with the gangway. \"Will you make a copy of this? For the harbor office. For whoever the next captain is who wants to make the crossing.\"<br><br>\"The route, and the market days?\"<br><br>\"The market days especially,\" San says. \"They'll thank us for those.\"<br><br>Joel starts the copy that night. The chart stays open on the table, and every discovered destination stays open on the travel list.",
    84: "The Crimson Tide is nearly ready to cast off, and the dock at Fair Tide is full of last-minute errands. Crates, rope, a barrel somebody swears is already aboard. San is at the rail with a list, and Joel is checking the lashings along the waist.<br><br>Jovie comes down the quay with a supply chest on her hip. \"Infirmary stores,\" she says. \"Bandages, salves, the willow bark. Sky said you'd forget them.\"<br><br>\"We'd have remembered,\" San says. \"Eventually.\"<br><br>At the foot of the boarding ramp, Sairen is testing the cleats. Jovie sets the chest down beside him.<br><br>\"When do you expect to be back?\" she asks.<br><br>\"The ship's best estimate is three weeks, give or take the wind.\" Sairen tugs a line, frowns at it, and looks up. Then he stops, because she hasn't looked at the ship once. \"You weren't asking about the ship.\"<br><br>\"No,\" Jovie says.<br><br>He is quiet for a moment. \"I'll write,\" he says. \"If the voyage runs long.\"<br><br>\"I'd like to hear from you,\" Jovie says, \"even if it doesn't.\"<br><br>Up on deck, Joel suddenly finds a great deal to do with the same length of rope. San studies her list very carefully.",
    85: "At the public landing the crew helped reopen, the new gangway is already worn smooth by a week of boots and barrels. Aisyah is on the stone with her notebook when a woman in a dusty apron waves her over, with a bolt of sailcloth on her shoulder.<br><br>\"You're off the big ship,\" the cloth trader says. \"I'm bound for the port past the headland, and my own boat's in for caulking. I know the way. I can guide you there, if you'll carry me and two bolts of cloth.\"<br><br>\"What's past the headland?\" Aisyah asks.<br><br>\"Sailors who need cloth, and growers who need somebody to carry their fruit. Between them, a market.\" The trader grins. \"It's only half a day, and the water's deep all the way in.\"<br><br>Aisyah looks at San, and San looks at Joel.<br><br>\"Half a day,\" Joel says. \"Show me.\"<br><br>The trader stands at the bow and calls the headland one landmark at a time: the split rock, the pale cliff, the stand of wind-bent cedar. Joel follows every word. When the Crimson Tide rounds the last point, the water opens into a deepwater harbor, and above it the cliff is cut into green terraces, step after step of garden climbing toward the sky.<br><br>\"That,\" San says, \"is a lot of stairs.\"<br><br>The cliffside port is on your charts.",
    86: "The market begins where the quay ends. A long stair climbs the cliff in flights, with a landing at every turn, and every landing is a stall: sailcloth hung to dry like banners, trays of dried fruit sweetening the air, baskets of fresh herbs from the gardens above.<br><br>Aisyah follows the cloth trader up, one flight at a time, and is soon holding three samples and an opinion.<br><br>San climbs more slowly, watching the market rather than the stalls. At the upper landings, sailors haggle for cloth, and the garden growers trade fruit among themselves with plenty of room to spare. Down on the lower quay, there is none. Crates and sacks are stacked three high, waiting for someone to carry them uphill.<br><br>\"They've got buyers at the top,\" San says. \"And goods at the bottom.\"<br><br>A porter leans on a hand-truck beside her, catching a breath. \"That's the hoist,\" the porter says, pointing. \"We've got the one. Next ship's already due, and she'll want it too.\"<br><br>\"One hoist,\" San says.<br><br>\"One hoist,\" the porter agrees. \"And a lot of stairs.\"",
    87: "The harbor master finds Joel on the quay with a slate in one hand. \"You're in the best berth,\" the harbor master says. \"I need it. There's a ship rounding the headland. If you'd move to the outer anchorage, she can come straight in.\"<br><br>\"Of course,\" Joel says, and has the Crimson Tide moved before the slate is back in the harbor master's pocket.<br><br>The arriving ship comes around the headland under easy sail, with her crew already at the rail. Then the wind turns. A hard gust sweeps down off the terraces and shoves her toward the stone quay. Her crew scramble for a line, but she's drifting faster than anyone can get one ashore.<br><br>Joel is already moving. The Crimson Tide's tender goes over the side, and Joel brings it alongside the drifting ship's bow. \"Your line!\" Joel shouts. \"Throw it down!\"<br><br>The line comes down in a heavy coil. Joel takes it in, runs it ashore, and makes it fast to the nearest bollard. The ship's bow swings, hesitates, and comes to rest against the fenders.<br><br>On the quay, San is holding back the unloading crews with both arms out. \"Stay clear until both lines are fast!\" she calls. \"Everyone back!\"<br><br>They hold. The second line goes ashore. Then the third.<br><br>The quay lets out a long breath.",
    88: "By evening the quay has settled. The arriving ship's cargo is coming off in a slow, orderly line, and the Crimson Tide rides at the outer anchorage with her lamps lit.<br><br>Sairen finds a coil of rope to sit on, a sheet of paper and a stub of pencil, and writes.<br><br><i>Day three. Wind fair. Quay crowded, one working hoist. Ship secure. Crew in good health.</i><br><br>He reads it back. He tears it in half.<br><br>\"That's a watch report,\" Joel says, passing with a bucket.<br><br>\"I know.\" Sairen takes a fresh sheet.<br><br>The second one takes longer. He writes about the long stair up the cliff and how he counted the steps twice and got two different answers. He writes about the view from the top, where the whole harbor lies under the gardens like a spilled jewel box. He writes about a stall near the third landing, selling dried fruit by the scoop, and how Jovie would certainly stop there first.<br><br>When he is done, he doesn't tear it up.<br><br>A homebound trader is loading at the next berth, bound for Fair Tide in a day. She agrees, with a shrug, to carry one letter.<br><br>The letter is on its way to Fair Tide.",
    89: "The cloth trader finds Aisyah on the quay the next morning, wearing a very determined expression.<br><br>\"The harbor master says no to selling at the quay,\" the trader says. \"Too crowded, too many carts. But I've done the sums. On the busiest days, half the cloth that goes up the stairs could be sold at the bottom, to the sailors who haven't got time to climb.\"<br><br>\"Prove it,\" Aisyah says.<br><br>\"That's what I'm asking you to help with.\"<br><br>Aisyah thinks about it. Then she opens her notebook. \"A standing order,\" she says. \"Sailcloth for the Crimson Tide, collected here at the quay, every voyage. Twelve bolts. If the harbor master lets one stall sell at quay level, I'll make it worth the trouble.\"<br><br>The trader stares. \"You'd put that in writing?\"<br><br>\"I'd put it in the ledger.\"<br><br>The harbor master takes some persuading, and a long look at the ledger entry, and agrees to try it on the busiest days. The trader handles the arrangement with the local sellers, with a great deal of arm-waving and a great deal of laughing.<br><br>By midday, the first stall has come down to the quay. Aisyah buys a scoop of dried fruit from it, and then another, and brings them both back to the ship.<br><br>The lower market is open.",
    90: "The research room at Fair Tide is quiet and unusually tidy. Two stools sit at opposite ends of a long bench, with a closed case between them and a partition of folded cloth in the middle of the room.<br><br>Renn is on the left stool, writing steadily. He records the conditions around the Pearl: the time, the tide, the temperature, each instrument and what it reads. When something doesn't change, he writes that down too, because a baseline is mostly things that don't change.<br><br>On the right stool, behind the cloth, Mimi keeps a separate account. She writes what she perceives, in her own words, and next to each line, how sure she is of it. Some lines she crosses out. Some she underlines.<br><br>Neither of them looks at the other's page. Adrian has made that a rule.<br><br>When both are finished, Adrian takes the two accounts and sets them side by side on the bench. \"Now,\" Adrian says. \"Compare.\"<br><br>They read in silence. Where the two accounts agree, they note it. Where they don't, they leave both versions on the page. Mimi circles one line twice and doesn't say why.<br><br>Nothing in either account says what the Pearl is. Neither says what it will do, and neither says where it will end up. Those questions stay open.<br><br>They file the two accounts together, and Renn copies both for Devon, as Joel asked at the first briefing.",
    91: "The Crimson Tide comes back into Fair Tide with her holds full: sailcloth for the ship's spare rigging, and dried fruit for the galley, more of it than Aisyah will admit to buying.<br><br>On the quay, Jovie is waiting. She doesn't wave. She waits until Sairen is down the ramp.<br><br>\"I got your letter,\" she says.<br><br>\"It was meant to be short,\" Sairen says.<br><br>\"It was perfect.\" Jovie holds his gaze a moment longer than she needs to. \"The stall near the third landing. Is it real?\"<br><br>\"It's real. It's the best one.\"<br><br>\"Then take me there someday,\" Jovie says. \"To the cliffside market. I'd like to see the stairs you counted twice.\"<br><br>Sairen opens his mouth, closes it, and says: \"When are you next free?\"<br><br>Jovie laughs, quietly, and doesn't answer yet.<br><br>Across the quay, Aisyah is at the chart table with her notebook open. She finds the port past the headland, and writes its market day in the margin beside the others.<br><br>The cliffside port stays open for return voyages."
  };
  window.CRIMSON_HORIZON_CHAPTER_SCENES = CRIMSON_HORIZON_CHAPTER_SCENES;

  window.crimsonHorizonObjectiveState = function(){
    if (!game.arc42Complete) return null;
    if (level() < 645) return null;
    game.comicProgressCrimsonHorizon = game.comicProgressCrimsonHorizon || {};
    for (const ch of CRIMSON_HORIZON_CHAPTERS) {
      if (CH_SIDE[ch.id]) continue; // side chapters never hold up the chain
      if (!game.comicProgressCrimsonHorizon[ch.id]) return 'complete_crimson_horizon_chapter_' + ch.id;
    }
    return 'crimson_horizon_part1_complete_for_now';
  };

  // ===================================================================
  // PORTS -- per San's redesign: Crimson Horizon is played in Crimson
  // Tide as new DESTINATIONS on top of the existing ports, not as a
  // list of mini-objectives. Each destination's chapters open as story
  // modals when the crew docks there; finishing a stage unlocks the
  // next destination.
  //
  //   The Harbor Beyond the Charts  Prologue, 001-010  (Arc 42 + Lv 645)
  //   Storm Shelf                   011-018, then 019-032 (second story
  //                                 stage, "Beneath the Storm Shelf")
  //   West Gate · Mist Straits      033-048
  //   South Gate · Deep Channel     049-064 (open for the expedition
  //                                 after 048; regular travel after 061)
  //   Central Gate                  charted after 064, left locked for
  //                                 this build (Arc VI handoff)
  //
  // East Gate stays a passage in the story, not a port. Specialties,
  // danger and distances are PROVISIONAL defaults copied from the
  // existing late-game ports. Every unlock is DERIVED from
  // game.comicProgressCrimsonHorizon, so existing saves land in the right
  // state with no migration and no new unlock flags.
  // ===================================================================
  const CH_PORTS = [
    {id:'harbor_beyond_charts', name:'The Harbor Beyond the Charts', icon:'🌫️', danger:3, specialties:['rice','tea','rum'],
      desc:'An unmapped harbor past the edge of the old charts, its channel lights dark before every surge.',
      blurb:'A harbor that was never on the charts, kept alive by fishers and a pilot who remembers when the channel lights stayed lit.'},
    {id:'storm_shelf', name:'Storm Shelf', icon:'⛈️', danger:3, specialties:['antiquities','silk','tea'],
      desc:'Two storm fronts, an old watchtower, and something beneath the shelf that has been waiting to be found.',
      blurb:'Open water walled in by storms. The East Gate is the only fallback when the northern passage closes.'},
    {id:'west_gate', name:'West Gate · Mist Straits', icon:'🏮', danger:3, specialties:['timber','rum','pepper'],
      desc:'A fogbound strait where a light is not always a way home.',
      blurb:'The maintenance yard, the pilot quay and the shoals of the Mist Straits, where false lanterns have put ships aground.'},
    {id:'south_gate', name:'South Gate · Deep Channel', icon:'⚓', danger:3, specialties:['spices','antiquities','rice'],
      desc:'A deep channel with a hidden berth, an old rescue dock, and a rope pulled taut into the dark.',
      blurb:'Berth B-12 and the passage inside the cliffs. Until the first ship comes through, this is an expedition, not a public route.',
      tradeReady:function(){ return !!prog()[62]; }},
    {id:'central_gate', name:'Central Gate', icon:'🧭', danger:3, specialties:['timber','rice','rum'],
      desc:'A wide stone gate with the tide running through it, and an island harbor on the far side.',
      blurb:'The Central Gate, open after the South Gate was returned to local hands. Beyond it lies the first new shore.'},
    {id:'island_harbor', name:'Island Harbor', icon:'🏝️', danger:3, specialties:['tea','silk','spices'],
      desc:'A busy island harbor beyond the Central Gate, with trading boats already sailing out at first light. (Working name.)',
      blurb:'Green hills, a gold waterfront and a market that never quite closes. The crew\'s first landfall in a new place.'},
    {id:'outer_island', name:'Outer Island', icon:'🏖️', danger:3, specialties:['rice','tea','timber'],
      desc:'A green outer island behind a reef, with a small quay, a lee anchorage and a ridge market. (Working name.)',
      blurb:'The island the provisions were bound for. Until the cargo is delivered this is a provisions run, not a regular port.',
      tradeReady:function(){ return !!prog()[71]; }},
    {id:'channel_island', name:'Channel Island', icon:'⛵', danger:3, specialties:['spices','silk','timber'],
      desc:'The neighbouring island along the sheltered channel, with a deepwater quay and a public landing worth keeping. (Working name.)',
      blurb:'A busy deepwater quay, a market under striped awnings, and a public landing the islanders can use again.',
      tradeReady:function(){ return !!prog()[76]; }},
    {id:'terrace_harbor', name:'Terrace Harbor', icon:'🌿', danger:3, specialties:['sailcloth','dried_fruit','textiles'],
      desc:'A deepwater harbor beneath terraced gardens, with a market built up the cliff on one long stair. (Working name.)',
      blurb:'Sailcloth and dried fruit, a stair of stalls climbing the cliff, and a lower quay that is finally allowed to trade.'}
  ];

  // New trade goods for the cliffside port (draft, for review): both sell
  // cheaper at Terrace Harbor, where they are specialties. Added to the
  // existing GOODS table so the standard market, cargo and price systems
  // handle them with no other changes.
  if (typeof GOODS !== 'undefined') {
    if (!GOODS.sailcloth) GOODS.sailcloth = { name: 'Sailcloth', icon: '⛵', basePrice: 42, weight: 1 };
    if (!GOODS.dried_fruit) GOODS.dried_fruit = { name: 'Dried Fruit', icon: '🍇', basePrice: 26, weight: 1 };
  }
  const CH_PORT_IDS = CH_PORTS.map(function(p){ return p.id; });
  window.CRIMSON_HORIZON_PORTS = CH_PORTS;

  function prog(){ return (game && game.comicProgressCrimsonHorizon) || {}; }
  const CH_PORT_UNLOCK = {
    harbor_beyond_charts: function(){ return !!game.arc42Complete && level() >= 645; },
    storm_shelf: function(){ return !!prog()[11]; },     // Ch.010 read
    west_gate:   function(){ return !!prog()[33]; },     // Ch.032 read
    south_gate:  function(){ return !!prog()[49]; },     // Ch.048 read
    central_gate:function(){ return !!prog()[65]; },     // Ch.064 read: selectable, Ch.065 plays here
    island_harbor:function(){ return !!prog()[66]; },    // Ch.065 read (Make Landfall)
    outer_island: function(){ return !!prog()[70]; },    // Ch.069 read: provisions run; regular port after Ch.070
    channel_island: function(){ return !!prog()[75]; },  // Ch.074 read: sailable; regular port after Ch.075
    terrace_harbor: function(){ return !!prog()[85]; }   // Ch.084 read ("Enter Harbor"): sailable and a regular port
  };

  function registerCrimsonHorizonPorts(){
    if (typeof PORTS === 'undefined') return;
    const baseIds = PORTS.filter(function(p){ return CH_PORT_IDS.indexOf(p.id) === -1; }).map(function(p){ return p.id; });
    CH_PORTS.forEach(function(def){
      if (PORTS.some(function(p){ return p.id === def.id; })) return;
      const distances = {};
      baseIds.forEach(function(id){ distances[id] = (id === 'fair_tide') ? 5 : 6; });
      CH_PORTS.forEach(function(o){ if (o.id !== def.id) distances[o.id] = 2; });
      PORTS.push(Object.assign({chapterId:null, companion:null, guardian:null, harbor:['dock_thief','smuggler_crew']}, def, {distances:distances}));
    });
    PORTS.forEach(function(p){
      if (CH_PORT_IDS.indexOf(p.id) !== -1) return;
      CH_PORT_IDS.forEach(function(id){ if (p.distances && !p.distances[id]) p.distances[id] = (p.id === 'fair_tide') ? 5 : 6; });
    });
  }
  registerCrimsonHorizonPorts();

  const oldIsPortUnlockedForCH = window.isPortUnlocked;
  window.isPortUnlocked = function(id){
    if (CH_PORT_UNLOCK[id]) return !!CH_PORT_UNLOCK[id]();
    return oldIsPortUnlockedForCH(id);
  };

  // Destination cards: the next port is shown (locked) once the one
  // before it is open; Central Gate appears, charted but unreachable,
  // only after Ch.064.
  const oldRenderNavigationForCH = window.renderNavigation;
  window.renderNavigation = function(){
    oldRenderNavigationForCH.apply(this, arguments);
    const grid = document.getElementById('navPortGrid');
    if (!grid) return;
    CH_PORTS.forEach(function(def, i){
      const card = grid.querySelector('[data-port="' + def.id + '"]');
      if (!card) return;
      let revealed;
      if (def.id === 'central_gate') revealed = !!prog()[65];
      else if (i === 0) revealed = !!game.arc42Complete;
      else revealed = !!CH_PORT_UNLOCK[CH_PORTS[i - 1].id]();
      if (!revealed) { card.remove(); return; }
      if (def.id === 'south_gate' && CH_PORT_UNLOCK.south_gate() && !prog()[62] && game.location !== 'south_gate') {
        const d = card.querySelector('.port-dist');
        if (d) d.textContent = '🧭 Expedition — not yet a public route';
      } else if (def.id === 'outer_island' && CH_PORT_UNLOCK.outer_island() && !prog()[71] && game.location !== 'outer_island') {
        const d = card.querySelector('.port-dist');
        if (d) d.textContent = '📦 Provisions run';
      }
    });
  };

  function chapterPortId(id){
    return id <= 11 ? 'harbor_beyond_charts' : id <= 33 ? 'storm_shelf' : id <= 49 ? 'west_gate' : id <= 65 ? 'south_gate' : id <= 66 ? 'central_gate' : id <= 70 ? 'island_harbor' : id <= 74 ? 'outer_island' : id <= 75 ? 'island_harbor' : id <= 79 ? 'channel_island' : id <= 83 ? 'fair_tide' : id <= 84 ? 'fair_tide' : id <= 85 ? 'channel_island' : id <= 89 ? 'terrace_harbor' : id <= 91 ? 'fair_tide' : null;
  }
  function chPortName(portId){
    const p = CH_PORTS.find(function(x){ return x.id === portId; }) ||
      ((typeof PORTS !== 'undefined') ? PORTS.find(function(x){ return x.id === portId; }) : null);
    return p ? p.name : portId;
  }
  function chapterPlace(id){
    if (id <= 4) return '⛵ At sea — on the way to ' + chPortName('harbor_beyond_charts');
    if (id <= 11) return '⚓ ' + chPortName('harbor_beyond_charts');
    if (id <= 19) return '⚓ Storm Shelf · Stage I';
    if (id <= 33) return '⚓ Storm Shelf · Stage II — Beneath the Storm Shelf';
    if (id >= 67 && id <= 70) return '⚓ Island Harbor · A New Shore';
    if (id >= 71 && id <= 74) return '⚓ Outer Island · The Outer Island Run';
    if (id === 75) return '⚓ Island Harbor · The Outer Island Run';
    if (id >= 76 && id <= 79) return '⚓ Channel Island · A Harbor for Everyone';
    if (id === 80) return '⛵ At sea — on the way back to Fair Tide';
    if (id === 82) return '⚓ Fair Tide · Black Pearl Study (research chapter)';
    if (id === 84 || id === 91) return '⚓ Fair Tide · The Far Side of the Headland';
    if (id === 85) return '⚓ Channel Island · The Far Side of the Headland';
    if (id >= 86 && id <= 89) return '⚓ Terrace Harbor · The Far Side of the Headland';
    if (id === 90) return '⚓ Fair Tide · Black Pearl Study (research chapter)';
    if (id === 81 || id === 83) return '⚓ Fair Tide · A Harbor for Everyone';
    return '⚓ ' + chPortName(chapterPortId(id));
  }
  window.crimsonHorizonChapterPort = chapterPortId;

  // Messages shown in a modal when finishing a chapter opens something new.
  const CH_UNLOCK_NOTES = {
    11: 'Storm Shelf is now on your charts. Sail there to continue the voyage.',
    19: 'Beneath the Storm Shelf is now open as the second story stage at Storm Shelf.',
    33: 'West Gate · Mist Straits is now on your charts.',
    49: 'South Gate · Deep Channel is now on your charts as an expedition.',
    62: 'The first ship is through. South Gate · Deep Channel is now open to regular travel.',
    65: 'The Central Gate is now open. Sail through it to continue the voyage.',
    66: 'Island Harbor is now on your charts, with standard port and trade interactions.',
    70: 'Outer Island is now on your charts for the provisions run. Sail there to deliver the cargo.',
    71: 'The provisions are delivered. Outer Island is now a regular port, open for return visits and trade.',
    75: 'Channel Island, the neighbouring island, is now on your charts. Sail there to continue.',
    76: 'Channel Island is now a regular port, open for return visits and trade.',
    85: 'Terrace Harbor (working name), the cliffside port past the headland, is now on your charts as a regular port with trade. Sail there to continue.'
  };

  // ===================================================================
  // CHAPTER FLOW -- Read Chapter -> objective modal -> Continue.
  // A chapter's objective modal may carry one button ("Check the
  // Lantern") that shows its result in the modal, or a real DCT fight
  // for the chapters that depict one. Checks never fail; a fight must be
  // won, and can be retried any number of times.
  // ===================================================================
  const CH_CHECKS = {
    9:  {label:'⚓ Hold the Passage', objective:'Steady the current, coordinate the crossing and get a towline to the stranded boats.',
         result:"San steadies the current while Jade calls the crossing and Sally's towline lands across the second boat's bow. The first boat clears the gate. The second loses steerage as the gate starts to close, and the Crimson Tide is already moving in behind it."},
    27: {label:'🗺️ Plot the Pulse Against the Current', objective:'Trace the next pulse along the outer current.',
         result:'Devon and Renn lay the pulse timings over the outer current. The line runs straight to the East Gate, where ships are already using the same fallback the crew took. Joel marks the arrival window on the chart.'},
    34: {label:'🔦 Check the Lantern', objective:'Judge whether the flashing light is the real route marker.',
         result:'Levi watches the light through the glass for a full minute. It sits where the second marker should be, but it drifts against the current, the way no fixed lantern could. Joel holds the Crimson Tide where it is. "That\'s not the marker."'},
    40: {label:'👣 Follow the Bootprints', objective:'Cross the low-water shoal and find where the prints lead.',
         result:'Levi and Sairen follow the prints across the exposed shoal. They end at a small skiff, the missing lantern mounted on its mast and a West Gate coupling fitted beneath it.'},
    43: {label:'🌫️ Steer Into the White Water', objective:'Reach the convoy before its lead ship commits to the false light.',
         result:"Joel takes the Crimson Tide into the fog while Mezstorm clears brief gaps in it. They break through just as the convoy's lead ship begins to turn toward the false light."},
    45: {label:'🏮 Light the Real Channel', objective:'Get the spare lantern lit so the convoy can follow the true channel.',
         result:'The spare lantern catches on the empty post. Three short pulses, a double pause, a long one: the true channel is marked again, and Joel leads the convoy through to the waiting pilot.'},
    50: {label:'🔎 Survey Berth B-12', objective:'Inspect the line, the guide ring and the berth marker.',
         result:'The rope is worn smooth where small boats have hauled on it, and the submerged guide ring is polished bright. The hidden approach is added to the chart.'},
    51: {label:'📋 Review the Consignment Record', objective:'Verify SV-7740 and prepare the marked crate.',
         result:"SV-7740 matches the coupling in the crate, and the recipient line is still blank. The original coupling stays locked in Fair Tide, and Sally's substitute crate is marked and ready. The stakeout is unlocked."},
    52: {label:'⛵ Follow the Tender', objective:'Let the tender get ahead, then follow it through the marked route.',
         result:'Joel lets the tender draw ahead before the launch follows. The line leads it toward the cliff and into a narrow opening in the rock that only shows at high tide. The cliff entrance is on the chart.'},
    53: {label:'🧭 Mark Both Exits', objective:'Survey the dock from cover and mark both exits.',
         result:'From cover the scouts mark the haulage lift to the upper passage and the water exit. The rescue dock is unlocked, and the spot where the tender unloaded is marked.'},
    54: {label:'🤫 Make Contact', objective:'Reach the captives without alerting the guards.',
         result:"The message passes hand to hand while the guards look the other way. It holds a tally of the captives and the bunkroom's location. The extraction plan is unlocked."},
    55: {label:"👂 Overhear the Keeper", objective:"Inspect the opened crate and listen to the Keeper's orders.",
         result:'The Keeper turns the coupling over and demands the missing one. With it he could run the public gate and the hidden passage on his own. SV-7740 was ordered for exactly that.'},
    56: {label:'📐 Compare the Diagram', objective:"Match Renn's diagram to the scouts' notes and fix the order of operations.",
         result:'The diagram and the notes agree: opening the public gate floods the lower service stairs. Everyone goes above the flood line first. Then the gate.'},
    57: {label:'📣 Confirm the Plan', objective:'Confirm the extraction route, the recall signal and the launch pickup point.',
         result:'Route through the upper passage. Recall: three bells. Pickup: the upper landing. Every team has its part, and the rescue starts.'},
    58: {label:'🗝️ Recover the Key', objective:'Reach the bunkroom, recover the key and bring the pilots to the upper landing.',
         result:'The key hangs inside the loft door, and the bunkroom opens. One pilot can barely walk, so the team goes slowly and counts every captive twice before they climb.'},
    61: {label:'🎛️ Work the Controls', objective:'Three ordered interactions: shut the bypass, confirm the stairs, open the gate.',
         result:'First the private bypass shuts. Then the gate team confirms the lower stairs are empty. Then the public gate opens, and the channel runs clear.'},
    62: {label:'⛵ Escort the First Vessel', objective:'Escort the first ship through the reopened channel.',
         result:'A freed pilot takes the helm of a waiting vessel. Joel follows at a distance while the shore team watches the current. The ship clears the channel, and the South Gate route is open to regular travel.'},
    66: {label:'🏝️ Make Landfall', objective:'Bring the Crimson Tide through the Central Gate and take a berth at the island harbor.',
         result:'Joel brings the Crimson Tide through the gate at first light. A local pilot waves them toward the quay, and the lines go ashore. The island harbor is on your charts.'},
    67: {label:'🛍️ Go Ashore', objective:'Spend a day ashore: the market, the waterfront and a bench on the harbor wall.',
         result:'Aisyah finds the market, Joel finds the twins a fish stall, and San and Jade find a bench. By evening the crew is rested, fed and a little sunburnt.'},
    68: {label:'🤝 Offer Passage', objective:'Offer the skipper room aboard and set up the provisions run.',
         result:'San offers room aboard for the skipper and her cargo. The skipper shows Joel where she normally lands, and the provisions are stowed for the run.'},
    70: {label:'⛵ Prepare to Sail', objective:'Make ready to leave. The provisions are aboard and the crew is accounted for.',
         result:'The cargo is lashed down, the watches are set, and the approach the skipper marked is on the chart. The Crimson Tide is ready to sail.'},
    71: {label:'⚓ Make Landfall', objective:'Anchor in the lee and bring the provisions ashore in the islanders\' small boats.',
         result:'Joel anchors in the lee, and the islanders ferry the provisions to the quay one boat at a time. The last load goes ashore with the skipper. The provisions are delivered, and the Outer Island is open for return visits.'},
    72: {label:'⛵ Return Aboard', objective:'Return aboard after the unloading, and make time for two private conversations.',
         result:'Jade tells Devon, who starts counting the months aloud. On the beach, Sally tells Levi. The due dates are still only estimates, and both conversations end on the same question: where home will be.'},
    73: {label:'🛒 Visit the Ridge Market', objective:'Walk the ridge road to the market. Standard port and trade interactions are open at the Outer Island.',
         result:'Aisyah works the stalls while San and Joel take in the view of the sheltered channel. The skipper hands over her outgoing mail for the harbor, and the mail travels with the crew.'},
    74: {label:'🎧 Listen to the Story', objective:'Hear how the earliest version of the manuscript began, and what Jade remembers.',
         result:'San tells the opening up to the first decision she remembers making differently. Jade tells her what she remembers, and why. When Devon comes looking, Jade asks him to stay and hear her version.'},
    75: {label:'🧭 Chart the Channel', objective:'Deliver the mail, learn the market days, and mark the sheltered channel on the chart.',
         result:'The mail is delivered, and Aisyah has the market days written down. Joel inks the sheltered channel on the chart. The harbor and the Outer Island both stay open for return visits, and San points to the next island.'},
    76: {label:'⚓ Enter Harbor', objective:'Follow the charted route to the neighbouring island and berth at the main quay.',
         result:'Joel follows the route charted in the last chapter. The deepwater quay is busy, the small boats are circling offshore, and the Crimson Tide takes a berth at the north end of the main quay.'},
    77: {label:'🛒 Visit the Market', objective:'Walk the market and find out why the small boats are circling.',
         result:'A fish seller has nothing to sell because her brother cannot land his catch without paying a berth fee that would take most of the morning\'s earnings. San offers the ship\'s tender, and asks the harbor pilot what it would take to reopen the landing.'},
    78: {label:'🔨 Visit the Boatyard', objective:'Find the replacement gangway and work out how to carry it across the bay.',
         result:'The gangway is finished, but the boatbuilder\'s workboat cannot carry it in one piece. Joel checks the lifting points and offers the Crimson Tide\'s tackle, and the boatbuilder comes along to fit it herself.'},
    79: {label:'⚓ Reopen the Landing', objective:'Hold the ship steady while the gangway is set in place.',
         result:'The gangway goes into place at the first try, and the islanders secure it from shore. The first boat in is the fish seller\'s brother, late for lunch. Aisyah restocks from the stalls that can finally supply the voyage home.'},
    80: {label:'🗣️ Talk Below Deck', objective:'Listen in on the quiet plans being made on the voyage back to Fair Tide.',
         result:'Jade wants to be near Sky and the infirmary, with Sally nearby if she wants the same. Sally wants a room of her own and Jade close enough to complain through the wall. Both couples agree to look at rooms at Fair Tide. The due windows are still only estimates.'},
    81: {label:'🏮 Return to Fair Tide', objective:'Bring the Crimson Tide home and join Sera, Jade and Sally for a meal.',
         result:'Fair Tide is busy with unloading. At the long table, Sera says what she likes about staying here, and Sally hands over the parcel she already bought from the island market.'},
    82: {label:'📋 Review the Findings', objective:"Hear Erynn's and Fen's reports and decide how the study begins.",
         result:"Erynn's record of Devon's account and Fen's cross-check are on the table. San and Joel agree the study begins with observation, with Adrian's protocol as the starting point for Renn and Mimi. Every finding will be copied for Devon."},
    83: {label:'🧭 Review the Chart', objective:'Look over the chart and decide what to leave for the next captain.',
         result:'Three places beyond the Central Gate are marked on the chart, with Aisyah\'s market days in the margin. Joel starts a copy for the harbor office, and every discovered destination stays on the travel list.'},
    84: {label:'🎒 Prepare to Depart', objective:'Load the infirmary stores and make ready to leave Fair Tide.',
         result:'The infirmary stores are aboard, the ramp is checked, and Sairen has promised to write if the voyage runs long. The Crimson Tide is ready to leave Fair Tide.'},
    85: {label:'⚓ Enter Harbor', objective:'Follow the cloth trader\'s directions around the headland.',
         result:'The cloth trader calls the landmarks one at a time and Joel follows each. Past the last point the water opens into a deepwater harbor beneath terraced gardens. The cliffside port is on your charts.'},
    86: {label:'🛒 Visit the Market', objective:'Climb the stairs to the market and see what the port trades.',
         result:'Sailors buy sailcloth and garden growers trade dried fruit. The upper market has room for both, but the lower quay is packed with cargo and there is only one working hoist.'},
    87: {label:'🪢 Take the Line', objective:'Clear the berth, then help the arriving ship when the gust pushes it toward the quay.',
         result:'Joel moves the Crimson Tide to the outer anchorage. When the arriving ship drifts, Joel brings the tender alongside and takes its line in, and San keeps the unloading crews clear until both ships are secure.'},
    88: {label:'✉️ Send the Letter', objective:'Write to Jovie, and find someone to carry it to Fair Tide.',
         result:'The first attempt reads like a watch report, so Sairen starts again. The second tells Jovie about the stairs, the view and the stall she would stop at first. A homebound trader agrees to carry it to Fair Tide.'},
    89: {label:'⚖️ Trade at the Quay', objective:'Help the cloth trader make the case for selling at quay level.',
         result:'Aisyah puts in a standing order for sailcloth that can be collected at the quay. The harbor master agrees to try it on busy days, and the first stall comes down to the lower quay.'},
    90: {label:'📖 Read the Observations', objective:"Read Renn's conditions record and Mimi's separate account together.",
         result:"Renn's record of conditions and Mimi's account of her impressions are compared only after both are finished, and filed together. Neither says what the Pearl is. A copy goes to Devon."},
    91: {label:'🏠 Return to Fair Tide', objective:'Bring the sailcloth and dried fruit home, and see who is waiting on the quay.',
         result:'Sailcloth for the ship, dried fruit for the galley, and a conversation on the quay. The cliffside port stays open for return voyages, and Aisyah adds its market day to the chart.'},
    63: {label:'📖 Match the Records', objective:"Match the Keeper's dispatch book to the West Gate records.",
         result:'The same operation bought the Storm Shelf coupling and held the South Gate order under SV-7740. A separate entry schedules a service delivery at the Central Gate. The coupling investigation is closed, and the Central Gate lead is open.'}
  };

  // Objective text for chapters with no check button or fight.
  // Side chapters: read from somewhere other than the story chain, so
  // they never block it. Ch.081 (id 82) is the first Black Pearl
  // briefing: it opens from Research Team -> Black Pearl Study once the
  // reports are in and the player is at Fair Tide, so the research timer
  // never holds up Ch.082 or the next voyage. (black-pearl-research.js
  // supplies ready()/reason().)
  const CH_SIDE = {
    90: {
      ready: function(){ return typeof window.blackPearlObservationsReady === 'function' && window.blackPearlObservationsReady(); },
      reason: function(){ return (typeof window.blackPearlObservationsReason === 'function') ? window.blackPearlObservationsReason() : 'Not ready yet.'; }
    },
    82: {
      ready: function(){ return typeof window.blackPearlBriefingReady === 'function' && window.blackPearlBriefingReady(); },
      reason: function(){ return (typeof window.blackPearlBriefingReason === 'function') ? window.blackPearlBriefingReason() : 'Not ready yet.'; }
    }
  };
  window.CRIMSON_HORIZON_SIDE_IDS = Object.keys(CH_SIDE).map(Number);
  // Chapters that open the next one automatically: the Prologue-003 run at
  // sea, then landfall (004); and the voyage home (079) into Fair Tide (080).
  const CH_CHAIN = [1, 2, 3, 4, 80];

  const CH_NOTES = {
    69: 'Stay on deck after the others go below, and tell Jade about the manuscript.'
  };

  // Chapters that depict a fight use existing DCT combat. Pinned to the
  // sequel's gate level, same one-off-story-fight pattern as Arc XLII's
  // frontier battle; enemy numbers are provisional.
  const CH_FIGHTS = {
    3:  {label:'⚔️ Face the Stormborn Leviathan', objective:'Bring down the Stormborn Leviathan before it breaks the ship.',
         enemy:{name:'Stormborn Leviathan', icon:'🌊', hp:1500, dmg:55, xp:700, gold:350, desc:'A colossal sea-born predator, awakened by a power unknown. The storm was only its shape.'}},
    59: {label:'⚔️ Hold the Landing', objective:"Hold the upper landing against the Keeper's tender until the escort is clear.",
         enemy:{name:"The Keeper's Tender Crew", icon:'🛶', hp:1300, dmg:48, xp:650, gold:330, desc:'Hooks, oars and orders to keep the launch from the landing.'}},
    60: {label:'⚔️ Take the Control Room', objective:"Defeat the Keeper's guard and secure the controls.",
         enemy:{name:"The Keeper's Guard", icon:'🛡️', hp:1500, dmg:52, xp:720, gold:360, desc:'The last line between the party and the gate mechanism.'}}
  };

  window.CRIMSON_HORIZON_FIGHT_IDS = Object.keys(CH_FIGHTS).map(Number);

  function chState(){
    game.crimsonHorizonSceneSeen = game.crimsonHorizonSceneSeen || {};
    game.crimsonHorizonChecked = game.crimsonHorizonChecked || {};
    game.crimsonHorizonFights = game.crimsonHorizonFights || {};
  }
  function chById(id){ return CRIMSON_HORIZON_CHAPTERS.find(function(c){ return c.id === id; }); }
  function currentChapter(){
    const so = window.crimsonHorizonObjectiveState();
    return CRIMSON_HORIZON_CHAPTERS.find(function(c){ return so === ('complete_crimson_horizon_chapter_' + c.id); }) || null;
  }

  window.onCrimsonHorizonFightWon = function(key){
    chState();
    game.crimsonHorizonFights[key] = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  function startChapterFight(id){
    const f = CH_FIGHTS[id];
    if (!f || typeof startCombat !== 'function') return;
    if (typeof closeModal === 'function') closeModal();
    const enemy = scaleCrimsonEnemy(f.enemy, 'guardian', 645);
    startCombat({ kind: 'crimson_horizon', key: String(id), enemy: enemy });
  }

  function openObjective(id, resultHtml){
    chState();
    const ch = chById(id);
    if (!ch) return;
    const check = CH_CHECKS[id], fight = CH_FIGHTS[id];
    const fightWon = !!game.crimsonHorizonFights[String(id)];
    const checked = !!game.crimsonHorizonChecked[id];
    const objective = fight ? fight.objective : (check ? check.objective : (CH_NOTES[id] || 'Take in what the crew learns here, then continue the voyage.'));
    let html = '<div style="font-size:.78rem;opacity:.75;margin-bottom:8px;">' + esc(chapterPlace(id)) + '</div>' +
      '<div style="margin-bottom:8px;"><strong>Purpose</strong><br>' + esc(ch.focus) + '</div>' +
      '<div><strong>Objective</strong><br>' + esc(objective) + '</div>';
    if (fight && fightWon) html += '<div style="margin-top:10px;color:var(--success);">✓ Victory. The way is clear.</div>';
    if (check && checked) html += '<div style="margin-top:10px;">' + esc(resultHtml || check.result) + '</div>';
    const buttons = [];
    let canContinue = true;
    if (fight && !fightWon) {
      canContinue = false;
      buttons.push({text: fight.label, action: function(){ startChapterFight(id); }});
    } else if (check && !checked) {
      canContinue = false;
      buttons.push({text: check.label, action: function(){
        chState();
        game.crimsonHorizonChecked[id] = true;
        if (typeof saveGameQuiet === 'function') saveGameQuiet();
        openObjective(id, check.result);
      }});
    }
    buttons.push({text: 'Continue', action: function(){
      if (typeof closeModal === 'function') closeModal();
      completeChapter(id);
    }});
    showModal('Objective · ' + ch.title, html, buttons);
    if (!canContinue) {
      const btns = document.querySelectorAll('#modalButtons button');
      const cont = btns[btns.length - 1];
      if (cont) { cont.disabled = true; cont.style.opacity = '.45'; }
    }
  }

  function completeChapter(id){
    window.markCrimsonHorizonChapterRead(id);
    if (CH_CHAIN.indexOf(id) !== -1) {
      setTimeout(function(){
        if (window.crimsonHorizonObjectiveState() === ('complete_crimson_horizon_chapter_' + (id + 1))) window.__ctReadCrimsonHorizonChapter(id + 1);
      }, 900);
    }
  }

  window.__ctReadCrimsonHorizonChapter = function(id){
    chState();
    const ch = chById(id);
    if (!ch) return;
    const done = !!prog()[id];
    if (!done) {
      const side = CH_SIDE[id];
      if (side) {
        if (window.crimsonHorizonObjectiveState() === null || !side.ready()) { toast(side.reason(), 3600); return; }
      } else if (window.crimsonHorizonObjectiveState() !== ('complete_crimson_horizon_chapter_' + id)) { toast('🔒 Follow the current Objective first.'); return; }
      const portId = chapterPortId(id);
      if (portId && game.location !== portId && !(id <= 4 && game.location === 'harbor_beyond_charts')) {
        toast('⚓ Sail to ' + chPortName(portId) + ' to continue this chapter.', 3600);
        return;
      }
    }
    const scene = CRIMSON_HORIZON_CHAPTER_SCENES[id] || ch.focus;
    if (done || !game.crimsonHorizonSceneSeen[id]) {
      showModal(ch.title, scene, [{text: done ? 'Close' : 'Continue', action: function(){
        if (typeof closeModal === 'function') closeModal();
        if (!done) {
          game.crimsonHorizonSceneSeen[id] = true;
          if (typeof saveGameQuiet === 'function') saveGameQuiet();
          setTimeout(function(){ openObjective(id); }, 250);
        }
      }}]);
    } else {
      openObjective(id);
    }
  };

  // After a fight: reopen the current chapter's objective modal.
  window.__ctResumeCrimsonHorizonChapter = function(){
    chState();
    const ch = currentChapter();
    if (ch && game.crimsonHorizonSceneSeen[ch.id]) openObjective(ch.id);
  };

  window.markCrimsonHorizonChapterRead = function(id){
    const so = window.crimsonHorizonObjectiveState();
    const sideOk = !!(CH_SIDE[id] && so !== null && !(game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[id]) && CH_SIDE[id].ready());
    if (so !== ('complete_crimson_horizon_chapter_' + id) && !sideOk) return;
    game.comicProgressCrimsonHorizon = game.comicProgressCrimsonHorizon || {};
    game.comicProgressCrimsonHorizon[id] = true;
    const ch = chById(id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    // Ch.067 (id 68): the provisions run for the outer island is set up;
    // the next batch reads this when the outer island opens.
    if (id === 68) game.crimsonHorizonProvisionsRunReady = true;
    // Prologue (id 1): Jade, Devon, Sky, Levi and Sally join the party (scripts/canon-five.js).
    if (id === 1 && typeof window.grantCanonFiveIfDue === 'function') window.grantCanonFiveIfDue();
    // Ch.081 (id 82): the first Black Pearl briefing is held.
    if (id === 82 && typeof window.onPearlBriefingHeld === 'function') window.onPearlBriefingHeld();
    // Ch.089 (id 90): the first observations are filed.
    if (id === 90 && typeof window.onPearlObservationsRead === 'function') window.onPearlObservationsRead();
    // Ch.087 (id 88): Sairen's letter to Jovie is kept (Bonds tab, scripts/sairen-jovie-letters.js).
    if (id === 88 && typeof window.recordSairenLetter === 'function') window.recordSairenLetter();
    // Ch.074 (id 75): San points at a neighbouring island seen from the
    // ridge; reserved for a future arrival (not a port yet).
    if (id === 75) game.crimsonHorizonNeighbourIslandSet = true;
    const note = CH_UNLOCK_NOTES[id];
    if (note) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: '🧭 New Destination Charted', blurb: note });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof renderNavigation === 'function') { try { renderNavigation(); } catch(e) {} }
    if (note && typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(function(){ window.showStoryModal(next); }, 400);
    }
  };

  // Docking at a Crimson Horizon port opens that port's next chapter.
  const oldTriggerArrivalStoryForCH = window.triggerArrivalStory;
  window.triggerArrivalStory = function(portId){
    if (oldTriggerArrivalStoryForCH) oldTriggerArrivalStoryForCH.apply(this, arguments);
    if (CH_PORT_IDS.indexOf(portId) === -1 && portId !== 'fair_tide') return;
    setTimeout(function(){
      const ch = currentChapter();
      if (ch && game.location === portId && chapterPortId(ch.id) === portId) window.__ctReadCrimsonHorizonChapter(ch.id);
    }, 1400);
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
    // ends -- independent of the Level 645 chapter gate below.
    const sequelAnnounced = !!game.arc42Complete;
    if (sequelAnnounced && !game.crimsonHorizonSplashSeen && typeof window.__ctShowCrimsonHorizonSplash === 'function') {
      window.__ctShowCrimsonHorizonSplash();
    }
    const chReady = window.crimsonHorizonObjectiveState() !== null;
    if (!sequelAnnounced) return;
    const so = window.crimsonHorizonObjectiveState();
    const cur = currentChapter();
    const headerArc = cur ? cur.arc : CRIMSON_HORIZON_CHAPTERS[CRIMSON_HORIZON_CHAPTERS.length - 1].arc;
    const meta = CRIMSON_HORIZON_ARC_META[headerArc] || CRIMSON_HORIZON_ARC_META[1];
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">' +
      (meta.cover ? '<img src="' + meta.cover + '" alt="' + esc(meta.kicker + ': ' + meta.title) + '" style="width:100%;border-radius:8px;margin-bottom:12px;">' : '') +
      '<div class="story-act-kicker">' + esc(meta.kicker) + '</div><div class="story-act-title">' + esc(meta.title) + '</div>' +
      '<div class="story-act-tagline">' + esc(meta.tagline) + '</div></div>';
    if (!chReady) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Crimson Horizon Locked</div><div class="story-chapter-sub">Reach Level 645 to begin.</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    CRIMSON_HORIZON_CHAPTERS.forEach(function(ch){
      const done = !!prog()[ch.id];
      const side = CH_SIDE[ch.id];
      const ready = !done && (side ? (so !== null && side.ready()) : so === ('complete_crimson_horizon_chapter_' + ch.id));
      const portId = chapterPortId(ch.id);
      const docked = !portId || game.location === portId || (ch.id <= 4 && game.location === 'harbor_beyond_charts');
      const status = done ? '✓ COMPLETE' : (ready ? (side ? 'AVAILABLE' : 'CURRENT') : (side ? '⏳ WAITING' : '🔒 LOCKED'));
      let action;
      if (done) action = '<button class="btn btn-small" onclick="__ctReadCrimsonHorizonChapter(' + ch.id + ')">↺ Replay</button>';
      else if (ready && docked) action = '<button class="btn btn-small btn-success" onclick="__ctReadCrimsonHorizonChapter(' + ch.id + ')">📖 Read Chapter</button>';
      else if (ready) action = '<button class="btn btn-small btn-magic" onclick="sailTo(\'' + portId + '\')">⛵ Sail to ' + esc(chPortName(portId)) + '</button>';
      else if (side) action = '<div class="story-chip">' + esc(side.reason()) + '</div>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item ' + (done ? 'completed' : (ready ? 'active' : '')) + '"><strong>' + esc(ch.title) + '</strong><br>' +
        '<span style="font-size:.74rem;opacity:.7;">' + esc(chapterPlace(ch.id)) + '</span><br>' +
        '<span style="font-size:.82rem;opacity:.82;">' + esc(ch.focus) + '</span><br>' +
        '<span style="font-size:.78rem;">' + status + '</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +' + ch.xp + '</span><div class="story-actions">' + action + '</div></article>';
    });
    if (so === 'crimson_horizon_part1_complete_for_now') {
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Crimson Horizon chapters read so far. The next voyage is next — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
