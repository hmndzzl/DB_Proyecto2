import { useState, useEffect } from 'react';
import './CategoriasPage.css';

interface Categoria {
    id_categoria: number;
    nombre_categoria: string;
    descripcion_categoria?: string;
}

export const CategoriasPage = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        nombre_categoria: '',
        descripcion_categoria: ''
    });

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const esAdmin = user.rol === 1;

    const fetchData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/catalogos/categorias`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setCategorias(await response.json());
            }
        } catch (error) {
            console.error('Error cargando categorías:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleOpenModal = (cat?: Categoria) => {
        if (cat) {
            setIsEditing(true);
            setCurrentId(cat.id_categoria);
            setFormData({
                nombre_categoria: cat.nombre_categoria || '',
                descripcion_categoria: cat.descripcion_categoria || ''
            });
        } else {
            setIsEditing(false);
            setFormData({ nombre_categoria: '', descripcion_categoria: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing
            ? `${import.meta.env.VITE_API_URL}/api/catalogos/categorias/${currentId}`
            : `${import.meta.env.VITE_API_URL}/api/catalogos/categorias`;

        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                const err = await response.json();
                alert(`Ocurrió un error: ${err.mensaje}`);
            }
        } catch (error) {
            alert("Error de conexión");
        }
    };

    const eliminarCategoria = async (id: number, nombre: string) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/catalogos/categorias/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setCategorias(categorias.filter(c => c.id_categoria !== id));
            } else {
                alert('No se puede eliminar la categoría porque tiene productos asociados.');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    return (
        <div className="categorias-container">
            <header className="categorias-header">
                <div>
                    <h1>Gestión de Categorías</h1>
                    <p>Catálogo de clasificaciones de productos</p>
                </div>
                {esAdmin && <button className="btn-agregar" onClick={() => handleOpenModal()}>+ Nueva Categoría</button>}
            </header>

            {isLoading ? (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando categorías...</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                {esAdmin && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map(c => (
                                <tr key={c.id_categoria}>
                                    <td className="fw-bold">{c.nombre_categoria}</td>
                                    <td>{c.descripcion_categoria || <span className="text-muted">Sin descripción</span>}</td>
                                    {esAdmin && (
                                        <td className="acciones-cell">
                                            <button className="btn-icon edit" onClick={() => handleOpenModal(c)}>✏️</button>
                                            <button className="btn-icon delete" onClick={() => eliminarCategoria(c.id_categoria, c.nombre_categoria)}>🗑️</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL PARA CREAR/EDITAR */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 style={{ fontFamily: 'var(--font-titulos)' }}>{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label>Nombre de Categoría</label>
                                <input
                                    type="text"
                                    value={formData.nombre_categoria}
                                    onChange={e => setFormData({ ...formData, nombre_categoria: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--gris-arena)', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label>Descripción (Opcional)</label>
                                <textarea
                                    value={formData.descripcion_categoria}
                                    onChange={e => setFormData({ ...formData, descripcion_categoria: e.target.value })}
                                    rows={3}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--gris-arena)', boxSizing: 'border-box', fontFamily: 'var(--font-cuerpo)' }}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn-save">Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
