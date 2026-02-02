import { layout } from './layout.js';

export function guidePage(options = {}) {
  const { loggedIn = false, gatewayRunning = false } = options;
  
  const content = `
  <div class="min-h-screen flex flex-col items-center px-4 py-8">
    <div class="w-full max-w-3xl">
      
      <div class="text-center mb-12">
        <div class="text-5xl mb-4">📖</div>
        <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
          The Burner Stack Guide
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          How to set up throwaway accounts for AI agents without risking your real digital life.
        </p>
      </div>
      
      <div class="space-y-8">
        
        <div class="card p-6">
          <h2 class="font-display font-bold text-gray-800 text-xl mb-4 flex items-center gap-2">
            <span class="text-2xl">📧</span> Step 1: Burner Email
          </h2>
          <p class="text-gray-600 mb-4">
            Create a fresh email account that you'll use exclusively for AI agent experiments. This keeps your real inbox safe from any automated actions.
          </p>
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <strong>Recommended:</strong> Use a free provider like Gmail, ProtonMail, or Outlook. Create a new account — don't use an existing one.
          </div>
        </div>
        
        <div class="card p-6">
          <h2 class="font-display font-bold text-gray-800 text-xl mb-4 flex items-center gap-2">
            <span class="text-2xl">📱</span> Step 2: Burner Phone (Optional)
          </h2>
          <p class="text-gray-600 mb-4">
            If you want your AI agent to handle calls or SMS, consider a virtual phone number service. This protects your real phone number.
          </p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <strong>Options:</strong> Google Voice (free, US only), Twilio (pay-as-you-go), or similar VoIP services.
          </div>
        </div>
        
        <div class="card p-6">
          <h2 class="font-display font-bold text-gray-800 text-xl mb-4 flex items-center gap-2">
            <span class="text-2xl">💳</span> Step 3: Spending Limits
          </h2>
          <p class="text-gray-600 mb-4">
            AI API usage can add up fast. Set hard spending limits on your AI provider accounts to prevent unexpected bills.
          </p>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
            <strong>Pro tip:</strong> Start with a $5-10 limit. You can always increase it later once you understand your usage patterns.
          </div>
        </div>
        
        <div class="card p-6">
          <h2 class="font-display font-bold text-gray-800 text-xl mb-4 flex items-center gap-2">
            <span class="text-2xl">🔑</span> Step 4: Get Your API Key
          </h2>
          <p class="text-gray-600 mb-4">
            You'll need an API key from an AI provider. LobsterSandbox supports OpenAI, Anthropic, Google Gemini, and more.
          </p>
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800">
            <strong>Bring Your Own Key (BYOK):</strong> We never see or store your API keys outside your sandbox. You're always in control.
          </div>
        </div>
        
        <div class="card p-6">
          <h2 class="font-display font-bold text-gray-800 text-xl mb-4 flex items-center gap-2">
            <span class="text-2xl">🦞</span> Step 5: Launch Your Sandbox
          </h2>
          <p class="text-gray-600 mb-4">
            Once you have your burner email and API key ready, you're all set to safely experiment with AI agents.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 mt-6">
            <a href="/setup" class="inline-flex items-center justify-center px-6 py-3 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
              🚀 Launch Your Sandbox
            </a>
            <a href="/" class="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl border border-gray-200">
              ← Back to Home
            </a>
          </div>
        </div>
        
      </div>
      
      <div class="text-center mt-12 text-sm text-gray-500">
        <p>Remember: If anything feels off, you can always hit <strong>Kill Switch</strong> to stop everything or <strong>Wipe</strong> to start fresh.</p>
      </div>
      
    </div>
  </div>
  `;
  
  return layout('Burner Stack Guide', content, { loggedIn, gatewayRunning });
}
