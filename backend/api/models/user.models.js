const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

/**
 * User Schema
 *
 * @property {String} name - User's full name (required, trimmed, 6-50 characters)
 * @property {String} email - User's email address (required, unique, lowercase)
 * @property {String} password - Hashed password (required, minimum 8 characters)
 * @property {String} university - User's affiliated university (required)
 * @property {String} dept - User's academic department
 * @property {Number} year - User's academic year
 * @property {String} phone - User's phone number (not included in default queries)
 * @property {String} program - User's academic program (required)
 * @property {Date} dob - User's date of birth (required)
 * @property {String} role - User role: "user" or "admin" (defaults to "user")
 * @property {Boolean} share - Whether user's profile information can be shared (defaults to false)
 * @property {Date} createdAt - When the user account was created (defaults to current time)
 * @property {Date} updatedAt - Automatically tracked update timestamp
 * @method {Function} getJWT - Generates a JWT token for the user
 * @method {Function} checkPassword - Validates a provided password against the stored hash
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: 6,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 8,
    },
    university: {
      type: String,
      required: [true, "University is required"],
    },
    dept: String,
    year: Number,
    phone: {
      type: String,
      select: false,
    },
    program: {
      type: String,
      required: [true, "Program is required"],
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    share: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true },
);

userSchema.methods.getJWT = function () {
  return generateToken(this._id);
};

userSchema.methods.checkPassword = async function (inputPassword) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(inputPassword, passwordHash);

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
