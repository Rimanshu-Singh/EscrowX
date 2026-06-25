import { Schema, model, Document } from 'mongoose';

export interface IEscrowUpdate extends Document {
  escrow: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  updateNumber: number;
  title: string;
  description: string;
  attachments: string[];
  status: 'pending' | 'approved' | 'revision_requested';
  revisionNotes?: string;
  createdAt: Date;
}

const EscrowUpdateSchema = new Schema<IEscrowUpdate>({
  escrow: { type: Schema.Types.ObjectId, ref: 'Escrow', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updateNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  attachments: { type: [String], default: [] },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'revision_requested'], 
    default: 'pending' 
  },
  revisionNotes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export const EscrowUpdate = model<IEscrowUpdate>('EscrowUpdate', EscrowUpdateSchema, 'escrowUpdates');
