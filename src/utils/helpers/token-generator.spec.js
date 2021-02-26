const jwt = require('jsonwebtoken')

class TokenGenerator {
  async generate(id) {
    const token = jwt.sign(id, 'secret')
    return token
  }
}

describe('Token Generator', () => {
  test('should return null if JWT returns null', async () => {
    const sut = new TokenGenerator()

    jwt.token = null

    const token = await sut.generate('any_id')

    expect(token).toBeNull()
  })

  test('should return a token if JWT returns a token', async () => {
    const sut = new TokenGenerator()
    const token = await sut.generate('any_id')

    expect(token).toBe(jwt.token)
  })
})
