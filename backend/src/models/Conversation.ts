import { Schema, model, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: Schema.Types.ObjectId[];
  listing?: Schema.Types.ObjectId;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: false },
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export const Conversation = model<IConversation>('Conversation', ConversationSchema);
