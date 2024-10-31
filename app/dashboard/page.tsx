'use client'

import React, { useEffect, useState } from 'react'
import { Bell, Search, Plus, LogOut, Wallet, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getUserData, getWallet, generateWallet } from '@/lib/api'  // Importar las funciones de API
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Sidebar from '@/components/Sidebar'
import { motion } from "framer-motion"
import axios, { AxiosError } from 'axios'  // Importar Axios y AxiosError para manejar el error de tipo unknown

type UserData = {
  username: string;
  role: string;
}

type Crypto = {
  name: string;
  symbol: string;
  price: number;
  change: number;
  color: string;
  bgColor: string;
  textColor: string;
}

// Componente para mostrar las criptomonedas
const CryptoCard = ({ name, symbol, price, change, color, bgColor, textColor }: Crypto) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className={`${bgColor} ${textColor}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{name} ({symbol})</CardTitle>
        <Button variant="ghost" size="icon" className={`h-4 w-4 ${textColor}`}>...</Button>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${price.toLocaleString()}</p>
        <Progress value={50 + change} className={`mt-2 ${color}`} />
        <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '▲' : '▼'} {Math.abs(change)}%
        </p>
      </CardContent>
    </Card>
  </motion.div>
)

// Componente para mostrar la wallet del usuario
const PortfolioCard = ({ walletAddress, onGenerateWallet, onViewAssets }: { walletAddress: string | null, onGenerateWallet: () => void, onViewAssets: () => void }) => (
  <Card className="bg-gradient-to-br from-blue-300 to-blue-400 text-black overflow-hidden relative">
    <CardHeader>
      <CardTitle className="flex items-center">
        <Wallet className="mr-2" />
        Tu Cartera
      </CardTitle>
    </CardHeader>
    <CardContent>
      {walletAddress ? (
        <div>
          <p className="font-bold">Dirección de la Wallet:</p>
          <p className="break-words">{walletAddress}</p>
          <Button onClick={onViewAssets} className="mt-4">Ver Activos</Button>
        </div>
      ) : (
        <Button onClick={onGenerateWallet}>Generar Wallet</Button>
      )}
    </CardContent>
    {/* <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div> */}
  </Card>
)

// Componente para mostrar las estadísticas del mercado
const StatisticsCard = () => (
  <Card className="bg-gradient-to-br from-green-700 to-green-800 text-white overflow-hidden relative">
    <CardHeader>
      <CardTitle className="flex items-center">
        <BarChart3 className="mr-2" />
        Estadísticas del Mercado
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Capitalización Total del Mercado</span>
          <span className="font-bold">$1.23T</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Volumen en 24h</span>
          <span className="font-bold">$78.5B</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Dominancia de BTC</span>
          <span className="font-bold">42.3%</span>
        </div>
      </div>
    </CardContent>
    {/* <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full"></div> */}
  </Card>
)

// Componente principal del Dashboard
export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth()  // Autenticación
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)  // Estado para los datos del usuario
  const [walletAddress, setWalletAddress] = useState<string | null>(null)  // Estado para la dirección de la wallet

  const [cryptos, setCryptos] = useState<Crypto[]>([
    { 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 30000, 
      change: 2.5, 
      color: "bg-orange-500", 
      bgColor: "bg-orange-100",
      textColor: "text-orange-500"
    },
    { 
      name: "Ethereum", 
      symbol: "ETH", 
      price: 1800, 
      change: -1.2, 
      color: "bg-gray-500", 
      bgColor: "bg-gray-200",
      textColor: "text-gray-800"
    },
    { 
      name: "Cardano", 
      symbol: "ADA", 
      price: 0.5, 
      change: 5.7, 
      color: "bg-blue-600", 
      bgColor: "bg-blue-100",
      textColor: "text-blue-900"
    }
  ])

  // Obtener datos del usuario y la wallet
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    } else {
      const token = localStorage.getItem('token')
      if (token) {
        fetchUserData(token)
        fetchWallet(token)  // Obtener la wallet
      }
    }
  }, [isAuthenticated, router])

  // Función para obtener los datos del usuario
  const fetchUserData = async (token: string) => {
    try {
      const data = await getUserData(token)
      setUserData(data)
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error)
    }
  }

  // Función para obtener la wallet del usuario
  const fetchWallet = async (token: string) => {
    try {
      const data = await getWallet(token)
      if (data?.wallet?.address) {
        setWalletAddress(data.wallet.address)  // Almacenar la dirección de la wallet
      }
    } catch (error) {
      console.error('Error al obtener la wallet:', error)
    }
  }

  // Función para generar una nueva wallet
  const handleGenerateWallet = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const data = await generateWallet(token)
        if (data?.wallet?.address) {
          setWalletAddress(data.wallet.address)  // Almacenar la dirección de la nueva wallet
        }
      } catch (error: unknown) {
        // Verificar si el error es una instancia de AxiosError
        if (axios.isAxiosError(error)) {
          console.error('Error al generar la wallet:', error.response?.data || error.message)
          if (error.response?.status === 400 && error.response.data?.wallet) {
            // Si ya tiene una wallet, mostrar la dirección
            setWalletAddress(error.response.data.wallet.address)
          }
        } else {
          // Para otros tipos de errores, simplemente los mostramos en la consola
          console.error('Error desconocido:', error)
        }
      }
    }
  }

  // Función para ver activos
  const handleViewAssets = () => {
    router.push('/wallet')  // Redirigir a la vista de activos
  }

  // Función para cerrar sesión
  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    router.push('/')
  }

  if (!isAuthenticated || !userData) {
    return null
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      <Sidebar username={userData.username} />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-8 overflow-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-2xl font-bold"
            >
              Hola, {userData.username}
            </motion.h1>
            <p className="text-gray-600">Resumen del Mercado de Criptomonedas - {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Nuevo Activo
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 gap-6 mb-8"
        >
          {cryptos.map((crypto, index) => (
            <CryptoCard key={index} {...crypto} />
          ))}
        </motion.div>
        <div className="grid grid-cols-2 gap-6">
          <PortfolioCard walletAddress={walletAddress} onGenerateWallet={handleGenerateWallet} onViewAssets={handleViewAssets} />
          <StatisticsCard />
        </div>
      </motion.div>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  )
}
