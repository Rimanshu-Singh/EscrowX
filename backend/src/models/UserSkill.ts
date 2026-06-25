import { Schema, model, Document } from 'mongoose';

export interface IUserSkill extends Document {
  user: Schema.Types.ObjectId;
  skills: string[];
}

const UserSkillSchema = new Schema<IUserSkill>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  skills: { type: [String], default: [] }
});

export const UserSkill = model<IUserSkill>('UserSkill', UserSkillSchema, 'userSkills');
