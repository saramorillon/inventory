import axios from 'axios'
import { Axios } from '../../../src/services/Axios'
import { getSession, login } from '../../../src/services/session'
import { mock } from '../../mocks'

jest.mock('../../../src/services/Axios')

describe('getSession', () => {
  it('should get session', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: 'session' })
    await getSession()
    expect(axios.get).toHaveBeenCalledWith('/api/session')
  })

  it('should return session', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: 'session' })
    const result = await getSession()
    expect(result).toBe('session')
  })

  it('should return null if error', async () => {
    mock(Axios.get).mockRejectedValue(new Error())
    const result = await getSession()
    expect(result).toBeNull()
  })
})

describe('login', () => {
  it('should login', async () => {
    await login('username', 'password')
    expect(Axios.post).toHaveBeenCalledWith('/api/login', { password: 'password', username: 'username' })
  })
})
