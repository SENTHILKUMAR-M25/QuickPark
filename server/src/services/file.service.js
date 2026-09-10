import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import cloudinary from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const DOC_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `${randomUUID()}${ext}`);
  },
});

function fileFilter(allowed) {
  return (req, file, cb) => {
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new ApiError(415, "Unsupported file type."));
  };
}

const limits = { fileSize: env.upload.maxBytes };

export const uploadSingle = {
  image: multer({
    storage,
    limits,
    fileFilter: fileFilter(IMAGE_TYPES),
  }).single("image"),
  profile: multer({
    storage,
    limits,
    fileFilter: fileFilter(IMAGE_TYPES),
  }).single("profilePhoto"),
};

export const uploadProviderDocs = multer({
  storage,
  limits,
  fileFilter: fileFilter([...IMAGE_TYPES, ...DOC_TYPES]),
}).fields([
  { name: "governmentId", maxCount: 1 },
  { name: "businessLicense", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
]);

export const uploadParkingImages = multer({
  storage,
  limits,
  fileFilter: fileFilter(IMAGE_TYPES),
}).fields([
  { name: "files", maxCount: 10 },
  { name: "propertyProof", maxCount: 1 },
  { name: "parkingLicense", maxCount: 1 },
]);

const folder = env.cloudinary.folder || "quickpark";

/** Upload a single local file buffer/path to Cloudinary. */
export async function uploadToCloudinary(filePath, options = {}) {
  if (!env.cloudinary.cloudName) {
    logger.warn("Cloudinary not configured; returning local path.", filePath);
    return filePath;
  }
  const res = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "auto",
    ...options,
  });
  return res.secure_url;
}

export async function destroyCloudinary(url) {
  if (!url || !env.cloudinary.cloudName) return;
  const publicId = extractPublicId(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    logger.warn("Cloudinary destroy failed", e.message);
  }
}

function extractPublicId(url) {
  const match = String(url).match(/\/v\d+\/(.+)\.(jpg|jpeg|png|webp|gif|pdf)$/);
  return match ? `${folder}/${match[1]}` : null;
}

export default {
  uploadSingle,
  uploadProviderDocs,
  uploadParkingImages,
  uploadToCloudinary,
  destroyCloudinary,
};