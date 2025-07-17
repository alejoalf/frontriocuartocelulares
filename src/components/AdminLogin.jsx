import React, { useState } from "react";

export default function AdminLogin({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const res = await fetch("https://backriocuartocelulares.up.railway.app/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: pass })
    });
    if (res.ok) {
      const data = await res.json();
      onLogin(data.token);
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xs mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Acceso administrador</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={user}
        onChange={e => setUser(e.target.value)}
        className="mb-2 w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={pass}
        onChange={e => setPass(e.target.value)}
        className="mb-2 w-full p-2 border rounded"
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded">Entrar</button>
    </form>
  );
}
