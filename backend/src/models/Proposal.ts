import { Schema, model, Document } from 'mongoose';

export interface IProposal extends Document {
  projectId: Schema.Types.ObjectId; // references Listing
  projectOwnerId: Schema.Types.ObjectId; // references User
  projectOwnerWallet: string;
  freelancerId: Schema.Types.ObjectId; // references User
  freelancerWallet: string;
  freelancerUsername: string;
  coverLetter: string;
  portfolio?: string;
  expectedDelivery: number; // In days
  bidAmount: number;
  experienceNotes?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  createdAt: Date;
}

const ProposalSchema = new Schema<IProposal>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  projectOwnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectOwnerWallet: { type: String, required: true },
  freelancerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  freelancerWallet: { type: String, required: true },
  freelancerUsername: { type: String, required: true },
  coverLetter: { type: String, required: true },
  portfolio: { type: String, default: '' },
  expectedDelivery: { type: Number, required: true },
  bidAmount: { type: Number, required: true },
  experienceNotes: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'], 
    default: 'PENDING' 
  },
  createdAt: { type: Date, default: Date.now }
});

export const Proposal = model<IProposal>('Proposal', ProposalSchema, 'proposals');
