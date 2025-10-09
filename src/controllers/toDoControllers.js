import { TodoService } from "../services/todoServices.js";
import { ApiError } from "../middlewares/errorHandler.js";

export class TodoController {
  constructor() {
    this.todoService = new TodoService();

    this.createTodo = this.createTodo.bind(this);
    this.getTodos = this.getTodos.bind(this);
    this.getTodoById = this.getTodoById.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.clearTodos = this.clearTodos.bind(this);
    this.TaskCompleted = this.TaskCompleted.bind(this);
  }

  async createTodo(req, res, next) {
    try {
      console.log("Incoming data:", req.body);
      if (!req.body || Object.keys(req.body).length === 0)
        throw new ApiError("Request body is missing", 400);

      const todo = await this.todoService.createTodo(req.body);
      res.status(201).json({
        success: true,
        message: "Todo created successfully",
        data: todo,
      });
    } catch (err) {
      next(err);
    }
  }

  async getTodos(req, res, next) {
    try {
      const { status, page, limit } = req.query;
      const todos = await this.todoService.getTodos({ status, page, limit });

      res.status(200).json({
        success: true,
        message: "Todos fetched successfully",
        ...todos,
      });
    } catch (err) {
      next(err);
    }
  }

  async getTodoById(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) throw new ApiError("Missing Todo ID", 400);

      const todo = await this.todoService.getTodoById(id);
      res.status(200).json({
        success: true,
        message: "Todo fetched successfully",
        data: todo,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateTodo(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) throw new ApiError("Missing Todo ID", 400);
      if (!req.body || Object.keys(req.body).length === 0)
        throw new ApiError("Request body is missing", 400);

      const updated = await this.todoService.updateTodo(id, req.body);
      res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async TaskCompleted(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) throw new ApiError("Missing Todo ID", 400);

      const todo = await this.todoService.TaskCompleted(id);
      res.status(200).json({
        success: true,
        message: "Todo marked as completed",
        data: todo,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteTodo(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) throw new ApiError("Missing Todo ID", 400);

      const deleted = await this.todoService.deleteTodo(id);
      res.status(200).json({
        success: true,
        message: "Todo deleted successfully",
        data: deleted,
      });
    } catch (err) {
      next(err);
    }
  }

  async clearTodos(req, res, next) {
    try {
      const todos = await this.todoService.clearTodos();
      res.status(200).json({
        success: true,
        message: "All todos cleared successfully",
        data: todos,
      });
    } catch (err) {
      next(err);
    }
  }
}
