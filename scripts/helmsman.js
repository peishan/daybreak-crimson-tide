(function(){
  // -------------------------------------------------------------------
  // THE HELMSMAN. At the start of a new voyage the player can choose to play San (nothing changes) or to sail as a helmsman of their own naming:
  // an extra crew member who fights beside the group and shows on the title card. He is not a protagonist: the story, San's role and every other
  // mechanic stay as they are. He is a free-field member (he never takes a party slot) and a support class built from the buffs the game already has.
  // State: game.avatar = { gender: 'female' | 'male', name }. Only a male choice adds the member (id 'helmsman'). Existing saves have no avatar and do
  // not change; the Companion Log offers a one-time choice for them.
  // -------------------------------------------------------------------
  const ID = 'helmsman', MAX_NAME = 16;
  const DESC = 'The Daybreak’s helmsman. Steady hands, a good ear for the water, and a talent for keeping the crew one step ahead of it.';

  CLASS_KIT[ID] = { role: 'support',
    spells: [
      {name:'Steady Course', icon:'🧭', mp:12, levelReq:1,   desc:'A firm hand on the wheel steadies the crew against the next blows.', buffType:'defense', buffVal:5, buffTurns:3},
      {name:'Wind in the Sails', icon:'⛵', mp:14, levelReq:6,   desc:'He finds the wind and the whole crew moves faster.', buffType:'haste', buffVal:6, buffTurns:3},
      {name:'Read the Water', icon:'🌊', mp:16, levelReq:12,  desc:'He reads the current and shows where the enemy is weak.', buffType:'expose', buffVal:18, buffTurns:3},
      {name:'Hard to Port', icon:'⚓', mp:20, levelReq:20,  desc:'A sharp turn that takes the crew out of harm’s way.', buffType:'defense', buffVal:9, buffTurns:4},
      {name:'Full Sail', icon:'💨', mp:26, levelReq:32,  desc:'Every sail set. The whole crew runs ahead of the fight.', buffType:'haste', buffVal:9, buffTurns:4},
      {name:'Hold Her Steady', icon:'🤝', mp:0,  levelReq:45,  desc:'A quiet word at the wheel restores the crew’s focus.', effect:'restoreMp', restoreAmt:40},
      {name:'Charted Weakness', icon:'🗺️', mp:30, levelReq:60,  desc:'Every chart he has ever drawn, laid over the enemy at once.', buffType:'expose', buffVal:34, buffTurns:4},
      {name:'Through the Gale', icon:'🌀', mp:36, levelReq:90,  desc:'He has steered through worse. The crew believes it.', buffType:'defense', buffVal:14, buffTurns:4},
      {name:'Fair Winds, Full Hands', icon:'🌅', mp:40, levelReq:140, desc:'The wind is behind everyone now.', buffType:'haste', buffVal:12, buffTurns:5},
      {name:'The Long Heading', icon:'🧭', mp:44, levelReq:200, desc:'A course set a long time ago, and held.', buffType:'expose', buffVal:48, buffTurns:5}
    ],
    skill: {name:'Take the Helm', icon:'☸️', mp:0, mult:1.3} };
  if (window.PARTY_GENDER) window.PARTY_GENDER[ID] = 'male';

  function av(){ return (typeof game !== 'undefined' && game && game.avatar) || null; }
  window.helmsmanActive = function(){ const a = av(); return !!(a && a.gender === 'male' && a.name); };
  function cleanName(s){ return String(s || '').replace(/[<>&"']/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME); }

  // The crew entry exists only for a player who chose it, so nobody else sees a locked card for him. The name is read live from the save.
  function sync(){
    try {
      const at = ALL_PARTY.findIndex(function(m){ return m.id === ID; });
      if (window.helmsmanActive()) {
        if (at < 0) ALL_PARTY.push({ id: ID, get name(){ return (av() && av().name ? av().name : 'HELMSMAN').toUpperCase(); }, role: 'Helmsman', combatRole: 'Support', hp: 80, mp: 90, portrait: '⚓', portraitAsset: null, desc: DESC });
        game.foundCompanions = game.foundCompanions || {};
        game.foundCompanions[ID] = true;
      } else if (at >= 0) {
        ALL_PARTY.splice(at, 1);
      }
    } catch (e) { console.error('helmsman sync', e); }
  }
  window.syncHelmsman = sync;
  ['renderPartyList', 'renderPartyScreen', 'loadGame', 'importSave'].forEach(function(name){
    const old = window[name];
    if (typeof old !== 'function') return;
    window[name] = function(){
      const r = old.apply(this, arguments);
      sync(); return r;
    };
  });
  // getActiveParty has to see the member before it filters, so it syncs first
  (function(){
    const old = window.getActiveParty;
    if (typeof old !== 'function') return;
    window.getActiveParty = function(){ sync(); return old.apply(this, arguments); };
  })();

  function apply(a){
    game.avatar = { gender: a.gender, name: a.name || '' };
    sync();
    if (window.helmsmanActive()) {
      const m = ALL_PARTY.find(function(x){ return x.id === ID; });
      if (m) {
        game.partyHp = game.partyHp || {}; game.partyMp = game.partyMp || {};
        try { game.partyHp[ID] = effectiveMaxHp(m); game.partyMp[ID] = effectiveMaxMp(m); } catch (e) { game.partyHp[ID] = m.hp; game.partyMp[ID] = m.mp; }
        if (Array.isArray(game.fieldedIds) && game.fieldedIds.indexOf(ID) < 0) game.fieldedIds.push(ID);
      }
    }
    try { if (typeof saveGameQuiet === 'function') saveGameQuiet(); } catch (e) {}
  }

  // ---- the choice ----
  function closeOverlay(){ const o = document.getElementById('helmsmanChoice'); if (o) o.remove(); }
  function openChoice(done, opts){
    opts = opts || {};
    closeOverlay();
    const o = document.createElement('div');
    o.id = 'helmsmanChoice';
    o.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(5,8,14,.88);display:flex;align-items:center;justify-content:center;padding:16px;';
    o.innerHTML =
      '<div style="max-width:420px;width:100%;background:#101826;border:1px solid #c9a24a;border-radius:12px;padding:18px;color:#f2ead7;font-family:inherit;">' +
      '<div style="font-size:1.15rem;font-weight:700;margin-bottom:6px;">⚓ Who is at the wheel?</div>' +
      '<p style="font-size:.85rem;opacity:.85;margin:0 0 12px;">The story is the same either way, and San stays the captain. Choose how you sail.</p>' +
      '<button id="hmSan" class="btn" style="display:block;width:100%;margin-bottom:8px;text-align:left;padding:10px 12px;">🧙‍♀️ <strong>Play as San</strong><br><span style="font-size:.78rem;opacity:.8;">The captain, as always.</span></button>' +
      '<button id="hmHelm" class="btn" style="display:block;width:100%;margin-bottom:8px;text-align:left;padding:10px 12px;">⚓ <strong>Sail as a helmsman</strong><br><span style="font-size:.78rem;opacity:.8;">A new crew member of your own naming. He steers, fights beside the crew and shows on your title card. He does not take a party slot.</span></button>' +
      '<div id="hmNameRow" style="display:none;margin-top:8px;"><label style="font-size:.8rem;opacity:.85;">Your name (up to ' + MAX_NAME + ' letters)</label>' +
      '<input id="hmName" type="text" maxlength="' + MAX_NAME + '" placeholder="Name" style="width:100%;margin:6px 0 8px;padding:9px;border-radius:8px;border:1px solid #c9a24a;background:#0b1220;color:#f2ead7;font-size:1rem;">' +
      '<button id="hmGo" class="btn btn-success" style="width:100%;">Sign on</button></div>' +
      (opts.cancel ? '<button id="hmCancel" class="btn btn-small" style="margin-top:10px;opacity:.8;">Not now</button>' : '') +
      '</div>';
    document.body.appendChild(o);
    const $ = function(id){ return document.getElementById(id); };
    $('hmSan').onclick = function(){ closeOverlay(); done({ gender: 'female' }); };
    $('hmHelm').onclick = function(){ $('hmNameRow').style.display = 'block'; setTimeout(function(){ try { $('hmName').focus(); } catch (e) {} }, 50); };
    $('hmGo').onclick = function(){
      const n = cleanName($('hmName').value);
      if (!n) { $('hmName').style.borderColor = '#e74c3c'; return; }
      closeOverlay(); done({ gender: 'male', name: n });
    };
    if (opts.cancel) $('hmCancel').onclick = closeOverlay;
  }
  function welcome(){
    const a = av(); if (!a || a.gender !== 'male') return;
    try {
      if (typeof window.notify === 'function') window.notify({ icon: '⚓', title: a.name + ' signs on', text: a.name + ' takes the helm of the Daybreak. San is still the captain; he steers, and fights, beside the crew.', kind: 'info', duration: 8000 });
    } catch (e) {}
  }

  // New voyage: ask first, then start. A saved voyage is never touched until the player really starts a new one.
  const oldStart = window.startGame;
  if (typeof oldStart === 'function') {
    let go = false;
    window.startGame = function(){
      if (go) { go = false; return oldStart.apply(this, arguments); }
      const self = this, args = arguments;
      openChoice(function(a){
        go = true;
        game.avatar = { gender: a.gender, name: a.name || '' };
        sync();
        const r = oldStart.apply(self, args);
        go = false;
        apply(a); welcome();
        try { if (typeof updateUI === 'function') updateUI(); if (typeof renderLandingV24 === 'function') renderLandingV24(); } catch (e) {}
        return r;
      });
    };
  }

  // ---- Companion Log: the one-time offer for a voyage that is already under way, and a rename for a helmsman ----
  window.chooseHelmsmanNow = function(){
    openChoice(function(a){ apply(a); welcome(); if (typeof renderPartyScreen === 'function') renderPartyScreen(); try { renderLandingV24(); } catch (e) {} }, { cancel: true });
  };
  window.renameHelmsman = function(){
    const cur = av() && av().name || '';
    const n = cleanName(window.prompt('Your helmsman’s name:', cur));
    if (!n) return;
    game.avatar.name = n; if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderPartyScreen === 'function') renderPartyScreen();
    try { renderLandingV24(); } catch (e) {}
  };
  const oldParty = window.renderPartyScreen;
  if (typeof oldParty === 'function') window.renderPartyScreen = function(){
    const r = oldParty.apply(this, arguments);
    try {
      const c = document.getElementById('partyDetail'); if (!c) return r;
      let html = '';
      if (window.helmsmanActive()) html = '<div class="panel" style="margin-bottom:12px;"><div class="panel-title">⚓ Your helmsman</div><p style="font-size:.85rem;opacity:.85;margin:4px 0 8px;">' + esc(av().name) + ' is at the wheel. He fights beside the crew and does not take a party slot.</p><button class="btn btn-small" onclick="renameHelmsman()">✏️ Rename</button></div>';
      else if (!av()) html = '<div class="panel" style="margin-bottom:12px;"><div class="panel-title">⚓ A helmsman of your own?</div><p style="font-size:.85rem;opacity:.85;margin:4px 0 8px;">Add a crew member of your own naming. He fights beside the crew and shows on your title card. The story does not change.</p><button class="btn btn-small" onclick="chooseHelmsmanNow()">⚓ Sign on a helmsman</button> <button class="btn btn-small" onclick="game.avatar={gender:\'female\'};saveGameQuiet();renderPartyScreen();" style="opacity:.75;">Keep playing as San</button></div>';
      if (html) c.insertAdjacentHTML('afterbegin', html);
    } catch (e) {}
    return r;
  };

  // ---- Title card: show the helmsman's name instead of San's. The save is read directly, as the card does, since nothing is loaded yet. ----
  const oldLanding = window.renderLandingV24;
  if (typeof oldLanding === 'function') window.renderLandingV24 = function(){
    const r = oldLanding.apply(this, arguments);
    try {
      let a = av(), saved = null;
      try { const raw = localStorage.getItem(SAVE_KEY); if (raw) saved = JSON.parse(raw); } catch (e) {}
      if (saved && saved.avatar) a = saved.avatar;
      if (!a || a.gender !== 'male' || !a.name) return r;
      const set = function(id, v){ const e = document.getElementById(id); if (e) e.textContent = v; };
      set('v24Captain', a.name);
      const role = document.querySelector('.ct-v24-role'); if (role) role.textContent = 'Helmsman';
      const hp = saved && saved.partyHp && saved.partyHp[ID] != null ? saved.partyHp[ID] : (game.partyHp && game.partyHp[ID]);
      if (hp != null) { const e = document.getElementById('v24HP'); if (e) e.textContent = String(e.textContent).replace(/^[^/]*/, Math.max(0, Math.round(hp)) + ' '); }
      const box = document.querySelector('.ct-v24-avatar');
      if (box && !box.dataset.helm) {
        box.dataset.helm = '1';
        box.innerHTML = '<img src="assets/portraits/helmsman.png" alt="" onerror="this.replaceWith(Object.assign(document.createElement(\'span\'),{textContent:\'⚓\',style:\'font-size:2.6rem;display:flex;align-items:center;justify-content:center;width:100%;height:100%;\'}))">';
      }
    } catch (e) {}
    return r;
  };
  // A voyage loaded before this script ran (or after a reload) still needs the member in place
  try { if (typeof game !== 'undefined') sync(); } catch (e) {}
})();
