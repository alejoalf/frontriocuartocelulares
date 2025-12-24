import React, { useState } from "react";
import { supabase } from "../config/supabaseClient";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });
    setLoading(false);
    if (authError) {
      setError("Credenciales inválidas");
      return;
    }
    onLogin?.(data.session);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xs mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Acceso administrador</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="mb-2 w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={pass}
        onChange={e => setPass(e.target.value)}
        className="mb-2 w-full p-2 border rounded"
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded" disabled={loading}>
        {loading ? "Ingresando..." : "Entrar"}
      </button>
    </form>
  );
}
