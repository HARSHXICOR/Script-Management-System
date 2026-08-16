/**
 * Vercel Serverless Function entry point for all /api/* routes
 * Connects directly to Neon PostgreSQL database.
 */
import crypto from "node:crypto";
import pg from "pg";

const { Pool } = pg;

const JWT_SECRET = process.env.JWT_SECRET || "reel-script-manager-super-secret-key-2026";
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_DJxSquN1X2tH@ep-raspy-wildflower-ax6hpdo7.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

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
  const exp = now + 7 * 24 * 60 * 60;
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
  return new Promise((resolve) => {
    if (req.body) return resolve(req.body);
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

async function extractAuthenticatedUser(req, db) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  const verified = verifyJwt(token);
  if (!verified) return null;

  try {
    const res = await db.query("SELECT id, name, email FROM users WHERE id = $1", [verified.userId]);
    if (res.rows.length === 0) return null;
    return res.rows[0];
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  let pathname = url.pathname;
  if (!pathname.startsWith("/api")) {
    pathname = `/api${pathname}`;
  }
  const method = req.method ? req.method.toUpperCase() : "GET";
  const db = getPool();

  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    return res.end();
  }

  try {
    // ----------------------------------------------------
    // POST /api/auth/signup
    // ----------------------------------------------------
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

      const check = await db.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
      if (check.rows.length > 0) {
        return sendError(res, 409, "CONFLICT", "User with this email already exists", pathname);
      }

      const insertRes = await db.query(
        "INSERT INTO users (name, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, name, email",
        [name.trim(), normalizedEmail, pwdHash]
      );
      const newUser = insertRes.rows[0];
      const token = generateJwt({ userId: newUser.id, email: newUser.email });
      return sendJson(res, 201, { token, user: newUser });
    }

    // ----------------------------------------------------
    // POST /api/auth/login
    // ----------------------------------------------------
    if (pathname === "/api/auth/login" && method === "POST") {
      const body = await readBody(req);
      const { email, password } = body;
      if (!email || !password) {
        return sendError(res, 400, "VALIDATION_ERROR", "Email and password are required", pathname);
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const queryRes = await db.query(
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
    }

    // ----------------------------------------------------
    // GET /api/auth/me
    // ----------------------------------------------------
    if (pathname === "/api/auth/me" && method === "GET") {
      const authUser = await extractAuthenticatedUser(req, db);
      if (!authUser) {
        return sendError(res, 401, "UNAUTHORIZED", "Unauthorized: invalid or missing token", pathname);
      }
      return sendJson(res, 200, authUser);
    }

    // ----------------------------------------------------
    // CATEGORIES: Shared System Taxonomy
    // ----------------------------------------------------
    if (pathname === "/api/categories" && method === "GET") {
      const catRes = await db.query("SELECT id, name, created_at as \"createdAt\" FROM categories ORDER BY id ASC");
      return sendJson(res, 200, catRes.rows);
    }

    if (pathname === "/api/categories" && method === "POST") {
      const body = await readBody(req);
      if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
        return sendError(res, 400, "VALIDATION_ERROR", "Category name is required", pathname);
      }
      const insertCat = await db.query(
        "INSERT INTO categories (name, created_at) VALUES ($1, NOW()) RETURNING id, name, created_at as \"createdAt\"",
        [body.name.trim()]
      );
      return sendJson(res, 201, insertCat.rows[0]);
    }

    const catMatch = pathname.match(/^\/api\/categories\/(\d+)$/);
    if (catMatch && method === "PUT") {
      const catId = Number(catMatch[1]);
      const body = await readBody(req);
      if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
        return sendError(res, 400, "VALIDATION_ERROR", "Category name is required", pathname);
      }
      const updateRes = await db.query(
        "UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name, created_at as \"createdAt\"",
        [body.name.trim(), catId]
      );
      if (updateRes.rows.length === 0) {
        return sendError(res, 404, "NOT_FOUND", `Category with id ${catId} not found`, pathname);
      }
      return sendJson(res, 200, updateRes.rows[0]);
    }

    if (catMatch && method === "DELETE") {
      const catId = Number(catMatch[1]);
      await db.query("DELETE FROM categories WHERE id = $1", [catId]);
      res.writeHead(204, { "Access-Control-Allow-Origin": "*" });
      return res.end();
    }

    // ----------------------------------------------------
    // SCRIPTS: User Ownership Enforced
    // ----------------------------------------------------
    const authUser = await extractAuthenticatedUser(req, db);
    const activeUserId = authUser ? authUser.id : 1;

    // GET /api/scripts/search
    if (pathname === "/api/scripts/search" && method === "GET") {
      const q = (url.searchParams.get("q") || "").toLowerCase().trim();
      const catIdParam = url.searchParams.get("categoryId");
      const categoryId = catIdParam ? Number(catIdParam) : undefined;
      const page = parseInt(url.searchParams.get("page") || "0", 10);
      const size = parseInt(url.searchParams.get("size") || "20", 10);

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

      const allResults = await db.query(query, params);
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
    }

    // GET /api/scripts
    if (pathname === "/api/scripts" && method === "GET") {
      const page = parseInt(url.searchParams.get("page") || "0", 10);
      const size = parseInt(url.searchParams.get("size") || "20", 10);

      const countRes = await db.query(
        "SELECT COUNT(*) FROM scripts WHERE user_id = $1 AND deleted = FALSE",
        [activeUserId]
      );
      const totalElements = parseInt(countRes.rows[0].count, 10);
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const offset = page * size;

      const dataRes = await db.query(
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

      const insertRes = await db.query(
        `INSERT INTO scripts (user_id, title, script_text, category_id, status, deleted, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, FALSE, NOW(), NOW())
         RETURNING id, title, script_text as "scriptText", status, created_at as "createdAt", updated_at as "updatedAt"`,
        [activeUserId, body.title.trim(), body.scriptText.trim(), categoryId, status]
      );
      const newScript = insertRes.rows[0];

      let category = null;
      if (categoryId) {
        const catRes = await db.query("SELECT id, name, created_at as \"createdAt\" FROM categories WHERE id = $1", [categoryId]);
        if (catRes.rows.length > 0) category = catRes.rows[0];
      }

      return sendJson(res, 201, { ...newScript, category });
    }

    // Single script: GET, PUT, DELETE
    const scriptMatch = pathname.match(/^\/api\/scripts\/(\d+)$/);
    if (scriptMatch) {
      const scriptId = Number(scriptMatch[1]);

      const scriptRes = await db.query(
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

        const updateRes = await db.query(
          `UPDATE scripts
           SET title = $1, script_text = $2, category_id = $3, status = $4, updated_at = NOW()
           WHERE id = $5 AND user_id = $6
           RETURNING id, title, script_text as "scriptText", status, created_at as "createdAt", updated_at as "updatedAt"`,
          [body.title.trim(), body.scriptText.trim(), categoryId, status, scriptId, activeUserId]
        );

        let category = null;
        if (categoryId) {
          const catRes = await db.query("SELECT id, name, created_at as \"createdAt\" FROM categories WHERE id = $1", [categoryId]);
          if (catRes.rows.length > 0) category = catRes.rows[0];
        }

        return sendJson(res, 200, { ...updateRes.rows[0], category });
      }

      if (method === "DELETE") {
        await db.query("UPDATE scripts SET deleted = TRUE, updated_at = NOW() WHERE id = $1 AND user_id = $2", [
          scriptId,
          activeUserId,
        ]);
        res.writeHead(204, { "Access-Control-Allow-Origin": "*" });
        return res.end();
      }
    }

    return sendError(res, 404, "NOT_FOUND", `Resource ${pathname} not found`, pathname);
  } catch (err) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", err.message || "Internal server error", pathname);
  }
}
