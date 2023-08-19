import mockdate from 'mockdate'

vi.mock('@prisma/internals')

mockdate.set('2022-01-01T00:00:00.000Z')
