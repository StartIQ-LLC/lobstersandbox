import { layout } from './layout.js';

export function loginPage(error = null) {
  const content = `
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="card p-8 w-full max-w-md">
      <div class="text-center mb-6">
        <div class="text-4xl mb-2">🦞</div>
        <h1 class="text-2xl font-bold text-gray-900">Setup Access</h1>
        <p class="text-gray-600 text-sm mt-1">Enter the setup password to continue</p>
      </div>
      
      ${error ? `<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">${error}</div>` : ''}
      
      <form method="POST" action="/setup/login">
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" id="password" name="password" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
        </div>
        <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Continue
        </button>
      </form>
      
      <div class="mt-4 text-center">
        <a href="/" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to home</a>
      </div>
    </div>
  </div>
  `;
  
  return layout('Login', content);
}

export function setupWizardPage(isConfigured = false, gatewayRunning = false) {
  const content = `
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <div class="text-4xl mb-2">🦞</div>
        <h1 class="text-3xl font-bold text-gray-900">LobsterSandbox Setup</h1>
        <p class="text-gray-600 mt-2">Configure your OpenClaw sandbox environment</p>
      </div>
      
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p class="text-amber-800 text-sm">
          <strong>Safety first:</strong> Start with a sandbox mindset. Do not connect your main accounts on day 1.
        </p>
      </div>
      
      <div class="card p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Current Status</h2>
          <a href="/status" class="text-sm text-red-600 hover:text-red-700">View details &rarr;</a>
        </div>
        <div class="flex gap-6 text-sm">
          <div class="flex items-center gap-2">
            <span class="${isConfigured ? 'text-green-500' : 'text-gray-400'}">●</span>
            <span>Setup: ${isConfigured ? 'Complete' : 'Not configured'}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="${gatewayRunning ? 'text-green-500' : 'text-gray-400'}">●</span>
            <span>Gateway: ${gatewayRunning ? 'Running' : 'Stopped'}</span>
          </div>
        </div>
      </div>
      
      <div class="card p-6 mb-6" id="wizard-container">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Setup Wizard</h2>
        
        <div id="wizard-steps">
          <!-- Step 1: Choose Provider -->
          <div id="step-1" class="wizard-step">
            <div class="mb-4">
              <span class="text-xs font-medium text-gray-500 uppercase">Step 1 of 3</span>
              <h3 class="text-md font-medium text-gray-800">Choose AI Provider</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onclick="selectProvider('openai')" class="provider-btn p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 transition-colors text-left" data-provider="openai">
                <div class="font-semibold">OpenAI</div>
                <div class="text-xs text-gray-500">GPT models</div>
              </button>
              <button onclick="selectProvider('anthropic')" class="provider-btn p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 transition-colors text-left" data-provider="anthropic">
                <div class="font-semibold">Anthropic</div>
                <div class="text-xs text-gray-500">Claude models</div>
              </button>
              <button onclick="selectProvider('openrouter')" class="provider-btn p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 transition-colors text-left" data-provider="openrouter">
                <div class="font-semibold">OpenRouter</div>
                <div class="text-xs text-gray-500">Multiple providers</div>
              </button>
            </div>
          </div>
          
          <!-- Step 2: API Key -->
          <div id="step-2" class="wizard-step hidden">
            <div class="mb-4">
              <span class="text-xs font-medium text-gray-500 uppercase">Step 2 of 3</span>
              <h3 class="text-md font-medium text-gray-800">Enter API Key</h3>
            </div>
            <div class="mb-4">
              <label for="api-key" class="block text-sm font-medium text-gray-700 mb-1">
                <span id="provider-label">Provider</span> API Key
              </label>
              <input type="password" id="api-key" placeholder="sk-..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
              <p class="text-xs text-gray-500 mt-1">Your key is stored securely and never logged.</p>
            </div>
            <div class="flex gap-3">
              <button onclick="goToStep(1)" class="px-4 py-2 text-gray-600 hover:text-gray-800">Back</button>
              <button onclick="goToStep(3)" id="next-step-2" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Next</button>
            </div>
          </div>
          
          <!-- Step 3: Model -->
          <div id="step-3" class="wizard-step hidden">
            <div class="mb-4">
              <span class="text-xs font-medium text-gray-500 uppercase">Step 3 of 3</span>
              <h3 class="text-md font-medium text-gray-800">Choose Model</h3>
            </div>
            <div class="mb-4">
              <label for="model-select" class="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select id="model-select" onchange="handleModelSelect()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
              </select>
            </div>
            <div id="custom-model-container" class="mb-4 hidden">
              <label for="custom-model" class="block text-sm font-medium text-gray-700 mb-1">Custom Model Name</label>
              <input type="text" id="custom-model" placeholder="provider/model-name"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            </div>
            <div class="flex gap-3">
              <button onclick="goToStep(2)" class="px-4 py-2 text-gray-600 hover:text-gray-800">Back</button>
              <button onclick="runSetup()" id="run-setup-btn" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Run Setup</button>
            </div>
          </div>
        </div>
        
        <div id="setup-result" class="hidden mt-4 p-4 rounded-lg"></div>
      </div>
      
      <div class="card p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Gateway Control</h2>
        <div class="flex flex-wrap gap-3">
          <button onclick="startGateway()" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">
            Start Gateway
          </button>
          <button onclick="stopGateway()" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm">
            Stop Gateway
          </button>
          <a href="/openclaw" class="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm inline-block">
            Open Control UI
          </a>
        </div>
        <div id="gateway-result" class="mt-3 text-sm"></div>
      </div>
      
      <div class="card p-6 border-2 border-red-200">
        <h2 class="text-lg font-semibold text-red-700 mb-4">Danger Zone</h2>
        <p class="text-sm text-gray-600 mb-4">These actions cannot be undone.</p>
        <div class="flex flex-wrap gap-3">
          <button onclick="killSwitch()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">
            Kill Switch
          </button>
          <button onclick="wipeEverything()" class="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg text-sm">
            Wipe Everything
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
        { value: 'openai/gpt-5.2', label: 'GPT-5.2 (Recommended)' },
        { value: 'openai/gpt-5.1', label: 'GPT-5.1' },
        { value: 'openai/gpt-5', label: 'GPT-5' },
        { value: 'custom', label: 'Custom...' }
      ],
      anthropic: [
        { value: 'anthropic/claude-opus-4-5', label: 'Claude Opus 4.5 (Recommended)' },
        { value: 'anthropic/claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
        { value: 'anthropic/claude-haiku-4-5', label: 'Claude Haiku 4.5' },
        { value: 'custom', label: 'Custom...' }
      ],
      openrouter: [
        { value: 'openrouter/auto', label: 'Auto (Recommended)' },
        { value: 'custom', label: 'Custom...' }
      ]
    };
    
    function selectProvider(provider) {
      selectedProvider = provider;
      document.querySelectorAll('.provider-btn').forEach(btn => {
        btn.classList.remove('border-red-500', 'bg-red-50');
        if (btn.dataset.provider === provider) {
          btn.classList.add('border-red-500', 'bg-red-50');
        }
      });
      goToStep(2);
    }
    
    function goToStep(step) {
      document.querySelectorAll('.wizard-step').forEach(s => s.classList.add('hidden'));
      document.getElementById('step-' + step).classList.remove('hidden');
      
      if (step === 2) {
        const labels = { openai: 'OpenAI', anthropic: 'Anthropic', openrouter: 'OpenRouter' };
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
      document.getElementById('run-setup-btn').textContent = 'Running...';
      
      try {
        const res = await fetch('/setup/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: selectedProvider, apiKey, model })
        });
        const data = await res.json();
        if (data.success) {
          showResult('setup-result', 'Setup completed successfully! You can now start the gateway.', 'success');
        } else {
          showResult('setup-result', 'Setup failed: ' + (data.error || data.stderr || 'Unknown error'), 'error');
        }
      } catch (err) {
        showResult('setup-result', 'Error: ' + err.message, 'error');
      } finally {
        document.getElementById('run-setup-btn').disabled = false;
        document.getElementById('run-setup-btn').textContent = 'Run Setup';
      }
    }
    
    async function startGateway() {
      try {
        const res = await fetch('/api/gateway/start', { method: 'POST' });
        const data = await res.json();
        showResult('gateway-result', data.message, data.success ? 'success' : 'error');
      } catch (err) {
        showResult('gateway-result', 'Error: ' + err.message, 'error');
      }
    }
    
    async function stopGateway() {
      try {
        const res = await fetch('/api/gateway/stop', { method: 'POST' });
        const data = await res.json();
        showResult('gateway-result', data.message, data.success ? 'success' : 'error');
      } catch (err) {
        showResult('gateway-result', 'Error: ' + err.message, 'error');
      }
    }
    
    async function killSwitch() {
      if (!confirm('This will immediately stop the gateway. Continue?')) return;
      try {
        const res = await fetch('/api/gateway/stop', { method: 'POST' });
        const data = await res.json();
        showResult('danger-result', 'Gateway stopped', 'success');
      } catch (err) {
        showResult('danger-result', 'Error: ' + err.message, 'error');
      }
    }
    
    async function wipeEverything() {
      if (!confirm('This will stop the gateway and delete ALL configuration and logs. This cannot be undone. Continue?')) return;
      if (!confirm('Are you absolutely sure?')) return;
      
      try {
        const res = await fetch('/api/wipe', { method: 'POST' });
        const data = await res.json();
        showResult('danger-result', 'Everything has been wiped. You can now set up again.', 'success');
        setTimeout(() => location.reload(), 2000);
      } catch (err) {
        showResult('danger-result', 'Error: ' + err.message, 'error');
      }
    }
    
    function showResult(containerId, message, type) {
      const container = document.getElementById(containerId);
      container.classList.remove('hidden', 'bg-green-50', 'text-green-700', 'bg-red-50', 'text-red-700');
      if (type === 'success') {
        container.classList.add('bg-green-50', 'text-green-700');
      } else {
        container.classList.add('bg-red-50', 'text-red-700');
      }
      container.textContent = message;
    }
  </script>
  `;
  
  return layout('Setup', content, { includeTopBar: true });
}
