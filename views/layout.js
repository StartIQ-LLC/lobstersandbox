export function layout(title, content, options = {}) {
  const { includeTopBar = false, backLink = null } = options;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - LobsterSandbox</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .lobster-gradient {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
    }
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">
  ${includeTopBar ? `
  <div class="bg-gray-900 text-white py-2 px-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span class="text-xl">🦞</span>
      <span class="font-semibold">LobsterSandbox</span>
    </div>
    <div class="flex gap-4">
      ${backLink ? `<a href="${backLink}" class="text-gray-300 hover:text-white text-sm">&larr; Back</a>` : ''}
      <a href="/status" class="text-gray-300 hover:text-white text-sm">Status</a>
      <a href="/setup" class="text-gray-300 hover:text-white text-sm">Setup</a>
    </div>
  </div>
  ` : ''}
  ${content}
</body>
</html>`;
}
