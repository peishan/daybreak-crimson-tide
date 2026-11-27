(function(){
  // -------------------------------------------------------------------
  // CINEMATICS. Short video scenes (Arc I) that play once, at their moment in the story.
  //
  //   storm    The Storm That Remained  -> when the player opens Chapter 1
  //   malacca  Arrival at Malacca       -> the first time the ship sails into Malacca
  //   palembang, batavia, bangkok, hanoi, manila, kota_batu, fair_tide   Port arrivals  -> the first time the ship sails into each port
  //   joel     San Meets Joel           -> when the player opens Chapter 5
  //   rescue   The Rescue of Joel       -> when the player opens Chapter 6 (the arrival)
  //   rescueafter, aisyahafter, mezstormafter   -> the moment the guardian is beaten and the companion joins: the battle clip(s) play
  //                after the real fight, then the companion's splash (Joel: fight, conversation, embrace; Aisyah: the market fight; Mezstorm: the fight and the reunion)
  //   aboard   Welcome Aboard           -> when the player opens Chapter 7
  //   aisyah, eliz, mezstorm, senedra, zaki, twins, passage   -> when the player opens Chapters 12, 15, 18, 20, 21, 23, 24
  //   mimi, renn, erynn, twinsbirth, sparks   -> when Arc IV Ch10, Arc V Ch6, Arc VII Ch3, Arc XXXV Ch10 / Ch24, or Arc XXV Ch18 is marked read
  //
  // * Nothing is loaded at startup: no <video> exists until a cinematic is asked for, and
  //   the video is released the moment it ends or is skipped.
  // * Each cinematic is a list of clips played one after another. A clip file that is not there
  //   (yet) is skipped, and a cinematic with no clips at all is skipped silently without being
  //   marked as seen, so it plays once the files arrive.
  // * "Seen" is kept in the save (game.cinematics.seen), so every voyage has its own progress.
  //   A save from before this existed counts a cinematic as seen once the story has moved past
  //   its moment (Chapter 1 read, Chapter 2 started, Chapter 5 read), so old saves never get
  //   them replayed on their own. They can still be replayed from the Comic Archive.
  // * Automatic playback can be switched off (Settings, or the Comic Archive). That is a device
  //   preference (localStorage), not part of the save.
  // * Skip is always there. If the browser blocks sound, the clip plays muted with a tap-for-sound button.
  // Chapter, XP, objective and Story Mode state are never touched.
  // -------------------------------------------------------------------
  const BASE = 'assets/cinematics/arc1/';
  const CINEMATICS = [
    { id:'teaser', icon:'🎬', title:'Daybreak: Crimson Tide — Teaser', where:'On the title screen', base:'assets/cinematics/teaser/',
      clips:['daybreak-crimson-tide-teaser.mp4'],
      passed:function(){ return false; } },
    { id:'storm', icon:'⛈️', title:'The Storm That Remained', where:'Opens with Chapter 1',
      clips:['cin01-the-storm-that-remained-a.mp4', 'cin01-the-storm-that-remained-b.mp4'],
      passed:function(){ return !!(game.comicProgress && game.comicProgress[1]); } },
    { id:'malacca', icon:'⚓', title:'Arrival at Malacca', where:'The first time you sail into Malacca', port:'malacca',
      clips:['cin02-malacca-first-arrival.mp4'],
      passed:function(){ return !!((game.comicProgress && game.comicProgress[2]) || (game.foundCompanions && game.foundCompanions.joel)); } },   // (only used for saves that pre-date cinematics)
    { id:'palembang', icon:'🏘️', title:'Arrival at Palembang', where:'The first time you sail into Palembang', port:'palembang',
      clips:['cin04-palembang-first-arrival.mp4'],
      passed:function(){ return !!((game.foundCompanions && game.foundCompanions.aisyah) || (game.comicProgress && game.comicProgress[12])); } },
    { id:'batavia', icon:'🏛️', title:'Arrival at Batavia', where:'The first time you sail into Batavia', port:'batavia',
      clips:['cin06-batavia-first-arrival.mp4'],
      passed:function(){ return !!((game.foundCompanions && game.foundCompanions.eliz) || (game.comicProgress && game.comicProgress[15])); } },
    { id:'bangkok', icon:'🛕', title:'Arrival at Bangkok', where:'The first time you sail into Bangkok', port:'bangkok',
      clips:['cin07-bangkok-first-arrival.mp4'],
      passed:function(){ return !!((game.foundCompanions && game.foundCompanions.mezstorm) || (game.comicProgress && game.comicProgress[18])); } },
    { id:'hanoi', icon:'🏮', title:'Arrival at Hanoi', where:'The first time you sail into Hanoi', port:'hanoi',
      clips:['cin08-hanoi-first-arrival.mp4'],
      passed:function(){ return !!((game.foundCompanions && game.foundCompanions.senedra) || (game.comicProgress && game.comicProgress[20])); } },
    { id:'manila', icon:'🏝️', title:'Arrival at Manila', where:'The first time you sail into Manila', port:'manila',
      clips:['cin09-manila-first-arrival.mp4'],
      passed:function(){ return !!((game.foundCompanions && game.foundCompanions.zaki) || (game.comicProgress && game.comicProgress[23])); } },
    { id:'joel', icon:'🛡️', title:'San Meets Joel', where:'Opens with Chapter 5',
      clips:['cin03-san-meets-joel-a.mp4', 'cin03-san-meets-joel-b.mp4', 'cin03-san-meets-joel-c.mp4'],
      passed:function(){ return !!(game.comicProgress && game.comicProgress[5]); } }
    ,{ id:'rescue', icon:'⚔️', title:'The Rescue of Joel', where:'Opens with Chapter 6',
      clips:['cin05-joel-rescue-a.mp4'],
      passed:function(){ return !!(game.comicProgress && game.comicProgress[6]); } }
    ,{ id:'rescueafter', icon:'🛡️', title:'The Warden Falls', where:'When the Wreck Warden falls and Joel joins',
      clips:['cin05-joel-rescue-b.mp4', 'cin05-joel-rescue-c.mp4', 'cin05-joel-rescue-d.mp4'],
      passed:function(){ return !!(game.foundCompanions && game.foundCompanions.joel); } }
    ,{ id:'aboard', icon:'⚓', title:'Welcome Aboard', where:'Opens with Chapter 7',
      clips:['cin05-joel-rescue-e.mp4'],
      passed:function(){ return !!(game.comicProgress && game.comicProgress[7]); } }
    ,{ id:'kiss', icon:'🍇', title:'Under the Grapevines', where:'After Chapter 10 is read, before its splash',
      clips:['cin28-ch10-under-the-grapevines.mp4'],
      passed:function(){ return !!(game.comicProgress && game.comicProgress[10]); } }
    ,{ id:'catch', icon:'🌅', title:'Caught at the Shore', where:'After Chapter 11 is read, before its splash',
      clips:['cin29-ch11-the-catch.mp4'],
      passed:function(){ return !!(game.comicProgress && game.comicProgress[11]); } }
    ,{ id:'aisyah', icon:'🗡️', title:'Aisyah — The Debt', where:'Opens with Chapter 12',
      clips:['cin10-aisyah-intro-a.mp4'],
      passed:function(){ return !!(game.comicProgress && game.comicProgress[12]); } }
    ,{ id:'aisyahafter', icon:'🗡️', title:'Aisyah — Standing Together', where:'When the Debt Collector falls and Aisyah joins',
      clips:['cin10-aisyah-intro-b.mp4'],
      passed:function(){ return !!(game.foundCompanions && game.foundCompanions.aisyah); } }
    ,{ id:'eliz', icon:'💚', title:'Eliz — The One Who Stayed', where:'Opens with Chapter 15',
      clips:['cin11-eliz-intro.mp4'],
      passed:function(){ return !!(game.comicProgress && game.comicProgress[15]); } }
    ,{ id:'mezstorm', icon:'⛈️', title:'Mezstorm — The Storm That Was Owed', where:'Opens with Chapter 18',
      clips:['cin12-mezstorm-intro-a.mp4'],
      passed:function(){ return !!(game.comicProgress && game.comicProgress[18]); } }
    ,{ id:'mezstormafter', icon:'⚡', title:'The Storm Idol Falls', where:'When the Storm Idol falls and Mezstorm joins',
      clips:['cin12-mezstorm-intro-b2.mp4', 'cin12-mezstorm-intro-c.mp4'],
      passed:function(){ return !!(game.foundCompanions && game.foundCompanions.mezstorm); } }
    ,{ id:'senedra', icon:'🏹', title:'Senedra — The Watchful Signal', where:'Opens with Chapter 20',
      clips:['cin13-senedra-intro.mp4'],
      passed:function(){ return !!(game.comicProgress && game.comicProgress[20]); } }
    ,{ id:'zaki', icon:'💥', title:'Zaki — The Planner', where:'Opens with Chapter 21',
      clips:['cin14-zaki-intro.mp4'],
      passed:function(){ return !!(game.comicProgress && game.comicProgress[21]); } }
    ,{ id:'twins', icon:'👥', title:'The Two Who Remembered', where:'Opens with Chapter 23',
      clips:['cin15-senedra-zaki-intro.mp4'],
      passed:function(){ return !!(game.comicProgress && game.comicProgress[23]); } }
    ,{ id:'passage', icon:'🌊', title:'The Drowned Passage', where:'Opens with Chapter 24',
      clips:['cin16-drowned-passage-intro-v2.mp4'],
      passed:function(){ return !!(game.comicProgress && game.comicProgress[24]); } }
    ,{ id:'kota_batu', icon:'🏯', title:'Arrival at Kota Batu', where:'The first time you sail into Kota Batu', port:'kota_batu',
      clips:['cin17-kota-batu-first-arrival.mp4'],
      passed:function(){ return !!(typeof isPortUnlocked === 'function' && isPortUnlocked('fair_tide')); } }
    ,{ id:'fair_tide', icon:'🌅', title:'Arrival at Fair Tide', where:'The first time you sail into Fair Tide', port:'fair_tide',
      clips:['cin18-fair-tide-first-arrival.mp4'],
      passed:function(){ return !!((game.comicProgress4 && Object.keys(game.comicProgress4).length) || (game.fairTideBuildings && Object.keys(game.fairTideBuildings).length)); } }
    ,{ id:'mimi', icon:'🔮', title:'Mimi — The Diviner\'s Path', where:'When Arc IV Chapter 10 is marked read',
      clips:['cin19-mimi-intro.mp4'],
      passed:function(){ return !!(game.comicProgress4 && game.comicProgress4[10]); } }
    ,{ id:'arc3ch02', icon:'💬', title:'What Are We?', where:'When Arc III Chapter 2 is read',
      clips:['cin91-arc3-ch02-what-are-we.mp4'],
      passed:function(){ return !!(game.comicProgress3 && game.comicProgress3[2]); } }
    ,{ id:'arc3ch03', icon:'🌊', title:'Familiar', where:'When Arc III Chapter 3 is read',
      clips:['cin92-arc3-ch03-familiar.mp4'],
      passed:function(){ return !!(game.comicProgress3 && game.comicProgress3[3]); } }
    ,{ id:'arc3ch05', icon:'⚔️', title:'Together in Battle', where:'When Arc III Chapter 5 is read',
      clips:['cin93-arc3-ch05-together-in-battle.mp4'],
      passed:function(){ return !!(game.comicProgress3 && game.comicProgress3[5]); } }
    ,{ id:'arc3ch11', icon:'🌅', title:'You Said I Could', where:'When Arc III Chapter 11 is read',
      clips:['cin94-arc3-ch11-you-said-i-could.mp4'],
      passed:function(){ return !!(game.comicProgress3 && game.comicProgress3[11]); } }
    ,{ id:'arc5bond', icon:'🌀', title:'The Hidden Cove — The Bond Begins', where:'When Arc V Chapter 1 is opened',
      clips:['cin33-arc5-hidden-cove.mp4'],
      passed:function(){ return !!(game.comicProgress5 && game.comicProgress5[1]); } }
    ,{ id:'arc5shield', icon:'🛡️', title:'Shield Wall', where:'When Arc V Chapter 3 is opened',
      clips:['cin34-arc5-shield-wall.mp4'],
      passed:function(){ return !!(game.comicProgress5 && game.comicProgress5[3]); } }
    ,{ id:'arc5mark', icon:'🔆', title:'The Mark', where:'When Arc V Chapter 4 is opened',
      clips:['cin35-arc5-the-mark.mp4'],
      passed:function(){ return !!(game.comicProgress5 && game.comicProgress5[4]); } }
    ,{ id:'arc5aegis', icon:'✨', title:'First Mate\'s Aegis', where:'When Arc V Chapter 5 is opened',
      clips:['cin36-arc5-first-mates-aegis.mp4'],
      passed:function(){ return !!(game.comicProgress5 && game.comicProgress5[5]); } }
    ,{ id:'renn', icon:'🌬️', title:'Renn — The Mage Who Stole the Wind', where:'When Arc V Chapter 6 is marked read',
      clips:['cin20-renn-intro.mp4'],
      passed:function(){ return !!(game.comicProgress5 && game.comicProgress5[6]); } }
    ,{ id:'arc6encounter', icon:'🔭', title:'Senedra Spots Two Sails', where:'When you start the Arc VI Chapter 1 fight',
      clips:['cin25-arc6-senedra-spots-two-sails.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[1]); } }
    ,{ id:'arc6robin', icon:'🕶️', title:'Robin Does Not Fight', where:'After the Arc VI Chapter 1 fight',
      clips:['cin30-arc6-robin-yields.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[1]); } }
    ,{ id:'arc6jeff', icon:'⚔️', title:'The Fall of Jeff', where:'After Robin, in the Arc VI Chapter 1 capture',
      clips:['cin31-arc6-jeff-falls.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[1]); } }
    ,{ id:'arc6renn', icon:'🔧', title:'Renn Cuts the Binding', where:'After Jeff falls, in the Arc VI Chapter 1 capture',
      clips:['cin32-arc6-renn-binding.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[1]); } }
    ,{ id:'arc6service', icon:'🧹', title:'Community Service Begins', where:'After the Arc VI Chapter 1 capture',
      clips:['cin26-arc6-community-service.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[1]); } }
    ,{ id:'arc6didnt1', icon:'🌾', title:'Didn\'t Have Rice?: Joel Finds Jeff', where:'When Arc VI Chapter 3 is read',
      clips:['cin82-arc6-ch03-didnt-have-rice-1b.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[3]); } }
    ,{ id:'arc6didnt2', icon:'🌾', title:'Didn\'t Have Rice?: What He Never Said', where:'When Arc VI Chapter 3 is read',
      clips:['cin83-arc6-ch03-didnt-have-rice-2b.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[3]); } }
    ,{ id:'arc6didnt3', icon:'🌾', title:'Didn\'t Have Rice?: The Crowd\'s Answer', where:'When Arc VI Chapter 3 is read',
      clips:['cin73-arc6-ch03-didnt-have-rice-3b.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[3]); } }
    ,{ id:'arc6joel1', icon:'🕯️', title:'Joel\'s Rest: The Cabin', where:'When Arc VI Chapter 8 is read',
      clips:['cin66-arc6-ch08-joels-rest-1.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[8]); } }
    ,{ id:'arc6joel2', icon:'🕯️', title:'Joel\'s Rest: The Old Warehouse', where:'When Arc VI Chapter 8 is read',
      clips:['cin67-arc6-ch08-joels-rest-2.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[8]); } }
    ,{ id:'arc6joel3', icon:'🕯️', title:'Joel\'s Rest: Beside Him', where:'When Arc VI Chapter 8 is read',
      clips:['cin68-arc6-ch08-joels-rest-3.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[8]); } }
    ,{ id:'arc6joel4', icon:'🕯️', title:'Joel\'s Rest: Rest', where:'When Arc VI Chapter 8 is read',
      clips:['cin69-arc6-ch08-joels-rest-4.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[8]); } }
    ,{ id:'arc17archive', icon:'🏛️', title:'The Archive Between Worlds', where:'When Arc XVII Chapter 4 is opened',
      clips:['cin41-arc17-archive-between-worlds.mp4'],
      passed:function(){ return !!(game.comicProgress17 && game.comicProgress17[4]); } }
    ,{ id:'arc19fountain', icon:'⛲', title:'The Fountain of Youth', where:'When Arc XIX Chapter 12 is opened',
      clips:['cin42-arc19-fountain-of-youth.mp4'],
      passed:function(){ return !!(game.comicProgress19 && game.comicProgress19[12]); } }
    ,{ id:'ftdefence', icon:'🛡️', title:'Ready for Whatever Comes', where:'When Arc XXI Chapter 12 is opened, or the first time you open the Archive after the Warden’s Hall is set up',
      clips:['cin45-fairtide-ready-for-whatever-comes.mp4'],
      passed:function(){ return false; } }
    ,{ id:'arc22ch11', icon:'🔮', title:'The Second Examination', where:'When Arc XXII Chapter 11 is read',
      clips:['cin46-arc22-ch11-the-second-examination.mp4'],
      passed:function(){ return !!(game.comicProgress22 && game.comicProgress22[11]); } }
    ,{ id:'arc22ch12', icon:'👶', title:'Two', where:'When Arc XXII Chapter 12 is read (the splash follows it)',
      clips:['cin47-arc22-ch12-two.mp4'],
      passed:function(){ return !!(game.comicProgress22 && game.comicProgress22[12]); } }
    ,{ id:'arc30ch19', icon:'🌙', title:'N', where:'When Arc XXX Chapter 19 is read',
      clips:['cin48-arc30-ch19-n.mp4'],
      passed:function(){ return !!(game.comicProgress30 && game.comicProgress30[19]); } }
    ,{ id:'arc30ch21', icon:'📜', title:'Not Sairen', where:'When Arc XXX Chapter 21 is read',
      clips:['cin49-arc30-ch21-not-sairen.mp4'],
      passed:function(){ return !!(game.comicProgress30 && game.comicProgress30[21]); } }
    ,{ id:'arc30ch23', icon:'🚪', title:'The Door Closes', where:'When Arc XXX Chapter 23 is read (the splash follows it)',
      clips:['cin50-arc30-ch23-the-door-closes.mp4'],
      passed:function(){ return !!(game.comicProgress30 && game.comicProgress30[23]); } }
    ,{ id:'arc34ch24', icon:'💞', title:'Two Hearts', where:'When Arc XXXIV Chapter 24 is read',
      clips:['cin51-arc34-ch24-two-hearts.mp4'],
      passed:function(){ return !!(game.comicProgress34 && game.comicProgress34[24]); } }
    ,{ id:'arc38ch21', icon:'🌅', title:'A Different Kind of Home', where:'When Arc XXXVIII Chapter 21 is read',
      clips:['cin52-arc38-ch21-a-different-kind-of-home.mp4'],
      passed:function(){ return !!(game.comicProgress38 && game.comicProgress38[21]); } }
    ,{ id:'arc32ch24', icon:'🌊', title:'The Long Tide', where:'When Arc XXXII Chapter 24 is read',
      clips:['cin87-arc32-ch24-the-long-tide.mp4'],
      passed:function(){ return !!(game.comicProgress32 && game.comicProgress32[24]); } }
    ,{ id:'arc38ch21b', icon:'🛋️', title:'A Different Kind of Home: Together', where:'When Arc XXXVIII Chapter 21 is read (the second clip)',
      clips:['cin88-arc38-ch21-a-different-kind-of-home-2.mp4'],
      passed:function(){ return !!(game.comicProgress38 && game.comicProgress38[21]); } }
    ,{ id:'arc20int01', icon:'🍻', title:'Interlude: A Night Off', where:'When Arc XX Interlude Chapter 1 is read',
      clips:['cin117-arc20-interlude-01-a-night-off.mp4'],
      passed:function(){ return !!(game.comicProgress20Interlude && game.comicProgress20Interlude[1]); } }
    ,{ id:'arc20int02', icon:'🐈', title:'Interlude: Soel the Constant', where:'When Arc XX Interlude Chapter 2 is read (extra scene, not in the comic)',
      clips:['cin118-arc20-interlude-02-soel-the-constant.mp4'],
      passed:function(){ return !!(game.comicProgress20Interlude && game.comicProgress20Interlude[2]); } }
    ,{ id:'arc20int03', icon:'☕', title:'Interlude: Morning After the Drinks', where:'When Arc XX Interlude Chapter 3 is read',
      clips:['cin119-arc20-interlude-03-morning-after-the-drinks.mp4'],
      passed:function(){ return !!(game.comicProgress20Interlude && game.comicProgress20Interlude[3]); } }
    ,{ id:'helmsmanintro', icon:'⚓', title:'A New Hand at the Wheel', where:'For a helmsman: after the Chapter 1 clip',
      clips:['cin120-helmsman-intro.mp4'], hideUnless:function(){ return !!(typeof window.helmsmanActive === 'function' && window.helmsmanActive()); },
      passed:function(){ return !!(typeof window.helmsmanActive === 'function' && window.helmsmanActive()); } }
    ,{ id:'arc20int04', icon:'🐈', title:'Interlude: Soel and Everyone Else (Part 1)', where:'When Arc XX Interlude Chapter 4 is read',
      clips:['cin121-arc20-interlude-04-soel-and-everyone-else-1.mp4'],
      passed:function(){ return !!(game.comicProgress20Interlude && game.comicProgress20Interlude[4]); } }
    ,{ id:'arc20int05', icon:'🐈', title:'Interlude: Soel and Everyone Else (Part 2)', where:'When Arc XX Interlude Chapter 5 is read',
      clips:['cin122-arc20-interlude-05-soel-and-everyone-else-2a.mp4', 'cin122-arc20-interlude-05-soel-and-everyone-else-2b.mp4'],
      passed:function(){ return !!(game.comicProgress20Interlude && game.comicProgress20Interlude[5]); } }
    ,{ id:'arc20int06', icon:'👨‍👩‍👦', title:'Interlude: The Youngest Brother', where:'When Arc XX Interlude Chapter 6 is read',
      clips:['cin123-arc20-interlude-06-the-youngest-brother.mp4'],
      passed:function(){ return !!(game.comicProgress20Interlude && game.comicProgress20Interlude[6]); } }
    ,{ id:'arc20int07', icon:'📖', title:'Interlude: Check In with Renn', where:'When Arc XX Interlude Chapter 7 is read',
      clips:['cin124-arc20-interlude-07-check-in-with-renn.mp4'],
      passed:function(){ return !!(game.comicProgress20Interlude && game.comicProgress20Interlude[7]); } }
    ,{ id:'mem08', icon:'🕯️', title:'Memory Archive: Different Battles', where:'When Memory Archive Chapter 8 is read',
      clips:['cin125-memory-archive-08-different-battles.mp4'],
      passed:function(){ return !!(game.comicProgressMemoryArchive && game.comicProgressMemoryArchive[8]); } }
    ,{ id:'mem09', icon:'🕯️', title:'Memory Archive: Memory Trigger', where:'When Memory Archive Chapter 9 is read',
      clips:['cin126-memory-archive-09-memory-trigger.mp4'],
      passed:function(){ return !!(game.comicProgressMemoryArchive && game.comicProgressMemoryArchive[9]); } }
    ,{ id:'mem10', icon:'🕯️', title:'Memory Archive: Memory Trigger (II)', where:'When Memory Archive Chapter 10 is read',
      clips:['cin127-memory-archive-10-memory-trigger.mp4'],
      passed:function(){ return !!(game.comicProgressMemoryArchive && game.comicProgressMemoryArchive[10]); } }
    ,{ id:'mem11', icon:'🕯️', title:'Memory Archive: Memory Fragment: Family', where:'When Memory Archive Chapter 11 is read',
      clips:['cin128-memory-archive-11-memory-fragment-family.mp4'],
      passed:function(){ return !!(game.comicProgressMemoryArchive && game.comicProgressMemoryArchive[11]); } }
    ,{ id:'mem12', icon:'🕯️', title:'Memory Archive: Familial Bonds', where:'When Memory Archive Chapter 12 is read',
      clips:['cin129-memory-archive-12-familial-bonds.mp4'],
      passed:function(){ return !!(game.comicProgressMemoryArchive && game.comicProgressMemoryArchive[12]); } }
    ,{ id:'arc41int01', icon:'🐇', title:'Interlude: Kaya Kaya', where:'When Arc XLI Interlude Chapter 1 is read',
      clips:['cin130-arc41-interlude-01-kaya-kaya.mp4'],
      passed:function(){ return !!(game.comicProgress41Interlude && game.comicProgress41Interlude[1]); } }
    ,{ id:'arc41int02', icon:'🐇', title:'Interlude: The Things We Remember', where:'When Arc XLI Interlude Chapter 2 is read',
      clips:['cin131-arc41-interlude-02-the-things-we-remember.mp4'],
      passed:function(){ return !!(game.comicProgress41Interlude && game.comicProgress41Interlude[2]); } }
    ,{ id:'arc41int04', icon:'💐', title:'Interlude: A Different Kind of Knowing', where:'When Arc XLI Interlude Chapter 4 is read',
      clips:['cin132-arc41-interlude-04-a-different-kind-of-knowing-a.mp4', 'cin133-arc41-interlude-04-a-different-kind-of-knowing-b.mp4'],
      passed:function(){ return !!(game.comicProgress41Interlude && game.comicProgress41Interlude[4]); } }
    ,{ id:'arc41int11', icon:'📚', title:'Interlude: An Interesting Distraction', where:'When Arc XLI Interlude Chapter 11 is read',
      clips:['cin134-arc41-interlude-11-an-interesting-distraction.mp4'],
      passed:function(){ return !!(game.comicProgress41Interlude && game.comicProgress41Interlude[11]); } }
    ,{ id:'arc41int12', icon:'📜', title:'Interlude: Two Scholars and a Question', where:'When Arc XLI Interlude Chapter 12 is read',
      clips:['cin135-arc41-interlude-12-two-scholars-and-a-question.mp4'],
      passed:function(){ return !!(game.comicProgress41Interlude && game.comicProgress41Interlude[12]); } }
    ,{ id:'arc41int13', icon:'💋', title:'Just One?', where:'When Arc XLI Interlude Chapter 13 is read',
      clips:['cin89-arc41-interlude-13-just-one.mp4'],
      passed:function(){ return !!(game.comicProgress41Interlude && game.comicProgress41Interlude[13]); } }
    ,{ id:'arc40ch13', icon:'💗', title:'Thought Resonance', where:'When Arc XL Chapter 13 is read (the unlock splash follows it)',
      clips:['cin53-arc40-ch13-thought-resonance.mp4'],
      passed:function(){ return !!(game.comicProgress40 && game.comicProgress40[13]); } }
    ,{ id:'arc36ch10', icon:'🌀', title:'Three-Way Resonance', where:'When Arc XXXVI Chapter 10 is read',
      clips:['cin54-arc36-ch10-three-way-resonance.mp4'],
      passed:function(){ return !!(game.comicProgress36 && game.comicProgress36[10]); } }
    ,{ id:'arc37ch16', icon:'👫', title:'Two Against Two', where:'When Arc XXXVII Chapter 16 is read',
      clips:['cin55-arc37-ch16-two-against-two.mp4'],
      passed:function(){ return !!(game.comicProgress37 && game.comicProgress37[16]); } }
    ,{ id:'arc41ch03', icon:'🎭', title:'A Very Convenient Emergency', where:'When Arc XLI Chapter 3 is read',
      clips:['cin56-arc41-ch03-a-very-convenient-emergency.mp4'],
      passed:function(){ return !!(game.comicProgress41 && game.comicProgress41[3]); } }
    ,{ id:'arc41ch05a', icon:'🚶', title:'Just Visiting', where:'When Arc XLI Chapter 5 is read',
      clips:['cin57-arc41-ch05-just-visiting-1.mp4'],
      passed:function(){ return !!(game.comicProgress41 && game.comicProgress41[5]); } }
    ,{ id:'arc41ch16', icon:'🐾', title:'The Ones Who Stay', where:'When Arc XLI Chapter 16 is read (the splash follows it)',
      clips:['cin98-arc41-ch16-the-ones-who-stay.mp4'],
      passed:function(){ return !!(game.comicProgress41 && game.comicProgress41[16]); } }
    ,{ id:'arc41ch05b', icon:'🍲', title:'Just Visiting: Supper', where:'When Arc XLI Chapter 5 is read',
      clips:['cin58-arc41-ch05-just-visiting-2.mp4'],
      passed:function(){ return !!(game.comicProgress41 && game.comicProgress41[5]); } }
    ,{ id:'arc42ch01', icon:'🛳️', title:'A Strange New Shore', where:'When Arc XLII Chapter 1 is read',
      clips:['cin59-arc42-ch01-a-strange-new-shore.mp4'],
      passed:function(){ return !!(game.comicProgress42 && game.comicProgress42[1]); } }
    ,{ id:'arc42ch02', icon:'🏮', title:'Another Visitor?', where:'When Arc XLII Chapter 2 is read',
      clips:['cin60-arc42-ch02-another-visitor.mp4'],
      passed:function(){ return !!(game.comicProgress42 && game.comicProgress42[2]); } }
    ,{ id:'arc42ch02b', icon:'🏮', title:'Another Visitor?: The Balcony', where:'When Arc XLII Chapter 2 is read (the second clip)',
      clips:['cin95-arc42-ch02-another-visitor-2.mp4'],
      passed:function(){ return !!(game.comicProgress42 && game.comicProgress42[2]); } }
    ,{ id:'arc42ch08', icon:'🧭', title:'A Little Adventure', where:'After the Arc XLII Chapter 8 fight is won',
      clips:['cin96-arc42-ch08-a-little-adventure.mp4'],
      passed:function(){ return !!(game.comicProgress42 && game.comicProgress42[8]); } }
    ,{ id:'arc9ch01', icon:'🐈', title:'Soel: The Blessing Cat', where:'When Arc IX Chapter 1 is read',
      clips:['cin103-arc9-ch01-the-blessing-cat.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[1]); } }
    ,{ id:'arc9ch05', icon:'🐈', title:'Soel: The Tower Cat', where:'When Arc IX Chapter 5 is read',
      clips:['cin104-arc9-ch05-the-tower-cat.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[5]); } }
    ,{ id:'arc9ch09', icon:'🐈', title:'Soel: The First Blessing', where:'When Arc IX Chapter 9 is read',
      clips:['cin105-arc9-ch09-the-first-blessing.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[9]); } }
    ,{ id:'arc9ch14', icon:'🐈', title:'Soel: A Mother\'s Shadow', where:'When Arc IX Chapter 14 is read',
      clips:['cin106-arc9-ch14-a-mothers-shadow.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[14]); } }
    ,{ id:'arc9ch15', icon:'🐈', title:'Soel: The First Home', where:'When Arc IX Chapter 15 is read',
      clips:['cin107-arc9-ch15-the-first-home.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[15]); } }
    ,{ id:'arc9ch16', icon:'🐈', title:'Soel: The Spirit in the Rain', where:'When Arc IX Chapter 16 is read',
      clips:['cin108-arc9-ch16-the-spirit-in-the-rain.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[16]); } }
    ,{ id:'arc9ch17', icon:'🐈', title:'Soel: The Cat and the Door', where:'When Arc IX Chapter 17 is read',
      clips:['cin109-arc9-ch17-the-cat-and-the-door.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[17]); } }
    ,{ id:'arc9ch20', icon:'🐈', title:'Soel: The Place Beyond the Tide', where:'When Arc IX Chapter 20 is read',
      clips:['cin110-arc9-ch20-the-place-beyond-the-tide.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[20]); } }
    ,{ id:'arc9ch21a', icon:'🐈', title:'Soel: Stay (Farewell)', where:'When Arc IX Chapter 21 is read',
      clips:['cin111-arc9-ch21-stay-farewell.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[21]); } }
    ,{ id:'arc9ch21b', icon:'🐈', title:'Soel: Stay (Homecoming)', where:'When Arc IX Chapter 21 is read (the second clip)',
      clips:['cin112-arc9-ch21-stay-homecoming.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[21]); } }
    ,{ id:'arc9ch24', icon:'🐈', title:'Soel: The Name San Gave Him', where:'When Arc IX Chapter 24 is read',
      clips:['cin113-arc9-ch24-the-name-san-gave-him.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[24]); } }
    ,{ id:'arc9ch25', icon:'🐈', title:'Soel: The Cat Who Travels', where:'When Arc IX Chapter 25 is read',
      clips:['cin114-arc9-ch25-the-cat-who-travels.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[25]); } }
    ,{ id:'arc9ch26a', icon:'🐈', title:'Soel: Beside Us All Along', where:'When Arc IX Chapter 26 is read',
      clips:['cin115-arc9-ch26-beside-us-all-along.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[26]); } }
    ,{ id:'arc9ch26b', icon:'🐈', title:'Soel: Nala at the Watchtower', where:'When Arc IX Chapter 26 is read (the second clip)',
      clips:['cin116-arc9-ch26-nala-at-the-watchtower.mp4'],
      passed:function(){ return !!(game.comicProgress9 && game.comicProgress9[26]); } }
    ,{ id:'arc42ch33', icon:'🍵', title:'The Healer\'s Curiosity', where:'When Arc XLII Chapter 33 is read',
      clips:['cin99-arc42-ch33-the-healers-curiosity.mp4'],
      passed:function(){ return !!(game.comicProgress42 && game.comicProgress42[33]); } }
    ,{ id:'arc42ch35', icon:'📚', title:'Knowledge Worth Sharing', where:'When Arc XLII Chapter 35 is read',
      clips:['cin100-arc42-ch35-knowledge-worth-sharing.mp4'],
      passed:function(){ return !!(game.comicProgress42 && game.comicProgress42[35]); } }
    ,{ id:'arc42ch39', icon:'🛠️', title:'A Workshop Without Borders', where:'When Arc XLII Chapter 39 is read',
      clips:['cin101-arc42-ch39-a-workshop-without-borders.mp4'],
      passed:function(){ return !!(game.comicProgress42 && game.comicProgress42[39]); } }
    ,{ id:'arc42ch43', icon:'🤝', title:'Two Worlds, One Understanding', where:'When Arc XLII Chapter 43 is read',
      clips:['cin102-arc42-ch43-two-worlds-one-understanding.mp4'],
      passed:function(){ return !!(game.comicProgress42 && game.comicProgress42[43]); } }
    ,{ id:'arc42ch14', icon:'👨‍👩‍👧‍👦', title:'The Captain’s Family', where:'When Arc XLII Chapter 14 is read',
      clips:['cin61-arc42-ch14-the-captains-family.mp4'],
      passed:function(){ return !!(game.comicProgress42 && game.comicProgress42[14]); } }
    ,{ id:'arc42ch15', icon:'♨️', title:'A Rather Nice Spring', where:'When Arc XLII Chapter 15 is read',
      clips:['cin62-arc42-ch15-a-rather-nice-spring.mp4'],
      passed:function(){ return !!(game.comicProgress42 && game.comicProgress42[15]); } }
    ,{ id:'arc20ch09', icon:'⚔️', title:'Ate Joy: Wooden Swords', where:'When Arc XX Chapter 9 is read',
      clips:['cin70-arc20-ch09-ate-joy.mp4'],
      passed:function(){ return !!(game.comicProgress20 && game.comicProgress20[9]); } }
    ,{ id:'arc20ch17a', icon:'😅', title:'The Brother Thing: The Market', where:'When Arc XX Chapter 17 is read',
      clips:['cin71-arc20-ch17-the-brother-thing-1.mp4'],
      passed:function(){ return !!(game.comicProgress20 && game.comicProgress20[17]); } }
    ,{ id:'arc20ch17b', icon:'😅', title:'The Brother Thing: Joel Panics', where:'When Arc XX Chapter 17 is read',
      clips:['cin72-arc20-ch17-the-brother-thing-2.mp4'],
      passed:function(){ return !!(game.comicProgress20 && game.comicProgress20[17]); } }
    ,{ id:'arc20ch20', icon:'💞', title:'Forever and Ever', where:'When Arc XX Chapter 20 is opened',
      clips:['cin27-arc20-forever-and-ever.mp4'],
      passed:function(){ return !!(game.comicProgress20 && game.comicProgress20[20]); } }
    ,{ id:'arc12ch01', icon:'🔭', title:'Beyond the Horizon', where:'When Arc XII Chapter 1 is read',
      clips:['cin81-arc12-ch01-beyond-the-horizon.mp4'],
      passed:function(){ return !!(game.comicProgress12 && game.comicProgress12[1]); } }
    ,{ id:'arc12ch04', icon:'🌀', title:'The Door Opens', where:'When Arc XII Chapter 4 is read',
      clips:['cin74-arc12-ch04-the-door-opens.mp4'],
      passed:function(){ return !!(game.comicProgress12 && game.comicProgress12[4]); } }
    ,{ id:'arc12ch05', icon:'👣', title:'One Step', where:'When Arc XII Chapter 5 is read',
      clips:['cin75-arc12-ch05-one-step.mp4'],
      passed:function(){ return !!(game.comicProgress12 && game.comicProgress12[5]); } }
    ,{ id:'arc12ch06', icon:'🧭', title:'A Different Sea', where:'When Arc XII Chapter 6 is read',
      clips:['cin76-arc12-ch06-a-different-sea.mp4'],
      passed:function(){ return !!(game.comicProgress12 && game.comicProgress12[6]); } }
    ,{ id:'arc12ch07', icon:'🏘️', title:'The Empty Settlement', where:'When Arc XII Chapter 7 is read',
      clips:['cin77-arc12-ch07-the-empty-settlement.mp4'],
      passed:function(){ return !!(game.comicProgress12 && game.comicProgress12[7]); } }
    ,{ id:'arc12ch08', icon:'🧸', title:'Someone Lived Here', where:'When Arc XII Chapter 8 is read',
      clips:['cin78-arc12-ch08-someone-lived-here.mp4'],
      passed:function(){ return !!(game.comicProgress12 && game.comicProgress12[8]); } }
    ,{ id:'arc12ch16', icon:'🏛️', title:'The Thing Beneath the Harbour', where:'When Arc XII Chapter 16 is read',
      clips:['cin79-arc12-ch16-the-thing-beneath-the-harbour.mp4'],
      passed:function(){ return !!(game.comicProgress12 && game.comicProgress12[16]); } }
    ,{ id:'arc12ch17', icon:'🧭', title:'Return Coordinates', where:'When Arc XII Chapter 17 is read',
      clips:['cin80-arc12-ch17-return-coordinates.mp4'],
      passed:function(){ return !!(game.comicProgress12 && game.comicProgress12[17]); } }
    ,{ id:'arc12ch19', icon:'🗿', title:'The Harbour Marker', where:'When Arc XII Chapter 19 is read',
      clips:['cin84-arc12-ch19-the-harbour-marker.mp4'],
      passed:function(){ return !!(game.comicProgress12 && game.comicProgress12[19]); } }
    ,{ id:'arc12ch20', icon:'🧮', title:'The Path Back', where:'When Arc XII Chapter 20 is read',
      clips:['cin85-arc12-ch20-the-path-back.mp4'],
      passed:function(){ return !!(game.comicProgress12 && game.comicProgress12[20]); } }
    ,{ id:'arc12ch21', icon:'🚪', title:'One World to Another', where:'When Arc XII Chapter 21 is read',
      clips:['cin86-arc12-ch21-one-world-to-another.mp4'],
      passed:function(){ return !!(game.comicProgress12 && game.comicProgress12[21]); } }
    ,{ id:'arc12harbour', icon:'🌉', title:'The First Crossing Harbour', where:'When Arc XII Chapter 7 is opened, or the first time you open the expedition screen',
      clips:['cin39-arc12-first-crossing-harbour.mp4'],
      passed:function(){ return !!(game.comicProgress12 && game.comicProgress12[7]); } }
    ,{ id:'arc13harbour', icon:'⚓', title:'The Unknown Harbour', where:'The first time you arrive at the Unknown Harbour',
      clips:['cin40-arc13-unknown-harbour.mp4'],
      passed:function(){ return false; } }
    ,{ id:'fthome', icon:'🏘️', title:'A Home Worth Building', where:'The first time you open the Fair Tide Hub',
      clips:['cin43-fairtide-a-home-worth-building.mp4'],
      passed:function(){ return false; } }
    ,{ id:'ftresearch', icon:'🔬', title:'Knowledge Becomes Power', where:'The first time you open the Research Team tab at Fair Tide',
      clips:['cin44-fairtide-knowledge-becomes-power.mp4'],
      passed:function(){ return false; } }
    ,{ id:'arc14harbour', icon:'🌊', title:'The Underwater Harbour', where:'The first time you arrive at the Tide Settlement',
      clips:['cin37-arc14-underwater-harbour.mp4'],
      passed:function(){ return false; } }
    ,{ id:'arc15harbour', icon:'🌲', title:'The Shapeshifters\' Harbour', where:'When Arc XV Chapter 1 is opened',
      clips:['cin38-arc15-shapeshifters-harbour.mp4'],
      passed:function(){ return !!(game.comicProgress15 && game.comicProgress15[1]); } }
    ,{ id:'erynn', icon:'📖', title:'Erynn Farseer — The Man Who Knows the Door', where:'When Arc VII Chapter 3 is marked read',
      clips:['cin21-erynn-intro.mp4'],
      passed:function(){ return !!(game.comicProgress7 && game.comicProgress7[3]); } }
    ,{ id:'twinsbirth', icon:'👶', title:'The Twins Are Born', where:'When Arc XXXV Chapter 10 is marked read',
      clips:['cin22-twins-birth.mp4'],
      passed:function(){ return !!(game.comicProgress35 && game.comicProgress35[10]); } }
    ,{ id:'sparks', icon:'✨', title:'The Twins\' First Sparks', where:'When Arc XXXV is complete',
      clips:['cin23-twins-first-sparks.mp4'],
      passed:function(){ return !!game.arc35Complete; } }
    ,{ id:'arc42ch16', icon:'🍷', title:'Familiar Faces, New Friends', where:'When Arc XLII Chapter 16 is read',
      clips:['cin90-arc42-ch16-familiar-faces.mp4'],
      passed:function(){ return !!(game.comicProgress42 && game.comicProgress42[16]); } }
    ,{ id:'chtitle', icon:'🌅', title:'Crimson Horizon', where:'When the sequel is announced',
      clips:['cin97-crimson-horizon-title.mp4'],
      passed:function(){ return !!game.crimsonHorizonSplashSeen; } }
    ,{ id:'joycaelan', icon:'💞', title:'Joy & Caelan — A Little More Willing', where:'When Arc XXV is complete',
      clips:['cin24-joy-caelan-milestone.mp4'],
      passed:function(){ return !!game.arc25Complete; } }
  ];
  // story order, for the Comic Archive list
  (function(){ const o=['teaser','helmsmanintro','storm','malacca','joel','rescue','rescueafter','aboard','palembang','kiss','catch','aisyah','aisyahafter','batavia','eliz','bangkok','mezstorm','mezstormafter','hanoi','senedra','manila','zaki','twins','passage','kota_batu','fair_tide','fthome','mimi','arc3ch02','arc3ch03','arc3ch05','arc3ch11','mem08','mem09','mem10','mem11','mem12','arc5bond','arc5shield','arc5mark','arc5aegis','renn','arc6encounter','arc6robin','arc6jeff','arc6renn','arc6service','arc6didnt1','arc6didnt2','arc6didnt3','arc6joel1','arc6joel2','arc6joel3','arc6joel4','erynn','arc9ch01','arc9ch05','arc9ch09','arc9ch14','arc9ch15','arc9ch16','arc9ch17','arc9ch20','arc9ch21a','arc9ch21b','arc9ch24','arc9ch25','arc9ch26a','arc9ch26b','arc12ch01','arc12ch04','arc12ch05','arc12ch06','arc12ch07','arc12ch08','arc12harbour','arc12ch16','arc12ch17','arc12ch19','arc12ch20','arc12ch21','arc13harbour','arc14harbour','arc15harbour','ftresearch','arc17archive','arc19fountain','arc20ch09','arc20ch17a','arc20ch17b','arc20ch20','arc20int01','arc20int02','arc20int03','arc20int04','arc20int05','arc20int06','arc20int07','ftdefence','arc22ch11','arc22ch12','arc30ch19','arc30ch21','arc30ch23','arc32ch24','arc34ch24','arc36ch10','arc37ch16','arc38ch21','arc38ch21b','arc40ch13','arc41ch03','arc41ch05a','arc41ch05b','arc41ch16','arc41int01','arc41int02','arc41int04','arc41int11','arc41int12','arc41int13','arc42ch01','arc42ch02','arc42ch02b','arc42ch08','arc42ch14','arc42ch15','arc42ch16','arc42ch33','arc42ch35','arc42ch39','arc42ch43','chtitle','joycaelan','twinsbirth','sparks']; CINEMATICS.sort(function(a,b){ return o.indexOf(a.id)-o.indexOf(b.id); }); })();
  const BY_ID = {}; CINEMATICS.forEach(function(c){ BY_ID[c.id] = c; });
  window.CT_CINEMATICS = CINEMATICS;

  // ---- state ----
  function st(){ if (!game.cinematics || typeof game.cinematics !== 'object') game.cinematics = { seen: {} }; if (!game.cinematics.seen) game.cinematics.seen = {}; return game.cinematics; }
  function isSeen(id){
    try {
      const s = (game.cinematics && game.cinematics.seen) || {};
      if (s[id] !== undefined) return !!s[id];
      if (game.cinematics && game.cinematics.v === 1) return false;     // a voyage begun with cinematics: only what it has actually watched
      const c = BY_ID[id]; return !!(c && c.passed());                  // an older save: seen once the story has moved past it
    } catch(e) { return false; }
  }
  function markSeen(id){ st().seen[id] = true; if (typeof saveGameQuiet === 'function') saveGameQuiet(); }
  function autoOn(){ try { return localStorage.getItem('ct_cinematics_auto') !== '0'; } catch(e) { return true; } }
  function setAuto(on){ try { localStorage.setItem('ct_cinematics_auto', on ? '1' : '0'); } catch(e) {} }
  window.cinematicsAuto = autoOn;
  window.setCinematicsAuto = function(on){ setAuto(!!on); refreshPanel(); };

  // ---- the player ----
  let busy = false;
  function ensureStyle(){
    if (document.getElementById('ctCinemaStyle')) return;
    const s = document.createElement('style'); s.id = 'ctCinemaStyle';
    s.textContent =
      '#ctCinema{position:fixed;inset:0;z-index:9000;background:#000;display:flex;align-items:center;justify-content:center;}' +
      '#ctCinema video{width:100%;height:100%;object-fit:contain;background:#000;}' +
      '#ctCinema .cc-top{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 12px;background:linear-gradient(rgba(0,0,0,.7),transparent);pointer-events:none;}' +
      '#ctCinema .cc-title{font-family:Cinzel,Georgia,serif;color:#e8c96a;font-size:.85rem;text-shadow:0 1px 3px #000;}' +
      '#ctCinema button{pointer-events:auto;}' +
      '#ctCinema .cc-btn{background:rgba(10,20,30,.78);color:#e8c96a;border:1px solid rgba(232,197,71,.6);border-radius:8px;padding:8px 12px;font-size:.85rem;cursor:pointer;}' +
      '#ctCinema .cc-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:1.05rem;padding:14px 20px;}' +
      '#ctCinema .cc-sound{position:absolute;left:12px;bottom:14px;}';
    document.head.appendChild(s);
  }
  function exists(url){
    return new Promise(function(resolve){
      let done = false; const finish = function(v){ if (!done) { done = true; resolve(v); } };
      const t = setTimeout(function(){ finish(false); }, 3500);
      try { fetch(url, { method:'HEAD', cache:'no-store' }).then(function(r){ clearTimeout(t); finish(r.ok); }).catch(function(){ clearTimeout(t); finish(false); }); }
      catch(e) { clearTimeout(t); finish(false); }
    });
  }

  // Plays a cinematic. Resolves { played } once it has ended or been skipped. opts.replay: do not touch "seen".
  window.playCinematic = function(id, opts){
    opts = opts || {};
    const def = BY_ID[id];
    if (!def || busy) return Promise.resolve({ played:false });
    busy = true;
    const urls = def.clips.map(function(c){ return (def.base || BASE) + c; });
    return Promise.all(urls.map(exists)).then(function(ok){
      const list = urls.filter(function(u, i){ return ok[i]; });
      if (!list.length) { busy = false; return { played:false, missing:true }; }
      return new Promise(function(resolve){
        ensureStyle();
        const wrap = document.createElement('div'); wrap.id = 'ctCinema'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-label', def.title);
        wrap.innerHTML = '<video playsinline webkit-playsinline preload="auto"></video>' +
          '<div class="cc-top"><span class="cc-title">' + def.icon + ' ' + esc(def.title) + '</span><button class="cc-btn cc-skip" type="button">Skip ⏭</button></div>' +
          '<button class="cc-btn cc-center" type="button" style="display:none">▶ Tap to play</button>' +
          '<button class="cc-btn cc-sound" type="button" style="display:none">🔊 Tap for sound</button>';
        document.body.appendChild(wrap);
        const video = wrap.querySelector('video'), skip = wrap.querySelector('.cc-skip'), center = wrap.querySelector('.cc-center'), sound = wrap.querySelector('.cc-sound');
        const prevOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
        // the game music steps aside while the cinematic plays
        let resumeMusic = false;
        try { if (typeof ctAudio !== 'undefined' && ctAudio && !ctAudio.paused) { ctAudio.pause(); resumeMusic = true; } } catch(e) {}
        let idx = -1, finished = false, started = false;
        function finish(skipped){
          if (finished) return; finished = true;
          document.removeEventListener('keydown', onKey);
          try { video.pause(); video.removeAttribute('src'); video.load(); } catch(e) {}
          wrap.remove(); document.body.style.overflow = prevOverflow;
          try { if (resumeMusic && typeof ctMusicEnabled !== 'undefined' && ctMusicEnabled && ctAudio) { const p = ctAudio.play(); if (p && p.catch) p.catch(function(){}); } } catch(e) {}
          if (!opts.replay) { try { markSeen(id); } catch(e) {} }
          busy = false;
          resolve({ played: started, skipped: !!skipped });
        }
        function onKey(e){ if (e.key === 'Escape') finish(true); }
        function tryPlay(){
          const p = video.play();
          if (p && p.catch) p.catch(function(){
            // blocked with sound: play muted and offer the sound
            video.muted = true;
            const p2 = video.play();
            if (p2 && p2.then) p2.then(function(){ sound.style.display = ''; }).catch(function(){ center.style.display = ''; });
          });
        }
        function next(){
          idx++;
          if (idx >= list.length) { finish(false); return; }
          video.src = list[idx];
          video.load();
          const t = def.icon + ' ' + def.title + (list.length > 1 ? '  ·  ' + (idx + 1) + '/' + list.length : '');
          wrap.querySelector('.cc-title').textContent = t;
          tryPlay();
        }
        video.addEventListener('playing', function(){ started = true; center.style.display = 'none'; });
        video.addEventListener('ended', next);
        video.addEventListener('error', next);   // a clip that will not load is skipped
        skip.onclick = function(){ finish(true); };
        center.onclick = function(){ center.style.display = 'none'; video.muted = false; video.play().catch(function(){ video.muted = true; video.play().catch(function(){}); }); };
        sound.onclick = function(){ video.muted = false; sound.style.display = 'none'; };
        document.addEventListener('keydown', onKey);
        next();
      });
    });
  };

  // A brand-new voyage starts with its own empty record.
  const oldStart = window.startGame;
  if (typeof oldStart === 'function') {
    window.startGame = function(){
      game.cinematics = { v: 1, seen: {} };
      return oldStart.apply(this, arguments);
    };
  }

  // ---- triggers ----
  const CHAPTER_CINEMA = { 1:'storm', 5:'joel', 6:'rescue', 7:'aboard', 12:'aisyah', 15:'eliz', 18:'mezstorm', 20:'senedra', 21:'zaki', 23:'twins', 24:'passage' };
  const oldOpen = window.openStoryMode;
  if (typeof oldOpen === 'function') {
    window.openStoryMode = function(chapterId, options){
      options = options || {};
      const id = CHAPTER_CINEMA[chapterId];
      // a helmsman's introduction follows Chapter 1's own clip, in sequence
      const helm = chapterId === 1 && typeof window.helmsmanActive === 'function' && window.helmsmanActive() && !isSeen('helmsmanintro');
      const queue = [];
      if (id && !isSeen(id)) queue.push(id);
      if (helm) queue.push('helmsmanintro');
      if (queue.length && !options.replay && autoOn() && !(game.comicProgress && game.comicProgress[chapterId]) && typeof STORY_MODE_CHAPTERS !== 'undefined' && STORY_MODE_CHAPTERS[chapterId]) {
        if (busy) return true;
        const self = this, args = arguments;
        let chain = Promise.resolve();
        queue.forEach(function(q){ chain = chain.then(function(){ return window.playCinematic(q); }); });
        chain.then(function(){ oldOpen.apply(self, args); });
        return true;
      }
      return oldOpen.apply(this, arguments);
    };
  }
  // the first arrival at a port with its own cinematic
  const PORT_CINEMA = {}; CINEMATICS.forEach(function(c){ if (c.port) PORT_CINEMA[c.port] = c.id; });
  const oldArrive = window.triggerArrivalStory;
  if (typeof oldArrive === 'function') {
    window.triggerArrivalStory = function(portId){
      const id = PORT_CINEMA[portId];
      if (id && autoOn() && !isSeen(id) && !busy) {
        const self = this, args = arguments;
        window.playCinematic(id).then(function(){ oldArrive.apply(self, args); });
        return;
      }
      return oldArrive.apply(this, arguments);
    };
  }

  // ---- Arc V Chapters 1, 3, 4 and 5 (the bond, Shield Wall, the Mark, First Mate's Aegis): clicking "Open Chapter" plays the clip first ----
  (function(){
    const ARC5_CLIPS = { 1:'arc5bond', 3:'arc5shield', 4:'arc5mark', 5:'arc5aegis' };
    const ARC15_CLIPS = { 1:'arc15harbour' };   // Arc XV Chapter 1 arrives at the shapeshifters' harbour
    const OTHER_CLIPS = { '12:7':'arc12harbour', '17:4':'arc17archive', '19:12':'arc19fountain', '21:12':'ftdefence' };   // Arc XII ch7 settlement harbour, Arc XVII ch4 the Archive, Arc XIX ch12 the Fountain
    const old = window.openComicImage;
    if (typeof old !== 'function') return;
    window.openComicImage = function(url){
      const u = String(url || '');
      const m = /comics\/arc5\/ch0([1-9])-/.exec(u), m15 = /comics\/arc15\/ch0([1-9])-/.exec(u), mo = /comics\/arc(12|17|19|21)\/ch(\d+)-/.exec(u);
      const id = (m && ARC5_CLIPS[Number(m[1])]) || (m15 && ARC15_CLIPS[Number(m15[1])]) || (mo && OTHER_CLIPS[mo[1] + ':' + Number(mo[2])]);
      if (id && autoOn() && !isSeen(id) && !busy) {
        const self = this, args = arguments;
        window.playCinematic(id).then(function(){ old.apply(self, args); });
        return;
      }
      return old.apply(this, arguments);
    };
  })();

  // ---- First arrivals: the Tide Settlement (Arc XIV), the Unknown Harbour (Arc XIII) and the expedition screen (Arc XII) play their harbour clips ----
  (function(){
    const old = window.goScreen;
    if (typeof old !== 'function') return;
    window.goScreen = function(name){
      let arrival = { tidenetwork:'arc14harbour', harbour:'arc13harbour', interworld:'arc12harbour', fairtide:'fthome' }[name];
      // the Archive: the Warden's Hall clip, once the hall has been set up
      if (name === 'archive' && typeof window.wardensHallUnlocked === 'function' && window.wardensHallUnlocked()) arrival = 'ftdefence';
      if (arrival && autoOn() && !isSeen(arrival) && !busy) {
        const self = this, args = arguments;
        window.playCinematic(arrival).then(function(){ old.apply(self, args); });
        return;
      }
      return old.apply(this, arguments);
    };
  })();

  // ---- Fair Tide's Research Team tab: the first time it is opened ----
  (function(){
    const old = window.switchFairTideTab;
    if (typeof old !== 'function') return;
    window.switchFairTideTab = function(tab){
      if (tab === 'research' && autoOn() && !isSeen('ftresearch') && !busy) {
        const self = this, args = arguments;
        window.playCinematic('ftresearch').then(function(){ old.apply(self, args); });
        return;
      }
      return old.apply(this, arguments);
    };
  })();

  // ---- Arc VI Chapter 1: Senedra's spyglass clip, then the ships splash, then the fight starts ----
  (function(){
    let starting = false;
    const old = window.startArc6CaptureFight;
    if (typeof old !== 'function') return;
    window.startArc6CaptureFight = function(){
      const self = this, args = arguments;
      if (starting || (window.arc6ObjectiveState && window.arc6ObjectiveState() !== 'complete_arc6_chapter_1')) return old.apply(self, args);
      starting = true;
      Promise.resolve(window.playCinematicOnce('arc6encounter'))
        .then(function(){ return typeof window.playMilestoneSplashOnce === 'function' ? window.playMilestoneSplashOnce('arc6ch1') : null; })
        .catch(function(){})
        .then(function(){ starting = false; old.apply(self, args); });
    };
  })();

  // ---- Arc XX Chapter 20 ("Forever and Ever"): clicking the chapter plays the clip, then the splash, then the chapter opens ----
  (function(){
    let opening = false;
    const old = window.markArc20ChapterRead;
    if (typeof old !== 'function') return;
    window.markArc20ChapterRead = function(id){
      if (opening) return;   // a second tap while the clip plays must not complete the chapter early
      const self = this, args = arguments;
      const ready = Number(id) === 20 && !opening && window.arc20ObjectiveState && window.arc20ObjectiveState() === 'complete_arc20_chapter_20' && !(game.comicProgress20 && game.comicProgress20[20]);
      if (!ready) return old.apply(self, args);
      opening = true;
      Promise.resolve(window.playCinematicOnce('arc20ch20'))
        .then(function(){ return typeof window.playMilestoneSplashOnce === 'function' ? window.playMilestoneSplashOnce('arc20ch20') : null; })
        .catch(function(){})
        .then(function(){ opening = false; old.apply(self, args); });
    };
  })();

  // ---- Arc XXII Chapters 11 and 12 (the second examination, "Two"): the clip plays when the chapter is read; Chapter 12's splash follows it ----
  (function(){
    let opening = false;
    const CLIP = { 11:'arc22ch11', 12:'arc22ch12' };
    const old = window.markArc22ChapterRead;
    if (typeof old !== 'function') return;
    window.markArc22ChapterRead = function(id){
      if (opening) return;   // a second tap while the clip plays must not complete the chapter early
      const self = this, args = arguments, n = Number(id), cid = CLIP[n];
      const ready = cid && !opening && window.arc22ObjectiveState && window.arc22ObjectiveState() === ('complete_arc22_chapter_' + n) && !(game.comicProgress22 && game.comicProgress22[n]);
      if (!ready) return old.apply(self, args);
      opening = true;
      Promise.resolve(window.playCinematicOnce(cid))
        .then(function(){ return (n === 12 && typeof window.playMilestoneSplashOnce === 'function') ? window.playMilestoneSplashOnce('arc22ch12') : null; })
        .catch(function(){})
        .then(function(){ opening = false; old.apply(self, args); });
    };
  })();

  // ---- Arc XXX Chapters 19, 21 and 23 (N, Not Sairen, The Door Closes): the clip plays when the chapter is read; Chapter 23's splash follows it ----
  (function(){
    let opening = false;
    const CLIP = { 19:'arc30ch19', 21:'arc30ch21', 23:'arc30ch23' };
    const old = window.markArc30ChapterRead;
    if (typeof old !== 'function') return;
    window.markArc30ChapterRead = function(id){
      if (opening) return;   // a second tap while the clip plays must not complete the chapter early
      const self = this, args = arguments, n = Number(id), cid = CLIP[n];
      const ready = cid && !opening && window.arc30ObjectiveState && window.arc30ObjectiveState() === ('complete_arc30_chapter_' + n) && !(game.comicProgress30 && game.comicProgress30[n]);
      if (!ready) return old.apply(self, args);
      opening = true;
      Promise.resolve(window.playCinematicOnce(cid))
        .then(function(){ return (n === 23 && typeof window.playMilestoneSplashOnce === 'function') ? window.playMilestoneSplashOnce('arc30ch23') : null; })
        .catch(function(){})
        .then(function(){ opening = false; old.apply(self, args); });
    };
  })();

  // ---- Arc XXXIV Ch.24 (Two Hearts), Arc XXXVIII Ch.21 (A Different Kind of Home), Arc XL Ch.13 (The Shape of the Bond: Thought Resonance unlocks) ----
  // The clip plays when the chapter is read, then the chapter completes as before. Arc XL Ch.13's unlock splash follows its clip.
  (function(){
    let opening = false;
    const HOOKS = [
      { fn:'markArc34ChapterRead', arc:34, ch:24, clip:'arc34ch24' },
      { fn:'markArc40ChapterRead', arc:40, ch:13, clip:'arc40ch13', splash:'thought_resonance' },
      { fn:'markArc42ChapterRead', arc:42, ch:1, clip:'arc42ch01' },
      { fn:'markArc42ChapterRead', arc:42, ch:14, clip:'arc42ch14' },
      { fn:'markArc42ChapterRead', arc:42, ch:15, clip:'arc42ch15' }
    ];
    HOOKS.forEach(function(h){
      const old = window[h.fn];
      if (typeof old !== 'function') return;
      window[h.fn] = function(id){
        if (opening) return;   // a second tap while the clip plays must not complete the chapter early
        const self = this, args = arguments, n = Number(id);
        const stateFn = window['arc' + h.arc + 'ObjectiveState'];
        const ready = n === h.ch && !opening && typeof stateFn === 'function' && stateFn() === ('complete_arc' + h.arc + '_chapter_' + n) && !(game['comicProgress' + h.arc] && game['comicProgress' + h.arc][n]);
        if (!ready) return old.apply(self, args);
        opening = true;
        Promise.resolve(window.playCinematicOnce(h.clip))
          .then(function(){ return (h.splash && typeof window.playMilestoneSplashOnce === 'function') ? window.playMilestoneSplashOnce(h.splash) : null; })
          .catch(function(){})
          .then(function(){ opening = false; old.apply(self, args); });
      };
    });
  })();

  // ---- Arc XX Interlude Chapters 1 to 7: the clip plays when the chapter is read, then the chapter completes ----
  (function(){
    let opening = false;
    const old = window.markArc20InterludeChapterRead;
    if (typeof old !== 'function') return;
    const CLIPS = { 1: 'arc20int01', 2: 'arc20int02', 3: 'arc20int03', 4: 'arc20int04', 5: 'arc20int05', 6: 'arc20int06', 7: 'arc20int07' };
    window.markArc20InterludeChapterRead = function(id){
      if (opening) return;
      const self = this, args = arguments, n = Number(id);
      const stateFn = window.arc20InterludeObjectiveState;
      const ready = !!CLIPS[n] && typeof stateFn === 'function' && stateFn() === ('complete_interlude_chapter_' + n) && !(game.comicProgress20Interlude && game.comicProgress20Interlude[n]);
      if (!ready) return old.apply(self, args);
      opening = true;
      Promise.resolve(window.playCinematicOnce(CLIPS[n])).catch(function(){}).then(function(){ opening = false; old.apply(self, args); });
    };
  })();

  // ---- Memory Archive Chapters 8 to 12: the clip plays when the chapter is read, then the chapter completes ----
  (function(){
    let opening = false;
    const old = window.markMemoryArchiveChapterRead;
    if (typeof old !== 'function') return;
    const CLIPS = { 8: 'mem08', 9: 'mem09', 10: 'mem10', 11: 'mem11', 12: 'mem12' };
    window.markMemoryArchiveChapterRead = function(id){
      if (opening) return;
      const self = this, args = arguments, n = Number(id);
      const stateFn = window.memoryArchiveObjectiveState;
      const ready = !!CLIPS[n] && typeof stateFn === 'function' && stateFn() === ('complete_memoryarchive_chapter_' + n) && !(game.comicProgressMemoryArchive && game.comicProgressMemoryArchive[n]);
      if (!ready) return old.apply(self, args);
      opening = true;
      Promise.resolve(window.playCinematicOnce(CLIPS[n])).catch(function(){}).then(function(){ opening = false; old.apply(self, args); });
    };
  })();

  // ---- Arc XLI Interlude Chapters 1, 2, 4, 11 and 12: the clip plays when the chapter is read, then the chapter completes ----
  (function(){
    let opening = false;
    const old = window.markArc41InterludeChapterRead;
    if (typeof old !== 'function') return;
    const CLIPS = { 1: 'arc41int01', 2: 'arc41int02', 4: 'arc41int04', 11: 'arc41int11', 12: 'arc41int12' };
    window.markArc41InterludeChapterRead = function(id){
      if (opening) return;
      const self = this, args = arguments, n = Number(id);
      const stateFn = window.arc41InterludeObjectiveState;
      const ready = !!CLIPS[n] && typeof stateFn === 'function' && stateFn() === ('complete_interlude41_chapter_' + n) && !(game.comicProgress41Interlude && game.comicProgress41Interlude[n]);
      if (!ready) return old.apply(self, args);
      opening = true;
      Promise.resolve(window.playCinematicOnce(CLIPS[n])).catch(function(){}).then(function(){ opening = false; old.apply(self, args); });
    };
  })();

  // ---- Arc XLI Interlude Chapter 13 (Just One?): the clip plays when the chapter is read, then the chapter completes ----
  (function(){
    let opening = false;
    const old = window.markArc41InterludeChapterRead;
    if (typeof old !== 'function') return;
    window.markArc41InterludeChapterRead = function(id){
      if (opening) return;
      const self = this, args = arguments, n = Number(id);
      const stateFn = window.arc41InterludeObjectiveState;
      const ready = n === 13 && typeof stateFn === 'function' && stateFn() === 'complete_interlude41_chapter_13' && !(game.comicProgress41Interlude && game.comicProgress41Interlude[13]);
      if (!ready) return old.apply(self, args);
      opening = true;
      Promise.resolve(window.playCinematicOnce('arc41int13')).catch(function(){}).then(function(){ opening = false; old.apply(self, args); });
    };
  })();

  // ---- Arc XXXVI Ch.10, Arc XXXVII Ch.16, Arc XLI Ch.3 and Ch.5: the clip(s) play when the chapter is read, with the splashes between, then the chapter completes ----
  (function(){
    let opening = false;
    const STEPS = {
      'markArc12ChapterRead:16': [['clip','arc12ch16']],
      'markArc12ChapterRead:17': [['clip','arc12ch17']],
      'markArc12ChapterRead:19': [['clip','arc12ch19']],
      'markArc12ChapterRead:20': [['clip','arc12ch20']],
      'markArc12ChapterRead:21': [['clip','arc12ch21']],
      'markArc12ChapterRead:1': [['clip','arc12ch01']],
      'markArc12ChapterRead:4': [['clip','arc12ch04']],
      'markArc12ChapterRead:5': [['clip','arc12ch05']],
      'markArc12ChapterRead:6': [['clip','arc12ch06']],
      'markArc12ChapterRead:7': [['clip','arc12ch07']],
      'markArc12ChapterRead:8': [['clip','arc12ch08']],
      'markArc3ChapterRead:2': [['clip','arc3ch02']],
      'markArc3ChapterRead:3': [['clip','arc3ch03']],
      'markArc3ChapterRead:5': [['clip','arc3ch05']],
      'markArc3ChapterRead:11': [['clip','arc3ch11']],
      'markArc32ChapterRead:24': [['clip','arc32ch24']],
      'markArc38ChapterRead:21': [['clip','arc38ch21'], ['clip','arc38ch21b']],
      'markArc9ChapterRead:1': [['clip','arc9ch01']],
      'markArc9ChapterRead:5': [['clip','arc9ch05']],
      'markArc9ChapterRead:9': [['clip','arc9ch09']],
      'markArc9ChapterRead:14': [['clip','arc9ch14']],
      'markArc9ChapterRead:15': [['clip','arc9ch15']],
      'markArc9ChapterRead:16': [['clip','arc9ch16']],
      'markArc9ChapterRead:17': [['clip','arc9ch17']],
      'markArc9ChapterRead:20': [['clip','arc9ch20']],
      'markArc9ChapterRead:21': [['clip','arc9ch21a'], ['clip','arc9ch21b']],
      'markArc9ChapterRead:24': [['clip','arc9ch24']],
      'markArc9ChapterRead:25': [['clip','arc9ch25']],
      'markArc9ChapterRead:26': [['clip','arc9ch26a'], ['clip','arc9ch26b']],
      'markArc42ChapterRead:2': [['clip','arc42ch02'], ['clip','arc42ch02b']],
      'markArc42ChapterRead:8': [['clip','arc42ch08']],
      'markArc42ChapterRead:16': [['clip','arc42ch16']],
      'markArc20ChapterRead:9': [['clip','arc20ch09'], ['splash','arc20ch09a'], ['splash','arc20ch09b']],
      'markArc20ChapterRead:17': [['clip','arc20ch17a'], ['clip','arc20ch17b'], ['splash','arc20ch17']],
      'markArc6ChapterRead:8': [['clip','arc6joel1'], ['clip','arc6joel2'], ['splash','arc6joel2'], ['clip','arc6joel3'], ['clip','arc6joel4'], ['splash','arc6joel4']],
      'markArc6ChapterRead:3': [['clip','arc6didnt1'], ['clip','arc6didnt2'], ['clip','arc6didnt3']],
      'markArc36ChapterRead:10': [['clip','arc36ch10']],
      'markArc37ChapterRead:16': [['clip','arc37ch16']],
      'markArc41ChapterRead:16': [['clip','arc41ch16'], ['splash','arc41ch16']],
      'markArc42ChapterRead:33': [['clip','arc42ch33']],
      'markArc42ChapterRead:35': [['clip','arc42ch35']],
      'markArc42ChapterRead:39': [['clip','arc42ch39']],
      'markArc42ChapterRead:43': [['clip','arc42ch43']],
      'markArc41ChapterRead:3':  [['clip','arc41ch03'], ['splash','arc41ch03']],
      'markArc41ChapterRead:5':  [['clip','arc41ch05a'], ['splash','arc41ch05a'], ['clip','arc41ch05b'], ['splash','arc41ch05b']]
    };
    Object.keys(STEPS).forEach(function(key){
      const fn = key.split(':')[0], ch = Number(key.split(':')[1]), arc = Number(/Arc(\d+)/.exec(fn)[1]);
      const old = window[fn];
      if (typeof old !== 'function') return;
      window[fn] = function(id){
        if (opening) return;   // a second tap while the clip plays must not complete the chapter early
        const self = this, args = arguments, n = Number(id);
        const stateFn = window['arc' + arc + 'ObjectiveState'];
        const ready = n === ch && !opening && typeof stateFn === 'function' && stateFn() === ('complete_arc' + arc + '_chapter_' + n) && !(game['comicProgress' + arc] && game['comicProgress' + arc][n]);
        if (!ready) return old.apply(self, args);
        opening = true;
        let chain = Promise.resolve();
        STEPS[key].forEach(function(st){
          chain = chain.then(function(){
            try { return st[0] === 'clip' ? window.playCinematicOnce(st[1]) : (typeof window.playMilestoneSplashOnce === 'function' ? window.playMilestoneSplashOnce(st[1]) : null); } catch(e) { return null; }
          }).catch(function(){});
        });
        chain.then(function(){ opening = false; old.apply(self, args); });
      };
    });
  })();

  // exported so other scripts can chain a clip after something else (for example a splash screen)
  window.playCinematicOnce = function(id){
    if (!BY_ID[id] || !autoOn() || isSeen(id) || busy) return Promise.resolve({ played:false });
    return window.playCinematic(id);
  };

  // ---- Arcs whose chapters open as a comic page in another tab: the clip plays when the chapter is marked read ----
  [ ['markArc4ChapterRead',  'comicProgress4',  { 10:'mimi' }  ],
    ['markArc5ChapterRead',  'comicProgress5',  { 6:'renn' }   ],
    ['markArc7ChapterRead',  'comicProgress7',  { 3:'erynn' }  ],
    ['markArc25ChapterRead', 'comicProgress25', { 18:'joycaelan' }],
    ['markArc35ChapterRead', 'comicProgress35', { 24:'sparks' }]   // (Chapter 10's clip follows its splash, see milestone-splash.js)
  ].forEach(function(h){
    const old = window[h[0]]; if (typeof old !== 'function') return;
    window[h[0]] = function(id){
      const n = Number(id), was = !!(game[h[1]] && game[h[1]][n]);
      const r = old.apply(this, arguments);
      try { if (!was && game[h[1]] && game[h[1]][n] && h[2][n]) setTimeout(function(){ window.playCinematicOnce(h[2][n]); }, 800); } catch(e) {}
      return r;
    };
  });

  // ---- Comic Archive: replay list and the automatic switch ----
  function panelHtml(){
    const rows = CINEMATICS.filter(function(c){ return !c.hideUnless || c.hideUnless(); }).map(function(c){
      const seen = isSeen(c.id);
      return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid rgba(232,197,71,.15);">' +
        '<span style="flex:1;min-width:0;"><b>' + c.icon + ' ' + esc(c.title) + '</b><br><span style="font-size:.72rem;opacity:.65;">' + esc(c.where) + (seen ? '' : ' · not seen yet') + '</span></span>' +
        (seen ? '<button class="btn btn-small" onclick="replayCinematic(\'' + c.id + '\')">▶ Replay</button>' : '<span style="font-size:.72rem;opacity:.55;">🔒</span>') + '</div>';
    }).join('');
    return '<div id="ctCinemaPanel" class="panel" style="margin:0 0 12px;border-color:rgba(232,197,71,.4);">' +
      '<div class="panel-title">🎬 Cinematics</div>' +
      '<label style="display:flex;align-items:center;gap:8px;font-size:.84rem;margin:4px 0 8px;cursor:pointer;"><input type="checkbox" ' + (autoOn() ? 'checked' : '') + ' onchange="setCinematicsAuto(this.checked)"> Play cinematics automatically</label>' + rows + '</div>';
  }
  // the teaser on the title screen: always a replay, so it never touches the save
  window.watchTeaser = function(){
    window.playCinematic('teaser', { replay:true }).then(function(r){ if (r && r.missing && typeof toast === 'function') toast('🎬 The teaser is not available right now.'); });
  };
  window.replayCinematic = function(id){
    window.playCinematic(id, { replay:true }).then(function(r){ if (r && r.missing && typeof toast === 'function') toast('🎬 This cinematic is not available yet.'); });
  };
  function refreshPanel(){
    const el = document.getElementById('ctCinemaPanel'); if (!el) return;
    el.outerHTML = panelHtml();
  }
  const oldArchive = window.renderComicArchive;
  if (typeof oldArchive === 'function') {
    window.renderComicArchive = function(){
      const r = oldArchive.apply(this, arguments);
      try { const el = document.getElementById('comicArchive'); if (el && !el.querySelector('#ctCinemaPanel')) el.insertAdjacentHTML('afterbegin', panelHtml()); } catch(e) {}
      return r;
    };
  }

  // ---- Settings ----
  const oldSettings = window.showSettings;
  if (typeof oldSettings === 'function') {
    window.showSettings = function(){
      const r = oldSettings.apply(this, arguments);
      try {
        const grid = document.querySelector('#modalText > div');
        if (grid && !grid.querySelector('#ctCinemaSetting')) {
          grid.insertAdjacentHTML('beforeend', '<label id="ctCinemaSetting" style="display:flex;align-items:center;gap:9px;font-size:.85rem;color:var(--parchment);cursor:pointer;"><input type="checkbox" ' + (autoOn() ? 'checked' : '') + ' onchange="setCinematicsAuto(this.checked)"> 🎬 Play cinematics automatically</label>');
        }
      } catch(e) {}
      return r;
    };
  }
})();
