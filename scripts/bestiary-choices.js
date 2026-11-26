(function(){
  // -------------------------------------------------------------------
  // BESTIARY RELEASE 4: the choice encounters. Each starts with a choice and branches to a fight or a quiet ending (or is only a choice).
  //   Hedda Penny-Eye   (any port but Fair Tide, after Arc XII) let her weigh your hold, or argue the weights. Her fight is the audit rule
  //                     (bestiary-round-rules.js): her health scales with the cargo you carry and her blows take goods from the hold, all returned.
  //   The Keeping       (Star Cove Harbor, after Arc XXI) ask it the right question, from the clues in the cove chapters, for a quiet ending and a
  //                     keepsake; or take it by force: a hard three-stage fight for the Warden's Chain.
  //   The Lantern-Keeper (Winter Harbor, after Arc XX) not a fight: light a lamp for the crew, for Fair Tide or for a stranger, for a 24-hour blessing.
  // Fight entries live in the same table as the other optional bosses (window.CH_OPTIONAL_FIGHTS) so rewards, standing and Renown work the same way.
  // -------------------------------------------------------------------
  const OPT = window.CH_OPTIONAL_FIGHTS, done = window.chArcDone;
  if (!OPT || typeof done !== 'function') return;
  const DAY = 24 * 60 * 60 * 1000;
  function esc2(s){ return typeof esc === 'function' ? esc(s) : String(s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function isDone(key){ return !!(game.crimsonHorizonOptional && game.crimsonHorizonOptional[key]); }
  function save(){ try { if (typeof saveGameQuiet === 'function') saveGameQuiet(); } catch (e) {} }

  function cargoValue(){
    let v = 0;
    const mp = (game.marketPrices && game.marketPrices[game.location]) || {};
    Object.keys(game.cargo || {}).forEach(function(g){
      const base = (typeof GOODS !== 'undefined' && GOODS && GOODS[g] && GOODS[g].basePrice) || 20;
      v += (game.cargo[g] || 0) * (mp[g] || base);
    });
    return v;
  }

  OPT.opt_hedda = {
    custom: true, port: '*', unlock: function(){ return done(12); },
    title: '⚖️ Hedda Penny-Eye', btn: '⚔️ Argue the weights',
    text: 'The lesser god of fair weights keeps a stall at every honest quay. She does not mind a crew that shorts a delivery now and then. She minds one that will not own to it. She measures the argument in your own hold, so a full hold makes a long one.',
    enemy: { name: 'Hedda Penny-Eye', icon: '⚖️', hp: 4400, dmg: 78, xp: 1500, gold: 750, rule: 'audit',
      twistText: 'Audit: her health follows the value of your cargo, and each of her blows weighs goods out of the hold. It all goes back when the fight ends',
      desc: 'A short, bright-eyed woman with a pair of brass scales that are never level. A full hold gives her more to weigh, and every blow she lands takes a little out of it until the fight is over.' },
    prepare: function(enemy){
      const cap = Math.max(10, game.cargoCapacity || 50);
      const f = 0.4 + Math.min(1.4, cargoValue() / (cap * 50));
      enemy.hp = Math.round(enemy.hp * f); if (enemy.maxHp) enemy.maxHp = enemy.hp;
    },
    reward: { standing: 40, discount: 0.03, chronicle: 'Hedda Penny-Eye puts her scales down level for the first time anyone remembers, and the Crimson Tide’s hold is the reason.', chronicleIcon: '⚖️',
      gear: {id:'heddas_scales', name:'Hedda’s Scales', icon:'⚖️', slot:'amulet', family:'any', hp:30, magic:7, tier:3, desc:'A tiny pair of brass scales on a chain. They only ever hang level.'},
      text: 'Hedda sets her scales down level and gives you a small pair of your own. (+40 standing here, and buying prices are 3% lower for good.)' }
  };
  OPT.opt_keeping = {
    custom: true, port: 'star_cove_harbor', unlock: function(){ return done(21); },
    title: '🌌 The Keeping', btn: '⚔️ Take it by force',
    text: 'Something has been kept in the cove beneath the stars for years, because nobody ever asked what it cost. The lights under the water lean toward it. You can ask it a question first, or take it by force.',
    enemy: { name: 'The Keeping', icon: '🌌', hp: 9000, dmg: 100, xp: 2600, gold: 1300, rule: 'keeping',
      twistText: 'Three stages: each time it is brought low, the next hold closes, and the last mends itself every round',
      desc: 'A great pale shape that fills the cove, held in place by every promise made to keep it there. It has three holds, and each one is harder than the last.',
      phases: [
        { at: 0.67, text: '🌌 The first hold gives way. The second closes, and the cove’s lights lean in to mend it.', heal: 0.05, dmgMult: 1.15 },
        { at: 0.34, text: '🌌 The second hold gives way. The third closes, and the Keeping starts to mend itself every round.', heal: 0.08, dmgMult: 1.25, twist: 'mender', twistText: 'The last hold mends itself every round' }
      ] },
    reward: { standing: 60, chronicle: 'The crew took the Keeping by force. The cove has been quiet since, in a different way.', chronicleIcon: '🌌',
      gear: {id:'wardens_chain', name:'Warden’s Chain', icon:'⛓️', slot:'amulet', family:'any', hp:44, magic:10, spd:4, tier:4, desc:'A chain of pale links that kept something in place for years. It is lighter than it looks.'},
      text: 'The last hold gives way. The cove is quiet, and the chain that held the Keeping lies in the shallows. (+60 standing.)' }
  };

  // ---- quiet endings ----
  function peacefulEnding(key, rw){
    const o = OPT[key]; if (!o || isDone(key)) return;
    game.crimsonHorizonOptional = game.crimsonHorizonOptional || {};
    game.crimsonHorizonOptional[key] = 'peaceful';
    const port = o.port === '*' ? (game.location || 'fair_tide') : o.port;
    game.portStanding = game.portStanding || {};
    game.portStanding[port] = (game.portStanding[port] || 0) + (rw.standing || 0);
    if (rw.discount) game.marketDiscount = Math.max(game.marketDiscount || 0, rw.discount);
    if (rw.gold) game.gold = Math.max(0, (game.gold || 0) + rw.gold);
    if (rw.gear && typeof window.addGearToInventory === 'function') window.addGearToInventory(rw.gear);
    if (rw.chronicle && typeof window.recordChronicleEntry === 'function') window.recordChronicleEntry(rw.chronicle, rw.chronicleIcon || '🏆');
    try { if (typeof window.addRenown === 'function') window.addRenown('optional_peaceful'); } catch (e) {}
    try { if (typeof window.notify === 'function') window.notify({ icon: rw.icon || '🕊️', title: o.title.replace(/^\S+\s/, '') + ' — a quiet ending', text: rw.text, kind: 'info', duration: 8000 }); } catch (e) {}
    try { if (typeof updateUI === 'function') updateUI(); } catch (e) {}
    save();
    if (typeof window.renderExplore === 'function') window.renderExplore();
  }
  window.heddaWeighHold = function(){
    if (isDone('opt_hedda')) return;
    const fee = Math.round((game.gold || 0) * 0.02);
    game.gold = Math.max(0, (game.gold || 0) - fee);
    peacefulEnding('opt_hedda', { standing: 20, discount: 0.01, icon: '⚖️', chronicle: 'Hedda Penny-Eye weighs the Crimson Tide’s hold and finds it fair, give or take a coin.', chronicleIcon: '⚖️',
      text: 'She weighs the hold out loud, charges a small fee (' + fee.toLocaleString() + 'g) for her trouble and finds it fair, give or take. (+20 standing here, and buying prices are 1% lower for good.)' });
  };
  const QUESTIONS = [
    { q: '“What are you afraid we will take?”', ok: false, reply: 'It does not move. Nothing in the question is for it.' },
    { q: '“What did it cost you to be kept here?”', ok: true },
    { q: '“Who is supposed to keep you?”', ok: false, reply: 'The lights under the water dim. That is somebody else’s question.' },
    { q: '“How do we make you leave?”', ok: false, reply: 'The water draws tight around the ship. That was not a question it can answer.' }
  ];
  window.keepingAsk = function(i){
    const q = QUESTIONS[i]; if (!q || isDone('opt_keeping')) return;
    if (typeof closeModal === 'function') closeModal();
    if (!q.ok) { if (typeof toast === 'function') toast('🌌 ' + q.reply + ' You can try again.', 4200); return; }
    peacefulEnding('opt_keeping', { standing: 30, icon: '🌌', chronicle: 'The crew asks the Keeping what it cost to be kept, and it finally gets to answer.', chronicleIcon: '🌌',
      gear: {id:'keepers_pearl', name:'Keeper’s Pearl', icon:'🫧', slot:'amulet', family:'any', hp:28, magic:8, tier:3, desc:'A small pale pearl, warm to the touch. It was given, not taken.'},
      text: 'It tells you, slowly, and the lights under the water settle. It lets go of the cove and leaves a pearl behind. (+30 standing.)' });
  };
  window.keepingOpen = function(){
    if (isDone('opt_keeping') || typeof showModal !== 'function') return;
    const clues = '<em>“It is not made for a space this small.”</em> (Mezstorm, over the cage in the cove.)<br><em>“Like setting something heavy down, after carrying it a very long way.”</em> (Mezstorm, at the rail afterwards.)';
    showModal('🌌 The Keeping', 'The lights under the water wait. It has been kept here a long time, and it will answer one question honestly.<br><br>' + clues + '<br><br>What do you ask?',
      QUESTIONS.map(function(q, i){ return { text: q.q, action: function(){ window.keepingAsk(i); } }; }).concat([{ text: 'Not yet', action: function(){ if (typeof closeModal === 'function') closeModal(); } }]));
  };

  // ---- the Lantern-Keeper ----
  const LAMPS = {
    crew:     { label: 'the crew', icon: '🏮', blessing: '+10% experience', line: 'The Lantern-Keeper lights a lamp for the crew, and the harbor remembers it.' },
    fairtide: { label: 'Fair Tide', icon: '🕯️', blessing: '+25% from gathering runs', line: 'The Lantern-Keeper lights a lamp for Fair Tide, and a window glows a little warmer.' },
    stranger: { label: 'a stranger', icon: '🪔', blessing: 'safer voyages (danger -1)', line: 'The Lantern-Keeper lights a lamp for someone the crew will never meet.' }
  };
  function lamp(){ game.lanternKeeper = game.lanternKeeper || {}; return game.lanternKeeper; }
  function lampKind(){ const l = lamp(); return l.until && Date.now() < l.until ? l.kind : null; }
  window.lanternLight = function(kind){
    const o = LAMPS[kind]; if (!o || lampKind() || game.location !== 'winter_harbor' || !done(20)) return;
    const l = lamp(); l.kind = kind; l.until = Date.now() + DAY; l.lit = l.lit || {};
    if (!l.lit[kind] && typeof window.recordChronicleEntry === 'function') window.recordChronicleEntry(o.line, o.icon);
    l.lit[kind] = true;
    try { if (typeof window.notify === 'function') window.notify({ icon: o.icon, title: 'A lamp for ' + o.label, text: 'The blessing lasts a day: ' + o.blessing + '.', kind: 'info', duration: 6000 }); } catch (e) {}
    save();
    if (typeof window.renderExplore === 'function') window.renderExplore();
  };
  const oldGain = window.gainXP;
  if (typeof oldGain === 'function') window.gainXP = function(amount){
    const a = Array.prototype.slice.call(arguments);
    if (lampKind() === 'crew' && typeof a[0] === 'number' && a[0] > 0) a[0] = Math.round(a[0] * 1.1);
    return oldGain.apply(this, a);
  };
  const oldYield = window.fairTideDispatchYield;
  if (typeof oldYield === 'function') window.fairTideDispatchYield = function(){
    const y = oldYield.apply(this, arguments);
    if (lampKind() === 'fairtide') Object.keys(y).forEach(function(k){ y[k] = Math.round(y[k] * 1.25); });
    return y;
  };
  const oldVoyage = window.doVoyage;
  if (typeof oldVoyage === 'function') window.doVoyage = function(portId, days, danger){
    return oldVoyage.call(this, portId, days, lampKind() === 'stranger' ? Math.max(1, (danger || 1) - 1) : danger);
  };
  // Hedda's lasting discount on what you buy
  const oldHaggle = window.haggleMultiplier;
  if (typeof oldHaggle === 'function') window.haggleMultiplier = function(){
    const m = oldHaggle.apply(this, arguments);
    return game.marketDiscount ? m * (1 - Math.min(0.1, game.marketDiscount)) : m;
  };

  // ---- cards on the Explore tab ----
  function card(title, text, body){
    return '<article class="quest-item" style="border-left-color:var(--gold);"><strong>' + title + '</strong> <span class="story-chip">Optional</span><br>' +
      '<span style="font-size:.82rem;opacity:.85;">' + esc2(text) + '</span><br>' + body + '</article>';
  }
  const oldExplore = window.renderExplore;
  window.renderExplore = function(){
    if (oldExplore) oldExplore.apply(this, arguments);
    try {
      const c = document.getElementById('exploreContent');
      if (!c || !game.arc42Complete) return;
      let html = '';
      const hed = OPT.opt_hedda;
      if (game.location !== 'fair_tide' && hed.unlock()) {
        html += card(hed.title, hed.text, isDone('opt_hedda')
          ? '<span style="font-size:.78rem;opacity:.75;">' + (game.crimsonHorizonOptional.opt_hedda === 'peaceful' ? '⚖️ Weighed and found fair.' : '✓ Cleared.') + '</span>'
          : '<span style="font-size:.76rem;opacity:.75;">Cargo held: ' + Math.round(cargoValue()).toLocaleString() + 'g of value. A fuller hold makes a longer fight.</span><br>' +
            '<button class="btn btn-small btn-success" style="margin-top:6px;" onclick="heddaWeighHold()">⚖️ Let her weigh the hold</button> ' +
            '<button class="btn btn-small btn-danger" style="margin-top:6px;" onclick="startCrimsonHorizonOptionalFight(\'opt_hedda\')">' + hed.btn + '</button>');
      }
      const kp = OPT.opt_keeping;
      if (game.location === 'star_cove_harbor' && kp.unlock()) {
        html += card(kp.title, kp.text, isDone('opt_keeping')
          ? '<span style="font-size:.78rem;opacity:.75;">' + (game.crimsonHorizonOptional.opt_keeping === 'peaceful' ? '🌌 Asked, and answered.' : '✓ Cleared.') + '</span>'
          : '<button class="btn btn-small btn-success" style="margin-top:6px;" onclick="keepingOpen()">💬 Ask it a question</button> ' +
            '<button class="btn btn-small btn-danger" style="margin-top:6px;" onclick="startCrimsonHorizonOptionalFight(\'opt_keeping\')">' + kp.btn + '</button>');
      }
      if (game.location === 'winter_harbor' && done(20)) {
        const k = lampKind(), l = lamp();
        let body;
        if (k) {
          const hrs = Math.max(1, Math.ceil((l.until - Date.now()) / 3600000));
          body = '<span style="font-size:.8rem;">' + LAMPS[k].icon + ' A lamp is lit for ' + LAMPS[k].label + ': ' + LAMPS[k].blessing + ' for about ' + hrs + ' more hour' + (hrs === 1 ? '' : 's') + '.</span>';
        } else {
          body = '<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px;">' + Object.keys(LAMPS).map(function(kk){
            return '<button class="btn btn-small" onclick="lanternLight(\'' + kk + '\')">' + LAMPS[kk].icon + ' For ' + LAMPS[kk].label + '<br><span style="font-size:.7rem;opacity:.8;">' + LAMPS[kk].blessing + '</span></button>';
          }).join('') + '</div>';
        }
        html += card('🏮 The Lantern-Keeper', 'The quiet god of lamps lit for people who are expected home. She does not fight anyone. Choose who the lamp is for, and she will keep it burning for a day.', body);
      }
      if (html) c.insertAdjacentHTML('afterbegin', html);
    } catch (e) { console.error('bestiary choices', e); }
  };
})();
