/**
 * SDK'nın çağırdığı her uç CANLI API'de var olmalı.
 *
 * ÖLÇÜLEN KUSURLAR (5 Eki 2026, canlı `openapi.json`'a karşı):
 *   POST /v1/knowledge-base/{}/sources   → .../add-sources
 *   POST /v1/phone-numbers/{}/unbind     → DELETE (metot yanlış)
 *   PATCH /v1/api-keys/{}/revoke         → DELETE /v1/api-keys/{}
 *   GET  /v1/voices/providers            → hiç yok
 *   GET  /v1/payments/saved-cards        → GET /v1/payments/methods
 *
 * Python SDK'da aynı beşi 4 Eki'de düzeltilmişti; Node'da duruyordu.
 * Beşi de README'de örnek olarak geçiyordu: kopyalayan 404 alırdı.
 *
 * Spec ÇEVRİMDIŞI kopyadan okunuyor (`test/openapi.json`): ağ yoksa test
 * atlanmaz, yanlış geçmez.
 */
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const norm = (s) => s.replace(/\{[^}]+\}/g, '{}');

function gercekUclar() {
  const spec = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'openapi.json'), 'utf8')
  );
  const set = new Set();
  for (const [yol, v] of Object.entries(spec.paths)) {
    for (const m of Object.keys(v)) {
      if (['get', 'post', 'put', 'patch', 'delete'].includes(m)) {
        set.add(`${m.toUpperCase()} ${norm(yol)}`);
      }
    }
  }
  return set;
}

function sdkCagrilari() {
  const kaynak = fs.readFileSync(
    path.join(__dirname, '../src/index.js'),
    'utf8'
  );
  const out = [];
  kaynak.split('\n').forEach((satir, i) => {
    const re = /_request\(\s*'(GET|POST|PUT|PATCH|DELETE)'\s*,\s*[`']([^`']*)[`']/g;
    let m;
    while ((m = re.exec(satir)) !== null) {
      const yol = norm(m[2].replace(/\$\{[^}]+\}/g, '{}'));
      if (yol.startsWith('/v1/')) out.push({ metot: m[1], yol, satir: i + 1 });
    }
  });
  return out;
}

test('SDK ucu spec\'te var', () => {
  const spec = gercekUclar();
  const cagrilar = sdkCagrilari();
  // Desen bozulursa testin sessizce boşa dönmesini engeller.
  assert.ok(cagrilar.length > 20, `çok az çağrı bulundu: ${cagrilar.length}`);
  const olu = cagrilar.filter((c) => !spec.has(`${c.metot} ${c.yol}`));
  assert.deepStrictEqual(
    olu.map((c) => `index.js:${c.satir} ${c.metot} ${c.yol}`),
    [],
    'API\'de OLMAYAN uçlar'
  );
});
