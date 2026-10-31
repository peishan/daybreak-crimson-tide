(function(){
  // -------------------------------------------------------------------
  // ARC XLI MECHANICS — SAIREN'S RECRUITMENT, the gameplay Ch.16's own
  // notes call for. Kept OUT of arc41.js itself, same split used since
  // Arc XXIII.
  //
  // Arc XXIX deliberately kept Sairen out of ALL_PARTY ("no ALL_PARTY
  // entry for Sairen, no recruitment path" -- that file's own comment).
  // This is the arc that lifts it, following the EXACT shape every
  // other party member already uses rather than inventing a parallel
  // system: an ALL_PARTY entry (same fields as every other recruit),
  // a CLASS_KIT skill entry (same mp:0/single-skill shape Aisyah and
  // Iris already use, since he's a Rogue like them -- no spellcasting,
  // just a physical skill), a GEAR_ROLE_RULES entry, and a
  // PARTY_GENDER registration (he's established male throughout
  // Arc XXIX-XXX). ALL_PARTY/CLASS_KIT/GEAR_ROLE_RULES/PARTY_GENDER
  // are top-level consts in core-engine.js, not window.X assignments
  // (bestiary.js's own comment explains why: accessible as a bare
  // identifier to later-loading scripts sharing the same global scope,
  // same technique used there) -- so this file reaches them the same
  // way, rather than needing core-engine.js edited directly.
  //
  // The actual join -- game.foundCompanions.sairen, game.partyHp/
  // partyMp seeded to his own max -- fires on Ch.16 specifically (his
  // actual decision chapter), called from arc41.js's own
  // markArc41ChapterRead via window.grantSairenRecruitIfDue(id), same
  // "mechanics file owns the side effect, story file just calls it"
  // split used throughout this session.
  // -------------------------------------------------------------------

  // Registered once, at load time, rather than only at recruitment --
  // GEAR_ROLE_RULES/CLASS_KIT/PARTY_GENDER describe who Sairen WOULD be
  // if recruited, and other systems (equipment screens, pronoun lookups)
  // may reasonably query them before Ch.16 is actually reached. Only
  // ALL_PARTY membership and the foundCompanions grant are held back
  // for the real recruitment moment -- that's the actual gate every
  // other system already checks (memberUnlocked() reads foundCompanions,
  // not ALL_PARTY presence).
  if (typeof GEAR_ROLE_RULES === 'object') {
    GEAR_ROLE_RULES.sairen = {weapon:['dagger','any'], armor:['light'], label:'Dagger / Light Armor'};
  }
  if (typeof CLASS_KIT === 'object') {
    CLASS_KIT.sairen = {role:'melee', spell:null,
      skill:{name:'Ghost Step', icon:'🥷', mp:0, mult:1.7}};
  }
  if (typeof window.PARTY_GENDER === 'object') {
    window.PARTY_GENDER.sairen = 'male';
  }

  window.grantSairenRecruitIfDue = function(chapterId){
    if (chapterId !== 16) return;
    if (game.foundCompanions && game.foundCompanions.sairen) return; // idempotent
    game.foundCompanions = game.foundCompanions || {};
    if (typeof ALL_PARTY !== 'undefined' && Array.isArray(ALL_PARTY) && !ALL_PARTY.some(function(m){ return m.id === 'sairen'; })) {
      ALL_PARTY.push({id:'sairen', name:'SAIREN', role:'Former Operative', combatRole:'Rogue',
        hp:76, mp:0, portrait:'🥷', portraitAsset:'assets/portraits/sairen.png',
        desc:"Once Nameless. Chose Fair Tide instead -- not for the twins, not for Jovie, though neither hurt. For himself."});
    }
    game.foundCompanions.sairen = true;
    const member = (typeof ALL_PARTY !== 'undefined') ? ALL_PARTY.find(function(m){ return m.id === 'sairen'; }) : null;
    if (member) {
      game.partyHp = game.partyHp || {};
      game.partyMp = game.partyMp || {};
      game.partyHp.sairen = member.hp;
      game.partyMp.sairen = member.mp;
    }
    logEvent('🥷 Sairen joins Fair Tide — not recruited so much as finally staying.', 'gold');
  };
})();
