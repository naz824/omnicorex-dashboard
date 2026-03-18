import { Pool, type PoolClient } from 'pg'

let pool: Pool | null = null
const dbConnected = Boolean(process.env.DATABASE_URL)

export function getPool(): Pool {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
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

  const client = await getPool().connect()
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
    await pool.end()
    pool = null
  }
}
