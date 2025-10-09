import { Router } from "express";
import { TodoController } from "../controllers/todoControllers.js"; 

const router = Router();
const todoController = new TodoController();

router.post("/", todoController.createTodo);

// Get all todos (with optional ?status=&page=&limit=)
router.get("/", todoController.getTodos);

router.get("/:id", todoController.getTodoById);

router.patch("/:id", todoController.updateTodo);

router.patch("/:id/complete", todoController.TaskCompleted); 

router.delete("/:id", todoController.deleteTodo);

router.delete("/", todoController.clearTodos);

export default router;
