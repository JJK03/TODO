type TodoSearchProps = {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
};

export default function TodoSearch({
  keyword,
  onKeywordChange,
  onSubmit,
  onReset,
}: TodoSearchProps) {
  return (
    <form className="todo-search" onSubmit={onSubmit}>
      <input
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="제목 검색"
      />
      <button type="submit">검색</button>
      <button type="button" onClick={onReset}>
        초기화
      </button>
    </form>
  );
}
