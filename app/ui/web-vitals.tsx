'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { logger } from '@/app/lib/logger'

type Metric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0]

// Module scope keeps the callback's reference stable across renders. In development, Strict
// Mode mounts the component twice, so a metric can be logged twice there.
function logMetric({ name, value, rating, navigationType }: Metric) {
  logger.info('web-vital', { name, value, rating, navigationType })
}

/** Development only: Web Vitals go to the browser console through the logger. */
export default function WebVitals() {
  useReportWebVitals(logMetric)
  return null
}
