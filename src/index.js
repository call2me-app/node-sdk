/**
 * Call2Me Node.js SDK — Full API coverage
 *
 * @example
 * const { Call2Me } = require('@call2me/sdk');
 * const client = new Call2Me('sk_call2me_...');
 * const agents = await client.agents.list();
 */

class Call2Me {
  constructor(apiKey, baseUrl = 'https://api.call2me.app') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.agents = new AgentsResource(this);
    this.calls = new CallsResource(this);
    this.knowledgeBases = new KnowledgeBaseResource(this);
    this.wallet = new WalletResource(this);
    this.campaigns = new CampaignsResource(this);
    this.schedules = new SchedulesResource(this);
    this.phoneNumbers = new PhoneNumbersResource(this);
    this.sipTrunks = new SipTrunksResource(this);
    this.apiKeys = new ApiKeysResource(this);
    this.users = new UsersResource(this);
    this.widgets = new WidgetsResource(this);
    this.voices = new VoicesResource(this);
    this.chats = new ChatsResource(this);
    this.payments = new PaymentsResource(this);
  }

  async _request(method, path, body = null, params = null) {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) Object.entries(params).forEach(([k, v]) => { if (v != null) url.searchParams.set(k, v); });
    const opts = { method, headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(`Call2Me API Error ${res.status}: ${err.detail || JSON.stringify(err)}`);
    }
    if (res.status === 204) return true;
    return res.json();
  }
}

// ── Agents ──
class AgentsResource {
  constructor(c) { this.c = c; }
  list(limit = 100, offset = 0) { return this.c._request('GET', '/v1/agents', null, { limit, offset }); }
  get(id) { return this.c._request('GET', `/v1/agents/${id}`); }
  create(data) { return this.c._request('POST', '/v1/agents', data); }
  update(id, data) { return this.c._request('PATCH', `/v1/agents/${id}`, data); }
  delete(id) { return this.c._request('DELETE', `/v1/agents/${id}`); }
  duplicate(id) { return this.c._request('POST', `/v1/agents/${id}/duplicate`); }
  stats(id, days = 30) { return this.c._request('GET', `/v1/agents/${id}/stats`, null, { days }); }
  globalStats() { return this.c._request('GET', '/v1/agents/stats/global'); }
}

// ── Calls ──
class CallsResource {
  constructor(c) { this.c = c; }
  list(limit = 50, offset = 0, agentId = null) { return this.c._request('GET', '/v1/calls', null, { limit, offset, agent_id: agentId }); }
  get(id) { return this.c._request('GET', `/v1/calls/${id}`); }
  end(id) { return this.c._request('POST', `/v1/calls/${id}/end`); }
  recording(id) { return this.c._request('GET', `/v1/calls/${id}/recording`); }
}

// ── Knowledge Base ──
class KnowledgeBaseResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/knowledge-base'); }
  get(id) { return this.c._request('GET', `/v1/knowledge-base/${id}`); }
  create(data) { return this.c._request('POST', '/v1/knowledge-base', data); }
  delete(id) { return this.c._request('DELETE', `/v1/knowledge-base/${id}`); }
  addSource(id, data) { return this.c._request('POST', `/v1/knowledge-base/${id}/sources`, data); }
  query(id, query, topK = 5) { return this.c._request('POST', `/v1/knowledge-base/${id}/query`, { query, top_k: topK }); }
}

// ── Wallet ──
class WalletResource {
  constructor(c) { this.c = c; }
  balance() { return this.c._request('GET', '/v1/wallet/balance'); }
  transactions(limit = 50, offset = 0) { return this.c._request('GET', '/v1/wallet/transactions', null, { limit, offset }); }
  analytics(days = 30) { return this.c._request('GET', '/v1/wallet/analytics', null, { days }); }
  pricing() { return this.c._request('GET', '/v1/wallet/pricing'); }
}

// ── Campaigns ──
class CampaignsResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/campaigns'); }
  get(id) { return this.c._request('GET', `/v1/campaigns/${id}`); }
  create(data) { return this.c._request('POST', '/v1/campaigns', data); }
  update(id, data) { return this.c._request('PATCH', `/v1/campaigns/${id}`, data); }
  delete(id) { return this.c._request('DELETE', `/v1/campaigns/${id}`); }
  action(id, action) { return this.c._request('POST', `/v1/campaigns/${id}/action`, { action }); }
  start(id) { return this.action(id, 'start'); }
  pause(id) { return this.action(id, 'pause'); }
  resume(id) { return this.action(id, 'resume'); }
  cancel(id) { return this.action(id, 'cancel'); }
  contacts(id) { return this.c._request('GET', `/v1/campaigns/${id}/contacts`); }
}

// ── Schedules ──
class SchedulesResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/schedules'); }
  get(id) { return this.c._request('GET', `/v1/schedules/${id}`); }
  create(data) { return this.c._request('POST', '/v1/schedules', data); }
  update(id, data) { return this.c._request('PATCH', `/v1/schedules/${id}`, data); }
  delete(id) { return this.c._request('DELETE', `/v1/schedules/${id}`); }
  cancel(id) { return this.c._request('POST', `/v1/schedules/${id}/cancel`); }
}

// ── Phone Numbers ──
class PhoneNumbersResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/phone-numbers'); }
  get(number) { return this.c._request('GET', `/v1/phone-numbers/${number}`); }
  create(data) { return this.c._request('POST', '/v1/phone-numbers', data); }
  update(number, data) { return this.c._request('PATCH', `/v1/phone-numbers/${number}`, data); }
  delete(number) { return this.c._request('DELETE', `/v1/phone-numbers/${number}`); }
  bindAgent(number, agentId) { return this.c._request('POST', `/v1/phone-numbers/${number}/bind`, { agent_id: agentId }); }
  unbindAgent(number) { return this.c._request('POST', `/v1/phone-numbers/${number}/unbind`); }
}

// ── SIP Trunks ──
class SipTrunksResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/sip-trunks'); }
  get(id) { return this.c._request('GET', `/v1/sip-trunks/${id}`); }
  create(data) { return this.c._request('POST', '/v1/sip-trunks', data); }
  update(id, data) { return this.c._request('PATCH', `/v1/sip-trunks/${id}`, data); }
  delete(id) { return this.c._request('DELETE', `/v1/sip-trunks/${id}`); }
  test(id) { return this.c._request('POST', `/v1/sip-trunks/${id}/test`); }
}

// ── API Keys ──
class ApiKeysResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/api-keys'); }
  create(data) { return this.c._request('POST', '/v1/api-keys', data); }
  revoke(id) { return this.c._request('PATCH', `/v1/api-keys/${id}/revoke`); }
  delete(id) { return this.c._request('DELETE', `/v1/api-keys/${id}`); }
  usage(id) { return this.c._request('GET', `/v1/api-keys/${id}/usage`); }
}

// ── Users ──
class UsersResource {
  constructor(c) { this.c = c; }
  me() { return this.c._request('GET', '/v1/users/me'); }
  update(data) { return this.c._request('PATCH', '/v1/users/me', data); }
  stats() { return this.c._request('GET', '/v1/users/me/stats'); }
  usage(days = 30) { return this.c._request('GET', '/v1/users/me/usage', null, { days }); }
  dailyUsage(days = 30) { return this.c._request('GET', '/v1/users/me/usage/daily', null, { days }); }
  branding() { return this.c._request('GET', '/v1/users/me/branding'); }
  updateBranding(data) { return this.c._request('PUT', '/v1/users/me/branding', data); }
  tenantMembers(page = 1, perPage = 20) { return this.c._request('GET', '/v1/users/me/tenant/members', null, { page, per_page: perPage }); }
}

// ── Widgets ──
class WidgetsResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/widgets'); }
  get(id) { return this.c._request('GET', `/v1/widgets/${id}`); }
  create(data) { return this.c._request('POST', '/v1/widgets', data); }
  update(id, data) { return this.c._request('PATCH', `/v1/widgets/${id}`, data); }
  delete(id) { return this.c._request('DELETE', `/v1/widgets/${id}`); }
  chat(id, message, visitorId = null) { return this.c._request('POST', `/v1/widgets/${id}/chat`, { message, visitor_id: visitorId }); }
}

// ── Voices ──
class VoicesResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/voices'); }
  providers() { return this.c._request('GET', '/v1/voices/providers'); }
}

// ── Chats ──
class ChatsResource {
  constructor(c) { this.c = c; }
  list(limit = 50) { return this.c._request('GET', '/v1/chats', null, { limit }); }
  get(sessionId) { return this.c._request('GET', `/v1/chats/${sessionId}`); }
  sendMessage(sessionId, content, model = null) { return this.c._request('POST', `/v1/chats/${sessionId}/messages`, { content, model }); }
}

// ── Payments ──
class PaymentsResource {
  constructor(c) { this.c = c; }
  checkout(amount, currency = 'USD') { return this.c._request('POST', '/v1/payments/checkout', { amount, currency }); }
  history(limit = 50) { return this.c._request('GET', '/v1/payments/history', null, { limit }); }
  savedCards() { return this.c._request('GET', '/v1/payments/saved-cards'); }
  autoCharge() { return this.c._request('GET', '/v1/payments/auto-charge'); }
  updateAutoCharge(data) { return this.c._request('PUT', '/v1/payments/auto-charge', data); }
}

module.exports = { Call2Me };
