const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

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
      enum: ["undergraduate", "graduate", "phd"],
      default: "undergraduate",
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
