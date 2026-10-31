(function(){
  // -------------------------------------------------------------------
  // ARC XL — RESONANCE. Gated at arc39Complete + level 600, continuing
  // the established +15-per-arc ladder (XXXVII:555, XXXVIII:570,
  // XXXIX:585, XL:600). Ch.16 sets game.arc40Complete = true, matching
  // every other arc's own finale flag.
  //
  // Per the outline's own explicit framing: Thought Resonance is NOT a
  // new relationship, a sudden magical bond, or a consequence of the
  // alternate Earth discovered in Arc XXXVIII. It's the natural
  // continuation of Perfect Synchronization, the thing Arc XXXVII
  // quietly established and deliberately never named (that file's own
  // comment: "Thought Resonance has not unlocked," reserved for exactly
  // this arc). This file is where it finally gets named -- and even
  // then, per the outline's own restraint, Ch.13 explicitly says the
  // researchers "can describe the phenomenon. They cannot manufacture
  // it" -- not a new magic system, not unrestricted telepathy.
  //
  // 16 chapters. Same scope rule as every arc file since XVII: this
  // file only wires the story chapters. The Thought Resonance unlock
  // flag, its flavor-event pool, and the Bond Resonance panel re-skin
  // live in scripts/arc40-mechanics.js, same split used since Arc
  // XXIII.
  //
  // XP escalates toward Ch.13 ("The Shape of the Bond" -- the
  // researchers' own confirmation) at 410, with Ch.16's own finale
  // (sharing the arc's title, the moment the whole arc has been
  // building toward) as the true centerpiece at 450 -- the one place
  // this file breaks from the usual "centerpiece above the finale"
  // convention, since here the finale genuinely IS the structural and
  // emotional payoff, not a step down from an earlier reveal.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.webp) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC40_CHAPTERS = [
    {id:1, title:'Before You Ask', focus:"San is preparing for another busy day at Fair Tide. Joel brings her something she was about to ask for -- nothing unusual -- then answers a question she hasn't spoken aloud. San stops. \"Did I say that out loud?\" Joel looks genuinely confused.", image:'assets/comics/arc40/ch01-before-you-ask.webp', xp:340, action:'❤️ Notice Before You Ask'},
    {id:2, title:'Stop Doing That', focus:'It happens again. San thinks about changing their plans; Joel starts making the adjustment before she says a word. "Stop knowing what I\'m going to do." "You always do that." "I haven\'t done it yet!" Joel finds this very entertaining. San does not. At least, that\'s what she claims.', image:'assets/comics/arc40/ch02-stop-doing-that.webp', xp:340, action:'😂 Insist He Stop Doing That'},
    {id:3, title:'Captain and First Mate', focus:"During an ordinary Fair Tide assignment, San and Joel coordinate almost perfectly, anticipating each other without needing instructions. But this time Joel responds to a decision San has only considered. Both notice. Neither mentions it in front of the crew.", image:'assets/comics/arc40/ch03-captain-and-first-mate.webp', xp:345, action:'⚓ Coordinate as Captain and First Mate'},
    {id:4, title:'Did You Hear Me?', focus:'That evening, San quietly tests something -- thinking a simple question while Joel is occupied. He answers. Then pauses. "You asked." "No, I didn\'t." For the first time, neither of them has an ordinary explanation.', image:'assets/comics/arc40/ch04-did-you-hear-me.webp', xp:350, action:'🌙 Ask Did You Hear Me'},
    {id:5, title:'Something Different', focus:"San and Joel consult Mimi, Renn and Erynn. Mimi examines their existing Bond as a Diviner; Renn wants controlled experiments; Erynn is more interested in whether the connection has boundaries. \"I knew you'd suggest experiments,\" San says to Renn, who takes it as further proof.", image:'assets/comics/arc40/ch05-something-different.webp', xp:350, action:'🔮 Admit Something Different'},
    {id:6, title:'Not Every Thought', focus:"The researchers discover Thought Resonance isn't constant. Sometimes San and Joel recognize an intention, sometimes a feeling, occasionally a clear thought -- other times, nothing at all. Renn is disappointed. San is relieved. Joel seems quite satisfied with the limitations.", image:'assets/comics/arc40/ch06-not-every-thought.webp', xp:355, action:'💗 Learn Not Every Thought'},
    {id:7, title:'Two Against Two, Again', focus:"Vaeren and Joelle continue demonstrating their own paired affinity. San watches the twins coordinate, then notices Joel has already moved to stop something they're planning. \"You knew?\" \"I saw them looking at Soel.\" Soel leaves. The twins follow. Not everything requires magic.", image:'assets/comics/arc40/ch07-two-against-two-again.webp', xp:350, action:'🐈 Watch Two Against Two, Again'},
    {id:8, title:'Still My Own Mind', focus:"San and Joel discuss the implications privately. San values her independence; Joel has his own thoughts, worries and decisions. Neither wants the Bond to eliminate personal boundaries. They agree not to deliberately search for thoughts the other hasn't chosen to share.", image:'assets/comics/arc40/ch08-still-my-own-mind.webp', xp:355, action:'🌿 Keep Still My Own Mind'},
    {id:9, title:'Without a Signal', focus:"During a routine expedition, the party hits an unexpected complication and San and Joel are briefly separated. San senses Joel's intention before she can even see him, and responds. Their coordination helps the party regroup -- the first time Thought Resonance proves useful beyond their private lives.", image:'assets/comics/arc40/ch09-without-a-signal.webp', xp:370, action:'⚔️ Act Without a Signal'},
    {id:10, title:'Not a Shortcut', focus:"Renn suggests testing the Bond's usefulness during future expeditions. San refuses to treat it as a replacement for communication or preparation -- it can fail, it has limits, and their responsibilities to the crew remain unchanged. Joel agrees.", image:'assets/comics/arc40/ch10-not-a-shortcut.webp', xp:355, action:"🌊 Insist It's Not a Shortcut"},
    {id:11, title:"What You Didn't Say", focus:"San notices an emotion from Joel he hasn't expressed, and assumes she understands its cause. She's wrong. Joel gently corrects her. They realize Thought Resonance can communicate feelings without their full context -- knowing what someone feels isn't the same as knowing why.", image:'assets/comics/arc40/ch11-what-you-didnt-say.webp', xp:360, action:"❤️ Hear What You Didn't Say"},
    {id:12, title:'The Things We Choose to Tell', focus:'San and Joel spend a quiet evening remembering moments when one misunderstood the other despite years of closeness. The Bond hasn\'t made those conversations unnecessary -- if anything, it reminds them why they matter. "So I still have to explain myself?" "Sometimes." "Terrible." Joel laughs.', image:'assets/comics/arc40/ch12-the-things-we-choose-to-tell.webp', xp:355, action:'🌺 Choose the Things We Tell'},
    {id:13, title:'The Shape of the Bond', focus:"Mimi, Renn and Erynn complete their observations. San and Joel's existing connection has developed a new expression -- not ordinary telepathy, but resonance between two people whose minds and souls have grown unusually attuned over years in Veyren. The researchers can describe it. They cannot manufacture it.", image:'assets/comics/arc40/ch13-the-shape-of-the-bond.webp', xp:410, action:'🔮 Confirm the Shape of the Bond'},
    {id:14, title:'No Words Needed', focus:"San and Joel return to their usual responsibilities. Occasionally the Bond helps them coordinate; more often, they simply understand each other through habit. The crew can't always tell the difference. Neither can San and Joel. They're comfortable with that.", image:'assets/comics/arc40/ch14-no-words-needed.webp', xp:350, action:'⚓ Need No Words'},
    {id:15, title:'A Quiet Understanding', focus:'At home, Vaeren and Joelle are finally asleep, Soel claiming a comfortable place nearby. San thinks something affectionate. Joel smiles. "You heard that?" "Maybe." "That\'s cheating." "You can say it out loud." She does.', image:'assets/comics/arc40/ch15-a-quiet-understanding.webp', xp:360, action:'🌸 Share a Quiet Understanding'},
    {id:16, title:'Resonance', focus:"Fair Tide continues its ordinary life. San and Joel stand together discussing the days ahead, and for a brief moment their intentions align without a word -- not because they've become one mind, but because they remain two people who have learned to understand each other extraordinarily well.", image:'assets/comics/arc40/ch16-resonance.webp', xp:450, action:'💗 Find Resonance'}
  ];
  window.ARC40_CHAPTERS = ARC40_CHAPTERS;

  const ARC40_CHAPTER_SCENES = {
    1: 'San is halfway through preparing for another packed day at Fair Tide when Joel brings her something she was about to ask for -- nothing especially strange about that on its own, after this many years together.<br><br>Then he answers a question she hasn\'t actually asked out loud.<br><br>San stops cold. "Did I say that out loud?"<br><br>"Say what?" Joel asks, and he looks genuinely confused, not performing it.<br><br>San studies him for a long moment. He looks exactly as baffled as he sounds. She lets it go, this time, and gets back to her morning. It doesn\'t quite let go of her.',
    2: 'It happens again, not long after. San starts thinking about changing their plans for the afternoon, turning the idea over before she\'s said anything about it -- and Joel starts making the adjustment before she gets the chance to.<br><br>"Joel."<br><br>"Hmm?"<br><br>"Stop knowing what I\'m going to do."<br><br>"You always do that," he says, like it\'s simply a fact about her, nothing stranger than that.<br><br>"I haven\'t done it yet!"<br><br>Joel finds the whole exchange considerably more entertaining than San does. At least, that\'s what she claims, arms crossed, very much not smiling.',
    3: "An ordinary Fair Tide assignment puts San and Joel in motion together, and they coordinate almost perfectly, the way they always have -- anticipating each other's next move without needing it spelled out. The crew's long since stopped remarking on how well the two of them work in tandem.<br><br>But this time, Joel responds to a decision San has only just considered, not yet spoken, not yet acted on.<br><br>Both of them notice.<br><br>Neither says a word about it in front of the crew.",
    4: 'That evening, once things have quieted down, San tries something -- deliberately, carefully, while Joel\'s attention is elsewhere. She thinks a simple question, nothing out loud at all.<br><br>He answers it.<br><br>Then stops, visibly catching up to what just happened.<br><br>"You asked," he says.<br><br>"No, I didn\'t."<br><br>They stare at each other for a long moment. For the first time, neither of them reaches for an ordinary explanation. There isn\'t one sitting ready to hand this time.',
    5: 'San and Joel bring it to Mimi, Renn and Erynn, laying out what\'s been happening without quite knowing how to frame it. Mimi examines their existing Bond with a Diviner\'s eye. Renn immediately wants controlled experiments, several of them, in careful sequence. Erynn is more interested in whether the connection actually has edges -- places it stops working, patterns it follows.<br><br>"I knew you\'d suggest experiments," San tells Renn, dry.<br><br>"You see?" Renn says, delighted rather than deterred. "This is exactly what we need to investigate."<br><br>"She says that to everyone," Joel points out, unhelpfully.',
    6: "The researchers spend real time on it and land on something important fairly quickly: Thought Resonance isn't constant, and it isn't total. San and Joel can't simply hear everything moving through each other's minds, not even close.<br><br>Sometimes they recognize an intention a half-second before it becomes action. Sometimes just a feeling, no shape to it yet. Occasionally something closer to an actual clear thought. Other times — plenty of times — nothing happens at all, and the two of them are exactly as separate as they've always been.<br><br>Renn is visibly disappointed by the inconsistency of it. San is, if anything, relieved. Joel seems downright satisfied that the whole thing comes with real limits built in.",
    7: 'Vaeren and Joelle are at it again, coordinating with each other in that easy, wordless way that\'s become entirely normal to watch by now. San follows the two of them for a moment, working out what they\'re actually planning.<br><br>Then she notices Joel\'s already moved to stop it, a full beat before San herself has worked out what "it" even is.<br><br>"You knew?" she asks.<br><br>"I saw them looking at Soel," Joel says, simply.<br><br>Soel, with the air of someone who\'s seen this exact look before, leaves the room. The twins follow immediately.<br><br>Not everything, San reminds herself, actually requires magic. Sometimes it\'s just paying attention.',
    8: "San and Joel talk it through properly, just the two of them, once the day's quieted down. San's independence matters to her -- it always has, long before any of this started. Joel has his own thoughts, his own worries, his own decisions he's entitled to make without her reading them off him first.<br><br>Neither of them wants the Bond to erase the line between two separate people, however close those people have become.<br><br>So they agree, plainly, out loud: neither of them goes looking for a thought the other hasn't chosen to actually share. The connection is meant to deepen the trust that's already there. It isn't meant to replace it.",
    9: "A routine expedition runs into a genuinely unexpected complication, and in the scramble San and Joel end up briefly separated, out of sight of each other, ordinary communication suddenly difficult to manage.<br><br>San senses Joel's intention before she can actually see him — not words, not a plan laid out, just a clear enough sense of what he's about to do that she can move to match it.<br><br>She responds. It works. Between the two of them, the party regroups faster than it has any real right to.<br><br>For the first time, Thought Resonance has proven useful for something beyond the quiet, private moments it's shown up in so far.",
    10: "Renn, predictably, wants to start treating the Bond as a genuine tool for future expeditions — something to plan around, lean on, build strategy out of.<br><br>San shuts that down carefully but firmly. The Bond isn't a replacement for actual communication, actual preparation, actual planning done the hard way. It can fail. It has limits they've already seen for themselves.<br><br>Joel agrees without hesitation. Their responsibility to the rest of the crew hasn't changed just because something new has shown up between the two of them. If anything, that responsibility means being even more careful not to lean on something this unreliable.",
    11: "San notices something in Joel — an emotion he hasn't put into words, something sitting under the surface of an otherwise ordinary afternoon. She assumes, without really questioning it, that she understands exactly where it's coming from.<br><br>She's wrong.<br><br>Joel corrects her gently, filling in the actual cause, which turns out to have nothing to do with what San assumed at all.<br><br>It's a useful, slightly humbling discovery: Thought Resonance can hand over a feeling without any of the context behind it. Knowing what someone feels, it turns out, isn't remotely the same as knowing why.",
    12: 'They spend a quiet evening together, just talking, and the conversation drifts toward old moments — times, across all their years together, when one of them badly misunderstood the other despite how close they already were.<br><br>The Bond hasn\'t made any of those old conversations unnecessary. If anything, remembering them reminds San why those conversations mattered in the first place, Bond or no Bond.<br><br>"So I still have to explain myself?" she asks, mock-wounded.<br><br>"Sometimes," Joel says.<br><br>"Terrible."<br><br>Joel laughs, and doesn\'t apologize for any of it.',
    13: "Mimi, Renn and Erynn finally bring their observations to a close, and this time they actually have something solid to say about it. San and Joel's existing connection -- the Bond that's been there for years -- has developed a new expression.<br><br>It isn't ordinary telepathy, Erynn is careful to clarify. It's resonance, specifically, between two people whose minds and souls have grown unusually attuned to each other across years of shared life in Veyren.<br><br>Their individuality hasn't gone anywhere. Mimi is clear on that point too.<br><br>The researchers can describe what's happening between San and Joel now, in careful, considered detail.<br><br>They can't manufacture it. Whatever this actually is, it only ever grew the long way.",
    14: "San and Joel settle back into their usual responsibilities, the Archive's own report filed away without much ceremony. Occasionally, now that it has a name, the Bond helps them coordinate on something specific. More often, far more often, they simply understand each other the old way — through years of plain habit, nothing supernatural required.<br><br>The crew, watching from outside, can't reliably tell the difference between the two anymore.<br><br>Neither, if San's honest, can she and Joel. They've stopped trying to sort it. It's comfortable enough, left unsorted.",
    15: "At home, Vaeren and Joelle are finally, properly asleep, worn out the way only small children manage. Soel has claimed a comfortable spot nearby, keeping half an eye on them out of habit more than necessity.<br><br>San and Joel get a rare quiet moment to themselves, and San lets herself think something affectionate, nothing she bothers putting into words.<br><br>Joel smiles anyway.<br><br>\"You heard that?\" she asks.<br><br>\"Maybe.\"<br><br>\"That's cheating.\"<br><br>\"You can say it out loud,\" he points out, perfectly reasonably.<br><br>So she does.",
    16: "Fair Tide carries on with its ordinary life around them — the Horizon Engine humming along in its workshop, the crew already talking through the next expedition, Vaeren and Joelle growing a little more each day whether anyone's watching closely or not.<br><br>San and Joel stand together, working through what's ahead, the same way they've worked through everything else for years now.<br><br>For one brief moment, their intentions line up without either of them saying a single word.<br><br>Not because they've somehow become one mind. They haven't, and neither of them would actually want that.<br><br>Because they remain two whole, separate people who have simply learned, over all this time, how to understand each other extraordinarily well.<br><br>San reaches for Joel's hand.<br><br>He was already reaching for hers.<br><br>This time, they both know it, clearly, without any doubt at all."
  };
  window.ARC40_CHAPTER_SCENES = ARC40_CHAPTER_SCENES;

  window.arc40ObjectiveState = function(){
    if (!game.arc39Complete) return null;
    if (level() < 600) return null;
    game.comicProgress40 = game.comicProgress40 || {};
    for (const ch of ARC40_CHAPTERS) {
      if (!game.comicProgress40[ch.id]) return 'complete_arc40_chapter_' + ch.id;
    }
    return 'arc40_part1_complete_for_now';
  };

  window.markArc40ChapterRead = function(id){
    const so = window.arc40ObjectiveState();
    if (so !== ('complete_arc40_chapter_' + id)) return;
    game.comicProgress40 = game.comicProgress40 || {};
    game.comicProgress40[id] = true;
    // Matches every prior arc's own completion flag (arc38/arc39Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 16) game.arc40Complete = true;
    const ch = ARC40_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC40_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC40_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc40Splash = function(){
    const overlay = document.getElementById('arc40SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc40Splash = function(){
    const overlay = document.getElementById('arc40SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc40SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc40 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc40) oldRenderStoryForArc40();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc40Ready = window.arc40ObjectiveState() !== null;
    if (arc40Ready && !game.arc40SplashSeen && typeof window.__ctShowArc40Splash === 'function') {
      window.__ctShowArc40Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc40/arc40-cover-resonance.webp" alt="Arc XL — Resonance" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XL</div><div class="story-act-title">Resonance</div>'+
      '<div class="story-act-tagline">Some connections grow so familiar that neither person notices when understanding becomes something more.</div></div>';
    if (!arc40Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XL Locked</div><div class="story-chapter-sub">'+
        (!game.arc39Complete ? 'Finish Arc XXXIX first.' : 'Reach Level 600 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc40ObjectiveState();
    ARC40_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress40 && game.comicProgress40[ch.id]);
      const ready = !done && so===('complete_arc40_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action =
          '<button class="btn btn-small btn-success" onclick="markArc40ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc40_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XL chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
