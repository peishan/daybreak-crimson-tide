(function(){
  // -------------------------------------------------------------------
  // GROOMING ROOM — a small just-for-fun room at Fair Tide where Soel
  // (San's own spirit cat, established since Arc I Chapter 1 — see
  // fair-tide-soel-sightings.js) gets brushed. Purely flavor: feeds the
  // same shared Fair Tide Mood counter every other cosmetic interaction
  // already uses (fair-tide-mood.js), capped once per in-game day so it
  // never becomes a thing worth grinding — same cadence as restAtTavern/
  // freeRestAtPort's own daily cap, just its own separate flag rather
  // than sharing game.freeRestDay (grooming a cat isn't resting a crew).
  //
  // Added to REMOTE_RESTRICTED_TABS in harbour-and-arc14.js: brushing a
  // cat isn't something you can do by radio, same reasoning as Clinic/
  // Training/Quarters/Uncharted/Bonds/Expedition. This file must load
  // BEFORE harbour-and-arc14.js (see index.html) so that file's remote-
  // access wrap ends up outermost and can actually reset a stale
  // 'grooming' active tab before this one's own wrap ever reads it —
  // same ordering every other restricted tab already relies on.
  // -------------------------------------------------------------------
  const GROOMING_LINES = [
    "Soel endures the brush with the patience of something much older than a cat.",
    "He doesn't purr. He simply stops looking like he's about to leave.",
    "Soel tilts his head exactly once, which is as close to thanks as he gives anyone.",
    "For a few minutes, the fur is smooth, the room is quiet, and nothing on this voyage feels urgent.",
    "He allows it the way he allows most things: like it was always going to happen, and he merely consented first.",
    "Soel closes his eyes. Whatever he's watching for, it isn't here right now."
  ];

  window.groomSoel = function(){
    if (game.lastGroomedDay === game.day) {
      toast('Soel has had quite enough fussing for one day.');
      return;
    }
    game.lastGroomedDay = game.day;
    const line = GROOMING_LINES[Math.floor(Math.random() * GROOMING_LINES.length)];
    if (typeof window.addFairTideMood === 'function') window.addFairTideMood(3);
    logEvent('🪮 ' + line, 'good');
    toast('🐾 ' + line, 4200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  const oldRenderFairTideHubForGrooming = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-grooming');
    const btn = document.getElementById('ft-tab-btn-grooming');
    if (el) el.classList.toggle('active', tab === 'grooming');
    if (btn) btn.classList.toggle('active', tab === 'grooming');
    if (oldRenderFairTideHubForGrooming) oldRenderFairTideHubForGrooming();
    if (tab === 'grooming') renderGroomingTab();
  };

  function renderGroomingTab(){
    const el = document.getElementById('ft-tab-grooming');
    if (!el) return;
    const alreadyGroomed = game.lastGroomedDay === game.day;
    let html = '<div class="panel-title">🪮 Grooming Room</div>'+
      '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">A quiet corner of Fair Tide, set aside for brushes, warm water, and however long Soel decides to tolerate being fussed over. Nobody remembers whose idea it was. Soel has never objected to its existence, which from him is a kind of endorsement.</p>'+
      '<article class="quest-item"><strong>🐾 Groom Soel</strong><br>'+
      '<span style="font-size:.8rem;opacity:.8;">Once per day · +3 Fair Tide Mood · Soel\'s patience is not guaranteed but is, historically, available.</span><br>'+
      (alreadyGroomed
        ? '<span style="font-size:.76rem;opacity:.65;margin-top:4px;display:inline-block;">Already groomed today. He has limits.</span>'
        : '<button class="btn btn-small btn-success" style="margin-top:6px;" onclick="groomSoel()">🪮 Groom Soel</button>')+
      '</article>';
    el.innerHTML = html;
  }
})();
