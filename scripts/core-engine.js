

// ============================================================================
// DAYBREAK: CRIMSON TIDE
// Pirate spinoff of "Legends of Daybreak" — San's crew was scattered across
// the archipelago by the wreck of the Daybreak. Trade, sail, and fight your
// way port to port, finding one companion at a time.
// ============================================================================

// ---------------------------------------------------------------------------
// PORTS — each port doubles as a market AND a story stop. `companion` is who
// you're looking for there; `guardian` is the fight that frees them;
// `chapterId`/`blurb` drive the Story screen; `harbor` is the pool of
// repeatable local threats you can pick a fight with any time.
// ---------------------------------------------------------------------------
const PORTS = [
  { id: 'singapore', name: 'Singapore', icon: '🦁', desc: 'The Lion City. A bustling free port where all goods flow.',
    specialties: ['spices', 'silk', 'tea'], distances: { malacca: 1, batavia: 3, manila: 4, bangkok: 2, hanoi: 3, palembang: 2, kota_batu: 6, fair_tide: 5 }, danger: 1,
    chapterId: 1, companion: null, guardian: null,
    comic: [
      {image:'assets/comics/act1/ch02/panel01.png', caption:'The storm took everything.'},
      {image:'assets/comics/act1/ch02/panel02.png', caption:'But I’m still here. So I won’t stop.'},
      {image:'assets/comics/act1/ch02/panel03.png', caption:'A lead in Singapore. A name on someone’s lips.'},
      {image:'assets/comics/act1/ch02/panel04.png', caption:'Malacca. That’s where I’ll start.'}
    ],
    blurb: "San's home port, or what's left of one. Three months since the Daybreak went down in a squall that shouldn't have existed. She surfaced with Soel's collar around her wrist, a compass that points toward people instead of north, and nothing else. One by one, it's led her to a port. One by one, she means to get her crew back.",
    harbor: ['bilge_rat','dock_thief'] },
  { id: 'malacca', name: 'Malacca', icon: '🏰', desc: 'Historic straits port. Spices and antiquities trade hands here.',
    specialties: ['spices', 'pepper', 'antiquities'], distances: { singapore: 1, batavia: 3, manila: 5, bangkok: 3, hanoi: 4, palembang: 3, kota_batu: 6, fair_tide: 5 }, danger: 2,
    chapterId: 2, companion: 'joel', guardian: 'wreck_warden',
    comic: [
      {image:'assets/comics/act1/ch03/panel01.png', caption:'A port of crossroads. Merchants from far and wide.'},
      {image:'assets/comics/act1/ch03/panel02.png', caption:'Joel was seen here. Three nights ago. Fighting. Alone.'},
      {image:'assets/comics/act1/ch03/panel03.png', caption:'The harbourmaster remembers — but he’ll only speak for a favor.'},
      {image:'assets/comics/act1/ch03/panel04.png', caption:'Joel protects the innocent, even in a city that doesn’t know his name.'}
    ],
    blurb: "Joel washed up indentured to the very wreck he first served on, held below decks by something wearing the shape of every captain who ever drowned there. He hasn't stopped guarding the door since. Someone has to make him put it down.",
    preFight: "The wreck groans as San picks her way below decks, lantern catching on rot and old rope. A voice comes from the dark that almost sounds like Joel's — flatter, colder, giving orders to a crew that isn't there anymore. Whatever's wearing his captain's face down here, it isn't going to let him go without an argument first.",
    postFight: "The shape wearing all those dead captains comes apart like wet paper the moment it stops being fed. Joel doesn't say much — he never does — but his hand finds San's shoulder for just a second before he picks his sword back up like no time passed at all.",
    harbor: ['bilge_rat','smuggler_crew'] },
  { id: 'palembang', name: 'Palembang', icon: '⛰️', desc: 'Ancient Srivijayan port. Pepper, ivory, and exotic hardwoods.',
    specialties: ['pepper', 'ivory', 'timber'], distances: { singapore: 2, malacca: 3, batavia: 2, manila: 5, bangkok: 3, hanoi: 4, kota_batu: 7, fair_tide: 6 }, danger: 3,
    chapterId: 3, companion: 'aisyah', guardian: 'debt_collector',
    blurb: "Aisyah is buried under a debt she never signed for, minding a dead man's ledger for a collector who has never once let a name off the page. She taught San how to read a bad deal from across a room. This one is the worst she's ever been in.",
    harbor: ['smuggler_crew','wreck_crab'] },
  { id: 'batavia', name: 'Batavia', icon: '🌺', desc: 'Dutch colonial capital. Coffee, nutmeg, and fine textiles.',
    specialties: ['coffee', 'nutmeg', 'textiles'], distances: { singapore: 3, malacca: 3, manila: 4, bangkok: 4, hanoi: 5, palembang: 2, kota_batu: 7, fair_tide: 6 }, danger: 2,
    chapterId: 4, companion: 'eliz', guardian: 'plague_hulk',
    blurb: "Eliz has been tending a quarantined hulk alone for weeks, refusing to leave the sick until someone makes her believe the crew needs her just as badly. The hulk isn't going to let either of them go without a fight.",
    harbor: ['dock_thief','harbor_ghoul'] },
  { id: 'bangkok', name: 'Bangkok', icon: '🛕', desc: 'Venice of the East. Rice, timber, and sacred artifacts.',
    specialties: ['rice', 'timber', 'artifacts'], distances: { singapore: 2, malacca: 3, batavia: 4, manila: 3, hanoi: 2, palembang: 3, kota_batu: 6, fair_tide: 5 }, danger: 2,
    chapterId: 5, companion: 'mezstorm', guardian: 'storm_idol',
    blurb: "Mezstorm bartered his freedom to a drowned idol just to survive the wreck, and the idol has an excellent memory for deals. He still owes it a storm. San's about to make sure it never collects.",
    harbor: ['harbor_ghoul','wreck_crab'] },
  { id: 'hanoi', name: 'Hanoi', icon: '🐉', desc: 'Northern trading post. Tea, silk, and porcelain.',
    specialties: ['tea', 'silk', 'porcelain'], distances: { singapore: 3, malacca: 4, batavia: 5, manila: 2, bangkok: 2, palembang: 4, kota_batu: 7, fair_tide: 6 }, danger: 2,
    chapterId: 6, companion: 'senedra', guardian: 'fog_stalker', recruitment: 'escape',
    blurb: "Senedra's been signaling from the same lighthouse for three months, certain someone would eventually see it — she just didn't expect the fog to start signaling back. Her aim hasn't dulled at all waiting.",
    harbor: ['dock_thief','bilge_rat'] },
  { id: 'manila', name: 'Manila', icon: '🏝️', desc: 'Pearl of the Orient. Pearls, tropical fruits, and Spanish silver.',
    specialties: ['pearls', 'fruits', 'silver'], distances: { singapore: 4, malacca: 5, batavia: 4, bangkok: 3, hanoi: 2, palembang: 5, kota_batu: 7, fair_tide: 6 }, danger: 3,
    chapterId: 7, companion: 'zaki', guardian: 'iron_brig_warden', recruitment: 'escape',
    blurb: "Zaki's working off a debt aboard a prison hulk one fistfight at a time, and winning every single one of them, which is exactly the problem — they'll never let their best fighter go willingly.",
    harbor: ['smuggler_crew','harbor_ghoul'] },
  { id: 'kota_batu', name: 'Kota Batu', icon: '🏯', desc: 'The historic capital of the Bruneian Empire at its height — camphor, gold dust, and bezoar stones change hands here.',
    specialties: ['camphor', 'gold_dust', 'bezoar'], distances: { singapore: 6, malacca: 6, palembang: 7, batavia: 7, bangkok: 6, hanoi: 7, manila: 7, fair_tide: 6 }, danger: 5,
    chapterId: null, companion: null, guardian: null,
    blurb: "Before Bandar Seri Begawan, before Muara, this was the seat of an empire that ruled the whole coastline. The crew reaches it only once they've faced down enough of what Bandar Seri Begawan's illusions left behind — and grown strong enough to actually stand in the real thing. The alleys here are older, meaner, and unimpressed by reputation.",
    harbor: ['portside_rogues','market_row_toughs','quay_row_debt_runners','old_quarter_runners','back_lane_toughs'] },
  { id: 'fair_tide', name: 'Fair Tide', icon: '🌅', desc: 'A weathered coastal port along their route, worn down but full of potential — the first place that could actually become home.',
    specialties: ['timber', 'rice', 'rum'], distances: { singapore: 5, malacca: 5, palembang: 6, batavia: 6, bangkok: 5, hanoi: 6, manila: 6, kota_batu: 6 }, danger: 2,
    chapterId: null, companion: null, guardian: null,
    blurb: "Not much left of it at first glance — a leaning warehouse, a dead lighthouse, docks that have seen better decades. But the harbourmaster's still there, and so are a handful of people who never quite gave up on the place. Somewhere ships can come home to, if the crew's willing to put in the work.",
    harbor: ['dock_thief','smuggler_crew'] }
];

// The endgame stop — only reachable once every companion above has been
// found. Not a trading port; just the fight that brings the last two home.
const DROWNED_PASSAGE = {
  chapterId: 8, guardian: 'drowned_admiral',
  blurb: "Word reaches the crew of two more castaways waiting at the edge of the charts — a knight and a priestess holding a passage nobody else has survived. San didn't think there was anyone left to find. She was wrong, and gladly."
};

// ---------------------------------------------------------------------------
// ACT II — "Fair Winds, Full Hands." Act I was about getting the crew back.
// Act II is about what a whole crew does with a ship and a trade network
// once nobody's missing anymore: less treasure-hunting, more showing up
// where they're needed. Built one chapter at a time — new entries just get
// appended to ACT2_CHAPTERS as they're written.
// ---------------------------------------------------------------------------
const ACT2_CHAPTERS = [
  { id: 9, title: 'Empty Harbors', portId: 'batavia', good: 'rice', need: 40,
    unlockBlurb: "Word reaches the crew before they've even properly celebrated being whole again: blight took the harvest in Batavia's outer fishing villages, and the colonial office isn't in a hurry to help people who can't pay taxes. San remembers being the one nobody hurried for. Not this time.",
    deliverPrompt: 'Give away the rice, no invoice',
    resolution: "The harbormaster doesn't know what to do with forty sacks of rice and no bill attached. Word travels fast in small ports — grateful word, for once, instead of the kind with a bounty on it.",
    rw: {xp:400, gold:120, rep:20} }
];
function currentAct2Chapter() { return ACT2_CHAPTERS[game.act2Index] || null; }
function deliverAid() {
  const ch = currentAct2Chapter();
  if (!ch || game.location !== ch.portId) return;
  const have = game.cargo[ch.good] || 0;
  if (have < ch.need) { toast(`Need ${ch.need}x ${GOODS[ch.good].name} in the hold.`); return; }
  game.cargo[ch.good] -= ch.need;
  game.cargoUsed -= GOODS[ch.good].weight * ch.need;
  if (game.cargo[ch.good] <= 0) delete game.cargo[ch.good];
  game.gold += ch.rw.gold;
  gainXP(ch.rw.xp);
  game.reputation += ch.rw.rep;
  game.act2Index++;
  logEvent(`💛 Chapter ${ch.id} complete — ${ch.title}.`, 'good');
  showModal(`Chapter ${ch.id} — ${ch.title}`, ch.resolution, [{text:'Continue', action: () => { closeModal(); renderExplore(); }}]);
  updateUI(); renderCargo();
}

// ---------------------------------------------------------------------------
// ACT III — "Origins." San hasn't recalled her life before the wreck — just
// fragments, and the people she somehow already trusts. Each Origins chapter
// is a memory recovered alongside one companion, triggered by a moment in a
// fight rather than a delivery. Unlocks alongside Act II; written one memory
// at a time, same as everything else here.
// ---------------------------------------------------------------------------
const ACT3_CHAPTERS = [
  { id: 22, companion: 'joel', title: 'Familiar Streets', location: 'Bandar Seri Begawan Illusion',
    image: 'assets/comics/arc3/ch22-joel-familiar-streets.png',
    setupBlurb: "San finds Joel alone checking the rigging, no crisis pulling either of them away for once. \"I never actually got to talk to you,\" she says. \"Not properly. Not since whatever this is.\" Joel doesn't pretend not to understand. Neither of them remembers much from before the storm — but something about the other feels less like a stranger than it should. Bandar Seri Begawan keeps surfacing in both their heads, unprompted, familiar in a way neither can explain. If they were from anywhere, it was there. They decide to go find out, together.",
    enemy: { name: 'Portside Rogues', art: '🗡️', hp: 260, dmg: 14, xp: 220, gold: 90, desc: 'A gang working the alleys behind the harbor, testing whether two strangers are worth robbing.' },
    victoryScene: "The last rogue never gets the swing off — Joel's already moving, closing the space between him and San before the blade does, pulling her in against his chest with one arm braced across her back like he's done it a hundred times before. For a second neither of them breathes.<br><br>And then it isn't the alley anymore. It's a room with the windows shut against a storm that shouldn't exist, raised voices, a door closing too hard, $200 that was never hers to lend. The memory doesn't come back all at once — just enough to hurt.<br><br>San pulls back first, breathing harder from the memory than the fight. \"It seems... we were arguing. But I can't remember why.\"<br><br>Joel is quiet for a few seconds. Then: \"Maybe some things are best left in the past.\"<br><br>But San leans closer instead of letting it go. \"And some things we live in the present with.\" She kisses him, and this time he doesn't pull away.<br><br>They don't talk about the argument again that night. They don't need to.",
    rw: {xp:500, gold:150, rep:10} },
  { id: 23, companion: 'aisyah', title: 'The House at Bandar Seri Begawan', location: 'Bandar Seri Begawan Illusion',
    image: 'assets/comics/arc3/ch23-aisyah-the-house.png',
    setupBlurb: "San can't explain it, but Aisyah feels less like a crewmate and more like something owed — a lifetime of favors she never got to pay back. She says as much, half-joking, expecting it to be shrugged off. Aisyah doesn't laugh it off. \"Feels like you're the little sister who never calls first,\" she says, and it lands harder than either of them expects. Neither remembers a house, or a name for what they were to each other — just Bandar Seri Begawan, surfacing the same unprompted way it did for Joel. They go looking.",
    enemy: { name: 'Market Row Toughs', art: '🥊', hp: 300, dmg: 15, xp: 240, gold: 100, desc: "Small-time muscle leaning on stallholders who can't afford to say no." },
    victoryScene: "The last of them drops his knife and bolts the second Aisyah's boot connects with his shin — the fight was never close. She doesn't even look winded, already scanning the alley like she's cataloguing what's worth taking. \"Habit,\" she says, when she catches San staring.<br><br>And the memory comes with the word: a house that never stopped being loud, seven cats underfoot and two dogs at the door, a woman at the kitchen table doing sums in her head faster than San could reach for a calculator — thirty-some years of teaching mathematics to children who never once thought to thank her for it. Money going out to San more times than either of them ever bothered to count, and never once with a lecture attached.<br><br>\"You used to just... give me things,\" San says. \"Money. Advice. Never asked for it back.\"<br><br>Aisyah shrugs like it costs her nothing, same as it always did. \"That's what oldest sisters are for.\"<br><br>San doesn't know what to say to that, so she just puts her head on Aisyah's shoulder for a second, the way she must have done a hundred times in a life she can't remember yet. Aisyah lets her.<br><br>There are two more voices in that memory-house San can't place yet — grown, maybe grown enough by now to have their own name for the woman standing next to her. Aisyah goes quiet for a moment too long, like she's chasing the same thread.<br><br>\"There's more of us out there,\" she says eventually. \"I can feel it. Might be closer than you think.\"",
    rw: {xp:500, gold:150, rep:10} },
  { id: 24, companion: 'mezstorm', title: 'The Weather Between Them', location: 'Singapore Illusion',
    image: 'assets/comics/arc3/ch24-mezstorm-the-weather-between-them.png',
    setupBlurb: "San's tried to talk to Mez properly twice already and lost her nerve both times. There's something braced in the way Mez watches her — not unkind, just guarded, like she's already expecting to be let down before San's said a word. San doesn't know why that stings the way it does. She only knows Mez keeps looking toward Singapore like she's homesick for a place she's never once admitted to missing. Eliz wants to go. That's reason enough for Mez to finally agree — and reason enough for San to come along.",
    enemy: { name: 'Quay Row Debt Runners', art: '🧾', hp: 320, dmg: 16, xp: 260, gold: 110, desc: "Leaning on shopkeepers over a debt that was never really theirs to collect." },
    victoryScene: "Eliz freezes the second a runner grabs for her sleeve — and Mez is already moving, but so is San, faster, putting herself calmly between him and both of them, talking him down instead of swinging first, the way she never used to. It's over in a minute. Nobody's hurt.<br><br>Mez looks at her like she's looking at a stranger wearing her sister's face. \"That's not how I remember you handling things,\" she says slowly.<br><br>And with the words comes the shape of what San doesn't have language for yet: being the one who always got in trouble, whose relationships never worked out, the one Mez stopped expecting anything different from long before any storm ever hit. Somewhere in it, unspoken, is a man named Lim, and everything Mez never understood about why San finally left him — the kind of thing that's easy to mistake for just another San mess, from the outside.<br><br>\"Joel's not like that,\" San says quietly, before Mez even asks. \"I don't expect you to just believe me. I know what you think of me.\"<br><br>Mez doesn't answer right away. She watches Eliz, safe, already chattering about something else entirely — then looks back at San like she's recalculating something she'd stopped bothering to check.<br><br>\"Maybe,\" is all she says.<br><br>It isn't forgiveness. It isn't even trust yet. But it's more than San's gotten from her in longer than she can remember — and for now, it's enough to build on.",
    rw: {xp:500, gold:150, rep:10} },
  { id: 25, companions: ['senedra','zaki'], title: 'Grown Before Their Time', location: 'Bandar Seri Begawan Illusion',
    image: 'assets/comics/arc3/ch25-senedra-zaki-grown-before-their-time.png',
    setupBlurb: "San watches Senedra and Zaki move through the harbor crowd like they've been doing it their whole lives — Senedra already reading the rooftops, Zaki already between San and anyone who looks twice at her. She's the aunt here. It shouldn't feel like the other way around. Bandar Seri Begawan surfaces in her head before she can place why — just a name, the shape of a house. She doesn't ask if they remember it. Some part of her isn't sure she wants the answer badly enough to make either of them dig for it. They go anyway, because it's on the way to somewhere else, and because none of them mind the company.",
    enemy: { name: 'Old Quarter Runners', art: '🔪', hp: 310, dmg: 16, xp: 250, gold: 105, desc: 'Small-time toughs who\'ve learned the back alleys better than the watch ever will.' },
    victoryScene: "Zaki barely breaks a sweat clearing the last of them out — he never does. Senedra's already scanning the rooftops before San's even caught her breath, same as always.<br><br>\"You always did that,\" San says. \"Watch every exit before anyone asked you to.\"<br><br>\"Somebody had to,\" Senedra says. Not unkind. Just true.<br><br>Something flickers at the edge of San's memory — a house, quieter some years than others. It doesn't come all the way back. Zaki doesn't reach for it at all; he was too young when most of it happened to have kept much of it in the first place. Senedra's expression doesn't change either — whatever she remembers, she'd already decided a long time before any storm that it wasn't worth carrying forward.<br><br>San almost says something. Almost. But she looks at the two of them, steady, unbothered, already arguing over who gets first pick of the spoils — and decides the memory can stay exactly where it's been all this time.<br><br>Some things are better left forgotten. Whatever came before, 2026 was good between them. That's the version she'd rather keep.",
    rw: {xp:520, gold:160, rep:12} },
  { id: 26, companion: 'eliz', title: 'Small Hands, Long Memory', location: 'Singapore Illusion',
    image: 'assets/comics/arc3/ch26-eliz-small-hands-long-memory.png',
    setupBlurb: "San's spent longer avoiding Eliz's eyes than anyone else's on this ship, and she knows it. There's a version of her Eliz still remembers that isn't the one standing here now — someone who used to show up on weekends and then, one day, just didn't, the same way the others eventually didn't either. Eliz doesn't say any of that out loud. She just watches San carefully, deciding, like she's always done, whether this one's worth trusting with anything that matters. Neither of them mentions it outright, but they end up walking Singapore's old streets together anyway — the ones San used to cut through on her way to class, a lifetime ago.",
    enemy: { name: 'Back Lane Toughs', art: '🥋', hp: 330, dmg: 16, xp: 270, gold: 115, desc: "Small-time trouble that knows exactly which streets the watch doesn't bother with." },
    victoryScene: "One of them lands a solid hit before Eliz can even raise her hands — square into San's shoulder, hard enough to put her down on one knee. For once it's San who needs the help, and Eliz who's already there, palms glowing, steady in a way that has nothing rushed about it. She's done this before. She's good at it.<br><br>The memory comes in with the warmth of the healing — a baby in a house in Singapore that wasn't quite home yet for anyone in it, San dropping out of one university to chase a fresh start in another, her mother beside her, easy and unbothered in a house that was slowly running out of the kind of easy San could afford to be. Money trouble at the company, doors closing quieter than they should have. Then two men leaving Eliz's life within a few years of each other — her father first, and after him the one she'd cautiously started letting herself call something like a second dad — and San graduating and going home not long after, the way people who aren't stuck do.<br><br>Then San again, older, a man beside her that Eliz disliked on sight and never once reconsidered — a small, sharp instinct, the kind adults are usually too polite to trust in themselves. Nobody asked Eliz what she thought of Lim. She was right anyway.<br><br>San remembers all of it landing on Eliz at once, over the years — losing two fathers, then losing the aunt who used to actually show up, watching that aunt vanish into the same kind of marriage her own mother had barely survived. San wasn't paying attention by then. She was drowning in her own version of the same story.<br><br>\"I wasn't there,\" San says, once the ache in her shoulder fades to nothing. \"For any of it. I know that.\"<br><br>Eliz doesn't answer right away — that's just how she works through things, taking whatever time she actually needs instead of whatever time a conversation is supposed to allow. When she does answer, it isn't forgiveness dressed up as something bigger. It's smaller than that, and more honest.<br><br>\"You're here now,\" she says. \"That's the part I can work with.\"<br><br>It isn't everything undone. But San takes her hand anyway, and this time, neither of them lets go first.",
    rw: {xp:540, gold:170, rep:14} }
];
function act3Unlocked() { return !!game.finalCleared; }
function currentAct3Chapter() { return ACT3_CHAPTERS[game.act3Index] || null; }
function startMemoryFight() {
  const ch = currentAct3Chapter();
  if (!ch) return;
  showModal(`Origins · Chapter ${ch.id}`, ch.setupBlurb,
    [{text: '⚔️ Go Together', action: () => { closeModal(); startCombat({kind:'memory', key:'act3_'+ch.id, enemy: ch.enemy}); }},
     {text: 'Not Yet', action: closeModal}]);
}

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// ACT IV — "The Old Crew".
// Aldric and Wren are already established members from Act I.
// This act begins reconnecting San with the original Daybreak allies,
// starting with KW Liang. Keep individual chapter details minimal until
// their actual story scripts are written.
// ---------------------------------------------------------------------------
const ACT4_CHAPTERS = [
  {
    id: 1,
    title: 'A Familiar Signal',
    ally: 'kw_liang',
    allyName: 'KW Liang',
    location: 'Singapore',
    setupBlurb: "The Farseer catches a signal that feels different from an ordinary memory. Someone familiar is nearby — but not someone San remembers finding in the Crimson Tide world. The trail leads toward KW Liang.",
    tagline: "The old crew begins to answer.",
    status: "FIRST ALLY",
    comic: [
      {caption: "Panel 1 — The Farseer stirs. A signal appears where no signal should be.", text: "The signal comes through for only a heartbeat.", image: "assets/comics/act1/ch02/panel01.png"},
      {caption: "Panel 2 — San recognizes something she cannot explain.", text: "For three seconds, another world is visible.", image: "assets/comics/act1/ch02/panel02.png"},
      {caption: "Panel 3 — A familiar name reaches the crew.", text: "A name from the old Daybreak reaches the crew.", image: "assets/comics/act1/ch03/panel01.png"}
    ]
  },
  {
    id: 2,
    title: 'Beyond the First Signal',
    ally: null,
    allyName: 'Another original ally',
    location: 'TBD',
    setupBlurb: "The first reunion changes what the crew believes about the storm. More familiar signals may exist beyond Singapore.",
    tagline: "One reunion opens another road.",
    status: "LOCKED",
    comic: []
  }
];

function act4Unlocked() {
  return ACT3_CHAPTERS.length > 0 && game.act3Index >= ACT3_CHAPTERS.length;
}

function currentAct4Chapter() {
  return ACT4_CHAPTERS[game.act4Index] || null;
}

function renderComicPanels(ch, key) {
  const panels = ch && Array.isArray(ch.comic) ? ch.comic : [];
  if (!panels.length) return '';
  return `<div class="comic-reader">
    <div class="panel-title" style="margin-bottom:8px;">🎞️ Comic Chapter</div>
    ${panels.map((p, i) => {
      const image = p.image || p.src;
      return `<article class="comic-panel" style="margin:0 0 14px;">
        ${image
          ? `<img class="comic-image-panel" src="${esc(image)}" alt="${esc(p.caption || 'Comic panel '+(i+1))}"
              onerror="this.outerHTML='<div class=\\'comic-panel-fallback\\'>Comic artwork not loaded yet<br><small>${esc(image)}</small></div>'">`
          : `<div class="comic-panel-fallback">Comic artwork slot · Panel ${i+1}</div>`}
        ${p.caption ? `<div class="comic-caption">${esc(p.caption)}</div>` : ''}
        ${p.text ? `<div class="story-chapter-text" style="margin-top:7px;">${esc(p.text)}</div>` : ''}
      </article>`;
    }).join('')}
  </div>`;
}

function renderAct4() {
  const host = document.getElementById('act4Content');
  if (!host) return;
  if (!act4Unlocked()) {
    host.innerHTML = `<div class="story-chapter locked">
      <div class="story-chapter-title">🔒 The Old Crew</div>
      <div class="story-chapter-text">Act IV opens after San has worked through the current Origins memories. Aldric and Wren are already aboard; this act begins with the original Daybreak allies.</div>
    </div>`;
    return;
  }

  let out = '';
  ACT4_CHAPTERS.forEach((ch, i) => {
    const done = i < game.act4Index;
    const active = i === game.act4Index;
    const locked = i > game.act4Index;
    out += `<article class="story-chapter ${done?'complete':''} ${active?'active':''} ${locked?'locked':''}">
      <div class="story-chapter-top">
        <div class="story-chapter-title">Chapter ${ch.id} — ${esc(ch.title)}</div>
        <div class="story-status">${done ? '✓ COMPLETE' : active ? 'CURRENT' : 'LOCKED'}</div>
      </div>
      <div class="story-chapter-text">${esc(done ? 'The trail to the original Daybreak allies has begun.' : ch.setupBlurb)}</div>
      <div class="story-meta">
        <span class="story-chip gold">📍 ${esc(ch.location)}</span>
        <span class="story-chip">👤 ${esc(ch.allyName)}</span>
        <span class="story-chip red">${esc(ch.status)}</span>
      </div>
      ${active ? `<div class="story-actions">
        <button class="btn btn-small btn-magic" onclick="beginAct4Chapter()">🔮 Follow the Signal</button>
      </div>` : ''}
      ${done ? renderComicPanels(ch, 'act4_'+ch.id) : ''}
    </article>`;
  });

  host.innerHTML = out;
}

function beginAct4Chapter() {
  const ch = currentAct4Chapter();
  if (!ch) return;
  showModal(`Act IV · Chapter ${ch.id}`, ch.setupBlurb,
    [{text:'🔮 Follow the Signal', action:() => {
      closeModal();
      logEvent(`📖 Act IV Chapter ${ch.id} opened: ${ch.title}`, 'gold');
      toast(`The trail to ${ch.allyName} begins.`);
    }},
     {text:'Not Yet', action:closeModal}]);
}

// GOODS — Trade commodities (Tradewinds half of the game)
// ---------------------------------------------------------------------------
const GOODS = {
  rice: { name: 'Rice', icon: '🍚', basePrice: 10, weight: 1 },
  spices: { name: 'Spices', icon: '🌶️', basePrice: 45, weight: 1 },
  silk: { name: 'Silk', icon: '🧣', basePrice: 85, weight: 1 },
  timber: { name: 'Timber', icon: '🪵', basePrice: 28, weight: 2 },
  pearls: { name: 'Pearls', icon: '🦪', basePrice: 130, weight: 1 },
  rum: { name: 'Rum', icon: '🍾', basePrice: 38, weight: 1 },
  tea: { name: 'Tea', icon: '🍵', basePrice: 48, weight: 1 },
  coffee: { name: 'Coffee', icon: '☕', basePrice: 58, weight: 1 },
  nutmeg: { name: 'Nutmeg', icon: '🥜', basePrice: 75, weight: 1 },
  textiles: { name: 'Textiles', icon: '🧵', basePrice: 52, weight: 1 },
  silver: { name: 'Silver', icon: '🥈', basePrice: 160, weight: 2 },
  fruits: { name: 'Tropical Fruits', icon: '🥭', basePrice: 22, weight: 2 },
  pepper: { name: 'Black Pepper', icon: '⚫', basePrice: 65, weight: 1 },
  ivory: { name: 'Ivory', icon: '🦷', basePrice: 260, weight: 2 },
  porcelain: { name: 'Porcelain', icon: '🏺', basePrice: 110, weight: 1 },
  antiquities: { name: 'Antiquities', icon: '🏛️', basePrice: 180, weight: 1 },
  artifacts: { name: 'Sacred Artifacts', icon: '✨', basePrice: 220, weight: 1 },
  contraband: { name: 'Contraband', icon: '💀', basePrice: 250, weight: 1 },
  camphor: { name: 'Camphor', icon: '🌲', basePrice: 210, weight: 1 },
  gold_dust: { name: 'Gold Dust', icon: '✨', basePrice: 300, weight: 1 },
  bezoar: { name: 'Bezoar Stones', icon: '💎', basePrice: 340, weight: 1 }
};

// ---------------------------------------------------------------------------
// PARTY — ported straight from your table. San is always active; everyone
// else unlocks when you defeat the guardian holding them (see PORTS above).
// Soel unlocks by LEVEL, same as the source game, since he's a spiritual
// familiar rather than someone held captive.
// ---------------------------------------------------------------------------
const ALL_PARTY = [
  {id:'san',        name:'SAN',        role:'Captain / Sorcerer',    combatRole:'Caster',   hp:82, mp:100, portrait:'🧙‍♀️', portraitAsset:'assets/portraits/san.png', desc:"The captain. Wields arcane fire she's still learning to trust."},
  {id:'joel',        name:'JOEL',       role:'First Mate',            combatRole:'Tank',     hp:95, mp:0,   portrait:'⚔️', portraitAsset:'assets/portraits/joel.png', desc:'First mate. Guards the crew with unwavering resolve.'},
  {id:'aisyah',      name:'AISYAH',     role:'Quartermaster',         combatRole:'Rogue',    hp:74, mp:0,   portrait:'🗡️', portraitAsset:'assets/portraits/aisyah.png', desc:'Quartermaster. Knows every port and every bad deal in it.'},
  {id:'eliz',        name:'ELIZ',       role:'Ship Healer',           combatRole:'Healer',   hp:65, mp:120, portrait:'💚', portraitAsset:'assets/portraits/eliz.png', desc:'Ship healer. Mends wounds with light and stubbornness.'},
  {id:'mezstorm',    name:'MEZSTORM',   role:'Storm Caller',          combatRole:'Caster',   hp:75, mp:110, portrait:'🌀', portraitAsset:'assets/portraits/mezstorm.png', desc:'Storm caller. Commands wind and lightning at sea.'},
  {id:'senedra',     name:'SENEDRA',    role:'Lookout',               combatRole:'Ranged',   hp:70, mp:0,   portrait:'🎯', portraitAsset:'assets/portraits/senedra.png', desc:'Lookout. Her eye spots trouble before it spots you.'},
  {id:'zaki',        name:'ZAKI',       role:'Boarding Fighter',      combatRole:'Melee',    hp:88, mp:0,   portrait:'💥', portraitAsset:'assets/portraits/zaki.png', desc:'Boarding fighter. Fearless in close-quarters combat.'},
  {id:'ser_aldric',  name:'SER ALDRIC', role:'Knight of the Waves',   combatRole:'Tank',     hp:90, mp:0,   portrait:'🛡️', portraitAsset:'assets/portraits/aldric.png', desc:'Knight of the waves. A living fortress on deck.'},
  {id:'sister_wren', name:'SISTER WREN',role:'Tide Priestess',        combatRole:'Healer',   hp:72, mp:0,   portrait:'🙏', portraitAsset:'assets/portraits/wren.png', desc:'Tide priestess. Purifies curses and heals the soul.'},
  {id:'soel',        name:'SOEL',       role:'Spirit Cat',            combatRole:'Support',  hp:50, mp:0,   portrait:'🐾', portraitAsset:'assets/portraits/soel.png', desc:"The ship's cat. Chose San, and can't be unchosen. Unkillable — he reforms from spirit flame."},
  // Arc IV recruits — unlocked via game.foundCompanions, same as every
  // earlier companion, set the moment their introducing chapter is marked
  // read (see markArc4ChapterRead's recruitment hook).
  {id:'iris',        name:'IRIS',       role:'Scout / Kindled',       combatRole:'Rogue',    hp:72, mp:0,   portrait:'🦊', portraitAsset:'assets/portraits/iris.png', desc:'Scout, travelling with Ash. Quick hands, quicker instincts.'},
  {id:'kw_liang',    name:'KW LIANG',   role:'Scout',                 combatRole:'Ranged',   hp:70, mp:0,   portrait:'🐇', portraitAsset:'assets/portraits/kw_liang.png', desc:'Watches the port from the high ground. Rarely misses.'},
  {id:'dr_aa',       name:'DR. AA',     role:'Physician / Healer',    combatRole:'Healer',   hp:70, mp:110, portrait:'🩺', portraitAsset:'assets/portraits/dr_aa.png', desc:'Physician with a reputation that travels further than he does.'},
  {id:'mimi',        name:'MIMI',       role:'Diviner',               combatRole:'Caster',   hp:68, mp:115, portrait:'🔮', portraitAsset:'assets/portraits/mimi.png', desc:'Diviner. Reads the tide for what it remembers and what it hides.'},
  {id:'brada_shah',  name:'BRADA SHAH', role:'Bard (Support)',        combatRole:'Support',  hp:78, mp:60,  portrait:'🎵', portraitAsset:'assets/portraits/brada_shah.png', desc:"Mimi's partner. Songs, strategy, and steadier ground."},
  // Arc V recruit — unlocked via game.foundCompanions, same mechanism as
  // every earlier companion (see markArc5ChapterRead's recruitment hook).
  {id:'renn',        name:'RENN',       role:'Arcane Trickster',      combatRole:'Caster',   hp:70, mp:120, portrait:'🔮', portraitAsset:'assets/portraits/renn.png', desc:'A curious, mischievous mage who treats sailing as one enormous magical experiment.'},
  // Arc VII recruit — unlocked via game.foundCompanions, same mechanism as
  // every earlier companion (see ARC7_RECRUITS / markArc7ChapterRead's
  // recruitment hook, Ch.23). Sturdier than Mimi/Renn by design (he's an
  // adult researcher, not thrown into the same fragile-caster mold) —
  // lower MP pool fits his lighter 12-22 mp spell costs vs. their 9-18.
  {id:'erynn',       name:'ERYNN',      role:'Farseer Descendant',    combatRole:'Support',  hp:85, mp:90,  portrait:'🧭', portraitAsset:'assets/portraits/erynn.png', desc:'Descendant of Varel Farseer. Generations of documented weaknesses mean he rarely has to guess.'}
];
function memberUnlocked(m){
  if (m.id === 'san') return true;
  if (m.id === 'soel') return level() >= 10;
  if (m.id === 'ser_aldric' || m.id === 'sister_wren') return !!game.finalCleared;
  return !!game.foundCompanions[m.id];
}
function getActiveParty(){ return ALL_PARTY.filter(memberUnlocked); }
// Eliz and Soel are narratively unkillable — damage still lands, it just
// can't take them below 1 HP, same rule as the source game.
const UNKILLABLE_IDS = new Set(['eliz','soel']);

// ---------------------------------------------------------------------------

// ============================================================================
// EQUIPMENT — Crimson Tide gear layer
// The slot model and role restrictions mirror the Aethon Codex system:
// weapon + armor are role-restricted; head/hands/feet/rings/amulet are open.
// Trader names and core item names are recycled from the established Daybreak/
// Aethon Codex implementation rather than invented NPC identities.
// ============================================================================
const GEAR_SLOTS = ['weapon','head','armor','hands','feet','ring1','ring2','amulet'];

const GEAR_ROLE_RULES = {
  san:         {weapon:['san_focus'], armor:['robe'], label:'Arcane focus / Robes'},
  joel:        {weapon:['shield','sword','any'], armor:['heavy'], label:'Shield / Heavy Armor'},
  aisyah:      {weapon:['dagger','any'], armor:['light'], label:'Dagger / Light Armor'},
  mezstorm:    {weapon:['staff','san_focus','any'], armor:['robe'], label:'Staff / Robes'},
  eliz:        {weapon:['mace','any'], armor:['robe'], label:'Mace / Robes'},
  senedra:     {weapon:['bow','any'], armor:['light'], label:'Bow / Light Armor'},
  zaki:        {weapon:['sword','any'], armor:['heavy'], label:'Sword / Heavy Armor'},
  ser_aldric:  {weapon:['sword','knight_lance','any'], armor:['heavy'], label:"Knight / Heavy Armor"},
  sister_wren: {weapon:['wren_censer','any'], armor:['robe'], label:"Censer / Robes"},
  soel:        {weapon:['charm','any'], armor:['fur'], hidden:['head','hands','feet','ring2'], labels:{amulet:'Collar',ring1:'Blessing'}, label:'Spirit Charm / Warded Fur'},
  mimi:        {weapon:['san_focus','any'], armor:['robe'], label:'Focus / Robes'},
  brada_shah: {weapon:['moon_lute','any'], armor:['light','heavy'], label:'Moon Lute / Armor'},
  kw_liang:   {weapon:['bow','any'], armor:['light'], label:'Bow / Light Armor'},
  dr_aa:      {weapon:['staff','mace','any'], armor:['robe'], label:'Medical Kit / Coat'},
  iris:       {weapon:['dagger','any'], armor:['light'], label:'Knives / Light Armor'},
  renn:       {weapon:['staff','any'], armor:['robe'], label:'Staff / Robes'},
  // Astrolabe, not staff — a Farseer researcher's tool (navigation,
  // documentation, measurement), distinct from Renn's/Mimi's/San's
  // spellcasting foci. Robe or light armor: sturdier than the pure casters
  // per the brainstorm, but still not built for melee.
  erynn:      {weapon:['astrolabe','any'], armor:['robe','light'], label:'Astrolabe / Robes'},
};

const EQUIPMENT_CATALOG = [
  {id:'traveler_charm', name:'Traveler Charm', icon:'🧿', slot:'amulet', family:'any', hp:3, price:40, tier:1, trader:'Lewis', desc:'A small charm carried by travelers.'},
  {id:'flaming_longsword', name:'Flaming Longsword', icon:'⚔️', slot:'weapon', family:'any', atk:8, fireDmg:4, price:120, tier:1, trader:'Ribald', desc:'A longsword wreathed in controlled flame.'},
  {id:'cloak_of_protection', name:'Cloak of Protection', icon:'🛡️', slot:'armor', family:'any', defense:4, wis:2, price:150, tier:1, trader:'Ribald', desc:'Protective enchanted armor.'},
  {id:'ring_of_wizardry', name:'Ring of Wizardry', icon:'💍', slot:'ring1', family:'any', magic:4, mpRegen:3, price:300, tier:2, trader:'Ribald', desc:'A ring that strengthens spellcasters.'},
  {id:'rodofthe_resurrection', name:'Rod of Resurrection', icon:'✨', slot:'amulet', family:'any', magic:4, price:250, tier:2, trader:'Ribald', effect:'revive', desc:'Revives a fallen ally with 75% HP.'},
  {id:'joels_bulwark', name:"Joel's Bulwark", icon:'🛡️', slot:'weapon', family:'any', defense:3, hp:20, price:80, tier:1, trader:'Ribald', forCompanion:'Joel', desc:'+3 DEF, +20 HP. Forged for The Steadfast.'},
  {id:'aisyahs_twin_blades', name:"Aisyah's Twin Blades", icon:'🗡️', slot:'weapon', family:'any', atk:3, spd:2, price:80, tier:1, trader:'Ribald', forCompanion:'Aisyah', desc:'+3 ATK, +2 SPD. Matched daggers.'},

  {id:'frostbrand', name:'Frostbrand', icon:'🗡️', slot:'weapon', family:'any', atk:10, iceDmg:5, price:200, tier:2, trader:'Deidre', desc:'A weapon carrying a biting frost.'},
  {id:'icingdeath_scimitar', name:'Icingdeath Scimitar', icon:'⚔️', slot:'weapon', family:'any', atk:12, dex:3, iceDmg:4, price:350, tier:2, trader:'Deidre', desc:'A rare scimitar with an icy edge.'},
  {id:'belt_hill_giant', name:'Belt of Hill Giant Strength', icon:'🪢', slot:'amulet', family:'any', str:4, con:2, price:250, tier:2, trader:'Deidre', desc:'A strength-enhancing belt.'},
  {id:'eliz_serenity_orb', name:"Eliz's Serenity Orb", icon:'🔮', slot:'amulet', family:'any', defense:2, hp:15, price:120, tier:2, trader:'Deidre', forCompanion:'Eliz', desc:'+2 DEF, +15 HP. Enhances healing.'},
  {id:'zaki_temper_band', name:"Zaki's Temper Band", icon:'💍', slot:'ring1', family:'any', atk:3, defense:1, price:75, tier:2, trader:'Deidre', forCompanion:'Zaki', desc:'+3 ATK, +1 DEF. Fuels rage.'},

  {id:'gnome_hooked_hammer', name:'Gnome Hooked Hammer', icon:'🔨', slot:'weapon', family:'any', atk:6, str:1, price:80, tier:1, trader:'Nym', desc:'A compact quartermaster hammer.'},
  {id:'leather_armor_plus1', name:'Leather Armor +1', icon:'🛡️', slot:'armor', family:'light', defense:4, dex:1, price:90, tier:1, trader:'Nym', desc:'Light armor improved beyond the ordinary.'},
  {id:'gnomish_goggles', name:'Gnomish Goggles', icon:'🥽', slot:'head', family:'any', int:2, critChance:.05, price:120, tier:2, trader:'Nym', desc:'Tiny lenses designed to spot weaknesses.'},
  {id:'mezstorm_conduit', name:"Mezstorm's Conduit", icon:'⚡', slot:'amulet', family:'any', atk:2, hp:15, price:90, tier:2, trader:'Nym', forCompanion:'Mezstorm', desc:'+2 ATK, +15 HP. Channels storm energy.'},
  {id:'senedra_hawkeye_lens', name:"Senedra's Hawkeye Lens", icon:'🔭', slot:'ring1', family:'any', atk:2, spd:2, price:85, tier:2, trader:'Nym', forCompanion:'Senedra', desc:'+2 ATK, +2 SPD. Sees weakness.'},

  {id:'bulwark_steadfast', name:'Bulwark of the Steadfast', icon:'🛡️', slot:'weapon', family:'any', atk:10, defense:22, price:480, tier:3, trader:'Farrow', forCompanion:'Joel', desc:'+10 ATK, +22 DEF.'},
  {id:'steadfast_bulwark', name:"Steadfast's Bulwark", icon:'🛡️', slot:'armor', family:'heavy', defense:22, price:450, tier:3, trader:'Farrow', forCompanion:'Joel', desc:'+22 DEF.'},
  {id:'sisterblades_edge', name:"Sisterblade's Edge", icon:'🗡️', slot:'weapon', family:'any', atk:22, spd:12, price:480, tier:3, trader:'Farrow', forCompanion:'Aisyah', desc:'+22 ATK, +12 SPD.'},
  {id:'sisterblades_wraps', name:"Sisterblade's Wraps", icon:'🥋', slot:'armor', family:'light', defense:16, spd:6, price:450, tier:3, trader:'Farrow', forCompanion:'Aisyah', desc:'+16 DEF, +6 SPD.'},

  {id:'last_word', name:'The Last Word', icon:'🪄', slot:'weapon', family:'any', atk:20, magic:6, price:4500, tier:5, trader:'Vessa', desc:'A legendary staff carved from something that used to argue back.'},
  {id:'vessas_ward', name:"Vessa's Ward", icon:'🛡️', slot:'armor', family:'any', defense:18, wis:5, price:4200, tier:5, trader:'Vessa', desc:'Armor that has never once failed to earn its price back.'},
  {id:'crown_hoardkeeper', name:'Crown of the Hoardkeeper', icon:'👑', slot:'head', family:'any', defense:10, magic:4, atk:4, price:3800, tier:5, trader:'Vessa', desc:"Every gem in it was once someone else's prized possession."},
  {id:'gauntlets_unshaken', name:'Gauntlets of the Unshaken', icon:'🥊', slot:'hands', family:'any', atk:10, defense:6, price:3600, tier:5, trader:'Vessa', desc:'Hands that have counted more gold than most kingdoms hold.'},
  {id:'striders_last_mile', name:'Striders of the Last Mile', icon:'🥾', slot:'feet', family:'any', spd:10, defense:4, price:3600, tier:5, trader:'Vessa', desc:'Boots for a road that never quite ends.'},
  {id:'hoarders_signet', name:"The Hoarder's Signet", icon:'💍', slot:'ring1', family:'any', atk:8, defense:8, goldFind:.15, price:3400, tier:5, trader:'Vessa', desc:'A signet that seems to make the gold listen.'},
  {id:'heart_hoard', name:'Heart of the Hoard', icon:'💎', slot:'amulet', family:'any', atk:8, defense:8, magic:4, wis:4, price:4800, tier:5, trader:'Vessa', desc:"At the center of every great hoard, there is one piece that isn't for sale. This is someone else's."},
  {id:'joels_aegis_eternal', name:"Joel's Aegis Eternal", icon:'🛡️', slot:'weapon', family:'any', atk:8, defense:16, hp:40, price:3200, tier:5, trader:'Vessa', forCompanion:'Joel', desc:'+8 ATK, +16 DEF, +40 HP.'}
,
  // GEAR_ROLE_RULES.erynn lists 'astrolabe' as his weapon family — same gap
  // Brada's moon_lute had before it got an item (see brada_moonlit_pipa
  // above). Tier 5/Vessa rather than Brada's tier 3/Ferris, since Erynn
  // joins in Arc VII, not Arc IV — stats lean into "sturdier support,"
  // not a glass-cannon nuker's.
  {id:'farseers_astrolabe', name:"The Farseer's Astrolabe", icon:'🧭', slot:'weapon', family:'astrolabe', atk:10, magic:14, hp:20, price:4200, tier:5, trader:'Vessa', forCompanion:'Erynn', desc:"Erynn's brass astrolabe, passed down through five generations of Farseers. +10 ATK, +14 MAG, +20 HP."}
,
  {id:'aldric_oath_ring', name:"The Other Kind of Found's Oath Ring", icon:'💍', slot:'ring1', family:'any', defense:14, hp:20, price:650, tier:3, trader:'Ferris', forCompanion:'Ser Aldric', desc:'Ring for Ser Aldric. +14 DEF, +20 HP.'},
  {id:'mimi_dreamsight_locket', name:'Dreamsight Locket', icon:'🔮', slot:'amulet', family:'any', atk:12, spd:6, price:650, tier:3, trader:'Ferris', forCompanion:'Mimi', desc:'Amulet for Mimi. +12 ATK, +6 SPD.'},
  {id:'brada_resonance_charm', name:'Resonance Charm', icon:'🎼', slot:'amulet', family:'any', atk:8, defense:6, hp:15, price:700, tier:3, trader:'Ferris', forCompanion:'Brada Shah', desc:'Amulet for Brada Shah. +8 ATK, +6 DEF, +15 HP.'},
  // GEAR_ROLE_RULES.brada_shah lists 'moon_lute' as his weapon family, but no
  // item of that family existed anywhere in the catalog — his weapon slot was
  // silently falling back to 'any' only. This is his round-bodied lute (a
  // yueqin / "moon guitar"), giving that family an actual item to equip.
  {id:'brada_moonlit_pipa', name:'Moonlit Pipa', icon:'🪕', slot:'weapon', family:'moon_lute', atk:14, spd:8, hp:10, price:700, tier:3, trader:'Ferris', forCompanion:'Brada Shah', desc:"Brada Shah's round-bodied moon lute. +14 ATK, +8 SPD, +10 HP."},
  // Brada's armor slot only ever had generic light/heavy armor to fall
  // back on — this is his own piece, completing weapon+armor+amulet.
  {id:'brada_performers_coat', name:"Performer's Traveling Coat", icon:'🧥', slot:'armor', family:'light', defense:14, spd:8, hp:10, price:700, tier:3, trader:'Ferris', forCompanion:'Brada Shah', desc:"Brada Shah's road-worn stage coat — more pockets than pageantry. +14 DEF, +8 SPD, +10 HP."},
  {id:'dr_aa_steady_gloves', name:"Steady Hands' Gloves", icon:'🧤', slot:'hands', family:'any', atk:10, defense:8, price:650, tier:3, trader:'Ferris', forCompanion:'Dr. AA', desc:"Gloves for Dr. AA. +10 ATK, +8 DEF."},
  {id:'wren_circlet', name:'Circlet of Intercession', icon:'👑', slot:'head', family:'any', defense:12, hp:18, price:650, tier:3, trader:'Ferris', forCompanion:'Sister Wren', desc:'Circlet for Sister Wren. +12 DEF, +18 HP.'},
  {id:'kw_quick_boots', name:"Quick Hands' Boots", icon:'🥾', slot:'feet', family:'light', spd:12, defense:6, price:650, tier:3, trader:'Ferris', forCompanion:'KW Liang', desc:"Boots for KW Liang. +12 SPD, +6 DEF."},
  {id:'iris_ash_claw', name:"Ash's Claw", icon:'💍', slot:'ring1', family:'any', atk:10, spd:8, price:650, tier:3, trader:'Ferris', forCompanion:'Iris', desc:'Ring for Iris. +10 ATK, +8 SPD.'},
  {id:'renn_spectacles', name:'Centuries-Worn Spectacles', icon:'👓', slot:'head', family:'any', atk:8, defense:8, hp:10, price:650, tier:3, trader:'Ferris', forCompanion:'Renn', desc:'Spectacles for Renn. +8 ATK, +8 DEF, +10 HP.'},
  // GEAR_ROLE_RULES.renn lists 'staff' as his weapon family (same gap
  // brada_moonlit_pipa fixed for moon_lute) — no item of that family
  // existed anywhere in the catalog for him specifically.
  {id:'renn_tidereaders_wand', name:"Tidereader's Wand", icon:'🪄', slot:'weapon', family:'staff', atk:10, magic:14, hp:10, price:700, tier:3, trader:'Ferris', forCompanion:'Renn', desc:"Renn's wind-carved wand, still humming faintly with borrowed currents. +10 ATK, +14 MAG, +10 HP."},

  // Robe & heavy-armor progression. Previously the ONLY items in these two
  // families were free starter pieces (one each) plus a single tier-3 heavy
  // item for Joel — meaning San (armor:['robe'], no 'any' fallback) and
  // every other robe/heavy-restricted character had zero possible armor
  // upgrades for the entire rest of the game, no matter their level or
  // gold. These are general (no forCompanion) so any character whose
  // GEAR_ROLE_RULES allows that family can equip them.
  {id:'apprentice_robe', name:"Apprentice's Robe", icon:'🥋', slot:'armor', family:'robe', defense:6, magic:2, price:55, tier:1, trader:'Lewis', desc:'+6 DEF, +2 MAG. A step up from threadbare.'},
  {id:'recruits_plate', name:"Recruit's Plate", icon:'🛡️', slot:'armor', family:'heavy', defense:6, price:55, tier:1, trader:'Lewis', desc:'+6 DEF. Standard-issue, but sturdier than nothing.'},
  {id:'focus_robe', name:'Robe of Deep Focus', icon:'🥋', slot:'armor', family:'robe', defense:10, magic:5, mpRegen:2, price:170, tier:2, trader:'Ribald', desc:'+10 DEF, +5 MAG, +2 MP regen.'},
  {id:'hardened_cuirass', name:'Hardened Cuirass', icon:'🛡️', slot:'armor', family:'heavy', defense:11, hp:10, price:170, tier:2, trader:'Ribald', desc:'+11 DEF, +10 HP.'},
  {id:'tidecallers_vestment', name:"Tidecaller's Vestment", icon:'🥋', slot:'armor', family:'robe', defense:16, magic:9, price:430, tier:3, trader:'Farrow', desc:'+16 DEF, +9 MAG.'},
  {id:'bulwark_of_the_line', name:'Bulwark of the Line', icon:'🛡️', slot:'armor', family:'heavy', defense:20, hp:15, price:420, tier:3, trader:'Farrow', desc:'+20 DEF, +15 HP.'},
  {id:'robe_of_vecna', name:'Robe of Vecna', icon:'🥋', slot:'armor', family:'robe', defense:26, magic:16, hp:15, price:4300, tier:5, trader:'Vessa', desc:'+26 DEF, +16 MAG, +15 HP. Old robes, carried from a world with a different name for magic like this. Something in the weave still remembers.'},
  {id:'platemail_unbroken', name:'Platemail of the Unbroken', icon:'🛡️', slot:'armor', family:'heavy', defense:32, hp:40, price:4400, tier:5, trader:'Vessa', desc:"+32 DEF, +40 HP. Dented, re-forged, dented again. Never once failed to get its wearer home."}
];


// Complete starter/signature equipment coverage.
// These names and core stats are recycled from the actual Daybreak game.js where
// defined; Soel receives a Crimson Tide-specific spirit-collar adaptation because
// the Daybreak source treats him as an unkillable familiar rather than a normal
// humanoid equipment user.
const CRIMSON_STARTER_GEAR = {
  san: {
    weapon:{name:'Apprentice Staff',icon:'🪄',slot:'weapon',family:'san_focus',atk:2,magic:1,price:0,desc:'A worn wooden staff crackling with faint arcane energy.'},
    armor:{name:'Novice Robes',icon:'🥋',slot:'armor',family:'robe',defense:2,magic:1,price:0,desc:'Threadbare robes stained with old spell components.'}
  },
  joel: {
    weapon:{name:'Joel’s Bulwark',icon:'🛡️',slot:'weapon',family:'shield',atk:0,defense:3,hp:20,price:0,desc:'Shield for Joel. +3 DEF, +20 HP.'},
    armor:{name:'Steadfast’s Bulwark',icon:'🛡️',slot:'armor',family:'heavy',defense:22,price:0,desc:'Heavy armor for Joel. +22 DEF.'}
  },
  aisyah: {
    weapon:{name:"Sisterblade's Edge",icon:'🗡️',slot:'weapon',family:'dagger',atk:22,spd:12,price:0,desc:'Dagger for Aisyah. +22 ATK, +12 SPD.'},
    armor:{name:"Sisterblade's Wraps",icon:'🥋',slot:'armor',family:'light',defense:16,spd:6,price:0,desc:'Light armor for Aisyah. +16 DEF, +6 SPD.'}
  },
  mezstorm: {
    weapon:{name:"Stormsinger's Rod",icon:'🪄',slot:'weapon',family:'staff',atk:18,spd:8,price:0,desc:'Staff for Mezstorm. +18 ATK, +8 SPD.'},
    armor:{name:"Lightweaver's Vestment",icon:'🥋',slot:'armor',family:'robe',defense:12,atk:8,price:0,desc:'Robes for Mezstorm. +12 DEF, +8 ATK.'}
  },
  eliz: {
    weapon:{name:"Healer's Resolve",icon:'⚕️',slot:'weapon',family:'mace',atk:14,defense:10,price:0,desc:'Mace for Eliz. +14 ATK, +10 DEF.'},
    armor:{name:"Lightweaver's Vestment",icon:'🥋',slot:'armor',family:'robe',defense:12,atk:8,price:0,desc:'Robes for Eliz. +12 DEF, +8 ATK.'}
  },
  senedra: {
    weapon:{name:"Scout's Recurve",icon:'🏹',slot:'weapon',family:'bow',atk:22,spd:10,price:0,desc:'Bow for Senedra. +22 ATK, +10 SPD.'},
    armor:{name:'Shadowstep Leathers',icon:'🥋',slot:'armor',family:'light',defense:16,spd:6,price:0,desc:'Light armor for Senedra. +16 DEF, +6 SPD.'}
  },
  zaki: {
    weapon:{name:'Iron Discipline',icon:'⚔️',slot:'weapon',family:'sword',atk:22,defense:8,price:0,desc:'Sword for Zaki. +22 ATK, +8 DEF.'},
    armor:{name:"Steadfast's Bulwark",icon:'🛡️',slot:'armor',family:'heavy',defense:22,price:0,desc:'Heavy armor for Zaki. +22 DEF.'}
  },
  soel: {
    weapon:{name:'Spirit Vigil Talisman',icon:'🔮',slot:'weapon',family:'charm',atk:14,spd:10,price:0,desc:'Spirit charm for Soel. +14 ATK, +10 SPD.'},
    armor:{name:'Spirit-Flame Coat',icon:'🐾',slot:'armor',family:'fur',defense:14,spd:6,price:0,desc:'Warded spirit-fur protection. +14 DEF, +6 SPD.'},
    amulet:{name:'Collar of the Space Between',icon:'🐾',slot:'amulet',family:'charm',defense:12,atk:10,price:0,desc:'Soel’s spirit collar. +12 DEF, +10 ATK.'}
  },
  ser_aldric: {
    weapon:{name:"The Other Kind of Found's Blade",icon:'⚔️',slot:'weapon',family:'sword',atk:20,defense:14,price:0,desc:'Sword for Ser Aldric. +20 ATK, +14 DEF.'},
    armor:{name:"Knight's Unbroken Plate",icon:'🛡️',slot:'armor',family:'heavy',defense:26,price:0,desc:'Heavy plate for Ser Aldric. +26 DEF.'}
  },
  sister_wren: {
    weapon:{name:'Temple-Blessed Censer',icon:'🕯️',slot:'weapon',family:'wren_censer',atk:12,defense:12,price:0,desc:'Censer for Sister Wren. +12 ATK, +12 DEF.'},
    armor:{name:'Vestments of Intercession',icon:'🥋',slot:'armor',family:'robe',defense:20,price:0,desc:'Sacred vestments for Sister Wren. +20 DEF.'}
  }
};

function seedCompleteStarterGear() {
  migrateEquipmentState();
  for (const [memberId, slots] of Object.entries(CRIMSON_STARTER_GEAR)) {
    if (!game.equippedGear[memberId]) game.equippedGear[memberId] = {};
    for (const [slot, item] of Object.entries(slots)) {
      // Add only missing slots. Never overwrite a player's existing equipment.
      if (!game.equippedGear[memberId][slot]) {
        game.equippedGear[memberId][slot] = {...item, id:`starter_${memberId}_${slot}`, tier:1};
      }
    }
  }
}

function gearBonuses(memberId) {
  const eq = (game.equippedGear && game.equippedGear[memberId]) || {};
  const out = {atk:0, defense:0, hp:0, magic:0, spd:0, mp:0};
  Object.values(eq).forEach(item => {
    if (!item) return;
    out.atk += Number(item.atk || 0);
    out.defense += Number(item.defense || item.def || 0);
    out.hp += Number(item.hp || 0);
    out.magic += Number(item.magic || item.int || 0);
    out.spd += Number(item.spd || 0);
    out.mp += Number(item.mp || 0);
  });
  return out;
}

function gearSummaryText(memberId) {
  const b = gearBonuses(memberId);
  const bits = [];
  if (b.atk) bits.push(`ATK +${b.atk}`);
  if (b.defense) bits.push(`DEF +${b.defense}`);
  if (b.hp) bits.push(`HP +${b.hp}`);
  if (b.magic) bits.push(`MAG +${b.magic}`);
  if (b.spd) bits.push(`SPD +${b.spd}`);
  if (b.mp) bits.push(`MP +${b.mp}`);
  return bits.length ? bits.join(' · ') : 'No gear bonuses';
}

const EQUIPMENT_TRADERS = [
  {id:'lewis', name:'Lewis', title:'Wandering Merchant', zone:'Whispering Woods', minLevel:1,
   greeting:'Lewis has a few practical pieces to get a voyage started.', stock:['traveler_charm','apprentice_robe','recruits_plate']},
  {id:'ribald', name:'Ribald', title:'Adventurers Mart', zone:'Cursed Catacombs', minLevel:2,
   greeting:'Ribald opens a case of equipment that has seen blood.', stock:['flaming_longsword','cloak_of_protection','ring_of_wizardry','rodofthe_resurrection','joels_bulwark','aisyahs_twin_blades','focus_robe','hardened_cuirass']},
  {id:'nym', name:'Nym', title:'Targos Quartermaster', zone:'Stormhold', minLevel:5,
   greeting:"Nym's prices are fair. His jokes are not.", stock:['gnome_hooked_hammer','leather_armor_plus1','gnomish_goggles','mezstorm_conduit','senedra_hawkeye_lens']},
  {id:'deidre', name:'Deidre', title:'Exotic Wares', zone:'Frostspire Ruins', minLevel:6,
   greeting:'Deidre deals in the extraordinary — especially anything with a little frost on it.', stock:['frostbrand','icingdeath_scimitar','belt_hill_giant','eliz_serenity_orb','zaki_temper_band']},
  {id:'farrow', name:'Farrow', title:'The Reclaimer', zone:'The Static Fields', minLevel:26,
   greeting:'Farrow rebuilds gear from whatever the road leaves behind.', stock:['bulwark_steadfast','steadfast_bulwark','sisterblades_edge','sisterblades_wraps','tidecallers_vestment','bulwark_of_the_line']},
  {id:'ferris', name:'Ferris', title:'The Quartermaster', zone:'The Breaking', minLevel:30,
   greeting:'Ferris keeps a ledger for the crew members who never seem to get a full rack of gear. He finally has something for the wider roster.',
   stock:['aldric_oath_ring','mimi_dreamsight_locket','brada_resonance_charm','brada_moonlit_pipa','brada_performers_coat','dr_aa_steady_gloves','wren_circlet','kw_quick_boots','iris_ash_claw','renn_spectacles','renn_tidereaders_wand']},
  {id:'vessa', name:'Vessa', title:'The Hoardkeeper', zone:"The Architect's Chamber", minLevel:43,
   greeting:"Vessa deals in nothing less than legendary. A hoard this size doesn't build itself from common finds.", stock:['last_word','vessas_ward','crown_hoardkeeper','gauntlets_unshaken','striders_last_mile','hoarders_signet','heart_hoard','joels_aegis_eternal','robe_of_vecna','platemail_unbroken','farseers_astrolabe']}
];

function normalizeGearItem(item) {
  if (!item) return null;
  const copy = {...item};
  if (copy.slot === 'ring') copy.slot = 'ring1';
  if (copy.slot === 'accessory') copy.slot = copy.name === 'Girdle of Hill Giant Strength' ? 'amulet' : 'amulet';
  return copy;
}

function gearMemberRules(memberId) {
  return GEAR_ROLE_RULES[memberId] || {weapon:['any'], armor:['any'], label:'General'};
}

function gearSlotLabel(memberId, slot) {
  const rules = gearMemberRules(memberId);
  if (rules.labels && rules.labels[slot]) return rules.labels[slot];
  return ({
    weapon:'Weapon', head:'Head', armor:'Armor', hands:'Hands', feet:'Feet',
    ring1:'Ring I', ring2:'Ring II', amulet:'Amulet'
  })[slot] || slot;
}

function gearCanEquip(memberId, item) {
  if (!item || !item.slot) return false;
  const rules = gearMemberRules(memberId);
  if (rules.hidden && rules.hidden.includes(item.slot)) return false;
  // Ownership check must run before the ring/amulet/head/hands/feet early
  // return below — otherwise every companion-specific accessory (rings,
  // amulets, head/hand/foot gear) is equippable by anyone, since only
  // weapon/armor slots ever reached this check.
  if (item.forCompanion && item.forCompanion !== 'any' && item.forCompanion.toLowerCase().replace(/[^a-z]/g,'') !== memberId.toLowerCase().replace(/[^a-z]/g,'')) return false;
  if (item.slot === 'ring1' || item.slot === 'ring2' || item.slot === 'amulet' ||
      item.slot === 'head' || item.slot === 'hands' || item.slot === 'feet') return true;
  if (item.slot === 'weapon') return (rules.weapon || ['any']).includes('any') || (rules.weapon || []).includes(item.family);
  if (item.slot === 'armor') return (rules.armor || ['any']).includes('any') || (rules.armor || []).includes(item.family);
  return false;
}

function gearItemStats(item) {
  if (!item) return '';
  const bits = [];
  if (item.atk) bits.push(`ATK +${item.atk}`);
  if (item.magic) bits.push(`MAG +${item.magic}`);
  if (item.defense) bits.push(`DEF +${item.defense}`);
  if (item.hp) bits.push(`HP +${item.hp}`);
  if (item.mp) bits.push(`MP +${item.mp}`);
  return bits.join(' · ') || 'No direct combat bonus';
}

function addGearToInventory(item) {
  if (!game.equipmentInventory) game.equipmentInventory = [];
  game.equipmentInventory.push({...item});
}

function gearDisplayItem(item) {
  const c = EQUIPMENT_CATALOG.find(x => x.id === item.id || x.name === item.name);
  return c ? {...c, ...item} : item;
}

function buyEquipment(traderId, itemId) {
  const trader = EQUIPMENT_TRADERS.find(t => t.id === traderId);
  const item = EQUIPMENT_CATALOG.find(i => i.id === itemId);
  if (!trader || !item) return;
  if (level() < trader.minLevel) { toast(`Requires Level ${trader.minLevel}.`); return; }
  if (game.gold < item.price) { toast('Not enough gold.'); return; }
  game.gold -= item.price;
  addGearToInventory(item);
  logEvent(`🛒 Bought ${item.name} from ${trader.name}.`, 'good');
  saveGame();
  renderEquipment();
  updateUI();
  toast(`${item.icon} ${item.name} added to gear.`);
}

// Sell unequipped gear for gold — half the trader price, matching the
// existing sellGood() convention for cargo. To sell an equipped item,
// unequip it first (unequipGear already returns it to this same
// inventory list), same two-step flow the game already uses elsewhere.
function sellGearItem(invIndex) {
  const raw = game.equipmentInventory[invIndex];
  if (!raw) return;
  const item = gearDisplayItem(raw);
  const price = Math.round((item.price || 0) * 0.5);
  game.equipmentInventory.splice(invIndex, 1);
  game.gold = (game.gold || 0) + price;
  logEvent(`💰 Sold ${item.name} for ${price}g.`, 'good');
  toast(`💰 Sold ${item.name} for ${price}g.`);
  saveGame();
  renderEquipment();
}
// Sells every copy of a given item currently unequipped — the direct fix
// for duplicate loot (e.g. two of the same ring) cluttering the list as
// separate identical rows with no easy way to clear the surplus at once.
// Takes an inventory index (not a name) specifically so item names with
// an apostrophe — "Zaki's Tempered Band" — never have to pass through an
// onclick string attribute.
function sellAllOfGearItem(invIndex) {
  const ref = game.equipmentInventory[invIndex];
  if (!ref) return;
  const refItem = gearDisplayItem(ref);
  const matchKey = refItem.id || refItem.name;
  let total = 0, count = 0;
  for (let i = game.equipmentInventory.length - 1; i >= 0; i--) {
    const item = gearDisplayItem(game.equipmentInventory[i]);
    if ((item.id || item.name) === matchKey) {
      total += Math.round((item.price || 0) * 0.5);
      game.equipmentInventory.splice(i, 1);
      count++;
    }
  }
  if (!count) return;
  game.gold = (game.gold || 0) + total;
  logEvent(`💰 Sold ${count}x ${refItem.name} for ${total}g.`, 'good');
  toast(`💰 Sold ${count}x ${refItem.name} for ${total}g.`);
  saveGame();
  renderEquipment();
}

function equipGear(memberId, invIndex) {
  const item = gearDisplayItem(game.equipmentInventory[invIndex]);
  if (!item) return;
  if (!memberUnlocked(ALL_PARTY.find(m=>m.id===memberId) || {id:memberId})) {
    toast('That crew member has not joined yet.');
    return;
  }
  if (!gearCanEquip(memberId, item)) {
    toast(`${item.name} cannot be equipped by ${memberId.replace('_',' ')}.`);
    return;
  }
  if (!game.equippedGear) game.equippedGear = {};
  if (!game.equippedGear[memberId]) game.equippedGear[memberId] = {};
  // BUG FIX: this used to also have a `ring1`-specific block above this line
  // that re-checked `item.slot === 'ring1' && game.equippedGear[memberId].ring1`
  // and pushed that same item back to inventory — but `slot` here was always
  // just `item.slot` anyway (the ternary that set it was a no-op), so for any
  // ring1-for-ring1 swap this general check below was pushing the exact same
  // already-equipped item back a second time, duplicating it in inventory.
  // Every other slot only ever had this one general check, so only rings were
  // affected. Non-ring1 slots keep working exactly as before.
  const slot = item.slot;
  if (game.equippedGear[memberId][slot]) addGearToInventory(game.equippedGear[memberId][slot]);
  game.equipmentInventory.splice(invIndex,1);
  game.equippedGear[memberId][slot] = {...item};
  logEvent(`⚔️ ${ALL_PARTY.find(m=>m.id===memberId)?.name || memberId} equipped ${item.name}.`, 'good');
  saveGame();
  renderEquipment();
}

function unequipGear(memberId, slot) {
  const gear = game.equippedGear && game.equippedGear[memberId] && game.equippedGear[memberId][slot];
  if (!gear) return;
  addGearToInventory(gear);
  delete game.equippedGear[memberId][slot];
  saveGame();
  renderEquipment();
}

function migrateEquipmentState() {
  if (!Array.isArray(game.equipmentInventory)) game.equipmentInventory = [];
  if (!game.equippedGear || typeof game.equippedGear !== 'object') game.equippedGear = {};
  // Convert any accidental legacy object/array shapes without touching existing save data.
  Object.keys(game.equippedGear).forEach(id => {
    if (!game.equippedGear[id] || typeof game.equippedGear[id] !== 'object') game.equippedGear[id] = {};
  });
}

function renderEquipment() {
  migrateEquipmentState();
  const roster = document.getElementById('equipmentRoster');
  const inv = document.getElementById('equipmentInventory');
  const traders = document.getElementById('equipmentTraders');
  if (!roster || !inv || !traders) return;

  const party = getActiveParty();

  const audit = document.getElementById('gearAudit');
  if (audit) {
    const missing = party.filter(m => {
      const eq = game.equippedGear[m.id] || {};
      return !eq.weapon || !eq.armor;
    });
    audit.innerHTML = missing.length
      ? `⚠️ ${missing.length} crew member${missing.length>1?'s':''} still missing starter gear.`
      : `✓ ${party.length}/${party.length} current crew members have starter equipment equipped. Gear bonuses are active in combat.`;
    audit.className = 'gear-audit ' + (missing.length ? 'warn' : 'complete');
  }

  roster.innerHTML = party.map(m => {
    const rules = gearMemberRules(m.id);
    const eq = game.equippedGear[m.id] || {};
    const visibleSlots = GEAR_SLOTS.filter(s => !(rules.hidden || []).includes(s));
    const portrait = m.portraitAsset ? `<img src="${esc(m.portraitAsset)}" alt="" class="gear-portrait">` : `<span>${m.portrait}</span>`;
    return `<div class="gear-member panel">
      <div class="gear-member-head">${portrait}<div><div class="gear-member-name">${m.name}</div><div class="gear-member-role">${m.role} · ${rules.label}</div><div class="gear-bonus-summary">${gearSummaryText(m.id)}</div></div></div>
      <div class="gear-slots">
        ${visibleSlots.map(slot => {
          const item = eq[slot];
          return `<div class="gear-slot ${item ? 'filled' : 'empty'}">
            <div class="gear-slot-label">${gearSlotLabel(m.id,slot)}</div>
            <div class="gear-slot-item">${item ? `${item.icon || '✦'} ${esc(item.name)}<br><small>${gearItemStats(item)}</small>` : 'Empty'}</div>
            ${item ? `<button class="btn btn-small btn-danger" onclick="unequipGear('${m.id}','${slot}')">Remove</button>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');

  const items = game.equipmentInventory || [];
  // Group identical items (same catalog id, or name as fallback) into one
  // row with a ×N badge — this is the direct fix for the "doubled" look:
  // two copies of the same loot ring weren't a data bug, they were two
  // genuinely separate inventory entries with no grouping, so they
  // rendered as two full identical blocks back to back.
  const groups = [];
  items.forEach((item, i) => {
    const c = gearDisplayItem(item);
    const key = c.id || c.name;
    let g = groups.find(g => g.key === key);
    if (!g) { g = {key, display: c, indices: []}; groups.push(g); }
    g.indices.push(i);
  });
  inv.innerHTML = groups.length ? groups.map(g => {
    const c = g.display;
    const firstIdx = g.indices[0];
    const qty = g.indices.length;
    const eligible = party.filter(m => gearCanEquip(m.id,c));
    const qtyBadge = qty > 1 ? ` <span class="story-chip" style="margin-left:4px;">×${qty}</span>` : '';
    return `<div class="gear-inventory-row">
      <div class="gear-item-icon">${c.icon || '✦'}</div>
      <div class="gear-item-main"><strong>${esc(c.name)}</strong>${qtyBadge}<span>${gearItemStats(c)} · ${esc(c.desc || '')}</span></div>
      <div class="gear-equip-buttons">${eligible.map(m => `<button class="btn btn-small" onclick="equipGear('${m.id}',${firstIdx})">${m.name}</button>`).join('') || '<span style="opacity:.55">No eligible crew</span>'}
        <button class="btn btn-small btn-danger" onclick="sellGearItem(${firstIdx})">💰 Sell${qty>1?' 1':''}</button>
        ${qty>1 ? `<button class="btn btn-small btn-danger" onclick="sellAllOfGearItem(${firstIdx})">💰 Sell All ×${qty}</button>` : ''}
      </div>
    </div>`;
  }).join('') : '<p style="opacity:.6;">No unequipped gear. Visit an equipment trader.</p>';

  traders.innerHTML = EQUIPMENT_TRADERS.map(t => {
    const unlocked = level() >= t.minLevel;
    return `<div class="gear-trader ${unlocked ? '' : 'locked'}">
      <div class="gear-trader-head"><div><strong>🧳 ${t.name}</strong><div class="gear-trader-meta">${t.title} · ${t.zone}</div></div>
      <div>${unlocked ? 'Available' : `🔒 Level ${t.minLevel}`}</div></div>
      <div class="gear-trader-greeting">${esc(t.greeting)}</div>
      <div class="gear-shop-list">
        ${t.stock.map(id => {
          const item = EQUIPMENT_CATALOG.find(i=>i.id===id);
          if (!item) return '';
          return `<div class="gear-shop-row"><div><strong>${item.icon} ${esc(item.name)}</strong><div class="gear-trader-meta">${gearItemStats(item)} · ${esc(item.desc)}</div></div>
            <button class="btn btn-small" ${unlocked && game.gold>=item.price ? '' : 'disabled'} onclick="buyEquipment('${t.id}','${item.id}')">${item.price.toLocaleString()}g</button></div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}


// CLASS KITS — spells/skills ported from Legends of Daybreak's CLASS_KIT,
// trimmed to a travel-sized spellbook for San (Magic Missile → Meteor Swarm)
// and kept as-is for everyone else.
// ---------------------------------------------------------------------------
const CLASS_KIT = {
  san: {role:'caster',
    spells:[
      {name:"Magic Missile", icon:"✨", mp:8,  levelReq:1,  desc:"Arcane darts that never miss.", dice:"1d8"},
      {name:"Chromatic Orb", icon:"⚡", mp:12, levelReq:2,  desc:"Shifting elemental energy.", dice:"1d10", status:{type:'shock',chance:0.25,turns:1}},
      {name:"Shield", icon:"🛡️", mp:8,  levelReq:4,  desc:"A wall of force deflects blows.", buffType:"defense", buffVal:4, buffTurns:3},
      {name:"Melf's Acid Arrow", icon:"🧪", mp:14, levelReq:6,  desc:"Acid that keeps corroding.", dice:"1d10", status:{type:'poison',chance:0.35,dmg:6,turns:3}},
      {name:"Web of Frost", icon:"❄️", mp:18, levelReq:9,  desc:"Freezing strands ensnare.", dice:"1d12", status:{type:'shock',chance:0.3,turns:1}},
      {name:"Fireshield", icon:"🔥", mp:15, levelReq:10, desc:"+5 defense for 3 turns.", buffType:"defense", buffVal:5, buffTurns:3},
      {name:"Vampiric Touch", icon:"🧪", mp:20, levelReq:12, desc:"Drains vitality.", dice:"1d10"},
      {name:"Fireball", icon:"🔥", mp:25, levelReq:13, desc:"The classic.", dice:"2d6", status:{type:'burn',chance:0.35,dmg:6,turns:3}},
      {name:"Lightning Bolt", icon:"⚡", mp:30, levelReq:15, desc:"Crackling lightning.", dice:"3d8", status:{type:'shock',chance:0.35,turns:1}},
      {name:"Haste", icon:"💨", mp:22, levelReq:16, desc:"Strikes harder and faster.", buffType:"haste", buffVal:6, buffTurns:3},
      {name:"Stoneskin", icon:"🛡️", mp:28, levelReq:19, desc:"Flesh hardens to stone.", buffType:"defense", buffVal:10, buffTurns:4},
      {name:"Chain Lightning", icon:"⚡", mp:45, levelReq:22, desc:"Lightning arcs between foes.", dice:"4d8", status:{type:'shock',chance:0.4,turns:1}},
      {name:"Meteor Swarm", icon:"🔥", mp:60, levelReq:26, desc:"Destruction from the sky.", dice:"4d10", status:{type:'burn',chance:0.5,dmg:8,turns:3}}
    ],
    skill:{name:"Daybreak Ward", icon:'🛡️', mp:10, effect:'ward'}},
  joel:        {role:'tank',   spell:null, skill:{name:"Shield Wall", icon:'⚔️', mp:0, effect:'taunt'}},
  aisyah:      {role:'melee',  spell:null, skill:{name:'Coup de Grace', icon:'💀', mp:0, mult:1.8}},
  eliz:        {role:'healer',
    spells:[
      {name:'Heal', icon:'💚', mp:10, levelReq:1, desc:'Restores HP to the lowest-HP ally.', healMult:1},
      {name:'Well of Light', icon:'💧', mp:15, levelReq:12, desc:"Restores MP — answers San's need first.", effect:'restoreMp', restoreAmt:40}
    ],
    skill:{name:'Resurrect', icon:'🌟', mp:35, effect:'revive'},
    highSkill:{name:'Cure Disease', icon:'🌿', mp:20, effect:'cleanse', levelReq:20}},
  mezstorm:    {role:'caster',
    spells:[
      {name:'Tempest Fury', icon:'🌀', mp:18, mult:1.7, levelReq:1, desc:'His core damage spell.'},
      {name:'Storm Share', icon:'🤝', mp:15, levelReq:12, desc:"Spends his own MP to restore an ally's.", effect:'shareMp', restoreAmt:35}
    ],
    skill:{name:'Thunderclap', icon:'🔊', mp:12, effect:'stun'}},
  senedra:     {role:'ranged', spell:null, skill:{name:"Hunter's Mark", icon:'🎯', mp:0, effect:'mark'}},
  zaki:        {role:'melee',  spell:null, skill:{name:'Power Strike', icon:'💥', mp:0, mult:1.5}},
  ser_aldric:  {role:'tank',   spell:null, skill:{name:'Holy Strike', icon:'✝️', mp:0, mult:1.4}},
  sister_wren: {role:'healer', spell:{name:'Blessing of Faith', icon:'🙏', mp:0, healMult:1.1}, skill:{name:'Purify', icon:'🌿', mp:0, effect:'cleanse'}},
  soel:        {role:'caster', spell:{name:"Nine Lives' Ward", icon:'🐾', mp:0, healMult:0.6}, skill:{name:'Lucky Pounce', icon:'✨', mp:0, mult:1.3}},
  // Renn (Arc V, Ch.6-9): a caster like San/Mezstorm/Mimi, plus a signature
  // "hex" skill. The brief described an AoE hex that can friendly-fire the
  // whole team, but this combat engine only ever has one enemy on screen
  // (game.combatEnemyHp is a single scalar, no multi-target system) — so
  // "AoE" doesn't map directly. Adapted as a high-risk/high-reward gamble
  // instead: most of the time it's a big hit + a team haste buff; ~1 in 5
  // it misfires, doing less damage and clipping a random ally (never
  // fatally) rather than buffing anyone. See combatAction's 'hex' branch.
  // Dr. AA (Arc IV recruit): the first of 5 recruits (Iris, KW Liang,
  // Dr. AA, Mimi, Brada Shah) fixed from having no CLASS_KIT entry at all
  // — they fell through to kitFor's {role:'melee', spell:null, skill:null}
  // default, so Attack/Defend/Item/Flee were the only buttons that ever
  // did anything for them, and Dr. AA's whole 110 MP pool sat unused.
  // Picked him first of the five: he's the only Healer among them, so the
  // gap was the most visible (a "physician" who could never actually
  // heal). Mirrors Eliz's Heal spell (same healMult formula, no San-
  // priority targeting since that's specifically her relationship, not
  // his), plus a revive skill — thematically the obvious fit for a
  // physician, and exercises the same already-working 'revive' branch
  // Eliz's HIGHSKILL uses, rather than inventing anything new.
  // All five originally-melee-fallback Arc IV recruits (Iris, KW Liang,
  // Dr. AA, Mimi, Brada Shah) are now covered below — fixed one at a time
  // across a few passes rather than all at once.
  dr_aa: {role:'healer',
    spells:[
      {name:'Field Treatment', icon:'🩹', mp:12, levelReq:1, desc:'Restores HP to the lowest-HP ally.', healMult:1.05}
    ],
    skill:{name:'Emergency Resuscitation', icon:'⚕️', mp:30, effect:'revive'}},
  // Iris and KW Liang (Arc IV recruits, second/third of the five): both
  // Scouts with mp:0, same shape as Senedra's kit (role:'ranged'/'melee',
  // spell:null, one free mp:0 skill) — so modeled directly on hers rather
  // than inventing a new pattern. Their skill is their spirit familiar
  // joining the strike (Ash the fox for Iris; Snowball the spirit rabbit
  // for Liang) rather than Senedra's utility 'mark' effect, so this reuses
  // the 'mult' damage-skill branch instead (same one Aisyah/Zaki/Ser
  // Aldric already use) — the log line already reads as "IRIS uses 🦊
  // Ash's Pounce for NN damage!", which carries the familiar-assist
  // flavor on its own with no new effect type needed. combatRole 'Rogue'
  // (dagger, per her gear rule) maps to CLASS_KIT's 'melee' bucket;
  // 'Ranged' (bow, per his gear rule) maps to 'ranged' — same mapping
  // Aisyah/Senedra use.
  iris:        {role:'melee',  spell:null, skill:{name:"Ash's Pounce", icon:'🦊', mp:0, mult:1.6}},
  kw_liang:    {role:'ranged', spell:null, skill:{name:"Snowball's Leap", icon:'🐇', mp:0, mult:1.5}},
  // Mimi and Brada Shah (Arc IV recruits, last two of the five): both have
  // a real MP pool (115 / 60) and a specific class fantasy, so — unlike
  // Iris/Liang's single free skill — they get proper spellbooks, same
  // depth as Renn/Mezstorm.
  // Mimi (Diviner, mp:115): a caster like San/Mezstorm/Renn, reusing the
  // same 'dice'+'status' damage-spell shape. Her skill leans into
  // "reads the tide for what it hides" rather than raw damage — reuses
  // the same 'mark' effect Senedra's Hunter's Mark already uses (San's
  // next hit lands true), which reads naturally as Mimi calling the
  // opening rather than Senedra spotting it. Free (mp:0) like Senedra's,
  // since it's a utility read, not a spell.
  mimi: {role:'caster',
    spells:[
      {name:'Tide Sight', icon:'🔮', mp:9,  levelReq:1,  desc:'Strikes at a weakness only she can see.', dice:'1d9'},
      {name:"Fortune's Edge", icon:'🌊', mp:14, levelReq:6,  desc:'Bends probability against the enemy.', dice:'1d11', status:{type:'shock',chance:0.25,turns:1}},
      {name:'Foretold Ruin', icon:'💀', mp:20, levelReq:12, desc:'A future she has already seen happen.', dice:'1d14'}
    ],
    skill:{name:"Reader's Omen", icon:'👁️', mp:0, effect:'mark'}},
  // Brada Shah (Bard/Support, mp:60): "songs, strategy, and steadier
  // ground" maps directly onto the buffType mechanic San's own Shield/
  // Haste spells already use (same shared game.shieldTurns/hasteTurns
  // state — a bard's rally song and a mage's haste spell stacking into
  // the same buff window is fine, not a bug). Encore reuses Eliz's
  // restoreMp effect, refocused on San since she's the one who actually
  // burns through MP fastest. Showstopper is a free (mp:0) mult skill,
  // same as Iris/Liang, so he's never reduced to Attack-only if the MP
  // runs dry mid-fight.
  brada_shah: {role:'support',
    spells:[
      {name:'Rally Cry', icon:'🎵', mp:15, levelReq:1,  desc:'A driving rhythm speeds the whole crew.', buffType:'haste', buffVal:6, buffTurns:3},
      {name:'Steadfast Ballad', icon:'🎶', mp:15, levelReq:8,  desc:'Steels the crew against the next few blows.', buffType:'defense', buffVal:5, buffTurns:3},
      {name:'Encore', icon:'🎼', mp:12, levelReq:14, desc:"An old favorite — restores San's focus.", effect:'restoreMp', restoreAmt:35}
    ],
    skill:{name:'Showstopper', icon:'🥁', mp:0, mult:1.3}},
  renn: {role:'caster',
    spells:[
      {name:'Gale Dart', icon:'💨', mp:9,  levelReq:1,  desc:'A quick burst of wind, sharp as a blade.', dice:'1d9'},
      {name:'Mirror Currents', icon:'🌊', mp:14, levelReq:5,  desc:'Bends the light and the tide together.', dice:'1d11', status:{type:'shock',chance:0.25,turns:1}},
      {name:'Phantom Fleet', icon:'👻', mp:18, levelReq:10, desc:"Illusory ships crowd the enemy's vision.", dice:'1d13'}
    ],
    skill:{name:"Trickster's Hex", icon:'🎭', mp:22, effect:'hex'}},
  // Erynn Farseer (Arc VII, recruited Ch.23 "The Farseer Who Stayed").
  // Deliberately NOT a third damage-nuker alongside Renn/Mimi, who are
  // otherwise near-identical (dice-damage + one shock spell + one utility
  // skill). "Three Ways of Knowing" (Ch.10) frames the trio as three
  // different approaches — Renn experiments, Mimi divines, Erynn inherits —
  // so his kit is built around buffType:'expose' (see castSpell), a
  // genuinely new mechanic: instead of hitting harder himself, he makes
  // every subsequent hit against the enemy land harder, for every ally,
  // basic attacks included. Spell names pull straight from the Farseer
  // archive chapters (Varel Ch.6, Tenn Ch.7, the marker/warning Ch.19-21).
  // Free skill mechanically realizes the trio dynamic — see the
  // exposeTrio effect branch above.
  erynn: {role:'support',
    spells:[
      {name:"Varel's Ledger", icon:'📜', mp:12, levelReq:1,  desc:'A documented weakness, generations old and still accurate.', buffType:'expose', buffVal:15, buffTurns:3},
      {name:"Tenn's Correction", icon:'🧭', mp:16, levelReq:8,  desc:"A refinement of Varel's original theory — sharper, and it shows.", buffType:'expose', buffVal:22, buffTurns:3},
      {name:"The Old Marker's Warning", icon:'⚠️', mp:22, levelReq:14, desc:'Not every mystery needs solving to be useful.', buffType:'expose', buffVal:30, buffTurns:4}
    ],
    skill:{name:'Three Ways of Knowing', icon:'📖', mp:0, effect:'exposeTrio'}}
};
function kitFor(id){ return CLASS_KIT[id] || {role:'melee', spell:null, skill:null}; }
// Two shapes exist across CLASS_KIT: most casters/healers use a `spells`
// array (San, Eliz, Mezstorm, Dr. AA, Mimi, Renn), but Sister Wren and Soel
// each use a single `spell` object instead. Every place that read
// `kit.spells` directly (the manual Spell menu, castSpell itself, the party
// detail screen, and auto-battle) only ever checked the plural form — so
// Wren and Soel's heal/ward spell was completely unreachable, manually or
// automatically, despite being fully defined. This normalizes both shapes
// into one list so all four call sites treat them identically.
function kitSpellList(kit) {
  if (!kit) return [];
  if (kit.spells) return kit.spells;
  if (kit.spell) return [kit.spell];
  return [];
}

// ---------------------------------------------------------------------------
// AFFINITY TIERS & GROWTH ABILITIES — ported from the source game's passive
// per-companion bonuses, remapped onto this game's level curve.
// ---------------------------------------------------------------------------
const AFFINITY_TIERS = {
  aisyah:  [ {lv:15,n:'Quick Fingers',fx:{goldPct:0.10}}, {lv:30,n:'Treasure Sense',fx:{goldPct:0.15}}, {lv:45,n:"Dragon's Hoard",fx:{goldPct:0.25}} ],
  senedra: [ {lv:15,n:'Eagle Eye',fx:{critPct:0.10}}, {lv:30,n:'Deadeye',fx:{critPct:0.15}}, {lv:45,n:"Storm's Arrow",fx:{critPct:0.25}} ],
  zaki:    [ {lv:15,n:'Iron Discipline',fx:{def:3}}, {lv:30,n:'Battle Hardened',fx:{def:5}}, {lv:45,n:'Immortal Wall',fx:{def:8}} ]
};
function affinityFor(id){
  const tiers = AFFINITY_TIERS[id];
  if (!tiers) return {fx:{}, n:null};
  const lvl = level();
  const unlocked = tiers.filter(t => lvl >= t.lv);
  return unlocked.length ? unlocked[unlocked.length-1] : {fx:{}, n:null};
}
const GROWTH_ABILITIES = {
  aisyah:  {id:'long_con', name:'The Long Con', levelReq:12, desc:"A perfect strike, and her hand is already in the enemy's pocket. Crits have a chance to skim bonus gold."},
  senedra: {id:'storms_mark', name:"Storm's Mark", levelReq:16, desc:"A critical hit marks the target — San's next strike against it is guaranteed to land true."},
  zaki:    {id:'nervous_courage', name:'Nervous Courage', levelReq:8, desc:"When it's just him and San left standing, he stops checking his pack. +6 ATK, +4 DEF for the rest of the fight."}
};
const CRIT_BASE = 0.10;

// ---------------------------------------------------------------------------
// ENEMIES — split into harbor threats (explore a port, repeatable, low
// stakes), sea threats (random encounters while sailing), and guardians
// (one-time story fights that free a companion).
// ---------------------------------------------------------------------------
const HARBOR_ENEMIES = {
  bilge_rat:     { name: 'Bilge Rat Gang', icon: '🐀', hp: 120, dmg: 8,  xp: 40,  gold: 15, desc: 'They\'ve been living in the hold longer than the crew has.' },
  dock_thief:    { name: 'Dock Thief', icon: '🥷', hp: 150, dmg: 10, xp: 55,  gold: 25, desc: 'Fast hands, faster feet, gone before the watch turns.' },
  smuggler_crew: { name: 'Smuggler Crew', icon: '🏴', hp: 200, dmg: 12, xp: 70,  gold: 35, desc: 'Running contraband nobody\'s supposed to ask about.' },
  wreck_crab:    { name: 'Giant Wreck Crab', icon: '🦀', hp: 240, dmg: 14, xp: 85,  gold: 30, desc: 'Nests in shipwrecks, claws like cargo hooks.' },
  harbor_ghoul:  { name: 'Harbor Ghoul', icon: '👺', hp: 260, dmg: 15, xp: 95,  gold: 40, desc: 'Something the tide dragged in and forgot to take back out.' },
  // Reused from Arc III's memory-encounter fights (same enemies, same base
  // stats) — now the regular mob pool for Kota Batu's harbor. scaleCrimsonEnemy
  // scales 'harbor'-kind fights by the player's actual level, so these old
  // base numbers stay appropriate even though Kota Batu is reached much later.
  portside_rogues:      { name: 'Portside Rogues', icon: '🗡️', hp: 260, dmg: 14, xp: 220, gold: 90,  desc: 'A gang working the alleys behind the harbor.' },
  market_row_toughs:    { name: 'Market Row Toughs', icon: '🥊', hp: 300, dmg: 15, xp: 240, gold: 100, desc: "Small-time muscle leaning on stallholders who can't afford to say no." },
  quay_row_debt_runners:{ name: 'Quay Row Debt Runners', icon: '🧾', hp: 320, dmg: 16, xp: 260, gold: 110, desc: "Leaning on shopkeepers over debts that were never really theirs to collect." },
  old_quarter_runners:  { name: 'Old Quarter Runners', icon: '🔪', hp: 310, dmg: 16, xp: 250, gold: 105, desc: "Small-time toughs who've learned the back alleys better than the watch ever will." },
  back_lane_toughs:      { name: 'Back Lane Toughs', icon: '🥋', hp: 330, dmg: 16, xp: 270, gold: 115, desc: "Small-time trouble that knows exactly which streets the watch doesn't bother with." },
  // Robin C. — recurring rival, not a one-time defeat. Deliberately added
  // as a normal HARBOR_ENEMIES entry (not a separate registry) so it works
  // with the existing enemyLookup/scaledEnemyForExplore/startHarborFight
  // pipeline with zero changes needed there — the only new code is where
  // he's rendered (see ct-build-v72-fairtide-arc4 below), which keeps him
  // out of the generic per-port mob lists and shows him as his own
  // "Challenge" card instead, unlocked once Chapter 8 is read.
  robin: { name: 'Robin C. & His Enforcers', icon: '⛓️', hp: 520, dmg: 22, xp: 450, gold: 220, desc: 'Senior Partner at R&C, backed by hired muscle. Binding and freezing magic, and an unshakable belief that everyone has a price — including yours.' },
  jeff: { name: 'Jeff & His Crew', icon: '🔨', hp: 540, dmg: 26, xp: 460, gold: 220, desc: "Once tried to poach Joel with a bigger ship and better pay. Fights the way he talks — heavy, crushing, and taking the rejection personally." },
  // Arc XIII — Unknown Harbour Explore encounters. Themed to a living,
  // developed civilization that already has its own rules, not Veyren
  // pirates — misunderstandings and local trouble, not raiders.
  dockside_pickpockets: { name: 'Dockside Pickpockets', icon: '🥷', hp: 300, dmg: 18, xp: 260, gold: 90, desc: 'Fast hands and faster feet, testing whether visitors know the rules yet.' },
  lantern_smugglers: { name: 'Lantern-Light Smugglers', icon: '🏮', hp: 320, dmg: 19, xp: 280, gold: 100, desc: "Moving cargo nobody's supposed to ask about, same as anywhere else in the world." },
  harbor_floor_scavengers: { name: 'Harbor-Floor Scavengers', icon: '🦑', hp: 340, dmg: 20, xp: 290, gold: 100, desc: 'Living in the gaps beneath the docks, taking whatever the tide leaves loose.' },
  overzealous_tollkeeper: { name: 'An Overzealous Tollkeeper', icon: '🥢', hp: 360, dmg: 21, xp: 310, gold: 110, desc: "Hasn't quite accepted that 'visitor' means 'exception' yet." },
  restless_shrine_guardian: { name: 'A Restless Shrine Guardian', icon: '🐉', hp: 400, dmg: 23, xp: 340, gold: 130, desc: 'Old magic, older than the harbour itself, still doing whatever job it was built for.' },
  // Arc XIV — Tide Network Explore encounters. Aquatic and current-
  // themed, tying into the arc's own "the water moves wrong" premise
  // rather than being generic sea monsters.
  confused_shoal: { name: 'A Current-Confused Shoal', icon: '🦐', hp: 300, dmg: 18, xp: 260, gold: 80, desc: 'Disoriented by the wrong-moving water, and lashing out because of it.' },
  territorial_pufferkin: { name: 'Territorial Puffer-Kin', icon: '🐡', hp: 320, dmg: 19, xp: 280, gold: 85, desc: 'Not hostile by nature. Very hostile about being approached.' },
  deepwater_opportunist: { name: 'A Deep-Water Opportunist', icon: '🦈', hp: 350, dmg: 21, xp: 300, gold: 95, desc: "Drawn in by the disturbance, hunting whatever else it's confused." },
  tidewrecked_scavenger: { name: 'A Tide-Wrecked Scavenger', icon: '🐙', hp: 340, dmg: 20, xp: 290, gold: 90, desc: 'Living in the wreckage of a route nobody uses safely anymore.' },
  unmoored_current_spirit: { name: 'An Unmoored Current-Spirit', icon: '🌊', hp: 400, dmg: 23, xp: 330, gold: 120, desc: "Displaced by whatever's wrong with the water, and furious about it." },
  // Arc XV — Clan Settlement Wilderness encounters. Native wildlife, not
  // generic fantasy monsters — themed to a shapeshifter world specifically.
  moonfang_wolves: { name: 'Moonfang Wolves', icon: '🐺', hp: 380, dmg: 22, xp: 300, gold: 100, desc: "Large magical wolves, hunting in coordinated packs. Nothing personal about it — just how they eat." },
  thornback_boar: { name: 'Thornback Boar', icon: '🐗', hp: 460, dmg: 24, xp: 320, gold: 100, desc: 'A forest boar built like a battering ram, covered in growths hardened past anything natural.' },
  gloom_stalker: { name: 'Gloom Stalker', icon: '🐾', hp: 400, dmg: 26, xp: 310, gold: 95, desc: "You don't see it until it's already decided you have." },
  moonclaw: { name: 'Moonclaw', icon: '🌙', hp: 480, dmg: 27, xp: 380, gold: 150, desc: "Its strength rises and falls with the moon. Right now, it's not in the mood to be reasonable." },
  wildshape_beast_forest: { name: 'A Wildshape Beast (Forest Form)', icon: '🐻', hp: 440, dmg: 25, xp: 350, gold: 130, desc: "Wolf-shaped here. It won't stay that way if it decides to move." },
  wildshape_beast_mountain: { name: 'A Wildshape Beast (Mountain Form)', icon: '⛰️', hp: 440, dmg: 25, xp: 350, gold: 130, desc: 'Bear-shaped here, broad and heavy-set. The high ground changes what it needs to be.' },
  wildshape_beast_cave: { name: 'A Wildshape Beast (Cave Form)', icon: '🦎', hp: 440, dmg: 25, xp: 350, gold: 130, desc: 'Something low, wide, and built for the dark. The forest never sees this side of it.' },
  mossback: { name: 'Mossback', icon: '🌳', hp: 500, dmg: 20, xp: 300, gold: 80, desc: 'Mostly moss, mostly plant, mostly minding its own business. Emphasis on mostly.' },
  the_old_moon_beast: { name: 'The Old Moon Beast', icon: '🌕', hp: 900, dmg: 32, xp: 600, gold: 300, desc: 'Ancient, territorial, and — the locals will tell you, if you ask — not actually anyone\'s enemy.' }
};
const SEA_ENEMIES = {
  giant_octopus: { name: 'Giant Octopus', art: '🐙', hp: 340, dmg: 16, xp: 110, gold: 60,  desc: 'Ink clouds the water an instant before the tentacles do.' },
  rival_frigate: { name: 'Rival Pirate Frigate', art: '🏴‍☠️', hp: 380, dmg: 18, xp: 130, gold: 90,  desc: 'A black-sailed frigate bearing down, cannons already run out.' },
  sea_serpent:   { name: 'Sea Serpent', art: '🐍', hp: 450, dmg: 20, xp: 150, gold: 100, desc: 'A massive serpent rises from the depths, scales like wet iron.' },
  siren_pack:    { name: 'Siren Pack', art: '🧜‍♀️', hp: 320, dmg: 14, xp: 100, gold: 70,  desc: 'Haunting songs drift over the water. The crew covers their ears.' },
  ghost_galleon: { name: 'Ghost Galleon', art: '👻', hp: 520, dmg: 22, xp: 180, gold: 140, desc: 'A spectral vessel out of the fog, crewed by the damned.' },
  kraken:        { name: 'Kraken', art: '🦑', hp: 700, dmg: 28, xp: 260, gold: 220, desc: 'Tentacles thicker than mast ropes close around the hull.' },
  // Voyage-event encounters for the Harbour (Arc XIII) and Tide Network
  // (Arc XIV) crossings — deliberately not Veyren pirates or sea monsters,
  // since these voyages aren't through Veyren's own waters.
  territorial_sea_guardian: { name: 'Territorial Sea Guardian', art: '🐉', hp: 400, dmg: 20, xp: 200, gold: 100, desc: "Something large surfaces nearby. Not aggressive, exactly. Clearly not friendly, either." },
  suspicious_patrol_boat: { name: 'Suspicious Patrol Boat', art: '⚓', hp: 360, dmg: 18, xp: 180, gold: 80, desc: 'An unmarked local vessel demands you identify yourselves, badly translated and tense.' },
  unknown_deep_dweller: { name: 'Unknown Deep-Dweller', art: '🐙', hp: 420, dmg: 21, xp: 210, gold: 100, desc: 'Something large moves beneath the ship, unfamiliar and untested.' },
  disturbed_current_entity: { name: 'A Disturbed Current', art: '🌊', hp: 400, dmg: 20, xp: 200, gold: 90, desc: "The current turns hostile without warning, echoing the same problem the whole arc is built around." },
  shore_pack_scout: { name: 'A Shore Pack Scout', art: '🐺', hp: 380, dmg: 20, xp: 190, gold: 85, desc: "Something's been pacing the ship along the coastline, keeping just out of clear sight." },
  something_on_the_ridge: { name: 'Something on the Ridge', art: '🏔️', hp: 400, dmg: 22, xp: 200, gold: 90, desc: 'A shape breaks the tree line above the shore and starts moving fast, downhill, directly toward the landing point.' }
};
const GUARDIANS = {
  wreck_warden:     { name: 'The Wreck Warden', art: '💀', hp: 620,  dmg: 20, xp: 260, gold: 150, desc: 'Wears the shape of every captain who ever drowned on this reef.' },
  debt_collector:   { name: 'The Debt Collector', art: '📜', hp: 700,  dmg: 22, xp: 300, gold: 180, desc: 'Never once let a name off the ledger. Means to keep it that way.' },
  plague_hulk:      { name: 'The Plague Hulk', art: '🚢', hp: 780,  dmg: 23, xp: 340, gold: 200, desc: 'A quarantined wreck that got up and started walking.' },
  storm_idol:       { name: 'The Storm Idol', art: '⛩️', hp: 860,  dmg: 25, xp: 380, gold: 220, desc: "Mezstorm's old bargain, come to collect in person." },
  fog_stalker:      { name: 'The Fog Stalker', art: '🌫️', hp: 940,  dmg: 26, xp: 420, gold: 240, desc: 'Answers every signal fire Senedra ever lit.' },
  iron_brig_warden: { name: 'The Iron Brig Warden', art: '⚓', hp: 1020, dmg: 28, xp: 460, gold: 260, desc: "The prison hulk's own champion. Undefeated, until now." },
  drowned_admiral:  { name: 'The Drowned Admiral', art: '👑', hp: 1400, dmg: 34, xp: 900, gold: 500, desc: 'Holds the last passage alone, and has for longer than anyone can say.' }
};
// Memory Fragments — one per Memory Archive chapter (a standalone side
// story, not chained to any numbered arc's gating — see its own IIFE
// near the end of the file), fought via the repeatable "Challenge Memory
// Again" button once that chapter's been read. Each is themed on that
// chapter's own emotional core rather than its literal events — an echo
// of exhaustion, of doubt, of strain — matching how this game already
// treats memory as something you can face in combat (Arc III's own
// memory fights use the same idea). Uses the ordinary level-scaling
// branch of scaleCrimsonEnemy (unlike Arc III's frozen 'memory' kind),
// so these stay a fair, repeatable fight at any point in the game.
const MEMORY_FRAGMENTS = {
  memory_fragment_1:  { name: 'Echo of Exhaustion',      art: '🕯️', hp: 150, dmg: 12, xp: 60, gold: 25, desc: 'The weight San carried long before anyone else could see it.' },
  memory_fragment_2:  { name: 'Echo of Solitude',        art: '🌑', hp: 155, dmg: 12, xp: 60, gold: 25, desc: "Joel's quiet resignation to getting through it alone." },
  memory_fragment_3:  { name: 'Flicker of Curiosity',    art: '✨', hp: 140, dmg: 11, xp: 60, gold: 25, desc: 'A small, unexpected spark, easy to almost ignore.' },
  memory_fragment_4:  { name: 'Echo of First Words',     art: '💬', hp: 160, dmg: 13, xp: 65, gold: 28, desc: 'Every careful question, answered a little more honestly than planned.' },
  memory_fragment_5:  { name: 'Echo of the First Spark', art: '🎬', hp: 170, dmg: 14, xp: 70, gold: 30, desc: 'Ten hours that refused to feel like enough.' },
  memory_fragment_6:  { name: 'Quiet Echo',               art: '🌙', hp: 165, dmg: 13, xp: 68, gold: 29, desc: "Something private, kept exactly that — private." },
  memory_fragment_7:  { name: 'Echo of Routine',          art: '📅', hp: 175, dmg: 14, xp: 72, gold: 31, desc: 'The small, ordinary weight of choosing someone, every single week.' },
  memory_fragment_8:  { name: 'Echo of Strain',           art: '⚡', hp: 200, dmg: 16, xp: 80, gold: 34, desc: 'Two different jobs, two different pressures, wearing on the same two people.' },
  memory_fragment_9:  { name: "Fractured Memory: The Accident", art: '🩹', hp: 210, dmg: 17, xp: 85, gold: 36, desc: 'A bad fall, a bandaged head, and someone who got there in twenty minutes.' },
  memory_fragment_10: { name: "Fractured Memory: The Ending",   art: '📋', hp: 215, dmg: 17, xp: 88, gold: 37, desc: 'Nine years, ending in confusion instead of a clean goodbye.' },
  memory_fragment_11: { name: 'Echo of Family',           art: '👪', hp: 180, dmg: 14, xp: 75, gold: 32, desc: "The family San carried with her long before Joel — imperfect, and still hers." },
  memory_fragment_12: { name: 'Echo of Kinship',          art: '🤝', hp: 185, dmg: 15, xp: 76, gold: 33, desc: 'More family, spread across years and distance, still holding on.' },
  memory_fragment_13: { name: 'Echo of Two Families',     art: '🏠', hp: 230, dmg: 18, xp: 95, gold: 40, desc: 'Two complicated pasts, and two people who chose each other anyway.' }
};
function enemyLookup(key){ return HARBOR_ENEMIES[key] || SEA_ENEMIES[key] || GUARDIANS[key] || MEMORY_FRAGMENTS[key] || null; }

// ---------------------------------------------------------------------------
// VOYAGE EVENTS
// ---------------------------------------------------------------------------
const EVENTS = [
  { type: 'pirates', text: 'Pirates off the port bow! They demand tribute or blood!', danger: 3, combat: 'rival_frigate' },
  { type: 'storm', text: 'A sudden squall batters your ship! The crew scrambles!', danger: 2 },
  { type: 'merchant', text: 'A merchant vessel signals for trade. They carry rare goods.', danger: 0 },
  { type: 'wreck', text: 'You spot a drifting wreck. There might be salvage...', danger: 1 },
  { type: 'monster', text: 'The crew whispers of a giant creature beneath the waves...', danger: 4, combat: 'sea_serpent' },
  { type: 'calm', text: 'The sea is mirror-calm. A peaceful voyage.', danger: 0 },
  { type: 'octopus', text: 'Something with too many arms surfaces off the bow!', danger: 3, combat: 'giant_octopus' },
  { type: 'treasure', text: 'A glint of gold catches your eye in the water!', danger: 0 },
  { type: 'kraken', text: 'The water turns black. Something vast stirs below...', danger: 5, combat: 'kraken' },
  { type: 'ghost', text: 'Fog rolls in unnaturally fast. A ghostly shape appears...', danger: 4, combat: 'ghost_galleon' },
  { type: 'siren', text: 'A haunting song drifts over the water...', danger: 3, combat: 'siren_pack' }
];

const RUMORS = [
  "Rice prices are crashing in Bangkok — flood season.",
  "Pirates have been spotted near Malacca. Travel with caution.",
  "Spice prices in Batavia are at a 10-year low.",
  "Contraband is selling for triple in Manila.",
  "A sea serpent has been seen near the Singapore Strait.",
  "A ghost ship haunts the waters between Manila and Hanoi.",
  "Someone matching Zaki's description was seen fighting for coin in Manila.",
  "A woman's been signaling from the Hanoi lighthouse for months. No one's answered."
];

const POTION_CATALOG = [
  // Tier 1 — Tavern, early game
  {id:'health_potion', name:'Health Potion', icon:'🧪', effect:'heal', value:30, price:20, tier:1},
  {id:'mana_potion', name:'Mana Potion', icon:'🔵', effect:'mana', value:25, price:18, tier:1},
  {id:'ship_repair', name:'Repair Kit', icon:'🔧', effect:'repair', value:25, price:30, tier:1},
  {id:'cannon_shot', name:'Cannon Shot', icon:'💣', effect:'damage', value:50, price:25, tier:1},
  // Tier 2 — Tavern, mid game
  {id:'greater_health', name:'Greater Health', icon:'💊', effect:'heal', value:75, price:55, tier:2},
  {id:'greater_mana', name:'Greater Mana', icon:'🔷', effect:'mana', value:60, price:50, tier:2},
  {id:'reinforced_repair_kit', name:'Reinforced Repair Kit', icon:'⚙️', effect:'repair', value:50, price:70, tier:2},
  {id:'heavy_cannon_shot', name:'Heavy Cannon Shot', icon:'🧨', effect:'damage', value:100, price:60, tier:2},
  // Tier 3 — Temple only. Consecrated versions of the same four effects,
  // sold exclusively at the shrine (see potionShopHTML/renderTemple) so the
  // temple has a mechanical reason to visit beyond its quest board.
  {id:'elixir_of_vitality', name:'Elixir of Vitality', icon:'✨', effect:'heal', value:200, price:150, tier:3, temple:true},
  {id:'elixir_of_focus', name:'Elixir of Focus', icon:'🔮', effect:'mana', value:150, price:130, tier:3, temple:true},
  {id:'shipwrights_blessing', name:"Shipwright's Blessing", icon:'⛩️', effect:'repair', value:100, price:160, tier:3, temple:true},
  {id:'consecrated_broadside', name:'Consecrated Broadside', icon:'💥', effect:'damage', value:200, price:140, tier:3, temple:true}
];

const LOOT_THEMES = [
  [['serpent','octopus','kraken'], '🐍', 'Sea Beast Scale'],
  [['ghost','wraith','stalker'], '👻', 'Spectral Essence'],
  [['pirate','frigate','collector','warden'], '🏴‍☠️', 'Pirate Trophy'],
  [['siren'], '🧜‍♀️', 'Siren Pearl'],
  [['admiral'], '👑', "Admiral's Medal"],
  [['idol'], '⛩️', 'Idol Shard'],
  [['hulk'], '🚢', 'Hulk Timber']
];
const TRINKET_BONUS = {
  '🐍':{dmgPct:0.08, label:'+8% damage'}, '👻':{defPct:0.12, label:'-12% damage taken'},
  '🏴‍☠️':{dmgPct:0.10, label:'+10% damage'}, '🧜‍♀️':{mpBonus:20, label:'+20 max MP'},
  '👑':{dmgPct:0.15, defPct:0.10, label:'+15% damage, -10% damage taken'},
  '⛩️':{spellPct:0.15, label:'+15% spell damage'}, '🚢':{hpBonus:25, label:'+25 max HP'}
};

// ---------------------------------------------------------------------------
// VESSELS — new hulls unlock by level, not just gold. Buying one keeps your
// existing per-stat upgrades (hull/cannons/sails/cargo) but raises the cap
// each can be upgraded to, and sets a new cargo/health floor.
// ---------------------------------------------------------------------------
const VESSELS = [
  { id: 'sloop',         name: 'Sloop',                  icon: '⛵',       minLevel: 1,   cost: 0,      cargoBase: 50,  hpBase: 100,  statCap: 5,  fieldCap: 4, desc: 'What you escaped the wreck with. Fast, fragile, familiar.' },
  { id: 'brigantine',    name: 'Brigantine',              icon: '🚤',      minLevel: 8,   cost: 900,    cargoBase: 90,  hpBase: 150,  statCap: 8,  fieldCap: 5, desc: 'Two masts and real cannon ports. The crew stops flinching at storms.' },
  { id: 'galleon',       name: 'Galleon',                 icon: '🚢',      minLevel: 20,  cost: 2400,   cargoBase: 150, hpBase: 220,  statCap: 12, fieldCap: 6, desc: 'Broad in the beam, heavy in a fight. Room to bring more of the crew into a fight than ever before.' },
  { id: 'flagship',      name: 'The Crimson Tide',        icon: '🏴‍☠️',   minLevel: 35,  cost: 5500,   cargoBase: 230, hpBase: 320,  statCap: 16, fieldCap: 6, desc: "San's flagship, once the crew's whole again. Nothing outsails it." },
  { id: 'war_galleon',   name: 'War Galleon',              icon: '⚔️',      minLevel: 60,  cost: 12000,  cargoBase: 300, hpBase: 430,  statCap: 22, fieldCap: 7, desc: 'A true line-of-battle ship. Built to survive cannon fire and answer it.' },
  { id: 'merchantman',   name: 'Grand Merchantman',        icon: '🏛️',     minLevel: 90,  cost: 24000,  cargoBase: 420, hpBase: 560,  statCap: 28, fieldCap: 7, desc: 'A floating warehouse with enough sail to keep the trade route moving.' },
  { id: 'manowar',       name: 'Man-of-War',               icon: '💥',      minLevel: 130, cost: 50000,  cargoBase: 520, hpBase: 720,  statCap: 35, fieldCap: 8, desc: 'A massive warship. Few captains ever command one, and fewer still command it well.' },
  { id: 'grand_flagship',name: 'Crimson Sovereign',        icon: '👑',      minLevel: 180, cost: 100000, cargoBase: 700, hpBase: 950,  statCap: 45, fieldCap: 8, desc: 'The final expression of San’s fleet: speed, guns, cargo and prestige in one hull.' },
  { id: 'storm_leviathan',name: 'Storm Leviathan',         icon: '🌊',      minLevel: 220, cost: 200000, cargoBase: 900, hpBase: 1250, statCap: 55, fieldCap: 9, desc: 'Built for storms that would sink anything smaller. The sea itself seems to make way.' },
  { id: 'krakens_reach', name: "The Kraken's Reach",       icon: '🐙',      minLevel: 280, cost: 380000, cargoBase: 1150,hpBase: 1600, statCap: 68, fieldCap: 9, desc: "Named for what it's built to survive, not what it hunts." },
  { id: 'horizon_dreadnought',name: 'Horizon-class Dreadnought', icon: '🌅', minLevel: 350, cost: 650000, cargoBase: 1450,hpBase: 2050, statCap: 82, fieldCap: 10, desc: "Built alongside the Horizon Engine's own research — as much instrument as warship." },
  { id: 'aethons_pride', name: "The Aethon's Pride",       icon: '⭐',      minLevel: 430, cost: 1000000,cargoBase: 1800,hpBase: 2600, statCap: 98, fieldCap: 10, desc: 'The last ship any single crew is ever likely to need. By the time San sails this one, her name is already legend.' }
];
function currentVessel(){ return VESSELS[game.shipTier] || VESSELS[0]; }
function shipStatCap(){
  // Ship improvements grow with San's level instead of ending at a fixed cap.
  // Each hull still has its own base cap, while captain progression keeps
  // upgrades available throughout the voyage.
  const vessel = currentVessel();
  const levelCap = 5 + Math.floor(Math.max(0, level() - 1) / 2);
  return Math.max(Number(vessel.statCap || 5), levelCap);
}
function syncShipToCaptainLevel() {
  const vessel = currentVessel();
  const lv = Math.max(1, level());
  game.ship = game.ship || {hull:1,cannons:1,sails:1,cargo:1};

  // Captain progression improves the ship's baseline capacity as well as
  // purchased upgrades. Existing health is never artificially reduced.
  const desiredMaxHealth =
    Number(vessel.hpBase || 100) +
    Math.max(0, lv - 1) * 12 +
    Math.max(0, Number(game.ship.hull || 1) - 1) * 25;
  const oldMax = Number(game.maxHealth || 100);
  if (desiredMaxHealth > oldMax) {
    game.maxHealth = desiredMaxHealth;
    if (!Number.isFinite(Number(game.health))) game.health = game.maxHealth;
  }

  const desiredCargo =
    Number(vessel.cargoBase || 50) +
    Math.max(0, lv - 1) * 5 +
    Math.max(0, Number(game.ship.cargo || 1) - 1) * 25;
  game.cargoCapacity = Math.max(Number(game.cargoCapacity || 50), desiredCargo);
}

function shipUpgradeCost(type){
  const base = {hull:150, cannons:180, sails:120, cargo:140}[type] || 150;
  const current = Number(game.ship[type] || 0);
  const vesselFactor = 1 + (Number(game.shipTier || 0) * 0.15);
  const levelFactor = 1 + Math.max(0, level() - 1) * 0.025;
  return Math.round(base * (current + 1) * vesselFactor * levelFactor);
}
function buyVessel(vesselId) {
  const idx = VESSELS.findIndex(v => v.id === vesselId);
  const v = VESSELS[idx];
  if (!v) return;
  if (idx <= game.shipTier) { toast('You already have an equal or better hull.'); return; }
  if (level() < v.minLevel) { toast(`Requires Level ${v.minLevel} (currently Lv.${level()})`); return; }
  if (game.gold < v.cost) { toast('Not enough gold!'); return; }
  game.gold -= v.cost;
  game.shipTier = idx;
  game.cargoCapacity = Math.max(game.cargoCapacity, v.cargoBase);
  game.maxHealth = Math.max(game.maxHealth, v.hpBase);
  game.health = game.maxHealth;
  logEvent(`🚢 Commissioned ${v.name}! A finer ship for finer waters.`, 'gold');
  toast(`⚓ Welcome aboard ${v.name}!`);
  renderShipyard();
  updateUI();
}

// ---------------------------------------------------------------------------
// QUESTS — persistent contracts (unlike the daily Bounty Board), offered at
// the Tavern. Up to 10 active at once; a finished one is replaced by a fresh
// pull from the pool rather than resetting on a timer.
// ---------------------------------------------------------------------------
const QUEST_POOL = [
  {id:'q_reef',     type:'kill',  target:'wreck_crab',    need:5, icon:'🦀', name:'Clear the Reef',        desc:'Giant Wreck Crabs have been fouling anchorages up and down the strait. Thin them out.',      rw:{xp:300, gold:150, rep:5}},
  {id:'q_smugglers',type:'kill',  target:'smuggler_crew', need:4, icon:'🏴', name:"Smuggler's End",        desc:"A smuggling ring keeps slipping past every port watch. Break enough crews and word travels.", rw:{xp:350, gold:180, rep:8}},
  {id:'q_frigates', type:'kill',  target:'rival_frigate', need:2, icon:'🏴‍☠️', name:"Rival's Bounty",         desc:'Two rival captains have put a price on the Daybreak. Sink them first.',                       rw:{xp:400, gold:220, rep:15}},
  {id:'q_sirens',   type:'kill',  target:'siren_pack',    need:3, icon:'🧜‍♀️', name:"Siren's Silence",        desc:'Sirens have been luring merchant ships onto the rocks. Quiet them for good.',                  rw:{xp:320, gold:200, rep:10}},
  {id:'q_ghosts',   type:'kill',  target:'ghost_galleon', need:2, icon:'👻', name:'Ghost Story',            desc:"A ghost galleon's been sighted by three separate crews who swear they're not drinking again.", rw:{xp:480, gold:320, rep:12}},
  {id:'q_kraken',   type:'kill',  target:'kraken',        need:1, icon:'🦑', name:"Monster Hunter's Mark",  desc:'The old sailors say a kraken this size means a wreck worth finding underneath it.',           rw:{xp:650, gold:420, rep:20}},
  {id:'q_trade',    type:'trade_volume', target:null,     need:150, icon:'📦', name:'The Long Haul',        desc:'Move 150 units of cargo through your hold — buying or selling both count.',                   rw:{xp:280, gold:260, rep:5}},
  {id:'q_deliver_a', dynamic:'deliver'},
  {id:'q_deliver_b', dynamic:'deliver'}
];
// Delivery contracts are generated fresh each time they're picked — a random
// good, a random destination port that isn't wherever you're currently
// standing, and a payout scaled to the good's value and the quantity asked.
function generateDeliveryQuest(id) {
  const goodIds = Object.keys(GOODS).filter(g => g !== 'contraband');
  const goodId = goodIds[Math.floor(Math.random() * goodIds.length)];
  const good = GOODS[goodId];
  const destinations = PORTS.filter(p => p.id !== game.location);
  const dest = destinations[Math.floor(Math.random() * destinations.length)];
  const need = 10 + Math.floor(Math.random() * 16);
  const rw = {xp: Math.round(need * good.basePrice * 0.6), gold: Math.round(need * good.basePrice * 0.9), rep: 6};
  return {
    id, type: 'deliver', good: goodId, portId: dest.id, need, c: 0, done: false,
    icon: good.icon, name: `Deliver ${good.name} to ${dest.name}`,
    desc: `A merchant in ${dest.name} needs ${need}x ${good.icon} ${good.name}. Sell it to them there — selling elsewhere won't count.`,
    rw
  };
}
function refreshQuests() {
  if (!game.activeQuests) game.activeQuests = [];
  while (game.activeQuests.length < 10) {
    const activeIds = new Set(game.activeQuests.map(q => q.id));
    const available = QUEST_POOL.filter(q => !activeIds.has(q.id));
    if (!available.length) break;
    const pick = available[Math.floor(Math.random() * available.length)];
    if (pick.dynamic === 'deliver') game.activeQuests.push(generateDeliveryQuest(pick.id));
    else game.activeQuests.push(Object.assign({}, pick, {c: 0, done: false}));
  }
}
function checkQuestProgress(type, target, amount) {
  refreshQuests();
  game.activeQuests.forEach(q => {
    if (q.done || q.type !== type) return;
    if (type === 'kill' && q.target !== target) return;
    if (type === 'deliver' && (q.good !== target.good || q.portId !== target.portId)) return;
    q.c = Math.min(q.need, q.c + amount);
    if (q.c >= q.need) {
      q.done = true;
      gainXP(q.rw.xp);
      game.gold += q.rw.gold;
      game.reputation += q.rw.rep || 0;
      toast(`🎯 Quest complete: ${q.name} · +${q.rw.xp} XP · +${q.rw.gold}g`);
    } else if (typeof window.progressToast === 'function') {
      window.progressToast('📜 ' + q.name + ': ' + q.c + '/' + q.need);
    }
  });
  game.activeQuests = game.activeQuests.filter(q => !q.done);
  refreshQuests();
}
// BUG FIX: renderTavern() called questBoardHTML() but it was never defined
// (only its Temple counterpart, templeQuestBoardHTML(), existed) — the
// resulting ReferenceError aborted renderTavern() before it reached the
// potionShop line right after it, which is why Potions looked broken too.
function questBoardHTML() {
  refreshQuests();
  if (!game.activeQuests.length) return '<p style="font-size:0.85rem;opacity:0.7;">No contracts posted right now — check back after your next voyage.</p>';
  return `<div class="chapter-grid">${game.activeQuests.map(q => `<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.4rem;">${q.icon}</div><div><strong>${q.name}</strong><br><span style="font-size:0.8rem;opacity:0.8;">${q.desc}</span><br><b style="font-size:0.8rem;">${q.c}/${q.need} · ${q.rw.xp} XP + ${q.rw.gold}g${q.rw.rep ? ' + ' + q.rw.rep + ' rep' : ''}</b></div></div></article>`).join('')}</div>`;
}
function potionShopHTML(filterFn) {
  const items = POTION_CATALOG.filter(filterFn);
  if (!items.length) return '<p style="font-size:0.85rem;opacity:0.7;">Nothing in stock right now.</p>';
  return `<div class="potion-grid">${items.map(p => {
    const label = p.effect === 'heal' ? `Restores ${p.value} HP`
      : p.effect === 'mana' ? `Restores ${p.value} MP`
      : p.effect === 'repair' ? `Repairs ${p.value}% hull`
      : p.effect === 'damage' ? `${p.value} flat damage in battle` : '';
    return `<article class="potion-item"><strong>${p.icon} ${p.name}</strong><span class="potion-effect">${label}</span><span class="potion-tier">Tier ${p.tier}</span><button class="btn btn-small btn-success" onclick="buyPotion('${p.id}')">${p.price}g</button></article>`;
  }).join('')}</div>`;
}

// ---------------------------------------------------------------------------
// TEMPLE VOWS — a smaller, slower-turning companion to the Tavern's Quest
// Board (5 posted vs 10, cap of 4 active vs 4 available at a time out of a
// wider pool so postings actually rotate). Tracked separately from
// game.activeQuests so completing a tavern contract and a temple vow that
// happen to target the same enemy both progress independently.
// ---------------------------------------------------------------------------
const TEMPLE_QUEST_POOL = [
  {id:'tq_ghouls',    type:'kill', target:'harbor_ghoul',  need:6,  icon:'👺', name:'Cleanse the Dock Steps',  desc:'Harbor ghouls keep dragging themselves up near the shrine stairs. Clear them before they frighten off worshippers.', rw:{xp:260, gold:140, rep:8}},
  {id:'tq_smugglers', type:'kill', target:'smuggler_crew', need:5,  icon:'🏴', name:'Guard the Pilgrim Road',   desc:'Smugglers have been shaking down pilgrims on the road up to the shrine. Put a stop to it.',                          rw:{xp:280, gold:150, rep:9}},
  {id:'tq_sirens',    type:'kill', target:'siren_pack',    need:2,  icon:'🧜‍♀️', name:'Silence the Chorus',      desc:'The keeper believes sirens are luring pilgrim boats off course before they ever reach the shrine.',                 rw:{xp:300, gold:190, rep:10}},
  {id:'tq_frigates',  type:'kill', target:'rival_frigate', need:2,  icon:'🏴‍☠️', name:"The Shrine's Toll",       desc:'A rival crew has been extorting a "toll" from ships carrying offerings to the temple. They can stop, one way or another.', rw:{xp:340, gold:210, rep:12}},
  {id:'tq_galleon',   type:'kill', target:'ghost_galleon', need:1,  icon:'👻', name:'Lay the Dead to Rest',    desc:"A ghost galleon has circled the strait for weeks, its crew unable to find peace. The temple asks you to end its wandering.", rw:{xp:420, gold:260, rep:15}},
  {id:'tq_kraken',    type:'kill', target:'kraken',        need:1,  icon:'🦑', name:"The Deep One's Due",      desc:'The oldest carvings in the shrine warn of a debt owed to something in the deep. Pay it in steel instead.',           rw:{xp:600, gold:380, rep:22}},
  {id:'tq_tithe',     type:'trade_volume', target:null,    need:100,icon:'🕯️', name:'Tithe for the Shrine',    desc:'Move 100 units of cargo through your hold — the temple takes a tithe from every trade you make while this vow stands.', rw:{xp:220, gold:200, rep:12}}
];
function refreshTempleQuests() {
  if (!game.activeTempleQuests) game.activeTempleQuests = [];
  while (game.activeTempleQuests.length < 4) {
    const activeIds = new Set(game.activeTempleQuests.map(q => q.id));
    const available = TEMPLE_QUEST_POOL.filter(q => !activeIds.has(q.id));
    if (!available.length) break;
    const pick = available[Math.floor(Math.random() * available.length)];
    game.activeTempleQuests.push(Object.assign({}, pick, {c: 0, done: false}));
  }
}
function checkTempleQuestProgress(type, target, amount) {
  refreshTempleQuests();
  game.activeTempleQuests.forEach(q => {
    if (q.done || q.type !== type) return;
    if (type === 'kill' && q.target !== target) return;
    q.c = Math.min(q.need, q.c + amount);
    if (q.c >= q.need) {
      q.done = true;
      gainXP(q.rw.xp);
      game.gold += q.rw.gold;
      game.reputation += q.rw.rep || 0;
      toast(`⛩️ Vow fulfilled: ${q.name} · +${q.rw.xp} XP · +${q.rw.gold}g`);
    } else if (typeof window.progressToast === 'function') {
      window.progressToast('⛩️ ' + q.name + ': ' + q.c + '/' + q.need);
    }
  });
  game.activeTempleQuests = game.activeTempleQuests.filter(q => !q.done);
  refreshTempleQuests();
}
function templeQuestBoardHTML() {
  refreshTempleQuests();
  if (!game.activeTempleQuests.length) return '<p style="font-size:0.85rem;opacity:0.7;">No vows posted right now — check back after your next voyage.</p>';
  return `<p style="font-size:0.8rem;opacity:0.75;margin-bottom:10px;">Sacred vows — fewer than the Tavern's contracts, but the shrine remembers who keeps them.</p><div class="chapter-grid">${game.activeTempleQuests.map(q => `<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.4rem;">${q.icon}</div><div><strong>${q.name}</strong><br><span style="font-size:0.8rem;opacity:0.8;">${q.desc}</span><br><b style="font-size:0.8rem;">${q.c}/${q.need} · ${q.rw.xp} XP + ${q.rw.gold}g${q.rw.rep ? ' + ' + q.rw.rep + ' rep' : ''}</b></div></div></article>`).join('')}</div>`;
}

// ---------------------------------------------------------------------------
// GAME STATE
// ---------------------------------------------------------------------------
const SAVE_KEY = 'daybreak_crimson_tide_v2'; // intentionally unchanged for save compatibility
// Root-cause flag for the "hard refresh resets progress to level 1" bug:
// persistAFKTimestamp() is wired to the browser's visibilitychange/pagehide
// events, which fire on EVERY tab hide, close, or refresh — including a
// hard refresh sitting on the landing screen before "Continue Voyage" has
// ever been clicked this session. Since `game` starts as the fresh default
// object below until loadGame()/startGame() actually runs, that unconditional
// write was overwriting the real save in localStorage with a blank level-1
// game the instant the page was hidden or reloaded. This flag is set true
// only once a real voyage (loaded or new) is actually active, and
// persistAFKTimestamp() below no-ops until then.
let gameSessionActive = false;
let game = {
  temporaryCrew: [],
  gold: 300, day: 1, location: 'singapore', health: 100, maxHealth: 100,
  cargo: {}, cargoPurchaseCost: {}, cargoCapacity: 50, cargoUsed: 0,
  ship: { hull: 1, cannons: 1, sails: 1, cargo: 1 }, shipTier: 0,
  reputation: 0, xp: 0, xpTotal: 0,
  rumors: [], marketPrices: {}, difficulty: 'normal', log: [],
  shipName: 'The Daybreak',
  foundCompanions: {}, finalCleared: false, clearedGuardians: {}, storyModalQueue: [],
  bounties: [], bountyDay: null,
  activeQuests: [], completedQuestIds: [], activeTempleQuests: [], tradeVolume: 0, act2Index: 0, act3Index: 0, act4Index: 0, comicProgress: {}, storyQuestProgress: {}, arc1Objective: null, malaccaPrepStep: 0,
  inCombat: false, combatEnemy: null, combatEnemyHp: 0,
  combatTurn: 0, combatRound: 1, combatLog: [], combatSessionId: 0, combatResolved: false,
  partyHp: {}, partyMp: {}, shieldTurns: 0, shieldPct: 0,
  hasteTurns: 0, hastePct: 0, timeStopTurns: 0, markedBoss: false,
  enemyVulnerable: 0, enemyVulnerablePct: 0,
  defending: {}, enemyStatus: null, pendingPostBattle: null,
  inventory: [], consumables: {}, equippedTrophies: {},
  equipmentInventory: [],
  equippedGear: {},
  equipmentTraders: {},

  autoBattle: false, spellMenuOpen: false, itemMenuOpen: false, skillMenuOpen: false,
  discoveredAbilities: [], growthUsedThisBattle: {}, nervousCourageActive: false,
  exploreTarget: null,
  lastActiveAt: null,
  lastLoginDate: null, loginStreak: 0, dailyRewardClaimed: false,
  weeklyRewardClaimedStreak: 0
};

function crimsonXPPercent() {
  const xp = Number(game.xpTotal || 0);
  const lv = level();
  const prev = xpForLevel(lv);
  const next = xpForLevel(lv + 1);
  return Math.max(0, Math.min(100, ((xp - prev) / Math.max(1, next - prev)) * 100));
}

// BUG FIX: level() used to be `let l=1; while(l*100<=xpTotal) l++`, i.e. a
// flat 100 XP per level forever — no growth curve at all. xpTotal (fed by
// kills, quests, bounties, temple vows, and AFK rewards) climbing into the
// tens of thousands over extended play is how a save ends up reporting
// something like "Level 1808" — technically correct arithmetic, just on a
// curve that never got harder to climb. xpForLevel(l) is the cumulative XP
// required to REACH level l; it grows quadratically so each level costs
// progressively more, which keeps the level number sane under normal play
// without an artificial ceiling — deliberately uncapped since Arc 5–8
// content will need to gate on levels above the old level-26 range.
// Curve steepness: this constant is the single knob for how fast leveling
// feels. k=50 puts ~180k XP (roughly what a week of heavy dev/testing play
// generates) at level 60, which matches expectations for that much testing
// — that 7-day span was development/testing time, not typical player
// pacing, so it's a reasonable anchor rather than something to slow down.
// Since the game is ongoing (Arc 5 in progress, more planned indefinitely),
// there's no ceiling — bump this up later if real player pacing runs hot
// once Arc 5+ content and its level gates are actually in.
function xpForLevel(l) { return 50 * (l - 1) * l; }
function level() {
  let l = 1;
  while (xpForLevel(l + 1) <= game.xpTotal) l++;
  return l;
}

// ---------------------------------------------------------------------------

function renderLanding() {
  const portNames = {
    singapore:'Singapore', malacca:'Malacca', bangkok:'Bangkok',
    hanoi:'Hanoi', manila:'Manila', palembang:'Palembang', batavia:'Batavia'
  };
  const port = portNames[game.location] || (game.location ? String(game.location).replace(/\b\w/g, c => c.toUpperCase()) : 'Singapore');
  const lvl = level();
  const xp = Number(game.xpTotal || 0);
  const pct = crimsonXPPercent();

  const portEl = document.getElementById('landingPort');
  const dayEl = document.getElementById('landingDay');
  const capEl = document.getElementById('landingCaptain');
  const xpEl = document.getElementById('landingXP');
  const barEl = document.getElementById('landingXPBar');
  const ribbonEl = document.getElementById('landingRibbon');
  if (portEl) portEl.textContent = port;
  if (dayEl) dayEl.textContent = `Day ${game.day || 1} · ${game.shipName || 'The Daybreak'}`;
  if (capEl) capEl.textContent = `Lv. ${lvl} San`;
  if (xpEl) xpEl.textContent = `${Math.round(pct)}% → NEXT LEVEL`;
  if (barEl) barEl.style.width = pct + '%';
  const portXpText = document.getElementById('portXPText');
  const portXpBar = document.getElementById('portXPBar');
  if (portXpText) portXpText.textContent = `${Math.round(pct)}% → NEXT LEVEL`;
  if (portXpBar) portXpBar.style.width = pct + '%';

  if (ribbonEl) {
    const act = Number(game.act3Index || 0) > 0 ? 'ORIGINS' : (Number(game.act2Index || 0) > 0 ? 'FAIR WINDS, FULL HANDS' : 'THE SCATTERING');
    ribbonEl.textContent = `${act} · A DAYBREAK VOYAGE`;
  }
}




function renderLandingSaveState(){
  updateLandingPrimaryAction();
  const el = document.getElementById('v24SaveState');
  if (!el) return;
  let hasSave = false;
  try { hasSave = !!localStorage.getItem(SAVE_KEY); } catch(e) {}
  el.textContent = hasSave ? '💾 SAVED VOYAGE DETECTED' : '⚓ NEW VOYAGE';
}


function renderAFKWelcome() {
  const el = document.getElementById('v28AFK');
  if (!el) return;
  let raw = null;
  try { raw = localStorage.getItem(SAVE_KEY); } catch(e) {}
  if (!raw) {
    el.textContent = '⚓ New voyage — no offline earnings yet.';
    return;
  }
  try {
    const saved = JSON.parse(raw);
    const previous = Number(saved.lastActiveAt || 0);
    if (!previous) {
      el.textContent = '⏳ AFK rewards begin after your first departure.';
      return;
    }
    const mins = Math.floor(Math.max(0, Math.min(8, (Date.now()-previous)/3600000)) * 60);
    if (mins < 1) {
      el.textContent = '⏳ No offline earnings yet.';
      return;
    }
    const gold = Math.floor(mins * 2);
    const xp = Math.floor(mins * 3);
    const h = Math.floor(mins/60), m = mins % 60;
    const duration = h ? `${h}h ${m}m` : `${m}m`;
    el.textContent = `⏳ Welcome back — ${duration} offline · +${gold}g · +${xp} XP`;
  } catch(e) {
    el.textContent = '⏳ Offline earnings unavailable.';
  }
}

function renderLandingV24(){
  // If a saved voyage exists, show its real values on the landing screen.
  // This is read-only: no assignment to `game` and no localStorage writes.
  let display = game;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && typeof saved === 'object') {
        display = Object.assign({}, game, saved);
        if (!Number.isFinite(Number(display.xpTotal))) {
          display.xpTotal = Number(display.xp || 0);
        }
      }
    }
  } catch(e) {
    display = game;
  }

  const portNames = {
    singapore:'Singapore', malacca:'Malacca', bangkok:'Bangkok',
    hanoi:'Hanoi', manila:'Manila', palembang:'Palembang', batavia:'Batavia'
  };
  const port = portNames[display.location] ||
    (display.location ? String(display.location).replace(/\b\w/g,c=>c.toUpperCase()) : 'Singapore');

  const xpTotal = Math.max(0, Number(display.xpTotal || 0));
  const lvl = (() => {
    let l = 1;
    while (xpForLevel(l + 1) <= xpTotal) l++;
    return l;
  })();

  const pct = (() => {
    const prev = xpForLevel(lvl);
    const next = xpForLevel(lvl + 1);
    if (next <= prev) return 0;
    return Math.max(0, Math.min(100, ((xpTotal - prev) / (next - prev)) * 100));
  })();

  const partyHp = display.partyHp || {};
  const hp = Number(
    partyHp.san ?? display.health ?? 0
  );
  const maxHp = Number(display.maxHealth || 82);
  const renown = Number(display.renown ?? display.reputation ?? 0);
  const gold = Number(display.gold || 0);
  const ship = display.shipName || 'The Daybreak';

  const set = (id, value) => {
    const e = document.getElementById(id);
    if (e) e.textContent = value;
  };

  set('v24Captain','San');
  set('v24Port',port);
  set('v24Ship',ship);
  set('v24Level',lvl);
  set('v24HP',`${Math.max(0,hp)} / ${maxHp}`);
  set('v24Gold',`${gold.toLocaleString()}g`);
  set('v24Renown',renown.toLocaleString());
  set('v24XPText',`${Math.round(pct)}%`);

  const bar = document.getElementById('v24XPBar');
  if (bar) bar.style.width = pct + '%';
}


function showSettings() {
  showModal('Settings',
    `<div style="display:grid;gap:10px;">
      <label style="font-size:.8rem;color:var(--gold);">Ship Name</label>
      <input id="landingShipNameEdit" value="${esc(game.shipName || 'The Daybreak')}"
        style="padding:10px;border:1px solid var(--sand);border-radius:7px;background:rgba(0,0,0,.35);color:var(--parchment);">
      <label style="display:flex;align-items:center;gap:9px;font-size:.85rem;color:var(--parchment);cursor:pointer;">
        <input id="landingMusicEnabledEdit" type="checkbox" ${ctMusicEnabled ? 'checked' : ''}> 🎵 Music enabled
      </label>
      <label style="font-size:.8rem;color:var(--gold);">Music volume</label>
      <input id="landingMusicVolumeEdit" type="range" min="0" max="1" step="0.01" value="${ctMusicVolume}" oninput="ctSetMusicVolume(this.value)" style="width:100%;">
      <label style="font-size:.8rem;color:var(--gold);">Difficulty</label>
      <select id="landingDifficultyEdit"
        style="padding:10px;border:1px solid var(--sand);border-radius:7px;background:rgba(0,0,0,.35);color:var(--parchment);">
        <option value="easy">Gentle Breeze (Easy)</option>
        <option value="normal">Trade Winds (Normal)</option>
        <option value="hard">Typhoon Season (Hard)</option>
      </select>
    </div>`,
    [
      {text:'Save', action:() => {
        const n = document.getElementById('landingShipNameEdit');
        const d = document.getElementById('landingDifficultyEdit');
        if (n && n.value.trim()) game.shipName = n.value.trim();
        if (d) game.difficulty = d.value;
        const music = document.getElementById('landingMusicEnabledEdit');
        if (music) ctSetMusicEnabled(music.checked);
        renderLanding();
        closeModal();
        toast('⚙ Settings updated.');
      }},
      {text:'Close', action:closeModal}
    ]
  );
  setTimeout(() => {
    const d = document.getElementById('landingDifficultyEdit');
    if (d) d.value = game.difficulty || 'normal';
  }, 0);
}


// ---------------------------------------------------------------------------
// STORY MODE — illustrated virtual novel prototype
// ---------------------------------------------------------------------------
const STORY_MODE_CHAPTERS = {
1: [
  {image:'assets/comics/arc1/story/ch01/01-opening.png', text:'Three months after the storm, San wakes with the sea around her and a silence where familiar names should be.', caption:'Survival is the first memory.'},
  {image:'assets/comics/arc1/story/ch01/02-storm-ship.png', text:'The Crimson Tide survived the wreck. San did too. But the storm scattered more than wood and cargo.', caption:'The ship remains. The crew does not.'},
  {image:'assets/comics/arc1/story/ch01/03-eyes.png', text:'She looks out across the water, searching faces that should mean something to her.', caption:'Every face is a stranger.'},
  {image:'assets/comics/arc1/story/ch01/04-what-san-knows.png', text:'There is only one certainty left: the people beside her are her crew. The rest must be remembered — or found.', caption:'What San knows.'},
  {image:'assets/comics/arc1/story/ch01/05-soel.png', text:'Soel stays close. The strange little spirit cat seems to understand the weight of what has been lost.', caption:'Some bonds survive without names.'},
  {image:'assets/comics/arc1/story/ch01/06-ship.png', text:'San returns to the deck. There are no answers here yet, only a ship, an open sea, and somewhere else to go.', caption:'The voyage begins.'},
  {image:'assets/comics/arc1/story/ch01/07-crew.png', text:'She looks at the empty places where familiar people should stand.', caption:'The crew is scattered.'},
  {image:'assets/comics/arc1/story/ch01/08-san.png', text:'San tightens her grip and makes the only decision that matters.', caption:'If they are out there, I will find them.'},
  {image:'assets/comics/arc1/story/ch01/09-ending.png', text:'The Crimson Tide turns toward the horizon. Somewhere beyond the charts, the first trail is waiting.', caption:'And so the search begins.'}
],
2: [
  {image:'assets/comics/arc1/story/ch02/01.jpg', text:'Three days at sea. Three days without land. At last, the Crimson Tide reaches Malacca, the first great port of the new world.', caption:'The First Port.'},
  {image:'assets/comics/arc1/story/ch02/02.jpg', text:'The harbour is crowded with merchants, ships, languages and unfamiliar faces. San does not know this world yet.', caption:'New people. New stories. New dangers.'},
  {image:'assets/comics/arc1/story/ch02/03.jpg', text:'She studies the harbour through tired eyes. She cannot remember this place, but something tells her to keep looking.', caption:'Step by step. Port by port.'},
  {image:'assets/comics/arc1/story/ch02/04.jpg', text:'San begins gathering what she can learn: trade routes, smugglers, rumours, and the places where information changes hands.', caption:'What San learns.'},
  {image:'assets/comics/arc1/story/ch02/05.jpg', text:'Soel watches the crowd from beside her. His spirit bell rings softly, as if he senses that this place has many stories.', caption:'Soel listens.'},
  {image:'assets/comics/arc1/story/ch02/06.jpg', text:'A few words from strangers become leads. Malacca remembers people who have passed through — even when San cannot.', caption:'Where do we even start?'},
  {image:'assets/comics/arc1/story/ch02/07.jpg', text:'Rumours spread through the market: strange ships, smugglers, an old ruin, and a warrior no one knows by name.', caption:'Rumours in the market.'},
  {image:'assets/comics/arc1/story/ch02/08.jpg', text:'Every rumour points somewhere different. San realizes that finding one person may mean following several trails at once.', caption:'A port full of trails.'},
  {image:'assets/comics/arc1/story/ch02/09.jpg', text:'One story speaks of a lone warrior fighting a terrible creature among old ruins.', caption:'A warrior alone.'},
  {image:'assets/comics/arc1/story/ch02/10.jpg', text:'Another says the authorities have offered a reward to anyone brave enough to investigate.', caption:'Someone has not returned.'},
  {image:'assets/comics/arc1/story/ch02/11.jpg', text:'San studies the map. The harbour is only the beginning. The trail leads beyond the safe streets.', caption:'Malacca.'},
  {image:'assets/comics/arc1/story/ch02/12.jpg', text:'The Crimson Tide is small and scarred, but it is enough for now. San needs a ship, a crew, and reasons to stay.', caption:'A ship. A crew. A reason.'},
  {image:'assets/comics/arc1/story/ch02/13.jpg', text:'She looks across the busy harbour and accepts that this journey will not be solved in a single day.', caption:'The journey continues.'},
  {image:'assets/comics/arc1/story/ch02/14.jpg', text:'Soel remains beside her. Whatever comes next, she is no longer completely alone.', caption:'Not anymore.'},
  {image:'assets/comics/arc1/story/ch02/15.jpg', text:'One port lies behind them. The world ahead is wide, and somewhere in it is the first person San intends to bring home.', caption:'The search begins in Malacca.'}
],
3: [
  {image:'assets/comics/arc1/story/ch03/01.jpg', text:'A ship is nothing without its crew. San can no longer pretend she can do this alone.', caption:'A Crew of Choice.'},
  {image:'assets/comics/arc1/story/ch03/02.jpg', text:'The Crimson Tide is damaged, short-handed and still unfamiliar. Waiting will not change that.', caption:'The Crimson Tide was not ready.'},
  {image:'assets/comics/arc1/story/ch03/03.jpg', text:'San begins looking for people who can keep the ship alive: someone who knows the waters, someone who can mend, someone who can see danger first.', caption:'What San needs.'},
  {image:'assets/comics/arc1/story/ch03/04.jpg', text:'Kael knows winds and currents. His confidence is practical rather than heroic.', caption:'The helmsman.'},
  {image:'assets/comics/arc1/story/ch03/05.jpg', text:'Mei can mend sails and tend wounds. She notices problems before they become disasters.', caption:'The shipwright and healer.'},
  {image:'assets/comics/arc1/story/ch03/06.jpg', text:'Rian watches the harbour from above, quick-eyed and quicker on his feet.', caption:'The scout.'},
  {image:'assets/comics/arc1/story/ch03/07.jpg', text:'Toran is a wall of muscle, but there is care behind the strength. He keeps watch because someone has to.', caption:'The guard.'},
  {image:'assets/comics/arc1/story/ch03/08.jpg', text:'San does not recruit legends. She chooses people willing to stand beside her.', caption:'Loyalty is earned, not demanded.'},
  {image:'assets/comics/arc1/story/ch03/09.jpg', text:'The ship is repaired a little at a time. Routes are studied. Supplies are counted. The risk is calculated.', caption:'The Crimson Tide, in progress.'},
  {image:'assets/comics/arc1/story/ch03/10.jpg', text:'There is enough food. Enough water. Enough hope to continue.', caption:'Enough for now.'},
  {image:'assets/comics/arc1/story/ch03/11.jpg', text:'The crew gathers around the table. None of them know why this feels more important than a contract.', caption:'A crew begins at a table.'},
  {image:'assets/comics/arc1/story/ch03/12.jpg', text:'The Crimson Tide is not a perfect ship. It does not need to be.', caption:'A ship becomes a home.'},
  {image:'assets/comics/arc1/story/ch03/13.jpg', text:'They are not family. They are not bound by blood. But they choose this together.', caption:'We choose this.'},
  {image:'assets/comics/arc1/story/ch03/14.jpg', text:'San looks toward the sea with Soel beside her. The future is uncertain, but the choice is theirs.', caption:'We will learn. We will survive.'},
  {image:'assets/comics/arc1/story/ch03/15.jpg', text:'The Crimson Tide sets sail. Not as heroes. Not as legends. Just as people looking for a tomorrow.', caption:'The journey begins.'}
],
4: [
  {image:'assets/comics/arc1/story/ch04/01.jpg', text:'Rumours spread through every port: a warrior alone in ruined fortifications, guarding something no one dares approach.', caption:"The Guardian's Fortress."},
  {image:'assets/comics/arc1/story/ch04/02.jpg', text:'San watches the ruins from the water. A captain does not throw her crew into the unknown without learning what waits there.', caption:'Observe. Learn. Plan.'},
  {image:'assets/comics/arc1/story/ch04/03.jpg', text:'The sight feels strangely familiar. San cannot explain why the thought of the warrior pulls at something inside her.', caption:'Why does it feel like I should know him?'},
  {image:'assets/comics/arc1/story/ch04/04.jpg', text:'The creature appears only at dusk. Previous attempts ended in failure. The guardian refuses to leave.', caption:'What we know.'},
  {image:'assets/comics/arc1/story/ch04/05.jpg', text:'San studies the battlefield. The warrior is not simply a prisoner. He is a guardian.', caption:'He is not a prisoner.'},
  {image:'assets/comics/arc1/story/ch04/06.jpg', text:'The crew questions whether they should interfere. San knows that leaving him behind feels wrong.', caption:'One decision.'},
  {image:'assets/comics/arc1/story/ch04/07.jpg', text:'They begin with observation. First they learn the guardian’s pattern.', caption:'1. Observe.'},
  {image:'assets/comics/arc1/story/ch04/08.jpg', text:'Two ships will approach from the south and create a distraction.', caption:'2. Distract.'},
  {image:'assets/comics/arc1/story/ch04/09.jpg', text:'The fighters will approach from the cliff side while the opening appears.', caption:'3. Flank.'},
  {image:'assets/comics/arc1/story/ch04/10.jpg', text:'Medical supplies are prepared. The goal is not to destroy the guardian.', caption:'4. Heal and support.'},
  {image:'assets/comics/arc1/story/ch04/11.jpg', text:'The retreat route is chosen before the fight begins. If the plan fails, everyone comes home.', caption:'5. Extraction.'},
  {image:'assets/comics/arc1/story/ch04/12.jpg', text:'San traces the plan on the map. Red will distract. Blue will flank. Green will extract.', caption:'One team. One plan.'},
  {image:'assets/comics/arc1/story/ch04/13.jpg', text:'San makes the objective clear: they are not here to kill the guardian.', caption:'We are here to bring him home.'},
  {image:'assets/comics/arc1/story/ch04/14.jpg', text:'Hands meet over the table. Whatever happens next, nobody is left behind.', caption:'One team. No one left behind.'},
  {image:'assets/comics/arc1/story/ch04/15.jpg', text:'Tomorrow, the Crimson Tide will enter the ruins. Tomorrow, San will finally meet the person she has been searching for.', caption:'The rescue begins.'}
]
};
let storyModeChapter = null;
let storyModeChapterId = null;
let storyModeIndex = 0;
let storyModePending = null;
let storyModeTransitionTimer = null;
let storyModeLaunching = false;

function openStoryMode(chapterId, options={}){
  const chapter = STORY_MODE_CHAPTERS[chapterId];
  if(!chapter){ console.warn('[StoryMode] openStoryMode: no chapter data for', chapterId); return false; }
  game.comicProgress = game.comicProgress || {};
  if(game.comicProgress[chapterId] && !options.replay){ console.warn('[StoryMode] openStoryMode: chapter already complete', chapterId); return false; }
  const overlay=document.getElementById('storyModeOverlay');
  if(!overlay){ console.warn('[StoryMode] openStoryMode: #storyModeOverlay missing from DOM'); return false; }
  storyModeLaunching = true;
  try {
    storyModePending = null;
    storyModeChapter = chapter;
    storyModeChapterId = chapterId;
    storyModeIndex = 0;
    // finishStoryModeChapter() replaces the ENTIRE .story-mode-shell innerHTML
    // with a "Chapter Complete" screen, permanently destroying #storyModePanel
    // and #storyModeCounter in the process. Every open must therefore rebuild
    // the shell's base structure fresh — it can never be assumed to still
    // exist after a previous chapter finished. This was the actual root cause
    // of chapters silently failing to display after the first one completed.
    const shell = overlay.querySelector('.story-mode-shell');
    if(shell){
      shell.innerHTML = `<div class="story-mode-top"><div><div class="story-mode-kicker">Story Mode</div><div id="storyModeTitle" class="story-mode-title"></div></div><div id="storyModeCounter" class="story-mode-counter"></div></div><div id="storyModePanel" class="story-mode-panel"></div>`;
      const titleEl = document.getElementById('storyModeTitle');
      if(titleEl){
        const meta = (typeof ARC1_COMICS !== 'undefined') ? ARC1_COMICS.find(c=>c.id===chapterId) : null;
        titleEl.textContent = meta ? `Chapter ${chapterId} — ${meta.title}` : `Chapter ${chapterId}`;
      }
    } else {
      console.error('[StoryMode] openStoryMode: .story-mode-shell missing from DOM — cannot rebuild panel');
    }
    overlay.style.display='flex';
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    ctPlayMusic('explore');
    renderStoryModePanel();
    storyModeLaunching = false;
    const panelExists = !!document.getElementById('storyModePanel');
    console.log('[StoryMode] openStoryMode SUCCESS for chapter', chapterId, '- overlay display now:', overlay.style.display, 'active class:', overlay.classList.contains('active'), '- #storyModePanel exists:', panelExists);
    return true;
  } catch(e) {
    // Never leave storyModeLaunching stuck true — that would silently block
    // every future attempt to open Story Mode for the rest of the session.
    console.error('[StoryMode] openStoryMode threw:', e);
    storyModeLaunching = false;
    storyModeChapter = null;
    storyModeChapterId = null;
    if(overlay){ overlay.classList.remove('active'); overlay.setAttribute('aria-hidden','true'); overlay.style.display='none'; }
    document.body.style.overflow='';
    toast('⚠️ Story Mode hit an error opening this chapter. Please try again.');
    return false;
  }
}

function requestStoryMode(chapterId, delay=450){
  // Every early-return path below surfaces a toast + console.warn. A tap
  // that visibly does nothing is undebuggable on a phone with no devtools —
  // this makes "why didn't it open" answerable from the log/toast alone.
  if(!STORY_MODE_CHAPTERS[chapterId]){ console.warn('[StoryMode] no chapter data for id', chapterId); toast('⚠️ Story Mode error: chapter data missing.'); return; }
  if(!game){ console.warn('[StoryMode] game object not ready'); toast('⚠️ Story Mode error: game not loaded yet.'); return; }
  if(storyModeChapter){ console.warn('[StoryMode] blocked: a chapter is already open', storyModeChapterId); toast('📖 Story Mode is already open.'); return; }
  if(storyModeLaunching){ console.warn('[StoryMode] blocked: storyModeLaunching stuck true — recovering'); storyModeLaunching=false; }
  const required={1:'begin_chapter_1',2:'complete_chapter_2',3:'complete_chapter_3',4:'complete_chapter_4'}[chapterId];
  // A chapter is playable when its matching Objective is current. Previous
  // chapters are never required to be re-opened, and live Objective state is
  // checked directly so no browser refresh is needed.
  if(required && objectiveState()!==required && !game.comicProgress?.[chapterId]) { console.warn('[StoryMode] blocked: objective mismatch. required=',required,'current=',objectiveState()); toast('🔒 Follow the current Objective first.'); return; }
  if(game.comicProgress?.[chapterId]){ console.warn('[StoryMode] blocked: chapter already marked complete', chapterId); toast('✓ This chapter is already complete. Open Story to see what\'s next.'); return; }
  // Previously this deferred to a setTimeout(attempt, delay) before opening,
  // mirroring the same "Play Story Mode" action available lower down on the
  // Comic Archive (which calls openStoryMode() directly, no timer, and has
  // proven reliable). The deferred timer was found to silently never fire on
  // at least one real device/browser, with no error of any kind — so it's
  // removed. Both buttons now behave identically: open immediately.
  const opened=openStoryMode(chapterId);
  if(!opened){ console.warn('[StoryMode] openStoryMode returned false for', chapterId); toast('⚠️ Story Mode failed to open. Please try again.'); }
}

function renderStoryModePanel(){
  if(!storyModeChapter) return;
  const p=storyModeChapter[storyModeIndex];
  const panel=document.getElementById('storyModePanel');
  const counter=document.getElementById('storyModeCounter');
  if(!panel||!p) return;
  panel.innerHTML=`<div class="story-mode-image-wrap"><img class="story-mode-image" src="${p.image}" alt="Chapter ${storyModeChapterId} story panel ${storyModeIndex+1}" draggable="false"></div><div class="story-mode-text"><div class="story-mode-speaker">${esc(p.caption)}</div><div class="story-mode-caption">${esc(p.text)}</div></div><div class="story-mode-tap">Tap the screen to continue</div>`;
  if(counter) counter.textContent=`${storyModeIndex+1} / ${storyModeChapter.length}`;
  window.scrollTo({top:0,left:0,behavior:'instant'});
  // Diagnostic: confirm whether this panel's image actually loads. A broken
  // image path would make the overlay open successfully but look identical
  // to "nothing happened" if there's no visible fallback content.
  const img = panel.querySelector('img.story-mode-image');
  if(img){
    img.addEventListener('load', ()=>console.log('[StoryMode] image loaded OK:', p.image), {once:true});
    img.addEventListener('error', ()=>console.error('[StoryMode] IMAGE FAILED TO LOAD:', p.image), {once:true});
  }
}
window.advanceStoryMode = function(){
  try {
    if(!storyModeChapter) return;
  if(storyModeIndex < storyModeChapter.length-1){ storyModeIndex++; renderStoryModePanel(); return; }
  finishStoryModeChapter(storyModeChapterId);
  } catch(e) {
    console.error('Story Mode advance error:', e);
    toast('Story Mode encountered an error. Please tap again.');
  }
};

function nextAutoStoryChapter(id){
  // Story chapters are event-driven. Completion never silently chains into
  // another chapter; the Story Quest determines the next objective.
  return null;
}

function finishStoryModeChapter(id){
  const overlay=document.getElementById('storyModeOverlay');
  const ch=ARC1_COMICS.find(x=>x.id===id);
  game.comicProgress=game.comicProgress||{};
  if(!game.comicProgress[id]){
    game.comicProgress[id]=true;
    gainXP(ch?.xp || (id===1?150:150));
    game.reputation=(game.reputation||0)+1;
    logEvent(`📖 Story Mode Chapter ${id} complete: ${ch?.title || 'The Voyage'} · +${ch?.xp || 150} XP`,'gold');
    syncArc1StoryQuestProgress();
    saveGame();
    if(id===1) completeObjectiveAndRefresh(level()>=5 ? 'sail_malacca' : 'reach_level_5','Chapter 1');
    if(id===2) completeObjectiveAndRefresh('recruit_crew','Chapter 2');
    if(id===3) completeObjectiveAndRefresh('plan_with_crew','Chapter 3');
    if(id===4) completeObjectiveAndRefresh('recruit_joel','Chapter 4');
    try { renderMainGoal(); } catch(e) {}
  }
  const autoNext=nextAutoStoryChapter(id);
  if(overlay){
    const shell=overlay.querySelector('.story-mode-shell');
    if(shell){
      const title=ch?.title || `Chapter ${id}`;
      const next = getStoryModeNextStep(id);
      const nextChapter = null;
      const canContinueStory = false;
      const continueLabel = 'CONTINUE';
      shell.innerHTML=`<div class="story-mode-end"><div class="story-mode-kicker">Chapter Complete</div><h2>${esc(title)}</h2><p>The chapter is complete. Your current Objective is now updated.</p><div style="color:var(--gold);font-family:Cinzel;margin-bottom:18px;">📖 Story XP +${ch?.xp || 150}</div><button id="storyModeCloseBtn" type="button" class="btn btn-success" onclick="continueStoryFlow(${id}); return false;">${continueLabel}</button></div>`;
      if(autoNext){
        clearTimeout(storyModeTransitionTimer);
        let count=2;
        const tick=()=>{
          if(!storyModeChapter || storyModeChapterId!==id) return;
          const el=document.getElementById('storyModeCountdown');
          if(count>0){ if(el) el.textContent=`NEXT SCENE IN ${count}…`; count--; storyModeTransitionTimer=setTimeout(tick,800); return; }
          storyModeChapter=null; storyModeChapterId=null; storyModeIndex=0;
          overlay.classList.remove('active'); overlay.setAttribute('aria-hidden','true'); overlay.style.display='none';
          document.body.style.overflow='';
          // Re-open immediately; no refresh, no manual archive click.
          requestStoryMode(autoNext,80);
        };
        storyModeTransitionTimer=setTimeout(tick,700);
      }
    }
  }
}
function getStoryModeNextStep(id){
  const q=currentArc1StoryQuest();
  if(id===1){
    if(level()<5) return {message:'The storm chapter is complete. Your next objective is shown by the Goal Toast and Current Objective.'};
    return {message:'The storm chapter is complete. Your next objective is shown by the Goal Toast and Current Objective.'};
  }
  if(id===2){
    return {message:'The chapter is complete. Your next objective is shown by the Goal Toast and Current Objective.'};
  }
  if(id===3){
    return {message:'The chapter is complete. Your next objective is shown by the Goal Toast and Current Objective.'};
  }
  if(id===4){
    return {message:'The chapter is complete. Your next objective is shown by the Goal Toast and Current Objective.'};
  }
  return {message:'The chapter is complete. Your next objective is shown by the Goal Toast and Current Objective.'};
}
function continueStoryFlow(id){
  // Manual Story Mode: completion is committed first, then the Story screen
  // is rebuilt through the normal screen-navigation path. This guarantees
  // newly unlocked chapters appear immediately without a browser refresh.
  clearTimeout(storyModeTransitionTimer);
  storyModePending=null;
  const overlay=document.getElementById('storyModeOverlay');
  if(overlay){
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden','true');
    overlay.style.display='none';
  }
  document.body.style.overflow='';
  storyModeChapter=null;
  storyModeChapterId=null;
  storyModeIndex=0;
  try {
    // Persist the already-updated in-memory state before rebuilding the screen.
    saveGameQuiet();
    // Use the canonical navigation path so all Story-dependent UI is rebuilt
    // from the same current state in one pass.
    goScreen('story');
    requestAnimationFrame(()=>{
      try { renderStory(); renderMainGoal(); updateUI(); } catch(e) { console.error('Story post-refresh render error:',e); }
    });
  } catch(e) {
    console.error('Story completion refresh error:',e);
    const storyScreen=document.getElementById('storyScreen');
    if(storyScreen){
      document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
      storyScreen.classList.add('active');
      try { renderStory(); renderMainGoal(); updateUI(); } catch(err) { console.error(err); }
    }
    window.scrollTo(0,0);
  }
}

function closeStoryMode(){
  clearTimeout(storyModeTransitionTimer);
  storyModePending=null;
  const overlay=document.getElementById('storyModeOverlay');
  if(overlay){
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden','true');
    overlay.style.display='none';
  }
  document.body.style.overflow='';
  storyModeChapter=null;
  storyModeChapterId=null;
  storyModeIndex=0;
  try { goScreen('port'); } catch(e){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    const portScreen=document.getElementById('portScreen');
    if(portScreen) portScreen.classList.add('active');
    try { updateUI(); } catch(err) {}
    window.scrollTo(0,0);
  }
  // Do not auto-fire a completed chapter. Arrival triggers are handled by
  // doVoyage; completion only returns to the game unless a chain is active.
}
function maybeLaunchPendingStory(){
  // Story Mode deliberately does NOT auto-fire on save/load or screen render.
  // Chapter 1 fires only from startGame(); later chapters are started manually
  // from the Story tab after the appropriate arrival toast.
  return;
}
function triggerArrivalStory(portId){
  if(!game) return;
  // The arrival event commits the destination Objective directly. Do not ask
  // objectiveState() which objective is active after location has already
  // changed — by then 'sail_malacca' is no longer the derived state.
  if(portId==='malacca' && level()>=5 && game.comicProgress?.[1] && !game.foundCompanions?.joel && !game.comicProgress?.[2]) {
    if(game.arc1Objective !== 'complete_chapter_2') {
      completeObjectiveAndRefresh('complete_chapter_2','reached Malacca');
    } else {
      renderMainGoal();
      saveGameQuiet();
    }
  } else if(portId==='palembang' && !game.foundCompanions?.aisyah) {
    const changed = game.arc1Objective !== 'complete_chapter_12';
    setArc1Objective('complete_chapter_12', changed ? 'reached Palembang' : null);
    if(changed) toast('🎯 New Objective: open Story → Chapter 12: The Debt Wasn’t Hers.', 5200);
  } else if(portId==='batavia' && !game.foundCompanions?.eliz) {
    const changed = game.arc1Objective !== 'complete_chapter_15';
    setArc1Objective('complete_chapter_15', changed ? 'reached Batavia' : null);
    if(changed) toast('🎯 New Objective: open Story → Chapter 15: The One Who Stayed.', 5200);
  }
  renderMainGoal();
  try { if (document.getElementById('storyScreen')?.classList.contains('active')) renderStory(); } catch(e) {}
}

function openStoryModeReplay(chapterId){
  if(!STORY_MODE_CHAPTERS[chapterId]) return;
  openStoryMode(chapterId,{replay:true});
}

// SAVE / LOAD
// ---------------------------------------------------------------------------
function saveGameQuiet() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(game)); } catch(e) {}
}
function saveGame() {
  migrateEquipmentState();
  const saveData = JSON.stringify(game);
  localStorage.setItem(SAVE_KEY, saveData);
  logEvent('💾 Game saved.', 'good');
  toast('💾 Voyage saved.');
}
function loadGame() {
  ctPlayMusic('port');
  const saveData = localStorage.getItem(SAVE_KEY);
  if (!saveData) { toast('No saved voyage found.'); return; }
  try {
    const loaded = JSON.parse(saveData);
    game = Object.assign(game, loaded);
    migrateEquipmentState();
    seedCompleteStarterGear();
    prepareLoginRewards();
    processAFKRewards();
    // Save migration: older builds may have stored progress in xp.
    if (!Number.isFinite(Number(game.xpTotal))) {
      game.xpTotal = Number(game.xp || 0);
    }
    if (!Number.isFinite(Number(game.xpTotal))) game.xpTotal = 0;
    game.cargoPurchaseCost = game.cargoPurchaseCost || {};
    // One-time repair for saves from before the Uncharted Reach
    // state-sync fix (see startCombat's guard): if a save already has
    // uncharted.active stuck true from before that fix existed, with no
    // genuinely active Reach fight behind it (either not in combat at
    // all, or the last combat wasn't actually an uncharted encounter),
    // clear it here. Without this, the Fair Tide Hub's "Return to the
    // fight" button keeps showing forever on an old save, and tapping
    // it just does goScreen('combat') — which never calls startCombat,
    // so it would keep landing on whatever stale fight happened to be
    // saved (e.g. an already-finished Training Room bout) rather than a
    // real Reach encounter. New saves never get into this state at all
    // now, so this only ever does anything once per affected save.
    if (game.uncharted && game.uncharted.active && (!game.inCombat || !game.combatEnemy || game.combatEnemy.kind !== 'uncharted')) {
      game.uncharted.active = false;
    }
    // Same repair, extended to Research Expedition saves that already
    // have the stale-active state baked in from before this fix covered
    // that system too.
    if (game.expedition && game.expedition.active && (!game.inCombat || !game.combatEnemy || game.combatEnemy.kind !== 'expedition')) {
      game.expedition.active = false;
    }
    refreshBounties(); refreshQuests();
    document.getElementById('introScreen').classList.remove('active');
    document.getElementById('portScreen').classList.add('active');
    updateUI(); renderMarket(); renderCargo(); renderIntel(); renderExplore(); renderLandingV24(); renderAFKWelcome();
    logEvent('📂 Voyage resumed from Day ' + game.day, 'good');
    maybeLaunchPendingStory();
    gameSessionActive = true;
  } catch (e) {
    toast('Could not read that save file.');
  }
}
function exportSave() {
  const blob = new Blob([JSON.stringify(game, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'crimson-tide-save-' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  logEvent('📤 Save exported.', 'good');
}
function importSave(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      game = Object.assign(game, data);
      if (!Number.isFinite(Number(game.xpTotal))) {
        game.xpTotal = Number(game.xp || 0);
      }
      if (!Number.isFinite(Number(game.xpTotal))) game.xpTotal = 0;
      game.cargoPurchaseCost = game.cargoPurchaseCost || {};
      refreshBounties(); refreshQuests();
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById('portScreen').classList.add('active');
      updateUI(); renderMarket(); renderCargo(); renderIntel(); renderExplore(); renderLandingV24(); renderAFKWelcome();
      logEvent('📥 Save imported successfully.', 'good');
      gameSessionActive = true;
    } catch(e) { toast('Could not import that file.'); }
    event.target.value = '';
  };
  reader.readAsText(file);
}

// ---------------------------------------------------------------------------
// UTILITY
// ---------------------------------------------------------------------------
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function logEvent(text, type) { game.log.push({day: game.day, text, type}); if (game.log.length > 200) game.log.shift(); }
function toast(msg, duration=2800) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.9);border:1px solid var(--sand);color:var(--parchment);padding:11px 18px;border-radius:10px;z-index:1300;font-family:Cinzel;transition:opacity 0.3s;max-width:92vw;text-align:center;box-shadow:0 8px 28px rgba(0,0,0,.35);'; document.body.appendChild(t); }
  t.textContent = msg; t.style.opacity = '1'; clearTimeout(window.__toast); window.__toast = setTimeout(() => t.style.opacity = '0', duration);
}
function goalToast(completed, next, duration=5200) {
  toast(`🎯 Objective completed: ${completed}\n➡️ New Objective: ${next}`, duration);
}
function objectiveState() {
  // Live game state is the source of truth. The saved arc1Objective field is
  // only a mirror/legacy value and can never make the current Objective stale.
  game.comicProgress = game.comicProgress || {};
  game.foundCompanions = game.foundCompanions || {};
  game.temporaryCrew = game.temporaryCrew || [];
  if (!game.comicProgress[1]) return 'begin_chapter_1';
  if (level() < 5) return 'reach_level_5';
  // Reconciliation guard: if Joel is already recruited — from an older save,
  // a direct guardian fight, or any path other than this exact step chain —
  // retroactively close out every step of his questline instead of leaving
  // it stuck. Without this, the chain below can never re-satisfy itself once
  // foundCompanions.joel flips true out of order, permanently locking
  // Chapters 2-4 in the Story screen even though nothing is actually left to do.
  if (game.foundCompanions.joel) {
    const neededPatch = !game.comicProgress[2] || !game.comicProgress[3] || !game.comicProgress[4] || !game.malaccaPrepStep;
    game.comicProgress[2] = true;
    game.comicProgress[3] = true;
    game.comicProgress[4] = true;
    if (!game.malaccaPrepStep) game.malaccaPrepStep = 3;
    if (neededPatch && typeof saveGame === 'function') saveGame();
    return 'continue_voyage';
  }
  if (game.location !== 'malacca') return 'sail_malacca';
  if (!game.comicProgress[2]) return 'complete_chapter_2';
  if (!game.temporaryCrew.length) return 'recruit_crew';
  if (!game.comicProgress[3]) return 'complete_chapter_3';
  if (!game.malaccaPrepStep) return 'plan_with_crew';
  if (game.malaccaPrepStep === 1) return 'talk_to_joel';
  if (game.malaccaPrepStep === 2) return 'change_plan';
  if (!game.comicProgress[4]) return 'complete_chapter_4';
  return 'recruit_joel';
}
function setArc1Objective(next, completedLabel=null) {
  game.arc1Objective = next;
  if (completedLabel) {
    const nextLabels = {
      begin_chapter_1:'Open Story → Chapter 1', reach_level_5:'Reach Level 5', sail_malacca:'Sail to Malacca',
      complete_chapter_2:'Open Story → Chapter 2', recruit_crew:'Go to the Tavern → recruit a crew member',
      complete_chapter_3:'Open Story → Chapter 3', plan_with_crew:'Plan with your crew', talk_to_joel:'Talk to Joel',
      change_plan:'Change the plan', complete_chapter_4:'Open Story → Chapter 4', recruit_joel:'Defeat the Wreck Warden and rescue Joel',
      continue_voyage:'Continue the Voyage'
    };
    goalToast(completedLabel, nextLabels[next] || next);
  }
  renderMainGoal();
  renderObjectiveActionPanel();
  if (typeof renderStory === 'function') renderStory();
  if (typeof renderNavigation === 'function') renderNavigation();
  saveGameQuiet();
}
function renderObjectiveActionPanel() {
  const el=document.getElementById('objectiveActionPanel'); if(!el) return;
  const o=objectiveState(); let html='';
  if(o==='plan_with_crew') html='<div class="ct-goal-kicker">Objective Action</div><div class="ct-goal-title">🗺️ Plan with the Crew</div><div class="ct-goal-text">The crew is aboard. Gather everyone and decide how to approach the guardian.</div><button class="btn btn-success" onclick="planWithCrew()">🗺️ Make the Plan</button>';
  else if(o==='talk_to_joel') html='<div class="ct-goal-kicker">Objective Action</div><div class="ct-goal-title">💬 Talk to Joel</div><div class="ct-goal-text">Joel is near the wreck. San wants to speak with him before committing the crew.</div><button class="btn btn-success" onclick="talkToJoel()">💬 Talk to Joel</button>';
  else if(o==='change_plan') html='<div class="ct-goal-kicker">Objective Action</div><div class="ct-goal-title">🗺️ Change the Plan</div><div class="ct-goal-text">What Joel says changes the risk. San needs to revise the crew’s approach.</div><button class="btn btn-success" onclick="changeMalaccaPlan()">🗺️ Change the Plan</button>';
  if(html){el.style.display='block';el.innerHTML=html;} else {el.style.display='none';el.innerHTML='';}
}
function renderMainGoal() {
  const el=document.getElementById('mainGoalPanel'); if(!el) return;
  const labels={
    begin_chapter_1:['Begin Chapter 1 — The Storm That Remained','Open Story and start the chapter.'],
    reach_level_5:['Reach Level 5',`Level ${level()} / 5 — earn XP from bounties, harbor fights, trading and quests.`],
    sail_malacca:['Sail to Malacca','Malacca is unlocked. Sail there to continue the voyage.'],
    complete_chapter_2:['Complete Chapter 2 — The First Port','Open Story and play Chapter 2.'],
    recruit_crew:['Recruit a Crew','Go to the Tavern and hire at least one temporary crew member.'],
    complete_chapter_3:['Complete Chapter 3 — A Crew of Choice','Open Story and play Chapter 3.'],
    plan_with_crew:['Plan with Your Crew','Gather the crew and make a plan for approaching the guardian.'],
    talk_to_joel:['Talk to Joel','Go to the wreck and speak with Joel before the final approach.'],
    change_plan:['Change the Plan','Return to the crew and revise the plan based on what Joel told you.'],
    complete_chapter_4:['Complete Chapter 4 — The Guardian’s Fortress','Open Story and complete the preparation chapter.'],
    recruit_joel:['Rescue Joel','Defeat the Wreck Warden and bring your first mate home.'],
    continue_voyage:['Continue the Voyage','Sail toward the next crew member and keep building the Crimson Tide.']
  };
  const pair=labels[objectiveState()]||labels.continue_voyage;
  el.innerHTML=`<div class="ct-goal-kicker">Current Objective</div><div class="ct-goal-title">🎯 ${esc(pair[0])}</div><div class="ct-goal-text">${esc(pair[1])}</div><div class="ct-goal-optional">Optional: complete bounties for extra XP and gold.</div>`;
  renderObjectiveActionPanel();
}
function completeObjectiveAndRefresh(next, completedLabel){ setArc1Objective(next, completedLabel); }
function planWithCrew(){
  if(objectiveState()!=='plan_with_crew'){toast('Follow the current Objective first.');return;}
  if(!(game.temporaryCrew||[]).length){toast('Recruit at least one temporary crew member at the Tavern first.');return;}
  showModal('The Next Move','San gathers the crew around the table. Maps, rumours, and the wreck’s reports are spread out before them.<br><br><i>They will approach carefully. No one gets left behind.</i>',[
    {text:'🗺️ Make the Plan',action:()=>{closeModal();game.malaccaPrepStep=1;completeObjectiveAndRefresh('talk_to_joel','planned with the crew');}},
    {text:'Not Yet',action:closeModal}
  ]);
}
function talkToJoel(){
  if(objectiveState()!=='talk_to_joel'){toast('Follow the current Objective first.');return;}
  showModal('A Quiet Conversation','San finds the man near the edge of the wreck site. He looks like someone who has been waiting for a decision.<br><br><i>“You should not take your people in there the way you planned.”</i><br><br>Joel does not explain why he sounds so certain. San listens anyway.',[
    {text:'💬 Finish the Conversation',action:()=>{closeModal();game.malaccaPrepStep=2;completeObjectiveAndRefresh('change_plan','talked to Joel');}},
    {text:'Not Yet',action:closeModal}
  ]);
}
function changeMalaccaPlan(){
  if(objectiveState()!=='change_plan'){toast('Follow the current Objective first.');return;}
  showModal('A Different Plan','San returns to the crew and changes the approach.<br><br><i>The original plan is too risky. They will draw the guardian out, create an opening, and extract Joel instead of charging straight into the ruins.</i>',[
    {text:'🗺️ Change the Plan',action:()=>{closeModal();game.malaccaPrepStep=3;completeObjectiveAndRefresh('complete_chapter_4','changed the plan');}},
    {text:'Not Yet',action:closeModal}
  ]);
}

function rollDice(notation) {
  const m = /^(\d+)d(\d+)$/.exec(notation);
  if (!m) return Math.floor(Math.random() * 10) + 1;
  const [,count,sides] = m.map(Number);
  let sum = 0; for (let i = 0; i < count; i++) sum += 1 + Math.floor(Math.random() * sides);
  return sum;
}
function todayKey(){ return 'day_' + game.day; }

// ---------------------------------------------------------------------------
// MODAL
// ---------------------------------------------------------------------------
function showModal(title, text, buttons) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalText').innerHTML = text;
  const btnContainer = document.getElementById('modalButtons');
  btnContainer.innerHTML = '';
  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.className = 'btn';
    button.textContent = btn.text;
    button.onclick = btn.action;
    btnContainer.appendChild(button);
  });
  document.getElementById('modalOverlay').classList.add('active');
}
// Comic chapter image lightbox — see the #comicImageOverlay markup comment
// for why this replaced target="_blank" links. Never navigates, so there's
// no browser history entry and no back-button/reload interaction at all.
function openComicImage(url) {
  const overlay = document.getElementById('comicImageOverlay');
  const img = document.getElementById('comicImageOverlayImg');
  if (!overlay || !img) return;
  img.src = url;
  overlay.style.display = 'block';
}
function closeComicImage() {
  const overlay = document.getElementById('comicImageOverlay');
  const img = document.getElementById('comicImageOverlayImg');
  if (overlay) overlay.style.display = 'none';
  if (img) img.src = '';
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  if (game.storyModalQueue && game.storyModalQueue.length) {
    const next = game.storyModalQueue.shift();
    setTimeout(() => showStoryModal(next), 250);
    return;
  }
}
function showStoryModal(entry) {
  const title = entry.title || (entry.companionName ? `${entry.companionName} joins your crew!` : 'The Drowned Passage');
  showModal(title, entry.postFight || entry.blurb, [{text:'Continue', action:closeModal}]);
}

// ---------------------------------------------------------------------------
// CRIMSON TIDE MUSIC — local embedded soundtrack
// ---------------------------------------------------------------------------
const CT_AUDIO_TRACKS = {
  landing: 'assets/audio/landing.mp3',
  explore: 'assets/audio/explore.mp3',
  combat: 'assets/audio/combat.mp3',
  port: 'assets/audio/port.mp3',
  tavern: 'assets/audio/tavern.mp3'
};
let ctAudio = null;
let ctAudioKey = null;
let ctMusicEnabled = localStorage.getItem('ct_music_enabled') !== '0';
let ctMusicVolume = Number(localStorage.getItem('ct_music_volume') || 0.42);

function ctPlayMusic(key) {
  if (!ctMusicEnabled || !CT_AUDIO_TRACKS[key]) return;
  if (!ctAudio) {
    ctAudio = new Audio();
    ctAudio.preload = 'auto';
    ctAudio.volume = ctMusicVolume;
  }
  if (ctAudioKey === key && !ctAudio.paused) return;
  const wasPlaying = !ctAudio.paused;
  ctAudio.pause();
  ctAudio.src = CT_AUDIO_TRACKS[key];
  ctAudioKey = key;
  ctAudio.loop = true;
  ctAudio.volume = ctMusicVolume;
  const promise = ctAudio.play();
  if (promise && promise.catch) promise.catch(() => {});
}

function ctStopMusic() {
  if (ctAudio) ctAudio.pause();
  ctAudioKey = null;
}
function ctSetMusicEnabled(enabled) {
  ctMusicEnabled = !!enabled;
  localStorage.setItem('ct_music_enabled', ctMusicEnabled ? '1' : '0');
  if (!ctMusicEnabled) ctStopMusic();
  else ctPlayMusic(ctAudioKey || 'landing');
}
function ctSetMusicVolume(value) {
  ctMusicVolume = Math.max(0, Math.min(1, Number(value)));
  localStorage.setItem('ct_music_volume', String(ctMusicVolume));
  if (ctAudio) ctAudio.volume = ctMusicVolume;
}

// ---------------------------------------------------------------------------
// SCREEN NAVIGATION
// ---------------------------------------------------------------------------
function goScreen(name) {
  if (name === 'intro') { renderLanding(); ctPlayMusic('landing'); }
  // BUG FIX: this used to do document.getElementById(name + 'Screen')
  // directly, twice, with no null-check. Every screen id matches that
  // pattern except Fair Tide's, whose actual id is "fairTideScreen"
  // (capital T) — so goScreen('fairtide') built "fairtideScreen", got
  // null back, and threw on .classList before ever reaching the
  // fairtide-specific render call below. The line just above it (removing
  // .active from every screen) had already run by then, so the result
  // was every screen losing .active and none gaining it back — a
  // genuinely blank page, not just a failed render. SCREEN_ID_OVERRIDES
  // exists so this one mismatch (and any future one) doesn't need the
  // HTML id itself renamed, and the null-check below means a typo'd or
  // missing screen name logs a warning instead of blanking the page.
  // BUG FIX: goScreen('tidenetwork') built 'tidenetworkScreen' (lowercase
  // n) by the default name+'Screen' pattern, but the actual element is
  // id="tideNetworkScreen" (capital N, matching the Tide Network build's
  // own camelCase). That silently failed the null-check below and left
  // whatever screen was already showing in place — so the "Continue to
  // the Settlement" button after a Tide Network voyage fight, the nav
  // card, and any other goScreen('tidenetwork') call never actually
  // navigated anywhere.
  const SCREEN_ID_OVERRIDES = { fairtide: 'fairTideScreen', tidenetwork: 'tideNetworkScreen', clansettlement: 'clanSettlementScreen' };
  const screenId = SCREEN_ID_OVERRIDES[name] || (name + 'Screen');
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const targetScreen = document.getElementById(screenId);
  if (!targetScreen) { console.warn('goScreen: no element found for screen "' + name + '" (looked for #' + screenId + ')'); return; }
  targetScreen.classList.add('active');
  window.scrollTo({top:0,left:0,behavior:'instant'});
  window.scrollTo({top: 0, left: 0, behavior: 'instant'});
  targetScreen.scrollIntoView({block: 'start', behavior: 'instant'});
  if (name === 'comics') renderComicArchive();
  if (name === 'port') { renderMarket(); renderCargo(); renderIntel(); renderExplore(); renderTemple(); ctPlayMusic('port'); }
  if (name === 'navigate') { renderNavigation(); ctPlayMusic('explore'); }
  if (name === 'party') renderPartyScreen();
  if (name === 'inventory') renderInventory();
  if (name === 'equipment') { renderEquipment(); ctPlayMusic('port'); }
  if (name === 'shipyard') renderShipyard();
  if (name === 'fairtide') { renderFairTideHub(); ctPlayMusic('port'); }
  if (name === 'training') { renderTrainingRoom(); ctPlayMusic('port'); }
  if (name === 'tavern') { renderTavern(); ctPlayMusic('tavern'); }
  if (name === 'story') renderStory();
  if (name === 'log') renderLog();
  if (name === 'combat' && game.combatEnemy) {
    // BUG FIX (Uncharted Reach getting stuck): see the comment above
    // game.pendingPostBattle in handleVictory for the full story. Short
    // version — this branch didn't exist at all before, so navigating
    // here via anything other than startCombat's own direct DOM writes
    // (e.g. the "Return to the fight" button, especially after a reload)
    // showed a stale or blank combat screen with no way to actually
    // continue or retreat.
    renderCombat();
    if (game.combatResolved) renderPendingPostBattle();
  }
  updateUI();
  try { renderMainGoal(); } catch(e) {}
}
function switchPortTab(tab) {
  document.querySelectorAll('#portContent .tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#portContent .tab-btn').forEach(t => t.classList.remove('active'));
  document.getElementById('port-tab-' + tab).classList.add('active');
  event.target.classList.add('active');
  if (tab === 'market') renderMarket();
  if (tab === 'cargo') renderCargo();
  if (tab === 'intel') renderIntel();
  if (tab === 'explore') renderExplore();
  if (tab === 'temple') renderTemple();
}

// ---------------------------------------------------------------------------
// INITIALIZATION — no name entry: San, Soel, and the crew's names are fixed.
// Only the ship name and difficulty are yours to choose.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// LOGIN + AFK REWARDS
// ---------------------------------------------------------------------------
function realDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function dateDiffDays(aKey, bKey) {
  if (!aKey || !bKey) return 9999;
  const a = new Date(aKey + 'T00:00:00');
  const b = new Date(bKey + 'T00:00:00');
  return Math.round((b - a) / 86400000);
}
function prepareLoginRewards() {
  const today = realDateKey();
  if (game.lastLoginDate === today) return;
  const gap = dateDiffDays(game.lastLoginDate, today);
  game.loginStreak = gap === 1 ? Number(game.loginStreak || 0) + 1 : 1;
  game.lastLoginDate = today;
  game.dailyRewardClaimed = false;
  // Weekly reward becomes available on each 7th consecutive login.
  game.weeklyRewardClaimedStreak = Number(game.weeklyRewardClaimedStreak || 0);
}
function claimDailyReward() {
  prepareLoginRewards();
  if (game.dailyRewardClaimed) {
    toast('Daily reward already claimed today.');
    return;
  }
  const streak = Math.max(1, Number(game.loginStreak || 1));
  const goldReward = 50 + Math.min(250, (streak - 1) * 10);
  const xpReward = 75 + Math.min(500, (streak - 1) * 20);
  game.gold += goldReward;
  gainXP(xpReward);
  game.dailyRewardClaimed = true;
  logEvent(`🎁 Daily login reward: +${goldReward}g and +${xpReward} XP. Streak ${streak} day${streak === 1 ? '' : 's'}!`, 'gold');

  if (streak % 7 === 0 && game.weeklyRewardClaimedStreak !== streak) {
    const weeklyGold = 500 + Math.min(2500, (streak / 7 - 1) * 250);
    const weeklyXP = 500 + Math.min(2500, (streak / 7 - 1) * 250);
    game.gold += weeklyGold;
    gainXP(weeklyXP);
    game.weeklyRewardClaimedStreak = streak;
    logEvent(`🏆 Weekly login reward: +${weeklyGold}g and +${weeklyXP} XP!`, 'gold');
    toast(`🏆 Weekly reward! +${weeklyGold}g · +${weeklyXP} XP`);
  } else {
    toast(`🎁 Daily reward claimed! +${goldReward}g · +${xpReward} XP`);
  }
  saveGame();
  renderTavern();
  updateUI();
  renderLandingV24(); renderAFKWelcome();
}
function renderLoginRewards() {
  const el = document.getElementById('loginRewards');
  if (!el) return;
  prepareLoginRewards();
  const streak = Math.max(1, Number(game.loginStreak || 1));
  const dailyReady = !game.dailyRewardClaimed;
  const weeklyReady = streak % 7 === 0 && game.weeklyRewardClaimedStreak !== streak;
  const dailyGold = 50 + Math.min(250, (streak - 1) * 10);
  const dailyXP = 75 + Math.min(500, (streak - 1) * 20);

  el.innerHTML = `
    <div style="font-size:.82rem;line-height:1.5;">
      <strong>🔥 Login streak: ${streak} day${streak === 1 ? '' : 's'}</strong><br>
      <span style="opacity:.78;">Daily: +${dailyGold}g · +${dailyXP} XP</span>
      ${weeklyReady ? '<br><span style="color:var(--gold);">🏆 7-day reward ready!</span>' : ''}
    </div>
    <button class="btn btn-success btn-small" style="margin-top:8px;" onclick="claimDailyReward()" ${dailyReady ? '' : 'disabled'}>
      ${dailyReady ? '🎁 Claim Daily Reward' : '✓ Claimed Today'}
    </button>
    ${weeklyReady ? '<div style="font-size:.72rem;opacity:.75;margin-top:6px;">Claiming today also grants the weekly bonus.</div>' : ''}
  `;
}
function processAFKRewards() {
  const now = Date.now();
  const previous = Number(game.lastActiveAt || 0);
  if (!previous || previous >= now) {
    game.lastActiveAt = now;
    return false;
  }
  const elapsedHours = Math.max(0, Math.min(8, (now - previous) / 3600000));
  if (elapsedHours < 0.05) {
    game.lastActiveAt = now;
    return false;
  }

  const wholeMinutes = Math.floor(elapsedHours * 60);
  const goldReward = Math.max(0, Math.floor(wholeMinutes * 2));
  const xpReward = Math.max(0, Math.floor(wholeMinutes * 3));
  game.lastActiveAt = now;

  if (goldReward || xpReward) {
    game.gold += goldReward;
    gainXP(xpReward);
    logEvent(`⏳ AFK voyage earnings (${(wholeMinutes/60).toFixed(1)}h, capped at 8h): +${goldReward}g and +${xpReward} XP.`, 'gold');
    toast(`⏳ AFK rewards: +${goldReward}g · +${xpReward} XP`);
    return true;
  }
  return false;
}
function persistAFKTimestamp() {
  try {
    if (!gameSessionActive) return; // see the note by gameSessionActive's declaration
    game.lastActiveAt = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  } catch(e) {}
}



function portraitCandidates(path) {
  if (!path) return [];
  const clean = path.replace(/\.(png|jpg|jpeg|webp)$/i,'');
  return [`${clean}.png`,`${clean}.jpg`,`${clean}.jpeg`,`${clean}.webp`];
}
function portraitHTML(path, name='') {
  const candidates = portraitCandidates(path);
  const src = candidates[0] || '';
  const safeName = String(name || '').replace(/"/g,'&quot;');
  const fallback = `this.onerror=null;this.style.display='none';this.parentElement.classList.add('portrait-missing');this.parentElement.setAttribute('data-name','${safeName}')`;
  return `<div class="portrait-frame"><img src="${src}" alt="${safeName}" loading="lazy" onerror="${fallback}"><span class="portrait-fallback">${safeName.slice(0,1).toUpperCase()}</span></div>`;
}

const CREW_PORTRAITS = {
  san:'assets/portraits/san.png', joel:'assets/portraits/joel.png',
  aisyah:'assets/portraits/aisyah.png', mezstorm:'assets/portraits/mezstorm.png',
  eliz:'assets/portraits/eliz.png', senedra:'assets/portraits/senedra.png',
  zaki:'assets/portraits/zaki.png', soel:'assets/portraits/soel.png',
  // Locked Daybreak reference designs are retained as named slots; their original
  // portrait files will be wired when supplied as local assets.
  aldric:'assets/portraits/aldric.png', wren:'assets/portraits/wren.png',
  mimi:'assets/portraits/mimi.png', kwliang:'assets/portraits/kw-liang.png',
  iris:'assets/portraits/iris.png', bradashah:'assets/portraits/brada-shah.png',
  draa:'assets/portraits/dr-aa.png'
};
function portraitKeyFor(name) {
  const n=String(name||'').toLowerCase().replace(/[^a-z0-9]+/g,'');
  if(n.includes('aldric'))return'aldric'; if(n.includes('wren'))return'wren';
  if(n.includes('liang'))return'kwliang'; if(n.includes('brada'))return'bradashah';
  if(n.includes('mez'))return'mezstorm'; if(n.includes('aisyah'))return'aisyah';
  if(n.includes('sene'))return'senedra'; if(n.includes('zaki'))return'zaki';
  if(n.includes('joel'))return'joel'; if(n.includes('soel'))return'soel';
  if(n.includes('eliz'))return'eliz'; if(n.includes('mimi'))return'mimi';
  if(n.includes('iris'))return'iris'; if(n.includes('dr')&&n.includes('aa'))return'draa';
  if(n.includes('san'))return'san'; return n;
}
function portraitHTML(name,size='52px'){
  const key=portraitKeyFor(name), src=CREW_PORTRAITS[key];
  if(!src)return `<div class="crew-portrait fallback" style="width:${size};height:${size};">⚓</div>`;
  return `<img class="crew-portrait" src="${src}" alt="" style="width:${size};height:${size};object-fit:cover;" onerror="this.outerHTML='<div class=&quot;crew-portrait fallback&quot; style=&quot;width:${size};height:${size};&quot;>⚓</div>'">`;
}
function wireCrewPortraits(){
  document.querySelectorAll('.crew-card,.party-card,.member-card,.crew-member').forEach(card=>{
    if(card.querySelector('.crew-portrait'))return;
    const nameEl=card.querySelector('.name,.member-name,.crew-name,h3,h4');
    if(!nameEl)return;
    const slot=document.createElement('div');
    slot.className='portrait-slot';
    slot.innerHTML=portraitHTML(nameEl.textContent.trim());
    card.insertBefore(slot,card.firstChild);
  });
}
function renderComicArchive(){
  const el=document.getElementById('comicArchive'); if(!el)return;
  // This used to link to a "Legends of Daybreak" PDF that isn't even bundled
  // in this build — leftover from a shared template, not Crimson Tide's own
  // content. Replaced with a real back-reading archive: every chapter the
  // player has already completed, across every arc, linking to its full
  // page image in a new tab. Chapters not yet reached stay hidden rather
  // than shown locked, since this screen is reachable from the landing page
  // before the player has necessarily loaded their save.
  //
  // BUG FIX: this only ever covered Arc I and Arc II — never extended as
  // Arc III through XVI were built, so by the time a player reached even
  // Arc V this screen showed almost nothing relevant, and San (at Arc XVI,
  // Level 210) correctly flagged it as "nothing usable." Now generic across
  // every arc from ARCn_CHAPTERS/game.comicProgressN, since that naming
  // pattern has been consistent since Arc II — Arc I alone predates it and
  // needs its own small image-lookup table, same as before.
  const ARC1_IMAGES = {
    1:'ch01-storm-that-remained.png', 2:'ch02-the-first-port.png', 3:'ch03-a-crew-of-choice.png',
    4:'ch04-the-guardians-fortress.png', 5:'ch05-the-voice-behind-the-wall.png', 6:'ch06-the-shield-returns.png',
    7:'ch07-the-shield-that-remained.png', 8:'ch08-the-tradewinds-remember.png', 9:'ch09-shield-returns.png',
    10:'ch10-day-sea-rested.png', 11:'ch11-day-we-chose.png', 12:'ch12-debt-wasnt-hers.png',
    13:'ch13-debt-collector.png', 14:'ch14-two-sisters-one-ship.png', 15:'ch15-one-who-stayed.png',
    16:'ch16-mark-we-carried.png', 17:'ch17-things-we-do-without-knowing.png', 18:'ch18-mezstorm-rescue.png',
    19:'ch19-crew-we-choose.png', 20:'ch20-senedra.png', 21:'ch21-zaki.png',
    22:'ch22-mezstorm.png', 23:'ch23-siblings.png', 24:'ch24-drowned-passage.png'
  };
  const progress1 = (typeof game!=='undefined' && game.comicProgress) || {};
  const arc1Read = (typeof ARC1_COMICS!=='undefined' ? ARC1_COMICS : [])
    .filter(ch => !!progress1[ch.id] && ARC1_IMAGES[ch.id])
    .map(ch => ({id:ch.id, title:ch.title, image:'assets/comics/arc1/'+ARC1_IMAGES[ch.id]}));

  function section(label, chapters){
    if(!chapters.length) return '<div class="comic-archive-card"><div class="comic-archive-sub">No '+label+' chapters read yet.</div></div>';
    return chapters.map(ch =>
      '<div class="comic-archive-card"><div class="comic-archive-title">Chapter '+ch.id+' — '+esc(ch.title)+'</div>'+
      '<button class="btn btn-small" style="margin-top:6px;" onclick="openComicImage(\''+ch.image+'\')">📖 Read Again</button></div>'
    ).join('');
  }

  const ARC_NUMERALS = {2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',11:'XI',12:'XII',13:'XIII',14:'XIV',15:'XV',16:'XVI'};
  let html = '<div class="comic-archive-title" style="font-size:1.05rem;margin-bottom:6px;">Arc I — The First Voyage</div>' + section('Arc I', arc1Read);
  for (let n = 2; n <= 16; n++) {
    const chapters = window['ARC'+n+'_CHAPTERS'];
    if (!chapters) continue; // arc not built in this session's file yet — skip rather than show a fake empty section
    const progress = game['comicProgress'+n] || {};
    const read = chapters.filter(ch => !!progress[ch.id] && ch.image).map(ch => ({id:ch.id, title:ch.title, image:ch.image}));
    html += '<div class="comic-archive-title" style="font-size:1.05rem;margin:18px 0 6px;">Arc '+ARC_NUMERALS[n]+'</div>' + section('Arc '+ARC_NUMERALS[n], read);
  }
  el.innerHTML = html;
}

function hasSavedVoyage() {
  try { return !!localStorage.getItem(SAVE_KEY); } catch(e) { return false; }
}
function updateLandingPrimaryAction() {
  const btn = document.getElementById('landingPrimaryButton');
  const newBtn = document.getElementById('landingNewVoyage');
  const saved = hasSavedVoyage();
  if (btn) {
    btn.textContent = saved ? '▣ CONTINUE VOYAGE' : '⚓ BEGIN VOYAGE';
    btn.setAttribute('aria-label', saved ? 'Continue saved voyage' : 'Begin new voyage');
  }
  if (newBtn) newBtn.style.display = saved ? 'block' : 'none';
}
function landingPrimaryAction() {
  if (hasSavedVoyage()) loadGame();
  else startGame();
}
function confirmNewVoyage() {
  if (!hasSavedVoyage()) { startGame(); return; }
  const ok = window.confirm(
    'Start a NEW voyage?\\n\\nYour current saved voyage will be replaced only when the new voyage is saved.\\n\\nChoose Cancel to continue your current voyage.'
  );
  if (!ok) return;
  startGame();
  updateLandingPrimaryAction();
}

function startGame() {
  migrateEquipmentState();
  seedCompleteStarterGear();
  ctPlayMusic('port');
  game.shipName = document.getElementById('shipName').value || 'The Daybreak';
  game.difficulty = document.getElementById('difficulty').value;

  if (game.difficulty === 'easy') {
    game.gold = 500; game.ship = { hull: 2, cannons: 2, sails: 2, cargo: 2 }; game.cargoCapacity = 75;
  } else if (game.difficulty === 'hard') {
    game.gold = 150; game.ship = { hull: 1, cannons: 1, sails: 1, cargo: 1 };
  }

  game.partyHp['san'] = 82; game.partyMp['san'] = 100;
  if (!game.lastActiveAt) game.lastActiveAt = Date.now();
  prepareLoginRewards();

  generateMarketPrices();
  refreshBounties();
  refreshQuests();

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('portScreen').classList.add('active');
  window.scrollTo({top: 0, left: 0, behavior: 'instant'});
  document.getElementById('portScreen').scrollIntoView({block: 'start', behavior: 'instant'});

  game.comicProgress = game.comicProgress || {};
  game.storyQuestProgress = game.storyQuestProgress || {};
  game.mainGoal = 'begin_chapter_1';
  game.arc1Objective = 'begin_chapter_1';
  game.malaccaPrepStep = 0;
  logEvent('⚓ San sets sail from Singapore aboard ' + game.shipName + ' with ' + game.gold + ' gold.', 'neutral');
  updateUI();
  renderMarket();
  renderLandingV24(); renderAFKWelcome(); renderMainGoal();
  toast('🎯 New Objective: Begin Chapter 1 — open Story.', 5200);
  // Story Mode is manual: the Objective tells the player to open Story.
  gameSessionActive = true;
}

// ---------------------------------------------------------------------------
// MARKET / TRADING
// ---------------------------------------------------------------------------
function generateMarketPrices() {
  game.marketPrices = {};
  PORTS.forEach(port => {
    game.marketPrices[port.id] = {};
    Object.keys(GOODS).forEach(goodId => {
      const good = GOODS[goodId];
      let multiplier = 0.5 + Math.random();
      if (port.specialties.includes(goodId)) multiplier *= 0.55;
      multiplier *= (0.8 + Math.random() * 0.4);
      if (goodId === 'contraband' && port.id !== 'manila') multiplier = 0;
      game.marketPrices[port.id][goodId] = Math.max(1, Math.round(good.basePrice * multiplier));
    });
  });
}
function haggleMultiplier() { return getActiveParty().some(m => m.id === 'aisyah') ? (1 - (affinityFor('aisyah').fx.goldPct ? 0.1 : 0.1)) : 1; }
function buyGood(goodId, qty) {
  const good = GOODS[goodId];
  const price = Math.round(game.marketPrices[game.location][goodId] * haggleMultiplier());
  const totalPrice = price * qty;
  const totalWeight = good.weight * qty;

  if (game.gold < totalPrice) { toast('Not enough gold!'); return; }
  if (game.cargoUsed + totalWeight > game.cargoCapacity) { toast('Cargo hold full!'); return; }

  game.gold -= totalPrice;
  game.cargoPurchaseCost = game.cargoPurchaseCost || {};
  const oldQty = Number(game.cargo[goodId] || 0);
  const oldCost = Number(game.cargoPurchaseCost[goodId] || 0);
  game.cargo[goodId] = oldQty + qty;
  game.cargoPurchaseCost[goodId] =
    oldQty > 0 ? ((oldCost * oldQty) + totalPrice) / (oldQty + qty) : price;
  game.cargoUsed += totalWeight;
  checkQuestProgress('trade_volume', null, qty);
  checkTempleQuestProgress('trade_volume', null, qty);

  logEvent('Bought ' + qty + 'x ' + good.name + ' for ' + totalPrice + 'g', 'neutral');
  updateUI(); renderMarket(); renderCargo();
}
function sellGood(goodId, qty) {
  const good = GOODS[goodId];
  const available = game.cargo[goodId] || 0;
  qty = Math.min(qty, available);
  if (qty <= 0) return;

  const price = game.marketPrices[game.location][goodId];
  const totalPrice = price * qty;
  const totalWeight = good.weight * qty;

  game.gold += totalPrice;
  const oldQty = Number(game.cargo[goodId] || 0);
  const avgCost = Number((game.cargoPurchaseCost || {})[goodId] || 0);
  game.cargo[goodId] -= qty;
  game.cargoUsed -= totalWeight;
  if (game.cargo[goodId] <= 0) {
    delete game.cargo[goodId];
    if (game.cargoPurchaseCost) delete game.cargoPurchaseCost[goodId];
  } else if (game.cargoPurchaseCost && avgCost > 0) {
    // Weighted-average cost stays unchanged for the remaining units.
    game.cargoPurchaseCost[goodId] = avgCost;
  }

  const baseCost = good.basePrice * qty * 0.8;
  if (totalPrice > baseCost) gainXP(Math.floor((totalPrice - baseCost) / 10));
  checkQuestProgress('trade_volume', null, qty);
  checkTempleQuestProgress('trade_volume', null, qty);
  checkQuestProgress('deliver', {good: goodId, portId: game.location}, qty);

  logEvent('Sold ' + qty + 'x ' + good.name + ' for ' + totalPrice + 'g', 'gold');
  updateUI(); renderMarket(); renderCargo();
}

// ---------------------------------------------------------------------------
// EXPLORE HARBOR — pick a fight with the port's local threats any time, plus
// the port's guardian if that companion hasn't been found yet.
// ---------------------------------------------------------------------------
function renderTemple() {
  const potionEl = document.getElementById('templePotionShop');
  const questEl = document.getElementById('templeQuestBoard');
  if (potionEl) potionEl.innerHTML = potionShopHTML(p => p.temple);
  if (questEl) questEl.innerHTML = templeQuestBoardHTML();
}
function renderExplore() {
  const container = document.getElementById('exploreContent');
  if (!container) return;
  const port = PORTS.find(p => p.id === game.location);
  let html = '<p style="font-size:0.85rem;opacity:0.8;margin-bottom:12px;">Pick a fight in the harbor — repeatable, low risk, decent coin.</p><div class="chapter-grid">';
  port.harbor.forEach(key => {
    const e = scaledEnemyForExplore(key, 'harbor');
    html += `<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.6rem;">${e.icon}</div><div style="flex:1;"><strong>${e.name}</strong><br><span style="font-size:0.8rem;opacity:0.8;">${e.desc}</span><br><span style="font-size:0.8rem;">${e.hp} HP · ${e.xp} XP · ${e.gold}g · Lv.${e.scaledFromLevel}</span></div><button class="btn btn-small btn-combat" onclick="startHarborFight('${key}')">Fight</button></div></article>`;
  });
  html += '</div>';

  if (port.guardian) {
    const done = game.clearedGuardians[port.guardian];
    const g = GUARDIANS[port.guardian];
    html += `<h3 style="font-family:Cinzel;color:var(--gold);margin:18px 0 8px;font-size:1rem;">🎯 Chapter ${port.chapterId} — ${done ? 'Cleared' : 'Guardian'}</h3>`;
    if (done) {
      html += `<article class="quest-item" style="border-left-color:#6fb57d;"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.8rem;">${g.art}</div><div style="flex:1;"><strong>${g.name}</strong><br><span style="font-size:0.8rem;opacity:0.8;">${g.desc}</span><br><span style="font-size:0.8rem;">Cleared · optional rematch available</span></div></div></article>`;
    } else {
      const escaped = port.recruitment === 'escape' && game.foundCompanions[port.companion];
      const label = escaped ? 'Optional Guardian' : 'Guardian';
      html += `<article class="quest-item" style="border-left-color:var(--danger);"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.8rem;">${g.art}</div><div style="flex:1;"><strong>${g.name}</strong><br><span style="font-size:0.8rem;opacity:0.8;">${g.desc}</span><br><span style="font-size:0.8rem;">${g.hp} HP · ${label}</span></div><button class="btn btn-small btn-danger" onclick="startGuardianFight('${port.id}')">${escaped ? 'Challenge' : 'Face Them'}</button></div></article>`;
    }
  } else if (port.id === 'singapore') {
    html += `<p style="font-size:0.85rem;opacity:0.6;margin-top:14px;">San's home port. No one left to find here — just the road ahead.</p>`;
  }

  if (game.foundCompanions && Object.keys(game.foundCompanions).length >= 6 && !game.finalCleared) {
    const done = false;
    const g = GUARDIANS.drowned_admiral;
    html += `<h3 style="font-family:Cinzel;color:var(--gold);margin:18px 0 8px;font-size:1rem;">🎯 Chapter 8 — The Drowned Passage</h3>`;
    html += `<article class="quest-item" style="border-left-color:var(--danger);"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.8rem;">${g.art}</div><div style="flex:1;"><strong>${g.name}</strong><br><span style="font-size:0.8rem;opacity:0.8;">${g.desc}</span><br><span style="font-size:0.8rem;">${g.hp} HP · final encounter</span></div><button class="btn btn-small btn-danger" onclick="startFinalFight()">Sail the Passage</button></div></article>`;
  }

  const act2 = game.finalCleared ? currentAct2Chapter() : null;
  if (act2 && act2.portId === port.id) {
    const have = game.cargo[act2.good] || 0;
    const ready = have >= act2.need;
    html += `<h3 style="font-family:Cinzel;color:var(--gold);margin:18px 0 8px;font-size:1rem;">💛 Act II · Chapter ${act2.id} — ${act2.title}</h3>`;
    html += `<article class="quest-item" style="border-left-color:#e8c96a;"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.6rem;">${GOODS[act2.good].icon}</div><div style="flex:1;"><strong>Need ${act2.need}x ${GOODS[act2.good].name}</strong><br><span style="font-size:0.8rem;opacity:0.8;">In the hold: ${have}/${act2.need}</span></div><button class="btn btn-small ${ready ? 'btn-success' : ''}" onclick="deliverAid()" ${ready ? '' : 'disabled'}>${act2.deliverPrompt}</button></div></article>`;
  } else if (act2) {
    html += `<p style="font-size:0.8rem;opacity:0.6;margin-top:14px;">💛 Act II, Chapter ${act2.id} needs you in ${PORTS.find(p=>p.id===act2.portId).name} — check the Story tab.</p>`;
  }

  html += bountyBoardHTML();
  container.innerHTML = html;
}
function scaleCrimsonEnemy(baseEnemy, kind='harbor', storyLevel=null) {
  if (!baseEnemy) return null;
  // Guardians are tuned to their story level rather than using the late-game base stats.
  if (kind === 'guardian') {
    const lv = Math.max(1, Number(storyLevel || level()));
    const hpMult = Math.min(1.35, 0.36 + lv * 0.026);
    const dmgMult = Math.min(1.35, 0.50 + lv * 0.021);
    return Object.assign({}, baseEnemy, {
      hp: Math.max(80, Math.round(baseEnemy.hp * hpMult)),
      dmg: Math.max(6, Math.round(baseEnemy.dmg * dmgMult)),
      xp: Math.max(baseEnemy.xp, Math.round(baseEnemy.xp * (0.75 + lv * 0.015))),
      gold: Math.max(baseEnemy.gold, Math.round(baseEnemy.gold * (0.75 + lv * 0.01))),
      scaledFromStoryLevel: lv
    });
  }
  if (kind === 'final' || kind === 'memory') return Object.assign({}, baseEnemy);
  const lv = Math.max(1, level());
  const steps = Math.max(0, lv - 1);
  const hpMult = Math.min(2.8, 1 + steps * 0.10);
  const dmgMult = Math.min(2.0, 1 + steps * 0.06);
  const xpMult = Math.min(2.2, 1 + steps * 0.08);
  const goldMult = Math.min(1.9, 1 + steps * 0.05);
  return Object.assign({}, baseEnemy, {
    hp: Math.max(1, Math.round(baseEnemy.hp * hpMult)),
    dmg: Math.max(1, Math.round(baseEnemy.dmg * dmgMult)),
    xp: Math.max(1, Math.round(baseEnemy.xp * xpMult)),
    gold: Math.max(1, Math.round(baseEnemy.gold * goldMult)),
    scaledFromLevel: lv
  });
}
function scaledEnemyForExplore(key, kind='harbor') {
  const base = enemyLookup(key);
  return scaleCrimsonEnemy(base, kind);
}

function startHarborFight(key, returnKind) {
  game.exploreTarget = null;
  // returnKind lets a secondary location's own Explore tab (Unknown
  // Harbour, Tide Network settlement, Clan Settlement) tag its fights
  // distinctly from a home Port's own harbor fights. Without it, every
  // caller shared the plain 'harbor' kind, which handleVictory has no
  // branch for — so it fell through to the generic "Return to Port"
  // button and sailed the crew home instead of keeping them at the
  // location they were actually exploring.
  startCombat({ kind: returnKind || 'harbor', key, enemy: scaledEnemyForExplore(key, 'harbor') });
}
function startGuardianFight(portId) {
  const port = PORTS.find(p => p.id === portId);
  if (!port || !port.guardian) return;
  const escaped = port.recruitment === 'escape' && game.foundCompanions[port.companion];
  const quest = ARC1_STORY_QUESTS.find(q => q.portId === portId);

  // First-time recruitment is objective-gated. Optional rematches for
  // Senedra/Zaki remain available after their independent escapes.
  if (!escaped && portId === 'malacca' && objectiveState() !== 'recruit_joel') {
    toast('🔒 The Wreck Warden is locked. Complete the current Objective first.');
    return;
  }
  if (!escaped && quest) {
    if (level() < quest.level) {
      toast(`Chapter ${quest.id} requires Level ${quest.level}. You are Level ${level()}.`);
      return;
    }
    if (!arc1StoryPrereqMet(quest)) {
      const prior = ARC1_STORY_QUESTS.find(q=>q.id===quest.id-1);
      toast(`Complete Chapter ${prior?.id || (quest.id-1)} before recruiting here.`);
      return;
    }
  }
  const pre = escaped
    ? `${GUARDIANS[port.guardian].name} still controls part of the harbor. ${ALL_PARTY.find(m=>m.id===port.companion)?.name || 'The companion'} already escaped — this is an optional rematch for the challenge and rewards.`
    : (port.preFight || "San steadies herself at the threshold. Whatever's waiting below, she isn't leaving without them.");
  showModal(`${escaped ? 'Optional Rematch' : 'Chapter '+port.chapterId}`, pre,
    [{text: '⚔️ Challenge', action: () => { closeModal(); startCombat({ kind: 'guardian', key: port.guardian, enemy: scaleCrimsonEnemy(GUARDIANS[port.guardian], 'guardian', quest?.level || level()), portId }); }},
     {text: 'Not Yet', action: closeModal}]);
}
function startFinalFight() {
  const quest = ARC1_STORY_QUESTS.find(q=>q.id===8);
  if (quest && level() < quest.level) { toast(`Chapter 8 requires Level ${quest.level}. You are Level ${level()}.`); return; }
  if (Object.keys(game.foundCompanions||{}).length < 6) { toast('Recover the six scattered companions first.'); return; }
  showModal('Chapter 8', DROWNED_PASSAGE.preFight || "This is the last one. San can feel it.",
    [{text: '⚔️ Go', action: () => { closeModal(); startCombat({ kind: 'final', key: 'drowned_admiral', enemy: GUARDIANS.drowned_admiral }); }},
     {text: 'Not Yet', action: closeModal}]);
}

// ---------------------------------------------------------------------------
// STORY SCREEN — the search for the crew
// ---------------------------------------------------------------------------
// Arc I story quests — travel and recruitment follow the Legends of Daybreak order.
// The player may freely visit ports for trading/exploration, but Story chapters
// cannot be completed early. Each chapter requires the correct level, reaching
// the destination, and completing that chapter's recruitment/finale condition.
const ARC1_STORY_QUESTS = [
  {id:1, title:'The Storm That Remained', portId:'singapore', level:1, companion:null, summary:'Begin the voyage from Singapore.', complete:()=>true},
  {id:2, title:'Malacca — Find Joel', portId:'malacca', level:5, companion:'joel', summary:'Reach Malacca and bring Joel home from the guardian’s wreck.', complete:()=>game.location==='malacca' && !!game.foundCompanions.joel},
  {id:3, title:'Palembang — Find Aisyah', portId:'palembang', level:10, companion:'aisyah', summary:'Reach Palembang and resolve Aisyah’s false debt.', complete:()=>game.location==='palembang' && !!game.foundCompanions.aisyah},
  {id:4, title:'Batavia — Find Eliz', portId:'batavia', level:15, companion:'eliz', summary:'Reach Batavia and bring Eliz back aboard.', complete:()=>game.location==='batavia' && !!game.foundCompanions.eliz},
  {id:5, title:'Bangkok — Find Mezstorm', portId:'bangkok', level:20, companion:'mezstorm', summary:'Reach Bangkok and break the storm-bound bargain holding Mezstorm.', complete:()=>game.location==='bangkok' && !!game.foundCompanions.mezstorm},
  {id:6, title:'Hanoi — Find Senedra', portId:'hanoi', level:25, companion:'senedra', summary:'Reach Hanoi and follow Senedra’s signal after the earlier crew has been recovered.', complete:()=>game.location==='hanoi' && !!game.foundCompanions.senedra},
  {id:7, title:'Manila — Find Zaki', portId:'manila', level:30, companion:'zaki', summary:'Reach Manila and bring Zaki out of the prison hulk.', complete:()=>game.location==='manila' && !!game.foundCompanions.zaki},
  {id:8, title:'Drowned Passage — The Last Crossing', portId:'drowned_passage', level:35, companion:'final', summary:'Reach the Drowned Passage after all six companions are aboard and defeat the Drowned Admiral.', complete:()=>!!game.finalCleared}
];
function arc1StoryPrereqMet(q){
  if (!q) return false;
  if (level() < q.level) return false;
  if (q.id <= 1) return true;
  const prior = ARC1_STORY_QUESTS.find(x=>x.id===q.id-1);
  return !!(prior && (game.storyQuestProgress?.[prior.id] || prior.complete()));
}
function currentArc1StoryQuest(){
  return ARC1_STORY_QUESTS.find(q=>!game.storyQuestProgress?.[q.id]);
}
function syncArc1StoryQuestProgress(){
  game.storyQuestProgress = game.storyQuestProgress || {};
  let changed=false;
  for(const q of ARC1_STORY_QUESTS){
    if(game.storyQuestProgress[q.id]) continue;
    // Never skip the recruitment order. A chapter can only complete after its
    // previous chapter has completed. Chapter 1 is the starting state.
    if((q.id===1 && game.comicProgress?.[1]) || (q.id>1 && arc1StoryPrereqMet(q) && q.complete())){
      game.storyQuestProgress[q.id]=true; changed=true;
    }
  }
  if(changed) saveGame();
  return changed;
}
function storyQuestStatus(q){
  if(game.storyQuestProgress?.[q.id]) return 'complete';
  if(!arc1StoryPrereqMet(q)) return 'locked';
  if(level() < q.level) return 'level';
  return 'active';
}
function storyQuestLevelText(q){ return q.level <= 1 ? 'Level 1' : `Level ${q.level}`; }

const ARC1_COMICS = [
  {id:1,title:'The Storm That Remained',tag:'Survival Is the First Memory',unlock:()=>true,summary:'The storm scatters the crew. San survives with Soel, but the memories and faces she once knew are gone.',xp:150},
  {id:2,title:'The First Port',tag:'Malacca',unlock:()=>!!game.comicProgress?.[1],summary:'The Crimson Tide reaches Malacca: a new world of strangers, trade, rumours, and danger.',xp:150},
  {id:3,title:'A Crew of Choice',tag:'We Sail Together or Not at All',unlock:()=>!!game.comicProgress?.[2],summary:'San begins building a crew through earned loyalty, practical skill, and the choice to stand together.',xp:150},
  {id:4,title:'The Guardian’s Fortress',tag:'Strategy Before the Storm',unlock:()=>!!game.comicProgress?.[3],summary:'San refuses to rush the ruins. The crew studies the guardian, makes a plan, and prepares to bring Joel home.',xp:175},
  {id:5,title:'The Voice Behind the Wall',tag:'The First Meeting',unlock:()=>!!game.comicProgress?.[4],summary:'Behind the ruined wall, San meets the man she cannot remember but somehow feels she has been searching for.',xp:35},
  {id:6,title:'The Shield Returns',tag:'The Rescue of Joel',unlock:()=>!!game.comicProgress?.[5],summary:'The Crimson Tide enters the ruins at midnight. San and Joel fight side by side before either can explain why it feels natural.',xp:35},
  {id:7,title:'The Shield That Remained',tag:'A Piece of Him Returned',unlock:()=>!!game.comicProgress?.[6],summary:'The storm took their memories, but something remained: the feeling of a shield, a promise, and a person worth bringing home.',xp:35},
  {id:8,title:'The Tradewinds Remember',tag:'A Shield Without Its Owner',unlock:()=>!!game.comicProgress?.[7],summary:'The search continues through the trade routes. The shield leaves a trail even when its owner cannot remember where he came from.',xp:35},
  {id:9,title:'The Quiet Between Voyages',tag:'Crew',unlock:()=>!!game.comicProgress?.[8] && !!game.finalCleared,summary:'The crew learns how to live aboard the same ship again.',xp:35},
  {id:10,title:'The Names We Keep',tag:'Crew',unlock:()=>!!game.comicProgress?.[9],summary:'Names return through ledgers, rumours, and introductions—not recovered memories.',xp:35},
  {id:11,title:'Before the Next Port',tag:'Crew',unlock:()=>!!game.comicProgress?.[10],summary:'The Crimson Tide becomes more than a place to sleep; it becomes somewhere to belong.',xp:35},
  {id:12,title:'The Debt That Wasn’t Hers',tag:'Aisyah',unlock:()=>!!game.comicProgress?.[11],summary:'Aisyah’s false debt is exposed, and San’s instinct to protect her becomes impossible to ignore.',xp:40},
  {id:13,title:'The Debt Collector',tag:'Aisyah',unlock:()=>!!game.comicProgress?.[12],summary:'A matching mark in the ledger hints that the crew’s scattering was not entirely random.',xp:40},
  {id:14,title:'Two Sisters, One Ship',tag:'San & Aisyah',unlock:()=>!!game.comicProgress?.[13],summary:'Sisterhood takes shape through teasing, trust, and the things neither woman can explain.',xp:40},
  {id:15,title:'The One Who Stayed',tag:'Eliz',unlock:()=>!!game.comicProgress?.[14],summary:'Eliz chooses the crew because they prove they need her—and because she chooses to stay.',xp:40},
  {id:16,title:'The Mark We Carried',tag:'San · Joel · Aisyah',unlock:()=>!!game.comicProgress?.[15],summary:'Three matching gem-like pendants are noticed for what they are: a mystery, not an answer.',xp:40},
  {id:17,title:'The Things We Do Without Knowing',tag:'Crew',unlock:()=>!!game.comicProgress?.[16],summary:'The crew falls into familiar roles even though none of them remembers why.',xp:40},
  {id:18,title:'The Storm That Was Owed',tag:'Mezstorm',unlock:()=>!!game.comicProgress?.[17],summary:'Mezstorm’s rescue leaves a deeper question: what does regeneration mean when identity itself can shift?',xp:40},
  {id:19,title:'The Crew We Choose',tag:'Mezstorm + Crew',unlock:()=>!!game.comicProgress?.[18],summary:'Mezstorm finds her place aboard the Crimson Tide through scenes with the people already aboard.',xp:40},
  {id:20,title:'Senedra — The Watchful Signal',tag:'Senedra',unlock:()=>!!game.comicProgress?.[19],summary:'The woman at the lighthouse is finally brought into the crew’s story—but not because someone defeated her guardian.',xp:50},
  {id:21,title:'Zaki — The Planner',tag:'Zaki',unlock:()=>!!game.comicProgress?.[20],summary:'Zaki’s prison-hulk survival reveals the careful planner beneath the fighter.',xp:50},
  {id:22,title:'Mezstorm — The Regeneration',tag:'Mezstorm',unlock:()=>!!game.comicProgress?.[21],summary:'Mezstorm confronts the strange regeneration and transformation that make her different in Crimson Tide.',xp:50},
  {id:23,title:'The Two Who Remembered',tag:'Senedra & Zaki',unlock:()=>!!game.comicProgress?.[22],summary:'Senedra and Zaki remember each other as siblings, but not Aisyah, San, Mezstorm, or Eliz.',xp:60},
  {id:24,title:'The Drowned Passage',tag:'Arc I Finale',unlock:()=>!!game.comicProgress?.[23] && !!game.finalCleared,summary:'Aldric and Wren join the reunited crew as the Drowned Admiral guards the way beyond the charts.',xp:75}
];
const ARC1_ART = {
  1:'assets/comics/arc1/ch01-storm-that-remained.png',
  2:'assets/comics/arc1/ch02-the-first-port.png',
  3:'assets/comics/arc1/ch03-a-crew-of-choice.png',
  4:'assets/comics/arc1/ch04-the-guardians-fortress.png',
  5:'assets/comics/arc1/ch05-the-voice-behind-the-wall.png',
  6:'assets/comics/arc1/ch06-the-shield-returns.png',
  7:'assets/comics/arc1/ch07-the-shield-that-remained.png',
  8:'assets/comics/arc1/ch08-the-tradewinds-remember.png',
  18:'assets/comics/arc1/ch18-mezstorm-rescue.png',
  19:'assets/comics/arc1/ch19-crew-we-choose.png',
  20:'assets/comics/arc1/ch20-senedra.png',
  21:'assets/comics/arc1/ch21-zaki.png',
  22:'assets/comics/arc1/ch22-mezstorm.png',
  23:'assets/comics/arc1/ch23-siblings.png',
  24:'assets/comics/arc1/ch24-drowned-passage.png'
};
function completeArc1Comic(id){
  const ch=ARC1_COMICS.find(x=>x.id===id); if(!ch || !ch.unlock()) return;
  game.comicProgress=game.comicProgress||{};
  if(game.comicProgress[id]) return;
  game.comicProgress[id]=true;
  gainXP(ch.xp); game.reputation=(game.reputation||0)+1;
  logEvent(`📖 Comic Chapter ${id} complete: ${ch.title} · +${ch.xp} XP`, 'gold');
  toast(`📖 Chapter ${id} complete · +${ch.xp} XP`);
  saveGame(); renderStory(); updateUI();
}
function renderArc1ComicArchive(){
  const completed=game.comicProgress||{};
  return `<section class="story-act"><div class="story-act-header"><div class="story-act-kicker">Arc I</div><div class="story-act-title">The First Voyage</div><div class="story-act-tagline">Comic chapters — narrative progression alongside the playable voyage.</div></div><div class="arc1-comic-grid">${ARC1_COMICS.map(ch=>{const unlocked=!!ch.unlock();const done=!!completed[ch.id];const img=ARC1_ART[ch.id];return `<article class="arc1-comic-card ${done?'complete':''} ${!unlocked?'locked':''}"><div class="arc1-comic-head"><div><div class="arc1-comic-title">Chapter ${ch.id} — ${esc(ch.title)}</div><div style="font-size:.76rem;opacity:.72;margin-top:3px;">${esc(ch.tag)}</div></div><div class="arc1-comic-status">${done?'✓ READ':unlocked?'AVAILABLE':'🔒 LOCKED'}</div></div><div class="story-chapter-text" style="margin-top:8px;">${esc(ch.summary)}</div>${unlocked ? ((ch.id>=1 && ch.id<=4) ? `<div class="story-actions"><button class="btn btn-small btn-magic" onclick="${done?`openStoryModeReplay(${ch.id})`:`openStoryMode(${ch.id})`}">📖 ${done?'Replay Story Mode':'Play Story Mode'}</button></div>` : (img ? `<div class="story-actions"><button class="btn btn-small btn-magic" onclick="openComicImage('${img}')">📖 Read Chapter</button></div>` : `<div class="arc1-comic-placeholder">Comic artwork will be added here.</div>`)) : ''}<div class="arc1-comic-xp">📖 Story XP: +${ch.xp}</div>${unlocked&&!done?`<div class="story-actions"><button class="btn btn-small btn-success" onclick="completeArc1Comic(${ch.id})">✓ Mark Chapter Read</button></div>`:''}</article>`}).join('')}</div></section>`;
}

function completeSelfEscape(companion){
  const port=PORTS.find(p=>p.companion===companion); if(!port || port.recruitment!=='escape' || game.foundCompanions[companion]) return;
  const quest=ARC1_STORY_QUESTS.find(q=>q.companion===companion);
  if(quest && level() < quest.level){ toast(`Requires Level ${quest.level} to continue this story chapter.`); return; }
  // Recruitment follows the established Legends of Daybreak order.
  const prior = companion==='senedra' ? 'mezstorm' : companion==='zaki' ? 'senedra' : null;
  if(prior && !game.foundCompanions[prior]){
    toast(`The story is not ready for ${ALL_PARTY.find(x=>x.id===companion)?.name || companion} yet.`);
    return;
  }
  if(quest && !arc1StoryPrereqMet(quest)){ toast('Complete the previous story chapter first.'); return; }
  const m=ALL_PARTY.find(x=>x.id===companion); if(!m) return;
  game.foundCompanions[companion]=true; game.partyHp[m.id]=m.hp; game.partyMp[m.id]=m.mp;
  gainXP(90); game.reputation=(game.reputation||0)+2;
  logEvent(`📖 ${m.name} escaped and joined the crew on their own · +90 XP`, 'gold');
  syncArc1StoryQuestProgress();
  toast(`${m.name} escaped — and is now aboard.`); saveGame(); renderStory(); updateUI(); renderExplore();
}
function readStoryQuestComic(id){
  const ch = ARC1_COMICS.find(x=>x.id===id);
  if(!ch || !ch.unlock()) return;
  if(STORY_MODE_CHAPTERS[id]) requestStoryMode(id,80);
  else {
    const img=ARC1_ART[id];
    if(img) window.open(img, '_blank', 'noopener');
  }
}
function renderStory() {
  const container = document.getElementById('storyContent');
  if (!container) return;

  let html = '';
  const so = objectiveState();
  const storyDefs = [
    {id:1, title:'The Storm That Remained', tag:'Survival Is the First Memory', req:'begin_chapter_1', done:!!game.comicProgress?.[1]},
    {id:2, title:'The First Port', tag:'Malacca', req:'complete_chapter_2', done:!!game.comicProgress?.[2]},
    {id:3, title:'A Crew of Choice', tag:'We Sail Together or Not at All', req:'complete_chapter_3', done:!!game.comicProgress?.[3]},
    {id:4, title:"The Guardian’s Fortress", tag:'Strategy Before the Storm', req:'complete_chapter_4', done:!!game.comicProgress?.[4]}
  ];

  html += `<section class="story-act story-quest-panel">
    <div class="story-act-header">
      <div class="story-act-kicker">Story</div>
      <div class="story-act-title">The Voyage</div>
      <div class="story-act-tagline">Story chapters are manual. Your Objective tells you which chapter is ready.</div>
    </div>`;

  storyDefs.forEach(ch => {
    const ready = !ch.done && so === ch.req;
    const locked = !ch.done && !ready;
    let status = ch.done ? '✓ COMPLETE' : (ready ? 'CURRENT' : '🔒 LOCKED');
    let action = ch.done
      ? `<div class="story-actions"><div class="story-chip">Chapter complete.</div></div>`
      : ready
        ? `<div class="story-actions"><button class="btn btn-small btn-magic" onclick="requestStoryMode(${ch.id},80)">▶ Play Chapter ${ch.id}</button></div>`
        : `<div class="story-actions"><div class="story-chip">Follow the current Objective first.</div></div>`;
    html += `<article class="story-chapter ${ready?'active':(ch.done?'complete':'locked')}">
      <div class="story-chapter-top"><div class="story-chapter-title">Chapter ${ch.id} — ${esc(ch.title)}</div><div class="story-status">${status}</div></div>
      <div class="story-chapter-text"><i>${esc(ch.tag)}</i></div>
      ${action}
    </article>`;
  });

  html += `</section>`;

  html += renderArc1ComicArchive();


  // The canonical Arc I comics own the narrative presentation. Story Mode is the interactive presentation; the archive remains the reference library.

  // ACT II
  html += `<div class="story-act">
    <div class="story-act-header">
      <div class="story-act-kicker">Act II</div>
      <div class="story-act-title">Fair Winds, Full Hands</div>
      <div class="story-act-tagline">What a whole crew does with a ship and a trade network.</div>
    </div>`;

  if (!game.finalCleared) {
    html += `<div class="story-chapter locked"><div class="story-chapter-title">🔒 Act II Locked</div>
      <div class="story-chapter-text">Finish the crew-recovery arc first.</div></div>`;
  } else {
    ACT2_CHAPTERS.forEach((ch, i) => {
      const done = i < game.act2Index;
      const active = i === game.act2Index;
      const port = PORTS.find(p => p.id === ch.portId);
      const have = game.cargo[ch.good] || 0;
      html += `<article class="story-chapter ${done?'complete':''} ${active?'active':''}">
        <div class="story-chapter-top">
          <div class="story-chapter-title">Chapter ${ch.id} — ${esc(ch.title)}</div>
          <div class="story-status">${done?'✓ COMPLETE':active?'CURRENT':'LOCKED'}</div>
        </div>
        <div class="story-chapter-text">${esc(done ? ch.resolution : ch.unlockBlurb)}</div>
        <div class="story-meta">
          <span class="story-chip gold">📍 ${esc(port ? port.name : ch.portId)}</span>
          <span class="story-chip">📦 ${ch.need}x ${esc(GOODS[ch.good].name)}</span>
          ${active ? `<span class="story-chip">Have ${have}</span>` : ''}
        </div>
      </article>`;
    });
  }
  html += `</div>`;

  // ACT III's standalone section previously rendered here has been folded
  // into the unified "Arc III — Origins" section (see the ct-build-v71-arc3
  // script below), which now covers chapters 1-26 continuously — including
  // these same 5 memory-fight chapters, renumbered 22-26 to match. The
  // underlying game.act3Index/ACT3_CHAPTERS/startMemoryFight() mechanics are
  // untouched (Act IV's unlock still depends on them); only this duplicate
  // rendering block is removed, to avoid showing two separate "Origins"
  // chapter lists with different unlock conditions on the same screen.

  container.innerHTML = html;
  // BUG FIX: renderAct4() used to always run here, rendering a leftover
  // "Act IV — The Old Crew" section from an earlier, abandoned narrative
  // direction (reconnecting with real-world "Daybreak" allies like KW
  // Liang in Singapore) that predates the current Veyren/Farseer/Horizon
  // Engine story established from Arc VI onward. That direction was never
  // continued, so this section has been sitting at the bottom of every
  // Story tab render ever since, showing content that no longer belongs
  // to the game. Not calling it anymore — the underlying function and
  // data are left defined but unused rather than deleted, since
  // renderComicPanels() may still be relied on elsewhere.
}

function bountyPool() {
  const pool = [];
  Object.entries(HARBOR_ENEMIES).forEach(([key, e]) => {
    if((typeof window.KNOWN_RIVAL_KEYS !== 'undefined') && window.KNOWN_RIVAL_KEYS.includes(key)) return; // named recurring rivals, not generic cullable mob types — excluded from the auto-generated bounty board so their names don't surface before they're properly introduced
    pool.push({id:'b_'+key, type:'kill', target:key, need: 2 + Math.floor(Math.random()*2),
      name: e.name + ' Cull', desc: `Defeat ${e.name} where you find them.`, icon: e.icon,
      rw: {xp: e.xp * 2, gold: e.gold * 2}});
  });
  Object.entries(SEA_ENEMIES).forEach(([key, e]) => {
    pool.push({id:'b_'+key, type:'kill', target:key, need: 1,
      name: 'Hunt: ' + e.name, desc: `Sink a ${e.name} at sea.`, icon: e.art,
      rw: {xp: e.xp, gold: e.gold}});
  });
  pool.push({id:'b_trade', type:'trade', target:null, need:3,
    name: 'Good Business', desc: 'Complete 3 trades (buy or sell) today.', icon:'💰',
    rw:{xp:120, gold:60}});
  return pool;
}
function refreshBounties() {
  const today = todayKey();
  if (game.bountyDay === today && game.bounties.length) return;
  const pool = bountyPool();
  const shuffled = pool.map(b => Object.assign({}, b, {c:0, done:false})).sort(() => Math.random() - 0.5);
  game.bounties = shuffled.slice(0, 10);
  game.bountyDay = today;
}
function checkBountyProgress(type, target, amount) {
  refreshBounties();
  game.bounties.forEach(b => {
    if (b.done || b.type !== type) return;
    if (type === 'kill' && b.target !== target) return;
    b.c = Math.min(b.need, b.c + amount);
    if (b.c >= b.need) {
      b.done = true;
      gainXP(b.rw.xp);
      game.gold += b.rw.gold;
      toast(`💰 Bounty complete: ${b.name} · +${b.rw.xp} XP · +${b.rw.gold}g`);
    } else if (typeof window.progressToast === 'function') {
      window.progressToast('💰 ' + b.name + ': ' + b.c + '/' + b.need);
    }
  });
}
function bountyBoardHTML() {
  refreshBounties();
  return `<h3 style="font-family:Cinzel;color:var(--gold);margin:18px 0 8px;font-size:1rem;">💰 Bounty Board</h3><p style="font-size:0.8rem;opacity:0.75;margin-bottom:10px;">Refreshes daily. Stack these on top of your normal hunting for bonus pay.</p><div class="chapter-grid">${game.bounties.map(b => `<article class="quest-item ${b.done ? 'completed' : ''}"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.4rem;">${b.icon}</div><div><strong>${b.name}</strong><br><span style="font-size:0.8rem;opacity:0.8;">${b.desc}</span><br><b style="font-size:0.8rem;">${b.done ? 'COMPLETE ✓' : `${b.c}/${b.need} · ${b.rw.xp} XP + ${b.rw.gold}g`}</b></div></div></article>`).join('')}</div>`;
}

// ---------------------------------------------------------------------------
// VOYAGE / SAILING
// ---------------------------------------------------------------------------
function isPortUnlocked(portId){
  if(portId==='singapore') return true;
  if(portId==='malacca') return !!game.comicProgress?.[1] && level()>=5;
  if(portId==='palembang') return !!game.foundCompanions?.joel;
  if(portId==='batavia') return !!game.foundCompanions?.aisyah;
  if(portId==='bangkok') return !!game.foundCompanions?.eliz;
  if(portId==='hanoi') return !!game.foundCompanions?.mezstorm;
  if(portId==='manila') return !!game.foundCompanions?.senedra;
  if(portId==='drowned_passage') return !!game.foundCompanions?.zaki;
  // Kota Batu: the real historic Brunei port, as opposed to the
  // illusion-memories of it visited in Arc III. Gated behind both a level
  // milestone and having resolved every one of those memory-fragment
  // illusions — narratively, the crew earns the real place only after
  // finishing with its echoes. Unlocks BEFORE Fair Tide (lower level
  // threshold) — Brunei comes first, then the crew's own home base.
  if(portId==='kota_batu') return level()>=50 && typeof window.arc3ObjectiveState==='function' && window.arc3ObjectiveState()==='arc3_chapters_complete_for_now';
  // Fair Tide: the crew's home base, still under construction at this point
  // in the story — unlocks after Kota Batu. Level 60 is deliberate: by Arc
  // 6 the crew captures Robin and Jeff, the former employers who hurt San
  // and Joel, and a level-60+ crew is meant to read as just formidable
  // enough to actually take both of them on.
  if(portId==='fair_tide') return level()>=60 && typeof window.arc3ObjectiveState==='function' && window.arc3ObjectiveState()==='arc3_chapters_complete_for_now';
  return false;
}

function renderNavigation() {
  const grid = document.getElementById('navPortGrid');
  if (!grid) return;
  const currentPort = PORTS.find(p => p.id === game.location);
  const objective = objectiveState();
  grid.innerHTML = PORTS.map(port => {
    if (port.id === game.location) {
      return `<div class="port-card current"><div class="port-icon">${port.icon}</div><div class="port-name">${port.name}</div><div class="port-dist">📍 You are here</div></div>`;
    }
    const unlocked = isPortUnlocked(port.id);
    const isObjectiveDestination = objective === 'sail_malacca' && port.id === 'malacca';
    if (!unlocked) {
      return `<div class="port-card" style="opacity:.55;"><div class="port-icon">🔒</div><div class="port-name">${port.name}</div><div class="port-dist">Locked</div></div>`;
    }
    const dist = currentPort?.distances?.[port.id] ?? '?';
    return `<div class="port-card ${isObjectiveDestination ? 'objective-target' : ''}" onclick="sailTo('${port.id}')" style="cursor:pointer;"><div class="port-icon">${port.icon}</div><div class="port-name">${port.name}</div><div class="port-dist">${isObjectiveDestination ? '🎯 Current Objective' : '⛵ ' + dist + ' units'} </div></div>`;
  }).join('');

  document.getElementById('voyageConditions').innerHTML =
    'Current wind: <span style="color: var(--success);">Favorable</span>. ' +
    (game.ship.sails >= 2 ? 'Your upgraded sails catch every breeze.' : 'Standard sails.') +
    '<br>Ship condition: ' + (game.health > 70 ? 'Good' : game.health > 30 ? 'Damaged' : '<span style="color: var(--danger);">Critical</span>') + '.';
}
function sailTo(portId) {
  if(!isPortUnlocked(portId)){ toast('🔒 This port is locked. Follow the current Objective first.'); return; }
  const currentPort = PORTS.find(p => p.id === game.location);
  const targetPort = PORTS.find(p => p.id === portId);
  const dist = currentPort.distances[portId];
  const travelDays = Math.max(1, dist - (game.ship.sails >= 3 ? 1 : 0));

  showModal('Set Sail?', 'Sail to ' + targetPort.name + '?<br><br>Distance: ' + dist + ' units<br>Travel time: ' + travelDays + ' day' + (travelDays > 1 ? 's' : '') + '<br>Danger level: ' + '⚔️'.repeat(targetPort.danger),
    [{text: '⚓ Set Sail', action: () => { closeModal(); doVoyage(portId, travelDays, targetPort.danger); }},
     {text: 'Stay in Port', action: closeModal}]);
}
function doVoyage(portId, days, dangerLevel) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('voyageScreen').classList.add('active');
  document.getElementById('voyageDest').textContent = 'To ' + PORTS.find(p => p.id === portId).name;

  let currentDay = 0;
  const interval = setInterval(() => {
    currentDay++;
    document.getElementById('voyageProgress').style.width = (currentDay / days * 100) + '%';
    game.day++;

    if (Math.random() < 0.3 + (dangerLevel * 0.07)) {
      const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      document.getElementById('voyageEvent').innerHTML = '<span style="color: var(--danger);">' + event.text + '</span>';

      if (event.combat) {
        clearInterval(interval);
        setTimeout(() => { startCombat({kind:'sea', key: event.combat, enemy: scaledEnemyForExplore(event.combat, 'sea')}); }, 1000);
        return;
      } else if (event.illusion) {
        clearInterval(interval);
        setTimeout(() => { if (typeof window.triggerIllusionEncounter === 'function') window.triggerIllusionEncounter(true); }, 1000);
        return;
      } else {
        handleVoyageEvent(event);
      }
    } else {
      document.getElementById('voyageEvent').innerHTML = '<span style="color: var(--success);">The voyage continues peacefully.</span>';
      logEvent('Day ' + game.day + ': Calm seas.', 'neutral');
    }

    if (currentDay >= days) {
      clearInterval(interval);
      setTimeout(() => {
        game.location = portId;
        generateMarketPrices();
        const port = PORTS.find(p => p.id === portId);
        logEvent('⚓ Arrived at ' + port.name + '! ' + port.desc, 'neutral');
        syncArc1StoryQuestProgress();
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('portScreen').classList.add('active');
        updateUI(); renderMarket(); renderExplore();
        triggerArrivalStory(portId);
        // Story is rebuilt after the Objective transition, so no browser refresh is needed.
        renderStory();
      }, 800);
    }
  }, 600);
}
function handleVoyageEvent(event) {
  switch(event.type) {
    case 'storm': {
      if (game.ship.sails >= 4) {
        logEvent('⛈️ A storm approached but your upgraded sails steered clear!', 'good');
      } else {
        const damage = 10 + Math.floor(Math.random() * 15);
        game.health -= damage;
        logEvent('⛈️ Caught in a storm! Hull took ' + damage + '% damage.', 'bad');
      }
      break;
    }
    case 'merchant': {
      const tipGold = 20 + Math.floor(Math.random() * 30);
      game.gold += tipGold;
      logEvent('🤝 Friendly merchant shared ' + tipGold + 'g.', 'gold');
      break;
    }
    case 'wreck': {
      const salvage = Math.floor(Math.random() * 3);
      if (salvage === 0) {
        const goodIds = Object.keys(GOODS).filter(g => g !== 'contraband');
        const goodId = goodIds[Math.floor(Math.random() * goodIds.length)];
        const qty = 3 + Math.floor(Math.random() * 5);
        game.cargo[goodId] = (game.cargo[goodId] || 0) + qty; game.cargoUsed += GOODS[goodId].weight * qty;
        logEvent('🚢 Salvaged ' + qty + 'x ' + GOODS[goodId].name + ' from a wreck!', 'good');
      } else if (salvage === 1) {
        const goldFound = 30 + Math.floor(Math.random() * 50);
        game.gold += goldFound;
        logEvent('🚢 Found ' + goldFound + 'g in a floating chest!', 'gold');
      } else {
        logEvent('🚢 The wreck was empty.', 'neutral');
      }
      break;
    }
    case 'calm':
      logEvent('🌊 Mirror-calm seas. The crew fishes and sings.', 'good');
      break;
    case 'treasure': {
      const treasure = 50 + Math.floor(Math.random() * 100);
      game.gold += treasure;
      logEvent('💎 Found ' + treasure + 'g floating in a sealed jar!', 'gold');
      break;
    }
  }
  if (game.health <= 0) {
    game.health = 1;
    showModal('Ship Critical!', 'Your ship is barely holding together! Emergency repairs cost 200g.',
      [{text: 'Pay 200g', action: () => { game.gold = Math.max(0, game.gold - 200); game.health = 30; closeModal(); updateUI(); }}]);
  }
}

// ---------------------------------------------------------------------------
// TAVERN
// ---------------------------------------------------------------------------
// renderPort() was called from 6 places (free rest, tavern rest, crew hire/
// dismiss) but never defined — every call threw an uncaught ReferenceError,
// silently aborting whatever function was mid-execution at that point. This
// mirrors what goScreen('port') already does to refresh the Port screen.
function renderPort() {
  try { renderMarket(); } catch(e) { console.error('[renderPort] renderMarket failed:', e); }
  try { renderCargo(); } catch(e) { console.error('[renderPort] renderCargo failed:', e); }
  try { renderIntel(); } catch(e) { console.error('[renderPort] renderIntel failed:', e); }
  try { renderExplore(); } catch(e) { console.error('[renderPort] renderExplore failed:', e); }
}
function freeRestAtPort() {
  if (game.freeRestDay === game.day) {
    toast('You have already used the free rest site today.');
    return;
  }

  game.freeRestDay = game.day;
  game.partyHp = game.partyHp || {};
  game.partyMp = game.partyMp || {};

  const permanent = typeof getActiveParty === 'function' ? getActiveParty() : [];
  permanent.forEach(m => {
    game.partyHp[m.id] = effectiveMaxHp(m);
    game.partyMp[m.id] = effectiveMaxMp(m);
  });

  (game.temporaryCrew || []).forEach(m => {
    game.partyHp[m.id] = Number(m.maxHp || m.hp || 1);
    game.partyMp[m.id] = Number(m.maxMp || m.mp || 0);
  });

  if ('health' in game && 'maxHealth' in game) game.health = game.maxHealth;

  logEvent('🔥 The crew rests at the free seafarer\'s site. Everyone is fully recovered.', 'good');

  if (Math.random() < 0.20) {
    logEvent('⚠️ The night does not stay quiet. An enemy approaches!', 'bad');
    updateUI();
    renderPort();
    setTimeout(() => {
      // BUG FIX: this used to call startRandomEncounter()/ENCOUNTERS, neither
      // of which exist anywhere in this build — so the 20% roll fired, logged
      // the warning line, and then silently did nothing (no fight, no log
      // entry, no XP). Reusing the exact same pool/scaling/startCombat path
      // that the Explore tab's harbor fights already use, so the ambush is
      // always a real, level-appropriate, location-appropriate fight.
      const port = PORTS.find(p => p.id === game.location);
      const pool = (port && port.harbor && port.harbor.length)
        ? port.harbor
        : Object.keys(HARBOR_ENEMIES).filter(k => k !== 'robin' && k !== 'jeff');
      const key = pool[Math.floor(Math.random() * pool.length)];
      startCombat({ kind: 'harbor', key, enemy: scaledEnemyForExplore(key, 'harbor') });
    }, 350);
    return;
  }

  updateUI();
  renderPort();
  if (typeof renderTemporaryCrew === 'function') renderTemporaryCrew();
  const status = document.getElementById('freeRestStatus');
  if (status) status.textContent = 'Used today. Fully recovered; 20% encounter risk. Available again after the day advances.';
}

const TEMP_CREW = [
  { id:'dockhand', name:'Dockhand', role:'Fighter', level:1, maxHp:75, maxMp:30, attack:13, portrait:'⚔️', portraitAsset:'assets/portraits/generic_dockhand.png', icon:'⚔️', cost:5 },
  { id:'lookout', name:'Lookout', role:'Scout', level:1, maxHp:55, maxMp:30, attack:15, portrait:'🏹', portraitAsset:'assets/portraits/generic_lookout.png', icon:'🏹', cost:5 },
  { id:'deckhand', name:'Deckhand', role:'Guard', level:1, maxHp:85, maxMp:30, attack:10, portrait:'🛡️', portraitAsset:'assets/portraits/generic_deckhand.png', icon:'🛡️', cost:5 },
  { id:'shiphealer', name:"Ship's Healer", role:'Healer', level:1, maxHp:48, maxMp:60, attack:7, portrait:'✨', portraitAsset:'assets/portraits/generic_shiphealer.png', icon:'✨', cost:7 }
];

function hireTemporaryCrew(id) {
  const hire = TEMP_CREW.find(c => c.id === id);
  if (!hire) return;
  if ((game.gold || 0) < hire.cost) {
    toast(`You need ${hire.cost}g to hire ${hire.name}.`);
    return;
  }
  const capacity = getShipCrewCapacity();
  if (getTotalCrewCount() >= capacity) {
    toast('The ship is at crew capacity.');
    return;
  }
  game.gold -= hire.cost;
  game.temporaryCrew = game.temporaryCrew || [];
  if (game.temporaryCrew.some(c => c.id === id)) {
    toast(`${hire.name} is already aboard.`);
    return;
  }
  game.temporaryCrew.push({...hire, temp:true});
  game.partyHp = game.partyHp || {};
  game.partyMp = game.partyMp || {};
  game.partyHp[hire.id] = hire.maxHp;
  game.partyMp[hire.id] = Number(hire.maxMp || 30);
  logEvent(`🍺 ${hire.name} joins the crew for this voyage.`, 'good');
  if (objectiveState() === 'recruit_crew') completeObjectiveAndRefresh('complete_chapter_3','recruited a temporary crew member');
  renderPort();
  updateUI();
}

function dismissTemporaryCrew(id) {
  game.temporaryCrew = (game.temporaryCrew || []).filter(c => c.id !== id);
  renderPort();
  updateUI();
}

function getPermanentCrewCount() {
  return typeof getActiveParty === 'function' ? getActiveParty().length : 1;
}

function getShipCrewCapacity() {
  const ship = game.shipType || game.ship || 'cutter';
  const capacities = {
    cutter: 5, small_cutter: 5,
    sloop: 8,
    brig: 12,
    galleon: 18,
    flagship: 25
  };
  return capacities[ship] || Number(game.shipCrewCapacity || 5);
}

function getTotalCrewCount() {
  return getPermanentCrewCount() + (game.temporaryCrew || []).length;
}

function renderTemporaryCrew() {
  const el = document.getElementById('temporaryCrewList');
  // Two different labels, two different jobs — used to share one id
  // (only the first ever actually updated; the Tavern's copy was
  // silently stuck). The Port screen's is just an at-a-glance count, so
  // it drops the "/capacity" — that cap only ever limits temporary
  // hires, not permanent story crew, and showing it there made a normal
  // 15-person crew look like it was somehow over a 5-person limit. The
  // Tavern's keeps the ratio, since that's exactly the number that
  // matters when you're deciding whether you can hire someone here.
  const portLabel = document.getElementById('crewCapacityLabelPort');
  if (portLabel) portLabel.textContent = `${getTotalCrewCount()} crew`;
  const tavernLabel = document.getElementById('crewCapacityLabelTavern');
  if (tavernLabel) tavernLabel.textContent = `${getTotalCrewCount()} / ${getShipCrewCapacity()} crew aboard`;
  if (!el) return;

  el.innerHTML = TEMP_CREW.map(c => {
    const aboard = (game.temporaryCrew || []).some(t => t.id === c.id);
    return `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:7px 0;padding:8px;border:1px solid rgba(232,197,71,.18);border-radius:8px;">
      <div><b>${c.icon} ${c.name}</b><div style="font-size:.72rem;opacity:.72;">${c.role} • ${c.maxHp} HP • ${c.cost}g / voyage</div></div>
      ${aboard
        ? `<button class="btn btn-danger" onclick="dismissTemporaryCrew('${c.id}')">Dismiss</button>`
        : `<button class="btn btn-magic" onclick="hireTemporaryCrew('${c.id}')">Hire ${c.cost}g</button>`}
    </div>`;
  }).join('');
}

function restoreAllAboardCrew() {
  game.partyHp = game.partyHp || {};
  game.partyMp = game.partyMp || {};
  const permanent = typeof getActiveParty === 'function' ? getActiveParty() : [];
  permanent.forEach(m => {
    game.partyHp[m.id] = effectiveMaxHp(m);
    game.partyMp[m.id] = effectiveMaxMp(m);
  });
  (game.temporaryCrew || []).forEach(m => {
    game.partyHp[m.id] = Number(m.maxHp || m.hp || 1);
    game.partyMp[m.id] = Number(m.maxMp || m.mp || 0);
  });
}
// Shares game.freeRestDay with freeRestAtPort — one rest per day between
// the two of them, matching "the free site and the paid tavern are both
// still just resting somewhere out in the world" versus Captain's Quarters
// (see restInCaptainsQuarters), which is deliberately unlimited since it's
// the one place meant to always be safe and available.
function restAtTavern() {
  if (game.freeRestDay === game.day) {
    toast('Already rested today. Come back tomorrow — or head home to the Captain\'s Quarters, which is always free.');
    return;
  }
  const cost = 15;
  if ((game.gold || 0) < cost) {
    toast('You need 15g for a tavern rest.');
    return;
  }

  game.gold -= cost;
  game.freeRestDay = game.day;
  game.partyHp = game.partyHp || {};
  game.partyMp = game.partyMp || {};

  // Full recovery applies to every crew member currently aboard,
  // including temporary hires who fell in battle.
  const permanent = typeof getActiveParty === 'function' ? getActiveParty() : [];
  permanent.forEach(m => {
    game.partyHp[m.id] = effectiveMaxHp(m);
    game.partyMp[m.id] = effectiveMaxMp(m);
  });

  (game.temporaryCrew || []).forEach(m => {
    game.partyHp[m.id] = Number(m.maxHp || m.hp || 1);
    game.partyMp[m.id] = Number(m.maxMp || m.mp || 0);
  });

  if ('health' in game && 'maxHealth' in game) game.health = game.maxHealth;

  logEvent('🏨 The crew rests safely at the tavern. Everyone aboard is fully restored for 15g.', 'good');
  updateUI();
  renderPort();
  if (typeof renderTavern === 'function') renderTavern();
  if (typeof renderTemporaryCrew === 'function') renderTemporaryCrew();
}
function listenForRumors() {
  if (game.gold < 5) { toast('Not enough gold!'); return; }
  game.gold -= 5;
  const rumor = RUMORS[Math.floor(Math.random() * RUMORS.length)];
  game.rumors.push(rumor);
  logEvent('👂 Heard: "' + rumor + '"', 'neutral');
  renderTavern();
  updateUI();
  renderLandingV24(); renderAFKWelcome();
}
function renderTavern() {
  renderTemporaryCrew();
  renderLoginRewards();
  document.getElementById('tavernRumors').innerHTML =
    '<p>The tavern is warm and loud. Sailors swap stories over mugs of palm wine.</p>' +
    '<p style="margin-top:10px;"><strong>Recent Rumors:</strong></p>' +
    '<ul style="margin-left:20px;margin-top:5px;">' +
    (game.rumors.slice(-5).map(r => '<li>' + r + '</li>').join('') || '<li>No rumors heard yet.</li>') +
    '</ul>';
  document.getElementById('questBoard').innerHTML = questBoardHTML();
  document.getElementById('potionShop').innerHTML = potionShopHTML(p => !p.temple);
}

// ---------------------------------------------------------------------------
// SHIPYARD — vessel tiers unlock by level; per-stat upgrades scale within
// whatever cap the current hull allows.
// ---------------------------------------------------------------------------
function renderVessels() {
  const container = document.getElementById('vesselContent');
  if (!container) return;
  container.innerHTML = VESSELS.map((v, i) => {
    const owned = i === game.shipTier;
    const owned_or_worse = i <= game.shipTier;
    const lockedByLevel = level() < v.minLevel;
    let btn;
    if (owned) btn = '<b style="font-size:0.8rem;color:var(--success);">CURRENT HULL</b>';
    else if (owned_or_worse) btn = '<span style="font-size:0.8rem;opacity:0.5;">Already surpassed</span>';
    else if (lockedByLevel) btn = `<span style="font-size:0.8rem;opacity:0.7;">🔒 Requires Level ${v.minLevel}</span>`;
    else btn = `<button class="btn btn-small ${game.gold < v.cost ? '' : 'btn-success'}" onclick="buyVessel('${v.id}')" ${game.gold < v.cost ? 'disabled' : ''}>Commission · ${v.cost}g</button>`;
    return `<article class="quest-item ${owned ? 'completed' : ''}"><div style="display:flex;gap:10px;align-items:center;"><div style="font-size:1.8rem;">${v.icon}</div><div style="flex:1;"><strong>${v.name}</strong><br><span style="font-size:0.8rem;opacity:0.8;">${v.desc}</span><br><span style="font-size:0.75rem;opacity:0.7;">Lv.${v.minLevel}+ · ${v.cargoBase} cargo · ${v.hpBase} max HP · stat cap ${v.statCap}</span></div>${btn}</div></article>`;
  }).join('');
}
function renderShipyard() {
  document.getElementById('yardShipName').textContent = game.shipName;
  renderVessels();
  const cap = shipStatCap();
  const costs = {
    hull: shipUpgradeCost('hull'),
    cannons: shipUpgradeCost('cannons'),
    sails: shipUpgradeCost('sails'),
    cargo: shipUpgradeCost('cargo')
  };
  const container = document.getElementById('shipyardContent');
  container.innerHTML = '<p>Welcome to the shipyard, Captain. What would you like to improve? Hull choices unlock with captain level, while ship upgrades continue scaling with your level — there is no fixed endgame cap.</p>' +
    '<div style="margin-top: 15px;">' +
    '<div class="ship-stat-row"><span>Hull Strength (Lvl ' + game.ship.hull + '/' + cap + ')</span><span>' + costs.hull + 'g</span></div>' +
    '<div class="ship-stat-row"><span>Cannons (Lvl ' + game.ship.cannons + '/' + cap + ')</span><span>' + costs.cannons + 'g</span></div>' +
    '<div class="ship-stat-row"><span>Sails (Lvl ' + game.ship.sails + '/' + cap + ')</span><span>' + costs.sails + 'g</span></div>' +
    '<div class="ship-stat-row"><span>Cargo Holds (Lvl ' + game.ship.cargo + '/' + cap + ')</span><span>' + costs.cargo + 'g</span></div>' +
    '</div>' +
    '<p style="margin-top: 15px;">Current gold: <strong>' + game.gold + 'g</strong></p>' +
    '<div style="margin-top: 15px;">' +
    `<button class="btn" onclick="upgradeShip('hull', ${costs.hull})" ${game.gold < costs.hull || game.ship.hull >= cap ? 'disabled' : ''}>🛡️ Hull</button>` +
    `<button class="btn" onclick="upgradeShip('cannons', ${costs.cannons})" ${game.gold < costs.cannons || game.ship.cannons >= cap ? 'disabled' : ''}>🔫 Cannons</button>` +
    `<button class="btn" onclick="upgradeShip('sails', ${costs.sails})" ${game.gold < costs.sails || game.ship.sails >= cap ? 'disabled' : ''}>🌬️ Sails</button>` +
    `<button class="btn" onclick="upgradeShip('cargo', ${costs.cargo})" ${game.gold < costs.cargo || game.ship.cargo >= cap ? 'disabled' : ''}>📦 Cargo</button>` +
    '</div>';
}
function upgradeShip(type, cost) {
  const cap = shipStatCap();
  if (game.gold < cost || game.ship[type] >= cap) return;
  game.gold -= cost;
  game.ship[type]++;
  if (type === 'hull') { game.maxHealth += 25; game.health += 25; }
  if (type === 'cargo') game.cargoCapacity += 25;
  logEvent('🔧 Upgraded ' + type + '! Now level ' + game.ship[type] + '.', 'good');
  renderShipyard();
  updateUI();
}

// ---------------------------------------------------------------------------
// XP / LEVEL
// ---------------------------------------------------------------------------
function gainXP(amount) {
  const before = level();
  const beforeObjective = objectiveState();
  // Reputation rank XP bonus (see ct-build-v91-reputation-ranks) — applied
  // to the raw amount before the existing 5000 cap, so a single big grant
  // can't blow past that cap just because a bonus pushed it slightly over;
  // in practice no chapter/boss grant is anywhere near 5000 to begin with.
  const xpBonus = (typeof window.getReputationBonus === 'function') ? window.getReputationBonus('xpBonus') : 0;
  if (xpBonus > 0) amount = Math.round(amount * (1 + xpBonus));
  game.xpTotal += Math.max(0, Math.min(amount, 5000));
  const after = level();
  if (after > before) {
    logEvent('⭐ LEVEL UP! Now level ' + after + '!', 'gold');
    // Capture the old Objective before adding XP. Once Level 5 is reached,
    // objectiveState() naturally changes to 'sail_malacca'. Checking it after
    // the XP change was why V48 could miss this transition.
    if (before < 5 && after >= 5 && game.comicProgress?.[1] && !game.foundCompanions?.joel && beforeObjective === 'reach_level_5') {
      completeObjectiveAndRefresh('sail_malacca','reached Level 5');
    } else {
      toast(`⭐ Objective progress: reached Level ${after}.`, 3200);
    }
  }
  syncShipToCaptainLevel();
  updateCrimsonXPDisplay();
  try { renderMainGoal(); } catch(e) {}
  try { if (document.getElementById('storyScreen')?.classList.contains('active')) renderStory(); } catch(e) {}
  saveGameQuiet();
}

// ---------------------------------------------------------------------------
// COMBAT SYSTEM
// ---------------------------------------------------------------------------
// Level-based HP/MP growth. Previously effectiveMaxHp/Mp had NO level term at
// all — HP only ever grew from equipped gear, meaning a level-280 character
// with no HP gear was stuck at the exact same tiny base stat as level 1,
// while enemies (scaleCrimsonEnemy, 'harbor'/'sea' kind) scale up to 2.8x HP
// by around level 19 and then stay flat forever after that. Calibrated so
// player HP reaches roughly that same 2.8x by a comparable point (~level 60,
// intentionally a bit past enemies' plateau so the player feels ahead, not
// just caught up), then keeps growing slowly through the long late-game
// instead of flatlining, capping at 6x base (HP) / 5x base (MP) — reached
// around level 168 / 161 respectively. Soel is deliberately excluded: his
// flavor text is "unkillable — he reforms from spirit flame," a fixed-stat
// mascot/support unit rather than a scaling combatant.
function levelStatMult(kind){
  const lv = Math.max(1, level());
  const steps = Math.max(0, lv - 1);
  if(kind==='mp') return Math.min(5, 1 + steps*0.025);
  return Math.min(6, 1 + steps*0.03);
}
function effectiveMaxHp(m) {
  // Idempotency guard: getCrimsonCombatParty() calls this once per member
  // to build its transformed combat-party objects, and stamps the result
  // onto _scaledMaxHp. Combat code then calls effectiveMaxHp again many
  // times on those SAME transformed objects (heal targeting, damage calc,
  // etc.) — without this guard, each call would re-apply the level
  // multiplier on top of an already-scaled number, compounding without
  // bound. Raw ALL_PARTY members never have this field, so they always
  // compute fresh; already-transformed objects always short-circuit.
  if (m._scaledMaxHp != null) return m._scaledMaxHp;
  const t = trinketBonus(m.id); const g = gearBonuses(m.id);
  const base = Number(m.maxHp ?? m.hp ?? 1);
  const scaledBase = (m.id==='soel') ? base : Math.round(base * levelStatMult('hp'));
  return scaledBase + (t && t.hpBonus ? t.hpBonus : 0) + g.hp;
}
function partyHpOf(m) { return game.partyHp[m.id] != null ? game.partyHp[m.id] : effectiveMaxHp(m); }
function partyMpOf(m) { return game.partyMp[m.id] != null ? game.partyMp[m.id] : effectiveMaxMp(m); }
function effectiveMaxMp(m) {
  if (m._scaledMaxMp != null) return m._scaledMaxMp;
  const t = trinketBonus(m.id);
  const base = Number(m.maxMp ?? m.mp ?? 0);
  const scaledBase = (m.id==='soel') ? base : Math.round(base * levelStatMult('mp'));
  return scaledBase + (t && t.mpBonus ? t.mpBonus : 0);
}
function trinketBonus(memberId) {
  const trophy = game.equippedTrophies && game.equippedTrophies[memberId];
  if (!trophy) return null;
  return TRINKET_BONUS[trophy.icon] || null;
}


function getAvailableCrewForVoyage() {
  const permanent = typeof getActiveParty === 'function' ? getActiveParty() : [];
  return permanent.concat(game.temporaryCrew || []);
}


function buildCombatRoster() {
  const permanent = typeof getActiveParty === 'function' ? getActiveParty() : [];
  const temps = (game.temporaryCrew || []).map(t => ({
    ...t,
    id: t.id,
    name: t.name,
    role: t.role,
    level: Number(t.level || 1),
    maxHp: Number(t.maxHp || 50),
    hp: Number((game.partyHp && game.partyHp[t.id]) ?? t.maxHp ?? 50),
    maxMp: Number(t.maxMp || 30),
    mp: Number((game.partyMp && game.partyMp[t.id]) ?? t.maxMp ?? 30),
    attack: Number(t.attack || 10),
    temp: true
  }));
  return permanent.concat(temps);
}

function syncTemporaryCrewHp(roster) {
  game.partyHp = game.partyHp || {};
  game.partyMp = game.partyMp || {};
  roster.filter(m => m.temp).forEach(m => {
    game.partyHp[m.id] = Math.max(0, Number(m.hp ?? game.partyHp[m.id] ?? m.maxHp));
    game.partyMp[m.id] = Math.max(0, Number(m.mp ?? game.partyMp[m.id] ?? m.maxMp));
  });
}


function getCrimsonCombatParty() {
  const permanent = (typeof getActiveParty === 'function' ? getActiveParty() : []).map(m => {
    // BUG FIX: this used to compute maxHp/maxMp via `m.maxHp ?? m.hpMax ?? 1`
    // — but ALL_PARTY entries only ever define `.hp`/`.mp` (never `.maxHp`/
    // `.hpMax`), so that always fell through to the literal fallback `1`.
    // Every combat-party object's maxHp was silently 1 this whole time,
    // which then poisoned effectiveMaxHp's own `m.maxHp ?? m.hp` check on
    // the SAME object (since maxHp was no longer undefined — it was really
    // 1). Now computed from the real effectiveMaxHp/Mp on the raw member
    // (base stat + level scaling + gear), before this object's own fields
    // get overwritten below.
    const realMaxHp = effectiveMaxHp(m);
    const realMaxMp = effectiveMaxMp(m);
    // Bonded by the Tide (Arc V, Ch.4): +5% max HP/MP for San and Joel while
    // the bond is active. See window.bondedTideActive() (defined in the
    // Arc V script block, guarded with typeof so this never breaks if that
    // block hasn't loaded for some reason).
    const bondUp = (typeof window.bondedTideActive === 'function' && window.bondedTideActive() && (m.id === 'san' || m.id === 'joel'))
      ? 1 + ((typeof window.sanJoelBondValues === 'function' ? window.sanJoelBondValues().hpMpPct : 5) / 100)
      : 1;
    const bondedMaxHp = Math.round(realMaxHp * bondUp);
    const bondedMaxMp = Math.round(realMaxMp * bondUp);
    return {
      ...m,
      temp: false,
      hp: Number((game.partyHp || {})[m.id] ?? bondedMaxHp),
      maxHp: bondedMaxHp,
      _scaledMaxHp: bondedMaxHp,
      mp: Number((game.partyMp || {})[m.id] ?? bondedMaxMp),
      maxMp: bondedMaxMp,
      _scaledMaxMp: bondedMaxMp
    };
  });

  const temporary = (game.temporaryCrew || []).map(t => ({
    ...t,
    temp: true,
    hp: Number((game.partyHp || {})[t.id] ?? t.maxHp ?? 1),
    maxHp: Number(t.maxHp ?? 1),
    mp: Number((game.partyMp || {})[t.id] ?? t.maxMp ?? 0),
    maxMp: Number(t.maxMp ?? 0),
    level: Number(t.level || 1),
    attack: Number(t.attack || 10),
    role: t.role || 'Crew'
  }));

  // San/permanent companions first, then temporary hires.
  return permanent.concat(temporary);
}

function crimsonCombatantIsAlive(m) {
  return Number(m.hp ?? partyHpOf(m) ?? 0) > 0;
}

function syncCrimsonCombatParty(party) {
  game.partyHp = game.partyHp || {};
  game.partyMp = game.partyMp || {};
  party.filter(m => m.temp).forEach(m => {
    game.partyHp[m.id] = Math.max(0, Number(m.hp ?? 0));
    game.partyMp[m.id] = Math.max(0, Number(m.mp ?? 0));
  });
}


function updateCrimsonCombatRosterDisplay() {
  const el = document.getElementById('combatPartyRoster');
  if (!el) return;
  const party = getCrimsonCombatParty();
  el.innerHTML = '⚓ Combat crew: ' + party.map(m =>
    `${m.name}${m.temp ? ' (temporary)' : ''} ${Math.max(0, Number(m.hp || 0))}/${Number(m.maxHp || 0)} HP`
  ).join(' • ');
}

function startCombat(encounter) {
  ctPlayMusic('combat');
  updateCrimsonCombatRosterDisplay();

  hidePostBattleAction();
  const enemy = encounter.enemy;
  if (!enemy) return;
  if (game.combatActionTimer) { clearTimeout(game.combatActionTimer); game.combatActionTimer = null; }
  game.inCombat = true;
  game.combatResolved = false;
  game.pendingPostBattle = null;
  game.combatSessionId = (game.combatSessionId || 0) + 1;
  // BUG FIX: starting a different fight (Training Room, a harbor
  // Challenge, a story battle, etc.) while an Uncharted Reach session
  // was still marked active left game.uncharted.active stuck true with
  // nothing real behind it anymore. The Fair Tide Hub's "Currently out
  // at Wave N — Return to the fight" card kept showing, but that button
  // is just goScreen('combat') — it doesn't start a new fight, it trusts
  // whatever combat state already exists. So it would land on whatever
  // fight happened most recently (e.g. an already-finished training
  // bout) instead of a real Reach encounter. Starting any other kind of
  // fight now properly ends the stale Reach session.
  if (encounter.kind !== 'uncharted' && game.uncharted && game.uncharted.active) {
    game.uncharted.active = false;
  }
  // Same protection, extended to Research Expedition — this fix predates
  // Expedition mode (built later, V129) and was never carried over to it,
  // so it had the exact same stale-session bug the Reach used to have.
  if (encounter.kind !== 'expedition' && game.expedition && game.expedition.active) {
    game.expedition.active = false;
  }
  game.combatEnemy = Object.assign({}, enemy, {kind: encounter.kind, key: encounter.key, portId: encounter.portId});
  game.combatEnemyHp = enemy.hp;
  game.combatTurn = 0;
  game.combatRound = 1;
  game.combatLog = [];
  game.shieldTurns = 0; game.shieldPct = 0;
  game.hasteTurns = 0; game.hastePct = 0;
  game.enemyVulnerable = 0; game.enemyVulnerablePct = 0;
  game.timeStopTurns = 0;
  game.markedBoss = false;
  game.defending = {};
  game.enemyStatus = null;
  game.growthUsedThisBattle = {};
  game.nervousCourageActive = false;
  game.spellMenuOpen = false;
  game.itemMenuOpen = false;
  game.skillMenuOpen = false;

  const party = getCrimsonCombatParty();
  syncCrimsonCombatParty(party);
  party.forEach(m => {
    if (game.partyHp[m.id] == null) game.partyHp[m.id] = m.hp;
    if (game.partyMp[m.id] == null) game.partyMp[m.id] = m.mp;
  });

  logCombat('⚔️ ' + (enemy.name) + ' appears! ' + enemy.desc);
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('combatScreen').classList.add('active');
  renderCombat();
}


function showPostBattleAction(message) {
  const box = document.getElementById('postBattleActions');
  const msg = document.getElementById('postBattleMessage');
  if (!box) return;
  if (msg) msg.textContent = message || 'Battle complete.';
  box.style.display = 'block';
}

function hidePostBattleAction() {
  const box = document.getElementById('postBattleActions');
  if (box) box.style.display = 'none';
}

// Reconstructs the post-battle message + action buttons from
// game.pendingPostBattle (set by handleVictory/handleDefeat). Called both
// right after combat resolves AND from goScreen's 'combat' branch, so
// navigating back to an unresolved post-battle choice — including after a
// full page reload, where the DOM these buttons live in no longer exists —
// shows the correct working buttons instead of a stuck/blank screen.
function renderPendingPostBattle() {
  if (!game.pendingPostBattle) return;
  showPostBattleAction(game.pendingPostBattle.message);
  const actionsDiv = document.getElementById('combatActions');
  if (actionsDiv) actionsDiv.innerHTML = game.pendingPostBattle.buttonsHtml;
  const autoBtn = document.getElementById('autoBattleBtn');
  if (autoBtn) autoBtn.style.display = 'none';
}

function exitBattleToPort() {
  // Stop any remaining combat loop/timers if the build exposes them.
  try { if (typeof stopAutoBattle === 'function') stopAutoBattle(); } catch(e) {}
  try { if (typeof endCombat === 'function') endCombat(); } catch(e) {}
  // BUG FIX: leaving combat this way (Return to Port, or the "← Leave"
  // button after a Reach victory) never cleared game.uncharted.active —
  // only the dedicated Retreat button did that. So finishing a Reach
  // wave and exiting through any other path left the Fair Tide Hub
  // stuck showing "Currently out at Wave N — Return to the Fight"
  // forever, even though the player had genuinely left. Neither of the
  // earlier fixes caught this: the saved combatEnemy really was
  // kind:'uncharted' (a real wave was fought), so this is a distinct
  // gap from both of those, not a repeat of either.
  if (game.uncharted && game.uncharted.active) {
    game.uncharted.active = false;
  }
  // Same fix, extended to Research Expedition — this predates Expedition
  // mode (V129) and was never carried over, so leaving an expedition
  // fight via Return to Port or the Leave button left game.expedition.active
  // stuck true forever, exactly the same symptom as the original Reach bug.
  if (game.expedition && game.expedition.active) {
    game.expedition.active = false;
  }
  game.inCombat = false;
  game.pendingPostBattle = null;
  hidePostBattleAction();
  goScreen('port');
  if (typeof renderPort === 'function') renderPort();
}

// BUG FIX: winning an Inter-World Expedition fight used the generic
// exitBattleToPort() button, which sails the crew all the way back to
// their home port — even though the whole point of "staying" at a
// destination is to be able to explore it further (launch another
// expedition roll, hunt for more discoveries) without a fresh two-day
// crossing each time. This mirrors exitBattleToPort's cleanup exactly,
// just landing on the interworld screen instead of port.
function exitInterworldBattleToDestination() {
  try { if (typeof stopAutoBattle === 'function') stopAutoBattle(); } catch(e) {}
  try { if (typeof endCombat === 'function') endCombat(); } catch(e) {}
  if (game.uncharted && game.uncharted.active) { game.uncharted.active = false; }
  if (game.expedition && game.expedition.active) { game.expedition.active = false; }
  game.inCombat = false;
  game.pendingPostBattle = null;
  hidePostBattleAction();
  goScreen('interworld');
  if (typeof renderInterworldScreen === 'function') renderInterworldScreen();
}

// Same pattern as exitInterworldBattleToDestination, for the Unknown
// Harbour / Tide Network settlement / Clan Settlement Explore tabs —
// all three previously shared the plain 'harbor' combat kind with home
// Port fights, so winning one of these fights fell through to
// exitBattleToPort() and sailed the crew all the way home instead of
// leaving them at the location they were exploring.
function exitHarbourBattleToDestination() {
  try { if (typeof stopAutoBattle === 'function') stopAutoBattle(); } catch(e) {}
  try { if (typeof endCombat === 'function') endCombat(); } catch(e) {}
  if (game.uncharted && game.uncharted.active) { game.uncharted.active = false; }
  if (game.expedition && game.expedition.active) { game.expedition.active = false; }
  game.inCombat = false;
  game.pendingPostBattle = null;
  hidePostBattleAction();
  goScreen('harbour');
  if (typeof renderHarbourScreen === 'function') renderHarbourScreen();
}
function exitTideNetworkBattleToDestination() {
  try { if (typeof stopAutoBattle === 'function') stopAutoBattle(); } catch(e) {}
  try { if (typeof endCombat === 'function') endCombat(); } catch(e) {}
  if (game.uncharted && game.uncharted.active) { game.uncharted.active = false; }
  if (game.expedition && game.expedition.active) { game.expedition.active = false; }
  game.inCombat = false;
  game.pendingPostBattle = null;
  hidePostBattleAction();
  goScreen('tidenetwork');
  if (typeof renderTideNetworkScreen === 'function') renderTideNetworkScreen();
}
function exitClanSettlementBattleToDestination() {
  try { if (typeof stopAutoBattle === 'function') stopAutoBattle(); } catch(e) {}
  try { if (typeof endCombat === 'function') endCombat(); } catch(e) {}
  if (game.uncharted && game.uncharted.active) { game.uncharted.active = false; }
  if (game.expedition && game.expedition.active) { game.expedition.active = false; }
  game.inCombat = false;
  game.pendingPostBattle = null;
  hidePostBattleAction();
  goScreen('clansettlement');
  if (typeof renderClanSettlementScreen === 'function') renderClanSettlementScreen();
}

// Always-visible "← Leave" control in the combat header — a persistent
// escape hatch, separate from the dynamically-rendered combatActions
// buttons, so a stuck/broken post-battle screen (like the Uncharted
// Reach state-sync bug) always has a way out regardless of whether
// those buttons rendered correctly. If combat has already resolved,
// this exits straight to port (completely safe — the fight is over
// either way). If a fight is genuinely still ongoing, it routes through
// the existing fleeCombat() restrictions and odds instead of bypassing
// them, so guardian/final/memory/Reach fights still can't be skipped
// out of early just because this button exists in a new place.
function leaveCombatScreen() {
  if (!game.inCombat || game.combatResolved) {
    exitBattleToPort();
  } else {
    fleeCombat();
  }
}


function crimsonTurnOrderText() {
  const party = getCrimsonCombatParty().filter(m => partyHpOf(m) > 0);
  return party.map((m, i) => `${i === game.combatTurn ? '▶ ' : ''}${m.name}`).join('  →  ');
}

function renderCombat() {
  const enemy = game.combatEnemy;
  const party = getCrimsonCombatParty();
  const aliveParty = party.filter(m => partyHpOf(m) > 0);

  document.getElementById('enemyArt').textContent = enemy.art || enemy.icon || '⚔️';
  document.getElementById('enemyName').textContent = enemy.name;
  const hpPct = Math.max(0, game.combatEnemyHp / enemy.hp * 100);
  document.getElementById('enemyHpText').textContent = game.combatEnemyHp + ' / ' + enemy.hp + ' HP';
  document.getElementById('enemyHpBar').style.width = hpPct + '%';
  const statusEl = document.getElementById('enemyBuffs');
  if (statusEl) {
    let s = '';
    if (game.enemyStatus) s += `<span class="buff-icon buff-mark">${game.enemyStatus.type === 'burn' ? '🔥' : game.enemyStatus.type === 'poison' ? '🧪' : '⚡'} ${game.enemyStatus.type} x${game.enemyStatus.turns}</span>`;
    if (game.enemyVulnerable > 0) s += `<span class="buff-icon buff-mark">🧭 exposed x${game.enemyVulnerable}</span>`;
    if (game.markedBoss) s += '<span class="buff-icon buff-mark">🎯 marked</span>';
    statusEl.innerHTML = s;
  }

  document.getElementById('combatRound').textContent = game.combatRound;
  const actor = aliveParty[game.combatTurn];
  document.getElementById('currentActor').textContent = actor ? actor.name : '---';

  const partyGrid = document.getElementById('combatParty');
  partyGrid.innerHTML = party.map((m, i) => {
    const hp = game.partyHp[m.id] != null ? game.partyHp[m.id] : m.hp;
    const mp = game.partyMp[m.id] != null ? game.partyMp[m.id] : m.mp;
    const maxHp = effectiveMaxHp(m);
    const maxMp = effectiveMaxMp(m);
    const isActive = aliveParty[game.combatTurn] === m;
    const isFallen = hp <= 0;
    const hpPct2 = Math.max(0, hp / maxHp * 100);
    const mpPct = Math.max(0, mp / maxMp * 100);
    let buffs = '';
    if (game.defending[m.id]) buffs += '<span class="buff-icon buff-shield">🛡️</span>';
    return `<div class="combat-party-card ${isActive ? 'active' : ''}${isFallen ? ' fallen' : ''}">
      ${portraitMarkup(m, "combat")}
      <div class="name">${m.name}</div>
      <div style="font-size:0.7rem;opacity:0.7;">${m.combatRole || m.role}</div>
      <div class="party-hp-bar"><div class="party-hp-fill" style="width:${hpPct2}%;background:${hpPct2 > 50 ? 'var(--success)' : hpPct2 > 25 ? '#f39c12' : 'var(--danger)'};"></div></div>
      <div class="hp-text" style="font-size:0.7rem;">${hp}/${maxHp} HP</div>
      ${m.mp > 0 ? `<div class="party-mp-bar"><div class="party-mp-fill" style="width:${mpPct}%;"></div></div>` : ''}
      <div>${buffs}</div>
      </div>`;
  }).join('');

  const actionsDiv = document.getElementById('combatActions');
  // BUG FIX: this used to unconditionally overwrite combatActions with
  // the normal Attack/Spell/Skill/Defend/Item/Flee row, with no check
  // for whether a post-battle state (Continue/Retreat for the Uncharted
  // Reach, Back to Training Room, Return to Port, etc.) was supposed to
  // be showing instead. handleVictory calls renderPendingPostBattle()
  // to set the correct buttons, then calls renderCombat() right after —
  // which immediately wiped them out again, leaving the player with
  // either the wrong buttons or none at all. Reapplying the pending
  // state here instead of the normal row fixes that without needing to
  // touch handleVictory's own call order.
  if (game.combatResolved && game.pendingPostBattle) {
    renderPendingPostBattle();
  } else if (!actor) {
    actionsDiv.innerHTML = '<span style="color:var(--sand);">Waiting for next able crew member...</span>';
  } else {
    actionsDiv.innerHTML =
      '<button class="btn btn-combat" onclick="combatAction(\'ATTACK\')">⚔️ Attack</button>' +
      '<button class="btn btn-magic" onclick="toggleSpellMenu()">✨ Spell</button>' +
      '<button class="btn" onclick="handleSkillButton()">🎯 Skill</button>' +
      '<button class="btn" onclick="combatAction(\'DEFEND\')">🛡️ Defend</button>' +
      '<button class="btn btn-success" onclick="toggleItemMenu()">🧪 Item</button>' +
      '<button class="btn btn-danger" onclick="fleeCombat()">🏃 Flee</button>';
  }

  const spellMenu = document.getElementById('spellMenu');
  if (game.spellMenuOpen && actor) {
    spellMenu.style.display = 'block';
    const kit = kitFor(actor.id);
    const spells = kitSpellList(kit).filter(s => (s.levelReq || 1) <= level() && (game.partyMp[actor.id] || 0) >= s.mp);
    document.getElementById('spellGrid').innerHTML = spells.map((s, i) =>
      `<button class="spell-btn" onclick="castSpell(${i})">
      <div class="spell-name">${s.icon} ${s.name}</div>
      <div class="spell-cost">${s.mp} MP — ${s.desc}</div>
      </button>`
    ).join('') || '<p style="opacity:0.6;font-size:0.85rem;">No spells available.</p>';
  } else {
    spellMenu.style.display = 'none';
  }

  const skillMenu = document.getElementById('skillMenu');
  if (game.skillMenuOpen && actor) {
    skillMenu.style.display = 'block';
    const kit = kitFor(actor.id);
    const options = [];
    if (kit.skill) options.push({fn: "combatAction('SKILL')", icon: kit.skill.icon, name: kit.skill.name, desc: 'Default skill'});
    if (aegisAvailable(actor)) options.push({fn: 'useFirstMatesAegis()', icon: '🛡️✨', name: "First Mate's Aegis", desc: 'Arm the mark to shield San from the next hit she takes — once per day.'});
    if (highSkillAvailable(actor)) options.push({fn: "combatAction('HIGHSKILL')", icon: kit.highSkill.icon, name: kit.highSkill.name, desc: kit.highSkill.desc || ('Requires Level ' + (kit.highSkill.levelReq||1) + '.')});
    document.getElementById('skillGrid').innerHTML = options.map(o =>
      `<button class="spell-btn" onclick="${o.fn}">
      <div class="spell-name">${o.icon} ${o.name}</div>
      <div class="spell-cost">${o.desc}</div>
      </button>`
    ).join('') || '<p style="opacity:0.6;font-size:0.85rem;">No skills available.</p>';
  } else {
    skillMenu.style.display = 'none';
  }

  const itemMenu = document.getElementById('itemMenu');
  if (game.itemMenuOpen) {
    itemMenu.style.display = 'block';
    const items = Object.keys(game.consumables || {}).filter(id => game.consumables[id] > 0);
    document.getElementById('itemGrid').innerHTML = items.map(id => {
      const item = POTION_CATALOG.find(p => p.id === id);
      return `<button class="btn btn-small" onclick="useItem('${id}')">${item.icon} ${item.name} (${game.consumables[id]})</button>`;
    }).join('') || '<span style="opacity:0.6;">No items.</span>';
  } else {
    itemMenu.style.display = 'none';
  }

  const logDiv = document.getElementById('combatLog');
  logDiv.innerHTML = game.combatLog.slice(-30).map(entry => '<div class="entry">' + entry + '</div>').join('');
  logDiv.scrollTop = logDiv.scrollHeight;
  document.getElementById('autoBattleBtn').textContent = '🤖 Auto: ' + (game.autoBattle ? 'ON' : 'OFF');
  document.getElementById('autoBattleBtn').style.display = '';
  document.getElementById('fleeBtn').style.display = 'none';

  // San falling no longer force-ends the battle as an automatic flee/loss —
  // she's now treated the same as any other party member: if she's at 0 HP,
  // she's incapacitated but the fight continues with whoever's still
  // standing, and Eliz's Resurrect (now prioritizing San, see castSpell/
  // SKILL revive handling above) can bring her back mid-fight. Combat only
  // ends in defeat if the whole active party — San included — is down.
  const allFallen = party.every(m => partyHpOf(m) <= 0);
  if (game.inCombat && allFallen) { handleDefeat(); return; }
  if (game.inCombat && game.combatEnemyHp <= 0) { handleVictory(); return; }

  if (game.inCombat && game.autoBattle && actor && !game.spellMenuOpen && !game.itemMenuOpen && !game.skillMenuOpen) {
    const session = game.combatSessionId;
    if (game.combatActionTimer) clearTimeout(game.combatActionTimer);
    game.combatActionTimer = setTimeout(() => {
      game.combatActionTimer = null;
      if (!game.inCombat || game.combatResolved || game.combatSessionId !== session) return;
      if (partyHpOf(actor) <= 0) { renderCombat(); return; }
      autoBattleAction(actor);
    }, 700);
  }
}
function logCombat(line) { game.combatLog.push(line); if (game.combatLog.length > 150) game.combatLog.shift(); }

function rollCrit(actorId) {
  let chance = CRIT_BASE;
  if (actorId === 'senedra') chance += (affinityFor('senedra').fx.critPct || 0);
  if (typeof window.getReputationBonus === 'function') chance += window.getReputationBonus('critBonus');
  return Math.random() < chance;
}
function applyStatus(spell) {
  if (!spell.status) return;
  if (Math.random() < spell.status.chance) {
    game.enemyStatus = {type: spell.status.type, dmg: spell.status.dmg || 0, turns: spell.status.turns || 1};
    logCombat(`<span style="color:#9b59b6">The ${spell.status.type} takes hold.</span>`);
  }
}
function tickEnemyStatus() {
  if (!game.enemyStatus) return;
  if (game.enemyStatus.type === 'burn' || game.enemyStatus.type === 'poison') {
    const dmg = game.enemyStatus.dmg;
    game.combatEnemyHp = Math.max(0, game.combatEnemyHp - dmg);
    logCombat(`${game.enemyStatus.type === 'burn' ? '🔥' : '🧪'} The lingering ${game.enemyStatus.type} deals <span class="damage">${dmg}</span>.`);
  }
  game.enemyStatus.turns--;
  if (game.enemyStatus.turns <= 0) game.enemyStatus = null;
}

function combatAction(action) {
  if (!game.inCombat || game.combatResolved || game.combatEnemyHp <= 0) return;
  const party = getCrimsonCombatParty();
  const alive = party.filter(m => partyHpOf(m) > 0);
  const actor = alive[game.combatTurn];
  if (!actor || partyHpOf(actor) <= 0) { renderCombat(); return; }

  const kit = kitFor(actor.id);

  switch(action) {
    case 'ATTACK': {
      const gb = gearBonuses(actor.id);
      let dmg = Math.round((18 + rollDice('1d20') + gb.atk) * (1 + (game.ship.cannons * 0.12)));
      if (game.hasteTurns > 0) dmg = Math.round(dmg * (1 + game.hastePct / 100));
      if (game.enemyVulnerable > 0) dmg = Math.round(dmg * (1 + game.enemyVulnerablePct));
      if (game.nervousCourageActive && (actor.id === 'zaki' || actor.id === 'san')) dmg += 6;
      const t = trinketBonus(actor.id);
      if (t && t.dmgPct) dmg = Math.round(dmg * (1 + t.dmgPct));
      let isCrit = rollCrit(actor.id);
      if (game.markedBoss && actor.id === 'san') { isCrit = true; game.markedBoss = false; }
      if (isCrit) dmg = Math.round(dmg * 1.5);

      game.combatEnemyHp = Math.max(0, game.combatEnemyHp - dmg);
      logCombat((isCrit ? '<b>CRIT!</b> ' : '') + esc(actor.name) + ' attacks for <span class="damage">' + dmg + '</span> damage!');
      if (isCrit) triggerGrowthAbility(actor);
      break;
    }
    case 'SKILL':
    case 'HIGHSKILL': {
      // HIGHSKILL added so kit.highSkill (previously defined for Eliz's
      // Cure Disease but never reachable by any UI path — same class of
      // gap as First Mate's Aegis before it got fixed) now actually
      // fires, reusing every effect branch below rather than duplicating
      // them for a second skill slot.
      const skill = (action === 'HIGHSKILL') ? kit.highSkill : kit.skill;
      if (!skill) { toast('No skill available!'); return; }
      if (skill.effect === 'taunt') {
        logCombat(esc(actor.name) + ' uses ' + skill.icon + ' ' + skill.name + '! The enemy focuses on them.');
        // Bonded by the Tide (Ch.4): when Joel uses Shield Wall with the
        // bond active, San catches a brief haste windfall off the surge —
        // now scaled by the current San/Joel bond tier instead of a fixed
        // 2 turns/10%.
        if (actor.id === 'joel' && typeof window.bondedTideActive === 'function' && window.bondedTideActive()) {
          const bondVals = (typeof window.sanJoelBondValues === 'function') ? window.sanJoelBondValues() : {hasteTurns:2, hastePct:10};
          game.hasteTurns = Math.max(game.hasteTurns || 0, bondVals.hasteTurns);
          game.hastePct = Math.max(game.hastePct || 0, bondVals.hastePct);
          // Small recovery bonus (the art's own "possible small recovery/
          // resistance bonus" line) — a modest HP tick for both of them,
          // piggybacking on the existing heal path rather than a new system.
          const sanM = party.find(m => m.id === 'san');
          const joelM = party.find(m => m.id === 'joel');
          [sanM, joelM].forEach(m => {
            if (!m) return;
            const cur = partyHpOf(m);
            const max = effectiveMaxHp(m);
            game.partyHp[m.id] = Math.min(max, cur + Math.round(max * 0.06));
          });
          logCombat('🌊 The bond surges — San feels the Tide quicken her strikes, and they both catch their breath.');
        }
      } else if (skill.effect === 'mark') {
        game.markedBoss = true;
        logCombat(esc(actor.name) + ' uses ' + skill.icon + ' ' + skill.name + "! San's next strike will land true.");
      } else if (skill.effect === 'stun') {
        const mp = game.partyMp[actor.id] || 0;
        if (mp < skill.mp) { toast('Not enough MP!'); return; }
        game.partyMp[actor.id] = mp - skill.mp;
        game.timeStopTurns = 1;
        logCombat(esc(actor.name) + ' uses ' + skill.icon + ' ' + skill.name + '! The enemy is stunned!');
      } else if (skill.effect === 'revive') {
        const mp = game.partyMp[actor.id] || 0;
        if (mp < skill.mp) { toast('Not enough MP!'); return; }
        // Priority to San if she's among the fallen, matching the same
        // "Eliz looks after San first" relationship as her heal spell.
        const sanFallen = party.find(m => m.id === 'san' && partyHpOf(m) <= 0);
        const fallen = sanFallen || party.find(m => partyHpOf(m) <= 0);
        if (!fallen) { toast('No one has fallen.'); return; }
        game.partyMp[actor.id] = mp - skill.mp;
        game.partyHp[fallen.id] = Math.round(effectiveMaxHp(fallen) * 0.5);
        logCombat(esc(actor.name) + ' uses ' + skill.icon + ' ' + skill.name + '! ' + esc(fallen.name) + ' returns to the fight.');
      } else if (skill.effect === 'cleanse') {
        // Was never checking/deducting MP at all — harmless for Sister
        // Wren's free Purify (mp:0) which is why it went unnoticed, but
        // would've let Eliz's Cure Disease (mp:20) cast for free the
        // moment it became reachable via HIGHSKILL above.
        const mpCost = skill.mp || 0;
        const curMp = game.partyMp[actor.id] || 0;
        if (mpCost > 0) {
          if (curMp < mpCost) { toast('Not enough MP!'); return; }
          game.partyMp[actor.id] = curMp - mpCost;
        }
        logCombat(esc(actor.name) + ' uses ' + skill.icon + ' ' + skill.name + '! The crew feels lighter.');
      } else if (skill.effect === 'exposeTrio') {
        // Erynn's free skill. Renn (Experimentation), Erynn (Inherited
        // Knowledge), and Mimi (Divination) are written as three different
        // ways of knowing the same thing — when all three are actually in
        // the fight together, the debuff should visibly reflect that,
        // not just be flavor text. Base case still works fine solo.
        const trio = party.some(m => m.id === 'renn') && party.some(m => m.id === 'mimi');
        game.enemyVulnerable = trio ? 4 : 2;
        game.enemyVulnerablePct = trio ? 0.30 : 0.15;
        logCombat(trio
          ? esc(actor.name) + " uses " + skill.icon + ' ' + skill.name + "! Renn's experiments, Mimi's sight, and Erynn's records all line up at once — the enemy has nowhere left to hide."
          : esc(actor.name) + ' uses ' + skill.icon + ' ' + skill.name + '! An old weakness, right where the records said it would be.');
      } else if (skill.effect === 'hex') {
        const mpCost = skill.mp || 0;
        const curMp = game.partyMp[actor.id] || 0;
        if (curMp < mpCost) { toast('Not enough MP!'); return; }
        game.partyMp[actor.id] = curMp - mpCost;
        const gb = gearBonuses(actor.id);
        const misfire = Math.random() < 0.2;
        if (!misfire) {
          let hexDmg = Math.round((30 + rollDice('2d10') + gb.magic) * (1 + (game.ship.cannons * 0.1)));
          if (game.hasteTurns > 0) hexDmg = Math.round(hexDmg * (1 + game.hastePct / 100));
          if (game.enemyVulnerable > 0) hexDmg = Math.round(hexDmg * (1 + game.enemyVulnerablePct));
          game.combatEnemyHp = Math.max(0, game.combatEnemyHp - hexDmg);
          game.hasteTurns = Math.max(game.hasteTurns || 0, 2);
          game.hastePct = Math.max(game.hastePct || 0, 12);
          logCombat(esc(actor.name) + ' unleashes ' + skill.icon + ' ' + skill.name + ' for <span class="damage">' + hexDmg + '</span> damage — the whole crew feels the surge!');
        } else {
          let hexDmg = Math.round((14 + rollDice('1d10') + gb.magic) * 0.5);
          game.combatEnemyHp = Math.max(0, game.combatEnemyHp - hexDmg);
          const party = getCrimsonCombatParty();
          const targets = party.filter(m => partyHpOf(m) > 0 && m.id !== actor.id);
          if (targets.length) {
            const victim = targets[Math.floor(Math.random() * targets.length)];
            const ff = Math.round(10 + rollDice('1d10'));
            game.partyHp[victim.id] = Math.max(1, partyHpOf(victim) - ff);
            logCombat('💥 ' + esc(actor.name) + "'s " + skill.icon + ' ' + skill.name + ' misfires! It clips ' + esc(victim.name) + ' for <span class="damage">' + ff + '</span> — "Still calibrating!"');
          } else {
            logCombat('💥 ' + esc(actor.name) + "'s " + skill.icon + ' ' + skill.name + ' misfires, but the crew\'s clear.');
          }
        }
      } else if (skill.mult) {
        const gb = gearBonuses(actor.id);
        let sdmg = Math.round((18 + rollDice('1d20') + gb.atk + gb.magic) * skill.mult * (1 + (game.ship.cannons * 0.12)));
        if (game.hasteTurns > 0) sdmg = Math.round(sdmg * (1 + game.hastePct / 100));
        if (game.enemyVulnerable > 0) sdmg = Math.round(sdmg * (1 + game.enemyVulnerablePct));
        game.combatEnemyHp = Math.max(0, game.combatEnemyHp - sdmg);
        logCombat(esc(actor.name) + ' uses ' + skill.icon + ' ' + skill.name + ' for <span class="damage">' + sdmg + '</span> damage!');
      } else {
        logCombat(esc(actor.name) + ' uses ' + skill.icon + ' ' + skill.name + '!');
      }
      break;
    }
    case 'DEFEND':
      game.defending[actor.id] = true;
      logCombat(esc(actor.name) + ' braces for impact! Damage reduced next hit.');
      break;
  }

  game.spellMenuOpen = false;
  game.itemMenuOpen = false;
  game.skillMenuOpen = false;
  endTurn();
}

// First Mate's Aegis (Arc V, Ch.5) — a real activated skill, per the art's
// own "(Active Skill)" callout. Joel spends his turn to arm the mark; it
// then blocks the next hit landing on San (see enemyCounterAttack), for as
// long as that stays true within the same in-game day. Once-per-day is
// enforced at arm-time via game.aegisUsedDay, not at trigger-time, since
// the mark can sit armed for a while before it's actually needed.
function aegisAvailable(actor){
  if (!actor || actor.id !== 'joel') return false;
  if (!(game.comicProgress5 && game.comicProgress5[5])) return false;
  if (game.aegisUsedDay === game.day) return false;
  return true;
}
window.useFirstMatesAegis = function(){
  if (!game.inCombat || game.combatResolved || game.combatEnemyHp <= 0) return;
  const party = getCrimsonCombatParty();
  const alive = party.filter(m => partyHpOf(m) > 0);
  const actor = alive[game.combatTurn];
  if (!aegisAvailable(actor)) { toast('🔒 Not available right now.'); return; }
  game.aegisArmed = true;
  game.aegisUsedDay = game.day;
  logCombat('🛡️✨ ' + esc(actor.name) + ' channels the mark — <b>First Mate\'s Aegis</b> stands ready to shield San.');
  game.skillMenuOpen = false;
  game.spellMenuOpen = false;
  game.itemMenuOpen = false;
  endTurn();
};
// The main action row's Skill button is a single hardcoded button shared
// by every character (see renderCombat's actionsDiv template) — that's
// the exact spot the Aegis button silently vanished from last session,
// because the template never re-renders per-actor options. Rather than
// bolt another conditional button onto that fixed row again, this keeps
// the row itself completely unchanged and instead makes the one Skill
// button smart: fires the single default skill directly for anyone with
// only one; opens a small choice menu for anyone with a genuine second
// option (Joel's Aegis window, or a highSkill like Eliz's Cure Disease
// once its levelReq is met) — same dynamic-menu pattern the Spell button
// already uses safely.
function highSkillAvailable(actor){
  if (!actor) return false;
  const kit = kitFor(actor.id);
  if (!kit.highSkill) return false;
  return level() >= (kit.highSkill.levelReq || 1);
}
window.handleSkillButton = function(){
  const party = getCrimsonCombatParty();
  const alive = party.filter(m => partyHpOf(m) > 0);
  const actor = alive[game.combatTurn];
  if (!actor) return;
  const aegisOffered = aegisAvailable(actor) && !game.aegisArmed;
  const highSkillOffered = highSkillAvailable(actor);
  if (aegisOffered || highSkillOffered) {
    game.skillMenuOpen = !game.skillMenuOpen;
    game.spellMenuOpen = false;
    game.itemMenuOpen = false;
    renderCombat();
    return;
  }
  combatAction('SKILL');
};

function castSpell(spellIndex) {
  if (!game.inCombat || game.combatResolved || game.combatEnemyHp <= 0) return;
  const party = getCrimsonCombatParty();
  const alive = party.filter(m => partyHpOf(m) > 0);
  const actor = alive[game.combatTurn];
  if (!actor) return;
  const kit = kitFor(actor.id);
  const spells = kitSpellList(kit).filter(s => (s.levelReq || 1) <= level());
  const spell = spells[spellIndex];
  if (!spell) return;

  const mp = game.partyMp[actor.id] || 0;
  if (mp < spell.mp) { toast('Not enough MP!'); return; }
  game.partyMp[actor.id] = mp - spell.mp;

  if (spell.buffType === 'defense') {
    game.shieldTurns = spell.buffTurns || 3;
    game.shieldPct = spell.buffVal / 100;
    logCombat(esc(actor.name) + ' casts ' + spell.icon + ' ' + spell.name + '! Shield active for ' + game.shieldTurns + ' turns.');
  } else if (spell.buffType === 'haste') {
    game.hasteTurns = spell.buffTurns || 3;
    game.hastePct = spell.buffVal;
    logCombat(esc(actor.name) + ' casts ' + spell.icon + ' ' + spell.name + '! Haste active for ' + game.hasteTurns + ' turns.');
  } else if (spell.buffType === 'expose') {
    // Erynn's kit: a documented weakness, not a raw damage nuke — the enemy
    // takes more from EVERY subsequent hit (basic attacks included, not
    // just spells) for buffTurns turns. Genuinely new state (enemyVulnerable/
    // enemyVulnerablePct), not a reskin of shieldTurns/hasteTurns, since
    // those buff the party rather than weakening the enemy.
    game.enemyVulnerable = spell.buffTurns || 3;
    game.enemyVulnerablePct = spell.buffVal / 100;
    logCombat(esc(actor.name) + ' casts ' + spell.icon + ' ' + spell.name + '! The enemy is exposed for ' + game.enemyVulnerable + ' turns.');
  } else if (spell.healMult) {
    // Eliz is San's dedicated healer — the story treats this as a specific
    // relationship, not generic "whoever's lowest %". If San's not at full
    // HP, Eliz heals San even when someone else is technically lower;
    // otherwise (and for every other healer — Wren, Soel) fall back to the
    // original lowest-HP% targeting. Also fixed a real scaling bug here:
    // this used to divide by the character's raw unscaled base HP instead
    // of their real current max (effectiveMaxHp), so the "lowest %" pick
    // was wrong for anyone whose max had grown from gear or level.
    const sanMember = party.find(m => m.id === 'san');
    const sanNotFull = sanMember && partyHpOf(sanMember) < effectiveMaxHp(sanMember);
    const healTarget = (actor.id === 'eliz' && sanNotFull) ? sanMember : party.reduce((a, b) => {
      const aPct = partyHpOf(a) / effectiveMaxHp(a);
      const bPct = partyHpOf(b) / effectiveMaxHp(b);
      return aPct < bPct ? a : b;
    });
    const healAmt = Math.round(25 * spell.healMult * (1 + (game.ship.hull * 0.1)));
    const curHp = partyHpOf(healTarget);
    game.partyHp[healTarget.id] = Math.min(effectiveMaxHp(healTarget), curHp + healAmt);
    logCombat(esc(actor.name) + ' casts ' + spell.icon + ' ' + spell.name + '! ' + esc(healTarget.name) + ' recovers <span class="heal">' + healAmt + '</span> HP.');
  } else if (spell.effect === 'restoreMp' || spell.effect === 'shareMp') {
    const target = spell.effect === 'restoreMp' ? (party.find(m => m.id === 'san') || actor) : (party.find(m => m.mp > 0 && (game.partyMp[m.id] || m.mp) < m.mp) || actor);
    const curMp = game.partyMp[target.id] || target.mp;
    game.partyMp[target.id] = Math.min(effectiveMaxMp(target), curMp + spell.restoreAmt);
    logCombat(esc(actor.name) + ' casts ' + spell.icon + ' ' + spell.name + '! ' + esc(target.name) + ' restores <span class="heal">' + spell.restoreAmt + '</span> MP.');
  } else if (spell.dice) {
    const gb = gearBonuses(actor.id);
    let sdmg = Math.round((rollDice(spell.dice) * 3 + gb.magic) * (1 + (game.ship.cannons * 0.1)));
    const tb = trinketBonus(actor.id);
    if (tb && tb.spellPct) sdmg = Math.round(sdmg * (1 + tb.spellPct));
    if (game.hasteTurns > 0) sdmg = Math.round(sdmg * (1 + game.hastePct / 100));
    if (game.enemyVulnerable > 0) sdmg = Math.round(sdmg * (1 + game.enemyVulnerablePct));
    game.combatEnemyHp = Math.max(0, game.combatEnemyHp - sdmg);
    logCombat(esc(actor.name) + ' casts ' + spell.icon + ' <span class="spell">' + spell.name + '</span> for <span class="damage">' + sdmg + '</span> damage!');
    applyStatus(spell);
  }

  game.spellMenuOpen = false;
  game.skillMenuOpen = false;
  endTurn();
}

function toggleSpellMenu() { game.spellMenuOpen = !game.spellMenuOpen; game.itemMenuOpen = false; game.skillMenuOpen = false; renderCombat(); }
function toggleItemMenu() { game.itemMenuOpen = !game.itemMenuOpen; game.spellMenuOpen = false; game.skillMenuOpen = false; renderCombat(); }

function useItem(itemId) {
  if (!game.inCombat || game.combatResolved || game.combatEnemyHp <= 0) return;
  const item = POTION_CATALOG.find(p => p.id === itemId);
  if (!item || !game.consumables[itemId]) return;
  const party = getCrimsonCombatParty();
  const alive = party.filter(m => partyHpOf(m) > 0);
  const actor = alive[game.combatTurn];
  if (!actor) return;

  game.consumables[itemId]--;
  if (item.effect === 'heal') {
    const curHp = partyHpOf(actor);
    game.partyHp[actor.id] = Math.min(effectiveMaxHp(actor), curHp + item.value);
    logCombat(esc(actor.name) + ' uses ' + item.icon + ' ' + item.name + ', recovering <span class="heal">' + item.value + '</span> HP.');
  } else if (item.effect === 'mana') {
    const curMp = game.partyMp[actor.id] || actor.mp;
    game.partyMp[actor.id] = Math.min(effectiveMaxMp(actor), curMp + item.value);
    logCombat(esc(actor.name) + ' uses ' + item.icon + ' ' + item.name + ', restoring <span class="heal">' + item.value + '</span> MP.');
  } else if (item.effect === 'repair') {
    game.health = Math.min(game.maxHealth, game.health + item.value);
    logCombat(esc(actor.name) + ' uses ' + item.icon + ' ' + item.name + ', repairing <span class="heal">' + item.value + '</span>% hull.');
  } else if (item.effect === 'damage') {
    game.combatEnemyHp = Math.max(0, game.combatEnemyHp - item.value);
    logCombat(esc(actor.name) + ' fires ' + item.icon + ' ' + item.name + ' for <span class="damage">' + item.value + '</span> damage!');
  }

  game.itemMenuOpen = false;
  game.skillMenuOpen = false;
  endTurn();
}

function endTurn() {
  if (!game.inCombat || game.combatResolved) return;
  const party = getCrimsonCombatParty();

  if (game.shieldTurns > 0) game.shieldTurns--;
  if (game.hasteTurns > 0) game.hasteTurns--;
  if (game.enemyVulnerable > 0) game.enemyVulnerable--;
  tickEnemyStatus();

  if (game.combatEnemyHp > 0) {
    if (game.timeStopTurns > 0) {
      game.timeStopTurns--;
      logCombat('⏳ Time holds still — the enemy cannot act.');
    } else {
      enemyCounterAttack();
    }
  }

  game.combatTurn++;
  const alive = party.filter(m => partyHpOf(m) > 0);
  if (game.combatTurn >= alive.length) { game.combatTurn = 0; game.combatRound++; }

  renderCombat();
}

function enemyCounterAttack() {
  const enemy = game.combatEnemy;
  const party = getCrimsonCombatParty().filter(m => (game.partyHp[m.id] != null ? game.partyHp[m.id] : m.hp) > 0);
  if (!party.length) return;

  const target = party[Math.floor(Math.random() * party.length)];
  const gb = gearBonuses(target.id);
  let dmg = enemy.dmg + Math.floor(Math.random() * 10);
  if (gb.defense) dmg = Math.max(1, Math.round(dmg * (1 - Math.min(0.35, gb.defense / 200))));
  if (game.nervousCourageActive && target.id === 'zaki') dmg = Math.max(1, dmg - 4);
  if (game.shieldTurns > 0) dmg = Math.round(dmg * (1 - (game.shieldPct || 0)));
  if (game.defending[target.id]) { dmg = Math.round(dmg * 0.5); delete game.defending[target.id]; }
  const tb = trinketBonus(target.id);
  if (tb && tb.defPct) dmg = Math.round(dmg * (1 - tb.defPct));

  // First Mate's Aegis (Arc V, Ch.5): a real activated skill now (see
  // useFirstMatesAegis()) rather than an automatic trigger — Joel spends
  // his turn to arm the mark, and it blocks the next hit that lands on
  // San, whenever that turn comes. game.aegisArmed is the live charge;
  // game.aegisUsedDay just prevents re-arming again the same in-game day
  // (checked at arm-time in useFirstMatesAegis, not needed again here).
  let aegisTriggered = false;
  if (target.id === 'san' && game.aegisArmed) {
    dmg = Math.max(1, Math.round(dmg * 0.15));
    game.aegisArmed = false;
    aegisTriggered = true;
  }
  // Bonded by the Tide (Ch.4): small defensive synergy for San/Joel while
  // both are fielded and alive — doesn't stack with an Aegis block above.
  // Scaled by the current San/Joel bond tier instead of a fixed 8%.
  if (!aegisTriggered && (target.id === 'san' || target.id === 'joel') && typeof window.bondedTideActive === 'function' && window.bondedTideActive()) {
    const bondVals = (typeof window.sanJoelBondValues === 'function') ? window.sanJoelBondValues() : {dmgReductionPct:8};
    dmg = Math.max(1, Math.round(dmg * (1 - bondVals.dmgReductionPct / 100)));
  }

  const curHp = game.partyHp[target.id] != null ? game.partyHp[target.id] : target.hp;
  let nextHp = Math.max(0, curHp - dmg);
  if (UNKILLABLE_IDS.has(target.id)) nextHp = Math.max(1, nextHp);
  game.partyHp[target.id] = nextHp;

  if (aegisTriggered) {
    logCombat('🛡️✨ The mark on Joel\'s chest flares — <b>First Mate\'s Aegis</b> shields San from the worst of it!');
  }
  logCombat(esc(enemy.name) + ' strikes ' + esc(target.name) + ' for <span class="damage">' + dmg + '</span> damage!' +
    (nextHp === 0 ? ' <span style="color:#e74c3c">' + esc(target.name) + ' has fallen!</span>' : ''));

  // San falling no longer immediately ends combat as a flee — see the
  // matching note above the allFallen check in renderCombat(). She's
  // incapacitated like anyone else; the fight (and hull damage below)
  // continues normally.
  const hullDmg = Math.round(dmg * 0.2);
  game.health = Math.max(0, game.health - hullDmg);

  checkNervousCourage(party);
}

function checkNervousCourage(party) {
  const ability = GROWTH_ABILITIES.zaki;
  if (level() < ability.levelReq || game.growthUsedThisBattle[ability.id]) return;
  const fallable = getCrimsonCombatParty().filter(m => !UNKILLABLE_IDS.has(m.id));
  const aliveIds = fallable.filter(m => partyHpOf(m) > 0).map(m => m.id);
  if (aliveIds.length === 2 && aliveIds.includes('san') && aliveIds.includes('zaki')) {
    game.growthUsedThisBattle[ability.id] = true;
    game.nervousCourageActive = true;
    if (!game.discoveredAbilities.includes(ability.id)) game.discoveredAbilities.push(ability.id);
    logCombat(`<span style="color:#e8c96a">✦ ${ability.name}!</span> It's just Zaki and San left standing — he doesn't check his pack this time. +6 ATK, +4 DEF.`);
  }
}
function triggerGrowthAbility(actor) {
  const lvl = level();
  if (actor.id === 'aisyah' && lvl >= GROWTH_ABILITIES.aisyah.levelReq) {
    const ability = GROWTH_ABILITIES.aisyah;
    if (!game.growthUsedThisBattle[ability.id] && Math.random() < 0.4) {
      game.growthUsedThisBattle[ability.id] = true;
      const bonus = 20 + level() * 2;
      game.gold += bonus;
      if (!game.discoveredAbilities.includes(ability.id)) game.discoveredAbilities.push(ability.id);
      logCombat(`<span style="color:#e8c96a">✦ ${ability.name}!</span> Aisyah's hand is already in the enemy's pocket — ${bonus}g skimmed.`);
    }
  }
  if (actor.id === 'senedra' && lvl >= GROWTH_ABILITIES.senedra.levelReq) {
    const ability = GROWTH_ABILITIES.senedra;
    if (!game.growthUsedThisBattle[ability.id]) {
      game.growthUsedThisBattle[ability.id] = true;
      game.markedBoss = true;
      if (!game.discoveredAbilities.includes(ability.id)) game.discoveredAbilities.push(ability.id);
      logCombat(`<span style="color:#e8c96a">✦ ${ability.name}!</span> Senedra's shot marks the target — San's next strike is guaranteed true.`);
    }
  }
}

function handleSanFlee() {
  if (game.combatResolved) return;
  game.combatResolved = true;
  game.inCombat = false;
  if (game.combatActionTimer) { clearTimeout(game.combatActionTimer); game.combatActionTimer = null; }
  game.spellMenuOpen = false;
  game.itemMenuOpen = false;
  game.skillMenuOpen = false;
  logCombat('🏃 <b>SAN FLEES!</b> She falls to 0 HP and is forced out of the battle. No victory rewards are granted.');
  showPostBattleAction('San fled. No victory rewards were granted.');
  document.getElementById('combatActions').innerHTML =
    '<button class="btn btn-danger" onclick="exitBattleToPort()">🏛️ Return to Port</button>';
  document.getElementById('autoBattleBtn').style.display = 'none';
  renderCombat();
}
function handleVictory() {
  if (game.combatResolved || !game.inCombat) return;
  game.combatResolved = true;
  const enemy = game.combatEnemy;
  game.inCombat = false;
  if (game.combatActionTimer) { clearTimeout(game.combatActionTimer); game.combatActionTimer = null; }
  gainXP(enemy.xp);
  // Reputation rank gold bonus (see ct-build-v91-reputation-ranks) —
  // scoped to combat victories only, matching Daybreak's own "+X% gold
  // from every victory" framing rather than a universal gold multiplier.
  const repGoldBonus = (typeof window.getReputationBonus === 'function') ? window.getReputationBonus('goldBonus') : 0;
  game.gold += repGoldBonus > 0 ? Math.round(enemy.gold * (1 + repGoldBonus)) : enemy.gold;
  game.reputation += 5;
  checkBountyProgress('kill', enemy.key, 1);
  checkQuestProgress('kill', enemy.key, 1);
  checkTempleQuestProgress('kill', enemy.key, 1);

  // Training bouts (see ct-build-v93-training-room) are practice, not
  // loot runs — no trophy, and gold is already forced to 0 at the source
  // (startTrainingBout), so this just skips the trophy push + adjusts
  // the victory line rather than showing a nonsensical "Joel's Trophy."
  let trophy = null;
  if (enemy.kind !== 'training') {
    const {icon, itemBase} = lootForBoss(enemy.name);
    trophy = {id: 'trophy_' + Date.now(), name: enemy.name + "'s " + itemBase, icon, desc: 'Taken from ' + enemy.name};
    game.inventory.push(trophy);
  }

  logCombat(enemy.kind === 'training'
    ? '🎉 <b>Good bout!</b> Earned ' + enemy.xp + ' XP.'
    : '🎉 <b>VICTORY!</b> Earned ' + enemy.xp + ' XP, ' + enemy.gold + 'g, and ' + trophy.icon + ' ' + trophy.name + '!');

  let extra = '';
  if (enemy.kind === 'guardian') {
    const port = PORTS.find(p => p.id === enemy.portId);
    game.clearedGuardians[enemy.key] = true;
    const member = ALL_PARTY.find(m => m.id === port.companion);
    if (member && !game.foundCompanions[port.companion]) {
      game.foundCompanions[port.companion] = true;
      game.partyHp[member.id] = member.hp; game.partyMp[member.id] = member.mp;
      logCombat(`<span style="color:#e8c96a">${member.name} joins the crew!</span>`);
      game.storyModalQueue.push(Object.assign({}, port, {companionName: member.name}));
      syncArc1StoryQuestProgress();
      if (port && port.id === 'malacca') {
        goalToast('recruited Joel', 'sail to Palembang when ready');
        toast('💰 Optional Goal: complete bounties for extra XP and gold.', 4800);
      }
      try { renderMainGoal(); } catch(e) {}
    } else if (member) {
      logCombat(`<span style="color:#e8c96a">Optional rematch cleared.</span> ${member.name} was already aboard.`);
    }
  } else if (enemy.kind === 'final') {
    game.finalCleared = true;
    game.partyHp['ser_aldric'] = ALL_PARTY.find(m=>m.id==='ser_aldric').hp; game.partyMp['ser_aldric'] = 0;
    game.partyHp['sister_wren'] = ALL_PARTY.find(m=>m.id==='sister_wren').hp; game.partyMp['sister_wren'] = 0;
    logCombat(`<span style="color:#e8c96a">Ser Aldric and Sister Wren join the crew!</span> The whole crew, found.`);
    syncArc1StoryQuestProgress();
    game.storyModalQueue.push(Object.assign({}, DROWNED_PASSAGE, {companionName: 'Ser Aldric & Sister Wren'}));
    if (ACT2_CHAPTERS[0]) game.storyModalQueue.push({title: 'Act II — Fair Winds, Full Hands', blurb: ACT2_CHAPTERS[0].unlockBlurb});
    if (ACT3_CHAPTERS[0]) game.storyModalQueue.push({title: 'Act III — Origins', blurb: "San hasn't recalled much of anything from before the wreck — just fragments, and the people she somehow already trusts completely. Maybe it's time to go looking for the rest of it."});
  } else if (enemy.kind === 'memory') {
    const ch = currentAct3Chapter();
    if (ch) {
      game.act3Index++;
      gainXP(ch.rw.xp);
      game.gold += ch.rw.gold;
      game.reputation += ch.rw.rep || 0;
      logCombat(`<span style="color:#e8c96a">A memory surfaces.</span> +${ch.rw.xp} XP, +${ch.rw.gold}g`);
      game.storyModalQueue.push({title: `Origins · Chapter ${ch.id} — ${ch.title}`, blurb: ch.victoryScene});
    }
  } else if (enemy.kind === 'arc9_ch12') {
    // See the ARC9_CH12_ENEMY / startArc9Ch12Battle comment above for why
    // this chapter is a fight instead of a mark-as-read.
    const ch12 = window.ARC9_CHAPTERS.find(c => c.id === 12);
    game.comicProgress9 = game.comicProgress9 || {};
    game.comicProgress9[12] = true;
    if (ch12) gainXP(ch12.xp);
    game.reputation = (game.reputation || 0) + 1;
    // The mechanical cost behind "he comes back weak and withdrawn": Soel's
    // own kit runs on 0 MP (unkillable spirit cat, free-cost abilities), so
    // draining MP would be a no-op. Dropping him to a sliver of HP instead
    // is a real, felt cost — and it recovers through the exact same systems
    // (tavern rest, a healer's spell, potions) any other weakened party
    // member already uses, no new mechanic needed.
    const soelMember = ALL_PARTY.find(m => m.id === 'soel');
    if (soelMember && game.partyHp) game.partyHp['soel'] = Math.max(1, Math.round(soelMember.hp * 0.08));
    logCombat('<span style="color:#e8c96a">Soel'+"'"+'s blessing held the line — but it cost him. He'+"'"+'s weak and withdrawn now.</span>');
    logEvent('📖 Arc 9 Chapter 12 complete: The Price of a Blessing · +'+(ch12 ? ch12.xp : 0)+' XP', 'gold');
    if (window.ARC9_CHAPTER_SCENES && window.ARC9_CHAPTER_SCENES[12]) {
      game.storyModalQueue.push({ title: ch12 ? ch12.title : 'The Price of a Blessing', blurb: window.ARC9_CHAPTER_SCENES[12] });
    }
    if (typeof renderMainGoal === 'function') try { renderMainGoal(); } catch(e) {}
    // BUG FIX: this branch was missing the renderStory() call every other
    // chapter-completion path has — without it, the V130 modal-flush fix
    // (which hooks renderStory specifically, since 26+ completion
    // functions already call it) wouldn't apply here, and this chapter's
    // scene could sit invisible in the queue until some unrelated later
    // fight happened to surface it — the exact bug V130 was built to fix.
    if (typeof renderStory === 'function') try { renderStory(); } catch(e) {}
  } else if (enemy.kind === 'uncharted' && typeof window.unchartedState === 'function') {
    // The Uncharted Reach (see ct-build-v92-uncharted-reach). Applies its
    // own permanent Championship bonus as a top-up grant on what gainXP/
    // game.gold already awarded above, rather than reaching back to
    // modify those lines — keeps this additive and low-risk.
    const uc = window.unchartedState();
    uc.totalKills++;
    uc.totalXp += enemy.xp;
    uc.totalGold += enemy.gold;
    const tierBonus = window.getUnchartedTierBonus();
    if (tierBonus > 0) {
      const bonusXp = Math.round(enemy.xp * tierBonus);
      const bonusGold = Math.round(enemy.gold * tierBonus);
      gainXP(bonusXp);
      game.gold += bonusGold;
      uc.totalXp += bonusXp;
      uc.totalGold += bonusGold;
      logCombat('🌊 Reach bonus: +' + bonusXp + ' XP, +' + bonusGold + 'g');
    }
    if (typeof window.checkUnchartedTierRewards === 'function') window.checkUnchartedTierRewards();
  }

  let postBattleMessage, postBattleButtonsHtml;
  if (enemy.kind === 'arc9_ch12') {
    postBattleMessage = 'Soel held the line. Arc IX Chapter 12 complete.';
    postBattleButtonsHtml = '<button class="btn btn-success" onclick="exitBattleToPort()">🏛️ Return to Port</button>';
  } else if (enemy.kind === 'uncharted') {
    postBattleMessage = 'Wave ' + (game.uncharted ? game.uncharted.wave : '') + ' cleared!';
    postBattleButtonsHtml =
      '<button class="btn btn-success" onclick="continueUnchartedReach()">🌊 Continue Into the Reach</button>' +
      '<button class="btn btn-danger" onclick="retreatUnchartedReach()">🏳️ Retreat (keep rewards)</button>';
  } else if (enemy.kind === 'expedition') {
    postBattleMessage = 'Wave ' + (game.expedition ? game.expedition.wave : '') + ' cleared!';
    postBattleButtonsHtml =
      '<button class="btn btn-success" onclick="continueResearchExpedition()">🔭 Continue the Expedition</button>' +
      '<button class="btn btn-danger" onclick="retreatResearchExpedition()">🏳️ Return to Fair Tide (keep findings)</button>';
  } else if (enemy.kind === 'training') {
    postBattleMessage = 'A good bout.';
    postBattleButtonsHtml = '<button class="btn btn-success" onclick="backToTrainingRoom()">⚔️ Back to the Training Room</button>';
  } else if (enemy.kind === 'memoryArchive') {
    postBattleMessage = enemy.name + ' fades. San remembers a little more clearly now.';
    postBattleButtonsHtml = '<button class="btn btn-success" onclick="exitBattleToPort()">🏛️ Return to Port</button>';
  } else if (enemy.kind === 'illusion') {
    postBattleMessage = 'The memory dissolves. Whatever ' + enemy.name + ' was, it isn\'t here anymore.';
    postBattleButtonsHtml = '<button class="btn btn-success" onclick="exitBattleToPort()">🏛️ Return to Port</button>';
  } else if (enemy.kind === 'interworld') {
    postBattleMessage = 'Whatever ' + enemy.name + ' was, it\'s staying on that side of the door. The crew holds their ground.';
    postBattleButtonsHtml =
      '<button class="btn btn-success" onclick="exitInterworldBattleToDestination()">🌌 Stay and Explore</button>' +
      '<button class="btn btn-danger" onclick="exitBattleToPort()">🏛️ Return to Port</button>';
  } else if (enemy.kind === 'harbour_explore') {
    postBattleMessage = enemy.name + ' is dealt with. The rest of the harbour is still out there.';
    postBattleButtonsHtml =
      '<button class="btn btn-success" onclick="exitHarbourBattleToDestination()">⚓ Continue Exploring</button>' +
      '<button class="btn btn-danger" onclick="exitBattleToPort()">🏛️ Return to Port</button>';
  } else if (enemy.kind === 'tidenetwork_explore') {
    postBattleMessage = enemy.name + ' is dealt with. The settlement is still out there.';
    postBattleButtonsHtml =
      '<button class="btn btn-success" onclick="exitTideNetworkBattleToDestination()">🌊 Continue Exploring</button>' +
      '<button class="btn btn-danger" onclick="exitBattleToPort()">🏛️ Return to Port</button>';
  } else if (enemy.kind === 'clansettlement_explore') {
    postBattleMessage = enemy.name + ' is dealt with. The settlement is still out there.';
    postBattleButtonsHtml =
      '<button class="btn btn-success" onclick="exitClanSettlementBattleToDestination()">🌕 Continue Exploring</button>' +
      '<button class="btn btn-danger" onclick="exitBattleToPort()">🏛️ Return to Port</button>';
  } else if (enemy.kind === 'harbour_voyage') {
    postBattleMessage = 'The crossing continues. ' + enemy.name + " won't be a problem for the rest of the way.";
    postBattleButtonsHtml = '<button class="btn btn-success" onclick="goScreen(\'harbour\')">⚓ Continue to the Harbour</button>';
  } else if (enemy.kind === 'tidenetwork_voyage') {
    postBattleMessage = 'The current settles. ' + enemy.name + ' is behind you now.';
    postBattleButtonsHtml = '<button class="btn btn-success" onclick="goScreen(\'tidenetwork\')">🌊 Continue to the Settlement</button>';
  } else if (enemy.kind === 'clansettlement_voyage') {
    postBattleMessage = 'The shore is quiet again. ' + enemy.name + " won't be following the rest of the way.";
    postBattleButtonsHtml = '<button class="btn btn-success" onclick="goScreen(\'clansettlement\')">🌕 Continue to the Settlement</button>';
  } else {
    postBattleMessage = 'Victory! Battle complete.';
    // "Challenge Again" (San's request): scoped strictly to this default
    // branch — regular port explore-tab monster/thief fights. Everything
    // else (uncharted, the three unknown-location _explore/_voyage kinds,
    // guardians, sea-voyage pirate encounters) has its own branch above
    // and never reaches here, so none of those pick this up. Re-uses
    // startHarborFight(enemy.key) with no returnKind, exactly matching
    // how the original fight was started — this also means the enemy is
    // freshly re-scaled to the player's current level via
    // scaledEnemyForExplore, not the same now-stale enemy object.
    postBattleButtonsHtml = '<button class="btn btn-success" onclick="exitBattleToPort()">🏛️ Return to Port</button> '+
      '<button class="btn btn-combat" onclick="startHarborFight(\''+enemy.key+'\')">⚔️ Challenge Again</button>';
  }
  // BUG FIX: this used to write the post-battle message/buttons straight
  // into the DOM and nowhere else. goScreen('combat') never calls
  // renderCombat() (it only toggles which screen div is visible), so it
  // relied entirely on that DOM content still existing. That's fine within
  // one continuous session, but the instant the page reloads — backgrounding
  // a mobile PWA for a while is enough — the DOM starts fresh and that
  // content is just gone. The player would see Fair Tide correctly report
  // "Currently out at Wave N," tap "Return to the fight," and land on a
  // blank/stale combat screen with no working Continue or Retreat button:
  // genuinely stuck, since combatAction() itself no-ops once
  // combatResolved is true. Persisting the exact same message/buttons here
  // and reconstructing them via renderPendingPostBattle() (called from
  // goScreen's 'combat' branch too) means "Return to the fight" works
  // correctly even after a full reload.
  game.pendingPostBattle = {message: postBattleMessage, buttonsHtml: postBattleButtonsHtml};
  renderPendingPostBattle();
  renderCombat();
  if (game.storyModalQueue.length) { const next = game.storyModalQueue.shift(); setTimeout(() => showStoryModal(next), 400); }
}
function handleDefeat() {
  if (game.combatResolved || !game.inCombat) return;
  game.combatResolved = true;
  game.inCombat = false;
  if (game.combatActionTimer) { clearTimeout(game.combatActionTimer); game.combatActionTimer = null; }
  const isTrainingBout = game.combatEnemy && game.combatEnemy.kind === 'training';
  if (isTrainingBout) {
    // A lost sparring bout is still just practice — no real gold or hull
    // cost, unlike an actual defeat at sea or in a port fight.
    logCombat('💀 <b>Joel gets the better of you this time.</b> Good bout, though.');
  } else {
    game.gold = Math.max(0, game.gold - 75);
    game.health = Math.max(1, game.health - 25);
    logCombat('💀 <b>DEFEAT!</b> Your crew retreats. Lost 75g and took hull damage.');
  }
  if (game.combatEnemy && game.combatEnemy.kind === 'uncharted' && game.uncharted) {
    // Streak ends here, but everything already banked this run stays
    // banked — matches the Reach's own retreat convention (see
    // ct-build-v92-uncharted-reach), just triggered by a loss instead.
    logEvent('🌊 The Uncharted Reach streak ends at wave ' + game.uncharted.wave + '. Kept: ' + game.uncharted.totalXp + ' XP, ' + game.uncharted.totalGold + 'g.', 'neutral');
    game.uncharted.active = false;
  }
  const defeatMessage = isTrainingBout ? 'A close bout — well fought.' : 'Defeat. The crew retreats.';
  const defeatButtonsHtml = isTrainingBout
    ? '<button class="btn btn-success" onclick="backToTrainingRoom()">⚔️ Back to the Training Room</button>'
    : '<button class="btn btn-danger" onclick="exitBattleToPort()">🏛️ Retreat to Port</button>';
  game.pendingPostBattle = {message: defeatMessage, buttonsHtml: defeatButtonsHtml};
  renderPendingPostBattle();
  renderCombat();
}
function fleeCombat() {
  if (!game.inCombat || game.combatResolved) return;
  if (game.combatEnemy.kind === 'guardian' || game.combatEnemy.kind === 'final' || game.combatEnemy.kind === 'memory' || game.combatEnemy.kind === 'uncharted') { toast(game.combatEnemy.kind === 'uncharted' ? "Retreat from the Reach after the fight instead — fleeing mid-fight isn't available here." : "Can't flee — this fight matters too much."); return; }
  if (Math.random() < 0.5) {
    game.inCombat = false;
    logEvent('🏃 Successfully fled from combat!', 'neutral');
    goScreen('port');
    ctPlayMusic('port');
  } else {
    logCombat('🏃 Failed to flee! The enemy attacks!');
    enemyCounterAttack();
    renderCombat();
  }
}
function toggleAutoBattle() { game.autoBattle = !game.autoBattle; renderCombat(); }
function autoBattleAction(actor) {
  if (!game.inCombat || game.combatResolved || !actor || partyHpOf(actor) <= 0) return;
  // First Mate's Aegis: auto-battle arms it the moment it's available,
  // same as a player would — checked first since it's a once-a-day
  // opportunity that's easy for an AI turn to otherwise skip entirely.
  if (typeof aegisAvailable === 'function' && aegisAvailable(actor) && !game.aegisArmed) {
    useFirstMatesAegis();
    return;
  }
  const kit = kitFor(actor.id);
  const mp = game.partyMp[actor.id] || 0;
  const combatParty = getCrimsonCombatParty();
  const spellList = kitSpellList(kit).filter(s => (s.levelReq || 1) <= level());

  // A revive skill is only ever worth attempting if someone's actually
  // down — combatAction('SKILL') toasts "No one has fallen" and returns
  // WITHOUT advancing the turn otherwise (see its 'revive' branch), which
  // would soft-lock auto-battle into retrying the same actor's turn
  // forever. UNKILLABLE_IDS (Soel etc.) can never actually be "fallen".
  if (kit.skill && kit.skill.effect === 'revive' && mp >= (kit.skill.mp || 0)) {
    const fallen = combatParty.find(m => partyHpOf(m) <= 0 && !UNKILLABLE_IDS.has(m.id));
    if (fallen) { combatAction('SKILL'); return; }
  }

  if (kit.role === 'healer') {
    const hurt = combatParty.some(m => { const h = partyHpOf(m); return h > 0 && h / effectiveMaxHp(m) < 0.4; });
    const healSpells = spellList.filter(s => s.healMult && mp >= s.mp);
    if (hurt && healSpells.length) {
      // Strongest affordable heal, same idea as picking the best damage
      // spell below rather than always defaulting to spellList[0].
      const best = healSpells.reduce((a, b) => (b.healMult > a.healMult ? b : a));
      castSpell(spellList.indexOf(best));
      return;
    }
  }

  if (kit.role === 'caster') {
    const dmgSpells = spellList.filter(s => s.dice && mp >= s.mp);
    if (dmgSpells.length && Math.random() < 0.7) {
      const chosen = dmgSpells[Math.floor(Math.random() * dmgSpells.length)];
      castSpell(spellList.indexOf(chosen));
      return;
    }
  }

  if (kit.role === 'support') {
    // Keep buffs topped up rather than burning MP recasting them every
    // single turn: only refresh one that's about to lapse or isn't up at
    // all. Encore (MP restore) only matters once San's actually running low.
    const shieldSpell = spellList.find(s => s.buffType === 'defense' && mp >= s.mp && (game.shieldTurns || 0) <= 1);
    const hasteSpell = spellList.find(s => s.buffType === 'haste' && mp >= s.mp && (game.hasteTurns || 0) <= 1);
    const mpRestoreSpell = spellList.find(s => s.effect === 'restoreMp' && mp >= s.mp);
    const sanMember = combatParty.find(m => m.id === 'san');
    const sanLowMp = sanMember && sanMember.mp > 0 && (game.partyMp.san || 0) / effectiveMaxMp(sanMember) < 0.3;
    const chosen = shieldSpell || hasteSpell || (sanLowMp ? mpRestoreSpell : null);
    if (chosen) { castSpell(spellList.indexOf(chosen)); return; }
  }

  // Free/paid utility or damage skills for everyone else — and as a
  // fallback for healer/caster/support when nothing above applied. Before
  // this, NOTHING outside the healer/caster spell branches above ever
  // called SKILL at all, so Iris's Ash's Pounce, KW Liang's Snowball's
  // Leap, Zaki's Power Strike, Aisyah's Coup de Grace, Ser Aldric's Holy
  // Strike, Senedra's Hunter's Mark, Soel's Lucky Pounce, Renn's and
  // Mimi's mark skills, and Brada's Showstopper never fired in auto-battle
  // no matter how long a fight ran — every one of them a free (mp:0) or
  // affordable upgrade over a plain Attack that just sat unused.
  if (kit.skill && kit.skill.effect !== 'taunt' && kit.skill.effect !== 'revive' && mp >= (kit.skill.mp || 0)) {
    if (Math.random() < 0.55) { combatAction('SKILL'); return; }
  }
  // Joel's Shield Wall (taunt) specifically: worth using proactively while
  // he's healthy, so it actually benefits auto-battle instead of sitting
  // manual-only.
  if (kit.skill && kit.skill.effect === 'taunt' && partyHpOf(actor) / effectiveMaxHp(actor) > 0.3 && Math.random() < 0.5) {
    combatAction('SKILL');
    return;
  }

  // Core party members (not hired/temporary crew) can also draw on
  // consumables during auto-battle — previously items only ever got used
  // via the manual item menu, so a full stock of potions and Cannon Shots
  // just sat unused the whole fight once auto-battle was toggled on.
  if (actor.temp !== true) {
    const ownPct = partyHpOf(actor) / effectiveMaxHp(actor);
    if (ownPct < 0.3) {
      const healId = (game.consumables?.greater_health > 0) ? 'greater_health'
        : (game.consumables?.health_potion > 0 ? 'health_potion' : null);
      if (healId) { useItem(healId); return; }
    }
    if (kit.role !== 'healer' && kit.role !== 'caster' && (game.consumables?.cannon_shot > 0) && Math.random() < 0.25) {
      useItem('cannon_shot'); return;
    }
  }
  combatAction('ATTACK');
}
function lootForBoss(bossName) {
  const n = (bossName || '').toLowerCase();
  for (const [keywords, icon, itemBase] of LOOT_THEMES) {
    if (keywords.some(k => n.includes(k))) return {icon, itemBase};
  }
  return {icon: '⚔️', itemBase: 'Trophy'};
}

// ---------------------------------------------------------------------------
// UI RENDERING
// ---------------------------------------------------------------------------

function xpToNextLevel(member) {
  const level = Number(member.level || 1);
  const xp = Number(member.xp || 0);
  // Use the game's existing next-level calculation when available.
  if (typeof xpForLevel === 'function') {
    const next = Number(xpForLevel(level + 1));
    return Math.max(0, next - xp);
  }
  const next = Number(member.nextLevelXp || (level * 100));
  return Math.max(0, next - xp);
}

function xpProgressText(member) {
  const level = Number(member.level || 1);
  const xp = Number(member.xp || 0);
  const remaining = xpToNextLevel(member);
  return `LV ${level} • ${xp} XP • ${remaining} XP to LV ${level + 1}`;
}

function updateUI() {
  try { renderMainGoal(); } catch(e) {}
  setTimeout(wireCrewPortraits,0);
  syncShipToCaptainLevel();
  document.getElementById('goldDisplay').textContent = game.gold;
  document.getElementById('healthDisplay').textContent = game.health;
  document.getElementById('cargoDisplay').textContent = game.cargoUsed + '/' + game.cargoCapacity;
  document.getElementById('dayDisplay').textContent = game.day;
  document.getElementById('levelDisplay').textContent = level();
  updateCrimsonXPDisplay();

  let repText = 'Unknown';
  if (game.reputation > 200) repText = 'Legendary';
  else if (game.reputation > 100) repText = 'Renowned';
  else if (game.reputation > 50) repText = 'Respected';
  else if (game.reputation < -20) repText = 'Suspicious';
  document.getElementById('reputationDisplay').textContent = repText;

  const currentPort = PORTS.find(p => p.id === game.location);
  document.getElementById('locationSubtitle').textContent = 'Port of ' + currentPort.name;
  document.getElementById('marketPortName').textContent = currentPort.name;
  document.getElementById('shipNameDisplay').textContent = game.shipName;

  renderPartyList();
  renderShipStats();
  document.getElementById('cargoUsed').textContent = game.cargoUsed;
  document.getElementById('cargoMax').textContent = game.cargoCapacity;
}

function portraitMarkup(member, mode='party') {
  const asset = member && member.portraitAsset;
  const fallback = (member && (member.portrait || member.icon)) || '⚓';
  const cls = mode === 'combat' ? 'combat-portrait-frame' : mode === 'strip' ? 'party-strip-portrait' : 'party-portrait-frame';
  const imgCls = mode === 'combat' ? 'combat-portrait-img' : mode === 'strip' ? '' : 'party-portrait-img';
  if (!asset) return `<div class="${cls}" aria-label="${esc(member.name || '')}">${fallback}</div>`;
  return `<div class="${cls}" aria-label="${esc(member.name || '')}">
    <img class="${imgCls}" src="${asset}" alt="${esc(member.name || '')}" onerror="this.style.display='none';this.parentElement.textContent='${fallback.replace(/'/g, "\\'")}'">
  </div>`;
}
function togglePartyListExpanded() {
  game.partyListExpanded = !game.partyListExpanded;
  renderPartyList();
}
function renderPartyList() {
  const container = document.getElementById('partyList');
  const party = getActiveParty();
  const toggleLabel = document.getElementById('partyListToggleLabel');
  const expanded = !!game.partyListExpanded;
  if (toggleLabel) toggleLabel.textContent = party.length + ' crew ' + (expanded ? '▲' : '▼');

  if (!expanded) {
    // Collapsed by default — was the whole reason this changed: with
    // 15+ crew, the old always-full-cards view meant scrolling past the
    // entire roster before reaching Market/Cargo/Explore below it. This
    // is a single-row horizontal strip; tapping the header (or any
    // portrait) expands back to the full detail view below, nothing
    // lost, just not shown by default.
    container.innerHTML = '<div class="party-strip">' + party.map(m => {
      const hp = game.partyHp[m.id] != null ? game.partyHp[m.id] : m.hp;
      const maxHp = effectiveMaxHp(m);
      const hpPct = Math.max(0, hp / maxHp * 100);
      const hpColor = hpPct > 50 ? 'var(--success)' : hpPct > 25 ? '#f39c12' : 'var(--danger)';
      return `<div class="party-strip-item ${hp<=0?'party-strip-fallen':''}" onclick="togglePartyListExpanded()">
        <div class="party-strip-portrait">${portraitMarkup(m,'strip')}<div class="party-strip-hp" style="width:${hpPct}%;background:${hpColor};"></div></div>
        <span class="party-strip-name">${esc(m.name)}</span>
      </div>`;
    }).join('') + '</div>';
    return;
  }

  container.innerHTML = party.map(m => {
    const hp = game.partyHp[m.id] != null ? game.partyHp[m.id] : m.hp;
    const maxHp = effectiveMaxHp(m);
    const mp = game.partyMp[m.id] != null ? game.partyMp[m.id] : m.mp;
    const maxMp = effectiveMaxMp(m);
    const hpPct = Math.max(0, hp / maxHp * 100);
    return `<div class="party-member">
      ${portraitMarkup(m, "party")}
      <div class="party-info">
      <div class="party-name">${m.name}</div>
      <div class="party-role">${m.role}</div>
      <div class="party-hp-bar"><div class="party-hp-fill" style="width:${hpPct}%;background:${hpPct > 50 ? 'var(--success)' : hpPct > 25 ? '#f39c12' : 'var(--danger)'};"></div></div>
      <div style="font-size:0.7rem;">${hp}/${maxHp} HP${m.mp > 0 ? ' | ' + mp + '/' + maxMp + ' MP' : ''}</div>
      </div></div>`;
  }).join('');
}
function renderShipStats() {
  const container = document.getElementById('shipStats');
  const stats = [
    {label: 'Hull Strength', value: game.ship.hull, max: shipStatCap(), color: '#e74c3c'},
    {label: 'Cannons', value: game.ship.cannons, max: shipStatCap(), color: '#f39c12'},
    {label: 'Sails', value: game.ship.sails, max: shipStatCap(), color: '#3498db'},
    {label: 'Cargo Holds', value: game.ship.cargo, max: shipStatCap(), color: '#27ae60'}
  ];
  container.innerHTML = stats.map(s =>
    `<div class="ship-stat-row"><span class="ship-stat-label">${s.label}</span>
    <div class="ship-stat-bar"><div class="ship-stat-fill" style="width:${s.value/s.max*100}%;background:${s.color};"></div></div>
    <span style="font-size:0.8rem;min-width:30px;text-align:right;">${s.value}/${s.max}</span></div>`
  ).join('');
}
function marketGoodInfo(goodId) {
  const good = GOODS[goodId];
  const price = Math.round(game.marketPrices[game.location][goodId] * haggleMultiplier());
  const inCargo = game.cargo[goodId] || 0;
  const avgCost = Number((game.cargoPurchaseCost || {})[goodId] || 0);
  const atLoss = inCargo > 0 && avgCost > 0 && price < avgCost;
  const trend = atLoss ? '🔻' : price > good.basePrice ? '📈' : price < good.basePrice ? '📉' : '➡️';
  const trendClass = atLoss ? 'event-bad' : price > good.basePrice ? 'event-bad' : price < good.basePrice ? 'event-good' : 'event-neutral';
  return { good, price, inCargo, avgCost, atLoss, trend, trendClass };
}
function selectMarketGood(goodId) {
  game.marketSelectedGood = goodId;
  renderMarket();
}
function renderMarket() {
  // The landing page can now enter Port directly, so market prices must
  // exist even when startGame() has not been called in this session.
  if (!game.marketPrices || !game.marketPrices[game.location]) {
    generateMarketPrices();
  }
  const strip = document.getElementById('marketStrip');
  const detail = document.getElementById('marketDetail');
  if (!strip || !detail) return;

  // Same 21 goods, same price/trend math as before — this only changed
  // how they're displayed. Was previously all 21 goods shown at once,
  // each with 8 buy/sell buttons already visible — a lot of scrolling
  // to get past. Now: a horizontal strip to pick a good, one detail
  // panel below showing that good's full buy/sell controls.
  const validGoodIds = Object.keys(GOODS).filter(goodId => {
    const price = Math.round(game.marketPrices[game.location][goodId] * haggleMultiplier());
    return price !== 0;
  });

  if (!game.marketSelectedGood || !validGoodIds.includes(game.marketSelectedGood)) {
    game.marketSelectedGood = validGoodIds[0];
  }
  const selected = game.marketSelectedGood;

  strip.innerHTML = validGoodIds.map(goodId => {
    const info = marketGoodInfo(goodId);
    return `<div class="market-strip-item ${goodId===selected?'selected':''}" onclick="selectMarketGood('${goodId}')">
      <div class="market-strip-icon">${info.good.icon}</div>
      <span class="market-strip-name">${esc(info.good.name)}</span>
      <span class="market-strip-price">${info.price}g</span>
    </div>`;
  }).join('');

  if (!selected) { detail.innerHTML = '<p style="opacity:.6;">No goods available here.</p>'; return; }
  const info = marketGoodInfo(selected);
  const priceStyle = info.atLoss ? 'color:var(--danger);' : '';
  detail.innerHTML = `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
    <div style="font-size:1.8rem;">${info.good.icon}</div>
    <div style="flex:1;">
      <div style="font-family:'Cinzel',serif;color:var(--gold);font-size:1rem;">${esc(info.good.name)}</div>
      <div style="${priceStyle}"><strong>${info.price}g</strong> <span class="${info.trendClass}">${info.trend}</span>${info.atLoss ? ` <span style="font-size:.7rem;color:var(--danger);">Loss · paid ${Math.round(info.avgCost)}g</span>` : ''}</div>
    </div>
    <div style="text-align:right;font-size:.75rem;opacity:.75;">Holding<br><strong style="font-size:.95rem;opacity:1;">${info.inCargo}</strong></div>
  </div>
  <div style="font-size:.75rem;opacity:.75;margin-bottom:2px;">BUY</div>
  <div class="market-detail-buybtns">
    <button class="btn btn-small btn-success" onclick="buyGood('${selected}',1);checkBountyProgress('trade',null,1)">+1</button>
    <button class="btn btn-small btn-success" onclick="buyGood('${selected}',5);checkBountyProgress('trade',null,1)">+5</button>
    <button class="btn btn-small btn-success" onclick="buyGood('${selected}',50);checkBountyProgress('trade',null,1)">+50</button>
    <button class="btn btn-small btn-success" onclick="buyGood('${selected}',100);checkBountyProgress('trade',null,1)">+100</button>
  </div>
  <div style="font-size:.75rem;opacity:.75;margin:8px 0 2px;">SELL</div>
  <div class="market-detail-sellbtns">
    <button class="btn btn-small" onclick="sellGood('${selected}',1);checkBountyProgress('trade',null,1)" ${info.inCargo<1?'disabled':''}>-1</button>
    <button class="btn btn-small" onclick="sellGood('${selected}',5);checkBountyProgress('trade',null,1)" ${info.inCargo<5?'disabled':''}>-5</button>
    <button class="btn btn-small" onclick="sellGood('${selected}',50);checkBountyProgress('trade',null,1)" ${info.inCargo<50?'disabled':''}>-50</button>
    <button class="btn btn-small" onclick="sellGood('${selected}',100);checkBountyProgress('trade',null,1)" ${info.inCargo<100?'disabled':''}>-100</button>
  </div>`;
}
function renderCargo() {
  if (!game.marketPrices || !game.marketPrices[game.location]) generateMarketPrices();
  const grid = document.getElementById('cargoGrid');
  const emptyMsg = document.getElementById('cargoEmpty');
  const goodsList = Object.keys(game.cargo).filter(g => game.cargo[g] > 0);
  if (goodsList.length === 0) { grid.innerHTML = ''; emptyMsg.style.display = 'block'; return; }
  emptyMsg.style.display = 'none';
  grid.innerHTML = goodsList.map(goodId => {
    const good = GOODS[goodId];
    const qty = game.cargo[goodId];
    const currentPrice = game.marketPrices[game.location][goodId] || 0;
    const avgCost = Number((game.cargoPurchaseCost || {})[goodId] || 0);
    const atLoss = currentPrice > 0 && avgCost > 0 && currentPrice < avgCost;
    const sellColor = atLoss ? 'var(--danger)' : currentPrice > 0 ? 'var(--success)' : '#888';
    const lossText = atLoss ? `<br><span style="color:var(--danger);font-size:.68rem;">Loss · paid ${Math.round(avgCost)}g/unit</span>` : '';
    return `<div class="cargo-item" style="${atLoss ? 'border-color:var(--danger);background:rgba(192,57,43,.10);' : ''}"><div class="cargo-icon">${good.icon}</div>
      <div class="cargo-name" style="${atLoss ? 'color:var(--danger);' : ''}">${good.name}</div>
      <div class="cargo-qty">Qty: ${qty}</div>
      <div style="font-size:0.75rem;color:${sellColor};margin-top:4px;">
      ${currentPrice > 0 ? 'Sell: ' + currentPrice + 'g' : 'No buyer'}${lossText}</div></div>`;
  }).join('');
}
function renderIntel() {
  if (!game.marketPrices || !game.marketPrices[game.location]) generateMarketPrices();
  const currentPort = PORTS.find(p => p.id === game.location);
  const intel = document.getElementById('marketIntel');
  const specialties = currentPort.specialties.map(s => GOODS[s].name).join(', ');
  const cheapGoods = Object.keys(GOODS).filter(g => {
    const p = game.marketPrices[game.location][g];
    return p > 0 && p < GOODS[g].basePrice * 0.7;
  }).map(g => GOODS[g].name);

  intel.innerHTML = '<strong>Port Specialties:</strong> ' + specialties + ' (usually cheaper here)<br>' +
    '<strong>Good Deals:</strong> ' + (cheapGoods.length > 0 ? cheapGoods.join(', ') : 'Nothing particularly cheap today.') + '<br>' +
    '<strong>Local Danger:</strong> ' + '⚔️'.repeat(currentPort.danger) + '<br>' +
    '<em style="opacity:0.7;">Prices change every day. Buy low here, sell high elsewhere!</em>';
}
function renderPartyScreen() {
  const container = document.getElementById('partyDetail');
  const party = getActiveParty();
  const fieldCap = (typeof window.getShipFieldCap === 'function') ? window.getShipFieldCap() : null;
  const fieldedIds = (typeof window.getFieldedIds === 'function') ? new Set(window.getFieldedIds()) : null;
  let html = '';
  if (fieldCap) {
    const nonExemptFielded = (typeof window.isFreeFieldId === 'function')
      ? [...fieldedIds].filter(id => !window.isFreeFieldId(id)).length
      : fieldedIds.size;
    html += '<div class="panel" style="margin-bottom:12px;"><div class="panel-title">⚔️ Fielded for the Voyage</div>'+
      '<p style="font-size:.85rem;opacity:.85;">'+nonExemptFielded+' / '+fieldCap+' fielded. Everyone else is at Fair Tide — send someone home to make room, or bring someone new aboard. San and Soel are always with the crew and never count against this.</p></div>';
  }
  html += '<div class="main-grid">' +
    party.map(m => {
      const maxHp = effectiveMaxHp(m);
      const maxMp = effectiveMaxMp(m);
      const hp = game.partyHp[m.id] != null ? game.partyHp[m.id] : maxHp;
      const mp = game.partyMp[m.id] != null ? game.partyMp[m.id] : maxMp;
      const kit = kitFor(m.id);
      const spells = kitSpellList(kit).filter(s => (s.levelReq || 1) <= level());
      const trophy = game.equippedTrophies && game.equippedTrophies[m.id];
      const affinity = affinityFor(m.id);
      const fielded = !fieldedIds || fieldedIds.has(m.id);
      const isSan = m.id === 'san';
      const requiredIds = (typeof window.getRequiredFieldedIds === 'function') ? window.getRequiredFieldedIds() : [];
      const isRequired = requiredIds.includes(m.id);
      const freeSlotHint = (typeof window.isFreeFieldId === 'function' && window.isFreeFieldId(m.id) && m.id !== 'san')
        ? `<div style="font-size:.72rem;opacity:.7;margin-top:4px;">${m.id === 'soel' ? '🐾 A familiar' : '💞 Bonded to San'} — never counts against the fielding cap.</div>`
        : '';

      return `<div class="panel" style="${fielded?'':'opacity:.72;'}">
        <div class="panel-title">${m.portrait} ${m.name} ${fielded ? '<span style="font-size:.7rem;color:var(--success);">⚔️ Fielded</span>' : '<span style="font-size:.7rem;opacity:.7;">⚓ At Fair Tide</span>'}</div>
        <p style="font-size:0.85rem;opacity:0.8;margin-bottom:10px;">${m.desc}</p>
        <div style="display:flex;gap:15px;margin-bottom:10px;">
        <div style="flex:1;"><div style="font-size:0.8rem;color:var(--sand);">HP</div>
        <div class="ship-stat-bar" style="width:100%;"><div class="ship-stat-fill" style="width:${hp/maxHp*100}%;background:#e74c3c;"></div></div>
        <div style="font-size:0.75rem;">${hp}/${maxHp}</div></div>
        ${m.mp > 0 ? `<div style="flex:1;"><div style="font-size:0.8rem;color:var(--sand);">MP</div>
        <div class="ship-stat-bar" style="width:100%;"><div class="ship-stat-fill" style="width:${mp/maxMp*100}%;background:#3498db;"></div></div>
        <div style="font-size:0.75rem;">${mp}/${maxMp}</div></div>` : ''}
        </div>
        <div style="font-size:0.85rem;margin-bottom:8px;"><strong>Role:</strong> ${m.role} · ${m.combatRole}</div>
        ${kit.skill ? `<div style="font-size:0.85rem;margin-bottom:8px;"><strong>Skill:</strong> ${kit.skill.icon} ${kit.skill.name}</div>` : ''}
        ${spells.length ? `<div style="font-size:0.85rem;margin-bottom:8px;"><strong>Spells:</strong> ${spells.slice(0, 4).map(s => s.icon + ' ' + s.name).join(', ')}${spells.length > 4 ? '...' : ''}</div>` : ''}
        ${affinity.n ? `<div style="font-size:0.85rem;margin-bottom:8px;color:#e8c96a;"><strong>Affinity:</strong> ${affinity.n}</div>` : ''}
        ${trophy ? `<div style="font-size:0.85rem;margin-bottom:8px;"><strong>Equipped:</strong> ${trophy.icon} ${trophy.name} (${(TRINKET_BONUS[trophy.icon] && TRINKET_BONUS[trophy.icon].label) || ''})</div>` : ''}
        ${isSan ? '' : isRequired ? '<div style="font-size:.78rem;opacity:.75;">📖 Essential to the current story — can\'t be sent to Fair Tide right now.</div>' + freeSlotHint : `<button class="btn btn-small ${fielded?'btn-danger':'btn-success'}" onclick="toggleFielded('${m.id}')">${fielded ? '⚓ Send to Fair Tide' : '⚔️ Field for the Voyage'}</button>${freeSlotHint}`}
        </div>`;
    }).join('') + '</div>';
  container.innerHTML = html;
}
function renderInventory() {
  const cargoDiv = document.getElementById('invCargo');
  const cargoGoods = Object.keys(game.cargo).filter(g => game.cargo[g] > 0);
  cargoDiv.innerHTML = cargoGoods.length ? cargoGoods.map(g =>
    `<div class="cargo-item"><div class="cargo-icon">${GOODS[g].icon}</div>
    <div class="cargo-name">${GOODS[g].name}</div>
    <div class="cargo-qty">${game.cargo[g]} units</div></div>`
  ).join('') : '<p style="opacity:0.6;">Cargo hold is empty.</p>';

  const consDiv = document.getElementById('invConsumables');
  const cons = Object.keys(game.consumables || {}).filter(id => game.consumables[id] > 0);
  consDiv.innerHTML = cons.length ? cons.map(id => {
    const item = POTION_CATALOG.find(p => p.id === id);
    return `<div class="inv-item"><div class="inv-icon">${item.icon}</div><div class="inv-name">${item.name}</div><div>${game.consumables[id]}x</div></div>`;
  }).join('') : '<p style="opacity:0.6;">No consumables.</p>';

  const trophyDiv = document.getElementById('invTrophies');
  trophyDiv.innerHTML = game.inventory.length ? game.inventory.map((item, i) =>
    `<div class="inv-item" onclick="equipTrophy(${i})"><div class="inv-icon">${item.icon}</div><div class="inv-name">${item.name}</div><div style="font-size:0.7rem;">${item.desc}</div></div>`
  ).join('') : '<p style="opacity:0.6;">No trophies yet. Defeat enemies to earn them!</p>';

  const equipDiv = document.getElementById('invEquipment');
  const party = getActiveParty();
  equipDiv.innerHTML = party.map(m => {
    const trophy = game.equippedTrophies && game.equippedTrophies[m.id];
    return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;padding:8px;background:rgba(0,0,0,0.2);border-radius:8px;">
      <div style="font-size:1.5rem;">${m.portrait}</div>
      <div><div style="font-family:Cinzel;color:var(--gold);font-size:0.85rem;">${m.name}</div>
      <div style="font-size:0.8rem;">${trophy ? trophy.icon + ' ' + trophy.name + ' — ' + ((TRINKET_BONUS[trophy.icon] && TRINKET_BONUS[trophy.icon].label) || '') : 'No trinket equipped'}</div></div>
      ${trophy ? `<button class="btn btn-small btn-danger" style="margin-left:auto;" onclick="unequipTrophy('${m.id}')">Remove</button>` : ''}
      </div>`;
  }).join('');
}
function equipTrophy(invIndex) {
  const item = game.inventory[invIndex];
  if (!item) return;
  const party = getActiveParty();
  showModal('Equip ' + item.icon + ' ' + item.name,
    'Choose a crew member to equip this trinket:<br><br>' +
    party.map(m => `<button class="btn btn-small" onclick="doEquipTrophy('${m.id}', ${invIndex})">${m.portrait} ${m.name}</button>`).join(''),
    [{text: 'Cancel', action: closeModal}]);
}
function doEquipTrophy(memberId, invIndex) {
  const item = game.inventory[invIndex];
  if (!item) return;
  if (game.equippedTrophies && game.equippedTrophies[memberId]) game.inventory.push(game.equippedTrophies[memberId]);
  game.inventory.splice(invIndex, 1);
  if (!game.equippedTrophies) game.equippedTrophies = {};
  game.equippedTrophies[memberId] = item;
  closeModal();
  toast(item.icon + ' ' + item.name + ' equipped!');
  renderInventory();
}
function unequipTrophy(memberId) {
  const trophy = game.equippedTrophies && game.equippedTrophies[memberId];
  if (trophy) {
    game.inventory.push(trophy);
    delete game.equippedTrophies[memberId];
    toast('Trinket removed.');
    renderInventory();
  }
}
function renderLog() {
  const log = document.getElementById('eventLog');
  log.innerHTML = game.log.slice(-50).map(entry =>
    `<div class="entry"><span class="time">Day ${entry.day}:</span> <span class="${entry.type}">${entry.text}</span></div>`
  ).join('');
  log.scrollTop = log.scrollHeight;
}
function buyPotion(id) {
  const p = POTION_CATALOG.find(x => x.id === id);
  if (!p) return;
  const cost = Math.round(p.price * haggleMultiplier());
  if (game.gold < cost) { toast('Not enough gold!'); return; }
  game.gold -= cost;
  game.consumables[id] = (game.consumables[id] || 0) + 1;
  toast(p.icon + ' ' + p.name + ' purchased (-' + cost + 'g)');
  updateUI();
}

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------
window.onload = function() {
  const saveData = localStorage.getItem(SAVE_KEY);
  if (saveData) {
    const intro = document.querySelector('.party-setup');
    if (intro) intro.innerHTML += '<div style="margin-top:10px;color:var(--gold);font-size:0.9rem;">📂 Saved voyage found!</div>';
  }
};


function xpProgressPercent() {
  return crimsonXPPercent();
}
function updateXPPercentUI() {
  updateCrimsonXPDisplay();
}
function updateCrimsonXPDisplay() {
  const pct = Math.round(crimsonXPPercent());
  const text = document.getElementById('portXPText');
  const bar = document.getElementById('portXPBar');
  const ltext = document.getElementById('landingXP');
  const lbar = document.getElementById('landingXPBar');
  if (text) text.textContent = `${pct}% → NEXT LEVEL`;
  if (bar) bar.style.width = pct + '%';
  if (ltext) ltext.textContent = `${pct}% → NEXT LEVEL`;
  if (lbar) lbar.style.width = pct + '%';
}
window.addEventListener('pageshow', () => {
  try { renderLandingV24(); renderAFKWelcome(); renderLandingSaveState(); } catch(e) {}
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') persistAFKTimestamp();
});
window.addEventListener('pagehide', () => persistAFKTimestamp());


document.addEventListener('DOMContentLoaded', () => { try { renderLandingV24(); renderAFKWelcome(); renderLandingSaveState(); } catch(e) {} });

document.addEventListener('DOMContentLoaded',function(){if(typeof goScreen==='function')goScreen('intro');});
