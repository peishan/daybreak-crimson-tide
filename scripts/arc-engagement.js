(function(){
  // -------------------------------------------------------------------
  // ENGAGEMENT FOR THE MAIN-GAME ARCS. A pilot on Arc VIII ("Beyond the Known Sea"), so a chapter is more than a button:
  //   * CHOICES. A chapter can ask you to decide before it completes. The pick is saved, pays out, can change a later fight, and is
  //     echoed in a later chapter's scene.
  //   * FIGHTS. A chapter can be completed by winning a fight, in several waves (the party recovers 25% between waves) with an
  //     enemy twist: 'frenzy' (hits 6% harder every round it survives, up to +48%) or 'mender' (heals 3% of its health each round).
  //   * OPTIONAL ENCOUNTERS. Fights in the port's Explore tab you can take or leave, once each, for a keepsake.
  // It wraps the arc's own markArcNChapterRead, so chapter order, XP, saves and scenes are the arc's own. State: game.arcEngage.
  // (The Crimson Horizon sequel has its own version of this in crimson-horizon-sequel.js.)
  // -------------------------------------------------------------------
  function st(){ game.arcEngage = game.arcEngage || { choice:{}, mods:{}, optional:{}, fightWon:{} }; const s = game.arcEngage; s.choice = s.choice || {}; s.mods = s.mods || {}; s.optional = s.optional || {}; s.fightWon = s.fightWon || {}; return s; }
  function prog(arc){ return game['comicProgress' + arc] || {}; }

  const ARCS = {
    8: {
      choices: {
        10: {
          title: 'The Last Entry',
          prompt: 'The journal stops at the island\'s centre. Nobody who read it can say whether the earlier expedition was lost or only delayed. The crew waits for your word on whether to go further, and how.',
          options: [
            { label: '⚓ Press on at once', result: 'You press on before the boundary can shift again. The crew moves fast and keeps its voices low. They find supplies someone left behind, but the island will be harder to leave. (+90g. In Chapter 17 the escape pays 25% more gold and the boundary hits back 10% harder.)', effect: { gold: 90, mods: { '17': { hpMult: 1.1, goldMult: 1.25 } } } },
            { label: '🧭 Send a scout ahead first', result: 'Renn sends a light ahead on a line and Mimi watches it for any sign of the sky bending. By the time the crew follows, the way is marked. (In Chapter 17 the boundary is 10% weaker.)', effect: { mods: { '17': { hpMult: 0.9 } } } },
            { label: '🏕️ Document the camp and rest first', result: 'You copy the journal page by page, and the crew sleeps in the old tents. It costs half a day and nobody regrets it. (Your party is fully restored at the start of Chapter 17.)', effect: { mods: { '17': { heal: true } } } }
          ]
        },
        15: {
          title: 'The Broken Observer',
          prompt: 'Parts of the structure still answer to a touch. Renn wants to repair what is broken and see what it does. Erynn wants to leave it exactly as found. Mimi does not want it switched on at all. Whose side do you take?',
          options: [
            { label: '🔧 Back Renn: repair one panel', result: 'Renn repairs a single panel, only enough to read from, and logs every step. It does not wake the rest. He is, for once, almost quiet about it. The salvaged fittings are worth something. (+120g.)', effect: { gold: 120 } },
            { label: '📜 Back Erynn: leave it as found', result: 'You leave the structure exactly as it is. Erynn copies the marks on its base, and says nothing for a while. Later he says it is the first time anyone in his family has left something alone on purpose. (+2 reputation.)', effect: { rep: 2 } },
            { label: '🔮 Back Mimi: do not touch it', result: 'Mimi keeps her hands in her sleeves, and the crew keeps well away. Whatever is in the structure stays unasked. It is, she says, the first time she has felt something look back and then politely stop. (+3 Fair Tide Mood.)', effect: { mood: 3 } }
          ]
        }
      },
      echoes: {
        11: function(c){ const p = c[10]; return p === 0 ? '<br><br>The crew went in fast, and no one forgets it. San sets her rule in a clipped voice: nobody gets left behind, and nobody goes ahead alone again.' : p === 1 ? '<br><br>The scout\'s light is already blinking back from ahead. San sets her rule beside it: nobody gets left behind, and nobody goes further than the light.' : p === 2 ? '<br><br>The crew is rested and the journal is copied twice. San sets her rule at the foot of the old tents: nobody gets left behind.' : ''; },
        16: function(c){ const p = c[15]; return p === 0 ? '<br><br>The one repaired panel is logged with the rest. It is the only part of the structure that does anything, and Renn has the grace not to mention it.' : p === 1 ? '<br><br>Erynn\'s copy of the marks goes into the record as found, with a note that nothing was altered.' : p === 2 ? '<br><br>Mimi\'s note in the record is a single line: it was not asked, and it did not insist.' : ''; }
      },
      fights: {
        17: {
          label: '🏃 Race to Escape', xp: 250,
          waves: [
            { name: 'The Fraying Edge', icon: '🌫️', hp: 900, dmg: 26, xp: 280, gold: 150, desc: 'The first of the boundary coming apart: shapes pulled loose from other years, crowding the path to the ships.' },
            { name: 'The Closing Boundary', icon: '🌀', hp: 1100, dmg: 30, xp: 340, gold: 190, twist: 'frenzy', twistText: 'The boundary closes in: hits harder every round', desc: 'The edge itself, collapsing. Every round you spend in it, it comes in harder. Strike fast.' }
          ]
        }
      },
      optional: {
        arc8_drift: {
          unlock: function(){ return !!prog(8)[6]; },
          title: '🌫️ A Drift of Other Years', btn: '⚔️ Clear it',
          text: 'Things from the island have started turning up in the harbor shallows: ropes from a century nobody remembers, a lantern that is not quite lit. They have started to move. Someone should clear them before they reach the quay.',
          enemy: { name: 'A Drift of Other Years', icon: '🌫️', hp: 900, dmg: 26, xp: 260, gold: 160, desc: 'Old things pulled out of their own time, moving as if they were still being used.' },
          reward: { rep: 3, text: 'The harbor watch takes the drift away in sacks. (+3 reputation.)' }
        },
        arc8_residue: {
          unlock: function(){ return !!prog(8)[18]; },
          title: '🌀 The Restless Residue', btn: '⚔️ Face the residue',
          text: 'The residue that came back from the island has not settled. Renn says it is rebuilding itself every few moments, and that anything that does that will be a nuisance to hit. Mimi says it is not angry, only unfinished.',
          enemy: { name: 'The Restless Residue', icon: '🌀', hp: 1300, dmg: 30, xp: 420, gold: 240, twist: 'mender', twistText: 'It mends itself every round', desc: 'A shapeless remainder of the boundary that keeps closing its own wounds. It falls to bursts, not patience.' },
          reward: { rep: 5, gear: { id: 'boundary_glass_charm', name: 'Boundary-Glass Charm', icon: '🔮', slot: 'amulet', family: 'any', hp: 14, magic: 4, tier: 2, desc: 'A sliver of glass the residue left behind. Held to the light, the horizon in it is slightly further away than the real one.' }, text: 'When it finally holds still, it leaves a sliver of glass. (+5 reputation and the Boundary-Glass Charm, an amulet.)' }
        }
      }
    }
  };

  // ---- applying a choice ----
  function applyEffect(arc, e){
    if (!e) return;
    if (e.gold) game.gold = (game.gold || 0) + e.gold;
    if (e.rep) game.reputation = (game.reputation || 0) + e.rep;
    if (e.mood && typeof window.addFairTideMood === 'function') window.addFairTideMood(e.mood);
    if (e.mods) Object.keys(e.mods).forEach(function(ch){ st().mods[arc + ':' + ch] = Object.assign(st().mods[arc + ':' + ch] || {}, e.mods[ch]); });
  }

  // ---- fights ----
  function waveEnemy(arc, ch, w){
    const f = ARCS[arc].fights[ch], base = f.waves[w];
    const enemy = scaleCrimsonEnemy(base, 'harbor');
    enemy.name = base.name; enemy.icon = base.icon; enemy.desc = base.desc;
    if (base.twist) { enemy.twist = base.twist; enemy.twistText = base.twistText; enemy.baseDmg = enemy.dmg; }
    const mods = st().mods[arc + ':' + ch] || {};
    if (mods.hpMult) { enemy.hp = Math.round(enemy.hp * mods.hpMult); if (enemy.maxHp) enemy.maxHp = Math.round(enemy.maxHp * mods.hpMult); }
    if (mods.goldMult) enemy.gold = Math.round((enemy.gold || 0) * mods.goldMult);
    return enemy;
  }
  function startWave(arc, ch, w){
    const f = ARCS[arc].fights[ch]; if (!f || typeof startCombat !== 'function') return;
    const last = w >= f.waves.length - 1;
    toast('⚔️ Wave ' + (w + 1) + '/' + f.waves.length + ': ' + f.waves[w].name, 3000);
    startCombat({ kind: 'arc_story', key: last ? ('arc' + arc + '_ch' + ch) : ('arc' + arc + '_ch' + ch + ':w' + w), enemy: waveEnemy(arc, ch, w) });
  }
  function beginFight(arc, ch){
    const mods = st().mods[arc + ':' + ch] || {};
    if (mods.heal && typeof window.restoreAllAboardCrew === 'function') { try { window.restoreAllAboardCrew(); } catch(e) {} }
    startWave(arc, ch, 0);
  }

  // The chapter's scene is queued (game.storyModalQueue) by the arc itself; show it once nothing else is on screen.
  function flushScene(){
    setTimeout(function(){
      const m = document.getElementById('modalOverlay');
      if (m && m.classList.contains('active')) return;       // whatever is open will hand over to the queue when it closes
      if (game.storyModalQueue && game.storyModalQueue.length && typeof showStoryModal === 'function') showStoryModal(game.storyModalQueue.shift());
    }, 700);
  }

  // ---- the chapter wrapper ----
  const busyChapters = {};
  Object.keys(ARCS).forEach(function(arcKey){
    const arc = Number(arcKey), cfg = ARCS[arc];
    const fname = 'markArc' + arc + 'ChapterRead', sceneName = 'ARC' + arc + '_CHAPTER_SCENES';
    const old = window[fname];
    if (typeof old !== 'function') return;
    const baseScenes = {};
    window[fname] = function(id){
      const self = this, args = arguments, n = Number(id);
      const stateFn = window['arc' + arc + 'ObjectiveState'];
      const ready = typeof stateFn === 'function' && stateFn() === ('complete_arc' + arc + '_chapter_' + n) && !prog(arc)[n];
      if (ready) {
        const key = arc + ':' + n;
        // a fight chapter completes by winning the fight
        if (cfg.fights && cfg.fights[n] && !st().fightWon[key]) {
          if (game.inCombat) return;
          beginFight(arc, n);
          return;
        }
        // a choice chapter asks first
        const ch = cfg.choices && cfg.choices[n];
        if (ch && st().choice[key] == null) {
          if (busyChapters[key]) return;
          busyChapters[key] = true;
          showModal('📖 ' + ch.title, ch.prompt, ch.options.map(function(o, i){
            return { text: o.label, action: function(){
              st().choice[key] = i; applyEffect(arc, o.effect);
              if (typeof saveGameQuiet === 'function') saveGameQuiet();
              showModal(ch.title, o.result, [{ text: 'Continue', action: function(){ busyChapters[key] = false; if (typeof closeModal === 'function') closeModal(); old.apply(self, args); if (typeof updateUI === 'function') { try { updateUI(); } catch(e) {} } flushScene(); } }]);
            } };
          }));
          return;
        }
      }
      // earlier choices echo into the scene this chapter is about to show
      try {
        const scenes = window[sceneName];
        if (scenes && cfg.echoes && cfg.echoes[n]) {
          if (baseScenes[n] == null) baseScenes[n] = scenes[n];
          const c = {}; Object.keys(st().choice).forEach(function(k){ const p = k.split(':'); if (Number(p[0]) === arc) c[Number(p[1])] = st().choice[k]; });
          scenes[n] = baseScenes[n] + (cfg.echoes[n](c) || '');
        }
      } catch(e) {}
      return old.apply(self, args);
    };
  });

  // ---- waves, and winning the chapter ----
  const queued = {};
  const oldVictory = window.handleVictory;
  if (typeof oldVictory === 'function') {
    window.handleVictory = function(){
      const enemy = game.combatEnemy;
      const r = oldVictory.apply(this, arguments);
      try {
        if (!enemy || enemy.kind !== 'arc_story') return r;
        const key = String(enemy.key);
        let m = /^arc(\d+)_ch(\d+):w(\d+)$/.exec(key);
        if (m) {
          const qk = key; if (queued[qk]) return r; queued[qk] = true;
          const arc = Number(m[1]), ch = Number(m[2]), w = Number(m[3]);
          (typeof getCrimsonCombatParty === 'function' ? getCrimsonCombatParty() : []).forEach(function(mem){
            const mh = effectiveMaxHp(mem), mm = effectiveMaxMp(mem);
            game.partyHp[mem.id] = Math.min(mh, (game.partyHp[mem.id] || 0) + Math.round(mh * 0.25));
            game.partyMp[mem.id] = Math.min(mm, (game.partyMp[mem.id] || 0) + Math.round(mm * 0.25));
          });
          toast('💨 A brief respite: the crew recovers 25% before the next group.', 3000);
          setTimeout(function(){ queued[qk] = false; startWave(arc, ch, w + 1); }, 1100);
          return r;
        }
        m = /^arc(\d+)_ch(\d+)$/.exec(key);
        if (m) {
          const arc = Number(m[1]), ch = Number(m[2]);
          st().fightWon[arc + ':' + ch] = true;
          const mark = window['markArc' + arc + 'ChapterRead'];
          if (typeof mark === 'function') mark(ch);
          if (typeof game.storyModalQueue !== 'undefined' && game.storyModalQueue.length && typeof showStoryModal === 'function') {
            setTimeout(function(){ if (game.storyModalQueue.length) showStoryModal(game.storyModalQueue.shift()); }, 900);
          }
          return r;
        }
        m = /^arcopt_(.+)$/.exec(key);
        if (m) claimOptional(m[1]);
      } catch(e) {}
      return r;
    };
  }
  // a lost wave leaves the next start fresh
  const oldDefeat = window.handleDefeat;
  if (typeof oldDefeat === 'function') window.handleDefeat = function(){ Object.keys(queued).forEach(function(k){ queued[k] = false; }); return oldDefeat.apply(this, arguments); };

  // ---- twists ----
  const oldCounter = window.enemyCounterAttack;
  if (typeof oldCounter === 'function') {
    window.enemyCounterAttack = function(){
      try {
        const e = game.combatEnemy;
        if (e && e.twist && e.kind === 'arc_story') {
          e.twistRounds = (e.twistRounds || 0) + 1;
          if (e.twist === 'frenzy') e.dmg = Math.round((e.baseDmg || e.dmg) * (1 + 0.06 * Math.min(e.twistRounds, 8)));
          if (e.twist === 'mender') game.combatEnemyHp = Math.min(e.hp, game.combatEnemyHp + Math.round(e.hp * 0.03));
        }
      } catch(er) {}
      return oldCounter.apply(this, arguments);
    };
  }
  const oldRenderCombat = window.renderCombat;
  if (typeof oldRenderCombat === 'function') {
    window.renderCombat = function(){
      const r = oldRenderCombat.apply(this, arguments);
      try {
        const e = game.combatEnemy, el = document.getElementById('enemyBuffs');
        if (e && e.kind === 'arc_story' && e.twistText && el) {
          const pct = e.twist === 'frenzy' ? ' (+' + Math.round(6 * Math.min(e.twistRounds || 0, 8)) + '%)' : '';
          el.insertAdjacentHTML('beforeend', '<span class="buff-icon buff-mark">🔥 ' + String(e.twistText).replace(/[<>&]/g, '') + pct + '</span>');
        }
      } catch(er) {}
      return r;
    };
  }

  // ---- optional encounters ----
  function findOptional(key){ for (const a in ARCS) { if (ARCS[a].optional && ARCS[a].optional[key]) return ARCS[a].optional[key]; } return null; }
  function claimOptional(key){
    const o = findOptional(key); if (!o || st().optional[key]) return;
    st().optional[key] = true;
    if (o.reward.rep) game.reputation = (game.reputation || 0) + o.reward.rep;
    if (o.reward.gear && typeof window.addGearToInventory === 'function') window.addGearToInventory(o.reward.gear);
    if (typeof window.notify === 'function') window.notify({ icon: '🏆', title: o.title.replace(/^\S+\s/, '') + ' — cleared', text: o.reward.text, kind: 'info', duration: 8000 });
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  }
  window.startArcOptionalFight = function(key){
    const o = findOptional(key);
    if (!o || st().optional[key] || !o.unlock()) { toast('Not available right now.'); return; }
    if (game.inCombat || typeof startCombat !== 'function') return;
    const enemy = scaleCrimsonEnemy(o.enemy, 'harbor');
    enemy.name = o.enemy.name; enemy.icon = o.enemy.icon; enemy.desc = o.enemy.desc;
    if (o.enemy.twist) { enemy.twist = o.enemy.twist; enemy.twistText = o.enemy.twistText; enemy.baseDmg = enemy.dmg; }
    startCombat({ kind: 'arc_story', key: 'arcopt_' + key, enemy: enemy });
  };
  const oldExplore = window.renderExplore;
  window.renderExplore = function(){
    if (oldExplore) oldExplore.apply(this, arguments);
    try {
      const container = document.getElementById('exploreContent'); if (!container) return;
      Object.keys(ARCS).forEach(function(a){
        const opt = ARCS[a].optional || {};
        Object.keys(opt).forEach(function(key){
          const o = opt[key]; if (!o.unlock()) return;
          const done = !!st().optional[key];
          container.insertAdjacentHTML('afterbegin',
            '<article class="quest-item" style="border-left-color:var(--danger);"><strong>' + o.title + '</strong> <span class="story-chip">Optional</span><br>' +
            '<span style="font-size:.82rem;opacity:.85;">' + o.text + '</span><br>' +
            (done ? '<span style="font-size:.78rem;opacity:.75;">✓ Cleared.</span>'
                  : '<span style="font-size:.76rem;opacity:.75;">' + o.enemy.name + (o.enemy.twistText ? ' · ' + o.enemy.twistText : '') + '</span><br><button class="btn btn-small btn-danger" style="margin-top:6px;" onclick="startArcOptionalFight(\'' + key + '\')">' + o.btn + '</button>') +
            '</article>');
        });
      });
    } catch(e) {}
  };
})();
