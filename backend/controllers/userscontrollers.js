const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserController {
// Obtener todos los usuarios
static async getAllUsers(req, res) {
    try {
    const users = await User.getAll();
    res.json({
        success: true,
        data: users
    });
    } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
    }
}

// Obtener usuario por DNI
static async getUserByDni(req, res) {
    try {
    const { dni } = req.params;
    const user = await User.getByDni(dni);
    
    if (!user) {
        return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
        });
    }

    res.json({
        success: true,
        data: user
    });
    } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
    }
}

// Crear nuevo usuario
static async createUser(req, res) {
    try {
    const { dni, name, email, password, role_id = 2, phone, address } = req.body;

    // Validaciones básicas
    if (!dni || !name || !email || !password) {
        return res.status(400).json({
        success: false,
        message: 'DNI, nombre, email y contraseña son requeridos'
        });
    }

    // Verificar si el DNI ya existe
    const existingUserDni = await User.getByDni(dni);
    if (existingUserDni) {
        return res.status(400).json({
        success: false,
        message: 'El DNI ya está registrado'
        });
    }

    // Verificar si el email ya existe
    const existingUserEmail = await User.findByEmail(email);
    if (existingUserEmail) {
        return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
        });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const userDni = await User.create({
        dni,
        name,
        email,
        password: hashedPassword,
        role_id,
        phone,
        address
    });

    res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: { dni: userDni, name, email, phone, address }
    });
    } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
    }
}

// Actualizar usuario
static async updateUser(req, res) {
    try {
    const { dni } = req.params;
    const { name, email, phone, address, role_id } = req.body;

    const success = await User.update(dni, { name, email, phone, address, role_id });
    
    if (!success) {
        return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
        });
    }

    res.json({
        success: true,
        message: 'Usuario actualizado exitosamente'
    });
    } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
    }
}

// Eliminar usuario (soft delete)
static async deleteUser(req, res) {
    try {
    const { dni } = req.params;
    const success = await User.delete(dni);
    
    if (!success) {
        return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
        });
    }

    res.json({
        success: true,
        message: 'Usuario eliminado exitosamente'
    });
    } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
    }
}

// Obtener usuarios por rol
static async getUsersByRole(req, res) {
    try {
    const { roleId } = req.params;
    const users = await User.getByRole(roleId);

    res.json({
        success: true,
        data: users
    });
    } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
    }
}

// Cambiar estado del usuario
static async toggleUserStatus(req, res) {
    try {
    const { dni } = req.params;
    const success = await User.toggleStatus(dni);
    
    if (!success) {
        return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
        });
    }

    res.json({
        success: true,
        message: 'Estado del usuario actualizado'
    });
    } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
    }
}
}

module.exports = UserController;