import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary credentials from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage engine for shop photos (images only)
const shopPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'naijabizfind/shops',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'fill', quality: 'auto:good' }
    ],
  },
});

// Storage engine for certificates (images or PDFs)
const certificateStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'naijabizfind/certificates',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type:   'auto',
  },
});

// File size limits
const LIMITS = { fileSize: 5 * 1024 * 1024 }; // 5MB

// Multer instances
export const uploadShopPhoto   = multer({ storage: shopPhotoStorage,   limits: LIMITS });
export const uploadCertificate = multer({ storage: certificateStorage, limits: LIMITS });

// Combined upload for the single /api/upload route
// Accepts: shopPhoto (required) + certificate (optional)
const combinedStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === 'certificate') {
      return {
        folder:        'naijabizfind/certificates',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      };
    }
    // Default: shop photo
    return {
      folder:          'naijabizfind/shops',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation:  [{ width: 800, height: 600, crop: 'fill', quality: 'auto:good' }],
    };
  },
});

export const uploadCombined = multer({ storage: combinedStorage, limits: LIMITS });

export { cloudinary };