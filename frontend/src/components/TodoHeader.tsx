type TodoHeaderProps = {
  todoCount: number;
  onReset: () => void;
};

export default function TodoHeader({ todoCount, onReset }: TodoHeaderProps) {
  return (
    <header className="todo-header">
      <div className="todo-header-title">
        <h1 id="todo-heading">Todo</h1>
        <button className="reset-button" type="button" onClick={onReset}>
          초기화
        </button>
      </div>
      <span className="todo-count">{todoCount}개</span>
    </header>
  );
}
