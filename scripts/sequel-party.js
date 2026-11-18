(function(){
  // -------------------------------------------------------------------
  // THE SEQUEL CREW (from the author's unified Crimson Horizon sheet).
  //
  // Crimson Horizon sails with: the Tribute canon five (Jade, Devon, Sky, Levi, Sally),
  // the Crimson Tide main three (San, Joel, Aisyah), Mezstorm and Sairen (needed for the
  // story), and the twins and Soel. Everyone else goes home to Fair Tide: Sky takes Eliz's
  // place as the main healer, Levi takes Senedra's, and Senedra leads the scouts at Fair
  // Tide; Zaki, Mimi, Renn and Erynn stay with the settlement and the research team.
  //
  //  * When the Crimson Horizon prologue is read, and the canon five have joined, the
  //    party is rearranged once, automatically: the canon five come aboard, and every other
  //    fielded companion who is not on the sheet goes back to Fair Tide.
  //  * From then on the canon five, Aisyah and Mezstorm are story-required (like the
  //    canon-party lock in Tribute): they cannot be sent home. San, Joel, Sairen, the twins and
  //    Soel are already always aboard. Anyone else can still be fielded by hand if the ship
  //    has room.
  // -------------------------------------------------------------------
  const CANON = ['jade', 'devon', 'sky', 'levi', 'sally'];
  const REQUIRED = CANON.concat(['aisyah', 'mezstorm']);
  const HOME_NAMED = ['senedra', 'eliz', 'zaki', 'mimi', 'renn', 'erynn'];
  function prologueRead(){ return !!(game.arc42Complete && game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[1]); }
  function inParty(id){ return (typeof getActiveParty !== 'function') || getActiveParty().some(function(m){ return m.id === id; }); }
  function joined(id){ return !!(game.foundCompanions && game.foundCompanions[id]) && inParty(id); }
  function nm(id){ const m = (typeof ALL_PARTY !== 'undefined' ? ALL_PARTY : []).find(function(x){ return x.id === id; }); return m ? m.name.charAt(0) + m.name.slice(1).toLowerCase() : id; }
  const free = function(id){ return typeof window.isFreeFieldId === 'function' && window.isFreeFieldId(id); };

  window.sequelCrewActive = function(){ return !!game.sequelCrewApplied; };

  function apply(){
    if (game.sequelCrewApplied || !prologueRead()) return;
    if (!CANON.every(joined)) return;                       // wait for the canon five to actually join
    game.sequelCrewApplied = true;
    game.fieldedIds = game.fieldedIds || ['san'];
    game.fieldingDecided = game.fieldingDecided || ['san'];
    // Home: everyone fielded who is not on the sheet.
    const sent = [];
    game.fieldedIds.slice().forEach(function(id){
      if (id === 'san' || free(id) || REQUIRED.indexOf(id) !== -1) return;
      game.fieldedIds = game.fieldedIds.filter(function(x){ return x !== id; });
      sent.push(id);
    });
    HOME_NAMED.concat(sent).forEach(function(id){ if (game.fieldingDecided.indexOf(id) === -1) game.fieldingDecided.push(id); });   // stay home: not re-added to an open slot
    // Aboard: the canon five (then Aisyah and Mezstorm if they were somehow not).
    const came = [];
    const cap = (typeof window.getShipFieldCap === 'function') ? window.getShipFieldCap() : 8;
    REQUIRED.forEach(function(id){
      if (!joined(id)) return;
      if (game.fieldingDecided.indexOf(id) === -1) game.fieldingDecided.push(id);
      if (game.fieldedIds.indexOf(id) !== -1) return;
      game.fieldedIds.push(id); came.push(id);
    });
    const over = game.fieldedIds.filter(function(x){ return !free(x); }).length - cap;
    const msg = (came.length ? came.map(nm).join(', ') + ' join the voyage. ' : '') + (sent.length ? sent.map(nm).join(', ') + ' go back to Fair Tide.' : '') +
      ' Senedra now leads the scouts at Fair Tide.' + (over > 0 ? ' (Your ship\'s crew cap is ' + cap + ': the sequel crew needs a bigger hull.)' : '');
    if (typeof window.notify === 'function') window.notify({ icon: '⛵', title: 'The crew of the new voyage', text: msg, kind: 'info', duration: 7000 });
    else if (typeof toast === 'function') toast('⛵ ' + msg, 5200);
    if (typeof logEvent === 'function') logEvent('⛵ ' + msg, 'gold');
  }
  window.applySequelParty = apply;

  // Story-required: cannot be sent home once the sequel crew is set.
  const oldRequired = window.getRequiredFieldedIds;
  if (typeof oldRequired === 'function') {
    window.getRequiredFieldedIds = function(){
      const base = oldRequired.apply(this, arguments);
      if (!game.sequelCrewApplied) return base;
      const out = base.slice();
      REQUIRED.forEach(function(id){ if (joined(id) && out.indexOf(id) === -1) out.push(id); });
      return out;
    };
  }

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
