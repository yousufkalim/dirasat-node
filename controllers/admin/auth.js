const passport = require("passport");

exports.login = (req, res, next) => {
  // Authenticating with passport
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // If passport error
      return next(err);
    } else if (!user) {
      // If login error
      res.status(401).send(info.message);
    } else {
      // If Ok then logging in
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        // All done
        res.status(200).json({ success: true, user: user });
      });
    }
  })(req, res, next);
};

exports.logout = (req, res) => {
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
