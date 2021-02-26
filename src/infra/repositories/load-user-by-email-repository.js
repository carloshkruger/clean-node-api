const MissingParamError = require('../../utils/errors/missing-param-error')

class LoadUserByEmailRepository {
  constructor(userModel) {
    this.userModel = userModel
  }

  async load(email) {
    if (!email) {
      throw new MissingParamError('email')
    }

    const user = await this.userModel.findOne(
      {
        email
      },
      {
        projection: {
          password: 1
        }
      }
    )

    return user
  }
}

module.exports = LoadUserByEmailRepository
