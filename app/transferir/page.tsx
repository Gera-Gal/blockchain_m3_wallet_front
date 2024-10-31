'use client'

import React, { useEffect, useState } from 'react'
import { Bell, Search, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getUserData, getBalances, transferTokens, getWallet } from '@/lib/api'  // Importar transferTokens
import { Button } from "@/components/ui/button"
import Sidebar from '@/components/Sidebar'
import { motion } from "framer-motion"

type UserData = {
  username: string;
}

type Metadata = {
  name: string,
  description: string,
  image: string
}

type Details = {
  name: string,
  symbol: string
}

type Balance = {
  chain: string;
  address: string;
  balance: string;
  lastUpdatedBlockNumber: number;
  type: string;
  tokenId?: string;
  tokenAddress?: string;
  metadataURI?: string;
  metadata?: Metadata;
  details?: Details;
}

export default function TransferirPage() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [balances, setBalances] = useState<Balance[]>([])
  const [wallet, setWallet] = useState<any>(null)
  const [ntfURL, setNftURL] = useState<string>('')
  const [transferData, setTransferData] = useState({
    contract_address: '',
    token_id: '',
    to_address: '',
    amount: '',
    isNative: false  // Para diferenciar si es un token nativo
  })
  const [maxAmount, setMaxAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [privateKey, setPrivateKey] = useState('')  // Mantener la clave privada de forma segura en el estado

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    } else {
      const token = localStorage.getItem('token')
      if (token) {
        fetchUserData(token)
        fetchBalances(token)
        fetchWallet(token)
      }
    }
  }, [isAuthenticated, router])

  const fetchUserData = async (token: string) => {
    try {
      const data = await getUserData(token)
      setUserData(data)
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error)
    }
  }

  const fetchBalances = async (token: string) => {
    try {
      const data = await getBalances(token)
      if (data?.balances) {
        setBalances(data.balances)
      }
    } catch (error) {
      console.error('Error al obtener los balances:', error)
    }
  }

  const fetchWallet = async (token: string) => {
    try {
      const data = await getWallet(token)
      setWallet(data.wallet)
      setPrivateKey(data.wallet.private_key)  // Guardar la clave privada en el estado
    } catch (error) {
      console.error('Error al obtener la wallet:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if(value.split('-').length == 1) {
      if (name === 'contract_address') {
        const selectedBalance = balances.find(balance => balance.tokenAddress === value || (balance.type === 'native' && value === 'native'))
        if (selectedBalance) {
          setMaxAmount(Number(selectedBalance.balance))
          setTransferData(prev => ({
            ...prev,
            token_id: '',
            contract_address: value,
            isNative: selectedBalance.type === 'native'
          }))
        }
      } else {
        setTransferData(prev => ({ ...prev, [name]: value }))
      }
    } else {
      if (name === 'contract_address') {
        const selectedBalance = balances.find(balance => balance.tokenAddress === value.split('-')[0] && balance.tokenId === value.split('-')[1] )
        if (selectedBalance && selectedBalance.metadata) {
          setNftURL(selectedBalance.metadata?.image)
          setTransferData(prev => ({ 
            ...prev, 
            contract_address: value, 
            token_id: value.split('-')[1],
            isNative: selectedBalance.type === 'native' }))
        }
      } else {
        setTransferData(prev => ({ ...prev, [name]: value }))
      }
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value > maxAmount) {
      alert('El monto no puede ser mayor que el balance disponible')
    } else {
      setTransferData(prev => ({ ...prev, amount: e.target.value }))
    }
  }

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem('token')
    
    if (token) {
      let transferPayload;

      // Si es un token nativo (MATIC), no envíes 'contract_address'
      if (transferData.isNative) {
        transferPayload = {
          private_key: privateKey,  // Usar la clave privada desde el estado, no renderizada
          to_address: transferData.to_address,
          amount: transferData.amount,
          currency: 'MATIC',  // Moneda nativa
        }
      } else if (transferData.token_id.length > 0) {
        // Para tokens ERC721
        transferPayload = {
          private_key: privateKey,  // Usar la clave privada desde el estado
          contract_address: transferData.contract_address.split('-')[0],
          to_address: transferData.to_address,
          token_id: transferData.token_id
        }
      } else {
        // Para tokens multitokens o ERC20
        transferPayload = {
          private_key: privateKey,  // Usar la clave privada desde el estado
          contract_address: transferData.contract_address,
          to_address: transferData.to_address,
          amount: transferData.amount
        }
      }

      try {
        const response = await transferTokens(token, transferPayload)
        console.log(response)
        alert('Transferencia exitosa')
        fetchBalances(token)  // Recargar los balances después de la transferencia
      } catch (error) {
        console.error('Error en la transferencia:', error)
        alert('Error en la transferencia')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    router.push('/')
  }

  if (!isAuthenticated || !userData || !wallet) {
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
              Transferir Tokens - {userData.username}
            </motion.h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
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

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Datos de la transferencia</h2>
          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="block font-semibold">Dirección del contrato:</label>
              <select
                name="contract_address"
                className="w-full p-2 border rounded-lg"
                value={transferData.contract_address}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona una dirección de contrato</option>
                {balances.map(balance => (
                  balance.type === 'native' ? (
                    <option key="native" value="native">
                      Token Nativo (MATIC)
                    </option>
                  ) : (
                    balance.tokenAddress && (
                      <option key={
                          balance.details ?
                          balance.tokenAddress :
                          balance.metadata ? 
                            balance.tokenAddress + '-' + balance.tokenId :
                            balance.tokenAddress
                        }
                        value={
                        balance.details ? 
                          balance.tokenAddress : 
                          balance.metadata ? 
                            balance.tokenAddress + '-' + balance.tokenId :
                            balance.tokenAddress
                        }>
                        {balance.tokenAddress.slice(0, 6)}...{balance.tokenAddress.slice(-4)}
                         {balance.details ? ' [' + balance.details.symbol + ']' : 
                         balance.metadata ? ' [' + balance.metadata.name + ']' : ''}
                      </option>
                    )
                  )
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold">Dirección del destinatario:</label>
              <input
                type="text"
                name="to_address"
                className="w-full p-2 border rounded-lg"
                placeholder="Dirección del destinatario"
                value={transferData.to_address}
                onChange={handleInputChange}
                required
              />
            </div>
          {transferData.token_id.length > 0 ? (
            <div>
              <div>
                <label className="block font-semibold">Token ID:</label>
                <input
                  type="number"
                  name="amount"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Token ID"
                  value={transferData.token_id}
                  required
                  disabled
                />
              </div>
              <br />
              { ntfURL !== undefined ? (
                  <div>
                    <label className="block font-semibold">Imagen del NFT:</label>
                    <img
                      src={
                        ntfURL.startsWith('ipfs') ?
                        "https://gateway.pinata.cloud/" + ntfURL.replace(':/','') :
                        ntfURL
                      }
                      alt={transferData.token_id}
                      className="pt-4"
                      width="100rem" />
                  </div> ) : (
                  <div></div>
                )
              }
            </div>
          ) : (
            <div>
              <label className="block font-semibold">Cantidad (Máximo: {maxAmount}):</label>
              <input
                type="number"
                name="amount"
                className="w-full p-2 border rounded-lg"
                placeholder="Cantidad"
                value={transferData.amount}
                onChange={handleAmountChange}
                required
              />
            </div>
          )}
            <div className="flex justify-center items-center">
              <Button className="text-white bg-green-700 hover:bg-green-600" type="submit" disabled={loading}>
                  {loading ? 'Procesando...' : 'Transferir'}
                </Button>
              </div>
            </form>
        </div>
      </motion.div>

      {/* Fondo con gradiente y animaciones */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  )
}
