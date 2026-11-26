(function(){
  // -------------------------------------------------------------------
  // GUILD PERKS (sequel only):
  //   Weekly Rivalry   Fair Tide Guild vs The Gilded Anchor, shown on the Guild Roll tab. Your week's Renown plus the Hall's members against a rival that
  //                    tracks how hard you played the last three weeks. The week is settled on Monday: win or lose, a letter arrives.
  //   Mailbox          letters from the Hall with small attachments (gold, resources, pets). Rivalry results, milestones and the odd letter from a member.
  //   Titles           collectible titles earned from the game's own content. Wear one and it shows in Guild Chat in place of your Renown title.
  //   Cosmetics        name colours and chat badges, unlocked by Guild level or by titles.
  //   Pets             collectible Hall mascots. One follows you in Guild Chat, and a daily pat gives a little Fair Tide Mood.
  // State: game.guildPerks. All numbers and names (the rival and its leader included) are placeholders to tune.
  // -------------------------------------------------------------------
  const G = window.guildChat;
  if (!G) return;
  const RIVAL = { name: 'The Gilded Anchor', leader: 'Marrow Vane', icon: '⚓' };

  function sequel(){ return !!(game && game.arc42Complete); }
  function P(){
    const p = game.guildPerks = game.guildPerks || {};
    p.titles = p.titles || {}; p.colors = p.colors || {}; p.badges = p.badges || {}; p.pets = p.pets || {}; p.mail = p.mail || []; p.seen = p.seen || {};
    p.rival = p.rival || { wins: 0, losses: 0, streak: 0, history: [], last: null };
    if (p.color == null) p.color = 'default'; if (p.badge == null) p.badge = 'anchor';
    return p;
  }
  function save(){ try { if (typeof saveGameQuiet === 'function') saveGameQuiet(); } catch (e) {} }
  function refresh(){ try { if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub(); } catch (e) {} }
  function esc2(s){ return typeof esc === 'function' ? esc(s) : String(s); }
  function pick(a){ return a[Math.floor(Math.random() * a.length)]; }
  function hash(s){ let n = 0; for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) | 0; return Math.abs(n); }
  function lvl(){ try { return typeof level === 'function' ? level() : 1; } catch (e) { return 1; } }
  function dayKey(){ const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function gg(){ return game.guildGroup || { stats: { dungeons: 0, raids: 0, won: 0, lost: 0, passed: 0 } }; }
  function opt(k){ return game.crimsonHorizonOptional && game.crimsonHorizonOptional[k]; }
  function bld(k){ return (game.fairTideBuildings && game.fairTideBuildings[k]) || 0; }

  // ---- titles, colours, badges, pets ----
  const TITLES = [
    { id: 'vault_delver', name: 'Vault Delver', how: 'Clear the Drowned Vault 3 times', ok: function(){ return gg().stats.dungeons >= 3; }, prog: function(){ return gg().stats.dungeons + '/3'; } },
    { id: 'court_breaker', name: 'Court-Breaker', how: 'Clear the Tide Court raid', ok: function(){ return gg().stats.raids >= 1; }, prog: function(){ return gg().stats.raids + '/1'; } },
    { id: 'lucky_roller', name: 'Lucky Roller', how: 'Win 10 loot rolls', ok: function(){ return gg().stats.won >= 10; }, prog: function(){ return gg().stats.won + '/10'; } },
    { id: 'honest_weight', name: 'Honest Weight', how: 'Finish Hedda Penny-Eye\'s encounter', ok: function(){ return !!opt('opt_hedda'); } },
    { id: 'asked_the_question', name: 'Asked the Question', how: 'End the Keeping with the right question', ok: function(){ return opt('opt_keeping') === 'peaceful'; } },
    { id: 'chain_bearer', name: 'Chain-Bearer', how: 'Take the Keeping by force', ok: function(){ return opt('opt_keeping') === true; } },
    { id: 'lamplighter', name: 'Lamplighter', how: 'Light a lamp for the crew, Fair Tide and a stranger', ok: function(){ const l = game.lanternKeeper && game.lanternKeeper.lit; return !!(l && l.crew && l.fairtide && l.stranger); } },
    { id: 'stonecutter', name: 'Stonecutter', how: 'Raise the Quarry to level 5', ok: function(){ return bld('quarry') >= 5; }, prog: function(){ return bld('quarry') + '/5'; } },
    { id: 'nalas_friend', name: 'Nala\'s Friend', how: 'Raise Nala\'s Tower to level 3', ok: function(){ return bld('nala_tower') >= 3; }, prog: function(){ return bld('nala_tower') + '/3'; } },
    { id: 'rival_breaker', name: 'Rival-Breaker', how: 'Win a weekly Rivalry', ok: function(){ return P().rival.wins >= 1; }, prog: function(){ return P().rival.wins + '/1'; } },
    { id: 'anchor_slayer', name: 'Anchor-Slayer', how: 'Win 5 weekly Rivalries', ok: function(){ return P().rival.wins >= 5; }, prog: function(){ return P().rival.wins + '/5'; } },
    { id: 'night_owl', name: 'Night Owl', how: 'Open 4 Event Night chests', ok: function(){ return (P().seen.eventChests || 0) >= 4; }, prog: function(){ return (P().seen.eventChests || 0) + '/4'; } }
  ];
  const COLORS = [
    { id: 'default', name: 'Sea Blue', c: '#7fd4ff', need: function(){ return true; }, how: '' },
    { id: 'amber', name: 'Amber', c: '#e8c547', need: function(){ return G.level() >= 5; }, how: 'Guild level 5' },
    { id: 'rose', name: 'Rose', c: '#ff9bb3', need: function(){ return G.level() >= 8; }, how: 'Guild level 8' },
    { id: 'mint', name: 'Mint', c: '#8fe3b0', need: function(){ return G.level() >= 10; }, how: 'Guild level 10' },
    { id: 'violet', name: 'Violet', c: '#d8a8ff', need: function(){ return G.level() >= 15; }, how: 'Guild level 15' },
    { id: 'crimson', name: 'Crimson', c: '#ff6b6b', need: function(){ return !!P().titles.court_breaker; }, how: 'Title: Court-Breaker' },
    { id: 'glass', name: 'Sea-Glass', c: '#7ff0e0', need: function(){ return !!P().titles.lamplighter; }, how: 'Title: Lamplighter' }
  ];
  const BADGES = [
    { id: 'anchor', i: '⚓', name: 'Anchor', need: function(){ return true; }, how: '' },
    { id: 'swords', i: '⚔️', name: 'Crossed Swords', need: function(){ return G.level() >= 3; }, how: 'Guild level 3' },
    { id: 'lantern', i: '🏮', name: 'Lantern', need: function(){ return !!P().titles.lamplighter; }, how: 'Title: Lamplighter' },
    { id: 'trident', i: '🔱', name: 'Trident', need: function(){ return !!P().titles.court_breaker; }, how: 'Title: Court-Breaker' },
    { id: 'pick', i: '⛏️', name: 'Pickaxe', need: function(){ return !!P().titles.stonecutter; }, how: 'Title: Stonecutter' },
    { id: 'cat', i: '🐈', name: 'Cat', need: function(){ return !!P().titles.nalas_friend; }, how: 'Title: Nala\'s Friend' },
    { id: 'dice', i: '🎲', name: 'Dice', need: function(){ return !!P().titles.lucky_roller; }, how: 'Title: Lucky Roller' }
  ];
  const PETS = [
    { id: 'hall_gull', i: '🐦', name: 'Hall Gull', how: 'A welcome gift from the Hall', lines: ['*steals a crust off the table*', '*screams at a pigeon*', '*stands on the sign, looking important*'] },
    { id: 'ink_crab', i: '🦀', name: 'Ink Crab', how: 'Clear the Drowned Vault (a chance each time, sure on the 5th)', lines: ['*writes a very small letter in the sand*', '*clicks disapprovingly at the ledger*'] },
    { id: 'harbor_seal', i: '🦭', name: 'Harbor Seal Pup', how: 'Win a weekly Rivalry (a chance, sure on the 3rd)', lines: ['*flops onto the jetty*', '*barks at a rope*'] },
    { id: 'lantern_moth', i: '🦋', name: 'Lantern Moth', how: 'Light all three lamps for the Lantern-Keeper', lines: ['*circles the nearest lamp*', '*lands on somebody\'s hat*'] },
    { id: 'court_eel', i: '🐍', name: 'Court Eel', how: 'Clear the Tide Court raid', lines: ['*coils around a chair leg*', '*stares at the Titan, unafraid*'] },
    { id: 'tide_whelk', i: '🐋', name: 'Tidelet', how: 'Fell the Tide Titan', lines: ['*spouts quietly into a bucket*', '*sings one long note*'] }
  ];
  function byId(list, id){ return list.find(function(x){ return x.id === id; }); }

  window.guildPerkTitle = function(){ try { const p = P(); const t = p.title && p.titles[p.title] ? byId(TITLES, p.title) : null; return t ? t.name : null; } catch (e) { return null; } };
  window.guildNameColor = function(){ try { const c = byId(COLORS, P().color); return c ? c.c : '#7fd4ff'; } catch (e) { return '#7fd4ff'; } };
  window.guildBadge = function(){ try { const b = byId(BADGES, P().badge); return b ? b.i : '⚓'; } catch (e) { return '⚓'; } };

  // ---- mailbox ----
  function send(m){
    const p = P();
    p.mail.unshift({ id: Date.now() + Math.floor(Math.random() * 1000), t: Date.now(), from: m.from, icon: m.icon || '✉️', subject: m.subject, text: m.text, attach: m.attach || null, read: false, claimed: !m.attach });
    if (p.mail.length > 30) p.mail.length = 30;
    save();
  }
  window.guildMailSend = send;
  function attachText(a){
    if (!a) return '';
    const bits = [];
    if (a.gold) bits.push(a.gold.toLocaleString() + 'g');
    if (a.res) Object.keys(a.res).forEach(function(k){ bits.push(a.res[k] + ' ' + k); });
    if (a.pet) { const pet = byId(PETS, a.pet); bits.push((pet ? pet.i + ' ' + pet.name : 'a pet')); }
    if (a.fund) bits.push(a.fund + ' Hall fund');
    return bits.join(', ');
  }
  function claim(a){
    const p = P();
    if (a.gold) game.gold = (game.gold || 0) + a.gold;
    if (a.res) { const r = game.fairTideResources = game.fairTideResources || {}; Object.keys(a.res).forEach(function(k){ r[k] = (r[k] || 0) + a.res[k]; }); }
    if (a.fund && typeof window.guildHallAdd === 'function') window.guildHallAdd(a.fund);
    if (a.pet) { if (p.pets[a.pet]) game.gold = (game.gold || 0) + 200; else { p.pets[a.pet] = true; if (!p.petActive) p.petActive = a.pet; } }
  }
  window.guildMailClaim = function(id){
    const p = P(), m = p.mail.find(function(x){ return x.id === id; }); if (!m) return;
    m.read = true;
    if (m.attach && !m.claimed) { claim(m.attach); m.claimed = true; try { if (typeof updateUI === 'function') updateUI(); } catch (e) {} }
    save(); refresh();
  };
  window.guildMailOpen = function(id){ const m = P().mail.find(function(x){ return x.id === id; }); if (m) { m.read = true; save(); refresh(); } };
  window.guildMailDelete = function(id){ const p = P(); const m = p.mail.find(function(x){ return x.id === id; }); if (m && m.attach && !m.claimed) claim(m.attach); p.mail = p.mail.filter(function(x){ return x.id !== id; }); save(); refresh(); };
  window.guildMailClaimAll = function(){ const p = P(); p.mail.forEach(function(m){ m.read = true; if (m.attach && !m.claimed) { claim(m.attach); m.claimed = true; } }); try { if (typeof updateUI === 'function') updateUI(); } catch (e) {} save(); refresh(); };
  function unread(){ return P().mail.filter(function(m){ return !m.read || (m.attach && !m.claimed); }).length; }
  const LETTERS = [
    function(n){ return { subject: 'Left something at the Hall', text: 'I left a parcel at the Hall for you. It is not much. Do not make a fuss. ' + n }; },
    function(n){ return { subject: 'For the long watches', text: 'You looked tired in the chat. Here is something for the road. ' + n }; },
    function(n){ return { subject: 'A small thank-you', text: 'The Hall is warmer than it was, and some of that is you. ' + n }; }
  ];

  // ---- weekly rivalry ----
  function yourTotal(pts, n){ return pts + Math.round(n * 18); }
  function rivalTarget(wk){
    const r = P().rival, h = r.history.slice(-3);
    const base = h.length ? h.reduce(function(a, b){ return a + b; }, 0) / h.length : 400;
    return Math.max(250, Math.round(base * (0.9 + (hash(wk) % 31) / 100)));
  }
  function rivalNow(wk, f){ return Math.round(rivalTarget(wk) * Math.pow(Math.max(0.05, f), 0.9)); }
  function mineNow(){ return yourTotal(G.weekPts(), G.members().length * G.fraction()); }
  function resolve(snap){
    const r = P().rival, mine = yourTotal(snap.pts, snap.n), theirs = rivalTarget(snap.week);
    const win = mine >= theirs;
    r.history.push(mine); if (r.history.length > 8) r.history.shift();
    if (win) { r.wins++; r.streak = Math.max(0, r.streak) + 1; } else { r.losses++; r.streak = 0; }
    r.last = { week: snap.week, mine: mine, theirs: theirs, win: win };
    const L = lvl();
    if (win) {
      const pet = (r.wins === 3 || Math.random() < 0.3) ? 'harbor_seal' : null;
      send({ from: RIVAL.leader + ', ' + RIVAL.name, icon: RIVAL.icon, subject: 'Well sailed', text: 'You edged us out this week, ' + mine.toLocaleString() + ' to ' + theirs.toLocaleString() + '. I will say it once: well sailed. Next week the Anchor does not lose. The Hall owes you its winnings.', attach: { gold: L * 150, fund: 500, pet: pet } });
      G.sys('🏆 Rivalry settled: Fair Tide beat ' + RIVAL.name + ', ' + mine.toLocaleString() + ' to ' + theirs.toLocaleString() + '.');
    } else {
      send({ from: RIVAL.leader + ', ' + RIVAL.name, icon: RIVAL.icon, subject: 'A close one', text: 'The Anchor took the week, ' + theirs.toLocaleString() + ' to ' + mine.toLocaleString() + '. Do not take it hard. The Hall sends a little for your trouble. Come back swinging.', attach: { gold: L * 40 } });
      G.sys('🏴 Rivalry settled: ' + RIVAL.name + ' took the week, ' + theirs.toLocaleString() + ' to ' + mine.toLocaleString() + '.');
    }
    save();
  }
  function tickRival(){
    const r = P().rival, wk = G.weekKey();
    if (r.snap && r.snap.week !== wk) resolve(r.snap);
    r.snap = { week: wk, pts: G.weekPts(), n: G.members().length };
  }
  const BANTER = {
    lead: ['Your Hall is ahead. Enjoy it. It will not last.', 'Fair Tide, ahead? The Anchor is only resting.', 'Do not get comfortable.'],
    trail: ['The Anchor is ahead this week, in case anyone was counting. I was.', 'Fair Tide looks tired. Not that I am gloating.', 'Is that all? We have only just started.'],
    even: ['Neck and neck. I like it.', 'Close this week. Do not blink.']
  };
  function banter(){
    if (Math.random() > 0.2) return;
    const wk = G.weekKey(), f = G.fraction(), mine = mineNow(), theirs = rivalNow(wk, f);
    const k = mine > theirs * 1.1 ? 'lead' : (mine < theirs * 0.9 ? 'trail' : 'even');
    G.say(RIVAL.leader + ' (' + RIVAL.name + ')', RIVAL.icon, pick(BANTER[k]), 'c');
  }
  function rivalHtml(){
    const r = P().rival, wk = G.weekKey(), f = G.fraction(), mine = mineNow(), theirs = rivalNow(wk, f), target = rivalTarget(wk), top = Math.max(mine, target, 1);
    const bar = function(v, c){ return '<div style="height:8px;background:rgba(0,0,0,.5);border-radius:6px;overflow:hidden;margin:3px 0 6px;"><div style="height:100%;width:' + Math.min(100, Math.round(v / top * 100)) + '%;background:' + c + ';"></div></div>'; };
    return '<div class="panel-title" style="margin-top:12px;font-size:1rem;">🏴 Weekly Rivalry</div>' +
      '<article class="quest-item" style="border-left-color:' + (mine >= theirs ? 'var(--success)' : 'var(--danger)') + ';">' +
      '<div style="font-size:.78rem;opacity:.8;">Fair Tide Guild vs ' + esc2(RIVAL.name) + ' (' + esc2(RIVAL.leader) + '). Your Renown this week plus the Hall\'s members. Settled on Monday.</div>' +
      '<div style="margin-top:6px;">⚓ <b>Fair Tide</b>: ' + mine.toLocaleString() + '</div>' + bar(mine, '#e8c547') +
      '<div>' + RIVAL.icon + ' <b>' + esc2(RIVAL.name) + '</b>: ' + theirs.toLocaleString() + '</div>' + bar(theirs, '#c0504d') +
      '<div style="font-size:.76rem;opacity:.8;">Record: ' + r.wins + ' won, ' + r.losses + ' lost' + (r.streak > 1 ? ' · ' + r.streak + ' in a row' : '') + (r.last ? ' · last week: ' + (r.last.win ? 'won' : 'lost') + ' ' + r.last.mine.toLocaleString() + ' to ' + r.last.theirs.toLocaleString() : '') + '</div></article>';
  }

  // ---- earned things, milestones ----
  function checkProgress(){
    const p = P(), s = p.seen;
    TITLES.forEach(function(t){
      if (!p.titles[t.id] && t.ok()) {
        p.titles[t.id] = true;
        G.sys('🎖️ ' + G.me() + ' has earned the title “' + t.name + '”.');
        send({ from: 'The Hall', icon: '🎖️', subject: 'New title: ' + t.name, text: 'You have earned the title “' + t.name + '”. You can wear it from the Perks tab.' });
      }
    });
    const stt = gg().stats || {};
    const add = function(k, from, icon, subject, text, attach){ if (!s[k]) { s[k] = true; send({ from: from, icon: icon, subject: subject, text: text, attach: attach }); } };
    if (stt.dungeons >= 1) add('firstVault', 'Aisyah', '🗡️', 'You cleared the Vault', 'I heard. The ledger says you cleared it. I want a cut, naturally. A small one. Here is yours.', { gold: lvl() * 60 });
    if (stt.raids >= 1) add('firstCourt', 'Jade', '👑', 'The Tide Court', 'The Court has stood a long time. It does not stand tonight. Well done, all of you.', { gold: lvl() * 150, pet: 'court_eel' });
    if (stt.dungeons >= 5 && !p.pets.ink_crab) { s.crab = true; send({ from: 'The Hall', icon: '🦀', subject: 'A visitor from the Vault', text: 'A small crab has followed the crew home from the Drowned Vault. It seems to like you.', attach: { pet: 'ink_crab' } }); }
    else if (stt.dungeons > (s.dungeonsSeen || 0) && !p.pets.ink_crab && Math.random() < 0.2) send({ from: 'The Hall', icon: '🦀', subject: 'A visitor from the Vault', text: 'A small crab has followed the crew home from the Drowned Vault.', attach: { pet: 'ink_crab' } });
    s.dungeonsSeen = stt.dungeons || 0;
    const l = game.lanternKeeper && game.lanternKeeper.lit;
    if (l && l.crew && l.fairtide && l.stranger) add('moth', 'The Lantern-Keeper', '🏮', 'The lamps remember', 'Three lamps, three people. A moth has found you.', { pet: 'lantern_moth' });
    if (game.titan && (game.titan.kills || 0) >= 1) add('whelk', 'The Hall', '🌊', 'A gift from the water', 'After the Titan fell, something small followed the tide in.', { pet: 'tide_whelk' });
  }
  // the Event Night chest count (for Night Owl) rides on the guild group state
  (function(){
    const old = window.ggClaimEvent;
    if (typeof old === 'function') window.ggClaimEvent = function(){ const g = game.guildGroup || {}, before = g.eventClaimed; const r = old.apply(this, arguments); try { if ((game.guildGroup || {}).eventClaimed !== before) { const s = P().seen; s.eventChests = (s.eventChests || 0) + 1; save(); } } catch (e) {} return r; };
  })();

  // ---- daily mail, welcome, pet ----
  function dailyTick(){
    const p = P(), s = p.seen;
    if (!s.welcome) {
      s.welcome = true;
      send({ from: 'The Hall Secretary', icon: '📬', subject: 'Welcome to the Perks desk', text: 'Letters, titles, colours and a Hall Gull of your own, all kept here. The gull came with the building.', attach: { gold: 500, pet: 'hall_gull' } });
    }
    if (p.mailDay !== dayKey()) {
      p.mailDay = dayKey();
      if (Math.random() < 0.45) {
        const m = pick(G.members().length ? G.members() : [{ name: 'Someone' }]);
        const L = pick(LETTERS)(m.name);
        const pool = [{ res: { stone: 6 + Math.floor(Math.random() * 8) } }, { res: { timber: 6 + Math.floor(Math.random() * 8) } }, { res: { food: 6 + Math.floor(Math.random() * 8) } }, { gold: lvl() * 20 }];
        send({ from: m.name, icon: m.icon || '✉️', subject: L.subject, text: L.text, attach: pick(pool) });
      }
    }
  }
  const PET_FLAVOR_GAP = 5 * 60 * 1000;
  function petTick(){
    const p = P(), pet = p.petActive ? byId(PETS, p.petActive) : null;
    if (!pet || !p.pets[pet.id]) return;
    if (Date.now() - (p.petLast || 0) < PET_FLAVOR_GAP || Math.random() > 0.3) return;
    p.petLast = Date.now(); G.say(pet.name, pet.i, pick(pet.lines), 'e');
  }
  window.guildPetPat = function(){
    const p = P(), pet = p.petActive ? byId(PETS, p.petActive) : null; if (!pet) return;
    if (p.patDay === game.day) { if (typeof toast === 'function') toast(pet.i + ' ' + pet.name + ' has had enough attention for today.'); return; }
    p.patDay = game.day;
    try { if (typeof window.addFairTideMood === 'function') window.addFairTideMood(1); } catch (e) {}
    if (typeof toast === 'function') toast(pet.i + ' ' + pet.name + ' is delighted. (+1 Fair Tide Mood)', 3000);
    save(); refresh();
  };
  window.guildPerkWear = function(kind, id){
    const p = P();
    if (kind === 'title') p.title = (p.title === id ? null : id);
    if (kind === 'color' && byId(COLORS, id).need()) p.color = id;
    if (kind === 'badge' && byId(BADGES, id).need()) p.badge = id;
    if (kind === 'pet' && p.pets[id]) p.petActive = id;
    save(); refresh();
  };

  // ---- the Perks tab ----
  function perksHtml(){
    const p = P(), mail = p.mail;
    let h = '<div class="panel-title">🎁 Guild Perks</div>';
    h += '<div class="panel-title" style="font-size:1rem;">📬 Mailbox' + (unread() ? ' (' + unread() + ')' : '') + '</div>';
    if (mail.length) {
      h += '<div style="margin-bottom:6px;"><button class="btn btn-small btn-magic" onclick="guildMailClaimAll()">Collect all</button></div>';
      h += mail.slice(0, 12).map(function(m){
        const open = !m.read;
        return '<article class="quest-item" style="' + (open ? 'border-left-color:var(--gold);' : 'opacity:.9;') + '"><strong>' + m.icon + ' ' + esc2(m.subject) + '</strong> <span style="opacity:.7;font-size:.76rem;">from ' + esc2(m.from) + '</span><br>' +
          '<span style="font-size:.82rem;">' + esc2(m.text) + '</span>' +
          (m.attach ? '<br><span style="font-size:.78rem;">📎 ' + esc2(attachText(m.attach)) + (m.claimed ? ' <span style="opacity:.6;">(collected)</span>' : '') + '</span>' : '') +
          '<div style="margin-top:4px;display:flex;gap:6px;">' + (m.attach && !m.claimed ? '<button class="btn btn-small btn-success" onclick="guildMailClaim(' + m.id + ')">Collect</button>' : (!m.read ? '<button class="btn btn-small" onclick="guildMailOpen(' + m.id + ')">Mark read</button>' : '')) +
          '<button class="btn btn-small" onclick="guildMailDelete(' + m.id + ')">Delete</button></div></article>';
      }).join('');
    } else h += '<div style="font-size:.82rem;opacity:.7;">No letters.</div>';

    const wornT = p.title && p.titles[p.title] ? p.title : null;
    h += '<div class="panel-title" style="font-size:1rem;margin-top:12px;">🎖️ Titles</div><div style="font-size:.76rem;opacity:.75;margin-bottom:4px;">Wear one and it shows in Guild Chat in place of your Renown title (' + esc2(G.title()) + ').</div>';
    h += TITLES.map(function(t){
      const got = !!p.titles[t.id];
      return '<div style="padding:4px 8px;display:flex;justify-content:space-between;align-items:center;gap:8px;' + (got ? '' : 'opacity:.55;') + '"><span>' + (got ? '🎖️' : '🔒') + ' <b>' + esc2(t.name) + '</b><br><span style="font-size:.72rem;opacity:.8;">' + esc2(t.how) + (!got && t.prog ? ' (' + esc2(t.prog()) + ')' : '') + '</span></span>' +
        (got ? '<button class="btn btn-small ' + (wornT === t.id ? 'btn-success' : '') + '" onclick="guildPerkWear(\'title\',\'' + t.id + '\')">' + (wornT === t.id ? 'Worn' : 'Wear') + '</button>' : '') + '</div>';
    }).join('');

    h += '<div class="panel-title" style="font-size:1rem;margin-top:12px;">🎨 Name colour and badge</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px;">' +
      COLORS.map(function(c){ const ok = c.need(); return '<button class="btn btn-small ' + (p.color === c.id ? 'btn-success' : '') + '" ' + (ok ? '' : 'disabled') + ' onclick="guildPerkWear(\'color\',\'' + c.id + '\')" title="' + esc2(c.how) + '"><span style="color:' + c.c + ';">●</span> ' + esc2(c.name) + (ok ? '' : ' 🔒') + '</button>'; }).join('') + '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px;">' +
      BADGES.map(function(b){ const ok = b.need(); return '<button class="btn btn-small ' + (p.badge === b.id ? 'btn-success' : '') + '" ' + (ok ? '' : 'disabled') + ' onclick="guildPerkWear(\'badge\',\'' + b.id + '\')" title="' + esc2(b.how) + '">' + b.i + ' ' + esc2(b.name) + (ok ? '' : ' 🔒') + '</button>'; }).join('') + '</div>' +
      '<div style="font-size:.74rem;opacity:.7;margin-top:4px;">Preview: <b style="color:' + window.guildNameColor() + ';">' + window.guildBadge() + ' ' + esc2(G.me()) + ' [' + esc2(window.guildPerkTitle() || G.title()) + ']</b></div>';

    h += '<div class="panel-title" style="font-size:1rem;margin-top:12px;">🐾 Pets</div>' +
      PETS.map(function(pet){
        const got = !!p.pets[pet.id];
        return '<div style="padding:4px 8px;display:flex;justify-content:space-between;align-items:center;gap:8px;' + (got ? '' : 'opacity:.5;') + '"><span>' + (got ? pet.i : '❔') + ' <b>' + (got ? esc2(pet.name) : '???') + '</b><br><span style="font-size:.72rem;opacity:.8;">' + esc2(pet.how) + '</span></span>' +
          (got ? '<button class="btn btn-small ' + (p.petActive === pet.id ? 'btn-success' : '') + '" onclick="guildPerkWear(\'pet\',\'' + pet.id + '\')">' + (p.petActive === pet.id ? 'With you' : 'Choose') + '</button>' : '') + '</div>';
      }).join('') +
      (p.petActive && p.pets[p.petActive] ? '<div style="margin-top:6px;"><button class="btn btn-small btn-magic" onclick="guildPetPat()"' + (p.patDay === game.day ? ' disabled' : '') + '>' + byId(PETS, p.petActive).i + ' ' + (p.patDay === game.day ? 'Patted today' : 'Pat ' + esc2(byId(PETS, p.petActive).name)) + '</button> <span style="font-size:.72rem;opacity:.7;">+1 Fair Tide Mood, once a day</span></div>' : '');
    return h;
  }
  const oldHub = window.renderFairTideHub;
  window.renderFairTideHub = function(){
    const tab = game.fairTideActiveTab || 'buildings', show = sequel();
    const el = document.getElementById('ft-tab-guildperks'), btn = document.getElementById('ft-tab-btn-guildperks');
    if (el) el.classList.toggle('active', tab === 'guildperks');
    if (btn) { btn.classList.toggle('active', tab === 'guildperks'); btn.style.display = show ? '' : 'none'; }
    if (oldHub) oldHub.apply(this, arguments);
    if (!show) return;
    try {
      dailyTick(); checkProgress(); tickRival();
      if (btn) btn.textContent = '🎁 Perks' + (unread() ? ' (' + Math.min(unread(), 99) + ')' : '');
      if (tab === 'guildperks' && el) el.innerHTML = perksHtml();
      if (tab === 'guildroll') { const roll = document.getElementById('ft-tab-guildroll'); if (roll) { const old = document.getElementById('guildRivalryCard'); if (old) old.remove(); roll.insertAdjacentHTML('beforeend', '<div id="guildRivalryCard">' + rivalHtml() + '</div>'); } }
    } catch (e) { console.error('guild perks', e); }
  };
  // keep ticking while you play: rivalry snapshot, progress, pet flavour, rival banter
  setInterval(function(){
    try {
      if (typeof gameSessionActive === 'undefined' || !gameSessionActive || !sequel()) return;
      dailyTick(); checkProgress(); tickRival(); petTick(); banter();
      const btn = document.getElementById('ft-tab-btn-guildperks'); if (btn) btn.textContent = '🎁 Perks' + (unread() ? ' (' + Math.min(unread(), 99) + ')' : '');
    } catch (e) {}
  }, 60 * 1000);
})();
