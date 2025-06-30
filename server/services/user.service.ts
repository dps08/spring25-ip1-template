import UserModel from '../models/users.model';
import { User, UserCredentials, UserResponse } from '../types/types';

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user object to be saved, containing user details like username, password, etc.
 * @returns {Promise<UserResponse>} - Resolves with the saved user object (without the password) or an error message.
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  try {
    // Check if username already exists
    const existingUser = await UserModel.findOne({ username: user.username });
    if (existingUser) {
      return { error: 'Username already exists' };
    }

    // Create new user with current date as dateJoined
    const newUser = await UserModel.create({
      username: user.username,
      password: user.password,
      dateJoined: new Date(),
    });

    // Return user without password
    return {
      _id: newUser._id,
      username: newUser.username,
      dateJoined: newUser.dateJoined,
    };
  } catch (error) {
    return { error: 'Failed to save user' };
  }
};

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<UserResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getUserByUsername = async (username: string): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return { error: 'User not found' };
    }

    // Return user without password
    return {
      _id: user._id,
      username: user.username,
      dateJoined: user.dateJoined,
    };
  } catch (error) {
    return { error: 'Failed to get user' };
  }
};

/**
 * Authenticates a user by verifying their username and password.
 *
 * @param {UserCredentials} loginCredentials - An object containing the username and password.
 * @returns {Promise<UserResponse>} - Resolves with the authenticated user object (without the password) or an error message.
 */
export const loginUser = async (loginCredentials: UserCredentials): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOne({ username: loginCredentials.username });

    if (!user) {
      return { error: 'Invalid username or password' };
    }

    // Check if password matches (plain text comparison as requested)
    if (user.password !== loginCredentials.password) {
      return { error: 'Invalid username or password' };
    }

    // Return user without password
    return {
      _id: user._id,
      username: user.username,
      dateJoined: user.dateJoined,
    };
  } catch (error) {
    return { error: 'Failed to login' };
  }
};

/**
 * Deletes a user from the database by their username.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<UserResponse>} - Resolves with the deleted user object (without the password) or an error message.
 */
export const deleteUserByUsername = async (username: string): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOneAndDelete({ username });

    if (!user) {
      return { error: 'User not found' };
    }

    // Return deleted user without password
    return {
      _id: user._id,
      username: user.username,
      dateJoined: user.dateJoined,
    };
  } catch (error) {
    return { error: 'Failed to delete user' };
  }
};

/**
 * Updates user information in the database.
 *
 * @param {string} username - The username of the user to update.
 * @param {Partial<User>} updates - An object containing the fields to update and their new values.
 * @returns {Promise<UserResponse>} - Resolves with the updated user object (without the password) or an error message.
 */
export const updateUser = async (
  username: string,
  updates: Partial<User>,
): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { username },
      { $set: updates },
      { new: true }, // Return the updated document
    );

    if (!user) {
      return { error: 'User not found' };
    }

    // Return updated user without password
    return {
      _id: user._id,
      username: user.username,
      dateJoined: user.dateJoined,
    };
  } catch (error) {
    return { error: 'Failed to update user' };
  }
};
