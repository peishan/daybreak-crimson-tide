(function(){
  // -------------------------------------------------------------------
  // ARC XXXVIII MECHANICS — ARCHIVE GUARDIAN ENCOUNTERS and the Bond
  // Resonance tie-in, the gameplay Ch.6/12/18/23 and Ch.21/23's own
  // notes call for. Kept OUT of arc38.js itself, same split used since
  // Arc XXIII.
  //
  //   1. ARCHIVE GUARDIAN ENCOUNTERS — per the outline's own explicit
  //      instruction, these are narrative encounter labels, not four
  //      newly required bosses: no new combat system, no new enemy
  //      pool, no new raid. Each fight reuses the exact same pieces
  //      Arc IX's own Ch.12 guardian fight established as the pattern
  //      for a one-off, non-repeatable, story-gated boss (scaleCrimson-
  //      Enemy(def, 'guardian', pinnedLevel) + startCombat) — the same
  //      'guardian' scaling curve every other guardian fight in this
  //      game already uses (Arc I's port guardians, the Fountain's
  //      Guardian Trial raid). The only new piece is a single shared
  //      kind, 'archive_guardian', so core-engine.js's post-battle
  //      branch can route the exit back to the Archive screen via the
  //      SAME exitRaidBattleToArchive() the Guardian's Trial raid
  //      already built for exactly this (goScreen('archive') instead of
  //      exitBattleToPort()'s "Return to Port," which isn't where any
  //      of these fights were entered from) -- one shared branch for
  //      all four fights, not four separate ones.
  //
  //      Pinned to level 570 (this arc's own gate), the same way Arc
  //      IX's Ch.12 fight pinned to Arc IX's own gate (135) rather than
  //      the player's current level -- keeps a late-rejoining or very
  //      overleveled player from trivializing a story beat, while a
  //      player arriving right on schedule fights it at full intended
  //      difficulty. Base stats step up across the four fights
  //      (Unwritten -> Divergence -> Possibility -> Boundary), landing
  //      well under the raid tier at this level (raid-mode.js's own
  //      level-500 raid bosses run 14,000-24,000 base HP) since these
  //      are mandatory story content, not optional endgame challenge
  //      runs -- closer to a level-300-ish raid's own weight, which is
  //      still a real fight for a level-570 party, just not a brick wall.
  //
  //   2. BOND RESONANCE — a single addition to the SAME hidden San &
  //      Joel stat Arc XXXVII's own bondResonanceState() already
  //      tracks, bumped at Ch.21 ("A Different Kind of Home") per the
  //      outline's own note that this "continues naturally through
  //      shared experiences." No new panel, no new tier table -- Arc
  //      XXXVII's own renderBondResonancePanel() already renders
  //      whatever the total becomes. Per the outline's explicit
  //      restraint, this never names or implies Thought Resonance
  //      (locked until Arc XL).
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. ARCHIVE GUARDIAN ENCOUNTERS
  // ===========================================================================
  const ARC38_GUARDIAN_LEVEL = 570;

  const ARC38_GUARDIANS = {
    6: {
      key: 'guardian_of_the_unwritten',
      enemy: { name: 'Guardian of the Unwritten', icon: '📜', hp: 1800, dmg: 55, xp: 950, gold: 480,
        desc: 'Protects a collection the Archive never meant to surface — not out of malice, just the same instinct that keeps an unfinished thought from being read aloud before it\'s ready.' }
    },
    12: {
      key: 'guardian_of_divergence',
      enemy: { name: 'Guardian of Divergence', icon: '🕸️', hp: 2300, dmg: 62, xp: 1150, gold: 580,
        desc: 'Older records, older guardian. It doesn\'t ask whether the crew is ready to know more. It only asks whether they can actually hold what they already know.' }
    },
    18: {
      key: 'guardian_of_possibility',
      enemy: { name: 'Guardian of Possibility', icon: '🔮', hp: 2800, dmg: 70, xp: 1400, gold: 700,
        desc: 'The last thing standing between the crew and the final collection -- a test of whether they can still tell an observed history from an unrealized one, this deep in.' }
    },
    23: {
      key: 'keeper_of_the_boundary',
      enemy: { name: 'Keeper of the Boundary', icon: '🌌', hp: 3400, dmg: 80, xp: 1800, gold: 900,
        desc: 'Not guarding one more record. Guarding the line itself -- between everything the crew has observed, and the reality they actually have to go on living in.' }
    }
  };
  window.ARC38_GUARDIANS = ARC38_GUARDIANS;

  window.startArc38GuardianBattle = function(chapterId){
    const def = ARC38_GUARDIANS[chapterId];
    if (!def) return;
    if (game.comicProgress38?.[chapterId]) { toast('✓ Already complete.'); return; }
    if (window.arc38ObjectiveState() !== 'complete_arc38_chapter_' + chapterId) { toast('🔒 Follow the current Objective first.'); return; }
    const enemy = scaleCrimsonEnemy(def.enemy, 'guardian', ARC38_GUARDIAN_LEVEL);
    startCombat({ kind: 'archive_guardian', key: def.key, enemy: enemy });
  };

  // Each Ch.6/12/18/23 chapter action calls this first instead of going
  // straight to markArc38ChapterRead -- the fight has to be won before
  // the chapter (and its story beat) can actually complete. Mirrors the
  // exact gating Arc IX's own Ch.12 uses: the chapter's own "action"
  // button is swapped out for this while the fight is still pending,
  // and markArc38ChapterRead reads the normal way once it's won.
  window.arc38ChapterNeedsGuardian = function(chapterId){
    return !!ARC38_GUARDIANS[chapterId] && !(game.comicProgress38 && game.comicProgress38[chapterId]);
  };

  // handleVictory (core-engine.js) only has the enemy.key it fought, not
  // which chapter launched it -- this reverses ARC38_GUARDIANS to find
  // it, so the win handler can call back into arc38.js's own
  // markArc38ChapterRead() rather than duplicating its completion logic.
  window.arc38ChapterIdForGuardianKey = function(key){
    const match = Object.keys(ARC38_GUARDIANS).find(function(chId){ return ARC38_GUARDIANS[chId].key === key; });
    return match ? Number(match) : null;
  };

  // ===========================================================================
  // 2. BOND RESONANCE — single tie-in, reusing Arc XXXVII's own state.
  // ===========================================================================
  const oldSyncArc1ForArc38 = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForArc38) oldSyncArc1ForArc38();
    const cp = game.comicProgress38;
    if (!cp) return;

    if (cp[21] && typeof window.bondResonanceState === 'function') {
      if (!game.bondResonanceSyncedChapters) game.bondResonanceSyncedChapters = {};
      if (!game.bondResonanceSyncedChapters['arc38_ch21']) {
        game.bondResonanceSyncedChapters['arc38_ch21'] = true;
        window.bondResonanceState().points += 10;
      }
    }

    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };
})();
