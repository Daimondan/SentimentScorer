# AI Contributor Instructions

These instructions apply to every AI or human contributor.

## Required reading

Read `README.md`, `inbox/status.md`, the latest file in `inbox/handoffs/`, and all relevant files in `docs/` before editing code.

## Inbox protocol — agent communication

This repo uses an `inbox/` folder system for inter-agent communication. See `inbox/README.md` for the full protocol.

### Before starting work

1. Read `inbox/status.md` for the current state.
2. Read the most recent file in `inbox/handoffs/` if one exists.
3. Check `inbox/tasks/` for anything assigned or in-progress.
4. Check `inbox/decisions/` for prior decisions that affect your work.

### While working

1. Update `inbox/status.md` at the start and end of your session.
2. Create a message in `inbox/messages/` if you need to flag something for the next agent.
3. Create or update a task file in `inbox/tasks/` for any multi-step work.
4. Log any significant decision in `inbox/decisions/` as an ADR.

### When finishing a session

1. Write a handoff document in `inbox/handoffs/` with: what you did, what is in-progress, what the next agent should do, any blockers.
2. Update `inbox/status.md` with the final state.
3. Append an entry to `.github/AGENT_LOG.md`.

### Rules

- **Never delete** files in `inbox/` — append-only.
- **Never edit** a file you didn't create — add a new file instead.
- **Always timestamp** entries (UTC).
- **Always identify** your agent name and model.
- **Reference commits** when mentioning work.

## Source artifacts — do not modify

- `legacy/original-review.html` — the original generated application. Immutable reference artifact.
- `data/imports/American_Apparel_June_2026_First_Pass.xlsx` — the first-pass validation dataset (198 records). Immutable source data.

## Data distinction — first-pass vs complete

The xlsx in `data/imports/` is the **first-pass validation dataset**, not the final complete June scrape. Do not treat 198 records as the full June ingestion. The complete scrape is a backlog item.

## Development rules

1. Preserve working behavior until the replacement is tested.
2. Use branches and pull requests for material changes.
3. Never commit secrets, login cookies, private tokens or production user data.
4. Keep scraping, media acquisition, classification and human review as distinct stages.
5. Store input-completeness flags for every analysis.
6. Keep automated predictions separate from human decisions.
7. Treat a parent post and every comment as separate content items.
8. Inspect every carousel child when available.
9. Do not treat a cover frame as a complete video analysis.
10. Record model, prompt and rule versions.
11. Add tests for classification-rule changes.
12. State limitations honestly in pull requests and UI copy.

## Before merging classification changes

Test at minimum:

- current American Apparel shirts;
- legacy disco pants;
- legacy leotards/bodysuits;
- incidental brand tagging;
- unrelated apparel using “American” language;
- carousel evidence appearing after the first image;
- spoken brand mentions;
- on-screen brand text;
- unavailable media;
- a post and a linked comment counted separately.

## Pull-request checklist

Include:

- user problem;
- proposed behavior;
- data/schema effects;
- tests;
- deployment or migration steps;
- risks;
- before/after examples.
