import { Logger } from '@saramorillon/logger'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json, static as _static, urlencoded } from 'express'
import session from 'express-session'
import helmet from 'helmet'
import { render } from './controllers/render'
import { logger } from './middlewares/logger'
import { routes } from './routes'
import { settings } from './settings'

export class App {
  private logger = new Logger(settings.logs, { app: settings.app })

  async run() {
    const { success, failure } = this.logger.start('app_start')
    try {
      const app = express()
      app.use(_static(settings.publicDir))
      app.use(cookieParser())
      app.use(json())
      app.use(urlencoded({ extended: true }))
      app.use(cors({ credentials: true, origin: settings.app.host }))
      app.use(session(settings.session))
      app.use(logger)
      app.use(helmet(settings.helmet))
      app.use('/api', routes())
      app.get('*', render)
      await new Promise<void>((resolve) => app.listen(settings.app.port, resolve))
      success()
    } catch (error) {
      failure(error)
    }
  }
}
