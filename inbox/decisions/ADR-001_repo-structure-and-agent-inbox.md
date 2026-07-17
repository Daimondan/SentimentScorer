# ADR-001 — Repository structure and agent communication system

**Date:** 2026-07-17
**Status:** accepted
**Decided by:** project owner (Daimondan) + hermes-agent

## Context

The SentimentScorer repository was uploaded as a zip handoff with loose files at the root. Two critical source artifacts (`review.html` and `American_Apparel_June_2026_First_Pass.xlsx`) were uploaded to the GitHub repo root but not organized into the folder structure. There was no system for AI agents working on this repo to communicate with each other, track tasks, or hand off context.

## Decision

1. **Move source artifacts into structured folders:**
   - `review.html` → `legacy/original-review.html`
   - `American_Apparel_June_2026_First_Pass.xlsx` → `data/imports/`

2. **Clearly label the xlsx dataset as first-pass, not final:**
   - The 198 records are the first-pass validation dataset for June 2026.
   - The complete June scrape is a separate backlog item.

3. **Create an `inbox/` folder system** for agent-to-agent communication:
   - `messages/` — timestamped messages
   - `tasks/` — task tracking
   - `decisions/` — decision log (ADR-style)
   - `handoffs/` — session handoff documents
   - `status.md` — rolling current status

4. **Enhance `.github/` with templates and an agent log** for structured issue/PR tracking.

5. **Update README.md, AGENTS.md, BACKLOG.md** to reference the new structure.

## Consequences

- The GitHub repo root will be cleaner — source artifacts live in purpose-built folders.
- Any AI agent arriving at the repo can read `inbox/status.md` and the latest handoff to understand current state.
- The first-pass vs complete June data distinction is explicit, preventing agents from treating 198 records as the full scrape.
- The inbox system is append-only, creating a durable audit trail of agent work.