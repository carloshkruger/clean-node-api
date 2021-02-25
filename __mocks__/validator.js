module.exports = {
  email: '',
  isEmailValid: true,

  isEmail(email) {
    this.email = email
    return this.isEmailValid
  }
}
