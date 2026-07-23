import { useState } from "react";
import "./App.css";
import TodoPage from "./features/todo/TodoPage";
import ThreePlayground from "./features/playground/ThreePlayground";

type ActiveTab = "todo" | "three";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("todo");
  const [todoResetToken, setTodoResetToken] = useState(0);

  return (
    <main className="app-shell">
      <section className="app-panel">
        <div className="app-tabs" role="tablist" aria-label="앱 화면 선택">
          <button
            className={activeTab === "todo" ? "app-tab active" : "app-tab"}
            type="button"
            role="tab"
            aria-selected={activeTab === "todo"}
            onClick={() => setActiveTab("todo")}
          >
            Todo
          </button>

          <button
            className={activeTab === "three" ? "app-tab active" : "app-tab"}
            type="button"
            role="tab"
            aria-selected={activeTab === "three"}
            onClick={() => setActiveTab("three")}
          >
            Three.js
          </button>

          {activeTab === "todo" && (
            <button
              className="app-refresh-button"
              type="button"
              onClick={() => setTodoResetToken((token) => token + 1)}
              aria-label="Todo 새로고침"
              title="Todo 새로고침"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 12a9 9 0 0 1-15.4 6.4L3 16" />
                <path d="M3 21v-5h5" />
                <path d="M3 12a9 9 0 0 1 15.4-6.4L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>
          )}
        </div>

        {activeTab === "todo" && (
          <div role="tabpanel" className="todo-tab-panel">
            <TodoPage resetToken={todoResetToken} />
          </div>
        )}

        {activeTab === "three" && (
          <div role="tabpanel" className="three-tab-panel">
            <ThreePlayground />
          </div>
        )}
      </section>
    </main>
  );
}
