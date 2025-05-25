

/**
 * Profile Edit Input Validation middleware
 * Handles validation of user profile edit input data
 * @module ValidateProfileInput
 */

/**
 * Profile edit input validation middleware
 *
 * @function validateProfileEditInput
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing profile edit data
 * @param {String} [req.body.name] - User's full name
 * @param {String} [req.body.email] - User's email address
 * @param {Number} [req.body.age] - User's age
 * @param {String} [req.body.gender] - User's gender
 * @param {String} [req.body.bio] - User's biography
 * @param {String} [req.body.photoURL] - URL to user's profile photo
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns error response or calls next() to proceed
 *
 * @description
 * Validates allowed fields for user profile editing.
 * Ensures only permitted fields are present and that the name, if provided, is not empty.
 * If all validations pass, proceeds to the next middleware.
 */
const validateProfileEditInput = (req, res, next) => {
  try {
    const allowedProfileEditFields = [
      "name",
      "email",
      "age",
      "gender",
      "bio",
      "photoURL",
    ];

    const isEditAllowed = Object.keys(req.body).every((field) => {
      return allowedProfileEditFields.includes(field);
    });

    if (!isEditAllowed) throw new Error("Invalid profile edit request");

    if (Object.hasOwn(req.body, "name") && !req.body.name)
      throw new Error("Name cannot be empty");

    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { validateProfileEditInput };
