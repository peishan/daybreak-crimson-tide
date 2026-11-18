(function(){
  // -------------------------------------------------------------------
  // FIRST VOYAGE GUIDE. A short, optional checklist for new voyages.
  //
  // It teaches the things a new captain has to figure out in the first hour, in the
  // order the game actually needs them: read Chapter 1, buy goods, fight in the harbour,
  // reach Level 5 (Malacca stays locked until Chapter 1 is read AND you are Level 5),
  // rest, sail to Malacca, sell where goods are worth more, hire crew at the Tavern.
  //
  //   * Starts on a NEW voyage only. Saves made before this existed never see it, unless
  //     the player reopens it with the 🧭 Guide button.
  //   * Steps tick themselves off from what the player actually does; a "Show me" button
  //     jumps to the right screen and the matching button pulses.
  //   * Can be collapsed or skipped at any time; state lives in game.tutorial.
  // -------------------------------------------------------------------
  const STEPS = [
    { id:'story', icon:'📖', title:'Read Chapter 1',
      text:'Open 📖 Story and play Chapter 1. Chapters are the main story. The yellow Current Objective box on the Port screen always says what is next.',
      done:function(){ return !!(game.comicProgress && game.comicProgress[1]); },
      go:function(){ goScreen('story'); }, pulse:['.nav-btn[onclick*="\'story\'"]'] },
    { id:'buy', icon:'💰', title:'Buy some goods',
      text:'On the Port screen, open the 🏪 Market tab and buy something. Each port is cheapest in the goods it makes, so buy cheap here and sell dear elsewhere.',
      done:function(f){ return !!f.bought; },
      go:function(){ goScreen('port'); if (typeof switchPortTab === 'function') switchPortTab('market'); }, pulse:['.tab-btn[onclick*="\'market\'"]'] },
    { id:'fight', icon:'⚔️', title:'Win a harbour fight',
      text:'Open the ⚔️ Explore tab and start a fight. Harbour fights and bounties are safe XP and loot, and you need levels to move the story along.',
      done:function(f){ return !!f.fought; },
      go:function(){ goScreen('port'); if (typeof switchPortTab === 'function') switchPortTab('explore'); }, pulse:['.tab-btn[onclick*="\'explore\'"]'] },
    { id:'rest', icon:'🛏️', title:'Rest at port',
      text:'Hurt after a fight? Press 🛏️ Rest Here on the Port screen. It is free and restores everyone\'s HP and MP (small chance of a visitor).',
      done:function(f){ return !!f.rested; },
      go:function(){ goScreen('port'); }, pulse:['button[onclick*="freeRestAtPort"]'] },
    { id:'level', icon:'⭐', title:'Reach Level 5',
      text:'Fights, bounties, trading and chapters all give XP. Malacca stays locked on the Sail screen until you have read Chapter 1 and reached Level 5.',
      done:function(){ return level() >= 5; },
      go:function(){ goScreen('port'); if (typeof switchPortTab === 'function') switchPortTab('explore'); }, pulse:['.tab-btn[onclick*="\'explore\'"]'] },
    { id:'sail', icon:'🗺️', title:'Sail to Malacca',
      text:'Open 🗺️ Sail, pick Malacca and set sail. Voyages take days and can bring encounters; a faster ship gets there sooner.',
      done:function(f){ return !!f.sailed || game.location !== 'singapore'; },
      go:function(){ goScreen('navigate'); }, pulse:['.nav-btn[onclick*="\'navigate\'"]'] },
    { id:'sell', icon:'📈', title:'Sell goods at a new port',
      text:'Bring cargo to a different port and sell it where it pays more. The 📈 Intelligence tab shows prices at other ports.',
      done:function(f){ return !!f.sold; },
      go:function(){ goScreen('port'); if (typeof switchPortTab === 'function') switchPortTab('market'); }, pulse:['.tab-btn[onclick*="\'market\'"]'] },
    { id:'crew', icon:'🍺', title:'Hire a crew member',
      text:'Visit the 🍺 Tavern and hire at least one temporary crew member. A crew fights beside San and many story chapters need one.',
      done:function(){ return !!((game.temporaryCrew || []).length || (game.foundCompanions && game.foundCompanions.joel)); },
      go:function(){ goScreen('tavern'); }, pulse:['.nav-btn[onclick*="\'tavern\'"]'] }
  ];

  function T(){ return game.tutorial && game.tutorial.on ? game.tutorial : null; }
  function flags(){ game.tutorial.flags = game.tutorial.flags || {}; return game.tutorial.flags; }

  function ensureStyle(){
    if (document.getElementById('ctTutStyle')) return;
    const s = document.createElement('style'); s.id = 'ctTutStyle';
    s.textContent =
      '.ct-tut{margin:10px 0;border:1px solid rgba(111,181,125,.55);}' +
      '.ct-tut .tut-head{display:flex;align-items:center;gap:8px;cursor:pointer;}' +
      '.ct-tut .tut-head b{flex:1;font-family:Cinzel,Georgia,serif;color:var(--gold);}' +
      '.ct-tut .tut-bar{height:5px;border-radius:3px;background:rgba(255,255,255,.12);margin:8px 0;}' +
      '.ct-tut .tut-bar span{display:block;height:100%;border-radius:3px;background:#6fb57d;}' +
      '.ct-tut .tut-step{display:flex;gap:8px;padding:5px 0;font-size:.82rem;opacity:.7;}' +
      '.ct-tut .tut-step.done{opacity:.55;text-decoration:line-through;}' +
      '.ct-tut .tut-step.cur{opacity:1;}' +
      '.ct-tut .tut-now{margin:6px 0 8px;padding:9px 10px;border-radius:8px;background:rgba(111,181,125,.12);font-size:.84rem;line-height:1.5;}' +
      '.ct-tut-pulse{animation:ctTutPulse 1.3s ease-in-out infinite;position:relative;}' +
      '@keyframes ctTutPulse{0%,100%{box-shadow:0 0 0 0 rgba(111,181,125,.0);}50%{box-shadow:0 0 0 4px rgba(111,181,125,.75);}}';
    document.head.appendChild(s);
  }

  function mounts(){
    const out = [];
    [['portScreen', '#mainGoalPanel'], ['navigateScreen', '.panel'], ['storyScreen', '#storyContent']].forEach(function(p){
      const scr = document.getElementById(p[0]); if (!scr) return;
      let el = scr.querySelector('.ct-tut');
      if (!el) {
        el = document.createElement('div'); el.className = 'panel ct-tut';
        const anchor = scr.querySelector(p[1]);
        if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(el, anchor); else return;
      }
      out.push(el);
    });
    return out;
  }

  function clearPulse(){ document.querySelectorAll('.ct-tut-pulse').forEach(function(e){ e.classList.remove('ct-tut-pulse'); }); }

  function render(){
    clearPulse();
    const t = T();
    document.querySelectorAll('.ct-tut').forEach(function(e){ if (!t) e.remove(); });
    if (!t || typeof gameSessionActive === 'undefined' || !gameSessionActive) { return; }
    ensureStyle();
    const f = flags();
    const states = STEPS.map(function(s){ return !!s.done(f); });
    // tell the player when a step ticks over
    t.doneKeys = t.doneKeys || [];
    STEPS.forEach(function(s, i){
      if (states[i] && t.doneKeys.indexOf(s.id) < 0) {
        t.doneKeys.push(s.id);
        if (t.seen && typeof toast === 'function') {
          const nxt = STEPS.find(function(x, j){ return !states[j]; });
          toast('🧭 Guide: ' + s.title + ' ✓' + (nxt ? ' · Next: ' + nxt.title : ' · Guide complete!'), 3600);
        }
      }
    });
    const doneCount = states.filter(Boolean).length;
    const curIdx = states.indexOf(false);
    const all = curIdx < 0;
    let html;
    if (all) {
      html = '<div class="panel-title">🧭 First Voyage Guide — complete! 🎉</div>' +
        '<div style="font-size:.84rem;line-height:1.5;">You know the basics: story, trade, fights, rest, sailing and crew. From here the yellow <b>Current Objective</b> box always tells you what to do next.</div>' +
        '<button class="btn btn-small" style="margin-top:8px;" onclick="tutorialDismiss()">Got it — hide the guide</button>';
    } else if (t.collapsed) {
      html = '<div class="tut-head" onclick="tutorialToggle()"><span>🧭</span><b>First Voyage Guide · ' + doneCount + '/' + STEPS.length + '</b><span>▾</span></div>' +
        '<div style="font-size:.78rem;opacity:.8;margin-top:4px;">Next: ' + STEPS[curIdx].icon + ' ' + STEPS[curIdx].title + '</div>';
    } else {
      html = '<div class="tut-head" onclick="tutorialToggle()"><span>🧭</span><b>First Voyage Guide · ' + doneCount + '/' + STEPS.length + '</b><span>▴</span></div>' +
        '<div class="tut-bar"><span style="width:' + Math.round(doneCount / STEPS.length * 100) + '%"></span></div>' +
        STEPS.map(function(s, i){ return '<div class="tut-step' + (states[i] ? ' done' : '') + (i === curIdx ? ' cur' : '') + '"><span>' + (states[i] ? '✅' : s.icon) + '</span><span>' + s.title + '</span></div>'; }).join('') +
        '<div class="tut-now"><b>' + STEPS[curIdx].icon + ' ' + STEPS[curIdx].title + '</b><br>' + STEPS[curIdx].text + '</div>' +
        '<button class="btn btn-small btn-success" onclick="tutorialGo()">👉 Show me</button> ' +
        '<button class="btn btn-small" onclick="tutorialSkip()">Skip guide</button>';
    }
    mounts().forEach(function(el){ el.innerHTML = html; });
    if (!all) STEPS[curIdx].pulse.forEach(function(sel){ document.querySelectorAll(sel).forEach(function(e){ e.classList.add('ct-tut-pulse'); }); });
  }

  window.tutorialToggle = function(){ if (!T()) return; game.tutorial.collapsed = !game.tutorial.collapsed; render(); };
  window.tutorialGo = function(){
    const t = T(); if (!t) return;
    const f = flags(), s = STEPS.find(function(x){ return !x.done(f); });
    if (s) { try { s.go(); } catch(e) {} setTimeout(render, 50); }
  };
  window.tutorialDismiss = function(){ if (game.tutorial) game.tutorial.on = false; render(); if (typeof saveGameQuiet === 'function') saveGameQuiet(); };
  window.tutorialSkip = function(){
    if (typeof showModal !== 'function') { window.tutorialDismiss(); return; }
    showModal('Skip the guide?', 'You can bring it back any time with the <b>🧭 Guide</b> button on the Port screen.', [
      { text:'Skip it', action:function(){ closeModal(); window.tutorialDismiss(); } },
      { text:'Keep it', action:closeModal }
    ]);
  };
  window.tutorialStart = function(fromWelcome){
    game.tutorial = { on:true, flags:{}, doneKeys:[], seen:false, collapsed:false };
    render();
    // anything already true (an old save reopening the guide) is not announced
    game.tutorial.doneKeys = STEPS.filter(function(s){ return s.done(game.tutorial.flags); }).map(function(s){ return s.id; });
    game.tutorial.seen = true;
    render();
    if (!fromWelcome && typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  function welcome(){
    if (typeof showModal !== 'function') return;
    showModal('⚓ Welcome aboard, Captain',
      'You are San, and the <b>Daybreak</b> is yours. A short checklist will walk you through the first hour: reading the story, trading, fighting, resting, sailing and hiring crew.<br><br>' +
      '<i>Tip: the yellow <b>Current Objective</b> box on the Port screen always tells you the next step of the story.</i>',
      [ { text:'🧭 Show me the ropes', action:function(){ closeModal(); } },
        { text:'I know the way', action:function(){ closeModal(); window.tutorialDismiss(); } } ]);
  }

  // ---- watch what the player does ----
  function wrapSpend(name, flag, wantMore){
    const old = window[name]; if (typeof old !== 'function') return;
    window[name] = function(){
      const before = game.gold;
      const r = old.apply(this, arguments);
      try { if (T() && (wantMore ? game.gold > before : game.gold < before)) { flags()[flag] = true; render(); } } catch(e) {}
      return r;
    };
  }
  wrapSpend('buyGood', 'bought', false);
  wrapSpend('sellGood', 'sold', true);
  ['startHarborFight', 'startCombat'].forEach(function(name){
    const old = window[name]; if (typeof old !== 'function') return;
    window[name] = function(){ try { if (T()) flags().fought = true; } catch(e) {} return old.apply(this, arguments); };
  });
  (function(){
    const old = window.freeRestAtPort; if (typeof old !== 'function') return;
    window.freeRestAtPort = function(){ const r = old.apply(this, arguments); try { if (T()) { flags().rested = true; render(); } } catch(e) {} return r; };
  })();
  (function(){
    const old = window.sailTo; if (typeof old !== 'function') return;
    window.sailTo = function(id){ try { if (T() && typeof isPortUnlocked === 'function' && isPortUnlocked(id)) flags().sailed = true; } catch(e) {} return old.apply(this, arguments); };
  })();
  ['updateUI', 'goScreen', 'switchPortTab', 'renderMainGoal'].forEach(function(name){
    const old = window[name]; if (typeof old !== 'function') return;
    window[name] = function(){ const r = old.apply(this, arguments); try { render(); } catch(e) {} return r; };
  });
  (function(){
    const old = window.startGame; if (typeof old !== 'function') return;
    window.startGame = function(){
      const r = old.apply(this, arguments);
      try { window.tutorialStart(true); if (typeof saveGameQuiet === 'function') saveGameQuiet(); setTimeout(welcome, 700); } catch(e) {}
      return r;
    };
  })();

  // 🧭 Guide button next to Settings, so the guide can be brought back
  function addButton(){
    document.querySelectorAll('.ct-bottom-settings').forEach(function(bar){
      if (bar.querySelector('.ct-guide-shortcut')) return;
      const b = document.createElement('button'); b.className = 'ct-settings-shortcut ct-guide-shortcut'; b.textContent = '🧭 Guide';
      b.onclick = function(){ if (T()) { game.tutorial.collapsed = false; render(); const el = document.querySelector('#portScreen .ct-tut'); if (el) el.scrollIntoView({ block:'center' }); } else { window.tutorialStart(false); if (typeof toast === 'function') toast('🧭 Guide is back on the Port screen.'); } };
      bar.insertBefore(b, bar.firstChild);
    });
  }
  addButton();
})();
