import { layout } from './layout.js';

const EXPLORER_FEATURES = [
  { included: true, text: 'Full sandbox environment' },
  { included: true, text: 'All safety controls (Kill Switch, Wipe, Safe Mode)' },
  { included: true, text: 'Burner Stack Guide' },
  { included: true, text: '3 starter missions (Hello Lobster, Research Assistant, Personal Scribe)' },
  { included: true, text: 'WebChat + 1 external channel' },
  { included: true, text: 'Community support' },
  { included: false, text: '"Powered by LobsterSandbox" branding visible' }
];

const PRO_FEATURES = [
  { included: true, text: 'Everything in Explorer' },
  { included: true, text: 'API cost tracking with budget alerts' },
  { included: true, text: 'Auto-pause at budget limit' },
  { included: true, text: 'All 6 sandbox missions (including Discord, Cron, Skill Builder)' },
  { included: true, text: 'Unlimited external channels' },
  { included: true, text: 'Config export for production migration' },
  { included: true, text: 'No "Powered by" branding' },
  { included: true, text: 'Priority email support' },
  { included: true, text: 'Auto-updates to latest stable OpenClaw' }
];

const TEAM_FEATURES = [
  { included: true, text: 'Everything in Pro' },
  { included: true, text: 'Up to 5 team members' },
  { included: true, text: 'Shared sandbox environment' },
  { included: true, text: 'Admin dashboard with team activity' },
  { included: true, text: 'Team onboarding flow' },
  { included: true, text: 'Priority support' }
];

const FAQ_ITEMS = [
  {
    question: 'Is OpenClaw itself free?',
    answer: 'Yes! OpenClaw is open source and always free. LobsterSandbox adds the safety layer, guided setup, cost tracking, and managed experience on top.'
  },
  {
    question: 'What about AI model costs?',
    answer: 'AI model costs (Anthropic Claude, OpenAI GPT, etc.) are separate and paid directly to your provider. LobsterSandbox helps you set spending limits and track costs so there are no surprises. Testing with Claude Haiku or GPT-4o-mini typically costs a few cents per session.'
  },
  {
    question: 'Can I self-host LobsterSandbox?',
    answer: 'LobsterSandbox is open source. You can fork it and run it yourself for free. Paid plans add managed hosting, cost tracking, automatic updates, and support.'
  },
  {
    question: 'What happens when I outgrow the sandbox?',
    answer: 'We help you graduate! Pro users can export their sandbox config and follow our migration guide to set up a full OpenClaw instance on their own hardware or cloud provider.'
  },
  {
    question: 'Can I change or cancel my plan?',
    answer: 'Upgrade, downgrade, or cancel anytime. Your sandbox stays accessible. If you cancel a paid plan, you keep Explorer-tier features.'
  },
  {
    question: 'Is my data safe?',
    answer: 'Your sandbox data stays on your instance. We don\'t have access to your AI conversations, API keys, or connected accounts. That\'s the whole point.'
  }
];

function renderFeatureList(features) {
  return features.map(f => {
    if (f.included) {
      return `<li class="flex items-start gap-2"><span class="text-green-500 font-bold">✓</span><span>${f.text}</span></li>`;
    } else {
      return `<li class="flex items-start gap-2"><span class="text-gray-300">☐</span><span class="text-gray-400">${f.text}</span></li>`;
    }
  }).join('');
}

function renderFaqItem(item, index) {
  return `
    <div class="border-b border-gray-200 last:border-b-0">
      <button 
        onclick="toggleFaq(${index})" 
        class="w-full py-4 px-1 flex items-center justify-between text-left hover:text-red-600 transition-colors"
        aria-expanded="false"
        id="faq-btn-${index}"
      >
        <span class="font-medium text-gray-800">${item.question}</span>
        <span id="faq-arrow-${index}" class="text-gray-400 transition-transform duration-200">▼</span>
      </button>
      <div id="faq-answer-${index}" class="hidden pb-4 px-1 text-gray-600 leading-relaxed">
        ${item.answer}
      </div>
    </div>
  `;
}

export function pricingPage(options = {}) {
  const { loggedIn = false, gatewayRunning = false } = options;
  
  const faqHtml = FAQ_ITEMS.map((item, index) => renderFaqItem(item, index)).join('');
  
  const content = `
  <div class="min-h-screen flex flex-col items-center px-4 py-8">
    <div class="w-full max-w-5xl">
      
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
          Pricing
        </h1>
        <p class="text-xl text-gray-600 mb-4">
          Start free. Upgrade when you're ready.
        </p>
        <p class="text-sm text-gray-500 max-w-2xl mx-auto">
          LobsterSandbox is the safety and guidance layer. OpenClaw is free and open source. AI model API costs are separate and paid directly to your provider (Anthropic, OpenAI, etc.).
        </p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-6 mb-16">
        
        <div class="card p-6 flex flex-col">
          <div class="text-center mb-6">
            <h2 class="text-xl font-bold text-gray-800 mb-2">Explorer</h2>
            <div class="mb-1">
              <span class="text-4xl font-bold text-gray-900">$0</span>
            </div>
            <p class="text-sm text-gray-500">forever</p>
          </div>
          
          <ul class="space-y-3 text-sm flex-1 mb-6">
            ${renderFeatureList(EXPLORER_FEATURES)}
          </ul>
          
          <div class="mt-auto">
            <a href="/setup" class="block w-full py-3 px-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-medium text-center transition-all">
              Start Free
            </a>
            <p class="text-xs text-gray-400 text-center mt-2">No credit card required</p>
          </div>
        </div>
        
        <div class="card p-6 flex flex-col ring-2 ring-red-500 shadow-xl relative transform md:scale-105">
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
          </div>
          
          <div class="text-center mb-6">
            <h2 class="text-xl font-bold text-gray-800 mb-2">Pro</h2>
            <div class="mb-1">
              <span class="text-4xl font-bold text-gray-900">$19</span>
            </div>
            <p class="text-sm text-gray-500">/month</p>
          </div>
          
          <ul class="space-y-3 text-sm flex-1 mb-6">
            ${renderFeatureList(PRO_FEATURES)}
          </ul>
          
          <div class="mt-auto">
            <a href="/setup?plan=pro" class="block w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-center transition-all shadow-lg">
              Start 14-Day Free Trial
            </a>
            <p class="text-xs text-gray-400 text-center mt-2">14-day free trial. Cancel anytime.</p>
          </div>
        </div>
        
        <div class="card p-6 flex flex-col">
          <div class="text-center mb-6">
            <h2 class="text-xl font-bold text-gray-800 mb-2">Team</h2>
            <div class="mb-1">
              <span class="text-4xl font-bold text-gray-900">$49</span>
            </div>
            <p class="text-sm text-gray-500">/month</p>
          </div>
          
          <ul class="space-y-3 text-sm flex-1 mb-6">
            ${renderFeatureList(TEAM_FEATURES)}
          </ul>
          
          <div class="mt-auto">
            <a href="/setup?plan=team" class="block w-full py-3 px-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-medium text-center transition-all">
              Start Team Trial
            </a>
            <p class="text-xs text-gray-400 text-center mt-2">14-day free trial. Cancel anytime.</p>
          </div>
        </div>
        
      </div>
      
      <div class="card p-6 md:p-8 max-w-3xl mx-auto">
        <h2 class="text-2xl font-display font-bold text-gray-800 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div class="divide-y divide-gray-200">
          ${faqHtml}
        </div>
      </div>
      
    </div>
  </div>
  
  <script>
    function toggleFaq(index) {
      const answer = document.getElementById('faq-answer-' + index);
      const arrow = document.getElementById('faq-arrow-' + index);
      const btn = document.getElementById('faq-btn-' + index);
      
      const isOpen = !answer.classList.contains('hidden');
      
      if (isOpen) {
        answer.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        answer.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
        btn.setAttribute('aria-expanded', 'true');
      }
    }
  </script>
  `;
  
  return layout('Pricing', content, { loggedIn, gatewayRunning });
}
