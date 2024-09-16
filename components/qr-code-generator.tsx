'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ImageIcon, ImagePlusIcon } from "lucide-react"

export function QrCodeGenerator() {
  const [link, setLink] = useState("")
  const [imageUse, setImageUse] = useState("icon")
  const [opacity, setOpacity] = useState(50)
  const [qrColor, setQrColor] = useState("#000000")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">QR Code Generator</h1>
        
        <div className="space-y-2">
          <Label htmlFor="link" className="text-sm font-medium text-gray-700">Enter your link</Label>
          <Input
            id="link"
            placeholder="https://example.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Upload Image</Label>
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
              <Input id="dropzone-file" type="file" className="hidden" />
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
        
        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
          Generate QR Code
        </Button>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Your QR code will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}