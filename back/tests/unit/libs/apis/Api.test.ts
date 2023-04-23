import { sanitize } from '../../../../src/libs/apis/Api'

describe('sanitize', () => {
  it('should return empty array if name is undefined', () => {
    expect(sanitize()).toEqual([])
  })

  it('should replace non letters in name', () => {
    expect(sanitize(',')).toEqual([''])
  })
})
