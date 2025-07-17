import { todos, type Todo, type InsertTodo, type UpdateTodo } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private todos: Map<number, Todo>;
  private users: Map<number, any>;
  private currentTodoId: number;
  private currentUserId: number;

  constructor() {
    this.todos = new Map();
    this.users = new Map();
    this.currentTodoId = 1;
    this.currentUserId = 1;
  }

  // Todo operations
  async getTodos(): Promise<Todo[]> {
    return Array.from(this.todos.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    return this.todos.get(id);
  }

  async createTodo(insertTodo: InsertTodo): Promise<Todo> {
    const id = this.currentTodoId++;
    const now = new Date();
    const todo: Todo = {
      ...insertTodo,
      id,
      completed: false,
      createdAt: now,
      completedAt: null,
    };
    this.todos.set(id, todo);
    return todo;
  }

  async updateTodo(id: number, updates: Partial<UpdateTodo>): Promise<Todo | undefined> {
    const existingTodo = this.todos.get(id);
    if (!existingTodo) {
      return undefined;
    }

    const updatedTodo: Todo = {
      ...existingTodo,
      ...updates,
      completedAt: updates.completed === true && !existingTodo.completed 
        ? new Date() 
        : updates.completed === false 
        ? null 
        : existingTodo.completedAt,
    };

    this.todos.set(id, updatedTodo);
    return updatedTodo;
  }

  async deleteTodo(id: number): Promise<boolean> {
    return this.todos.delete(id);
  }

  async clearCompletedTodos(): Promise<number> {
    const completedTodos = Array.from(this.todos.values()).filter(todo => todo.completed);
    completedTodos.forEach(todo => this.todos.delete(todo.id));
    return completedTodos.length;
  }

  // User operations (existing)
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

export const storage = new MemStorage();
