const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')
const UpdateAccessTokenRepository = require('./update-access-token-repository')

const makeSut = () => {
  return new UpdateAccessTokenRepository()
}

let userModel, fakeUserId

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
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
    const sut = makeSut()
    const token = 'valid_token'

    await sut.update(fakeUserId, token)

    const updatedFakeUser = await userModel.findOne({
      _id: fakeUserId
    })

    expect(updatedFakeUser.accessToken).toBe(token)
  })

  test('should throw if no params are provided', async () => {
    const sut = makeSut()

    await expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    await expect(sut.update(fakeUserId)).rejects.toThrow(
      new MissingParamError('accessToken')
    )
  })
})
