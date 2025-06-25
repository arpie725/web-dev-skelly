import axios from 'axios';
import {
  InvalidParamsError,
  NotFoundError,
  UnauthorizedError,
  DuplicateEntryError,
} from '../utils/errors.js';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/** attemps to log in a user
 * - make api call with the given credentials
 * - assign token into local storage
 * @param {string} username
 * @param {string} password
 * @returns None
 */
async function loginUser(username, password) {
  try {
    // make api call
    const res = await axios.post(`${apiUrl}/auth/login`, {
      username: username,
      password: password,
    });
    // handle successful login
    const { data } = res;
    const token = data.data.token;
    // assign token into local storage
    localStorage.setItem('token', token);
    return;
  } catch (er) {
    // get the errorType from [axios/response/data/errorType]
    const et = er.response.data.errorType;
    // handle expected errors
    if (et === 'UnauthorizedError') {
      throw new UnauthorizedError('Incorrect password');
    }
    if (et === 'NotFoundError') {
      throw new NotFoundError('Username not found');
    }
    if (et === 'InvalidParamsError') {
      throw new InvalidParamsError('Username or password cannot be empty');
    }
    // handle unexpected errors
    console.log(er);
    throw er;
  }
}

/** attempts to register a new user
 * - make api call with the given credentials
 * - assign token into local storage
 * @param {string} username
 * @param {string} password
 * @returns None
 */
async function registerUser(username, password) {
  try {
    // make api call
    const res = await axios.post(`${apiUrl}/auth/register`, {
      username: username,
      password: password,
    });
    // handle successful registration
    const { data } = res;
    const token = data.data.token;
    // assign token into local storage
    localStorage.setItem('token', token);
    return;
  } catch (er) {
    const et = er.response.data.errorType;
    // handle expected errors
    if (et === 'InvalidParamsError') {
      throw new InvalidParamsError('Username or password cannot be empty');
    }
    if (et === 'DuplicateEntryError') {
      throw new DuplicateEntryError('Username already exists');
    }
    // handle unexpected errors
    console.log(er);
    throw er;
  }
}

async function verifyToken(token) {
  try {
    // make api call
    const res = await axios.post(
      `${apiUrl}/auth/verify-token`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return { valid: true, user: res.data.user };
  } catch (er) {
    console.log('token could not be verified');
    return { valid: false, user: null };
  }
}

export { loginUser, registerUser, verifyToken };
