# Call2Me Node.js SDK

The official Node.js SDK for [Call2Me](https://call2me.app) — the AI voice agent platform.

Build, deploy, and manage AI voice agents that handle real phone calls, extract data, and take automated actions.

[![npm](https://img.shields.io/npm/v/@call2me/sdk)](https://www.npmjs.com/package/@call2me/sdk)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- **Voice Agents** — Create and manage AI agents with custom voices and personalities
- **Phone & Web Calls** — Handle inbound/outbound calls via SIP or browser
- **30+ AI Models** — GPT, Claude, Gemini, DeepSeek, Llama, and more
- **Knowledge Base** — RAG-powered answers from your documents
- **Campaigns** — Bulk outbound calling at scale
- **Scheduled Calls** — Book follow-up calls automatically
- **Post-Call Intelligence** — Extract structured data from every conversation
- **Multi-Language** — Turkish, English, German, French, Spanish, Arabic

## Installation

```bash
npm install @call2me/sdk
```

Requires Node.js 18+ (uses native `fetch`)

## Getting Your API Key

1. Sign up at [dashboard.call2me.app](https://dashboard.call2me.app/signup) — you get **$10 free credits**
2. Go to **API Keys** in the dashboard
3. Click **Create API Key** and copy it

## Quick Start

```javascript
const { Call2Me } = require('@call2me/sdk');

const client = new Call2Me('sk_call2me_...');

// Create a voice agent
const agent = await client.agents.create({
  agent_name: 'Customer Support',
  voice_id: 'elevenlabs-selin',
  language: 'tr-TR',
  response_engine: {
    type: 'call2me-llm',
    system_prompt: 'You are a friendly customer support agent.'
  }
});
console.log(`Agent created: ${agent.agent_id}`);
```

## Usage Examples

### List Agents

```javascript
const agents = await client.agents.list();
agents.forEach(a => {
  console.log(`${a.agent_id} — ${a.agent_name} (${a.status})`);
});
```

### Get Call History

```javascript
const calls = await client.calls.list(10);
calls.forEach(c => {
  console.log(`${c.call_id} | ${c.direction} | ${c.call_status}`);
});
```

### Knowledge Base

```javascript
// Create
const kb = await client.knowledgeBases.create({
  name: 'Product FAQ',
  description: 'Frequently asked questions'
});

// Query
const results = await client.knowledgeBases.query(kb.id, 'What is the return policy?');
```

### Campaigns

```javascript
// Create and start a campaign
const campaign = await client.campaigns.create({
  name: 'Spring Sale',
  agent_id: 'agent_abc123',
  from_number: '+908501234567'
});

await client.campaigns.start(campaign.id);
```

### Scheduled Calls

```javascript
await client.schedules.create({
  agent_id: 'agent_abc123',
  phone_number: '+905551234567',
  scheduled_at: '2026-04-15T10:00:00+03:00',
  timezone: 'Europe/Istanbul'
});
```

### Check Balance

```javascript
const balance = await client.wallet.balance();
console.log(`Balance: $${balance.balance_usd}`);
```

## API Reference

| Resource | Methods |
|----------|---------|
| `client.agents` | `list()`, `get(id)`, `create(data)`, `update(id, data)`, `delete(id)`, `duplicate(id)` |
| `client.calls` | `list()`, `get(id)` |
| `client.knowledgeBases` | `list()`, `create(data)`, `query(id, query)` |
| `client.wallet` | `balance()`, `transactions()` |
| `client.campaigns` | `list()`, `create(data)`, `start(id)`, `pause(id)` |
| `client.schedules` | `list()`, `create(data)` |

## ESM Support

```javascript
import { Call2Me } from '@call2me/sdk';
```

## Error Handling

```javascript
try {
  const agent = await client.agents.get('invalid_id');
} catch (err) {
  console.error(err.message); // "Call2Me API Error 404: Agent not found"
}
```

## Documentation

- **Full API Docs**: [call2me.app/docs](https://call2me.app/docs)
- **Guides**: [call2me.app/guides](https://call2me.app/guides)
- **Pricing**: [call2me.app/pricing](https://call2me.app/pricing)

## Support

- Email: [support@call2me.app](mailto:support@call2me.app)
- Website: [call2me.app](https://call2me.app)

## License

MIT — see [LICENSE](LICENSE) for details.
