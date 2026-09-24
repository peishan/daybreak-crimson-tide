(function(){
  // -------------------------------------------------------------------
  // CRYSTAL COAST + OLD HARBOUR — harbours 4 and 5, completing Arc XVI's
  // five-harbour progression. Same shared makeHarbourModule() factory as
  // Dragon Coast/Mountain Port, so this file only needs to supply the
  // config differences (theming, discovery chapter, enemy pool) — the
  // actual mechanics are identical across all five locations by
  // construction, not by careful copy-pasting.
  //
  // Discovery: game.crystalCoastDiscovered at Ch.19, game.oldHarbour
  // Discovered at Ch.23 (arc16-and-bonding.js). Requires
  // arc16-dragon-mountain.js to have already loaded (for
  // window.makeHarbourModule) — see its script tag order in index.html.
  // -------------------------------------------------------------------

  // -----------------------------------------------------------------
  // CRYSTAL COAST — Ch.19-22. "Where the resource finally surfaces —
  // and where a different kind of exchange becomes possible."
  // -----------------------------------------------------------------
  window.makeHarbourModule({
    stateKey: 'crystalCoastState', stateFn: 'crystalCoastState',
    discoveredFlag: 'crystalCoastDiscovered', unlockedFn: 'crystalCoastUnlocked',
    migrationChapter: 19,
    unlockSectionFn: 'unlockCrystalCoastSection', setNameFn: 'setCrystalCoastName',
    advanceRelFn: 'advanceCrystalCoastRelationship', switchFn: 'switchCrystalCoastSection',
    renderFn: 'renderCrystalCoastScreen', sailFn: 'sailToCrystalCoast',
    titleElId: 'crystalCoastHeaderTitle', subElId: 'crystalCoastHeaderSubtitle', contentElId: 'crystalCoastContent',
    screenName: 'crystalcoast', icon: '💎', displayName: 'Crystal Coast',
    tagline: 'Where the resource finally surfaces',
    cardBorderColor: 'rgba(140,200,230,.5)', navBlurb: 'A different kind of exchange, here.',
    dockText: 'The water here has a faint, particular clarity to it — like something in it is catching light that shouldn\'t reach this deep.',
    exploreText: 'Whatever\'s out here has learned to live alongside what the coast is actually known for.',
    enemyKeys: ['crystal_coast_song_watcher','crystal_coast_shard_crawler','crystal_coast_resonant_guardian','crystal_coast_prism_swimmer','crystal_coast_first_keeper'],
    exploreCombatKind: 'crystalcoast_explore', voyageCombatKind: 'crystalcoast_voyage',
    voyageEvents: [
      { type: 'combat', text: 'Something catches the light wrong just beneath the surface, then rises fast.', combat: 'crystal_coast_shard_crawler' },
      { type: 'combat', text: 'A low, resonant hum builds from somewhere below the hull — then something answers it.', combat: 'crystal_coast_resonant_guardian' },
      { type: 'flavor', text: 'The water carries a faint, almost musical resonance the whole way in.' },
      { type: 'flavor', text: 'Something in the depths catches the light and scatters it in colors that don\'t quite make sense.' },
      { type: 'flavor', text: 'Mimi goes quiet for a long stretch, listening to something nobody else can hear.' },
      { type: 'flavor', text: 'The crew\'s own gear seems to hum faintly in response to something out there.' },
      { type: 'flavor', text: 'A shape passes far below, trailing faint light, gone before anyone can be sure what it was.' },
      { type: 'flavor', text: 'The water\'s clarity here is unnatural — visibility goes down further than it has any right to.' },
      { type: 'calm', text: 'The crossing is calm, and quietly, strangely beautiful.' }
    ]
  });

  // -----------------------------------------------------------------
  // OLD HARBOUR — Ch.23-25. "An older settlement, holding the history
  // that explains why all of this was ever protected in the first
  // place."
  // -----------------------------------------------------------------
  window.makeHarbourModule({
    stateKey: 'oldHarbourState', stateFn: 'oldHarbourState',
    discoveredFlag: 'oldHarbourDiscovered', unlockedFn: 'oldHarbourUnlocked',
    migrationChapter: 23,
    unlockSectionFn: 'unlockOldHarbourSection', setNameFn: 'setOldHarbourName',
    advanceRelFn: 'advanceOldHarbourRelationship', switchFn: 'switchOldHarbourSection',
    renderFn: 'renderOldHarbourScreen', sailFn: 'sailToOldHarbour',
    titleElId: 'oldHarbourHeaderTitle', subElId: 'oldHarbourHeaderSubtitle', contentElId: 'oldHarbourContent',
    screenName: 'oldharbour', icon: '⚓', displayName: 'Old Harbour',
    tagline: 'The oldest settlement in the region',
    cardBorderColor: 'rgba(200,180,140,.5)', navBlurb: 'Holds the history behind all of it.',
    dockText: 'The stonework here is old in a way nothing else on this coast is — worn smooth by more years than anyone aboard can easily account for.',
    exploreText: 'Whatever\'s out here has been guarding something for a very long time, and hasn\'t stopped just because the reason\'s been half-forgotten.',
    enemyKeys: ['old_harbour_weathered_dockhand','old_harbour_ruin_keeper','old_harbour_tideworn_sentry','old_harbour_archive_touched','old_harbour_last_guardian'],
    exploreCombatKind: 'oldharbour_explore', voyageCombatKind: 'oldharbour_voyage',
    voyageEvents: [
      { type: 'combat', text: 'Something old and weathered rises from among the ruined pilings, still keeping watch after all this time.', combat: 'old_harbour_ruin_keeper' },
      { type: 'combat', text: 'A shape steps out from the old seawall, moving like it\'s done this before, many times.', combat: 'old_harbour_tideworn_sentry' },
      { type: 'flavor', text: 'Half-collapsed stonework lines the approach, older than anything the crew has seen on this whole journey.' },
      { type: 'flavor', text: 'Erynn recognizes fragments of an inscription, though not enough to read it in full.' },
      { type: 'flavor', text: 'The harbour ahead looks abandoned, in the specific way a place looks abandoned when it isn\'t, quite.' },
      { type: 'flavor', text: 'Old mooring posts still stand in the water, worn to stubs, marking a dock line far larger than what remains.' },
      { type: 'flavor', text: 'Something in the ruins catches the light briefly, then is still again.' },
      { type: 'flavor', text: 'The quiet here feels deliberate, not simply the quiet of neglect.' },
      { type: 'calm', text: 'The approach is slow, and the old harbour simply waits, the way it clearly always has.' }
    ]
  });
})();
