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
  // The briefing is ready once Erynn's and Fen's reports are in, Ch.080 is
  // read, and the player is at Fair Tide.
  //
  // SECOND ROUND (after the briefing): Renn (baseline instrument readings)
  // and Mimi (a quiet listening) begin technical observation and
  // divination. Their findings are deliberately non-committal -- a
  // baseline and a record of impressions, never a conclusion about what
  // the Pearl is.
  // -------------------------------------------------------------------

  // The first briefing is Crimson Horizon Ch.081 ("What Devon Entrusted",
  // id 82), a SIDE chapter (see CH_SIDE in crimson-horizon-sequel.js): it
  // opens from the Black Pearl Study panel, never blocks the story chain,
  // and awards its chapter XP through the normal chapter flow.
  const BRIEFING_1_CH_ID = 82;
  const BRIEFING_1_AFTER_CH_ID = 81;   // Ch.080 "A Place at the Table", back at Fair Tide

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

  // ---- Second round: opens once the first briefing is held ----
  if (R.renn && !R.renn.projects.some(function(p){ return p.key === 'pearl_baseline_readings'; })) {
    R.renn.projects.push({
      key: 'pearl_baseline_readings', durationDays: 4, available: function(){ return pearlOpen() && briefingHeld(); },
      title: 'Baseline Instrument Readings',
      desc: "Renn sets up Fair Tide's instruments around the Pearl's case and records a baseline, following Adrian's protocol. Observation only: nothing touches the Pearl.",
      finding: "Renn records a full baseline under Adrian's protocol: what each instrument reads with the Pearl in its case, and how far those readings drift on their own. It is a reference, not a result. Any later test can be measured against it.",
      onComplete: function(){
        pearlNote('pearl_baseline_readings', "Renn recorded a baseline of Fair Tide's instrument readings with the Pearl in its case. It is a reference point for any later test, not a finding.");
      }
    });
  }
  if (R.mimi && !R.mimi.projects.some(function(p){ return p.key === 'pearl_quiet_listening'; })) {
    R.mimi.projects.push({
      key: 'pearl_quiet_listening', durationDays: 3, available: function(){ return pearlOpen() && briefingHeld(); },
      title: 'A Quiet Listening',
      desc: "Mimi sits with the Pearl and writes down exactly what she perceives, and how sure she is of each impression, without trying to interpret any of it.",
      finding: "Mimi writes down every impression and how sure she is of each one. She marks which she trusts, which she doesn't, and which could just be her own nerves. She won't call any of it a finding yet.",
      onComplete: function(){
        pearlNote('pearl_quiet_listening', "Mimi recorded her first impressions of the Pearl and how sure she is of each. None is being treated as a finding yet.");
      }
    });
  }

  // ---- The briefing ----
  const REPORTS = [
    { rid: 'erynn',  key: 'pearl_devons_account',     short: 'Erynn', required: true },
    { rid: 'fen',    key: 'pearl_dragonvale_records', short: 'Fen',   required: true },
    { rid: 'adrian', key: 'pearl_safe_protocol',      short: 'Adrian', required: false },
    { rid: 'renn',   key: 'pearl_baseline_readings',  short: 'Renn',  required: false, round2: true },
    { rid: 'mimi',   key: 'pearl_quiet_listening',    short: 'Mimi',  required: false, round2: true }
  ];
  function reportDone(r){
    const st = window.archiveResearchState();
    return !!(st[r.rid] && st[r.rid].completedKeys.indexOf(r.key) !== -1);
  }
  function chProgress(id){ return !!(game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[id]); }
  function briefingHeld(){
    // A save that held the briefing before it became Ch.081 keeps its
    // progress: mark the chapter read (its XP was already granted then).
    if (game.blackPearlBriefings && game.blackPearlBriefings[1] && !chProgress(BRIEFING_1_CH_ID)) {
      game.comicProgressCrimsonHorizon = game.comicProgressCrimsonHorizon || {};
      game.comicProgressCrimsonHorizon[BRIEFING_1_CH_ID] = true;
    }
    return chProgress(BRIEFING_1_CH_ID) || !!(game.blackPearlBriefings && game.blackPearlBriefings[1]);
  }
  function briefingStatus(){
    if (briefingHeld()) return 'held';
    if (!REPORTS.filter(function(r){ return r.required; }).every(reportDone)) return 'waiting_reports';
    if (!chProgress(BRIEFING_1_AFTER_CH_ID)) return 'waiting_story';
    if (game.location !== 'fair_tide') return 'waiting_location';
    return 'ready';
  }
  window.blackPearlBriefingStatus = briefingStatus;
  window.blackPearlBriefingReady = function(){ return briefingStatus() === 'ready'; };
  window.blackPearlBriefingReason = function(){
    switch (briefingStatus()) {
      case 'waiting_reports': return 'Needs the reports from Erynn and Fen first.';
      case 'waiting_story': return 'Opens after Chapter 080, back at Fair Tide.';
      case 'waiting_location': return 'Return to Fair Tide to attend the briefing.';
      case 'held': return 'The first briefing has been held.';
      default: return 'The briefing is ready.';
    }
  };

  // ---- First observations (Crimson Horizon Ch.089, id 90, a SIDE chapter) ----
  // Optional Fair Tide scene: opens once the 081 briefing is held and both
  // Renn's and Mimi's observation assignments are complete, whenever the
  // player is at Fair Tide. It never blocks the story chain.
  const OBS_CH_ID = 90;
  function roundTwoDone(){ return reportDone(REPORTS[3]) && reportDone(REPORTS[4]); }
  function observationsStatus(){
    if (chProgress(OBS_CH_ID)) return 'read';
    if (!briefingHeld()) return 'waiting_briefing';
    if (!roundTwoDone()) return 'waiting_reports';
    if (game.location !== 'fair_tide') return 'waiting_location';
    return 'ready';
  }
  window.blackPearlObservationsStatus = observationsStatus;
  window.blackPearlObservationsReady = function(){ return observationsStatus() === 'ready'; };
  window.blackPearlObservationsReason = function(){
    switch (observationsStatus()) {
      case 'waiting_briefing': return 'Opens after the first Black Pearl briefing.';
      case 'waiting_reports': return "Waiting on Renn's and Mimi's observation assignments.";
      case 'waiting_location': return 'Return to Fair Tide to read the observations.';
      case 'read': return 'The first observations are filed.';
      default: return 'The observations are ready.';
    }
  };
  window.onPearlObservationsRead = function(){
    pearlNote('observations_1', "First observations: Renn's record of conditions and Mimi's account of her impressions were compared only after both were finished, and filed together. A copy went to Devon. Neither account says what the Pearl is.");
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };
  window.__ctReadPearlObservations = function(){
    if (typeof window.__ctReadCrimsonHorizonChapter === 'function') window.__ctReadCrimsonHorizonChapter(OBS_CH_ID);
  };

  // ---- First report (Crimson Horizon Ch.098, id 99, a SIDE chapter) ----
  // Devon reads Renn and Mimi's first observation report and annotates it.
  // Opens once Ch.097 is read and the Ch.089 observations are filed, whenever
  // the player is at Fair Tide, so Ch.099-100 never wait on it.
  const REPORT_CH_ID = 99;
  const REPORT_AFTER_CH_ID = 98;   // Ch.097 "The Return Cargo"
  function reportStatus(){
    if (chProgress(REPORT_CH_ID)) return 'read';
    if (!chProgress(OBS_CH_ID)) return 'waiting_observations';
    if (!chProgress(REPORT_AFTER_CH_ID)) return 'waiting_story';
    if (game.location !== 'fair_tide') return 'waiting_location';
    return 'ready';
  }
  window.blackPearlReportStatus = reportStatus;
  window.blackPearlReportReady = function(){ return reportStatus() === 'ready'; };
  window.blackPearlReportReason = function(){
    switch (reportStatus()) {
      case 'waiting_observations': return 'Opens after the first observations are filed.';
      case 'waiting_story': return 'Opens after Chapter 097, back at Fair Tide.';
      case 'waiting_location': return 'Return to Fair Tide to review the report.';
      case 'read': return "Devon's notes are filed with the first report.";
      default: return 'The report is ready.';
    }
  };
  window.onPearlReportRead = function(){
    pearlNote('report_1', "First report: Devon read Renn's and Mimi's first observation report and marked where his own account rests on memory. He is annotating it for the archive, and his notes are kept with the study. The Pearl stays in San and Joel's custody.");
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };
  window.__ctReadPearlReport = function(){
    if (typeof window.__ctReadCrimsonHorizonChapter === 'function') window.__ctReadCrimsonHorizonChapter(REPORT_CH_ID);
  };

  // Called by the chapter flow when Ch.081 is completed.
  window.onPearlBriefingHeld = function(){
    game.blackPearlBriefings = game.blackPearlBriefings || {};
    game.blackPearlBriefings[1] = true;
    pearlNote('briefing_1', "First briefing: San and Joel agreed the study begins with observation. Adrian's protocol is the starting point for Renn and Mimi, and every finding is copied for Devon.");
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  // HTML for the top of the Black Pearl Study panel (Research Team tab).
  window.blackPearlStudyHtml = function(){
    if (!pearlOpen()) return '';
    const status = briefingStatus();
    const reports = REPORTS.filter(function(r){ return !r.round2 || status === 'held'; }).map(function(r){
      return (reportDone(r) ? '✓ ' : '○ ') + r.short + (r.required ? '' : ' (optional)');
    }).join(' · ');
    let line;
    if (status === 'held') line = '✓ First briefing held. Renn and Mimi can start the next round.';
    else if (status === 'ready') line = '<button class="btn btn-small btn-magic" onclick="__ctAttendPearlBriefing()">📋 Attend Briefing</button> <span>The first team briefing is ready.</span>';
    else if (status === 'waiting_story') line = 'Required reports are in. The briefing opens after Chapter 080, back at Fair Tide.';
    else if (status === 'waiting_location') line = 'Required reports are in. Return to Fair Tide to attend the briefing.';
    else line = 'The first briefing needs reports from Erynn and Fen.';
    let obsLine = '';
    if (status === 'held') {
      const os = observationsStatus();
      if (os === 'read') obsLine = '✓ First observations filed.';
      else if (os === 'ready') obsLine = '<button class="btn btn-small btn-magic" onclick="__ctReadPearlObservations()">📖 Read the Observations</button> <span>Renn\'s and Mimi\'s accounts are ready to compare.</span>';
      else if (os === 'waiting_location') obsLine = 'Observations are ready. Return to Fair Tide to read them.';
      else obsLine = 'The first observations are waiting on Renn\'s and Mimi\'s assignments.';
      if (os === 'read') {
        const rs = reportStatus();
        if (rs === 'read') obsLine += '<br>✓ Devon\'s notes are filed with the first report.';
        else if (rs === 'ready') obsLine += '<br><button class="btn btn-small btn-magic" onclick="__ctReadPearlReport()">📖 Review the Pearl Report</button> <span>Devon has read the first report.</span>';
        else if (rs === 'waiting_location') obsLine += '<br>The report is ready for Devon. Return to Fair Tide to review it.';
        else obsLine += '<br>Devon\'s review of the first report opens after Chapter 097.';
      }
    }
    return '<div class="rt-status" style="margin-top:4px;">Reports: ' + reports + '</div>' +
      '<div class="rt-status" style="margin-top:4px;">' + line + '</div>' +
      (obsLine ? '<div class="rt-status" style="margin-top:4px;">' + obsLine + '</div>' : '');
  };

  // Attend Briefing plays Ch.081 through the normal chapter flow: scene
  // modal, objective modal, Continue.
  window.__ctAttendPearlBriefing = function(){
    if (typeof window.__ctReadCrimsonHorizonChapter === 'function') window.__ctReadCrimsonHorizonChapter(BRIEFING_1_CH_ID);
  };
})();
