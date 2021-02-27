const request = require('supertest')
const app = require('../config/app')

describe('Cors Setup', () => {
  test('should enable cors', async () => {
    const routeName = '/test_cors'

    app.get(routeName, (req, res) => res.send(''))

    const res = await request(app).get(routeName)
    expect(res.headers['access-control-allow-origin']).toBe('*')
    expect(res.headers['access-control-allow-methods']).toBe('*')
    expect(res.headers['access-control-allow-headers']).toBe('*')
  })
})
