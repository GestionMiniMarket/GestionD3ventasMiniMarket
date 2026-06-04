import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import PrivateRoute from "./router/PrivateRoute";
import Layout from "./components/layout/MainLayout";
import Productos from "./pages/InventoryPage"; 
import Admin from "./pages/AdminPage";
import Cajero from "./pages/CashierPage";
import Supervisor from "./pages/SupervisorPage";
import RoleRoute from "./router/RoleRoute";
import Usuarios from "./pages/UsersPage";
import StockPage from "./pages/StockPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLICAS */}
        <Route path="/" element={<Login />} />

        {/* PRIVADAS CON LAYOUT */}
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
            <PrivateRoute>
              <Layout>
                <Productos />
              </Layout>
            </PrivateRoute>
          } 
        />

        <Route
          path="/inventario"
          element={
            <PrivateRoute>
              <Layout>
                <StockPage />
              </Layout>
            </PrivateRoute>
          }
        />

      <Route 
        path="/admin" 
        element={
          <RoleRoute rolPermitido="Administrador">
            <Layout>
              <Admin />
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
        path="/supervisor" 
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