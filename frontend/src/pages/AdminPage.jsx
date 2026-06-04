import { useNavigate } from "react-router-dom";
import {
  FaUsersGear,
  FaChartLine,
  FaSliders,
  FaArrowRight,
} from "react-icons/fa6";

export default function Admin() {
  const navigate = useNavigate();

  const opciones = [
    {
      title: "Usuarios",
      desc: "Administra cuentas, roles y permisos del personal.",
      icon: FaUsersGear,
      path: "/usuarios",
      color: "#6d28d9",
      bg: "#f3e8ff",
    },
    {
      title: "Reportes",
      desc: "Consulta indicadores y análisis del minimarket.",
      icon: FaChartLine,
      path: "/supervisor",
      color: "#15803d",
      bg: "#dcfce7",
    },
    {
      title: "Configuración",
      desc: "Gestiona parámetros generales del sistema.",
      icon: FaSliders,
      path: "/dashboard",
      color: "#b45309",
      bg: "#fef3c7",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 mb-3">
          Administración general
        </span>

        <h2
          className="text-2xl font-extrabold"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Panel de Administrador
        </h2>

        <p className="text-sm mt-1" style={{ color: "var(--text-mid)" }}>
          Controla las áreas principales del sistema de ventas del minimarket.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {opciones.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="card p-6 flex flex-col justify-between gap-5 hover:-translate-y-1 transition-all duration-200"
            >
              <div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: item.bg, color: item.color }}
                >
                  <Icon className="text-xl" />
                </div>

                <h3 className="font-extrabold text-lg mb-1">{item.title}</h3>

                <p className="text-sm leading-relaxed" style={{ color: "var(--text-mid)" }}>
                  {item.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(item.path)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold border transition-all hover:bg-gray-50"
                style={{ color: item.color, borderColor: item.color }}
              >
                Gestionar
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}