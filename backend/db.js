/**
 * PostgreSQL Database Adapter for Reel Script Manager
 * Compatible with Neon, Supabase, Render Postgres, or local PostgreSQL.
 * Automatically creates tables and runs initial seed taxonomy if tables don't exist.
 */

import pg from "pg";

const { Pool } = pg;

const SEED_CATEGORIES = [
  "Food",
  "Cafe",
  "Car",
  "Commercial Ad",
  "Meme / Relatable",
  "City Updates",
  "Retail",
  "Education",
  "Hospitality",
  "Fashion",
  "Travel",
  "Technology",
  "Beauty",
  "Lifestyle",
  "Other",
];

let pool = null;

export function getDbPool() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    return null;
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function initPostgresTables() {
  const db = getDbPool();
  if (!db) {
    console.log("ℹ️ No DATABASE_URL found. Running with in-memory / JSON persistence fallback.");
    return false;
  }

  try {
    const client = await db.connect();
    try {
      // 1. Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // 2. Categories table
      await client.query(`
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // 3. Scripts table
      await client.query(`
        CREATE TABLE IF NOT EXISTS scripts (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          script_text TEXT NOT NULL,
          category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
          status VARCHAR(50) DEFAULT 'DRAFT',
          deleted BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // 4. Seed system categories if empty
      const catCount = await client.query("SELECT COUNT(*) FROM categories");
      if (parseInt(catCount.rows[0].count, 10) === 0) {
        for (const catName of SEED_CATEGORIES) {
          await client.query(
            "INSERT INTO categories (name, created_at) VALUES ($1, NOW()) ON CONFLICT (name) DO NOTHING",
            [catName]
          );
        }
        console.log("✅ Seeded shared system categories into PostgreSQL");
      }

      console.log("✅ Connected to persistent PostgreSQL database.");
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("❌ Failed to initialize PostgreSQL tables:", err.message);
    return false;
  }
}
