import cloudinary from "../config/cloudinary";

export type UploadedImage = {
  url: string;
  publicId: string;
};

export const streamUpload = (
  buffer: Buffer,
  folder: string,
): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `bizmarket/${folder}`,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Cloudinary upload failed"));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });
};

export const deleteCloudinaryImage = async (
  publicId: string,
): Promise<void> => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
};
