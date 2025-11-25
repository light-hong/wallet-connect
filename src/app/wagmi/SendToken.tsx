// 'use client'

import { Button, Field, Input, Label } from '@headlessui/react'
import { useState } from 'react'
import {
  useSendTransaction,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi'
import { parseEther } from 'viem'
export default function SendToken() {
  const { isConnected } = useAccount()

  const { data: hash, isPending, sendTransaction, error } = useSendTransaction()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const [ethNumber, setEthNumber] = useState<number | string>('')

  const [sendAddress, setSendAddress] = useState<string>('')

  const handleSendEth = () => {
    console.log('发送地址:', sendAddress)
    if (sendAddress && ethNumber && isConnected) {
      const value = ethNumber.toString()
      const transactionRequest = {
        to: sendAddress as `0x${string}`,
        value: parseEther(value),
      }
      sendTransaction(transactionRequest)
    }
  }

  const handleEthNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEthNumber(e.target.value)
  }
  const handleSendAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendAddress(e.target.value)
  }
  return (
    <Field>
      <h2 className="my-4 font-bold">发送ETH</h2>
      <div className="mb-4">
        <Label className="text-sm/6 font-medium text-gray-500">数量</Label>
        <Input
          className="ml-3 inline-block border rounded-lg px-2 py-1.5 text-sm/6 text-black min-w-[400px]"
          value={ethNumber}
          onChange={handleEthNumber}
          type="number"
        />
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
          onClick={handleSendEth}
          disabled={isPending || !sendAddress || !ethNumber}
        >
          {isPending ? '交易中...' : '发送'}
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

          {error && (
            <div className="p-3 bg-red-50 rounded-md">
              <p className="text-red-800 font-medium">交易失败</p>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
          )}
        </div>
      </div>
    </Field>
  )
}
