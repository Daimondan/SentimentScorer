"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const AUDIT_FILE = path.join(DATA_DIR, "audit.json");
const PORT = Number(process.env.PORT || 3000);
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

function sendJson(response, statusCode, value, headers = {}) {
  const body = JSON.stringify(value, null, 2);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    ...headers,
  });
  response.end(body);
}

function sendText(response, statusCode, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Content-Length": Buffer.byteLength(body),
  });
  response.end(body);
}

function collectBody(request) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];
    request.on("data", (chunk) => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        reject(new Error("Request body too large"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function contentTypeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
  }[extension] || "application/octet-stream";
}

function serveStatic(response, pathname) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const normalized = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, normalized);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendText(response, 404, "Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": contentTypeFor(filePath),
      "Content-Length": data.length,
      "Cache-Control": "no-cache",
    });
    response.end(data);
  });
}

async function handleApi(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      service: "SentimentScorer",
      storage: "json-baseline",
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  if (request.method === "GET" && url.pathname === "/api/posts") {
    sendJson(response, 200, readJson(POSTS_FILE, []));
    return true;
  }

  if (request.method === "GET" && url.pathname === "/api/reviews") {
    sendJson(response, 200, readJson(REVIEWS_FILE, {}));
    return true;
  }

  if (request.method === "GET" && url.pathname === "/api/export") {
    sendJson(
      response,
      200,
      {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        posts: readJson(POSTS_FILE, []),
        reviews: readJson(REVIEWS_FILE, {}),
        audit: readJson(AUDIT_FILE, []),
      },
      {"Content-Disposition": 'attachment; filename="sentiment-scorer-export.json"'}
    );
    return true;
  }

  if (request.method === "DELETE" && url.pathname === "/api/reviews") {
    writeJsonAtomic(REVIEWS_FILE, {});
    const audit = readJson(AUDIT_FILE, []);
    audit.push({
      event: "reviews_reset",
      at: new Date().toISOString(),
      actor: "baseline-user",
    });
    writeJsonAtomic(AUDIT_FILE, audit);
    sendJson(response, 200, {ok: true});
    return true;
  }

  const reviewMatch = url.pathname.match(/^\/api\/reviews\/(.+)$/);
  if (request.method === "PUT" && reviewMatch) {
    let body;
    try {
      body = JSON.parse(await collectBody(request));
    } catch (error) {
      sendJson(response, 400, {error: `Invalid JSON: ${error.message}`});
      return true;
    }

    const key = decodeURIComponent(reviewMatch[1]);
    const allowedDecisions = new Set([
      "relevant",
      "legacy_throwback",
      "excluded",
      "needs_review",
    ]);

    if (!allowedDecisions.has(body.decision)) {
      sendJson(response, 422, {error: "Unsupported decision"});
      return true;
    }

    const reviews = readJson(REVIEWS_FILE, {});
    const saved = {
      decision: body.decision,
      notes: String(body.notes || "").slice(0, 5000),
      reviewer: String(body.reviewer || "anonymous").slice(0, 200),
      reviewedAt: new Date().toISOString(),
    };
    reviews[key] = saved;
    writeJsonAtomic(REVIEWS_FILE, reviews);

    const audit = readJson(AUDIT_FILE, []);
    audit.push({
      event: "review_saved",
      key,
      at: saved.reviewedAt,
      reviewer: saved.reviewer,
      decision: saved.decision,
    });
    writeJsonAtomic(AUDIT_FILE, audit);

    sendJson(response, 200, saved);
    return true;
  }

  return false;
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      const handled = await handleApi(request, response, url);
      if (!handled) sendJson(response, 404, {error: "API route not found"});
      return;
    }
    serveStatic(response, url.pathname);
  } catch (error) {
    console.error(error);
    if (!response.headersSent) sendJson(response, 500, {error: "Internal server error"});
    else response.end();
  }
});

server.listen(PORT, () => {
  console.log(`SentimentScorer running at http://localhost:${PORT}`);
});
