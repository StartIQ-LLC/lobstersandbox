import { layout } from './layout.js';

export function landingPage() {
  const content = `
  <div class="min-h-screen flex flex-col items-center justify-center px-4">
    <div class="text-center max-w-2xl">
      <div class="text-8xl mb-6 animate-bounce" style="animation-duration: 2s;">🦞</div>
      <h1 class="logo-text text-5xl md:text-6xl text-gray-800 mb-4">
        Lobster<span class="text-lobster-600">Sandbox</span>
      </h1>
      <p class="text-xl text-gray-500 mb-8 font-body">Launch OpenClaw in a safe sandbox in minutes.</p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <a href="/setup" class="inline-flex items-center justify-center px-8 py-4 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
          Open Setup
        </a>
        <a href="/openclaw" class="inline-flex items-center justify-center px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
          Open Control UI
        </a>
      </div>
      
      <div class="card p-6 text-left">
        <h2 class="font-display font-semibold text-gray-800 mb-2 text-lg">What is this?</h2>
        <p class="text-gray-600 text-sm mb-4 leading-relaxed">
          LobsterSandbox is a safe environment to try OpenClaw without risking your real accounts. 
          It runs everything locally with safe defaults, easy reset, and a kill switch.
        </p>
        <div class="flex gap-4 text-sm">
          <a href="/status" class="text-lobster-600 hover:text-lobster-700 font-medium">View Status</a>
          <a href="https://docs.openclaw.ai/" target="_blank" class="text-gray-500 hover:text-gray-700">Documentation &rarr;</a>
        </div>
      </div>
    </div>
  </div>
  `;
  
  return layout('Home', content);
}
