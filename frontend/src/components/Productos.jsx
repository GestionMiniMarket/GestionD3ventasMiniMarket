export default function Productos() {
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Productos
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
            Gestión de inventario
          </p>
        </div>
        <button className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo producto
        </button>
      </div>
      <div className="card p-6">
        <h3 className="text-xl font-extrabold mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Bienvenido al apartado de Productos
        </h3>
        <p className="text-sm" style={{ color: "var(--text-mid)" }}>
          Aquí podrás gestionar el inventario y visualizar la información de productos.
        </p>
      </div>
    </div>
  );
}