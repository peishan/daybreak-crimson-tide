(function(){
  // -------------------------------------------------------------------
  // CREW CONVERSATIONS — a random "Overheard at Fair Tide" system,
  // per San's own framing: tiny dialogue snippets that remind the
  // player of relationships without requiring entire chapters. Same
  // occasional-not-guaranteed shape as fair-tide-hobbies.js (35% chance
  // per new Veyren story day, capped at one), same per-speaker
  // eligibility discipline, same reward-free framing.
  //
  // Registers its own Tide Story source (conversation_echo, afternoon
  // slot) so a snippet can surface there too, giving the afternoon slot
  // a second real source alongside fair-tide-flavour-events.js's own
  // flavour_echo.
  // -------------------------------------------------------------------

  const CONVERSATIONS = [
    { id:'renn_mimi_erynn', characters:['renn','mimi','erynn'], lines:[
      {speaker:'Renn', line:"Where's Erynn?"},
      {speaker:'Mimi', line:'Observatory.'},
      {speaker:'Renn', line:'Since when?'},
      {speaker:'Mimi', line:'Yesterday.'}
    ]},
    { id:'san_joel_twins', characters:['san','joel','children_unlocked','soel_unlocked'], lines:[
      {speaker:'Joel', line:"Where's Soel?"},
      {speaker:'San', line:'With the twins.'},
      {speaker:'Joel', line:'Where are the twins?'},
      {speaker:'San', line:'...We should go check.'}
    ]},
    { id:'san_joel_whereabouts', characters:['san','joel','children_unlocked'], lines:[
      {speaker:'San', line:'Where are the twins?'},
      {speaker:'Joel', line:"Soel's with them."},
      {speaker:'San', line:"That wasn't my question."}
    ]},
    { id:'san_ate_joy', characters:['san','ate_joy'], lines:[
      {speaker:'San', line:'Ate, have you seen Joel?'},
      {speaker:'Joy', line:"Workshop. With Caelan. Don't ask."},
      {speaker:'San', line:'...Why wouldn\'t I ask?'},
      {speaker:'Joy', line:"You'll see."}
    ]},
    { id:'aisyah_mez_deal', characters:['aisyah','mezstorm'], lines:[
      {speaker:'Aisyah', line:'You undersold that.'},
      {speaker:'Mez', line:'I got exactly what I wanted.'},
      {speaker:'Aisyah', line:"That's not the same thing."}
    ]},
    { id:'senedra_zaki_watch', characters:['senedra','zaki'], lines:[
      {speaker:'Zaki', line:'Anything out there?'},
      {speaker:'Senedra', line:'Always.'},
      {speaker:'Zaki', line:"That's not an answer."},
      {speaker:'Senedra', line:"It's the only one I've got."}
    ]},
    { id:'erynn_renn_archive', characters:['renn','erynn','mimi'], lines:[
      {speaker:'Erynn', line:'Has anyone seen Renn?'},
      {speaker:'Mimi', line:'Archive.'},
      {speaker:'Erynn', line:'Of course.'}
    ]},
    { id:'caelan_joy_shelf', characters:['caelan','ate_joy'], lines:[
      {speaker:'Caelan', line:'I have a proposal.'},
      {speaker:'Joy', line:'For the settlement?'},
      {speaker:'Caelan', line:'For the shelf.'},
      {speaker:'Joy', line:'...What shelf?'}
    ]},
    { id:'maera_san_captain', characters:['maera_roster','san'], lines:[
      {speaker:'Maera', line:"You're doing the thing again."},
      {speaker:'San', line:'What thing?'},
      {speaker:'Maera', line:'The Captain thing. Where you decide instead of asking.'},
      {speaker:'San', line:'...That\'s my job.'},
      {speaker:'Maera', line:'I know.'}
    ]},
    { id:'brada_mimi_ballista', characters:['brada_shah','mimi'], lines:[
      {speaker:'Brada', line:'One more ballista.'},
      {speaker:'Mimi', line:'No.'},
      {speaker:'Brada', line:"You didn't even think about it."},
      {speaker:'Mimi', line:"I don't need to."}
    ]},
    { id:'lewis_aisy_rigging', characters:['lewis_ally','aisy_ally'], lines:[
      {speaker:'Lewis', line:"Something's wrong with the rigging."},
      {speaker:"Aisy'", line:'No, it isn\'t.'},
      {speaker:'Lewis', line:'...How do you already know that?'},
      {speaker:"Aisy'", line:'I checked it an hour ago.'}
    ]},
    { id:'zul_jonathan_manifest', characters:['zul_ally','jonathan_ally'], lines:[
      {speaker:'Zul', line:"Cargo's all aboard!"},
      {speaker:'Jonathan', line:"That's not what the manifest says."},
      {speaker:'Zul', line:"The manifest's wrong."},
      {speaker:'Jonathan', line:'...I wrote the manifest.'}
    ]},
    { id:'elva_selina_current', characters:['elva_ally','selina_ally'], lines:[
      {speaker:'Elva', line:"Current's shifting east."},
      {speaker:'Selina', line:'Noted.'},
      {speaker:'Elva', line:"That's it?"},
      {speaker:'Selina', line:'What else is there?'}
    ]},
    { id:'wei_liang_lewis_ballista', characters:['wei_liang_ally','lewis_ally'], lines:[
      {speaker:'Lewis', line:"It's one more ballista."},
      {speaker:'Wei Liang', line:"It's one more ballista we can't afford."},
      {speaker:'Lewis', line:'We could sell something.'},
      {speaker:'Wei Liang', line:'We are not selling the ship.'}
    ]},
    { id:'theo_jorvin_unconventional', characters:['theo_ally','jorvin'], lines:[
      {speaker:'Theo', line:"It's not broken. It's unconventional."},
      {speaker:'Jorvin', line:"It's broken."},
      {speaker:'Theo', line:"...It's also broken."}
    ]},
    { id:'suzie_intan_nickname', characters:['suzie_ally','intan_ally'], lines:[
      {speaker:'Suzie', line:"Mimi's calling you Tan again."},
      {speaker:'Intan', line:"I've noticed."},
      {speaker:'Suzie', line:'You could tell her to stop.'},
      {speaker:'Intan', line:'I could.'}
    ]},
    { id:'chiu_may_lewis_voice', characters:['chiu_may_ally','lewis_ally'], lines:[
      {speaker:'Chiu May', line:"You're doing the voice again."},
      {speaker:'Lewis', line:'What voice?'},
      {speaker:'Chiu May', line:"The supervisor voice. On people who don't work for you anymore."},
      {speaker:'Lewis', line:'Force of habit.'}
    ]}
  ];
  window.FAIR_TIDE_CREW_CONVERSATIONS = CONVERSATIONS;

  // Generic '<id>_ally' token: true once that id is both registered AND
  // currently eligible in FAIR_TIDE_ALLY_NETWORK (fair-tide-ally-
  // network.js) -- covers Lewis's own Steady Reach crew and the TM
  // colleagues (Suzie, Chiu May, Intan) the same way, without a
  // one-off branch per name. They're never game.foundCompanions (never
  // recruited, never relocated to Fair Tide -- see arc39.js's own
  // restraint), so the default foundCompanions check below would never
  // fire for them; this is the same kind of named special case
  // maera_roster already is, just written once for the whole network
  // instead of per person.
  function allyNetworkEligible(id){
    if (typeof window.FAIR_TIDE_ALLY_NETWORK === 'undefined') return false;
    const entry = window.FAIR_TIDE_ALLY_NETWORK.find(function(a){ return a.id === id; });
    return !!(entry && (!entry.eligible || entry.eligible()));
  }

  function characterEligible(token){
    if (token === 'san') return true;
    if (token === 'maera_roster') return !!(game.fairTideRoster && game.fairTideRoster.maera);
    if (token === 'children_unlocked') return !!(typeof window.fairTideChildrenUnlocked === 'function' && window.fairTideChildrenUnlocked());
    if (token === 'soel_unlocked') return !!(typeof level === 'function' && level() >= 10);
    if (token.slice(-5) === '_ally') {
      const id = token.slice(0, -5);
      if (allyNetworkEligible(id)) return true;
      // Lewis and the Steady Reach crew move to the Roster after Arc XXXIX
      // (steady-reach-settles.js) and leave the Wider Ally Network, but their
      // banter should carry on.
      return !!(game.fairTideRoster && game.fairTideRoster[id] && window.STEADY_REACH_CREW && window.STEADY_REACH_CREW.some(function(c){ return c.id === id; }));
    }
    return !!(game.foundCompanions && game.foundCompanions[token]);
  }

  function conversationEligible(convo){
    return convo.characters.every(characterEligible);
  }

  function eligibleConversations(){
    return CONVERSATIONS.filter(conversationEligible);
  }
  window.eligibleFairTideCrewConversations = eligibleConversations;

  const ROLL_CHANCE = 0.35;
  const MAX_LOG = 30;

  function conversationState(){
    if (!game.fairTideConversations) game.fairTideConversations = { log: [], lastRollDay: null };
    return game.fairTideConversations;
  }
  window.fairTideConversationState = conversationState;

  function rollTodaysConversation(){
    const state = conversationState();
    const today = game.day || 0;
    if (state.lastRollDay === today) return; // once per new game day, never per render/click
    state.lastRollDay = today;
    if (Math.random() >= ROLL_CHANCE) return;
    const pool = eligibleConversations();
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    state.log.push({ id: pick.id, lines: pick.lines, day: today });
    if (state.log.length > MAX_LOG) state.log.splice(0, state.log.length - MAX_LOG);
  }

  const oldSyncArc1ForConversations = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForConversations) oldSyncArc1ForConversations();
    rollTodaysConversation();
  };

  function renderConversationLines(lines){
    return lines.map(function(l){ return '<strong>'+esc(l.speaker)+':</strong> "'+esc(l.line)+'"'; }).join('<br>');
  }

  function renderFairTideCrewConversationsPanel(){
    const state = conversationState();
    if (!state.log.length) return '';
    const today = game.day || 0;
    const todays = state.log.filter(function(e){ return e.day === today; });
    let html = '<div class="panel-title" style="margin-top:16px;">💬 Overheard at Fair Tide</div>';
    if (todays.length) {
      todays.forEach(function(e){
        html += '<article class="quest-item">'+renderConversationLines(e.lines)+'</article>';
      });
    }
    const earlier = state.log.filter(function(e){ return e.day !== today; });
    if (earlier.length) {
      html += '<div style="font-size:.74rem;opacity:.7;margin-top:10px;">Earlier</div>';
      html += '<div style="font-size:.72rem;opacity:.65;line-height:1.6;">';
      earlier.slice(-8).reverse().forEach(function(e){
        html += esc(e.lines[0].speaker) + ': "' + esc(e.lines[0].line) + '..." <span style="opacity:.6;">(Day '+e.day+')</span><br>';
      });
      html += '</div>';
    }
    return html;
  }
  window.renderFairTideCrewConversationsPanel = renderFairTideCrewConversationsPanel;

  const oldRenderArchiveScreenForConversations = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForConversations) oldRenderArchiveScreenForConversations();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('fairTideCrewConversationsPanelWrap');
    if (existing) existing.remove();
    const panel = renderFairTideCrewConversationsPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="fairTideCrewConversationsPanelWrap">'+panel+'</div>');
  };

  // -------------------------------------------------------------------
  // Tide Story extension.
  // -------------------------------------------------------------------
  if (typeof window.registerTideStorySource === 'function') {
    window.registerTideStorySource({
      id: 'conversation_echo', slot: 'afternoon',
      eligible: function(){
        const today = game.day || 0;
        return conversationState().log.some(function(e){ return e.day === today; });
      },
      generate: function(){
        const today = game.day || 0;
        const todays = conversationState().log.filter(function(e){ return e.day === today; });
        if (!todays.length) return null;
        const pick = todays[Math.floor(Math.random() * todays.length)];
        return { icon: '💬', title: 'Overheard', text: pick.lines.map(function(l){ return l.speaker + ': "' + l.line + '"'; }).join(' / ') };
      }
    });
  }
})();
