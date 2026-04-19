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
        <nav className="flex justify-between items-center px-12 py-5 border-b border-border bg-[#0d1117]/85 backdrop-blur-md sticky top-0 z-50">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-accent to-[#a371f7] bg-clip-text text-transparent">
            AI Triage
          </h1>
        </nav>
        {children}
      </body>
    </html>
  )
}
