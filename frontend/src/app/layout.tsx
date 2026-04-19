import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Ticket Triage',
  description: 'AI-Powered Ticket Triage Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <h1>AI Triage</h1>
        </nav>
        {children}
      </body>
    </html>
  )
}
