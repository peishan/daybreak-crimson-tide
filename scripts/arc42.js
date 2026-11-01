(function(){
  // -------------------------------------------------------------------
  // ARC XLII — MEET THE MAKER. Chapters 1-35 so far ("First Contact" +
  // "The World Beyond the Manuscript" + "An Invitation Across Worlds" +
  // "Familiar Faces, New Friends"), per San's own note that this arc
  // needs building in pieces. Gated at game.arc41BridgeComplete + level
  // 630 -- the same level the bridge chapter itself required, not a
  // further bump, since Ch.1 picks up immediately where the bridge left
  // off ("Following the Horizon crossing") rather than after any further
  // time or leveling.
  //
  // This file is deliberately incomplete. ARC42_CHAPTERS currently only
  // holds these first seven blocks; arc42ObjectiveState() reports
  // 'arc42_part1_complete_for_now' once all thirty-five are read, same
  // fallback message every other arc file already has for exactly this
  // situation. No game.arc42Complete is set anywhere in this file --
  // that flag belongs to whichever chapter actually closes the arc, not
  // yet written. Later chapter blocks extend ARC42_CHAPTERS/
  // ARC42_CHAPTER_SCENES in place, the same way this file has already
  // grown six times and will keep growing, not replace itself.
  //
  // Ch.16-20 ("Familiar Faces, New Friends") bring Sally and Levi into
  // the Lunareth side of the story alongside Jade and Devon, then carry
  // all four of them to Fair Tide together -- the crossover planning
  // doc's own "Group 1" visit (Jade, Devon, Sally, Levi travelling as a
  // foursome, no Hugh/Sera, no accompanying relatives). Per the roster
  // doc's own explicit restraint, the Devon<->Joel/Ser Aldric and
  // Levi<->Senedra/Iris/KW Liang connections mentioned in Ch.17/18/20 are
  // narrative compatibility beats only, not new mechanics or automatic
  // combat bonuses -- Senedra, Ser Aldric, Iris and KW Liang are already
  // ordinary fieldable ALL_PARTY companions (core-engine.js), nothing
  // further to wire for them here. Sally and Levi remain temporary story
  // allies this block, same as the rest of Jade's party since Ch.2 --
  // never recruited, never given ALL_PARTY entries. Ch.19 adds one more
  // entry to the same Black Pearl investigation log Ch.9/10/13 already
  // started (still no new properties or conclusions invented, per the
  // outline's own restraint carried over from every earlier batch).
  //
  // Ch.21-25 close out Group 1's stay (Ch.21-22, same narrative-only
  // treatment as Ch.17/18 -- a friendly archery exercise, a training
  // exchange, nothing mechanical) and then open the roster doc's own
  // "Group 2" visit: Hugh and Sera, alone, deliberately without Rheon
  // or anyone else from Lunareth. Per the roster doc's explicit
  // instruction, their romance develops DURING this stay rather than
  // being pre-established -- Ch.23 is still an unspoken, unconfirmed
  // interest; Ch.25 is the first time either of them actually says so,
  // ending at a held hand, not a kiss or anything further. No game flag
  // is set for any of this -- it's pure narrative, same restraint as
  // every other Fountain-of-Youth/pregnancy/recruitment note in this
  // arc's own Gameplay sections.
  //
  // Ch.26-30 finish Hugh and Sera's first private visit. Ch.27 finally
  // pays off the cooling spring Ch.15 only teased (game.fairTideCooling-
  // SpringTeased) -- and reveals in the same breath that it's the
  // Fountain of Youth itself, same location raid-mode.js's own
  // renderFountainDispatchPanel already gates on game.fairTideRoster
  // membership. Per the outline's explicit note, this chapter calls
  // NO Fountain code at all: Hugh and Sera are temporary guests, never
  // added to fairTideRoster, so nothing here could activate its
  // restorative effects even by accident -- a scenic visit, narrated as
  // one, nothing more. Ch.28's first intimacy is explicitly off-panel,
  // same restraint as every other romance beat in this file; no
  // pregnancy flag, no family-development flag, nothing mechanical is
  // set anywhere in this block. Hugh and Sera return to Lunareth at
  // Ch.30 with their relationship confirmed between themselves but
  // still unspoken to anyone else -- the eventual pregnancy reveal the
  // outline itself reserves for Tribute's own shorter crossover
  // storyline, not this file.
  //
  // Ch.31-35 open the roster doc's remaining visiting pairs: Adrian and
  // Eve (Ch.31-32, with Adrian's own R&D collaboration), then Sky and
  // Jenika (Ch.33-35, with their medical-team collaboration). Both
  // pairs are, same as every visitor before them, temporary story
  // allies only -- no ALL_PARTY entries, no automatic recruitment, no
  // Fountain activation. Dr. AA, Maera, Senedra, Sister Wren, Jovie and
  // Eliz are all already-established Fair Tide companions/roster
  // members (core-engine.js / arc5-and-objective-chain.js); Jovie is
  // deliberately kept as a medical assistant and infirmary coordinator
  // in Ch.34's own text, never written as a magical healer, per the
  // roster doc's explicit note. The Black Pearl investigation is
  // intentionally NOT touched in this block -- it stays exactly where
  // Ch.9/10/13/19 left it, an open thread, not resolved or advanced
  // here.
  //
  // Ch.6-10 ("The World Beyond the Manuscript") introduce one new piece
  // of mechanics: Ch.8's frontier disturbance is an actual fight, not a
  // straight mark-as-read, using the same one-off-story-fight pattern
  // Arc IX's Ch.12 and Arc XXXVIII's Archive Guardians already
  // established (startArc42FrontierBattle, scripts/arc42-mechanics.js --
  // same story/mechanics split used since Arc XXIII). Ch.9's Black Pearl
  // mention registers that the investigation has STARTED, nothing more:
  // per the outline's own explicit restraint, no new Pearl properties or
  // conclusions are invented here, matching the crossover planning
  // doc's own note that its artifact effects are deliberately future
  // work, not this block's.
  //
  // Ch.11-15 ("An Invitation Across Worlds") bring Jade's party to
  // Veyren for the first time -- a short, explicitly temporary visit,
  // never a recruitment or settlement. Ch.13 adds the Arcane Trio's own
  // preliminary pass on the Black Pearl to the same investigation log
  // Ch.9/10 started (still no properties or conclusions invented).
  // Ch.15's cooling spring is deliberately just a tease -- a flag
  // (game.fairTideCoolingSpringTeased) for a later chapter block to
  // actually pay off, not a built destination here.
  //
  // Per the outline's own explicit framing: the bridge chapter
  // (arc41-bridge.js) already handled the Horizon crossing itself --
  // this arc begins after arrival and never repeats it. San and Joel
  // are the viewpoint throughout; Jade's own perspective is reserved
  // for actual Tribute-side crossover chapters, not narrated here.
  // Jade's five-person party (Jade, Devon, Sky, Levi, Sally -- per the
  // crossover planning doc's own confirmed roster) are temporary story
  // allies this block, never recruited, never given ALL_PARTY entries.
  //
  // Ch.3-4's own reveal -- San recognizes Jade and Devon's names from
  // an old, unfinished manuscript of her own ("Imperial Guard Meets
  // Runaway Prince," later "Tangled with the Runaway Prince," shelved
  // during a difficult stretch of her marriage) -- is San's own
  // storyline exactly as outlined, nothing invented beyond it. Thought
  // Resonance (Ch.3) is already guaranteed unlocked by the time any
  // player reaches here: this arc's own gate requires arc41Bridge-
  // Complete, which requires arc41Complete, which requires arc40Complete
  // (Thought Resonance's own arc) -- so no new mechanical hook is
  // needed, just the existing system already being live.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. Nothing in this five-chapter block needs its
  // own mechanics file -- no new systems, no recruitment, no combat
  // (per the outline's own "Jade's party becomes temporary story
  // allies, not permanent recruits" and "Black Pearl investigation
  // begins in a later chapter").
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.webp) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC42_CHAPTERS = [
    {id:1, title:'A Strange New Shore', focus:"Following the Horizon crossing, San and Joel assess their surroundings aboard the enormous junk. Their arrival attracts attention from nearby residents. \"We've made quite an entrance.\" \"It's a big ship.\" A group approaches from the shore.", image:'assets/comics/arc42/ch01-a-strange-new-shore.webp', xp:400, action:'🌌 Survey a Strange New Shore'},
    {id:2, title:'Another Visitor?', focus:"Jade and her canonical five-person party investigate the unfamiliar vessel. Jade mentions that another interworld visitor appeared only a week earlier. \"Another?\" \"You're not the first.\" Both groups cautiously begin introductions.", image:'assets/comics/arc42/ch02-another-visitor.webp', xp:380, action:'🚢 Answer Another Visitor?'},
    {id:3, title:'Jade Gold', focus:"Jade introduces herself and Devon. San recognizes their names from an old, unfinished manuscript. Joel senses her surprise through Thought Resonance. Jade notices San's reaction but receives no explanation.", image:'assets/comics/arc42/ch03-jade-gold.webp', xp:420, action:'✨ Meet Jade Gold'},
    {id:4, title:'The Story I Left Behind', focus:"Privately, San tells Joel about Imperial Guard Meets Runaway Prince, later renamed Tangled with the Runaway Prince. The story changed repeatedly before San put it aside during difficulties in her marriage. She remembers an early, incompletely developed Jade, not the woman standing before her.", image:'assets/comics/arc42/ch04-the-story-i-left-behind.webp', xp:420, action:'📖 Revisit the Story I Left Behind'},
    {id:5, title:'An Invitation to Stay', focus:"Jade's party offers to help San and Joel understand Lunareth. San learns that Jade's adventures continued far beyond her unfinished manuscript. The groups agree to cooperate. San keeps the manuscript connection private for now.", image:'assets/comics/arc42/ch05-an-invitation-to-stay.webp', xp:400, action:'🤝 Accept an Invitation to Stay'},
    {id:6, title:'Five Years Later', focus:"Jade tells San and Joel about the defeat of Xima's curse and the five peaceful years that followed. San is astonished by how much Jade's life has changed. \"You really didn't write any of this?\" \"I didn't even get this far.\"", image:'assets/comics/arc42/ch06-five-years-later.webp', xp:390, action:'🌙 Hear of Five Years Later'},
    {id:7, title:'The Guard and the First Mate', focus:"Joel and Devon find common ground through their protective instincts and experience supporting strong-willed partners. Meanwhile, San and Jade exchange stories about their adventures. Jade discovers that San is considerably less formal than she expected from a captain.", image:'assets/comics/arc42/ch07-the-guard-and-the-first-mate.webp', xp:385, action:'⚔️ Meet the Guard and the First Mate'},
    {id:8, title:'A Little Adventure', focus:"Jade's party invites San and Joel to help investigate a minor disturbance along the frontier. The two groups work together, learning each other's abilities and fighting styles. The successful expedition establishes mutual trust without introducing another major villain.", image:'assets/comics/arc42/ch08-a-little-adventure.webp', xp:410, action:'🗡️ Join a Little Adventure'},
    {id:9, title:'The Pearl That Remains', focus:"During a quiet conversation, Jade and Devon mention the Black Pearl. Although Xima's curse has ended, the Pearl remains a concern. San realizes this is something entirely beyond her original manuscript. She suggests involving Fair Tide's researchers.", image:'assets/comics/arc42/ch09-the-pearl-that-remains.webp', xp:420, action:'🖤 Learn of the Pearl That Remains'},
    {id:10, title:'An Open Door', focus:"San explains the Horizon Engine and Fair Tide's research capabilities. Jade's companions are intrigued by the possibility of visiting another world. San offers to arrange a future visit. \"You're inviting everyone already?\" \"I'm being hospitable.\" \"Of course you are.\"", image:'assets/comics/arc42/ch10-an-open-door.webp', xp:410, action:'🚪 Leave an Open Door'},
    {id:11, title:'A Passage to Veyren', focus:'San arranges a short visit to Fair Tide for Jade and her five-person party. The visitors experience the Horizon passage and discover that Veyren is unlike Lunareth. Joel assures them the journey is reversible. "You do this regularly?" "We\'re getting better at it."', image:'assets/comics/arc42/ch11-a-passage-to-veyren.webp', xp:420, action:'🌌 Open a Passage to Veyren'},
    {id:12, title:'Welcome to Fair Tide', focus:"San and Joel introduce their guests to Fair Tide. Jade's party meets members of the crew, including Renn, Erynn and Mimi. The researchers are fascinated by the visitors' different abilities and experiences. San proudly shows Jade the settlement she helped build.", image:'assets/comics/arc42/ch12-welcome-to-fair-tide.webp', xp:400, action:'⚓ Welcome Them to Fair Tide'},
    {id:13, title:'The Arcane Trio', focus:"Renn, Erynn and Mimi begin preliminary examinations of the Black Pearl's known history and effects. Jade explains what she and Devon understand about it. The researchers acknowledge that its nature remains uncertain -- further investigation will require information from Lunareth.", image:'assets/comics/arc42/ch13-the-arcane-trio.webp', xp:430, action:'🔮 Consult the Arcane Trio'},
    {id:14, title:"The Captain's Family", focus:"Jade and her companions meet Vaeren, Joelle and Soel. San and Joel's established family life surprises them. Jade quietly observes the twins, while Devon notices her thoughtful expression. San senses the couple may have something personal on their minds, but doesn't pry.", image:'assets/comics/arc42/ch14-the-captains-family.webp', xp:410, action:"🐈 Meet the Captain's Family"},
    {id:15, title:'A Rather Nice Spring', focus:'Before their guests return to Lunareth, San casually mentions a beautiful cooling spring in Fair Tide. Jade is curious. Joel recognizes San\'s suspiciously innocent expression. "San…" "What? It\'s very refreshing." The visitors agree to see it during a future stay. San offers no further explanation.', image:'assets/comics/arc42/ch15-a-rather-nice-spring.webp', xp:400, action:'♨️ Mention a Rather Nice Spring'},
    {id:16, title:'Familiar Faces, New Friends', focus:"San and Joel return to Lunareth to continue their exploration with Jade and Devon. This time, Jade introduces Sally and Levi, who are eager to meet the visitors from another world. Sally quickly makes herself comfortable around San and Joel. \"You two seem to get along already.\" \"Some people are just easy to talk to.\"", image:'assets/comics/arc42/ch16-familiar-faces-new-friends.webp', xp:390, action:'👋 Welcome Familiar Faces'},
    {id:17, title:"The Archer's Eye", focus:"Levi accompanies the group on a short reconnaissance expedition. His accuracy and field awareness impress Joel, who mentions Fair Tide's scouts: Senedra, Iris and KW Liang. Levi becomes interested in exchanging techniques with them. \"Careful. Give him a new bow and you'll never see him again.\" \"I heard that.\"", image:'assets/comics/arc42/ch17-the-archers-eye.webp', xp:400, action:"🏹 Watch the Archer's Eye"},
    {id:18, title:'Knights of Different Worlds', focus:"Devon and Joel compare their experiences as knight and paladin. Their conversation turns to duty, protecting others and the difficulties of travelling with determined partners. San and Jade overhear them. \"Are they talking about us?\" \"Almost certainly.\" \"We're standing right here.\"", image:'assets/comics/arc42/ch18-knights-of-different-worlds.webp', xp:410, action:'⚔️ Compare Knights of Different Worlds'},
    {id:19, title:'A Question of Trust', focus:"The group investigates another clue connected to the unresolved Black Pearl. Jade shares what she knows, while San admits that Fair Tide's researchers still need more evidence. They agree to investigate together rather than make assumptions about the Pearl's nature. Devon suggests that Ser Aldric might also be interested in the findings.", image:'assets/comics/arc42/ch19-a-question-of-trust.webp', xp:430, action:'🖤 Raise a Question of Trust'},
    {id:20, title:'Four Guests at Fair Tide', focus:"Jade, Devon, Sally and Levi travel together to Fair Tide. Joel introduces Devon to Ser Aldric, while Levi meets Senedra, Iris and KW Liang. Sally quickly makes friends throughout the settlement. San watches the visitors settle in. \"You've made four more people feel at home.\" \"They haven't moved in.\" \"Yet.\"", image:'assets/comics/arc42/ch20-four-guests-at-fair-tide.webp', xp:420, action:'⚓ Host Four Guests at Fair Tide'},
    {id:21, title:'A Friendly Competition', focus:"Levi joins Senedra, Iris and KW Liang for archery practice and a scouting exercise. Their different techniques make for an entertaining competition, with everyone learning something. Sally watches from nearby. \"He's going to want to stay here.\" \"We do have room.\" \"San.\"", image:'assets/comics/arc42/ch21-a-friendly-competition.webp', xp:400, action:'🏹 Join a Friendly Competition'},
    {id:22, title:'The Knight and the Paladin', focus:"Devon trains alongside Joel and Ser Aldric. Their different fighting styles lead to a spirited exchange about duty, discipline and protecting others. Meanwhile, Jade and San discuss how much their lives have changed since their first adventures. Jade begins to see San as a friend rather than simply a mysterious visitor.", image:'assets/comics/arc42/ch22-the-knight-and-the-paladin.webp', xp:410, action:'⚔️ Train with the Knight and the Paladin'},
    {id:23, title:'A Quiet Invitation', focus:"After Jade's group returns to Lunareth, San and Joel encounter Hugh and Sera. Both seem interested in visiting Fair Tide, although neither explains why they want to travel together. San offers them a quiet stay without an expedition schedule. \"Just the two of you?\" \"If that isn't inconvenient.\" \"Not at all.\"", image:'assets/comics/arc42/ch23-a-quiet-invitation.webp', xp:400, action:'🤝 Extend a Quiet Invitation'},
    {id:24, title:'Somewhere Nobody Knows Us', focus:"Hugh and Sera arrive in Fair Tide without their families or companions. Away from Lunareth's expectations, they discover how comfortable they are simply spending time together. They explore the settlement, share meals and talk without worrying about who might overhear. \"It's strange. Nobody here expects anything from us.\" \"Perhaps that's why I can finally breathe.\"", image:'assets/comics/arc42/ch24-somewhere-nobody-knows-us.webp', xp:420, action:'🌊 Arrive Somewhere Nobody Knows Us'},
    {id:25, title:'The Things Left Unsaid', focus:"Hugh and Sera spend an afternoon walking beyond the busy settlement. Their conversation gradually turns to the feelings they've avoided acknowledging for years. Hugh admits that he feared making Sera's life more difficult. Sera confesses that she feared the same for him. For the first time, neither retreats from the conversation.", image:'assets/comics/arc42/ch25-the-things-left-unsaid.webp', xp:440, action:'🤍 Speak the Things Left Unsaid'},
    {id:26, title:'No Titles Between Us', focus:"Hugh and Sera spend another peaceful day exploring Fair Tide. Without their families, responsibilities or the expectations of Lunareth, they begin treating each other more openly. Sera admits she has never felt quite so free. \"You don't have to be Lady Sera here.\" \"And you don't have to pretend you aren't happy to see me.\" Hugh laughs, taking her hand.", image:'assets/comics/arc42/ch26-no-titles-between-us.webp', xp:420, action:'🌿 Spend a Day with No Titles Between Us'},
    {id:27, title:'The Cooling Spring', focus:"San recommends a secluded spring outside the busiest part of Fair Tide. \"It's a lovely place to relax. Very refreshing.\" \"You do enjoy recommending that place.\" \"It's a nice spring.\" Hugh and Sera visit together, enjoying the quiet water and the rare opportunity to be completely alone. Neither knows about the Fountain's restorative properties.", image:'assets/comics/arc42/ch27-the-cooling-spring.webp', xp:410, action:'♨️ Visit the Cooling Spring'},
    {id:28, title:'Just This Once', focus:"As evening approaches, Hugh and Sera remain together near their secluded retreat. Their conversation turns to the years they spent hiding their feelings. Hugh finally kisses Sera, and she responds without hesitation. They choose to spend the night together, away from the judgment and expectations of Lunareth. Their first intimacy remains private and off-panel.", image:'assets/comics/arc42/ch28-just-this-once.webp', xp:450, action:'🌙 Share an Evening, Just This Once'},
    {id:29, title:'A Different Kind of Morning', focus:"Hugh wakes beside Sera, surprised by how peaceful everything feels. Neither regrets the previous evening, although returning home suddenly seems more complicated. \"We can't stay here forever.\" \"I know.\" \"But perhaps we don't have to go back to pretending.\" They agree to face their future together, one step at a time.", image:'assets/comics/arc42/ch29-a-different-kind-of-morning.webp', xp:430, action:'🌅 Wake to a Different Kind of Morning'},
    {id:30, title:'A Secret Worth Keeping', focus:"Hugh and Sera prepare to return to Lunareth. San notices their newfound closeness but politely says nothing. \"They seem happier.\" \"Fair Tide has that effect on people.\" Before leaving, Sera thanks San for giving them somewhere they could simply be themselves. Their relationship remains private for now, but they are no longer uncertain about each other.", image:'assets/comics/arc42/ch30-a-secret-worth-keeping.webp', xp:440, action:'🤫 Guard a Secret Worth Keeping'},
    {id:31, title:'The Older Brother', focus:"San and Joel return to Lunareth, where Jade introduces her older brother Adrian and his partner Eve. Adrian is curious about the visitors who have become such good friends with his younger sister. \"Jade doesn't usually trust strangers this quickly.\" \"They're hardly strangers anymore.\" \"I think that's a compliment.\" \"Mostly.\"", image:'assets/comics/arc42/ch31-the-older-brother.webp', xp:400, action:'👨‍👩‍👧 Meet the Older Brother'},
    {id:32, title:'A Different Kind of Workshop', focus:"Adrian and Eve accompany San and Joel to Fair Tide. Renn and Erynn introduce them to the settlement's workshops and research facilities. Adrian becomes interested in how the Horizon Engine connects different worlds, while Eve offers her own observations. \"Be careful. Once the researchers start talking, they don't stop.\" \"You fit right in, then.\"", image:'assets/comics/arc42/ch32-a-different-kind-of-workshop.webp', xp:410, action:'🔧 Tour a Different Kind of Workshop'},
    {id:33, title:"The Healer's Curiosity", focus:"Back in Lunareth, Jade introduces Sky, her cousin, and Jenika, Devon's cousin. San learns that Sky and Jenika have a young son together, although they aren't married. Their conversation turns to the differences between Lunareth's healing practices and those of Veyren. Sky expresses interest in meeting Fair Tide's medical team.", image:'assets/comics/arc42/ch33-the-healers-curiosity.webp', xp:400, action:"🩺 Satisfy the Healer's Curiosity"},
    {id:34, title:'Two Worlds of Healing', focus:"Sky and Jenika visit Fair Tide, where they meet Dr. AA, Maera, Senedra, Sister Wren, Jovie and Eliz. The group compares medical practices, healing methods and patient care across their worlds. Jovie shows the visitors how the infirmary is organised, while Dr. AA discusses the importance of understanding unfamiliar conditions before attempting treatment. \"You have quite a team here.\" \"And somehow they're still putting up with all of us.\"", image:'assets/comics/arc42/ch34-two-worlds-of-healing.webp', xp:420, action:'⚕️ Compare Two Worlds of Healing'},
    {id:35, title:'Knowledge Worth Sharing', focus:"Sky and Jenika spend more time with Fair Tide's medical team. Their discussions reveal opportunities for future collaboration, while Adrian's earlier observations give Renn and Erynn another perspective on cross-world research. San proposes keeping communication open between the two worlds rather than asking everyone to relocate. \"So we're establishing another partnership?\" \"That's what happens when people get along.\" \"You make it sound very simple.\" \"It usually is. Until the paperwork.\"", image:'assets/comics/arc42/ch35-knowledge-worth-sharing.webp', xp:430, action:'🤝 Exchange Knowledge Worth Sharing'}
  ];
  window.ARC42_CHAPTERS = ARC42_CHAPTERS;

  const ARC42_CHAPTER_SCENES = {
    1: "The crossing settles, and the Crimson Tide finds itself riding unfamiliar water, a new coastline stretched out ahead. San and Joel take stock of their surroundings properly for the first time — no immediate danger, no obvious welcome either, just an unfamiliar shoreline and a crew waiting on their next word.<br><br>It doesn't take long for the ship itself to draw attention. The Crimson Tide was never built to be subtle, and against an unfamiliar coastline it reads as something between a curiosity and an event. Figures gather along the shore, more of them by the minute, watching the enormous vessel with the particular stillness of people deciding whether to be alarmed.<br><br>\"We've made quite an entrance,\" Joel says, watching the gathering crowd.<br><br>\"It's a big ship,\" San says, which isn't exactly a denial.<br><br>Before either of them can decide on a next move, a group breaks away from the shore and starts toward them — unhurried, deliberate, clearly not the first time any of them have had to size up something unexpected showing up on their water.",
    2: "The group turns out to be exactly what San expected and nothing like what she pictured: five people, moving together with the easy, practiced coordination of a party that's done this before, closing the distance to get a proper look at the ship.<br><br>Introductions happen carefully, both sides reading the other before committing to much. The one clearly leading the group — sharp-eyed, unhurried, used to being listened to — mentions something that catches San's full attention immediately.<br><br>\"You're not the first,\" she says. \"Had someone else show up out of nowhere, about a week back.\"<br><br>\"Another?\" San asks.<br><br>\"Another,\" the woman confirms, watching San's reaction with open curiosity now.<br><br>Both groups start in on proper introductions after that, still careful, still feeling out exactly how much to say. San's crew falls into the familiar rhythm of a first contact that could go any number of directions. So, clearly, does the other side.",
    3: '"Jade," the woman says, offering it plainly, the way someone does when a name has carried real weight for a long time. Beside her, a sharp-featured man inclines his head. "Devon."<br><br>San goes very still.<br><br>It\'s nothing either Jade or Devon would notice on their own — the names alone wouldn\'t mean anything to a stranger. But they aren\'t strangers\' names to San. They\'re names she wrote, once, a long time ago, in a story she never finished.<br><br>Joel feels it before she says a single word about it — the faint, wordless jolt of her own surprise passing through whatever sits between them now, the same quiet thing that\'s been living in the space between their thoughts since Arc XL. He doesn\'t ask, not out loud, not yet. He just knows something just happened.<br><br>Jade notices too, in her own way — the half-second where San\'s composure genuinely slips before she pulls it back into place. She doesn\'t get an explanation. San isn\'t ready to give one, not here, not to someone she just met wearing a face she half-recognizes from a story she buried years ago.',
    4: "Later, once there's finally a private moment, San tells Joel everything — carefully, like she's unpacking something she hasn't looked at in a long time.<br><br>Imperial Guard Meets Runaway Prince, she called it, back when she first started writing it. It became Tangled with the Runaway Prince eventually, after enough rewrites that the title barely resembled where it started. The story itself changed just as much along the way — characters reworked, plot threads abandoned and replaced, nothing about it staying still for long.<br><br>She put it aside, in the end, during a stretch of her marriage that was difficult enough that writing about anyone else's romance felt impossible. She never went back to it. She assumed, as much as she thought about it at all, that it simply stayed exactly where she left it — half-finished, going nowhere, hers alone.<br><br>The Jade she remembers from those pages is nothing like the woman who just introduced herself on that shore — early, incompletely sketched, more an idea than a person. Whoever's standing in front of her now has had a whole life San never got to write.",
    5: "Jade's party doesn't press for explanations San isn't offering. Instead, practically, they offer something more immediately useful: help. Lunareth is a big world, considerably bigger than the small arrival stretch San and Joel have actually seen, and navigating it without local knowledge would be slow going at best.<br><br>San listens, and starts getting a clearer picture of exactly how far Jade's own story has actually traveled — adventures, consequences, a whole life that kept moving long after the point where San's own manuscript simply stopped. None of it matches what San remembers writing. All of it clearly, unmistakably belongs to Jade now, not to whatever San once sketched out on a page.<br><br>The two groups agree to work together, at least for now — cautious cooperation, nothing promised beyond it.<br><br>San keeps the manuscript connection to herself. It isn't a secret meant to last forever. It's simply not a conversation she's ready to have yet, not until she understands a little better what it would even mean to have it.",
    6: 'Jade tells the story plainly, without much embellishment — Xima\'s curse, finally broken, and five genuinely peaceful years that followed after. San listens to the whole account with growing, quiet astonishment, watching just how much shape an entire life can take once nobody\'s writing it down chapter by chapter anymore.<br><br>"You really didn\'t write any of this?" Joel asks afterward, still working through it himself.<br><br>"I didn\'t even get this far," San admits. Whatever she once sketched out for Jade stopped well short of a curse, a victory, five whole years of an ordinary life built on the other side of it. Everything Jade just described happened entirely without her.',
    7: "Joel and Devon fall into an easy rapport almost immediately, the kind that doesn't need much explaining once you notice the shape of it — two men who've each spent years quietly watching over someone strong-willed enough not to need the watching, and loving them anyway for exactly who they are. They trade notes without either one treating it as a competition.<br><br>San and Jade, meanwhile, end up deep in their own exchange — adventures, close calls, the particular stories that only make sense to someone who's actually lived through something similar.<br><br>Jade comes away from it faintly surprised. Whatever she expected from a ship's captain, San turns out to be considerably less formal about the whole thing than that title suggested.",
    8: "Jade's party brings word of something minor stirring along the frontier — nothing that sounds like it needs Lunareth's own heaviest hitters, but not nothing either. They ask if San and Joel want in.<br><br>San says yes before Joel finishes the question in his own head, which he notices and doesn't comment on.<br><br>The two groups head out together, and the real value of the trip isn't really the disturbance itself — it's watching how everyone actually fights, up close, learning each other's instincts and timing in a way no amount of conversation back at the shore could have taught them. Devon reads an opening half a second before San does. Joel adjusts around Jade's own rhythm without needing to be told how.<br><br>It gets handled, cleanly, without turning into anything larger than it already was. Nobody needed a new villain for the trip to be worth taking.",
    9: "Later, somewhere quieter, the conversation turns serious without quite meaning to. Jade and Devon mention the Black Pearl, carefully, the way people discuss something they've mostly made peace with but haven't entirely stopped worrying about.<br><br>Xima's curse is broken. That much is settled, over, genuinely finished. The Pearl itself, though, is still there — still a question neither of them has a clean answer for, even now, years past the part of the story where it should have simply resolved.<br><br>San listens, and realizes fairly quickly that whatever this actually is, it sits well outside anything she ever wrote. This was never her story to finish.<br><br>\"Fair Tide has people who look into exactly this kind of thing,\" she offers. \"Researchers. If you'd want another set of eyes on it.\"",
    10: 'San lays out what Fair Tide actually has to offer — the Horizon Engine, the research team behind it, everything they\'ve learned crossing into worlds that were never theirs to begin with. She explains it plainly, without overselling any of it.<br><br>Jade\'s companions light up at the idea almost immediately, visibly intrigued by the notion of an entire other world sitting one crossing away. San offers to arrange a proper visit sometime soon — nothing permanent, nobody expected to leave Lunareth for good, just a door left open for whoever wants to walk through it.<br><br>"You\'re inviting everyone already?" Joel asks, watching her work the room.<br><br>"I\'m being hospitable," San says.<br><br>"Of course you are," Joel says, and doesn\'t bother arguing the point further.',
    11: 'True to her word, San arranges a short visit — just long enough for Jade\'s whole party to actually see Veyren for themselves, nothing more ambitious than that.<br><br>The Horizon passage itself catches all five of them off guard in different ways. Whatever they expected crossing between worlds to feel like, none of it quite matches the real thing, and Veyren itself turns out to be nothing like Lunareth once they\'re actually standing in it — different sky, different water, a whole different shape to how the world sits together.<br><br>Joel makes a point of reassuring them before anyone gets too deep into their own unease about it. The journey goes both ways. Nobody\'s stranded here.<br><br>"You do this regularly?" Jade asks, still visibly adjusting.<br><br>"We\'re getting better at it," San says, which is as honest an answer as she has.',
    12: "San and Joel bring their guests properly into Fair Tide, and the settlement does what it always does to first-time visitors — slowly, steadily, makes its case for itself without anyone having to oversell it. Jade's party meets the crew in pieces: Renn, already talking faster than anyone can quite follow; Erynn, measured and watchful; Mimi, reading each of them with open, genuine curiosity.<br><br>The researchers, for their part, are plainly fascinated. Five people with abilities and histories entirely outside anything Veyren's own records have ever catalogued is not a small thing to any of the three of them, and it shows.<br><br>San walks Jade through the settlement herself, a clear, quiet pride in it she doesn't bother hiding. This is what she built, out of considerably less than Jade apparently started with. Jade can tell.",
    13: "Renn, Erynn and Mimi don't waste the opportunity. With Jade's party actually present, they start in on preliminary work almost immediately — gathering what's known about the Black Pearl's history, its documented effects, anything that might actually help make sense of it.<br><br>Jade lays out what she and Devon understand, which turns out to be less than any of the researchers initially hoped and more than they expected given how little Lunareth itself seems to have resolved about it.<br><br>By the end of the session, the three of them are honest about where that leaves things: its actual nature is still genuinely uncertain. Whatever comes next is going to need information Fair Tide simply doesn't have access to yet — information that only exists back on Lunareth.",
    14: "Jade and her companions meet the rest of San and Joel's life — Vaeren, Joelle, and Soel keeping his usual careful watch over both of them. It's a different kind of surprise than the settlement itself, quieter, more personal: a captain and a former guard, with an entire family built alongside everything else they've taken on.<br><br>Jade watches the twins for a while, longer than the moment strictly calls for, something thoughtful settling over her expression. Devon notices. He doesn't say anything about it, not yet, just stays close.<br><br>San catches the look too, the same way she catches most things. She doesn't ask. Whatever's sitting between the two of them right now feels like theirs to work through first, not hers to pry into.",
    15: 'Before the visit winds down, San mentions — almost too casually to be entirely casual — that Fair Tide has a rather nice cooling spring, somewhere quiet, very refreshing this time of year.<br><br>Jade\'s curiosity is immediate and obvious.<br><br>Joel knows that particular innocent look on San\'s face far too well by now.<br><br>"San…" he says, a warning and a question at once.<br><br>"What?" San says, entirely too pleased with herself. "It\'s very refreshing."<br><br>The visitors agree readily enough to see it, whenever their next stay actually happens. San doesn\'t offer anything further on the subject, and doesn\'t look especially sorry about that either.',
    16: 'San and Joel return to Lunareth to pick up the thread of their own exploration, Jade and Devon meeting them again at the shore like it\'s already a habit forming. This time they aren\'t alone — two more faces trail along behind them, clearly eager and not even pretending otherwise.<br><br>"Sally," the woman says, friendly before anyone\'s even finished introductions. Beside her, a quieter man lifts a hand. "Levi."<br><br>Sally doesn\'t wait for an invitation to get comfortable. Within minutes she\'s settled into the conversation like she\'s known San and Joel for years rather than minutes, asking questions, laughing easily, already treating the whole thing like something worth enjoying rather than something to be cautious about.<br><br>"You two seem to get along already," Joel says, watching it happen.<br><br>"Some people are just easy to talk to," San says, which from Sally\'s side looks entirely mutual.',
    17: 'The group heads out on a short reconnaissance run, nothing urgent, just getting a better read on the surrounding terrain. Levi falls in beside Joel without needing to be told where to stand, and it isn\'t long before his accuracy and field awareness do the talking for him — reading the ground, calling distances, spotting things half a beat before anyone else does.<br><br>Joel\'s impressed enough to say so, and mentions Fair Tide\'s own scouts in the same breath — Senedra, Iris, KW Liang, each of them built out of exactly this kind of instinct. Levi\'s attention sharpens immediately at the idea of trading notes with people who actually do this for a living, same as him.<br><br>"Careful," Sally says, watching the whole thing unfold. "Give him a new bow and you\'ll never see him again."<br><br>"I heard that," Levi says, not looking up from the horizon.',
    18: 'Devon and Joel fall into their own conversation a little further off, the kind that starts practical and ends up somewhere more personal without either of them quite planning it that way. Knight and paladin, different worlds, same basic job — stand between the people you care about and whatever\'s coming for them.<br><br>The talk drifts from duty into something closer to the truth of it: how hard it actually is, day to day, loving someone determined enough to walk straight into danger rather than wait for someone else to handle it.<br><br>San and Jade catch the tail end of it from a short distance away.<br><br>"Are they talking about us?" Jade asks.<br><br>"Almost certainly," San says.<br><br>"We\'re standing right here," Joel says, not turning around.',
    19: 'Another lead on the Black Pearl surfaces, small but real, and the group takes it seriously enough to actually sit down with it together. Jade lays out everything she and Devon have pieced together so far — which, by now, is a fair amount, even if none of it adds up to a full picture yet.<br><br>San\'s honest about where Fair Tide actually stands on it: more questions than answers, still, and nothing solid enough yet to call a conclusion. Rather than either side trying to fill in the gaps with guesses, they agree on something simpler — keep investigating together, and don\'t assume anything about the Pearl\'s nature until the evidence actually says so.<br><br>"Ser Aldric might want to hear about this too," Devon offers. "If he\'s as thorough as Joel makes him sound, another set of eyes wouldn\'t hurt."<br><br>Nobody objects to the idea.',
    20: 'Jade, Devon, Sally and Levi make the crossing together this time, the first time all four of them have come through at once. Fair Tide does what it always does with new arrivals — absorbs them, piece by piece, without anyone really noticing it happening.<br><br>Joel brings Devon over to properly meet Ser Aldric, the two of them sizing each other up with the particular respect one competent guardian offers another. Levi, for his part, barely makes it through introductions before Senedra, Iris and KW Liang have already pulled him into comparing notes on terrain and range.<br><br>Sally needs no introduction to anyone by the end of the first hour. She\'s simply already friends with half the settlement, the other half clearly next on her list.<br><br>San watches all four of them settle in, scattered across Fair Tide like they\'ve always belonged somewhere in it.<br><br>"You\'ve made four more people feel at home," Joel says.<br><br>"They haven\'t moved in," San says.<br><br>"Yet," Joel says.',
    21: 'Levi doesn\'t take long to find his footing among Fair Tide\'s own scouts. Senedra sets up targets at steadily increasing distances; Iris turns the whole thing into something closer to a game, daring him to match her on terrain she already knows cold; KW Liang just watches quietly and adjusts his own shots to answer whatever Levi does. Four very different approaches to the same basic skill, and all four of them clearly enjoying picking the others apart.<br><br>Sally watches from a comfortable distance, arms crossed, not even trying to hide her amusement.<br><br>"He\'s going to want to stay here," she says.<br><br>"We do have room," San says.<br><br>"San," Joel says, in the tone of someone who can already see exactly where this conversation is headed.',
    22: 'Devon falls in with Joel and Ser Aldric for a proper training session, three very different fighting philosophies colliding in the same practice yard. Joel\'s steady, measured discipline; Ser Aldric\'s immovable, load-bearing patience; Devon\'s sharper, more instinctive edge, honed by a very different kind of danger. The exchange gets lively fast — not quite an argument, but close enough to one that it\'s clearly productive, all three of them circling the same real question: what duty actually costs the people who carry it, and what it means to protect someone who refuses to be protected quietly.<br><br>A short distance off, Jade and San end up in a conversation of their own, tracing just how far both their lives have travelled since whatever first adventures started them down this road. Jade finds herself, somewhere in the middle of it, no longer thinking of San as simply the strange visitor who recognized her name out of nowhere. Just someone who understands, in her own way, exactly what this kind of life actually asks of a person.',
    23: 'Jade\'s group heads back across the Horizon to Lunareth, the visit wrapped up easily, nothing left unresolved. Not long after, San and Joel run into Hugh and Sera on their own — the two of them, together, in a way that doesn\'t look like coincidence even if neither says so outright.<br><br>Both seem interested in Fair Tide. Neither offers much of a reason why, beyond a few careful, general words about wanting to see it for themselves.<br><br>San doesn\'t push for one. She simply offers what seems obviously wanted instead: a quiet stay, no expedition schedule attached, nothing expected of them beyond showing up.<br><br>"Just the two of you?" Joel asks, mostly for the sake of asking.<br><br>"If that isn\'t inconvenient," Hugh says.<br><br>"Not at all," San says, and leaves it there.',
    24: 'Hugh and Sera arrive without anyone else trailing behind them — no family, no familiar companions, nobody from home who might read more into this than either of them is ready to have read.<br><br>Away from Lunareth, away from every expectation that\'s quietly shaped their lives there, something in both of them starts to loosen almost immediately. They walk through Fair Tide at no particular pace, eat meals without watching who\'s watching them, talk about nothing in particular for the simple pleasure of talking without an audience.<br><br>"It\'s strange," Sera says, somewhere in the middle of an otherwise unremarkable afternoon. "Nobody here expects anything from us."<br><br>"Perhaps that\'s why I can finally breathe," Hugh says, and means it more plainly than he\'s let himself mean much of anything in a long time.',
    25: 'They end up walking well past the settlement itself one afternoon, far enough that the usual noise of Fair Tide fades into something distant and easy to ignore. The conversation drifts, the way conversations do when neither person is bracing for it to go anywhere in particular — until, almost without deciding to, it finally does.<br><br>Hugh admits it first, quietly: he\'d spent years convinced that saying anything would only make Sera\'s life harder, add one more complication to a life already full of them.<br><br>Sera tells him she\'d feared exactly the same thing, from her own side of it, for just as long.<br><br>Neither of them retreats from it this time. Not into a joke, not into changing the subject, not into pretending the conversation hadn\'t happened at all.<br><br>Sera reaches for his hand.<br><br>Hugh takes it.',
    26: 'Hugh and Sera let themselves have another easy day of it — no destination in particular, no plan beyond simply being in Fair Tide together a little longer. Without titles, family obligations, or a single person from Lunareth watching how either of them behaves, something in both of them keeps loosening further than it did even the day before.<br><br>"I don\'t think I\'ve ever felt quite this free," Sera admits, somewhere in the unremarkable middle of an afternoon that doesn\'t particularly need marking as special, and is anyway.<br><br>"You don\'t have to be Lady Sera here," Hugh says.<br><br>"And you don\'t have to pretend you aren\'t happy to see me," Sera says back, not unkindly.<br><br>Hugh laughs — properly, unguardedly — and takes her hand like it\'s the easiest thing in the world, because for once, here, it actually is.',
    27: 'San mentions the spring again, the same suspiciously casual way she brought it up before Hugh and Sera ever arrived. "It\'s a lovely place to relax," she tells them. "Very refreshing."<br><br>Joel glances at her sideways. "You do enjoy recommending that place."<br><br>"It\'s a nice spring," San says, entirely unbothered, and leaves it at that.<br><br>Hugh and Sera take her up on it gladly — somewhere quiet, away from the rest of the settlement, water calm enough to make the whole afternoon feel like it\'s happening at half speed. For once, there\'s nobody else around at all, not even the easy, friendly crowd of Fair Tide itself.<br><br>Neither of them has any idea what the spring actually is, or what it can do for the people who truly belong to this place. To them, today, it\'s simply water, and quiet, and each other. Nothing more complicated than that.',
    28: 'As the light starts to fade, neither of them makes much effort to head back. The conversation drifts somewhere neither has let it go before — all those years spent carefully not saying the one thing that actually mattered, each of them convinced that saying it out loud would only cost the other something.<br><br>Hugh kisses her first. It isn\'t a question so much as the end of one, finally answered after far too long left open.<br><br>Sera doesn\'t hesitate. Not for a second.<br><br>What happens after that is theirs alone — no audience, no account of it beyond the two of them choosing, for once, to simply stay together through the night, away from every expectation waiting for them back on Lunareth.',
    29: 'Hugh wakes slowly, and for a moment doesn\'t quite trust how peaceful everything feels. Sera\'s already awake beside him, watching the light change outside without any particular hurry to move.<br><br>Neither regrets the night before. That part, at least, is simple. What comes after it is less so — the quiet, growing awareness that going home means going back to being careful again, in ways neither of them has had to be careful here.<br><br>"We can\'t stay here forever," Sera says eventually.<br><br>"I know," Hugh says.<br><br>"But perhaps," she says, "we don\'t have to go back to pretending."<br><br>They don\'t solve it all in that one conversation. They don\'t need to. They settle on something simpler instead — facing whatever comes next together, one step at a time, rather than each of them carrying it alone the way they always have before.',
    30: 'By the time Hugh and Sera are ready to leave, there\'s a difference about them that doesn\'t take much noticing. San sees it plainly enough and says nothing at all, which is its own kind of courtesy.<br><br>"They seem happier," Joel says, watching them say their goodbyes.<br><br>"Fair Tide has that effect on people," San says, which isn\'t exactly the whole explanation, and isn\'t meant to be.<br><br>Before they go, Sera takes a moment to thank San properly — not for anything specific, just for the simple, rare gift of somewhere they could be exactly themselves without anyone keeping score.<br><br>Whatever\'s actually changed between Hugh and Sera stays unspoken beyond that, same as it\'s always been back home. But for the first time, neither of them is uncertain about the other. That, at least, they\'re carrying back across the Horizon with them.',
    31: 'San and Joel make the crossing back to Lunareth again, and this time Jade brings someone new to the introductions — an older brother with a sharper, more measuring look than his sister\'s, and a partner beside him who watches everything with the same quiet attentiveness.<br><br>"Adrian," he says, offering a hand that still feels like it\'s sizing San up even after shaking it. "And Eve." Eve offers something closer to an actual smile.<br><br>Adrian doesn\'t take long to say what he\'s clearly been thinking. "Jade doesn\'t usually trust strangers this quickly."<br><br>"They\'re hardly strangers anymore," Jade says, unbothered.<br><br>"I think that\'s a compliment," San says.<br><br>"Mostly," Joel adds, which gets the first real laugh out of Adrian all afternoon.',
    32: 'Adrian and Eve make the crossing to Fair Tide not long after, and Renn wastes no time pulling them straight into the workshops — Erynn close behind, already halfway through an explanation nobody quite asked for yet.<br><br>Adrian, it turns out, has a genuine head for exactly this kind of thing. The Horizon Engine catches his attention almost immediately, and he starts asking the kind of precise, structural questions that make Renn visibly delighted to have someone new to answer them for. Eve, quieter about it, offers her own observations here and there — sharp ones, the kind that make Erynn pause and actually think before answering.<br><br>"Be careful," San warns them, half-amused. "Once the researchers start talking, they don\'t stop."<br><br>"You fit right in, then," Joel tells Adrian, watching him lean further into the conversation rather than away from it.',
    33: 'Back on Lunareth, Jade brings two more people into the fold — Sky, her own cousin, and Jenika, Devon\'s. San picks up quickly that the two of them come as something of a package: a young son between them, though neither wears a ring, a detail nobody in the group treats as anything worth remarking on.<br><br>The conversation drifts naturally toward healing — Lunareth\'s own practices against whatever San and Joel can describe of Veyren\'s, each side visibly curious about how differently the other\'s world handles the same basic problem of keeping people alive and well.<br><br>Sky\'s interest sharpens the longer it goes on. By the end of it, he\'s asking, plainly, whether Fair Tide\'s own medical people might be willing to meet him.',
    34: 'Sky and Jenika take San up on the offer, and Fair Tide\'s medical team turns out in force to meet them — Dr. AA, methodical and unhurried; Maera, watching with the particular interest of someone who recognizes a kindred curiosity; Senedra, there mostly out of her own interest in anything new; Sister Wren, warm and immediately welcoming; Jovie, already reorganizing a shelf just to have something to show them; Eliz, quiet but attentive.<br><br>They spend the better part of the visit comparing notes — methods, practices, the particular ways each world has learned to care for its people. Jovie walks them through how the infirmary\'s actually organized, proud of a system she helped build herself. Dr. AA, for his part, spends most of his time stressing the same point, patiently, more than once: understand what you\'re actually treating before you ever try to treat it.<br><br>"You have quite a team here," Jenika says, clearly impressed.<br><br>"And somehow they\'re still putting up with all of us," San says.',
    35: 'Sky and Jenika stay on a while longer, deep in conversation with Fair Tide\'s medical team about exactly where their two worlds\' practices might actually be able to learn from each other. Not far off, Adrian\'s own observations from his workshop visit have apparently stuck with Renn and Erynn, giving them a fresh angle on their own research they clearly hadn\'t considered before.<br><br>Watching all of it come together, San proposes something simple: keep the door open between both worlds, rather than asking anyone to actually pack up and move. Nobody needs to relocate for any of this to keep working.<br><br>"So we\'re establishing another partnership?" Joel asks.<br><br>"That\'s what happens when people get along," San says.<br><br>"You make it sound very simple," Joel says.<br><br>"It usually is," San says. "Until the paperwork."'
  };
  window.ARC42_CHAPTER_SCENES = ARC42_CHAPTER_SCENES;

  window.arc42ObjectiveState = function(){
    if (!game.arc41BridgeComplete) return null;
    if (level() < 630) return null;
    game.comicProgress42 = game.comicProgress42 || {};
    for (const ch of ARC42_CHAPTERS) {
      if (!game.comicProgress42[ch.id]) return 'complete_arc42_chapter_' + ch.id;
    }
    return 'arc42_part1_complete_for_now';
  };

  window.markArc42ChapterRead = function(id){
    const so = window.arc42ObjectiveState();
    if (so !== ('complete_arc42_chapter_' + id)) return;
    game.comicProgress42 = game.comicProgress42 || {};
    game.comicProgress42[id] = true;
    const ch = ARC42_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC42_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC42_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc42Splash = function(){
    const overlay = document.getElementById('arc42SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc42Splash = function(){
    const overlay = document.getElementById('arc42SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc42SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc42 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc42) oldRenderStoryForArc42();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc42Ready = window.arc42ObjectiveState() !== null;
    if (arc42Ready && !game.arc42SplashSeen && typeof window.__ctShowArc42Splash === 'function') {
      window.__ctShowArc42Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc42/arc42-cover-meet-the-maker.webp" alt="Arc XLII — Meet the Maker" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XLII</div><div class="story-act-title">Meet the Maker</div>'+
      '<div class="story-act-tagline">Some stories continue long after their writers stop writing.</div></div>';
    if (!arc42Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XLII Locked</div><div class="story-chapter-sub">'+
        (!game.arc41BridgeComplete ? 'Cross the Horizon to Lunareth first.' : 'Reach Level 630 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc42ObjectiveState();
    ARC42_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress42 && game.comicProgress42[ch.id]);
      const ready = !done && so===('complete_arc42_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        // Ch.8 ("A Little Adventure") is a fight, not a straight mark-as-
        // read, same pattern as Arc IX's own Ch.12 guardian fight and Arc
        // XXXVIII's Archive Guardians -- startArc42FrontierBattle (see
        // arc42-mechanics.js) completes the chapter itself on victory.
        action = (ch.id === 8)
          ? '<button class="btn btn-small btn-success" onclick="startArc42FrontierBattle()">'+esc(ch.action || '⚔️ Investigate')+'</button>'
          : '<button class="btn btn-small btn-success" onclick="markArc42ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc42_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XLII chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
