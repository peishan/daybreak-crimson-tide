(function(){
  // -------------------------------------------------------------------
  // VAEREN AND JOELLE, ONCE THEY HAVE JOINED THE CREW (Arc XLI Ch.16).
  //
  // Their "Vaeren & Joelle" record (Arc XXXV) was written for the infancy arc and always read
  // Development: Infancy and Expedition Access: Locked. Nothing ever changed it, so it still said so after they
  // had grown up and joined the crew. Once a twin is in the crew's roster the record reads
  // Development: Grown (crew) and Expedition Access: Unlocked. Saves already past Arc XLI are repaired
  // the next time the game updates or the panel is drawn.
  // -------------------------------------------------------------------
  function reconcile(){
    try {
      if (typeof window.childRecord !== 'function' || !(game && game.foundCompanions)) return;
      ['vaeren', 'joelle'].forEach(function(key){
        if (!game.foundCompanions[key]) return;
        const child = window.childRecord(key);
        if (!child) return;
        child.expeditionAccess = true;
        child.developmentStage = 'Grown (crew)';
      });
    } catch(e) {}
  }
  const oldSync = window.syncArc1StoryQuestProgress;
  if (typeof oldSync === 'function') window.syncArc1StoryQuestProgress = function(){ const r = oldSync.apply(this, arguments); reconcile(); return r; };
  const oldPanel = window.renderFairTideChildrenPanel;
  if (typeof oldPanel === 'function') window.renderFairTideChildrenPanel = function(){ reconcile(); return oldPanel.apply(this, arguments); };
  const oldGrant = window.grantTwinsRecruitIfDue;
  if (typeof oldGrant === 'function') window.grantTwinsRecruitIfDue = function(){ const r = oldGrant.apply(this, arguments); reconcile(); return r; };
})();
