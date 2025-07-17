import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTodoSchema, updateTodoSchema, type Todo, type InsertTodo, type UpdateTodo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Check, CheckCircle, Plus, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "active" | "completed";

export default function Home() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const { toast } = useToast();

  // Query todos
  const { data: todos = [], isLoading } = useQuery<Todo[]>({
    queryKey: ["/api/todos"],
  });

  // Create todo mutation
  const createForm = useForm<InsertTodo>({
    resolver: zodResolver(insertTodoSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTodo) => {
      const res = await apiRequest("POST", "/api/todos", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      createForm.reset();
      toast({ title: "Task created successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create task", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Update todo mutation
  const editForm = useForm<UpdateTodo>({
    resolver: zodResolver(updateTodoSchema),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<UpdateTodo> }) => {
      const res = await apiRequest("PATCH", `/api/todos/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setEditingTodo(null);
      toast({ title: "Task updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update task", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Delete todo mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setDeletingTodo(null);
      toast({ title: "Task deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete task", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Clear completed mutation
  const clearCompletedMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", "/api/todos/completed/clear");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      toast({ title: `${data.deletedCount} completed tasks cleared` });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to clear completed tasks", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Toggle completion
  const toggleCompletion = (todo: Todo) => {
    updateMutation.mutate({
      id: todo.id,
      data: { completed: !todo.completed },
    });
  };

  // Filter todos
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter(todo => !todo.completed);
      case "completed":
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  // Counts
  const totalCount = todos.length;
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  // Handle form submissions
  const onCreateSubmit = (data: InsertTodo) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: UpdateTodo) => {
    if (editingTodo) {
      updateMutation.mutate({ id: editingTodo.id, data });
    }
  };

  // Open edit modal
  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    editForm.reset({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority,
      completed: todo.completed,
    });
  };

  // Format date
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  // Priority styles
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-blue-100 text-blue-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "low":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityLabel = (priority: string) => {
    return `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-primary" />
              Todo List
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {completedCount} completed
              </span>
              {completedCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearCompletedMutation.mutate()}
                  disabled={clearCompletedMutation.isPending}
                  className="text-sm text-red-600 hover:bg-red-50"
                >
                  Clear completed
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Task Input */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="flex gap-3">
                <div className="flex-1">
                  <FormField
                    control={createForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Add a new task..."
                            className="px-4 py-3 border-gray-200 focus:border-primary focus:ring-primary/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Task Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className={cn(
                    "font-medium",
                    filter === "all" && "bg-primary text-white"
                  )}
                >
                  All <span className="ml-1 text-primary-foreground/70">{totalCount}</span>
                </Button>
                <Button
                  variant={filter === "active" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("active")}
                  className={cn(
                    "font-medium",
                    filter === "active" && "bg-primary text-white"
                  )}
                >
                  Active <span className="ml-1 text-muted-foreground">{activeCount}</span>
                </Button>
                <Button
                  variant={filter === "completed" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("completed")}
                  className={cn(
                    "font-medium",
                    filter === "completed" && "bg-primary text-white"
                  )}
                >
                  Completed <span className="ml-1 text-muted-foreground">{completedCount}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CheckCircle className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
            </h3>
            <p className="text-gray-600">
              {filter === "all" ? "Add your first task to get started!" : `No ${filter} tasks found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={cn(
                  "bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow",
                  todo.completed && "opacity-75"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleCompletion(todo)}
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={cn(
                          "text-gray-900 font-medium",
                          todo.completed && "line-through text-gray-500"
                        )}>
                          {todo.title}
                        </p>
                        {todo.description && (
                          <p className={cn(
                            "text-sm text-gray-600 mt-1",
                            todo.completed && "line-through"
                          )}>
                            {todo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {todo.completed && todo.completedAt ? (
                              <>Completed {formatDate(todo.completedAt)}</>
                            ) : (
                              <>Created {formatDate(todo.createdAt)}</>
                            )}
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            getPriorityStyles(todo.priority)
                          )}>
                            {getPriorityLabel(todo.priority)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(todo)}
                          className="text-gray-400 hover:text-primary p-1 h-auto"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingTodo(todo)}
                          className="text-gray-400 hover:text-red-600 p-1 h-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Task Modal */}
      <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTodo && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Title
                      </label>
                      <FormControl>
                        <Input
                          className="border-gray-300 focus:border-primary focus:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (optional)
                      </label>
                      <FormControl>
                        <Textarea
                          className="border-gray-300 focus:border-primary focus:ring-primary/20"
                          rows={3}
                          placeholder="Add task description..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setEditingTodo(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={updateMutation.isPending}
                  >
                    Update Task
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!deletingTodo} onOpenChange={() => setDeletingTodo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              Delete Task
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingTodo && deleteMutation.mutate(deletingTodo.id)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
