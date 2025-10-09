import fs from "fs/promises";
import path from "path";
import { Todo } from "../models/todoModel.js";
import { ApiError } from "../middlewares/errorHandler.js";

const DATA_FILE = path.resolve("data", "todos.json");

export class TodoRepository {
  constructor() {
    this.todos = [];
    this.ready = this._init();
  }

  async _init() {
    try {
      const fileData = await fs.readFile(DATA_FILE, "utf-8");

      // handle empty or invalid JSON safely
      this.todos = fileData.trim() ? JSON.parse(fileData) : [];
    } catch (err) {
      if (err.code === "ENOENT") {
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
        this.todos = [];
      } else {
        console.error("Error initializing TodoRepository:", err);
        this.todos = [];
      }
    }
  }

  getNextId() {
    if (this.todos.length === 0) return 1;
    return Math.max(...this.todos.map((t) => Number(t.id))) + 1;
  }

  async saveToFile() {
    await this.ready; // ensures file initialization
    await fs.writeFile(DATA_FILE, JSON.stringify(this.todos, null, 2));
  }

  async create(data) {
    await this.ready;
    const id = data.id ?? this.getNextId(); // use next numeric id if not provided
    const todo = new Todo({ ...data, id });
    this.todos.push(todo);
    await this.saveToFile();
    return todo;
  }

  async findAll({ status, page = 1, limit = 10 }) {
    await this.ready;
    
    page = Math.max(Number(page) || 1, 1);
    limit = Math.max(Number(limit) || 10, 1);

    let results = [...this.todos];

    if (status) {
      const statusLower = status.toLowerCase();
      results = results.filter((t) => t.status?.toLowerCase() === statusLower);
    }

    const total = results.length;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: results.slice(start, end),
      meta: { page, limit, total },
    };
  }

  async findById(id) {
    await this.ready;
    return this.todos.find((t) => t.id === Number(id));
  }

  async update(id, data) {
    await this.ready;
    const todo = this.todos.find((t) => t.id === Number(id));
    if (!todo) throw new ApiError("Todo not found", 404);

    const allowed = ["title", "description", "status", "doneAt"];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        todo[key] = data[key];
      }
    }

    await this.saveToFile();
    return todo;
  }

  async delete(id) {
    await this.ready;
    const index = this.todos.findIndex((t) => t.id === Number(id));
    if (index === -1) throw new ApiError("Todo not found", 404);

    const [removed] = this.todos.splice(index, 1);
    await this.saveToFile();
    return removed;
  }

  async clear() {
    await this.ready;
    this.todos = [];
    await this.saveToFile();
    return this.todos;
  }
}
