import UserModel from '../../models/users.model';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../../services/user.service';
import { SafeUser, User, UserCredentials } from '../../types/user';
import { user, safeUser } from '../mockData.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('User model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveUser', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the saved user', async () => {
      mockingoose(UserModel).toReturn(user, 'create');

      const savedUser = (await saveUser(user)) as SafeUser;

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toEqual(user.username);
      expect(savedUser.dateJoined).toBeDefined();
    });

    it('should return error when username already exists', async () => {
      mockingoose(UserModel).toReturn(user, 'findOne');

      const result = await saveUser(user);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('Username already exists');
      }
    });

    it('should handle database errors', async () => {
      mockingoose(UserModel).toReturn(null, 'findOne');
      mockingoose(UserModel).toReturn(Error('Database error'), 'create');

      const result = await saveUser(user);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('Failed to save user');
      }
    });

    it('should save user with empty password', async () => {
      const userWithEmptyPassword = { ...user, password: '' };
      mockingoose(UserModel).toReturn(null, 'findOne');
      mockingoose(UserModel).toReturn(userWithEmptyPassword, 'create');

      const result = await saveUser(userWithEmptyPassword);

      expect('error' in result).toBe(false);
      if (!('error' in result)) {
        expect(result.username).toEqual(userWithEmptyPassword.username);
      }
    });
  });

  describe('getUserByUsername', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the matching user', async () => {
      mockingoose(UserModel).toReturn(safeUser, 'findOne');

      const retrievedUser = (await getUserByUsername(user.username)) as SafeUser;

      expect(retrievedUser.username).toEqual(user.username);
      expect(retrievedUser.dateJoined).toEqual(user.dateJoined);
    });

    it('should return error when user not found', async () => {
      mockingoose(UserModel).toReturn(null, 'findOne');

      const result = await getUserByUsername('nonexistent');

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('User not found');
      }
    });

    it('should handle database errors', async () => {
      mockingoose(UserModel).toReturn(new Error('Database error'), 'findOne');

      const result = await getUserByUsername(user.username);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('Failed to get user');
      }
    });

    it('should handle empty username', async () => {
      mockingoose(UserModel).toReturn(null, 'findOne');

      const result = await getUserByUsername('');

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('User not found');
      }
    });
  });

  describe('loginUser', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the user if authentication succeeds', async () => {
      mockingoose(UserModel).toReturn(user, 'findOne');

      const credentials: UserCredentials = {
        username: user.username,
        password: user.password,
      };

      const loggedInUser = (await loginUser(credentials)) as SafeUser;

      expect(loggedInUser.username).toEqual(user.username);
      expect(loggedInUser.dateJoined).toEqual(user.dateJoined);
    });

    it('should return error with incorrect password', async () => {
      mockingoose(UserModel).toReturn(user, 'findOne');

      const credentials: UserCredentials = {
        username: user.username,
        password: 'wrongpassword',
      };

      const result = await loginUser(credentials);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('Invalid username or password');
      }
    });

    it('should return error when user not found', async () => {
      mockingoose(UserModel).toReturn(null, 'findOne');

      const credentials: UserCredentials = {
        username: 'nonexistent',
        password: 'anypassword',
      };

      const result = await loginUser(credentials);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('Invalid username or password');
      }
    });

    it('should handle database errors', async () => {
      mockingoose(UserModel).toReturn(new Error('Database error'), 'findOne');

      const credentials: UserCredentials = {
        username: user.username,
        password: user.password,
      };

      const result = await loginUser(credentials);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('Failed to login');
      }
    });
  });

  describe('deleteUserByUsername', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the deleted user when deleted succesfully', async () => {
      mockingoose(UserModel).toReturn(safeUser, 'findOneAndDelete');

      const deletedUser = (await deleteUserByUsername(user.username)) as SafeUser;

      expect(deletedUser.username).toEqual(user.username);
      expect(deletedUser.dateJoined).toEqual(user.dateJoined);
    });

    it('should return error when user not found', async () => {
      mockingoose(UserModel).toReturn(null, 'findOneAndDelete');

      const result = await deleteUserByUsername('nonexistent');

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('User not found');
      }
    });

    it('should handle database errors', async () => {
      mockingoose(UserModel).toReturn(new Error('Database error'), 'findOneAndDelete');

      const result = await deleteUserByUsername(user.username);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('Failed to delete user');
      }
    });

    it('should handle empty username', async () => {
      mockingoose(UserModel).toReturn(null, 'findOneAndDelete');

      const result = await deleteUserByUsername('');

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('User not found');
      }
    });
  });

  describe('updateUser', () => {
    const updatedUser: User = {
      ...user,
      password: 'newPassword',
    };

    const safeUpdatedUser: SafeUser = {
      username: user.username,
      dateJoined: user.dateJoined,
    };

    const updates: Partial<User> = {
      password: 'newPassword',
    };

    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the updated user when updated succesfully', async () => {
      mockingoose(UserModel).toReturn(safeUpdatedUser, 'findOneAndUpdate');

      const result = (await updateUser(user.username, updates)) as SafeUser;

      expect(result.username).toEqual(user.username);
      expect(result.username).toEqual(updatedUser.username);
      expect(result.dateJoined).toEqual(user.dateJoined);
      expect(result.dateJoined).toEqual(updatedUser.dateJoined);
    });

    it('should return error when user not found', async () => {
      mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

      const result = await updateUser('nonexistent', updates);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('User not found');
      }
    });

    it('should handle database errors', async () => {
      mockingoose(UserModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

      const result = await updateUser(user.username, updates);

      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('Failed to update user');
      }
    });

    it('should update multiple fields', async () => {
      const multipleUpdates: Partial<User> = {
        password: 'newPassword',
        username: 'newUsername',
      };

      const updatedSafeUser: SafeUser = {
        username: 'newUsername',
        dateJoined: user.dateJoined,
      };

      mockingoose(UserModel).toReturn(updatedSafeUser, 'findOneAndUpdate');

      const result = await updateUser(user.username, multipleUpdates);

      expect('error' in result).toBe(false);
      if (!('error' in result)) {
        expect(result.username).toBe('newUsername');
      }
    });
  });
});
