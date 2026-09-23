
(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE BUILDINGS + TRADE — extends the existing renovate-then-
  // upkeep loop (ct-build-v72-fairtide-arc4, kept intact above) into a
  // small gathering-game layer: Port HQ + 4 buildings, each independently
  // levelable, paid for with a 4-resource economy earned from the same
  // gathering-party dispatch mechanic. Buildings are named after the
  // Arc V companions who'll eventually staff them (Part IV/V, not yet
  // wired in) so nothing needs renaming later — just a "staffed" flag
  // once those chapters land.
  //
  // Scope note: this is v1. Curated to 4 buildings rather than one per
  // every Part IV/V NPC, and the resource-per-dispatch-task picker was
  // simplified to a flat bundle rather than resource-specific tasks —
  // both easy to expand later without breaking saves.
  // -------------------------------------------------------------------
  const FT_BUILDINGS = {
    port_hq:      {name:'Port HQ',       icon:'🏮', desc:'The heart of Fair Tide. Raises the level ceiling for every other building and speeds up every gathering run.', cost:{timber:40,stone:40,food:20,trade:30}, cap:5,
      tierNames:['Fair Tide Claimed','A Real Foundation','Port HQ','A Port That Runs Itself','The Heart of Fair Tide']},
    warehouse:    {name:'Warehouse',     icon:'📦', desc:'Bigger hauls from every gathering party, and higher resource storage.', rosterKey:'dudin',  companionName:'Dudin',  cost:{timber:30,stone:20},
      tierNames:['A Place to Stack Crates','Proper Shelving','The Warehouse','Room for More','Dudin\'s Domain']},
    trading_post: {name:'Trading Post',  icon:'🏪', desc:'Better Market prices at Fair Tide, and better rates at the Trade screen.', rosterKey:'wahyu', companionName:'Wahyu', cost:{trade:30,food:15},
      tierNames:['A Folding Table','A Proper Stall','The Trading Post','Fair Prices, Known Widely','Wahyu\'s Trading Post']},
    galley:       {name:'Galley',        icon:'🍲', desc:'More Food from every gathering run, and better Trade rates on Food.', rosterKey:'gino',   companionName:'Gino',   cost:{food:30,timber:15},
      tierNames:['A Cookfire','A Real Kitchen','The Galley','Food Enough for Everyone','Gino\'s Galley']},
    workshop:     {name:'Workshop',      icon:'🔧', desc:'Cheaper Shipyard hull upgrades.', rosterKey:'jorvin', companionName:'Jorvin', cost:{stone:30,trade:15},
      tierNames:['A Toolbox on the Dock','A Proper Bench','The Workshop','Tools for Every Job','Jorvin\'s Workshop']},
    watchtower:   {name:'Watchtower',    icon:'🔭', desc:'Imah keeps watch over the water. Periodically spots something worth investigating — a lead the Research Expedition team can follow up on.', rosterKey:'imah', companionName:'Imah', cost:{timber:25,stone:35},
      tierNames:["A Lookout Post","A Proper Watch","The Watchtower","Eyes on Every Horizon","Imah's Watch"]}
  };
  const FT_TRADE_BASE = {timber:3, stone:4, food:3, trade:8};
  const FT_RES_LABEL = {timber:'🪵 Timber', stone:'🪨 Stone', food:'🍚 Food', trade:'💰 Trade Goods'};

  function ftResources(){ game.fairTideResources = game.fairTideResources || {timber:0,stone:0,food:0,trade:0}; return game.fairTideResources; }
  function ftBuildings(){ game.fairTideBuildings = game.fairTideBuildings || {port_hq:0,warehouse:0,trading_post:0,galley:0,workshop:0,watchtower:0}; return game.fairTideBuildings; }
  function fmtClockFT(sec){ const m = Math.floor(sec/60), s = sec%60; return m+':'+String(s).padStart(2,'0'); }

  window.fairTideResourceCap = function(){
    return 200 + (ftBuildings().warehouse||0) * 100;
  };
  window.fairTideBuildingCap = function(key){
    if(key==='port_hq') return FT_BUILDINGS.port_hq.cap;
    return Math.min(FT_BUILDINGS.port_hq.cap, ftBuildings().port_hq||0);
  };
  window.fairTideBuildingCost = function(key){
    const cfg = FT_BUILDINGS[key];
    if(!cfg) return {};
    const nextLevel = (ftBuildings()[key]||0) + 1;
    const cost = {};
    Object.entries(cfg.cost).forEach(([res, base]) => { cost[res] = Math.round(base * nextLevel); });
    return cost;
  };
  window.canAffordFairTideBuilding = function(key){
    const cost = window.fairTideBuildingCost(key);
    const res = ftResources();
    return Object.entries(cost).every(([r,amt]) => (res[r]||0) >= amt);
  };
  window.upgradeFairTideBuilding = function(key){
    if(!window.fairTideRenovationDone()){ toast('🔒 Finish renovating Fair Tide first.'); return; }
    const cfg = FT_BUILDINGS[key];
    if(!cfg) return;
    const b = ftBuildings();
    const cur = b[key] || 0;
    const cap = window.fairTideBuildingCap(key);
    if(cur >= cap){ toast(key==='port_hq' ? '🔒 Port HQ is at its current cap.' : "🔒 Raise Port HQ's level first."); return; }
    if(!window.canAffordFairTideBuilding(key)){ toast('Not enough resources.'); return; }
    const cost = window.fairTideBuildingCost(key);
    const res = ftResources();
    Object.entries(cost).forEach(([r,amt]) => { res[r] = (res[r]||0) - amt; });
    b[key] = cur + 1;
    logEvent('🏗️ '+cfg.icon+' '+cfg.name+' upgraded to level '+b[key]+'!', 'gold');
    toast('🏗️ '+cfg.name+' is now level '+b[key]+'!');
    saveGameQuiet();
    window.renderFairTideHub();
  };

  // Read by claimGatheringParty() (see the edited dispatch code above).
  window.fairTideDispatchYield = function(){
    const b = ftBuildings();
    const hqMult = 1 + 0.05*(b.port_hq||0);
    const whMult = 1 + 0.10*(b.warehouse||0);
    const galleyFoodMult = 1 + 0.15*(b.galley||0);
    return {
      timber: Math.round(4*hqMult*whMult),
      stone:  Math.round(3*hqMult*whMult),
      food:   Math.round(3*hqMult*whMult*galleyFoodMult),
      trade:  Math.round(2*hqMult*whMult)
    };
  };

  // Trade screen — sell/buy resources for gold, rates scaled by Trading Post.
  window.fairTideSellRate = function(res){
    const tp = ftBuildings().trading_post||0;
    const foodBonus = (res==='food') ? 1 + 0.05*(ftBuildings().galley||0) : 1;
    return Math.round(FT_TRADE_BASE[res] * (1 + 0.05*tp) * foodBonus);
  };
  window.fairTideBuyRate = function(res){
    const tp = ftBuildings().trading_post||0;
    return Math.max(1, Math.round(FT_TRADE_BASE[res] * 1.6 * (1 - Math.min(0.3, 0.04*tp))));
  };
  window.fairTideSellResource = function(res, amt){
    amt = Math.max(1, Number(amt)||1);
    const r = ftResources();
    if((r[res]||0) < amt){ toast('Not enough '+res+'.'); return; }
    const rate = window.fairTideSellRate(res);
    r[res] -= amt;
    game.gold += rate*amt;
    toast('💱 Sold '+amt+' '+res+' for '+(rate*amt)+'g');
    saveGameQuiet();
    window.renderFairTideHub();
  };
  window.fairTideBuyResource = function(res, amt){
    amt = Math.max(1, Number(amt)||1);
    const rate = window.fairTideBuyRate(res);
    const cost = rate*amt;
    if(game.gold < cost){ toast('Not enough gold.'); return; }
    const r = ftResources();
    const cap = window.fairTideResourceCap();
    const before = r[res]||0;
    r[res] = Math.min(cap, before+amt);
    const actual = r[res]-before;
    const spent = Math.round(rate*actual);
    game.gold -= spent;
    toast(actual>0 ? '💱 Bought '+actual+' '+res+' for '+spent+'g' : 'Storage is full.');
    saveGameQuiet();
    window.renderFairTideHub();
  };

  // Workshop — cheaper hull upgrades at the Shipyard. Global once built,
  // same as every other building's bonus (not location-gated).
  const oldShipUpgradeCostForFT = window.shipUpgradeCost;
  window.shipUpgradeCost = function(type){
    let c = oldShipUpgradeCostForFT ? oldShipUpgradeCostForFT(type) : 0;
    if(type==='hull'){
      const ws = ftBuildings().workshop||0;
      c = Math.round(c * (1 - Math.min(0.3, 0.05*ws)));
    }
    return c;
  };

  // -------------------------------------------------------------------
  // Rendering — Fair Tide Hub screen (fairTideScreen), 4 tabs.
  // -------------------------------------------------------------------
  window.switchFairTideTab = function(tab){
    game.fairTideActiveTab = tab;
    window.renderFairTideHub();
  };
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    ['buildings','trade','dispatch','clinic','roster'].forEach(t=>{
      const el = document.getElementById('ft-tab-'+t);
      const btn = document.getElementById('ft-tab-btn-'+t);
      if(el) el.classList.toggle('active', t===tab);
      if(btn) btn.classList.toggle('active', t===tab);
    });
    if(tab==='buildings') renderFTBuildingsTab();
    if(tab==='trade') renderFTTradeTab();
    if(tab==='dispatch') renderFTDispatchTab();
    if(tab==='clinic') renderFTClinicTab();
    if(tab==='roster') renderFTRosterTab();
  };

  function renderFTBuildingsTab(){
    const el = document.getElementById('ft-tab-buildings');
    if(!el) return;
    const res = ftResources();
    const b = ftBuildings();
    let html = '';
    if (typeof window.getReputationRankDef === 'function') {
      const rankIdx = window.getReputationRankIndex();
      const rank = window.getReputationRankDef();
      const next = window.REPUTATION_RANKS[rankIdx + 1];
      const gB = Math.round(window.getReputationBonus('goldBonus')*100);
      const xB = Math.round(window.getReputationBonus('xpBonus')*100);
      const cB = Math.round(window.getReputationBonus('critBonus')*100);
      const bonusText = (gB||xB||cB) ? ['+' + gB + '% gold', '+' + xB + '% XP', '+' + cB + '% crit'].filter(s=>!s.startsWith('+0')).join(' · ') : 'No bonuses yet';
      html += '<div class="panel-title">🏮 Renown</div><article class="quest-item" style="margin-bottom:14px;"><strong>'+esc(rank.name)+'</strong> <span style="opacity:.7;font-size:.78rem;">('+(game.reputation||0)+' reputation)</span><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+bonusText+'</span>'+
        (next ? '<br><span style="font-size:.78rem;opacity:.7;">Next: '+esc(next.name)+' at '+next.repReq+' reputation</span>' : '<br><span style="font-size:.78rem;opacity:.7;">Highest renown reached.</span>')+
        '</article>';
    }
    html += '<div class="panel-title">🧱 Resources</div><div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:14px;font-size:.85rem;">'+
      Object.entries(FT_RES_LABEL).map(([k,label])=>'<span>'+label+': <strong>'+(res[k]||0)+'</strong></span>').join('')+
      '<span style="opacity:.7;">(cap '+window.fairTideResourceCap()+' each)</span></div>';
    Object.entries(FT_BUILDINGS).forEach(([key,cfg])=>{
      const level = b[key]||0;
      const cap = window.fairTideBuildingCap(key);
      const maxed = level >= cap;
      const cost = window.fairTideBuildingCost(key);
      const afford = window.canAffordFairTideBuilding(key);
      const costText = Object.entries(cost).map(([r,amt])=>amt+' '+r).join(', ');
      const staffed = cfg.rosterKey && game.fairTideRoster && game.fairTideRoster[cfg.rosterKey];
      const companionTag = cfg.companionName
        ? ' <span style="opacity:.7;font-size:.78rem;">('+esc(cfg.companionName)+(staffed?' — staffed':' — foreshadowed')+')</span>'
        : '';
      const tierName = (level >= 1 && cfg.tierNames && cfg.tierNames[level-1]) ? cfg.tierNames[level-1] : null;
      html += '<article class="quest-item"><strong>'+cfg.icon+' '+cfg.name+'</strong> — Level '+level+'/'+cap+
        companionTag+'<br>'+
        (tierName ? '<span style="font-size:.78rem;opacity:.75;font-style:italic;">"'+esc(tierName)+'"</span><br>' : '')+
        '<span style="font-size:.8rem;opacity:.82;">'+esc(cfg.desc)+'</span><br>'+
        (maxed ? '<div class="story-chip" style="margin-top:6px;">'+(key==='port_hq'?'At current cap':"Raise Port HQ's level first")+'</div>'
          : '<div style="margin-top:6px;font-size:.8rem;">Next level: '+costText+(cfg.tierNames && cfg.tierNames[level] ? ' → "'+esc(cfg.tierNames[level])+'"' : '')+'</div><button class="btn btn-small btn-success" style="margin-top:4px;" '+(afford?'':'disabled')+' onclick="upgradeFairTideBuilding(\''+key+'\')">🏗️ Upgrade</button>')+
        '</article>';
    });
    el.innerHTML = html;
  }

  function renderFTTradeTab(){
    const el = document.getElementById('ft-tab-trade');
    if(!el) return;
    const res = ftResources();
    let html = '<div class="panel-title">💱 Trade</div>'+
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">Sell surplus resources for gold, or buy what the gathering parties haven\'t brought back yet. Rates improve with the Trading Post.</p>'+
      '<p style="font-size:.85rem;">💰 Gold: <strong>'+(game.gold||0)+'</strong></p>';
    Object.keys(FT_RES_LABEL).forEach(res_key=>{
      const sellRate = window.fairTideSellRate(res_key);
      const buyRate = window.fairTideBuyRate(res_key);
      html += '<article class="quest-item"><strong>'+FT_RES_LABEL[res_key]+'</strong> — you have '+(res[res_key]||0)+'<br>'+
        '<span style="font-size:.8rem;opacity:.8;">Sell '+sellRate+'g each · Buy '+buyRate+'g each</span><br>'+
        '<div style="margin-top:6px;display:flex;gap:6px;">'+
        '<button class="btn btn-small" onclick="fairTideSellResource(\''+res_key+'\',10)">Sell 10</button>'+
        '<button class="btn btn-small" onclick="fairTideBuyResource(\''+res_key+'\',10)">Buy 10</button>'+
        '</div></article>';
    });
    el.innerHTML = html;
  }

  function renderFTDispatchTab(){
    const el = document.getElementById('ft-tab-dispatch');
    if(!el) return;
    const status = window.fairTideDispatchStatus();
    let dispatchHtml = '';
    if(status.state==='idle') dispatchHtml = '<button class="btn btn-small btn-success" onclick="dispatchGatheringParty(\'supply\')">⛵ Send Gathering Party</button>';
    else if(status.state==='out') dispatchHtml = '<div class="story-chip">⛵ Out gathering — back in '+fmtClockFT(status.secondsLeft)+'</div>';
    else if(status.state==='ready') dispatchHtml = '<button class="btn btn-small btn-magic" onclick="claimGatheringParty()">📦 Collect the Gathering Party</button>';
    else if(status.state==='cooldown') dispatchHtml = '<div class="story-chip">🌙 Crew resting — ready again in '+fmtClockFT(status.secondsLeft)+'</div>';
    const yields = window.fairTideDispatchYield();
    el.innerHTML = '<div class="panel-title">⚓ Dispatch</div>'+
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:8px;">Send a gathering party out — Port HQ and the Warehouse make every run count for more.</p>'+
      '<p style="font-size:.8rem;opacity:.8;">Typical haul: 🪵'+yields.timber+' 🪨'+yields.stone+' 🍚'+yields.food+' 💰'+yields.trade+'</p>'+
      '<div style="margin-top:8px;">'+dispatchHtml+'</div>';
  }

  function renderFTClinicTab(){
    const el = document.getElementById('ft-tab-clinic');
    if(!el) return;
    const clinicSeen = !!game.fairTideClinicSeen;
    const jovieHere = !!(game.fairTideRoster && game.fairTideRoster.jovie);
    let html = '<div class="panel-title">🩹 The Clinic</div><article class="quest-item">';
    html += clinicSeen
      ? '<div style="font-size:.85rem;opacity:.85;">Senedra runs a tight clinic now, even if she still can\'t say why she knows how.</div>'
      : '<div style="font-size:.85rem;opacity:.9;">Senedra wanders in to look the place over — and stops dead in the doorway. Her hands are already moving before she\'s decided to move them, checking supplies, straightening equipment like she\'s done it a thousand times. She doesn\'t remember being a paramedic. Her hands clearly do.</div>';
    if(jovieHere) html += '<div style="font-size:.85rem;opacity:.85;margin-top:6px;">Jovie helps out here too now, her own medical box open on the counter beside Senedra\'s.</div>';
    html += '<div style="margin-top:8px;"><button class="btn btn-small btn-success" onclick="window.__ctOpenFairTideClinic()">Rest & Recover</button></div></article>';
    el.innerHTML = html;
  }

  // Fair Tide's non-combat roster — companions recruited through the Arc V
  // story (Jovie so far; Gino, Wahyu, Dudin, Imah, Nurul, Dre, Jorvin land
  // in later Parts) who join the port rather than the fielded party. Kept
  // in game.fairTideRoster, completely separate from ALL_PARTY/combat.
  function renderFTRosterTab(){
    const el = document.getElementById('ft-tab-roster');
    if(!el) return;
    const roster = game.fairTideRoster || {};
    const names = Object.keys(roster);
    let html = '<div class="panel-title">👥 Fair Tide Roster</div>'+
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">The people who chose to stay — not fighters, but Fair Tide runs because of them.</p>';
    if(!names.length){
      html += '<div class="story-chip">No one\'s joined the roster yet — keep following the Arc V story.</div>';
    } else {
      names.forEach(id=>{
        const m = roster[id];
        const bonus = (typeof window.FT_ROSTER_BONUSES !== 'undefined') ? window.FT_ROSTER_BONUSES[id] : null;
        const roleBonusDef = (typeof window.FT_CIVILIAN_ROLES !== 'undefined' && m.civilianRole) ? window.FT_CIVILIAN_ROLES[m.civilianRole] : null;
        const activeBonus = bonus || (roleBonusDef && roleBonusDef.bonus) || null;
        const bonusText = activeBonus ? Object.entries(activeBonus).map(([k,v]) => '+'+Math.round(v*100)+'% '+k.replace('Bonus','')).join(', ') : null;
        // Unsorted civilians (Ch.2/Ch.3's generic "Fair Tide Crew" recruits,
        // no civilianRole assigned yet) get a role-picker — see Arc VI
        // Ch.4 (ct-build-v94-arc6-part1, window.assignCivilianRole).
        const needsRole = m.role === 'Fair Tide Crew' && !m.civilianRole && typeof window.FT_CIVILIAN_ROLES !== 'undefined';
        const roleButtons = needsRole
          ? '<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">'+Object.entries(window.FT_CIVILIAN_ROLES).map(([key,def])=>
              '<button class="btn btn-small" onclick="assignCivilianRole(\''+id+'\',\''+key+'\')">'+def.icon+' '+def.name+'</button>').join('')+'</div>'
          : '';
        html += '<article class="quest-item"><strong>'+(m.icon||'👤')+' '+esc(m.name)+'</strong> — <span style="opacity:.8;">'+esc(m.role)+'</span><br>'+
          '<span style="font-size:.8rem;opacity:.8;">'+esc(m.desc||'')+'</span>'+
          (bonusText ? '<br><span style="font-size:.78rem;opacity:.7;">🏮 '+bonusText+' (always active)</span>' : '')+
          roleButtons+
          '</article>';
      });
    }
    if (game.inheritedShips && game.inheritedShips.length) {
      html += '<div class="panel-title" style="margin-top:14px;">🚢 Inherited Ships</div>'+
        '<p style="font-size:.82rem;opacity:.8;margin-bottom:8px;">Not every ship sails with us. Decide what each one becomes.</p>';
      game.inheritedShips.forEach(ship=>{
        const designated = !!ship.designation;
        let extra = '';
        if (ship.stats) {
          // Fleet ship — upgradeable, same stat shape as the main ship.
          extra = '<div style="margin-top:6px;font-size:.78rem;opacity:.85;">'+
            Object.entries(ship.stats).map(([stat,lvl])=>stat+' Lv.'+lvl).join(' · ')+'</div>'+
            '<div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:4px;">'+
            Object.keys(ship.stats).map(stat=>{
              const cost = window.fleetShipUpgradeCost ? window.fleetShipUpgradeCost(ship, stat) : 0;
              return '<button class="btn btn-small" onclick="upgradeFleetShip(\''+ship.id+'\',\''+stat+'\')">⬆️ '+stat+' ('+cost+'g)</button>';
            }).join('')+'</div>';
        } else if (ship.tradeIncome) {
          const canClaim = window.canClaimTradeIncome ? window.canClaimTradeIncome(ship.id) : false;
          extra = '<div style="margin-top:6px;"><button class="btn btn-small btn-success" '+(canClaim?'':'disabled')+' onclick="claimTradeIncome(\''+ship.id+'\')">💰 Collect Trade Income</button></div>';
        }
        html += '<article class="quest-item"><strong>'+(ship.flag||'🚢')+' '+esc(ship.name)+'</strong> — <span style="opacity:.8;">'+esc(ship.status||'Undesignated')+'</span>'+
          (designated ? '' : '<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">'+
            Object.entries(window.SHIP_DESIGNATIONS||{}).map(([key,def])=>
              '<button class="btn btn-small" onclick="designateShip(\''+ship.id+'\',\''+key+'\')">'+def.icon+' '+def.label+'</button>').join('')+'</div>')+
          extra+
          '</article>';
      });
    }
    el.innerHTML = html;
  }
})();


(function(){
  // -------------------------------------------------------------------
  // REPUTATION RANK LADDER — adapted from Legends of Daybreak's
  // GUILD_RANKS. Keyed off game.reputation, which was already tracked
  // everywhere (chapter completions, combat wins, bounties) but only ever
  // fed a cosmetic label before this — no mechanical payoff at all. First
  // four tier names/thresholds deliberately match the existing
  // reputationDisplay text in updateUI() (Unknown/Respected/Renowned/
  // Legendary at 50/100/200) so the two displays never disagree; this
  // block only adds tiers beyond that, plus real bonuses.
  // Bonuses are per-tier INCREMENTS, summed across every tier reached —
  // same convention Daybreak's own getGuildBonus() uses ("another +X%").
  // -------------------------------------------------------------------
  const REPUTATION_RANKS = [
    {name:'Unknown',    repReq:-999999},
    {name:'Respected',  repReq:50,  goldBonus:0.03, desc:'+3% gold from every victory.'},
    {name:'Renowned',   repReq:100, xpBonus:0.03,   desc:'+3% XP from every victory.'},
    {name:'Legendary',  repReq:200, goldBonus:0.05, xpBonus:0.05, critBonus:0.03, desc:'Another +5% gold, +5% XP, and +3% crit chance.'},
    {name:'Storied',    repReq:350, goldBonus:0.05, xpBonus:0.05, desc:'Another +5% gold and +5% XP.'},
    {name:'A Name Every Port Knows', repReq:550, goldBonus:0.05, critBonus:0.05, desc:'Another +5% gold and +5% crit chance.'},
    {name:'The Captain of Fair Tide', repReq:800, goldBonus:0.07, xpBonus:0.07, critBonus:0.05, desc:"Another +7% gold, +7% XP, and +5% crit chance — Fair Tide knows your name for it."}
  ];
  window.REPUTATION_RANKS = REPUTATION_RANKS;

  window.getReputationRankIndex = function(){
    let idx = 0;
    const rep = game.reputation || 0;
    for (let i = 0; i < REPUTATION_RANKS.length; i++) {
      if (rep >= REPUTATION_RANKS[i].repReq) idx = i;
    }
    return idx;
  };
  window.getReputationRankDef = function(){
    return REPUTATION_RANKS[window.getReputationRankIndex()];
  };
  // Sums every tier's bonus up to and including the current rank —
  // read by gainXP (xpBonus), handleVictory (goldBonus), and rollCrit
  // (critBonus), all guarded with typeof checks.
  // Small always-on bonuses from recruited Fair Tide roster members —
  // adapted from Daybreak's Guild War "fielded ally" bonus, but since
  // Fair Tide's roster doesn't fight or get "fielded," these are simply
  // active the moment someone's recruited. Only covers the 4 roster
  // members who DON'T already have a matching building bonus (Gino/
  // Wahyu/Dudin/Jorvin are covered via the Galley/Trading Post/Warehouse/
  // Workshop buildings already) — avoids stacking two bonuses on the
  // same person for the same thing.
  const FT_ROSTER_BONUSES = {
    jovie: {xpBonus: 0.02},   // Medical Support — a healthier crew learns faster
    imah:  {goldBonus: 0.02}, // Administration — tighter bookkeeping
    nurul: {xpBonus: 0.02},   // Clerical & Trade
    dre:   {goldBonus: 0.02}  // Coffee & Commerce
  };
  window.FT_ROSTER_BONUSES = FT_ROSTER_BONUSES;
  function getRosterBonus(statKey){
    const roster = game.fairTideRoster || {};
    let total = 0;
    Object.keys(FT_ROSTER_BONUSES).forEach(id => {
      if (roster[id] && FT_ROSTER_BONUSES[id][statKey]) total += FT_ROSTER_BONUSES[id][statKey];
    });
    // Civilian roles assigned via Arc VI Ch.4 (see ct-build-v94-arc6-part1,
    // window.FT_CIVILIAN_ROLES) — a generic freed crew member contributes
    // a small bonus once assigned a role, same aggregator, independent of
    // and additive with the named-companion bonuses above.
    if (typeof window.FT_CIVILIAN_ROLES !== 'undefined') {
      Object.values(roster).forEach(member => {
        const roleDef = member.civilianRole && window.FT_CIVILIAN_ROLES[member.civilianRole];
        if (roleDef && roleDef.bonus && roleDef.bonus[statKey]) total += roleDef.bonus[statKey];
      });
    }
    return total;
  }

  window.getReputationBonus = function(statKey){
    const idx = window.getReputationRankIndex();
    let total = 0;
    for (let i = 0; i <= idx; i++) {
      if (REPUTATION_RANKS[i][statKey]) total += REPUTATION_RANKS[i][statKey];
    }
    total += getRosterBonus(statKey);
    return total;
  };
})();


(function(){
  // -------------------------------------------------------------------
  // THE UNCHARTED REACH — adapted from Legends of Daybreak's Endless
  // Grind Room / Fraying Frontier, for the space between Arc V and
  // whatever comes next. Auto-chaining single-enemy waves (Crimson
  // Tide's combat only ever has one enemy on screen, unlike Daybreak's
  // 1-5 per wave) drawn from the REAL existing HARBOR_ENEMIES +
  // SEA_ENEMIES pool — no new monster list — scaled through the same
  // scaleCrimsonEnemy() every regular harbor fight already uses, plus an
  // uncapped per-wave streak multiplier on top (scaleCrimsonEnemy's own
  // multipliers cap out by ~level 19, which is fine for bounded harbor
  // fights but would make an endless mode pointless past that level
  // without this extra layer). A permanent Championship ladder, same
  // shape as Daybreak's GRIND_TIERS. Loot stays trophy-only for now,
  // same as every other fight — no new equipment-drop system here.
  // Retreating keeps everything earned so far, same as Daybreak's.
  // -------------------------------------------------------------------
  const UNCHARTED_TIERS = [
    {id:'first_marker',      name:'First Marker',      waveReq:10,  icon:'🥉', rw:{xp:400,  gold:250},  bonusPct:0.02},
    {id:'second_marker',     name:'Second Marker',     waveReq:25,  icon:'🥈', rw:{xp:1000, gold:650},  bonusPct:0.04},
    {id:'third_marker',      name:'Third Marker',      waveReq:50,  icon:'🥇', rw:{xp:2200, gold:1400}, bonusPct:0.06},
    {id:'edge_of_the_chart', name:'Edge of the Chart',  waveReq:75,  icon:'🏆', rw:{xp:3800, gold:2400}, bonusPct:0.08},
    {id:'past_the_chart',    name:'Past the Chart',     waveReq:100, icon:'💎', rw:{xp:6000, gold:3800}, bonusPct:0.10}
  ];
  window.UNCHARTED_TIERS = UNCHARTED_TIERS;
  const DIFF_MULT = {normal:1, hard:1.4, nightmare:2.0};

  function ucState(){ game.uncharted = game.uncharted || {active:false, wave:0, totalKills:0, totalXp:0, totalGold:0, difficulty:'normal'}; return game.uncharted; }
  function ucChampionship(){ game.unchartedChampionship = game.unchartedChampionship || {bestWave:0, claimedTiers:[]}; return game.unchartedChampionship; }
  window.unchartedState = ucState;
  window.unchartedChampionship = ucChampionship;

  window.getUnchartedTierBonus = function(){
    const gc = ucChampionship();
    let bonus = 0;
    for (const t of UNCHARTED_TIERS) { if (gc.bestWave >= t.waveReq) bonus += t.bonusPct; }
    return bonus;
  };

  function unchartedEnemyPool(){
    const pool = [];
    if (typeof HARBOR_ENEMIES !== 'undefined') {
      Object.entries(HARBOR_ENEMIES).forEach(([key,e]) => { if (key!=='robin' && key!=='jeff') pool.push([key,e]); });
    }
    if (typeof SEA_ENEMIES !== 'undefined') {
      Object.entries(SEA_ENEMIES).forEach(([key,e]) => pool.push([key,e]));
    }
    return pool;
  }

  function generateUnchartedEnemy(wave, difficulty){
    const pool = unchartedEnemyPool();
    if (!pool.length) return null;
    const [key, base] = pool[Math.floor(Math.random()*pool.length)];
    const scaled = (typeof scaleCrimsonEnemy==='function') ? scaleCrimsonEnemy(base, 'harbor') : base;
    const streakMult = 1 + Math.max(0, wave-1) * 0.05;
    const diffMult = DIFF_MULT[difficulty] || 1;
    return {
      ...scaled,
      name: scaled.name || base.name,
      icon: scaled.icon || scaled.art || base.icon || base.art,
      hp: Math.max(1, Math.round(scaled.hp * streakMult * diffMult)),
      dmg: Math.max(1, Math.round((scaled.dmg||scaled.atk||10) * streakMult * Math.sqrt(diffMult))),
      xp: Math.max(1, Math.round(scaled.xp * streakMult * diffMult)),
      gold: Math.max(1, Math.round(scaled.gold * streakMult * diffMult)),
      _unchartedKey: key
    };
  }

  window.spawnUnchartedWave = function(){
    const uc = ucState();
    uc.active = true;
    uc.wave++;
    const enemy = generateUnchartedEnemy(uc.wave, uc.difficulty);
    if (!enemy) { toast('The Reach is quiet — nothing out here right now.'); return; }
    logCombat && (game.combatLog = []);
    toast('🌊 The Uncharted Reach — Wave ' + uc.wave + (uc.wave>1 ? ' (+' + Math.round((uc.wave-1)*5) + '% tougher)' : ''), 2600);
    startCombat({kind:'uncharted', key: enemy._unchartedKey, enemy});
  };

  window.enterUnchartedReach = function(difficulty){
    const uc = ucState();
    uc.active = true;
    uc.wave = 0;
    uc.totalKills = 0;
    uc.totalXp = 0;
    uc.totalGold = 0;
    if (difficulty) uc.difficulty = difficulty;
    window.spawnUnchartedWave();
  };

  window.continueUnchartedReach = function(){
    if (!ucState().active) return;
    window.spawnUnchartedWave();
  };

  window.retreatUnchartedReach = function(){
    const uc = ucState();
    toast('🏳️ Retreat from the Reach — wave ' + uc.wave + ', everything earned is kept.', 3600);
    logEvent('🌊 Left the Uncharted Reach at wave ' + uc.wave + '. Kills: ' + uc.totalKills + ' · XP: ' + uc.totalXp + ' · Gold: ' + uc.totalGold, 'gold');
    uc.active = false;
    game.inCombat = false;
    game.pendingPostBattle = null;
    saveGameQuiet();
    if (typeof goScreen === 'function') goScreen('fairtide');
    if (typeof window.switchFairTideTab === 'function') window.switchFairTideTab('uncharted');
  };

  window.setUnchartedDifficulty = function(diff){
    if (!DIFF_MULT[diff]) return;
    ucState().difficulty = diff;
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  // Checks the just-completed wave against the championship ladder —
  // called from handleVictory's 'uncharted' branch (see the direct edit
  // to handleVictory in the core combat code).
  window.checkUnchartedTierRewards = function(){
    const uc = ucState();
    const gc = ucChampionship();
    if (uc.wave > gc.bestWave) gc.bestWave = uc.wave;
    for (const t of UNCHARTED_TIERS) {
      if (uc.wave >= t.waveReq && !gc.claimedTiers.includes(t.id)) {
        gc.claimedTiers.push(t.id);
        gainXP(t.rw.xp);
        game.gold += t.rw.gold;
        logCombat('🏅 <b>' + t.icon + ' ' + t.name + '!</b> +' + t.rw.xp + ' XP, +' + t.rw.gold + 'g, and a permanent +' + Math.round(t.bonusPct*100) + '% bonus on every future Reach run.');
        toast('🏅 ' + t.icon + ' ' + t.name + ' reached! Permanent Reach bonus: +' + Math.round(t.bonusPct*100) + '%', 4200);
      }
    }
  };

  // -------------------------------------------------------------------
  // Fair Tide Hub tab wiring — reuses the existing 6-tab pattern.
  // -------------------------------------------------------------------
  const oldSwitchFairTideTabForUC = window.switchFairTideTab;
  window.switchFairTideTab = function(tab){
    if (oldSwitchFairTideTabForUC) oldSwitchFairTideTabForUC(tab);
  };
  const oldRenderFairTideHubForUC = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-uncharted');
    const btn = document.getElementById('ft-tab-btn-uncharted');
    if (el) el.classList.toggle('active', tab==='uncharted');
    if (btn) btn.classList.toggle('active', tab==='uncharted');
    if (oldRenderFairTideHubForUC) oldRenderFairTideHubForUC();
    if (tab==='uncharted') renderUnchartedTab();
  };

  function fmtPct(n){ return Math.round(n*100)+'%'; }

  function renderUnchartedTab(){
    const el = document.getElementById('ft-tab-uncharted');
    if (!el) return;
    const uc = ucState();
    const gc = ucChampionship();
    const tierBonus = window.getUnchartedTierBonus();
    const nextTier = UNCHARTED_TIERS.find(t => gc.bestWave < t.waveReq);
    let html = '<div class="panel-title">🌊 The Uncharted Reach</div>'+
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">Past the last chart anyone aboard has ever trusted. Arc V is behind them. Whatever comes next hasn\'t been drawn yet either.</p>'+
      '<article class="quest-item"><strong>The Last Marker</strong><br><span style="font-size:.8rem;opacity:.8;">Someone will chart the rest of this eventually. For now, this is as far as anyone\'s written it down.</span><br>'+
      '<span style="font-size:.8rem;margin-top:6px;display:block;">🏆 Best streak: Wave '+gc.bestWave+(nextTier ? ' · Next marker at Wave '+nextTier.waveReq : ' · Every marker claimed')+'</span>'+
      (tierBonus>0 ? '<span style="font-size:.78rem;opacity:.75;">Permanent Reach bonus: +'+fmtPct(tierBonus)+' XP/gold</span><br>' : '<br>')+
      '</article>';
    if (uc.active && uc.wave>0) {
      html += '<article class="quest-item" style="border-left-color:var(--danger);"><strong>Currently out at Wave '+uc.wave+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.8;">Kills: '+uc.totalKills+' · XP this run: '+uc.totalXp+' · Gold this run: '+uc.totalGold+'</span><br>'+
        '<button class="btn btn-small btn-danger" style="margin-top:6px;" onclick="goScreen(\'combat\')">↩️ Return to the fight</button></article>';
    } else {
      html += '<div class="panel-title" style="margin-top:14px;">Difficulty</div><div style="display:flex;gap:6px;margin-bottom:10px;">'+
        ['normal','hard','nightmare'].map(d => '<button class="btn btn-small '+(uc.difficulty===d?'btn-success':'')+'" onclick="setUnchartedDifficulty(\''+d+'\')">'+d.charAt(0).toUpperCase()+d.slice(1)+'</button>').join('')+
        '</div>'+
        '<button class="btn btn-success" onclick="enterUnchartedReach()">🌊 Sail Into the Reach</button>';
    }
    el.innerHTML = html;
  }
})();


(function(){
  // -------------------------------------------------------------------
  // TRAINING ROOM — San spars with a crewmate, Pirates of the Caribbean
  // style. Option A from the discussion: a themed, bounded XP source
  // (once per day) rather than genuine individual companion leveling,
  // since Crimson Tide has no live per-companion level system to hook
  // into (xpToNextLevel/xpProgressText exist but are dead code, never
  // called from anywhere). Reuses gainXP() as-is, so the reputation rank
  // and roster bonuses already apply automatically — no separate reward
  // path to keep in sync.
  //
  // Deliberately NOT a real fight in stakes: no gold cost on defeat, no
  // hull damage, no trophy loot either way — sparring your own crew
  // isn't something you loot. Kind:'training' on the combat encounter is
  // what both handleVictory and handleDefeat check to skip their normal
  // gold/trophy/penalty logic (see the direct edits in the core combat
  // code) and reuses startCombat/the real combat screen rather than a
  // separate non-interactive button, since swordplay was the whole ask.
  // -------------------------------------------------------------------
  function trainingState(){ game.trainingRoom = game.trainingRoom || {lastDay:-1}; return game.trainingRoom; }
  window.trainingState = trainingState;
  window.canTrainToday = function(){ return trainingState().lastDay !== game.day; };

  const TRAINING_PARTNER_LINES = {
    joel: "Joel squares up, already grinning. \"Don't go easy on me.\"",
    aisyah: "Aisyah draws both blades with a flourish. \"Try to keep up.\"",
    mezstorm: "Mezstorm cracks his knuckles. \"Storm's coming either way.\"",
    eliz: "Eliz raises her mace, a little sheepish. \"I'll try not to heal myself mid-fight out of habit.\"",
    senedra: "Senedra rolls her shoulders. \"Paramedic instincts on standby, just in case.\"",
    zaki: "Zaki bounces on his heels, way too excited for a practice bout.",
    ser_aldric: "Ser Aldric offers a formal bow before drawing his blade.",
    sister_wren: "Sister Wren murmurs a small blessing over her own weapon, more habit than need.",
    renn: "Renn adjusts his glasses. \"Purely for research purposes, obviously.\""
  };

  function trainingPartnerLine(id, name){
    return TRAINING_PARTNER_LINES[id] || (name + ' readies a practice stance.');
  }

  function generateTrainingEnemy(partner){
    const base = {
      name: partner.name + ' (Sparring)',
      icon: '⚔️',
      hp: 130,
      dmg: 9,
      xp: 90,
      gold: 0,
      desc: 'A friendly bout, not a real fight — but Joel would say those are the ones worth taking seriously.'
    };
    const scaled = (typeof scaleCrimsonEnemy==='function') ? scaleCrimsonEnemy(base, 'harbor') : base;
    return Object.assign({}, scaled, {gold: 0, name: base.name, icon: base.icon, desc: base.desc});
  }

  window.startTrainingBout = function(partnerId){
    if (!window.canTrainToday()) { toast('🗡️ Already trained today. Come back tomorrow.'); return; }
    const partner = (typeof ALL_PARTY!=='undefined') ? ALL_PARTY.find(m=>m.id===partnerId) : null;
    if (!partner) { toast('That crew member isn\'t available to spar.'); return; }
    // Locks the moment the bout starts, win or lose — one attempt per
    // day, matching the free-rest-site convention. This assignment was
    // missing entirely before: trainingState().lastDay was declared but
    // never actually written to, so canTrainToday() could never return
    // false and the daily limit silently did nothing.
    trainingState().lastDay = game.day;
    const enemy = generateTrainingEnemy(partner);
    toast('⚔️ ' + trainingPartnerLine(partnerId, partner.name), 3600);
    startCombat({kind:'training', key:'training_'+partnerId, enemy});
    // One-on-one (San's request): restricts this specific bout to San +
    // the chosen sparring partner only, instead of the whole active
    // roster piling on one crew member for what's meant to be a
    // friendly spar. Set after startCombat() clears any stale override
    // by default — see getActiveParty()/startCombat() in core-engine.js.
    game.combatPartyOverride = ['san', partnerId];
  };

  window.backToTrainingRoom = function(){
    game.pendingPostBattle = null;
    if (typeof goScreen === 'function') goScreen('fairtide');
    if (typeof window.switchFairTideTab === 'function') window.switchFairTideTab('training');
  };

  // -------------------------------------------------------------------
  // Tab wiring — same pattern as every other Fair Tide Hub tab.
  // -------------------------------------------------------------------
  const oldRenderFairTideHubForTraining = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-training');
    const btn = document.getElementById('ft-tab-btn-training');
    if (el) el.classList.toggle('active', tab==='training');
    if (btn) btn.classList.toggle('active', tab==='training');
    if (oldRenderFairTideHubForTraining) oldRenderFairTideHubForTraining();
    if (tab==='training') renderTrainingTab();
  };

  function renderTrainingTab(){
    const el = document.getElementById('ft-tab-training');
    if (!el) return;
    const canTrain = window.canTrainToday();
    let html = '<div class="panel-title">⚔️ The Training Room</div>'+
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">Swordplay on the deck, mostly for the fun of it. One bout a day — everyone still sharpens up either way.</p>';
    if (!canTrain) {
      html += '<div class="story-chip">Already trained today. Come back tomorrow.</div>';
    } else {
      const party = (typeof getActiveParty==='function') ? getActiveParty().filter(m=>m.id!=='san') : [];
      if (!party.length) {
        html += '<div class="story-chip">No one\'s available to spar with yet.</div>';
      } else {
        html += party.map(m => '<article class="quest-item"><strong>'+esc(m.name)+'</strong> — <span style="font-size:.8rem;opacity:.8;">'+esc(m.role||'')+'</span><br>'+
          '<button class="btn btn-small btn-success" style="margin-top:6px;" onclick="startTrainingBout(\''+m.id+'\')">⚔️ Spar</button></article>').join('');
      }
    }
    el.innerHTML = html;
  }
})();


(function(){
  // -------------------------------------------------------------------
  // ARC VI — "The Price of Freedom" (Ch.1 for now: "The Captives"). Art
  // headers say "Arc 5" — mislabeled, per the earlier flag; wired here as
  // Arc VI since Arc V ("The Bond") is already complete and this content
  // is clearly its own separate arc. Gated behind Arc V's completion,
  // same pattern as every arc before it.
  //
  // Ch.1 completes by WINNING a fight, not just marking a chapter read —
  // same convention as Arc III's memory fights and the Arc I guardians:
  // the fight IS the chapter's climax, not a separate checkbox after.
  // -------------------------------------------------------------------
  const ARC6_CHAPTERS = [
    {id:1, title:'The Captives', focus:"The Crimson Tide intercepts Robin's and Jeff's ships — something's controlling their crews, and Renn moves to shut it down before anyone gets hurt.", image:'assets/comics/arc6/ch01-the-captives.png', xp:300},
    {id:2, title:'The Ships We Inherit', focus:"San decides what to do with two captured ships and their crews — not everyone here chose to be. Freedom isn't given to the strongest. It's given to the right people.", image:'assets/comics/arc6/ch02-the-ships-we-inherit.png', xp:300},
    {id:3, title:"Didn't Have Rice?", focus:"Joel finds Jeff doing his community service and finally says what he never got to say. The crowd Jeff spent years dismissing has its own answer.", image:'assets/comics/arc6/ch03-didnt-have-rice.png', xp:300},
    {id:4, title:'The People We Keep', focus:"Too many people, too many ships. San gives everyone a real choice instead of a new set of orders — and Fair Tide grows because of it.", image:'assets/comics/arc6/ch04-the-people-we-keep.png', xp:325},
    {id:5, title:'A Ship of Our Own', focus:"San inspects the inherited ships and decides what each one becomes — fleet, trade, transport, or let go. Renn finds something unusual in the rigging of one of them.", image:'assets/comics/arc6/ch05-a-ship-of-our-own.png', xp:325},
    {id:6, title:'What They Were Good At', focus:"Former workers start revealing skills Robin never saw — a cook, a carpenter, a navigator, a trader. He saw job titles. San sees people.", image:'assets/comics/arc6/ch06-what-they-were-good-at.png', xp:325},
    {id:7, title:'The Empty Office', focus:"Robin watches Fair Tide laugh together, unafraid, uninterested in his approval. No dramatic redemption. Just the quiet realization that his old authority is simply gone.", image:'assets/comics/arc6/ch07-the-empty-office.png', xp:300},
    {id:8, title:"Joel's Rest", focus:"After everything with Jeff, Joel finally talks about the strangeness of watching the old hierarchy reverse. San doesn't give him a speech. She just stays beside him.", image:'assets/comics/arc6/ch08-joels-rest.png', xp:300},
    {id:9, title:'The Crew That Chose Us', focus:"The people who voluntarily stayed formally become part of the Crimson Tide network. They aren't indentured anymore. They chose to stay.", image:'assets/comics/arc6/ch09-the-crew-that-chose-us.png', xp:350},
    {id:10, title:'The First Voyage', focus:"San takes some of the newly recruited crew on their first voyage. They aren't Robin's workers anymore. They're sailors aboard their own chosen future.", image:'assets/comics/arc6/ch10-the-first-voyage.png', xp:300},
    {id:11, title:'Something in the Cargo', focus:"Renn digs deeper into the artifact from the captured cargo — the first real bridge back toward the larger magical-world storyline.", image:'assets/comics/arc6/ch11-something-in-the-cargo.png', xp:325},
    {id:12, title:'The Price of a Ship', focus:"Taking possession of Robin's fleet has consequences — other merchants and authorities notice. San has to negotiate rather than simply fight.", image:'assets/comics/arc6/ch12-the-price-of-a-ship.png', xp:350},
    {id:13, title:'The People Who Left', focus:"Some freed workers return briefly — one reunited with parents, one found work, one just wanted to leave the sea. Freedom doesn't mean everyone should join San.", image:'assets/comics/arc6/ch13-the-people-who-left.png', xp:300},
    {id:14, title:'The People Who Stayed', focus:"The people who chose Fair Tide explain why. Not because San owns them. Because they believe in what she's building.", image:'assets/comics/arc6/ch14-the-people-who-stayed.png', xp:300},
    // Ch.15 is special: it only becomes readable once Robin's real
    // 20-day community service term actually finishes (see
    // robinServiceDone() below), not just when story progress reaches
    // it. arc6ObjectiveState() skips past it if he's not done yet, so it
    // never blocks Ch.16+ — and the Story tab renders it as
    // independently available the moment his term completes, even if
    // the player's already well past it in the main sequence.
    {id:15, title:"Robin's Last Day", focus:"Robin reaches the end of his community service. No redemption speech. He simply finishes what he was ordered to do, and moves on.", image:'assets/comics/arc6/ch15-robins-last-day.png', xp:300},
    {id:16, title:"Jeff's Last Excuse", focus:"Jeff finally runs out of excuses — no powerful in-law, no employees to blame, no authority. Just himself. His labor stays exactly as permanent as it was.", image:'assets/comics/arc6/ch16-jeffs-last-excuse.png', xp:300},
    {id:17, title:'The Fair Tide Grows', focus:"The settlement expands significantly — new stalls, workshops, storage, a community taking shape. Fair Tide has room to grow further now.", image:'assets/comics/arc6/ch17-the-fair-tide-grows.png', xp:350},
    {id:18, title:'The Strange Cargo', focus:"Renn finally identifies the artifact from the captured cargo. It's a kind of magic none of them have ever encountered. He still can't explain where it came from.", image:'assets/comics/arc6/ch18-the-strange-cargo.png', xp:325},
    {id:19, title:'Beyond the Map', focus:"The Crimson Tide follows the clue and finds something that shouldn't exist on their charts at all.", image:'assets/comics/arc6/ch19-beyond-the-map.png', xp:325},
    {id:20, title:'The Door Renn Found', focus:"Renn finally understands what he's looking at. It's a passage — not one they can safely cross yet, but real.", image:'assets/comics/arc6/ch20-the-door-renn-found.png', xp:350},
    {id:21, title:"Captain's Choice", focus:"San decides they won't rush through. She wants the Crimson Tide ready first — ships, crew, supplies, magic, family. Joel agrees: \"Then we'll be ready when you are.\"", image:'assets/comics/arc6/ch21-the-captains-choice.png', xp:325},
    {id:22, title:'The Sea Is Bigger Now', focus:"The crew sails home. The historical world hasn't disappeared — Fair Tide is still there, their people are still there. But the horizon has changed.", image:'assets/comics/arc6/ch22-the-sea-is-bigger-now.png', xp:300},
    {id:23, title:'Everyone Has a Place', focus:"A celebration at Fair Tide — former workers, new crew, old crew, friends. What began as a ship has become something much larger.", image:'assets/comics/arc6/ch23-everyone-has-a-place.png', xp:325},
    {id:24, title:'The Next Horizon', focus:"San stands at the bow. Renn studies the artifact. Joel joins her. The next journey won't be another port. It might be another world.", image:'assets/comics/arc6/ch24-the-next-horizon.png', xp:500}
  ];
  window.ARC6_CHAPTERS = ARC6_CHAPTERS;

  // Robin's real 20-day service completing, not story progress, is what
  // makes Ch.15 available — used by arc6ObjectiveState's skip-logic
  // below, the Story tab's independent-readiness check, and Ch.15's own
  // completion gate, so all three always agree with each other.
  function robinServiceDone(){
    const cs = (typeof window.communityServiceState === 'function') ? window.communityServiceState() : null;
    return !!(cs && cs.robin && cs.robin.active === false);
  }
  window.robinServiceDone = robinServiceDone;

  window.arc6ObjectiveState = function(){
    if (typeof window.arc5ObjectiveState !== 'function' || window.arc5ObjectiveState() !== 'arc5_part1_complete_for_now') return null;
    // Level gate added — Arc VI has the crew capturing Robin and Jeff, so it
    // should read as a genuine step up in strength from Fair Tide's own
    // level-60 unlock, not just "whenever Arc V's chapters are done."
    if (level() < 90) return null;
    game.comicProgress6 = game.comicProgress6 || {};
    for (const ch of ARC6_CHAPTERS) {
      if (game.comicProgress6[ch.id]) continue;
      if (ch.id === 15 && !robinServiceDone()) continue; // skip — doesn't block Ch.16+, see above
      return 'complete_arc6_chapter_' + ch.id;
    }
    return 'arc6_part1_complete_for_now';
  };

  // -------------------------------------------------------------------
  // Captured crew — disposition tags per the brief, mapped to a simple
  // deterministic outcome (kept small and testable rather than random):
  // willing and indentured both end up staying (freedom is what makes
  // the indentured ones choose Fair Tide — "it looks better than where
  // I came from"); family_obligation and wants_release both leave, per
  // the brief's own "different paths, same horizon" framing. Those who
  // stay join game.fairTideRoster as generic civilian crew — full
  // skill-matched roles (Ch.4's Sailors/Traders/Craftspeople system)
  // are a later build, not this one.
  // -------------------------------------------------------------------
  const ARC6_CAPTURED_CREW = [
    {id:'crew_elder_rigger', name:'An Old Rigger', disposition:'family_obligation', desc:'Sends everything home to aging parents.'},
    {id:'crew_dockhand',     name:'A Dock Hand',   disposition:'indentured',        desc:'Three years left on a contract he never should have signed.'},
    {id:'crew_young_deck',   name:'A Young Deckhand', disposition:'wants_release', desc:"Doesn't have anywhere else to go — but wishes he did."},
    {id:'crew_rigger',       name:'A Quiet Rigger', disposition:'willing',         desc:'Chose this life. Would choose it again.'},
    {id:'crew_cook',         name:"A Ship's Cook",  disposition:'family_obligation', desc:'Kids waiting at the next port.'}
  ];
  window.ARC6_CAPTURED_CREW = ARC6_CAPTURED_CREW;
  const STAYING_DISPOSITIONS = ['willing', 'indentured'];

  // Robin's is genuine community service — cleaning, public work, the
  // kind of task he always saw as beneath him. Jeff's isn't that at all:
  // it's a direct mirror of what he used to order at SK* — unloading
  // cargo, no real breaks, clearing brush, working the off-days — the
  // same treatment he handed out, now his own. Shared by claimCommunityLabor
  // and the explore-card render below, with a generic fallback so any
  // future captured rival still gets sensible default text for free.
  function serviceFraming(key, name){
    const table = {
      robin: {icon:'🧹', label:"Community Service", flavor: name + " cleans up after himself, for once — the kind of work he always assumed was beneath him."},
      jeff:  {icon:'⚓', label:"Working His Own Rules", flavor: "Unloading cargo. Clearing brush. Thirty minutes to eat. Working the off-days. Every rule " + name + " used to hand down, he's living now."}
    };
    return table[key] || {icon:'🧹', label:"Community Service", flavor: name + ' does useful work now, whether he likes it or not.'};
  }

  function communityServiceState(){
    game.communityService = game.communityService || {};
    // Migration: repair saves already hit by the Infinity/JSON bug (see
    // captureRival's comment) before this fix existed. After the fix,
    // totalDays == null means "permanent" and such a record should never
    // be inactive — so any record found with totalDays == null AND
    // active:false is necessarily a casualty of the old bug (nothing else
    // in this codebase sets active:false on a permanent record), not a
    // legitimately-completed finite term. Heal it rather than leave
    // players stuck with a wrongly "completed" permanent service.
    Object.keys(game.communityService).forEach(function(k){
      const cs = game.communityService[k];
      if (cs && cs.totalDays == null && cs.active === false) {
        cs.active = true;
        delete cs.completedDay;
      }
    });
    return game.communityService;
  }
  window.communityServiceState = communityServiceState;

  window.captureRival = function(key, totalDays){
    game.rivalsCaptured = game.rivalsCaptured || {};
    game.rivalsCaptured[key] = true;
    // BUG FIX: Infinity was stored directly as the "permanent service, no
    // end date" sentinel, but Infinity doesn't survive JSON — the game's
    // own save/load round-trip silently turns it into null. That broke two
    // things: the completion check below treated null as 0 ("0 >= null" is
    // true in JS), instantly and wrongly completing a permanent term the
    // first time labor was collected after any reload; and the display's
    // own `=== Infinity` check stopped matching, producing "Day 0/null".
    // Storing null here directly (JSON-safe, survives reloads) and having
    // every consumer below treat totalDays == null as "permanent" fixes
    // both — no more silent corruption on save.
    const finalTotalDays = (totalDays === Infinity) ? null : (totalDays || 20);
    communityServiceState()[key] = {active:true, startDay: game.day, totalDays: finalTotalDays, lastClaimDay:-1};
  };
  // Not hardcoded to Robin/Jeff — reads the display name straight from
  // HARBOR_ENEMIES (already there for anyone with a Challenge card),
  // falling back to a title-cased version of the key for a rival that
  // doesn't have one yet. Any future named rival works automatically,
  // no new code needed per-person.
  function rivalDisplayName(key){
    const base = (typeof HARBOR_ENEMIES!=='undefined') ? HARBOR_ENEMIES[key] : null;
    if (base && base.name) return base.name.split(' ')[0].replace(/[^\w]/g,''); // first word, e.g. "Robin C. & His Enforcers" -> "Robin"
    return key.charAt(0).toUpperCase() + key.slice(1);
  }
  window.rivalDisplayName = rivalDisplayName;
  window.rivalCaptured = function(key){
    return !!(game.rivalsCaptured && game.rivalsCaptured[key]);
  };
  window.communityServiceDaysServed = function(key){
    const cs = communityServiceState()[key];
    if (!cs) return 0;
    return Math.max(0, game.day - cs.startDay);
  };
  window.canClaimCommunityLabor = function(key){
    const cs = communityServiceState()[key];
    if (!cs || !cs.active) return false;
    return cs.lastClaimDay !== game.day;
  };
  window.claimCommunityLabor = function(key){
    if (!window.canClaimCommunityLabor(key)) { toast('Already collected today.'); return; }
    const cs = communityServiceState()[key];
    cs.lastClaimDay = game.day;
    game.fairTideResources = game.fairTideResources || {timber:0, stone:0, food:0, trade:0};
    const cap = (typeof window.fairTideResourceCap === 'function') ? window.fairTideResourceCap() : 999999;
    const resKeys = ['timber','stone','food','trade'];
    const pick = resKeys[Math.floor(Math.random()*resKeys.length)];
    const before = game.fairTideResources[pick] || 0;
    game.fairTideResources[pick] = Math.min(cap, before + 3);
    const gained = game.fairTideResources[pick] - before;
    const name = rivalDisplayName(key);
    const framing = serviceFraming(key, name);
    let msg = framing.icon + ' ' + name + "'s labor brings in " + gained + ' ' + pick + '.';
    const served = window.communityServiceDaysServed(key);
    if (cs.totalDays != null && served >= cs.totalDays && cs.active) {
      cs.active = false;
      cs.completedDay = game.day;
      resKeys.forEach(r => { const b = game.fairTideResources[r]||0; game.fairTideResources[r] = Math.min(cap, b+15); });
      msg += ' — his term is complete.';
      logEvent('🧹 ' + name + "'s community service term is complete.", 'gold');
      // Used to auto-fire the full "Robin's Last Day" story modal right
      // here — moved to Ch.15 as a real chapter instead (see
      // completeArc6Chapter15 and the Story tab's special independent-
      // readiness check for it), so this now just flags the moment
      // mechanically without spoiling the actual scene. BUG FIX: this
      // used to call toast() here directly, which the unconditional
      // toast(msg, 3600) right below immediately overwrote — so the
      // completion notice never actually displayed. Appending to msg
      // instead means there's only ever one toast call, so nothing can
      // clobber it.
      if (key === 'robin') {
        msg += ' "Robin\'s Last Day" is ready in the Story tab.';
      }
    }
    toast(msg, 4600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  function generateArc6CaptureEnemy(){
    const base = {
      name: "Robin & Jeff's Fleet",
      icon: '⛓️',
      hp: 900, dmg: 24, xp: 900, gold: 400,
      desc: "Two crews, two ships, one binding system forcing them to move as one. Renn's already working on it — this fight is about buying him time."
    };
    return (typeof scaleCrimsonEnemy==='function') ? Object.assign({}, scaleCrimsonEnemy(base,'harbor'), {name:base.name, icon:base.icon, desc:base.desc}) : base;
  }

  window.startArc6CaptureFight = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_1') { toast('🔒 Not available right now.'); return; }
    startCombat({kind:'arc6capture', key:'arc6_ch1_capture', enemy: generateArc6CaptureEnemy()});
  };

  // Ch.2's completion action — San doesn't pick who stays one at a time;
  // she frees everyone at once, and each person's own disposition (set
  // back at capture) decides whether they stay or go home. Matches the
  // comic: "If you want to stay, stay. If you want to leave, leave. No
  // one will stop you."
  // Generic fallback for future Arc VI chapters that don't need a bespoke
  // completion mechanic (a fight, a crew-free action, etc.) — same
  // mark-as-read pattern Arc IV/V already use. Ch.1 and Ch.2 have their
  // own dedicated functions above and never call this.
  window.markArc6ChapterRead = function(id){
    id = Number(id);
    const ch = ARC6_CHAPTERS.find(c=>c.id===id);
    if (!ch) return;
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[id]) { toast('✓ Already marked read.'); return; }
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_'+id) { toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress6[id] = true;
    if (typeof gainXP==='function') gainXP(ch.xp);
    game.reputation = (game.reputation||0) + 1;
    logEvent('📖 Arc 6 Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP', 'gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  window.freeArc6CapturedCrew = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_2') { toast('🔒 Not available right now.'); return; }
    if (!game.arc6CapturedCrew || !game.arc6CapturedCrew.length) { toast('No one to free.'); return; }
    let stayedCount = 0, leftCount = 0;
    game.arc6CapturedCrew.forEach(c => {
      if (c.freed) return;
      c.freed = true;
      if (c.stayed) {
        game.fairTideRoster = game.fairTideRoster || {};
        if (!game.fairTideRoster[c.id]) {
          game.fairTideRoster[c.id] = {name: c.name, role: 'Fair Tide Crew', icon: '⚓', desc: c.desc};
          stayedCount++;
        }
      } else {
        leftCount++;
      }
    });
    game.comicProgress6 = game.comicProgress6 || {};
    game.comicProgress6[2] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===2);
    if (typeof gainXP==='function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('⚓ Chapter 2 complete: The Ships We Inherit — ' + stayedCount + ' joined Fair Tide, ' + leftCount + ' went home.', 'gold');
    toast('⚓ Freedom given. ' + stayedCount + ' chose to stay, ' + leftCount + ' chose to go home.', 4200);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'The Ships We Inherit',
        blurb: 'Imah, Nurul and Dre watch Robin from a distance. He doesn\'t recognise them.<br><br>"Maybe it\'s better this way," one of them says. "He doesn\'t get to own our memories anymore."<br><br>Later, San finds Joel watching the freed crew settle in.<br><br>"You\'re safe now," she says, pulling him into a hug.<br><br>"I know," he says. "You don\'t have to carry that burden anymore."'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // Ch.3 doesn't capture anyone new — Jeff's already been serving since
  // Ch.1. This is the confrontation beat itself: Joel finally says what
  // he never got to, a crowd of former SK* workers gets its own answer
  // (kept off-panel per the brief), and a couple of them decide Fair
  // Tide is worth joining. No fight, no disposition choice — just a
  // straightforward completion with its own recruits and story beat,
  // same shape as Ch.1/Ch.2's custom handlers rather than the generic
  // markArc6ChapterRead fallback (which stays generic on purpose for
  // whatever Ch.4+ turns out to need).
  const ARC6_CH3_RECRUITS = [
    {id:'sk_worker_1', name:'A Former SK* Worker', role:'Fair Tide Crew', icon:'✊', desc:'Used to duck every time Jeff walked past. Doesn\'t anymore.'},
    {id:'sk_worker_2', name:'Another Former SK* Worker', role:'Fair Tide Crew', icon:'✊', desc:'Remembers exactly how long the WiFi complaint took to "resolve."'}
  ];
  window.completeArc6Chapter3 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_3') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[3]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[3] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===3);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 2; // "morale/reputation increase among former SK* workers" per the brief
    game.fairTideRoster = game.fairTideRoster || {};
    let joined = 0;
    ARC6_CH3_RECRUITS.forEach(r => {
      if (!game.fairTideRoster[r.id]) { game.fairTideRoster[r.id] = {name:r.name, role:r.role, icon:r.icon, desc:r.desc}; joined++; }
    });
    logEvent('✊ Chapter 3 complete: Didn\'t Have Rice? — ' + joined + ' former SK* worker(s) joined Fair Tide.', 'gold');
    toast('✊ Jeff got his just desserts. ' + joined + ' former SK* worker(s) joined Fair Tide.', 4200);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: "Didn't Have Rice?",
        blurb: 'Joel finds Jeff clearing brush, and everything comes back at once.<br><br>' +
          '"You used to be my favourite," Jeff says. "Until—"<br><br>' +
          '"Until I stopped being useful," Joel says. "I wasn\'t speaking up just for myself. I was speaking up for everyone you used. Every one of us has parents. A family. Children. We\'re human too, just like you are."<br><br>' +
          'Jeff tries his last card — "I am the son-in-law of—" — but the crowd is already there. Former SK* workers, sleeves rolling up.<br><br>' +
          '"Not here."<br><br>' +
          '<em>Fifteen minutes later.</em><br><br>' +
          '"Faster!" someone calls, and Jeff, on his knees pulling weeds, mutters the only thing left to say: "Didn\'t have rice?"<br><br>' +
          'San arrives, takes Joel\'s hand, and just laughs. "He got his just desserts."'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // -------------------------------------------------------------------
  // Ch.4 — "The People We Keep." The 7 civilian roles from the brief's
  // "Fair Tide Expansion" panel. Anyone recruited so far with the
  // generic 'Fair Tide Crew' placeholder role (Ch.2's freed crew, Ch.3's
  // former SK* workers) can be assigned one of these — a small always-on
  // bonus per person, read by getRosterBonus() in the reputation-ranks
  // block (ct-build-v91) via window.FT_CIVILIAN_ROLES, so no new combat/
  // economy hook points were needed. Kept deliberately tiny per person
  // (0.01) since this can scale with however many civilians accumulate.
  // Assignment has no deadline — Ch.4 completes on its own trigger, and
  // the assignment UI just keeps working afterward for anyone recruited
  // later too.
  // -------------------------------------------------------------------
  const FT_CIVILIAN_ROLES = {
    sailor:        {name:'Sailors',        icon:'⚓', desc:'Ship operations.',          bonus:{goldBonus:0.01}},
    dock_worker:   {name:'Dock Workers',   icon:'📦', desc:'Maintenance / Loading.',    bonus:{goldBonus:0.01}},
    trader:        {name:'Traders',        icon:'💰', desc:'Merchants / Supply.',       bonus:{goldBonus:0.01}},
    craftsperson:  {name:'Craftspeople',   icon:'🔨', desc:'Repairs / Construction.',   bonus:{xpBonus:0.01}},
    cook:          {name:'Cooks',          icon:'🍲', desc:'Food and morale.',          bonus:{xpBonus:0.01}},
    administrator: {name:'Administrators', icon:'📋', desc:'Records / Management.',     bonus:{goldBonus:0.01}},
    specialist:    {name:'Specialists',    icon:'⭐', desc:'Medical / Education / Other.', bonus:{critBonus:0.01}}
  };
  window.FT_CIVILIAN_ROLES = FT_CIVILIAN_ROLES;

  window.assignCivilianRole = function(crewId, roleKey){
    const roster = game.fairTideRoster || {};
    const member = roster[crewId];
    if (!member) { toast('That person isn\'t at Fair Tide.'); return; }
    const roleDef = FT_CIVILIAN_ROLES[roleKey];
    if (!roleDef) { toast('Not a real role.'); return; }
    member.civilianRole = roleKey;
    member.role = roleDef.name;
    member.icon = roleDef.icon;
    toast(member.name + ' is now working with the ' + roleDef.name + '.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  // Ship designation — per the brief's "not every ship sails with us."
  // Purely a status label on the existing flavor-only inheritedShips
  // records (see Ch.1's handleVictory hook); no new sailing/combat
  // function, same deliberate restraint as those records already had —
  // real fleet mechanics are still Ch.5's decision to make.
  const SHIP_DESIGNATIONS = {
    fleet:     {label:'Joined the Fleet', icon:'🚢'},
    trade:     {label:'Trade Vessel',     icon:'💰'},
    transport: {label:'Transport',        icon:'📦'},
    sold:      {label:'Sold',             icon:'💸'}
  };
  window.SHIP_DESIGNATIONS = SHIP_DESIGNATIONS;
  window.designateShip = function(shipId, designation){
    const ship = (game.inheritedShips||[]).find(s=>s.id===shipId);
    if (!ship) return;
    const def = SHIP_DESIGNATIONS[designation];
    if (!def) return;
    ship.status = def.label;
    ship.designation = designation;
    toast(def.icon + ' ' + ship.name + ': ' + def.label + '.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  window.completeArc6Chapter4 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_4') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[4]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[4] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===4);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('🏮 Chapter 4 complete: The People We Keep — Fair Tide\'s civilian roles are open.', 'gold');
    toast('🏮 Fair Tide grows. Assign anyone still unsorted from the Roster tab whenever you\'re ready.', 4200);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'The People We Keep',
        blurb: '"You don\'t owe me anything," San tells the gathered crew. "If you want to go home, we\'ll help you get there. If you want to stay, we\'ll find work that suits you. And if you want something different — tell me."<br><br>' +
          'Joel watches the process. "You\'re giving everyone too many choices."<br><br>' +
          '"Is that a bad thing?"<br><br>' +
          '"That\'s probably the point."'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // -------------------------------------------------------------------
  // Ch.5 — "A Ship of Our Own." Gives each Ch.4 designation real
  // mechanical follow-through, without touching voyage/combat at all
  // (genuine multi-ship parallel sailing would mean rewriting those
  // systems — too big a change to make blind; this keeps ships as
  // inspectable, upgradeable ASSETS instead):
  //   fleet     -> its own independent stat sheet (hull/cannons/sails/
  //                cargo), upgradeable with gold; cargo levels add to
  //                game.cargoCapacity via the same Math.max-safe pattern
  //                the real Shipyard already uses, so the bonus is
  //                never accidentally lowered by a later sync.
  //   trade     -> a daily gold trickle, same claim-once-a-day shape as
  //                Robin/Jeff's community labor.
  //   transport -> a flat one-time cargo boost, no upgrades to manage.
  //   sold      -> a one-time payout, then removed from the list.
  // Requires every inherited ship to have a Ch.4 designation first —
  // blocks with a clear message pointing back to the Roster tab rather
  // than silently guessing what an undesignated ship should become.
  // -------------------------------------------------------------------
  const FLEET_SHIP_BASE_COST = {hull:120, cannons:140, sails:100, cargo:130};
  function fleetShipUpgradeCost(ship, stat){
    const base = FLEET_SHIP_BASE_COST[stat] || 120;
    const current = Number((ship.stats && ship.stats[stat]) || 1);
    return Math.round(base * current);
  }
  window.fleetShipUpgradeCost = fleetShipUpgradeCost;

  window.upgradeFleetShip = function(shipId, stat){
    const ship = (game.inheritedShips||[]).find(s=>s.id===shipId);
    if (!ship || !ship.stats) { toast('Not a fleet ship.'); return; }
    if (!FLEET_SHIP_BASE_COST[stat]) return;
    const cost = fleetShipUpgradeCost(ship, stat);
    if (game.gold < cost) { toast('Not enough gold.'); return; }
    game.gold -= cost;
    ship.stats[stat] = (ship.stats[stat]||1) + 1;
    if (stat === 'cargo') {
      // Additive and permanent, same safe pattern as the real Shipyard:
      // game.cargoCapacity only ever gets raised via Math.max elsewhere,
      // never reset, so this bonus survives any future recompute.
      game.cargoCapacity = Math.max(Number(game.cargoCapacity||50), Number(game.cargoCapacity||50) + 15);
    }
    toast('🚢 ' + ship.name + ': ' + stat + ' upgraded to level ' + ship.stats[stat] + '.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  window.canClaimTradeIncome = function(shipId){
    const ship = (game.inheritedShips||[]).find(s=>s.id===shipId);
    if (!ship || !ship.tradeIncome) return false;
    return ship.tradeIncome.lastClaimDay !== game.day;
  };
  window.claimTradeIncome = function(shipId){
    const ship = (game.inheritedShips||[]).find(s=>s.id===shipId);
    if (!ship || !ship.tradeIncome) { toast('Not a trade vessel.'); return; }
    if (!window.canClaimTradeIncome(shipId)) { toast('Already collected today.'); return; }
    ship.tradeIncome.lastClaimDay = game.day;
    const amount = 25;
    game.gold = (game.gold||0) + amount;
    toast('💰 ' + ship.name + ' brings in ' + amount + 'g from trade.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  window.completeArc6Chapter5 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_5') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[5]) { toast('✓ Already marked read.'); return; }
    const ships = game.inheritedShips || [];
    const undesignated = ships.filter(s => !s.designation);
    if (undesignated.length) { toast('🔒 Designate every ship first — see the Roster tab.'); return; }
    let soldGold = 0;
    const kept = [];
    ships.forEach(ship => {
      if (ship.designation === 'sold') { soldGold += 800; return; }
      if (ship.designation === 'fleet') ship.stats = ship.stats || {hull:1, cannons:1, sails:1, cargo:1};
      if (ship.designation === 'trade') ship.tradeIncome = ship.tradeIncome || {lastClaimDay:-1};
      if (ship.designation === 'transport') {
        game.cargoCapacity = Math.max(Number(game.cargoCapacity||50), Number(game.cargoCapacity||50) + 25);
      }
      kept.push(ship);
    });
    game.inheritedShips = kept;
    if (soldGold > 0) game.gold = (game.gold||0) + soldGold;
    game.comicProgress6[5] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===5);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('🚢 Chapter 5 complete: A Ship of Our Own' + (soldGold>0?' — sold ships brought in '+soldGold+'g':'') + '.', 'gold');
    toast('🚢 The fleet is sorted.' + (soldGold>0?' +'+soldGold+'g from what was sold.':''), 4200);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'A Ship of Our Own',
        blurb: 'Renn spends a full day going over the rigging of one of the captured ships, muttering to himself the whole time.<br><br>' +
          '"This isn\'t local work," he says finally, holding up a small, strangely-cut crystal. "I don\'t know where it\'s from. I don\'t know what it does yet, either."<br><br>' +
          '"Should I be worried?" San asks.<br><br>' +
          '"Not yet," Renn says. "But I\'m keeping it."'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // -------------------------------------------------------------------
  // Ch.6 — "What They Were Good At." Specialist recruitment: unlike
  // Ch.2/Ch.3's generic "Fair Tide Crew" placeholder recruits, these four
  // arrive with a specific skill already revealed, so they're
  // auto-assigned the matching civilian role (window.FT_CIVILIAN_ROLES,
  // Ch.4) immediately rather than needing a manual pick from the Roster
  // tab. Matches the brief's point directly: Robin saw job titles, San
  // sees people with abilities — the mechanic should reflect that these
  // people were never actually generic.
  // -------------------------------------------------------------------
  const ARC6_CH6_SPECIALISTS = [
    {id:'former_cook', name:'A Former Cook', civilianRole:'cook', icon:'🍲', desc:"Robin never asked what she could do. Turns out it was quite a lot."},
    {id:'former_carpenter', name:'A Former Carpenter', civilianRole:'craftsperson', icon:'🔨', desc:'Kept every tool in good order the whole time he was indentured. Never once got asked to use them for anything that mattered.'},
    {id:'former_navigator', name:'A Former Navigator', civilianRole:'sailor', icon:'⚓', desc:"Knows currents Robin's own charts didn't."},
    {id:'former_trader', name:'A Former Trader', civilianRole:'trader', icon:'💰', desc:'Good with numbers, better with people. Robin only ever saw the numbers.'}
  ];
  window.completeArc6Chapter6 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_6') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[6]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[6] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===6);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    game.fairTideRoster = game.fairTideRoster || {};
    let joined = 0;
    ARC6_CH6_SPECIALISTS.forEach(s => {
      if (!game.fairTideRoster[s.id]) {
        const roleDef = FT_CIVILIAN_ROLES[s.civilianRole];
        game.fairTideRoster[s.id] = {name:s.name, role:roleDef.name, icon:s.icon, desc:s.desc, civilianRole:s.civilianRole};
        joined++;
      }
    });
    logEvent('🔧 Chapter 6 complete: What They Were Good At — ' + joined + ' specialist(s) joined Fair Tide, already sorted into roles.', 'gold');
    toast('🔧 ' + joined + ' specialist(s) joined Fair Tide — already exactly where their skills fit.', 4200);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'What They Were Good At',
        blurb: 'One by one, former workers start stepping forward.<br><br>' +
          '"I\'ve spent years at sea. I can help with navigation and ship repair." "I know trading." "I have medical knowledge." "I can cook." "I\'ve worked with accounts before." "I\'m good with children."<br><br>' +
          '"That counts too," San says, and means it.<br><br>' +
          'Robin saw job titles and usefulness. San sees people with abilities and lives.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // -------------------------------------------------------------------
  // Ch.7 — "The Empty Office." A quiet beat, deliberately no new
  // mechanic: no recruits, no ships, no fight. Robin's own finite
  // community-service term (see ct-build-v94, window.communityServiceState)
  // is untouched by this — this chapter is a realization DURING his
  // service, not its completion (that's still "Robin's Last Day," fired
  // separately by claimCommunityLabor when his 20 days are actually up).
  // -------------------------------------------------------------------
  window.completeArc6Chapter7 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_7') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[7]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[7] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===7);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('🏮 Chapter 7 complete: The Empty Office.', 'gold');
    toast('🏮 Chapter 7 complete: The Empty Office.', 3600);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'The Empty Office',
        blurb: 'Robin pauses mid-task and watches people laughing together at Fair Tide.<br><br>' +
          'Nobody is afraid of him.<br><br>' +
          'Nobody is waiting for his sarcasm.<br><br>' +
          'Nobody cares about his approval.<br><br>' +
          'His old authority didn\'t get taken from him in some dramatic confrontation. It just... stopped mattering. No redemption speech. No apology. Just consequences.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // -------------------------------------------------------------------
  // Ch.8 — "Joel's Rest." Another deliberately quiet chapter, same shape
  // as Ch.7: no recruits, no gold, no ships. Just XP, reputation, and a
  // story beat.
  // -------------------------------------------------------------------
  window.completeArc6Chapter8 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_8') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[8]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[8] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===8);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('🌊 Chapter 8 complete: Joel\'s Rest.', 'gold');
    toast('🌊 Chapter 8 complete: Joel\'s Rest.', 3600);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: "Joel's Rest",
        blurb: 'That evening, Joel finally talks about it — how strange it is, watching the old hierarchy reverse. The people who used to answer to men like Jeff now watch Jeff answer to them.<br><br>' +
          'San doesn\'t have a speech ready. She doesn\'t try to find one.<br><br>' +
          'She just stays beside him.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // -------------------------------------------------------------------
  // Ch.9 — "The Crew That Chose Us." No new individual recruits — the
  // people this chapter is about are already in game.fairTideRoster,
  // recruited across Ch.2/3/6. This is the formal, emotional payoff of
  // everything since Ch.1, so it gets a bigger reputation grant than the
  // usual +1, plus a flag (game.crewFormalized) for anything later that
  // wants to check whether this moment has happened.
  // -------------------------------------------------------------------
  window.completeArc6Chapter9 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_9') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[9]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[9] = true;
    game.crewFormalized = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===9);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 3;
    const crewCount = Object.keys(game.fairTideRoster || {}).length;
    logEvent('⚓ Chapter 9 complete: The Crew That Chose Us — ' + crewCount + ' people, chosen not owed.', 'gold');
    toast('⚓ The crew is formal now. ' + crewCount + ' people chose to be here.', 4200);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'The Crew That Chose Us',
        blurb: 'One by one, the people who stayed become part of the Crimson Tide network for real — not workers anymore, not indentured, not owed anything.<br><br>' +
          'They chose this.<br><br>' +
          'That\'s the whole difference.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // Ch.10 — "The First Voyage." Quiet, same shape as Ch.7/8.
  window.completeArc6Chapter10 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_10') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[10]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[10] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===10);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('⛵ Chapter 10 complete: The First Voyage.', 'gold');
    toast('⛵ Chapter 10 complete: The First Voyage.', 3600);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'The First Voyage',
        blurb: 'The newly recruited crew take their first watch, haul their first lines, share their first meal aboard.<br><br>' +
          'They aren\'t Robin\'s workers anymore.<br><br>' +
          'They\'re sailors aboard their own chosen future.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // -------------------------------------------------------------------
  // Ch.11 — "Something in the Cargo." Advances the artifact thread from
  // Ch.5 by one stage — a tracked flag only, no mechanic yet, matching
  // the deliberate restraint on the whole magical-world thread (San's
  // own call: the crossing itself waits for Arc VII/VIII+, with a real
  // level-gated gap in between). game.arc6Artifact.stage is there for
  // Ch.18/19/20 to read later.
  // -------------------------------------------------------------------
  window.completeArc6Chapter11 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_11') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[11]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[11] = true;
    game.arc6Artifact = game.arc6Artifact || {stage:0};
    game.arc6Artifact.stage = Math.max(game.arc6Artifact.stage, 1);
    const chDef = ARC6_CHAPTERS.find(c=>c.id===11);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('🔮 Chapter 11 complete: Something in the Cargo.', 'gold');
    toast('🔮 Renn keeps digging into whatever that thing actually is.', 3600);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'Something in the Cargo',
        blurb: 'Renn spreads books and diagrams across an entire table, the crystal from Ch.5 sitting in the middle of all of it, doing nothing in particular.<br><br>' +
          '"It\'s not nothing," he says, before anyone asks. "It\'s just not ready to be something yet."<br><br>' +
          'Whatever it is, it doesn\'t belong to the world San knows.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // -------------------------------------------------------------------
  // Ch.12 — "The Price of a Ship." Taking Robin's fleet has consequences
  // — deducts up to 500g (never below 0, never blocks completion if San
  // can't afford the full amount) as the cost of smoothing things over
  // with concerned merchants/authorities, and grants a bigger reputation
  // gain (+5) for handling it diplomatically rather than by force.
  // -------------------------------------------------------------------
  window.completeArc6Chapter12 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_12') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[12]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[12] = true;
    const cost = Math.min(500, game.gold||0);
    game.gold = (game.gold||0) - cost;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===12);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 5;
    logEvent('🤝 Chapter 12 complete: The Price of a Ship — paid ' + cost + 'g to smooth things over.', 'gold');
    toast('🤝 Negotiated, not fought. -' + cost + 'g, +5 reputation.', 4200);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'The Price of a Ship',
        blurb: 'Word travels fast when a captain\'s fleet changes hands by force. Other merchants want reassurance. Local authorities want answers.<br><br>' +
          'San could fight every question that comes her way.<br><br>' +
          'She negotiates instead — pays what needs paying, explains what needs explaining. Not everything has to be won at the point of a sword.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // Ch.13 — "The People Who Left." Quiet — reinforces that freedom
  // doesn't mean everyone should join San.
  window.completeArc6Chapter13 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_13') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[13]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[13] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===13);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('👋 Chapter 13 complete: The People Who Left.', 'gold');
    toast('👋 Chapter 13 complete: The People Who Left.', 3600);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'The People Who Left',
        blurb: 'A few of the freed crew pass back through Fair Tide, briefly.<br><br>' +
          'One reunited with parents she hadn\'t seen in years. One found steady work on land. One just wanted to be done with the sea entirely.<br><br>' +
          'Freedom doesn\'t mean everyone should have joined San. It just means they got to choose.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // Ch.14 — "The People Who Stayed." Quiet — the mirror of Ch.13.
  window.completeArc6Chapter14 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_14') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[14]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[14] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===14);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('🏮 Chapter 14 complete: The People Who Stayed.', 'gold');
    toast('🏮 Chapter 14 complete: The People Who Stayed.', 3600);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'The People Who Stayed',
        blurb: 'The ones who chose Fair Tide explain why, when San finally asks.<br><br>' +
          'Not because she owns them.<br><br>' +
          'Because they believe in what she\'s building.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // -------------------------------------------------------------------
  // Ch.15 — "Robin's Last Day." Gate is robinServiceDone(), NOT the
  // normal arc6ObjectiveState() === 'complete_arc6_chapter_15' check —
  // that check would wrongly block this once the player's read past it,
  // since the objective pointer would already be sitting on whatever
  // chapter comes later by then. This mirrors the exact same condition
  // used in arc6ObjectiveState's skip-logic and the Story tab's
  // independent-readiness check above, so all three always agree.
  // -------------------------------------------------------------------
  window.completeArc6Chapter15 = function(){
    if (!robinServiceDone()) { toast('🔒 Robin\'s community service isn\'t finished yet.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[15]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[15] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===15);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 2;
    logEvent('🏮 Chapter 15 complete: Robin\'s Last Day.', 'gold');
    toast('🏮 Chapter 15 complete: Robin\'s Last Day.', 3600);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: "Robin's Last Day",
        blurb: '"He\'s finished," San says.<br><br>"Good," says Joel.<br><br>"What do we do now?"<br><br>"Keep building Fair Tide."'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // Ch.16 — "Jeff's Last Excuse." Normal sequential gating — reads fine
  // whether or not Ch.15 has happened yet (San's own call: it doesn't
  // matter if Jeff's chapter comes first). Purely narrative: not a
  // completion, just Jeff running out of things to say. Does NOT touch
  // window.communityServiceState().jeff at all — his labor stays exactly
  // as permanent as it already is.
  window.completeArc6Chapter16 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_16') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[16]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[16] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===16);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('🏮 Chapter 16 complete: Jeff\'s Last Excuse.', 'gold');
    toast('🏮 Chapter 16 complete: Jeff\'s Last Excuse.', 3600);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: "Jeff's Last Excuse",
        blurb: 'No powerful in-law left to invoke. No employees left to blame. No authority left at all.<br><br>' +
          'Just Jeff, and whatever excuse he tries this time.<br><br>' +
          'It doesn\'t land. It never really did.<br><br>' +
          'His labor continues, exactly as permanent as it\'s always been.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // -------------------------------------------------------------------
  // Ch.17 — "The Fair Tide Grows." The big expansion chapter. Rather
  // than inventing new building types, this raises the level ceiling on
  // the existing Buildings system (Port HQ + the 4 leveled buildings),
  // wrapping window.fairTideBuildingCap (already exposed, see
  // ct-build-v85-fairtide-buildings) instead of reaching into that
  // block's private FT_BUILDINGS object directly. Real, mechanically
  // meaningful growth using what's already there.
  // -------------------------------------------------------------------
  const oldFairTideBuildingCapForCh17 = window.fairTideBuildingCap;
  window.fairTideBuildingCap = function(key){
    const base = oldFairTideBuildingCapForCh17 ? oldFairTideBuildingCapForCh17(key) : 5;
    return base + (game.arc6PortHqCapBonus || 0);
  };
  window.completeArc6Chapter17 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_17') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[17]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[17] = true;
    game.arc6PortHqCapBonus = (game.arc6PortHqCapBonus||0) + 3;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===17);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 2;
    logEvent('🏮 Chapter 17 complete: The Fair Tide Grows — every building\'s level ceiling raised.', 'gold');
    toast('🏮 Fair Tide grows. Every building can be pushed further now.', 4200);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'The Fair Tide Grows',
        blurb: 'New stalls. Workshops. Storage. Ship services. A community, not just a stopover.<br><br>' +
          'San realizes they\'re no longer merely maintaining a port. They\'re building a home base.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // -------------------------------------------------------------------
  // Ch.18-20 — the artifact thread continuing from Ch.11 (stage 1). Each
  // advances game.arc6Artifact.stage by one. Ch.20 additionally sets
  // game.arc6DoorFound — a flag marking the door exists narratively,
  // with deliberately NO functional travel mechanic attached (San's own
  // call: the actual crossing waits for Arc VII/VIII+, and there'll be a
  // real level-gated gap in between — not to be designed yet).
  // -------------------------------------------------------------------
  window.completeArc6Chapter18 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_18') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[18]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[18] = true;
    game.arc6Artifact = game.arc6Artifact || {stage:0};
    game.arc6Artifact.stage = Math.max(game.arc6Artifact.stage, 2);
    const chDef = ARC6_CHAPTERS.find(c=>c.id===18);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('🔮 Chapter 18 complete: The Strange Cargo.', 'gold');
    toast('🔮 Renn identifies the magic. He still can\'t explain where it\'s from.', 3600);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'The Strange Cargo',
        blurb: '"It\'s a kind of magic," Renn says finally. "I know that much now. What I don\'t know is where it\'s from — nothing here matches it. Not the old world. Not this one either."<br><br>' +
          'Whatever it is, it didn\'t come from anywhere San has ever been.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  window.completeArc6Chapter19 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_19') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[19]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[19] = true;
    game.arc6Artifact = game.arc6Artifact || {stage:0};
    game.arc6Artifact.stage = Math.max(game.arc6Artifact.stage, 3);
    const chDef = ARC6_CHAPTERS.find(c=>c.id===19);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('🗺️ Chapter 19 complete: Beyond the Map.', 'gold');
    toast('🗺️ They found something that shouldn\'t be on any chart.', 3600);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'Beyond the Map',
        blurb: 'Following the artifact\'s pull, the Crimson Tide sails somewhere its own charts have no name for.<br><br>' +
          'The water looks the same. The sky doesn\'t, quite.<br><br>' +
          '"Are we lost?" someone asks.<br><br>' +
          '"No," Renn says, staring at the crystal, now glowing faintly. "I think we\'re early."'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  window.completeArc6Chapter20 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_20') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[20]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[20] = true;
    game.arc6Artifact = game.arc6Artifact || {stage:0};
    game.arc6Artifact.stage = Math.max(game.arc6Artifact.stage, 4);
    game.arc6DoorFound = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===20);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 2;
    logEvent('🚪 Chapter 20 complete: The Door Renn Found.', 'gold');
    toast('🚪 It\'s a passage. Not one they can cross yet — but it\'s real.', 4200);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'The Door Renn Found',
        blurb: 'Renn finally puts a name to it.<br><br>' +
          '"It\'s a door," he says. "Not safe to open yet. Maybe not for a long while. But it\'s real, and it\'s ours to find, whenever we\'re ready."<br><br>' +
          'San looks at it a long moment.<br><br>' +
          '"Not yet," she says. "But someday."'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // Ch.21-23 — quiet, same shape as Ch.7/8/10/13/14. Ch.21 sets a flag
  // (arc6ReadinessChosen) marking San's deliberate choice not to rush
  // the crossing — read by nothing yet, but there for whatever Arc VII
  // eventually wants to check.
  window.completeArc6Chapter21 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_21') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[21]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[21] = true;
    game.arc6ReadinessChosen = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===21);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('⚓ Chapter 21 complete: Captain\'s Choice.', 'gold');
    toast('⚓ Chapter 21 complete: Captain\'s Choice.', 3600);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: "Captain's Choice",
        blurb: 'San decides they won\'t rush through.<br><br>' +
          'Ships. Crew. Supplies. Magic. Family. Everything, first.<br><br>' +
          'Joel agrees. "Then we\'ll be ready when you are."'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  window.completeArc6Chapter22 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_22') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[22]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[22] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===22);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('🌊 Chapter 22 complete: The Sea Is Bigger Now.', 'gold');
    toast('🌊 Chapter 22 complete: The Sea Is Bigger Now.', 3600);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'The Sea Is Bigger Now',
        blurb: 'The crew sails home.<br><br>' +
          'The historical world hasn\'t disappeared. Fair Tide is still there. Their people are still there.<br><br>' +
          'But the horizon has changed.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  window.completeArc6Chapter23 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_23') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[23]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[23] = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===23);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 300);
    game.reputation = (game.reputation||0) + 2;
    logEvent('🎉 Chapter 23 complete: Everyone Has a Place.', 'gold');
    toast('🎉 A celebration at Fair Tide. Everyone has a place.', 4200);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'Everyone Has a Place',
        blurb: 'Former workers. New crew. Old crew. Friends. All of them, in one place, at once.<br><br>' +
          'San looks around and realizes what began as a ship has become something much larger.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  // -------------------------------------------------------------------
  // Ch.24 — "The Next Horizon." The finale. Bigger payoff than any other
  // chapter (500 XP, +5 reputation, matching how Arc V's own finale was
  // treated), and sets game.arc6Complete — a clean flag for Arc VII to
  // gate on later, separate from arc6ObjectiveState()'s own terminal
  // string (which already reflects "every chapter built so far is
  // read," but a dedicated flag is clearer for a future arc to check).
  // -------------------------------------------------------------------
  window.completeArc6Chapter24 = function(){
    if (window.arc6ObjectiveState() !== 'complete_arc6_chapter_24') { toast('🔒 Not available right now.'); return; }
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[24]) { toast('✓ Already marked read.'); return; }
    game.comicProgress6[24] = true;
    game.arc6Complete = true;
    const chDef = ARC6_CHAPTERS.find(c=>c.id===24);
    if (typeof gainXP === 'function') gainXP(chDef ? chDef.xp : 500);
    game.reputation = (game.reputation||0) + 5;
    logEvent('🌅 Arc VI complete: The Next Horizon.', 'gold');
    toast('🌅 Arc VI complete. The next journey won\'t be another port.', 5000);
    if (typeof game.storyModalQueue !== 'undefined') {
      game.storyModalQueue.push({
        title: 'The Next Horizon',
        blurb: 'San stands at the bow. Renn studies the artifact, still glowing faintly. Joel joins her, close enough that she doesn\'t have to reach for him.<br><br>' +
          '"We came here looking for somewhere to stop," San says.<br><br>' +
          '"And stayed," Joel says.<br><br>' +
          '"We built something."<br><br>' +
          'The Crimson Tide sails out.<br><br>' +
          'The next journey won\'t be another port. It might be another world.'
      });
    }
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  const oldRenderStoryForArc6 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc6) oldRenderStoryForArc6();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const so = window.arc6ObjectiveState();
    if (so === null) return;
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<div class="story-act-kicker">Arc VI</div><div class="story-act-title">The Price of Freedom</div>'+
      '<div class="story-act-tagline">Power gives San the choice to do better.</div></div>';
    ARC6_CHAPTERS.forEach(ch=>{
      const done = !!game.comicProgress6?.[ch.id];
      // Ch.15 doesn't follow the normal "matches the current objective"
      // rule — it's independently ready the moment Robin's service is
      // actually done, even if the player's already read chapters well
      // past it (see robinServiceDone() above).
      const ready = ch.id === 15
        ? (!done && window.robinServiceDone())
        : (!done && so===('complete_arc6_chapter_'+ch.id));
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action, extra = '';
      if (ch.id === 1) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-danger" onclick="startArc6CaptureFight()">⚔️ Intercept the Ships</button>';
        else action = done ? '<div class="story-chip">✓ Robin and Jeff, captured.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 2) {
        if (ready) {
          action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
            '<button class="btn btn-small btn-success" onclick="freeArc6CapturedCrew()">⚓ Set Them Free</button>';
          const crew = game.arc6CapturedCrew || [];
          if (crew.length) {
            extra = '<div style="margin-top:8px;font-size:.78rem;opacity:.85;">'+crew.map(c=>
              '<div style="margin:2px 0;">'+esc(c.name)+' — <em>'+c.disposition.replace('_',' ')+'</em>: '+esc(c.desc)+' <span style="opacity:.7;">('+(c.stayed?'will stay':'will go home')+')</span></div>'
            ).join('')+'</div>';
          }
        } else action = done ? '<div class="story-chip">✓ Freedom given — some stayed, some went home.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 3) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter3()">✊ Confront Jeff</button>';
        else action = done ? '<div class="story-chip">✓ He got his just desserts.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 4) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter4()">🏮 Give Everyone a Choice</button>';
        else action = done ? '<div class="story-chip">✓ Fair Tide\'s civilian roles are open — assign anyone unsorted from the Roster tab.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 5) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter5()">🚢 Sort the Fleet</button>';
        else action = done ? '<div class="story-chip">✓ The fleet is sorted.</div>' : '<div class="story-chip">Designate every ship in the Roster tab first, then follow the current Objective.</div>';
      } else if (ch.id === 6) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter6()">🔧 Hear Them Out</button>';
        else action = done ? '<div class="story-chip">✓ Specialists found their place.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 7) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter7()">🏮 Continue</button>';
        else action = done ? '<div class="story-chip">✓ The office stays empty.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 8) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter8()">🌊 Continue</button>';
        else action = done ? '<div class="story-chip">✓ She just stays beside him.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 9) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter9()">⚓ Make It Formal</button>';
        else action = done ? '<div class="story-chip">✓ They chose this.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 10) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter10()">⛵ Continue</button>';
        else action = done ? '<div class="story-chip">✓ Sailors aboard their own chosen future.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 11) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter11()">🔮 Let Renn Look Closer</button>';
        else action = done ? '<div class="story-chip">✓ Not nothing. Just not ready yet.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 12) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter12()">🤝 Negotiate</button>';
        else action = done ? '<div class="story-chip">✓ Negotiated, not fought.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 13) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter13()">👋 Continue</button>';
        else action = done ? '<div class="story-chip">✓ They got to choose.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 14) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter14()">🏮 Continue</button>';
        else action = done ? '<div class="story-chip">✓ They believe in what she\'s building.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 15) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter15()">🏮 Continue</button>';
        else action = done ? '<div class="story-chip">✓ He\'s finished. Fair Tide keeps going.</div>' : '<div class="story-chip">Waiting on Robin\'s community service to finish — check back later.</div>';
      } else if (ch.id === 16) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter16()">🏮 Continue</button>';
        else action = done ? '<div class="story-chip">✓ Just himself, now.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 17) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter17()">🏮 Let Fair Tide Grow</button>';
        else action = done ? '<div class="story-chip">✓ A home base, not just a port.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 18) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter18()">🔮 Continue</button>';
        else action = done ? '<div class="story-chip">✓ A kind of magic none of them have seen.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 19) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter19()">🗺️ Continue</button>';
        else action = done ? '<div class="story-chip">✓ Not lost. Early.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 20) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter20()">🚪 Continue</button>';
        else action = done ? '<div class="story-chip">✓ Not yet. But someday.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 21) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter21()">⚓ Continue</button>';
        else action = done ? '<div class="story-chip">✓ We\'ll be ready when you are.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 22) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter22()">🌊 Continue</button>';
        else action = done ? '<div class="story-chip">✓ The horizon has changed.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 23) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="completeArc6Chapter23()">🎉 Celebrate</button>';
        else action = done ? '<div class="story-chip">✓ Something much larger.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else if (ch.id === 24) {
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-danger" onclick="completeArc6Chapter24()">🌅 Sail Out</button>';
        else action = done ? '<div class="story-chip">✓ Arc VI complete. It might be another world.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      } else {
        // Fallback for future chapters — standard mark-as-read pattern,
        // same as every other arc, until this one needs its own mechanic.
        if (ready) action = '<button class="btn btn-small" onclick="openComicImage(\''+ch.image+'\')">📖 Open Chapter</button> '+
          '<button class="btn btn-small btn-success" onclick="markArc6ChapterRead('+ch.id+')">✓ Mark Chapter Read</button>';
        else action = done ? '<div class="story-chip">✓ Complete.</div>' : '<div class="story-chip">Follow the current Objective.</div>';
      }
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div>'+extra+'</article>';
    });
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };

  const oldHandleVictoryForArc6 = window.handleVictory;
  window.handleVictory = function(){
    if (oldHandleVictoryForArc6) oldHandleVictoryForArc6();
    const enemy = game.combatEnemy;
    if (!enemy || enemy.kind !== 'arc6capture') return;
    game.comicProgress6 = game.comicProgress6 || {};
    if (game.comicProgress6[1]) return;
    game.comicProgress6[1] = true;
    window.captureRival('robin', 20); // finite term — pays off in a future "Robin's Last Day" chapter
    window.captureRival('jeff', Infinity); // permanent — Jeff's arc isn't about service ending, it's about running out of excuses (and later, the Vision Machine)
    game.arc6CapturedCrew = ARC6_CAPTURED_CREW.map(c => ({...c, freed:false, stayed: STAYING_DISPOSITIONS.includes(c.disposition)}));
    // Two captured ships, tracked as flavor-only records for now — no
    // stats, no fleet-combat function, nothing mechanical yet. Real
    // fleet management (keep/repair/convert/sell) is Ch.5's decision to
    // make, not this one's; adding function to these now would mean
    // redesigning them again once that chapter actually exists.
    game.inheritedShips = game.inheritedShips || [];
    if (!game.inheritedShips.some(s=>s.id==='robins_ship')) game.inheritedShips.push({id:'robins_ship', name:"Robin's Ship", flag:'⛓️', status:'At dock, Fair Tide'});
    if (!game.inheritedShips.some(s=>s.id==='jeffs_ship')) game.inheritedShips.push({id:'jeffs_ship', name:"Jeff's Ship", flag:'🔨', status:'At dock, Fair Tide'});
    // BUG FIX: this chapter's completion never actually called gainXP,
    // so its defined 300 XP silently never granted — every other
    // chapter (here and in every other arc) does grant its xp on
    // completion; this one just got missed when the fight-based
    // completion path was built (Ch.2's markArc6ChapterRead-style flow
    // remembered it, this custom one didn't).
    const ch1Def = ARC6_CHAPTERS.find(c=>c.id===1);
    if (typeof gainXP==='function') gainXP(ch1Def ? ch1Def.xp : 300);
    game.reputation = (game.reputation||0) + 1;
    logEvent('⚔️ Chapter 1 complete: The Captives — Robin and Jeff are prisoners.', 'gold');
    toast('⚔️ Robin and Jeff are captured — two ships and their crews are yours to sort out.', 4200);
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderMainGoal === 'function') renderMainGoal();
    if (typeof renderStory === 'function') renderStory();
  };

  const oldRenderExploreForArc6 = window.renderExplore;
  window.renderExplore = function(){
    if (oldRenderExploreForArc6) oldRenderExploreForArc6();
    // Iterates whoever's actually in game.rivalsCaptured — not a fixed
    // pair — so any future captured rival gets a card automatically.
    // rivalDisplayName() falls back gracefully even if that rival has no
    // HARBOR_ENEMIES entry (e.g. captured through a pure story beat with
    // no prior repeatable Challenge fight).
    //
    // BUG FIX (San's request): with up to 50+ possible named captains
    // plus Robin/Jeff all potentially captured over time, this section
    // was rendering one full card per rival directly into the page —
    // "getting very long" as more get captured. Now built into a single
    // string first and wrapped in a native <details> element, collapsed
    // by default, with a count in the summary instead of always-open.
    const capturedKeys = Object.keys(game.rivalsCaptured || {}).filter(function(key){ return window.rivalCaptured(key); });
    // BUG FIX (San's request): completed community service used to stay
    // listed forever alongside active ones, cluttering the section even
    // after a rival's term was long since served. Now only active service
    // shows at all — completed entries are hidden entirely, not just
    // collapsed. Jeff's own service has no end date (totalDays: null),
    // so he correctly never gets filtered out here.
    const activeKeys = capturedKeys.filter(function(key){ const cs = communityServiceState()[key]; return cs && cs.active; });
    if (activeKeys.length) {
      const container = document.getElementById('exploreContent');
      if (container) {
        let cardsHtml = '';
        activeKeys.forEach(function(key){
          const name = rivalDisplayName(key);
          const served = window.communityServiceDaysServed(key);
          const cs = communityServiceState()[key] || {totalDays:20, active:false};
          const canClaim = window.canClaimCommunityLabor(key);
          const dayLabel = (cs.totalDays == null)
            ? 'Day ' + served + ' · Permanent — no end date'
            : 'Day ' + Math.min(served,cs.totalDays) + '/' + cs.totalDays + (cs.active?'':' · Term complete');
          const framing = serviceFraming(key, name);
          cardsHtml +=
            '<h3 style="font-family:Cinzel;color:var(--gold);margin:18px 0 8px;font-size:1rem;">'+framing.icon+' '+name+"'s "+framing.label+'</h3>'+
            '<article class="quest-item"><div style="font-size:.85rem;opacity:.85;">'+framing.flavor+'</div>'+
            '<div style="font-size:.8rem;margin-top:6px;">'+dayLabel+'</div>'+
            (cs.active ? '<button class="btn btn-small btn-success" style="margin-top:6px;" '+(canClaim?'':'disabled')+' onclick="claimCommunityLabor(\''+key+'\')">'+framing.icon+' Collect Today\'s Labor</button>' : '')+
            '</article>';
        });
        container.insertAdjacentHTML('beforeend',
          '<details style="margin-top:14px;"><summary style="cursor:pointer;font-family:Cinzel;color:var(--gold);font-size:.95rem;padding:6px 0;">'+
          '⛓️ Community Service ('+activeKeys.length+' active)</summary>'+
          cardsHtml+'</details>');
      }
    }
  };
})();
