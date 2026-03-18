let pool: unknown = null
const dbConnected = Boolean(process.env.DATABASE_URL)

export async function getPool(): Promise<unknown> {
  if (!pool && process.env.DATABASE_URL) {
    const { Pool } = await import('pg')
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  }
  if (!pool) {
    throw new Error('Database not configured')
  }
  return pool
}

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  if (!dbConnected) {
    throw new Error('Database not connected. DATABASE_URL not set.')
  }

  const p = await getPool() as { connect: () => Promise<{ query: (t: string, p?: unknown[]) => Promise<{ rows: T[] }>; release: () => void }> }
  const client = await p.connect()
  try {
    const result = await client.query(text, params)
    return result.rows as T[]
  } finally {
    client.release()
  }
}

export async function queryOne<T = unknown>(text: string, params?: unknown[]): Promise<T | null> {
  const results = await query<T>(text, params)
  return results[0] || null
}

export function isDbConnected(): boolean {
  return dbConnected
}

export async function closePool(): Promise<void> {
  if (pool) {
    const p = pool as { end: () => Promise<void> }
    await p.end()
    pool = null
  }
}
