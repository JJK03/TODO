import { useCallback, useEffect, useState } from "react";
import "./App.css";
import {
  createTodo,
  deleteTodo,
  getTodos,
  searchTodos,
  toggleTodo,
} from "./api/todoAPI";
import TodoFilter from "./components/TodoFilter";
import TodoForm from "./components/TodoForm";
import TodoHeader from "./components/TodoHeader";
import TodoList from "./components/TodoList";
import TodoSearch from "./components/TodoSearch";
import type { Todo } from "./types/todo";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [completedFilter, setCompletedFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getTodos(completedFilter);
      setTodos(data);
    } catch (error: unknown) {
      console.error(error);
      setTodos([]);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [completedFilter]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim() === "") return;

    try {
      await createTodo(title.trim());
      setTitle("");
      await fetchTodos();
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (keyword.trim() === "") {
      await fetchTodos();
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await searchTodos(keyword.trim());
      setTodos(data);
    } catch (error: unknown) {
      console.error(error);
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchReset = async () => {
    setKeyword("");
    await fetchTodos();
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleTodo(id);
      await fetchTodos();
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      await fetchTodos();
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <main className="app-shell">
      <section className="todo-panel" aria-labelledby="todo-heading">
        <TodoHeader todoCount={todos.length} />

        <TodoSearch
          keyword={keyword}
          onKeywordChange={setKeyword}
          onSubmit={handleSearchSubmit}
          onReset={handleSearchReset}
        />

        <TodoForm
          title={title}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
        />

        <TodoFilter
          completedFilter={completedFilter}
          onFilterChange={setCompletedFilter}
        />

        {isLoading && <p className="state-message">불러오는 중...</p>}

        {!isLoading && errorMessage && (
          <p className="state-message error-message">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && todos.length === 0 && (
          <p className="state-message empty-message">표시할 Todo가 없습니다.</p>
        )}

        {!isLoading && !errorMessage && todos.length > 0 && (
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </section>
    </main>
  );
}

export default App;
