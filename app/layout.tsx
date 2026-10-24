import type { Metadata } from 'next'
import { site } from '@/app/lib/site'
import { inter } from '@/app/ui/fonts'
import SiteFooter from '@/app/ui/site-footer'
import SiteHeader from '@/app/ui/site-header'
import './globals.css'

export const metadata: Metadata = {
  title: { template: `%s | ${site.name}`, default: `${site.name} | ${site.role}` },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="bg-primary text-small text-on-primary sr-only rounded-sm font-medium focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:px-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
