// authSync.js - Injected into the FirstMerge web app to grab auth tokens and sync to chrome.storage
window.addEventListener("message", (event) => {
  try {
    // Prevent "Extension context invalidated" errors if the extension was reloaded
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) return;

    if (event.data.type === 'FM_AUTH_TOKEN' && event.data.token) {
      chrome.storage.local.set({ 
        fm_token: event.data.token,
        fm_refresh_token: event.data.refreshToken,
        fm_supabase_url: event.data.supabaseUrl,
        fm_supabase_key: event.data.supabaseKey
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('FirstMerge Extension Error:', chrome.runtime.lastError);
        } else {
          console.log('FirstMerge Extension: Auth token synced successfully!');
        }
      });
    } else if (event.data.type === 'FM_AUTH_LOGOUT') {
      chrome.storage.local.remove(['fm_token', 'fm_refresh_token', 'fm_supabase_url', 'fm_supabase_key'], () => {
        if (chrome.runtime.lastError) {
          console.error('FirstMerge Extension Error:', chrome.runtime.lastError);
        } else {
          console.log('FirstMerge Extension: Auth token cleared!');
        }
      });
    }
  } catch (error) {
    // If accessing chrome.runtime throws because the context is invalidated, silently catch it.
    // The user just needs to refresh the page to get the new valid context script.
  }
});
