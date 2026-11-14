(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE'S BUILDINGS, IN THE TRIBUTE HOME FORMAT (see
  // fair-tide-tribute-house.js and fair-tide-captains-home.js, after
  // Tribute's Gold Manor and Devon's Palace). The buildings already have
  // levels, costs and named tenders, so this adds only the two parts they
  // lacked and changes none of their numbers:
  //
  //   * TENDER MOOD -- each building whose tender is a Fair Tide Roster
  //     resident (Dudin, Wahyu, Gino, Jorvin, Imah) shows that person's
  //     happiness and bond on the building card, with Check In.
  //   * BUILDING MEMORIES -- small permanent details tied to each
  //     building's level, shown once and written to the Fair Tide
  //     Chronicle, listed under the buildings.
  // -------------------------------------------------------------------

  // [card name] -> tender id (Fair Tide Roster / resident record)
  const TENDERS = {
    'Warehouse':    'dudin',
    'Trading Post': 'wahyu',
    'Galley':       'gino',
    'Workshop':     'jorvin',
    'Watchtower':   'imah'
  };

  function lv(key){ return ((game.fairTideBuildings || {})[key]) || 0; }
  const MEMORIES = [
    {id:'hq_1', key:'port_hq', at:1, icon:'🏮', t:'The Port HQ lamp is lit all night now, so returning crews can find the quay.'},
    {id:'hq_5', key:'port_hq', at:5, icon:'🏮', t:'Visitors ask which way to the Port HQ before they ask for anything else.'},
    {id:'wh_1', key:'warehouse', at:1, icon:'📦', t:"The Warehouse shelves are labelled in Dudin's neat hand, and nobody has had to ask where anything is since."},
    {id:'wh_4', key:'warehouse', at:4, icon:'📦', t:'A second loft has been added above the crates. Dudin calls it the overflow and will not be argued with.'},
    {id:'tp_1', key:'trading_post', at:1, icon:'🏪', t:"Wahyu's price board has a small chalk drawing in the corner that nobody will admit to."},
    {id:'tp_4', key:'trading_post', at:4, icon:'🏪', t:'Traders from other ports now ask for Wahyu by name.'},
    {id:'ga_1', key:'galley', at:1, icon:'🍲', t:"Gino's galley smells of bread before sunrise, and the crew arrive early on purpose."},
    {id:'ga_4', key:'galley', at:4, icon:'🍲', t:'There is always a bowl left on the Galley counter for whoever comes in late.'},
    {id:'wk_1', key:'workshop', at:1, icon:'🔧', t:"Jorvin's bench has an outline of every tool painted on the wall behind it, so the gaps show at a glance."},
    {id:'wk_4', key:'workshop', at:4, icon:'🔧', t:'Shipyard hands now come to the Workshop first for anything that is stuck.'},
    {id:'wt_1', key:'watchtower', at:1, icon:'🔭', t:"Imah's watch log lives in a tin by the lamp, entry after entry, in a very small hand."},
    {id:'wt_4', key:'watchtower', at:4, icon:'🔭', t:'The Watchtower lamp is lit before dusk now, so nobody on the water has to wonder.'},
    {id:'ar_1', key:'archive', at:1, icon:'🏛️', t:"Renn's Archive has one shelf kept clear for whatever the next chapter turns up."},
    {id:'ar_4', key:'archive', at:4, icon:'🏛️', t:"The Archive's reading table has a permanent ring from a mug nobody admits to leaving."}
  ];
  function mem(){ if (!game.fairTideBuildingMemories) game.fairTideBuildingMemories = {}; return game.fairTideBuildingMemories; }
  function syncMemories(){
    if (typeof game === 'undefined' || !game) return;
    const m = mem();
    MEMORIES.forEach(function(x){
      if (m[x.id] || lv(x.key) < x.at) return;
      m[x.id] = game.day || 1;
      if (typeof window.recordChronicleEntry === 'function') window.recordChronicleEntry(x.t, x.icon);
    });
  }
  window.syncFairTideBuildingMemories = syncMemories;

  function tenderLine(id){
    const rec = (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState()[id] : null;
    if (!rec || typeof window.residentHappinessTier !== 'function' || typeof window.residentBondTier !== 'function') return '';
    const h = window.residentHappinessTier(rec), b = window.residentBondTier(rec);
    let btn = '';
    if (typeof window.canCheckInOnResident === 'function') {
      const can = window.canCheckInOnResident(id);
      btn = ' <button class="btn btn-small" ' + (can ? '' : 'disabled') + ' onclick="checkInOnResident(\'' + id + '\')">💬 ' + (can ? 'Check In' : 'Checked In Today') + '</button>';
    }
    return '<div class="tender-mood" style="margin-top:6px;font-size:.76rem;opacity:.85;">' + esc(rec.name || id) + ': ' + h.icon + ' Happiness: ' + esc(h.label) + ' · ' + b.icon + ' Bond with San: ' + esc(b.label) + btn + '</div>';
  }

  const oldRenderFairTideHubForBuildingHomes = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    if (oldRenderFairTideHubForBuildingHomes) oldRenderFairTideHubForBuildingHomes();
    if ((game.fairTideActiveTab || 'buildings') !== 'buildings') return;
    const el = document.getElementById('ft-tab-buildings');
    if (!el) return;
    syncMemories();
    el.querySelectorAll('article.quest-item').forEach(function(card){
      if (card.querySelector('.tender-mood')) return;
      const strong = card.querySelector('strong');
      if (!strong) return;
      const name = Object.keys(TENDERS).find(function(n){ return strong.textContent.indexOf(n) !== -1; });
      if (!name) return;
      const line = tenderLine(TENDERS[name]);
      if (line) card.insertAdjacentHTML('beforeend', line);
    });
    const old = document.getElementById('buildingMemoriesWrap'); if (old) old.remove();
    const got = MEMORIES.filter(function(x){ return mem()[x.id]; });
    el.insertAdjacentHTML('beforeend', '<div id="buildingMemoriesWrap" style="margin-top:14px;">' +
      '<div class="panel-title" style="font-size:.95rem;">Memories of Fair Tide\'s buildings <span style="font-size:.74rem;opacity:.6;">(' + got.length + '/' + MEMORIES.length + ')</span></div>' +
      (got.length ? got.map(function(x){ return '<div style="font-size:.8rem;opacity:.85;margin:3px 0;">' + x.icon + ' ' + esc(x.t) + '</div>'; }).join('')
                  : '<div style="font-size:.78rem;opacity:.6;">Nothing yet. Small details appear as the buildings grow.</div>') +
      '</div>');
  };

  const oldUpgrade = window.upgradeFairTideBuilding;
  if (typeof oldUpgrade === 'function') {
    window.upgradeFairTideBuilding = function(){
      const r = oldUpgrade.apply(this, arguments);
      try { syncMemories(); } catch(e) {}
      return r;
    };
  }
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      try { if (typeof gameSessionActive !== 'undefined' && gameSessionActive) syncMemories(); } catch(e) {}
      return oldUpdateUI.apply(this, arguments);
    };
  }
})();
