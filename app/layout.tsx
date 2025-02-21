import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import React from 'react'; // Import React

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ctrl+Learn',
  description: 'AI-powered code tutor',
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}



import './globals.css'