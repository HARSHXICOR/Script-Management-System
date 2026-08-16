import type { Category } from "../types/category";
import type { Script, ScriptStatus } from "../types/script";

const CATEGORIES_KEY = "rsm_categories";
const SCRIPTS_KEY = "rsm_scripts";
const SEQ_KEY = "rsm_seq";

function getSeq(): { cat: number; script: number } {
  const raw = localStorage.getItem(SEQ_KEY);
  return raw ? JSON.parse(raw) : { cat: 100, script: 100 };
}
function nextId(kind: "cat" | "script"): number {
  const seq = getSeq();
  seq[kind] += 1;
  localStorage.setItem(SEQ_KEY, JSON.stringify(seq));
  return seq[kind];
}

function now(): string {
  return new Date().toISOString();
}

function isoAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

const SEED_CATEGORIES: Category[] = [
  { id: 1, name: "Food", createdAt: isoAgo(10000) },
  { id: 2, name: "Cafe", createdAt: isoAgo(10000) },
  { id: 3, name: "Car", createdAt: isoAgo(10000) },
  { id: 4, name: "Commercial Ad", createdAt: isoAgo(10000) },
  { id: 5, name: "Meme / Relatable", createdAt: isoAgo(10000) },
  { id: 6, name: "City Updates", createdAt: isoAgo(10000) },
  { id: 7, name: "Retail", createdAt: isoAgo(10000) },
  { id: 8, name: "Education", createdAt: isoAgo(10000) },
  { id: 9, name: "Hospitality", createdAt: isoAgo(10000) },
  { id: 10, name: "Fashion", createdAt: isoAgo(10000) },
  { id: 11, name: "Travel", createdAt: isoAgo(10000) },
  { id: 12, name: "Technology", createdAt: isoAgo(10000) },
  { id: 13, name: "Beauty", createdAt: isoAgo(10000) },
  { id: 14, name: "Lifestyle", createdAt: isoAgo(10000) },
  { id: 15, name: "Other", createdAt: isoAgo(10000) },
];

const SEED_SCRIPTS: Script[] = [
  {
    id: 1,
    title: "Best Cafe in Kharagpur",
    scriptText:
      "Guys, today I found one of the best cafes in Kharagpur and I couldn't wait to tell you about it! 🔥\n\nIt's called Brew & Bites and let me tell you — the vibe is absolutely immaculate. Cozy seating, fairy lights, and that smell of freshly brewed coffee the moment you walk in.\n\nThey have an amazing cold brew and these absolutely insane croissants that you just have to try. The price is super reasonable too — a full breakfast under ₹200.\n\nIf you're a student here or just visiting Kharagpur, this place is a must-visit. Link in bio for the location!\n\n#KharagpurCafe #BrewAndBites #KGPLife #CafeKharagpur",
    category: SEED_CATEGORIES[1],
    status: "READY",
    createdAt: isoAgo(300),
    updatedAt: isoAgo(120),
  },
  {
    id: 2,
    title: "New Burger Launch at City Square",
    scriptText:
      "If you're a burger lover in Kharagpur, you CANNOT miss this! 🍔\n\nCity Square just dropped their new Smoky BBQ Loaded Burger and I was literally shaking after the first bite. Double patty, smoked bacon, crispy onion rings, and their secret sauce — all for just ₹249.\n\nThey're running a launch offer too — buy one get one free on weekends only. I'd say get there before the crowd figures this out.\n\nComment 'BURGER' below if you want the full address and timing!\n\n#KharagpurFood #BurgerKharagpur #CitySquare #FoodReel",
    category: SEED_CATEGORIES[0],
    status: "DRAFT",
    createdAt: isoAgo(1440),
    updatedAt: isoAgo(720),
  },
  {
    id: 3,
    title: "ITI More Street Food Tour",
    scriptText:
      "Kharagpur's ITI More at night is absolutely unbeatable for street food. Let me take you on a tour! 🌙\n\nFirst stop — the famous egg roll stall. ₹40 for the most satisfying egg roll you'll ever eat.\n\nNext up — chowmein. Hot, spicy, and loaded with vegetables. You can smell it from 50 metres away.\n\nAnd finally, the jalebi guy who sets up right at 8 PM. Fresh, crispy, and dripping with syrup.\n\nKharagpur, you're sleeping on this. Let me know which one you want me to review first!\n\n#KharagpurStreetFood #ITIMore #NightEats #KGPFoodDiaries",
    category: SEED_CATEGORIES[0],
    status: "PUBLISHED",
    createdAt: isoAgo(4320),
    updatedAt: isoAgo(2880),
  },
  {
    id: 4,
    title: "IIT Kharagpur Campus Walk",
    scriptText:
      "Did you know IIT Kharagpur is one of the largest university campuses in Asia? Let me show you what that actually looks like. 🏛️\n\nWe're talking 2,100 acres. To put that in perspective, that's bigger than many small towns.\n\nThe main building, the Nehru Museum of Science and Technology, the beautiful lake, the 2.5 km Technology Students' Gymkhana ground — every corner has something.\n\nI've been exploring this campus for months and I still find new spots. If you're ever visiting Kharagpur, a campus walk is absolutely on the list.\n\nFollow for more Kharagpur hidden gems!\n\n#IITKharagpur #KGPCampus #KharagpurTourism #UniversityLife",
    category: SEED_CATEGORIES[5],
    status: "READY",
    createdAt: isoAgo(7200),
    updatedAt: isoAgo(3600),
  },
  {
    id: 5,
    title: "Weekend Car Detailing Service Review",
    scriptText:
      "Got my car detailed at this new place in Kharagpur and honestly I was impressed. 🚗✨\n\nPro Auto Detailing near Inda More — they did a full exterior polish, interior deep clean, and ceramic coating for ₹3,500. That is genuinely good value for the work they put in.\n\nThe best part? They finished in 4 hours and returned the car spotless. I mean genuinely spotless — the kind of clean where you feel bad getting in.\n\nIf your car is looking tired, this is the place to go. DM me for the contact details!\n\n#KharagpurCar #CarDetailingKharagpur #AutoDetailing",
    category: SEED_CATEGORIES[2],
    status: "DRAFT",
    createdAt: isoAgo(8640),
    updatedAt: isoAgo(8640),
  },
  {
    id: 6,
    title: "Kharagpur Shopping Malls — Hidden Gems",
    scriptText:
      "People always say there's nothing to shop in Kharagpur. Let me prove them wrong. 🛍️\n\nFirst — Forum Sujana Mall has actually gotten a solid upgrade. Zara, H&M, and a bunch of local brands worth exploring.\n\nSecond — the Inda Bazar market. Real Kharagpur shopping experience. Sarees, electronics, everything at negotiable prices.\n\nThird — Sunday market at Golbazar. Fresh produce, local crafts, and honestly the most vibrant atmosphere you'll find.\n\nKharagpur's retail scene is underrated. Save this if you need a shopping guide!\n\n#KharagpurShopping #KGPLife #KharagpurMall #ShoppingGuide",
    category: SEED_CATEGORIES[6],
    status: "ARCHIVED",
    createdAt: isoAgo(14400),
    updatedAt: isoAgo(10080),
  },
];

function loadCategories(): Category[] {
  const raw = localStorage.getItem(CATEGORIES_KEY);
  if (!raw) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(SEED_CATEGORIES));
    return SEED_CATEGORIES;
  }
  return JSON.parse(raw) as Category[];
}

function saveCategories(cats: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
}

function loadScripts(): Script[] {
  const raw = localStorage.getItem(SCRIPTS_KEY);
  if (!raw) {
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(SEED_SCRIPTS));
    return SEED_SCRIPTS;
  }
  return JSON.parse(raw) as Script[];
}

function saveScripts(scripts: Script[]): void {
  localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
}

function delay(ms = 250): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const mockCategoryStore = {
  getAll: async (): Promise<Category[]> => {
    await delay();
    return loadCategories();
  },
  create: async (name: string): Promise<Category> => {
    await delay();
    const cats = loadCategories();
    const cat: Category = { id: nextId("cat"), name, createdAt: now() };
    saveCategories([...cats, cat]);
    return cat;
  },
  update: async (id: number, name: string): Promise<Category> => {
    await delay();
    const cats = loadCategories();
    const idx = cats.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Category not found");
    cats[idx] = { ...cats[idx], name };
    saveCategories(cats);
    return cats[idx];
  },
  delete: async (id: number): Promise<void> => {
    await delay();
    const cats = loadCategories();
    saveCategories(cats.filter((c) => c.id !== id));
  },
};

export const mockScriptStore = {
  getPage: async (page: number, size: number): Promise<{ content: Script[]; page: number; size: number; totalElements: number; totalPages: number }> => {
    await delay();
    const all = loadScripts();
    const sorted = [...all].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    const start = page * size;
    return {
      content: sorted.slice(start, start + size),
      page,
      size,
      totalElements: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / size)),
    };
  },
  search: async (q: string, categoryId?: number, page = 0, size = 20): Promise<{ content: Script[]; page: number; size: number; totalElements: number; totalPages: number }> => {
    await delay();
    const all = loadScripts();
    const lower = q.toLowerCase();
    const filtered = all.filter((s) => {
      const matchesText = s.title.toLowerCase().includes(lower) || s.scriptText.toLowerCase().includes(lower);
      const matchesCat = categoryId ? s.category?.id === categoryId : true;
      return matchesText && matchesCat;
    });
    const sorted = [...filtered].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    const start = page * size;
    return {
      content: sorted.slice(start, start + size),
      page,
      size,
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / size)),
    };
  },
  getById: async (id: number): Promise<Script> => {
    await delay();
    const all = loadScripts();
    const found = all.find((s) => s.id === id);
    if (!found) throw Object.assign(new Error("Script not found"), { status: 404 });
    return found;
  },
  create: async (data: { title: string; scriptText: string; categoryId: number | null; status: ScriptStatus }): Promise<Script> => {
    await delay();
    const cats = loadCategories();
    const all = loadScripts();
    const cat = data.categoryId ? (cats.find((c) => c.id === data.categoryId) ?? null) : null;
    const script: Script = {
      id: nextId("script"),
      title: data.title,
      scriptText: data.scriptText,
      category: cat,
      status: data.status,
      createdAt: now(),
      updatedAt: now(),
    };
    saveScripts([...all, script]);
    return script;
  },
  update: async (id: number, data: { title: string; scriptText: string; categoryId: number | null; status: ScriptStatus }): Promise<Script> => {
    await delay();
    const cats = loadCategories();
    const all = loadScripts();
    const idx = all.findIndex((s) => s.id === id);
    if (idx === -1) throw Object.assign(new Error("Script not found"), { status: 404 });
    const cat = data.categoryId ? (cats.find((c) => c.id === data.categoryId) ?? null) : null;
    all[idx] = { ...all[idx], title: data.title, scriptText: data.scriptText, category: cat, status: data.status, updatedAt: now() };
    saveScripts(all);
    return all[idx];
  },
  delete: async (id: number): Promise<void> => {
    await delay();
    const all = loadScripts();
    if (!all.find((s) => s.id === id)) throw Object.assign(new Error("Script not found"), { status: 404 });
    saveScripts(all.filter((s) => s.id !== id));
  },
};
