
  // BUG FIX: this footer was a hardcoded static string ("Build V83 ·
  // Party AI + Equipment") completely disconnected from
  // window.__CT_BUILD__ — every build since V83 updated that variable
  // (used correctly by the debug log panel) but never touched this
  // footer text, since nothing ever read it back out. Wired here to
  // read the live value instead, so it can't go stale again no matter
  // how many future builds ship.
  document.addEventListener('DOMContentLoaded', function(){
    const el = document.getElementById('ctBuildFooterVersion');
    if (el) el.textContent = 'Build ' + (window.__CT_BUILD__ || '?');
    // Same staleness bug, same fix, for the browser tab title — it was
    // still hardcoded to "Build V83" in index.html's <title> and never
    // read window.__CT_BUILD__ back out either.
    if (window.__CT_BUILD__) document.title = 'Daybreak: Crimson Tide — ' + window.__CT_BUILD__;
  });


/* Build V62 — full Arc I Story Mode panel pass + rescue gates.
   Built on the Claude-debugged V61 base. Existing working Story Mode mechanics are preserved. */
(function(){
  const arc1PanelDefs = {
    1:[{"image": "assets/comics/arc1/ch01-storm-that-remained.webp", "crop": [0, 0, 0.685, 0.329], "text": "Three months after the storm, San wakes with the sea around her and a silence where familiar names should be. The last thing she remembers is the sky breaking open and the sea swallowing everything.", "caption": "Survival is the first memory."}, {"image": "assets/comics/arc1/ch01-storm-that-remained.webp", "crop": [0.689, 0, 0.311, 0.177], "text": "The Crimson Tide survived the wreck. San did too. But the storm scattered more than wood and cargo: memories, names, faces, promises. All gone.", "caption": "The ship remains. The crew does not."}, {"image": "assets/comics/arc1/ch01-storm-that-remained.webp", "crop": [0.689, 0.182, 0.311, 0.147], "text": "Only the feeling remains, that something important was taken from her.", "caption": "Every face is a stranger."}, {"image": "assets/comics/arc1/ch01-storm-that-remained.webp", "crop": [0.01, 0.334, 0.174, 0.202], "text": "She survived. She is on a ship. A storm destroyed everything. She has a cat. She must keep going. The sea does not give second chances.", "caption": "What San knows."}, {"image": "assets/comics/arc1/ch01-storm-that-remained.webp", "crop": [0.188, 0.334, 0.288, 0.202], "text": "Soel was the first to find her. Her only memory that chose to stay.", "caption": "Some bonds survive without names."}, {"image": "assets/comics/arc1/ch01-storm-that-remained.webp", "crop": [0.483, 0.334, 0.517, 0.215], "text": "When she woke, she was alone, but the ship was not. They did not ask for her name. They handed her clothes, water, and a place to stand. She did not know why, but she did not question it.", "caption": "Someone kept the ship afloat."}, {"image": "assets/comics/arc1/ch01-storm-that-remained.webp", "crop": [0.005, 0.545, 0.44, 0.227], "text": "The Crimson Tide: a modified brigantine, her crew unnamed but loyal. She is not the fastest or the strongest, but she has never failed us.", "caption": "The ship they call home."}, {"image": "assets/comics/arc1/ch01-storm-that-remained.webp", "crop": [0.446, 0.553, 0.55, 0.22], "text": "Delivered supplies to isolated ports. Fought off monsters threatening trade routes. Repaired the ship and upgraded what they could. Took on bounties. Earned trust. Earned survival.", "caption": "What they have done together."}, {"image": "assets/comics/arc1/ch01-storm-that-remained.webp", "crop": [0.005, 0.777, 0.66, 0.218], "text": "\"Soel, do you remember anything?\" \"No? Right. I didn't think so.\" They do not know her past, and she does not know theirs, but when they work together it feels right. \"So for now, that's enough. We sail. We live.\"", "caption": "Same as me."}, {"image": "assets/comics/arc1/ch01-storm-that-remained.webp", "crop": [0.667, 0.777, 0.333, 0.218], "text": "The sea took her memory, but it gave her a purpose. San does not know where this journey will lead, but she knows this: she will find the answers.", "caption": "And so the search begins."}],
    2:[{"image": "assets/comics/arc1/ch02-the-first-port.webp", "crop": [0, 0, 0.679, 0.314], "text": "Three days at sea. Three days of salt, wind, and questions. Today, the Crimson Tide reached Malacca, the first port of this new world.", "caption": "The First Port."}, {"image": "assets/comics/arc1/ch02-the-first-port.webp", "crop": [0.684, 0, 0.316, 0.15], "text": "New smells. New sounds. New people. New stories. And new dangers.", "caption": "New people. New stories."}, {"image": "assets/comics/arc1/ch02-the-first-port.webp", "crop": [0.684, 0.155, 0.316, 0.159], "text": "She did not know this world, but she would learn.", "caption": "Step by step. Port by port."}, {"image": "assets/comics/arc1/ch02-the-first-port.webp", "crop": [0.005, 0.32, 0.19, 0.203], "text": "Malacca is a trade crossroads where merchants from many lands meet. Pirates and smugglers watch these waters. Information is currency. Trust is rare.", "caption": "What San learns."}, {"image": "assets/comics/arc1/ch02-the-first-port.webp", "crop": [0.199, 0.32, 0.245, 0.203], "text": "His spirit bell rings softly. Not in fear, but curiosity. This place has many stories.", "caption": "Soel listens."}, {"image": "assets/comics/arc1/ch02-the-first-port.webp", "crop": [0.449, 0.32, 0.551, 0.203], "text": "So many people, so many tongues, so many ships. \"Malacca welcomes all who trade fair,\" a merchant says. \"But Malacca remembers those who do not.\"", "caption": "Where do we even start?"}, {"image": "assets/comics/arc1/ch02-the-first-port.webp", "crop": [0.005, 0.532, 0.663, 0.232], "text": "Strange ships seen south of the straits, sailing without any mark. Smugglers moving goods at night. A lone warrior fighting a terrible creature in the old ruins, and no one knows his name. A reward for anyone brave enough, but no one has returned.", "caption": "Rumors in the market."}, {"image": "assets/comics/arc1/ch02-the-first-port.webp", "crop": [0.684, 0.527, 0.316, 0.236], "text": "San studies the map: the harbour, Chinatown, the Indian quarter, the Dutch fort, the Sultan's palace, the market district, the shipyard. The harbour is only the beginning.", "caption": "Malacca."}, {"image": "assets/comics/arc1/ch02-the-first-port.webp", "crop": [0.005, 0.773, 0.44, 0.223], "text": "\"This place is alive. But it's not kind. Not yet.\" She needs a ship, a crew, information, and reasons to stay. The Crimson Tide is small and scarred, but it is hers, and that is enough for now.", "caption": "A ship. A crew. A reason."}, {"image": "assets/comics/arc1/ch02-the-first-port.webp", "crop": [0.449, 0.773, 0.551, 0.223], "text": "New place, new food, new problems. Same us. Soel agrees, but only because the fish is good. One port behind them, the world is wide, and San is not alone.", "caption": "The journey continues."}],
    3:[{"image": "assets/comics/arc1/ch03-a-crew-of-choice.webp", "crop": [0, 0, 0.672, 0.315], "text": "A ship is nothing without its crew. San could not do this alone. She needed hands that would hold the line beside her.", "caption": "A Crew of Choice."}, {"image": "assets/comics/arc1/ch03-a-crew-of-choice.webp", "crop": [0.677, 0, 0.323, 0.155], "text": "The Crimson Tide was not ready. Neither was she.", "caption": "Not ready."}, {"image": "assets/comics/arc1/ch03-a-crew-of-choice.webp", "crop": [0.677, 0.159, 0.323, 0.155], "text": "But waiting would change nothing.", "caption": "So she began."}, {"image": "assets/comics/arc1/ch03-a-crew-of-choice.webp", "crop": [0.005, 0.32, 0.17, 0.216], "text": "A helmsman who knows the sea. Someone who can mend more than sails. Eyes that can find danger before it finds us. Strength that will not falter when it matters. Loyalty earned, not demanded.", "caption": "What San needs."}, {"image": "assets/comics/arc1/ch03-a-crew-of-choice.webp", "crop": [0.178, 0.32, 0.417, 0.216], "text": "Kael, helmsman: knows winds, currents, and how to keep us alive. Mei, shipwright and healer: her hands build and heal, her heart understands.", "caption": "Kael and Mei."}, {"image": "assets/comics/arc1/ch03-a-crew-of-choice.webp", "crop": [0.597, 0.32, 0.403, 0.216], "text": "Rian, scout: fast eyes, quick feet, and danger does not like him. Toran, guard: a wall of muscle and a heart that keeps watch.", "caption": "Rian and Toran."}, {"image": "assets/comics/arc1/ch03-a-crew-of-choice.webp", "crop": [0.005, 0.545, 0.667, 0.2], "text": "Damaged hull, mended. Sails, patched. Supplies, stocked. Routes studied, tides checked, risk calculated. Food enough, water enough. Hope, enough?", "caption": "The Crimson Tide, in progress."}, {"image": "assets/comics/arc1/ch03-a-crew-of-choice.webp", "crop": [0.677, 0.547, 0.318, 0.198], "text": "The Crimson Tide: a modified brigantine, crew of six for now. Exploration, trade, escort, and survival. \"A ship is not made by wood or sails, but by the people who refuse to sink.\"", "caption": "A ship is not made by wood or sails."}, {"image": "assets/comics/arc1/ch03-a-crew-of-choice.webp", "crop": [0.005, 0.753, 0.624, 0.234], "text": "\"We are not family. We are not bound by blood. But we choose this, and that is enough.\" \"We will earn. We will survive. And we will decide our own futures. Together, as long as it lasts.\"", "caption": "We choose this."}, {"image": "assets/comics/arc1/ch03-a-crew-of-choice.webp", "crop": [0.632, 0.753, 0.368, 0.234], "text": "The Crimson Tide sets sail. Not as heroes, not as legends, just as people looking for a tomorrow.", "caption": "The journey begins."}],
    4:[{"image": "assets/comics/arc1/ch04-the-guardians-fortress.webp", "crop": [0, 0, 0.725, 0.33], "text": "Rumors spread through every port: a warrior, alone, guarding something no one dares approach. San does not rush. A captain does not throw her crew into the unknown. She observes. She learns. She plans.", "caption": "The Guardian's Fortress."}, {"image": "assets/comics/arc1/ch04-the-guardians-fortress.webp", "crop": [0.725, 0, 0.275, 0.33], "text": "\"He has been fighting that thing for months?\" San watches through the spyglass. \"Why does it feel like I should know him? But I don't.\"", "caption": "Why does it feel like I should know him?"}, {"image": "assets/comics/arc1/ch04-the-guardians-fortress.webp", "crop": [0, 0.338, 0.176, 0.196], "text": "A warrior defends the ruins day and night. The creature appears only at dusk. Previous attempts ended in failure. He refuses to leave. The ruins hold something important.", "caption": "What we know."}, {"image": "assets/comics/arc1/ch04-the-guardians-fortress.webp", "crop": [0.178, 0.338, 0.325, 0.196], "text": "He is not a prisoner. He is a guardian.", "caption": "He is a guardian."}, {"image": "assets/comics/arc1/ch04-the-guardians-fortress.webp", "crop": [0.503, 0.338, 0.497, 0.196], "text": "\"Captain, why are we getting involved?\" \"We don't know him. He might not want help.\" \"I don't know why... but leaving him there feels wrong.\"", "caption": "Leaving him there feels wrong."}, {"image": "assets/comics/arc1/ch04-the-guardians-fortress.webp", "crop": [0, 0.538, 0.711, 0.251], "text": "One, observe: he always forces the creature to one side before dusk, and that is our opening. Two, distract: two ships approach from the south. Three, flank: our fighters come in from the cliff side. Four, heal and support: medical supplies ready. Five, extraction: retreat through the caves, ship waiting in the cove.", "caption": "Strategy meeting."}, {"image": "assets/comics/arc1/ch04-the-guardians-fortress.webp", "crop": [0.714, 0.538, 0.286, 0.251], "text": "Red for distraction, blue for the flank, green for extraction, and San with the rescue team at the ruins.", "caption": "The plan."}, {"image": "assets/comics/arc1/ch04-the-guardians-fortress.webp", "crop": [0, 0.793, 0.682, 0.207], "text": "\"We are not here to kill the guardian. We are here to bring him home.\" Hands meet over the lantern: one team, one plan, no one left behind.", "caption": "One team. No one left behind."}, {"image": "assets/comics/arc1/ch04-the-guardians-fortress.webp", "crop": [0.685, 0.793, 0.315, 0.207], "text": "Tomorrow, the Crimson Tide will steal into the ruins. Tomorrow, San will finally meet the person she feels she has been searching for.", "caption": "The rescue begins."}],
    5:[{"image": "assets/comics/arc1/ch05-the-voice-behind-the-wall.webp", "crop": [0, 0, 1, 0.225], "text": "The plan was ready. The crew would move at midnight. But San needed one answer first.", "caption": "The Voice Behind the Wall."}, {"image": "assets/comics/arc1/ch05-the-voice-behind-the-wall.webp", "crop": [0, 0.225, 0.456, 0.16], "text": "Why did saving this stranger feel like remembering something lost?", "caption": "Why does this feel like remembering?"}, {"image": "assets/comics/arc1/ch05-the-voice-behind-the-wall.webp", "crop": [0.456, 0.225, 0.544, 0.16], "text": "Soel is loud, and the shape in the dark is listening.", "caption": "Why does this feel like remembering?"}, {"image": "assets/comics/arc1/ch05-the-voice-behind-the-wall.webp", "crop": [0, 0.385, 1, 0.23], "text": "\"You should not be here.\" \"I know.\" \"You don't know me.\" \"I know.\" \"Then why?\" \"Because leaving you here felt wrong.\" \"Have we met?\" \"I don't know. But I feel like I have been looking for you.\"", "caption": "Have we met?"}, {"image": "assets/comics/arc1/ch05-the-voice-behind-the-wall.webp", "crop": [0, 0.615, 0.505, 0.16], "text": "\"He doesn't trust many people.\"", "caption": "Your cat trusts me."}, {"image": "assets/comics/arc1/ch05-the-voice-behind-the-wall.webp", "crop": [0.505, 0.615, 0.495, 0.16], "text": "\"Then he knows something I don't.\"", "caption": "Your cat trusts me."}, {"image": "assets/comics/arc1/ch05-the-voice-behind-the-wall.webp", "crop": [0, 0.775, 1, 0.225], "text": "They did not remember their promises. They did not remember their past. But some things survive the storm.", "caption": "Some things survive the storm."}],
    6:[{"image": "assets/comics/arc1/ch06-the-shield-returns.webp", "crop": [0, 0, 1, 0.225], "text": "San returned with her answer. The man in the ruins was not a stranger. He was someone she could not leave behind.", "caption": "The Rescue of Joel."}, {"image": "assets/comics/arc1/ch06-the-shield-returns.webp", "crop": [0, 0.225, 0.6, 0.145], "text": "\"Captain?\" \"We move now.\" \"And the warrior?\"", "caption": "We bring him home."}, {"image": "assets/comics/arc1/ch06-the-shield-returns.webp", "crop": [0.6, 0.225, 0.4, 0.145], "text": "\"We bring him home.\" At midnight, the Crimson Tide struck.", "caption": "We bring him home."}, {"image": "assets/comics/arc1/ch06-the-shield-returns.webp", "crop": [0, 0.37, 0.506, 0.17], "text": "\"You came back.\" \"I said I would.\"", "caption": "You came back."}, {"image": "assets/comics/arc1/ch06-the-shield-returns.webp", "crop": [0.506, 0.37, 0.494, 0.17], "text": "They did not remember each other, but their steps did.", "caption": "You came back."}, {"image": "assets/comics/arc1/ch06-the-shield-returns.webp", "crop": [0, 0.54, 0.484, 0.16], "text": "\"Why would you do that?\" \"It felt natural.\"", "caption": "It felt natural."}, {"image": "assets/comics/arc1/ch06-the-shield-returns.webp", "crop": [0.484, 0.54, 0.516, 0.16], "text": "\"This way!\" \"Stay close.\"", "caption": "It felt natural."}, {"image": "assets/comics/arc1/ch06-the-shield-returns.webp", "crop": [0, 0.7, 0.599, 0.14], "text": "\"I thought I lost you.\"", "caption": "I thought I lost you."}, {"image": "assets/comics/arc1/ch06-the-shield-returns.webp", "crop": [0.599, 0.7, 0.401, 0.14], "text": "\"I feel it too.\"", "caption": "I thought I lost you."}, {"image": "assets/comics/arc1/ch06-the-shield-returns.webp", "crop": [0, 0.84, 0.5, 0.16], "text": "By morning, the ship carried one more soul.", "caption": "One more soul."}, {"image": "assets/comics/arc1/ch06-the-shield-returns.webp", "crop": [0.5, 0.84, 0.5, 0.16], "text": "The first piece of her lost world had returned.", "caption": "One more soul."}],
    7:[{"image": "assets/comics/arc1/ch07-the-shield-that-remained.webp", "crop": [0, 0, 0.5, 0.225], "text": "The storm took their memories, but it could not take what remained. \"You keep looking for something.\"", "caption": "The morning after the rescue."}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.webp", "crop": [0.5, 0, 0.5, 0.225], "text": "\"I had a shield.\"", "caption": "The morning after the rescue."}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.webp", "crop": [0.172, 0.225, 0.276, 0.105], "text": "\"You remember that?\" \"Not the shield.", "caption": "The feeling of holding it."}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.webp", "crop": [0.448, 0.225, 0.222, 0.105], "text": "The feeling of holding it.\" Soel senses things we do not.", "caption": "The feeling of holding it."}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.webp", "crop": [0.67, 0.225, 0.33, 0.105], "text": "Soel senses things we do not.", "caption": "The feeling of holding it."}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.webp", "crop": [0, 0.335, 0.417, 0.15], "text": "\"We should ask around. The fortress was abandoned, so someone would have taken it by now.\"", "caption": "The Traders' Quarter of Malacca."}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.webp", "crop": [0.417, 0.335, 0.583, 0.15], "text": "Antique dealers, ship salvagers, black-market traders, weapon merchants. \"We will check them all.\"", "caption": "The Traders' Quarter of Malacca."}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.webp", "crop": [0, 0.49, 0.544, 0.14], "text": "\"That one? A strange piece. The warrior who carried it never abandoned it.\"", "caption": "A strange piece."}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.webp", "crop": [0.544, 0.49, 0.456, 0.14], "text": "\"You knew him?\" \"No. But I knew what kind of person would carry it.\"", "caption": "A strange piece."}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.webp", "crop": [0, 0.635, 0.534, 0.145], "text": "\"You always repair damaged equipment before replacing it. You help merchants without asking for payment. You remember people's names.\"", "caption": "I think someone should."}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.webp", "crop": [0.534, 0.635, 0.466, 0.145], "text": "\"You do this often?\" \"Help people who can't give you anything.\" \"I think someone should.\"", "caption": "I think someone should."}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.webp", "crop": [0, 0.785, 0.5, 0.215], "text": "It was found after the battle, not stolen, recovered. A trader fleet took it to another port.", "caption": "The shield's trail."}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.webp", "crop": [0.5, 0.785, 0.5, 0.215], "text": "\"Then that is where we go.\" They found no memories, no answers, only a shield left behind by the person Joel used to be.", "caption": "The shield's trail."}],
    8:[{"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0, 0, 1, 0.245], "text": "Some lost things are found by searching. Others are found because someone remembers.", "caption": "The Tradewinds Remember."}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0, 0.25, 0.5, 0.145], "text": "\"The shield passed through many hands. But none kept it.", "caption": "It felt wrong to own."}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0.5, 0.25, 0.5, 0.145], "text": "They said it felt wrong to own.\"", "caption": "It felt wrong to own."}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0, 0.4, 0.524, 0.1], "text": "\"Not a memory. Just...", "caption": "A place I should be."}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0.524, 0.4, 0.476, 0.1], "text": "a place I should be.\" San notices the way he looks at the world when he thinks no one is watching.", "caption": "A place I should be."}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0, 0.505, 0.518, 0.17], "text": "A traveling merchant caravan: old manifests, one name, one route, a trader who remembers. A retired guard at the south gate: he saw the shield once, hidden and protected.", "caption": "Three clues."}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0.518, 0.505, 0.482, 0.17], "text": "A smuggler warehouse near the quay: a mark in old ledgers, a crate moved in secret, a trail that goes cold.", "caption": "Three clues."}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0, 0.68, 0.597, 0.105], "text": "\"You are worried you won't recognize yourself.\"", "caption": "I think I'm worried I will."}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0.597, 0.68, 0.403, 0.105], "text": "\"I think I'm worried I will.\"", "caption": "I think I'm worried I will."}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0, 0.79, 0.283, 0.085], "text": "They were close. Closer than before.", "caption": "The Daybreak crest."}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0.283, 0.79, 0.521, 0.085], "text": "But the sea had one more test. The Daybreak crest, their mark: this shipment was real.", "caption": "The Daybreak crest."}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0.804, 0.79, 0.196, 0.085], "text": "The shield was here. But it is gone.", "caption": "The Daybreak crest."}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0, 0.875, 0.446, 0.125], "text": "Some things return when they are ready.", "caption": "The shield was waiting."}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.webp", "crop": [0.446, 0.875, 0.554, 0.125], "text": "The shield was waiting.", "caption": "The shield was waiting."}],
    9:[{"image": "assets/comics/arc1/ch09-shield-returns.webp", "crop": [0, 0, 0.633, 0.215], "text": "Some things are lost. Some things are stolen. And some things wait for the person who left them behind. The trail ends at an abandoned coastal fort.", "caption": "The trail ends at a coastal fort."}, {"image": "assets/comics/arc1/ch09-shield-returns.webp", "crop": [0.633, 0, 0.367, 0.215], "text": "\"Captain... this mark. It matches the shield.\"", "caption": "The trail ends at a coastal fort."}, {"image": "assets/comics/arc1/ch09-shield-returns.webp", "crop": [0, 0.22, 0.636, 0.165], "text": "Joel goes in first. The room is hidden, the air is still, and something waits. \"I thought I would remember everything.\"", "caption": "I thought I would remember everything."}, {"image": "assets/comics/arc1/ch09-shield-returns.webp", "crop": [0.636, 0.22, 0.364, 0.165], "text": "\"You don't have to.\" \"You are still you.\"", "caption": "I thought I would remember everything."}, {"image": "assets/comics/arc1/ch09-shield-returns.webp", "crop": [0, 0.39, 0.52, 0.175], "text": "Memories return, not all at once, just pieces. Small moments, real moments, the moments that made him who he was.", "caption": "Real moments."}, {"image": "assets/comics/arc1/ch09-shield-returns.webp", "crop": [0.52, 0.39, 0.48, 0.175], "text": "\"I still don't remember everything. But I remember this.\"", "caption": "Real moments."}, {"image": "assets/comics/arc1/ch09-shield-returns.webp", "crop": [0, 0.57, 0.489, 0.185], "text": "The crest is restored. The shield is his again. The symbol remains: Daybreak, Crimson Tide.", "caption": "The crest is restored."}, {"image": "assets/comics/arc1/ch09-shield-returns.webp", "crop": [0.489, 0.57, 0.511, 0.185], "text": "The captain found her guardian. \"No. I think I found my place.\"", "caption": "The crest is restored."}, {"image": "assets/comics/arc1/ch09-shield-returns.webp", "crop": [0, 0.76, 0.5, 0.24], "text": "\"Does it feel familiar?\" \"Yes. But not because of the shield.\"", "caption": "The journey continues."}, {"image": "assets/comics/arc1/ch09-shield-returns.webp", "crop": [0.5, 0.76, 0.5, 0.24], "text": "The shield returned, but the man carrying it was still becoming someone new. The journey continues.", "caption": "The journey continues."}],
    10:[{"image": "assets/comics/arc1/ch10-day-sea-rested.webp", "crop": [0, 0, 1, 0.185], "text": "Not every day at sea is a battle. At the next port the crew offloads their cargo, and the recruits celebrate at the tavern. For once, the day asks nothing of them but rest.", "caption": "The Day the Sea Rested."}, {"image": "assets/comics/arc1/ch10-day-sea-rested.webp", "crop": [0, 0.19, 0.46, 0.155], "text": "\"You are not joining them?\" \"I will.", "caption": "Just not for very long."}, {"image": "assets/comics/arc1/ch10-day-sea-rested.webp", "crop": [0.46, 0.19, 0.54, 0.155], "text": "Just not for very long.\" So they walk: no armor, no battle, just the shore, the wind, and the space between them.", "caption": "Just not for very long."}, {"image": "assets/comics/arc1/ch10-day-sea-rested.webp", "crop": [0, 0.35, 0.491, 0.15], "text": "\"It is strange, being somewhere peaceful.\" \"Is that so unusual?\" \"For people? Yes.\"", "caption": "Being somewhere peaceful."}, {"image": "assets/comics/arc1/ch10-day-sea-rested.webp", "crop": [0.491, 0.35, 0.509, 0.15], "text": "\"I am capable.\" \"I know. That is why I worry.\"", "caption": "Being somewhere peaceful."}, {"image": "assets/comics/arc1/ch10-day-sea-rested.webp", "crop": [0, 0.505, 0.5, 0.095], "text": "A vine catches her foot.", "caption": "A vine catches her foot."}, {"image": "assets/comics/arc1/ch10-day-sea-rested.webp", "crop": [0.5, 0.505, 0.5, 0.095], "text": "He catches her, abruptly, naturally.", "caption": "A vine catches her foot."}, {"image": "assets/comics/arc1/ch10-day-sea-rested.webp", "crop": [0, 0.605, 0.559, 0.1], "text": "Too close. Too sudden. Too familiar. A kiss, accidental, inevitable.", "caption": "Neither do I."}, {"image": "assets/comics/arc1/ch10-day-sea-rested.webp", "crop": [0.559, 0.605, 0.441, 0.1], "text": "\"I... I do not know why.\" \"Neither do I.\"", "caption": "Neither do I."}, {"image": "assets/comics/arc1/ch10-day-sea-rested.webp", "crop": [0, 0.71, 0.5, 0.09], "text": "\"That felt familiar.\"", "caption": "That felt familiar."}, {"image": "assets/comics/arc1/ch10-day-sea-rested.webp", "crop": [0.5, 0.71, 0.5, 0.09], "text": "\"Yes.\"", "caption": "That felt familiar."}, {"image": "assets/comics/arc1/ch10-day-sea-rested.webp", "crop": [0, 0.805, 1, 0.195], "text": "\"We still do not know what happened before. But... some things survived.\" Memories can disappear, names can fade, years can be stolen. But sometimes the heart remembers the way home. The sea rested, but the journey continues.", "caption": "The sea rested."}],
    11:[{"image": "assets/comics/arc1/ch11-day-we-chose.webp", "crop": [0, 0, 0.545, 0.228], "text": "The crew had earned a day of rest, so for once San let the tide wait. \"Captain, are you leaving the ship without a plan?\" \"Yes.\" \"That is concerning.\" \"It is also rare.\"", "caption": "Morning at the port."}, {"image": "assets/comics/arc1/ch11-day-we-chose.webp", "crop": [0.545, 0, 0.455, 0.228], "text": "\"I do not think I have ever walked through a city without looking for something.\" \"What?\" \"You are looking for something now.\" \"A normal day.\"", "caption": "Market streets."}, {"image": "assets/comics/arc1/ch11-day-we-chose.webp", "crop": [0, 0.228, 0.515, 0.235], "text": "\"You dislike it?\" \"I do not.\" \"Your face says otherwise.\" \"My face is a private matter.\" \"Apparently not.\"", "caption": "Food stall."}, {"image": "assets/comics/arc1/ch11-day-we-chose.webp", "crop": [0.515, 0.228, 0.485, 0.235], "text": "\"Yesterday... that was strange.\" \"Yes.\" \"You agree too quickly.\" They still did not remember, but some feelings had survived the storm.", "caption": "By the shore."}, {"image": "assets/comics/arc1/ch11-day-we-chose.webp", "crop": [0, 0.465, 0.558, 0.155], "text": "A slip on the rocks. \"You did not even think.\" \"Catching me.\"", "caption": "The walk back."}, {"image": "assets/comics/arc1/ch11-day-we-chose.webp", "crop": [0.558, 0.465, 0.442, 0.155], "text": "\"About what?\" \"I was supposed to.\"", "caption": "The walk back."}, {"image": "assets/comics/arc1/ch11-day-we-chose.webp", "crop": [0, 0.622, 0.556, 0.135], "text": "\"This feels familiar.\" \"Yes.\" \"You say that a lot.\"", "caption": "Hand in hand."}, {"image": "assets/comics/arc1/ch11-day-we-chose.webp", "crop": [0.556, 0.622, 0.444, 0.135], "text": "\"Because it keeps being true.\" From that moment, he held her hand so she would not slip again.", "caption": "Hand in hand."}, {"image": "assets/comics/arc1/ch11-day-we-chose.webp", "crop": [0, 0.76, 0.43, 0.225], "text": "\"Welcome back! How was your day?\" \"Good.\" \"Very.\"", "caption": "Return to the ship."}, {"image": "assets/comics/arc1/ch11-day-we-chose.webp", "crop": [0.43, 0.76, 0.57, 0.225], "text": "Memories can return. Memories can fade. But some choices are made twice. Once in the past, and once again, when you find each other.", "caption": "Ending the day."}],
    12:[{"image": "assets/comics/arc1/ch12-debt-wasnt-hers.webp", "crop": [0.185, 0, 0.36, 0.24], "text": "Some debts are earned. Some are stolen. Aisyah owes neither, but the collector does not care. \"You are getting used to this.\" \"To what?\" \"People listening to you.\"", "caption": "Arrival: Palembang port."}, {"image": "assets/comics/arc1/ch12-debt-wasnt-hers.webp", "crop": [0.545, 0, 0.455, 0.24], "text": "\"The debt collector has a new name on his ledger. Aisyah.\" \"She owes a fortune she never borrowed.\" \"Somebody gets a name off that page.\" \"Not today.\"", "caption": "A rumor in the market."}, {"image": "assets/comics/arc1/ch12-debt-wasnt-hers.webp", "crop": [0.185, 0.245, 0.31, 0.23], "text": "\"That name...\" \"You know it?\" \"I don't know. But it feels like someone I should protect.\"", "caption": "That name stirs something."}, {"image": "assets/comics/arc1/ch12-debt-wasnt-hers.webp", "crop": [0.495, 0.245, 0.245, 0.23], "text": "Aisyah: shadow walker, rogue, watchful, survivor. A name on the ledger, a debt she never owed.", "caption": "Aisyah."}, {"image": "assets/comics/arc1/ch12-debt-wasnt-hers.webp", "crop": [0.74, 0.245, 0.26, 0.23], "text": "\"You cannot escape a debt.\" \"I am not trying to escape. I am trying to find who was stupid enough to create it.\"", "caption": "The debt collector."}, {"image": "assets/comics/arc1/ch12-debt-wasnt-hers.webp", "crop": [0, 0.48, 0.44, 0.22], "text": "She moves like someone who knows how to stand between danger and others.", "caption": "San watches."}, {"image": "assets/comics/arc1/ch12-debt-wasnt-hers.webp", "crop": [0.44, 0.48, 0.56, 0.22], "text": "\"Why did you help me?\" \"I don't know.\" \"That is a terrible reason.\" \"It is the only one I have.\" \"That sounds like something I would do.\" \"Yeah.\"", "caption": "The sister moment."}, {"image": "assets/comics/arc1/ch12-debt-wasnt-hers.webp", "crop": [0, 0.705, 0.44, 0.285], "text": "\"You.\" \"Me?\" \"You follow her everywhere.\" \"I am her first mate.\" \"That is not what I meant.\" \"Aisyah.\" \"I said nothing.\"", "caption": "Older sister instinct."}, {"image": "assets/comics/arc1/ch12-debt-wasnt-hers.webp", "crop": [0.44, 0.705, 0.56, 0.285], "text": "Some people return with memories. Some return with questions. Some return with a knife in their hand. And a debt they never owed. But family does not need a name to recognize home.", "caption": "A new course together."}],
    13:[{"image": "assets/comics/arc1/ch13-debt-collector.webp", "crop": [0.19, 0, 0.34, 0.28], "text": "Some debts are written in ink. Some are written in blood. But the truth always finds a way to be read. \"You did not sleep.\" \"Neither did she.\" \"I sleep better when I know who is watching me.\"", "caption": "The morning after."}, {"image": "assets/comics/arc1/ch13-debt-collector.webp", "crop": [0.53, 0, 0.47, 0.28], "text": "The debt collector's ledger was not destroyed: hundreds of names, some dead, some never even here. And beneath Aisyah's name, a second mark, the same symbol we saw. \"That mark...\" \"You know it?\" \"No. But I think we should.\"", "caption": "The ledger."}, {"image": "assets/comics/arc1/ch13-debt-collector.webp", "crop": [0, 0.285, 0.4, 0.235], "text": "\"You could have told us.\" \"I was investigating first.\" \"You could have been killed.\" \"So could you.\" \"That is different.\" \"Why?\"", "caption": "Aisyah's way."}, {"image": "assets/comics/arc1/ch13-debt-collector.webp", "crop": [0.4, 0.285, 0.6, 0.235], "text": "\"Aisyah, you think you can run?\" \"Where did she go?\" \"She does that.\" \"How do you know?\" \"She did it three times today.\" \"Right behind you.\"", "caption": "The trap."}, {"image": "assets/comics/arc1/ch13-debt-collector.webp", "crop": [0, 0.515, 0.5, 0.205], "text": "San controls the field. Joel protects the crew. Aisyah strikes where it counts.", "caption": "Three against the collector."}, {"image": "assets/comics/arc1/ch13-debt-collector.webp", "crop": [0.5, 0.515, 0.5, 0.205], "text": "\"You signed nothing.\" \"Then why are you afraid?\" \"I am not.\" \"I am annoyed.\" \"Exactly.\"", "caption": "The debt collector."}, {"image": "assets/comics/arc1/ch13-debt-collector.webp", "crop": [0, 0.725, 0.47, 0.26], "text": "\"You could have been killed.\" \"That is different.\" \"Why?\" \"Because you are my sister.\" \"Then I suppose you should stop trying to die.\" \"You too.\"", "caption": "Sisters."}, {"image": "assets/comics/arc1/ch13-debt-collector.webp", "crop": [0.47, 0.725, 0.53, 0.26], "text": "The debt collector had lost, but his ledger was not empty. Someone had been writing these names for a long time. The sister remembered nothing. One sister remembered even less. But both of them knew one thing: they were going home together.", "caption": "The debt remains."}],
    14:[{"image": "assets/comics/arc1/ch14-two-sisters-one-ship.webp", "crop": [0.2, 0, 0.34, 0.23], "text": "Blood remembers in ways minds do not. \"The sea is calmer today.\" \"Or maybe we are.\" \"Maybe both.\"", "caption": "A quieter morning."}, {"image": "assets/comics/arc1/ch14-two-sisters-one-ship.webp", "crop": [0.54, 0, 0.46, 0.23], "text": "\"Too much salt.\" \"You cook like a captain, not a sister.\" \"At least I do not burn everything.\" Joel has learned that some battles are best left unjoined.", "caption": "Small things."}, {"image": "assets/comics/arc1/ch14-two-sisters-one-ship.webp", "crop": [0.2, 0.235, 0.33, 0.195], "text": "\"Sit. Answer honestly.\" \"This feels like a trap.\" \"It is. That is why you will answer.\"", "caption": "Older sisters, older weapons."}, {"image": "assets/comics/arc1/ch14-two-sisters-one-ship.webp", "crop": [0.53, 0.235, 0.47, 0.195], "text": "\"How long have you been following her?\" \"Do you look at her when she is not looking?\" \"I... on my duty.\" \"Sometimes.\" \"That is not an answer.\" Aisyah does not need evidence. She needs truth, and she usually finds both.", "caption": "The interrogation."}, {"image": "assets/comics/arc1/ch14-two-sisters-one-ship.webp", "crop": [0, 0.43, 0.46, 0.19], "text": "\"That is enough.\" \"I am merely efficient.\" \"You are terrifying.\" \"I am her first mate!\" \"Not her second trial!\"", "caption": "San intervenes."}, {"image": "assets/comics/arc1/ch14-two-sisters-one-ship.webp", "crop": [0.46, 0.43, 0.54, 0.19], "text": "\"You know... you look a little like me.\" \"Just a little.\" \"You mean except for everything?\" \"Not twins. Not the same. But enough to feel familiar.\" \"Yeah. Just a little.\"", "caption": "Sisters."}, {"image": "assets/comics/arc1/ch14-two-sisters-one-ship.webp", "crop": [0, 0.62, 0.48, 0.17], "text": "\"No matter what happens. We look out for each other.\" \"Always.\"", "caption": "Promises."}, {"image": "assets/comics/arc1/ch14-two-sisters-one-ship.webp", "crop": [0.48, 0.62, 0.52, 0.17], "text": "\"I did not sign up to be captain.\" \"I know.\" \"It means you tolerate me.\" \"For now.\" \"I signed up to survive two sisters.\"", "caption": "Joel's conclusion."}, {"image": "assets/comics/arc1/ch14-two-sisters-one-ship.webp", "crop": [0, 0.79, 0.5, 0.195], "text": "The Crimson Tide is no longer just a ship. It is becoming a home again. Three hearts, three strengths, three reasons to keep sailing.", "caption": "One ship, stronger crew."}, {"image": "assets/comics/arc1/ch14-two-sisters-one-ship.webp", "crop": [0.5, 0.79, 0.5, 0.195], "text": "The sea still holds many names, many truths, many debts yet to be settled. But now, no one sails alone.", "caption": "Next horizon."}],
    15:[{"image": "assets/comics/arc1/ch15-one-who-stayed.webp", "crop": [0, 0.0, 1, 0.3458], "text": "Eliz chooses the crew because they prove they need her—and because she chooses to stay.", "caption": "The One Who Stayed"}, {"image": "assets/comics/arc1/ch15-one-who-stayed.webp", "crop": [0, 0.3458, 1, 0.2295], "text": "The story continues through the scene above. Tap to continue.", "caption": "The One Who Stayed"}, {"image": "assets/comics/arc1/ch15-one-who-stayed.webp", "crop": [0, 0.5753, 1, 0.4247], "text": "The story continues through the scene above. Tap to continue.", "caption": "The One Who Stayed"}],
    16:[{"image": "assets/comics/arc1/ch16-mark-we-carried.webp", "crop": [0, 0.0, 1, 0.2905], "text": "Three matching gem-like pendants are noticed for what they are: a mystery, not an answer.", "caption": "The Mark We Carried"}, {"image": "assets/comics/arc1/ch16-mark-we-carried.webp", "crop": [0, 0.2905, 1, 0.4508], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Mark We Carried"}, {"image": "assets/comics/arc1/ch16-mark-we-carried.webp", "crop": [0, 0.7413, 1, 0.2587], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Mark We Carried"}],
    17:[{"image": "assets/comics/arc1/ch17-things-we-do-without-knowing.webp", "crop": [0, 0.0, 1, 0.2994], "text": "The crew falls into familiar roles even though none of them remembers why.", "caption": "The Things We Do Without Knowing"}, {"image": "assets/comics/arc1/ch17-things-we-do-without-knowing.webp", "crop": [0, 0.2994, 1, 0.4484], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Things We Do Without Knowing"}, {"image": "assets/comics/arc1/ch17-things-we-do-without-knowing.webp", "crop": [0, 0.7478, 1, 0.2522], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Things We Do Without Knowing"}],
    18:[{"image": "assets/comics/arc1/ch18-mezstorm-rescue.webp", "crop": [0, 0.0, 1, 0.2344], "text": "Mezstorm’s rescue leaves a deeper question: what does regeneration mean when identity itself can shift?", "caption": "The Storm That Was Owed"}, {"image": "assets/comics/arc1/ch18-mezstorm-rescue.webp", "crop": [0, 0.2344, 1, 0.3222], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Storm That Was Owed"}, {"image": "assets/comics/arc1/ch18-mezstorm-rescue.webp", "crop": [0, 0.5566, 1, 0.1524], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Storm That Was Owed"}, {"image": "assets/comics/arc1/ch18-mezstorm-rescue.webp", "crop": [0, 0.709, 1, 0.291], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Storm That Was Owed"}],
    19:[{"image": "assets/comics/arc1/ch19-crew-we-choose.webp", "crop": [0, 0.0, 1, 0.25], "text": "Mezstorm finds her place aboard the Crimson Tide through scenes with the people already aboard.", "caption": "The Crew We Choose"}, {"image": "assets/comics/arc1/ch19-crew-we-choose.webp", "crop": [0, 0.25, 1, 0.2669], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Crew We Choose"}, {"image": "assets/comics/arc1/ch19-crew-we-choose.webp", "crop": [0, 0.5169, 1, 0.2989], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Crew We Choose"}, {"image": "assets/comics/arc1/ch19-crew-we-choose.webp", "crop": [0, 0.8158, 1, 0.1842], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Crew We Choose"}],
    20:[{"image": "assets/comics/arc1/ch20-senedra.webp", "crop": [0, 0.0, 1, 0.4095], "text": "The woman at the lighthouse is finally brought into the crew’s story—but not because someone defeated her guardian.", "caption": "Senedra — The Watchful Signal"}, {"image": "assets/comics/arc1/ch20-senedra.webp", "crop": [0, 0.4095, 1, 0.1901], "text": "The story continues through the scene above. Tap to continue.", "caption": "Senedra — The Watchful Signal"}, {"image": "assets/comics/arc1/ch20-senedra.webp", "crop": [0, 0.5996, 1, 0.1563], "text": "The story continues through the scene above. Tap to continue.", "caption": "Senedra — The Watchful Signal"}, {"image": "assets/comics/arc1/ch20-senedra.webp", "crop": [0, 0.7559, 1, 0.2441], "text": "The story continues through the scene above. Tap to continue.", "caption": "Senedra — The Watchful Signal"}],
    21:[{"image": "assets/comics/arc1/ch21-zaki.webp", "crop": [0, 0.0, 1, 0.2362], "text": "Zaki’s prison-hulk survival reveals the careful planner beneath the fighter.", "caption": "Zaki — The Planner"}, {"image": "assets/comics/arc1/ch21-zaki.webp", "crop": [0, 0.2362, 1, 0.2967], "text": "The story continues through the scene above. Tap to continue.", "caption": "Zaki — The Planner"}, {"image": "assets/comics/arc1/ch21-zaki.webp", "crop": [0, 0.5329, 1, 0.2036], "text": "The story continues through the scene above. Tap to continue.", "caption": "Zaki — The Planner"}, {"image": "assets/comics/arc1/ch21-zaki.webp", "crop": [0, 0.7365, 1, 0.2635], "text": "The story continues through the scene above. Tap to continue.", "caption": "Zaki — The Planner"}],
    22:[{"image": "assets/comics/arc1/ch22-mezstorm.webp", "crop": [0, 0.0, 1, 0.1975], "text": "Mezstorm confronts the strange regeneration and transformation that make her different in Crimson Tide.", "caption": "Mezstorm — The Regeneration"}, {"image": "assets/comics/arc1/ch22-mezstorm.webp", "crop": [0, 0.1975, 1, 0.2236], "text": "The story continues through the scene above. Tap to continue.", "caption": "Mezstorm — The Regeneration"}, {"image": "assets/comics/arc1/ch22-mezstorm.webp", "crop": [0, 0.4211, 1, 0.3242], "text": "The story continues through the scene above. Tap to continue.", "caption": "Mezstorm — The Regeneration"}, {"image": "assets/comics/arc1/ch22-mezstorm.webp", "crop": [0, 0.7453, 1, 0.2547], "text": "The story continues through the scene above. Tap to continue.", "caption": "Mezstorm — The Regeneration"}],
    23:[{"image": "assets/comics/arc1/ch23-siblings.webp", "crop": [0, 0.0, 1, 0.2259], "text": "Senedra and Zaki remember each other as siblings, but not Aisyah, San, Mezstorm, or Eliz.", "caption": "The Two Who Remembered"}, {"image": "assets/comics/arc1/ch23-siblings.webp", "crop": [0, 0.2259, 1, 0.446], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Two Who Remembered"}, {"image": "assets/comics/arc1/ch23-siblings.webp", "crop": [0, 0.6719, 1, 0.3281], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Two Who Remembered"}],
    24:[{"image": "assets/comics/arc1/ch24-drowned-passage.webp", "crop": [0, 0.0, 1, 0.4029], "text": "Aldric and Wren join the reunited crew as the Drowned Admiral guards the way beyond the charts.", "caption": "The Drowned Passage"}, {"image": "assets/comics/arc1/ch24-drowned-passage.webp", "crop": [0, 0.4029, 1, 0.3305], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Drowned Passage"}, {"image": "assets/comics/arc1/ch24-drowned-passage.webp", "crop": [0, 0.7334, 1, 0.2666], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Drowned Passage"}]
  };
  Object.keys(arc1PanelDefs).forEach(id => {
    const n=Number(id);
    if (typeof STORY_MODE_CHAPTERS !== 'undefined') STORY_MODE_CHAPTERS[n]=arc1PanelDefs[id];
  });

  const originalRenderStoryModePanel = window.renderStoryModePanel;
  window.renderStoryModePanel = function(){
    if(!storyModeChapter) return;
    const p=storyModeChapter[storyModeIndex];
    const panel=document.getElementById('storyModePanel');
    const counter=document.getElementById('storyModeCounter');
    if(!panel||!p) return;
    if(p.crop){
      // Rewritten crop renderer. The original used an absolutely-positioned
      // <img> with height:auto inside a percentage-height containing block —
      // percentage heights on absolutely positioned replaced elements are
      // only well-defined when the containing block has an explicit height,
      // and aspect-ratio-derived height doesn't reliably count as one across
      // browsers, so the image never actually zoomed and every panel in a
      // chapter showed nearly the same top sliver of the artwork. Using
      // background-size/background-position percentages instead avoids that
      // ambiguity entirely — both always resolve against the element's own
      // box, with no containing-block dependency.
      const [x,y,w,h]=p.crop;
      const bgSizeX = (100/w)+'%', bgSizeY = (100/h)+'%';
      const bgPosX = w>=1 ? '0%' : ((x/(1-w))*100)+'%';
      const bgPosY = h>=1 ? '0%' : ((y/(1-h))*100)+'%';
      const frameId = 'ctCropFrame'+Date.now();
      panel.innerHTML =
        '<div id="'+frameId+'" class="ct-v62-crop-frame" role="img" aria-label="Chapter '+storyModeChapterId+' story panel '+(storyModeIndex+1)+'" '+
        'style="width:100%;aspect-ratio:'+w+'/'+h+';background-color:#000;background-repeat:no-repeat;'+
        'background-image:url(\''+p.image+'\');background-size:'+bgSizeX+' '+bgSizeY+';background-position:'+bgPosX+' '+bgPosY+';">' +
        '</div><div class="story-mode-text"><div class="story-mode-speaker">'+esc(p.caption)+'</div><div class="story-mode-caption">'+esc(p.text)+'</div></div>' +
        '<div class="story-mode-tap">Tap the screen to continue</div>';
      if(counter) counter.textContent=(storyModeIndex+1)+' / '+storyModeChapter.length;
      window.scrollTo({top:0,left:0,behavior:'instant'});
      // The frame's own aspect-ratio uses the crop's raw w/h fraction as a
      // placeholder (correct only if the source image happens to be square).
      // Once the real image dimensions are known, correct it to the true
      // pixel aspect ratio of the cropped region so the frame itself isn't
      // stretched or squashed relative to the source art.
      const probe = new Image();
      probe.onload = function(){
        const frameEl = document.getElementById(frameId);
        if(!frameEl || !probe.naturalWidth || !probe.naturalHeight) return;
        const trueRatio = (w*probe.naturalWidth) / (h*probe.naturalHeight);
        frameEl.style.aspectRatio = trueRatio;
      };
      probe.src = p.image;
      return;
    }
    if(originalRenderStoryModePanel) return originalRenderStoryModePanel();
  };

  /* The new story chain deliberately uses the live game state as the source of truth.
     Chapters 5–24 remain sequential, while the three major rescue encounters are
     explicitly gated just like Joel. */
  const oldObjectiveState = window.objectiveState;
  window.objectiveState = function(){
    if(!game) return oldObjectiveState ? oldObjectiveState() : null;
    if(!game.comicProgress?.[1]) return 'begin_chapter_1';
    if(level()<5) return 'reach_level_5';
    if(!game.foundCompanions?.joel){
      // Reconciliation guard: Joel can be recruited directly via the guardian
      // fight, out of order with Chapters 2-4 (this path already exists in
      // the base game). Without this, foundCompanions.joel flipping true
      // early would permanently skip past 2-4 below with no way back, since
      // this whole branch is only ever checked while joel is still unfound.
      if(game.foundCompanions?.joel === undefined) game.foundCompanions = game.foundCompanions||{};
      if(game.location!=='malacca') return 'sail_malacca';
      if(!game.comicProgress?.[2]) return 'complete_chapter_2';
      if(!game.temporaryCrew?.length) return 'recruit_crew';
      if(!game.comicProgress?.[3]) return 'complete_chapter_3';
      if(!game.malaccaPrepStep) return 'plan_with_crew';
      if(game.malaccaPrepStep===1) return 'talk_to_joel';
      if(game.malaccaPrepStep===2) return 'change_plan';
      if(!game.comicProgress?.[4]) return 'complete_chapter_4';
      // The approach (5) and the rescue (6) are told first; the Wreck Warden fight follows.
      if(!game.comicProgress?.[5]) return 'complete_chapter_5';
      if(!game.comicProgress?.[6]) return 'complete_chapter_6';
      return 'recruit_joel';
    } else if(!game.comicProgress?.[2] || !game.comicProgress?.[3] || !game.comicProgress?.[4]) {
      // Joel was found before finishing 2-4 (e.g. direct guardian fight).
      // Patch those chapters closed instead of leaving them stuck forever.
      game.comicProgress[2]=true; game.comicProgress[3]=true; game.comicProgress[4]=true;
      if(!game.malaccaPrepStep) game.malaccaPrepStep=3;
      if(typeof saveGame==='function') saveGame();
    }
    // Chapters 5-8 (Joel's own arc — first meeting, rescue, aftermath, and
    // the search's close) previously had no gate anywhere in this chain
    // either, same bug as 14/16/17 below: reachable via requestStoryMode's
    // own guard, but never actually requested by objectiveState(), so
    // never surfaced as CURRENT and stayed permanently locked in the UI.
    if(!game.comicProgress?.[5]) return 'complete_chapter_5';
    if(!game.comicProgress?.[6]) return 'complete_chapter_6';
    if(!game.comicProgress?.[7]) return 'complete_chapter_7';
    if(!game.comicProgress?.[8]) return 'complete_chapter_8';
    if(!game.foundCompanions?.aisyah){
      if(game.location!=='palembang') return 'sail_palembang';
      if(!game.comicProgress?.[9]) return 'complete_chapter_9';
      if(!game.comicProgress?.[10]) return 'complete_chapter_10';
      if(!game.comicProgress?.[11]) return 'complete_chapter_11';
      if(!game.comicProgress?.[12]) return 'complete_chapter_12';
      if(!game.comicProgress?.[13]) return 'complete_chapter_13';
      return 'rescue_aisyah';
    } else if(!game.comicProgress?.[9] || !game.comicProgress?.[10] || !game.comicProgress?.[11] || !game.comicProgress?.[12] || !game.comicProgress?.[13]) {
      // Aisyah found before finishing 9-13 (e.g. direct guardian fight, or an
      // older save). Patch those chapters closed instead of leaving them
      // stuck forever — same reconciliation as Joel's chain above.
      game.comicProgress[9]=true; game.comicProgress[10]=true; game.comicProgress[11]=true;
      game.comicProgress[12]=true; game.comicProgress[13]=true;
      if(typeof saveGame==='function') saveGame();
    }
    // Chapters 14, 16, 17 previously had no gate anywhere in this chain and
    // were unreachable through normal play despite having full art+panels.
    // They sit narratively after Aisyah joins and before the Eliz arc.
    if(!game.comicProgress?.[14]) return 'complete_chapter_14';
    if(!game.comicProgress?.[16]) return 'complete_chapter_16';
    if(!game.comicProgress?.[17]) return 'complete_chapter_17';
    if(!game.foundCompanions?.eliz){
      if(game.location!=='batavia') return 'sail_batavia';
      if(!game.comicProgress?.[15]) return 'complete_chapter_15';
      return 'rescue_eliz';
    } else if(!game.comicProgress?.[15]) {
      // Same reconciliation as above: Eliz found before Chapter 15 closed.
      game.comicProgress[15]=true;
      if(typeof saveGame==='function') saveGame();
    }
    if(!game.foundCompanions?.mezstorm){
      if(game.location!=='bangkok') return 'sail_bangkok';
      if(!game.comicProgress?.[18]) return 'complete_chapter_18';
      return 'rescue_mezstorm';
    } else if(!game.comicProgress?.[18]) {
      // Same reconciliation again: Mezstorm found before Chapter 18 closed.
      game.comicProgress[18]=true;
      if(typeof saveGame==='function') saveGame();
    }
    // Senedra and Zaki join together with Chapter 23 (also repairs saves that
    // finished it before joining was wired).
    if(game.comicProgress?.[23]) joinSenedraAndZaki();
    if(!game.comicProgress?.[19]) return 'complete_chapter_19';
    if(!game.comicProgress?.[20]) return 'complete_chapter_20';
    if(!game.comicProgress?.[21]) return 'complete_chapter_21';
    if(!game.comicProgress?.[22]) return 'complete_chapter_22';
    if(!game.comicProgress?.[23]) return 'complete_chapter_23';
    if(!game.comicProgress?.[24]) return 'complete_chapter_24';
    return 'continue_voyage';
  };

  const oldRequestStoryMode = window.requestStoryMode;
  window.requestStoryMode = function(chapterId,delay=450){
    const id=Number(chapterId);
    const required={
      5:'complete_chapter_5',6:'complete_chapter_6',7:'complete_chapter_7',8:'complete_chapter_8',
      9:'complete_chapter_9',10:'complete_chapter_10',11:'complete_chapter_11',12:'complete_chapter_12',
      13:'complete_chapter_13',14:'complete_chapter_14',15:'complete_chapter_15',16:'complete_chapter_16',
      17:'complete_chapter_17',18:'complete_chapter_18',19:'complete_chapter_19',20:'complete_chapter_20',
      21:'complete_chapter_21',22:'complete_chapter_22',23:'complete_chapter_23',24:'complete_chapter_24'
    }[id];
    if(required && !game.comicProgress?.[id] && objectiveState()!==required){
      toast('🔒 Follow the current Objective first.');
      return;
    }
    if(game.comicProgress?.[id]) return;
    return oldRequestStoryMode ? oldRequestStoryMode(id,delay) : null;
  };

  const oldFinishStoryModeChapter = window.finishStoryModeChapter;
  window.finishStoryModeChapter = function(id){
    if(Number(id)>=5){
      game.comicProgress=game.comicProgress||{};
      const ch=ARC1_COMICS.find(x=>x.id===Number(id));
      if(ch && !game.comicProgress[id]){
        game.comicProgress[id]=true;
        gainXP(ch.xp); game.reputation=(game.reputation||0)+1;
        logEvent('📖 Story Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
        const nextMap={
          5:'complete_chapter_6',6:'complete_chapter_7',7:'complete_chapter_8',
          8:'sail_palembang',9:'complete_chapter_10',10:'complete_chapter_11',
          11:'complete_chapter_12',12:'complete_chapter_13',13:'complete_chapter_14',
          14:'complete_chapter_16',15:'rescue_eliz',16:'complete_chapter_17',
          17:'sail_batavia',18:'rescue_mezstorm',19:'complete_chapter_20',
          20:'complete_chapter_21',21:'complete_chapter_22',22:'complete_chapter_23',
          23:'complete_chapter_24',24:'continue_voyage'
        };
        if(Number(id)===23) joinSenedraAndZaki();
        // Chapter 6 hands over to the Wreck Warden fight when Joel is not yet aboard.
        const nextObj=(Number(id)===6 && !game.foundCompanions?.joel) ? 'recruit_joel' : (nextMap[id]||'continue_voyage');
        if(typeof setArc1Objective==='function') setArc1Objective(nextObj,ch.title);
        else game.arc1Objective=nextObj;
        saveGameQuiet();
      }
      /* Reuse the existing V61 completion screen safely by calling the original
         only for its UI mechanics would duplicate its objective handling, so render
         a compact equivalent here. */
      const overlay=document.getElementById('storyModeOverlay');
      const shell=overlay?.querySelector('.story-mode-shell');
      if(shell){
        shell.innerHTML='<div class="story-mode-end"><div class="story-mode-kicker">Chapter Complete</div><h2>'+esc(ch?.title||('Chapter '+id))+'</h2><p>The chapter is complete. Your current Objective is now updated.</p><div style="color:var(--gold);font-family:Cinzel;margin-bottom:18px;">📖 Story XP +'+(ch?.xp||35)+'</div><button id="storyModeCloseBtn" type="button" class="btn btn-success" onclick="continueStoryFlow('+id+'); return false;">CONTINUE</button></div>';
      }
      return;
    }
    return oldFinishStoryModeChapter ? oldFinishStoryModeChapter(id) : null;
  };

  /* Guardian gate wrapper. Keep optional Senedra/Zaki rematches intact. */
  const oldStartGuardianFight=window.startGuardianFight;
  window.startGuardianFight=function(portId){
    if(portId==='palembang' && !game.foundCompanions?.aisyah && objectiveState()!=='rescue_aisyah'){
      toast('🔒 The Debt Collector is locked. Complete the current Objective first.'); return;
    }
    if(portId==='batavia' && !game.foundCompanions?.eliz && objectiveState()!=='rescue_eliz'){
      toast('🔒 The Plague Hulk is locked. Complete the current Objective first.'); return;
    }
    if(portId==='bangkok' && !game.foundCompanions?.mezstorm && objectiveState()!=='rescue_mezstorm'){
      toast('🔒 The Storm Idol is locked. Complete the current Objective first.'); return;
    }
    return oldStartGuardianFight ? oldStartGuardianFight(portId) : null;
  };

  /* Arrival objectives for the three rescue ports. */
  const oldTriggerArrivalStory=window.triggerArrivalStory;
  window.triggerArrivalStory=function(portId){
    if(portId==='palembang' && !game.foundCompanions?.aisyah){
      setArc1Objective('complete_chapter_9','reached Palembang');
      renderMainGoal(); renderStory(); saveGameQuiet(); return;
    }
    if(portId==='batavia' && !game.foundCompanions?.eliz){
      setArc1Objective('complete_chapter_15','reached Batavia');
      renderMainGoal(); renderStory(); saveGameQuiet(); return;
    }
    if(portId==='bangkok' && !game.foundCompanions?.mezstorm){
      setArc1Objective('complete_chapter_18','reached Bangkok');
      renderMainGoal(); renderStory(); saveGameQuiet(); return;
    }
    return oldTriggerArrivalStory ? oldTriggerArrivalStory(portId) : null;
  };

  /* Expand Story tab to the complete Arc I list. */
  const oldRenderStory=window.renderStory;
  window.renderStory=function(){
    const container=document.getElementById('storyContent');
    if(!container || typeof ARC1_COMICS==='undefined') return oldRenderStory ? oldRenderStory() : null;
    const so=objectiveState();
    let html='<section class="story-act story-quest-panel"><div class="story-act-header"><div class="story-act-kicker">Arc I</div><div class="story-act-title">The First Voyage</div><div class="story-act-tagline">24 story chapters. Manual Story Mode. Your Objective determines what is ready.</div></div>';
    ARC1_COMICS.forEach(ch=>{
      const done=!!game.comicProgress?.[ch.id];
      // Chapter 1 is a special case: objectiveState() names its "ready" state
      // 'begin_chapter_1', not 'complete_chapter_1' like every other chapter.
      // Comparing it against the generic 'complete_chapter_N' pattern meant
      // Chapter 1 could never match and always rendered as locked, even at
      // the very start of a new game.
      const requiredState = ch.id===1 ? 'begin_chapter_1' : ('complete_chapter_'+ch.id);
      const ready=!done && so===requiredState;
      const special=(ch.id===13&&!game.foundCompanions?.aisyah)?'RESCUE NEXT':(ch.id===15&&!game.foundCompanions?.eliz)?'RESCUE NEXT':(ch.id===18&&!game.foundCompanions?.mezstorm)?'RESCUE NEXT':'';
      const status=done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      const action=ready?'<button class="btn btn-small btn-success" onclick="requestStoryMode('+ch.id+',80)">READ CHAPTER</button>':special?'<div class="story-chip">Prepare for the rescue objective.</div>':'<div class="story-chip">Follow the current Objective.</div>';
      html+='<article class="quest-item '+(done?'completed':'')+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br><span style="font-size:.82rem;opacity:.82;">'+esc(ch.tag)+'</span><br><span style="font-size:.78rem;">'+status+'</span><div class="story-actions">'+action+'</div></article>';
    });
    html+='</section>';
    container.innerHTML=html;
  };
})();
