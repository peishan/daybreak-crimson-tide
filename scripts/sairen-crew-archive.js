(function(){
  // -------------------------------------------------------------------
  // SAIREN, ONCE HE HAS JOINED THE CREW (Arc XLI Ch.16).
  //
  // Two records kept showing his old, in-between state:
  //   * the Residents list kept him "Away from Fair Tide" (Arc XXX Ch.24 sent him off alone, and its
  //     "leave" check fired again on every update because he was no longer marked departed);
  //   * the Nameless Allegiances entry still read Attitude: Unclear / Reliability: Mixed;
  //   * the Person of Interest file still read Affiliation: Unknown, Threat: Undetermined, Fair Tide Access:
  //     Visitor (Restricted), Recruitable: No.
  // The Residents card and the Allegiances entry now follow the crew membership. Saves that were already
  // past Arc XLI are repaired the next time the game updates.
  // -------------------------------------------------------------------
  function reconcile(){
    try {
      if (!(game && game.foundCompanions && game.foundCompanions.sairen)) return;
      const residents = (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState() : null;
      const s = residents ? residents.sairen : null;
      if (s && s.status !== 'crew') {
        s.status = 'crew'; s.awayLocation = null; s.awayCompanion = null;
        s.relationship = 'Fair Tide Crew'; s.trust = 'Earned'; delete s.note;
        if (!game.sairenCrewLogged) {
          game.sairenCrewLogged = true;
          if (typeof window.logResidentArrivalDeparture === 'function') window.logResidentArrivalDeparture(s, 'join', 'Joins Fair Tide\'s crew for good.');
        }
      }
      // the Person of Interest file: still showing the Arc XXIX working classification
      if (typeof window.sairenDossierState === 'function') {
        const d = window.sairenDossierState();
        if (d.classified && d.relationship !== 'Fair Tide Crew') {
          d.affiliation = 'Fair Tide (crew)'; d.threatLevel = 'None. Cleared, and one of the crew';
          d.relationship = 'Fair Tide Crew'; d.fairTideAccess = 'Full access (crew)'; d.recruitable = true;
        }
      }
      if (typeof window.registerNamelessContact === 'function') {
        const contacts = (typeof window.namelessContactsState === 'function') ? window.namelessContactsState() : null;
        const c = contacts ? contacts.sairen : null;
        if (!c || c.attitude !== 'Committed to Fair Tide') {
          window.registerNamelessContact('sairen', { name: 'Sairen', allegiance: 'Fair Tide (crew)', attitude: 'Committed to Fair Tide', reliability: 'Proven', notes: 'Chose Fair Tide and joined the crew.' });
        }
      }
    } catch(e) {}
  }
  const oldSync = window.syncArc1StoryQuestProgress;
  if (typeof oldSync === 'function') {
    window.syncArc1StoryQuestProgress = function(){ const r = oldSync.apply(this, arguments); reconcile(); return r; };
  }
  const oldRecruit = window.grantSairenRecruitIfDue;
  if (typeof oldRecruit === 'function') {
    window.grantSairenRecruitIfDue = function(){ const r = oldRecruit.apply(this, arguments); reconcile(); return r; };
  }
  const oldArchive = window.renderArchiveScreen;
  if (typeof oldArchive === 'function') {
    window.renderArchiveScreen = function(){ reconcile(); return oldArchive.apply(this, arguments); };
  }
})();
