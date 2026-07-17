"use strict";

const state = {
  posts: [],
  reviews: {},
  selectedKey: null,
  search: "",
  platform: "all",
  view: "needs_review",
};

const elements = {
  stats: document.querySelector("#stats"),
  list: document.querySelector("#content-list"),
  search: document.querySelector("#search"),
  platform: document.querySelector("#platform"),
  view: document.querySelector("#view"),
  dialog: document.querySelector("#review-dialog"),
  dialogTitle: document.querySelector("#dialog-title"),
  dialogContent: document.querySelector("#dialog-content"),
  reviewer: document.querySelector("#reviewer"),
  decision: document.querySelector("#decision"),
  notes: document.querySelector("#notes"),
  save: document.querySelector("#save-review"),
  saveStatus: document.querySelector("#save-status"),
  reset: document.querySelector("#reset-reviews"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function humanize(value) {
  return String(value || "unknown").replaceAll("_", " ");
}

function effectiveDecision(post) {
  return state.reviews[post.key]?.decision || post.automated.decision;
}

function mediaWarning(post) {
  if (post.media.status === "cover_only") return "Cover only";
  if (post.media.status === "not_acquired") return "Media unavailable";
  if (post.media.status === "complete") return "Full media";
  return humanize(post.media.status);
}

function filteredPosts() {
  const query = state.search.toLowerCase();
  return state.posts.filter((post) => {
    const matchesSearch = !query || [
      post.author,
      post.caption,
      post.platform,
      post.automated.reason,
      ...(post.hashtags || []),
      ...(post.mentions || []),
      ...(post.evidence || []).map((item) => item.finding),
    ].join(" ").toLowerCase().includes(query);

    const matchesPlatform = state.platform === "all" || post.platform === state.platform;
    const decision = effectiveDecision(post);
    let matchesView = true;

    if (state.view === "reviewed") matchesView = Boolean(state.reviews[post.key]);
    else if (state.view !== "all") matchesView = decision === state.view;

    return matchesSearch && matchesPlatform && matchesView;
  });
}

function renderStats() {
  const humanReviewed = Object.keys(state.reviews).length;
  const needsReview = state.posts.filter((post) => effectiveDecision(post) === "needs_review").length;
  const legacy = state.posts.filter((post) => effectiveDecision(post) === "legacy_throwback").length;
  const comments = state.posts.filter((post) => post.itemType === "comment").length;

  const values = [
    ["Content items", state.posts.length],
    ["Needs review", needsReview],
    ["Legacy / throwback", legacy],
    ["Human reviewed", humanReviewed],
    ["Separate comments", comments],
  ];

  elements.stats.innerHTML = values.map(([label, value]) =>
    `<div class="stat"><strong>${value}</strong><span>${escapeHtml(label)}</span></div>`
  ).join("");
}

function renderList() {
  const posts = filteredPosts();
  if (!posts.length) {
    elements.list.innerHTML = '<div class="empty">No items match the current filters.</div>';
    return;
  }

  elements.list.innerHTML = posts.map((post) => {
    const decision = effectiveDecision(post);
    const review = state.reviews[post.key];
    const badgeClass = decision === "needs_review" ? "alert" : decision === "excluded" ? "bad" : "good";
    const evidence = post.evidence?.[0]?.finding || post.automated.reason;
    return `
      <article class="content-card">
        <div>
          <div class="meta">
            <span>${escapeHtml(post.platform)}</span>
            <span>·</span>
            <span>${escapeHtml(post.itemType)}</span>
            <span>·</span>
            <span>${escapeHtml(post.contentType)}</span>
            ${post.parentKey ? `<span>· parent: ${escapeHtml(post.parentKey)}</span>` : ""}
          </div>
          <h3>@${escapeHtml(post.author)}</h3>
          <p>${escapeHtml(post.caption)}</p>
          <p class="evidence-summary">${escapeHtml(evidence)}</p>
          <a href="${escapeHtml(post.url)}" target="_blank" rel="noreferrer">Open source</a>
        </div>
        <div>
          <span class="badge ${badgeClass}">${escapeHtml(humanize(decision))}</span>
          <p><strong>Media:</strong> ${escapeHtml(mediaWarning(post))}</p>
          <p><strong>Automated confidence:</strong> ${Math.round((post.automated.confidence || 0) * 100)}%</p>
          ${review ? `<p><strong>Reviewed by:</strong> ${escapeHtml(review.reviewer)}</p>` : ""}
        </div>
        <button class="button primary review-button" type="button" data-key="${escapeHtml(post.key)}">
          ${review ? "Edit review" : "Review"}
        </button>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".review-button").forEach((button) => {
    button.addEventListener("click", () => openReview(button.dataset.key));
  });
}

function render() {
  renderStats();
  renderList();
}

function openReview(key) {
  const post = state.posts.find((item) => item.key === key);
  if (!post) return;

  state.selectedKey = key;
  const review = state.reviews[key];

  elements.dialogTitle.textContent = `@${post.author}`;
  elements.reviewer.value = review?.reviewer || localStorage.getItem("sentimentScorerReviewer") || "";
  elements.decision.value = review?.decision || post.automated.decision;
  elements.notes.value = review?.notes || "";
  elements.saveStatus.textContent = "";

  const completeness = [
    ["Media status", post.media.status],
    ["Carousel complete", post.media.carouselComplete],
    ["Video complete", post.media.videoComplete],
    ["Audio transcribed", post.media.audioTranscribed],
    ["OCR complete", post.media.ocrComplete],
  ];

  elements.dialogContent.innerHTML = `
    <div class="detail-grid">
      <section class="panel">
        <p class="eyebrow">CONTENT</p>
        <p>${escapeHtml(post.caption)}</p>
        <p><a href="${escapeHtml(post.url)}" target="_blank" rel="noreferrer">Open original source</a></p>
        <p><strong>Automated decision:</strong> ${escapeHtml(humanize(post.automated.decision))}</p>
        <p><strong>Reason:</strong> ${escapeHtml(post.automated.reason)}</p>
        <p><strong>Review routing:</strong> ${escapeHtml(humanize(post.reviewReason))}</p>
      </section>
      <section class="panel">
        <p class="eyebrow">MEDIA COMPLETENESS</p>
        ${completeness.map(([label, value]) =>
          `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(String(value))}</p>`
        ).join("")}
      </section>
    </div>
    <section class="panel">
      <p class="eyebrow">EVIDENCE</p>
      <ul class="evidence-list">
        ${(post.evidence || []).map((item) =>
          `<li><strong>${escapeHtml(humanize(item.source))}</strong>: ${escapeHtml(item.finding)} (${Math.round((item.confidence || 0) * 100)}%)</li>`
        ).join("")}
      </ul>
    </section>
  `;

  elements.dialog.showModal();
}

async function saveReview() {
  const key = state.selectedKey;
  if (!key) return;

  const reviewer = elements.reviewer.value.trim() || "anonymous";
  localStorage.setItem("sentimentScorerReviewer", reviewer);
  elements.save.disabled = true;
  elements.saveStatus.textContent = "Saving…";

  try {
    const response = await fetch(`/api/reviews/${encodeURIComponent(key)}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        reviewer,
        decision: elements.decision.value,
        notes: elements.notes.value,
      }),
    });
    if (!response.ok) throw new Error(await response.text());
    state.reviews[key] = await response.json();
    elements.saveStatus.textContent = "Saved";
    render();
    setTimeout(() => elements.dialog.close(), 350);
  } catch (error) {
    console.error(error);
    elements.saveStatus.textContent = "Save failed";
  } finally {
    elements.save.disabled = false;
  }
}

async function resetReviews() {
  if (!confirm("Reset all shared baseline review decisions?")) return;
  const response = await fetch("/api/reviews", {method: "DELETE"});
  if (!response.ok) {
    alert("Reset failed.");
    return;
  }
  state.reviews = {};
  render();
}

async function initialize() {
  try {
    const [postsResponse, reviewsResponse] = await Promise.all([
      fetch("/api/posts"),
      fetch("/api/reviews"),
    ]);
    if (!postsResponse.ok || !reviewsResponse.ok) throw new Error("Failed to load application data");
    state.posts = await postsResponse.json();
    state.reviews = await reviewsResponse.json();
    render();
  } catch (error) {
    console.error(error);
    elements.list.innerHTML = `<div class="empty">Could not load the application: ${escapeHtml(error.message)}</div>`;
  }
}

elements.search.addEventListener("input", (event) => {
  state.search = event.target.value.trim();
  renderList();
});
elements.platform.addEventListener("change", (event) => {
  state.platform = event.target.value;
  renderList();
});
elements.view.addEventListener("change", (event) => {
  state.view = event.target.value;
  renderList();
});
elements.save.addEventListener("click", saveReview);
elements.reset.addEventListener("click", resetReviews);

initialize();
