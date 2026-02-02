import { layout } from './layout.js';

const icons = {
  shield: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
  wallet: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>`,
  refresh: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>`,
  rocket: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>`,
  book: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`,
  alertTriangle: `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  lobster: `<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
  lifeBuoy: `<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
  shieldCheck: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
  quote: `<svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>`,
  arrowRight: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>`,
  control: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>`,
  chart: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
  copy: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`
};

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
        <p class="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-body leading-relaxed">
          Your safe playground for AI agents. Use throwaway accounts, set a spending cap, and wipe everything with one click if anything feels off.
        </p>
        
        <!-- Trust Icons Row - Clean horizontal layout -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 mb-10">
          <div class="flex items-center gap-3 text-gray-700">
            <span class="text-lobster-500">${icons.shield}</span>
            <span class="font-semibold text-sm">Real accounts untouched</span>
          </div>
          <div class="flex items-center gap-3 text-gray-700">
            <span class="text-lobster-500">${icons.wallet}</span>
            <span class="font-semibold text-sm">You control spending</span>
          </div>
          <div class="flex items-center gap-3 text-gray-700">
            <span class="text-lobster-500">${icons.refresh}</span>
            <span class="font-semibold text-sm">One-click fresh start</span>
          </div>
        </div>
        
        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a href="/setup" class="inline-flex items-center justify-center gap-2 px-8 py-4 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl text-lg">
            ${icons.arrowRight} Launch Your Sandbox
          </a>
          <a href="/guide" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl border border-gray-200 text-lg">
            ${icons.book} Read the Burner Stack Guide
          </a>
        </div>
        
        <!-- Social Proof -->
        <p class="text-sm text-gray-500">Join 117K+ people exploring OpenClaw — safely.</p>
        
        ${configured ? `
        <div class="mt-6">
          <a href="/openclaw" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
            ${icons.control} Open Control UI
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
            <div class="text-lobster-500 mb-3">${icons.alertTriangle}</div>
            <h3 class="font-display font-bold text-gray-800 text-lg mb-3">The Problem</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              OpenClaw is incredible — it can manage your email, calendar, messages, and more. But it needs access to your real accounts. One wrong move and your AI agent is reading your real Gmail or sending from your real WhatsApp.
            </p>
          </div>
          
          <!-- Card 2: The Solution -->
          <div class="card p-6">
            <div class="text-lobster-500 mb-3">${icons.lobster}</div>
            <h3 class="font-display font-bold text-gray-800 text-lg mb-3">The Solution</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              LobsterSandbox guides you through setting up OpenClaw with throwaway accounts only. Your real email, phone, and billing stay completely separate. Nothing is connected to your actual life.
            </p>
          </div>
          
          <!-- Card 3: The Safety Net -->
          <div class="card p-6">
            <div class="text-lobster-500 mb-3">${icons.lifeBuoy}</div>
            <h3 class="font-display font-bold text-gray-800 text-lg mb-3">The Safety Net</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Made a mistake? Hit Kill Switch to stop everything instantly. Want to start over? Hit Wipe and get a fresh sandbox in seconds. You're always in control.
            </p>
          </div>
        </div>
      </div>
      
      <!-- SECTION 3: Built for People Like You (Social Proof Quotes) -->
      <div class="mb-20">
        <h2 class="text-2xl font-display font-bold text-gray-800 text-center mb-2">Built for People Like You</h2>
        <p class="text-gray-500 text-center mb-10">Real concerns from real people about OpenClaw. LobsterSandbox is the answer.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Quote Card 1 -->
          <div class="bg-white rounded-xl border-t-4 border-t-lobster-400 border border-gray-200 shadow-sm p-6 flex flex-col">
            <div class="text-lobster-200 mb-3">${icons.quote}</div>
            <p class="text-gray-700 italic text-sm leading-relaxed mb-4 flex-grow">
              I want to join the party, but I don't want to be turned into digital mincemeat by hackers.
            </p>
            <p class="text-xs text-gray-400 mb-3">— Tech founders asking about OpenClaw on Twitter/X</p>
            <p class="text-sm font-bold text-lobster-600">LobsterSandbox keeps your real accounts completely separate.</p>
          </div>
          
          <!-- Quote Card 2 -->
          <div class="bg-white rounded-xl border-t-4 border-t-lobster-400 border border-gray-200 shadow-sm p-6 flex flex-col">
            <div class="text-lobster-200 mb-3">${icons.quote}</div>
            <p class="text-gray-700 italic text-sm leading-relaxed mb-4 flex-grow">
              I can't find a single user in my communities — the concept of AI taking control of everything is too scary.
            </p>
            <p class="text-xs text-gray-400 mb-3">— Hacker News discussion, February 2026</p>
            <p class="text-sm font-bold text-lobster-600">Safe Mode means your agent asks before doing anything risky.</p>
          </div>
          
          <!-- Quote Card 3 -->
          <div class="bg-white rounded-xl border-t-4 border-t-lobster-400 border border-gray-200 shadow-sm p-6 flex flex-col">
            <div class="text-lobster-200 mb-3">${icons.quote}</div>
            <p class="text-gray-700 italic text-sm leading-relaxed mb-4 flex-grow">
              Do not install OpenClaw on your primary computer. There is no perfectly secure setup.
            </p>
            <p class="text-xs text-gray-400 mb-3">— Security researchers and OpenClaw's own FAQ</p>
            <p class="text-sm font-bold text-lobster-600">That's exactly why LobsterSandbox exists. Sandbox first, real setup later.</p>
          </div>
        </div>
        
        <!-- CTA after quotes -->
        <div class="text-center mt-12">
          <a href="/setup" class="inline-flex items-center justify-center gap-2 px-8 py-4 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl text-lg">
            ${icons.arrowRight} Ready to try it safely? Launch Your Sandbox
          </a>
        </div>
      </div>
      
      <!-- SECTION 4: Technical Safety Details (Collapsible) -->
      <div class="card p-6 mb-8">
        <details>
          <summary class="flex items-center gap-2 cursor-pointer font-display font-bold text-gray-800 text-lg">
            <span class="text-lobster-500">${icons.shieldCheck}</span> Technical Safety Details (for the curious)
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
                  <button onclick="copyChecklist()" class="inline-flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded transition-colors">
                    ${icons.copy} Copy
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
          <a href="/profile" class="inline-flex items-center gap-1 text-lobster-600 hover:text-lobster-700 font-medium">${icons.shieldCheck} Choose Safety Profile</a>
          <a href="/status" class="inline-flex items-center gap-1 text-gray-600 hover:text-gray-700 font-medium">${icons.chart} System Status</a>
          <a href="https://docs.openclaw.ai/" target="_blank" class="text-gray-500 hover:text-gray-700">Documentation →</a>
        </div>
      </div>
      
      ${profile ? `
      <div class="text-center text-sm text-gray-500">
        Current profile: <span class="font-medium ${profile === 'safe' ? 'text-green-600' : 'text-purple-600'}">${profile === 'safe' ? 'Safe Mode' : 'Power Mode'}</span>
        <a href="/profile" class="ml-2 text-lobster-600 hover:underline">Change</a>
      </div>
      ` : ''}
    </div>
  </div>
  `;
  
  return layout('Home', content, { loggedIn, gatewayRunning });
}
