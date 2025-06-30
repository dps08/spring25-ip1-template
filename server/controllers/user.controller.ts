import express, { Response, Router } from 'express';
import { UserRequest, User, UserCredentials, UserByUsernameRequest } from '../types/types';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../services/user.service';

const userController = () => {
  const router: Router = express.Router();

  /**
   * Validates that the request body contains all required fields for a user.
   * @param req The incoming request containing user data.
   * @returns `true` if the body contains valid user fields; otherwise, `false`.
   */
  const isUserBodyValid = (req: UserRequest): boolean => {
    const { username, password } = req.body;
    return !!(username && password && username.trim().length > 0 && password.length > 0);
  };

  /**
   * Handles the creation of a new user account.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the created user or an error.
   * @returns A promise resolving to void.
   */
  const createUser = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      if (!isUserBodyValid(req)) {
        res.status(400).send('Invalid user body');
        return;
      }

      const { username, password } = req.body;
      const user: User = {
        username,
        password,
        dateJoined: new Date(),
      };

      const result = await saveUser(user);

      if ('error' in result) {
        if (result.error === 'Username already exists') {
          res.status(400).json(result);
        } else {
          res.status(500).json(result);
        }
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Handles user login by validating credentials.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const userLogin = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      if (!isUserBodyValid(req)) {
        res.status(400).send('Invalid user body');
        return;
      }

      const credentials: UserCredentials = req.body;
      const result = await loginUser(credentials);

      if ('error' in result) {
        if (result.error === 'Invalid username or password') {
          res.status(401).json(result);
        } else {
          res.status(500).json(result);
        }
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Retrieves a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const getUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;

      if (!username) {
        res.status(400).json({ error: 'Username is required' });
        return;
      }

      const result = await getUserByUsername(username);

      if ('error' in result) {
        if (result.error === 'User not found') {
          res.status(404).json(result);
        } else {
          res.status(500).json(result);
        }
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Deletes a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either the successfully deleted user object or returning an error.
   * @returns A promise resolving to void.
   */
  const deleteUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;

      if (!username) {
        res.status(400).json({ error: 'Username is required' });
        return;
      }

      const result = await deleteUserByUsername(username);

      if ('error' in result) {
        if (result.error === 'User not found') {
          res.status(404).json(result);
        } else {
          res.status(500).json(result);
        }
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Resets a user's password.
   * @param req The request containing the username and new password in the body.
   * @param res The response, either the successfully updated user object or returning an error.
   * @returns A promise resolving to void.
   */
  const resetPassword = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).send('Invalid user body');
        return;
      }

      const result = await updateUser(username, { password });

      if ('error' in result) {
        if (result.error === 'User not found') {
          res.status(404).json(result);
        } else {
          res.status(500).json(result);
        }
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Define routes for the user-related operations.
  router.post('/signup', createUser);
  router.post('/login', userLogin);
  router.get('/getUser/:username', getUser);
  router.delete('/deleteUser/:username', deleteUser);
  router.patch('/resetPassword', resetPassword);

  return router;
};

export default userController;
