import { useEffect, useMemo, useState } from "react";
import {
  FaClipboardCheck,
  FaRotateRight,
  FaCashRegister,
  FaCircleCheck,
} from "react-icons/fa6";
import { confirmarCierre, listarCajas } from "../services/cajasService";

const formatearSoles = (valor) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(Number(valor || 0));
};

export default function Supervisor() {
  const [cajas, setCajas] = useState([]);
  const [observaciones, setObservaciones] = useState({});
  const [loading, setLoading] = useState(true);
  const [confirmando, setConfirmando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [modalCierre, setModalCierre] = useState(null);

  const cargarCajas = async () => {
    setLoading(true);
    setError("");
    setMensaje("");

    try {
      const res = await listarCajas();
      setCajas(res.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las cajas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCajas();
  }, []);

  const cierresPendientes = useMemo(() => {
    return cajas.filter((caja) => caja.estado === "esperando_cierre");
  }, [cajas]);

  const cajasCerradas = useMemo(() => {
    return cajas.filter((caja) => caja.estado === "cerrada").slice(0, 5);
  }, [cajas]);

  const abrirModalCierre = (caja) => {
    setError("");
    setMensaje("");
    setModalCierre(caja);
  };

  const cerrarModalCierre = () => {
    if (confirmando) return;
    setModalCierre(null);
  };

  const confirmarCierreModal = async () => {
    if (!modalCierre) return;

    const id = modalCierre.id;

    try {
      setConfirmando(id);

      await confirmarCierre(id, observaciones[id] || "");

      setMensaje("Caja cerrada correctamente.");
      setObservaciones((prev) => ({
        ...prev,
        [id]: "",
      }));
      setModalCierre(null);

      await cargarCajas();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.mensaje || "No se pudo confirmar el cierre.");
    } finally {
      setConfirmando(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 mb-3">
            Supervisión
          </span>

          <h2
            className="text-2xl font-extrabold"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Control de cierres de caja
          </h2>

          <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
            Revisa solicitudes de cierre, descuadres y confirma cajas del día.
          </p>
        </div>

        <button
          type="button"
          onClick={cargarCajas}
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

      {mensaje && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm">
          {mensaje}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text-mid)" }}>
                Pendientes
              </p>
              <h3 className="text-2xl font-extrabold mt-2">
                {cierresPendientes.length}
              </h3>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-yellow-50 text-yellow-700 flex items-center justify-center">
              <FaClipboardCheck />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text-mid)" }}>
                Cajas registradas
              </p>
              <h3 className="text-2xl font-extrabold mt-2">
                {cajas.length}
              </h3>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FaCashRegister />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text-mid)" }}>
                Cerradas recientes
              </p>
              <h3 className="text-2xl font-extrabold mt-2">
                {cajasCerradas.length}
              </h3>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center">
              <FaCircleCheck />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h3 className="text-lg font-extrabold mb-1">Cierres pendientes</h3>
        <p className="text-sm mb-5" style={{ color: "var(--text-mid)" }}>
          Cajas enviadas por cajeros esperando confirmación.
        </p>

        {loading ? (
          <p className="text-sm" style={{ color: "var(--text-mid)" }}>
            Cargando cajas...
          </p>
        ) : cierresPendientes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center">
            <p className="text-sm font-semibold" style={{ color: "var(--text-mid)" }}>
              No hay cierres pendientes por confirmar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cierresPendientes.map((caja) => (
              <div
                key={caja.id}
                className="rounded-2xl border border-gray-100 p-5 bg-white"
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">Caja</p>
                    <p className="font-extrabold">#{caja.id}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">Cajero</p>
                    <p className="font-bold">{caja.cajero}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">Contado</p>
                    <p className="font-bold">{formatearSoles(caja.efectivo_contado)}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">Diferencia</p>
                    <p
                      className={`font-extrabold ${
                        Number(caja.diferencia) === 0
                          ? "text-green-700"
                          : Number(caja.diferencia) > 0
                          ? "text-blue-700"
                          : "text-red-700"
                      }`}
                    >
                      {formatearSoles(caja.diferencia)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">Estado</p>
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700">
                      Esperando cierre
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
                  <input
                    className="input-field w-full"
                    placeholder="Observaciones del cierre"
                    value={observaciones[caja.id] || ""}
                    onChange={(e) =>
                      setObservaciones((prev) => ({
                        ...prev,
                        [caja.id]: e.target.value,
                      }))
                    }
                  />

                  <button
                    type="button"
                    onClick={() => abrirModalCierre(caja)}
                    disabled={confirmando === caja.id}
                    className="btn-primary px-5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {confirmando === caja.id ? "Confirmando..." : "Confirmar cierre"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-extrabold mb-1">Cajas cerradas recientes</h3>
        <p className="text-sm mb-5" style={{ color: "var(--text-mid)" }}>
          Últimos cierres confirmados por supervisión.
        </p>

        {cajasCerradas.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-mid)" }}>
            Aún no hay cajas cerradas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="py-3 font-bold">Caja</th>
                  <th className="py-3 font-bold">Cajero</th>
                  <th className="py-3 font-bold">Contado</th>
                  <th className="py-3 font-bold">Diferencia</th>
                  <th className="py-3 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {cajasCerradas.map((caja) => (
                  <tr key={caja.id} className="border-b border-gray-50">
                    <td className="py-3">#{caja.id}</td>
                    <td className="py-3">{caja.cajero}</td>
                    <td className="py-3">{formatearSoles(caja.efectivo_contado)}</td>
                    <td className="py-3">{formatearSoles(caja.diferencia)}</td>
                    <td className="py-3">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                        Cerrada
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalCierre && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrarModalCierre();
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center mb-4">
              <FaClipboardCheck className="w-5 h-5" />
            </div>

            <h3
              className="text-lg font-extrabold mb-1"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              ¿Confirmar cierre de caja?
            </h3>

            <p className="text-sm mb-4" style={{ color: "var(--text-mid)" }}>
              ¿Estás seguro de que deseas confirmar el cierre de la caja{" "}
              <strong>#{modalCierre.id}</strong>? Esta acción cambiará el estado
              de la caja a cerrada.
            </p>

            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm mb-6 space-y-2">
              <p>
                <strong>Cajero:</strong> {modalCierre.cajero}
              </p>
              <p>
                <strong>Efectivo contado:</strong>{" "}
                {formatearSoles(modalCierre.efectivo_contado)}
              </p>
              <p>
                <strong>Diferencia:</strong> {formatearSoles(modalCierre.diferencia)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="btn-secondary flex-1"
                type="button"
                onClick={cerrarModalCierre}
                disabled={confirmando === modalCierre.id}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarCierreModal}
                disabled={confirmando === modalCierre.id}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-purple-600 hover:bg-purple-700 transition-all disabled:opacity-60"
              >
                {confirmando === modalCierre.id ? "Confirmando..." : "Sí, confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}