import { model, Schema } from "mongoose";
import { UserModelType } from "../../types/user.type";

const userSchema = new Schema<UserModelType>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    default: null,
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
});

const USER_MODEL = model("user", userSchema);

export default USER_MODEL;
