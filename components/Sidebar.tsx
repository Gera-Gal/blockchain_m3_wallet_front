import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Home, Wallet as WalletIcon, ListTodo, Clock, Settings, Send } from 'lucide-react' // Añadir icono de enviar
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { getWallet } from '@/lib/api'

interface SidebarProps {
  username: string;
}

const Sidebar: React.FC<SidebarProps> = ({ username }) => {
  const router = useRouter()
  const [walletExists, setWalletExists] = useState<boolean>(false)  // Estado para verificar si hay wallet

  const profileImageURL = "https://gateway.pinata.cloud/ipfs/bafybeieh7lrfrj4m3hgsvmms5wn3q43hnx4mkbaykhyctqmgxg74ipwgv4"

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchWallet(token)
    }
  }, [])

  const fetchWallet = async (token: string) => {
    try {
      const data = await getWallet(token)
      if (data?.wallet?.address) {
        setWalletExists(true)  // Si la wallet existe, habilitar la opción
      }
    } catch (error) {
      console.error('Error al verificar la wallet:', error)
    }
  }

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-white p-4 border-r h-screen flex flex-col relative overflow-hidden"
    >
      <div className="mb-8 flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
          <img src={profileImageURL} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">{username}</h2>
          <p className="text-xs text-gray-500"></p>
        </div>
      </div>
      <nav className="space-y-2 flex-grow">
        <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard')}>
          <Home className="mr-2 h-4 w-4" />
          Novedades
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={() => walletExists ? router.push('/wallet') : null}  // Solo permitir click si hay wallet
          disabled={!walletExists}  // Deshabilitar el botón si no hay wallet
        >
          <WalletIcon className="mr-2 h-4 w-4" />
          Billetera
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => router.push('/transferir')}  // Redirigir a la vista de transferencia
        >
          <Send className="mr-2 h-4 w-4" />
          Transferir
        </Button>
        {/* <Button variant="ghost" className="w-full justify-start">
          <Clock className="mr-2 h-4 w-4" />
          Tracking
        </Button> */}
      </nav>
      <Button variant="ghost" className="w-full justify-start mt-auto relative z-10">
        <Settings className="mr-2 h-4 w-4" />
        Configuración
      </Button>
      <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="rgba(117, 252, 86, 0.5)"
            fillOpacity="1"
            d="M0,32L48,37.3C96,43,192,53,288,80C384,107,480,149,576,154.7C672,160,768,128,864,112C960,96,1056,96,1152,112C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="rgba(23, 163, 31, 0.5)"
            fillOpacity="1"
            d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="rgba(20, 83, 45, 0.5)"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </motion.div>
  )
}

export default Sidebar
