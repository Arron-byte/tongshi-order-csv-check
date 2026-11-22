# Browser file flow QA report

Tongshi AI tested one CSV import and export flow on November 22, 2026. The application ran on a loopback address in isolated Chromium sessions. The files contain synthetic order records. An independent reviewer repeated all six checks in a fresh session and verified the downloads and screenshots.

| Case | Expected and observed result | Evidence |
| --- | --- | --- |
| CSV-01 | Import read six records and flagged four source rows. | [Desktop findings](01-desktop-results.png) |
| CSV-02 | Export downloaded the four findings as a UTF-8 CSV with BOM and CRLF line endings. | [Initial download](02-desktop-findings.csv) |
| CSV-03 | An open quote on line 2 triggered an error and hid the previous results and download. | [Invalid input](03-malformed-file.png) |
| CSV-04 | Selecting the valid file again restored the results in the same tab. The export matched the initial file byte for byte. | [Retest](04-retest-results.png) · [Retest download](04-retest-findings.csv) |
| CSV-05 | Using the same column for both fields showed a validation prompt. Selecting distinct columns restored the check. | [Recorded steps and result](proof.json) |
| CSV-06 | In a 390px touch-enabled Chromium session, opening the file control, checking the file and downloading the CSV succeeded. The layout fit the viewport. | [Mobile simulation](06-mobile-results.png) · [Mobile download](06-mobile-findings.csv) |

The three downloads are 118 bytes each and have SHA-256 `92cde626ef6ff63efefe14472ddeb4fd0bee523b7b6da3323be409c73299b62e`. The application completed four loopback GET requests in each run. Full checks, browser versions, screenshot hashes and the scope of the tests are in [the original run](proof.json) and [the independent run](independent/proof.json).

## Reproduce the flow

1. Download the [valid CSV](fixtures/orders.csv) and the [malformed CSV](fixtures/unclosed-quote.csv). Open the [CSV self-check tool](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/tools/order-csv-check).
2. Select the valid file, choose the order ID and amount columns, and run the check. Compare the four flagged rows and exported CSV with the table above.
3. Select the malformed file and observe the warning. Select the valid file again and compare the second download with the first.
4. Repeat the check in a 390px touch-enabled browser profile. Compare the layout and downloaded file.

The JavaScript served by the public tool matched the SHA-256 of the JavaScript executed in the test. [Ask about a fixed-scope QA pilot](https://sqtlow7jjmgjdgncr4fhmf7pki.srv.us/consult?locale=en&source=github-service-guide)
