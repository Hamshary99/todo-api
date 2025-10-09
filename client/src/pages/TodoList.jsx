import { useState, useEffect } from "react";
import axios from "axios";
import TodoItem from "../components/TodoItems.jsx";

const API_URL = "http://localhost:5000/todos";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchTodos = async (pageNum = 1) => {
    try {
      const { data } = await axios.get(
        `${API_URL}?page=${pageNum}&limit=${limit}`
      );
      setTodos(data.data || []);
      setTotal(data.meta.total);
      setPage(pageNum);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await axios.post(API_URL, { title, description });
    setTitle("");
    setDescription("");
    fetchTodos(page);
  };

  const handleComplete = async (id) => {
    await axios.patch(`${API_URL}/${id}/complete`);
    fetchTodos();
  };
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos(page);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-2xl mx-auto py-10">
      {/* Add Form */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 bg-white p-4 rounded shadow mb-6"
      >
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded p-2"
        >
          Add Task
        </button>
      </form>

      {/* Todo List */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet.</p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onComplete={() => handleComplete(todo.id)}
              onDelete={() => handleDelete(todo.id)}
              onUpdated={() => fetchTodos(page)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => fetchTodos(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => fetchTodos(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
