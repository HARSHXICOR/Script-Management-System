# Reel Script Manager

A private content-management and productivity tool for storing, organizing, searching, viewing, and editing Instagram promotional Reel scripts.

---

## Features

- **Personal Script Library**: Fast multiline script editor with real-time character & word counters.
- **Server-Side Debounced Search**: Fast search across titles and script contents.
- **Shared System Categories**: Global categories (Food, Cafe, Car, Commercial Ad, Meme / Relatable, City Updates, Travel, Technology, etc.).
- **JWT Authentication & Multi-User Isolation**: User signup and login with PBKDF2 password hashing and token-based protected routes.
- **Full Script Viewer & 1-Click Clipboard**: Read complete untruncated scripts and copy directly to your clipboard.
- **Soft Deletion**: Secure confirmation modal before removing scripts.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run the Backend REST API
```bash
node backend/server.js
```
The REST API server will run at `http://localhost:8080/api`.

### 3. Run the Frontend Dev Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Tech Stack

- **Frontend**: React, Next-compatible routing (React Router), TypeScript, Tailwind CSS, Lucide Icons, Sonner.
- **Backend**: Node.js REST API with Spring Boot contract alignment, signed JWT authentication, and JSON persistence.
