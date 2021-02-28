module.exports = {
  mongoUrl:
    process.env.MONGO_URL ||
    'mongodb+srv://carlos:11235813@cluster0.fxyhw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  tokenSecret: process.env.TOKEN_SECRET || 'secret',
  port: process.env.PORT || 5858
}
