import { Server } from 'socket.io';
import { AnswerUpdatePayload } from './answer';
import { CommentUpdatePayload } from './comment';
import { QuestionResponse, VoteUpdatePayload } from './question';
import { MessageUpdatePayload } from './message';

export type FakeSOSocket = Server<ServerToClientEvents>;
/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: QuestionResponse) => void;
  answerUpdate: (result: AnswerUpdatePayload) => void;
  viewsUpdate: (question: QuestionResponse) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (comment: CommentUpdatePayload) => void;
  messageUpdate: (message: MessageUpdatePayload) => void;
}
