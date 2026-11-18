(function(){
  // -------------------------------------------------------------------
  // CONTRACT DEADLINES + A SELLING EDGE for the existing local port standing
  // (scripts/local-port-standing.js: earned by trading volume, already gives
  // a buy discount and has its own panel under the market).
  //
  //  * SELLING EDGE. Standing now also pays on the way out: a port that knows
  //    you pays you half its buy-discount rate more on sales (up to +5% at
  //    Local Legend).
  //  * CONTRACT DEADLINES. Delivery contracts (the "Deliver X to Y" jobs on the
  //    tavern board) now have a deadline based on the distance. Finish with
  //    plenty of time to spare for a 25% bonus; finish late and the pay is
  //    halved. On time or early, the destination port thinks well of you (+25
  //    standing there); late, only +5.
  // -------------------------------------------------------------------
  function portName(id){ const p = PORTS.find(function(x){ return x.id === id; }); return p ? p.name : id; }
  function addStanding(portId, n){ game.portStanding = game.portStanding || {}; game.portStanding[portId] = (game.portStanding[portId] || 0) + n; }

  const oldSell = window.sellGood;
  if (typeof oldSell === 'function') {
    window.sellGood = function(goodId){
      const loc = game.location, gold0 = game.gold;
      const tier = (typeof window.portStandingTier === 'function') ? window.portStandingTier(loc) : null;
      const r = oldSell.apply(this, arguments);
      try {
        const earned = game.gold - gold0;
        const rate = tier ? tier.discount * 0.5 : 0;
        if (earned > 0 && rate > 0 && goodId !== 'contraband') {
          const bonus = Math.round(earned * rate);
          if (bonus > 0) { game.gold += bonus; if (typeof toast === 'function') toast('🤝 ' + tier.label + ' at ' + portName(loc) + ': +' + bonus + 'g on that sale.', 2600); }
        }
      } catch(e) {}
      return r;
    };
  }

  // ---- contract deadlines ----
  function daysLeft(q){ return q.deadline - game.day; }
  function decorate(q){
    if (!q || q.type !== 'deliver' || q.deadline == null) return;
    if (q.baseDesc == null) q.baseDesc = q.desc;
    const left = daysLeft(q);
    q.desc = q.baseDesc + (left >= 0 ? ' ⏳ ' + left + ' day' + (left === 1 ? '' : 's') + ' left (Day ' + q.deadline + ').' + (left >= q.span * 0.4 ? ' Early pays 25% more.' : '') : ' ⚠️ Late: pays half.');
  }
  const oldGen = window.generateDeliveryQuest;
  if (typeof oldGen === 'function') {
    window.generateDeliveryQuest = function(){
      const q = oldGen.apply(this, arguments);
      try {
        const cur = PORTS.find(function(p){ return p.id === game.location; });
        const dist = (cur && cur.distances && cur.distances[q.portId]) || 4;
        q.span = Math.ceil(dist * 1.5) + 5;
        q.deadline = game.day + q.span;
        decorate(q);
      } catch(e) {}
      return q;
    };
  }
  const oldRefresh = window.refreshQuests;
  if (typeof oldRefresh === 'function') {
    window.refreshQuests = function(){
      const r = oldRefresh.apply(this, arguments);
      try { (game.activeQuests || []).forEach(decorate); } catch(e) {}
      return r;
    };
  }
  const oldCheck = window.checkQuestProgress;
  if (typeof oldCheck === 'function') {
    window.checkQuestProgress = function(type, target, amount){
      const finishing = [];
      try {
        if (type === 'deliver' && target) {
          (game.activeQuests || []).forEach(function(q){
            if (q.done || q.type !== 'deliver' || q.good !== target.good || q.portId !== target.portId) return;
            if (q.c + amount >= q.need && q.deadline != null && !q.rwAdjusted) {
              q.rwAdjusted = true;
              const left = daysLeft(q);
              const f = left < 0 ? 0.5 : (left >= q.span * 0.4 ? 1.25 : 1);
              q.rw = Object.assign({}, q.rw, { xp: Math.round(q.rw.xp * f), gold: Math.round(q.rw.gold * f) });
              finishing.push({ q: q, late: left < 0, early: left >= q.span * 0.4 });
            }
          });
        }
      } catch(e) {}
      const r = oldCheck.apply(this, arguments);
      try {
        finishing.forEach(function(f){
          addStanding(f.q.portId, f.late ? 5 : 25);
          if (typeof toast === 'function') toast(f.late ? '⌛ Delivered late: half pay.' : (f.early ? '⚡ Delivered early: +25% pay.' : '✅ Delivered on time.'), 3000);
        });
      } catch(e) {}
      return r;
    };
  }

})();
