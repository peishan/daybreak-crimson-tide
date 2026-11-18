(function(){
  // -------------------------------------------------------------------
  // BONDS ON THE ROAD. When the crew is away from Fair Tide the Horizon Engine lets
  // you check in with the roster remotely, but a bond is time spent WITH someone, so
  // while you are away you can only spend it on people who are in the travelling
  // party (fielded). Back at Fair Tide in person, every bond is open.
  //
  // The Bonds tab itself is open remotely (it used to be blocked outright); each bond
  // that needs someone who is not aboard is locked and says who.
  //
  // Fair Tide-based groups (the TM crew, San's old office) and residents (Dre,
  // Jovie, Sera) are never aboard, so they only open in person. Mirelle's bond
  // with Sairen needs only Sairen (she handles things remotely); the in-person
  // parts of it still wait for her to visit (hang-out-companions.js).
  // -------------------------------------------------------------------
  const NEEDS = {
    san_joel: ['joel'], san_trio: ['mimi', 'renn', 'erynn'],
    tm_crew: ['@fairtide'], c_adv_crew: ['@fairtide'],
    san_aisyah: ['aisyah'], san_mez: ['mezstorm'], san_eliz: ['eliz'], san_senedra: ['senedra'],
    san_twins: ['vaeren', 'joelle'], san_dre: ['dre'], san_jovie: ['jovie'], san_sera: ['sera'], san_joy: ['ate_joy'],
    san_sairen: ['sairen', 'joel'], sairen_twins: ['sairen', 'vaeren', 'joelle'], sairen_sally: ['sairen', 'sally'], sairen_mirelle: ['sairen'],
    levi_liang: ['levi', 'kw_liang'], levi_senedra: ['levi', 'senedra'], levi_iris: ['levi', 'iris'],
    devon_joel: ['devon', 'joel'], devon_aldric: ['devon', 'ser_aldric']
    // san_crew: the crew you are travelling with, by definition: not listed, always allowed.
  };
  const HANDLERS = { hangOutWithJoel: 'san_joel', hangOutWithCrew: 'san_crew', hangOutWithTrio: 'san_trio', hangOutWithJoy: 'san_joy' };
  (window.HANG_OUT_COMPANIONS || []).forEach(function(c){ HANDLERS[c.handlerName] = c.key; });

  function away(){ return game.location !== 'fair_tide'; }
  function aboard(id){
    if (id === '@fairtide') return false;
    try { return typeof window.isFielded === 'function' ? !!window.isFielded(id) : true; } catch(e) { return true; }
  }
  function nameOf(id){
    if (id === '@fairtide') return 'Fair Tide';
    const m = (typeof ALL_PARTY !== 'undefined' ? ALL_PARTY : []).find(function(x){ return x.id === id; });
    if (m) return m.name.charAt(0) + m.name.slice(1).toLowerCase();
    return id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' ');
  }
  // Returns the list of people missing from the party, or [] if the bond is open.
  window.bondMissingAboard = function(trackKey){
    if (!away()) return [];
    return (NEEDS[trackKey] || []).filter(function(id){ return !aboard(id); });
  };
  function lockText(trackKey){
    const miss = window.bondMissingAboard(trackKey);
    if (!miss.length) return '';
    if (miss[0] === '@fairtide') return 'Only in person at Fair Tide.';
    return 'Needs ' + miss.map(nameOf).join(', ') + ' in the travelling party, or you at Fair Tide.';
  }

  const oldSpend = window.spendTimeWithBond;
  if (typeof oldSpend === 'function') {
    window.spendTimeWithBond = function(trackKey){
      const t = lockText(trackKey);
      if (t) { if (typeof toast === 'function') toast('🔒 ' + t, 3400); return; }
      return oldSpend.apply(this, arguments);
    };
  }

  const oldRenderBonds = window.renderBondsTab;
  window.renderBondsTab = function(){
    if (oldRenderBonds) oldRenderBonds.apply(this, arguments);
    try {
      if (!away()) return;
      const el = document.getElementById('ft-tab-bonds'); if (!el) return;
      Object.keys(window.BOND_TRACKS || {}).forEach(function(key){
        const t = lockText(key); if (!t) return;
        const label = window.BOND_TRACKS[key].label;
        const card = Array.prototype.find.call(el.querySelectorAll('article.quest-item'), function(a){ const st = a.querySelector('strong'); return st && st.textContent.indexOf(label) !== -1; });
        if (card) {
          card.querySelectorAll('button').forEach(function(b){ b.disabled = true; });
          card.insertAdjacentHTML('beforeend', '<div style="font-size:.72rem;opacity:.7;margin-top:4px;">🔒 ' + t + '</div>');
        }
      });
      el.querySelectorAll('button[onclick]').forEach(function(b){
        const m = /^(\w+)\(/.exec(b.getAttribute('onclick') || '');
        const key = m && HANDLERS[m[1]];
        if (key && lockText(key)) { b.disabled = true; b.title = lockText(key); }
      });
      el.insertAdjacentHTML('afterbegin', '<div style="font-size:.76rem;opacity:.8;background:rgba(120,180,255,.12);border:1px solid rgba(120,180,255,.35);border-radius:8px;padding:6px 10px;margin-bottom:8px;">📡 Away from Fair Tide: you can only spend bond time with people in the travelling party. The rest open when you are home.</div>');
    } catch(e) { if (window.console) console.warn('remote bonds failed', e); }
  };
})();
