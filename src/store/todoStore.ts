import { create } from "zustand";
import { type Todo } from "@/types/todo";

interface TodoStore {
  todos: Todo[];
  filter: "All" | "Active" | "Completed";
  setTodos: (todos: Todo[]) => void;
  setFilter: (filter: "All" | "Active" | "Completed") => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  filter: "All",
  setTodos: (todos) => set({ todos }),
  setFilter: (filter) => set({ filter }),
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
  updateTodo: (todo) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === todo.id ? todo : t)),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
  searchTerm: "",
  setSearchTerm: (searchTerm) => set({ searchTerm }),
}));
