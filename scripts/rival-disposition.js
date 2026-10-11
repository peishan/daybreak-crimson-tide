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

  if (window.RESIDENT_STATUS_LABELS) {
    window.RESIDENT_STATUS_LABELS.reformed = 'Reformed';
    window.RESIDENT_STATUS_LABELS.expelled = 'Expelled';
  }

  const BETRAYAL_CHECK_INTERVAL_DAYS = 7;
  const BETRAYAL_RISK_HAPPINESS_THRESHOLD = 55;
  const BETRAYAL_RISK_BOND_THRESHOLD = 45;
  const BETRAYAL_CHANCE = 0.08;
  const TRUST_DRIFT_PER_CHECK = 2;

  // BETRAYAL OUTCOME — reveals where they actually went, rather than the
  // old generic "pays a fine and leaves." Reuses N's own idea (a fate
  // tier computed from happiness+bond) but explicitly NOT her Ch.23
  // tiers: those were written around her own specific backstory (San's
  // direction: remove any possibility of servitude/exploitation framing
  // here — reformed rivals can be men as well, and this isn't their
  // story to begin with). These four tiers are their own, scaled to
  // where a reformed rival's score actually lands: the betrayal roll
  // above only ever fires while both happiness and bond are still under
  // their risk thresholds (55/45), so the realistic range at the moment
  // of betrayal tops out well under those — never death, same rule as
  // every other outcome in this system.
  //
  // The worst tier names the Nameless specifically only once they've
  // actually been introduced (Arc XVIII Ch.22, "The Nameless Question");
  // before that it stays deliberately vague rather than naming a faction
  // the player hasn't met yet.
  const REFORMED_BETRAYAL_OUTCOMES = [
    { key:'walked_away_clean',    threshold:36, icon:'🌫️', label:'Walked Away Clean',
      note: function(name){ return name + ' slips away quietly after being caught — no faction claims them, no trail left behind.'; } },
    { key:'back_to_old_waters',   threshold:24, icon:'🏴', label:'Back to the Old Waters',
      note: function(name){ return name + ' is caught slipping back to old habits, and returns to small-time piracy — no deeper allegiance to speak of.'; } },
    { key:'joined_rival_faction', threshold:12, icon:'⚔️', label:'Joined a Rival Faction',
      note: function(name){ return name + ' is caught — and this time there\'s a name attached: they\'ve thrown in with a rival faction.'; } },
    { key:'joined_nameless',      threshold:0,  icon:'🌑', label:'Recruited by the Nameless',
      note: function(name){
        const namelessKnown = !!(game.comicProgress18 && game.comicProgress18[22]);
        return name + ' is caught — and worse, ' + (namelessKnown
          ? 'Fair Tide Intelligence traces them straight to the Nameless.'
          : 'they\'ve vanished into a network far more dangerous than anything Fair Tide has faced yet.');
      } }
  ];

  function reformedBetrayalOutcome(score){
    for (let i = 0; i < REFORMED_BETRAYAL_OUTCOMES.length; i++) {
      if (score >= REFORMED_BETRAYAL_OUTCOMES[i].threshold) return REFORMED_BETRAYAL_OUTCOMES[i];
    }
    return REFORMED_BETRAYAL_OUTCOMES[REFORMED_BETRAYAL_OUTCOMES.length - 1];
  }

  function resolveReformedBetrayal(id){
    if (typeof window.fairTideResidentsState !== 'function') return;
    const r = window.fairTideResidentsState()[id];
    if (!r || r.status === 'expelled') return;
    const name = r.name || id;
    const happiness = (typeof r.happiness === 'number') ? r.happiness : 50;
    const bond = (typeof r.bond === 'number') ? r.bond : 35;
    const score = Math.round((happiness + bond) / 2);
    const outcome = reformedBetrayalOutcome(score);

    r.status = 'expelled'; // deliberately NOT 'departed' -- that status belongs to N's own temporary-guest ladder (arc28-mechanics.js), and this isn't it
    r.betrayalOutcome = { key: outcome.key, label: outcome.label, score: score };
    if (game.fairTideRoster) delete game.fairTideRoster[id];
    if (window.FT_ROSTER_BONUSES) delete window.FT_ROSTER_BONUSES[id];

    const note = outcome.note(name);
    if (typeof window.logResidentArrivalDeparture === 'function') {
      window.logResidentArrivalDeparture(r, 'leave', note);
    }
    toast(outcome.icon + ' ' + note + ' Expelled from Fair Tide, for good.', 4400);
    logEvent(outcome.icon + ' ' + name + ' betrays Fair Tide\'s trust — ' + outcome.label + '.', 'bad');
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
