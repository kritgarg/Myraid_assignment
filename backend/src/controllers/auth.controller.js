const { createUser, validateUser, getUserById } = require('../services/auth.service');
const { generateToken } = require('../utils/jwt');
const { decryptData } = require('../utils/encryption');
const { successResponse, errorResponse } = require('../constants/apiResponse');

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken({ id: user.id });

  const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('token', token, options);

  return successResponse(res, statusCode, message, {
    user: { id: user.id, email: user.email },
  });
};

exports.register = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    // Optional: support receiving encrypted password
    if (req.body.encryptedPassword) {
      password = decryptData(req.body.encryptedPassword);
    }

    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide an email and password');
    }

    const user = await createUser(email, password);
    sendTokenResponse(user, 201, res, 'User registered successfully');
  } catch (error) {
    if (error.message === 'Email already in use') {
      return errorResponse(res, 400, error.message);
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    // Optional: support receiving encrypted password
    if (req.body.encryptedPassword) {
      password = decryptData(req.body.encryptedPassword);
    }

    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide an email and password');
    }

    const user = await validateUser(email, password);
    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return errorResponse(res, 401, error.message);
    }
    next(error);
  }
};

exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return successResponse(res, 200, 'User logged out successfully');
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    return successResponse(res, 200, 'User data retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};
