import { TodoRepository } from "../repositories/toDoRepositories.js";
import { ApiError } from "../middlewares/errorHandler.js";

export class TodoService {
  constructor() {
    this.todoRepository = new TodoRepository();
    this.validStatuses = ["pending", "in-progress", "done"];
  }

  createTodo(data) {
    if (!data.title) {
      throw new ApiError("Title is required", 400);
    }

    const idUnique = this.todoRepository.findById(data.id);
    if (idUnique) {
      throw new ApiError("ID must be unique", 400);
    }

    if (data.status && !this.validStatuses.includes(data.status)) {
      throw new ApiError(
        `Invalid status. Allowed: ${this.validStatuses.join(", ")}`,
        400
      );
    }

    return this.todoRepository.create(data);
  }

  getTodos(query) {
    return this.todoRepository.findAll(query);
  }

  getTodoById(id) {
    const todo = this.todoRepository.findById(id);
    if (!todo) {
      throw new ApiError("Todo not found", 404);
    }
    return todo;
  }

  updateTodo(id, data) {
    if (data.status && !this.validStatuses.includes(data.status)) {
      throw new ApiError(
        `Invalid status. Allowed: ${this.validStatuses.join(", ")}`,
        400
      );
    }

    const updated = this.todoRepository.update(id, data);
    if (!updated) {
      throw new ApiError("Todo not found", 404);
    }
    return updated;
  }

  deleteTodo(id) {
    const deleted = this.todoRepository.delete(id);
    if (!deleted) {
      throw new ApiError("Todo not found", 404);
    }
    return deleted;
  }

  clearTodos() {
    return this.todoRepository.clear();
  }
}
