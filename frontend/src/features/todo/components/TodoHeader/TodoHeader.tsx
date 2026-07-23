import TodoSearch from "../TodoSearch/TodoSearch";
import "./TodoHeader.css";

type TodoHeaderProps = {
  todoCount: number;
  keyword: string;
  isSearchOpen: boolean;
  onKeywordChange: (keyword: string) => void;
  onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSearchToggle: () => void;
};

export default function TodoHeader({
  todoCount,
  keyword,
  isSearchOpen,
  onKeywordChange,
  onSearchSubmit,
  onSearchToggle,
}: TodoHeaderProps) {
  return (
    <header className="todo-header">
      <div className="todo-header-title">
        <h1 id="todo-heading">Todo</h1>
      </div>

      <div className="todo-header-actions">
        <span className="todo-count">{todoCount}개</span>
        <div className="search-popover-wrap">
          <button
            className={isSearchOpen ? "search-toggle active" : "search-toggle"}
            type="button"
            onClick={onSearchToggle}
            aria-label={isSearchOpen ? "검색 닫기" : "검색 열기"}
            aria-expanded={isSearchOpen}
            title={isSearchOpen ? "검색 닫기" : "검색 열기"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </button>

          {isSearchOpen && (
            <div className="search-popover">
              <TodoSearch
                keyword={keyword}
                onKeywordChange={onKeywordChange}
                onSubmit={onSearchSubmit}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
