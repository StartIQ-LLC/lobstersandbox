import { layout } from './layout.js';

export function guidePage(options = {}) {
  const { loggedIn = false, gatewayRunning = false } = options;
  
  const content = `
  <div class="min-h-screen flex flex-col items-center px-4 py-8">
    <div class="w-full max-w-3xl">
      
      <!-- Page Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
          🦞 The Burner Stack Guide
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
          Set up throwaway accounts in 10 minutes. Keep your real digital life completely separate from your AI sandbox.
        </p>
        <p class="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
          OpenClaw is powerful — it can read email, send messages, manage calendars, and run commands. That's exactly why you should test it with throwaway accounts first. This guide walks you through creating a clean "burner stack" so nothing touches your real accounts.
        </p>
      </div>
      
      <!-- Progress Tracker -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-8 sticky top-14 z-40">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-gray-700" id="progress-text">0 of 4 steps completed</span>
          <span class="text-xs text-gray-400">Progress saved automatically</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div id="progress-bar" class="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out" style="width: 0%"></div>
        </div>
        <div class="flex justify-between">
          <div class="flex flex-col items-center">
            <div id="step-indicator-1" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 transition-all duration-300">1</div>
            <span class="text-xs text-gray-400 mt-1">Email</span>
          </div>
          <div class="flex flex-col items-center">
            <div id="step-indicator-2" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 transition-all duration-300">2</div>
            <span class="text-xs text-gray-400 mt-1">Phone</span>
          </div>
          <div class="flex flex-col items-center">
            <div id="step-indicator-3" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 transition-all duration-300">3</div>
            <span class="text-xs text-gray-400 mt-1">API Key</span>
          </div>
          <div class="flex flex-col items-center">
            <div id="step-indicator-4" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 transition-all duration-300">4</div>
            <span class="text-xs text-gray-400 mt-1">Payment</span>
          </div>
        </div>
      </div>
      
      <div class="space-y-4">
        
        <!-- STEP 1: Burner Email -->
        <div class="card overflow-hidden" id="step-1-card">
          <button onclick="toggleStep(1)" class="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
              <span class="text-2xl">📧</span>
              <h2 class="font-display font-bold text-gray-800 text-lg">Step 1: Create a Burner Email</h2>
            </div>
            <div class="flex items-center gap-2">
              <span id="step-1-check" class="text-green-500 text-xl hidden">✓</span>
              <span id="step-1-arrow" class="text-gray-400 transition-transform duration-200">▼</span>
            </div>
          </button>
          <div id="step-1-content" class="px-5 pb-5 border-t border-gray-100">
            <p class="text-gray-600 mb-6 mt-4">
              You need a fresh email that is <strong>NOT</strong> your real one. OpenClaw can interact with email — you don't want it anywhere near your real inbox.
            </p>
            
            <div class="space-y-6">
              <!-- Gmail Option -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-800 mb-3">Option A — Gmail (Recommended for beginners)</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li>1. <a href="https://accounts.google.com" target="_blank" class="text-lobster-600 hover:underline font-medium">Go to accounts.google.com →</a></li>
                  <li>2. Click "Create account" → "For my personal use"</li>
                  <li>3. Use any name you want — it doesn't have to be real</li>
                  <li>4. Pick a new address like <code class="bg-gray-200 px-1 rounded">yourname.sandbox@gmail.com</code></li>
                  <li>5. Use a strong unique password — don't reuse one from your real accounts</li>
                  <li>6. Skip phone verification if possible, or use your real number just for verification then remove it after</li>
                </ul>
              </div>
              
              <!-- ProtonMail Option -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-800 mb-3">Option B — ProtonMail (More private)</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li>1. <a href="https://proton.me" target="_blank" class="text-lobster-600 hover:underline font-medium">Go to proton.me →</a></li>
                  <li>2. Click "Create a free account"</li>
                  <li>3. No phone number required for basic account</li>
                  <li>4. Based in Switzerland, more privacy-focused</li>
                </ul>
              </div>
              
              <!-- Larry Tip -->
              <div class="bg-lobster-50 border border-lobster-200 rounded-lg p-4 text-sm">
                <p class="text-lobster-800">
                  <span class="text-lg">🦞</span> <strong>Larry says:</strong> Don't overthink the name. This is a sandbox email. Call yourself Sandbox McTestface for all I care.
                </p>
              </div>
            </div>
            
            <!-- Checkbox -->
            <label class="flex items-center gap-3 mt-6 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group">
              <input type="checkbox" id="step-1-checkbox" onchange="handleCheckbox(1)" class="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer">
              <span class="font-medium text-gray-700 group-hover:text-gray-900">I have a burner email ready</span>
            </label>
          </div>
        </div>
        
        <!-- STEP 2: Phone Number -->
        <div class="card overflow-hidden" id="step-2-card">
          <button onclick="toggleStep(2)" class="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
              <span class="text-2xl">📱</span>
              <h2 class="font-display font-bold text-gray-800 text-lg">Step 2: Get a Number or Skip This</h2>
            </div>
            <div class="flex items-center gap-2">
              <span id="step-2-check" class="text-green-500 text-xl hidden">✓</span>
              <span id="step-2-arrow" class="text-gray-400 transition-transform duration-200">▼</span>
            </div>
          </button>
          <div id="step-2-content" class="px-5 pb-5 border-t border-gray-100 hidden">
            <p class="text-gray-600 mb-6 mt-4">
              Some OpenClaw channels like WhatsApp and Telegram need a phone number. But you can completely skip this.
            </p>
            
            <div class="space-y-6">
              <!-- SKIP IT - Most Prominent -->
              <div class="bg-green-50 border-2 border-green-300 rounded-lg p-5">
                <div class="flex items-center gap-2 mb-3">
                  <span class="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">RECOMMENDED</span>
                  <h3 class="font-bold text-green-800 text-lg">Option A — SKIP IT</h3>
                </div>
                <ul class="space-y-2 text-sm text-green-800">
                  <li><strong>You don't need WhatsApp or Telegram to test OpenClaw!</strong></li>
                  <li>• OpenClaw has a built-in <strong>WebChat</strong> in the Control UI dashboard — zero phone number needed</li>
                  <li>• You can also use <strong>Discord</strong> — just create a new account with your burner email</li>
                </ul>
              </div>
              
              <!-- Google Voice Option -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-800 mb-3">Option B — Google Voice (Free, US only)</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li>1. <a href="https://voice.google.com" target="_blank" class="text-lobster-600 hover:underline font-medium">Go to voice.google.com →</a></li>
                  <li>2. Sign in with your burner Gmail from Step 1</li>
                  <li>3. Get a free US phone number</li>
                  <li class="text-amber-600">⚠️ Note: Google Voice numbers don't always work for WhatsApp verification — results vary</li>
                </ul>
              </div>
              
              <!-- Prepaid SIM Option -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-800 mb-3">Option C — Prepaid SIM ($10-15)</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li>• Buy a prepaid SIM at any convenience store or Walmart</li>
                  <li>• Use it only for sandbox verification</li>
                  <li>• Keep it completely separate from your real phone</li>
                </ul>
              </div>
              
              <!-- Larry Tip -->
              <div class="bg-lobster-50 border border-lobster-200 rounded-lg p-4 text-sm">
                <p class="text-lobster-800">
                  <span class="text-lg">🦞</span> <strong>Larry says:</strong> Seriously, just skip this. WebChat works great for testing and you can always add WhatsApp later when you're comfortable.
                </p>
              </div>
            </div>
            
            <!-- Checkbox -->
            <label class="flex items-center gap-3 mt-6 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group">
              <input type="checkbox" id="step-2-checkbox" onchange="handleCheckbox(2)" class="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer">
              <span class="font-medium text-gray-700 group-hover:text-gray-900">I have a number or I'm skipping this step</span>
            </label>
          </div>
        </div>
        
        <!-- STEP 3: API Key -->
        <div class="card overflow-hidden" id="step-3-card">
          <button onclick="toggleStep(3)" class="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🔑</span>
              <h2 class="font-display font-bold text-gray-800 text-lg">Step 3: Get an AI API Key</h2>
            </div>
            <div class="flex items-center gap-2">
              <span id="step-3-check" class="text-green-500 text-xl hidden">✓</span>
              <span id="step-3-arrow" class="text-gray-400 transition-transform duration-200">▼</span>
            </div>
          </button>
          <div id="step-3-content" class="px-5 pb-5 border-t border-gray-100 hidden">
            <p class="text-gray-600 mb-6 mt-4">
              OpenClaw needs an AI model to think with. You bring your own API key. This is the only part that costs real money — and you control exactly how much.
            </p>
            
            <div class="space-y-6">
              <!-- Cost Comparison Box -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 class="font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span class="text-xl">💡</span> What will this actually cost me?
                </h3>
                <ul class="space-y-2 text-sm text-blue-800">
                  <li>• <strong>Light testing</strong> (a few chats per day): <strong>$0.50 - $2/month</strong></li>
                  <li>• <strong>Regular usage</strong> (daily assistant tasks): <strong>$5 - $15/month</strong></li>
                  <li>• <strong>Heavy usage</strong> (always-on automation): <strong>$20 - $50/month</strong></li>
                </ul>
                <p class="mt-3 font-bold text-blue-900">Start with a $10 limit. You can always increase later.</p>
              </div>
              
              <!-- Anthropic Claude Option -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-800 mb-3">Option A — Anthropic Claude (Recommended by OpenClaw community)</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li>1. <a href="https://console.anthropic.com" target="_blank" class="text-lobster-600 hover:underline font-medium">Go to console.anthropic.com →</a> — Create account with your <strong>BURNER email</strong></li>
                  <li>2. Go to Settings → API Keys → Create Key → Copy it and save it somewhere safe</li>
                </ul>
                
                <!-- Spending Limit Warning -->
                <div class="bg-amber-100 border-2 border-amber-400 rounded-lg p-4 mt-4">
                  <p class="text-amber-900 font-bold flex items-center gap-2">
                    <span class="text-xl">⚠️</span> CRITICAL — Set a spending limit NOW:
                  </p>
                  <p class="text-amber-800 text-sm mt-2">Go to Settings → Plans & Billing → Set monthly limit to <strong>$10</strong></p>
                </div>
                
                <div class="mt-4 text-sm text-gray-600">
                  <p class="font-medium mb-2">Model guide:</p>
                  <ul class="space-y-1">
                    <li>• <strong>Claude Haiku 3.5</strong> — cheapest, great for sandbox testing (~$0.25/million input tokens)</li>
                    <li>• <strong>Claude Sonnet 3.5</strong> — balanced performance (~$3/million input tokens)</li>
                    <li>• <strong>Claude Opus 3</strong> — most powerful but expensive (~$15/million input tokens)</li>
                  </ul>
                </div>
              </div>
              
              <!-- Larry Tip for Claude -->
              <div class="bg-lobster-50 border border-lobster-200 rounded-lg p-4 text-sm">
                <p class="text-lobster-800">
                  <span class="text-lg">🦞</span> <strong>Larry says:</strong> Start with Haiku and a $10 cap. It's shockingly good and dirt cheap. You can always switch models later.
                </p>
              </div>
              
              <!-- OpenAI Option -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-800 mb-3">Option B — OpenAI</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li>1. <a href="https://platform.openai.com" target="_blank" class="text-lobster-600 hover:underline font-medium">Go to platform.openai.com →</a> — Create account with <strong>BURNER email</strong></li>
                  <li>2. Go to API Keys → Create new secret key → Copy it</li>
                  <li>3. Set monthly budget: Settings → Billing → Set budget to <strong>$10</strong></li>
                  <li>4. GPT-4o-mini is cheapest, GPT-4o is more capable</li>
                </ul>
              </div>
              
              <!-- OpenRouter Option -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-800 mb-3">Option C — OpenRouter (one key, many models)</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li>1. <a href="https://openrouter.ai" target="_blank" class="text-lobster-600 hover:underline font-medium">Go to openrouter.ai →</a> — Create account</li>
                  <li>2. Add $10 credit</li>
                  <li>3. One API key works with Claude, GPT, Gemini, Llama, and 200+ models</li>
                  <li>4. The "Auto" model (<code class="bg-gray-200 px-1 rounded">openrouter/auto</code>) automatically picks the cheapest capable model per task</li>
                </ul>
                
                <div class="bg-lobster-50 border border-lobster-200 rounded-lg p-3 mt-3 text-sm">
                  <p class="text-lobster-800">
                    <span class="text-lg">🦞</span> <strong>Larry says:</strong> OpenRouter Auto is the budget hack. Simple tasks get routed to cheap models automatically.
                  </p>
                </div>
              </div>
              
              <!-- Ollama Option -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-800 mb-3">Option D — Run models locally for free</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li>1. Install Ollama from <a href="https://ollama.ai" target="_blank" class="text-lobster-600 hover:underline font-medium">ollama.ai →</a></li>
                  <li>2. Run in terminal: <code class="bg-gray-200 px-1 rounded">ollama pull llama3</code></li>
                  <li>3. Completely free, no API key needed, no data leaves your machine</li>
                  <li class="text-amber-600">⚠️ Tradeoff: needs decent hardware (8GB+ RAM minimum)</li>
                </ul>
                
                <div class="bg-lobster-50 border border-lobster-200 rounded-lg p-3 mt-3 text-sm">
                  <p class="text-lobster-800">
                    <span class="text-lg">🦞</span> <strong>Larry says:</strong> Zero dollars. Zero data leaving your machine. You just need a beefy computer.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Checkbox -->
            <label class="flex items-center gap-3 mt-6 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group">
              <input type="checkbox" id="step-3-checkbox" onchange="handleCheckbox(3)" class="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer">
              <span class="font-medium text-gray-700 group-hover:text-gray-900">I have an API key with a spending limit set</span>
            </label>
          </div>
        </div>
        
        <!-- STEP 4: Payment Protection -->
        <div class="card overflow-hidden" id="step-4-card">
          <button onclick="toggleStep(4)" class="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
              <span class="text-2xl">💳</span>
              <h2 class="font-display font-bold text-gray-800 text-lg">Step 4: Extra Payment Protection (Optional)</h2>
            </div>
            <div class="flex items-center gap-2">
              <span id="step-4-check" class="text-green-500 text-xl hidden">✓</span>
              <span id="step-4-arrow" class="text-gray-400 transition-transform duration-200">▼</span>
            </div>
          </button>
          <div id="step-4-content" class="px-5 pb-5 border-t border-gray-100 hidden">
            <p class="text-gray-600 mb-6 mt-4">
              This step is optional. If you set a spending limit in Step 3, you're already protected. But if you want an extra layer:
            </p>
            
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <ul class="space-y-3 text-sm text-gray-600">
                  <li>• <a href="https://privacy.com" target="_blank" class="text-lobster-600 hover:underline font-medium">Privacy.com →</a> — free virtual debit cards with per-card spending limits</li>
                  <li>• <strong>Revolut / Wise</strong> — disposable virtual cards from the app</li>
                  <li>• <strong>Apple Pay / Google Pay</strong> — some API providers accept these without exposing your real card</li>
                  <li class="pt-2 border-t border-gray-200 text-gray-500">Or just rely on the spending limit you set in Step 3 — that's enough for most people.</li>
                </ul>
              </div>
              
              <!-- Larry Tip -->
              <div class="bg-lobster-50 border border-lobster-200 rounded-lg p-4 text-sm">
                <p class="text-lobster-800">
                  <span class="text-lg">🦞</span> <strong>Larry says:</strong> Honestly? The $10 cap from Step 3 is solid protection. This step is for the extra-extra cautious.
                </p>
              </div>
            </div>
            
            <!-- Checkbox -->
            <label class="flex items-center gap-3 mt-6 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group">
              <input type="checkbox" id="step-4-checkbox" onchange="handleCheckbox(4)" class="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer">
              <span class="font-medium text-gray-700 group-hover:text-gray-900">I've secured my payment or I'm comfortable with my spending limit</span>
            </label>
          </div>
        </div>
        
      </div>
      
      <!-- Completion Celebration -->
      <div id="completion-section" class="hidden mt-8">
        <div class="card p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
          <div class="text-5xl mb-4 animate-bounce">🦞🎉</div>
          <h2 class="text-2xl font-display font-bold text-green-800 mb-4">Your Burner Stack is Ready!</h2>
          
          <div class="text-left max-w-md mx-auto mb-6 space-y-2">
            <div class="flex items-center gap-3 text-green-700">
              <span class="text-green-500 text-xl">✅</span>
              <span>A throwaway email — not connected to your real life</span>
            </div>
            <div class="flex items-center gap-3 text-green-700">
              <span class="text-green-500 text-xl">✅</span>
              <span>A messaging plan — WebChat, Discord, or burner number</span>
            </div>
            <div class="flex items-center gap-3 text-green-700">
              <span class="text-green-500 text-xl">✅</span>
              <span>An API key — with a spending limit protecting you</span>
            </div>
            <div class="flex items-center gap-3 text-green-700">
              <span class="text-green-500 text-xl">✅</span>
              <span>Payment protection — cap set or virtual card in place</span>
            </div>
          </div>
          
          <a href="/setup" class="inline-flex items-center justify-center px-8 py-4 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl text-lg mb-4">
            🚀 Launch Your Sandbox
          </a>
          
          <p class="text-sm text-green-700 max-w-md mx-auto">
            Remember: if anything ever feels off, hit <strong>Kill Switch</strong> to stop or <strong>Wipe Everything</strong> to start fresh. Your real accounts were never involved.
          </p>
        </div>
      </div>
      
      <!-- Back link -->
      <div class="text-center mt-8">
        <a href="/" class="text-gray-500 hover:text-gray-700 text-sm">← Back to homepage</a>
      </div>
      
    </div>
  </div>
  
  <script>
    const STORAGE_KEY = 'burnerStackProgress';
    
    function loadProgress() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const progress = JSON.parse(saved);
          for (let i = 1; i <= 4; i++) {
            if (progress['step' + i]) {
              const checkbox = document.getElementById('step-' + i + '-checkbox');
              if (checkbox) checkbox.checked = true;
            }
          }
        }
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
      updateUI();
    }
    
    function saveProgress() {
      try {
        const progress = {};
        for (let i = 1; i <= 4; i++) {
          const checkbox = document.getElementById('step-' + i + '-checkbox');
          progress['step' + i] = checkbox ? checkbox.checked : false;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (e) {
        console.error('Failed to save progress:', e);
      }
    }
    
    function countCompleted() {
      let count = 0;
      for (let i = 1; i <= 4; i++) {
        const checkbox = document.getElementById('step-' + i + '-checkbox');
        if (checkbox && checkbox.checked) count++;
      }
      return count;
    }
    
    function updateUI() {
      const completed = countCompleted();
      
      // Update progress text
      document.getElementById('progress-text').textContent = completed + ' of 4 steps completed';
      
      // Update progress bar
      document.getElementById('progress-bar').style.width = (completed / 4 * 100) + '%';
      
      // Update step indicators
      for (let i = 1; i <= 4; i++) {
        const checkbox = document.getElementById('step-' + i + '-checkbox');
        const indicator = document.getElementById('step-indicator-' + i);
        const checkmark = document.getElementById('step-' + i + '-check');
        
        if (checkbox && checkbox.checked) {
          indicator.classList.remove('bg-gray-200', 'text-gray-500');
          indicator.classList.add('bg-green-500', 'text-white');
          indicator.innerHTML = '✓';
          checkmark.classList.remove('hidden');
        } else {
          indicator.classList.add('bg-gray-200', 'text-gray-500');
          indicator.classList.remove('bg-green-500', 'text-white');
          indicator.innerHTML = i;
          checkmark.classList.add('hidden');
        }
      }
      
      // Show/hide completion section
      const completionSection = document.getElementById('completion-section');
      if (completed === 4) {
        completionSection.classList.remove('hidden');
      } else {
        completionSection.classList.add('hidden');
      }
    }
    
    function toggleStep(stepNum) {
      const content = document.getElementById('step-' + stepNum + '-content');
      const arrow = document.getElementById('step-' + stepNum + '-arrow');
      
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        arrow.style.transform = 'rotate(0deg)';
      } else {
        content.classList.add('hidden');
        arrow.style.transform = 'rotate(-90deg)';
      }
    }
    
    function handleCheckbox(stepNum) {
      const checkbox = document.getElementById('step-' + stepNum + '-checkbox');
      
      saveProgress();
      updateUI();
      
      // If checked, collapse current and expand next
      if (checkbox.checked && stepNum < 4) {
        const currentContent = document.getElementById('step-' + stepNum + '-content');
        const currentArrow = document.getElementById('step-' + stepNum + '-arrow');
        const nextContent = document.getElementById('step-' + (stepNum + 1) + '-content');
        const nextArrow = document.getElementById('step-' + (stepNum + 1) + '-arrow');
        
        setTimeout(() => {
          currentContent.classList.add('hidden');
          currentArrow.style.transform = 'rotate(-90deg)';
          nextContent.classList.remove('hidden');
          nextArrow.style.transform = 'rotate(0deg)';
          
          // Scroll to next step
          document.getElementById('step-' + (stepNum + 1) + '-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
      
      // If all complete, scroll to celebration
      if (countCompleted() === 4) {
        setTimeout(() => {
          document.getElementById('completion-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
      }
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadProgress();
      
      // Set initial arrow states based on visibility
      for (let i = 1; i <= 4; i++) {
        const content = document.getElementById('step-' + i + '-content');
        const arrow = document.getElementById('step-' + i + '-arrow');
        if (content.classList.contains('hidden')) {
          arrow.style.transform = 'rotate(-90deg)';
        }
      }
    });
  </script>
  `;
  
  return layout('Burner Stack Guide', content, { loggedIn, gatewayRunning });
}
