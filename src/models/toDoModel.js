import { ApiError } from "../middlewares/errorHandler.js";

export class Todo {
  constructor({
    id,
    title,
    description = "",
    status = "pending",
    createdAt = new Date(Date.now()).toISOString(),
  }) {
    if (!title) throw new ApiError("Title field is required", 400);

    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
  }
}
