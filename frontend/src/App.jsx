import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./router/PrivateRoute";
import Layout from "./components/Layout";
import Productos from "./components/Productos"; 
import Admin from "./components/Admin";
import Cajero from "./components/Cajero";
import Supervisor from "./components/Supervisor";
import RoleRoute from "./router/RoleRoute";
import Usuarios from "./components/Usuarios";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

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