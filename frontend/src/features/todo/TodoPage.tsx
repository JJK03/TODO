import { useCallback, useEffect, useRef, useState } from "react";
import {
  createTodo,
  deleteTodo,
  getTodos,
  searchTodos,
  toggleTodo,
  updateTodo,
  updateTodoPriority,
  type TodoPageResponse,
} from "./api/todoAPI";

import TodoForm from "./components/TodoForm/TodoForm";
import TodoHeader from "./components/TodoHeader/TodoHeader";
import TodoList from "./components/TodoList/TodoList";
import TodoSort from "./components/TodoSort/TodoSort";

import type { TodoPriority, Todo } from "./types/todo";
import type { SortOption } from "./types/sort";
import "./TodoPage.css";

type TodoPageProps = {
  resetToken: number;
};

type LoadTodoPagesOptions = {
  pendingPageNumber?: number;
  completedPageNumber?: number;
  searchKeyword?: string;
};

const PAGE_SIZE = 6;

const createEmptyPage = (): TodoPageResponse => ({
  content: [],
  number: 0,
  size: PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
});

const priorityOrder: Record<TodoPriority, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
};

export default function TodoPage({ resetToken }: TodoPageProps) {
  const [pendingPage, setPendingPage] =
    useState<TodoPageResponse>(createEmptyPage);
  const [completedPage, setCompletedPage] =
    useState<TodoPageResponse>(createEmptyPage);
  const [pendingPageNumber, setPendingPageNumber] = useState(0);
  const [completedPageNumber, setCompletedPageNumber] = useState(0);
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [activeKeyword, setActiveKeyword] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [dueDate, setDueDate] = useState("");
  const [dueTimeSet, setDueTimeSet] = useState(false);
  const [todoFormResetSignal, setTodoFormResetSignal] = useState(0);

  const didMountRef = useRef(false);

  const showErrorMessage = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  const loadTodoPages = useCallback(
    async ({
      pendingPageNumber: nextPendingPageNumber = pendingPageNumber,
      completedPageNumber: nextCompletedPageNumber = completedPageNumber,
      searchKeyword = activeKeyword,
    }: LoadTodoPagesOptions = {}) => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const isSearching = searchKeyword !== "";
        const sortDirection = sortOption === "oldest" ? "asc" : "desc";
        const [nextPendingPage, nextCompletedPage] = await Promise.all([
          isSearching
            ? searchTodos(
                searchKeyword,
                false,
                nextPendingPageNumber,
                PAGE_SIZE,
                sortDirection,
              )
            : getTodos({
                completed: false,
                page: nextPendingPageNumber,
                size: PAGE_SIZE,
                sort: sortDirection,
              }),
          isSearching
            ? searchTodos(
                searchKeyword,
                true,
                nextCompletedPageNumber,
                PAGE_SIZE,
                sortDirection,
              )
            : getTodos({
                completed: true,
                page: nextCompletedPageNumber,
                size: PAGE_SIZE,
                sort: sortDirection,
              }),
        ]);

        setPendingPage(nextPendingPage);
        setCompletedPage(nextCompletedPage);
      } catch (error: unknown) {
        console.error(error);
        setPendingPage(createEmptyPage());
        setCompletedPage(createEmptyPage());
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [activeKeyword, completedPageNumber, pendingPageNumber, sortOption],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTodoPages();
  }, [loadTodoPages]);

  const handleSearchReset = async () => {
    setKeyword("");
    setActiveKeyword("");
    setIsSearchOpen(false);
    setPendingPageNumber(0);
    setCompletedPageNumber(0);
    await loadTodoPages({
      pendingPageNumber: 0,
      completedPageNumber: 0,
      searchKeyword: "",
    });
  };

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    void handleSearchReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetToken]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim() === "") return;

    try {
      await createTodo(
        title.trim(),
        dueDate === "" ? null : dueDate,
        dueTimeSet,
      );
      setTitle("");
      setDueDate("");
      setDueTimeSet(false);
      setTodoFormResetSignal((signal) => signal + 1);
      setPendingPageNumber(0);
      await loadTodoPages({ pendingPageNumber: 0 });
    } catch (error: unknown) {
      console.error(error);
      showErrorMessage(getErrorMessage(error));
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (keyword.trim() === "") {
      await handleSearchReset();
      return;
    }

    const nextKeyword = keyword.trim();

    setActiveKeyword(nextKeyword);
    setPendingPageNumber(0);
    setCompletedPageNumber(0);
    await loadTodoPages({
      pendingPageNumber: 0,
      completedPageNumber: 0,
      searchKeyword: nextKeyword,
    });
  };

  const handleSearchToggle = async () => {
    if (isSearchOpen && (keyword.trim() !== "" || activeKeyword !== "")) {
      await handleSearchReset();
      return;
    }

    setIsSearchOpen((current) => !current);
  };

  const handlePendingPageChange = (nextPageNumber: number) => {
    setPendingPageNumber(nextPageNumber);
  };

  const handleCompletedPageChange = (nextPageNumber: number) => {
    setCompletedPageNumber(nextPageNumber);
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleTodo(id);
      await loadTodoPages();
    } catch (error: unknown) {
      console.error(error);
      showErrorMessage(getErrorMessage(error));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      await loadTodoPages();
    } catch (error: unknown) {
      console.error(error);
      showErrorMessage(getErrorMessage(error));
    }
  };

  const handlePriorityChange = async (id: number, priority: TodoPriority) => {
    try {
      await updateTodoPriority(id, priority);
      await loadTodoPages();
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

    const todo = [...pendingPage.content, ...completedPage.content].find(
      (todo) => todo.id === id,
    );

    try {
      await updateTodo(
        id,
        editingTitle.trim(),
        todo?.dueDate ?? null,
        todo?.dueTimeSet ?? false,
      );
      setEditingTodoId(null);
      setEditingTitle("");
      await loadTodoPages();
    } catch (error: unknown) {
      console.error(error);
      showErrorMessage(getErrorMessage(error));
    }
  };

  const sortTodos = (todos: Todo[]) =>
    [...todos].sort((a, b) => {
      if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortOption === "priority") {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      return 0;
    });

  const pendingTodos = sortTodos(pendingPage.content);
  const completedTodos = sortTodos(completedPage.content);
  const todoCount = pendingPage.totalElements + completedPage.totalElements;

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
      onPriorityChange={handlePriorityChange}
    />
  );

  const renderPagination = (
    page: TodoPageResponse,
    onPageChange: (nextPageNumber: number) => void,
  ) => (
    <div className="column-pagination">
      <button
        type="button"
        onClick={() => onPageChange(page.number - 1)}
        disabled={page.first || page.totalPages === 0}
      >
        이전
      </button>
      <span>
        {page.totalPages === 0 ? 0 : page.number + 1} / {page.totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page.number + 1)}
        disabled={page.last || page.totalPages === 0}
      >
        다음
      </button>
    </div>
  );

  return (
    <>
      {errorMessage && (
        <div className="toast error-toast" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      <TodoHeader
        todoCount={todoCount}
        keyword={keyword}
        isSearchOpen={isSearchOpen}
        onKeywordChange={setKeyword}
        onSearchSubmit={handleSearchSubmit}
        onSearchToggle={handleSearchToggle}
      />

      <div className="input-row">
        <TodoForm
          key={todoFormResetSignal}
          title={title}
          dueDate={dueDate}
          dueTimeSet={dueTimeSet}
          onTitleChange={setTitle}
          onDueDateChange={setDueDate}
          onDueTimeSetChange={setDueTimeSet}
          onSubmit={handleSubmit}
        />

        <div className="todo-controls">
          <TodoSort sortOption={sortOption} onSortChange={setSortOption} />
        </div>
      </div>

      {isLoading && todoCount === 0 && (
        <p className="state-message">불러오는 중...</p>
      )}

      {!isLoading && todoCount === 0 && (
        <p className="state-message empty-message">표시할 Todo가 없습니다.</p>
      )}

      {todoCount > 0 && (
        <div className="todo-board">
          <section className="todo-column" aria-labelledby="pending-heading">
            <div className="todo-column-header">
              <h2 id="pending-heading">미완료</h2>
              <span>{pendingPage.totalElements}개</span>
            </div>
            {pendingTodos.length > 0 ? (
              renderTodoList(pendingTodos)
            ) : (
              <p className="column-empty-message">미완료 Todo가 없습니다.</p>
            )}
            {renderPagination(pendingPage, handlePendingPageChange)}
          </section>

          <section className="todo-column" aria-labelledby="completed-heading">
            <div className="todo-column-header">
              <h2 id="completed-heading">완료</h2>
              <span>{completedPage.totalElements}개</span>
            </div>
            {completedTodos.length > 0 ? (
              renderTodoList(completedTodos)
            ) : (
              <p className="column-empty-message">완료된 Todo가 없습니다.</p>
            )}
            {renderPagination(completedPage, handleCompletedPageChange)}
          </section>
        </div>
      )}
    </>
  );
}
