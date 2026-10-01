(function(){
  // -------------------------------------------------------------------
  // TIDE STORIES — the skeleton San asked for: "combine several of
  // these ideas rather than building twelve separate interfaces." This
  // is a thin COMPOSITION layer over systems that already exist
  // (Veyren weather, real-calendar festivals, character birthdays,
  // flavour events, the twins' own growth/trouble state, Fair Tide
  // Mood) rather than a new standalone mechanic of its own. Each real
  // calendar day, it rolls up to one story per time-of-day slot
  // (Morning/Afternoon/Evening) from whichever of those systems has
  // something to say today, and logs it permanently.
  //
  // THE EXTENSION POINT (this is the actual "skeleton" part): every
  // story comes from an entry in window.TIDE_STORY_SOURCES, a plain
  // array of {id, slot, eligible(), generate(), fallback?} objects.
  // Later systems from San's own roadmap -- Hobbies, Crew
  // Conversations, Port Visitors, Settlement Memories, the Chronicle --
  // are meant to call window.registerTideStorySource(...) to add their
  // OWN sources once they exist, rather than this file ever growing to
  // hold all of them. The six sources defined below are deliberately
  // just enough to prove the system works today, each one reading an
  // already-existing system's own state rather than inventing new
  // generation logic:
  //
  //   - weather   (morning, fallback) — veyren-weather.js
  //   - festival  (morning)           — real-calendar-events.js
  //   - birthday  (morning)           — character-birthdays.js
  //   - flavour_echo (afternoon)      — fair-tide-flavour-events.js
  //     (surfaces one of TODAY's already-rolled flavour log entries
  //     rather than re-deriving character eligibility a second time)
  //   - mood      (afternoon, fallback) — fair-tide-mood.js
  //   - twin_growth_echo (evening)    — arc36-mechanics.js, if loaded
  //   - twin_trouble_echo (evening)   — arc36-mechanics.js, if loaded
  //
  // A `fallback: true` source only wins its slot when nothing else
  // eligible exists for that slot that day -- weather and Mood are
  // always eligible, so they're marked fallback precisely so a real
  // festival, birthday, or character moment takes priority over them
  // when one's actually happening. Evening has no fallback defined at
  // all yet, so a story without twin activity simply has no evening
  // entry some days -- expected and fine for a skeleton; later sources
  // (Hobbies, Crew Conversations) will fill that in naturally once they
  // register themselves.
  //
  // Keyed by the REAL calendar date (San's own explicit direction that
  // this stays independent of Veyren story chronology), rolled once per
  // real day regardless of render count, permanently logged and capped
  // the same way every other accumulating list in this codebase is.
  // -------------------------------------------------------------------

  function currentRealDate(){
    return (typeof window.__ctNow === 'function') ? window.__ctNow() : new Date();
  }

  function dateKey(date){
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  const TIDE_STORY_SOURCES = [
    {
      id: 'weather', slot: 'morning', fallback: true,
      eligible: function(){ return typeof window.todaysVeyrenWeather === 'function'; },
      generate: function(){
        const w = window.todaysVeyrenWeather();
        return w ? { icon: w.icon, title: w.label, text: w.desc } : null;
      }
    },
    {
      id: 'festival', slot: 'morning',
      eligible: function(){ return typeof window.activeFestivalsToday === 'function' && window.activeFestivalsToday().length > 0; },
      generate: function(){
        const active = window.activeFestivalsToday();
        if (!active.length) return null;
        const pick = active[Math.floor(Math.random() * active.length)];
        const def = window.FESTIVAL_DEFS && window.FESTIVAL_DEFS[pick.id];
        if (!def) return null;
        return { icon: def.icon, title: def.label, text: 'Fair Tide leans into ' + def.theme + ' traditions today.' };
      }
    },
    {
      id: 'birthday', slot: 'morning',
      eligible: function(){ return typeof window.todaysBirthdays === 'function' && window.todaysBirthdays().length > 0; },
      generate: function(){
        const active = window.todaysBirthdays();
        if (!active.length) return null;
        const pick = active[Math.floor(Math.random() * active.length)];
        return { icon: '🎂', title: "It's " + pick.name + "'s Birthday", text: 'The crew found a reason to celebrate today.' };
      }
    },
    {
      id: 'flavour_echo', slot: 'afternoon',
      eligible: function(){
        if (typeof window.fairTideFlavourState !== 'function') return false;
        const today = game.day || 0;
        return window.fairTideFlavourState().log.some(function(e){ return e.day === today; });
      },
      generate: function(){
        const today = game.day || 0;
        const todays = window.fairTideFlavourState().log.filter(function(e){ return e.day === today; });
        if (!todays.length) return null;
        const pick = todays[Math.floor(Math.random() * todays.length)];
        return { icon: pick.icon, title: 'Around Fair Tide', text: pick.text };
      }
    },
    {
      id: 'mood', slot: 'afternoon', fallback: true,
      eligible: function(){ return typeof window.fairTideMoodTier === 'function'; },
      generate: function(){
        const tier = window.fairTideMoodTier();
        return tier ? { icon: '🌊', title: tier.name, text: 'Fair Tide carries on, same as always.' } : null;
      }
    },
    {
      id: 'twin_growth_echo', slot: 'evening',
      eligible: function(){
        if (typeof window.growthMilestonesState !== 'function') return false;
        const today = game.day || 0;
        return window.growthMilestonesState().some(function(m){ return m.day === today; });
      },
      generate: function(){
        const today = game.day || 0;
        const todays = window.growthMilestonesState().filter(function(m){ return m.day === today; });
        if (!todays.length) return null;
        const pick = todays[Math.floor(Math.random() * todays.length)];
        return { icon: pick.icon, title: 'Growing Up', text: pick.label };
      }
    },
    {
      id: 'twin_trouble_echo', slot: 'evening',
      eligible: function(){ return !!(typeof window.twinTroubleState === 'function' && window.twinTroubleState().pending); },
      generate: function(){
        const pending = window.twinTroubleState().pending;
        return pending ? { icon: pending.icon, title: 'Twin Trouble', text: pending.text } : null;
      }
    }
  ];
  window.TIDE_STORY_SOURCES = TIDE_STORY_SOURCES;

  window.registerTideStorySource = function(def){
    if (!def || !def.id || !def.slot || typeof def.eligible !== 'function' || typeof def.generate !== 'function') return;
    if (TIDE_STORY_SOURCES.some(function(s){ return s.id === def.id; })) return; // idempotent against accidental double-registration
    TIDE_STORY_SOURCES.push(def);
  };

  const SLOTS = ['morning', 'afternoon', 'evening'];
  const MAX_LOG = 60;

  function tideStoriesState(){
    if (!game.tideStories) game.tideStories = { log: [], lastRollKey: null };
    return game.tideStories;
  }
  window.tideStoriesState = tideStoriesState;

  function eligibleSourcesForSlot(slot){
    return TIDE_STORY_SOURCES.filter(function(s){
      if (s.slot !== slot) return false;
      try { return !!s.eligible(); } catch (e) { return false; }
    });
  }

  function pickSourceForSlot(slot){
    const eligible = eligibleSourcesForSlot(slot);
    if (!eligible.length) return null;
    const nonFallback = eligible.filter(function(s){ return !s.fallback; });
    const pool = nonFallback.length ? nonFallback : eligible;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function rollTodaysTideStories(){
    const state = tideStoriesState();
    const now = currentRealDate();
    const key = dateKey(now);
    if (state.lastRollKey === key) return; // once per new real day, never per render/click
    state.lastRollKey = key;
    SLOTS.forEach(function(slot){
      const source = pickSourceForSlot(slot);
      if (!source) return;
      let entry = null;
      try { entry = source.generate(); } catch (e) { entry = null; }
      if (!entry) return;
      state.log.push({ slot: slot, icon: entry.icon, title: entry.title, text: entry.text, sourceId: source.id, dateKey: key, day: game.day || 0 });
    });
    if (state.log.length > MAX_LOG) state.log.splice(0, state.log.length - MAX_LOG);
  }

  const oldSyncArc1ForTideStories = window.syncArc1StoryQuestProgress;
  window.syncArc1StoryQuestProgress = function(){
    if (oldSyncArc1ForTideStories) oldSyncArc1ForTideStories();
    rollTodaysTideStories();
  };

  const SLOT_LABELS = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };

  function renderTideStoriesPanel(){
    const state = tideStoriesState();
    const key = dateKey(currentRealDate());
    const todays = state.log.filter(function(e){ return e.dateKey === key; });
    if (!state.log.length) return '';
    let html = '<div class="panel-title" style="margin-top:16px;">🌊 Today\'s Fair Tide</div>';
    if (todays.length) {
      todays.forEach(function(e){
        html += '<article class="quest-item"><strong>'+esc(SLOT_LABELS[e.slot] || e.slot)+' — '+esc(e.icon)+' '+esc(e.title)+'</strong><br>'+
          '<span style="font-size:.8rem;opacity:.85;">'+esc(e.text)+'</span></article>';
      });
    } else {
      html += '<article class="quest-item"><span style="font-size:.78rem;opacity:.7;">Quiet so far today.</span></article>';
    }
    const earlier = state.log.filter(function(e){ return e.dateKey !== key; });
    if (earlier.length) {
      html += '<div style="font-size:.74rem;opacity:.7;margin-top:10px;">Earlier</div>';
      html += '<div style="font-size:.72rem;opacity:.65;line-height:1.6;">';
      earlier.slice(-8).reverse().forEach(function(e){
        html += esc(e.icon) + ' ' + esc(e.title) + ' <span style="opacity:.6;">('+esc(SLOT_LABELS[e.slot] || e.slot)+')</span><br>';
      });
      html += '</div>';
    }
    return html;
  }
  window.renderTideStoriesPanel = renderTideStoriesPanel;

  const oldRenderArchiveScreenForTideStories = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForTideStories) oldRenderArchiveScreenForTideStories();
    const container = document.getElementById('archiveContent');
    if (!container) return;
    const existing = document.getElementById('tideStoriesPanelWrap');
    if (existing) existing.remove();
    const panel = renderTideStoriesPanel();
    if (panel) container.insertAdjacentHTML('beforeend', '<div id="tideStoriesPanelWrap">'+panel+'</div>');
  };
})();
