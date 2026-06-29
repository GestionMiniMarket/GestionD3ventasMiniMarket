import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, rolPermitido, rolesPermitidos }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) {
    return <Navigate to="/" />;
  }

  // Si recibe una lista de roles
  if (rolesPermitidos) {
    if (!rolesPermitidos.includes(rol)) {
      return <Navigate to="/dashboard" />;
    }

    return children;
  }

  // Compatibilidad con un solo rol
  if (rolPermitido && rol !== rolPermitido) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}