import { useEffect, useState } from "react";
import {
  FaChartLine,
  FaRotateRight,
  FaBoxesStacked,
  FaTriangleExclamation,
  FaCashRegister,
} from "react-icons/fa6";
import {
  getDashboardReporte,
  getVentasDiarias,
  getVentasSemanales,
  getProductosMasVendidos,
  getProductosBajaRotacion,
} from "../services/reportesService";

const formatearSoles = (valor) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(Number(valor || 0));

export default function ReportesPage() {
  const [dashboard, setDashboard] = useState(null);
  const [ventasDia, setVentasDia] = useState(null);
  const [ventasSemana, setVentasSemana] = useState([]);
  const [masVendidos, setMasVendidos] = useState([]);
  const [bajaRotacion, setBajaRotacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarReportes = async () => {
    setLoading(true);
    setError("");

    try {
      const [dashRes, diaRes, semanaRes, masVendidosRes, bajaRotacionRes] =
        await Promise.all([
          getDashboardReporte(),
          getVentasDiarias(),
          getVentasSemanales(),
          getProductosMasVendidos(),
          getProductosBajaRotacion(),
        ]);

      setDashboard(dashRes.data);
      setVentasDia(diaRes.data);
      setVentasSemana(semanaRes.data);
      setMasVendidos(masVendidosRes.data);
      setBajaRotacion(bajaRotacionRes.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los reportes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReportes();
  }, []);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 mb-3">
            Reportes
          </span>

          <h2 className="text-2xl font-extrabold">Panel de reportes</h2>

          <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
            Indicadores de ventas, productos y rotación del minimarket.
          </p>
        </div>

        <button
          type="button"
          onClick={cargarReportes}
          className="text-sm font-semibold px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 flex items-center gap-2"
        >
          <FaRotateRight className="text-xs" />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <div className="card p-5">
          <p className="text-sm font-bold" style={{ color: "var(--text-mid)" }}>
            Ingresos hoy
          </p>
          <h3 className="text-2xl font-extrabold mt-2">
            {loading ? "..." : formatearSoles(dashboard?.ingresos_hoy)}
          </h3>
          <p className="text-xs mt-2" style={{ color: "var(--text-mid)" }}>
            {loading ? "Cargando..." : `${dashboard?.ventas_hoy || 0} ventas hoy`}
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm font-bold" style={{ color: "var(--text-mid)" }}>
            Ventas del día
          </p>
          <h3 className="text-2xl font-extrabold mt-2">
            {loading ? "..." : ventasDia?.total_ventas || 0}
          </h3>
          <p className="text-xs mt-2" style={{ color: "var(--text-mid)" }}>
            Efectivo: {formatearSoles(ventasDia?.ingresos_efectivo)} · Tarjeta:{" "}
            {formatearSoles(ventasDia?.ingresos_tarjeta)}
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm font-bold" style={{ color: "var(--text-mid)" }}>
            Productos activos
          </p>
          <h3 className="text-2xl font-extrabold mt-2">
            {loading ? "..." : dashboard?.total_productos || 0}
          </h3>
          <p className="text-xs mt-2" style={{ color: "var(--text-mid)" }}>
            Registrados en catálogo
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm font-bold" style={{ color: "var(--text-mid)" }}>
            Stock bajo
          </p>
          <h3 className="text-2xl font-extrabold mt-2">
            {loading ? "..." : dashboard?.productos_stock_bajo || 0}
          </h3>
          <p className="text-xs mt-2" style={{ color: "var(--text-mid)" }}>
            Productos por reponer
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FaChartLine />
            </div>
            <div>
              <h3 className="text-lg font-extrabold">Ventas de los últimos 7 días</h3>
              <p className="text-sm" style={{ color: "var(--text-mid)" }}>
                Resumen diario de ventas e ingresos.
              </p>
            </div>
          </div>

          {ventasSemana.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-mid)" }}>
              No hay ventas registradas en la última semana.
            </p>
          ) : (
            <div className="space-y-3">
              {ventasSemana.map((item) => {
                const max = Math.max(
                  ...ventasSemana.map((v) => Number(v.ingresos_total || 0)),
                  1
                );
                const porcentaje = (Number(item.ingresos_total || 0) / max) * 100;

                return (
                  <div key={item.dia}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-bold">{item.dia}</span>
                      <span>{formatearSoles(item.ingresos_total)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center">
              <FaCashRegister />
            </div>
            <div>
              <h3 className="text-lg font-extrabold">Resumen diario</h3>
              <p className="text-sm" style={{ color: "var(--text-mid)" }}>
                Ventas según método de pago.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">Ingresos total</span>
              <span>{formatearSoles(ventasDia?.ingresos_total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Efectivo</span>
              <span>{formatearSoles(ventasDia?.ingresos_efectivo)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Tarjeta</span>
              <span>{formatearSoles(ventasDia?.ingresos_tarjeta)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-yellow-50 text-yellow-700 flex items-center justify-center">
              <FaBoxesStacked />
            </div>
            <div>
              <h3 className="text-lg font-extrabold">Productos más vendidos</h3>
              <p className="text-sm" style={{ color: "var(--text-mid)" }}>
                Ranking por cantidad vendida.
              </p>
            </div>
          </div>

          {masVendidos.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-mid)" }}>
              Aún no hay productos vendidos.
            </p>
          ) : (
            <div className="space-y-3">
              {masVendidos.slice(0, 5).map((producto, index) => (
                <div
                  key={producto.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 p-3"
                >
                  <div>
                    <p className="font-bold text-sm">
                      #{index + 1} {producto.nombre}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-mid)" }}>
                      {producto.categoria}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold">{producto.total_vendido}</p>
                    <p className="text-xs" style={{ color: "var(--text-mid)" }}>
                      {formatearSoles(producto.ingresos_generados)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center">
              <FaTriangleExclamation />
            </div>
            <div>
              <h3 className="text-lg font-extrabold">Productos de baja rotación</h3>
              <p className="text-sm" style={{ color: "var(--text-mid)" }}>
                Productos con menor movimiento.
              </p>
            </div>
          </div>

          {bajaRotacion.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-mid)" }}>
              No hay información de rotación disponible.
            </p>
          ) : (
            <div className="space-y-3">
              {bajaRotacion.slice(0, 5).map((producto) => (
                <div
                  key={producto.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 p-3"
                >
                  <div>
                    <p className="font-bold text-sm">{producto.nombre}</p>
                    <p className="text-xs" style={{ color: "var(--text-mid)" }}>
                      {producto.categoria}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold">{producto.total_vendido} vendidos</p>
                    <p className="text-xs" style={{ color: "var(--text-mid)" }}>
                      Stock: {producto.stock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}