const config = {
  database: {
    HOST: '127.0.0.1',
    PORT: 3306,
    USERNAME: 'root',
    PASSWORD: 'root',
    DATABASE: 'account_book'
  },
  app: true,
  agent: false,
  jwt:{
    secret:'my_token'
  },
  uploadDir: 'app/static/upload'
}

module.exports = config;