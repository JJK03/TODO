import { useCallback, useEffect, useRef, useState } from "react";
import {
  createTodo,
  deleteTodo,
  getTodos,
  searchTodos,
  toggleTodo,
  updateTodo,
} from "./api/todoAPI";

import TodoForm from "./components/TodoForm/TodoForm";
import TodoHeader from "./components/TodoHeader/TodoHeader";
import TodoList from "./components/TodoList/TodoList";
import TodoSort from "./components/TodoSort/TodoSort";

import type { Todo } from "./types/todo";
import type { SortOption } from "./types/sort";
import "./TodoPage.css";

type TodoPageProps = {
  resetToken: number;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
};

export default function TodoPage({ resetToken }: TodoPageProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const didMountRef = useRef(false);

  const showErrorMessage = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error: unknown) {
      console.error(error);
      setTodos([]);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    setIsSearchOpen(false);
    await fetchTodos();
  };

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    void handleSearchReset();
  }, [resetToken]);

  const handleSearchToggle = async () => {
    if (isSearchOpen && keyword.trim() !== "") {
      setKeyword("");
      await fetchTodos();
    }

    setIsSearchOpen((current) => !current);
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

    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    }

    return 0;
  });

  const pendingTodos = sortedTodos.filter((todo) => !todo.completed);
  const completedTodos = sortedTodos.filter((todo) => todo.completed);

  const renderTodoList = (items: Todo[]) => (
    <TodoList
      todos={items}
      editingTodoId={editingTodoId}
      editingTitle={editingTitle}
      onEditingTitleChange={setEditingTitle}
      onEditStart={handleEditStart}
      onEditCancel={handleEditCancel}
      onEditSubmit={handleEditSubmit}
      onToggle={handleToggle}
      onDelete={handleDelete}
    />
  );

  return (
    <>
      {errorMessage && (
        <div className="toast error-toast" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      <TodoHeader
        todoCount={todos.length}
        keyword={keyword}
        isSearchOpen={isSearchOpen}
        onKeywordChange={setKeyword}
        onSearchSubmit={handleSearchSubmit}
        onSearchToggle={handleSearchToggle}
      />

      <div className="input-row">
        <TodoForm
          title={title}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
        />

        <div className="todo-controls">
          <TodoSort sortOption={sortOption} onSortChange={setSortOption} />
        </div>
      </div>

      {isLoading && todos.length === 0 && (
        <p className="state-message">불러오는 중...</p>
      )}

      {!isLoading && todos.length === 0 && (
        <p className="state-message empty-message">표시할 Todo가 없습니다.</p>
      )}

      {todos.length > 0 && (
        <div className="todo-board">
          <section className="todo-column" aria-labelledby="pending-heading">
            <div className="todo-column-header">
              <h2 id="pending-heading">미완료</h2>
              <span>{pendingTodos.length}개</span>
            </div>
            {pendingTodos.length > 0 ? (
              renderTodoList(pendingTodos)
            ) : (
              <p className="column-empty-message">미완료 Todo가 없습니다.</p>
            )}
          </section>

          <section className="todo-column" aria-labelledby="completed-heading">
            <div className="todo-column-header">
              <h2 id="completed-heading">완료</h2>
              <span>{completedTodos.length}개</span>
            </div>
            {completedTodos.length > 0 ? (
              renderTodoList(completedTodos)
            ) : (
              <p className="column-empty-message">완료된 Todo가 없습니다.</p>
            )}
          </section>
        </div>
      )}
    </>
  );
}
