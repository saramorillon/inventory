import { getMockRes } from '@jest-mock/express'
import { getBooks } from '../../../../src/controllers/books/getBooks'
import { prisma } from '../../../../src/prisma/client'
import { getMockReq, mockBook } from '../../../mocks'

describe('getBooks', () => {
  beforeEach(() => {
    jest.spyOn(prisma.book, 'findMany').mockResolvedValue([mockBook()])
  })

  it('should get books', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBooks(req, res)
    expect(prisma.book.findMany).toHaveBeenCalledWith({ include: { authors: true }, orderBy: { updatedAt: 'desc' } })
  })

  it('should send books', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBooks(req, res)
    expect(res.json).toHaveBeenCalledWith([mockBook()])
  })

  it('should send 500 status on error', async () => {
    jest.spyOn(prisma.book, 'findMany').mockRejectedValue(new Error('500'))
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBooks(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: '500', stack: expect.any(String) })
  })
})
