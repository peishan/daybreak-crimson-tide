(function(){
  // -------------------------------------------------------------------
  // BLACK PEARL RESEARCH -- the Pearl as a shared research project at
  // Fair Tide, per San's design.
  //
  //   1. Each researcher gets a Pearl assignment in their EXISTING project
  //      dropdown (arc17-research.js). It uses that researcher's normal
  //      project slot, research-day rules and daily Check In.
  //   2. Fair Tide does the work while the Crimson Tide keeps sailing.
  //   3. A completed assignment shows its finding and adds a short entry
  //      to the Black Pearl log (Black Pearl Study -> Earlier Notes).
  //   4. Once the required reports are in AND the story reaches the next
  //      Pearl chapter, the Black Pearl Study panel offers Attend
  //      Briefing, played as a normal chapter: scene modal -> objective
  //      modal -> Continue.
  //
  // FIRST ROUND -- THE CUSTODY RECORD
  //   Erynn   Devon's Account          3 days   (required for the briefing)
  //   Fen     The Dragonvale Records   3 days   (required for the briefing)
  //   Adrian  A Safe Study Protocol    4 days   (collected alongside; informs
  //                                              the next round, when Renn and
  //                                              Mimi begin technical
  //                                              observation and divination)
  //
  // Nothing about the Pearl's nature is decided here: the findings only
  // record what is known, what is verifiable, and what is safe to try.
  // The Pearl's larger answers are left for later Fair Tide visits.
  //
  // PROVISIONAL: the story gate for the first briefing is Crimson Horizon
  // Ch.074 ("A Route Worth Keeping", id 75), the end of the current island
  // voyage. Change BRIEFING_1_AFTER_CH_ID to move it.
  // -------------------------------------------------------------------

  const BRIEFING_1_AFTER_CH_ID = 75;
  const BRIEFING_1_AFTER_LABEL = 'A Route Worth Keeping';
  const BRIEFING_1_XP = 540;

  function bpState(){ return (typeof window.blackPearlInvestigationState === 'function') ? window.blackPearlInvestigationState() : null; }
  function pearlOpen(){
    const bp = bpState();
    return !!game.arc42Complete && !!(bp && bp.started);
  }
  function pearlNote(id, text){
    const bp = bpState();
    if (!bp) return;
    if (!bp.log.some(function(e){ return e.id === id; })) bp.log.push({ id: id, text: text });
  }

  const R = window.ARCHIVE_RESEARCHERS;
  if (!R) return;

  // ---- Erynn: a Pearl project alongside his existing Archive ones ----
  if (R.erynn && !R.erynn.projects.some(function(p){ return p.key === 'pearl_devons_account'; })) {
    R.erynn.projects.push({
      key: 'pearl_devons_account', durationDays: 3, available: pearlOpen,
      title: "Devon's Account",
      desc: "Erynn sits down with Devon to record what he knows about the Black Pearl's custody, and marks where the written record ends.",
      finding: "Devon's account is careful and complete as far as it goes. Erynn writes it down in order and marks the exact line where the written record ends. After that line there is only what Devon remembers, and Devon says so himself.",
      onComplete: function(){
        pearlNote('pearl_devons_account', "Erynn recorded Devon's account of the Pearl's custody and marked the line where the written record ends. Beyond it there is only Devon's memory.");
      }
    });
  }

  // ---- Fen and Adrian join the research roster (visible once they have
  // arrived, same flags as the Crossover tab) ----
  if (!R.fen) {
    R.fen = {
      name: 'Fen', icon: '⚙️', field: 'Records & charts',
      flavor: 'Fen follows a reference until it either holds up or it doesn\'t.',
      visible: function(){ return !!(game.comicProgress42 && game.comicProgress42[38]); },
      projects: [{
        key: 'pearl_dragonvale_records', durationDays: 3, available: pearlOpen,
        title: 'The Dragonvale Records',
        desc: "Fen compares Devon's account with the surviving records and charts, and notes which references can actually be verified.",
        finding: "Fen sets Devon's account beside the surviving Dragonvale records and charts. Some references match line for line. Others can't be confirmed either way. Fen lists both, so the team knows what is verified and what is only remembered.",
        onComplete: function(){
          pearlNote('pearl_dragonvale_records', "Fen compared Devon's account with the surviving Dragonvale records and charts. Some references can be verified; others can't be confirmed either way.");
        }
      }]
    };
  }
  if (!R.adrian) {
    R.adrian = {
      name: 'Adrian', icon: '🔧', field: 'Scholar · R&D',
      flavor: 'Adrian wants a plan on paper before anything touches the Pearl.',
      visible: function(){ return !!(game.comicProgress42 && game.comicProgress42[31]); },
      projects: [{
        key: 'pearl_safe_protocol', durationDays: 4, available: pearlOpen,
        title: 'A Safe Study Protocol',
        desc: "Adrian drafts a baseline observation plan and works out what Fair Tide's equipment can measure before any Horizon Engine testing is considered.",
        finding: "Adrian drafts a baseline plan built on watching, not touching. The list of what Fair Tide's instruments can measure is short, and Adrian marks every item on it that doesn't need the Horizon Engine. No Horizon Engine testing is proposed.",
        onComplete: function(){
          pearlNote('pearl_safe_protocol', "Adrian drafted a baseline observation plan and listed what Fair Tide's equipment can measure without the Horizon Engine.");
        }
      }]
    };
  }

  // ---- The briefing ----
  const REPORTS = [
    { rid: 'erynn',  key: 'pearl_devons_account',     short: 'Erynn', required: true },
    { rid: 'fen',    key: 'pearl_dragonvale_records', short: 'Fen',   required: true },
    { rid: 'adrian', key: 'pearl_safe_protocol',      short: 'Adrian', required: false }
  ];
  function reportDone(r){
    const st = window.archiveResearchState();
    return !!(st[r.rid] && st[r.rid].completedKeys.indexOf(r.key) !== -1);
  }
  function briefingHeld(){ return !!(game.blackPearlBriefings && game.blackPearlBriefings[1]); }
  function storyGateReached(){ return !!(game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[BRIEFING_1_AFTER_CH_ID]); }
  function briefingStatus(){
    if (briefingHeld()) return 'held';
    if (!REPORTS.filter(function(r){ return r.required; }).every(reportDone)) return 'waiting_reports';
    if (!storyGateReached()) return 'waiting_story';
    return 'ready';
  }
  window.blackPearlBriefingStatus = briefingStatus;

  // HTML for the top of the Black Pearl Study panel (Research Team tab).
  window.blackPearlStudyHtml = function(){
    if (!pearlOpen()) return '';
    const reports = REPORTS.map(function(r){
      return (reportDone(r) ? '✓ ' : '○ ') + r.short + (r.required ? '' : ' (optional)');
    }).join(' · ');
    const status = briefingStatus();
    let line;
    if (status === 'held') line = '✓ First briefing held.';
    else if (status === 'ready') line = '<button class="btn btn-small btn-magic" onclick="__ctAttendPearlBriefing()">📋 Attend Briefing</button> <span>The first team briefing is ready.</span>';
    else if (status === 'waiting_story') line = 'Required reports are in. The briefing opens once the story reaches ' + esc(BRIEFING_1_AFTER_LABEL) + '.';
    else line = 'The first briefing needs reports from Erynn and Fen.';
    return '<div class="rt-status" style="margin-top:4px;">Reports: ' + reports + '</div>' +
      '<div class="rt-status" style="margin-top:4px;">' + line + '</div>';
  };

  function briefingScene(){
    let s = 'The research room at Fair Tide is quiet at this hour. The lamps are low, and two folders sit side by side on the long table: Erynn\'s record of what Devon told him, and Fen\'s cross-check against the Dragonvale records and charts.<br><br>' +
      'San reads Erynn\'s pages first. Devon\'s account is careful, and Erynn has marked the exact line where the written record ends. After it, there is only what Devon remembers, and Devon says so himself.<br><br>' +
      'Joel takes Fen\'s folder. "Some of it checks out," Joel says, turning a page. "A lot of it can\'t be checked either way. Fen has marked every reference twice: verified, and not verifiable. The second list is longer."<br><br>' +
      '"So what we actually know," San says, "is what Devon told us, and a handful of things that match."<br><br>' +
      '"And a gap," Joel says.<br><br>' +
      '"And a gap." San closes the folder. "Devon trusted us with it. That means how it gets studied is our decision now."<br><br>' +
      '"Then we start small," Joel says. "Whatever we try first, it should be something we can stop."<br><br>' +
      'They settle on it quickly. The first safe test is observation only. The Pearl stays in its case, nothing is done to it, and nothing goes near the Horizon Engine. Fair Tide watches what it does on its own, with the instruments already on hand, and writes it all down.<br><br>';
    if (reportDone(REPORTS[2])) s += 'Adrian\'s draft protocol is already on the table. It fits.<br><br>';
    s += 'Renn and Mimi can take the next look once the first readings are in.';
    return s;
  }

  function openObjective(checked){
    const title = 'The Custody Briefing';
    const objective = 'Review what Devon entrusted to you and agree on the first safe test.';
    let html = '<div style="font-size:.78rem;opacity:.75;margin-bottom:8px;">⚓ Fair Tide · Black Pearl Study</div>' +
      '<div style="margin-bottom:8px;"><strong>Purpose</strong><br>The Pearl was handed to San and Joel, so how it is studied is their decision. Decide where to begin.</div>' +
      '<div><strong>Objective</strong><br>' + esc(objective) + '</div>';
    if (checked) html += '<div style="margin-top:10px;">' + esc('The record is clear about what is known, what is verified, and where it stops. The first test is observation only: watch the Pearl, touch nothing.') + '</div>';
    const buttons = [];
    if (!checked) buttons.push({ text: '📋 Review the Custody Record', action: function(){ openObjective(true); } });
    buttons.push({ text: 'Continue', action: function(){ if (typeof closeModal === 'function') closeModal(); completeBriefing(); } });
    showModal('Objective · ' + title, html, buttons);
    if (!checked) {
      const btns = document.querySelectorAll('#modalButtons button');
      const cont = btns[btns.length - 1];
      if (cont) { cont.disabled = true; cont.style.opacity = '.45'; }
    }
  }

  function completeBriefing(){
    if (briefingStatus() !== 'ready') return;
    game.blackPearlBriefings = game.blackPearlBriefings || {};
    game.blackPearlBriefings[1] = true;
    pearlNote('briefing_1', 'First briefing: San and Joel agreed that the first safe test is observation only. The Pearl stays in its case, and Fair Tide records what it does on its own.');
    gainXP(BRIEFING_1_XP);
    toast('📋 The Custody Briefing — +' + BRIEFING_1_XP + ' Story XP', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }

  window.__ctAttendPearlBriefing = function(){
    if (briefingStatus() !== 'ready') { toast('The briefing isn\'t ready yet.'); return; }
    showModal('The Custody Briefing', briefingScene(), [{ text: 'Continue', action: function(){
      if (typeof closeModal === 'function') closeModal();
      setTimeout(function(){ openObjective(false); }, 250);
    }}]);
  };
})();
