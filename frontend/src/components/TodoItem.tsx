import type { Todo } from "../types/todo";

type TodoItemProps = {
  todo: Todo;
  isEditing: boolean;
  editingTitle: string;
  onEditingTitleChange: (title: string) => void;
  onEditStart: (todo: Todo) => void;
  onEditCancel: () => void;
  onEditSubmit: (id: number) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TodoItem({
  todo,
  isEditing,
  editingTitle,
  onEditingTitleChange,
  onEditStart,
  onEditCancel,
  onEditSubmit,
  onToggle,
  onDelete,
}: TodoItemProps) {
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

      {isEditing ? (
        <>
          <input
            value={editingTitle}
            onChange={(e) => onEditingTitleChange(e.target.value)}
          />
          <button onClick={() => onEditSubmit(todo.id)}>저장</button>
          <button onClick={onEditCancel}>취소</button>
        </>
      ) : (
        <>
          <span>{todo.title}</span>
          <button onClick={() => onEditStart(todo)}>수정</button>
        </>
      )}

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
