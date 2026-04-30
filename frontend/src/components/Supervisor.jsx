export default function Supervisor() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Panel de Supervisor
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
          Reportes y control de operaciones
        </p>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-extrabold mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Bienvenido al apartado de Supervisor
        </h3>
        <p className="text-sm" style={{ color: "var(--text-mid)" }}>
          Aquí podrás revisar reportes y supervisar el flujo general de operaciones.
        </p>
      </div>
    </div>
  );
}