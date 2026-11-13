(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE RESEARCH TEAM -- a compact home for the ongoing Black Pearl
  // research, per San. The team works from Fair Tide, so this is a Fair
  // Tide hub tab rather than a Crimson Horizon screen (the sequel runs in
  // the same app and reuses the same hub, port, Story and combat UI).
  //
  //   Renn, Erynn, Mimi -- the existing Archive researchers
  //     (arc17-research.js). This tab is a tighter front end for the SAME
  //     projects and the SAME state: starting or checking in here is
  //     identical to doing it on the Archive screen, nothing is
  //     duplicated or reset.
  //   Fen, Adrian -- the research-team additions the sequel leans on.
  //     They are researchers too (scripts/black-pearl-research.js adds
  //     them to the same system with their Black Pearl assignments), shown
  //     once they have arrived. The Black Pearl Study panel below is the
  //     Black Pearl log (arc42-mechanics.js) plus the report checklist and
  //     the Attend Briefing button.
  //
  // Sera is a guest, not part of the team, so she is not listed here.
  //
  // One row per person: portrait, name and field, one status line, one
  // action. "Check In With Everyone" does today's check-in for every
  // active project in one click. Portraits fall back to the emoji icon
  // if an image is missing.
  // -------------------------------------------------------------------

  const TEAM = [
    {id:'renn',   name:'Renn',   icon:'🔧', portrait:'assets/portraits/renn.png',   field:'', researcher:true},
    {id:'erynn',  name:'Erynn',  icon:'📜', portrait:'assets/portraits/erynn.png',  field:'', researcher:true},
    {id:'mimi',   name:'Mimi',   icon:'🔍', portrait:'assets/portraits/mimi.png',   field:'', researcher:true},
    {id:'fen',    name:'Fen',    icon:'⚙️', portrait:'assets/portraits/fen.png',    field:'Records & charts', researcher:true,
      note:'Traces couplings and old charts back to their source.',
      eligible:function(){ return !!(game.comicProgress42 && game.comicProgress42[38]); }},
    {id:'adrian', name:'Adrian', icon:'🔧', portrait:'assets/portraits/adrian.png', field:'Scholar · R&D', researcher:true,
      note:'A scholar\'s head for how the Horizon Engine actually works.',
      eligible:function(){ return !!(game.comicProgress42 && game.comicProgress42[31]); }}
  ];
  window.FAIR_TIDE_RESEARCH_TEAM = TEAM;

  function researchers(){ return window.ARCHIVE_RESEARCHERS || {}; }
  function rState(){ return (typeof window.archiveResearchState === 'function') ? window.archiveResearchState() : {}; }
  function visibleTeam(){ return TEAM.filter(function(m){ return !m.eligible || m.eligible(); }); }

  function ensureStyle(){
    if (document.getElementById('rtStyle')) return;
    const st = document.createElement('style');
    st.id = 'rtStyle';
    st.textContent =
      '.rt-row{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;padding:6px 0;border-top:1px solid rgba(255,255,255,.08)}' +
      '.rt-pt{width:44px;height:44px;border-radius:50%;overflow:hidden;flex:none;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:1.3rem}' +
      '.rt-pt img{width:100%;height:100%;object-fit:cover;object-position:center 20%;display:block}' +
      '.rt-main{flex:1;min-width:140px}' +
      '.rt-role{opacity:.65;font-size:.72rem;margin-left:6px}' +
      '.rt-status{font-size:.76rem;opacity:.8;line-height:1.3}' +
      '.rt-act{display:flex;gap:4px;align-items:center;margin-left:auto}' +
      '.rt-act.wide{flex:1 1 100%;margin-left:54px}' +
      '.rt-act select{flex:1;min-width:0;font-size:.76rem;padding:5px 6px;border-radius:6px;border:1px solid rgba(255,255,255,.22);background:rgba(0,0,0,.35);color:inherit}';
    document.head.appendChild(st);
  }

  function portraitWithFallback(m){
    return '<div class="rt-pt"><img src="' + m.portrait + '" alt="" onerror="this.parentNode.textContent=\'' + m.icon + '\'"></div>';
  }

  function memberRow(m){
    const rdef = m.researcher ? researchers()[m.id] : null;
    if (rdef) { m = Object.assign({}, m, { field: rdef.field, icon: rdef.icon }); }
    let status = '', act = '';
    if (m.researcher) {
      const def = researchers()[m.id];
      const rs = rState()[m.id];
      if (def && rs) {
        if (rs.activeProjectKey) {
          const project = def.projects.find(function(p){ return p.key === rs.activeProjectKey; });
          const total = window.effectiveResearchDuration(project.durationDays);
          const can = window.canAdvanceResearch(m.id);
          status = '🔬 <strong>' + esc(project.title) + '</strong> · ' + rs.progressDays + '/' + total + ' days';
          act = '<button class="btn btn-small btn-success" ' + (can ? '' : 'disabled') + ' onclick="__ctResearchAdvance(\'' + m.id + '\')">' + (can ? '🔬 Check In' : 'Checked In') + '</button>';
        } else {
          const open = def.projects.filter(function(p){ return window.canStartResearchProject(m.id, p.key); });
          const done = rs.completedKeys.length;
          if (open.length) {
            status = 'Idle · ' + open.length + ' project' + (open.length === 1 ? '' : 's') + ' open' + (done ? ' · ✓ ' + done + ' done' : '');
            act = '<select id="rt-sel-' + m.id + '">' +
              open.map(function(p){ return '<option value="' + p.key + '">' + esc(p.title) + ' (' + window.effectiveResearchDuration(p.durationDays) + 'd)</option>'; }).join('') +
              '</select><button class="btn btn-small" onclick="__ctResearchBegin(\'' + m.id + '\')">Begin</button>';
          } else {
            status = (done === def.projects.length) ? '✓ All current projects done' : 'Nothing to research yet — more opens as the story goes on' + (done ? ' · ✓ ' + done + ' done' : '');
          }
        }
      }
    } else {
      status = esc(m.note || '');
    }
    return '<div class="rt-row">' + portraitWithFallback(m) +
      '<div class="rt-main"><div><strong>' + esc(m.name) + '</strong><span class="rt-role">' + esc(m.field) + '</span></div>' +
      '<div class="rt-status">' + status + '</div></div>' +
      (act ? '<div class="rt-act' + (act.indexOf('<select') === 0 ? ' wide' : '') + '">' + act + '</div>' : '') + '</div>';
  }

  function dueCount(){
    return visibleTeam().filter(function(m){ return m.researcher && researchers()[m.id] && window.canAdvanceResearch(m.id); }).length;
  }

  function blackPearlBlock(){
    const bp = (typeof window.blackPearlInvestigationState === 'function') ? window.blackPearlInvestigationState() : null;
    let html = '<div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,.08);"><strong>🖤 Black Pearl study</strong>';
    if (!bp || !bp.started || !bp.log.length) {
      return html + '<div class="rt-status" style="margin-top:4px;">Not opened yet. It begins once the Pearl is raised with Fair Tide\'s researchers.</div></div>';
    }
    html += (typeof window.blackPearlStudyHtml === 'function') ? window.blackPearlStudyHtml() : '';
    const log = bp.log.slice().reverse();
    html += '<div class="rt-status" style="margin-top:4px;">' + esc(log[0].text) + '</div>';
    if (log.length > 1) {
      html += '<details style="margin-top:4px;"><summary class="rt-status" style="cursor:pointer;">Earlier notes (' + (log.length - 1) + ')</summary>' +
        log.slice(1).map(function(e){ return '<div class="rt-status" style="margin-top:4px;">' + esc(e.text) + '</div>'; }).join('') + '</details>';
    }
    return html + '</div>';
  }

  function renderResearchTeamTab(){
    const el = document.getElementById('ft-tab-research');
    if (!el) return;
    ensureStyle();
    const due = dueCount();
    let html = '<div class="panel-title">🔬 Research Team</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;margin-bottom:4px;">' +
      '<span class="rt-status">The Black Pearl study, worked from Fair Tide.</span>' +
      '<button class="btn btn-small btn-magic" ' + (due ? '' : 'disabled') + ' onclick="__ctResearchCheckAll()">🔬 ' + (due ? 'Check In With Everyone (' + due + ')' : 'All Checked In') + '</button></div>';
    html += visibleTeam().map(memberRow).join('');
    html += blackPearlBlock();
    el.innerHTML = html;
  }
  window.renderResearchTeamTab = renderResearchTeamTab;

  function refresh(){
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  }

  window.__ctResearchBegin = function(id){
    const sel = document.getElementById('rt-sel-' + id);
    if (!sel || !sel.value) return;
    window.startResearchProject(id, sel.value);
    refresh();
  };
  window.__ctResearchAdvance = function(id){
    window.advanceResearchProject(id);
    refresh();
  };
  // One click: today's check-in for every active project.
  window.__ctResearchCheckAll = function(){
    const ids = visibleTeam().filter(function(m){ return m.researcher && researchers()[m.id] && window.canAdvanceResearch(m.id); }).map(function(m){ return m.id; });
    if (!ids.length) { toast('Everyone on the team has already checked in today.'); return; }
    ids.forEach(function(id){ window.advanceResearchProject(id); });
    refresh();
  };

  // Tab wiring: the button/div live in index.html, same as every other
  // Fair Tide tab; always visible, with content explaining itself.
  const oldRenderFairTideHubForResearchTeam = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-research');
    const btn = document.getElementById('ft-tab-btn-research');
    if (el) el.classList.toggle('active', tab === 'research');
    if (btn) btn.classList.toggle('active', tab === 'research');
    if (oldRenderFairTideHubForResearchTeam) oldRenderFairTideHubForResearchTeam();
    if (tab === 'research') renderResearchTeamTab();
  };

  // The Archive screen's own research panel keeps working; keep this tab
  // in sync when something there changes state.
  const oldRenderArchiveScreenForResearchTeam = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForResearchTeam) oldRenderArchiveScreenForResearchTeam();
    if ((game.fairTideActiveTab || '') === 'research') renderResearchTeamTab();
  };
})();
