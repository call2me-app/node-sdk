# Call2Me Node.js SDK

The official Node.js SDK for [Call2Me](https://call2me.app) — the AI voice agent platform.

[![npm](https://img.shields.io/npm/v/@call2me/sdk)](https://www.npmjs.com/package/@call2me/sdk)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- **14 API Resources** — Full coverage of the Call2Me REST API
- **Voice Agents** — Create agents with 30+ AI models and custom voices
- **Campaigns** — Bulk outbound calling with CSV upload
- **Scheduled Calls** — Book follow-ups at specific dates
- **Knowledge Base** — RAG-powered answers from your documents
- **White-Label** — Custom branding, domain, and tenant management
- **Zero Dependencies** — Uses native `fetch`

## Installation

```bash
npm install @call2me/sdk
```

Requires Node.js 18+

## Getting Your API Key

1. Sign up at [dashboard.call2me.app](https://dashboard.call2me.app/signup) — **$10 free credits**
2. Go to **API Keys** → **Create API Key**
3. Copy your `sk_call2me_...` key

## Quick Start

```javascript
const { Call2Me } = require('@call2me/sdk');
const client = new Call2Me('sk_call2me_...');

const agent = await client.agents.create({
  agent_name: 'Sales Agent',
  voice_id: 'elevenlabs-selin',
  language: 'tr-TR',
  response_engine: { type: 'call2me-llm', system_prompt: 'You are a sales agent.' }
});
```

## Full API Reference

| Resource | Methods |
|----------|---------|
| `client.agents` | `list()` `get(id)` `create(data)` `update(id, data)` `delete(id)` `duplicate(id)` `stats(id)` `globalStats()` |
| `client.calls` | `list()` `get(id)` `end(id)` `recording(id)` |
| `client.knowledgeBases` | `list()` `get(id)` `create(data)` `delete(id)` `addSource(id, data)` `query(id, q)` |
| `client.campaigns` | `list()` `get(id)` `create(data)` `update(id, data)` `delete(id)` `start(id)` `pause(id)` `resume(id)` `cancel(id)` `contacts(id)` |
| `client.schedules` | `list()` `get(id)` `create(data)` `update(id, data)` `delete(id)` `cancel(id)` |
| `client.phoneNumbers` | `list()` `get(num)` `create(data)` `update(num, data)` `delete(num)` `bindAgent(num, agentId)` `unbindAgent(num)` |
| `client.sipTrunks` | `list()` `get(id)` `create(data)` `update(id, data)` `delete(id)` `test(id)` |
| `client.wallet` | `balance()` `transactions()` `analytics()` `pricing()` |
| `client.payments` | `checkout(amount, currency)` `history()` `savedCards()` `autoCharge()` `updateAutoCharge(data)` |
| `client.apiKeys` | `list()` `create(data)` `revoke(id)` `delete(id)` `usage(id)` |
| `client.users` | `me()` `update(data)` `stats()` `usage()` `dailyUsage()` `branding()` `updateBranding(data)` `tenantMembers()` |
| `client.widgets` | `list()` `get(id)` `create(data)` `update(id, data)` `delete(id)` `chat(id, msg)` |
| `client.voices` | `list()` `providers()` |
| `client.chats` | `list()` `get(id)` `sendMessage(id, content)` |

## Links

- [call2me.app](https://call2me.app) · [API Docs](https://call2me.app/docs) · [Guides](https://call2me.app/guides) · [GitHub](https://github.com/call2me-app/node-sdk) · [support@call2me.app](mailto:support@call2me.app)

## License

MIT
