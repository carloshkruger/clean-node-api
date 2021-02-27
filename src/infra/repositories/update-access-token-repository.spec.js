const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')
const UpdateAccessTokenRepository = require('./update-access-token-repository')

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)

  return {
    sut,
    userModel
  }
}

let db, fakeUserId

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    const userModel = db.collection('users')
    await userModel.deleteMany()

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@email.com',
      name: 'any_name',
      password: 'hashed_password'
    })

    fakeUserId = fakeUser.ops[0]._id
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should update the user with the given access token', async () => {
    const { sut, userModel } = makeSut()
    const token = 'valid_token'

    await sut.update(fakeUserId, token)

    const updatedFakeUser = await userModel.findOne({
      _id: fakeUserId
    })

    expect(updatedFakeUser.accessToken).toBe(token)
  })

  test('should throw if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update(fakeUserId, 'any_access_token')

    await expect(promise).rejects.toThrow()
  })

  test('should throw if no params are provided', async () => {
    const { sut } = makeSut()

    await expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    await expect(sut.update(fakeUserId)).rejects.toThrow(
      new MissingParamError('accessToken')
    )
  })
})
