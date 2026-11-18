(function(){
  // -------------------------------------------------------------------
  // THE PLAYROOM -- a Fair Tide room for San and Joel to spend time with Vaeren and Joelle,
  // and the bond that goes with it.
  //
  //  * Opens once the twins are born (Arc XXXV Ch.10).
  //  * A bond track, "San, Joel & the Twins" (story and Shared Moments only, no combat bonus,
  //    like every individual bond). One bond action a day, shared with the Bonds tab:
  //    spending it from either place uses today's time. The Playroom adds +3 Fair Tide Mood.
  //  * The playroom fills up as the bond deepens: toys and things on the walls unlock by tier,
  //    and the crayon drawings the twins make are kept on the wall.
  //  * The room itself is in-person only (like the Grooming Room). Away from Fair Tide the bond
  //    can still be spent from the Bonds tab, but only while the twins are in the travelling
  //    party (remote-bonds.js), which they are from Arc XLI.
  // -------------------------------------------------------------------
  const KEY = 'san_twins';
  const TIERS = [
    { threshold: 0,    name: 'Learning Each Other',          bonus: 0 },
    { threshold: 50,   name: 'Blocks and Bedtime Stories',   bonus: 0 },
    { threshold: 150,  name: 'Their Favourite Audience',     bonus: 0 },
    { threshold: 300,  name: 'Honorary Playmates',           bonus: 0 },
    { threshold: 600,  name: 'Never Too Busy for This',      bonus: 0 },
    { threshold: 1000, name: 'Home, Wherever the Ship Is',   bonus: 0 }
  ];
  function born(){ return !!(game.comicProgress35 && game.comicProgress35[10]); }
  window.BOND_TRACKS = window.BOND_TRACKS || {};
  window.BOND_TRACKS[KEY] = {
    label: 'San, Joel & the Twins', icon: '🧸', tiers: TIERS, members: ['vaeren', 'joelle'],
    actionLabel: 'Play with Vaeren and Joelle', flavor: 'Nothing on the schedule but the two of them.',
    unlockedFn: born, lockedMessage: 'Opens once the twins are born (Arc XXXV).'
  };

  const ACTIVITIES = [
    { id: 'block_harbor', icon: '🧱', label: 'Build a Block Harbor', flavor: 'Vaeren builds the sea wall. Joelle builds the thing the sea wall is for. Soel sleeps in the middle of it, undisturbed.' },
    { id: 'story_time',   icon: '📖', label: 'Story Time',           flavor: 'One story, four requests for another. San reads the second one anyway.' },
    { id: 'draw_ship',    icon: '🖍️', label: 'Draw the Ship',        flavor: 'Crayons everywhere. The Crimson Tide comes out enormous, with two small figures at the very front.', wall: 'A crayon drawing of the Crimson Tide, with two small figures at the very front.' },
    { id: 'soel_tea',     icon: '🍵', label: "Soel's Tea Party",     flavor: 'Soel attends with great dignity, and drinks nothing, and is declared the guest of honour.' },
    { id: 'lullaby',      icon: '🌙', label: 'Lullaby at Dusk',      flavor: 'Joel hums the tune. San knows all the words and pretends she does not.' },
    { id: 'spark_play',   icon: '✨', label: 'Chase the Sparks',     flavor: 'Joelle makes a handful of light and Vaeren makes a puddle to put it out. They both consider this a fair game.' }
  ];
  window.PLAYROOM_ACTIVITIES = ACTIVITIES;
  // Things that appear in the room as the bond grows (by tier).
  const FURNISHINGS = [
    null,
    '🧱 A box of wooden blocks, with a harbor already half built.',
    '🛶 A tiny ship on the shelf with a Soel-shaped passenger.',
    '⭐ Chalk constellations on the floorboards that nobody is allowed to scrub.',
    '🏮 A small lantern the twins light by themselves, every evening.',
    '🗺️ A map of everywhere they have been, redrawn by a child, with all the monsters kind.'
  ];

  window.playWithTwins = function(activityId){
    if (!born()) return;
    const a = ACTIVITIES.find(function(x){ return x.id === activityId; }); if (!a) return;
    if (typeof window.canSpendTimeOnBond === 'function' && !window.canSpendTimeOnBond(KEY)) { toast('Already spent time with the twins today.'); return; }
    const before = window.bondState()[KEY].lastSpentDay;
    window.spendTimeWithBond(KEY, a.icon + ' ' + a.flavor);
    const after = window.bondState()[KEY].lastSpentDay;
    if (after === before) return;                                     // blocked (not aboard, etc.)
    if (typeof window.recordSharedMoment === 'function') window.recordSharedMoment(KEY, activityId);
    if (typeof window.addFairTideMood === 'function') window.addFairTideMood(3);
    if (a.wall) { game.playroomWall = game.playroomWall || []; game.playroomWall.push({ day: game.day, text: a.wall }); if (game.playroomWall.length > 12) game.playroomWall.shift(); }
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  function twinsHome(){ return !(typeof window.isFielded === 'function' && window.isFielded('vaeren')); }

  function renderPlayroom(){
    const el = document.getElementById('ft-tab-playroom'); if (!el) return;
    let html = '<div class="panel-title">🧸 The Playroom</div>';
    if (!born()) {
      el.innerHTML = html + '<p style="font-size:.85rem;opacity:.7;">The room is still empty and quiet. It opens once the twins are born.</p>'; return;
    }
    const prog = window.bondProgress(KEY), tier = window.bondTier(KEY), pts = window.bondState()[KEY].points;
    const canSpend = window.canSpendTimeOnBond(KEY);
    html += '<p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">A low room full of soft corners, a shelf of toys, and two small people who would like very much for somebody to sit on the floor. ' +
      (twinsHome() ? 'Vaeren and Joelle are home.' : 'Vaeren and Joelle are aboard the Crimson Tide with the crew; the bond can still be spent from the Bonds tab.') + '</p>';
    html += '<article class="quest-item"><strong>🧸 San, Joel &amp; the Twins</strong> — <span style="opacity:.8;">' + esc(prog.tierDef.name) + '</span><br>' +
      '<span style="font-size:.74rem;opacity:.6;">' + pts + ' / ' + prog.nextThreshold + ' to next tier · once a day, +3 Fair Tide Mood</span></article>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0;">' + ACTIVITIES.map(function(a){
      return '<button class="btn btn-small btn-success" ' + (canSpend ? '' : 'disabled') + ' onclick="playWithTwins(\'' + a.id + '\')">' + a.icon + ' ' + esc(a.label) + '</button>';
    }).join('') + '</div>';
    if (!canSpend) html += '<div style="font-size:.76rem;opacity:.65;margin-bottom:8px;">Already played today. Even small people need a nap.</div>';
    // The room
    const items = FURNISHINGS.slice(1, tier + 1).filter(Boolean);
    html += '<div style="font-size:.8rem;color:var(--gold);margin-top:6px;">In the room</div><div style="font-size:.78rem;opacity:.8;line-height:1.6;">' +
      (items.length ? items.map(esc).join('<br>') : 'Bare floorboards and a very large cushion.') + '</div>';
    const wall = game.playroomWall || [];
    if (wall.length) {
      html += '<div style="font-size:.8rem;color:var(--gold);margin-top:10px;">On the wall</div><div style="font-size:.76rem;opacity:.75;line-height:1.6;">' +
        wall.slice().reverse().slice(0, 6).map(function(w){ return '🖍️ ' + esc(w.text) + ' <span style="opacity:.6;">(Day ' + w.day + ')</span>'; }).join('<br>') + '</div>';
    }
    const moments = (typeof window.sharedMomentsFor === 'function') ? window.sharedMomentsFor(KEY) : [];
    if (moments.length) {
      html += '<div style="font-size:.8rem;color:var(--gold);margin-top:10px;">🌊 Shared Moments</div><div style="font-size:.74rem;opacity:.7;line-height:1.6;">' +
        moments.slice(-6).reverse().map(function(m){ const a = ACTIVITIES.find(function(x){ return x.id === m.id; }); return (a ? a.icon + ' ' + esc(a.label) : esc(m.id)) + ' <span style="opacity:.6;">(Day ' + m.day + ')</span>'; }).join('<br>') + '</div>';
    }
    el.innerHTML = html;
  }

  const oldRenderHub = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings';
    const el = document.getElementById('ft-tab-playroom'), btn = document.getElementById('ft-tab-btn-playroom');
    if (el) el.classList.toggle('active', tab === 'playroom');
    if (btn) btn.classList.toggle('active', tab === 'playroom');
    if (oldRenderHub) oldRenderHub.apply(this, arguments);
    if (tab === 'playroom' && game.fairTideActiveTab === 'playroom') renderPlayroom();
  };

  // The Bonds tab card gets the "+0% crit chance" -> story text fix from hang-out-companions.js, and the
  // twins' bond is opened from the Playroom, so no separate Hang Out panel is added there.
})();
