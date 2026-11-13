(function(){
  // -------------------------------------------------------------------
  // THE CANON FIVE -- Jade, Devon, Sky, Levi and Sally as real, fieldable
  // party members in Crimson Tide, using their class kits from Tribute
  // (peishan/tribute-game, scripts/characters.js), where they are the
  // canon party from the beginning:
  //   Jade   Imperial Guardian  -- leader / hybrid, whip and bow, guard and buffs
  //   Devon  Dragon Scholar     -- defensive mage and swordsman
  //   Sky    Mystic Martialist  -- healer / support, spirit energy
  //   Levi   Shadow Archer      -- ranged damage, trick arrows
  //   Sally  Noble Assassin     -- intelligence, evasion, one exact cut
  // Their Tribute skills are adapted to Crimson Tide's own spell and skill
  // schema (dice damage, healMult, buffType, skill effects). Left out on
  // purpose: anything gated behind a Tribute story flag or evolution choice
  // (Golden Blood Awakening, the Black Pearl Resonance skills, the
  // upgrade paths), since the sequel has not decided those. In particular
  // nothing here says what the Black Pearl does.
  //
  // They join when the sequel's Prologue is read (they sail with the crew
  // from the start). A save already past the Prologue is granted them on
  // load. Fielding follows the normal rules (the ship's cap; the roster
  // auto-fills new members while there is room).
  //
  // ALSO FIXES: late recruits whose ALL_PARTY entry is only created at the
  // moment their chapter is read (Sairen, Vaeren, Joelle from Arc XLI) were
  // missing from the party after a reload, because nothing recreated the
  // entry from the save. restoreLateRecruits() does.
  // -------------------------------------------------------------------

  const CANON = {
    jade:  { name:'JADE',  role:'Imperial Guardian', combatRole:'Leader',    hp:82, mp:60,  portrait:'🌙', gender:'female',
             desc:"The Imperial Guardian who sails with the Crimson Tide now. Whip, bow and a steady head: she keeps the whole crew moving as one." },
    devon: { name:'DEVON', role:'Dragon Scholar',    combatRole:'Defensive Mage', hp:84, mp:90, portrait:'🐉', gender:'male',
             desc:"A dragon scholar with a blade and a talent for keeping others standing. He plots the course, and the defence." },
    sky:   { name:'SKY',   role:'Mystic Martialist', combatRole:'Healer',    hp:72, mp:100, portrait:'🌿', gender:'male',
             desc:"A mystic martialist and healer. Spirit energy, steady hands, and a patient eye on everyone's wounds." },
    levi:  { name:'LEVI',  role:'Shadow Archer',     combatRole:'Ranged',    hp:70, mp:45,  portrait:'🏹', gender:'male',
             desc:"A shadow archer who strikes from the dark and scouts what the crew cannot see yet." },
    sally: { name:'SALLY', role:'Noble Assassin',    combatRole:'Rogue',     hp:66, mp:60,  portrait:'🌹', gender:'female',
             desc:"A noble-born rogue who controls the room first and ends the fight second, with a blade hidden in a silk fan." }
  };
  const CANON_IDS = Object.keys(CANON);
  window.CANON_FIVE_IDS = CANON_IDS;

  // ---- kits (Crimson Tide schema) ----
  if (typeof GEAR_ROLE_RULES === 'object') {
    GEAR_ROLE_RULES.jade  = {weapon:['bow','dagger','any'], armor:['light'], label:'Whip & Bow / Light Armor'};
    GEAR_ROLE_RULES.devon = {weapon:['sword','staff','any'], armor:['robe'], label:'Scholar Blade / Robes'};
    GEAR_ROLE_RULES.sky   = {weapon:['staff','mace','any'], armor:['robe'], label:'Spirit Staff / Robes'};
    GEAR_ROLE_RULES.levi  = {weapon:['bow','any'], armor:['light'], label:'Longbow / Light Armor'};
    GEAR_ROLE_RULES.sally = {weapon:['dagger','any'], armor:['light'], label:'Silk Fan / Light Armor'};
  }
  if (typeof CLASS_KIT === 'object') {
    CLASS_KIT.jade = {role:'support',
      spells:[
        {name:"Guardian's Promise", icon:'🤝', mp:18, levelReq:1, desc:'Jade stands between an ally and the next blow.', effect:'guardAlly'},
        {name:'Guard Stance', icon:'🛡️', mp:14, levelReq:3, desc:'She raises her guard: the crew takes less damage.', buffType:'defense', buffVal:8, buffTurns:3},
        {name:'Clairvoyance', icon:'👁️', mp:20, levelReq:6, desc:"Foresight: the enemy's next move laid bare.", buffType:'expose', buffVal:20, buffTurns:3},
        {name:'Destiny Link', icon:'🔗', mp:28, levelReq:10, desc:"Binds the party's fates: everyone strikes harder and faster.", buffType:'haste', buffVal:8, buffTurns:3}
      ],
      skill:{name:'Lunar Lash', icon:'🌙', mp:0, mult:1.9},
      highSkill:{name:'Piercing Arrow', icon:'🏹', mp:8, mult:2.3, levelReq:10, desc:'A precise bow shot from a distance.'}};
    CLASS_KIT.devon = {role:'caster',
      spells:[
        {name:"Scholar's Read", icon:'🔍', mp:12, levelReq:2, desc:'Reads the enemy like a scroll: its guard drops.', buffType:'expose', buffVal:18, buffTurns:3},
        {name:'Royal Command', icon:'👑', mp:22, levelReq:4, desc:'An order no one questions: the party moves faster.', buffType:'haste', buffVal:6, buffTurns:3},
        {name:'Dragon Veil', icon:'🛡️', mp:26, levelReq:7, desc:'A veil of dragon-scale light shields the crew.', buffType:'defense', buffVal:10, buffTurns:3},
        {name:'Spirit Purification', icon:'✨', mp:20, levelReq:8, desc:'Royal magic that burns away what should not be there.', dice:'2d10'},
        {name:'Protective Oath', icon:'🤝', mp:30, levelReq:10, desc:'He swears to stand: the crew\'s defense surges.', buffType:'defense', buffVal:16, buffTurns:3},
        {name:'Dragon Flame', icon:'🔥', mp:24, levelReq:13, desc:'Royal dragon fire, used sparingly.', dice:'3d10', status:{type:'burn',chance:0.4,dmg:8,turns:3}}
      ],
      skill:{name:'Veiled Blade', icon:'🗡️', mp:0, mult:1.6},
      highSkill:{name:'Dragon Guard', icon:'🛡️', mp:10, effect:'guardAlly', levelReq:7, desc:'He steps in front of an ally.'}};
    CLASS_KIT.sky = {role:'healer',
      spells:[
        {name:'Healing Arts', icon:'💚', mp:10, levelReq:1, desc:'Restores the lowest-HP ally.', healMult:1.2},
        {name:'Palm Strike', icon:'🖐️', mp:8, levelReq:2, desc:'A martial palm infused with inner energy.', dice:'2d8'},
        {name:'Purification', icon:'🕊️', mp:12, levelReq:5, desc:'Cleanses and heals a little more than a first spell could.', healMult:1.5},
        {name:'Protective Barrier', icon:'🔰', mp:20, levelReq:8, desc:'An energy barrier absorbing damage.', buffType:'defense', buffVal:8, buffTurns:4},
        {name:'Spirit Flow', icon:'🌊', mp:26, levelReq:12, desc:'A deep, steady restoration of spirit energy.', healMult:2.0}
      ],
      skill:{name:'Spirit Recall', icon:'💫', mp:30, effect:'revive'},
      highSkill:{name:'Cleansing Light', icon:'🕯️', mp:14, effect:'cleanse', levelReq:12}};
    CLASS_KIT.levi = {role:'melee',
      spells:[
        {name:'Poisoned Arrow', icon:'🧪', mp:8, levelReq:1, desc:'A poisoned tip: damage over time.', dice:'1d10', status:{type:'poison',chance:0.5,dmg:6,turns:3}},
        {name:'Pinning Arrow', icon:'📌', mp:8, levelReq:3, desc:'Pins a limb and slows the target.', dice:'1d10', status:{type:'shock',chance:0.45,turns:1}},
        {name:'Ricochet Shot', icon:'↩️', mp:14, levelReq:6, desc:'A shot that rebounds for more.', dice:'2d8'},
        {name:'Silencing Arrow', icon:'🤫', mp:14, levelReq:12, desc:'Hits hard and stuns spellcasters.', dice:'2d8', status:{type:'shock',chance:0.5,turns:1}},
        {name:'Hero of the Night', icon:'🌑', mp:16, levelReq:15, desc:'He melts into the dark: evasion up.', buffType:'evade', buffVal:40, buffTurns:3}
      ],
      skill:{name:'Aimed Shot', icon:'🏹', mp:0, mult:1.9},
      highSkill:{name:'Net Arrow', icon:'🕸️', mp:10, effect:'stun', levelReq:9, desc:'Restricts movement: the enemy loses its turn.'}};
    CLASS_KIT.sally = {role:'melee',
      spells:[
        {name:'Silken Illusion', icon:'🪞', mp:10, levelReq:1, desc:'A dizzying illusion. Damages and slows.', dice:'1d12', status:{type:'shock',chance:0.35,turns:1}},
        {name:'Gather Intel', icon:'👂', mp:8, levelReq:2, desc:'She listens and learns: the foe\'s guard drops.', buffType:'expose', buffVal:18, buffTurns:3},
        {name:'Smoke Veil', icon:'🌫️', mp:22, levelReq:9, desc:'Party evasion up.', buffType:'evade', buffVal:30, buffTurns:3},
        {name:'Mirage Veil', icon:'🪞', mp:30, levelReq:13, desc:'Charm and misdirection: party evasion greatly up.', buffType:'evade', buffVal:45, buffTurns:3}
      ],
      skill:{name:'Hidden Rib', icon:'🪭', mp:0, mult:1.8},
      highSkill:{name:'A Quiet End', icon:'🌹', mp:20, mult:2.8, levelReq:20, desc:'No flourish at all: one exact, finishing cut.'}};
  }
  CANON_IDS.forEach(function(id){ if (window.PARTY_GENDER) window.PARTY_GENDER[id] = CANON[id].gender; });

  function entryFor(id){
    const c = CANON[id];
    return { id:id, name:c.name, role:c.role, combatRole:c.combatRole, hp:c.hp, mp:c.mp,
      portrait:c.portrait, portraitAsset:'assets/portraits/sequel/' + id + '.png', desc:c.desc };
  }

  // The Arc XLI recruits, rebuilt from the save (same values arc41-mechanics.js
  // and arc41-twins-classes.js create at recruitment).
  const LATE = {
    sairen: {id:'sairen', name:'SAIREN', role:'Former Operative', combatRole:'Rogue', hp:76, mp:50, portrait:'🥷', portraitAsset:'assets/portraits/sairen.png',
      desc:"Once Nameless. Chose Fair Tide instead -- not for the twins, not for Jovie, though neither hurt. For himself."},
    vaeren: {id:'vaeren', name:'VAEREN', role:'Tide Warden', combatRole:'Tank', hp:88, mp:55, portrait:'🌊', portraitAsset:'assets/portraits/vaeren.png',
      desc:"San and Joel's son. Water answers him the way it always answered her — steadier now, with someone of his own to protect."},
    joelle: {id:'joelle', name:'JOELLE', role:'Astral Weaver', combatRole:'Caster', hp:66, mp:100, portrait:'✨', portraitAsset:'assets/portraits/joelle.png',
      desc:"San and Joel's daughter. Reaches for the space between stars the way her mother once reached for fire — on her own terms, in her own time."}
  };

  function restoreLateRecruits(){
    if (typeof ALL_PARTY === 'undefined' || !game || !game.foundCompanions) return;
    Object.keys(LATE).forEach(function(id){
      if (game.foundCompanions[id] && !ALL_PARTY.some(function(m){ return m.id === id; })) ALL_PARTY.push(Object.assign({}, LATE[id]));
    });
    CANON_IDS.forEach(function(id){
      if (game.foundCompanions[id] && !ALL_PARTY.some(function(m){ return m.id === id; })) ALL_PARTY.push(entryFor(id));
    });
  }
  window.restoreLateRecruits = restoreLateRecruits;

  function prologueRead(){ return !!(game.arc42Complete && game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[1]); }

  window.grantCanonFiveIfDue = function(){
    if (!prologueRead()) { restoreLateRecruits(); return false; }
    game.foundCompanions = game.foundCompanions || {};
    game.partyHp = game.partyHp || {}; game.partyMp = game.partyMp || {};
    let granted = false;
    CANON_IDS.forEach(function(id){
      if (!game.foundCompanions[id]) {
        game.foundCompanions[id] = true;
        if (!ALL_PARTY.some(function(m){ return m.id === id; })) ALL_PARTY.push(entryFor(id));
        const m = ALL_PARTY.find(function(x){ return x.id === id; });
        game.partyHp[id] = effectiveMaxHp(m); game.partyMp[id] = effectiveMaxMp(m);
        granted = true;
      }
    });
    restoreLateRecruits();
    if (granted && typeof logEvent === 'function') logEvent('🌅 Jade, Devon, Sky, Levi and Sally sail with the Crimson Tide. They can be fielded from the Crew screen.', 'gold');
    return granted;
  };

  // Re-apply after a load/import (the page rebuilds ALL_PARTY from scratch),
  // and whenever the UI refreshes, so nothing depends on call order.
  ['loadGame', 'importSave'].forEach(function(name){
    const old = window[name];
    if (typeof old !== 'function') return;
    window[name] = function(){
      const r = old.apply(this, arguments);
      try { window.grantCanonFiveIfDue(); } catch(e) {}
      return r;
    };
  });
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      try { if (game && game.foundCompanions) window.grantCanonFiveIfDue(); } catch(e) {}
      return oldUpdateUI.apply(this, arguments);
    };
  }
})();
