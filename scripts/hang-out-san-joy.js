(function(){
  // -------------------------------------------------------------------
  // BOND TRACK + HANG OUT — San & Joy. Adds a fourth track to the
  // existing Bond system (arc9-and-systems.js: BOND_TRACKS), the same
  // generic points/tier/daily-cap/synergy machinery San & Crew and San
  // & The Later Trio already run on — extending that shared lookup
  // object (window.BOND_TRACKS) rather than editing arc9-and-systems.js
  // directly, same rule this codebase has followed for every lookup
  // object since Arc XXIII.
  //
  // Gated at Arc XXXIII Ch.2 ("Ate") rather than Joy's original Arc XX
  // recruitment — that's the exact story beat where San starts calling
  // her Ate unprompted, mirroring how San & Joel's own track is gated
  // behind Arc V Ch.4 (bonded by the story, not by simply being in the
  // party). Before Ch.2, Joy is just a normal fielded companion with no
  // bond track to speak of yet.
  //
  // DISPLAY CAVEAT this file has to work around: arc9-and-systems.js's
  // own renderBondsTab() hardcodes its bonus-text label by key name
  // ("san_crew" -> "gold & XP", anything else -> "crit chance") — it has
  // no way to know San & Joy's bond grants gold & XP too, and would
  // mislabel it "crit chance" if left in BOND_TRACKS during that base
  // render. Rather than edit that hardcoded ternary, this wrap hides
  // san_joy from BOND_TRACKS for the DURATION of the base call only
  // (synchronous, restored immediately after — nothing else reads
  // BOND_TRACKS in between), then renders San & Joy's own correctly-
  // labeled card itself, using the exact same template shape (tier
  // name, points-to-next-tier, synergy status, spend button) so it
  // reads identically to every other bond card on the tab.
  // -------------------------------------------------------------------

  const SAN_JOY_TIERS = [
    {threshold:0,   name:"Just Joel's Sister",     bonus:0},
    {threshold:0,   name:'Ate',                     bonus:0.02}, // tier 1 — unlocked by Arc XXXIII Ch.2 ("Ate"), not points, same mechanic as San & Joel's own Ch.4 gate
    {threshold:100, name:'Older Sister',            bonus:0.04},
    {threshold:250, name:'Family By Every Measure', bonus:0.06},
    {threshold:500, name:'Ate Joy',                 bonus:0.08}
  ];
  window.SAN_JOY_TIERS = SAN_JOY_TIERS;

  window.BOND_TRACKS = window.BOND_TRACKS || {};
  window.BOND_TRACKS.san_joy = {
    label: 'San & Joy', icon: '🌸', tiers: SAN_JOY_TIERS, members: ['san', 'ate_joy'],
    actionLabel: 'Spend time with Ate Joy', flavor: 'An ordinary afternoon together, the kind sisters have.'
  };

  function sanJoyBondUnlocked(){
    return !!(game.comicProgress33 && game.comicProgress33[2]);
  }
  window.sanJoyBondUnlocked = sanJoyBondUnlocked;

  // -------------------------------------------------------------------
  // Gate — tier 1 ("Ate") only unlocks once Arc XXXIII Ch.2 is read,
  // exactly like San & Joel's own Ch.4 gate inside the base bondTier().
  // -------------------------------------------------------------------
  const oldBondTierForSanJoy = window.bondTier;
  window.bondTier = function(trackKey){
    if (trackKey === 'san_joy' && !sanJoyBondUnlocked()) return 0;
    return oldBondTierForSanJoy ? oldBondTierForSanJoy(trackKey) : 0;
  };

  // -------------------------------------------------------------------
  // Reputation bonus — same "gold & XP" shape as San & Crew, active
  // only while Joy is actually fielded (bondSynergyActive), chaining on
  // top of the base aggregator exactly like every other bonus source.
  // -------------------------------------------------------------------
  const oldGetReputationBonusForSanJoy = window.getReputationBonus;
  window.getReputationBonus = function(statKey){
    let total = oldGetReputationBonusForSanJoy ? oldGetReputationBonusForSanJoy(statKey) : 0;
    if (typeof window.bondSynergyActive === 'function' && window.bondSynergyActive('san_joy')) {
      const def = SAN_JOY_TIERS[window.bondTier('san_joy')];
      if (def && (statKey === 'goldBonus' || statKey === 'xpBonus')) total += def.bonus;
    }
    return total;
  };

  // -------------------------------------------------------------------
  // San & Joy's own bond card — same template shape as the base loop's
  // per-track card in arc9-and-systems.js, correctly labeled.
  // -------------------------------------------------------------------
  function renderSanJoyBondCard(){
    const track = window.BOND_TRACKS.san_joy;
    const tierIdx = window.bondTier('san_joy');
    const tierDef = track.tiers[tierIdx];
    const nextTier = track.tiers[tierIdx + 1];
    const points = window.bondState ? window.bondState().san_joy.points : 0;
    const synergyActive = (typeof window.bondSynergyActive === 'function') && window.bondSynergyActive('san_joy');
    const canSpend = (typeof window.canSpendTimeOnBond === 'function') ? window.canSpendTimeOnBond('san_joy') : true;
    const gatedOut = !sanJoyBondUnlocked();
    const bonusText = tierIdx < 1 ? 'No bond yet.' : ('+' + Math.round(tierDef.bonus * 100) + '% gold & XP');
    return '<article class="quest-item"><strong>'+track.icon+' '+esc(track.label)+'</strong> — <span style="opacity:.8;">'+esc(tierDef.name)+'</span><br>'+
      '<span style="font-size:.78rem;opacity:.75;">'+bonusText+'</span><br>'+
      '<span style="font-size:.76rem;opacity:.7;">'+(synergyActive?'✅ Active right now':'⚪ Not active — bonded members must be fielded')+'</span>'+
      (nextTier ? '<br><span style="font-size:.74rem;opacity:.6;">'+points+' / '+nextTier.threshold+' to next tier</span>' : '<br><span style="font-size:.74rem;opacity:.6;">Max tier reached</span>')+
      (gatedOut
        ? '<br><span style="font-size:.76rem;opacity:.65;">🔒 Continue Arc XXXIII to unlock.</span>'
        : '<div style="margin-top:6px;"><button class="btn btn-small btn-success" '+(canSpend?'':'disabled')+' onclick="spendTimeWithBond(\'san_joy\')">💞 '+esc(track.actionLabel)+'</button></div>')+
      '</article>';
  }

  // -------------------------------------------------------------------
  // Hang Out with Ate Joy — same flavored-activity pattern as San &
  // Joel/San & Crew/San & Trio's own Hang Out panels, feeding the same
  // san_joy points/tier/daily-cap, logged through the shared
  // sharedMoments() store (scripts/hang-out-san-joel.js) tagged
  // 'san_joy'.
  // -------------------------------------------------------------------
  const HANG_OUT_JOY_ACTIVITIES = [
    {id: 'errands',    icon: '🧺', label: 'Run Errands Together', flavor: "Nothing urgent. Just two sisters getting through a list."},
    {id: 'cook_joy',   icon: '🍲', label: 'Cook Together',        flavor: "Joy has opinions about the recipe. San has none, and listens anyway."},
    {id: 'vent',       icon: '💬', label: 'Just Vent',            flavor: "Whatever's actually bothering either of them, said out loud, to someone safe."},
    {id: 'walk_joy',   icon: '🌊', label: 'Walk the Harbour',     flavor: 'No destination. Just the two of them and whatever comes up.'},
    {id: 'mama_story', icon: '🕯️', label: 'Ask About Mama',       flavor: 'Small things. Nothing San’s heard before.'},
    {id: 'quiet_tea',  icon: '🍵', label: 'Quiet Tea',            flavor: "Neither of them needs to fill the silence."}
  ];
  window.HANG_OUT_JOY_ACTIVITIES = HANG_OUT_JOY_ACTIVITIES;

  window.hangOutWithJoy = function(activityId){
    if (!sanJoyBondUnlocked()) return;
    const activity = HANG_OUT_JOY_ACTIVITIES.find(function(a){ return a.id === activityId; });
    if (!activity) return;
    if (typeof window.canSpendTimeOnBond === 'function' && !window.canSpendTimeOnBond('san_joy')) {
      toast('Already spent time on this today.');
      return;
    }
    const before = (window.bondState ? window.bondState().san_joy.lastSpentDay : null);
    window.spendTimeWithBond('san_joy', activity.icon + ' ' + activity.flavor);
    const after = (window.bondState ? window.bondState().san_joy.lastSpentDay : null);
    if (after !== before && typeof window.recordSharedMoment === 'function') {
      window.recordSharedMoment('san_joy', activityId);
    }
  };

  function hangOutJoyPanelHtml(){
    const canSpend = (typeof window.canSpendTimeOnBond === 'function') ? window.canSpendTimeOnBond('san_joy') : true;
    let html = '<div class="panel-title" style="margin-top:14px;">🌸 Hang Out with Ate Joy</div>'+
      '<article class="quest-item">'+
      '<div style="font-size:.82rem;opacity:.85;margin-bottom:8px;">Spend the afternoon with Ate Joy. This still uses today\'s San &amp; Joy time, same as above.</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
    HANG_OUT_JOY_ACTIVITIES.forEach(function(a){
      html += '<button class="btn btn-small btn-success" '+(canSpend?'':'disabled')+' onclick="hangOutWithJoy(\''+a.id+'\')">'+a.icon+' '+esc(a.label)+'</button>';
    });
    html += '</div>';
    const moments = (typeof window.sharedMomentsFor === 'function') ? window.sharedMomentsFor('san_joy') : [];
    if (moments.length) {
      html += '<div style="font-size:.74rem;opacity:.7;margin-top:10px;">🌊 Shared Moments</div>';
      html += '<div style="font-size:.72rem;opacity:.65;line-height:1.6;">';
      moments.slice(-8).reverse().forEach(function(m){
        const a = HANG_OUT_JOY_ACTIVITIES.find(function(x){ return x.id === m.id; });
        html += (a ? a.icon + ' ' + esc(a.label) : esc(m.id)) + ' <span style="opacity:.6;">(Day '+m.day+')</span><br>';
      });
      html += '</div>';
    }
    html += '</article>';
    return html;
  }

  // -------------------------------------------------------------------
  // Bonds tab wiring — hide san_joy from the base loop (see the
  // DISPLAY CAVEAT note above), render it correctly afterward, then
  // append the Hang Out panel, same append-only pattern as every other
  // Hang Out file.
  // -------------------------------------------------------------------
  const oldRenderBondsTabForSanJoy = window.renderBondsTab;
  window.renderBondsTab = function(){
    const joyTrack = window.BOND_TRACKS.san_joy;
    delete window.BOND_TRACKS.san_joy;
    if (oldRenderBondsTabForSanJoy) oldRenderBondsTabForSanJoy();
    window.BOND_TRACKS.san_joy = joyTrack;
    if (!(game.foundCompanions && game.foundCompanions.ate_joy)) return; // no card at all before Joy's actually been recruited (Arc XX) -- nothing to show yet
    const el = document.getElementById('ft-tab-bonds');
    if (!el) return;
    // The card itself is shown as soon as Joy's recruited, same as San
    // & Joel's own card before Arc V Ch.4 -- it renders its own locked
    // state internally via sanJoyBondUnlocked(). Only the Hang Out
    // activity panel is additionally gated, same separation
    // hang-out-san-joel.js uses between the base card (always visible
    // once the character exists) and its own panel.
    el.innerHTML += renderSanJoyBondCard();
    if (sanJoyBondUnlocked()) el.innerHTML += hangOutJoyPanelHtml();
  };
})();
