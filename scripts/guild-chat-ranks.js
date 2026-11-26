(function(){
  // -------------------------------------------------------------------
  // GUILD CHAT, RANKS AND THE WEEKLY BOARD (sequel only; two Fair Tide tabs).
  //
  //  * 💬 Guild Chat: a scrolling chat window where Fair Tide's members talk while you play (banter in each member's own voice, Titan and Dailies
  //    chatter, "X has come online", cheers when you fell a Titan or finish your Dailies). You can talk back: members reply, and /roll /who /me /motd work.
  //    A message of the day sits at the top. While you are away the chat catches up with a handful of older lines.
  //  * 🏅 Guild Roll: guild level and your title (both from Renown earned in the sequel), every member's rank, who is online, and a weekly contribution
  //    board. Your score is the Renown you earn that week; the other members' scores are simulated from a steady per-member rhythm. The top three
  //    on the board at the end of the week (it resets Monday) are paid a small reward.
  //
  // State: game.guildChat = { lines, motd, lastGen, lastSeen, online, title, week: { key, pts, paid } }. Tune: LINE_CAP, TITLES, BOARD_SCALE, LEVEL_DIV.
  // -------------------------------------------------------------------
  const LINE_CAP = 80, BACKLOG_MAX = 14, GAP_MS = 150 * 1000;
  const BOARD_SCALE = 700;                      // roughly a busy week of Renown
  const LEVEL_DIV = 12;                         // guild level = 1 + floor(sqrt(Renown / LEVEL_DIV))
  const TITLES = [[0, 'Newcomer'], [150, 'Deckhand'], [400, 'Harbor Hand'], [800, 'Tide Walker'], [1400, 'Harbor Warden'], [2200, 'Voice of the Hall'], [3400, 'Lodestar Friend']];
  const OFFICERS = ['joel', 'helmsman', 'jade', 'devon', 'aisyah', 'maera', 'adrian', 'eve'];
  const VETERANS = ['sally', 'levi', 'sky', 'jenika', 'erynn', 'renn', 'mimi', 'fen', 'aster', 'hugh', 'sera', 'senedra', 'zaki', 'ate_joy', 'caelan', 'sairen', 'jovie', 'brada_shah', 'kw_liang'];

  function sequel(){ return !!(typeof game !== 'undefined' && game && game.arc42Complete); }
  function chat(){
    const c = game.guildChat = game.guildChat || {};
    if (!c.lines) c.lines = [];
    if (c.motd == null) c.motd = 'Welcome to the Hall. Mind the cat.';
    if (!c.online) c.online = {};
    if (!c.lastGen) c.lastGen = Date.now();
    if (!c.lastSeen) c.lastSeen = 0;
    if (!c.week) c.week = { key: weekKey(), pts: 0, paid: true };
    return c;
  }
  function esc2(s){ return (typeof esc === 'function') ? esc(s) : String(s).replace(/[&<>"']/g, function(ch){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  function fmt(n){ return Math.round(n).toLocaleString(); }
  function hash(s){ let n = 0; for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) | 0; return Math.abs(n); }
  function pick(a){ return a[Math.floor(Math.random() * a.length)]; }
  function lvl(){ try { return typeof level === 'function' ? level() : 1; } catch (e) { return 1; } }
  function weekKey(d){ d = d ? new Date(d) : new Date(); const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = (t.getUTCDay() + 6) % 7; t.setUTCDate(t.getUTCDate() - day); return t.toISOString().slice(0, 10); }   // the Monday
  function weekFraction(){ const d = new Date(); const day = (d.getDay() + 6) % 7; return Math.min(1, (day + (d.getHours() + 1) / 24) / 7); }
  // Your own name: the helmsman's if you sail as one, otherwise San's
  function me(){ try { return (typeof window.helmsmanActive === 'function' && window.helmsmanActive() && game.avatar.name) ? game.avatar.name : 'San'; } catch (e) { return 'San'; } }
  // The roster is the Hall's members (residents and roster) plus everyone in your party, so Joel, Ate Joy, Caelan and the rest appear too.
  const NAMES = { dr_aa: 'Dr. AA', kw_liang: 'KW Liang' };
  function titleCase(s){ return String(s).toLowerCase().replace(/(^|\s)(\S)/g, function(m, a, b){ return a + b.toUpperCase(); }); }
  function members(){
    const base = (typeof window.guildHallMembers === 'function') ? window.guildHallMembers().slice() : [];
    const seenId = {}, seenName = {};
    base.forEach(function(m){ seenId[String(m.id).toLowerCase()] = 1; seenName[String(m.name).toLowerCase()] = 1; });
    try {
      (typeof getActiveParty === 'function' ? getActiveParty() : []).forEach(function(m){
        if (m.id === 'san') return;
        const name = NAMES[m.id] || titleCase(m.name);
        if (seenId[m.id] || seenName[name.toLowerCase()]) return;
        seenId[m.id] = 1; seenName[name.toLowerCase()] = 1;
        base.push({ id: m.id, name: name, icon: m.portrait || '⚓' });
      });
    } catch (e) {}
    return base;
  }
  function renown(){ return typeof window.sequelRenown === 'function' ? window.sequelRenown() : 0; }
  function title(){ let t = TITLES[0][1]; const r = renown(); TITLES.forEach(function(x){ if (r >= x[0]) t = x[1]; }); return t; }
  function guildLevel(){ return Math.min(30, 1 + Math.floor(Math.sqrt(renown() / LEVEL_DIV))); }
  function levelFloor(l){ return (l - 1) * (l - 1) * LEVEL_DIV; }
  function key(m){ return String(m.id || '').toLowerCase(); }
  function rank(m){ const k = key(m); return OFFICERS.indexOf(k) !== -1 ? { n: 'Officer', i: '🎖️' } : (VETERANS.indexOf(k) !== -1 ? { n: 'Veteran', i: '⭐' } : { n: 'Member', i: '🔹' }); }
  function online(m){ return hash(key(m) + ':' + Math.floor(Date.now() / (45 * 60 * 1000))) % 10 < 6; }

  // ---- the voices ----
  const OWN = {
    jade: ['Anyone seen my good gloves? I put them down for one minute.', 'Sparring at dusk. Bring a friend. I need a witness.', 'The Titan is rude and I respect it.', 'Whoever moved the training dummy, I will find you.'],
    devon: ['I annotated the margins. I will not be taking questions.', 'Tea first, strategy second.', 'Fair Tide’s tide tables are four minutes off. I checked twice.', 'Reminder: the charts do not read themselves.'],
    sally: ['Who’s in for a game tonight? I’ll go easy. I won’t.', 'Don’t tell Levi I bought another hat.', 'The market and I understand each other.', 'Dice night is never a rumor.'],
    levi: ['I drew a griffin. It looks like a goat. The griffin is very proud.', 'Careful on the stairs, the third step is loose.', 'Did everyone eat? Sorry, I always ask.', 'Notes updated. Again.'],
    sky: ['Drink water. That is a prescription.', 'If you are hurt, say so. If you are “fine”, also say so, so I can ignore it.', 'Fresh blankets in the infirmary. No questions asked.'],
    maera: ['Appointments are gentle, but they are not optional.', 'The tea is ready. It is also medicine.', 'Rest. I will keep saying it until someone does.'],
    adrian: ['I can explain the gear train again, slower.', 'Can someone hold this? Not that way.', 'The workshop is open. The coffee is not mine.'],
    eve: ['Adrian, put the clipboard down.', 'The girls asked about the horse again.', 'There is a quiet corner. I am in it.'],
    hugh: ['I am told I may not answer letters at the table.', 'Fair Tide soup beats diplomacy, every time.', 'Is this what a free afternoon feels like? Remarkable.'],
    sera: ['Today I did nothing and it was glorious.', 'Bun, bench, harbor. In that order.', 'The twins have opinions about my blanket.'],
    erynn: ['The archive is open if anyone needs a quiet hour.', 'I have a list. I am not using it today. Growth.', 'Somebody has been reshelving by color. I am watching.'],
    renn: ['Instruments calibrated. Please stop leaning on the table.', 'Hypothesis: it is the cat.', 'Observation first. Always observation first.'],
    mimi: ['The sea is humming something. A little off-key.', 'Tea leaves say: probably fine.', 'I saw a gull and it felt significant.'],
    aisyah: ['Rope is up. Buy low, sell with dignity.', 'I have a ledger and an opinion.', 'Anyone selling spice? I will pay what it is worth.'],
    fen: ['Fixed the thing. Do not ask what thing.', 'Aster says hello. Aster says he is busy. Aster is lying.'],
    aster: ['Short on time, long on gratitude.', 'Fair Tide is quieter than I expected. I like it.'],
    ate_joy: ['Warden on duty. Please do not climb the wall.', 'Soel stole my chair again.'],
    caelan: ['Workshop. Do not ask.', 'Something is humming in the lens room. It is fine. Probably.'],
    senedra: ['Eyes on the horizon, boots on the dock.', 'Scouts report: one gull, extremely smug.'],
    zaki: ['Who wants to arm-wrestle? Nobody? Fine.', 'I carried it myself. All of it.']
  };
  const GENERIC = ['Anyone else’s charter smell like fish and victory?', 'I’ll take the late shift.', 'Who’s up for a Titan run?', 'Tide’s turning. You can feel it.', 'Anyone seen the cat?', 'Lanterns are lit on the quay.', 'Good hands today, everyone.', 'Crates sorted. Back to my tea.', 'That ferry crew owes me a favor.', 'Remember to eat something that is not bread.', 'Does the Hall have a spare lantern? Asking for me.', 'The market has pears. Just saying.'];
  const MORNING = ['Morning, Hall.', 'Good morning. Who has the first charter?', 'Up with the gulls again.'], EVENING = ['Evening, Hall. Quiet tonight.', 'Lanterns out. Good night soon.', 'Anyone for supper?'];
  const CHEER = ['Nice work, Captain!', 'That is how it is done.', 'Hall’s proud of you.', 'Somebody write that down.', 'Drinks on the Hall fund!'];
  const THANKS = ['Any time.', 'Of course!', 'That is what the Hall is for.', 'Anytime, Captain.'];
  const HELLO = ['Welcome back, Captain!', 'Hey, you!', 'There she is.', 'Morning, Captain.'];

  function say(who, icon, text, kind, t){
    const c = chat();
    c.lines.push({ t: t || Date.now(), w: who, i: icon || '', x: text, k: kind || 'c' });
    if (c.lines.length > LINE_CAP) c.lines.splice(0, c.lines.length - LINE_CAP);
  }
  function sys(text, t){ say('', '', text, 's', t); }
  function titanPct(){ try { const t = game.titan; return t && t.maxHp ? Math.max(0, Math.round(t.hp / t.maxHp * 100)) : null; } catch (e) { return null; } }
  function textFor(m){
    const r = Math.random(), k = key(m), own = OWN[k];
    const h = new Date().getHours();
    const tp = titanPct();
    if (r < 0.42 && own) return pick(own);
    if (r < 0.52 && tp != null) return 'Tide Titan is at ' + tp + '%. Keep swinging.';
    if (r < 0.6) return 'Hall fund is ' + fmt(typeof window.guildHallFund === 'function' ? window.guildHallFund() : 0) + '. Who is spending it?';
    if (r < 0.68) return h < 11 ? pick(MORNING) : (h >= 18 ? pick(EVENING) : 'Afternoon, Hall. Anything on the board?');
    return pick(GENERIC);
  }
  // one new line from a random member (or a presence change / Soel)
  function gen(t){
    const ms = members();
    if (!ms.length) return;
    const c = chat(), r = Math.random();
    if (r < 0.1) { say('Soel', '🐾', pick(['mrrp.', '*sits on the keyboard*', '*knocks a cup off the table*', '*stares at the Titan, unimpressed*']), 'c', t); return; }
    const m = pick(ms);
    const on = online(m), was = c.online[key(m)];
    if (was != null && was !== on) { c.online[key(m)] = on; sys(m.icon + ' ' + m.name + (on ? ' has come online.' : ' has gone offline.'), t); return; }
    c.online[key(m)] = on;
    if (!on) return;
    say(m.name, m.icon, textFor(m), 'c', t);
  }
  function catchUp(){
    const c = chat(), now = Date.now(), away = now - c.lastGen;
    if (away < GAP_MS) return;
    const n = Math.min(BACKLOG_MAX, Math.floor(away / GAP_MS));
    const ts = [];
    for (let i = 0; i < n; i++) ts.push(c.lastGen + (away * (i + 1) / (n + 1)));
    ts.forEach(function(t){ gen(t); });
    c.lastGen = now;
  }
  window.guildChatCatchUp = catchUp;

  // ---- weekly board ----
  function simScore(m, wk, frac){ const r = (hash(key(m) + ':' + wk) % 1000) / 1000; return Math.round(BOARD_SCALE * (0.2 + 0.95 * r) * Math.max(0.12, frac)); }
  function board(wk, frac){
    const c = chat();
    const rows = members().map(function(m){ return { name: m.name, icon: m.icon, pts: simScore(m, wk, frac), me: false }; });
    rows.push({ name: 'You (' + me() + ')', icon: '⚓', pts: c.week.key === wk ? c.week.pts : 0, me: true });
    rows.sort(function(a, b){ return b.pts - a.pts; });
    return rows;
  }
  function weekCheck(){
    const c = chat(), wk = weekKey();
    if (c.week.key === wk) return;
    // the week ended: pay the top three of the finished week (the others finish at their full-week rhythm)
    if (!c.week.paid && c.week.pts > 0) {
      const rows = board(c.week.key, 1), pos = rows.findIndex(function(r){ return r.me; });
      if (pos >= 0 && pos < 3) {
        const gold = Math.round(lvl() * [25, 15, 10][pos]), fund = [2000, 1000, 500][pos];
        game.gold = (game.gold || 0) + gold;
        if (typeof window.guildHallAdd === 'function') window.guildHallAdd(fund);
        sys('🏅 Last week’s board: you finished #' + (pos + 1) + '. +' + fmt(gold) + 'g and +' + fmt(fund) + ' to the Hall Fund.');
        if (typeof window.notify === 'function') window.notify({ icon: '🏅', title: 'Weekly board: #' + (pos + 1), text: '+' + fmt(gold) + 'g and +' + fmt(fund) + ' in the Hall Fund.', kind: 'info', duration: 7000 });
      } else sys('📋 Last week’s board is closed. You finished #' + (pos + 1) + '. A new week starts now.');
    }
    c.week = { key: wk, pts: 0, paid: false };
  }
  // titles and levels announce themselves
  function checkTitle(){
    const c = chat(), t = title();
    if (c.title == null) { c.title = t; return; }
    if (c.title !== t) {
      c.title = t;
      sys('🎖️ ' + me() + ' has earned the title [' + t + '].');
      if (typeof window.notify === 'function') window.notify({ icon: '🎖️', title: 'New title: ' + t, text: 'Renown earned in the sequel has raised your standing in the Hall.', kind: 'info', duration: 6500 });
      say(pick(members().length ? members() : [{ name: 'Someone', icon: '' }]).name, '', pick(CHEER), 'c');
    }
    const gl = guildLevel();
    if (c.guildLevel == null) c.guildLevel = gl;
    else if (gl > c.guildLevel) { c.guildLevel = gl; sys('🏛️ The Guild is now level ' + gl + '.'); }
  }

  // ---- reacting to what you do ----
  let lastReact = {};
  function react(k, text, cheers){
    const now = Date.now();
    if (lastReact[k] && now - lastReact[k] < 20000) return;
    lastReact[k] = now;
    if (text) sys(text);
    const ms = members().filter(online);
    if (cheers && ms.length) { const m = pick(ms); setTimeout(function(){ try { say(m.name, m.icon, pick(CHEER), 'c'); refresh(); } catch (e) {} }, 1200 + Math.random() * 1500); }
  }
  const oldAdd = window.addRenown;
  if (typeof oldAdd === 'function') {
    window.addRenown = function(k, times){
      const amt = oldAdd.apply(this, arguments);
      try {
        if (amt > 0 && sequel()) {
          weekCheck(); chat().week.pts += amt; checkTitle();
          if (k === 'titan_kill') react(k, '🌊 The Tide Titan has fallen! The whole Hall cheers.', true);
          else if (k === 'daily_bonus') react(k, '📅 ' + me() + ' has finished every daily task.', true);
          else if (k === 'sea_alpha') react(k, '🦈 ' + me() + ' brought down an alpha sea monster.', true);
          else if (k === 'optional') react(k, '⚔️ ' + me() + ' cleared an optional boss.', true);
          else if (k === 'hall_chest') react(k, '🎁 A Hall chest was opened.', false);
          else if (k === 'titan_attempt') react(k, null, false);
          refresh();
        }
      } catch (e) {}
      return amt;
    };
  }
  const oldRead = window.markCrimsonHorizonChapterRead;
  if (typeof oldRead === 'function') {
    window.markCrimsonHorizonChapterRead = function(id){
      const was = !!(game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[id]);
      const r = oldRead.apply(this, arguments);
      try {
        if (sequel() && !was && game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[id]) {
          const ch = (window.CRIMSON_HORIZON_CHAPTERS || []).find(function(c){ return c.id === id; });
          if (ch) react('chapter', '📖 The crew finishes “' + ch.title.replace(/^\d+ · /, '') + '”.', false);
        }
      } catch (e) {}
      return r;
    };
  }

  // ---- talking back ----
  function reply(text){
    const ms = members().filter(online);
    if (!ms.length) return;
    const low = text.toLowerCase();
    let m = ms.find(function(x){ return low.indexOf(String(x.name).toLowerCase()) !== -1; }) || pick(ms);
    let line;
    const own = OWN[key(m)];
    if (/\b(hello|hi|hey|morning|evening)\b/.test(low)) line = pick(HELLO);
    else if (/\b(thanks|thank you|cheers)\b/.test(low)) line = pick(THANKS);
    else if (/titan/.test(low)) { const tp = titanPct(); line = tp != null ? 'The Titan is at ' + tp + '%. I’ll be there.' : 'I’ll be at the next Titan run.'; }
    else if (/cheese/.test(low)) line = 'Soel just looked up. Nobody move.';
    else if (/\b(run|lfg|raid|group|party)\b/.test(low)) line = pick(['I’m in.', 'Count me in.', 'Give me five minutes and a sandwich.']);
    else if (/\?$/.test(low.trim())) line = pick(['Good question. Ask Devon.', 'No idea, Captain, but I’ll find out.', 'Depends who you ask.']);
    else line = own && Math.random() < 0.5 ? pick(own) : pick(['Aye, Captain.', 'Heard.', 'Noted.', 'Ha. Fair.']);
    setTimeout(function(){ try { say(m.name, m.icon, line, 'c'); refresh(); } catch (e) {} }, 1300 + Math.random() * 1800);
  }
  window.__ctChatSend = function(){
    const el = document.getElementById('ctChatInput');
    if (!el) return;
    const text = String(el.value || '').trim().slice(0, 200);
    el.value = '';
    if (!text) return;
    if (text.charAt(0) === '/') {
      const sp = text.indexOf(' '), cmd = (sp < 0 ? text : text.slice(0, sp)).toLowerCase(), arg = sp < 0 ? '' : text.slice(sp + 1).trim();
      if (cmd === '/roll') { const max = Math.max(2, Math.min(1000, parseInt(arg, 10) || 100)); sys('🎲 ' + me() + ' rolls ' + (1 + Math.floor(Math.random() * max)) + ' (1-' + max + ').'); }
      else if (cmd === '/who') { const on = members().filter(online).map(function(m){ return m.name; }); sys('👥 Online (' + on.length + '): ' + (on.join(', ') || 'only you') + '.'); }
      else if (cmd === '/me') { say('', '', 'San ' + arg, 'e'); }
      else if (cmd === '/motd') { if (arg) { chat().motd = arg.slice(0, 120); sys('📌 The message of the day was changed.'); } else sys('📌 ' + chat().motd); }
      else sys('Commands: /roll [max], /who, /me <action>, /motd <text>.');
    } else {
      say(me(), '⚓', text, 'p');
      reply(text);
    }
    chat().lastGen = Date.now();
    refresh();
    try { const box = document.getElementById('ctChatLog'); if (box) box.scrollTop = box.scrollHeight; } catch (e) {}
  };
  window.__ctChatMotd = function(){
    const el = document.getElementById('ctMotdInput');
    if (!el) return;
    const v = String(el.value || '').trim().slice(0, 120);
    if (!v) return;
    chat().motd = v; sys('📌 The message of the day was changed.'); refresh();
  };

  // ---- rendering ----
  function clock(t){ const d = new Date(t); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function tabs(){ return ['guildchat', 'guildroll']; }
  function refresh(){ if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub(); }
  function renderChat(){
    const el = document.getElementById('ft-tab-guildchat');
    if (!el) return;
    weekCheck(); catchUp(); checkTitle();
    const c = chat(), on = members().filter(online).length;
    c.lastSeen = Date.now();
    const prevIn = document.getElementById('ctChatInput'), prevVal = prevIn ? prevIn.value : '', prevFocus = !!prevIn && document.activeElement === prevIn;
    const lines = c.lines.slice(-60).map(function(l){
      const tm = '<span style="opacity:.5;font-size:.7rem;">[' + clock(l.t) + ']</span> ';
      if (l.k === 's') return '<div style="color:#e8c547;font-size:.82rem;margin:2px 0;">' + tm + esc2(l.x) + '</div>';
      if (l.k === 'e') return '<div style="color:#d8a8ff;font-size:.82rem;margin:2px 0;font-style:italic;">' + tm + esc2(l.x) + '</div>';
      const me = l.k === 'p';
      return '<div style="font-size:.84rem;margin:2px 0;">' + tm + '<b style="color:' + (me ? '#7fd4ff' : '#f1d7a3') + ';">' + (l.i ? l.i + ' ' : '') + esc2(l.w) + (me ? ' [' + esc2(title()) + ']' : '') + ':</b> ' + esc2(l.x) + '</div>';
    }).join('');
    el.innerHTML = '<div class="panel-title">💬 Guild Chat</div>' +
      '<div class="story-chip" style="margin-bottom:6px;">📌 ' + esc2(c.motd) + '</div>' +
      '<div style="font-size:.78rem;opacity:.75;margin-bottom:4px;">🟢 ' + on + ' online · Guild level ' + guildLevel() + ' · you are a ' + esc2(title()) + '. Type /help for commands.</div>' +
      '<div id="ctChatLog" style="height:300px;overflow-y:auto;background:rgba(0,0,0,.35);border:1px solid rgba(232,197,71,.25);border-radius:8px;padding:8px;">' + (lines || '<div style="opacity:.6;font-size:.82rem;">It is quiet. Someone will be along.</div>') + '</div>' +
      '<div style="display:flex;gap:6px;margin-top:8px;"><input id="ctChatInput" maxlength="200" placeholder="Say something to the Hall…" style="flex:1;padding:8px;border-radius:8px;border:1px solid rgba(232,197,71,.4);background:rgba(0,0,0,.4);color:#f5e6c8;" onkeydown="if(event.key===\'Enter\')__ctChatSend()">' +
      '<button class="btn btn-small btn-success" onclick="__ctChatSend()">Send</button></div>';
    const box = document.getElementById('ctChatLog'); if (box) box.scrollTop = box.scrollHeight;
    const nowIn = document.getElementById('ctChatInput'); if (nowIn && prevVal) { nowIn.value = prevVal; if (prevFocus) nowIn.focus(); }
  }
  function renderRoll(){
    const el = document.getElementById('ft-tab-guildroll');
    if (!el) return;
    weekCheck(); checkTitle();
    const c = chat(), gl = guildLevel(), r = renown(), lo = levelFloor(gl), hi = levelFloor(gl + 1);
    const pct = gl >= 30 ? 100 : Math.max(0, Math.min(100, Math.round((r - lo) / Math.max(1, hi - lo) * 100)));
    const wk = weekKey(), rows = board(wk, weekFraction());
    const ms = members();
    const nextT = TITLES.find(function(x){ return x[0] > r; });
    let html = '<div class="panel-title">🏅 Guild Roll</div>' +
      '<article class="quest-item" style="border-left-color:var(--gold);"><strong>🏛️ Fair Tide Guild · level ' + gl + '</strong> <span class="story-chip">' + esc2(title()) + '</span><br>' +
      '<div style="height:8px;background:rgba(0,0,0,.5);border-radius:6px;overflow:hidden;margin:6px 0;"><div style="height:100%;width:' + pct + '%;background:#e8c547;"></div></div>' +
      '<span style="font-size:.78rem;opacity:.8;">' + (gl >= 30 ? 'Top level.' : fmt(r) + ' / ' + fmt(hi) + ' Renown for level ' + (gl + 1) + '.') + (nextT ? ' Next title, ' + esc2(nextT[1]) + ', at ' + fmt(nextT[0]) + ' Renown.' : '') + '</span></article>' +
      '<div class="panel-title" style="margin-top:12px;font-size:1rem;">📈 This week’s board</div>' +
      '<div style="font-size:.76rem;opacity:.75;margin-bottom:4px;">Your score is the Renown you earn this week. Resets Monday; the top three are paid.</div>';
    rows.slice(0, 10).forEach(function(row, i){
      html += '<div style="display:flex;justify-content:space-between;padding:4px 8px;border-radius:6px;' + (row.me ? 'background:rgba(232,197,71,.18);font-weight:bold;' : '') + '"><span>' + (['🥇', '🥈', '🥉'][i] || (i + 1) + '.') + ' ' + row.icon + ' ' + esc2(row.name) + '</span><span>' + fmt(row.pts) + '</span></div>';
    });
    const myPos = rows.findIndex(function(x){ return x.me; });
    if (myPos >= 10) html += '<div style="padding:4px 8px;opacity:.85;">… #' + (myPos + 1) + ' You (' + me() + '): ' + fmt(rows[myPos].pts) + '</div>';
    html += '<div class="panel-title" style="margin-top:12px;font-size:1rem;">👥 Roster</div>';
    const rr = ms.map(function(m){ return { m: m, rk: rank(m), on: online(m) }; }).sort(function(a, b){ return (b.on - a.on) || a.m.name.localeCompare(b.m.name); });
    html += '<div style="padding:4px 8px;"><b>👑 San</b> <span class="story-chip">Guildmaster</span> 🟢</div>';
    rr.forEach(function(x){ html += '<div style="padding:4px 8px;display:flex;justify-content:space-between;"><span>' + x.m.icon + ' ' + esc2(x.m.name) + ' <span class="story-chip">' + x.rk.i + ' ' + x.rk.n + '</span></span><span>' + (x.on ? '🟢' : '⚫') + '</span></div>'; });
    if (!rr.length) html += '<div class="story-chip">No members yet. Residents and roster members appear here.</div>';
    html += '<div class="panel-title" style="margin-top:12px;font-size:1rem;">📌 Message of the day</div><div style="display:flex;gap:6px;"><input id="ctMotdInput" maxlength="120" value="' + esc2(c.motd) + '" style="flex:1;padding:8px;border-radius:8px;border:1px solid rgba(232,197,71,.4);background:rgba(0,0,0,.4);color:#f5e6c8;"><button class="btn btn-small" onclick="__ctChatMotd()">Set</button></div>';
    el.innerHTML = html;
  }

  const oldHub = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings', show = sequel();
    tabs().forEach(function(k){
      const el = document.getElementById('ft-tab-' + k), btn = document.getElementById('ft-tab-btn-' + k);
      if (el) el.classList.toggle('active', tab === k);
      if (btn) { btn.classList.toggle('active', tab === k); btn.style.display = show ? '' : 'none'; }
    });
    if (oldHub) oldHub.apply(this, arguments);
    if (show) {
      try {
        const c = chat(), btn = document.getElementById('ft-tab-btn-guildchat');
        const unread = tab === 'guildchat' ? 0 : c.lines.filter(function(l){ return l.t > c.lastSeen && l.k !== 'p'; }).length;
        if (btn) btn.textContent = '💬 Guild Chat' + (unread ? ' (' + Math.min(unread, 99) + ')' : '');
      } catch (e) {}
      if (tab === 'guildchat') renderChat();
      if (tab === 'guildroll') renderRoll();
    }
  };
  // the chat keeps going while you play
  setInterval(function(){
    try {
      if (typeof gameSessionActive === 'undefined' || !gameSessionActive || !sequel()) return;
      if (Math.random() < 0.5) {
        gen();
        const c = chat(); c.lastGen = Date.now();
        if ((game.fairTideActiveTab || '') === 'guildchat' && document.getElementById('ft-tab-guildchat') && document.getElementById('ft-tab-guildchat').classList.contains('active')) {
          const input = document.getElementById('ctChatInput');
          if (!input || input.value === '') renderChat();
        } else refresh();
      }
    } catch (e) {}
  }, 40 * 1000);
  // for scripts/guild-group.js (group finder, dungeon, raid)
  window.guildChat = { sys: sys, say: say, members: members, online: online, key: key, weekKey: weekKey, me: me, refresh: function(){ try { refresh(); } catch (e) {} } };
})();
