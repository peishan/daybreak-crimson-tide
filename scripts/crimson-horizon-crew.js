(function(){
  // -------------------------------------------------------------------
  // CRIMSON HORIZON CREW -- the two-sided crew from the sequel's design:
  // San's side and Jade's side, shown with the real sequel portraits as a
  // collapsed panel at the bottom of the Crew screen once Arc XLII is
  // complete. INFORMATION ONLY: the five on Jade's side are real party
  // members (scripts/canon-five.js) fielded from the roster above; this
  // panel just shows the two-sided structure. Nothing here changes the
  // party, fielding or combat.
  // -------------------------------------------------------------------
  const SIDES = [
    { title: "San's side", members: [
      { id: 'san',      name: 'San',      role: 'Captain',          img: 'assets/portraits/sequel/san.png' },
      { id: 'joel',     name: 'Joel',     role: 'First Mate',       img: 'assets/portraits/sequel/joel.png' },
      { id: 'aisyah',   name: 'Aisyah',   role: 'Quartermaster',    img: 'assets/portraits/aisyah.png' },
      { id: 'mezstorm', name: 'Mezstorm', role: 'Storm Caller',     img: 'assets/portraits/mezstorm.png' },
      { id: 'sairen',   name: 'Sairen',   role: 'Dive Team',        img: 'assets/portraits/sairen.png' },
      { id: 'soel',     name: 'Soel',     role: 'Familiar · booster', img: 'assets/portraits/soel.png', booster: true },
      { id: 'vaeren',   name: 'Vaeren',   role: 'Twin · booster',   img: 'assets/portraits/vaeren.png', booster: true },
      { id: 'joelle',   name: 'Joelle',   role: 'Twin · booster',   img: 'assets/portraits/joelle.png', booster: true }
    ] },
    { title: "Jade's side", members: [
      { id: 'jade',  name: 'Jade',  role: 'Imperial Guardian', img: 'assets/portraits/sequel/jade.png' },
      { id: 'devon', name: 'Devon', role: 'Dragon Scholar',    img: 'assets/portraits/sequel/devon.png' },
      { id: 'sky',   name: 'Sky',   role: 'Mystic Martialist', img: 'assets/portraits/sequel/sky.png' },
      { id: 'levi',  name: 'Levi',  role: 'Shadow Archer',     img: 'assets/portraits/sequel/levi.png' },
      { id: 'sally', name: 'Sally', role: 'Noble Assassin',    img: 'assets/portraits/sequel/sally.png' }
    ] }
  ];
  window.CRIMSON_HORIZON_CREW = SIDES;

  function chip(m){
    return '<div class="chc-chip' + (m.booster ? ' booster' : '') + '">' +
      '<div class="chc-pt"><img src="' + m.img + '" alt="" onerror="this.remove()"></div>' +
      '<div class="chc-name">' + esc(m.name) + '</div><div class="chc-role">' + esc(m.role) + '</div></div>';
  }

  function panelHtml(){
    let h = '<style id="chcStyle">' +
      '.chc-grid{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 10px}' +
      '.chc-chip{width:64px;text-align:center}' +
      '.chc-pt{width:56px;height:56px;margin:0 auto;border-radius:10px;overflow:hidden;border:1px solid rgba(232,197,71,.45);background:rgba(5,13,19,.8)}' +
      '.chc-chip.booster .chc-pt{border-style:dashed;opacity:.9}' +
      '.chc-pt img{width:100%;height:100%;object-fit:cover;object-position:center 20%;display:block}' +
      '.chc-name{font-family:Cinzel,serif;color:var(--gold);font-size:.7rem;margin-top:3px}' +
      '.chc-role{font-size:.58rem;opacity:.7;line-height:1.2}' +
      '</style>' +
      '<details class="panel" id="crimsonHorizonCrewPanel" style="margin-top:12px;"' + (game.chcOpen ? ' open' : '') + ' ontoggle="game.chcOpen = this.open"><summary class="panel-title" style="cursor:pointer;">🌅 Crimson Horizon Crew</summary>' +
      '<p style="font-size:.76rem;opacity:.75;margin:6px 0;">' + (game.foundCompanions && game.foundCompanions.jade ? 'The sequel\'s two-sided crew. Jade\'s side is aboard: field them from the roster above. Soel and the twins are boosters in the story.' : 'The sequel\'s two-sided crew. Jade\'s side joins when the sequel\'s Prologue is read.') + '</p>';
    SIDES.forEach(function(side){
      h += '<div style="font-size:.8rem;color:var(--sand);margin-top:6px;">' + esc(side.title) + '</div><div class="chc-grid">' + side.members.map(chip).join('') + '</div>';
    });
    return h + '</details>';
  }

  const oldRenderPartyScreenForCHCrew = window.renderPartyScreen;
  window.renderPartyScreen = function(){
    if (oldRenderPartyScreenForCHCrew) oldRenderPartyScreenForCHCrew.apply(this, arguments);
    const c = document.getElementById('partyDetail');
    if (!c || !game.arc42Complete) return;
    const old = document.getElementById('crimsonHorizonCrewPanel');
    if (old) { const st = document.getElementById('chcStyle'); if (st) st.remove(); old.remove(); }
    c.insertAdjacentHTML('beforeend', panelHtml());
  };
})();
