# Call2Me Node.js SDK

The official Node.js SDK for [Call2Me](https://call2me.app) — the AI voice agent platform.

Build, deploy, and manage AI voice agents that handle real phone calls, extract data, and take automated actions.

[![npm](https://img.shields.io/npm/v/call2me-sdk)](https://www.npmjs.com/package/call2me-sdk)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- **14 API Resources** — Full coverage of the Call2Me REST API
- **Voice Agents** — Create agents with 30+ AI models and custom voices
- **Phone & Web Calls** — Inbound/outbound via SIP, browser, or chat widget
- **Campaigns** — Bulk outbound calling with CSV upload
- **Scheduled Calls** — Book follow-ups at specific dates
- **Post-Call Intelligence** — Auto-extract data and trigger actions
- **Knowledge Base** — RAG-powered answers from your documents
- **White-Label** — Custom branding, domain, and tenant management
- **Payments** — Checkout, saved cards, auto-charge
- **Zero Dependencies** — Uses native `fetch`

## Installation

```bash
npm install call2me-sdk
```

Requires Node.js 18+

## Getting Your API Key

1. Sign up at [dashboard.call2me.app](https://dashboard.call2me.app/signup) — you get **$10 free credits**
2. Go to **API Keys** in the dashboard
3. Click **Create API Key** and copy your `sk_call2me_...` key

## Quick Start

```javascript
const { Call2Me } = require('call2me-sdk');
const client = new Call2Me('sk_call2me_...');

// Create an agent
const agent = await client.agents.create({
  agent_name: 'Sales Agent',
  voice_id: 'elevenlabs-selin',
  language: 'tr-TR',
  response_engine: {
    type: 'call2me-llm',
    system_prompt: 'You are a friendly sales agent.'
  }
});

// List calls
const calls = await client.calls.list();

// Check balance
const balance = await client.wallet.balance();
console.log(`Balance: $${balance.balance_usd}`);
```

## Full API Reference

### Agents
```javascript
await client.agents.list(limit, offset)
await client.agents.get('agent_id')
await client.agents.create({ agent_name, voice_id, ... })
await client.agents.update('agent_id', { agent_name: 'New Name' })
await client.agents.delete('agent_id')
await client.agents.duplicate('agent_id')
await client.agents.stats('agent_id', days)
await client.agents.globalStats()
```

### Calls
```javascript
await client.calls.list(limit, offset, agentId)
await client.calls.get('call_id')
await client.calls.end('call_id')
await client.calls.recording('call_id')
```

### Knowledge Base
```javascript
await client.knowledgeBases.list()
await client.knowledgeBases.get('kb_id')
await client.knowledgeBases.create({ name: 'FAQ', description: '...' })
await client.knowledgeBases.delete('kb_id')
await client.knowledgeBases.addSource('kb_id', { type: 'text', content: '...' })
await client.knowledgeBases.query('kb_id', 'question', topK)
```

### Campaigns
```javascript
await client.campaigns.list()
await client.campaigns.get('campaign_id')
await client.campaigns.create({ name, agent_id, from_number })
await client.campaigns.update('campaign_id', { name: 'Updated' })
await client.campaigns.delete('campaign_id')
await client.campaigns.start('campaign_id')
await client.campaigns.pause('campaign_id')
await client.campaigns.resume('campaign_id')
await client.campaigns.cancel('campaign_id')
await client.campaigns.contacts('campaign_id')
```

### Scheduled Calls
```javascript
await client.schedules.list()
await client.schedules.get('schedule_id')
await client.schedules.create({ agent_id, phone_number, scheduled_at, timezone })
await client.schedules.update('schedule_id', { scheduled_at: '...' })
await client.schedules.delete('schedule_id')
await client.schedules.cancel('schedule_id')
```

### Phone Numbers
```javascript
await client.phoneNumbers.list()
await client.phoneNumbers.get('+908501234567')
await client.phoneNumbers.create({ phone_number, trunk_id })
await client.phoneNumbers.update('+908501234567', { display_name: 'Main' })
await client.phoneNumbers.delete('+908501234567')
await client.phoneNumbers.bindAgent('+908501234567', 'agent_id')
await client.phoneNumbers.unbindAgent('+908501234567')
```

### SIP Trunks
```javascript
await client.sipTrunks.list()
await client.sipTrunks.get('trunk_id')
await client.sipTrunks.create({ name, sip_server, sip_username, sip_password })
await client.sipTrunks.update('trunk_id', { name: 'Updated' })
await client.sipTrunks.delete('trunk_id')
await client.sipTrunks.test('trunk_id')
```

### Wallet & Billing
```javascript
await client.wallet.balance()
await client.wallet.transactions(limit, offset)
await client.wallet.analytics(days)
await client.wallet.pricing()
```

### Payments
```javascript
await client.payments.checkout(50.0, 'USD')
await client.payments.history(limit)
await client.payments.savedCards()
await client.payments.autoCharge()
await client.payments.updateAutoCharge({ enabled: true, threshold: 5, charge_amount: 50 })
```

### API Keys
```javascript
await client.apiKeys.list()
await client.apiKeys.create({ name: 'Production Key' })
await client.apiKeys.revoke('key_id')
await client.apiKeys.delete('key_id')
await client.apiKeys.usage('key_id')
```

### Users & Branding
```javascript
await client.users.me()
await client.users.update({ full_name: 'John Doe' })
await client.users.stats()
await client.users.usage(days)
await client.users.dailyUsage(days)
await client.users.branding()
await client.users.updateBranding({ app_name: 'My Platform', primary_color: '#6366f1' })
await client.users.tenantMembers(page, perPage)
```

### Widgets
```javascript
await client.widgets.list()
await client.widgets.get('widget_id')
await client.widgets.create({ agent_id, name: 'Support' })
await client.widgets.update('widget_id', { welcome_message: 'Hi!' })
await client.widgets.delete('widget_id')
await client.widgets.chat('widget_id', 'Hello, I need help')
```

### Voices
```javascript
await client.voices.list()
await client.voices.providers()
```

### Chats
```javascript
await client.chats.list(limit)
await client.chats.get('session_id')
await client.chats.sendMessage('session_id', 'Hello!', model)
```

## Error Handling

```javascript
try {
  const agent = await client.agents.get('invalid_id');
} catch (err) {
  console.error(err.message); // "Call2Me API Error 404: Agent not found"
}
```

## Links

- **Website**: [call2me.app](https://call2me.app)
- **Dashboard**: [dashboard.call2me.app](https://dashboard.call2me.app)
- **API Docs**: [call2me.app/docs](https://call2me.app/docs)
- **Guides**: [call2me.app/guides](https://call2me.app/guides)
- **GitHub**: [github.com/call2me-app/node-sdk](https://github.com/call2me-app/node-sdk)
- **Support**: [support@call2me.app](mailto:support@call2me.app)

## License

MIT
