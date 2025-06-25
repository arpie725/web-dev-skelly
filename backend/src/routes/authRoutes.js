import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import {
  usernameExists,
  validateUsernameAndPassword,
} from '../utils/authHelpers.js';
import {
  DuplicateEntryError,
  handleErrors,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors.js';
import passport from 'passport';
import '../middleware/passport.js';

const router = express.Router();
const frontendUrl = process.env.FRONTEND_URL;

// redirect user to google for auth
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// handle callback from google
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${frontendUrl}/auth`,
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    res.redirect(`${frontendUrl}/oauth-redirect?token=${token}`);
  }
);

/** registers a new user
 * - checks if the username already exists in the database
 * - adds the new user into the database
 * - creates a token for the new user
 * - returns username and token
 */
router.post('/register', async (req, res) => {
  const { username: rawUsername, password } = req.body;
  // interacting with the database
  try {
    // check validity of username / password
    const { username, hashedPassword } = await validateUsernameAndPassword(
      rawUsername,
      password
    );
    // check if the username already exists
    const existingUser = await usernameExists(username);
    if (existingUser) {
      throw new DuplicateEntryError('Username already exists');
    }
    // add the user and hashed password into the database
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });
    // create a token to be returned
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    // send back the token to the user
    return res.status(201).json({
      success: true,
      message: `${username} registered successfully`,
      data: {
        username,
        token,
      },
    });
  } catch (er) {
    return handleErrors(er, res);
  }
});

/** logs in an existing user
 * - checks if the username exists in the database
 * - compares the password with the one in the database
 * - returns the username and token
 */
router.post('/login', async (req, res) => {
  const { username: rawUsername, password } = req.body;
  // interacting with the database
  try {
    // validate username / password
    const { username } = await validateUsernameAndPassword(
      rawUsername,
      password
    );
    // check that the username exists in the database
    const user = await usernameExists(username);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    // compare passwords: (user inputted password, hashed password)
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedError('Incorrect password');
    }
    // create the token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    // return the token to the client
    return res.status(200).json({
      success: true,
      message: 'Succesfully logged in',
      data: {
        username,
        token: token,
      },
    });
  } catch (er) {
    return handleErrors(er, res);
  }
});

export default router;
