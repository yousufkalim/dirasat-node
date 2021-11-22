const Users = require("../models/users");
const Questions = require("../models/questions");
const Answers = require("../models/answers");
const nodemailer = require("nodemailer");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require("twilio")(accountSid, authToken);

var transporter = nodemailer.createTransport({
  // host: "smtp.yandex.com",
  // port: 465,
  // secure: true,
  service: "Yandex",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Create a User
exports.createUser = async (req, res) => {
  const otp = Math.floor(Math.random() * 899999 + 100000);
  try {
    const {
      email,
      first_name,
      last_name,
      date_of_birth,
      education_level,
      phone,
      contact_me,
      newsletter,
      institute,
      address,
    } = req.body;

    const emailInDb = await Users.findOne({ email });

    if (emailInDb) {
      let newUser = {
        email,
        first_name,
        last_name,
        education_level,
        phone,
        contact_me,
        newsletter,
        institute,
        address,
        date_of_birth: new Date(date_of_birth),
        otp,
      };
      // sending otp to number
      // console.log("phone is", `+92${phone.substring(1)}1`);
      twilio.messages
        .create({
          body: `votre code otp est ${otp} pour l'orienteur`,
          from: process.env.TWILIO_NUMBER,
          to: `+33${phone.substring(1)}`,
        })
        .then(async () => {
          console.log("OTP sent");
          // save user
        })
        .catch((e) => {
          console.error(e.code, e.message);
          return res.send({ status: 500, message: e.message });
        });

      let updatedUser = await Users.findOneAndUpdate(
        { _id: emailInDb._id },
        {
          $set: newUser,
        },
        {
          new: true,
        }
      );
      return res.json({ status: 200, message: "ok" });
    } else {
      const user = new Users({
        email,
        first_name,
        last_name,
        education_level,
        phone,
        contact_me,
        newsletter,
        institute,
        address,
        date_of_birth: new Date(date_of_birth),
        otp,
      });

      // sending otp to number
      twilio.messages
        .create({
          body: `Votre code Orientator est ${otp}`,
          from: process.env.TWILIO_NUMBER,
          to: `+33${phone.substring(1)}`,
        })
        .then(async () => {
          console.log("OTP sent");
          // save user
        })
        .catch((e) => {
          console.error(e.code, e.message);
          return res.send({ status: 500, message: e.message });
        });
      const savedUser = await user.save();
      return res.status(200).send({ msg: "Ok" });
    }
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// Verify a User
exports.verifyUser = async (req, res) => {
  try {
    const questions = await Questions.find();
    const answers = await Answers.find().populate("question");
    let user = await Users.findOne({ otp: req.body.otp });
    if (!user) return res.status(202).send("Please enter correct otp");
    user.otp = null;
    userData = await user.save();

    return res
      .status(200)
      .send({ msg: "Ok", questions, answers, user: userData });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// Update a User
exports.updateUser = async (req, res) => {
  try {
    const { id, email, advice, contact, phone } = req.body;
    let newUser = {
      phone,
    };
    let updatedUser = await Users.findOneAndUpdate(
      { _id: id },
      {
        $set: newUser,
      },
      {
        new: true,
      }
    );

    return res.status(200).send({ msg: "Ok" });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

exports.inviteUser = async (req, res) => {
  try {
    const { email, inviteBy, firstName, lastName } = req.body;

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Invitation à Orientator",
      html: `<div><h4> Bonjour</h4><p>${firstName} ${lastName}   t’invites sur la plateforme Orientator, pour t’aider à choisir ton Parcours Supérieur.</p><p>Rejoins-nous sur <a href="https://www.orientator.com/" >https://www.orientator.com/</a></p><p>L’équipe Orientator</p></div>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).send({ msg: "Ok" });
      }
    });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};
