import { User as UserModel } from '@prisma/client'
import { Logger } from '../../src/libs/logger'

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserModel {}

    interface Request {
      logger: Logger
    }
  }
}
