(function(){
  // -------------------------------------------------------------------
  // THE TRIBUTE HOUSE (working name) -- a special Fair Tide building for
  // the Tribute people who live at Fair Tide in the sequel.
  //
  // A Fair Tide hub tab, same shape as the Steady Reach building
  // (fair-tide-steady-reach-building.js): it opens as of the sequel (the
  // Crimson Horizon Prologue is read), lists who lives here, and has one
  // once-a-day visit worth +3 Fair Tide Mood.
  //
  // Who lives here: only Sera does, as of the sequel (Crimson Horizon
  // 080: "She says she's grown fond of deciding how to spend a day before
  // anyone else decides for her"). She moves out of the Residents list on
  // the Allies & Guests tab and is looked after here (happiness, bond,
  // Check In). Jade and Devon, and Sally and Levi, still sail with the
  // Crimson Tide; once Ch.079 is read the house shows the rooms they have
  // agreed to look at, nothing more.
  //
  // TRIBUTE_HOUSE_RESIDENTS is an array on purpose: the sequel will bring
  // more of Tribute's former crew, and each is one more entry with its own
  // eligibility, with nothing else to wire. Anyone listed here must have a
  // resident record (arc28-mechanics.js) to get happiness and Check In.
  // -------------------------------------------------------------------

  const RESIDENTS = [
    {id:'sera', name:'Sera', icon:'🌊', room:'Her room at the Tribute House',
      note:"Has grown fond of deciding how to spend a day before anyone else decides for her.",
      eligible:function(){
        const r = (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState().sera : null;
        return !!(r && r.status === 'resident');
      }}
  ];
  window.TRIBUTE_HOUSE_RESIDENTS = RESIDENTS;

  // From Ch.079 ("The Cabin Across the Hall", id 80): the rooms being looked at.
  const ROOMS_BEING_LOOKED_AT = [
    {who:'Jade and Devon', icon:'🌙', text:'Near Sky and the infirmary, if their due windows do overlap.'},
    {who:'Sally and Levi', icon:'🏹', text:'A room of their own, with Jade close enough to complain through the wall.'}
  ];

  const LINES = [
    "The kettle at the Tribute House is already on. Sera doesn't ask who it's for.",
    "A lantern from Lunareth hangs beside the harbor window. Sera says it's for the view.",
    "Sera has pinned a hand-drawn map of Lunareth to the wall, with Fair Tide marked beside it.",
    "Sera is rearranging a shelf by colour. Nobody asked her to, and nobody stops her.",
    "A spare room stands ready with its door open, in case anyone from Tribute needs it.",
    "The house is quiet the way a home is quiet: unhurried, and nobody keeping score."
  ];

  function unlocked(){
    return !!(game.arc42Complete && game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[1]);
  }
  window.tributeHouseUnlocked = unlocked;
  function visitState(){ if (!game.tributeHouseVisitDay) game.tributeHouseVisitDay = 0; return game.tributeHouseVisitDay; }
  function residentsHere(){ return RESIDENTS.filter(function(r){ return !r.eligible || r.eligible(); }); }
  window.tributeHouseResidentIds = function(){ return unlocked() ? residentsHere().map(function(r){ return r.id; }) : []; };

  window.visitTributeHouse = function(){
    if (!unlocked()) return;
    if (visitState() === game.day) { toast('You already stopped by the Tribute House today. Come back tomorrow.'); return; }
    game.tributeHouseVisitDay = game.day;
    const line = LINES[Math.floor(Math.random() * LINES.length)];
    if (typeof window.addFairTideMood === 'function') window.addFairTideMood(3);
    logEvent('🏡 ' + line, 'good');
    toast('🏡 ' + line, 4200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  function residentRow(r){
    const rec = (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState()[r.id] : null;
    let extra = '';
    if (rec && typeof window.residentHappinessTier === 'function' && typeof window.residentBondTier === 'function') {
      const h = window.residentHappinessTier(rec), b = window.residentBondTier(rec);
      extra = '<br><span style="font-size:.76rem;opacity:.7;">' + h.icon + ' Happiness: ' + esc(h.label) + ' · ' + b.icon + ' Bond with San: ' + esc(b.label) + '</span>';
    }
    let btn = '';
    if (rec && typeof window.canCheckInOnResident === 'function') {
      const can = window.canCheckInOnResident(r.id);
      btn = '<div style="margin-top:6px;"><button class="btn btn-small" onclick="checkInOnResident(\'' + r.id + '\')" ' + (can ? '' : 'disabled') + '>💬 ' + (can ? 'Check In' : 'Checked In Today') + '</button></div>';
    }
    return '<article class="quest-item"><strong>' + r.icon + ' ' + esc(r.name) + '</strong> — <span style="opacity:.8;">' + esc(r.room) + '</span><br>' +
      '<span style="font-size:.8rem;opacity:.8;">' + esc(r.note) + '</span>' + extra + btn + '</article>';
  }

  function renderTributeHouseTab(){
    const el = document.getElementById('ft-tab-tribute_house');
    if (!el) return;
    if (!unlocked()) {
      el.innerHTML = '<div class="panel-title">🏡 The Tribute House</div>' +
        '<p style="font-size:.85rem;opacity:.7;">🔒 Not built yet. It opens when the Crimson Horizon voyage begins.</p>';
      return;
    }
    const visited = visitState() === game.day;
    let html = '<div class="panel-title">🏡 The Tribute House</div>' +
      '<p style="font-size:.8rem;opacity:.7;margin-bottom:10px;">A house at Fair Tide for the people from Tribute who live here. (Working name.)</p>';
    html += '<div class="panel-title" style="font-size:.95rem;margin-top:6px;">Who lives here</div>';
    const here = residentsHere();
    html += here.length ? here.map(residentRow).join('') : '<div class="story-chip">Nobody yet.</div>';
    if (game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[80]) {
      html += '<div class="panel-title" style="font-size:.95rem;margin-top:12px;">Rooms being looked at</div>' +
        ROOMS_BEING_LOOKED_AT.map(function(r){
          return '<article class="quest-item"><strong>' + r.icon + ' ' + esc(r.who) + '</strong><br><span style="font-size:.8rem;opacity:.8;">' + esc(r.text) + '</span></article>';
        }).join('') +
        '<p style="font-size:.74rem;opacity:.6;margin:4px 0 0;">They still sail with the Crimson Tide.</p>';
    }
    html += '<div style="margin-top:12px;">' +
      '<span style="font-size:.8rem;opacity:.8;">Once per day · +3 Fair Tide Mood</span><br>' +
      (visited
        ? '<span style="font-size:.76rem;opacity:.65;">Already stopped by today.</span>'
        : '<button class="btn btn-small btn-success" style="margin-top:6px;" onclick="visitTributeHouse()">🏡 Stop by the House</button>') +
      '</div>';
    el.innerHTML = html;
  }
  window.renderTributeHouseTab = renderTributeHouseTab;

  // Sera lives here now, so she leaves the Residents list on the Allies & Guests tab.
  const oldHidden = window.residentHiddenFromRosterPanel;
  window.residentHiddenFromRosterPanel = function(id){
    if (unlocked() && RESIDENTS.some(function(r){ return r.id === id; }) && residentsHere().some(function(r){ return r.id === id; })) return true;
    return oldHidden ? oldHidden.apply(this, arguments) : false;
  };

  const oldRenderFairTideHubForTributeHouse = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-tribute_house');
    const btn = document.getElementById('ft-tab-btn-tribute_house');
    if (el) el.classList.toggle('active', tab === 'tribute_house');
    if (btn) btn.classList.toggle('active', tab === 'tribute_house');
    if (oldRenderFairTideHubForTributeHouse) oldRenderFairTideHubForTributeHouse();
    if (tab === 'tribute_house') renderTributeHouseTab();
  };
})();
