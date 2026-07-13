import multer from "multer";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_req, file, callback) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return callback(null, false);
    }

    callback(null, true);
  },
});

export default upload;
