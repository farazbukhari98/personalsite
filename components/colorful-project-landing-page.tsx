'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Mail, Briefcase, ChevronRight, QrCode } from "lucide-react"

export function ColorfulProjectLandingPageComponent() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800">
      <header className="flex items-center justify-between p-4 bg-white bg-opacity-80 backdrop-blur-sm">
        <div className="text-xl font-bold text-purple-700 flex items-center">
          <Briefcase className="mr-2 h-6 w-6" />
          My Projects
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="#" className="flex items-center hover:text-purple-600 transition-colors"><Home className="mr-1 h-4 w-4" /> Home</Link></li>
            <li><Link href="#" className="flex items-center hover:text-purple-600 transition-colors"><Mail className="mr-1 h-4 w-4" /> Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-purple-800">Welcome</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6 text-blue-700">My Projects</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline" className="bg-white hover:bg-blue-50 text-blue-600 border-blue-200">
              <Link href="/qr-generator" className="flex items-center">
                <QrCode className="mr-2 h-4 w-4" />
                QR Code Generator
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {/* Add more project buttons here as needed */}
          </div>
        </section>
      </main>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400"></div>
    </div>
  )
}