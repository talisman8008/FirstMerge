chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'REFRESH_TOKEN') {
    handleTokenRefresh().then(sendResponse);
    return true; // Keep the message channel open for the async response
  }
});

async function handleTokenRefresh() {
  try {
    const data = await new Promise((resolve) => {
      chrome.storage.local.get(['fm_refresh_token', 'fm_supabase_url', 'fm_supabase_key'], resolve);
    });

    if (!data.fm_refresh_token || !data.fm_supabase_url || !data.fm_supabase_key) {
      console.warn('FirstMerge Extension: Missing tokens for refresh');
      return null;
    }

    const response = await fetch(`${data.fm_supabase_url}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': data.fm_supabase_key,
        'Authorization': `Bearer ${data.fm_supabase_key}`
      },
      body: JSON.stringify({
        refresh_token: data.fm_refresh_token
      })
    });

    if (!response.ok) {
      console.error('FirstMerge Extension: Token refresh failed', response.status);
      return null;
    }

    const json = await response.json();
    
    // Save the new tokens
    await new Promise((resolve) => {
      chrome.storage.local.set({
        fm_token: json.access_token,
        fm_refresh_token: json.refresh_token
      }, resolve);
    });

    console.log('FirstMerge Extension: Successfully refreshed access token in background!');
    return json.access_token;

  } catch (error) {
    console.error('FirstMerge Extension: Error during token refresh', error);
    return null;
  }
}
