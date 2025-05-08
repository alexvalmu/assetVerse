const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Crear el directorio 'uploads' si no existe
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Nombre único para el archivo: timestamp + extensión
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Filtros para tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
    // Siempre permitir cualquier tipo de archivo
    cb(null, true);
};

// Configuración final de Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 300 * 1024 * 1024, 
        files: 6 
    }
});

module.exports = upload; 