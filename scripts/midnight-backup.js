(function(){
  // -------------------------------------------------------------------
  // MIDNIGHT AUTO-BACKUP. San lost the login streak (and presumably some
  // real progress) to a bad update where the only recovery available was
  // an older GitHub save. Two things requested: a daily JSON download,
  // and a daily Gist push — both "at midnight."
  //
  // Important, honest caveat: this is a browser PWA with no server and no
  // real background process. It genuinely cannot fire at exactly 00:00
  // while the app is closed — nothing client-side can. What it actually
  // does is check, every time the app is open (same pattern already used
  // for the daily login streak's realDateKey()/gap check), whether
  // today's backup has already happened; if not, it runs immediately.
  // In practice this means "the first time you open the app on a new
  // calendar day," not a true midnight timer. Flagging this clearly
  // rather than overpromising a guarantee this environment can't keep.
  //
  // Reuses the existing exportSave() (JSON download) and pushToGist()
  // (Gist push, already a fully self-contained, reusable async function)
  // rather than rebuilding either. Distinct from the existing 3-minute-
  // throttled ctAutoBackup() in safety-and-fixes.js, which fires on every
  // saveGame() during active play — this is a separate, once-per-day
  // cadence layered on top, not a replacement.
  // -------------------------------------------------------------------

  function midnightBackupState(){
    game.midnightBackup = game.midnightBackup || { lastDate: null };
    return game.midnightBackup;
  }
  window.midnightBackupState = midnightBackupState;

  window.checkMidnightBackup = function(){
    if (typeof realDateKey !== 'function') return;
    const today = realDateKey();
    const state = midnightBackupState();
    if (state.lastDate === today) return; // already ran today
    state.lastDate = today;

    // 1) JSON download — always attempted, no credentials required.
    try {
      if (typeof exportSave === 'function') {
        exportSave();
        logEvent('💾 Daily backup: save file downloaded.', 'good');
      }
    } catch(e) { console.error('[MidnightBackup] JSON export failed:', e); }

    // 2) Gist push — only if San has already saved a GitHub token via the
    // existing manual Gist UI. Silently skipped (not an error toast) if
    // not set up, since this is an optional layer on top of the JSON
    // download, not a required one.
    try {
      if (typeof loadGistCreds === 'function' && typeof pushToGist === 'function') {
        const creds = loadGistCreds();
        if (creds && creds.token) {
          pushToGist().then(function(){
            logEvent('☁️ Daily backup: pushed to Gist.', 'good');
          }).catch(function(e){
            console.error('[MidnightBackup] Gist push failed:', e);
          });
        }
      }
    } catch(e) { console.error('[MidnightBackup] Gist push threw synchronously:', e); }

    if (typeof saveGameQuiet === 'function') saveGameQuiet();
  };

  const oldRenderMainGoalForMidnightBackup = window.renderMainGoal;
  window.renderMainGoal = function(){
    if (oldRenderMainGoalForMidnightBackup) oldRenderMainGoalForMidnightBackup();
    window.checkMidnightBackup();
  };
})();
