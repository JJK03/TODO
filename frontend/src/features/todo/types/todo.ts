export type TodoPriority = "LOW" | "MEDIUM" | "HIGH";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  dueDate: string | null;
  dueTimeSet: boolean;
  priority: TodoPriority;
};
