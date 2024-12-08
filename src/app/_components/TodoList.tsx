"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaPencilAlt,
  FaTrashAlt,
  FaPlus,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

import { api } from "@/trpc/react";
import LoadingSpinnert from "./LoadingSpinnert";
import toast, { Toaster } from "react-hot-toast";
import { useTodoStore } from "@/store/todoStore";

export default function TodoList() {
  const { todos, filter, searchTerm, setTodos, setFilter, setSearchTerm } =
    useTodoStore();
  const [newTask, setNewTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const listRef = useRef<HTMLDivElement | null>(null);

  const { data: tasks, refetch, isLoading } = api.task.getAll.useQuery();
  const createTask = api.task.create.useMutation({
    onSuccess: () => refetch(),
  });
  const updateTask = api.task.update.useMutation({
    onSuccess: () => refetch(),
  });
  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const searchQuery = api.task.search.useQuery(
    { searchTerm },
    {
      enabled: searchTerm.length > 0,
    },
  );

  useEffect(() => {
    if (searchQuery.data) {
      setTodos(searchQuery.data);
    }
  }, [searchQuery.data, setTodos]);

  useEffect(() => {
    if (tasks && searchTerm.length === 0) {
      setTodos(tasks);
    }
  }, [tasks, searchTerm, setTodos]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length > 0) {
        void searchQuery.refetch();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchQuery]);

  const addTodo = async () => {
    if (!newTask.trim()) return;

    await createTask.mutateAsync({ title: newTask });
    setNewTask("");
    setIsAdding(false);
    toast.success("Task added successfully!");
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;

    await updateTask.mutateAsync({
      id,
      title: todo.title,
      completed: !completed,
    });
    toast.success("Updated successfully");
  };

  const deleteTodo = async (id: number) => {
    await deleteTask.mutateAsync({ id });
    toast.error("Task item deleted successfully!");
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async () => {
    if (editingId === null) return;

    await updateTask.mutateAsync({
      id: editingId,
      title: editText,
      completed:
        todos.find((todo) => todo.id === editingId)?.completed ?? false,
    });
    setEditingId(null);
    toast.success("Task updated successfully!");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as "All" | "Active" | "Completed");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "Active") return !todo.completed;
    if (filter === "Completed") return todo.completed;
    return true;
  });
  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setVisibleCount((prev) => Math.min(prev + 5, filteredTodos.length)); // Load 5 more tasks
      }
    };

    const container = listRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [filteredTodos]);
  const visibleTodos = filteredTodos.slice(0, visibleCount);

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          TODO LIST
        </h1>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            />
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between space-y-2 sm:flex-nowrap sm:space-y-0">
          {isAdding ? (
            <div className="w-full sm:mr-4 sm:flex-1">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter new task"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                onKeyUp={(e) => e.key === "Enter" && addTodo()}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="text-md flex w-full items-center rounded-lg bg-[#6366F1] px-6 py-3 text-white transition-colors hover:bg-[#5558DD] md:w-40"
            >
              <FaPlus className="mr-2 h-5 w-5" />
              Add Task
            </button>
          )}

          {isAdding && (
            <button
              onClick={addTodo}
              className="text-md w-full rounded-lg bg-[#6366F1] px-6 py-3 text-white transition-colors hover:bg-[#5558DD] sm:mr-4 sm:w-auto"
            >
              {createTask.isPending ? <>Adding...</> : <>Add</>}
            </button>
          )}

          <div className="relative w-full sm:w-auto">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="text-md relative w-full appearance-none rounded-lg bg-gray-200 px-7 py-3 text-gray-700 outline-none"
            >
              <option>All</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>

        <div
          ref={listRef}
          className="scrollable space-y-2 rounded-2xl bg-[#F3F4F6] p-4"
        >
          {isLoading ? (
            <LoadingSpinnert />
          ) : (
            <>
              {visibleTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center rounded-xl bg-white p-4 shadow-sm"
                >
                  <div
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className={`mr-4 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border-2 ${
                      todo.completed
                        ? "border-[#6366F1] bg-[#6366F1]"
                        : "border-gray-300 hover:border-[#6366F1]"
                    }`}
                  >
                    {todo.completed && (
                      <FaCheck className="h-3 w-3 text-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                        onKeyUp={(e) => e.key === "Enter" && saveEdit()}
                      />
                    ) : (
                      <>
                        <p className={`line-clamp-3 break-words text-gray-800`}>
                          {todo.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          {new Date(todo.createdAt).toLocaleString("en-US")}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {editingId === todo.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="rounded-lg p-2 text-green-500 hover:text-green-600"
                        >
                          <FaCheck className="h-5 w-5" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-lg p-2 text-red-500 hover:text-red-600"
                        >
                          <FaTimes className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(todo.id, todo.title)}
                          className="rounded-lg p-2 text-gray-400 hover:text-[#6366F1]"
                        >
                          <FaPencilAlt className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="rounded-lg p-2 text-gray-400 hover:text-red-600"
                        >
                          <FaTrashAlt className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
