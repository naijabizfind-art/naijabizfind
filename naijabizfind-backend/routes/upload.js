import express from 'express';
// BACKEND DEV: Importing your custom combined multer-storage-cloudinary engine
import { uploadCombined } from '../middleware/upload.js';

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload shop photo (required) and business certificate (optional)
// @access  Public
router.post('/', (req, res, next) => {
  // Leverage your combined storage configuration
  uploadCombined.fields([
    { name: 'shopPhoto', maxCount: 1 },
    { name: 'certificate', maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      console.error('File Upload Pipeline Error:', err);
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }
    next();
  });
}, (req, res) => {
  try {
    const files = req.files;
    const responseUrls = {};

    // CloudinaryStorage automatically saves the URL in the file's .path property
    if (files?.shopPhoto?.[0]) {
      responseUrls.shopPhoto = files.shopPhoto[0].path;
    }

    if (files?.certificate?.[0]) {
      responseUrls.certificate = files.certificate[0].path;
    }

    if (Object.keys(responseUrls).length === 0) {
      return res.status(400).json({ 
        message: 'No files were uploaded. Make sure to use keys: "shopPhoto" or "certificate"' 
      });
    }

    // Send the Cloudinary asset URLs back to our React application
    res.status(200).json(responseUrls);
  } catch (error) {
    console.error('Upload processing error:', error);
    res.status(500).json({ message: 'Failed to process uploaded file metadata', error: error.message });
  }
});

export default router;