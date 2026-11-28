(function(){
  // -------------------------------------------------------------------
  // SAN'S OLD OFFICE NETWORK — a batch of roster additions (San's own
  // request), revealed in one shot once Dre (already established as a
  // former C. Adv colleague, scripts/arc5-and-objective-chain.js) is on
  // the roster -- these are her old network finding their way back to
  // San, same as Dre did. One-shot, checked on the same shared hook
  // every other ambient Fair Tide system piggybacks on (see
  // settlement-memories.js / dre-wedding.js for the identical idiom).
  //
  // Jeh gets a civilian role assigned automatically and at random (San's
  // own instruction: "just assign them roles randomly") rather than
  // left pending for the player to pick via assignCivilianRole — baked
  // in once, at reveal time, exactly matching the shape that function
  // itself produces (role/icon/civilianRole) so he never shows the
  // "needs a role" picker buttons.
  // -------------------------------------------------------------------

  function pickRandomCivilianRole(){
    const roles = (typeof window.FT_CIVILIAN_ROLES !== 'undefined') ? Object.keys(window.FT_CIVILIAN_ROLES) : [];
    if (!roles.length) return null;
    return roles[Math.floor(Math.random() * roles.length)];
  }

  function officeNetworkAdditions(){
    const roleKey = pickRandomCivilianRole();
    const roleDef = roleKey ? window.FT_CIVILIAN_ROLES[roleKey] : null;
    return [
      {id:'erma', name:'Erma', role:'Recruitment', icon:'📇',
        desc:"Used to handle hiring back at C. Adv. Still can't help sizing people up the same way."},
      {id:'erna', name:'Erna', role:'Dispatch', icon:'📡',
        desc:"Kept C. Adv's schedules from collapsing more times than anyone ever thanked her for."},
      {id:'jeh', name:'Jeh', role: roleDef ? roleDef.name : 'Fair Tide Crew', icon: roleDef ? roleDef.icon : '👤',
        civilianRole: roleKey || undefined,
        desc:"Usually found wherever Imah and Dre are — the three of them have been inseparable long before any of this."},
      {id:'sa', name:'SA', role:'Legal Strategist', icon:'⚖️',
        desc:"Finds the angle in a contract nobody else thought to look for."},
      // Zainah joined the group after the first five (San's request). Role and line are placeholders for the author to change.
      {id:'zainah', name:'Zainah', role:'Records & Compliance', icon:'🗂️',
        desc:"Kept C. Adv's files in an order nobody else could follow, and still knows where every page went. Has already reorganised Fair Tide's paperwork twice."},
      {id:'mike', name:'Mike', role:'Legal & Financial Affairs', icon:'💼',
        desc:"San's cousin on her mother's side. An accident back in the old world cost him the use of one leg long before any of this started — whatever Veyren's magic did to the prosthetic, it works better than the original ever did. Handles legal drafting and the kind of financial-institution work Brunei's banks actually trust."}
    ];
  }

  function addOfficeMember(def){
    if (game.fairTideRoster[def.id]) return false;
    const entry = {name: def.name, role: def.role, icon: def.icon, desc: def.desc};
    if (def.civilianRole) entry.civilianRole = def.civilianRole;
    game.fairTideRoster[def.id] = entry;
    return true;
  }

  function checkOfficeNetworkReveal(){
    if (!(game.fairTideRoster && game.fairTideRoster.dre)) return;
    if (game.officeNetworkRevealed) {
      // A save that already met the first group: Zainah arrives on her own, once.
      if (!game.officeZainahAdded) {
        game.officeZainahAdded = true;
        const z = officeNetworkAdditions().find(function(d){ return d.id === 'zainah'; });
        if (z && addOfficeMember(z)) {
          logEvent("📇 Zainah, another face from San's old office, has found her way to Fair Tide.", 'good');
          if (typeof window.recordChronicleEntry === 'function') window.recordChronicleEntry('Zainah, from the old C. Adv office, found her way to Fair Tide.', '📇');
          toast('📇 Zainah has joined the Fair Tide Roster.', 3600);
          if (typeof saveGameQuiet === 'function') saveGameQuiet();
          if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
        }
      }
      return;
    }
    officeNetworkAdditions().forEach(addOfficeMember);
    game.officeNetworkRevealed = true;
    game.officeZainahAdded = true;
    logEvent("📇 A few familiar faces from San's old office have found their way to Fair Tide.", 'good');
    if (typeof window.recordChronicleEntry === 'function') {
      window.recordChronicleEntry('Erma, Erna, Jeh, SA, Zainah, and Mike all found their way to Fair Tide.', '📇');
    }
    toast('📇 New faces have joined the Fair Tide Roster.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  }

  const oldSyncArc1ForOfficeNetwork = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForOfficeNetwork) oldSyncArc1ForOfficeNetwork();
    checkOfficeNetworkReveal();
  };
})();
