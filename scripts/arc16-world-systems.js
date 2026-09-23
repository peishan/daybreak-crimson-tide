(function(){
  // -------------------------------------------------------------------
  // RESOURCE ETHICS CLASSIFICATION — San's design doc for Arc XVI.
  // "Every unusual resource receives a category... the player doesn't
  // simply see RARE MATERIAL — +50 ENGINE POWER." This gives the Arc
  // XVI material (named Dragon Blood, matching the doc's own worked
  // example and Ch.10's dragon-territory reveal) a real classification
  // codex, progressively revealed across the chapters that actually
  // teach the player what it is — not a static info-dump shown all at
  // once, since the story itself is the thing doing the teaching.
  // -------------------------------------------------------------------

  const RESOURCE_CODEX_REVEALS = [
    { atChapter: 1, field: 'name', value: 'The Material', note: 'Known only by what it can do for the Horizon Engine.' },
    { atChapter: 5, field: 'extractionMethod', value: 'A direct extraction method exists — but it would cause real, visible damage.' },
    { atChapter: 9, field: 'localValue', value: 'Not considered a treasure here. It serves another purpose entirely to the people who live near it.' },
    { atChapter: 10, field: 'trueName', value: 'Dragon Blood' },
    { atChapter: 10, field: 'tag_living', value: true },
    { atChapter: 12, field: 'extractionRisk', value: 'High — the original extraction method would sever it from the ecosystem it stabilizes.' },
    { atChapter: 13, field: 'tag_protected', value: true },
    { atChapter: 13, field: 'tag_sacred', value: true },
    { atChapter: 13, field: 'guardianNote', value: 'Protected deliberately, not incidentally — the ecosystem around it developed alongside that protection, not despite it.' },
    { atChapter: 22, field: 'finalStatus', value: 'A cooperative exchange was reached. The Engine has what it needs; the majority of it remains exactly where it belongs.' },
    { atChapter: 22, field: 'extractionRisk', value: 'Low — obtained through cooperation rather than extraction.' }
  ];

  function resourceCodexState(){
    game.resourceCodex = game.resourceCodex || {};
    const progress = (game.comicProgress16 || {});
    const entry = {
      name: 'The Material',
      trueName: null,
      tags: [],
      extractionMethod: null,
      extractionRisk: 'Unknown',
      localValue: null,
      guardianNote: null,
      finalStatus: null
    };
    RESOURCE_CODEX_REVEALS.forEach(function(r){
      if (!progress[r.atChapter]) return;
      if (r.field === 'trueName') entry.trueName = r.value;
      else if (r.field.indexOf('tag_') === 0) {
        const tag = r.field.replace('tag_', '');
        if (entry.tags.indexOf(tag) === -1) entry.tags.push(tag);
      }
      else entry[r.field] = r.value;
    });
    return entry;
  }
  window.resourceCodexState = resourceCodexState;

  const TAG_LABELS = {
    living: '🌿 Living', protected: '🛡️ Protected', sacred: '🕊️ Sacred',
    limited: '⏳ Limited', common: '🪨 Common', 'inter-world': '🌀 Inter-world'
  };

  function renderResourceCodexPanel(){
    if (!game.comicProgress16 || !game.comicProgress16[1]) return ''; // nothing to show before Ch.1
    const r = resourceCodexState();
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<div class="story-act-kicker">Resource Codex</div><div class="story-act-title">'+esc(r.trueName || r.name)+'</div>'+
      '<div class="story-act-tagline">Not everything worth having is a treasure.</div></div>';
    if (r.tags.length) {
      html += '<div style="margin-bottom:8px;">'+r.tags.map(function(t){ return '<span class="story-chip" style="margin-right:6px;">'+(TAG_LABELS[t]||t)+'</span>'; }).join('')+'</div>';
    }
    html += '<div style="font-size:.82rem;opacity:.85;line-height:1.5;">';
    html += '<strong>Extraction Risk:</strong> '+esc(r.extractionRisk)+'<br>';
    if (r.localValue) html += '<strong>Local Significance:</strong> '+esc(r.localValue)+'<br>';
    if (r.guardianNote) html += '<strong>Why It\'s Protected:</strong> '+esc(r.guardianNote)+'<br>';
    if (r.extractionMethod) html += '<strong>Known Method:</strong> '+esc(r.extractionMethod)+'<br>';
    if (r.finalStatus) html += '<strong>Outcome:</strong> '+esc(r.finalStatus)+'<br>';
    html += '</div></section>';
    return html;
  }

  // -------------------------------------------------------------------
  // WORLD NETWORK — the multi-harbour map reveal, per San's second doc.
  // 5 harbours + 2 interior/region stretches, revealed as the matching
  // chapter range is reached, with the connections between them shown
  // once enough of the map is uncovered — the "everything is connected"
  // moment the doc specifically asks for. This is a map/reveal layer
  // alongside the story, not a duplicate of Arc XIII's full harbour hub
  // (market/dock/requests/etc.) — the doc itself notes these don't need
  // to be five separate full mechanical locations, just real, connected
  // places the story actually takes the crew through.
  // -------------------------------------------------------------------

  const WORLD_NETWORK_NODES = [
    { key: 'forest_coast', atChapter: 1, icon: '🌲', name: 'Forest Coast', kind: 'harbour', desc: 'First landfall. An ancient, living forest presses right up against the docks.' },
    { key: 'dragon_coast', atChapter: 6, icon: '🐉', name: 'Dragon Coast', kind: 'harbour', desc: 'The dragons here are not monsters guarding treasure — they are woven into how this coast actually works.' },
    { key: 'dragon_territory', atChapter: 10, icon: '⛰️', name: 'Dragon Territory', kind: 'region', desc: 'Inland from Dragon Coast. The dragons protect the high country, not out of hoarding, but out of necessity.' },
    { key: 'mountain_port', atChapter: 13, icon: '🏔️', name: 'Mountain Port', kind: 'harbour', desc: 'The practical, logistical heart of the resource region — mining, geology, and the people who live with both.' },
    { key: 'mountain_interior', atChapter: 17, icon: '🗻', name: 'Mountain Interior', kind: 'region', desc: 'The protected region itself, further in than the port ever shows visitors.' },
    { key: 'crystal_coast', atChapter: 19, icon: '💎', name: 'Crystal Coast', kind: 'harbour', desc: 'Where the resource finally surfaces — and where a different kind of exchange becomes possible.' },
    { key: 'old_harbour', atChapter: 23, icon: '⚓', name: 'Old Harbour', kind: 'harbour', desc: 'An older settlement, holding the history that explains why all of this was ever protected in the first place.' }
  ];

  const WORLD_NETWORK_CONNECTIONS = [
    ['forest_coast', 'dragon_coast', 'Coastal neighbors, sharing the same shoreline.'],
    ['dragon_coast', 'dragon_territory', 'The dragons\' true range extends inland from the coast the crew first met them on.'],
    ['dragon_territory', 'mountain_port', 'The dragons protect these mountains because the mountains feed the forest below.'],
    ['mountain_port', 'mountain_interior', 'The port is the gateway; the interior is what it was always guarding.'],
    ['mountain_interior', 'crystal_coast', 'The rivers carry what the mountains hold down to where it finally surfaces.'],
    ['crystal_coast', 'old_harbour', 'The oldest settlement in the region remembers why any of this needed protecting at all.']
  ];

  function worldNetworkState(){
    const progress = (game.comicProgress16 || {});
    const discovered = WORLD_NETWORK_NODES.filter(function(n){ return !!progress[n.atChapter]; });
    return {
      discovered: discovered,
      allRevealed: discovered.length === WORLD_NETWORK_NODES.length
    };
  }
  window.worldNetworkState = worldNetworkState;

  function renderWorldNetworkPanel(){
    const state = worldNetworkState();
    if (!state.discovered.length) return '';
    let html = '<section class="story-act story-quest-panel"><div class="story-act-header">'+
      '<div class="story-act-kicker">World Network</div><div class="story-act-title">Beyond Veyren</div>'+
      '<div class="story-act-tagline">A world is not a backdrop. It is someone\'s home.</div></div>';
    state.discovered.forEach(function(n){
      html += '<article class="quest-item"><strong>'+n.icon+' '+esc(n.name)+'</strong>'+
        (n.kind==='region' ? ' <span class="story-chip" style="margin-left:4px;">Region</span>' : ' <span class="story-chip" style="margin-left:4px;">Harbour</span>')+
        '<br><span style="font-size:.8rem;opacity:.8;">'+esc(n.desc)+'</span></article>';
    });
    const discoveredKeys = state.discovered.map(function(n){ return n.key; });
    const visibleConnections = WORLD_NETWORK_CONNECTIONS.filter(function(c){ return discoveredKeys.indexOf(c[0])!==-1 && discoveredKeys.indexOf(c[1])!==-1; });
    if (visibleConnections.length) {
      html += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(232,197,71,.2);">';
      visibleConnections.forEach(function(c){
        const a = WORLD_NETWORK_NODES.find(function(n){ return n.key===c[0]; });
        const b = WORLD_NETWORK_NODES.find(function(n){ return n.key===c[1]; });
        html += '<div style="font-size:.76rem;opacity:.75;margin-bottom:4px;">'+a.icon+' '+esc(a.name)+' → '+b.icon+' '+esc(b.name)+' — '+esc(c[2])+'</div>';
      });
      html += '</div>';
    }
    if (state.allRevealed) {
      html += '<div class="story-chapter" style="margin-top:10px;"><div class="story-chapter-sub" style="font-style:italic;">'+
        'It was never separate places. It was one world, all along — the dragons and the mountains and the coast and the people, each depending on what came before it.</div></div>';
    }
    html += '</section>';
    return html;
  }

  const oldRenderStoryForArc16World = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStoryForArc16World) oldRenderStoryForArc16World();
    const container = document.getElementById('storyContent');
    if (!container) return;
    container.insertAdjacentHTML('beforeend', renderResourceCodexPanel());
    container.insertAdjacentHTML('beforeend', renderWorldNetworkPanel());
  };
})();
