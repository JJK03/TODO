import type { Todo } from "../../types/todo";
import "./TodoItem.css";

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

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const CircleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="m16.5 3.5 4 4L8 20H4v-4L16.5 3.5Z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M6 6l1 15h10l1-15" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const SaveIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M7 3v6h9" />
    <path d="M7 21v-7h10v7" />
  </svg>
);

const UndoIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
  </svg>
);

const formatDueDate = (dueDate: string, dueTimeSet: boolean) => {
  const date = new Date(dueDate);

  if (!dueTimeSet) {
    return date.toLocaleDateString();
  }

  return date.toLocaleString();
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
      {isEditing ? (
        <div className="todo-edit">
          <input
            className="todo-edit-input"
            value={editingTitle}
            onChange={(e) => onEditingTitleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onEditSubmit(todo.id);
              }

              if (e.key === "Escape") {
                onEditCancel();
              }
            }}
          />
        </div>
      ) : (
        <div className="todo-text">
          <span className="todo-title">{todo.title}</span>
          <div className="todo-dates">
            {todo.dueDate && (
              <span className="todo-date">
                마감: {formatDueDate(todo.dueDate, todo.dueTimeSet)}
              </span>
            )}
          </div>
        </div>
      )}

      <button
        className="status-button icon-button"
        type="button"
        onClick={() => onToggle(todo.id)}
        aria-label={`${todo.title} ${todo.completed ? "미완료로 변경" : "완료로 변경"}`}
        title={todo.completed ? "완료" : "미완료"}
      >
        {todo.completed ? <CheckCircleIcon /> : <CircleIcon />}
        <span className="visually-hidden">
          {todo.completed ? "완료" : "미완료"}
        </span>
      </button>

      {isEditing ? (
        <button
          className="save-button icon-button"
          type="button"
          onClick={() => onEditSubmit(todo.id)}
          aria-label={`${todo.title} 저장`}
          title="저장"
        >
          <SaveIcon />
        </button>
      ) : (
        <button
          className="edit-button icon-button"
          type="button"
          onClick={() => onEditStart(todo)}
          aria-label={`${todo.title} 수정`}
          title="수정"
        >
          <EditIcon />
        </button>
      )}

      {isEditing ? (
        <button
          className="cancel-button icon-button"
          type="button"
          onClick={onEditCancel}
          aria-label={`${todo.title} 수정 취소`}
          title="취소"
        >
          <UndoIcon />
        </button>
      ) : (
        <button
          className="delete-button icon-button"
          type="button"
          onClick={() => onDelete(todo.id)}
          aria-label={`${todo.title} 삭제`}
          title="삭제"
        >
          <TrashIcon />
        </button>
      )}
    </li>
  );
}
