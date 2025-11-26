import { EhersProvider } from './EthersContext'

import Header from '@/components/Header'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <EhersProvider>
      <Header showConnectButton={false} />
      {children}
    </EhersProvider>
  )
}
