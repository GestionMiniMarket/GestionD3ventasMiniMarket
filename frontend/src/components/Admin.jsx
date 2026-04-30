export default function Admin() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Panel de Administrador
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
          Gestión completa del sistema
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: "👥", title: "Usuarios", desc: "Gestionar cuentas y permisos", color: "#7c3aed", bg: "#f5f3ff" },
          { icon: "📋", title: "Reportes", desc: "Informes y análisis", color: "var(--green-brand)", bg: "var(--green-pale)" },
          { icon: "🔧", title: "Configuración", desc: "Parámetros del sistema", color: "#d97706", bg: "#fffbeb" },
        ].map((c) => (
          <div key={c.title} className="card p-6 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: c.bg }}>
              {c.icon}
            </div>
            <div>
              <p className="font-bold text-base">{c.title}</p>
              <p className="text-sm" style={{ color: "var(--text-mid)" }}>{c.desc}</p>
            </div>
            <button className="btn-secondary self-start text-xs px-4 py-2" style={{ color: c.color, borderColor: c.color }}>
              Gestionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}