const { pool } = require('../config/database');

class User {
    constructor(dni, name, email, password, role_id = 2) {
    this.dni = dni;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role_id = role_id;
    }

  // Obtener todos los usuarios con información de rol
    static async getAll() {
    try {
        const [rows] = await pool.execute(`
        SELECT 
            u.dni, 
            u.name, 
            u.email, 
            u.phone, 
            u.address, 
            u.is_active,
            r.name as role_name,
            r.description as role_description,
            u.created_at 
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id 
        WHERE u.is_active = TRUE
        ORDER BY u.created_at DESC
        `);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener usuarios: ' + error.message);
        }
    }

  // Obtener usuario por DNI
    static async getByDni(dni) {
    try {
        const [rows] = await pool.execute(`
        SELECT 
            u.dni, 
            u.name, 
            u.email, 
            u.phone, 
            u.address, 
            u.is_active,
            r.name as role_name,
            r.description as role_description,
            u.created_at 
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id 
        WHERE u.dni = ?
        `, [dni]);
        return rows[0];
    } catch (error) {
        throw new Error('Error al obtener usuario: ' + error.message);
        }
    }

  // Crear nuevo usuario
    static async create(userData) {
    const { dni, name, email, password, role_id = 2, phone = null, address = null } = userData;
    try {
        const [result] = await pool.execute(
        'INSERT INTO users (dni, name, email, password, role_id, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [dni, name, email, password, role_id, phone, address]
        );
      return dni; // Retornamos el DNI en lugar del insertId
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('dni')) {
                throw new Error('El DNI ya está registrado');
            }
            if (error.message.includes('email')) {
            throw new Error('El email ya está registrado');
            }
        }
        throw new Error('Error al crear usuario: ' + error.message);
        }
    }

  // Actualizar usuario
    static async update(dni, userData) {
    const { name, email, phone, address, role_id } = userData;
    try {
        const [result] = await pool.execute(
        'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, role_id = ? WHERE dni = ?',
        [name, email, phone, address, role_id, dni]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error al actualizar usuario: ' + error.message);
    }
  }

  // Eliminar usuario (soft delete)
    static async delete(dni) {
    try {
        const [result] = await pool.execute('UPDATE users SET is_active = FALSE WHERE dni = ?', [dni]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error al eliminar usuario: ' + error.message);
        }
    }

  // Eliminar usuario permanentemente
    static async hardDelete(dni) {
    try {
        const [result] = await pool.execute('DELETE FROM users WHERE dni = ?', [dni]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error al eliminar usuario permanentemente: ' + error.message);
        }
    }

  // Buscar usuario por email
    static async findByEmail(email) {
    try {
        const [rows] = await pool.execute(`
        SELECT 
            u.*, 
            r.name as role_name,
            r.description as role_description
            FROM users u 
            LEFT JOIN roles r ON u.role_id = r.id 
            WHERE u.email = ? AND u.is_active = TRUE
        `, [email]);
        return rows[0];
    } catch (error) {
        throw new Error('Error al buscar usuario: ' + error.message);
        }
    }

  // Buscar usuario por DNI (incluye password para login)
    static async findByDniWithPassword(dni) {
    try {
        const [rows] = await pool.execute(`
        SELECT 
            u.*, 
            r.name as role_name,
            r.description as role_description
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id 
        WHERE u.dni = ? AND u.is_active = TRUE
        `, [dni]);
        return rows[0];
    } catch (error) {
        throw new Error('Error al buscar usuario: ' + error.message);
        }
    }

  // Obtener usuarios por rol
    static async getByRole(roleId) {
    try {
        const [rows] = await pool.execute(`
        SELECT 
            u.dni, 
            u.name, 
            u.email, 
            u.phone, 
            u.address,
            r.name as role_name,
            u.created_at 
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id 
        WHERE u.role_id = ? AND u.is_active = TRUE
        ORDER BY u.name ASC
        `, [roleId]);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener usuarios por rol: ' + error.message);
        }
    }

  // Cambiar estado del usuario
    static async toggleStatus(dni) {
    try {
        const [result] = await pool.execute(
        'UPDATE users SET is_active = NOT is_active WHERE dni = ?',
        [dni]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Error al cambiar estado del usuario: ' + error.message);
        }
    }
}

module.exports = User;