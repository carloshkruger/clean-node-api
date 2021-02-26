const jwt = require('jsonwebtoken')

class TokenGenerator {
  constructor(secret) {
    this.secret = secret
  }

  async generate(id) {
    const token = jwt.sign(id, this.secret)
    return token
  }
}

const makeSut = () => {
  return new TokenGenerator('secret')
}

describe('Token Generator', () => {
  test('should return null if JWT returns null', async () => {
    const sut = makeSut()

    jwt.token = null

    const token = await sut.generate('any_id')

    expect(token).toBeNull()
  })

  test('should return a token if JWT returns a token', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')

    expect(token).toBe(jwt.token)
  })

  test('should calls JWT with correct values', async () => {
    const sut = makeSut()

    await sut.generate('any_id')

    expect(jwt.id).toBe('any_id')
    expect(jwt.secret).toBe(sut.secret)
  })
})
