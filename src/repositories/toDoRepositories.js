import { Todo } from "../models/toDoModel.js";
// import { v4 as uuidv4 } from "uuid";

export class TodoRepository {
  constructor() {
    this.todos = [];
  }

  create(data) {
    const todo = new Todo(data);
    this.todos.push(todo);
    return todo;
  }

  findAll({ status, page = 1, limit = 10 }) {
    page = Number(page);
    limit = Number(limit);
    let results = [...this.todos];
    if (status) results = results.filter((t) => t.status === status);

    const total = results.length;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: results.slice(start, end),
      meta: { page, limit, total },
    };
  }

  findById(id) {
    return this.todos.find((t) => t.id === Number(id));
  }

  update(id, data) {
    const todo = this.findById(Number(id));
    if (!todo) return null;

    const allowed = ["title", "description", "status"];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        todo[key] = data[key];
      }
    }
    return todo;
  }

  delete(id) {
    const index = this.todos.findIndex((t) => t.id === Number(id));
    if (index === -1) return null;

    const [removed] = this.todos.splice(index, 1);
    return removed;
  }

  clear() {
    this.todos = [];
    return this.todos;
  }
}
