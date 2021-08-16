const Admins = require("../models/admins");
const Results = require("../models/results");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

// For Development Purposes
exports.create = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Creating Admin Object
    const admin = new Admins({
      first_name,
      last_name,
      email,
      password,
    });

    const hash = bcrypt.hashSync(password, salt); //Hashing Password
    admin.password = hash; // Saving Hashed Password

    await admin.save();

    res.status(200).send({ msg: "Usre Created", user: admin });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};

exports.getResults = async (req, res) => {
  try {
    //Fetching results from database in descending order according to date
    const results = await Results.find().sort("-createdAt");

    res.status(200).send({ msg: "All Results", results });
  } catch (error) {
    res.status(500).send("Something Failed");
  }
};
