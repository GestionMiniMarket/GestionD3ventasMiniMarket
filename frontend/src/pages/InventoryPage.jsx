import { useEffect, useMemo, useState } from "react";
import { createProducto, getProductos } from "../services/productosService";
import { getCategorias } from "../services/categoriasService";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formProducto, setFormProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    stock_minimo: "",
    categoria_id: "",
  });

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
  const cargarCategorias = async () => {
    try {
      const res = await getCategorias();
      setCategorias(res.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las categorías.");
    }
  };


  useEffect(() => {
    cargarProductos();
    cargarCategorias();
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
const abrirModalNuevo = () => {
  setFormProducto({
    nombre: "",
    precio: "",
    stock: "",
    stock_minimo: "",
    categoria_id: "",
  });
  setModalAbierto(true);
};

const cerrarModal = () => {
  setModalAbierto(false);
};

const manejarCambio = (e) => {
  const { name, value } = e.target;
  setFormProducto((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const guardarProducto = async (e) => {
  e.preventDefault();
  setGuardando(true);
  setError("");

  try {
    await createProducto({
      nombre: formProducto.nombre,
      precio: Number(formProducto.precio),
      stock: Number(formProducto.stock || 0),
      stock_minimo: Number(formProducto.stock_minimo || 5),
      categoria_id: Number(formProducto.categoria_id),
    });

    cerrarModal();
    await cargarProductos();
  } catch (err) {
    console.error(err);
    const mensaje =
      err.response?.data?.mensaje ||
      err.response?.data?.message ||
      "No se pudo registrar el producto.";
    setError(mensaje);
  } finally {
    setGuardando(false);
  }
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

        <button className="btn-primary" type="button" onClick={abrirModalNuevo}>
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
    {modalAbierto && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-xl font-extrabold" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Nuevo producto
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
            Registra un producto en el inventario.
          </p>
        </div>

        <button
          type="button"
          onClick={cerrarModal}
          className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <form onSubmit={guardarProducto} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="input-field"
            value={formProducto.nombre}
            onChange={manejarCambio}
            placeholder="Ejemplo: Arroz Costeño 1kg"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Precio</label>
            <input
              type="number"
              name="precio"
              className="input-field"
              value={formProducto.precio}
              onChange={manejarCambio}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Categoría</label>
            <select
              name="categoria_id"
              className="input-field"
              value={formProducto.categoria_id}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              className="input-field"
              value={formProducto.stock}
              onChange={manejarCambio}
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Stock mínimo</label>
            <input
              type="number"
              name="stock_minimo"
              className="input-field"
              value={formProducto.stock_minimo}
              onChange={manejarCambio}
              placeholder="5"
              min="0"
            />
          </div>
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
            {guardando ? "Guardando..." : "Guardar producto"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}