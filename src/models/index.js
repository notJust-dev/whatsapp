// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const AttachmentType = {
  "IMAGE": "IMAGE",
  "VIDEO": "VIDEO"
};

const { Attachement, ChatRoom, Message, User, UserChatRoom } = initSchema(schema);

export {
  Attachement,
  ChatRoom,
  Message,
  User,
  UserChatRoom,
  AttachmentType
};