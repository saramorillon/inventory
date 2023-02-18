import { deserializeUser, localStrategy, serializeUser } from '../../../src/libs/passport'
import { prisma } from '../../../src/prisma/client'
import { mockUser } from '../../mocks'

describe('passport', () => {
  describe('serializeUser', () => {
    it('should return user id', () => {
      const done = jest.fn()
      serializeUser(mockUser(), done)
      expect(done).toHaveBeenCalledWith(null, 'username')
    })
  })

  describe('deserializeUser', () => {
    it('should return user', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser())
      const done = jest.fn()
      await deserializeUser('username', done)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'username' },
        select: { username: true },
      })
      expect(done).toHaveBeenCalledWith(null, mockUser())
    })

    it('should return error if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null)
      const done = jest.fn()
      await deserializeUser('username', done)
      expect(done).toHaveBeenCalledWith(new Error('Unknown user username'))
    })

    it('should catch errors', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockRejectedValue(new Error('500'))
      const done = jest.fn()
      await deserializeUser('username', done)
      expect(done).toHaveBeenCalledWith(new Error('500'))
    })
  })

  describe('localStrategy', () => {
    it('should return user', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUser())
      const done = jest.fn()
      await localStrategy('username', 'tutu', done)
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          username: 'username',
          password: 'ff8ce84ffe1c4bed9fbb98eef44560f152461df0db195a92b7c31f97',
        },
        select: {
          username: true,
        },
      })
      expect(done).toHaveBeenCalledWith(null, mockUser())
    })

    it('should return error if no user was found', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null)
      const done = jest.fn()
      await localStrategy('username', 'tutu', done)
      expect(done).toHaveBeenCalledWith(new Error('User not found'))
    })

    it('should catch errors', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockRejectedValue(new Error('500'))
      const done = jest.fn()
      await localStrategy('username', 'tutu', done)
      expect(done).toHaveBeenCalledWith(new Error('500'))
    })
  })
})
