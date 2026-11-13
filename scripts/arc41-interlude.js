(function(){
  // -------------------------------------------------------------------
  // INTERLUDE — CRIMSON TIDE: INTERLUDES ("Stories Between Horizons").
  // Thirteen bonus vignettes sitting between Arc XLI and Arc XLII, gated
  // identically to the Bridge chapter (arc41-bridge.js: arc41Complete +
  // level 630) but deliberately independent of both -- same relationship
  // arc20-interlude.js already has to Arc XXI/Arc XXII ("gated
  // identically... but deliberately independent of both"). This file's
  // own completion feeds nothing else, and neither the Bridge's nor
  // Arc XLII's own gate depends on it.
  //
  // Real comic art already exists for all thirteen chapters plus a cover
  // (assets/comics/interludes/ch01.webp .. ch13.webp, interludes-cover.
  // webp) -- titles, Part groupings and every line of dialogue below are
  // transcribed directly from San's own uploaded pages, not invented.
  //
  // Four Parts, each its own short pairing story, read start to finish
  // in order like every other arc's fixed chapter sequence:
  //   Part I   — A Deal Worth Keeping   (Ch.1-3): Aisyah & KW Liang --
  //              an old pre-Veyren trading arrangement from Brunei,
  //              still quietly running.
  //   Part II  — The Story She Never Told (Ch.4): Mimi & Brada Shah --
  //              one chapter on how an established couple actually got
  //              there, no grand declaration, just showing up.
  //   Part III — Someone Worth Returning To (Ch.5-10): Sairen & Jovie --
  //              a slow-burn that starts with an infirmary follow-up and
  //              ends on a handshake, not a declaration either.
  //   Part IV  — The Scholars' Dilemma (Ch.11-13): Renn & Erynn's own
  //              research partnership, Erynn's unspoken question about
  //              Maera, and a closing Ch.13 beat back with San & Joel --
  //              confirms the twins "have a room of their own" now (the
  //              same "bigger by Arc XLI" growth arc41-twins-classes.js
  //              already reads) and that Renn/Erynn's Horizon Engine
  //              work has quietly extended to letting Veyren phones
  //              reach each other over the Horizon Network -- noted here
  //              as flavor/worldbuilding only; no new mechanic is wired
  //              up for it in this file.
  // -------------------------------------------------------------------

  const ARC41_INTERLUDE_CHAPTERS = [
    {id:1, part:'Part I — A Deal Worth Keeping', title:'Kaya Kaya', focus:"The morning market at Fair Tide is already crowded when Aisyah finds KW Liang examining a shipment of provisions. They fall into the familiar rhythm of an arrangement that predates Veyren entirely -- Liang helped her procure supplies back in Brunei, long before either of them knew this world existed.", image:'assets/comics/interludes/ch01.webp', xp:260, action:'📋 Check the Quantities'},
    {id:2, part:'Part I — A Deal Worth Keeping', title:'The Things We Remember', focus:"At the harbour after hours, Aisyah and Liang trade old memories of the business she used to run and the orders he used to fill. Neither remembers every detail perfectly, and their friendship never required them to share every part of their lives. Trust, it turns out, is built through a hundred small promises kept.", image:'assets/comics/interludes/ch02.webp', xp:255, action:'🏮 Remember Brunei'},
    {id:3, part:'Part I — A Deal Worth Keeping', title:'Still a Good Deal', focus:"A delayed shipment threatens several Fair Tide deliveries. Liang already has an alternative route worked out -- it just means rearranging the cargo. They solve it the way they've always solved things, together, and part ways exactly the way they always have: 'There will definitely be a next time.'", image:'assets/comics/interludes/ch03.webp', xp:270, action:'📦 Rearrange the Cargo'},
    {id:4, part:'Part II — The Story She Never Told', title:'A Different Kind of Knowing', focus:"San finds Mimi arranging flowers Brada brought her -- again -- near the research chamber, and asks how the two of them actually became close. Mimi explains there wasn't one dramatic moment. He listens. He knows when she needs to stop working. There were simply many ordinary conversations, and the decision to keep showing up for them.", image:'assets/comics/interludes/ch04.webp', xp:280, action:'🌸 Ask How It Started'},
    {id:5, part:'Part III — Someone Worth Returning To', title:'An Unexpected Visitor', focus:"After an extended absence, Sairen returns to Fair Tide's infirmary for a minor injury. Jovie has kept supplies ready for him without being asked -- she remembered his habits even after so long away. 'Some people return without expecting anyone to notice,' the chapter closes. 'Others notice anyway.'", image:'assets/comics/interludes/ch05.webp', xp:270, action:'🩹 Sit Down'},
    {id:6, part:'Part III — Someone Worth Returning To', title:"The Questions She Doesn't Ask", focus:"Sairen returns for a follow-up. Jovie changes his dressing without once asking where he's been -- she'd rather ask whether he's eaten. For someone accustomed to being interrogated about his intentions, her plain, unforced kindness is unexpectedly disarming.", image:'assets/comics/interludes/ch06.webp', xp:270, action:'🍲 Accept the Bowl'},
    {id:7, part:'Part III — Someone Worth Returning To', title:'A Familiar Face', focus:"Between assignments, Sairen starts spending more time around Fair Tide, helping Jovie carry infirmary supplies without being asked twice. She tells him about the everyday work of the infirmary, the residents she's helped, the small frustrations of managing supplies. For once, he isn't gathering intelligence. He's just enjoying hearing her talk.", image:'assets/comics/interludes/ch07.webp', xp:275, action:'📦 Carry the Crate'},
    {id:8, part:'Part III — Someone Worth Returning To', title:'The Space Between Visits', focus:"This time, before he leaves Fair Tide again, Sairen actually tells Jovie beforehand. He can't promise a return date; she tells him not to promise one, and asks only that he tell her the truth instead. Trust, it turns out, doesn't require knowing everything -- only knowing which promises matter.", image:'assets/comics/interludes/ch08.webp', xp:280, action:"🚢 Tell Her Before You Go"},
    {id:9, part:'Part III — Someone Worth Returning To', title:'Someone Waiting', focus:"Sairen returns from another assignment and visits the infirmary without an injury this time, just to say hello. Fair Tide, he admits, has become somewhere he wants to return to -- because of the people here. Some more than others. For the first time, it isn't only duty bringing him back.", image:'assets/comics/interludes/ch09.webp', xp:285, action:"👋 Say Hello Anyway"},
    {id:10, part:'Part III — Someone Worth Returning To', title:'A Reason to Return', focus:"Sairen finds Jovie after her shift and is honest with her: he can't promise he'll always be here, and there are parts of his work he'll never be able to explain. She already knows both. What he'd like, he tells her, is to spend the time he does have with her. They shake on it, and keep walking. For a man used to disappearing, wanting to return is its own kind of beginning.", image:'assets/comics/interludes/ch10.webp', xp:300, action:'🤝 Shake on It'},
    {id:11, part:"Part IV — The Scholars' Dilemma", title:'An Interesting Distraction', focus:"Maera interrupts Renn and Erynn's research notes with information Erynn requested. The two of them dive straight into the findings with real enthusiasm. Erynn watches them for a moment before returning to his own calculations -- and when Renn later remarks that he seemed pleased to see her, Erynn only says, 'Nothing.'", image:'assets/comics/interludes/ch11.webp', xp:275, action:'📜 Look at This'},
    {id:12, part:"Part IV — The Scholars' Dilemma", title:'Two Scholars and a Question', focus:"With the research chamber finally quiet, Renn asks Erynn whether he ever thinks about settling down -- with someone. Erynn deflects, insists Renn is asking about Maera, and admits only that it's 'perhaps one day... the only one I have.' Some stories have already found their beginnings. Others are still waiting for an unexpected arrival.", image:'assets/comics/interludes/ch12.webp', xp:290, action:'🔭 Ask the Question'},
    {id:13, part:"Part IV — The Scholars' Dilemma", title:'Just One?', focus:"San returns to the Captain's Quarters to find Joel reading a message on his phone -- thanks to Renn and Erynn's work on the Horizon Engine, Veyren phones can now reach each other across the Horizon Network. The twins have a room of their own now, and bigger plans of their own. Thinking of the kids, San and Joel realize they'll soon have time to themselves again. Sairen is probably going to regret his decision to stay at Fair Tide.", image:'assets/comics/interludes/ch13.webp', xp:320, action:'💋 Just One'}
  ];
  window.ARC41_INTERLUDE_CHAPTERS = ARC41_INTERLUDE_CHAPTERS;

  const ARC41_INTERLUDE_CHAPTER_SCENES = {
    1: "The morning market at Fair Tide is already crowded when Aisyah finds KW Liang examining a shipment of provisions, a small white rabbit perched beside his ledger.<br><br>\"Liang. Have you checked the quantities?\"<br><br>\"Good morning to you too, Kaya Kaya.\"<br><br>\"You still call me that?\"<br><br>\"Would you prefer something more formal?\"<br><br>\"I'd prefer you finish counting.\"<br><br>He laughs and hands her the ledger. They work through the shipment together, falling into the familiar rhythm of people who have handled countless transactions before — long before either of them had ever heard the name Veyren.<br><br>Aisyah remembers how Liang helped her procure supplies back in Brunei, in a life that feels like someone else's now.<br><br>\"You were always good at finding things.\"<br><br>\"And you were always good at finding customers.\"<br><br>\"That was the arrangement.\"<br><br>\"Still works, doesn't it?\"<br><br>\"Your assistant is stealing,\" she adds, nodding at the rabbit's nose already in an open crate.<br><br>\"He's inspecting.\"<br><br>For a moment, standing in a market that belongs to a world neither of them was born into, the whole unfamiliar place feels remarkably familiar.",
    2: "At the harbour after hours, Aisyah and Liang sit with a lantern between them and a sleepy rabbit curled on the ledger, trading old memories of the business she used to run.<br><br>\"You used to order quite a lot.\"<br><br>\"I was running a business.\"<br><br>\"Several, judging by the messages.\"<br><br>\"You never complained.\"<br><br>\"I complained plenty. You just ignored me.\" They laugh.<br><br>Aisyah remembers how much work actually went into keeping that business running. Liang remembers helping her find suppliers, arrange purchases, make it all work.<br><br>\"We weren't always together. We had our own lives.\"<br><br>\"Of course.\"<br><br>\"But I knew I could ask you.\"<br><br>\"And I knew you'd eventually ask.\"<br><br>\"You make that sound terrible.\"<br><br>\"Kaya Kaya, you kept me busy.\"<br><br>Neither of them remembers every detail perfectly. Their friendship never required them to share every part of their lives. Trust, San has always thought, is sometimes built through a hundred small promises kept — and this, watching the two of them from a distance, looks like exactly that.",
    3: "A delayed shipment threatens several Fair Tide deliveries. Liang has already identified an alternative route, but it means rearranging the cargo.<br><br>\"That won't fit.\"<br><br>\"It will.\"<br><br>\"Not with those crates.\"<br><br>\"Then we move the crates.\"<br><br>\"And the provisions?\"<br><br>\"You really haven't changed.\"<br><br>\"Neither have you.\"<br><br>They sketch out Plan B right there on the dock — crates moved, cargo rearranged, the rabbit supervising from a safe distance — and get it loaded before the tide turns.<br><br>\"Everything settled?\"<br><br>\"Yes.\"<br><br>\"Your sister is a demanding customer.\"<br><br>\"I know.\"<br><br>\"Don't encourage him.\"<br><br>\"Until next time, Kaya Kaya.\"<br><br>\"There will definitely be a next time.\"<br><br>They have separate lives now, built on separate continents of this new world. Their friendship remains exactly what it always was. The best arrangements, Aisyah thinks, watching him go, were never the ones written into any contract.",
    4: "San finds Mimi arranging flowers in a vase near the research chamber.<br><br>\"Those are pretty.\"<br><br>\"Brada brought them.\"<br><br>\"Again?\"<br><br>\"You make it sound unusual.\"<br><br>\"I was wondering how the two of you became so close.\"<br><br>Mimi considers the question properly rather than brushing it off. \"He listens,\" she says. \"And he knows when I need to stop working.\"<br><br>\"That's a good start.\"<br><br>\"Renn and Erynn could probably use someone like that.\"<br><br>\"They're very good at ignoring advice.\"<br><br>\"I noticed.\"<br><br>Mimi explains that Brada has learned to recognize when her responsibilities become overwhelming, the way she's learned to appreciate the quieter parts of his life in turn.<br><br>\"So there wasn't one particular moment?\"<br><br>\"There were many.\"<br><br>Brada arrives to collect her for a meal. \"Ready?\" \"Almost.\"<br><br>Not every love story begins with a dramatic encounter, San thinks, watching the two of them head off together into the evening light over the harbour. Some are simply built from the decision to keep showing up.",
    5: "After an extended absence, Sairen returned to Fair Tide, a bandage already wrapped carelessly around one hand.<br><br>\"You're back,\" Jovie says, looking up from the infirmary counter.<br><br>\"Apparently.\"<br><br>\"Sit down.\"<br><br>\"It's nothing serious.\"<br><br>\"Then this won't take long.\"<br><br>\"You could have come sooner.\"<br><br>\"I was occupied.\"<br><br>\"You usually are.\"<br><br>She cleans the wound efficiently, without ceremony. He notices — quietly, almost against his own instincts — that she's remembered his habits, even after so long away.<br><br>\"Were you expecting me?\"<br><br>\"I keep supplies ready for everyone.\"<br><br>\"Of course.\"<br><br>Some people return without expecting anyone to actually notice. Others, he's learning, notice anyway.",
    6: "Sairen returns to the infirmary for a follow-up. Jovie changes his dressing without once asking where he's been.<br><br>\"You're not going to ask?\"<br><br>\"Would you answer?\"<br><br>\"Probably not.\"<br><br>\"Then I'd rather ask whether you've eaten.\"<br><br>\"Not recently.\"<br><br>\"I thought so.\"<br><br>She hands him a bowl, steam still rising off it.<br><br>\"You always do this?\"<br><br>\"Feed difficult patients?\"<br><br>\"I was going to say look after people.\"<br><br>\"Both.\"<br><br>For someone accustomed to being questioned closely about his intentions, her straightforward kindness is unexpectedly, thoroughly disarming — the kind of plain decency that doesn't ask anything of him in return.",
    7: "Between assignments, Sairen has begun spending more time around Fair Tide. He finds Jovie carrying a crate of supplies toward the infirmary.<br><br>\"Need help?\"<br><br>\"Are you offering?\"<br><br>\"I believe that's what the question means.\"<br><br>\"Good. Take this.\"<br><br>\"You didn't hesitate.\"<br><br>\"Neither did you.\"<br><br>She tells him, as they walk, about the everyday work of the infirmary — the residents she's helped, the occasional frustrations of managing supplies, the small satisfactions nobody outside the job would notice.<br><br>For once, he isn't gathering intelligence. He simply enjoys hearing her talk — plainly, without an angle, without working out what any of it is for.",
    8: "Sairen leaves Fair Tide again. This time he tells Jovie beforehand.<br><br>\"I'll be away for a while.\"<br><br>\"I assumed you would.\"<br><br>\"I don't know exactly when I'll return.\"<br><br>\"Then don't promise a date.\"<br><br>\"Does that bother you?\"<br><br>\"Not knowing? Sometimes. But I'd rather you tell me the truth.\"<br><br>Sairen has spent much of his life surviving through secrecy. Her answer gives him something unfamiliar to actually consider.<br><br>\"I'll come back when I can.\"<br><br>\"Then I'll see you when you do.\"<br><br>Trust, it turns out, doesn't require knowing everything. It only requires knowing which promises actually matter.",
    9: "Sairen returns to Fair Tide after another assignment. This time, he visits the infirmary without an injury.<br><br>\"You're not hurt.\"<br><br>\"Disappointed?\"<br><br>\"Relieved.\"<br><br>\"I thought I'd come and say hello.\"<br><br>\"You could have done that without making me examine you every time.\"<br><br>\"I'm learning.\"<br><br>They walk together along the harbour, the evening settling gold over the water.<br><br>\"Fair Tide has become somewhere I want to return to.\"<br><br>\"Because of the people here?\"<br><br>\"Some more than others.\"<br><br>For the first time, it isn't only duty bringing him back to Fair Tide. It's someone who's actually waiting for him here.",
    10: "The harbour is quiet when Sairen finds Jovie after her shift.<br><br>\"I've been thinking.\"<br><br>\"That sounds dangerous.\"<br><br>\"I've been told. I can't promise I'll always be here. And there are things about my work I won't always be able to explain.\"<br><br>\"I know. I know that too.\"<br><br>\"But I'd like to spend the time I do have with you.\"<br><br>\"I'd like that.\"<br><br>They shake on it, plainly, the way two people settle something that actually matters to both of them.<br><br>They continue walking beside the water afterward. Neither knows exactly what their future will look like. For now, they've chosen to find out together.<br><br>For a man accustomed to disappearing, wanting to return is its own kind of beginning.",
    11: "Renn and Erynn are reviewing research notes when Maera arrives.<br><br>\"Am I interrupting?\"<br><br>\"Not at all,\" Renn says.<br><br>\"We're in the middle of a calculation,\" Erynn adds.<br><br>\"Which can wait,\" Renn says immediately. \"I found the information you wanted,\" Maera says, holding up a sealed note.<br><br>\"Excellent! Come and look at this.\"<br><br>They begin discussing the findings with considerable enthusiasm. Erynn watches them for a moment before returning to his own calculations.<br><br>Later, when Maera leaves — \"You seemed pleased to see her.\"<br><br>\"Naturally. She's helpful.\"<br><br>\"What?\"<br><br>\"Nothing.\"",
    12: "The research chamber has finally become quiet.<br><br>\"Do you ever think about settling down?\" Renn asks.<br><br>\"We have settled down. We live in a settlement full of people.\"<br><br>\"I meant with someone.\"<br><br>\"Are you asking because of Maera?\"<br><br>\"You're deliberately misunderstanding me.\"<br><br>\"How thoughtful.\"<br><br>\"I was asking about you.\"<br><br>\"Someone should.\"<br><br>\"That's not much of an answer.\"<br><br>\"Perhaps one day. It's the only one I have.\"<br><br>Outside, the lights of Fair Tide reflect across the harbour. Neither scholar knows what lies beyond the next horizon. For now, there is still work to do. Some stories have already found their beginnings. Others are still waiting for an unexpected arrival.",
    13: "San gets called away to Fair Tide. When she gets back to the Captain's Quarters, she finds Joel leaning back on the couch, staring at his phone screen.<br><br>Thanks to Renn and Erynn, they've figured out how to make Veyren technology and their old-world phones work together. No access to anything resembling social media — but their phones can now connect to the Horizon Network to reach each other, and that alone is more than either of them expected to still have.<br><br>They'd done something like this once before, back when the twins were small enough to need watching every moment. Now Vaeren and Joelle have a room of their own, and — San suspects, watching Joel's face — bigger plans of their own entirely.<br><br>\"Just one?\" Joel asks, setting the phone aside.<br><br>San leans down and kisses him. Then again. Then doesn't stop for a while.<br><br>Thinking of the kids, she realizes: very soon, the two of them are going to have time to each other again.<br><br>Sairen, San thinks, is probably going to regret his decision to stay at Fair Tide."
  };
  window.ARC41_INTERLUDE_CHAPTER_SCENES = ARC41_INTERLUDE_CHAPTER_SCENES;

  window.arc41InterludeObjectiveState = function(){
    if (!game.arc41Complete) return null;
    if (level() < 455) return null;
    game.comicProgress41Interlude = game.comicProgress41Interlude || {};
    for (const ch of ARC41_INTERLUDE_CHAPTERS) {
      if (!game.comicProgress41Interlude[ch.id]) return 'complete_interlude41_chapter_' + ch.id;
    }
    return 'interlude41_complete_for_now';
  };

  window.markArc41InterludeChapterRead = function(id){
    const so = window.arc41InterludeObjectiveState();
    if (so !== ('complete_interlude41_chapter_' + id)) return;
    game.comicProgress41Interlude = game.comicProgress41Interlude || {};
    game.comicProgress41Interlude[id] = true;
    if (id === ARC41_INTERLUDE_CHAPTERS.length) game.arc41InterludeComplete = true;
    const ch = ARC41_INTERLUDE_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC41_INTERLUDE_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC41_INTERLUDE_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  const oldRenderStoryForInterlude41 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForInterlude41) oldRenderStoryForInterlude41();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const interludeReady = window.arc41InterludeObjectiveState() !== null;
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/interludes/interludes-cover.webp" alt="Crimson Tide — Interludes" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Interlude</div><div class="story-act-title">Crimson Tide — Interludes</div>'+
      '<div class="story-act-tagline">Stories between horizons.</div></div>';
    if (!interludeReady) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Interlude Locked</div><div class="story-chapter-sub">'+
        (!game.arc41Complete ? 'Finish Arc XLI first.' : 'Reach Level 455 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc41InterludeObjectiveState();
    let lastPart = null;
    ARC41_INTERLUDE_CHAPTERS.forEach(function(ch){
      if (ch.part !== lastPart) {
        lastPart = ch.part;
        html += '<div class="story-chip" style="margin-top:10px;font-weight:bold;">'+esc(ch.part)+'</div>';
      }
      const done = !!(game.comicProgress41Interlude && game.comicProgress41Interlude[ch.id]);
      const ready = !done && so===('complete_interlude41_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action =
          '<button class="btn btn-small btn-success" onclick="markArc41InterludeChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='interlude41_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All thirteen Interlude chapters read.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
