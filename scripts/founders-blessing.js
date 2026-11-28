(function(){
  // -------------------------------------------------------------------
  // THE FOUNDERS' BLESSING (Crimson Horizon Arc XXXI, Ch.381 to 383): the sequel's prestige progression.
  //
  // At Ch.382 (id 383, "Unlock Blessed Progression") every member of the travelling ensemble is blessed, once: San, Joel, Jade, Devon, Sky, Levi, Sally,
  // Aisyah, Mezstorm, Sairen, the twins (Vaeren and Joelle) and Soel. Nothing is reset: levels, XP, gear and learned skills are all kept. Each blessing is
  //   * a PASSIVE: a permanent stat bonus that grows with level (added through gearBonuses, so HP, damage and defence all see it), and
  //   * an ABILITY: one new action in the Skill menu, usable once every few rounds, costing the turn and no MP.
  // The twins and Soel keep protective roles (shields and healing only; they never deal damage), and the twins still share one unit slot.
  // At Ch.383 (id 384) San, Joel, Jade, Vaeren, Joelle and Soel are also named Dawnwardens. The title is an honour: everyone keeps their blessing
  // whoever holds it. Custodians' Accord stays a separate Black Pearl reward.
  // The blessing also makes the group eligible for future advanced quests: window.blessedEligible().
  // Every name and number here is a first pass for the author to tune: edit DEFS below.
  // State: game.blessing = { unlocked, members:{id:true}, titles:{id:true}, titlesGiven }; per fight: game.blessCd = { id: round used }.
  // -------------------------------------------------------------------
  // passive coefficients are per level (hp 0.05 at level 1000 adds 50 HP); ability parts: ward/heal/strike/expose/haste
  const DEFS = {
    san:      { passive: { name: 'Dawnlit Reserve',     desc: 'More health and magic.',                     hp: 0.04, magic: 0.06 },
                ability: { name: 'Dawnbreak',           icon: '🌅', cd: 5, desc: 'A bright, heavy strike that also leaves the enemy exposed for 2 turns.', parts: [{ k: 'strike', mult: 3.0 }, { k: 'expose', turns: 2, pct: 0.15 }] } },
    joel:     { passive: { name: 'Steadfast Tide',      desc: 'More health and defence.',                   hp: 0.07, defense: 0.02, atk: 0.03 },
                ability: { name: 'Bulwark of the Tide', icon: '🛡️', cd: 6, desc: 'The whole party takes 30% less damage for 3 turns.', parts: [{ k: 'ward', pct: 0.30, turns: 3 }] } },
    jade:     { passive: { name: 'Unbowed',             desc: 'More health and defence.',                   hp: 0.07, defense: 0.02, atk: 0.03 },
                ability: { name: 'Guardian’s Vigil',    icon: '🏛️', cd: 5, desc: 'Heals the party for 15% of their health and shields them for 2 turns.', parts: [{ k: 'heal', pct: 0.15 }, { k: 'ward', pct: 0.15, turns: 2 }] } },
    devon:    { passive: { name: 'The Patient Dragon',  desc: 'More magic and health.',                     magic: 0.06, hp: 0.04 },
                ability: { name: 'Dragon’s Reckoning',  icon: '🐉', cd: 5, desc: 'A heavy spell strike.', parts: [{ k: 'strike', mult: 3.5 }] } },
    sky:      { passive: { name: 'Quiet Mending',       desc: 'More health and magic.',                     hp: 0.05, magic: 0.05 },
                ability: { name: 'Mystic Mending',      icon: '🌿', cd: 5, desc: 'Heals the whole party for 30% of their health.', parts: [{ k: 'heal', pct: 0.30 }] } },
    levi:     { passive: { name: 'Long Sight',          desc: 'More damage and speed.',                     atk: 0.06, spd: 4 },
                ability: { name: 'Shadow Volley',       icon: '🏹', cd: 5, desc: 'A strike that marks the enemy: 20% more damage for 2 turns.', parts: [{ k: 'strike', mult: 3.0 }, { k: 'expose', turns: 2, pct: 0.20 }] } },
    sally:    { passive: { name: 'Light Step',          desc: 'More damage and speed.',                     atk: 0.06, spd: 4 },
                ability: { name: 'Quiet Opening',       icon: '🗡️', cd: 6, desc: 'One heavy strike from cover.', parts: [{ k: 'strike', mult: 4.0 }] } },
    aisyah:   { passive: { name: 'A Full Ledger',       desc: 'More health and damage.',                    hp: 0.05, atk: 0.03 },
                ability: { name: 'Quartermaster’s Windfall', icon: '📒', cd: 6, desc: 'The party acts 25% faster for 3 turns.', parts: [{ k: 'haste', pct: 25, turns: 3 }] } },
    mezstorm: { passive: { name: 'Weathered Calm',      desc: 'More magic and health.',                     magic: 0.07, hp: 0.03 },
                ability: { name: 'Calm Before the Storm', icon: '⛈️', cd: 5, desc: 'A storm strike that quickens the party for 2 turns.', parts: [{ k: 'strike', mult: 3.3 }, { k: 'haste', pct: 15, turns: 2 }] } },
    sairen:   { passive: { name: 'Unseen',              desc: 'More damage and speed.',                     atk: 0.05, spd: 4 },
                ability: { name: 'Unseen Cut',          icon: '🌑', cd: 5, desc: 'A quick strike that exposes the enemy: 25% more damage for 3 turns.', parts: [{ k: 'strike', mult: 2.0 }, { k: 'expose', turns: 3, pct: 0.25 }] } },
    vaeren:   { passive: { name: 'Tideward',            desc: 'Much more health and defence.',              hp: 0.08, defense: 0.02 },
                ability: { name: 'Tide’s Shelter',      icon: '🌊', cd: 6, desc: 'The whole party takes 25% less damage for 3 turns.', parts: [{ k: 'ward', pct: 0.25, turns: 3 }] } },
    joelle:   { passive: { name: 'Starlit',             desc: 'More health and magic.',                     hp: 0.06, magic: 0.04 },
                ability: { name: 'Starlit Veil',        icon: '✨', cd: 6, desc: 'Heals the party for 15% of their health and shields them for 2 turns.', parts: [{ k: 'heal', pct: 0.15 }, { k: 'ward', pct: 0.15, turns: 2 }] } },
    soel:     { passive: { name: 'Nine Lives, Allegedly', desc: 'More health.',                             hp: 0.06 },
                ability: { name: 'Soel’s Watch',        icon: '🐈', cd: 6, desc: 'The whole party takes 20% less damage for 2 turns.', parts: [{ k: 'ward', pct: 0.20, turns: 2 }] } }
  };
  const ORDER = ['san', 'joel', 'jade', 'devon', 'sky', 'levi', 'sally', 'aisyah', 'mezstorm', 'sairen', 'vaeren', 'joelle', 'soel'];
  const DAWNWARDENS = ['san', 'joel', 'jade', 'vaeren', 'joelle', 'soel'];
  window.FOUNDERS_BLESSING = DEFS;

  function st(){ const b = game.blessing = game.blessing || { unlocked: false, members: {}, titles: {} }; b.members = b.members || {}; b.titles = b.titles || {}; return b; }
  function nameOf(id){ const m = (typeof ALL_PARTY !== 'undefined' ? ALL_PARTY : []).find(function(x){ return x.id === id; }); return m ? (m.name.charAt(0) + m.name.slice(1).toLowerCase()) : (id.charAt(0).toUpperCase() + id.slice(1)); }
  window.blessingUnlocked = function(){ return !!(typeof game !== 'undefined' && game && game.blessing && game.blessing.unlocked); };
  window.isBlessed = function(id){ return window.blessingUnlocked() && !!game.blessing.members[id]; };
  window.isDawnwarden = function(id){ return !!(game && game.blessing && game.blessing.titles && game.blessing.titles[id]); };
  window.blessedEligible = function(){ return window.blessingUnlocked(); };   // future advanced quests ask this

  window.unlockBlessedProgression = function(){
    const b = st();
    if (b.unlocked) return false;
    b.unlocked = true;
    ORDER.forEach(function(id){ b.members[id] = true; });
    if (typeof window.recordChronicleEntry === 'function') window.recordChronicleEntry('The founders’ blessing lifts the whole crew a step: each of them gains a permanent benefit and a new ability.', '🌟');
    if (typeof window.notify === 'function') window.notify({ icon: '🌟', title: 'The Founders’ Blessing', text: 'Every one of the crew has a permanent benefit and a new ability in the Skill menu. Details are in the Founders’ Blessing panel on the Crew screen.', kind: 'info', duration: 9000 });
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    return true;
  };
  window.grantDawnwardenTitles = function(){
    const b = st();
    if (b.titlesGiven) return false;
    b.titlesGiven = true;
    DAWNWARDENS.forEach(function(id){ b.titles[id] = true; });
    if (typeof window.recordChronicleEntry === 'function') window.recordChronicleEntry('San, Joel and Jade are named Dawnwardens, and the same recognition settles on Vaeren, Joelle and Soel.', '🏅');
    if (typeof window.notify === 'function') window.notify({ icon: '🏅', title: 'Dawnwardens', text: 'San, Joel, Jade, Vaeren, Joelle and Soel are named Dawnwardens. Everyone keeps their blessing, whatever their title.', kind: 'info', duration: 8000 });
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    return true;
  };

  // ---- passives: added to the gear bonuses, so every stat that reads them sees them ----
  const oldGear = window.gearBonuses;
  if (typeof oldGear === 'function') window.gearBonuses = function(id){
    const out = oldGear.apply(this, arguments);
    try {
      if (window.isBlessed(id) && DEFS[id]) {
        const p = DEFS[id].passive, L = (typeof level === 'function') ? level() : 1;
        out.hp += Math.round(L * (p.hp || 0)); out.atk += Math.round(L * (p.atk || 0)); out.magic += Math.round(L * (p.magic || 0));
        out.defense += Math.round(L * (p.defense || 0)); out.spd += Math.round(p.spd || 0);
      }
    } catch (e) {}
    return out;
  };

  // ---- abilities ----
  function party(){ try { return getCrimsonCombatParty(); } catch (e) { return []; } }
  function currentActor(){ const alive = party().filter(function(m){ return partyHpOf(m) > 0; }); return alive[game.combatTurn]; }
  function inFight(){ return !!(game.inCombat && !game.combatResolved && game.combatEnemyHp > 0); }
  function cdLeft(id){
    const used = (game.blessCd || {})[id];
    if (used == null) return 0;
    return Math.max(0, DEFS[id].ability.cd - ((game.combatRound || 1) - used));
  }
  window.blessReady = function(actor){ return !!(actor && DEFS[actor.id] && window.isBlessed(actor.id) && inFight() && cdLeft(actor.id) === 0); };
  window.blessOptions = function(actor){
    if (!actor || !DEFS[actor.id] || !window.isBlessed(actor.id) || !inFight()) return [];
    const a = DEFS[actor.id].ability, left = cdLeft(actor.id);
    if (left > 0) return [];
    return [{ fn: "useBlessedAbility('" + actor.id + "')", icon: a.icon, name: a.name, desc: 'Founders’ Blessing: ' + a.desc + ' Once every ' + a.cd + ' rounds.' }];
  };
  window.blessStatus = function(actor){ if (!actor || !DEFS[actor.id] || !window.isBlessed(actor.id)) return null; const l = cdLeft(actor.id); return l > 0 ? 'Recovering: ready in ' + l + ' round' + (l === 1 ? '' : 's') + '.' : ''; };

  function applyPart(actor, part, log){
    if (part.k === 'ward') {
      game.shieldTurns = Math.max(game.shieldTurns || 0, part.turns); game.shieldPct = Math.max(game.shieldPct || 0, part.pct);
      log.push('the whole party takes ' + Math.round(part.pct * 100) + '% less damage for ' + part.turns + ' turns');
    } else if (part.k === 'heal') {
      party().forEach(function(m){ const cur = partyHpOf(m); if (cur <= 0) return; const max = effectiveMaxHp(m); game.partyHp[m.id] = Math.min(max, cur + Math.round(max * part.pct)); });
      log.push('the party recovers ' + Math.round(part.pct * 100) + '% of their health');
    } else if (part.k === 'expose') {
      game.enemyVulnerable = Math.max(game.enemyVulnerable || 0, part.turns); game.enemyVulnerablePct = Math.max(game.enemyVulnerablePct || 0, part.pct);
      log.push('the enemy takes ' + Math.round(part.pct * 100) + '% more damage for ' + part.turns + ' turns');
    } else if (part.k === 'haste') {
      game.hasteTurns = Math.max(game.hasteTurns || 0, part.turns); game.hastePct = Math.max(game.hastePct || 0, part.pct);
      log.push('the party acts ' + part.pct + '% faster for ' + part.turns + ' turns');
    } else if (part.k === 'strike') {
      const gb = gearBonuses(actor.id);
      let dmg = Math.round((18 + rollDice('1d20') + gb.atk + gb.magic) * (part.mult || 1) * (1 + ((game.ship && game.ship.cannons) || 0) * 0.12));
      if (game.hasteTurns > 0) dmg = Math.round(dmg * (1 + game.hastePct / 100));
      if (game.enemyVulnerable > 0) dmg = Math.round(dmg * (1 + game.enemyVulnerablePct));
      game.combatEnemyHp = Math.max(0, game.combatEnemyHp - dmg);
      log.push('<span class="damage">' + dmg + '</span> damage');
    }
  }
  window.useBlessedAbility = function(id){
    if (!inFight()) return;
    const actor = currentActor();
    if (!actor || (id && actor.id !== id) || !window.blessReady(actor)) { if (typeof toast === 'function') toast('🌟 ' + (window.blessStatus(actor) || 'Not available right now.')); return; }
    const def = DEFS[actor.id].ability, hp0 = game.combatEnemyHp, bits = [];
    // strikes go first so the exposure from the same action does not boost its own blow
    def.parts.slice().sort(function(a, b){ return (a.k === 'strike' ? 0 : 1) - (b.k === 'strike' ? 0 : 1); }).forEach(function(p){ applyPart(actor, p, bits); });
    game.blessCd = game.blessCd || {}; game.blessCd[actor.id] = game.combatRound || 1;
    logCombat('🌟 <b>' + esc(actor.name) + ' uses ' + def.icon + ' ' + def.name + '!</b> ' + bits.join('; ') + '.');
    try { if (typeof window.roundRulesAfterDamage === 'function' && game.combatEnemyHp < hp0) window.roundRulesAfterDamage(hp0); } catch (e) {}
    game.skillMenuOpen = false; game.spellMenuOpen = false; game.itemMenuOpen = false;
    if (typeof endTurn === 'function') endTurn();
  };
  // auto-battle: use it when it helps
  window.blessAutoUse = function(actor){
    if (!window.blessReady(actor)) return false;
    const parts = DEFS[actor.id].ability.parts, kinds = parts.map(function(p){ return p.k; });
    if (kinds.indexOf('ward') >= 0 && kinds.indexOf('strike') < 0 && ((game.shieldTurns || 0) > 1 || (window.accordActive && window.accordActive()))) return false;
    if (kinds.indexOf('heal') >= 0 && kinds.indexOf('strike') < 0) {
      const hurt = party().some(function(m){ const h = partyHpOf(m); return h > 0 && h / effectiveMaxHp(m) < 0.65; });
      if (!hurt) return false;
    }
    if (kinds.indexOf('haste') >= 0 && kinds.indexOf('strike') < 0 && (game.hasteTurns || 0) > 1) return false;
    window.useBlessedAbility(actor.id);
    return true;
  };
  // per-fight state resets with the fight
  const oldStart = window.startCombat;
  if (typeof oldStart === 'function') window.startCombat = function(){ const r = oldStart.apply(this, arguments); game.blessCd = {}; return r; };

  // ---- the Crew screen panel ----
  function panelHtml(){
    const b = st();
    let h = '<details class="panel" id="foundersBlessingPanel" style="margin-top:12px;"' + (game.fbOpen ? ' open' : '') + ' ontoggle="game.fbOpen = this.open"><summary class="panel-title" style="cursor:pointer;">🌟 Founders’ Blessing</summary>' +
      '<p style="font-size:.78rem;opacity:.8;margin:6px 0;">A permanent benefit and a new ability for each of the crew, kept whoever is fielded. Abilities are in the Skill menu in a fight and recover after a few rounds. Dawnwarden is an honour: it changes nothing about a blessing.</p>';
    ORDER.forEach(function(id){
      const d = DEFS[id]; if (!d || !b.members[id]) return;
      h += '<div style="margin:8px 0;padding:8px 10px;border:1px solid rgba(232,197,71,.3);border-radius:8px;">' +
        '<div style="font-family:Cinzel,serif;color:var(--gold);font-size:.88rem;">' + esc(nameOf(id)) + (b.titles[id] ? ' <span style="font-size:.7rem;color:var(--sand);">· 🏅 Dawnwarden</span>' : '') + '</div>' +
        '<div style="font-size:.78rem;margin-top:3px;">✦ <b>' + esc(d.passive.name) + '</b> (passive): ' + esc(d.passive.desc) + '</div>' +
        '<div style="font-size:.78rem;margin-top:2px;">' + d.ability.icon + ' <b>' + esc(d.ability.name) + '</b> (ability, every ' + d.ability.cd + ' rounds): ' + esc(d.ability.desc) + '</div></div>';
    });
    return h + '</details>';
  }
  const oldRenderParty = window.renderPartyScreen;
  window.renderPartyScreen = function(){
    if (oldRenderParty) oldRenderParty.apply(this, arguments);
    try {
      const c = document.getElementById('partyDetail');
      if (!c || !window.blessingUnlocked()) return;
      const old = document.getElementById('foundersBlessingPanel'); if (old) old.remove();
      c.insertAdjacentHTML('beforeend', panelHtml());
    } catch (e) {}
  };
})();
