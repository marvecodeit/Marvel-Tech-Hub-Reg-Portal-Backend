import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let upload;

if (hasCloudinaryConfig) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const isPdf = file.mimetype === 'application/pdf';
      return {
        folder: 'marvel-job-resumes',
        resource_type: 'raw',
        format: isPdf ? 'pdf' : 'docx',
        public_id: `resume_${Date.now()}`,
        flags: 'attachment:false',
      };
    },
  });
  upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
      const allowed = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF and DOCX files are allowed'));
      }
    },
  });
} else {
  console.warn('⚠️  Cloudinary env vars missing — using memory storage fallback');
  upload = multer({ storage: multer.memoryStorage() });
}

export default upload;
