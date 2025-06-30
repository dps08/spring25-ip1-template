import express, { Response, Request } from 'express';
import { FakeSOSocket, AddMessageRequest, Message } from '../types/types';
import { saveMessage, getMessages } from '../services/message.service';

const messageController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided message request contains the required fields.
   *
   * @param req The request object containing the message data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddMessageRequest): boolean => !!(req.body && req.body.messageToAdd);

  /**
   * Validates the Message object to ensure it contains the required fields.
   *
   * @param message The message to validate.
   *
   * @returns `true` if the message is valid, otherwise `false`.
   */
  const isMessageValid = (message: Message): boolean =>
    !!(
      message &&
      message.msg &&
      message.msg.trim().length > 0 &&
      message.msgFrom &&
      message.msgFrom.trim().length > 0
    );

  /**
   * Handles adding a new message. The message is first validated and then saved.
   * If the message is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddMessageRequest object containing the message and chat data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addMessageRoute = async (req: AddMessageRequest, res: Response): Promise<void> => {
    try {
      // validte Request
      if (!isRequestValid(req)) {
        res.status(400).send('Invalid request');
        return;
      }

      const { messageToAdd } = req.body;

      // validate message
      if (!isMessageValid(messageToAdd)) {
        res.status(400).send('Invalid message');
        return;
      }

      // save message
      const result = await saveMessage(messageToAdd);

      if ('error' in result) {
        res.status(500).json(result);
        return;
      }

      // emit socket event for real-time update
      socket.emit('messageUpdate', { msg: result });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add message' });
    }
  };

  /**
   * Fetch all messages in ascending order of their date and time.
   * @param req The request object.
   * @param res The HTTP response object used to send back the messages.
   * @returns A Promise that resolves to void.
   */
  const getMessagesRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const messages = await getMessages();
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve messages' });
    }
  };

  router.post('/addMessage', addMessageRoute);
  router.get('/getMessages', getMessagesRoute);

  return router;
};

export default messageController;
