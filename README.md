# LobsterSandbox 🦞

A safe sandbox launcher for [OpenClaw](https://openclaw.ai/) - try OpenClaw without touching your real accounts.

## What is LobsterSandbox?

LobsterSandbox is a simple web interface that lets non-technical users set up OpenClaw in minutes using a clean setup wizard. It runs the OpenClaw gateway inside a safe sandbox environment with:

- **Safe defaults** - Loopback-only binding, token authentication
- **Easy reset** - Wipe everything and start fresh anytime
- **Kill switch** - Stop the gateway instantly
- **No risk** - Your real accounts stay untouched

## Quick Start

### 1. Set Up Secrets

In your Replit project, add these secrets:

| Secret | Description |
|--------|-------------|
| `SETUP_PASSWORD` | Password to access the setup wizard |
| `OPENCLAW_GATEWAY_TOKEN` | A long random token for gateway authentication |

Optional:
| Secret | Default | Description |
|--------|---------|-------------|
| `OPENCLAW_PORT` | `18789` | Port for the OpenClaw gateway |

### 2. Run the App

Click the **Run** button in Replit.

### 3. Configure OpenClaw

1. Open `/setup` in your browser
2. Enter the setup password
3. Choose your AI provider (OpenAI, Anthropic, or OpenRouter)
4. Paste your API key
5. Select a model
6. Click **Run Setup**
7. Click **Start Gateway**

### 4. Use the Control UI

Open `/openclaw` to access the OpenClaw Control UI through the secure reverse proxy.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/setup` | Setup wizard (password protected) |
| `/status` | System status, health checks, and logs |
| `/openclaw` | OpenClaw Control UI (reverse proxied) |

## Security Features

- Gateway binds to loopback only (127.0.0.1)
- Token authentication required for gateway access
- API keys are never logged or displayed
- Rate limiting on sensitive endpoints
- Secure session handling

## Troubleshooting

### Gateway won't start
- Check that setup completed successfully
- View logs at `/status` for error details
- Try running "Quick Verify" from the status page

### Can't access /openclaw
- Make sure the gateway is running (check status page)
- Try stopping and restarting the gateway

### API key errors
- Verify your API key is valid and has the correct permissions
- Make sure you selected the right provider

### Need to start fresh
- Use "Wipe Everything" in the danger zone to reset completely
- This removes all configuration and logs

## Documentation

- [OpenClaw Getting Started](https://docs.openclaw.ai/start/getting-started)
- [OpenClaw Setup Wizard](https://docs.openclaw.ai/start/wizard)
- [OpenAI Provider](https://docs.openclaw.ai/providers/openai)
- [OpenRouter Provider](https://docs.openclaw.ai/providers/openrouter)
- [CLI Reference](https://docs.openclaw.ai/cli)
- [Gateway CLI](https://docs.openclaw.ai/cli/gateway)
- [Security](https://docs.openclaw.ai/cli/security)
- [FAQ](https://docs.openclaw.ai/help/faq)

## License

MIT
