import { ClientProvider } from './ClientContext'

import Header from '@/components/Header'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClientProvider>
      <Header showConnectButton={false} />
      {children}
    </ClientProvider>
  )
}
