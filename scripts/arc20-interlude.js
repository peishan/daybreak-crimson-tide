(function(){
  // -------------------------------------------------------------------
  // INTERLUDE — IN BETWEEN. Seven bonus vignettes bridging Arc XX to
  // Arc XXII, gated identically to Arc XXI (arc20Complete + level 315)
  // but deliberately independent of both: this file's own completion
  // feeds nothing else, and neither Arc XXI's nor Arc XXII's own gate
  // depends on it. Same fixed-sequence chapter mechanism as every other
  // arc for UI consistency, even though the seven don't share a plot.
  //
  // Full outline (and the emotional shape below) is San's own — quieter
  // character/family stories running alongside the main campaign, none
  // of which need to move Fair Tide's larger plot forward:
  //   San & Joel (Ch.1-2) -> consequences of that night (Ch.2) ->
  //   Soel & San (Ch.3) -> Soel & the wider family (Ch.4-5) ->
  //   Joel & Joy's unresolved family (Ch.6) -> Renn's recovered past,
  //   now lived-with (Ch.7).
  //
  // Ch.1-2 (the drinking night + the morning after): Ch.1 is quietly,
  // and ONLY ever quietly, the night the twins are conceived — never
  // flagged in the text itself, never winked at, since neither San nor
  // Joel knows it at the time and the prose shouldn't know it either.
  // Ch.2's disagreement is deliberately resolved through actual
  // conversation (Veyren having changed how they handle conflict) rather
  // than escalation — San's own drinking-as-normal cultural frame is
  // never treated as wrong, Joel's discomfort is specifically about
  // both of them being incapacitated at once, and neither position has
  // to lose for them to agree on something going forward.
  //
  // Ch.6 (John K): checked Joel's existing family backstory first
  // (arc10-12.js's Memory Archive Ch.2/Ch.13) — already establishes four
  // siblings: an older sister who "survived real hardship and came out
  // of it stronger" (Ate Joy — core-engine.js confirms she's explicitly
  // Joel's sister), Joel himself (second), a brother who "built a
  // stable life further away," and a youngest who "started a family
  // early, before he was really ready to." John K IS that youngest —
  // this gives him a name and real detail, not a new, previously
  // unmentioned sibling. Deliberately unresolved at the end, per
  // direction: no invented update on John K/Klyne's fate.
  //
  // Ch.7 (Renn) is the volume's own bookend on purpose — contrasted
  // against Ch.6's "we don't know": Renn is someone the crew once knew
  // almost nothing about and can now actually know, where John K's
  // story still can't be.
  // -------------------------------------------------------------------

  const INTERLUDE_CHAPTERS = [
    {id:1, title:'Sing Louder Than That', focus:"A rare night off turns into San and Joel actually drinking together at the Fair Tide tavern — San ends up singing in front of everyone, both of them get steadily, thoroughly drunk, and the night gets messier from there before they finally collapse into bed and sleep straight through the morning.", image:'assets/comics/interlude/ch01-sing-louder-than-that.png', xp:260, action:'🎤 Sing Louder'},
    {id:2, title:'The Morning After', focus:"San wakes with a brutal headache and assumes it's simply the drink. She and Joel have a small disagreement about it — San's own cultural frame sees a night like that as normal, Joel's discomfort is about both of them being incapacitated at once — and for once, they actually talk it through instead of letting it become a fight.", image:'assets/comics/interlude/ch02-the-morning-after.png', xp:250, action:'💬 Talk It Through'},
    {id:3, title:'Soel, the Constant', focus:"Ships change. Worlds change. Even San's own life keeps changing, one arc at a time. Soel doesn't — he's been there through every crossing, every unfamiliar shore, every version of home San's had to build from nothing, and some part of her has quietly decided that wherever he is, that's home.", image:'assets/comics/interlude/ch03-soel-the-constant.png', xp:240, action:'🐈 Notice the Constant'},
    {id:4, title:'His People, Differently', focus:"Soel doesn't belong only to San — he's built his own distinct relationships with the wider crew. With Aisyah, something almost formal and watchful; with Mez, pure chaos underfoot. Renn can't work out why he treats two people who look more alike by the year so differently.", image:'assets/comics/interlude/ch04-his-people-differently.png', xp:250, action:'👥 Watch Him With Them'},
    {id:5, title:'A Thread Through All of Them', focus:"Eliz adores him without complication, Senedra tolerates him with practiced patience, Zaki mutters about favoritism, and the research trio treats him like an ongoing mystery none of them can leave alone — right down to nobody quite agreeing on whether he's grey-and-white or faintly striped.", image:'assets/comics/interlude/ch05-a-thread-through-all-of-them.png', xp:260, action:'🧶 Follow the Thread'},
    {id:6, title:'The Youngest Brother', focus:"Joy brings up John K, unprompted — the youngest of them, a new father barely out of school when they last had real news of him. San remembers the small ways she'd already folded herself into Joel's family long before Veyren. Nobody knows what became of him, or Klyne, since the crossing. Nobody pretends to.", image:'assets/comics/interlude/ch06-the-youngest-brother.png', xp:300, action:'👨‍👩‍👦 Remember Together'},
    {id:7, title:'Still Renn', focus:"San checks in on Renn, well after the Archive told him where he was from — not another memory-recovery story, just how he's actually doing living with it. The strange, uncertain researcher they first met has become someone unmistakably settled. Some people stay a mystery. Renn isn't one of them anymore.", image:'assets/comics/interlude/ch07-still-renn.png', xp:320, action:'🗺️ Check In'}
  ];
  window.ARC20_INTERLUDE_CHAPTERS = INTERLUDE_CHAPTERS;

  const INTERLUDE_CHAPTER_SCENES = {
    1: "It starts as a dare, more or less — someone at the Fair Tide tavern picks up whatever passes locally for an instrument and asks if anyone's brave enough to actually sing in front of people, and San, three drinks in and feeling reckless in a way she almost never lets herself feel, says yes before she can think better of it.<br><br>She's not good. She knows she's not good. It doesn't matter — the whole tavern is laughing and cheering by the second verse, Joel loudest of anyone, and San discovers she doesn't actually care how she sounds as long as everyone's having this much fun watching her not care.<br><br>One song turns into three. Three drinks turn into considerably more than three. By the time San hands the instrument off to someone with an actual voice, she's laughing too hard to stand up straight, and Joel — matching her drink for drink out of what he insists later was solidarity, not competition — isn't doing much better.<br><br>The night gets blurrier from there. San is fairly sure she throws up once behind the tavern and is completely certain she throws up again somewhere closer to home, and both times Joel is right there, unbothered, holding her hair back with the same steady hands he'd use in an actual emergency, drunk enough himself that it takes him two tries to find the door.<br><br>They make it to bed eventually, more collapsing into it than climbing in, tangled together and laughing about something neither of them will remember by morning.<br><br>Neither of them wakes before noon.",
    2: "San wakes to a headache that has its own heartbeat and a room that won't quite stay still. She's fairly sure it's past noon. She's fairly sure she doesn't care.<br><br>\"Water,\" she manages, and Joel — somehow already upright, though visibly regretting it — has a cup in her hand before she finishes the word.<br><br>They lie there for a while in the particular silence of two people recovering from the same mistake. It's Joel who finally says something real.<br><br>\"I don't love how drunk we both got.\"<br><br>San turns her head carefully, testing whether that's a fight she's about to have. \"It was one night.\"<br><br>\"I know.\" He isn't accusing her of anything — she can hear that much even through the headache. \"Where I grew up, this is just... normal. A good night. Nobody thinks twice.\"<br><br>\"It's not that I think you shouldn't enjoy yourself.\" He picks his words slowly, the way he does when something actually matters to him. \"It's that if something had happened last night — anything — neither of us could have done a thing about it. I couldn't have looked out for you. You couldn't have looked out for either of us.\"<br><br>San sits with that instead of arguing with it. It isn't Joel telling her what she's allowed to do. It's Joel telling her what it costs him when they're both past being able to help each other.<br><br>\"Okay,\" she says. \"Not both of us like that again. We take turns, or we watch it together.\"<br><br>\"That's all I wanted.\"<br><br>They don't finish the conversation with a lecture, or an apology neither of them means. They just have it, plainly, the way they've learned to have most things since Veyren — and then San asks, with as much dignity as she can manage from flat on her back, if there's more water.",
    3: "Ships change. Worlds change. Even the shape of San's own life keeps changing, one arc at a time, in ways she couldn't have predicted from the deck of the very first vessel she ever captained.<br><br>Soel doesn't.<br><br>He's been there through all of it — every crossing, every unfamiliar shore, every version of home San's had to build from nothing more than the people willing to stay and help her build it. Ships get traded up, outgrown, sometimes lost. Crew members join, and a rare few leave. Even San's own memories, for a long stretch of her old life, were less solid than she'd have liked. Soel was never any of that. Soel was just there, unbothered by whichever world he happened to be sleeping in that week, curling up in the same inconvenient spot no matter whose berth it happened to be.<br><br>San doesn't know how to explain it to anyone who wasn't there for all of it — that a cat who followed her before he was anything more than a cat somehow became the one constant thread running through every single version of her life since. Not a companion in the way the crew are companions. Not family in the way Joel is family. Something else, something that doesn't need a category, something that was simply always there before she had a name for anything else.<br><br>Wherever Soel is, some small part of San has already decided, is home. It's been true since long before she understood why.",
    4: "With Aisyah, Soel is almost formal about it — a respectful distance, a nod-like dip of the head San's convinced she's imagining, right up until the moment Aisyah actually needs him and he's already there. Their Quartermaster carries herself the same way in everything she does, black hair with that single silvery-grey streak catching the light as she moves — steady, watchful, exactly the kind of person a spirit-sensitive cat would decide was worth quietly keeping an eye on. Soel seems to have made that decision a long time ago.<br><br>With Mez, he's a different animal entirely — literally underfoot the second she walks into a room, weaving figure-eights around her ankles like he's trying to trip her on purpose. Mez, black hair shot through with deep purple these days, gives as good as she gets, scooping him up mid-stride without breaking her sentence.<br><br>Renn's spent an embarrassing amount of time trying to work out why Soel treats the two of them so differently when — as he keeps pointing out, to nobody who asked — Aisyah and Mez have started looking more alike than not, dark hair and Veyren coloring drifting closer together the longer they've all lived here, like the world itself is deciding what family should look like.<br><br>Soel doesn't seem to find that confusing at all. He just treats them like exactly what they are — two different people who happen to be turning into something that looks, more and more, like sisters.",
    5: "Eliz adores him without any complication at all — scratches behind the ears the second he's in reach, talks to him like he understands every word, which he may very well do. Senedra tolerates him with the specific patience of someone who's decided a cat interrupting her archery practice isn't worth the argument, even when he is, pointedly, lying directly on top of whatever she's trying to fletch. Zaki mostly just watches him get away with things Zaki himself would never be allowed to get away with, muttering something about favoritism that nobody takes seriously, least of all Zaki.<br><br>The research trio treats him like exactly what he is to them: an ongoing mystery none of them can leave alone. Renn still corners him with theories. Erynn cross-references every account of him against records that were never written about anyone quite like Soel to begin with. Mimi just watches the two of them argue about it and occasionally points out, mildly, that maybe some things don't need explaining to be real.<br><br>Nobody's ever fully agreed on what he actually looks like, either. Some days he reads as plain grey and white. Other days, in a different light, the grey deepens into something closer to stripes. San asked Renn once whether that was even possible for an ordinary cat. Renn didn't have an answer. Nobody's pushed the question since — it's just Soel, being however he happens to be being that day, and everyone at Fair Tide long since decided that's one more small, accepted strangeness in a world that's given them considerably stranger things to get used to.",
    6: "It's Joy who brings him up, unprompted, watching a Fair Tide father carry his toddler on his shoulders through the market.<br><br>\"Makes me think of John K,\" she says.<br><br>Joel goes quiet in the way he does when a name reaches back further than he's ready for.<br><br>\"I used to call you about him,\" Joy continues. \"When we were still back home. Worried about the company he was keeping, all of it.\" She smiles, faint and a little sad. \"You always told me to let him figure it out himself.\"<br><br>\"He was figuring it out,\" Joel says. \"Just graduated. Had that tattoo shop job he actually seemed to love, for once.\" A pause. \"And then Klyne.\"<br><br>San's heard the name before, just never the whole shape of it. John K, the youngest of them, barely out of school and suddenly a father — and from everything Joel and Joy remember, he'd stepped into it without flinching, the way some people do when the thing that's supposed to terrify them just doesn't, or does and they show up anyway.<br><br>\"Klyne was maybe three months old, last we actually saw him,\" Joy says. \"Mama went to visit them in Brunei. Brought pictures back.\"<br><br>San remembers that part clearly enough — she'd been dating Joel by then, already close enough to the family to feel like she should do something. She'd bought a few small things for the baby, mostly on instinct, and later sent a proper diaper bag once she'd actually thought about what a brand-new parent might need and not have.<br><br>\"Zaki was around that age too, back then,\" Joel adds, almost as an afterthought. \"Different path, though. Told me himself he didn't think he was financially ready for something like that.\"<br><br>Nobody says it like a judgment, and nobody means it as one — Zaki isn't the point, and neither is deciding John K was braver or more foolish for choosing differently. He just did, that's all, the way people do.<br><br>What neither Joy nor Joel can say is what happened after. Whether John K is still exactly where they left him. Whether Klyne is three years old now, or older, or has a brother or sister nobody back home has met yet. They don't finish that thought out loud, and San doesn't ask them to.<br><br>\"We don't know,\" Joy says finally, plainly, the way she says most difficult things. \"We just don't know.\"<br><br>San doesn't offer to fix it. There's nothing here that fixing would even mean. She just stays, the way she's learned to stay for the things that don't have an answer yet — or possibly ever — and lets the two of them sit with a worry that crossed an entire world with them and never once got smaller for it.",
    7: "San finds Renn at the Archive, same as always, except that \"always\" means something different now than it used to.<br><br>She still remembers the version of him from that very first meeting — younger-looking than he had any right to be, oddly formal, utterly certain of everything except himself. The Arcane Navigator standing in front of her now, deep in cross-referenced notes he no longer needs anyone's permission to keep, is recognizably the same person and somehow an entirely different one, the way people are once enough time and enough truth have actually had room to settle.<br><br>\"How are you,\" she asks. Not performed concern. An actual question.<br><br>He takes his time answering, which is itself an answer. \"Good,\" he says eventually. \"Better than I expected to feel, honestly. I thought knowing where I came from would change something. It didn't, really — it just filled in a shape that was already there.\"<br><br>\"Does it feel finished?\" San asks. \"Knowing?\"<br><br>\"Nothing about me feels finished,\" he says, and there's something almost amused in it. \"But that part, yes. That part I actually know now.\"<br><br>San thinks, not for the first time, about how little any of them understood about Renn when he first joined the crew — the strange researcher with more questions than answers and a past nobody, himself included, could account for. And how much they can account for now. Not everything about a person ever gets solved. But some things do, eventually, if enough people stay long enough to let them.<br><br>\"I'm glad you know,\" she tells him.<br><br>\"So am I.\" He almost smiles — the specific, quiet almost-smile that's become entirely his own. \"Go on. I've got work that isn't going to cross-reference itself.\"<br><br>She leaves him to it. It's the kind of goodbye that doesn't need anything else added to it — the same one she gave him after the Archive first told him where he was from, the same one she'll probably keep giving him, because it's still exactly what he needs.<br><br>Some people you meet as a mystery and never solve. Renn, San thinks, walking back out into the light, is not going to be one of those people. Not anymore."
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
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All seven Interlude chapters read.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
