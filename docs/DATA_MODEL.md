# Proposed Production Data Model

Use PostgreSQL.

## Tables

- `users`
- `content_items`
- `media_assets`
- `media_frames`
- `audio_transcripts`
- `ocr_segments`
- `scrape_runs`
- `scrape_run_items`
- `analysis_runs`
- `classification_results`
- `classification_evidence`
- `human_reviews`
- `audit_events`

## Key rules

- `content_items.item_type` is `post` or `comment`.
- comments have `parent_content_item_id`.
- automated results are append-only/versioned.
- human reviews are separate append-only records.
- media assets preserve carousel ordering.
- analysis runs carry completeness flags and version data.
- concurrent reviews must not silently overwrite one another.
