const User = require("../../models/admins");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//SignUp
exports.signUp = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    // Check User Already Exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User has already exists" });
    }

    // Create User Object
    user = new User({
      first_name,
      last_name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: "User Registered Successfully" });
  } catch (err) {
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// SignIn
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check User Exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("User Not Exists");
    }

    // Match Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid Password");
    }

    // Generate Token
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JSONSECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;

        res.json({ user, token });
      }
    );
  } catch (error) {
    // Error
    console.log("Error ----> ", error);
    res.status(500).send("Something Failed");
  }
};

// Logout
exports.logout = (req, res) => {
  res.cookie("token", "");
  res.status(200).json({
    success: true,
    message: "You are logged out successfully",
  });
};

exports.confirmAuth = (req, res) => {
  // If user authenticated
  res.status(200).send({ msg: "User Authenticated", user: req.user });
};
