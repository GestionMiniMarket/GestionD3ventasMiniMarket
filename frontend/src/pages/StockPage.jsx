import { useEffect, useMemo, useState } from "react";
import {
  ajustarStock,
  agregarStock,
  getInventario,
  getStockBajoInventario,
} from "../services/inventarioService";
import {
  FaBoxesStacked,
  FaTriangleExclamation,
  FaPlus,
  FaSliders,
} from "react-icons/fa6";

export default function StockPage() {
  const [inventario, setInventario] = useState([]);
  const [stockBajoIds, setStockBajoIds] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [stockExacto, setStockExacto] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cargarInventario = async () => {
    setLoading(true);
    setError("");

    try {
      const [inventarioRes, stockBajoRes] = await Promise.all([
        getInventario(),
        getStockBajoInventario(),
      ]);

      setInventario(inventarioRes.data);
      setStockBajoIds(stockBajoRes.data.map((producto) => producto.id));
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el inventario.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  const inventarioFiltrado = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return inventario.filter((producto) => {
      return (
        producto.nombre?.toLowerCase().includes(texto) ||
        producto.categoria?.toLowerCase().includes(texto)
      );
    });
  }, [inventario, busqueda]);

  const abrirAgregarStock = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad("");
    setModal("agregar");
  };

  const abrirAjustarStock = (producto) => {
    setProductoSeleccionado(producto);
    setStockExacto(producto.stock);
    setStockMinimo(producto.stock_minimo);
    setModal("ajustar");
  };

  const cerrarModal = () => {
    setModal(false);
    setProductoSeleccionado(null);
    setCantidad("");
    setStockExacto("");
    setStockMinimo("");
  };

  const guardarAgregarStock = async (e) => {
    e.preventDefault();

    if (!cantidad || Number(cantidad) <= 0) {
      setError("La cantidad a agregar debe ser mayor a 0.");
      return;
    }

    setGuardando(true);
    setError("");

    try {
      await agregarStock(productoSeleccionado.id, Number(cantidad));
      cerrarModal();
      await cargarInventario();
    } catch (err) {
      console.error(err);
      setError("No se pudo agregar stock.");
    } finally {
      setGuardando(false);
    }
  };

  const guardarAjusteStock = async (e) => {
    e.preventDefault();

    if (stockExacto === "" || Number(stockExacto) < 0) {
      setError("El stock debe ser un número válido.");
      return;
    }

    setGuardando(true);
    setError("");

    try {
      await ajustarStock(productoSeleccionado.id, {
        stock: Number(stockExacto),
        stock_minimo: Number(stockMinimo || 5),
      });

      cerrarModal();
      await cargarInventario();
    } catch (err) {
      console.error(err);
      setError("No se pudo ajustar el stock.");
    } finally {
      setGuardando(false);
    }
  };

  const esStockBajo = (producto) => {
    return stockBajoIds.includes(producto.id);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 mb-3">
            Control de inventario
          </span>

          <h2 className="text-2xl font-extrabold">
            Inventario
          </h2>

          <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
            Gestiona el stock actual, stock mínimo y alertas de reposición.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FaBoxesStacked />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text-mid)" }}>
                Productos activos
              </p>
              <p className="text-2xl font-extrabold">{inventario.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center">
              <FaTriangleExclamation />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text-mid)" }}>
                Stock bajo
              </p>
              <p className="text-2xl font-extrabold">{stockBajoIds.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <p className="text-sm font-bold mb-2" style={{ color: "var(--text-mid)" }}>
            Buscar producto
          </p>
          <input
            type="text"
            className="input-field"
            placeholder="Buscar por nombre o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
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
            Cargando inventario...
          </div>
        ) : inventarioFiltrado.length === 0 ? (
          <div className="p-6 text-sm" style={{ color: "var(--text-mid)" }}>
            No se encontraron productos en inventario.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="px-6 py-4 font-bold">Producto</th>
                  <th className="px-6 py-4 font-bold">Categoría</th>
                  <th className="px-6 py-4 font-bold">Stock</th>
                  <th className="px-6 py-4 font-bold">Stock mínimo</th>
                  <th className="px-6 py-4 font-bold">Estado</th>
                  <th className="px-6 py-4 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {inventarioFiltrado.map((producto) => {
                  const bajo = esStockBajo(producto);

                  return (
                    <tr
                      key={producto.id}
                      className={`border-b border-gray-100 last:border-b-0 ${
                        bajo ? "bg-red-50/60" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold">{producto.nombre}</td>
                      <td className="px-6 py-4">{producto.categoria}</td>
                      <td className="px-6 py-4 font-bold">{producto.stock}</td>
                      <td className="px-6 py-4">{producto.stock_minimo}</td>
                      <td className="px-6 py-4">
                        {bajo ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                            Stock bajo
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            Disponible
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => abrirAgregarStock(producto)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            <FaPlus className="text-xs" />
                            Agregar stock
                          </button>

                          <button
                            type="button"
                            onClick={() => abrirAjustarStock(producto)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100"
                          >
                            <FaSliders className="text-xs" />
                            Ajustar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="mb-5">
              <h3 className="text-xl font-extrabold">
                {modal === "agregar" ? "Agregar stock" : "Ajustar stock"}
              </h3>
              <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
                {productoSeleccionado?.nombre}
              </p>
            </div>

            {modal === "agregar" ? (
              <form onSubmit={guardarAgregarStock} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Cantidad a agregar
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    placeholder="Ejemplo: 10"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="px-4 py-2 rounded-xl font-bold text-sm border border-gray-200 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>

                  <button type="submit" className="btn-primary" disabled={guardando}>
                    {guardando ? "Guardando..." : "Agregar"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={guardarAjusteStock} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    Stock exacto
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    min="0"
                    value={stockExacto}
                    onChange={(e) => setStockExacto(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">
                    Stock mínimo
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    min="0"
                    value={stockMinimo}
                    onChange={(e) => setStockMinimo(e.target.value)}
                    placeholder="5"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="px-4 py-2 rounded-xl font-bold text-sm border border-gray-200 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>

                  <button type="submit" className="btn-primary" disabled={guardando}>
                    {guardando ? "Guardando..." : "Guardar ajuste"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}