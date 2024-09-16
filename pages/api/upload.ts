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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form data:', err);
      return res.status(500).json({ error: 'Error parsing form data', details: err.message });
    }

    const file = files.file as formidable.File;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      console.log('Attempting to upload file:', file.newFilename);
      const blob = await put(file.newFilename, fs.createReadStream(file.filepath), {
        access: 'public',
      });

      console.log('File uploaded successfully:', blob.url);
      res.status(200).json({ url: blob.url });
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error);
      res.status(500).json({ error: 'Error uploading file', details: error instanceof Error ? error.message : String(error) });
    }
  });
}