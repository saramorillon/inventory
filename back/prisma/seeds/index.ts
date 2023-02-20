import { createHash } from 'crypto'
import { prisma } from '../../src/prisma'

async function run() {
  await prisma.user.create({
    data: {
      username: 'admin',
      password: createHash('sha224').update('admin').digest('hex'),
    },
  })
}

void run()
