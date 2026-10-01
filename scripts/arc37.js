(function(){
  // -------------------------------------------------------------------
  // ARC XXXVII — CHILDREN OF TWO WORLDS. Gated at arc36Complete + level
  // 555, continuing the established +15-per-arc ladder (XXXIV:510,
  // XXXV:525, XXXVI:540, XXXVII:555). Ch.24 sets game.arc37Complete =
  // true, matching every other arc's own finale flag.
  //
  // Per the outline this arc was built from: the bridge from Arc
  // XXXVI's domestic growth back toward exploration. Fair Tide resumes
  // Horizon work while Vaeren and Joelle keep growing alongside it,
  // still too young for expeditions — their story runs ALONGSIDE the
  // expedition plot, never turning them into miniature adventurers.
  // Maera is confirmed as permanent Fair Tide community (Ch.3) rather
  // than a visiting expert, and Ch.4 gives San something she'd never
  // quite considered: the twins aren't displaced Earth people the way
  // she once was — Veyren is their actual homeland.
  //
  // Per the outline's own explicit restraint: this arc discovers a
  // stable Horizon overlap to another world (Ch.19-21) and deliberately
  // stops there — Ch.22 ("No Expedition Yet") and Ch.24's own closing
  // line ("Not today") keep the door closed. Nothing here reveals that
  // what's beyond it connects to San and Joel's own former partners and
  // children — that's Arc XXXVIII's reveal, not this arc's. Ch.11
  // ("Stories Maera Heard") plants that seed as quietly as the outline
  // asks: old Veyren folklore about familiar-but-wrong places, which
  // Renn stops dismissing, and nothing more specific than that.
  // Ch.14-15 and Ch.23 build San and Joel's own quiet synchronization
  // without ever naming it as anything supernatural — per the outline,
  // "Thought Resonance has not unlocked," and this file never implies
  // otherwise.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. The Living Horizons (Survey Before Crossing),
  // Maera's expanded Veyren Context, Twin Affinity, and Bond Resonance
  // gameplay systems Ch.7-10, 16, 19-21, and 23-24's own notes call for
  // live in scripts/arc37-mechanics.js, same split used since Arc
  // XXIII.
  //
  // XP escalates toward Ch.21 ("Not Veyren") as the centerpiece at 400
  // — the chapter where the Horizon Engine's discovery is actually
  // confirmed, matching the Living Horizons system's own "surveyed"
  // stage landing there. Ch.24's finale keeps the "one centerpiece,
  // not two" convention at 380, below the centerpiece.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC37_CHAPTERS = [
    {id:1, title:'Life Moves Again', focus:"Fair Tide has adjusted to Vaeren and Joelle — not perfectly, but enough that life no longer stops whenever one of them wakes up. San begins planning expeditions again while Joel balances First Mate responsibilities with fatherhood. Fair Tide has found a new normal.", image:'assets/comics/arc37/ch01-life-moves-again.png', xp:260, action:'🌅 Let Life Move Again'},
    {id:2, title:'Faster Every Morning', focus:'Another growth cycle finishes. Vaeren and Joelle are increasingly alert, mobile and expressive, and Soel remains their preferred target. "They\'re following you again." Soel walks away. Two children follow. "You\'re encouraging them."', image:'assets/comics/arc37/ch02-faster-every-morning.png', xp:265, action:'🐈 Wake Up Faster Every Morning'},
    {id:3, title:"Maera's Fair Tide", focus:'San realizes Maera has stopped behaving like someone temporarily staying at Fair Tide — people ask her questions, she has routines, preferences, she knows where things are. Someone asks when she\'s leaving. Maera pauses. "Leaving?" Nobody had actually discussed it. Apparently she\'s staying.', image:'assets/comics/arc37/ch03-maeras-fair-tide.png', xp:275, action:"🌿 Confirm Maera's Fair Tide"},
    {id:4, title:'Born Here', focus:"Maera spends time with Vaeren and Joelle and points out something San hadn't considered: the twins may have Earth-born parents, but they aren't displaced Earth people. Veyren is their homeland. San finds the idea unexpectedly strange — her children belong naturally to a world she once couldn't even remember arriving in.", image:'assets/comics/arc37/ch04-born-here.png', xp:280, action:'🌊 Confirm They Were Born Here'},
    {id:5, title:'The Horizon Calls', focus:'Renn and Erynn report that Horizon observations have become increasingly stable — new pathways can potentially be mapped. Fair Tide doesn\'t immediately jump through. San has learned enough by now to ask: "What\'s on the other side first?"', image:'assets/comics/arc37/ch05-the-horizon-calls.png', xp:280, action:'📚 Answer When the Horizon Calls'},
    {id:6, title:'Captain and Papa', focus:"San finds Joel working while carrying one of the twins. It's completely ordinary now, and Fair Tide residents have grown accustomed to seeing their Captain interrupted by small children. Leadership didn't stop when San and Joel became parents. It adapted.", image:'assets/comics/arc37/ch06-captain-and-papa.png', xp:285, action:'⚓ Be Captain and Papa'},
    {id:7, title:'Scouts First', focus:"Senedra, KW and Iris survey a newly accessible region associated with unusual Horizon activity — their scout friendship gets actual story use rather than existing only in notes. Different techniques, same objective. They return with evidence that something unusual is affecting local routes.", image:'assets/comics/arc37/ch07-scouts-first.png', xp:290, action:'🧭 Send Scouts First'},
    {id:8, title:'What Erynn Sees', focus:"Erynn senses overlapping possibilities around the disturbance — not futures exactly, something more like paths that shouldn't occupy the same space. Renn immediately wants to investigate; Mimi is less enthusiastic. Maera has heard old Veyren stories about places where reality behaves strangely, but nothing quite like this.", image:'assets/comics/arc37/ch08-what-erynn-sees.png', xp:295, action:'🔭 See What Erynn Sees'},
    {id:9, title:'Two Answers', focus:'Vaeren and Joelle react differently when Renn brings back a harmless sample from the affected region. Vaeren\'s emerging ability responds first; Joelle\'s responds to Vaeren. Soel immediately positions himself between the twins and the sample. Experiment concluded. "You didn\'t ask me." Renn realizes his mistake.', image:'assets/comics/arc37/ch09-two-answers.png', xp:295, action:'🌸 Hear Two Answers'},
    {id:10, title:'Soel Says No', focus:'Renn would like another reading. Soel refuses to move. "Technically, he can\'t prohibit—" Joel looks at him. "Experiment cancelled." Soel\'s guardian role now carries considerable informal authority.', image:'assets/comics/arc37/ch10-soel-says-no.png', xp:290, action:'🐈 Accept Soel Says No'},
    {id:11, title:'Stories Maera Heard', focus:"Maera tells the researchers about old Veyren stories describing people glimpsing places that looked familiar but weren't — different houses, different families, people who resembled someone they knew. The stories were generally dismissed as folklore. Renn isn't dismissing them anymore.", image:'assets/comics/arc37/ch11-stories-maera-heard.png', xp:295, action:'🌿 Hear Stories Maera Heard'},
    {id:12, title:'The Other Shore', focus:"San leads a controlled expedition. The destination is still Veyren, but Horizon distortion is visible there. For a moment, the crew sees something impossible beyond it — a landscape that clearly doesn't belong. Then it's gone. Nobody crosses. Yet.", image:'assets/comics/arc37/ch12-the-other-shore.png', xp:300, action:'🌌 Glimpse the Other Shore'},
    {id:13, title:'Homecoming', focus:"San and Joel return to Fair Tide. Vaeren and Joelle recognize them immediately, and the twins' reaction makes the return far more emotional than San expected. Soel, naturally, behaves as though everyone was only gone five minutes.", image:'assets/comics/arc37/ch13-homecoming.png', xp:290, action:'🏡 Come Home'},
    {id:14, title:"I Knew You'd Do That", focus:"San reaches for something. Joel already hands it to her. Later Joel begins doing something and San has already prepared what he needs. Nothing magical is explicitly happening — they've lived and worked together for so long that this isn't unusual. But the frequency is increasing. Neither notices.", image:'assets/comics/arc37/ch14-i-knew-youd-do-that.png', xp:295, action:"❤️ Know You'd Do That"},
    {id:15, title:"That's Annoying", focus:'It happens repeatedly. "Stop doing that." "Doing what?" "Knowing." "You were looking at it." "I wasn\'t." Joel shrugs. Neither considers supernatural explanations. Which is important. Thought Resonance has not unlocked.', image:'assets/comics/arc37/ch15-thats-annoying.png', xp:295, action:"😂 Call It Annoying"},
    {id:16, title:'Two Against Two', focus:'Vaeren and Joelle begin coordinating — not telepathically, they simply understand each other\'s behavior extraordinarily well. San notices the irony. "They\'re doing your thing." "What thing?" "That thing where you know." Soel joins the twins. San corrects herself. "Three against two."', image:'assets/comics/arc37/ch16-two-against-two.png', xp:300, action:'😇 Face Two Against Two'},
    {id:17, title:"Everyone's Children", focus:"Fair Tide's community relationships continue developing — Joy, Caelan, Aisyah, Mez, Mimi, Brada, Maera and the cousins all interact differently with Vaeren and Joelle. The twins are San and Joel's children. But they're growing up surrounded by a community.", image:'assets/comics/arc37/ch17-everyones-children.png', xp:300, action:"🌺 Raise Everyone's Children"},
    {id:18, title:"Maera's Answer", focus:'San asks Maera whether Veyren-born children normally develop such strong paired connections. Maera gives the most useful answer she can: some do, some don\'t. Twins aren\'t identical. Magic isn\'t identical. Families aren\'t identical. San laughs. Finally, a Veyren answer that amounts to: children are children.', image:'assets/comics/arc37/ch18-maeras-answer.png', xp:300, action:"🌿 Hear Maera's Answer"},
    {id:19, title:'Stable', focus:"Renn announces that one of the strange Horizon overlaps has stopped fluctuating. For the first time, it can potentially be observed safely for longer than a few moments. San authorizes observation. Not crossing. The distinction matters.", image:'assets/comics/arc37/ch19-stable.png', xp:305, action:'🔭 Confirm It\'s Stable'},
    {id:20, title:'Familiar', focus:"The Horizon opens. Something on the other side feels strangely familiar to San — not because she recognizes a building, not because she recognizes a person. It's an emotional familiarity she can't explain. Joel experiences something similar. Neither says much.", image:'assets/comics/arc37/ch20-familiar.png', xp:310, action:'🪞 Feel Something Familiar'},
    {id:21, title:'Not Veyren', focus:"Maera confirms immediately: whatever they're seeing isn't another distant part of Veyren. Erynn agrees. Renn's instruments agree. The Horizon Engine has found something else entirely — another world. That itself isn't unprecedented anymore. But this one feels different.", image:'assets/comics/arc37/ch21-not-veyren.png', xp:400, action:'🌊 Confirm Not Veyren'},
    {id:22, title:'No Expedition Yet', focus:"Renn wants more data. The scouts want reconnaissance. San says no. They observe first, establish stability, determine whether crossing is safe. Earlier San might have rushed toward the mystery. Now she has Fair Tide — and two children waiting at home. Caution isn't fear. It's responsibility.", image:'assets/comics/arc37/ch22-no-expedition-yet.png', xp:300, action:'🧭 Call for No Expedition Yet'},
    {id:23, title:'Something Familiar', focus:'That evening, San tells Joel what she felt. "It felt familiar." Joel is quiet. Then: "Yeah." "You too?" He nods. Neither understands why. For an instant, the Bond responds — not words, not thoughts, just the unmistakable recognition that they felt the same thing. Then it disappears.', image:'assets/comics/arc37/ch23-something-familiar.png', xp:310, action:'❤️ Admit Something Familiar'},
    {id:24, title:"The Door We Haven't Opened", focus:"The Horizon remains stable. Renn records its coordinates. Erynn watches it. Mimi doesn't like the feeling around it. Maera has no explanation. San and Joel stand together before the image — somewhere beyond that threshold are ordinary people living ordinary lives who don't know them yet. \"Not today.\" Joel nods. The door remains closed. For now.", image:'assets/comics/arc37/ch24-the-door-we-havent-opened.png', xp:380, action:"🌌 Leave The Door We Haven't Opened"}
  ];
  window.ARC37_CHAPTERS = ARC37_CHAPTERS;

  const ARC37_CHAPTER_SCENES = {
    1: "Fair Tide has adjusted to having Vaeren and Joelle in it, in the slow, uneven way a household actually adjusts to anything. Not perfectly — there are still mornings that go sideways for no obvious reason. But enough, finally, that life doesn't grind to a full stop every single time one of them wakes up fussing.<br><br>San starts sketching out expedition plans again, properly this time, rather than just thinking about it in passing. Joel keeps doing the same balancing act he's been doing for a while now — First Mate duties in one hand, fatherhood in the other, somehow managing both without either one visibly suffering for it.<br><br>Fair Tide has found its new normal. It only took getting used to.",
    2: 'Another growth cycle finishes, and Vaeren and Joelle come out the other side of it more alert, more mobile, and considerably more expressive than before. Soel, as ever, remains their preferred target of choice.<br><br>"They\'re following you again," San points out, watching the familiar pattern unfold.<br><br>Soel simply walks away, entirely unbothered.<br><br>Two children follow immediately, matching his pace without much effort.<br><br>"You\'re encouraging them," San says, not even trying to hide her amusement.<br><br>Soel does not dispute this.',
    3: 'It occurs to San gradually rather than all at once: Maera has stopped behaving like someone temporarily staying at Fair Tide. People ask her things now, routine things, the way you\'d ask anyone who actually lives somewhere. She has her own routines. Her own preferences. She knows where things are kept without needing to ask.<br><br>Someone, entirely casually, asks when she\'s planning to leave.<br><br>Maera pauses, genuinely caught off guard by the question. "Leaving?" she repeats.<br><br>Nobody had actually discussed it, San realizes, turning the moment over. Somewhere along the way, without a single formal conversation about it, Maera simply became part of Fair Tide. Apparently she\'s staying.',
    4: "Maera spends an afternoon with Vaeren and Joelle, and somewhere in the middle of it, she says something that genuinely catches San off guard. The twins may have Earth-born parents, she points out, but that doesn't make them displaced Earth people the way San herself once was. Veyren is their homeland, plainly and simply, in a way it never quite was for San at the start.<br><br>San finds the idea unexpectedly strange to actually sit with. Her children belong to this world naturally, completely, without ever having to adjust to it the way she did — a world she herself couldn't even properly remember arriving in, the first time she washed up here.",
    5: 'Renn and Erynn bring San a report that would have felt enormous not too long ago: Horizon observations have grown steadily more stable, and new pathways can potentially be mapped as a result.<br><br>Fair Tide doesn\'t immediately jump through any of them.<br><br>San has learned enough, across everything that\'s happened since Arc XVIII, to ask the obvious question first instead of rushing past it. "What\'s on the other side first?" she asks, before anyone gets ahead of themselves.<br><br>It\'s a small moment. It also says a great deal about how far she\'s actually come.',
    6: "San finds Joel working through a stack of harbor logistics while carrying one of the twins against his shoulder, entirely unbothered by the combination. It's completely ordinary now — nobody even really registers it as unusual anymore.<br><br>Fair Tide's own residents have grown just as accustomed to it, used to seeing their Captain interrupted mid-conversation by a small child needing something. Leadership never actually stopped the moment San and Joel became parents. It simply adapted around the new shape of their lives, the same way everything else at Fair Tide eventually does.",
    7: "Senedra, KW Liang, and Iris head out to survey a newly accessible region, one that's been showing unusual Horizon activity nobody's properly looked at yet. Their long-running scout friendship finally gets some actual use in the story itself, rather than existing only as a background detail — three very different techniques, all aimed at the exact same objective.<br><br>They come back with real evidence: something out there is genuinely affecting the local routes, in a way none of them can fully explain yet.",
    8: "Erynn spends time with the readings the scouts brought back, and what she senses unsettles her more than she initially lets on. Overlapping possibilities, she calls it — not futures exactly, something closer to paths that shouldn't be occupying the same space at the same time.<br><br>Renn wants to investigate immediately, predictably delighted by the puzzle of it. Mimi is considerably less enthusiastic, watching the whole thing with open unease.<br><br>Maera mentions, carefully, that she's heard old Veyren stories about places where reality itself behaves strangely. Nothing, she adds, quite like this.",
    9: "Renn brings back a small, carefully tested, genuinely harmless sample from the affected region — and Vaeren and Joelle react to it almost immediately, each in their own distinct way. Vaeren's emerging ability responds first, flickering to life on its own. A moment later, Joelle's responds too, not to the sample directly, but to Vaeren's own reaction.<br><br>Soel doesn't hesitate. He plants himself firmly between the twins and the sample before anyone else can react at all.<br><br>Experiment concluded, whether Renn intended that or not.<br><br>\"You didn't ask me,\" San says, with real edge to it.<br><br>Renn, to his credit, recognizes the mistake immediately.",
    10: 'Renn would like one more reading, just to confirm what they saw. Soel refuses to move from where he\'s settled, directly between the twins and anything Renn might bring near them.<br><br>"Technically, he can\'t prohibit—" Renn starts.<br><br>Joel looks at him. Just looks.<br><br>"Experiment cancelled," Renn says, immediately.<br><br>Soel\'s role as the twins\' guardian has, apparently, come with a considerable amount of informal authority nobody voted on but everyone seems to respect anyway.',
    11: "Maera settles in for a longer conversation with the researchers and tells them about old Veyren stories she grew up hearing — people glimpsing places that looked familiar but weren't quite right. Different houses standing where they shouldn't. Different families living lives that almost matched someone's own. People who resembled someone they knew, closely enough to unsettle, not closely enough to actually be them.<br><br>The stories were always dismissed as folklore, Maera admits, the kind of thing told to make an evening feel a little stranger than it was.<br><br>Renn isn't dismissing them anymore. Not after everything else they've already seen.",
    12: "San leads a carefully controlled expedition out toward the affected region — the destination is still, technically, Veyren, but the Horizon distortion there is visible now, plainly, to everyone watching.<br><br>For one brief moment, something impossible appears beyond it: a landscape that clearly, unmistakably doesn't belong to this world at all.<br><br>Then it's gone, vanishing as suddenly as it appeared.<br><br>Nobody crosses. Not this time.",
    13: "San and Joel make it back to Fair Tide, and Vaeren and Joelle recognize them the instant they're close enough to see. The twins' reaction — immediate, overwhelming, entirely unguarded — makes the whole homecoming land far harder than San actually expected it to.<br><br>Soel, for his part, behaves exactly as though nobody was gone longer than five minutes, completely unbothered by the entire ordeal.",
    14: "San reaches for something without quite finishing the thought of asking for it. Joel's already handing it to her by the time she looks up.<br><br>Later, the same thing happens in reverse — Joel starts on some small task, and San's already prepared exactly what he's about to need, before he's said a word about it.<br><br>Nothing magical is happening here, not explicitly. They've lived and worked alongside each other long enough that this kind of thing stops being remarkable somewhere along the way.<br><br>But it's happening more often than it used to. Neither of them notices that part at all.",
    15: 'It keeps happening, over and over, often enough that it finally gets a reaction out of San.<br><br>"Stop doing that," she says.<br><br>"Doing what?" Joel asks, genuinely unclear what she means.<br><br>"Knowing."<br><br>"You were looking at it," Joel points out.<br><br>"I wasn\'t," San says, with complete confidence.<br><br>Joel just shrugs, entirely unbothered by the accusation.<br><br>Neither of them reaches for any kind of supernatural explanation for any of it. Which, in its own quiet way, matters considerably more than it looks like it should.',
    16: 'Vaeren and Joelle start coordinating with each other in ways that catch everyone\'s attention eventually — not telepathically, nothing that dramatic, they simply understand each other\'s behavior with a kind of ease that goes well past ordinary sibling closeness.<br><br>San notices the obvious irony in it before anyone else does. "They\'re doing your thing," she tells Joel.<br><br>"What thing?" Joel asks.<br><br>"That thing where you know."<br><br>Soel promptly joins the twins, settling in beside them as though he\'d always been part of whatever this is.<br><br>San corrects herself immediately. "Three against two."',
    17: "Fair Tide's web of relationships keeps growing around Vaeren and Joelle, each person finding their own particular way into the twins' lives. Joy, Caelan, Aisyah, Mez, Mimi, Brada, Maera, and all their various cousins each interact with the twins differently, in ways that are becoming genuinely their own rather than interchangeable.<br><br>The twins are San and Joel's children, first and always. But they're growing up held by an entire community built up around them, one relationship at a time.",
    18: "San finally asks Maera directly whether Veyren-born children normally develop connections as strong as the twins'. Maera gives her the most honest, useful answer she actually has available: some do, some don't. Twins aren't identical to each other. Magic isn't identical from one child to the next. Families aren't identical either, however much people sometimes expect them to be.<br><br>San laughs, genuinely, at how it all lands. Finally, a real Veyren answer that amounts to something refreshingly simple: children are children, wherever they happen to be born.",
    19: "Renn brings San real news for once — one of the strange Horizon overlaps they've been tracking has actually stopped fluctuating entirely. For the first time, it can potentially be observed safely, for longer than the brief, flickering moments they've managed so far.<br><br>San authorizes observation. Not crossing.<br><br>The distinction matters enormously to her, and she makes sure everyone involved understands exactly where that line sits before anyone gets ahead of themselves.",
    20: "The Horizon opens, steady this time, holding rather than flickering shut immediately. And something about what's on the other side feels strangely, inexplicably familiar to San — not because she recognizes any specific building, not because she recognizes a single person standing there. It's an emotional familiarity she genuinely can't account for, sitting somewhere underneath anything she could actually point to.<br><br>Joel experiences something close to the same thing, watching beside her. Neither of them says very much about it at all.",
    21: "Maera confirms it almost immediately, without needing long to look: whatever they're actually looking at isn't another distant part of Veyren at all. Erynn agrees, working through her own readings. Renn's instruments agree too, cleanly, without ambiguity.<br><br>The Horizon Engine has found something else entirely. Another world, genuinely separate from their own.<br><br>That part, on its own, isn't unprecedented anymore — they've done this before. But this one feels different, in a way none of them can quite put into words yet.",
    22: "Renn wants more data before anyone does anything else. The scouts want to go out and actually reconnoiter the area properly. San says no to both, at least for now.<br><br>They observe first. They establish real stability. They determine, carefully, whether crossing would even be safe before anyone seriously considers it.<br><br>Earlier in her life, San knows, she might have rushed straight toward a mystery like this without a second thought. Now she has Fair Tide to answer to — and two children waiting for her at home. Caution, she's learned, isn't the same thing as fear. It's simply responsibility, worn a little more comfortably than it used to be.",
    23: 'That evening, San finally tells Joel what she actually felt, rather than letting it sit unspoken between them. "It felt familiar," she says.<br><br>Joel goes quiet for a moment. Then: "Yeah."<br><br>San looks at him properly. "You too?"<br><br>He nods, simply.<br><br>Neither of them understands why, and neither pretends otherwise. For one brief instant, something passes between them — not words, not anything either could call a thought exactly, just the unmistakable recognition that they both felt the exact same thing, at the exact same moment.<br><br>Then it\'s gone, as quickly as it arrived. Neither of them knows what actually happened. Neither tries very hard to explain it.',
    24: 'The Horizon stays stable, holding steady the way it has for days now. Renn carefully records its coordinates. Erynn keeps watching it, patient and methodical. Mimi still doesn\'t like the feeling that sits around it, whatever it actually is. Maera has no explanation to offer, and says so plainly.<br><br>San and Joel stand together in front of the image for a long moment, not saying much. Somewhere beyond that threshold, San knows, are ordinary people living out their own ordinary lives — people who don\'t know San at all, don\'t know Joel at all. And San and Joel don\'t yet know them either.<br><br>San reaches for Joel\'s hand. He was already reaching for hers.<br><br>Behind them, Fair Tide continues exactly as it always does. Vaeren and Joelle are home, safe, probably causing some small amount of trouble. Soel is very likely supervising them, in whatever way he actually does that.<br><br>San looks back toward the unexplored Horizon one more time. "Not today," she says.<br><br>Joel nods, in complete agreement.<br><br>The door remains closed. For now.'
  };
  window.ARC37_CHAPTER_SCENES = ARC37_CHAPTER_SCENES;

  window.arc37ObjectiveState = function(){
    if (!game.arc36Complete) return null;
    if (level() < 555) return null;
    game.comicProgress37 = game.comicProgress37 || {};
    for (const ch of ARC37_CHAPTERS) {
      if (!game.comicProgress37[ch.id]) return 'complete_arc37_chapter_' + ch.id;
    }
    return 'arc37_part1_complete_for_now';
  };

  window.markArc37ChapterRead = function(id){
    const so = window.arc37ObjectiveState();
    if (so !== ('complete_arc37_chapter_' + id)) return;
    game.comicProgress37 = game.comicProgress37 || {};
    game.comicProgress37[id] = true;
    // Matches every prior arc's own completion flag (arc35/arc36Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 24) game.arc37Complete = true;
    const ch = ARC37_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC37_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC37_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc37Splash = function(){
    const overlay = document.getElementById('arc37SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc37Splash = function(){
    const overlay = document.getElementById('arc37SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc37SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc37 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc37) oldRenderStoryForArc37();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc37Ready = window.arc37ObjectiveState() !== null;
    if (arc37Ready && !game.arc37SplashSeen && typeof window.__ctShowArc37Splash === 'function') {
      window.__ctShowArc37Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc37/arc37-cover-children-of-two-worlds.png" alt="Arc XXXVII — Children of Two Worlds" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXXVII</div><div class="story-act-title">Children of Two Worlds</div>'+
      '<div class="story-act-tagline">Where you come from is part of you. It doesn\'t decide where you belong.</div></div>';
    if (!arc37Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXXVII Locked</div><div class="story-chapter-sub">'+
        (!game.arc36Complete ? 'Finish Arc XXXVI first.' : 'Reach Level 555 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc37ObjectiveState();
    ARC37_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress37 && game.comicProgress37[ch.id]);
      const ready = !done && so===('complete_arc37_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = 
          '<button class="btn btn-small btn-success" onclick="markArc37ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc37_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXXVII chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
