(function(){
  // -------------------------------------------------------------------
  // SOEL, PROTECTOR OF THE TWINS (the sequel).
  //
  // In Crimson Horizon Soel is no longer a pouncing familiar: he watches over Vaeren and
  // Joelle, and fights from a distance, blessing and healing the party instead of
  // biting anything. From the moment the sequel crew is set (sequel-party.js) his kit
  // changes:
  //   * No direct attack skill. His skill is Cleansing Purr (clears ailments).
  //   * Blessings: Renewal (heals whoever is lowest), Tides (restores MP), Guardian's
  //     Veil (the crew takes less damage), Fortune's Purr (the crew acts faster).
  //   * Ward the Twins: shields Vaeren or Joelle first (whichever is hurt more), so
  //     the moment their protection ends they are not left alone.
  //   * Spirit Bolt: a ranged bolt of lantern-light, his only damage.
  // He is still unkillable and still takes no fielding slot. Before the sequel his kit
  // is exactly what it was.
  // -------------------------------------------------------------------
  const SEQUEL_KIT = { role: 'healer',
    spells: [
      { name: 'Blessing of Renewal', icon: '🌿', mp: 0, levelReq: 1, desc: 'A warm hush settles on whoever is hurt most.', healMult: 1.2 },
      { name: 'Ward the Twins', icon: '🐾', mp: 0, levelReq: 1, desc: 'He plants himself between the twins and the next blow.', effect: 'guardAlly' },
      { name: "Guardian's Veil", icon: '🛡️', mp: 0, levelReq: 1, desc: 'The whole crew takes less from the next few hits.', buffType: 'defense', buffVal: 12, buffTurns: 3 },
      { name: 'Blessing of Tides', icon: '🌊', mp: 0, levelReq: 1, desc: 'Restores a caster\'s magic.', effect: 'restoreMp', restoreAmt: 50 },
      { name: "Fortune's Purr", icon: '🍀', mp: 0, levelReq: 1, desc: 'Luck settles on the crew: everyone acts faster.', buffType: 'haste', buffVal: 6, buffTurns: 3 },
      { name: 'Spirit Bolt', icon: '✨', mp: 0, levelReq: 1, desc: 'A ranged bolt of lantern-light. He never closes in.', dice: '2d8' }
    ],
    skill: { name: 'Cleansing Purr', icon: '🌿', mp: 0, effect: 'cleanse' } };
  let baseKit = (typeof CLASS_KIT === 'object') ? CLASS_KIT.soel : null;
  function sequel(){ return typeof window.sequelCrewActive === 'function' && window.sequelCrewActive(); }
  if (typeof CLASS_KIT === 'object' && baseKit) {
    Object.defineProperty(CLASS_KIT, 'soel', { configurable: true, enumerable: true,
      get: function(){ return sequel() ? SEQUEL_KIT : baseKit; },
      set: function(v){ baseKit = v; } });
  }

  // Display: role and description.
  function syncRole(){
    try {
      if (!sequel() || typeof ALL_PARTY === 'undefined') return;
      const m = ALL_PARTY.find(function(x){ return x.id === 'soel'; });
      if (m && m.combatRole !== 'Protector') {
        m.role = 'Protector of the Twins';
        m.combatRole = 'Protector';
        m.desc = "He keeps close to Vaeren and Joelle now. He no longer fights: he blesses, heals and wards the crew, and puts himself between the twins and anything that gets close.";
      }
    } catch(e) {}
  }
  const oldGetFielded = window.getFieldedIds;
  if (typeof oldGetFielded === 'function') {
    window.getFieldedIds = function(){ syncRole(); return oldGetFielded.apply(this, arguments); };
  }
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){ syncRole(); return oldUpdateUI.apply(this, arguments); };
  }

  // Ward the Twins: the twins first.
  const oldShield = window.armAllyShield;
  if (typeof oldShield === 'function') {
    window.armAllyShield = function(actor, party){
      if (actor && actor.id === 'soel' && sequel()) {
        const twins = party.filter(function(m){ return (m.id === 'vaeren' || m.id === 'joelle') && partyHpOf(m) > 0; });
        if (twins.length) {
          const target = twins.reduce(function(a, b){ return (partyHpOf(a) / effectiveMaxHp(a)) <= (partyHpOf(b) / effectiveMaxHp(b)) ? a : b; });
          game.allyShield = { id: target.id, turns: 3, pct: 0.5, by: 'soel' };
          logCombat(esc(actor.name) + ' wards ' + esc(target.name) + ', putting himself between the twins and the fight.');
          return;
        }
      }
      return oldShield.apply(this, arguments);
    };
  }
  // He never closes in: a plain "Attack" from Soel (including auto-battle's fallback) becomes
  // the most useful blessing instead: Veil if the crew's shield is down, Fortune's Purr if
  // haste is down, otherwise a ranged Spirit Bolt.
  const oldAction = window.combatAction;
  if (typeof oldAction === 'function') {
    window.combatAction = function(action){
      try {
        if (action === 'ATTACK' && sequel() && game.inCombat && !game.combatResolved && game.combatEnemyHp > 0) {
          const party = getCrimsonCombatParty().filter(function(m){ return partyHpOf(m) > 0; });
          const actor = party[game.combatTurn];
          if (actor && actor.id === 'soel') {
            const list = kitSpellList(kitFor('soel')).filter(function(sp){ return (sp.levelReq || 1) <= level(); });
            const idx = function(name){ return list.findIndex(function(sp){ return sp.name === name; }); };
            let pick = idx('Spirit Bolt');
            if ((game.shieldTurns || 0) <= 0 && idx("Guardian's Veil") >= 0) pick = idx("Guardian's Veil");
            else if ((game.hasteTurns || 0) <= 0 && idx("Fortune's Purr") >= 0) pick = idx("Fortune's Purr");
            if (pick >= 0) { castSpell(pick); return; }
          }
        }
      } catch(e) {}
      return oldAction.apply(this, arguments);
    };
  }
})();
