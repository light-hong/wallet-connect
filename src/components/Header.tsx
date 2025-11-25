'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
// import { usePathname } from 'next/navigation'

const Header = () => {
  // const pathname = usePathname()

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-black border-b border-gray-200 shadow-sm">
      {/* 左侧标题 */}
      <div className="flex1 items-center1">
        <Link
          href="/"
          className="text-xl font-bold text-blue-500 hover:text-blue-600 no-underline"
        >
          My DApp
        </Link>
      </div>

      {/* 中间导航链接 */}
      {/* <nav className="flex1 gap-8 items-center">
        <Link
          href="/swap"
          className={`px-4 py-2 no-underline font-medium rounded-md transition-all ${
            pathname === '/swap'
              ? 'text-blue-500 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Swap
        </Link>
        <Link
          href="/pool"
          className={`px-4 py-2 no-underline font-medium rounded-md transition-all ${
            pathname === '/pool'
              ? 'text-blue-500 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Pool
        </Link>
        <Link
          href="/farm"
          className={`px-4 py-2 no-underline font-medium rounded-md transition-all ${
            pathname === '/farm'
              ? 'text-blue-500 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Farm
        </Link>
      </nav> */}

      {/* 右侧钱包连接按钮 */}
      <div className="flex1 items-center1">
        <ConnectButton />
      </div>
    </div>
  )
}

export default Header
