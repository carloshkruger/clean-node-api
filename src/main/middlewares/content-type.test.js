const request = require('supertest')
const app = require('../config/app')

describe('Content-Type Middleware', () => {
  test('should return json content type as default', async () => {
    const routeName = '/test_content_type'

    app.get(routeName, (req, res) => res.send(''))

    await request(app).get(routeName).expect('content-type', /json/)
  })

  test('should return xml content type if forced', async () => {
    const routeName = '/test_content_type_xml'

    app.get(routeName, (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app).get(routeName).expect('content-type', /xml/)
  })
})
