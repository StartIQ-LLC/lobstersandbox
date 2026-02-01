import { layout } from './layout.js';

export function toolsPage(toolsStatus = {}, profile = null) {
  const { webSearch = {} } = toolsStatus;
  
  const content = `
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🦞</div>
        <h1 class="logo-text text-3xl text-gray-800">Web <span class="text-lobster-600">Tools</span></h1>
        <p class="text-gray-500 mt-2">Enable web search and other agent capabilities</p>
      </div>
      
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p class="text-blue-800 text-sm flex items-start gap-2">
          <span class="text-lg">💡</span>
          <span><strong>Recommended:</strong> Set up web search so your AI can look up current information from the internet.</span>
        </p>
      </div>
      
      <!-- Web Search Section -->
      <div class="card p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">🔍</div>
            <div>
              <h2 class="font-display font-semibold text-gray-800">Web Search</h2>
              <p class="text-sm text-gray-500">Search the internet via Brave or Perplexity</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${webSearch.enabled ? 'bg-green-500' : 'bg-gray-300'}"></span>
            <span class="text-sm text-gray-600">${webSearch.enabled ? 'Enabled' : 'Not configured'}</span>
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Provider</label>
          <select id="search-provider" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white" onchange="toggleProviderFields()">
            <option value="brave" ${webSearch.provider === 'brave' || !webSearch.provider ? 'selected' : ''}>Brave Search (recommended)</option>
            <option value="perplexity" ${webSearch.provider === 'perplexity' ? 'selected' : ''}>Perplexity Sonar (via OpenRouter)</option>
          </select>
        </div>
        
        <!-- Brave Section -->
        <div id="brave-section" class="${webSearch.provider === 'perplexity' ? 'hidden' : ''}">
          <div class="bg-gray-50 rounded-xl p-4 mb-4">
            <h3 class="font-medium text-gray-800 mb-2">Get a Brave API Key</h3>
            <ol class="text-sm text-gray-600 space-y-2">
              <li class="flex gap-2"><span class="font-semibold text-lobster-600">1.</span> Go to <a href="https://brave.com/search/api/" target="_blank" class="text-orange-600 hover:underline">brave.com/search/api</a></li>
              <li class="flex gap-2"><span class="font-semibold text-lobster-600">2.</span> Create an account and select "Data for Search" plan</li>
              <li class="flex gap-2"><span class="font-semibold text-lobster-600">3.</span> Generate an API key (free tier available!)</li>
              <li class="flex gap-2"><span class="font-semibold text-lobster-600">4.</span> Paste the key below</li>
            </ol>
          </div>
          
          <div class="mb-4">
            <label for="brave-api-key" class="block text-sm font-medium text-gray-700 mb-2">Brave API Key</label>
            <input type="password" id="brave-api-key" placeholder="BSA..."
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
            ${webSearch.provider === 'brave' && webSearch.apiKeyMasked ? `<p class="text-xs text-green-600 mt-2">✓ API key configured: ${webSearch.apiKeyMasked}</p>` : ''}
            <p class="text-xs text-gray-500 mt-1">🔒 Your API key is stored securely and never logged.</p>
          </div>
        </div>
        
        <!-- Perplexity Section -->
        <div id="perplexity-section" class="${webSearch.provider !== 'perplexity' ? 'hidden' : ''}">
          <div class="bg-gray-50 rounded-xl p-4 mb-4">
            <h3 class="font-medium text-gray-800 mb-2">Get an OpenRouter API Key</h3>
            <ol class="text-sm text-gray-600 space-y-2">
              <li class="flex gap-2"><span class="font-semibold text-lobster-600">1.</span> Go to <a href="https://openrouter.ai/keys" target="_blank" class="text-orange-600 hover:underline">openrouter.ai/keys</a></li>
              <li class="flex gap-2"><span class="font-semibold text-lobster-600">2.</span> Create an account and add credits (supports crypto!)</li>
              <li class="flex gap-2"><span class="font-semibold text-lobster-600">3.</span> Generate an API key</li>
              <li class="flex gap-2"><span class="font-semibold text-lobster-600">4.</span> Paste the key below</li>
            </ol>
          </div>
          
          <div class="mb-4">
            <label for="openrouter-api-key" class="block text-sm font-medium text-gray-700 mb-2">OpenRouter API Key</label>
            <input type="password" id="openrouter-api-key" placeholder="sk-or-v1-..."
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
            ${webSearch.provider === 'perplexity' && webSearch.apiKeyMasked ? `<p class="text-xs text-green-600 mt-2">✓ API key configured: ${webSearch.apiKeyMasked}</p>` : ''}
            <p class="text-xs text-gray-500 mt-1">🔒 Perplexity Sonar provides AI-synthesized answers with citations.</p>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Perplexity Model</label>
            <select id="perplexity-model" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white">
              <option value="perplexity/sonar-pro" ${webSearch.perplexityModel === 'perplexity/sonar-pro' ? 'selected' : ''}>Sonar Pro (default - multi-step reasoning)</option>
              <option value="perplexity/sonar" ${webSearch.perplexityModel === 'perplexity/sonar' ? 'selected' : ''}>Sonar (fast Q&A)</option>
              <option value="perplexity/sonar-reasoning-pro" ${webSearch.perplexityModel === 'perplexity/sonar-reasoning-pro' ? 'selected' : ''}>Sonar Reasoning Pro (deep research)</option>
            </select>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <button onclick="saveWebSearchConfig()" class="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-medium shadow-md transition-all">
            💾 Save Web Search Config
          </button>
          <button onclick="disableWebSearch()" class="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-medium transition-all ${webSearch.enabled ? '' : 'hidden'}" id="disable-search-btn">
            Disable
          </button>
        </div>
        <div id="search-result" class="mt-3 text-sm"></div>
      </div>
      
      <!-- Web Fetch Info -->
      <div class="card p-6 mb-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">📥</div>
          <div>
            <h2 class="font-display font-semibold text-gray-800">Web Fetch</h2>
            <p class="text-sm text-gray-500">Fetch and read content from URLs</p>
          </div>
        </div>
        <p class="text-sm text-gray-600">
          ✅ Web fetch is <strong>enabled by default</strong> - your AI can already read content from URLs without any configuration. 
          This tool extracts readable text from web pages (HTML → markdown).
        </p>
      </div>
      
      <div class="text-center">
        <a href="/setup" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Setup</a>
        <span class="mx-2 text-gray-300">|</span>
        <a href="/channels" class="text-sm text-gray-500 hover:text-gray-700">Channels &rarr;</a>
      </div>
    </div>
  </div>
  
  <script>
    function toggleProviderFields() {
      const provider = document.getElementById('search-provider').value;
      document.getElementById('brave-section').classList.toggle('hidden', provider !== 'brave');
      document.getElementById('perplexity-section').classList.toggle('hidden', provider !== 'perplexity');
    }
    
    function showResult(id, message, type) {
      const el = document.getElementById(id);
      el.className = 'mt-3 text-sm ' + (type === 'error' ? 'text-red-600' : 'text-green-600');
      el.textContent = message;
    }
    
    async function saveWebSearchConfig() {
      const provider = document.getElementById('search-provider').value;
      let payload = { provider };
      
      if (provider === 'brave') {
        const apiKey = document.getElementById('brave-api-key').value;
        if (!apiKey && !${webSearch.enabled ? 'true' : 'false'}) {
          showResult('search-result', 'Please enter your Brave API key', 'error');
          return;
        }
        if (apiKey) payload.apiKey = apiKey;
      } else {
        const apiKey = document.getElementById('openrouter-api-key').value;
        if (!apiKey && !${webSearch.enabled ? 'true' : 'false'}) {
          showResult('search-result', 'Please enter your OpenRouter API key', 'error');
          return;
        }
        if (apiKey) payload.apiKey = apiKey;
        payload.model = document.getElementById('perplexity-model').value;
      }
      
      try {
        const res = await fetch('/api/tools/web-search/configure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (data.success) {
          showResult('search-result', '✅ Web search configured! Restart gateway to apply.', 'success');
          setTimeout(() => location.reload(), 2000);
        } else {
          showResult('search-result', data.error || 'Failed to save config', 'error');
        }
      } catch (err) {
        showResult('search-result', 'Error: ' + err.message, 'error');
      }
    }
    
    async function disableWebSearch() {
      if (!confirm('Disable web search? Your AI will not be able to search the internet.')) return;
      
      try {
        const res = await fetch('/api/tools/web-search/disable', { method: 'POST' });
        const data = await res.json();
        showResult('search-result', data.message || 'Web search disabled', data.success ? 'success' : 'error');
        if (data.success) setTimeout(() => location.reload(), 1500);
      } catch (err) {
        showResult('search-result', 'Error: ' + err.message, 'error');
      }
    }
  </script>
  `;
  
  return layout('Web Tools', content, { includeTopBar: true, profile });
}
