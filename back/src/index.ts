import cors from 'cors'
import express, { json } from 'express'
import session from 'express-session'
import { createServer } from 'http'
import passport from 'passport'
import { Strategy } from 'passport-local'
import { appLogger } from './libs/logger'
import { deserializeUser, localStrategy, serializeUser } from './libs/passport'
import { logger } from './middleware/logger'
import { router } from './router'
import { settings } from './settings'
import { SocketService } from './socket/socket'

passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)
passport.use(new Strategy(localStrategy))

const app = express()

app.use(json())
app.use(cors({ credentials: true, origin: 'http://localhost:4000' }))
app.use(session(settings.session))
app.use(passport.initialize())
app.use(passport.session())
app.use(logger)
app.use('/api', router)

const server = createServer(app)
SocketService.init(server)

server.listen(settings.port, () => {
  appLogger.info('app_start', { port: settings.port })
})
