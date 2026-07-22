import { useCallback, useEffect, useState } from "react";
import {
  createTodo,
  deleteTodo,
  getTodos,
  searchTodos,
  toggleTodo,
  updateTodo,
} from "./api/todoAPI";

import TodoFilter from "./components/TodoFilter/TodoFilter";
import TodoForm from "./components/TodoForm/TodoForm";
import TodoHeader from "./components/TodoHeader/TodoHeader";
import TodoList from "./components/TodoList/TodoList";
import TodoSearch from "./components/TodoSearch/TodoSearch";
import TodoSort from "./components/TodoSort/TodoSort";

import type { Todo } from "./types/todo";
import type { SortOption } from "./types/sort";
import "./TodoPage.css";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [completedFilter, setCompletedFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("latest");

  const showErrorMessage = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

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
    const loadTodos = async () => {
      await fetchTodos();
    };

    void loadTodos();
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
      showErrorMessage(getErrorMessage(error));
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
      showErrorMessage(getErrorMessage(error));
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
      showErrorMessage(getErrorMessage(error));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      await fetchTodos();
    } catch (error: unknown) {
      console.error(error);
      showErrorMessage(getErrorMessage(error));
    }
  };

  const handleEditStart = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleEditCancel = () => {
    setEditingTodoId(null);
    setEditingTitle("");
  };

  const handleEditSubmit = async (id: number) => {
    if (editingTitle.trim() === "") return;

    try {
      await updateTodo(id, editingTitle.trim());
      setEditingTodoId(null);
      setEditingTitle("");
      await fetchTodos();
    } catch (error: unknown) {
      console.error(error);
      showErrorMessage(getErrorMessage(error));
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (sortOption === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    if (sortOption === "updatedLatest") {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

      return bTime - aTime;
    }

    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    }

    if (sortOption === "completed") {
      return Number(a.completed) - Number(b.completed);
    }

    return 0;
  });

  return (
    <>
      {errorMessage && (
        <div className="toast error-toast" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      <TodoHeader todoCount={todos.length} onReset={handleSearchReset} />

      <div className="input-row">
        <TodoSearch
          keyword={keyword}
          onKeywordChange={setKeyword}
          onSubmit={handleSearchSubmit}
        />

        <TodoForm
          title={title}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="toolbar-row">
        <TodoFilter
          completedFilter={completedFilter}
          onFilterChange={setCompletedFilter}
        />

        <TodoSort sortOption={sortOption} onSortChange={setSortOption} />
      </div>

      {isLoading && todos.length === 0 && (
        <p className="state-message">불러오는 중...</p>
      )}

      {!isLoading && todos.length === 0 && (
        <p className="state-message empty-message">표시할 Todo가 없습니다.</p>
      )}

      {todos.length > 0 && (
        <TodoList
          todos={sortedTodos}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          onEditingTitleChange={setEditingTitle}
          onEditStart={handleEditStart}
          onEditCancel={handleEditCancel}
          onEditSubmit={handleEditSubmit}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
