(function(){
  // -------------------------------------------------------------------
  // STORIES FROM OTHER WORLDS — the "Horizon Engine flavour messages
  // about previously-visited settlements" item from San's Fair Tide
  // Living World list. A thin COMPOSITION on top of two systems that
  // already exist, same spirit as tide-stories.js itself: reads
  // window.WORLD_CATALOGUE and window.worldCatalogueDiscovered()
  // (scripts/world-catalogue.js) rather than inventing new world lore
  // of its own, and surfaces one recalled detail as a Tide Story
  // (scripts/tide-stories.js) in the evening slot -- the one slot that
  // file's own comments note has no fallback source yet.
  //
  // Every recall line below paraphrases a detail that's already
  // established in that world's own WORLD_CATALOGUE entry (the tea
  // house and trade dispute from World_02, the moving crossing point
  // from World_01, the Festival of Forms from World_04, etc.) rather
  // than adding anything new to the record -- the crew remembering a
  // world they've actually been to, not a new story beat.
  //
  // Only worlds the player has actually discovered (per
  // worldCatalogueDiscovered) are eligible, same restraint as every
  // other discovery-gated system in this codebase. Veyren is excluded
  // -- it's home, not an "other world" to tell stories about.
  // -------------------------------------------------------------------

  const WORLD_RECALL_LINES = {
    world_01: [
      "Someone brings up the first world again -- the one where the crossing point itself used to move. Nobody's forgotten how close that first return was.",
      "\"Still don't know what happened to the people who lived there,\" someone says, apropos of nothing. Nobody has an answer."
    ],
    world_02: [
      "Someone's craving tea-house food again. \"World_02,\" is all they need to say.",
      "Talk turns to the fishing dispute Fair Tide helped settle there -- resolved by listening, not fighting. Still a point of quiet pride."
    ],
    world_03: [
      "Mez insists the Current Keepers would've loved this weather. Nobody's sure how she'd know.",
      "Someone mentions how the currents there are supposed to carry memory. Fair Tide's own water never does that. Probably for the best."
    ],
    world_04: [
      "Someone brings up the Festival of Forms again, half-joking that Fair Tide should try one of its own.",
      "\"Imagine naming yourself differently for every shape,\" someone says. Nobody can decide if that sounds freeing or exhausting."
    ],
    world_05: [
      "Crystal Coast comes up again -- someone still insists they saw a dragon up close, and everyone still doesn't fully believe them.",
      "Someone repeats the line from that whole trip, the one that stuck: a world isn't measured by what you can take from it."
    ],
    archive: [
      "Renn goes quiet for a moment, the way he does whenever the Archive comes up unprompted.",
      "Someone wonders aloud whether An Unfamiliar Signature will ever actually get opened. Nobody has an answer for that either."
    ]
  };

  function discoveredOtherWorlds(){
    if (!Array.isArray(window.WORLD_CATALOGUE) || typeof window.worldCatalogueDiscovered !== 'function') return [];
    return window.WORLD_CATALOGUE.filter(function(entry){
      return WORLD_RECALL_LINES[entry.key] && window.worldCatalogueDiscovered(entry);
    });
  }
  window.discoveredOtherWorldsForStories = discoveredOtherWorlds; // exposed for the vm test suite

  if (typeof window.registerTideStorySource === 'function') {
    window.registerTideStorySource({
      id: 'stories_from_other_worlds', slot: 'evening', fallback: true,
      eligible: function(){ return discoveredOtherWorlds().length > 0; },
      generate: function(){
        const worlds = discoveredOtherWorlds();
        if (!worlds.length) return null;
        const world = worlds[Math.floor(Math.random() * worlds.length)];
        const lines = WORLD_RECALL_LINES[world.key];
        const line = lines[Math.floor(Math.random() * lines.length)];
        return { icon: '🌌', title: 'Stories from Other Worlds', text: line };
      }
    });
  }
})();
