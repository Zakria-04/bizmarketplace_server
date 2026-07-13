import { model, Schema } from "mongoose";
import { ListingModelType } from "../../types/listing.type";

const listingImageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
});

const listingSchema = new Schema<ListingModelType>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1500, "Description cannot exceed 1500 characters"],
    },

    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one tag is required",
      },
    },

    images: {
      type: [listingImageSchema],
      default: [],
    },

    location: {
      city: {
        type: String,
        trim: true,
      },
      region: {
        type: String,
        trim: true,
      },
    },

    links: {
      phone: {
        type: String,
        trim: true,
      },
      whatsapp: {
        type: String,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
    },

    primaryCta: {
      type: String,
      enum: ["website", "whatsapp", "phone", "instagram", "facebook"],
      required: true,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    sponsored: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Listing_MODEL = model("Listing", listingSchema);

export default Listing_MODEL;
