import express from 'express';
import prisma from '../prismaClient.js';
import { userExists } from '../utils/authHelpers.js';
import { handleErrors } from '../utils/errors.js';

const router = express.Router();

// NOTE: middleware authenticates the token before reaching this endpoint!

/** retrieves the username of a user
 * - query the database for the user
 * - return just the username
 */
router.get('/', async (req, res) => {
  const userId = req.userId;
  // interact with the database
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    // return the username
    return res.status(200).json({
      success: true,
      message: 'Retrieved the user',
      data: {
        username: user.username,
      },
    });
  } catch (er) {
    handleErrors(er, res);
  }
});

/** deletes a user from the database
 * - only allows the user to delete their own entry
 * - query the database
 * - return 204 code
 */
router.delete('/', async (req, res) => {
  const userId = req.userId;
  // interact with the database
  try {
    // delete the user from the database
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return res.sendStatus(204);
  } catch (er) {
    handleErrors(er, res);
  }
});

export default router;
