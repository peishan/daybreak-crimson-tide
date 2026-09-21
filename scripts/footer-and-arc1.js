
  // BUG FIX: this footer was a hardcoded static string ("Build V83 ·
  // Party AI + Equipment") completely disconnected from
  // window.__CT_BUILD__ — every build since V83 updated that variable
  // (used correctly by the debug log panel) but never touched this
  // footer text, since nothing ever read it back out. Wired here to
  // read the live value instead, so it can't go stale again no matter
  // how many future builds ship.
  document.addEventListener('DOMContentLoaded', function(){
    const el = document.getElementById('ctBuildFooterVersion');
    if (el) el.textContent = 'Build ' + (window.__CT_BUILD__ || '?');
  });


/* Build V62 — full Arc I Story Mode panel pass + rescue gates.
   Built on the Claude-debugged V61 base. Existing working Story Mode mechanics are preserved. */
(function(){
  const arc1PanelDefs = {
    5:[{"image": "assets/comics/arc1/ch05-the-voice-behind-the-wall.png", "crop": [0, 0.0, 1, 0.25], "text": "Behind the ruined wall, San meets the man she cannot remember but somehow feels she has been searching for.", "caption": "The Voice Behind the Wall"}, {"image": "assets/comics/arc1/ch05-the-voice-behind-the-wall.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Voice Behind the Wall"}, {"image": "assets/comics/arc1/ch05-the-voice-behind-the-wall.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Voice Behind the Wall"}, {"image": "assets/comics/arc1/ch05-the-voice-behind-the-wall.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Voice Behind the Wall"}],
    6:[{"image": "assets/comics/arc1/ch06-the-shield-returns.png", "crop": [0, 0.0, 1, 0.25], "text": "The Crimson Tide enters the ruins. San and Joel fight side by side before either can explain why it feels natural.", "caption": "The Shield Returns"}, {"image": "assets/comics/arc1/ch06-the-shield-returns.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Shield Returns"}, {"image": "assets/comics/arc1/ch06-the-shield-returns.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Shield Returns"}, {"image": "assets/comics/arc1/ch06-the-shield-returns.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Shield Returns"}],
    7:[{"image": "assets/comics/arc1/ch07-the-shield-that-remained.png", "crop": [0, 0.0, 1, 0.25], "text": "The storm took their memories, but something remained: the feeling of a shield, a promise, and a person worth bringing home.", "caption": "The Shield That Remained"}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Shield That Remained"}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Shield That Remained"}, {"image": "assets/comics/arc1/ch07-the-shield-that-remained.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Shield That Remained"}],
    8:[{"image": "assets/comics/arc1/ch08-the-tradewinds-remember.png", "crop": [0, 0.0, 1, 0.25], "text": "The search continues through the trade routes. The shield leaves a trail even when its owner cannot remember where he came from.", "caption": "The Tradewinds Remember"}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Tradewinds Remember"}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Tradewinds Remember"}, {"image": "assets/comics/arc1/ch08-the-tradewinds-remember.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Tradewinds Remember"}],
    9:[{"image": "assets/comics/arc1/ch09-shield-returns.png", "crop": [0, 0.0, 1, 0.25], "text": "The crew learns how to live aboard the same ship again.", "caption": "The Quiet Between Voyages"}, {"image": "assets/comics/arc1/ch09-shield-returns.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Quiet Between Voyages"}, {"image": "assets/comics/arc1/ch09-shield-returns.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Quiet Between Voyages"}, {"image": "assets/comics/arc1/ch09-shield-returns.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Quiet Between Voyages"}],
    10:[{"image": "assets/comics/arc1/ch10-day-sea-rested.png", "crop": [0, 0.0, 1, 0.25], "text": "Names return through ledgers, rumours, and introductions—not recovered memories.", "caption": "The Names We Keep"}, {"image": "assets/comics/arc1/ch10-day-sea-rested.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Names We Keep"}, {"image": "assets/comics/arc1/ch10-day-sea-rested.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Names We Keep"}, {"image": "assets/comics/arc1/ch10-day-sea-rested.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Names We Keep"}],
    11:[{"image": "assets/comics/arc1/ch11-day-we-chose.png", "crop": [0, 0.0, 1, 0.25], "text": "The Crimson Tide becomes more than a place to sleep; it becomes somewhere to belong.", "caption": "Before the Next Port"}, {"image": "assets/comics/arc1/ch11-day-we-chose.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Before the Next Port"}, {"image": "assets/comics/arc1/ch11-day-we-chose.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Before the Next Port"}, {"image": "assets/comics/arc1/ch11-day-we-chose.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Before the Next Port"}],
    12:[{"image": "assets/comics/arc1/ch12-debt-wasnt-hers.png", "crop": [0, 0.0, 1, 0.25], "text": "Aisyah’s false debt is exposed, and San’s instinct to protect her becomes impossible to ignore.", "caption": "The Debt That Wasn’t Hers"}, {"image": "assets/comics/arc1/ch12-debt-wasnt-hers.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Debt That Wasn’t Hers"}, {"image": "assets/comics/arc1/ch12-debt-wasnt-hers.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Debt That Wasn’t Hers"}, {"image": "assets/comics/arc1/ch12-debt-wasnt-hers.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Debt That Wasn’t Hers"}],
    13:[{"image": "assets/comics/arc1/ch13-debt-collector.png", "crop": [0, 0.0, 1, 0.25], "text": "A matching mark in the ledger hints that the crew’s scattering was not entirely random.", "caption": "The Debt Collector"}, {"image": "assets/comics/arc1/ch13-debt-collector.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Debt Collector"}, {"image": "assets/comics/arc1/ch13-debt-collector.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Debt Collector"}, {"image": "assets/comics/arc1/ch13-debt-collector.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Debt Collector"}],
    14:[{"image": "assets/comics/arc1/ch14-two-sisters-one-ship.png", "crop": [0, 0.0, 1, 0.25], "text": "Sisterhood takes shape through teasing, trust, and the things neither woman can explain.", "caption": "Two Sisters, One Ship"}, {"image": "assets/comics/arc1/ch14-two-sisters-one-ship.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Two Sisters, One Ship"}, {"image": "assets/comics/arc1/ch14-two-sisters-one-ship.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Two Sisters, One Ship"}, {"image": "assets/comics/arc1/ch14-two-sisters-one-ship.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Two Sisters, One Ship"}],
    15:[{"image": "assets/comics/arc1/ch15-one-who-stayed.png", "crop": [0, 0.0, 1, 0.3333333333333333], "text": "Eliz chooses the crew because they prove they need her—and because she chooses to stay.", "caption": "The One Who Stayed"}, {"image": "assets/comics/arc1/ch15-one-who-stayed.png", "crop": [0, 0.3333333333333333, 1, 0.3333333333333333], "text": "The story continues through the scene above. Tap to continue.", "caption": "The One Who Stayed"}, {"image": "assets/comics/arc1/ch15-one-who-stayed.png", "crop": [0, 0.6666666666666666, 1, 0.3333333333333333], "text": "The story continues through the scene above. Tap to continue.", "caption": "The One Who Stayed"}],
    16:[{"image": "assets/comics/arc1/ch16-mark-we-carried.png", "crop": [0, 0.0, 1, 0.3333333333333333], "text": "Three matching gem-like pendants are noticed for what they are: a mystery, not an answer.", "caption": "The Mark We Carried"}, {"image": "assets/comics/arc1/ch16-mark-we-carried.png", "crop": [0, 0.3333333333333333, 1, 0.3333333333333333], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Mark We Carried"}, {"image": "assets/comics/arc1/ch16-mark-we-carried.png", "crop": [0, 0.6666666666666666, 1, 0.3333333333333333], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Mark We Carried"}],
    17:[{"image": "assets/comics/arc1/ch17-things-we-do-without-knowing.png", "crop": [0, 0.0, 1, 0.3333333333333333], "text": "The crew falls into familiar roles even though none of them remembers why.", "caption": "The Things We Do Without Knowing"}, {"image": "assets/comics/arc1/ch17-things-we-do-without-knowing.png", "crop": [0, 0.3333333333333333, 1, 0.3333333333333333], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Things We Do Without Knowing"}, {"image": "assets/comics/arc1/ch17-things-we-do-without-knowing.png", "crop": [0, 0.6666666666666666, 1, 0.3333333333333333], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Things We Do Without Knowing"}],
    18:[{"image": "assets/comics/arc1/ch18-mezstorm-rescue.png", "crop": [0, 0.0, 1, 0.25], "text": "Mezstorm’s rescue leaves a deeper question: what does regeneration mean when identity itself can shift?", "caption": "The Storm That Was Owed"}, {"image": "assets/comics/arc1/ch18-mezstorm-rescue.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Storm That Was Owed"}, {"image": "assets/comics/arc1/ch18-mezstorm-rescue.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Storm That Was Owed"}, {"image": "assets/comics/arc1/ch18-mezstorm-rescue.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Storm That Was Owed"}],
    19:[{"image": "assets/comics/arc1/ch19-crew-we-choose.png", "crop": [0, 0.0, 1, 0.25], "text": "Mezstorm finds her place aboard the Crimson Tide through scenes with the people already aboard.", "caption": "The Crew We Choose"}, {"image": "assets/comics/arc1/ch19-crew-we-choose.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Crew We Choose"}, {"image": "assets/comics/arc1/ch19-crew-we-choose.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Crew We Choose"}, {"image": "assets/comics/arc1/ch19-crew-we-choose.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Crew We Choose"}],
    20:[{"image": "assets/comics/arc1/ch20-senedra.png", "crop": [0, 0.0, 1, 0.25], "text": "The woman at the lighthouse is finally brought into the crew’s story—but not because someone defeated her guardian.", "caption": "Senedra — The Watchful Signal"}, {"image": "assets/comics/arc1/ch20-senedra.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Senedra — The Watchful Signal"}, {"image": "assets/comics/arc1/ch20-senedra.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Senedra — The Watchful Signal"}, {"image": "assets/comics/arc1/ch20-senedra.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Senedra — The Watchful Signal"}],
    21:[{"image": "assets/comics/arc1/ch21-zaki.png", "crop": [0, 0.0, 1, 0.25], "text": "Zaki’s prison-hulk survival reveals the careful planner beneath the fighter.", "caption": "Zaki — The Planner"}, {"image": "assets/comics/arc1/ch21-zaki.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Zaki — The Planner"}, {"image": "assets/comics/arc1/ch21-zaki.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Zaki — The Planner"}, {"image": "assets/comics/arc1/ch21-zaki.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Zaki — The Planner"}],
    22:[{"image": "assets/comics/arc1/ch22-mezstorm.png", "crop": [0, 0.0, 1, 0.25], "text": "Mezstorm confronts the strange regeneration and transformation that make her different in Crimson Tide.", "caption": "Mezstorm — The Regeneration"}, {"image": "assets/comics/arc1/ch22-mezstorm.png", "crop": [0, 0.25, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Mezstorm — The Regeneration"}, {"image": "assets/comics/arc1/ch22-mezstorm.png", "crop": [0, 0.5, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Mezstorm — The Regeneration"}, {"image": "assets/comics/arc1/ch22-mezstorm.png", "crop": [0, 0.75, 1, 0.25], "text": "The story continues through the scene above. Tap to continue.", "caption": "Mezstorm — The Regeneration"}],
    23:[{"image": "assets/comics/arc1/ch23-siblings.png", "crop": [0, 0.0, 1, 0.3333333333333333], "text": "Senedra and Zaki remember each other as siblings, but not Aisyah, San, Mezstorm, or Eliz.", "caption": "The Two Who Remembered"}, {"image": "assets/comics/arc1/ch23-siblings.png", "crop": [0, 0.3333333333333333, 1, 0.3333333333333333], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Two Who Remembered"}, {"image": "assets/comics/arc1/ch23-siblings.png", "crop": [0, 0.6666666666666666, 1, 0.3333333333333333], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Two Who Remembered"}],
    24:[{"image": "assets/comics/arc1/ch24-drowned-passage.png", "crop": [0, 0.0, 1, 0.3333333333333333], "text": "Aldric and Wren join the reunited crew as the Drowned Admiral guards the way beyond the charts.", "caption": "The Drowned Passage"}, {"image": "assets/comics/arc1/ch24-drowned-passage.png", "crop": [0, 0.3333333333333333, 1, 0.3333333333333333], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Drowned Passage"}, {"image": "assets/comics/arc1/ch24-drowned-passage.png", "crop": [0, 0.6666666666666666, 1, 0.3333333333333333], "text": "The story continues through the scene above. Tap to continue.", "caption": "The Drowned Passage"}]
  };
  Object.keys(arc1PanelDefs).forEach(id => {
    const n=Number(id);
    if (typeof STORY_MODE_CHAPTERS !== 'undefined') STORY_MODE_CHAPTERS[n]=arc1PanelDefs[id];
  });

  const originalRenderStoryModePanel = window.renderStoryModePanel;
  window.renderStoryModePanel = function(){
    if(!storyModeChapter) return;
    const p=storyModeChapter[storyModeIndex];
    const panel=document.getElementById('storyModePanel');
    const counter=document.getElementById('storyModeCounter');
    if(!panel||!p) return;
    if(p.crop){
      // Rewritten crop renderer. The original used an absolutely-positioned
      // <img> with height:auto inside a percentage-height containing block —
      // percentage heights on absolutely positioned replaced elements are
      // only well-defined when the containing block has an explicit height,
      // and aspect-ratio-derived height doesn't reliably count as one across
      // browsers, so the image never actually zoomed and every panel in a
      // chapter showed nearly the same top sliver of the artwork. Using
      // background-size/background-position percentages instead avoids that
      // ambiguity entirely — both always resolve against the element's own
      // box, with no containing-block dependency.
      const [x,y,w,h]=p.crop;
      const bgSizeX = (100/w)+'%', bgSizeY = (100/h)+'%';
      const bgPosX = w>=1 ? '0%' : ((x/(1-w))*100)+'%';
      const bgPosY = h>=1 ? '0%' : ((y/(1-h))*100)+'%';
      const frameId = 'ctCropFrame'+Date.now();
      panel.innerHTML =
        '<div id="'+frameId+'" class="ct-v62-crop-frame" role="img" aria-label="Chapter '+storyModeChapterId+' story panel '+(storyModeIndex+1)+'" '+
        'style="width:100%;aspect-ratio:'+w+'/'+h+';background-color:#000;background-repeat:no-repeat;'+
        'background-image:url(\''+p.image+'\');background-size:'+bgSizeX+' '+bgSizeY+';background-position:'+bgPosX+' '+bgPosY+';">' +
        '</div><div class="story-mode-text"><div class="story-mode-speaker">'+esc(p.caption)+'</div><div class="story-mode-caption">'+esc(p.text)+'</div></div>' +
        '<div class="story-mode-tap">Tap the screen to continue</div>';
      if(counter) counter.textContent=(storyModeIndex+1)+' / '+storyModeChapter.length;
      window.scrollTo({top:0,left:0,behavior:'instant'});
      // The frame's own aspect-ratio uses the crop's raw w/h fraction as a
      // placeholder (correct only if the source image happens to be square).
      // Once the real image dimensions are known, correct it to the true
      // pixel aspect ratio of the cropped region so the frame itself isn't
      // stretched or squashed relative to the source art.
      const probe = new Image();
      probe.onload = function(){
        const frameEl = document.getElementById(frameId);
        if(!frameEl || !probe.naturalWidth || !probe.naturalHeight) return;
        const trueRatio = (w*probe.naturalWidth) / (h*probe.naturalHeight);
        frameEl.style.aspectRatio = trueRatio;
      };
      probe.src = p.image;
      return;
    }
    if(originalRenderStoryModePanel) return originalRenderStoryModePanel();
  };

  /* The new story chain deliberately uses the live game state as the source of truth.
     Chapters 5–24 remain sequential, while the three major rescue encounters are
     explicitly gated just like Joel. */
  const oldObjectiveState = window.objectiveState;
  window.objectiveState = function(){
    if(!game) return oldObjectiveState ? oldObjectiveState() : null;
    if(!game.comicProgress?.[1]) return 'begin_chapter_1';
    if(level()<5) return 'reach_level_5';
    if(!game.foundCompanions?.joel){
      // Reconciliation guard: Joel can be recruited directly via the guardian
      // fight, out of order with Chapters 2-4 (this path already exists in
      // the base game). Without this, foundCompanions.joel flipping true
      // early would permanently skip past 2-4 below with no way back, since
      // this whole branch is only ever checked while joel is still unfound.
      if(game.foundCompanions?.joel === undefined) game.foundCompanions = game.foundCompanions||{};
      if(game.location!=='malacca') return 'sail_malacca';
      if(!game.comicProgress?.[2]) return 'complete_chapter_2';
      if(!game.temporaryCrew?.length) return 'recruit_crew';
      if(!game.comicProgress?.[3]) return 'complete_chapter_3';
      if(!game.malaccaPrepStep) return 'plan_with_crew';
      if(game.malaccaPrepStep===1) return 'talk_to_joel';
      if(game.malaccaPrepStep===2) return 'change_plan';
      if(!game.comicProgress?.[4]) return 'complete_chapter_4';
      return 'recruit_joel';
    } else if(!game.comicProgress?.[2] || !game.comicProgress?.[3] || !game.comicProgress?.[4]) {
      // Joel was found before finishing 2-4 (e.g. direct guardian fight).
      // Patch those chapters closed instead of leaving them stuck forever.
      game.comicProgress[2]=true; game.comicProgress[3]=true; game.comicProgress[4]=true;
      if(!game.malaccaPrepStep) game.malaccaPrepStep=3;
      if(typeof saveGame==='function') saveGame();
    }
    // Chapters 5-8 (Joel's own arc — first meeting, rescue, aftermath, and
    // the search's close) previously had no gate anywhere in this chain
    // either, same bug as 14/16/17 below: reachable via requestStoryMode's
    // own guard, but never actually requested by objectiveState(), so
    // never surfaced as CURRENT and stayed permanently locked in the UI.
    if(!game.comicProgress?.[5]) return 'complete_chapter_5';
    if(!game.comicProgress?.[6]) return 'complete_chapter_6';
    if(!game.comicProgress?.[7]) return 'complete_chapter_7';
    if(!game.comicProgress?.[8]) return 'complete_chapter_8';
    if(!game.foundCompanions?.aisyah){
      if(game.location!=='palembang') return 'sail_palembang';
      if(!game.comicProgress?.[9]) return 'complete_chapter_9';
      if(!game.comicProgress?.[10]) return 'complete_chapter_10';
      if(!game.comicProgress?.[11]) return 'complete_chapter_11';
      if(!game.comicProgress?.[12]) return 'complete_chapter_12';
      if(!game.comicProgress?.[13]) return 'complete_chapter_13';
      return 'rescue_aisyah';
    } else if(!game.comicProgress?.[9] || !game.comicProgress?.[10] || !game.comicProgress?.[11] || !game.comicProgress?.[12] || !game.comicProgress?.[13]) {
      // Aisyah found before finishing 9-13 (e.g. direct guardian fight, or an
      // older save). Patch those chapters closed instead of leaving them
      // stuck forever — same reconciliation as Joel's chain above.
      game.comicProgress[9]=true; game.comicProgress[10]=true; game.comicProgress[11]=true;
      game.comicProgress[12]=true; game.comicProgress[13]=true;
      if(typeof saveGame==='function') saveGame();
    }
    // Chapters 14, 16, 17 previously had no gate anywhere in this chain and
    // were unreachable through normal play despite having full art+panels.
    // They sit narratively after Aisyah joins and before the Eliz arc.
    if(!game.comicProgress?.[14]) return 'complete_chapter_14';
    if(!game.comicProgress?.[16]) return 'complete_chapter_16';
    if(!game.comicProgress?.[17]) return 'complete_chapter_17';
    if(!game.foundCompanions?.eliz){
      if(game.location!=='batavia') return 'sail_batavia';
      if(!game.comicProgress?.[15]) return 'complete_chapter_15';
      return 'rescue_eliz';
    } else if(!game.comicProgress?.[15]) {
      // Same reconciliation as above: Eliz found before Chapter 15 closed.
      game.comicProgress[15]=true;
      if(typeof saveGame==='function') saveGame();
    }
    if(!game.foundCompanions?.mezstorm){
      if(game.location!=='bangkok') return 'sail_bangkok';
      if(!game.comicProgress?.[18]) return 'complete_chapter_18';
      return 'rescue_mezstorm';
    } else if(!game.comicProgress?.[18]) {
      // Same reconciliation again: Mezstorm found before Chapter 18 closed.
      game.comicProgress[18]=true;
      if(typeof saveGame==='function') saveGame();
    }
    if(!game.comicProgress?.[19]) return 'complete_chapter_19';
    if(!game.comicProgress?.[20]) return 'complete_chapter_20';
    if(!game.comicProgress?.[21]) return 'complete_chapter_21';
    if(!game.comicProgress?.[22]) return 'complete_chapter_22';
    if(!game.comicProgress?.[23]) return 'complete_chapter_23';
    if(!game.comicProgress?.[24]) return 'complete_chapter_24';
    return 'continue_voyage';
  };

  const oldRequestStoryMode = window.requestStoryMode;
  window.requestStoryMode = function(chapterId,delay=450){
    const id=Number(chapterId);
    const required={
      5:'complete_chapter_5',6:'complete_chapter_6',7:'complete_chapter_7',8:'complete_chapter_8',
      9:'complete_chapter_9',10:'complete_chapter_10',11:'complete_chapter_11',12:'complete_chapter_12',
      13:'complete_chapter_13',14:'complete_chapter_14',15:'complete_chapter_15',16:'complete_chapter_16',
      17:'complete_chapter_17',18:'complete_chapter_18',19:'complete_chapter_19',20:'complete_chapter_20',
      21:'complete_chapter_21',22:'complete_chapter_22',23:'complete_chapter_23',24:'complete_chapter_24'
    }[id];
    if(required && !game.comicProgress?.[id] && objectiveState()!==required){
      toast('🔒 Follow the current Objective first.');
      return;
    }
    if(game.comicProgress?.[id]) return;
    return oldRequestStoryMode ? oldRequestStoryMode(id,delay) : null;
  };

  const oldFinishStoryModeChapter = window.finishStoryModeChapter;
  window.finishStoryModeChapter = function(id){
    if(Number(id)>=5){
      game.comicProgress=game.comicProgress||{};
      const ch=ARC1_COMICS.find(x=>x.id===Number(id));
      if(ch && !game.comicProgress[id]){
        game.comicProgress[id]=true;
        gainXP(ch.xp); game.reputation=(game.reputation||0)+1;
        logEvent('📖 Story Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
        const nextMap={
          5:'complete_chapter_6',6:'complete_chapter_7',7:'complete_chapter_8',
          8:'sail_palembang',9:'complete_chapter_10',10:'complete_chapter_11',
          11:'complete_chapter_12',12:'complete_chapter_13',13:'complete_chapter_14',
          14:'complete_chapter_16',15:'rescue_eliz',16:'complete_chapter_17',
          17:'sail_batavia',18:'rescue_mezstorm',19:'complete_chapter_20',
          20:'complete_chapter_21',21:'complete_chapter_22',22:'complete_chapter_23',
          23:'complete_chapter_24',24:'continue_voyage'
        };
        if(typeof setArc1Objective==='function') setArc1Objective(nextMap[id]||'continue_voyage',ch.title);
        else game.arc1Objective=nextMap[id]||'continue_voyage';
        saveGameQuiet();
      }
      /* Reuse the existing V61 completion screen safely by calling the original
         only for its UI mechanics would duplicate its objective handling, so render
         a compact equivalent here. */
      const overlay=document.getElementById('storyModeOverlay');
      const shell=overlay?.querySelector('.story-mode-shell');
      if(shell){
        shell.innerHTML='<div class="story-mode-end"><div class="story-mode-kicker">Chapter Complete</div><h2>'+esc(ch?.title||('Chapter '+id))+'</h2><p>The chapter is complete. Your current Objective is now updated.</p><div style="color:var(--gold);font-family:Cinzel;margin-bottom:18px;">📖 Story XP +'+(ch?.xp||35)+'</div><button id="storyModeCloseBtn" type="button" class="btn btn-success" onclick="continueStoryFlow('+id+'); return false;">CONTINUE</button></div>';
      }
      return;
    }
    return oldFinishStoryModeChapter ? oldFinishStoryModeChapter(id) : null;
  };

  /* Guardian gate wrapper. Keep optional Senedra/Zaki rematches intact. */
  const oldStartGuardianFight=window.startGuardianFight;
  window.startGuardianFight=function(portId){
    if(portId==='palembang' && !game.foundCompanions?.aisyah && objectiveState()!=='rescue_aisyah'){
      toast('🔒 The Debt Collector is locked. Complete the current Objective first.'); return;
    }
    if(portId==='batavia' && !game.foundCompanions?.eliz && objectiveState()!=='rescue_eliz'){
      toast('🔒 The Plague Hulk is locked. Complete the current Objective first.'); return;
    }
    if(portId==='bangkok' && !game.foundCompanions?.mezstorm && objectiveState()!=='rescue_mezstorm'){
      toast('🔒 The Storm Idol is locked. Complete the current Objective first.'); return;
    }
    return oldStartGuardianFight ? oldStartGuardianFight(portId) : null;
  };

  /* Arrival objectives for the three rescue ports. */
  const oldTriggerArrivalStory=window.triggerArrivalStory;
  window.triggerArrivalStory=function(portId){
    if(portId==='palembang' && !game.foundCompanions?.aisyah){
      setArc1Objective('complete_chapter_9','reached Palembang');
      renderMainGoal(); renderStory(); saveGameQuiet(); return;
    }
    if(portId==='batavia' && !game.foundCompanions?.eliz){
      setArc1Objective('complete_chapter_15','reached Batavia');
      renderMainGoal(); renderStory(); saveGameQuiet(); return;
    }
    if(portId==='bangkok' && !game.foundCompanions?.mezstorm){
      setArc1Objective('complete_chapter_18','reached Bangkok');
      renderMainGoal(); renderStory(); saveGameQuiet(); return;
    }
    return oldTriggerArrivalStory ? oldTriggerArrivalStory(portId) : null;
  };

  /* Expand Story tab to the complete Arc I list. */
  const oldRenderStory=window.renderStory;
  window.renderStory=function(){
    const container=document.getElementById('storyContent');
    if(!container || typeof ARC1_COMICS==='undefined') return oldRenderStory ? oldRenderStory() : null;
    const so=objectiveState();
    let html='<section class="story-act story-quest-panel"><div class="story-act-header"><div class="story-act-kicker">Arc I</div><div class="story-act-title">The First Voyage</div><div class="story-act-tagline">24 story chapters. Manual Story Mode. Your Objective determines what is ready.</div></div>';
    ARC1_COMICS.forEach(ch=>{
      const done=!!game.comicProgress?.[ch.id];
      // Chapter 1 is a special case: objectiveState() names its "ready" state
      // 'begin_chapter_1', not 'complete_chapter_1' like every other chapter.
      // Comparing it against the generic 'complete_chapter_N' pattern meant
      // Chapter 1 could never match and always rendered as locked, even at
      // the very start of a new game.
      const requiredState = ch.id===1 ? 'begin_chapter_1' : ('complete_chapter_'+ch.id);
      const ready=!done && so===requiredState;
      const special=(ch.id===13&&!game.foundCompanions?.aisyah)?'RESCUE NEXT':(ch.id===15&&!game.foundCompanions?.eliz)?'RESCUE NEXT':(ch.id===18&&!game.foundCompanions?.mezstorm)?'RESCUE NEXT':'';
      const status=done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      const action=ready?'<button class="btn btn-small btn-success" onclick="requestStoryMode('+ch.id+',80)">READ CHAPTER</button>':special?'<div class="story-chip">Prepare for the rescue objective.</div>':'<div class="story-chip">Follow the current Objective.</div>';
      html+='<article class="quest-item '+(done?'completed':'')+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br><span style="font-size:.82rem;opacity:.82;">'+esc(ch.tag)+'</span><br><span style="font-size:.78rem;">'+status+'</span><div class="story-actions">'+action+'</div></article>';
    });
    html+='</section>';
    container.innerHTML=html;
  };
})();
