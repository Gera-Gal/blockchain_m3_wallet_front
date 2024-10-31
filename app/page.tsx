'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthContainer from '@/components/AuthContainer'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400/30 via-green-500/30 to-green-600/30 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Fondo con formas geométricas */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Contenido */}
      <div className="lg:w-1/2 p-12 flex flex-col justify-between z-10">
        <div>
        </div>
        <div>
          <h2 className="text-5xl font-bold mb-4 text-green-900">
            <span className="text-gray-900">Billetera de</span><br />
            Fix My Home
          </h2>
          <p className="text-xl text-gray-600">
            Acumula <span className="text-gray-800">recompensas</span>
          </p>
          <p className="text-xl text-gray-600">
            mientras cuidas de tu <span className="text-gray-800">hogar</span>
          </p>
        </div>
        <div className="text-sm text-gray-500">
          2024 Gerardo Galicia. All rights reserved.
        </div>
      </div>

      {/* Right side content */}
      <div className="lg:w-1/2 p-8 flex items-center justify-center z-10">
        <div className="w-full max-w-md">
          <AuthContainer />
        </div>
      </div>
    </div>
  )
}