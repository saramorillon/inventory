import { Logger } from '../../src/libs/logger'

declare global {
  namespace Express {
    interface User {
      username: string
    }

    interface Request {
      logger: Logger
    }
  }
}
