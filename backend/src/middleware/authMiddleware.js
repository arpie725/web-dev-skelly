import jwt from 'jsonwebtoken';
import { NotFoundError } from '../utils/errors.js';
import { userExists } from '../utils/authHelpers.js';
import { handleErrors } from '../utils/errors.js';

async function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({
      sucess: false,
      errorType: 'NotFoundError',
      message: 'Token was not found',
    });
  }
  // check if the token is valid using jwt
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        sucess: false,
        errorType: 'UnauthorizedError',
        message: 'Invalid token',
      });
    }
    const userId = decoded.id;
    try {
      // check if the user exists in the database
      const existingUser = await userExists(userId);
      if (!existingUser) {
        throw new NotFoundError('User not found');
      }
      // modify the request to include a userId
      // safe, because the frontend deals with tokens ONLY
      // middleware will use jwt and the JWT_SECRET to convert the token
      // back into the userId to then be passed to the server
      req.userId = userId;
      // continue to the endpoint
      next();
    } catch (er) {
      handleErrors(er, res);
    }
  });
}

export default authMiddleware;
