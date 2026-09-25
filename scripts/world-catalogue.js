(function(){
  // -------------------------------------------------------------------
  // WORLD CATALOGUE — per San's own confirmed spec (not this developer's
  // inference): every entry drafted from what's actually written in the
  // relevant arc's chapter text, with any field the story doesn't
  // address left "Unknown" rather than invented. Provisional names only
  // (World_01 etc.) — San was explicit these were brainstorming names,
  // not established canon, and shouldn't be forced into the database
  // ahead of the story naming them itself.
  //
  // Discovery gate: each world becomes catalogued once its arc's Ch.1 is
  // read (the actual arrival), matching how every other discovery-gated
  // system in this game works. Veyren is always known — it's home, never
  // "discovered." The Archive uses its own existing archiveDiscovered
  // flag (Ch.4, matching arc17-archive-hub.js) rather than a new one.
  //
  // 10 fields, per San's confirmed set (the doc's original 9 plus the
  // Access Classification field San added for Arc 18's "routes others
  // want"): location, accessMethod, environment, civilization,
  // resources, dangers, culture, horizonStability, archiveStatus,
  // accessClassification.
  // -------------------------------------------------------------------

  // -------------------------------------------------------------------
  // ROUTE ACCESS — Arc 18's design doc, item 2. Distinct from every
  // other field above: those are static lore, fixed once a world is
  // discovered. This one is deliberately MUTABLE — the whole point of
  // Arc 18 is that the Charter and Agreements systems change a route's
  // classification through actual story decisions, not that it's set
  // once and stays fixed. Lives in game.routeAccess (dynamic state), not
  // in the WORLD_CATALOGUE array (static data).
  //
  // Gated behind Arc 18 having actually started (comicProgress18[1]) —
  // this system has no narrative meaning before Ch.1 ("The Route We
  // Found") begins it, so it stays invisible rather than showing
  // "Unclassified" tags on worlds in a story context where nobody's
  // even raised the question yet.
  // -------------------------------------------------------------------

  const ROUTE_ACCESS_LEVELS = {
    open:        { icon: '🟢', label: 'Open Route',        desc: 'A route Fair Tide can safely use.' },
    conditional: { icon: '🟡', label: 'Conditional Route', desc: 'Requires preparation, local permission, or specific conditions.' },
    shared:      { icon: '🔵', label: 'Shared Route',      desc: 'Fair Tide has agreed to allow another trusted group to use it.' },
    restricted:  { icon: '🔴', label: 'Restricted Route',  desc: 'The crew has determined that opening it would be unsafe or unethical.' },
    sealed:      { icon: '⚫', label: 'Sealed',             desc: 'The Horizon Engine physically cannot open it.' },
    unclassified:{ icon: '⚪', label: 'Unclassified',       desc: "No formal access decision has been made yet." }
  };
  window.ROUTE_ACCESS_LEVELS = ROUTE_ACCESS_LEVELS;

  function routeAccessSystemActive(){
    return !!(game.comicProgress18 && game.comicProgress18[1]);
  }
  window.routeAccessSystemActive = routeAccessSystemActive;

  function routeAccessState(){
    game.routeAccess = game.routeAccess || {};
    return game.routeAccess;
  }

  window.routeAccessFor = function(worldKey){
    const state = routeAccessState();
    return state[worldKey] || 'unclassified';
  };

  // For future Arc 18 chapter hooks (Ch.16 draft, Ch.19 first agreement,
  // Ch.23 formal Charter, etc.) and later systems (Agreements, Dispute
  // Resolution) to call when a story decision actually changes a
  // route's classification — not meant to be called from here.
  window.setRouteAccess = function(worldKey, level, reason){
    if (!ROUTE_ACCESS_LEVELS[level]) return;
    const state = routeAccessState();
    const prior = state[worldKey] || 'unclassified';
    state[worldKey] = level;
    if (prior !== level && typeof logEvent === 'function') {
      const def = ROUTE_ACCESS_LEVELS[level];
      logEvent(def.icon + ' Route classification changed: ' + esc(worldKeyToName(worldKey)) + ' is now ' + def.label + (reason ? ' — ' + esc(reason) : ''), 'gold');
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  function worldKeyToName(worldKey){
    const entry = WORLD_CATALOGUE.find(function(w){ return w.key === worldKey; });
    return entry ? entry.name : worldKey;
  }

  const WORLD_CATALOGUE = [
    {
      key: 'veyren',
      name: 'Veyren',
      classification: 'Home World',
      icon: '🏠',
      arcOrigin: null, // always known, never "discovered"
      fields: {
        location: "Origin point of the Crimson Tide's own Horizon network. Fair Tide is located here.",
        accessMethod: 'Native — no crossing required.',
        environment: 'Home waters of the Crimson Tide and Fair Tide.',
        civilization: "Fair Tide and the wider Veyren community — the crew's own people.",
        resources: 'Timber, stone, food, and trade goods, gathered and traded through Fair Tide.',
        dangers: 'None documented as a destination-style hazard — this is home.',
        culture: "Fair Tide's own community, established from the very start of the journey.",
        horizonStability: 'Not applicable — origin point, not a crossing destination.',
        archiveStatus: 'Complete — home is fully known.',
        accessClassification: 'Open (native).'
      }
    },
    {
      key: 'world_01',
      name: 'World_01 — Abandoned Settlement',
      classification: 'Confirmed inter-world destination',
      icon: '🏚️',
      arcOrigin: 12, arcFile: 'arc10-12.js',
      fields: {
        location: 'First world reached beyond Veyren via the Horizon Engine (Arc XII).',
        accessMethod: "Horizon Engine. The crossing point itself was later found not to be fixed — it shifted, which nearly stranded the expedition and prompted the crew's first return-anchor protocols.",
        environment: "Coastal. The sea behaves differently from Veyren's own — waves move wrong, tides run out of sync with what the crew expects, and time itself passes at a slightly different rate. Local water and some plants are magically incompatible with Veyren's own biology.",
        civilization: 'None present. A coastal settlement — homes, a harbour, a small marketplace — left behind, not destroyed. No people ever encountered.',
        resources: 'Largely untested. Local water and food were deemed unsafe and deliberately left alone rather than catalogued.',
        dangers: "The boundary/crossing point itself was unstable — a genuine risk of being stranded. No hostile presence was ever documented.",
        culture: 'Unknown. The local written language never resolved into anything readable, and with no living people encountered, there was no one to learn it from directly.',
        horizonStability: 'Unstable — the crossing point itself moved, confirmed directly in-story (Ch.14, Ch.17).',
        archiveStatus: 'Partial. The first Inter-World Expedition Protocol was written from this trip, but the language, resources, and what became of the people who lived here all remain undocumented.',
        accessClassification: 'Unknown — no formal classification established in-story.'
      }
    },
    {
      key: 'world_02',
      name: 'World_02 — Unknown Harbour',
      classification: 'Confirmed inter-world destination',
      icon: '⚓',
      arcOrigin: 13, arcFile: 'arc13-harbour.js',
      fields: {
        location: 'Second world reached via the Horizon Engine (Arc XIII).',
        accessMethod: 'Horizon Engine. Formal visitor registration and docking status granted by local harbour officials.',
        environment: 'A developed, lived-in coastal harbour — ships, docks, a marketplace, ordinary commerce. Local writing resembles Chinese characters in shape, though the meanings and combinations aren\'t directly readable.',
        civilization: 'Confirmed. An organized, governed community with its own docking procedures, permits, and etiquette — family structures, neighbours, and shared community responsibilities much like anywhere else.',
        resources: 'Fishing goods, cloth, tea, and everyday market commerce. A small, genuine trade agreement was established by the end of the visit.',
        dangers: 'None documented. The one real conflict encountered was a dispute between two local groups over trade routes and fishing grounds — resolved peacefully, through listening rather than combat.',
        culture: "Actively developing in the record — tea-house hospitality, community traditions, and a real history behind the local dispute the crew helped mediate. A working (not fluent) shared vocabulary was built.",
        horizonStability: 'Unknown — never explicitly addressed in-story.',
        archiveStatus: 'Partial. Vocabulary and writing remain incomplete, but trade relations and a real cultural understanding were established.',
        accessClassification: 'Open — visitor and trade status formally granted by local authorities.'
      }
    },
    {
      key: 'world_03',
      name: 'World_03 — Underwater Civilization',
      classification: 'Confirmed inter-world destination',
      icon: '🌊',
      arcOrigin: 14, arcFile: 'harbour-and-arc14.js',
      fields: {
        location: 'Third world reached via the Horizon Engine (Arc XIV).',
        accessMethod: 'Horizon Engine to reach the world; entering the underwater settlement itself requires specific equipment and designated routes.',
        environment: 'Underwater, built entirely around water movement and current — designated surface meeting areas connect it to the world above.',
        civilization: 'Confirmed. An organized aquatic civilization, including dedicated "Current Keepers" whose knowledge of the sea is part scientific, part spiritual, and very old.',
        resources: 'Fishing, crafts, and shared waterways used for trade, travel, and gathering across multiple communities.',
        dangers: 'Shifting, disturbed currents — a natural, gradual change accumulated over generations rather than any hostile threat. Resolved through shared understanding rather than force.',
        culture: 'Currents are understood to carry memory, emotion, and spiritual residue — treated as an ordinary part of how the sea works, not as "magic." Multiple communities share overlapping responsibility for the same waters.',
        horizonStability: 'Unknown — never explicitly addressed in-story.',
        archiveStatus: 'Partial. Strong cultural and community understanding was built, though not exhaustive.',
        accessClassification: 'Unknown — no formal classification established in-story.'
      }
    },
    {
      key: 'world_04',
      name: 'World_04 — Werewolf World',
      classification: 'Confirmed inter-world destination',
      icon: '🐺',
      arcOrigin: 15, arcFile: 'arc15-and-voyage-fixes.js',
      fields: {
        location: 'Fourth world reached via the Horizon Engine (Arc XV).',
        accessMethod: 'Horizon Engine.',
        environment: 'Forest and settled community. Architecture — doorways, furniture, clothing, public spaces — is built around the ability to transform, not adapted afterward.',
        civilization: "Confirmed. Shapeshifting people for whom transformation is entirely natural, unstigmatized within their own community. A separate, non-shapeshifting neighbouring community also lives nearby.",
        resources: 'Not specifically documented in the record.',
        dangers: 'None from the shapeshifters themselves. The real tension was generations-old fear from the neighbouring community, rooted in a small historical incident exaggerated over time into "history" — resolved peacefully.',
        culture: 'Transformation-centered — a community festival (the Festival of Forms), varied per-person naming conventions across forms, and genuinely differing individual attitudes within the community itself about contact with outsiders and tradition versus change.',
        horizonStability: 'Unknown — never explicitly addressed in-story.',
        archiveStatus: 'Partial. Substantial cultural understanding was built, though not exhaustive.',
        accessClassification: 'Unknown — no formal classification established in-story.'
      }
    },
    {
      key: 'world_05',
      name: 'World_05 — Dragon / Resource World',
      classification: 'Confirmed inter-world destination',
      icon: '🐉',
      arcOrigin: 16, arcFile: 'arc16-and-bonding.js',
      fields: {
        location: 'Fifth world reached via the Horizon Engine (Arc XVI). Contains five known settlements: Forest Coast, Dragon Coast, Mountain Port, Crystal Coast, and Old Harbour.',
        accessMethod: 'Horizon Engine to the world itself, then inter-harbour voyages between its settlements.',
        environment: 'Varied — forest coastline, mountainous dragon territory, mining regions, a crystal-bearing coastline, and an older, historic settlement holding the region\'s deeper history.',
        civilization: 'Confirmed. Multiple distinct settlements, including a dragon population woven directly into how the region functions rather than guarding treasure as isolated monsters.',
        resources: 'A rare material needed for the Horizon Engine\'s next upgrade — the arc\'s central resource, most directly surfacing at Crystal Coast. Mining and geology are Mountain Port\'s own focus.',
        dangers: 'Territorial wildlife, dragons included — protective of their territory rather than malicious.',
        culture: "Resource ethics is this world's defining theme in the record: \"a world isn't measured by what we can take from it, and discovery doesn't have to mean possession.\"",
        horizonStability: 'Unknown — never explicitly addressed in-story.',
        archiveStatus: 'Partial. Five settlements explored directly; Dragon Territory and the Mountain Interior remain known but unvisited regions.',
        accessClassification: 'Unknown — no formal classification established in-story.'
      }
    },
    {
      key: 'archive',
      name: 'The Archive',
      classification: "Inter-world structure / ancient archive — not conventionally a world",
      icon: '🏛️',
      arcOrigin: 17, arcFile: 'arc17.js', useArchiveDiscoveredFlag: true,
      fields: {
        location: "Suspended beyond the boundary itself — reached by following a structured signal embedded directly in the boundary, not a conventional destination crossing.",
        accessMethod: 'Archive gateway — located via the signal itself, distinct from a normal Horizon crossing to a destination world.',
        environment: 'A vast, largely abandoned structure — records, maps, instruments, boundary measurements, sealed doors. Homes, schools, and workshops confirm people once lived here, not merely studied here.',
        civilization: "The Archive's original civilization is no longer present, scattered by what its own records call the Great Separation. Renn is confirmed to be part of its final generation.",
        resources: 'Knowledge and historical record — route information, not material resources in the usual sense.',
        dangers: 'Sealed and restricted areas exist within the Archive itself. The full extent of any danger remains unknown; nothing actively hostile has been encountered.',
        culture: "A civilization that studied the connections between worlds themselves, and deliberately closed its own doors after uncontrolled access led some toward treating other worlds as resources rather than places people actually lived.",
        horizonStability: 'Unknown — never explicitly addressed in-story.',
        archiveStatus: "Partial. Six Archive Records recovered and Renn's own origin confirmed, but at least one sealed record — An Unfamiliar Signature — remains genuinely unopened.",
        accessClassification: "Conditional — the Archive itself grants access selectively. It recognized Renn as belonging to its own civilization; other parts remain sealed."
      }
    }
  ];
  window.WORLD_CATALOGUE = WORLD_CATALOGUE;

  function worldCatalogueDiscovered(entry){
    if (entry.key === 'veyren') return true; // always known
    if (entry.useArchiveDiscoveredFlag) return !!game.archiveDiscovered;
    const progressKey = 'comicProgress' + entry.arcOrigin;
    game[progressKey] = game[progressKey] || {};
    return !!game[progressKey][1]; // discovered once that arc's Ch.1 is read
  }
  window.worldCatalogueDiscovered = worldCatalogueDiscovered;

  function worldCatalogueState(){
    return WORLD_CATALOGUE.filter(worldCatalogueDiscovered);
  }
  window.worldCatalogueState = worldCatalogueState;

  const FIELD_LABELS = [
    ['location', 'Location'], ['accessMethod', 'Access Method'], ['environment', 'Environment'],
    ['civilization', 'People / Civilization'], ['resources', 'Resources'], ['dangers', 'Known Dangers'],
    ['culture', 'Cultural Information'], ['horizonStability', 'Horizon Stability'],
    ['archiveStatus', 'Archive Status'], ['accessClassification', 'Access Classification']
  ];

  function renderWorldCatalogueEntry(entry){
    let html = '<article class="quest-item"><div style="display:flex;gap:10px;align-items:flex-start;">'+
      '<div style="font-size:1.5rem;">'+entry.icon+'</div><div style="flex:1;">'+
      '<strong>'+esc(entry.name)+'</strong><br>'+
      '<span style="font-size:.74rem;opacity:.6;">'+esc(entry.classification)+'</span>'+
      '<div style="margin-top:6px;">';
    FIELD_LABELS.forEach(function(pair){
      const key = pair[0], label = pair[1];
      html += '<div style="margin-top:4px;"><span style="font-size:.72rem;opacity:.55;">'+esc(label)+':</span> '+
        '<span style="font-size:.78rem;opacity:.85;">'+esc(entry.fields[key])+'</span></div>';
    });
    if (routeAccessSystemActive()) {
      const level = window.routeAccessFor(entry.key);
      const def = ROUTE_ACCESS_LEVELS[level];
      html += '<div style="margin-top:6px;padding-top:6px;border-top:1px solid rgba(255,255,255,.08);">'+
        '<span style="font-size:.72rem;opacity:.55;">Route Access:</span> '+
        '<span class="story-chip">'+def.icon+' '+esc(def.label)+'</span><br>'+
        '<span style="font-size:.74rem;opacity:.7;">'+esc(def.desc)+'</span></div>';
    }
    html += '</div></div></div></article>';
    return html;
  }

  function renderWorldCataloguePanel(){
    const entries = worldCatalogueState();
    if (!entries.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🌍 World Catalogue</div>'+
      '<p style="font-size:.78rem;opacity:.6;margin-bottom:8px;">'+entries.length+' / '+WORLD_CATALOGUE.length+' known.</p>';
    entries.forEach(function(entry){ html += renderWorldCatalogueEntry(entry); });
    return html;
  }
  window.renderWorldCataloguePanel = renderWorldCataloguePanel;

  const oldRenderArchiveScreenForCatalogue = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForCatalogue) oldRenderArchiveScreenForCatalogue();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('worldCataloguePanelWrap');
    if (existing) existing.remove();
    const panel = renderWorldCataloguePanel();
    if (!panel) return;
    container.insertAdjacentHTML('beforeend', '<div id="worldCataloguePanelWrap">'+panel+'</div>');
  };
})();
