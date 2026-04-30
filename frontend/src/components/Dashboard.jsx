export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold" style={{ fontFamily: "'Nunito', sans-serif", color: "var(--text-dark)" }}>
          Dashboard
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
          Vista principal del sistema
        </p>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-extrabold mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Bienvenido al apartado de Dashboard.
        </h3>
        <p className="text-sm" style={{ color: "var(--text-mid)" }}>
          Aquí podrás visualizar el resumen principal y los indicadores generales del sistema.
        </p>
      </div>
    </div>
  );
}