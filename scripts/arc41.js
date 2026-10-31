(function(){
  // -------------------------------------------------------------------
  // ARC XLI — THE ONES WHO STAY. Gated at arc40Complete + level 615,
  // continuing the established +15-per-arc ladder (XXXVIII:570,
  // XXXIX:585, XL:600, XLI:615). Ch.16 sets game.arc41Complete = true,
  // matching every other arc's own finale flag.
  //
  // Per the outline's own explicit framing: San and Joel already know
  // Sairen from the earlier Nameless/N storyline (Arc XXIX-XXX) and
  // recognize him immediately -- this is NOT a reintroduction. Arc
  // XXIX's own comment ("Sairen never gets an ALL_PARTY entry... no
  // recruitment path") was a deliberate restraint for THAT arc, not a
  // permanent one -- this is the arc that lifts it.
  //
  // The "betrayal" this arc references briefly (Ch.10) is Arc XXX's:
  // N had an affair with another Nameless operative and ultimately
  // passed along protected Horizon information, using Sairen's own
  // absence to do it (arc30.js Ch.16, "The Choice"). Sairen was cleared
  // of involvement (Ch.21, "Not Sairen") and was genuinely hurt by the
  // affair underneath Fair Tide's own crisis. N disappeared afterward
  // (Ch.24, "Missing") -- unresolved on purpose, and this arc doesn't
  // reopen it. Ch.10 here acknowledges the shape of what happened
  // without restaging a single beat of it.
  //
  // Jovie is already established Fair Tide roster (game.fairTideRoster.
  // jovie, arc21-medical-house.js) running the Medical House day-to-day
  // alongside Senedra -- not introduced here, just given more page time.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. Sairen's actual ALL_PARTY entry, his CLASS_KIT
  // skill, and the recruitment grant at Ch.16 live in
  // scripts/arc41-mechanics.js, same split used since Arc XXIII.
  //
  // XP escalates toward Ch.16 (the arc's own title chapter, Sairen's
  // actual decision and recruitment) at 420 -- the clear centerpiece,
  // with Ch.4 ("You've Been Recruited," the arc's first real comedic
  // beat) and Ch.13 ("The Smallest Invitation," the turning point
  // where he laughs without guarding himself) each stepping up a little
  // from the baseline.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.webp) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC41_CHAPTERS = [
    {id:1, title:'Someone at the Edge', focus:"Sairen has been seen near Fair Tide. San recognizes the name immediately and remembers their earlier encounters, including the events involving N. She doesn't pursue him -- if he wants to approach, that's his decision. Meanwhile, Vaeren and Joelle have noticed someone lingering nearby. Soel notices them noticing.", image:'assets/comics/arc41/ch01-someone-at-the-edge.webp', xp:345, action:'🌿 Notice Someone at the Edge'},
    {id:2, title:'Two Very Innocent Faces', focus:'Vaeren and Joelle are playing under supervision, their attention drifting toward where Sairen was last seen. The twins exchange one of their increasingly familiar looks. "They\'re babies," Joy says. "That doesn\'t mean they\'re not thinking," Maera replies. Soel moves closer.', image:'assets/comics/arc41/ch02-two-very-innocent-faces.webp', xp:340, action:'😇 Watch Two Very Innocent Faces'},
    {id:3, title:'A Very Convenient Emergency', focus:"Sairen hears what sounds like a distressed child and investigates. Vaeren and Joelle appear to need help; he approaches cautiously and makes sure they're safe. The situation resolves almost immediately -- then the twins look remarkably pleased with themselves. Sairen begins to suspect he's been tricked. Soel looks thoroughly unimpressed.", image:'assets/comics/arc41/ch03-a-very-convenient-emergency.webp', xp:345, action:'🐈 Investigate a Very Convenient Emergency'},
    {id:4, title:"You've Been Recruited", focus:'San and Joel discover what happened. "Sairen?" "Captain." "Of all the people they could\'ve found—" "Don\'t remind me." One twin reaches toward him. The other follows. "Don\'t encourage them." "I haven\'t done anything." "That\'s what they want you to think." Nobody has actually recruited Sairen. The twins appear to disagree.', image:'assets/comics/arc41/ch04-youve-been-recruited.webp', xp:370, action:"😂 Admit You've Been Recruited"},
    {id:5, title:'Just Visiting', focus:"Sairen returns to Fair Tide, claiming he's only checking that the children are safe. San doesn't challenge the explanation and offers him the chance to stay for a meal. He hesitates, then accepts. The twins are delighted. Soel remains watchful.", image:'assets/comics/arc41/ch05-just-visiting.webp', xp:345, action:'⚓ Stay Just Visiting'},
    {id:6, title:'The Infirmary', focus:"Sairen visits Fair Tide's infirmary following a minor incident and meets Jovie, who handles the practical details without interrogating him about his past. Senedra and Dr. AA continue their own established responsibilities. He finds Jovie's plain, ordinary treatment of him unexpectedly comfortable.", image:'assets/comics/arc41/ch06-the-infirmary.webp', xp:350, action:'🏥 Visit the Infirmary'},
    {id:7, title:"Jovie's Own Life", focus:"The chapter follows Jovie through an ordinary working day -- coordinating patients, supplies and infirmary routines. Her experience from Earth remains useful even in a very different world. San notices how dependable she's become. Jovie isn't waiting for someone to give her a purpose. She already has one.", image:'assets/comics/arc41/ch07-jovies-own-life.webp', xp:345, action:"🌸 See Jovie's Own Life"},
    {id:8, title:'Not Everyone Trusts Easily', focus:"Sairen begins interacting with more Fair Tide residents. Some are welcoming; others stay cautious because of his former association with Nameless and the earlier events involving N. San and Joel don't pretend he's a stranger, but neither do they demand instant trust. For once, Sairen doesn't disappear just because he feels unwelcome.", image:'assets/comics/arc41/ch08-not-everyone-trusts-easily.webp', xp:355, action:"🌊 Accept Not Everyone Trusts Easily"},
    {id:9, title:'Old Habits', focus:"Sairen notices something unusual during an ordinary Fair Tide activity -- his former spy training recognizing a potential problem. He alerts San instead of investigating secretly. San appreciates the decision: his old skills may still be useful. What matters is how he chooses to use them.", image:'assets/comics/arc41/ch09-old-habits.webp', xp:350, action:'🗝️ Fall Back on Old Habits'},
    {id:10, title:'What Betrayal Leaves Behind', focus:"Sairen reflects privately on his past. His relationship with N ended painfully; San and Joel already know what happened, so there's no need to reopen it. The betrayal affected his willingness to trust -- but he doesn't want the rest of his life to revolve around someone who hurt him.", image:'assets/comics/arc41/ch10-what-betrayal-leaves-behind.webp', xp:360, action:'🌧️ Face What Betrayal Leaves Behind'},
    {id:11, title:'An Ordinary Conversation', focus:"Sairen encounters Jovie outside the infirmary and they talk about everyday things -- work, Fair Tide, the differences between the lives they once knew and the lives they have now. Jovie shares only what she's comfortable sharing. Sairen discovers he enjoys talking with her. Neither treats it as the start of anything.", image:'assets/comics/arc41/ch11-an-ordinary-conversation.webp', xp:350, action:'🌺 Share an Ordinary Conversation'},
    {id:12, title:'A Reason to Go', focus:"Sairen considers leaving Fair Tide -- unsure whether he belongs, and unwilling to become dependent on people he barely knows. San tells him he's free to leave; she won't hold him there. She remembers their history, but doesn't use it against him. The choice is his.", image:'assets/comics/arc41/ch12-a-reason-to-go.webp', xp:370, action:'⚓ Weigh a Reason to Go'},
    {id:13, title:'The Smallest Invitation', focus:'Vaeren and Joelle find Sairen again -- no pretend emergency this time, they simply want his attention. He sits with them a while, Soel watching from nearby. "Do they always do this?" "Usually." "Unfortunately." For the first time, Sairen laughs without immediately becoming guarded.', image:'assets/comics/arc41/ch13-the-smallest-invitation.webp', xp:380, action:'🐈 Accept the Smallest Invitation'},
    {id:14, title:'Something Worth Protecting', focus:"A practical problem arises at Fair Tide. Sairen recognizes how his experience could help and offers assistance voluntarily, working with the residents rather than alone. The situation resolves without a new antagonist. Sairen realizes he's begun caring about the people around him.", image:'assets/comics/arc41/ch14-something-worth-protecting.webp', xp:360, action:'🌿 Find Something Worth Protecting'},
    {id:15, title:'Perhaps Tomorrow', focus:"Sairen speaks with Jovie again, easily this time, and mentions he may stay in Fair Tide. Jovie doesn't tell him what to do -- she simply says it would be nice to see him around. Sairen finds himself looking forward to their next conversation. The possibility of something more stays unspoken.", image:'assets/comics/arc41/ch15-perhaps-tomorrow.webp', xp:355, action:'🌸 Consider Perhaps Tomorrow'},
    {id:16, title:'The Ones Who Stay', focus:'Sairen approaches San, having made his decision: he wants to remain at Fair Tide and contribute. San accepts -- not because he was once a spy, not because the twins like him, not because of Jovie, but because he chose to build a different life. "I think they planned this." "I\'ve been saying that for days." For once, Sairen doesn\'t feel the need to leave.', image:'assets/comics/arc41/ch16-the-ones-who-stay.webp', xp:420, action:'🐈 Become One of the Ones Who Stay'}
  ];
  window.ARC41_CHAPTERS = ARC41_CHAPTERS;

  const ARC41_CHAPTER_SCENES = {
    1: "Word reaches San the ordinary way — a sighting, nothing more, someone lingering near Fair Tide's edges without making any move to actually approach. The name attached to it is enough to get her full attention immediately: Sairen.<br><br>She and Joel remember him clearly — the Nameless operative, the man N eventually stayed with, everything that came after. San's never pretended his association with that world tells the whole story of who he is; she watched him draw real lines of his own, back when Fair Tide first set its own terms for him.<br><br>She doesn't go looking for him. If he wants to actually approach Fair Tide this time, that's a decision he can make for himself, on his own schedule.<br><br>Meanwhile, considerably less patient about the whole thing, Vaeren and Joelle have already noticed someone lingering at the edge of the settlement. Soel notices them noticing. That particular combination has rarely meant anything good.",
    2: 'The twins are supposed to be playing, under supervision, doing exactly what small children are meant to do with an afternoon. Instead their attention keeps drifting toward the direction everyone\'s been quietly discussing — toward wherever Sairen was last actually seen.<br><br>They exchange a look. The kind of look that\'s become uncomfortably familiar to everyone who spends real time around the two of them.<br><br>"What are they doing?" Joy asks, watching the whole wordless exchange happen.<br><br>"Thinking," Maera says.<br><br>"They\'re babies."<br><br>"That doesn\'t mean they\'re not thinking."<br><br>Soel, for his part, has already started moving closer. He\'s learned better than anyone not to wait and see.',
    3: "Sairen hears it before he sees anything — the distinct, distressed sound of a child in trouble, close by. He investigates immediately, instincts moving faster than deliberation.<br><br>What he finds is Vaeren and Joelle, apparently in need of help. He approaches carefully, methodically checks that they're actually safe, confirms there's no real danger anywhere nearby.<br><br>The whole situation resolves itself almost the instant he arrives.<br><br>Then the twins look, unmistakably, remarkably pleased with themselves — considerably too pleased for two children who were supposedly just rescued from something.<br><br>Sairen starts doing the math. He doesn't love where it's leading.<br><br>Soel arrives a moment later, looking thoroughly, pointedly unimpressed with absolutely everyone involved.",
    4: "San and Joel get the full story not long after, and San recognizes the name attached to it before anyone finishes explaining.<br><br>\"Sairen?\"<br><br>\"Captain,\" he says, with the particular calm of a man who's had time to prepare for this exact conversation.<br><br>Joel looks between Sairen and the two suspiciously contented children at his feet. \"Of all the people they could've found—\"<br><br>\"Don't remind me,\" San says.<br><br>\"I heard a child crying,\" Sairen offers, perfectly reasonable, perfectly unhelpful.<br><br>San eyes the twins, who do not look even slightly like children who were recently in distress. \"Of course you did.\"<br><br>Joel checks everyone over properly, confirms nobody's actually hurt. San thanks Sairen, genuinely, for showing up when he thought someone needed help.<br><br>One twin reaches toward him immediately. The other follows without hesitation.<br><br>\"Don't encourage them,\" San warns.<br><br>\"I haven't done anything,\" Sairen says.<br><br>\"That's what they want you to think,\" Joel says.<br><br>Nobody, officially, has recruited Sairen into anything. The twins, quite plainly, feel differently about that.",
    5: "Sairen comes back to Fair Tide on his own, a day or two later, and offers an explanation that satisfies absolutely no one while technically answering the question: he's only checking that the children are safe.<br><br>San doesn't push back on it. She's not about to pretend she believes it fully, but she's also not going to turn away a man who keeps showing up with reasonable-sounding excuses.<br><br>She offers him a meal instead. He hesitates — visibly, genuinely — before accepting.<br><br>The twins are thrilled the moment they spot him. Soel watches the whole thing unfold from a careful, considered distance, clearly reserving judgment.",
    6: "A minor incident sends Sairen to Fair Tide's infirmary, nothing serious, and there he meets Jovie properly for the first time.<br><br>She handles the practical side of it without ceremony — checks supplies, coordinates what little assistance the situation actually needs, gets him sorted efficiently. Senedra and Dr. AA continue with their own responsibilities around her, the whole infirmary running with the kind of practiced rhythm that comes from genuine competence.<br><br>Jovie treats him like any other visitor who's wandered in with a minor problem. She doesn't ask about his past. She doesn't seem remotely curious about the name Sairen or what it might mean.<br><br>He finds that — unexpectedly, considerably more than he expects to — comfortable.",
    7: "The chapter follows Jovie through an entirely ordinary day: coordinating patients as they come and go, tracking supplies, keeping the infirmary's routines running the way they're meant to run. None of it is dramatic. All of it matters.<br><br>Her experience from Earth still serves her well here, even in a world that operates on rules she's had to learn from scratch. She's adapted the practical parts of her old work into something that fits Veyren without ever losing what made her good at it in the first place.<br><br>San watches her move through the day and notices, not for the first time, just how dependable Jovie's actually become.<br><br>Jovie isn't sitting around waiting for someone to hand her a purpose. She already built one, with her own two hands, out of exactly the skills she already had.",
    8: "Sairen starts interacting with more of Fair Tide's residents as he keeps returning, and the reception is mixed, unsurprisingly. Some people are genuinely welcoming, curious rather than wary. Others stay visibly cautious, remembering his old association with Nameless, remembering what happened with N.<br><br>San and Joel don't smooth any of it over. They don't pretend he's some unknown stranger with no history worth mentioning, and they don't demand that everyone around him simply trust him on command either.<br><br>Sairen, for his part, understands the hesitation better than anyone. He's spent most of his life being exactly the kind of person people are right to be cautious around.<br><br>What's different this time is that he doesn't just leave the moment he feels the weight of that caution. He stays anyway.",
    9: "During an otherwise unremarkable Fair Tide activity, Sairen notices something that doesn't sit right — a detail nobody else has caught, the kind of thing his old training is built to catch automatically.<br><br>His first instinct, old habit, is to look into it quietly himself.<br><br>He doesn't. He goes to San instead, lays out exactly what he noticed and why it concerns him, and lets her decide what happens next.<br><br>San appreciates it more than she says outright. Whatever else Sairen's old skills are good for, they're clearly still useful — the real question was never whether he still had them. It's how he actually chooses to use them now.",
    10: "Alone, later, Sairen lets himself think about N properly for the first time in a while — not avoiding it, just not dwelling, the way he's learned to manage it.<br><br>It ended badly. San and Joel already know exactly how, and there's no need to walk either of them through it again — the affair, the information she passed, the Nameless world swallowing her and the man who recruited her both, no trial, no confirmation, nothing but silence where an ending should have been.<br><br>It changed something in him, that. Made trusting people harder, slower, more deliberate than it used to be.<br><br>But he's decided, somewhere along the way, that he doesn't want the rest of his life quietly orbiting someone who hurt him, however badly it still sits. That decision, at least, is entirely his to make.",
    11: "Sairen runs into Jovie outside the infirmary, no particular reason for either of them to be there at the same time, and they end up talking — nothing important, nothing weighted. Work. The ordinary rhythms of Fair Tide. The strange, quiet gap between the lives they both used to have and the ones they're actually living now.<br><br>Jovie shares what she's comfortable sharing and no more than that, and Sairen respects the boundary without needing it spelled out.<br><br>He notices, walking away afterward, that he actually enjoyed the conversation — plainly, without an angle, without working out what it might mean.<br><br>Neither of them treats it as the start of anything. It's just a good conversation. For now, that's exactly enough.",
    12: "Sairen starts seriously considering leaving Fair Tide altogether. He's not sure, even now, whether he actually belongs here — and he doesn't want to become someone who leans on people he's barely known a handful of weeks.<br><br>He brings it to San plainly, the way he's learned to be plain with her.<br><br>She tells him he's free to go. She won't hold him here, won't guilt him into staying, won't pretend his leaving would be some kind of betrayal of anyone.<br><br>She remembers everything about their earlier history together, every bit of it — but she doesn't use a single piece of it against him now, doesn't weaponize his past to keep him close.<br><br>The choice, entirely, is his to make.",
    13: 'Vaeren and Joelle find him again, not long after, with no manufactured emergency behind it this time. They simply want his attention, plainly, the way children do when they\'ve decided someone\'s worth having around.<br><br>Sairen sits with them for a while, letting them have it. Soel watches from a short distance, present but no longer quite so suspicious.<br><br>"Do they always do this?" Sairen asks, eventually.<br><br>"Usually," Joel says.<br><br>"Unfortunately," San adds.<br><br>And for the first time since any of this started, Sairen laughs — genuinely, without the careful half-second of guardedness that usually follows anything that catches him off balance.',
    14: "A real, practical problem comes up at Fair Tide, the kind that needs actual hands and actual expertise to solve. Sairen recognizes immediately how his own background could help.<br><br>He offers, without being asked. Works alongside the residents handling it, not off on his own running some separate angle the way the old habits might have once pushed him toward.<br><br>The problem gets solved. Nothing dramatic happens — no new enemy, no grand confrontation, just a thing that needed doing, done properly, together.<br><br>Walking away from it, Sairen realizes something that catches him slightly off guard: he's started caring, genuinely, about the people he just spent the afternoon helping.",
    15: 'He finds Jovie again, easily this time, the conversation falling into place without either of them working at it. At some point, almost in passing, he mentions that he might actually stay in Fair Tide.<br><br>Jovie doesn\'t tell him what to do. She\'s not in the business of deciding other people\'s lives for them.<br><br>"It would be nice to see you around," is all she says, simply, without making more of it than that.<br><br>Sairen finds himself, afterward, actually looking forward to the next time their paths cross. Neither of them puts a name to whatever this might eventually become. For now, it stays exactly what it is — unspoken, and entirely possible.',
    16: 'Sairen seeks San out, deliberately this time, with none of the half-excuses he\'s used before. They\'ve known each other since the Nameless business, since N — but this conversation is different from every one that came before it.<br><br>He\'s made his decision. He wants to stay at Fair Tide. He wants to actually contribute to it, not just drift along its edges indefinitely.<br><br>San accepts.<br><br>Not because he was once a spy and spies are useful. Not because two small children have apparently decided he belongs to them now. Not even because of whatever might eventually grow between him and Jovie.<br><br>Because he chose this, deliberately, with open eyes — a different life than the one he had, built on his own terms.<br><br>Later, predictably, Vaeren and Joelle spot him across the yard. Both of them reach toward him at once.<br><br>Sairen sighs. "I think they planned this."<br><br>"I\'ve been saying that for days," San says.<br><br>"You underestimated them," Joel adds.<br><br>Soel, with the air of someone whose job here is officially finished, walks away. The twins immediately follow.<br><br>Sairen watches them go.<br><br>For once, he doesn\'t feel the need to leave too.'
  };
  window.ARC41_CHAPTER_SCENES = ARC41_CHAPTER_SCENES;

  window.arc41ObjectiveState = function(){
    if (!game.arc40Complete) return null;
    if (level() < 615) return null;
    game.comicProgress41 = game.comicProgress41 || {};
    for (const ch of ARC41_CHAPTERS) {
      if (!game.comicProgress41[ch.id]) return 'complete_arc41_chapter_' + ch.id;
    }
    return 'arc41_part1_complete_for_now';
  };

  window.markArc41ChapterRead = function(id){
    const so = window.arc41ObjectiveState();
    if (so !== ('complete_arc41_chapter_' + id)) return;
    game.comicProgress41 = game.comicProgress41 || {};
    game.comicProgress41[id] = true;
    // Matches every prior arc's own completion flag (arc39/arc40Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 16) game.arc41Complete = true;
    const ch = ARC41_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC41_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC41_CHAPTER_SCENES[id] });
    }
    // Sairen's recruitment itself (ALL_PARTY/CLASS_KIT wiring, the
    // foundCompanions grant, the join story modal) lives in
    // arc41-mechanics.js's own hook on this same chapter id -- kept out
    // of this file per the usual story/mechanics split.
    if (typeof window.grantSairenRecruitIfDue === 'function') window.grantSairenRecruitIfDue(id);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc41Splash = function(){
    const overlay = document.getElementById('arc41SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc41Splash = function(){
    const overlay = document.getElementById('arc41SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc41SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc41 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc41) oldRenderStoryForArc41();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc41Ready = window.arc41ObjectiveState() !== null;
    if (arc41Ready && !game.arc41SplashSeen && typeof window.__ctShowArc41Splash === 'function') {
      window.__ctShowArc41Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc41/arc41-cover-the-ones-who-stay.webp" alt="Arc XLI — The Ones Who Stay" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XLI</div><div class="story-act-title">The Ones Who Stay</div>'+
      '<div class="story-act-tagline">Belonging isn\'t something you\'re given. Sometimes it\'s something you choose.</div></div>';
    if (!arc41Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XLI Locked</div><div class="story-chapter-sub">'+
        (!game.arc40Complete ? 'Finish Arc XL first.' : 'Reach Level 615 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc41ObjectiveState();
    ARC41_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress41 && game.comicProgress41[ch.id]);
      const ready = !done && so===('complete_arc41_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action =
          '<button class="btn btn-small btn-success" onclick="markArc41ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc41_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XLI chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
