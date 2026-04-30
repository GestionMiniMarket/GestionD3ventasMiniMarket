import { Link, useLocation } from "react-router-dom";

const NavItem = ({ to, icon, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className={`nav-link ${active ? "active" : ""}`}>
      <span className="text-base">{icon}</span>
      <span>{label}</span>
      {active && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
      )}
    </Link>
  );
};

export default function Layout({ children }) {
  const rol = localStorage.getItem("rol");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const rolBadgeColor = {
    Administrador: "bg-amber-100 text-amber-800",
    Cajero:        "bg-blue-100 text-blue-800",
    Supervisor:    "bg-purple-100 text-purple-800",
  }[rol] || "bg-gray-100 text-gray-700";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--surface)" }}>

      {/* ── SIDEBAR ── */}
      <aside
        className="w-60 shrink-0 flex flex-col"
        style={{ background: "linear-gradient(180deg, #1a6b3c 0%, #0f4226 100%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9"/></svg>
          </div>
          <div>
            <p className="text-white font-extrabold text-sm leading-tight"
              style={{ fontFamily: "'Nunito', sans-serif" }}>MiniMarket Pro</p>
            <p className="text-white/50 text-xs">Sistema de Ventas</p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-white/35 text-xs font-semibold uppercase tracking-widest mb-2">
            Principal
          </p>
          <NavItem to="/dashboard" icon="🏠" label="Dashboard" />
          <NavItem to="/productos" icon="📦" label="Productos" />

          {rol === "Administrador" && (
            <>
              <p className="px-4 text-white/35 text-xs font-semibold uppercase tracking-widest mb-2 mt-4">
                Administración
              </p>
              <NavItem to="/admin"    icon="⚙️" label="Panel Admin" />
              <NavItem to="/usuarios" icon="👥" label="Usuarios" />
            </>
          )}

          {rol === "Supervisor" && (
            <>
              <p className="px-4 text-white/35 text-xs font-semibold uppercase tracking-widest mb-2 mt-4">
                Supervisión
              </p>
              <NavItem to="/supervisor" icon="📊" label="Reportes" />
            </>
          )}

          {rol === "Cajero" && (
            <>
              <p className="px-4 text-white/35 text-xs font-semibold uppercase tracking-widest mb-2 mt-4">
                Caja
              </p>
              <NavItem to="/cajero" icon="🧾" label="Ventas" />
            </>
          )}
        </nav>

        {/* Perfil + Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
              {rol?.[0] ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Mi cuenta</p>
              <span className={`badge text-[10px] px-2 py-0 ${rolBadgeColor}`}>{rol}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-extrabold" style={{ fontFamily: "'Nunito', sans-serif", color: "var(--text-dark)" }}>
              Sistema de Ventas
            </h1>
            <p className="text-xs" style={{ color: "var(--text-mid)" }}>
              {new Date().toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500" title="Conectado" />
            <span className="text-xs font-medium" style={{ color: "var(--text-mid)" }}>
              Sesión activa
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--green-brand)" }}>
              {rol?.[0] ?? "U"}
            </div>
          </div>
        </header>

        {/* Área de contenido */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}