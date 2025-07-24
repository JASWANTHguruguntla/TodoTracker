import { todos, type Todo, type InsertTodo, type UpdateTodo } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Todo CRUD operations
  getTodos(): Promise<Todo[]>;
  getTodo(id: number): Promise<Todo | undefined>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(id: number, updates: Partial<UpdateTodo>): Promise<Todo | undefined>;
  deleteTodo(id: number): Promise<boolean>;
  clearCompletedTodos(): Promise<number>; // returns count of deleted todos
  
  // User operations (existing)
  getUser(id: number): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Todo operations
  async getTodos(): Promise<Todo[]> {
    const result = await db.select().from(todos).orderBy(todos.createdAt);
    return result.reverse(); // Latest first
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    const [todo] = await db.select().from(todos).where(eq(todos.id, id));
    return todo || undefined;
  }

  async createTodo(insertTodo: InsertTodo): Promise<Todo> {
    const [todo] = await db
      .insert(todos)
      .values({
        ...insertTodo,
        description: insertTodo.description || null,
      })
      .returning();
    return todo;
  }

  async updateTodo(id: number, updates: Partial<UpdateTodo>): Promise<Todo | undefined> {
    // First check if todo exists
    const existingTodo = await this.getTodo(id);
    if (!existingTodo) {
      return undefined;
    }

    // Handle completedAt timestamp
    const updateData: any = { ...updates };
    if (updates.completed !== undefined) {
      if (updates.completed === true && !existingTodo.completed) {
        updateData.completedAt = new Date();
      } else if (updates.completed === false) {
        updateData.completedAt = null;
      }
    }

    const [updatedTodo] = await db
      .update(todos)
      .set(updateData)
      .where(eq(todos.id, id))
      .returning();
    
    return updatedTodo || undefined;
  }

  async deleteTodo(id: number): Promise<boolean> {
    const result = await db.delete(todos).where(eq(todos.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async clearCompletedTodos(): Promise<number> {
    const result = await db.delete(todos).where(eq(todos.completed, true));
    return result.rowCount ?? 0;
  }

  // User operations (keeping existing implementation for compatibility)
  private users: Map<number, any> = new Map();
  private currentUserId: number = 1;

  async getUser(id: number): Promise<any> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new DatabaseStorage();
