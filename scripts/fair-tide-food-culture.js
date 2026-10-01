(function(){
  // -------------------------------------------------------------------
  // FAIR TIDE FOOD CULTURE — per San's own framing: "people don't
  // perfectly reproduce the worlds they lost; they build something new
  // from what they remember." Tied to the existing festival claim flow
  // (real-calendar-events.js) rather than a new standalone trigger.
  //
  // Each festival's traditional dishes are attempted the first time
  // it's celebrated. The SECOND time that same festival is celebrated
  // (a different real year), the Veyren adaptation story unlocks for
  // every one of that festival's dishes at once -- someone couldn't
  // source the original ingredient, Maera suggested a Veyren
  // equivalent, and the dish becomes a permanent "Fair Tide X" Codex
  // entry from then on. This mirrors the narrative arc San described
  // almost exactly: try it once as remembered, then let Veyren quietly
  // change it.
  //
  // Detects a successful claim the same way fair-tide-chronicle.js
  // does -- watching game.festivalMemories grow by wrapping
  // window.claimFestivalReward, rather than reaching into real-
  // calendar-events.js's own internal state directly. Each newly
  // unlocked recipe is recorded into the Chronicle via
  // window.recordChronicleEntry the moment it unlocks.
  // -------------------------------------------------------------------

  const FESTIVAL_FOODS = {
    christmas: [
      { id:'bibingka',       name:'Bibingka',       veyrenName:'Fair Tide Bibingka',       veyrenNote:"Couldn't find the right rice flour. Maera suggested a Veyren grain instead. It worked out surprisingly well." },
      { id:'puto_bumbong',   name:'Puto Bumbong',   veyrenName:'Fair Tide Puto Bumbong',   veyrenNote:'The purple yam proved impossible to source. A Veyren root, close enough in color and sweetness, filled in.' },
      { id:'pancit',         name:'Pancit',         veyrenName:'Fair Tide Pancit',         veyrenNote:'Noodles, as it turns out, travel reasonably well between worlds. The sauce needed more help.' }
    ],
    cny: [
      { id:'dumplings',         name:'Dumplings',         veyrenName:'Fair Tide Dumplings',         veyrenNote:'The filling changed before anyone quite decided to change it.' },
      { id:'longevity_noodles', name:'Longevity Noodles', veyrenName:'Fair Tide Longevity Noodles', veyrenNote:"Nobody agrees on whose recipe this actually is anymore." },
      { id:'nian_gao',          name:'Nian Gao',          veyrenName:'Fair Tide Nian Gao',          veyrenNote:"Sweeter than anyone remembered the original being. Nobody's complaining." }
    ],
    chap_goh_mei: [
      { id:'tangyuan', name:'Tangyuan', veyrenName:'Fair Tide Tangyuan', veyrenNote:"The filling is new. The shape, at least, nobody had to change." }
    ],
    hari_raya_aidilfitri: [
      { id:'ketupat', name:'Ketupat', veyrenName:'Fair Tide Ketupat', veyrenNote:'The woven leaves came from somewhere else entirely. The shape held anyway.' },
      { id:'rendang', name:'Rendang', veyrenName:'Fair Tide Rendang', veyrenNote:'Based on an old-world recipe, adapted using Veyren spices.' },
      { id:'satay',   name:'Satay',   veyrenName:'Fair Tide Satay',   veyrenNote:'The peanut sauce took three attempts before anyone was satisfied.' }
    ],
    dragon_boat: [
      { id:'zongzi', name:'Zongzi', veyrenName:'Fair Tide Zongzi', veyrenNote:'The leaves are different. The shape, stubbornly, is not.' }
    ],
    mid_autumn: [
      { id:'mooncake_recipe', name:'Mooncakes', veyrenName:'Fair Tide Mooncakes', veyrenNote:'The filling recipe drifted a little further from the original every year, until nobody minded that it had.' }
    ]
  };
  window.FESTIVAL_FOODS = FESTIVAL_FOODS;

  const DISH_LOOKUP = {};
  Object.keys(FESTIVAL_FOODS).forEach(function(festivalId){
    FESTIVAL_FOODS[festivalId].forEach(function(dish){ DISH_LOOKUP[dish.id] = dish; });
  });

  function foodCultureState(){
    if (!game.foodCulture) game.foodCulture = { history: {}, recipes: [] };
    return game.foodCulture;
  }
  window.foodCultureState = foodCultureState;

  function processFestivalFood(festivalId){
    const dishes = FESTIVAL_FOODS[festivalId];
    if (!dishes) return;
    const state = foodCultureState();
    dishes.forEach(function(dish){
      state.history[dish.id] = (state.history[dish.id] || 0) + 1;
      const alreadyUnlocked = state.recipes.some(function(r){ return r.id === dish.id; });
      if (!alreadyUnlocked && state.history[dish.id] >= 2) {
        state.recipes.push({ id: dish.id, veyrenName: dish.veyrenName, veyrenNote: dish.veyrenNote, day: game.day || 0 });
        if (typeof window.recordChronicleEntry === 'function') window.recordChronicleEntry(dish.veyrenName + ' — ' + dish.veyrenNote, '🍲');
        toast('🍲 ' + dish.veyrenName + ' — ' + dish.veyrenNote, 4200);
      }
    });
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  }
  window.processFestivalFood = processFestivalFood; // exposed for the vm test suite; not meant to be called directly in normal play

  const oldClaimFestivalRewardForFoodCulture = window.claimFestivalReward;
  window.claimFestivalReward = function(festivalId){
    const before = (game.festivalMemories || []).length;
    if (oldClaimFestivalRewardForFoodCulture) oldClaimFestivalRewardForFoodCulture(festivalId);
    const after = (game.festivalMemories || []).length;
    if (after > before) processFestivalFood(festivalId);
  };

  function renderFoodCulturePanel(){
    const state = foodCultureState();
    const triedIds = Object.keys(state.history);
    if (!triedIds.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🍲 Fair Tide Recipes</div>';
    state.recipes.forEach(function(r){
      html += '<article class="quest-item"><strong>'+esc(r.veyrenName)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(r.veyrenNote)+'</span></article>';
    });
    const pending = triedIds.filter(function(id){ return !state.recipes.some(function(r){ return r.id === id; }); });
    if (pending.length) {
      html += '<div style="font-size:.74rem;opacity:.7;margin-top:10px;">Still Finding Its Way</div>';
      html += '<div style="font-size:.72rem;opacity:.65;line-height:1.6;">';
      pending.forEach(function(id){
        const dish = DISH_LOOKUP[id];
        if (dish) html += esc(dish.name) + '<br>';
      });
      html += '</div>';
    }
    return html;
  }
  window.renderFoodCulturePanel = renderFoodCulturePanel;

  const oldRenderArchiveScreenForFoodCulture = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForFoodCulture) oldRenderArchiveScreenForFoodCulture();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('foodCulturePanelWrap');
    if (existing) existing.remove();
    const panel = renderFoodCulturePanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="foodCulturePanelWrap">'+panel+'</div>');
  };
})();
