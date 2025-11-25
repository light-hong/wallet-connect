// 'use client'

import { Button, Field, Input, Label, Description } from '@headlessui/react'
import { useState } from 'react'
import { useBalance } from 'wagmi'
export default function QueryBalance() {
  const [queryAddress, setQueryAddress] = useState<string>('')
  const [isQueryEnabled, setIsQueryEnabled] = useState(false)

  const { data, isLoading, isError, error, refetch } = useBalance({
    address: queryAddress as `0x${string}`,
    query: {
      enabled: isQueryEnabled && !!queryAddress,
    },
  })

  const handleQuery = () => {
    console.log('查询地址:', queryAddress)
    if (queryAddress) {
      setIsQueryEnabled(true)
      refetch()
    }
  }

  const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryAddress(e.target.value)
    setIsQueryEnabled(false)
  }
  return (
    <Field>
      <h2 className='my-4 font-bold'>查询余额</h2>
      <Label className="text-sm/6 font-medium text-gray-500">地址</Label>
      <Input
        className="ml-3 inline-block border rounded-lg px-2 py-1.5 text-sm/6 text-black min-w-[400px]"
        value={queryAddress}
        onChange={handleAddress}
      />
      <Button
        className="ml-3 rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500 data-disabled:bg-gray-500 data-disabled:cursor-not-allowed"
        onClick={handleQuery}
        disabled={isLoading || !queryAddress}
      >
        {isLoading ? '查询中...' : '查询'}
      </Button>
      {isQueryEnabled && (
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
                  <p className="text-sm text-gray-500">余额</p>
                  <p className="text-xl font-semibold">{data.formatted}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">代币</p>
                  <p className="text-xl font-semibold">{data.symbol}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Field>
  )
}
