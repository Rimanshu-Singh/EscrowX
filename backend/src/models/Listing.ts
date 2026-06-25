import { Schema, model, Document } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  coverImage?: string;
  type: 'SERVICE' | 'PROJECT';
  role: 'CLIENT' | 'FREELANCER';
  createdBy: Schema.Types.ObjectId;
  price: number;
  budget: number;
  deliveryDays: number;
  skills: string[];
  tags: string[];
  attachments: string[];
  status: 'active' | 'draft' | 'completed';
  createdAt: Date;
  // Ownership fields
  projectId?: any;
  serviceId?: any;
  ownerId?: any;
  ownerWalletAddress?: string;
  ownerUsername?: string;
}

const ListingSchema = new Schema<IListing>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, default: '' },
  type: { type: String, enum: ['SERVICE', 'PROJECT'], required: true },
  role: { type: String, enum: ['CLIENT', 'FREELANCER'], required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, default: 0 },
  budget: { type: Number, default: 0 },
  deliveryDays: { type: Number, required: true },
  skills: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  attachments: { type: [String], default: [] },
  status: { type: String, enum: ['active', 'draft', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  projectId: { type: Schema.Types.ObjectId },
  serviceId: { type: Schema.Types.ObjectId },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  ownerWalletAddress: { type: String, default: '' },
  ownerUsername: { type: String, default: '' }
});

export const Listing = model<IListing>('Listing', ListingSchema);
