/**
 * JSON syntax error handler middleware
 *
 * @function jsonErrorHandler
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns error response or calls next()
 *
 * @description
 * Handles JSON syntax errors in request body.
 * If error is a SyntaxError with status 400, returns formatted error response.
 * Otherwise, passes error to next middleware.
 */
const jsonErrorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON format in request body",
    });
  }
  next(err);
};

/**
 * Route not found middleware
 *
 * @function routeNotFound
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns 404 error response
 *
 * @description
 * Handles requests to non-existent routes.
 * Returns a 404 error with details about the attempted route.
 */
const routeNotFound = (req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: `The requested URL ${req.method} ${req.originalUrl} was not found on this server.`,
  });
};

/**
 * Global error handler middleware
 *
 * @function globalErrorHandler
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns 500 error response
 *
 * @description
 * Catches all unhandled errors throughout the application.
 * Logs error stack to console and returns a generic 500 error response.
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: "Something went wrong! Please try again later.",
  });
};

module.exports = {
  jsonErrorHandler,
  globalErrorHandler,
  routeNotFound,
};
