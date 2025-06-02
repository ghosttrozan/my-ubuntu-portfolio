import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function trackVisitor(req: any) {
  try {
    await prisma.visitor.create({
      data: {
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        path: req.url
      }
    })
  } catch (error) {
    console.error('Error tracking visitor:', error)
  } finally {
    await prisma.$disconnect()
  }
}

export async function getTotalVisitors() {
  try {
    return await prisma.visitor.count()
  } finally {
    await prisma.$disconnect()
  }
}