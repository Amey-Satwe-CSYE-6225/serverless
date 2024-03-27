const functions = require("@google-cloud/functions-framework");

require("dotenv").config();
let DOMAIN = process.env.DOMAIN || "ameysatwe.me";

var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "Mailgun",
  auth: {
    user: "postmaster@ameysatwe.me",
    pass: "118c9157168d0e159dfc09dee2306deb-f68a26c9-401be456",
  },
});
const sequelize = require("./models/sequelize.js");
const User = require("./models/UserModel.js");
const EmailTrack = require("./models/EmailTrack.js");
const Tokens = require("./models/TokenModel.js");

// User-defined function to send email

// Register a CloudEvent function with the Functions Framework
functions.cloudEvent("myCloudEventFunction", async (cloudEvent) => {
  // Your code here
  // Access the CloudEvent data payload via cloudEvent.data
  // const jsonData = JSON.parse(
  //   Buffer.from(cloudEvent.data, "base64").toString()
  // );
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database synced successfully");
      // console.log("Database synced successfully");
    })
    .catch((error) => {
      console.log("DB connection and sync has failed");
      console.log(`Error syncing database:${error}`);
    });
  const base64name = cloudEvent.data.message.data;
  const data = base64name
    ? Buffer.from(base64name, "base64").toString()
    : "World";
  const decodedData = JSON.parse(data);
  console.log("decoded_data", decodedData, typeof decodedData);
  let receiver_email = decodedData.username;
  let tokenFromDB = await Tokens.findOne({
    where: {
      username: receiver_email,
    },
  });
  let token = tokenFromDB.token;

  var mailOpts = {
    from: "email@ameysatwe.me",
    to: receiver_email,
    subject: "Hi User, Please activate your account in a few simple steps.",
    html: `<b>Please activate your account.</b>\n\n\n. To activate please visit <a href="http://${DOMAIN}:3000/verify_user?username=${receiver_email}&token=${token}">http://${DOMAIN}:3000/verify_user?username=${receiver_email}&token=${token}</a>`,
  };
  transporter.sendMail(mailOpts, async function (err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Sent and entry created in table");
      let email_track = await EmailTrack.create({
        username: receiver_email,
        Email_Status: "EMAIL_SENT",
      });
      await tokenFromDB.set({
        expiry: new Date(Date.now() + 2 * 60000),
      });
      await tokenFromDB.save();
      console.log("Token expiry updated in DB");
    }
  });
});

// send mail with password confirmation
