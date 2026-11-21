(function(){
  // -------------------------------------------------------------------
  // PORT DISCOVERIES. A short run of one-time finds at a destination, done in order. Each one shows a passage and pays
  // a modest XP and gold reward, scaled to your level. Used so a destination has a story to find as well as a market.
  //   Sunken Kingdom -- Aelyndra Outer City (from the Tribute game's Sunken Kingdom, in the same non-committal voice as the
  //   Black Pearl study: what is there and what the records say, nothing about the Pearl's nature)
  //   Moonveil Temple
  // State: game.portDiscoveries = { id: true }.
  // -------------------------------------------------------------------
  const DISCOVERIES = {
    sunken_kingdom: [
      { id:'sk_barriers', icon:'🫧', name:'The Barrier Stairs',
        text:'The route ends at a long stair that climbs out of the water into air. Above it the ocean stands against an enormous magical barrier, and the barrier holds. The crew walks up the steps in single file, and nobody speaks until they are all through.' },
      { id:'sk_streets', icon:'🏘️', name:'Streets as They Were Left',
        text:'The Outer City is empty and whole. Homes are furnished the way their people left them. There are schools with desks and scrolls still in place, workshops with tools on the benches, and a market with its stalls laid out. It was not a ruin. It was a kingdom that had lived.' },
      { id:'sk_market', icon:'⚖️', name:'The Market Stalls',
        text:'Aisyah finds the market scales still level, with their weights lined up beside them in order. Someone put everything away carefully, as if they meant to come back in the morning. She does not touch a thing, and she writes the stall numbers down.' },
      { id:'sk_chambers', icon:'⚙️', name:'The Restoration Chambers',
        text:'Between the districts run long corridors, each anchored by a chamber that is still working. Sky reads the carvings and calls them restoration anchors, quietly doing what they were built for: keeping the place from coming apart. A chamber reopens the passages it anchors, one district at a time.' },
      { id:'sk_murals', icon:'🖼️', name:'The Murals in the Council Hall',
        text:'The murals show a royal council raising its hands and lowering the city beneath the sea, sealing it during a crisis the carvings only half explain. The barriers were built to last a very long time. Erynn copies every panel and does not say what he thinks it means.' },
      { id:'sk_choice', icon:'📜', name:'A Choice, Not a Disaster',
        text:'The last inscriptions are plain. It was not a collapse and not an abandonment. It was a planned act, a preservation: they chose the sea to protect something of great importance. The records stop there. The team marks the exact line where they stop, and files the copy.' }
    ],
    moonveil_temple: [
      { id:'mv_sanctuary', icon:'🕯️', name:'The Hidden Sanctuary',
        text:'The temple halls are untouched by time, dry and still, with a crescent carved over every doorway. Crests of the old royal line are cut into the walls. Jade runs a hand along one of them and says her people knew this place a very long time ago.' },
      { id:'mv_symbol', icon:'🌙', name:'The Ancient Symbol',
        text:'Erynn matches the symbol on the tablet to the one in the Dragonvale records and finds it is older than the royal line itself. It appears in some of the oldest records anywhere, much older than anyone expected. He copies the tablet twice and does not trust either copy until he has compared them.' },
      { id:'mv_chamber', icon:'🚪', name:'The Sealed Chamber',
        text:'Deep in the temple the passage ends at a sealed door. The team measures it, takes rubbings of the seal, and records every mark. Nobody tries to open it. The keepers say it has been closed longer than the temple has had keepers, and that they would like it to stay that way until someone knows why.' }
    ]
  };
  window.PORT_DISCOVERIES = DISCOVERIES;

  function done(){ game.portDiscoveries = game.portDiscoveries || {}; return game.portDiscoveries; }
  function lvl(){ return (typeof level === 'function') ? level() : 1; }
  function reward(){
    const l = Math.max(1, lvl());
    const step = (typeof xpForLevel === 'function') ? Math.max(1, xpForLevel(l + 1) - xpForLevel(l)) : 100;
    return { xp: Math.round(step * 0.04), gold: Math.round(l * 1.2) };
  }
  window.portDiscoveryProgress = function(portId){
    const list = DISCOVERIES[portId] || [];
    return { done: list.filter(function(d){ return done()[d.id]; }).length, total: list.length };
  };

  window.exploreDiscovery = function(id){
    const portId = game.location, list = DISCOVERIES[portId];
    if (!list) return;
    const idx = list.findIndex(function(d){ return d.id === id; });
    if (idx < 0 || done()[id]) return;
    if (idx > 0 && !done()[list[idx - 1].id]) { if (typeof toast === 'function') toast('🔒 Find the earlier ones first.'); return; }
    const d = list[idx], r = reward();
    done()[id] = true;
    if (typeof gainXP === 'function') gainXP(r.xp);
    game.gold = (game.gold || 0) + r.gold;
    if (typeof logEvent === 'function') logEvent(d.icon + ' Discovery: ' + d.name + ' · +' + r.xp + ' XP · +' + r.gold + 'g', 'gold');
    if (typeof showModal === 'function') showModal(d.icon + ' ' + d.name, d.text + '<br><br><span style="opacity:.75;">+' + r.xp + ' XP · +' + r.gold + 'g</span>', [{ text:'Continue', action:function(){ if (typeof closeModal === 'function') closeModal(); } }]);
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderPort === 'function') renderPort();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderExplore = window.renderExplore;
  window.renderExplore = function(){
    if (oldRenderExplore) oldRenderExplore.apply(this, arguments);
    try {
      const list = DISCOVERIES[game.location], container = document.getElementById('exploreContent');
      if (!list || !container) return;
      const p = window.portDiscoveryProgress(game.location);
      let html = '<article class="quest-item" style="border-left-color:var(--gold);"><strong>🔎 Discoveries (' + p.done + '/' + p.total + ')</strong>';
      let shownNext = false;
      list.forEach(function(d){
        if (done()[d.id]) html += '<div style="font-size:.8rem;opacity:.75;margin-top:6px;">✓ ' + d.icon + ' ' + d.name + '</div>';
        else if (!shownNext) { shownNext = true; html += '<div style="margin-top:8px;"><button class="btn btn-small btn-success" onclick="exploreDiscovery(\'' + d.id + '\')">' + d.icon + ' ' + d.name + '</button></div>'; }
      });
      if (!shownNext) html += '<div style="font-size:.78rem;opacity:.7;margin-top:8px;">Everything the team can find here has been found.</div>';
      html += '</article>';
      container.insertAdjacentHTML('afterbegin', html);
    } catch (e) {}
  };
})();
