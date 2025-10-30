import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
})
