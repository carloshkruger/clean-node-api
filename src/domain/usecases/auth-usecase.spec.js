const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()
  const encrypterSpy = makeEncrypter()
  const tokenGeneratorSpy = makeTokenGenerator()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return {
    sut,
    loadUserByEmailRepositorySpy,
    updateAccessTokenRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
  }
}

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword

      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeLoadUserByEmailRepositorySpy = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email

      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }

  return loadUserByEmailRepositorySpy
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId

      return this.accessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'any_token'

  return tokenGeneratorSpy
}

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepositorySpy {
    async update(userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }

  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()

  return updateAccessTokenRepositorySpy
}

describe('Auth UseCase', () => {
  test('should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()

    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@email.com')

    await expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@email.com', 'any_password')

    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@email.com')
  })

  test('should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null

    const accessToken = await sut.auth(
      'invalid_email@email.com',
      'any_password'
    )

    expect(accessToken).toBe(null)
  })

  test('should return null if an invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false

    const accessToken = await sut.auth('valid@email.com', 'invalid_password')

    expect(accessToken).toBe(null)
  })

  test('should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()

    await sut.auth('valid@email.com', 'any_password')

    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepositorySpy.user.password
    )
  })

  test('should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()

    await sut.auth('valid@email.com', 'valid_password')

    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  test('should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()

    const accessToken = await sut.auth('valid@email.com', 'valid_password')

    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      loadUserByEmailRepositorySpy,
      updateAccessTokenRepositorySpy,
      tokenGeneratorSpy
    } = makeSut()
    await sut.auth('any_email@email.com', 'any_password')

    expect(updateAccessTokenRepositorySpy.userId).toBe(
      loadUserByEmailRepositorySpy.user.id
    )
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(
      tokenGeneratorSpy.accessToken
    )
  })

  test('should throw if invalid dependencies are provided', async () => {
    const suts = [
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({
        loadUserByEmailRepository: {},
        updateAccessTokenRepository: {},
        encrypter: {},
        tokenGenerator: {}
      }),
      new AuthUseCase({
        loadUserByEmailRepository: {},
        updateAccessTokenRepository: makeUpdateAccessTokenRepository(),
        encrypter: makeEncrypter(),
        tokenGenerator: makeTokenGenerator()
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(),
        updateAccessTokenRepository: {},
        encrypter: makeEncrypter(),
        tokenGenerator: makeTokenGenerator()
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(),
        updateAccessTokenRepository: makeUpdateAccessTokenRepository(),
        encrypter: {},
        tokenGenerator: makeTokenGenerator()
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(),
        updateAccessTokenRepository: makeUpdateAccessTokenRepository(),
        encrypter: makeEncrypter(),
        tokenGenerator: {}
      })
    ]

    for (const sut of suts) {
      const promise = sut.auth('any_email@email.com', 'any_password')

      await expect(promise).rejects.toThrow()
    }
  })

  test('should throw if any dependency throws', async () => {
    const suts = [
      new AuthUseCase({
        loadUserByEmailRepository: {
          async load() {
            throw new Error()
          }
        },
        encrypter: makeEncrypter(),
        tokenGenerator: makeTokenGenerator()
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(),
        updateAccessTokenRepository: {
          async update() {
            throw new Error()
          }
        },
        encrypter: makeEncrypter(),
        tokenGenerator: makeTokenGenerator()
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(),
        encrypter: {
          async compare() {
            throw new Error()
          }
        },
        tokenGenerator: makeTokenGenerator()
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(),
        encrypter: makeEncrypter(),
        tokenGenerator: {
          async generate() {
            throw new Error()
          }
        }
      })
    ]

    for (const sut of suts) {
      const promise = sut.auth('any_email@email.com', 'any_password')

      await expect(promise).rejects.toThrow()
    }
  })
})
