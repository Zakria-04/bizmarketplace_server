import mongoose, { model } from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

// Automatically delete expired documents after the specified time
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const REFRESH_TOKEN_MODEL = model("RefreshToken", refreshTokenSchema);
export default REFRESH_TOKEN_MODEL;
