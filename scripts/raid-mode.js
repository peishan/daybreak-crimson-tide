(function(){
  // -------------------------------------------------------------------
  // RAID MODE — generalized from what was originally a Fountain-of-Youth-
  // only Guardian Trial flow, per San's own direction to turn that into
  // Crimson Tide's real, reusable Raid Mode system. Structurally modeled
  // on Daybreak's own Raid Mode (the RAIDS array + enterRaid/
  // startRaidStage/handleRaidVictory in game-121.js) — sequential
  // stages, partial (not full) recovery between them, no mid-run save,
  // first-clear-vs-reduced-repeat rewards, exactly matching that
  // template's own shape.
  //
  // RAIDS below is a real, multi-entry array now (not hardcoded to one
  // gauntlet) — the Guardian's Trial is currently the only entry, since
  // it's the only raid-shaped content that exists in this game yet, but
  // adding a second raid later is just adding a second array entry; the
  // execution functions (enterRaid/startRaidStage/handleRaidVictory
  // hook/completeRaid) are fully generic and read whichever raid was
  // entered.
  //
  // The Fountain's own effects (Rejuvenation, permanent stat bonus,
  // negative-effect restoration, dispatch squads) stay specific to that
  // one raid's completion — onComplete:'fountain' is the marker
  // completeRaid() checks before running Fountain-only logic. A future
  // raid with no onComplete marker just gets the generic XP/gold reward
  // split and nothing else, which is exactly what a plain raid should
  // do.
  // -------------------------------------------------------------------

  // === RAIDS ===
  const RAIDS = [
    {
      id: 'guardian_trial', name: "The Guardian's Trial", icon: '⏳', unlockLevel: 300,
      onComplete: 'fountain',
      desc: "An ancient keeper stands between the crew and the Fountain of Youth — not to punish them, but to find out whether they're capable of carrying what it offers.",
      stages: [
        { id: 1, type: 'elite', key: 'guardians_ward', name: "The Guardian's Ward", art: '🌫️',
          hp: 1600, dmg: 30, xp: 900, gold: 500,
          desc: "The first thing that meets you isn't the Guardian itself — just what it leaves standing watch. Nothing personal in it. Just a threshold, and whether you can cross one." },
        { id: 2, type: 'elite', key: 'trial_of_vitality', name: 'Trial of Vitality', art: '⌛',
          hp: 2100, dmg: 36, xp: 1200, gold: 700,
          desc: "This one tests something more specific than strength — whether you're still standing, still moving, still yourselves, by the time it's done with you." },
        { id: 3, type: 'boss', key: 'the_guardian', name: 'The Guardian', art: '⏳',
          hp: 3400, dmg: 46, xp: 2200, gold: 1300,
          desc: "It doesn't ask if you deserve this. It asks if you're capable of carrying it — and those have never been the same question." }
      ]
    }
  ];
  window.RAIDS = RAIDS;

  function getRaidById(id){ return RAIDS.find(function(r){ return r.id === id; }); }
  window.getRaidById = getRaidById;

  function isRaidUnlocked(raid){ return level() >= raid.unlockLevel; }
  window.isRaidUnlocked = isRaidUnlocked;

  const RAID_STAGE_RECOVERY_PCT = 0.25; // partial, not full — matches Raid Mode's own shape
  const RAID_REPEAT_REWARD_PCT = 0.25;  // matches Raid Mode's own first-clear-vs-repeat ratio exactly

  function raidCleared(id){ return !!(game.raidsCleared && game.raidsCleared[id]); }
  window.raidCleared = raidCleared;

  // === ENTRY / STAGE PROGRESSION — fully generic, reads whichever raid
  // was entered rather than any one hardcoded gauntlet. ===
  function enterRaid(raidId){
    const raid = getRaidById(raidId);
    if (!raid) return;
    if (!isRaidUnlocked(raid)) { toast('🔒 ' + raid.name + ' unlocks at Level ' + raid.unlockLevel + '.', 3200); return; }
    game.raid = { active: true, raidId: raidId, stageIndex: 0, participants: (game.fieldedIds || []).slice() };
    toast('🌀 Entering ' + raid.name + ' — ' + raid.stages.length + ' stages stand between the crew and the reward.', 3600);
    startRaidStage();
  }
  window.enterRaid = enterRaid;

  function startRaidStage(){
    const r = game.raid;
    if (!r || !r.active) return;
    const raid = getRaidById(r.raidId);
    if (!raid) { exitRaid(); return; }
    const stage = raid.stages[r.stageIndex];
    if (!stage) { exitRaid(); return; }
    const baseEnemy = { name: stage.name, art: stage.art, hp: stage.hp, dmg: stage.dmg, xp: stage.xp, gold: stage.gold, desc: stage.desc };
    const enemy = scaleCrimsonEnemy(baseEnemy, 'guardian', raid.unlockLevel);
    toast('⚔️ Stage ' + (r.stageIndex + 1) + '/' + raid.stages.length + ': ' + stage.name, 3200);
    startCombat({ kind: 'raid', key: stage.key, enemy: enemy, portId: null });
  }
  window.startRaidStage = startRaidStage;

  function exitRaid(){
    game.raid = { active: false, raidId: null, stageIndex: 0, participants: [] };
  }
  window.exitRaid = exitRaid;

  // Hooked into handleVictory the same accumulation-safe way every other
  // system in this codebase wraps it — checks enemy.kind so it only ever
  // fires for raid stages, never any other combat.
  const oldHandleVictoryForRaidMode = window.handleVictory;
  window.handleVictory = function(){
    if (oldHandleVictoryForRaidMode) oldHandleVictoryForRaidMode();
    const enemy = game.combatEnemy;
    const r = game.raid;
    if (!enemy || enemy.kind !== 'raid' || !r || !r.active) return;

    r.stageIndex++;
    const raid = getRaidById(r.raidId);
    if (!raid) { exitRaid(); return; }

    if (r.stageIndex >= raid.stages.length) {
      completeRaid(raid);
      return;
    }
    // Partial, not full, recovery between stages.
    game.fieldedIds.forEach(function(id){
      const member = ALL_PARTY.find(function(m){ return m.id === id; });
      if (!member) return;
      const maxHp = effectiveMaxHp(member);
      const maxMp = effectiveMaxMp(member);
      game.partyHp[id] = Math.min(maxHp, (game.partyHp[id] || 0) + Math.round(maxHp * RAID_STAGE_RECOVERY_PCT));
      game.partyMp[id] = Math.min(maxMp, (game.partyMp[id] || 0) + Math.round(maxMp * RAID_STAGE_RECOVERY_PCT));
    });
    toast('💨 A brief respite — the crew recovers ' + Math.round(RAID_STAGE_RECOVERY_PCT * 100) + '% before the next stage.', 3200);
    setTimeout(startRaidStage, 600);
  };

  function completeRaid(raid){
    const r = game.raid;
    game.raidsCleared = game.raidsCleared || {};
    const firstClear = !game.raidsCleared[raid.id];
    game.raidsCleared[raid.id] = true;
    const participants = (r && r.participants) ? r.participants : (game.fieldedIds || []);

    exitRaid();

    const rewardMult = firstClear ? 1 : RAID_REPEAT_REWARD_PCT;
    const totalXp = raid.stages.reduce(function(s,st){ return s+st.xp; }, 0);
    const totalGold = raid.stages.reduce(function(s,st){ return s+st.gold; }, 0);
    gainXP(Math.round(totalXp * rewardMult));
    game.gold = (game.gold || 0) + Math.round(totalGold * rewardMult);

    if (raid.onComplete === 'fountain') {
      completeFountainOfYouth(participants, firstClear);
    } else if (firstClear) {
      toast('🏆 RAID CLEARED: ' + raid.name + '!', 3800);
    } else {
      toast('🏆 ' + raid.name + ' cleared again — training complete.', 3600);
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  }
  window.completeRaid = completeRaid;

  function renderRaidSelectPanel(){
    let html = '<div class="panel-title">⏳ Raids</div>';
    RAIDS.forEach(function(raid){
      const unlocked = isRaidUnlocked(raid);
      const cleared = raidCleared(raid.id);
      html += '<article class="quest-item" style="' + (unlocked ? '' : 'opacity:.55;') + '"><div style="display:flex;gap:10px;align-items:flex-start;">'+
        '<div style="font-size:1.4rem;">'+raid.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(raid.name)+'</strong>'+(cleared ? ' <span class="story-chip">✓ Cleared</span>' : '')+'<br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(raid.desc)+'</span><br>'+
        '<span style="font-size:.72rem;opacity:.55;">'+raid.stages.length+' stages · unlocks Level '+raid.unlockLevel+'</span>'+
        '</div></div>'+
        (unlocked ? '<button class="btn btn-small" onclick="enterRaid(\''+raid.id+'\')" style="margin-top:6px;">'+(cleared ? '🔁 Re-enter (Training)' : '⚔️ Enter Raid')+'</button>'
                   : '<div style="font-size:.72rem;opacity:.55;margin-top:6px;">🔒 Locked</div>')+
        '</article>';
    });
    return html;
  }
  window.renderRaidSelectPanel = renderRaidSelectPanel;

  // -------------------------------------------------------------------
  // FOUNTAIN OF YOUTH — the Guardian's Trial raid's own completion
  // effect. Everything below this point is specific to that one raid,
  // not generic to Raid Mode as a whole.
  // -------------------------------------------------------------------

  const REJUVENATION_HP_BONUS = 40;
  const REJUVENATION_MP_BONUS = 15;

  function isRejuvenated(id){ return !!(game.rejuvenated && game.rejuvenated[id]); }
  window.isRejuvenated = isRejuvenated;

  function rejuvenationHpBonus(id){ return isRejuvenated(id) ? REJUVENATION_HP_BONUS : 0; }
  function rejuvenationMpBonus(id){ return isRejuvenated(id) ? REJUVENATION_MP_BONUS : 0; }
  window.rejuvenationHpBonus = rejuvenationHpBonus;
  window.rejuvenationMpBonus = rejuvenationMpBonus;

  const oldEffectiveMaxHpForFountain = window.effectiveMaxHp;
  window.effectiveMaxHp = function(m){
    const base = oldEffectiveMaxHpForFountain(m);
    return base + rejuvenationHpBonus(m.id);
  };
  const oldEffectiveMaxMpForFountain = window.effectiveMaxMp;
  window.effectiveMaxMp = function(m){
    const base = oldEffectiveMaxMpForFountain(m);
    return base + rejuvenationMpBonus(m.id);
  };

  // Future hook — restoration for permanent negative effects. Deliberately
  // empty; add {flag, label} entries here once such an effect exists.
  const CURABLE_NEGATIVE_EFFECTS = [];
  window.CURABLE_NEGATIVE_EFFECTS = CURABLE_NEGATIVE_EFFECTS;

  function clearCurableNegativeEffects(memberIds){
    const cleared = [];
    CURABLE_NEGATIVE_EFFECTS.forEach(function(effect){
      memberIds.forEach(function(id){
        game[effect.flag] = game[effect.flag] || {};
        if (game[effect.flag][id]) {
          game[effect.flag][id] = false;
          cleared.push(effect.label);
        }
      });
    });
    return cleared;
  }
  window.clearCurableNegativeEffects = clearCurableNegativeEffects;

  function completeFountainOfYouth(participants, firstClear){
    game.rejuvenated = game.rejuvenated || {};
    const newlyRejuvenated = [];
    if (firstClear) {
      participants.forEach(function(id){
        if (!game.rejuvenated[id]) {
          game.rejuvenated[id] = true;
          newlyRejuvenated.push(id);
        }
      });
    }
    const curedEffects = clearCurableNegativeEffects(participants);

    if (firstClear) {
      const names = newlyRejuvenated.map(function(id){
        const m = ALL_PARTY.find(function(x){ return x.id === id; });
        return m ? m.name : id;
      }).join(', ');
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({
        title: '💧 The Fountain of Youth',
        blurb: "The Guardian falls still. What's left behind isn't a door so much as an invitation — the Fountain itself, exactly where the old records said it would be.<br><br>" +
          (names ? names + ' step forward, and something changes. Not a different person. Just a body given another chance to carry the person who\'s already there.<br><br>' : '') +
          (curedEffects.length ? 'Whatever they were carrying that shouldn\'t have been permanent — isn\'t, anymore.<br><br>' : '') +
          "The Fountain keeps flowing behind them, and will keep flowing long after they leave. Nothing about it needs using twice to matter once."
      });
      toast('✨ Rejuvenation granted: ' + (names || 'no eligible participants'), 4200);
    } else {
      toast('🏆 The Guardian\'s Trial cleared again — training complete.', 3600);
      if (curedEffects.length) toast('✨ Restoration: ' + curedEffects.join(', '), 3600);
    }
  }
  window.completeFountainOfYouth = completeFountainOfYouth;

  // === DISPATCH SQUADS — passive, story-serving sends for crew who were
  // never part of the player-controlled active party (Ser Aldric, Sister
  // Wren, etc.). Same durationDays/game.day tick pattern already proven
  // in the Arc XVII Research system. Specific to the Fountain raid. ===
  const DISPATCH_DURATION_DAYS = 6;

  function dispatchToFountain(memberIds){
    if (!raidCleared('guardian_trial')) { toast('🔒 The Fountain has to be found the first time before anyone else can be sent there.', 3600); return; }
    game.fountainDispatch = game.fountainDispatch || {};
    const alreadyRejuvenated = memberIds.filter(function(id){ return isRejuvenated(id); });
    const alreadyDispatched = memberIds.filter(function(id){ return game.fountainDispatch[id] && !game.fountainDispatch[id].complete; });
    const eligible = memberIds.filter(function(id){ return !isRejuvenated(id) && !(game.fountainDispatch[id] && !game.fountainDispatch[id].complete); });
    if (!eligible.length) {
      if (alreadyRejuvenated.length) toast('Already rejuvenated — no need to send them again.', 3200);
      else if (alreadyDispatched.length) toast('Already on their way to the Fountain.', 3200);
      return;
    }
    eligible.forEach(function(id){
      game.fountainDispatch[id] = { startedDay: game.day || 0, durationDays: DISPATCH_DURATION_DAYS, complete: false };
    });
    toast('🚶 Sent to the Fountain: ' + eligible.length + ' — back in ' + DISPATCH_DURATION_DAYS + ' days.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  }
  window.dispatchToFountain = dispatchToFountain;

  function checkFountainDispatches(){
    if (!game.fountainDispatch) return;
    const nowDay = game.day || 0;
    game.rejuvenated = game.rejuvenated || {};
    Object.keys(game.fountainDispatch).forEach(function(id){
      const d = game.fountainDispatch[id];
      if (!d || d.complete) return;
      if (nowDay - d.startedDay >= d.durationDays) {
        d.complete = true;
        game.rejuvenated[id] = true;
        clearCurableNegativeEffects([id]);
        const member = ALL_PARTY.find(function(m){ return m.id === id; });
        toast('✨ ' + (member ? member.name : id) + ' returns from the Fountain, rejuvenated.', 3800);
      }
    });
  }
  window.checkFountainDispatches = checkFountainDispatches;

  const oldSyncArc1ForFountainDispatch = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForFountainDispatch) oldSyncArc1ForFountainDispatch();
    checkFountainDispatches();
  };

  // Renders the Raid Mode selection panel on the Archive screen —
  // consistent with where every other standalone system built this
  // session (Council, Factions, Security Log) already lives.
  const oldRenderArchiveScreenForRaidMode = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForRaidMode) oldRenderArchiveScreenForRaidMode();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('raidModePanelWrap');
    if (existing) existing.remove();
    container.insertAdjacentHTML('beforeend', '<div id="raidModePanelWrap">'+renderRaidSelectPanel()+'</div>');
  };
})();
