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
    const answers = await Answers.find().populate("question");

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

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const { pageNumber, pageSize } = req.query;

    //Fetching Users from database in descending order according to date
    const users = await Users.find()
      .sort("-createdAt")
      .skip((pageNumber - 1) * pageSize)
      .limit(parseInt(pageSize));

    res.status(200).send({ msg: "All Users", users });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};

// Get One User By id
exports.getOneUser = async (req, res) => {
  try {
    //Fetching User From DB
    const user = await Users.findById(req.params._id);
    if (!user) return res.status(404).send("User not Found");

    res.status(200).send({ msg: "User Fetched", user });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};

// Delete One User By id
exports.deleteUser = async (req, res) => {
  try {
    //Deleting User From DB
    const user = await Users.findByIdAndRemove(req.params._id);
    if (!user) return res.status(404).send("User not Found");

    res.status(200).send("User Deleted");
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};
