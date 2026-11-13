(function(){
  // -------------------------------------------------------------------
  // ARCHIVE TABS -- the Archive screen was one very long column: more
  // than 55 modules each append their own panel to #archiveContent. This
  // regroups those panels into a swipeable tab strip (the same strip the
  // Fair Tide hub uses) after the whole chain has rendered. It moves the
  // existing DOM nodes rather than re-rendering them, so every panel and
  // button works exactly as before, and a panel it doesn't recognise
  // lands in "More" instead of disappearing, so future panels still show.
  //
  // Panels are matched by their wrapper id. Panels without one (the
  // Archive's own hub and Records) go to Records. Empty tabs are hidden;
  // the chosen tab is remembered (game.archiveActiveTab).
  // -------------------------------------------------------------------
  const GROUPS = [
    { key: 'records', icon: '📚', label: 'Records' },
    { key: 'raids',   icon: '⏳', label: 'Raids' },
    { key: 'council', icon: '🏛️', label: 'Council' },
    { key: 'harbour', icon: '⚓', label: 'Harbour' },
    { key: 'life',    icon: '🌊', label: 'Fair Tide Life' },
    { key: 'family',  icon: '💞', label: 'Family' },
    { key: 'more',    icon: '📂', label: 'More' }
  ];
  // Ordered: the first rule that matches an id wins.
  const RULES = [
    ['raids',   /raid/i],
    ['records', /research|renn|farseer|catalogue|blackpearl|crosscheck|dossier|intel|verification|investigat|integrity/i],
    ['family',  /family|twin|legacy|resonance|growth|maera|child|thought|bond|livinghorizons|veyrenlife/i],
    ['council', /council|charter|arc18|horizon(chamber|shutdown)|nameless|compartment|ncase|wardenshall|security|allegiance/i],
    ['harbour', /harbour|market|cargo|supply|workshop|medical|route|traffic|visitors|neutral|steadyreach|ledger|arc26|commons|reserves/i],
    ['life',    /mood|weather|timeofday|tide|flavour|conversation|hobbies|food|chronicle|soel|ship|calendar|birthday|festival|anniversary|settlement|fairtidelife|homeprep|readiness/i]
  ];

  function classify(node){
    const id = node.id || '';
    if (!id) return 'records';
    for (let i = 0; i < RULES.length; i++) if (RULES[i][1].test(id)) return RULES[i][0];
    return 'more';
  }
  window.archiveTabGroupFor = classify;

  function hasContent(node){ return !!(node.textContent && node.textContent.trim()) || !!node.querySelector('img,button'); }

  const oldRenderArchiveScreenForTabs = window.renderArchiveScreen;
  window.renderArchiveScreen = function(){
    if (oldRenderArchiveScreenForTabs) oldRenderArchiveScreenForTabs.apply(this, arguments);
    const c = document.getElementById('archiveContent');
    if (!c) return;
    const kids = Array.prototype.slice.call(c.children).filter(function(k){ return k.id !== 'archiveTabsBar' && !k.classList.contains('archive-tab-pane'); });
    if (!kids.length) return;
    const buckets = {}; GROUPS.forEach(function(g){ buckets[g.key] = []; });
    kids.forEach(function(k){ buckets[classify(k)].push(k); });

    const shown = GROUPS.filter(function(g){ return buckets[g.key].some(hasContent); });
    let active = game.archiveActiveTab;
    if (!shown.some(function(g){ return g.key === active; })) active = shown.length ? shown[0].key : 'records';

    c.innerHTML = '';
    const bar = document.createElement('div');
    bar.className = 'tabs'; bar.id = 'archiveTabsBar'; bar.style.marginBottom = '10px';
    shown.forEach(function(g){
      const b = document.createElement('button');
      b.className = 'tab-btn' + (g.key === active ? ' active' : '');
      b.setAttribute('data-archive-tab', g.key);
      b.textContent = g.icon + ' ' + g.label;
      b.onclick = function(){ window.__ctArchiveTab(g.key); };
      bar.appendChild(b);
    });
    c.appendChild(bar);
    GROUPS.forEach(function(g){
      const pane = document.createElement('div');
      pane.className = 'archive-tab-pane'; pane.setAttribute('data-archive-pane', g.key);
      pane.style.display = (g.key === active) ? '' : 'none';
      buckets[g.key].forEach(function(n){ pane.appendChild(n); });
      c.appendChild(pane);
    });
    if (typeof window.__ctCenterActiveTab === 'function') window.__ctCenterActiveTab();
  };

  window.__ctArchiveTab = function(key){
    game.archiveActiveTab = key;
    document.querySelectorAll('#archiveContent [data-archive-pane]').forEach(function(p){ p.style.display = (p.getAttribute('data-archive-pane') === key) ? '' : 'none'; });
    document.querySelectorAll('#archiveTabsBar [data-archive-tab]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-archive-tab') === key); });
    if (typeof window.__ctCenterActiveTab === 'function') window.__ctCenterActiveTab();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };
})();
