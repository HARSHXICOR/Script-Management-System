# Reel Script Manager — Frontend Development Prompt

Build a polished, production-quality web application called **Reel Script Manager**.

The application is a private content-management tool for storing and managing Instagram promotional Reel scripts.

The application has ONE core purpose:

> **Store Reel scripts, organize them by category, search them quickly, view them, edit them, and update them.**

Do not build a CRM, campaign manager, media kit, analytics dashboard, Instagram integration, or client-management system.

---

# 1. Technology

Use:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Modern component architecture
* Responsive design
* REST API integration

The backend is a separate Spring Boot + PostgreSQL application.

The frontend must communicate with the backend only through REST APIs.

---

# 2. Application Structure

Keep the application simple.

Required screens:

```text
Dashboard / Scripts
    │
    ├── Search
    ├── Category Filter
    ├── Script List
    │
    ├── New Script
    │
    └── Script Detail
            │
            └── Edit Script
```

Recommended routes:

```text
/
 /scripts
 /scripts/new
 /scripts/[id]
 /scripts/[id]/edit
```

The root route can redirect to `/scripts`.

---

# 3. Main Navigation

Do not create a large sidebar.

Use a simple header:

```text
┌──────────────────────────────────────────────────────────┐
│ Reel Scripts                              + New Script   │
└──────────────────────────────────────────────────────────┘
```

Brand/title:

```text
Reel Script Manager
```

Optional creator branding:

```text
the_kharagpur_wala_
```

The creator's Instagram profile should NOT become a separate application module.

---

# 4. Main Scripts Page

The main page is the most important screen.

Design it around finding scripts quickly.

```text
┌────────────────────────────────────────────────────────────┐
│ Reel Script Manager                         + New Script   │
│                                                            │
│ Store and find your Instagram Reel scripts.               │
│                                                            │
│ ┌──────────────────────────────────────┐ ┌──────────────┐ │
│ │ 🔍 Search scripts...                 │ │ All Categories│ │
│ └──────────────────────────────────────┘ └──────────────┘ │
│                                                            │
│ 124 Scripts                                                │
│                                                            │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Best Cafe in Kharagpur                    ☕ Cafe       │ │
│ │ Guys, today I found one of the best...    READY        │ │
│ │ Updated 2 hours ago                         Edit →     │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ New Burger Launch                         🍔 Food      │ │
│ │ If you're a burger lover...                DRAFT        │ │
│ │ Updated yesterday                           Edit →     │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

---

# 5. Search

Search is a primary feature.

Search placeholder:

```text
Search scripts by title or content...
```

The user should be able to type:

```text
cafe
burger
car
mobile
Kharagpur
restaurant
offer
ITI
```

The backend performs the actual search.

Use:

```http
GET /api/scripts/search?q={query}
```

Do NOT fetch all scripts and perform filtering only in the browser.

---

# 6. Search Behavior

Implement debounced search.

Recommended:

```text
300–500ms
```

Behavior:

1. User starts typing
2. Wait for debounce period
3. Send API request
4. Display loading state
5. Display results
6. Display empty state if nothing matches

When search is cleared, return to the normal paginated script list.

Provide a clear-search button when text exists.

---

# 7. Category Filter

Provide a category dropdown beside search.

```text
All Categories
Food
Cafe
Car
Commercial Ad
Meme / Relatable
City Updates
Retail
Education
Hospitality
Fashion
Travel
Technology
Beauty
Lifestyle
Other
```

These categories are examples/initial seed data.

The actual category list must come from the backend:

```http
GET /api/categories
```

Do not hardcode category IDs.

---

# 8. Combined Search + Category

If the user searches:

```text
cafe
```

and selects:

```text
Food
```

the frontend should send the appropriate combined query to the backend.

Example:

```http
GET /api/scripts/search?q=cafe&categoryId=2
```

The exact query format should remain centralized inside the API service.

---

# 9. Script Data Model

The frontend must use the following model:

```typescript
interface Script {
  id: number;
  title: string;
  scriptText: string;
  category: Category | null;
  status: ScriptStatus;
  createdAt: string;
  updatedAt: string;
}
```

Category:

```typescript
interface Category {
  id: number;
  name: string;
  createdAt: string;
}
```

Status:

```typescript
type ScriptStatus =
  | "DRAFT"
  | "READY"
  | "PUBLISHED"
  | "ARCHIVED";
```

These names must exactly match the backend API.

---

# 10. Script Card

Each script in the list should display:

```text
Title
Category
Status
Script preview
Last updated
```

Example:

```text
┌─────────────────────────────────────────────────┐
│ Best Cafe in Kharagpur              Cafe        │
│                                                  │
│ Guys, today I found one of the best cafes...    │
│                                                  │
│ READY                         Updated 2h ago    │
│                                                  │
│                                      Open →     │
└─────────────────────────────────────────────────┘
```

The script preview should be truncated visually.

Do not modify the actual script text.

---

# 11. Script Status

Use only:

```text
DRAFT
READY
PUBLISHED
ARCHIVED
```

Display these as badges.

Example:

```text
DRAFT
READY
PUBLISHED
ARCHIVED
```

Use clear visual differences but maintain accessibility.

---

# 12. New Script

Create a dedicated page:

```text
/scripts/new
```

UI:

```text
Create New Script

Title
[________________________________________]

Category
[ Select category ▼ ]

Status
[ Draft ▼ ]

Script
┌──────────────────────────────────────────┐
│                                          │
│ Write your Reel script here...           │
│                                          │
│                                          │
│                                          │
└──────────────────────────────────────────┘

                         [Cancel] [Save Script]
```

---

# 13. Create API

When saving:

```http
POST /api/scripts
```

Request:

```json
{
  "title": "Best Cafe in Kharagpur",
  "scriptText": "Guys, today I found...",
  "categoryId": 2,
  "status": "DRAFT"
}
```

After successful creation:

* Show success toast
* Navigate to the created script or script list
* Do not reload the entire browser page unnecessarily

---

# 14. Script Editor

The script field should be a large, comfortable multiline editor.

Requirements:

* Large textarea
* Good line height
* Comfortable padding
* Automatic vertical expansion where appropriate
* Character count
* Word count
* Copy button on the detail page

Example footer:

```text
Characters: 482
Words: 91
```

The editor should support long scripts.

Do not impose an unnecessarily small character limit.

---

# 15. Script Detail Page

Route:

```text
/scripts/[id]
```

Example:

```text
← Back to Scripts

Best Cafe in Kharagpur

☕ Cafe
READY

Created Aug 16, 2026
Updated Aug 16, 2026

────────────────────────────────────

SCRIPT

Guys, today I found one of the best
cafes in Kharagpur...

They have amazing coffee and...

────────────────────────────────────

482 characters · 91 words

[Copy Script]    [Edit]    [Delete]
```

The complete script must be displayed.

Do not truncate the script on the detail page.

---

# 16. Copy Script

Add:

```text
Copy Script
```

When clicked:

```text
Copied!
```

Use the browser Clipboard API.

This is important because the user will likely copy the script directly into another workflow.

---

# 17. Edit Script

Route:

```text
/scripts/[id]/edit
```

Allow editing:

```text
Title
Category
Status
Script
```

Use:

```http
PUT /api/scripts/{id}
```

Request:

```json
{
  "title": "Updated Cafe Reel",
  "scriptText": "Updated script...",
  "categoryId": 2,
  "status": "READY"
}
```

After successful update:

* Show success toast
* Update displayed data
* Navigate back to detail page

Do not force a complete browser refresh.

---

# 18. Delete Script

Add delete functionality.

Before deleting:

```text
Delete Script?

Are you sure you want to delete
"Best Cafe in Kharagpur"?

[Cancel] [Delete]
```

API:

```http
DELETE /api/scripts/{id}
```

The backend uses soft deletion.

After successful deletion:

* Show confirmation
* Navigate back to `/scripts`
* Remove the script from the visible list

---

# 19. Pagination

The main script list should support backend pagination.

Request:

```http
GET /api/scripts?page=0&size=20
```

Response:

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 124,
  "totalPages": 7
}
```

Display pagination only when required.

For example:

```text
← Previous    1  2  3  4  5    Next →
```

Do not load hundreds/thousands of scripts into the browser at once.

---

# 20. Empty States

No scripts:

```text
No scripts yet

Start building your Reel script library.

[ + Create Script ]
```

No search results:

```text
No scripts found

Try a different keyword or category.
```

No category selected:

```text
All Categories
```

---

# 21. Loading States

Use skeleton loaders or appropriate loading indicators.

Examples:

```text
Loading scripts...
Loading script...
Saving script...
Updating script...
Deleting script...
```

Do not leave the interface blank while an API request is running.

---

# 22. Error Handling

The backend returns:

```json
{
  "timestamp": "2026-08-16T10:00:00Z",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Title is required",
  "path": "/api/scripts"
}
```

Handle:

```text
400 Bad Request
404 Not Found
409 Conflict
500 Internal Server Error
Network Error
```

Show the backend's `message` when it is safe and user-friendly.

Never show stack traces.

---

# 23. Form Validation

Title:

* Required
* Cannot contain only whitespace
* Maximum 255 characters

Script:

* Required
* Cannot contain only whitespace

Category:

* Required unless the backend explicitly permits no category

Status:

* Must be one of the four supported values

Show validation messages next to the relevant fields.

---

# 24. API Layer

Do not place `fetch()` calls directly throughout components.

Create:

```text
src/
├── api/
│   ├── client.ts
│   ├── scripts.ts
│   └── categories.ts
│
├── types/
│   ├── script.ts
│   └── category.ts
│
├── components/
│   ├── ScriptCard.tsx
│   ├── ScriptEditor.tsx
│   ├── SearchBar.tsx
│   ├── CategoryFilter.tsx
│   └── StatusBadge.tsx
│
└── app/
    ├── scripts/
    └── ...
```

Example API methods:

```typescript
scriptApi.getScripts()
scriptApi.getScript(id)
scriptApi.searchScripts(params)
scriptApi.createScript(data)
scriptApi.updateScript(id, data)
scriptApi.deleteScript(id)

categoryApi.getCategories()
```

---

# 25. Backend Connection

Use:

```text
NEXT_PUBLIC_API_BASE_URL
```

Example:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

All API requests must derive from this value.

Never hardcode:

```text
http://localhost:8080
```

inside components.

---

# 26. Backend API Contract

The frontend is connected to a Spring Boot backend using PostgreSQL.

The expected endpoints are:

```text
GET    /api/scripts
GET    /api/scripts/{id}
GET    /api/scripts/search
POST   /api/scripts
PUT    /api/scripts/{id}
DELETE /api/scripts/{id}

GET    /api/categories
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}
```

The frontend must follow the backend contract exactly.

Do not arbitrarily rename:

```text
scriptText
categoryId
createdAt
updatedAt
status
```

or change enum values.

---

# 27. Categories Management

The current main requirement is script management.

Category management should therefore remain lightweight.

If the backend supports category CRUD, provide a simple category management interface.

Example:

```text
Categories

Food
Cafe
Car
Commercial Ad
Meme / Relatable
City Updates

[+ Add Category]
```

Allow:

* Create category
* Rename category
* Delete category where backend permits it

Do not turn this into a separate complex module.

---

# 28. Initial Categories

Use these as initial seed categories:

```text
Food
Cafe
Car
Commercial Ad
Meme / Relatable
City Updates
Retail
Education
Hospitality
Fashion
Travel
Technology
Beauty
Lifestyle
Other
```

These are based on the intended Reel content taxonomy.

They should ultimately be stored and served by PostgreSQL through the backend.

---

# 29. Creator Branding

The application can use subtle branding based on:

```text
KHARAGPUR BLOGGER 🕉️
@the_kharagpur_wala_
```

However, this is only branding.

Do NOT create:

* Profile settings
* Media Kit
* Instagram analytics
* Client management
* Campaign management
* Collaboration management
* Instagram API integration

The application is a **Reel Script Manager only**.

---

# 30. Visual Design

Design it as a focused creator productivity application.

Desired characteristics:

* Clean
* Modern
* Fast
* Minimal
* Content-first
* Easy to search
* Comfortable for long text
* Mobile responsive

Avoid:

* Corporate CRM appearance
* Excessive dashboard cards
* Large analytics charts
* Unnecessary gradients
* Excessive animations
* Complicated navigation

The script itself is the most important piece of content.

---

# 31. Desktop Layout

Recommended:

```text
┌──────────────────────────────────────────────────────────────┐
│ Reel Script Manager                         + New Script     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Search scripts...                  Category ▼                │
│                                                              │
│ 124 Scripts                                                  │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Best Cafe in Kharagpur                    Cafe            │ │
│ │ Guys, today I found one of the best...    READY           │ │
│ │ Updated 2 hours ago                         Open →        │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ New Burger Launch                         Food            │ │
│ │ If you're a burger lover...                DRAFT           │ │
│ │ Updated yesterday                           Open →        │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

# 32. Mobile Layout

Mobile should prioritize:

```text
Reel Scripts
[+]

[ Search scripts... ]

[All Categories ▼]

Script cards
```

Creating/editing a script should use the full available screen width.

The textarea should occupy most of the screen.

---

# 33. Accessibility

Implement:

* Semantic HTML
* Accessible form labels
* Keyboard navigation
* Visible focus states
* Accessible modal/dialog
* Accessible buttons
* Sufficient contrast
* Screen-reader-friendly controls

Do not use an icon as the only indication of an action without an accessible label.

---

# 34. Performance

Optimize for fast script discovery.

Implement:

* Debounced search
* Pagination
* Efficient API requests
* Cached categories
* Avoid unnecessary re-renders
* Lazy-load non-critical components where appropriate

The user should be able to search their script library quickly even when it grows to thousands of scripts.

---

# 35. Future Compatibility

Do not implement these now:

```text
AI script generation
AI rewriting
Semantic search
Vector database
Client management
Campaign management
Media kit
Analytics
Instagram API
Payments
Team collaboration
```

However, structure the code so that semantic/AI search could later be added without rebuilding the entire frontend.

The primary search architecture should therefore be centralized in:

```text
scriptApi.searchScripts()
```

rather than embedded directly inside UI components.

---

# 36. Core User Flow

The most important workflow is:

```text
Open application
       ↓
Search
       ↓
Find script
       ↓
Open script
       ↓
Copy OR Edit
       ↓
Update
```

Second workflow:

```text
Open application
       ↓
+ New Script
       ↓
Enter title
       ↓
Select category
       ↓
Write script
       ↓
Save
       ↓
Script appears in library
```

Optimize the entire UI around these two workflows.

---

# 37. Final Deliverable

Build the complete frontend with:

* Scripts list
* Search
* Debounced server-side search
* Category filter
* Pagination
* Script detail
* New script
* Edit script
* Delete script
* Copy script
* Script status
* Character count
* Word count
* Category loading
* Category CRUD if backend supports it
* Form validation
* Loading states
* Error states
* Empty states
* Responsive design
* Centralized REST API layer
* TypeScript types matching the Spring Boot backend

The finished product should feel like a **simple, fast personal library for Instagram Reel scripts**, not a general-purpose CRM or business-management platform.
