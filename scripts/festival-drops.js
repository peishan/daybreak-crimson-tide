(function(){
  // -------------------------------------------------------------------
  // FESTIVAL DROPS — a small chance of a themed collectible dropping
  // from combat victories while a real-calendar festival is active
  // (scripts/real-calendar-events.js, loaded just before this file).
  // San's own explicit asks: candy canes for Christmas, mooncakes for
  // Mid-Autumn, kurma (dates) for Hari Raya Aidilfitri. The rest below
  // are this file's own suggestions for the other festivals already in
  // the implemented set, picked for the same "small, thematic, everyone
  // immediately recognizes it" shape as those three.
  //
  // Deliberately excludes All Saints'/All Souls' Day -- those two were
  // explicitly designed as quiet remembrance rather than a party (see
  // real-calendar-events.js's own header comment), and a combat loot
  // drop during a mourning observance would undercut that tone. They
  // keep their existing Celebrate-and-Codex-memory flavor with no
  // monster drop attached.
  //
  // These are flavor collectibles, NOT equip-slot trophies -- they
  // never touch game.inventory/TRINKET_BONUS. A separate, simple count
  // store (game.festivalDropCollection) just tracks how many of each
  // a player has ever found, Codex-style, matching the "small
  // resources... not huge gameplay advantages" rule the rest of this
  // calendar system already follows.
  //
  // Wraps window.handleVictory (core-engine.js) rather than editing it
  // directly -- captures game.combatResolved BEFORE calling the base
  // function so this only ever rolls once per actual victory, exactly
  // mirroring the trophy-drop's own "every kind except training" rule.
  // -------------------------------------------------------------------

  const FESTIVAL_DROP_ITEMS = {
    christmas:            { id:'candy_cane',     icon:'🍬', name:'Candy Cane',      desc:'A peppermint treat that somehow made it to Fair Tide intact.' },
    mid_autumn:           { id:'mooncake',       icon:'🥮', name:'Mooncake',        desc:"Rich, dense, and gone in about four bites." },
    hari_raya_aidilfitri: { id:'kurma',          icon:'🌴', name:'Kurma (Dates)',   desc:'Sweet and sticky — the first thing offered at any open house.' },
    cny:                  { id:'lucky_orange',   icon:'🍊', name:'Lucky Orange',    desc:'Round, bright, and apparently very good for prosperity.' },
    chap_goh_mei:         { id:'paper_lantern',  icon:'🏮', name:'Paper Lantern',   desc:"Still warm from someone's candle." },
    dragon_boat:          { id:'zongzi',         icon:'🍙', name:'Zongzi',          desc:"Sticky rice wrapped in leaves — someone's grandmother's recipe, probably." },
    new_year:             { id:'sparkler_charm', icon:'✨', name:'Sparkler Charm',  desc:'Still faintly warm, like it just finished burning.' }
  };
  window.FESTIVAL_DROP_ITEMS = FESTIVAL_DROP_ITEMS;

  const DROP_CHANCE = 0.18;

  function festivalDropCollection(){
    if (!game.festivalDropCollection) game.festivalDropCollection = {};
    return game.festivalDropCollection;
  }
  window.festivalDropCollection = festivalDropCollection;

  function activeFestivalDropItem(){
    if (typeof window.activeFestivalsToday !== 'function') return null;
    const active = window.activeFestivalsToday();
    for (let i = 0; i < active.length; i++) {
      const item = FESTIVAL_DROP_ITEMS[active[i].id];
      if (item) return item;
    }
    return null;
  }
  window.activeFestivalDropItem = activeFestivalDropItem;

  function rollFestivalDrop(enemy){
    if (!enemy || enemy.kind === 'training') return;
    const item = activeFestivalDropItem();
    if (!item) return;
    if (Math.random() >= DROP_CHANCE) return;
    const collection = festivalDropCollection();
    collection[item.id] = (collection[item.id] || 0) + 1;
    toast(item.icon + ' Found a ' + item.name + '! (' + collection[item.id] + ' collected)', 3400);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  }

  const oldHandleVictoryForFestivalDrops = window.handleVictory;
  window.handleVictory = function(){
    const wasAlreadyResolved = game.combatResolved;
    const enemy = game.combatEnemy;
    if (oldHandleVictoryForFestivalDrops) oldHandleVictoryForFestivalDrops();
    if (!wasAlreadyResolved) rollFestivalDrop(enemy);
  };

  function renderFestivalDropsPanel(){
    const collection = festivalDropCollection();
    const ids = Object.keys(collection);
    if (!ids.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🎁 Festival Finds</div>';
    ids.forEach(function(id){
      const item = Object.values(FESTIVAL_DROP_ITEMS).find(function(i){ return i.id === id; });
      if (!item) return;
      html += '<article class="quest-item">'+item.icon+' <strong>'+esc(item.name)+'</strong> &times; '+collection[id]+'<br>'+
        '<span style="font-size:.76rem;opacity:.7;">'+esc(item.desc)+'</span></article>';
    });
    return html;
  }
  window.renderFestivalDropsPanel = renderFestivalDropsPanel;

  const oldRenderArchiveScreenForFestivalDrops = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForFestivalDrops) oldRenderArchiveScreenForFestivalDrops();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('festivalDropsPanelWrap');
    if (existing) existing.remove();
    const panel = renderFestivalDropsPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="festivalDropsPanelWrap">'+panel+'</div>');
  };
})();
