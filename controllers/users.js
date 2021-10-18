const Users = require("../models/users");
const Questions = require("../models/questions");
const Answers = require("../models/answers");
const nodemailer = require("nodemailer");

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
    const questions = await Questions.find();
    const answers = await Answers.find().populate("question");

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
      };
      let updatedUser = await Users.findOneAndUpdate(
        { _id: emailInDb._id },
        {
          $set: newUser,
        },
        {
          new: true,
        }
      );

      return res
        .status(200)
        .send({ msg: "Ok", questions, answers, user: updatedUser });
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
      });

      const savedUser = await user.save();

      return res
        .status(200)
        .send({ msg: "Ok", questions, answers, user: savedUser });
    }
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
