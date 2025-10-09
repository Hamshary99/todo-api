import { ApiError } from "../middlewares/errorHandler.js";

export class Todo {
  constructor({ id, title, description, status, createdAt, doneAt }) {
    if (!title?.trim()) {
      throw new ApiError("Todo must include a valid title", 400);
    }

    this.id = id;
    this.title = title.trim();
    this.description = description || "";
    this.status = status || "pending";
    this.createdAt = createdAt || new Date().toISOString();
    this.doneAt = doneAt || null;
  }
}
