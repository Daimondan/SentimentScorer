# data/imports/ — External Import Datasets

This folder holds raw external datasets that were imported into the project.
These files are **source artifacts**, not the working application data.

---

## American_Apparel_June_2026_First_Pass.xlsx

**Status:** Awaiting upload from project owner.

**What this is:**
- 198 records representing the **first-pass validation dataset** for June 2026 American Apparel social content.
- Covers Instagram and TikTok posts and comments.
- Each record includes automated classification, confidence, evidence, and media-completeness flags.

**What this is NOT:**
- This is **not** the final complete June scrape.
- This is a first-pass sample used to validate the classification pipeline and review workflow.
- The full June ingestion (all platforms, all date ranges, all content types) is tracked in `docs/BACKLOG.md` under P1 — Data and classification.

**When committed:**
Place the xlsx file directly in this folder:

```
data/imports/American_Apparel_June_2026_First_Pass.xlsx
```

Then update this README with the commit hash and record count confirmation.

---

## Import workflow

1. Place the source file in this folder.
2. Do not modify the original file — treat it as an immutable source artifact.
3. If the data needs to be loaded into the application, write an import script that reads from this folder and writes to `data/posts.json` (or eventually PostgreSQL).
4. Log every import in `docs/CURRENT_STATE.md` with date, record count, and any transformations applied.