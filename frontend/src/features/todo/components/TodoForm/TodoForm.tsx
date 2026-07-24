import { useState } from "react";
import "./TodoForm.css";

type TodoFormProps = {
  title: string;
  dueDate: string;
  dueTimeSet: boolean;
  onTitleChange: (title: string) => void;
  onDueDateChange: (dueDate: string) => void;
  onDueTimeSetChange: (dueTimeSet: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <path d="M3 10h18" />
    <path d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
  </svg>
);

const splitDueDate = (dueDate: string) => {
  const [date = "", time = ""] = dueDate.split("T"); // dueDate 형식: "2026-07-24T14:30:00"
  return { date, time };
};

const joinDueDate = (date: string, time: string) => {
  if (!date) {
    return "";
  }

  return `${date}T${time || "00:00"}`;
};

export default function TodoForm({
  title,
  dueDate,
  dueTimeSet,
  onTitleChange,
  onDueDateChange,
  onDueTimeSetChange,
  onSubmit,
}: TodoFormProps) {
  const [isDueDateOpen, setIsDueDateOpen] = useState(false);
  const { date, time } = splitDueDate(dueDate);

  const handleDateChange = (nextDate: string) => {
    onDueDateChange(joinDueDate(nextDate, time));

    if (!nextDate) {
      onDueTimeSetChange(false);
    }
  };

  const handleTimeChange = (nextTime: string) => {
    onDueDateChange(joinDueDate(date, nextTime));
    onDueTimeSetChange(nextTime !== "");
  };

  const handleClear = () => {
    onDueDateChange("");
    onDueTimeSetChange(false);
  };

  return (
    <form className="todo-form" onSubmit={onSubmit}>
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="할 일을 입력하세요"
      />

      <div className="due-date-picker">
        <button
          className={dueDate ? "due-date-toggle active" : "due-date-toggle"}
          type="button"
          onClick={() => setIsDueDateOpen((current) => !current)}
          aria-label={dueDate ? "마감일 변경" : "마감일 선택"}
          aria-expanded={isDueDateOpen}
          title={dueDate ? "마감일 변경" : "마감일 선택"}
        >
          <CalendarIcon />
        </button>

        {isDueDateOpen && (
          <div className="due-date-popover">
            <label>
              <span className="due-date-label-row">
                마감일
                {dueDate && (
                  <button
                    className="due-date-clear"
                    type="button"
                    onClick={handleClear}
                  >
                    지우기
                  </button>
                )}
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </label>

            <label>
              마감시간
              <input
                type="time"
                value={dueTimeSet ? time : ""}
                onChange={(e) => handleTimeChange(e.target.value)}
                disabled={!date}
              />
            </label>
          </div>
        )}
      </div>

      <button type="submit">추가</button>
    </form>
  );
}
