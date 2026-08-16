# 🎬 Reel Script Manager

<p align="center">
  <strong>A focused, lightning-fast content management application engineered for creators to store, categorize, search, and manage Instagram promotional Reel scripts.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React_18_%7C_TypeScript-61DAFB?style=flat-square&logo=react&logoColor=black" alt="Frontend" />
  <img src="https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Backend-Node.js_REST_API-339933?style=flat-square&logo=node.js&logoColor=white" alt="Backend" />
  <img src="https://img.shields.io/badge/Auth-JWT_%2B_PBKDF2-blue?style=flat-square&logo=json-web-tokens&logoColor=white" alt="Auth" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## 📌 Overview

**Reel Script Manager** is designed with a single, frictionless core purpose:

> **Store Reel scripts, organize them by category, search them instantly with debouncing, view full untruncated content, copy to clipboard in 1 click, and edit seamlessly.**

It eliminates cluttered CRM bloat, media kits, and unnecessary dashboards in favor of a clean, content-first writing and library experience tailored for content creators and influencers.

---

## ✨ Key Features

- **⚡ Instant Debounced Search (350ms)**: Real-time search across titles and entire script bodies with combined category filtering.
- **📝 Creator Script Editor**: Multiline script editor with comfortable typography, line height, and dynamic character & word counters.
- **📋 1-Click Clipboard Copying**: Native browser Clipboard API integration for instant copying into recording or scheduling workflows.
- **🏷️ Shared System Taxonomy**: Pre-configured categories (*Food, Cafe, Car, Commercial Ad, Meme / Relatable, City Updates, Travel, Technology, Fashion, etc.*) + lightweight custom category management.
- **🔒 Secure Authentication & Data Isolation**:
  - JWT tokens with 7-day expiration.
  - PBKDF2 (SHA-512) password hashing with unique salts.
  - Automatic session restoration on app startup (`/api/auth/me`).
  - Strict user-level script ownership enforced on the backend.
- **🏷️ Script Status Badges**: Visual state tracking with `DRAFT`, `READY`, `PUBLISHED`, and `ARCHIVED` badges.
- **🗑️ Safe Deletion**: Confirmation dialog preventing accidental script deletions.
- **📱 Fully Responsive**: Content-first fluid UI optimized for desktop, tablet, and mobile screens.

---

## 🏗️ Architecture & Tech Stack

```text
Reel Script Manager
├── Frontend (SPA)
│   ├── React 18 + TypeScript
│   ├── Vite 6 + Tailwind CSS
│   ├── React Router (Client-side routing with ProtectedRoute guards)
│   ├── Lucide Icons + Sonner (Toasts)
│   └── Centralized REST API client (Fetch + Bearer Token interceptor)
│
└── Backend (REST API)
    ├── Pure Node.js HTTP Service / Spring Boot Contract Compliant
    ├── JWT Authentication + PBKDF2 Security
    ├── Serverless Vercel Handler (`/api/index.js`)
    └── Static SPA Asset Server for Fullstack Hosting
```

---

## 📡 REST API Specifications

The backend conforms to the Spring Boot REST API specification:

### Authentication Endpoints
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/signup` | Create a new creator account | No |
| `POST` | `/api/auth/login` | Authenticate and receive JWT token | No |
| `GET` | `/api/auth/me` | Restore user session from Bearer token | Yes |

### Script Endpoints
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/scripts` | Paginated script list for authenticated user | Yes |
| `GET` | `/api/scripts/search` | Search scripts by query (`q`) & category (`categoryId`) | Yes |
| `GET` | `/api/scripts/:id` | Fetch single script details | Yes |
| `POST` | `/api/scripts` | Create a new script | Yes |
| `PUT` | `/api/scripts/:id` | Update an existing script | Yes |
| `DELETE` | `/api/scripts/:id` | Soft delete a script | Yes |

### Category Endpoints
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/categories` | Fetch all shared categories | Yes |
| `POST` | `/api/categories` | Add a new category | Yes |
| `PUT` | `/api/categories/:id` | Rename category | Yes |
| `DELETE` | `/api/categories/:id` | Delete category | Yes |

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **pnpm**

### 1. Clone the Repository
```bash
git clone https://github.com/HARSHXICOR/Script-Management-System.git
cd Script-Management-System
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Backend Server
```bash
node backend/server.js
```
The REST API server will run at `http://localhost:8080/api`.

### 4. Start the Frontend Dev Server (in a new terminal)
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🌐 1-Click Cloud Deployment

### Option A: Render (Fullstack Web Service)
1. Go to [Render Dashboard](https://dashboard.render.com/) $\rightarrow$ **New Web Service**.
2. Connect your repository `HARSHXICOR/Script-Management-System`.
3. Set the following:
   - **Build Command**: `npm install; npm run build`
   - **Start Command**: `node backend/server.js`
   - **Plan**: `Free`
4. Click **Create Web Service**.

### Option B: Vercel (Serverless Fullstack)
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import `HARSHXICOR/Script-Management-System`.
3. Leave all build settings to default (`Framework Preset: Vite`, `Output Directory: dist`).
4. Click **Deploy**. Both the Vite frontend and `/api/*` serverless backend deploy automatically.

---

## 📂 Project Structure

```text
├── api/                    # Vercel serverless API entry point
│   └── index.js
├── backend/                # Standalone Node.js REST API server
│   ├── server.js
│   └── db.json
├── public/                 # Static public assets
│   └── _redirects          # SPA routing rules for Netlify
├── src/
│   ├── api/                # Centralized API service layer
│   │   ├── auth.ts
│   │   ├── categories.ts
│   │   ├── client.ts
│   │   └── scripts.ts
│   ├── app/
│   │   ├── components/     # UI and Feature Components
│   │   │   ├── app-header.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── DeleteDialog.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── ScriptCard.tsx
│   │   │   ├── ScriptEditor.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── context/        # Authentication & State Context
│   │   │   └── auth-context.tsx
│   │   ├── pages/          # Application Views
│   │   │   ├── categories-page.tsx
│   │   │   ├── login.tsx
│   │   │   ├── script-detail.tsx
│   │   │   ├── script-edit.tsx
│   │   │   ├── script-new.tsx
│   │   │   ├── scripts-list.tsx
│   │   │   └── signup.tsx
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── styles/             # Tailwind & Design System Tokens
│   └── types/              # TypeScript Interfaces & Models
├── package.json
├── vercel.json             # Vercel routing & serverless configuration
├── vite.config.ts
└── README.md
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
