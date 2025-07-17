import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  priority: text("priority").notNull().default("medium"), // "low", "medium", "high"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertTodoSchema = createInsertSchema(todos).pick({
  title: true,
  description: true,
  priority: true,
}).extend({
  title: z.string().min(1, "Task title is required").max(200, "Task title must be less than 200 characters"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const updateTodoSchema = createInsertSchema(todos).pick({
  title: true,
  description: true,
  priority: true,
  completed: true,
}).extend({
  title: z.string().min(1, "Task title is required").max(200, "Task title must be less than 200 characters"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  completed: z.boolean(),
});

export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;
export type Todo = typeof todos.$inferSelect;
