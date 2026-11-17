# Check a Spree order export

Spree v6.0.5 writes one row per line item. The order number appears on every item row. The first row carries order-level values such as `Status`, `Currency`, and `Total`. A repeated `Number` can therefore be expected in the original export. Export a filtered period from **Orders → Export**. [Spree export instructions](https://spreecommerce.org/docs/user/orders/exporting-orders) · [CSV presenter at v6.0.5](https://github.com/spree/spree/blob/v6.0.5/spree/core/app/presenters/spree/csv/order_line_item_presenter.rb#L85)

Prepare one order-level row per order from a private copy. In this exporter version, an adjacent row with the same number, item data, and blank order-level fields can be the next item. Use the original export to confirm that relationship. Keep ambiguous rows for review. Preserve rows with missing totals and keep any repeated **order-level** rows so the audit can flag them. In the review copy, keep `Number`, `Total`, and `Currency` and split the file by currency. Keep customer names, addresses, phones, emails, and notes in the private original. `Total` is the order total. Settlement and refund amounts need their own source records.

The paid audit also requires an agreed refund-status column based on your refund records. Spree's order `Status` describes the order lifecycle. The prepared sample includes a separate synthetic `Refund Status` column for this reason. [Sample audit rules](rules.example.json)

## Try the synthetic sample

In the source example, row 3 is the second item of order R100001. It is excluded from the order-level copy. Rows 4 and 5 deliberately contain two full order-level records with the same number and both are retained. Load the prepared CSV in the browser checker and select `Number` and `Total`. [Source export sample](order-export-sample.csv) · [Prepared CSV](orders-for-review.csv) · [Free browser checker](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/tools/order-csv-check?source=github-csv-guide)

| Prepared row | Source row | Finding |
| --- | --- | --- |
| 3, 4 | 4, 5 | Repeated order-level number |
| 5 | 6 | Missing total |
| 6 | 7 | Missing order number |

## Have our team check a worksheet

A one-sheet review costs **CNY 49** (Alipay). It covers one redacted, order-level CSV or visible Excel worksheet with up to 500 data rows and 20 columns. We return a cleaned table, exceptions with row numbers from the submitted file, and a report within 24 hours after the sample, rules, and payment are confirmed. [Request an audit (Chinese form)](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/?service=order-audit-once-v1&source=github-csv-guide#inquiry)
