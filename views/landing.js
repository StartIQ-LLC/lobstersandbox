import { layout } from './layout.js';

export function landingPage(options = {}) {
  const { profile = null, configured = false, loggedIn = false, gatewayRunning = false } = typeof options === 'object' && options !== null && !Array.isArray(options) ? options : { profile: options };
  
  const content = `
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-8">
    <div class="text-center max-w-3xl">
      <img src="/lobster-hero.png" alt="LobsterSandbox mascot" class="w-32 h-32 mx-auto mb-4" style="image-rendering: pixelated;">
      <h1 class="logo-text text-4xl md:text-5xl text-gray-800 mb-3">
        Lobster<span class="text-lobster-600">Sandbox</span>
      </h1>
      <p class="text-xl text-gray-600 mb-2 font-body font-medium">Try OpenClaw safely in a sandbox.</p>
      <p class="text-lg text-gray-500 mb-8 font-body">Safe Mode by default. If it breaks, you wipe it.</p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <a href="/setup" class="inline-flex items-center justify-center px-8 py-4 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
          🚀 Start Setup
        </a>
        ${configured ? `
        <a href="/openclaw" class="inline-flex items-center justify-center px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
          🎛 Open Control UI
        </a>
        ` : `
        <span class="inline-flex items-center justify-center px-8 py-4 bg-gray-300 text-gray-500 font-semibold rounded-xl cursor-not-allowed" title="Complete setup first">
          🎛 Complete setup first
        </span>
        `}
        <a href="/status" class="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl border border-gray-200">
          📊 View Status
        </a>
      </div>
      
      <!-- Safety Checklist - Simplified -->
      <div class="card p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-display font-bold text-gray-800 text-lg flex items-center gap-2">
            <span class="text-xl">🛡️</span> Safe by Default
          </h2>
        </div>
        <p class="text-sm text-gray-500 mb-4 text-center">Your sandbox is protected from the start:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Protected actions require login</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">No public ports exposed</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Runs through secure proxy only</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Kill switch always available</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Wipe resets everything safely</span>
          </div>
          <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span class="text-green-500 font-bold">✓</span>
            <span class="font-medium">Sessions expire automatically</span>
          </div>
        </div>
        
        <!-- Technical Details Toggle -->
        <details class="mt-4">
          <summary class="text-xs text-gray-500 cursor-pointer hover:text-gray-700 text-center">Show technical details</summary>
          <div class="mt-3 pt-3 border-t border-gray-100">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-gray-500">Full security checklist:</span>
              <button onclick="copyChecklist()" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded transition-colors">
                📋 Copy
              </button>
            </div>
            <div class="grid grid-cols-1 gap-1 text-xs text-gray-600">
              <div class="flex items-center gap-2 px-2 py-1">
                <span class="text-green-500">✓</span> Auth required for protected routes
              </div>
              <div class="flex items-center gap-2 px-2 py-1">
                <span class="text-green-500">✓</span> CSRF enforced on POST routes
              </div>
              <div class="flex items-center gap-2 px-2 py-1">
                <span class="text-green-500">✓</span> Origin and Referer validation on POST
              </div>
              <div class="flex items-center gap-2 px-2 py-1">
                <span class="text-green-500">✓</span> WebSocket upgrades require valid session
              </div>
              <div class="flex items-center gap-2 px-2 py-1">
                <span class="text-green-500">✓</span> Gateway binds to loopback only
              </div>
              <div class="flex items-center gap-2 px-2 py-1">
                <span class="text-green-500">✓</span> Gateway reachable only through reverse proxy
              </div>
              <div class="flex items-center gap-2 px-2 py-1">
                <span class="text-green-500">✓</span> Kill switch available on every page
              </div>
              <div class="flex items-center gap-2 px-2 py-1">
                <span class="text-green-500">✓</span> Wipe requires typed WIPE plus password
              </div>
              <div class="flex items-center gap-2 px-2 py-1">
                <span class="text-green-500">✓</span> Power Mode requires typed POWER
              </div>
              <div class="flex items-center gap-2 px-2 py-1">
                <span class="text-green-500">✓</span> Session idle timeout enforced
              </div>
              <div class="flex items-center gap-2 px-2 py-1">
                <span class="text-green-500">✓</span> Session max lifetime enforced
              </div>
            </div>
          </div>
        </details>
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
            alert('Checklist copied!');
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
  
  return layout('Home', content, { loggedIn, gatewayRunning });
}
