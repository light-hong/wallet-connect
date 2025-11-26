// 'use client'

import { Button, Field, Input, Label } from '@headlessui/react'
import { useState } from 'react'
import { parseEther } from 'viem'
import { type Account } from 'viem'
import { useSharedData } from './ClientContext'
export default function SendToken() {
  const { walletClient, address } = useSharedData()
  const [ethNumber, setEthNumber] = useState<number | string>('')

  const [sendAddress, setSendAddress] = useState<string>('')

  const [pending, setPending] = useState<boolean>(false)
  const [isSendDisable, setIsSendDisable] = useState<boolean>(true)

  const [hash, setHash] = useState<string>('')

  const handleSendEth = async () => {
    setHash('')

    if (sendAddress && ethNumber && address) {
      setPending(true)
      try {
        const hash = await walletClient!.sendTransaction({
          account: address as string & (`0x${string}` | Account | null),
          to: sendAddress as `0x${string}`,
          value: parseEther(ethNumber.toString()),
          chain: undefined
        })
        setHash(hash)
        setPending(false)
      } catch (error) {
        setPending(false)
      }
    }
  }

  const handleEthNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEthNumber(e.target.value)
    setIsSendDisable(false)
  }
  const handleSendAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendAddress(e.target.value)
    setIsSendDisable(false)
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
          disabled={pending || !sendAddress || !ethNumber || isSendDisable}
        >
          {pending ? '交易中...' : '发送'}
        </Button>
        <div className="mt-6 space-y-3">
          {hash && (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm font-medium text-blue-800">交易已提交</p>
              <p className="text-xs break-all mt-1">{hash}</p>
            </div>
          )}
        </div>
      </div>
    </Field>
  )
}
