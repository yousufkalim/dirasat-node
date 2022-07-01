const Users = require("../models/users");
const Questions = require("../models/questions");
const Answers = require("../models/answers");
const Contact = require("../models/contact");
const nodemailer = require("nodemailer");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require("twilio")(accountSid, authToken);

var transporter = nodemailer.createTransport({
  // host: "smtp-relay.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});
console.log("process.env.EMAIL", process.env.EMAIL);
console.log("process.env.process.env.PASSWORD", process.env.PASSWORD);

// Create a User
exports.createUser = async (req, res) => {
  // const otp = Math.floor(Math.random() * 899999 + 100000);
  const otp = "1122";
  console.log("req.body", req.body);
  try {
    const {
      email,
      first_name,
      last_name,
      date_of_birth,
      class_list,
      phone,
      wilaya,
      Bac_Serie,
      school_city,
      school_name,
      language,
      accept_condition,
      level1,
      score,
      stayAlgeria,
      budget,
      whichCountry
    } = req.body;

    const emailInDb = await Users.findOne({ email });

    if (emailInDb) {
      let newUser = {
        email,
        first_name,
        last_name,
        class_list,
        phone,
        wilaya,
        Bac_Serie,
        school_city,
        school_name,
        language,
        accept_condition,
        level1,
        score,
        stayAlgeria,
        budget,
        whichCountry,
        date_of_birth: new Date(date_of_birth),
        otp
      };
      // sending otp to number

      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Code de vérification Dirasat",
        html: `<div><h4> Bonjour,</h4><p>Voici le code de vérification pour accéder à ton questionnaire d’orientation Dirasat :${otp}  </p><p>L'équipe Dirasat</p></div>`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("OTP sent");
        }
      });
      console.log("algerian phon e is", `+213${phone.substring(1)}`);
      // twilio.messages
      //   .create({
      //     body: `Votre code Dirasat est ${otp}`,
      //     from: process.env.TWILIO_NUMBER,
      //     to: `+33${phone.substring(1)}`,
      //     to: `+213${phone.substring(1)}`
      //   })
      //   .then(async () => {
      //     console.log("OTP sent");
      //     // save user
      //   })
      //   .catch((e) => {
      //     console.error(e.code, e.message);
      //     return res.send({ status: 500, message: e.message });
      //   });

      let updatedUser = await Users.findOneAndUpdate(
        { _id: emailInDb._id },
        {
          $set: newUser
        },
        {
          new: true
        }
      );
      return res.json({ status: 200, message: "ok" });
    } else {
      const user = new Users({
        email,
        first_name,
        last_name,
        class_list,
        phone,
        wilaya,
        Bac_Serie,
        school_city,
        school_name,
        language,
        accept_condition,
        level1,
        score,
        stayAlgeria,
        budget,
        whichCountry,
        date_of_birth: new Date(date_of_birth),
        otp
      });
      // sending otp to number
      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Code de vérification Dirasat",
        html: `<div><h4> Bonjour,</h4><p>Voici le code de vérification pour accéder à ton questionnaire d’orientation Dirasat :${otp}  </p><p>L'équipe Dirasat</p></div>`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("OTP sent");
        }
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
    let user = await Users.findOne({ otp: req.body.otp });
    if (!user) return res.status(202).send("Please enter correct otp");
    return res.status(200).send({ msg: "Ok" });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};
// Verify a User
exports.verifyUserbyEmail = async (req, res) => {
  try {
    const questions = await Questions.find();
    const answers = await Answers.find().populate("question");
    let user = await Users.findOne({ otp: req.body.otp });
    if (!user) return res.status(202).send("Please enter correct otp");
    user.otp = null;
    userData = await user.save();
    console.log("user11", user);
    console.log("user Data22", userData);

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
      phone
    };
    let updatedUser = await Users.findOneAndUpdate(
      { _id: id },
      {
        $set: newUser
      },
      {
        new: true
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
      subject: "Invitation sur Dirasat",
      html: `<div><h4> Bonjour,</h4><p>${firstName} ${lastName}   t'invite sur la plateforme Dirasat pour t'aider à choisir ton parcours supérieur.</p><p>Rejoins-nous sur <a href="https://www.dirasat.com/" >https://www.dirasat.com/</a></p><p>L'équipe Dirasat</p></div>`
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

exports.contactUs = async (req, res) => {
  try {
    const { name, email, message, description } = req.body;
    // Creating Admin Object
    const contact = new Contact({
      name,
      email,
      message,
      description
    });
    var mailOptions = {
      from: email,
      to: process.env.EMAIL,
      subject: "Nouveau contact Dirasat",
      html: `<div><h4> </h4><p>Prénom et nom : ${name}</p><p>Email: ${email}</p><p>Message : ${message}</p><p>Votre Message : ${description}</p></div>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).send({ msg: "Ok" });
      }
    });
    await contact.save();
    res.status(200).send({ msg: "Success" });
  } catch (error) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};
