const express = require('express');
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { validateCreateUser, validateUpdateUser } = require('../middleware/validation');
const router = express.Router();

// GET /api/users - Obtener todos los usuarios
router.get('/', UserController.getAllUsers);

// GET /api/users/:dni - Obtener usuario por DNI
router.get('/:dni', UserController.getUserByDni);

// GET /api/users/role/:roleId - Obtener usuarios por rol
router.get('/role/:roleId', UserController.getUsersByRole);

// POST /api/users - Crear nuevo usuario (con validación)
router.post('/', validateCreateUser, UserController.createUser);

// PUT /api/users/:dni - Actualizar usuario (con autenticación y validación)
router.put('/:dni', auth, validateUpdateUser, UserController.updateUser);

// DELETE /api/users/:dni - Eliminar usuario (con autenticación)
router.delete('/:dni', auth, UserController.deleteUser);

// PATCH /api/users/:dni/toggle-status - Cambiar estado del usuario
router.patch('/:dni/toggle-status', auth, UserController.toggleUserStatus);

module.exports = router;