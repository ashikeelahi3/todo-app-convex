import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

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

export const getAllTodos = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("user_id"), args.user_id))
      .collect();
  },
});