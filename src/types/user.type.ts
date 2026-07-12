import { Types } from "mongoose";

export interface UserModelType extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  googleId: string;
  authProvider: "google" | "local" | "hybrid";
  profilePicture: string;
  verified: boolean;
  phoneNumber: string;
  lastLogin: Date;
}
