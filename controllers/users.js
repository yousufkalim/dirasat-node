const Users = require("../models/users");
const Questions = require("../models/questions");
const Answers = require("../models/answers");

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
      school,
      address,
    } = req.body;

    const emailInDb = await Users.findOne({ email });
    const questions = await Questions.find();
    const answers = await Answers.find();

    if (emailInDb) {
      return res
        .status(200)
        .send({ msg: "Ok", questions, answers, user: emailInDb });
    } else {
      const user = new Users({
        email,
        first_name,
        last_name,
        education_level,
        phone,
        contact_me,
        newsletter,
        school,
        address,
        date_of_birth: new Date(date_of_birth),
      });

      const savedUser = await user.save();

      return res
        .status(200)
        .send({ msg: "Ok", questions, answers, user: savedUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something Failed");
  }
};
