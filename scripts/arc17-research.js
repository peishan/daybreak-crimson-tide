(function(){
  // -------------------------------------------------------------------
  // ARC XVII — RESEARCH SYSTEM. Second slice of San's mechanics doc for
  // this arc (Archive Hub + Records were the first). Per the doc:
  // "instead of Research Complete -> Item acquired, we can have Research
  // Project -> New information unlocked" — three researchers, each with
  // their own field and their own small project list, real duration
  // (not instant), one active project per researcher at a time.
  //
  // Deliberately does NOT duplicate or gate the existing Record
  // progression (Unknown -> Observed -> Verified -> Archived), which
  // already advances automatically with the story in arc17-archive-hub.js
  // via ARCHIVE_RECORDS' own chapter-keyed stages. Research here is
  // optional, additive depth on top of that: each project requires its
  // tied Record to have already reached at least the given stage before
  // it can even start (so nothing here is ever ahead of the story), and
  // completing it unlocks an extra character-specific finding — it never
  // moves a Record's own status or unlocks a chapter. This keeps
  // Research in the same category as Bonds: it enriches, it doesn't
  // gate.
  //
  // Left for later passes, per the doc: Evidence/corroboration states,
  // the Farseer comparison layer, Renn's Origin as its own tracked UI,
  // Sealed Records, the ancient route map, crew expertise contributions
  // beyond these three, phone integration, the Fair Tide Archive
  // building.
  // -------------------------------------------------------------------

  const RESEARCH_STATUS_ORDER = ['Observed', 'Verified', 'Archived'];

  function recordStatus(recordKey){
    if (typeof window.archiveRecordsState !== 'function') return null;
    const rec = window.archiveRecordsState().find(function(r){ return r.key === recordKey; });
    return rec ? rec.status : null;
  }
  function recordAtLeast(recordKey, minStatus){
    const status = recordStatus(recordKey);
    if (!status) return false;
    return RESEARCH_STATUS_ORDER.indexOf(status) >= RESEARCH_STATUS_ORDER.indexOf(minStatus);
  }

  // -----------------------------------------------------------------
  // RESEARCHERS + PROJECTS. Per the doc's three fields. Each project
  // ties to one of the six existing ARCHIVE_RECORDS and requires that
  // record to already be at least at the given stage — so a project
  // never surfaces information the story hasn't reached yet.
  // -----------------------------------------------------------------

  const RESEARCHERS = {
    renn: {
      name: 'Renn', icon: '🔧', field: 'Arcane / Technical Research',
      flavor: 'Whatever kept this place running hasn\'t stopped. Renn wants to know why.',
      projects: [
        {
          key: 'archive_machinery', tiedRecord: 'the_archive', minStatus: 'Observed', durationDays: 4,
          title: 'The Archive\'s Machinery',
          desc: 'The systems here are still drawing on something, after however long this place has sat empty. Renn wants to trace what.',
          finding: 'Not power in any sense Renn recognizes — the Archive is drawing directly on the boundary itself, the same structure the Horizon Engine only barely touches. Whoever built this didn\'t generate the connection between worlds. They tapped straight into something that was already there.'
        },
        {
          key: 'door_mechanism', tiedRecord: 'the_door_connection', minStatus: 'Verified', durationDays: 5,
          title: 'The Door\'s Mechanism',
          desc: 'If the Door from all that time ago is genuinely part of this network, Renn wants to understand how — not just that it is.',
          finding: 'The Door was never a separate anomaly. It\'s a route terminus, same as the ones cataloged here — just one that had lost its other end. Renn built the Horizon Engine from first principles, using instincts she never questioned. She was reconstructing something. Not inventing it.'
        }
      ]
    },
    erynn: {
      name: 'Erynn', icon: '📖', field: 'Historical / Farseer Research',
      flavor: 'Every Farseer record he\'s ever studied suddenly reads differently, once he knows what it was translated from.',
      projects: [
        {
          key: 'farseer_inheritance', tiedRecord: 'farseer_origin', minStatus: 'Observed', durationDays: 4,
          title: 'What the Farseers Kept',
          desc: 'If the Archive predates the Farseer tradition, Erynn wants to know exactly what was carried forward — and what wasn\'t.',
          finding: 'The core symbols match almost exactly. The context around them doesn\'t. Somewhere across the generations between the Archive and now, the Farseers kept the shape of the knowledge and lost the reasoning behind it — turned working methodology into ritual, because the people repeating it stopped understanding why it worked.'
        },
        {
          key: 'separation_factions', tiedRecord: 'the_great_separation', minStatus: 'Observed', durationDays: 5,
          title: 'Who Actually Disagreed',
          desc: 'The Great Separation reads like a single event. Erynn doesn\'t think it was — he wants names, positions, an actual account of the dispute.',
          finding: 'Not two sides. At least four distinct positions, by Erynn\'s count — and none of them wanted what eventually happened. The full closure was nobody\'s plan. It was what was left once every attempt at a smaller compromise had already failed.'
        }
      ]
    },
    mimi: {
      name: 'Mimi', icon: '🔮', field: 'Divination / Perception Research',
      flavor: 'Not everything worth knowing left a record. Mimi listens for the rest.',
      projects: [
        {
          key: 'signals_echo', tiedRecord: 'the_signal', minStatus: 'Observed', durationDays: 3,
          title: 'The Signal\'s Echo',
          desc: 'The signal that led the crew here wasn\'t only information. Mimi thinks it was also, unmistakably, a feeling — and she wants to sit with it properly.',
          finding: 'It wasn\'t a distress call, and it wasn\'t a warning either — Mimi is certain of that now. It read more like someone leaving a door unlocked on their way out. Not urgent. Just left open, on the chance somebody eventually came looking.'
        },
        {
          key: 'renns_people', tiedRecord: 'renns_civilization', minStatus: 'Observed', durationDays: 4,
          title: 'What the Records Don\'t Say',
          desc: 'The records confirm Renn\'s lineage well enough. Mimi wants to know what it actually felt like to be one of these people — something no record was ever going to write down.',
          finding: 'Grief, mostly, threaded all through it — but not the kind that comes from losing something suddenly. The kind that comes from watching something you love slowly become something you\'re not sure you recognize anymore, one reasonable decision at a time.'
        }
      ]
    }
  };
  window.ARCHIVE_RESEARCHERS = RESEARCHERS;

  // -----------------------------------------------------------------
  // STATE. Matches the Bonds "once per day" pattern (lastSpentDay check
  // against game.day) rather than inventing a new timing mechanism.
  // -----------------------------------------------------------------

  function researchState(){
    game.archiveResearchState = game.archiveResearchState || {};
    Object.keys(RESEARCHERS).forEach(function(rid){
      game.archiveResearchState[rid] = game.archiveResearchState[rid] || {
        activeProjectKey: null, progressDays: 0, lastAdvancedDay: null, completedKeys: []
      };
    });
    return game.archiveResearchState;
  }
  window.archiveResearchState = researchState;

  function projectAvailable(researcherId, project){
    const rs = researchState()[researcherId];
    if (rs.completedKeys.indexOf(project.key) !== -1) return false; // already done
    return recordAtLeast(project.tiedRecord, project.minStatus);
  }

  window.canStartResearchProject = function(researcherId, projectKey){
    const researcher = RESEARCHERS[researcherId];
    if (!researcher) return false;
    const rs = researchState()[researcherId];
    if (rs.activeProjectKey) return false; // one active project per researcher, per the doc
    const project = researcher.projects.find(function(p){ return p.key === projectKey; });
    if (!project) return false;
    return projectAvailable(researcherId, project);
  };

  window.startResearchProject = function(researcherId, projectKey){
    if (!window.canStartResearchProject(researcherId, projectKey)) { toast('That project isn\'t available right now.'); return; }
    const rs = researchState()[researcherId];
    rs.activeProjectKey = projectKey;
    rs.progressDays = 0;
    rs.lastAdvancedDay = null;
    const researcher = RESEARCHERS[researcherId];
    const project = researcher.projects.find(function(p){ return p.key === projectKey; });
    logEvent(researcher.icon + ' ' + researcher.name + ' begins researching: ' + project.title + '.', 'good');
    toast(researcher.icon + ' ' + researcher.name + ' starts a new research project.', 3000);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  // Fair Tide's Archive building (see fairtide-buildings-and-arc6.js),
  // tiers 2 and 4 specifically ("Research Desk", "Boundary Observatory")
  // speed up every research project here. Capped at a minimum of 1 day
  // so it never becomes instant regardless of building level.
  function effectiveResearchDuration(baseDays){
    const archiveLevel = (game.fairTideBuildings && game.fairTideBuildings.archive) || 0;
    let reduction = 0;
    if (archiveLevel >= 2) reduction += 1;
    if (archiveLevel >= 4) reduction += 2;
    return Math.max(1, baseDays - reduction);
  }
  window.effectiveResearchDuration = effectiveResearchDuration;

  window.canAdvanceResearch = function(researcherId){
    const rs = researchState()[researcherId];
    if (!rs.activeProjectKey) return false;
    return rs.lastAdvancedDay !== game.day;
  };

  window.advanceResearchProject = function(researcherId){
    if (!window.canAdvanceResearch(researcherId)) { toast('Already checked in on this today.'); return; }
    const researcher = RESEARCHERS[researcherId];
    const rs = researchState()[researcherId];
    const project = researcher.projects.find(function(p){ return p.key === rs.activeProjectKey; });
    if (!project) { rs.activeProjectKey = null; return; }
    rs.progressDays += 1;
    rs.lastAdvancedDay = game.day;
    if (rs.progressDays >= effectiveResearchDuration(project.durationDays)) {
      rs.completedKeys.push(project.key);
      rs.activeProjectKey = null;
      rs.progressDays = 0;
      logEvent('🔬 ' + researcher.icon + ' ' + researcher.name + ' completes research: ' + project.title + '.', 'gold');
      toast('🔬 Research complete: ' + project.title, 3600);
      if (typeof showStoryModal === 'function') {
        setTimeout(function(){
          showStoryModal({ title: researcher.icon + ' ' + project.title, blurb: project.finding });
        }, 400);
      }
    } else {
      toast(researcher.icon + ' ' + researcher.name + ' continues: ' + project.title + ' (' + rs.progressDays + '/' + effectiveResearchDuration(project.durationDays) + ')', 2800);
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  // -----------------------------------------------------------------
  // RENDER — a panel within the Archive screen, matching how
  // renderArchiveRecordsPanel() works (a function returning an HTML
  // string, composed into renderArchiveScreen()'s own container).
  // -----------------------------------------------------------------

  function renderResearchPanel(){
    let html = '<div class="panel-title" style="margin-top:16px;">🔬 Research</div>'+
      '<p style="font-size:.8rem;opacity:.7;margin-bottom:10px;">Renn, Erynn, and Mimi can each dig deeper into something the crew has already found — one project at a time, checked in on once a day.</p>';
    Object.keys(RESEARCHERS).forEach(function(rid){
      const researcher = RESEARCHERS[rid];
      const rs = researchState()[rid];
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:flex-start;">'+
        '<div style="font-size:1.4rem;">'+researcher.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(researcher.name)+'</strong> — <span style="opacity:.75;font-size:.78rem;">'+esc(researcher.field)+'</span><br>';

      if (rs.activeProjectKey) {
        const project = researcher.projects.find(function(p){ return p.key === rs.activeProjectKey; });
        const canAdvance = window.canAdvanceResearch(rid);
        html += '<span style="font-size:.8rem;opacity:.85;">Researching: <strong>'+esc(project.title)+'</strong></span><br>'+
          '<span style="font-size:.76rem;opacity:.65;">Progress: '+rs.progressDays+' / '+effectiveResearchDuration(project.durationDays)+' days</span>'+
          '<div style="margin-top:6px;"><button class="btn btn-small btn-success" '+(canAdvance?'':'disabled')+' onclick="advanceResearchProject(\''+rid+'\')">🔬 Check In</button></div>';
      } else {
        const available = researcher.projects.filter(function(p){ return projectAvailable(rid, p); });
        const completed = researcher.projects.filter(function(p){ return rs.completedKeys.indexOf(p.key) !== -1; });
        if (available.length) {
          html += '<span style="font-size:.78rem;opacity:.7;">'+esc(researcher.flavor)+'</span>';
          available.forEach(function(p){
            html += '<div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,255,255,.08);">'+
              '<strong style="font-size:.82rem;">'+esc(p.title)+'</strong><br>'+
              '<span style="font-size:.76rem;opacity:.7;">'+esc(p.desc)+'</span><br>'+
              '<span style="font-size:.72rem;opacity:.55;">'+effectiveResearchDuration(p.durationDays)+' days</span>'+
              '<div style="margin-top:4px;"><button class="btn btn-small" onclick="startResearchProject(\''+rid+'\',\''+p.key+'\')">🔬 Begin</button></div></div>';
          });
        } else if (completed.length === researcher.projects.length) {
          html += '<span style="font-size:.78rem;opacity:.6;">No open questions right now — every project '+researcher.name+' can currently pursue has been completed.</span>';
        } else {
          html += '<span style="font-size:.78rem;opacity:.6;">Nothing '+researcher.name+' can research yet. More will open up as the Archive is understood further.</span>';
        }
        if (completed.length) {
          html += '<div style="margin-top:8px;font-size:.74rem;opacity:.55;">Completed: '+completed.map(function(p){ return esc(p.title); }).join(', ')+'</div>';
        }
      }
      html += '</div></div></article>';
    });
    return html;
  }
  window.renderResearchPanel = renderResearchPanel;

  const oldRenderArchiveScreenForResearch = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForResearch) oldRenderArchiveScreenForResearch();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    // Lesson learned from the Bonds tab accumulation bug (V220): never
    // blindly insertAdjacentHTML on every render without first removing
    // whatever this same wrap inserted last time, since any action here
    // (starting or checking in on a project) re-renders the whole
    // screen — a naive append would stack a new copy on top of every
    // previous one instead of replacing it.
    const existing = document.getElementById('archiveResearchPanelWrap');
    if (existing) existing.remove();
    container.insertAdjacentHTML('beforeend', '<div id="archiveResearchPanelWrap">'+renderResearchPanel()+'</div>');
  };
})();
