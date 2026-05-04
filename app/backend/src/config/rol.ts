/**
 * Diccionario de roles del sistema.
 * Los valores numéricos deben coincidir EXACTAMENTE con los IDs
 * insertados en la tabla 'rol' de la base de datos (01_schema.sql).
 */
export enum Roles {
    ADMINISTRADOR = 1,
    VENDEDOR = 2,
}

/**
 * Función de utilidad por se necesita devolver el nombre del rol 
 * en texto plano hacia el frontend (React).
 */
export const obtenerNombreRol = (idRol: number): string => {
    switch (idRol) {
        case Roles.ADMINISTRADOR:
            return 'Administrador';
        case Roles.VENDEDOR:
            return 'Vendedor';
        default:
            return 'Rol Desconocido';
    }
};