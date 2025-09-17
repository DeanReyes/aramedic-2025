// Validación para crear usuario
const validateCreateUser = (req, res, next) => {
const { dni, name, email, password } = req.body;
const errors = [];

// Validar DNI
if (!dni || dni.trim().length < 8) {
    errors.push('El DNI debe tener al menos 8 caracteres');
}

// Validar que el DNI solo contenga números
if (dni && !/^\d+$/.test(dni.trim())) {
    errors.push('El DNI solo debe contener números');
}

// Validar nombre
if (!name || name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
}

// Validar email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!email || !emailRegex.test(email)) {
    errors.push('Email inválido');
}

// Validar contraseña
if (!password || password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
}

if (errors.length > 0) {
    return res.status(400).json({
    success: false,
    message: 'Errores de validación',
    errors
    });
}

next();
};

// Validación para actualizar usuario
const validateUpdateUser = (req, res, next) => {
const { name, email } = req.body;
const errors = [];

// Validar nombre si se proporciona
if (name && name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
}

// Validar email si se proporciona
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (email && !emailRegex.test(email)) {
    errors.push('Email inválido');
}

if (errors.length > 0) {
    return res.status(400).json({
    success: false,
    message: 'Errores de validación',
    errors
    });
}

next();
};

module.exports = {
validateCreateUser,
validateUpdateUser
};