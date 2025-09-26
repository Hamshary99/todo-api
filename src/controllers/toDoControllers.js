import { TodoService } from "../services/toDoServices.js";
import { ApiError } from "../middlewares/errorHandler.js";

export class TodoController {
  constructor() {
    this.todoService = new TodoService();

    // bind methods so "this" works inside Express routes
    this.createTodo = this.createTodo.bind(this);
    this.getTodos = this.getTodos.bind(this);
    this.getTodoById = this.getTodoById.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.clearTodos = this.clearTodos.bind(this);
  }

  async createTodo(req, res, next) {
    if (!req.body) throw new ApiError("Request body is missing", 400);
    try {
      const todo = await this.todoService.createTodo(req.body);
      res.status(201).json({ success: true, data: todo });
    } catch (err) {
      next(err);
    }
  }

  async getTodos(req, res, next) {
    try {
      const { status, page, limit } = req.query;
      const todos = await this.todoService.getTodos({ status, page, limit });
      res.json({ success: true, ...todos });
    } catch (err) {
      next(err);
    }
  }

  async getTodoById(req, res, next) {
    if (!req.body || !req.params.id)
      throw new ApiError("Request body is missing or missing ID", 400);
    try {
      const todo = await this.todoService.getTodoById(req.params.id);
      res.json({ success: true, data: todo });
    } catch (err) {
      next(err);
    }
  }

  async updateTodo(req, res, next) {
    if (!req.body || !req.params.id)
      throw new ApiError("Request body is missing or missing ID", 400);
    try {
      const todo = await this.todoService.updateTodo(req.params.id, req.body);
      res.json({ success: true, data: todo });
    } catch (err) {
      next(err);
    }
  }

  async deleteTodo(req, res, next) {
    if (!req.params.id) throw new ApiError("Missing ID", 400);
    try {
      const todo = await this.todoService.deleteTodo(req.params.id);
      res.json({ success: true, data: todo });
    } catch (err) {
      next(err);
    }
  }

  async clearTodos(req, res, next) {
    try {
      const todos = await this.todoService.clearTodos();
      res.json({ success: true, data: todos });
    } catch (err) {
      next(err);
    }
  }
}
