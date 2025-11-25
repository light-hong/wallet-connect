import { Button, Field, Input, Label } from '@headlessui/react'
import { useState } from 'react'
import { useReadContract, useAccount, useAccountEffect } from 'wagmi'
import { erc20Abi } from 'viem'
export default function CallBalanceof() {
  const { address, isConnected } = useAccount()
  const [contractAddress, setContractAddress] = useState<string>(
    '0x1714c5a713D1D4c32A65f882003D746C2C42cB52',
  )
  const [accountAddress, setAccountAddress] = useState<string>('')
  useAccountEffect({
    onConnect(data) {
      console.log('Connected!', data)
    },
    onDisconnect() {
      console.log('Disconnected!')
    },
  })

  const { data, isLoading, isError, error, refetch, isFetched } =
    useReadContract({
      abi: erc20Abi,
      address: contractAddress as `0x${string}`,
      functionName: 'balanceOf',
      account: accountAddress as `0x${string}`,
      args: [accountAddress as `0x${string}`],
      query: {
        enabled: !!isConnected && !!contractAddress && !!accountAddress,
      },
    })

  const handleQuery = () => {
    if (contractAddress && isConnected) {
      setAccountAddress(address as `0x${string}`)
      refetch()
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
        disabled={isLoading || !contractAddress || !isConnected}
      >
        {isLoading ? '查询中...' : '查询'}
      </Button>
      {isFetched && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          {isError && (
            <div className="text-red-600 p-3 bg-red-50 rounded border border-red-200">
              <p className="font-medium">查询失败</p>
              {error && (
                <p className="text-sm mt-1">
                  {error.message || '请检查地址格式是否正确'}
                </p>
              )}
            </div>
          )}

          {data && !isLoading && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">代币余额</p>
                  <p className="text-xl font-semibold">{data}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Field>
  )
}
