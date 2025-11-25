// 'use client'

import { Button, Field, Input, Label } from '@headlessui/react'
import { useState } from 'react'
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useBalance,
} from 'wagmi'
import { erc20Abi, parseUnits } from 'viem'
export default function TransferToken() {
  const { isConnected, address } = useAccount()
  const {
    data: hash,
    isPending: isWriting,
    writeContract,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  const [contract, setContract] = useState<string>(
    '0x1714c5a713D1D4c32A65f882003D746C2C42cB52',
  )

  const [amount, setAmount] = useState<number | string>('')

  const [sendAddress, setSendAddress] = useState<string>('')

  const { data, isLoading, refetch } = useBalance({
    address: address as `0x${string}`,
    token: contract as `0x${string}`,
    query: {
      enabled: isConnected && !!contract,
    },
  })

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract || !sendAddress || !amount) return
    try {
      writeContract({
        address: contract as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [sendAddress as `0x${string}`, parseUnits(amount.toString(), 18)],
      },
        {
          onSuccess(data) {
            console.log('Success:', data)
            refetch()
          }
        }
      )
    } catch (error) {
      console.error('转账失败:', error)
    }
  }

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }
  const handleContract = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContract(e.target.value)
    if (isConnected) {
      refetch()
    }
  }
  const handleSendAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendAddress(e.target.value)
  }
  return (
    <Field>
      <h2 className="my-4 font-bold">erc20转账</h2>
      <div className="mb-4">
        <Label className="text-sm/6 font-medium text-gray-500">合约</Label>
        <Input
          className="ml-3 inline-block border rounded-lg px-2 py-1.5 text-sm/6 text-black min-w-[400px]"
          value={contract}
          onChange={handleContract}
        />
      </div>
      <div className="mb-4">
        <Label className="text-sm/6 font-medium text-gray-500">数量</Label>
        <Input
          className="ml-3 inline-block border rounded-lg px-2 py-1.5 text-sm/6 text-black w-[200px]"
          value={amount}
          onChange={handleAmount}
          type="number"
        />
        <div className="inline-flex items-center box-border px-3">
          {isLoading ? (
            <span className="text-sm text-gray-500">加载中...</span>
          ) : (
            data && (
              <div className="text-sm text-gray-700">
                余额: {data.formatted} {data.symbol}(精度18位)
              </div>
            )
          )}
        </div>
      </div>
      <div className="mb-4">
        <Label className="text-sm/6 font-medium text-gray-500">地址</Label>
        <Input
          className="ml-3 inline-block border rounded-lg px-2 py-1.5 text-sm/6 text-black min-w-[400px]"
          value={sendAddress}
          onChange={handleSendAddress}
        />
        <Button
          className="ml-3 rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500 data-disabled:bg-gray-500 data-disabled:cursor-not-allowed"
          onClick={handleTransfer}
          disabled={isWriting || !sendAddress || !amount}
        >
          {isWriting ? '发送中...' : '发送'}
        </Button>
        <div className="mt-6 space-y-3">
          {hash && (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm font-medium text-blue-800">交易已提交</p>
              <p className="text-xs break-all mt-1">{hash}</p>
            </div>
          )}

          {isConfirming && (
            <div className="flex items-center p-3 bg-yellow-50 rounded-md">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
              <p className="text-yellow-800">等待交易确认...</p>
            </div>
          )}

          {isConfirmed && (
            <div className="p-3 bg-green-50 rounded-md">
              <p className="text-green-800 font-medium">✅ 交易已确认!</p>
              <p className="text-xs break-all mt-1">哈希: {hash}</p>
            </div>
          )}

          {confirmError && (
            <div className="p-3 bg-red-50 rounded-md">
              <p className="text-red-800 font-medium">交易失败</p>
              <p className="text-sm mt-1">{confirmError.message}</p>
            </div>
          )}
        </div>
      </div>
    </Field>
  )
}
