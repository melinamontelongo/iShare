import Navbar from '@/components/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

import { Toaster } from '@/components/ui/Toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'iShare',
  description: 'The place where you can share with others',
}

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode,
  authModal: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-100 dark:bg-slate-900 antialiased`}>
        <Providers>
          <Navbar />
          {authModal}
          <div className="container max-w-7xl mx-auto h-full">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
