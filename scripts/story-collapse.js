(function(){
  // -------------------------------------------------------------------
  // STORY SCREEN: collapsible arcs, in order, and a comic reader.
  //
  // The Story screen used to list every arc's cover and chapters one after another (47
  // sections), so reaching the arc you are on meant scrolling past dozens of covers. Now:
  //   * every arc is a slim bar (name, how far you are, a caret). The arc you are in is
  //     open, the rest are closed, and the screen scrolls straight to the open one when you
  //     arrive. Open/closed choices are remembered.
  //   * arcs are put in order (Arcs XV-XVII used to sit at the end).
  //   * the long Crimson Horizon list is grouped by arc.
  //   * every arc you have read has a 📖 Read comic button, and every chapter you have
  //     finished has its own. The reader shows the arc as one scrollable page-by-page comic
  //     (only chapters you have read), opening at the chapter you chose.
  // Purely presentation: nothing about chapters, XP or objectives changes.
  // -------------------------------------------------------------------
  const ROMAN = { I:1, V:5, X:10, L:50, C:100 };
  function romanVal(s){ let t = 0; for (let i = 0; i < s.length; i++) { const v = ROMAN[s[i]], n = ROMAN[s[i + 1]]; t += (n && n > v) ? -v : v; } return t; }


  const ARC1_IMAGES = { 1:'ch01-storm-that-remained.webp', 2:'ch02-the-first-port.webp', 3:'ch03-a-crew-of-choice.webp', 4:'ch04-the-guardians-fortress.webp', 5:'ch05-the-voice-behind-the-wall.webp', 6:'ch06-the-shield-returns.webp', 7:'ch07-the-shield-that-remained.webp', 8:'ch08-the-tradewinds-remember.webp', 9:'ch09-shield-returns.webp', 10:'ch10-day-sea-rested.webp', 11:'ch11-day-we-chose.webp', 12:'ch12-debt-wasnt-hers.webp', 13:'ch13-debt-collector.webp', 14:'ch14-two-sisters-one-ship.webp', 15:'ch15-one-who-stayed.webp', 16:'ch16-mark-we-carried.webp', 17:'ch17-things-we-do-without-knowing.webp', 18:'ch18-mezstorm-rescue.webp', 19:'ch19-crew-we-choose.webp', 20:'ch20-senedra.webp', 21:'ch21-zaki.webp', 22:'ch22-mezstorm.webp', 23:'ch23-siblings.webp', 24:'ch24-drowned-passage.webp' };

  // key -> { label, chapters:[{id,title,image,focus,read}] }
  function arcData(key){
    try {
      if (key === 'a1') {
        const prog = game.comicProgress || {};
        return { label: 'Arc I — The First Voyage', chapters: (typeof ARC1_COMICS !== 'undefined' ? ARC1_COMICS : []).map(function(c){ return { id: c.id, title: c.title, image: ARC1_IMAGES[c.id] ? 'assets/comics/arc1/' + ARC1_IMAGES[c.id] : null, focus: c.focus || '', read: !!prog[c.id] }; }) };
      }
      let m = /^a(\d+)$/.exec(key);
      if (m) {
        const arr = window['ARC' + m[1] + '_CHAPTERS'], prog = game['comicProgress' + m[1]] || {};
        if (!Array.isArray(arr)) return null;
        return { label: 'Arc ' + m[1], chapters: arr.map(function(c){ return { id: c.id, title: c.title, image: c.image || null, focus: c.focus || '', read: !!prog[c.id] }; }) };
      }
      const special = { i20: ['ARC20_INTERLUDE_CHAPTERS', 'comicProgress20Interlude', 'Interlude: In Between'], i41: ['ARC41_INTERLUDE_CHAPTERS', 'comicProgress41Interlude', 'Interludes'], b41: ['ARC41_BRIDGE_CHAPTERS', 'comicProgressArc41Bridge', 'Bridge to Arc XLII'] };
      if (special[key]) {
        const s = special[key], arr = window[s[0]], prog = game[s[1]] || {};
        if (!Array.isArray(arr)) return null;
        return { label: s[2], chapters: arr.map(function(c){ return { id: c.id, title: c.title, image: c.image || null, focus: c.focus || '', read: !!prog[c.id] }; }) };
      }
      m = /^ch(\d+)$/.exec(key);
      if (m) {
        const arr = window.CRIMSON_HORIZON_CHAPTERS, prog = game.comicProgressCrimsonHorizon || {}, meta = window.CRIMSON_HORIZON_ARC_META || {};
        if (!Array.isArray(arr)) return null;
        return { label: 'Crimson Horizon · Arc ' + m[1], chapters: arr.filter(function(c){ return String(c.arc) === m[1]; }).map(function(c){ return { id: c.id, title: c.title, image: c.image || null, focus: c.focus || '', read: !!prog[c.id] }; }) };
      }
    } catch(e) {}
    return null;
  }

  function keyOfSection(sec){
    const k = ((sec.querySelector('.story-act-kicker') || {}).textContent || '').trim();
    const t = ((sec.querySelector('.story-act-title') || {}).textContent || '').trim();
    let m = /^Arc\s+([IVXLC]+)\b/.exec(k);
    if (m) { const n = romanVal(m[1]); return { key: 'a' + n, n: n, k: k, t: t }; }
    if (/Crimson Horizon/.test(k)) return { key: 'ch', n: 1000, k: k, t: t };
    if (/Bridge to Arc XLII/.test(k)) return { key: 'b41', n: 41.8, k: k, t: t };
    if (k === 'Interlude' && /In Between/.test(t)) return { key: 'i20', n: 20.5, k: k, t: t };
    if (k === 'Interlude') return { key: 'i41', n: 41.5, k: k, t: t };
    return { key: null, n: null, k: k, t: t };
  }

  function ensureStyle(){
    if (document.getElementById('ctSCStyle')) return;
    const s = document.createElement('style'); s.id = 'ctSCStyle';
    s.textContent =
      '.sc-bar{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:pointer;border-bottom:1px solid rgba(205,163,55,.25);}' +
      '.sc-bar .sc-caret{width:1.1em;opacity:.8;transition:transform .15s;}' +
      '.sc-sec.open > .sc-bar .sc-caret{transform:rotate(90deg);}' +
      '.sc-bar .sc-names{flex:1;min-width:0;}' +
      '.sc-bar .sc-k{font-size:.66rem;letter-spacing:.12em;text-transform:uppercase;opacity:.7;}' +
      '.sc-bar .sc-t{font-family:Cinzel,Georgia,serif;color:var(--gold);font-size:.95rem;line-height:1.25;}' +
      '.sc-bar .sc-st{font-size:.7rem;opacity:.75;white-space:nowrap;}' +
      '.sc-bar .sc-st.cur{color:#9be3a8;opacity:1;}' +
      '.sc-sec > .sc-body{display:none;}' +
      '.sc-sec.open > .sc-body{display:block;}' +
      '.sc-readarc{margin:8px 12px 2px;}' +
      '.sc-sub{margin:6px 0;border:1px solid rgba(205,163,55,.2);border-radius:8px;}' +
      '.sc-sub > summary{cursor:pointer;padding:8px 10px;font-size:.84rem;color:var(--gold);}' +
      '.sc-readbtn{margin-top:6px;}' +
      '#ctComicReader{position:fixed;inset:0;z-index:2100;background:#050c14;display:flex;flex-direction:column;}' +
      '#ctComicReader .cr-top{display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(5,12,20,.96);border-bottom:1px solid rgba(205,163,55,.3);}' +
      '#ctComicReader .cr-title{flex:1;min-width:0;font-family:Cinzel,Georgia,serif;color:var(--gold);font-size:.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '#ctComicReader select{max-width:42vw;background:#0d1f2d;color:#e8c96a;border:1px solid rgba(205,163,55,.4);border-radius:6px;padding:4px;}' +
      '#ctComicReader .cr-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:8px 0 40px;}' +
      '#ctComicReader figure{margin:0 auto 18px;max-width:760px;content-visibility:auto;contain-intrinsic-size:auto 900px;}' +
      '#ctComicReader figcaption{font-size:.78rem;color:var(--gold);padding:6px 12px;}' +
      '#ctComicReader img{width:100%;display:block;aspect-ratio:auto 4/5;}' +
      '#ctComicReader .cr-missing{margin:0 12px;padding:18px;border:1px dashed rgba(205,163,55,.4);border-radius:8px;font-size:.8rem;opacity:.8;line-height:1.5;}';
    document.head.appendChild(s);
  }

  // ---- the reader ----
  window.closeComicReader = function(){ const el = document.getElementById('ctComicReader'); if (el) el.remove(); document.body.style.overflow = ''; };
  window.openComicReader = function(key, chapterId){
    ensureStyle();
    const d = arcData(key); if (!d) return;
    const read = d.chapters.filter(function(c){ return c.read; });
    if (!read.length) { if (typeof toast === 'function') toast('Nothing to read here yet.'); return; }
    window.closeComicReader();
    const el = document.createElement('div'); el.id = 'ctComicReader';
    const opts = read.map(function(c){ return '<option value="' + c.id + '">' + esc(String(c.title || c.id).slice(0, 46)) + '</option>'; }).join('');
    el.innerHTML = '<div class="cr-top"><button class="btn btn-small" onclick="closeComicReader()">✕</button><div class="cr-title">📖 ' + esc(d.label) + '</div>' +
      '<select onchange="(function(v){var f=document.getElementById(\'cr-ch-\'+v);if(f)f.scrollIntoView({block:\'start\'});})(this.value)">' + opts + '</select></div>' +
      '<div class="cr-body">' + read.map(function(c){
        const fallback = '<div class="cr-missing">The art for this chapter has not been uploaded yet.<br><br>' + esc(c.focus) + '</div>';
        const img = c.image ? '<img loading="lazy" decoding="async" src="' + esc(c.image) + '" alt="' + esc(c.title) + '" onerror="this.outerHTML=this.getAttribute(\'data-fb\')" data-fb="' + esc(fallback) + '">' : fallback;
        return '<figure id="cr-ch-' + c.id + '"><figcaption>' + esc(c.title) + '</figcaption>' + img + '</figure>';
      }).join('') + '</div>';
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    const target = chapterId != null && document.getElementById('cr-ch-' + chapterId);
    if (target) { const sel = el.querySelector('select'); if (sel) sel.value = String(chapterId); target.scrollIntoView({ block: 'start' }); }
  };

  // ---- collapsing ----
  function state(){ game.storyCollapse = game.storyCollapse || {}; return game.storyCollapse; }
  function statusOf(sec){
    const txt = sec.textContent || '';
    const done = (txt.match(/✓ COMPLETE/g) || []).length;
    const cur = /CURRENT|AVAILABLE/.test(txt) || !!sec.querySelector('article.quest-item.active');
    const locked = !!sec.querySelector('.story-chapter.locked') && !done && !cur;
    const total = (txt.match(/✓ COMPLETE|CURRENT|🔒 LOCKED|AVAILABLE|⏳ WAITING/g) || []).length;
    return { done: done, cur: cur, locked: locked, total: total };
  }

  let scrollTarget = null, scrollTimer = 0;
  function process(){
    const container = document.getElementById('storyContent'); if (!container) return;
    ensureStyle();
    const secs = Array.prototype.filter.call(container.children, function(c){ return c.tagName === 'SECTION' && c.classList.contains('story-act') && !c.__sc; });
    if (!secs.length) return;
    // 1. order the arcs
    const all = Array.prototype.filter.call(container.children, function(c){ return c.tagName === 'SECTION' && c.classList.contains('story-act'); });
    let prev = 0; const keyed = all.map(function(sec, i){ const info = keyOfSection(sec); const n = info.n != null ? info.n : prev + 0.01; if (info.n != null) prev = info.n; else prev = n; return { sec: sec, n: n, i: i, info: info }; });
    keyed.slice().sort(function(a, b){ return a.n - b.n || a.i - b.i; }).forEach(function(x){ container.appendChild(x.sec); });
    // 2. collapse
    let current = null, lastCur = -1;
    keyed.forEach(function(x, i){ if (!x.sec.__sc && statusOf(x.sec).cur) lastCur = i; });
    keyed.forEach(function(x, i){
      const sec = x.sec; if (sec.__sc) return; sec.__sc = true;
      const info = x.info, st = statusOf(sec);
      const sk = (info.key || ('s:' + info.k + '|' + info.t));
      let open = (sk in state()) ? !!state()[sk] : (i === lastCur);
      sec.classList.add('sc-sec'); if (open) sec.classList.add('open');
      const body = document.createElement('div'); body.className = 'sc-body';
      while (sec.firstChild) body.appendChild(sec.firstChild);
      const data = info.key && info.key !== 'ch' ? arcData(info.key) : null;
      const readCount = data ? data.chapters.filter(function(c){ return c.read; }).length : 0;
      const chip = st.locked ? '🔒 Locked' : (st.total && st.done >= st.total ? '✓ ' + st.done + '/' + st.total : (st.cur ? '▶ ' + st.done + '/' + (st.total || '?') : (st.done ? st.done + '/' + (st.total || '?') : '')));
      const bar = document.createElement('div'); bar.className = 'sc-bar';
      bar.innerHTML = '<span class="sc-caret">▶</span><div class="sc-names"><div class="sc-k">' + esc(info.k) + '</div><div class="sc-t">' + esc(info.t) + '</div></div><span class="sc-st' + (st.cur ? ' cur' : '') + '">' + chip + '</span>';
      bar.onclick = function(){ const o = sec.classList.toggle('open'); state()[sk] = o; };
      sec.appendChild(bar);
      if (data && readCount) {
        const rb = document.createElement('button'); rb.className = 'btn btn-small sc-readarc'; rb.textContent = '📖 Read comic';
        rb.onclick = function(e){ e.stopPropagation(); window.openComicReader(info.key); };
        body.insertBefore(rb, body.firstChild);
      }
      sec.appendChild(body);
      // per-chapter read buttons (arcs whose chapters render one article each, in data order)
      if (data) {
        const arts = body.querySelectorAll('article.quest-item');
        if (arts.length === data.chapters.length) arts.forEach(function(a, i){
          const c = data.chapters[i];
          if (!c.read || !/✓ COMPLETE/.test(a.textContent)) return;
          const b = document.createElement('button'); b.className = 'btn btn-small sc-readbtn'; b.textContent = '📖 Read comic';
          b.onclick = function(){ window.openComicReader(info.key, c.id); };
          const actions = a.querySelector('.story-actions'); (actions || a).appendChild(b);
        });
      }
      // the sequel: group by arc
      if (info.key === 'ch') groupSequel(body);
      if (i === lastCur || (open && !current)) current = sec;
    });
    // 3. go to the arc you are in
    if (window.__ctStoryScrollOnce && current) {
      // the screen can render more than once while it opens, so wait for the last render
      scrollTarget = current; clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function(){
        window.__ctStoryScrollOnce = false;
        try { if (scrollTarget && scrollTarget.isConnected) { scrollTarget.scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy(0, -8); } } catch(e) {}
      }, 200);
    }
  }

  function groupSequel(body){
    const list = window.CRIMSON_HORIZON_CHAPTERS || [], arts = Array.prototype.slice.call(body.querySelectorAll('article.quest-item'));
    if (!list.length || arts.length !== list.length) return;
    const groups = {};
    arts.forEach(function(a, i){ const n = list[i].arc; (groups[n] = groups[n] || []).push(a); });
    const meta = window.CRIMSON_HORIZON_ARC_META || {};
    Object.keys(groups).sort(function(a, b){ return a - b; }).forEach(function(n){
      const arr = groups[n], first = arr[0], parent = first.parentNode;
      const done = arr.filter(function(a){ return /✓ COMPLETE/.test(a.textContent); }).length;
      const cur = arr.some(function(a){ return /CURRENT|AVAILABLE/.test(a.textContent); });
      const det = document.createElement('details'); det.className = 'sc-sub'; if (cur) det.open = true;
      const sum = document.createElement('summary');
      sum.textContent = (meta[n] ? meta[n].kicker.replace('Crimson Horizon · ', '') + ' — ' + meta[n].title : 'Arc ' + n) + '  ·  ' + done + '/' + arr.length;
      det.appendChild(sum); parent.insertBefore(det, first); arr.forEach(function(a){ det.appendChild(a); });
      const data = arcData('ch' + n);
      if (data && data.chapters.some(function(c){ return c.read; })) {
        const rb = document.createElement('button'); rb.className = 'btn btn-small sc-readarc'; rb.textContent = '📖 Read comic'; rb.onclick = function(){ window.openComicReader('ch' + n); };
        det.insertBefore(rb, sum.nextSibling);
        const ch = data.chapters;
        arr.forEach(function(a, i){ const c = ch[i]; if (!c || !c.read || !/✓ COMPLETE/.test(a.textContent)) return; const b = document.createElement('button'); b.className = 'btn btn-small sc-readbtn'; b.textContent = '📖 Read comic'; b.onclick = function(){ window.openComicReader('ch' + n, c.id); }; (a.querySelector('.story-actions') || a).appendChild(b); });
      }
    });
  }

  const oldRenderStory = window.renderStory;
  window.renderStory = function(){
    if (oldRenderStory) oldRenderStory.apply(this, arguments);
    try { process(); } catch(e) { if (window.console) console.warn('story collapse failed', e); }
  };
  const oldGoScreen = window.goScreen;
  window.goScreen = function(name){
    if (name === 'story') window.__ctStoryScrollOnce = true;
    return oldGoScreen.apply(this, arguments);
  };
})();
