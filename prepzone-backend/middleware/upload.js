const multer = require("multer");

const storage = multer.memoryStorage(); // or use diskStorage for saving to disk
const upload = multer({ storage });

module.exports = upload;
