/**
 * Diccionario de roles del sistema.
 * Los valores numéricos coinciden EXACTAMENTE con los IDs
 * insertados en la tabla 'rol' de la base de datos (01_schema.sql / 02_seeds.sql).
 */
export enum Roles {
    ADMINISTRADOR = 1,
    VENDEDOR = 2,
    SUPERVISOR = 3,
    INVENTARIO = 4,
    AUDITOR = 5,
}

/**
 * Función de utilidad para devolver el nombre del rol 
 * en texto plano hacia el frontend.
 */
export const obtenerNombreRol = (idRol: number): string => {
    switch (idRol) {
        case Roles.ADMINISTRADOR:
            return 'Administrador';
        case Roles.VENDEDOR:
            return 'Vendedor';
        case Roles.SUPERVISOR:
            return 'Supervisor';
        case Roles.INVENTARIO:
            return 'Inventario';
        case Roles.AUDITOR:
            return 'Auditor';
        default:
            return 'Rol Desconocido';
    }
};