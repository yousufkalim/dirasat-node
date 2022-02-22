// Init
const { check, validationResult } = require("express-validator");

/*
====================
Validations
====================
*/

exports.validateBlog = [
  check("blog_title", "Blog Title is required.").notEmpty().trim(),
  check("blog_desc", "Blog Description is required.").notEmpty().trim(),
  check("blog_content", "Blog Content is required.").notEmpty().trim(),
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
