import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Empleado } from '../models/Empleado';

export const login = async (req: Request, res: Response): Promise<any> => {
    const { correo_empleado, password_empleado } = req.body;

    try {
        // 1. Buscar al empleado por correo usando el ORM
        const empleado = await Empleado.findOne({
            where: { correo_empleado },
            attributes: ['id_empleado', 'nombre_empleado', 'password_empleado', 'id_rol']
        });

        if (!empleado) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 2. Verificar la contraseña con bcrypt
        const isPasswordValid = await bcrypt.compare(password_empleado, empleado.password_empleado);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 3. Generar el JWT
        const token = jwt.sign(
            {
                id_empleado: empleado.id_empleado,
                nombre: empleado.nombre_empleado,
                id_rol: empleado.id_rol
            },
            process.env.JWT_SECRET as string,
            { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as any }
        );

        // 4. Responder con el token y datos básicos
        res.json({
            token,
            user: {
                id: empleado.id_empleado,
                nombre: empleado.nombre_empleado,
                rol: empleado.id_rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};