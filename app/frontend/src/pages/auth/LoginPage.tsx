import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

export const LoginPage = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correo_empleado: correo,
                    password_empleado: password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.mensaje || 'Credenciales inválidas');
            }

            // Guarda el token y los datos del usuario a través del contexto
            login(data.token, data.user);

            // Redirigir según el rol del usuario para evitar dobles redirecciones
            const rolId = Number(data.user.rol);
            if (rolId === 1 || rolId === 3) {
                window.location.href = '/dashboard';
            } else if (rolId === 4) {
                window.location.href = '/productos';
            } else {
                window.location.href = '/productos'; // Vendedores y Auditores van a Productos por defecto
            }

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Helper para auto-completar credenciales de prueba
    const fillCredentials = (email: string) => {
        setCorreo(email);
        setPassword('123456');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Tienda Nova</h1>
                    <p>Gestión de Inventario y Ventas (Proy3)</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="correo">Correo Electrónico</label>
                        <input
                            type="email"
                            id="correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="empleado@tienda.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                {/* Sección Premium: Selector rápido de usuarios para calificación */}
                <div className="grading-accounts-section">
                    <h3>Cuentas de Calificación</h3>
                    <p className="grading-subtitle">Haz clic para auto-completar y probar cada rol:</p>
                    <div className="grading-buttons-grid">
                        <button 
                            type="button" 
                            onClick={() => fillCredentials('gerente@tienda.com')}
                            className="btn-grading admin"
                            title="Administrador (Acceso Completo)"
                        >
                            🔑 Administrador
                        </button>
                        <button 
                            type="button" 
                            onClick={() => fillCredentials('emp2@tienda.com')}
                            className="btn-grading seller"
                            title="Vendedor (Clientes y Ventas)"
                        >
                            💼 Vendedor
                        </button>
                        <button 
                            type="button" 
                            onClick={() => fillCredentials('supervisor@tienda.com')}
                            className="btn-grading supervisor"
                            title="Supervisor (Productos, Categorías, Clientes, Reportes)"
                        >
                            👔 Supervisor
                        </button>
                        <button 
                            type="button" 
                            onClick={() => fillCredentials('inventario@tienda.com')}
                            className="btn-grading inventory"
                            title="Inventario (Productos, Categorías, Proveedores)"
                        >
                            📦 Inventario
                        </button>
                        <button 
                            type="button" 
                            onClick={() => fillCredentials('auditor@tienda.com')}
                            className="btn-grading auditor"
                            title="Auditor (Solo lectura completa)"
                        >
                            🔍 Auditor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
