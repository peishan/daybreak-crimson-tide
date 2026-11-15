(function(){
  // -------------------------------------------------------------------
  // CRIMSON HORIZON MUSIC. The base game has five looping tracks
  // (landing, explore, combat, port, tavern). Once the sequel begins this
  // swaps in sequel-specific tracks by situation, with NO other change:
  // every key falls back to the existing track until its file exists, so
  // tracks can be dropped into assets/audio/ one at a time and are picked
  // up automatically (each file is probed once per session).
  //
  //   ch_title     assets/audio/ch-title.mp3      the Crimson Horizon theme (the sequel splash)
  //   ch_sail      assets/audio/ch-sail.mp3       open-water sailing (replaces explore)
  //   ch_fair_tide assets/audio/ch-fair-tide.mp3  Fair Tide as home (replaces port at Fair Tide)
  //   ch_market    assets/audio/ch-market.mp3     the market: the port screen's Market tab at Crimson Horizon ports and Fair Tide,
  //                                              and Fair Tide's Trade tab
  //   ch_tavern    assets/audio/ch-tavern.mp3     the tavern in the sequel (replaces tavern)
  //   ch_home      assets/audio/ch-home.mp3       the quiet rooms: Tribute House, Captain's Quarters
  //   ch_pearl     assets/audio/ch-pearl.mp3      the Black Pearl study (Research Team tab)
  //   ch_harbor    assets/audio/ch-harbor.mp3     the new harbors: Harbor Beyond the Charts, Island Harbor,
  //                                              Outer Island, Channel Island, Terrace Harbor, River Mouth, Ropewalk Town, Timber Port
  //   ch_storm     assets/audio/ch-storm.mp3      Storm Shelf
  //   ch_mist      assets/audio/ch-mist.mp3       West Gate, the Mist Straits
  //   ch_channel   assets/audio/ch-channel.mp3    South Gate, the Deep Channel (and the Central Gate)
  //   ch_combat    assets/audio/ch-combat.mp3     Crimson Horizon fights
  //   ch_boss      assets/audio/ch-boss.mp3       the big fights (the Stormborn Leviathan, the Keeper's guard)
  // -------------------------------------------------------------------

  const FILES = {
    ch_title:'ch-title', ch_sail:'ch-sail', ch_fair_tide:'ch-fair-tide', ch_home:'ch-home', ch_pearl:'ch-pearl', ch_market:'ch-market', ch_tavern:'ch-tavern',
    ch_harbor:'ch-harbor', ch_storm:'ch-storm', ch_mist:'ch-mist', ch_channel:'ch-channel', ch_combat:'ch-combat', ch_boss:'ch-boss'
  };
  const PORT_TRACK = {
    harbor_beyond_charts:'ch_harbor', storm_shelf:'ch_storm', west_gate:'ch_mist', south_gate:'ch_channel', central_gate:'ch_channel',
    island_harbor:'ch_harbor', outer_island:'ch_harbor', channel_island:'ch_harbor', terrace_harbor:'ch_harbor',
    river_mouth:'ch_harbor', ropewalk_town:'ch_harbor', timber_port:'ch_harbor'
  };
  const BOSS_FIGHTS = ['3', '60'];   // CH_FIGHTS keys: the Stormborn Leviathan, the Keeper's guard

  const available = window.__chMusicAvail = window.__chMusicAvail || {};
  let lastBase = null;

  function sequelOn(){
    return typeof game !== 'undefined' && !!(game && game.arc42Complete && game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[1]);
  }
  function activeScreenId(){
    const el = document.querySelector('.screen.active');
    return el ? el.id : '';
  }

  // Which sequel track (if any) fits this base key right now.
  function wanted(base){
    if (!sequelOn()) return null;
    const so = document.getElementById('storyModeOverlay');
    if (so && so.classList.contains('active')) return null;          // the Arc I comic reader keeps its own music
    if (base === 'explore') return 'ch_sail';
    if (base === 'tavern') return 'ch_tavern';
    if (base === 'combat') {
      const enc = window.__ctLastEncounter || {};
      if (enc.kind === 'crimson_horizon') return BOSS_FIGHTS.indexOf(String(enc.key)) !== -1 ? 'ch_boss' : 'ch_combat';
      return PORT_TRACK[game.location] ? 'ch_combat' : null;
    }
    if (base === 'port') {
      // The market: the port screen's Market tab at a Crimson Horizon port or Fair Tide.
      if (activeScreenId() === 'portScreen' && (PORT_TRACK[game.location] || game.location === 'fair_tide')) {
        const tabEl = document.querySelector('#portContent .tab-content.active');
        if (tabEl && tabEl.id === 'port-tab-market') return 'ch_market';
      }
      if (game.location === 'fair_tide') {
        const tab = game.fairTideActiveTab || 'buildings';
        if (activeScreenId() === 'fairTideScreen') {
          if (tab === 'research') return 'ch_pearl';
          if (tab === 'trade') return 'ch_market';
          if (tab === 'tribute_house' || tab === 'quarters' || tab === 'allies') return 'ch_home';
        }
        return 'ch_fair_tide';
      }
      return PORT_TRACK[game.location] || null;
    }
    return null;
  }
  function chosen(base){
    const w = wanted(base);
    return (w && available[w] === true) ? w : base;
  }
  window.crimsonHorizonMusicKey = function(base){ return {wanted: wanted(base), key: chosen(base)}; };

  function probe(key){
    const url = 'assets/audio/' + FILES[key] + '.mp3';
    let cached = null;
    try { cached = sessionStorage.getItem('chm_' + key); } catch(e) {}
    if (cached === '1' || cached === '0') {
      available[key] = cached === '1';
      if (available[key]) register(key, url);
      return Promise.resolve();
    }
    return fetch(url, {method:'HEAD'}).then(function(r){
      available[key] = !!r.ok;
      try { sessionStorage.setItem('chm_' + key, r.ok ? '1' : '0'); } catch(e) {}
      if (r.ok) { register(key, url); refresh(); }
    }).catch(function(){ available[key] = false; });
  }
  function register(key, url){ if (typeof CT_AUDIO_TRACKS !== 'undefined') CT_AUDIO_TRACKS[key] = url; }
  // A track just became available: if the base track for that situation is playing, swap.
  function refresh(){
    if (lastBase && typeof ctPlayMusic === 'function') ctPlayMusic(lastBase);
  }

  const oldPlay = window.ctPlayMusic;
  if (typeof oldPlay === 'function') {
    window.ctPlayMusic = function(key){
      if (FILES[key]) return oldPlay.call(this, key);           // a sequel key asked for directly
      lastBase = key;
      return oldPlay.call(this, chosen(key));
    };
  }

  // Fights: ctPlayMusic('combat') runs before the encounter is stored, so remember it first.
  const oldStartCombat = window.startCombat;
  if (typeof oldStartCombat === 'function') {
    window.startCombat = function(encounter){
      window.__ctLastEncounter = encounter || null;
      return oldStartCombat.apply(this, arguments);
    };
  }

  // The sequel splash plays the theme; closing it returns to whatever fits the screen.
  const oldShow = window.__ctShowCrimsonHorizonSplash;
  if (typeof oldShow === 'function') {
    window.__ctShowCrimsonHorizonSplash = function(){
      const r = oldShow.apply(this, arguments);
      if (available.ch_title === true && typeof window.ctPlayMusic === 'function') window.ctPlayMusic('ch_title');
      return r;
    };
  }
  const oldClose = window.__ctCloseCrimsonHorizonSplash;
  if (typeof oldClose === 'function') {
    window.__ctCloseCrimsonHorizonSplash = function(){
      const r = oldClose.apply(this, arguments);
      if (lastBase && typeof window.ctPlayMusic === 'function') window.ctPlayMusic(lastBase);
      return r;
    };
  }

  // The port screen's tabs: the Market tab has its own music.
  const oldSwitchPort = window.switchPortTab;
  if (typeof oldSwitchPort === 'function') {
    window.switchPortTab = function(){
      const r = oldSwitchPort.apply(this, arguments);
      try { if (sequelOn() && activeScreenId() === 'portScreen') window.ctPlayMusic('port'); } catch(e) {}
      return r;
    };
  }

  // Fair Tide tabs change the mood (the Pearl study, the quiet rooms).
  const oldSwitch = window.switchFairTideTab;
  if (typeof oldSwitch === 'function') {
    window.switchFairTideTab = function(){
      const r = oldSwitch.apply(this, arguments);
      try { if (sequelOn() && game.location === 'fair_tide' && activeScreenId() === 'fairTideScreen') window.ctPlayMusic('port'); } catch(e) {}
      return r;
    };
  }

  Object.keys(FILES).forEach(function(k){ probe(k); });
})();
