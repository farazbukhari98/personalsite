import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadDir = path.join(process.cwd(), 'public', 'uploads')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await fs.promises.mkdir(uploadDir, { recursive: true })

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err)
        return res.status(500).json({ error: 'Error uploading file' })
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file
      if (!file) {
        console.error('No file uploaded')
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const fileName = file.newFilename
      const filePath = path.join('/uploads', fileName)

      console.log('File uploaded successfully:', filePath)
      return res.status(200).json({ filePath })
    })
  } catch (error) {
    console.error('Error in upload handler:', error)
    return res.status(500).json({ error: 'Error uploading file' })
  }
}