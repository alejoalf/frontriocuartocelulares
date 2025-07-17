import React, { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  const handleLogin = (jwt) => {
    setToken(jwt);
    localStorage.setItem("adminToken", jwt);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("adminToken");
  };

  return token ? (
    <div>
      <button onClick={handleLogout} className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded">Salir</button>
      <AdminPanel token={token} />
    </div>
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
}
