import { Providers } from '@/app/wagmi/Providers'

import Header from '@/components/Header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <Header />
      {children}
    </Providers>
  )
}
