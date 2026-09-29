(function(){
  // -------------------------------------------------------------------
  // ARC XXII MECHANICS — Maera's roster slot + the pregnancy status
  // panel. Deliberately kept OUT of arc22.js itself, which — like every
  // arc file since XVII — only wires the story chapters; this is the
  // "mechanics" layer San asked to design separately.
  //
  // Two things, both additive, both reusing existing systems rather
  // than inventing new ones:
  //
  // 1. MAERA — ROSTER ADDITION. She's introduced as "Veyren Healer &
  //    Midwife," a recurring Fair Tide fixture San and Joel go BACK to
  //    (Ch.14: "an ongoing diagnostic relationship"), not someone who'd
  //    sail out on voyages — so she joins game.fairTideRoster the same
  //    way every other named civilian resident does (Jovie, Imah, Nurul,
  //    Dre, the Ch.6 specialists), not window.ALL_PARTY as a combat
  //    companion. Added on Ch.10 specifically — the chapter where she
  //    actually performs the examination in person, not Ch.9 (where
  //    San and Joel merely go looking for her). Given a named, individual
  //    FT_ROSTER_BONUSES entry rather than the generic "specialist"
  //    civilian role bucket, matching Jovie's own "Medical Support"
  //    precedent exactly (window.FT_ROSTER_BONUSES is the same object
  //    reference fairtide-buildings-and-arc6.js's own getRosterBonus()
  //    already reads fresh on every call, so this needs no changes to
  //    that file at all — same technique already used for the Hang Out
  //    companions' BOND_TRACKS additions).
  //
  // 2. PREGNANCY STATUS — "🤰 Maera's Care" panel on the Crew/Party
  //    screen (San's call: this is personal to San, not Fair Tide civic
  //    infrastructure — lives next to the existing Character Bios panel
  //    on the same screen, same "unlockable personal content" precedent,
  //    same idempotent remove-and-reappend wrap pattern). Purely a
  //    status ladder read straight off the existing comicProgress22
  //    flags already set by markArc22ChapterRead() — no new numeric
  //    state, no countdown of any kind. The doc is explicit that Ch.23
  //    ("Growing") exists specifically so this fades into the
  //    background with no "Day 180" mechanic ever attached to it, and
  //    this panel is built to match that on purpose: it only ever shows
  //    a short status line, never a bar, a day count, or a percentage.
  //    Hidden entirely until Ch.9 (the first time either of them says
  //    anything about it out loud) so nothing here spoils Ch.1-8's own
  //    slow-burn mystery for a player still working through it.
  // -------------------------------------------------------------------

  const oldMarkArc22ChapterReadForMaera = window.markArc22ChapterRead;
  window.markArc22ChapterRead = function(id){
    const alreadyRead = !!(game.comicProgress22 && game.comicProgress22[id]);
    if (oldMarkArc22ChapterReadForMaera) oldMarkArc22ChapterReadForMaera(id);
    if (id === 10 && !alreadyRead && game.comicProgress22 && game.comicProgress22[10]) {
      game.fairTideRoster = game.fairTideRoster || {};
      if (!game.fairTideRoster.maera) {
        game.fairTideRoster.maera = {
          name: 'Maera Veyr', role: 'Veyren Healer & Midwife', icon: '🩹',
          desc: "Decades of Veyren patients behind her, decades of childbirth attended. San's primary pregnancy specialist from here on."
        };
        toast('🩹 Maera Veyr has joined Fair Tide\'s roster.', 3600);
      }
    }
  };

  window.FT_ROSTER_BONUSES = window.FT_ROSTER_BONUSES || {};
  window.FT_ROSTER_BONUSES.maera = {xpBonus: 0.02}; // Medical Care — same shape as Jovie's own Medical Support bonus

  // Status ladder — each entry's condition is checked highest-first, so
  // the first one whose gate is satisfied wins. Every gate is just a
  // comicProgress22 chapter-read check; nothing here is a counter.
  const PREGNANCY_STATUS_STAGES = [
    { minChapter: 24, icon: '🌅', label: 'Waiting Together', text: 'Two children, healthy, growing at their own pace. San and Joel are simply waiting to meet them.' },
    { minChapter: 19, icon: '⏳', label: "Their Own Pace", text: "The children are taking their own time. Maera says they won't hurry — it may be years, not months." },
    { minChapter: 16, icon: '👦👧', label: 'A Son and a Daughter', text: 'A son and a daughter — two little lives, already distinctly themselves, growing steadily.' },
    { minChapter: 12, icon: '👶👶', label: 'Two', text: 'There are two. San and Joel are still taking that in.' },
    { minChapter: 11, icon: '🤰', label: 'Confirmed', text: "Confirmed: San is carrying a child." },
    { minChapter: 10, icon: '🩺', label: 'Under Examination', text: "Maera's examination found something unusual. She's asked her senior midwife to check as well." },
    { minChapter: 9,  icon: '💬', label: 'Something Feels Different', text: "San's told Joel something feels different. They've gone looking for a Veyren healer who'd actually know." }
  ];

  function currentPregnancyStatus(){
    const progress = game.comicProgress22 || {};
    for (let i = 0; i < PREGNANCY_STATUS_STAGES.length; i++) {
      if (progress[PREGNANCY_STATUS_STAGES[i].minChapter]) return PREGNANCY_STATUS_STAGES[i];
    }
    return null;
  }
  window.currentPregnancyStatus = currentPregnancyStatus;

  function maeraCarePanelHtml(){
    const stage = currentPregnancyStatus();
    if (!stage) return '';
    return '<div class="panel-title">🤰 Maera\'s Care</div>'+
      '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.6rem;">'+stage.icon+'</div><div style="flex:1;">'+
      '<strong>'+esc(stage.label)+'</strong><br>'+
      '<span style="font-size:.82rem;opacity:.85;">'+esc(stage.text)+'</span>'+
      '</div></div></article>';
  }
  window.maeraCarePanelHtml = maeraCarePanelHtml;

  const oldRenderPartyScreenForMaeraCare = window.renderPartyScreen;
  window.renderPartyScreen = function(){
    if (oldRenderPartyScreenForMaeraCare) oldRenderPartyScreenForMaeraCare();
    const container = document.getElementById('partyDetail');
    if (!container) return;
    const existing = document.getElementById('maeraCarePanelWrap');
    if (existing) existing.remove();
    const panel = maeraCarePanelHtml();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="maeraCarePanelWrap" class="panel">'+panel+'</div>');
  };
})();
