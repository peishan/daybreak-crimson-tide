(function(){
  // -------------------------------------------------------------------
  // ARC XVI — THE PRICE OF RARE THINGS. Now fully wired, Chapters 1-25 —
  // Part I ("The Rare Thing"), Part II ("What It Costs"), Part III
  // ("Those Who Protect It"), Part IV ("What Are We Willing to Take?"),
  // and Part V ("A Different Kind of Discovery"). Same pattern as every
  // prior arc — gating has always tracked what's actually playable, not
  // how much text exists upfront; this time text and wiring landed
  // together. Gated behind arc15Complete + level 240, continuing the
  // +15/arc pace (XIV=210, XV=225, XVI=240). Ch.25 completing sets
  // game.arc16Complete = true, same as every other arc's finale.
  //
  // Cover image paths for Ch.2-25 are placeholder guesses following the
  // established convention (ch0N-slugified-title.png) — flagged for
  // confirmation like every chapter image before this, since no art
  // exists yet to confirm the real filenames against.
  //
  // Ch.8's guardians are deliberately left unnamed/unspecified here —
  // San's own Ch.8 focus text says "people or beings," and Ch.10
  // ("The Dragon's Territory") is where dragons are actually confirmed
  // as part of this. Naming them here would spoil that reveal a chapter
  // early.
  //
  // Ch.14 calls window.triggerSanJoelDisagreement() on completion (see
  // below) — the cross-hook flagged as needed when the disagreement/
  // repair system was built. Ch.15 ("You Don't Have to Decide Alone")
  // and Ch.18 ("At Least You Know Now") are that same system's own
  // "understanding" and "repaired" states told as story beats — now
  // gated (via arc16InteractiveGateMessage, below) on the player having
  // actually reached those states in the Bonds tab first, rather than
  // completing for free on the normal sequential click-through. The
  // "Mark Chapter Read" button is replaced with a lock hint pointing at
  // the Bonds tab until the prerequisite is met; the chapter's own
  // comic stays readable throughout, only marking it complete is gated.
  // -------------------------------------------------------------------
  const ARC16_CHAPTERS = [
    {id:1, title:'The Material We Need', focus:"The Horizon Engine needs a rare material for its next upgrade. The crew begins researching where it might actually be found.", image:'assets/comics/arc16/ch01-the-material-we-need.png', xp:300, action:'🔍 Begin the Search'},
    {id:2, title:'A World Worth Exploring', focus:"The crew reaches a new world connected to the material and begins observing its environment rather than immediately collecting anything.", image:'assets/comics/arc16/ch02-a-world-worth-exploring.png', xp:280, action:'🌍 Observe the World'},
    {id:3, title:'The First Trace', focus:"Renn identifies evidence of the material. Erynn discovers historical references suggesting it has been deliberately protected.", image:'assets/comics/arc16/ch03-the-first-trace.png', xp:290, action:'🔎 Follow the Trace'},
    {id:4, title:'Something Alive', focus:"Soel senses something unusual around the material. What initially looks like a resource may be part of a living or spiritual ecosystem.", image:'assets/comics/arc16/ch04-something-alive.png', xp:300, action:'👁️ Sense What\'s There'},
    {id:5, title:'The Easy Way', focus:"The crew discovers that there is a straightforward way to obtain what they need—but doing so would cause damage.", image:'assets/comics/arc16/ch05-the-easy-way.png', xp:300, action:'⚠️ Weigh the Options'},
    {id:6, title:'What We Would Take', focus:"San considers whether the Horizon Engine's needs justify taking the material.", image:'assets/comics/arc16/ch06-what-we-would-take.png', xp:300, action:'⚖️ Weigh the Choice'},
    {id:7, title:'A Question of Value', focus:"Renn explains why the material would be enormously useful. Erynn explains why its value cannot be measured only by its usefulness.", image:'assets/comics/arc16/ch07-a-question-of-value.png', xp:290, action:'💭 Hear Them Both Out'},
    {id:8, title:'The Ones Who Protect It', focus:"The crew meets the people or beings responsible for protecting the material.", image:'assets/comics/arc16/ch08-the-ones-who-protect-it.png', xp:310, action:'🤝 Meet the Guardians'},
    {id:9, title:'Not a Treasure', focus:"They learn that the material is not considered a treasure by those who live there. It has another purpose entirely.", image:'assets/comics/arc16/ch09-not-a-treasure.png', xp:290, action:'❓ Ask What It\'s For'},
    {id:10, title:"The Dragon's Territory", focus:"The crew encounters dragons connected to the region. They discover that the dragons are part of the ecosystem rather than simply monsters guarding a resource.", image:'assets/comics/arc16/ch10-the-dragons-territory.png', xp:320, action:'🐉 Meet the Dragons'},
    {id:11, title:"What We Don't Know", focus:"San realizes they have been approaching the problem with too little information.", image:'assets/comics/arc16/ch11-what-we-dont-know.png', xp:290, action:'💭 Admit the Gap'},
    {id:12, title:'The Cost of Taking', focus:"The locals explain what would happen if the crew extracted the material in the way they originally planned.", image:'assets/comics/arc16/ch12-the-cost-of-taking.png', xp:310, action:'⚠️ Hear the Cost'},
    {id:13, title:'A Different Kind of Guardian', focus:"The crew learns why the material is protected and how the ecosystem has developed around it.", image:'assets/comics/arc16/ch13-a-different-kind-of-guardian.png', xp:300, action:'🛡️ Learn Their Reasons'},
    {id:14, title:'The Argument', focus:"San and Joel disagree over how aggressively they should pursue the Horizon Engine upgrade.", image:'assets/comics/arc16/ch14-the-argument.png', xp:310, action:'⚡ Face the Disagreement'},
    {id:15, title:"You Don't Have to Decide Alone", focus:"San struggles to explain why she feels responsible for finding a solution. She turns to the crew instead of trying to solve everything herself.", image:'assets/comics/arc16/ch15-you-dont-have-to-decide-alone.png', xp:300, action:'💭 Turn to the Crew'},
    {id:16, title:'What Everyone Knows', focus:"Renn, Erynn, Mimi, Aisyah, Mez, Zaki and Joel each contribute what they understand about the situation.", image:'assets/comics/arc16/ch16-what-everyone-knows.png', xp:290, action:'🗣️ Hear Everyone Out'},
    {id:17, title:'What We Came Here For', focus:"San confronts the difference between needing something and having the right to take it.", image:'assets/comics/arc16/ch17-what-we-came-here-for.png', xp:310, action:'⚖️ Face the Question'},
    {id:18, title:'At Least You Know Now', focus:"After San makes a decision that doesn't work out as intended, Joel is frustrated but doesn't make her feel as though she has used up another chance. They work through the disagreement and move forward.", image:'assets/comics/arc16/ch18-at-least-you-know-now.png', xp:330, action:'❤️ Move Forward Together'},
    {id:19, title:'Another Way', focus:"The crew discovers that the material can be obtained without destroying what protects it, but the process requires cooperation.", image:'assets/comics/arc16/ch19-another-way.png', xp:300, action:'🤝 Find Another Way'},
    {id:20, title:'What They Can Offer', focus:"The locals decide what they are willing to exchange—and what they are not.", image:'assets/comics/arc16/ch20-what-they-can-offer.png', xp:290, action:'📜 Hear the Terms'},
    {id:21, title:'A Different Kind of Trade', focus:"The crew realizes that their exchange doesn't have to be ownership. Knowledge, assistance and cooperation can have value too.", image:'assets/comics/arc16/ch21-a-different-kind-of-trade.png', xp:300, action:'🔄 Rethink the Exchange'},
    {id:22, title:'The Part We Leave Behind', focus:"The Horizon Engine receives enough material for its upgrade, while the majority of the resource remains where it belongs.", image:'assets/comics/arc16/ch22-the-part-we-leave-behind.png', xp:320, action:'⚓ Take Only What\'s Needed'},
    {id:23, title:'The Engine Changes', focus:"Renn, Erynn and Mimi complete the next Horizon Engine upgrade. The crew tests it successfully.", image:'assets/comics/arc16/ch23-the-engine-changes.png', xp:310, action:'⚙️ Test the Upgrade'},
    {id:24, title:'What We Take With Us', focus:"The crew prepares to leave. San reflects on what they learned about exploration, ownership and responsibility.", image:'assets/comics/arc16/ch24-what-we-take-with-us.png', xp:300, action:'💭 Reflect'},
    {id:25, title:'The Price of Rare Things', focus:"Final reflection: a world isn't measured by what can be taken from it, and discovery doesn't have to mean possession. Crimson Tide sails onward.", image:'assets/comics/arc16/ch25-the-price-of-rare-things.png', xp:540, action:'⚓ Sail Onward'}
  ];
  window.ARC16_CHAPTERS = ARC16_CHAPTERS;

  window.arc16ObjectiveState = function(){
    if (!game.arc15Complete) return null;
    if (level() < 240) return null;
    game.comicProgress16 = game.comicProgress16 || {};
    for (const ch of ARC16_CHAPTERS) {
      if (!game.comicProgress16[ch.id]) return 'complete_arc16_chapter_' + ch.id;
    }
    return 'arc16_part1_complete_for_now';
  };

  const ARC16_CHAPTER_SCENES = {
    1: "The Horizon Engine needs something rare for its next upgrade — that much is clear from the readings alone.<br><br>What isn't clear is where to actually find it.<br><br>Renn buries herself in theory. Erynn goes looking for precedent. Between the two of them, a shape starts to form — not a location yet, but a direction worth sailing toward.",
    2: "The trail leads to a world none of them have set foot on before.<br><br>Nobody rushes ashore. San gives the order herself: look first, take nothing yet.<br><br>So they walk it instead — the shape of the coastline, the way the light sits differently here, what grows where and why. Joel keeps waiting for someone to say the word 'survey' and have it mean something. Nobody does. Not yet.<br><br>It's the first time in a while that arriving somewhere new hasn't immediately meant reaching for it.",
    3: "It's Renn who finds it first — a reading that matches nothing she's catalogued before, faint but unmistakably real. The material is here. Not a rumor. Not a theory. Here.<br><br>Erynn's find complicates it. Old records, half-translated, all pointing the same direction: whatever this is, someone once went to real trouble to keep it exactly where it is.<br><br>Neither of those facts cancels the other out. The material is real, and reachable. It was also, deliberately, left alone.",
    4: "Soel is the one who stops walking first.<br><br>Nobody else notices anything — the readings are steady, the ground is ordinary, the material sits right where Renn said it would. But Soel isn't looking at the material. Soel is looking at everything around it.<br><br>\"It's not just sitting there,\" Soel says, finally. \"Something's using it. Or something's part of it. I can't tell which.\"<br><br>It changes the shape of the question. This was supposed to be a resource. It might also, quietly, be alive — or something close enough to it that the difference stops feeling academic.",
    5: "Renn works out the fastest path within the hour — cut here, extract there, done before nightfall. Clean, simple, well within what the crew is capable of.<br><br>It's also, by every account Soel and Erynn can piece together, exactly the kind of taking that got this place deliberately protected in the first place.<br><br>Nobody argues that the easy way would fail. That's what makes it hard. It would work. Something would just be worse off for it — and not everyone on the crew agrees on how much that should matter.",
    6: "San sits with it longer than she means to.<br><br>The Horizon Engine needs the material. That part isn't in question — she's seen the readings herself, run the numbers twice. What she keeps circling back to is the other half of the equation: needing something has never, on its own, been the same as being entitled to it.<br><br>She doesn't have an answer yet. She's honest enough with herself to notice that bothers her more than not having the material would.<br><br>Joel finds her still turning it over, later, and doesn't ask what she's decided. He just sits with her a while, then says, quietly, \"Whatever we do, I'd rather we know why we're doing it before we do it.\"<br><br>It isn't an answer. San isn't sure she wanted one.",
    7: "Renn lays it out the way she lays everything out — plainly, thoroughly, without embellishment. What the material could do for the Engine. What it could do beyond the Engine, if they're being honest about its properties. The case for taking it is, by her account, a strong one.<br><br>Erynn doesn't dispute a word of it. That's not where her objection lives.<br><br>\"Useful and valuable aren't the same thing,\" she says. \"Something can be worth everything to the people who live around it and worth nothing on Renn's chart at the same time. We haven't asked what it's worth to them. We've only worked out what it's worth to us.\"<br><br>Joel's listened to all of it without saying much. When he finally does, it isn't about value at all.<br><br>\"Say we take it,\" he says. \"What does that actually look like — for us, tomorrow, for whoever's still here after we've gone? Because nobody's said that part yet.\"<br><br>He doesn't wait for either of them to answer before he lets the question sit.",
    8: "They don't find the guardians. The guardians find them.<br><br>No ambush, no warning shot — just, suddenly, the crew isn't alone anymore, and hasn't been for a while. Whoever, whatever they are, they've clearly been watching long enough to know exactly how close the crew has already come.<br><br>Nobody draws a weapon. That alone seems to buy them a moment — not trust, nothing close to it yet, but enough silence that someone finally speaks first.<br><br>\"You've been careful,\" the voice says. \"That's more than most.\"",
    9: "San asks the obvious question, expecting an obvious answer: what makes this worth guarding? What makes it precious?<br><br>The answer isn't what she expects.<br><br>It isn't precious. Not the way she means it. Nobody here would call it a treasure, wouldn't lock it away for its own sake, wouldn't mourn losing it the way you'd mourn losing something rare and beautiful.<br><br>It has a job. That's all. And the job doesn't stop needing doing just because outsiders showed up wanting to take it away.",
    10: "The dragons don't announce themselves the way stories always said dragons would.<br><br>No roar, no fire, no ultimatum. Just a slow, deliberate presence settling into view — the way something settles in when it belongs somewhere, not when it's guarding a door.<br><br>That's the part that unsettles Soel more than teeth or size ever could. \"They're not stationed here,\" Soel says slowly. \"They're not a lock on a vault. They live here. This is what home looks like for them.\"<br><br>It's a very different thing to take something from a vault than to take something out of someone's home.",
    11: "San goes quiet on the walk back, running the last several days over in her head, and doesn't like what she finds.<br><br>They arrived with a plan built entirely around what the material could do for the Engine. Every decision since has been an adjustment to that plan, not a reconsideration of it — react, learn something new, bolt it onto the same original shape, keep going.<br><br>\"We've been asking the wrong-sized question this whole time,\" she says finally. \"'How do we take it' assumes taking it is already decided. We never actually finished asking whether it should be.\"",
    12: "The locals don't dress it up, and they don't need to.<br><br>Take it the way the crew first planned — cut it free, quickly, cleanly — and the ecosystem built around it doesn't just lose a resource. It loses whatever role the material was actually playing, the one nobody back home had a name for because nobody back home needed one.<br><br>The dragons wouldn't simply be inconvenienced. Something they depend on would be gone. And nothing anyone here has seen suggests it grows back.<br><br>\"You asked what it would cost,\" the guardian says. \"That's the honest answer. Not a fine. Not a grudge. A hole, where something used to be.",
    13: "The guardians don't just explain what the material does. They explain what it's part of — root systems, weather patterns, the dragons' own migrations, a dozen things Erynn hadn't thought to ask about because she'd been treating this like a mineral deposit instead of something closer to an organ.<br><br>It isn't protected because someone once decided, arbitrarily, that it should be. It's protected because pulling it out wrong would be like pulling something load-bearing out of a structure and hoping the rest holds anyway. Everything here grew up assuming it would stay exactly where it is.<br><br>Renn writes it all down. For the first time since this began, she isn't sure the numbers are the part that matters most.",
    14: "It's been building for days, and everyone can feel it before either of them says a word.<br><br>San wants to move faster — gather what's needed, get the Engine upgraded, keep the crew from losing more time to a decision that should've been simple. Joel thinks that's exactly the wrong instinct here, and for once, doesn't hold back saying so.<br><br>Neither one backs down. Not yet.",
    15: "San doesn't say much of it out loud. She doesn't have to — anyone who's sailed with her long enough can read the shape of it: <i>I brought everyone out here. I said I'd figure this out. If I get this wrong, that's on me.</i><br><br>Nobody actually asked her to carry that alone. She just always has.<br><br>Maybe this is the first time she's let herself notice that being captain and being the only person allowed to have doubts were never actually the same job.",
    16: "One by one, without anyone calling a meeting for it, the crew starts talking.<br><br>Renn talks numbers — what the material does, what it doesn't. Erynn talks history — what the records actually say, once you strip out the parts everyone assumed. Mimi says less than anyone but somehow lands closest to the point. Aisyah worries about what happens after, once word of this reaches the next port. Mez notices how differently they've all been treated here, being outsiders. Zaki just wants a decision made before the supplies make it for them. And Joel — quieter than usual, still not fully past the argument — says what he's said from the start, just without the heat this time.<br><br>Nobody agrees on everything. For once, that doesn't feel like a problem. It feels like the actual picture, finally in focus.",
    17: "San lays the two questions side by side, finally, instead of letting one quietly stand in for the other.<br><br>Does the Engine need this? Yes. That part was never really in doubt.<br><br>Does needing it mean they're entitled to take it — from a place that's made it clear, in every way it knows how, that it would rather they didn't?<br><br>That's the question she's been avoiding since the day they landed here. She doesn't avoid it any longer.",
    18: "It isn't a clean apology, and neither of them pretends otherwise.<br><br>\"I should've listened,\" San says.<br><br>\"Maybe,\" says Joel.<br><br>She waits for the rest of it — the part where he tells her what this costs them, what she's used up. It doesn't come.<br><br>\"At least you learned now,\" he says instead.<br><br>It isn't forgiveness dressed up as something bigger than it is. It's smaller than that, and steadier — proof that getting it wrong with Joel doesn't mean losing him, just means having something to work through together. So they do. And then they move forward.",
    19: "It's Mimi who says it first, almost offhand, the way she says most of the things that turn out to matter: \"What if we're not supposed to take it. What if we're supposed to be let take it.\"<br><br>Nobody laughs it off this time.<br><br>There's a process — slow, deliberate, nothing like the clean extraction Renn originally mapped out. It doesn't work without the guardians. It doesn't work without the dragons, either, or without the crew doing something they haven't had to do yet on this whole trip: ask, and actually wait for the answer.<br><br>Renn double-checks the math twice. It holds. It's just not a plan built for taking anything alone.",
    20: "The locals don't say yes to everything, and they don't pretend the crew's need is the only thing that matters here.<br><br>Some of it, they're willing to part with — carefully, on their own terms, in a way that leaves the material's role in this place intact. Some of it, no explanation offered or required, simply isn't on the table.<br><br>San half-expects to feel frustrated by the limits. She doesn't. If anything, the limits are what make the offer feel real — proof this isn't charity extended to make outsiders go away, but an actual line someone's willing to hold.",
    21: "Erynn is the one who says out loud what the crew's been circling for a while: they keep thinking about this as a trade for the material, when the material was never the only thing on the table.<br><br>What the crew's brought with them has value too — Joel's read on tides and shipbuilding, Renn's instruments, Mimi's uncanny sense for when something's about to go wrong, hands willing to work a problem the locals have been carrying alone.<br><br>Ownership was never actually required to leave this place with something worth having. It just took long enough to notice that cooperation was already doing the job ownership was supposed to.",
    22: "In the end, the Horizon Engine gets exactly what it needs — no more, measured out carefully, handed over rather than taken.<br><br>Everything else stays. The dragons keep their territory. The ecosystem keeps whatever it is the material was actually doing for it, still mostly a mystery, still clearly important. The guardians keep their reason for being here.<br><br>Joel watches the crew load the small, careful amount onto the ship and can't help thinking how different this looks from where they started — Renn's fast, clean extraction plan, the one that would've worked, the one that would've left a hole behind it.<br><br>\"We got what we came for,\" San says.<br><br>\"We did,\" Joel agrees. \"Just not the way we thought we would.\"",
    23: "Renn, Erynn and Mimi don't work independently so much as they work in the same direction at once — Renn on the mechanism, Erynn tracing how the material actually wants to be handled, Mimi catching the small things that would've gone wrong if anyone else had been building this alone.<br><br>The upgrade goes in cleanly. Cleaner, if anyone's honest about it, than it probably would have if they'd taken the fast way back on that first world.<br><br>The test isn't dramatic. No flash, no fanfare — just the Horizon Engine running exactly the way the readings said it should, for the first time doing what it was always supposed to do. Renn allows herself a small, satisfied nod. That's as close as she gets to celebrating.",
    24: "There's always a version of leaving that's just logistics — supplies counted, course set, nothing left to do but go. This doesn't feel like that version.<br><br>San stands at the rail longer than she needs to, running back over everything that happened here. They arrived needing something and assuming, without ever quite saying it out loud, that needing it would be enough.<br><br>It wasn't, and she's glad it wasn't. Not because they walked away with less than they came for — they didn't — but because getting it the way they got it meant actually seeing this place, instead of just extracting from it and sailing on.<br><br>\"What do you think we're bringing home?\" Joel asks, coming up beside her.<br><br>\"More than the material,\" San says. \"I'm still working out the rest.\"",
    25: "\"We came looking for something rare,\" San says, watching the coastline shrink behind them.<br><br>\"We found something more valuable,\" Joel says.<br><br>She looks over at him, and for once doesn't ask him to explain what he means. She already knows.<br><br>A world isn't measured by what they can take from it. Discovery doesn't have to mean possession — didn't have to, this whole time, even when it felt like the only shape the word could take.<br><br>Crimson Tide sails onward."
  };
  window.ARC16_CHAPTER_SCENES = ARC16_CHAPTER_SCENES;

  // Interactive gating for Ch.15 and Ch.18 — both are the story's own
  // record of a beat the San & Joel disagreement system (second IIFE,
  // below) plays out interactively in the Bonds tab: Ch.15 is reaching
  // "understanding," Ch.18 is the completed "repaired" state. Rather
  // than let the chapter button complete them for free regardless of
  // what's happened in the Bonds tab, both now require the player to
  // have actually reached that state there first. Returns a lock
  // message string if id has an unmet interactive prerequisite, or null
  // if there's no extra gate for this id (or it's already satisfied).
  function arc16InteractiveGateMessage(id){
    if (id !== 15 && id !== 18) return null;
    const d = (typeof window.sanJoelDisagreementState === 'function') ? window.sanJoelDisagreementState() : null;
    if (id === 15) {
      if (!d || d.state === 'connected' || d.state === 'tension') {
        return "San and Joel haven't reached an understanding yet — check the Bonds tab.";
      }
    }
    if (id === 18) {
      if (!d || d.state !== 'repaired') {
        return "San and Joel haven't worked things through yet — check the Bonds tab.";
      }
    }
    return null;
  }
  window.arc16InteractiveGateMessage = arc16InteractiveGateMessage;

  window.markArc16ChapterRead = function(id){
    id = Number(id);
    const ch = ARC16_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc16] no chapter data for id', id); return; }
    game.comicProgress16 = game.comicProgress16||{};
    if(game.comicProgress16[id]){ toast('✓ Already marked read.'); return; }
    if(window.arc16ObjectiveState() !== 'complete_arc16_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    const gateMsg = arc16InteractiveGateMessage(id);
    if (gateMsg) { toast('🔒 '+gateMsg, 3600); return; }
    game.comicProgress16[id] = true;
    // Cross-hook flagged when the San & Joel disagreement system was
    // built (see the second IIFE below): Ch.14 ("The Argument") is what
    // actually starts the disagreement arc. Without this, Ch.14 would
    // complete normally as a story beat but the interactive Bonds-tab
    // disagreement/repair system would never fire at all.
    if (id === 14 && typeof window.triggerSanJoelDisagreement === 'function') window.triggerSanJoelDisagreement();
    if (id === 25) game.arc16Complete = true;
    gainXP(ch.xp);
    game.reputation = (game.reputation||0) + 1;
    logEvent('📖 Arc XVI Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if (ARC16_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC16_CHAPTER_SCENES[id] });
    }
    if (typeof renderMainGoal === 'function') try { renderMainGoal(); } catch(e) {}
    if (typeof renderStory === 'function') try { renderStory(); } catch(e) {}
  };

  window.__ctShowArc16Splash = function(){
    const overlay = document.getElementById('arc16SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc16Splash = function(){
    const overlay = document.getElementById('arc16SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc16SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc16 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc16) oldRenderStoryForArc16();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc16Ready = window.arc16ObjectiveState() !== null;
    if (arc16Ready && !game.arc16SplashSeen && typeof window.__ctShowArc16Splash === 'function') {
      window.__ctShowArc16Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc16/arc16-cover-the-price-of-rare-things.png" alt="Arc XVI — The Price of Rare Things" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XVI</div><div class="story-act-title">The Price of Rare Things</div>'+
      '<div class="story-act-tagline">Just because we can take something, does that mean we should?</div></div>';
    if (!arc16Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XVI Locked</div><div class="story-chapter-sub">'+
        (!game.arc15Complete ? 'Finish Arc XV first.' : 'Reach Level 240 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc16ObjectiveState();
    ARC16_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress16 && game.comicProgress16[ch.id]);
      const ready = !done && so===('complete_arc16_chapter_'+ch.id);
      const gateMsg = ready ? arc16InteractiveGateMessage(ch.id) : null;
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready && gateMsg) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<div class="story-chip" style="margin-top:6px;">🔒 '+esc(gateMsg)+'</div>';
      } else if (ready) {
        action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
          '<button class="btn btn-small btn-success" onclick="markArc16ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc16_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XVI chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();


(function(){
  // -------------------------------------------------------------------
  // SAN & JOEL — DISAGREEMENT & REPAIR. A major evolution of the
  // existing Bond system (bondTier/bondState in arc9-and-systems.js),
  // not a replacement — that system's points/tiers keep working exactly
  // as before. This adds a separate STATE layered on top, specific to
  // San & Joel: Connected -> Tension -> Understanding -> Repaired.
  //
  // Core principle, straight from San's own design: Bonding measures
  // how well people know, trust, and understand each other, not how
  // often they agree. So disagreement never subtracts bond points —
  // there's no numeric penalty anywhere in this file. A repaired
  // disagreement can make the bond MORE meaningful than if it had never
  // happened, via a permanent "Learned" flag future dialogue can check.
  //
  // Scope, per San's own direction: built for San & Joel specifically
  // for Arc XVI first, not generically for all 9 crew members yet, even
  // though the design doc gives every character their own disagreement
  // themes. Those are recorded in CREW_PERSPECTIVES below so extending
  // this to other pairs later is mostly data-entry, not a redesign.
  //
  // Trigger: exposed as window.triggerSanJoelDisagreement(), and now
  // wired into markArc16ChapterRead's id===14 branch above — Ch.14
  // ("The Argument") completing is what actually starts this arc.
  // -------------------------------------------------------------------

  const CREW_PERSPECTIVES = {
    renn: { name: 'Renn', line: "The material reacts to magical energy — that part I can prove. Whether we SHOULD take it isn't a question my equipment answers." },
    erynn: { name: 'Erynn', line: "The historical records say it was protected centuries ago. That's not superstition. Someone learned something the hard way." },
    mimi: { name: 'Mimi', line: "I think we're missing something. I can't tell you what yet. But we are." },
    aisyah: { name: 'Aisyah', line: "If we push too hard here, word travels. The next port might not be as welcoming." },
    mez: { name: 'Mez', line: "We're already being watched differently because we're outsiders. Taking something we were told not to won't help that." },
    zaki: { name: 'Zaki', line: "Whatever we decide, we need to decide it before we're out of supplies to decide it slowly." }
  };
  window.SJ_CREW_PERSPECTIVES = CREW_PERSPECTIVES;

  const UNDERSTANDING_THRESHOLD = 3;

  function sjDisagreement(){
    game.sanJoelDisagreement = game.sanJoelDisagreement || {
      state: 'connected', // connected | tension | understanding | repaired
      issueId: null,
      understandingPoints: 0,
      repairStep: 0,
      learnedFlags: [],
      crewPerspectivesSeen: []
    };
    return game.sanJoelDisagreement;
  }
  window.sanJoelDisagreementState = sjDisagreement;

  window.triggerSanJoelDisagreement = function(){
    const d = sjDisagreement();
    if (d.state !== 'connected') { toast('Nothing new to bring up right now.'); return; }
    d.state = 'tension';
    d.issueId = 'rare_material';
    logEvent('⚡ San and Joel disagree over the rare material — the Horizon Engine\'s needs against what it would cost.', 'bad');
    toast('⚡ San and Joel disagree.', 3200);
    if (typeof showStoryModal === 'function') {
      setTimeout(function(){
        showStoryModal({
          title: '⚡ The Argument',
          blurb: "San wants to pursue the material more aggressively. The Engine needs it, and she's the one who has to make that work.<br><br>Joel thinks they're pushing too far, and says so.<br><br>Neither of them is being stupid. They're just prioritizing different things — and right now, that's enough to genuinely disagree about."
        });
      }, 400);
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderFairTideHub === 'function') try { renderFairTideHub(); } catch(e) {}
  };

  function checkUnderstandingThreshold(d){
    if (d.state === 'tension' && d.understandingPoints >= UNDERSTANDING_THRESHOLD) {
      d.state = 'understanding';
      logEvent('💭 San starts to understand what was really driving her — and turns to the crew instead of solving it alone.', 'gold');
      if (typeof showStoryModal === 'function') {
        setTimeout(function(){
          showStoryModal({
            title: '💭 You Don\'t Have to Decide Alone',
            blurb: "San keeps thinking: <i>I'm the captain. I should figure this out.</i><br><br>But she doesn't actually know what the right answer is. Not on her own.<br><br>She wasn't simply thinking <i>we need this material</i>. She was thinking <i>I brought everyone here. I need to make this work.</i><br><br>Joel doesn't have to be the one who gives her the answer. He's just one of the people she can actually rely on."
          });
        }, 400);
      }
    }
  }

  window.sjRespondPush = function(){
    const d = sjDisagreement();
    if (d.state !== 'tension') return;
    toast('"We don\'t have time for this." — the tension stays exactly where it was.', 3200);
    logEvent('San pushes the argument. Nothing is resolved.', 'bad');
  };

  window.sjRespondListen = function(){
    const d = sjDisagreement();
    if (d.state !== 'tension') return;
    d.understandingPoints++;
    toast('"Tell me why you think we shouldn\'t." — Understanding +1.', 3200);
    logEvent('San listens instead of pushing back. Understanding +1.', 'good');
    checkUnderstandingThreshold(d);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  window.sjRespondAskCrew = function(crewId){
    const d = sjDisagreement();
    if (d.state !== 'tension') return;
    const perspective = CREW_PERSPECTIVES[crewId];
    if (!perspective) return;
    if (d.crewPerspectivesSeen.indexOf(crewId) === -1) {
      d.crewPerspectivesSeen.push(crewId);
      d.understandingPoints++;
      logEvent('🧭 '+perspective.name+': "'+perspective.line+'"', 'good');
      toast('🧭 '+perspective.name+' weighs in. Understanding +1.', 3600);
      checkUnderstandingThreshold(d);
      if (typeof saveGameQuiet === 'function') saveGameQuiet();
    } else {
      toast(perspective.name+' already said their piece on this.');
    }
  };

  window.sjRespondWalkAway = function(){
    const d = sjDisagreement();
    if (d.state !== 'tension') return;
    toast('"I need time to think." — the tension holds, but at least it doesn\'t get worse.', 3200);
    logEvent('San takes a moment before responding. Tension holds, but doesn\'t escalate.', 'gold');
  };

  const REPAIR_STEPS = [
    { key:'acknowledge', label:'Acknowledge', line:'"I pushed too hard."' },
    { key:'understand', label:'Understand', line:'"You weren\'t trying to stop me. You were worried about what we\'d damage."' },
    { key:'accept', label:'Accept', line:'"I understand why you said it."' },
    { key:'move_forward', label:'Move Forward', line:'"Let\'s figure out another way."' }
  ];
  window.SJ_REPAIR_STEPS = REPAIR_STEPS;

  window.sjRepairStep = function(){
    const d = sjDisagreement();
    if (d.state !== 'understanding') return;
    if (d.repairStep >= REPAIR_STEPS.length) return;
    const step = REPAIR_STEPS[d.repairStep];
    d.repairStep++;
    toast(step.label+': '+step.line, 3600);
    logEvent('Repair — '+step.label+': '+step.line, 'good');
    if (d.repairStep >= REPAIR_STEPS.length) {
      d.state = 'repaired';
      if (d.learnedFlags.indexOf('joel_can_challenge_san') === -1) d.learnedFlags.push('joel_can_challenge_san');
      logEvent('❤️ Conflict Resolved: Rare Resource Disagreement.', 'gold');
      if (typeof showStoryModal === 'function') {
        setTimeout(function(){
          showStoryModal({
            title: '❤️ At Least You Know Now',
            blurb: "San: \"I should've listened.\"<br>Joel: \"Maybe.\"<br>San: \"You're still angry.\"<br>Joel: \"A little.\"<br>San: \"I'm sorry.\"<br>Joel: \"I know.\"<br><br>Pause.<br><br>Joel: \"At least you learned now.\"<br>San: \"That's your answer?\"<br>Joel: \"What else do you want me to say?\"<br>San: \"I don't know.\"<br>Joel: \"Then let's forget what happened and figure out what we do next.\"<br><br>Something in San's memory settles: <b>Learned — Joel can disagree with her without it threatening what they have.</b>"
          });
        }, 400);
      }
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderFairTideHub === 'function') try { renderFairTideHub(); } catch(e) {}
  };

  // Renders the disagreement panel above the existing San & Joel bond
  // card when there's actually something to show — invisible the rest
  // of the time, so this never clutters the Bonds tab outside Arc XVI.
  function sjDisagreementPanelHtml(){
    const d = sjDisagreement();
    if (d.state === 'connected') return '';
    let html = '<article class="quest-item" style="border-color:rgba(232,197,71,.5);margin-bottom:10px;">'+
      '<strong>❤️ San ↔ Joel</strong> — <span style="opacity:.8;">Status: '+
      (d.state==='tension'?'Tension':d.state==='understanding'?'Understanding':'Repaired')+'</span><br>'+
      '<span style="font-size:.8rem;opacity:.8;">Issue: Different approaches to the rare material</span>';
    if (d.state === 'tension') {
      html += '<div style="font-size:.76rem;opacity:.65;margin-top:4px;">Understanding: '+d.understandingPoints+' / '+UNDERSTANDING_THRESHOLD+'</div>'+
        '<div class="story-actions" style="flex-wrap:wrap;gap:6px;margin-top:8px;">'+
        '<button class="btn btn-small" onclick="sjRespondPush()">"We don\'t have time for this."</button>'+
        '<button class="btn btn-small btn-success" onclick="sjRespondListen()">"Tell me why you think we shouldn\'t."</button>'+
        '<button class="btn btn-small" onclick="sjRespondWalkAway()">"I need time to think."</button></div>'+
        '<div style="font-size:.74rem;opacity:.65;margin-top:6px;">Ask the crew:</div>'+
        '<div class="story-actions" style="flex-wrap:wrap;gap:6px;">';
      Object.keys(CREW_PERSPECTIVES).forEach(function(cid){
        const seen = d.crewPerspectivesSeen.indexOf(cid) !== -1;
        html += '<button class="btn btn-small" '+(seen?'disabled':'')+' onclick="sjRespondAskCrew(\''+cid+'\')">'+(seen?'✓ ':'')+CREW_PERSPECTIVES[cid].name+'</button>';
      });
      html += '</div>';
    } else if (d.state === 'understanding') {
      const nextStep = REPAIR_STEPS[d.repairStep];
      html += '<div style="font-size:.76rem;opacity:.7;margin-top:6px;">Repair, step '+(d.repairStep+1)+' of '+REPAIR_STEPS.length+'</div>'+
        '<div class="story-actions" style="margin-top:6px;">'+
        '<button class="btn btn-small btn-success" onclick="sjRepairStep()">'+esc(nextStep.label)+': '+esc(nextStep.line)+'</button></div>';
    } else if (d.state === 'repaired') {
      html += '<div style="font-size:.76rem;opacity:.7;margin-top:6px;">✓ Resolved. Joel can disagree with San without it threatening their bond.</div>';
    }
    html += '</article>';
    return html;
  }
  window.sjDisagreementPanelHtml = sjDisagreementPanelHtml;

  const oldRenderBondsTabForSJ = window.renderBondsTab;
  window.renderBondsTab = function(){
    if (oldRenderBondsTabForSJ) oldRenderBondsTabForSJ();
    const el = document.getElementById('ft-tab-bonds');
    if (!el) return;
    const panel = sjDisagreementPanelHtml();
    if (panel) el.innerHTML = panel + el.innerHTML;
  };
})();
