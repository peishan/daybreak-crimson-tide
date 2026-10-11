(function(){
  // -------------------------------------------------------------------
  // RIVAL DISPOSITION — San's request: once a captured rival's finite
  // community-service term completes (claimCommunityLabor sets
  // cs.active=false, cs.completedDay — fairtide-buildings-and-arc6.js),
  // nothing further ever happened to them. They just silently stopped
  // appearing in the Community Service list forever ("completed entries
  // are hidden entirely," per that file's own comment) with no
  // resolution of any kind. This gives San an actual one-time choice for
  // what happens to them next: fine and release them, or take them in
  // for good.
  //
  // Scoped to the generic pool only — both the fixed 52 names and the
  // now-actually-working endless generated pool (see the recent
  // captainKey closure-bug fix in arc9-and-systems.js).
  //
  // Robin is deliberately excluded, permanently (briefly tried gating his
  // own version of this choice on Ch.15/"Robin's Last Day" being read —
  // reverted on San's direction: he has a real story beat planned much
  // later, post-Arc 50, that will resolve his fate properly. This
  // mechanical fine/retain choice would preempt that, so this system
  // stays hands-off him entirely; don't re-add him without checking
  // where that later beat has landed). Jeff's service has no end date
  // (totalDays: null) — his arc isn't about service ending at all, so he
  // never reaches "completed" and never shows up here either.
  //
  // "Take Them In" reuses the exact same window.fairTideRoster +
  // FT_ROSTER_BONUSES pattern already used for Maera/Jovie/every other
  // named civilian resident, at the same goldBonus scale the Civilian
  // Roles' own sailor/trader tier already uses (0.01) — not a new
  // combat-companion slot. Building unique combat kit for a pool that
  // can generate 2,500+ distinct procedural names would be wildly
  // disproportionate; joining Fair Tide's civilian roster is the
  // appropriately-scoped version of "ally" for this specific system.
  //
  // ONGOING BETRAYAL RISK (San's own direction, after this session's
  // wider happiness/bond work): unlike every other Fair Tide resident,
  // a retained rival is an actual reformed adversary, not a found-family
  // civilian -- so unlike the C Adv/SK*/TM crowd (fair-tide-wider-
  // residents.js, a pure display meter, no risk), these get a real,
  // ongoing stake. Registered through the same Arc XXVIII resident
  // framework (registerTemporaryResident) under a new 'reformed' status,
  // starting below the found-family-crew defaults (50/35, not 60/50) --
  // trust not yet earned. A quiet, infrequent check (roughly weekly)
  // only rolls at all while BOTH happiness and bond are still low;
  // either rises a little on every uneventful check regardless, so a
  // rival left alone (no mistreatment, no incident) naturally earns
  // their way to safety within a season or so. A failed roll never
  // harms anyone -- explicit design constraint, San's own words: "N and
  // residents should never die as an outcome" -- it only reuses this
  // same file's existing "fine and release" framing: caught slipping
  // back to old habits, expelled from the roster for good. Once past
  // the risk window, nothing further ever checks them again.
  // -------------------------------------------------------------------

  if (window.RESIDENT_STATUS_LABELS) window.RESIDENT_STATUS_LABELS.reformed = 'Reformed';

  const BETRAYAL_CHECK_INTERVAL_DAYS = 7;
  const BETRAYAL_RISK_HAPPINESS_THRESHOLD = 55;
  const BETRAYAL_RISK_BOND_THRESHOLD = 45;
  const BETRAYAL_CHANCE = 0.08;
  const TRUST_DRIFT_PER_CHECK = 2;

  function resolveReformedBetrayal(id){
    if (typeof window.fairTideResidentsState !== 'function') return;
    const r = window.fairTideResidentsState()[id];
    if (!r || r.status === 'departed') return;
    const name = r.name || id;
    r.status = 'departed';
    r.awayLocation = 'Unknown';
    r.awayCompanion = null;
    if (game.fairTideRoster) delete game.fairTideRoster[id];
    if (window.FT_ROSTER_BONUSES) delete window.FT_ROSTER_BONUSES[id];
    if (typeof window.logResidentArrivalDeparture === 'function') {
      window.logResidentArrivalDeparture(r, 'leave', 'Caught slipping back to old habits — expelled from Fair Tide for good.');
    }
    toast('⚖️ ' + name + ' is caught slipping back to old habits and is expelled from Fair Tide, for good this time.', 4200);
    logEvent('⚖️ ' + name + ' betrays Fair Tide\'s trust and is cast out.', 'bad');
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  }

  function checkReformedRivalBetrayals(){
    if (typeof window.fairTideResidentsState !== 'function') return;
    const residents = window.fairTideResidentsState();
    Object.keys(residents).forEach(function(id){
      const r = residents[id];
      if (r.status !== 'reformed') return;
      const lastCheck = (typeof r.lastBetrayalCheckDay === 'number') ? r.lastBetrayalCheckDay : -Infinity;
      if ((game.day || 0) - lastCheck < BETRAYAL_CHECK_INTERVAL_DAYS) return;
      r.lastBetrayalCheckDay = game.day || 0;
      const atRisk = r.happiness < BETRAYAL_RISK_HAPPINESS_THRESHOLD && r.bond < BETRAYAL_RISK_BOND_THRESHOLD;
      if (atRisk && Math.random() < BETRAYAL_CHANCE) {
        resolveReformedBetrayal(id);
      } else if (typeof window.adjustResidentHappiness === 'function' && typeof window.adjustResidentBond === 'function') {
        window.adjustResidentHappiness(id, TRUST_DRIFT_PER_CHECK);
        window.adjustResidentBond(id, TRUST_DRIFT_PER_CHECK);
      }
    });
  }

  const oldSyncArc1ForReformedRivals = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForReformedRivals) oldSyncArc1ForReformedRivals();
    checkReformedRivalBetrayals();
  };

  function rivalDispositionState(){
    game.rivalDisposition = game.rivalDisposition || {};
    return game.rivalDisposition;
  }
  window.rivalDispositionState = rivalDispositionState;

  function pendingRivalDispositions(){
    const captured = Object.keys(game.rivalsCaptured || {}).filter(function(key){
      return typeof window.rivalCaptured === 'function' && window.rivalCaptured(key);
    });
    const cs = (typeof window.communityServiceState === 'function') ? window.communityServiceState() : {};
    const disposition = rivalDispositionState();
    return captured.filter(function(key){
      if (key === 'robin') return false; // his own future story beat handles this, not this system — see the file-level comment above
      const record = cs[key];
      return !!(record && record.active === false && record.completedDay != null && !disposition[key]);
    });
  }
  window.pendingRivalDispositions = pendingRivalDispositions;

  const RIVAL_FINE_GOLD = 200;
  const RIVAL_RETAIN_GOLD_BONUS = 0.01; // matches the Civilian Roles' own sailor/trader tier

  function resolveRivalDisposition(key, choice){
    const disposition = rivalDispositionState();
    if (disposition[key]) return; // one-time, matching every other settlement decision in this codebase
    if (pendingRivalDispositions().indexOf(key) === -1) return;
    const name = (typeof window.rivalDisplayName === 'function') ? window.rivalDisplayName(key) : key;
    if (choice === 'fine') {
      disposition[key] = 'fined';
      game.gold = (game.gold || 0) + RIVAL_FINE_GOLD;
      toast('💰 ' + name + ' pays a fine and leaves Fair Tide for good. (+' + RIVAL_FINE_GOLD + 'g)', 3600);
      logEvent('💰 ' + name + ' is fined and released.', 'gold');
    } else if (choice === 'retain') {
      disposition[key] = 'retained';
      game.fairTideRoster = game.fairTideRoster || {};
      if (!game.fairTideRoster[key]) {
        game.fairTideRoster[key] = {
          name: name, role: 'Reformed Captain', icon: '🏴',
          desc: 'Once captured, now choosing to stay — working off more than just a sentence.'
        };
      }
      window.FT_ROSTER_BONUSES = window.FT_ROSTER_BONUSES || {};
      window.FT_ROSTER_BONUSES[key] = {goldBonus: RIVAL_RETAIN_GOLD_BONUS};
      if (typeof window.registerTemporaryResident === 'function') {
        const r = window.registerTemporaryResident(key, {
          name: name, icon: '🏴', status: 'reformed',
          relationship: 'Reformed', trust: 'Earning It',
          happiness: 50, bond: 35, lastBetrayalCheckDay: game.day || 0
        });
        if (typeof window.logResidentArrivalDeparture === 'function') {
          window.logResidentArrivalDeparture(r, 'join', 'Taken in for good — trust not yet earned, but given the chance.');
        }
      }
      toast('🤝 ' + name + ' stays at Fair Tide for good.', 3600);
      logEvent('🤝 ' + name + ' joins Fair Tide\'s roster.', 'gold');
    } else {
      return;
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderExplore === 'function') window.renderExplore();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  }
  window.resolveRivalDisposition = resolveRivalDisposition;

  function renderRivalDispositionPanel(){
    const pending = pendingRivalDispositions();
    if (!pending.length) return '';
    let html = '<div class="panel-title" style="margin-top:14px;">⚖️ Deciding Their Fate</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Their term is served. What happens to them now is San\'s call.</p>';
    pending.forEach(function(key){
      const name = (typeof window.rivalDisplayName === 'function') ? window.rivalDisplayName(key) : key;
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">⚖️</div><div style="flex:1;">'+
        '<strong>'+esc(name)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">Their community service is complete. Fine them and send them on their way, or take them in for good.</span>'+
        '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">'+
        '<button class="btn btn-small" onclick="resolveRivalDisposition(\''+key+'\',\'fine\')">💰 Fine & Release (+'+RIVAL_FINE_GOLD+'g)</button>'+
        '<button class="btn btn-small" onclick="resolveRivalDisposition(\''+key+'\',\'retain\')">🤝 Take Them In</button>'+
        '</div>'+
        '</div></div></article>';
    });
    return html;
  }
  window.renderRivalDispositionPanel = renderRivalDispositionPanel;

  const oldRenderExploreForDisposition = window.renderExplore;
  window.renderExplore = function(){
    if (oldRenderExploreForDisposition) oldRenderExploreForDisposition();
    const container = document.getElementById('exploreContent');
    if (!container) return;
    const existing = document.getElementById('rivalDispositionPanelWrap');
    if (existing) existing.remove();
    const panel = renderRivalDispositionPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="rivalDispositionPanelWrap">'+panel+'</div>');
  };
})();
