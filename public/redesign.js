"use strict";

(() => {
  document.documentElement.setAttribute("data-theme", "light");

  function enhanceHeader() {
    const topbar = document.querySelector("#aa-review-root .aa-topbar");
    const identity = topbar?.firstElementChild;
    if (!identity || identity.dataset.enhanced === "true") return;

    identity.dataset.enhanced = "true";
    identity.className = "aa-brand";
    identity.replaceChildren();

    const mark = document.createElement("span");
    mark.className = "aa-brand-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "AA";

    const copy = document.createElement("span");
    copy.className = "aa-brand-copy";

    const eyebrow = document.createElement("span");
    eyebrow.className = "aa-eyebrow";
    eyebrow.textContent = "Social intelligence";

    const title = document.createElement("strong");
    title.textContent = "American Apparel Review";

    const dataset = document.createElement("span");
    dataset.className = "aa-dataset-chip";
    dataset.textContent = "June 2026 · first-pass dataset";

    copy.append(eyebrow, title, dataset);
    identity.append(mark, copy);

    const actions = topbar.lastElementChild;
    actions?.setAttribute("aria-label", "Dataset actions");
    document.querySelector("#aa-export")?.setAttribute("title", "Download local review decisions as JSON");
    document.querySelector("#aa-reset")?.setAttribute("title", "Clear decisions stored in this browser");
  }

  function enhanceNavigation() {
    const tabs = document.querySelector("#aa-tabs");
    if (!tabs) return;
    tabs.setAttribute("role", "tablist");
    tabs.querySelectorAll("[data-tab]").forEach((button) => {
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", "aa-main");
    });
  }

  function decorateStats() {
    document.querySelectorAll("#aa-review-root .viz-stat").forEach((card) => {
      const label = card.querySelector(".text-muted")?.textContent?.toLowerCase() || "";
      const content = card.textContent.toLowerCase();
      let tone = "neutral";
      if (label.includes("positive") || label.includes("net sentiment") || content.includes("currently relevant")) tone = "positive";
      if (label.includes("negative")) tone = "negative";
      if (label.includes("review") || label.includes("unclear") || label.includes("excluded")) tone = "warning";
      card.dataset.tone = tone;
    });
  }

  function enhanceDynamicContent() {
    decorateStats();

    document.querySelectorAll(".aa-table-wrap").forEach((wrapper) => {
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", "Scrollable review table");
      wrapper.tabIndex = 0;
    });

    document.querySelectorAll(".aa-analysis-table").forEach((table) => {
      table.setAttribute("aria-label", "Analysis evidence");
    });

    const composer = document.querySelector(".aa-analysis-controls");
    if (composer) {
      composer.setAttribute("role", "region");
      composer.setAttribute("aria-label", "Analysis question builder");
    }

    document.querySelectorAll(".aa-view-post, .aa-analysis-post").forEach((button) => {
      button.setAttribute("aria-haspopup", "dialog");
    });

    const close = document.querySelector("#aa-close-detail");
    close?.setAttribute("aria-label", "Close evidence detail");
  }

  function initialize() {
    enhanceHeader();
    enhanceNavigation();
    enhanceDynamicContent();

    const main = document.querySelector("#aa-main");
    if (main) {
      const observer = new MutationObserver(enhanceDynamicContent);
      observer.observe(main, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
