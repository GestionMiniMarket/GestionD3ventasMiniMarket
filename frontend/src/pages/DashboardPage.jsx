import { useEffect, useState } from "react";
import {
  FaBasketShopping,
  FaBoxesStacked,
  FaTriangleExclamation,
  FaChartLine,
  FaArrowTrendUp,
  FaCashRegister,
} from "react-icons/fa6";
import { getDashboardReporte } from "../services/reportesService";

const formatearSoles = (valor) => {
  const numero = Number(valor || 0);

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(numero);
};

export default function Dashboard() {
  const rol = localStorage.getItem("rol");

  const [resumen, setResumen] = useState({
    ventas_hoy: 0,
    ingresos_hoy: 0,
    total_productos: 0,
    productos_stock_bajo: 0,
    cajas_activas: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarResumen = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getDashboardReporte();
      setResumen(res.data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el resumen del dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarResumen();
  }, []);

  const indicadores = [
    {
      titulo: "Ingresos de hoy",
      valor: formatearSoles(resumen.ingresos_hoy),
      detalle: `${resumen.ventas_hoy} ventas registradas hoy`,
      icono: FaCashRegister,
      color: "#15803d",
      fondo: "#dcfce7",
    },
    {
      titulo: "Productos activos",
      valor: resumen.total_productos,
      detalle: "Productos disponibles en el Inventario",
      icono: FaBoxesStacked,
      color: "#2563eb",
      fondo: "#dbeafe",
    },
    {
      titulo: "Stock bajo",
      valor: resumen.productos_stock_bajo,
      detalle: "Productos que requieren reposición",
      icono: FaTriangleExclamation,
      color: "#b45309",
      fondo: "#fef3c7",
    },
    {
      titulo: "Cajas abiertas",
      valor: resumen.cajas_activas,
      detalle: "Cajas activas",
      icono: FaBasketShopping,
      color: "#7c3aed",
      fondo: "#f3e8ff",
    },
  ];

  const accesos = [
    {
      titulo: "Productos",
      detalle: "Gestiona productos, precios, descripción y categorías.",
      ruta: "/productos",
      visible: rol === "Administrador",
    },
    {
      titulo: "Inventario",
      detalle: "Controla stock, stock mínimo y alertas de reposición.",
      ruta: "/inventario",
      visible: rol === "Administrador",
    },
    {
      titulo: "Punto de venta",
      detalle: "Registra ventas y descuenta stock automáticamente.",
      ruta: "/cajero",
      visible: rol === "Administrador" || rol === "Cajero",
    },
    {
      titulo: "Caja",
      detalle: "Abre caja, registra egresos y solicita cierres.",
      ruta: "/caja",
      visible: rol === "Administrador" || rol === "Cajero",
    },
    {
      titulo: "Usuarios",
      detalle: "Administra cuentas, permisos y roles del personal.",
      ruta: "/usuarios",
      visible: rol === "Administrador",
    },
    {
      titulo: "Reportes",
      detalle: "Consulta ventas, productos vendidos y rotación.",
      ruta: "/reportes",
      visible: rol === "Administrador" || rol === "Supervisor",
    },
  ];

  const modulos = [
    "Autenticación",
    "Usuarios",
    "Productos",
    "Inventario",
    "Caja",
    "Ventas",
    "Reportes",
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
            Resumen operativo en tiempo real del minimarket.
          </p>
        </div>

        <button
          type="button"
          onClick={cargarResumen}
          className="text-sm font-semibold px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50"
        >
          {loading ? "Actualizando..." : "Actualizar datos"}
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

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
                    {loading ? "..." : item.valor}
                  </h3>

                  <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--text-mid)" }}>
                    {loading ? "Cargando información..." : item.detalle}
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
              <FaChartLine className="text-lg" />
            </div>

            <div>
              <h3
                className="text-lg font-extrabold"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Accesos operativos
              </h3>
              <p className="text-sm" style={{ color: "var(--text-mid)" }}>
                Módulos disponibles según el rol actual.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accesos
              .filter((acceso) => acceso.visible)
              .map((acceso) => (
                <a
                  key={acceso.titulo}
                  href={acceso.ruta}
                  className="p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <p className="font-bold text-sm mb-1">{acceso.titulo}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-mid)" }}>
                    {acceso.detalle}
                  </p>
                </a>
              ))}
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
            {modulos.map((modulo) => (
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