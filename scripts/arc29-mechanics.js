(function(){
  // -------------------------------------------------------------------
  // ARC XXIX MECHANICS — the counterintelligence upgrade Ch.6, 7, 9, 10,
  // 11, 12, and 23's own notes call for. Deliberately kept OUT of
  // arc29.js itself, same split used since Arc XXIII.
  //
  // Two systems, both purely additive on top of Arc XXVII's existing
  // Intelligence Analysis system (arc27-mechanics.js) rather than
  // replacing it:
  //
  //   1. SAIREN — PERSON OF INTEREST: a small, story-paced dossier that
  //      fills in automatically as its chapters are read (never a
  //      player action) -- each entry debunks one of his constructed
  //      identities, culminating in Ch.12's working classification card,
  //      then updated once more by Ch.23's boundary terms. This is the
  //      concrete, story-specific version of the outline's own worked
  //      example ("Lead: Sairen — Merchant from Western Veyren" ->
  //      "FALSE IDENTITY", etc.).
  //
  //   2. CROSS-CHECK / POSSIBLE MISDIRECTION: a generic upgrade to
  //      Arc XXVII's own Lead objects. A lead that's already been
  //      classified (confirmed/likely/unverified/contradictory) can be
  //      assigned to a SECOND, different analyst for independent
  //      re-verification -- reflecting an opponent who deliberately
  //      feeds investigators false information, per the outline's own
  //      framing. A weakly-classified lead is considerably more likely
  //      to be exposed as misdirection than a strongly-classified one.
  //      Arc XXVII's own four states, and its analyst-assignment flow,
  //      are completely untouched; Possible Misdirection is a fifth
  //      state reachable ONLY through this new action.
  //
  // Per the outline's own explicit restraint: Sairen never gets an
  // ALL_PARTY entry and is never recruitable. His own dossier card says
  // so directly ("Recruitable: No") and nothing in this file, or any
  // other, contradicts that -- the trusted-friend version of Sairen is
  // explicitly years of story away.
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. SAIREN — PERSON OF INTEREST
  // ===========================================================================
  const SAIREN_DEBUNKED_IDENTITIES = [
    { chapter:6,  label:'Sairen — Merchant from Western Veyren', verdict:'FALSE IDENTITY' },
    { chapter:7,  label:'Sairen — Dockworker',                    verdict:'CONSTRUCTED RECORD' },
    { chapter:10, label:'Sairen — Independent Courier',           verdict:'FALSE IDENTITY (planted trail)' }
  ];
  window.ARC29_SAIREN_DEBUNKED_IDENTITIES = SAIREN_DEBUNKED_IDENTITIES;

  function sairenDossierUnlocked(){
    return !!(game.comicProgress29 && game.comicProgress29[6]);
  }
  window.sairenDossierUnlocked = sairenDossierUnlocked;

  function ensureSairenDossier(){
    game.sairenDossier = game.sairenDossier || {
      debunked: [],
      nameless_link: false,
      classified: false,
      trueName: 'Unconfirmed',
      occupation: null,
      affiliation: null,
      threatLevel: null,
      fairTideAccess: null,
      relationship: null,
      recruitable: false
    };
    return game.sairenDossier;
  }
  window.sairenDossierState = ensureSairenDossier;

  function checkSairenDossierEvents(){
    const cp = game.comicProgress29;
    if (!cp || !sairenDossierUnlocked()) return;
    const dossier = ensureSairenDossier();

    SAIREN_DEBUNKED_IDENTITIES.forEach(function(entry){
      if (!cp[entry.chapter]) return;
      const already = dossier.debunked.some(function(d){ return d.label === entry.label; });
      if (already) return;
      dossier.debunked.push({ label: entry.label, verdict: entry.verdict });
      toast('⚠️ ' + entry.label + ' — ' + entry.verdict + '.', 3800);
      if (typeof logEvent === 'function') logEvent('⚠️ Sairen identity debunked: ' + entry.label + ' — ' + entry.verdict + '.', 'bad');
    });

    // Ch.11 ("The Nameless Connection") -- a partial, honest finding,
    // not a resolved membership claim (see Arc XXVII's own restraint on
    // treating "connected to" and "member of" as interchangeable).
    if (cp[11]) dossier.nameless_link = true;

    // Ch.12 ("The Spy") -- the working classification card assembles,
    // exactly as written in the outline.
    if (cp[12] && !dossier.classified) {
      dossier.classified = true;
      dossier.occupation = 'Intelligence Operative';
      dossier.affiliation = dossier.nameless_link ? 'Unknown / Nameless-associated' : 'Unknown';
      dossier.threatLevel = 'Undetermined';
      dossier.relationship = "N's Companion";
      dossier.recruitable = false;
      toast('🕶️ Working classification recorded: SAIREN — Intelligence Operative.', 4200);
    }

    // Ch.23 ("No Place at Fair Tide") -- the boundary terms are the
    // final update this dossier ever needs; nothing later in this arc
    // changes it further.
    if (cp[23] && dossier.fairTideAccess !== 'Visitor (Restricted)') {
      dossier.fairTideAccess = 'Visitor (Restricted)';
      dossier.recruitable = false;
      if (typeof logEvent === 'function') logEvent('📏 Sairen accepts Fair Tide\'s visitor terms — no Intelligence access, no Horizon records, no restricted routes.', 'gold');
    }
  }

  const oldSyncArc1ForSairenDossier = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForSairenDossier) oldSyncArc1ForSairenDossier();
    checkSairenDossierEvents();
  };

  function renderSairenDossierPanel(){
    if (!sairenDossierUnlocked()) return '';
    const d = ensureSairenDossier();
    let html = '<div class="panel-title" style="margin-top:16px;">🗂️ Person of Interest: Sairen</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Not everything about him checks out — and not everything that doesn\'t check out means the same thing.</p>';

    if (d.debunked.length) {
      d.debunked.forEach(function(entry){
        html += '<article class="quest-item"><span style="font-size:.8rem;">'+esc(entry.label)+'</span><br>'+
          '<span class="story-chip" style="background:#a33d3d;">⚠️ '+esc(entry.verdict)+'</span></article>';
      });
    }

    if (d.classified) {
      html += '<article class="quest-item"><strong>🕶️ SAIREN</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">True name: '+esc(d.trueName)+'<br>'+
        'Occupation: '+esc(d.occupation)+' ✓<br>'+
        'Affiliation: '+esc(d.affiliation)+'<br>'+
        'Threat level: '+esc(d.threatLevel)+
        (d.relationship ? '<br>Relationship: '+esc(d.relationship) : '')+
        (d.fairTideAccess ? '<br>Fair Tide Access: '+esc(d.fairTideAccess) : '')+
        '<br>Recruitable: '+(d.recruitable ? 'Yes' : 'No')+
        '</span></article>';
    } else if (!d.debunked.length) {
      html += '<article class="quest-item"><span style="font-size:.8rem;opacity:.7;">No confirmed findings yet.</span></article>';
    }
    return html;
  }
  window.renderSairenDossierPanel = renderSairenDossierPanel;

  const oldRenderArchiveScreenForSairenDossier = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForSairenDossier) oldRenderArchiveScreenForSairenDossier();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('sairenDossierPanelWrap');
    if (existing) existing.remove();
    const panel = renderSairenDossierPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="sairenDossierPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // 2. CROSS-CHECK / POSSIBLE MISDIRECTION
  // ===========================================================================
  // Extends Arc XXVII's own classification lookup table with a fifth
  // entry rather than building a parallel one -- ARC27_CLASSIFICATIONS
  // is a plain shared object, so this is a pure addition; every existing
  // key/behavior in arc27-mechanics.js is untouched.
  if (window.ARC27_CLASSIFICATIONS && !window.ARC27_CLASSIFICATIONS.misdirection) {
    window.ARC27_CLASSIFICATIONS.misdirection = { key:'misdirection', label:'POSSIBLE MISDIRECTION', icon:'◈', color:'#8e44ad' };
  }

  function crossCheckUnlocked(){
    return !!(game.comicProgress29 && game.comicProgress29[6]);
  }
  window.crossCheckUnlocked = crossCheckUnlocked;

  function leadsList(){
    return (typeof window.intelligenceLeads === 'function') ? window.intelligenceLeads() : [];
  }

  const CROSS_CHECK_DURATION_DAYS = 1;
  // A weakly-classified lead is considerably more likely to turn out to
  // have been deliberate misdirection than a strongly-classified one --
  // the whole point of the mechanic.
  const MISDIRECTION_REVEAL_CHANCE = { confirmed:0.05, likely:0.15, unverified:0.35, contradictory:0.55 };

  window.crossCheckLead = function(leadId, analystKey){
    if (!crossCheckUnlocked()) return;
    const lead = leadsList().find(function(l){ return l.id === leadId; });
    if (!lead || !lead.classification) return;
    if (lead.crossCheck) { toast('Already cross-checked.', 2800); return; }
    if (analystKey === lead.assignedTo) { toast('Needs a different analyst for a genuine second opinion.', 3200); return; }
    lead.crossCheck = { analyst: analystKey, startDay: game.day || 0, durationDays: CROSS_CHECK_DURATION_DAYS, result: null };
    toast('🔍 ' + (typeof window.arc27AnalystName === 'function' ? window.arc27AnalystName(analystKey) : analystKey) + ' begins an independent cross-check.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  function checkCrossCheckResolution(){
    if (!crossCheckUnlocked()) return;
    const nowDay = game.day || 0;
    leadsList().forEach(function(lead){
      const cc = lead.crossCheck;
      if (!cc || cc.result) return;
      const elapsed = nowDay - (typeof cc.startDay === 'number' ? cc.startDay : nowDay);
      if (elapsed < cc.durationDays) return;
      const revealChance = MISDIRECTION_REVEAL_CHANCE[lead.classification] || 0.35;
      if (Math.random() < revealChance) {
        lead.classification = 'misdirection';
        cc.result = 'misdirection_revealed';
        toast('◈ Cross-check reveals possible misdirection on a lead once thought settled.', 4000);
      } else {
        cc.result = 'reaffirmed';
        toast('✅ Cross-check reaffirms the original read.', 3200);
      }
    });
  }
  window.checkCrossCheckResolution = checkCrossCheckResolution;

  const oldSyncArc1ForCrossCheck = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForCrossCheck) oldSyncArc1ForCrossCheck();
    checkCrossCheckResolution();
  };

  // A misdirection lead is worse than an ordinary contradictory one --
  // it was deliberately planted, not just unreliable. Purely additive on
  // top of Arc XXVII's own follow-up scaling, which has no entry for
  // 'misdirection' at all and so otherwise treats it as a 0-adjustment
  // classification.
  const MISDIRECTION_FOLLOWUP_PENALTY = 20;

  const oldFollowUpIntelligenceLeadForArc29 = window.followUpIntelligenceLead;
  window.followUpIntelligenceLead = function(leadId){
    const lead = leadsList().find(function(l){ return l.id === leadId; });
    const wasMisdirection = !!(lead && lead.classification === 'misdirection');
    if (oldFollowUpIntelligenceLeadForArc29) oldFollowUpIntelligenceLeadForArc29(leadId);
    if (!wasMisdirection) return;
    game.gold = Math.max(0, (game.gold || 0) - MISDIRECTION_FOLLOWUP_PENALTY);
    toast('◈ That lead was misdirection all along — -' + MISDIRECTION_FOLLOWUP_PENALTY + 'g chasing it down.', 3600);
  };

  function renderCrossCheckPanel(){
    if (!crossCheckUnlocked()) return '';
    const analysts = (typeof window.ARC27_ANALYSTS !== 'undefined') ? window.ARC27_ANALYSTS : [];
    const classified = leadsList().filter(function(l){ return l.classification && l.classification !== 'misdirection'; });
    let html = '<div class="panel-title" style="margin-top:16px;">🔍 Cross-Check</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">A second, different analyst re-checks an already-read lead — sometimes a settled answer wasn\'t as settled as it looked.</p>';
    if (!classified.length) {
      html += '<article class="quest-item"><span style="font-size:.8rem;opacity:.7;">No classified leads available to cross-check right now.</span></article>';
      return html;
    }
    classified.forEach(function(lead){
      const cls = (window.ARC27_CLASSIFICATIONS || {})[lead.classification] || { icon:'', label: lead.classification };
      html += '<article class="quest-item"><span class="story-chip">'+cls.icon+' '+esc(cls.label)+'</span>';
      if (lead.crossCheck && lead.crossCheck.result) {
        const resultLabel = lead.crossCheck.result === 'misdirection_revealed' ? '◈ Misdirection revealed' : '✅ Reaffirmed';
        html += ' <span style="font-size:.78rem;opacity:.75;">— cross-check: '+resultLabel+'</span>';
      } else if (lead.crossCheck) {
        html += ' <span style="font-size:.78rem;opacity:.75;">— cross-check in progress</span>';
      } else {
        html += '<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">'+
          analysts.filter(function(a){ return a.key !== lead.assignedTo; }).map(function(a){
            return '<button class="btn btn-small" onclick="crossCheckLead('+lead.id+',\''+a.key+'\')">'+esc(a.name)+'</button>';
          }).join('')+
          '</div>';
      }
      html += '</article>';
    });
    return html;
  }
  window.renderCrossCheckPanel = renderCrossCheckPanel;

  const oldRenderArchiveScreenForCrossCheck = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForCrossCheck) oldRenderArchiveScreenForCrossCheck();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('crossCheckPanelWrap');
    if (existing) existing.remove();
    const panel = renderCrossCheckPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="crossCheckPanelWrap">'+panel+'</div>');
  };
})();
