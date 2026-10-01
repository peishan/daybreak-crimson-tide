(function(){
  // -------------------------------------------------------------------
  // SOEL SIGHTINGS — the tap-interaction item from San's Fair Tide
  // Living World list: "Soel Sightings (eventually Nala too)". Soel is
  // San's own spirit cat, established from Arc I Chapter 1 (core-
  // engine.js's own ALL_PARTY entry: "The ship's cat. Chose San, and
  // can't be unchosen.") — not a character introduced later, so he's
  // sightable from the very start of any save, no unlock gate at all.
  // Arc XXXV/XXXVI's "Soel Watch"/"Soel Guardian" extends his existing
  // spirit-sensing ability to the twins; it's an upgrade of something
  // already established about him, not his introduction. Nala is
  // Senedra's tower cat, already a Fair Tide roster member (scripts/
  // arc9-and-systems.js, game.fairTideRoster.nala).
  //
  // Whether each cat is spotted today, and where, is chosen
  // deterministically from the real calendar date -- same reasoning as
  // every other real-date system in this codebase (veyren-weather.js,
  // real-calendar-events.js): every player who opens the game on the
  // same real day sees the same cat in the same spot, with no
  // randomness to desync between sessions or devices, and no clock
  // trick that can re-roll a sighting by changing the date mid-day.
  //
  // The actual "tap interaction": when a cat is sighted today, the
  // panel offers a Pet button. Petting grants a small one-time Fair
  // Tide Mood bonus for the day -- guarded by the real date key (not a
  // claimed year, since this isn't an annual reward, but the same
  // spirit: no re-petting the same sighting for repeat Mood by
  // replaying the day). The very first time EVER a given cat is
  // sighted, that moment gets a permanent Chronicle entry; later
  // sightings don't re-log (the Chronicle records firsts, not routine
  // repeats -- same restraint fair-tide-chronicle.js and
  // settlement-memories.js already apply).
  // -------------------------------------------------------------------

  function currentRealDate(){
    return (typeof window.__ctNow === 'function') ? window.__ctNow() : new Date();
  }

  function dateKey(date){
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  function dateSeed(date){
    return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  }

  function hashString(s){
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000;
    return h;
  }

  const CREATURES = {
    soel: {
      id: 'soel', name: 'Soel', icon: '🐾',
      eligible: function(){ return true; }, // San's own cat, present since Arc I Chapter 1 -- never gated
      locations: [
        'napping in a sunbeam on the ship\'s deck',
        'curled up in San\'s sea-chest like he owns it, because he does',
        'perched on the harbour wall, watching the horizon the way he always has',
        'following Joel around the docks, having apparently decided he\'s acceptable too',
        'draped across a stack of folded laundry that was definitely not his to sleep on'
      ],
      pettingLine: 'Soel allows it, which from him counts as enthusiasm.'
    },
    nala: {
      id: 'nala', name: 'Nala', icon: '🐈',
      eligible: function(){ return !!(game.fairTideRoster && game.fairTideRoster.nala); },
      locations: [
        'curled up on Senedra\'s tower windowsill',
        'stalking something invisible along the tower stairs',
        'sprawled dramatically across Senedra\'s open books',
        'sitting at the tower\'s highest window, watching the ships come in',
        'guarding the tower doorway like it was her idea to be a guardian'
      ],
      pettingLine: 'Nala tolerates it for exactly as long as she decides to.'
    }
  };
  window.FAIR_TIDE_SIGHTING_CREATURES = CREATURES;

  function soelSightingsState(){
    if (!game.creatureSightings) game.creatureSightings = { everSighted: {}, pets: {}, lastPettedKey: {} };
    return game.creatureSightings;
  }
  window.soelSightingsState = soelSightingsState;

  function sightedToday(creature){
    if (!creature.eligible()) return false;
    const seed = dateSeed(currentRealDate()) + hashString(creature.id);
    return (seed % 3) === 0; // roughly one day in three
  }

  function todaysCreatureSighting(id){
    const creature = CREATURES[id];
    if (!creature || !sightedToday(creature)) return null;
    const seed = dateSeed(currentRealDate()) + hashString(creature.id + '_loc');
    const location = creature.locations[seed % creature.locations.length];
    return { id: creature.id, name: creature.name, icon: creature.icon, location: location };
  }
  window.todaysCreatureSighting = todaysCreatureSighting;

  function recordFirstSightingIfNew(creature){
    const state = soelSightingsState();
    if (state.everSighted[creature.id]) return;
    state.everSighted[creature.id] = true;
    const sighting = todaysCreatureSighting(creature.id);
    if (sighting && typeof window.recordChronicleEntry === 'function') {
      window.recordChronicleEntry(creature.icon + ' ' + creature.name + ' was spotted ' + sighting.location + ' today — the first time anyone wrote it down.', creature.icon);
    }
  }

  window.petFairTideCat = function(id){
    const creature = CREATURES[id];
    if (!creature) return;
    const sighting = todaysCreatureSighting(id);
    if (!sighting) return; // not actually sighted today -- nothing to pet
    const state = soelSightingsState();
    const key = dateKey(currentRealDate());
    if (state.lastPettedKey[id] === key) return; // already petted today's sighting
    state.lastPettedKey[id] = key;
    state.pets[id] = (state.pets[id] || 0) + 1;
    recordFirstSightingIfNew(creature);
    if (typeof window.addFairTideMood === 'function') window.addFairTideMood(3);
    toast(creature.icon + ' ' + creature.pettingLine, 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  function renderSoelSightingsPanel(){
    const state = soelSightingsState();
    const key = dateKey(currentRealDate());
    let body = '';
    Object.keys(CREATURES).forEach(function(id){
      const sighting = todaysCreatureSighting(id);
      if (!sighting) return;
      const alreadyPetted = state.lastPettedKey[id] === key;
      body += '<article class="quest-item"><strong>'+sighting.icon+' '+esc(sighting.name)+' was spotted</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(sighting.location)+'.</span><br>'+
        (alreadyPetted
          ? '<span style="font-size:.76rem;opacity:.65;margin-top:4px;display:inline-block;">You already said hello today.</span>'
          : '<button class="btn btn-small" style="margin-top:6px;" onclick="petFairTideCat(\''+id+'\')">'+sighting.icon+' Pet '+esc(sighting.name)+'</button>')+
        '</article>';
    });
    if (!body) return '';
    return '<div class="panel-title" style="margin-top:16px;">🐈 Soel Sightings</div>' + body;
  }
  window.renderSoelSightingsPanel = renderSoelSightingsPanel;

  const oldRenderArchiveScreenForSoelSightings = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForSoelSightings) oldRenderArchiveScreenForSoelSightings();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('soelSightingsPanelWrap');
    if (existing) existing.remove();
    const panel = renderSoelSightingsPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="soelSightingsPanelWrap">'+panel+'</div>');
  };
})();
