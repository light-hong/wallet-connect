import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})
export async function getWalletClient() {
  if (typeof window === 'undefined') {
    throw new Error('Wallet client is only available in browser environment')
  }

  const { createWalletClient, custom } = await import('viem')

  return createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum!),
  })
}
export async function getAccount() {
  const walletClient = await getWalletClient()

  const [address] = await walletClient.requestAddresses()

  return address
}
