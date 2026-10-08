(function(){
  // -------------------------------------------------------------------
  // NURSERY LIFE — San's own request: once Vaeren and Joelle are born
  // (Arc XXXV Ch.9/10), San and Joel are often away on voyages, and
  // someone still has to be looking after the twins while they're gone.
  // Ate Joy is the main carer besides the parents themselves (she moves
  // back to Fair Tide once the twins arrive) — everyone else below is
  // the wider rotation around her: San's friends dropping by to play,
  // Jovie's routine Veyren-supplement rounds, and Maera (the Veyren
  // healer & midwife who first found the twins back in Arc XXII) still
  // keeping an eye on their growth.
  //
  // Deliberately NOT a new mechanic: scripts/arc35-mechanics.js is
  // explicit that the twins are not a childcare minigame (no feed/
  // soothe/play button, no stats to grind). This reuses the existing
  // ambient Flavour Events pool instead (scripts/fair-tide-flavour-
  // events.js, loaded just before this file) — the same "San's own life
  // happening between chapters" idiom already used for Rahmah/Syafiqah
  // (scripts/fair-tide-ally-network.js) — rather than inventing a
  // second ambient system or a Nursery tab that would contradict that
  // file's own header comment.
  //
  // Each entry is gated on fairTideChildrenUnlocked() plus whichever
  // character it features actually being present, so nobody shows up
  // in the pool before they've been introduced.
  // -------------------------------------------------------------------

  function twinsBorn(){
    return typeof window.fairTideChildrenUnlocked === 'function' && window.fairTideChildrenUnlocked();
  }
  function joyAvailable(){
    return twinsBorn() && typeof window.sanJoyBondUnlocked === 'function' && window.sanJoyBondUnlocked();
  }
  function companionAvailable(id){
    return twinsBorn() && !!(game.foundCompanions && game.foundCompanions[id]);
  }
  function rosterAvailable(id){
    return twinsBorn() && !!(game.fairTideRoster && game.fairTideRoster[id]);
  }

  const NURSERY_EVENTS = [
    // Ate Joy — the primary carer: feeding, singing, rocking.
    { id:'joy_feeds_both', icon:'🍼', text:'Ate Joy feeds Vaeren while Joelle insists on being fed at the exact same time — somehow, she manages both without spilling a drop.',
      eligible: joyAvailable },
    { id:'joy_lullaby', icon:'🎵', text:'Ate Joy hums an old lullaby until both twins finally settle, the same one she must have sung a hundred times by now.',
      eligible: joyAvailable },
    { id:'joy_rocks_joelle', icon:'🌙', text:'Ate Joy rocks Joelle to sleep on the porch, murmuring something only the two of them seem to understand.',
      eligible: joyAvailable },

    // San's friends, dropping by to play.
    { id:'aisyah_plays', icon:'👭', text:"Aisyah lets Vaeren grab her finger and refuses to let go either.",
      eligible: function(){ return companionAvailable('aisyah'); } },
    { id:'mez_plays', icon:'⛈️', text:'Mez tries to teach Joelle a card trick. Joelle eats the card instead.',
      eligible: function(){ return companionAvailable('mezstorm'); } },
    { id:'eliz_plays', icon:'💚', text:'Eliz sits with the twins in comfortable silence — the same quiet she gives everyone else.',
      eligible: function(){ return companionAvailable('eliz'); } },
    { id:'senedra_plays', icon:'🎯', text:'Senedra points out a bird outside the window. Vaeren is utterly unimpressed.',
      eligible: function(){ return companionAvailable('senedra'); } },

    // Jovie — injections and Veyren supplements, same brisk routine she gives everyone.
    { id:'jovie_supplements', icon:'💉', text:'Jovie makes her rounds — a Veyren supplement for each twin, measured out with the same brisk calm she gives every other patient.',
      eligible: function(){ return rosterAvailable('jovie'); } },
    { id:'jovie_checkup', icon:'🩹', text:"Jovie checks both twins over, declares them \"disgustingly healthy,\" and moves on to the next thing on her list.",
      eligible: function(){ return rosterAvailable('jovie'); } },

    // Maera — the Veyren healer & midwife from Arc XXII, still involved in their growth.
    { id:'maera_resonance', icon:'🌿', text:"Maera checks the twins' life-resonance the way she once checked San's — quietly, carefully, the same unhurried attention.",
      eligible: function(){ return rosterAvailable('maera'); } },
    { id:'maera_growth_note', icon:'📖', text:"Maera notes something new in the twins' Veyren biology today. She doesn't seem surprised. She rarely is.",
      eligible: function(){ return rosterAvailable('maera'); } }
  ];
  window.NURSERY_CARE_EVENTS = NURSERY_EVENTS;

  if (typeof window.FAIR_TIDE_FLAVOUR_EVENTS !== 'undefined') {
    window.FAIR_TIDE_FLAVOUR_EVENTS.push.apply(window.FAIR_TIDE_FLAVOUR_EVENTS, NURSERY_EVENTS);
  }
})();
