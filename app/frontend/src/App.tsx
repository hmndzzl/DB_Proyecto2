import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProductosPage } from './pages/productos/ProductosPage';
import { CategoriasPage } from './pages/productos/CategoriasPage';
import { VentasPage } from './pages/ventas/VentasPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas Privadas */}
          <Route element={<ProtectedRoute />}>
            {/* Si está autenticado, se muestra el Layout con el Sidebar */}
            <Route element={<DashboardLayout />}>
              
              {/* Dashboard: Exclusivo para Administrador (1) y Supervisor (3) */}
              <Route element={<ProtectedRoute allowedRoles={[1, 3]} />}>
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>
              
              {/* Inventario / Productos / Categorías: Accesible para todos los roles (1, 2, 3, 4, 5) */}
              <Route element={<ProtectedRoute allowedRoles={[1, 2, 3, 4, 5]} />}>
                <Route path="/productos" element={<ProductosPage />} />
                <Route path="/categorias" element={<CategoriasPage />} />
              </Route>

              {/* Ventas: Accesible por Administrador (1), Vendedor (2), Supervisor (3) y Auditor (5) */}
              <Route element={<ProtectedRoute allowedRoles={[1, 2, 3, 5]} />}>
                <Route path="/ventas" element={<VentasPage />} />
              </Route>

            </Route>
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
