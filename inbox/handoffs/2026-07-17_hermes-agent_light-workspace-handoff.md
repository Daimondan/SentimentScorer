# Handoff — Light Review Workspace

## Summary

The production review app now composes the immutable `legacy/original-review.html` artifact with a dedicated redesign layer:

- `public/redesign.css` contains the complete light workspace visual system.
- `public/redesign.js` adds semantic classes, accessibility metadata, and progressive enhancement without changing the embedded review logic.
- `server-legacy.js` injects both assets at response time and serves them directly.

This keeps the original 437 KB review artifact authoritative while allowing a maintainable UI layer.

## Design Direction

- Warm neutral canvas, white cards, soft charcoal text.
- `#B3262D` is the primary action and active-state color; black is no longer the dominant UI color.
- Metric cards and the 1.3% strict target result have distinct hierarchy.
- Analysis is presented as an “Ask the data” composer.
- Evidence details use a right-side drawer on desktop.
- Evidence converts from a table to stacked labeled content on narrow screens.
- Astryx-informed tokenization, focus states, control sizing, and restrained elevation were applied; the React component package was intentionally not introduced into this zero-dependency vanilla app.

## Deployment

- `sentiment-scorer.service` runs `/usr/bin/node server-legacy.js` from `/home/daimon/SentimentScorer`.
- A systemd drop-in at `/etc/systemd/system/sentiment-scorer.service.d/override.conf` selects the legacy-composition server.
- Traefik routes `aascraper.glenbeu.com` to `127.0.0.1:9125`.
- TLS uses a valid Let's Encrypt certificate.

## Verification

Puppeteer tests exercised the public HTTPS URL at desktop and 390px mobile widths. They verified light-theme tokens, seven navigation tabs, hidden context-specific filters, the 1.3% result, priority review detail drawer, comments, sources, full-width mobile action, no horizontal overflow, and zero uncaught page errors.
