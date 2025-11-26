import { Button, Field, Input, Label } from '@headlessui/react'
import { useState } from 'react'
import { formatEther } from 'viem'
import { useSharedData } from './EthersContext'
export default function QueryBalance() {
  const [queryAddress, setQueryAddress] = useState<string>('')

  const [balance, setBalance] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const { provider } = useSharedData()

  const fetchBalance = async () => {
    if (!queryAddress) return

    setIsLoading(true)
    setError('')

    try {
      const balanceWei = await provider.getBalance(queryAddress)
      const balanceEth = formatEther(balanceWei)
      setBalance(balanceEth)
    } catch (err) {
      console.error('获取余额失败:', err)
      setError('获取余额失败')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Field>
      <h2 className="my-4 font-bold">ethers查询余额</h2>
      <Label className="text-sm/6 font-medium text-gray-500">地址</Label>
      <Input
        className="ml-3 inline-block border rounded-lg px-2 py-1.5 text-sm/6 text-black min-w-[400px]"
        value={queryAddress}
        onChange={(e) => setQueryAddress(e.target.value)}
      />
      <Button
        className="ml-3 rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500 data-disabled:bg-gray-500 data-disabled:cursor-not-allowed"
        onClick={fetchBalance}
        disabled={isLoading || !queryAddress}
      >
        {isLoading ? '查询中...' : '查询'}
      </Button>
      {balance && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          {error && (
            <div className="text-red-600 p-3 bg-red-50 rounded border border-red-200">
              <p className="font-medium">查询失败</p>
              {error && (
                <p className="text-sm mt-1">
                  {error || '请检查地址格式是否正确'}
                </p>
              )}
            </div>
          )}
          {balance && !isLoading && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">余额</p>
                  <p className="text-xl font-semibold">{balance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">代币</p>
                  <p className="text-xl font-semibold">ETH</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Field>
  )
}
