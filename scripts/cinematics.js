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
      clips:['cin16-drowned-passage-intro.mp4'],
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
    ,{ id:'renn', icon:'🌬️', title:'Renn — The Mage Who Stole the Wind', where:'When Arc V Chapter 6 is marked read',
      clips:['cin20-renn-intro.mp4'],
      passed:function(){ return !!(game.comicProgress5 && game.comicProgress5[6]); } }
    ,{ id:'arc6encounter', icon:'🔭', title:'Senedra Spots Two Sails', where:'When you start the Arc VI Chapter 1 fight',
      clips:['cin25-arc6-senedra-spots-two-sails.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[1]); } }
    ,{ id:'arc6service', icon:'🧹', title:'Community Service Begins', where:'After the Arc VI Chapter 1 capture',
      clips:['cin26-arc6-community-service.mp4'],
      passed:function(){ return !!(game.comicProgress6 && game.comicProgress6[1]); } }
    ,{ id:'erynn', icon:'📖', title:'Erynn Farseer — The Man Who Knows the Door', where:'When Arc VII Chapter 3 is marked read',
      clips:['cin21-erynn-intro.mp4'],
      passed:function(){ return !!(game.comicProgress7 && game.comicProgress7[3]); } }
    ,{ id:'twinsbirth', icon:'👶', title:'The Twins Are Born', where:'When Arc XXXV Chapter 10 is marked read',
      clips:['cin22-twins-birth.mp4'],
      passed:function(){ return !!(game.comicProgress35 && game.comicProgress35[10]); } }
    ,{ id:'sparks', icon:'✨', title:'The Twins\' First Sparks', where:'When Arc XXXV is complete',
      clips:['cin23-twins-first-sparks.mp4'],
      passed:function(){ return !!game.arc35Complete; } }
    ,{ id:'joycaelan', icon:'💞', title:'Joy & Caelan — A Little More Willing', where:'When Arc XXV is complete',
      clips:['cin24-joy-caelan-milestone.mp4'],
      passed:function(){ return !!game.arc25Complete; } }
  ];
  // story order, for the Comic Archive list
  (function(){ const o=['storm','malacca','joel','rescue','rescueafter','aboard','palembang','aisyah','aisyahafter','batavia','eliz','bangkok','mezstorm','mezstormafter','hanoi','senedra','manila','zaki','twins','passage','kota_batu','fair_tide','mimi','renn','arc6encounter','arc6service','erynn','twinsbirth','sparks','joycaelan']; CINEMATICS.sort(function(a,b){ return o.indexOf(a.id)-o.indexOf(b.id); }); })();
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
    const urls = def.clips.map(function(c){ return BASE + c; });
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
      if (id && !options.replay && autoOn() && !isSeen(id) && !(game.comicProgress && game.comicProgress[chapterId]) && typeof STORY_MODE_CHAPTERS !== 'undefined' && STORY_MODE_CHAPTERS[chapterId]) {
        if (busy) return true;
        const self = this, args = arguments;
        window.playCinematic(id).then(function(){ oldOpen.apply(self, args); });
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
    const rows = CINEMATICS.map(function(c){
      const seen = isSeen(c.id);
      return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid rgba(232,197,71,.15);">' +
        '<span style="flex:1;min-width:0;"><b>' + c.icon + ' ' + esc(c.title) + '</b><br><span style="font-size:.72rem;opacity:.65;">' + esc(c.where) + (seen ? '' : ' · not seen yet') + '</span></span>' +
        (seen ? '<button class="btn btn-small" onclick="replayCinematic(\'' + c.id + '\')">▶ Replay</button>' : '<span style="font-size:.72rem;opacity:.55;">🔒</span>') + '</div>';
    }).join('');
    return '<div id="ctCinemaPanel" class="panel" style="margin:0 0 12px;border-color:rgba(232,197,71,.4);">' +
      '<div class="panel-title">🎬 Cinematics</div>' +
      '<label style="display:flex;align-items:center;gap:8px;font-size:.84rem;margin:4px 0 8px;cursor:pointer;"><input type="checkbox" ' + (autoOn() ? 'checked' : '') + ' onchange="setCinematicsAuto(this.checked)"> Play cinematics automatically</label>' + rows + '</div>';
  }
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
