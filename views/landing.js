import { layout } from './layout.js';

export function landingPage(options = {}) {
  const { profile = null, configured = false, loggedIn = false, gatewayRunning = false } = typeof options === 'object' && options !== null && !Array.isArray(options) ? options : { profile: options };
  
  const content = `
  <div class="min-h-screen flex flex-col items-center px-4 py-8">
    <div class="w-full max-w-5xl">
      
      <!-- SECTION 1: Hero (above the fold) -->
      <div class="text-center mb-16">
        <div class="text-7xl mb-4">🦞</div>
        <h1 class="logo-text text-4xl md:text-5xl text-gray-800 mb-3">
          Lobster<span class="text-lobster-600">Sandbox</span>
        </h1>
        
        <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-4 mt-8">
          Try OpenClaw Without Risking Your Real Accounts
        </h2>
        <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-body leading-relaxed">
          Your safe playground for AI agents. Use throwaway accounts, set a spending cap, and wipe everything with one click if anything feels off.
        </p>
        
        <!-- Trust Icons Row - Unified Badge Strip -->
        <div class="flex justify-center mb-10">
          <div class="inline-flex flex-col md:flex-row bg-gradient-to-r from-lobster-50 to-orange-50 border border-lobster-100 rounded-2xl px-6 py-4 md:divide-x md:divide-lobster-100">
            <div class="flex flex-col items-center text-center px-4 py-2 md:py-0">
              <span class="text-3xl mb-1">🔒</span>
              <span class="font-bold text-gray-800 text-sm">Real accounts untouched</span>
            </div>
            <div class="flex flex-col items-center text-center px-4 py-2 md:py-0 border-t border-lobster-100 md:border-t-0">
              <span class="text-3xl mb-1">💰</span>
              <span class="font-bold text-gray-800 text-sm">You control spending</span>
            </div>
            <div class="flex flex-col items-center text-center px-4 py-2 md:py-0 border-t border-lobster-100 md:border-t-0">
              <span class="text-3xl mb-1">🗑️</span>
              <span class="font-bold text-gray-800 text-sm">One-click fresh start</span>
            </div>
          </div>
        </div>
        
        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a href="/setup" class="inline-flex items-center justify-center px-8 py-4 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl text-lg">
            🚀 Launch Your Sandbox
          </a>
          <a href="/guide" class="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl border border-gray-200 text-lg">
            📖 Read the Burner Stack Guide
          </a>
        </div>
        
        <!-- Social Proof -->
        <p class="text-sm text-gray-500">Join 117K+ people exploring OpenClaw — safely.</p>
        
        ${configured ? `
        <div class="mt-6">
          <a href="/openclaw" class="inline-flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
            🎛 Open Control UI
          </a>
        </div>
        ` : ''}
      </div>
      
      <!-- SECTION 2: Why LobsterSandbox? (3-column cards) -->
      <div class="mb-16">
        <h2 class="text-2xl font-display font-bold text-gray-800 text-center mb-8">Why LobsterSandbox?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Card 1: The Problem -->
          <div class="card p-6">
            <div class="text-3xl mb-3">😰</div>
            <h3 class="font-display font-bold text-gray-800 text-lg mb-3">The Problem</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              OpenClaw is incredible — it can manage your email, calendar, messages, and more. But it needs access to your real accounts. One wrong move and your AI agent is reading your real Gmail or sending from your real WhatsApp.
            </p>
          </div>
          
          <!-- Card 2: The Solution -->
          <div class="card p-6">
            <div class="text-3xl mb-3">🦞</div>
            <h3 class="font-display font-bold text-gray-800 text-lg mb-3">The Solution</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              LobsterSandbox guides you through setting up OpenClaw with throwaway accounts only. Your real email, phone, and billing stay completely separate. Nothing is connected to your actual life.
            </p>
          </div>
          
          <!-- Card 3: The Safety Net -->
          <div class="card p-6">
            <div class="text-3xl mb-3">🔄</div>
            <h3 class="font-display font-bold text-gray-800 text-lg mb-3">The Safety Net</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Made a mistake? Hit Kill Switch to stop everything instantly. Want to start over? Hit Wipe and get a fresh sandbox in seconds. You're always in control.
            </p>
          </div>
        </div>
      </div>
      
      <!-- SECTION 3: Built for People Like You (Social Proof Quotes) -->
      <div class="mb-16">
        <h2 class="text-2xl font-display font-bold text-gray-800 text-center mb-2">Built for People Like You</h2>
        <p class="text-gray-500 text-center mb-8">Real concerns from real people about OpenClaw. LobsterSandbox is the answer.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Quote Card 1 -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative flex flex-col">
            <div class="absolute top-4 left-4 text-5xl text-lobster-200 font-serif leading-none">"</div>
            <p class="text-gray-700 italic text-sm leading-relaxed pt-8 mb-4 flex-grow">
              I want to join the party, but I don't want to be turned into digital mincemeat by hackers.
            </p>
            <p class="text-xs text-gray-400 mb-3">— Tech founders asking about OpenClaw on Twitter/X</p>
            <p class="text-sm font-bold text-lobster-600">LobsterSandbox keeps your real accounts completely separate.</p>
          </div>
          
          <!-- Quote Card 2 -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative flex flex-col">
            <div class="absolute top-4 left-4 text-5xl text-lobster-200 font-serif leading-none">"</div>
            <p class="text-gray-700 italic text-sm leading-relaxed pt-8 mb-4 flex-grow">
              I can't find a single user in my communities — the concept of AI taking control of everything is too scary.
            </p>
            <p class="text-xs text-gray-400 mb-3">— Hacker News discussion, February 2026</p>
            <p class="text-sm font-bold text-lobster-600">Safe Mode means your agent asks before doing anything risky.</p>
          </div>
          
          <!-- Quote Card 3 -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative flex flex-col">
            <div class="absolute top-4 left-4 text-5xl text-lobster-200 font-serif leading-none">"</div>
            <p class="text-gray-700 italic text-sm leading-relaxed pt-8 mb-4 flex-grow">
              Do not install OpenClaw on your primary computer. There is no perfectly secure setup.
            </p>
            <p class="text-xs text-gray-400 mb-3">— Security researchers and OpenClaw's own FAQ</p>
            <p class="text-sm font-bold text-lobster-600">That's exactly why LobsterSandbox exists. Sandbox first, real setup later.</p>
          </div>
        </div>
        
        <!-- CTA after quotes -->
        <div class="text-center mt-10">
          <a href="/setup" class="inline-flex items-center justify-center px-8 py-4 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl text-lg">
            🚀 Ready to try it safely? Launch Your Sandbox
          </a>
        </div>
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
          <a href="/status" class="text-gray-600 hover:text-gray-700 font-medium">📊 System Status</a>
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
