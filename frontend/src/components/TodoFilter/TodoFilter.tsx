import "../TodoToolbar/TodoToolbar.css";

type TodoFilterProps = {
  completedFilter: string;
  onFilterChange: (filter: string) => void;
};

export default function TodoFilter({
  completedFilter,
  onFilterChange,
}: TodoFilterProps) {
  return (
    <div className="toolbar">
      <label htmlFor="completed-filter">상태</label>
      <select
        id="completed-filter"
        value={completedFilter}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value="all">전체</option>
        <option value="true">완료</option>
        <option value="false">미완료</option>
      </select>
    </div>
  );
}
