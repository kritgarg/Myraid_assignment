const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../constants/apiResponse');
const prisma = require('../config/db');

exports.protect = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
    }

    if (!token) {
      return errorResponse(res, 401, 'Not authorized to access this route. Token missing.');
    }

    const decoded = verifyToken(token);

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true },
    });

    if (!currentUser) {
      return errorResponse(res, 401, 'The user belonging to this token no longer exists.');
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid token. Please log in again.');
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Your token has expired. Please log in again.');
    }
    return errorResponse(res, 500, 'Server error in auth middleware', error.message);
  }
};
