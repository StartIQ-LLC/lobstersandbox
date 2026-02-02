import { layout } from './layout.js';

export function errorPage({ title = 'Error', message = 'Something went wrong', code = 500, showHomeLink = true }) {
  const content = `
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-8">
    <div class="text-center max-w-lg">
      <div class="text-6xl mb-4">${code === 404 ? '🔍' : '⚠️'}</div>
      <h1 class="font-display font-bold text-4xl text-gray-800 mb-4">${code}</h1>
      <h2 class="font-display font-semibold text-xl text-gray-600 mb-4">${title}</h2>
      <p class="text-gray-500 mb-8">${message}</p>
      ${showHomeLink ? `
      <a href="/" class="inline-flex items-center justify-center px-6 py-3 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg">
        Go Home
      </a>
      ` : ''}
    </div>
  </div>
  `;
  
  return layout(title, content, { showTopBar: false, showAssistant: false });
}

export function notFoundPage() {
  return errorPage({
    title: 'Page Not Found',
    message: "The page you're looking for doesn't exist or has been moved.",
    code: 404
  });
}

export function serverErrorPage(requestId = null) {
  return errorPage({
    title: 'Server Error',
    message: requestId 
      ? `Something went wrong on our end. Reference: ${requestId}`
      : 'Something went wrong on our end. Please try again later.',
    code: 500
  });
}
