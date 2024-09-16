import { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    console.log('Received upload request');

    const { file } = req.body;

    if (!file) {
      console.error('No file provided in request body');
      return res.status(400).json({ error: 'No file provided' });
    }

    console.log('File data received, length:', file.length);

    // Decode base64 file
    const base64Data = file.split(',')[1];
    const fileBuffer = Buffer.from(base64Data, 'base64');

    console.log('File decoded, size:', fileBuffer.length);

    // Generate a unique filename
    const filename = `${nanoid()}.pdf`;

    console.log('Uploading file:', filename);

    // Upload to Vercel Blob Storage
    const blob = await put(filename, fileBuffer, {
      access: 'public',
    });

    console.log('File uploaded successfully:', blob.url);

    return res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error('Error in upload handler:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return res.status(500).json({ error: 'Error uploading file', details: error instanceof Error ? error.message : String(error) });
  }
}