(function(){
  // -------------------------------------------------------------------
  // THE COLD SPRING -- INVITATIONS.
  //
  // The Cold Spring is the Fountain of Youth (Arc XLII Ch.27). The existing
  // Fountain actions (raid-mode.js: clear the Guardian's Trial with the
  // party fielded, or "Send to the Fountain" for Fair Tide's roster)
  // cover the party and the roster, and nothing else: guests, allies and
  // visitors are not party members or roster members, and Arc XLII's own
  // note keeps the Fountain's mechanics off them. There was no permission
  // for the Tribute team, their family and friends, or visitors.
  //
  // This is that permission, as its own action, separate from sending a
  // resident: "San invites <name> to the Cold Spring 😈", with Joel's
  // reaction 😡. It is flavour and story: it records who San has invited
  // (game.coldSpring.invites), logs it, writes it to the Fair Tide
  // Chronicle, and lifts a resident's happiness and bond a little. It does
  // NOT touch game.rejuvenated, so no stat bonus and no "A Gift Shared"
  // achievement progress; what the spring means for the story stays for
  // later arcs to say. window.coldSpringInvited(id) lets a later chapter
  // read it.
  //
  // Permitted: the Tribute team (Jade, Devon, Sky, Levi, Sally), their
  // family and friends (Hugh, Sera, Adrian, Eve, Rheon, Mirelle, Aster,
  // Fen, Roc, Delilah). Jenika is not on the list (she keeps to the medical
  // team in the chapters). Each can be invited once, and only while they are
  // at Fair Tide. Opens once Arc XLII Ch.27 has revealed what the spring is.
  // -------------------------------------------------------------------

  const PERMITTED = [
    {id:'jade', team:true}, {id:'devon', team:true}, {id:'sky', team:true}, {id:'levi', team:true}, {id:'sally', team:true},
    {id:'hugh'}, {id:'sera'}, {id:'adrian'}, {id:'eve'}, {id:'rheon'}, {id:'mirelle'}, {id:'aster'}, {id:'fen'}, {id:'roc'}, {id:'delilah'}
  ];
  window.COLD_SPRING_PERMITTED = PERMITTED;

  function state(){
    if (!game.coldSpring) game.coldSpring = {};
    if (!game.coldSpring.invites) game.coldSpring.invites = {};
    return game.coldSpring;
  }
  window.coldSpringInvited = function(id){ return !!(typeof game !== 'undefined' && game && game.coldSpring && game.coldSpring.invites && game.coldSpring.invites[id]); };

  function open(){ return !!(game.comicProgress42 && game.comicProgress42[27]); }
  function cast(id){
    return (window.TRIBUTE_CROSSOVER_CAST || []).find(function(c){ return c.id === id; }) ||
      ({jade:{name:'Jade',icon:'👑'},devon:{name:'Devon',icon:'🛡️'},sky:{name:'Sky',icon:'🩺'},levi:{name:'Levi',icon:'🏹'},sally:{name:'Sally',icon:'😊'}})[id] ||
      {name:id.charAt(0).toUpperCase() + id.slice(1), icon:'👤'};
  }
  function rec(id){ return (typeof window.fairTideResidentsState === 'function') ? window.fairTideResidentsState()[id] : null; }
  function sequel(){ return !!(game.arc42Complete && game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[1]); }
  function chp(i){ return !!(game.comicProgressCrimsonHorizon && game.comicProgressCrimsonHorizon[i]); }

  // At Fair Tide right now?
  function present(p){
    const r = rec(p.id);
    if (r && r.status === 'resident') return true;                                   // visiting residents, Sera
    if (p.team) return !!(game.foundCompanions && game.foundCompanions[p.id] && game.location === 'fair_tide');
    if (p.id === 'fen') return sequel();                                              // at Fair Tide in the sequel
    if (p.id === 'aster') return chp(103);                                            // visits from Arc XI (Ch.101 on)
    return false;
  }
  function whoIsHere(){ return PERMITTED.filter(present); }

  window.inviteToColdSpring = function(id){
    if (!open()) return;
    const p = PERMITTED.find(function(x){ return x.id === id; });
    if (!p) { toast('Only the Tribute team, their family and visiting friends can be invited this way.'); return; }
    if (!present(p)) { toast(cast(id).name + ' is not at Fair Tide right now.'); return; }
    const st = state();
    if (st.invites[id]) { toast('San has already invited ' + cast(id).name + '.'); return; }
    st.invites[id] = {day: game.day || 0};
    const name = cast(id).name;
    const r = rec(id);
    if (r && typeof window.adjustResidentHappiness === 'function') { window.adjustResidentHappiness(id, 6); window.adjustResidentBond(id, 3); }
    else if (typeof window.addFairTideMood === 'function') window.addFairTideMood(2);
    const line = '♨️ San invites ' + name + ' to the Cold Spring 😈 · Joel 😡';
    logEvent(line, 'good');
    if (typeof window.recordChronicleEntry === 'function') window.recordChronicleEntry('San invited ' + name + ' to the Cold Spring. Joel had opinions.', '♨️');
    toast(line, 4200);
    if (typeof saveGameQuiet === 'function') saveGameQuiet();
    if (typeof window.renderFairTideHub === 'function') window.renderFairTideHub();
  };

  window.renderColdSpringPanel = function(){
    if (typeof game === 'undefined' || !game || !open()) return '';
    const here = whoIsHere();
    const st = state();
    let html = '<div class="panel-title" style="margin-top:16px;">♨️ The Cold Spring</div>' +
      '<p style="font-size:.78rem;opacity:.7;margin:0 0 8px;">The Fountain of Youth, by another name. The Tribute team, their family and visiting friends are not sent the way Fair Tide\'s roster is: San invites them. Joel has views.</p>';
    if (!here.length) return html + '<div class="story-chip">Nobody from the Tribute side is at Fair Tide right now.</div>';
    html += here.map(function(p){
      const c = cast(p.id), inv = st.invites[p.id];
      return '<article class="quest-item"><strong>' + c.icon + ' ' + esc(c.name) + '</strong> — ' +
        (inv ? '<span style="opacity:.8;">Invited on Day ' + inv.day + ' · San 😈 · Joel 😡</span>'
             : '<button class="btn btn-small" onclick="inviteToColdSpring(\'' + p.id + '\')">♨️ San invites ' + esc(c.name) + ' to the Cold Spring 😈</button>') +
        '</article>';
    }).join('');
    return html;
  };
})();
