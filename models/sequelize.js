const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  database: process.env.DATABASE,
  username: process.env.UNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  dialect: "mysql",
});

module.exports = sequelize;
