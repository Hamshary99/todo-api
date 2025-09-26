import fetch from "node-fetch";

async function createTask() {
  const res = await fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Learn OOP and the power of classes",
      description: "Practice with Node.js then check the response",
      status: "in-progress", // Or is it done my dear tasker ;)
    }),
  });
  const data = await res.json();
  console.log(data);
}

createTask();
