document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('auth-status');

  chrome.storage.local.get(['fm_token'], (result) => {
    if (result.fm_token) {
      statusEl.textContent = 'Connected to FirstMerge';
      statusEl.style.color = '#6B71B8'; // accent blue
    } else {
      statusEl.textContent = 'Open FirstMerge and log in to activate the extension.';
      statusEl.style.color = '#D87575'; // accent red
    }
  });
});
