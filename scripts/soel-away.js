(function(){
  // -------------------------------------------------------------------
  // SOEL AWAY. Two windows in Arc IX where Soel is not on the ship:
  //   after Chapter 12 (The Price of a Blessing) he rests, overextended, until Chapter 13 is read
  //   after Chapter 20 (The Place Beyond the Tide) he is gone, neither crossed nor returned, until Chapter 21 (Stay) is read
  // While a window is open he is left out of the crew: the Companion Log, the fielded party and combat. A player who reads the two chapters in one go
  // never sees the window. Saves past Chapter 13 and Chapter 21 are unaffected.
  // -------------------------------------------------------------------
  function prog(){ return (game && game.comicProgress9) || {}; }
  window.soelAwayState = function(){
    const p = prog();
    if (p[20] && !p[21]) return { kind: 'away', text: 'Soel is gone. He did not cross the boundary and he did not come home. Nobody knows where he went.', back: 'Stay' };
    if (p[12] && !p[13]) return { kind: 'rest', text: 'Soel is resting after protecting the crew. He is weak and withdrawn, and he will not come near anyone until he is ready.', back: 'The Cat Who Chose' };
    return null;
  };
  const oldActive = window.getActiveParty;
  if (typeof oldActive === 'function') window.getActiveParty = function(){
    const list = oldActive.apply(this, arguments);
    return window.soelAwayState() ? list.filter(function(m){ return m.id !== 'soel'; }) : list;
  };
  function note(title, text){ try { if (typeof window.notify === 'function') window.notify({ icon: '🐾', title: title, text: text, kind: 'info', duration: 6500 }); else if (typeof toast === 'function') toast('🐾 ' + text, 4200); } catch (e) {} }
  // Notice when a window opens or closes. A short watcher, because a chapter with a clip completes after the clip ends.
  let lastKind;
  setInterval(function(){
    try {
      if (typeof game === 'undefined' || !game || !window.gameSessionActive && typeof gameSessionActive !== 'undefined' && !gameSessionActive) return;
      const st = window.soelAwayState(), kind = st ? st.kind : null;
      if (lastKind === undefined) { lastKind = kind; return; }
      if (kind !== lastKind) {
        if (kind) note(kind === 'rest' ? 'Soel is resting' : 'Soel is gone', st.text);
        else note('Soel is back', lastKind === 'rest' ? 'Soel is back on his feet, and back with the crew.' : 'Soel is home. He is back with the crew.');
        lastKind = kind;
        try { if (typeof renderPartyList === 'function') renderPartyList(); } catch (e) {}
      }
    } catch (e) {}
  }, 1500);
  const oldParty = window.renderPartyScreen;
  if (typeof oldParty === 'function') window.renderPartyScreen = function(){
    const r = oldParty.apply(this, arguments);
    try {
      const st = window.soelAwayState(), c = document.getElementById('partyDetail');
      if (st && c) c.insertAdjacentHTML('afterbegin', '<div class="panel" style="margin-bottom:12px;"><div class="panel-title">🐾 Soel</div><p style="font-size:.85rem;opacity:.85;margin:4px 0;">' + st.text + ' He returns when you read “' + st.back + '”.</p></div>');
    } catch (e) {}
    return r;
  };
})();
