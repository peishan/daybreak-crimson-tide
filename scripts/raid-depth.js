(function(){
  // -------------------------------------------------------------------
  // RAID DEPTH -- per San: raid mode needed more stages. Every existing
  // raid goes from 3 stages to 5 by inserting two new elite stages before
  // the boss, with a mid-raid CHECKPOINT after stage 3 (see raid-mode.js:
  // rest for Fair Tide Food, or press on with the usual 25% recovery).
  // Three new five-stage raids follow the Crimson Horizon gates, each
  // unlocking by level AND by the chapter it draws on, so no raid name
  // runs ahead of the story.
  //
  // New stage stats are interpolated between the raid's last existing
  // elite and its boss, so each raid's curve stays smooth. All enemy
  // names and descriptions here are provisional flavor: nothing in them
  // is canon, they are themes (a false light, a hidden passage, a gate
  // that answers) rather than named characters.
  // -------------------------------------------------------------------
  const RAIDS = window.RAIDS;
  if (!RAIDS || RAIDS.__depthApplied) return;
  RAIDS.__depthApplied = true;

  function lerp(a, b, t){ return Math.round(a + (b - a) * t); }
  function between(lo, hi, t, extra){
    return Object.assign({ type: 'elite',
      hp: lerp(lo.hp, hi.hp, t), dmg: lerp(lo.dmg, hi.dmg, t), xp: lerp(lo.xp, hi.xp, t), gold: lerp(lo.gold, hi.gold, t) }, extra);
  }

  // Two new elites per existing raid, inserted before the boss.
  const NEW_STAGES = {
    guardian_trial: [
      { key: 'trial_of_patience', name: 'Trial of Patience', art: '⏱️', desc: "The Guardian is in no hurry. Neither, it turns out, is anything it leaves behind." },
      { key: 'trial_of_resolve', name: 'Trial of Resolve', art: '🔥', desc: "What is left once the first trials have taken what they came for." }
    ],
    captains_unending: [
      { key: 'the_borrowed_flag', name: 'The Borrowed Flag', art: '🏴', desc: "A flag the crew half recognizes, flown by someone who clearly has no idea whose it was." },
      { key: 'a_wheel_with_no_hands', name: 'A Wheel With No Hands', art: '🧭', desc: "The ship steers itself, and it is steering at them." }
    ],
    archive_depths: [
      { key: 'the_misfiled', name: 'The Misfiled', art: '🗃️', desc: "A record left in the wrong drawer for so long it has started to resent the right one." },
      { key: 'the_sealed_index', name: 'The Sealed Index', art: '🔏', desc: "Whatever keeps the rest of the list closed is not happy to be asked." }
    ],
    five_harbours_reckoning: [
      { key: 'a_favor_called_in', name: 'A Favor Called In', art: '🤝', desc: "All five harbours asked at once, and what answers is not polite." },
      { key: 'the_weight_of_trust', name: 'The Weight of Trust', art: '⚖️', desc: "Trust earned one honest relationship at a time, collected all at once." }
    ],
    beyond_every_door: [
      { key: 'a_second_door', name: 'A Second Door', art: '🚪', desc: "It opens where the first one closed. That should not be possible." },
      { key: 'the_corridor_that_listens', name: 'The Corridor That Listens', art: '👂', desc: "Nothing in it moves. Everything in it is paying attention." }
    ],
    where_every_tide_meets: [
      { key: 'the_tide_that_returns', name: 'The Tide That Returns', art: '🌊', desc: "Something the crew already survived, coming back from a different angle." },
      { key: 'every_thread_pulled', name: 'Every Thread Pulled', art: '🧶', desc: "The last of what was holding the others together." }
    ]
  };

  RAIDS.forEach(function(raid){
    const add = NEW_STAGES[raid.id];
    if (!add || raid.stages.length !== 3) return;
    const lo = raid.stages[1], boss = raid.stages[2];
    raid.stages.splice(2, 0, between(lo, boss, 0.35, add[0]), between(lo, boss, 0.7, add[1]));
    raid.stages.forEach(function(st, i){ st.id = i + 1; });
    raid.checkpointAfter = 3;
  });

  // Three new raids, one per sequel gate. Stages are scaled from each
  // raid's boss numbers by fixed ratios.
  const HP_R = [0.58, 0.69, 0.80, 0.90, 1.0], DMG_R = [0.71, 0.79, 0.87, 0.93, 1.0];
  function build(bossStats, defs){
    return defs.map(function(d, i){
      return {
        id: i + 1, type: i === defs.length - 1 ? 'boss' : 'elite', key: d.key, name: d.name, art: d.art, desc: d.desc,
        hp: Math.round(bossStats.hp * HP_R[i]), dmg: Math.round(bossStats.dmg * DMG_R[i]),
        xp: Math.round(bossStats.xp * HP_R[i]), gold: Math.round(bossStats.gold * HP_R[i])
      };
    });
  }
  function cp(id){ return !!(game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[id]); }

  RAIDS.push(
    {
      id: 'the_light_that_isnt', name: "The Light That Isn't", icon: '🏮', unlockLevel: 560,
      requires: function(){ return cp(49); }, requiresText: 'Finish Crimson Horizon Chapter 048',
      desc: "The Mist Straits taught the crew that a light is not always a way home. This is what is left of the lesson.",
      checkpointAfter: 3,
      stages: build({ hp: 30000, dmg: 240, xp: 30000, gold: 18000 }, [
        { key: 'the_moving_lantern', name: 'The Moving Lantern', art: '🏮', desc: "It drifts against the current, exactly the way the first one did." },
        { key: 'the_wrong_rhythm_again', name: 'The Wrong Rhythm, Again', art: '🔔', desc: "Three short, a double pause, a long. Close enough to fool anyone approaching in fog." },
        { key: 'echoes_of_the_grounded', name: 'Echoes of the Grounded', art: '👻', desc: "Ships that followed a light and never left the shoal." },
        { key: 'the_fog_pilot', name: 'The Fog Pilot', art: '🌫️', desc: "It knows every signal, and it answers all of them." },
        { key: 'the_false_channel', name: 'The False Channel', art: '🕯️', desc: "A whole route that was never there, and wants a convoy." }
      ])
    },
    {
      id: 'the_passage_in_the_cliff', name: 'The Passage in the Cliff', icon: '⚓', unlockLevel: 620,
      requires: function(){ return cp(65); }, requiresText: 'Finish Crimson Horizon Chapter 064',
      desc: "A hidden berth, a rope pulled taut into water too deep for any dock, and a gate that was never meant to open for the wrong hands.",
      checkpointAfter: 3,
      stages: build({ hp: 38000, dmg: 275, xp: 38000, gold: 23000 }, [
        { key: 'the_taut_line', name: 'The Taut Line', art: '🪢', desc: "It leads somewhere. Everything on it is already waiting." },
        { key: 'the_tender_in_the_dark', name: 'The Tender in the Dark', art: '🛶', desc: "No lamp, no sound, and it knows the way in." },
        { key: 'the_haulage_lift', name: 'The Haulage Lift', art: '⛓️', desc: "Old machinery, built to rescue people, doing something else entirely." },
        { key: 'the_flooded_stairs', name: 'The Flooded Stairs', art: '🌊', desc: "Get everyone above the flood line. Then the gate." },
        { key: 'the_gate_beneath', name: 'The Gate Beneath', art: '🚪', desc: "It has been shut a long time. It would like to stay that way." }
      ])
    },
    {
      id: 'what_answered_first', name: 'What Answered First', icon: '🧭', unlockLevel: 680,
      requires: function(){ return cp(66); }, requiresText: 'Finish Crimson Horizon Chapter 065',
      desc: "The Central Gate answered before the crew had asked. Whatever did that is still out there.",
      checkpointAfter: 3,
      stages: build({ hp: 48000, dmg: 320, xp: 48000, gold: 29000 }, [
        { key: 'the_first_marker', name: 'The First Marker', art: '🗿', desc: "The crew was still short of it when the signal came back." },
        { key: 'a_lantern_that_knows_you', name: 'A Lantern That Knows You', art: '🏮', desc: "It lights as the Crimson Tide passes, and it lights in the right order." },
        { key: 'the_stone_mouth', name: 'The Stone Mouth', art: '🕳️', desc: "A wide gate with the tide running through it, and something standing in the current." },
        { key: 'the_answer_before_the_asking', name: 'The Answer Before the Asking', art: '📡', desc: "It replies to questions the crew has not worked out how to put." },
        { key: 'what_answered', name: 'What Answered', art: '🧭', desc: "Not hostile, exactly. Just certain the crew was coming." }
      ])
    }
  );
})();
