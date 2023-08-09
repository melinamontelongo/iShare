import Navbar from '@/components/navigation/Navbar'
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
      <body className={`${inter.className} min-h-screen bg-zinc-100 dark:bg-zinc-900 antialiased`}>
        <Providers>
          <Navbar />
          {authModal}
          <div className="sm:container px-1 sm:px-0 sm:max-w-7xl w-screen mx-auto h-full mt-24">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
