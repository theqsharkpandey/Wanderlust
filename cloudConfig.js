const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, // ✅ fixed
  api_secret: process.env.CLOUDINARY_SECRET, // ✅ fixed
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wanderlust_PROD",
    allowed_formats: ["png", "jpg", "jpeg"], // Render-friendly naming
  },
});

module.exports = {
  cloudinary,
  storage,
};
