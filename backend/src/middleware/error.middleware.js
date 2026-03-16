const { errorResponse } = require('../constants/apiResponse');

exports.errorHandler = (err, req, res, next) => {
  console.error('Error Details:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 'P2002') {
    statusCode = 400;
    message = 'Duplicate field value entered.';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  return errorResponse(res, statusCode, message);
};
