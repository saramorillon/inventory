import { capitalize } from '../../../src/utils/capitalize'

describe('capitalize', () => {
  it('should capitalize first letter', () => {
    expect(capitalize('l')).toBe('L')
  })

  it('should capitalize letter following space', () => {
    expect(capitalize(' la ')).toBe(' La ')
  })

  it('should capitalize letter following single quote', () => {
    expect(capitalize("'la ")).toBe("'La ")
  })

  it('should not capitalize single letter', () => {
    expect(capitalize(' l ')).toBe(' l ')
    expect(capitalize("'l ")).toBe("'l ")
    expect(capitalize(" l'")).toBe(" l'")
    expect(capitalize("'l'")).toBe("'l'")
  })
})
