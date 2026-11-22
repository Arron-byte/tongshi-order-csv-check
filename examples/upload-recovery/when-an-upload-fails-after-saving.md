# When a file upload fails after saving its bytes

We forced the Tongshi AI storefront's upload handler to throw immediately after it saved a CSV. A case refresh recovered the saved file under its original ID without a second upload. Retrying with that ID also recovered the file, provided the bytes matched the original request.

The fixture runs the storefront's Request/Response handlers and SQLite storage adapter with synthetic input. We used a 37-byte CSV and Windows with Node.js 24.22.1. The experiment uses deterministic faults and makes zero network requests.

## Interrupt the upload at two points

First we broke the request body after its first 10 bytes. The handler returned HTTP 400. Direct inspection found zero upload slots and zero content objects.

Next we let the handler store the entire CSV, then forced the write that would mark the upload `READY` to fail. The handler threw `SYNTHETIC_READY_COMMIT_FAILURE`. The SQLite checkpoint held one `RESERVED` slot and one complete content object. The object's SHA-256 matched the CSV we sent.

We took this checkpoint by reading storage directly. In this implementation, opening the case can already reconcile a pending upload, so taking a screenshot of a refreshed page would miss the intermediate state we set out to measure.

## Keep the original ID through recovery

Each `POST /files` in the fixture carries a UUID in `x-file-id`. We sent different bytes under the original ID first, to check what happens if a retry accidentally carries a changed file. We then tried the original bytes and, in a separate case, tried opening the case without repeating the upload.

| Action after the injected failure | Observed result |
| --- | --- |
| Repeat `POST /files` with the original ID and changed bytes | HTTP 409. The slot remains `RESERVED` and the saved object is unchanged. |
| Repeat `POST /files` with the original ID and original bytes | HTTP 200. The single slot moves to `READY` and the saved object keeps its bytes and version. |
| Reopen a separate case left in the same pending state | The case response lists the original ID, the slot moves to `READY`, and the saved object is unchanged. |

We downloaded the recovered files under their original IDs and compared the content byte for byte. Both recovery cases returned the CSV that we sent. In a separate control, uploading different bytes under a new ID with the same filename created a second slot. The filename alone is insufficient as an identifier for a retry.

For a browser handling an uncertain result, I would keep the upload ID alongside the selected file until the case confirms that upload. In this storefront, opening the case first can make a second `POST` unnecessary. If the upload still needs a retry and the user has selected a different file, use a distinct ID for that new action. On the server, check the stored file before clearing a reservation, so that an unfinished upload and a recoverable committed file remain distinguishable.

## Reproduce the result

Download and extract the ZIP from the [upload recovery evidence release](https://github.com/Arron-byte/tongshi-order-csv-check/releases/tag/upload-proof-2026-11-20). Run these commands from the extracted directory with Node.js 24. Use a fresh output directory each time.

```sh
node --no-warnings ./run-proof.mjs --output runs/upload-outcome
node --no-warnings ./verify-evidence.mjs runs/upload-outcome
```

Look in `runs/upload-outcome/proof.json` under `05_interruption_and_confirmation_recovery` for the response statuses and checkpoint states. The verifier checks six groups and four SQLite checkpoints, including the object hashes and the `RESERVED` to `READY` transitions. This harness isolates the recovery logic before a separate browser or network test.
