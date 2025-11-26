/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client'

import { Button, Field, Input, Label } from '@headlessui/react'
import { useEffect, useState } from 'react'
import {
  erc20Abi,
  parseUnits,
  createWalletClient,
  formatUnits,
  custom,
} from 'viem'
import { sepolia } from 'viem/chains'
import { useSharedData } from './ClientContext'

interface TokenBalance {
  balance: bigint
  formatted: string
  symbol?: string
  decimals?: number
}

export default function TransferToken() {
  const { publicClient, walletClient, address } = useSharedData()

  const [contract, setContract] = useState<string>(
    '0x1714c5a713D1D4c32A65f882003D746C2C42cB52',
  )
  const [balance, setBalance] = useState<TokenBalance | null>(null)
  const [isBalanceLoading, setIsBalanceLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [hash, setHash] = useState<string>('')
  const queryBanlance = async () => {
    if (!publicClient || !contract) return

    setIsBalanceLoading(true)
    setBalance(null)
    try {
      const balanceResult = await publicClient.readContract({
        address: contract as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      })
      const [symbol, decimals] = await Promise.all([
        publicClient
          .readContract({
            address: contract as `0x${string}`,
            abi: erc20Abi,
            functionName: 'symbol',
          })
          .catch(() => 'UNKNOWN'),
        publicClient
          .readContract({
            address: contract as `0x${string}`,
            abi: erc20Abi,
            functionName: 'decimals',
          })
          .catch(() => 18),
      ])

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
    } finally {
      setIsBalanceLoading(false)
    }
  }

  const [amount, setAmount] = useState<number | string>('')

  const [sendAddress, setSendAddress] = useState<string>('')

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract || !sendAddress || !amount) return
    try {
      setIsSending(true)
      const { request } = await publicClient.simulateContract({
        account: address as `0x${string}`,
        address: contract as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [
          sendAddress as `0x${string}`,
          parseUnits(amount.toString(), balance?.decimals ?? 18),
        ],
      })
      const hash = await walletClient.writeContract(request)
      setHash(hash)
      setIsSending(false)
    } catch (error) {
      console.log(error);
      setIsSending(false)
    }
  }

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }
  const handleContract = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContract(e.target.value)
  }
  const handleSendAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendAddress(e.target.value)
  }
  useEffect(() => {
    if (address && contract) {
      queryBanlance()
    }
  }, [contract, address])

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
          {isBalanceLoading ? (
            <span className="text-sm text-gray-500">加载中...</span>
          ) : (
            balance && (
              <div className="text-sm text-gray-700">
                余额: {balance.formatted} {balance.symbol}(精度18位)
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
          disabled={isSending || !sendAddress || !amount}
        >
          {isSending ? '发送中...' : '发送'}
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
