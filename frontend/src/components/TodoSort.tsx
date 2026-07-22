import type { SortOption } from "../types/sort";

type TodoSortProps = {
  sortOption: SortOption;
  onSortChange: (sortOption: SortOption) => void;
};

export default function TodoSort({ sortOption, onSortChange }: TodoSortProps) {
  return (
    <div className="toolbar">
      <label htmlFor="todo-sort">정렬</label>
      <select
        id="todo-sort"
        value={sortOption}
        // e.target.value 의 기본 타입은 string 이므로 as SortOption 사용함
        onChange={(e) => onSortChange(e.target.value as SortOption)}
      >
        <option value="latest">최신순</option>
        <option value="oldest">오래된순</option>
        <option value="updatedLatest">최근 수정순</option>
        <option value="title">제목순</option>
        <option value="completed">미완료 먼저</option>
      </select>
    </div>
  );
}
