// Init
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
require("./passport")(passport);

// Common Middleware
module.exports = (app) => {
  app.use(cors());
  app.use(logger("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/uploads", express.static("uploads", { maxAge: "31536000" }));

  // Middleware to Initialize
  app.use(cookieParser(process.env.SESSION_SECRET || "dA47Xd^l%Ar5"));
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dA47Xd^l%Ar5",
      saveUninitialized: true,
      cookie: { maxAge: 7200000 },
      resave: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};
