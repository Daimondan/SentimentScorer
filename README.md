# SentimentScorer — AI Development Handoff

**Start here.** This repository is a self-contained development handoff for the American Apparel social-content review application previously deployed at:

`https://sentiment-scorer-aa.gizzle.chatgpt.site/`

The immediate goal is to let any capable coding AI or developer clone this repository, run the application, understand the product rules, and continue development without needing the original ChatGPT conversation.

---

## Repository structure

```
SentimentScorer/
├── README.md                  ← you are here
├── AGENTS.md                  ← AI contributor instructions + inbox protocol
├── server.js                  ← zero-dependency Node.js API server
├── package.json
├── .env.example
├── .github/
│   ├── AGENT_LOG.md           ← append-only log of every AI agent session
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/
│       ├── feature.md
│       └── classification-error.md
├── public/                    ← browser review UI
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── data/                      ← working application data (JSON store)
│   ├── posts.json             ← representative content records (8 items)
│   ├── reviews.json           ← shared review decisions
│   ├── audit.json             ← append-only review audit events
│   ├── posts.schema.json      ← content item schema
│   └── imports/               ← external source datasets (immutable)
│       ├── README.md
│       └── American_Apparel_June_2026_First_Pass.xlsx  ← 198 first-pass records (8 sheets)
├── legacy/                    ← original source artifacts (immutable)
│   ├── README.md
│   └── original-review.html   ← original generated app (437 KB, from ChatGPT File Library)
├── docs/                      ← architecture, product, classification, backlog
├── inbox/                     ← agent communication & task tracking system
│   ├── README.md              ← protocol documentation
│   ├── status.md              ← rolling current status (read this first)
│   ├── messages/              ← timestamped agent messages
│   ├── tasks/                 ← task tracking files
│   ├── decisions/             ← decision log (ADR-style)
│   └── handoffs/              ← session handoff documents
└── SentimentScorer_GitHub_Ready.zip  ← original upload archive (can be removed after migration)
```

### Key distinctions

- **`data/imports/`** holds the raw external source datasets. The xlsx there (198 records) is the **first-pass validation dataset**, NOT the final complete June scrape. The full June ingestion is still a backlog item.
- **`legacy/`** holds the original single-file `review.html` artifact from the ChatGPT File Library. It is the reference for behavior questions — do not modify it.
- **`inbox/`** is the inter-agent communication layer. Any AI agent working on this repo reads `inbox/status.md` and the latest handoff before starting, and writes a handoff when finishing.

---

## Instructions for the next AI

Read these files in order:

1. `README.md` (this file)
2. `AGENTS.md`
3. `inbox/status.md` — current rolling status
4. Latest file in `inbox/handoffs/` — most recent context handoff
5. `docs/PRODUCT_REQUIREMENTS.md`
6. `docs/CLASSIFICATION_RULES.md`
7. `docs/MEDIA_ANALYSIS_PIPELINE.md`
8. `docs/BACKLOG.md`

Then:

1. Run the existing baseline application.
2. Do not discard working behavior before understanding it.
3. Create a GitHub issue and branch for each material change.
4. Prioritize the P0 items in `docs/BACKLOG.md`.
5. Do not claim full video/audio/carousel analysis until the actual media has been acquired and processed.
6. Preserve automated predictions and human decisions separately.
7. Treat posts and comments as separate content items.
8. **Update `inbox/status.md`** at the start and end of your session.
9. **Write a handoff** in `inbox/handoffs/` when you finish.
10. **Log your session** in `.github/AGENT_LOG.md`.

### Recommended first engineering task

Replace the JSON-file review store with authenticated users and PostgreSQL, while preserving the current API contract and review interface.

### Recommended second engineering task

Implement real full-media processing:

- all carousel children;
- scene-aware video frames;
- audio extraction and transcription;
- on-screen text/OCR;
- timestamped evidence;
- honest media-completeness flags.

---

## What is included

This ZIP contains:

- a working zero-dependency Node.js application;
- a browser review interface;
- shared server-side review persistence using JSON;
- representative June 2026 American Apparel records (8-item sample in `data/posts.json`);
- **198-record first-pass validation dataset** in `data/imports/American_Apparel_June_2026_First_Pass.xlsx` (first pass, not the complete June scrape);
- the original generated application in `legacy/original-review.html`;
- an **agent communication system** in `inbox/` for inter-agent handoffs and task tracking;
- evidence and media-completeness fields;
- exportable review data;
- AI contributor instructions;
- architecture, product, data-model and classification documentation;
- a prioritized development backlog;
- GitHub issue and pull-request templates;
- an append-only agent session log in `.github/AGENT_LOG.md`.

## Source artifacts

### Original review.html — `legacy/original-review.html`

The original single-file application (`review.html`, 437 KB) was created July 15, 2026 in the owner's ChatGPT File Library. It has been downloaded and committed at `legacy/original-review.html`.

- this repository's `server.js` + `public/` is a **reconstructed baseline**, not a byte-identical export;
- the product requirements, known rules, live URL, review behavior and representative data have been preserved;
- `legacy/original-review.html` is the **reference artifact** — when the reconstructed baseline diverges, the original wins for behavior questions;
- do not treat the deployed Gizzle site as the durable source of truth;
- GitHub is the durable source of truth.

---

## Run locally

Requirements:

- Node.js 18 or newer

No package installation is required.

```bash
git clone <your-repository-url>
cd SentimentScorer
node server.js
```

Open:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/api/health
```

A custom port can be used:

```bash
PORT=8080 node server.js
```

## Run with npm

```bash
npm start
```

## Current API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Service health |
| `GET` | `/api/posts` | Retrieve content items |
| `GET` | `/api/reviews` | Retrieve human reviews |
| `PUT` | `/api/reviews/:key` | Save or update a review |
| `DELETE` | `/api/reviews` | Reset review decisions |
| `GET` | `/api/export` | Export posts, reviews and audit history |

## Data files

### Working data (JSON store)

- `data/posts.json` — representative content records (8 items — sample only)
- `data/reviews.json` — shared review decisions
- `data/audit.json` — append-only review audit events
- `data/posts.schema.json` — content item schema

The JSON store is suitable only as an immediately runnable baseline. It is not the production database design.

### Import datasets (immutable source artifacts)

- `data/imports/American_Apparel_June_2026_First_Pass.xlsx` — **198 first-pass validation records** across 8 sheets:
  - Overview (27 rows)
  - All Posts (198 data rows)
  - Relevant Posts (72)
  - Priority Review (32)
  - Separate-Exclude (86)
  - Pulled Comments (15)
  - Query Dictionary (13)
  - Method (30)

**This is the first-pass validation dataset, NOT the final complete June scrape.** The full June ingestion is tracked in `docs/BACKLOG.md` under P1 — Data and classification.

---

## Non-negotiable classification rules

### Posts and comments

A post is one content item. Each comment beneath it is another content item linked to the parent.

A post mentioning American Apparel and a comment beneath it mentioning American Apparel can count as **two separate items**.

### Media analysis

Do not rely only on captions and metadata when actual media is available.

- Inspect every image in a carousel.
- Inspect the full video, not only its cover.
- Extract representative frames across the full clip.
- Detect scene changes.
- Transcribe speech.
- Extract on-screen text.
- Preserve the evidence and timestamps.
- If only a cover image was inspected, record `cover_only`; do not call it full-video analysis.

### Legacy American Apparel

American Apparel currently focuses on shirts. Discontinued product categories can still be relevant as legacy or throwback content.

Examples include:

- disco pants;
- skirts;
- leotards;
- bodysuits;
- older dresses and fashion categories;
- vintage or 2000s/2010s nostalgia.

The word “throwback” does not need to appear in the caption. The visible product can establish legacy context.

### Human feedback

Never overwrite the original automated prediction. Save the human review separately with:

- decision;
- notes;
- reviewer;
- timestamp;
- evidence;
- model/rule version where available.

---

## Current limitations

This baseline does **not** yet provide:

- real authentication;
- PostgreSQL;
- production-safe concurrent writes;
- actual social-platform scraping;
- full June ingestion;
- playable-video acquisition;
- carousel-child acquisition;
- audio transcription;
- OCR;
- background jobs;
- a deployment pipeline;
- production secrets management.

These are documented in `docs/BACKLOG.md`.

---

## GitHub upload

1. Download and unzip this package.
2. Open the extracted folder.
3. Initialize Git:

```bash
git init
git add .
git commit -m "Import SentimentScorer development handoff"
git branch -M main
git remote add origin git@github.com:Daimondan/SentimentScorer.git
git push -u origin main
```

The existing GitHub repository currently contains only a minimal README. If Git refuses because the remote has an existing commit, use:

```bash
git pull origin main --allow-unrelated-histories
```

Resolve the README conflict by keeping this README, then commit and push.

Do not use `--force` unless you understand and intend to replace the remote history.

---

## Prompt to give another AI

Copy this exactly:

> Read README.md, AGENTS.md, inbox/status.md, and the latest handoff in inbox/handoffs/. Then read all files in docs/. Run the application and inspect the current code before making changes. Treat this repository as the project source of truth. Start with the P0 backlog. First propose a short implementation plan, then create small, reviewable changes. Do not remove working behavior without explaining why. Do not claim full visual, carousel, video, audio or OCR analysis unless the relevant media was actually acquired and processed. Preserve human review decisions and automated predictions separately. Update inbox/status.md at the start and end of your session. Write a handoff in inbox/handoffs/ when you finish. Log your session in .github/AGENT_LOG.md.

---

## Project owner intent

The application should eventually allow colleagues to sign in, review shared results, and see one another’s decisions through a central database. It should run complete, auditable date-range scrapes and use multimodal analysis to reduce unnecessary human review without pretending certainty where the media could not be inspected.
