import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProductosPage } from './pages/productos/ProductosPage';
import { CategoriasPage } from './pages/productos/CategoriasPage';
import { VentasPage } from './pages/ventas/VentasPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Privadas */}
        <Route element={<ProtectedRoute />}>
          {/* Si está autenticado, se muestra el Layout con el Sidebar */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/ventas" element={<VentasPage />} />
          </Route>
        </Route>

        {/* Redirección por defecto: Si se escribe cualquier otra URL, lo manda al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
