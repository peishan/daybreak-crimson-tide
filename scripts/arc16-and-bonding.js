(function(){
  // -------------------------------------------------------------------
  // ARC XVI — THE PRICE OF RARE THINGS. Only Chapter 1's wiring goes
  // live now, same pattern as every prior arc — San has the full
  // 25-chapter text already, but no chapter art exists yet, and gating
  // has always tracked what's actually playable, not how much text
  // exists upfront. Gated behind arc15Complete + level 240, continuing
  // the +15/arc pace (XIV=210, XV=225, XVI=240).
  // -------------------------------------------------------------------
  const ARC16_CHAPTERS = [
    {id:1, title:'The Material We Need', focus:"The Horizon Engine needs a rare material for its next upgrade. The crew begins researching where it might actually be found.", image:'assets/comics/arc16/ch01-the-material-we-need.png', xp:300, action:'🔍 Begin the Search'}
  ];
  window.ARC16_CHAPTERS = ARC16_CHAPTERS;

  window.arc16ObjectiveState = function(){
    if (!game.arc15Complete) return null;
    if (level() < 240) return null;
    game.comicProgress16 = game.comicProgress16 || {};
    for (const ch of ARC16_CHAPTERS) {
      if (!game.comicProgress16[ch.id]) return 'complete_arc16_chapter_' + ch.id;
    }
    return 'arc16_part1_complete_for_now';
  };

  const ARC16_CHAPTER_SCENES = {
    1: "The Horizon Engine needs something rare for its next upgrade — that much is clear from the readings alone.<br><br>What isn't clear is where to actually find it.<br><br>Renn buries herself in theory. Erynn goes looking for precedent. Between the two of them, a shape starts to form — not a location yet, but a direction worth sailing toward."
  };
  window.ARC16_CHAPTER_SCENES = ARC16_CHAPTER_SCENES;

  window.markArc16ChapterRead = function(id){
    id = Number(id);
    const ch = ARC16_CHAPTERS.find(c=>c.id===id);
    if(!ch){ console.warn('[Arc16] no chapter data for id', id); return; }
    game.comicProgress16 = game.comicProgress16||{};
    if(game.comicProgress16[id]){ toast('✓ Already marked read.'); return; }
    if(window.arc16ObjectiveState() !== 'complete_arc16_chapter_'+id){ toast('🔒 Follow the current Objective first.'); return; }
    game.comicProgress16[id] = true;
    if (id === 25) game.arc16Complete = true;
    gainXP(ch.xp);
    game.reputation = (game.reputation||0) + 1;
    logEvent('📖 Arc XVI Chapter '+id+' complete: '+ch.title+' · +'+ch.xp+' XP','gold');
    toast('📖 Chapter '+id+' complete! +'+ch.xp+' Story XP');
    if (ARC16_CHAPTER_SCENES[id]) {
      game.storyModalQueue = game.storyModalQueue || [];
      game.storyModalQueue.push({ title: ch.title, blurb: ARC16_CHAPTER_SCENES[id] });
    }
    if (typeof renderMainGoal === 'function') try { renderMainGoal(); } catch(e) {}
    if (typeof renderStory === 'function') try { renderStory(); } catch(e) {}
  };

  window.__ctShowArc16Splash = function(){
    const overlay = document.getElementById('arc16SplashOverlay');
    if (overlay) overlay.style.display = 'flex';
  };
  window.__ctCloseArc16Splash = function(){
    const overlay = document.getElementById('arc16SplashOverlay');
    if (overlay) overlay.style.display = 'none';
    game.arc16SplashSeen = true;
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderStoryForArc16 = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc16) oldRenderStoryForArc16();
    const container = document.getElementById('storyContent');
    if (!container) return;
    const arc16Ready = window.arc16ObjectiveState() !== null;
    if (arc16Ready && !game.arc16SplashSeen && typeof window.__ctShowArc16Splash === 'function') {
      window.__ctShowArc16Splash();
    }
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<div class="story-act-kicker">Arc XVI</div><div class="story-act-title">The Price of Rare Things</div>'+
      '<div class="story-act-tagline">Just because we can take something, does that mean we should?</div></div>';
    if (!arc16Ready) {
      html += '<div class="story-chapter locked"><div class="story-chapter-title">🔒 Arc XVI Locked</div><div class="story-chapter-sub">'+
        (!game.arc15Complete ? 'Finish Arc XV first.' : 'Reach Level 240 to begin.')+'</div></div></section>';
      container.insertAdjacentHTML('beforeend', html);
      return;
    }
    const so = window.arc16ObjectiveState();
    ARC16_CHAPTERS.forEach(function(ch){
      const done = !!(game.comicProgress16 && game.comicProgress16[ch.id]);
      const ready = !done && so===('complete_arc16_chapter_'+ch.id);
      const status = done?'✓ COMPLETE':(ready?'CURRENT':'🔒 LOCKED');
      let action;
      if (ready) action = '<a class="btn btn-small" style="text-decoration:none;display:inline-block;" href="'+ch.image+'" target="_blank" rel="noopener">📖 Open Chapter (new tab)</a> '+
        '<button class="btn btn-small btn-success" onclick="markArc16ChapterRead('+ch.id+')">'+esc(ch.action || '✓ Mark Chapter Read')+'</button>';
      else action = '<div class="story-chip">Follow the current Objective.</div>';
      html += '<article class="quest-item '+(done?'completed':(ready?'active':''))+'"><strong>Chapter '+ch.id+' — '+esc(ch.title)+'</strong><br>'+
        '<span style="font-size:.82rem;opacity:.82;">'+esc(ch.focus)+'</span><br>'+
        '<span style="font-size:.78rem;">'+status+'</span> <span style="font-size:.76rem;opacity:.75;">📖 Story XP: +'+ch.xp+'</span><div class="story-actions">'+action+'</div></article>';
    });
    if (so==='arc16_part1_complete_for_now'){
      html += '<div class="story-chapter" style="margin-top:8px;"><div class="story-chapter-sub">✓ All available Arc XVI chapters read so far. More chapters are on the way — check back soon.</div></div>';
    }
    html += '</section>';
    container.insertAdjacentHTML('beforeend', html);
  };
})();


(function(){
  // -------------------------------------------------------------------
  // SAN & JOEL — DISAGREEMENT & REPAIR. A major evolution of the
  // existing Bond system (bondTier/bondState in arc9-and-systems.js),
  // not a replacement — that system's points/tiers keep working exactly
  // as before. This adds a separate STATE layered on top, specific to
  // San & Joel: Connected -> Tension -> Understanding -> Repaired.
  //
  // Core principle, straight from San's own design: Bonding measures
  // how well people know, trust, and understand each other, not how
  // often they agree. So disagreement never subtracts bond points —
  // there's no numeric penalty anywhere in this file. A repaired
  // disagreement can make the bond MORE meaningful than if it had never
  // happened, via a permanent "Learned" flag future dialogue can check.
  //
  // Scope, per San's own direction: built for San & Joel specifically
  // for Arc XVI first, not generically for all 9 crew members yet, even
  // though the design doc gives every character their own disagreement
  // themes. Those are recorded in CREW_PERSPECTIVES below so extending
  // this to other pairs later is mostly data-entry, not a redesign.
  //
  // Trigger: exposed as window.triggerSanJoelDisagreement() rather than
  // wired to Arc XVI Ch.14 directly, since only Ch.1 exists as a
  // playable chapter right now. Hook this into markArc16ChapterRead's
  // id===14 branch once that chapter is actually added.
  // -------------------------------------------------------------------

  const CREW_PERSPECTIVES = {
    renn: { name: 'Renn', line: "The material reacts to magical energy — that part I can prove. Whether we SHOULD take it isn't a question my equipment answers." },
    erynn: { name: 'Erynn', line: "The historical records say it was protected centuries ago. That's not superstition. Someone learned something the hard way." },
    mimi: { name: 'Mimi', line: "I think we're missing something. I can't tell you what yet. But we are." },
    aisyah: { name: 'Aisyah', line: "If we push too hard here, word travels. The next port might not be as welcoming." },
    mez: { name: 'Mez', line: "We're already being watched differently because we're outsiders. Taking something we were told not to won't help that." },
    zaki: { name: 'Zaki', line: "Whatever we decide, we need to decide it before we're out of supplies to decide it slowly." }
  };
  window.SJ_CREW_PERSPECTIVES = CREW_PERSPECTIVES;

  const UNDERSTANDING_THRESHOLD = 3;

  function sjDisagreement(){
    game.sanJoelDisagreement = game.sanJoelDisagreement || {
      state: 'connected', // connected | tension | understanding | repaired
      issueId: null,
      understandingPoints: 0,
      repairStep: 0,
      learnedFlags: [],
      crewPerspectivesSeen: []
    };
    return game.sanJoelDisagreement;
  }
  window.sanJoelDisagreementState = sjDisagreement;

  window.triggerSanJoelDisagreement = function(){
    const d = sjDisagreement();
    if (d.state !== 'connected') { toast('Nothing new to bring up right now.'); return; }
    d.state = 'tension';
    d.issueId = 'rare_material';
    logEvent('⚡ San and Joel disagree over the rare material — the Horizon Engine\'s needs against what it would cost.', 'bad');
    toast('⚡ San and Joel disagree.', 3200);
    if (typeof showStoryModal === 'function') {
      setTimeout(function(){
        showStoryModal({
          title: '⚡ The Argument',
          blurb: "San wants to pursue the material more aggressively. The Engine needs it, and she's the one who has to make that work.<br><br>Joel thinks they're pushing too far, and says so.<br><br>Neither of them is being stupid. They're just prioritizing different things — and right now, that's enough to genuinely disagree about."
        });
      }, 400);
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderFairTideHub === 'function') try { renderFairTideHub(); } catch(e) {}
  };

  function checkUnderstandingThreshold(d){
    if (d.state === 'tension' && d.understandingPoints >= UNDERSTANDING_THRESHOLD) {
      d.state = 'understanding';
      logEvent('💭 San starts to understand what was really driving her — and turns to the crew instead of solving it alone.', 'gold');
      if (typeof showStoryModal === 'function') {
        setTimeout(function(){
          showStoryModal({
            title: '💭 You Don\'t Have to Decide Alone',
            blurb: "San keeps thinking: <i>I'm the captain. I should figure this out.</i><br><br>But she doesn't actually know what the right answer is. Not on her own.<br><br>She wasn't simply thinking <i>we need this material</i>. She was thinking <i>I brought everyone here. I need to make this work.</i><br><br>Joel doesn't have to be the one who gives her the answer. He's just one of the people she can actually rely on."
          });
        }, 400);
      }
    }
  }

  window.sjRespondPush = function(){
    const d = sjDisagreement();
    if (d.state !== 'tension') return;
    toast('"We don\'t have time for this." — the tension stays exactly where it was.', 3200);
    logEvent('San pushes the argument. Nothing is resolved.', 'bad');
  };

  window.sjRespondListen = function(){
    const d = sjDisagreement();
    if (d.state !== 'tension') return;
    d.understandingPoints++;
    toast('"Tell me why you think we shouldn\'t." — Understanding +1.', 3200);
    logEvent('San listens instead of pushing back. Understanding +1.', 'good');
    checkUnderstandingThreshold(d);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  window.sjRespondAskCrew = function(crewId){
    const d = sjDisagreement();
    if (d.state !== 'tension') return;
    const perspective = CREW_PERSPECTIVES[crewId];
    if (!perspective) return;
    if (d.crewPerspectivesSeen.indexOf(crewId) === -1) {
      d.crewPerspectivesSeen.push(crewId);
      d.understandingPoints++;
      logEvent('🧭 '+perspective.name+': "'+perspective.line+'"', 'good');
      toast('🧭 '+perspective.name+' weighs in. Understanding +1.', 3600);
      checkUnderstandingThreshold(d);
      if (typeof saveGameQuiet === 'function') saveGameQuiet();
    } else {
      toast(perspective.name+' already said their piece on this.');
    }
  };

  window.sjRespondWalkAway = function(){
    const d = sjDisagreement();
    if (d.state !== 'tension') return;
    toast('"I need time to think." — the tension holds, but at least it doesn\'t get worse.', 3200);
    logEvent('San takes a moment before responding. Tension holds, but doesn\'t escalate.', 'gold');
  };

  const REPAIR_STEPS = [
    { key:'acknowledge', label:'Acknowledge', line:'"I pushed too hard."' },
    { key:'understand', label:'Understand', line:'"You weren\'t trying to stop me. You were worried about what we\'d damage."' },
    { key:'accept', label:'Accept', line:'"I understand why you said it."' },
    { key:'move_forward', label:'Move Forward', line:'"Let\'s figure out another way."' }
  ];
  window.SJ_REPAIR_STEPS = REPAIR_STEPS;

  window.sjRepairStep = function(){
    const d = sjDisagreement();
    if (d.state !== 'understanding') return;
    if (d.repairStep >= REPAIR_STEPS.length) return;
    const step = REPAIR_STEPS[d.repairStep];
    d.repairStep++;
    toast(step.label+': '+step.line, 3600);
    logEvent('Repair — '+step.label+': '+step.line, 'good');
    if (d.repairStep >= REPAIR_STEPS.length) {
      d.state = 'repaired';
      if (d.learnedFlags.indexOf('joel_can_challenge_san') === -1) d.learnedFlags.push('joel_can_challenge_san');
      logEvent('❤️ Conflict Resolved: Rare Resource Disagreement.', 'gold');
      if (typeof showStoryModal === 'function') {
        setTimeout(function(){
          showStoryModal({
            title: '❤️ At Least You Know Now',
            blurb: "San: \"I should've listened.\"<br>Joel: \"Maybe.\"<br>San: \"You're still angry.\"<br>Joel: \"A little.\"<br>San: \"I'm sorry.\"<br>Joel: \"I know.\"<br><br>Pause.<br><br>Joel: \"At least you learned now.\"<br>San: \"That's your answer?\"<br>Joel: \"What else do you want me to say?\"<br>San: \"I don't know.\"<br>Joel: \"Then let's forget what happened and figure out what we do next.\"<br><br>Something in San's memory settles: <b>Learned — Joel can disagree with her without it threatening what they have.</b>"
          });
        }, 400);
      }
    }
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof renderFairTideHub === 'function') try { renderFairTideHub(); } catch(e) {}
  };

  // Renders the disagreement panel above the existing San & Joel bond
  // card when there's actually something to show — invisible the rest
  // of the time, so this never clutters the Bonds tab outside Arc XVI.
  function sjDisagreementPanelHtml(){
    const d = sjDisagreement();
    if (d.state === 'connected') return '';
    let html = '<article class="quest-item" style="border-color:rgba(232,197,71,.5);margin-bottom:10px;">'+
      '<strong>❤️ San ↔ Joel</strong> — <span style="opacity:.8;">Status: '+
      (d.state==='tension'?'Tension':d.state==='understanding'?'Understanding':'Repaired')+'</span><br>'+
      '<span style="font-size:.8rem;opacity:.8;">Issue: Different approaches to the rare material</span>';
    if (d.state === 'tension') {
      html += '<div style="font-size:.76rem;opacity:.65;margin-top:4px;">Understanding: '+d.understandingPoints+' / '+UNDERSTANDING_THRESHOLD+'</div>'+
        '<div class="story-actions" style="flex-wrap:wrap;gap:6px;margin-top:8px;">'+
        '<button class="btn btn-small" onclick="sjRespondPush()">"We don\'t have time for this."</button>'+
        '<button class="btn btn-small btn-success" onclick="sjRespondListen()">"Tell me why you think we shouldn\'t."</button>'+
        '<button class="btn btn-small" onclick="sjRespondWalkAway()">"I need time to think."</button></div>'+
        '<div style="font-size:.74rem;opacity:.65;margin-top:6px;">Ask the crew:</div>'+
        '<div class="story-actions" style="flex-wrap:wrap;gap:6px;">';
      Object.keys(CREW_PERSPECTIVES).forEach(function(cid){
        const seen = d.crewPerspectivesSeen.indexOf(cid) !== -1;
        html += '<button class="btn btn-small" '+(seen?'disabled':'')+' onclick="sjRespondAskCrew(\''+cid+'\')">'+(seen?'✓ ':'')+CREW_PERSPECTIVES[cid].name+'</button>';
      });
      html += '</div>';
    } else if (d.state === 'understanding') {
      const nextStep = REPAIR_STEPS[d.repairStep];
      html += '<div style="font-size:.76rem;opacity:.7;margin-top:6px;">Repair, step '+(d.repairStep+1)+' of '+REPAIR_STEPS.length+'</div>'+
        '<div class="story-actions" style="margin-top:6px;">'+
        '<button class="btn btn-small btn-success" onclick="sjRepairStep()">'+esc(nextStep.label)+': '+esc(nextStep.line)+'</button></div>';
    } else if (d.state === 'repaired') {
      html += '<div style="font-size:.76rem;opacity:.7;margin-top:6px;">✓ Resolved. Joel can disagree with San without it threatening their bond.</div>';
    }
    html += '</article>';
    return html;
  }
  window.sjDisagreementPanelHtml = sjDisagreementPanelHtml;

  const oldRenderBondsTabForSJ = window.renderBondsTab;
  window.renderBondsTab = function(){
    if (oldRenderBondsTabForSJ) oldRenderBondsTabForSJ();
    const el = document.getElementById('ft-tab-bonds');
    if (!el) return;
    const panel = sjDisagreementPanelHtml();
    if (panel) el.innerHTML = panel + el.innerHTML;
  };
})();
