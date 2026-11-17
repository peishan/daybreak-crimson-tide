(function(){
  // -------------------------------------------------------------------
  // SAIREN -- coffee bond + small touches in his Jovie interlude.
  //
  // Sairen becomes a fixed crew member in Crimson Horizon, so unlike a
  // guest he needs the same kind of bond the other companions have.
  // The track itself ('san_sairen', "San, Joel & Sairen") lives in
  // hang-out-companions.js next to the others; this file only adds:
  //
  //  1. Seeding: the Bond he earned as a Fair Tide guest carries into the
  //     coffee table, once. Warm guests start a little way along, steady
  //     ones a little less, distant ones from zero. (Story only -- the
  //     track has no combat bonus, same as every individual bond.)
  //  2. A few extra lines in Interlude Part III (Sairen & Jovie, Ch.6, 9,
  //     10) that read how he was treated (game.sairenGuestTier) and
  //     whether he has a regular seat at San and Joel's table.
  // -------------------------------------------------------------------
  const SEED = { warm: 25, steady: 10, distant: 0 };

  function guestTier(){
    return (typeof window.sairenGuestTier === 'function') ? window.sairenGuestTier() : 'steady';
  }

  function seedSairenBond(){
    try {
      if (!(game.foundCompanions && game.foundCompanions.sairen)) return;
      if (game.sairenBondSeeded) return;
      if (typeof window.bondState !== 'function') return;
      const st = window.bondState().san_sairen;
      if (!st) return;
      game.sairenBondSeeded = true;
      const seed = SEED[guestTier()] || 0;
      if (st.points < seed) st.points = seed;
    } catch(e) {}
  }
  window.seedSairenBond = seedSairenBond;

  const oldRecruit = window.grantSairenRecruitIfDue;
  if (typeof oldRecruit === 'function') {
    window.grantSairenRecruitIfDue = function(){
      const r = oldRecruit.apply(this, arguments);
      seedSairenBond();
      return r;
    };
  }
  const oldRenderBonds = window.renderBondsTab;
  window.renderBondsTab = function(){
    seedSairenBond();
    return oldRenderBonds ? oldRenderBonds.apply(this, arguments) : undefined;
  };

  // ---- Interlude Part III touches ----
  function bondPoints(){
    try { return window.bondState().san_sairen.points || 0; } catch(e) { return 0; }
  }
  const LINES = {
    6: {
      warm: '"Someone at Fair Tide asked me that once," he says, "back when I was nobody anyone had a reason to feed. I didn\'t answer her either." He looks at the bowl. "I should have."',
      steady: '"People here keep asking me that," he says. "I haven\'t worked out what it costs yet." "Nothing," Jovie says, and goes back to the dressing.',
      distant: '"No one has asked me that without wanting something," he says. "I\'m still waiting to find out what it is." "You\'ll be waiting a while," Jovie says.'
    },
    10: {
      warm: 'He thinks, briefly, of everyone who made Fair Tide easy to come back to. Her most of all. Not only her.',
      steady: 'He thinks of the people who kept a door open for him here without ever making it a favour. Her, and not only her.',
      distant: 'He had expected to have to earn a place here. It is odd to find that most of the earning was already done, quietly, by people who never mentioned it.'
    }
  };
  function coffeeLine9(){
    if (bondPoints() >= 50) {
      return 'Back at the Captain\'s Quarters, San and Joel have started pouring a third cup without asking whether he will stay for it. He mentions this, a little too casually. Jovie does not point out that he has stopped refusing.';
    }
    return null;
  }

  function insertBeforeLast(base, line){
    const i = base.lastIndexOf('<br><br>');
    if (i < 0) return base + '<br><br>' + line;
    return base.slice(0, i) + '<br><br>' + line + base.slice(i);
  }
  const scenes = window.ARC41_INTERLUDE_CHAPTER_SCENES;
  if (scenes) {
    [6, 9, 10].forEach(function(id){
      const base = scenes[id];
      if (typeof base !== 'string') return;
      Object.defineProperty(scenes, String(id), { configurable: true, enumerable: true,
        get: function(){
          let line = null;
          if (id === 9) line = coffeeLine9();
          else if (LINES[id]) line = LINES[id][guestTier()] || LINES[id].steady;
          return line ? insertBeforeLast(base, line) : base;
        },
        set: function(v){ Object.defineProperty(scenes, String(id), { value: v, writable: true, configurable: true, enumerable: true }); }
      });
    });
  }
  seedSairenBond();
})();
