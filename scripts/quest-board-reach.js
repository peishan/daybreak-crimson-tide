(function(){
  // -------------------------------------------------------------------
  // QUEST AND BOUNTY BOARDS ONLY OFFER WORK YOU CAN REACH.
  //
  // A new voyage started with delivery contracts to Manila and Fair Tide (with Level 1 rewards in the
  // thousands), "Smuggler's End" at ports that were still locked, and sea hunts before there was
  // anywhere to sail. Now a contract is offered only if you could do it today:
  //   * delivery: the destination port is unlocked (and is not the port you are in);
  //   * kill, harbor enemy: at least one unlocked port has it in its harbor fights;
  //   * kill, sea enemy: you can sail somewhere (at least two ports unlocked);
  //   * kill, anywhere else (the late-game regions): once Fair Tide is open.
  // Unstarted contracts that are out of reach are swapped for reachable ones; contracts you have started
  // are never taken away. The boards fill up again as ports open. Saves with everything unlocked see no change.
  // -------------------------------------------------------------------
  function sequelIds(){ return (window.CRIMSON_HORIZON_PORTS || []).map(function(p){ return p.id; }); }
  function mainPorts(){ const s = sequelIds(); return PORTS.filter(function(p){ return s.indexOf(p.id) === -1; }); }
  function unlockedMain(){ return mainPorts().filter(function(p){ try { return isPortUnlocked(p.id); } catch(e) { return true; } }); }
  function enemyReachable(key){
    try {
      const homes = mainPorts().filter(function(p){ return (p.harbor || []).indexOf(key) !== -1; });
      if (homes.length) return homes.some(function(p){ return isPortUnlocked(p.id); });
      if (typeof SEA_ENEMIES !== 'undefined' && SEA_ENEMIES[key]) return unlockedMain().length >= 2;
      return !!isPortUnlocked('fair_tide');
    } catch(e) { return true; }
  }
  window.questEnemyReachable = enemyReachable;
  function deliveryReachable(q){
    try { const p = PORTS.find(function(x){ return x.id === q.portId; }); return !!p && deliveryPortReachable(p) && p.id !== game.location; } catch(e) { return true; }
  }
  function questOk(q){
    if (!q) return false;
    if (q.done || (q.c || 0) > 0) return true;                 // started or finished: never taken away
    if (q.type === 'kill') return enemyReachable(q.target);
    if (q.type === 'deliver') return deliveryReachable(q);
    return true;
  }

  // ---- the quest board ----
  const oldRefresh = window.refreshQuests;
  if (typeof oldRefresh === 'function') {
    window.refreshQuests = function(){
      const r = oldRefresh.apply(this, arguments);
      try {
        game.activeQuests = (game.activeQuests || []).filter(questOk);
        const ids = new Set(game.activeQuests.map(function(q){ return q.id; }));
        let guard = 0;
        while (game.activeQuests.length < 10 && guard++ < 30) {
          const cands = QUEST_POOL.filter(function(q){ return !ids.has(q.id); });
          if (!cands.length) break;
          const pick = cands[Math.floor(Math.random() * cands.length)];
          ids.add(pick.id);
          const q = (pick.dynamic === 'deliver') ? generateDeliveryQuest(pick.id) : Object.assign({}, pick, {c:0, done:false});
          if (questOk(q)) game.activeQuests.push(q);
        }
      } catch(e) { if (window.console) console.warn('quest reach failed', e); }
      return r;
    };
  }
  const oldBoard = window.questBoardHTML;
  if (typeof oldBoard === 'function') {
    window.questBoardHTML = function(){
      const html = oldBoard.apply(this, arguments);
      try {
        if ((game.activeQuests || []).filter(function(q){ return !q.done; }).length < 4) return html + '<p style="font-size:.78rem;opacity:.7;margin-top:8px;">The board is thin for now. More contracts appear as you open new ports.</p>';
      } catch(e) {}
      return html;
    };
  }

  // ---- the bounty board ----
  const oldBounties = window.refreshBounties;
  if (typeof oldBounties === 'function') {
    window.refreshBounties = function(){
      const r = oldBounties.apply(this, arguments);
      try {
        if (game.bountiesLocked) return r;
        const ok = function(b){ return b.type !== 'kill' || b.done || (b.c || 0) > 0 || enemyReachable(b.target); };
        game.bounties = (game.bounties || []).filter(ok);
        const have = new Set(game.bounties.map(function(b){ return b.id; }));
        const pool = bountyPool().filter(function(b){ return !have.has(b.id) && ok(b); }).sort(function(){ return Math.random() - 0.5; });
        while (game.bounties.length < 10 && pool.length) game.bounties.push(Object.assign({}, pool.shift(), {c:0, done:false}));
      } catch(e) { if (window.console) console.warn('bounty reach failed', e); }
      return r;
    };
  }
})();
