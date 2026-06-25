import { Schema, model, Document } from 'mongoose';

export interface ISocialLink extends Document {
  user: Schema.Types.ObjectId;
  website?: string;
  twitter?: string;
  github?: string;
  portfolio?: string;
}

const SocialLinkSchema = new Schema<ISocialLink>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  website: { type: String, default: '' },
  twitter: { type: String, default: '' },
  github: { type: String, default: '' },
  portfolio: { type: String, default: '' }
});

export const SocialLink = model<ISocialLink>('SocialLink', SocialLinkSchema, 'socialLinks');
