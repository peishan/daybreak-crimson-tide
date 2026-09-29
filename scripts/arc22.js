(function(){
  // -------------------------------------------------------------------
  // ARC XXII — THE CHILD OF FAIR TIDE. Chapters 1-12 wired — Part I
  // ("Something Different"), Part II ("The Veyren Diagnosis"), and Part
  // III ("Maera's Diagnostic System"), the pregnancy and twin reveals.
  // Gated at arc21Complete + level 330, continuing the established
  // +15-per-arc ladder (XIX:285, XX:300, XXI:315, XXII:330).
  //
  // Ch.10 walks through all four stages of Maera's exam as laid out in
  // the design doc (Vital / Life-Resonance / Meridian-Vital-Flow / Womb
  // Resonance) in sequence, on purpose — the doc is explicit that the
  // point is to make this read as a genuine, methodical Veyren medical
  // discipline rather than a single convenient magic-reveal moment.
  //
  // Ch.11 and Ch.12 are deliberately kept as two separate beats, per the
  // doc's own note: the pregnancy confirmation and the twin reveal each
  // get their own reaction from San and Joel rather than being folded
  // into one scene. XP reflects that escalation (320/350/400) — this is
  // the single largest jump in the arc so far, on purpose, since it's
  // the arc's central revelation.
  //
  // Same scope rule as Arc XVII-XXI: this file only wires the story
  // chapters. No pregnancy mechanic, no Maera diagnostic system, no
  // new game.* state beyond the standard comicProgress22 tracking —
  // and per the doc's own note for Ch.23, the pregnancy is meant to
  // have no in-game countdown at all ("no 'Day 180' mechanic"), so
  // nothing here should ever grow into one. Not registered with the
  // objective-chain aggregator; that's still being handled separately.
  //
  // The craving in Ch.1 is written as a specific-but-unnamed sour fruit
  // from the Market Quarter — the doc only says "food she normally
  // wouldn't seek out," so the fruit itself is my invention. Easy to
  // swap for a canon food if there is one.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (ch0N-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC22_CHAPTERS = [
    {id:1, title:'Something I Want', focus:"San develops an unusual craving for food she normally wouldn't seek out. At first it is simply funny — Joel is more amused than concerned and goes out of his way to find what she wants.", image:'assets/comics/arc22/ch01-something-i-want.png', xp:270, action:'🍽️ Follow the Craving'},
    {id:2, title:"You Don't Eat Enough", focus:"Joel notices San has been putting Fair Tide's needs ahead of her own again. He reminds her she's allowed to enjoy her own life — San spent years saving and postponing, Joel carried debts but still enjoyed each day.", image:'assets/comics/arc22/ch02-you-dont-eat-enough.png', xp:280, action:'💬 Let Him Say It'},
    {id:3, title:'Fair Tide Can Wait', focus:"San actually takes Joel's advice, leaving Fair Tide's responsibilities alone for an afternoon to simply enjoy herself with him. She isn't unhappy — she's just forgotten that living is part of the life she's building.", image:'assets/comics/arc22/ch03-fair-tide-can-wait.png', xp:270, action:'☀️ Take the Afternoon'},
    {id:4, title:'Soel Knows Something', focus:"Soel becomes unusually interested in San — following her closely, sleeping near her, and occasionally pressing himself against her abdomen. San assumes he's just being Soel. Neither of them considers pregnancy.", image:'assets/comics/arc22/ch04-soel-knows-something.png', xp:290, action:'🐈 Notice Soel'},
    {id:5, title:'The Sage at the Shrine', focus:"San and Joel encounter the strange Veyren sage. He studies San briefly, and instead of announcing anything, says: \"Some things arrive only when they are ready.\" \"Do not hurry what is growing.\" Then he smiles and disappears.", image:'assets/comics/arc22/ch05-the-sage-at-the-shrine.png', xp:300, action:'🔮 Meet the Sage'},
    {id:6, title:'What Was He Talking About?', focus:"San and Joel try to interpret the sage's words — Fair Tide, the Horizon Engine, some magical phenomenon, even Soel — and eventually dismiss it. Meanwhile, San's unusual cravings continue.", image:'assets/comics/arc22/ch06-what-was-he-talking-about.png', xp:280, action:'🤔 Puzzle It Out'},
    {id:7, title:'The Food Problem', focus:"San's cravings become harder to ignore. Joel has essentially become her unofficial food supplier — the situation stays domestic and funny, but San begins wondering why her appetite has changed so dramatically.", image:'assets/comics/arc22/ch07-the-food-problem.png', xp:280, action:'🍲 Keep Track of It'},
    {id:8, title:'I Feel Fine', focus:"San realizes that despite the strange appetite, she doesn't feel sick — in fact she feels unusually healthy, which makes pregnancy even less likely in her mind. There's no familiar human pattern telling her what's happening.", image:'assets/comics/arc22/ch08-i-feel-fine.png', xp:290, action:'💪 Feel Unusually Healthy'},
    {id:9, title:'Something About Me', focus:"San finally tells Joel something about her body feels different. Rather than going to Jovie or Dr. AA, they decide to seek a Veyren healer who understands Veyren physiology — leading them to Maera Veyr, Veyren Healer & Midwife.", image:'assets/comics/arc22/ch09-something-about-me.png', xp:310, action:'💬 Tell Joel'},
    {id:10, title:"The Healer's Examination", focus:"Maera begins a comprehensive Veyren examination — vital signs, life-resonance, meridian/vital-flow, and a womb resonance reading. San appears healthy by every ordinary measure, but Maera detects a faint second life-signature and sends for her senior midwife.", image:'assets/comics/arc22/ch10-the-healers-examination.png', xp:320, action:'🩺 Begin the Examination'},
    {id:11, title:'The Second Examination', focus:"Maera's senior midwife examines San independently and confirms the pattern. Maera: \"San... I believe you're carrying a child.\" Silence. Neither San nor Joel knows what to say.", image:'assets/comics/arc22/ch11-the-second-examination.png', xp:350, action:'👂 Hear the Second Opinion'},
    {id:12, title:'Two', focus:'Maera detects two distinct developing life signatures, confirmed independently by the midwives. "There are two," she says. Joel: "Two?" Maera: "Two children." San is completely stunned — they\'re having twins.', image:'assets/comics/arc22/ch12-two.png', xp:400, action:'👶👶 Two'}
  ];
  window.ARC22_CHAPTERS = ARC22_CHAPTERS;

  const ARC22_CHAPTER_SCENES = {
    1: "It starts with a fruit.<br><br>Not one San has ever cared about — a sour, slightly ridiculous thing from a stall at the far end of the Market Quarter that she's walked past a hundred times without a second glance. But this morning she wakes up wanting it with a specificity that's almost embarrassing, and by midday she's thought about little else.<br><br>She says it out loud, half-laughing at herself, and Joel looks up from his breakfast with the expression of a man who has just been handed a mission.<br><br>\"You want fruit,\" he says. \"You. Want fruit.\"<br><br>\"I want that fruit.\"<br><br>He's out the door before she can tell him it isn't that important. He comes back an hour later, triumphant and slightly out of breath, and watches her eat it with more satisfaction than the situation strictly deserves.<br><br>It's funny. That's all it is. Nothing is wrong with her. San doesn't give it another thought.",
    2: "Joel notices it the way he notices most things about her — late, and then all at once.<br><br>Breakfast skipped because a ship needed clearing. Lunch eaten standing up over a ledger. Dinner, if it happens, somewhere between two council matters and a merchant who's very sure his cargo was mislabeled. Fair Tide's needs keep arriving, and San keeps putting them ahead of herself, exactly the way she always has.<br><br>\"You don't eat enough,\" he says, and it isn't really about food.<br><br>San starts to argue, and he waits her out.<br><br>The old world sits between them for a moment, the way it sometimes does. San spent years saving, postponing, telling herself she'd have time to actually live once everything was in order. Joel earned less, carried debts, and still tried to enjoy a little of each day instead of waiting for a perfect future to arrive.<br><br>\"You're allowed to enjoy this,\" he says. \"Your life. Right now, not later.\"<br><br>She doesn't have an argument for that. She's not sure she's ever had one.",
    3: "She actually does it, which surprises them both.<br><br>Fair Tide's responsibilities stay exactly where she leaves them — the ledger closed, the council matters handed off, the harbour trusted to people who've more than earned it. For one afternoon San doesn't fix anything, decide anything, or answer anything.<br><br>They just spend it. Walking, mostly. Eating something that isn't a snack between crises. Sitting somewhere warm with nothing to do and nobody looking for her.<br><br>San isn't unhappy with the life she's built. That's the odd part, realizing it now — she loves it. She'd just forgotten that living is part of what she's building, not something waiting on the far side of it.<br><br>Joel doesn't say I told you so. He just looks pleased, and lets the afternoon be exactly what it is.",
    4: "Soel has always been attentive in the way of cats who've decided a particular person is theirs. This is different, and it takes a few days before either of them names it.<br><br>He follows San more closely now. Sleeps against her side instead of at the foot of the bed. And sometimes, without any obvious reason, he presses himself against her stomach and simply stays there, very still, like he's listening to something.<br><br>San assumes he's just being Soel.<br><br>Joel notices it too, and has no better explanation. They trade a look over the top of the cat, shrug, and let it go.<br><br>Neither of them wonders what he's listening to.",
    5: "They find the shrine by accident, the way people usually find the places that matter — a detour, a wrong turn, a path neither of them planned to take.<br><br>The sage is already there, as if he'd been expecting company. Veyren, unhurried, with the calm of someone who has been watching tides for a very long time. He studies San for a moment. Only a moment. Long enough that she starts to feel looked at in a way she can't quite name.<br><br>He doesn't say what he sees.<br><br>\"Some things arrive only when they are ready,\" he says.<br><br>\"What does that mean?\" San asks.<br><br>\"Do not hurry what is growing.\"<br><br>Joel frowns. \"What's growing?\"<br><br>The sage only smiles. When they look again, the shrine is empty, and there's nobody there at all.",
    6: "They spend most of the walk home trying to work it out.<br><br>Fair Tide, maybe — the settlement itself, still growing. Or the Horizon Engine, some new phase of it nobody's noticed yet. A magical phenomenon of some kind. Something to do with Soel, given how strangely Soel's been behaving lately.<br><br>Each theory sounds plausible for about a minute.<br><br>\"He was probably just being mysterious,\" Joel says finally. \"Sages do that.\"<br><br>\"Probably,\" San agrees, and lets it go.<br><br>The cravings don't. By evening she's thinking about that fruit again, and Joel — without being asked — is already reaching for his coat.",
    7: "It isn't one fruit anymore. It's become a rotating list, each craving arriving with the same sudden, specific certainty as the last, and Joel has, without either of them quite deciding it, become San's unofficial supplier.<br><br>He doesn't complain. If anything he seems to be enjoying it — tracking down whatever she wants with the focus he usually reserves for actual emergencies. It stays domestic. Funny, mostly, the two of them turning grocery errands into something between a game and a small adventure.<br><br>But San catches herself wondering, somewhere between the fourth and fifth unusual request, why any of this is happening at all. Her appetite has never worked like this before.",
    8: "If anything were actually wrong, San reasons, she'd feel it. That's how it's always worked — illness announces itself, one way or another. Fatigue. Nausea. Some unmistakable sense that something's off.<br><br>None of that is here. If anything, she feels better than usual — steady, clear-headed, unusually well for someone whose eating habits have gone this strange. It's the reassurance that keeps her from worrying, and also, without her realizing it, the exact reason she doesn't reach for the obvious explanation.<br><br>Nothing about this fits any pattern she recognizes. So she stops looking for one.",
    9: "She doesn't plan to bring it up. It comes out anyway, quiet, at the end of an ordinary evening, in the tone she uses for things she's been turning over longer than she's admitted.<br><br>\"Something feels different,\" she tells Joel. \"About my body. I don't know if it's anything.\"<br><br>He doesn't dismiss it, and he doesn't panic either. \"Let's get someone to actually look,\" he says.<br><br>Not Jovie, not Dr. AA — competent as they both are, this isn't quite in their wheelhouse. What San's describing doesn't sound like anything human medicine has a name for. It sounds like something that needs someone who actually understands Veyren bodies.<br><br>That's how they end up asking after Maera Veyr — a healer and midwife with decades of experience treating Veyren patients, someone San's heard mentioned in passing more than once but never actually met.",
    10: "Maera doesn't rush into anything, and she doesn't try to sound mystical about it either. She's a healer first — decades of Veyren patients behind her, decades of childbirth attended — and the exam she begins with San is exactly that: an exam, methodical and familiar to her even if none of it is familiar to San.<br><br>She starts with the vital signs. Pulse. Breathing. Temperature. Circulation. General vitality, appetite, sleep. San, by every one of these measures, is remarkably healthy — nothing here suggests illness of any kind, which matches exactly what San's been telling herself for weeks.<br><br>Then Maera moves to something San's never had checked before: her life-resonance. Every living Veyren carries a distinct signature, Maera explains, as familiar to a trained healer as a heartbeat. San should present as one coherent pattern.<br><br>She doesn't.<br><br>There's a second pattern there, faint, woven into San's own. Maera checks again. It doesn't go away.<br><br>Next she traces San's meridians — not hunting for illness this time, but for where San's own vitality is going. And some of it, unmistakably, is being redirected. Given, deliberately, to something else developing inside her.<br><br>This is the point Maera stops treating the exam as routine.<br><br>The last part is the one Veyren midwives have refined over generations without ever needing human instruments — a womb resonance reading, built specifically to detect developing life. Maera performs it once. Then again, to be sure of what she's finding.<br><br>She doesn't say anything yet. She sends for her senior midwife instead.",
    11: "The midwife who arrives has caught more Veyren babies into the world than she could easily count, and she doesn't need Maera's notes to know what she's looking for. She examines San independently, comparing what she finds against decades of her own experience, checking it against pattern after pattern she's encountered before.<br><br>The two of them compare findings quietly, out of San's immediate earshot, in the particular hush of two professionals confirming something neither wants to get wrong.<br><br>Then Maera comes back and sits with San properly.<br><br>\"San,\" she says. \"I believe you're carrying a child.\"<br><br>The room goes very quiet.<br><br>San looks at Joel. Joel looks at San. Neither of them says anything at all for a long moment — not because there's nothing to say, but because there's suddenly too much of it, all at once, with nowhere yet to put any of it.",
    12: "Maera doesn't end the examination there. Something about San's resonance still isn't sitting quite right against a single pregnancy — a shape to it that doesn't match what one developing life should look like.<br><br>She checks again, carefully.<br><br>Two distinct signatures. Not one pattern with an echo. Two, separate, both unmistakably real.<br><br>The midwives confirm it independently, the same way they confirmed everything else — methodically, without assumption, until there's no reasonable way to doubt it.<br><br>\"There are two,\" Maera says finally.<br><br>Joel blinks. \"Two?\"<br><br>\"Two children.\"<br><br>San doesn't manage a response right away. She'd barely had time to absorb one revelation before this one arrived on top of it — not a pregnancy she hadn't expected, but twins she hadn't even had time to imagine.<br><br>Joel reaches for her hand without either of them quite deciding to. Neither of them says anything for a while. There isn't really anything small enough to say."
  };
  window.ARC22_CHAPTER_SCENES = ARC22_CHAPTER_SCENES;

  window.arc22ObjectiveState = function(){
    if (!game.arc21Complete) return null;
    if (level() < 330) return null;
    game.comicProgress22 = game.comicProgress22 || {};
    for (const ch of ARC22_CHAPTERS) {
      if (!game.comicProgress22[ch.id]) return 'complete_arc22_chapter_' + ch.id;
    }
    return 'arc22_part1_complete_for_now';
  };

  window.markArc22ChapterRead = function(id){
    const so = window.arc22ObjectiveState();
    if (so !== ('complete_arc22_chapter_' + id)) return;
    game.comicProgress22 = game.comicProgress22 || {};
    game.comicProgress22[id] = true;
    const ch = ARC22_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC22_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC22_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  const oldRenderStoryForArc22 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc22) oldRenderStoryForArc22();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc22Ready = window.arc22ObjectiveState() !== null;
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<div class="story-act-kicker">Arc XXII</div><div class="story-act-title">The Child of Fair Tide</div>'+
      '<div class="story-act-tagline">Something new is growing.</div></div>';
    if (!arc22Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXII Locked</div><div class="story-chapter-sub">'+
        (!game.arc21Complete ? 'Finish Arc XXI first.' : 'Reach Level 330 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc22ObjectiveState();
    ARC22_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress22 && game.comicProgress22[ch.id]);
      const ready = !done && so===('complete_arc22_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc22ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc22_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXII chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
