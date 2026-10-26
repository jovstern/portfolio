import type { Metadata } from 'next'
import { site } from '@/app/lib/site'
import { inter } from '@/app/ui/fonts'
import SiteFooter from '@/app/ui/site-footer'
import SiteHeader from '@/app/ui/site-header'
import './globals.css'

export const metadata: Metadata = {
  title: { template: `%s | ${site.name}`, default: `${site.name} | ${site.role}` },
  description: site.hero.lead,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Imported only in development: a static import ships the dev-only component's code (and
  // the web-vitals library) in every production page, even though it never renders there.
  const WebVitals =
    process.env.NODE_ENV === 'development' ? (await import('@/app/ui/web-vitals')).default : null

  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only rounded-sm bg-primary text-small font-medium text-on-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:px-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {WebVitals ? <WebVitals /> : null}
      </body>
    </html>
  )
}
