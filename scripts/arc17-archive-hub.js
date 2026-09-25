(function(){
  // -------------------------------------------------------------------
  // ARC XVII — THE ARCHIVE HUB + ARCHIVE RECORDS. First slice of San's
  // mechanics doc for this arc, matching how Arc XVI's mechanics were
  // built (Resource Codex, then World Network, as separate focused
  // passes) rather than the whole doc at once. Deliberately NOT built
  // yet, left for later passes per that doc: World Catalogue, Route
  // Records, the Research system, Evidence/corroboration states, the
  // Farseer comparison layer, Renn's Origin as its own tracked
  // progression UI, Sealed Records, the ancient route map, crew
  // expertise contributions, phone integration, the Fair Tide Archive
  // building. Building only Hub + Records now, and building them
  // correctly, matters more than covering the whole doc thinly.
  //
  // Discovery: game.archiveDiscovered is already set at Ch.4 ("The
  // Archive Between Worlds") by arc17.js. No separate voyage/sail
  // mechanic — unlike Harbour/Tide Network/Clan Settlement, the doc
  // never describes one for the Archive, and the story itself has the
  // crew reach it via the Horizon Engine's signal, not a normal
  // crossing — so it's reached directly via goScreen('archive') once
  // discovered, same as how the Fountain of Youth is reached once its
  // own flag is set.
  // -------------------------------------------------------------------

  window.archiveUnlocked = function(){ return !!game.archiveDiscovered; };

  // -----------------------------------------------------------------
  // ARCHIVE RECORDS. Per the doc: "a specialized harbour... but it
  // isn't a normal settlement. The Archive gives you knowledge, history
  // and access." Records are story-tied, not generic placeholders —
  // each one tracks an actual thread from this arc's 25 chapters, and
  // progresses Unknown -> Observed -> Verified -> Archived at the exact
  // chapters where the story itself reveals that much. Per the doc:
  // "this shouldn't be a simple completionist encyclopedia where
  // everything is automatically filled in" — a record with no progress
  // yet doesn't even appear in the list, rather than showing as a
  // permanently-blank placeholder.
  // -----------------------------------------------------------------

  const ARCHIVE_RECORDS = [
    {
      key: 'the_signal',
      category: 'Magical phenomenon',
      icon: '📡',
      name: 'The Signal',
      stages: {
        1: { status: 'Observed', note: 'A structured signal embedded directly in the boundary — not a world, not a normal Horizon.' },
        3: { status: 'Verified', note: 'The signal was never a destination. It was pointing at something suspended beyond the boundary entirely.' },
        4: { status: 'Archived', note: 'Confirmed source: the Archive itself, still transmitting after everything else around it fell silent.' }
      }
    },
    {
      key: 'the_archive',
      category: 'Ancient technology',
      icon: '🏛️',
      name: 'The Archive',
      stages: {
        3: { status: 'Observed', note: 'An enormous structure suspended beyond the boundary, apparently abandoned — but something inside is still running.' },
        4: { status: 'Verified', note: 'Records, maps, instruments, boundary measurements, sealed doors. A civilization that studied the connections between worlds themselves.' },
        8: { status: 'Archived', note: "Not merely an institution. There were homes here, schools, workshops, families — somewhere people lived, not just studied." }
      }
    },
    {
      key: 'farseer_origin',
      category: 'Farseer reference',
      icon: '📜',
      name: 'The Farseer Inheritance',
      stages: {
        2: { status: 'Observed', note: "A symbol within the signal, related to Farseer markings — but older than anything in the Farseer Archives." },
        12: { status: 'Verified', note: "The Archive predates the Farseer tradition entirely. The Farseers were preservers and interpreters of something older, not its originators." }
      }
    },
    {
      key: 'renns_civilization',
      category: 'Civilization',
      icon: '👤',
      name: "Renn's Civilization",
      stages: {
        9: { status: 'Observed', note: "A name remarkably close to Renn's, in an old record. Then another. Different records, different dates — the same family line." },
        18: { status: 'Verified', note: "Direct records confirming Renn came from this world, part of the final generation connected to the Archive." },
        23: { status: 'Archived', note: "The Archive recognizes Renn — not as a chosen hero, but as someone belonging to the civilization that built it. Access restored." }
      }
    },
    {
      key: 'the_great_separation',
      category: 'Historical event',
      icon: '⚠️',
      name: 'The Great Separation',
      stages: {
        15: { status: 'Observed', note: 'The most important part of the Archive was deliberately removed, not merely lost — concerning the final period of this civilization.' },
        16: { status: 'Verified', note: 'The civilization grew dependent on inter-world travel. Different factions disagreed, sharply, over how it should be used.' },
        22: { status: 'Archived', note: "Inter-world travel itself was never the problem. Uncontrolled access was — some began treating other worlds as resources rather than places inhabited by people." }
      }
    },
    {
      key: 'the_door_connection',
      category: 'Horizon route',
      icon: '🚪',
      name: 'The Door (Arc VII)',
      stages: {
        13: { status: 'Verified', note: "The mysterious Door wasn't an isolated phenomenon. It was one piece of an ancient network Renn had unknowingly been connected to long before she understood it." }
      }
    },
    {
      // Sealed Records, per the design doc: "some information should
      // literally be inaccessible... this prevents Arc 17 from dumping
      // the entire history of inter-world travel on the player." This
      // one demonstrates the doc's first variant — discovered sealed,
      // later unseals within the same arc. Deliberately kept distinct
      // from renns_civilization above rather than duplicating its Ch.23
      // recognition beat: this record is about the sealing mechanism
      // itself (Ch.15's removal, Ch.21's chamber), not the recognition
      // narrative renns_civilization already covers.
      key: 'renns_sealed_pages',
      category: 'Sealed Record',
      icon: '🔒',
      name: 'The Missing Pages',
      stages: {
        15: { status: 'Sealed', sealReason: 'Historical restriction', note: "Something here concerns Renn specifically — deliberately removed, not merely lost. The Archive isn't saying why yet." },
        21: { status: 'Observed', note: "The sealed chamber, opened. What was hidden here was never dangerous. Just personal — records the civilization chose to keep close, until someone who belonged to it came looking." }
      }
    },
    {
      // Second variant: discovered sealed, and deliberately never
      // unseals within Arc XVII at all — the doc's own "some answers
      // remain for later arcs." Directly the arc's own final-scene hook
      // (Ch.25: "a system that hasn't activated in thousands of years
      // suddenly detects another Horizon signature. Not from Veyren.").
      key: 'unknown_signal',
      category: 'Horizon route',
      icon: '🔒',
      name: 'An Unfamiliar Signature',
      stages: {
        25: { status: 'Sealed', sealReason: 'Unknown access condition', note: "A dormant system just detected something. Not from Veyren. The Archive doesn't seem to know what it's looking at — or isn't saying." }
      }
    }
  ];
  window.ARCHIVE_RECORDS = ARCHIVE_RECORDS;

  const STATUS_ORDER = ['Observed', 'Verified', 'Archived'];

  function archiveRecordsState(){
    const progress = (game.comicProgress17 || {});
    return ARCHIVE_RECORDS.map(function(rec){
      let current = null;
      const notes = [];
      Object.keys(rec.stages).map(Number).sort(function(a,b){return a-b;}).forEach(function(chapterId){
        if (progress[chapterId]) {
          current = rec.stages[chapterId];
          notes.push(rec.stages[chapterId]);
        }
      });
      return { key: rec.key, category: rec.category, icon: rec.icon, name: rec.name, status: current ? current.status : null, note: current ? current.note : null, sealReason: current ? current.sealReason : null, history: notes };
    }).filter(function(r){ return r.status !== null; }); // undiscovered records don't appear at all — not a blank encyclopedia
  }
  window.archiveRecordsState = archiveRecordsState;

  function renderArchiveRecordsPanel(){
    const records = archiveRecordsState();
    let html = '<div class="panel-title">📚 Archive Records</div>';
    if (!records.length) {
      html += '<p style="font-size:.85rem;opacity:.7;">Nothing recorded yet.</p>';
      return html;
    }
    records.forEach(function(r){
      if (r.status === 'Sealed') {
        html += '<article class="quest-item" style="border-color:rgba(200,80,80,.4);"><div style="display:flex;gap:10px;align-items:flex-start;">'+
          '<div style="font-size:1.4rem;">'+r.icon+'</div>'+
          '<div style="flex:1;"><strong>'+esc(r.name)+'</strong> <span class="story-chip" style="background:rgba(200,80,80,.22);">🔒 Sealed</span><br>'+
          '<span style="font-size:.72rem;opacity:.6;">'+esc(r.category)+' — '+esc(r.sealReason)+'</span><br>'+
          '<span style="font-size:.8rem;opacity:.85;">'+esc(r.note)+'</span></div></div></article>';
        return;
      }
      const statusIdx = STATUS_ORDER.indexOf(r.status);
      const statusChip = r.status === 'Archived' ? '<span class="story-chip" style="background:rgba(120,200,140,.25);">✓ Archived</span>' :
                          r.status === 'Verified' ? '<span class="story-chip" style="background:rgba(200,180,100,.25);">Verified</span>' :
                          '<span class="story-chip">Observed</span>';
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:flex-start;">'+
        '<div style="font-size:1.4rem;">'+r.icon+'</div>'+
        '<div style="flex:1;"><strong>'+esc(r.name)+'</strong> '+statusChip+'<br>'+
        '<span style="font-size:.72rem;opacity:.6;">'+esc(r.category)+'</span><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(r.note)+'</span></div></div></article>';
    });
    return html;
  }
  window.renderArchiveRecordsPanel = renderArchiveRecordsPanel;

  // -----------------------------------------------------------------
  // THE HUB SCREEN ITSELF. Only two sections exist this pass (Enter
  // Archive / overview, and Archive Records) — deliberately not listing
  // the doc's other named sections (World Catalogue, Research, Renn's
  // Origin, Sealed Records, Route Records, Archive Map) as locked tabs
  // yet, since that was the exact bug found and fixed for Harbour two
  // turns ago: sections that "unlock" but have no real content behind
  // them, showing an empty placeholder forever. A short note at the
  // bottom says more is coming instead.
  // -----------------------------------------------------------------

  window.renderArchiveScreen = function(){
    const container = document.getElementById('archiveContent');
    if (!container) return;
    let html = '<div class="panel-title">🏛️ The Archive Between Worlds</div>'+
      '<p style="font-size:.85rem;opacity:.8;line-height:1.5;">Not a settlement. Not a harbour. A structure suspended beyond the boundary, built by a civilization that studied the connections between worlds themselves — and, though none of the crew knew it yet on arrival, the place Renn came from.</p>';
    html += renderArchiveRecordsPanel();
    html += '<p style="font-size:.74rem;opacity:.55;margin-top:12px;">More of the Archive — its Catalogue, Research, and deeper Records — will open up as the crew learns more.</p>';
    container.innerHTML = html;
  };

  const oldRenderNavigationForArchive = window.renderNavigation;
  window.renderNavigation = function(){
    if (oldRenderNavigationForArchive) oldRenderNavigationForArchive();
    const grid = document.getElementById('navPortGrid');
    if (!grid || !window.archiveUnlocked()) return;
    grid.insertAdjacentHTML('beforeend',
      '<div class="port-card" style="cursor:pointer;border-color:rgba(200,160,255,.5);border-style:dashed;" onclick="goScreen(\'archive\')">'+
      '<div style="font-size:1.6rem;">🏛️</div><div style="font-weight:600;">The Archive</div>'+
      '<div style="font-size:.72rem;opacity:.7;">Suspended beyond the boundary.</div></div>');
  };

  const oldGoScreenForArchive = window.goScreen;
  window.goScreen = function(name){
    if (oldGoScreenForArchive) oldGoScreenForArchive(name);
    if (name === 'archive' && typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };
})();
