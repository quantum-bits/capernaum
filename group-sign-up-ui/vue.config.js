let Dotenv;
Dotenv = require("dotenv-webpack");

module.exports = {
  devServer: {
    proxy: "http://localhost:3000",
  },

  configureWebpack: {
    plugins: [new Dotenv()],
  },

  // not sure if the following is required....
  "transpileDependencies": [
    "vuetify"
  ]

};