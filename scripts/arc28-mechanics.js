(function(){
  // -------------------------------------------------------------------
  // ARC XXVIII MECHANICS — TEMPORARY RESIDENTS. Deliberately kept OUT of
  // arc28.js itself, same split used since Arc XXIII: arc files only
  // wire story.
  //
  // Per San's own spec: N is a Fair Tide RESIDENT, not a recruited crew
  // member. She never enters ALL_PARTY, never becomes fieldable, never
  // touches the combat party filter. This file builds a small, GENERIC
  // temporary-resident framework (registerTemporaryResident et al.) that
  // N is simply the first user of — per San's own note, Fair Tide can
  // receive refugees, researchers, apprentices, and other temporary
  // guests from Arc XXVIII onward, all through this same system.
  //
  // Three explicit design rules from San's own spec, followed exactly:
  //
  //   1. The player never decides whether N gets charged for something.
  //      Every deduction (Ch.9, Ch.17) and the final account (Ch.18) are
  //      applied automatically the moment their chapter is read — the
  //      same "story decides, player manages consequences" rule already
  //      used for Arc XXVI's Reserves and Arc XXVII's Intelligence.
  //
  //   2. Trust is narrative state, never a grindable meter. There is no
  //      numeric trust stat and no action anywhere in this file that
  //      increases it. "San's Trust: Broken" -> "Unresolved" are two
  //      fixed labels that change exactly once, tied to specific
  //      chapters, never to anything the player repeatedly does.
  //
  //   3. Nothing permanent is investable in a temporary resident. Work
  //      roles pay a flat, fixed wage with no upgrade path and no
  //      resource cost to assign — there is nothing here a player could
  //      sink rare resources into only to lose it at Ch.18.
  //
  // N's own wages are tracked entirely on her OWN ledger and never touch
  // game.gold — per San's spec, that money is hers, not Fair Tide's, so
  // it was never the player's currency to begin with and doesn't vanish
  // from the player's own economy when she leaves with it.
  // -------------------------------------------------------------------

  // ===========================================================================
  // GENERIC TEMPORARY RESIDENT FRAMEWORK — reusable for any future guest
  // (refugees, researchers, apprentices, etc.), per San's own note.
  // ===========================================================================
  const RESIDENT_STATUS_LABELS = {
    resident:         'Resident',
    working_resident: 'Working Resident',
    departing:        'Departing Resident',
    departed:         'Departed'
  };
  window.RESIDENT_STATUS_LABELS = RESIDENT_STATUS_LABELS;

  const RESIDENT_TRAITS = {
    charming:  { icon:'✨', label:'Charming',  desc:'Improves visitor and customer interaction — earns a bonus on social work.' },
    delegator: { icon:'😇', label:'Delegator', desc:'Sometimes someone else quietly finishes part of the assigned task.' }
  };
  window.RESIDENT_TRAITS = RESIDENT_TRAITS;

  function residentsState(){
    game.fairTideResidents = game.fairTideResidents || {};
    return game.fairTideResidents;
  }
  window.fairTideResidentsState = residentsState;

  window.temporaryResident = function(id){
    return residentsState()[id] || null;
  };

  // Generic registration -- idempotent, so a chapter-read hook can call
  // this every time its gate is true without double-registering anyone.
  window.registerTemporaryResident = function(id, opts){
    const residents = residentsState();
    if (residents[id]) return residents[id];
    residents[id] = Object.assign({
      id: id,
      status: 'resident',
      role: null,
      earnings: 0,
      personalPurchases: 0,
      fairTideCharge: 0,
      lastWageDay: -1,
      traits: [],
      awayLocation: null,
      awayCompanion: null
    }, opts || {});
    return residents[id];
  };

  window.residentAvailableWages = function(id){
    const r = residentsState()[id];
    if (!r) return 0;
    return Math.max(0, r.earnings - r.personalPurchases - r.fairTideCharge);
  };

  // ===========================================================================
  // WORK ASSIGNMENT (Ch.6) — flat, fixed-wage roles with no upgrade path
  // and no resource cost, per San's own "nothing permanent is investable
  // in a temporary resident" rule.
  // ===========================================================================
  const RESIDENT_WORK_ROLES = [
    { key:'market', name:'Market Assistance', icon:'🛍️', social:true,  wagePerDay:14 },
    { key:'supply', name:'Supply Sorting',     icon:'📦', social:false, wagePerDay:12 },
    { key:'tavern', name:'Tavern Helper',      icon:'🍺', social:true,  wagePerDay:14 },
    { key:'port',   name:'Port Work',          icon:'⚓', social:false, wagePerDay:12 }
  ];
  window.RESIDENT_WORK_ROLES = RESIDENT_WORK_ROLES;

  function residentWorkUnlocked(id){
    // N-specific gate for now (Ch.6); a future resident would gate on
    // its own arc's own chapter the same way.
    if (id === 'n') return !!(game.comicProgress28 && game.comicProgress28[6]);
    // The masked guest is never work-assignable -- he's passing through
    // incognito for a handful of chapters, not settling in as a worker.
    if (id === 'sairen') return false;
    return true;
  }
  window.residentWorkUnlocked = residentWorkUnlocked;

  window.assignResidentWork = function(id, roleKey){
    const r = residentsState()[id];
    if (!r) return;
    if (!residentWorkUnlocked(id)) return;
    const role = RESIDENT_WORK_ROLES.find(function(x){ return x.key === roleKey; });
    if (!role) return;
    r.role = roleKey;
    if (r.status === 'resident') r.status = 'working_resident';
    toast('🔨 ' + (r.name || id) + ' takes on ' + role.name + '.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  window.canCollectResidentWages = function(id){
    const r = residentsState()[id];
    if (!r || !r.role) return false;
    if (r.status === 'departed' || r.status === 'departing') return false;
    return r.lastWageDay !== (game.day || 0);
  };

  window.collectResidentWages = function(id){
    const r = residentsState()[id];
    if (!r || !window.canCollectResidentWages(id)) return;
    const role = RESIDENT_WORK_ROLES.find(function(x){ return x.key === r.role; });
    if (!role) return;
    let wage = role.wagePerDay;
    const charming = r.traits.indexOf('charming') !== -1;
    if (charming && role.social) wage = Math.round(wage * 1.3);
    r.earnings += wage;
    r.lastWageDay = game.day || 0;
    let msg = '💰 ' + (r.name || id) + ' earns ' + wage + 'g from ' + role.name + '.';
    const delegator = r.traits.indexOf('delegator') !== -1;
    if (delegator && Math.random() < 0.25) {
      msg = '😇 Someone else quietly finished part of ' + (r.name || id) + '\'s work again — she still collects ' + wage + 'g from ' + role.name + '.';
    }
    toast(msg, 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  // ===========================================================================
  // N — the arc's own resident, registered and evolved automatically as
  // her chapters are read. Every state change here is a direct
  // consequence of a story beat, never a player action.
  // ===========================================================================
  function checkNResidentEvents(){
    const cp = game.comicProgress28;
    if (!cp) return;

    // Ch.4 ("Guest of Fair Tide") -- N is registered as a Resident.
    if (cp[4] && !residentsState().n) {
      window.registerTemporaryResident('n', {
        name: 'N',
        icon: '💫',
        room: 'Guest Quarters',
        memory: 'Fragmented',
        relationship: 'Old Friend',
        trust: 'Broken',
        traits: ['charming', 'delegator']
      });
    }
    const n = residentsState().n;
    if (!n) return;

    // Ch.9 ("Old Habits") -- the first small, automatic personal-charge
    // event. Applied once, exactly when the chapter itself narrates it.
    if (cp[9] && !game.arc28Ch9ChargeApplied) {
      game.arc28Ch9ChargeApplied = true;
      n.personalPurchases += 8;
      if (typeof logEvent === 'function') logEvent('📉 N takes a little more from Fair Tide\'s stores than she\'s earned so far — small, but it adds up.', 'bad');
    }

    // Ch.17 ("This Isn't Brunei") -- a second, larger charge event.
    if (cp[17] && !game.arc28Ch17ChargeApplied) {
      game.arc28Ch17ChargeApplied = true;
      n.fairTideCharge += 15;
      if (typeof logEvent === 'function') logEvent('📉 N spends beyond what she\'s earned again, expecting it to be smoothed over. This time it isn\'t.', 'bad');
    }

    // Ch.18 ("Exactly What You Earned") -- Aisyah's final account,
    // computed automatically and exactly once. The Brunei debt is
    // explicitly NOT deducted here -- per San's own spec, that debt was
    // never Fair Tide's to collect.
    //
    // BUG FIX / DESIGN UPDATE (San's own direction): this used to also
    // flip n.status straight to 'departed' right here, but Ch.19-23 now
    // narrate her staying a few days longer -- newly freed of her work
    // assignment, still physically at Fair Tide, which is where she
    // meets the masked guest below. Settling accounts is her decision to
    // eventually go, not the goodbye itself; the actual departure (and
    // status flip) now happens at Ch.23, alongside his own.
    if (cp[18] && !n.finalAccount) {
      const finalWages = window.residentAvailableWages('n');
      n.finalAccount = {
        earned: n.earnings,
        personalPurchases: n.personalPurchases,
        fairTideCharge: n.fairTideCharge,
        finalWages: finalWages,
        bruneiDebt: 'NOT APPLICABLE'
      };
      n.role = null;
      n.relationship = 'Complicated';
      n.trust = 'Unresolved';
      toast('📋 Final Fair Tide Account — N: earned ' + n.earnings + 'g, paid out ' + finalWages + 'g. Old Brunei debt: not applicable.', 4800);
      if (typeof logEvent === 'function') logEvent('📋 N\'s account is settled in full — nothing invented, nothing withheld, and her old Brunei debt left off the ledger entirely, exactly where it belongs.', 'gold');
    }

    // Ch.23 ("Come With Me") -- N actually leaves Fair Tide now, with
    // the masked guest (see checkSairenResidentEvents below). FUTURE
    // HOOK: whichever later arc properly identifies him updates
    // n.awayCompanion from 'Unknown Man' to his real name -- no other
    // change needed here when that happens (see arc29-mechanics.js's
    // Ch.12 classification, which already does exactly this).
    if (cp[23] && n.status !== 'departed') {
      n.status = 'departed';
      n.awayLocation = 'Unknown';
      n.awayCompanion = 'Unknown Man';
    }
  }

  // ===========================================================================
  // THE MASKED GUEST (Ch.19-23) — San's own direction: the man N meets
  // and spends one night with was always meant to be physically at Fair
  // Tide first, not someone she only meets after she's already gone.
  // Registered through the exact same generic resident framework N
  // herself uses, with one addition: nameKnown:false. His identity is
  // withheld from the PLAYER too, not just narratively from San -- Arc
  // XXVIII's own chapter text (see arc28.js Ch.19-24) never names him
  // either, matching the masked display here exactly. Arc XXIX Ch.12
  // ("The Spy") is where Fair Tide Intelligence -- and the player --
  // finally learns the working name Sairen (see arc29-mechanics.js).
  //
  // Like N, he's a RESIDENT, never a recruited crew member: no role is
  // ever assignable to him (residentWorkUnlocked special-cases him to
  // false, below) -- he's a guest passing through, not someone settling
  // in to work.
  // ===========================================================================
  function checkSairenResidentEvents(){
    const cp = game.comicProgress28;
    if (!cp) return;

    // Ch.19 ("Beautiful and Free") -- he's already a quiet guest by the
    // time N's own days open up; this is simply where the story first
    // gives them a reason to actually cross paths.
    if (cp[19] && !residentsState().sairen) {
      window.registerTemporaryResident('sairen', {
        name: null,
        nameKnown: false,
        icon: '🎭',
        room: 'Guest Quarters',
        memory: '—',
        relationship: 'Stranger',
        trust: 'Unknown',
        traits: ['charming']
      });
    }
    const sairen = residentsState().sairen;
    if (!sairen) return;

    // Ch.23 ("Come With Me") -- he leaves Fair Tide, same moment N does,
    // same masked identity carried into the "Away" record as hers.
    if (cp[23] && sairen.status !== 'departed') {
      sairen.status = 'departed';
      sairen.awayLocation = 'Unknown';
      sairen.awayCompanion = 'N';
      if (typeof logEvent === 'function') logEvent('🎭 The masked guest leaves Fair Tide. N goes with him.', 'neutral');
    }
  }

  const oldSyncArc1ForArc28Residents = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForArc28Residents) oldSyncArc1ForArc28Residents();
    checkNResidentEvents();
    checkSairenResidentEvents();
  };

  // ===========================================================================
  // RENDERING — its own panel on the Fair Tide Roster tab (the existing
  // civilian-roster screen), listing active Residents first and any
  // Departed ones afterward in a lighter "Away from Fair Tide" card, per
  // San's own "her portrait doesn't disappear, it just moves" note. Kept
  // in the same screen rather than a separate Codex view to stay within
  // this arc's own scope.
  // ===========================================================================
  // nameKnown defaults to true for any resident that doesn't set it
  // explicitly (every existing one before the masked guest) -- only an
  // explicit nameKnown:false masks the display, same "???" idiom used
  // for unknown locations (clan-settlement-and-sw.js etc.) and
  // undiscovered bestiary/achievement entries elsewhere in this
  // codebase. Without this guard, esc(null) would literally print the
  // text "null" to the player instead of staying hidden.
  function residentDisplayName(r){
    return r.nameKnown === false ? '???' : esc(r.name);
  }

  function renderResidentCard(r){
    const traitBadges = r.traits.map(function(k){
      const t = RESIDENT_TRAITS[k];
      return t ? '<span class="story-chip" title="'+esc(t.desc)+'">'+t.icon+' '+esc(t.label)+'</span>' : '';
    }).join(' ');

    if (r.status === 'departed') {
      return '<article class="quest-item"><strong>'+r.icon+' '+residentDisplayName(r)+'</strong> — <span style="opacity:.75;">Away from Fair Tide</span><br>'+
        '<span style="font-size:.8rem;opacity:.8;">Location: '+esc(r.awayLocation || 'Unknown')+' · Companion: '+esc(r.awayCompanion || 'Unknown')+' · Status: Safe (last known)</span><br>'+
        '<span style="font-size:.78rem;opacity:.7;">Relationship: '+esc(r.relationship)+' · San\'s Trust: '+esc(r.trust)+'</span>'+
        (r.finalAccount ? '<div style="font-size:.76rem;opacity:.65;margin-top:4px;">Final account: earned '+r.finalAccount.earned+'g, paid '+r.finalAccount.finalWages+'g · Old debt: '+esc(r.finalAccount.bruneiDebt)+'</div>' : '')+
        '</article>';
    }

    const role = RESIDENT_WORK_ROLES.find(function(x){ return x.key === r.role; });
    const wages = window.residentAvailableWages(r.id);
    let html = '<article class="quest-item"><strong>'+r.icon+' '+residentDisplayName(r)+'</strong> — <span class="story-chip">'+esc(RESIDENT_STATUS_LABELS[r.status] || r.status)+'</span> '+traitBadges+'<br>'+
      '<span style="font-size:.8rem;opacity:.8;">Role: '+(role ? esc(role.name) : 'Unassigned')+' · Room: '+esc(r.room || '—')+' · Memory: '+esc(r.memory || '—')+'</span><br>'+
      '<span style="font-size:.78rem;opacity:.7;">Relationship: '+esc(r.relationship)+' · San\'s Trust: '+esc(r.trust)+'</span><br>'+
      '<span style="font-size:.78rem;opacity:.75;">Earnings: '+r.earnings+'g · Available wages: '+wages+'g</span>';

    if (residentWorkUnlocked(r.id)) {
      if (!role) {
        html += '<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">'+
          RESIDENT_WORK_ROLES.map(function(w){ return '<button class="btn btn-small" onclick="assignResidentWork(\''+r.id+'\',\''+w.key+'\')">'+w.icon+' '+esc(w.name)+'</button>'; }).join('')+
          '</div>';
      } else {
        const canCollect = window.canCollectResidentWages(r.id);
        html += '<div style="margin-top:6px;"><button class="btn btn-small btn-success" onclick="collectResidentWages(\''+r.id+'\')" '+(canCollect?'':'disabled')+'>💰 '+(canCollect ? 'Collect Wages' : 'Collected Today')+'</button></div>';
      }
    }
    html += '</article>';
    return html;
  }

  function renderFairTideResidentsPanel(){
    const residents = residentsState();
    const ids = Object.keys(residents);
    if (!ids.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🏘️ Fair Tide Residents</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Guests of Fair Tide who haven\'t joined the crew — not everyone who stays here becomes part of San\'s expedition.</p>';
    ids.forEach(function(id){
      html += renderResidentCard(residents[id]);
    });
    return html;
  }
  window.renderFairTideResidentsPanel = renderFairTideResidentsPanel;

  const oldRenderFairTideHubForResidents = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    if (oldRenderFairTideHubForResidents) oldRenderFairTideHubForResidents();
    const tab = game.fairTideActiveTab || 'buildings';
    if (tab !== 'roster') return;
    const container = document.getElementById('ft-tab-roster');
    if (!container) return;
    const existing = document.getElementById('fairTideResidentsPanelWrap');
    if (existing) existing.remove();
    const panel = renderFairTideResidentsPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="fairTideResidentsPanelWrap">'+panel+'</div>');
  };
})();
