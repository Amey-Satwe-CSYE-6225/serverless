const sequelize = require("./sequelize.js");
const DataTypes = require("sequelize");

const Tokens = sequelize.define(
  "Tokens",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    token: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    expiry: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Tokens;
