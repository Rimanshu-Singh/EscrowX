import { Schema, model, Document } from 'mongoose';

export interface IListingApplication extends Document {
  listing: Schema.Types.ObjectId;
  freelancer: Schema.Types.ObjectId;
  coverLetter: string;
  portfolioUrl?: string;
  expectedDeliveryTime: number; // in days
  bidAmount: number;
  previousExperience?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  createdAt: Date;
}

const ListingApplicationSchema = new Schema<IListingApplication>({
  listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  freelancer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  portfolioUrl: { type: String, default: '' },
  expectedDeliveryTime: { type: Number, required: true },
  bidAmount: { type: Number, required: true },
  previousExperience: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'], 
    default: 'PENDING' 
  },
  createdAt: { type: Date, default: Date.now },
});

export const ListingApplication = model<IListingApplication>('ListingApplication', ListingApplicationSchema, 'applications');
