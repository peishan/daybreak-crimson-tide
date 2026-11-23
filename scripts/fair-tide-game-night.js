(function(){
  // -------------------------------------------------------------------
  // GAME NIGHT (sequel only): three short games to play with the people at Fair Tide: members, residents, friends and guests.
  //   🎲 Harbor Dice   best of three rolls, one reroll per game
  //   🃏 Tide Cards    higher or lower, build a streak and cash out
  //   🎣 Fishing Contest   stop the marker in the sweet spot; three casts against your partner
  // 5 plays a day. Playing grows a resident's bond; winning pays a little gold, Hall Fund and Fair Tide mood. State: game.gameNight.
  // -------------------------------------------------------------------
  const PLAYS_PER_DAY = 5;
  const GAMES = {
    dice:    { icon: '🎲', name: 'Harbor Dice',     text: 'Best of three rolls of two dice. You may reroll once per game.' },
    cards:   { icon: '🃏', name: 'Tide Cards',      text: 'Higher or lower. Each right call grows the prize. Cash out before a wrong one.' },
    fishing: { icon: '🎣', name: 'Fishing Contest', text: 'Stop the marker in the sweet spot. Three casts against your partner.' }
  };
  function sequel(){ return !!(typeof game !== 'undefined' && game && game.arc42Complete); }
  function today(){ const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function lvl(){ try { return typeof level === 'function' ? level() : 1; } catch (e) { return 1; } }
  function fmt(n){ return Math.round(n).toLocaleString(); }
  function st(){ const g = game.gameNight = game.gameNight || {}; if (g.day !== today()) { g.day = today(); g.plays = 0; g.wins = 0; } return g; }
  function personName(id){
    const c = (window.TRIBUTE_CROSSOVER_CAST || []).find(function(x){ return x.id === id; }); if (c) return c.name;
    const m = (typeof ALL_PARTY !== 'undefined' ? ALL_PARTY : []).find(function(x){ return x.id === id; }); if (m) return m.name.charAt(0) + m.name.slice(1).toLowerCase();
    return id.charAt(0).toUpperCase() + id.slice(1);
  }
  function partners(){
    const out = [], seen = {};
    const add = function(id, name){ const k = String(name).toLowerCase(); if (seen[k]) return; seen[k] = 1; out.push({ id: id, name: name }); };
    try { (typeof window.guildHallMembers === 'function' ? window.guildHallMembers() : []).forEach(function(m){ add(m.id, m.name); }); } catch (e) {}
    try { (typeof window.checkInTargetIds === 'function' ? window.checkInTargetIds() : []).forEach(function(id){ add(id, personName(id)); }); } catch (e) {}
    return out;
  }
  function roll(n){ return 1 + Math.floor(Math.random() * n); }
  function rival(){ return (gn && gn.partner) ? gn.partner.name : 'your partner'; }

  let gn = { partner: null, game: null, s: null, timer: null };
  function stopTimer(){ if (gn.timer) { clearInterval(gn.timer); gn.timer = null; } }

  // ---- finishing a game ----
  function finish(won, label){
    stopTimer();
    const g = st(); g.plays += 1; if (won) g.wins += 1;
    const p = gn.partner;
    const base = Math.round(40 + lvl() * 1.5);
    const gold = won ? Math.round(base * (gn.s && gn.s.prize ? gn.s.prize : 1)) : Math.round(base * 0.25);
    game.gold = (game.gold || 0) + gold;
    if (won) { if (typeof window.addRenown === 'function') window.addRenown('game_night_win'); game.reputation = (game.reputation || 0) + 1; if (typeof window.guildHallAdd === 'function') window.guildHallAdd(500); if (typeof window.addFairTideMood === 'function') window.addFairTideMood(1); }
    let bond = '';
    try {
      const rec = typeof window.fairTideResidentsState === 'function' ? window.fairTideResidentsState()[p.id] : null;
      if (rec && typeof window.adjustResidentBond === 'function') { window.adjustResidentBond(p.id, 2); bond = ' Bond with ' + p.name + ' grew.'; }
    } catch (e) {}
    if (typeof window.dailyBump === 'function') window.dailyBump('play', 1);
    gn.s = { done: true, won: won, text: label + ' ' + (won ? 'You win! +' : 'Good game. +') + fmt(gold) + 'g.' + bond };
    if (typeof updateUI === 'function') updateUI();
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    draw();
  }

  // ---- 🎲 Harbor Dice ----
  function diceStart(){ gn.s = { round: 1, me: 0, them: 0, rerolls: 1, my: [roll(6), roll(6)], log: [], lock: false, prize: 1 }; }
  window.__gnDiceReroll = function(){ const s = gn.s; if (!s || s.rerolls <= 0 || s.lock) return; s.rerolls--; s.my = [roll(6), roll(6)]; draw(); };
  window.__gnDiceHold = function(){
    const s = gn.s; if (!s || s.lock) return;
    const them = [roll(6), roll(6)], a = s.my[0] + s.my[1], b = them[0] + them[1];
    let r = a > b ? 'you take it' : a < b ? rival() + ' takes it' : 'a push';
    if (a > b) s.me++; else if (a < b) s.them++;
    s.log.push('Round ' + s.round + ': you ' + a + ' (' + s.my.join('+') + ') vs ' + b + ' (' + them.join('+') + '): ' + r + '.');
    if (s.me >= 2 || s.them >= 2 || s.round >= 3) { finish(s.me > s.them, '🎲 ' + s.me + '-' + s.them + '.'); return; }
    s.round++; s.my = [roll(6), roll(6)]; draw();
  };
  function diceDraw(){
    const s = gn.s;
    return '<div style="font-size:1.6rem;margin:8px 0;">' + s.my.map(function(d){ return '🎲' + d; }).join('  ') + ' = <b>' + (s.my[0] + s.my[1]) + '</b></div>' +
      '<div style="font-size:.85rem;opacity:.85;">Round ' + s.round + ' of 3 · you ' + s.me + ' · ' + esc(rival()) + ' ' + s.them + '</div>' +
      '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;"><button class="btn btn-success" onclick="__gnDiceHold()">Hold and roll against ' + esc(rival()) + '</button>' +
      '<button class="btn btn-small"' + (s.rerolls > 0 ? '' : ' disabled') + ' onclick="__gnDiceReroll()">Reroll (' + s.rerolls + ' left)</button></div>' +
      s.log.map(function(l){ return '<div style="font-size:.76rem;opacity:.8;margin-top:3px;">' + esc(l) + '</div>'; }).join('');
  }

  // ---- 🃏 Tide Cards ----
  const FACES = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
  function face(n){ return FACES[n] || String(n); }
  const PRIZE = [0, 1, 2, 4, 7, 11, 18];
  function cardsStart(){ gn.s = { card: roll(13), streak: 0, prize: 1, log: [] }; }
  window.__gnCardsGuess = function(dir){
    const s = gn.s; if (!s || s.done) return;
    let next = roll(13), tries = 0; while (next === s.card && tries++ < 5) next = roll(13);
    if (next === s.card) { s.log.unshift(face(next) + ' again: no change.'); draw(); return; }
    const ok = dir === 'hi' ? next > s.card : next < s.card;
    s.log.unshift(face(s.card) + ' → ' + face(next) + (ok ? ' ✓' : ' ✗'));
    s.card = next;
    if (!ok) { s.prize = 1; finish(false, '🃏 Out at a streak of ' + s.streak + '.'); return; }
    s.streak++;
    if (s.streak >= 6) { s.prize = PRIZE[6]; finish(true, '🃏 A perfect run of 6.'); return; }
    draw();
  };
  window.__gnCardsCash = function(){ const s = gn.s; if (!s || s.done || s.streak < 1) return; s.prize = PRIZE[s.streak]; finish(true, '🃏 Cashed out at a streak of ' + s.streak + '.'); };
  function cardsDraw(){
    const s = gn.s;
    return '<div style="font-size:2.4rem;margin:8px 0;">🃏 <b>' + face(s.card) + '</b></div>' +
      '<div style="font-size:.85rem;opacity:.85;">Streak ' + s.streak + ' · cash out now for ' + (s.streak ? PRIZE[s.streak] + '× the stake' : '(call one first)') + ' · six right wins ' + PRIZE[6] + '×</div>' +
      '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;"><button class="btn btn-success" onclick="__gnCardsGuess(\'hi\')">⬆ Higher</button><button class="btn btn-danger" onclick="__gnCardsGuess(\'lo\')">⬇ Lower</button>' +
      '<button class="btn btn-small"' + (s.streak ? '' : ' disabled') + ' onclick="__gnCardsCash()">💰 Cash out</button></div>' +
      s.log.slice(0, 5).map(function(l){ return '<div style="font-size:.76rem;opacity:.8;margin-top:3px;">' + esc(l) + '</div>'; }).join('');
  }

  // ---- 🎣 Fishing Contest ----
  function fishStart(){
    gn.s = { cast: 1, mine: [], theirs: [], pos: 0, dir: 1, running: false, prize: 1 };
  }
  function fishRun(){
    stopTimer();
    const s = gn.s; s.running = true; s.pos = 0; s.dir = 1;
    const speed = 1.5 + s.cast * 0.9;
    gn.timer = setInterval(function(){
      const bar = document.getElementById('gn-marker');
      if (!bar || !gn.s || gn.s !== s) { stopTimer(); return; }
      s.pos += s.dir * speed; if (s.pos >= 100) { s.pos = 100; s.dir = -1; } if (s.pos <= 0) { s.pos = 0; s.dir = 1; }
      bar.style.left = s.pos + '%';
    }, 30);
    draw();
  }
  window.__gnFishCast = function(){ if (gn.s && !gn.s.running) fishRun(); };
  window.__gnFishReel = function(){
    const s = gn.s; if (!s || !s.running) return;
    stopTimer(); s.running = false;
    const mine = Math.max(0, Math.round(100 - Math.abs(s.pos - 50) * 2.2));
    const theirs = Math.max(0, Math.min(100, Math.round(55 + (Math.random() - 0.5) * 70)));
    s.mine.push(mine); s.theirs.push(theirs);
    if (s.cast >= 3) {
      const a = s.mine.reduce(function(x, y){ return x + y; }, 0), b = s.theirs.reduce(function(x, y){ return x + y; }, 0);
      finish(a >= b, '🎣 ' + a + ' to ' + b + '.'); return;
    }
    s.cast++; draw();
  };
  function fishDraw(){
    const s = gn.s;
    return '<div style="font-size:.85rem;opacity:.85;margin:6px 0;">Cast ' + s.cast + ' of 3 · stop the marker in the green</div>' +
      '<div style="position:relative;height:22px;background:rgba(0,0,0,.4);border-radius:6px;margin:8px 0;overflow:hidden;">' +
        '<div style="position:absolute;left:40%;width:20%;top:0;bottom:0;background:rgba(80,200,120,.55);"></div>' +
        '<div id="gn-marker" style="position:absolute;top:0;bottom:0;width:6px;background:#e8c547;left:' + s.pos + '%;"></div></div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
      (s.running ? '<button class="btn btn-success" onclick="__gnFishReel()">🎣 Reel in!</button>' : '<button class="btn btn-success" onclick="__gnFishCast()">Cast</button>') + '</div>' +
      '<div style="font-size:.78rem;opacity:.85;margin-top:6px;">You: ' + (s.mine.join(' + ') || '-') + ' · ' + esc(rival()) + ': ' + (s.theirs.join(' + ') || '-') + '</div>';
  }

  // ---- the tab ----
  window.__gnPartner = function(sel){ const p = partners().find(function(x){ return x.id === sel.value; }); gn.partner = p || null; };
  window.__gnStart = function(key){
    const g = st(), sel = document.getElementById('gn-partner');
    if (sel) window.__gnPartner(sel);
    if (!gn.partner) { toast('Pick someone to play with.'); return; }
    if (g.plays >= PLAYS_PER_DAY) { toast('Game night is over for today.'); return; }
    stopTimer(); gn.game = key;
    if (key === 'dice') diceStart(); else if (key === 'cards') cardsStart(); else fishStart();
    draw();
  };
  window.__gnAgain = function(){ stopTimer(); gn.game = null; gn.s = null; draw(); };
  function draw(){
    const area = document.getElementById('gn-area'); if (!area) return;
    if (!gn.game || !gn.s) { area.innerHTML = ''; return; }
    const info = GAMES[gn.game];
    let inner;
    if (gn.s.done) inner = '<div style="margin:8px 0;">' + esc(gn.s.text) + '</div><button class="btn btn-success" onclick="__gnAgain()">Back to the games</button>';
    else inner = gn.game === 'dice' ? diceDraw() : gn.game === 'cards' ? cardsDraw() : fishDraw();
    area.innerHTML = '<article class="quest-item" style="border-left-color:var(--gold);"><strong>' + info.icon + ' ' + info.name + ' with ' + esc(gn.partner.name) + '</strong>' + inner + '</article>';
  }
  function render(){
    const el = document.getElementById('ft-tab-gamenight'); if (!el) return;
    if (!sequel()) { el.innerHTML = '<div class="story-chip">Game Night begins with the sequel.</div>'; return; }
    const g = st(), list = partners(), left = Math.max(0, PLAYS_PER_DAY - g.plays);
    if (!gn.partner || !list.some(function(x){ return x.id === gn.partner.id; })) gn.partner = list[0] || null;
    let html = '<div class="panel-title">🎲 Game Night</div><p style="font-size:.85rem;opacity:.85;margin-bottom:10px;">Short games with the people at Fair Tide: members, residents, friends and guests. Playing grows a resident\'s bond; winning pays a little gold, some Hall Fund and lifts Fair Tide\'s mood.</p>' +
      '<div class="story-chip" style="margin-bottom:8px;">Plays left today: <b>' + left + '</b> of ' + PLAYS_PER_DAY + ' · wins today ' + g.wins + '</div>';
    if (!list.length) { html += '<div class="story-chip">No one is free to play yet. Members who join Fair Tide, and guests who visit, will show up here.</div>'; el.innerHTML = html; return; }
    html += '<label style="font-size:.85rem;">Play with: <select id="gn-partner" onchange="__gnPartner(this)" style="margin-left:6px;">' +
      list.map(function(x){ return '<option value="' + esc(x.id) + '"' + (gn.partner && gn.partner.id === x.id ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('') + '</select></label>';
    html += '<div style="margin-top:8px;">';
    Object.keys(GAMES).forEach(function(k){
      const gm = GAMES[k];
      html += '<article class="quest-item"><strong>' + gm.icon + ' ' + gm.name + '</strong><br><span style="font-size:.8rem;opacity:.85;">' + gm.text + '</span><br><button class="btn btn-small btn-success" style="margin-top:6px;"' + (left <= 0 ? ' disabled' : '') + ' onclick="__gnStart(\'' + k + '\')">Play</button></article>';
    });
    html += '</div><div id="gn-area" style="margin-top:8px;"></div>';
    el.innerHTML = html;
    draw();
  }
  const oldHub = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings', show = sequel();
    const el = document.getElementById('ft-tab-gamenight'), btn = document.getElementById('ft-tab-btn-gamenight');
    if (el) el.classList.toggle('active', tab === 'gamenight');
    if (btn) { btn.classList.toggle('active', tab === 'gamenight'); btn.style.display = show ? '' : 'none'; }
    if (tab !== 'gamenight') stopTimer();
    if (oldHub) oldHub.apply(this, arguments);
    if (tab === 'gamenight') render();
  };
})();
