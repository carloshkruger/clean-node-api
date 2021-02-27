const request = require('supertest')
const app = require('../config/app')

describe('JSON Parser middleware', () => {
  test('should parse body as JSON', async () => {
    const routeName = '/test_json_parser'

    app.post(routeName, (req, res) => res.send(req.body))

    await request(app)
      .post(routeName)
      .send({
        name: 'any_name'
      })
      .expect({
        name: 'any_name'
      })
  })
})
