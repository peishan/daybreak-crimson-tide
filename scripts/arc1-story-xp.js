(function(){
  // -------------------------------------------------------------------
  // ARC I STORY XP. From Arc II on, an arc's chapters pay exactly the XP from the arc's level
  // gate to the next one (story-xp-rebalance.js), so reading the story keeps you on the ladder
  // and fighting, trading and raiding puts you ahead of it. Arc I was the exception: its chapters paid
  // 35-175 XP, while its companion fights are gated at Levels 5, 10, 15, 20, 25, 30 and 35, so almost all of
  // that climb (59,500 XP) had to be ground out. Now Arc I follows the same rule:
  //
  //   Ch 1-4   (Singapore, Malacca prep)        as before: Ch 1 pays 800, then 150, 150, 175   -> Level 5
  //   Ch 5-11  (Joel, then the road to Palembang) -> Level 10   (Aisyah's gate)
  //   Ch 12-14 (Aisyah)                          -> Level 15   (Eliz's gate)
  //   Ch 15-17 (Eliz)                            -> Level 20   (Mezstorm's gate)
  //   Ch 18-19 (Mezstorm)                        -> Level 25   (Senedra's gate)
  //   Ch 20    (Senedra)                         -> Level 30   (Zaki's gate)
  //   Ch 21-23 (Zaki, Mezstorm, the siblings)    -> Level 35   (the Drowned Passage gate)
  //   Ch 24    (the finale)                      pays 3,000 on top
  //
  // SHARE is how much of each step the story pays (1 = all of it, as in every later arc; fight to get
  // ahead). Chapter XP is split by each chapter's original weight. Saves that already read a chapter
  // keep what it paid; chapters still to come pay the new amounts. Chapters here are paid without the
  // usual 5000-per-grant cap, like every other story chapter.
  // -------------------------------------------------------------------
  const SHARE = 1.0;
  const T = function(l){ return 50 * (l - 1) * l; };
  const BANDS = [[5, 11, 10], [12, 14, 15], [15, 17, 20], [18, 19, 25], [20, 20, 30], [21, 23, 35]];
  const FINALE = 3000;
  if (typeof ARC1_COMICS === 'undefined') return;

  const byId = {}; ARC1_COMICS.forEach(function(c){ if (c.__xpOrig == null) c.__xpOrig = +c.xp || 0; byId[c.id] = c; });
  function r5(n){ return Math.round(n / 5) * 5; }
  let cum = [1, 2, 3, 4].reduce(function(s, id){ return s + (byId[id] ? byId[id].__xpOrig : 0); }, 0);
  // chapters 1-4 keep their values (Chapter 1 was raised to 800 earlier)
  BANDS.forEach(function(b){
    const ids = []; for (let i = b[0]; i <= b[1]; i++) if (byId[i]) ids.push(i);
    const budget = Math.max(0, Math.round(SHARE * (T(b[2]) - cum)));
    const weight = ids.reduce(function(s, id){ return s + byId[id].__xpOrig; }, 0) || 1;
    let paid = 0;
    ids.forEach(function(id, k){
      const v = (k === ids.length - 1) ? (budget - paid) : r5(budget * byId[id].__xpOrig / weight);
      byId[id].xp = Math.max(byId[id].__xpOrig, v); paid += byId[id].xp;
    });
    cum += paid;
  });
  if (byId[24]) byId[24].xp = Math.max(byId[24].__xpOrig, FINALE);
  window.ARC1_STORY_XP = { share: SHARE, bands: BANDS, total: ARC1_COMICS.reduce(function(s, c){ return s + c.xp; }, 0) };

  // Arc I chapters are paid without the 5000 cap
  let uncapped = false;
  const oldFinish = window.finishStoryModeChapter;
  const oldGain = window.gainXP;
  if (typeof oldFinish === 'function' && typeof oldGain === 'function') {
    window.gainXP = function(amount, opts){
      if (uncapped) opts = Object.assign({}, opts, { uncapped: true });
      return oldGain.call(this, amount, opts);
    };
    window.finishStoryModeChapter = function(){
      uncapped = true;
      try { return oldFinish.apply(this, arguments); } finally { uncapped = false; }
    };
  }
})();
