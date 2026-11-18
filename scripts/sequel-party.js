(function(){
  // -------------------------------------------------------------------
  // THE SEQUEL PARTY. When the Crimson Horizon prologue is read, the voyage changes
  // hands: Sky, Levi and Sally come aboard, and Senedra, Eliz and Zaki (the nieces and
  // nephew) go back to Fair Tide to make room. Aisyah, Mez and the rest of the party stay.
  // It happens once, automatically, as soon as the three newcomers have joined; after
  // that the fielding screen is yours again and nothing here touches it.
  // -------------------------------------------------------------------
  const BENCH = ['senedra', 'eliz', 'zaki'];
  const FIELD = ['sky', 'levi', 'sally'];
  function prologueRead(){ return !!(game.arc42Complete && game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[1]); }
  function joined(id){ return !!(game.foundCompanions && game.foundCompanions[id]) && (typeof getActiveParty !== 'function' || getActiveParty().some(function(m){ return m.id === id; })); }   // really in the party, not just flagged
  function nm(id){ const m = (typeof ALL_PARTY !== 'undefined' ? ALL_PARTY : []).find(function(x){ return x.id === id; }); return m ? m.name.charAt(0) + m.name.slice(1).toLowerCase() : id; }

  function apply(){
    if (game.sequelPartyApplied || !prologueRead()) return;
    if (!FIELD.every(joined)) return;                       // wait for the newcomers to actually join
    game.sequelPartyApplied = true;
    game.fieldedIds = game.fieldedIds || ['san'];
    game.fieldingDecided = game.fieldingDecided || ['san'];
    const sent = [], came = [];
    BENCH.forEach(function(id){
      if (game.fieldedIds.indexOf(id) !== -1) { game.fieldedIds = game.fieldedIds.filter(function(x){ return x !== id; }); sent.push(id); }
      if (game.fieldingDecided.indexOf(id) === -1) game.fieldingDecided.push(id);   // stay home: not re-added to an open slot
    });
    const cap = (typeof window.getShipFieldCap === 'function') ? window.getShipFieldCap() : 8;
    const free = function(id){ return typeof window.isFreeFieldId === 'function' && window.isFreeFieldId(id); };
    FIELD.forEach(function(id){
      if (game.fieldingDecided.indexOf(id) === -1) game.fieldingDecided.push(id);
      if (game.fieldedIds.indexOf(id) !== -1) return;
      const count = game.fieldedIds.filter(function(x){ return !free(x); }).length;
      if (free(id) || count < cap) { game.fieldedIds.push(id); came.push(id); }
    });
    if (sent.length || came.length) {
      const msg = (came.length ? came.map(nm).join(', ') + ' join the voyage. ' : '') + (sent.length ? sent.map(nm).join(', ') + ' head back to Fair Tide to make room.' : '');
      if (typeof window.notify === 'function') window.notify({ icon: '⛵', title: 'A new crew for the new voyage', text: msg, kind: 'info' });
      else if (typeof toast === 'function') toast('⛵ ' + msg, 4600);
      if (typeof logEvent === 'function') logEvent('⛵ ' + msg, 'gold');
    }
  }
  window.applySequelParty = apply;

  const oldGetFielded = window.getFieldedIds;
  if (typeof oldGetFielded === 'function') {
    window.getFieldedIds = function(){
      try { apply(); } catch(e) {}
      return oldGetFielded.apply(this, arguments);
    };
  }
  const oldRead = window.markCrimsonHorizonChapterRead;
  if (typeof oldRead === 'function') {
    window.markCrimsonHorizonChapterRead = function(){
      const r = oldRead.apply(this, arguments);
      try { apply(); if (typeof renderPartyScreen === 'function') renderPartyScreen(); } catch(e) {}
      return r;
    };
  }
})();
