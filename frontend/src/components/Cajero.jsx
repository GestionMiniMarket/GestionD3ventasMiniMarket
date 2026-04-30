export default function Cajero() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Panel de Cajero
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
          Registro y gestión de ventas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-xl font-extrabold mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Bienvenido al apartado de Cajero
          </h3>
          <p className="text-sm" style={{ color: "var(--text-mid)" }}>
            Desde aquí podrás registrar ventas y gestionar operaciones de caja.
          </p>
        </div>
      </div>
    </div>
  );
}