const MongoHelper = require('../helpers/mongo-helper')

class UpdateAccessTokenRepository {
  constructor(userModel) {
    this.userModel = userModel
  }

  async update(userId, accessToken) {
    await this.userModel.updateOne(
      {
        _id: userId
      },
      {
        $set: {
          accessToken
        }
      }
    )
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)

  return {
    sut,
    userModel
  }
}

let db

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should update the user with the given access token', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@email.com',
      name: 'any_name',
      password: 'hashed_password'
    })

    const userId = fakeUser.ops[0]._id
    const token = 'valid_token'

    await sut.update(userId, token)

    const updatedFakeUser = await userModel.findOne({
      _id: userId
    })

    expect(updatedFakeUser.accessToken).toBe(token)
  })

  test('should throw if no userModel is provided', async () => {
    const userModel = db.collection('users')

    const sut = new UpdateAccessTokenRepository()

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@email.com',
      name: 'any_name',
      password: 'hashed_password'
    })

    const userId = fakeUser.ops[0]._id

    const promise = sut.update(userId, 'any_access_token')

    await expect(promise).rejects.toThrow()
  })
})
