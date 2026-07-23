import type { Todo, TodoPriority } from "../types/todo";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type TodoPageResponse = {
  content: Todo[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export const updateTodoPriority = async (
  id: number,
  priority: TodoPriority,
): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}/priority`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ priority }),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  return response.json();
}

type GetTodosParams = {
  completed?: boolean;
  page?: number;
  size?: number;
  sort?: string;
};

const handleErrorResponse = async (response: Response) => {
  const errorData = await response.json();

  throw new Error(errorData.message ?? `요청 실패: ${response.status}`);
};

const normalizePage = (data: Todo[] | TodoPageResponse): TodoPageResponse => {
  if (!Array.isArray(data)) {
    return data;
  }

  return {
    content: data,
    number: 0,
    size: data.length,
    totalElements: data.length,
    totalPages: data.length > 0 ? 1 : 0,
    first: true,
    last: true,
  };
};

const buildQueryString = (params: Record<string, string | number | boolean>) =>
  new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  ).toString();

export const getTodos = async ({
  completed,
  page = 0,
  size = 6,
  sort = "desc",
}: GetTodosParams = {}): Promise<TodoPageResponse> => {
  const queryParams: Record<string, string | number | boolean> = {
    page,
    size,
    sort,
  };

  if (completed !== undefined) {
    queryParams.completed = completed;
  }

  const response = await fetch(
    `${API_BASE_URL}/todos?${buildQueryString(queryParams)}`
  );

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  const data = await response.json();
  return normalizePage(data);
};

export const searchTodos = async (
  keyword: string,
  completed?: boolean,
  page = 0,
  size = 6,
  sort = "desc"
): Promise<TodoPageResponse> => {
  const queryParams: Record<string, string | number | boolean> = {
    keyword,
    page,
    size,
    sort,
  };

  if (completed !== undefined) {
    queryParams.completed = completed;
  }

  const response = await fetch(
    `${API_BASE_URL}/todos/search?${buildQueryString(queryParams)}`
  );

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  const data = await response.json();
  return normalizePage(data);
};

export const createTodo = async (
  title: string,
  dueDate: string | null,
  dueTimeSet: boolean,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, dueDate, dueTimeSet }),
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

export const updateTodo = async (
  id: number,
  title: string,
  dueDate: string | null,
  dueTimeSet: boolean,
) => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, dueDate, dueTimeSet }),
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
