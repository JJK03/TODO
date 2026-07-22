import { useState } from "react";
import "./App.css";
import TodoPage from "./features/todo/TodoPage";
import ThreePlayground from "./features/playground/ThreePlayground";

type ActiveTab = "todo" | "three";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("todo");

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
        </div>

        {activeTab === "todo" && <TodoPage />}

        {activeTab === "three" && (
          <div role="tabpanel" className="three-tab-panel">
            <ThreePlayground />
          </div>
        )}
      </section>
    </main>
  );
}