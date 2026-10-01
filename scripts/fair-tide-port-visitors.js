(function(){
  // -------------------------------------------------------------------
  // PORT VISITORS — a rotating cast of travelers passing through Fair
  // Tide, per San's own framing: "now that Fair Tide has become
  // important... most don't need names or quests. Occasionally one
  // generates a Request. That makes Arc XXIII's growth actually
  // visible in gameplay." Gated behind game.arc23Complete, the exact
  // story milestone San pointed to.
  //
  // At most one visitor at Fair Tide at a time, staying for 1-2 Veyren
  // story days before moving on, rolled once per new game day (never
  // per render/click) -- same cadence as fair-tide-hobbies.js and
  // fair-tide-crew-conversations.js, since this is about the state of
  // Fair Tide in the story world, not the real-world calendar (that's
  // what veyren-weather.js/real-calendar-events.js are for).
  //
  // "Occasionally generates a Request" is deliberately NOT wired into
  // the real Fair Tide Requests system (fairtide-systems.js) -- that
  // system has its own slot limits, chapter gates, and established UI
  // this file has no business reaching into. Instead a visitor's own
  // request is a small, self-contained claim (modest gold + Mood + a
  // permanent Codex memory), the same shape as a festival or birthday
  // celebration rather than a real settlement Request.
  //
  // Registers its own Tide Story source (visitor_echo, afternoon slot)
  // once a visitor is actually present, same extension pattern as
  // fair-tide-hobbies.js/fair-tide-crew-conversations.js.
  // -------------------------------------------------------------------

  const VISITOR_TYPES = [
    { id:'trader',         icon:'🧺', label:'Traveling Trader',               flavor:'Laid out an odd little collection of goods near the docks and is doing brisker business than expected.' },
    { id:'fisherman',      icon:'🎣', label:'Fisherman',                      flavor:"Pulled in somewhere unfamiliar and decided Fair Tide's harbor looked promising enough to try." },
    { id:'healer',         icon:'🩺', label:'Travelling Healer',              flavor:'Offered to look at a few minor aches and complaints while passing through. Several people took her up on it.' },
    { id:'musician',       icon:'🎵', label:'Musician',                      flavor:"Started playing near the Commons and hasn't stopped since. Nobody's complaining." },
    { id:'refugee',        icon:'🧳', label:'Refugee',                        flavor:'Arrived with very little and a lot of questions about where Fair Tide actually stands these days.' },
    { id:'scholar',        icon:'📜', label:'Scholar',                        flavor:"Asked Renn an extremely specific question and then stayed to argue about the answer for an hour." },
    { id:'sailor',         icon:'⛵', label:'Sailor',                         flavor:'Swapped stories with the crew about routes and weather neither side had heard of before.' },
    { id:'settlement_rep', icon:'🏘️', label:'Visitor from Another Settlement', flavor:'Came specifically to see what all the talk about Fair Tide has actually been about.' }
  ];
  window.PORT_VISITOR_TYPES = VISITOR_TYPES;

  const VISITOR_REQUEST_TEXT = [
    'Could use a hand getting a few things to the next port over.',
    "Lost track of something small on the way here -- wouldn't mind help finding it.",
    'Would appreciate an extra set of hands for an hour or two before moving on.'
  ];

  function portVisitorsUnlocked(){
    return !!game.arc23Complete;
  }
  window.portVisitorsUnlocked = portVisitorsUnlocked;

  function portVisitorsState(){
    if (!game.portVisitors) game.portVisitors = { current: null, log: [], lastRollDay: null };
    return game.portVisitors;
  }
  window.portVisitorsState = portVisitorsState;

  const ARRIVAL_CHANCE = 0.3;
  const REQUEST_CHANCE = 0.25;
  const MIN_STAY_DAYS = 1, MAX_STAY_DAYS = 2;
  const MAX_LOG = 20;

  function rollPortVisitors(){
    if (!portVisitorsUnlocked()) return;
    const state = portVisitorsState();
    const today = game.day || 0;
    if (state.lastRollDay === today) return; // once per new game day, never per render/click
    state.lastRollDay = today;

    if (state.current && today >= state.current.departureDay) {
      state.log.push({ id: state.current.id, icon: state.current.icon, label: state.current.label, departedDay: today });
      if (state.log.length > MAX_LOG) state.log.splice(0, state.log.length - MAX_LOG);
      state.current = null;
    }

    if (!state.current && Math.random() < ARRIVAL_CHANCE) {
      const type = VISITOR_TYPES[Math.floor(Math.random() * VISITOR_TYPES.length)];
      const stay = MIN_STAY_DAYS + Math.floor(Math.random() * (MAX_STAY_DAYS - MIN_STAY_DAYS + 1));
      const hasRequest = Math.random() < REQUEST_CHANCE;
      state.current = {
        id: type.id, icon: type.icon, label: type.label, flavor: type.flavor,
        arrivalDay: today, departureDay: today + stay,
        hasRequest: hasRequest,
        requestText: hasRequest ? VISITOR_REQUEST_TEXT[Math.floor(Math.random() * VISITOR_REQUEST_TEXT.length)] : null,
        requestClaimed: false
      };
    }
  }

  const oldSyncArc1ForPortVisitors = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForPortVisitors) oldSyncArc1ForPortVisitors();
    rollPortVisitors();
  };

  window.claimPortVisitorRequest = function(){
    const state = portVisitorsState();
    const visitor = state.current;
    if (!visitor || !visitor.hasRequest || visitor.requestClaimed) return;
    visitor.requestClaimed = true;
    game.gold = (game.gold || 0) + 15;
    if (typeof window.addFairTideMood === 'function') window.addFairTideMood(3);
    if (!game.festivalMemories) game.festivalMemories = [];
    game.festivalMemories.push({ id: 'visitor_' + visitor.id, text: 'A ' + visitor.label.toLowerCase() + ' passing through Fair Tide needed a small hand -- and got one.', day: game.day || 0 });
    toast('🤝 Helped out the ' + visitor.label + '. — +15 gold, +3 Fair Tide Mood.', 3600);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderArchiveScreen === 'function') window.renderArchiveScreen();
  };

  function renderPortVisitorsPanel(){
    if (!portVisitorsUnlocked()) return '';
    const state = portVisitorsState();
    const visitor = state.current;
    let html = '<div class="panel-title" style="margin-top:16px;">⚓ Port Visitors</div>';
    if (visitor) {
      const daysLeft = Math.max(0, visitor.departureDay - (game.day || 0));
      html += '<article class="quest-item"><strong>'+esc(visitor.icon)+' '+esc(visitor.label)+'</strong><br>'+
        '<span style="font-size:.8rem;opacity:.85;">'+esc(visitor.flavor)+'</span><br>'+
        '<span style="font-size:.74rem;opacity:.6;">Staying '+daysLeft+' more day'+(daysLeft===1?'':'s')+'.</span>';
      if (visitor.hasRequest) {
        html += '<br><span style="font-size:.78rem;opacity:.8;margin-top:4px;display:inline-block;">"'+esc(visitor.requestText)+'"</span>';
        html += visitor.requestClaimed
          ? '<br><span style="font-size:.76rem;opacity:.65;">✓ Already helped.</span>'
          : '<div style="margin-top:6px;"><button class="btn btn-small btn-success" onclick="claimPortVisitorRequest()">🤝 Help Out</button></div>';
      }
      html += '</article>';
    } else {
      html += '<article class="quest-item"><span style="font-size:.78rem;opacity:.7;">Nobody new at the docks right now.</span></article>';
    }
    if (state.log.length) {
      html += '<div style="font-size:.74rem;opacity:.7;margin-top:10px;">Recently Departed</div>';
      html += '<div style="font-size:.72rem;opacity:.65;line-height:1.6;">';
      state.log.slice(-6).reverse().forEach(function(e){
        html += esc(e.icon) + ' ' + esc(e.label) + ' <span style="opacity:.6;">(Day '+e.departedDay+')</span><br>';
      });
      html += '</div>';
    }
    return html;
  }
  window.renderPortVisitorsPanel = renderPortVisitorsPanel;

  const oldRenderArchiveScreenForPortVisitors = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForPortVisitors) oldRenderArchiveScreenForPortVisitors();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('portVisitorsPanelWrap');
    if (existing) existing.remove();
    const panel = renderPortVisitorsPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="portVisitorsPanelWrap">'+panel+'</div>');
  };

  // -------------------------------------------------------------------
  // Tide Story extension.
  // -------------------------------------------------------------------
  if (typeof window.registerTideStorySource === 'function') {
    window.registerTideStorySource({
      id: 'visitor_echo', slot: 'afternoon',
      eligible: function(){ return portVisitorsUnlocked() && !!portVisitorsState().current; },
      generate: function(){
        const visitor = portVisitorsState().current;
        if (!visitor) return null;
        return { icon: visitor.icon, title: visitor.label + ' at the Docks', text: visitor.flavor };
      }
    });
  }
})();
