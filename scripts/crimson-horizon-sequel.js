(function(){
  // -------------------------------------------------------------------
  // CRIMSON HORIZON -- ADVENTURES OF SAN AND JADE. The sequel teaser.
  // Crimson Tide's main campaign ends at Arc XLII (game.arc42Complete,
  // set by markArc42ChapterRead() at Ch.45). This file only shows the
  // sequel's announcement splash once that flag is set -- no sequel
  // chapters exist yet, so no story panel is appended to #storyContent
  // (that would promise playable content that isn't there). A future
  // batch can build Crimson Horizon's own chapter file the same way
  // every arc since Arc XVII has, gated on game.arc42Complete plus
  // whatever new level threshold San's own notes settle on.
  // -------------------------------------------------------------------

  window.__ctShowCrimsonHorizonSplash = function(){
    const overlay = document.getElementById('crimsonHorizonSplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseCrimsonHorizonSplash = function(){
    const overlay = document.getElementById('crimsonHorizonSplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.crimsonHorizonSplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForCrimsonHorizon = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForCrimsonHorizon) oldRenderStoryForCrimsonHorizon();
    const sequelReady = !!game.arc42Complete;
    if (sequelReady && !game.crimsonHorizonSplashSeen && typeof window.__ctShowCrimsonHorizonSplash === 'function') {
      window.__ctShowCrimsonHorizonSplash();
    }
  };
})();
