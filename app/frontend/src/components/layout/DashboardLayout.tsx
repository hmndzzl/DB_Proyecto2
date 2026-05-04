import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const DashboardLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--arena-suave)' }}>
            {/* El menú lateral siempre a la izquierda */}
            <Sidebar />

            {/* El área principal del contenido */}
            <main style={{
                flex: 1,
                marginLeft: '260px',
                padding: '2rem'
            }}>
                {/* Aquí se inyectarán las páginas (Dashboard, Productos, etc.) */}
                <Outlet />
            </main>
        </div>
    );
};