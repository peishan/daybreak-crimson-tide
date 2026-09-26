(function(){
  // -------------------------------------------------------------------
  // BESTIARY — a complete record of every creature the crew has ever
  // fought, built once discovery tracking was wired into handleVictory
  // (core-engine.js: game.bestiaryDiscovered[enemy.key] = true on every
  // victory). Reads directly from the four existing enemy pools
  // (HARBOR_ENEMIES, SEA_ENEMIES, GUARDIANS, MEMORY_FRAGMENTS) rather
  // than duplicating their data — this file is purely a lookup + render
  // layer on top of what already exists.
  //
  // Undiscovered entries show as "???" with no name, stats, or
  // description — spoiling nothing — but DO count toward the total, so
  // the completion count itself ("41 / 88 discovered") is always
  // visible. This differs deliberately from the Archive Records pattern
  // (where an undiscovered record doesn't appear at all): a bestiary's
  // whole appeal is tracking progress toward completion, which requires
  // showing the undiscovered slots exist, just not what's in them.
  // -------------------------------------------------------------------

  // BUG CAUGHT BEFORE SHIPPING: HARBOR_ENEMIES etc. are top-level const
  // declarations in core-engine.js, not window.X = ... assignments.
  // In classic (non-module) scripts, top-level const/let is accessible
  // as a bare identifier to later-loading scripts sharing the same
  // global scope, but never attaches to window itself — window['HARBOR_
  // ENEMIES'] would silently be undefined even though the bare name
  // HARBOR_ENEMIES works fine. Referencing the pools directly here
  // (not through a string-keyed window[] lookup) avoids that trap.
  const BESTIARY_CATEGORIES = [
    { key: 'harbor', label: 'Harbor Creatures', icon: '🏘️', pool: HARBOR_ENEMIES },
    { key: 'sea',    label: 'Sea Monsters',     icon: '🌊', pool: SEA_ENEMIES },
    { key: 'guardian', label: 'Guardians',      icon: '👑', pool: GUARDIANS },
    { key: 'memory', label: 'Memory Fragments', icon: '🕯️', pool: MEMORY_FRAGMENTS }
  ];

  function bestiaryState(){
    return game.bestiaryDiscovered || {};
  }
  window.bestiaryState = bestiaryState;

  function bestiaryTotals(){
    let discovered = 0, total = 0;
    const discoveredSet = bestiaryState();
    BESTIARY_CATEGORIES.forEach(function(cat){
      const pool = cat.pool;
      Object.keys(pool).forEach(function(key){
        total++;
        if (discoveredSet[key]) discovered++;
      });
    });
    return { discovered: discovered, total: total };
  }
  window.bestiaryTotals = bestiaryTotals;

  function renderBestiaryScreen(){
    const container = document.getElementById('bestiaryContent');
    if (!container) return;
    const discoveredSet = bestiaryState();
    const totals = bestiaryTotals();

    let html = '<div class="panel"><div class="panel-title" style="text-align:center;">📖 '+totals.discovered+' / '+totals.total+' Discovered</div></div>';

    BESTIARY_CATEGORIES.forEach(function(cat){
      const pool = cat.pool;
      const keys = Object.keys(pool);
      const catDiscovered = keys.filter(function(k){ return discoveredSet[k]; }).length;
      html += '<div class="panel-title" style="margin-top:16px;">'+cat.icon+' '+esc(cat.label)+' — '+catDiscovered+' / '+keys.length+'</div>';
      keys.forEach(function(key){
        const entry = pool[key];
        const found = !!discoveredSet[key];
        if (found) {
          html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
            '<div style="font-size:1.6rem;">'+entry.art+'</div><div style="flex:1;">'+
            '<strong>'+esc(entry.name)+'</strong><br>'+
            '<span style="font-size:.78rem;opacity:.75;">'+esc(entry.desc)+'</span><br>'+
            '<span style="font-size:.78rem;">'+entry.hp+' HP · '+entry.dmg+' DMG · '+entry.xp+' XP · '+entry.gold+'g</span>'+
            '</div></div></article>';
        } else {
          html += '<article class="quest-item" style="opacity:.5;"><div style="display:flex;gap:10px;align-items:center;">'+
            '<div style="font-size:1.6rem;">❔</div><div style="flex:1;">'+
            '<strong>???</strong><br><span style="font-size:.78rem;opacity:.7;">Not yet encountered.</span>'+
            '</div></div></article>';
        }
      });
    });
    container.innerHTML = html;
  }
  window.renderBestiaryScreen = renderBestiaryScreen;

  const oldGoScreenForBestiary = window.goScreen;
  window.goScreen = function(name){
    if (oldGoScreenForBestiary) oldGoScreenForBestiary(name);
    if (name === 'bestiary' && typeof window.renderBestiaryScreen === 'function') window.renderBestiaryScreen();
  };
})();
