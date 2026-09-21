
(function(){
  // AUTO-BACKUP: every meaningful save (equip/unequip, buying gear, chapter
  // completions, daily reward, companion recruitment — all the existing
  // saveGame() call sites) now also drops a timestamped JSON file via the
  // browser's normal download flow, throttled to at most once every 3
  // minutes so routine gear-shopping doesn't spam downloads. This exists
  // because localStorage alone was lost once already this project (likely a
  // hard cache-clear or site-data wipe) with no external copy to recover
  // from — a downloaded file survives that even though localStorage doesn't.
  let lastAutoBackup = 0;
  function ctAutoBackup(){
    const now = Date.now();
    if(now - lastAutoBackup < 180000) return; // 3 minute minimum gap
    lastAutoBackup = now;
    try {
      const blob = new Blob([JSON.stringify(game)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().slice(0,16).replace(/[:T]/g,'-');
      a.href = url;
      a.download = 'crimson-tide-autosave-'+stamp+'.json';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      console.log('[AutoBackup] Downloaded '+a.download);
    } catch(e) { console.error('[AutoBackup] failed:', e); }
  }
  const oldSaveGameForBackup = window.saveGame;
  window.saveGame = function(){
    const r = oldSaveGameForBackup.apply(this, arguments);
    ctAutoBackup();
    return r;
  };

  // RELOAD NUDGE: a plain beforeunload confirmation. Important caveat this
  // genuinely cannot do: it cannot stop the browser from clearing
  // localStorage (a "Clear browsing data" action, private-browsing cleanup,
  // or storage eviction bypasses this entirely) — it only catches someone
  // accidentally closing or refreshing the tab. The auto-backup above is the
  // actual protection against data loss; this is a secondary nudge only.
  window.addEventListener('beforeunload', function(e){
    e.preventDefault();
    e.returnValue = '';
  });
})();


(function(){
  // BUG FIX: game.marketPrices is a cache generated once (on game start /
  // port arrival) and then persisted in the save. Any good added after a
  // player's save was created (camphor/gold_dust/bezoar, added with Fair
  // Tide/Kota Batu) has no entry in that old cache until the cache is
  // regenerated — so game.marketPrices[port][newGood] reads as undefined.
  // buyGood/sellGood then compute totalPrice = undefined * qty = NaN, and
  // critically, `if (game.gold < NaN)` is ALWAYS false (any comparison with
  // NaN is), so the "not enough gold" guard never fires and the purchase
  // proceeds anyway — permanently corrupting game.gold into NaN the moment
  // it's touched. Three layers of fix below: self-heal the stale cache,
  // guard the two purchase functions so this can never corrupt gold again
  // even if some other stale-cache path is found later, and repair a
  // save that's already been corrupted.

  // 1) Self-heal: ensure every currently-registered GOODS key has a price
  // at the current port before it's ever read. Cheap, and safe to call
  // repeatedly — only fills in what's actually missing.
  window.__ctEnsureMarketPrices = function(){
    if(typeof GOODS==='undefined' || typeof PORTS==='undefined') return;
    game.marketPrices = game.marketPrices || {};
    const port = PORTS.find(p=>p.id===game.location);
    if(!port) return;
    game.marketPrices[port.id] = game.marketPrices[port.id] || {};
    Object.keys(GOODS).forEach(function(goodId){
      const existing = game.marketPrices[port.id][goodId];
      if(existing!==undefined && Number.isFinite(existing)) return;
      const good = GOODS[goodId];
      let multiplier = 0.5 + Math.random();
      if(port.specialties.includes(goodId)) multiplier *= 0.55;
      multiplier *= (0.8 + Math.random()*0.4);
      if(goodId==='contraband' && port.id!=='manila') multiplier = 0;
      game.marketPrices[port.id][goodId] = Math.max(1, Math.round(good.basePrice * multiplier));
    });
  };

  const oldRenderMarketForFix = window.renderMarket;
  window.renderMarket = function(){
    window.__ctEnsureMarketPrices();
    return oldRenderMarketForFix.apply(this, arguments);
  };

  // 2) Guard rails: even with the self-heal above, never let a non-finite
  // price actually mutate game.gold. Belt and suspenders.
  const oldBuyGoodForFix = window.buyGood;
  window.buyGood = function(goodId, qty){
    window.__ctEnsureMarketPrices();
    const priceCheck = game.marketPrices?.[game.location]?.[goodId];
    if(!Number.isFinite(priceCheck)){
      console.error('[GoldFix] blocked buyGood: non-finite price for', goodId, 'at', game.location);
      toast('⚠️ Price unavailable right now — try again in a moment.');
      return;
    }
    return oldBuyGoodForFix.apply(this, arguments);
  };
  const oldSellGoodForFix = window.sellGood;
  window.sellGood = function(goodId, qty){
    window.__ctEnsureMarketPrices();
    const priceCheck = game.marketPrices?.[game.location]?.[goodId];
    if(!Number.isFinite(priceCheck)){
      console.error('[GoldFix] blocked sellGood: non-finite price for', goodId, 'at', game.location);
      toast('⚠️ Price unavailable right now — try again in a moment.');
      return;
    }
    return oldSellGoodForFix.apply(this, arguments);
  };

  // 3) Repair: if this save already has a corrupted (NaN) gold value from
  // before this fix existed, reset it to 0 rather than leaving the wallet
  // permanently broken. This can't recover the true prior amount — that
  // information is gone the moment it became NaN — but a working wallet at
  // 0 is strictly better than a permanently broken "NaN g" display.
  // Hooked into loadGame() itself (not run once at script-parse time),
  // since the save doesn't actually populate `game` until the player picks
  // "Continue Voyage" — checking any earlier would just see the fresh
  // default game object, never the corrupted save.
  function repairGoldIfCorrupted(){
    if(typeof game!=='undefined' && !Number.isFinite(game.gold)){
      console.warn('[GoldFix] game.gold was non-finite ('+game.gold+') — resetting to 0.');
      game.gold = 0;
      toast('⚠️ Your gold total had become corrupted (a real bug, now fixed) and has been reset to 0. Sorry about that.', 6000);
      if(typeof saveGame==='function') saveGame();
    }
  }
  const oldLoadGameForFix = window.loadGame;
  if(typeof oldLoadGameForFix==='function'){
    window.loadGame = function(){
      const result = oldLoadGameForFix.apply(this, arguments);
      repairGoldIfCorrupted();
      return result;
    };
  }
  // Also covers the case where `game` is already corrupted and populated
  // by the time this script runs (e.g. a session already in progress).
  repairGoldIfCorrupted();
})();


(function(){
  // One-time migration for existing saves: effectiveMaxHp/Mp just gained a
  // real level-scaling term (see COMBAT SYSTEM section) where there was
  // none before. A character whose stored game.partyHp[id] exactly equals
  // their OLD raw base m.hp (the only value "full health" could have been
  // under the old formula) gets topped up to their new, much higher max —
  // so "was at full health" stays "at full health" instead of suddenly
  // reading as critically wounded purely from a balance change. Partial-
  // health cases are left alone; a rest at any port already tops those off.
  function migratePartyHpMpForLevelScaling(){
    if(typeof ALL_PARTY==='undefined' || typeof game==='undefined') return;
    if(game.hpLevelScalingMigrated) return;
    game.partyHp = game.partyHp || {};
    game.partyMp = game.partyMp || {};
    ALL_PARTY.forEach(function(m){
      const oldBaseHp = Number(m.maxHp ?? m.hp ?? 1);
      const oldBaseMp = Number(m.maxMp ?? m.mp ?? 0);
      if(game.partyHp[m.id] === oldBaseHp){
        game.partyHp[m.id] = effectiveMaxHp(m);
      }
      if(oldBaseMp > 0 && game.partyMp[m.id] === oldBaseMp){
        game.partyMp[m.id] = effectiveMaxMp(m);
      }
    });
    game.hpLevelScalingMigrated = true;
    if(typeof saveGame==='function') saveGame();
  }
  const oldLoadGameForHpFix = window.loadGame;
  if(typeof oldLoadGameForHpFix==='function'){
    window.loadGame = function(){
      const result = oldLoadGameForHpFix.apply(this, arguments);
      migratePartyHpMpForLevelScaling();
      return result;
    };
  }
  // IMPORTANT: this used to be a bare, unconditional call, which — unlike
  // repairGoldIfCorrupted's self-invocation elsewhere in this file (safe by
  // accident, since its own NaN-check can never be true on a fresh default
  // game object) — had no natural guard: game.hpLevelScalingMigrated is
  // simply absent on a fresh object, so this ran on every single page
  // load, mutated the pristine default `game`, and called saveGame(),
  // overwriting the real save in localStorage with a blank level-1 game
  // before the player ever got to click "Continue Voyage". This was the
  // actual cause of the "hard refresh resets progress to level 1" bug —
  // gated behind gameSessionActive now (see its declaration near SAVE_KEY),
  // which the wrapped loadGame() above already sets before reaching here.
  if (typeof gameSessionActive !== 'undefined' && gameSessionActive) migratePartyHpMpForLevelScaling();
})();
