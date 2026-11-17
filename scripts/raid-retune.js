(function(){
  // -------------------------------------------------------------------
  // RAID RETUNE. The raids were tuned to HP and damage that a party cannot
  // meet: past Level 167 HP and MP stop growing and a basic attack does about
  // 26 damage, against raid stages of 14,000-48,000 HP hitting for 200-400,
  // so they could only be won by the unkillable pair grinding it out for
  // hundreds of actions. Now that a raid stage is lost once everyone who can
  // fall is down, they have to be beatable by the party.
  //
  // Each raid keeps its stage shape (how the stages climb to the boss) and
  // rewards; only the boss's HP and damage are set, and every stage scales
  // with them. Because the party stops growing, difficulty climbs through
  // damage and through what gear the party brings. Checked by simulating
  // whole raids (auto-battle, seven fielded members, 25% recovery between
  // stages, a full rest at the checkpoint, 16 runs each), win rate by gear:
  //
  //   raid (Level)            no gear   mid gear   best gear
  //   Guardian's Trial   235   100%      100%       100%
  //   Captains            265    6%       94%       100%
  //   Archive Depths      295    0%       69%       100%
  //   Five Harbours       325    0%       25%       100%
  //   Beyond Every Door   355    0%        0%        88%
  //   Where Every Tide    385    0%       25%        88%
  //   The Light That Isn't 425   0%        6%        56%
  //   Passage in the Cliff 465   0%        0%        81%
  //   What Answered First  505   0%        0%        50%
  //
  // (mid gear = +12 attack and +12 defense on every member, best = +22 / +22.)
  // The threat readout on the raid cards (raid-mode.js) reads these numbers.
  // -------------------------------------------------------------------
  const TARGETS = {          // [boss HP, boss damage]
    guardian_trial:           [1800, 40],
    captains_unending:        [2000, 48],
    archive_depths:           [2050, 54],
    five_harbours_reckoning:  [2100, 58],
    beyond_every_door:        [2100, 62],
    where_every_tide_meets:   [2050, 70],
    the_light_that_isnt:      [2050, 74],
    the_passage_in_the_cliff: [2000, 82],
    what_answered_first:      [2000, 88]
  };
  if (!Array.isArray(window.RAIDS)) return;
  window.RAIDS.forEach(function(raid){
    const t = TARGETS[raid.id];
    if (!t || raid.__retuned || !raid.stages || !raid.stages.length) return;
    const boss = raid.stages[raid.stages.length - 1];
    const hs = t[0] / boss.hp, ds = t[1] / boss.dmg;
    raid.stages.forEach(function(st){
      st.hp = Math.max(1, Math.round(st.hp * hs));
      st.dmg = Math.max(1, Math.round(st.dmg * ds));
    });
    raid.__retuned = true;
  });
})();
