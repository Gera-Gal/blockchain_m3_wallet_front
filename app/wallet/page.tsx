'use client'

import React, { useEffect, useState } from 'react'
import { Bell, Search, RefreshCcw, LogOut, Wallet, Copy, Link, Gift, Boxes } from 'lucide-react'  // Importar más iconos
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getUserData, getBalances, updateAndGetBalances } from '@/lib/api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from '@/components/Sidebar'
import { motion } from "framer-motion"
import { CopyToClipboard } from 'react-copy-to-clipboard'


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
  tokenAddress?: string;
  metadataURI?: string;
  metadata?: Metadata;
  details?: Details;
}

export default function WalletPage() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [balances, setBalances] = useState<Balance[]>([])  // Estado para balances
  const [copied, setCopied] = useState<string | null>(null)  // Estado para saber qué dirección se copió

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    } else {
      const token = localStorage.getItem('token')
      if (token) {
        fetchUserData(token)
        fetchBalances(token)
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

  // Función para obtener los balances
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

  const updateTokenList = async () => {
    setBalances([])
    try {
      const token = localStorage.getItem('token')
      if(token) {
        const data = await updateAndGetBalances(token)
        if (data?.balances) {
          setBalances(data.balances)
        }
      }
    } catch (error) {
      console.error('Error al obtener los balances:', error)
    }
  }

  // Función para cerrar sesión
  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    router.push('/')
  }

  // Función para mostrar los balances agrupados por tipo
  const renderBalanceGroup = (title: string, balances: Balance[], bgGradient: string, icon: JSX.Element) => (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Card className={`overflow-hidden text-white ${bgGradient}`}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            {icon}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Token Address</th>
                {(title === 'Fungible Tokens' || title === 'Multitokens') && <th className="py-2 px-4 border-b">Name</th>}
                <th className="py-2 px-4 border-b">
                  {title === 'NFTs' ? "Name" : "Balance"}
                </th>
                <th className="py-2 px-4 border-b">Block Number</th>
                {title === 'NFTs' && <th className="py-2 px-4 border-b">Image</th>}
                {title === 'NFTs' && <th className="py-2 px-4 border-b">Metadata</th>}
              </tr>
            </thead>
            <tbody>
              {balances.map((balance, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">
                    {balance.tokenAddress ? (
                      <>
                        <span>{balance.tokenAddress.slice(0, 6)}...{balance.tokenAddress.slice(-4)}</span>
                        <CopyToClipboard text={balance.tokenAddress || ''} onCopy={() => setCopied(balance.tokenAddress || null)}>
                          <Button variant="ghost" size="icon" className="ml-2">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </CopyToClipboard>
                      </>
                    ) : 'N/A'}
                    {copied === balance.tokenAddress && (
                      <span className="text-green-500 ml-2 text-sm">Copiado</span>
                    )}
                  </td>
                  {(title === 'Fungible Tokens' || title === 'Multitokens') && (
                    <td className="py-2 px-4 border-b">
                      {balance.details ?
                        balance.details.name : 'N/A'}
                    </td>
                  )}
                  <td className="py-2 px-4 border-b">
                  {title === 'NFTs' ? 
                    balance.metadata ? balance.metadata.name : 'N/A' :
                    balance.balance
                  }
                  </td>
                  <td className="py-2 px-4 border-b">{balance.lastUpdatedBlockNumber}</td>
                  {title === 'NFTs' && (
                    <td className="py-2 px-4 border-b">
                      {balance.metadata && balance.metadata.image && balance.metadata.description ?
                        <img
                          src={
                            balance.metadata.image.startsWith('ipfs') ?
                            "https://gateway.pinata.cloud/" + balance.metadata.image.replace(':/','') :
                            balance.metadata.image
                          }
                          alt={balance.metadata.description}
                          width="100rem"
                        /> : 'N/A'}
                    </td>
                  )}
                  {title === 'NFTs' && (
                    <td className="py-2 px-4 border-b">
                      {balance.metadataURI && balance.metadataURI.startsWith('https://gateway.pinata.cloud/ipfs/') ? (
                        <a href={balance.metadataURI} target="_blank" rel="noopener noreferrer" className="underline">
                          Ver Metadata
                        </a>
                      ) : 'N/A'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </motion.div>
  )

  // Separar los balances por tipo y asociar iconos
  const nativeBalances = balances.filter(balance => balance.type === 'native')
  const multitokenBalances = balances.filter(balance => balance.type === 'multitoken')
  const fungibleBalances = balances.filter(balance => balance.type === 'fungible')
  const nftBalances = balances.filter(balance => balance.type === 'nft')

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
              Wallet de {userData.username}
            </motion.h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={updateTokenList}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
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
          {nativeBalances.length > 0 && renderBalanceGroup('Native Tokens Matics', nativeBalances, 'bg-gradient-to-br from-purple-600 to-purple-700', <Link />)}
          {multitokenBalances.length > 0 && renderBalanceGroup('Multitokens', multitokenBalances, 'bg-gradient-to-br from-blue-600 to-blue-700', <Boxes />)}
          {fungibleBalances.length > 0 && renderBalanceGroup('Fungible Tokens', fungibleBalances, 'bg-gradient-to-br from-green-500 to-green-600', <Wallet />)}
          {nftBalances.length > 0 && renderBalanceGroup('NFTs', nftBalances, 'bg-gradient-to-br from-lime-700 to-lime-900', <Gift />)}
        </div>
      </motion.div>
      {/* <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div> */}
    </div>
  )
}
