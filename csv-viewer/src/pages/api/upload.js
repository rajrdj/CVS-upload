import multer from 'multer';
import { connectDB, File } from '../../lib/mongodb';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ 
  dest: path.join(process.cwd(), 'public', 'uploads'),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        res.status(500).json({ error: 'File upload failed', details: err.message });
        return res.end();
      }

      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return res.end();
      }

      const { filename, originalname } = req.file;
      
      try {
        const file = new File({ filename, originalname });
        await file.save();
        res.status(200).json({ message: 'File uploaded successfully', file });
      } catch (dbError) {
        console.error('Database error:', dbError);
        res.status(500).json({ error: 'Error saving file information to database', details: dbError.message });
      } finally {
        res.end();
      }
    });
  } else if (req.method === 'GET') {
    try {
      const files = await File.find({});
      res.status(200).json(files);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Error fetching files from database', details: error.message });
    } finally {
      res.end();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
    res.end();
  }
}