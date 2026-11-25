(function(){
  // -------------------------------------------------------------------
  // QUARRY, MINE AND NALA'S TOWER: three new Fair Tide buildings, because stone kept running out.
  //   Quarry        (Dudin)  +25% stone on every gathering run per level, and a daily stone payout (4 a level).
  //   Mine          (Jorvin) unlocks at Quarry level 3. Adds Ore (daily payout and gathering runs) and Gems (a few). Ore is needed for the higher
  //                          levels of Port HQ and the Workshop once the Mine is unlocked.
  //   Nala's Tower  (Nala)   unlocks once Nala has joined the roster. Each day she brings back a find; the higher the tower, the better the chances
  //                          of Ore or Gems.
  // Daily payouts are collected from the building's card, per game day, and credit up to 6 days at once like the other daily systems.
  // State: game.ftDaily = { quarry|mine|nala_tower: { last, msg } }. Tune: the numbers in this block.
  // -------------------------------------------------------------------
  const B = window.FT_BUILDINGS, L = window.FT_RES_LABEL, T = window.FT_TRADE_BASE;
  if (!B || !L || !T) return;
  L.ore = '⛏️ Ore'; L.gems = '💎 Gems';
  T.ore = 9; T.gems = 25;

  function lvl(k){ return (game.fairTideBuildings && game.fairTideBuildings[k]) || 0; }
  function res(){ game.fairTideResources = game.fairTideResources || {timber:0, stone:0, food:0, trade:0}; return game.fairTideResources; }
  function cap(){ return typeof window.fairTideResourceCap === 'function' ? window.fairTideResourceCap() : 999999; }
  function add(k, n){ const r = res(), before = r[k] || 0; r[k] = Math.max(before, Math.min(cap(), before + n)); return r[k] - before; }
  const NAME = { timber: 'timber', stone: 'stone', food: 'food', trade: 'trade goods', ore: 'ore', gems: 'gems' };
  const mineOpen = function(){ return lvl('quarry') >= 3 || lvl('mine') > 0; };
  window.fairTideResourceShown = function(k){ return (k === 'ore' || k === 'gems') ? (mineOpen() || (res()[k] || 0) > 0) : true; };

  B.quarry = { name: 'Quarry', icon: '⛏️', rosterKey: 'dudin', companionName: 'Dudin',
    desc: 'Dudin opens a quarry above the harbour. More stone from every gathering run (+25% a level), and a small stone payout every day.',
    cost: { timber: 25, trade: 15, food: 10 },
    tierNames: ['A Cut in the Hillside', 'Proper Faces and Ramps', 'The Quarry', 'Stone Enough for Anyone', 'Dudin\'s Quarry', 'The Second Face', 'Cut to Last', 'The Quarry That Built Fair Tide'] };
  B.mine = { name: 'Mine', icon: '🪙', rosterKey: 'jorvin', companionName: 'Jorvin',
    desc: 'Jorvin sinks a shaft behind the quarry. Ore and a few gems, from a daily payout and from gathering runs. The higher Port HQ and Workshop levels now ask for ore.',
    cost: { timber: 30, stone: 20, trade: 25 },
    gate: function(){ return mineOpen(); },
    tierNames: ['A Test Shaft', 'Timbered and Safe', 'The Mine', 'Lamps Down the Length', 'Jorvin\'s Deep Mine', 'A Second Seam', 'Veins of Everything', 'The Mine Under Fair Tide'] };
  B.nala_tower = { name: 'Nala\'s Tower', icon: '🐈', rosterKey: 'nala', companionName: 'Nala',
    desc: 'A tower made for a cat who is used to heights, built beside the lighthouse. Each day Nala brings back a find, and the higher the tower the likelier it is to be ore or gems.',
    cost: { timber: 20, trade: 15, food: 15 },
    gate: function(){ return !!(game.fairTideRoster && game.fairTideRoster.nala); },
    tierNames: ['A Place to Sit', 'A Proper Perch', 'Nala\'s Tower', 'The View From Here', 'Nala\'s Watch', 'Higher Than the Lighthouse', 'She Knows Where Everything Is', 'The Tower the Cat Chose'] };

  // gathering runs: more stone from the Quarry, and Ore and Gems from the Mine
  const oldYield = window.fairTideDispatchYield;
  if (typeof oldYield === 'function') window.fairTideDispatchYield = function(){
    const y = oldYield.apply(this, arguments);
    const q = lvl('quarry'), m = lvl('mine');
    if (q) y.stone = Math.round(y.stone * (1 + 0.25 * q));
    if (m) {
      const mult = Math.max(1, (y.timber || 4) / 4);
      y.ore = Math.round((1 + 0.5 * m) * mult);
      if (m >= 2) y.gems = 1 + Math.floor((m - 2) / 3);
    }
    return y;
  };

  // once the Mine is unlocked, Port HQ and the Workshop need a little ore for their higher levels
  const oldCost = window.fairTideBuildingCost;
  if (typeof oldCost === 'function') window.fairTideBuildingCost = function(key){
    const c = oldCost.apply(this, arguments);
    try {
      if (mineOpen()) {
        const next = (lvl(key)) + 1;
        if (key === 'port_hq' && next >= 4) c.ore = Math.ceil(next / 3);
        if (key === 'workshop' && next >= 3) c.ore = Math.ceil(next / 2);
      }
    } catch (e) {}
    return c;
  };

  // ---- daily payouts ----
  const FINDS = [
    'Nala trots in from the tower with something small in her mouth and drops it at a boot.',
    'Nala is sitting on a neat pile. She looks away, as if it has nothing to do with her.',
    'Nala has been on the lighthouse wall again. She left something on the step.',
    'Nala yawns, stretches, and pushes something off the table with great care.',
    'Nala sits in the doorway until somebody picks it up. It is not subtle.'
  ];
  function record(k){ game.ftDaily = game.ftDaily || {}; return (game.ftDaily[k] = game.ftDaily[k] || { last: -1 }); }
  window.fairTideDailyReady = function(k){ return lvl(k) > 0 && record(k).last !== game.day; };
  window.fairTideClaimDaily = function(k){
    const L0 = lvl(k); if (!L0) return;
    const rec = record(k);
    if (rec.last === game.day) { if (typeof toast === 'function') toast('Already collected today.'); return; }
    const days = rec.last < 0 ? 1 : Math.max(1, Math.min(6, game.day - rec.last));
    rec.last = game.day;
    const got = {};
    const give = function(r, n){ if (n > 0) got[r] = (got[r] || 0) + add(r, n); };
    if (k === 'quarry') give('stone', 4 * L0 * days);
    if (k === 'mine') { give('ore', 2 * L0 * days); give('gems', Math.floor(L0 * days / 3)); }
    if (k === 'nala_tower') {
      for (let d = 0; d < days; d++) {
        const rare = Math.min(0.5, 0.06 * L0);
        if (Math.random() < rare) {
          if (Math.random() < 0.4) give('gems', 1 + Math.floor(L0 / 4)); else give('ore', 2 + L0);
        } else {
          const pool = ['timber', 'stone', 'food', 'trade'];
          give(pool[Math.floor(Math.random() * pool.length)], 2 + L0);
        }
      }
    }
    const text = Object.keys(got).filter(function(r){ return got[r] > 0; }).map(function(r){ return got[r] + ' ' + NAME[r]; }).join(', ') || 'nothing new, storage is full';
    rec.msg = (k === 'nala_tower' ? FINDS[Math.floor(Math.random() * FINDS.length)] + ' ' : '') + 'Collected: ' + text + (days > 1 ? ' (' + days + ' days).' : '.');
    if (typeof toast === 'function') toast('📦 ' + text, 3200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };
  const DAILY = { quarry: 'quarry output', mine: 'mine output', nala_tower: 'Nala\'s find' };
  window.fairTideBuildingExtra = function(key){
    if (!DAILY[key] || !lvl(key)) return '';
    const rec = record(key), ready = rec.last !== game.day;
    return '<div style="margin-top:8px;border-top:1px solid rgba(255,255,255,.1);padding-top:6px;">' +
      '<button class="btn btn-small ' + (ready ? 'btn-magic' : '') + '" ' + (ready ? '' : 'disabled') + ' onclick="fairTideClaimDaily(\'' + key + '\')">' + (ready ? '📦 Collect today\'s ' + DAILY[key] : '✓ Collected today') + '</button>' +
      (rec.msg ? '<div style="font-size:.76rem;opacity:.8;margin-top:4px;">' + (typeof esc === 'function' ? esc(rec.msg) : rec.msg) + '</div>' : '') + '</div>';
  };
})();
