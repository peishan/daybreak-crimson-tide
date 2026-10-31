(function(){
  // -------------------------------------------------------------------
  // ARC XL MECHANICS — THOUGHT RESONANCE unlock and its flavor-event
  // pool, the gameplay Ch.13's own notes call for. Kept OUT of arc40.js
  // itself, same split used since Arc XXIII.
  //
  //   1. UNLOCK — game.thoughtResonanceUnlocked flips true at Ch.13
  //      ("The Shape of the Bond"), the exact chapter where Mimi, Renn
  //      and Erynn conclude their observations in-story. Once set, the
  //      existing Bond Resonance panel (arc37-mechanics.js's own
  //      renderBondResonancePanel, previously just a deliberately vague
  //      tier label -- "Quiet"/"Noticeable"/"Undeniable", never named)
  //      is re-skinned to actually say "Thought Resonance" -- the same
  //      targeted-replace technique arc36-mechanics.js already used for
  //      Soel Watch -> Soel Guardian, never editing arc37-mechanics.js
  //      directly. No new tier table, no point-threshold gate -- the
  //      story chapter IS the gate, same as every other story flag in
  //      this game.
  //
  //   2. FLAVOR EVENTS — "occasional shared intentions, emotional
  //      impressions and brief thoughts," explicitly NOT unrestricted
  //      mind-reading and explicitly NOT grindable. Same shape as Arc
  //      XXXVI's Twin Trouble / Arc XXXVII's Twin Affinity (a small
  //      pool, a once-per-day roll, a capped log) -- proven pattern,
  //      reused rather than inventing a new one. Deliberately no combat-
  //      turn hook: Ch.9's own chapter text already covers Thought
  //      Resonance proving useful mid-expedition as a one-time story
  //      beat, and the outline's own build notes say not to invent a
  //      new battle mechanic unless one already exists for this --
  //      none does, so this stays a Fair Tide/day-tick flavor system,
  //      same as Twin Trouble, rather than reaching into the live
  //      combat loop.
  // -------------------------------------------------------------------

  // ===========================================================================
  // 1. UNLOCK + PANEL RE-SKIN
  // ===========================================================================
  const oldSyncArc1ForArc40Unlock = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForArc40Unlock) oldSyncArc1ForArc40Unlock();
    const cp = game.comicProgress40;
    if (!cp) return;
    if (cp[13] && !game.thoughtResonanceUnlocked) {
      game.thoughtResonanceUnlocked = true;
      toast('💗 Thought Resonance — named, at last, for what it\'s always been.', 3600);
    }
    checkThoughtResonanceEvents();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderBondResonancePanelForArc40 = window.renderBondResonancePanel;
  window.renderBondResonancePanel = function(){
    let html = oldRenderBondResonancePanelForArc40 ? oldRenderBondResonancePanelForArc40() : '';
    if (game.thoughtResonanceUnlocked && html.indexOf('Something Between Them') !== -1) {
      html = html.replace('💗 Something Between Them', '💗 Thought Resonance');
      const tier = (typeof window.bondResonanceTier === 'function') ? window.bondResonanceTier() : null;
      if (tier) html = html.replace('>'+esc(tier.label)+'<', '>'+esc(tier.label)+' — occasional, never constant, entirely their own.<');
    }
    return html;
  };

  // ===========================================================================
  // 2. FLAVOR EVENTS
  // ===========================================================================
  const THOUGHT_RESONANCE_EVENTS = [
    { id:'reached_first', icon:'❤️', text:'San reached for something. Joel already had it in hand.' },
    { id:'same_worry', icon:'💗', text:'Neither said anything. Neither needed to -- they were already thinking about the same thing.' },
    { id:'glance_only', icon:'🌙', text:'A glance passed between them, and whatever needed deciding got decided.' },
    { id:'quiet_agreement', icon:'🌊', text:'San changed her mind about something small. Joel had already adjusted, a beat ahead of her.' },
    { id:'nothing_at_all', icon:'🌿', text:'San tried, just to see. Nothing happened. Some days are just ordinary days.' }
  ];
  window.ARC40_THOUGHT_RESONANCE_EVENTS = THOUGHT_RESONANCE_EVENTS;

  const THOUGHT_RESONANCE_CHANCE = 0.3;
  const MAX_RESONANCE_LOG = 20;

  function thoughtResonanceState(){
    if (!game.thoughtResonanceFlavor) game.thoughtResonanceFlavor = { lastRollDay: null, log: [] };
    return game.thoughtResonanceFlavor;
  }
  window.thoughtResonanceState = thoughtResonanceState;

  function checkThoughtResonanceEvents(){
    if (!game.thoughtResonanceUnlocked) return;
    const state = thoughtResonanceState();
    const today = game.day || 0;
    if (state.lastRollDay === today) return; // once per new game day, never per render/click -- not grindable
    state.lastRollDay = today;
    if (Math.random() >= THOUGHT_RESONANCE_CHANCE) return;
    const pick = THOUGHT_RESONANCE_EVENTS[Math.floor(Math.random() * THOUGHT_RESONANCE_EVENTS.length)];
    state.log.push({ id: pick.id, icon: pick.icon, text: pick.text, day: today });
    if (state.log.length > MAX_RESONANCE_LOG) state.log.splice(0, state.log.length - MAX_RESONANCE_LOG);
  }

  function renderThoughtResonanceFlavorPanel(){
    if (!game.thoughtResonanceUnlocked) return '';
    const state = thoughtResonanceState();
    const today = game.day || 0;
    const todays = state.log.filter(function(e){ return e.day === today; });
    let html = '<div class="panel-title" style="margin-top:16px;">💗 Between Them</div>';
    if (todays.length) {
      todays.forEach(function(e){
        html += '<article class="quest-item">'+esc(e.icon)+' '+esc(e.text)+'</article>';
      });
    } else {
      html += '<article class="quest-item"><span style="font-size:.78rem;opacity:.7;">Quiet so far today.</span></article>';
    }
    return html;
  }
  window.renderThoughtResonanceFlavorPanel = renderThoughtResonanceFlavorPanel;

  const oldRenderArchiveScreenForArc40 = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForArc40) oldRenderArchiveScreenForArc40();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('thoughtResonanceFlavorPanelWrap');
    if (existing) existing.remove();
    const panel = renderThoughtResonanceFlavorPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="thoughtResonanceFlavorPanelWrap">'+panel+'</div>');
  };
})();
