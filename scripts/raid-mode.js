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
  // RAIDS below is a real, multi-entry array — six tiers now, the full
  // ladder San asked to have built out, each unlocking at a higher level
  // than the last and drawing its theme from a thread the story's already
  // pulled on (the endless captain pool, the Archive, the five harbours
  // Arc XVI built trust with, the inter-world crossings) rather than
  // anything invented from nothing. Adding a seventh tier later is just
  // adding a seventh array entry; the execution functions (enterRaid/
  // startRaidStage/handleRaidVictory hook/completeRaid) are fully generic
  // and read whichever raid was entered — none of them needed to change
  // to support this.
  //
  // Level curve: every current story arc gates at or below 345 (Arc
  // XXIII, the highest), so unlockLevel 300-500 here is genuine post-game
  // content, same relationship Daybreak's own raid ladder (game-121.js)
  // has to its own story gates. Only guardian_trial carries an
  // onComplete marker — the other five are plain raids, first-clear
  // XP/gold reward with no special completion effect, exactly what a
  // raid with no onComplete should do.
  //
  // The Fountain's own effects (Rejuvenation, permanent stat bonus,
  // negative-effect restoration, dispatch squads) stay specific to that
  // one raid's completion — onComplete:'fountain' is the marker
  // completeRaid() checks before running Fountain-only logic. A future
  // raid with no onComplete marker just gets the generic XP/gold reward
  // split and nothing else, which is exactly what a plain raid should
  // do.
  //
  // FUTURE HOOK (San's own note): the Fountain is meant to get a reason to
  // come back later — a future arc visiting an undead world (maybe tombs)
  // is expected to inflict something a normal cure can't touch, and the
  // plan is for the crew to return here for restoration rather than that
  // becoming its own separate system. See CURABLE_NEGATIVE_EFFECTS below,
  // where this is expanded on.
  // -------------------------------------------------------------------

  // === RAIDS ===
  const RAIDS = [
    {
      id: 'guardian_trial', name: "The Guardian's Trial", icon: '⏳', unlockLevel: 300,
      onComplete: 'fountain',
      // Solely a gameplay mechanic (San's direction): Level 300 alone
      // unlocks this, with no story-chapter dependency at all. An earlier
      // pass briefly chapter-gated this against Arc XIX Ch.13, but no
      // chapter art for that exists — reverted so the Fountain stays
      // reachable purely by leveling up, same as every other raid here.
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
    },
    {
      id: 'captains_unending', name: "The Captains Who Don't Stop Coming", icon: '🏴‍☠️', unlockLevel: 340,
      desc: "The fixed names ran out a long time ago. Whatever's left isn't organized, exactly — but it keeps finding replacements, and it hasn't run out yet.",
      stages: [
        { id: 1, type: 'elite', key: 'unclaimed_flotilla', name: 'An Unclaimed Flotilla', art: '🚩',
          hp: 2200, dmg: 34, xp: 1300, gold: 700,
          desc: "No captain's flag flies over this one — just whoever grabbed the wheel when the last one didn't come back." },
        { id: 2, type: 'elite', key: 'the_replacement_captains', name: 'The Replacement Captains', art: '🗡️',
          hp: 2900, dmg: 40, xp: 1700, gold: 950,
          desc: "Three of them, none of them named on any list Aisyah's ever kept. That's rather the point." },
        { id: 3, type: 'boss', key: 'whatever_holds_the_line', name: 'Whatever Holds the Line', art: '🗺️',
          hp: 4800, dmg: 52, xp: 3000, gold: 1700,
          desc: "Not a captain. Just the thing that keeps the endless pool endless — recruiting, replacing, never once running out of names to put behind a wheel." }
      ]
    },
    {
      id: 'archive_depths', name: 'What the Archive Kept Back', icon: '📜', unlockLevel: 380,
      desc: "Every record the Archive ever surfaced came from somewhere. Somewhere further down, apparently, is still full.",
      stages: [
        { id: 1, type: 'elite', key: 'unfiled_record', name: 'An Unfiled Record', art: '📖',
          hp: 3400, dmg: 48, xp: 2400, gold: 1400,
          desc: 'Something that was never catalogued, reacting badly to finally being read.' },
        { id: 2, type: 'elite', key: 'the_uncrossreferenced', name: 'The Uncross-Referenced', art: '🕸️',
          hp: 4300, dmg: 55, xp: 3000, gold: 1750,
          desc: "Erynn's own words, thrown back at the crew: \"It's not on any map we have.\" Neither is this." },
        { id: 3, type: 'boss', key: 'the_first_archivist', name: 'The First Archivist', art: '🏛️',
          hp: 7000, dmg: 70, xp: 5200, gold: 3000,
          desc: "Older than Varel Farseer's own name. It didn't build the Archive to be found. It built it to be kept." }
      ]
    },
    {
      id: 'five_harbours_reckoning', name: 'The Five Harbours, Together', icon: '🌍', unlockLevel: 420,
      desc: "Forest Coast, Dragon Coast, Mountain Port, Crystal Coast, Old Harbour — five worlds the crew earned trust in, one honest relationship at a time. This is what happens when all five call in the same favor at once.",
      stages: [
        { id: 1, type: 'elite', key: 'the_five_wardens', name: 'The Five Wardens', art: '🐉',
          hp: 5200, dmg: 62, xp: 4200, gold: 2400,
          desc: "Not enemies. Not quite allies either — five different kinds of \"we still have to be sure.\"" },
        { id: 2, type: 'elite', key: 'what_the_harbours_protect', name: 'What the Harbours Protect', art: '💎',
          hp: 6300, dmg: 68, xp: 5000, gold: 2900,
          desc: 'The actual reason each of these places is guarded at all, finally standing where the crew can see it.' },
        { id: 3, type: 'boss', key: 'the_old_moon_beasts_kin', name: "The Old Moon Beast's Kin", art: '🌕',
          hp: 9500, dmg: 85, xp: 7800, gold: 4500,
          desc: 'Not the one the crew already met and left in peace. An older relative, from before any of the five harbours had a name.' }
      ]
    },
    {
      id: 'beyond_every_door', name: 'Beyond Every Door', icon: '🌌', unlockLevel: 460,
      desc: "Every inter-world crossing so far led somewhere the crew could eventually make sense of. This one doesn't resolve that easily.",
      stages: [
        { id: 1, type: 'elite', key: 'something_that_moved_wrong_again', name: 'Something That Moved Wrong, Again', art: '👁️',
          hp: 7200, dmg: 95, xp: 6600, gold: 3800,
          desc: "Erynn's read on it: the same kind of wrong as the first thing the crew ever met past the Horizon Engine's door. Just more of it, this time." },
        { id: 2, type: 'elite', key: 'a_door_with_no_other_side', name: 'A Door With No Other Side', art: '🚪',
          hp: 8600, dmg: 105, xp: 7900, gold: 4500,
          desc: 'It opens. Nothing closes behind it. Renn stops trying to explain why.' },
        { id: 3, type: 'boss', key: 'the_space_between_worlds', name: 'The Space Between Worlds', art: '🌌',
          hp: 12500, dmg: 130, xp: 11500, gold: 6600,
          desc: "Not a place. Not exactly a creature either. Whatever it actually is, it noticed the crew long before the crew noticed it." }
      ]
    },
    {
      id: 'where_every_tide_meets', name: 'Where Every Tide Meets', icon: '🌐', unlockLevel: 500,
      desc: "Beyond the Horizon, the Archive, the five harbours, the endless pool of captains, the Fountain itself — every thread the crew has ever pulled, converging at once. Nobody built this on purpose. It's just what's left once you've pulled on enough of them.",
      stages: [
        { id: 1, type: 'elite', key: 'everything_the_crew_has_faced', name: 'Everything the Crew Has Faced', art: '⚔️',
          hp: 14000, dmg: 150, xp: 14000, gold: 8000,
          desc: 'Not new. Old shapes, familiar dangers, arriving together instead of one at a time.' },
        { id: 2, type: 'elite', key: 'everything_still_arriving', name: 'Everything Still Arriving', art: '🌊',
          hp: 16500, dmg: 165, xp: 16500, gold: 9500,
          desc: "What comes after the familiar shapes run out and the unfamiliar ones don't stop." },
        { id: 3, type: 'boss', key: 'where_every_tide_meets_boss', name: 'Where Every Tide Meets', art: '🌐',
          hp: 24000, dmg: 210, xp: 24000, gold: 14000,
          desc: "San doesn't get a clean answer for what this actually is. Just proof that the crew can still stand in front of it." }
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

  // BUG FIX (design doc's own "Guardian Failure" rule — no permanent
  // Fountain punishment, normal combat failure rules apply): nothing was
  // resetting game.raid on a lost stage fight. handleDefeat() already
  // clears game.uncharted.active the same way on a lost Reach wave — this
  // is that same pattern for raids. Without it, game.raid.active would
  // stay stuck true forever after any raid defeat, silently corrupting
  // every future raid entry/stage-progress check.
  const oldHandleDefeatForRaidMode = window.handleDefeat;
  window.handleDefeat = function(){
    const enemy = game.combatEnemy;
    const wasRaid = !!(enemy && enemy.kind === 'raid' && game.raid && game.raid.active);
    if (oldHandleDefeatForRaidMode) oldHandleDefeatForRaidMode();
    if (wasRaid) exitRaid();
  };

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

  // Percentage-based, not a flat number — San's own confirmed direction
  // after reconsidering the original flat +40/+15: a flat bonus is
  // meaningful early and negligible late, since it never scales with
  // the receiving character's own growing stats. A percentage of the
  // character's own max HP/MP stays proportionally consistent at any
  // point in the game and matches the design doc's own instruction to
  // keep this modest by construction, not by a guessed flat value.
  const REJUVENATION_HP_PCT = 0.06;
  const REJUVENATION_MP_PCT = 0.06;

  function isRejuvenated(id){ return !!(game.rejuvenated && game.rejuvenated[id]); }
  window.isRejuvenated = isRejuvenated;

  // Takes the already-computed base value rather than calling
  // effectiveMaxHp/Mp itself — those are exactly what this function
  // feeds into below, so calling them again from in here would recurse
  // into this same wrap.
  function rejuvenationHpBonus(id, baseValue){ return isRejuvenated(id) ? Math.round(baseValue * REJUVENATION_HP_PCT) : 0; }
  function rejuvenationMpBonus(id, baseValue){ return isRejuvenated(id) ? Math.round(baseValue * REJUVENATION_MP_PCT) : 0; }
  window.rejuvenationHpBonus = rejuvenationHpBonus;
  window.rejuvenationMpBonus = rejuvenationMpBonus;

  const oldEffectiveMaxHpForFountain = window.effectiveMaxHp;
  window.effectiveMaxHp = function(m){
    const base = oldEffectiveMaxHpForFountain(m);
    return base + rejuvenationHpBonus(m.id, base);
  };
  const oldEffectiveMaxMpForFountain = window.effectiveMaxMp;
  window.effectiveMaxMp = function(m){
    const base = oldEffectiveMaxMpForFountain(m);
    return base + rejuvenationMpBonus(m.id, base);
  };

  // Restoration for permanent negative effects the Fountain clears.
  // `affects` scopes each effect to who actually has it — San's PCOS is
  // hers alone, not something Joel or anyone else in the crew carries, so
  // clearing it never touches another character's state. Each flag starts
  // undefined and is lazily treated as "has the condition" the first time
  // it's checked for someone on that effect's affects list — no separate
  // save-file initializer needed, and nobody not on the list is ever
  // affected at all.
  //
  // FUTURE HOOK (San's own note): this is also the intended place to hang
  // restoration from whatever an undead world (and maybe tombs) inflicts,
  // once a future arc actually visits one — a curse, a lingering undeath
  // effect, something a normal cure can't touch. Same shape applies: add
  // an entry here with its own flag/label/affects list, and the Fountain
  // clears it exactly like it clears PCOS today. No new plumbing needed
  // when that arc arrives, just a new array entry.
  const CURABLE_NEGATIVE_EFFECTS = [
    { flag: 'sanPCOS', label: 'PCOS', affects: ['san'] }
  ];
  window.CURABLE_NEGATIVE_EFFECTS = CURABLE_NEGATIVE_EFFECTS;

  function clearCurableNegativeEffects(memberIds){
    const cleared = [];
    CURABLE_NEGATIVE_EFFECTS.forEach(function(effect){
      game[effect.flag] = game[effect.flag] || {};
      memberIds.forEach(function(id){
        if (effect.affects.indexOf(id) === -1) return;
        if (game[effect.flag][id] === undefined) game[effect.flag][id] = true;
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
