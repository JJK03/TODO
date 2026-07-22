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

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [completedFilter, setCompletedFilter] = useState("all");
  const [keyword, setKeyword] = useState("");

  const fetchTodos = useCallback(async () => {
    const data = await getTodos(completedFilter);
    setTodos(data);
  }, [completedFilter]);

  useEffect(() => {
    let ignore = false;

    getTodos(completedFilter)
      .then((data) => {
        if (!ignore) {
          setTodos(data);
        }
      })
      .catch((error: unknown) => {
        console.error(error);

        if (!ignore) {
          setTodos([]);
        }
      });

    return () => {
      ignore = true;
    };
  }, [completedFilter]);

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

    try {
      const data = await searchTodos(keyword.trim());
      setTodos(data);
    } catch (error: unknown) {
      console.error(error);
      setTodos([]);
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

        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </section>
    </main>
  );
}

export default App;
