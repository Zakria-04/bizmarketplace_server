import { Types, Document } from "mongoose";

export interface ListingModelType extends Document {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  title: string;
  description: string;
  tags: string[];
  images: {
    url: string;
    publicId: string;
  }[];
  location: {
    city: string;
    region: string;
  };
  links: {
    phone: string;
    website: string;
    whatsapp: string;
  };
  primaryCta: "website" | "whatsapp" | "phone" | "instagram" | "facebook";
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  rejectionReason?: string;
  sponsored: boolean;
}
