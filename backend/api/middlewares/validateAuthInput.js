const { isEmail, isStrongPassword } = require("validator");
const { sendError } = require("../utils/response");
const HTTP = require("../utils/httStatus");

const validateSignupInput = (req, res, next) => {
  const allowedSignupFields = [
    "name",
    "email",
    "password",
    "university",
    "dept",
    "program",
    "year",
    "phone",
    "dob",
  ];

  // Check for extra fields
  const extraFields = Object.keys(req.body).filter(
    (field) => !allowedSignupFields.includes(field),
  );
  if (extraFields.length > 0) {
    return sendError(
      res,
      HTTP.BAD_REQUEST,
      `Invalid fields detected: ${extraFields.join(", ")}`,
    );
  }

  // Check for missing fields
  const missingFields = allowedSignupFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return sendError(
      res,
      HTTP.BAD_REQUEST,
      `Missing required fields: ${missingFields.join(", ")}`,
    );
  }

  // If all validations pass
  next();
};

const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  // Validate email
  if (!email) {
    return sendError(res, HTTP.BAD_REQUEST, "Email address is required");
  }

  if (!isEmail(email)) {
    return sendError(
      res,
      HTTP.BAD_REQUEST,
      "Please enter a valid email address",
    );
  }

  // Validate password
  if (!password) {
    return sendError(res, HTTP.BAD_REQUEST, "Password is required");
  }

  // If all validations pass
  next();
};

module.exports = {
  validateSignupInput,
  validateLoginInput,
};
