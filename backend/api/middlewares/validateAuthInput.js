const { sendError } = require("../utils/response");
const HTTP = require("../utils/httStatus");
const validator = require("../utils/validator");

const validateSignupInput = (req, res, next) => {
  // 1. Check if req.body exists and is an object
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return sendError(
      res,
      HTTP.BAD_REQUEST,
      "Invalid request format: expected JSON object",
    );
  }

  const requiredFields = [
    "name",
    "email",
    "password",
    "university",
    "dept",
    "program",
    "year",
    "phone",
    "role",
    "dob",
  ];

  // 2. Get body keys safely
  const bodyKeys = Object.keys(req.body);

  // Check for extra fields
  const extraFields = bodyKeys.filter(
    (field) => !requiredFields.includes(field),
  );
  if (extraFields.length > 0) {
    return sendError(
      res,
      HTTP.BAD_REQUEST,
      `Invalid fields detected: ${extraFields.join(", ")}`,
    );
  }

  // Check for missing fields
  const missingFields = requiredFields.filter(
    (field) =>
      !bodyKeys.includes(field) ||
      req.body[field] === undefined ||
      req.body[field] === null,
  );
  if (missingFields.length > 0) {
    return sendError(
      res,
      HTTP.BAD_REQUEST,
      `Missing required fields: ${missingFields.join(", ")}`,
    );
  }

  // Destructure with default values to prevent undefined errors
  const {
    name = "",
    email = "",
    password = "",
    university = "",
    dept = "",
    program = "",
    year = null,
    phone = "",
    dob = "",
  } = req.body;

  // Validate name
  if (typeof name !== "string" || name.trim().length < 2) {
    return sendError(
      res,
      HTTP.BAD_REQUEST,
      "Name must be at least 2 characters long",
    );
  }

  // Validate email
  if (!validator.isUniversityEmail(email)) {
    return sendError(
      res,
      HTTP.BAD_REQUEST,
      "Please use a valid university email address",
    );
  }

  // Validate phone
  if (!validator.isBangladeshiPhone(phone)) {
    return sendError(
      res,
      HTTP.BAD_REQUEST,
      "Please enter a valid Bangladeshi phone number (e.g. 01XXXXXXXXX)",
    );
  }

  // Validate date of birth
  if (!validator.isUniversityAge(dob)) {
    return sendError(
      res,
      HTTP.BAD_REQUEST,
      "You must be at least 16 years old to register",
    );
  }

  // Validate academic fields
  if (!university.trim() || !dept.trim() || !program.trim() || !year) {
    return sendError(
      res,
      HTTP.BAD_REQUEST,
      "All academic information must be provided and non-empty",
    );
  }

  // Validate year is a number
  if (typeof year !== "number" || year < 1 || year > 5) {
    return sendError(
      res,
      HTTP.BAD_REQUEST,
      "Year must be a number between 1 and 5",
    );
  }

  // If all validations pass
  next();
};

const validateLoginInput = (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email
    if (!email) {
      return sendError(res, HTTP.BAD_REQUEST, "Email address is required");
    }

    // Validate password
    if (!password) {
      return sendError(res, HTTP.BAD_REQUEST, "Password is required");
    }

    // If all validations pass
    next();
  } catch (err) {
    console.error("Authentication error:", err);

    sendError(res, HTTP.SERVER_ERROR, "Authentication service unavailable");
  }
};

module.exports = {
  validateSignupInput,
  validateLoginInput,
};
