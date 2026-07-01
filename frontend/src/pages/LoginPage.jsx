import { useState } from "react";
import { FaBasketShopping, FaEnvelope, FaLock, FaBoxesStacked, FaChartLine } from "react-icons/fa6";
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
      setError("Ingresa tu correo y contraseña para continuar.");
      return;
    }

    setLoading(true);

    try {
      const res = await login(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("rol", res.data.rol);

      const rol = res.data.rol;

      if (rol === "Administrador") window.location.href = "/dashboard";
      else if (rol === "Cajero") window.location.href = "/cajero";
      else if (rol === "Supervisor") window.location.href = "/reportes";
      else window.location.href = "/";
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_0.95fr] bg-[#f4f6f8]">
      <section className="hidden lg:flex relative overflow-hidden bg-[#101828] text-white p-12 flex-col justify-between">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#22c55e_0,transparent_32%),radial-gradient(circle_at_80%_30%,#f59e0b_0,transparent_28%)]" />

        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
            <FaBasketShopping className="text-xl text-emerald-300" />
          </div>
          <div>
            <p className="font-extrabold text-lg leading-tight">MiniMarket Pro</p>
            <p className="text-xs text-white/50">Sistema de gestión comercial</p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/10 text-emerald-200 mb-5">
            Inventario · Ventas · Control
          </span>

          <h1 className="text-5xl font-extrabold leading-tight mb-5">
            Administra tu minimarket con más orden y rapidez.
          </h1>

          <p className="text-white/65 text-base leading-relaxed max-w-md">
            Controla productos, usuarios, stock y operaciones desde una plataforma diseñada para negocios de venta diaria.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
            <div className="rounded-2xl bg-white/8 border border-white/10 p-4">
              <FaBoxesStacked className="text-emerald-300 mb-3" />
              <p className="font-bold text-sm">Inventario</p>
              <p className="text-xs text-white/50 mt-1">Stock y categorías</p>
            </div>

            <div className="rounded-2xl bg-white/8 border border-white/10 p-4">
              <FaChartLine className="text-amber-300 mb-3" />
              <p className="font-bold text-sm">Indicadores</p>
              <p className="text-xs text-white/50 mt-1">Resumen operativo</p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-white/40">
          © 2026 MiniMarket Pro. Plataforma de gestión de ventas.
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-[#101828] flex items-center justify-center">
              <FaBasketShopping className="text-emerald-300" />
            </div>
            <div>
              <p className="font-extrabold text-lg">MiniMarket Pro</p>
              <p className="text-xs" style={{ color: "var(--text-mid)" }}>
                Sistema de ventas
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="mb-7">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 mb-4">
                Acceso seguro
              </span>

              <h2 className="text-3xl font-extrabold mb-2">
                Iniciar sesión
              </h2>

              <p className="text-sm" style={{ color: "var(--text-mid)" }}>
                Ingresa con tus credenciales para acceder al sistema.
              </p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: "var(--text-mid)" }}>
                  Correo electrónico
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    placeholder="correo@ejemplo.com"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: "var(--text-mid)" }}>
                  Contraseña
                </label>

                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Validando acceso..." : "Ingresar al sistema"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}