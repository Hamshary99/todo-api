import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/todos";

export default function TodoItem({ todo, onComplete, onDelete, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);

  const handleUpdate = async () => {
    if (!title.trim()) return;
    await axios.patch(`${API_URL}/${todo.id}`, { title, description });
    setIsEditing(false);
    onUpdated();
  };

  const isDone = todo.status === "done";

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white shadow p-4 rounded border-l-4 transition-all duration-200 ${
        isDone ? "border-green-500 opacity-85" : "border-blue-500"
      }`}
    >
      <div className="flex items-start gap-3 flex-1">
        {/* ✅ Checkbox */}
        <input
          type="checkbox"
          checked={isDone}
          onChange={onComplete}
          className="w-5 h-5 accent-green-600 mt-1 cursor-pointer"
        />

        {/* Content */}
        <div className="flex-1">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 rounded text-sm"
                placeholder="Task title"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 rounded text-sm"
                placeholder="Task description"
              />
            </div>
          ) : (
            <>
              <h3
                className={`font-semibold text-lg ${
                  isDone ? "line-through text-gray-500" : "text-gray-900"
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={`text-sm ${
                    isDone ? "text-gray-400 line-through" : "text-gray-700"
                  }`}
                >
                  {todo.description}
                </p>
              )}
              {isDone && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ Completed at:{" "}
                  {new Date(todo.doneAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
            >
              Edit
            </button>
            <button
              onClick={onComplete}
              disabled={isDone}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              Complete
            </button>
            <button
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
