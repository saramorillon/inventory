import { Axios } from '../../../src/services/Axios'

describe('interceptor', () => {
  it('should log error', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interceptor = (Axios.interceptors.response as any)['handlers'][0].rejected
    await expect(interceptor(new Error())).rejects.toThrow(new Error())
    expect(console.error).toHaveBeenCalledWith(new Error())
  })
})
