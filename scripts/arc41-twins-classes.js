(function(){
  // -------------------------------------------------------------------
  // ARC XLI — VAEREN, JOELLE & SAIREN'S COMBAT CLASSES, per San's own
  // spec: Tide Warden (Vaeren), Astral Weaver (Joelle), Shadow Operative
  // (Sairen, upgraded from the single-skill placeholder arc41-mechanics.js
  // shipped earlier). Recruitable by the end of Arc XLI (San: "the twins
  // grow up 'bigger' by arc 41... we'll make them recruitable by end of
  // arc 41 since arc 42 isn't ready yet") — same Ch.16 moment Sairen's own
  // recruitment already fires on (arc41.js/arc41-mechanics.js).
  //
  // FIELDING: San's spec calls all three "story required... cannot be
  // fielded, do not take up a party slot." The actual slot-exemption lives
  // in arc9-and-systems.js's FREE_FIELD_IDS (same mechanism San/Joel/Soel
  // already use) — this file only owns ALL_PARTY/CLASS_KIT/GEAR_ROLE_
  // RULES/PARTY_GENDER, the same four registries every other companion
  // uses, same as arc41-mechanics.js's own precedent for Sairen.
  //
  // ENGINE ADAPTATIONS (per San's own integration requirement #10 to
  // report these): this combat engine has no per-ally shield, no evasion/
  // dodge, and no single-target "mark" distinct from the existing enemy-
  // wide expose (game.enemyVulnerable) and San-specific markedBoss. Rather
  // than invent parallel systems, core-engine.js gained:
  //   - game.allyShield {id,turns,pct,by} — a per-ally damage-reduction
  //     window, same shape/lifecycle as the existing game.defending map,
  //     just turn-counted instead of single-use. Drives Guardian's Current
  //     AND Celestial Veil (one shared helper, armAllyShield below).
  //   - game.evade {id,turns,pct} — a dodge-chance window, same shape,
  //     used by Vanishing Step.
  //   - game.twinResonanceArmed / game.sairenNextAtkBonus — one-shot flags
  //     exactly like the existing game.markedBoss/game.aegisArmed.
  //   - castSpell()'s dice-damage branch was pulled out of its else-if
  //     chain into an independent trailing check, so a spell can combine
  //     a buffType with real damage (Astral Threads, Constellation Bloom)
  //     — every existing dice spell only ever set `dice` alone, so this
  //     changes nothing for them.
  //   - "Mark"/"enemy attack reduction" map onto the existing expose
  //     mechanic (enemyVulnerable/enemyVulnerablePct) rather than new
  //     per-target state, since there's only ever one enemy on screen.
  //   - "AoE" (Constellation Bloom) is one hard hit, not true multi-
  //     target, same adaptation already on record for Renn's hex/Erynn's
  //     kit (game.combatEnemyHp is a single scalar).
  //   - Taunt (Undertow Challenge) is flavor-only, like Joel's Shield
  //     Wall/Ate Joy's Warden's Guard already are — enemyCounterAttack
  //     always picks a random live target; nothing in this engine
  //     actually redirects it for anyone.
  //
  // Sairen's hp/portrait/combatRole stay exactly as arc41-mechanics.js
  // already set them (ALL_PARTY entry untouched); only CLASS_KIT.sairen
  // is replaced here with his full five-ability kit, and he gains a small
  // real MP pool (0 → 50) to actually support Vanishing Step/Nameless
  // Execution — his Ghost Step placeholder never needed one.
  // -------------------------------------------------------------------

  // ---- Shared ally-shield helper (Guardian's Current / Celestial Veil) --
  // Auto-targets the lowest-HP% ally other than the caster (same targeting
  // rule Heal/Field Treatment already use), falling back to the caster if
  // no one else is alive — there's no ally-target-picker UI anywhere in
  // this combat engine, so every existing ally-effect auto-targets too.
  window.armAllyShield = function(actor, party){
    const others = party.filter(function(m){ return m.id !== actor.id && partyHpOf(m) > 0; });
    const target = others.length ? others.reduce(function(a, b){
      const aPct = partyHpOf(a) / effectiveMaxHp(a);
      const bPct = partyHpOf(b) / effectiveMaxHp(b);
      return aPct < bPct ? a : b;
    }) : actor;
    game.allyShield = {id: target.id, turns: 2, pct: 0.4, by: actor.id};
    // Twin Resonance (Joelle, passive): armed specifically when Vaeren
    // shields her -- not any shield on anyone, and not Joelle shielding
    // Vaeren (the spec's own direction is one-way: "after Vaeren shields
    // her").
    if (actor.id === 'vaeren' && target.id === 'joelle') {
      game.twinResonanceArmed = true;
    }
    const kit = kitFor(actor.id);
    const label = (kit.skill && kit.skill.name) || (kitSpellList(kit)[0] && kitSpellList(kit)[0].name) || 'a ward';
    logCombat(esc(actor.name) + ' shields ' + esc(target.name) + ' with ' + esc(label) + '!');
  };

  // ---- Vaeren — Tide Warden (Tank/Protector, Water) ----------------
  GEAR_ROLE_RULES.vaeren = {weapon:['mace','shield','any'], armor:['heavy'], label:'Warden Mace / Heavy Armor'};
  CLASS_KIT.vaeren = {role:'tank',
    spells:[
      {name:'Tidal Bulwark', icon:'🌊', mp:30, levelReq:20, desc:'Every bit of water in reach answers at once, standing between the crew and the next few blows.', buffType:'defense', buffVal:26, buffTurns:3}
    ],
    skill:{name:"Guardian's Current", icon:'🛡️', mp:0, effect:'guardAlly'},
    highSkill:{name:'Undertow Challenge', icon:'🌀', mp:0, mult:1.5, levelReq:15, effect:'tauntStrike', desc:'A pull of current drags the fight toward him.'}};
  window.PARTY_GENDER.vaeren = 'male';

  // ---- Joelle — Astral Weaver (Magic DPS/Support, Arcane) ----------
  GEAR_ROLE_RULES.joelle = {weapon:['staff','san_focus','any'], armor:['robe'], label:'Astral Focus / Robes'};
  CLASS_KIT.joelle = {role:'caster',
    spells:[
      {name:'Astral Threads', icon:'🧵', mp:16, levelReq:1, dice:'1d10', desc:"Threads of starlight catch the enemy's next move before it lands.", buffType:'expose', buffVal:18, buffTurns:2},
      {name:'Constellation Bloom', icon:'🌌', mp:38, levelReq:20, dice:'3d10', desc:'Every star she can reach, called down at once — and a ward left over for the crew.', buffType:'defense', buffVal:16, buffTurns:2}
    ],
    skill:{name:'Celestial Veil', icon:'🔮', mp:0, effect:'guardAlly'}};
  window.PARTY_GENDER.joelle = 'female';

  // ---- Sairen — Shadow Operative (Rogue/Debuffer, Shadow) -----------
  // Replaces arc41-mechanics.js's placeholder Ghost Step kit wholesale —
  // GEAR_ROLE_RULES.sairen and PARTY_GENDER.sairen are already correct
  // and left untouched.
  CLASS_KIT.sairen = {role:'melee',
    spells:[
      {name:'Vanishing Step', icon:'💨', mp:18, levelReq:1, desc:'Gone before the blow lands, and already moving into the next one.', buffType:'evade', buffVal:35, buffTurns:2}
    ],
    skill:{name:'Weakness Exposed', icon:'🗡️', mp:0, effect:'exposeSingle'},
    highSkill:{name:'Nameless Execution', icon:'🥷', mp:25, mult:2.2, levelReq:20, desc:'Everything the Nameless ever taught him, spent on one strike.'}};

  // ---- Twins' recruitment (Ch.16, same moment Sairen's own fires) ----
  window.grantTwinsRecruitIfDue = function(chapterId){
    if (chapterId !== 16) return;
    game.foundCompanions = game.foundCompanions || {};
    game.partyHp = game.partyHp || {};
    game.partyMp = game.partyMp || {};
    if (!game.foundCompanions.vaeren) {
      if (typeof ALL_PARTY !== 'undefined' && Array.isArray(ALL_PARTY) && !ALL_PARTY.some(function(m){ return m.id === 'vaeren'; })) {
        ALL_PARTY.push({id:'vaeren', name:'VAEREN', role:'Tide Warden', combatRole:'Tank',
          hp:88, mp:55, portrait:'🌊', portraitAsset:'assets/portraits/vaeren.png',
          desc:"San and Joel's son. Water answers him the way it always answered her — steadier now, with someone of his own to protect."});
      }
      game.foundCompanions.vaeren = true;
      const vm = ALL_PARTY.find(function(m){ return m.id === 'vaeren'; });
      if (vm) { game.partyHp.vaeren = vm.hp; game.partyMp.vaeren = vm.mp; }
    }
    if (!game.foundCompanions.joelle) {
      if (typeof ALL_PARTY !== 'undefined' && Array.isArray(ALL_PARTY) && !ALL_PARTY.some(function(m){ return m.id === 'joelle'; })) {
        ALL_PARTY.push({id:'joelle', name:'JOELLE', role:'Astral Weaver', combatRole:'Caster',
          hp:66, mp:100, portrait:'✨', portraitAsset:'assets/portraits/joelle.png',
          desc:"San and Joel's daughter. Reaches for the space between stars the way her mother once reached for fire — on her own terms, in her own time."});
      }
      game.foundCompanions.joelle = true;
      const jm = ALL_PARTY.find(function(m){ return m.id === 'joelle'; });
      if (jm) { game.partyHp.joelle = jm.hp; game.partyMp.joelle = jm.mp; }
    }
    logEvent('🌊✨ Vaeren and Joelle join the crew — not children underfoot anymore, whatever Soel thinks.', 'gold');
  };
})();
