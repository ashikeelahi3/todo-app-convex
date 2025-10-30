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

## Creating Data Tables

### 1. Define Schema
Create `convex/schema.ts`:
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
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
    text: v.string(),
    isCompleted: v.boolean(),
  }).index("by_completion", ["isCompleted"]),
});
```

## Creating Data Tables

### 1. Define Schema

Create `convex/schema.ts`: (inside convex folder/directory)

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    user_id: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    is_completed: v.boolean()
  }),
});
```

### 2. Schema Features

- Tables are automatically created when you define them if the `npx convex dev` is running on your terminal.
- No manual table creation needed
- Schema validates data types at runtime

### 3. Indexing

