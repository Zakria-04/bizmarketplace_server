import { Types } from "mongoose";

export interface UserModelType extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  authProvider: "google" | "local" | "hybrid";
  profilePicture: string;
  verified: boolean;
  phoneNumber: string;
  lastLogin: Date;
}
