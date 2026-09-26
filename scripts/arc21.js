(function(){
  // -------------------------------------------------------------------
  // ARC XXI — THE LIFE WE BUILD. Chapters 1-16 wired — Part I ("Fair
  // Tide Needs a Plan"), Part II ("The Harbour"), Part III ("The People
  // Who Keep Fair Tide Running"), and Part IV ("The Horizon Network").
  // Gated at arc20Complete + level 315, continuing the established
  // +15-per-arc ladder (XVIII:270, XIX:285, XX:300, XXI:315).
  //
  // Per the design doc, Ch.12 is explicit that Joy's Warden role is
  // storyline-based and does NOT consume a field slot — she isn't
  // becoming a normal fielded combat unit. That distinction is written
  // directly into the Ch.12 scene text (San is "careful about the
  // distinction"). Same scope note as always: no actual Warden System,
  // Route Observatory, Horizon Chamber, or Route Preparation mechanic
  // exists in code yet — every building referenced through Ch.16 is
  // narrative only, per the top-of-file scope note above.
  //
  // IMPORTANT SCOPE NOTE: per the design doc, Arc XXI is meant to
  // introduce twelve new Fair Tide buildings and nine real gameplay
  // systems (Fair Tide Development, Council Decisions, Supply
  // Management, Workshop, Warden assignments, Route Map, Horizon
  // Chamber, Route Preparation, the Fair Tide Ledger). NONE of that is
  // built here. This file only wires the story chapters — no building
  // unlock flags, no new screens, no new game.* state beyond the
  // standard comicProgress21 tracking every arc file uses. Chapters
  // reference buildings narratively (the Council Hall existing "in
  // story" by Ch.3, for instance) without that being backed by any
  // actual game system yet. Building the real mechanics is a separate,
  // much larger task for later — flagged explicitly so it isn't
  // mistaken for having been done as a side effect of chapter wiring.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (ch0N-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC21_CHAPTERS = [
    {id:1, title:'The Harbour That Grew', focus:"San returns to Fair Tide after another voyage to find everything working, but barely — people keep coming to her with questions. Joel realizes they need real infrastructure, not just storage.", image:'assets/comics/arc21/ch01-the-harbour-that-grew.png', xp:290, action:'🏗️ Look Around'},
    {id:2, title:'Too Many Decisions', focus:"San spends an entire day dealing with cargo, repairs, merchants, travellers, crew requests, route information, and disputes, and finally realizes: \"I can't be the answer to everything.\"", image:'assets/comics/arc21/ch02-too-many-decisions.png', xp:290, action:'📋 Face the Decisions'},
    {id:3, title:'The Council Hall', focus:"Fair Tide establishes its first dedicated civic building — a place for settlement decisions, community representatives, construction, trade disputes, and harbour concerns, without replacing San as captain.", image:'assets/comics/arc21/ch03-the-council-hall.png', xp:310, action:'🏛️ Build the Council Hall'},
    {id:4, title:'Everyone Has a Voice', focus:"The first proper council meeting takes place. San discovers people who live and work at Fair Tide have very different priorities. San leads Fair Tide, but Fair Tide belongs to more people than San.", image:'assets/comics/arc21/ch04-everyone-has-a-voice.png', xp:300, action:'🗣️ Let Them Speak'},
    {id:5, title:'The Harbour Office', focus:"With increasing traffic, the harbour needs organisation. The Harbour Office becomes the central location for incoming and departing ships, docking, cargo declarations, harbour traffic, and visiting crews.", image:'assets/comics/arc21/ch05-the-harbour-office.png', xp:300, action:'⚓ Organize the Harbour'},
    {id:6, title:'Ships Coming and Going', focus:"A number of ships arrive simultaneously. Fair Tide has reached the point where informal docking arrangements aren't enough — a small, mostly slice-of-life chapter with some comedy.", image:'assets/comics/arc21/ch06-ships-coming-and-going.png', xp:280, action:'🚢 Set the Rules'},
    {id:7, title:'The Market Quarter', focus:"Trade has grown enough that merchants are operating in scattered areas. Fair Tide formalises the area into a proper commercial district — merchant stalls, travelling vendors, trade requests, local and imported goods.", image:'assets/comics/arc21/ch07-the-market-quarter.png', xp:300, action:'🛍️ Formalize the Market'},
    {id:8, title:'The Supply House', focus:"Fair Tide's various businesses need somewhere to coordinate shared supplies — settlement materials, construction resources, expedition supplies, emergency reserves, bulk storage. San learns that having resources isn't the same as managing them.", image:'assets/comics/arc21/ch08-the-supply-house.png', xp:300, action:'📦 Build the Supply House'},
    {id:9, title:'The Medical House', focus:"Jovie and the medical-support crew have increasingly more people coming to them. Fair Tide establishes a real space for healing support, medicine storage, treatment, recovery, and medical supplies.", image:'assets/comics/arc21/ch09-the-medical-house.png', xp:300, action:'🏥 Build the Medical House'},
    {id:10, title:'The Workshop', focus:"Caelan becomes involved as Fair Tide establishes a space for equipment repair, ship components, tools, mechanical projects, and maintenance — giving his eventual field role a real connection to Fair Tide.", image:'assets/comics/arc21/ch10-the-workshop.png', xp:300, action:'⚒️ Open the Workshop'},
    {id:11, title:"Caelan's First Job", focus:"Caelan is given a real, deliberately mundane Fair Tide assignment — he solves it, then gets asked to fix three other things, and realizes: \"I may have made a mistake.\"", image:'assets/comics/arc21/ch11-caelans-first-job.png', xp:290, action:'🔧 Give Him a Job'},
    {id:12, title:"The Warden's Hall", focus:"Fair Tide now has enough people passing through that someone needs to coordinate safety and settlement security. Ate Joy becomes associated with the Warden's function — a storyline role, not a fielded combat slot.", image:'assets/comics/arc21/ch12-the-wardens-hall.png', xp:310, action:'🛡️ Establish the Wardens'},
    {id:13, title:'The Routes Are Changing', focus:"The crew realizes the number of known inter-world routes has grown significantly since Arc XVIII. Fair Tide now needs a way to track them.", image:'assets/comics/arc21/ch13-the-routes-are-changing.png', xp:300, action:'🗺️ Track the Growing Network'},
    {id:14, title:'The Route Observatory', focus:"A major new Fair Tide building — used to view known routes, monitor route conditions, record discovered destinations, track route stability, display known world connections, and identify possible route changes.", image:'assets/comics/arc21/ch14-the-route-observatory.png', xp:310, action:'🔭 Build the Observatory'},
    {id:15, title:'The Horizon Chamber', focus:"The Horizon Engine's importance has outgrown the workshop. Fair Tide establishes a dedicated facility for Horizon Engine operations, inter-world observations, route research, dimensional measurements, and controlled horizon experiments — a proper home for Renn and Erynn's work.", image:'assets/comics/arc21/ch15-the-horizon-chamber.png', xp:310, action:'🌌 Build the Horizon Chamber'},
    {id:16, title:'The Route Preparation', focus:"San can now formally prepare a voyage before departing Fair Tide — reviewing destination, route, crew, supplies, ship readiness, known hazards, available support, and expected travel conditions.", image:'assets/comics/arc21/ch16-the-route-preparation.png', xp:320, action:'🧭 Prepare the Route'}
  ];
  window.ARC21_CHAPTERS = ARC21_CHAPTERS;

  const ARC21_CHAPTER_SCENES = {
    1: "San's barely off the gangplank before the first person finds her with a question, and then a second, and then a third — merchants wanting dock space, a researcher wanting lab room, a family wanting to know where to register.<br><br>It isn't chaos exactly. It's worse than chaos, in a way — it's Fair Tide clearly working, growing, thriving, and doing all of it held together by nothing more solid than San personally answering everyone who happens to find her first.<br><br>Joel looks out over the crowded docks, the packed market rows, the people everywhere doing everything at once.<br><br>\"We're going to need somewhere for all of this,\" he says.<br><br>San assumes he means storage. He means considerably more than that.",
    2: "The day doesn't have a single crisis in it. That's almost the problem — just an endless, granular stream of small ones, one after another, each perfectly reasonable to bring to San and each one, individually, taking a little more of the day than it should.<br><br>Cargo disputes. A repair schedule. A merchant wanting priority. A traveller needing directions. A crew request. A question about a route nobody's actually mapped yet.<br><br>By evening San is exhausted in a way that has nothing to do with combat or crossing worlds, and everything to do with being, apparently, the answer to every single question Fair Tide has.<br><br>\"I can't be the answer to everything,\" she tells Joel, half-laughing at how obvious it sounds out loud.<br><br>\"No,\" he agrees. \"You really can't.\"",
    3: "It doesn't happen all at once, but it happens with real intent — a proper building, finally, with a purpose beyond San's own attention as its organizing principle.<br><br>The Council Hall isn't a parliament, and nobody's under the illusion that San's stepped back from being captain. What it is, instead, is somewhere the actual decisions Fair Tide needs made can happen without funneling entirely through one exhausted person standing on a dock.<br><br>Settlement decisions. Community concerns. Trade disputes. Construction. Policy. All of it, finally, with somewhere to actually happen.<br><br>San stands in the half-finished hall and feels something settle in her chest that she hadn't realized was tense until just now.",
    4: "The first real council meeting doesn't go the way San quietly expected. She'd pictured something closer to a briefing — her, laying out priorities, everyone nodding along.<br><br>Instead, people actually disagree. Openly. A merchant wants something the harbour workers don't want. A researcher's priorities don't match a family's. Nobody's wrong exactly. They just genuinely see Fair Tide differently, depending on where they stand in it.<br><br>Joel backs the disagreement instead of smoothing it over, which surprises San less than it probably should. \"Let them actually say it,\" he tells her, quietly, when she starts to step in.<br><br>She does. It's harder than giving orders. It's also, she realizes by the end of it, the first time Fair Tide has actually sounded like it belongs to more than just her.",
    5: "Traffic through Fair Tide's harbour has stopped being something anyone can track by memory. Ships arriving, ships departing, cargo declared or not declared, visiting crews needing somewhere to actually check in — all of it, until now, handled by whoever happened to be standing on the dock when a ship pulled in.<br><br>The Harbour Office changes that. Nothing about it is glamorous — paperwork, schedules, a proper place to log who's coming and going — but San watches the first week of organized docking happen without a single shouting match over dock space, and decides that counts as a genuine victory.",
    6: "Four ships arrive within the same hour, which would have been unthinkable a year ago and is apparently just a Tuesday now.<br><br>Nobody planned for four ships at once. The dock wasn't built for four ships at once. What follows isn't a crisis so much as an extended, good-natured scramble, with Joel directing traffic like he's done this before and San mostly trying to stay out of the way of people who clearly know their jobs better than she does.<br><br>\"You built a harbour,\" Joel says, once it's finally sorted.<br><br>\"Apparently,\" San says.<br><br>\"You need harbour rules.\"<br><br>\"I regret everything.\"",
    7: "Merchants have been setting up wherever there's space for months now — a stall here, a cart there, no particular order to any of it beyond whoever claimed a spot first.<br><br>Formalizing it into an actual Market Quarter doesn't change what's being sold so much as it changes how findable everything is. Travelling vendors get somewhere expected to set up. Local goods and imported goods stop competing for the same six square feet of dock.<br><br>San walks through it once it's properly laid out and barely recognizes the scattered mess it used to be. It looks, for the first time, like somewhere people actually come to trade — not just wherever trade happened to spill out.",
    8: "It's Aisyah who finally says the thing San's been avoiding admitting: Fair Tide has plenty of resources. What it doesn't have is any real idea where half of them currently are.<br><br>Construction materials in one place. Expedition supplies scattered across three others. Emergency reserves that technically exist but that nobody could locate quickly if an actual emergency showed up.<br><br>The Supply House fixes the part of the problem that was always fixable — not scarcity, just chaos. San watches Aisyah organize it with the same brisk efficiency she brings to everything, and finally understands something that should have been obvious much earlier: having resources was never the hard part. Managing them was.",
    9: "Jovie's been running her care out of whatever room happens to be free for months now, patching people up between deliveries, supply runs, and everything else Fair Tide asks of her. It was never sustainable. Everyone knew that. Nobody quite got around to fixing it until now.<br><br>The Medical House changes that — a real space, finally, for healing, medicine storage, treatment, recovery. Jovie is delighted in a way that makes San genuinely glad she waited this long to see it happen properly instead of doing it halfway.<br><br>Dr. AA starts listing equipment before the paint's even dry. San regrets asking what they'd need, almost immediately, and lets them have it anyway.",
    10: "Repairs have been happening wherever there happened to be space and tools — which mostly meant wherever Caelan happened to be standing, since he's been quietly fixing things around Fair Tide since he arrived without anyone officially asking him to.<br><br>The Workshop finally gives that work an actual home. Equipment repair, ship components, tools, mechanical projects, the dozen small maintenance jobs that never stop needing doing.<br><br>Caelan looks genuinely pleased by it in a way San hadn't quite expected. Not because of the building itself. Because for the first time since he arrived, what he does has a name and a place, instead of just being the thing he ends up doing anyway.",
    11: "It's deliberately unglamorous — something needs fixing, nothing dramatic, exactly the kind of task the new Workshop exists for.<br><br>Caelan solves it without much trouble. Then someone else hears about it and brings him a second thing. Then a third, before the day's even properly started.<br><br>He stands in the middle of a growing pile of other people's problems and arrives at a realization with the weary clarity of someone who's just understood his own future.<br><br>\"I may have made a mistake,\" he says.<br><br>Joel laughs, entirely too hard for how sympathetic he's pretending to be.<br><br>San doesn't laugh. San's been exactly where Caelan's currently standing, and knows better than to make it worse by finding it funny out loud.",
    12: "Fair Tide has grown past the point where safety and security can stay informal — enough people passing through now, enough at stake, that somebody needs to actually coordinate it rather than everyone handling their own corner of it separately.<br><br>Joy steps into that role the way she steps into most things: directly, competently, without waiting to be asked twice. The Warden's Hall becomes hers in every way that matters, even though nothing about her role pulls her away from being family first.<br><br>San's careful about the distinction, and glad she is. Joy isn't becoming another person San sends into danger on an expedition. She's becoming the reason Fair Tide itself stays safe while everyone else is out there doing exactly that.<br><br>It suits her. San's not sure Joy's ever looked more at home than she does standing in a building that's entirely, finally, hers to run.",
    13: "It's Renn who first says the number out loud, and even she sounds slightly unsettled by it. The inter-world routes the crew actually knows about have multiplied since Arc XVIII — new connections, new factions using them, new complications nobody had to think about back when there were only a handful of doors to keep track of.<br><br>Keeping all of it in Renn's notebooks and Erynn's memory isn't going to hold much longer. San can feel the shape of the problem even before anyone puts it into words: Fair Tide grew a harbour, a market, a council. It hasn't yet grown anything built specifically to hold what the Horizon Engine actually opened onto the rest of the world.",
    14: "It isn't a laboratory exactly, and it isn't quite a library either — something in between, built specifically to do the one thing nobody at Fair Tide has ever had a proper place to do: actually see the network, instead of holding pieces of it in scattered notes and memory.<br><br>Known routes. Route conditions. Recorded destinations. The stability of passages that used to just be trusted on faith because nobody had anywhere to track it properly.<br><br>Renn spends the first evening simply walking the space, quietly delighted, the way she gets when a problem she's been carrying finally has somewhere to actually live outside her own head.",
    15: "The Horizon Engine outgrew the workshop a long time ago, San realizes, standing in the middle of the half-finished Chamber. It just took this long for anyone to actually admit it.<br><br>This isn't a bigger workbench. It's a dedicated space for what the Engine has actually become — inter-world observations, route research, dimensional measurements, controlled experiments that were never safe to run in a room built for repairing sails.<br><br>Renn and Erynn move in like they've been waiting for exactly this without knowing it. For the first time, their work has a home that actually matches what it's grown into.",
    16: "San's sailed off Fair Tide more times than she can easily count by now, and until this chapter, most of those departures amounted to: check the ship, gather whoever's coming, go.<br><br>That stops being good enough somewhere around the third near-miss nobody talks about out loud. Route Preparation isn't a new kind of danger — it's simply the departure finally getting the same care Fair Tide itself just got. Destination. Route. Crew. Supplies. Ship readiness. Known hazards. What support is actually available if something goes wrong.<br><br>It isn't glamorous. San goes through it anyway, methodically, and realizes partway through that this is what she should have been doing from the very first voyage — not because anything went wrong before, but because eventually, without this, something eventually would have."
  };
  window.ARC21_CHAPTER_SCENES = ARC21_CHAPTER_SCENES;

  window.arc21ObjectiveState = function(){
    if (!game.arc20Complete) return null;
    if (level() < 315) return null;
    game.comicProgress21 = game.comicProgress21 || {};
    for (const ch of ARC21_CHAPTERS) {
      if (!game.comicProgress21[ch.id]) return 'complete_arc21_chapter_' + ch.id;
    }
    return 'arc21_part1_complete_for_now';
  };

  window.markArc21ChapterRead = function(id){
    const so = window.arc21ObjectiveState();
    if (so !== ('complete_arc21_chapter_' + id)) return;
    game.comicProgress21 = game.comicProgress21 || {};
    game.comicProgress21[id] = true;
    const ch = ARC21_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC21_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC21_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  const oldRenderStoryForArc21 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc21) oldRenderStoryForArc21();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc21Ready = window.arc21ObjectiveState() !== null;
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<div class="story-act-kicker">Arc XXI</div><div class="story-act-title">The Life We Build</div>'+
      '<div class="story-act-tagline">A home isn\'t just a place you return to. It\'s a place that can keep going when you leave.</div></div>';
    if (!arc21Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXI Locked</div><div class="story-chapter-sub">'+
        (!game.arc20Complete ? 'Finish Arc XX first.' : 'Reach Level 315 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc21ObjectiveState();
    ARC21_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress21 && game.comicProgress21[ch.id]);
      const ready = !done && so===('complete_arc21_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc21ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc21_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXI chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
