(function(){
  // -------------------------------------------------------------------
  // INTERLUDE — IN BETWEEN. Four standalone bridging vignettes San asked
  // for between Arc XX and Arc XXII, gated identically to Arc XXI
  // (arc20Complete + level 315) but deliberately independent of it and
  // of Arc XXII — this file's own completion feeds nothing else, and
  // nothing else's gate depends on it. Purely bonus story content, same
  // scope rule as every arc file since XVII: no new mechanics.
  //
  // The four don't share a plot — they're quiet, unconnected check-ins
  // on threads the main arcs don't have room for — so they use the same
  // fixed-sequence chapter mechanism as every other arc for UI
  // consistency, even though nothing here actually depends on reading
  // them in this particular order.
  //
  // Ch.1 (San, drunk): a single mild, dismissable morning-after detail
  // (unusually deep sleep, a beat of dizziness explained away as "more
  // than she thought") is deliberate, quiet foreshadowing toward Arc
  // XXII — never played as a symptom, never remarked on by anyone
  // in-scene, easy to read past entirely on a first pass.
  //
  // Ch.3 (Joel's brother): per direction, this is NOT a new, previously
  // unmentioned sibling — Joel's family was already fully accounted for
  // in the Memory Archive chapters (arc10-12.js Ch.2/Ch.13): four
  // siblings, San's mother "the one constant," a brother who'd "built a
  // stable life further away." This chapter is that same brother —
  // Joel realizing, out loud, that he hasn't heard from him since
  // crossing into this world, which the story never actually addressed
  // until now. No resolution; that's the point. Chapter title says "fate
  // unknown" for exactly that reason.
  //
  // Ch.4 (Renn): follows directly from Arc XVII Ch.20 ("Home") and its
  // own resolution (Ch.24-25) — matches that arc's own understated tone
  // on purpose: no dramatic re-litigation of what he remembers, just
  // San checking in the way she already didn't push him back then
  // ("She doesn't tell Renn what he should be feeling").
  // -------------------------------------------------------------------

  const INTERLUDE_CHAPTERS = [
    {id:1, title:'More Than She Thought', focus:"A rare night off turns into a rarer one — San actually lets herself have too much to drink, for once, with nobody needing anything from her. The next morning is fuzzy in a way that doesn't quite match how little she remembers actually drinking.", image:'assets/comics/interlude/ch01-more-than-she-thought.png', xp:240, action:'🍶 Have Too Much, For Once'},
    {id:2, title:"A Cat and His People", focus:"A quiet montage of Soel's life at Fair Tide — Renn still trying to explain him scientifically and still getting bitten for it, Senedra just sitting with him when he's worn thin, Aisyah's small unspoken kindnesses, Joel's easy affection, and San's bond with him going back to before any of his powers ever showed.", image:'assets/comics/interlude/ch02-a-cat-and-his-people.png', xp:250, action:"🐈 Watch Him With Everyone"},
    {id:3, title:'The One He Hasn\'t Heard From', focus:"Joel realizes, out loud and unplanned, that he hasn't heard from his brother since the crossing — the one who'd built a stable life of his own, back with Mama, in the old world. No way to check. No way to know. Just a question that's been sitting there, unasked, since before any of this started.", image:'assets/comics/interlude/ch03-the-one-he-hasnt-heard-from.png', xp:260, action:"💭 Say It Out Loud"},
    {id:4, title:'Still Renn', focus:"San checks in on Renn, some time after the Archive told him where he was from. Nothing's changed and everything has — he's still exactly who he was, just with one fewer question sitting unanswered underneath all the others. She doesn't ask him how he feels about it. She never did.", image:'assets/comics/interlude/ch04-still-renn.png', xp:250, action:'🗺️ Check In'}
  ];
  window.ARC20_INTERLUDE_CHAPTERS = INTERLUDE_CHAPTERS;

  const INTERLUDE_CHAPTER_SCENES = {
    1: "It isn't even a special occasion, which is somehow what makes it happen.<br><br>Nobody needs San for anything that night — no crisis at Fair Tide, no decision only the captain can make, nothing waiting on the other side of one more drink. Joel notices before she does, and instead of saying anything about it, he just keeps her glass from sitting empty for too long.<br><br>She means to stop earlier than she does. She doesn't. By the end of the night she's laughing at something that wasn't even that funny, thoroughly unable to walk a straight line, and completely unbothered by either fact.<br><br>The morning after is fuzzy in the ordinary way — a headache, a vague sense of having said at least one thing she'll be reminded of later. But underneath it there's something a little stranger: a depth to how hard she slept that doesn't quite match how much she actually remembers drinking, and one long, swaying moment getting out of bed that lasts a beat longer than it should.<br><br>\"You alright?\" Joel asks, watching her steady herself against the doorframe.<br><br>\"Fine,\" she says, and believes it. \"Must've had more than I thought.\"<br><br>Neither of them thinks about it again.",
    2: "Soel doesn't belong to anyone the way a pet belongs to an owner. Everyone at Fair Tide seems to understand that without needing to be told — he simply belongs, the way a person does, to a place and the people in it.<br><br>Renn still can't leave it alone. Every so often he corners Soel with some new theory — a working diagram, an origin hypothesis, a question about exactly how the blessing moves through him — and every so often he gets bitten for it, hard enough to mean it, gentle enough that Renn always comes back for more anyway.<br><br>Senedra doesn't ask him anything at all. When he's worn thin from whatever he's done for someone that week, she just sits nearby, not saying much, and somehow that's exactly the right amount of company.<br><br>Aisyah handled his vaccinations and his neutering years ago without making a single thing of it — quietly paid, quietly arranged, never once brought up since. Joel keeps food ready before Soel even asks for it and stays close on the bad days, the same easy, unspoken care he's had for him since before Soel had any powers worth noticing at all.<br><br>And San — San was there before any of it. Before the blessing, before the danger-sense, before he was anything other than a kitten she and Joel decided, together, to keep. Whatever he's become since then, that part never changed.<br><br>\"He's always been part of the crew,\" Joel says, watching him weave between everyone's legs at once like he's checking on all of them in a single pass.<br><br>Nobody argues with that. Nobody ever has.",
    3: "It comes out sideways, the way the things that actually matter usually do with Joel — not planned, not building toward anything, just suddenly there in the middle of an ordinary evening.<br><br>\"I haven't heard from my brother,\" he says. \"Not since I crossed over.\"<br><br>San doesn't say anything right away, giving him room to keep going or not.<br><br>\"He'd built something good for himself,\" Joel continues. \"Back home. Stable. Mama was proud of him for it — still is, probably, far as she knows.\" A pause. \"I never thought about what happens to that once I wasn't there anymore to hear about it.\"<br><br>There's no way to check. No letter that could reach that far, no way to know if he's still exactly where Joel left him or if life simply kept moving the way it does for everyone left behind by someone who crosses into another world entirely. Mama, at least, Joel can hold onto — the one constant, same as she's always been. His brother is just a question now, sitting where an answer used to be assumed.<br><br>\"I'm not asking you to fix it,\" he tells San, before she can offer to. \"There isn't anything to fix. I just — hadn't said it out loud before.\"<br><br>San reaches for his hand instead of an answer. Some things don't need one. They just need saying.",
    4: "San finds Renn exactly where she expects to — bent over something at the Archive, absorbed in work that has nothing to do with himself at all.<br><br>\"How are you doing?\" she asks. Not a formality. She means it.<br><br>He takes a moment before answering, the way he does when a question isn't really about the thing it sounds like it's about.<br><br>\"Fine,\" he says. \"Good, actually.\" Another pause. \"It's strange — knowing where I'm from didn't change anything about who I am. I thought it might, somehow. It just answered a question that used to sit underneath all the others.\"<br><br>San nods, and doesn't push past that. She never has, not with him — not when the Archive first showed him what it showed, not after Ch.20, not now. Whatever he's feeling about it is his to feel at his own pace, in his own words, whenever he actually has them.<br><br>\"You're still exactly who you were,\" she says.<br><br>\"Yeah.\" He almost smiles. \"Just with one fewer question, underneath.\"<br><br>She leaves him to his work after that. That's the whole visit. It's enough."
  };
  window.ARC20_INTERLUDE_CHAPTER_SCENES = INTERLUDE_CHAPTER_SCENES;

  window.arc20InterludeObjectiveState = function(){
    if (!game.arc20Complete) return null;
    if (level() < 315) return null;
    game.comicProgress20Interlude = game.comicProgress20Interlude || {};
    for (const ch of INTERLUDE_CHAPTERS) {
      if (!game.comicProgress20Interlude[ch.id]) return 'complete_interlude_chapter_' + ch.id;
    }
    return 'interlude_complete_for_now';
  };

  window.markArc20InterludeChapterRead = function(id){
    const so = window.arc20InterludeObjectiveState();
    if (so !== ('complete_interlude_chapter_' + id)) return;
    game.comicProgress20Interlude = game.comicProgress20Interlude || {};
    game.comicProgress20Interlude[id] = true;
    if (id === INTERLUDE_CHAPTERS.length) game.arc20InterludeComplete = true;
    const ch = INTERLUDE_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (INTERLUDE_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: INTERLUDE_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  const oldRenderStoryForInterlude = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForInterlude) oldRenderStoryForInterlude();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const interludeReady = window.arc20InterludeObjectiveState() !== null;
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<div class="story-act-kicker">Interlude</div><div class="story-act-title">In Between</div>'+
      '<div class="story-act-tagline">Not every chapter needs a horizon to cross.</div></div>';
    if (!interludeReady) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Interlude Locked</div><div class="story-chapter-sub">'+
        (!game.arc20Complete ? 'Finish Arc XX first.' : 'Reach Level 315 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc20InterludeObjectiveState();
    INTERLUDE_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress20Interlude && game.comicProgress20Interlude[ch.id]);
      const ready = !done && so===('complete_interlude_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc20InterludeChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='interlude_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All four Interlude chapters read.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
