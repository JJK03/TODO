type TodoFormProps = {
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function TodoForm({
  title,
  onTitleChange,
  onSubmit,
}: TodoFormProps) {
  return (
    <form className="todo-form" onSubmit={onSubmit}>
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="할 일을 입력하세요"
      />
      <button type="submit">추가</button>
    </form>
  );
}
