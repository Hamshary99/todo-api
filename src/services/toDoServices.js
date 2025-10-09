import { TodoRepository } from "../repository/todoRepository.js";
import { ApiError } from "../middlewares/errorHandler.js";

export class TodoService {
  constructor() {
    this.todoRepository = new TodoRepository();
    this.validStatuses = ["pending", "in-progress", "done"];
  }

  async createTodo(data) {
    if (!data.title?.trim()) {
      throw new ApiError("Title is required", 400);
    }

    if (data.status && !this.validStatuses.includes(data.status)) {
      throw new ApiError(
        `Invalid status. Allowed: ${this.validStatuses.join(", ")}`,
        400
      );
    }

    // Handle unique ID or auto-generate one
    const existing = await this.todoRepository.findById(data.id);
    if (data.id && existing) {
      throw new ApiError("ID must be unique", 400);
    }

    // Auto-generate numeric ID if not provided
    const all = await this.todoRepository.findAll({ page: 1, limit: Infinity });
    const newId =
      data.id ??
      (all.data.length > 0
        ? Math.max(...all.data.map((t) => Number(t.id))) + 1
        : 1);

    return await this.todoRepository.create({ ...data, id: newId });
  }

  async getTodos(query) {
    return await this.todoRepository.findAll(query);
  }

  async getTodoById(id) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new ApiError("Todo not found", 404);
    }
    return todo;
  }

  async updateTodo(id, data) {
    if (data.status && !this.validStatuses.includes(data.status)) {
      throw new ApiError(
        `Invalid status. Allowed: ${this.validStatuses.join(", ")}`,
        400
      );
    }

    const updated = await this.todoRepository.update(id, data);
    if (!updated) {
      throw new ApiError("Todo not found", 404);
    }

    // Auto-set doneAt when status = "done"
    if (data.status === "done") {
      updated.doneAt = new Date().toISOString();
      await this.todoRepository.saveToFile();
    }

    return updated;
  }

  async deleteTodo(id) {
    const deleted = await this.todoRepository.delete(id);
    if (!deleted) {
      throw new ApiError("Todo not found", 404);
    }
    return deleted;
  }

  async clearTodos() {
    return await this.todoRepository.clear();
  }
}
