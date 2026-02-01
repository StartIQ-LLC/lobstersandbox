import { layout } from './layout.js';

export function landingPage() {
  const content = `
  <div class="min-h-screen flex flex-col items-center justify-center px-4">
    <div class="text-center max-w-2xl">
      <div class="text-8xl mb-6">🦞</div>
      <h1 class="text-5xl font-bold text-gray-900 mb-4">LobsterSandbox</h1>
      <p class="text-xl text-gray-600 mb-8">Launch OpenClaw in a safe sandbox in minutes.</p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <a href="/setup" class="inline-flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
          Open Setup
        </a>
        <a href="/openclaw" class="inline-flex items-center justify-center px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors">
          Open Control UI
        </a>
      </div>
      
      <div class="card p-6 text-left">
        <h2 class="font-semibold text-gray-800 mb-2">What is this?</h2>
        <p class="text-gray-600 text-sm mb-4">
          LobsterSandbox is a safe environment to try OpenClaw without risking your real accounts. 
          It runs everything locally with safe defaults, easy reset, and a kill switch.
        </p>
        <div class="flex gap-4 text-sm">
          <a href="/status" class="text-red-600 hover:text-red-700">View Status</a>
          <a href="https://docs.openclaw.ai/" target="_blank" class="text-gray-500 hover:text-gray-700">Documentation &rarr;</a>
        </div>
      </div>
    </div>
  </div>
  `;
  
  return layout('Home', content);
}
