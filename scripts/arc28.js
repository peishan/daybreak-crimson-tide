(function(){
  // -------------------------------------------------------------------
  // ARC XXVIII — N. Gated at arc27Complete + level 420, continuing the
  // established +15-per-arc ladder (XXV:375, XXVI:390, XXVII:405,
  // XXVIII:420). Ch.24 sets game.arc28Complete = true, matching every
  // other arc's own finale flag.
  //
  // Per San's own outline: this arc locks in every correction already
  // established for N's return — fragmented memories (not instant
  // recall), San's own pre-existing broken trust (not a fresh grudge
  // invented for this arc), Joel's quieter caution (never controlling,
  // never overruling San), N's Veyren transformation as actual
  // characterization (not just a redesign), her borrowing habit
  // surviving the memory loss before the memories explaining it return,
  // Zaki's own personal history with financial abuse informing Fair
  // Tide's approach, fair (not punitive, not indulgent) treatment when
  // she leaves, and the beginning of her connection with Sairen.
  //
  // Thesis, stated plainly in Ch.16 and never softened afterward:
  // forgiveness does not automatically restore trust. San can care about
  // N, offer her safety, and still refuse to pretend the past didn't
  // happen — Ch.12's "You're still here" and Ch.16's "I can forgive you.
  // That doesn't mean I can make myself trust you" are the same
  // position, stated twice, deliberately not resolved into reconciliation
  // by arc's end.
  //
  // Ch.18 is written exactly to San's own spec: Aisyah's final account
  // pays N every wage she actually earned, deducts only what she
  // genuinely took without earning or paying for it, invents no
  // penalties, and critically does NOT deduct N's old personal Brunei
  // debt — that debt is between San and N personally, never Fair Tide's
  // ledger to collect on. Zaki's own closing "She got everything else? /
  // Every bit she earned. / Good." is the chapter's actual payoff, not
  // decoration.
  //
  // Ch.20-24 introduce Sairen as a person first, per San's own note —
  // charming, genuinely attentive, someone N is drawn to for real
  // reasons — with his intelligence angle only ever showing at the very
  // edges (Ch.22's "partly professional," Ch.24's closing image of
  // something among his belongings). Nothing here confirms what he
  // actually is; that's Arc XXIX's own job.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. Per San's own message, the gameplay mechanics
  // this arc calls for are being specified separately and will land in
  // scripts/arc28-mechanics.js once that spec arrives — this file does
  // not invent any of that ahead of time.
  //
  // XP escalates toward Ch.16 ("I Said I Was Sorry," explicitly the
  // arc's own thesis chapter per San's outline) at 400, with Ch.24's
  // finale bump (380) kept below it — the same "one centerpiece, not
  // two" convention used since Arc XX.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC28_CHAPTERS = [
    {id:1, title:'A Familiar Stranger', focus:"A strikingly transformed woman arrives at Fair Tide — Veyren has given her the flawless, glamorous look of someone who could pass for a model. San recognizes her instantly. N recognizes something about San too — fragments of Brunei, familiarity, being helped — but not the whole friendship, not yet.", image:'assets/comics/arc28/ch01-a-familiar-stranger.png', xp:260, action:'👋 Meet a Familiar Stranger'},
    {id:2, title:'Pieces of San', focus:"Spending time with San brings N scattered memories — a workplace, food, laughter, arguments, money. She remembers San mattered to her, without being able to reconstruct what actually happened between them. San remembers enough for both of them to be cautious.", image:'assets/comics/arc28/ch02-pieces-of-san.png', xp:270, action:'🧩 Piece Together the Memories'},
    {id:3, title:'You Sure?', focus:'San tells Joel she\'s considering letting N stay at Fair Tide. Joel isn\'t controlling about it — he just remembers what happened. "You sure?" "She needs somewhere to stay." "I remember what happened." "So do I." San reminds him she isn\'t facing this alone in Brunei anymore.', image:'assets/comics/arc28/ch03-you-sure.png', xp:270, action:"🤔 Ask 'You Sure?'"},
    {id:4, title:'Guest of Fair Tide', focus:"N is welcomed as a guest, without humiliation and without San announcing their whole history to the settlement. But being San's old friend doesn't grant automatic access to restricted Horizon information, Fair Tide Intelligence, the stores, or any leadership privilege.", image:'assets/comics/arc28/ch04-guest-of-fair-tide.png', xp:270, action:'🏠 Welcome Her as a Guest'},
    {id:5, title:'Of All the Things You Remember', focus:'N asks San to borrow money. San: "Of everything you could remember about me... borrowing money is what came back?" N, after actually thinking about it: "I remembered you would lend it." "That\'s worse." San doesn\'t lend it — she offers to help N find work instead.', image:'assets/comics/arc28/ch05-of-all-the-things-you-remember.png', xp:280, action:'💸 Hear What She Remembers'},
    {id:6, title:'Everybody Starts Somewhere', focus:"N tries working at Fair Tide. Nobody expects instant expertise — she gets straightforward tasks and real help learning them. What she discovers is less comfortable: Fair Tide expects people capable of contributing to actually contribute, and being San's friend doesn't exempt her from that.", image:'assets/comics/arc28/ch06-everybody-starts-somewhere.png', xp:280, action:'🔨 Give Her Somewhere to Start'},
    {id:7, title:'Veyren Has Been Kind', focus:"N becomes increasingly aware of her transformed appearance, and of how much people — men especially — notice her. She realizes she enjoys it: a smile gets attention, a little flirting gets assistance, and charm sometimes moves faster than work ever could.", image:'assets/comics/arc28/ch07-veyren-has-been-kind.png', xp:280, action:'💄 Notice What Veyren Gave Her'},
    {id:8, title:'He Offered', focus:'San finds a man enthusiastically doing the task N was actually assigned. "N." "What?" "That\'s your job." "He offered." The man confirms this very eagerly. San looks at him, then at N. "Of course he did." N grins.', image:'assets/comics/arc28/ch08-he-offered.png', xp:280, action:"🙄 Catch 'He Offered'"},
    {id:9, title:'Old Habits', focus:"The pattern stops being quite so funny. N starts assuming someone else will cover a meal beyond the ordinary communal provisions, a market item, something from Fair Tide's stores. Nothing enormous on its own — but the small assumptions keep accumulating.", image:'assets/comics/arc28/ch09-old-habits.png', xp:290, action:'📉 Notice the Old Habits'},
    {id:10, title:'Zaki Notices', focus:'Zaki asks San quietly, "Did she pay for that?" San understands immediately why he\'s sensitive to it — his father took his mother\'s money, growing up. She reassures him: Fair Tide keeps proper records, and N will be treated exactly like everyone else. No confrontation needed.', image:'assets/comics/arc28/ch10-zaki-notices.png', xp:290, action:"❓ Hear Zaki's Question"},
    {id:11, title:'Something Happened in Brunei', focus:'Another fragment surfaces for N — San lending her money, then another loan, then an argument, then the feeling that San had stopped believing something she\'d said. "Did I do something to you?" San doesn\'t unload years of history. "You broke my trust." N doesn\'t remember how. Yet.', image:'assets/comics/arc28/ch11-something-happened-in-brunei.png', xp:300, action:'🌧️ Remember Brunei'},
    {id:12, title:"You Don't Trust Me", focus:'N confronts San directly. "You don\'t trust me." San could soften it. She doesn\'t. "No. Not the way I used to." But she adds, just as plainly: "You\'re still here." San can care about N and offer her safety without pretending the past never happened.', image:'assets/comics/arc28/ch12-you-dont-trust-me.png', xp:310, action:"💔 Say \"You Don't Trust Me\""},
    {id:13, title:"Joel Wasn't Wrong", focus:'N recalls more of the old disagreement — that Joel believed her dependence on San had become an abuse of San\'s trust. She assumes Joel is the reason San changed. San immediately rejects that: "Joel had his opinion. I made my own decision." Joel doesn\'t need to defend himself.', image:'assets/comics/arc28/ch13-joel-wasnt-wrong.png', xp:300, action:"🗣️ Admit Joel Wasn't Wrong"},
    {id:14, title:'What I Remember', focus:"More fragments return — real friendship, not just borrowing. Laughing together. Talking. Shared experience. Times San genuinely wanted to help her. That makes the damage more painful, not less: they weren't always bad for each other.", image:'assets/comics/arc28/ch14-what-i-remember.png', xp:300, action:'💭 Remember the Good Parts Too'},
    {id:15, title:'The Part That Hurt', focus:"The critical Brunei memories finally connect. N understands, now, that San's distrust isn't a punishment invented in Veyren — something she genuinely did betrayed the trust San placed in her. She may still see parts of it differently. She can no longer claim nothing happened.", image:'assets/comics/arc28/ch15-the-part-that-hurt.png', xp:310, action:'😣 Feel the Part That Hurt'},
    {id:16, title:'I Said I Was Sorry', focus:'N struggles with the idea that an apology, or simply time passing, hasn\'t restored what they had. San: "I can forgive you. That doesn\'t mean I can make myself trust you." Trust has to be rebuilt by what happens next — not declared back into existence.', image:'assets/comics/arc28/ch16-i-said-i-was-sorry.png', xp:400, action:'🕊️ Explain Forgiveness Isn\'t Trust'},
    {id:17, title:"This Isn't Brunei", focus:'N spends or takes beyond what she\'s earned again, expecting San to smooth it over. San refuses outright. "I\'ll pay you back." "No." "San—" "Here, you work for it. This isn\'t Brunei. This isn\'t 2026." It triggers another memory fragment for N — an uncomfortable one this time.', image:'assets/comics/arc28/ch17-this-isnt-brunei.png', xp:310, action:"🚫 Say \"This Isn't Brunei\""},
    {id:18, title:'Exactly What You Earned', focus:"N decides to leave. Aisyah prepares her final account — every wage she actually earned, minus only what she genuinely took without earning or paying for it. No invented penalties. San doesn't deduct N's old Brunei debt either: \"That debt is between her and me. She didn't borrow it from Fair Tide.\" Zaki watches Fair Tide handle it fairly, and says so.", image:'assets/comics/arc28/ch18-exactly-what-you-earned.png', xp:320, action:'📋 Pay Out Exactly What She Earned'},
    {id:19, title:'Beautiful and Free', focus:"N leaves, and at first it feels wonderful — nobody assigning her work, nobody tracking what she takes. She dresses beautifully, goes out, and discovers exactly how easily her Veyren appearance opens doors. For maybe the first time since arriving, she feels powerful.", image:'assets/comics/arc28/ch19-beautiful-and-free.png', xp:290, action:'💃 Feel Beautiful and Free'},
    {id:20, title:'The Man Who Notices', focus:"N meets Sairen. She notices him; he notices her. She flirts, the way she's learned she can — and he responds, but he isn't quite as easily readable as the others have been. That's exactly what makes him interesting.", image:'assets/comics/arc28/ch20-the-man-who-notices.png', xp:290, action:'👁️ Meet the Man Who Notices'},
    {id:21, title:'Just Tonight', focus:"N and Sairen drink, talk, and end up spending the night together — consensual, expected by N to be relatively casual. Not miraculous instant love. Attraction, curiosity, and two people carrying considerably more hurt than either admits to.", image:'assets/comics/arc28/ch21-just-tonight.png', xp:290, action:'🌙 Spend Just Tonight'},
    {id:22, title:'Still Here', focus:"Morning comes, and Sairen hasn't disappeared. They talk again. N tells him pieces of her story — probably a version where San comes across harsher than she actually was. Sairen listens rather than correcting her, which feels good to N after months of being challenged. For Sairen, listening is partly natural, and partly professional.", image:'assets/comics/arc28/ch22-still-here.png', xp:290, action:'☀️ Find Him Still Here'},
    {id:23, title:'Come With Me', focus:"Sairen offers N somewhere to stay. She doesn't think I need someone to support me — she thinks why not. She's enjoying herself, she likes him, and it's easier than going back to Fair Tide. One night becomes several. Several become something resembling a shared life.", image:'assets/comics/arc28/ch23-come-with-me.png', xp:300, action:'🚪 Go With Him'},
    {id:24, title:'Patterns', focus:'San learns N left with a man. Joel: "Worried?" San: "A little." "Going after her?" San considers it. "No." N is an adult; San offered help, work, a safe place; N made another choice. Elsewhere, Sairen brings N something she needs without being asked — neither of them recognizes the pattern yet. And somewhere among his belongings sits the first quiet sign that he isn\'t simply the charming man N thinks she met by chance.', image:'assets/comics/arc28/ch24-patterns.png', xp:380, action:'🔁 Notice the Patterns'}
  ];
  window.ARC28_CHAPTERS = ARC28_CHAPTERS;

  const ARC28_CHAPTER_SCENES = {
    1: "The woman who walks up from the docks turns enough heads that San notices the reaction before she notices the woman — and then she actually looks, and the reaction stops mattering at all.<br><br>\"N?\"<br><br>Veyren has done something to her that San doesn't have a tidy word for. Flawless in a way that looks less like luck and more like the world simply decided to be generous to her, once, completely.<br><br>N studies San back, visibly searching for something just out of reach. \"You're... familiar,\" she says slowly. \"I know you helped me. I know we talked. I know—\" she stops, frustrated at her own gap. \"I don't have all of it. I have pieces.\"<br><br>San doesn't fill in the rest for her. Not yet. \"That's alright,\" she says, and means the words more carefully than N could possibly know yet. \"We'll figure out what's actually left.\"",
    2: "Over the following days, being near San starts loosening things in N's memory the way warm water loosens a knot — not all at once, and not in any order that makes sense yet.<br><br>A cramped kitchen somewhere, the two of them laughing at something neither of them could explain afterward. An argument, sharp enough that N still flinches slightly recalling the shape of it, without any of the actual words. Money changing hands, more than once. The unmistakable feeling that this woman, whoever she'd been to her, had mattered.<br><br>\"I know you were important,\" N tells her, almost apologetic about how little that actually amounts to. \"I just can't tell you why, exactly. Not the whole why.\"<br><br>San hears that, and doesn't correct it, and files away exactly how careful she's going to have to be — because SHE remembers the whole why. That's precisely the problem.",
    3: '"You sure?" Joel asks, once San actually tells him what she\'s considering.<br><br>He doesn\'t raise his voice. He doesn\'t forbid anything. He just asks the question plainly, the way he asks every question that actually matters to him.<br><br>"She needs somewhere to stay," San says.<br><br>"I remember what happened."<br><br>"So do I," San says, just as evenly.<br><br>She doesn\'t pretend the concern is unfounded. She just reminds him — and herself — of what\'s actually different now. She has him. She has her sisters, Zaki, Senedra, Joy, an entire crew and a whole settlement standing around her, not just the two of them alone in a cramped Brunei apartment with nobody else watching.<br><br>Joel doesn\'t argue further. He trusts the decision, even carrying the memory he\'s carrying.',
    4: "N settles into Fair Tide as a guest, and San handles the introduction with more restraint than N probably expects — no dramatic announcement, no explaining their whole complicated history to anyone who didn't already need to know it.<br><br>What N discovers instead, gradually, is a set of doors that stay closed to her despite the apparent warmth of her welcome. No access to the Horizon route data. No seat anywhere near Fair Tide Intelligence. No casual pull on the stores, no leadership deference just because she's the Captain's old friend.<br><br>\"You're being nice to me,\" N says, working through the contradiction out loud. \"But you're also... not, somehow. I don't understand the shape of it.\"<br><br>San doesn't explain the shape either. Not yet. \"Give it time,\" is all she offers.",
    5: '"Can I borrow some money?"<br><br>San stares at her for a long moment, genuinely unsure whether to laugh or not.<br><br>"Of everything you could remember about me," she says finally, "borrowing money is what came back?"<br><br>N actually thinks about that, visibly turning it over. "I remembered you would lend it."<br><br>"That\'s worse."<br><br>Beside her, Joel is very obviously trying not to laugh, and very obviously failing at it a little.<br><br>San doesn\'t lend her anything. "I can help you find work," she says instead, and watches something complicated cross N\'s face — not quite disappointment, not quite surprise, something in between that neither of them has a name for yet.',
    6: "The work Fair Tide gives N isn't demanding — nobody expects a woman with fragmented memories and no local experience to be immediately good at anything. She gets simple tasks, patient instruction, and room to actually learn.<br><br>What she doesn't get is an exemption.<br><br>\"I thought San would've said something,\" N admits to Aisyah, halfway through a task she's clearly finding more tedious than difficult. \"To make it easier.\"<br><br>\"She did say something,\" Aisyah says, not unkindly. \"She said treat you like everyone else. That's the easier version, actually — you'd be surprised how much harder people work when nobody's making exceptions for them.\"<br><br>N doesn't have a ready response for that. She just goes back to the task, slower than she'd like, but genuinely trying.",
    7: "It takes N longer than she expects to fully register what Veyren actually did to her — not just the mirror, but the way rooms seem to shift slightly when she walks into them.<br><br>Men notice. Not subtly, most of the time. And N, somewhere in the noticing, discovers she doesn't mind it at all.<br><br>A smile gets her a lighter load carried. A little flirting gets a task finished twice as fast by someone else entirely. It's not cruelty, exactly — it doesn't feel like using anyone, not from where she's standing. It just feels like a door that opens considerably easier than the doors marked WORK ever do.<br><br>She starts, without quite deciding to, reaching for the easier door more often.",
    8: '"N."<br><br>"What?"<br><br>"That\'s your job," San says, watching a visibly delighted young dockhand hauling exactly the crates N was assigned to haul herself an hour ago.<br><br>"He offered," N says, entirely unbothered.<br><br>The dockhand, asked directly, confirms this with an eagerness that borders on embarrassing for everyone involved except him.<br><br>San looks at him. Then at N.<br><br>"Of course he did," she says, mostly to herself.<br><br>N grins, not remotely sorry about any of it. It\'s the kind of small, victimless mischief that\'s almost charming, taken entirely on its own — and San notices herself noticing that "almost."',
    9: "It stops being quite as funny somewhere around the third or fourth time.<br><br>A meal that goes beyond what the communal stores are meant to cover, taken without much thought. A small item from the Market Quarter, assumed rather than paid for. Something pulled from Fair Tide's own stores that nobody remembers N actually asking about.<br><br>None of it, on its own, amounts to very much. Aisyah's the one who first notices the shape of the pattern rather than any single instance of it — small assumptions, quietly accumulating, the way water finds its way under a door nobody thought to seal.<br><br>She doesn't confront N about it yet. She just starts keeping a proper record, the same as she would for anyone else.",
    10: '"Did she pay for that?"<br><br>Zaki asks it quietly, almost too quietly, watching N walk off with something from the Supply House that nobody quite remembers her settling up for.<br><br>San understands immediately why the question lands the way it does, coming from him specifically. She knows enough of his own history — a father who took what wasn\'t his to take from a mother who never had the standing to refuse him — to know this isn\'t idle curiosity.<br><br>"Fair Tide keeps real records," she tells him. "Everything gets tracked, properly, same as it would for you or me. She\'s not going to get away with anything just because of who she used to be to me."<br><br>Zaki doesn\'t need more than that. No confrontation, no scene — just the quiet reassurance that the systems around him are actually paying attention.',
    11: '"Did I do something to you?"<br><br>The question comes out of N almost sideways, following a fragment that arrived without warning — San, lending her money. Then again. Then an argument, sharp-edged and half-formed in N\'s memory, and underneath all of it, the unmistakable feeling of San no longer quite believing something N had told her.<br><br>San doesn\'t hand her the whole ledger. Not yet, and maybe not ever, all at once.<br><br>"You broke my trust," she says instead, plain and unembellished.<br><br>N searches her own memory for the shape of that and comes up empty. "I don\'t remember how."<br><br>"I know," San says. "Not yet."<br><br>She doesn\'t say it unkindly. She also doesn\'t soften it.',
    12: '"You don\'t trust me," N says, finally, done circling the thing she\'s clearly felt building for a while.<br><br>San could give her something gentler. She has the option, right there, to round the edges off the truth for both their sakes.<br><br>She doesn\'t take it.<br><br>"No," she says. "Not the way I used to."<br><br>N flinches, more than she probably means to let show.<br><br>"But you\'re still here," San adds, before the silence gets to sit there too long. "I\'m not pretending the past didn\'t happen. I\'m also not pretending I don\'t still care what happens to you. Both of those are true at once. You\'re going to have to get used to that, if you\'re staying."<br><br>It isn\'t comfort, exactly. It\'s something more honest than comfort, and N isn\'t sure yet which one she needed more.',
    13: '"It was Joel, wasn\'t it," N says later, working through another recovered fragment — Joel\'s old, plainly stated opinion that N\'s dependence on San had curdled into something closer to using her than needing her. "He\'s why you changed toward me."<br><br>San doesn\'t let that stand for even a moment.<br><br>"Joel had his opinion," she says. "I made my own decision. Don\'t put my choices on him just because they\'re inconvenient to sit with."<br><br>Joel, close enough to hear all of it, doesn\'t say anything in his own defense. He doesn\'t need to. San already said everything that needed saying, and meant every word of it.',
    14: "Not every fragment that surfaces is a hard one.<br><br>N remembers laughing with San until neither of them could breathe properly. Long conversations about nothing in particular that somehow mattered anyway. Actual, uncomplicated warmth — San wanting to help her, not out of obligation, but because she'd wanted to.<br><br>It should make things easier. Instead it makes the damage hurt more, not less.<br><br>\"We weren't always bad for each other,\" N says quietly, working through the contradiction of it. \"I keep almost forgetting that part, and then I remember, and it just makes the rest worse somehow.\"<br><br>San doesn't disagree. \"No,\" she says. \"We weren't. That's what makes this hard instead of simple.\"",
    15: "The memory that finally connects everything arrives without much warning, and without much mercy either.<br><br>N doesn't get the whole of it back — not every conversation, not every exact word — but she gets enough. Enough to understand, finally, that San's distrust isn't a grudge invented somewhere in Veyren out of nothing. Something real happened. Something N actually did broke something San had genuinely given her.<br><br>She might still see pieces of it differently than San does. Some of that gap may never fully close.<br><br>But she can't tell herself anymore that nothing happened at all. That version of the story is gone, and she knows it's gone, and she has to sit with what's left in its place.",
    16: '"I said I was sorry," N says, more frustrated than accusing, when San\'s guard still hasn\'t lowered even after the apology, even after everything N now actually remembers and regrets.<br><br>"I know you did," San says.<br><br>"So why isn\'t that enough?"<br><br>San takes her time with the answer, because it matters that she gets it right. "I can forgive you," she says. "I already have, mostly. That doesn\'t mean I can just make myself trust you again, on command, because the apology happened. Trust isn\'t a switch. It\'s built out of what happens next — one thing at a time, over actual time. Not out of what already happened, no matter how sorry you are for it now."<br><br>N doesn\'t have anything to say back to that. For once, she just sits with it instead of trying to argue her way out.',
    17: '"I\'ll pay you back," N says, already halfway into the old pattern before she even notices she\'s in it — money spent, or taken, beyond anything she\'s actually earned yet.<br><br>"No," San says.<br><br>"San—"<br><br>"Here, you work for it," San says, cutting it off cleanly. "This isn\'t Brunei. This isn\'t 2026."<br><br>Something about the specific way San says it jars something loose in N\'s memory — not comfortable, this time. A version of this exact exchange, or close enough to it, from a life she barely has full access to anymore. She doesn\'t say anything for a long moment, turning the discomfort of it over in silence.',
    18: 'When N decides to leave, Aisyah handles the final account exactly the way she\'d handle anyone\'s — every wage N actually earned, paid out in full, with deductions only for what she genuinely took without earning or paying for it along the way. No invented penalties. No punishment dressed up as bookkeeping.<br><br>And, deliberately, no deduction at all for the old debt from Brunei.<br><br>"That debt is between her and me," San says, when someone asks about it. "She didn\'t borrow it from Fair Tide. Fair Tide isn\'t owed it, so Fair Tide isn\'t the one who collects it."<br><br>Zaki watches the whole account get settled without a single unfair mark against her.<br><br>"She got everything else?" he asks San afterward.<br><br>"Every bit she earned."<br><br>"Good," Zaki says, and means it more than the short word suggests.',
    19: "Leaving feels, for the first little while, like something close to flying.<br><br>Nobody assigns N a task in the morning. Nobody keeps a ledger of what she takes or doesn't. She dresses the way Veyren's given her every reason to dress, goes where she wants, and discovers — properly discovers, without Fair Tide's steady expectations sitting over her shoulder — exactly how far a face like hers can open doors on its own.<br><br>For what might be the first time since she woke up transformed and half-remembered on this world, N feels genuinely, uncomplicatedly powerful. She doesn't examine the feeling too closely. She just lets herself have it.",
    20: "The man at the far end of the room notices her first, or maybe she notices him noticing — it's hard to say afterward which happened first, and N doesn't much care to work it out.<br><br>She's used to the effect she has by now. Practiced at it, even. So she flirts, the way she's learned she can, expecting the same easy read she gets from almost everyone.<br><br>He doesn't give her that. Sairen is warm, definitely interested, definitely responsive — and also, somehow, not remotely as transparent as everyone else she's tried this on.<br><br>That, more than anything about his face or his charm, is what actually catches her attention.",
    21: "They drink. They talk, longer and more easily than either of them probably expects going in. By the time the night actually resolves into something, neither of them is under any illusion about what it is.<br><br>N doesn't walk away from it expecting a love story. Neither does he, as far as she can tell.<br><br>What's actually there is simpler and considerably messier at once — real attraction, real curiosity, and underneath both of those, more unspoken hurt than either of them puts a name to out loud. It's enough, for one night, to be exactly what it is without needing to be anything larger.",
    22: "Morning arrives, and — unlike most of the pattern N has come to half-expect from men — Sairen is still there.<br><br>They talk again, easier this time, less performance to it. N tells him her own version of the last several months, San included, and it comes out harsher toward San than the truth probably deserves. She isn't lying, exactly. She's just telling it from the middle of her own hurt, the way anyone does.<br><br>Sairen doesn't correct any of it. He just listens, fully, in a way that feels remarkably good after months of Fair Tide's steady, unflinching honesty.<br><br>For him, the listening is real. It's also, underneath that, exactly the kind of listening his actual work has trained him to do without ever quite switching it off.",
    23: '"Come with me," Sairen says, offering somewhere to actually stay rather than wherever N\'s been managing on her own.<br><br>N doesn\'t think I need someone to take care of me. That thought doesn\'t even cross her mind as the reason.<br><br>She thinks: why not. She\'s enjoying herself. She likes him. Going back to Fair Tide, after everything, sounds considerably harder than saying yes to this instead.<br><br>So she goes.<br><br>One night stretches into several without either of them marking the exact moment it happened. Several become something that looks, from the outside at least, like an actual shared life — comfortable, easy, and built on rather less examination than either of them has stopped to give it.',
    24: 'The news reaches San the ordinary way — secondhand, unremarkable, the kind of thing that would barely register if it were about anyone else. N left with a man.<br><br>Joel, beside her when she hears it, doesn\'t push. "Worried?"<br><br>"A little."<br><br>"Going after her?"<br><br>San actually considers it, for longer than either of them expects. "No," she says finally. "She\'s an adult. I offered her help. I offered her work. I offered her somewhere safe to be. She made a different choice. That\'s hers to make, same as it would be for anyone."<br><br>Somewhere else entirely, Sairen returns to the place he actually calls home and brings N something she needed without her having to ask for it at all. She smiles, genuinely pleased. He likes providing for her. She likes being looked after.<br><br>Neither of them notices the shape of what they\'re building yet.<br><br>And tucked among Sairen\'s own belongings, unremarked and easy to miss entirely, sits the first quiet sign that he was never simply the charming stranger N believes she met by chance.'
  };
  window.ARC28_CHAPTER_SCENES = ARC28_CHAPTER_SCENES;

  window.arc28ObjectiveState = function(){
    if (!game.arc27Complete) return null;
    if (level() < 420) return null;
    game.comicProgress28 = game.comicProgress28 || {};
    for (const ch of ARC28_CHAPTERS) {
      if (!game.comicProgress28[ch.id]) return 'complete_arc28_chapter_' + ch.id;
    }
    return 'arc28_part1_complete_for_now';
  };

  window.markArc28ChapterRead = function(id){
    const so = window.arc28ObjectiveState();
    if (so !== ('complete_arc28_chapter_' + id)) return;
    game.comicProgress28 = game.comicProgress28 || {};
    game.comicProgress28[id] = true;
    // Matches every prior arc's own completion flag (arc26/arc27Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 24) game.arc28Complete = true;
    const ch = ARC28_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC28_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC28_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc28Splash = function(){
    const overlay = document.getElementById('arc28SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc28Splash = function(){
    const overlay = document.getElementById('arc28SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc28SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc28 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc28) oldRenderStoryForArc28();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc28Ready = window.arc28ObjectiveState() !== null;
    if (arc28Ready && !game.arc28SplashSeen && typeof window.__ctShowArc28Splash === 'function') {
      window.__ctShowArc28Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc28/arc28-cover-n.png" alt="Arc XXVIII — N" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXVIII</div><div class="story-act-title">N</div>'+
      '<div class="story-act-tagline">Forgiveness does not automatically restore trust.</div></div>';
    if (!arc28Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXVIII Locked</div><div class="story-chapter-sub">'+
        (!game.arc27Complete ? 'Finish Arc XXVII first.' : 'Reach Level 420 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc28ObjectiveState();
    ARC28_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress28 && game.comicProgress28[ch.id]);
      const ready = !done && so===('complete_arc28_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = 
          '<button class="btn btn-small btn-success" onclick="markArc28ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc28_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXVIII chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
