import type { Todo } from "../types/todo";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleErrorResponse = async (response: Response) => {
  const errorData = await response.json();

  throw new Error(
    errorData.message ?? `요청 실패: ${response.status}`
  );
}

export const getTodos = async (completedFilter = "all"): Promise<Todo[]> => {
  const url =
    completedFilter === "all"
      ? `${API_BASE_URL}/todos`
      : `${API_BASE_URL}/todos?completed=${completedFilter}`;

  const response = await fetch(url);

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  return response.json();
};

export const searchTodos = async (keyword: string): Promise<Todo[]> => {
  const response = await fetch(
    `${API_BASE_URL}/todos/search?keyword=${encodeURIComponent(keyword)}`
  );

  if (!response.ok) {
    await handleErrorResponse(response);
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
    await handleErrorResponse(response);
  }
};

export const toggleTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}/toggle`, {
    method: "PATCH",
  });

  if (!response.ok) {
    await handleErrorResponse(response);
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
    await handleErrorResponse(response);
  }

  return response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
};
