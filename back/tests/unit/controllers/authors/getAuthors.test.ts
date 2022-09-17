import { getMockRes } from '@jest-mock/express'
import { getAuthors } from '../../../../src/controllers/authors/getAuthors'
import { prisma } from '../../../../src/prisma/client'
import { getMockReq, mockAuthor } from '../../../mocks'

describe('getAuthors', () => {
  beforeEach(() => {
    jest.spyOn(prisma.author, 'findMany').mockResolvedValue([mockAuthor()])
  })

  it('should get authors', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAuthors(req, res)
    expect(prisma.author.findMany).toHaveBeenCalledWith({ include: { books: true }, orderBy: { lastName: 'asc' } })
  })

  it('should send authors', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAuthors(req, res)
    expect(res.json).toHaveBeenCalledWith([mockAuthor()])
  })

  it('should send 500 status on error', async () => {
    jest.spyOn(prisma.author, 'findMany').mockRejectedValue(new Error('500'))
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAuthors(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})
