import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

const runDirectory = process.argv[2] ?? 'output-final';
const records = JSON.parse(await readFile(join(runDirectory, 'local-records-after-replay.json'), 'utf8'));
const fixture = JSON.parse(await readFile(new URL('./synthetic-sales.json', import.meta.url), 'utf8'));
const exportedFields = JSON.parse(JSON.stringify(records.map(record => record.fields)));

const saleId = 'Gumroad Sale ID';
const canonicalCents = 'Canonical Price USD Cents';
const centsTotal = rows => [...rows].reduce((total, row) => total + row[canonicalCents], 0);
const byEmail = new Map(exportedFields.map(row => [row['Buyer Email'], row]));
const restored = new Map();

for (const row of exportedFields) restored.set(row[saleId], row);
assert.equal(restored.size, 3);
const initialRestore = structuredClone([...restored]);
for (const row of exportedFields) restored.set(row[saleId], row);
assert.deepEqual([...restored], initialRestore);
assert.equal(byEmail.size, 2);
assert.equal(centsTotal(byEmail.values()), 1000);
assert.equal(centsTotal(restored.values()), 2234);

const yenSale = restored.get('SYNTHETIC-SALE-002');
const originalYenSale = fixture.sales.find(sale => sale.id === 'SYNTHETIC-SALE-002');
const noContactDecision = restored.get('SYNTHETIC-SALE-003');
assert.equal(yenSale['Buyer Charged Total Minor Units'], 1441);
assert.equal(yenSale['Buyer Charged Currency'], 'jpy');
assert.equal(yenSale['Created At Raw'], originalYenSale.created_at);
assert.equal(yenSale['Transaction Time UTC'], new Date(originalYenSale.created_at).toISOString());
assert.equal(noContactDecision['Can Contact'], 'unknown');

console.log(JSON.stringify({
  fixture: 'synthetic storefront transactions',
  exported_rows: exportedFields.length,
  distinct_sale_rows_after_replay: restored.size,
  distinct_email_rows: byEmail.size,
  restored_canonical_usd_cents: centsTotal(restored.values()),
  email_keyed_canonical_usd_cents: centsTotal(byEmail.values()),
  retained_yen_buyer_amount: yenSale['Buyer Charged Total Minor Units'],
  retained_source_timestamp: yenSale['Created At Raw'],
  normalized_utc_timestamp: yenSale['Transaction Time UTC'],
  retained_unknown_contact_flag: noContactDecision['Can Contact'],
}));
