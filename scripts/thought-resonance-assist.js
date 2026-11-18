(function(){
  // -------------------------------------------------------------------
  // THOUGHT RESONANCE IN BATTLE: the shared action.
  //
  // Once Thought Resonance is unlocked (Arc XL Ch.13), whenever San or Joel finishes
  // their turn there is a small chance the other one "was already moving" and follows
  // through with a free strike. It cannot be called on demand and never carries a fight:
  //   * only while BOTH San and Joel are standing in the active party;
  //   * chance rises with the Bond Resonance tier: 8% Quiet, 11% Noticeable, 14% Undeniable;
  //   * at most twice per battle, never two rounds in a row;
  //   * the strike is a little weaker than a normal attack (90%), no crit.
  // It lands before the enemy's counter-attack, so it can also end a fight early.
  // -------------------------------------------------------------------
  const CHANCE = [0.08, 0.11, 0.14];
  const MAX_PER_BATTLE = 2;
  const LINES = {
    san:  ['San barely finishes the thought. Joel is already there, blade moving.',
           'Joel does not wait to be asked. He sees where San is looking and strikes.'],
    joel: ['Joel opens a gap. San is through it before the gap exists.',
           'San steps in on the beat Joel has not called yet, and lands the blow.']
  };
  let lastEnemy = null, count = 0, lastRound = -9;

  function tierIndex(){
    try {
      const tiers = window.BOND_RESONANCE_TIERS || [], t = window.bondResonanceTier && window.bondResonanceTier();
      const i = tiers.indexOf(t); return i < 0 ? 0 : Math.min(i, CHANCE.length - 1);
    } catch(e) { return 0; }
  }

  function maybeAssist(){
    if (!game.inCombat || game.combatResolved || !game.thoughtResonanceUnlocked) return;
    if (!(game.combatEnemyHp > 0)) return;
    if (game.combatEnemy !== lastEnemy) { lastEnemy = game.combatEnemy; count = 0; lastRound = -9; }
    if (count >= MAX_PER_BATTLE) return;
    const round = game.combatRound || 1;
    if (round - lastRound < 2) return;
    const alive = getCrimsonCombatParty().filter(function(m){ return partyHpOf(m) > 0; });
    const actor = alive[game.combatTurn];
    if (!actor || (actor.id !== 'san' && actor.id !== 'joel')) return;
    const partnerId = actor.id === 'san' ? 'joel' : 'san';
    const partner = alive.find(function(m){ return m.id === partnerId; });
    if (!partner) return;
    if (Math.random() >= CHANCE[tierIndex()]) return;

    const gb = gearBonuses(partner.id);
    let dmg = Math.round((18 + rollDice('1d20') + gb.atk) * (1 + game.ship.cannons * 0.12) * 0.9);
    if (game.enemyVulnerable > 0) dmg = Math.round(dmg * (1 + game.enemyVulnerablePct));
    dmg = Math.max(1, dmg);
    game.combatEnemyHp = Math.max(0, game.combatEnemyHp - dmg);
    count++; lastRound = round;
    game.thoughtResonanceAssists = (game.thoughtResonanceAssists || 0) + 1;
    const pool = LINES[actor.id];
    logCombat('💗 <b>Thought Resonance</b> — ' + pool[Math.floor(Math.random() * pool.length)] + ' <span class="damage">' + dmg + '</span> damage!');
  }

  const oldEndTurn = window.endTurn;
  if (typeof oldEndTurn === 'function') {
    window.endTurn = function(){
      try { maybeAssist(); } catch(e) { if (window.console) console.warn('resonance assist failed', e); }
      return oldEndTurn.apply(this, arguments);
    };
  }
})();
