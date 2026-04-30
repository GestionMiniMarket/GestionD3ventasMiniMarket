export default function Dashboard() {
  const rol = localStorage.getItem("rol");

  const stats = [
    {
      label: "Ventas del día",
      value: "S/. 3,240",
      change: "+12% vs ayer",
      up: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
        </svg>
      ),
      color: "var(--green-brand)",
      bg: "var(--green-pale)",
    },
    {
      label: "Productos en stock",
      value: "1,850",
      change: "23 bajo mínimo",
      up: false,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
        </svg>
      ),
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Transacciones",
      value: "87",
      change: "+5 última hora",
      up: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      ),
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    ...(rol === "Administrador"
      ? [{
          label: "Usuarios activos",
          value: "12",
          change: "3 roles distintos",
          up: true,
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/>
            </svg>
          ),
          color: "#d97706",
          bg: "#fffbeb",
        }]
      : []),
  ];

  const accesos = [
    { href: "/productos", icon: "📦", title: "Productos", desc: "Ver y gestionar inventario" },
    { href: "/cajero",    icon: "🧾", title: "Nueva venta", desc: "Registrar transacción" },
    { href: "/supervisor",icon: "📊", title: "Reportes", desc: "Ver estadísticas" },
    ...(rol === "Administrador"
      ? [{ href: "/admin", icon: "⚙️", title: "Configuración", desc: "Administrar sistema" }]
      : []),
  ];

  return (
    <div>
      {/* Encabezado de sección */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold" style={{ fontFamily: "'Nunito', sans-serif", color: "var(--text-dark)" }}>
          Dashboard
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
          Resumen del día · {new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "long" })}
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: s.bg, color: s.color }}
              >
                {s.icon}
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  s.up ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-extrabold" style={{ fontFamily: "'Nunito', sans-serif", color: "var(--text-dark)" }}>
              {s.value}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-mid)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "var(--text-mid)" }}>
          Accesos rápidos
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {accesos.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="card p-4 flex flex-col gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
            >
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text-dark)" }}>{a.title}</p>
                <p className="text-xs" style={{ color: "var(--text-mid)" }}>{a.desc}</p>
              </div>
              <span className="text-xs font-semibold mt-auto" style={{ color: "var(--green-brand)" }}>
                Abrir →
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Tabla de ventas recientes (placeholder) */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Ventas recientes
          </h3>
          <span className="badge badge-green">Hoy</span>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { id: "#0087", cajero: "Ana Torres",    total: "S/. 42.50", hora: "14:32", items: 4 },
            { id: "#0086", cajero: "Luis Pérez",    total: "S/. 18.00", hora: "14:15", items: 2 },
            { id: "#0085", cajero: "Ana Torres",    total: "S/. 95.30", hora: "13:58", items: 7 },
            { id: "#0084", cajero: "Carlos Ruiz",   total: "S/. 12.00", hora: "13:41", items: 1 },
          ].map((v) => (
            <div key={v.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <span className="text-xs font-mono font-bold" style={{ color: "var(--green-brand)" }}>{v.id}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--text-dark)" }}>{v.cajero}</p>
                <p className="text-xs" style={{ color: "var(--text-mid)" }}>{v.items} productos · {v.hora}</p>
              </div>
              <span className="text-sm font-bold" style={{ color: "var(--text-dark)" }}>{v.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}