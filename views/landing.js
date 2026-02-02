import { layout } from './layout.js';

export function landingPage(profile = null) {
  const content = `
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-8">
    <div class="text-center max-w-3xl">
      <div class="text-7xl mb-4">🦞</div>
      <h1 class="logo-text text-4xl md:text-5xl text-gray-800 mb-3">
        Lobster<span class="text-lobster-600">Sandbox</span>
      </h1>
      <p class="text-xl text-gray-600 mb-2 font-body font-medium">Try OpenClaw safely in a sandbox.</p>
      <p class="text-lg text-gray-500 mb-8 font-body">Safe Mode by default. If it breaks, you wipe it.</p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <a href="/setup" class="inline-flex items-center justify-center px-8 py-4 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
          🚀 Start Setup
        </a>
        <a href="/openclaw" class="inline-flex items-center justify-center px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
          🎛 Open Control UI
        </a>
        <a href="/status" class="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl border border-gray-200">
          📊 View Status
        </a>
      </div>
      
      <!-- Safety Checklist -->
      <div class="card p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-display font-bold text-gray-800 text-lg flex items-center gap-2">
            <span class="text-xl">🛡️</span> Safety Checklist
          </h2>
          <div class="flex items-center gap-2">
            <span id="copy-checklist-result" class="text-xs text-green-600 hidden"></span>
            <button onclick="copyChecklist()" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors">
              📋 Copy Checklist
            </button>
          </div>
        </div>
        <p class="text-sm text-gray-500 mb-4 text-center">LobsterSandbox enforces these protections by default:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Auth required for protected routes</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">CSRF enforced on POST routes</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Origin and Referer validation on POST</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">WebSocket upgrades require valid session</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Gateway binds to loopback only</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Gateway reachable only through reverse proxy</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Kill switch available</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Wipe requires typed WIPE plus password</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Power Mode requires typed POWER</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Session idle timeout enforced</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg md:col-span-2 md:justify-center">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Session max lifetime enforced</span>
          </div>
        </div>
      </div>
      
      <script>
        async function copyChecklist() {
          const checklist = \`LobsterSandbox Safety Checklist
Auth required for protected routes
CSRF enforced on POST routes
Origin and Referer validation on POST
WebSocket upgrades require a valid session
Gateway binds to loopback only
Gateway reachable only through reverse proxy
Kill switch available
Wipe requires typed WIPE plus password
Power Mode requires typed POWER for channels and tools
Session idle timeout enforced
Session max lifetime enforced\`;
          try {
            await navigator.clipboard.writeText(checklist);
            const result = document.getElementById('copy-checklist-result');
            result.textContent = '✓ Copied!';
            result.classList.remove('hidden');
            setTimeout(() => result.classList.add('hidden'), 2000);
          } catch (err) {
            alert('Copy failed: ' + err.message);
          }
        }
      </script>
      
      <!-- What is this -->
      <div class="card p-6 text-left">
        <h2 class="font-display font-semibold text-gray-800 mb-2 text-lg">What is LobsterSandbox?</h2>
        <p class="text-gray-600 text-sm mb-4 leading-relaxed">
          LobsterSandbox is the safe on-ramp for trying OpenClaw. It provides safe defaults, guided separation for your accounts, 
          and a one-click reset if anything goes wrong. Perfect for first-time users who want to join the AI agent party without getting wrecked.
        </p>
        <div class="flex flex-wrap gap-4 text-sm">
          <a href="/profile" class="text-lobster-600 hover:text-lobster-700 font-medium">🛡️ Choose Safety Profile</a>
          <a href="/status" class="text-gray-600 hover:text-gray-700 font-medium">📊 System Status</a>
          <a href="https://docs.openclaw.ai/" target="_blank" class="text-gray-500 hover:text-gray-700">Documentation &rarr;</a>
        </div>
      </div>
      
      ${profile ? `
      <div class="mt-4 text-sm text-gray-500">
        Current profile: <span class="font-medium ${profile === 'safe' ? 'text-green-600' : 'text-purple-600'}">${profile === 'safe' ? '🛡️ Safe Mode' : '⚡ Power Mode'}</span>
        <a href="/profile" class="ml-2 text-lobster-600 hover:underline">Change</a>
      </div>
      ` : ''}
    </div>
  </div>
  `;
  
  return layout('Home', content);
}
