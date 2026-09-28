(function(){
  // -------------------------------------------------------------------
  // HANG OUT — individual companions: San & Aisyah, San & Mezstorm,
  // San & Eliz, San & Senedra. Same underlying machinery as the three
  // existing Bond Tracks (arc9-and-systems.js: bondState(), bondTier(),
  // canSpendTimeOnBond(), spendTimeWithBond()) — extended, not
  // duplicated. Those functions all read window.BOND_TRACKS fresh on
  // every call rather than a private copy, so registering a new key on
  // it here (window.BOND_TRACKS is the exact same object reference
  // arc9-and-systems.js's own closures already hold) is enough to make
  // the whole existing system — points, once-a-day cap, the base Bonds
  // tab card — work for these four with no changes to that file at all.
  //
  // San's own call for individual companions: story-driven, not stat
  // grinding. Every tier below carries bonus:0 on purpose — these bonds
  // exist for named progression and the Shared Moments log, not another
  // stacking combat percentage on top of San & Joel/Crew/Trio's three.
  // That does surface one real base-renderer quirk: renderBondsTab()'s
  // generic per-track bonus-text branch only names two cases correctly
  // (San & Joel's own stats, and a literal 'crit chance' for every other
  // key, which was accurate back when San & Trio was the only "other"
  // track) — so a bonus:0 track would otherwise show the misleading
  // "+0% crit chance". Fixed below by replacing that one exact string,
  // which no genuine bonus-bearing track can ever produce (San & Trio's
  // own smallest real tier is 2%).
  //
  // Gating: each is tied to whichever chapter actually establishes that
  // specific relationship, using Arc I's own game.comicProgress (these
  // four all join in Arc I, long before Arc XX):
  //   - Aisyah   -> Ch.14 "Two Sisters, One Ship" (San's own question:
  //     yes — San & Aisyah are explicitly framed as sisters in-story).
  //   - Mezstorm -> Ch.19 "The Crew We Choose" — Mez finding her place
  //     through scenes with the crew already aboard.
  //   - Eliz     -> Ch.15 "The One Who Stayed" — her own join chapter;
  //     no later dedicated bonding chapter exists yet to anchor to
  //     instead.
  //   - Senedra  -> Ch.20 "Senedra — The Watchful Signal" — likewise
  //     her own introduction chapter.
  // -------------------------------------------------------------------

  window.BOND_TRACKS = window.BOND_TRACKS || {};

  const COMPANIONS = [
    {
      key: 'san_aisyah', label: 'San & Aisyah', icon: '👭', members: ['aisyah'],
      actionLabel: 'Spend sisterly time with Aisyah',
      flavor: 'Teasing, trust, and the things neither of them can fully explain.',
      tiers: [
        {threshold:0,   name:'Just Crew',             bonus:0},
        {threshold:50,  name:'Sisters at Sea',        bonus:0},
        {threshold:150, name:'Two Sisters, One Ship', bonus:0},
        {threshold:300, name:'Nothing Left Unsaid',   bonus:0},
        {threshold:600, name:'Sisters, Full Stop',    bonus:0}
      ],
      unlockedFn: function(){ return !!(game.comicProgress && game.comicProgress[14]); },
      handlerName: 'hangOutWithAisyah',
      panelTitle: '👭 Hang Out with Aisyah',
      panelBlurb: 'Spend some sisterly time with Aisyah. This still uses today\'s San &amp; Aisyah time, same as above.',
      activities: [
        {id: 'sister_time', icon: '👭', label: 'Sister Time',              flavor: 'No particular reason. Just the two of them, being sisters about it.'},
        {id: 'training',    icon: '⚔️', label: 'Train Together',          flavor: 'Aisyah pushes harder than she needs to. San lets her.'},
        {id: 'talk',        icon: '💬', label: 'Just Talk',               flavor: 'The kind of conversation that only happens between people who trust each other completely.'},
        {id: 'haggle',      icon: '🛍️', label: 'Haggle at the Market',    flavor: 'Watching Aisyah talk a merchant down is half the entertainment.'},
        {id: 'tease',       icon: '😄', label: 'Tease Each Other Mercilessly', flavor: 'Neither of them ever actually wins this one.'},
        {id: 'quiet_evening', icon: '🌙', label: 'Quiet Evening In',       flavor: 'Nothing said. Nothing needed to be.'}
      ]
    },
    {
      key: 'san_mez', label: 'San & Mezstorm', icon: '⛈️', members: ['mezstorm'],
      actionLabel: 'Spend time with Mez',
      flavor: 'Whatever it is, it\'s louder and more chaotic than San planned for.',
      tiers: [
        {threshold:0,   name:'Still Sizing Each Other Up', bonus:0},
        {threshold:50,  name:'Reluctantly Fond',           bonus:0},
        {threshold:150, name:'The Crew We Choose',         bonus:0},
        {threshold:300, name:'Partners in Chaos',          bonus:0},
        {threshold:600, name:'Never a Dull Moment',        bonus:0}
      ],
      unlockedFn: function(){ return !!(game.comicProgress && game.comicProgress[19]); },
      handlerName: 'hangOutWithMez',
      panelTitle: '⛈️ Hang Out with Mez',
      panelBlurb: 'Spend some time with Mez. This still uses today\'s San &amp; Mezstorm time, same as above.',
      activities: [
        {id: 'stormwatch',     icon: '⛈️', label: 'Stormwatch',           flavor: 'Watching a storm roll in from somewhere safe, for once.'},
        {id: 'magic_practice', icon: '✨', label: 'Magic Practice',       flavor: 'Mez insists this spell is completely under control. San stands further back anyway.'},
        {id: 'gossip',         icon: '🗯️', label: 'Catch Up on Gossip',   flavor: 'Mez knows something about everyone. San regrets asking about exactly one of these things.'},
        {id: 'dare',           icon: '😈', label: 'Take the Dare',        flavor: "Mez's dares always sound reasonable until they aren't."},
        {id: 'storm_stories',  icon: '📜', label: 'Trade Storm Stories',  flavor: 'Whoever survived the wilder one wins, allegedly.'},
        {id: 'do_nothing',     icon: '😌', label: 'Do Absolutely Nothing', flavor: 'Rare, and Mez complains about it the entire time anyway.'}
      ]
    },
    {
      key: 'san_eliz', label: 'San & Eliz', icon: '💚', members: ['eliz'],
      actionLabel: 'Spend a quiet moment with Eliz',
      flavor: 'Not much needs to be said. That\'s rather the point.',
      tiers: [
        {threshold:0,   name:'The One Who Stayed',   bonus:0},
        {threshold:50,  name:'Comfortable Quiet',    bonus:0},
        {threshold:150, name:'Trusted With the Truth', bonus:0},
        {threshold:300, name:'Steady Company',       bonus:0},
        {threshold:600, name:'Never Really Alone',   bonus:0}
      ],
      unlockedFn: function(){ return !!(game.comicProgress && game.comicProgress[15]); },
      handlerName: 'hangOutWithEliz',
      panelTitle: '💚 Hang Out with Eliz',
      panelBlurb: 'Spend a quiet moment with Eliz. This still uses today\'s San &amp; Eliz time, same as above.',
      activities: [
        {id: 'quiet_afternoon', icon: '🍵', label: 'Quiet Afternoon',           flavor: 'Tea, and not much conversation. Neither of them minds.'},
        {id: 'walk',            icon: '🚶', label: 'Take a Walk',              flavor: 'No destination. Just moving, together.'},
        {id: 'read_together',   icon: '📗', label: 'Read Together',           flavor: 'Different books, same room, comfortable silence.'},
        {id: 'check_in',        icon: '💛', label: 'Check In',                flavor: 'San asks how she\'s really doing. Eliz actually answers.'},
        {id: 'help_out',        icon: '🤲', label: 'Help With Something Small', flavor: 'Nothing dramatic. Just useful, together.'},
        {id: 'sit_in_silence',  icon: '🌫️', label: 'Sit in Comfortable Silence', flavor: "Some company doesn't need words at all."}
      ]
    },
    {
      key: 'san_senedra', label: 'San & Senedra', icon: '🎯', members: ['senedra'],
      actionLabel: 'Spend time with Senedra',
      flavor: 'She notices things San never would have on her own.',
      tiers: [
        {threshold:0,   name:'The Watchful Signal', bonus:0},
        {threshold:50,  name:'Learning to See It Too', bonus:0},
        {threshold:150, name:'Trusted Eyes',         bonus:0},
        {threshold:300, name:'Nothing Gets Past Either of Them', bonus:0},
        {threshold:600, name:'Watching the Same Horizon', bonus:0}
      ],
      unlockedFn: function(){ return !!(game.comicProgress && game.comicProgress[20]); },
      handlerName: 'hangOutWithSenedra',
      panelTitle: '🎯 Hang Out with Senedra',
      panelBlurb: 'Spend some time with Senedra. This still uses today\'s San &amp; Senedra time, same as above.',
      activities: [
        {id: 'scout_walk',     icon: '🔭', label: 'Scout Walk',              flavor: 'Senedra points out things San would never have noticed on her own.'},
        {id: 'lighthouse',     icon: '🗼', label: 'Watch from the Lighthouse', flavor: 'The best view of Fair Tide, and neither of them says much.'},
        {id: 'signal_practice', icon: '🚩', label: 'Signal Practice',        flavor: 'San is objectively terrible at this. Senedra is patient about it.'},
        {id: 'night_watch',    icon: '🌌', label: 'Take the Night Watch Together', flavor: 'Quiet hours, good company, nothing to actually watch for.'},
        {id: 'maps',           icon: '🗺️', label: 'Go Over the Maps',        flavor: 'Senedra always finds one more route San hadn\'t considered.'},
        {id: 'tea_at_dawn',    icon: '🌅', label: 'Tea at Dawn',             flavor: 'Up before everyone else, for no reason except that they both already were.'}
      ]
    }
  ];
  window.HANG_OUT_COMPANIONS = COMPANIONS;

  COMPANIONS.forEach(function(c){
    window.BOND_TRACKS[c.key] = {
      label: c.label, icon: c.icon, tiers: c.tiers, members: c.members,
      actionLabel: c.actionLabel, flavor: c.flavor
    };
    window[c.handlerName] = function(activityId){
      if (!c.unlockedFn()) return;
      const activity = c.activities.find(function(a){ return a.id === activityId; });
      if (!activity) return;
      if (typeof window.canSpendTimeOnBond === 'function' && !window.canSpendTimeOnBond(c.key)) {
        toast('Already spent time on this today.');
        return;
      }
      const before = (window.bondState ? window.bondState()[c.key].lastSpentDay : null);
      window.spendTimeWithBond(c.key, activity.icon + ' ' + activity.flavor);
      const after = (window.bondState ? window.bondState()[c.key].lastSpentDay : null);
      if (after !== before && typeof window.recordSharedMoment === 'function') {
        window.recordSharedMoment(c.key, activityId);
      }
    };
  });

  function hangOutPanelHtml(c){
    const canSpend = (typeof window.canSpendTimeOnBond === 'function') ? window.canSpendTimeOnBond(c.key) : true;
    let html = '<div class="panel-title" style="margin-top:14px;">'+c.panelTitle+'</div>'+
      '<article class="quest-item">'+
      '<div style="font-size:.82rem;opacity:.85;margin-bottom:8px;">'+c.panelBlurb+'</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
    c.activities.forEach(function(a){
      html += '<button class="btn btn-small btn-success" '+(canSpend?'':'disabled')+' onclick="'+c.handlerName+'(\''+a.id+'\')">'+a.icon+' '+esc(a.label)+'</button>';
    });
    html += '</div>';
    const moments = (typeof window.sharedMomentsFor === 'function') ? window.sharedMomentsFor(c.key) : [];
    if (moments.length) {
      html += '<div style="font-size:.74rem;opacity:.7;margin-top:10px;">🌊 Shared Moments</div>';
      html += '<div style="font-size:.72rem;opacity:.65;line-height:1.6;">';
      moments.slice(-8).reverse().forEach(function(m){
        const a = c.activities.find(function(x){ return x.id === m.id; });
        html += (a ? a.icon + ' ' + esc(a.label) : esc(m.id)) + ' <span style="opacity:.6;">(Day '+m.day+')</span><br>';
      });
      html += '</div>';
    }
    html += '</article>';
    return html;
  }

  const oldRenderBondsTabForCompanions = window.renderBondsTab;
  window.renderBondsTab = function(){
    if (oldRenderBondsTabForCompanions) oldRenderBondsTabForCompanions();
    const el = document.getElementById('ft-tab-bonds');
    if (!el) return;
    // See the file-header note: every zero-bonus companion card the base
    // renderer just auto-generated for these four (via the BOND_TRACKS
    // entries registered above) shows this exact misleading string once
    // its tier reaches 1 — fixed once, globally, for all of them.
    el.innerHTML = el.innerHTML.split('+0% crit chance').join('💭 Story &amp; memories — no combat bonus.');
    COMPANIONS.forEach(function(c){
      if (c.unlockedFn()) el.innerHTML += hangOutPanelHtml(c);
    });
  };
})();
