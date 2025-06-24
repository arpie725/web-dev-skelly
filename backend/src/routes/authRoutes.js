import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import {
  usernameExists,
  validateUsernameAndPassword,
} from '../utils/authHelpers.js';
import { DuplicateEntryError, handleErrors } from '../utils/errors.js';

const router = express.Router();

/** registers a new user
 * - checks if the username already exists in the db
 * - adds the new user into the db
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
    // expected error
    return handleErrors(er, res);
  }
});

export default router;
