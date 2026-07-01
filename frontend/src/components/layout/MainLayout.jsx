import { NavLink } from "react-router-dom";
import {
  FaBasketShopping,
  FaChartPie,
  FaBoxesStacked,
  FaWarehouse,
  FaUsers,
  FaChartLine,
  FaCashRegister,
  FaRightFromBracket,
  FaCircleCheck,
  FaStore,
  FaMoneyBillTrendUp,
  FaClipboardCheck,
} from "react-icons/fa6";

const NavSection = ({ title, children }) => (
  <div className="mt-5 first:mt-0">
    <p className="px-4 text-white/35 text-[11px] font-bold uppercase tracking-[0.18em] mb-2">
      {title}
    </p>
    <div className="space-y-1">{children}</div>
  </div>
);

const NavItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
    >
      {({ isActive }) => (
        <>
          <Icon className="text-sm shrink-0" />
          <span>{label}</span>
          {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
        </>
      )}
    </NavLink>
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
    Cajero: "bg-blue-100 text-blue-800",
    Supervisor: "bg-purple-100 text-purple-800",
  }[rol] || "bg-gray-100 text-gray-700";

  const puedeAdministrar = rol === "Administrador";
  const puedeVender = rol === "Administrador" || rol === "Cajero";
  const puedeVerReportes = rol === "Administrador" || rol === "Supervisor";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--surface)" }}>
      <aside className="w-64 shrink-0 flex flex-col bg-[#101828]">
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
            <FaStore className="text-emerald-300 text-lg" />
          </div>

          <div>
            <p className="text-white font-extrabold text-sm leading-tight">
              MiniMarket Pro
            </p>
            <p className="text-white/45 text-xs">Gestión comercial</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          <NavSection title="Principal">
            <NavItem to="/dashboard" icon={FaChartPie} label="Dashboard" />
          </NavSection>

          <NavSection title="Operaciones">
            {puedeAdministrar && (
              <>
                <NavItem to="/productos" icon={FaBoxesStacked} label="Productos" />
                <NavItem to="/inventario" icon={FaWarehouse} label="Inventario" />
              </>
            )}

            {puedeVender && (
              <>
                <NavItem to="/cajero" icon={FaBasketShopping} label="Punto de venta" />
                <NavItem to="/caja" icon={FaCashRegister} label="Caja" />
              </>
            )}
          </NavSection>

          {puedeAdministrar && (
            <NavSection title="Administración">
              <NavItem to="/usuarios" icon={FaUsers} label="Usuarios" />
            </NavSection>
          )}

          {puedeVerReportes && (
            <NavSection title="Reportes">
              <NavItem
                to="/supervisor"
                icon={FaClipboardCheck}
                label="Gestión de cierres"
              />

              <NavItem
                to="/reportes"
                icon={FaChartLine}
                label="Reportes"
              />
            </NavSection>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-400/15 text-emerald-200 flex items-center justify-center text-sm font-extrabold">
                {rol?.[0] ?? "U"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">Mi cuenta</p>
                <span className={`badge text-[10px] px-2 py-0 mt-1 ${rolBadgeColor}`}>
                  {rol}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-white/65 hover:text-white hover:bg-white/10 transition-all"
          >
            <FaRightFromBracket className="text-sm" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/90 backdrop-blur border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-extrabold" style={{ color: "var(--text-dark)" }}>
              Sistema de ventas
            </h1>
            <p className="text-xs" style={{ color: "var(--text-mid)" }}>
              Gestión de operaciones, caja, inventario y reportes
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-bold">
              <FaCircleCheck className="text-xs" />
              Sesión activa
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold">
              <FaMoneyBillTrendUp className="text-xs" />
              {rol}
            </div>

            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-extrabold bg-[#101828]">
              {rol?.[0] ?? "U"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}