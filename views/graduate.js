import { layout } from './layout.js';

export function graduatePage(options = {}) {
  const { loggedIn = false, gatewayRunning = false } = options;
  
  const content = `
  <div class="min-h-screen flex flex-col items-center px-4 py-8">
    <div class="w-full max-w-4xl">
      
      <!-- Page Header -->
      <div class="text-center mb-12">
        <div class="text-6xl mb-4">🎓</div>
        <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
          Graduate to Production
        </h1>
        <p class="text-xl text-gray-600 mb-4">
          You've outgrown the sandbox. Here's how to run OpenClaw for real.
        </p>
        <p class="text-gray-500 max-w-2xl mx-auto">
          LobsterSandbox was your training wheels. Now you're ready to set up a full OpenClaw instance with your real accounts, real infrastructure, and real workflows. Here's how to make the transition safely.
        </p>
      </div>
      
      <!-- SECTION 1: Are You Ready? -->
      <div class="card p-6 mb-8">
        <h2 class="text-xl font-display font-bold text-gray-800 mb-4">Before you graduate, make sure you've:</h2>
        
        <div class="space-y-3 mb-6">
          <div class="flex items-start gap-3">
            <span class="text-green-500 text-xl flex-shrink-0">✅</span>
            <span class="text-gray-700">Completed at least a few Sandbox Missions</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-green-500 text-xl flex-shrink-0">✅</span>
            <span class="text-gray-700">Understand how OpenClaw agents, channels, and skills work</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-green-500 text-xl flex-shrink-0">✅</span>
            <span class="text-gray-700">Know which AI model you want to use and roughly what it costs</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-green-500 text-xl flex-shrink-0">✅</span>
            <span class="text-gray-700">Decided which channels you want to connect (WhatsApp, Discord, Telegram, etc.)</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-green-500 text-xl flex-shrink-0">✅</span>
            <span class="text-gray-700">Set a real budget for API costs</span>
          </div>
        </div>
        
        <p class="text-sm text-gray-500 mb-4">Not there yet? No rush. Your sandbox isn't going anywhere.</p>
        <a href="/missions" class="text-red-500 hover:text-red-600 text-sm font-medium">← Back to Sandbox Missions</a>
      </div>
      
      <!-- SECTION 2: Export Your Config -->
      <div class="card p-6 mb-8">
        <h2 class="text-xl font-display font-bold text-gray-800 mb-2">Step 1: Export Your Sandbox Config</h2>
        <p class="text-gray-600 mb-6">
          Download your current sandbox configuration so you can import it into a fresh OpenClaw installation. This includes your model preferences, safe mode settings, and channel configurations. API keys are NOT included in the export for security.
        </p>
        
        ${loggedIn ? `
        <button onclick="downloadConfig()" class="inline-flex items-center gap-2 px-6 py-3 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl mb-4">
          📦 Download Config Export
        </button>
        ` : `
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <p class="text-amber-800 text-sm">
            <strong>Log in to export your config.</strong> You need to be logged in to download your sandbox configuration.
          </p>
          <a href="/setup" class="text-amber-700 hover:text-amber-800 text-sm font-medium">→ Go to Setup</a>
        </div>
        `}
        
        <p class="text-sm text-gray-500 flex items-center gap-2">
          <span>🔒</span>
          <span>API keys are never included in exports. You'll re-enter them in your new setup.</span>
        </p>
      </div>
      
      <!-- SECTION 3: Set Up Production OpenClaw -->
      <div class="card p-6 mb-8">
        <h2 class="text-xl font-display font-bold text-gray-800 mb-2">Step 2: Install OpenClaw</h2>
        <p class="text-gray-600 mb-6">Follow the official setup on your own machine or cloud server.</p>
        
        <div class="space-y-8">
          <!-- Step 1 -->
          <div>
            <h3 class="font-semibold text-gray-800 mb-3">1. Install OpenClaw</h3>
            <div class="bg-gray-900 rounded-xl p-4 relative group">
              <button onclick="copyCode(this)" class="absolute top-3 right-3 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm px-2 py-1 bg-gray-700 rounded">
                Copy
              </button>
              <pre class="text-green-400 font-mono text-sm overflow-x-auto"><code>curl -fsSL https://www.openclaw.com/install.sh | bash
openclaw onboard --install-daemon</code></pre>
            </div>
            <p class="text-sm text-gray-500 mt-2">Requires Node.js 22+. The installer handles dependencies.</p>
          </div>
          
          <!-- Step 2 -->
          <div>
            <h3 class="font-semibold text-gray-800 mb-3">2. Open the Control UI</h3>
            <p class="text-gray-600">
              Once installed, open <code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">http://127.0.0.1:18789</code> in your browser. This is your OpenClaw dashboard — same interface you used in the sandbox, but now it's yours.
            </p>
          </div>
          
          <!-- Step 3 -->
          <div>
            <h3 class="font-semibold text-gray-800 mb-3">3. Add your API key</h3>
            <p class="text-gray-600">
              Go to <strong>Settings → Model Configuration</strong> and enter your API key. If you exported your config, your model preference is noted in the export file.
            </p>
          </div>
          
          <!-- Step 4 -->
          <div>
            <h3 class="font-semibold text-gray-800 mb-3">4. Connect your real channels</h3>
            <p class="text-gray-600 mb-4">
              Now you can connect your actual WhatsApp, Discord, Telegram, or other accounts. The sandbox taught you how each channel works — now do it with your real accounts.
            </p>
            <div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
              <p class="text-amber-800 font-medium flex items-start gap-2">
                <span class="flex-shrink-0">⚠️</span>
                <span><strong>This is the point of no return for account safety.</strong> You're connecting real accounts now. LobsterSandbox safety controls (Kill Switch, Wipe) only work inside the sandbox — they won't protect your production instance.</span>
              </p>
            </div>
          </div>
          
          <!-- Step 5 -->
          <div>
            <h3 class="font-semibold text-gray-800 mb-3">5. Set up your own cost controls</h3>
            <p class="text-gray-600 mb-3">
              OpenClaw doesn't have built-in budget limits. Set spending caps directly with your API provider:
            </p>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-start gap-2">
                <span class="text-gray-400">•</span>
                <span><strong>Anthropic:</strong> console.anthropic.com → Settings → Spend Limits</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-400">•</span>
                <span><strong>OpenAI:</strong> platform.openai.com → Settings → Limits</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-400">•</span>
                <span><strong>OpenRouter:</strong> openrouter.ai → Settings → Credit Limit</span>
              </li>
            </ul>
          </div>
          
          <!-- Step 6 -->
          <div>
            <h3 class="font-semibold text-gray-800 mb-3">6. Run a health check</h3>
            <div class="bg-gray-900 rounded-xl p-4 relative group">
              <button onclick="copyCode(this)" class="absolute top-3 right-3 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm px-2 py-1 bg-gray-700 rounded">
                Copy
              </button>
              <pre class="text-green-400 font-mono text-sm overflow-x-auto"><code>openclaw doctor</code></pre>
            </div>
            <p class="text-sm text-gray-500 mt-2">This verifies your installation. Fix any issues it flags before going further.</p>
          </div>
        </div>
      </div>
      
      <!-- SECTION 4: Cloud Deployment Options -->
      <div class="card p-6 mb-8">
        <h2 class="text-xl font-display font-bold text-gray-800 mb-2">Step 3: Deploy to the Cloud (Optional)</h2>
        <p class="text-gray-600 mb-6">If you want your agent running 24/7, deploy to a cloud provider.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <a href="https://railway.app" target="_blank" rel="noopener" class="block p-4 border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all text-center">
            <div class="text-2xl mb-2">🚂</div>
            <div class="font-semibold text-gray-800">Railway</div>
            <div class="text-sm text-gray-500">One-click deploy. $5/mo.</div>
          </a>
          <a href="https://www.digitalocean.com" target="_blank" rel="noopener" class="block p-4 border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all text-center">
            <div class="text-2xl mb-2">🌊</div>
            <div class="font-semibold text-gray-800">DigitalOcean</div>
            <div class="text-sm text-gray-500">1-Click Droplet. $24/mo.</div>
          </a>
          <a href="https://docs.openclaw.com/docker" target="_blank" rel="noopener" class="block p-4 border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all text-center">
            <div class="text-2xl mb-2">🐳</div>
            <div class="font-semibold text-gray-800">Docker/VPS</div>
            <div class="text-sm text-gray-500">Any Linux server with Docker.</div>
          </a>
        </div>
        
        <p class="text-sm text-gray-500">
          For detailed deployment instructions, see the official OpenClaw docs at <a href="https://docs.openclaw.com" target="_blank" rel="noopener" class="text-red-500 hover:text-red-600">docs.openclaw.com</a>
        </p>
      </div>
      
      <!-- SECTION 5: Keep Your Sandbox -->
      <div class="card p-6 mb-8 bg-gradient-to-br from-red-50 to-orange-50 border-red-100">
        <h2 class="text-xl font-display font-bold text-gray-800 mb-2">You don't have to choose</h2>
        <p class="text-gray-600 mb-6">
          Many users keep their sandbox running alongside their production setup. Use the sandbox to test new skills, try risky configurations, or experiment with new channels before connecting them to your real accounts. That's what it's there for.
        </p>
        <a href="/status" class="inline-flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold">
          ← Back to Your Sandbox
        </a>
      </div>
      
      <!-- SECTION 6: Feedback -->
      <div class="card p-6 mb-8">
        <h2 class="text-xl font-display font-bold text-gray-800 mb-2">How was your LobsterSandbox experience?</h2>
        <p class="text-gray-600 mb-6">
          We'd love to hear how the sandbox helped you get started with OpenClaw.
        </p>
        
        <form id="feedback-form" onsubmit="submitFeedback(event)">
          <input type="hidden" name="_csrf" id="csrf-token" value="">
          <textarea 
            name="feedback" 
            id="feedback-text"
            rows="4" 
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
            placeholder="Tell us what worked, what didn't, and what you'd add..."
          ></textarea>
          <button type="submit" class="px-6 py-3 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
            Send Feedback
          </button>
        </form>
        
        <div id="feedback-success" class="hidden mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p class="text-green-800 font-medium">🦞 Thanks! Your feedback helps us make LobsterSandbox better for the next person.</p>
        </div>
        
        <p class="text-sm text-gray-500 mt-4">
          You can also open issues or contribute at <a href="https://github.com/lobstersandbox/lobstersandbox" target="_blank" rel="noopener" class="text-red-500 hover:text-red-600">github.com/lobstersandbox/lobstersandbox</a>
        </p>
      </div>
      
      <!-- Back link -->
      <div class="text-center">
        <a href="/" class="text-gray-500 hover:text-gray-700 text-sm">← Back to homepage</a>
      </div>
      
    </div>
  </div>
  
  <script>
    function copyCode(btn) {
      const code = btn.parentElement.querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = original; }, 2000);
      });
    }
    
    async function downloadConfig() {
      try {
        const res = await fetch('/api/config-export');
        if (!res.ok) {
          alert('Failed to export config. Please try again.');
          return;
        }
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lobstersandbox-config-export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        alert('Failed to export config. Please try again.');
      }
    }
    
    async function loadCsrfToken() {
      try {
        const res = await fetch('/api/csrf-token');
        if (res.ok) {
          const data = await res.json();
          document.getElementById('csrf-token').value = data.token;
        }
      } catch (e) {}
    }
    
    async function submitFeedback(e) {
      e.preventDefault();
      const text = document.getElementById('feedback-text').value.trim();
      if (!text) return;
      
      try {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            feedback: text,
            _csrf: document.getElementById('csrf-token').value
          })
        });
        
        if (res.ok) {
          document.getElementById('feedback-form').classList.add('hidden');
          document.getElementById('feedback-success').classList.remove('hidden');
        } else {
          alert('Failed to submit feedback. Please try again.');
        }
      } catch (err) {
        alert('Failed to submit feedback. Please try again.');
      }
    }
    
    document.addEventListener('DOMContentLoaded', loadCsrfToken);
  </script>
  `;
  
  return layout('Graduate to Production', content, { loggedIn });
}

