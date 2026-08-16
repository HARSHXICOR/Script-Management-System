export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Reel Script Manager API",
    version: "1.0.0",
    description:
      "Production-ready REST API for Reel Script Manager. Built with JWT authentication, multi-user script ownership, and shared system categories.",
    contact: {
      name: "Reel Script Manager",
      url: "https://github.com/HARSHXICOR/Script-Management-System",
    },
  },
  servers: [
    {
      url: "/api",
      description: "Default API Base",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token. Example: Bearer eyJhbGciOi...",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Harsh" },
          email: { type: "string", example: "creator@example.com" },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Food" },
          createdAt: { type: "string", format: "date-time", example: "2026-08-16T10:00:00Z" },
        },
      },
      Script: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Best Cafe in Kharagpur" },
          scriptText: {
            type: "string",
            example: "Guys, today I found one of the best cafes in Kharagpur...",
          },
          status: {
            type: "string",
            enum: ["DRAFT", "READY", "PUBLISHED", "ARCHIVED"],
            example: "READY",
          },
          category: {
            $ref: "#/components/schemas/Category",
          },
          createdAt: { type: "string", format: "date-time", example: "2026-08-16T10:00:00Z" },
          updatedAt: { type: "string", format: "date-time", example: "2026-08-16T12:00:00Z" },
        },
      },
      PaginatedScripts: {
        type: "object",
        properties: {
          content: {
            type: "array",
            items: { $ref: "#/components/schemas/Script" },
          },
          page: { type: "integer", example: 0 },
          size: { type: "integer", example: 20 },
          totalElements: { type: "integer", example: 1 },
          totalPages: { type: "integer", example: 1 },
        },
      },
      SignupRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Harsh" },
          email: { type: "string", format: "email", example: "creator@example.com" },
          password: { type: "string", format: "password", example: "password123" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "creator@example.com" },
          password: { type: "string", format: "password", example: "password123" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      CreateScriptRequest: {
        type: "object",
        required: ["title", "scriptText"],
        properties: {
          title: { type: "string", example: "Top 3 Sunset Spots in Kharagpur" },
          scriptText: { type: "string", example: "Looking for peaceful spots to catch the sunset this weekend?..." },
          categoryId: { type: "integer", example: 11 },
          status: {
            type: "string",
            enum: ["DRAFT", "READY", "PUBLISHED", "ARCHIVED"],
            example: "DRAFT",
          },
        },
      },
      CreateCategoryRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Podcasts & Interviews" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          timestamp: { type: "string", example: "2026-08-16T12:00:00Z" },
          status: { type: "integer", example: 400 },
          error: { type: "string", example: "VALIDATION_ERROR" },
          message: { type: "string", example: "Title is required" },
          path: { type: "string", example: "/api/scripts" },
        },
      },
    },
  },
  paths: {
    "/auth/signup": {
      post: {
        tags: ["Authentication"],
        summary: "Sign up a new creator account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignupRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Account created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          409: { description: "Email already exists", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Sign in and obtain JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Restore current user session from JWT token",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Current user profile",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/scripts": {
      get: {
        tags: ["Scripts"],
        summary: "Get paginated list of scripts for authenticated user",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 0 } },
          { name: "size", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: {
            description: "List of scripts",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedScripts" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Scripts"],
        summary: "Create a new Reel script",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateScriptRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Script created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Script" },
              },
            },
          },
          400: { description: "Validation error" },
        },
      },
    },
    "/scripts/search": {
      get: {
        tags: ["Scripts"],
        summary: "Search scripts by keyword and/or category",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "q", in: "query", description: "Search query (title or text content)", schema: { type: "string" } },
          { name: "categoryId", in: "query", description: "Filter by category ID", schema: { type: "integer" } },
          { name: "page", in: "query", schema: { type: "integer", default: 0 } },
          { name: "size", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: {
            description: "Matching scripts",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedScripts" },
              },
            },
          },
        },
      },
    },
    "/scripts/{id}": {
      get: {
        tags: ["Scripts"],
        summary: "Get full script details by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: {
            description: "Script details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Script" },
              },
            },
          },
          404: { description: "Script not found" },
          403: { description: "Forbidden (not owned by user)" },
        },
      },
      put: {
        tags: ["Scripts"],
        summary: "Update an existing script",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateScriptRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Script updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Script" },
              },
            },
          },
          404: { description: "Script not found" },
        },
      },
      delete: {
        tags: ["Scripts"],
        summary: "Soft delete a script",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          204: { description: "Script deleted" },
          404: { description: "Script not found" },
        },
      },
    },
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "Get all shared system categories",
        responses: {
          200: {
            description: "List of categories",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Category" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Create a new category",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCategoryRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Category created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Category" },
              },
            },
          },
        },
      },
    },
    "/categories/{id}": {
      put: {
        tags: ["Categories"],
        summary: "Rename a category",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCategoryRequest" },
            },
          },
        },
        responses: {
          200: { description: "Category updated" },
          404: { description: "Category not found" },
        },
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete a category",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          204: { description: "Category deleted" },
          404: { description: "Category not found" },
        },
      },
    },
  },
};
