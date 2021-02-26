const { MongoClient } = require('mongodb')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')

let client, db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)

  return {
    sut,
    userModel
  }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = client.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await client.close()
  })

  test('should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@mail.com')

    expect(user).toBeNull()
  })

  test('should return an user if user is found', async () => {
    const email = 'valid_email@mail.com'

    const { sut, userModel } = makeSut()

    const fakeUser = await userModel.insertOne({
      email,
      name: 'any_name',
      password: 'hashed_password'
    })

    const user = await sut.load(email)

    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password
    })
  })
})
