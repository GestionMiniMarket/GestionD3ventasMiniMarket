import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, rolPermitido }) {

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (rol !== rolPermitido) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
