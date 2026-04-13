/**
 * Call2Me Node.js SDK
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
  }

  async _request(method, path, body = null, params = null) {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const opts = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    };
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

class AgentsResource {
  constructor(client) { this.c = client; }
  list(limit = 100, offset = 0) { return this.c._request('GET', '/v1/agents', null, { limit, offset }); }
  get(id) { return this.c._request('GET', `/v1/agents/${id}`); }
  create(data) { return this.c._request('POST', '/v1/agents', data); }
  update(id, data) { return this.c._request('PATCH', `/v1/agents/${id}`, data); }
  delete(id) { return this.c._request('DELETE', `/v1/agents/${id}`); }
  duplicate(id) { return this.c._request('POST', `/v1/agents/${id}/duplicate`); }
}

class CallsResource {
  constructor(client) { this.c = client; }
  list(limit = 50, offset = 0) { return this.c._request('GET', '/v1/calls', null, { limit, offset }); }
  get(id) { return this.c._request('GET', `/v1/calls/${id}`); }
}

class KnowledgeBaseResource {
  constructor(client) { this.c = client; }
  list() { return this.c._request('GET', '/v1/knowledge-base'); }
  create(data) { return this.c._request('POST', '/v1/knowledge-base', data); }
  query(id, query, topK = 5) { return this.c._request('POST', `/v1/knowledge-base/${id}/query`, { query, top_k: topK }); }
}

class WalletResource {
  constructor(client) { this.c = client; }
  balance() { return this.c._request('GET', '/v1/wallet/balance'); }
  transactions(limit = 50) { return this.c._request('GET', '/v1/wallet/transactions', null, { limit }); }
}

class CampaignsResource {
  constructor(client) { this.c = client; }
  list() { return this.c._request('GET', '/v1/campaigns'); }
  create(data) { return this.c._request('POST', '/v1/campaigns', data); }
  start(id) { return this.c._request('POST', `/v1/campaigns/${id}/action`, { action: 'start' }); }
  pause(id) { return this.c._request('POST', `/v1/campaigns/${id}/action`, { action: 'pause' }); }
}

class SchedulesResource {
  constructor(client) { this.c = client; }
  list() { return this.c._request('GET', '/v1/schedules'); }
  create(data) { return this.c._request('POST', '/v1/schedules', data); }
}

module.exports = { Call2Me };
