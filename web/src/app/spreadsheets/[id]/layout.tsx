import type { Metadata } from 'next'
import './local.css'

export const metadata: Metadata = {
  title: 'Spreadsheet',
  description: 'Spreadsheet!! Create anytime and on any device.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>{children}</>
  )
}
