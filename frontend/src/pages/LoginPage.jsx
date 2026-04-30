import { useState } from "react";
import { login } from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("rol", res.data.rol);
      const rol = res.data.rol;
      if (rol === "Administrador") window.location.href = "/admin";
      else if (rol === "Cajero")   window.location.href = "/cajero";
      else if (rol === "Supervisor") window.location.href = "/supervisor";
      else window.location.href = "/";
    } catch {
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--surface)" }}>

    
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 text-white"
        style={{ background: "linear-gradient(160deg, #1a6b3c 0%, #0f4226 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9"/></svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Nunito', sans-serif" }}>
            MiniMarket Pro
          </span>
        </div>

        <div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4"
            style={{ fontFamily: "'Nunito', sans-serif" }}>
            Gestión de ventas<br />inteligente
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-xs">
            Control total de tu minimarket: inventario, ventas y reportes en un solo lugar.
          </p>
        </div>

        <p className="text-white/40 text-xs">© 2026 MiniMarket Pro · Sistema de Gestión</p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--green-brand)" }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9"/></svg>
            </div>
            <span className="text-lg font-extrabold" style={{ fontFamily: "'Nunito', sans-serif", color: "var(--green-brand)" }}>
              MiniMarket Pro
            </span>
          </div>

          <h2 className="text-2xl font-extrabold mb-1" style={{ fontFamily: "'Nunito', sans-serif", color: "var(--text-dark)" }}>
            Bienvenido
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-mid)" }}>
            Ingresa tus credenciales para continuar
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                style={{ color: "var(--text-mid)" }}>Correo electrónico</label>
              <input
                type="email" name="email" placeholder="correo@ejemplo.com"
                onChange={handleChange} className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                style={{ color: "var(--text-mid)" }}>Contraseña</label>
              <input
                type="password" name="password" placeholder="••••••••"
                onChange={handleChange} className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Ingresando…
                </span>
              ) : "Ingresar al sistema"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}