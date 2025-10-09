import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-blue-700 text-white text-center py-4">
        <h1 className="text-2xl font-bold">Todo Manager</h1>
      </header>
      <main className="max-w-2xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
