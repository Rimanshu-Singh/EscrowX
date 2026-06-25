import { Schema, model, Document } from 'mongoose';

export interface IProfile extends Document {
  user: Schema.Types.ObjectId;
  bio: string;
  location: string;
  profileImage?: string;
}

const ProfileSchema = new Schema<IProfile>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  profileImage: { type: String, default: '' }
});

export const Profile = model<IProfile>('Profile', ProfileSchema, 'profiles');
