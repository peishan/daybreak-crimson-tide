(function(){
  // -------------------------------------------------------------------
  // ARC XXVII MECHANICS — the Intelligence Network upgrade Ch.4, 12, 19,
  // and 23's own notes call for. Deliberately kept OUT of arc27.js
  // itself, same split used since Arc XXIII.
  //
  // Per the outline: this UPGRADES Arc XXIV's existing Fair Tide
  // Intelligence system (arc24-mechanics.js) rather than introducing an
  // unrelated one. Every function here is either a pure addition to
  // that file's own Lead objects (new fields: assignedTo, classification,
  // analysisStartDay/DurationDays, unidentifiedConnection) or an
  // additive wrap around its exported functions — arc24-mechanics.js
  // is never edited.
  //
  // Deliberately NOT built, per the outline's own explicit restraint:
  // no Sairen, no infiltration system. Assigning a Lead to an analyst
  // only ever means reading and interpreting information Fair Tide
  // already has — nobody goes undercover, nobody enters a closed
  // network. That gap is left open on purpose.
  //
  // Follow-up itself is left fully backward compatible: a Lead can
  // still be followed up immediately, unassigned, for the exact flat
  // reward Arc XXIV always gave (that panel and button are untouched).
  // Assigning it to an analyst first and waiting for classification is
  // an OPTIONAL, better-informed path layered on top -- never a
  // requirement, matching the outline's own note that this should read
  // as an upgrade, not a gate.
  // -------------------------------------------------------------------

  // ===========================================================================
  // ANALYSTS & CLASSIFICATION (Ch.4) — four characters, each suited to
  // one of Arc XXIV's existing Intelligence source categories (routes,
  // research, divination, field). Assigning the right analyst to a
  // matching lead meaningfully raises the odds of a CONFIRMED read;
  // assigning any analyst to any lead always works, just less reliably
  // when it's outside their own specialty -- nobody is ever blocked
  // from analyzing anything.
  // ===========================================================================
  const ANALYSTS = [
    { key:'renn',    name:'Renn',    specialty:'routes' },
    { key:'erynn',   name:'Erynn',   specialty:'research' },
    { key:'mimi',    name:'Mimi',    specialty:'divination' },
    { key:'senedra', name:'Senedra', specialty:'field' }
  ];
  window.ARC27_ANALYSTS = ANALYSTS;

  const CLASSIFICATIONS = {
    confirmed:     { key:'confirmed',     label:'CONFIRMED',     icon:'✅', color:'#2e8b57' },
    likely:        { key:'likely',        label:'LIKELY',        icon:'🟡', color:'#b8860b' },
    unverified:    { key:'unverified',    label:'UNVERIFIED',    icon:'⚪', color:'#666666' },
    contradictory: { key:'contradictory', label:'CONTRADICTORY', icon:'⚠️', color:'#a33d3d' }
  };
  window.ARC27_CLASSIFICATIONS = CLASSIFICATIONS;

  function analystByKey(key){
    return ANALYSTS.find(function(a){ return a.key === key; });
  }
  function analystName(key){
    const a = analystByKey(key);
    return a ? a.name : key;
  }
  window.arc27AnalystName = analystName;

  function analysisUnlocked(){
    return !!(game.comicProgress27 && game.comicProgress27[4]);
  }
  window.intelligenceAnalysisUnlocked = analysisUnlocked;

  // Ch.12 ("The First Agreement") streamlines the whole exchange --
  // analysis takes one day instead of two from that point on.
  function analysisDurationDays(){
    return (game.comicProgress27 && game.comicProgress27[12]) ? 1 : 2;
  }
  window.arc27AnalysisDurationDays = analysisDurationDays;

  function leadsList(){
    return (typeof window.intelligenceLeads === 'function') ? window.intelligenceLeads() : [];
  }

  window.assignLeadToAnalyst = function(leadId, analystKey){
    if (!analysisUnlocked()) return;
    const analyst = analystByKey(analystKey);
    if (!analyst) return;
    const lead = leadsList().find(function(l){ return l.id === leadId; });
    if (!lead) return;
    if (lead.assignedTo) { toast(analystName(lead.assignedTo) + ' is already on this one.', 2800); return; }
    lead.assignedTo = analystKey;
    lead.analysisStartDay = game.day || 0;
    lead.analysisDurationDays = analysisDurationDays();
    toast('🕵️ ' + analyst.name + ' starts analyzing the lead.', 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  // Weighted pick: a matching specialty meaningfully favors a reliable
  // read; a mismatch still works, just leans toward the murkier outcomes
  // more often. Never a guaranteed result either way -- some things
  // just don't resolve cleanly, matching the arc's own theme.
  const MATCHED_WEIGHTS = [['confirmed',0.55], ['likely',0.30], ['unverified',0.10], ['contradictory',0.05]];
  const MISMATCHED_WEIGHTS = [['confirmed',0.20], ['likely',0.35], ['unverified',0.30], ['contradictory',0.15]];

  function pickClassification(matched){
    const weights = matched ? MATCHED_WEIGHTS : MISMATCHED_WEIGHTS;
    const r = Math.random();
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i][1];
      if (r < cumulative) return weights[i][0];
    }
    return 'unverified';
  }
  window.arc27PickClassification = pickClassification;

  // Ch.19 ("No Headquarters"): a lead nobody's gotten around to
  // assigning for a while just gets routed to whoever's best suited,
  // automatically -- reflecting the arc's own point that information
  // keeps moving through the network with or without anyone deliberately
  // directing it.
  const AUTO_ASSIGN_IDLE_DAYS = 4;
  function autoAssignEnabled(){
    return !!(game.comicProgress27 && game.comicProgress27[19]);
  }

  function checkIntelligenceAnalysis(){
    if (!analysisUnlocked()) return;
    const leads = leadsList();
    const nowDay = game.day || 0;
    leads.forEach(function(lead){
      if (lead.assignedTo && !lead.classification) {
        const elapsed = nowDay - (typeof lead.analysisStartDay === 'number' ? lead.analysisStartDay : nowDay);
        if (elapsed >= (lead.analysisDurationDays || 2)) {
          const analyst = analystByKey(lead.assignedTo);
          const matched = !!(analyst && analyst.specialty === lead.sourceKey);
          lead.classification = pickClassification(matched);
          const cls = CLASSIFICATIONS[lead.classification];
          toast('📋 ' + analystName(lead.assignedTo) + ' finishes the read: ' + cls.icon + ' ' + cls.label + '.', 3600);
        }
      }
    });
    if (autoAssignEnabled()) {
      leads.forEach(function(lead){
        if (lead.assignedTo) return;
        const idleDays = nowDay - (typeof lead.day === 'number' ? lead.day : nowDay);
        if (idleDays < AUTO_ASSIGN_IDLE_DAYS) return;
        const best = ANALYSTS.find(function(a){ return a.specialty === lead.sourceKey; }) || ANALYSTS[0];
        lead.assignedTo = best.key;
        lead.analysisStartDay = nowDay;
        lead.analysisDurationDays = analysisDurationDays();
      });
    }
  }
  window.checkIntelligenceAnalysis = checkIntelligenceAnalysis;

  const oldSyncArc1ForArc27Analysis = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForArc27Analysis) oldSyncArc1ForArc27Analysis();
    checkIntelligenceAnalysis();
  };

  // ===========================================================================
  // FOLLOW-UP REWARD SCALING — purely additive on top of
  // arc24-mechanics.js's own followUpIntelligenceLead, which still runs
  // first and grants its own flat reward exactly as before. A classified
  // lead adjusts the outcome afterward; an unclassified one (followed up
  // the old, immediate way) is completely untouched. XP is only ever
  // added, never clawed back -- Story XP doesn't reduce anywhere else in
  // this codebase, so this doesn't start.
  // ===========================================================================
  const FOLLOWUP_GOLD_ADJUST = { confirmed:30, likely:10, unverified:-20, contradictory:-40 };
  const FOLLOWUP_XP_BONUS = { confirmed:40, likely:0, unverified:0, contradictory:0 };

  const oldFollowUpIntelligenceLeadForArc27 = window.followUpIntelligenceLead;
  window.followUpIntelligenceLead = function(leadId){
    const lead = leadsList().find(function(l){ return l.id === leadId; });
    const classification = lead ? lead.classification : null;
    if (oldFollowUpIntelligenceLeadForArc27) oldFollowUpIntelligenceLeadForArc27(leadId);
    if (!classification) return;
    const goldAdjust = FOLLOWUP_GOLD_ADJUST[classification] || 0;
    const xpBonus = FOLLOWUP_XP_BONUS[classification] || 0;
    if (goldAdjust) game.gold = Math.max(0, (game.gold || 0) + goldAdjust);
    if (xpBonus) gainXP(xpBonus);
    if (goldAdjust || xpBonus) {
      const cls = CLASSIFICATIONS[classification];
      toast('📋 ' + cls.icon + ' ' + cls.label + ' lead: ' + (goldAdjust >= 0 ? '+' : '') + goldAdjust + 'g' + (xpBonus ? ', +' + xpBonus + ' bonus XP' : '') + '.', 3600);
    }
  };

  // ===========================================================================
  // INTELLIGENCE ANALYSIS PANEL — its own independent panel, deliberately
  // NOT spliced into arc24-mechanics.js's own renderFairTideIntelligencePanel
  // markup (same reason Arc XXVI's "Affiliation: Unknown" note is a
  // standalone line rather than per-card surgery: that function renders
  // every lead's card as one combined string, with no safe seam to target
  // just one). This panel reads the exact same underlying lead list and
  // adds assignment/classification controls; the original panel and its
  // immediate Follow Up button are untouched and still fully usable.
  // ===========================================================================
  function renderIntelligenceAnalysisPanel(){
    if (!analysisUnlocked()) return '';
    const leads = leadsList();
    let html = '<div class="panel-title" style="margin-top:16px;">🕵️ Intelligence Analysis</div>'+
      '<p style="font-size:.78rem;opacity:.65;margin-bottom:8px;">Assign a lead to whoever\'s best suited to read it — not everything checks out the same way.</p>';
    if (!leads.length) {
      html += '<article class="quest-item"><span style="font-size:.8rem;opacity:.7;">No active leads to analyze right now.</span></article>';
      return html;
    }
    leads.forEach(function(lead){
      html += '<article class="quest-item">';
      if (lead.classification) {
        const cls = CLASSIFICATIONS[lead.classification];
        html += '<div><span class="story-chip" style="background:'+cls.color+';">'+cls.icon+' '+cls.label+'</span> '+
          '<span style="font-size:.78rem;opacity:.75;">— read by '+esc(analystName(lead.assignedTo))+'</span></div>';
      } else if (lead.assignedTo) {
        const daysLeft = Math.max(0, (lead.analysisDurationDays || 2) - ((game.day || 0) - (lead.analysisStartDay || 0)));
        html += '<div style="font-size:.8rem;opacity:.8;">'+esc(analystName(lead.assignedTo))+' is analyzing this lead — '+
          (daysLeft > 0 ? daysLeft + ' day' + (daysLeft === 1 ? '' : 's') + ' left' : 'finishing up')+'.</div>';
      } else {
        html += '<div style="font-size:.8rem;opacity:.8;margin-bottom:6px;">Unassigned lead.</div>'+
          '<div style="display:flex;flex-wrap:wrap;gap:4px;">'+
          ANALYSTS.map(function(a){ return '<button class="btn btn-small" onclick="assignLeadToAnalyst('+lead.id+',\''+a.key+'\')">'+esc(a.name)+'</button>'; }).join('')+
          '</div>';
      }
      html += '</article>';
    });
    return html;
  }
  window.renderIntelligenceAnalysisPanel = renderIntelligenceAnalysisPanel;

  const oldRenderArchiveScreenForArc27Analysis = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForArc27Analysis) oldRenderArchiveScreenForArc27Analysis();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('arc27IntelAnalysisPanelWrap');
    if (existing) existing.remove();
    const panel = renderIntelligenceAnalysisPanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="arc27IntelAnalysisPanelWrap">'+panel+'</div>');
  };

  // ===========================================================================
  // Ch.23 hook ("Someone We Haven't Met") — pure additive wrap, same
  // shape as Arc XXVI's own "Affiliation: Unknown" hook, chained on top
  // of it rather than replacing it. Seeds N's eventual return without
  // naming her, exactly per the outline's own restraint.
  // ===========================================================================
  const UNIDENTIFIED_CONNECTION_CHANCE = 0.25;

  function ch23Reached(){
    return !!(game.comicProgress27 && game.comicProgress27[23]);
  }
  window.arc27UnidentifiedConnectionActive = ch23Reached;

  const oldCheckIntelligenceLeadGenerationForArc27 = window.checkIntelligenceLeadGeneration;
  window.checkIntelligenceLeadGeneration = function(){
    if (oldCheckIntelligenceLeadGenerationForArc27) oldCheckIntelligenceLeadGenerationForArc27();
    if (!ch23Reached()) return;
    const leads = leadsList();
    if (!leads.length) return;
    const newest = leads[leads.length - 1];
    if (newest.unidentifiedConnection !== undefined) return;
    newest.unidentifiedConnection = Math.random() < UNIDENTIFIED_CONNECTION_CHANCE;
  };

  const oldRenderFairTideIntelligencePanelForArc27 = window.renderFairTideIntelligencePanel;
  window.renderFairTideIntelligencePanel = function(){
    const html = oldRenderFairTideIntelligencePanelForArc27 ? oldRenderFairTideIntelligencePanelForArc27() : '';
    if (!html || !ch23Reached()) return html;
    const leads = leadsList();
    if (!leads.some(function(l){ return l.unidentifiedConnection; })) return html;
    return html + '<div style="font-size:.74rem;opacity:.7;margin-top:6px;font-style:italic;">❓ One report references someone nobody at Fair Tide has ever met. No name given.</div>';
  };
})();
