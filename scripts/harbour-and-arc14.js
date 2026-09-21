
(function(){
  // -------------------------------------------------------------------
  // THE HARBOUR — a genuinely separate location type from the existing
  // Port system, per San's own framing: not "another port," but an
  // unidentified place the player has to learn how to use, section by
  // section, as the story reveals it. Built as its own screen with its
  // own header state (UNKNOWN HARBOUR -> real name once learned), not
  // reusing any Port UI. Unlocked by Arc XIII Ch.1 (harbourDiscovered).
  //
  // Only Dock and Local Information are open from Ch.1, matching San's
  // own proposed default state exactly, including the specific locked-
  // section flavor text San wrote for Market/Trade/Requests/Guesthouse.
  // Provisions and Shipwright weren't given specific locked text, so
  // I've written reasonable matching lines for those two.
  //
  // Deliberately NOT wiring any unlock triggers for the locked sections
  // yet — that depends on story chapters San hasn't provided. This
  // exposes window.unlockHarbourSection(key) as the hook for whenever
  // those chapters land, rather than inventing fake unlock conditions.
  // -------------------------------------------------------------------
  const HARBOUR_SECTIONS = [
    {key:'dock', name:'Dock', icon:'⚓', lockedText: null},
    {key:'local_info', name:'Local Information', icon:'📜', lockedText: null},
    {key:'explore', name:'Explore', icon:'🧭', lockedText: null},
    {key:'market', name:'Market', icon:'🏪', lockedText: '🔒 Not yet established'},
    {key:'trade', name:'Trade', icon:'💰', lockedText: '🔒 No trading relationship'},
    {key:'requests', name:'Requests', icon:'📋', lockedText: '🔒 No local requests available'},
    {key:'guesthouse', name:'Guesthouse', icon:'🏨', lockedText: '🔒 No accommodation arranged'},
    {key:'shipwright', name:'Shipwright', icon:'🔨', lockedText: '🔒 No one here works on Crimson Tide ships yet'}
  ];
  window.HARBOUR_SECTIONS = HARBOUR_SECTIONS;

  // Narrative relationship tiers, per San's explicit direction — not a
  // numerical reputation meter. Advances at story beats San's own
  // chapter-range breakdown maps onto: first Request (11-20 range) ->
  // Recognised Guests, the locals' own Agreement (21-22 range moving
  // toward it) -> Trusted Visitors, first Trade (21-22, "relationships
  // and first trade") -> Friends / Trade Partners.
  const HARBOUR_RELATIONSHIP_TIERS = ['New Visitors', 'Recognised Guests', 'Trusted Visitors', 'Friends / Trade Partners'];
  window.HARBOUR_RELATIONSHIP_TIERS = HARBOUR_RELATIONSHIP_TIERS;
  window.advanceHarbourRelationship = function(){
    const hs = harbourState();
    const idx = HARBOUR_RELATIONSHIP_TIERS.indexOf(hs.relationship);
    if (idx >= 0 && idx < HARBOUR_RELATIONSHIP_TIERS.length - 1) {
      hs.relationship = HARBOUR_RELATIONSHIP_TIERS[idx + 1];
    }
  };

  function harbourState(){
    game.harbourState = game.harbourState || {
      nameKnown: false, name: null, worldName: null, relationship: 'New Visitors',
      sections: {dock:true, local_info:true, explore:true, market:false, trade:false, requests:false, guesthouse:false, shipwright:false}
    };
    // Migration for saves created before this update — fill in anything
    // missing rather than requiring a fresh state.
    const hs = game.harbourState;
    if (hs.relationship === undefined) hs.relationship = 'New Visitors';
    if (hs.worldName === undefined) hs.worldName = null;
    if (hs.sections.explore === undefined) hs.sections.explore = true;
    delete hs.sections.provisions;
    return game.harbourState;
  }
  window.harbourState = harbourState;

  window.harbourUnlocked = function(){
    return !!game.harbourDiscovered;
  };

  // Hook for future story content — not called from anywhere yet.
  window.unlockHarbourSection = function(key){
    const hs = harbourState();
    if (hs.sections[key] !== undefined) hs.sections[key] = true;
  };
  window.setHarbourName = function(name){
    const hs = harbourState();
    hs.name = name;
    hs.nameKnown = true;
  };

  let harbourActiveSection = 'dock';
  window.switchHarbourSection = function(key){
    const hs = harbourState();
    if (!hs.sections[key]) { toast('That part of the harbour isn\'t open to them yet.'); return; }
    harbourActiveSection = key;
    window.renderHarbourScreen();
  };

  window.renderHarbourScreen = function(){
    const titleEl = document.getElementById('harbourHeaderTitle');
    const subEl = document.getElementById('harbourHeaderSubtitle');
    const container = document.getElementById('harbourContent');
    if (!container) return;
    const hs = harbourState();
    if (titleEl) titleEl.textContent = hs.nameKnown ? ('⚓ ' + hs.name) : '⚓ UNKNOWN HARBOUR';
    if (subEl) subEl.textContent = hs.nameKnown ? 'A place the crew is starting to know' : 'Location not yet identified';

    let html = '<div class="tabs" style="flex-wrap:wrap;">';
    HARBOUR_SECTIONS.forEach(function(sec){
      const unlocked = hs.sections[sec.key];
      html += '<button class="tab-btn'+(harbourActiveSection===sec.key?' active':'')+'" '+
        (unlocked ? 'onclick="switchHarbourSection(\''+sec.key+'\')"' : 'disabled style="opacity:.45;cursor:not-allowed;"') +
        '>'+sec.icon+' '+sec.name+'</button>';
    });
    html += '</div><div class="panel" style="margin-top:10px;">';

    const activeDef = HARBOUR_SECTIONS.find(s => s.key === harbourActiveSection);
    if (!hs.sections[harbourActiveSection]) {
      html += '<div class="story-chip">'+(activeDef?activeDef.lockedText:'🔒 Not available yet')+'</div>';
    } else if (harbourActiveSection === 'dock') {
      html += '<div class="panel-title">⚓ The Dock</div>'+
        '<p style="font-size:.85rem;opacity:.85;">Ships everywhere. Fishermen working the lines, merchants unloading cargo, children weaving between the crates like this is just an ordinary afternoon — because for them, it is.</p>';
    } else if (harbourActiveSection === 'local_info') {
      const tradeEstablished = !!hs.sections.trade;
      const customsLearned = hs.relationship === HARBOUR_RELATIONSHIP_TIERS[HARBOUR_RELATIONSHIP_TIERS.length - 1];
      html += '<div class="panel-title">📜 Local Information</div>'+
        '<div style="font-size:.85rem;line-height:1.8;">'+
        'Location: <strong>Unknown</strong><br>'+
        'World: <strong>'+(hs.worldName || 'Unknown')+'</strong><br>'+
        'Settlement: <strong>'+(hs.nameKnown ? hs.name : 'Unknown')+'</strong><br>'+
        'Local Customs: <strong>'+(customsLearned ? 'Learned' : 'Unknown')+'</strong><br>'+
        'Trade Status: <strong>'+(tradeEstablished ? 'Established' : 'None')+'</strong><br>'+
        'Relationship: <strong>'+hs.relationship+'</strong>'+
        '</div>';
    } else if (harbourActiveSection === 'explore') {
      html += '<div class="panel-title">🧭 Explore</div>'+
        '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">Streets they don\'t know yet, in a city that was never waiting for them.</p>';
      ['dockside_pickpockets','lantern_smugglers','harbor_floor_scavengers','overzealous_tollkeeper','restless_shrine_guardian'].forEach(function(key){
        const e = scaledEnemyForExplore(key, 'harbor');
        html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.6rem;">'+e.icon+'</div><div style="flex:1;"><strong>'+e.name+'</strong><br>'+
          '<span style="font-size:.8rem;opacity:.8;">'+e.desc+'</span><br>'+
          '<span style="font-size:.8rem;">'+e.hp+' HP · '+e.xp+' XP · '+e.gold+'g · Lv.'+e.scaledFromLevel+'</span></div>'+
          '<button class="btn btn-small btn-combat" onclick="startHarborFight(\''+key+'\', \'harbour_explore\')">Fight</button></div></article>';
      });
    } else {
      html += '<div class="panel-title">'+(activeDef?activeDef.icon+' '+activeDef.name:'')+'</div>'+
        '<p style="font-size:.85rem;opacity:.7;">Nothing here yet.</p>';
    }
    html += '</div>';
    container.innerHTML = html;
  };

  const oldRenderNavigationForHarbour = window.renderNavigation;
  window.renderNavigation = function(){
    if (oldRenderNavigationForHarbour) oldRenderNavigationForHarbour();
    const grid = document.getElementById('navPortGrid');
    if (!grid || !window.harbourUnlocked()) return;
    const hs = harbourState();
    grid.insertAdjacentHTML('beforeend',
      '<div class="port-card" style="cursor:pointer;border-color:rgba(120,200,255,.5);border-style:dashed;" onclick="goScreen(\'harbour\')">'+
      '<div style="font-size:1.6rem;">⚓</div><div style="font-weight:600;">'+(hs.nameKnown?hs.name:'Unknown Harbour')+'</div>'+
      '<div style="font-size:.72rem;opacity:.7;">Not one of the known ports.</div></div>');
  };

  const oldGoScreenForHarbour = window.goScreen;
  window.goScreen = function(name){
    if (oldGoScreenForHarbour) oldGoScreenForHarbour(name);
    if (name === 'harbour' && typeof window.renderHarbourScreen === 'function') window.renderHarbourScreen();
  };
})();


(function(){
  // -------------------------------------------------------------------
  // ARC XIV — PEOPLE BENEATH THE TIDE. Chapters 1-5 wired (Part I,
  // "Something Beneath the Water," complete) — the Tide Network mechanic
  // itself (current mapping, Spiritual Current, the whole aquatic
  // parallel to the Harbour system) is deliberately NOT built yet
  // either; that's real, separate work for later. This is narrative-only
  // so far, matching the standard arc-wiring pattern exactly.
  // Gated behind arc13Complete + level 210, continuing the +15/arc pace.
  // -------------------------------------------------------------------
  const ARC14_CHAPTERS = [
    {id:1, title:'The Water Moves', focus:"The Crimson Tide encounters an unusual current — it doesn't behave like an ordinary ocean current at all. Renn's instruments pick up movement beneath the ship. Soel notices before anyone else does.", image:'assets/comics/arc14/ch01-the-water-moves.png', xp:280, action:'🌊 Investigate the Current'},
    {id:2, title:'Beneath the Surface', focus:"The crew spots structures below the water — not ruins, homes. Lights move beneath the surface, and something appears to be watching the ship. This may be another civilization entirely.", image:'assets/comics/arc14/ch02-beneath-the-surface.png', xp:280, action:'👁️ Look Below'},
    {id:3, title:'The Ones Beneath', focus:"The first aquatic people approach — intelligent, organized, cautious, and not hostile. They just want to know one thing: why is the Crimson Tide traveling through their waters?", image:'assets/comics/arc14/ch03-the-ones-beneath.png', xp:300, action:'🤝 Answer Their Question'},
    {id:4, title:'A Different Kind of Harbour', focus:"An underwater settlement, connected to the surface by designated meeting areas — markets, docks, homes, gathering places. Joel is fascinated by how the whole place is designed around water movement.", image:'assets/comics/arc14/ch04-a-different-kind-of-harbour.png', xp:290, action:'🏙️ Tour the Settlement'},
    {id:5, title:'Learning to Enter', focus:"Visiting isn't as simple as breathing underwater — there are rules, equipment, currents, designated routes. San realizes even entering someone's home has rules.", image:'assets/comics/arc14/ch05-learning-to-enter.png', xp:290, action:'🤿 Learn the Way In'},
    {id:6, title:'Their Way of Life',        focus:"The crew spends time just watching ordinary life — families, children, fishing, crafts, food, trade, education. Nobody here is mysterious. They're just people, living somewhere the crew has never lived before.", image:'assets/comics/arc14/ch06-their-way-of-life.png', xp:280, action:'🐟 Observe Their Life'},
    {id:7, title:'The Current Keepers',      focus:"The crew meets those responsible for monitoring the sea currents — knowledge part scientific, part magical. Renn is fascinated. Erynn recognizes their understanding of the sea is extremely old.", image:'assets/comics/arc14/ch07-the-current-keepers.png', xp:300, action:'🌊 Meet the Current Keepers'},
    {id:8, title:'Soel Sees Something Else', focus:"Soel starts reacting to certain currents the way he used to react to boundaries — still, watching something nobody else can see. Mimi senses the currents carry more than physical movement.", image:'assets/comics/arc14/ch08-soel-sees-something-else.png', xp:300, action:'👁️ Watch Soel Watching'},
    {id:9, title:'The Spirit Current',       focus:"The aquatic people explain that some currents carry memory, emotion, and spiritual residue — not magic to them, just part of how the sea works. It gives Soel's abilities a context nobody's offered him before.", image:'assets/comics/arc14/ch09-the-spirit-current.png', xp:320, action:'💫 Learn of the Spirit Current'},
    {id:10, title:'What the Sea Remembers',  focus:"Soel follows a spirit current, and San briefly sees an impression beneath the water — not a monster, not a weapon, but a memory of people who once traveled these waters.", image:'assets/comics/arc14/ch10-what-the-sea-remembers.png', xp:350, action:'🌊 Follow the Current'},
    {id:11, title:'A Disturbed Current',     focus:"One section of the settlement is fighting unusual currents — boats pushed off course, fishing grounds harder to reach. The locals ask the Crimson Tide for help.", image:'assets/comics/arc14/ch11-a-disturbed-current.png', xp:300, action:'🌀 Investigate the Currents'},
    {id:12, title:'The Wrong Question',      focus:"Renn assumes an underwater obstruction. The locals correct him — this isn't a simple physical problem. Several communities depend on the same current, and it's more complicated than a blockage.", image:'assets/comics/arc14/ch12-the-wrong-question.png', xp:300, action:'❓ Ask Again'},
    {id:13, title:'Many Communities, One Sea', focus:"Different communities share the same waterways for fishing, travel, gathering, trade, and spiritual practice. What looked like one current to San is actually a network of overlapping responsibilities.", image:'assets/comics/arc14/ch13-many-communities-one-sea.png', xp:310, action:'🗺️ Map the Network'},
    {id:14, title:'The Old Route',           focus:"Erynn finds an ancient, long-unused navigation route beneath the settlement. Its existence may explain why the currents have started behaving differently.", image:'assets/comics/arc14/ch14-the-old-route.png', xp:310, action:'🧭 Trace the Old Route'},
    {id:15, title:'What Changed?',           focus:"Nothing was destroyed. A reef shifted. An old passage narrowed. A current diverted. Small, gradual changes, accumulated over generations, until the sea itself worked differently.", image:'assets/comics/arc14/ch15-what-changed.png', xp:320, action:'🔍 Piece It Together'},
    {id:16, title:"Soel's Path",             focus:"Soel follows the spiritual current deeper than anyone else safely can, and finds where the spiritual and physical currents actually intersect. The two problems were never separate.", image:'assets/comics/arc14/ch16-soels-path.png', xp:340, action:'🐾 Follow Soel Down'},
    {id:17, title:"We Can't Move the Sea", focus:"San considers whether magic could solve this outright. The locals explain why they don't simply alter the current — changing one current would affect several other communities downstream. San recognizes the shape of it immediately: the same lesson from Arc XIII, wearing different water. A solution that works for one group can harm another.", image:'assets/comics/arc14/ch17-we-cant-move-the-sea.png', xp:300, action:'🌊 Weigh the Cost'},
    {id:18, title:'What They Already Know', focus:"The crew stops trying to invent a solution and asks the locals what they've already tried. Old records surface — forgotten methods for navigating waters exactly like these, worked out by people who lived with this problem long before Crimson Tide arrived.", image:'assets/comics/arc14/ch18-what-they-already-know.png', xp:290, action:'📜 Read the Old Records'},
    {id:19, title:'The Path Everyone Can Use', focus:"Joel works directly with the local boat crews. Not changing the sea — building a safer shared route through it: timing, navigation markers, designated passage windows, shared information between communities. A very Joel solution.", image:'assets/comics/arc14/ch19-the-path-everyone-can-use.png', xp:300, action:'🧭 Chart the Route'},
    {id:20, title:'The Sea Belongs to Everyone', focus:"The different communities discuss the proposed arrangement. Some agree immediately. Others have real concerns. The crew facilitates, but doesn't decide — the locals make the final call. Arc XIII's lesson, continuing in a new environment.", image:'assets/comics/arc14/ch20-the-sea-belongs-to-everyone.png', xp:300, action:'🗣️ Hear Every Voice'},
    {id:21, title:'A Shared Current', focus:'The communities reach a new agreement. The current isn\'t controlled — it\'s understood and shared. The aquatic people thank Crimson Tide, but San is clear about where the credit belongs: "You solved it. We just helped you find the pieces."', image:'assets/comics/arc14/ch21-a-shared-current.png', xp:320, action:'🤝 Confirm the Agreement'},
    {id:22, title:'What Soel Found', focus:"The aquatic people describe what Soel actually is to them — not one of their own people, not quite an ordinary surface animal either. They don't know exactly what he is. But they understand, clearly, that he can perceive spiritual currents. Another small piece of a mystery that's still nowhere near solved.", image:'assets/comics/arc14/ch22-what-soel-found.png', xp:320, action:'🐾 Listen to What They Say'},
    {id:23, title:'Beneath the Same Sky', focus:"One final day with the aquatic civilization — food, storytelling, trading, real cultural exchange. San notices that despite living beneath the sea, these people worry about the same things anyone does: family, work, community, home.", image:'assets/comics/arc14/ch23-beneath-the-same-sky.png', xp:300, action:'🍽️ Share the Day'},
    {id:24, title:'People Beneath the Tide', focus:'The crew prepares to leave. Soel looks back toward the water. San watches the underwater lights fade beneath the waves. "We thought the sea separated worlds," she says. "It doesn\'t. It connects them. Some people simply live on the other side of the surface." The Crimson Tide sails onward.', image:'assets/comics/arc14/ch24-people-beneath-the-tide.png', xp:540, action:'⚓ Sail Onward'}
  ];
  window.ARC14_CHAPTERS = ARC14_CHAPTERS;

  window.arc14ObjectiveState = function(){
    if (!game.arc13Complete) return null;
    if (level() < 210) return null;
    game.comicProgress14 = game.comicProgress14 || {};
    for (const ch of ARC14_CHAPTERS) {
      if (!game.comicProgress14[ch.id]) return 'complete_arc14_chapter_' + ch.id;
    }
    return 'arc14_part1_complete_for_now';
  };

  const ARC14_CHAPTER_SCENES = {
    1: "The Crimson Tide encounters an unusual current.<br><br>It doesn't behave like an ordinary ocean current.<br><br>Renn's instruments detect movement beneath the ship.<br><br>Soel notices it before anyone else.",
    2: "The structures are unmistakable once anyone actually looks properly. Not ruins, not wreckage — homes, built to last, sitting where nobody expected anything to be built at all.<br><br>Lights move beneath the surface in patterns too deliberate to be current or fish. Something down there is watching the ship, and everyone on deck can feel it.<br><br>Nobody says the word out loud right away, but the thought is unavoidable. They may have just found another civilization — one that's been below them the entire time.",
    3: "The first ones surface without warning, and without hostility either.<br><br>They move with an organization that makes it obvious immediately — this isn't a chance encounter with wildlife. These are people, cautious but not afraid, sizing the ship up with the same care the crew is using to size them up.<br><br>They don't demand anything. They ask one question, plainly, and wait for an answer.<br><br>\"Why are you travelling through our waters?\"",
    4: "What waits beneath the surface isn't a ruin or a curiosity — it's a working settlement, markets and docks and homes, gathering places built exactly where they need to be.<br><br>The whole design follows the water instead of fighting it. Joel can't stop studying how naturally the place moves with the current instead of against it, the same instinct he respects in a well-built hull.<br><br>Every part of it says the same thing: people have been living here, comfortably, for a very long time.",
    5: "Getting in isn't as simple as holding your breath and diving down.<br><br>There's proper equipment. Marked routes. Currents that have to be respected rather than fought through. A whole procedure the crew has to actually learn before anyone will let them near the settlement itself.<br><br>San takes it in without complaint, turning the lesson over once out loud.<br><br>\"Even entering someone's home has rules.\"",
    6: "The crew spends time just watching ordinary life happen.<br><br>Families going about their day. Children playing somewhere between the currents. People crafting, fishing, trading, teaching their own the way any community teaches its own.<br><br>Nobody here is mysterious. Nobody's a creature to be studied from a careful distance. They're just people, living somewhere the crew has never lived before.",
    7: "The crew meets the people responsible for watching the sea's currents — reading them, understanding them, knowing what each shift and pull actually means.<br><br>Their knowledge is part science, part something closer to magic, though they don't always draw a hard line between the two.<br><br>Renn is fascinated almost immediately. Erynn recognizes something else entirely: whatever this understanding is, it's old. Far older than anything the Farseers ever wrote down.",
    8: "Soel starts reacting to certain currents the way he used to react to boundaries — ears back, entirely still, watching something nobody else in the room can see.<br><br>Mimi picks up on it fast. Whatever's moving through those currents, it isn't just water.",
    9: "The aquatic people have an explanation ready, offered without any drama attached to it: some currents carry more than water. Memory. Emotion. Spiritual residue, left behind by whoever or whatever passed through.<br><br>They don't necessarily call it magic. To them, it's simply part of how the sea works — the same way weather is part of how the sky works.<br><br>For Soel, it's the first real context anyone's ever given his abilities that didn't come from a Farseer record or a guess.",
    10: "Soel follows one of the spirit currents on his own, and for just a moment, San sees it too — an impression, faint and old, of something beneath the water.<br><br>Not a monster. Not a weapon.<br><br>A memory. People who once traveled these waters, long enough ago that even the current keepers only half-remember them.<br><br>It fades before San can hold onto it. It doesn't fade from Soel.",
    11: "One corner of the settlement has been struggling for a while now. Boats keep getting pushed off their line. Fishing grounds that used to be a short pull away now take twice the effort to reach.<br><br>It isn't an emergency, not yet. It's the kind of problem that just keeps quietly getting worse, the kind people eventually stop being able to work around on their own.<br><br>So they ask the Crimson Tide for help — not as a test, just because the crew is here, and capable, and willing.",
    12: "Renn's first guess is the obvious one: something's blocking the current, physically, somewhere upstream. A straightforward problem with a straightforward fix.<br><br>The locals are patient correcting him. It isn't that simple. This current doesn't belong to just one community — whatever's wrong with it is wrong for everyone who depends on it, in different ways, for different reasons.<br><br>Renn's right question turns out to be a different question entirely.",
    13: "It takes a while for the shape of it to become clear. The same stretch of water that looks like a single current to San is actually carrying a dozen different responsibilities at once — fishing here, travel there, gathering somewhere else, trade routes, even spiritual practice woven through parts of it.<br><br>Nobody owns the current outright. Everyone just has their own claim on a piece of it, and all those claims depend on the whole thing working the way it always has.",
    14: "Erynn is the one who finds it — a navigation route beneath the settlement, old enough that nobody currently living remembers using it.<br><br>It isn't in use anymore. That much is obvious. What's less obvious, and far more interesting, is that its existence might explain exactly why the current everyone depends on has started behaving so differently.<br><br>Old things left alone don't always stay harmless.",
    15: "Nothing here was destroyed. That's almost the hardest part to explain to the people asking for help — there's no single villain, no single event to point to.<br><br>A reef shifted, slowly, over years nobody was counting. An old passage narrowed a little more each season. A current found a slightly different path and never found its way back.<br><br>None of it happened all at once. All of it added up anyway, generation by generation, until the sea itself was quietly working differently than everyone still assumed it did.",
    16: "Soel goes further down than anyone else can safely manage, following the spiritual current past the point where the rest of the crew has to stop and wait.<br><br>What he finds down there settles the question everyone's been circling. The spiritual current and the physical one don't just run near each other — they actually intersect, right at the same place the old route and the shifted reef both lead back to.<br><br>Two problems. One place. Never actually separate at all.",
    17: "San considers whether magic could just solve this outright.<br><br>The locals explain, patiently, why they don't do that. Changing one current doesn't stay contained to one current — it moves, and it reaches communities nobody in this conversation even represents.<br><br>San recognizes the shape of the lesson immediately. She's heard it before, in a different harbour, in a different world.<br><br>A solution that works for one group can genuinely harm another. That hasn't stopped being true just because the water's different this time.",
    18: "The crew stops trying to invent something clever.<br><br>Instead, they ask the obvious question they'd somehow skipped: what have you already tried?<br><br>Old records surface — methods worked out generations ago, by people who lived with exactly this problem long before Crimson Tide ever sailed into these waters. Forgotten, not because they failed, but because nobody had asked about them in a long time.",
    19: "Joel doesn't try to change the sea. He works with the people who already know it.<br><br>Alongside the local boat crews, a shared route starts taking shape — not a fix, just a way through: timing, navigation markers, designated passage windows, information passed openly between communities instead of guarded.<br><br>Nothing magical about it. Just logistics, patience, and people who actually know their own water being asked what would help.",
    20: "The different communities sit down together to discuss what's being proposed.<br><br>Some agree almost immediately. Others have real, unresolved concerns — old friction that a shared route alone won't erase.<br><br>Crimson Tide facilitates the conversation. It doesn't decide the outcome. That part belongs to the people who'll actually live with it — the same lesson from the harbour, still holding true out here.",
    21: "The communities reach an agreement of their own.<br><br>The current isn't controlled. It's understood, and it's shared — which turns out to be the part that actually mattered.<br><br>The aquatic people thank Crimson Tide for their part in it. San doesn't let the credit land where it doesn't belong.<br><br>\"You solved it,\" she says. \"We just helped you find the pieces.\"",
    22: "The aquatic people try to explain what they saw in Soel, and end up circling the same uncertainty the crew already lives with.<br><br>Not one of their own people. Not quite an ordinary surface animal either.<br><br>They don't know exactly what he is. Nobody does. But they're certain about the one thing that actually matters here — he can perceive spiritual currents the way none of them can, surface-dweller or not.<br><br>One more small piece, set down next to all the others that still don't add up to an answer.",
    23: "One last day with the aquatic civilization, and nobody rushes it.<br><br>Food gets shared. Stories get traded, half-translated and laughed over anyway. Small trades happen without anyone calling them trades.<br><br>San watches all of it and notices something simple: for people who live beneath an entire sea, the things they actually worry about aren't so different. Family. Work. Community. Home.",
    24: "The crew prepares to leave.<br><br>Soel looks back toward the water, one long moment before he turns away from it.<br><br>San watches the underwater lights fade beneath the waves, already growing harder to see.<br><br>\"We thought the sea separated worlds,\" she says.<br><br>\"It doesn't.\"<br><br>\"It connects them.\"<br><br>\"Some people simply live on the other side of the surface.\"<br><br>The Crimson Tide sails onward."
  };
  window.ARC14_CHAPTER_SCENES = ARC14_CHAPTER_SCENES;

  window.markArc14ChapterRead = function(id){
    id = Number(id);
    const ch = ARC14_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc14] no chapter data for id', id); return; }
    game.comicProgress14 = game.comicProgress14||{};
    if(game.comicProgress14[id]){ toast('✓ Already marked read.'); return; }
    if(window.arc14ObjectiveState() !== 'complete_arc14_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress14[id] = true;
    if (id === 1) game.tideNetworkDiscovered = true; // unlocks the Tide Network location itself
    if (id === 4 && typeof window.unlockTideNetworkSection === 'function') window.unlockTideNetworkSection('underwater_market'); // "A Different Kind of Harbour" — scene text: "markets and docks and homes"
    if (id === 6 && typeof window.unlockTideNetworkSection === 'function') window.unlockTideNetworkSection('community'); // "Their Way of Life" — scene text: "Families... community... teaching their own"
    if (id === 11 && typeof window.unlockTideNetworkSection === 'function') window.unlockTideNetworkSection('fishing_grounds'); // "A Disturbed Current" — scene text explicitly says "Fishing grounds"
    if (id === 13 && typeof window.unlockTideNetworkSection === 'function') window.unlockTideNetworkSection('requests'); // "Many Communities, One Sea" — multiple communities' overlapping needs becoming visible
    if (id === 19 && typeof window.unlockTideNetworkSection === 'function') window.unlockTideNetworkSection('tide_routes'); // "The Path Everyone Can Use" — scene text: "shared route... timing, navigation markers, designated passage windows"
    if (id === 9) game.soelSpiritCurrentContext = true; // new framing for Soel's abilities, from outside the Farseer records entirely
    if (id === 22) game.soelRecognizedAsUnusual = true; // the aquatic people's own read on him — not one of theirs, not an ordinary surface animal, origin still unknown
    if (id === 24) game.arc14Complete = true;
    gainXP(ch.xp);
    game.reputation = (game.reputation||0) + 1;
    logEvent('📖 Arc XIV Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if (ARC14_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC14_CHAPTER_SCENES[id] });
    }
    if (typeof renderMainGoal === 'function') try { renderMainGoal(); } catch(e) {}
    if (typeof renderStory === 'function') try { renderStory(); } catch(e) {}
  };

  window.__ctShowArc14Splash = function(){
    const overlay = document.getElementById('arc14SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc14Splash = function(){
    const overlay = document.getElementById('arc14SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc14SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc14 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc14) oldRenderStoryForArc14();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc14Ready = window.arc14ObjectiveState() !== null;
    if (arc14Ready && !game.arc14SplashSeen && typeof window.__ctShowArc14Splash === 'function') {
      window.__ctShowArc14Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<div class="story-act-kicker">Arc XIV</div><div class="story-act-title">People Beneath the Tide</div>'+
      '<div class="story-act-tagline">The sea is not empty. It is home to someone.</div></div>';
    if (!arc14Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XIV Locked</div><div class="story-chapter-sub">'+
        (!game.arc13Complete ? 'Finish Arc XIII first.' : 'Reach Level 210 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc14ObjectiveState();
    ARC14_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress14 && game.comicProgress14[ch.id]);
      const ready = !done && so===('complete_arc14_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
        '<button class="btn btn-small btn-success" onclick="markArc14ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc14_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XIV chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();


(function(){
  // -------------------------------------------------------------------
  // REMOTE ACCESS TO FAIR TIDE. Confirmed the Hub was previously only
  // reachable via its Explore tab while physically docked there — no
  // location-independent entry existed at all. This adds one, framed as
  // San checking in and issuing instructions from wherever Crimson Tide
  // actually is.
  //
  // Split per San's own "assign and check" framing: Dispatch, Requests,
  // Buildings, Roster, and Trade are administrative and stay open
  // remotely. Clinic (healing), Training Room (sparring), Captain's
  // Quarters (resting), Uncharted Reach (combat — the party has to be
  // there fighting), Bonds (quality time), and Research Expedition (San/
  // Joel/Soel physically leave on it) all require being at Fair Tide in
  // person — flagged as a judgment call, easy to adjust if San wants a
  // different split.
  //
  // Uses a one-shot "intent" flag consumed by renderFairTideHub() rather
  // than touching any of the existing goScreen('fairtide') call sites —
  // renderFairTideHub() already runs on every visit regardless of how
  // the screen was reached, so this needs no changes to how the Hub is
  // normally entered.
  // -------------------------------------------------------------------
  const REMOTE_RESTRICTED_TABS = ['clinic', 'training', 'quarters', 'uncharted', 'bonds', 'expedition'];

  window.remoteAccessUnlocked = function(){
    return typeof window.arc13ObjectiveState === 'function' && window.arc13ObjectiveState() !== null;
  };

  window.enterFairTideRemotely = function(){
    if (!window.remoteAccessUnlocked()) { toast('🔒 Not yet available.'); return; }
    game.fairTideEnteringRemotely = true;
    goScreen('fairtide');
  };

  const oldRenderFairTideHubForRemote = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    if (game.fairTideEnteringRemotely) {
      game.fairTideRemoteAccessMode = true;
      game.fairTideEnteringRemotely = false;
    } else {
      game.fairTideRemoteAccessMode = false;
    }
    if (oldRenderFairTideHubForRemote) oldRenderFairTideHubForRemote();
    const header = document.getElementById('fairTideSpiritDisplay');
    if (header && game.fairTideRemoteAccessMode) {
      header.insertAdjacentHTML('afterend',
        '<div id="remoteAccessBanner" style="text-align:center;font-size:.78rem;opacity:.85;background:rgba(120,180,255,.12);border:1px solid rgba(120,180,255,.35);border-radius:8px;padding:6px 10px;margin:6px 0 10px;">'+
        '📡 Remote Access — checking in from wherever Crimson Tide currently is.</div>');
    } else {
      const stale = document.getElementById('remoteAccessBanner');
      if (stale) stale.remove();
    }
  };

  const oldSwitchFairTideTabForRemote = window.switchFairTideTab;
  window.switchFairTideTab = function(tab){
    if (game.fairTideRemoteAccessMode && REMOTE_RESTRICTED_TABS.includes(tab)) {
      toast('🔒 Requires being at Fair Tide in person.');
      return;
    }
    return oldSwitchFairTideTabForRemote(tab);
  };

  const oldRenderNavigationForRemote = window.renderNavigation;
  window.renderNavigation = function(){
    if (oldRenderNavigationForRemote) oldRenderNavigationForRemote();
    const grid = document.getElementById('navPortGrid');
    if (!grid || !window.remoteAccessUnlocked()) return;
    grid.insertAdjacentHTML('beforeend',
      '<div class="port-card" style="cursor:pointer;border-color:rgba(120,180,255,.5);" onclick="enterFairTideRemotely()">'+
      '<div style="font-size:1.6rem;">📡</div><div style="font-weight:600;">Remote Access</div>'+
      '<div style="font-size:.72rem;opacity:.7;">Check in on Fair Tide from here.</div></div>');
  };
})();
