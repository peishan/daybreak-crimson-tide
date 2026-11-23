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

  function apply(force){
    if ((game.sequelCrewApplied && !force) || !prologueRead()) return;
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

  // Anyone who should be at home but is still fielded (the old crew that stayed aboard).
  function stillAboard(){
    const ids = (typeof window.getFieldedIds === 'function') ? window.getFieldedIds() : [];
    return HOME_NAMED.concat(ids).filter(function(id, i, a){ return a.indexOf(id) === i; })
      .filter(function(id){ return ids.indexOf(id) !== -1 && id !== 'san' && !free(id) && REQUIRED.indexOf(id) === -1 && joined(id); });
  }
  // The crew screen's "Send the old crew home" button: runs the sequel arrangement again, on request.
  window.sendOldCrewHome = function(){
    if (!game.sequelCrewApplied) { apply(); return; }
    const before = stillAboard();
    apply(true);
    if (!before.length && typeof toast === 'function') toast('Everyone else is already at Fair Tide.', 2800);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderPartyScreen === 'function') renderPartyScreen();
  };
  // One-time repair for a save that entered the sequel with the old crew still aboard.
  function repairOnce(){
    if (!game.sequelCrewApplied || game.sequelHomeRepaired) return;
    game.sequelHomeRepaired = true;
    if (stillAboard().length) apply(true);
  }
  // One-time repair (V642): Renn, Erynn and Mimi found back in the fielded party after the sequel crew was set go home to Fair Tide again, and are kept
  // out of open slots. Anyone the player fields by hand afterwards is left alone.
  function repairTrioOnce(){
    if (!game.sequelCrewApplied || game.sequelTrioRepaired) return;
    game.sequelTrioRepaired = true;
    const trio = ['renn', 'erynn', 'mimi'];
    game.fieldingDecided = game.fieldingDecided || ['san'];
    trio.forEach(function(id){ if (game.fieldingDecided.indexOf(id) === -1) game.fieldingDecided.push(id); });
    const back = trio.filter(function(id){ return (game.fieldedIds || []).indexOf(id) !== -1; });
    if (!back.length) return;
    game.fieldedIds = game.fieldedIds.filter(function(id){ return back.indexOf(id) === -1; });
    const msg = back.map(nm).join(', ') + (back.length > 1 ? ' go' : ' goes') + ' back to Fair Tide with the research team.';
    if (typeof window.notify === 'function') window.notify({ icon: '🔬', title: 'Back to the research team', text: msg, kind: 'info', duration: 6000 });
    else if (typeof toast === 'function') toast('🔬 ' + msg, 4200);
  }
  const oldRenderParty = window.renderPartyScreen;
  if (typeof oldRenderParty === 'function') {
    window.renderPartyScreen = function(){
      const r = oldRenderParty.apply(this, arguments);
      try {
        const c = document.getElementById('partyDetail');
        if (c && game.sequelCrewApplied && !c.querySelector('#sendOldCrewHome')) {
          const n = stillAboard().length;
          c.insertAdjacentHTML('afterbegin', '<div id="sendOldCrewHome" class="panel" style="margin-bottom:12px;"><div style="font-size:.82rem;opacity:.85;margin-bottom:6px;">' +
            (n ? n + ' of the old crew (' + stillAboard().map(nm).join(', ') + ') are still aboard. The new voyage sails with the sequel crew; the rest are home at Fair Tide.' : 'The new voyage sails with the sequel crew; everyone else is home at Fair Tide.') + '</div>' +
            '<button class="btn btn-small" onclick="sendOldCrewHome()"' + (n ? '' : ' disabled') + '>⚓ Send the old crew home</button></div>');
        }
      } catch(e) {}
      return r;
    };
  }

  // Story-required: cannot be sent home once the sequel crew is set.
  const oldRequired = window.getRequiredFieldedIds;
  if (typeof oldRequired === 'function') {
    window.getRequiredFieldedIds = function(){
      const base = oldRequired.apply(this, arguments);
      if (!game.sequelCrewApplied) return base;
      // Renn, Erynn and Mimi are required aboard only for Arc VI-VIII's own story; from the sequel on they stay at Fair Tide
      // with the research team (otherwise that old requirement kept putting them back on the ship).
      const out = base.filter(function(id){ return HOME_NAMED.indexOf(id) === -1; });
      REQUIRED.forEach(function(id){ if (joined(id) && out.indexOf(id) === -1) out.push(id); });
      return out;
    };
  }

  const oldGetFielded = window.getFieldedIds;
  if (typeof oldGetFielded === 'function') {
    window.getFieldedIds = function(){
      try { apply(); repairOnce(); repairTrioOnce(); } catch(e) {}
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
