import { Logger } from '@saramorillon/logger'
import { ISession } from '../../models/Session'

declare global {
  namespace Express {
    interface Request {
      logger: Logger
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    user: ISession
  }
}
