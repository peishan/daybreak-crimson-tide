(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE HOBBIES — characters occasionally doing things unrelated
  // to saving Fair Tide, per San's own framing. Deliberately occasional
  // rather than guaranteed (a 35% chance per new Veyren story day,
  // capped at one), and deliberately reward-free -- "no reward is even
  // necessary every time." Each moment is gated on every character it
  // references actually being recruited/unlocked yet, same eligibility
  // discipline as fair-tide-flavour-events.js.
  //
  // Registers its own Tide Story source (hobby_echo, evening slot) so
  // it feeds Tide Stories (scripts/tide-stories.js) the same way
  // fair-tide-flavour-events.js's own flavour_echo does -- today's
  // hobby, if one rolled, can surface there too, giving the evening
  // slot a second real source alongside the twins' own growth/trouble
  // echoes.
  // -------------------------------------------------------------------

  const HOBBY_MOMENTS = [
    { id:'joel_garden',      icon:'🌿', title:"Joel's Garden",         text:'Joel harvested too much rosemary again. San has been informed that this is somehow her problem.', characters:['joel'] },
    { id:'joel_cooking',     icon:'🍲', title:"Joel's Cooking",        text:'Joel spent the afternoon cooking something nobody asked for. Nobody is complaining either.', characters:['joel'] },
    { id:'mimi_flowers',     icon:'🌸', title:"Mimi's Arrangement",    text:'Mimi rearranged an entire corner of Fair Tide with flowers. Nobody remembers approving this.', characters:['mimi'] },
    { id:'renn_missing',     icon:'📚', title:'Missing Researcher',    text:'Renn was reported missing. He was in the Archive. Nobody checked the Archive.', characters:['renn'] },
    { id:'renn_reading',     icon:'📖', title:"Renn's Reading Spot",   text:'Renn was found reading on top of a cargo crate again. The crate was moving at the time.', characters:['renn'] },
    { id:'erynn_sky',        icon:'🌌', title:"Erynn's Sky",           text:'Erynn spent the evening studying the sky. She has a theory. She is not ready to share it yet.', characters:['erynn'] },
    { id:'senedra_explore',  icon:'🧭', title:"Senedra's Wander",      text:'Senedra went exploring and came back with a new route nobody asked her to map.', characters:['senedra'] },
    { id:'kw_iris_scouting', icon:'🦊', title:'Scouting Practice',     text:'KW Liang and Iris practiced scouting drills on the docks. Several crates did not survive.', characters:['kw_liang','iris'] },
    { id:'aisyah_trading',   icon:'💰', title:"Aisyah's Deal",         text:"Aisyah closed a trade deal nobody else understood the terms of. She assures everyone it's fine.", characters:['aisyah'] },
    { id:'brada_tinkering',  icon:'🔧', title:"Brada's Tinkering",     text:'Brada tinkered with the harbor defenses again. Nothing exploded this time.', characters:['brada_shah'] },
    { id:'maera_custom',     icon:'🌿', title:"Maera's Custom",        text:'Maera introduced an ordinary Veyren custom to someone who had never seen it before.', characters:['maera_roster'] }
  ];
  window.FAIR_TIDE_HOBBY_MOMENTS = HOBBY_MOMENTS;

  function characterEligible(token){
    if (token === 'san') return true;
    if (token === 'maera_roster') return !!(game.fairTideRoster && game.fairTideRoster.maera);
    return !!(game.foundCompanions && game.foundCompanions[token]);
  }

  function momentEligible(moment){
    return moment.characters.every(characterEligible);
  }

  function eligibleHobbyMoments(){
    return HOBBY_MOMENTS.filter(momentEligible);
  }
  window.eligibleFairTideHobbyMoments = eligibleHobbyMoments;

  const ROLL_CHANCE = 0.35;
  const MAX_LOG = 30;

  function hobbyState(){
    if (!game.fairTideHobbies) game.fairTideHobbies = { log: [], lastRollDay: null };
    return game.fairTideHobbies;
  }
  window.fairTideHobbyState = hobbyState;

  function rollTodaysHobby(){
    const state = hobbyState();
    const today = game.day || 0;
    if (state.lastRollDay === today) return; // once per new game day, never per render/click
    state.lastRollDay = today;
    if (Math.random() >= ROLL_CHANCE) return;
    const pool = eligibleHobbyMoments();
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    state.log.push({ id: pick.id, icon: pick.icon, title: pick.title, text: pick.text, day: today });
    if (state.log.length > MAX_LOG) state.log.splice(0, state.log.length - MAX_LOG);
  }

  const oldSyncArc1ForHobbies = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForHobbies) oldSyncArc1ForHobbies();
    rollTodaysHobby();
  };

  function renderFairTideHobbiesPanel(){
    const state = hobbyState();
    if (!state.log.length) return '';
    const today = game.day || 0;
    const todays = state.log.filter(function(e){ return e.day === today; });
    let html = '<div class="panel-title" style="margin-top:16px;">🌿 Hobbies &amp; Downtime</div>';
    if (todays.length) {
      todays.forEach(function(e){
        html += '<article class="quest-item"><strong>'+esc(e.icon)+' '+esc(e.title)+'</strong><br>'+
          '<span style="font-size:.8rem;opacity:.85;">'+esc(e.text)+'</span></article>';
      });
    }
    const earlier = state.log.filter(function(e){ return e.day !== today; });
    if (earlier.length) {
      html += '<div style="font-size:.74rem;opacity:.7;margin-top:10px;">Earlier</div>';
      html += '<div style="font-size:.72rem;opacity:.65;line-height:1.6;">';
      earlier.slice(-8).reverse().forEach(function(e){
        html += esc(e.icon) + ' ' + esc(e.title) + ' <span style="opacity:.6;">(Day '+e.day+')</span><br>';
      });
      html += '</div>';
    }
    return html;
  }
  window.renderFairTideHobbiesPanel = renderFairTideHobbiesPanel;

  const oldRenderArchiveScreenForHobbies = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForHobbies) oldRenderArchiveScreenForHobbies();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('fairTideHobbiesPanelWrap');
    if (existing) existing.remove();
    const panel = renderFairTideHobbiesPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="fairTideHobbiesPanelWrap">'+panel+'</div>');
  };

  // -------------------------------------------------------------------
  // Tide Story extension — registers once this file loads, same
  // pattern San's own roadmap called for.
  // -------------------------------------------------------------------
  if (typeof window.registerTideStorySource === 'function') {
    window.registerTideStorySource({
      id: 'hobby_echo', slot: 'evening',
      eligible: function(){
        const today = game.day || 0;
        return hobbyState().log.some(function(e){ return e.day === today; });
      },
      generate: function(){
        const today = game.day || 0;
        const todays = hobbyState().log.filter(function(e){ return e.day === today; });
        if (!todays.length) return null;
        const pick = todays[Math.floor(Math.random() * todays.length)];
        return { icon: pick.icon, title: pick.title, text: pick.text };
      }
    });
  }
})();
