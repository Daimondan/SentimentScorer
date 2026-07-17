# legacy/ — Original Artifacts

This folder holds the original source artifacts that the reconstructed baseline was built from.

---

## original-review.html

**Source:** Downloaded from the project owner's ChatGPT File Library (created July 15, 2026).
**Original deployment:** `https://sentiment-scorer-aa.gizzle.chatgpt.site/`
**Size:** ~437 KB (single-file HTML application)

This is the original generated single-file review application. It contains:
- the full review UI;
- an embedded June dataset;
- analysis and review tabs;
- browser localStorage for reviewer decisions.

### Relationship to the reconstructed baseline

The rest of this repository (`server.js`, `public/`, `data/`, `docs/`) is a **reconstructed baseline** built to preserve the original's behavior while making it maintainable. The original `review.html` is kept here as the reference artifact.

### How to use

1. Do not modify `original-review.html` — it is an immutable source artifact.
2. When the reconstructed baseline diverges from the original, the original wins for behavior questions.
3. Any feature present in the original but missing from the baseline should be filed as a GitHub issue and added to `docs/BACKLOG.md`.
4. Compare sections of the original against the reconstructed code before removing or replacing behavior.

### Verification

| Field | Value |
|---|---|
| File | `legacy/original-review.html` |
| Size | 437,292 bytes |
| Type | HTML document, UTF-8 |
| First line | `<!doctype html>` |
| Source URL | `https://github.com/Daimondan/SentimentScorer/blob/main/review.html` |