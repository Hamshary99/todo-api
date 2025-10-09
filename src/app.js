import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/toDoRoutes.js";
import { handleError } from "./middlewares/errorHandler.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/todos", todoRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "Todo app is fine and running",
    timeStamp: new Date().toISOString(),
  });
});

// Error handler
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
