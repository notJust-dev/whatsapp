import { ModelInit, MutableModel } from "@aws-amplify/datastore";

export enum AttachmentType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO"
}

type AttachmentMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ChatRoomMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MessageMetaData = {
  readOnlyFields: 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserChatRoomMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Attachment {
  readonly id: string;
  readonly storageKey: string;
  readonly type: AttachmentType | keyof typeof AttachmentType;
  readonly width?: number | null;
  readonly height?: number | null;
  readonly duration?: number | null;
  readonly messageID: string;
  readonly chatroomID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Attachment, AttachmentMetaData>);
  static copyOf(source: Attachment, mutator: (draft: MutableModel<Attachment, AttachmentMetaData>) => MutableModel<Attachment, AttachmentMetaData> | void): Attachment;
}

export declare class ChatRoom {
  readonly id: string;
  readonly name?: string | null;
  readonly image?: string | null;
  readonly Messages?: (Message | null)[] | null;
  readonly users?: (UserChatRoom | null)[] | null;
  readonly LastMessage?: Message | null;
  readonly Attachments?: (Attachment | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly chatRoomLastMessageId?: string | null;
  constructor(init: ModelInit<ChatRoom, ChatRoomMetaData>);
  static copyOf(source: ChatRoom, mutator: (draft: MutableModel<ChatRoom, ChatRoomMetaData>) => MutableModel<ChatRoom, ChatRoomMetaData> | void): ChatRoom;
}

export declare class Message {
  readonly id: string;
  readonly createdAt: string;
  readonly text: string;
  readonly chatroomID: string;
  readonly userID: string;
  readonly images?: (string | null)[] | null;
  readonly Attachments?: (Attachment | null)[] | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Message, MessageMetaData>);
  static copyOf(source: Message, mutator: (draft: MutableModel<Message, MessageMetaData>) => MutableModel<Message, MessageMetaData> | void): Message;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  readonly status?: string | null;
  readonly image?: string | null;
  readonly Messages?: (Message | null)[] | null;
  readonly ChatRooms?: (UserChatRoom | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

export declare class UserChatRoom {
  readonly id: string;
  readonly chatRoom: ChatRoom;
  readonly user: User;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<UserChatRoom, UserChatRoomMetaData>);
  static copyOf(source: UserChatRoom, mutator: (draft: MutableModel<UserChatRoom, UserChatRoomMetaData>) => MutableModel<UserChatRoom, UserChatRoomMetaData> | void): UserChatRoom;
}