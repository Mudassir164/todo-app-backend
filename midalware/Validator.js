const { check, validationResult } = require("express-validator"); // second initialize express-validator

exports.validateUserSignUp = [
  check("fullname")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name field is Empty")
    .isString()
    .withMessage("Name must be valid")
    .isLength({ min: 3, max: 20 })
    .withMessage("Full name must be between 3 and 20 characters")
    ,

  check("email").normalizeEmail().isEmail().withMessage("Email is invalid"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters"),
  check("confirmPassword")
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

exports.validationMessage = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({
    sucsess: false,
    message: error,
  });
};

exports.userSignInValidator = [
  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Email/password is invalid"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email/Password is required"),
];
