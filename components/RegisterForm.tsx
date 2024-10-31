'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { register } from '@/lib/api'  // Importamos la función register de tu archivo API

export default function RegisterForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    try {
      const response = await register(username, password)
      console.log('Registro exitoso:', response)
      setSuccess(true)
      // Aquí puedes manejar la respuesta exitosa (por ejemplo, redirigir al usuario)
    } catch (error) {
      console.error('Error de registro:', error)
      setError('El registro falló. Por favor, intenta de nuevo.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Registro</h2>
      <p className="text-sm text-gray-600 mb-6">Crea tu cuenta para comenzar</p>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Registro exitoso!</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="register-username" className="block text-sm font-medium text-gray-700">
            Usuario
          </label>
          <input
            id="register-username"
            name="username"
            type="text"
            required
            className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="relative">
          <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="register-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  )
}