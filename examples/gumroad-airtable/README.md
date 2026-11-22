# Gumroad sales → Airtable: local proposal sample

**LOCAL SYNTHETIC DEMO.** All IDs, emails, purchases and records here are invented test data. This package demonstrates mapping, validation and sale-ID replay locally. Customer deployment and authenticated Gumroad/Airtable integration remain acceptance work. No n8n installation or real API write was performed.

## Run on Windows with Node.js 24

Open this directory in PowerShell with Node 24 available:

```powershell
node --version
node .\demo.mjs run-local-1
```

No packages or credentials are needed. Use a fresh output name for each execution, e.g. `run-local-2`; existing results are retained. The script rejects output paths outside this directory. The run prints JSON evidence and creates three readable JSON files: request examples, local records after replay, and evidence with source/input/artifact hashes. The included `output-final/` is the actual recorded run.

## What the sample proves

Four source rows contain three distinct sale IDs and one identical duplicate. A first local pass creates three records; replay creates zero additional records. Two purchases by the same email remain separate. Conflicting copies of one sale ID stop the batch for reconciliation. A duplicate merge key already in the destination also stops processing. The request uses PATCH, so unrelated follow-up notes remain untouched. Each example request contains one sale and uses the text field `Gumroad Sale ID` as its `performUpsert` key.

`field-mapping.json` specifies 14 fields. The source fixture remains intact. Its cases include USD cents, a JPY buyer payment, a UTC offset, zero price, partial refund and unknown optional facts. Validation rejects absent/fractional/unsafe prices and invalid or timezone-free timestamps. The local contract model is explicitly labeled; its results are not remote Airtable receipts.

## Official contract checked on 2026-11-20

- [Gumroad Sales API](https://gumroad.com/api): authenticated `GET /v2/sales`, with `view_sales`, provides successful sales and pagination. The official [Sales documentation source](https://github.com/antiwork/gumroad/blob/main/app/javascript/components/ApiDocumentation/Endpoints/Sales.tsx) exposes `next_page_key` / `next_page_url` and `created_at` in its response example.
- [Gumroad official field definitions](https://github.com/antiwork/gumroad/blob/main/app/javascript/components/ApiDocumentation/responseFieldDefinitions.ts): `price` retains the canonical USD accounting meaning. `currency` denotes the sale's denomination; optional `buyer_presentment` carries the buyer's local-currency amounts. This sample keeps these separately, preserves integer values, and converts only canonical USD cents to a display string. It does not calculate net revenue, tax, payouts or exchange rates. Transaction time comes from timezone-bearing `created_at`; relative/display timestamps are not parsed.
- [Airtable update/upsert API](https://airtable.com/developers/web/api/update-multiple-records): PATCH updates provided fields; `performUpsert.fieldsToMergeOn` matches an external identifier. Zero matches create, one updates, and multiple matches fail. A writable text field is suitable. This sample disables typecasting. Authenticated remote integration requires the customer's permitted base/table and suitable credentials.

## Customer-specific acceptance still needed

Confirm the actual base schema, email choice (`email` versus `purchase_email`), desired amount definition, display timezone, historical period, sync cadence, refund/update policy and contact permission. No follow-up messages are sent. Missing contact/refund flags remain `unknown`.

Production work would add authenticated extraction, complete pagination, saved progress, serialized retries after uncertain responses, and destination readback. The [official Airtable rate-limit guidance](https://airtable.com/developers/web/api/rate-limits) must be applied to that transport. The sample does not resolve later changed snapshots by guessing which is newest; incremental date filters alone may miss later refund changes. Confirm one authorized source sale against one destination row, then repeat the sync and reconcile counts before accepting a live workflow.

To request a paid pilot for your workflow, describe the source, destination and smallest useful outcome. Start with field names or a redacted example. The team will confirm the scope, price and Alipay settlement in the private consultation. [Describe a workflow](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/consult?locale=en&source=github-service-guide)

## Safe sharing

Share this directory only. It contains source, synthetic fixtures, proposed mapping, official source links and actual local evidence. Parent prospect files, form responses, account data and credentials are outside this sample and are not part of it. No customer outcomes, production reliability or prior client deployment are asserted.
