(function(){
  // -------------------------------------------------------------------
  // TAVERN QUEST BOARD: A LOCK, AND A NOTE OF WHAT CHANGED.
  //
  // The Tavern's contracts have no timer; a posting only changes when you finish it, or when an
  // unstarted one stops being something you could do (a delivery to a port that is not open, a hunt for
  // something you cannot reach). If the board still seems to shuffle under you, the 🔒 Lock stops every
  // such swap: unstarted contracts stay exactly as they are until you unlock it. Finished contracts
  // still leave and their slot refills. While unlocked, the board also notes the last few contracts
  // it swapped out, so a change is never a mystery.
  // -------------------------------------------------------------------
  const MAX = 10;
  function note(q){
    const why = q.type === 'deliver' ? 'its destination was not open to you' : 'what it asked for was out of reach';
    game.questChanges = game.questChanges || [];
    game.questChanges.unshift({ day: game.day || 0, text: '“' + q.name + '” was swapped out: ' + why + '.' });
    if (game.questChanges.length > 5) game.questChanges.length = 5;
  }
  const oldRefresh = window.refreshQuests;
  if (typeof oldRefresh === 'function') {
    window.refreshQuests = function(){
      const before = (game.activeQuests || []).slice();
      const r = oldRefresh.apply(this, arguments);
      try {
        const after = game.activeQuests || [];
        const gone = before.filter(function(q){ return !q.done && after.indexOf(q) < 0; });
        if (!gone.length) return r;
        if (game.questsLocked) {
          // put every unstarted contract back, then drop the extras the swap added
          const keep = before.filter(function(q){ return !q.done; });
          const beforeIds = new Set(before.map(function(q){ return q.id; }));
          const out = after.filter(function(q){ return !keep.some(function(k){ return k.id === q.id; }); });
          let list = keep.concat(out.filter(function(q){ return !beforeIds.has(q.id) }));
          const limit = Math.max(MAX, keep.length);
          while (list.length > limit) {
            let i = list.length - 1; while (i >= 0 && beforeIds.has(list[i].id)) i--;
            if (i < 0) break; list.splice(i, 1);
          }
          game.activeQuests = list;
        } else {
          gone.forEach(note);
        }
      } catch(e) { if (window.console) console.warn('quest lock failed', e); }
      return r;
    };
  }

  window.toggleQuestLock = function(){
    game.questsLocked = !game.questsLocked;
    if (typeof toast === 'function') toast(game.questsLocked ? '🔒 Quest board locked — your contracts will not be swapped out.' : '🔓 Quest board unlocked — out-of-reach contracts can be swapped again.');
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    try { if (typeof window.renderTavern === 'function') window.renderTavern(); } catch(e) {}
  };

  const oldBoard = window.questBoardHTML;
  if (typeof oldBoard === 'function') {
    window.questBoardHTML = function(){
      const html = oldBoard.apply(this, arguments);
      const locked = !!game.questsLocked;
      let head = '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:2px 0 8px;flex-wrap:wrap;">' +
        '<span style="font-size:.76rem;opacity:.75;">' + (locked ? 'Locked: your contracts stay as they are.' : 'Contracts only change when you finish one or one becomes out of reach.') + '</span>' +
        '<button class="btn btn-small' + (locked ? ' btn-success' : '') + '" onclick="toggleQuestLock()">' + (locked ? '🔒 Locked' : '🔓 Lock board') + '</button></div>';
      if (!locked && game.questChanges && game.questChanges.length) {
        head += '<div style="font-size:.72rem;opacity:.7;margin:0 0 8px;line-height:1.5;">Recent changes:<br>' + game.questChanges.map(function(c){ return 'Day ' + c.day + ': ' + String(c.text).replace(/[<>&]/g, ''); }).join('<br>') + '</div>';
      }
      return head + html;
    };
  }
})();
