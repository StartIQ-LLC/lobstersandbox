import { layout } from './layout.js';

export function deployPage(options = {}) {
  const { loggedIn = false, gatewayRunning = false } = options;
  
  const content = `
  <div class="min-h-screen flex flex-col items-center px-4 py-8">
    <div class="w-full max-w-4xl">
      
      <!-- PAGE HEADER -->
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
          🚀 Deploy Your Sandbox
        </h1>
        <p class="text-xl text-gray-600 mb-2">
          Get your own LobsterSandbox instance running in minutes.
        </p>
        <p class="text-gray-500">
          Pick the option that fits you. LobsterSandbox is the safety and guidance wrapper — you choose where it runs.
        </p>
      </div>
      
      <!-- DEPLOY OPTION CARDS -->
      <div class="space-y-6 mb-12">
        
        <!-- CARD 1: Replit (PRIMARY) -->
        <div class="card p-8 border-2 border-red-500 bg-gradient-to-br from-white to-red-50 shadow-xl">
          <div class="flex items-start gap-4 mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-3xl">🔮</span>
                <span class="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">⭐ Recommended</span>
              </div>
              <h2 class="text-2xl font-display font-bold text-gray-800 mb-1">Deploy on Replit</h2>
              <p class="text-gray-600">One click. Runs in your browser. No local setup needed.</p>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span class="flex items-center gap-1"><span>⏱️</span> ~2 minutes</span>
            <span class="flex items-center gap-1"><span>💰</span> Free tier available</span>
            <span class="flex items-center gap-1 text-green-600 font-medium">Best for: First-timers, non-technical users</span>
          </div>
          
          <p class="text-gray-600 mb-6 leading-relaxed">
            Click the button, fork the project, and your sandbox starts automatically. Add your API key in the setup wizard and you're chatting in under 5 minutes.
          </p>
          
          <a href="https://replit.com/@lobstersandbox/LobsterSandbox?v=1" target="_blank" class="inline-flex items-center justify-center px-8 py-4 lobster-gradient hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl text-lg">
            Deploy to Replit →
          </a>
        </div>
        
        <!-- CARD 2: Railway -->
        <div class="card p-6">
          <div class="flex items-start gap-4 mb-4">
            <span class="text-2xl">🚂</span>
            <div class="flex-1">
              <h2 class="text-xl font-display font-bold text-gray-800 mb-1">Deploy on Railway</h2>
              <p class="text-gray-500">One-click cloud deploy. Your own always-on private instance.</p>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <span class="flex items-center gap-1"><span>⏱️</span> ~5 minutes</span>
            <span class="flex items-center gap-1"><span>💰</span> $5/month after free trial</span>
            <span class="flex items-center gap-1">Best for: Always-on cloud instance</span>
          </div>
          
          <p class="text-gray-600 mb-4 leading-relaxed">
            Railway handles hosting, SSL, and uptime. Your sandbox runs 24/7 on your own infrastructure.
          </p>
          
          <a href="https://railway.app/template/lobstersandbox" target="_blank" class="inline-flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
            Deploy to Railway →
          </a>
        </div>
        
        <!-- CARD 3: Render -->
        <div class="card p-6">
          <div class="flex items-start gap-4 mb-4">
            <span class="text-2xl">🎨</span>
            <div class="flex-1">
              <h2 class="text-xl font-display font-bold text-gray-800 mb-1">Deploy on Render</h2>
              <p class="text-gray-500">Another solid one-click cloud option.</p>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <span class="flex items-center gap-1"><span>⏱️</span> ~5 minutes</span>
            <span class="flex items-center gap-1"><span>💰</span> Free tier with sleep, $7/month always-on</span>
            <span class="flex items-center gap-1">Best for: Budget-conscious users</span>
          </div>
          
          <p class="text-gray-600 mb-4 leading-relaxed">
            Render's free tier works great for testing. Upgrade to always-on when you're ready.
          </p>
          
          <a href="https://render.com/deploy?repo=https://github.com/lobstersandbox/lobstersandbox" target="_blank" class="inline-flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
            Deploy to Render →
          </a>
        </div>
        
        <!-- CARD 4: Docker (Collapsible) -->
        <div class="card p-6">
          <details>
            <summary class="flex items-center gap-4 cursor-pointer">
              <span class="text-2xl">🐳</span>
              <div class="flex-1">
                <h2 class="text-xl font-display font-bold text-gray-800 mb-1">Run Locally with Docker (Advanced)</h2>
                <p class="text-gray-500">Full control on your own machine.</p>
              </div>
              <span class="text-gray-400 text-xl">▸</span>
            </summary>
            
            <div class="mt-6 pt-4 border-t border-gray-100">
              <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <span class="flex items-center gap-1"><span>⏱️</span> ~15 minutes</span>
                <span class="flex items-center gap-1"><span>💰</span> Free</span>
                <span class="flex items-center gap-1">Best for: Developers, privacy-focused users</span>
              </div>
              
              <p class="text-gray-600 mb-4 leading-relaxed">
                Requires Docker installed on your machine. Works on macOS, Linux, and Windows (via WSL2).
              </p>
              
              <div class="bg-gray-900 rounded-xl p-4 mb-4 overflow-x-auto">
                <pre class="text-green-400 text-sm font-mono"><code>git clone https://github.com/lobstersandbox/lobstersandbox.git
cd lobstersandbox
docker compose up -d</code></pre>
              </div>
              
              <p class="text-gray-600 mb-4">
                Then open <code class="bg-gray-100 px-2 py-1 rounded text-sm">http://localhost:3000</code> in your browser and complete the setup wizard.
              </p>
              
              <p class="text-sm text-gray-500">
                For Docker help, see <a href="https://docs.docker.com/get-docker" target="_blank" class="text-red-500 hover:text-red-600 underline">docs.docker.com/get-docker</a>
              </p>
            </div>
          </details>
        </div>
        
      </div>
      
      <!-- WHAT HAPPENS AFTER YOU DEPLOY? -->
      <div class="card p-8 mb-8">
        <h2 class="text-xl font-display font-bold text-gray-800 mb-6">What happens after you deploy?</h2>
        
        <div class="space-y-4">
          <div class="flex gap-4">
            <div class="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
            <div class="flex-1">
              <p class="text-gray-700">Open your new LobsterSandbox instance in your browser</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
            <div class="flex-1">
              <p class="text-gray-700">Complete the setup wizard — add your API key, choose a model, set a budget</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
            <div class="flex-1">
              <p class="text-gray-700">Read the <a href="/guide" class="text-red-500 hover:text-red-600 font-medium">Burner Stack Guide</a> to set up throwaway accounts</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
            <div class="flex-1">
              <p class="text-gray-700">Try your first <a href="/missions" class="text-red-500 hover:text-red-600 font-medium">Sandbox Mission</a></p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">5</div>
            <div class="flex-1">
              <p class="text-gray-700">Explore OpenClaw through the Control UI</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6 pt-6 border-t border-gray-100">
          <div class="flex items-center gap-3 bg-green-50 text-green-700 px-4 py-3 rounded-xl">
            <span class="text-xl">🛡️</span>
            <p class="text-sm font-medium">All safety controls — Kill Switch, Wipe, Safe Mode — are active by default from the moment you start.</p>
          </div>
        </div>
      </div>
      
      <!-- Back to home -->
      <div class="text-center">
        <a href="/" class="text-gray-500 hover:text-gray-700 text-sm">← Back to LobsterSandbox</a>
      </div>
      
    </div>
  </div>
  `;
  
  return layout('Deploy Your Sandbox', content, { loggedIn, gatewayRunning });
}
