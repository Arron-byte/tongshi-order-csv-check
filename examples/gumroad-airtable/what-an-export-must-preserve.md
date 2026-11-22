# Can your team restore the records it exports?

Our test export contained three valid sales. A restore keyed on buyer email left two. The export itself was complete. The receiving script had collapsed two purchases by the same buyer into one record.

That is a practical test of data ownership. If you can download the rows, you have a copy. To keep using the data after replacing a service, you also need to show that another environment can restore the identities, units and meanings your workflow depends on.

## Restore from the exported fields

We started with four synthetic storefront rows. One was an identical replay. The local sync fixture produced three records, each with a destination record ID and its mapped fields. We stripped the destination IDs, serialized the remaining fields to JSON, then loaded the JSON into a fresh in-memory table. We tried two keys and compared the result. The test runs locally with Node.js 24 and uses no Gumroad or Airtable credentials.

| Restore key | Rows retained | Sum of the canonical USD cents field |
| --- | ---: | ---: |
| Buyer email, with the last row winning | 2 | 1,000 |
| Source sale ID | 3 | 2,234 |

The difference is 1,234 cents from the first purchase by the shared buyer. A zero-price sale also remains a distinct record. Reapplying the export with the sale ID as the key gave the same three rows and values. The check never consults a destination record ID.

## Check what a row means

One of the restored sales carried a canonical amount of 1,000 US cents and a buyer amount of 1,441 Japanese yen. Both fields survived the restore. Adding the yen value to the USD cents column would give a plausible-looking total with no valid unit.

We also retained the original timestamp `2026-11-19T09:00:00+09:00` alongside its UTC value `2026-11-19T00:00:00.000Z`. A consumer can sort by UTC while a reviewer can still see what the source sent. A missing contact flag stayed `unknown`, so the restored record did not gain a permission through a default value.

## Make restoration part of the handoff

Take one export and start with a clean destination. Remove the current provider's record IDs from the input. Rebuild records using the source identifiers, replay the same input, and compare identities and values with the original export. Include at least one pair of rows that would collide under a tempting shortcut, such as email or filename.

The same drill is useful when a service hands over a document collection or an evaluation dataset. Define which source IDs, versions, units and unknown values have to survive the handoff. A reviewer should be able to inspect the schema and retry the restore independently. For critical workflows, run a separate drill against the actual target and agree on the reconciliation criteria before migration.

## Run the example

Run these commands with Node.js 24 from the directory containing the local storefront fixture. Choose an unused output directory for each run. [Fixture and field mapping](./README.md)

```sh
node ./demo.mjs run-portable-exit
node ./verify-portable-export.mjs run-portable-exit
```

The first command runs the local sync fixture. The second checks the two restore keys, the replay result, the currency and time fields, and the unknown contact flag against the retained source data.
