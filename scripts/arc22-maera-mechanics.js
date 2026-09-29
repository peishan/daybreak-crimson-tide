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
  //
  // 3. LATER ADDITION (San's request): the status ladder now also covers
  //    Ch.20 and Ch.23, which previously had no stage of their own, and
  //    is exposed on window.PREGNANCY_STATUS_STAGES so a future arc can
  //    push its own next stage onto it directly rather than this file
  //    ever needing another edit — see that section's own comment for
  //    the exact shape a pushed entry needs. Also adds "Maera's
  //    Supplement," a recurring Ch.14+ check-in (same daily-claim shape
  //    as the Warden's Hall) granting a small XP trickle — explicitly
  //    NOT tied to the status ladder in either direction, per San's own
  //    direction that this stays flavor-plus-bonus, never a progress
  //    mechanic, and the pregnancy itself stays exactly as countdown-free
  //    as it already was.
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
  // comicProgress22 chapter-read check; nothing here is a counter, and
  // per San's own direction this stays that way permanently — more
  // granularity, never a percentage or a day count.
  //
  // Exposed on window (not a local const) specifically so a LATER arc —
  // 25, 30, 35, whichever one eventually gives this thread its next real
  // beat — can extend this exact array from its own file the same way
  // Arc XXI's COUNCIL_DECISIONS or the Hang Out companions' BOND_TRACKS
  // already get extended externally: push a new {minChapter, icon, label,
  // text} entry (using that arc's OWN comicProgress key as the gate,
  // e.g. `!!(game.comicProgress25 && game.comicProgress25[14])`, not
  // minChapter against comicProgress22) and currentPregnancyStatus()
  // below picks it up automatically — no edits needed here ever again.
  // Ch.20 and Ch.23 are added now because they're already-shipped
  // chapters that previously fell through with no stage of their own
  // (the ladder jumped straight from Ch.19 to Ch.24); Ch.23 ("Growing")
  // is deliberately still just a label change, never a counter, matching
  // the doc's own explicit intent for that chapter.
  const PREGNANCY_STATUS_STAGES = [
    { minChapter: 24, icon: '🌅', label: 'Waiting Together', text: 'Two children, healthy, growing at their own pace. San and Joel are simply waiting to meet them.' },
    { minChapter: 23, icon: '🌊', label: 'Steady', text: "Time is passing, unremarkably and on purpose. Maera's visits stay the same good news, over and over." },
    { minChapter: 20, icon: '📣', label: 'Fair Tide Knows Now', text: "The whole settlement knows now, and has folded it in the way Fair Tide folds in everything — warmly, and without much fuss." },
    { minChapter: 19, icon: '⏳', label: "Their Own Pace", text: "The children are taking their own time. Maera says they won't hurry — it may be years, not months." },
    { minChapter: 16, icon: '👦👧', label: 'A Son and a Daughter', text: 'A son and a daughter — two little lives, already distinctly themselves, growing steadily.' },
    { minChapter: 12, icon: '👶👶', label: 'Two', text: 'There are two. San and Joel are still taking that in.' },
    { minChapter: 11, icon: '🤰', label: 'Confirmed', text: "Confirmed: San is carrying a child." },
    { minChapter: 10, icon: '🩺', label: 'Under Examination', text: "Maera's examination found something unusual. She's asked her senior midwife to check as well." },
    { minChapter: 9,  icon: '💬', label: 'Something Feels Different', text: "San's told Joel something feels different. They've gone looking for a Veyren healer who'd actually know." }
  ];
  window.PREGNANCY_STATUS_STAGES = PREGNANCY_STATUS_STAGES;

  function currentPregnancyStatus(){
    const progress = game.comicProgress22 || {};
    const stages = window.PREGNANCY_STATUS_STAGES;
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      // A future arc's own pushed entry carries its own gate check instead
      // of a minChapter, since its comicProgress key won't be comicProgress22.
      const satisfied = typeof stage.gate === 'function' ? stage.gate() : !!progress[stage.minChapter];
      if (satisfied) return stage;
    }
    return null;
  }
  window.currentPregnancyStatus = currentPregnancyStatus;

  // -------------------------------------------------------------------
  // MAERA'S SUPPLEMENT — a recurring check-in, same daily-claim shape as
  // the Warden's Hall/Harbour Office/Market Quarter/Workshop, gated at
  // Ch.14 ("A Second Kind of Examination" — the chapter that explicitly
  // establishes this as "an ongoing diagnostic relationship," the exact
  // point a recurring routine actually starts making sense). A small XP
  // grant rather than gold/reputation, matching Maera's own roster bonus
  // being an xpBonus — this is care that keeps the crew steady, not a
  // trade or a security concern. Deliberately NOT tied to the status
  // ladder above in any way — claiming it (or skipping a day) never
  // changes what stage shows, on purpose, per San's own direction that
  // this stays flavor-plus-bonus and never becomes a progress mechanic.
  // -------------------------------------------------------------------
  const MAERA_SUPPLEMENT_XP = 25;

  const MAERA_SUPPLEMENT_FLAVOR = [
    "San takes her morning tonic — ginger, something Veyren she can't quite place, and a taste she's stopped minding.",
    "Maera's weekly check-in: vitals steady, both signatures strong, nothing to report and every reason to be glad of it.",
    "A short visit today, mostly Maera confirming what San already suspected — everything's exactly where it should be.",
    "San remembers the tonic before Joel has to remind her, for once.",
    "Maera adjusts the mixture slightly for the season. San doesn't ask what's in it anymore.",
    "Nothing eventful — just the quiet, unglamorous work of staying well."
  ];

  function maeraSupplementUnlocked(){
    return !!(game.comicProgress22 && game.comicProgress22[14]);
  }
  window.maeraSupplementUnlocked = maeraSupplementUnlocked;

  function todaysMaeraSupplementFlavor(){
    const idx = (game.day || 0) % MAERA_SUPPLEMENT_FLAVOR.length;
    return MAERA_SUPPLEMENT_FLAVOR[idx];
  }
  window.todaysMaeraSupplementFlavor = todaysMaeraSupplementFlavor;

  function canClaimMaeraSupplement(){
    if (!maeraSupplementUnlocked()) return false;
    game.maeraSupplement = game.maeraSupplement || { lastClaimDay: -1 };
    return game.maeraSupplement.lastClaimDay !== game.day;
  }
  window.canClaimMaeraSupplement = canClaimMaeraSupplement;

  function claimMaeraSupplement(){
    if (!canClaimMaeraSupplement()) { toast('Already taken today.', 2800); return; }
    game.maeraSupplement = game.maeraSupplement || { lastClaimDay: -1 };
    game.maeraSupplement.lastClaimDay = game.day;
    gainXP(MAERA_SUPPLEMENT_XP);
    toast('🩹 ' + todaysMaeraSupplementFlavor() + ' (+' + MAERA_SUPPLEMENT_XP + ' XP)', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderPartyScreen === 'function') window.renderPartyScreen();
  }
  window.claimMaeraSupplement = claimMaeraSupplement;

  function maeraCarePanelHtml(){
    const stage = currentPregnancyStatus();
    if (!stage) return '';
    let html = '<div class="panel-title">🤰 Maera\'s Care</div>'+
      '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
      '<div style="font-size:1.6rem;">'+stage.icon+'</div><div style="flex:1;">'+
      '<strong>'+esc(stage.label)+'</strong><br>'+
      '<span style="font-size:.82rem;opacity:.85;">'+esc(stage.text)+'</span>'+
      '</div></div></article>';
    if (maeraSupplementUnlocked()) {
      const claimable = canClaimMaeraSupplement();
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.4rem;">🩹</div><div style="flex:1;">'+
        '<strong>Maera\'s Supplement</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(todaysMaeraSupplementFlavor())+'</span>'+
        '</div>'+
        '<button class="btn btn-small" onclick="claimMaeraSupplement()" '+(claimable ? '' : 'disabled')+'>'+
        (claimable ? '🩹 Take (+' + MAERA_SUPPLEMENT_XP + ' XP)' : '✓ Taken Today')+
        '</button></div></article>';
    }
    return html;
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
