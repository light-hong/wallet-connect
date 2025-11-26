import { Field, Input, Label } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { erc20Abi } from 'viem'
import { formatEther, formatUnits, Contract, EventLog, Log } from 'ethers'
import { useSharedData } from './EthersContext'
import Link from 'next/link'
export default function ListenTransfer() {
  const { provider, signer } = useSharedData()
  const [contractAddress] = useState<string>(
    '0x1714c5a713D1D4c32A65f882003D746C2C42cB52',
  )

  const [logs, setLogs] = useState<object[]>([])

  useEffect(() => {
    if (!contractAddress || !provider) return

    let lastBlock = 0
    const contract = new Contract(contractAddress, erc20Abi, provider)

    const interval = setInterval(async () => {
      try {
        const currentBlock = await provider.getBlockNumber()

        if (lastBlock === 0) {
          lastBlock = currentBlock
          return
        }

        if (currentBlock > lastBlock) {
          const events = await contract.queryFilter(
            'Transfer',
            lastBlock,
            currentBlock,
          )

          const newLogs = events.map((event: EventLog | Log) => {
            // 确保我们能够正确访问事件参数
            const args =
              'args' in event && event.args ? event.args : ['', '', BigInt(0)]
            return {
              hash: event.transactionHash,
              from: args[0],
              to: args[1],
              value: formatEther(args[2] || 0),
              blockNumber: event.blockNumber,
            }
          })

          if (newLogs.length > 0) {
            setLogs((prev) => [...newLogs, ...prev])
          }

          lastBlock = currentBlock
        }
      } catch (error) {
        console.error('轮询错误:', error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [contractAddress, provider])

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  return (
    <div>
      <Field>
        <h2 className="my-4 font-bold">监听Transfer事件</h2>
        <Label className="text-sm/6 font-medium text-gray-500">合约</Label>
        <Input
          className="ml-3 inline-block border rounded-lg px-2 py-1.5 text-sm/6 text-black min-w-[400px]"
          value={contractAddress}
          disabled
        />
      </Field>
      <div className="space-y-3 mt-4">
        {logs.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          logs.map((log: any, index) => (
            <div
              key={`${log.hash}-${log.logIndex}-${index}`}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="mb-2">
                <Link
                  href={`https://sepolia.etherscan.io/tx/${log.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {log.hash}
                </Link>
              </div>

              <div className="text-sm text-gray-700">
                <span className="font-mono">{shortenAddress(log.from)}</span>
                <span className="mx-2">→</span>
                <span className="font-mono">{shortenAddress(log.to)}</span>
                <span className="ml-3 font-medium">{log.value}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            暂无 Transfer 事件日志，等待合约事件触发...
          </div>
        )}
      </div>
    </div>
  )
}
