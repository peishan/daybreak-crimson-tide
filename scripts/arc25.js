(function(){
  // -------------------------------------------------------------------
  // ARC XXV — A FRIEND'S REQUEST. Gated at arc24Complete + level 375,
  // continuing the established +15-per-arc ladder (XXII:330, XXIII:345,
  // XXIV:360, XXV:375). Ch.18 sets game.arc25Complete = true, matching
  // every other arc's own finale flag.
  //
  // Deliberately smaller in scale than Arc XXIV, per the outline's own
  // note — 18 chapters instead of 24, a personal Joy/Caelan story rather
  // than a Fair-Tide-wide one, with the Nameless thread left entirely
  // alone here. No new gameplay systems are introduced by this arc — per
  // the outline, this is a character arc, not a mechanics arc, so unlike
  // Arc XXIII/XXIV there is no companion arc25-mechanics.js file. That's
  // a deliberate scope call, not an oversight.
  //
  // Per the outline's own "emotional center" note (Ch.11-14): this arc
  // is NOT "Joy asks San to solve Caelan's problem." The request only
  // gets everyone there — the actual story is Joy and Caelan learning
  // the same lesson San and Joel already had to learn, in their own
  // distinct shape rather than a repeat of San/Joel's dynamic. The
  // outline's own core exchange —
  //   Joy: "If something hurts you, I want to protect you from it."
  //   Caelan: "You don't always have to."
  //   Joy: "Then what am I supposed to do?"
  //   Caelan: "Stay."
  // — lands at the Ch.12 turning point (Caelan turning the lesson back
  // on Joy) and is deliberately echoed, not repeated verbatim, in Ch.18's
  // quiet finale.
  //
  // Ch.17's "friend request" joke is written for what it is per the
  // outline — a warm, comedic beat, not a mechanical hook. Nothing in
  // this file treats it as an actual future gameplay favor to redeem.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC25_CHAPTERS = [
    {id:1, title:"A Friend's Request", focus:"Joy approaches San privately — she needs the Crimson Tide's help with something connected to Caelan, but she doesn't want it treated as official Fair Tide business. San notices right away how unusually hesitant Joy is about asking at all.", image:'assets/comics/arc25/ch01-a-friends-request.png', xp:260, action:'🤝 Hear Her Out'},
    {id:2, title:'Not Captain to Warden', focus:"San draws the distinction plainly: Joy isn't petitioning the Captain, she's asking a friend. Joel comes along because San is going, but the three of them agree to keep this expedition deliberately small.", image:'assets/comics/arc25/ch02-not-captain-to-warden.png', xp:270, action:'⚓ Keep It Small'},
    {id:3, title:'Caelan Already Knows', focus:"The attempt at secrecy doesn't survive contact with Caelan, who knows Joy far too well not to notice. Rather than getting angry, he simply asks what she's trying to protect him from — the first real focus on their relationship this arc.", image:'assets/comics/arc25/ch03-caelan-already-knows.png', xp:280, action:"❓ Ask What She's Protecting"},
    {id:4, title:'Something Left Behind', focus:"Joy finally explains it: something from Caelan's past, or from a community that mattered to him, needs help. Caelan had already accepted he couldn't fix it. Joy hasn't accepted that at all.", image:'assets/comics/arc25/ch04-something-left-behind.png', xp:280, action:'📦 Explain the Problem'},
    {id:5, title:'The Builder', focus:"We see Caelan away from Fair Tide, where he isn't simply the man who can build and repair almost anything. Here, people remember who he was before Fair Tide ever existed.", image:'assets/comics/arc25/ch05-the-builder.png', xp:280, action:'🔧 Meet the Builder'},
    {id:6, title:'The Warden', focus:"Joy falls naturally into protector mode, treating Caelan's problem almost like a threat she can physically stand between him and. Caelan gently points out that not everything hurting him is something that can actually be fought.", image:'assets/comics/arc25/ch06-the-warden.png', xp:280, action:'🛡️ Stand Between'},
    {id:7, title:'What Was Broken', focus:"They reach the place at the heart of Joy's request. The problem isn't a monster or an enemy — it's something damaged, abandoned, or failing that Caelan once genuinely cared about.", image:'assets/comics/arc25/ch07-what-was-broken.png', xp:290, action:'🏚️ Reach What Was Broken'},
    {id:8, title:'Built to Last', focus:"Caelan starts assessing what can actually still be saved. His infrastructure skills become the real solution here, not background flavor — the same understanding that maintaining something matters as much as building it in the first place.", image:'assets/comics/arc25/ch08-built-to-last.png', xp:290, action:'🔨 Assess the Damage'},
    {id:9, title:"Joy's Way", focus:"Trouble arrives while Caelan works. Joy handles it — and it's easy to see exactly why she became Fair Tide's Warden. Caelan creates places worth protecting. Joy is the reason those places stay standing.", image:'assets/comics/arc25/ch09-joys-way.png', xp:300, action:'⚔️ Hold the Perimeter'},
    {id:10, title:'Side by Side', focus:"Rather than splitting into \"Joy fights, Caelan builds,\" the two of them have to actually work together — his construction opens up defensive footing, and her protection buys him the time he needs to finish it.", image:'assets/comics/arc25/ch10-side-by-side.png', xp:300, action:'🤝 Work Side by Side'},
    {id:11, title:'The Things We Carry Home', focus:"A quiet evening. Joy and Caelan finally talk through why this mattered so much to her — she admits that watching him carry something alone bothered her far more than the actual problem ever did.", image:'assets/comics/arc25/ch11-the-things-we-carry-home.png', xp:300, action:'🌙 Talk It Through'},
    {id:12, title:'You Could Have Asked', focus:'Caelan turns the point back on her: Joy carries things alone too, in her own way. Theirs isn\'t one person rescuing the other — it\'s the same habit, worn differently by each of them.', image:'assets/comics/arc25/ch12-you-could-have-asked.png', xp:310, action:'💭 Turn It Back'},
    {id:13, title:'San Understands', focus:"San recognizes something painfully familiar in the two of them — she and Joel had to learn the exact same lesson. Partnership was never about shielding someone from every burden. Sometimes it's simply letting them share yours.", image:'assets/comics/arc25/ch13-san-understands.png', xp:300, action:'💞 Recognize the Pattern'},
    {id:14, title:'What Friends Are For', focus:"The situation has grown larger than Joy expected, and she finally stops treating the expedition as a debt owed to San. San tells her, plainly, that friendship was never a ledger to begin with.", image:'assets/comics/arc25/ch14-what-friends-are-for.png', xp:300, action:'🎁 Let It Go'},
    {id:15, title:'Hold the Line', focus:"The arc's major action chapter. Joy leads the defense while Caelan completes the critical repair. San, Joel, and the others support from the edges — but this is Joy and Caelan's problem to solve, and they solve it themselves.", image:'assets/comics/arc25/ch15-hold-the-line.png', xp:380, action:'🛡️ Hold the Line'},
    {id:16, title:'Still Standing', focus:"The danger passes. What they came to preserve survives — not perfectly restored, but genuinely viable. Caelan deliberately leaves visible evidence of the repair rather than disguising it: surviving and rebuilding are part of its history now too.", image:'assets/comics/arc25/ch16-still-standing.png', xp:310, action:'🏗️ See What Survived'},
    {id:17, title:'The Request Returned', focus:'Back at Fair Tide, Caelan jokes to San that since Joy already used her "friend request," he\'s entitled to one of his own someday. San agrees easily. Joy objects that this is apparently not how friendship is supposed to work.', image:'assets/comics/arc25/ch17-the-request-returned.png', xp:300, action:'😂 Claim the Favor'},
    {id:18, title:'Home Is Something We Build', focus:"A quiet finale at Fair Tide. Caelan returns to his ordinary work, Joy returns to her Warden duties — but something between them has shifted. They're both more willing now to ask each other, and their friends, for help.", image:'assets/comics/arc25/ch18-home-is-something-we-build.png', xp:340, action:'🏠 Come Home'}
  ];
  window.ARC25_CHAPTERS = ARC25_CHAPTERS;

  const ARC25_CHAPTER_SCENES = {
    1: "Joy finds San alone, which is itself the first sign that something about this conversation is different.<br><br>\"I need the Crimson Tide's help,\" she says, and then, before San can answer, adds quickly: \"Not — not as Fair Tide. Not officially. I don't want a Council matter made out of this.\"<br><br>San studies her for a moment. Joy asks for almost nothing, for herself. She hands out help constantly and rarely seems to notice she might be owed any back.<br><br>\"Is it Caelan?\" San asks, mostly a guess, and watches it land.<br><br>Joy doesn't answer right away, which is answer enough.<br><br>\"Okay,\" San says gently. \"Tell me.\"",
    2: "San makes the distinction plainly, before Joy can talk herself out of asking at all.<br><br>\"You're not petitioning the Captain,\" she says. \"You're asking a friend. Those are different conversations, and I want you to actually have the second one.\"<br><br>Joy exhales like she'd been bracing for a much more complicated answer.<br><br>Joel comes too, mostly because San is going and he isn't about to let her sail off into an unspecified situation without him — but all three of them agree, without much debate, to keep this small. No fleet. No fanfare. Whatever this is, it isn't a Fair Tide expedition. It's just people going somewhere for a friend.",
    3: "The plan to keep this quiet from Caelan lasts almost no time at all.<br><br>He finds Joy checking gear a full day earlier than any scheduled voyage, with San and Joel both suspiciously present, and doesn't need to ask more than one question before he's already worked out roughly what's happening.<br><br>He isn't angry about it. That's the part that catches Joy off guard.<br><br>\"What are you trying to protect me from?\" he asks instead, quiet and direct, in the tone of someone who already half-knows the answer and wants to hear her say it anyway.<br><br>Joy doesn't have a clean answer ready. For the first time since this started, the conversation isn't about logistics at all — it's just the two of them, looking at each other a little too honestly.",
    4: "Joy finally says it plainly, because there's no version of this where she can keep dancing around it with Caelan standing right in front of her.<br><br>Something from before Fair Tide — a place, a project, a community that mattered to him once — is failing, or already fallen, and nobody's been able to do anything about it.<br><br>\"I already made my peace with that one,\" Caelan says, quiet but not bitter. \"It happens. Things don't always last, no matter how well you built them.\"<br><br>\"I haven't,\" Joy says. \"Made my peace with it, I mean.\"<br><br>Caelan looks at her a long moment, working out that this was never really about the thing that broke. It was about her, watching him carry it, and not being able to just leave it there.",
    5: "The place they sail toward isn't anywhere San or Joel have ever been, and it becomes obvious fast that Caelan is known here in a way Fair Tide never quite sees.<br><br>An old craftsman clasps his hand like greeting someone back from a long absence. A woman running a stall calls him by a nickname San has genuinely never heard before. Someone else asks, without any of Fair Tide's usual deference, whether he's finally going to fix that thing he never finished.<br><br>At Fair Tide, Caelan is the man who can build and repair almost anything, quietly essential, rarely questioned. Here, he's just someone who used to belong, before circumstances carried him somewhere else. San watches him navigate both versions of himself and understands, a little better, how much of him Fair Tide has actually only met the newer half of.",
    6: "Joy treats the entire situation like a threat from the moment they arrive — assessing exits, watching who comes and goes, positioning herself between Caelan and anything that so much as looks unfamiliar.<br><br>San notices before Caelan says anything about it.<br><br>\"There's nothing to fight here,\" Caelan tells her eventually, gently enough that it doesn't land like a correction. \"Not yet, anyway. This isn't an enemy. It's just something falling apart because nobody's had the time or the hands to stop it.\"<br><br>Joy doesn't fully stand down. But something in her expression shifts — the particular frustration of a Warden discovering that not every danger to someone she loves comes with something she can actually swing a weapon at.",
    7: "What they finally reach isn't dramatic, in the way San half-expected after everyone's tension on the way here. No monster. No enemy waiting to be fought.<br><br>Just something damaged — old infrastructure Caelan clearly built or maintained once, now failing under years of neglect nobody was ever cruel enough to cause on purpose. It simply happened, the way things fall apart when nobody's left with the time, the tools, or the standing to stop it.<br><br>Caelan goes quiet looking at it, in a way San hasn't seen from him before. Not devastated, exactly. Just present with something he'd genuinely believed he'd already grieved.<br><br>\"I thought I was done thinking about this place,\" he says.<br><br>Joy doesn't say anything. She just stays close enough that he knows she isn't going anywhere.",
    8: "Once the initial weight of it passes, Caelan does what Caelan actually does — he starts assessing, methodically, exactly what can still be saved.<br><br>Not everything, it turns out. Some of it's too far gone to recover. But more survives than anyone expected, once someone with his particular understanding actually looks closely instead of assuming the worst from a distance.<br><br>\"This wasn't built to be permanent without upkeep,\" he says, half to himself, running a hand along a support strut that's held longer than it should have. \"Nothing is. That's not a flaw. That's just what maintaining something actually means.\"<br><br>San watches him work and understands, freshly, why Fair Tide runs as well as it does — not because things there were built once and left alone, but because somebody like Caelan never stopped treating upkeep as part of the job.",
    9: "The trouble arrives exactly when Caelan is elbow-deep in the repair and least able to defend himself, which is precisely the moment Joy has clearly been expecting since they arrived.<br><br>She doesn't hesitate. She doesn't call for help she doesn't need. She simply moves into position, reads the threat faster than anyone else present, and holds the line between it and Caelan without a wasted motion.<br><br>San, watching from a few steps back, understands something about Joy she'd known in theory but never quite seen in practice: Caelan builds the places worth protecting. Joy is the entire reason those places get to stay standing long enough to matter.",
    10: "It becomes obvious fast that splitting this into \"Joy fights, Caelan builds\" doesn't actually work — not here, not with the two problems this tangled together.<br><br>Caelan's half-finished repairs open up footing Joy can use to hold a line she couldn't have held on open ground. Joy's protection buys Caelan the minutes he needs to finish a join he can't safely rush. Neither piece works well without the other under it.<br><br>By the time the immediate danger passes, they're not moving like two people who happened to be in the same place. They're moving like two people who've quietly figured out, without ever discussing it, exactly how to cover for each other.",
    11: "That evening, with the worst of it behind them, Joy and Caelan finally sit down together properly — no urgency, no threat, just the two of them and the quiet aftermath.<br><br>\"I need to tell you something,\" Joy says, \"and it's going to sound smaller than it actually is.\"<br><br>Caelan waits.<br><br>\"It wasn't really the — the thing itself,\" she says. \"The building, the damage. That bothered me. But watching you carry it by yourself, all this time, and never once say anything — that bothered me more. A lot more.\"<br><br>Caelan doesn't answer right away. He just looks at her for a long moment, like he's only now understanding what actually brought her all the way out here.",
    12: '"You could have just asked me to come with you," Caelan says finally. "You didn\'t have to turn it into an entire secret expedition."<br><br>"I know."<br><br>"You do the same thing you\'re upset about me doing," he says, not unkindly — just honestly. "You carry things alone too. You just call it being the Warden instead of calling it what it actually is."<br><br>Joy opens her mouth to argue and doesn\'t, because he\'s not wrong, and they both know it.<br><br>"If something hurts you," she says slowly, "I want to protect you from it."<br><br>"You don\'t always have to."<br><br>"Then what am I supposed to do?"<br><br>Caelan takes her hand.<br><br>"Stay," he says. "That\'s it. That\'s the whole thing."',
    13: "San watches the two of them from a small distance and recognizes it immediately, in a way that catches her off guard a little.<br><br>\"That's us,\" she says quietly to Joel later. \"That's exactly the lesson you and I had to learn.\"<br><br>\"Which part?\" Joel asks.<br><br>\"That loving someone isn't the same as protecting them from every single thing that could ever hurt them,\" San says. \"Sometimes it's just... letting them hand you half of it. Not fixing it for them. Just not making them hold all of it by themselves.\"<br><br>Joel doesn't say anything for a moment, just takes her hand the way he's done a hundred times since they first learned that lesson the hard way themselves.<br><br>\"Good thing somebody finally told them,\" he says eventually.<br><br>\"Nobody told them,\" San says. \"They just figured it out. Same as we did.\"",
    14: "Somewhere in the quiet after everything, Joy tries to thank San properly — formally, almost, the way she thanks people for things she feels she owes.<br><br>San stops her before she gets very far into it.<br><br>\"You don't have to pay this back,\" she says. \"You're not keeping a ledger with me, Joy. You never had to be.\"<br><br>\"I just — you dropped everything. You brought Joel. You didn't even ask what it was about before you said yes.\"<br><br>\"That's what friends are for,\" San says simply. \"Not a favor you owe me later. Just — this is what it looks like when someone asks.\"<br><br>Joy doesn't have a ready answer for that. She just sits with it, letting it actually land, instead of immediately calculating how to even the score.",
    15: "The real danger arrives at the worst possible moment, the way it always does — right as Caelan reaches the part of the repair that can't be interrupted without losing everything already done.<br><br>Joy takes the line without waiting to be asked, calling out exactly what she needs and nothing she doesn't. San, Joel, and the others hold the edges, covering what Joy can't reach alone — but this fight belongs to Joy and Caelan, and everyone else there understands that without needing it said aloud.<br><br>Caelan works through the noise of it, hands steady on a repair that has to be exactly right the first time. Joy holds the space around him like it's the only thing in the world that matters, because right now, it is.<br><br>It comes down to the last possible second — Caelan's final join locking into place just as Joy closes the last gap in the line. Neither of them could have done it without the other.",
    16: "What they came to save survives.<br><br>Not perfectly. Not the way it looked before it started failing, or before Caelan ever left it behind in the first place. But it stands, and it holds, and that turns out to be enough.<br><br>Caelan does something San doesn't expect, once the repair is finished — he leaves the visible seams of it exactly as they are, rather than smoothing them over to hide that anything was ever broken at all.<br><br>\"Why not make it look untouched?\" San asks.<br><br>\"Because it wasn't,\" Caelan says. \"It broke, and somebody came back for it, and it's still standing anyway. That's not something to hide. That's the actual story of the place now.\"<br><br>Joy, standing close beside him, doesn't say anything. She doesn't have to.",
    17: 'Back at Fair Tide, once everyone\'s finally rested and fed, Caelan brings it up with exactly the amount of mock-seriousness the moment calls for.<br><br>"So Joy used her friend request," he says to San. "I assume that means I\'m owed one of my own, eventually. Whenever I need it."<br><br>"Obviously," San says, entirely straight-faced.<br><br>"That is not how this works," Joy says, somewhere between exasperated and laughing. "Friendship isn\'t a — a coupon system."<br><br>"Feels like it should be," Caelan says.<br><br>"You two are impossible," Joy says, but she\'s smiling despite herself, and San notices she doesn\'t actually argue the point very hard.',
    18: "Fair Tide settles back into its ordinary rhythm quickly enough. Caelan returns to the Workshop, elbow-deep in some new repair before the week is even out. Joy returns to her rounds, watching over the settlement the way she always has.<br><br>Nothing about their routines looks any different from the outside.<br><br>But something underneath it has shifted, quietly and for good. Joy mentions, in passing, an ordinary thing she's finding difficult, instead of simply handling it alone and saying nothing. Caelan, a few days later, actually asks Aisyah for help with something he could have muscled through by himself.<br><br>San watches both of it happen and thinks, without needing to say it out loud, that a home was never something you build once and leave standing. It's something you keep choosing to hold up together — the same lesson, in the end, that Joy finally let herself learn: not fixing it for someone. Not disappearing under it alone, either.<br><br>Just staying."
  };
  window.ARC25_CHAPTER_SCENES = ARC25_CHAPTER_SCENES;

  window.arc25ObjectiveState = function(){
    if (!game.arc24Complete) return null;
    if (level() < 375) return null;
    game.comicProgress25 = game.comicProgress25 || {};
    for (const ch of ARC25_CHAPTERS) {
      if (!game.comicProgress25[ch.id]) return 'complete_arc25_chapter_' + ch.id;
    }
    return 'arc25_part1_complete_for_now';
  };

  window.markArc25ChapterRead = function(id){
    const so = window.arc25ObjectiveState();
    if (so !== ('complete_arc25_chapter_' + id)) return;
    game.comicProgress25 = game.comicProgress25 || {};
    game.comicProgress25[id] = true;
    // Matches every prior arc's own completion flag (arc23/arc24Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 18) game.arc25Complete = true;
    const ch = ARC25_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC25_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC25_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc25Splash = function(){
    const overlay = document.getElementById('arc25SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc25Splash = function(){
    const overlay = document.getElementById('arc25SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc25SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc25 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc25) oldRenderStoryForArc25();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc25Ready = window.arc25ObjectiveState() !== null;
    if (arc25Ready && !game.arc25SplashSeen && typeof window.__ctShowArc25Splash === 'function') {
      window.__ctShowArc25Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc25/arc25-cover-a-friends-request.png" alt="Arc XXV — A Friend\'s Request" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXV</div><div class="story-act-title">A Friend\'s Request</div>'+
      '<div class="story-act-tagline">Sometimes asking for help is harder than giving it.</div></div>';
    if (!arc25Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXV Locked</div><div class="story-chapter-sub">'+
        (!game.arc24Complete ? 'Finish Arc XXIV first.' : 'Reach Level 375 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc25ObjectiveState();
    ARC25_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress25 && game.comicProgress25[ch.id]);
      const ready = !done && so===('complete_arc25_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc25ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc25_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXV chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
