(function(){
  // -------------------------------------------------------------------
  // STORY XP REBALANCE.
  //
  // The early story arcs were written with token chapter XP (150-560 per
  // chapter), which is ~1-2% of what it costs to climb to the next arc's
  // level gate. Reading the story should be a real part of levelling, so
  // this rewrites each chapter's `xp` at load: every arc is given a share
  // (SHARE) of the XP between its own level gate and the next one, spread
  // over its chapters in proportion to their original weights.
  //
  //   * Runs at load, after every arc script. The arc scripts keep their
  //     own `xp` literals and read `ch.xp` at the moment a chapter is
  //     claimed, so the in-chapter "Story XP: +N" follows automatically.
  //   * Chapters already claimed in a save stay claimed; nothing is
  //     re-granted or clawed back. Only chapters read from now on pay more.
  //   * No chapter ever drops below its original XP, and none exceeds
  //     PER_CHAPTER_CAP -- the same 5000 ceiling gainXP() applies to any
  //     single grant, so nothing is silently wasted.
  //   * Short arcs hit the cap before they hit their share; that is
  //     intended (the cap is the limit, not the share).
  //
  // Level gates themselves sit in the arc scripts (+10 levels per arc from
  // Arc VII at Level 105 up to Arc XLII at Level 455, Crimson Horizon at
  // 465).
  // -------------------------------------------------------------------
  const SHARE = 0.35;
  const PER_CHAPTER_CAP = 5000;
  const ROUND_TO = 10;

  function xpTo(l){ return 50 * (l - 1) * l; }   // matches core-engine xpForLevel

  // Segment = a level band [lo, hi] plus the chapter arrays that sit in it.
  const SEGMENTS = [
    {lo:20,  hi:50,  names:['ARC2_CHAPTERS']},
    {lo:50,  hi:60,  names:['ARC3_CHAPTERS']},
    {lo:60,  hi:75,  names:['ARC4_CHAPTERS']},
    {lo:75,  hi:90,  names:['ARC5_CHAPTERS']},
    {lo:90,  hi:105, names:['ARC6_CHAPTERS']}
  ];
  const ARC_ARRAYS = {
    7:['ARC7_CHAPTERS'], 8:['ARC8_CHAPTERS'], 9:['ARC9_CHAPTERS'],
    10:['ARC10_CHAPTERS'], 11:['ARC11_CHAPTERS'], 12:['ARC12_CHAPTERS'],
    13:['ARC13_CHAPTERS'], 14:['ARC14_CHAPTERS'], 15:['ARC15_CHAPTERS'], 16:['ARC16_CHAPTERS'],
    17:['ARC17_CHAPTERS'], 18:['ARC18_CHAPTERS'], 19:['ARC19_CHAPTERS'], 20:['ARC20_CHAPTERS'],
    21:['ARC21_CHAPTERS','ARC20_INTERLUDE_CHAPTERS'],   // the interlude opens at the same gate as Arc 21
    22:['ARC22_CHAPTERS'], 23:['ARC23_CHAPTERS'], 24:['ARC24_CHAPTERS'], 25:['ARC25_CHAPTERS'],
    26:['ARC26_CHAPTERS'], 27:['ARC27_CHAPTERS'], 28:['ARC28_CHAPTERS'], 29:['ARC29_CHAPTERS'],
    30:['ARC30_CHAPTERS'], 31:['ARC31_CHAPTERS'], 32:['ARC32_CHAPTERS'], 33:['ARC33_CHAPTERS'],
    34:['ARC34_CHAPTERS'], 35:['ARC35_CHAPTERS'], 36:['ARC36_CHAPTERS'], 37:['ARC37_CHAPTERS'],
    38:['ARC38_CHAPTERS'], 39:['ARC39_CHAPTERS'], 40:['ARC40_CHAPTERS'], 41:['ARC41_CHAPTERS'],
    // Arc 42, the Lunareth bridge and the Arc 41 interlude all open at Level 455
    42:['ARC42_CHAPTERS','ARC41_BRIDGE_CHAPTERS','ARC41_INTERLUDE_CHAPTERS']
  };
  Object.keys(ARC_ARRAYS).forEach(function(k){
    const n = +k, g = 105 + 10 * (n - 7);
    SEGMENTS.push({lo:g, hi:g + 10, names:ARC_ARRAYS[k]});
  });
  // Crimson Horizon: ninety-one chapters opening at 465, roughly four arcs' worth.
  SEGMENTS.push({lo:465, hi:505, names:['CRIMSON_HORIZON_CHAPTERS']});

  function round(n){ return Math.round(n / ROUND_TO) * ROUND_TO; }

  const report = [];
  SEGMENTS.forEach(function(seg){
    const lists = seg.names.map(function(n){ return window[n]; }).filter(function(a){ return Array.isArray(a) && a.length; });
    if (!lists.length) return;
    let weight = 0;
    lists.forEach(function(a){ a.forEach(function(ch){ weight += (+ch.xp || 0); }); });
    if (!weight) return;
    const budget = SHARE * (xpTo(seg.hi) - xpTo(seg.lo));
    let total = 0;
    lists.forEach(function(a){
      a.forEach(function(ch){
        const orig = +ch.xp || 0;
        if (!orig) return;
        if (ch.__xpOrig == null) ch.__xpOrig = orig;       // idempotent if loaded twice
        const base = ch.__xpOrig;
        const next = Math.min(PER_CHAPTER_CAP, Math.max(base, round(budget * base / weight)));
        ch.xp = next;
        total += next;
      });
    });
    report.push({lo:seg.lo, hi:seg.hi, arrays:seg.names.join('+'), total:total, budget:Math.round(budget)});
  });
  window.STORY_XP_REBALANCE = {share:SHARE, perChapterCap:PER_CHAPTER_CAP, segments:report};
})();
