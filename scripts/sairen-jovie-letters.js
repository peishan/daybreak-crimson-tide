(function(){
  // -------------------------------------------------------------------
  // SAIREN & JOVIE -- LETTERS (draft addition, for review). Crimson
  // Horizon Ch.087 ("A Letter with No Report in It") keeps the letter
  // Sairen writes to Jovie; it is shown in the Bonds tab. Ch.083 sets it
  // up ("I'll write") and Ch.090 pays it off in person (Jovie got it).
  // There is no written reply in the outline, so none is invented here.
  // -------------------------------------------------------------------
  const CLIFFSIDE_LETTER = "Jovie,\n\nThe harbor sits under terraced gardens, and the market is built up the cliff on one long stair. I counted the steps twice and got two different numbers. The view from the top is worth both counts.\n\nThere is a stall near the third landing that sells dried fruit by the scoop. You would stop there first, and you would be right to. You'd rather choose for yourself, so I bought only one scoop to carry back.\n\nThe voyage is going well. I'll write again.\n\nSairen";

  window.recordSairenLetter = function(){
    game.sairenJovieLetters = game.sairenJovieLetters || [];
    if (game.sairenJovieLetters.some(function(l){ return l.id === 'cliffside'; })) return;
    game.sairenJovieLetters.push({ id: 'cliffside', from: 'Sairen', to: 'Jovie', day: game.day || 0, place: 'Terrace Harbor', text: CLIFFSIDE_LETTER });
  };

  function panelHtml(){
    const letters = game.sairenJovieLetters || [];
    if (!letters.length) return '';
    let html = '<div class="panel-title" style="margin-top:14px;">✉️ Letters — Sairen &amp; Jovie</div><article class="quest-item">';
    letters.slice().reverse().forEach(function(l){
      html += '<details style="margin-bottom:6px;"><summary style="cursor:pointer;font-size:.82rem;">' + esc(l.from) + ' to ' + esc(l.to) + ' · Day ' + l.day + (l.place ? ' · ' + esc(l.place) : '') + '</summary>' +
        '<div style="font-size:.78rem;opacity:.85;line-height:1.5;margin-top:6px;white-space:pre-line;">' + esc(l.text) + '</div></details>';
    });
    return html + '</article>';
  }

  const oldRenderBondsTabForLetters = window.renderBondsTab;
  window.renderBondsTab = function(){
    if (oldRenderBondsTabForLetters) oldRenderBondsTabForLetters.apply(this, arguments);
    const el = document.getElementById('ft-tab-bonds');
    if (!el) return;
    el.insertAdjacentHTML('beforeend', panelHtml());
  };
})();
