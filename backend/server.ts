/**
 * Reel Script Manager - Standalone Node.js REST API Server
 * Exact Spring Boot contract matching:
 * - GET    /api/scripts
 * - GET    /api/scripts/:id
 * - GET    /api/scripts/search
 * - POST   /api/scripts
 * - PUT    /api/scripts/:id
 * - DELETE /api/scripts/:id
 * - GET    /api/categories
 * - POST   /api/categories
 * - PUT    /api/categories/:id
 * - DELETE /api/categories/:id
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "db.json");
const PORT = process.env.PORT || 8080;

interface Category {
  id: number;
  name: string;
  createdAt: string;
}

type ScriptStatus = "DRAFT" | "READY" | "PUBLISHED" | "ARCHIVED";

interface Script {
  id: number;
  title: string;
  scriptText: string;
  category: Category | null;
  status: ScriptStatus;
  deleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  categories: Category[];
  scripts: Script[];
  nextCatId: number;
  nextScriptId: number;
}

const SEED_CATEGORIES: Category[] = [
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

const SEED_SCRIPTS: Script[] = [
  {
    id: 1,
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
    title: "New Burger Launch at City Square",
    scriptText:
      "If you're a burger lover in Kharagpur, you CANNOT miss this! 🍔\n\nCity Square just dropped their new Smoky BBQ Loaded Burger and I was literally shaking after the first bite. Double patty, smoked bacon, crispy onion rings, and their secret sauce — all for just ₹249.\n\nThey're running a launch offer too — buy one get one free on weekends only. I'd say get there before the crowd figures this out.\n\nComment 'BURGER' below if you want the full address and timing!\n\n#KharagpurFood #BurgerKharagpur #CitySquare #FoodReel",
    category: SEED_CATEGORIES[0],
    status: "DRAFT",
    deleted: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: "Hidden Highway Dhaba Near IIT Kharagpur",
    scriptText:
      "Save this Reel right now because this hidden dhaba serves the best Tadka and Butter Naan in all of Kharagpur! 🥘\n\nLocated just 4km from IIT Main Gate on the bypass road, Sharma Punjabi Dhaba has been quietly feeding truckers and students for 15 years.\n\nMust-order items:\n1. Dal Tadka with double butter\n2. Kadhai Paneer (super smoky!)\n3. Tandoori Roti with fresh churned white butter\n\nTotal bill for two? Just ₹280. Share this with your hostel gang!\n\n#IITKharagpur #KharagpurEats #DhabaFood #HighwayEats",
    category: SEED_CATEGORIES[0],
    status: "PUBLISHED",
    deleted: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 4,
    title: "Top 3 Sunset Spots in Kharagpur",
    scriptText:
      "Looking for peaceful spots to catch the sunset this weekend? Here are the top 3 spots in Kharagpur you probably didn't know about: 🌅\n\n1. Hijli Forest Watch Tower — untouched nature and bird chirping\n2. Kansai River Banks — golden hour reflections on the water\n3. Nehru Museum Back Lawns — heritage feel with wide open skies\n\nTag the friend you want to visit these places with!\n\n#KharagpurDiaries #SunsetSpots #TravelKGP #WestBengalTravel",
    category: SEED_CATEGORIES[10],
    status: "READY",
    deleted: false,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 5,
    title: "Student Budget Tech Accessories Under ₹500",
    scriptText:
      "Top 3 student-friendly tech gadgets from Kharagpur Market that actually last! ⚡\n\n1. Braided 65W Fast Charging Cable (₹199)\n2. Aluminum Laptop Stand for long study sessions (₹349)\n3. Cable organizer clips set of 6 (₹99)\n\nAvailable at Modern Electronics, Golbazar. Show this Reel for 5% extra discount!\n\n#StudentBudget #TechAccessories #KharagpurShopping #GadgetReels",
    category: SEED_CATEGORIES[11],
    status: "PUBLISHED",
    deleted: false,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

function initDb(): DatabaseSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      return data;
    } catch {
      // ignore
    }
  }
  const initial: DatabaseSchema = {
    categories: SEED_CATEGORIES,
    scripts: SEED_SCRIPTS,
    nextCatId: 100,
    nextScriptId: 100,
  };
  saveDb(initial);
  return initial;
}

function saveDb(db: DatabaseSchema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

let db = initDb();

function sendJson(res: http.ServerResponse, status: number, data: unknown) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(data));
}

function sendError(res: http.ServerResponse, status: number, error: string, message: string, reqPath: string) {
  sendJson(res, status, {
    timestamp: new Date().toISOString(),
    status,
    error,
    message,
    path: reqPath,
  });
}

function readBody(req: http.IncomingMessage): Promise<any> {
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

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;
  const method = req.method?.toUpperCase();

  // Handle CORS preflight
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
    // GET /api/categories
    // ----------------------------------------------------
    if (pathname === "/api/categories" && method === "GET") {
      return sendJson(res, 200, db.categories);
    }

    // ----------------------------------------------------
    // POST /api/categories
    // ----------------------------------------------------
    if (pathname === "/api/categories" && method === "POST") {
      const body = await readBody(req);
      if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
        return sendError(res, 400, "VALIDATION_ERROR", "Category name is required", pathname);
      }
      const newCat: Category = {
        id: db.nextCatId++,
        name: body.name.trim(),
        createdAt: new Date().toISOString(),
      };
      db.categories.push(newCat);
      saveDb(db);
      return sendJson(res, 201, newCat);
    }

    // ----------------------------------------------------
    // PUT /api/categories/:id
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // DELETE /api/categories/:id
    // ----------------------------------------------------
    if (catMatch && method === "DELETE") {
      const catId = Number(catMatch[1]);
      const catIndex = db.categories.findIndex((c) => c.id === catId);
      if (catIndex === -1) {
        return sendError(res, 404, "NOT_FOUND", `Category with id ${catId} not found`, pathname);
      }
      db.categories.splice(catIndex, 1);
      // Remove association from scripts
      db.scripts.forEach((s) => {
        if (s.category?.id === catId) {
          s.category = null;
        }
      });
      saveDb(db);
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
      });
      return res.end();
    }

    // ----------------------------------------------------
    // GET /api/scripts/search
    // ----------------------------------------------------
    if (pathname === "/api/scripts/search" && method === "GET") {
      const q = (parsedUrl.searchParams.get("q") || "").toLowerCase().trim();
      const catIdParam = parsedUrl.searchParams.get("categoryId");
      const categoryId = catIdParam ? Number(catIdParam) : undefined;
      const page = parseInt(parsedUrl.searchParams.get("page") || "0", 10);
      const size = parseInt(parsedUrl.searchParams.get("size") || "20", 10);

      let filtered = db.scripts.filter((s) => !s.deleted);

      if (q) {
        filtered = filtered.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.scriptText.toLowerCase().includes(q)
        );
      }

      if (categoryId !== undefined && !isNaN(categoryId)) {
        filtered = filtered.filter((s) => s.category?.id === categoryId);
      }

      // Sort by updatedAt desc
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

    // ----------------------------------------------------
    // GET /api/scripts (Paginated list)
    // ----------------------------------------------------
    if (pathname === "/api/scripts" && method === "GET") {
      const page = parseInt(parsedUrl.searchParams.get("page") || "0", 10);
      const size = parseInt(parsedUrl.searchParams.get("size") || "20", 10);

      const activeScripts = db.scripts.filter((s) => !s.deleted);
      activeScripts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      const totalElements = activeScripts.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const start = page * size;
      const content = activeScripts.slice(start, start + size);

      return sendJson(res, 200, {
        content,
        page,
        size,
        totalElements,
        totalPages,
      });
    }

    // ----------------------------------------------------
    // POST /api/scripts
    // ----------------------------------------------------
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

      const validStatuses: ScriptStatus[] = ["DRAFT", "READY", "PUBLISHED", "ARCHIVED"];
      const status: ScriptStatus = validStatuses.includes(body.status) ? body.status : "DRAFT";

      let category: Category | null = null;
      if (body.categoryId) {
        category = db.categories.find((c) => c.id === Number(body.categoryId)) || null;
      }

      const newScript: Script = {
        id: db.nextScriptId++,
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

    // ----------------------------------------------------
    // GET /api/scripts/:id
    // ----------------------------------------------------
    const scriptMatch = pathname.match(/^\/api\/scripts\/(\d+)$/);
    if (scriptMatch && method === "GET") {
      const scriptId = Number(scriptMatch[1]);
      const script = db.scripts.find((s) => s.id === scriptId && !s.deleted);
      if (!script) {
        return sendError(res, 404, "NOT_FOUND", `Script with id ${scriptId} not found`, pathname);
      }
      return sendJson(res, 200, script);
    }

    // ----------------------------------------------------
    // PUT /api/scripts/:id
    // ----------------------------------------------------
    if (scriptMatch && method === "PUT") {
      const scriptId = Number(scriptMatch[1]);
      const scriptIndex = db.scripts.findIndex((s) => s.id === scriptId && !s.deleted);
      if (scriptIndex === -1) {
        return sendError(res, 404, "NOT_FOUND", `Script with id ${scriptId} not found`, pathname);
      }

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

      const validStatuses: ScriptStatus[] = ["DRAFT", "READY", "PUBLISHED", "ARCHIVED"];
      const status: ScriptStatus = validStatuses.includes(body.status) ? body.status : db.scripts[scriptIndex].status;

      let category: Category | null = null;
      if (body.categoryId) {
        category = db.categories.find((c) => c.id === Number(body.categoryId)) || null;
      }

      db.scripts[scriptIndex] = {
        ...db.scripts[scriptIndex],
        title: body.title.trim(),
        scriptText: body.scriptText.trim(),
        category,
        status,
        updatedAt: new Date().toISOString(),
      };

      saveDb(db);
      return sendJson(res, 200, db.scripts[scriptIndex]);
    }

    // ----------------------------------------------------
    // DELETE /api/scripts/:id (Soft deletion)
    // ----------------------------------------------------
    if (scriptMatch && method === "DELETE") {
      const scriptId = Number(scriptMatch[1]);
      const scriptIndex = db.scripts.findIndex((s) => s.id === scriptId && !s.deleted);
      if (scriptIndex === -1) {
        return sendError(res, 404, "NOT_FOUND", `Script with id ${scriptId} not found`, pathname);
      }

      // Soft delete
      db.scripts[scriptIndex].deleted = true;
      db.scripts[scriptIndex].updatedAt = new Date().toISOString();
      saveDb(db);

      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
      });
      return res.end();
    }

    // 404 fallback
    return sendError(res, 404, "NOT_FOUND", `Resource ${pathname} not found`, pathname);
  } catch (err: any) {
    console.error("Server error:", err);
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", err.message || "An unexpected error occurred", pathname);
  }
});

server.listen(PORT, () => {
  console.log(`Reel Script Manager Backend API running at http://localhost:${PORT}/api`);
});
