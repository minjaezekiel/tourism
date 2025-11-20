const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * A factory function to create a configured multer middleware.
 * @param {object} options - Configuration options for the uploader.
 * @param {string} options.destination - The directory to save files in (relative to project root).
 * @param {number} [options.fileSizeLimit=5*1024*1024] - Maximum file size in bytes (default: 5MB).
 * @param {string[]} [options.allowedFileTypes=['image/jpeg', 'image/png', 'image/gif', 'image/webp']] - An array of allowed MIME types.
 * @returns {multer.Multer} - A configured multer middleware instance.
 */
const createUploader = (options) => {
    // 1. Set default values for options
    const {
        destination,
        fileSizeLimit = 5 * 1024 * 1024, // Default 5MB
        allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] // Default common image types
    } = options;

    // 2. Ensure the upload directory exists dynamically
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    // 3. Configure storage
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destination);
        },
        filename: function (req, file, cb) {
            // Create a unique filename to avoid conflicts
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });

    // 4. Create a dynamic file filter
    const fileFilter = (req, file, cb) => {
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error(`File type not allowed. Allowed types: ${allowedFileTypes.join(', ')}`), false);
        }
    };

    // 5. Initialize and return the multer instance
    return multer({
        storage: storage,
        limits: {
            fileSize: fileSizeLimit
        },
        fileFilter: fileFilter
    });
};

module.exports = createUploader;