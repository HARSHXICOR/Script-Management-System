/**
 * Reel Script Manager - Fullstack Node.js Web Server (ESM)
 * Serves both:
 * 1. REST API under /api/*
 * 2. Static Frontend (dist/ folder) for all other web requests
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const DB_FILE = path.join(__dirname, "db.json");
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "reel-script-manager-super-secret-key-2026";

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
// Initial Shared Categories & Seed Data
// ----------------------------------------------------
const SEED_CATEGORIES = [
  { id: 1, name: "Food", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 2, name: "Cafe", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 3, name: "Car", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 4, name: "Commercial Ad", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 5, name: "Meme / Relatable", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 6, name: "City Updates", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 7, name: "Retail", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 8, name: "Education", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 9, name: "Hospitality", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 10, name: "Fashion", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 11, name: "Travel", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 12, name: "Technology", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 13, name: "Beauty", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 14, name: "Lifestyle", createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: 15, name: "Other", createdAt: new Date(Date.now() - 36000000).toISOString() },
];

function initDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      if (!data.users) data.users = [];
      if (data.users.length === 0) {
        data.users.push({
          id: 1,
          name: "Harsh (Kharagpur Blogger)",
          email: "demo@example.com",
          passwordHash: hashPassword("password123"),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      if (data.scripts) {
        data.scripts.forEach((s) => {
          if (!s.userId) s.userId = 1;
        });
      }
      if (!data.nextUserId) data.nextUserId = 100;
      saveDb(data);
      return data;
    } catch {
      // ignore
    }
  }

  const initial = {
    users: [
      {
        id: 1,
        name: "Harsh (Kharagpur Blogger)",
        email: "demo@example.com",
        passwordHash: hashPassword("password123"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    categories: SEED_CATEGORIES,
    scripts: [
      {
        id: 1,
        userId: 1,
        title: "Best Cafe in Kharagpur",
        scriptText:
          "Guys, today I found one of the best cafes in Kharagpur and I couldn't wait to tell you about it! 🔥\n\nIt's called Brew & Bites and let me tell you — the vibe is absolutely immaculate. Cozy seating, fairy lights, and that smell of freshly brewed coffee the moment you walk in.\n\nThey have an amazing cold brew and these absolutely insane croissants that you just have to try. The price is super reasonable too — a full breakfast under ₹200.\n\nIf you're a student here or just visiting Kharagpur, this place is a must-visit. Link in bio for the location!\n\n#KharagpurCafe #BrewAndBites #KGPLife #CafeKharagpur",
        category: SEED_CATEGORIES[1],
        status: "READY",
        deleted: false,
        createdAt: new Date(Date.now() - 18000000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 2,
        userId: 1,
        title: "New Burger Launch at City Square",
        scriptText:
          "If you're a burger lover in Kharagpur, you CANNOT miss this! 🍔\n\nCity Square just dropped their new Smoky BBQ Loaded Burger and I was literally shaking after the first bite. Double patty, smoked bacon, crispy onion rings, and their secret sauce — all for just ₹249.\n\nThey're running a launch offer too — buy one get one free on weekends only. I'd say get there before the crowd figures this out.\n\nComment 'BURGER' below if you want the full address and timing!\n\n#KharagpurFood #BurgerKharagpur #CitySquare #FoodReel",
        category: SEED_CATEGORIES[0],
        status: "DRAFT",
        deleted: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    nextCatId: 100,
    nextScriptId: 100,
    nextUserId: 100,
  };
  saveDb(initial);
  return initial;
}

function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write db.json:", err);
  }
}

let db = initDb();

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

function extractAuthenticatedUser(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  const verified = verifyJwt(token);
  if (!verified) return null;
  const user = db.users.find((u) => u.id === verified.userId);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email };
}

// Static file server helper for frontend
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

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;
  const method = req.method ? req.method.toUpperCase() : "GET";

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
  // Non-API routes: Serve Frontend SPA
  // ----------------------------------------------------
  if (!pathname.startsWith("/api")) {
    return serveStaticFile(req, res, pathname);
  }

  try {
    // ====================================================
    // AUTH ENDPOINTS
    // ====================================================

    // POST /api/auth/signup
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
      const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        return sendError(res, 409, "CONFLICT", "User with this email already exists", pathname);
      }

      const newUser = {
        id: db.nextUserId++,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.users.push(newUser);
      saveDb(db);

      const token = generateJwt({ userId: newUser.id, email: newUser.email });
      return sendJson(res, 201, {
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      });
    }

    // POST /api/auth/login
    if (pathname === "/api/auth/login" && method === "POST") {
      const body = await readBody(req);
      const { email, password } = body;

      if (!email || !password) {
        return sendError(res, 400, "VALIDATION_ERROR", "Email and password are required", pathname);
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (!user || !verifyPassword(String(password), user.passwordHash)) {
        return sendError(res, 401, "UNAUTHORIZED", "Invalid email or password", pathname);
      }

      const token = generateJwt({ userId: user.id, email: user.email });
      return sendJson(res, 200, {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    }

    // GET /api/auth/me
    if (pathname === "/api/auth/me" && method === "GET") {
      const authUser = extractAuthenticatedUser(req);
      if (!authUser) {
        return sendError(res, 401, "UNAUTHORIZED", "Unauthorized: invalid or missing token", pathname);
      }
      return sendJson(res, 200, authUser);
    }

    // ====================================================
    // SHARED CATEGORIES (System Categories)
    // ====================================================

    // GET /api/categories
    if (pathname === "/api/categories" && method === "GET") {
      return sendJson(res, 200, db.categories);
    }

    // POST /api/categories
    if (pathname === "/api/categories" && method === "POST") {
      const body = await readBody(req);
      if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
        return sendError(res, 400, "VALIDATION_ERROR", "Category name is required", pathname);
      }
      const newCat = {
        id: db.nextCatId++,
        name: body.name.trim(),
        createdAt: new Date().toISOString(),
      };
      db.categories.push(newCat);
      saveDb(db);
      return sendJson(res, 201, newCat);
    }

    const catMatch = pathname.match(/^\/api\/categories\/(\d+)$/);
    if (catMatch && method === "PUT") {
      const catId = Number(catMatch[1]);
      const body = await readBody(req);
      const catIndex = db.categories.findIndex((c) => c.id === catId);
      if (catIndex === -1) {
        return sendError(res, 404, "NOT_FOUND", `Category with id ${catId} not found`, pathname);
      }
      if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
        return sendError(res, 400, "VALIDATION_ERROR", "Category name is required", pathname);
      }
      db.categories[catIndex].name = body.name.trim();
      saveDb(db);
      return sendJson(res, 200, db.categories[catIndex]);
    }

    if (catMatch && method === "DELETE") {
      const catId = Number(catMatch[1]);
      const catIndex = db.categories.findIndex((c) => c.id === catId);
      if (catIndex === -1) {
        return sendError(res, 404, "NOT_FOUND", `Category with id ${catId} not found`, pathname);
      }
      db.categories.splice(catIndex, 1);
      db.scripts.forEach((s) => {
        if (s.category && s.category.id === catId) {
          s.category = null;
        }
      });
      saveDb(db);
      res.writeHead(204, { "Access-Control-Allow-Origin": "*" });
      return res.end();
    }

    // ====================================================
    // USER-SCOPED SCRIPTS (Ownership Enforcement)
    // ====================================================
    const authUser = extractAuthenticatedUser(req);
    const activeUserId = authUser ? authUser.id : (db.users[0]?.id || 1);

    // GET /api/scripts/search
    if (pathname === "/api/scripts/search" && method === "GET") {
      const q = (parsedUrl.searchParams.get("q") || "").toLowerCase().trim();
      const catIdParam = parsedUrl.searchParams.get("categoryId");
      const categoryId = catIdParam ? Number(catIdParam) : undefined;
      const page = parseInt(parsedUrl.searchParams.get("page") || "0", 10);
      const size = parseInt(parsedUrl.searchParams.get("size") || "20", 10);

      let filtered = db.scripts.filter((s) => s.userId === activeUserId && !s.deleted);

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

      return sendJson(res, 200, {
        content,
        page,
        size,
        totalElements,
        totalPages,
      });
    }

    // GET /api/scripts (Paginated list for current user)
    if (pathname === "/api/scripts" && method === "GET") {
      const page = parseInt(parsedUrl.searchParams.get("page") || "0", 10);
      const size = parseInt(parsedUrl.searchParams.get("size") || "20", 10);

      const userScripts = db.scripts.filter((s) => s.userId === activeUserId && !s.deleted);
      userScripts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      const totalElements = userScripts.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const start = page * size;
      const content = userScripts.slice(start, start + size);

      return sendJson(res, 200, {
        content,
        page,
        size,
        totalElements,
        totalPages,
      });
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

      let category = null;
      if (body.categoryId) {
        category = db.categories.find((c) => c.id === Number(body.categoryId)) || null;
      }

      const newScript = {
        id: db.nextScriptId++,
        userId: activeUserId,
        title: body.title.trim(),
        scriptText: body.scriptText.trim(),
        category,
        status,
        deleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.scripts.unshift(newScript);
      saveDb(db);
      return sendJson(res, 201, newScript);
    }

    // Single script operations: GET, PUT, DELETE
    const scriptMatch = pathname.match(/^\/api\/scripts\/(\d+)$/);
    if (scriptMatch) {
      const scriptId = Number(scriptMatch[1]);
      const scriptIndex = db.scripts.findIndex((s) => s.id === scriptId && !s.deleted);

      if (scriptIndex === -1) {
        return sendError(res, 404, "NOT_FOUND", `Script with id ${scriptId} not found`, pathname);
      }

      const script = db.scripts[scriptIndex];

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
          category = db.categories.find((c) => c.id === Number(body.categoryId)) || null;
        }

        db.scripts[scriptIndex] = {
          ...script,
          title: body.title.trim(),
          scriptText: body.scriptText.trim(),
          category,
          status,
          updatedAt: new Date().toISOString(),
        };

        saveDb(db);
        return sendJson(res, 200, db.scripts[scriptIndex]);
      }

      if (method === "DELETE") {
        db.scripts[scriptIndex].deleted = true;
        db.scripts[scriptIndex].updatedAt = new Date().toISOString();
        saveDb(db);
        res.writeHead(204, { "Access-Control-Allow-Origin": "*" });
        return res.end();
      }
    }

    return sendError(res, 404, "NOT_FOUND", `Resource ${pathname} not found`, pathname);
  } catch (err) {
    console.error("Server error:", err);
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", err.message || "An unexpected error occurred", pathname);
  }
});

server.listen(PORT, () => {
  console.log(`Reel Script Manager Fullstack Server running at http://localhost:${PORT}`);
});
