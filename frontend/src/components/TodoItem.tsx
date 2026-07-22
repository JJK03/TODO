import type { Todo } from "../types/todo";

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className={todo.completed ? "todo-item completed" : "todo-item"}>
      <button
        className="status-button"
        type="button"
        onClick={() => onToggle(todo.id)}
        aria-label={`${todo.title} 완료 여부 변경`}
      >
        <span className="status-dot" />
      </button>

      <span className="todo-title">{todo.title}</span>

      <span className="todo-status">{todo.completed ? "완료" : "미완료"}</span>

      <button
        className="delete-button"
        type="button"
        onClick={() => onDelete(todo.id)}
      >
        삭제
      </button>
    </li>
  );
}
