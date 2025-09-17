# Paso 1: Descargar el proyecto
git clone https://github.com/DeanReyes/aramedic-2025.git
cd aramedic-2025

# Configuración de backend
cd backend
npm install
cp .env.example .env

# Configuración de variables de entorno
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TU_PASSWORD_DE_MYSQL
DB_NAME=aramedic_db
JWT_SECRET=una_clave_secreta_muy_larga_y_segura

# Configuración del frontend
cd ../frontend
npm install