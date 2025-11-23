import type { ReactNode } from 'react'

export default function LoginLayout({ children }: { children: ReactNode }) {
  // Simple layout without DashboardShell for login page
  return <>{children}</>
}
