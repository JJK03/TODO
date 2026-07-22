import type { Todo } from "../../types/todo";
import TodoItem from "../TodoItem/TodoItem";
import "./TodoList.css";

type TodoListProps = {
  todos: Todo[];
  editingTodoId: number | null;
  editingTitle: string;
  onEditingTitleChange: (title: string) => void;
  onEditStart: (todo: Todo) => void;
  onEditCancel: () => void;
  onEditSubmit: (id: number) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TodoList({
  todos,
  editingTodoId,
  editingTitle,
  onEditingTitleChange,
  onEditStart,
  onEditCancel,
  onEditSubmit,
  onToggle,
  onDelete,
}: TodoListProps) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingTodoId === todo.id}
          editingTitle={editingTitle}
          onEditingTitleChange={onEditingTitleChange}
          onEditStart={onEditStart}
          onEditCancel={onEditCancel}
          onEditSubmit={onEditSubmit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
