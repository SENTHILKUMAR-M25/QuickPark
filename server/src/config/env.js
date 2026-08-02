import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const required = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isDev: (process.env.NODE_ENV || "development") !== "production",
  port: Number(process.env.PORT) || 5000,
  host: process.env.HOST || "0.0.0.0",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  apiUrl: process.env.API_URL || "http://localhost:5000/api/v1",

  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    refreshCookieName: process.env.JWT_REFRESH_COOKIE_NAME || "qp_refresh",
    refreshCookieSecure: process.env.REFRESH_COOKIE_SECURE === "true",
  },

  otp: {
    expiresMinutes: Number(process.env.OTP_EXPIRES_IN_MINUTES) || 10,
  },

  crypto: {
    secret: process.env.CRYPTO_SECRET || "insecure-fallback-secret",
  },

  mail: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== "false",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || "Quick Park <no-reply@quickpark.app>",
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || "quickpark",
  },

  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
  },

  upload: {
    maxBytes: Number(process.env.UPLOAD_MAX_BYTES) || 5 * 1024 * 1024,
  },
};