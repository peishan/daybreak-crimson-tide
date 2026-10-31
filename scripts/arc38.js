(function(){
  // -------------------------------------------------------------------
  // ARC XXXVIII — THE LIVES WE DIDN'T LIVE. Gated at arc37Complete + level
  // 570, continuing the established +15-per-arc ladder (XXXV:525,
  // XXXVI:540, XXXVII:555, XXXVIII:570). Ch.24 sets game.arc38Complete =
  // true, matching every other arc's own finale flag.
  //
  // Per the outline this arc was built from: the mysterious Horizon
  // discovered at the end of Arc XXXVII turns out to lead to an
  // alternate Earth — the one where the original storm never displaced
  // anyone to Veyren. The crew observes it through the Horizon Engine
  // and the Fair Tide Archive. They do not physically enter it (Ch.1-3
  // establish observation-only, and nothing in this arc's own 24
  // chapters ever crosses that threshold).
  //
  // The Archive's "echoes" (Ch.15-17) are explicitly NOT alternate
  // versions of San and Joel, and explicitly NOT recycled Legends of
  // Daybreak wraiths (Ch.16 states this directly) — they're unstable
  // manifestations of unrealized possibility, with no identity of their
  // own to confront or forgive. Per the outline's own restraint, this
  // file never implies otherwise.
  //
  // Per the outline's explicit build notes: no alternate-Earth travel,
  // no new combat systems, no playable alternate versions of the crew,
  // and Thought Resonance stays locked (reserved for Arc XL) — Ch.23's
  // "Bond responds" language mirrors Arc XXXVII's own Ch.23 restraint
  // exactly, never naming what it is.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. The four Archive Guardian encounters (Ch.6, 12,
  // 18, 23) and the Bond Resonance tie-in live in arc38-mechanics.js,
  // same split used since Arc XXIII.
  //
  // XP escalates toward Ch.5 ("We Were Never Born") as the arc's actual
  // revelation -- the moment the premise crystallizes -- at 420, with
  // Ch.24's finale just below it at 410 ("one centerpiece, not two",
  // same convention Arc XXXVII used). The three earlier Guardian fights
  // (Ch.6/12/18) step up in weight toward Ch.23's final Guardian at 400,
  // the second-highest XP in the arc.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.webp) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC38_CHAPTERS = [
    {id:1, title:'Not Today Has Passed', focus:"The mysterious Horizon remains stable. Renn has been checking its coordinates regularly, and San finally authorizes further observation. Nobody crosses.", image:'assets/comics/arc38/ch01-not-today-has-passed.webp', xp:300, action:'🔭 Confirm Not Today Has Passed'},
    {id:2, title:'Survey Before Crossing', focus:"Erynn and Mimi work alongside Renn to examine the Horizon. The landscape looks familiar — the geography resembles Earth, the buildings and roads and settlements are recognizable. But something is wrong. The details don't quite match what the crew remembers.", image:'assets/comics/arc38/ch02-survey-before-crossing.webp', xp:305, action:'🧭 Survey Before Crossing'},
    {id:3, title:'Another Earth', focus:"The researchers confirm the Horizon leads to an alternate Earth. History followed a different path — some major events remain recognizable, others have changed entirely. San wonders how much difference one person's existence could possibly make. Erynn doesn't answer immediately.", image:'assets/comics/arc38/ch03-another-earth.webp', xp:310, action:'🌏 Confirm Another Earth'},
    {id:4, title:'The Missing Names', focus:"Renn searches for familiar identities. San's name is absent. So is Joel's. Aisyah's. Mezstorm's. Nobody who arrived through the original storm appears in the records. Renn suspects incomplete information. Erynn isn't convinced.", image:'assets/comics/arc38/ch04-the-missing-names.webp', xp:320, action:'📚 Search for the Missing Names'},
    {id:5, title:'We Were Never Born', focus:"The storm-displaced people weren't erased from this Earth — they never existed there at all. Their parents still lived. Their communities continued. Their former partners made different choices. The lives the crew remembers simply never happened.", image:'assets/comics/arc38/ch05-we-were-never-born.webp', xp:420, action:'🪞 Accept We Were Never Born'},
    {id:6, title:'Guardian of the Unwritten', focus:"The Archive reacts to the investigation. A protected collection of records becomes accessible, but its guardian blocks the way. Renn believes the records may explain why the alternate Earth feels so familiar. San isn't sure she wants to know. She chooses to continue anyway.", image:'assets/comics/arc38/ch06-guardian-of-the-unwritten.webp', xp:360, action:'⚔️ Face the Guardian of the Unwritten'},
    {id:7, title:"A Mother's Different Morning", focus:"San observes her parents' alternate lives. Without their three daughters, their household developed differently — some things familiar, others entirely different. San realizes she has spent so much of her life thinking about what her parents meant to her, and rarely considered what her existence meant to them.", image:'assets/comics/arc38/ch07-a-mothers-different-morning.webp', xp:310, action:"🏡 Witness a Mother's Different Morning"},
    {id:8, title:'The Family That Never Formed', focus:"Aisyah and Mezstorm join San in examining their family's alternate history. The absence of three sisters changes more than one household — marriages, children, friendships, generations of connections. Mez tries to lighten the mood. It doesn't entirely work.", image:'assets/comics/arc38/ch08-the-family-that-never-formed.webp', xp:310, action:'🌺 See the Family That Never Formed'},
    {id:9, title:'A House Without Joel', focus:"Joel examines his mother's alternate history. His stepfather's life developed differently. His late father's history followed another course. Joel sees familiar places and people, but he has no place among them. San watches him quietly, then reaches for his hand.", image:'assets/comics/arc38/ch09-a-house-without-joel.webp', xp:320, action:'🌧️ Enter a House Without Joel'},
    {id:10, title:'Paths That Never Crossed', focus:"The crew examines how former relationships developed without them. Some relationships never happened; others formed with different people. The Archive doesn't explain whether those people are happier — it only shows what occurred.", image:'assets/comics/arc38/ch10-paths-that-never-crossed.webp', xp:310, action:'💌 Trace Paths That Never Crossed'},
    {id:11, title:'Children of Other Choices', focus:"San considers the children and families connected to her original life. Some exist in different circumstances; others may never have been born. The Archive cannot offer a simple answer about what any of those lives should have been. Their own children are waiting at Fair Tide.", image:'assets/comics/arc38/ch11-children-of-other-choices.webp', xp:315, action:'🌸 Consider Children of Other Choices'},
    {id:12, title:'Guardian of Divergence', focus:"The Archive's deeper records reveal increasingly complicated histories. A guardian prevents further access. Afterward, Renn discovers that some records contain possibilities that never became complete worlds at all. Erynn suspects the Archive preserves more than ordinary history.", image:'assets/comics/arc38/ch12-guardian-of-divergence.webp', xp:370, action:'⚔️ Face the Guardian of Divergence'},
    {id:13, title:'The Archive Remembers', focus:"Renn and Erynn study the newly accessible records. The Archive contains histories that contradict one another — not because the records are incorrect, but because they describe different possibilities. Mimi recognizes something familiar in how the records behave.", image:'assets/comics/arc38/ch13-the-archive-remembers.webp', xp:310, action:'📖 Let the Archive Remember'},
    {id:14, title:'The Lives of Others', focus:"The investigation expands beyond San and Joel to friends, coworkers and extended families. Some people have entirely different occupations; others never encountered one another; a few seem remarkably similar despite everything.", image:'assets/comics/arc38/ch14-the-lives-of-others.webp', xp:305, action:'🌍 Observe the Lives of Others'},
    {id:15, title:'The Shape of an Absence', focus:"An unusual manifestation appears inside the Archive. It resembles a person at first, then changes — faces overlap, voices contradict one another. Renn attempts to identify it. There is no identity to find. Erynn realizes it represents possibilities that never became real.", image:'assets/comics/arc38/ch15-the-shape-of-an-absence.webp', xp:320, action:'🌫️ Witness the Shape of an Absence'},
    {id:16, title:'Not Our Reflections', focus:"More echoes appear. They aren't the crew's alternate selves. They aren't ghosts from the past. They are unstable manifestations of unrealized possibilities — not the wraiths of Legends of Daybreak, and not asking to be confronted or forgiven.", image:'assets/comics/arc38/ch16-not-our-reflections.webp', xp:330, action:'⚔️ Confront Not Our Reflections'},
    {id:17, title:'What the Records Cannot Tell', focus:"Mimi and Erynn examine the stabilized echoes and discover an important limitation: the Archive can show events and preserve possibilities, but it cannot fully explain why every person made every choice, or which life should have happened.", image:'assets/comics/arc38/ch17-what-the-records-cannot-tell.webp', xp:315, action:'🔮 Hear What the Records Cannot Tell'},
    {id:18, title:'Guardian of Possibility', focus:"The crew approaches the final protected collection. Another Archive guardian stands in their way, testing their ability to distinguish actual histories from unrealized possibilities. Afterward, the remaining records become accessible. Renn is fascinated. San is beginning to feel they've seen enough.", image:'assets/comics/arc38/ch18-guardian-of-possibility.webp', xp:380, action:'⚔️ Face the Guardian of Possibility'},
    {id:19, title:'The Weight of Being Here', focus:"San reflects on the alternate Earth. Her absence changed people's lives, but her presence changed lives too — not every consequence good, not every consequence bad. She cannot measure her existence by imagining a world without her. Joel understands more than she needs to explain.", image:'assets/comics/arc38/ch19-the-weight-of-being-here.webp', xp:320, action:'🌿 Feel the Weight of Being Here'},
    {id:20, title:'Those Who Remember Us', focus:"The crew discusses what they've discovered. Aisyah, Mezstorm, Joy and others each reflect on people they knew before the storm, from their own perspective. Nobody arrives at exactly the same conclusion. They don't need to.", image:'assets/comics/arc38/ch20-those-who-remember-us.webp', xp:310, action:'🌊 Think of Those Who Remember Us'},
    {id:21, title:'A Different Kind of Home', focus:"San and Joel spend a quiet evening together, remembering how unlikely their meeting once seemed. Another world could have unfolded without either of them. But this one didn't. Nothing extraordinary happens. And that's enough.", image:'assets/comics/arc38/ch21-a-different-kind-of-home.webp', xp:330, action:'❤️ Find a Different Kind of Home'},
    {id:22, title:'The Last Unwritten Page', focus:"The Archive presents its final record — not a perfect world, not a terrible one, only a world that continued without the people now living in Veyren. San realizes the Archive was never going to provide a verdict on their lives. Only another perspective. She closes the record.", image:'assets/comics/arc38/ch22-the-last-unwritten-page.webp', xp:325, action:'📜 Read the Last Unwritten Page'},
    {id:23, title:'Keeper of the Boundary', focus:"The Archive's final guardian protects the boundary between recorded possibilities and observed reality. The crew completes the encounter. Mimi confirms the alternate Earth can remain under observation without further disturbance. The Horizon remains open to observation. Not crossing.", image:'assets/comics/arc38/ch23-keeper-of-the-boundary.webp', xp:400, action:'⚔️ Face the Keeper of the Boundary'},
    {id:24, title:'We Were Here', focus:"San and Joel return to Fair Tide. Vaeren and Joelle immediately demand their parents' attention. San thinks about the alternate Earth — a world where none of them ever existed. Then Joelle reaches for her hair, and San laughs. \"Well, we definitely exist here.\"", image:'assets/comics/arc38/ch24-we-were-here.webp', xp:410, action:'🐈 Know We Were Here'}
  ];
  window.ARC38_CHAPTERS = ARC38_CHAPTERS;

  const ARC38_CHAPTER_SCENES = {
    1: "The mysterious Horizon remains exactly where it's been since Arc XXXVII left it — stable, open to observation, and closed to everything else. Renn has been checking its coordinates regularly, almost ritually, the way he checks anything he isn't ready to stop thinking about.<br><br>San finally authorizes a further look.<br><br>\"So we're going?\" Renn asks, already halfway to excited.<br><br>\"We're looking,\" San says.<br><br>\"That's considerably less exciting.\"<br><br>\"For you,\" Joel says, not looking up.<br><br>Nobody crosses. Not today. San has started to suspect that sentence is going to keep being true for a while yet, and she's made her peace with that.",
    2: "Erynn and Mimi work alongside Renn to actually examine the Horizon properly this time, rather than just confirming it's still there.<br><br>The landscape looks familiar almost immediately — geography that resembles Earth, buildings and roads and settlements the three of them can half-recognize without quite placing. For a moment it feels less like a discovery and more like a long-overdue homecoming.<br><br>Then the details stop lining up.<br><br>Nothing about what they're looking at matches what any of them actually remember, not cleanly, not consistently. Erynn frowns at her own readings longer than she needs to. Something here is wrong in a way none of them can name yet.",
    3: "The researchers spend the better part of a day confirming what Erynn already half-suspected: the Horizon leads to an alternate Earth. Not their original world. A different one, following a different history from somewhere along the way.<br><br>Some major events remain recognizable, landmarks of a sort. Others have changed so completely that nobody can say when the two histories actually split apart.<br><br>San sits with that a while. \"How much difference could one person's existence possibly make,\" she says, half to herself, half to the room.<br><br>Erynn doesn't answer immediately. San isn't sure that's actually a comforting silence.",
    4: "Renn goes looking for familiar names in the records, expecting to find them easily enough.<br><br>San's name is absent.<br><br>So is Joel's.<br><br>Aisyah's. Mezstorm's.<br><br>One by one, the others check for themselves, and the pattern holds every time. Nobody who arrived through the original storm appears anywhere in this Earth's records — not as a footnote, not as an error, not at all.<br><br>Renn's first instinct is incomplete information, some gap in what they're able to access. Erynn isn't convinced. She's seen the Archive be incomplete before. This doesn't look like that.",
    5: "The researchers confirm it, carefully, more than once, before anyone's willing to say it out loud.<br><br>The storm-displaced people weren't erased from this Earth. They never existed there at all.<br><br>Their parents still lived out full lives. Their communities continued on, untouched by an absence nobody there could have noticed, because there was never anything to notice. Their former partners made entirely different choices, built entirely different lives, never once missing someone who was never there to miss.<br><br>The lives the crew remembers simply never happened. Not on this Earth.<br><br>\"So somewhere out there,\" San says slowly, \"nobody ever met me.\"<br><br>\"Or me,\" Joel says.<br><br>San looks at him for a long moment.<br><br>\"That's a very strange thought,\" she says.",
    6: "The Archive reacts to the investigation almost immediately, the way it has before when something touches too close to what it actually guards. A protected collection of records becomes accessible — but something stands between the crew and it, exactly as it did the first time Fair Tide pushed too far into what the Archive was built to keep.<br><br>Renn believes whatever's in those records might finally explain why the alternate Earth feels so unsettlingly familiar.<br><br>San isn't sure she actually wants that explanation.<br><br>She chooses to continue anyway. She's chosen harder things than curiosity before.",
    7: "San watches her parents' alternate lives unfold through the Archive's records, piece by careful piece. Without three daughters to raise, their household took a different shape entirely — some of it recognizable, some of it not at all.<br><br>Their personalities are still there, underneath everything. Their habits. The small routines San remembers from a childhood that, technically, belongs to a different version of this family now.<br><br>Other things are simply different, in ways San can't always explain even to herself.<br><br>She realizes, watching it all, that she's spent so much of her life thinking about what her parents meant to her. She rarely considered, until right now, what her own existence actually meant to them.",
    8: "Aisyah and Mezstorm join San in going through their family's own alternate history, and the scale of it catches all three of them off guard. The absence of three sisters doesn't just change one household — it ripples outward into marriages, children, friendships, whole generations of connections that simply formed differently, or didn't form at all.<br><br>Some familiar people still exist, just through different family branches entirely. Others never came into being at all.<br><br>Mez tries to lighten the mood, the way he always does when a room gets too heavy to sit in comfortably. \"Imagine a world without us,\" he says.<br><br>\"Quieter,\" Aisyah says.<br><br>\"Definitely quieter,\" San agrees.<br><br>Nobody actually laughs. But nobody stays quite as heavy, either.",
    9: "Joel goes through his mother's alternate history on his own terms, taking his time with it. His stepfather's life developed along a different path. His late father's history followed a different course entirely, one Joel has no part in.<br><br>He recognizes places. He recognizes people. But he isn't anywhere among them — no mention, no absence shaped like him, nothing at all.<br><br>San watches him work through it quietly. She doesn't press him to explain any of it, doesn't ask him to narrate what he's feeling in real time.<br><br>Eventually, without either of them saying anything, Joel reaches for her hand. She was already reaching for his.",
    10: "The crew turns its attention to how old relationships developed without them in the picture at all. People who once loved them, hurt them, helped them or disappointed them all have different histories here, shaped by an absence none of those people ever actually experienced as an absence.<br><br>Some of those relationships never happened. Others formed instead with entirely different people.<br><br>San notices something the Archive quietly refuses to do: it never says whether any of those people turned out happier. It only shows what occurred, flatly, without judgment either way.<br><br>\"We can't know everything,\" Joel says.<br><br>\"I know,\" San says. A pause. \"Still curious, though.\"<br><br>Joel smiles at that, just slightly.",
    11: "San turns her attention to the children and families connected to her original life — people whose existence, in one way or another, used to run through hers. Some exist here too, just in different circumstances. Others may never have been born at all, their entire possibility quietly folded into a history that took a different shape.<br><br>The Archive offers no simple answer about what any of those unlived lives should have been, and San has stopped expecting one.<br><br>She understands, sitting with all of it, that her own history can't be rewritten just by observing a different one. It happened the way it happened.<br><br>Joel stays beside her the whole time. Their own children are waiting for them at Fair Tide, real and growing and entirely unbothered by any of this.",
    12: "The Archive's deeper records reveal histories more tangled than anything the crew has looked at so far — possibilities layered over possibilities, some barely distinguishable from each other. A second guardian stands between the crew and whatever comes next, exactly as deliberate as the first.<br><br>The crew gets past it.<br><br>Afterward, going through what's now accessible, Renn makes an unsettling discovery: some of these records don't describe complete worlds at all. Just fragments. Possibilities that started to form and never finished becoming anything.<br><br>Erynn suspects, quietly, that the Archive is preserving something closer to raw potential than ordinary history. Nobody has a comfortable response to that.",
    13: "Renn and Erynn spend real time with the newly accessible records, trying to make sense of what they're actually looking at. The Archive holds histories that flatly contradict each other — not because any of the records are wrong, exactly, but because they're each describing a different possibility, equally real in whatever sense the Archive deals in reality at all.<br><br>Mimi watches the records behave and recognizes something in the pattern of it, something that tugs at her own gift in a way she can't immediately explain.<br><br>Slowly, the three of them start to understand why the Archive's guardians protect this collection so carefully. Some things aren't meant to be sorted into a single, tidy truth.",
    14: "The investigation widens past San and Joel to everyone else the crew has ever known — friends, coworkers, extended family, the whole web of people whose lives once ran alongside theirs. Some of those people have entirely different occupations here. Others never crossed paths with one another at all, not even once. A few seem remarkably, almost stubbornly similar despite everything else being different.<br><br>\"Some people really don't change,\" San says, half amused.<br><br>\"Or perhaps,\" Mimi says, \"some things were never really about us at all.\"<br><br>San turns that thought over for a while.",
    15: "An unusual manifestation appears inside the Archive, unlike anything the crew has encountered there before. It resembles a person, at first — just for a moment. Then it changes. Faces overlap across each other. Voices contradict one another, layered too thick to pick a single one out.<br><br>Renn tries to identify it, the way he'd identify anything new.<br><br>There's no identity to find. That's the problem.<br><br>Erynn is the one who puts it together: this isn't a person, or the memory of one. It's a possibility that never became real enough to have an identity at all.",
    16: "More echoes appear after the first one, each as unsettling as the last. They aren't the crew's own alternate selves — nothing about them maps onto San, Joel, or anyone else specifically. They aren't ghosts from Fair Tide's own past either.<br><br>They're unstable manifestations of unrealized possibility, nothing more, nothing less, and the crew has to contain the disturbance using the Archive's own established methods for handling exactly this kind of thing.<br><br>Unlike the wraiths of Legends of Daybreak, these echoes aren't asking the crew for anything. Not confrontation. Not forgiveness. They're possibilities without lives of their own to defend or regret.",
    17: "Mimi and Erynn spend time with the now-stabilized echoes, trying to understand exactly what the Archive can and can't actually tell them. It can show events, clearly enough. It can preserve possibilities, layered and contradictory as they are.<br><br>But it can't fully explain why any single person made any single choice. It can't say which version of any life should have happened, out of all the ones that could have.<br><br>San realizes, watching the two of them work, that knowing a different outcome wouldn't actually make her own decisions any easier to carry. It would just be one more thing she couldn't change.",
    18: "The crew approaches the final protected collection, and the Archive's last guardian stands in their way — the most deliberate test yet, built specifically to see whether the crew can actually tell an observed history apart from an unrealized possibility, rather than just fighting their way through blindly.<br><br>They get through it.<br><br>What remains of the records opens up afterward, and Renn is immediately, thoroughly fascinated by all of it.<br><br>San, watching him dive back in, is starting to feel like they've genuinely seen enough.",
    19: "San sits with everything the alternate Earth has shown her so far. Her absence there changed people's lives — that much is undeniable. But her presence, back home, changed lives too, in ways both good and not so good. Neither column adds up to a clean verdict.<br><br>She can't measure her own existence by imagining a version of the world without her in it. That was never actually a fair question to ask.<br><br>Joel doesn't need her to explain any of this out loud. He understands most of it already, just from watching her work through it.",
    20: "The crew gathers to talk through what they've all discovered, and nobody's reaction quite matches anyone else's. Aisyah has her own way of sitting with it. Mezstorm finds parts of the whole experience more unsettling than he expected to. Joy keeps circling back to family, the way she always does. Others think about people they knew before the storm, people whose lives went on fine without them in ways that are hard to feel neutral about.<br><br>Nobody arrives at exactly the same conclusion. Nobody needs to. That's apparently allowed.",
    21: "San and Joel spend a quiet evening together, away from the Archive and the records and the alternate version of everything they've been looking at all week. They talk, a little, about how unlikely their meeting once seemed — how easily another world could have unfolded with neither of them in it at all.<br><br>But this one didn't.<br><br>\"We're here,\" Joel says.<br><br>\"I noticed,\" San says.<br><br>Joel smiles. San rests against him, and for a while nothing extraordinary happens at all.<br><br>That's enough.",
    22: "The Archive presents its final record on the matter, and San sits down to actually read it properly, the way she hasn't quite let herself with all the others.<br><br>It doesn't reveal a perfect world. It doesn't show her a terrible one either. Only a world that simply continued, the way worlds do, without the people now living out their lives in Veyren.<br><br>San realizes, closing the record, that the Archive was never going to hand her a verdict on any of this. Not a good one, not a bad one. Just another perspective, sitting alongside everything she already knew.<br><br>She closes the record. It's enough, for now, to have looked.",
    23: "The Archive's final guardian stands at the boundary itself — not protecting one more set of records this time, but the line between everything the crew has observed and the reality they actually live in.<br><br>The crew faces it, and finishes it.<br><br>Renn and Erynn spend the following hours stabilizing what's left of the disturbed records. Mimi confirms what San was hoping to hear: the alternate Earth can stay under quiet observation now, without stirring up anything further.<br><br>The Horizon stays open. Observable. Not crossed.<br><br>San decides, finally, that's enough for now.",
    24: "San and Joel make it back to Fair Tide, and Vaeren and Joelle are waiting for them the moment they're through the door. Soel is supervising. Or trying to, anyway.<br><br>The twins demand their parents' attention immediately, with the particular single-mindedness only small children manage. Joel picks up Vaeren. San gathers Joelle into her arms, and just like that the quiet, ordinary noise of family life fills the room again.<br><br>San thinks about the alternate Earth. A world where she never existed. Where Joel never existed. Where these two children, impossibly, were never born at all.<br><br>Then Joelle reaches for her hair. Vaeren makes a grab for Joel's collar. Soel retreats a strategic distance.<br><br>San laughs. \"Well,\" she says, \"we definitely exist here.\"<br><br>\"They're making sure we know,\" Joel says.<br><br>Outside, Fair Tide keeps on living, same as it always does. The Horizon remains a mystery worth remembering.<br><br>But there are lives here worth living."
  };
  window.ARC38_CHAPTER_SCENES = ARC38_CHAPTER_SCENES;

  window.arc38ObjectiveState = function(){
    if (!game.arc37Complete) return null;
    if (level() < 570) return null;
    game.comicProgress38 = game.comicProgress38 || {};
    for (const ch of ARC38_CHAPTERS) {
      if (!game.comicProgress38[ch.id]) return 'complete_arc38_chapter_' + ch.id;
    }
    return 'arc38_part1_complete_for_now';
  };

  window.markArc38ChapterRead = function(id){
    const so = window.arc38ObjectiveState();
    if (so !== ('complete_arc38_chapter_' + id)) return;
    game.comicProgress38 = game.comicProgress38 || {};
    game.comicProgress38[id] = true;
    // Matches every prior arc's own completion flag (arc36/arc37Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 24) game.arc38Complete = true;
    const ch = ARC38_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC38_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC38_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc38Splash = function(){
    const overlay = document.getElementById('arc38SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc38Splash = function(){
    const overlay = document.getElementById('arc38SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc38SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc38 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc38) oldRenderStoryForArc38();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc38Ready = window.arc38ObjectiveState() !== null;
    if (arc38Ready && !game.arc38SplashSeen && typeof window.__ctShowArc38Splash === 'function') {
      window.__ctShowArc38Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc38/arc38-cover-the-lives-we-didnt-live.webp" alt="Arc XXXVIII — The Lives We Didn\'t Live" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXXVIII</div><div class="story-act-title">The Lives We Didn\'t Live</div>'+
      '<div class="story-act-tagline">A life that never happened can still teach us something about the one we chose.</div></div>';
    if (!arc38Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXXVIII Locked</div><div class="story-chapter-sub">'+
        (!game.arc37Complete ? 'Finish Arc XXXVII first.' : 'Reach Level 570 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc38ObjectiveState();
    ARC38_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress38 && game.comicProgress38[ch.id]);
      const ready = !done && so===('complete_arc38_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = (typeof window.ARC38_GUARDIANS === 'object' && window.ARC38_GUARDIANS[ch.id])
          ? '<button class="btn btn-small btn-success" onclick="startArc38GuardianBattle('+ch.id+')">'+esc(ch.action || '⚔️ Face the Guardian')+'</button>'
          : '<button class="btn btn-small btn-success" onclick="markArc38ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc38_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXXVIII chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
