import MessageModel from '../../models/messages.model';
import { getMessages, saveMessage } from '../../services/message.service';
import { Message } from '../../types/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const message1 = {
  msg: 'Hello',
  msgFrom: 'User1',
  msgDateTime: new Date('2024-06-04'),
};

const message2 = {
  msg: 'Hi',
  msgFrom: 'User2',
  msgDateTime: new Date('2024-06-05'),
};

describe('Message model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveMessage', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the saved message', async () => {
      mockingoose(MessageModel).toReturn(message1, 'create');

      const savedMessage = await saveMessage(message1);

      expect(savedMessage).toMatchObject(message1);
    });

    it('should return error when save fails', async () => {
      mockingoose(MessageModel).toReturn(new Error('Database error'), 'create');

      const result = await saveMessage(message1);

      expect(result).toEqual({ error: 'Failed to save message' });
    });

    it('should handle messages without msgDateTime', async () => {
      const messageWithoutDate = {
        msg: 'Test',
        msgFrom: 'User3',
      };

      const expectedMessage = {
        ...messageWithoutDate,
        msgDateTime: expect.any(Date),
      };

      mockingoose(MessageModel).toReturn(expectedMessage, 'create');

      const savedMessage = await saveMessage(messageWithoutDate as Message);

      expect(savedMessage).toMatchObject({
        msg: 'Test',
        msgFrom: 'User3',
        msgDateTime: expect.any(Date),
      });
    });
  });

  describe('getMessages', () => {
    it('should return all messages, sorted by date', async () => {
      mockingoose(MessageModel).toReturn([message1, message2], 'find');

      const messages = await getMessages();

      expect(messages).toMatchObject([message1, message2]);
    });

    it('should return empty array when error occurs', async () => {
      mockingoose(MessageModel).toReturn(new Error('Database error'), 'find');

      const messages = await getMessages();

      expect(messages).toEqual([]);
    });

    it('should return empty array when no messages exist', async () => {
      mockingoose(MessageModel).toReturn([], 'find');

      const messages = await getMessages();

      expect(messages).toEqual([]);
    });
  });
});
