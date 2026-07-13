import { model, Schema } from "mongoose";
import { UserModelType } from "../../types/user.type";

const userSchema = new Schema<UserModelType>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must contain at least 2 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      toLowerCase: true,
    },
    password: {
      type: String,
      required: function (this) {
        return this.authProvider === "local"; // set required only for local signup
      },
      minlength: [6, "Password must be at least 6 characters long"],
    },
    profilePicture: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["google", "local", "hybrid"],
      required: true,
      default: "local",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true },
);

const USER_MODEL = model("User", userSchema);

export default USER_MODEL;
