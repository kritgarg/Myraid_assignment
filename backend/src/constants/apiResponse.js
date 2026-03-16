exports.successResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

exports.errorResponse = (res, statusCode, message, error = null) => {
  const response = {
    success: false,
    message,
  };
  if (error) {
    response.error = error;
  }
  return res.status(statusCode).json(response);
};
