const multer = require('multer');
const storage = require('./cloudinaryStorage');
const upload = multer({ storage });

const path = require('path');
const fs = require('fs');


// Crear el directorio 'uploads' si no existe
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento


// Filtros para tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
    // Siempre permitir cualquier tipo de archivo
    cb(null, true);
};



module.exports = upload; 