import { Schema, model, Document } from 'mongoose';

export interface IHireRequest extends Document {
  listing: Schema.Types.ObjectId;
  client: Schema.Types.ObjectId;
  freelancer: Schema.Types.ObjectId;
  projectTitle: string;
  projectDescription: string;
  requirements: string;
  deadline: Date;
  budgetAmount: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  createdAt: Date;
}

const HireRequestSchema = new Schema<IHireRequest>({
  listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectTitle: { type: String, required: true },
  projectDescription: { type: String, required: true },
  requirements: { type: String, required: true },
  deadline: { type: Date, required: true },
  budgetAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED'], 
    default: 'PENDING' 
  },
  createdAt: { type: Date, default: Date.now },
});

export const HireRequest = model<IHireRequest>('HireRequest', HireRequestSchema, 'hireRequests');
