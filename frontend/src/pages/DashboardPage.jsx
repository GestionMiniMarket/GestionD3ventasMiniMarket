import {
  FaBasketShopping,
  FaBoxesStacked,
  FaTriangleExclamation,
  FaUsers,
  FaArrowTrendUp,
  FaCashRegister,
} from "react-icons/fa6";

export default function Dashboard() {
  const indicadores = [
    {
      titulo: "Ventas del día",
      valor: "S/ 0.00",
      detalle: "Pendiente de integración con ventas",
      icono: FaCashRegister,
      color: "#15803d",
      fondo: "#dcfce7",
    },
    {
      titulo: "Productos activos",
      valor: "Inventario",
      detalle: "Control de productos disponibles",
      icono: FaBoxesStacked,
      color: "#2563eb",
      fondo: "#dbeafe",
    },
    {
      titulo: "Stock bajo",
      valor: "Alertas",
      detalle: "Revisión de productos por reponer",
      icono: FaTriangleExclamation,
      color: "#b45309",
      fondo: "#fef3c7",
    },
    {
      titulo: "Usuarios",
      valor: "Personal",
      detalle: "Gestión de cuentas y roles",
      icono: FaUsers,
      color: "#7c3aed",
      fondo: "#f3e8ff",
    },
  ];

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 mb-3">
            Panel principal
          </span>

          <h2
            className="text-2xl font-extrabold"
            style={{ fontFamily: "'Nunito', sans-serif", color: "var(--text-dark)" }}
          >
            Dashboard
          </h2>

          <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
            Resumen operativo del minimarket y accesos rápidos del sistema.
          </p>
        </div>

        <div className="text-sm font-semibold px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm">
          Sistema activo
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {indicadores.map((item) => {
          const Icono = item.icono;

          return (
            <div key={item.titulo} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold mb-2" style={{ color: "var(--text-mid)" }}>
                    {item.titulo}
                  </p>

                  <h3
                    className="text-2xl font-extrabold"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    {item.valor}
                  </h3>

                  <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--text-mid)" }}>
                    {item.detalle}
                  </p>
                </div>

                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: item.fondo, color: item.color }}
                >
                  <Icono className="text-lg" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center">
              <FaBasketShopping className="text-lg" />
            </div>

            <div>
              <h3
                className="text-lg font-extrabold"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Operación del minimarket
              </h3>
              <p className="text-sm" style={{ color: "var(--text-mid)" }}>
                Accesos principales para continuar con la gestión diaria.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/productos" className="p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
              <p className="font-bold text-sm mb-1">Inventario</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-mid)" }}>
                Revisa productos, stock y alertas de reposición.
              </p>
            </a>

            <a href="/usuarios" className="p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
              <p className="font-bold text-sm mb-1">Usuarios</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-mid)" }}>
                Administra cuentas del personal del sistema.
              </p>
            </a>

            <a href="/admin" className="p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
              <p className="font-bold text-sm mb-1">Administración</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-mid)" }}>
                Configura módulos y accesos administrativos.
              </p>
            </a>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FaArrowTrendUp className="text-lg" />
            </div>

            <div>
              <h3
                className="text-lg font-extrabold"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Estado del sistema
              </h3>
              <p className="text-sm" style={{ color: "var(--text-mid)" }}>
                Módulos disponibles actualmente.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {["Autenticación", "Usuarios", "Productos", "Categorías"].map((modulo) => (
              <div key={modulo} className="flex items-center justify-between text-sm">
                <span className="font-semibold">{modulo}</span>
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                  Activo
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}