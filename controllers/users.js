const User = require("../models/users");
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
    } = req.body;

    // const user = new User({
    //   first_name,
    //   last_name,
    //   date_of_birth,
    //   education_level,
    //   phone,
    //   contact_me,
    //   newsletter,
    // });
    // await user.save();

    const questions = await Questions.find();
    const answers = await Answers.find();

    res.status(200).send({ msg: "Ok", questions, answers });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};
