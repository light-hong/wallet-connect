/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Field, Input, Label } from '@headlessui/react'
import { useState } from 'react'
import { erc20Abi } from 'viem'
import { parseEther, formatUnits, Contract } from 'ethers'
import { useSharedData } from './EthersContext'

interface TokenBalance {
  balance: bigint
  formatted: string
  symbol?: string
  decimals?: number
}
export default function CallBalanceof() {
  const { provider, signer } = useSharedData()
  const [contractAddress, setContractAddress] = useState<string>(
    '0x1714c5a713D1D4c32A65f882003D746C2C42cB52',
  )
  const [balance, setBalance] = useState<TokenBalance | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleQuery = async () => {
    if (!contractAddress) return

    setIsLoading(true)
    setError('')
    setBalance(null)
    try {
      const contract = new Contract(contractAddress, erc20Abi, provider)

      const symbol = await contract.symbol()

      const decimals = await contract.decimals()

      const balanceResult = await contract.balanceOf(signer?.getAddress())


      formatUnits(balanceResult, decimals)

      const formattedBalance = formatUnits(
        balanceResult as bigint,
        decimals as number,
      )

      setBalance({
        balance: balanceResult as bigint,
        formatted: formattedBalance,
        symbol: symbol as string,
        decimals: decimals as number,
      })
    } catch (err: any) {
      console.error('查询余额失败:', err)
      setError(err.message || '查询余额失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContractAddress(e.target.value)
  }
  return (
    <Field>
      <h2 className="my-4 font-bold">调用合约方法</h2>
      <Label className="text-sm/6 font-medium text-gray-500">合约</Label>
      <Input
        className="ml-3 inline-block border rounded-lg px-2 py-1.5 text-sm/6 text-black min-w-[400px]"
        value={contractAddress}
        onChange={handleAddress}
      />
      <Button
        className="ml-3 rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500 data-disabled:bg-gray-500 data-disabled:cursor-not-allowed"
        onClick={handleQuery}
        disabled={isLoading || !contractAddress}
      >
        {isLoading ? '查询中...' : '查询'}
      </Button>
      {error && (
        <div className="mt-4 p-3 bg-red-50 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {balance && (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
          <div className="space-y-2">
            <h3 className="font-semibold text-green-800">查询结果</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">余额</p>
                <p className="font-mono font-semibold text-lg">
                  {balance.formatted} {balance.symbol}
                </p>
              </div>
              <div>
                <p className="text-gray-600">精度</p>
                <p className="font-mono">{balance.decimals}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Field>
  )
}
