'use client'

import { BrowserProvider, parseUnits, ethers } from 'ethers'
import { type Provider, type Signer } from 'ethers'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface DataContextType {
  provider: Provider
  signer: Signer | null
}

const EthersContext = createContext<DataContextType | undefined>(undefined)

export function EhersProvider({ children }: { children: ReactNode }) {
  const ethersInit = async () => {
    let signer = null
    let provider
    if (window.ethereum == null) {
      console.log('MetaMask not installed; using read-only defaults')
      provider = ethers.getDefaultProvider()
    } else {
      provider = new ethers.BrowserProvider(window.ethereum)
      signer = await provider.getSigner()
    }
    // console.log(signer)

    setSigner(signer)
    setProvider(provider)
  }

  const [signer, setSigner] = useState<Signer | null>(null)
  const [provider, setProvider] = useState<Provider>({} as Provider)

  useEffect(() => {
    ethersInit()
  }, [])

  return (
    <EthersContext.Provider
      value={{
        signer,
        provider,
      }}
    >
      {children}
    </EthersContext.Provider>
  )
}
export function useSharedData() {
  const context = useContext(EthersContext)
  if (context === undefined) {
    throw new Error('useSharedData must be used within a DataProvider')
  }
  return context
}
