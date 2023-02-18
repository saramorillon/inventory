import { Logger } from '../../src/libs/logger'

declare global {
  namespace Express {
    interface User {
      username: string
      isbndbToken: string | null
    }

    interface Request {
      logger: Logger
    }
  }
}
