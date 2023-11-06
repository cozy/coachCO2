import { makeQueriesByAccountsId } from 'src/components/EmptyContent/helpers.js'

describe('makeQueriesByAccountsId', () => {
  it('should create well formatted object', () => {
    const res = makeQueriesByAccountsId([{ _id: 'id1' }, { _id: 'id2' }])

    expect(res).toMatchObject({
      id1: {
        as: expect.any(String),
        fetchPolicy: expect.any(Function),
        query: expect.any(Object)
      },
      id2: {
        as: expect.any(String),
        fetchPolicy: expect.any(Function),
        query: expect.any(Object)
      }
    })
  })
})
