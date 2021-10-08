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
