'use client'

import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { type WalletClient, type PublicClient } from 'viem'
import { sepolia } from 'viem/chains'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface DataContextType {
  publicClient: PublicClient
  walletClient: WalletClient
  address: string
}

const ClientContext = createContext<DataContextType | undefined>(undefined)

export function ClientProvider({ children }: { children: ReactNode }) {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  })

  const getWalletClient = async () => {
    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum!),
    })
    const [address] = await walletClient.requestAddresses()
    setAccount(address)
    setWalletClient(walletClient)
    return { walletClient, address }
  }

  const [account, setAccount] = useState<string>('')
  const [walletClient, setWalletClient] = useState<WalletClient>(
    {} as WalletClient,
  )

  useEffect(() => {
    getWalletClient()
  }, [])

  return (
    <ClientContext.Provider
      value={{
        publicClient,
        walletClient,
        address: account,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}
export function useSharedData() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error('useSharedData must be used within a DataProvider')
  }
  return context
}
