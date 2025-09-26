import { Router } from "express";
import { TodoController } from "../controllers/toDoControllers.js";

const router = Router();
const todoController = new TodoController();

router.post("/", todoController.createTodo);
router.get("/", todoController.getTodos);
router.get("/:id", todoController.getTodoById);
router.put("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);
router.delete("/", todoController.clearTodos);

export default router;
