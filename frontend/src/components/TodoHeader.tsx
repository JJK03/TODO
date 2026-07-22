type TodoHeaderProps = {
  todoCount: number;
};

export default function TodoHeader({ todoCount }: TodoHeaderProps) {
  return (
    <header className="todo-header">
      <div>
        <h1 id="todo-heading">Todo</h1>
      </div>
      <span className="todo-count">{todoCount}개</span>
    </header>
  );
}

