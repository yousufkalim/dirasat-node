const User = require("../../models/admins");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// tokenlogin
// SignIn
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check User Exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("User Not Exists");
    }

    // Match Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid credentials");
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

        res.cookie("token", token, { maxAge: 360000, httpOnly: true });
        res.json(user);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};
// tokenlogin end
// Get All
exports.getdata = (req, res) => {
  res.status(200).send("Ok");
};
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
    console.error(err.message);
    res.status(500).send("server error");
  }
};

// exports.login = (req, res, next) => {
//   // Authenticating with passport
//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       // If passport error
//       return next(err);
//     } else if (!user) {
//       // If login error
//       res.status(401).send(info.message);
//     } else {
//       // If Ok then logging in
//       req.logIn(user, (err) => {
//         if (err) {
//           return next(err);
//         }

//         // All done
//         res.status(200).json({ success: true, user: user });
//       });
//     }
//   })(req, res, next);
// };

exports.logout = (req, res) => {
  res.cookie("token", "");
  req.logOut();
  res.status(200).json({
    success: true,
    message: "You are logged out successfully",
  });
};

exports.confirmAuth = (req, res) => {
  // If user authenticated
  res.status(200).send({ msg: "User Authenticated", user: req.user });
};
