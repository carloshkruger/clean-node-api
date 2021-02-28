const sut = require('./mongo-helper')

describe('Mongo Helper', () => {
  afterAll(async () => {
    await sut.disconnect()
  })

  test('should reconnect when getCollection() is invoked and client is disconnected', async () => {
    await sut.connect(process.env.MONGO_URL)

    await sut.getCollection('users')

    expect(sut.db).toBeTruthy()

    await sut.disconnect()

    expect(sut.db).toBeFalsy()

    await sut.getCollection('users')

    expect(sut.db).toBeTruthy()
  })
})
