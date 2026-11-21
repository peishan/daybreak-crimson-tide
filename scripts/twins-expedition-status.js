(function(){
  // -------------------------------------------------------------------
  // VAEREN AND JOELLE, ONCE THEY HAVE JOINED THE CREW (Arc XLI Ch.16).
  //
  // Their "Vaeren & Joelle" record (Arc XXXV) was written for the infancy arc and always read
  // Development: Infancy and Expedition Access: Locked. Nothing ever changed it, so it still said so after they
  // had grown up and joined the crew. Once a twin is in the crew's roster the record reads
  // Development: Toddler (crew) and Expedition Access: Unlocked. Saves already past Arc XLI are repaired
  // the next time the game updates or the panel is drawn.
  // -------------------------------------------------------------------
  // From Arc XLI (the start of it is Arc XL complete) and through the start of the sequel the twins are toddlers.
  // They do not skip ahead: a twin who has joined the crew is a toddler crew member ("Toddler (crew)").
  function toddlerStage(){
    const c41 = game.comicProgress41;
    return !!(game.arc40Complete || (c41 && Object.keys(c41).length));
  }
  function reconcile(){
    try {
      if (typeof window.childRecord !== 'function' || !(game && game.foundCompanions)) return;
      const toddler = toddlerStage();
      ['vaeren', 'joelle'].forEach(function(key){
        const child = window.childRecord(key);
        if (!child) return;
        if (toddler) {
          child.chronologicalAge = 'Toddler';
          child.growthDevelopmentalStage = 'Toddler';
          if (!game.foundCompanions[key]) child.developmentStage = 'Toddler';
        }
        if (!game.foundCompanions[key]) return;
        child.expeditionAccess = true;
        child.developmentStage = toddler ? 'Toddler (crew)' : 'Grown (crew)';
      });
    } catch(e) {}
  }
  const oldSync = window.syncArc1StoryQuestProgress;
  if (typeof oldSync === 'function') window.syncArc1StoryQuestProgress = function(){ const r = oldSync.apply(this, arguments); reconcile(); return r; };
  const oldPanel = window.renderFairTideChildrenPanel;
  if (typeof oldPanel === 'function') window.renderFairTideChildrenPanel = function(){ reconcile(); return oldPanel.apply(this, arguments); };
  const oldGrowth = window.renderGrowthMilestonesPanel;
  if (typeof oldGrowth === 'function') window.renderGrowthMilestonesPanel = function(){ reconcile(); return oldGrowth.apply(this, arguments); };
  const oldGrant = window.grantTwinsRecruitIfDue;
  if (typeof oldGrant === 'function') window.grantTwinsRecruitIfDue = function(){ const r = oldGrant.apply(this, arguments); reconcile(); return r; };
})();
