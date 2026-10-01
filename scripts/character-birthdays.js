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
    mezstorm: { name:'Mez',      month:10, day:10 },
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

  window.todaysBirthdays = function(){
    const now = currentRealDate();
    const month = now.getMonth() + 1, day = now.getDate(), year = now.getFullYear();
    const active = [];
    Object.keys(BIRTHDAYS).forEach(function(id){
      const def = BIRTHDAYS[id];
      if (def.month === month && def.day === day && characterRecruited(id)) {
        active.push({ id: id, name: def.name, claimYear: year });
      }
    });
    return active;
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
    let html = '<div class="panel-title" style="margin-top:16px;">🎂 Today\'s Birthday</div>';
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
  // -------------------------------------------------------------------
  const BIRTHDAY_DROP_ITEMS = [
    { id:'birthday_cake',   icon:'🎂', name:'Birthday Cake',   desc:"Someone's favorite, probably. Nobody's saying no to a slice." },
    { id:'birthday_candle', icon:'🕯️', name:'Birthday Candle', desc:'Already burned halfway down. Someone clearly made a wish.' }
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
    if (!window.todaysBirthdays().length) return;
    if (Math.random() >= BIRTHDAY_DROP_CHANCE) return;
    const item = BIRTHDAY_DROP_ITEMS[Math.floor(Math.random() * BIRTHDAY_DROP_ITEMS.length)];
    const collection = birthdayDropCollection();
    collection[item.id] = (collection[item.id] || 0) + 1;
    toast(item.icon + ' Found a ' + item.name + '! (' + collection[item.id] + ' collected)', 3400);
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
