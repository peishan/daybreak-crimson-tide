(function(){
  // -------------------------------------------------------------------
  // CHARACTER BIRTHDAYS — San's own real-world birthdates for the core
  // crew, celebrated the same way festivals are: dressed for the
  // player's actual calendar date, independent of Veyren story
  // chronology. Same claim-protection shape as real-calendar-events.js
  // (the save stores the last real-world YEAR each character's
  // birthday was claimed, so rolling the device clock back can never
  // re-grant it), and the same combat-drop pattern as
  // festival-drops.js, deliberately generic rather than themed per San's
  // own direction ("nothing really thematical, maybe birthday cake or
  // candle drops") -- a Birthday Cake or Birthday Candle, picked at
  // random, for ANY crew member's birthday rather than a unique item
  // per person.
  //
  // Joy's birthdate is not yet known -- she is deliberately left out of
  // BIRTHDAYS below rather than guessed. Add her the same one-line way
  // once San has a date, matching how FESTIVAL_YEAR_DATES handles a
  // still-unconfirmed date.
  //
  // Each non-San/Joel entry is gated on actually being recruited yet
  // (game.foundCompanions[id]), same reasoning as every other
  // character-referencing system in this codebase (fair-tide-flavour-
  // events.js's own eligibility checks) -- a player shouldn't see "it's
  // Zaki's birthday" before they've ever met Zaki. San is always
  // visible (she's always present from the start); Joel is gated like
  // everyone else since he isn't recruited until partway into Act I.
  // -------------------------------------------------------------------

  const BIRTHDAYS = {
    san:      { name:'San',      month:9,  day:18 },
    joel:     { name:'Joel',     month:10, day:8 },
    aisyah:   { name:'Aisyah',   month:12, day:21 },
    mezstorm: { name:'Mez',      month:10, day:6 },
    eliz:     { name:'Eliz',     month:1,  day:3 },
    senedra:  { name:'Senedra',  month:1,  day:24 },
    zaki:     { name:'Zaki',     month:3,  day:22 }
    // joy: date not yet provided -- add here once known.
  };
  window.CHARACTER_BIRTHDAYS = BIRTHDAYS;

  function currentRealDate(){
    return (typeof window.__ctNow === 'function') ? window.__ctNow() : new Date();
  }

  function characterRecruited(id){
    if (id === 'san') return true;
    return !!(game.foundCompanions && game.foundCompanions[id]);
  }

  // Celebration window -- San's own request: the Archive's "Today's
  // Birthday" panel used to only show on the exact calendar day, so
  // blinking and missing it (or just not opening the app that day) meant
  // the whole celebration quietly vanished. Shares the same full-week
  // window as the loot drops below, via the same activeBirthdaysInWindow()
  // helper, so both are driven by one definition of "how long is a
  // birthday still active" rather than two that could drift apart.
  // claimYear is the YEAR THE BIRTHDAY ITSELF FELL ON (not necessarily
  // today's year) so a late-December birthday whose window crosses into
  // January is still tracked against the year it actually happened --
  // claiming it on Jan 2nd correctly marks THAT december's occurrence as
  // celebrated, not a phantom "next year" one.
  const BIRTHDAY_WINDOW_DAYS = 7;
  function daysSince(past, now){
    const MS_PER_DAY = 86400000;
    const utcPast = Date.UTC(past.getFullYear(), past.getMonth(), past.getDate());
    const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((utcNow - utcPast) / MS_PER_DAY);
  }
  function activeBirthdaysInWindow(windowDays){
    const now = currentRealDate();
    const active = [];
    Object.keys(BIRTHDAYS).forEach(function(id){
      if (!characterRecruited(id)) return;
      const def = BIRTHDAYS[id];
      [now.getFullYear(), now.getFullYear() - 1].forEach(function(y){
        const diff = daysSince(new Date(y, def.month - 1, def.day), now);
        if (diff >= 0 && diff < windowDays) {
          active.push({ id: id, name: def.name, claimYear: y });
        }
      });
    });
    return active;
  }

  window.todaysBirthdays = function(){
    return activeBirthdaysInWindow(BIRTHDAY_WINDOW_DAYS);
  };

  // Loot drops (rollBirthdayDrop, below) use the same week-long window --
  // a 0.18-chance-per-kill drop pool needs more than one calendar day to
  // actually be reachable.
  window.birthdaysActiveForLoot = function(){
    return activeBirthdaysInWindow(BIRTHDAY_WINDOW_DAYS).map(function(b){
      return { id: b.id, name: b.name };
    });
  };

  function birthdayState(){
    if (!game.characterBirthdays) game.characterBirthdays = { lastClaimedYear: {} };
    return game.characterBirthdays;
  }
  window.characterBirthdayState = birthdayState;

  window.birthdayAlreadyClaimedThisYear = function(id, claimYear){
    return birthdayState().lastClaimedYear[id] === claimYear;
  };

  window.claimBirthdayCelebration = function(id){
    const active = window.todaysBirthdays().find(function(b){ return b.id === id; });
    if (!active) return;
    if (window.birthdayAlreadyClaimedThisYear(id, active.claimYear)) return;
    birthdayState().lastClaimedYear[id] = active.claimYear;
    game.gold = (game.gold || 0) + 20;
    if (typeof window.addFairTideMood === 'function') window.addFairTideMood(5);
    if (!game.festivalMemories) game.festivalMemories = [];
    game.festivalMemories.push({ id: 'birthday_' + id, year: active.claimYear, text: 'Fair Tide celebrated ' + active.name + "'s birthday.", day: game.day || 0 });
    toast('🎂 Happy Birthday, ' + active.name + '! — +20 gold, +5 Fair Tide Mood.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  function renderCharacterBirthdaysPanel(){
    const active = window.todaysBirthdays();
    if (!active.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🎂 Birthday Celebration</div>';
    active.forEach(function(b){
      const claimed = window.birthdayAlreadyClaimedThisYear(b.id, b.claimYear);
      html += '<article class="quest-item"><strong>🎉 '+esc(b.name)+'</strong>'+
        (claimed
          ? '<br><span style="font-size:.76rem;opacity:.65;">✓ Already celebrated this year.</span>'
          : '<div style="margin-top:6px;"><button class="btn btn-small btn-success" onclick="claimBirthdayCelebration(\''+b.id+'\')">🎂 Celebrate</button></div>')+
        '</article>';
    });
    return html;
  }
  window.renderCharacterBirthdaysPanel = renderCharacterBirthdaysPanel;

  // -------------------------------------------------------------------
  // Combat drop — generic, not per-character, same architecture as
  // festival-drops.js's own wrap (chains on top of it, since both wrap
  // window.handleVictory independently -- an already-established
  // pattern in this codebase).
  //
  // BUG FIX (San's report — got a Birthday Cake, had nowhere to see or
  // use it): cake and candle used to BOTH be purely cosmetic counters
  // in birthdayDropCollection, with no mechanical effect and no actual
  // inventory to open. Birthday Candle stays that way (kind:'cosmetic',
  // "someone made a wish" -- there's nothing to do with a candle). Cake
  // is now a real consumable (kind:'consumable'): it lands in
  // game.consumables, the SAME bucket a bought potion uses, keyed to a
  // matching POTION_CATALOG entry (scripts/core-engine.js) -- so it
  // shows up for free in the Cargo screen's existing "Consumables"
  // panel and works with the existing in-combat useItem(), no new
  // inventory system needed. Red Egg and Celebration Punch (HP and MP
  // respectively -- San's own request for "something liquid for MP")
  // are new consumable-only additions to the same drop pool.
  // -------------------------------------------------------------------
  const BIRTHDAY_DROP_ITEMS = [
    { id:'birthday_candle',  icon:'🕯️', name:'Birthday Candle',   desc:'Already burned halfway down. Someone clearly made a wish.', kind:'cosmetic' },
    { id:'birthday_cake',    icon:'🎂', name:'Birthday Cake',      desc:'Restores 35 HP. Someone\'s favorite, probably.', kind:'consumable' },
    { id:'red_egg',          icon:'🥚', name:'Red Egg',            desc:'Restores 25 HP. A birthday tradition from somewhere.', kind:'consumable' },
    { id:'celebration_punch', icon:'🥤', name:'Celebration Punch', desc:'Restores 25 MP. Something sweet, something fizzy.', kind:'consumable' }
  ];
  window.BIRTHDAY_DROP_ITEMS = BIRTHDAY_DROP_ITEMS;

  const BIRTHDAY_DROP_CHANCE = 0.18;

  function birthdayDropCollection(){
    if (!game.birthdayDropCollection) game.birthdayDropCollection = {};
    return game.birthdayDropCollection;
  }
  window.birthdayDropCollection = birthdayDropCollection;

  function rollBirthdayDrop(enemy){
    if (!enemy || enemy.kind === 'training') return;
    if (!window.birthdaysActiveForLoot().length) return;
    if (Math.random() >= BIRTHDAY_DROP_CHANCE) return;
    const item = BIRTHDAY_DROP_ITEMS[Math.floor(Math.random() * BIRTHDAY_DROP_ITEMS.length)];
    if (item.kind === 'consumable') {
      game.consumables = game.consumables || {};
      game.consumables[item.id] = (game.consumables[item.id] || 0) + 1;
      toast(item.icon + ' Found a ' + item.name + '! (+1 — see Consumables on the Cargo screen)', 3800);
    } else {
      const collection = birthdayDropCollection();
      collection[item.id] = (collection[item.id] || 0) + 1;
      toast(item.icon + ' Found a ' + item.name + '! (' + collection[item.id] + ' collected)', 3400);
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  }

  const oldHandleVictoryForBirthdayDrops = window.handleVictory;
  window.handleVictory = function(){
    const wasAlreadyResolved = game.combatResolved;
    const enemy = game.combatEnemy;
    if (oldHandleVictoryForBirthdayDrops) oldHandleVictoryForBirthdayDrops();
    if (!wasAlreadyResolved) rollBirthdayDrop(enemy);
  };

  function renderBirthdayDropsPanel(){
    const collection = birthdayDropCollection();
    const ids = Object.keys(collection);
    if (!ids.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🎉 Birthday Treats</div>';
    ids.forEach(function(id){
      const item = BIRTHDAY_DROP_ITEMS.find(function(i){ return i.id === id; });
      if (!item) return;
      html += '<article class="quest-item">'+item.icon+' <strong>'+esc(item.name)+'</strong> &times; '+collection[id]+'<br>'+
        '<span style="font-size:.76rem;opacity:.7;">'+esc(item.desc)+'</span></article>';
    });
    return html;
  }
  window.renderBirthdayDropsPanel = renderBirthdayDropsPanel;

  const oldRenderArchiveScreenForBirthdays = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForBirthdays) oldRenderArchiveScreenForBirthdays();
    const container = document.getElementById('archiveContent');
    if (!container) return;

    const existingBirthday = document.getElementById('characterBirthdaysPanelWrap');
    if (existingBirthday) existingBirthday.remove();
    const birthdayPanel = renderCharacterBirthdaysPanel();
    if (birthdayPanel) container.insertAdjacentHTML('beforeend', '<div id="characterBirthdaysPanelWrap">'+birthdayPanel+'</div>');

    const existingDrops = document.getElementById('birthdayDropsPanelWrap');
    if (existingDrops) existingDrops.remove();
    const dropsPanel = renderBirthdayDropsPanel();
    if (dropsPanel) container.insertAdjacentHTML('beforeend', '<div id="birthdayDropsPanelWrap">'+dropsPanel+'</div>');
  };
})();
