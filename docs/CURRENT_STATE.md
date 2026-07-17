# Current State

## Known

- A generated single-file review application was deployed at the Gizzle URL in `README.md`.
- The exact artifact is named `review.html` in the owner’s ChatGPT File Library.
- The original used browser localStorage for reviewer decisions and local source edits.
- The original did not demonstrate a production shared database.
- The original contained an embedded June dataset and analysis/review tabs.
- The GitHub repository contained only a minimal README when checked.
- The available ChatGPT GitHub connector could read but returned 403 on writes.

## This repository package

This package is a working reconstructed baseline with:

- a zero-dependency Node server;
- shared server-side JSON persistence;
- representative content data;
- review and export APIs;
- a review UI;
- full requirements and backlog.

It is not the final production architecture.
