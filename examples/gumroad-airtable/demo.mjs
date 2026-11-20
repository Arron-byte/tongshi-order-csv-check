// Local synthetic proof only. No network client, credential loading or n8n dependency.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const input = await readFile(path.join(here, 'synthetic-sales.json'));
const fixture = JSON.parse(input);
assert.equal(fixture.synthetic, true);
let networkAttempts = 0;
globalThis.fetch = () => { networkAttempts++; throw new Error('NETWORK_DISABLED_IN_LOCAL_DEMO'); };
const digest = data => createHash('sha256').update(data).digest('hex');
const canonical = value => JSON.stringify(value, (_key, child) =>
  child && typeof child === 'object' && !Array.isArray(child)
    ? Object.fromEntries(Object.keys(child).sort().map(key => [key, child[key]])) : child);
function requiredText(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`INVALID_${field}`);
  return value;
}
function integer(value, field) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`INVALID_${field}`);
  return value;
}
function timestamp(raw) {
  const match = typeof raw === 'string' && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-](\d{2}):(\d{2}))$/.exec(raw);
  if (!match) throw new Error('EXPLICIT_TIMEZONE_REQUIRED');
  const [year, month, day, hour, minute, second] = match.slice(1, 7).map(Number);
  const offsetHour = Number(match[9] || 0), offsetMinute = Number(match[10] || 0);
  if (year < 1970 || month < 1 || month > 12 || day < 1 || day > new Date(Date.UTC(year, month, 0)).getUTCDate()
      || hour > 23 || minute > 59 || second > 59 || offsetHour > 14 || offsetMinute > 59 || (offsetHour === 14 && offsetMinute)) {
    throw new Error('INVALID_CREATED_AT');
  }
  const date = new Date(raw);
  if (!Number.isFinite(date.valueOf())) throw new Error('INVALID_CREATED_AT');
  return date.toISOString();
}
function booleanState(value) {
  if (value === undefined || value === null) return 'unknown';
  if (typeof value !== 'boolean') throw new Error('INVALID_BOOLEAN');
  return String(value);
}
function mapSale(sale) {
  const cents = integer(sale.price, 'PRICE');
  const units = BigInt(cents);
  const currency = requiredText(sale.currency, 'CURRENCY');
  if (!/^[a-z]{3}$/i.test(currency)) throw new Error('INVALID_CURRENCY');
  const fields = {
    'Gumroad Sale ID': requiredText(sale.id, 'SALE_ID'),
    'Buyer Email': requiredText(sale.email, 'EMAIL'),
    'Purchase Email Raw': sale.purchase_email === undefined ? null : requiredText(sale.purchase_email, 'PURCHASE_EMAIL'),
    'Product ID': requiredText(sale.product_id, 'PRODUCT_ID'),
    'Created At Raw': sale.created_at,
    'Transaction Time UTC': timestamp(sale.created_at),
    'Canonical Price USD Cents': cents,
    'Canonical Price USD Text': `${units / 100n}.${String(units % 100n).padStart(2, '0')}`,
    'Sale Currency Raw': currency,
    'Partially Refunded': booleanState(sale.partially_refunded),
    'Can Contact': booleanState(sale.can_contact),
    'Buyer Presentment Raw JSON': null,
    'Buyer Charged Total Minor Units': null,
    'Buyer Charged Currency': null,
  };
  if (sale.buyer_presentment != null) {
    const presentment = sale.buyer_presentment;
    const code = requiredText(presentment.currency, 'BUYER_CURRENCY');
    if (!/^[a-z]{3}$/i.test(code)) throw new Error('INVALID_BUYER_CURRENCY');
    fields['Buyer Presentment Raw JSON'] = JSON.stringify(presentment);
    fields['Buyer Charged Total Minor Units'] = integer(presentment.total_cents, 'BUYER_TOTAL');
    fields['Buyer Charged Currency'] = code;
  }
  return { fields };
}
function buildRecords(sales) {
  const byID = new Map();
  let duplicateRows = 0;
  for (const sale of sales) {
    const record = mapSale(sale), key = record.fields['Gumroad Sale ID'];
    const previous = byID.get(key);
    if (previous) {
      // No source update-version is established: conflicting snapshots require reconciliation.
      if (previous.source !== canonical(sale)) throw new Error(`CONFLICTING_SALE_ID:${key}`);
      duplicateRows++;
    } else byID.set(key, { source: canonical(sale), record });
  }
  return { records: [...byID.values()].map(entry => entry.record), duplicateRows };
}
function requestFor(record) {
  return {
    method: 'PATCH',
    url: 'https://api.airtable.com/v0/{BASE_ID}/{TABLE_ID}',
    headers: { 'Content-Type': 'application/json' },
    authentication: 'A base-scoped credential must be injected at runtime. This example contains none.',
    body: { performUpsert: { fieldsToMergeOn: ['Gumroad Sale ID'] }, typecast: false, records: [record] },
  };
}
// Deliberately a local contract model, not an Airtable server or proof of remote writes.
function localUpsert(table, request) {
  assert.equal(request.method, 'PATCH');
  assert.deepEqual(request.body.performUpsert.fieldsToMergeOn, ['Gumroad Sale ID']);
  let created = 0, updated = 0;
  for (const record of request.body.records) {
    const matches = table.filter(item => item.fields['Gumroad Sale ID'] === record.fields['Gumroad Sale ID']);
    if (matches.length > 1) throw new Error('MULTIPLE_EXISTING_MATCHES');
    if (matches.length === 1) { Object.assign(matches[0].fields, structuredClone(record.fields)); updated++; }
    else { table.push({ id: `LOCAL-RECORD-${table.length + 1}`, fields: structuredClone(record.fields) }); created++; }
  }
  return { created, updated };
}

const checks = [];
function check(name, fn) { fn(); checks.push({ name, status: 'PASS' }); }
const { records, duplicateRows } = buildRecords(fixture.sales);
const requests = records.map(requestFor);
const table = [];
const first = requests.map(request => localUpsert(table, request));
const second = requests.map(request => localUpsert(table, request));
check('4 source rows produce 3 sale IDs; one identical replay collapses', () => {
  assert.equal(records.length, 3); assert.equal(duplicateRows, 1);
});
check('first pass creates 3; second creates 0 and updates 3; final count 3', () => {
  assert.equal(first.reduce((n, r) => n + r.created, 0), 3);
  assert.equal(second.reduce((n, r) => n + r.created, 0), 0);
  assert.equal(second.reduce((n, r) => n + r.updated, 0), 3); assert.equal(table.length, 3);
});
check('same buyer with different sale IDs keeps both purchases', () => {
  assert.equal(table.filter(r => r.fields['Buyer Email'] === 'buyer-a@example.test').length, 2);
});
check('USD cents, sale currency and JPY buyer total remain separate', () => {
  const r = records[1].fields;
  assert.equal(r['Canonical Price USD Cents'], 1000); assert.equal(r['Canonical Price USD Text'], '10.00');
  assert.equal(r['Sale Currency Raw'], 'jpy'); assert.equal(r['Buyer Charged Total Minor Units'], 1441);
  assert.equal(r['Buyer Charged Currency'], 'jpy');
});
check('timezone is explicit; original offset retained and UTC computed', () => {
  assert.equal(records[1].fields['Created At Raw'], '2026-11-19T09:00:00+09:00');
  assert.equal(records[1].fields['Transaction Time UTC'], '2026-11-19T00:00:00.000Z');
  assert.throws(() => mapSale({ ...fixture.sales[0], created_at: '2026-11-19T09:00:00' }), /TIMEZONE/);
  assert.throws(() => mapSale({ ...fixture.sales[0], created_at: '2026-02-30T09:00:00Z' }), /INVALID_CREATED_AT/);
});
check('zero is preserved; absent, fractional and unsafe prices rejected', () => {
  assert.equal(records[2].fields['Canonical Price USD Text'], '0.00');
  for (const price of [undefined, null, 1.5, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => mapSale({ ...fixture.sales[0], price }), /INVALID_PRICE/);
});
check('missing optional facts remain unknown; contact false is retained', () => {
  assert.equal(records[2].fields['Can Contact'], 'unknown');
  assert.equal(records[2].fields['Buyer Charged Total Minor Units'], null);
  assert.equal(records[1].fields['Can Contact'], 'false');
});
check('same source ID with conflicting snapshot blocks entire batch', () => {
  assert.throws(() => buildRecords([fixture.sales[0], { ...fixture.sales[0], price: 999 }]), /CONFLICTING_SALE_ID/);
});
check('multiple existing Airtable merge matches require repair', () => {
  assert.throws(() => localUpsert([structuredClone(table[0]), structuredClone(table[0])], requests[0]), /MULTIPLE_EXISTING_MATCHES/);
});
check('PATCH leaves unrelated follow-up notes intact', () => {
  const isolated = [structuredClone(table[0])]; isolated[0].fields['Follow-up Notes'] = 'Synthetic note';
  localUpsert(isolated, requests[0]); assert.equal(isolated[0].fields['Follow-up Notes'], 'Synthetic note');
});
check('all source rows remain available in the original fixture', () => assert.equal(fixture.sales.length, 4));
check('no network operation attempted', () => assert.equal(networkAttempts, 0));

const requestedOutput = process.argv[2] || 'output';
if (!/^[a-zA-Z0-9_-]+$/.test(requestedOutput)) throw new Error('OUTPUT_MUST_BE_A_LOCAL_DIRECTORY_NAME');
const output = path.join(here, requestedOutput);
await mkdir(output); // An existing run is retained; choose a new local directory for reruns.
const artifacts = {
  'airtable-requests.json': requests,
  'local-records-after-replay.json': table,
};
const artifactHashes = {};
for (const [name, value] of Object.entries(artifacts)) {
  const bytes = JSON.stringify(value, null, 2) + '\n';
  await writeFile(path.join(output, name), bytes); artifactHashes[name] = digest(bytes);
}
const evidence = {
  label: 'LOCAL SYNTHETIC DEMO — no live Gumroad/Airtable access or customer deployment',
  status: 'PASS', node: process.versions.node, executed_at: new Date().toISOString(),
  input_sha256: digest(input), source_sha256: digest(await readFile(fileURLToPath(import.meta.url))),
  source_rows: fixture.sales.length, unique_sale_ids: records.length, duplicate_source_rows: duplicateRows,
  first_pass: first, second_pass: second, final_record_count: table.length, network_attempts: networkAttempts,
  checks, artifact_sha256: artifactHashes,
};
await writeFile(path.join(output, 'evidence.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify(evidence, null, 2));
