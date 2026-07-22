import type { Todo } from "../types/todo";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getTodos = async (completedFilter = "all"): Promise<Todo[]> => {
  const url =
    completedFilter === "all"
      ? `${API_BASE_URL}/todos`
      : `${API_BASE_URL}/todos?completed=${completedFilter}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Todo 목록 조회 실패: ${response.status}`);
  }

  return response.json();
};

export const searchTodos = async (keyword: string): Promise<Todo[]> => {
  const response = await fetch(
    `${API_BASE_URL}/todos/search?keyword=${encodeURIComponent(keyword)}`
  );

  if (!response.ok) {
    throw new Error(`Todo 검색 실패: ${response.status}`);
  }

  return response.json();
};

export const createTodo = async (title: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error(`Todo 생성 실패: ${response.status}`);
  }
};

export const toggleTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(`Todo 토글 실패: ${response.status}`);
  }
};

export const updateTodo = async (id: number, title: string) => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error("Todo 수정에 실패했습니다.");
  }

  return response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Todo 삭제 실패: ${response.status}`);
  }
};
