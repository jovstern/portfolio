type Level = 'info' | 'warn' | 'error'
type Context = Record<string, unknown>

function serializeError(error: unknown) {
  if (error instanceof Error)
    return { name: error.name, message: error.message, stack: error.stack }
  return { message: String(error) }
}

// One JSON object per line, so Vercel's build and runtime logs can be searched by field.
// It runs at build or request time, never while rendering, so reading the clock is fine.
function log(level: Level, msg: string, context?: Context, error?: unknown) {
  const entry = {
    level,
    time: new Date().toISOString(),
    msg,
    ...context,
    ...(error === undefined ? {} : { error: serializeError(error) }),
  }
  console[level](JSON.stringify(entry))
}

export const logger = {
  info: (msg: string, context?: Context, error?: unknown) => log('info', msg, context, error),
  warn: (msg: string, context?: Context, error?: unknown) => log('warn', msg, context, error),
  error: (msg: string, context?: Context, error?: unknown) => log('error', msg, context, error),
}
