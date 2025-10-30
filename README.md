# Todo App with Convex

## How to Start

### 1. Initialize Node.js Project

Open a folder and in that folder open cmd or other terminal. You can use vs code or other code editor's terminal too. In that terminal, write the following command.

```bash
npm init -y
```

### 2. Install Convex

```bash
pnpm i convex
```

### 3. Start Convex Development

```bash
npx convex dev
```

### 4. Follow Setup Instructions

The `convex dev` command will:

- Set up your Convex backend
- Create a cloud deployment
- Automatically generate a `.env.local` file

### 5. Security Note

⚠️ **Important**: Never share or commit the `.env.local` file to version control.

## Convex Data Types

### Available Types
```typescript
import { v } from "convex/values";

// Basic types
v.string()     // Text
v.number()     // Numbers (int/float)
v.boolean()    // true/false
v.null()       // null value
v.bytes()      // Binary data
v.id("table")  // Reference to table ID

// Optional types
v.optional(v.string())  // Can be undefined

// Arrays
v.array(v.string())     // Array of strings

// Objects
v.object({
  name: v.string(),
  age: v.number()
})

// Union types
v.union(v.string(), v.number())  // Either string or number
```

## Creating Data Tables

### 1. Define Schema
Create `convex/schema.ts`:
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    user_id: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    is_completed: v.boolean()
  })
});
```

### 2. Schema Features

- Tables are automatically created when you define them
- No manual table creation needed
- Schema validates data types at runtime

### 3. Indexing

Add indexes for better query performance:

```typescript
export default defineSchema({
  todos: defineTable({
    user_id: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    is_completed: v.boolean()
  })
  .index("by_user", ["user_id"])
  .index("by_title", ["title"])
  .index("by_is_completed", ["is_completed"])
});
```

## Todo Functions

Create `convex/todoFunc.ts` for database operations:

### Mutations (Write Operations)

```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create new todo
export const saveTodo = mutation({
  args: {
    user_id: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    is_completed: v.boolean()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("todos", args);
  },
});

// Update existing todo
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    is_completed: v.boolean()
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Delete todo
export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
```

### Queries (Read Operations)
```typescript
// Get filtered todos
export const getTodos = query({
  args: { 
    user_id: v.string(),
    is_completed: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("todos").filter((q) => q.eq(q.field("user_id"), args.user_id));
    
    if (args.is_completed !== undefined) {
      query = query.filter((q) => q.eq(q.field("is_completed"), args.is_completed));
    }
    
    return await query.collect();
  },
});

// Get all user todos
export const getAllTodos = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("user_id"), args.user_id))
      .collect();
  },
});
```

### Function Types
- **Mutations**: Create, update, delete data
- **Queries**: Read data (automatically cached)
- **Args**: Type-safe parameters using Convex validators

## Function Explanations

### saveTodo
- **Purpose**: Creates a new todo item in the database
- **Parameters**: user_id, title, optional description, completion status
- **Returns**: ID of the newly created todo
- **Usage**: Call when user adds a new task

### updateTodo
- **Purpose**: Modifies an existing todo by its ID
- **Parameters**: todo ID and optional fields to update
- **Logic**: Uses destructuring to separate ID from update fields
- **Usage**: Call when user edits title, description, or marks complete

### deleteTodo
- **Purpose**: Removes a todo from the database
- **Parameters**: Only requires the todo ID
- **Effect**: Permanently deletes the record
- **Usage**: Call when user removes a task

### getTodos
- **Purpose**: Retrieves todos for a user with optional filtering
- **Parameters**: user_id (required), is_completed (optional)
- **Logic**: Always filters by user_id, optionally by completion status
- **Returns**: Array of matching todos
- **Usage**: Get completed/incomplete todos or all with filtering

### getAllTodos
- **Purpose**: Gets all todos for a specific user
- **Parameters**: Only user_id
- **Returns**: Complete list of user's todos
- **Usage**: Display all tasks without filtering