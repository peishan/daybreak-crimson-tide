(function(){
  // -------------------------------------------------------------------
  // TUTORIAL TIPS. One-time, plain-language tips for systems the First Voyage Guide doesn't cover. Each one shows once per
  // save, the first time the player opens the screen it is about (or, for equipment, once they can afford something), and
  // waits for a quiet moment (no fight, no other popup). State: game.tipsSeen.
  //   equipment  the Equipment screen: traders, buying, equipping, selling
  //   crew       the Crew screen: who sails and who stays at Fair Tide, and who can't be sent home
  //   quests     the Tavern's Quest Board and the daily Bounty Board: gold and levels
  //   raids      the Archive's Raids (Arc XVII onward)
  // Saves already far past the early game skip the first three.
  // -------------------------------------------------------------------
  function seen(){ game.tipsSeen = game.tipsSeen || {}; return game.tipsSeen; }
  function lvl(){ try { return typeof level === 'function' ? level() : 1; } catch(e) { return 1; } }
  function busy(){
    const c = document.getElementById('combatScreen'), m = document.getElementById('modalOverlay');
    return !!((c && c.classList.contains('active')) || (m && m.classList.contains('active')));
  }
  function raidLevel(){
    try { const r = typeof window.getRaidById === 'function' ? window.getRaidById('guardian_trial') : null; return r ? r.unlockLevel : 235; } catch(e) { return 235; }
  }

  const TIPS = {
    equipment: {
      early: true, title: '💡 Tip: Buying Equipment',
      body: function(){ return 'Open <b>⚔️ Equipment</b> from the menu bar. The <b>traders</b> there sell weapons and armour for gold, and each trader opens at a certain level (a locked one shows the level it needs). New stock appears as you level up, so check back after each level.<br><br>' +
        'Press the gold price to buy. The item goes to your unequipped gear list, where each crew member who can use it has a button: press a name to <b>equip</b> it on them. Every item lists its stats and who it suits, and a piece made for one companion only fits that companion.<br><br>' +
        'Spare gear can be sold back with <b>💰 Sell</b>. Gear is the fastest way to get stronger between levels, and gold comes from trading, quests and bounties.'; },
      button: { text: 'Open Equipment', screen: 'equipment' }
    },
    crew: {
      early: true, title: '💡 Tip: Who Sails and Who Stays Home',
      body: function(){ return 'Open <b>👥 Crew</b> to choose who goes out with you. Each card has a button: <b>⚔️ Field for the Voyage</b> puts that person in the fighting party, and <b>⚓ Send to Fair Tide</b> lets them stay home and rest.<br><br>' +
        'Your ship can only field so many at once (the Crew screen shows the count, and a bigger ship takes more). <b>San</b> and her familiar <b>Soel</b> never count against it.<br><br>' +
        'Some crew are <b>essential to the story</b> and cannot be sent to Fair Tide: San always sails, and <b>Joel</b> and <b>Aisyah</b> stay aboard too, along with anyone else a story arc needs. Their card says so where the button would be.'; },
      button: null
    },
    quests: {
      early: true, title: '💡 Tip: Quests and Bounties',
      body: function(){ return 'The fastest way to money and levels is to work the boards.<br><br>' +
        'The <b>🎯 Quest Board</b> on the Tavern screen holds standing contracts: deliver goods, defeat certain enemies, and similar. They stay until you finish them, and pay <b>gold and XP</b>. The <b>🎯 Quests</b> tab on the side keeps count of your progress.<br><br>' +
        'The <b>Bounty Board</b> at the bottom of the Port screen is the daily one: fresh jobs each day, again for gold and XP.<br><br>' +
        'Trade as you sail and pick up contracts for the ports you are heading to. Money from one trip then pays for gear, potions and the Tavern.'; },
      button: null
    },
    raids: {
      early: false, title: '💡 Tip: Raids at the Archive',
      body: function(){ return 'Now that the Archive is open, look at the bottom of its screen: <b>⏳ Raids</b>.<br><br>' +
        'A raid is a run of boss fights, one stage after the next. You recover only a little between stages, and there is no saving in the middle, so go in healed and stocked with potions.<br><br>' +
        'Each raid opens at a set level (the first, <b>The Guardian\'s Trial</b>, at <b>Level ' + raidLevel() + '</b>), and the cards show what they need. The first clear pays big XP and gold; a cleared raid can be run again with <b>🔁 Train</b> for smaller rewards.'; },
      button: null
    }
  };

  let pending = {};
  function offer(id, tries){
    try {
      if (typeof gameSessionActive === 'undefined' || !gameSessionActive) return;
      const t = TIPS[id]; if (!t || seen()[id]) return;
      if (t.early && lvl() >= 120) { seen()[id] = true; return; }
      if (busy() || typeof showModal !== 'function') {
        if ((tries || 0) < 6 && !pending[id]) { pending[id] = true; setTimeout(function(){ pending[id] = false; offer(id, (tries || 0) + 1); }, 1500); }
        return;
      }
      seen()[id] = true;
      if (typeof saveGameQuiet === 'function') saveGameQuiet();
      const buttons = [{ text: 'Got it', action: function(){ if (typeof closeModal === 'function') closeModal(); } }];
      if (t.button) buttons.unshift({ text: t.button.text, action: function(){ if (typeof closeModal === 'function') closeModal(); if (typeof goScreen === 'function') goScreen(t.button.screen); } });
      showModal(t.title, t.body(), buttons);
    } catch(e) {}
  }
  window.showTutorialTip = offer;

  const oldGo = window.goScreen;
  if (typeof oldGo === 'function') {
    window.goScreen = function(name){
      const r = oldGo.apply(this, arguments);
      try {
        if (name === 'equipment') setTimeout(function(){ offer('equipment'); }, 600);
        else if (name === 'party') setTimeout(function(){ if (typeof getActiveParty === 'function' && getActiveParty().length >= 3) offer('crew'); }, 600);
        else if (name === 'tavern') setTimeout(function(){ offer('quests'); }, 700);
        else if (name === 'archive') setTimeout(function(){ if (typeof window.archiveUnlocked === 'function' && window.archiveUnlocked()) offer('raids'); }, 700);
      } catch(e) {}
      return r;
    };
  }

  // Equipment nudge: the first time they are at port with the gold to buy something.
  const oldUpdate = window.updateUI;
  if (typeof oldUpdate === 'function') {
    window.updateUI = function(){
      const r = oldUpdate.apply(this, arguments);
      try {
        if (!seen().equipment && typeof gameSessionActive !== 'undefined' && gameSessionActive && lvl() >= 4 && lvl() < 120 && game.gold >= 150) {
          const port = document.getElementById('portScreen');
          if (port && port.classList.contains('active')) setTimeout(function(){ offer('equipment'); }, 1200);
        }
      } catch(e) {}
      return r;
    };
  }
})();
