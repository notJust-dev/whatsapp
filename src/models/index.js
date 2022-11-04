// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const AttachmentType = {
  "IMAGE": "IMAGE",
  "VIDEO": "VIDEO"
};

const { Attachment, ChatRoom, Message, User, UserChatRoom } = initSchema(schema);

export {
  Attachment,
  ChatRoom,
  Message,
  User,
  UserChatRoom,
  AttachmentType
};