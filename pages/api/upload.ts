import { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Decode base64 file
    const fileBuffer = Buffer.from(file.split(',')[1], 'base64');

    // Generate a unique filename
    const filename = `${nanoid()}.pdf`;

    // Upload to Vercel Blob Storage
    const blob = await put(filename, fileBuffer, {
      access: 'public',
    });

    return res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: 'Error uploading file' });
  }
}