import { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API handler function called');
  console.log('API route hit');
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);

  if (req.method !== 'POST') {
    console.error(`Method not allowed: ${req.method}`);
    return res.status(405).json({ error: 'Method not allowed', method: req.method });
  }

  console.log('POST request received, proceeding with form parsing');

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form data:', err);
      return res.status(500).json({ error: 'Error parsing form data', details: err.message });
    }

    console.log('Parsed form data:', { fields, files });

    let file: formidable.File | undefined;
    if (Array.isArray(files.file)) {
      file = files.file[0];
    } else {
      file = files.file;
    }

    if (!file) {
      console.error('No file uploaded. Files received:', files);
      return res.status(400).json({ error: 'No file uploaded', filesReceived: files });
    }

    if (!('filepath' in file)) {
      console.error('Invalid file object. File details:', file);
      return res.status(400).json({ error: 'Invalid file object', fileDetails: file });
    }

    try {
      console.log('Attempting to upload file:', file.newFilename);
      console.log('File details:', {
        originalFilename: file.originalFilename,
        filepath: file.filepath,
        mimetype: file.mimetype,
        size: file.size,
      });

      const blob = await put(file.newFilename, fs.createReadStream(file.filepath), {
        access: 'public',
      });

      console.log('File uploaded successfully:', blob.url);
      res.status(200).json({ url: blob.url });
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error);
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
      res.status(500).json({
        error: 'Error uploading file',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  });
}