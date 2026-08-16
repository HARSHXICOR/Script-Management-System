/**
 * Reel Script Manager - Fullstack Node.js Web Server (ESM)
 * Persistent storage:
 * - When DATABASE_URL is set (Neon / Supabase / Postgres): Uses PostgreSQL.
 * - Otherwise: Uses local JSON file persistence.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { getDbPool, initPostgresTables } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const DB_FILE = path.join(__dirname, "db.json");
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "reel-script-manager-super-secret-key-2026";

let isPostgresReady = false;

// MIME types for static assets
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

// ----------------------------------------------------
// Crypto Helpers (PBKDF2 Password Hashing & Simple JWT)
// ----------------------------------------------------
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, combinedHash) {
  try {
    const [salt, originalHash] = combinedHash.split(":");
    if (!salt || !originalHash) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
  } catch {
    return false;
  }
}

function generateJwt(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 7 * 24 * 60 * 60; // 7 days
  const body = Buffer.from(JSON.stringify({ ...payload, iat: now, exp })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verifyJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

// ----------------------------------------------------
// In-Memory / File Fallback Store
// ----------------------------------------------------
const SEED_CATEGORIES = [
  { id: 1, name: "Food", createdAt: new Date().toISOString() },
  { id: 2, name: "Cafe", createdAt: new Date().toISOString() },
  { id: 3, name: "Car", createdAt: new Date().toISOString() },
  { id: 4, name: "Commercial Ad", createdAt: new Date().toISOString() },
  { id: 5, name: "Meme / Relatable", createdAt: new Date().toISOString() },
  { id: 6, name: "City Updates", createdAt: new Date().toISOString() },
  { id: 7, name: "Retail", createdAt: new Date().toISOString() },
  { id: 8, name: "Education", createdAt: new Date().toISOString() },
  { id: 9, name: "Hospitality", createdAt: new Date().toISOString() },
  { id: 10, name: "Fashion", createdAt: new Date().toISOString() },
  { id: 11, name: "Travel", createdAt: new Date().toISOString() },
  { id: 12, name: "Technology", createdAt: new Date().toISOString() },
  { id: 13, name: "Beauty", createdAt: new Date().toISOString() },
  { id: 14, name: "Lifestyle", createdAt: new Date().toISOString() },
  { id: 15, name: "Other", createdAt: new Date().toISOString() },
];

function initJsonDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      if (!data.users) data.users = [];
      if (!data.scripts) data.scripts = [];
      if (!data.categories || data.categories.length === 0) data.categories = SEED_CATEGORIES;
      if (!data.nextUserId) data.nextUserId = 1;
      if (!data.nextScriptId) data.nextScriptId = 1;
      if (!data.nextCatId) data.nextCatId = 100;
      saveJsonDb(data);
      return data;
    } catch {
      // ignore
    }
  }

  const initial = {
    users: [],
    categories: SEED_CATEGORIES,
    scripts: [],
    nextCatId: 100,
    nextScriptId: 1,
    nextUserId: 1,
  };
  saveJsonDb(initial);
  return initial;
}

function saveJsonDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write db.json:", err);
  }
}

let jsonDb = initJsonDb();

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(data));
}

function sendError(res, status, error, message, reqPath) {
  sendJson(res, status, {
    timestamp: new Date().toISOString(),
    status,
    error,
    message,
    path: reqPath,
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

async function extractAuthenticatedUser(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  const verified = verifyJwt(token);
  if (!verified) return null;

  const pool = getDbPool();
  if (isPostgresReady && pool) {
    try {
      const res = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [verified.userId]);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch {
      return null;
    }
  } else {
    const user = jsonDb.users.find((u) => u.id === verified.userId);
    if (!user) return null;
    return { id: user.id, name: user.name, email: user.email };
  }
}

function serveStaticFile(req, res, pathname) {
  let filePath = path.join(DIST_DIR, pathname);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end("<h1>Reel Script Manager is Building...</h1><p>Please refresh in a moment.</p>");
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      return res.end("Server Error");
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content, "utf-8");
  });
}

function serveSwaggerUi(res) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reel Script Manager — Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui.css" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <style>
    body { margin: 0; background: #0f172a; }
    .swagger-ui .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-bundle.js" crossorigin></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-standalone-preset.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/docs',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "BaseLayout",
        deepLinking: true,
        persistAuthorization: true
      });
    };
  </script>
</body>
</html>`;
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;
  const method = req.method ? req.method.toUpperCase() : "GET";
  const pool = isPostgresReady ? getDbPool() : null;

  // CORS preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    return res.end();
  }

  // ----------------------------------------------------
  // Swagger UI & OpenAPI Specification routes
  // ----------------------------------------------------
  if (pathname === "/swagger" || pathname === "/swagger-ui" || pathname === "/docs" || pathname === "/api/swagger") {
    return serveSwaggerUi(res);
  }

  if (pathname === "/api/docs" || pathname === "/api/openapi.json" || pathname === "/swagger.json") {
    return sendJson(res, 200, swaggerDocument);
  }

  if (!pathname.startsWith("/api")) {
    return serveStaticFile(req, res, pathname);
  }

  try {
    // ====================================================
    // 1. AUTH: POST /api/auth/signup
    // ====================================================
    if (pathname === "/api/auth/signup" && method === "POST") {
      const body = await readBody(req);
      const { name, email, password } = body;

      if (!name || typeof name !== "string" || !name.trim()) {
        return sendError(res, 400, "VALIDATION_ERROR", "Name is required", pathname);
      }
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return sendError(res, 400, "VALIDATION_ERROR", "Valid email is required", pathname);
      }
      if (!password || typeof password !== "string" || password.length < 6) {
        return sendError(res, 400, "VALIDATION_ERROR", "Password must be at least 6 characters", pathname);
      }

      const normalizedEmail = email.trim().toLowerCase();
      const pwdHash = hashPassword(password);

      if (pool) {
        const check = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
        if (check.rows.length > 0) {
          return sendError(res, 409, "CONFLICT", "User with this email already exists", pathname);
        }
        const insertRes = await pool.query(
          "INSERT INTO users (name, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, name, email",
          [name.trim(), normalizedEmail, pwdHash]
        );
        const newUser = insertRes.rows[0];
        const token = generateJwt({ userId: newUser.id, email: newUser.email });
        return sendJson(res, 201, { token, user: newUser });
      } else {
        const existing = jsonDb.users.find((u) => u.email.toLowerCase() === normalizedEmail);
        if (existing) {
          return sendError(res, 409, "CONFLICT", "User with this email already exists", pathname);
        }
        const newUser = {
          id: jsonDb.nextUserId++,
          name: name.trim(),
          email: normalizedEmail,
          passwordHash: pwdHash,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        jsonDb.users.push(newUser);
        saveJsonDb(jsonDb);
        const token = generateJwt({ userId: newUser.id, email: newUser.email });
        return sendJson(res, 201, {
          token,
          user: { id: newUser.id, name: newUser.name, email: newUser.email },
        });
      }
    }

    // ====================================================
    // 2. AUTH: POST /api/auth/login
    // ====================================================
    if (pathname === "/api/auth/login" && method === "POST") {
      const body = await readBody(req);
      const { email, password } = body;

      if (!email || !password) {
        return sendError(res, 400, "VALIDATION_ERROR", "Email and password are required", pathname);
      }

      const normalizedEmail = String(email).trim().toLowerCase();

      if (pool) {
        const queryRes = await pool.query(
          "SELECT id, name, email, password_hash FROM users WHERE email = $1",
          [normalizedEmail]
        );
        if (queryRes.rows.length === 0 || !verifyPassword(String(password), queryRes.rows[0].password_hash)) {
          return sendError(res, 401, "UNAUTHORIZED", "Invalid email or password", pathname);
        }
        const user = queryRes.rows[0];
        const token = generateJwt({ userId: user.id, email: user.email });
        return sendJson(res, 200, {
          token,
          user: { id: user.id, name: user.name, email: user.email },
        });
      } else {
        const user = jsonDb.users.find((u) => u.email.toLowerCase() === normalizedEmail);
        if (!user || !verifyPassword(String(password), user.passwordHash)) {
          return sendError(res, 401, "UNAUTHORIZED", "Invalid email or password", pathname);
        }
        const token = generateJwt({ userId: user.id, email: user.email });
        return sendJson(res, 200, {
          token,
          user: { id: user.id, name: user.name, email: user.email },
        });
      }
    }

    // ====================================================
    // 3. AUTH: GET /api/auth/me
    // ====================================================
    if (pathname === "/api/auth/me" && method === "GET") {
      const authUser = await extractAuthenticatedUser(req);
      if (!authUser) {
        return sendError(res, 401, "UNAUTHORIZED", "Unauthorized: invalid or missing token", pathname);
      }
      return sendJson(res, 200, authUser);
    }

    // ====================================================
    // 4. CATEGORIES: Shared System Taxonomy
    // ====================================================
    if (pathname === "/api/categories" && method === "GET") {
      if (pool) {
        const catRes = await pool.query("SELECT id, name, created_at as \"createdAt\" FROM categories ORDER BY id ASC");
        return sendJson(res, 200, catRes.rows);
      } else {
        return sendJson(res, 200, jsonDb.categories);
      }
    }

    if (pathname === "/api/categories" && method === "POST") {
      const body = await readBody(req);
      if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
        return sendError(res, 400, "VALIDATION_ERROR", "Category name is required", pathname);
      }
      if (pool) {
        const insertCat = await pool.query(
          "INSERT INTO categories (name, created_at) VALUES ($1, NOW()) RETURNING id, name, created_at as \"createdAt\"",
          [body.name.trim()]
        );
        return sendJson(res, 201, insertCat.rows[0]);
      } else {
        const newCat = {
          id: jsonDb.nextCatId++,
          name: body.name.trim(),
          createdAt: new Date().toISOString(),
        };
        jsonDb.categories.push(newCat);
        saveJsonDb(jsonDb);
        return sendJson(res, 201, newCat);
      }
    }

    const catMatch = pathname.match(/^\/api\/categories\/(\d+)$/);
    if (catMatch && method === "PUT") {
      const catId = Number(catMatch[1]);
      const body = await readBody(req);
      if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
        return sendError(res, 400, "VALIDATION_ERROR", "Category name is required", pathname);
      }
      if (pool) {
        const updateRes = await pool.query(
          "UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name, created_at as \"createdAt\"",
          [body.name.trim(), catId]
        );
        if (updateRes.rows.length === 0) {
          return sendError(res, 404, "NOT_FOUND", `Category with id ${catId} not found`, pathname);
        }
        return sendJson(res, 200, updateRes.rows[0]);
      } else {
        const catIndex = jsonDb.categories.findIndex((c) => c.id === catId);
        if (catIndex === -1) {
          return sendError(res, 404, "NOT_FOUND", `Category with id ${catId} not found`, pathname);
        }
        jsonDb.categories[catIndex].name = body.name.trim();
        saveJsonDb(jsonDb);
        return sendJson(res, 200, jsonDb.categories[catIndex]);
      }
    }

    if (catMatch && method === "DELETE") {
      const catId = Number(catMatch[1]);
      if (pool) {
        await pool.query("DELETE FROM categories WHERE id = $1", [catId]);
        res.writeHead(204, { "Access-Control-Allow-Origin": "*" });
        return res.end();
      } else {
        const catIndex = jsonDb.categories.findIndex((c) => c.id === catId);
        if (catIndex === -1) {
          return sendError(res, 404, "NOT_FOUND", `Category with id ${catId} not found`, pathname);
        }
        jsonDb.categories.splice(catIndex, 1);
        saveJsonDb(jsonDb);
        res.writeHead(204, { "Access-Control-Allow-Origin": "*" });
        return res.end();
      }
    }

    // ====================================================
    // 5. SCRIPTS: User Ownership Enforced
    // ====================================================
    const authUser = await extractAuthenticatedUser(req);
    const activeUserId = authUser ? authUser.id : (jsonDb.users[0]?.id || 1);

    // GET /api/scripts/search
    if (pathname === "/api/scripts/search" && method === "GET") {
      const q = (parsedUrl.searchParams.get("q") || "").toLowerCase().trim();
      const catIdParam = parsedUrl.searchParams.get("categoryId");
      const categoryId = catIdParam ? Number(catIdParam) : undefined;
      const page = parseInt(parsedUrl.searchParams.get("page") || "0", 10);
      const size = parseInt(parsedUrl.searchParams.get("size") || "20", 10);

      if (pool) {
        let query = `
          SELECT s.id, s.title, s.script_text as "scriptText", s.status, s.created_at as "createdAt", s.updated_at as "updatedAt",
                 c.id as "cat_id", c.name as "cat_name", c.created_at as "cat_created"
          FROM scripts s
          LEFT JOIN categories c ON s.category_id = c.id
          WHERE s.user_id = $1 AND s.deleted = FALSE
        `;
        const params = [activeUserId];
        let paramIdx = 2;

        if (q) {
          query += ` AND (LOWER(s.title) LIKE $${paramIdx} OR LOWER(s.script_text) LIKE $${paramIdx})`;
          params.push(`%${q}%`);
          paramIdx++;
        }

        if (categoryId !== undefined && !isNaN(categoryId)) {
          query += ` AND s.category_id = $${paramIdx}`;
          params.push(categoryId);
          paramIdx++;
        }

        query += " ORDER BY s.updated_at DESC";

        const allResults = await pool.query(query, params);
        const totalElements = allResults.rows.length;
        const totalPages = Math.max(1, Math.ceil(totalElements / size));
        const start = page * size;
        const pageRows = allResults.rows.slice(start, start + size);

        const content = pageRows.map((r) => ({
          id: r.id,
          title: r.title,
          scriptText: r.scriptText,
          status: r.status,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          category: r.cat_id ? { id: r.cat_id, name: r.cat_name, createdAt: r.cat_created } : null,
        }));

        return sendJson(res, 200, { content, page, size, totalElements, totalPages });
      } else {
        let filtered = jsonDb.scripts.filter((s) => s.userId === activeUserId && !s.deleted);

        if (q) {
          filtered = filtered.filter(
            (s) =>
              s.title.toLowerCase().includes(q) ||
              s.scriptText.toLowerCase().includes(q)
          );
        }

        if (categoryId !== undefined && !isNaN(categoryId)) {
          filtered = filtered.filter((s) => s.category && s.category.id === categoryId);
        }

        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        const totalElements = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalElements / size));
        const start = page * size;
        const content = filtered.slice(start, start + size);

        return sendJson(res, 200, { content, page, size, totalElements, totalPages });
      }
    }

    // GET /api/scripts (Paginated list)
    if (pathname === "/api/scripts" && method === "GET") {
      const page = parseInt(parsedUrl.searchParams.get("page") || "0", 10);
      const size = parseInt(parsedUrl.searchParams.get("size") || "20", 10);

      if (pool) {
        const countRes = await pool.query(
          "SELECT COUNT(*) FROM scripts WHERE user_id = $1 AND deleted = FALSE",
          [activeUserId]
        );
        const totalElements = parseInt(countRes.rows[0].count, 10);
        const totalPages = Math.max(1, Math.ceil(totalElements / size));
        const offset = page * size;

        const dataRes = await pool.query(
          `SELECT s.id, s.title, s.script_text as "scriptText", s.status, s.created_at as "createdAt", s.updated_at as "updatedAt",
                  c.id as "cat_id", c.name as "cat_name", c.created_at as "cat_created"
           FROM scripts s
           LEFT JOIN categories c ON s.category_id = c.id
           WHERE s.user_id = $1 AND s.deleted = FALSE
           ORDER BY s.updated_at DESC
           LIMIT $2 OFFSET $3`,
          [activeUserId, size, offset]
        );

        const content = dataRes.rows.map((r) => ({
          id: r.id,
          title: r.title,
          scriptText: r.scriptText,
          status: r.status,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          category: r.cat_id ? { id: r.cat_id, name: r.cat_name, createdAt: r.cat_created } : null,
        }));

        return sendJson(res, 200, { content, page, size, totalElements, totalPages });
      } else {
        const userScripts = jsonDb.scripts.filter((s) => s.userId === activeUserId && !s.deleted);
        userScripts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        const totalElements = userScripts.length;
        const totalPages = Math.max(1, Math.ceil(totalElements / size));
        const start = page * size;
        const content = userScripts.slice(start, start + size);

        return sendJson(res, 200, { content, page, size, totalElements, totalPages });
      }
    }

    // POST /api/scripts
    if (pathname === "/api/scripts" && method === "POST") {
      const body = await readBody(req);
      if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
        return sendError(res, 400, "VALIDATION_ERROR", "Title is required", pathname);
      }
      if (body.title.trim().length > 255) {
        return sendError(res, 400, "VALIDATION_ERROR", "Title must not exceed 255 characters", pathname);
      }
      if (!body.scriptText || typeof body.scriptText !== "string" || !body.scriptText.trim()) {
        return sendError(res, 400, "VALIDATION_ERROR", "Script text is required", pathname);
      }

      const validStatuses = ["DRAFT", "READY", "PUBLISHED", "ARCHIVED"];
      const status = validStatuses.includes(body.status) ? body.status : "DRAFT";
      const categoryId = body.categoryId ? Number(body.categoryId) : null;

      if (pool) {
        const insertRes = await pool.query(
          `INSERT INTO scripts (user_id, title, script_text, category_id, status, deleted, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, FALSE, NOW(), NOW())
           RETURNING id, title, script_text as "scriptText", status, created_at as "createdAt", updated_at as "updatedAt"`,
          [activeUserId, body.title.trim(), body.scriptText.trim(), categoryId, status]
        );
        const newScript = insertRes.rows[0];

        let category = null;
        if (categoryId) {
          const catRes = await pool.query("SELECT id, name, created_at as \"createdAt\" FROM categories WHERE id = $1", [categoryId]);
          if (catRes.rows.length > 0) category = catRes.rows[0];
        }

        return sendJson(res, 201, { ...newScript, category });
      } else {
        let category = null;
        if (categoryId) {
          category = jsonDb.categories.find((c) => c.id === categoryId) || null;
        }

        const newScript = {
          id: jsonDb.nextScriptId++,
          userId: activeUserId,
          title: body.title.trim(),
          scriptText: body.scriptText.trim(),
          category,
          status,
          deleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        jsonDb.scripts.unshift(newScript);
        saveJsonDb(jsonDb);
        return sendJson(res, 201, newScript);
      }
    }

    // Single script operations: GET, PUT, DELETE
    const scriptMatch = pathname.match(/^\/api\/scripts\/(\d+)$/);
    if (scriptMatch) {
      const scriptId = Number(scriptMatch[1]);

      if (pool) {
        const scriptRes = await pool.query(
          `SELECT s.id, s.user_id, s.title, s.script_text as "scriptText", s.status, s.deleted, s.created_at as "createdAt", s.updated_at as "updatedAt",
                  c.id as "cat_id", c.name as "cat_name", c.created_at as "cat_created"
           FROM scripts s
           LEFT JOIN categories c ON s.category_id = c.id
           WHERE s.id = $1 AND s.deleted = FALSE`,
          [scriptId]
        );

        if (scriptRes.rows.length === 0) {
          return sendError(res, 404, "NOT_FOUND", `Script with id ${scriptId} not found`, pathname);
        }

        const script = scriptRes.rows[0];
        if (script.user_id !== activeUserId) {
          return sendError(res, 403, "FORBIDDEN", "You do not have permission to access this script", pathname);
        }

        if (method === "GET") {
          return sendJson(res, 200, {
            id: script.id,
            title: script.title,
            scriptText: script.scriptText,
            status: script.status,
            createdAt: script.createdAt,
            updatedAt: script.updatedAt,
            category: script.cat_id ? { id: script.cat_id, name: script.cat_name, createdAt: script.cat_created } : null,
          });
        }

        if (method === "PUT") {
          const body = await readBody(req);
          if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
            return sendError(res, 400, "VALIDATION_ERROR", "Title is required", pathname);
          }
          if (body.title.trim().length > 255) {
            return sendError(res, 400, "VALIDATION_ERROR", "Title must not exceed 255 characters", pathname);
          }
          if (!body.scriptText || typeof body.scriptText !== "string" || !body.scriptText.trim()) {
            return sendError(res, 400, "VALIDATION_ERROR", "Script text is required", pathname);
          }

          const validStatuses = ["DRAFT", "READY", "PUBLISHED", "ARCHIVED"];
          const status = validStatuses.includes(body.status) ? body.status : script.status;
          const categoryId = body.categoryId ? Number(body.categoryId) : null;

          const updateRes = await pool.query(
            `UPDATE scripts
             SET title = $1, script_text = $2, category_id = $3, status = $4, updated_at = NOW()
             WHERE id = $5 AND user_id = $6
             RETURNING id, title, script_text as "scriptText", status, created_at as "createdAt", updated_at as "updatedAt"`,
            [body.title.trim(), body.scriptText.trim(), categoryId, status, scriptId, activeUserId]
          );

          let category = null;
          if (categoryId) {
            const catRes = await pool.query("SELECT id, name, created_at as \"createdAt\" FROM categories WHERE id = $1", [categoryId]);
            if (catRes.rows.length > 0) category = catRes.rows[0];
          }

          return sendJson(res, 200, { ...updateRes.rows[0], category });
        }

        if (method === "DELETE") {
          await pool.query("UPDATE scripts SET deleted = TRUE, updated_at = NOW() WHERE id = $1 AND user_id = $2", [
            scriptId,
            activeUserId,
          ]);
          res.writeHead(204, { "Access-Control-Allow-Origin": "*" });
          return res.end();
        }
      } else {
        const scriptIndex = jsonDb.scripts.findIndex((s) => s.id === scriptId && !s.deleted);

        if (scriptIndex === -1) {
          return sendError(res, 404, "NOT_FOUND", `Script with id ${scriptId} not found`, pathname);
        }

        const script = jsonDb.scripts[scriptIndex];

        if (script.userId !== activeUserId) {
          return sendError(res, 403, "FORBIDDEN", "You do not have permission to access this script", pathname);
        }

        if (method === "GET") {
          return sendJson(res, 200, script);
        }

        if (method === "PUT") {
          const body = await readBody(req);
          if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
            return sendError(res, 400, "VALIDATION_ERROR", "Title is required", pathname);
          }
          if (body.title.trim().length > 255) {
            return sendError(res, 400, "VALIDATION_ERROR", "Title must not exceed 255 characters", pathname);
          }
          if (!body.scriptText || typeof body.scriptText !== "string" || !body.scriptText.trim()) {
            return sendError(res, 400, "VALIDATION_ERROR", "Script text is required", pathname);
          }

          const validStatuses = ["DRAFT", "READY", "PUBLISHED", "ARCHIVED"];
          const status = validStatuses.includes(body.status) ? body.status : script.status;

          let category = null;
          if (body.categoryId) {
            category = jsonDb.categories.find((c) => c.id === Number(body.categoryId)) || null;
          }

          jsonDb.scripts[scriptIndex] = {
            ...script,
            title: body.title.trim(),
            scriptText: body.scriptText.trim(),
            category,
            status,
            updatedAt: new Date().toISOString(),
          };

          saveJsonDb(jsonDb);
          return sendJson(res, 200, jsonDb.scripts[scriptIndex]);
        }

        if (method === "DELETE") {
          jsonDb.scripts[scriptIndex].deleted = true;
          jsonDb.scripts[scriptIndex].updatedAt = new Date().toISOString();
          saveJsonDb(jsonDb);
          res.writeHead(204, { "Access-Control-Allow-Origin": "*" });
          return res.end();
        }
      }
    }

    return sendError(res, 404, "NOT_FOUND", `Resource ${pathname} not found`, pathname);
  } catch (err) {
    console.error("Server error:", err);
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", err.message || "An unexpected error occurred", pathname);
  }
});

// Initialize PostgreSQL tables if DATABASE_URL provided
initPostgresTables().then((connected) => {
  isPostgresReady = connected;
  server.listen(PORT, () => {
    console.log(`Reel Script Manager Server running at http://localhost:${PORT}`);
    if (connected) {
      console.log("🚀 Persistent PostgreSQL Engine Active.");
    } else {
      console.log("📁 Local / In-memory storage active.");
    }
  });
});
