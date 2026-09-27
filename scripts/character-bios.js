(function(){
  // -------------------------------------------------------------------
  // CHARACTER BIOS — one pre-rendered character-sheet image per group,
  // shown via the existing comic-image lightbox (openComicImage/
  // #comicImageOverlay, core-engine.js) rather than building a new
  // modal — same mechanism already used for full comic panels, so this
  // is pure reuse, nothing new to maintain.
  //
  // Art is deployed separately (San's own established workflow — see
  // this session's confirmation) — these paths are placeholders under
  // assets/bios/ for San to upload the actual files to; nothing here
  // depends on them existing yet, a missing file just shows a broken
  // image in the lightbox until uploaded.
  //
  // Gating: each bio's ids list is every character actually depicted in
  // that image. Unlocked only once ALL of them have joined
  // (memberUnlocked({id}) for every id) — deliberately generic rather
  // than hardcoding arc numbers, so it can never drift out of sync with
  // the real recruitment chapters the way "gate to Arc 6" would have
  // for Renn (Arc 5)/Mimi (Arc 4)/Erynn (Arc 7). For a combined image,
  // this naturally gates on whichever of its characters joins last —
  // Caelan (Ch.13) for the Joy/Caelan sheet, Erynn (Arc 7) for the
  // Renn/Erynn/Mimi trio sheet, confirmed against San's own correction.
  //
  // The San/Joel couple portrait is the one exception — gating it on
  // "both recruited" would unlock it on day one, Joel joins in Arc I.
  // Uses customUnlocked instead, tied to the existing San/Joel bond
  // track (SAN_JOEL_TIERS, arc9-and-systems.js) reaching its top tier
  // ("Two Hearts, One Ship") — a relationship-progression reward
  // that already exists and fits a warm, established-couple image far
  // better than a recruitment check ever would.
  // -------------------------------------------------------------------

  const CHARACTER_BIOS = [
    { key: 'san_joel_cover',    label: 'San & Joel',                image: 'assets/bios/san-joel.png',
      customUnlocked: function(){ return typeof window.bondTier === 'function' && window.bondTier('san_joel') >= 4; } },
    { key: 'san',               label: 'San',                       ids: ['san'],                         image: 'assets/bios/san.png' },
    { key: 'joel',               label: 'Joel',                      ids: ['joel'],                        image: 'assets/bios/joel.png' },
    { key: 'aisyah_mezstorm',    label: 'Aisyah & Mezstorm',         ids: ['aisyah', 'mezstorm'],          image: 'assets/bios/aisyah-mezstorm.png' },
    { key: 'eliz_senedra_zaki',  label: 'Eliz, Senedra & Zaki',      ids: ['eliz', 'senedra', 'zaki'],     image: 'assets/bios/eliz-senedra-zaki.png' },
    { key: 'trio',               label: 'Renn, Erynn & Mimi',        ids: ['renn', 'erynn', 'mimi'],       image: 'assets/bios/trio.png' },
    { key: 'aldric_wren',        label: 'Ser Aldric & Sister Wren',  ids: ['ser_aldric', 'sister_wren'],   image: 'assets/bios/aldric-wren.png' },
    { key: 'liang_iris',         label: 'KW Liang & Iris',           ids: ['kw_liang', 'iris'],            image: 'assets/bios/liang-iris.png' },
    { key: 'aa_bradashah',       label: 'Dr. AA & Brada Shah',       ids: ['dr_aa', 'brada_shah'],         image: 'assets/bios/aa-brada-shah.png' },
    { key: 'joy_caelan',         label: 'Ate Joy & Caelan',          ids: ['ate_joy', 'caelan'],           image: 'assets/bios/joy-caelan.png' }
  ];
  window.CHARACTER_BIOS = CHARACTER_BIOS;

  function bioUnlocked(bio){
    if (typeof bio.customUnlocked === 'function') return bio.customUnlocked();
    return bio.ids.every(function(id){
      return typeof memberUnlocked === 'function' && memberUnlocked({ id: id });
    });
  }
  window.characterBioUnlocked = bioUnlocked;

  function renderCharacterBiosPanel(){
    const unlocked = CHARACTER_BIOS.filter(bioUnlocked);
    if (!unlocked.length) return '';
    let html = '<div class="panel-title">📇 Character Bios</div>';
    unlocked.forEach(function(bio){
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="flex:1;"><strong>'+esc(bio.label)+'</strong></div>'+
        '<button class="btn btn-small" onclick="openComicImage(\''+bio.image+'\')">📇 View Bio</button>'+
        '</div></article>';
    });
    return html;
  }
  window.renderCharacterBiosPanel = renderCharacterBiosPanel;

  const oldRenderPartyScreenForBios = window.renderPartyScreen;
  window.renderPartyScreen = function(){
    if (oldRenderPartyScreenForBios) oldRenderPartyScreenForBios();
    const container = document.getElementById('partyDetail');
    if (!container) return;
    const existing = document.getElementById('characterBiosPanelWrap');
    if (existing) existing.remove();
    const panel = renderCharacterBiosPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="characterBiosPanelWrap" class="panel">'+panel+'</div>');
  };
})();
