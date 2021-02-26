module.exports = {
  id: '',
  token: 'any_token',

  sign(id, secret) {
    this.id = id
    return this.token
  }
}
