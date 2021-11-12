import http from 'http'
import { Server } from 'socket.io'

export class SocketService {
  static io?: Server = undefined

  static init(server: http.Server): void {
    SocketService.io = new Server(server, { cors: { origin: '*' } })
  }

  static send(message: string, ...args: unknown[]): void {
    if (!this.io) throw new Error('You need to init socket.io server before sending a message')
    this.io.emit(message, ...args)
  }
}
