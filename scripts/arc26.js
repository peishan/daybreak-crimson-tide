(function(){
  // -------------------------------------------------------------------
  // ARC XXVI — THE PRICE OF INDEPENDENCE. Gated at arc25Complete + level
  // 390, continuing the established +15-per-arc ladder (XXIII:345,
  // XXIV:360, XXV:375, XXVI:390). Ch.24 sets game.arc26Complete = true,
  // matching every other arc's own finale flag.
  //
  // Per the outline this arc was built from: the Nameless stay
  // deliberately peripheral here. Arc XXIV revealed their scale; this
  // arc's conflict is ordinary political and commercial pressure on an
  // increasingly important independent port — legitimate factions with
  // legitimate (if inconvenient) concerns, not villains. That contrast
  // is what makes Arc XXVII's escalation of the Nameless read as a
  // distinct kind of threat rather than "it was them all along."
  //
  // Core question (the outline's own framing): Fair Tide wants to stay
  // open, neutral and independent — but what is San actually willing to
  // give up to keep those principles? The most important OUTCOME is not
  // "San successfully resisted pressure" — it's that Fair Tide has to
  // change because of the choice: less dependent on a few dominant
  // trade partners, formal rules for Horizon access, and a settlement
  // that understands neutrality and independence are responsibilities,
  // not just principles.
  //
  // Same scope rule as every arc file since XVII: this file only wires
  // the story chapters. The gameplay Ch.6, 16, 18, 19, and 21's own
  // notes call for (Strategic Reserves, the Supply Disruption tied to
  // Ch.16, Trade Network diversification, the Fair Tide Intelligence
  // "Affiliation: Unknown" hook seeding Arc XXVII, and Caelan's
  // Self-Sufficiency tree) lives in scripts/arc26-mechanics.js, same
  // split used since Arc XXIII. Per the outline's own explicit
  // rejection of a dialogue-tree/morality-slider shape ("Accept /
  // Refuse, +20 Trade / -20 Independence"): every political decision
  // below is written as San's own canonical choice, never a player
  // branch — the player's only lever is how well-prepared Fair Tide is
  // when the consequences of San's choices land.
  //
  // Ch.10 uses the ALREADY-EXISTING Route Access system from Arc XVIII
  // (world-catalogue.js's ROUTE_ACCESS_LEVELS/setRouteAccess) rather than
  // inventing a new classification scale — the outline's proposed
  // OPEN/NEGOTIATED/RESTRICTED/PROTECTED/SEALED labels map close enough
  // onto the existing open/conditional/shared/restricted/sealed system
  // that building a second, parallel one would just fragment the same
  // idea across two mechanics. See arc26-mechanics.js for exactly which
  // worlds Ch.10 reclassifies.
  //
  // XP escalates toward Ch.23 ("The Independent Port," the arc's actual
  // resolution) at 400, with Ch.24's finale bump (380) kept below it —
  // the same "one centerpiece, not two" convention used since Arc XX.
  //
  // Cover image paths are placeholder guesses following the established
  // convention (chNN-slugified-title.png) — flagged for confirmation
  // like every chapter image before this, since no art exists yet to
  // confirm the real filenames against.
  // -------------------------------------------------------------------

  const ARC26_CHAPTERS = [
    {id:1, title:'The Cost of a Wider Tide', focus:"After Arc XXV's personal detour, San returns to a Fair Tide busier than she left it — trade thriving, ships arriving constantly, requests for Horizon access piling up faster than they can be answered. What once felt like a refuge now moves economies well beyond its own harbor.", image:'assets/comics/arc26/ch01-the-cost-of-a-wider-tide.webp', xp:260, action:'🌊 Return to a Wider Tide'},
    {id:2, title:'Old Agreements', focus:"A dispute sends San back to arrangements struck around Arc XVIII, back when inter-world travel was small and experimental. Fair Tide has outgrown every one of them, and nobody wrote anything with this much traffic in mind.", image:'assets/comics/arc26/ch02-old-agreements.webp', xp:270, action:'📜 Revisit the Old Agreements'},
    {id:3, title:'Preferred Partners', focus:"A powerful trading coalition offers favorable prices and guaranteed supplies in exchange for preferential access to certain Horizon routes. Aisyah recognizes the shape of the offer immediately — attractive, and exactly the kind of thing that's hard to walk back from later.", image:'assets/comics/arc26/ch03-preferred-partners.webp', xp:270, action:'🤝 Weigh the Offer'},
    {id:4, title:'Not an Empire', focus:"Some of the crew argue that accepting preferred partners isn't the same as surrendering independence. San isn't so sure — deciding who gets privileged access is exactly the kind of small, reasonable step that turns into the very thing Fair Tide never meant to become.", image:'assets/comics/arc26/ch04-not-an-empire.webp', xp:280, action:'⚖️ Refuse to Become an Empire'},
    {id:5, title:'The Ships That Stop Coming', focus:"Fair Tide refuses exclusivity. Within days, several regular shipments are mysteriously delayed or quietly redirected elsewhere. Nothing illegal happens. Nobody threatens anyone outright. The pressure has simply begun.", image:'assets/comics/arc26/ch05-the-ships-that-stop-coming.webp', xp:280, action:'🚢 Notice the Ships That Stopped'},
    {id:6, title:"Independence Isn't Free", focus:"Shortages start appearing in things Fair Tide can't easily produce itself. Caelan can repair almost anything — he can't manufacture what they simply don't have. Arc XXV's personal focus on him now feeds directly into a much larger community problem.", image:'assets/comics/arc26/ch06-independence-isnt-free.webp', xp:290, action:'📦 Feel the Shortage'},
    {id:7, title:'The Price at the Market', focus:"Aisyah discovers that merchants still willing to trade with Fair Tide are quietly being charged more elsewhere, as punishment for the association. Fair Tide's independence is starting to cost its friends money too.", image:'assets/comics/arc26/ch07-the-price-at-the-market.webp', xp:290, action:'💰 Trace the Hidden Price'},
    {id:8, title:'Friends Pay Too', focus:"San can accept hardship for her own decisions without much difficulty. Watching friendly settlements and traders suffer simply for continuing to deal with Fair Tide is a different, much harder thing — the first real challenge to her resolve.", image:'assets/comics/arc26/ch08-friends-pay-too.webp', xp:300, action:'💔 Watch Friends Pay'},
    {id:9, title:'Open the Records', focus:"Another faction makes a very different demand: share Horizon Engine route information so no single settlement controls knowledge of inter-world passage. Unlike the trade pressure, this argument actually has merit.", image:'assets/comics/arc26/ch09-open-the-records.webp', xp:300, action:'📖 Hear the Demand'},
    {id:10, title:'What Must Stay Ours', focus:"Renn and Erynn lay out why unrestricted Horizon data would be genuinely dangerous — unstable routes, vulnerable communities, boundaries sealed for reasons nobody fully understands yet. San decides knowledge can be shared without sharing everything.", image:'assets/comics/arc26/ch10-what-must-stay-ours.webp', xp:300, action:'🔒 Decide What Stays Ours'},
    {id:11, title:"A Seat at Their Table", focus:"Fair Tide is invited to join a larger political and trade council. Membership would ease much of the pressure — at the cost of accepting collective decisions about routes and trade. For once, San doesn't say no immediately.", image:'assets/comics/arc26/ch11-a-seat-at-their-table.webp', xp:300, action:'🪑 Consider the Seat'},
    {id:12, title:'Captain and Community', focus:"San brings the question home instead of deciding it alone. Fair Tide isn't simply her crew anymore — workers, families, merchants, and residents all have lives shaped by whatever she decides next.", image:'assets/comics/arc26/ch12-captain-and-community.webp', xp:300, action:'🏘️ Bring It Home'},
    {id:13, title:'The Things We Can Give', focus:"Fair Tide drafts its own counterproposal — shared non-sensitive navigation research, negotiated commercial access, coordinated rescue operations, recognition of local law, transparent trade standards. But no exclusive ownership of the Horizon routes, under any circumstances.", image:'assets/comics/arc26/ch13-the-things-we-can-give.webp', xp:300, action:'🤲 Draft What We\'ll Give'},
    {id:14, title:"The Things We Won't", focus:"San draws the harder lines — no forced disclosure of protected worlds, no monopoly over Horizon travel, no foreign control of the Engine, no compulsory military access, no treating inhabited worlds as resources. Principles that will matter for arcs still to come.", image:'assets/comics/arc26/ch14-the-things-we-wont.webp', xp:310, action:"🚫 Draw the Harder Lines"},
    {id:15, title:"Joel's Question", focus:'Joel asks San something simpler than any of it: "What happens if saying no costs us everything we\'ve built?" San doesn\'t have a heroic answer, because that\'s the actual price of independence, not a line in a speech.', image:'assets/comics/arc26/ch15-joels-question.webp', xp:320, action:"❓ Answer Joel's Question"},
    {id:16, title:'The Closed Harbor', focus:"A major port refuses Fair Tide vessels entry unless new access conditions are accepted. Nobody attacks anyone. The Crimson Tide simply has nowhere to dock — and the political pressure suddenly becomes tangible.", image:'assets/comics/arc26/ch16-the-closed-harbor.webp', xp:330, action:'⚓ Face the Closed Harbor'},
    {id:17, title:'Another Way Around', focus:"Rather than force the issue, the crew searches for alternatives. Smaller communities and independent traders start quietly offering help of their own accord — Fair Tide discovers influence never belonged only to the powerful factions.", image:'assets/comics/arc26/ch17-another-way-around.webp', xp:310, action:'🛤️ Find Another Way Around'},
    {id:18, title:'A Wider Network', focus:"Aisyah restructures trade around several smaller partners instead of a handful of dominant ones. Less efficient, initially more expensive — and much harder for any single faction to ever control again.", image:'assets/comics/arc26/ch18-a-wider-network.webp', xp:310, action:'🌐 Build the Wider Network'},
    {id:19, title:'Information Has a Price', focus:"Someone offers to end most of the pressure in exchange for restricted Horizon information. Fair Tide Intelligence warns San that accepting could genuinely solve several immediate problems — leaving her to choose between security now and a dangerous precedent later.", image:'assets/comics/arc26/ch19-information-has-a-price.webp', xp:320, action:'💱 Weigh Information\'s Price'},
    {id:20, title:'No Easy Answer', focus:"San refuses the exchange — and admits refusing doesn't magically dissolve the consequences. Fair Tide tightens supplies, delays projects, and reduces some expeditions. Independence costs them something real, starting now.", image:'assets/comics/arc26/ch20-no-easy-answer.webp', xp:330, action:'🛑 Refuse the Easy Answer'},
    {id:21, title:'What Fair Tide Can Become', focus:"Caelan, Joy, Aisyah, Renn and others begin adapting the settlement toward real self-sufficiency — repair capacity, food reserves, diversified trade, local production, stronger protection. Fair Tide becomes more independent because it has to.", image:'assets/comics/arc26/ch21-what-fair-tide-can-become.webp', xp:320, action:'🏗️ Become What It Must'},
    {id:22, title:'Terms of Our Own', focus:"San returns to negotiations with Fair Tide's own counterproposal in hand — not demanding freedom from every responsibility, but refusing ownership by anyone outside it.", image:'assets/comics/arc26/ch22-terms-of-our-own.webp', xp:320, action:'📝 Return with Terms'},
    {id:23, title:'The Independent Port', focus:"A compromise finally emerges. Not everyone is satisfied — some restrictions remain, some relationships are damaged, some factions still distrust Fair Tide outright. But enough partners accept the arrangement for Fair Tide to keep functioning. Nobody really wins. That's the important part.", image:'assets/comics/arc26/ch23-the-independent-port.webp', xp:400, action:'🏙️ Reach the Independent Port'},
    {id:24, title:'The Price of Independence', focus:'The harbor is busy again, though everything about it has changed. San weighs what the crisis cost against what it built. Joel: "Worth it?" San: "Ask me again when the bills come in." Then, quieter: "But it\'s ours."', image:'assets/comics/arc26/ch24-the-price-of-independence.webp', xp:380, action:'⚖️ Count the Price of Independence'}
  ];
  window.ARC26_CHAPTERS = ARC26_CHAPTERS;

  const ARC26_CHAPTER_SCENES = {
    1: "Fair Tide doesn't look the same as the place San left for Arc XXV's detour, even though she's only been gone a short while.<br><br>More sails crowding the harbor than she remembers scheduling room for. The Harbour Office running three shifts instead of one. A stack of formal requests for Horizon access sitting on her desk, thick enough that she has to set it down carefully instead of just dropping it.<br><br>\"It's not just busy,\" she says to Joel, turning one request over in her hands — a settlement she's never heard of, asking permission to route trade through a world Fair Tide barely understands itself. \"It's busy somewhere else now too. This isn't just our harbor being full. This is other people's economies waiting on us.\"<br><br>Joel doesn't have a tidy answer for that either. Neither of them do, yet.",
    2: "The dispute itself is small — a disagreement over docking priority that shouldn't take more than an afternoon to settle. What it drags up with it is not small at all.<br><br>The agreement everyone's arguing over was drafted back around Arc XVIII, when inter-world travel through the Horizon Engine was still new enough that nobody quite trusted it, let alone built an economy on top of it. The terms were written for a trickle. Fair Tide is now a river.<br><br>\"Nobody who wrote this thought it would ever matter this much,\" Renn says, reading it over with visible disbelief. \"Half these clauses don't even cover what we're actually doing now.\"<br><br>San rubs her eyes. \"So we've outgrown our own paperwork.\"<br><br>\"Thoroughly,\" Erynn agrees.",
    3: "The coalition's offer arrives wrapped in exactly the kind of language that makes it hard to say no on the spot — guaranteed supplies, favorable prices, steady partnership, all in exchange for one small thing: preferential access to a handful of Horizon routes.<br><br>Aisyah reads it twice before she says anything.<br><br>\"It's a good deal,\" she says finally. \"That's what worries me. It's not a trap dressed up as an offer. It's a genuinely good offer that happens to cost us something we can't easily get back once we've given it.\"<br><br>\"Which is?\" San asks, though she suspects she already knows.<br><br>\"The next time someone else wants the same thing,\" Aisyah says, \"we'll have already shown them exactly how to ask for it.\"",
    4: "The argument in the Council Hall runs longer than San expects.<br><br>\"It's not the same as an empire,\" one of the crew says, not unreasonably. \"It's one arrangement. We can still say no to the next one.\"<br><br>\"Can we, though?\" San asks. \"Or does saying yes once just mean the next request looks a little more reasonable than this one did? And the one after that looks reasonable compared to that?\"<br><br>Nobody has a clean rebuttal for it.<br><br>\"I didn't build this place to decide who gets to matter more,\" she says eventually, quieter. \"The moment I start handing out privileged access, I've started being exactly the kind of power we've spent this whole time trying not to become. I don't care how good the deal is.\"",
    5: "The refusal itself is polite, brief, and entirely uneventful. Nobody storms out. Nobody threatens anything.<br><br>Within a week, three of Fair Tide's regular shipments simply don't arrive on schedule. A fourth gets rerouted through a longer, more expensive path, with an explanation that sounds plausible enough to not quite be worth arguing with.<br><br>Nothing illegal has happened. Nobody can point to a single broken agreement. San reads through the Harbour Office's own logs twice, looking for something she can actually object to, and finds nothing but a string of inconvenient coincidences that are clearly not coincidences at all.<br><br>\"This is what it looks like,\" Aisyah says grimly. \"Nobody has to threaten you directly. They just have to make saying no expensive.\"",
    6: "The gaps show up first in the things nobody thinks about until they're gone — certain medicines, certain workshop materials, a few supplies Fair Tide never had to manufacture itself because someone else always brought them.<br><br>Caelan does what he can, which is considerable. He stretches what's left, repairs instead of replaces, finds workarounds for things that shouldn't have workarounds. But there's a hard limit to what patience and skill can substitute for.<br><br>\"I can fix almost anything you bring me,\" he tells San, not quite apologizing. \"I can't build what we don't have the material for. That's not a repair problem. That's a supply problem, and it's not mine to solve alone.\"<br><br>It's the first time San really understands, in practical terms, what independence is actually going to cost.",
    7: "Aisyah finds it almost by accident, cross-referencing prices from a friendly trader against what the same trader charges everyone else.<br><br>The numbers don't match. Not by a small margin either — enough that it's clearly deliberate, and clearly aimed at anyone who keeps doing business with Fair Tide.<br><br>\"They're not punishing us,\" Aisyah says, spreading the figures out. \"They're punishing our friends for still talking to us. It's smarter than going after Fair Tide directly. It makes US the expensive thing to be associated with.\"<br><br>San stares at the numbers for a long moment. \"That's uglier than I expected.\"<br><br>\"It's also working,\" Aisyah says. \"Slowly. But it's working.\"",
    8: "San can live with hardship that lands on her own decisions. She's done it before, more than once, and she'll do it again if that's what the principle costs.<br><br>Watching it land on someone else is different, and harder, in a way she doesn't fully expect until it actually happens — a small trader who's dealt fairly with Fair Tide for seasons, quietly losing business elsewhere for the crime of continuing to.<br><br>\"They didn't choose this fight,\" San says, more to herself than to anyone. \"I did. And they're the ones paying for it.\"<br><br>It's the first moment the pressure genuinely shakes her resolve — not because she doubts the principle, but because principles are supposed to cost the person holding them, not the people standing nearby.",
    9: "The second demand arrives without the coalition's polish — blunt, almost plain in its reasoning. Share the Horizon Engine's route information. Let no single settlement hold that much knowledge alone.<br><br>San expects to dismiss it as quickly as the first offer. She doesn't, not right away.<br><br>\"It's not wrong,\" she admits, turning it over with Joel later. \"If I were anyone else looking at Fair Tide from outside, I'd probably be asking the exact same thing. One port controlling every route between worlds — that should make people nervous. It'd make ME nervous.\"<br><br>\"So what do we do with an argument that's actually fair?\" Joel asks.<br><br>\"I don't know yet,\" San says. \"That's the annoying part.\"",
    10: "Renn and Erynn lay it out together, methodically, the way they always do when something matters enough to get exactly right.<br><br>Some routes are genuinely unstable — opening them wider without care risks lives, not just inconvenience. Some lead to communities too vulnerable to survive sudden, unmanaged contact. And some boundaries, sealed long before Fair Tide ever charted a single Horizon path, were sealed for reasons neither of them can fully explain yet, only respect.<br><br>\"Sharing everything isn't generosity,\" Erynn says. \"It's carelessness wearing generosity's face.\"<br><br>San listens to all of it, weighs it against the fairness of the original demand, and reaches something that isn't quite a compromise so much as a genuine answer.<br><br>\"Then we share what's actually safe to share,\" she says. \"And we're honest about the rest instead of just refusing outright.\"",
    11: "The invitation is more formal than anything that's reached Fair Tide before — a seat at an actual political and trade council, other settlements' captains and leaders included, real influence over the disputes that keep landing on San's desk.<br><br>The cost is written plainly enough: membership means accepting the council's collective decisions on routes and trade, not just Fair Tide's own.<br><br>San reads it twice, and doesn't say no immediately, which surprises everyone in the room including herself.<br><br>\"It's not nothing,\" she says slowly. \"A voice in the room is worth something. It might be worth more than staying outside and getting decided about instead of with.\"<br><br>Nobody expected her to actually consider it. She isn't sure she expected it either.",
    12: "Rather than decide it herself, San does something she wouldn't have thought to do this early in Fair Tide's life — she brings the question home.<br><br>Not just to the crew. To the Harbour Office staff, the Market Quarter traders, the Warden's Hall, the families who've settled here without ever sailing on the Crimson Tide at all. People whose lives would be shaped by whichever way this goes, whether or not they ever get a formal vote in it.<br><br>\"This isn't just my decision to make alone anymore,\" she tells Joel, watching the Council Hall fill up for what's meant to be a listening session more than a debate. \"It stopped being only my decision a long time before I noticed.\"<br><br>Joel doesn't argue. He just stays close while she listens to more opinions than she expected to hear.",
    13: "What comes out of the listening session, eventually, is a real counterproposal — not a refusal, not a surrender, something with actual substance to offer.<br><br>Non-sensitive navigation research, shared openly. Commercial access, genuinely negotiated rather than simply granted. Coordinated rescue operations wherever Fair Tide's reach can help. Recognition of local law, wherever Fair Tide's ships or people operate. Transparent trade standards, the same for everyone, no quiet favors to anyone.<br><br>\"This is what we can actually give,\" San says, reading the final draft aloud to the Council. \"Real things. Not gestures.\"<br><br>\"And what we won't?\" someone asks.<br><br>\"That's the other half of the document,\" San says.",
    14: "The second half is shorter, and San reads it without softening any of it.<br><br>No forced disclosure of protected worlds — some things stay sealed regardless of who asks. No monopoly over Horizon travel, not by Fair Tide and not by anyone pressuring Fair Tide into handing it to them instead. No foreign control of the Engine itself, under any argument. No compulsory military access, ever, to anyone. No treating any inhabited world as a resource to be divided up by people who've never set foot there.<br><br>\"These aren't negotiating positions,\" San tells the Council afterward, when a few voices push back. \"They're not opening offers I expect to bend on. If accepting a seat at your table means giving up any one of these, we don't want the seat.\"<br><br>It's the clearest she's been about anything since the pressure started.",
    15: 'Joel finds her still awake long after the Council session ends, staring at both halves of the document like it might rearrange itself into something easier.<br><br>"Can I ask you something simpler than all of that?" he says.<br><br>"Please."<br><br>"What happens if saying no costs us everything we\'ve built?"<br><br>San doesn\'t answer right away. She wants to have something better than silence for him, some line that makes the risk feel worth carrying. It doesn\'t come.<br><br>"I don\'t know," she says finally. "I don\'t have a heroic answer for that, Joel. I just know that if I say yes to keep what we\'ve built, I\'m not sure what we\'ll have actually kept."<br><br>Joel doesn\'t press her for more. He just sits with her, because that\'s the actual price of independence — not a speech, just this: not knowing, and holding the line anyway.',
    16: "The message from the harbor authority is almost courteous in its wording — new access conditions, effective immediately, until Fair Tide agrees to certain terms.<br><br>What it actually means becomes clear the moment the Crimson Tide tries to dock and simply isn't permitted to.<br><br>No confrontation. No weapons drawn. Just a closed gate, a polite official, and a ship with nowhere to put in.<br><br>San stands on deck longer than she needs to, watching the harbor that won't have them.<br><br>\"Nobody's attacking us,\" she says quietly to Joel. \"They don't have to. They just have to make the map smaller.\"<br><br>For the first time since this began, the pressure stops being paperwork and starts being something the crew can actually see.",
    17: "Rather than force the closed harbor's hand, the crew starts looking sideways instead of straight ahead — smaller ports, independent traders, communities who've never had much reason to care what the larger factions think of Fair Tide.<br><br>Some of them offer help before anyone even asks properly.<br><br>\"We remembered the storage arrangement,\" one small-port captain says, waving off San's surprise. \"You helped us when nobody bigger would. Feels like the least we can do.\"<br><br>San hadn't expected this — that influence might not only live with the powerful factions applying pressure, but scattered across every smaller relationship Fair Tide's ever bothered to actually maintain.<br><br>\"We've been building something we didn't know we were building,\" she tells Aisyah that evening. \"Turns out it matters now.\"",
    18: "Aisyah takes the lesson from Chapter 17 and turns it into something structural. Instead of leaning on the handful of large, dominant trade partners Fair Tide's grown comfortable with, she starts spreading relationships across many smaller ones.<br><br>It costs more, at first. It's less efficient, by any straightforward measure — more routes to manage, more relationships to maintain, more overhead for less volume per partner.<br><br>\"It's also a lot harder for any one of them to squeeze us the way the coalition just tried to,\" Aisyah says, laying the new structure out for San. \"You can't starve someone out through one supplier if they've got a dozen.\"<br><br>San studies the new trade map — messier, wider, considerably less tidy than the old one — and recognizes it for what it actually is: independence, drawn out as a diagram.",
    19: "The offer, when it finally comes, is almost gentle in how reasonable it sounds. Share certain restricted Horizon information. In exchange, most of the pressure simply stops — the delayed shipments, the price penalties on Fair Tide's friends, all of it.<br><br>Fair Tide Intelligence flags it plainly: accepting would genuinely solve several real, current problems. Not a trick. Not a trap. A real trade.<br><br>San sits with the report longer than she's sat with almost anything else this arc.<br><br>\"It would work,\" she admits to Joel. \"That's what makes it hard. It's not a bad deal today. It's a bad deal for whoever's standing here in five years, dealing with whatever precedent I set right now.\"",
    20: "She refuses it. Quietly, without ceremony, in a message that doesn't try to sound braver than it is.<br><br>And she doesn't pretend the refusal fixes anything. The pressure doesn't lift. If anything, it tightens — a few ongoing projects get delayed for lack of materials, a couple of planned expeditions get scaled back, and Fair Tide's stores get noticeably thinner than anyone's comfortable with.<br><br>\"Saying no was the easy part,\" San tells the Council, with none of her usual certainty dressed up as more than it is. \"Living with what saying no costs — that's the actual work. That's the part nobody warns you about when they tell you to hold your principles.\"<br><br>Nobody in the room disagrees with her. Nobody looks especially comforted either.",
    21: "If Fair Tide can't rely on the partners squeezing it, then Fair Tide has to rely on itself, and the shift that follows isn't dramatic so much as constant — dozens of small changes, all pointed the same direction.<br><br>Caelan expands what the settlement can actually build and repair on its own, instead of importing half of it. Joy tightens how the Warden's Hall watches over the places that matter most now that supply lines are thinner and tempers shorter. Aisyah keeps widening the trade web she started in Chapter 18. Renn and Erynn fold what they've learned about the routes into practical, usable rules instead of abstract caution.<br><br>\"We're not choosing to be more self-sufficient,\" Caelan says, watching the Workshop's output climb for the third week running. \"We're finding out we have to be. Turns out that's a pretty good teacher.\"",
    22: "San returns to the negotiating table with something Fair Tide didn't have the first time around: an actual counterproposal, drafted, debated, and genuinely meant.<br><br>She isn't asking to be released from every obligation to the wider world — Fair Tide accepts real responsibilities to the communities it touches, and says so plainly. What she refuses, just as plainly, is ownership. Nobody gets to decide Fair Tide's routes, trade, or Engine for it, no matter how reasonable their argument sounds.<br><br>\"We'll meet you as partners,\" she tells the assembled factions. \"Not as something you get to manage.\"<br><br>It isn't universally well received. But for the first time since the pressure began, San isn't the one reacting to someone else's terms. She's the one setting them.",
    23: "What finally emerges isn't a clean victory, and San stops expecting one somewhere around the fourth round of negotiation.<br><br>Some restrictions remain in place. A few relationships, damaged earlier in the pressure campaign, don't fully mend. A handful of factions accept the arrangement without ever quite trusting Fair Tide again. Nobody gets everything they originally wanted, San least of all.<br><br>But enough partners sign on. Enough of the old shipments resume, enough new ones replace what's lost for good, enough of the pressure eases that Fair Tide can keep functioning as the thing it was always meant to be — open, and its own.<br><br>\"Nobody really won this,\" Aisyah says, looking over the final terms.<br><br>\"No,\" San agrees. \"I think that's the actual sign it's fair.\"",
    24: 'The harbor fills again over the following weeks, busy in a way that finally feels earned instead of merely lucky.<br><br>San walks the docks one evening and takes stock of both sides of the ledger, the way she\'s learned to do properly now. What the crisis cost: partners who never came back, projects delayed months longer than planned, relationships that will need real time to heal, stores that took a real beating before anyone thought to call them Reserves.<br><br>And what it built in trade: new partners who trust Fair Tide precisely because it held its ground, real local production it never had before, formal rules for Horizon access that will outlast this entire arc, and a community that finally understands what independence actually requires of it — not a slogan, a standing cost, paid continuously.<br><br>Joel finds her there, watching it all.<br><br>"Worth it?" he asks.<br><br>San watches the harbor a while longer before answering.<br><br>"Ask me again when the bills come in."<br><br>Joel almost smiles.<br><br>"But it\'s ours," she adds, quieter, and means it more than anything else she\'s said all arc.'
  };
  window.ARC26_CHAPTER_SCENES = ARC26_CHAPTER_SCENES;

  window.arc26ObjectiveState = function(){
    if (!game.arc25Complete) return null;
    if (level() < 390) return null;
    game.comicProgress26 = game.comicProgress26 || {};
    for (const ch of ARC26_CHAPTERS) {
      if (!game.comicProgress26[ch.id]) return 'complete_arc26_chapter_' + ch.id;
    }
    return 'arc26_part1_complete_for_now';
  };

  window.markArc26ChapterRead = function(id){
    const so = window.arc26ObjectiveState();
    if (so !== ('complete_arc26_chapter_' + id)) return;
    game.comicProgress26 = game.comicProgress26 || {};
    game.comicProgress26[id] = true;
    // Matches every prior arc's own completion flag (arc24/arc25Complete)
    // — self-contained to this file, no aggregator dependency.
    if (id === 24) game.arc26Complete = true;
    const ch = ARC26_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC26_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC26_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc26Splash = function(){
    const overlay = document.getElementById('arc26SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc26Splash = function(){
    const overlay = document.getElementById('arc26SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc26SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc26 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc26) oldRenderStoryForArc26();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc26Ready = window.arc26ObjectiveState() !== null;
    if (arc26Ready && !game.arc26SplashSeen && typeof window.__ctShowArc26Splash === 'function') {
      window.__ctShowArc26Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/arc26/arc26-cover-the-price-of-independence.webp" alt="Arc XXVI — The Price of Independence" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Arc XXVI</div><div class="story-act-title">The Price of Independence</div>'+
      '<div class="story-act-tagline">Being independent means making difficult choices.</div></div>';
    if (!arc26Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XXVI Locked</div><div class="story-chapter-sub">'+
        (!game.arc25Complete ? 'Finish Arc XXV first.' : 'Reach Level 390 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc26ObjectiveState();
    ARC26_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress26 && game.comicProgress26[ch.id]);
      const ready = !done && so===('complete_arc26_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action = 
          '<button class="btn btn-small btn-success" onclick="markArc26ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc26_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XXVI chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
