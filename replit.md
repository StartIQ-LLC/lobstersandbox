# LobsterSandbox

## Overview
LobsterSandbox is a secure, web-based sandbox launcher for OpenClaw within Replit. It offers a setup wizard and management interface, focusing on providing a safe and isolated environment for users to experience AI agents. Its core promise is to allow users to "Try OpenClaw safely without getting wrecked," appealing to non-technical users, developers, and anyone seeking a secure entry point to AI agent technology. The project emphasizes not creating accounts for users, not asking for main accounts, and not storing API keys outside the sandbox.

## User Preferences
- **Communication Style**: I prefer clear, concise, and simple language.
- **Workflow**: I want an iterative development process.
- **Interaction**: Ask before making major changes.
- **Safety**: Do not make changes to files or folders that contain sensitive user data or API keys.
- **Explanations**: Provide detailed explanations for complex features or decisions.

## System Architecture
LobsterSandbox is built with Node.js 22 and Express.js, utilizing server-rendered HTML with Tailwind CSS (CDN) for the UI, and Nunito for fonts. Key architectural decisions prioritize security, user-friendliness, and isolation.

### UI/UX Decisions
- **Design**: Web-based setup wizard and management interface.
- **Templates**: Server-rendered HTML with a consistent layout including a top navigation bar and chat assistant.
- **Pages**: Landing page with a safety checklist, setup wizard (login + sandbox identity playbook), status page with Safe Mode/Power Mode awareness, profile selector, channel setup (Power Mode only), and web tools setup (Power Mode only).

### Technical Implementations
- **Reverse Proxy**: Uses `http-proxy-middleware` with WebSocket support to OpenClaw Control UI.
- **Rate Limiting**: Implemented with `express-rate-limit` for security.
- **AI Assistant**: Integrates Anthropic Claude Haiku via Replit AI Integrations ("Larry the Lobster").
- **CLI**: Manages the OpenClaw npm package.
- **Security**:
    - **Authentication**: Session-based with secure cookies, password protection, session timeouts, and hashing for password comparison.
    - **Authorization**: Protected routes require login; specific features are gated by "Safe Mode" versus "Power Mode".
    - **CSRF Protection**: CSRF tokens are required for all POST routes, along with Origin/Referer validation.
    - **Secret Management**: API keys are masked in logs and UI; secrets are not stored outside the sandbox.
    - **Gateway Security**: OpenClaw gateway binds to loopback, uses token authentication, and explicitly authenticates WebSocket upgrades.
- **State Management**: Profile, logs, and configuration are stored persistently in the `./data` directory, necessitating a VM deployment type (not autoscale).
- **Logging**: Structured logging with secret masking, security event logging, and global error handling.

### Feature Specifications
- **Setup Wizard**: Password-protected, 3-step flow (extended to 4 steps for budget management).
- **AI Provider Support**: Supports 9 AI providers (OpenAI, Anthropic, Google Gemini, OpenRouter, Moonshot AI, MiniMax, OpenCode Zen, Vercel AI, Synthetic).
- **OpenClaw Management**: Start, stop, and kill OpenClaw gateway functionalities.
- **Security Tools**: Audit, verify, and fix functionalities.
- **Data Management**: Wipe and reset functionality with password confirmation.
- **Budget Tracking**: API cost tracking, pricing configuration, usage estimation, and budget alerts for 9 AI providers.
- **Safety Modes**: "Safe Mode" (default) and "Power Mode" with distinct access levels to sensitive features like channel and tool setup.

## External Dependencies
- **Runtime**: Node.js 22
- **Framework**: Express.js
- **Styling**: Tailwind CSS (CDN)
- **Fonts**: Nunito
- **Proxy**: `http-proxy-middleware`
- **Rate Limiting**: `express-rate-limit`
- **AI Assistant**: Anthropic Claude Haiku (via Replit AI Integrations)
- **CLI**: OpenClaw npm package
- **Logging**: Winston
- **Testing**: Jest/Supertest