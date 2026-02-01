# LobsterSandbox

## Overview
LobsterSandbox is a safe sandbox launcher for OpenClaw. It provides a web-based setup wizard and management interface for running OpenClaw in a secure, isolated environment within Replit.

## Project Structure

```
├── server.js           # Express server with all routes and reverse proxy
├── lib/
│   └── openclaw.js     # OpenClaw CLI helpers and gateway management
├── views/
│   ├── layout.js       # Base HTML layout template
│   ├── landing.js      # Landing page view
│   ├── setup.js        # Setup wizard views (login + wizard)
│   └── status.js       # Status page view
├── data/
│   ├── home/           # OpenClaw configuration directory (OPENCLAW_HOME)
│   └── logs/           # OpenClaw log files
├── package.json        # Node.js dependencies
└── README.md           # User documentation
```

## Tech Stack
- **Runtime**: Node.js 22
- **Framework**: Express.js
- **Templating**: Server-rendered HTML with Tailwind CSS (CDN)
- **Proxy**: http-proxy-middleware with WebSocket support
- **Rate Limiting**: express-rate-limit
- **CLI**: OpenClaw npm package

## Key Features
1. Password-protected setup wizard with 3-step flow
2. OpenClaw gateway management (start/stop/kill)
3. Reverse proxy to OpenClaw Control UI with WebSocket support
4. Secret masking in all logs and UI output
5. Security tools (audit, verify, fix)
6. Wipe and reset functionality

## Environment Variables
- `PORT` - Server port (default: 5000, provided by Replit)
- `SETUP_PASSWORD` - Required password for setup access
- `OPENCLAW_GATEWAY_TOKEN` - Required token for gateway authentication
- `OPENCLAW_PORT` - Gateway port (default: 18789)
- `OPENCLAW_BIND` - Gateway bind address (default: loopback)
- `OPENCLAW_HOME` - OpenClaw config directory (default: ./data/home)
- `OPENCLAW_LOG` - Log file path (default: ./data/logs/openclaw.log)

## Routes
- `GET /` - Landing page
- `GET /setup` - Setup wizard (password protected)
- `POST /setup/login` - Password login
- `POST /setup/run` - Run OpenClaw onboarding
- `GET /status` - System status and logs
- `GET /openclaw/*` - Reverse proxy to OpenClaw Control UI
- `POST /api/gateway/start` - Start gateway
- `POST /api/gateway/stop` - Stop gateway
- `GET /api/health` - Get health status
- `GET /api/logs` - Get last 200 log lines
- `POST /api/verify` - Run quick verify
- `POST /api/security/audit` - Run security audit
- `POST /api/security/fix` - Run security fix
- `POST /api/wipe` - Wipe everything

## Security
- Gateway binds to loopback only
- Token authentication on gateway
- API keys masked in logs and UI
- Rate limiting on login and API endpoints
- Secure session cookies

## Recent Changes
- Initial project setup (February 2026)
