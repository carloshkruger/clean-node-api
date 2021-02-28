const MongoHelper = require('../infra/helpers/mongo-helper')
const { mongoUrl, port } = require('./config/env')

MongoHelper.connect(mongoUrl)
  .then(() => {
    const app = require('./config/app')

    app.listen(port, () => console.log(`Server running at ${port} port`))
  })
  .catch(console.error)
