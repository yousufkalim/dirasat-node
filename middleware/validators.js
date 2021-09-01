// Init
const { check, validationResult } = require("express-validator");

/*
====================
Validations
====================
*/

// Example Validation
exports.validateExample = [
  check("name", "Name is required.").notEmpty().trim(),
  check("cnic", "CNIC is required.").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("gender", "Gender is required.").notEmpty(),
  check("role", "Role is required.").notEmpty(),
  check("number", "Number is required.").notEmpty().trim(),
];

// User Creation Validation
exports.validateUser = [
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("first_name", "First Name is required.").notEmpty().trim(),
  check("last_name", "Last Name is required.").notEmpty().trim(),
  check("education_level", "Education Level is required.").notEmpty().trim(),
  check("phone", "Phone is required.").notEmpty().trim(),
  check("newsletter", "Newsletter is required.").isBoolean(),
  check("school", "School is required.").notEmpty().trim(),
  check("address", "Address is required.").notEmpty(),
  check("address.lat", "Latitude is required.").notEmpty(),
  check("address.lng", "Longitude is required.").notEmpty(),
  check("address.city", "City is required.").notEmpty(),
  check("address.postal_code", "Postal Code is required.").notEmpty(),
  check("address.label", "Address Label is required.").notEmpty(),
  check("date_of_birth", "Date Of Birth is required.").notEmpty().trim(),
];

/*
======================
Result
======================
*/
exports.isValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).send({ errors: errors.array() });
  } else {
    next();
  }
};
