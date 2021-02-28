const request = require('supertest')
const bcrypt = require('bcrypt')
const MongoHelper = require('../../infra/helpers/mongo-helper')
const app = require('../config/app')

let userModel

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return 200 when valid credentials are provided', async () => {
    const email = 'valid_email@mail.com'
    const password = '123'
    const hashedPassword = bcrypt.hashSync(password, 10)

    await userModel.insertOne({
      email,
      password: hashedPassword,
      name: 'any_name'
    })

    await request(app)
      .post('/api/login')
      .send({
        email,
        password
      })
      .expect(200)
  })

  test('should return 401 when invalid credentials are provided', async () => {
    const email = 'valid_email@mail.com'
    const password = '123'

    await request(app)
      .post('/api/login')
      .send({
        email,
        password
      })
      .expect(401)
  })
})
