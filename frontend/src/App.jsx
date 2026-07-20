import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import PrivateRoute from "./router/PrivateRoute";
import Layout from "./components/layout/MainLayout";
import Productos from "./pages/InventoryPage";
import Categorias from "./pages/CategoriasPage";
import Cajero from "./pages/CashierPage";
import Supervisor from "./pages/SupervisorPage";
import RoleRoute from "./router/RoleRoute";
import Usuarios from "./pages/UsersPage";
import StockPage from "./pages/StockPage";
import CajaPage from "./pages/CajaPage";
import ReportesPage from "./pages/ReportesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <RoleRoute rolPermitido="Administrador">
              <Layout>
                <Productos />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/inventario"
          element={
            <RoleRoute rolPermitido="Administrador">
              <Layout>
                <StockPage />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/cajero"
          element={
            <RoleRoute rolesPermitidos={["Administrador", "Cajero"]}>
              <Layout>
                <Cajero />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/caja"
          element={
            <RoleRoute rolesPermitidos={["Administrador", "Cajero"]}>
              <Layout>
                <CajaPage />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/supervisor"
          element={
            <RoleRoute rolesPermitidos={["Administrador", "Supervisor"]}>
              <Layout>
                <Supervisor />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <RoleRoute rolesPermitidos={["Administrador", "Supervisor"]}>
              <Layout>
                <ReportesPage />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/categorias"
          element={
            <RoleRoute rolPermitido="Administrador">
              <Layout>
                <Categorias />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <RoleRoute rolPermitido="Administrador">
              <Layout>
                <Usuarios />
              </Layout>
            </RoleRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;