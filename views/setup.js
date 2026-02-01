import { layout } from './layout.js';

export function loginPage(error = null) {
  const content = `
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="card p-8 w-full max-w-md">
      <div class="text-center mb-6">
        <div class="text-5xl mb-3">🦞</div>
        <h1 class="logo-text text-2xl text-gray-800">Setup Access</h1>
        <p class="text-gray-500 text-sm mt-2">Enter the setup password to continue</p>
      </div>
      
      ${error ? `<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">${error}</div>` : ''}
      
      <form method="POST" action="/setup/login">
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input type="password" id="password" name="password" required autocomplete="current-password"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lobster-500 focus:border-transparent transition-all">
        </div>
        <button type="submit" class="w-full lobster-gradient hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg">
          Continue
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <a href="/" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to home</a>
      </div>
    </div>
  </div>
  `;
  
  return layout('Login', content);
}

export function setupWizardPage(isConfigured = false, gatewayRunning = false, profile = null) {
  const content = `
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🦞</div>
        <h1 class="logo-text text-3xl text-gray-800">Lobster<span class="text-lobster-600">Sandbox</span> Setup</h1>
        <p class="text-gray-500 mt-2">Configure your OpenClaw sandbox environment</p>
      </div>
      
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p class="text-amber-800 text-sm flex items-start gap-2">
          <span class="text-lg">⚠️</span>
          <span><strong>Safety first:</strong> Start with a sandbox mindset. Do not connect your main accounts on day 1.</span>
        </p>
      </div>
      
      <!-- Sandbox Identity Playbook -->
      <div class="card p-6 mb-6">
        <h2 class="font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span class="text-xl">📋</span> Sandbox Identity Playbook
        </h2>
        <p class="text-sm text-gray-600 mb-4">Use separate accounts to keep your sandbox isolated from your real life.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Email Card -->
          <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div class="text-2xl mb-2">📧</div>
            <h3 class="font-semibold text-gray-800 mb-2">Email Separation</h3>
            <ul class="text-xs text-gray-600 space-y-1">
              <li>• Use a secondary inbox you control</li>
              <li>• Or create a new inbox manually</li>
              <li>• Or use a workspace domain</li>
            </ul>
            <p class="text-xs text-blue-700 mt-2 font-medium">Do NOT connect your main inbox on day 1</p>
          </div>
          
          <!-- Phone Card -->
          <div class="bg-green-50 border border-green-100 rounded-xl p-4">
            <div class="text-2xl mb-2">📱</div>
            <h3 class="font-semibold text-gray-800 mb-2">Phone Separation</h3>
            <ul class="text-xs text-gray-600 space-y-1">
              <li>• Spare number via eSIM or 2nd device</li>
              <li>• WhatsApp Business with separate #</li>
              <li>• Keep it isolated from personal contacts</li>
            </ul>
            <p class="text-xs text-green-700 mt-2 font-medium">Never use your main phone number</p>
          </div>
          
          <!-- Billing Card -->
          <div class="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <div class="text-2xl mb-2">💳</div>
            <h3 class="font-semibold text-gray-800 mb-2">Billing Separation</h3>
            <ul class="text-xs text-gray-600 space-y-1">
              <li>• Use a separate card with low limit</li>
              <li>• Start with a small monthly budget</li>
              <li>• Use the Kill Switch if anything looks off</li>
            </ul>
            <p class="text-xs text-purple-700 mt-2 font-medium">Set spending limits from day 1</p>
          </div>
        </div>
      </div>
      
      <div class="card p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-display font-semibold text-gray-800">Current Status</h2>
          <a href="/status" class="text-sm text-lobster-600 hover:text-lobster-700 font-medium">View details &rarr;</a>
        </div>
        <div class="flex gap-6 text-sm">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${isConfigured ? 'bg-green-500' : 'bg-gray-300'}"></span>
            <span class="text-gray-600">Setup: ${isConfigured ? 'Complete' : 'Not configured'}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${gatewayRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}"></span>
            <span class="text-gray-600">Gateway: ${gatewayRunning ? 'Running' : 'Stopped'}</span>
          </div>
        </div>
      </div>
      
      <div class="card p-6 mb-6" id="wizard-container">
        <h2 class="font-display font-semibold text-gray-800 mb-4">Setup Wizard</h2>
        
        <div id="wizard-steps">
          <!-- Step 1: Choose Provider -->
          <div id="step-1" class="wizard-step">
            <div class="mb-4">
              <span class="text-xs font-medium text-lobster-600 uppercase tracking-wide">Step 1 of 3</span>
              <h3 class="text-lg font-medium text-gray-800 mt-1">Choose AI Provider</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <button onclick="selectProvider('openai')" class="provider-btn p-4 border-2 border-gray-200 rounded-xl hover:border-lobster-500 hover:bg-lobster-50 transition-all text-left" data-provider="openai">
                <div class="font-display font-semibold text-gray-800">OpenAI</div>
                <div class="text-xs text-gray-500 mt-1">GPT-4o, o1, o3</div>
              </button>
              <button onclick="selectProvider('anthropic')" class="provider-btn p-4 border-2 border-gray-200 rounded-xl hover:border-lobster-500 hover:bg-lobster-50 transition-all text-left" data-provider="anthropic">
                <div class="font-display font-semibold text-gray-800">Anthropic</div>
                <div class="text-xs text-gray-500 mt-1">Claude 4, Opus, Sonnet</div>
              </button>
              <button onclick="selectProvider('gemini')" class="provider-btn p-4 border-2 border-gray-200 rounded-xl hover:border-lobster-500 hover:bg-lobster-50 transition-all text-left" data-provider="gemini">
                <div class="font-display font-semibold text-gray-800">Google Gemini</div>
                <div class="text-xs text-gray-500 mt-1">Gemini 2.5 Pro/Flash</div>
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <button onclick="selectProvider('openrouter')" class="provider-btn p-4 border-2 border-gray-200 rounded-xl hover:border-lobster-500 hover:bg-lobster-50 transition-all text-left" data-provider="openrouter">
                <div class="font-display font-semibold text-gray-800">OpenRouter</div>
                <div class="text-xs text-gray-500 mt-1">Any model, one API</div>
              </button>
              <button onclick="selectProvider('opencode-zen')" class="provider-btn p-4 border-2 border-gray-200 rounded-xl hover:border-lobster-500 hover:bg-lobster-50 transition-all text-left" data-provider="opencode-zen">
                <div class="font-display font-semibold text-gray-800">OpenCode Zen</div>
                <div class="text-xs text-gray-500 mt-1">Zen billing</div>
              </button>
              <button onclick="selectProvider('vercel')" class="provider-btn p-4 border-2 border-gray-200 rounded-xl hover:border-lobster-500 hover:bg-lobster-50 transition-all text-left" data-provider="vercel">
                <div class="font-display font-semibold text-gray-800">Vercel AI</div>
                <div class="text-xs text-gray-500 mt-1">AI Gateway</div>
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onclick="selectProvider('synthetic')" class="provider-btn p-4 border-2 border-gray-200 rounded-xl hover:border-lobster-500 hover:bg-lobster-50 transition-all text-left" data-provider="synthetic">
                <div class="font-display font-semibold text-gray-800">Synthetic</div>
                <div class="text-xs text-gray-500 mt-1">Free hosted models</div>
              </button>
              <button onclick="selectProvider('minimax')" class="provider-btn p-4 border-2 border-gray-200 rounded-xl hover:border-lobster-500 hover:bg-lobster-50 transition-all text-left" data-provider="minimax">
                <div class="font-display font-semibold text-gray-800">MiniMax</div>
                <div class="text-xs text-gray-500 mt-1">M2.1 models</div>
              </button>
              <button onclick="selectProvider('moonshot')" class="provider-btn p-4 border-2 border-gray-200 rounded-xl hover:border-lobster-500 hover:bg-lobster-50 transition-all text-left" data-provider="moonshot">
                <div class="font-display font-semibold text-gray-800">Moonshot AI</div>
                <div class="text-xs text-gray-500 mt-1">Kimi models</div>
              </button>
            </div>
          </div>
          
          <!-- Step 2: API Key -->
          <div id="step-2" class="wizard-step hidden">
            <div class="mb-4">
              <span class="text-xs font-medium text-lobster-600 uppercase tracking-wide">Step 2 of 3</span>
              <h3 class="text-lg font-medium text-gray-800 mt-1">Enter API Key</h3>
            </div>
            <div class="mb-4">
              <label for="api-key" class="block text-sm font-medium text-gray-700 mb-2">
                <span id="provider-label">Provider</span> API Key
              </label>
              <input type="password" id="api-key" placeholder="sk-..."
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lobster-500 focus:border-transparent transition-all">
              <p class="text-xs text-gray-500 mt-2">🔒 Your key is stored securely and never logged.</p>
            </div>
            <div class="flex gap-3">
              <button onclick="goToStep(1)" class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">← Back</button>
              <button onclick="goToStep(3)" id="next-step-2" class="px-6 py-2 lobster-gradient hover:opacity-90 text-white rounded-xl font-medium shadow-md">Next →</button>
            </div>
          </div>
          
          <!-- Step 3: Model -->
          <div id="step-3" class="wizard-step hidden">
            <div class="mb-4">
              <span class="text-xs font-medium text-lobster-600 uppercase tracking-wide">Step 3 of 3</span>
              <h3 class="text-lg font-medium text-gray-800 mt-1">Choose Model</h3>
            </div>
            <div class="mb-4">
              <label for="model-select" class="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <select id="model-select" onchange="handleModelSelect()"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lobster-500 focus:border-transparent transition-all bg-white">
              </select>
            </div>
            <div id="custom-model-container" class="mb-4 hidden">
              <label for="custom-model" class="block text-sm font-medium text-gray-700 mb-2">Custom Model Name</label>
              <input type="text" id="custom-model" placeholder="provider/model-name"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lobster-500 focus:border-transparent transition-all">
            </div>
            <div class="flex gap-3">
              <button onclick="goToStep(2)" class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">← Back</button>
              <button onclick="runSetup()" id="run-setup-btn" class="px-6 py-2 lobster-gradient hover:opacity-90 text-white rounded-xl font-medium shadow-md">🚀 Run Setup</button>
            </div>
          </div>
        </div>
        
        <div id="setup-result" class="hidden mt-4 p-4 rounded-xl text-sm"></div>
      </div>
      
      <div class="card p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-display font-semibold text-gray-800">Gateway Control</h2>
          <div class="flex gap-4">
            <a href="/channels" class="text-sm text-lobster-600 hover:text-lobster-700 font-medium">Channels &rarr;</a>
            <a href="/tools" class="text-sm text-lobster-600 hover:text-lobster-700 font-medium">Web Tools &rarr;</a>
          </div>
        </div>
        <div class="flex flex-wrap gap-3 mb-4">
          <button onclick="startGateway()" class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium shadow-md transition-all">
            ▶ Start Gateway
          </button>
          <button onclick="stopGateway()" class="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-sm font-medium shadow-md transition-all">
            ⏹ Stop Gateway
          </button>
          <a href="/openclaw" class="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-medium inline-block shadow-md transition-all">
            🎛 Open Control UI
          </a>
        </div>
        <div id="gateway-result" class="text-sm"></div>
      </div>
      
      <div class="card p-6 border-2 border-red-200 bg-red-50/30">
        <h2 class="font-display font-semibold text-red-700 mb-3">⚠️ Danger Zone</h2>
        <p class="text-sm text-gray-600 mb-4">These actions cannot be undone.</p>
        <div class="flex flex-wrap gap-3">
          <button onclick="killSwitch()" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium shadow-md transition-all">
            ⚡ Kill Switch
          </button>
          <button onclick="wipeEverything()" class="px-5 py-2.5 bg-red-800 hover:bg-red-900 text-white rounded-xl text-sm font-medium shadow-md transition-all">
            🗑 Wipe Everything
          </button>
        </div>
        <div id="danger-result" class="mt-3 text-sm"></div>
      </div>
      
      <div class="text-center mt-6">
        <a href="/" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to home</a>
      </div>
    </div>
  </div>
  
  <script>
    let selectedProvider = null;
    
    const modelPresets = {
      openai: [
        { value: 'openai/gpt-4o', label: 'GPT-4o (Recommended)' },
        { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (Fast & Cheap)' },
        { value: 'openai/o1', label: 'o1 (Reasoning)' },
        { value: 'openai/o3-mini', label: 'o3 Mini (Latest Reasoning)' },
        { value: 'openai/gpt-5.2', label: 'GPT-5.2' },
        { value: 'custom', label: 'Custom...' }
      ],
      anthropic: [
        { value: 'anthropic/claude-opus-4-5', label: 'Claude Opus 4.5 (Most Capable)' },
        { value: 'anthropic/claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (Recommended)' },
        { value: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4' },
        { value: 'anthropic/claude-3-5-haiku', label: 'Claude 3.5 Haiku (Fast)' },
        { value: 'custom', label: 'Custom...' }
      ],
      gemini: [
        { value: 'gemini/gemini-2.5-pro', label: 'Gemini 2.5 Pro (Recommended)' },
        { value: 'gemini/gemini-2.5-flash', label: 'Gemini 2.5 Flash (Fast)' },
        { value: 'gemini/gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
        { value: 'gemini/gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
        { value: 'custom', label: 'Custom...' }
      ],
      openrouter: [
        { value: 'openrouter/auto', label: 'Auto (Recommended)' },
        { value: 'openrouter/anthropic/claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
        { value: 'openrouter/openai/gpt-4o', label: 'GPT-4o' },
        { value: 'openrouter/google/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
        { value: 'openrouter/perplexity/sonar-pro', label: 'Perplexity Sonar Pro' },
        { value: 'custom', label: 'Custom...' }
      ],
      moonshot: [
        { value: 'moonshot/kimi-k2', label: 'Kimi K2 (Recommended)' },
        { value: 'moonshot/kimi-k1.5', label: 'Kimi K1.5' },
        { value: 'moonshot/moonshot-v1-128k', label: 'Moonshot v1 128K' },
        { value: 'custom', label: 'Custom...' }
      ],
      minimax: [
        { value: 'minimax/MiniMax-M2.1', label: 'MiniMax M2.1 (Recommended)' },
        { value: 'minimax/MiniMax-M2.1-lightning', label: 'MiniMax M2.1 Lightning (Fast)' },
        { value: 'custom', label: 'Custom...' }
      ],
      'opencode-zen': [
        { value: 'opencode/claude-opus-4-5', label: 'Claude Opus 4.5 (via Zen)' },
        { value: 'opencode/claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (via Zen)' },
        { value: 'custom', label: 'Custom...' }
      ],
      vercel: [
        { value: 'vercel-ai-gateway/anthropic/claude-opus-4.5', label: 'Claude Opus 4.5' },
        { value: 'vercel-ai-gateway/anthropic/claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
        { value: 'vercel-ai-gateway/openai/gpt-4o', label: 'GPT-4o' },
        { value: 'custom', label: 'Custom...' }
      ],
      synthetic: [
        { value: 'synthetic/hf:MiniMaxAI/MiniMax-M2.1', label: 'MiniMax M2.1 (Recommended)' },
        { value: 'synthetic/hf:moonshotai/Kimi-K2-Thinking', label: 'Kimi K2 Thinking' },
        { value: 'synthetic/hf:deepseek-ai/DeepSeek-V3.2', label: 'DeepSeek V3.2' },
        { value: 'custom', label: 'Custom...' }
      ]
    };
    
    function selectProvider(provider) {
      selectedProvider = provider;
      document.querySelectorAll('.provider-btn').forEach(btn => {
        btn.classList.remove('border-lobster-500', 'bg-lobster-50');
        if (btn.dataset.provider === provider) {
          btn.classList.add('border-lobster-500', 'bg-lobster-50');
        }
      });
      goToStep(2);
    }
    
    function goToStep(step) {
      document.querySelectorAll('.wizard-step').forEach(s => s.classList.add('hidden'));
      document.getElementById('step-' + step).classList.remove('hidden');
      
      if (step === 2) {
        const labels = { 
          openai: 'OpenAI', 
          anthropic: 'Anthropic', 
          gemini: 'Google Gemini',
          openrouter: 'OpenRouter',
          moonshot: 'Moonshot AI',
          minimax: 'MiniMax',
          'opencode-zen': 'OpenCode Zen',
          vercel: 'Vercel AI',
          synthetic: 'Synthetic'
        };
        document.getElementById('provider-label').textContent = labels[selectedProvider] || 'Provider';
      }
      
      if (step === 3) {
        const select = document.getElementById('model-select');
        select.innerHTML = '';
        (modelPresets[selectedProvider] || []).forEach(m => {
          const opt = document.createElement('option');
          opt.value = m.value;
          opt.textContent = m.label;
          select.appendChild(opt);
        });
        handleModelSelect();
      }
    }
    
    function handleModelSelect() {
      const select = document.getElementById('model-select');
      const customContainer = document.getElementById('custom-model-container');
      if (select.value === 'custom') {
        customContainer.classList.remove('hidden');
      } else {
        customContainer.classList.add('hidden');
      }
    }
    
    function getSelectedModel() {
      const select = document.getElementById('model-select');
      if (select.value === 'custom') {
        return document.getElementById('custom-model').value;
      }
      return select.value;
    }
    
    async function runSetup() {
      const apiKey = document.getElementById('api-key').value;
      const model = getSelectedModel();
      
      if (!apiKey) {
        showResult('setup-result', 'Please enter an API key', 'error');
        return;
      }
      
      if (!model) {
        showResult('setup-result', 'Please select or enter a model', 'error');
        return;
      }
      
      document.getElementById('run-setup-btn').disabled = true;
      document.getElementById('run-setup-btn').textContent = '⏳ Running...';
      
      try {
        const res = await fetch('/setup/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: selectedProvider, apiKey, model })
        });
        const data = await res.json();
        if (data.success) {
          showResult('setup-result', '✅ Setup completed successfully! You can now start the gateway.', 'success');
        } else {
          showResult('setup-result', '❌ Setup failed: ' + (data.error || data.stderr || 'Unknown error'), 'error');
        }
      } catch (err) {
        showResult('setup-result', '❌ Error: ' + err.message, 'error');
      } finally {
        document.getElementById('run-setup-btn').disabled = false;
        document.getElementById('run-setup-btn').textContent = '🚀 Run Setup';
      }
    }
    
    async function startGateway() {
      try {
        const res = await fetch('/api/gateway/start', { method: 'POST' });
        const data = await res.json();
        showResult('gateway-result', data.message, data.success ? 'success' : 'error');
        if (data.success) setTimeout(() => location.reload(), 1500);
      } catch (err) {
        showResult('gateway-result', '❌ Error: ' + err.message, 'error');
      }
    }
    
    async function stopGateway() {
      try {
        const res = await fetch('/api/gateway/stop', { method: 'POST' });
        const data = await res.json();
        showResult('gateway-result', data.message, data.success ? 'success' : 'error');
        if (data.success) setTimeout(() => location.reload(), 1500);
      } catch (err) {
        showResult('gateway-result', '❌ Error: ' + err.message, 'error');
      }
    }
    
    async function killSwitch() {
      if (!confirm('⚡ This will immediately stop the gateway. Continue?')) return;
      try {
        const res = await fetch('/api/gateway/stop', { method: 'POST' });
        const data = await res.json();
        showResult('danger-result', '⚡ Gateway stopped', 'success');
        setTimeout(() => location.reload(), 1500);
      } catch (err) {
        showResult('danger-result', '❌ Error: ' + err.message, 'error');
      }
    }
    
    async function wipeEverything() {
      if (!confirm('🗑 This will stop the gateway and delete ALL configuration and logs. This cannot be undone. Continue?')) return;
      if (!confirm('⚠️ Are you absolutely sure? Everything will be deleted.')) return;
      
      try {
        const res = await fetch('/api/wipe', { method: 'POST' });
        const data = await res.json();
        showResult('danger-result', '🗑 Everything has been wiped. Reloading...', 'success');
        setTimeout(() => location.reload(), 2000);
      } catch (err) {
        showResult('danger-result', '❌ Error: ' + err.message, 'error');
      }
    }
    
    function showResult(containerId, message, type) {
      const container = document.getElementById(containerId);
      container.classList.remove('hidden', 'bg-green-50', 'text-green-700', 'bg-red-50', 'text-red-700', 'border-green-200', 'border-red-200');
      container.classList.add('border');
      if (type === 'success') {
        container.classList.add('bg-green-50', 'text-green-700', 'border-green-200');
      } else {
        container.classList.add('bg-red-50', 'text-red-700', 'border-red-200');
      }
      container.textContent = message;
    }
  </script>
  `;
  
  return layout('Setup', content, { includeTopBar: true, profile });
}
