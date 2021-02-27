const MongoHelper = require('../infra/helpers/mongo-helper')
const { mongoUrl } = require('./config/env')

MongoHelper.connect(mongoUrl)
  .then(() => {
    const app = require('./config/app')

    app.listen(5858, () => console.log('Server running'))
  })
  .catch(console.error)
