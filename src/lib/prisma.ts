import { PrismaClient } from '@prisma/client'
import { env } from 'process'

// Add better error logging for Prisma client
const prismaClientSingleton = () => {
  try {
    return new PrismaClient({
      log: ['error'],
      errorFormat: 'pretty',
    })
  } catch (error) {
    console.error('Failed to initialize PrismaClient:', error)
    throw error
  }
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Keep default export for backward compatibility
export default prisma
