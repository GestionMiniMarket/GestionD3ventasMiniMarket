import { useEffect, useMemo, useState } from "react";
import { getProductos } from "../services/productosService";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarProductos = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getProductos();
      setProductos(res.data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la lista de productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return productos.filter((producto) => {
      return (
        producto.nombre?.toLowerCase().includes(texto) ||
        producto.categoria?.toLowerCase().includes(texto)
      );
    });
  }, [productos, busqueda]);

  const esStockBajo = (producto) => {
    return Number(producto.stock) <= Number(producto.stock_minimo);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h2
            className="text-2xl font-extrabold"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Productos
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
            Gestión de inventario del minimarket
          </p>
        </div>

        <button className="btn-primary" type="button">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo producto
        </button>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3
              className="text-xl font-extrabold mb-1"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              Inventario de productos
            </h3>
            <p className="text-sm" style={{ color: "var(--text-mid)" }}>
              Busca productos por nombre o categoría.
            </p>
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              className="input-field"
              placeholder="Buscar producto o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm" style={{ color: "var(--text-mid)" }}>
            Cargando productos...
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="p-6 text-sm" style={{ color: "var(--text-mid)" }}>
            No se encontraron productos.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="px-6 py-4 font-bold">Producto</th>
                  <th className="px-6 py-4 font-bold">Categoría</th>
                  <th className="px-6 py-4 font-bold">Precio</th>
                  <th className="px-6 py-4 font-bold">Stock</th>
                  <th className="px-6 py-4 font-bold">Stock mínimo</th>
                  <th className="px-6 py-4 font-bold">Estado</th>
                </tr>
              </thead>

              <tbody>
                {productosFiltrados.map((producto) => (
                  <tr key={producto.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-6 py-4 font-semibold">{producto.nombre}</td>
                    <td className="px-6 py-4">{producto.categoria}</td>
                    <td className="px-6 py-4">S/ {Number(producto.precio).toFixed(2)}</td>
                    <td className="px-6 py-4">{producto.stock}</td>
                    <td className="px-6 py-4">{producto.stock_minimo}</td>
                    <td className="px-6 py-4">
                      {esStockBajo(producto) ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          Stock bajo
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          Disponible
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}