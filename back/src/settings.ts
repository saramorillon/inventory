import { ILoggerOptions } from '@saramorillon/logger'
import { bool, cleanEnv, num, str, url } from 'envalid'
import session, { SessionOptions } from 'express-session'
import { HelmetOptions } from 'helmet'
import filestore from 'session-file-store'
import { name, version } from '../package.json'

interface ISettings {
  app: { name: string; version: string; host: string; port: number }
  publicDir: string
  session: SessionOptions & { name: NonNullable<SessionOptions['name']> }
  helmet: HelmetOptions
  logs: ILoggerOptions
}

const env = cleanEnv(process.env, {
  APP_HOST: url(),
  APP_PORT: num({ default: 80 }),
  PUBLIC_DIR: str(),
  COOKIE_DOMAIN: str(),
  COOKIE_NAME: str(),
  SESSION_DIR: str(),
  SESSION_SECRET: str(),
  LOG_SILENT: bool({ default: false }),
  LOG_COLORS: bool({ default: false }),
})

const FileStore = filestore(session)

export const settings: ISettings = {
  app: { name, version, host: env.APP_HOST, port: env.APP_PORT },
  publicDir: env.PUBLIC_DIR,
  session: {
    secret: [env.SESSION_SECRET],
    resave: false,
    saveUninitialized: false,
    store: new FileStore({ path: env.SESSION_DIR }),
    name: env.COOKIE_NAME,
    cookie: {
      domain: env.COOKIE_DOMAIN,
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
    },
  },
  helmet: {
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'https://www.google.com/'],
        styleSrc: ["'self'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'"],
      },
    },
  },
  logs: {
    silent: env.LOG_SILENT,
    colors: env.LOG_COLORS,
  },
}
