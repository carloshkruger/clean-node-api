const request = require('supertest')
const app = require('./app')

describe('App Setup', () => {
  test('should disable x-powered-by header', async () => {
    const routeName = '/test_x_powered_by'

    app.get(routeName, (req, res) => res.send(''))

    const res = await request(app).get(routeName)
    expect(res.headers['x-powered-by']).toBeUndefined()
  })
})
