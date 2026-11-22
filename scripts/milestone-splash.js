(function(){
  // -------------------------------------------------------------------
  // MILESTONE SPLASH SCREENS. A single piece of art that pops up in a gold embossed frame for a
  // few seconds, then closes by itself (tap to close early). Used for the smaller story moments
  // that do not get a video:
  //
  //   ch10      The Day the Sea Rested -> when Chapter 10 has been read (after its clip, "kiss")
  //   ch11      The Day We Chose       -> when Chapter 11 has been read (after its clip, "catch")
  //   joel      Joel joins             -> the moment the Wreck Warden falls
  //   aisyah    Aisyah joins           -> the moment the Debt Collector falls
  //   eliz      Eliz joins             -> the moment the Plague Hulk falls
  //   mezstorm  Mezstorm joins         -> the moment the Storm Idol falls
  //   twins     Senedra and Zaki join  -> when Chapter 23 is complete (they join together)
  //   finale    The whole crew         -> when Chapter 24 is complete
  //   arc3ch1   The Night at the Tavern -> when Arc III Chapter 1 is marked read
  //   sanjoel_t4, sanjoel_t5 -> San & Joel's bond reaching its top two tiers (scripts/sanjoel-tier-scenes.js); art goes in assets/splash/arc1/
  //   arc20ch20  Forever and Ever       -> when Arc XX Chapter 20 is opened: the clip, then this splash, then the chapter
  //   arc6ch1, arc6svc_a, arc6svc_b -> Arc VI Chapter 1: Senedra's clip then the ships splash before the fight; after the capture: the explainer, then Robin's clip, Jeff's fall, Renn cutting the binding, Robin's and Jeff's splashes, and the community service clip
  //   twinsborn The twins are born      -> when Arc XXXV Chapter 10 is marked read, then the birth-reveal clip plays
  //
  // Each shows once per save (game.splashSeen) and follows the same "play cinematics
  // automatically" switch as the videos. A moment a save has already passed never replays by
  // itself; the Comic Archive lists the ones seen so far with a View button.
  // -------------------------------------------------------------------
  const BASE = 'assets/splash/arc1/';
  const SPLASH = [
    { id:'ch10',     img:'ch10-the-day-the-sea-rested.webp', kicker:'Chapter 10',     title:'The Day the Sea Rested',     where:'After Chapter 10 is read' },
    { id:'ch11',     img:'ch11-the-day-we-chose.webp',     kicker:'Chapter 11',     title:'The Day We Chose',           where:'After Chapter 11 is read' },
    { id:'joel',     img:'joel-joins.webp',                kicker:'Crew recruited', title:'Joel joins the crew',        where:'When Joel joins the crew' },
    { id:'aisyah',   img:'aisyah-joins.webp',              kicker:'Crew recruited', title:'Aisyah joins the crew',      where:'When Aisyah joins the crew' },
    { id:'eliz',     img:'eliz-joins.webp',                kicker:'Crew recruited', title:'Eliz joins the crew',        where:'When Eliz joins the crew' },
    { id:'mezstorm', img:'mezstorm-joins.webp',            kicker:'Crew recruited', title:'Mezstorm joins the crew',    where:'When Mezstorm joins the crew' },
    { id:'twins',    img:'senedra-zaki-join.webp',         kicker:'Crew recruited', title:'Senedra and Zaki join the crew', where:'When Senedra and Zaki join the crew' },
    { id:'finale',   img:'ch24-the-whole-crew.webp',       kicker:'Chapter 24',     title:'The whole crew, together',   where:'When Chapter 24 is complete' },
    { id:'twinsborn', img:'arc35-ch10-twins-born.webp', kicker:'Arc XXXV · Chapter 10', title:'The twins are born', where:'When Arc XXXV Chapter 10 is marked read' },
    { id:'arc3ch1',  img:'arc3-ch01-the-night-at-the-tavern.webp', kicker:'Arc III · Chapter 1', title:'The Night at the Tavern', where:'When Arc III Chapter 1 is marked read' },
    { id:'sanjoel_t4', img:'sanjoel-two-hearts-one-ship.webp', kicker:'San & Joel', title:'Two Hearts, One Ship', where:'When San and Joel\'s bond reaches Two Hearts, One Ship' },
    { id:'sanjoel_t5', img:'sanjoel-one-ship-one-life.webp', kicker:'San & Joel', title:'One Ship, One Life', where:'When San and Joel\'s bond reaches One Ship, One Life' },
    { id:'arc20ch20', img:'arc20-ch20-forever-and-ever.webp', kicker:'Arc XX · Chapter 20', title:'Forever and Ever', where:'When Arc XX Chapter 20 is opened' },
    { id:'arc6ch1',  img:'arc6-ch01-the-captives.webp', kicker:'Arc VI · Chapter 1', title:'The Captives', where:'When you start the Arc VI Chapter 1 fight', zoom:true },
    { id:'arc6svc_a', img:'arc6-ch01-sweeping-the-quay.webp', kicker:'Arc VI · Chapter 1', title:'Robin: community service begins', where:'After the Arc VI Chapter 1 capture' },
    { id:'arc6svc_b', img:'arc6-ch01-hauling-at-the-dock.webp', kicker:'Arc VI · Chapter 1', title:'Jeff: community service begins', where:'After the Arc VI Chapter 1 capture' }
  ];
  const BY_ID = {}; SPLASH.forEach(function(s){ BY_ID[s.id] = s; });
  const SHOW_MS = 4300;

  function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function seenMap(){ if (!game.splashSeen) game.splashSeen = {}; return game.splashSeen; }
  function isSeen(id){ try { return !!seenMap()[id]; } catch(e) { return true; } }
  function autoOn(){
    try { if (typeof window.cinematicsAuto === 'function') return !!window.cinematicsAuto(); return localStorage.getItem('ct_cinematics_auto') !== '0'; }
    catch(e) { return true; }
  }

  function ensureStyle(){
    if (document.getElementById('ctSplashStyle')) return;
    const s = document.createElement('style'); s.id = 'ctSplashStyle';
    s.textContent =
      '#ctSplash{position:fixed;inset:0;z-index:9500;display:flex;align-items:center;justify-content:center;padding:16px;background:radial-gradient(ellipse at center,rgba(8,10,20,.62),rgba(0,0,0,.86));opacity:1;transition:opacity .38s ease;cursor:pointer;-webkit-tap-highlight-color:transparent;}' +
      '#ctSplash.sp-out{opacity:0;}' +
      '#ctSplash .sp-frame{position:relative;max-width:min(94vw,780px);max-height:94vh;display:flex;flex-direction:column;padding:10px;border-radius:12px;' +
        'background:linear-gradient(145deg,#f7e5a6 0%,#c79a35 28%,#7d5a12 52%,#d9b552 76%,#f3dc92 100%);' +
        'box-shadow:0 0 0 1px #3e2b05,0 14px 48px rgba(0,0,0,.8),0 0 36px rgba(232,197,71,.28),inset 0 2px 2px rgba(255,255,255,.7),inset 0 -3px 4px rgba(0,0,0,.5);animation:spPop .24s cubic-bezier(.2,1.3,.4,1) both;}' +
      '#ctSplash .sp-frame:before{content:"";position:absolute;inset:4px;border-radius:9px;border:1px solid rgba(62,43,5,.55);box-shadow:inset 0 1px 0 rgba(255,255,255,.5);pointer-events:none;}' +
      '#ctSplash .sp-art{position:relative;border-radius:6px;overflow:hidden;background:#05070d;box-shadow:inset 0 0 0 2px #3e2b05,inset 0 0 14px rgba(0,0,0,.8);min-height:0;display:flex;}' +
      '#ctSplash .sp-art img{display:block;width:100%;height:auto;max-height:72vh;object-fit:contain;margin:0 auto;}' +
      '#ctSplash .sp-cap{padding:9px 6px 3px;text-align:center;font-family:Cinzel,Georgia,serif;color:#2b1c03;text-shadow:0 1px 0 rgba(255,238,170,.7);}' +
      '#ctSplash .sp-cap small{display:block;font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;opacity:.8;}' +
      '#ctSplash .sp-cap b{display:block;font-size:1.02rem;margin-top:1px;}' +
      '#ctSplash .sp-art img.sp-zoom{transform-origin:50% 57%;animation:spZoom 4.6s cubic-bezier(.35,.05,.25,1) both;will-change:transform;}' +
      '@keyframes spZoom{0%{transform:scale(1)}100%{transform:scale(1.28)}}' +
      '@keyframes spPop{0%{transform:scale(.84);opacity:0}100%{transform:scale(1);opacity:1}}' +
      '@media (prefers-reduced-motion:reduce){#ctSplash .sp-frame{animation:none}#ctSplash{transition:none}#ctSplash .sp-art img.sp-zoom{animation:none}}';
    document.head.appendChild(s);
  }

  // one splash at a time; later ones wait their turn
  let chain = Promise.resolve();
  function show(id, replay){
    const def = BY_ID[id]; if (!def) return Promise.resolve(false);
    const job = function(){
      return new Promise(function(resolve){
        ensureStyle();
        const wrap = document.createElement('div'); wrap.id = 'ctSplash'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-label', def.title);
        const img = new Image(); img.alt = def.title; img.decoding = 'async';
        if (def.zoom) img.className = 'sp-zoom';   // a slow zoom in, like looking through a spyglass
        let timer = null, done = false, born = 0;
        const finish = function(played){
          if (done) return; done = true; clearTimeout(timer);
          document.removeEventListener('keydown', onKey);
          wrap.classList.add('sp-out');
          setTimeout(function(){ try { wrap.remove(); img.removeAttribute('src'); } catch(e) {} resolve(played); }, 380);
        };
        const onKey = function(e){ if (e.key === 'Escape') finish(true); };
        wrap.addEventListener('click', function(){ if (Date.now() - born > 450) finish(true); });
        img.onerror = function(){ if (!born) { done = true; clearTimeout(timer); resolve(false); } };
        img.onload = function(){
          if (done) return;
          wrap.innerHTML = '<div class="sp-frame"><div class="sp-art"></div><div class="sp-cap"><small>' + esc(def.kicker) + '</small><b>' + esc(def.title) + '</b></div></div>';
          wrap.querySelector('.sp-art').appendChild(img);
          document.body.appendChild(wrap); born = Date.now();
          if (!replay) { seenMap()[id] = true; if (typeof saveGameQuiet === 'function') saveGameQuiet(); }
          document.addEventListener('keydown', onKey);
          timer = setTimeout(function(){ finish(true); }, SHOW_MS);
        };
        // an art file that does not arrive in time is skipped, never waited on
        setTimeout(function(){ if (!born && !done) { done = true; resolve(false); } }, 4000);
        img.src = BASE + def.img;
      });
    };
    const p = chain.then(job, job); chain = p.catch(function(){}); return p;
  }
  window.showMilestoneSplash = function(id){ return show(id, true); };

  // fires a splash once, if cinematics are switched on and it has not been seen
  function auto(id, delay){
    if (!autoOn() || isSeen(id)) return Promise.resolve(false);
    return new Promise(function(r){ setTimeout(r, delay || 0); }).then(function(){ return show(id, false); });
  }

  // ---- Arc VI Chapter 1 (Robin and Jeff): the splash and the spyglass clip before the fight, the service clip and art after the capture ----
  window.playMilestoneSplashOnce = function(id){ return auto(id, 0); };
  window.playArc6CaptureMedia = function(){
    const clip = function(id){ return function(){ return typeof window.playCinematicOnce === 'function' ? window.playCinematicOnce(id) : null; }; };
    // the capture itself (Robin yields, Jeff falls, Renn cuts the binding), then the two captives' splashes, then the service clip
    return new Promise(function(r){ setTimeout(r, 300); })
      .then(clip('arc6robin'))
      .then(clip('arc6jeff'))
      .then(clip('arc6renn'))
      .then(function(){ return auto('arc6svc_a', 300); })
      .then(function(){ return auto('arc6svc_b', 200); })
      .then(clip('arc6service'));
  };

  // ---- Recruitment: Joel, Aisyah, Eliz and Mezstorm join when their guardian falls ----
  const GUARDIAN_JOIN = ['joel', 'aisyah', 'eliz', 'mezstorm'];
  const AFTER_FIGHT = { joel:'rescueafter', aisyah:'aisyahafter', mezstorm:'mezstormafter' };   // the battle clips that follow each real fight
  const oldVictory = window.handleVictory;
  if (typeof oldVictory === 'function') {
    window.handleVictory = function(){
      const had = {}; GUARDIAN_JOIN.forEach(function(c){ had[c] = !!(game.foundCompanions && game.foundCompanions[c]); });
      const r = oldVictory.apply(this, arguments);
      try {
        GUARDIAN_JOIN.forEach(function(c){
          if (had[c] || !(game.foundCompanions && game.foundCompanions[c])) return;
          const after = AFTER_FIGHT[c];
          if (after && typeof window.playCinematicOnce === 'function') {
            // the battle clip(s) first, then the companion's splash
            new Promise(function(r){ setTimeout(r, 900); }).then(function(){ return window.playCinematicOnce(after); }).then(function(){ return auto(c, 300); });
          } else auto(c, 900);
        });
      } catch(e) {}
      return r;
    };
  }

  // ---- Chapters 10 and 11 (after they are read), Chapter 23 (Senedra and Zaki join together) and Chapter 24 (the finale) ----
  const oldFinish = window.finishStoryModeChapter;
  if (typeof oldFinish === 'function') {
    window.finishStoryModeChapter = function(id){
      const n = Number(id), was = !!(game.comicProgress && game.comicProgress[n]);
      const r = oldFinish.apply(this, arguments);
      try {
        const now = !!(game.comicProgress && game.comicProgress[n]);
        if (!was && now && (n === 10 || n === 11)) {
          // the clip first (Chapter 10: the vineyard kiss, Chapter 11: the catch at the shore), then the chapter's splash
          new Promise(function(r){ setTimeout(r, 700); })
            .then(function(){ return typeof window.playCinematicOnce === 'function' ? window.playCinematicOnce(n === 10 ? 'kiss' : 'catch') : null; })
            .catch(function(){})
            .then(function(){ return auto('ch' + n, 300); });
        }
        if (!was && now && n === 23 && game.foundCompanions && game.foundCompanions.senedra && game.foundCompanions.zaki) auto('twins', 700);
        if (!was && now && n === 24) auto('finale', 700);
      } catch(e) {}
      return r;
    };
  }

  // ---- Arc III Chapter 1: shown once it is marked read (its comic opens in another tab) ----
  const oldMark3 = window.markArc3ChapterRead;
  if (typeof oldMark3 === 'function') {
    window.markArc3ChapterRead = function(id){
      const was = !!(game.comicProgress3 && game.comicProgress3[Number(id)]);
      const r = oldMark3.apply(this, arguments);
      try { if (Number(id) === 1 && !was && game.comicProgress3 && game.comicProgress3[1]) auto('arc3ch1', 600); } catch(e) {}
      return r;
    };
  }

  // ---- Arc XXXV Chapter 10 (Joelle): the splash, then the birth-reveal clip ----
  const oldMark35 = window.markArc35ChapterRead;
  if (typeof oldMark35 === 'function') {
    window.markArc35ChapterRead = function(id){
      const was = !!(game.comicProgress35 && game.comicProgress35[Number(id)]);
      const r = oldMark35.apply(this, arguments);
      try {
        if (Number(id) === 10 && !was && game.comicProgress35 && game.comicProgress35[10]) {
          auto('twinsborn', 600).then(function(){ if (typeof window.playCinematicOnce === 'function') window.playCinematicOnce('twinsbirth'); });
        }
      } catch(e) {}
      return r;
    };
  }

  // ---- Comic Archive: the ones seen so far can be viewed again ----
  function panelHtml(){
    const rows = SPLASH.map(function(s){
      const seen = isSeen(s.id);
      return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid rgba(232,197,71,.15);">' +
        '<span style="flex:1;min-width:0;"><b>🖼️ ' + esc(s.title) + '</b><br><span style="font-size:.72rem;opacity:.65;">' + esc(s.where) + (seen ? '' : ' · not seen yet') + '</span></span>' +
        (seen ? '<button class="btn btn-small" onclick="showMilestoneSplash(\'' + s.id + '\')">View</button>' : '<span style="font-size:.72rem;opacity:.55;">🔒</span>') + '</div>';
    }).join('');
    return '<div id="ctSplashPanel" class="panel" style="margin:0 0 12px;border-color:rgba(232,197,71,.4);"><div class="panel-title">🖼️ Milestone art</div>' + rows + '</div>';
  }
  const oldArchive = window.renderComicArchive;
  if (typeof oldArchive === 'function') {
    window.renderComicArchive = function(){
      const r = oldArchive.apply(this, arguments);
      try {
        const el = document.getElementById('comicArchive');
        if (el && !el.querySelector('#ctSplashPanel')) {
          const cp = el.querySelector('#ctCinemaPanel');
          if (cp) cp.insertAdjacentHTML('afterend', panelHtml()); else el.insertAdjacentHTML('afterbegin', panelHtml());
        }
      } catch(e) {}
      return r;
    };
  }
})();
