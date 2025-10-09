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

    // Let repository handle ID logic
    const todo = await this.todoRepository.create({
      title: data.title.trim(),
      description: data.description || "",
      status: data.status || "pending",
      doneAt: null,
    });

    return todo;
  }

  async getTodos(query) {
    return await this.todoRepository.findAll(query);
  }

  async getTodoById(id) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) throw new ApiError("Todo not found", 404);
    return todo;
  }

  async updateTodo(id, data) {
    if (data.status && !this.validStatuses.includes(data.status)) {
      throw new ApiError(
        `Invalid status. Allowed values: ${this.validStatuses.join(", ")}`,
        400
      );
    }

    const updated = await this.todoRepository.update(id, data);
    if (!updated) throw new ApiError("Todo not found", 404);

    if (data.status === "done" && !updated.doneAt) {
      updated.doneAt = new Date().toISOString();
      await this.todoRepository.saveToFile();
    }

    if (data.status && data.status !== "done" && updated.doneAt) {
      updated.doneAt = null;
      await this.todoRepository.saveToFile();
    }

    return updated;
  }

  async TaskCompleted(id) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) throw new ApiError("Todo not found", 404);
    if (todo.status === "done")
      throw new ApiError("Todo is already marked as completed", 400);

    todo.status = "done";
    todo.doneAt = new Date().toISOString();

    await this.todoRepository.saveToFile();
    return todo;
  }


  async markAsInProgress(id) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) throw new ApiError("Todo not found", 404);

    if (todo.status === "in-progress")
      throw new ApiError("Todo is already in progress", 400);

    // If it was done before, reset doneAt
    if (todo.status === "done") {
      todo.doneAt = null;
    }

    todo.status = "in-progress";
    await this.todoRepository.saveToFile();
    return todo;
  }

  async deleteTodo(id) {
    const deleted = await this.todoRepository.delete(id);
    if (!deleted) throw new ApiError("Todo not found", 404);
    return deleted;
  }

  async clearTodos() {
    return await this.todoRepository.clear();
  }
}
