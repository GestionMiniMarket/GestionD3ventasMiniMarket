import { useEffect, useMemo, useState } from "react";
import {
  FaBasketShopping,
  FaMagnifyingGlass,
  FaPlus,
  FaMoneyBillWave,
  FaCreditCard,
} from "react-icons/fa6";
import { getProductos } from "../services/productosService";
import { registrarVenta } from "../services/ventasService";
import { getResumenCaja } from "../services/cajasService";

const formatearSoles = (valor) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(Number(valor || 0));

export default function Cajero() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [cajaId, setCajaId] = useState(null);
  const [registrando, setRegistrando] = useState(false);
  const [modalVentaAbierto, setModalVentaAbierto] = useState(false);

  const cargarProductos = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getProductos();
      setProductos(res.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  const cargarCajaActiva = async () => {
    try {
      const res = await getResumenCaja();
      setCajaId(res.data.caja_id);
    } catch {
      setCajaId(null);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCajaActiva();
  }, []);

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return productos.filter(
      (producto) =>
        producto.nombre?.toLowerCase().includes(texto) ||
        producto.categoria?.toLowerCase().includes(texto)
    );
  }, [productos, busqueda]);

  const agregarAlCarrito = (producto) => {
    setError("");
    setMensaje("");

    const productoActivo =
      producto.activo === undefined || Number(producto.activo) === 1;
    const stock = Number(producto.stock || 0);

    if (!productoActivo) {
      setError("Este producto está desactivado y no puede venderse.");
      return;
    }

    if (stock <= 0) {
      setError("Este producto no tiene stock disponible.");
      return;
    }

    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);

      if (existe) {
        if (existe.cantidad >= stock) {
          setError("No puedes agregar más unidades que el stock disponible.");
          return prev;
        }

        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const aumentarCantidad = (id) => {
    setError("");

    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (item.cantidad >= Number(item.stock || 0)) {
          setError("No puedes vender más unidades que el stock disponible.");
          return item;
        }

        return { ...item, cantidad: item.cantidad + 1 };
      })
    );
  };

  const disminuirCantidad = (id) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const totalVenta = carrito.reduce(
    (total, item) => total + Number(item.precio) * item.cantidad,
    0
  );

  const handleRegistrarVenta = () => {
    setError("");
    setMensaje("");

    if (!cajaId) {
      setError("Debe existir una caja abierta para registrar ventas.");
      return;
    }

    if (carrito.length === 0) {
      setError("Agrega al menos un producto a la venta.");
      return;
    }

    const sinStock = carrito.find(
      (item) => item.cantidad > Number(item.stock || 0)
    );

    if (sinStock) {
      setError(`No hay stock suficiente para ${sinStock.nombre}.`);
      return;
    }

    setModalVentaAbierto(true);
  };

  const cerrarModalVenta = () => {
    if (registrando) return;
    setModalVentaAbierto(false);
  };

  const confirmarVenta = async () => {
    setError("");
    setMensaje("");

    try {
      setRegistrando(true);

      const payload = {
        caja_id: cajaId,
        metodo_pago: metodoPago,
        productos: carrito.map((item) => ({
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: Number(item.precio),
        })),
      };

      const res = await registrarVenta(payload);

      setMensaje(`${res.data.mensaje}. Total: ${formatearSoles(res.data.total)}`);
      setCarrito([]);
      setModalVentaAbierto(false);

      await cargarProductos();
      await cargarCajaActiva();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.mensaje || "No se pudo registrar la venta.");
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 mb-3">
            Punto de venta
          </span>

          <h2 className="text-2xl font-extrabold">Registro de venta</h2>

          <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
            Selecciona productos, arma la venta y registra el pago del cliente.
          </p>
        </div>

        <button
          type="button"
          onClick={cargarProductos}
          className="text-sm font-semibold px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50"
        >
          Actualizar productos
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FaBasketShopping className="text-lg" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold">Productos disponibles</h3>
              <p className="text-sm" style={{ color: "var(--text-mid)" }}>
                Busca productos por nombre o categoría.
              </p>
            </div>
          </div>

          <div className="relative mb-5">
            <FaMagnifyingGlass className="absolute left-4 top-3.5 text-gray-400 text-sm" />
            <input
              type="text"
              className="input-field w-full pl-10"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-sm" style={{ color: "var(--text-mid)" }}>
              Cargando productos...
            </p>
          ) : productosFiltrados.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-mid)" }}>
              No se encontraron productos.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productosFiltrados.map((producto) => {
                const productoActivo =
                  producto.activo === undefined || Number(producto.activo) === 1;
                const tieneStock = Number(producto.stock || 0) > 0;

                return (
                  <div
                    key={producto.id}
                    className={`border rounded-2xl p-4 transition-all ${
                      !productoActivo
                        ? "bg-gray-100 border-gray-200 opacity-70"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-sm">{producto.nombre}</p>

                        <p className="text-xs mt-1" style={{ color: "var(--text-mid)" }}>
                          {producto.categoria}
                        </p>

                        <p className="text-xs mt-1" style={{ color: "var(--text-mid)" }}>
                          Stock: {producto.stock}
                        </p>

                        {!productoActivo && (
                          <p className="text-xs font-bold text-red-600 mt-1">
                            Producto desactivado
                          </p>
                        )}

                        {productoActivo && !tieneStock && (
                          <p className="text-xs font-bold text-amber-600 mt-1">
                            Sin stock
                          </p>
                        )}

                        <p className="text-sm font-extrabold mt-3">
                          {formatearSoles(producto.precio)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={!productoActivo || !tieneStock}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          !productoActivo || !tieneStock
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        }`}
                        title="Agregar producto"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-extrabold mb-2">Venta actual</h3>
          <p className="text-sm mb-5" style={{ color: "var(--text-mid)" }}>
            Productos agregados al carrito.
          </p>

          {carrito.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-5 text-center">
              <p className="text-sm font-semibold" style={{ color: "var(--text-mid)" }}>
                Todavía no hay productos en la venta.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {carrito.map((item) => (
                <div key={item.id} className="p-3 rounded-2xl border border-gray-100 bg-gray-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm">{item.nombre}</p>
                      <p className="text-xs" style={{ color: "var(--text-mid)" }}>
                        {formatearSoles(item.precio)} c/u · Stock: {item.stock}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-700"
                    >
                      Quitar
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => disminuirCantidad(item.id)}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 font-bold"
                      >
                        -
                      </button>

                      <span className="text-sm font-bold w-6 text-center">
                        {item.cantidad}
                      </span>

                      <button
                        type="button"
                        onClick={() => aumentarCantidad(item.id)}
                        disabled={item.cantidad >= Number(item.stock || 0)}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm font-extrabold">
                      {formatearSoles(Number(item.precio) * item.cantidad)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Total</span>
                  <span className="text-2xl font-extrabold">
                    {formatearSoles(totalVenta)}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-bold mb-3">Método de pago</p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMetodoPago("efectivo")}
                    className={`rounded-xl border px-3 py-3 text-sm font-bold flex items-center justify-center gap-2 ${
                      metodoPago === "efectivo"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    <FaMoneyBillWave />
                    Efectivo
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodoPago("tarjeta")}
                    className={`rounded-xl border px-3 py-3 text-sm font-bold flex items-center justify-center gap-2 ${
                      metodoPago === "tarjeta"
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    <FaCreditCard />
                    Tarjeta
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRegistrarVenta}
                disabled={registrando || carrito.length === 0}
                className="btn-primary w-full mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {registrando ? "Registrando..." : "Registrar venta"}
              </button>

              {!cajaId && (
                <p className="text-xs text-red-600 font-semibold mt-3">
                  No hay una caja abierta. Abre caja antes de vender.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {modalVentaAbierto && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrarModalVenta();
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-4">
              <FaBasketShopping className="w-5 h-5" />
            </div>

            <h3
              className="text-lg font-extrabold mb-1"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              ¿Confirmar venta?
            </h3>

            <p className="text-sm mb-4" style={{ color: "var(--text-mid)" }}>
              ¿Estás seguro de que deseas registrar esta venta? Se descontará el
              stock de los productos seleccionados.
            </p>

            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm mb-6 space-y-2">
              <p>
                <strong>Productos:</strong> {carrito.length}
              </p>
              <p>
                <strong>Método de pago:</strong>{" "}
                {metodoPago === "efectivo" ? "Efectivo" : "Tarjeta"}
              </p>
              <p className="text-lg font-extrabold">
                Total: {formatearSoles(totalVenta)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="btn-secondary flex-1"
                type="button"
                onClick={cerrarModalVenta}
                disabled={registrando}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarVenta}
                disabled={registrando}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-60"
              >
                {registrando ? "Registrando..." : "Sí, registrar"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}