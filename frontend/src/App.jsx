import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import PrivateRoute from "./router/PrivateRoute";
import Layout from "./components/layout/MainLayout";
import Productos from "./pages/InventoryPage";
import Cajero from "./pages/CashierPage";
import Supervisor from "./pages/SupervisorPage";
import RoleRoute from "./router/RoleRoute";
import Usuarios from "./pages/UsersPage";
import StockPage from "./pages/StockPage";
import CajaPage from "./pages/CajaPage";

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
            <RoleRoute rolPermitido="Cajero">
              <Layout>
                <Cajero />
              </Layout>
            </RoleRoute>
          }
        />
        <Route
          path="/caja"
          element={
            <PrivateRoute>
              <Layout>
                <CajaPage />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/caja"
          element={
            <RoleRoute rolPermitido="Cajero">
              <Layout>
                <Cajero />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <RoleRoute rolPermitido="Supervisor">
              <Layout>
                <Supervisor />
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