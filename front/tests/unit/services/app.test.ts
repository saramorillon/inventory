import { getApp } from '../../../src/services/app'
import { Axios } from '../../../src/services/Axios'

jest.mock('../../../src/services/Axios')

describe('getApp', () => {
  it('should get app', async () => {
    jest.mocked(Axios.get).mockResolvedValue({ data: 'app' })
    await getApp()
    expect(Axios.get).toHaveBeenCalledWith('/api/app')
  })

  it('should return app', async () => {
    jest.mocked(Axios.get).mockResolvedValue({ data: 'app' })
    const result = await getApp()
    expect(result).toBe('app')
  })
})
