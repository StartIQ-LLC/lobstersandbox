import { layout } from './layout.js';

export function profilePage(currentProfile = null) {
  const content = `
  <div class="min-h-screen flex items-center justify-center px-4 py-8">
    <div class="max-w-xl w-full">
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🦞</div>
        <h1 class="logo-text text-3xl text-gray-800 mb-2">Choose Your <span class="text-lobster-600">Safety Profile</span></h1>
        <p class="text-gray-500">How do you want to use LobsterSandbox?</p>
      </div>
      
      <div class="space-y-4 mb-8">
        <button onclick="selectProfile('safe')" class="profile-card w-full p-6 card text-left hover:ring-2 hover:ring-green-500 transition-all ${currentProfile === 'safe' ? 'ring-2 ring-green-500 bg-green-50' : ''}" data-profile="safe">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">🛡️</div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h2 class="font-display font-bold text-lg text-gray-800">Safe Mode</h2>
                <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Recommended</span>
              </div>
              <p class="text-sm text-gray-600 mb-3">Best for first-time users. Keeps things isolated and reversible.</p>
              <ul class="text-xs text-gray-500 space-y-1">
                <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Control UI only - no channels connected</li>
                <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Allowlist enabled by default</li>
                <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Approval required for actions</li>
                <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Kill Switch visible on every page</li>
                <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Easy wipe & reset anytime</li>
              </ul>
            </div>
          </div>
        </button>
        
        <button onclick="selectProfile('power')" class="profile-card w-full p-6 card text-left hover:ring-2 hover:ring-purple-500 transition-all ${currentProfile === 'power' ? 'ring-2 ring-purple-500 bg-purple-50' : ''}" data-profile="power">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">⚡</div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h2 class="font-display font-bold text-lg text-gray-800">Power Mode</h2>
              </div>
              <p class="text-sm text-gray-600 mb-3">For experienced users. Enables channels, still keeps secure defaults.</p>
              <ul class="text-xs text-gray-500 space-y-1">
                <li class="flex items-center gap-2"><span class="text-purple-500">✓</span> Channels enabled (WhatsApp, Telegram, Discord)</li>
                <li class="flex items-center gap-2"><span class="text-purple-500">✓</span> Fewer confirmation prompts</li>
                <li class="flex items-center gap-2"><span class="text-purple-500">✓</span> Still keeps loopback + token security</li>
                <li class="flex items-center gap-2"><span class="text-purple-500">✓</span> Kill Switch always available</li>
              </ul>
            </div>
          </div>
        </button>
      </div>
      
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p class="text-amber-800 text-sm flex items-start gap-2">
          <span class="text-lg">💡</span>
          <span><strong>Tip:</strong> You can switch profiles anytime from the Settings. Start with Safe Mode if you're new to AI agents.</span>
        </p>
      </div>
      
      <div id="profile-result" class="text-sm text-center mb-4"></div>
      
      <div class="text-center text-sm text-gray-500">
        <a href="/" class="hover:text-gray-700">&larr; Back to home</a>
      </div>
    </div>
  </div>
  
  <script>
    async function selectProfile(profile) {
      document.querySelectorAll('.profile-card').forEach(card => {
        card.classList.remove('ring-2', 'ring-green-500', 'ring-purple-500', 'bg-green-50', 'bg-purple-50');
      });
      
      const selectedCard = document.querySelector('[data-profile="' + profile + '"]');
      if (profile === 'safe') {
        selectedCard.classList.add('ring-2', 'ring-green-500', 'bg-green-50');
      } else {
        selectedCard.classList.add('ring-2', 'ring-purple-500', 'bg-purple-50');
      }
      
      try {
        const csrfToken = await getCsrfToken();
        if (!csrfToken) { showError('Session expired. Please log in again.'); return; }
        const res = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
          body: JSON.stringify({ profile, csrf_token: csrfToken })
        });
        const data = await res.json();
        
        if (data.success) {
          const resultDiv = document.getElementById('profile-result');
          resultDiv.className = 'text-sm text-center mb-4 text-green-600';
          resultDiv.textContent = (profile === 'safe' ? '🛡️ Safe Mode' : '⚡ Power Mode') + ' activated! Redirecting...';
          setTimeout(() => {
            window.location.href = '/status';
          }, 1000);
        } else {
          showError(data.error || 'Failed to save profile');
        }
      } catch (err) {
        showError('Error: ' + err.message);
      }
    }
    
    function showError(msg) {
      const resultDiv = document.getElementById('profile-result');
      resultDiv.className = 'text-sm text-center mb-4 text-red-600';
      resultDiv.textContent = msg;
    }
  </script>
  `;
  
  return layout('Choose Profile', content, { showAssistant: true });
}
