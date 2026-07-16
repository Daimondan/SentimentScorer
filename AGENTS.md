# AI Contributor Instructions

These instructions apply to every AI or human contributor.

## Required reading

Read `README.md` and all relevant files in `docs/` before editing code.

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
