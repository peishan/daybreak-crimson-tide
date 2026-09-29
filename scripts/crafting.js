(function(){
  // -------------------------------------------------------------------
  // CRAFTING — San's request, after asking what loot/trophies actually
  // do. Checked first: every non-training victory drops one trophy
  // (game.inventory.push, core-engine.js handleVictory), themed by
  // matching the enemy's NAME against only 7 keyword buckets in
  // LOOT_THEMES (plus 3 more added later for specific story beats).
  // Everything else — the large majority of enemies across 20+ arcs —
  // falls through to a generic "⚔️ Trophy" that isn't in TRINKET_BONUS
  // at all, so equipping it (equipTrophy/doEquipTrophy) does nothing.
  // There was no way to sell trophies either. For most fights, the
  // trophy you get was pure inventory clutter with no purpose at all.
  //
  // This gives every trophy type a real use: spend trophies (+ gold) to
  // craft real, permanent EQUIPMENT_CATALOG-shaped items via the exact
  // same addGearToInventory() the equipment traders already use — no
  // new item system, no new currency, reuses gearCanEquip/gearBonuses/
  // the whole existing gear pipeline as-is. Recipes lean on the generic
  // "⚔️ Trophy" specifically (by far the most common drop) for the two
  // entry-level recipes, then one recipe per existing themed icon so
  // those aren't just a slightly-better version of the same dead end.
  //
  // Lives as its own panel on the Equipment screen (index.html adds a
  // #craftingContent container right after the existing Equipment
  // Traders panel) rather than a new screen or a new trader — same
  // screen a player's already on when deciding what to do with a
  // trophy, no new navigation to learn.
  // -------------------------------------------------------------------

  const CRAFTING_RECIPES = [
    {
      id: 'craft_salvaged_cutlass', name: 'Salvaged Cutlass', icon: '🗡️',
      slot: 'weapon', family: 'any', atk: 10, defense: 3, hp: 10, tier: 2,
      requires: { icon: '⚔️', count: 5 }, gold: 150,
      desc: 'Five trophies nobody wanted, melted down into something that finally is. +10 ATK, +3 DEF, +10 HP.'
    },
    {
      id: 'craft_reforged_linebreaker', name: 'Reforged Line-Breaker', icon: '⚔️',
      slot: 'weapon', family: 'any', atk: 18, defense: 10, hp: 15, tier: 3,
      requires: { icon: '⚔️', count: 12 }, gold: 600,
      desc: 'A dozen forgotten fights, folded into one blade that remembers all of them. +18 ATK, +10 DEF, +15 HP.'
    },
    {
      id: 'craft_corsairs_hook', name: "Corsair's Hook", icon: '🪝',
      slot: 'weapon', family: 'any', atk: 14, spd: 6, tier: 2,
      requires: { icon: '🏴‍☠️', count: 3 }, gold: 250,
      desc: "Three captains' worth of plunder, reforged into one hooked blade. +14 ATK, +6 SPD."
    },
    {
      id: 'craft_scaleweave_wraps', name: 'Scaleweave Wraps', icon: '🥋',
      slot: 'armor', family: 'light', defense: 12, spd: 8, tier: 2,
      requires: { icon: '🐍', count: 3 }, gold: 250,
      desc: 'Sea-beast scale, layered and stitched into something that actually turns a blade. +12 DEF, +8 SPD.'
    },
    {
      id: 'craft_wraithbound_cloak', name: 'Wraithbound Cloak', icon: '🥋',
      slot: 'armor', family: 'robe', defense: 10, magic: 8, tier: 2,
      requires: { icon: '👻', count: 3 }, gold: 250,
      desc: "Spectral essence bound into cloth that isn't quite fully there. +10 DEF, +8 MAG."
    },
    {
      id: 'craft_wyrmforged_edge', name: 'Wyrmforged Edge', icon: '⚔️',
      slot: 'weapon', family: 'any', atk: 24, magic: 10, hp: 15, tier: 4,
      requires: { icon: '🐉', count: 3 }, gold: 900,
      desc: "A wyvern scale's worth of heat, folded into an edge that hasn't fully cooled. +24 ATK, +10 MAG, +15 HP."
    }
  ];
  window.CRAFTING_RECIPES = CRAFTING_RECIPES;

  function trophyCount(icon){
    return (game.inventory || []).filter(function(it){ return it && it.icon === icon; }).length;
  }
  window.trophyCount = trophyCount;

  function canCraftRecipe(recipeId){
    const recipe = CRAFTING_RECIPES.find(function(r){ return r.id === recipeId; });
    if (!recipe) return false;
    return trophyCount(recipe.requires.icon) >= recipe.requires.count && (game.gold || 0) >= recipe.gold;
  }
  window.canCraftRecipe = canCraftRecipe;

  function craftRecipe(recipeId){
    const recipe = CRAFTING_RECIPES.find(function(r){ return r.id === recipeId; });
    if (!recipe) return;
    if (!canCraftRecipe(recipeId)) { toast('Not enough trophies or gold for this.', 2800); return; }
    game.inventory = game.inventory || [];
    let toConsume = recipe.requires.count;
    for (let i = game.inventory.length - 1; i >= 0 && toConsume > 0; i--) {
      if (game.inventory[i] && game.inventory[i].icon === recipe.requires.icon) {
        game.inventory.splice(i, 1);
        toConsume--;
      }
    }
    game.gold -= recipe.gold;
    const item = {
      id: recipe.id, name: recipe.name, icon: recipe.icon, slot: recipe.slot,
      family: recipe.family, atk: recipe.atk, defense: recipe.defense, hp: recipe.hp,
      magic: recipe.magic, spd: recipe.spd, tier: recipe.tier, price: recipe.gold,
      crafted: true, desc: recipe.desc
    };
    if (typeof addGearToInventory === 'function') addGearToInventory(item);
    toast('🔨 Crafted ' + item.icon + ' ' + item.name + '!', 3600);
    logEvent('🔨 Crafted ' + item.name + ' from ' + recipe.requires.count + ' ' + recipe.requires.icon + ' trophies.', 'gold');
    if (typeof saveGame === 'function') saveGame();
    if (typeof renderEquipment === 'function') renderEquipment();
    if (typeof renderInventory === 'function') renderInventory();
    if (typeof updateUI === 'function') updateUI();
  }
  window.craftRecipe = craftRecipe;

  function renderCraftingPanel(){
    let html = '';
    CRAFTING_RECIPES.forEach(function(recipe){
      const have = trophyCount(recipe.requires.icon);
      const need = recipe.requires.count;
      const canCraft = canCraftRecipe(recipe.id);
      html += '<article class="quest-item"><div style="display:flex;gap:10px;align-items:center;">'+
        '<div style="font-size:1.6rem;">'+recipe.icon+'</div><div style="flex:1;">'+
        '<strong>'+esc(recipe.name)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(recipe.desc)+'</span><br>'+
        '<span style="font-size:.78rem;opacity:.75;">Needs '+recipe.requires.icon+' x'+need+' ('+have+'/'+need+' on hand) + '+recipe.gold+'g</span>'+
        '</div>'+
        '<button class="btn btn-small" onclick="craftRecipe(\''+recipe.id+'\')" '+(canCraft ? '' : 'disabled')+'>🔨 Craft</button>'+
        '</div></article>';
    });
    return html;
  }
  window.renderCraftingPanel = renderCraftingPanel;

  const oldRenderEquipmentForCrafting = window.renderEquipment;
  window.renderEquipment = function(){
    if (oldRenderEquipmentForCrafting) oldRenderEquipmentForCrafting();
    const container = document.getElementById('craftingContent');
    if (!container) return;
    container.innerHTML = renderCraftingPanel();
  };
})();
