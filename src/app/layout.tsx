import type { Metadata } from 'next'
import { Bebas_Neue } from 'next/font/google'
import '@/app/globals.css'

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas'
})

export const metadata: Metadata = {
  title: 'SUMUSIC',
  description: 'Korean music streaming service'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={bebas.variable}>
      <body>{children}</body>
    </html>
  )
}
