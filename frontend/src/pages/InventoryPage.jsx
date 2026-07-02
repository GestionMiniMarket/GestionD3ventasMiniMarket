import { useEffect, useMemo, useState } from "react";
import {
  createProducto,
  desactivarProducto,
  restaurarProducto,
  getProductos,
  updateProducto,
} from "../services/productosService";
import { getCategorias } from "../services/categoriasService";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa6";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("crear");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(null);
  const [procesandoAccion, setProcesandoAccion] = useState(false);

  const [formProducto, setFormProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
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
        producto.categoria?.toLowerCase().includes(texto) ||
        producto.descripcion?.toLowerCase().includes(texto)
      );
    });
  }, [productos, busqueda]);

  const abrirModalNuevo = () => {
    setModoFormulario("crear");
    setProductoSeleccionado(null);
    setFormProducto({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria_id: "",
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (producto) => {
    setModoFormulario("editar");
    setProductoSeleccionado(producto);
    setFormProducto({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio || "",
      categoria_id: producto.categoria_id || "",
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
    setModoFormulario("crear");
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
    setError("");

    if (Number(formProducto.precio) <= 0) {
      setError("El precio debe ser mayor a 0.");
      return;
    }

    setGuardando(true);

    try {
      const payload = {
        nombre: formProducto.nombre,
        descripcion: formProducto.descripcion,
        precio: Number(formProducto.precio),
        categoria_id: Number(formProducto.categoria_id),
      };

      if (modoFormulario === "editar") {
        await updateProducto(productoSeleccionado.id, payload);
      } else {
        await createProducto(payload);
      }

      cerrarModal();
      await cargarProductos();
    } catch (err) {
      console.error(err);
      const mensaje =
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        "No se pudo guardar el producto.";
      setError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const abrirModalConfirmacion = (tipo, producto) => {
    setError("");
    setMensaje("");
    setModalConfirmacion({ tipo, producto });
  };

  const cerrarModalConfirmacion = () => {
    if (procesandoAccion) return;
    setModalConfirmacion(null);
  };

  const confirmarAccionProducto = async () => {
    if (!modalConfirmacion) return;

    const { tipo, producto } = modalConfirmacion;

    try {
      setProcesandoAccion(true);

      if (tipo === "desactivar") {
        await desactivarProducto(producto.id);
        setMensaje("Producto desactivado correctamente.");
      }

      if (tipo === "reactivar") {
        await restaurarProducto(producto.id);
        setMensaje("Producto reactivado correctamente.");
      }

      setError("");
      setModalConfirmacion(null);
      await cargarProductos();
    } catch (err) {
      console.error(err);
      setError(
        tipo === "desactivar"
          ? "No se pudo desactivar el producto."
          : "No se pudo reactivar el producto."
      );
    } finally {
      setProcesandoAccion(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 mb-3">
            Catálogo comercial
          </span>

          <h2
            className="text-2xl font-extrabold"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Productos
          </h2>

          <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
            Administra la información comercial de los productos del minimarket.
          </p>
        </div>

        <button className="btn-primary" type="button" onClick={abrirModalNuevo}>
          <FaPlus className="text-sm" />
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
              Lista de productos
            </h3>
            <p className="text-sm" style={{ color: "var(--text-mid)" }}>
              Busca por nombre, descripción o categoría.
            </p>
          </div>

          <div className="w-full md:w-96">
            <input
              type="text"
              className="input-field"
              placeholder="Buscar producto..."
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
      {mensaje && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm">
          {mensaje}
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
                  <th className="px-6 py-4 font-bold">Descripción</th>
                  <th className="px-6 py-4 font-bold">Categoría</th>
                  <th className="px-6 py-4 font-bold">Precio</th>
                  <th className="px-6 py-4 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productosFiltrados.map((producto) => (
                  <tr
                    key={producto.id}
                    className={`border-b border-gray-100 last:border-b-0 ${
                      Number(producto.activo) === 0
                        ? "bg-gray-100 opacity-60"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold">
                      {producto.nombre}
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <span style={{ color: "var(--text-mid)" }}>
                        {producto.descripcion || "Sin descripción"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                        {producto.categoria}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      S/ {Number(producto.precio).toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {Number(producto.activo) === 1 ? (
                          <>
                            <button
                              type="button"
                              onClick={() => abrirModalEditar(producto)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              <FaPen className="text-xs" />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => abrirModalConfirmacion("desactivar", producto)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100"
                            >
                              <FaTrash className="text-xs" />
                              Desactivar
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => abrirModalConfirmacion("reactivar", producto)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100"
                          >
                            Reactivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {modalConfirmacion && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrarModalConfirmacion();
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                modalConfirmacion.tipo === "desactivar"
                  ? "bg-red-50 text-red-500"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {modalConfirmacion.tipo === "desactivar" ? (
                <FaTrash className="w-5 h-5" />
              ) : (
                <FaPlus className="w-5 h-5" />
              )}
            </div>

            <h3
              className="text-lg font-extrabold mb-1"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              {modalConfirmacion.tipo === "desactivar"
                ? "¿Confirmar desactivación?"
                : "¿Confirmar reactivación?"}
            </h3>

            <p className="text-sm mb-6" style={{ color: "var(--text-mid)" }}>
              {modalConfirmacion.tipo === "desactivar" ? (
                <>
                  ¿Estás seguro de que deseas desactivar el producto{" "}
                  <strong>{modalConfirmacion.producto?.nombre}</strong>? El producto
                  seguirá visible en gris, pero no podrá venderse.
                </>
              ) : (
                <>
                  ¿Estás seguro de que deseas reactivar el producto{" "}
                  <strong>{modalConfirmacion.producto?.nombre}</strong>? El producto
                  volverá a estar disponible para la venta.
                </>
              )}
            </p>

            <div className="flex gap-3">
              <button
                className="btn-secondary flex-1"
                type="button"
                onClick={cerrarModalConfirmacion}
                disabled={procesandoAccion}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarAccionProducto}
                disabled={procesandoAccion}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-60 ${
                  modalConfirmacion.tipo === "desactivar"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {procesandoAccion
                  ? "Procesando..."
                  : modalConfirmacion.tipo === "desactivar"
                  ? "Sí, desactivar"
                  : "Sí, reactivar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3
                  className="text-xl font-extrabold"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  {modoFormulario === "editar"
                    ? "Editar producto"
                    : "Nuevo producto"}
                </h3>

                <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
                  {modoFormulario === "editar"
                    ? "Actualiza la información comercial del producto."
                    : "Registra un producto. El stock iniciará automáticamente en 0."}
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

              <div>
                <label className="block text-sm font-bold mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  className="input-field"
                  rows="3"
                  value={formProducto.descripcion}
                  onChange={manejarCambio}
                  placeholder="Describe brevemente el producto"
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
                    min="0.01"
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

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-4 py-2 rounded-xl font-bold text-sm border border-gray-200 hover:bg-gray-50"
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-primary" disabled={guardando}>
                  {guardando
                    ? "Guardando..."
                    : modoFormulario === "editar"
                    ? "Guardar cambios"
                    : "Guardar producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}