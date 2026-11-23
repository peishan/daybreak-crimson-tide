(function(){
  // -------------------------------------------------------------------
  // EQUIPMENT UPGRADE HINTS -- it was hard to tell whether a piece of gear
  // needed replacing: the screen listed stats but never compared anything.
  //
  // For every crew member and every slot this works out the best item they
  // could use that is better than what they have:
  //   * from the gear you already own (with a one-tap Equip),
  //   * from the shops that are open (with the price, and whether you can
  //     afford it).
  // "Better" is a role-weighted stat score (casters value MAG, melee/ranged
  // ATK, tanks DEF/HP...), so a big ATK sword is not called an upgrade for a
  // healer. It is a guide, not a rule: the numbers are shown so you can judge.
  //
  // Also adds: a red/green hint under each slot, a summary at the top of the
  // Equipment screen, a ▲/▼ delta on each Equip button in your inventory, a
  // "who is this an upgrade for" line on shop rows, and a badge on the
  // Equipment nav button when owned gear would improve someone.
  // Nothing here changes any stats or equipping logic.
  // -------------------------------------------------------------------
  const WEIGHTS = {
    caster:  {atk:0.3, magic:1.6, defense:1.0, hp:0.2, spd:0.5, mp:0.3},
    healer:  {atk:0.3, magic:1.5, defense:1.0, hp:0.25, spd:0.5, mp:0.3},
    support: {atk:0.6, magic:1.2, defense:1.0, hp:0.2, spd:0.6, mp:0.3},
    melee:   {atk:1.6, magic:0.3, defense:1.0, hp:0.2, spd:0.7, mp:0.1},
    ranged:  {atk:1.6, magic:0.3, defense:0.8, hp:0.2, spd:0.8, mp:0.1},
    tank:    {atk:0.8, magic:0.2, defense:1.6, hp:0.3, spd:0.4, mp:0.1},
    _:       {atk:1.0, magic:1.0, defense:1.0, hp:0.2, spd:0.5, mp:0.2}
  };
  function weightsFor(id){
    let role = null;
    try { role = (typeof CLASS_KIT !== 'undefined' && CLASS_KIT[id]) ? CLASS_KIT[id].role : null; } catch(e) {}
    return WEIGHTS[role] || WEIGHTS._;
  }
  function score(item, id){
    if (!item) return 0;
    const w = weightsFor(id);
    return Math.round((Number(item.atk||0)*w.atk + Number(item.magic||item.int||0)*w.magic + Number(item.defense||item.def||0)*w.defense +
      Number(item.hp||0)*w.hp + Number(item.spd||0)*w.spd + Number(item.mp||0)*w.mp) * 10) / 10;
  }
  function display(item){ try { return (typeof gearDisplayItem === 'function') ? gearDisplayItem(item) : item; } catch(e) { return item; } }
  function visibleSlots(id){
    const rules = gearMemberRules(id);
    return GEAR_SLOTS.filter(function(s){ return !(rules.hidden || []).includes(s); });
  }
  function partyList(){ return (typeof getActiveParty === 'function') ? getActiveParty() : []; }

  // Shop items the player could buy right now (trader unlocked by level).
  function openShopItems(){
    const out = [];
    (EQUIPMENT_TRADERS || []).forEach(function(t){
      if (level() < t.minLevel) return;
      (t.stock || []).forEach(function(id){
        const item = EQUIPMENT_CATALOG.find(function(i){ return i.id === id; });
        if (item) out.push({item: item, trader: t});
      });
    });
    return out;
  }

  // Best upgrade for one member+slot. Returns {state, delta, ...}.
  function analyse(memberId, slot, shop){
    const eq = (game.equippedGear && game.equippedGear[memberId]) || {};
    const cur = eq[slot];
    const curScore = score(cur, memberId);
    let ownedBest = null, shopBest = null;
    (game.equipmentInventory || []).forEach(function(raw, idx){
      const it = display(raw);
      if (!it || it.slot !== slot || !gearCanEquip(memberId, it)) return;
      const d = score(it, memberId) - curScore;
      if (d > 0.4 && (!ownedBest || d > ownedBest.delta)) ownedBest = {item: it, idx: idx, delta: Math.round(d*10)/10};
    });
    shop.forEach(function(s){
      const it = s.item;
      if (it.slot !== slot || !gearCanEquip(memberId, it)) return;
      const d = score(it, memberId) - curScore;
      if (d > 0.4 && (!shopBest || d > shopBest.delta)) shopBest = {item: it, trader: s.trader, delta: Math.round(d*10)/10, price: it.price || 0};
    });
    return {cur: cur, empty: !cur, ownedBest: ownedBest, shopBest: shopBest};
  }

  function summary(){
    const shop = openShopItems();
    const res = [];
    partyList().forEach(function(m){
      if (typeof memberUnlocked === 'function' && !memberUnlocked(m)) return;
      let owned = 0, shopN = 0, empty = 0;
      visibleSlots(m.id).forEach(function(slot){
        const a = analyse(m.id, slot, shop);
        if (a.ownedBest) owned++;
        else if (a.shopBest) shopN++;
        if (a.empty && (a.ownedBest || a.shopBest)) empty++;
      });
      res.push({member: m, owned: owned, shop: shopN, empty: empty});
    });
    return res;
  }
  window.equipmentUpgradeSummary = summary;

  function ensureStyle(){
    if (document.getElementById('ctUpgStyle')) return;
    const s = document.createElement('style'); s.id = 'ctUpgStyle';
    s.textContent =
      '.gear-upg{font-size:.68rem;margin-top:5px;line-height:1.35;border-radius:5px;padding:3px 5px;}' +
      '.gear-upg.own{background:rgba(70,170,90,.18);color:#9be3a8;}' +
      '.gear-upg.shop{background:rgba(232,197,71,.14);color:#f0d27a;}' +
      '.gear-upg.shop.poor{opacity:.75}' +
      '.gear-upg.ok{opacity:.55}' +
      '.gear-upg button{margin-top:3px;}' +
      '.gear-slot.has-upgrade{border-color:rgba(90,200,110,.75)!important;}' +
      '.gear-slot.has-shop-upgrade{border-color:rgba(232,197,71,.6)!important;}' +
      '.gear-chip{display:inline-block;font-size:.66rem;border-radius:9px;padding:1px 7px;margin-left:6px;vertical-align:middle;}' +
      '.gear-chip.own{background:rgba(70,170,90,.25);color:#9be3a8;}' +
      '.gear-chip.shop{background:rgba(232,197,71,.2);color:#f0d27a;}' +
      '.gear-delta{font-size:.68rem;margin-left:3px;font-weight:700}' +
      '.gear-delta.up{color:#7fdc92}.gear-delta.down{color:#e88a80}.gear-delta.same{opacity:.6}' +
      '.gear-shop-tag{font-size:.7rem;margin-top:3px;}' +
      '.gear-shop-tag.up{color:#7fdc92}.gear-shop-tag.none{opacity:.5}' +
      '#gearUpgradeSummary{margin:0 0 12px;padding:10px 12px;}' +
      '#gearUpgradeSummary .gus-row{font-size:.78rem;line-height:1.7}' +
      '[data-ct-up]{position:relative;}' +
      '[data-ct-up]::after{content:attr(data-ct-up);position:absolute;top:2px;right:2px;min-width:17px;height:17px;padding:0 4px;border-radius:9px;box-sizing:border-box;background:#3fa65a;color:#fff;font:700 .68rem/17px Lato,sans-serif;text-align:center;box-shadow:0 0 0 2px rgba(5,12,20,.9);pointer-events:none;}';
    document.head.appendChild(s);
  }

  function fmt(n){ return (n > 0 ? '+' : '') + n; }

  function decorate(){
    ensureStyle();
    const roster = document.getElementById('equipmentRoster');
    if (!roster) return;
    const party = partyList();
    const shop = openShopItems();
    const memberEls = roster.querySelectorAll(':scope > .gear-member');
    if (memberEls.length === party.length) {
      memberEls.forEach(function(el, i){
        const m = party[i];
        const slots = visibleSlots(m.id);
        const slotEls = el.querySelectorAll('.gear-slot');
        let own = 0, sh = 0;
        if (slotEls.length === slots.length) {
          slotEls.forEach(function(sel, j){
            const a = analyse(m.id, slots[j], shop);
            let html = '';
            if (a.ownedBest) {
              own++;
              sel.classList.add('has-upgrade');
              html = '<div class="gear-upg own">⬆ ' + esc(a.ownedBest.item.name) + ' <b>' + fmt(a.ownedBest.delta) + '</b> (owned)' +
                '<br><button class="btn btn-small" onclick="equipGear(\'' + m.id + '\',' + a.ownedBest.idx + ')">Equip</button></div>';
            } else if (a.shopBest) {
              sh++;
              sel.classList.add('has-shop-upgrade');
              const afford = (game.gold || 0) >= a.shopBest.price;
              html = '<div class="gear-upg shop' + (afford ? '' : ' poor') + '">🛒 ' + esc(a.shopBest.item.name) + ' <b>' + fmt(a.shopBest.delta) + '</b> · ' +
                a.shopBest.price.toLocaleString() + 'g' + (afford ? '' : ' (need ' + (a.shopBest.price - (game.gold || 0)).toLocaleString() + 'g more)') + ' · ' + esc(a.shopBest.trader.name) +
                (afford ? '<br><button class="btn btn-small btn-success" onclick="quickBuyGear(\'' + a.shopBest.trader.id + '\',\'' + a.shopBest.item.id + '\',\'' + m.id + '\')">🛒 Buy &amp; Equip</button> ' +
                  '<button class="btn btn-small" onclick="quickBuyGear(\'' + a.shopBest.trader.id + '\',\'' + a.shopBest.item.id + '\')">Buy only</button>' : '') + '</div>';
            } else if (a.cur) {
              html = '<div class="gear-upg ok">✓ Best you have access to</div>';
            }
            sel.insertAdjacentHTML('beforeend', html);
          });
        }
        const head = el.querySelector('.gear-member-name');
        if (head) {
          const chips = (own ? '<span class="gear-chip own">⬆ ' + own + ' to equip</span>' : '') + (sh ? '<span class="gear-chip shop">🛒 ' + sh + ' in shops</span>' : '');
          if (chips) head.insertAdjacentHTML('beforeend', chips);
        }
      });
    }
    // Inventory: show the change on each Equip button.
    document.querySelectorAll('#equipmentInventory .gear-equip-buttons button[onclick^="equipGear"]').forEach(function(btn){
      const mm = /equipGear\('([^']+)',(\d+)\)/.exec(btn.getAttribute('onclick') || '');
      if (!mm) return;
      const it = display((game.equipmentInventory || [])[Number(mm[2])]);
      if (!it) return;
      const eq = ((game.equippedGear || {})[mm[1]] || {})[it.slot];
      const d = Math.round((score(it, mm[1]) - score(eq, mm[1])) * 10) / 10;
      const cls = !eq ? 'up' : (d > 0.4 ? 'up' : (d < -0.4 ? 'down' : 'same'));
      const txt = !eq ? '▲ new' : (d > 0.4 ? '▲' + fmt(d) : (d < -0.4 ? '▼' + d : '='));
      btn.insertAdjacentHTML('beforeend', '<span class="gear-delta ' + cls + '">' + txt + '</span>');
    });
    // Shops: who is this an upgrade for?
    document.querySelectorAll('#equipmentTraders .gear-shop-row').forEach(function(row){
      const b = row.querySelector('button[onclick^="buyEquipment"]');
      const mm = b && /buyEquipment\('([^']+)','([^']+)'\)/.exec(b.getAttribute('onclick') || '');
      if (!mm) return;
      const item = EQUIPMENT_CATALOG.find(function(i){ return i.id === mm[2]; });
      if (!item) return;
      const ups = [];
      party.forEach(function(m){
        if (typeof memberUnlocked === 'function' && !memberUnlocked(m)) return;
        if (!gearCanEquip(m.id, item)) return;
        const eq = ((game.equippedGear || {})[m.id] || {})[item.slot];
        const d = score(item, m.id) - score(eq, m.id);
        if (d > 0.4) ups.push({name: m.name, d: Math.round(d*10)/10});
      });
      ups.sort(function(a, b){ return b.d - a.d; });
      const left = row.firstElementChild;
      if (!left) return;
      left.insertAdjacentHTML('beforeend', ups.length
        ? '<div class="gear-shop-tag up">⬆ Upgrade for ' + ups.slice(0, 3).map(function(u){ return esc(u.name) + ' ' + fmt(u.d); }).join(', ') + (ups.length > 3 ? ' +' + (ups.length - 3) + ' more' : '') + '</div>'
        : '<div class="gear-shop-tag none">No one needs this right now</div>');
    });
    // Summary panel.
    const old = document.getElementById('gearUpgradeSummary');
    if (old) old.remove();
    const rows = summary().filter(function(r){ return r.owned || r.shop || r.empty; });
    let html = '<div class="panel" id="gearUpgradeSummary"><div class="panel-title">🔎 Upgrade Check</div>';
    if (!rows.length) html += '<div class="gus-row">✓ Everyone is wearing the best gear available to them right now.</div>';
    else {
      html += '<div class="gus-row" style="opacity:.75;">Role-weighted: a ▲ number is how much stronger the new piece is for that person. Green means you already own it.</div>';
      rows.forEach(function(r){
        html += '<div class="gus-row"><b>' + esc(r.member.name) + '</b>' +
          (r.owned ? ' <span class="gear-chip own">⬆ ' + r.owned + ' owned to equip</span>' : '') +
          (r.shop ? ' <span class="gear-chip shop">🛒 ' + r.shop + ' in shops</span>' : '') +
          (r.empty ? ' <span class="gear-chip shop">' + r.empty + ' empty slot' + (r.empty > 1 ? 's' : '') + ' you can fill</span>' : '') + '</div>';
      });
    }
    html += '</div>';
    roster.insertAdjacentHTML('beforebegin', html);
  }

  // Quick buy from the suggestion on a slot: buys the piece from the shop and, if a member is given, equips it straight away.
  window.quickBuyGear = function(traderId, itemId, memberId){
    const before = (game.equipmentInventory || []).length, gold = game.gold || 0;
    if (typeof buyEquipment === 'function') buyEquipment(traderId, itemId);
    if ((game.equipmentInventory || []).length <= before || (game.gold || 0) >= gold) return;   // the purchase did not go through
    if (!memberId) return;
    const idx = (game.equipmentInventory || []).length - 1;
    if (typeof equipGear === 'function') equipGear(memberId, idx);
  };

  const oldRender = window.renderEquipment;
  window.renderEquipment = function(){
    if (oldRender) oldRender.apply(this, arguments);
    try { decorate(); } catch(e) { if (window.console) console.warn('equipment upgrade hints failed', e); }
  };

  // Badge on the Equipment nav button: number of owned upgrades waiting.
  function paintNav(){
    if (typeof game === 'undefined' || !game || typeof gameSessionActive === 'undefined' || !gameSessionActive) return;
    ensureStyle();
    let n = 0;
    try {
      const shop = [];   // owned items only: don't nag about shop stock
      partyList().forEach(function(m){
        if (typeof memberUnlocked === 'function' && !memberUnlocked(m)) return;
        visibleSlots(m.id).forEach(function(slot){ if (analyse(m.id, slot, shop).ownedBest) n++; });
      });
    } catch(e) { n = 0; }
    document.querySelectorAll('.nav-btn[onclick*="goScreen(\'equipment\')"]').forEach(function(el){
      if (n > 0) el.setAttribute('data-ct-up', n > 9 ? '9+' : String(n)); else el.removeAttribute('data-ct-up');
    });
  }
  window.paintEquipmentNavBadge = paintNav;
  const oldUpdateUI = window.updateUI;
  if (typeof oldUpdateUI === 'function') {
    window.updateUI = function(){
      const r = oldUpdateUI.apply(this, arguments);
      try { paintNav(); } catch(e) {}
      return r;
    };
  }
})();
