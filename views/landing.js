import { layout } from './layout.js';

export function landingPage(options = {}) {
  const { profile = null, configured = false, loggedIn = false, gatewayRunning = false } = typeof options === 'object' && options !== null && !Array.isArray(options) ? options : { profile: options };
  
  const content = `
  <div class="min-h-screen flex flex-col items-center px-4 py-12 md:py-16">
    <div class="w-full max-w-5xl">
      
      <!-- SECTION 1: Hero (above the fold) -->
      <div class="text-center mb-20">
        <div class="text-7xl mb-6">🦞</div>
        <h1 class="logo-text text-4xl md:text-5xl text-gray-800 mb-4">
          Lobster<span class="text-lobster-600">Sandbox</span>
        </h1>
        
        <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-6 mt-10">
          Try OpenClaw Without Risking Your Real Accounts
        </h2>
        <p class="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-body leading-relaxed">
          Your safe playground for AI agents. Use throwaway accounts, set a spending cap, and wipe everything with one click if anything feels off.
        </p>
        
        <!-- Trust Icons Row - Horizontal on desktop with pill styling -->
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12">
          <div class="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
            <span class="text-lg">🔒</span>
            <span class="font-medium text-gray-700 text-sm">Real accounts untouched</span>
          </div>
          <div class="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
            <span class="text-lg">💰</span>
            <span class="font-medium text-gray-700 text-sm">You control spending</span>
          </div>
          <div class="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
            <span class="text-lg">🗑️</span>
            <span class="font-medium text-gray-700 text-sm">One-click fresh start</span>
          </div>
        </div>
        
        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a href="/setup" class="inline-flex items-center justify-center px-8 py-4 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl text-lg">
            🚀 Launch Your Sandbox
          </a>
          <a href="/guide" class="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-600 font-medium rounded-xl transition-all border border-gray-200 text-base">
            📖 Read the Burner Stack Guide
          </a>
        </div>
        
        <button onclick="openShareModal()" class="text-sm text-gray-400 hover:text-lobster-500 mt-2 mb-4 transition-colors">📤 Share with a friend</button>
        
        ${configured ? `
        <div class="mt-6">
          <a href="/openclaw" class="inline-flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
            🎛 Open Control UI
          </a>
        </div>
        ` : ''}
      </div>
      
      <!-- Community Counter -->
      <div class="text-center mb-16" id="sandbox-counter-section">
        <div class="flex items-center justify-center gap-3">
          <span class="text-3xl">🦞</span>
          <span id="sandbox-count-display" class="text-4xl font-display font-bold text-gray-800">0</span>
          <span class="text-lg text-gray-500">sandboxes launched</span>
        </div>
      </div>
      
      <script>
        async function loadSandboxCount() {
          try {
            const res = await fetch('/api/sandbox-count');
            if (res.ok) {
              const data = await res.json();
              animateCounter(data.count);
            }
          } catch {}
        }
        
        function animateCounter(target) {
          const el = document.getElementById('sandbox-count-display');
          const duration = 1000;
          const start = Date.now();
          
          function tick() {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased).toLocaleString();
            
            if (progress < 1) requestAnimationFrame(tick);
          }
          
          requestAnimationFrame(tick);
        }
        
        document.addEventListener('DOMContentLoaded', loadSandboxCount);
      </script>
      
      <!-- SECTION 2: Why LobsterSandbox? (3-column cards with proper spacing) -->
      <div class="mb-40">
        <h2 class="text-2xl font-display font-bold text-gray-800 text-center mb-4">Why LobsterSandbox?</h2>
        <p class="text-gray-500 text-center mb-16 max-w-lg mx-auto">The safe way to explore AI agents without the risk</p>
        
        <!-- Cards with ~quarter inch gaps (gap-14 = 56px) and constrained width -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 max-w-4xl mx-auto px-4">
          
          <!-- Card 1: The Problem -->
          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="text-2xl mb-4">😰</div>
            <h3 class="font-display font-semibold text-gray-800 text-sm mb-3">The Problem</h3>
            <p class="text-gray-500 text-sm leading-relaxed">
              OpenClaw needs access to your real accounts. One wrong move and it's reading your real Gmail.
            </p>
          </div>
          
          <!-- Card 2: The Solution -->
          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="text-2xl mb-4">🦞</div>
            <h3 class="font-display font-semibold text-gray-800 text-sm mb-3">The Solution</h3>
            <p class="text-gray-500 text-sm leading-relaxed">
              Use throwaway accounts only. Your real email and billing stay completely separate.
            </p>
          </div>
          
          <!-- Card 3: The Safety Net -->
          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="text-2xl mb-4">🔄</div>
            <h3 class="font-display font-semibold text-gray-800 text-sm mb-3">The Safety Net</h3>
            <p class="text-gray-500 text-sm leading-relaxed">
              Made a mistake? Kill Switch stops everything. Wipe gives you a fresh start in seconds.
            </p>
          </div>
        </div>
      </div>
      
      <!-- SECTION 3: Built for People Like You (Social Proof Quotes) -->
      <div class="mb-32">
        <h2 class="text-2xl font-display font-bold text-gray-800 text-center mb-4">Built for People Like You</h2>
        <p class="text-gray-500 text-center mb-16 max-w-lg mx-auto">Real concerns from real people. LobsterSandbox is the answer.</p>
        
        <!-- Testimonial cards in organized boxes with quarter inch gaps -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 max-w-4xl mx-auto px-4">
          
          <!-- Quote 1 - Clean box container -->
          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="text-2xl text-lobster-300 font-serif leading-none mb-3">"</div>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              I don't want to be turned into digital mincemeat by hackers.
            </p>
            <p class="text-xs text-gray-400 mb-3">— Tech founders on Twitter/X</p>
            <p class="text-sm font-medium text-lobster-600">Your real accounts stay separate.</p>
          </div>
          
          <!-- Quote 2 - Clean box container -->
          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="text-2xl text-lobster-300 font-serif leading-none mb-3">"</div>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              AI taking control of everything is too scary.
            </p>
            <p class="text-xs text-gray-400 mb-3">— Hacker News, February 2026</p>
            <p class="text-sm font-medium text-lobster-600">Safe Mode asks before acting.</p>
          </div>
          
          <!-- Quote 3 - Clean box container -->
          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="text-2xl text-lobster-300 font-serif leading-none mb-3">"</div>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              Do not install on your primary computer.
            </p>
            <p class="text-xs text-gray-400 mb-3">— Security researchers</p>
            <p class="text-sm font-medium text-lobster-600">Sandbox first, real setup later.</p>
          </div>
        </div>
      </div>
      
      <!-- CTA Section - Half inch gap below to Technical Safety box -->
      <div class="text-center mb-12">
        <a href="/setup" class="inline-flex items-center justify-center px-8 py-4 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl text-base">
          🚀 Ready to try it safely? Launch Your Sandbox
        </a>
      </div>
      
      <!-- SECTION 4: Technical Safety Details (Collapsible) -->
      <div class="card p-6 mb-8">
        <details>
          <summary class="flex items-center gap-2 cursor-pointer font-display font-bold text-gray-800 text-lg">
            <span class="text-xl">🛡️</span> Technical Safety Details (for the curious)
          </summary>
          <div class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-sm text-gray-500 mb-4 text-center">Your sandbox is protected from the start:</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
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
            
            <details class="mt-4">
              <summary class="text-xs text-gray-500 cursor-pointer hover:text-gray-700 text-center">Show full security checklist</summary>
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
      
      <!-- SECTION 5: What is LobsterSandbox? -->
      <div class="card p-6 text-left mb-8">
        <h2 class="font-display font-semibold text-gray-800 mb-3 text-lg">What is LobsterSandbox?</h2>
        <p class="text-gray-600 text-sm leading-relaxed">
          LobsterSandbox is the safe on-ramp for trying OpenClaw. It guides you through setting up throwaway accounts, enforces safe defaults, and gives you a one-click escape hatch if anything goes wrong. You bring a fresh email and an API key — we handle the rest. Perfect for anyone who wants to join the AI agent revolution without risking their real digital life.
        </p>
        <div class="flex flex-wrap gap-4 text-sm mt-4">
          <a href="/profile" class="text-lobster-600 hover:text-lobster-700 font-medium">🛡️ Choose Safety Profile</a>
          <a href="/deploy" class="text-lobster-600 hover:text-lobster-700 font-medium">🚀 Deploy your own sandbox</a>
          <a href="/compare" class="text-gray-600 hover:text-gray-700 font-medium">📊 See how we compare</a>
          <a href="/status" class="text-gray-600 hover:text-gray-700 font-medium">🔧 System Status</a>
          <a href="https://docs.openclaw.ai/" target="_blank" class="text-gray-500 hover:text-gray-700">Documentation &rarr;</a>
        </div>
      </div>
      
      ${profile ? `
      <div class="text-center text-sm text-gray-500">
        Current profile: <span class="font-medium ${profile === 'safe' ? 'text-green-600' : 'text-purple-600'}">${profile === 'safe' ? '🛡️ Safe Mode' : '⚡ Power Mode'}</span>
        <a href="/profile" class="ml-2 text-lobster-600 hover:underline">Change</a>
      </div>
      ` : ''}
    </div>
  </div>
  `;
  
  return layout('Home', content, { loggedIn, gatewayRunning });
}
