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
  const [link, setLink] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null)
  const [imageUse, setImageUse] = useState("icon")
  const [opacity, setOpacity] = useState(50)
  const [qrColor, setQrColor] = useState("#000000")
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const applyIconOverlay = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const size = canvas.width / 4
    const x = (canvas.width - size) / 2
    const y = (canvas.height - size) / 2
    ctx.drawImage(img, x, y, size, size)
  }, [])

  const applyBackgroundOverlay = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    ctx.globalAlpha = opacity / 100
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 1.0
    const qrCodeImg = new Image()
    qrCodeImg.onload = () => {
      ctx.drawImage(qrCodeImg, 0, 0, canvas.width, canvas.height)
    }
    qrCodeImg.src = canvas.toDataURL()
  }, [opacity])

  const applyImageOverlay = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      if (imageUse === 'icon') {
        applyIconOverlay(canvas, ctx, img)
      } else {
        applyBackgroundOverlay(canvas, ctx, img)
      }
    }
    img.src = uploadedImage as string
  }, [imageUse, uploadedImage, applyIconOverlay, applyBackgroundOverlay])

  const generateQRCode = useCallback(async () => {
    if (link && canvasRef.current) {
      try {
        await QRCode.toCanvas(canvasRef.current, link, {
          width: 256,
          margin: 1,
          color: {
            dark: qrColor,
            light: '#ffffff',
          },
        })

        if (uploadedImage) {
          applyImageOverlay()
        }
      } catch (err) {
        console.error(err)
        setErrorMessage('Failed to generate QR code. Please try again.')
      }
    }
  }, [link, qrColor, uploadedImage, applyImageOverlay])

  useEffect(() => {
    generateQRCode()
  }, [generateQRCode])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setErrorMessage("")

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ file: base64 }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const data = await response.json()
        if (!data.url) {
          throw new Error('No URL returned from server')
        }

        setUploadedDocument(file)
        setLink(data.url)
      } catch (error) {
        console.error('Error uploading document:', error)
        if (error instanceof Error) {
          setErrorMessage(`Failed to upload document: ${error.message}`)
        } else {
          setErrorMessage('Failed to upload document. Please try again.')
        }
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">QR Code Generator</h1>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="link" className="text-sm font-medium text-gray-700">Enter your link or upload a document</Label>
          <Input
            id="link"
            placeholder="https://example.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Upload Document</Label>
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor="document-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-20"></div>
              <div className="relative flex flex-col items-center justify-center pt-5 pb-6">
                <FileIcon className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> a document
                </p>
              </div>
              <Input id="document-file" type="file" className="hidden" onChange={handleDocumentUpload} disabled={isUploading} />
            </Label>
          </div>
          {isUploading && <p className="text-sm text-blue-600">Uploading...</p>}
          {uploadedDocument && (
            <p className="text-sm text-gray-600">Uploaded: {uploadedDocument.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Upload Image for QR Code</Label>
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"></div>
              <div className="relative flex flex-col items-center justify-center pt-5 pb-6">
                <ImagePlusIcon className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
              </div>
              <Input id="dropzone-file" type="file" className="hidden" onChange={handleImageUpload} />
            </Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Image Usage</Label>
          <RadioGroup defaultValue="icon" onValueChange={setImageUse} className="flex space-x-4">
            <div className="flex items-center">
              <RadioGroupItem value="icon" id="icon" className="text-blue-600" />
              <Label htmlFor="icon" className="ml-2 text-sm text-gray-700">Use as Icon</Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="background" id="background" className="text-blue-600" />
              <Label htmlFor="background" className="ml-2 text-sm text-gray-700">Use as Background</Label>
            </div>
          </RadioGroup>
        </div>
        
        {imageUse === "background" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Background Opacity</Label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[opacity]}
              onValueChange={(value) => setOpacity(value[0])}
              className="w-full"
            />
            <div className="text-sm text-gray-500 text-right">{opacity}%</div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="qr-color" className="text-sm font-medium text-gray-700">QR Code Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="qr-color"
              type="color"
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
              className="w-12 h-12 p-1 rounded-md border border-gray-300"
            />
            <span className="text-sm text-gray-500">{qrColor}</span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          onClick={generateQRCode}
        >
          Generate QR Code
        </Button>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center bg-gray-50">
          {link ? (
            <canvas ref={canvasRef} className="max-w-full max-h-full"></canvas>
          ) : (
            <div className="text-center">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Your QR code will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}