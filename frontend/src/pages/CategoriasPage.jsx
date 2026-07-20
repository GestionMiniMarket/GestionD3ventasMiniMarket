import { useEffect, useMemo, useState } from "react";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categoriasService";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa6";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("crear");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [nombreForm, setNombreForm] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [modalEliminar, setModalEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarCategorias = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCategorias();
      setCategorias(res.data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la lista de categorías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const categoriasFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    return categorias.filter((c) => c.nombre?.toLowerCase().includes(texto));
  }, [categorias, busqueda]);

  // Validación en el propio cliente: no permitir nombres duplicados
  // sin importar mayúsculas/minúsculas, antes de llamar al backend.
  const existeNombreDuplicado = (nombre, idExcluir = null) => {
    const nombreNormalizado = nombre.trim().toLowerCase();
    return categorias.some(
      (c) =>
        c.nombre.trim().toLowerCase() === nombreNormalizado &&
        c.id !== idExcluir
    );
  };

  const abrirModalNuevo = () => {
    setModoFormulario("crear");
    setCategoriaSeleccionada(null);
    setNombreForm("");
    setError("");
    setModalAbierto(true);
  };

  const abrirModalEditar = (categoria) => {
    setModoFormulario("editar");
    setCategoriaSeleccionada(categoria);
    setNombreForm(categoria.nombre);
    setError("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaSeleccionada(null);
    setNombreForm("");
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();
    setError("");

    const nombreLimpio = nombreForm.trim();

    if (!nombreLimpio) {
      setError("El nombre es requerido");
      return;
    }

    const idExcluir =
      modoFormulario === "editar" ? categoriaSeleccionada?.id : null;

    if (existeNombreDuplicado(nombreLimpio, idExcluir)) {
      setError("Ya existe una categoría con ese nombre");
      return;
    }

    setGuardando(true);

    try {
      if (modoFormulario === "editar") {
        await updateCategoria(categoriaSeleccionada.id, { nombre: nombreLimpio });
        setMensaje("Categoría actualizada correctamente.");
      } else {
        await createCategoria({ nombre: nombreLimpio });
        setMensaje("Categoría creada correctamente.");
      }

      cerrarModal();
      await cargarCategorias();
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        "No se pudo guardar la categoría.";
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  const abrirModalEliminar = (categoria) => {
    setError("");
    setMensaje("");
    setModalEliminar(categoria);
  };

  const cerrarModalEliminar = () => {
    if (eliminando) return;
    setModalEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!modalEliminar) return;

    try {
      setEliminando(true);
      await deleteCategoria(modalEliminar.id);
      setMensaje("Categoría eliminada correctamente.");
      setError("");
      setModalEliminar(null);
      await cargarCategorias();
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        "No se pudo eliminar la categoría.";
      setError(msg);
      setModalEliminar(null);
    } finally {
      setEliminando(false);
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
            Categorías
          </h2>

          <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
            Administra las categorías de productos del minimarket.
          </p>
        </div>

        <button className="btn-primary" type="button" onClick={abrirModalNuevo}>
          <FaPlus className="text-sm" />
          Nueva categoría
        </button>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3
              className="text-xl font-extrabold mb-1"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              Lista de categorías
            </h3>
            <p className="text-sm" style={{ color: "var(--text-mid)" }}>
              Busca por nombre.
            </p>
          </div>

          <div className="w-full md:w-96">
            <input
              type="text"
              className="input-field"
              placeholder="Buscar categoría..."
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
            Cargando categorías...
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="p-6 text-sm" style={{ color: "var(--text-mid)" }}>
            No se encontraron categorías.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="px-6 py-4 font-bold">Categoría</th>
                  <th className="px-6 py-4 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {categoriasFiltradas.map((categoria) => (
                  <tr
                    key={categoria.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-semibold">
                      {categoria.nombre}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => abrirModalEditar(categoria)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <FaPen className="text-xs" />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => abrirModalEliminar(categoria)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100"
                        >
                          <FaTrash className="text-xs" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal confirmar eliminación */}
      {modalEliminar && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrarModalEliminar();
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-red-50 text-red-500">
              <FaTrash className="w-5 h-5" />
            </div>

            <h3
              className="text-lg font-extrabold mb-1"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              ¿Confirmar eliminación?
            </h3>

            <p className="text-sm mb-6" style={{ color: "var(--text-mid)" }}>
              ¿Estás seguro de que deseas eliminar la categoría{" "}
              <strong>{modalEliminar?.nombre}</strong>? Si hay productos
              asociados a esta categoría, la eliminación podría fallar.
            </p>

            <div className="flex gap-3">
              <button
                className="btn-secondary flex-1"
                type="button"
                onClick={cerrarModalEliminar}
                disabled={eliminando}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarEliminar}
                disabled={eliminando}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all disabled:opacity-60 bg-red-600 hover:bg-red-700"
              >
                {eliminando ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal crear/editar */}
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
                    ? "Editar categoría"
                    : "Nueva categoría"}
                </h3>

                <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
                  {modoFormulario === "editar"
                    ? "Actualiza el nombre de la categoría."
                    : "Registra una nueva categoría de productos."}
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

            <form noValidate onSubmit={guardarCategoria} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Nombre</label>
                <input
                  type="text"
                  className="input-field"
                  value={nombreForm}
                  onChange={(e) => setNombreForm(e.target.value)}
                  placeholder="Ejemplo: Bebidas"
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
                  {guardando
                    ? "Guardando..."
                    : modoFormulario === "editar"
                    ? "Guardar cambios"
                    : "Guardar categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}