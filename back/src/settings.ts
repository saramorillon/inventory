import { cleanEnv, num, str } from 'envalid'
import session, { SessionOptions } from 'express-session'
import filestore from 'session-file-store'

const env = cleanEnv(process.env, {
  APP_KEY: str(),
  APP_PORT: num({ default: 80 }),
  ISBN_TOKEN: str(),
  SESSION_DIR: str(),
  COOKIE_DOMAIN: str(),
})

interface ISettings {
  port: number
  keys: string[]
  isbnToken: string
  session: SessionOptions
}

const FileStore = filestore(session)

export const settings: ISettings = {
  port: env.APP_PORT,
  keys: [env.APP_KEY],
  isbnToken: env.ISBN_TOKEN,
  session: {
    secret: [env.APP_KEY],
    resave: false,
    saveUninitialized: false,
    store: new FileStore({ path: env.SESSION_DIR, ttl: 604800000 }),
    name: 'sid',
    cookie: { domain: env.COOKIE_DOMAIN, httpOnly: false, secure: false },
  },
}
