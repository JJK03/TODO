export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  dueDate: string | null;
  dueTimeSet: boolean;
};
