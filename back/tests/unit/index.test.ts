import { App } from '../../src/app'

jest.mock('../../src/app')

describe('index', () => {
  it('should run app', () => {
    require('../../src')
    expect(App.prototype.run).toHaveBeenCalled()
  })
})
