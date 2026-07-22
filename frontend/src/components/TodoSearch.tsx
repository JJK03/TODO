type TodoSearchProps = {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function TodoSearch({
  keyword,
  onKeywordChange,
  onSubmit,
}: TodoSearchProps) {
  return (
    <form className="todo-search" onSubmit={onSubmit}>
      <input
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="제목 검색"
      />
      <button type="submit">검색</button>
    </form>
  );
}
