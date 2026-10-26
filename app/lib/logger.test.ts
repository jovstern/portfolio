import { afterEach, describe, expect, it, vi } from 'vitest'
import { logger } from './logger'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('logger', () => {
  it('writes an error as one JSON line with its context and stack', () => {
    const write = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('e')

    logger.error('boom', { slug: 'x' }, error)

    expect(write).toHaveBeenCalledTimes(1)
    const line = write.mock.calls[0][0]
    expect(typeof line).toBe('string')
    expect(line).not.toContain('\n')
    const entry = JSON.parse(line)
    expect(entry).toMatchObject({ level: 'error', msg: 'boom', slug: 'x' })
    expect(entry.error.message).toBe('e')
    expect(entry.error.stack).toBe(error.stack)
    expect(new Date(entry.time).toISOString()).toBe(entry.time)
  })

  it('writes info to console.info and warn to console.warn', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    logger.info('hello')
    logger.warn('careful', { route: '/' })

    expect(JSON.parse(info.mock.calls[0][0])).toMatchObject({ level: 'info', msg: 'hello' })
    expect(JSON.parse(warn.mock.calls[0][0])).toMatchObject({
      level: 'warn',
      msg: 'careful',
      route: '/',
    })
  })

  it('records a thrown value that is not an Error', () => {
    const write = vi.spyOn(console, 'error').mockImplementation(() => {})

    logger.error('boom', undefined, 'plain string')

    expect(JSON.parse(write.mock.calls[0][0]).error).toEqual({ message: 'plain string' })
  })
})
