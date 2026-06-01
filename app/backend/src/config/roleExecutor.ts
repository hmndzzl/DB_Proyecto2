import sequelize from './sequelize';

/**
 * Obtiene el nombre del rol en el DBMS a partir del ID de rol del empleado.
 */
export const getDbRoleName = (idRol?: number): string => {
    switch (idRol) {
        case 1: return 'rol_admin';
        case 2: return 'rol_vendedor';
        case 3: return 'rol_supervisor';
        case 4: return 'rol_inventario';
        case 5: return 'rol_auditor';
        default: return 'rol_auditor'; // Por defecto el rol más restrictivo
    }
};

/**
 * Ejecuta una función callback dentro de una transacción de Sequelize donde
 * se establece el rol localmente en la base de datos (SET LOCAL ROLE).
 * Esto garantiza que PostgreSQL valide los permisos granulares asignados con GRANT y REVOKE.
 * Las transacciones se marcan explícitamente (COMMIT / ROLLBACK).
 */
export const executeInRoleTransaction = async <T>(
    idRol: number | undefined,
    fn: (t: any) => Promise<T>
): Promise<T> => {
    const t = await sequelize.transaction();
    try {
        const roleName = getDbRoleName(idRol);
        // SET LOCAL ROLE dura únicamente durante la transacción actual.
        // Se revierte automáticamente al ejecutar COMMIT o ROLLBACK.
        await sequelize.query(`SET LOCAL ROLE ${roleName}`, { transaction: t });
        
        const result = await fn(t);
        
        await t.commit();
        return result;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};
