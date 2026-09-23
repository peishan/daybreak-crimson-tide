
(function(){
  // -------------------------------------------------------------------
  // ACHIEVEMENTS. Pure recognition, no mechanical reward — matching
  // standard genre convention. Each check function reads existing,
  // already-verified game state rather than introducing new tracking:
  // rival capture (V131/132), companion recruitment (game.foundCompanions,
  // the same flag memberUnlocked() itself reads), and the Bond system's
  // own San/Joel unlock beat (Arc V Ch.4, "Bonded by the Tide").
  //
  // "The Crew Assembles" is scoped to the core canonical cast per San's
  // own earlier reference sheet — San, Joel, Aisyah, Mez, Eliz, Senedra,
  // Zaki, Renn, Erynn, Mimi, Soel — not the additional side-recruits
  // (Iris, KW Liang, Dr. AA, Brada Shah, Ser Aldric, Sister Wren).
  // Flagged as an assumption, easy to widen if San meant everyone.
  //
  // "Romance path unlocked" uses the story beat itself (Arc V Ch.4
  // complete) rather than window.bondTier('san_joel') >= 1 — the latter
  // also requires having actually spent bond points at least once,
  // which felt like an unnecessary extra gate for what's fundamentally
  // a story-milestone achievement, not a mechanical one.
  // -------------------------------------------------------------------
  const CORE_CREW_IDS = ['joel','aisyah','mezstorm','eliz','senedra','zaki','renn','erynn','mimi','soel'];

  function crewAssembled(){
    return CORE_CREW_IDS.every(function(id){
      if (id === 'soel') return (typeof level === 'function' ? level() : 0) >= 10;
      return !!(game.foundCompanions && game.foundCompanions[id]);
    });
  }

  const ACHIEVEMENTS = [
    {id:'old_scores_settled', name:'Old Scores Settled', icon:'🏴‍☠️', desc:"Robin's community service finally started.",
      check: function(){ return !!(game.rivalsCaptured && game.rivalsCaptured.robin); }},
    {id:'no_more_excuses', name:'No More Excuses', icon:'🏴‍☠️', desc:'Jeff ran out of ways to avoid it.',
      check: function(){ return !!(game.rivalsCaptured && game.rivalsCaptured.jeff); }},
    {id:'first_mate', name:'First Mate', icon:'⚔️', desc:'Joel joined the crew.',
      check: function(){ return !!(game.foundCompanions && game.foundCompanions.joel); }},
    {id:'crew_assembled', name:'The Crew Assembles', icon:'⚓', desc:'The core crew is complete.',
      check: crewAssembled},
    {id:'bonded_by_the_tide', name:'Bonded by the Tide', icon:'💞', desc:"San and Joel's bond became something real.",
      check: function(){ return !!(game.comicProgress5 && game.comicProgress5[4]); }},
    {id:'a_debt_repaid', name:'A Debt Repaid', icon:'🧭', desc:'Lewis joined the fleet as an ally captain.',
      check: function(){ return !!game.lewisAllyCaptain; }},
    {id:'a_world_of_its_own', name:'A World of Its Own', icon:'⚓', desc:'The Unknown Harbour was found — the first place that runs by its own rules, not Veyren\'s.',
      check: function(){ return !!game.harbourDiscovered; }},
    {id:'people_beneath_the_tide', name:'People Beneath the Tide', icon:'🌊', desc:'The sea was not empty after all.',
      check: function(){ return !!game.tideNetworkDiscovered; }},
    {id:'a_different_shape', name:'A Different Shape', icon:'🐾', desc:'A different shape doesn\'t mean a different person.',
      check: function(){ return !!game.clanSettlementDiscovered; }},
    {id:'the_archive_remembers', name:'The Archive Remembers', icon:'🏛️', desc:'A structure suspended beyond the boundary, still transmitting after everything else fell silent.',
      check: function(){ return !!game.archiveDiscovered; }},
    {id:'at_least_you_learned_now', name:'At Least You Learned Now', icon:'❤️', desc:'A disagreement, worked all the way through — and the bond held, stronger for it.',
      check: function(){ return !!(game.sanJoelDisagreement && game.sanJoelDisagreement.learnedFlags && game.sanJoelDisagreement.learnedFlags.indexOf('joel_can_challenge_san') !== -1); }},
    {id:'a_trusted_name', name:'A Trusted Name', icon:'🤝', desc:'The Harbour stopped treating the crew like strangers.',
      check: function(){ return !!(typeof window.harbourState === 'function' && window.harbourState().sections && window.harbourState().sections.trade); }},
    {id:'borrowed_time', name:'Borrowed Time', icon:'⏳', desc:'The Fountain of Youth was used for the first time. San is not quite the age she was.',
      check: function(){ return !!(game.fountainPrestige && game.fountainPrestige.count >= 1); }},
    {id:'the_last_ship_shell_need', name:"The Last Ship She'll Ever Need", icon:'⭐', desc:'The Aethon\'s Pride. By the time San sails this one, her name is already legend.',
      check: function(){ return !!(typeof currentVessel === 'function' && currentVessel().id === 'aethons_pride'); }},
    {id:'someone_belonging', name:'Someone Belonging', icon:'👤', desc:'Not a chosen hero — just someone the Archive finally recognized as its own.',
      check: function(){ return !!(game.comicProgress17 && game.comicProgress17[23]); }}
  ];
  window.ACHIEVEMENTS = ACHIEVEMENTS;

  function achievementRegistry(){ game.achievementsUnlocked = game.achievementsUnlocked || {}; return game.achievementsUnlocked; }
  window.achievementRegistry = achievementRegistry;

  window.checkAchievements = function(){
    const reg = achievementRegistry();
    ACHIEVEMENTS.forEach(function(a){
      if (reg[a.id]) return; // already earned, nothing to do
      if (!a.check()) return;
      reg[a.id] = { day: game.day || 0 };
      toast('🏆 Achievement unlocked: ' + a.name, 4200);
      logEvent('🏆 Achievement unlocked: ' + a.icon + ' ' + a.name + ' — ' + a.desc, 'gold');
      if (typeof showStoryModal === 'function') {
        setTimeout(function(){
          showStoryModal({ title: '🏆 ' + a.name, blurb: a.desc });
        }, 400);
      }
    });
  };

  const oldRenderMainGoalForAchievements = window.renderMainGoal;
  window.renderMainGoal = function(){
    if (oldRenderMainGoalForAchievements) oldRenderMainGoalForAchievements();
    window.checkAchievements();
  };

  window.renderAchievementsScreen = function(){
    const container = document.getElementById('achievementsContent');
    if (!container) return;
    const reg = achievementRegistry();
    const earnedCount = ACHIEVEMENTS.filter(a => reg[a.id]).length;
    let html = '<div class="panel"><div class="panel-title">🏆 '+earnedCount+' / '+ACHIEVEMENTS.length+' Earned</div></div>';
    ACHIEVEMENTS.forEach(function(a){
      const earned = !!reg[a.id];
      html += '<article class="quest-item'+(earned?' completed':'')+'" style="'+(earned?'':'opacity:.5;')+'">'+
        '<strong>'+(earned?a.icon:'❔')+' '+(earned?a.name:'???')+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+(earned?a.desc:'Not yet earned.')+'</span>'+
        (earned && reg[a.id].day ? '<br><span style="font-size:.72rem;opacity:.6;">Day '+reg[a.id].day+'</span>' : '')+
        '</article>';
    });
    container.innerHTML = html;
  };

  const oldGoScreenForAchievements = window.goScreen;
  window.goScreen = function(name){
    if (oldGoScreenForAchievements) oldGoScreenForAchievements(name);
    if (name === 'achievements' && typeof window.renderAchievementsScreen === 'function') window.renderAchievementsScreen();
  };
})();
