import { useState, useEffect } from "react";
import {
  abrirCaja,
  getResumenCaja,
  registrarEgreso,
  solicitarCierre,
} from "../services/cajasService";

export default function CajaPage() {
  const [montoInicial, setMontoInicial] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumen, setResumen] = useState(null);
  const [cajaAbierta, setCajaAbierta] = useState(false);

  const [motivo, setMotivo] = useState("");
  const [montoEgreso, setMontoEgreso] = useState("");
  const [mostrarEgreso, setMostrarEgreso] = useState(false);

  const [efectivoContado, setEfectivoContado] = useState("");
  const [resultadoCierre, setResultadoCierre] = useState(null);

  const cargarResumen = async () => {
    try {
      const res = await getResumenCaja();
      setResumen(res.data);
      setCajaAbierta(true);
    } catch {
      setResumen(null);
      setCajaAbierta(false);
    }
  };

  useEffect(() => {
    cargarResumen();
  }, []);

  const handleAbrirCaja = async () => {
    setMensaje("");
    setError("");

    if (!montoInicial || Number(montoInicial) <= 0) {
      setError("Ingrese un monto inicial válido.");
      return;
    }

    try {
      setLoading(true);
    
      const res = await abrirCaja(Number(montoInicial));

      setMensaje(res.data.mensaje);
      setMontoInicial("");
      setResultadoCierre(null);
      await cargarResumen();
    } catch (err) {
      setError(err.response?.data?.mensaje || "No fue posible abrir la caja.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegistrarEgreso = async () => {
    setMensaje("");
    setError("");

    if (!motivo || !montoEgreso || Number(montoEgreso) <= 0) {
      setError("Complete correctamente los datos del egreso.");
      return;
    }

    if (!window.confirm("¿Desea registrar este egreso?")) {
        return;
    }

    try {
      await registrarEgreso({
        motivo,
        monto: Number(montoEgreso),
      });

      setMensaje("Egreso registrado correctamente.");
      setMotivo("");
      setMontoEgreso("");
      setMostrarEgreso(false);

      await cargarResumen();
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al registrar egreso.");
    }
  };



  const handleSolicitarCierre = async () => {
    setMensaje("");
    setError("");

    if (!efectivoContado || Number(efectivoContado) < 0) {
      setError("Ingrese el efectivo contado.");
      return;
    }

    if (!window.confirm("¿Desea solicitar el cierre de caja?")) {
        return;
    }

    try {
      const res = await solicitarCierre(Number(efectivoContado));

      setResultadoCierre(res.data);
      setMensaje(res.data.mensaje);
      setEfectivoContado("");

      await cargarResumen();
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo solicitar el cierre.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Gestión de Caja
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
          Apertura, control y cierre de caja.
        </p>
        <div className="mt-4">
            {cajaAbierta ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                    🟢 Caja abierta
                </span>
            ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                    🔴 Sin caja abierta
                </span>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4">Abrir caja</h3>

          <input
            type="number"
            placeholder="Monto inicial"
            className={`input-field w-full mb-4 ${
                cajaAbierta ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            value={montoInicial}
            onChange={(e) => setMontoInicial(e.target.value)}
            disabled={cajaAbierta}
          />

          <button onClick={handleAbrirCaja} disabled={loading || cajaAbierta} className={`w-full ${
                cajaAbierta
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "btn-primary"
            }`}>
            {loading
            ? "Abriendo..."
            : cajaAbierta
            ? "Caja abierta"
            : "Abrir caja"}
          </button>

          {mensaje && <div className="mt-4 text-green-600 text-sm font-semibold">{mensaje}</div>}
          {error && <div className="mt-4 text-red-600 text-sm font-semibold">{error}</div>}
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4">Resumen de caja</h3>

          {resumen ? (
            <div className="space-y-2 text-sm">
              <p><strong>Monto inicial:</strong> S/ {resumen.monto_inicial}</p>
              <p><strong>Ventas efectivo:</strong> S/ {resumen.ventas_efectivo}</p>
              <p><strong>Ventas tarjeta:</strong> S/ {resumen.ventas_tarjeta}</p>
              <p><strong>Egresos:</strong> S/ {resumen.total_egresos}</p>

              <hr className="my-3" />

              <p className="font-bold text-green-700">
                Efectivo esperado: S/ {resumen.efectivo_esperado}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay una caja abierta.</p>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4">Cierre</h3>

          <button
            onClick={() => setMostrarEgreso(!mostrarEgreso)}
            disabled={!cajaAbierta}
            className={`w-full mb-3 ${
                cajaAbierta
                    ? "btn-primary"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Registrar egreso
          </button>

          {mostrarEgreso && (
            <div className="mb-4 space-y-3">
              <input
                className="input-field w-full"
                placeholder="Motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />

              <input
                className="input-field w-full"
                type="number"
                placeholder="Monto"
                value={montoEgreso}
                onChange={(e) => setMontoEgreso(e.target.value)}
              />

              <button onClick={handleRegistrarEgreso} className="btn-primary w-full">
                Guardar egreso
              </button>
            </div>
          )}

          <input
            type="number"
            placeholder="Efectivo contado"
            className="input-field w-full mb-3"
            value={efectivoContado}
            disabled={!cajaAbierta}
            onChange={(e) => setEfectivoContado(e.target.value)}
          />

          <button onClick={handleSolicitarCierre} 
          disabled={!cajaAbierta} 
          className={`w-full ${
                cajaAbierta
                    ? "btn-primary"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}>
            Solicitar cierre
          </button>

          {resultadoCierre && (
            <div className="mt-5 text-sm space-y-2">
              <p><strong>Efectivo esperado:</strong> S/ {resultadoCierre.efectivo_esperado}</p>
              <p><strong>Efectivo contado:</strong> S/ {resultadoCierre.efectivo_contado}</p>
              <p><strong>Diferencia:</strong> S/ {resultadoCierre.diferencia}</p>

              <div
                className={`font-bold ${
                  resultadoCierre.estado === "Sin descuadre"
                    ? "text-green-600"
                    : resultadoCierre.estado === "Sobrante"
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                {resultadoCierre.estado}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}