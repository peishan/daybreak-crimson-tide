(function(){
  // -------------------------------------------------------------------
  // BRIDGE — THE SHORE BEYOND THE HORIZON. One chapter bridging Arc XLI
  // to Arc XLII, gated identically to where Arc XLII itself will sit
  // (arc41Complete + level 630, continuing the established +15-per-arc
  // ladder one step past Arc XLI's own 615) — same relationship
  // arc20-interlude.js already has to Arc XXI ("gated identically to
  // Arc XXI... deliberately independent of both"). Completing it sets
  // game.arc41BridgeComplete = true, which Arc XLII itself will check
  // once built, and which is ALSO what gates Lunareth's arrival region
  // open in the Inter-World Expeditions screen (see
  // interworld-expeditions.js's own lunareth_arrival_shore entry).
  //
  // Per San's own framing: Arc XLII itself ("needs extensive thinking
  // and planning") isn't built yet. This bridge's whole job is small
  // and self-contained -- get the Horizon Engine to actually find
  // Lunareth, get San and Joel there, and register the world as a real,
  // reachable destination -- without pre-empting any of Arc XLII's own
  // content (no named locations beyond "Lunareth" itself, no named
  // characters, no plot). The five beats in San's own outline (The
  // Signal / A World Beyond the Sea / The Expedition / Crossing the
  // Horizon / The Name of the World) are one continuous sequence, not
  // five separate story beats a player completes independently -- so
  // unlike every numbered arc file, this is ONE chapter, not several,
  // matching the outline's own "END BRIDGE CHAPTER" (singular).
  //
  // Mechanically this reuses Arc XXXVII's own Living Horizons system
  // (window.registerHorizonSurvey/advanceHorizonSurveyStage,
  // arc37-mechanics.js) for Lunareth's own survey entry -- advancing it
  // through observed -> surveyed -> expedition_ready in sequence as
  // this one chapter completes, since the crossing itself happens
  // within this single chapter rather than across several. No new
  // systems, no new combat -- the only other piece is registering
  // Lunareth's arrival region as an Inter-World Expedition destination,
  // which lives in interworld-expeditions.js itself (the established
  // "future worlds can be added as discoveries" extension point that
  // file's own header comment already calls out).
  // -------------------------------------------------------------------

  const ARC41_BRIDGE_CHAPTERS = [
    {id:1, title:'The Shore Beyond the Horizon', focus:"At Fair Tide, the Horizon Engine detects an unusual, stable signal -- one that produces an actual navigational response rather than just an image. Mimi senses something strangely familiar in it. San authorizes a limited expedition, and the crew crosses into Lunareth for the first time.", image:'assets/comics/bridge-arc42/ch01-the-shore-beyond-the-horizon.webp', xp:400, action:'🌌 Cross the Shore Beyond the Horizon'}
  ];
  window.ARC41_BRIDGE_CHAPTERS = ARC41_BRIDGE_CHAPTERS;

  const ARC41_BRIDGE_CHAPTER_SCENES = {
    1: "At Fair Tide, the Horizon Engine picks up a pattern none of the researchers have seen quite like before.<br><br>Renn's first instinct is the familiar one by now — another distant world, worth observing, nothing more urgent than that. He's seen enough of these to stop expecting each one to be special.<br><br>Erynn isn't so sure. Unlike the alternate Earth they spent Arc XXXVIII carefully studying from a safe distance, this signal produces something different: a stable navigational response. Not just an image to watch. A place that might actually be reachable.<br><br>Mimi, working the reading as a Diviner, goes quiet for a moment longer than usual. Something about it feels strangely, inexplicably familiar to her. She can't explain why. She doesn't try to force an explanation either — just notes it, the way she's learned to note things that don't resolve cleanly yet.<br><br>The researchers spend real time sharpening the image, and an unfamiliar coastline slowly comes into focus. Beyond it: mountains, settlements, forests, waterways, spread out further than anyone expected. Whatever this place is, it's inhabited, and its people clearly aren't gathered in one convenient spot waiting to be found.<br><br>San studies the image for a long while, feeling an unexpected pull of curiosity she doesn't immediately examine too closely.<br><br>Joel notices, the way he notices most things about her by now.<br><br>\"You're thinking about going,\" he says.<br><br>\"I'm thinking about what we might find,\" San says.<br><br>\"That's usually how it starts.\"<br><br>She authorizes a limited reconnaissance expedition — nothing more ambitious than that, not yet. Fair Tide keeps running exactly as it always does under its own leadership and support systems. Vaeren and Joelle stay safely at home with the people who already look after them. The Horizon researchers prepare a route built specifically to let the expedition return if anything about the crossing turns unstable. Their first priority, San makes plain to everyone involved, is simply figuring out where they've actually arrived — not claiming to understand the whole of it in one trip.<br><br>The Horizon Engine activates. The passage opens.<br><br>For one long moment the sea seems to stretch out farther than it has any right to, and Veyren's own familiar horizon disappears entirely behind it. Then the passage settles, steady, and the expedition emerges into unfamiliar waters, a new coastline waiting ahead of them.<br><br>San stands beside Joel, studying the distant shore.<br><br>\"Any idea where we are?\" he asks.<br><br>\"Not yet,\" she says.<br><br>A strange feeling passes between the two of them, quiet and wordless. Neither can explain it. Neither tries very hard to.<br><br>The expedition approaches the coast carefully, and signs of real habitation start to appear — structures, paths, the unmistakable evidence of people living their lives somewhere just out of sight. Before long, the crew finds the first clear indication of the world's actual name.<br><br>Lunareth.<br><br>San repeats it quietly to herself, turning the sound of it over. Something about the name feels almost familiar, in a way she can't yet place or explain, the same unplaceable shape as whatever Mimi sensed back at Fair Tide.<br><br>Joel looks toward the coastline, waiting.<br><br>\"Well, Captain?\"<br><br>San smiles, and doesn't look away from the shore.<br><br>\"Let's find out where we've landed.\""
  };
  window.ARC41_BRIDGE_CHAPTER_SCENES = ARC41_BRIDGE_CHAPTER_SCENES;

  window.arc41BridgeObjectiveState = function(){
    if (!game.arc41Complete) return null;
    if (level() < 630) return null;
    game.comicProgressArc41Bridge = game.comicProgressArc41Bridge || {};
    for (const ch of ARC41_BRIDGE_CHAPTERS) {
      if (!game.comicProgressArc41Bridge[ch.id]) return 'complete_arc41bridge_chapter_' + ch.id;
    }
    return 'arc41bridge_complete_for_now';
  };

  window.markArc41BridgeChapterRead = function(id){
    const so = window.arc41BridgeObjectiveState();
    if (so !== ('complete_arc41bridge_chapter_' + id)) return;
    game.comicProgressArc41Bridge = game.comicProgressArc41Bridge || {};
    game.comicProgressArc41Bridge[id] = true;
    // Matches every prior arc/interlude's own completion flag --
    // self-contained to this file, no aggregator dependency. Arc XLII
    // itself will check this once built, same way every numbered arc
    // checks the one before it.
    if (id === 1) game.arc41BridgeComplete = true;

    // Living Horizons: Lunareth's own survey entry, advanced through all
    // three remaining stages in sequence since the whole crossing
    // happens within this one chapter rather than across several (see
    // arc37-mechanics.js's own window.registerHorizonSurvey /
    // advanceHorizonSurveyStage -- the same API Arc XXXVII's own Horizon
    // uses, just reused here for a second one).
    if (typeof window.registerHorizonSurvey === 'function') {
      window.registerHorizonSurvey('lunareth_horizon', 'Lunareth');
      if (typeof window.advanceHorizonSurveyStage === 'function') {
        window.advanceHorizonSurveyStage('lunareth_horizon', 'observed');
        window.advanceHorizonSurveyStage('lunareth_horizon', 'surveyed');
        window.advanceHorizonSurveyStage('lunareth_horizon', 'expedition_ready');
      }
      if (typeof window.markHorizonSurveyCoordinatesRecorded === 'function') {
        window.markHorizonSurveyCoordinatesRecorded('lunareth_horizon');
      }
    }

    const ch = ARC41_BRIDGE_CHAPTERS.find(c => c.id === id);
    if (ch) {
      gainXP(ch.xp);
      toast('📖 ' + ch.title + ' — +' + ch.xp + ' Story XP', 3200);
    }
    if (ARC41_BRIDGE_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC41_BRIDGE_CHAPTER_SCENES[id] });
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderStory === 'function') renderStory();
    if (typeof window.showStoryModal === 'function' && game.storyModalQueue.length) {
      const next = game.storyModalQueue.shift();
      setTimeout(() => window.showStoryModal(next), 400);
    }
  };

  window.__ctShowArc41BridgeSplash = function(){
    const overlay = document.getElementById('arc41BridgeSplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc41BridgeSplash = function(){
    const overlay = document.getElementById('arc41BridgeSplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc41BridgeSplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc41Bridge = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc41Bridge) oldRenderStoryForArc41Bridge();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const bridgeReady = window.arc41BridgeObjectiveState() !== null;
    if (bridgeReady && !game.arc41BridgeSplashSeen && typeof window.__ctShowArc41BridgeSplash === 'function') {
      window.__ctShowArc41BridgeSplash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<img src="assets/comics/bridge-arc42/bridge-arc42-cover-the-shore-beyond-the-horizon.webp" alt="The Shore Beyond the Horizon" style="width:100%;border-radius:8px;margin-bottom:12px;">'+
      '<div class="story-act-kicker">Bridge to Arc XLII</div><div class="story-act-title">The Shore Beyond the Horizon</div>'+
      '<div class="story-act-tagline">Every world has a history of its own, even one that began as a story.</div></div>';
    if (!bridgeReady) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Locked</div><div class="story-chapter-sub">'+
        (!game.arc41Complete ? 'Finish Arc XLI first.' : 'Reach Level 630 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc41BridgeObjectiveState();
    ARC41_BRIDGE_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgressArc41Bridge && game.comicProgressArc41Bridge[ch.id]);
      const ready = !done && so===('complete_arc41bridge_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) {
        action =
          '<button class="btn btn-small btn-success" onclick="markArc41BridgeChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      } else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>'+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc41bridge_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ Lunareth\'s arrival shore is open through Inter-World Expeditions. Arc XLII itself is still ahead.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();
