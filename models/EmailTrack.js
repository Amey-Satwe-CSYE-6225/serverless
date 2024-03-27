const sequelize = require("./sequelize.js");
const DataTypes = require("sequelize");

const EmailTable = sequelize.define(
  "EmailTable",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    Email_Sent_Time: {
      type: DataTypes.DATE,
    },
    Email_Status: {
      type: DataTypes.ENUM("EMAIL_SENT", "USER_VERIFIED"),
    },
  },
  {
    timestamps: true,
    createdAt: "Email_Sent_Time",
  }
);

module.exports = EmailTable;
