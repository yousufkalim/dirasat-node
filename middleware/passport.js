// Intit
const Admins = require("../models/admins");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

// Login Strategy
module.exports = (passport) => {
  passport.use(
    // Making new strategy
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Finding User
      Admins.findOne({ email: email.toLocaleLowerCase() }, (err, user) => {
        // if err
        if (err) throw err;

        // If user not found
        if (!user) {
          return done(null, false, {
            message: "User does not exist...",
          });
        } else {
          // Checking Password
          bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
              return done(null, false, {
                message: "Server Error",
              });
            } else if (!match) {
              return done(null, false, {
                message: "The password is incorrect...",
              });
            } else if (match) {
              return done(null, user);
            }
          });
        }
      });
    })
  );

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize User
  passport.deserializeUser((id, done) => {
    Admins.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
