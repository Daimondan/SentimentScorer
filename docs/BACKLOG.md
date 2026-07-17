# Prioritized Backlog

## P0 — Repository and recovery

- [x] Download the exact original `review.html` from ChatGPT File Library and commit it under `legacy/original-review.html`. *(Done 2026-07-17)*
- [ ] Compare original behavior with this reconstructed baseline.
- [ ] Preserve any useful original dataset that is not yet in `data/posts.json`.
- [ ] Confirm current deployment ownership and configuration.
- [x] Organize repo structure with `legacy/`, `data/imports/`, `inbox/`, `.github/` folders. *(Done 2026-07-17)*
- [x] Commit `American_Apparel_June_2026_First_Pass.xlsx` (198 first-pass records) to `data/imports/`. *(Done 2026-07-17)*
- [x] Create `inbox/` agent communication system. *(Done 2026-07-17)*
- [ ] Write import script to load xlsx first-pass records into `data/posts.json`.
- [ ] Remove `SentimentScorer_GitHub_Ready.zip` from repo root once migration is verified.

## P0 — Shared production application

- Add authentication and roles.
- Replace JSON storage with PostgreSQL.
- Add migrations and sanitized seed data.
- Add safe concurrent review.
- Add audit history in the UI.
- Deploy one shared environment.

## P0 — Full media analysis

- Retrieve all carousel children.
- Retrieve playable video where authorized.
- Add scene-aware frame extraction.
- Add audio extraction and transcription.
- Add OCR.
- Store timestamped evidence.
- Add completeness flags.
- Route incomplete media to review.

## P1 — Data and classification

- Import the complete June dataset (the 198-record xlsx in `data/imports/` is first-pass only, not complete).
- Write import script for `data/imports/American_Apparel_June_2026_First_Pass.xlsx` → `data/posts.json`.
- Preserve post/comment separation.
- Add legacy product taxonomy.
- Add evaluation fixtures.
- Measure precision, recall and review rate.
- Keep prompts and rules versioned.

## P1 — Review UI

- Show all carousel children.
- Show video frames and transcript.
- Add broken-link status.
- Add explicit Needs Review reason filters.
- Add review claiming/locking.
- Add history and reopen controls.

## P1 — Scraping operations

- Named scrape runs.
- Exact date boundaries and timezone.
- Retry and duplicate tracking.
- Rate-limit logging.
- Failure reports.
- Reproducible June run.

## P2 — Engineering operations

- CI.
- tests.
- background queue monitoring.
- error tracking.
- cost dashboard.
- media retention policy.
- deployment rollback.
