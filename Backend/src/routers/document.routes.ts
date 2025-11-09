import express from 'express';
import { isSuperAdmin } from '../../middlewares/role.middleware';
import { uploadDocument, getDocuments, extractDocumentData } from '../../controllers/document.controller';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage: storage });

// Super Admin routes
router.post('/upload', 
  isSuperAdmin,
  upload.single('document'), 
  uploadDocument
);

router.get('/', 
  isSuperAdmin,
  getDocuments
);

router.post('/extract/:id', 
  isSuperAdmin,
  extractDocumentData
);

export default router;