const Admins = require("../models/admins");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

// For Development Purposes
exports.create = async (req, res) => {
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
};
