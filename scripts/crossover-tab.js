(function(){
  // -------------------------------------------------------------------
  // CROSSOVER TAB — a new top-level screen (#crossoverScreen), added to
  // the main nav bar right after Crew per San's own direction. Gated on
  // game.arc42Complete, same as the San/Joel x Jade/Devon duel sheet
  // already added to character-bios.js — the nav button itself always
  // shows (same "never hide a button, show a locked state instead"
  // convention every other gated screen/section in this game already
  // uses — see arc41-bridge.js/arc41-interlude.js's own locked sections).
  //
  // Three pieces, per San's own confirmed scope:
  //   1. TRIBUTE_CROSSOVER_CAST — a roster of the sixteen named Lunareth/
  //      Tribute-side guests Arc XLII actually introduces, same shape as
  //      FAIR_TIDE_ALLY_NETWORK (scripts/fair-tide-ally-network.js):
  //      id/name/icon/connection/desc/eligible. Every one of them is
  //      explicitly a temporary story ally per arc42.js's own header
  //      comments (never recruited, no ALL_PARTY entries, no Fountain
  //      activation) -- this is a read-only reference roster, not a
  //      fielding system. `eligible` reads the exact comicProgress42[N]
  //      flag each pair is actually introduced on, so a save mid-arc only
  //      shows who's actually appeared on-page so far (in practice this
  //      only matters if the whole screen's own gate is ever loosened
  //      later -- today, reaching this screen at all requires
  //      arc42Complete, so all sixteen are already past their own gate).
  //      No portraits exist for any of them yet, so this uses emoji icons,
  //      same as the Ally Network's own entries.
  //   2. The Black Pearl investigation log -- reuses
  //      window.renderBlackPearlPanel() (arc42-mechanics.js) directly
  //      rather than re-deriving the same state, so this screen and the
  //      Archive screen's own existing panel never drift out of sync.
  //   3. The San/Joel x Jade/Devon crossover duel sheet -- the same
  //      image already registered in character-bios.js's bios panel,
  //      surfaced here too as a dedicated highlight rather than only
  //      inside the generic Character Bios list.
  //   4. The Vaeren/Joelle/Soel "Tribute x Crimson Tide" crossover sheet
  //      -- a separate reference image from the existing toddler-stage
  //      bio (assets/bios/vaeren-joelle.png, still gated at arc36Complete
  //      in character-bios.js and untouched by this file) -- San's own
  //      direction was to add this one here instead, not replace that.
  //
  // Pronouns: only characters whose pronoun is explicitly confirmed by a
  // direct word (he/she/him/her/husband/wife) in Arc XLII's own text or
  // San's own reference sheets use he/she below (Jade, Devon, Sally,
  // Levi, Hugh, Sera, Adrian, Eve, Rheon, Mirelle, Fen -- Fen confirmed
  // via San's crossover research-team sheet: "Aster's wife"). Sky,
  // Jenika, Roc, Delilah and Aster are never given a pronoun anywhere in
  // the arc's text or the sheets seen so far (Aster is named only as
  // Fen's spouse, never directly), so their entries still avoid
  // guessing one -- flagged to San for confirmation rather than assumed.
  //
  // Titles below (Mirelle/Rheon = Queen/King of Altan, Fen = Queen of
  // Dragonvale, Adrian = Prince-Consort/Royal Scholar of Tribute, Jenika
  // = Imperial Healer/Royal Cousin) come directly from San's own
  // crossover reference sheets, not invented.
  // -------------------------------------------------------------------

  const TRIBUTE_CROSSOVER_CAST = [
    {id:'jade', name:'Jade', icon:'👑',
      connection:"Lunareth — Princess / Imperial Guard. The reason this whole crossover exists.",
      desc:"An early, unfinished character from a manuscript San shelved years ago. Nothing about the woman standing in front of her now matches what San actually wrote.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[2]); }},
    {id:'devon', name:'Devon', icon:'🛡️',
      connection:"Lunareth — Royal Knight. Jade's partner.",
      desc:"Reads an opening half a second before anyone else does. Finds an easy rapport with Joel almost immediately — two men who've each spent years quietly watching over someone who doesn't need the watching.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[2]); }},
    {id:'sally', name:'Sally', icon:'😊',
      connection:"Lunareth — travels with Jade's party.",
      desc:"Friendly before anyone's finished introductions. Already friends with half of Fair Tide by the end of the first hour, the other half clearly next on her list.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[16]); }},
    {id:'levi', name:'Levi', icon:'🏹',
      connection:"Lunareth — travels with Jade's party.",
      desc:"Quiet, exact, reads ground and distance half a beat before anyone else. Already comparing notes with Senedra, Iris and KW Liang.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[16]); }},
    {id:'hugh', name:'Hugh', icon:'🤍',
      connection:"Lunareth.",
      desc:"Spent years convinced that saying the one thing that actually mattered would only make Sera's life harder. Fair Tide finally gave him room to say it anyway.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[23]); }},
    {id:'sera', name:'Sera', icon:'🌊',
      connection:"Lunareth — Rheon's younger sister.",
      desc:"Lighter here than she ever lets herself be back home. No longer uncertain about Hugh, even if the two of them aren't telling anyone yet.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[23]); }},
    {id:'adrian', name:'Adrian', icon:'🔧',
      connection:"Lunareth — Jade's older brother. Prince-Consort of Tribute, Royal Scholar and future Imperial Advisor.",
      desc:"Measuring at first, visibly won over by the end of it. A brilliant scholar and statesman — has a genuine head for exactly how the Horizon Engine actually works, much to Renn's delight.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[31]); }},
    {id:'eve', name:'Eve', icon:'💭',
      connection:"Lunareth — Adrian's partner.",
      desc:"Quiet about it, but sharp enough to make Erynn stop and actually think before answering.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[31]); }},
    {id:'sky', name:'Sky', icon:'🩺',
      connection:"Lunareth — Jade's cousin.",
      desc:"A healer's curiosity, and a young son with Jenika neither of them has bothered formalizing. Genuinely interested in how Veyren's medicine differs from Lunareth's own.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[33]); }},
    {id:'jenika', name:'Jenika', icon:'📋',
      connection:"Lunareth — Imperial Healer, Royal Cousin (Devon's cousin). Sky's unmarried partner.",
      desc:"Advanced healing, recovery and maternal care — connects Tribute's own medical resources to Fair Tide's. Compares notes with the infirmary team like someone who's done this kind of exchange before.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[33]); }},
    {id:'rheon', name:'Rheon', icon:'🧐',
      connection:"Lunareth — Sera's older brother. King of Altan.",
      desc:"Suspicious that his sister came back from Fair Tide unusually happy. Hasn't worked out why yet.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[36]); }},
    {id:'mirelle', name:'Mirelle', icon:'🌷',
      connection:"Lunareth — Rheon's wife, Queen of Altan.",
      desc:"A long-standing friend Devon has looked up to since he was young — former Head of House Veyne and a key figure in Tribute's political and intelligence circles. Delighted by every small story about the families Fair Tide's residents have built here.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[36]); }},
    {id:'roc', name:'Roc', icon:'🐉',
      connection:"Dragonvale.",
      desc:"Warm welcome, a household full of it — including twins (Liora among them) who toddle past strangers entirely unbothered.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[38]); }},
    {id:'delilah', name:'Delilah', icon:'🏡',
      connection:"Dragonvale.",
      desc:"Builds a life out of love rather than obligation — the kind San is openly delighted to see in another family.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[38]); }},
    {id:'aster', name:'Aster', icon:'🗺️',
      connection:"Dragonvale — Fen's spouse. Jade and Devon's sibling.",
      desc:"Steady in conversation, contributes without needing to lead it, and still finds time to actually look around wherever the visit lands.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[38]); }},
    {id:'fen', name:'Fen', icon:'⚙️',
      connection:"Dragonvale — Queen of Dragonvale. Aster's wife; Jade and Devon's sister-in-law.",
      desc:"A learned queen with a sharp, compassionate mind. Lights up at the Horizon Engine — already imagining what a real exchange of knowledge between worlds could look like.",
      eligible: function(){ return !!(game.comicProgress42 && game.comicProgress42[38]); }}
  ];
  window.TRIBUTE_CROSSOVER_CAST = TRIBUTE_CROSSOVER_CAST;

  // Portraits drawn so far (everyone else keeps the emoji icon).
  const CROSSOVER_PORTRAITS = { fen:'assets/portraits/fen.png', adrian:'assets/portraits/adrian.png' };

  function renderTributeRosterPanel(){
    const visible = TRIBUTE_CROSSOVER_CAST.filter(function(c){ return !c.eligible || c.eligible(); });
    if (!visible.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🌉 Lunareth — The Tribute Cast</div>'+
      '<p style="font-size:.8rem;opacity:.75;margin-bottom:8px;">Not recruited, not relocated — trusted friends on the other side of the Horizon.</p>';
    visible.forEach(function(c){
      const pt = CROSSOVER_PORTRAITS[c.id];
      const ptHtml = pt ? '<img src="'+pt+'" alt="" onerror="this.remove()" style="width:44px;height:44px;border-radius:50%;object-fit:cover;object-position:center 20%;float:left;margin:0 10px 4px 0;">' : '';
      html += '<article class="quest-item">'+ptHtml+'<strong>'+(pt ? '' : c.icon+' ')+esc(c.name)+'</strong> — <span style="opacity:.8;">'+esc(c.connection)+'</span><br>'+
        '<span style="font-size:.8rem;opacity:.8;">'+esc(c.desc)+'</span></article>';
    });
    return html;
  }
  window.renderTributeRosterPanel = renderTributeRosterPanel;

  window.renderCrossoverScreen = function(){
    const container = document.getElementById('crossoverContent');
    if (!container) return;
    if (!game.arc42Complete) {
      container.innerHTML = '<div class="panel"><div class="story-chapter locked"><div class="story-chapter-title">🔒 Crossover Locked</div>'+
        '<div class="story-chapter-sub">Finish Arc XLII to open this tab.</div></div></div>';
      return;
    }
    let html = '<div class="panel">'+
      '<img src="assets/bios/san-joel-jade-devon.png" alt="San &amp; Joel x Jade &amp; Devon crossover sheet" style="width:100%;border-radius:8px;margin-bottom:10px;">'+
      '<div style="font-size:.78rem;opacity:.7;text-align:center;margin-bottom:4px;">San &amp; Joel (Crimson Tide) x Jade &amp; Devon (Tribute)</div>'+
      '</div>';
    html += '<div class="panel">'+
      '<img src="assets/bios/vaeren-joelle-soel-crossover.png" alt="Tribute x Crimson Tide -- Vaeren, Joelle &amp; Soel crossover sheet" style="width:100%;border-radius:8px;margin-bottom:10px;">'+
      '<div style="font-size:.78rem;opacity:.7;text-align:center;margin-bottom:4px;">Vaeren, Joelle &amp; Soel -- Twins &amp; Guardian Companion (Tribute x Crimson Tide)</div>'+
      '</div>';
    html += '<div class="panel">'+renderTributeRosterPanel()+'</div>';
    const pearlPanel = (typeof window.renderBlackPearlPanel === 'function') ? window.renderBlackPearlPanel() : '';
    if (pearlPanel) html += '<div class="panel">'+pearlPanel+'</div>';
    container.innerHTML = html;
  };
})();
