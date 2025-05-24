const sendSuccess = (res, statusCode = 200, message = "", data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data,
  });
};

// Error response
const sendError = (
  res,
  statusCode = 500,
  message = "An unexpected error occurred.",
) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      message: message,
    },
  });
};

module.exports = { sendSuccess, sendError };
