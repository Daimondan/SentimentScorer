"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const LEGACY_HTML = path.join(ROOT, "legacy", "original-review.html");
const DATA_DIR = path.join(ROOT, "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const AUDIT_FILE = path.join(DATA_DIR, "audit.json");
const PORT = Number(process.env.PORT || 9125);
const MAX_BODY_BYTES = 1024 * 1024;

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error.message);
    return fallback;
  }
}

function writeJsonAtomic(filePath, value) {
  const temporary = `${filePath}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, filePath);
}

function sendJson(response, status, value) {
  const body = JSON.stringify(value, null, 2);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(body);
}

function sendFile(response, status, filePath, contentType) {
  try {
    const body = fs.readFileSync(filePath);
    response.writeHead(status, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
    });
    response.end(body);
  } catch (error) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Not found");
  }
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://localhost:${PORT}`);

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end();
    return;
  }

  // Serve the original review.html at /
  if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    return sendFile(response, 200, LEGACY_HTML, "text/html; charset=utf-8");
  }

  // Health check
  if (request.method === "GET" && url.pathname === "/api/health") {
    return sendJson(response, 200, {
      ok: true,
      service: "SentimentScorer",
      storage: "json-baseline",
      source: "legacy/original-review.html",
      timestamp: new Date().toISOString(),
    });
  }

  // API: posts
  if (request.method === "GET" && url.pathname === "/api/posts") {
    const posts = readJson(POSTS_FILE, []);
    return sendJson(response, 200, posts);
  }

  // API: reviews
  if (request.method === "GET" && url.pathname === "/api/reviews") {
    const reviews = readJson(REVIEWS_FILE, {});
    return sendJson(response, 200, reviews);
  }

  // API: export
  if (request.method === "GET" && url.pathname === "/api/export") {
    const posts = readJson(POSTS_FILE, []);
    const reviews = readJson(REVIEWS_FILE, {});
    const audit = readJson(AUDIT_FILE, []);
    return sendJson(response, 200, { posts, reviews, audit, exportedAt: new Date().toISOString() });
  }

  // API: save review
  if (request.method === "PUT" && url.pathname.startsWith("/api/reviews/")) {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_BYTES) {
        request.destroy();
        sendJson(response, 413, { error: "Body too large" });
      }
    });
    request.on("end", () => {
      try {
        const key = decodeURIComponent(url.pathname.replace("/api/reviews/", ""));
        const review = JSON.parse(body);
        const reviews = readJson(REVIEWS_FILE, {});
        reviews[key] = { ...review, timestamp: new Date().toISOString() };
        writeJsonAtomic(REVIEWS_FILE, reviews);

        const audit = readJson(AUDIT_FILE, []);
        audit.push({ key, action: "review", timestamp: new Date().toISOString(), review });
        writeJsonAtomic(AUDIT_FILE, audit);

        sendJson(response, 200, { ok: true, key });
      } catch (error) {
        sendJson(response, 400, { error: error.message });
      }
    });
    return;
  }

  // API: reset reviews
  if (request.method === "DELETE" && url.pathname === "/api/reviews") {
    writeJsonAtomic(REVIEWS_FILE, {});
    writeJsonAtomic(AUDIT_FILE, []);
    return sendJson(response, 200, { ok: true, reset: true });
  }

  // 404
  sendJson(response, 404, { error: "Not found", path: url.pathname });
});

server.listen(PORT, () => {
  console.log(`SentimentScorer serving legacy/original-review.html on port ${PORT}`);
  console.log(`Open: http://localhost:${PORT}`);
});