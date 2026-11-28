/* Daybreak: Crimson Tide, Animated Series. A standalone, private player that is independent of the game and Story Mode.
 * One generic player serves every episode: an episode is only data in series/registry.json (ordered clips, durations, status).
 * Video files live in private storage (config.storage.baseUrl), never in this code. See series/README.md. */
(function(){
  'use strict';
  const LS = { key: 'ct_series_key', local: 'ct_series_local_hash', progress: 'ct_series_progress', vol: 'ct_series_volume', dur: 'ct_series_durations' };
  const app = document.getElementById('srApp');
  const lockBtn = document.getElementById('srLock');
  let config = null, registry = null, player = null;

  // ---------- helpers ----------
  function lsGet(k, d){ try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(t){ t = Math.max(0, Math.floor(t || 0)); const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0'); }
  function pad3(n){ return String(n).padStart(3, '0'); }
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  function sha256(str){
    if (window.crypto && crypto.subtle && window.isSecureContext) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function(b){ return Array.from(new Uint8Array(b)).map(function(x){ return x.toString(16).padStart(2, '0'); }).join(''); });
    }
    return Promise.resolve(sha256sync(str));
  }
  function sha256sync(ascii){   // small fallback for non-secure contexts
    function rr(v, a){ return (v >>> a) | (v << (32 - a)); }
    const K = [], H = []; let pc = 0; const isC = {};
    for (let c = 2; pc < 64; c++) if (!isC[c]) { for (let i = 0; i < 313; i += c) isC[i] = c; H[pc] = (Math.pow(c, .5) * 4294967296) | 0; K[pc++] = (Math.pow(c, 1 / 3) * 4294967296) | 0; }
    ascii = unescape(encodeURIComponent(ascii)); const words = [], len = ascii.length * 8;
    ascii += '\x80'; while (ascii.length % 64 - 56) ascii += '\x00';
    for (let i = 0; i < ascii.length; i++) words[i >> 2] |= ascii.charCodeAt(i) << ((3 - i) % 4) * 8;
    words[words.length] = (len / 4294967296) | 0; words[words.length] = len;
    for (let j = 0; j < words.length;) {
      const w = words.slice(j, j += 16), old = H.slice(0, 8), h = H.slice(0, 8);
      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2], a = h[0], e = h[4];
        const t1 = h[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & h[5]) ^ (~e & h[6])) + K[i] + (w[i] = i < 16 ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
        const t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & h[1]) ^ (a & h[2]) ^ (h[1] & h[2]));
        h.unshift((t1 + t2) | 0); h[4] = (h[4] + t1) | 0; h.length = 8;
      }
      for (let i = 0; i < 8; i++) H[i] = (H[i] + h[i]) | 0; void old;
    }
    let out = ''; for (let i = 0; i < 8; i++) for (let j = 3; j + 1; j--) { const b = (H[i] >> (j * 8)) & 255; out += (b < 16 ? '0' : '') + b.toString(16); }
    return out;
  }

  // ---------- storage URLs (private external storage) ----------
  function storageBase(){
    let b = (config.storage && config.storage.baseUrl) || 'series/media/';
    if (b.indexOf('{key}') >= 0) b = b.replace('{key}', encodeURIComponent(lsGet(LS.key, '')));
    return b.replace(/\/?$/, '/');
  }
  function withAuth(url){
    const a = (config.storage && config.storage.auth) || { type: 'none' };
    if (a.type === 'query' && a.param) { const key = lsGet(LS.key, ''); if (key) url += (url.indexOf('?') < 0 ? '?' : '&') + encodeURIComponent(a.param) + '=' + encodeURIComponent(key); }
    return url;
  }
  // File naming convention: with no explicit src, clip N of episode E lives at naming.pattern
  // (default "ep{ep}/{clip}.mp4" -> ep001/001.mp4), so files can be uploaded straight into the episode folder.
  function conventionPath(epNum, n){
    const pat = (config.naming && config.naming.pattern) || 'ep{ep}/{clip}.mp4';
    return pat.replace('{ep}', String(epNum).padStart(3, '0')).replace('{clip}', String(n).padStart(3, '0'));
  }
  function clipUrl(clip){
    let u = /^https?:\/\//i.test(clip.src) ? clip.src : storageBase() + String(clip.src).replace(/^\//, '');
    const vp = config.storage && config.storage.versionParam;
    if (vp && clip.version != null && clip.version !== '') u += (u.indexOf('?') < 0 ? '?' : '&') + vp + '=' + encodeURIComponent(clip.version);
    return withAuth(u);
  }
  function isMissing(clip){ return !clip || !clip.src || clip.status === 'pending' || clip.status === 'missing' || !!clip._failed; }

  // ---------- access ----------
  async function authorised(){
    const acc = config.access || {};
    if (!acc.required) return true;
    const key = lsGet(LS.key, ''); if (!key) return false;
    const h = await sha256(key);
    if (acc.keyHash) return h === String(acc.keyHash).toLowerCase();
    if (acc.checkUrl) { try { const r = await fetch(withAuth(acc.checkUrl), { cache: 'no-store' }); return r.ok; } catch (e) { return false; } }
    return h === lsGet(LS.local, '');
  }
  function renderGate(msg){
    const acc = config.access || {}, setup = !acc.keyHash && !acc.checkUrl && !lsGet(LS.local, '');
    lockBtn.hidden = true;
    app.innerHTML = '<div class="sr-panel sr-gate"><h1 class="sr-h1">Private series</h1>' +
      '<p class="sr-sub">' + (setup ? 'No owner key is configured yet. Choose a key for this device.' : 'Enter your access key to watch.') + '</p>' +
      '<input id="srKey" type="password" autocomplete="off" placeholder="Access key"><div class="sr-err" id="srErr">' + esc(msg || '') + '</div>' +
      '<button class="sr-btn" id="srGo" type="button">' + (setup ? 'Set key and continue' : 'Unlock') + '</button>' +
      '<p class="sr-small" style="margin-top:14px">This key is stored only on this device. It is also sent to your video storage to authorise each clip, so keep it private. ' +
      'Real protection comes from the storage rejecting requests without a valid key; the page itself only holds the player.</p>' +
      '<details class="sr-small"><summary>Owner: key hash for config.json</summary><p id="srHash">Type a key above to see its SHA-256.</p></details></div>';
    const input = document.getElementById('srKey');
    input.addEventListener('input', function(){ sha256(input.value).then(function(h){ document.getElementById('srHash').innerHTML = input.value ? '<code>' + h + '</code>' : 'Type a key above to see its SHA-256.'; }); });
    const go = async function(){
      const v = input.value.trim(); if (!v) return;
      lsSet(LS.key, v);
      if (setup) lsSet(LS.local, await sha256(v));
      if (await authorised()) start(); else { lsSet(LS.key, ''); document.getElementById('srErr').textContent = 'That key was not accepted.'; }
    };
    document.getElementById('srGo').addEventListener('click', go);
    input.addEventListener('keydown', function(e){ if (e.key === 'Enter') go(); });
    input.focus();
  }
  lockBtn.addEventListener('click', function(){ if (player) player.destroy(); lsSet(LS.key, ''); renderGate(''); });

  // ---------- data ----------
  async function loadJson(url, withKey){
    const r = await fetch(withKey ? withAuth(url) : url, { cache: 'no-store' });
    if (!r.ok) throw new Error(url + ' ' + r.status);
    return r.json();
  }
  async function loadEpisode(ep){
    if (ep.file && !ep.clips) { const full = await loadJson(ep.file, /^https?:/i.test(ep.file)); Object.assign(ep, full); }
    ep.clips = ep.clips || [];
    ep.clips.forEach(function(c, i){ if (!c.src) c.src = conventionPath(ep.number, i + 1); });
    ep.status = ep.status || { production: 'planned', approval: 'pending' };
    return ep;
  }
  function progressOf(n){ return (lsGet(LS.progress, {}))[n] || null; }
  function saveProgress(n, p){ const all = lsGet(LS.progress, {}); all[n] = p; lsSet(LS.progress, all); }
  function durCache(){ return lsGet(LS.dur, {}); }
  function clipDurKey(c){ return c.src + '@' + (c.version == null ? '' : c.version); }
  function knownDuration(c){ return (typeof c.duration === 'number' && c.duration > 0) ? c.duration : (durCache()[clipDurKey(c)] || 0); }
  function epDuration(ep){ let t = 0, all = true; ep.clips.forEach(function(c){ const d = knownDuration(c); if (d) t += d; else all = false; }); return all && ep.clips.length ? t : 0; }
  function badges(ep){
    const p = (ep.status && ep.status.production) || 'planned', a = (ep.status && ep.status.approval) || 'pending';
    const pc = p === 'ready' ? 'ok' : p === 'in_production' ? 'warn' : '', ac = a === 'approved' ? 'ok' : a === 'rejected' ? 'bad' : 'warn';
    return '<span class="sr-badge ' + pc + '">' + esc(p.replace('_', ' ')) + '</span><span class="sr-badge ' + ac + '">' + esc(a) + '</span>';
  }

  // ---------- list view ----------
  function renderList(){
    if (player) { player.destroy(); player = null; }
    lockBtn.hidden = !(config.access && config.access.required);
    const eps = (registry.episodes || []).slice().sort(function(a, b){ return a.number - b.number; });
    app.innerHTML = '<h1 class="sr-h1">' + esc(config.seriesTitle) + '</h1><p class="sr-sub">Animated Series · ' + eps.length + ' episode' + (eps.length === 1 ? '' : 's') + '</p><div class="sr-grid">' +
      eps.map(function(ep){
        const p = progressOf(ep.number), total = epDuration(ep), pct = p && total ? Math.min(100, Math.round(p.t / total * 100)) : (p && p.done ? 100 : 0);
        return '<a class="sr-card" href="#/ep/' + ep.number + '"><div class="sr-thumb" style="' + (ep.thumbnail ? 'background-image:url(' + esc(ep.thumbnail) + ')' : '') + '"><b>EP ' + pad3(ep.number) + '</b><i style="width:' + pct + '%"></i></div>' +
          '<div class="sr-body"><h3>' + esc(ep.title) + '</h3><p>' + esc(ep.description || '') + '</p><div class="sr-badges">' + badges(ep) + (p && p.done ? '<span class="sr-badge ok">watched</span>' : '') + '</div></div></a>';
      }).join('') + '</div>';
  }

  // ---------- episode view ----------
  async function renderEpisode(n){
    const ep = (registry.episodes || []).find(function(e){ return e.number === n; });
    if (!ep) { location.hash = ''; return; }
    app.innerHTML = '<p class="sr-loading">Loading episode…</p>';
    try { await loadEpisode(ep); } catch (e) { app.innerHTML = '<p class="sr-err">Could not load this episode. ' + esc(e.message) + '</p><a class="sr-btn ghost" href="#">All episodes</a>'; return; }
    lockBtn.hidden = !(config.access && config.access.required);
    const chapters = (ep.chapters || []).map(function(c){ return (c.arc === ep.arc ? '' : 'Arc ' + c.arc + ' · ') + 'Chapter ' + c.chapter; }).join(', ');
    app.innerHTML = '<a class="sr-small" href="#">← All episodes</a>' +
      '<h1 class="sr-h1">Episode ' + pad3(ep.number) + ' · ' + esc(ep.title) + '</h1>' +
      '<p class="sr-sub">Arc ' + esc(ep.arc) + (chapters ? ' · ' + esc(chapters) : '') + '</p>' +
      '<div class="sr-stage" id="srStage" tabindex="0"></div>' +
      '<div class="sr-info"><div class="sr-panel"><div class="sr-badges" style="margin:0 0 8px">' + badges(ep) + '</div><p style="margin:0;line-height:1.5">' + esc(ep.description || '') + '</p></div>' +
      '<div class="sr-panel"><b>Clips</b><ul class="sr-cliplist" id="srClips"></ul></div></div>';
    player = new Player(ep, document.getElementById('srStage'), document.getElementById('srClips'));
    player.showPoster();
  }

  // ---------- the player ----------
  function Player(ep, stage, listEl){
    const cfg = Object.assign({ openingSeconds: 4, endingHoldSeconds: 4, missingClipSeconds: 3, preloadSeconds: 8, resumeRewindSeconds: 2, defaultClipSeconds: 10 }, config.player || {});
    const clips = ep.clips, n = clips.length;
    let probed = durCache(), offsets = [], total = 0;
    let active = 0, cur = 0, state = 'idle', playing = false, dragging = false, destroyed = false, virtual = null, idleTimer = null, lastSave = 0, openingTimer = null;
    let slots = [];

    stage.innerHTML =
      '<video playsinline webkit-playsinline preload="auto"></video><video playsinline webkit-playsinline preload="auto"></video>' +
      '<div class="sr-spin"></div>' +
      '<div class="sr-over sr-miss" id="srMiss"></div>' +
      '<div class="sr-over sr-play" id="srPlayOver"><button type="button" aria-label="Play">▶</button></div>' +
      '<div class="sr-over sr-open" id="srOpen"><div class="kick">' + esc(config.seriesTitle) + '</div><div class="num">EPISODE ' + pad3(ep.number) + '</div><div class="ttl">' + esc(ep.title) + '</div><div class="skip">tap to skip</div></div>' +
      '<div class="sr-over sr-end" id="srEnd"><div class="tag">' + esc(config.tagline) + '</div></div>' +
      '<div class="sr-fade"></div>' +
      '<div class="sr-over sr-endpanel" id="srEndPanel"></div>' +
      '<div class="sr-over sr-resume" id="srResume"></div>' +
      '<div class="sr-ctl"><div class="sr-bar"><div class="sr-ticks" id="srTicks"></div><input id="srSeek" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek"></div>' +
      '<div class="sr-row"><button id="srPP" type="button" aria-label="Play or pause">▶</button><button id="srPrev" type="button" aria-label="Previous clip">⏮</button><button id="srNext" type="button" aria-label="Next clip">⏭</button>' +
      '<span class="sr-time" id="srTime">0:00 / 0:00</span><span class="sr-clipname" id="srName"></span>' +
      '<span class="sr-vol"><button id="srMute" type="button" aria-label="Mute">🔊</button><input id="srVol" type="range" min="0" max="100" value="100" aria-label="Volume"></span>' +
      '<button id="srFs" type="button" aria-label="Fullscreen">⛶</button></div></div>';
    const $ = function(id){ return stage.querySelector('#' + id); };
    const vids = stage.querySelectorAll('video');
    const el = { miss: $('srMiss'), playOver: $('srPlayOver'), open: $('srOpen'), end: $('srEnd'), endPanel: $('srEndPanel'), resume: $('srResume'), seek: $('srSeek'), time: $('srTime'), name: $('srName'), pp: $('srPP'), vol: $('srVol'), mute: $('srMute'), fs: $('srFs'), ticks: $('srTicks') };
    slots = [{ v: vids[0], idx: -1, ready: false, err: false, missing: false }, { v: vids[1], idx: -1, ready: false, err: false, missing: false }];

    // durations
    // A clip with no file is skipped silently (no placeholder screen, no time on the bar). Only if no clip at all can play do we say so.
    function allMissing(){ return clips.every(isMissing); }
    function skipClip(i){ return isMissing(clips[i]) && !allMissing(); }
    function nextAvail(i){ for (let j = Math.max(0, i); j < n; j++) if (!skipClip(j)) return j; return -1; }
    function prevAvail(i){ for (let j = i; j >= 0; j--) if (!skipClip(j)) return j; return -1; }
    function dur(i){ if (skipClip(i)) return 0; const c = clips[i]; return knownDuration(c) || probed[clipDurKey(c)] || (isMissing(c) ? cfg.missingClipSeconds : cfg.defaultClipSeconds); }
    function recompute(){ offsets = []; total = 0; for (let i = 0; i < n; i++) { offsets.push(total); total += dur(i); } drawTicks(); }
    function drawTicks(){ el.ticks.innerHTML = offsets.slice(1).map(function(o){ return '<u style="left:' + (o / total * 100) + '%"></u>'; }).join(''); }
    function curTime(){ const s = slots[active]; const t = s && s.idx === cur && !s.missing ? (s.v.currentTime || 0) : (virtual ? virtual.off : 0); return Math.min(dur(cur), t); }
    function globalTime(){ return (offsets[cur] || 0) + curTime(); }
    function locate(t){ t = Math.max(0, Math.min(total - 0.05, t)); let i = 0; while (i < n - 1 && t >= offsets[i + 1]) i++; return { idx: i, off: t - offsets[i] }; }

    // clip list
    function drawList(){
      listEl.innerHTML = clips.map(function(c, i){
        const done = state === 'ended' || i < cur;
        return '<li data-i="' + i + '" class="' + (i === cur ? 'cur ' : '') + (done ? 'done ' : '') + (isMissing(c) ? 'miss' : '') + '"><span class="dot"></span><span>' + String(i + 1).padStart(2, '0') + ' · ' + esc(c.title || 'Clip ' + (i + 1)) + '</span><small>' + (isMissing(c) ? 'not uploaded' : (knownDuration(c) || probed[clipDurKey(c)] ? fmt(dur(i)) : '')) + '</small></li>';
      }).join('');
    }
    listEl.onclick = function(e){ const li = e.target.closest('li'); if (!li) return; jumpTo(Number(li.dataset.i), 0); };

    // slots and preloading
    function prep(slot, idx){
      const clip = clips[idx], v = slot.v;
      if (slot.goFn) { v.removeEventListener('loadedmetadata', slot.goFn); slot.goFn = null; }   // a start that was waiting on the old clip must not fire for the new one
      slot.idx = idx; slot.ready = false; slot.err = false; slot.missing = isMissing(clip);
      v.pause(); v.removeAttribute('src');
      if (slot.missing) { v.load(); return; }
      v.src = clipUrl(clip); v.preload = 'auto'; v.load();
    }
    function wire(slot, k){
      const v = slot.v;
      v.addEventListener('loadedmetadata', function(){
        if (slot.idx < 0 || !isFinite(v.duration)) return;
        const c = clips[slot.idx], key = clipDurKey(c);
        if (!(typeof c.duration === 'number' && c.duration > 0) && Math.abs((probed[key] || 0) - v.duration) > 0.2) { probed[key] = Math.round(v.duration * 100) / 100; const all = durCache(); all[key] = probed[key]; lsSet(LS.dur, all); recompute(); drawList(); }
      });
      v.addEventListener('canplay', function(){ slot.ready = true; if (k === active) stage.classList.remove('buffering'); });
      v.addEventListener('error', function(){
        slot.err = true;
        if (slot.idx < 0) return;
        if (k === active && slot.idx === cur) onClipFailed();
        else { clips[slot.idx]._failed = true; recompute(); drawList(); }   // a preloaded clip that cannot load is skipped when its turn comes
      });
      v.addEventListener('waiting', function(){ if (k === active && playing) stage.classList.add('buffering'); });
      v.addEventListener('playing', function(){ if (k === active) { reveal(k); stage.classList.remove('buffering'); } });
      v.addEventListener('ended', function(){ if (k === active) next(); });
      v.addEventListener('timeupdate', function(){ if (k === active) tick(); });
    }
    slots.forEach(wire);
    function reveal(k){ slots.forEach(function(s, j){ s.v.classList.toggle('on', j === k); if (j !== k && slots[j].idx !== slots[k].idx) { try { s.v.pause(); } catch (e) {} } }); }
    function preloadNext(){
      const ni = nextAvail(cur + 1); if (ni < 0) return;
      const other = slots[1 - active];
      if (other.idx !== ni) prep(other, ni);
    }

    // playback
    function startClip(idx, off, autoplay){
      hideOver(el.miss); virtual = null;
      if (allMissing()) { cur = idx; showNoFiles(); playing = false; setPlayUi(); return; }
      if (skipClip(idx)) { const j = nextAvail(idx); if (j < 0) { cur = n - 1; finish(); return; } idx = j; off = 0; }
      cur = idx;
      let k = slots.findIndex(function(s){ return s.idx === idx; });
      if (k < 0) { k = 1 - active; prep(slots[k], idx); }
      active = k;
      const s = slots[k];
      drawList(); updateName();
      if (s.missing) {
        slots.forEach(function(x){ x.v.classList.remove('on'); });
        virtual = { off: off || 0, last: performance.now() };
        showMissing(idx);
        playing = !!autoplay; setPlayUi();
      } else {
        const go = function(){
          s.goFn = null; if (active !== k || cur !== idx || s.idx !== idx) return;
          try { if (off > 0.05) s.v.currentTime = off; } catch (e) {}
          if (autoplay) { const p = s.v.play(); if (p && p.catch) p.catch(function(){ playing = false; setPlayUi(); stage.classList.remove('buffering'); }); playing = true; if (!s.ready) stage.classList.add('buffering'); }
          else { playing = false; reveal(k); }
          setPlayUi();
        };
        if (s.goFn) s.v.removeEventListener('loadedmetadata', s.goFn);
        if (s.v.readyState >= 1) go(); else { s.goFn = go; s.v.addEventListener('loadedmetadata', go, { once: true }); }
        if (s.err) onClipFailed();
      }
      preloadNext();
      tick();
    }
    function showMissing(idx){ const c = clips[idx]; el.miss.innerHTML = '<b>Clip ' + String(idx + 1).padStart(2, '0') + ' · ' + esc(c.title || '') + '</b><span>' + (c && c.src ? 'This clip is not available yet.' : 'No file is set for this clip.') + '</span>'; showOver(el.miss); }
    function showNoFiles(){ el.miss.innerHTML = '<b>Episode ' + pad3(ep.number) + ' · ' + esc(ep.title) + '</b><span>This episode is not available yet.</span>'; slots.forEach(function(x){ x.v.classList.remove('on'); }); showOver(el.miss); stage.classList.remove('buffering'); }
    function onClipFailed(){
      clips[cur]._failed = true; recompute(); drawList(); stage.classList.remove('buffering');
      if (state !== 'playing' && state !== 'paused') return;     // behind the title card: it is skipped when playback starts
      if (allMissing()) { showNoFiles(); playing = false; setPlayUi(); return; }
      slots[active].v.classList.remove('on'); next();
    }
    function next(){ if (cur + 1 >= n) finish(); else startClip(cur + 1, 0, true); }
    function prev(){ const j = prevAvail(cur - 1); if (curTime() > 3 || j < 0) startClip(cur, 0, playing); else startClip(j, 0, playing); }
    function jumpTo(i, off){ if (state !== 'playing' && state !== 'paused') { beginPlayback({ idx: i, off: off, skipOpening: true }); return; } state = 'playing'; startClip(i, off, true); }
    function seekTo(t){ const l = locate(t); if (l.idx === cur && !slots[active].missing && slots[active].idx === cur) { try { slots[active].v.currentTime = l.off; } catch (e) {} if (virtual) virtual.off = l.off; tick(); } else startClip(l.idx, l.off, playing); }
    function togglePlay(){
      if (state === 'idle') { beginPlayback({}); return; }
      if (state === 'ended') return;
      const s = slots[active];
      if (playing) { playing = false; if (!s.missing) s.v.pause(); state = 'paused'; save(true); }
      else { playing = true; state = 'playing'; if (virtual) virtual.last = performance.now(); else { const p = s.v.play(); if (p && p.catch) p.catch(function(){}); } }
      setPlayUi(); wake();
    }
    function setPlayUi(){ el.pp.textContent = playing ? '⏸' : '▶'; if (playing || state !== 'paused') hideOver(el.playOver); }
    function updateName(){ el.name.textContent = String(cur + 1) + '/' + n + ' · ' + (clips[cur] && clips[cur].title || ''); }

    // the single heartbeat: UI, missing-clip timing, preloading, progress saving
    function tick(){
      if (destroyed) return;
      const now = performance.now();
      if (virtual) {
        if (playing) virtual.off += (now - virtual.last) / 1000;
        virtual.last = now;
        if (virtual.off >= dur(cur)) { virtual = null; next(); return; }
      } else {
        const s = slots[active];
        if (s && s.idx === cur && isFinite(s.v.duration) && playing && s.v.duration - s.v.currentTime < cfg.preloadSeconds) preloadNext();
      }
      if (!dragging) { const g = globalTime(); el.seek.value = total ? Math.round(g / total * 1000) : 0; el.seek.style.setProperty('--p', (total ? g / total * 100 : 0) + '%'); el.time.textContent = fmt(g) + ' / ' + fmt(total); }
      save(false);
    }
    const heartbeat = setInterval(tick, 250);

    // progress
    function save(force){
      const t = performance.now(); if (!force && t - lastSave < 3000) return; lastSave = t;
      if (state === 'idle' || state === 'opening' || state === 'ended') return;
      saveProgress(ep.number, { t: globalTime(), clip: cur, off: curTime(), done: false, ts: Date.now() });
    }
    window.addEventListener('pagehide', function(){ save(true); });
    document.addEventListener('visibilitychange', function(){ if (document.hidden) save(true); });

    // overlays
    function showOver(o){ o.classList.add('on'); }
    function hideOver(o){ o.classList.remove('on'); }

    // opening, ending
    function beginPlayback(opts){
      opts = opts || {}; hideOver(el.playOver); hideOver(el.resume); hideOver(el.endPanel); hideOver(el.end);
      stage.classList.remove('dim'); stage.classList.remove('idle');
      recompute();
      const idx = opts.idx || 0, off = opts.off || 0;
      if (opts.skipOpening || idx > 0 || off > 0) { state = 'playing'; startClip(idx, off, true); wake(); return; }
      state = 'opening'; showOver(el.open);
      { const f0 = nextAvail(0); if (f0 >= 0) prep(slots[active], f0); }     // preload the first playable clip behind the title card
      const proceed = function(){ if (state !== 'opening') return; clearTimeout(openingTimer); hideOver(el.open); state = 'playing'; setTimeout(function(){ if (!destroyed && state === 'playing') startClip(0, 0, true); }, 500); wake(); };
      openingTimer = setTimeout(proceed, cfg.openingSeconds * 1000);
      el.open.onclick = proceed;
    }
    function finish(){
      state = 'ended'; playing = false; virtual = null; setPlayUi(); stage.classList.remove('buffering');
      saveProgress(ep.number, { t: total, clip: n - 1, off: 0, done: true, ts: Date.now() });
      drawList();
      const art = ep.ending && ep.ending.art;
      if (art) { el.end.style.backgroundImage = 'url(' + art + ')'; el.end.style.backgroundSize = 'cover'; }
      showOver(el.end);                                                // the tagline over the held final frame
      setTimeout(function(){
        if (destroyed || state !== 'ended') return;
        stage.classList.add('dim');                                    // fade out
        setTimeout(function(){
          if (destroyed || state !== 'ended') return;
          hideOver(el.end);
          const nextEp = (registry.episodes || []).filter(function(e){ return e.number > ep.number; }).sort(function(a, b){ return a.number - b.number; })[0];
          el.endPanel.innerHTML = '<h2>Episode ' + pad3(ep.number) + ' · ' + esc(ep.title) + '</h2><div class="row">' +
            (nextEp ? '<a class="sr-btn" href="#/ep/' + nextEp.number + '">▶ Next episode</a>' : '') +
            '<button class="sr-btn ghost" id="srReplay" type="button">↻ Replay</button><a class="sr-btn ghost" href="#">☰ All episodes</a></div>';
          showOver(el.endPanel);
          el.endPanel.querySelector('#srReplay').onclick = function(){ saveProgress(ep.number, null); stage.classList.remove('dim'); virtual = null; slots.forEach(function(s){ s.idx = -1; s.v.classList.remove('on'); }); beginPlayback({}); };
        }, 1300);
      }, cfg.endingHoldSeconds * 1000);
    }

    // controls
    el.pp.onclick = function(e){ e.stopPropagation(); togglePlay(); };
    el.playOver.querySelector('button').onclick = function(e){ e.stopPropagation(); togglePlay(); };
    $('srPrev').onclick = function(e){ e.stopPropagation(); if (state === 'playing' || state === 'paused') prev(); };
    $('srNext').onclick = function(e){ e.stopPropagation(); if (state === 'playing' || state === 'paused') next(); };
    el.seek.addEventListener('input', function(){ dragging = true; const t = el.seek.value / 1000 * total; el.time.textContent = fmt(t) + ' / ' + fmt(total); el.seek.style.setProperty('--p', el.seek.value / 10 + '%'); });
    el.seek.addEventListener('change', function(){ dragging = false; if (state === 'idle') { const l = locate(el.seek.value / 1000 * total); beginPlayback({ idx: l.idx, off: l.off, skipOpening: true }); } else if (state === 'playing' || state === 'paused') seekTo(el.seek.value / 1000 * total); });
    function applyVol(){ const vol = Number(el.vol.value) / 100; slots.forEach(function(s){ s.v.volume = vol; s.v.muted = vol === 0 || muted; }); el.mute.textContent = (muted || vol === 0) ? '🔇' : '🔊'; lsSet(LS.vol, { v: vol, m: muted }); }
    const sv = lsGet(LS.vol, { v: 1, m: false }); let muted = !!sv.m; el.vol.value = Math.round((sv.v == null ? 1 : sv.v) * 100); applyVol();
    el.vol.oninput = function(){ muted = false; applyVol(); };
    el.mute.onclick = function(e){ e.stopPropagation(); muted = !muted; applyVol(); };
    function fsOn(){ return document.fullscreenElement === stage || document.webkitFullscreenElement === stage || stage.classList.contains('pseudo-fs'); }
    function toggleFs(){
      if (!fsOn()) {
        const rq = stage.requestFullscreen || stage.webkitRequestFullscreen;
        if (rq) { Promise.resolve(rq.call(stage)).then(function(){ try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function(){}); } catch (e) {} }).catch(function(){ stage.classList.add('pseudo-fs'); }); }
        else stage.classList.add('pseudo-fs');
      } else {
        if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        stage.classList.remove('pseudo-fs'); try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) {}
      }
    }
    el.fs.onclick = function(e){ e.stopPropagation(); toggleFs(); };
    stage.addEventListener('dblclick', function(e){ if (!e.target.closest('.sr-ctl')) toggleFs(); });
    stage.addEventListener('click', function(e){ if (e.target.closest('.sr-ctl') || e.target.closest('.sr-over.on a, .sr-over.on button')) return; if (state === 'playing' || state === 'paused') togglePlay(); });
    function poke(){ stage.classList.remove('idle'); clearTimeout(idleTimer); idleTimer = setTimeout(function(){ if (playing) stage.classList.add('idle'); }, 3200); }
    ['mousemove', 'touchstart', 'keydown', 'click'].forEach(function(ev){ stage.addEventListener(ev, poke, { passive: true }); });
    stage.addEventListener('keydown', function(e){
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePlay(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); if (e.shiftKey) { if (state === 'playing' || state === 'paused') next(); } else seekTo(globalTime() + 5); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); if (e.shiftKey) prev(); else seekTo(globalTime() - 5); }
      else if (e.key === 'f') toggleFs(); else if (e.key === 'm') { muted = !muted; applyVol(); }
    });
    let lock = null;
    function wake(){ try { if (playing && navigator.wakeLock && !lock) navigator.wakeLock.request('screen').then(function(l){ lock = l; l.addEventListener('release', function(){ lock = null; }); }).catch(function(){}); } catch (e) {} }

    // public
    this.showPoster = function(){
      recompute(); drawList(); updateName();
      const p = progressOf(ep.number);
      el.time.textContent = '0:00 / ' + fmt(total);
      const poster = ep.thumbnail; if (poster) stage.style.background = '#000 url(' + poster + ') center/cover no-repeat';
      showOver(el.playOver);
      el.playOver.querySelector('button').onclick = function(e){
        e.stopPropagation();
        const saved = progressOf(ep.number);
        if (saved && !saved.done && saved.t > 5) {
          el.resume.innerHTML = '<h2 style="margin:0;color:var(--gold2)">Resume?</h2><p style="margin:0">You stopped at ' + fmt(saved.t) + ' (clip ' + (saved.clip + 1) + ' of ' + n + ').</p><div class="row"><button class="sr-btn" id="srRes" type="button">▶ Resume</button><button class="sr-btn ghost" id="srFresh" type="button">Start over</button></div>';
          showOver(el.resume); hideOver(el.playOver);
          el.resume.querySelector('#srRes').onclick = function(ev){ ev.stopPropagation(); beginPlayback({ idx: Math.min(n - 1, saved.clip || 0), off: Math.max(0, (saved.off || 0) - cfg.resumeRewindSeconds), skipOpening: true }); };
          el.resume.querySelector('#srFresh').onclick = function(ev){ ev.stopPropagation(); saveProgress(ep.number, null); beginPlayback({}); };
        } else beginPlayback({});
      };
      void p;
    };
    this.destroy = function(){
      destroyed = true; clearInterval(heartbeat); clearTimeout(idleTimer); clearTimeout(openingTimer); save(true);
      slots.forEach(function(s){ try { s.v.pause(); s.v.removeAttribute('src'); s.v.load(); } catch (e) {} });
      if (document.fullscreenElement) { try { document.exitFullscreen(); } catch (e) {} }
      try { if (lock) lock.release(); } catch (e) {}
    };
    this._debug = function(){ return { state: state, cur: cur, active: active, playing: playing, total: total, offsets: offsets, slots: slots.map(function(s){ return { idx: s.idx, ready: s.ready, on: s.v.classList.contains('on'), t: s.v.currentTime }; }) }; };
    this._seek = seekTo; this._next = next; this._prev = prev; this._toggle = togglePlay;
  }

  // ---------- routing and start ----------
  function route(){
    const m = /^#\/ep\/(\d+)/.exec(location.hash);
    if (m) renderEpisode(Number(m[1])); else renderList();
  }
  async function start(){
    try { registry = await loadJson(config.registryUrl, /^https?:/i.test(config.registryUrl)); }
    catch (e) { app.innerHTML = '<p class="sr-err">Could not load the episode registry. ' + esc(e.message) + '</p>'; return; }
    route();
  }
  window.addEventListener('hashchange', function(){ if (registry) route(); });
  window.__series = { get player(){ return player; } };
  (async function init(){
    try { config = await loadJson('series/config.json', false); }
    catch (e) { app.innerHTML = '<p class="sr-err">Could not load series/config.json. ' + esc(e.message) + '</p>'; return; }
    if (await authorised()) start(); else renderGate('');
  })();
})();
