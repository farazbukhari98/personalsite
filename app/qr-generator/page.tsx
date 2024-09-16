'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import QRCode from 'qrcode'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ImageIcon, ImagePlusIcon, FileIcon } from "lucide-react"

export default function QRGenerator() {
  // ... (previous code remains the same)

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setErrorMessage("")
      const formData = new FormData()
      formData.append('file', file)

      console.log('Uploading file:', file.name)

      try {
        console.log('Sending POST request to /api/upload')
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        console.log('Response status:', response.status)
        console.log('Response headers:', response.headers)

        if (!response.ok) {
          let errorMessage = `Upload failed with status ${response.status}`;
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
            console.error('Error data:', errorData)
          } catch (jsonError) {
            console.error('Error parsing error response:', jsonError)
          }
          throw new Error(errorMessage)
        }

        let data;
        try {
          data = await response.json()
          console.log('Response data:', data)
        } catch (jsonError) {
          console.error('Error parsing success response:', jsonError)
          throw new Error('Invalid response from server')
        }

        if (!data.url) {
          throw new Error('No URL returned from server')
        }

        setUploadedDocument(file)
        setLink(data.url) // Use the Vercel Blob URL directly
        console.log('File uploaded successfully. URL:', data.url)
      } catch (error) {
        console.error('Error uploading document:', error)
        setErrorMessage(error instanceof Error ? error.message : 'Failed to upload document. Please try again.')
      } finally {
        setIsUploading(false)
      }
    }
  }

  // ... (rest of the component remains the same)
}