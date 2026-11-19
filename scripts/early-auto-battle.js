(function(){
  // -------------------------------------------------------------------
  // EARLY AUTO-BATTLE: casters stop wasting turns on weak spells.
  //
  // San is a caster. Auto-battle used to cast a RANDOM damage spell on 70% of her turns and, on
  // most of the rest, use her skill. But at low levels a spell is much weaker than a plain Attack
  // (Magic Missile does about 17, an Attack about 34), and Daybreak Ward has no effect at all, so
  // those turns were simply lost. A fresh San on auto beat the Bilge Rat Gang about half the time
  // and the Dock Thief almost never, where the same fight by hand is won every time.
  //
  // Below Level 20, a caster on auto now only casts a damage spell that out-damages her Attack
  // (the best one, 70% of turns) and otherwise attacks. It still drinks a potion when low.
  // From Level 20 on, auto-battle is exactly what it was, so late-game and raid balance (which
  // was tuned against it) does not move. Manual battles are not touched.
  // -------------------------------------------------------------------
  const EARLY_LEVEL = 20;
  function expAttack(id){ const gb = gearBonuses(id); return (18 + 10.5 + gb.atk) * (1 + (game.ship.cannons || 0) * 0.12); }
  function expSpell(s, id){
    const gb = gearBonuses(id), m = /^(\d+)d(\d+)$/.exec(s.dice || ''); if (!m) return 0;
    return ((+m[1]) * ((+m[2] + 1) / 2) * 3 + gb.magic) * (1 + (game.ship.cannons || 0) * 0.1);
  }
  const old = window.autoBattleAction;
  if (typeof old !== 'function') return;
  window.autoBattleAction = function(actor){
    try {
      if (game.inCombat && !game.combatResolved && actor && partyHpOf(actor) > 0 && level() < EARLY_LEVEL) {
        const kit = kitFor(actor.id);
        if (kit.role === 'caster' && !(kit.skill && kit.skill.effect === 'revive')) {
          if (actor.temp !== true && partyHpOf(actor) / effectiveMaxHp(actor) < 0.3) {
            const healId = (game.consumables && game.consumables.greater_health > 0) ? 'greater_health' : ((game.consumables && game.consumables.health_potion > 0) ? 'health_potion' : null);
            if (healId) { useItem(healId); return; }
          }
          const mp = game.partyMp[actor.id] || 0;
          const spellList = kitSpellList(kit).filter(function(s){ return (s.levelReq || 1) <= level(); });
          const atk = expAttack(actor.id);
          // a long fight and the party is taking a beating: raise Daybreak Ward (never while a shield is already up)
          if (kit.skill && kit.skill.effect === 'ward' && mp >= (kit.skill.mp || 0) && (game.shieldTurns || 0) <= 0 && game.combatEnemyHp > atk * 6 && partyHpOf(actor) / effectiveMaxHp(actor) < 0.7) { combatAction('SKILL'); return; }
          const good = spellList.filter(function(s){ return s.dice && mp >= s.mp && expSpell(s, actor.id) >= atk; });
          if (good.length && Math.random() < 0.7) {
            const best = good.reduce(function(a, b){ return expSpell(b, actor.id) > expSpell(a, actor.id) ? b : a; });
            castSpell(spellList.indexOf(best));
            return;
          }
          combatAction('ATTACK');
          return;
        }
      }
    } catch(e) { if (window.console) console.warn('early auto-battle failed', e); }
    return old.apply(this, arguments);
  };
})();
