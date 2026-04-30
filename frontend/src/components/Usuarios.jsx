import { useState, useEffect } from "react";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../services/usuariosService";

const ROLES = [
  { id: 1, label: "Administrador" },
  { id: 2, label: "Cajero" },
  { id: 3, label: "Supervisor" },
];

const rolBadge = {
  Administrador: "bg-amber-100 text-amber-800",
  Cajero:        "bg-blue-100 text-blue-800",
  Supervisor:    "bg-purple-100 text-purple-800",
};

const emptyForm = { nombre: "", email: "", password: "", rol_id: 2 };

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // Modal
  const [modal, setModal]   = useState(false); // "crear" | "editar" | "eliminar" | false
  const [selected, setSelected] = useState(null);
  const [form, setForm]     = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await getUsuarios();
      console.log(res.data);
      setUsuarios(res.data);
    } catch {
        console.error(error);
      setError("No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const abrirCrear = () => {
    setForm(emptyForm);
    setFormError("");
    setSelected(null);
    setModal("crear");
  };

  const abrirEditar = (u) => {
    setForm({ nombre: u.nombre, email: u.email, password: "", rol_id: u.rol_id || 2 });
    setFormError("");
    setSelected(u);
    setModal("editar");
  };

  const abrirEliminar = (u) => {
    setSelected(u);
    setModal("eliminar");
  };

  const cerrarModal = () => { setModal(false); setSelected(null); };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleGuardar = async () => {
    if (!form.nombre || !form.email) {
      setFormError("Nombre y correo on obligatorios.");
      return;
    }
    if (modal === "crear" && !form.password) {
    setFormError("La contraseña es obligatoria.");
    return;
    }   
    setSaving(true);
    try {
      if (modal === "crear") {
        await createUsuario(form);
        alert("Usuario creado correctamente");
      } else {
        const payload = { nombre: form.nombre, email: form.email, rol_id: Number(form.rol_id) };
        await updateUsuario(selected.id, payload);
        alert("Usuario actualizado correctamente");
      }
      cerrarModal();
      cargarUsuarios();
    } catch (err) {
      setFormError(err.response?.data?.message || "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async () => {
    setSaving(true);
    try {
      await deleteUsuario(selected.id);
      alert("Usuario desactivado correctamente");
      cerrarModal();
      cargarUsuarios();
    } catch {
      setFormError("Error al desactivar el usuario.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Usuarios
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
            Gestión de cuentas del sistema
          </p>
        </div>
        <button className="btn-primary" onClick={abrirCrear}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo usuario
        </button>
      </div>

      {/* Error general */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <svg className="w-6 h-6 animate-spin" style={{ color: "var(--green-brand)" }}
              fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Nombre", "Correo", "Rol", "Fecha registro", "Acciones"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-mid)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-sm" style={{ color: "var(--text-mid)" }}>
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: "var(--green-brand)" }}>
                          {u.nombre[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold" style={{ color: "var(--text-dark)" }}>
                          {u.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: "var(--text-mid)" }}>{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge text-xs ${rolBadge[u.rol] ?? "bg-gray-100 text-gray-700"}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: "var(--text-mid)" }}>
                      {new Date(u.creado_en).toLocaleDateString("es-PE")}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => abrirEditar(u)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: "var(--green-brand)" }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => abrirEliminar(u)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                        >
                          Desactivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

            {/* Modal eliminar */}
            {modal === "eliminar" && (
              <>
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold mb-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  ¿Desactivar usuario?
                </h3>
                <p className="text-sm mb-6" style={{ color: "var(--text-mid)" }}>
                  <strong>{selected?.nombre}</strong> ya no aparecerá en el sistema, pero sus datos
                  se conservarán en la base de datos.
                </p>
                {formError && (
                  <p className="text-sm text-red-600 mb-4">{formError}</p>
                )}
                <div className="flex gap-3">
                  <button className="btn-secondary flex-1" onClick={cerrarModal}>Cancelar</button>
                  <button
                    onClick={handleEliminar}
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-red-600 hover:bg-red-700 transition-all disabled:opacity-60"
                  >
                    {saving ? "Desactivando…" : "Sí, desactivar"}
                  </button>
                </div>
              </>
            )}

            {/* Modal crear / editar */}
            {(modal === "crear" || modal === "editar") && (
              <>
                <h3 className="text-lg font-extrabold mb-5" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  {modal === "crear" ? "Nuevo usuario" : "Editar usuario"}
                </h3>

                {formError && (
                  <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm">
                    {formError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                      style={{ color: "var(--text-mid)" }}>Nombre</label>
                    <input
                      type="text" name="nombre" value={form.nombre}
                      onChange={handleChange} className="input-field" placeholder="Nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                      style={{ color: "var(--text-mid)" }}>Correo</label>
                    <input
                      type="email" name="email" value={form.email}
                      onChange={handleChange} className="input-field" placeholder="correo@ejemplo.com"
                    />
                  </div>

                  {modal === "crear" && (
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                        style={{ color: "var(--text-mid)" }}>Contraseña</label>
                      <input
                        type="password" name="password" value={form.password}
                        onChange={handleChange} className="input-field" placeholder="Mínimo 8 caracteres"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wide"
                      style={{ color: "var(--text-mid)" }}>Rol</label>
                    <div className="grid grid-cols-3 gap-2">
                      {ROLES.map((r) => (
                        <label
                          key={r.id}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                            Number(form.rol_id) === r.id
                              ? "border-green-700 bg-green-50"
                              : "border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <input
                            type="radio" name="rol_id" value={r.id}
                            checked={Number(form.rol_id) === r.id}
                            onChange={handleChange} className="sr-only"
                          />
                          <span className="text-xs font-semibold" style={{
                            color: Number(form.rol_id) === r.id ? "var(--green-brand)" : "var(--text-mid)"
                          }}>{r.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="btn-secondary flex-1" onClick={cerrarModal}>Cancelar</button>
                  <button
                    onClick={handleGuardar}
                    disabled={saving}
                    className="btn-primary flex-1 disabled:opacity-60"
                  >
                    {saving ? "Guardando…" : modal === "crear" ? "Crear usuario" : "Guardar cambios"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}