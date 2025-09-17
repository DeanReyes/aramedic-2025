const { pool } = require('../config/database');

class Role {
constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
}

// Obtener todos los roles
static async getAll() {
    try {
    const [rows] = await pool.execute('SELECT * FROM roles ORDER BY id ASC');
    return rows;
    } catch (error) {
    throw new Error('Error al obtener roles: ' + error.message);
    }
}

// Obtener rol por ID
static async getById(id) {
    try {
    const [rows] = await pool.execute('SELECT * FROM roles WHERE id = ?', [id]);
    return rows[0];
    } catch (error) {
    throw new Error('Error al obtener rol: ' + error.message);
    }
}

// Obtener rol por nombre
static async getByName(name) {
    try {
    const [rows] = await pool.execute('SELECT * FROM roles WHERE name = ?', [name]);
    return rows[0];
    } catch (error) {
    throw new Error('Error al obtener rol: ' + error.message);
    }
}

// Crear nuevo rol
static async create(roleData) {
    const { name, description } = roleData;
    try {
    const [result] = await pool.execute(
        'INSERT INTO roles (name, description) VALUES (?, ?)',
        [name, description]
    );
    return result.insertId;
    } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('El nombre del rol ya existe');
    }
    throw new Error('Error al crear rol: ' + error.message);
    }
}

// Actualizar rol
static async update(id, roleData) {
    const { name, description } = roleData;
    try {
    const [result] = await pool.execute(
        'UPDATE roles SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
    );
    return result.affectedRows > 0;
    } catch (error) {
    throw new Error('Error al actualizar rol: ' + error.message);
    }
}

// Eliminar rol
static async delete(id) {
    try {
    // Verificar que no haya usuarios con este rol
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role_id = ?', [id]);
    
    if (users[0].count > 0) {
        throw new Error('No se puede eliminar el rol porque hay usuarios asignados a él');
    }

    const [result] = await pool.execute('DELETE FROM roles WHERE id = ?', [id]);
    return result.affectedRows > 0;
    } catch (error) {
    throw new Error('Error al eliminar rol: ' + error.message);
    }
}
}

module.exports = Role;