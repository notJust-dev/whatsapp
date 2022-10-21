// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ChatRoom, Message, User, UserChatRoom } = initSchema(schema);

export {
  ChatRoom,
  Message,
  User,
  UserChatRoom
};